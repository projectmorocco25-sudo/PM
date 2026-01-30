-- Migration: enforcement_list_actions RPC (Task 1.1.2.38)
-- Description: List enforcement actions with filters (action type, status, company, date range, search) and pagination. MOH only.
-- Tables: enforcement_actions, companies.
-- Date: 2026-01-29

BEGIN;

CREATE OR REPLACE FUNCTION public.enforcement_list_actions(
  p_search text DEFAULT NULL,
  p_action_types text[] DEFAULT NULL,
  p_status text DEFAULT 'all',
  p_company_id uuid DEFAULT NULL,
  p_date_from timestamptz DEFAULT NULL,
  p_date_to timestamptz DEFAULT NULL,
  p_limit int DEFAULT 20,
  p_offset int DEFAULT 0
)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_role text;
  v_total bigint;
  v_search text;
  rows jsonb;
BEGIN
  SELECT role INTO v_role FROM public.users WHERE id = auth.uid() AND is_active = true;
  IF NOT FOUND OR v_role IS NULL THEN
    RETURN jsonb_build_object('error', 'unauthorized', 'message', 'not authenticated');
  END IF;
  IF v_role NOT IN ('tier1', 'tier2_officer', 'tier2_registrar', 'system_admin') THEN
    RETURN jsonb_build_object('error', 'forbidden', 'message', 'MOH access only');
  END IF;

  IF p_limit < 1 OR p_limit > 100 THEN p_limit := 20; END IF;
  IF p_offset < 0 THEN p_offset := 0; END IF;
  v_search := nullif(trim(coalesce(p_search, '')), '');

  SELECT count(*) INTO v_total
  FROM public.enforcement_actions ea
  JOIN public.companies c ON c.id = ea.company_id
  WHERE ea.status != 'draft'
    AND (v_search IS NULL OR (
      c.name ILIKE '%' || v_search || '%'
      OR ea.violation_type::text ILIKE '%' || v_search || '%'
      OR ea.action_type::text ILIKE '%' || v_search || '%'
      OR ea.legal_basis ILIKE '%' || v_search || '%'
    ))
    AND (p_action_types IS NULL OR cardinality(p_action_types) = 0 OR ea.action_type = ANY(p_action_types))
    AND (p_status = 'all' OR (
      (p_status = 'pending' AND ea.status IN ('pending_review', 'pending_approval'))
      OR (p_status = 'executed' AND ea.status = 'executed')
      OR (p_status = 'appealed' AND ea.status = 'appealed')
      OR (p_status = 'resolved' AND ea.status = 'resolved')
      OR (p_status = 'cancelled' AND ea.status = 'cancelled')
    ))
    AND (p_company_id IS NULL OR ea.company_id = p_company_id)
    AND (p_date_from IS NULL OR ea.created_at >= p_date_from)
    AND (p_date_to IS NULL OR ea.created_at <= p_date_to);

  SELECT jsonb_agg(row_to_json(t)::jsonb) INTO rows
  FROM (
    SELECT ea.id, ea.company_id, c.name AS company_name, ea.action_type, ea.violation_type, ea.legal_basis,
      ea.amount, ea.currency, ea.status, ea.executed_at, ea.created_at, ea.updated_at
    FROM public.enforcement_actions ea
    JOIN public.companies c ON c.id = ea.company_id
    WHERE ea.status != 'draft'
      AND (v_search IS NULL OR (
        c.name ILIKE '%' || v_search || '%'
        OR ea.violation_type::text ILIKE '%' || v_search || '%'
        OR ea.action_type::text ILIKE '%' || v_search || '%'
        OR ea.legal_basis ILIKE '%' || v_search || '%'
      ))
      AND (p_action_types IS NULL OR cardinality(p_action_types) = 0 OR ea.action_type = ANY(p_action_types))
      AND (p_status = 'all' OR (
        (p_status = 'pending' AND ea.status IN ('pending_review', 'pending_approval'))
        OR (p_status = 'executed' AND ea.status = 'executed')
        OR (p_status = 'appealed' AND ea.status = 'appealed')
        OR (p_status = 'resolved' AND ea.status = 'resolved')
        OR (p_status = 'cancelled' AND ea.status = 'cancelled')
      ))
      AND (p_company_id IS NULL OR ea.company_id = p_company_id)
      AND (p_date_from IS NULL OR ea.created_at >= p_date_from)
      AND (p_date_to IS NULL OR ea.created_at <= p_date_to)
    ORDER BY ea.updated_at DESC NULLS LAST
    LIMIT p_limit OFFSET p_offset
  ) t;

  RETURN jsonb_build_object('data', coalesce(rows, '[]'::jsonb), 'total', v_total);
END;
$$;

COMMENT ON FUNCTION public.enforcement_list_actions(text, text[], text, uuid, timestamptz, timestamptz, int, int) IS 'List enforcement actions with filters and pagination. MOH only. Task 1.1.2.38.';
GRANT EXECUTE ON FUNCTION public.enforcement_list_actions(text, text[], text, uuid, timestamptz, timestamptz, int, int) TO authenticated;
GRANT EXECUTE ON FUNCTION public.enforcement_list_actions(text, text[], text, uuid, timestamptz, timestamptz, int, int) TO service_role;

COMMIT;
