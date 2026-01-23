-- Migration: create_audit_logging_trigger_infrastructure
-- Description: Create audit logging trigger function and infrastructure
-- Date: 2026-01-22
-- Task: 1.1.1.6
-- Author: Sami (Implementation Compliance Specialist)
-- Dependencies: Task 1.1.1.2 (audit_logs table must exist), All RLS policies must be implemented (Tasks 1.1.1.4, 1.1.1.5, 1.1.1.8, 1.1.1.8a)
-- ⚠️ CRITICAL: This must come AFTER all RLS policies are implemented to properly audit policy-enforced actions

BEGIN;

-- ============================================================================
-- Enable pgcrypto extension for digest function
-- ============================================================================
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ============================================================================
-- Helper function: Calculate SHA-256 hash of audit log entry
-- Purpose: Generate hash for hash chaining (immutability)
-- Based on: audit-logging-spec.md
-- ============================================================================

CREATE OR REPLACE FUNCTION calculate_audit_hash(
    previous_hash text,
    entry_data jsonb
)
RETURNS text
LANGUAGE sql
IMMUTABLE
AS $$
    SELECT encode(
        extensions.digest(
            COALESCE(previous_hash, '') || entry_data::text,
            'sha256'
        ),
        'hex'
    );
$$;

-- ============================================================================
-- RPC Function: create_audit_log()
-- Purpose: Create audit log entry with hash chaining
-- Based on: audit-logging-spec.md
-- ============================================================================

CREATE OR REPLACE FUNCTION create_audit_log(
    p_user_id uuid,
    p_operation_type text,
    p_table_name text,
    p_record_id uuid,
    p_old_values jsonb DEFAULT NULL,
    p_new_values jsonb DEFAULT NULL,
    p_reason text DEFAULT NULL,
    p_ip_address inet DEFAULT NULL,
    p_user_agent text DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_previous_hash text;
    v_entry_data jsonb;
    v_current_hash text;
    v_audit_log_id uuid;
BEGIN
    -- Get previous hash (from last audit log entry)
    SELECT current_hash INTO v_previous_hash
    FROM audit_logs
    ORDER BY created_at DESC
    LIMIT 1;
    
    -- Build entry data
    v_entry_data := jsonb_build_object(
        'user_id', p_user_id,
        'operation_type', p_operation_type,
        'table_name', p_table_name,
        'record_id', p_record_id,
        'old_values', p_old_values,
        'new_values', p_new_values,
        'reason', p_reason,
        'ip_address', p_ip_address,
        'user_agent', p_user_agent,
        'timestamp', now()
    );
    
    -- Calculate hash
    v_current_hash := calculate_audit_hash(v_previous_hash, v_entry_data);
    
    -- Insert audit log entry
    INSERT INTO audit_logs (
        previous_hash,
        current_hash,
        user_id,
        operation_type,
        table_name,
        record_id,
        old_values,
        new_values,
        reason,
        ip_address,
        user_agent
    ) VALUES (
        v_previous_hash,
        v_current_hash,
        p_user_id,
        p_operation_type,
        p_table_name,
        p_record_id,
        p_old_values,
        p_new_values,
        p_reason,
        p_ip_address,
        p_user_agent
    ) RETURNING id INTO v_audit_log_id;
    
    RETURN v_audit_log_id;
END;
$$;

-- ============================================================================
-- Main audit logging trigger function
-- Purpose: Automatically log all INSERT, UPDATE, DELETE operations to audit_logs table
-- Based on: audit-logging-spec.md
-- ============================================================================

CREATE OR REPLACE FUNCTION audit_trigger_function()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        PERFORM create_audit_log(
            auth.uid(),
            'create',
            TG_TABLE_NAME,
            NEW.id,
            NULL,
            row_to_json(NEW)::jsonb,
            NULL,
            NULL,
            NULL
        );
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        PERFORM create_audit_log(
            auth.uid(),
            'update',
            TG_TABLE_NAME,
            NEW.id,
            row_to_json(OLD)::jsonb,
            row_to_json(NEW)::jsonb,
            NULL,
            NULL,
            NULL
        );
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        PERFORM create_audit_log(
            auth.uid(),
            'delete',
            TG_TABLE_NAME,
            OLD.id,
            row_to_json(OLD)::jsonb,
            NULL,
            NULL,
            NULL,
            NULL
        );
        RETURN OLD;
    END IF;
    
    RETURN NULL;
END;
$$;

-- ============================================================================
-- Helper function: Create audit trigger on a table
-- Purpose: Convenience function to add audit triggers to tables
-- Usage: SELECT create_audit_trigger('table_name');
-- ============================================================================

CREATE OR REPLACE FUNCTION create_audit_trigger(p_table_name text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_trigger_name text;
BEGIN
    v_trigger_name := 'audit_trigger_' || p_table_name;

    -- Drop trigger if it exists
    EXECUTE format('DROP TRIGGER IF EXISTS %I ON %I', v_trigger_name, p_table_name);

    -- Create trigger
    EXECUTE format('
        CREATE TRIGGER %I
        AFTER INSERT OR UPDATE OR DELETE
        ON %I
        FOR EACH ROW
        EXECUTE FUNCTION audit_trigger_function()',
        v_trigger_name, p_table_name
    );
END;
$$;

-- ============================================================================
-- Create audit triggers on all core tables
-- Note: Only create triggers on tables that should be audited
-- Exclude: audit_logs (to prevent infinite recursion), system_config (optional)
-- ============================================================================

-- Core tables
SELECT create_audit_trigger('users');
SELECT create_audit_trigger('notifications');
SELECT create_audit_trigger('approvals');
SELECT create_audit_trigger('approval_history');

-- Communications tables
SELECT create_audit_trigger('conversations');
SELECT create_audit_trigger('messages');

-- RMM tables
SELECT create_audit_trigger('companies');
SELECT create_audit_trigger('products');
SELECT create_audit_trigger('skus');
SELECT create_audit_trigger('atc_codes');
SELECT create_audit_trigger('critical_medicines');
SELECT create_audit_trigger('registry_submissions');

-- Enforcement tables
SELECT create_audit_trigger('enforcement_actions');
SELECT create_audit_trigger('enforcement_action_appeals');

-- Note: audit_logs table is NOT audited (to prevent infinite recursion)
-- Note: system_config table auditing is optional (can be added if needed)

COMMIT;
