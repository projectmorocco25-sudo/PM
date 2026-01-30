-- Migration: rmm_get_sku_for_detail for SKU detail page (Task 1.1.2.24)
-- Description: Get SKU by id for detail page; includes inactive SKUs. Returns company_name, atc_code.
-- Tables: skus, products, companies, atc_codes. RLS applies via SECURITY INVOKER.
-- Date: 2026-01-29

BEGIN;

CREATE OR REPLACE FUNCTION public.rmm_get_sku_for_detail(p_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
  r record;
  v_atc_code text;
BEGIN
  SELECT s.id, s.product_id, s.sku_code, s.name, s.dosage_strength, s.dosage_form,
         s.pack_size, s.unit_of_measure, s.atc_code_id, s.is_moh_authorized_unregistered, s.is_active,
         s.created_at, s.updated_at,
         p.name AS product_name, p.company_id,
         c.name AS company_name
  INTO r
  FROM public.skus s
  JOIN public.products p ON p.id = s.product_id
  JOIN public.companies c ON c.id = p.company_id
  WHERE s.id = p_id;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('error', 'not_found', 'sku_id', p_id);
  END IF;

  IF r.atc_code_id IS NOT NULL THEN
    SELECT ac.code INTO v_atc_code FROM public.atc_codes ac WHERE ac.id = r.atc_code_id;
  END IF;

  RETURN jsonb_build_object(
    'sku',
    to_jsonb(r) || jsonb_build_object('atc_code', v_atc_code)
  );
END;
$$;

COMMENT ON FUNCTION public.rmm_get_sku_for_detail(uuid)
  IS 'Get SKU by id for detail page (includes inactive). Returns company_name, atc_code. RLS applies. Task 1.1.2.24.';

GRANT EXECUTE ON FUNCTION public.rmm_get_sku_for_detail(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.rmm_get_sku_for_detail(uuid) TO service_role;

COMMIT;
