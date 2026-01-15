-- Migration: create_rmm_registry_reject_rpc
-- Description: Registry workflow RPC - rejection (+ feedback + iteration tracking)
-- Date: 2026-01-15
-- Author: Maya, Salim
-- Phase: 1.1.2
-- Tasks: 1.1.2.11, 1.1.2.11a, 1.1.2.11b

BEGIN;

CREATE OR REPLACE FUNCTION rmm_reject_registry_submission(
  p_submission_id uuid,
  p_rejection_reason text,
  p_comments text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_actor uuid := auth.uid();
  v_role text;
  v_actor_company uuid;
  v_row registry_submissions;
  v_old jsonb;
  v_from text;
  v_to text := 'rejected';
  v_is_moh boolean;
  v_next_iterations integer;
BEGIN
  IF v_actor IS NULL THEN
    RETURN rmm_error('AUTHENTICATION_ERROR', 'Authentication required');
  END IF;

  SELECT role, company_id INTO v_role, v_actor_company FROM users WHERE id = v_actor;
  IF v_actor_company IS NOT NULL OR v_role NOT IN ('tier1','tier2_officer','tier2_registrar','system_admin') THEN
    RETURN rmm_error('AUTHORIZATION_ERROR', 'MOH permission required');
  END IF;

  IF p_rejection_reason IS NULL OR length(trim(p_rejection_reason)) < 10 THEN
    RETURN rmm_error('VALIDATION_ERROR', 'Validation failed', jsonb_build_array(jsonb_build_object(
      'field', 'rejection_reason', 'message', 'Rejection reason is required (min 10 chars)', 'code', 'MISSING_REQUIRED_FIELD'
    )));
  END IF;

  SELECT * INTO v_row FROM registry_submissions WHERE id = p_submission_id;
  IF NOT FOUND THEN
    RETURN rmm_error('NOT_FOUND', 'Registry submission not found');
  END IF;

  v_is_moh := (v_row.company_id IS NULL);
  v_from := v_row.status;

  IF NOT rmm_registry_is_valid_transition(v_from, v_to, v_is_moh) THEN
    RETURN rmm_error('INVALID_STATUS_TRANSITION', 'Invalid status transition');
  END IF;

  -- Iteration tracking / limit (company submissions only)
  v_next_iterations := v_row.rejection_iterations;
  IF v_row.company_id IS NOT NULL THEN
    v_next_iterations := v_row.rejection_iterations + 1;

    -- Enforce: max 2 rejection iterations before Tier 1 must take direct action
    IF v_role IN ('tier1','system_admin') AND v_next_iterations > 2 THEN
      RETURN rmm_error(
        'BUSINESS_RULE_VIOLATION',
        'Rejection iteration limit reached (max 2). Tier 1 must take direct action.'
      );
    END IF;
  END IF;

  v_old := to_jsonb(v_row);

  UPDATE registry_submissions
  SET status = v_to,
      rejection_reason = rmm_sanitize_text(p_rejection_reason, 4000),
      rejection_iterations = v_next_iterations,
      updated_at = now()
  WHERE id = p_submission_id;

  INSERT INTO approvals (submission_id, submission_type, from_status, to_status, approver_id, approval_type, comments)
  VALUES (p_submission_id, 'registry', v_from, v_to, v_actor, 'reject', rmm_sanitize_text(p_comments, 2000));

  -- Feedback notification to submitter (company or MOH)
  PERFORM shared_create_notification(
    v_row.submitted_by,
    'submission_status',
    'Registry submission rejected',
    rmm_sanitize_text(p_rejection_reason, 500),
    '/rmm/registry-submissions/' || p_submission_id::text
  );

  PERFORM shared_create_audit_log(
    v_actor,
    'reject',
    'registry_submissions',
    p_submission_id,
    v_old,
    to_jsonb((SELECT rs FROM registry_submissions rs WHERE rs.id = p_submission_id)),
    NULL,
    NULL,
    NULL
  );

  RETURN jsonb_build_object(
    'success', true,
    'data', jsonb_build_object(
      'id', p_submission_id,
      'status', v_to,
      'rejection_iterations', v_next_iterations
    )
  );
EXCEPTION
  WHEN others THEN
    RETURN rmm_error('SYSTEM_ERROR', 'An unexpected error occurred');
END;
$$;

COMMIT;

