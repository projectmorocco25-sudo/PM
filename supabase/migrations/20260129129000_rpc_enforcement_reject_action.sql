-- Migration: enforcement_reject_action (Task 1.1.2.41)
-- Description: Tier 1 rejects a pending_approval enforcement action; sets status to cancelled, resolution = reason.
-- Tables: enforcement_actions, approvals.
-- Date: 2026-01-29

BEGIN;

CREATE OR REPLACE FUNCTION public.enforcement_reject_action(
  p_action_id uuid,
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
    RETURN jsonb_build_object('error', 'forbidden', 'message', 'only Tier 1 can reject enforcement actions');
  END IF;

  IF p_action_id IS NULL THEN
    RETURN jsonb_build_object('error', 'validation_error', 'message', 'action_id is required');
  END IF;

  IF p_rejection_reason IS NULL OR trim(p_rejection_reason) = '' THEN
    RETURN jsonb_build_object('error', 'validation_error', 'message', 'rejection reason is required');
  END IF;
  IF length(trim(p_rejection_reason)) < 20 THEN
    RETURN jsonb_build_object('error', 'validation_error', 'message', 'rejection reason must be at least 20 characters');
  END IF;

  SELECT id, status INTO r
  FROM public.enforcement_actions
  WHERE id = p_action_id;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('error', 'not_found', 'message', 'enforcement action not found');
  END IF;
  IF r.status <> 'pending_approval' THEN
    RETURN jsonb_build_object('error', 'invalid_status', 'message', 'action must be in pending_approval to reject', 'current_status', r.status);
  END IF;

  UPDATE public.enforcement_actions
  SET status = 'cancelled',
      resolution = trim(p_rejection_reason),
      resolved_by = v_user_id,
      resolved_at = now(),
      updated_at = now()
  WHERE id = p_action_id;

  INSERT INTO public.approvals (submission_id, submission_type, from_status, to_status, approver_id, approval_type, comments)
  VALUES (p_action_id, 'enforcement_action', 'pending_approval', 'cancelled', v_user_id, 'rejection', trim(p_rejection_reason));

  RETURN jsonb_build_object(
    'action',
    (SELECT to_jsonb(a) FROM (
      SELECT id, company_id, action_type, violation_type, status, resolution, resolved_by, resolved_at
      FROM public.enforcement_actions
      WHERE id = p_action_id
    ) a)
  );
END;
$$;

COMMENT ON FUNCTION public.enforcement_reject_action(uuid, text) IS 'Tier 1 rejects pending_approval enforcement action. pending_approval -> cancelled. Task 1.1.2.41.';
GRANT EXECUTE ON FUNCTION public.enforcement_reject_action(uuid, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.enforcement_reject_action(uuid, text) TO service_role;

COMMIT;
