-- Migration: create_enforcement_resolve_appeal_rpc
-- Description: RPC for Tier 1 to resolve appeal (appealed → resolved)
-- Date: 2026-01-15
-- Author: Nadia
-- Phase: 1.1.2
-- Task: 1.1.2.36
-- Reference: enforcement-cycle-specification.md

BEGIN;

CREATE OR REPLACE FUNCTION enforcement_resolve_appeal(
  p_appeal_id uuid,
  p_resolution text,
  p_resolution_notes text
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
  v_appeal enforcement_action_appeals;
  v_action enforcement_actions;
  v_old_appeal jsonb;
  v_old_action jsonb;
  v_resolution_status text;
BEGIN
  IF v_actor IS NULL THEN
    RETURN rmm_error('AUTHENTICATION_ERROR', 'Authentication required');
  END IF;

  SELECT role, company_id INTO v_role, v_company_id FROM users WHERE id = v_actor;
  IF v_company_id IS NOT NULL OR v_role NOT IN ('tier1','system_admin') THEN
    RETURN rmm_error('AUTHORIZATION_ERROR', 'Tier 1 permission required');
  END IF;

  IF p_resolution NOT IN ('upheld','upheld_with_adjustment','overturned') THEN
    RETURN rmm_error('VALIDATION_ERROR', 'Resolution must be upheld, upheld_with_adjustment, or overturned');
  END IF;

  IF p_resolution_notes IS NULL OR length(trim(p_resolution_notes)) < 50 THEN
    RETURN rmm_error('VALIDATION_ERROR', 'Resolution notes are required (min 50 chars)');
  END IF;

  SELECT * INTO v_appeal FROM enforcement_action_appeals WHERE id = p_appeal_id;
  IF NOT FOUND THEN
    RETURN rmm_error('NOT_FOUND', 'Appeal not found');
  END IF;

  IF v_appeal.status <> 'submitted' THEN
    RETURN rmm_error('INVALID_STATUS_TRANSITION', 'Appeal must be in submitted state');
  END IF;

  SELECT * INTO v_action FROM enforcement_actions WHERE id = v_appeal.enforcement_action_id;
  IF NOT FOUND THEN
    RETURN rmm_error('SYSTEM_ERROR', 'Enforcement action not found for appeal');
  END IF;

  IF v_action.status <> 'appealed' THEN
    RETURN rmm_error('INVALID_STATUS_TRANSITION', 'Enforcement action must be in appealed state');
  END IF;

  v_resolution_status := CASE 
    WHEN p_resolution = 'overturned' THEN 'rejected'
    ELSE 'upheld'
  END;

  v_old_appeal := to_jsonb(v_appeal);
  v_old_action := to_jsonb(v_action);

  -- Update appeal
  UPDATE enforcement_action_appeals
  SET status = v_resolution_status,
      reviewed_by_tier1 = v_actor,
      reviewed_at_tier1 = now(),
      resolution = rmm_sanitize_text(p_resolution_notes, 2000),
      resolved_by = v_actor,
      resolved_at = now(),
      updated_at = now()
  WHERE id = p_appeal_id;

  -- Update enforcement action
  UPDATE enforcement_actions
  SET status = 'resolved',
      resolution = p_resolution,
      resolved_by = v_actor,
      resolved_at = now(),
      updated_at = now()
  WHERE id = v_appeal.enforcement_action_id;

  -- TODO (future): If overturned, reverse compliance score impact
  -- TODO (future): Send notification to company about appeal decision

  PERFORM shared_create_audit_log(
    v_actor,
    'update',
    'enforcement_action_appeals',
    p_appeal_id,
    v_old_appeal,
    to_jsonb((SELECT eaa FROM enforcement_action_appeals eaa WHERE eaa.id = p_appeal_id)),
    NULL,
    NULL,
    NULL
  );

  PERFORM shared_create_audit_log(
    v_actor,
    'update',
    'enforcement_actions',
    v_appeal.enforcement_action_id,
    v_old_action,
    to_jsonb((SELECT ea FROM enforcement_actions ea WHERE ea.id = v_appeal.enforcement_action_id)),
    NULL,
    NULL,
    NULL
  );

  RETURN jsonb_build_object('success', true, 'data', jsonb_build_object('id', v_appeal.enforcement_action_id, 'appeal_id', p_appeal_id, 'status', 'resolved', 'resolution', p_resolution));
EXCEPTION
  WHEN others THEN
    RETURN rmm_error('SYSTEM_ERROR', 'An unexpected error occurred');
END;
$$;

COMMIT;
