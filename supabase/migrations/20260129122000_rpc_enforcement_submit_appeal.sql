-- Migration: Enforcement submit appeal (Task 1.1.2.35)
-- Description: enforcement_submit_appeal - Company users submit appeal against executed action; 30-day window from execution.
-- Tables: enforcement_action_appeals, enforcement_actions. Audit via existing audit_trigger on both tables.
-- Depends on: 1.1.1.7-verify (enforcement tables), 1.1.1.8 (RLS enforcement).
-- Date: 2026-01-29

BEGIN;

-- enforcement_submit_appeal(p_action_id uuid, p_appeal_reason text, p_evidence jsonb DEFAULT NULL)
-- Company users only (company_admin, company_manager, company_user). Action must belong to caller's company.
-- Action must be in 'executed' status. Appeal must be within 30 days of executed_at. BUSINESS-LOGIC.
-- One appeal per action (enforcement_action_appeals has UNIQUE enforcement_action_id).
-- Creates enforcement_action_appeals row; updates enforcement_actions (appeal_id, status = 'appealed').
CREATE OR REPLACE FUNCTION public.enforcement_submit_appeal(
  p_action_id uuid,
  p_appeal_reason text,
  p_evidence jsonb DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid;
  v_role text;
  v_company_id uuid;
  r record;
  v_appeal_id uuid;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RETURN jsonb_build_object('error', 'unauthorized', 'message', 'not authenticated');
  END IF;

  SELECT role, company_id INTO v_role, v_company_id
  FROM public.users
  WHERE id = v_user_id AND is_active = true;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('error', 'user_not_found', 'message', 'user not found');
  END IF;

  -- Company users only (task: allow company users to submit appeals)
  IF v_role NOT IN ('company_admin', 'company_manager', 'company_user') THEN
    RETURN jsonb_build_object('error', 'forbidden', 'message', 'only company users can submit appeals for their company''s enforcement actions');
  END IF;

  IF v_company_id IS NULL THEN
    RETURN jsonb_build_object('error', 'forbidden', 'message', 'company user must have company_id');
  END IF;

  IF p_action_id IS NULL THEN
    RETURN jsonb_build_object('error', 'validation_error', 'message', 'action_id is required');
  END IF;

  IF p_appeal_reason IS NULL OR trim(p_appeal_reason) = '' THEN
    RETURN jsonb_build_object('error', 'validation_error', 'message', 'appeal_reason is required');
  END IF;
  IF length(trim(p_appeal_reason)) < 20 THEN
    RETURN jsonb_build_object('error', 'validation_error', 'message', 'appeal_reason must be at least 20 characters');
  END IF;

  SELECT id, company_id, status, executed_at INTO r
  FROM public.enforcement_actions
  WHERE id = p_action_id;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('error', 'not_found', 'message', 'enforcement action not found');
  END IF;

  IF r.company_id <> v_company_id THEN
    RETURN jsonb_build_object('error', 'forbidden', 'message', 'can only appeal enforcement actions for your company');
  END IF;

  IF r.status <> 'executed' THEN
    RETURN jsonb_build_object('error', 'invalid_status', 'message', 'can only appeal executed enforcement actions', 'current_status', r.status);
  END IF;

  -- 30-day appeal window from execution. BUSINESS-LOGIC.
  IF r.executed_at IS NULL OR r.executed_at < (now() - interval '30 days') THEN
    RETURN jsonb_build_object('error', 'appeal_window_expired', 'message', 'appeal must be submitted within 30 days of execution');
  END IF;

  IF EXISTS (SELECT 1 FROM public.enforcement_action_appeals WHERE enforcement_action_id = p_action_id) THEN
    RETURN jsonb_build_object('error', 'already_appealed', 'message', 'this enforcement action already has an appeal');
  END IF;

  INSERT INTO public.enforcement_action_appeals (
    enforcement_action_id,
    appeal_reason,
    evidence,
    status,
    submitted_by
  ) VALUES (
    p_action_id,
    trim(p_appeal_reason),
    p_evidence,
    'submitted',
    v_user_id
  )
  RETURNING id INTO v_appeal_id;

  UPDATE public.enforcement_actions
  SET appeal_id = v_appeal_id,
      status = 'appealed',
      updated_at = now()
  WHERE id = p_action_id;

  RETURN jsonb_build_object(
    'appeal',
    (SELECT to_jsonb(a) FROM (
      SELECT id, enforcement_action_id, appeal_reason, evidence, status, submitted_by, submitted_at, created_at, updated_at
      FROM public.enforcement_action_appeals
      WHERE id = v_appeal_id
    ) a),
    'action',
    (SELECT to_jsonb(e) FROM (
      SELECT id, company_id, action_type, violation_type, status, appeal_id, executed_at, created_at, updated_at
      FROM public.enforcement_actions
      WHERE id = p_action_id
    ) e)
  );
END;
$$;

COMMENT ON FUNCTION public.enforcement_submit_appeal(uuid, text, jsonb)
  IS 'Company users submit appeal against executed enforcement action. 30-day window from execution. One appeal per action. Task 1.1.2.35.';

GRANT EXECUTE ON FUNCTION public.enforcement_submit_appeal(uuid, text, jsonb) TO authenticated;
GRANT EXECUTE ON FUNCTION public.enforcement_submit_appeal(uuid, text, jsonb) TO service_role;

COMMIT;
