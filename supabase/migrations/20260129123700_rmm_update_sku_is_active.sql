-- Migration: Add p_is_active to rmm_update_sku for SKU create/edit form (Task 1.1.2.25)
-- Description: Allow updating SKU active status from edit form.
-- Date: 2026-01-29

BEGIN;

DROP FUNCTION IF EXISTS public.rmm_update_sku(uuid, text, text, text, text, text, text, uuid, boolean);

CREATE OR REPLACE FUNCTION public.rmm_update_sku(
  p_id uuid,
  p_sku_code text DEFAULT NULL,
  p_name text DEFAULT NULL,
  p_dosage_strength text DEFAULT NULL,
  p_dosage_form text DEFAULT NULL,
  p_pack_size text DEFAULT NULL,
  p_unit_of_measure text DEFAULT NULL,
  p_atc_code_id uuid DEFAULT NULL,
  p_is_moh_authorized_unregistered boolean DEFAULT NULL,
  p_is_active boolean DEFAULT NULL
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
    is_active = CASE WHEN p_is_active IS NOT NULL THEN p_is_active ELSE is_active END,
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

COMMENT ON FUNCTION public.rmm_update_sku(uuid, text, text, text, text, text, text, uuid, boolean, boolean)
  IS 'Update SKU. Only non-null params updated. p_is_active for status (Task 1.1.2.25). RLS applies (MOH only).';

GRANT EXECUTE ON FUNCTION public.rmm_update_sku(uuid, text, text, text, text, text, text, uuid, boolean, boolean) TO authenticated;
GRANT EXECUTE ON FUNCTION public.rmm_update_sku(uuid, text, text, text, text, text, text, uuid, boolean, boolean) TO service_role;

COMMIT;
