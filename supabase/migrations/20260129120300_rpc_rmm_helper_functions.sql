-- Migration: RMM helper RPCs (Task 1.1.2.3a)
-- Description: rmm_list_company_products, rmm_list_product_skus, rmm_get_company_history,
--   rmm_get_product_history, rmm_get_sku_history. List helpers wrap rmm_list_products/rmm_list_skus.
--   History helpers: SECURITY DEFINER, role-based (MOH/auditor -> audit_logs; Company -> registry_submissions).
-- Dependencies: 20260127151300 (list), 20260127151700 (shared_get_history pattern), RMM/audit tables.
-- Date: 2026-01-29

BEGIN;

-- rmm_list_company_products(p_company_id uuid, p_limit int, p_offset int)
-- Wraps rmm_list_products with required company_id. SECURITY INVOKER; RLS applies.
CREATE OR REPLACE FUNCTION public.rmm_list_company_products(
  p_company_id uuid,
  p_limit int DEFAULT 50,
  p_offset int DEFAULT 0
)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  IF p_company_id IS NULL THEN
    RETURN jsonb_build_object('data', '[]'::jsonb, 'total', 0, 'error', 'company_id_required');
  END IF;
  RETURN public.rmm_list_products(
    greatest(1, least(coalesce(p_limit, 50), 500)),
    greatest(0, coalesce(p_offset, 0)),
    p_company_id
  );
END;
$$;
COMMENT ON FUNCTION public.rmm_list_company_products(uuid, int, int)
  IS 'List products for a company. Wraps rmm_list_products. RLS applies. Task 1.1.2.3a.';
GRANT EXECUTE ON FUNCTION public.rmm_list_company_products(uuid, int, int) TO authenticated;
GRANT EXECUTE ON FUNCTION public.rmm_list_company_products(uuid, int, int) TO service_role;

-- rmm_list_product_skus(p_product_id uuid, p_limit int, p_offset int)
-- Wraps rmm_list_skus with required product_id. SECURITY INVOKER; RLS applies.
CREATE OR REPLACE FUNCTION public.rmm_list_product_skus(
  p_product_id uuid,
  p_limit int DEFAULT 50,
  p_offset int DEFAULT 0
)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  IF p_product_id IS NULL THEN
    RETURN jsonb_build_object('data', '[]'::jsonb, 'total', 0, 'error', 'product_id_required');
  END IF;
  RETURN public.rmm_list_skus(
    greatest(1, least(coalesce(p_limit, 50), 500)),
    greatest(0, coalesce(p_offset, 0)),
    p_product_id
  );
END;
$$;
COMMENT ON FUNCTION public.rmm_list_product_skus(uuid, int, int)
  IS 'List SKUs for a product. Wraps rmm_list_skus. RLS applies. Task 1.1.2.3a.';
GRANT EXECUTE ON FUNCTION public.rmm_list_product_skus(uuid, int, int) TO authenticated;
GRANT EXECUTE ON FUNCTION public.rmm_list_product_skus(uuid, int, int) TO service_role;

-- rmm_get_company_history(p_company_id uuid, p_start_date timestamptz, p_end_date timestamptz, p_limit int, p_offset int)
-- Role-based: MOH/auditor -> audit_logs (table_name=companies, record_id=p_company_id);
-- Company -> registry_submissions for this company (entity_type=company, entity_id=p_company_id) if user's company = p_company_id.
CREATE OR REPLACE FUNCTION public.rmm_get_company_history(
  p_company_id uuid,
  p_start_date timestamptz DEFAULT NULL,
  p_end_date timestamptz DEFAULT NULL,
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
  IF p_company_id IS NULL THEN
    RETURN jsonb_build_object('data', '[]'::jsonb, 'total', 0, 'error', 'company_id_required');
  END IF;

  SELECT role, company_id INTO v_role, v_company_id
  FROM public.users
  WHERE id = v_user_id AND is_active = true;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('data', '[]'::jsonb, 'total', 0, 'error', 'user_not_found');
  END IF;

  IF v_role IN ('tier1', 'tier2_officer', 'tier2_registrar', 'auditor', 'system_admin') THEN
    SELECT count(*) INTO v_total
    FROM public.audit_logs a
    WHERE a.table_name = 'companies' AND a.record_id = p_company_id
      AND (p_start_date IS NULL OR a.created_at >= p_start_date)
      AND (p_end_date IS NULL OR a.created_at <= p_end_date);

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
      WHERE a.table_name = 'companies' AND a.record_id = p_company_id
        AND (p_start_date IS NULL OR a.created_at >= p_start_date)
        AND (p_end_date IS NULL OR a.created_at <= p_end_date)
      ORDER BY a.created_at DESC
      LIMIT greatest(1, least(coalesce(p_limit, 50), 500))
      OFFSET greatest(0, coalesce(p_offset, 0))
    ) t;
    RETURN jsonb_build_object('data', coalesce(out_data, '[]'::jsonb), 'total', v_total);
  END IF;

  IF v_role IN ('company_admin', 'company_manager', 'company_user') AND v_company_id = p_company_id THEN
    SELECT count(*)::bigint INTO v_total
    FROM public.registry_submissions r
    WHERE r.entity_type = 'company' AND r.entity_id = p_company_id
      AND (p_start_date IS NULL OR r.created_at >= p_start_date)
      AND (p_end_date IS NULL OR r.created_at <= p_end_date);

    SELECT coalesce(jsonb_agg(row_to_json(t)::jsonb ORDER BY t.created_at DESC), '[]'::jsonb) INTO out_data
    FROM (
      SELECT
        r.id,
        'submission'::text AS type,
        'Submission ' || r.submission_type || ' (' || r.status || ')' AS title,
        r.entity_type || ' ' || coalesce(r.entity_id::text, '') AS description,
        'registry_submissions'::text AS table_name,
        r.entity_id AS record_id,
        r.submission_type AS operation_type,
        '/rmm/submissions/' || r.id::text AS link,
        r.created_at,
        r.submitted_by AS user_id
      FROM public.registry_submissions r
      WHERE r.entity_type = 'company' AND r.entity_id = p_company_id
        AND (p_start_date IS NULL OR r.created_at >= p_start_date)
        AND (p_end_date IS NULL OR r.created_at <= p_end_date)
      ORDER BY r.created_at DESC
      LIMIT greatest(1, least(coalesce(p_limit, 50), 500))
      OFFSET greatest(0, coalesce(p_offset, 0))
    ) t;
    RETURN jsonb_build_object('data', coalesce(out_data, '[]'::jsonb), 'total', v_total);
  END IF;

  RETURN jsonb_build_object('data', '[]'::jsonb, 'total', 0);
END;
$$;
COMMENT ON FUNCTION public.rmm_get_company_history(uuid, timestamptz, timestamptz, int, int)
  IS 'Entity-scoped company history. MOH/auditor: audit_logs; Company: registry_submissions (own company). Task 1.1.2.3a.';
GRANT EXECUTE ON FUNCTION public.rmm_get_company_history(uuid, timestamptz, timestamptz, int, int) TO authenticated;
GRANT EXECUTE ON FUNCTION public.rmm_get_company_history(uuid, timestamptz, timestamptz, int, int) TO service_role;

-- rmm_get_product_history(p_product_id uuid, ...)
-- MOH/auditor: audit_logs (table_name=products, record_id=p_product_id).
-- Company: registry_submissions (entity_type=product, entity_id=p_product_id) only if product.company_id = user company.
CREATE OR REPLACE FUNCTION public.rmm_get_product_history(
  p_product_id uuid,
  p_start_date timestamptz DEFAULT NULL,
  p_end_date timestamptz DEFAULT NULL,
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
  v_product_company_id uuid;
  out_data jsonb;
  v_total bigint;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RETURN jsonb_build_object('data', '[]'::jsonb, 'total', 0, 'error', 'unauthorized');
  END IF;
  IF p_product_id IS NULL THEN
    RETURN jsonb_build_object('data', '[]'::jsonb, 'total', 0, 'error', 'product_id_required');
  END IF;

  SELECT role, company_id INTO v_role, v_company_id
  FROM public.users
  WHERE id = v_user_id AND is_active = true;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('data', '[]'::jsonb, 'total', 0, 'error', 'user_not_found');
  END IF;

  IF v_role IN ('tier1', 'tier2_officer', 'tier2_registrar', 'auditor', 'system_admin') THEN
    SELECT count(*) INTO v_total
    FROM public.audit_logs a
    WHERE a.table_name = 'products' AND a.record_id = p_product_id
      AND (p_start_date IS NULL OR a.created_at >= p_start_date)
      AND (p_end_date IS NULL OR a.created_at <= p_end_date);

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
      WHERE a.table_name = 'products' AND a.record_id = p_product_id
        AND (p_start_date IS NULL OR a.created_at >= p_start_date)
        AND (p_end_date IS NULL OR a.created_at <= p_end_date)
      ORDER BY a.created_at DESC
      LIMIT greatest(1, least(coalesce(p_limit, 50), 500))
      OFFSET greatest(0, coalesce(p_offset, 0))
    ) t;
    RETURN jsonb_build_object('data', coalesce(out_data, '[]'::jsonb), 'total', v_total);
  END IF;

  SELECT company_id INTO v_product_company_id FROM public.products WHERE id = p_product_id;
  IF v_role IN ('company_admin', 'company_manager', 'company_user') AND v_company_id IS NOT NULL AND v_product_company_id = v_company_id THEN
    SELECT count(*)::bigint INTO v_total
    FROM public.registry_submissions r
    WHERE r.entity_type = 'product' AND r.entity_id = p_product_id
      AND (p_start_date IS NULL OR r.created_at >= p_start_date)
      AND (p_end_date IS NULL OR r.created_at <= p_end_date);

    SELECT coalesce(jsonb_agg(row_to_json(t)::jsonb ORDER BY t.created_at DESC), '[]'::jsonb) INTO out_data
    FROM (
      SELECT
        r.id,
        'submission'::text AS type,
        'Submission ' || r.submission_type || ' (' || r.status || ')' AS title,
        r.entity_type || ' ' || coalesce(r.entity_id::text, '') AS description,
        'registry_submissions'::text AS table_name,
        r.entity_id AS record_id,
        r.submission_type AS operation_type,
        '/rmm/submissions/' || r.id::text AS link,
        r.created_at,
        r.submitted_by AS user_id
      FROM public.registry_submissions r
      WHERE r.entity_type = 'product' AND r.entity_id = p_product_id
        AND (p_start_date IS NULL OR r.created_at >= p_start_date)
        AND (p_end_date IS NULL OR r.created_at <= p_end_date)
      ORDER BY r.created_at DESC
      LIMIT greatest(1, least(coalesce(p_limit, 50), 500))
      OFFSET greatest(0, coalesce(p_offset, 0))
    ) t;
    RETURN jsonb_build_object('data', coalesce(out_data, '[]'::jsonb), 'total', v_total);
  END IF;

  RETURN jsonb_build_object('data', '[]'::jsonb, 'total', 0);
END;
$$;
COMMENT ON FUNCTION public.rmm_get_product_history(uuid, timestamptz, timestamptz, int, int)
  IS 'Entity-scoped product history. MOH/auditor: audit_logs; Company: registry_submissions (own product). Task 1.1.2.3a.';
GRANT EXECUTE ON FUNCTION public.rmm_get_product_history(uuid, timestamptz, timestamptz, int, int) TO authenticated;
GRANT EXECUTE ON FUNCTION public.rmm_get_product_history(uuid, timestamptz, timestamptz, int, int) TO service_role;

-- rmm_get_sku_history(p_sku_id uuid, ...)
-- MOH/auditor: audit_logs (table_name=skus, record_id=p_sku_id).
-- Company: registry_submissions (entity_type=sku, entity_id=p_sku_id) only if sku's product.company_id = user company.
CREATE OR REPLACE FUNCTION public.rmm_get_sku_history(
  p_sku_id uuid,
  p_start_date timestamptz DEFAULT NULL,
  p_end_date timestamptz DEFAULT NULL,
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
  v_sku_company_id uuid;
  out_data jsonb;
  v_total bigint;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RETURN jsonb_build_object('data', '[]'::jsonb, 'total', 0, 'error', 'unauthorized');
  END IF;
  IF p_sku_id IS NULL THEN
    RETURN jsonb_build_object('data', '[]'::jsonb, 'total', 0, 'error', 'sku_id_required');
  END IF;

  SELECT role, company_id INTO v_role, v_company_id
  FROM public.users
  WHERE id = v_user_id AND is_active = true;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('data', '[]'::jsonb, 'total', 0, 'error', 'user_not_found');
  END IF;

  IF v_role IN ('tier1', 'tier2_officer', 'tier2_registrar', 'auditor', 'system_admin') THEN
    SELECT count(*) INTO v_total
    FROM public.audit_logs a
    WHERE a.table_name = 'skus' AND a.record_id = p_sku_id
      AND (p_start_date IS NULL OR a.created_at >= p_start_date)
      AND (p_end_date IS NULL OR a.created_at <= p_end_date);

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
      WHERE a.table_name = 'skus' AND a.record_id = p_sku_id
        AND (p_start_date IS NULL OR a.created_at >= p_start_date)
        AND (p_end_date IS NULL OR a.created_at <= p_end_date)
      ORDER BY a.created_at DESC
      LIMIT greatest(1, least(coalesce(p_limit, 50), 500))
      OFFSET greatest(0, coalesce(p_offset, 0))
    ) t;
    RETURN jsonb_build_object('data', coalesce(out_data, '[]'::jsonb), 'total', v_total);
  END IF;

  SELECT p.company_id INTO v_sku_company_id
  FROM public.skus s
  JOIN public.products p ON p.id = s.product_id
  WHERE s.id = p_sku_id;
  IF v_role IN ('company_admin', 'company_manager', 'company_user') AND v_company_id IS NOT NULL AND v_sku_company_id = v_company_id THEN
    SELECT count(*)::bigint INTO v_total
    FROM public.registry_submissions r
    WHERE r.entity_type = 'sku' AND r.entity_id = p_sku_id
      AND (p_start_date IS NULL OR r.created_at >= p_start_date)
      AND (p_end_date IS NULL OR r.created_at <= p_end_date);

    SELECT coalesce(jsonb_agg(row_to_json(t)::jsonb ORDER BY t.created_at DESC), '[]'::jsonb) INTO out_data
    FROM (
      SELECT
        r.id,
        'submission'::text AS type,
        'Submission ' || r.submission_type || ' (' || r.status || ')' AS title,
        r.entity_type || ' ' || coalesce(r.entity_id::text, '') AS description,
        'registry_submissions'::text AS table_name,
        r.entity_id AS record_id,
        r.submission_type AS operation_type,
        '/rmm/submissions/' || r.id::text AS link,
        r.created_at,
        r.submitted_by AS user_id
      FROM public.registry_submissions r
      WHERE r.entity_type = 'sku' AND r.entity_id = p_sku_id
        AND (p_start_date IS NULL OR r.created_at >= p_start_date)
        AND (p_end_date IS NULL OR r.created_at <= p_end_date)
      ORDER BY r.created_at DESC
      LIMIT greatest(1, least(coalesce(p_limit, 50), 500))
      OFFSET greatest(0, coalesce(p_offset, 0))
    ) t;
    RETURN jsonb_build_object('data', coalesce(out_data, '[]'::jsonb), 'total', v_total);
  END IF;

  RETURN jsonb_build_object('data', '[]'::jsonb, 'total', 0);
END;
$$;
COMMENT ON FUNCTION public.rmm_get_sku_history(uuid, timestamptz, timestamptz, int, int)
  IS 'Entity-scoped SKU history. MOH/auditor: audit_logs; Company: registry_submissions (own SKU). Task 1.1.2.3a.';
GRANT EXECUTE ON FUNCTION public.rmm_get_sku_history(uuid, timestamptz, timestamptz, int, int) TO authenticated;
GRANT EXECUTE ON FUNCTION public.rmm_get_sku_history(uuid, timestamptz, timestamptz, int, int) TO service_role;

COMMIT;
