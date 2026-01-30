-- Migration: rmm_get_product_for_detail (Task 1.1.2.21)
-- Description: Get product by id for detail page; includes inactive products. Returns atc_code, skus_total, skus_active.
-- Tables: products, companies, skus, atc_codes. RLS applies via SECURITY INVOKER.
-- Date: 2026-01-29

BEGIN;

CREATE OR REPLACE FUNCTION public.rmm_get_product_for_detail(p_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
  r record;
  v_atc text;
  v_skus_total int;
  v_skus_active int;
BEGIN
  SELECT p.id, p.company_id, p.name, p.description, p.is_critical_medicine, p.is_active,
         p.created_at, p.updated_at, c.name AS company_name
  INTO r
  FROM public.products p
  JOIN public.companies c ON c.id = p.company_id
  WHERE p.id = p_id;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('error', 'not_found', 'product_id', p_id);
  END IF;

  SELECT (SELECT count(*)::int FROM public.skus s WHERE s.product_id = p_id),
         (SELECT count(*)::int FROM public.skus s WHERE s.product_id = p_id AND s.is_active = true)
  INTO v_skus_total, v_skus_active;

  SELECT ac.code INTO v_atc
  FROM public.skus s
  JOIN public.atc_codes ac ON ac.id = s.atc_code_id
  WHERE s.product_id = p_id AND s.is_active = true
  LIMIT 1;

  RETURN jsonb_build_object(
    'product',
    to_jsonb(r) || jsonb_build_object(
      'atc_code', v_atc,
      'skus_total', coalesce(v_skus_total, 0),
      'skus_active', coalesce(v_skus_active, 0)
    )
  );
END;
$$;

COMMENT ON FUNCTION public.rmm_get_product_for_detail(uuid)
  IS 'Get product by id for detail page (includes inactive). atc_code, skus_total, skus_active. RLS applies. Task 1.1.2.21.';

GRANT EXECUTE ON FUNCTION public.rmm_get_product_for_detail(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.rmm_get_product_for_detail(uuid) TO service_role;

COMMIT;
