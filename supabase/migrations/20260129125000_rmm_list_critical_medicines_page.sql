-- Migration: Extend rmm_list_critical_medicines for Critical Medicines list page (Task 1.1.2.30)
-- Description: Add overload with p_search, p_status, p_company_id, p_atc_first_letter, p_designated_from, p_designated_to; return company_name.
-- Tables: critical_medicines, skus, products, companies, atc_codes. RLS unchanged (SECURITY INVOKER).
-- Date: 2026-01-29

BEGIN;

CREATE OR REPLACE FUNCTION public.rmm_list_critical_medicines(
  p_limit int DEFAULT 50,
  p_offset int DEFAULT 0,
  p_sku_id uuid DEFAULT NULL,
  p_search text DEFAULT NULL,
  p_status text DEFAULT 'active',
  p_company_id uuid DEFAULT NULL,
  p_atc_first_letter text DEFAULT NULL,
  p_designated_from timestamptz DEFAULT NULL,
  p_designated_to timestamptz DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
  total bigint;
  rows jsonb;
  v_search text;
  v_status text;
  v_atc text;
BEGIN
  IF p_limit < 1 OR p_limit > 500 THEN
    p_limit := 50;
  END IF;
  IF p_offset < 0 THEN
    p_offset := 0;
  END IF;
  v_search := NULLIF(trim(p_search), '');
  v_status := CASE WHEN p_status IN ('all', 'active', 'inactive') THEN p_status ELSE 'active' END;
  v_atc := NULLIF(trim(p_atc_first_letter), '');

  WITH base AS (
    SELECT
      cm.id,
      cm.sku_id,
      cm.designated_at,
      cm.designated_by,
      cm.is_active,
      cm.created_at,
      cm.updated_at,
      s.sku_code,
      s.name AS sku_name,
      s.dosage_strength,
      s.dosage_form,
      p.id AS product_id,
      p.name AS product_name,
      p.company_id,
      c.name AS company_name
    FROM public.critical_medicines cm
    JOIN public.skus s ON s.id = cm.sku_id
    JOIN public.products p ON p.id = s.product_id
    JOIN public.companies c ON c.id = p.company_id
    LEFT JOIN public.atc_codes ac ON ac.id = p.atc_code_id
    WHERE (p_sku_id IS NULL OR cm.sku_id = p_sku_id)
      AND (v_status = 'all' OR (v_status = 'active' AND cm.is_active = true) OR (v_status = 'inactive' AND cm.is_active = false))
      AND (p_company_id IS NULL OR p.company_id = p_company_id)
      AND (v_atc IS NULL OR length(v_atc) < 1 OR (ac.code IS NOT NULL AND left(upper(ac.code), 1) = upper(left(v_atc, 1))))
      AND (p_designated_from IS NULL OR cm.designated_at >= p_designated_from)
      AND (p_designated_to IS NULL OR cm.designated_at <= p_designated_to)
      AND (v_search IS NULL OR (
        s.sku_code ILIKE '%' || v_search || '%'
        OR s.name ILIKE '%' || v_search || '%'
        OR p.name ILIKE '%' || v_search || '%'
        OR c.name ILIKE '%' || v_search || '%'
      ))
  ),
  counted AS (SELECT count(*) AS total FROM base),
  paged AS (
    SELECT id, sku_id, designated_at, designated_by, is_active, created_at, updated_at,
           sku_code, sku_name, dosage_strength, dosage_form, product_id, product_name, company_id, company_name
    FROM base
    ORDER BY designated_at DESC
    LIMIT p_limit OFFSET p_offset
  )
  SELECT
    (SELECT counted.total FROM counted),
    (SELECT coalesce(jsonb_agg(t), '[]'::jsonb) FROM (SELECT * FROM paged) t)
  INTO total, rows;

  RETURN jsonb_build_object('data', coalesce(rows, '[]'::jsonb), 'total', total);
END;
$$;

COMMENT ON FUNCTION public.rmm_list_critical_medicines(int, int, uuid, text, text, uuid, text, timestamptz, timestamptz) IS 'List critical medicines for list page: search, status, company, ATC, date range. Returns company_name. Task 1.1.2.30.';
GRANT EXECUTE ON FUNCTION public.rmm_list_critical_medicines(int, int, uuid, text, text, uuid, text, timestamptz, timestamptz) TO authenticated;
GRANT EXECUTE ON FUNCTION public.rmm_list_critical_medicines(int, int, uuid, text, text, uuid, text, timestamptz, timestamptz) TO service_role;

COMMIT;
