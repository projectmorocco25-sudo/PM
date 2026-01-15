-- Migration: create_enforcement_approve_rpc
-- Description: RPC for Tier 1 (or Tier 2 for warnings) to approve enforcement action (pending_approval → approved or draft)
-- Date: 2026-01-15
-- Author: Nadia
-- Phase: 1.1.2
-- Task: 1.1.2.33
-- Reference: enforcement-cycle-specification.md

BEGIN;

CREATE OR REPLACE FUNCTION enforcement_approve_action(
  p_enforcement_action_id uuid,
  p_approval_notes text,
  p_approved boolean DEFAULT true
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_actor uuid := auth.uid();
  v_role text;
  v_company_id uuid;
  v_action enforcement_actions;
  v_old jsonb;
  v_new_status text;
  v_can_approve boolean := false;
BEGIN
  IF v_actor IS NULL THEN
    RETURN rmm_error('AUTHENTICATION_ERROR', 'Authentication required');
  END IF;

  SELECT role, company_id INTO v_role, v_company_id FROM users WHERE id = v_actor;
  IF v_company_id IS NOT NULL THEN
    RETURN rmm_error('AUTHORIZATION_ERROR', 'MOH permission required');
  END IF;

  IF p_approval_notes IS NULL OR length(trim(p_approval_notes)) < 10 THEN
    RETURN rmm_error('VALIDATION_ERROR', 'Approval notes are required (min 10 chars)');
  END IF;

  SELECT * INTO v_action FROM enforcement_actions WHERE id = p_enforcement_action_id;
  IF NOT FOUND THEN
    RETURN rmm_error('NOT_FOUND', 'Enforcement action not found');
  END IF;

  IF v_action.status <> 'pending_approval' THEN
    RETURN rmm_error('INVALID_STATUS_TRANSITION', 'Enforcement action must be in pending_approval state');
  END IF;

  -- Authority check: Tier 1 can approve all, Tier 2 can independently approve warnings
  IF v_role IN ('tier1','system_admin') THEN
    v_can_approve := true;
  ELSIF v_role = 'tier2_officer' AND v_action.action_type = 'warning' THEN
    v_can_approve := true;
  END IF;

  IF NOT v_can_approve THEN
    RETURN rmm_error('AUTHORIZATION_ERROR', 'Insufficient permissions: Tier 1 required for fines/suspensions');
  END IF;

  v_new_status := CASE WHEN p_approved THEN 'approved' ELSE 'draft' END;
  v_old := to_jsonb(v_action);

  UPDATE enforcement_actions
  SET status = v_new_status,
      approved_by = v_actor,
      approved_at = now(),
      approval_notes = rmm_sanitize_text(p_approval_notes, 2000),
      updated_at = now()
  WHERE id = p_enforcement_action_id;

  PERFORM shared_create_audit_log(
    v_actor,
    'approve',
    'enforcement_actions',
    p_enforcement_action_id,
    v_old,
    to_jsonb((SELECT ea FROM enforcement_actions ea WHERE ea.id = p_enforcement_action_id)),
    NULL,
    NULL,
    NULL
  );

  RETURN jsonb_build_object('success', true, 'data', jsonb_build_object('id', p_enforcement_action_id, 'status', v_new_status));
EXCEPTION
  WHEN others THEN
    RETURN rmm_error('SYSTEM_ERROR', 'An unexpected error occurred');
END;
$$;

COMMIT;
