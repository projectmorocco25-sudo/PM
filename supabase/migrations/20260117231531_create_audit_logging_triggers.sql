-- Migration: Create audit logging triggers
-- Description: Implement audit logging trigger function (hash chaining logic, previous_hash calculation, current_hash generation)
-- Date: 2026-01-17
-- Task: 1.1.1.5a
-- Author: Sami (Implementation Compliance Specialist)

BEGIN;

-- ============================================
-- Audit Hash Calculation Function
-- ============================================

/**
 * Function: calculate_audit_hash
 * 
 * Purpose: Calculate hash for audit log entry (hash chaining)
 * 
 * Algorithm: SHA-256(previous_hash + entry_data)
 * 
 * Parameters:
 *   - previous_hash (text): Hash of previous audit log entry (NULL for first entry)
 *   - entry_data (jsonb): Current entry data (table_name, record_id, operation_type, etc.)
 * 
 * Returns: text - SHA-256 hash (hex encoded)
 * 
 * Business Rules:
 *   - First entry for a table has previous_hash = NULL
 *   - Subsequent entries include hash of previous entry
 *   - Hash ensures immutability (chain breaks if entry modified)
 */
CREATE OR REPLACE FUNCTION public.calculate_audit_hash(
  previous_hash text,
  entry_data jsonb
)
RETURNS text
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT encode(
    digest(
      COALESCE(previous_hash, '') || entry_data::text,
      'sha256'
    ),
    'hex'
  );
$$;

COMMENT ON FUNCTION public.calculate_audit_hash(text, jsonb) IS 'Calculate hash for audit log entry - Implements hash chaining for immutability per audit-logging-spec.md';

-- ============================================
-- Audit Trigger Function
-- ============================================

/**
 * Function: audit_trigger_function
 * 
 * Purpose: Trigger function for automatic audit logging on table changes
 * 
 * Module: shared (audit)
 * Security: SECURITY DEFINER
 * 
 * This function is called automatically by triggers on audited tables
 * when INSERT, UPDATE, or DELETE operations occur.
 * 
 * Business Rules:
 *   - Calculates previous_hash from most recent audit log entry for the same table
 *   - Generates current_hash using SHA-256(previous_hash + entry_data)
 *   - Stores both previous_hash and current_hash in audit_logs entry
 *   - First entry for a table has previous_hash = NULL
 * 
 * Hash Chaining:
 *   - Each audit log entry includes hash of previous entry
 *   - Hash calculated from: previous_hash + current_entry_data
 *   - If any entry is modified, its hash changes, breaking the chain
 */
CREATE OR REPLACE FUNCTION public.audit_trigger_function()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  previous_hash text;
  entry_data jsonb;
  current_hash text;
  operation_type text;
  record_id uuid;
  old_values jsonb;
  new_values jsonb;
  table_name text;
  user_id uuid;
BEGIN
  -- Get table name from trigger
  table_name := TG_TABLE_NAME;
  
  -- Determine operation type
  IF TG_OP = 'INSERT' THEN
    operation_type := 'INSERT';
    record_id := NEW.id;
    old_values := NULL;
    new_values := to_jsonb(NEW);
  ELSIF TG_OP = 'UPDATE' THEN
    operation_type := 'UPDATE';
    record_id := NEW.id;
    old_values := to_jsonb(OLD);
    new_values := to_jsonb(NEW);
  ELSIF TG_OP = 'DELETE' THEN
    operation_type := 'DELETE';
    record_id := OLD.id;
    old_values := to_jsonb(OLD);
    new_values := NULL;
  ELSE
    RAISE EXCEPTION 'Unknown trigger operation: %', TG_OP;
  END IF;
  
  -- Get current user ID
  -- For system operations (service role), user_id will be NULL
  user_id := auth.uid();
  
  -- Get previous hash (most recent entry for this table)
  SELECT current_hash INTO previous_hash
  FROM public.audit_logs
  WHERE table_name = audit_trigger_function.table_name
  ORDER BY created_at DESC
  LIMIT 1;
  
  -- Build entry data for hash calculation
  entry_data := jsonb_build_object(
    'table_name', table_name,
    'record_id', record_id,
    'operation_type', operation_type,
    'old_values', old_values,
    'new_values', new_values,
    'user_id', user_id,
    'timestamp', extract(epoch from now())
  );
  
  -- Calculate current hash: SHA-256(previous_hash + entry_data)
  -- Using NULL for previous_hash if this is the first entry for this table
  current_hash := public.calculate_audit_hash(previous_hash, entry_data);
  
  -- Insert audit log entry
  INSERT INTO public.audit_logs (
    previous_hash,
    current_hash,
    user_id,
    operation_type,
    table_name,
    record_id,
    old_values,
    new_values,
    created_at
  ) VALUES (
    previous_hash,
    current_hash,
    user_id,
    operation_type,
    table_name,
    record_id,
    old_values,
    new_values,
    now()
  );
  
  -- Return appropriate record based on operation
  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$;

COMMENT ON FUNCTION public.audit_trigger_function() IS 'Trigger function for automatic audit logging - Implements hash chaining for immutability per audit-logging-spec.md';

COMMIT;
