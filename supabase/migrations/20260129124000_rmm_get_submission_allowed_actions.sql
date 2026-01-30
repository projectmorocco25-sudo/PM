-- Migration: Add allowed_actions to rmm_get_submission for workflow action visibility (Task 1.1.2.28)
-- Description: Return allowed_actions array (verify, peer_review, approve, implement, reject) based on current user role and submission status.
-- Date: 2026-01-29

-- Add allowed_actions to rmm_get_submission return (role + status based).
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
  v_status text;
  v_allowed jsonb;
BEGIN
  v_role := current_user_role();
  v_company_id := current_user_company_id();

  SELECT registry_submission_company_id(p_id), rs.submitted_by, rs.status
    INTO v_sub_company_id, v_submitted_by, v_status
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
  IF v_status IN ('submitted', 'tier2_verified', 'tier2_peer_reviewed', 'tier1_approved', 'tier2_implemented') THEN
    SELECT GREATEST(0, v_regulatory_days - (EXTRACT(epoch FROM (now() - COALESCE(rs.updated_at, rs.created_at)))/86400)::int)
      INTO v_days_until_deadline
    FROM public.registry_submissions rs WHERE rs.id = p_id;
  END IF;

  v_allowed := '[]'::jsonb;
  IF v_role = 'tier2_officer' AND v_status = 'submitted' THEN
    v_allowed := v_allowed || jsonb_build_array('verify', 'peer_review');
  END IF;
  IF v_role = 'tier1' AND v_status IN ('tier2_verified', 'tier2_peer_reviewed') THEN
    v_allowed := v_allowed || jsonb_build_array('approve');
  END IF;
  IF v_role = 'tier2_registrar' AND v_status = 'tier1_approved' THEN
    v_allowed := v_allowed || jsonb_build_array('implement');
  END IF;
  IF (v_role = 'tier2_officer' OR v_role = 'tier1') AND v_status IN ('submitted', 'tier2_verified', 'tier2_peer_reviewed', 'tier1_approved') THEN
    v_allowed := v_allowed || jsonb_build_array('reject');
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
    'view_type', CASE WHEN v_role IN ('tier1', 'tier2_officer', 'tier2_registrar', 'auditor', 'system_admin') THEN 'moh' ELSE 'company' END,
    'allowed_actions', v_allowed
  ) INTO v_row
  FROM public.registry_submissions rs
  WHERE rs.id = p_id;

  RETURN v_row;
END;
$$;

COMMENT ON FUNCTION public.rmm_get_submission(uuid) IS 'Get registry submission by id with entity_display_name, days_until_deadline, view_type, allowed_actions (verify, peer_review, approve, implement, reject). Task 1.1.2.27, 1.1.2.28.';
