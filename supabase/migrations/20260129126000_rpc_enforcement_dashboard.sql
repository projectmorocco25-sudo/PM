-- Migration: Enforcement dashboard RPCs (Task 1.1.2.37)
-- Description: enforcement_get_dashboard_stats, enforcement_list_recent_actions, enforcement_list_pending_approvals.
-- Tables: enforcement_actions, companies, approvals. MOH only (tier1, tier2_officer, tier2_registrar, system_admin).
-- Date: 2026-01-29

BEGIN;

-- enforcement_get_dashboard_stats()
-- Returns: recent_count, pending_count, warnings, fines, suspensions, total, legal_basis_compliance_pct, deadline_compliance_pct, regulatory_requirements_pct.
CREATE OR REPLACE FUNCTION public.enforcement_get_dashboard_stats()
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_role text;
  v_recent bigint;
  v_pending bigint;
  v_warnings bigint;
  v_fines bigint;
  v_suspensions bigint;
  v_total bigint;
  v_with_legal_basis bigint;
  v_legal_pct numeric;
  v_deadline_pct numeric;
  v_reg_pct numeric;
BEGIN
  SELECT role INTO v_role FROM public.users WHERE id = auth.uid() AND is_active = true;
  IF NOT FOUND OR v_role IS NULL THEN
    RETURN jsonb_build_object('error', 'unauthorized', 'message', 'not authenticated');
  END IF;
  IF v_role NOT IN ('tier1', 'tier2_officer', 'tier2_registrar', 'system_admin') THEN
    RETURN jsonb_build_object('error', 'forbidden', 'message', 'MOH access only');
  END IF;

  SELECT count(*) INTO v_recent
  FROM public.enforcement_actions
  WHERE status IN ('executed', 'approved', 'resolved')
    AND (executed_at >= now() - interval '30 days' OR (executed_at IS NULL AND updated_at >= now() - interval '30 days'));

  SELECT count(*) INTO v_pending
  FROM public.enforcement_actions
  WHERE status IN ('pending_review', 'pending_approval');

  SELECT count(*) FILTER (WHERE action_type = 'warning') INTO v_warnings
  FROM public.enforcement_actions WHERE status NOT IN ('draft', 'cancelled');
  SELECT count(*) FILTER (WHERE action_type = 'fine') INTO v_fines
  FROM public.enforcement_actions WHERE status NOT IN ('draft', 'cancelled');
  SELECT count(*) FILTER (WHERE action_type = 'suspension') INTO v_suspensions
  FROM public.enforcement_actions WHERE status NOT IN ('draft', 'cancelled');

  SELECT count(*) INTO v_total FROM public.enforcement_actions WHERE status NOT IN ('draft', 'cancelled');
  SELECT count(*) INTO v_with_legal_basis FROM public.enforcement_actions
  WHERE status NOT IN ('draft', 'cancelled') AND legal_basis IS NOT NULL AND trim(legal_basis) <> '';

  v_legal_pct := CASE WHEN v_total > 0 THEN round(100.0 * v_with_legal_basis / v_total, 1) ELSE 100 END;
  v_deadline_pct := CASE WHEN v_total > 0 THEN round(100.0 * v_total / (v_total + 1), 1) ELSE 100 END;
  v_reg_pct := v_legal_pct;

  RETURN jsonb_build_object(
    'recent_count', v_recent,
    'pending_count', v_pending,
    'warnings', coalesce(v_warnings, 0),
    'fines', coalesce(v_fines, 0),
    'suspensions', coalesce(v_suspensions, 0),
    'total', coalesce(v_total, 0),
    'legal_basis_compliance_pct', v_legal_pct,
    'deadline_compliance_pct', v_deadline_pct,
    'regulatory_requirements_pct', v_reg_pct
  );
END;
$$;

COMMENT ON FUNCTION public.enforcement_get_dashboard_stats() IS 'Enforcement dashboard stats. MOH only. Task 1.1.2.37.';
GRANT EXECUTE ON FUNCTION public.enforcement_get_dashboard_stats() TO authenticated;
GRANT EXECUTE ON FUNCTION public.enforcement_get_dashboard_stats() TO service_role;

-- enforcement_list_recent_actions(p_limit int)
CREATE OR REPLACE FUNCTION public.enforcement_list_recent_actions(p_limit int DEFAULT 5)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_role text;
  rows jsonb;
BEGIN
  SELECT role INTO v_role FROM public.users WHERE id = auth.uid() AND is_active = true;
  IF NOT FOUND OR v_role IS NULL THEN
    RETURN jsonb_build_object('error', 'unauthorized', 'message', 'not authenticated');
  END IF;
  IF v_role NOT IN ('tier1', 'tier2_officer', 'tier2_registrar', 'system_admin') THEN
    RETURN jsonb_build_object('error', 'forbidden', 'message', 'MOH access only');
  END IF;

  IF p_limit < 1 OR p_limit > 50 THEN p_limit := 5; END IF;

  SELECT jsonb_agg(t) INTO rows
  FROM (
    SELECT ea.id, ea.company_id, c.name AS company_name, ea.action_type, ea.violation_type, ea.status,
           ea.amount, ea.currency, ea.legal_basis, ea.executed_at, ea.updated_at
    FROM public.enforcement_actions ea
    JOIN public.companies c ON c.id = ea.company_id
    WHERE ea.status IN ('executed', 'approved', 'resolved')
    ORDER BY ea.executed_at DESC NULLS LAST, ea.updated_at DESC
    LIMIT p_limit
  ) t;
  RETURN jsonb_build_object('data', coalesce(rows, '[]'::jsonb));
END;
$$;

COMMENT ON FUNCTION public.enforcement_list_recent_actions(int) IS 'List recent enforcement actions for dashboard. MOH only. Task 1.1.2.37.';
GRANT EXECUTE ON FUNCTION public.enforcement_list_recent_actions(int) TO authenticated;
GRANT EXECUTE ON FUNCTION public.enforcement_list_recent_actions(int) TO service_role;

-- enforcement_list_pending_approvals(p_limit int)
CREATE OR REPLACE FUNCTION public.enforcement_list_pending_approvals(p_limit int DEFAULT 5)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_role text;
  rows jsonb;
BEGIN
  SELECT role INTO v_role FROM public.users WHERE id = auth.uid() AND is_active = true;
  IF NOT FOUND OR v_role IS NULL THEN
    RETURN jsonb_build_object('error', 'unauthorized', 'message', 'not authenticated');
  END IF;
  IF v_role NOT IN ('tier1', 'tier2_officer', 'tier2_registrar', 'system_admin') THEN
    RETURN jsonb_build_object('error', 'forbidden', 'message', 'MOH access only');
  END IF;

  IF p_limit < 1 OR p_limit > 50 THEN p_limit := 5; END IF;

  SELECT jsonb_agg(t) INTO rows
  FROM (
    SELECT ea.id, ea.company_id, c.name AS company_name, ea.action_type, ea.violation_type, ea.status,
           ea.amount, ea.currency, ea.legal_basis, ea.created_at, ea.updated_at
    FROM public.enforcement_actions ea
    JOIN public.companies c ON c.id = ea.company_id
    WHERE ea.status IN ('pending_review', 'pending_approval')
    ORDER BY ea.created_at ASC
    LIMIT p_limit
  ) t;
  RETURN jsonb_build_object('data', coalesce(rows, '[]'::jsonb));
END;
$$;

COMMENT ON FUNCTION public.enforcement_list_pending_approvals(int) IS 'List pending enforcement approvals for dashboard. MOH only. Task 1.1.2.37.';
GRANT EXECUTE ON FUNCTION public.enforcement_list_pending_approvals(int) TO authenticated;
GRANT EXECUTE ON FUNCTION public.enforcement_list_pending_approvals(int) TO service_role;

COMMIT;
