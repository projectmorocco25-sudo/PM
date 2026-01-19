-- Migration: Create audit log hash verification function
-- Description: Implement audit log hash verification function (verify hash chain integrity, detect tampering)
-- Date: 2026-01-17
-- Task: 1.1.1.5c
-- Author: Sami (Implementation Compliance Specialist)

BEGIN;

-- ============================================
-- Audit Hash Verification Function
-- ============================================

/**
 * RPC Function: audit_verify_hash_chain
 * 
 * Purpose: Verify hash chain integrity and detect tampering
 * 
 * Module: shared (audit)
 * Security: SECURITY DEFINER
 * 
 * Parameters:
 *   - p_table_name (text): Table name to verify (nullable, if NULL verifies all tables)
 * 
 * Returns: jsonb - Verification results with integrity status and detected issues
 * 
 * Business Rules:
 *   - Verifies that each entry's previous_hash matches the previous entry's current_hash
 *   - Verifies that each entry's current_hash matches the calculated hash
 *   - Detects broken chains (tampering detected)
 *   - Returns detailed results for each table
 * 
 * Error Cases:
 *   - None - Returns verification results even if tampering detected
 */
CREATE OR REPLACE FUNCTION public.audit_verify_hash_chain(
  p_table_name text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
DECLARE
  verification_result jsonb;
  table_record RECORD;
  prev_entry RECORD;
  current_entry RECORD;
  calculated_hash text;
  table_results jsonb := '[]'::jsonb;
  table_result jsonb;
  total_entries bigint;
  broken_chains bigint;
  integrity_ok boolean;
BEGIN
  -- Initialize results
  verification_result := jsonb_build_object(
    'verified_at', now(),
    'table_name', p_table_name,
    'tables', '[]'::jsonb,
    'overall_integrity', true,
    'total_entries_checked', 0,
    'broken_chains_detected', 0
  );
  
  -- Get list of tables to verify
  FOR table_record IN
    SELECT DISTINCT table_name
    FROM public.audit_logs
    WHERE (p_table_name IS NULL OR table_name = p_table_name)
    ORDER BY table_name
  LOOP
    -- Initialize table result
    integrity_ok := true;
    total_entries := 0;
    broken_chains := 0;
    
    -- Get first entry for this table
    SELECT * INTO prev_entry
    FROM public.audit_logs
    WHERE table_name = table_record.table_name
    ORDER BY created_at ASC
    LIMIT 1;
    
    -- If no entries for this table, skip
    IF prev_entry IS NULL THEN
      CONTINUE;
    END IF;
    
    -- Verify first entry (previous_hash should be NULL)
    total_entries := 1;
    IF prev_entry.previous_hash IS NOT NULL THEN
      -- First entry should have previous_hash = NULL
      integrity_ok := false;
      broken_chains := broken_chains + 1;
    END IF;
    
    -- Verify current_hash for first entry
    calculated_hash := public.calculate_audit_hash(
      prev_entry.previous_hash,
      jsonb_build_object(
        'table_name', prev_entry.table_name,
        'record_id', prev_entry.record_id,
        'operation_type', prev_entry.operation_type,
        'old_values', prev_entry.old_values,
        'new_values', prev_entry.new_values,
        'user_id', prev_entry.user_id,
        'timestamp', extract(epoch from prev_entry.created_at)
      )
    );
    
    IF calculated_hash != prev_entry.current_hash THEN
      integrity_ok := false;
      broken_chains := broken_chains + 1;
    END IF;
    
    -- Verify subsequent entries
    FOR current_entry IN
      SELECT *
      FROM public.audit_logs
      WHERE table_name = table_record.table_name
        AND created_at > prev_entry.created_at
      ORDER BY created_at ASC
    LOOP
      total_entries := total_entries + 1;
      
      -- Verify previous_hash matches previous entry's current_hash
      IF current_entry.previous_hash != prev_entry.current_hash THEN
        integrity_ok := false;
        broken_chains := broken_chains + 1;
      END IF;
      
      -- Verify current_hash matches calculated hash
      calculated_hash := public.calculate_audit_hash(
        current_entry.previous_hash,
        jsonb_build_object(
          'table_name', current_entry.table_name,
          'record_id', current_entry.record_id,
          'operation_type', current_entry.operation_type,
          'old_values', current_entry.old_values,
          'new_values', current_entry.new_values,
          'user_id', current_entry.user_id,
          'timestamp', extract(epoch from current_entry.created_at)
        )
      );
      
      IF calculated_hash != current_entry.current_hash THEN
        integrity_ok := false;
        broken_chains := broken_chains + 1;
      END IF;
      
      -- Move to next entry
      prev_entry := current_entry;
    END LOOP;
    
    -- Build table result
    table_result := jsonb_build_object(
      'table_name', table_record.table_name,
      'integrity_ok', integrity_ok,
      'total_entries', total_entries,
      'broken_chains', broken_chains
    );
    
    -- Add to tables array
    table_results := table_results || jsonb_build_array(table_result);
    
    -- Update overall integrity
    IF NOT integrity_ok THEN
      verification_result := jsonb_set(verification_result, '{overall_integrity}', 'false'::jsonb);
    END IF;
    
    -- Update totals
    verification_result := jsonb_set(
      verification_result,
      '{total_entries_checked}',
      to_jsonb((verification_result->>'total_entries_checked')::bigint + total_entries)
    );
    
    verification_result := jsonb_set(
      verification_result,
      '{broken_chains_detected}',
      to_jsonb((verification_result->>'broken_chains_detected')::bigint + broken_chains)
    );
  END LOOP;
  
  -- Set tables array
  verification_result := jsonb_set(verification_result, '{tables}', table_results);
  
  RETURN verification_result;
END;
$$;

COMMENT ON FUNCTION public.audit_verify_hash_chain(text) IS 'Verify audit log hash chain integrity - Detects tampering by verifying hash chain per audit-logging-spec.md';

COMMIT;
