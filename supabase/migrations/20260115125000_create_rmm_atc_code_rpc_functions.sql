-- Migration: create_rmm_atc_code_rpc_functions
-- Description: RMM ATC code RPCs (read-only)
-- Date: 2026-01-15
-- Author: Maya
-- Phase: 1.1.2
-- Task: 1.1.2.4

BEGIN;

CREATE OR REPLACE FUNCTION rmm_list_atc_codes(
  p_search text DEFAULT NULL,
  p_is_active boolean DEFAULT true,
  p_limit integer DEFAULT 100,
  p_offset integer DEFAULT 0
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
  v_total integer;
  v_items jsonb;
  v_search text := NULLIF(trim(COALESCE(p_search, '')), '');
BEGIN
  IF v_actor IS NULL THEN
    RETURN rmm_error('AUTHENTICATION_ERROR', 'Authentication required');
  END IF;

  SELECT role, company_id INTO v_role, v_company_id FROM users WHERE id = v_actor;

  -- MOH-only per task (companies may have read access via table policy, but RPC enforces MOH-only).
  IF v_company_id IS NOT NULL OR v_role NOT IN ('tier1','tier2_officer','tier2_registrar','system_admin') THEN
    RETURN rmm_error('AUTHORIZATION_ERROR', 'You do not have permission to view ATC codes');
  END IF;

  SELECT count(*) INTO v_total
  FROM atc_codes a
  WHERE (p_is_active IS NULL OR a.is_active = p_is_active)
    AND (v_search IS NULL OR a.code ILIKE '%' || v_search || '%' OR COALESCE(a.description,'') ILIKE '%' || v_search || '%');

  SELECT COALESCE(jsonb_agg(to_jsonb(x)), '[]'::jsonb) INTO v_items
  FROM (
    SELECT *
    FROM atc_codes a
    WHERE (p_is_active IS NULL OR a.is_active = p_is_active)
      AND (v_search IS NULL OR a.code ILIKE '%' || v_search || '%' OR COALESCE(a.description,'') ILIKE '%' || v_search || '%')
    ORDER BY a.code ASC
    LIMIT LEAST(GREATEST(p_limit, 1), 500)
    OFFSET GREATEST(p_offset, 0)
  ) x;

  RETURN jsonb_build_object('success', true, 'data', jsonb_build_object('total', v_total, 'items', v_items));
EXCEPTION
  WHEN others THEN
    RETURN rmm_error('SYSTEM_ERROR', 'An unexpected error occurred');
END;
$$;

CREATE OR REPLACE FUNCTION rmm_get_atc_code(
  p_atc_code_id uuid
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
  v_row atc_codes;
BEGIN
  IF v_actor IS NULL THEN
    RETURN rmm_error('AUTHENTICATION_ERROR', 'Authentication required');
  END IF;

  SELECT role, company_id INTO v_role, v_company_id FROM users WHERE id = v_actor;
  IF v_company_id IS NOT NULL OR v_role NOT IN ('tier1','tier2_officer','tier2_registrar','system_admin') THEN
    RETURN rmm_error('AUTHORIZATION_ERROR', 'You do not have permission to view ATC codes');
  END IF;

  SELECT * INTO v_row FROM atc_codes WHERE id = p_atc_code_id;
  IF NOT FOUND THEN
    RETURN rmm_error('NOT_FOUND', 'ATC code not found');
  END IF;

  RETURN jsonb_build_object('success', true, 'data', to_jsonb(v_row));
EXCEPTION
  WHEN others THEN
    RETURN rmm_error('SYSTEM_ERROR', 'An unexpected error occurred');
END;
$$;

COMMIT;

