-- Migration: RMM registry submission Tier 2 verification (Task 1.1.2.7)
-- Description: rmm_verify_registry_submission - Tier 2 Officer verifies submission (submitted -> tier2_verified).
-- Tables: registry_submissions, approvals. No RLS UPDATE/INSERT for authenticated; RPC uses SECURITY DEFINER.
-- Depends on: 1.1.2.6 (create submission), 1.1.1.4 (RLS core).
-- Date: 2026-01-29

BEGIN;

-- rmm_verify_registry_submission(p_submission_id uuid, p_comments text)
-- Tier 2 Officer only. Submission must be in 'submitted' status. Updates status, verified_by, verified_at; inserts approval record.
CREATE OR REPLACE FUNCTION public.rmm_verify_registry_submission(
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

  -- Tier 2 Officer only (tier2_officer)
  IF v_role <> 'tier2_officer' THEN
    RETURN jsonb_build_object('error', 'forbidden', 'message', 'only Tier 2 Officer can verify registry submissions');
  END IF;

  IF p_submission_id IS NULL THEN
    RETURN jsonb_build_object('error', 'validation_error', 'message', 'submission_id is required');
  END IF;

  -- Submission must exist and be in 'submitted' status
  SELECT id, submission_type, status INTO r
  FROM public.registry_submissions
  WHERE id = p_submission_id;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('error', 'not_found', 'message', 'submission not found');
  END IF;
  IF r.status <> 'submitted' THEN
    RETURN jsonb_build_object('error', 'invalid_status', 'message', 'submission must be in submitted status to verify', 'current_status', r.status);
  END IF;

  UPDATE public.registry_submissions
  SET status = 'tier2_verified',
      verified_by = v_user_id,
      verified_at = now(),
      updated_at = now()
  WHERE id = p_submission_id;

  INSERT INTO public.approvals (submission_id, submission_type, from_status, to_status, approver_id, approval_type, comments)
  VALUES (p_submission_id, r.submission_type, 'submitted', 'tier2_verified', v_user_id, 'verification', NULLIF(trim(p_comments), ''));

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

COMMENT ON FUNCTION public.rmm_verify_registry_submission(uuid, text)
  IS 'Tier 2 Officer verifies registry submission. submitted -> tier2_verified. Creates approval record. Task 1.1.2.7.';

GRANT EXECUTE ON FUNCTION public.rmm_verify_registry_submission(uuid, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.rmm_verify_registry_submission(uuid, text) TO service_role;

COMMIT;
