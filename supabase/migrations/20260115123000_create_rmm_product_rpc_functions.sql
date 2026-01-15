-- Migration: create_rmm_product_rpc_functions
-- Description: RMM Product RPCs (CRUD) with validation/sanitization + standard JSON error format
-- Date: 2026-01-15
-- Author: Maya, Salim
-- Phase: 1.1.2
-- Task: 1.1.2.2

BEGIN;

CREATE OR REPLACE FUNCTION rmm_create_product(
  p_company_id uuid,
  p_name text,
  p_description text DEFAULT NULL
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
  v_id uuid;
BEGIN
  IF v_actor IS NULL THEN
    RETURN rmm_error('AUTHENTICATION_ERROR', 'Authentication required');
  END IF;

  SELECT role, company_id INTO v_role, v_actor_company FROM users WHERE id = v_actor;

  IF NOT shared_check_module_active('rmm') AND v_role NOT IN ('tier1','system_admin') THEN
    RETURN rmm_error('MODULE_NOT_ACTIVE', 'RMM module is not active');
  END IF;

  IF p_name IS NULL OR trim(p_name) = '' THEN
    RETURN rmm_error('VALIDATION_ERROR', 'Validation failed', jsonb_build_array(jsonb_build_object(
      'field', 'name', 'message', 'Product name is required', 'code', 'MISSING_REQUIRED_FIELD'
    )));
  END IF;

  -- Authorization: company users can create products for their own company; MOH can create for any company.
  IF v_actor_company IS NOT NULL AND v_actor_company <> p_company_id THEN
    RETURN rmm_error('AUTHORIZATION_ERROR', 'You can only create products for your own company');
  END IF;

  -- Ensure company exists
  PERFORM 1 FROM companies c WHERE c.id = p_company_id;
  IF NOT FOUND THEN
    RETURN rmm_error('INVALID_REFERENCE', 'Company not found');
  END IF;

  INSERT INTO products (
    company_id,
    name,
    description
  ) VALUES (
    p_company_id,
    rmm_sanitize_text(p_name, 255),
    rmm_sanitize_text(p_description, 2000)
  )
  RETURNING id INTO v_id;

  PERFORM shared_create_audit_log(
    v_actor,
    'create',
    'products',
    v_id,
    NULL,
    to_jsonb((SELECT p FROM products p WHERE p.id = v_id)),
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

CREATE OR REPLACE FUNCTION rmm_update_product(
  p_product_id uuid,
  p_name text DEFAULT NULL,
  p_description text DEFAULT NULL,
  p_is_critical_medicine boolean DEFAULT NULL,
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
  v_row products;
  v_old jsonb;
  v_company_id uuid;
BEGIN
  IF v_actor IS NULL THEN
    RETURN rmm_error('AUTHENTICATION_ERROR', 'Authentication required');
  END IF;

  SELECT role, company_id INTO v_role, v_actor_company FROM users WHERE id = v_actor;

  IF NOT shared_check_module_active('rmm') AND v_role NOT IN ('tier1','system_admin') THEN
    RETURN rmm_error('MODULE_NOT_ACTIVE', 'RMM module is not active');
  END IF;

  SELECT * INTO v_row FROM products WHERE id = p_product_id;
  IF NOT FOUND THEN
    RETURN rmm_error('NOT_FOUND', 'Product not found');
  END IF;

  v_company_id := v_row.company_id;
  v_old := to_jsonb(v_row);

  -- Authorization: company users can update only their own products; MOH can update all.
  IF v_actor_company IS NOT NULL AND v_actor_company <> v_company_id THEN
    RETURN rmm_error('AUTHORIZATION_ERROR', 'You can only update products for your own company');
  END IF;

  UPDATE products
  SET name = COALESCE(rmm_sanitize_text(p_name, 255), name),
      description = COALESCE(rmm_sanitize_text(p_description, 2000), description),
      is_critical_medicine = COALESCE(p_is_critical_medicine, is_critical_medicine),
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
  WHERE id = p_product_id;

  PERFORM shared_create_audit_log(
    v_actor,
    'update',
    'products',
    p_product_id,
    v_old,
    to_jsonb((SELECT p FROM products p WHERE p.id = p_product_id)),
    NULL,
    NULL,
    NULL
  );

  RETURN jsonb_build_object('success', true, 'data', jsonb_build_object('id', p_product_id));
EXCEPTION
  WHEN others THEN
    RETURN rmm_error('SYSTEM_ERROR', 'An unexpected error occurred');
END;
$$;

CREATE OR REPLACE FUNCTION rmm_get_product(
  p_product_id uuid
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_actor uuid := auth.uid();
  v_row products;
BEGIN
  IF v_actor IS NULL THEN
    RETURN rmm_error('AUTHENTICATION_ERROR', 'Authentication required');
  END IF;

  SELECT * INTO v_row FROM products WHERE id = p_product_id;
  IF NOT FOUND THEN
    RETURN rmm_error('NOT_FOUND', 'Product not found');
  END IF;

  RETURN jsonb_build_object('success', true, 'data', to_jsonb(v_row));
EXCEPTION
  WHEN others THEN
    RETURN rmm_error('SYSTEM_ERROR', 'An unexpected error occurred');
END;
$$;

CREATE OR REPLACE FUNCTION rmm_list_products(
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
  FROM products p
  WHERE (p_company_id IS NULL OR p.company_id = p_company_id)
    AND (v_search IS NULL OR p.name ILIKE '%' || v_search || '%')
    AND (p_is_active IS NULL OR p.is_active = p_is_active);

  SELECT COALESCE(jsonb_agg(to_jsonb(p)), '[]'::jsonb) INTO v_items
  FROM (
    SELECT *
    FROM products p
    WHERE (p_company_id IS NULL OR p.company_id = p_company_id)
      AND (v_search IS NULL OR p.name ILIKE '%' || v_search || '%')
      AND (p_is_active IS NULL OR p.is_active = p_is_active)
    ORDER BY p.created_at DESC
    LIMIT LEAST(GREATEST(p_limit, 1), 500)
    OFFSET GREATEST(p_offset, 0)
  ) p;

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

