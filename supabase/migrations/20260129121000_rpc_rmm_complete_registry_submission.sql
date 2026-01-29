-- Migration: RMM registry submission completion (Task 1.1.2.10)
-- Description: rmm_complete_registry_submission - Tier 2 Registrar marks submission as completed (tier2_implemented -> completed).
-- Tables: registry_submissions, approvals. RPC uses SECURITY DEFINER.
-- Depends on: 1.1.2.9 (Tier 2 implementation), 1.1.1.4 (RLS core).
-- Date: 2026-01-29

BEGIN;

CREATE OR REPLACE FUNCTION public.rmm_complete_registry_submission(p_submission_id uuid)
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

  IF v_role <> 'tier2_registrar' THEN
    RETURN jsonb_build_object('error', 'forbidden', 'message', 'only Tier 2 Registrar can complete registry submissions');
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
  IF r.status <> 'tier2_implemented' THEN
    RETURN jsonb_build_object('error', 'invalid_status', 'message', 'submission must be in tier2_implemented status to complete', 'current_status', r.status);
  END IF;

  UPDATE public.registry_submissions
  SET status = 'completed',
      updated_at = now()
  WHERE id = p_submission_id;

  INSERT INTO public.approvals (submission_id, submission_type, from_status, to_status, approver_id, approval_type, comments)
  VALUES (p_submission_id, r.submission_type, 'tier2_implemented', 'completed', v_user_id, 'completion', NULL);

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

COMMENT ON FUNCTION public.rmm_complete_registry_submission(uuid)
  IS 'Tier 2 Registrar marks registry submission as completed. tier2_implemented -> completed. Task 1.1.2.10.';

GRANT EXECUTE ON FUNCTION public.rmm_complete_registry_submission(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.rmm_complete_registry_submission(uuid) TO service_role;

COMMIT;
