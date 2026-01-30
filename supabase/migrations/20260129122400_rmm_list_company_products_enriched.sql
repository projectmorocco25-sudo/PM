-- Migration: Enrich rmm_list_company_products for Company products page (Task 1.1.2.18.1)
-- Description: Return sku_count and atc_code per product; include inactive products for Status column;
--   add optional p_search for name filter. SECURITY INVOKER; RLS applies.
-- Dependencies: 20260129120300 (rmm_list_company_products), atc_codes, skus, products, companies.
-- Date: 2026-01-29

BEGIN;

DROP FUNCTION IF EXISTS public.rmm_list_company_products(uuid, int, int);

CREATE OR REPLACE FUNCTION public.rmm_list_company_products(
  p_company_id uuid,
  p_limit int DEFAULT 50,
  p_offset int DEFAULT 0,
  p_search text DEFAULT NULL
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
BEGIN
  IF p_company_id IS NULL THEN
    RETURN jsonb_build_object('data', '[]'::jsonb, 'total', 0, 'error', 'company_id_required');
  END IF;

  SELECT count(*) INTO total
  FROM public.products p
  WHERE p.company_id = p_company_id
    AND (p_search IS NULL OR trim(p_search) = '' OR p.name ILIKE '%' || trim(p_search) || '%');

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
    WHERE p.company_id = p_company_id
      AND (p_search IS NULL OR trim(p_search) = '' OR p.name ILIKE '%' || trim(p_search) || '%')
    ORDER BY p.created_at DESC
    LIMIT greatest(1, least(coalesce(p_limit, 50), 500)) OFFSET greatest(0, coalesce(p_offset, 0))
  ) t;

  RETURN jsonb_build_object('data', coalesce(rows, '[]'::jsonb), 'total', total);
END;
$$;

COMMENT ON FUNCTION public.rmm_list_company_products(uuid, int, int, text)
  IS 'List products for a company with sku_count and atc_code. Optional name search. RLS applies. Task 1.1.2.18.1.';

GRANT EXECUTE ON FUNCTION public.rmm_list_company_products(uuid, int, int, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.rmm_list_company_products(uuid, int, int, text) TO service_role;

COMMIT;
