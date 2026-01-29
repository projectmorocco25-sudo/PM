-- Migration: Enforcement review action (Task 1.1.2.32)
-- Description: enforcement_review_action - Tier 2 Officer reviews; Warning -> approved, Fine/Suspension -> pending_approval.
-- Tables: enforcement_actions, approvals. Audit via existing audit_trigger on enforcement_actions.
-- Depends on: 1.1.2.31 (submit for review), 1.1.1.8 (RLS enforcement).
-- Date: 2026-01-29

BEGIN;

-- enforcement_review_action(p_action_id uuid, p_review_notes text DEFAULT NULL)
-- Tier 2 Officer only. Action must be in 'pending_review'.
-- Warning: pending_review -> approved (Tier 2 alone); set reviewed_by, reviewed_at, review_notes, approved_by, approved_at.
-- Fine/Suspension: pending_review -> pending_approval; require review_notes (justification) min 50 chars; set reviewed_by, reviewed_at, review_notes.
-- Inserts approval record. Audit: existing AFTER UPDATE trigger on enforcement_actions logs row change (including review_notes).
CREATE OR REPLACE FUNCTION public.enforcement_review_action(
  p_action_id uuid,
  p_review_notes text DEFAULT NULL
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
  v_to_status text;
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

  -- Tier 2 Officer only (per business logic: review is Tier 2)
  IF v_role <> 'tier2_officer' THEN
    RETURN jsonb_build_object('error', 'forbidden', 'message', 'only Tier 2 Officer can review enforcement actions');
  END IF;

  IF p_action_id IS NULL THEN
    RETURN jsonb_build_object('error', 'validation_error', 'message', 'action_id is required');
  END IF;

  SELECT id, action_type, status INTO r
  FROM public.enforcement_actions
  WHERE id = p_action_id;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('error', 'not_found', 'message', 'enforcement action not found');
  END IF;
  IF r.status <> 'pending_review' THEN
    RETURN jsonb_build_object('error', 'invalid_status', 'message', 'action must be in pending_review status to review', 'current_status', r.status);
  END IF;

  -- For Tier 1-involved actions (fine, suspension): mandatory justification (min 50 chars). BUSINESS-LOGIC.
  IF r.action_type IN ('fine', 'suspension') THEN
    IF p_review_notes IS NULL OR trim(p_review_notes) = '' THEN
      RETURN jsonb_build_object('error', 'validation_error', 'message', 'justification (review_notes) is required for Fine/Suspension actions (min 50 characters)');
    END IF;
    IF length(trim(p_review_notes)) < 50 THEN
      RETURN jsonb_build_object('error', 'validation_error', 'message', 'justification must be at least 50 characters for Tier 1-involved actions');
    END IF;
  END IF;

  IF r.action_type = 'warning' THEN
    -- Tier 2 alone: review = approval; transition to approved
    v_to_status := 'approved';
    UPDATE public.enforcement_actions
    SET status = v_to_status,
        reviewed_by = v_user_id,
        reviewed_at = now(),
        review_notes = NULLIF(trim(p_review_notes), ''),
        approved_by = v_user_id,
        approved_at = now(),
        updated_at = now()
    WHERE id = p_action_id;
  ELSE
    -- Fine/Suspension: forward to Tier 1; transition to pending_approval
    v_to_status := 'pending_approval';
    UPDATE public.enforcement_actions
    SET status = v_to_status,
        reviewed_by = v_user_id,
        reviewed_at = now(),
        review_notes = trim(p_review_notes),
        updated_at = now()
    WHERE id = p_action_id;
  END IF;

  INSERT INTO public.approvals (submission_id, submission_type, from_status, to_status, approver_id, approval_type, comments)
  VALUES (p_action_id, 'enforcement_action', 'pending_review', v_to_status, v_user_id, 'review', NULLIF(trim(p_review_notes), ''));

  RETURN jsonb_build_object(
    'action',
    (SELECT to_jsonb(a) FROM (
      SELECT id, company_id, action_type, violation_type, status, legal_basis, justification,
             reviewed_by, reviewed_at, review_notes, approved_by, approved_at,
             created_by, created_at, updated_at
      FROM public.enforcement_actions
      WHERE id = p_action_id
    ) a)
  );
END;
$$;

COMMENT ON FUNCTION public.enforcement_review_action(uuid, text)
  IS 'Tier 2 Officer reviews enforcement action. Warning -> approved (Tier 2 alone); Fine/Suspension -> pending_approval with justification min 50 chars. Task 1.1.2.32.';

GRANT EXECUTE ON FUNCTION public.enforcement_review_action(uuid, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.enforcement_review_action(uuid, text) TO service_role;

COMMIT;
