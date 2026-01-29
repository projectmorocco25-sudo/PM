-- Migration: RMM Product CRUD RPCs (Task 1.1.2.2)
-- Description: rmm_create_product, rmm_update_product, rmm_get_product. rmm_list_products exists in 20260127151300_rpc_rmm_list_functions.sql.
-- Tables: products, companies. RLS applies via SECURITY INVOKER.
-- Depends on: 1.1.1.3-verify (RMM tables), 1.1.1.5 (RLS policies RMM).
-- Date: 2026-01-29

BEGIN;

-- rmm_get_product(p_id uuid) — fetch one product. RLS applies (MOH all; company users own company's products).
CREATE OR REPLACE FUNCTION public.rmm_get_product(p_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
  r record;
BEGIN
  SELECT p.id, p.company_id, p.name, p.description, p.is_critical_medicine, p.is_active,
         p.created_at, p.updated_at, c.name AS company_name
  INTO r
  FROM public.products p
  JOIN public.companies c ON c.id = p.company_id
  WHERE p.id = p_id AND p.is_active = true;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('error', 'not_found', 'product_id', p_id);
  END IF;
  RETURN jsonb_build_object('product', to_jsonb(r));
END;
$$;
COMMENT ON FUNCTION public.rmm_get_product(uuid) IS 'Get one product by id. RLS applies. Task 1.1.2.2.';
GRANT EXECUTE ON FUNCTION public.rmm_get_product(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.rmm_get_product(uuid) TO service_role;

-- rmm_create_product(p_company_id uuid, p_name text, p_description text DEFAULT NULL, p_is_critical_medicine boolean DEFAULT false)
-- Purpose: Create new product. MOH only (RLS products_insert_moh).
CREATE OR REPLACE FUNCTION public.rmm_create_product(
  p_company_id uuid,
  p_name text,
  p_description text DEFAULT NULL,
  p_is_critical_medicine boolean DEFAULT false
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

  INSERT INTO public.products (company_id, name, description, is_critical_medicine)
  VALUES (
    p_company_id,
    trim(p_name),
    NULLIF(trim(p_description), ''),
    COALESCE(p_is_critical_medicine, false)
  )
  RETURNING id INTO v_id;

  SELECT p.id, p.company_id, p.name, p.description, p.is_critical_medicine, p.is_active, p.created_at, p.updated_at, c.name AS company_name
  INTO r
  FROM public.products p
  JOIN public.companies c ON c.id = p.company_id
  WHERE p.id = v_id;

  RETURN jsonb_build_object('product', to_jsonb(r));
EXCEPTION
  WHEN foreign_key_violation THEN
    RETURN jsonb_build_object('error', 'validation_error', 'message', 'company_id not found');
END;
$$;
COMMENT ON FUNCTION public.rmm_create_product(uuid, text, text, boolean) IS 'Create product. RLS applies (MOH only). Task 1.1.2.2.';
GRANT EXECUTE ON FUNCTION public.rmm_create_product(uuid, text, text, boolean) TO authenticated;
GRANT EXECUTE ON FUNCTION public.rmm_create_product(uuid, text, text, boolean) TO service_role;

-- rmm_update_product(p_id uuid, p_name text DEFAULT NULL, p_description text DEFAULT NULL, p_is_critical_medicine boolean DEFAULT NULL)
-- Purpose: Update product. Only non-null params updated. MOH only (RLS products_update_moh).
CREATE OR REPLACE FUNCTION public.rmm_update_product(
  p_id uuid,
  p_name text DEFAULT NULL,
  p_description text DEFAULT NULL,
  p_is_critical_medicine boolean DEFAULT NULL
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
    updated_at = now()
  WHERE id = p_id;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('error', 'not_found', 'product_id', p_id);
  END IF;

  SELECT p.id, p.company_id, p.name, p.description, p.is_critical_medicine, p.is_active, p.created_at, p.updated_at, c.name AS company_name
  INTO r
  FROM public.products p
  JOIN public.companies c ON c.id = p.company_id
  WHERE p.id = p_id;

  RETURN jsonb_build_object('product', to_jsonb(r));
END;
$$;
COMMENT ON FUNCTION public.rmm_update_product(uuid, text, text, boolean) IS 'Update product. Only non-null params updated. RLS applies (MOH only). Task 1.1.2.2.';
GRANT EXECUTE ON FUNCTION public.rmm_update_product(uuid, text, text, boolean) TO authenticated;
GRANT EXECUTE ON FUNCTION public.rmm_update_product(uuid, text, text, boolean) TO service_role;

COMMIT;
