-- Migration: Extend rmm_list_companies for Companies list page (Task 1.1.2.17)
-- Description: Add p_search (name/registration_number), p_company_type (ipc|wholesaler), p_status (all|active|inactive).
--   SECURITY INVOKER; RLS applies. Company users see only own company.
-- Dependencies: 20260127151300 (rmm_list_companies).
-- Date: 2026-01-29

BEGIN;

DROP FUNCTION IF EXISTS public.rmm_list_companies(int, int);

CREATE OR REPLACE FUNCTION public.rmm_list_companies(
  p_limit int DEFAULT 50,
  p_offset int DEFAULT 0,
  p_search text DEFAULT NULL,
  p_company_type text DEFAULT NULL,
  p_status text DEFAULT 'active'
)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
  total bigint;
  rows jsonb;
  v_status text;
BEGIN
  IF p_limit < 1 OR p_limit > 500 THEN
    p_limit := 50;
  END IF;
  IF p_offset < 0 THEN
    p_offset := 0;
  END IF;
  v_status := coalesce(nullif(lower(trim(coalesce(p_status, 'active'))), ''), 'active');
  IF v_status NOT IN ('all', 'active', 'inactive') THEN
    v_status := 'active';
  END IF;

  SELECT count(*) INTO total
  FROM public.companies c
  WHERE (p_search IS NULL OR p_search = '' OR c.name ILIKE '%' || trim(p_search) || '%' OR c.registration_number ILIKE '%' || trim(p_search) || '%')
    AND (p_company_type IS NULL OR p_company_type = '' OR lower(trim(p_company_type)) = c.company_type)
    AND (v_status = 'all' OR (v_status = 'active' AND c.is_active = true) OR (v_status = 'inactive' AND c.is_active = false));

  SELECT jsonb_agg(row_to_json(t)::jsonb) INTO rows
  FROM (
    SELECT id, name, registration_number, company_type, contact_email, is_active, created_at
    FROM public.companies c
    WHERE (p_search IS NULL OR p_search = '' OR c.name ILIKE '%' || trim(p_search) || '%' OR c.registration_number ILIKE '%' || trim(p_search) || '%')
      AND (p_company_type IS NULL OR p_company_type = '' OR lower(trim(p_company_type)) = c.company_type)
      AND (v_status = 'all' OR (v_status = 'active' AND c.is_active = true) OR (v_status = 'inactive' AND c.is_active = false))
    ORDER BY name
    LIMIT p_limit OFFSET p_offset
  ) t;

  RETURN jsonb_build_object('data', coalesce(rows, '[]'::jsonb), 'total', total);
END;
$$;

COMMENT ON FUNCTION public.rmm_list_companies(int, int, text, text, text)
  IS 'List companies with pagination, search (name/registration_number), type (ipc|wholesaler), status (all|active|inactive). RLS applies. Task 1.1.2.17.';

GRANT EXECUTE ON FUNCTION public.rmm_list_companies(int, int, text, text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.rmm_list_companies(int, int, text, text, text) TO service_role;

COMMIT;
