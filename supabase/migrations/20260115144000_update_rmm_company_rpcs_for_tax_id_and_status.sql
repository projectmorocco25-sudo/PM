-- Migration: update_rmm_company_rpcs_for_tax_id_and_status
-- Description: Align company RPCs with wireframes (tax_id + status/is_active on create/update)
-- Date: 2026-01-15
-- Author: Nadia
-- Phase: 1.1.2
-- Related Wireframe: docs/04-design/user-experience/wireframes/01-rmm/companies/task-0.5.2.8-company-create-edit-form.md

BEGIN;

-- Replace rmm_create_company with signature that supports tax_id + is_active.
DROP FUNCTION IF EXISTS rmm_create_company(text,text,text,text,text,text);

CREATE OR REPLACE FUNCTION rmm_create_company(
  p_name text,
  p_registration_number text,
  p_company_type text,
  p_address text DEFAULT NULL,
  p_tax_id text DEFAULT NULL,
  p_contact_email text DEFAULT NULL,
  p_contact_phone text DEFAULT NULL,
  p_is_active boolean DEFAULT true
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
  v_is_active boolean := COALESCE(p_is_active, true);
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

  -- Only Tier 1 / system_admin may set inactive at creation time; others default to active.
  IF v_role NOT IN ('tier1','system_admin') THEN
    v_is_active := true;
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
    tax_id,
    contact_email,
    contact_phone,
    is_active
  ) VALUES (
    rmm_sanitize_text(p_name, 255),
    rmm_sanitize_text(p_registration_number, 64),
    p_company_type,
    rmm_sanitize_text(p_address, 1000),
    rmm_sanitize_text(p_tax_id, 50),
    rmm_sanitize_email(p_contact_email),
    rmm_sanitize_phone(p_contact_phone),
    v_is_active
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

-- Replace rmm_update_company with signature that supports tax_id.
DROP FUNCTION IF EXISTS rmm_update_company(uuid,text,text,text,text,text,text,boolean,text);

CREATE OR REPLACE FUNCTION rmm_update_company(
  p_company_id uuid,
  p_name text DEFAULT NULL,
  p_registration_number text DEFAULT NULL,
  p_company_type text DEFAULT NULL,
  p_address text DEFAULT NULL,
  p_tax_id text DEFAULT NULL,
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
      tax_id = COALESCE(rmm_sanitize_text(p_tax_id, 50), tax_id),
      contact_email = COALESCE(rmm_sanitize_email(p_contact_email), contact_email),
      contact_phone = COALESCE(rmm_sanitize_phone(p_contact_phone), contact_phone),
      is_active = COALESCE(p_is_active, is_active),
      suspended_reason = COALESCE(rmm_sanitize_text(p_suspended_reason, 2000), suspended_reason),
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

COMMIT;

