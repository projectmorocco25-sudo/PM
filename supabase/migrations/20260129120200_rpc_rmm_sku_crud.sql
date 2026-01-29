-- Migration: RMM SKU CRUD RPCs (Task 1.1.2.3)
-- Description: rmm_get_sku, rmm_create_sku, rmm_update_sku. rmm_list_skus exists in 20260127151300_rpc_rmm_list_functions.sql.
-- Tables: skus, products. RLS applies via SECURITY INVOKER.
-- Depends on: 1.1.1.3-verify (RMM tables), 1.1.1.5 (RLS policies RMM).
-- Date: 2026-01-29

BEGIN;

-- rmm_get_sku(p_id uuid) — fetch one SKU. RLS applies (MOH all; company users SKUs for their company's products).
CREATE OR REPLACE FUNCTION public.rmm_get_sku(p_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
  r record;
BEGIN
  SELECT s.id, s.product_id, s.sku_code, s.name, s.dosage_strength, s.dosage_form,
         s.pack_size, s.unit_of_measure, s.atc_code_id, s.is_moh_authorized_unregistered, s.is_active,
         s.created_at, s.updated_at, p.name AS product_name, p.company_id
  INTO r
  FROM public.skus s
  JOIN public.products p ON p.id = s.product_id
  WHERE s.id = p_id AND s.is_active = true;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('error', 'not_found', 'sku_id', p_id);
  END IF;
  RETURN jsonb_build_object('sku', to_jsonb(r));
END;
$$;
COMMENT ON FUNCTION public.rmm_get_sku(uuid) IS 'Get one SKU by id. RLS applies. Task 1.1.2.3.';
GRANT EXECUTE ON FUNCTION public.rmm_get_sku(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.rmm_get_sku(uuid) TO service_role;

-- rmm_create_sku(p_product_id, p_sku_code, p_name, p_dosage_strength, p_dosage_form, p_pack_size, p_unit_of_measure, p_atc_code_id DEFAULT NULL, p_is_moh_authorized_unregistered DEFAULT false)
-- Purpose: Create new SKU. MOH only (RLS skus_insert_moh).
CREATE OR REPLACE FUNCTION public.rmm_create_sku(
  p_product_id uuid,
  p_sku_code text,
  p_name text,
  p_dosage_strength text,
  p_dosage_form text,
  p_pack_size text,
  p_unit_of_measure text,
  p_atc_code_id uuid DEFAULT NULL,
  p_is_moh_authorized_unregistered boolean DEFAULT false
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
  IF p_product_id IS NULL THEN
    RETURN jsonb_build_object('error', 'validation_error', 'message', 'product_id is required');
  END IF;
  IF p_sku_code IS NULL OR trim(p_sku_code) = '' THEN
    RETURN jsonb_build_object('error', 'validation_error', 'message', 'sku_code is required');
  END IF;
  IF p_name IS NULL OR trim(p_name) = '' THEN
    RETURN jsonb_build_object('error', 'validation_error', 'message', 'name is required');
  END IF;
  IF p_dosage_strength IS NULL OR trim(p_dosage_strength) = '' THEN
    RETURN jsonb_build_object('error', 'validation_error', 'message', 'dosage_strength is required');
  END IF;
  IF p_dosage_form IS NULL OR trim(p_dosage_form) = '' THEN
    RETURN jsonb_build_object('error', 'validation_error', 'message', 'dosage_form is required');
  END IF;
  IF p_pack_size IS NULL OR trim(p_pack_size) = '' THEN
    RETURN jsonb_build_object('error', 'validation_error', 'message', 'pack_size is required');
  END IF;
  IF p_unit_of_measure IS NULL OR trim(p_unit_of_measure) = '' THEN
    RETURN jsonb_build_object('error', 'validation_error', 'message', 'unit_of_measure is required');
  END IF;

  INSERT INTO public.skus (product_id, sku_code, name, dosage_strength, dosage_form, pack_size, unit_of_measure, atc_code_id, is_moh_authorized_unregistered)
  VALUES (
    p_product_id,
    trim(p_sku_code),
    trim(p_name),
    trim(p_dosage_strength),
    trim(p_dosage_form),
    trim(p_pack_size),
    trim(p_unit_of_measure),
    p_atc_code_id,
    COALESCE(p_is_moh_authorized_unregistered, false)
  )
  RETURNING id INTO v_id;

  SELECT s.id, s.product_id, s.sku_code, s.name, s.dosage_strength, s.dosage_form,
         s.pack_size, s.unit_of_measure, s.atc_code_id, s.is_moh_authorized_unregistered, s.is_active,
         s.created_at, s.updated_at, p.name AS product_name, p.company_id
  INTO r
  FROM public.skus s
  JOIN public.products p ON p.id = s.product_id
  WHERE s.id = v_id;

  RETURN jsonb_build_object('sku', to_jsonb(r));
EXCEPTION
  WHEN foreign_key_violation THEN
    RETURN jsonb_build_object('error', 'validation_error', 'message', 'product_id or atc_code_id not found');
END;
$$;
COMMENT ON FUNCTION public.rmm_create_sku(uuid, text, text, text, text, text, text, uuid, boolean) IS 'Create SKU. RLS applies (MOH only). Task 1.1.2.3.';
GRANT EXECUTE ON FUNCTION public.rmm_create_sku(uuid, text, text, text, text, text, text, uuid, boolean) TO authenticated;
GRANT EXECUTE ON FUNCTION public.rmm_create_sku(uuid, text, text, text, text, text, text, uuid, boolean) TO service_role;

-- rmm_update_sku(p_id uuid, p_sku_code text DEFAULT NULL, p_name text DEFAULT NULL, ...)
-- Purpose: Update SKU. Only non-null params updated. MOH only (RLS skus_update_moh).
CREATE OR REPLACE FUNCTION public.rmm_update_sku(
  p_id uuid,
  p_sku_code text DEFAULT NULL,
  p_name text DEFAULT NULL,
  p_dosage_strength text DEFAULT NULL,
  p_dosage_form text DEFAULT NULL,
  p_pack_size text DEFAULT NULL,
  p_unit_of_measure text DEFAULT NULL,
  p_atc_code_id uuid DEFAULT NULL,
  p_is_moh_authorized_unregistered boolean DEFAULT NULL
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
  IF p_sku_code IS NOT NULL AND trim(p_sku_code) = '' THEN
    RETURN jsonb_build_object('error', 'validation_error', 'message', 'sku_code cannot be empty');
  END IF;
  IF p_name IS NOT NULL AND trim(p_name) = '' THEN
    RETURN jsonb_build_object('error', 'validation_error', 'message', 'name cannot be empty');
  END IF;
  IF p_dosage_strength IS NOT NULL AND trim(p_dosage_strength) = '' THEN
    RETURN jsonb_build_object('error', 'validation_error', 'message', 'dosage_strength cannot be empty');
  END IF;
  IF p_dosage_form IS NOT NULL AND trim(p_dosage_form) = '' THEN
    RETURN jsonb_build_object('error', 'validation_error', 'message', 'dosage_form cannot be empty');
  END IF;
  IF p_pack_size IS NOT NULL AND trim(p_pack_size) = '' THEN
    RETURN jsonb_build_object('error', 'validation_error', 'message', 'pack_size cannot be empty');
  END IF;
  IF p_unit_of_measure IS NOT NULL AND trim(p_unit_of_measure) = '' THEN
    RETURN jsonb_build_object('error', 'validation_error', 'message', 'unit_of_measure cannot be empty');
  END IF;

  UPDATE public.skus
  SET
    sku_code = COALESCE(NULLIF(trim(p_sku_code), ''), sku_code),
    name = COALESCE(NULLIF(trim(p_name), ''), name),
    dosage_strength = COALESCE(NULLIF(trim(p_dosage_strength), ''), dosage_strength),
    dosage_form = COALESCE(NULLIF(trim(p_dosage_form), ''), dosage_form),
    pack_size = COALESCE(NULLIF(trim(p_pack_size), ''), pack_size),
    unit_of_measure = COALESCE(NULLIF(trim(p_unit_of_measure), ''), unit_of_measure),
    atc_code_id = CASE WHEN p_atc_code_id IS NOT NULL THEN p_atc_code_id ELSE atc_code_id END,
    is_moh_authorized_unregistered = COALESCE(p_is_moh_authorized_unregistered, is_moh_authorized_unregistered),
    updated_at = now()
  WHERE id = p_id;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('error', 'not_found', 'sku_id', p_id);
  END IF;

  SELECT s.id, s.product_id, s.sku_code, s.name, s.dosage_strength, s.dosage_form,
         s.pack_size, s.unit_of_measure, s.atc_code_id, s.is_moh_authorized_unregistered, s.is_active,
         s.created_at, s.updated_at, p.name AS product_name, p.company_id
  INTO r
  FROM public.skus s
  JOIN public.products p ON p.id = s.product_id
  WHERE s.id = p_id;

  RETURN jsonb_build_object('sku', to_jsonb(r));
EXCEPTION
  WHEN foreign_key_violation THEN
    RETURN jsonb_build_object('error', 'validation_error', 'message', 'atc_code_id not found');
END;
$$;
COMMENT ON FUNCTION public.rmm_update_sku(uuid, text, text, text, text, text, text, uuid, boolean) IS 'Update SKU. Only non-null params updated. RLS applies (MOH only). Task 1.1.2.3.';
GRANT EXECUTE ON FUNCTION public.rmm_update_sku(uuid, text, text, text, text, text, text, uuid, boolean) TO authenticated;
GRANT EXECUTE ON FUNCTION public.rmm_update_sku(uuid, text, text, text, text, text, text, uuid, boolean) TO service_role;

COMMIT;
