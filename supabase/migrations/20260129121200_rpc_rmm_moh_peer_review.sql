-- Migration: RMM MOH submission peer review (Task 1.1.2.12)
-- Description: Add tier2_peer_reviewed status; rmm_peer_review_registry_submission (submitted -> tier2_peer_reviewed);
--             Update rmm_approve_registry_submission to accept tier2_verified OR tier2_peer_reviewed.
-- Tables: registry_submissions, approvals. RPC uses SECURITY DEFINER.
-- Depends on: 1.1.2.7 (Tier 2 verification), 1.1.2.8 (Tier 1 approval), 1.1.1.4 (RLS core).
-- Date: 2026-01-29

BEGIN;

-- Add tier2_peer_reviewed to registry_submissions status (MOH submission workflow)
ALTER TABLE public.registry_submissions
  DROP CONSTRAINT IF EXISTS registry_submissions_status_check;
ALTER TABLE public.registry_submissions
  ADD CONSTRAINT registry_submissions_status_check CHECK (status IN (
    'draft', 'submitted', 'tier2_verified', 'tier2_peer_reviewed', 'tier1_approved', 'tier2_implemented', 'completed', 'rejected'
  ));

-- rmm_peer_review_registry_submission(p_submission_id uuid, p_comments text)
-- Tier 2 Officer only; must be different from submitter; submission must be in 'submitted'. MOH-originated peer review.
CREATE OR REPLACE FUNCTION public.rmm_peer_review_registry_submission(
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

  -- Tier 2 Officer only (tier2_officer) for peer review
  IF v_role <> 'tier2_officer' THEN
    RETURN jsonb_build_object('error', 'forbidden', 'message', 'only Tier 2 Officer can peer review registry submissions');
  END IF;

  IF p_submission_id IS NULL THEN
    RETURN jsonb_build_object('error', 'validation_error', 'message', 'submission_id is required');
  END IF;

  SELECT id, submission_type, status, submitted_by INTO r
  FROM public.registry_submissions
  WHERE id = p_submission_id;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('error', 'not_found', 'message', 'submission not found');
  END IF;
  IF r.status <> 'submitted' THEN
    RETURN jsonb_build_object('error', 'invalid_status', 'message', 'submission must be in submitted status to peer review', 'current_status', r.status);
  END IF;
  -- Peer reviewer must be different from submitter (two-person rule for MOH submissions)
  IF r.submitted_by = v_user_id THEN
    RETURN jsonb_build_object('error', 'forbidden', 'message', 'peer reviewer must be a different Tier 2 Officer than the submitter');
  END IF;

  UPDATE public.registry_submissions
  SET status = 'tier2_peer_reviewed',
      verified_by = v_user_id,
      verified_at = now(),
      updated_at = now()
  WHERE id = p_submission_id;

  INSERT INTO public.approvals (submission_id, submission_type, from_status, to_status, approver_id, approval_type, comments)
  VALUES (p_submission_id, r.submission_type, 'submitted', 'tier2_peer_reviewed', v_user_id, 'peer_review', NULLIF(trim(p_comments), ''));

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

COMMENT ON FUNCTION public.rmm_peer_review_registry_submission(uuid, text)
  IS 'Tier 2 Officer (different from submitter) peer reviews MOH-originated registry submission. submitted -> tier2_peer_reviewed. Task 1.1.2.12.';

GRANT EXECUTE ON FUNCTION public.rmm_peer_review_registry_submission(uuid, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.rmm_peer_review_registry_submission(uuid, text) TO service_role;

-- Update rmm_approve_registry_submission to accept tier2_verified (company path) OR tier2_peer_reviewed (MOH path)
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

  IF v_role <> 'tier1' THEN
    RETURN jsonb_build_object('error', 'forbidden', 'message', 'only Tier 1 can approve registry submissions');
  END IF;

  IF p_submission_id IS NULL THEN
    RETURN jsonb_build_object('error', 'validation_error', 'message', 'submission_id is required');
  END IF;

  SELECT id, submission_type, status INTO r
  FROM public.registry_submissions
  WHERE id = p_submission_id;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('error', 'not_found', 'message', 'submission not found');
  END IF;
  IF r.status NOT IN ('tier2_verified', 'tier2_peer_reviewed') THEN
    RETURN jsonb_build_object('error', 'invalid_status', 'message', 'submission must be in tier2_verified or tier2_peer_reviewed status to approve', 'current_status', r.status);
  END IF;

  UPDATE public.registry_submissions
  SET status = 'tier1_approved',
      approved_by = v_user_id,
      approved_at = now(),
      updated_at = now()
  WHERE id = p_submission_id;

  INSERT INTO public.approvals (submission_id, submission_type, from_status, to_status, approver_id, approval_type, comments)
  VALUES (p_submission_id, r.submission_type, r.status, 'tier1_approved', v_user_id, 'approval', NULLIF(trim(p_comments), ''));

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
  IS 'Tier 1 approves registry submission. tier2_verified or tier2_peer_reviewed -> tier1_approved. Task 1.1.2.8 (updated for 1.1.2.12 MOH peer review).';

-- Update rmm_reject_registry_submission so Tier 1 can reject from tier2_peer_reviewed (MOH path)
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

  IF v_role = 'tier2_officer' AND r.status NOT IN ('submitted', 'tier2_verified', 'tier2_peer_reviewed') THEN
    RETURN jsonb_build_object('error', 'forbidden', 'message', 'Tier 2 Officer can only reject submissions in submitted, tier2_verified, or tier2_peer_reviewed status', 'current_status', r.status);
  END IF;
  IF v_role = 'tier1' AND r.status NOT IN ('tier2_verified', 'tier2_peer_reviewed', 'tier1_approved') THEN
    RETURN jsonb_build_object('error', 'forbidden', 'message', 'Tier 1 can only reject submissions in tier2_verified, tier2_peer_reviewed, or tier1_approved status', 'current_status', r.status);
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
  IS 'Tier 2 Officer or Tier 1 rejects registry submission. Tier 2: submitted/tier2_verified/tier2_peer_reviewed; Tier 1: tier2_verified/tier2_peer_reviewed/tier1_approved. Reason min 10 chars. Task 1.1.2.11 (updated for 1.1.2.12).';

COMMIT;
