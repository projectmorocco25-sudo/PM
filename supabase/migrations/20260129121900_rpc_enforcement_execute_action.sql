-- Migration: Enforcement execute action (Task 1.1.2.34)
-- Description: enforcement_execute_action - MOH executes approved action; suspension applies to company (suspended_at, is_active=false).
-- Tables: enforcement_actions, companies, approvals. Audit via existing audit_trigger on enforcement_actions and companies.
-- Depends on: 1.1.2.33 (approve action), 1.1.1.8 (RLS enforcement).
-- Date: 2026-01-29

BEGIN;

-- enforcement_execute_action(p_action_id uuid, p_execution_notes text DEFAULT NULL)
-- MOH only (tier1, tier2_officer, tier2_registrar, system_admin). Action must be in 'approved'.
-- When Tier 1 executes: justification (execution_notes) min 50 chars required. BUSINESS-LOGIC.
-- Warning/Fine: record execution only. Suspension: set company suspended_at, suspended_by, suspended_reason, is_active = false (cascade deactivates products/SKUs).
CREATE OR REPLACE FUNCTION public.enforcement_execute_action(
  p_action_id uuid,
  p_execution_notes text DEFAULT NULL
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

  -- MOH only (matches RLS)
  IF v_role NOT IN ('tier1', 'tier2_officer', 'tier2_registrar', 'system_admin') THEN
    RETURN jsonb_build_object('error', 'forbidden', 'message', 'only MOH roles can execute enforcement actions');
  END IF;

  -- When Tier 1 executes: mandatory justification (min 50 chars). BUSINESS-LOGIC.
  IF v_role = 'tier1' THEN
    IF p_execution_notes IS NULL OR trim(p_execution_notes) = '' THEN
      RETURN jsonb_build_object('error', 'validation_error', 'message', 'execution_notes (justification) is required when Tier 1 executes (min 50 characters)');
    END IF;
    IF length(trim(p_execution_notes)) < 50 THEN
      RETURN jsonb_build_object('error', 'validation_error', 'message', 'execution_notes must be at least 50 characters when Tier 1 executes');
    END IF;
  END IF;

  IF p_action_id IS NULL THEN
    RETURN jsonb_build_object('error', 'validation_error', 'message', 'action_id is required');
  END IF;

  SELECT id, action_type, status, company_id, justification INTO r
  FROM public.enforcement_actions
  WHERE id = p_action_id;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('error', 'not_found', 'message', 'enforcement action not found');
  END IF;
  IF r.status <> 'approved' THEN
    RETURN jsonb_build_object('error', 'invalid_status', 'message', 'action must be in approved status to execute', 'current_status', r.status);
  END IF;

  v_reason := COALESCE(NULLIF(trim(p_execution_notes), ''), r.justification);

  -- Update enforcement_actions: status -> executed, executed_by, executed_at, execution_notes
  UPDATE public.enforcement_actions
  SET status = 'executed',
      executed_by = v_user_id,
      executed_at = now(),
      execution_notes = NULLIF(trim(p_execution_notes), ''),
      updated_at = now()
  WHERE id = p_action_id;

  -- Apply suspension to company: set suspended_at, suspended_by, suspended_reason, is_active = false (cascade deactivates products/SKUs)
  IF r.action_type = 'suspension' THEN
    UPDATE public.companies
    SET suspended_at = now(),
        suspended_by = v_user_id,
        suspended_reason = v_reason,
        is_active = false,
        updated_at = now()
    WHERE id = r.company_id;
  END IF;

  INSERT INTO public.approvals (submission_id, submission_type, from_status, to_status, approver_id, approval_type, comments)
  VALUES (p_action_id, 'enforcement_action', 'approved', 'executed', v_user_id, 'execute', NULLIF(trim(p_execution_notes), ''));

  RETURN jsonb_build_object(
    'action',
    (SELECT to_jsonb(a) FROM (
      SELECT id, company_id, action_type, violation_type, status, legal_basis, justification,
             executed_by, executed_at, execution_notes,
             created_by, created_at, updated_at
      FROM public.enforcement_actions
      WHERE id = p_action_id
    ) a)
  );
END;
$$;

COMMENT ON FUNCTION public.enforcement_execute_action(uuid, text)
  IS 'Execute approved enforcement action. MOH only. Tier 1 execution requires justification min 50 chars. Suspension applies to company (suspended_at, is_active=false). Task 1.1.2.34.';

GRANT EXECUTE ON FUNCTION public.enforcement_execute_action(uuid, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.enforcement_execute_action(uuid, text) TO service_role;

COMMIT;
