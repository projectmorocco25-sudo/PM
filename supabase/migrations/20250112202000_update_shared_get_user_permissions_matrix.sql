-- Migration: update_shared_get_user_permissions_matrix
-- Description: Expand shared_get_user_permissions to cover full approvals-authority-matrix.md (system config + audit/reporting + leaderboard)
-- Date: 2025-01-12
-- Author: Rafi
-- Phase: 1.1.1
-- Task: 1.1.1.4a1 (permission matrix verification alignment)
-- Depends on: 20250112180000_create_shared_rpc_functions

BEGIN;

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
  SELECT role, company_id INTO v_user_role, v_company_id
  FROM users
  WHERE id = p_user_id;

  IF v_user_role IS NULL THEN
    RAISE EXCEPTION 'User not found';
  END IF;

  /*
    Note: Permission values are normalized tokens aligned to approvals-authority-matrix.md semantics.
    Where the matrix uses parentheticals (e.g., "Verify (conditional)"), we represent as "verify_conditional".
  */

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
          'submit_aams', 'approve_threshold',
          'submit_msq', 'no_access',
          'submit_wsl', 'review_actions',
          'correct_msq', 'no_access',
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
          'submit_export_request', 'no_access',
          'approve_export', 'full_authority',
          'auto_approve_export', 'system_conditional',
          'intervene_export', 'full_authority',
          'report_export_completion', 'no_access',
          'cancel_export', 'approve'
        ),
        'compliance', jsonb_build_object(
          'view_own_score', 'view_all',
          'view_leaderboard', 'view',
          'dispute_score', 'final_decision',
          'override_score', 'full_authority',
          'generate_reports', 'approve',
          'view_reports', 'view_all'
        ),
        'system_config', jsonb_build_object(
          'configure_thresholds', 'full_authority',
          'modify_threshold_permanent', 'full_authority',
          'modify_threshold_temporary', 'full_authority',
          'confirm_threshold_reversion', 'full_authority',
          'manually_revert_threshold', 'full_authority',
          'view_pending_reversions', 'full_authority',
          'schedule_reversion_notifications', 'full_authority',
          'configure_multipliers', 'full_authority',
          'configure_component_weights', 'full_authority',
          'activate_modules', 'full_authority',
          'configure_intervention_windows', 'full_authority'
        ),
        'audit_reporting', jsonb_build_object(
          'view_audit_logs', 'view_all',
          'generate_audit_reports', 'generate',
          'view_audit_reports', 'view_all'
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
          'manage_atc_codes', 'full_authority',
          'designate_critical_medicines', 'no_access'
        ),
        'submissions', jsonb_build_object(
          'submit_aams', 'verify',
          'submit_msq', 'review_anomalies',
          'submit_wsl', 'analyze_compliance_violations',
          'correct_msq', 'no_access',
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
          'submit_export_request', 'no_access',
          'approve_export', 'verify_conditional',
          'auto_approve_export', 'no_access',
          'intervene_export', 'flag_for_intervention',
          'report_export_completion', 'verify',
          'cancel_export', 'no_access'
        ),
        'compliance', jsonb_build_object(
          'view_own_score', 'view_all',
          'view_leaderboard', 'view',
          'dispute_score', 'review',
          'override_score', 'no_access',
          'generate_reports', 'review',
          'view_reports', 'view_all'
        ),
        'system_config', jsonb_build_object(
          'configure_thresholds', 'suggest',
          'modify_threshold_permanent', 'no_access',
          'modify_threshold_temporary', 'no_access',
          'confirm_threshold_reversion', 'no_access',
          'manually_revert_threshold', 'no_access',
          'view_pending_reversions', 'read_only',
          'schedule_reversion_notifications', 'no_access',
          'configure_multipliers', 'suggest',
          'configure_component_weights', 'no_access',
          'activate_modules', 'no_access',
          'configure_intervention_windows', 'no_access'
        ),
        'audit_reporting', jsonb_build_object(
          'view_audit_logs', 'view_all',
          'generate_audit_reports', 'generate',
          'view_audit_reports', 'view_all'
        )
      )

      WHEN 'tier2_registrar' THEN jsonb_build_object(
        'registry', jsonb_build_object(
          'create_company', 'no_access',
          'update_company', 'implement',
          'delete_company', 'no_access',
          'create_product', 'no_access',
          'update_product', 'implement',
          'delete_product', 'no_access',
          'create_sku', 'no_access',
          'update_sku', 'implement',
          'delete_sku', 'implement',
          'manage_atc_codes', 'no_access',
          'designate_critical_medicines', 'no_access'
        ),
        'submissions', jsonb_build_object(
          'view_thresholds', 'view'
        ),
        'compliance', jsonb_build_object(
          'view_own_score', 'view_all',
          'view_leaderboard', 'view',
          'view_reports', 'view_all'
        ),
        'system_config', jsonb_build_object(
          'view_pending_reversions', 'no_access',
          'activate_modules', 'no_access'
        ),
        'audit_reporting', jsonb_build_object(
          'view_audit_logs', 'view_all',
          'generate_audit_reports', 'generate',
          'view_audit_reports', 'view_all'
        )
      )

      WHEN 'company_admin' THEN jsonb_build_object(
        'registry', jsonb_build_object(
          'create_company', 'submit',
          'update_company', 'submit',
          'delete_company', 'no_access',
          'create_product', 'submit',
          'update_product', 'submit',
          'delete_product', 'no_access',
          'create_sku', 'submit',
          'update_sku', 'submit',
          'delete_sku', 'submit',
          'manage_atc_codes', 'read_only',
          'designate_critical_medicines', 'no_access'
        ),
        'submissions', jsonb_build_object(
          'submit_aams', 'submit',
          'submit_msq', 'submit',
          'submit_wsl', 'submit',
          'correct_msq', 'submit',
          'view_thresholds', 'view'
        ),
        'export_control', jsonb_build_object(
          'submit_export_request', 'submit_ipc_only',
          'report_export_completion', 'submit',
          'cancel_export', 'submit'
        ),
        'compliance', jsonb_build_object(
          'view_own_score', 'view',
          'view_reports', 'view_own',
          'dispute_score', 'submit'
        ),
        'audit_reporting', jsonb_build_object(
          'view_audit_logs', 'view_own',
          'view_audit_reports', 'view_own'
        ),
        'system_config', jsonb_build_object(
          'activate_modules', 'no_access'
        )
      )

      WHEN 'company_manager' THEN jsonb_build_object(
        'registry', jsonb_build_object(
          'create_company', 'no_access',
          'update_company', 'no_access',
          'create_product', 'submit',
          'update_product', 'submit',
          'delete_product', 'no_access',
          'create_sku', 'submit',
          'update_sku', 'submit',
          'delete_sku', 'submit'
        ),
        'submissions', jsonb_build_object(
          'submit_aams', 'submit',
          'submit_msq', 'submit',
          'submit_wsl', 'submit',
          'correct_msq', 'submit',
          'view_thresholds', 'view'
        ),
        'export_control', jsonb_build_object(
          'submit_export_request', 'submit_ipc_only',
          'report_export_completion', 'submit',
          'cancel_export', 'submit'
        ),
        'compliance', jsonb_build_object(
          'view_own_score', 'view',
          'view_reports', 'view_own',
          'dispute_score', 'submit'
        ),
        'audit_reporting', jsonb_build_object(
          'view_audit_logs', 'view_own',
          'view_audit_reports', 'view_own'
        )
      )

      WHEN 'company_user' THEN jsonb_build_object(
        'registry', jsonb_build_object(
          'create_company', 'no_access',
          'update_company', 'no_access',
          'create_product', 'no_access',
          'update_product', 'no_access',
          'create_sku', 'submit',
          'update_sku', 'submit',
          'delete_sku', 'submit'
        ),
        'submissions', jsonb_build_object(
          'submit_aams', 'submit',
          'submit_msq', 'submit',
          'submit_wsl', 'submit',
          'correct_msq', 'submit',
          'view_thresholds', 'view'
        ),
        'export_control', jsonb_build_object(
          'submit_export_request', 'submit_ipc_only',
          'report_export_completion', 'submit',
          'cancel_export', 'submit'
        ),
        'compliance', jsonb_build_object(
          'view_own_score', 'view',
          'view_reports', 'view_own',
          'dispute_score', 'submit'
        ),
        'audit_reporting', jsonb_build_object(
          'view_audit_logs', 'view_own',
          'view_audit_reports', 'view_own'
        )
      )

      WHEN 'auditor' THEN jsonb_build_object(
        'registry', jsonb_build_object('view_all', 'read_only'),
        'submissions', jsonb_build_object('view_all', 'read_only'),
        'enforcement', jsonb_build_object('view_all', 'read_only'),
        'export_control', jsonb_build_object('view_all', 'read_only'),
        'compliance', jsonb_build_object(
          'view_own_score', 'read_only',
          'view_leaderboard', 'read_only',
          'view_reports', 'read_only'
        ),
        'system_config', jsonb_build_object('activate_modules', 'no_access'),
        'audit_reporting', jsonb_build_object(
          'view_audit_logs', 'view_all',
          'generate_audit_reports', 'generate',
          'view_audit_reports', 'view_all'
        )
      )

      WHEN 'system_admin' THEN jsonb_build_object(
        'system_config', jsonb_build_object(
          'activate_modules', 'technical_support'
        ),
        'audit_reporting', jsonb_build_object(
          'view_audit_logs', 'view_all',
          'generate_audit_reports', 'generate',
          'view_audit_reports', 'view_all'
        )
      )

      ELSE jsonb_build_object()
    END
  );

  RETURN v_permissions;
END;
$$;

COMMENT ON FUNCTION shared_get_user_permissions IS 'Get user permissions based on role (aligned to approvals-authority-matrix.md)';

COMMIT;

