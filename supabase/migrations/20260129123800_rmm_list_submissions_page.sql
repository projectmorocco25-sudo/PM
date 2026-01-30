-- Migration: rmm_list_submissions_page for Registry submission list page (Task 1.1.2.26)
-- Description: List registry submissions with filters (status, entity_type, date range); entity display name; view_type (company|moh); regulatory deadline display.
--   SECURITY INVOKER; RLS applies. Company users see own submissions only; MOH see all.
-- Dependencies: registry_submissions, companies, products, skus, registry_submission_company_id, current_user_role.
-- Date: 2026-01-29

BEGIN;

CREATE OR REPLACE FUNCTION public.rmm_list_submissions_page(
  p_limit int DEFAULT 50,
  p_offset int DEFAULT 0,
  p_status text DEFAULT NULL,
  p_entity_type text DEFAULT NULL,
  p_date_from timestamptz DEFAULT NULL,
  p_date_to timestamptz DEFAULT NULL
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
  v_entity_type text;
  v_role text;
  v_view_type text;
  v_regulatory_days int := 30;
BEGIN
  IF p_limit < 1 OR p_limit > 500 THEN
    p_limit := 50;
  END IF;
  IF p_offset < 0 THEN
    p_offset := 0;
  END IF;
  v_status := nullif(lower(trim(coalesce(p_status, ''))), '');
  IF v_status IS NOT NULL AND v_status NOT IN ('all', 'draft', 'submitted', 'tier2_verified', 'tier2_peer_reviewed', 'tier1_approved', 'tier2_implemented', 'completed', 'rejected') THEN
    v_status := NULL;
  END IF;
  v_entity_type := nullif(lower(trim(coalesce(p_entity_type, ''))), '');
  IF v_entity_type IS NOT NULL AND v_entity_type NOT IN ('all', 'company', 'product', 'sku') THEN
    v_entity_type := NULL;
  END IF;

  v_role := current_user_role();
  v_view_type := CASE
    WHEN v_role IN ('tier1', 'tier2_officer', 'tier2_registrar', 'auditor', 'system_admin') THEN 'moh'
    ELSE 'company'
  END;

  SELECT count(*) INTO total
  FROM public.registry_submissions rs
  WHERE (v_status IS NULL OR v_status = 'all' OR rs.status = v_status
    OR (v_status = 'tier2_verified' AND rs.status IN ('tier2_verified', 'tier2_peer_reviewed')))
    AND (v_entity_type IS NULL OR v_entity_type = 'all' OR rs.entity_type = v_entity_type)
    AND (p_date_from IS NULL OR rs.created_at >= p_date_from)
    AND (p_date_to IS NULL OR rs.created_at <= p_date_to);

  SELECT jsonb_agg(row_to_json(t)::jsonb) INTO rows
  FROM (
    SELECT
      rs.id,
      rs.submission_type,
      rs.entity_type,
      rs.entity_id,
      CASE rs.entity_type
        WHEN 'company' THEN COALESCE(c.name, '(New company)')
        WHEN 'product' THEN COALESCE(p.name, '(New product)')
        WHEN 'sku' THEN COALESCE(s.name, '(New SKU)')
        ELSE NULL
      END AS entity_display_name,
      rs.status,
      rs.submitted_by,
      rs.created_at,
      rs.updated_at,
      CASE
        WHEN rs.status IN ('completed', 'rejected', 'draft') THEN NULL
        WHEN rs.status IN ('submitted', 'tier2_verified', 'tier2_peer_reviewed', 'tier1_approved', 'tier2_implemented') THEN
          GREATEST(0, v_regulatory_days - (EXTRACT(epoch FROM (now() - COALESCE(rs.updated_at, rs.created_at)))/86400)::int)
        ELSE NULL
      END AS days_until_deadline
    FROM public.registry_submissions rs
    LEFT JOIN public.companies c ON c.id = rs.entity_id AND rs.entity_type = 'company'
    LEFT JOIN public.products p ON p.id = rs.entity_id AND rs.entity_type = 'product'
    LEFT JOIN public.skus s ON s.id = rs.entity_id AND rs.entity_type = 'sku'
    WHERE (v_status IS NULL OR v_status = 'all' OR rs.status = v_status
      OR (v_status = 'tier2_verified' AND rs.status IN ('tier2_verified', 'tier2_peer_reviewed')))
      AND (v_entity_type IS NULL OR v_entity_type = 'all' OR rs.entity_type = v_entity_type)
      AND (p_date_from IS NULL OR rs.created_at >= p_date_from)
      AND (p_date_to IS NULL OR rs.created_at <= p_date_to)
    ORDER BY rs.created_at DESC
    LIMIT p_limit OFFSET p_offset
  ) t;

  RETURN jsonb_build_object(
    'data', coalesce(rows, '[]'::jsonb),
    'total', total,
    'view_type', v_view_type
  );
END;
$$;

COMMENT ON FUNCTION public.rmm_list_submissions_page(int, int, text, text, timestamptz, timestamptz)
  IS 'List registry submissions for list page: filters status, entity_type, date range. Returns entity_display_name, days_until_deadline (DMP Art. 10), view_type (company|moh). RLS applies. Task 1.1.2.26.';

GRANT EXECUTE ON FUNCTION public.rmm_list_submissions_page(int, int, text, text, timestamptz, timestamptz) TO authenticated;
GRANT EXECUTE ON FUNCTION public.rmm_list_submissions_page(int, int, text, text, timestamptz, timestamptz) TO service_role;

COMMIT;
