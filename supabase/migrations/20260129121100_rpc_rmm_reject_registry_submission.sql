-- Migration: RMM registry submission rejection (Task 1.1.2.11)
-- Description: rmm_reject_registry_submission - Tier 2 Officer or Tier 1 rejects submission (any eligible stage -> rejected).
-- Tables: registry_submissions, approvals. RPC uses SECURITY DEFINER.
-- Depends on: 1.1.2.7 (Tier 2 verification), 1.1.1.4 (RLS core).
-- Date: 2026-01-29

BEGIN;

CREATE OR REPLACE FUNCTION public.rmm_reject_registry_submission(
  p_submission_id uuid,
  p_rejection_reason text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid;
  v_role text;
  r record;
  v_reason text;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RETURN jsonb_build_object('error', 'unauthorized', 'message', 'not authenticated');
  END IF;

  SELECT role INTO v_role
  FROM public.users
  WHERE id = v_user_id AND is_active = true;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('error', 'user_not_found', 'message', 'user not found');
  END IF;

  -- Only Tier 2 Officer or Tier 1 can reject
  IF v_role NOT IN ('tier2_officer', 'tier1') THEN
    RETURN jsonb_build_object('error', 'forbidden', 'message', 'only Tier 2 Officer or Tier 1 can reject registry submissions');
  END IF;

  IF p_submission_id IS NULL THEN
    RETURN jsonb_build_object('error', 'validation_error', 'message', 'submission_id is required');
  END IF;

  v_reason := NULLIF(trim(p_rejection_reason), '');
  IF v_reason IS NULL OR length(v_reason) < 10 THEN
    RETURN jsonb_build_object('error', 'validation_error', 'message', 'rejection_reason is required and must be at least 10 characters');
  END IF;

  SELECT id, submission_type, status INTO r
  FROM public.registry_submissions
  WHERE id = p_submission_id;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('error', 'not_found', 'message', 'submission not found');
  END IF;
  IF r.status = 'rejected' OR r.status = 'completed' OR r.status = 'tier2_implemented' OR r.status = 'draft' THEN
    RETURN jsonb_build_object('error', 'invalid_status', 'message', 'submission cannot be rejected in current status', 'current_status', r.status);
  END IF;

  -- Tier 2 Officer: can reject from submitted or tier2_verified
  IF v_role = 'tier2_officer' AND r.status NOT IN ('submitted', 'tier2_verified') THEN
    RETURN jsonb_build_object('error', 'forbidden', 'message', 'Tier 2 Officer can only reject submissions in submitted or tier2_verified status', 'current_status', r.status);
  END IF;
  -- Tier 1: can reject from tier2_verified or tier1_approved
  IF v_role = 'tier1' AND r.status NOT IN ('tier2_verified', 'tier1_approved') THEN
    RETURN jsonb_build_object('error', 'forbidden', 'message', 'Tier 1 can only reject submissions in tier2_verified or tier1_approved status', 'current_status', r.status);
  END IF;

  UPDATE public.registry_submissions
  SET status = 'rejected',
      rejection_reason = v_reason,
      updated_at = now()
  WHERE id = p_submission_id;

  INSERT INTO public.approvals (submission_id, submission_type, from_status, to_status, approver_id, approval_type, comments)
  VALUES (p_submission_id, r.submission_type, r.status, 'rejected', v_user_id, 'rejection', v_reason);

  RETURN jsonb_build_object(
    'submission',
    (SELECT to_jsonb(s) FROM (
      SELECT id, submission_type, entity_type, entity_id, submission_data, status, submitted_by,
             verified_by, verified_at, approved_by, approved_at, implemented_by, implemented_at,
             rejection_reason, created_at, updated_at
      FROM public.registry_submissions
      WHERE id = p_submission_id
    ) s)
  );
END;
$$;

COMMENT ON FUNCTION public.rmm_reject_registry_submission(uuid, text)
  IS 'Tier 2 Officer or Tier 1 rejects registry submission. Eligible statuses: Tier 2 from submitted/tier2_verified; Tier 1 from tier2_verified/tier1_approved. Reason required (min 10 chars). Task 1.1.2.11.';

GRANT EXECUTE ON FUNCTION public.rmm_reject_registry_submission(uuid, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.rmm_reject_registry_submission(uuid, text) TO service_role;

COMMIT;
