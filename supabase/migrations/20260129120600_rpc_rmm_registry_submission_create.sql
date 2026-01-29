-- Migration: RMM registry submission create (Task 1.1.2.6)
-- Description: rmm_submit_registry_update - create draft registry submission (company-originated).
-- Table: registry_submissions. No RLS INSERT for authenticated; RPC uses SECURITY DEFINER and enforces company ownership.
-- Depends on: 1.1.1.3-verify (RMM tables), 1.1.1.5 (RLS), 1.1.2.1–1.1.2.3 (Company/Product/SKU CRUD).
-- Date: 2026-01-29

BEGIN;

-- rmm_submit_registry_update(p_submission_type text, p_entity_type text, p_entity_id uuid, p_submission_data jsonb)
-- Creates a draft registry submission. Company users only; entity must belong to caller's company.
-- For deletion types: submission_data must include reason (min 50 chars). BUSINESS-LOGIC §4.3.
CREATE OR REPLACE FUNCTION public.rmm_submit_registry_update(
  p_submission_type text,
  p_entity_type text,
  p_entity_id uuid,
  p_submission_data jsonb
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid;
  v_role text;
  v_company_id uuid;
  v_submission_id uuid;
  v_reason text;
  v_entity_company_id uuid;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RETURN jsonb_build_object('error', 'unauthorized', 'message', 'not authenticated');
  END IF;

  SELECT role, company_id INTO v_role, v_company_id
  FROM public.users
  WHERE id = v_user_id AND is_active = true;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('error', 'user_not_found', 'message', 'user not found');
  END IF;

  -- Only company users create registry submissions (company-originated workflow)
  IF v_role NOT IN ('company_admin', 'company_manager', 'company_user') THEN
    RETURN jsonb_build_object('error', 'forbidden', 'message', 'only company users can create registry submissions');
  END IF;

  IF v_company_id IS NULL THEN
    RETURN jsonb_build_object('error', 'forbidden', 'message', 'company user must have company_id');
  END IF;

  -- Validate submission_type
  IF p_submission_type IS NULL OR trim(p_submission_type) = '' THEN
    RETURN jsonb_build_object('error', 'validation_error', 'message', 'submission_type is required');
  END IF;
  IF p_submission_type NOT IN (
    'company_create', 'company_update', 'company_delete',
    'product_create', 'product_update', 'product_delete',
    'sku_create', 'sku_update', 'sku_delete'
  ) THEN
    RETURN jsonb_build_object('error', 'validation_error', 'message', 'invalid submission_type');
  END IF;

  -- Validate entity_type matches submission_type
  IF p_entity_type IS NULL OR trim(p_entity_type) = '' THEN
    RETURN jsonb_build_object('error', 'validation_error', 'message', 'entity_type is required');
  END IF;
  IF (p_submission_type LIKE 'company_%' AND p_entity_type <> 'company')
     OR (p_submission_type LIKE 'product_%' AND p_entity_type <> 'product')
     OR (p_submission_type LIKE 'sku_%' AND p_entity_type <> 'sku') THEN
    RETURN jsonb_build_object('error', 'validation_error', 'message', 'entity_type must match submission_type');
  END IF;

  -- submission_data required
  IF p_submission_data IS NULL THEN
    RETURN jsonb_build_object('error', 'validation_error', 'message', 'submission_data is required');
  END IF;

  -- Deletion requests: mandatory reason (min 50 chars). BUSINESS-LOGIC §4.3
  IF p_submission_type IN ('company_delete', 'product_delete', 'sku_delete') THEN
    v_reason := p_submission_data->>'reason';
    IF v_reason IS NULL OR trim(v_reason) = '' THEN
      RETURN jsonb_build_object('error', 'validation_error', 'message', 'reason is required for deletion requests');
    END IF;
    IF length(trim(v_reason)) < 50 THEN
      RETURN jsonb_build_object('error', 'validation_error', 'message', 'reason must be at least 50 characters');
    END IF;
    IF p_entity_id IS NULL THEN
      RETURN jsonb_build_object('error', 'validation_error', 'message', 'entity_id is required for deletion requests');
    END IF;
  END IF;

  -- Validate entity ownership
  IF p_submission_type = 'company_create' THEN
    -- entity_id can be null for new company
    IF p_entity_id IS NOT NULL THEN
      IF p_entity_id <> v_company_id THEN
        RETURN jsonb_build_object('error', 'forbidden', 'message', 'entity_id must be your company or null for company_create');
      END IF;
    END IF;
  ELSIF p_submission_type IN ('company_update', 'company_delete') THEN
    IF p_entity_id IS NULL THEN
      RETURN jsonb_build_object('error', 'validation_error', 'message', 'entity_id is required for company_update/company_delete');
    END IF;
    IF p_entity_id <> v_company_id THEN
      RETURN jsonb_build_object('error', 'forbidden', 'message', 'can only submit for your own company');
    END IF;
  ELSIF p_submission_type LIKE 'product_%' THEN
    IF p_entity_id IS NULL AND p_submission_type <> 'product_create' THEN
      RETURN jsonb_build_object('error', 'validation_error', 'message', 'entity_id is required');
    END IF;
    IF p_entity_id IS NOT NULL THEN
      SELECT company_id INTO v_entity_company_id FROM public.products WHERE id = p_entity_id;
      IF NOT FOUND THEN
        RETURN jsonb_build_object('error', 'not_found', 'message', 'product not found');
      END IF;
      IF v_entity_company_id <> v_company_id THEN
        RETURN jsonb_build_object('error', 'forbidden', 'message', 'product does not belong to your company');
      END IF;
    END IF;
  ELSIF p_submission_type LIKE 'sku_%' THEN
    IF p_entity_id IS NULL AND p_submission_type <> 'sku_create' THEN
      RETURN jsonb_build_object('error', 'validation_error', 'message', 'entity_id is required');
    END IF;
    IF p_entity_id IS NOT NULL THEN
      SELECT p.company_id INTO v_entity_company_id
      FROM public.skus s
      JOIN public.products p ON p.id = s.product_id
      WHERE s.id = p_entity_id;
      IF NOT FOUND THEN
        RETURN jsonb_build_object('error', 'not_found', 'message', 'sku not found');
      END IF;
      IF v_entity_company_id <> v_company_id THEN
        RETURN jsonb_build_object('error', 'forbidden', 'message', 'sku does not belong to your company');
      END IF;
    END IF;
  END IF;

  INSERT INTO public.registry_submissions (
    submission_type,
    entity_type,
    entity_id,
    submission_data,
    status,
    submitted_by
  )
  VALUES (
    trim(p_submission_type),
    trim(p_entity_type),
    p_entity_id,
    p_submission_data,
    'draft',
    v_user_id
  )
  RETURNING id INTO v_submission_id;

  RETURN jsonb_build_object(
    'submission',
    (SELECT to_jsonb(r) FROM (
      SELECT id, submission_type, entity_type, entity_id, submission_data, status, submitted_by, created_at, updated_at
      FROM public.registry_submissions
      WHERE id = v_submission_id
    ) r)
  );
END;
$$;

COMMENT ON FUNCTION public.rmm_submit_registry_update(text, text, uuid, jsonb)
  IS 'Create draft registry submission (company-originated). Company users only; entity must belong to caller company. Deletion requires reason min 50 chars. Task 1.1.2.6.';

GRANT EXECUTE ON FUNCTION public.rmm_submit_registry_update(text, text, uuid, jsonb) TO authenticated;
GRANT EXECUTE ON FUNCTION public.rmm_submit_registry_update(text, text, uuid, jsonb) TO service_role;

COMMIT;
