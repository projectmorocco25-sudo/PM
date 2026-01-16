-- Migration: create_rmm_company_rpc_functions
-- Description: RMM Company RPCs (CRUD) with validation/sanitization + standard JSON error format
-- Date: 2026-01-15
-- Author: Maya, Salim
-- Phase: 1.1.2
-- Task: 1.1.2.1 (+ foundations for 1.1.2.1a)
-- References:
-- - docs/02-architecture/security/backend-error-handling-framework.md
-- - docs/02-architecture/security/backend-input-sanitization-strategy.md

BEGIN;

-- ----------------------------
-- Sanitization helpers (RMM)
-- ----------------------------

CREATE OR REPLACE FUNCTION rmm_sanitize_text(p_input text, p_max_len int DEFAULT 10000)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v text;
BEGIN
  IF p_input IS NULL THEN
    RETURN NULL;
  END IF;

  v := replace(p_input, chr(0), '');
  v := trim(v);

  -- Strip the most dangerous HTML delimiters (UI still must escape output).
  v := regexp_replace(v, '[<>]', '', 'g');

  IF length(v) > GREATEST(p_max_len, 1) THEN
    RAISE EXCEPTION 'Input too long';
  END IF;

  RETURN v;
END;
$$;

CREATE OR REPLACE FUNCTION rmm_sanitize_email(p_input text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v text;
BEGIN
  IF p_input IS NULL THEN
    RETURN NULL;
  END IF;

  v := lower(trim(replace(p_input, chr(0), '')));

  IF v !~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN
    RAISE EXCEPTION 'Invalid email format';
  END IF;

  v := regexp_replace(v, '[<>"]', '', 'g');
  v := replace(v, chr(0), '');
  RETURN v;
END;
$$;

CREATE OR REPLACE FUNCTION rmm_sanitize_phone(p_input text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v text;
BEGIN
  IF p_input IS NULL THEN
    RETURN NULL;
  END IF;

  v := regexp_replace(replace(p_input, chr(0), ''), '[^0-9+]', '', 'g');
  IF v !~ '^\+?[1-9]\d{1,14}$' THEN
    RAISE EXCEPTION 'Invalid phone number format';
  END IF;
  RETURN v;
END;
$$;

-- ----------------------------
-- Error helper
-- ----------------------------

CREATE OR REPLACE FUNCTION rmm_error(
  p_code text,
  p_message text,
  p_details jsonb DEFAULT NULL
)
RETURNS jsonb
LANGUAGE sql
STABLE
AS $$
  SELECT jsonb_build_object(
    'success', false,
    'error', jsonb_strip_nulls(jsonb_build_object(
      'code', p_code,
      'message', p_message,
      'details', p_details,
      'timestamp', to_char(now() at time zone 'utc', 'YYYY-MM-DD"T"HH24:MI:SS"Z"'),
      'request_id', gen_random_uuid()::text
    ))
  );
$$;

-- ----------------------------
-- Task 1.1.2.1: Company CRUD RPCs
-- ----------------------------

CREATE OR REPLACE FUNCTION rmm_create_company(
  p_name text,
  p_registration_number text,
  p_company_type text,
  p_address text DEFAULT NULL,
  p_contact_email text DEFAULT NULL,
  p_contact_phone text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_actor uuid := auth.uid();
  v_role text;
  v_company_id uuid;
  v_id uuid;
  v_old jsonb;
BEGIN
  IF v_actor IS NULL THEN
    RETURN rmm_error('AUTHENTICATION_ERROR', 'Authentication required');
  END IF;

  SELECT role, company_id INTO v_role, v_company_id FROM users WHERE id = v_actor;

  -- Module gate for mutations (Tier 1/system_admin may operate even when inactive for setup).
  IF NOT shared_check_module_active('rmm') AND v_role NOT IN ('tier1','system_admin') THEN
    RETURN rmm_error('MODULE_NOT_ACTIVE', 'RMM module is not active');
  END IF;

  -- Authorization: company creation is MOH/admin only (company users submit via registry workflow).
  IF v_company_id IS NOT NULL OR v_role NOT IN ('tier1','tier2_registrar','system_admin') THEN
    RETURN rmm_error('AUTHORIZATION_ERROR', 'You do not have permission to create companies');
  END IF;

  -- Validation
  IF p_name IS NULL OR trim(p_name) = '' THEN
    RETURN rmm_error('VALIDATION_ERROR', 'Validation failed', jsonb_build_array(jsonb_build_object(
      'field', 'name', 'message', 'Company name is required', 'code', 'MISSING_REQUIRED_FIELD'
    )));
  END IF;
  IF p_registration_number IS NULL OR trim(p_registration_number) = '' THEN
    RETURN rmm_error('VALIDATION_ERROR', 'Validation failed', jsonb_build_array(jsonb_build_object(
      'field', 'registration_number', 'message', 'Registration number is required', 'code', 'MISSING_REQUIRED_FIELD'
    )));
  END IF;
  IF p_company_type IS NULL OR p_company_type NOT IN ('ipc','wholesaler') THEN
    RETURN rmm_error('VALIDATION_ERROR', 'Validation failed', jsonb_build_array(jsonb_build_object(
      'field', 'company_type', 'message', 'Company type must be ipc or wholesaler', 'code', 'INVALID_VALUE'
    )));
  END IF;

  -- Uniqueness
  IF EXISTS (SELECT 1 FROM companies c WHERE c.registration_number = trim(p_registration_number)) THEN
    RETURN rmm_error('DUPLICATE_ENTRY', 'Company with this registration number already exists');
  END IF;

  INSERT INTO companies (
    name,
    registration_number,
    company_type,
    address,
    contact_email,
    contact_phone
  ) VALUES (
    rmm_sanitize_text(p_name, 255),
    rmm_sanitize_text(p_registration_number, 64),
    p_company_type,
    rmm_sanitize_text(p_address, 1000),
    rmm_sanitize_email(p_contact_email),
    rmm_sanitize_phone(p_contact_phone)
  )
  RETURNING id INTO v_id;

  PERFORM shared_create_audit_log(
    v_actor,
    'create',
    'companies',
    v_id,
    v_old,
    to_jsonb((SELECT c FROM companies c WHERE c.id = v_id)),
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

CREATE OR REPLACE FUNCTION rmm_update_company(
  p_company_id uuid,
  p_name text DEFAULT NULL,
  p_registration_number text DEFAULT NULL,
  p_company_type text DEFAULT NULL,
  p_address text DEFAULT NULL,
  p_contact_email text DEFAULT NULL,
  p_contact_phone text DEFAULT NULL,
  p_is_active boolean DEFAULT NULL,
  p_suspended_reason text DEFAULT NULL
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
  v_old jsonb;
  v_row companies;
BEGIN
  IF v_actor IS NULL THEN
    RETURN rmm_error('AUTHENTICATION_ERROR', 'Authentication required');
  END IF;

  SELECT role, company_id INTO v_role, v_actor_company FROM users WHERE id = v_actor;

  IF NOT shared_check_module_active('rmm') AND v_role NOT IN ('tier1','system_admin') THEN
    RETURN rmm_error('MODULE_NOT_ACTIVE', 'RMM module is not active');
  END IF;

  -- Authorization: direct company update is MOH registrar/tier1/admin only.
  IF v_actor_company IS NOT NULL OR v_role NOT IN ('tier1','tier2_registrar','system_admin') THEN
    RETURN rmm_error('AUTHORIZATION_ERROR', 'You do not have permission to update companies');
  END IF;

  SELECT * INTO v_row FROM companies WHERE id = p_company_id;
  IF NOT FOUND THEN
    RETURN rmm_error('NOT_FOUND', 'Company not found');
  END IF;

  v_old := to_jsonb(v_row);

  IF p_company_type IS NOT NULL AND p_company_type NOT IN ('ipc','wholesaler') THEN
    RETURN rmm_error('VALIDATION_ERROR', 'Validation failed', jsonb_build_array(jsonb_build_object(
      'field', 'company_type', 'message', 'Company type must be ipc or wholesaler', 'code', 'INVALID_VALUE'
    )));
  END IF;

  IF p_registration_number IS NOT NULL AND EXISTS (
    SELECT 1 FROM companies c
    WHERE c.registration_number = trim(p_registration_number)
      AND c.id <> p_company_id
  ) THEN
    RETURN rmm_error('DUPLICATE_ENTRY', 'Company with this registration number already exists');
  END IF;

  UPDATE companies
  SET name = COALESCE(rmm_sanitize_text(p_name, 255), name),
      registration_number = COALESCE(rmm_sanitize_text(p_registration_number, 64), registration_number),
      company_type = COALESCE(p_company_type, company_type),
      address = COALESCE(rmm_sanitize_text(p_address, 1000), address),
      contact_email = COALESCE(rmm_sanitize_email(p_contact_email), contact_email),
      contact_phone = COALESCE(rmm_sanitize_phone(p_contact_phone), contact_phone),
      is_active = COALESCE(p_is_active, is_active),
      suspended_reason = COALESCE(rmm_sanitize_text(p_suspended_reason, 2000), suspended_reason),
      -- if suspension reason set while not suspended, leave timestamps untouched here (two-person rule handled in dedicated RPCs later)
      updated_at = now()
  WHERE id = p_company_id;

  PERFORM shared_create_audit_log(
    v_actor,
    'update',
    'companies',
    p_company_id,
    v_old,
    to_jsonb((SELECT c FROM companies c WHERE c.id = p_company_id)),
    NULL,
    NULL,
    NULL
  );

  RETURN jsonb_build_object('success', true, 'data', jsonb_build_object('id', p_company_id));
EXCEPTION
  WHEN others THEN
    RETURN rmm_error('SYSTEM_ERROR', 'An unexpected error occurred');
END;
$$;

CREATE OR REPLACE FUNCTION rmm_get_company(
  p_company_id uuid
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_actor uuid := auth.uid();
  v_row companies;
BEGIN
  IF v_actor IS NULL THEN
    RETURN rmm_error('AUTHENTICATION_ERROR', 'Authentication required');
  END IF;

  SELECT * INTO v_row FROM companies WHERE id = p_company_id;
  IF NOT FOUND THEN
    RETURN rmm_error('NOT_FOUND', 'Company not found');
  END IF;

  RETURN jsonb_build_object('success', true, 'data', to_jsonb(v_row));
EXCEPTION
  WHEN others THEN
    RETURN rmm_error('SYSTEM_ERROR', 'An unexpected error occurred');
END;
$$;

CREATE OR REPLACE FUNCTION rmm_list_companies(
  p_search text DEFAULT NULL,
  p_company_type text DEFAULT NULL,
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

  IF p_company_type IS NOT NULL AND p_company_type NOT IN ('ipc','wholesaler') THEN
    RETURN rmm_error('VALIDATION_ERROR', 'Validation failed', jsonb_build_array(jsonb_build_object(
      'field', 'company_type', 'message', 'Company type must be ipc or wholesaler', 'code', 'INVALID_VALUE'
    )));
  END IF;

  SELECT count(*) INTO v_total
  FROM companies c
  WHERE (v_search IS NULL OR c.name ILIKE '%' || v_search || '%' OR c.registration_number ILIKE '%' || v_search || '%')
    AND (p_company_type IS NULL OR c.company_type = p_company_type)
    AND (p_is_active IS NULL OR c.is_active = p_is_active);

  SELECT COALESCE(jsonb_agg(to_jsonb(c)), '[]'::jsonb) INTO v_items
  FROM (
    SELECT *
    FROM companies c
    WHERE (v_search IS NULL OR c.name ILIKE '%' || v_search || '%' OR c.registration_number ILIKE '%' || v_search || '%')
      AND (p_company_type IS NULL OR c.company_type = p_company_type)
      AND (p_is_active IS NULL OR c.is_active = p_is_active)
    ORDER BY c.created_at DESC
    LIMIT LEAST(GREATEST(p_limit, 1), 500)
    OFFSET GREATEST(p_offset, 0)
  ) c;

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

