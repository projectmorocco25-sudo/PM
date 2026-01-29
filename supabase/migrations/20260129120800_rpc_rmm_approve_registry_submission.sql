-- Migration: RMM registry submission Tier 1 approval (Task 1.1.2.8)
-- Description: rmm_approve_registry_submission - Tier 1 approves submission (tier2_verified -> tier1_approved).
-- Tables: registry_submissions, approvals. No RLS UPDATE/INSERT for authenticated; RPC uses SECURITY DEFINER.
-- Depends on: 1.1.2.7 (Tier 2 verification), 1.1.1.4 (RLS core).
-- Date: 2026-01-29

BEGIN;

-- rmm_approve_registry_submission(p_submission_id uuid, p_comments text)
-- Tier 1 only. Submission must be in 'tier2_verified' status. Updates status, approved_by, approved_at; inserts approval record.
CREATE OR REPLACE FUNCTION public.rmm_approve_registry_submission(
  p_submission_id uuid,
  p_comments text DEFAULT NULL
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

  -- Tier 1 only (tier1)
  IF v_role <> 'tier1' THEN
    RETURN jsonb_build_object('error', 'forbidden', 'message', 'only Tier 1 can approve registry submissions');
  END IF;

  IF p_submission_id IS NULL THEN
    RETURN jsonb_build_object('error', 'validation_error', 'message', 'submission_id is required');
  END IF;

  -- Submission must exist and be in 'tier2_verified' status
  SELECT id, submission_type, status INTO r
  FROM public.registry_submissions
  WHERE id = p_submission_id;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('error', 'not_found', 'message', 'submission not found');
  END IF;
  IF r.status <> 'tier2_verified' THEN
    RETURN jsonb_build_object('error', 'invalid_status', 'message', 'submission must be in tier2_verified status to approve', 'current_status', r.status);
  END IF;

  UPDATE public.registry_submissions
  SET status = 'tier1_approved',
      approved_by = v_user_id,
      approved_at = now(),
      updated_at = now()
  WHERE id = p_submission_id;

  INSERT INTO public.approvals (submission_id, submission_type, from_status, to_status, approver_id, approval_type, comments)
  VALUES (p_submission_id, r.submission_type, 'tier2_verified', 'tier1_approved', v_user_id, 'approval', NULLIF(trim(p_comments), ''));

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

COMMENT ON FUNCTION public.rmm_approve_registry_submission(uuid, text)
  IS 'Tier 1 approves registry submission. tier2_verified -> tier1_approved. Creates approval record. Task 1.1.2.8.';

GRANT EXECUTE ON FUNCTION public.rmm_approve_registry_submission(uuid, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.rmm_approve_registry_submission(uuid, text) TO service_role;

COMMIT;
