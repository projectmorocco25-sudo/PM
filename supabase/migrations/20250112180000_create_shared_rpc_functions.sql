-- Migration: create_shared_rpc_functions
-- Description: Create shared RPC functions (shared_get_user_permissions, shared_check_module_active, shared_create_audit_log, shared_create_notification)
-- Date: 2025-01-12
-- Author: Rafi, Nadia
-- Phase: 1.1.1
-- Task: 1.1.1.4a-4d
-- Related: approvals-authority-matrix.md, rls-policy-framework.md, audit-logging-spec.md
-- Depends on: 20250112150000_add_rls_policies_core_tables

BEGIN;

-- ============================================
-- TASK 1.1.1.4a: shared_get_user_permissions
-- ============================================

CREATE OR REPLACE FUNCTION shared_get_user_permissions(
  p_user_id uuid DEFAULT auth.uid()
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_role text;
  v_company_id uuid;
  v_permissions jsonb;
BEGIN
  -- Get user role and company_id
  SELECT role, company_id INTO v_user_role, v_company_id
  FROM users
  WHERE id = p_user_id;

  IF v_user_role IS NULL THEN
    RAISE EXCEPTION 'User not found';
  END IF;

  -- Build permissions based on role
  -- Reference: approvals-authority-matrix.md
  v_permissions := jsonb_build_object(
    'user_id', p_user_id,
    'role', v_user_role,
    'company_id', v_company_id,
    'is_moh', v_company_id IS NULL,
    'permissions', CASE v_user_role
      WHEN 'tier1' THEN jsonb_build_object(
        'registry', jsonb_build_object(
          'create_company', 'approve',
          'update_company', 'approve',
          'delete_company', 'approve',
          'create_product', 'approve',
          'update_product', 'approve',
          'delete_product', 'approve',
          'create_sku', 'approve',
          'update_sku', 'approve',
          'delete_sku', 'approve',
          'manage_atc_codes', 'full_authority',
          'designate_critical_medicines', 'full_authority'
        ),
        'submissions', jsonb_build_object(
          'submit_aams', 'approve',
          'submit_msq', 'no_access',
          'submit_wsl', 'review_actions',
          'view_thresholds', 'configure'
        ),
        'enforcement', jsonb_build_object(
          'create_warning', 'full_authority',
          'create_fine', 'approve',
          'create_suspension', 'approve',
          'approve_enforcement', 'approve_all',
          'execute_enforcement', 'execute_all'
        ),
        'export_control', jsonb_build_object(
          'approve_export', 'full_authority',
          'intervene_export', 'full_authority',
          'cancel_export', 'approve'
        ),
        'compliance', jsonb_build_object(
          'view_scores', 'view_all',
          'override_score', 'full_authority',
          'generate_reports', 'approve'
        ),
        'system', jsonb_build_object(
          'activate_modules', 'full_authority',
          'configure_thresholds', 'full_authority'
        )
      )
      WHEN 'tier2_officer' THEN jsonb_build_object(
        'registry', jsonb_build_object(
          'create_company', 'verify',
          'update_company', 'verify',
          'delete_company', 'no_access',
          'create_product', 'verify',
          'update_product', 'verify',
          'delete_product', 'no_access',
          'create_sku', 'verify',
          'update_sku', 'verify',
          'delete_sku', 'verify',
          'manage_atc_codes', 'full_authority'
        ),
        'submissions', jsonb_build_object(
          'submit_aams', 'verify',
          'submit_msq', 'review_anomalies',
          'submit_wsl', 'analyze_compliance_violations',
          'view_thresholds', 'view'
        ),
        'enforcement', jsonb_build_object(
          'create_warning', 'full_authority',
          'create_fine', 'submit',
          'create_suspension', 'submit',
          'approve_enforcement', 'approve_warnings',
          'execute_enforcement', 'execute_warnings'
        ),
        'export_control', jsonb_build_object(
          'approve_export', 'verify_conditional',
          'intervene_export', 'flag_for_intervention'
        ),
        'compliance', jsonb_build_object(
          'view_scores', 'view_all',
          'dispute_score', 'review'
        )
      )
      WHEN 'tier2_registrar' THEN jsonb_build_object(
        'registry', jsonb_build_object(
          'update_company', 'implement',
          'update_product', 'implement',
          'update_sku', 'implement',
          'delete_sku', 'implement'
        ),
        'submissions', jsonb_build_object(
          'view_thresholds', 'view'
        ),
        'compliance', jsonb_build_object(
          'view_scores', 'view_all'
        )
      )
      WHEN 'company_admin' THEN jsonb_build_object(
        'registry', jsonb_build_object(
          'create_company', 'submit',
          'update_company', 'submit',
          'create_product', 'submit',
          'update_product', 'submit',
          'create_sku', 'submit',
          'update_sku', 'submit',
          'delete_sku', 'submit'
        ),
        'submissions', jsonb_build_object(
          'submit_aams', 'submit',
          'submit_msq', 'submit',
          'submit_wsl', 'submit',
          'view_thresholds', 'view'
        ),
        'export_control', jsonb_build_object(
          'submit_export_request', 'submit',
          'report_export_completion', 'submit',
          'cancel_export', 'submit'
        ),
        'compliance', jsonb_build_object(
          'view_scores', 'view',
          'dispute_score', 'submit'
        )
      )
      WHEN 'company_manager' THEN jsonb_build_object(
        'registry', jsonb_build_object(
          'create_product', 'submit',
          'update_product', 'submit',
          'create_sku', 'submit',
          'update_sku', 'submit',
          'delete_sku', 'submit'
        ),
        'submissions', jsonb_build_object(
          'submit_aams', 'submit',
          'submit_msq', 'submit',
          'submit_wsl', 'submit',
          'view_thresholds', 'view'
        ),
        'export_control', jsonb_build_object(
          'submit_export_request', 'submit',
          'report_export_completion', 'submit',
          'cancel_export', 'submit'
        ),
        'compliance', jsonb_build_object(
          'view_scores', 'view',
          'dispute_score', 'submit'
        )
      )
      WHEN 'company_user' THEN jsonb_build_object(
        'registry', jsonb_build_object(
          'create_sku', 'submit',
          'update_sku', 'submit',
          'delete_sku', 'submit'
        ),
        'submissions', jsonb_build_object(
          'submit_aams', 'submit',
          'submit_msq', 'submit',
          'submit_wsl', 'submit',
          'view_thresholds', 'view'
        ),
        'export_control', jsonb_build_object(
          'submit_export_request', 'submit',
          'report_export_completion', 'submit',
          'cancel_export', 'submit'
        ),
        'compliance', jsonb_build_object(
          'view_scores', 'view',
          'dispute_score', 'submit'
        )
      )
      WHEN 'auditor' THEN jsonb_build_object(
        'registry', jsonb_build_object(
          'view_all', 'read_only'
        ),
        'submissions', jsonb_build_object(
          'view_all', 'read_only'
        ),
        'enforcement', jsonb_build_object(
          'view_all', 'read_only'
        ),
        'export_control', jsonb_build_object(
          'view_all', 'read_only'
        ),
        'compliance', jsonb_build_object(
          'view_all', 'read_only'
        )
      )
      ELSE jsonb_build_object()  -- Unknown role
    END
  );

  RETURN v_permissions;
END;
$$;

COMMENT ON FUNCTION shared_get_user_permissions IS 'Get user permissions based on role (reference: approvals-authority-matrix.md)';

-- ============================================
-- TASK 1.1.1.4b: shared_check_module_active
-- ============================================

CREATE OR REPLACE FUNCTION shared_check_module_active(
  p_module_name text
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
DECLARE
  v_is_active boolean;
BEGIN
  -- Check if module is active
  SELECT is_active INTO v_is_active
  FROM system_config
  WHERE module_name = p_module_name;

  -- Return false if module not found or not active
  RETURN COALESCE(v_is_active, false);
END;
$$;

COMMENT ON FUNCTION shared_check_module_active IS 'Check if a module is active (with caching strategy)';

-- ============================================
-- TASK 1.1.1.4c: shared_create_audit_log
-- ============================================

CREATE OR REPLACE FUNCTION shared_create_audit_log(
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
  v_audit_log_id uuid;
  v_previous_hash text;
  v_current_hash text;
  v_hash_input text;
BEGIN
  -- Get previous hash (for hash chaining)
  SELECT current_hash INTO v_previous_hash
  FROM audit_logs
  ORDER BY created_at DESC
  LIMIT 1;

  -- Build hash input
  v_hash_input := COALESCE(v_previous_hash, '') || 
                  COALESCE(p_user_id::text, '') ||
                  p_operation_type ||
                  p_table_name ||
                  COALESCE(p_record_id::text, '') ||
                  COALESCE(p_old_values::text, '') ||
                  COALESCE(p_new_values::text, '') ||
                  COALESCE(p_reason, '') ||
                  COALESCE(p_ip_address::text, '') ||
                  COALESCE(p_user_agent, '') ||
                  now()::text;

  -- Generate current hash (using SHA256)
  v_current_hash := encode(digest(v_hash_input, 'sha256'), 'hex');

  -- Insert audit log
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

COMMENT ON FUNCTION shared_create_audit_log IS 'Create audit log entry with hash chaining';

-- ============================================
-- TASK 1.1.1.4d: shared_create_notification
-- ============================================

CREATE OR REPLACE FUNCTION shared_create_notification(
  p_user_id uuid,
  p_type text,
  p_title text,
  p_message text,
  p_link text DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_notification_id uuid;
BEGIN
  -- Insert notification
  INSERT INTO notifications (
    user_id,
    type,
    title,
    message,
    link
  ) VALUES (
    p_user_id,
    p_type,
    p_title,
    p_message,
    p_link
  ) RETURNING id INTO v_notification_id;

  RETURN v_notification_id;
END;
$$;

COMMENT ON FUNCTION shared_create_notification IS 'Create notification for a user';

-- Batch notification function
CREATE OR REPLACE FUNCTION shared_create_notifications_batch(
  p_notifications jsonb
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_notification jsonb;
  v_notification_id uuid;
  v_created_ids uuid[];
BEGIN
  -- Process each notification
  FOR v_notification IN SELECT * FROM jsonb_array_elements(p_notifications)
  LOOP
    SELECT shared_create_notification(
      (v_notification->>'user_id')::uuid,
      v_notification->>'type',
      v_notification->>'title',
      v_notification->>'message',
      v_notification->>'link'
    ) INTO v_notification_id;
    
    v_created_ids := array_append(v_created_ids, v_notification_id);
  END LOOP;

  RETURN jsonb_build_object(
    'success', true,
    'created_count', array_length(v_created_ids, 1),
    'notification_ids', v_created_ids
  );
END;
$$;

COMMENT ON FUNCTION shared_create_notifications_batch IS 'Create multiple notifications in batch';

COMMIT;

-- Rollback Migration
-- BEGIN;
-- 
-- DROP FUNCTION IF EXISTS shared_create_notifications_batch(jsonb);
-- DROP FUNCTION IF EXISTS shared_create_notification(uuid, text, text, text, text);
-- DROP FUNCTION IF EXISTS shared_create_audit_log(uuid, text, text, uuid, jsonb, jsonb, text, inet, text);
-- DROP FUNCTION IF EXISTS shared_check_module_active(text);
-- DROP FUNCTION IF EXISTS shared_get_user_permissions(uuid);
-- 
-- COMMIT;
