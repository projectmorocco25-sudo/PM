-- Migration: rmm_list_products_page for Products list page (Task 1.1.2.20)
-- Description: List products with search, company/status/critical/ATC filters; sku_count, atc_code per row.
--   SECURITY INVOKER; RLS applies. Company users see own company only.
-- Dependencies: products, companies, skus, atc_codes. rmm_list_products unchanged.
-- Date: 2026-01-29

BEGIN;

CREATE OR REPLACE FUNCTION public.rmm_list_products_page(
  p_limit int DEFAULT 50,
  p_offset int DEFAULT 0,
  p_search text DEFAULT NULL,
  p_company_id uuid DEFAULT NULL,
  p_status text DEFAULT 'active',
  p_is_critical text DEFAULT 'all',
  p_atc_code text DEFAULT NULL
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
  v_status text;
  v_critical text;
BEGIN
  IF p_limit < 1 OR p_limit > 500 THEN
    p_limit := 50;
  END IF;
  IF p_offset < 0 THEN
    p_offset := 0;
  END IF;
  v_status := coalesce(nullif(lower(trim(coalesce(p_status, 'active'))), ''), 'active');
  IF v_status NOT IN ('all', 'active', 'inactive') THEN
    v_status := 'active';
  END IF;
  v_critical := coalesce(nullif(lower(trim(coalesce(p_is_critical, 'all'))), ''), 'all');
  IF v_critical NOT IN ('all', 'true', 'false') THEN
    v_critical := 'all';
  END IF;

  SELECT count(*) INTO total
  FROM public.products p
  JOIN public.companies c ON c.id = p.company_id
  WHERE (p_company_id IS NULL OR p.company_id = p_company_id)
    AND (p_search IS NULL OR p_search = '' OR p.name ILIKE '%' || trim(p_search) || '%' OR (p.description IS NOT NULL AND p.description ILIKE '%' || trim(p_search) || '%'))
    AND (v_status = 'all' OR (v_status = 'active' AND p.is_active = true) OR (v_status = 'inactive' AND p.is_active = false))
    AND (v_critical = 'all' OR (v_critical = 'true' AND p.is_critical_medicine = true) OR (v_critical = 'false' AND p.is_critical_medicine = false))
    AND (p_atc_code IS NULL OR p_atc_code = '' OR EXISTS (
      SELECT 1 FROM public.skus s
      JOIN public.atc_codes ac ON ac.id = s.atc_code_id
      WHERE s.product_id = p.id AND s.is_active = true
        AND ac.code ILIKE trim(p_atc_code)
    ));

  SELECT jsonb_agg(row_to_json(t)::jsonb) INTO rows
  FROM (
    SELECT
      p.id,
      p.company_id,
      p.name,
      p.description,
      p.is_critical_medicine,
      p.is_active,
      p.created_at,
      c.name AS company_name,
      (SELECT count(*)::int FROM public.skus s WHERE s.product_id = p.id AND s.is_active = true) AS sku_count,
      (SELECT ac.code FROM public.skus s
       JOIN public.atc_codes ac ON ac.id = s.atc_code_id
       WHERE s.product_id = p.id AND s.is_active = true
       LIMIT 1) AS atc_code
    FROM public.products p
    JOIN public.companies c ON c.id = p.company_id
    WHERE (p_company_id IS NULL OR p.company_id = p_company_id)
      AND (p_search IS NULL OR p_search = '' OR p.name ILIKE '%' || trim(p_search) || '%' OR (p.description IS NOT NULL AND p.description ILIKE '%' || trim(p_search) || '%'))
      AND (v_status = 'all' OR (v_status = 'active' AND p.is_active = true) OR (v_status = 'inactive' AND p.is_active = false))
      AND (v_critical = 'all' OR (v_critical = 'true' AND p.is_critical_medicine = true) OR (v_critical = 'false' AND p.is_critical_medicine = false))
      AND (p_atc_code IS NULL OR p_atc_code = '' OR EXISTS (
        SELECT 1 FROM public.skus s
        JOIN public.atc_codes ac ON ac.id = s.atc_code_id
        WHERE s.product_id = p.id AND s.is_active = true
          AND ac.code = trim(p_atc_code)
      ))
    ORDER BY p.created_at DESC
    LIMIT p_limit OFFSET p_offset
  ) t;

  RETURN jsonb_build_object('data', coalesce(rows, '[]'::jsonb), 'total', total);
END;
$$;

COMMENT ON FUNCTION public.rmm_list_products_page(int, int, text, uuid, text, text, text)
  IS 'List products for list page: search, company/status/critical/ATC filters; sku_count, atc_code. RLS applies. Task 1.1.2.20.';

GRANT EXECUTE ON FUNCTION public.rmm_list_products_page(int, int, text, uuid, text, text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.rmm_list_products_page(int, int, text, uuid, text, text, text) TO service_role;

COMMIT;
