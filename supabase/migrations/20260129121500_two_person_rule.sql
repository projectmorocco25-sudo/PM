-- Migration: RMM two-person rule for critical actions (Task 1.1.2.15)
-- Description: Enforce Tier 1 approval + Tier 2 Officer confirmation before implementing
--              company_delete (suspension/deletion) and product_delete (deactivation/deletion).
--              Helper rmm_two_person_rule_satisfied(submission_id); enforce in rmm_implement_registry_update.
-- Tables: registry_submissions, users, approvals. RPC uses SECURITY DEFINER.
-- Depends on: 1.1.2.9 (implement), 1.1.1.4 (RLS core).
-- Date: 2026-01-29

BEGIN;

-- Helper: check that submission has Tier 2 Officer verification and Tier 1 approval (two different users)
CREATE OR REPLACE FUNCTION public.rmm_two_person_rule_satisfied(p_submission_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  r record;
  v_verifier_role text;
  v_approver_role text;
BEGIN
  IF p_submission_id IS NULL THEN
    RETURN jsonb_build_object('satisfied', false, 'message', 'submission_id is required');
  END IF;

  SELECT verified_by, approved_by INTO r
  FROM public.registry_submissions
  WHERE id = p_submission_id;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('satisfied', false, 'message', 'submission not found');
  END IF;

  IF r.verified_by IS NULL THEN
    RETURN jsonb_build_object('satisfied', false, 'message', 'Two-person rule not satisfied: Tier 2 Officer verification required');
  END IF;
  IF r.approved_by IS NULL THEN
    RETURN jsonb_build_object('satisfied', false, 'message', 'Two-person rule not satisfied: Tier 1 approval required');
  END IF;
  IF r.verified_by = r.approved_by THEN
    RETURN jsonb_build_object('satisfied', false, 'message', 'Two-person rule not satisfied: verifier and approver must be different users');
  END IF;

  SELECT role INTO v_verifier_role FROM public.users WHERE id = r.verified_by AND is_active = true;
  IF v_verifier_role IS NULL OR v_verifier_role <> 'tier2_officer' THEN
    RETURN jsonb_build_object('satisfied', false, 'message', 'Two-person rule not satisfied: verifier must be Tier 2 Officer');
  END IF;
  SELECT role INTO v_approver_role FROM public.users WHERE id = r.approved_by AND is_active = true;
  IF v_approver_role IS NULL OR v_approver_role <> 'tier1' THEN
    RETURN jsonb_build_object('satisfied', false, 'message', 'Two-person rule not satisfied: approver must be Tier 1');
  END IF;

  RETURN jsonb_build_object('satisfied', true);
END;
$$;

COMMENT ON FUNCTION public.rmm_two_person_rule_satisfied(uuid)
  IS 'Check Tier 1 + Tier 2 Officer two-person rule for critical actions. Returns { satisfied: true } or { satisfied: false, message }. Task 1.1.2.15.';

GRANT EXECUTE ON FUNCTION public.rmm_two_person_rule_satisfied(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.rmm_two_person_rule_satisfied(uuid) TO service_role;

-- Enforce two-person rule in implement RPC for critical actions (company_delete, product_delete)
CREATE OR REPLACE FUNCTION public.rmm_implement_registry_update(p_submission_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid;
  v_role text;
  r record;
  v_reason text;
  v_old_json jsonb;
  v_new_json jsonb;
  v_company_id uuid;
  v_entity_id uuid;
  v_create_result jsonb;
  v_tpr jsonb;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RETURN jsonb_build_object('error', 'unauthorized', 'message', 'not authenticated');
  END IF;

  SELECT role INTO v_role
  FROM public.users
  WHERE id = v_user_id AND is_active = true;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('error', 'user_not_found', 'message', 'user not found');
  END IF;

  IF v_role <> 'tier2_registrar' THEN
    RETURN jsonb_build_object('error', 'forbidden', 'message', 'only Tier 2 Registrar can implement registry updates');
  END IF;

  IF p_submission_id IS NULL THEN
    RETURN jsonb_build_object('error', 'validation_error', 'message', 'submission_id is required');
  END IF;

  SELECT id, submission_type, entity_type, entity_id, submission_data, status INTO r
  FROM public.registry_submissions
  WHERE id = p_submission_id;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('error', 'not_found', 'message', 'submission not found');
  END IF;
  IF r.status <> 'tier1_approved' THEN
    RETURN jsonb_build_object('error', 'invalid_status', 'message', 'submission must be in tier1_approved status to implement', 'current_status', r.status);
  END IF;

  -- Two-person rule: Tier 1 + Tier 2 Officer required for critical actions (company suspension/deletion, product deactivation/deletion)
  IF r.submission_type IN ('company_delete', 'product_delete') THEN
    v_tpr := public.rmm_two_person_rule_satisfied(p_submission_id);
    IF NOT (v_tpr->>'satisfied')::boolean THEN
      RETURN v_tpr || jsonb_build_object('error', 'two_person_rule_not_satisfied');
    END IF;
  END IF;

  v_reason := r.submission_data->>'reason';

  -- Deletion: soft delete with cascade and audit log
  IF r.submission_type = 'company_delete' THEN
    v_entity_id := r.entity_id;
    IF v_entity_id IS NULL THEN
      RETURN jsonb_build_object('error', 'validation_error', 'message', 'entity_id required for company_delete');
    END IF;
    SELECT to_jsonb(c.*) INTO v_old_json FROM public.companies c WHERE c.id = v_entity_id;
    IF NOT FOUND THEN
      RETURN jsonb_build_object('error', 'not_found', 'message', 'company not found');
    END IF;
    UPDATE public.products SET is_active = false, deactivated_at = now(), deactivated_by = v_user_id, deactivated_reason = v_reason WHERE company_id = v_entity_id;
    UPDATE public.skus s SET is_active = false, deactivated_at = now(), deactivated_by = v_user_id, deactivated_reason = v_reason
    FROM public.products p WHERE p.id = s.product_id AND p.company_id = v_entity_id;
    UPDATE public.companies SET is_active = false, suspended_at = now(), suspended_by = v_user_id, suspended_reason = v_reason WHERE id = v_entity_id;
    v_new_json := jsonb_build_object('is_active', false, 'suspended_at', now(), 'suspended_by', v_user_id, 'suspended_reason', v_reason);
    PERFORM public.insert_audit_log('companies', 'DELETE', v_entity_id, v_old_json, v_new_json, v_reason);

  ELSIF r.submission_type = 'product_delete' THEN
    v_entity_id := r.entity_id;
    IF v_entity_id IS NULL THEN
      RETURN jsonb_build_object('error', 'validation_error', 'message', 'entity_id required for product_delete');
    END IF;
    SELECT to_jsonb(p.*) INTO v_old_json FROM public.products p WHERE p.id = v_entity_id;
    IF NOT FOUND THEN
      RETURN jsonb_build_object('error', 'not_found', 'message', 'product not found');
    END IF;
    UPDATE public.skus SET is_active = false, deactivated_at = now(), deactivated_by = v_user_id, deactivated_reason = v_reason WHERE product_id = v_entity_id;
    UPDATE public.products SET is_active = false, deactivated_at = now(), deactivated_by = v_user_id, deactivated_reason = v_reason WHERE id = v_entity_id;
    v_new_json := jsonb_build_object('is_active', false, 'deactivated_at', now(), 'deactivated_by', v_user_id, 'deactivated_reason', v_reason);
    PERFORM public.insert_audit_log('products', 'DELETE', v_entity_id, v_old_json, v_new_json, v_reason);

  ELSIF r.submission_type = 'sku_delete' THEN
    v_entity_id := r.entity_id;
    IF v_entity_id IS NULL THEN
      RETURN jsonb_build_object('error', 'validation_error', 'message', 'entity_id required for sku_delete');
    END IF;
    SELECT to_jsonb(s.*) INTO v_old_json FROM public.skus s WHERE s.id = v_entity_id;
    IF NOT FOUND THEN
      RETURN jsonb_build_object('error', 'not_found', 'message', 'sku not found');
    END IF;
    UPDATE public.skus SET is_active = false, deactivated_at = now(), deactivated_by = v_user_id, deactivated_reason = v_reason WHERE id = v_entity_id;
    v_new_json := jsonb_build_object('is_active', false, 'deactivated_at', now(), 'deactivated_by', v_user_id, 'deactivated_reason', v_reason);
    PERFORM public.insert_audit_log('skus', 'DELETE', v_entity_id, v_old_json, v_new_json, v_reason);

  ELSIF r.submission_type = 'company_create' THEN
    v_create_result := public.rmm_create_company(
      r.submission_data->>'name',
      r.submission_data->>'registration_number',
      coalesce(r.submission_data->>'company_type', 'ipc'),
      r.submission_data->>'address',
      r.submission_data->>'contact_email',
      r.submission_data->>'contact_phone'
    );
    IF v_create_result ? 'error' THEN
      RETURN v_create_result;
    END IF;
    v_entity_id := (v_create_result->'company'->>'id')::uuid;
    UPDATE public.registry_submissions SET entity_id = v_entity_id WHERE id = p_submission_id;

  ELSIF r.submission_type = 'company_update' THEN
    v_entity_id := r.entity_id;
    IF v_entity_id IS NULL THEN
      RETURN jsonb_build_object('error', 'validation_error', 'message', 'entity_id required for company_update');
    END IF;
    v_create_result := public.rmm_update_company(
      v_entity_id,
      r.submission_data->>'name',
      r.submission_data->>'registration_number',
      r.submission_data->>'company_type',
      r.submission_data->>'address',
      r.submission_data->>'contact_email',
      r.submission_data->>'contact_phone'
    );
    IF v_create_result ? 'error' THEN
      RETURN v_create_result;
    END IF;

  ELSIF r.submission_type = 'product_create' THEN
    v_entity_id := (r.submission_data->>'company_id')::uuid;
    IF v_entity_id IS NULL THEN
      RETURN jsonb_build_object('error', 'validation_error', 'message', 'company_id required in submission_data for product_create');
    END IF;
    v_create_result := public.rmm_create_product(
      v_entity_id,
      r.submission_data->>'name',
      r.submission_data->>'description',
      (r.submission_data->>'is_critical_medicine')::boolean
    );
    IF v_create_result ? 'error' THEN
      RETURN v_create_result;
    END IF;
    v_entity_id := (v_create_result->'product'->>'id')::uuid;
    UPDATE public.registry_submissions SET entity_id = v_entity_id WHERE id = p_submission_id;

  ELSIF r.submission_type = 'product_update' THEN
    v_entity_id := r.entity_id;
    IF v_entity_id IS NULL THEN
      RETURN jsonb_build_object('error', 'validation_error', 'message', 'entity_id required for product_update');
    END IF;
    v_create_result := public.rmm_update_product(
      v_entity_id,
      r.submission_data->>'name',
      r.submission_data->>'description',
      (r.submission_data->>'is_critical_medicine')::boolean
    );
    IF v_create_result ? 'error' THEN
      RETURN v_create_result;
    END IF;

  ELSIF r.submission_type = 'sku_create' THEN
    v_entity_id := (r.submission_data->>'product_id')::uuid;
    IF v_entity_id IS NULL THEN
      RETURN jsonb_build_object('error', 'validation_error', 'message', 'product_id required in submission_data for sku_create');
    END IF;
    v_create_result := public.rmm_create_sku(
      v_entity_id,
      r.submission_data->>'sku_code',
      r.submission_data->>'name',
      r.submission_data->>'dosage_strength',
      r.submission_data->>'dosage_form',
      r.submission_data->>'pack_size',
      r.submission_data->>'unit_of_measure',
      (r.submission_data->>'atc_code_id')::uuid,
      (r.submission_data->>'is_moh_authorized_unregistered')::boolean
    );
    IF v_create_result ? 'error' THEN
      RETURN v_create_result;
    END IF;
    v_entity_id := (v_create_result->'sku'->>'id')::uuid;
    UPDATE public.registry_submissions SET entity_id = v_entity_id WHERE id = p_submission_id;

  ELSIF r.submission_type = 'sku_update' THEN
    v_entity_id := r.entity_id;
    IF v_entity_id IS NULL THEN
      RETURN jsonb_build_object('error', 'validation_error', 'message', 'entity_id required for sku_update');
    END IF;
    v_create_result := public.rmm_update_sku(
      v_entity_id,
      r.submission_data->>'sku_code',
      r.submission_data->>'name',
      r.submission_data->>'dosage_strength',
      r.submission_data->>'dosage_form',
      r.submission_data->>'pack_size',
      r.submission_data->>'unit_of_measure',
      (r.submission_data->>'atc_code_id')::uuid,
      (r.submission_data->>'is_moh_authorized_unregistered')::boolean
    );
    IF v_create_result ? 'error' THEN
      RETURN v_create_result;
    END IF;

  ELSE
    RETURN jsonb_build_object('error', 'validation_error', 'message', 'unknown submission_type');
  END IF;

  UPDATE public.registry_submissions
  SET status = 'tier2_implemented',
      implemented_by = v_user_id,
      implemented_at = now(),
      updated_at = now()
  WHERE id = p_submission_id;

  INSERT INTO public.approvals (submission_id, submission_type, from_status, to_status, approver_id, approval_type, comments)
  VALUES (p_submission_id, r.submission_type, 'tier1_approved', 'tier2_implemented', v_user_id, 'implementation', NULL);

  RETURN jsonb_build_object(
    'submission',
    (SELECT to_jsonb(s) FROM (
      SELECT id, submission_type, entity_type, entity_id, submission_data, status, submitted_by,
             verified_by, verified_at, approved_by, approved_at, implemented_by, implemented_at,
             rejection_reason, created_at, updated_at
      FROM public.registry_submissions
      WHERE id = p_submission_id
    ) s)
  );
END;
$$;

COMMENT ON FUNCTION public.rmm_implement_registry_update(uuid)
  IS 'Tier 2 Registrar implements approved registry update. tier1_approved -> tier2_implemented. Two-person rule enforced for company_delete and product_delete (Task 1.1.2.15). Task 1.1.2.9.';

COMMIT;
