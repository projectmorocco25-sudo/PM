-- Migration: Enforcement approve action (Task 1.1.2.33)
-- Description: enforcement_approve_action - Tier 1 approves Fine/Suspension; two-person rule (Tier 2 reviewed); justification min 50 chars.
-- Tables: enforcement_actions, approvals. Audit via existing audit_trigger on enforcement_actions.
-- Depends on: 1.1.2.32 (review action), 1.1.1.8 (RLS enforcement), 1.1.2.15 (two-person rule concept).
-- Date: 2026-01-29

BEGIN;

-- enforcement_approve_action(p_action_id uuid, p_approval_notes text)
-- Tier 1 only. Action must be in 'pending_approval' (Fine/Suspension path).
-- Two-person rule: reviewed_by must be set (Tier 2 Officer) and different from approver (Tier 1).
-- Justification (approval_notes) min 50 chars required; stored and audited via trigger.
CREATE OR REPLACE FUNCTION public.enforcement_approve_action(
  p_action_id uuid,
  p_approval_notes text
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
  v_reviewer_role text;
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

  -- Tier 1 only (per business logic: approve is Tier 1 for Fine/Suspension)
  IF v_role <> 'tier1' THEN
    RETURN jsonb_build_object('error', 'forbidden', 'message', 'only Tier 1 can approve enforcement actions (Fine/Suspension path)');
  END IF;

  IF p_action_id IS NULL THEN
    RETURN jsonb_build_object('error', 'validation_error', 'message', 'action_id is required');
  END IF;

  -- Justification (approval_notes) min 50 chars required. BUSINESS-LOGIC.
  IF p_approval_notes IS NULL OR trim(p_approval_notes) = '' THEN
    RETURN jsonb_build_object('error', 'validation_error', 'message', 'approval_notes (justification) is required (min 50 characters)');
  END IF;
  IF length(trim(p_approval_notes)) < 50 THEN
    RETURN jsonb_build_object('error', 'validation_error', 'message', 'approval_notes must be at least 50 characters');
  END IF;

  SELECT id, action_type, status, reviewed_by INTO r
  FROM public.enforcement_actions
  WHERE id = p_action_id;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('error', 'not_found', 'message', 'enforcement action not found');
  END IF;
  IF r.status <> 'pending_approval' THEN
    RETURN jsonb_build_object('error', 'invalid_status', 'message', 'action must be in pending_approval status to approve', 'current_status', r.status);
  END IF;

  -- Two-person rule: Tier 2 must have reviewed before Tier 1 approves (reviewed_by set and different from approver)
  IF r.reviewed_by IS NULL THEN
    RETURN jsonb_build_object('error', 'two_person_rule', 'message', 'Two-person rule not satisfied: Tier 2 Officer must review before Tier 1 approval');
  END IF;
  IF r.reviewed_by = v_user_id THEN
    RETURN jsonb_build_object('error', 'two_person_rule', 'message', 'Two-person rule not satisfied: approver must be different from reviewer (Tier 1 vs Tier 2 Officer)');
  END IF;
  SELECT role INTO v_reviewer_role FROM public.users WHERE id = r.reviewed_by AND is_active = true;
  IF v_reviewer_role IS NULL OR v_reviewer_role <> 'tier2_officer' THEN
    RETURN jsonb_build_object('error', 'two_person_rule', 'message', 'Two-person rule not satisfied: reviewer must be Tier 2 Officer');
  END IF;

  UPDATE public.enforcement_actions
  SET status = 'approved',
      approved_by = v_user_id,
      approved_at = now(),
      approval_notes = trim(p_approval_notes),
      updated_at = now()
  WHERE id = p_action_id;

  INSERT INTO public.approvals (submission_id, submission_type, from_status, to_status, approver_id, approval_type, comments)
  VALUES (p_action_id, 'enforcement_action', 'pending_approval', 'approved', v_user_id, 'approval', trim(p_approval_notes));

  RETURN jsonb_build_object(
    'action',
    (SELECT to_jsonb(a) FROM (
      SELECT id, company_id, action_type, violation_type, status, legal_basis, justification,
             reviewed_by, reviewed_at, review_notes, approved_by, approved_at, approval_notes,
             created_by, created_at, updated_at
      FROM public.enforcement_actions
      WHERE id = p_action_id
    ) a)
  );
END;
$$;

COMMENT ON FUNCTION public.enforcement_approve_action(uuid, text)
  IS 'Tier 1 approves enforcement action (Fine/Suspension). Two-person rule: Tier 2 must have reviewed. Justification (approval_notes) min 50 chars. Task 1.1.2.33.';

GRANT EXECUTE ON FUNCTION public.enforcement_approve_action(uuid, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.enforcement_approve_action(uuid, text) TO service_role;

COMMIT;
