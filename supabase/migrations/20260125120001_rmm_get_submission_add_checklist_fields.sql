-- Migration: rmm_get_submission_add_checklist_fields
-- Description: Include regulatory checklist columns in rmm_get_submission response (Phase 2 Task 2.6)
-- Date: 2026-01-25

BEGIN;

CREATE OR REPLACE FUNCTION rmm_get_submission(p_submission_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_user_record RECORD;
    v_submission jsonb;
BEGIN
    SELECT u.id, u.role, u.company_id, u.is_active
    INTO v_user_record
    FROM users u
    WHERE u.id = auth.uid();

    IF NOT FOUND THEN
        RAISE EXCEPTION 'User not found';
    END IF;

    IF NOT v_user_record.is_active THEN
        RAISE EXCEPTION 'User is not active';
    END IF;

    SELECT jsonb_build_object(
        'id', rs.id,
        'submission_type', rs.submission_type,
        'entity_type', rs.entity_type,
        'entity_id', rs.entity_id,
        'submission_data', rs.submission_data,
        'status', rs.status,
        'submitted_by', rs.submitted_by,
        'submitted_by_name', (SELECT full_name FROM users WHERE id = rs.submitted_by),
        'verified_by', rs.verified_by,
        'verified_by_name', (SELECT full_name FROM users WHERE id = rs.verified_by),
        'verified_at', rs.verified_at,
        'approved_by', rs.approved_by,
        'approved_by_name', (SELECT full_name FROM users WHERE id = rs.approved_by),
        'approved_at', rs.approved_at,
        'implemented_by', rs.implemented_by,
        'implemented_by_name', (SELECT full_name FROM users WHERE id = rs.implemented_by),
        'implemented_at', rs.implemented_at,
        'rejection_reason', rs.rejection_reason,
        'created_at', rs.created_at,
        'updated_at', rs.updated_at,
        'legal_basis_verified', rs.legal_basis_verified,
        'legal_authority_verified', rs.legal_authority_verified,
        'regulatory_requirements_met', rs.regulatory_requirements_met,
        'compliance_verification_complete', rs.compliance_verification_complete,
        'company_name', CASE 
            WHEN rs.entity_type = 'company' AND rs.entity_id IS NOT NULL THEN
                (SELECT name FROM companies WHERE id = rs.entity_id)
            WHEN rs.entity_type = 'product' AND rs.entity_id IS NOT NULL THEN
                (SELECT c.name FROM products p JOIN companies c ON p.company_id = c.id WHERE p.id = rs.entity_id)
            WHEN rs.entity_type = 'sku' AND rs.entity_id IS NOT NULL THEN
                (SELECT c.name FROM skus s JOIN products p ON s.product_id = p.id JOIN companies c ON p.company_id = c.id WHERE s.id = rs.entity_id)
            ELSE NULL
        END
    )
    INTO v_submission
    FROM registry_submissions rs
    WHERE rs.id = p_submission_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Registry submission not found';
    END IF;

    IF v_user_record.role IN ('company_admin', 'company_manager', 'company_user', 'vendor') THEN
        IF v_user_record.company_id IS NULL THEN
            RAISE EXCEPTION 'Company user must be associated with a company';
        END IF;
        IF NOT (
            (v_submission->>'entity_type' = 'company' AND (v_submission->>'entity_id')::uuid = v_user_record.company_id)
            OR (v_submission->>'entity_type' = 'product' AND EXISTS (
                SELECT 1 FROM products p WHERE p.id = (v_submission->>'entity_id')::uuid AND p.company_id = v_user_record.company_id
            ))
            OR (v_submission->>'entity_type' = 'sku' AND EXISTS (
                SELECT 1 FROM skus s 
                JOIN products p ON s.product_id = p.id 
                WHERE s.id = (v_submission->>'entity_id')::uuid AND p.company_id = v_user_record.company_id
            ))
            OR (v_submission->>'submitted_by')::uuid IN (
                SELECT id FROM users WHERE company_id = v_user_record.company_id
            )
        ) THEN
            RAISE EXCEPTION 'Insufficient permissions: You can only view your own company''s submissions';
        END IF;
    END IF;

    RETURN v_submission;
END;
$$;

COMMIT;
