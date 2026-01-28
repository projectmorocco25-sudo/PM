-- Migration: RMM list RPCs for dashboard (1.1.1.11)
-- Description: rmm_list_companies, rmm_list_products, rmm_list_skus, rmm_get_company.
-- Tables: companies, products, skus. RLS applies via SECURITY INVOKER.
-- Date: 2026-01-27

BEGIN;

-- rmm_get_company(p_id uuid) — fetch one company for Welcome line. RLS applies.
CREATE OR REPLACE FUNCTION public.rmm_get_company(p_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
  r record;
BEGIN
  SELECT id, name, registration_number, company_type, contact_email, is_active
  INTO r
  FROM public.companies
  WHERE id = p_id AND is_active = true;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('error', 'not_found', 'company_id', p_id);
  END IF;
  RETURN jsonb_build_object('company', to_jsonb(r));
END;
$$;
COMMENT ON FUNCTION public.rmm_get_company(uuid) IS 'Get one company by id. RLS applies. Dashboard welcome line.';
GRANT EXECUTE ON FUNCTION public.rmm_get_company(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.rmm_get_company(uuid) TO service_role;

-- rmm_list_companies(p_limit int, p_offset int)
CREATE OR REPLACE FUNCTION public.rmm_list_companies(
  p_limit int DEFAULT 50,
  p_offset int DEFAULT 0
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
  IF p_limit < 1 OR p_limit > 500 THEN
    p_limit := 50;
  END IF;
  IF p_offset < 0 THEN
    p_offset := 0;
  END IF;
  SELECT count(*) INTO total FROM public.companies WHERE is_active = true;
  SELECT jsonb_agg(t) INTO rows
  FROM (
    SELECT id, name, registration_number, company_type, contact_email, is_active, created_at
    FROM public.companies
    WHERE is_active = true
    ORDER BY name
    LIMIT p_limit OFFSET p_offset
  ) t;
  RETURN jsonb_build_object('data', coalesce(rows, '[]'::jsonb), 'total', total);
END;
$$;
COMMENT ON FUNCTION public.rmm_list_companies(int, int) IS 'List companies with pagination. RLS applies. Dashboard.';
GRANT EXECUTE ON FUNCTION public.rmm_list_companies(int, int) TO authenticated;
GRANT EXECUTE ON FUNCTION public.rmm_list_companies(int, int) TO service_role;

-- rmm_list_products(p_limit int, p_offset int, p_company_id uuid)
CREATE OR REPLACE FUNCTION public.rmm_list_products(
  p_limit int DEFAULT 50,
  p_offset int DEFAULT 0,
  p_company_id uuid DEFAULT NULL
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
  IF p_limit < 1 OR p_limit > 500 THEN
    p_limit := 50;
  END IF;
  IF p_offset < 0 THEN
    p_offset := 0;
  END IF;
  SELECT count(*) INTO total
  FROM public.products p
  WHERE p.is_active = true
    AND (p_company_id IS NULL OR p.company_id = p_company_id);
  SELECT jsonb_agg(t) INTO rows
  FROM (
    SELECT p.id, p.company_id, p.name, p.description, p.is_critical_medicine, p.is_active, p.created_at,
           c.name AS company_name
    FROM public.products p
    JOIN public.companies c ON c.id = p.company_id
    WHERE p.is_active = true
      AND (p_company_id IS NULL OR p.company_id = p_company_id)
    ORDER BY p.created_at DESC
    LIMIT p_limit OFFSET p_offset
  ) t;
  RETURN jsonb_build_object('data', coalesce(rows, '[]'::jsonb), 'total', total);
END;
$$;
COMMENT ON FUNCTION public.rmm_list_products(int, int, uuid) IS 'List products with optional company filter. RLS applies. Dashboard.';
GRANT EXECUTE ON FUNCTION public.rmm_list_products(int, int, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.rmm_list_products(int, int, uuid) TO service_role;

-- rmm_list_skus(p_limit int, p_offset int, p_product_id uuid)
CREATE OR REPLACE FUNCTION public.rmm_list_skus(
  p_limit int DEFAULT 50,
  p_offset int DEFAULT 0,
  p_product_id uuid DEFAULT NULL
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
  IF p_limit < 1 OR p_limit > 500 THEN
    p_limit := 50;
  END IF;
  IF p_offset < 0 THEN
    p_offset := 0;
  END IF;
  SELECT count(*) INTO total
  FROM public.skus s
  WHERE s.is_active = true
    AND (p_product_id IS NULL OR s.product_id = p_product_id);
  SELECT jsonb_agg(t) INTO rows
  FROM (
    SELECT s.id, s.product_id, s.sku_code, s.name, s.dosage_strength, s.dosage_form,
           s.pack_size, s.unit_of_measure, s.is_active, s.created_at,
           p.name AS product_name, p.company_id
    FROM public.skus s
    JOIN public.products p ON p.id = s.product_id
    WHERE s.is_active = true
      AND (p_product_id IS NULL OR s.product_id = p_product_id)
    ORDER BY s.created_at DESC
    LIMIT p_limit OFFSET p_offset
  ) t;
  RETURN jsonb_build_object('data', coalesce(rows, '[]'::jsonb), 'total', total);
END;
$$;
COMMENT ON FUNCTION public.rmm_list_skus(int, int, uuid) IS 'List SKUs with optional product filter. RLS applies. Dashboard.';
GRANT EXECUTE ON FUNCTION public.rmm_list_skus(int, int, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.rmm_list_skus(int, int, uuid) TO service_role;

COMMIT;
