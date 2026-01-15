-- Migration: create_rmm_sku_rpc_functions
-- Description: RMM SKU RPCs (CRUD) with validation/sanitization + standard JSON error format
-- Date: 2026-01-15
-- Author: Maya, Salim
-- Phase: 1.1.2
-- Task: 1.1.2.3

BEGIN;

-- Simple reference lists (kept in RPC validation; UI uses its own lists too).
CREATE OR REPLACE FUNCTION rmm_is_valid_dosage_form(p_value text)
RETURNS boolean
LANGUAGE sql
STABLE
AS $$
  SELECT p_value IN (
    'Tablet','Capsule','Syrup','Solution','Suspension','Injection','Cream','Ointment','Drops','Spray','Powder','Granules'
  );
$$;

CREATE OR REPLACE FUNCTION rmm_is_valid_unit_of_measure(p_value text)
RETURNS boolean
LANGUAGE sql
STABLE
AS $$
  SELECT p_value IN (
    'tablets','capsules','ml','l','mg','g','kg','units','vials','bottles','sachets','ampoules'
  );
$$;

CREATE OR REPLACE FUNCTION rmm_is_valid_dosage_strength(p_value text)
RETURNS boolean
LANGUAGE sql
STABLE
AS $$
  -- Examples: 500mg, 10mg/ml, 2.5 g, 0.5mg, 100mcg
  SELECT p_value ~* '^\s*\d+(\.\d+)?\s*(mg|g|mcg|iu|%)\s*(\/\s*(ml|l))?\s*$';
$$;

CREATE OR REPLACE FUNCTION rmm_create_sku(
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
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_actor uuid := auth.uid();
  v_role text;
  v_actor_company uuid;
  v_product products;
  v_id uuid;
BEGIN
  IF v_actor IS NULL THEN
    RETURN rmm_error('AUTHENTICATION_ERROR', 'Authentication required');
  END IF;

  SELECT role, company_id INTO v_role, v_actor_company FROM users WHERE id = v_actor;

  IF NOT shared_check_module_active('rmm') AND v_role NOT IN ('tier1','system_admin') THEN
    RETURN rmm_error('MODULE_NOT_ACTIVE', 'RMM module is not active');
  END IF;

  IF p_product_id IS NULL THEN
    RETURN rmm_error('VALIDATION_ERROR', 'Validation failed', jsonb_build_array(jsonb_build_object(
      'field', 'product_id', 'message', 'Product is required', 'code', 'MISSING_REQUIRED_FIELD'
    )));
  END IF;

  SELECT * INTO v_product FROM products WHERE id = p_product_id;
  IF NOT FOUND THEN
    RETURN rmm_error('INVALID_REFERENCE', 'Product not found');
  END IF;

  IF v_actor_company IS NOT NULL AND v_actor_company <> v_product.company_id THEN
    RETURN rmm_error('AUTHORIZATION_ERROR', 'You can only create SKUs for your own company');
  END IF;

  IF p_sku_code IS NULL OR trim(p_sku_code) = '' THEN
    RETURN rmm_error('VALIDATION_ERROR', 'Validation failed', jsonb_build_array(jsonb_build_object(
      'field', 'sku_code', 'message', 'SKU code is required', 'code', 'MISSING_REQUIRED_FIELD'
    )));
  END IF;
  IF p_name IS NULL OR trim(p_name) = '' THEN
    RETURN rmm_error('VALIDATION_ERROR', 'Validation failed', jsonb_build_array(jsonb_build_object(
      'field', 'name', 'message', 'SKU name is required', 'code', 'MISSING_REQUIRED_FIELD'
    )));
  END IF;
  IF p_dosage_strength IS NULL OR NOT rmm_is_valid_dosage_strength(p_dosage_strength) THEN
    RETURN rmm_error('VALIDATION_ERROR', 'Validation failed', jsonb_build_array(jsonb_build_object(
      'field', 'dosage_strength', 'message', 'Dosage strength format is invalid (e.g., 500mg, 10mg/ml)', 'code', 'INVALID_FORMAT'
    )));
  END IF;
  IF p_dosage_form IS NULL OR NOT rmm_is_valid_dosage_form(p_dosage_form) THEN
    RETURN rmm_error('VALIDATION_ERROR', 'Validation failed', jsonb_build_array(jsonb_build_object(
      'field', 'dosage_form', 'message', 'Dosage form must be a standard value (e.g., Tablet, Capsule, Syrup)', 'code', 'INVALID_VALUE'
    )));
  END IF;
  IF p_pack_size IS NULL OR trim(p_pack_size) = '' THEN
    RETURN rmm_error('VALIDATION_ERROR', 'Validation failed', jsonb_build_array(jsonb_build_object(
      'field', 'pack_size', 'message', 'Pack size is required', 'code', 'MISSING_REQUIRED_FIELD'
    )));
  END IF;
  IF p_unit_of_measure IS NULL OR NOT rmm_is_valid_unit_of_measure(p_unit_of_measure) THEN
    RETURN rmm_error('VALIDATION_ERROR', 'Validation failed', jsonb_build_array(jsonb_build_object(
      'field', 'unit_of_measure', 'message', 'Unit of measure must be a standard value (e.g., tablets, ml)', 'code', 'INVALID_VALUE'
    )));
  END IF;

  IF p_atc_code_id IS NOT NULL THEN
    PERFORM 1 FROM atc_codes a WHERE a.id = p_atc_code_id AND a.is_active = true;
    IF NOT FOUND THEN
      RETURN rmm_error('INVALID_REFERENCE', 'ATC code not found');
    END IF;
  END IF;

  INSERT INTO skus (
    product_id,
    sku_code,
    name,
    dosage_strength,
    dosage_form,
    pack_size,
    unit_of_measure,
    atc_code_id,
    is_moh_authorized_unregistered
  ) VALUES (
    p_product_id,
    rmm_sanitize_text(p_sku_code, 64),
    rmm_sanitize_text(p_name, 255),
    rmm_sanitize_text(p_dosage_strength, 64),
    rmm_sanitize_text(p_dosage_form, 64),
    rmm_sanitize_text(p_pack_size, 64),
    rmm_sanitize_text(p_unit_of_measure, 32),
    p_atc_code_id,
    COALESCE(p_is_moh_authorized_unregistered, false)
  )
  RETURNING id INTO v_id;

  PERFORM shared_create_audit_log(
    v_actor,
    'create',
    'skus',
    v_id,
    NULL,
    to_jsonb((SELECT s FROM skus s WHERE s.id = v_id)),
    NULL,
    NULL,
    NULL
  );

  RETURN jsonb_build_object('success', true, 'data', jsonb_build_object('id', v_id));
EXCEPTION
  WHEN others THEN
    RETURN rmm_error('SYSTEM_ERROR', 'An unexpected error occurred');
END;
$$;

CREATE OR REPLACE FUNCTION rmm_update_sku(
  p_sku_id uuid,
  p_sku_code text DEFAULT NULL,
  p_name text DEFAULT NULL,
  p_dosage_strength text DEFAULT NULL,
  p_dosage_form text DEFAULT NULL,
  p_pack_size text DEFAULT NULL,
  p_unit_of_measure text DEFAULT NULL,
  p_atc_code_id uuid DEFAULT NULL,
  p_is_moh_authorized_unregistered boolean DEFAULT NULL,
  p_is_active boolean DEFAULT NULL,
  p_deactivated_reason text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_actor uuid := auth.uid();
  v_role text;
  v_actor_company uuid;
  v_row skus;
  v_old jsonb;
  v_product products;
BEGIN
  IF v_actor IS NULL THEN
    RETURN rmm_error('AUTHENTICATION_ERROR', 'Authentication required');
  END IF;

  SELECT role, company_id INTO v_role, v_actor_company FROM users WHERE id = v_actor;

  IF NOT shared_check_module_active('rmm') AND v_role NOT IN ('tier1','system_admin') THEN
    RETURN rmm_error('MODULE_NOT_ACTIVE', 'RMM module is not active');
  END IF;

  SELECT * INTO v_row FROM skus WHERE id = p_sku_id;
  IF NOT FOUND THEN
    RETURN rmm_error('NOT_FOUND', 'SKU not found');
  END IF;
  v_old := to_jsonb(v_row);

  SELECT * INTO v_product FROM products WHERE id = v_row.product_id;
  IF NOT FOUND THEN
    RETURN rmm_error('SYSTEM_ERROR', 'SKU product not found');
  END IF;

  IF v_actor_company IS NOT NULL AND v_actor_company <> v_product.company_id THEN
    RETURN rmm_error('AUTHORIZATION_ERROR', 'You can only update SKUs for your own company');
  END IF;

  IF p_dosage_strength IS NOT NULL AND NOT rmm_is_valid_dosage_strength(p_dosage_strength) THEN
    RETURN rmm_error('VALIDATION_ERROR', 'Validation failed', jsonb_build_array(jsonb_build_object(
      'field', 'dosage_strength', 'message', 'Dosage strength format is invalid (e.g., 500mg, 10mg/ml)', 'code', 'INVALID_FORMAT'
    )));
  END IF;
  IF p_dosage_form IS NOT NULL AND NOT rmm_is_valid_dosage_form(p_dosage_form) THEN
    RETURN rmm_error('VALIDATION_ERROR', 'Validation failed', jsonb_build_array(jsonb_build_object(
      'field', 'dosage_form', 'message', 'Dosage form must be a standard value (e.g., Tablet, Capsule, Syrup)', 'code', 'INVALID_VALUE'
    )));
  END IF;
  IF p_unit_of_measure IS NOT NULL AND NOT rmm_is_valid_unit_of_measure(p_unit_of_measure) THEN
    RETURN rmm_error('VALIDATION_ERROR', 'Validation failed', jsonb_build_array(jsonb_build_object(
      'field', 'unit_of_measure', 'message', 'Unit of measure must be a standard value (e.g., tablets, ml)', 'code', 'INVALID_VALUE'
    )));
  END IF;

  IF p_atc_code_id IS NOT NULL THEN
    PERFORM 1 FROM atc_codes a WHERE a.id = p_atc_code_id AND a.is_active = true;
    IF NOT FOUND THEN
      RETURN rmm_error('INVALID_REFERENCE', 'ATC code not found');
    END IF;
  END IF;

  UPDATE skus
  SET sku_code = COALESCE(rmm_sanitize_text(p_sku_code, 64), sku_code),
      name = COALESCE(rmm_sanitize_text(p_name, 255), name),
      dosage_strength = COALESCE(rmm_sanitize_text(p_dosage_strength, 64), dosage_strength),
      dosage_form = COALESCE(rmm_sanitize_text(p_dosage_form, 64), dosage_form),
      pack_size = COALESCE(rmm_sanitize_text(p_pack_size, 64), pack_size),
      unit_of_measure = COALESCE(rmm_sanitize_text(p_unit_of_measure, 32), unit_of_measure),
      atc_code_id = COALESCE(p_atc_code_id, atc_code_id),
      is_moh_authorized_unregistered = COALESCE(p_is_moh_authorized_unregistered, is_moh_authorized_unregistered),
      is_active = COALESCE(p_is_active, is_active),
      deactivated_reason = COALESCE(rmm_sanitize_text(p_deactivated_reason, 2000), deactivated_reason),
      deactivated_at = CASE
        WHEN p_is_active = false AND deactivated_at IS NULL THEN now()
        WHEN p_is_active = true THEN NULL
        ELSE deactivated_at
      END,
      deactivated_by = CASE
        WHEN p_is_active = false AND deactivated_by IS NULL THEN v_actor
        WHEN p_is_active = true THEN NULL
        ELSE deactivated_by
      END,
      updated_at = now()
  WHERE id = p_sku_id;

  PERFORM shared_create_audit_log(
    v_actor,
    'update',
    'skus',
    p_sku_id,
    v_old,
    to_jsonb((SELECT s FROM skus s WHERE s.id = p_sku_id)),
    NULL,
    NULL,
    NULL
  );

  RETURN jsonb_build_object('success', true, 'data', jsonb_build_object('id', p_sku_id));
EXCEPTION
  WHEN others THEN
    RETURN rmm_error('SYSTEM_ERROR', 'An unexpected error occurred');
END;
$$;

CREATE OR REPLACE FUNCTION rmm_get_sku(
  p_sku_id uuid
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_actor uuid := auth.uid();
  v_row skus;
BEGIN
  IF v_actor IS NULL THEN
    RETURN rmm_error('AUTHENTICATION_ERROR', 'Authentication required');
  END IF;

  SELECT * INTO v_row FROM skus WHERE id = p_sku_id;
  IF NOT FOUND THEN
    RETURN rmm_error('NOT_FOUND', 'SKU not found');
  END IF;

  RETURN jsonb_build_object('success', true, 'data', to_jsonb(v_row));
EXCEPTION
  WHEN others THEN
    RETURN rmm_error('SYSTEM_ERROR', 'An unexpected error occurred');
END;
$$;

CREATE OR REPLACE FUNCTION rmm_list_skus(
  p_product_id uuid DEFAULT NULL,
  p_company_id uuid DEFAULT NULL,
  p_search text DEFAULT NULL,
  p_is_active boolean DEFAULT NULL,
  p_limit integer DEFAULT 50,
  p_offset integer DEFAULT 0
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_actor uuid := auth.uid();
  v_total integer;
  v_items jsonb;
  v_search text := NULLIF(trim(COALESCE(p_search, '')), '');
BEGIN
  IF v_actor IS NULL THEN
    RETURN rmm_error('AUTHENTICATION_ERROR', 'Authentication required');
  END IF;

  SELECT count(*) INTO v_total
  FROM skus s
  JOIN products p ON p.id = s.product_id
  WHERE (p_product_id IS NULL OR s.product_id = p_product_id)
    AND (p_company_id IS NULL OR p.company_id = p_company_id)
    AND (v_search IS NULL OR s.name ILIKE '%' || v_search || '%' OR s.sku_code ILIKE '%' || v_search || '%')
    AND (p_is_active IS NULL OR s.is_active = p_is_active);

  SELECT COALESCE(jsonb_agg(to_jsonb(x)), '[]'::jsonb) INTO v_items
  FROM (
    SELECT s.*
    FROM skus s
    JOIN products p ON p.id = s.product_id
    WHERE (p_product_id IS NULL OR s.product_id = p_product_id)
      AND (p_company_id IS NULL OR p.company_id = p_company_id)
      AND (v_search IS NULL OR s.name ILIKE '%' || v_search || '%' OR s.sku_code ILIKE '%' || v_search || '%')
      AND (p_is_active IS NULL OR s.is_active = p_is_active)
    ORDER BY s.created_at DESC
    LIMIT LEAST(GREATEST(p_limit, 1), 500)
    OFFSET GREATEST(p_offset, 0)
  ) x;

  RETURN jsonb_build_object(
    'success', true,
    'data', jsonb_build_object(
      'total', v_total,
      'items', v_items
    )
  );
EXCEPTION
  WHEN others THEN
    RETURN rmm_error('SYSTEM_ERROR', 'An unexpected error occurred');
END;
$$;

COMMIT;

