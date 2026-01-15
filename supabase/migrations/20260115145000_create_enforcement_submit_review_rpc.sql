-- Migration: create_enforcement_submit_review_rpc
-- Description: RPC to submit enforcement action from draft → pending_review
-- Date: 2026-01-15
-- Author: Nadia
-- Phase: 1.1.2
-- Task: 1.1.2.31
-- Reference: enforcement-cycle-specification.md

BEGIN;

CREATE OR REPLACE FUNCTION enforcement_submit_for_review(
  p_enforcement_action_id uuid,
  p_review_notes text DEFAULT NULL
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
  IF v_company_id IS NOT NULL OR v_role NOT IN ('tier2_officer','tier2_registrar','tier1','system_admin') THEN
    RETURN rmm_error('AUTHORIZATION_ERROR', 'MOH permission required');
  END IF;

  SELECT * INTO v_action FROM enforcement_actions WHERE id = p_enforcement_action_id;
  IF NOT FOUND THEN
    RETURN rmm_error('NOT_FOUND', 'Enforcement action not found');
  END IF;

  IF v_action.status <> 'draft' THEN
    RETURN rmm_error('INVALID_STATUS_TRANSITION', 'Enforcement action must be in draft state');
  END IF;

  -- Validation: required fields
  IF v_action.action_type IS NULL OR v_action.violation_type IS NULL OR v_action.legal_basis IS NULL OR v_action.justification IS NULL THEN
    RETURN rmm_error('VALIDATION_ERROR', 'Validation failed', jsonb_build_array(
      jsonb_build_object('field','action_type','message','Action type is required','code','MISSING_REQUIRED_FIELD'),
      jsonb_build_object('field','violation_type','message','Violation type is required','code','MISSING_REQUIRED_FIELD'),
      jsonb_build_object('field','legal_basis','message','Legal basis is required','code','MISSING_REQUIRED_FIELD'),
      jsonb_build_object('field','justification','message','Justification is required (min 50 chars)','code','MISSING_REQUIRED_FIELD')
    ));
  END IF;

  IF length(v_action.justification) < 50 THEN
    RETURN rmm_error('VALIDATION_ERROR', 'Justification must be at least 50 characters');
  END IF;

  -- Fines require amount
  IF v_action.action_type = 'fine' AND (v_action.amount IS NULL OR v_action.amount <= 0) THEN
    RETURN rmm_error('VALIDATION_ERROR', 'Fine amount is required and must be positive');
  END IF;

  v_old := to_jsonb(v_action);

  UPDATE enforcement_actions
  SET status = 'pending_review',
      notes = COALESCE(rmm_sanitize_text(p_review_notes, 2000), notes),
      updated_at = now()
  WHERE id = p_enforcement_action_id;

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

  RETURN jsonb_build_object('success', true, 'data', jsonb_build_object('id', p_enforcement_action_id, 'status', 'pending_review'));
EXCEPTION
  WHEN others THEN
    RETURN rmm_error('SYSTEM_ERROR', 'An unexpected error occurred');
END;
$$;

COMMIT;
