-- Migration: create_rmm_registry_approve_rpc
-- Description: Registry workflow RPC - Tier 1 approval
-- Date: 2026-01-15
-- Author: Maya
-- Phase: 1.1.2
-- Task: 1.1.2.8

BEGIN;

CREATE OR REPLACE FUNCTION rmm_approve_registry_submission(
  p_submission_id uuid,
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
  v_company_id uuid;
  v_row registry_submissions;
  v_old jsonb;
  v_from text;
  v_to text := 'tier1_approved';
  v_is_moh boolean;
BEGIN
  IF v_actor IS NULL THEN
    RETURN rmm_error('AUTHENTICATION_ERROR', 'Authentication required');
  END IF;

  SELECT role, company_id INTO v_role, v_company_id FROM users WHERE id = v_actor;
  IF v_company_id IS NOT NULL OR v_role NOT IN ('tier1','system_admin') THEN
    RETURN rmm_error('AUTHORIZATION_ERROR', 'Tier 1 permission required');
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

  v_old := to_jsonb(v_row);

  UPDATE registry_submissions
  SET status = v_to,
      approved_by = v_actor,
      approved_at = now(),
      updated_at = now()
  WHERE id = p_submission_id;

  INSERT INTO approvals (submission_id, submission_type, from_status, to_status, approver_id, approval_type, comments)
  VALUES (p_submission_id, 'registry', v_from, v_to, v_actor, 'approve', rmm_sanitize_text(p_comments, 2000));

  PERFORM shared_create_audit_log(
    v_actor,
    'approve',
    'registry_submissions',
    p_submission_id,
    v_old,
    to_jsonb((SELECT rs FROM registry_submissions rs WHERE rs.id = p_submission_id)),
    NULL,
    NULL,
    NULL
  );

  RETURN jsonb_build_object('success', true, 'data', jsonb_build_object('id', p_submission_id, 'status', v_to));
EXCEPTION
  WHEN others THEN
    RETURN rmm_error('SYSTEM_ERROR', 'An unexpected error occurred');
END;
$$;

COMMIT;

