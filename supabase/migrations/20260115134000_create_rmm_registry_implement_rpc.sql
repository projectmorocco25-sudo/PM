-- Migration: create_rmm_registry_implement_rpc
-- Description: Registry workflow RPC - Tier 2 implementation (apply approved changes)
-- Date: 2026-01-15
-- Author: Maya
-- Phase: 1.1.2
-- Task: 1.1.2.9

BEGIN;

CREATE OR REPLACE FUNCTION rmm_implement_registry_update(
  p_submission_id uuid,
  p_comments text DEFAULT NULL
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
  v_row registry_submissions;
  v_old jsonb;
  v_from text;
  v_to text := 'tier2_implemented';
  v_is_moh boolean;
  v_entity_id uuid;
BEGIN
  IF v_actor IS NULL THEN
    RETURN rmm_error('AUTHENTICATION_ERROR', 'Authentication required');
  END IF;

  SELECT role, company_id INTO v_role, v_company_id FROM users WHERE id = v_actor;
  IF v_company_id IS NOT NULL OR v_role NOT IN ('tier2_registrar','system_admin') THEN
    RETURN rmm_error('AUTHORIZATION_ERROR', 'Tier 2 Registrar permission required');
  END IF;

  SELECT * INTO v_row FROM registry_submissions WHERE id = p_submission_id;
  IF NOT FOUND THEN
    RETURN rmm_error('NOT_FOUND', 'Registry submission not found');
  END IF;

  v_is_moh := (v_row.company_id IS NULL);
  v_from := v_row.status;

  IF NOT rmm_registry_is_valid_transition(v_from, v_to, v_is_moh) THEN
    RETURN rmm_error('INVALID_STATUS_TRANSITION', 'Invalid status transition');
  END IF;

  v_old := to_jsonb(v_row);
  v_entity_id := v_row.entity_id;

  -- Apply changes based on submission_type/entity_type
  IF v_row.submission_type = 'company_update' THEN
    IF v_entity_id IS NULL THEN
      RETURN rmm_error('VALIDATION_ERROR', 'Validation failed', jsonb_build_array(jsonb_build_object(
        'field', 'entity_id', 'message', 'Company entity_id is required for updates', 'code', 'MISSING_REQUIRED_FIELD'
      )));
    END IF;

    UPDATE companies
    SET name = COALESCE(rmm_sanitize_text(v_row.submission_data->>'name', 255), name),
        registration_number = COALESCE(rmm_sanitize_text(v_row.submission_data->>'registration_number', 64), registration_number),
        company_type = COALESCE((v_row.submission_data->>'company_type'), company_type),
        address = COALESCE(rmm_sanitize_text(v_row.submission_data->>'address', 1000), address),
        contact_email = COALESCE(rmm_sanitize_email(v_row.submission_data->>'contact_email'), contact_email),
        contact_phone = COALESCE(rmm_sanitize_phone(v_row.submission_data->>'contact_phone'), contact_phone),
        updated_at = now()
    WHERE id = v_entity_id;

  ELSIF v_row.submission_type = 'product_update' THEN
    IF v_entity_id IS NULL THEN
      RETURN rmm_error('VALIDATION_ERROR', 'Validation failed', jsonb_build_array(jsonb_build_object(
        'field', 'entity_id', 'message', 'Product entity_id is required for updates', 'code', 'MISSING_REQUIRED_FIELD'
      )));
    END IF;

    UPDATE products
    SET name = COALESCE(rmm_sanitize_text(v_row.submission_data->>'name', 255), name),
        description = COALESCE(rmm_sanitize_text(v_row.submission_data->>'description', 2000), description),
        is_critical_medicine = COALESCE(NULLIF(v_row.submission_data->>'is_critical_medicine','')::boolean, is_critical_medicine),
        updated_at = now()
    WHERE id = v_entity_id;

  ELSIF v_row.submission_type = 'sku_update' THEN
    IF v_entity_id IS NULL THEN
      RETURN rmm_error('VALIDATION_ERROR', 'Validation failed', jsonb_build_array(jsonb_build_object(
        'field', 'entity_id', 'message', 'SKU entity_id is required for updates', 'code', 'MISSING_REQUIRED_FIELD'
      )));
    END IF;

    UPDATE skus
    SET sku_code = COALESCE(rmm_sanitize_text(v_row.submission_data->>'sku_code', 64), sku_code),
        name = COALESCE(rmm_sanitize_text(v_row.submission_data->>'name', 255), name),
        dosage_strength = COALESCE(rmm_sanitize_text(v_row.submission_data->>'dosage_strength', 64), dosage_strength),
        dosage_form = COALESCE(rmm_sanitize_text(v_row.submission_data->>'dosage_form', 64), dosage_form),
        pack_size = COALESCE(rmm_sanitize_text(v_row.submission_data->>'pack_size', 64), pack_size),
        unit_of_measure = COALESCE(rmm_sanitize_text(v_row.submission_data->>'unit_of_measure', 32), unit_of_measure),
        atc_code_id = COALESCE(NULLIF(v_row.submission_data->>'atc_code_id','')::uuid, atc_code_id),
        updated_at = now()
    WHERE id = v_entity_id;

  ELSIF v_row.submission_type = 'product_create' THEN
    -- Company submissions: company_id must be set
    IF v_row.company_id IS NULL THEN
      RETURN rmm_error('VALIDATION_ERROR', 'Validation failed', jsonb_build_array(jsonb_build_object(
        'field', 'company_id', 'message', 'company_id is required for product_create', 'code', 'MISSING_REQUIRED_FIELD'
      )));
    END IF;

    INSERT INTO products (company_id, name, description)
    VALUES (
      v_row.company_id,
      rmm_sanitize_text(v_row.submission_data->>'name', 255),
      rmm_sanitize_text(v_row.submission_data->>'description', 2000)
    )
    RETURNING id INTO v_entity_id;

  ELSIF v_row.submission_type = 'sku_create' THEN
    -- Requires product_id in submission_data
    IF (v_row.submission_data->>'product_id') IS NULL THEN
      RETURN rmm_error('VALIDATION_ERROR', 'Validation failed', jsonb_build_array(jsonb_build_object(
        'field', 'product_id', 'message', 'product_id is required for sku_create', 'code', 'MISSING_REQUIRED_FIELD'
      )));
    END IF;

    INSERT INTO skus (
      product_id,
      sku_code,
      name,
      dosage_strength,
      dosage_form,
      pack_size,
      unit_of_measure,
      atc_code_id,
      is_moh_authorized_unregistered
    ) VALUES (
      (v_row.submission_data->>'product_id')::uuid,
      rmm_sanitize_text(v_row.submission_data->>'sku_code', 64),
      rmm_sanitize_text(v_row.submission_data->>'name', 255),
      rmm_sanitize_text(v_row.submission_data->>'dosage_strength', 64),
      rmm_sanitize_text(v_row.submission_data->>'dosage_form', 64),
      rmm_sanitize_text(v_row.submission_data->>'pack_size', 64),
      rmm_sanitize_text(v_row.submission_data->>'unit_of_measure', 32),
      NULLIF(v_row.submission_data->>'atc_code_id','')::uuid,
      COALESCE(NULLIF(v_row.submission_data->>'is_moh_authorized_unregistered','')::boolean, false)
    )
    RETURNING id INTO v_entity_id;

  ELSIF v_row.submission_type IN ('company_delete','product_delete','sku_delete') THEN
    -- Soft delete safeguards: create a pending deletion request (default 7 days)
    PERFORM 1;
    IF v_row.submission_type = 'company_delete' THEN
      IF v_entity_id IS NULL THEN
        RETURN rmm_error('VALIDATION_ERROR', 'Validation failed', jsonb_build_array(jsonb_build_object(
          'field', 'entity_id', 'message', 'Company entity_id is required for delete', 'code', 'MISSING_REQUIRED_FIELD'
        )));
      END IF;
      RETURN rmm_request_soft_delete('companies', v_entity_id, COALESCE(v_row.submission_data->>'reason', 'Registry deletion request'));
    ELSIF v_row.submission_type = 'product_delete' THEN
      IF v_entity_id IS NULL THEN
        RETURN rmm_error('VALIDATION_ERROR', 'Validation failed', jsonb_build_array(jsonb_build_object(
          'field', 'entity_id', 'message', 'Product entity_id is required for delete', 'code', 'MISSING_REQUIRED_FIELD'
        )));
      END IF;
      RETURN rmm_request_soft_delete('products', v_entity_id, COALESCE(v_row.submission_data->>'reason', 'Registry deletion request'));
    ELSE
      IF v_entity_id IS NULL THEN
        RETURN rmm_error('VALIDATION_ERROR', 'Validation failed', jsonb_build_array(jsonb_build_object(
          'field', 'entity_id', 'message', 'SKU entity_id is required for delete', 'code', 'MISSING_REQUIRED_FIELD'
        )));
      END IF;
      RETURN rmm_request_soft_delete('skus', v_entity_id, COALESCE(v_row.submission_data->>'reason', 'Registry deletion request'));
    END IF;

  ELSE
    RETURN rmm_error('BUSINESS_RULE_VIOLATION', 'Submission type not yet supported for implementation');
  END IF;

  UPDATE registry_submissions
  SET status = v_to,
      implemented_by = v_actor,
      implemented_at = now(),
      entity_id = COALESCE(v_entity_id, entity_id),
      updated_at = now()
  WHERE id = p_submission_id;

  INSERT INTO approvals (submission_id, submission_type, from_status, to_status, approver_id, approval_type, comments)
  VALUES (p_submission_id, 'registry', v_from, v_to, v_actor, 'implement', rmm_sanitize_text(p_comments, 2000));

  PERFORM shared_create_audit_log(
    v_actor,
    'implement',
    'registry_submissions',
    p_submission_id,
    v_old,
    to_jsonb((SELECT rs FROM registry_submissions rs WHERE rs.id = p_submission_id)),
    NULL,
    NULL,
    NULL
  );

  RETURN jsonb_build_object('success', true, 'data', jsonb_build_object('id', p_submission_id, 'status', v_to));
EXCEPTION
  WHEN invalid_text_representation OR invalid_parameter_value THEN
    RETURN rmm_error('VALIDATION_ERROR', 'Validation failed');
  WHEN others THEN
    RETURN rmm_error('SYSTEM_ERROR', 'An unexpected error occurred');
END;
$$;

COMMIT;

