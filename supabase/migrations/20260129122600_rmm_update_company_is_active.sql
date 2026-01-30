-- Migration: Add p_is_active to rmm_update_company (Task 1.1.2.19)
-- Description: Allow updating company status (active/inactive) from create/edit form. MOH only (RLS).
-- Dependencies: 20260129120000 (rmm_update_company).
-- Date: 2026-01-29

BEGIN;

DROP FUNCTION IF EXISTS public.rmm_update_company(uuid, text, text, text, text, text, text);

CREATE OR REPLACE FUNCTION public.rmm_update_company(
  p_id uuid,
  p_name text DEFAULT NULL,
  p_registration_number text DEFAULT NULL,
  p_company_type text DEFAULT NULL,
  p_address text DEFAULT NULL,
  p_contact_email text DEFAULT NULL,
  p_contact_phone text DEFAULT NULL,
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
    is_active = CASE WHEN p_is_active IS NOT NULL THEN p_is_active ELSE is_active END,
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

COMMENT ON FUNCTION public.rmm_update_company(uuid, text, text, text, text, text, text, boolean)
  IS 'Update company. Only non-null params updated. p_is_active for status. RLS applies (MOH only). Task 1.1.2.19.';

GRANT EXECUTE ON FUNCTION public.rmm_update_company(uuid, text, text, text, text, text, text, boolean) TO authenticated;
GRANT EXECUTE ON FUNCTION public.rmm_update_company(uuid, text, text, text, text, text, text, boolean) TO service_role;

COMMIT;
