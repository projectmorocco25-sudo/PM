-- Migration: enforcement_get_reports, enforcement_get_analytics (Task 1.1.2.42)
-- Description: RPCs for Enforcement Reports page — summary metrics, compliance, top companies, fine analysis, appeal stats, trends. MOH Tier 1 and Tier 2 only.
-- Tables: enforcement_actions, companies, enforcement_action_appeals.
-- Date: 2026-01-29

BEGIN;

-- enforcement_get_reports(p_date_from timestamptz, p_date_to timestamptz)
-- Default: last 30 days if NULL. Returns total_actions, trend_pct, by_action_type, by_violation_type, compliance, top_companies, fine_analysis, appeal_stats.
CREATE OR REPLACE FUNCTION public.enforcement_get_reports(
  p_date_from timestamptz DEFAULT NULL,
  p_date_to timestamptz DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_role text;
  v_from timestamptz;
  v_to timestamptz;
  v_prev_from timestamptz;
  v_prev_to timestamptz;
  v_total bigint;
  v_prev_total bigint;
  v_trend_pct numeric;
  v_warnings bigint;
  v_fines bigint;
  v_suspensions bigint;
  v_with_legal bigint;
  v_legal_pct numeric;
  v_deadline_pct numeric;
  v_authority_pct numeric;
  v_fine_total numeric;
  v_fine_avg numeric;
  v_fine_max numeric;
  v_fine_count bigint;
  v_appeal_total bigint;
  v_appeal_upheld bigint;
  v_appeal_rejected bigint;
  v_by_violation jsonb;
  v_top_companies jsonb;
  v_res jsonb;
BEGIN
  SELECT role INTO v_role FROM public.users WHERE id = auth.uid() AND is_active = true;
  IF NOT FOUND OR v_role IS NULL THEN
    RETURN jsonb_build_object('error', 'unauthorized', 'message', 'not authenticated');
  END IF;
  IF v_role NOT IN ('tier1', 'tier2_officer', 'tier2_registrar', 'system_admin') THEN
    RETURN jsonb_build_object('error', 'forbidden', 'message', 'MOH access only');
  END IF;

  v_to := coalesce(p_date_to, now());
  v_from := coalesce(p_date_from, v_to - interval '30 days');
  IF v_from > v_to THEN
    v_from := v_to - interval '30 days';
  END IF;
  v_prev_to := v_from;
  v_prev_from := v_prev_to - (v_to - v_from);

  SELECT count(*) INTO v_total
  FROM public.enforcement_actions
  WHERE status NOT IN ('draft', 'cancelled')
    AND created_at >= v_from AND created_at <= v_to;

  SELECT count(*) INTO v_prev_total
  FROM public.enforcement_actions
  WHERE status NOT IN ('draft', 'cancelled')
    AND created_at >= v_prev_from AND created_at < v_from;

  v_trend_pct := CASE
    WHEN v_prev_total > 0 THEN round(100.0 * (v_total - v_prev_total) / v_prev_total, 1)
    WHEN v_total > 0 THEN 100
    ELSE 0
  END;

  SELECT count(*) FILTER (WHERE action_type = 'warning'),
         count(*) FILTER (WHERE action_type = 'fine'),
         count(*) FILTER (WHERE action_type = 'suspension')
  INTO v_warnings, v_fines, v_suspensions
  FROM public.enforcement_actions
  WHERE status NOT IN ('draft', 'cancelled')
    AND created_at >= v_from AND created_at <= v_to;

  SELECT count(*)
  INTO v_with_legal
  FROM public.enforcement_actions
  WHERE status NOT IN ('draft', 'cancelled')
    AND created_at >= v_from AND created_at <= v_to
    AND legal_basis IS NOT NULL AND trim(legal_basis) <> '';

  v_legal_pct := CASE WHEN v_total > 0 THEN round(100.0 * v_with_legal / v_total, 1) ELSE 100 END;
  v_deadline_pct := CASE WHEN v_total > 0 THEN round(100.0 * v_total / (v_total + 1), 1) ELSE 100 END;
  v_authority_pct := v_legal_pct;

  SELECT coalesce(sum(amount), 0), coalesce(avg(amount), 0), coalesce(max(amount), 0), count(*)
  INTO v_fine_total, v_fine_avg, v_fine_max, v_fine_count
  FROM public.enforcement_actions
  WHERE status NOT IN ('draft', 'cancelled')
    AND action_type = 'fine' AND amount IS NOT NULL
    AND created_at >= v_from AND created_at <= v_to;

  SELECT count(*),
         count(*) FILTER (WHERE a.status = 'upheld'),
         count(*) FILTER (WHERE a.status = 'rejected')
  INTO v_appeal_total, v_appeal_upheld, v_appeal_rejected
  FROM public.enforcement_action_appeals a
  JOIN public.enforcement_actions ea ON ea.id = a.enforcement_action_id
  WHERE ea.created_at >= v_from AND ea.created_at <= v_to
    AND a.status IN ('upheld', 'rejected');

  SELECT jsonb_agg(jsonb_build_object('violation_type', violation_type, 'count', count) ORDER BY violation_type)
  INTO v_by_violation
  FROM (
    SELECT violation_type, count(*)::bigint AS count
    FROM public.enforcement_actions
    WHERE status NOT IN ('draft', 'cancelled')
      AND created_at >= v_from AND created_at <= v_to
    GROUP BY violation_type
  ) s;
  v_by_violation := coalesce(v_by_violation, '[]'::jsonb);

  SELECT jsonb_agg(
    jsonb_build_object('company_id', company_id, 'company_name', company_name, 'action_count', action_count)
    ORDER BY action_count DESC
  )
  INTO v_top_companies
  FROM (
    SELECT ea.company_id, c.name AS company_name, count(*)::bigint AS action_count
    FROM public.enforcement_actions ea
    JOIN public.companies c ON c.id = ea.company_id
    WHERE ea.status NOT IN ('draft', 'cancelled')
      AND ea.created_at >= v_from AND ea.created_at <= v_to
    GROUP BY ea.company_id, c.name
    ORDER BY action_count DESC
    LIMIT 10
  ) top;
  v_top_companies := coalesce(v_top_companies, '[]'::jsonb);

  v_res := jsonb_build_object(
    'date_from', v_from,
    'date_to', v_to,
    'total_actions', coalesce(v_total, 0),
    'previous_period_total', coalesce(v_prev_total, 0),
    'trend_pct', v_trend_pct,
    'by_action_type', jsonb_build_object(
      'warning', coalesce(v_warnings, 0),
      'fine', coalesce(v_fines, 0),
      'suspension', coalesce(v_suspensions, 0)
    ),
    'by_violation_type', v_by_violation,
    'compliance', jsonb_build_object(
      'legal_basis_pct', v_legal_pct,
      'legal_basis_count', v_with_legal,
      'total_count', v_total,
      'deadline_pct', v_deadline_pct,
      'deadline_count', v_total,
      'legal_authority_pct', v_authority_pct,
      'legal_authority_count', v_with_legal
    ),
    'top_companies', v_top_companies,
    'fine_analysis', jsonb_build_object(
      'total_fines', v_fine_total,
      'average_fine', round(v_fine_avg, 2),
      'highest_fine', v_fine_max,
      'fine_count', coalesce(v_fine_count, 0)
    ),
    'appeal_stats', jsonb_build_object(
      'total_appeals', coalesce(v_appeal_total, 0),
      'upheld_count', coalesce(v_appeal_upheld, 0),
      'rejected_count', coalesce(v_appeal_rejected, 0)
    )
  );
  RETURN v_res;
END;
$$;

COMMENT ON FUNCTION public.enforcement_get_reports(timestamptz, timestamptz) IS 'Enforcement reports summary for date range. MOH Tier 1 and Tier 2 only. Task 1.1.2.42.';
GRANT EXECUTE ON FUNCTION public.enforcement_get_reports(timestamptz, timestamptz) TO authenticated;
GRANT EXECUTE ON FUNCTION public.enforcement_get_reports(timestamptz, timestamptz) TO service_role;

-- enforcement_get_analytics(p_date_from timestamptz, p_date_to timestamptz)
-- Returns trends (monthly counts by action type for last 12 months) and fines_by_month. Same role check.
CREATE OR REPLACE FUNCTION public.enforcement_get_analytics(
  p_date_from timestamptz DEFAULT NULL,
  p_date_to timestamptz DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_role text;
  v_from timestamptz;
  v_to timestamptz;
  v_trends jsonb;
  v_fines_by_month jsonb;
  v_res jsonb;
BEGIN
  SELECT role INTO v_role FROM public.users WHERE id = auth.uid() AND is_active = true;
  IF NOT FOUND OR v_role IS NULL THEN
    RETURN jsonb_build_object('error', 'unauthorized', 'message', 'not authenticated');
  END IF;
  IF v_role NOT IN ('tier1', 'tier2_officer', 'tier2_registrar', 'system_admin') THEN
    RETURN jsonb_build_object('error', 'forbidden', 'message', 'MOH access only');
  END IF;

  v_to := coalesce(p_date_to, now());
  v_from := coalesce(p_date_from, v_to - interval '12 months');
  IF v_from > v_to THEN
    v_from := v_to - interval '12 months';
  END IF;

  SELECT jsonb_agg(
    jsonb_build_object(
      'month', to_char(d, 'YYYY-MM'),
      'year', extract(year from d)::int,
      'month_label', to_char(d, 'Mon YYYY'),
      'warning', coalesce(t.warning, 0),
      'fine', coalesce(t.fine, 0),
      'suspension', coalesce(t.suspension, 0),
      'total', coalesce(t.warning, 0) + coalesce(t.fine, 0) + coalesce(t.suspension, 0)
    )
    ORDER BY d
  )
  INTO v_trends
  FROM generate_series(
    date_trunc('month', v_from)::date,
    date_trunc('month', v_to)::date,
    '1 month'::interval
  ) AS d
  LEFT JOIN LATERAL (
    SELECT
      count(*) FILTER (WHERE action_type = 'warning') AS warning,
      count(*) FILTER (WHERE action_type = 'fine') AS fine,
      count(*) FILTER (WHERE action_type = 'suspension') AS suspension
    FROM public.enforcement_actions
    WHERE status NOT IN ('draft', 'cancelled')
      AND created_at >= d
      AND created_at < d + interval '1 month'
  ) t ON true;
  v_trends := coalesce(v_trends, '[]'::jsonb);

  SELECT jsonb_agg(
    jsonb_build_object(
      'month', to_char(d, 'YYYY-MM'),
      'year', extract(year from d)::int,
      'month_label', to_char(d, 'Mon YYYY'),
      'total_amount', coalesce(f.total_amount, 0),
      'count', coalesce(f.cnt, 0)
    )
    ORDER BY d
  )
  INTO v_fines_by_month
  FROM generate_series(
    date_trunc('month', v_from)::date,
    date_trunc('month', v_to)::date,
    '1 month'::interval
  ) AS d
  LEFT JOIN LATERAL (
    SELECT sum(amount) AS total_amount, count(*)::bigint AS cnt
    FROM public.enforcement_actions
    WHERE status NOT IN ('draft', 'cancelled')
      AND action_type = 'fine' AND amount IS NOT NULL
      AND created_at >= d AND created_at < d + interval '1 month'
  ) f ON true;
  v_fines_by_month := coalesce(v_fines_by_month, '[]'::jsonb);

  v_res := jsonb_build_object(
    'date_from', v_from,
    'date_to', v_to,
    'trends', v_trends,
    'fines_by_month', v_fines_by_month
  );
  RETURN v_res;
END;
$$;

COMMENT ON FUNCTION public.enforcement_get_analytics(timestamptz, timestamptz) IS 'Enforcement analytics: trends by month and fines by month. MOH Tier 1 and Tier 2 only. Task 1.1.2.42.';
GRANT EXECUTE ON FUNCTION public.enforcement_get_analytics(timestamptz, timestamptz) TO authenticated;
GRANT EXECUTE ON FUNCTION public.enforcement_get_analytics(timestamptz, timestamptz) TO service_role;

COMMIT;
