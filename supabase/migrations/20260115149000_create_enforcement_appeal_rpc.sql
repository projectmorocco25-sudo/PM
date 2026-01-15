-- Migration: create_enforcement_appeal_rpc
-- Description: RPC for company to submit appeal (executed → appealed)
-- Date: 2026-01-15
-- Author: Nadia
-- Phase: 1.1.2
-- Task: 1.1.2.35
-- Reference: enforcement-cycle-specification.md

BEGIN;

CREATE OR REPLACE FUNCTION enforcement_appeal_action(
  p_enforcement_action_id uuid,
  p_appeal_reason text,
  p_evidence jsonb DEFAULT NULL
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
  v_appeal_id uuid;
  v_appeal_deadline timestamptz;
BEGIN
  IF v_actor IS NULL THEN
    RETURN rmm_error('AUTHENTICATION_ERROR', 'Authentication required');
  END IF;

  SELECT role, company_id INTO v_role, v_company_id FROM users WHERE id = v_actor;
  IF v_company_id IS NULL THEN
    RETURN rmm_error('AUTHORIZATION_ERROR', 'Only company users can submit appeals');
  END IF;

  IF p_appeal_reason IS NULL OR length(trim(p_appeal_reason)) < 50 THEN
    RETURN rmm_error('VALIDATION_ERROR', 'Appeal reason is required (min 50 chars)');
  END IF;

  SELECT * INTO v_action FROM enforcement_actions WHERE id = p_enforcement_action_id;
  IF NOT FOUND THEN
    RETURN rmm_error('NOT_FOUND', 'Enforcement action not found');
  END IF;

  IF v_action.company_id <> v_company_id THEN
    RETURN rmm_error('AUTHORIZATION_ERROR', 'You can only appeal your own company enforcement actions');
  END IF;

  IF v_action.status <> 'executed' THEN
    RETURN rmm_error('INVALID_STATUS_TRANSITION', 'Only executed enforcement actions can be appealed');
  END IF;

  -- Check 30-day appeal window
  v_appeal_deadline := v_action.executed_at + interval '30 days';
  IF now() > v_appeal_deadline THEN
    RETURN rmm_error('BUSINESS_RULE_VIOLATION', 'Appeal window expired (30 days from execution)');
  END IF;

  -- Check for existing appeal
  PERFORM 1 FROM enforcement_action_appeals WHERE enforcement_action_id = p_enforcement_action_id;
  IF FOUND THEN
    RETURN rmm_error('BUSINESS_RULE_VIOLATION', 'An appeal already exists for this enforcement action');
  END IF;

  v_old := to_jsonb(v_action);

  -- Create appeal record
  INSERT INTO enforcement_action_appeals (
    enforcement_action_id,
    appeal_reason,
    evidence,
    submitted_by
  ) VALUES (
    p_enforcement_action_id,
    rmm_sanitize_text(p_appeal_reason, 4000),
    p_evidence,
    v_actor
  ) RETURNING id INTO v_appeal_id;

  -- Update enforcement action status
  UPDATE enforcement_actions
  SET status = 'appealed',
      updated_at = now()
  WHERE id = p_enforcement_action_id;

  -- TODO (future): Send notification to Tier 1 about appeal submission

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

  RETURN jsonb_build_object('success', true, 'data', jsonb_build_object('id', p_enforcement_action_id, 'appeal_id', v_appeal_id, 'status', 'appealed'));
EXCEPTION
  WHEN others THEN
    RETURN rmm_error('SYSTEM_ERROR', 'An unexpected error occurred');
END;
$$;

COMMIT;
