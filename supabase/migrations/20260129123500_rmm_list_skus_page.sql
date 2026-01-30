-- Migration: rmm_list_skus_page for SKUs list page (Task 1.1.2.23)
-- Description: List SKUs with search, product/status/dosage_form/ATC filters; atc_code per row.
--   SECURITY INVOKER; RLS applies. Company users see own company SKUs only.
-- Dependencies: skus, products, companies, atc_codes. rmm_list_skus unchanged.
-- Date: 2026-01-29

BEGIN;

CREATE OR REPLACE FUNCTION public.rmm_list_skus_page(
  p_limit int DEFAULT 50,
  p_offset int DEFAULT 0,
  p_search text DEFAULT NULL,
  p_product_id uuid DEFAULT NULL,
  p_status text DEFAULT 'active',
  p_dosage_form text DEFAULT NULL,
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
  v_search text;
  v_form text;
  v_atc text;
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
  v_search := nullif(trim(coalesce(p_search, '')), '');
  v_form := nullif(trim(coalesce(p_dosage_form, '')), '');
  v_atc := nullif(trim(coalesce(p_atc_code, '')), '');

  SELECT count(*) INTO total
  FROM public.skus s
  JOIN public.products p ON p.id = s.product_id
  LEFT JOIN public.atc_codes ac ON ac.id = s.atc_code_id
  WHERE (p_product_id IS NULL OR s.product_id = p_product_id)
    AND (v_search IS NULL OR s.sku_code ILIKE '%' || v_search || '%' OR s.name ILIKE '%' || v_search || '%'
         OR (s.dosage_strength IS NOT NULL AND s.dosage_strength ILIKE '%' || v_search || '%'))
    AND (v_status = 'all' OR (v_status = 'active' AND s.is_active = true) OR (v_status = 'inactive' AND s.is_active = false))
    AND (v_form IS NULL OR v_form = 'all' OR s.dosage_form = v_form)
    AND (v_atc IS NULL OR ac.code = v_atc);

  SELECT jsonb_agg(row_to_json(t)::jsonb) INTO rows
  FROM (
    SELECT
      s.id,
      s.product_id,
      p.company_id,
      p.name AS product_name,
      s.sku_code,
      s.name,
      s.dosage_strength,
      s.dosage_form,
      s.pack_size,
      s.unit_of_measure,
      ac.code AS atc_code,
      s.is_active,
      s.created_at
    FROM public.skus s
    JOIN public.products p ON p.id = s.product_id
    LEFT JOIN public.atc_codes ac ON ac.id = s.atc_code_id
    WHERE (p_product_id IS NULL OR s.product_id = p_product_id)
      AND (v_search IS NULL OR s.sku_code ILIKE '%' || v_search || '%' OR s.name ILIKE '%' || v_search || '%'
           OR (s.dosage_strength IS NOT NULL AND s.dosage_strength ILIKE '%' || v_search || '%'))
      AND (v_status = 'all' OR (v_status = 'active' AND s.is_active = true) OR (v_status = 'inactive' AND s.is_active = false))
      AND (v_form IS NULL OR v_form = 'all' OR s.dosage_form = v_form)
      AND (v_atc IS NULL OR ac.code = v_atc)
    ORDER BY s.created_at DESC
    LIMIT p_limit OFFSET p_offset
  ) t;

  RETURN jsonb_build_object('data', coalesce(rows, '[]'::jsonb), 'total', total);
END;
$$;

COMMENT ON FUNCTION public.rmm_list_skus_page(int, int, text, uuid, text, text, text)
  IS 'List SKUs for list page: search (code/name/dosage), product/status/dosage_form/ATC filters; atc_code. RLS applies. Task 1.1.2.23.';

GRANT EXECUTE ON FUNCTION public.rmm_list_skus_page(int, int, text, uuid, text, text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.rmm_list_skus_page(int, int, text, uuid, text, text, text) TO service_role;

COMMIT;
