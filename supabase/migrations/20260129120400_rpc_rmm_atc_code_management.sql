-- Migration: RMM ATC Code management RPCs (Task 1.1.2.4)
-- Description: rmm_list_atc_codes, rmm_get_atc_code, rmm_create_atc_code, rmm_update_atc_code.
-- Table: atc_codes. RLS applies via SECURITY INVOKER (SELECT all authenticated; INSERT/UPDATE/DELETE MOH only).
-- Depends on: 1.1.1.3-verify (RMM tables), 1.1.1.5 (RLS policies RMM).
-- Date: 2026-01-29

BEGIN;

-- rmm_list_atc_codes(p_limit int, p_offset int, p_code_filter text)
-- SELECT allowed for all authenticated (companies need list for SKU/product forms). RLS atc_codes_select.
CREATE OR REPLACE FUNCTION public.rmm_list_atc_codes(
  p_limit int DEFAULT 50,
  p_offset int DEFAULT 0,
  p_code_filter text DEFAULT NULL
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
BEGIN
  IF p_limit < 1 OR p_limit > 500 THEN
    p_limit := 50;
  END IF;
  IF p_offset < 0 THEN
    p_offset := 0;
  END IF;
  SELECT count(*) INTO total
  FROM public.atc_codes a
  WHERE a.is_active = true
    AND (p_code_filter IS NULL OR p_code_filter = '' OR a.code ILIKE '%' || trim(p_code_filter) || '%');
  SELECT jsonb_agg(t) INTO rows
  FROM (
    SELECT id, code, description, is_active, created_at, updated_at
    FROM public.atc_codes
    WHERE is_active = true
      AND (p_code_filter IS NULL OR p_code_filter = '' OR code ILIKE '%' || trim(p_code_filter) || '%')
    ORDER BY code
    LIMIT p_limit OFFSET p_offset
  ) t;
  RETURN jsonb_build_object('data', coalesce(rows, '[]'::jsonb), 'total', total);
END;
$$;
COMMENT ON FUNCTION public.rmm_list_atc_codes(int, int, text) IS 'List ATC codes with optional code filter. RLS applies (SELECT all). Task 1.1.2.4.';
GRANT EXECUTE ON FUNCTION public.rmm_list_atc_codes(int, int, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.rmm_list_atc_codes(int, int, text) TO service_role;

-- rmm_get_atc_code(p_id uuid)
-- Get one ATC code by id. RLS atc_codes_select (all authenticated).
CREATE OR REPLACE FUNCTION public.rmm_get_atc_code(p_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
  r record;
BEGIN
  SELECT id, code, description, is_active, created_at, updated_at
  INTO r
  FROM public.atc_codes
  WHERE id = p_id;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('error', 'not_found', 'atc_code_id', p_id);
  END IF;
  RETURN jsonb_build_object('atc_code', to_jsonb(r));
END;
$$;
COMMENT ON FUNCTION public.rmm_get_atc_code(uuid) IS 'Get one ATC code by id. RLS applies. Task 1.1.2.4.';
GRANT EXECUTE ON FUNCTION public.rmm_get_atc_code(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.rmm_get_atc_code(uuid) TO service_role;

-- rmm_create_atc_code(p_code text, p_description text, p_is_active boolean)
-- MOH only (RLS atc_codes_insert_moh).
CREATE OR REPLACE FUNCTION public.rmm_create_atc_code(
  p_code text,
  p_description text DEFAULT NULL,
  p_is_active boolean DEFAULT true
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
  IF p_code IS NULL OR trim(p_code) = '' THEN
    RETURN jsonb_build_object('error', 'validation_error', 'message', 'code is required');
  END IF;

  INSERT INTO public.atc_codes (code, description, is_active)
  VALUES (
    trim(p_code),
    NULLIF(trim(p_description), ''),
    coalesce(p_is_active, true)
  )
  RETURNING id INTO v_id;

  SELECT id, code, description, is_active, created_at, updated_at
  INTO r
  FROM public.atc_codes
  WHERE id = v_id;

  RETURN jsonb_build_object('atc_code', to_jsonb(r));
EXCEPTION
  WHEN unique_violation THEN
    RETURN jsonb_build_object('error', 'unique_violation', 'message', 'ATC code already exists');
END;
$$;
COMMENT ON FUNCTION public.rmm_create_atc_code(text, text, boolean) IS 'Create ATC code. RLS applies (MOH only). Task 1.1.2.4.';
GRANT EXECUTE ON FUNCTION public.rmm_create_atc_code(text, text, boolean) TO authenticated;
GRANT EXECUTE ON FUNCTION public.rmm_create_atc_code(text, text, boolean) TO service_role;

-- rmm_update_atc_code(p_id uuid, p_code text, p_description text, p_is_active boolean)
-- MOH only (RLS atc_codes_update_moh). Only non-null params updated.
CREATE OR REPLACE FUNCTION public.rmm_update_atc_code(
  p_id uuid,
  p_code text DEFAULT NULL,
  p_description text DEFAULT NULL,
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
  IF p_code IS NOT NULL AND trim(p_code) = '' THEN
    RETURN jsonb_build_object('error', 'validation_error', 'message', 'code cannot be empty');
  END IF;

  UPDATE public.atc_codes
  SET
    code = coalesce(NULLIF(trim(p_code), ''), code),
    description = CASE WHEN p_description IS NOT NULL THEN NULLIF(trim(p_description), '') ELSE description END,
    is_active = coalesce(p_is_active, is_active),
    updated_at = now()
  WHERE id = p_id;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('error', 'not_found', 'atc_code_id', p_id);
  END IF;

  SELECT id, code, description, is_active, created_at, updated_at
  INTO r
  FROM public.atc_codes
  WHERE id = p_id;

  RETURN jsonb_build_object('atc_code', to_jsonb(r));
EXCEPTION
  WHEN unique_violation THEN
    RETURN jsonb_build_object('error', 'unique_violation', 'message', 'ATC code already exists');
END;
$$;
COMMENT ON FUNCTION public.rmm_update_atc_code(uuid, text, text, boolean) IS 'Update ATC code. Only non-null params updated. RLS applies (MOH only). Task 1.1.2.4.';
GRANT EXECUTE ON FUNCTION public.rmm_update_atc_code(uuid, text, text, boolean) TO authenticated;
GRANT EXECUTE ON FUNCTION public.rmm_update_atc_code(uuid, text, text, boolean) TO service_role;

COMMIT;
