-- Migration: enforcement_get_action, enforcement_get_action_history, enforcement_get_appeal_status (Task 1.1.2.39)
-- Description: Detail page RPCs. MOH see any; company users see only their company's actions.
-- Tables: enforcement_actions, companies, users, approvals, enforcement_action_appeals.
-- Date: 2026-01-29

BEGIN;

-- enforcement_get_action(p_action_id uuid)
-- Returns action row with company_name and creator/reviewer/approver/executor names and roles.
-- Access: MOH (tier1, tier2_officer, tier2_registrar, auditor, system_admin) or company_id = current_user_company_id().
CREATE OR REPLACE FUNCTION public.enforcement_get_action(p_action_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_role text;
  v_company_id uuid;
  v_action_company_id uuid;
  out_json jsonb;
BEGIN
  SELECT role, company_id INTO v_role, v_company_id
  FROM public.users WHERE id = auth.uid() AND is_active = true;
  IF NOT FOUND OR v_role IS NULL THEN
    RETURN jsonb_build_object('error', 'unauthorized', 'message', 'not authenticated');
  END IF;

  SELECT company_id INTO v_action_company_id
  FROM public.enforcement_actions WHERE id = p_action_id;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('error', 'not_found', 'message', 'enforcement action not found');
  END IF;

  IF v_role NOT IN ('tier1', 'tier2_officer', 'tier2_registrar', 'auditor', 'system_admin') THEN
    IF v_company_id IS NULL OR v_company_id != v_action_company_id THEN
      RETURN jsonb_build_object('error', 'forbidden', 'message', 'access denied');
    END IF;
  END IF;

  SELECT jsonb_build_object(
    'action', row_to_json(ea)::jsonb,
    'company_name', c.name,
    'created_by_name', cu.full_name,
    'created_by_role', cu.role,
    'reviewed_by_name', ru.full_name,
    'reviewed_by_role', ru.role,
    'approved_by_name', au.full_name,
    'approved_by_role', au.role,
    'executed_by_name', eu.full_name,
    'executed_by_role', eu.role
  ) INTO out_json
  FROM public.enforcement_actions ea
  JOIN public.companies c ON c.id = ea.company_id
  LEFT JOIN public.users cu ON cu.id = ea.created_by
  LEFT JOIN public.users ru ON ru.id = ea.reviewed_by
  LEFT JOIN public.users au ON au.id = ea.approved_by
  LEFT JOIN public.users eu ON eu.id = ea.executed_by
  WHERE ea.id = p_action_id;

  RETURN coalesce(out_json, '{}'::jsonb);
END;
$$;

COMMENT ON FUNCTION public.enforcement_get_action(uuid) IS 'Get enforcement action for detail page. MOH or same-company only. Task 1.1.2.39.';
GRANT EXECUTE ON FUNCTION public.enforcement_get_action(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.enforcement_get_action(uuid) TO service_role;

-- enforcement_get_action_history(p_action_id uuid)
-- Returns approval chain (approvals where submission_type = enforcement_action, submission_id = p_action_id) with approver name/role.
CREATE OR REPLACE FUNCTION public.enforcement_get_action_history(p_action_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_role text;
  v_company_id uuid;
  v_action_company_id uuid;
  rows jsonb;
BEGIN
  SELECT role, company_id INTO v_role, v_company_id
  FROM public.users WHERE id = auth.uid() AND is_active = true;
  IF NOT FOUND OR v_role IS NULL THEN
    RETURN jsonb_build_object('error', 'unauthorized', 'message', 'not authenticated');
  END IF;

  SELECT company_id INTO v_action_company_id
  FROM public.enforcement_actions WHERE id = p_action_id;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('error', 'not_found', 'message', 'enforcement action not found');
  END IF;

  IF v_role NOT IN ('tier1', 'tier2_officer', 'tier2_registrar', 'auditor', 'system_admin') THEN
    IF v_company_id IS NULL OR v_company_id != v_action_company_id THEN
      RETURN jsonb_build_object('error', 'forbidden', 'message', 'access denied');
    END IF;
  END IF;

  SELECT jsonb_agg(row_to_json(t)::jsonb) INTO rows
  FROM (
    SELECT a.id, a.approval_type, a.from_status, a.to_status, a.approver_id, a.comments, a.created_at,
           u.full_name AS approver_name, u.role AS approver_role
    FROM public.approvals a
    LEFT JOIN public.users u ON u.id = a.approver_id
    WHERE a.submission_type = 'enforcement_action' AND a.submission_id = p_action_id
    ORDER BY a.created_at ASC
  ) t;
  RETURN jsonb_build_object('data', coalesce(rows, '[]'::jsonb));
END;
$$;

COMMENT ON FUNCTION public.enforcement_get_action_history(uuid) IS 'Get approval history for enforcement action. MOH or same-company only. Task 1.1.2.39.';
GRANT EXECUTE ON FUNCTION public.enforcement_get_action_history(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.enforcement_get_action_history(uuid) TO service_role;

-- enforcement_get_appeal_status(p_action_id uuid)
-- Returns appeal for this action (if any) and appeal window info (days remaining if executed, no appeal).
CREATE OR REPLACE FUNCTION public.enforcement_get_appeal_status(p_action_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_role text;
  v_company_id uuid;
  v_action_company_id uuid;
  v_executed_at timestamptz;
  v_appeal jsonb;
  v_days_remaining int;
BEGIN
  SELECT role, company_id INTO v_role, v_company_id
  FROM public.users WHERE id = auth.uid() AND is_active = true;
  IF NOT FOUND OR v_role IS NULL THEN
    RETURN jsonb_build_object('error', 'unauthorized', 'message', 'not authenticated');
  END IF;

  SELECT company_id, executed_at INTO v_action_company_id, v_executed_at
  FROM public.enforcement_actions WHERE id = p_action_id;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('error', 'not_found', 'message', 'enforcement action not found');
  END IF;

  IF v_role NOT IN ('tier1', 'tier2_officer', 'tier2_registrar', 'auditor', 'system_admin') THEN
    IF v_company_id IS NULL OR v_company_id != v_action_company_id THEN
      RETURN jsonb_build_object('error', 'forbidden', 'message', 'access denied');
    END IF;
  END IF;

  SELECT jsonb_build_object(
    'id', ap.id,
    'status', ap.status,
    'appeal_reason', ap.appeal_reason,
    'submitted_at', ap.submitted_at,
    'submitted_by_name', u.full_name,
    'resolution', ap.resolution,
    'resolved_at', ap.resolved_at
  ) INTO v_appeal
  FROM public.enforcement_action_appeals ap
  LEFT JOIN public.users u ON u.id = ap.submitted_by
  WHERE ap.enforcement_action_id = p_action_id;

  v_days_remaining := NULL;
  IF v_appeal IS NULL AND v_executed_at IS NOT NULL THEN
    v_days_remaining := greatest(0, 30 - (extract(epoch from (now() - v_executed_at)) / 86400)::int);
  END IF;

  RETURN jsonb_build_object(
    'appeal', v_appeal,
    'appeal_window_remaining_days', v_days_remaining,
    'executed_at', v_executed_at
  );
END;
$$;

COMMENT ON FUNCTION public.enforcement_get_appeal_status(uuid) IS 'Get appeal status for enforcement action. MOH or same-company only. Task 1.1.2.39.';
GRANT EXECUTE ON FUNCTION public.enforcement_get_appeal_status(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.enforcement_get_appeal_status(uuid) TO service_role;

COMMIT;
