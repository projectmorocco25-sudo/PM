-- Migration: shared_get_history for /history page (Task 1.1.1.20)
-- Description: Role-based history. MOH/auditor -> audit_logs; Company -> registry_submissions (company-scoped).
-- SECURITY DEFINER; applies role-based filtering. Grant to authenticated.
-- Date: 2026-01-27

BEGIN;

CREATE OR REPLACE FUNCTION public.shared_get_history(
  p_start_date timestamptz DEFAULT NULL,
  p_end_date timestamptz DEFAULT NULL,
  p_table_name text DEFAULT NULL,
  p_limit int DEFAULT 50,
  p_offset int DEFAULT 0
)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_role text;
  v_company_id uuid;
  v_user_id uuid;
  out_data jsonb;
  v_total bigint;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RETURN jsonb_build_object('data', '[]'::jsonb, 'total', 0, 'error', 'unauthorized');
  END IF;

  SELECT role, company_id INTO v_role, v_company_id
  FROM public.users
  WHERE id = v_user_id AND is_active = true;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('data', '[]'::jsonb, 'total', 0, 'error', 'user_not_found');
  END IF;

  IF v_role IN ('tier1', 'tier2_officer', 'tier2_registrar', 'auditor', 'system_admin') THEN
    -- MOH/auditor: history from audit_logs
    SELECT count(*) INTO v_total
    FROM public.audit_logs a
    WHERE (p_start_date IS NULL OR a.created_at >= p_start_date)
      AND (p_end_date IS NULL OR a.created_at <= p_end_date)
      AND (p_table_name IS NULL OR p_table_name = '' OR a.table_name = p_table_name);

    SELECT coalesce(jsonb_agg(row_to_json(t)::jsonb ORDER BY t.created_at DESC), '[]'::jsonb) INTO out_data
    FROM (
      SELECT
        a.id,
        'audit'::text AS type,
        a.table_name || ' ' || a.operation_type AS title,
        coalesce(a.reason, '') AS description,
        a.table_name,
        a.record_id,
        a.operation_type,
        '/audit/logs/' || a.id::text AS link,
        a.created_at,
        a.user_id
      FROM public.audit_logs a
      WHERE (p_start_date IS NULL OR a.created_at >= p_start_date)
        AND (p_end_date IS NULL OR a.created_at <= p_end_date)
        AND (p_table_name IS NULL OR p_table_name = '' OR a.table_name = p_table_name)
      ORDER BY a.created_at DESC
      LIMIT greatest(1, least(p_limit, 500))
      OFFSET greatest(0, p_offset)
    ) t;

    RETURN jsonb_build_object('data', coalesce(out_data, '[]'::jsonb), 'total', v_total);
  END IF;

  IF v_role IN ('company_admin', 'company_manager', 'company_user') AND v_company_id IS NOT NULL THEN
    -- Company: history from registry_submissions (company-scoped)
    WITH subs AS (
      SELECT r.id, r.submission_type, r.entity_type, r.entity_id, r.status, r.submitted_by, r.created_at,
             CASE r.entity_type
               WHEN 'company' THEN r.entity_id
               WHEN 'product' THEN (SELECT company_id FROM public.products WHERE id = r.entity_id)
               WHEN 'sku' THEN (SELECT p.company_id FROM public.skus s JOIN public.products p ON p.id = s.product_id WHERE s.id = r.entity_id)
               ELSE NULL
             END AS cid
      FROM public.registry_submissions r
      WHERE (p_start_date IS NULL OR r.created_at >= p_start_date)
        AND (p_end_date IS NULL OR r.created_at <= p_end_date)
    ),
    filtered AS (
      SELECT * FROM subs
      WHERE cid = v_company_id
         OR (entity_type = 'company' AND entity_id IS NULL AND submitted_by = v_user_id)
    )
    SELECT count(*)::bigint INTO v_total FROM filtered;

    SELECT coalesce(jsonb_agg(row_to_json(t)::jsonb ORDER BY t.created_at DESC), '[]'::jsonb) INTO out_data
    FROM (
      SELECT
        f.id,
        'submission'::text AS type,
        'Submission ' || f.submission_type || ' (' || f.status || ')' AS title,
        f.entity_type || ' ' || coalesce(f.entity_id::text, '') AS description,
        'registry_submissions'::text AS table_name,
        f.entity_id AS record_id,
        f.submission_type AS operation_type,
        '/rmm/submissions/' || f.id::text AS link,
        f.created_at,
        f.submitted_by AS user_id
      FROM (
        SELECT * FROM filtered
        ORDER BY created_at DESC
        LIMIT greatest(1, least(p_limit, 500))
        OFFSET greatest(0, p_offset)
      ) f
    ) t;

    RETURN jsonb_build_object('data', coalesce(out_data, '[]'::jsonb), 'total', v_total);
  END IF;

  RETURN jsonb_build_object('data', '[]'::jsonb, 'total', 0);
END;
$$;

COMMENT ON FUNCTION public.shared_get_history(timestamptz, timestamptz, text, int, int)
  IS 'Role-based history for /history. MOH/auditor: audit_logs; Company: registry_submissions. Task 1.1.1.20.';

GRANT EXECUTE ON FUNCTION public.shared_get_history(timestamptz, timestamptz, text, int, int) TO authenticated;
GRANT EXECUTE ON FUNCTION public.shared_get_history(timestamptz, timestamptz, text, int, int) TO service_role;

COMMIT;
