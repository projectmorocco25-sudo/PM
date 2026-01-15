-- Migration: create_enforcement_execute_rpc
-- Description: RPC for Tier 1/Tier 2 to execute approved enforcement action (approved → executed)
-- Date: 2026-01-15
-- Author: Nadia
-- Phase: 1.1.2
-- Task: 1.1.2.34
-- Reference: enforcement-cycle-specification.md

BEGIN;

CREATE OR REPLACE FUNCTION enforcement_execute_action(
  p_enforcement_action_id uuid,
  p_execution_notes text DEFAULT NULL
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
BEGIN
  IF v_actor IS NULL THEN
    RETURN rmm_error('AUTHENTICATION_ERROR', 'Authentication required');
  END IF;

  SELECT role, company_id INTO v_role, v_company_id FROM users WHERE id = v_actor;
  IF v_company_id IS NOT NULL OR v_role NOT IN ('tier1','tier2_officer','tier2_registrar','system_admin') THEN
    RETURN rmm_error('AUTHORIZATION_ERROR', 'MOH permission required');
  END IF;

  SELECT * INTO v_action FROM enforcement_actions WHERE id = p_enforcement_action_id;
  IF NOT FOUND THEN
    RETURN rmm_error('NOT_FOUND', 'Enforcement action not found');
  END IF;

  IF v_action.status <> 'approved' THEN
    RETURN rmm_error('INVALID_STATUS_TRANSITION', 'Enforcement action must be approved before execution');
  END IF;

  v_old := to_jsonb(v_action);

  UPDATE enforcement_actions
  SET status = 'executed',
      executed_by = v_actor,
      executed_at = now(),
      execution_notes = COALESCE(rmm_sanitize_text(p_execution_notes, 2000), execution_notes),
      updated_at = now()
  WHERE id = p_enforcement_action_id;

  -- TODO (future): Update company compliance score
  -- TODO (future): Send notification to company about enforcement action execution + appeal window

  PERFORM shared_create_audit_log(
    v_actor,
    'update',
    'enforcement_actions',
    p_enforcement_action_id,
    v_old,
    to_jsonb((SELECT ea FROM enforcement_actions ea WHERE ea.id = p_enforcement_action_id)),
    NULL,
    NULL,
    NULL
  );

  RETURN jsonb_build_object('success', true, 'data', jsonb_build_object('id', p_enforcement_action_id, 'status', 'executed'));
EXCEPTION
  WHEN others THEN
    RETURN rmm_error('SYSTEM_ERROR', 'An unexpected error occurred');
END;
$$;

COMMIT;
