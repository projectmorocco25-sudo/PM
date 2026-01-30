-- Migration: Extend rmm_list_atc_codes for ATC list page (Task 1.1.2.29)
-- Description: Add p_level, p_category filters; search description; return computed level.
-- Table: atc_codes. RLS unchanged (SECURITY INVOKER).
-- Date: 2026-01-29

BEGIN;

CREATE OR REPLACE FUNCTION public.rmm_list_atc_codes(
  p_limit int DEFAULT 50,
  p_offset int DEFAULT 0,
  p_code_filter text DEFAULT NULL,
  p_level int DEFAULT NULL,
  p_category text DEFAULT NULL
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
  v_code_filter text;
  v_category text;
BEGIN
  IF p_limit < 1 OR p_limit > 500 THEN
    p_limit := 50;
  END IF;
  IF p_offset < 0 THEN
    p_offset := 0;
  END IF;
  v_code_filter := NULLIF(trim(p_code_filter), '');
  v_category := NULLIF(trim(p_category), '');

  WITH base AS (
    SELECT
      id,
      code,
      description,
      is_active,
      created_at,
      updated_at,
      CASE
        WHEN code ~ '^[A-Za-z]$' THEN 1
        WHEN code ~ '^[A-Za-z][0-9]{2}$' THEN 2
        WHEN code ~ '^[A-Za-z][0-9]{2}[A-Za-z]$' THEN 3
        WHEN code ~ '^[A-Za-z][0-9]{2}[A-Za-z]{2}$' THEN 4
        ELSE 5
      END AS level
    FROM public.atc_codes
    WHERE is_active = true
      AND (v_code_filter IS NULL OR code ILIKE '%' || v_code_filter || '%' OR description ILIKE '%' || v_code_filter || '%')
      AND (p_level IS NULL OR p_level < 1 OR p_level > 4 OR (
        CASE
          WHEN code ~ '^[A-Za-z]$' THEN 1
          WHEN code ~ '^[A-Za-z][0-9]{2}$' THEN 2
          WHEN code ~ '^[A-Za-z][0-9]{2}[A-Za-z]$' THEN 3
          WHEN code ~ '^[A-Za-z][0-9]{2}[A-Za-z]{2}$' THEN 4
          ELSE 5
        END = p_level
      ))
      AND (v_category IS NULL OR length(v_category) < 1 OR left(upper(code), 1) = upper(left(v_category, 1)))
  ),
  counted AS (SELECT count(*) AS total FROM base),
  paged AS (SELECT id, code, description, is_active, created_at, updated_at, level FROM base ORDER BY code LIMIT p_limit OFFSET p_offset)
  SELECT
    (SELECT counted.total FROM counted),
    (SELECT coalesce(jsonb_agg(t), '[]'::jsonb) FROM (SELECT * FROM paged) t)
  INTO total, rows;

  RETURN jsonb_build_object('data', coalesce(rows, '[]'::jsonb), 'total', total);
END;
$$;

COMMENT ON FUNCTION public.rmm_list_atc_codes(int, int, text, int, text) IS 'List ATC codes with optional code/description filter, level (1-4), category (first letter). Returns level. Task 1.1.2.29.';
GRANT EXECUTE ON FUNCTION public.rmm_list_atc_codes(int, int, text, int, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.rmm_list_atc_codes(int, int, text, int, text) TO service_role;

COMMIT;
