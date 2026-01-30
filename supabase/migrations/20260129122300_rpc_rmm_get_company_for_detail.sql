-- Migration: rmm_get_company_for_detail (Task 1.1.2.18)
-- Description: Get company by id for detail page; includes inactive companies and full fields (address, contact_phone, created_at, updated_at).
-- Tables: companies. RLS applies via SECURITY INVOKER.
-- Date: 2026-01-29

BEGIN;

CREATE OR REPLACE FUNCTION public.rmm_get_company_for_detail(p_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
  r record;
BEGIN
  SELECT id, name, registration_number, company_type, address, contact_email, contact_phone,
         is_active, created_at, updated_at
  INTO r
  FROM public.companies
  WHERE id = p_id;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('error', 'not_found', 'company_id', p_id);
  END IF;
  RETURN jsonb_build_object('company', to_jsonb(r));
END;
$$;

COMMENT ON FUNCTION public.rmm_get_company_for_detail(uuid) IS 'Get company by id for detail page (includes inactive). Full fields. RLS applies. Task 1.1.2.18.';
GRANT EXECUTE ON FUNCTION public.rmm_get_company_for_detail(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.rmm_get_company_for_detail(uuid) TO service_role;

COMMIT;
