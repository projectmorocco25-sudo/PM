-- Migration: rmm_get_submission, rmm_get_submission_approval_history for Registry submission detail page (Task 1.1.2.27)
-- Description: Get single submission with entity display name; get approval history for a submission. SECURITY DEFINER with explicit access check.
-- Dependencies: registry_submissions, approvals, companies, products, skus, users, registry_submission_company_id, current_user_role, current_user_company_id.
-- Date: 2026-01-29

BEGIN;

-- rmm_get_submission(p_id uuid): returns submission row with entity_display_name. Access: MOH all; company same-company or submitter for draft company_create.
CREATE OR REPLACE FUNCTION public.rmm_get_submission(p_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_role text;
  v_company_id uuid;
  v_sub_company_id uuid;
  v_submitted_by uuid;
  v_row jsonb;
  v_entity_display_name text;
  v_regulatory_days int := 30;
  v_days_until_deadline int;
BEGIN
  v_role := current_user_role();
  v_company_id := current_user_company_id();

  SELECT registry_submission_company_id(p_id), rs.submitted_by
    INTO v_sub_company_id, v_submitted_by
  FROM public.registry_submissions rs
  WHERE rs.id = p_id;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('error', 'not_found');
  END IF;

  IF v_role NOT IN ('tier1', 'tier2_officer', 'tier2_registrar', 'auditor', 'system_admin') THEN
    IF v_company_id IS NULL THEN
      RETURN jsonb_build_object('error', 'not_found');
    END IF;
    IF v_sub_company_id IS NOT NULL AND v_sub_company_id <> v_company_id THEN
      RETURN jsonb_build_object('error', 'not_found');
    END IF;
    IF v_sub_company_id IS NULL AND (v_submitted_by IS NULL OR v_submitted_by <> auth.uid()) THEN
      RETURN jsonb_build_object('error', 'not_found');
    END IF;
  END IF;

  SELECT CASE rs.entity_type
    WHEN 'company' THEN COALESCE(c.name, '(New company)')
    WHEN 'product' THEN COALESCE(p.name, '(New product)')
    WHEN 'sku' THEN COALESCE(s.name, '(New SKU)')
    ELSE NULL
  END INTO v_entity_display_name
  FROM public.registry_submissions rs
  LEFT JOIN public.companies c ON c.id = rs.entity_id AND rs.entity_type = 'company'
  LEFT JOIN public.products p ON p.id = rs.entity_id AND rs.entity_type = 'product'
  LEFT JOIN public.skus s ON s.id = rs.entity_id AND rs.entity_type = 'sku'
  WHERE rs.id = p_id;

  v_days_until_deadline := NULL;
  IF (SELECT status FROM public.registry_submissions WHERE id = p_id) IN ('submitted', 'tier2_verified', 'tier2_peer_reviewed', 'tier1_approved', 'tier2_implemented') THEN
    SELECT GREATEST(0, v_regulatory_days - (EXTRACT(epoch FROM (now() - COALESCE(rs.updated_at, rs.created_at)))/86400)::int)
      INTO v_days_until_deadline
    FROM public.registry_submissions rs WHERE rs.id = p_id;
  END IF;

  SELECT jsonb_build_object(
    'id', rs.id,
    'submission_type', rs.submission_type,
    'entity_type', rs.entity_type,
    'entity_id', rs.entity_id,
    'entity_display_name', v_entity_display_name,
    'submission_data', rs.submission_data,
    'status', rs.status,
    'submitted_by', rs.submitted_by,
    'verified_by', rs.verified_by,
    'verified_at', rs.verified_at,
    'approved_by', rs.approved_by,
    'approved_at', rs.approved_at,
    'implemented_by', rs.implemented_by,
    'implemented_at', rs.implemented_at,
    'rejection_reason', rs.rejection_reason,
    'created_at', rs.created_at,
    'updated_at', rs.updated_at,
    'days_until_deadline', v_days_until_deadline,
    'view_type', CASE WHEN v_role IN ('tier1', 'tier2_officer', 'tier2_registrar', 'auditor', 'system_admin') THEN 'moh' ELSE 'company' END
  ) INTO v_row
  FROM public.registry_submissions rs
  WHERE rs.id = p_id;

  RETURN v_row;
END;
$$;

COMMENT ON FUNCTION public.rmm_get_submission(uuid) IS 'Get registry submission by id with entity_display_name and days_until_deadline. Access: MOH all; company same-company or submitter for draft. Task 1.1.2.27.';

GRANT EXECUTE ON FUNCTION public.rmm_get_submission(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.rmm_get_submission(uuid) TO service_role;

-- rmm_get_submission_approval_history(p_submission_id uuid): returns approvals for submission with approver name/role. Same access as rmm_get_submission.
CREATE OR REPLACE FUNCTION public.rmm_get_submission_approval_history(p_submission_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_role text;
  v_company_id uuid;
  v_sub_company_id uuid;
  v_submitted_by uuid;
  v_rows jsonb;
BEGIN
  v_role := current_user_role();
  v_company_id := current_user_company_id();

  SELECT registry_submission_company_id(p_submission_id), rs.submitted_by
    INTO v_sub_company_id, v_submitted_by
  FROM public.registry_submissions rs
  WHERE rs.id = p_submission_id;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('data', '[]'::jsonb);
  END IF;

  IF v_role NOT IN ('tier1', 'tier2_officer', 'tier2_registrar', 'auditor', 'system_admin') THEN
    IF v_company_id IS NULL THEN
      RETURN jsonb_build_object('data', '[]'::jsonb);
    END IF;
    IF v_sub_company_id IS NOT NULL AND v_sub_company_id <> v_company_id THEN
      RETURN jsonb_build_object('data', '[]'::jsonb);
    END IF;
    IF v_sub_company_id IS NULL AND (v_submitted_by IS NULL OR v_submitted_by <> auth.uid()) THEN
      RETURN jsonb_build_object('data', '[]'::jsonb);
    END IF;
  END IF;

  SELECT jsonb_agg(row_to_json(t)::jsonb ORDER BY t.created_at DESC) INTO v_rows
  FROM (
    SELECT a.id, a.submission_id, a.from_status, a.to_status, a.approval_type, a.comments, a.created_at,
           u.full_name AS approver_name, u.role AS approver_role
    FROM public.approvals a
    JOIN public.users u ON u.id = a.approver_id
    WHERE a.submission_id = p_submission_id
  ) t;

  RETURN jsonb_build_object('data', COALESCE(v_rows, '[]'::jsonb));
END;
$$;

COMMENT ON FUNCTION public.rmm_get_submission_approval_history(uuid) IS 'Get approval history for a registry submission with approver name/role. Same access as rmm_get_submission. Task 1.1.2.27.';

GRANT EXECUTE ON FUNCTION public.rmm_get_submission_approval_history(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.rmm_get_submission_approval_history(uuid) TO service_role;

COMMIT;
