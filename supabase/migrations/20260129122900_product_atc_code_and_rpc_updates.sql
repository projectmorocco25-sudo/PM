-- Migration: Product atc_code_id + RPC updates (Task 1.1.2.22)
-- Description: Add atc_code_id to products; extend rmm_create_product, rmm_update_product, rmm_get_product_for_detail.
-- Tables: products, atc_codes. RLS applies via SECURITY INVOKER.
-- Date: 2026-01-29

BEGIN;

ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS atc_code_id uuid REFERENCES public.atc_codes(id);

DROP FUNCTION IF EXISTS public.rmm_create_product(uuid, text, text, boolean);

CREATE OR REPLACE FUNCTION public.rmm_create_product(
  p_company_id uuid,
  p_name text,
  p_description text DEFAULT NULL,
  p_is_critical_medicine boolean DEFAULT false,
  p_atc_code_id uuid DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
  v_id uuid;
  r record;
BEGIN
  IF p_company_id IS NULL THEN
    RETURN jsonb_build_object('error', 'validation_error', 'message', 'company_id is required');
  END IF;
  IF p_name IS NULL OR trim(p_name) = '' THEN
    RETURN jsonb_build_object('error', 'validation_error', 'message', 'name is required');
  END IF;

  INSERT INTO public.products (company_id, name, description, is_critical_medicine, atc_code_id)
  VALUES (
    p_company_id,
    trim(p_name),
    NULLIF(trim(coalesce(p_description, '')), ''),
    COALESCE(p_is_critical_medicine, false),
    p_atc_code_id
  )
  RETURNING id INTO v_id;

  SELECT p.id, p.company_id, p.name, p.description, p.is_critical_medicine, p.is_active, p.atc_code_id,
         p.created_at, p.updated_at, c.name AS company_name
  INTO r
  FROM public.products p
  JOIN public.companies c ON c.id = p.company_id
  WHERE p.id = v_id;

  RETURN jsonb_build_object('product', to_jsonb(r));
EXCEPTION
  WHEN foreign_key_violation THEN
    RETURN jsonb_build_object('error', 'validation_error', 'message', 'company_id or atc_code_id not found');
END;
$$;

COMMENT ON FUNCTION public.rmm_create_product(uuid, text, text, boolean, uuid)
  IS 'Create product. Optional atc_code_id. RLS applies (MOH only). Task 1.1.2.22.';
GRANT EXECUTE ON FUNCTION public.rmm_create_product(uuid, text, text, boolean, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.rmm_create_product(uuid, text, text, boolean, uuid) TO service_role;

DROP FUNCTION IF EXISTS public.rmm_update_product(uuid, text, text, boolean);

CREATE OR REPLACE FUNCTION public.rmm_update_product(
  p_id uuid,
  p_name text DEFAULT NULL,
  p_description text DEFAULT NULL,
  p_is_critical_medicine boolean DEFAULT NULL,
  p_is_active boolean DEFAULT NULL,
  p_atc_code_id uuid DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
  r record;
BEGIN
  IF p_id IS NULL THEN
    RETURN jsonb_build_object('error', 'validation_error', 'message', 'id is required');
  END IF;
  IF p_name IS NOT NULL AND trim(p_name) = '' THEN
    RETURN jsonb_build_object('error', 'validation_error', 'message', 'name cannot be empty');
  END IF;

  UPDATE public.products
  SET
    name = COALESCE(NULLIF(trim(p_name), ''), name),
    description = CASE WHEN p_description IS NOT NULL THEN NULLIF(trim(p_description), '') ELSE description END,
    is_critical_medicine = COALESCE(p_is_critical_medicine, is_critical_medicine),
    is_active = CASE WHEN p_is_active IS NOT NULL THEN p_is_active ELSE is_active END,
    atc_code_id = CASE WHEN p_atc_code_id IS NOT NULL THEN p_atc_code_id ELSE atc_code_id END,
    updated_at = now()
  WHERE id = p_id;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('error', 'not_found', 'product_id', p_id);
  END IF;

  SELECT p.id, p.company_id, p.name, p.description, p.is_critical_medicine, p.is_active, p.atc_code_id,
         p.created_at, p.updated_at, c.name AS company_name
  INTO r
  FROM public.products p
  JOIN public.companies c ON c.id = p.company_id
  WHERE p.id = p_id;

  RETURN jsonb_build_object('product', to_jsonb(r));
EXCEPTION
  WHEN foreign_key_violation THEN
    RETURN jsonb_build_object('error', 'validation_error', 'message', 'atc_code_id not found');
END;
$$;

COMMENT ON FUNCTION public.rmm_update_product(uuid, text, text, boolean, boolean, uuid)
  IS 'Update product. Optional p_is_active, p_atc_code_id. RLS applies (MOH only). Task 1.1.2.22.';
GRANT EXECUTE ON FUNCTION public.rmm_update_product(uuid, text, text, boolean, boolean, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.rmm_update_product(uuid, text, text, boolean, boolean, uuid) TO service_role;

-- Prefer product.atc_code_id for atc_code; fallback to first SKU's ATC.
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
  v_atc_code_id uuid;
  v_skus_total int;
  v_skus_active int;
BEGIN
  SELECT p.id, p.company_id, p.name, p.description, p.is_critical_medicine, p.is_active, p.atc_code_id,
         p.created_at, p.updated_at, c.name AS company_name
  INTO r
  FROM public.products p
  JOIN public.companies c ON c.id = p.company_id
  WHERE p.id = p_id;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('error', 'not_found', 'product_id', p_id);
  END IF;

  v_atc_code_id := r.atc_code_id;

  SELECT (SELECT count(*)::int FROM public.skus s WHERE s.product_id = p_id),
         (SELECT count(*)::int FROM public.skus s WHERE s.product_id = p_id AND s.is_active = true)
  INTO v_skus_total, v_skus_active;

  SELECT COALESCE(
    (SELECT ac.code FROM public.atc_codes ac WHERE ac.id = v_atc_code_id),
    (SELECT ac.code FROM public.skus s
     JOIN public.atc_codes ac ON ac.id = s.atc_code_id
     WHERE s.product_id = p_id AND s.is_active = true
     LIMIT 1)
  ) INTO v_atc;

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
  IS 'Get product by id for detail (includes inactive). atc_code from product.atc_code_id or first SKU. Task 1.1.2.21/1.1.2.22.';

COMMIT;
