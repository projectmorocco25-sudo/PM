-- Migration: Enforcement create and submit for review (Task 1.1.2.31)
-- Description: enforcement_create_action, enforcement_submit_action - create draft and submit for review.
-- Tables: enforcement_actions, approvals. No RLS INSERT/UPDATE for authenticated; RPCs use SECURITY DEFINER.
-- Depends on: 1.1.1.7 (enforcement_actions), 1.1.1.8 (RLS enforcement), core approvals table.
-- Date: 2026-01-29

BEGIN;

-- enforcement_create_action(...)
-- MOH only (tier1, tier2_officer, tier2_registrar, system_admin). Creates enforcement_actions with status 'draft'.
-- Justification min 50 chars per BUSINESS-LOGIC (Tier 1 enforcement actions).
CREATE OR REPLACE FUNCTION public.enforcement_create_action(
  p_company_id uuid,
  p_action_type text,
  p_violation_type text,
  p_legal_basis text,
  p_justification text,
  p_amount numeric DEFAULT NULL,
  p_currency text DEFAULT 'MAD',
  p_notes text DEFAULT NULL,
  p_violation_reference_id uuid DEFAULT NULL,
  p_violation_reference_table text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid;
  v_role text;
  v_action_id uuid;
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

  -- MOH only (matches RLS enforcement_actions_insert_moh)
  IF v_role NOT IN ('tier1', 'tier2_officer', 'tier2_registrar', 'system_admin') THEN
    RETURN jsonb_build_object('error', 'forbidden', 'message', 'only MOH roles can create enforcement actions');
  END IF;

  IF p_company_id IS NULL THEN
    RETURN jsonb_build_object('error', 'validation_error', 'message', 'company_id is required');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.companies WHERE id = p_company_id AND is_active = true) THEN
    RETURN jsonb_build_object('error', 'not_found', 'message', 'company not found or inactive');
  END IF;

  IF p_action_type IS NULL OR trim(p_action_type) = '' THEN
    RETURN jsonb_build_object('error', 'validation_error', 'message', 'action_type is required');
  END IF;
  IF lower(trim(p_action_type)) NOT IN ('warning', 'fine', 'suspension') THEN
    RETURN jsonb_build_object('error', 'validation_error', 'message', 'action_type must be warning, fine, or suspension');
  END IF;

  IF p_violation_type IS NULL OR trim(p_violation_type) = '' THEN
    RETURN jsonb_build_object('error', 'validation_error', 'message', 'violation_type is required');
  END IF;
  IF trim(p_violation_type) NOT IN (
    'submission_non_compliance', 'threshold_breach', 'critical_medicine_non_compliance',
    'export_violation', 'data_quality_issue', 'repeated_offender'
  ) THEN
    RETURN jsonb_build_object('error', 'validation_error', 'message', 'invalid violation_type');
  END IF;

  IF p_legal_basis IS NULL OR trim(p_legal_basis) = '' THEN
    RETURN jsonb_build_object('error', 'validation_error', 'message', 'legal_basis is required');
  END IF;

  IF p_justification IS NULL OR trim(p_justification) = '' THEN
    RETURN jsonb_build_object('error', 'validation_error', 'message', 'justification is required');
  END IF;
  IF length(trim(p_justification)) < 50 THEN
    RETURN jsonb_build_object('error', 'validation_error', 'message', 'justification must be at least 50 characters');
  END IF;

  IF p_currency IS NOT NULL AND trim(p_currency) = '' THEN
    RETURN jsonb_build_object('error', 'validation_error', 'message', 'currency cannot be empty');
  END IF;

  INSERT INTO public.enforcement_actions (
    company_id,
    action_type,
    violation_type,
    violation_reference_id,
    violation_reference_table,
    amount,
    currency,
    status,
    legal_basis,
    justification,
    notes,
    created_by
  ) VALUES (
    p_company_id,
    lower(trim(p_action_type)),
    trim(p_violation_type),
    p_violation_reference_id,
    NULLIF(trim(p_violation_reference_table), ''),
    p_amount,
    COALESCE(NULLIF(trim(p_currency), ''), 'MAD'),
    'draft',
    trim(p_legal_basis),
    trim(p_justification),
    NULLIF(trim(p_notes), ''),
    v_user_id
  )
  RETURNING id INTO v_action_id;

  RETURN jsonb_build_object(
    'action',
    (SELECT to_jsonb(a) FROM (
      SELECT id, company_id, action_type, violation_type, violation_reference_id, violation_reference_table,
             amount, currency, status, legal_basis, justification, notes, created_by, created_at, updated_at
      FROM public.enforcement_actions
      WHERE id = v_action_id
    ) a)
  );
END;
$$;

COMMENT ON FUNCTION public.enforcement_create_action(uuid, text, text, text, text, numeric, text, text, uuid, text)
  IS 'Create draft enforcement action. MOH only. Justification min 50 chars. Task 1.1.2.31.';

-- enforcement_submit_action(p_action_id uuid)
-- MOH only. Action must be in 'draft'. Sets status to 'pending_review'; inserts approval record.
-- Approval path (Tier 2 vs Tier 1) is determined by action_type in review/approve RPCs (1.1.2.32, 1.1.2.33).
CREATE OR REPLACE FUNCTION public.enforcement_submit_action(p_action_id uuid)
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

  -- MOH only
  IF v_role NOT IN ('tier1', 'tier2_officer', 'tier2_registrar', 'system_admin') THEN
    RETURN jsonb_build_object('error', 'forbidden', 'message', 'only MOH roles can submit enforcement actions for review');
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
  IF r.status <> 'draft' THEN
    RETURN jsonb_build_object('error', 'invalid_status', 'message', 'action must be in draft status to submit for review', 'current_status', r.status);
  END IF;

  UPDATE public.enforcement_actions
  SET status = 'pending_review',
      updated_at = now()
  WHERE id = p_action_id;

  INSERT INTO public.approvals (submission_id, submission_type, from_status, to_status, approver_id, approval_type, comments)
  VALUES (p_action_id, 'enforcement_action', 'draft', 'pending_review', v_user_id, 'submit', NULL);

  RETURN jsonb_build_object(
    'action',
    (SELECT to_jsonb(a) FROM (
      SELECT id, company_id, action_type, violation_type, status, legal_basis, justification,
             created_by, created_at, updated_at
      FROM public.enforcement_actions
      WHERE id = p_action_id
    ) a)
  );
END;
$$;

COMMENT ON FUNCTION public.enforcement_submit_action(uuid)
  IS 'Submit enforcement action for review. draft -> pending_review. MOH only. Approval path (Tier 2 vs Tier 1) by action_type in review/approve. Task 1.1.2.31.';

GRANT EXECUTE ON FUNCTION public.enforcement_create_action(uuid, text, text, text, text, numeric, text, text, uuid, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.enforcement_create_action(uuid, text, text, text, text, numeric, text, text, uuid, text) TO service_role;
GRANT EXECUTE ON FUNCTION public.enforcement_submit_action(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.enforcement_submit_action(uuid) TO service_role;

COMMIT;
