-- Migration: RMM Company CRUD RPCs (Task 1.1.2.1)
-- Description: rmm_create_company, rmm_update_company. rmm_get_company and rmm_list_companies exist in 20260127151300_rpc_rmm_list_functions.sql.
-- Tables: companies. RLS applies via SECURITY INVOKER.
-- Depends on: 1.1.1.3-verify (RMM tables), 1.1.1.5 (RLS policies RMM).
-- Date: 2026-01-29

BEGIN;

-- rmm_create_company(p_name, p_registration_number, p_company_type, p_address, p_contact_email, p_contact_phone)
-- Purpose: Create new company. MOH only (RLS companies_insert_moh).
CREATE OR REPLACE FUNCTION public.rmm_create_company(
  p_name text,
  p_registration_number text,
  p_company_type text,
  p_address text DEFAULT NULL,
  p_contact_email text DEFAULT NULL,
  p_contact_phone text DEFAULT NULL
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
  IF p_name IS NULL OR trim(p_name) = '' THEN
    RETURN jsonb_build_object('error', 'validation_error', 'message', 'name is required');
  END IF;
  IF p_registration_number IS NULL OR trim(p_registration_number) = '' THEN
    RETURN jsonb_build_object('error', 'validation_error', 'message', 'registration_number is required');
  END IF;
  IF p_company_type IS NULL OR lower(trim(p_company_type)) NOT IN ('ipc', 'wholesaler') THEN
    RETURN jsonb_build_object('error', 'validation_error', 'message', 'company_type must be ipc or wholesaler');
  END IF;

  INSERT INTO public.companies (name, registration_number, company_type, address, contact_email, contact_phone)
  VALUES (
    trim(p_name),
    trim(p_registration_number),
    lower(trim(p_company_type)),
    NULLIF(trim(p_address), ''),
    NULLIF(trim(p_contact_email), ''),
    NULLIF(trim(p_contact_phone), '')
  )
  RETURNING id INTO v_id;

  SELECT id, name, registration_number, company_type, address, contact_email, contact_phone, is_active, created_at, updated_at
  INTO r
  FROM public.companies
  WHERE id = v_id;

  RETURN jsonb_build_object('company', to_jsonb(r));
EXCEPTION
  WHEN unique_violation THEN
    RETURN jsonb_build_object('error', 'unique_violation', 'message', 'registration_number already exists');
  WHEN check_violation THEN
    RETURN jsonb_build_object('error', 'validation_error', 'message', 'company_type must be ipc or wholesaler');
END;
$$;

COMMENT ON FUNCTION public.rmm_create_company(text, text, text, text, text, text) IS 'Create company. RLS applies (MOH only). Task 1.1.2.1.';
GRANT EXECUTE ON FUNCTION public.rmm_create_company(text, text, text, text, text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.rmm_create_company(text, text, text, text, text, text) TO service_role;

-- rmm_update_company(p_id, p_name, p_registration_number, p_company_type, p_address, p_contact_email, p_contact_phone)
-- Purpose: Update company. Only non-null params are updated. MOH only (RLS companies_update_moh).
CREATE OR REPLACE FUNCTION public.rmm_update_company(
  p_id uuid,
  p_name text DEFAULT NULL,
  p_registration_number text DEFAULT NULL,
  p_company_type text DEFAULT NULL,
  p_address text DEFAULT NULL,
  p_contact_email text DEFAULT NULL,
  p_contact_phone text DEFAULT NULL
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
  IF p_company_type IS NOT NULL AND lower(trim(p_company_type)) NOT IN ('ipc', 'wholesaler') THEN
    RETURN jsonb_build_object('error', 'validation_error', 'message', 'company_type must be ipc or wholesaler');
  END IF;
  IF p_name IS NOT NULL AND trim(p_name) = '' THEN
    RETURN jsonb_build_object('error', 'validation_error', 'message', 'name cannot be empty');
  END IF;
  IF p_registration_number IS NOT NULL AND trim(p_registration_number) = '' THEN
    RETURN jsonb_build_object('error', 'validation_error', 'message', 'registration_number cannot be empty');
  END IF;

  UPDATE public.companies
  SET
    name = COALESCE(NULLIF(trim(p_name), ''), name),
    registration_number = COALESCE(NULLIF(trim(p_registration_number), ''), registration_number),
    company_type = COALESCE(lower(NULLIF(trim(p_company_type), '')), company_type),
    address = CASE WHEN p_address IS NOT NULL THEN NULLIF(trim(p_address), '') ELSE address END,
    contact_email = CASE WHEN p_contact_email IS NOT NULL THEN NULLIF(trim(p_contact_email), '') ELSE contact_email END,
    contact_phone = CASE WHEN p_contact_phone IS NOT NULL THEN NULLIF(trim(p_contact_phone), '') ELSE contact_phone END,
    updated_at = now()
  WHERE id = p_id;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('error', 'not_found', 'company_id', p_id);
  END IF;

  SELECT id, name, registration_number, company_type, address, contact_email, contact_phone, is_active, created_at, updated_at
  INTO r
  FROM public.companies
  WHERE id = p_id;

  RETURN jsonb_build_object('company', to_jsonb(r));
EXCEPTION
  WHEN unique_violation THEN
    RETURN jsonb_build_object('error', 'unique_violation', 'message', 'registration_number already exists');
  WHEN check_violation THEN
    RETURN jsonb_build_object('error', 'validation_error', 'message', 'company_type must be ipc or wholesaler');
END;
$$;

COMMENT ON FUNCTION public.rmm_update_company(uuid, text, text, text, text, text, text) IS 'Update company. Only non-null params updated. RLS applies (MOH only). Task 1.1.2.1.';
GRANT EXECUTE ON FUNCTION public.rmm_update_company(uuid, text, text, text, text, text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.rmm_update_company(uuid, text, text, text, text, text, text) TO service_role;

COMMIT;
