-- Migration: create_rmm_registry_submission_workflow_functions
-- Description: Create RMM registry submission workflow RPC functions (Tasks 1.1.2.6-1.1.2.15)
-- Date: 2026-01-23
-- Tasks: 1.1.2.6, 1.1.2.7, 1.1.2.8, 1.1.2.9, 1.1.2.10, 1.1.2.11, 1.1.2.12, 1.1.2.13, 1.1.2.14, 1.1.2.15
-- Author: Sami (Implementation Compliance Specialist)
-- Dependencies: Task 1.1.1.2 (registry_submissions, approvals, approval_history tables must exist), Task 1.1.1.3 (RMM tables must exist)

BEGIN;

-- ============================================================================
-- Add tier2_peer_reviewed to registry_submissions status enum
-- This is required for Task 1.1.2.12 (Peer Review)
-- ============================================================================

-- Drop existing constraint
ALTER TABLE registry_submissions DROP CONSTRAINT IF EXISTS registry_submissions_status_check;

-- Add constraint with tier2_peer_reviewed status
ALTER TABLE registry_submissions ADD CONSTRAINT registry_submissions_status_check
    CHECK (status IN (
        'draft', 'submitted', 'tier2_verified', 'tier2_peer_reviewed', 
        'tier1_approved', 'tier2_implemented', 'completed', 'rejected'
    ));

-- ============================================================================
-- Helper Function: Create approval and approval_history entry
-- Purpose: Centralized function to create approval records and history entries
-- ============================================================================

CREATE OR REPLACE FUNCTION create_approval_record(
    p_submission_id uuid,
    p_submission_type text,
    p_from_status text,
    p_to_status text,
    p_approver_id uuid,
    p_approver_role text,
    p_comments text DEFAULT NULL,
    p_metadata jsonb DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_approval_id uuid;
BEGIN
    -- Create approval record
    INSERT INTO approvals (
        submission_id,
        submission_type,
        from_status,
        to_status,
        approver_id,
        comments,
        metadata
    ) VALUES (
        p_submission_id,
        p_submission_type,
        p_from_status,
        p_to_status,
        p_approver_id,
        p_comments,
        p_metadata
    )
    RETURNING id INTO v_approval_id;

    -- Create approval_history entry
    INSERT INTO approval_history (
        approval_id,
        submission_id,
        submission_type,
        workflow_stage,
        action_taken,
        approver_id,
        approver_role,
        comments,
        metadata
    ) VALUES (
        v_approval_id,
        p_submission_id,
        p_submission_type,
        p_to_status,
        CASE p_to_status
            WHEN 'submitted' THEN 'submitted'
            WHEN 'tier2_verified' THEN 'verified'
            WHEN 'tier2_peer_reviewed' THEN 'peer_reviewed'
            WHEN 'tier1_approved' THEN 'approved'
            WHEN 'tier2_implemented' THEN 'implemented'
            WHEN 'completed' THEN 'completed'
            WHEN 'rejected' THEN 'rejected'
            ELSE 'unknown'
        END,
        p_approver_id,
        p_approver_role,
        p_comments,
        p_metadata
    );

    RETURN v_approval_id;
END;
$$;

-- ============================================================================
-- Task 1.1.2.6: rmm_submit_registry_update (Enhanced)
-- Purpose: Create and submit registry update (enhanced with approval_history)
-- State Transition: draft → submitted
-- Access Control: Company users can submit for their own entities, MOH Tier 1 can submit for any
-- Note: This function already exists but is enhanced to create approval_history
-- ============================================================================

-- The function rmm_submit_registry_update already exists in 20260123230034_create_rmm_company_crud_rpc_functions.sql
-- We'll enhance it here to create approval_history entries

CREATE OR REPLACE FUNCTION rmm_submit_registry_update(
    submitter_user_id uuid,
    submission_type text,
    entity_type text,
    entity_id uuid,
    submission_data jsonb
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_user_record RECORD;
    v_submission_id uuid;
    v_submission jsonb;
    v_approval_id uuid;
BEGIN
    -- Get user record and verify user exists
    SELECT u.id, u.role, u.company_id, u.is_active
    INTO v_user_record
    FROM users u
    WHERE u.id = submitter_user_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'User not found';
    END IF;

    IF NOT v_user_record.is_active THEN
        RAISE EXCEPTION 'User is not active';
    END IF;

    -- Input validation
    IF submission_type NOT IN (
        'company_create', 'company_update', 'product_create', 'product_update',
        'sku_create', 'sku_update', 'company_delete', 'product_delete', 'sku_delete'
    ) THEN
        RAISE EXCEPTION 'Invalid submission type: %', submission_type;
    END IF;

    IF entity_type NOT IN ('company', 'product', 'sku') THEN
        RAISE EXCEPTION 'Invalid entity type: %', entity_type;
    END IF;

    -- For updates and deletes, entity_id is required
    IF submission_type IN ('company_update', 'product_update', 'sku_update', 'company_delete', 'product_delete', 'sku_delete') THEN
        IF entity_id IS NULL THEN
            RAISE EXCEPTION 'Entity ID is required for update/delete submissions';
        END IF;
    END IF;

    -- Access control: Company users can only submit for their own company
    -- MOH Tier 1 and System Admin can submit for any entity
    IF v_user_record.role IN ('company_admin', 'company_manager', 'company_user', 'vendor') THEN
        IF entity_type = 'company' AND entity_id IS NOT NULL THEN
            -- For company updates/deletes, verify company belongs to user
            IF NOT EXISTS (
                SELECT 1 FROM companies
                WHERE id = entity_id
                AND id = v_user_record.company_id
            ) THEN
                RAISE EXCEPTION 'Insufficient permissions: You can only submit updates for your own company';
            END IF;
        ELSIF entity_type IN ('product', 'sku') THEN
            -- For product/SKU submissions, verify they belong to user's company
            IF entity_id IS NOT NULL THEN
                IF entity_type = 'product' THEN
                    IF NOT EXISTS (
                        SELECT 1 FROM products p
                        WHERE p.id = entity_id
                        AND p.company_id = v_user_record.company_id
                    ) THEN
                        RAISE EXCEPTION 'Insufficient permissions: You can only submit updates for your own company''s products';
                    END IF;
                ELSIF entity_type = 'sku' THEN
                    IF NOT EXISTS (
                        SELECT 1 FROM skus s
                        JOIN products p ON s.product_id = p.id
                        WHERE s.id = entity_id
                        AND p.company_id = v_user_record.company_id
                    ) THEN
                        RAISE EXCEPTION 'Insufficient permissions: You can only submit updates for your own company''s SKUs';
                    END IF;
                END IF;
            END IF;
        END IF;
    ELSIF v_user_record.role NOT IN ('tier1', 'system_admin') THEN
        RAISE EXCEPTION 'Insufficient permissions: Only Company users, MOH Tier 1, or System Admin can submit registry updates';
    END IF;

    -- Validate submission_data is not empty
    IF submission_data IS NULL OR submission_data = '{}'::jsonb THEN
        RAISE EXCEPTION 'Submission data cannot be empty';
    END IF;

    -- Create registry submission
    INSERT INTO registry_submissions (
        submission_type,
        entity_type,
        entity_id,
        submission_data,
        status,
        submitted_by
    ) VALUES (
        submission_type,
        entity_type,
        entity_id,
        submission_data,
        'submitted', -- Status: draft → submitted
        submitter_user_id
    )
    RETURNING id INTO v_submission_id;

    -- Create approval record and approval_history entry
    SELECT create_approval_record(
        v_submission_id,
        submission_type,
        'draft',
        'submitted',
        submitter_user_id,
        v_user_record.role,
        'Submission created and submitted',
        jsonb_build_object('submitted_at', now())
    ) INTO v_approval_id;

    -- Get created submission
    SELECT jsonb_build_object(
        'id', rs.id,
        'submission_type', rs.submission_type,
        'entity_type', rs.entity_type,
        'entity_id', rs.entity_id,
        'submission_data', rs.submission_data,
        'status', rs.status,
        'submitted_by', rs.submitted_by,
        'created_at', rs.created_at,
        'updated_at', rs.updated_at
    )
    INTO v_submission
    FROM registry_submissions rs
    WHERE rs.id = v_submission_id;

    RETURN v_submission;
END;
$$;

-- ============================================================================
-- Task 1.1.2.7: rmm_verify_registry_submission
-- Purpose: Tier 2 Officer verifies registry submission
-- State Transition: submitted → tier2_verified
-- Access Control: Only MOH Tier 2 Officer
-- ============================================================================

CREATE OR REPLACE FUNCTION rmm_verify_registry_submission(
    verifier_user_id uuid,
    submission_id uuid,
    comments text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_user_record RECORD;
    v_submission_record RECORD;
    v_approval_id uuid;
    v_submission jsonb;
BEGIN
    -- Get user record and verify user exists
    SELECT u.id, u.role, u.is_active
    INTO v_user_record
    FROM users u
    WHERE u.id = verifier_user_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'User not found';
    END IF;

    IF NOT v_user_record.is_active THEN
        RAISE EXCEPTION 'User is not active';
    END IF;

    -- Access control: Only MOH Tier 2 Officer can verify
    IF v_user_record.role != 'tier2_officer' THEN
        RAISE EXCEPTION 'Insufficient permissions: Only MOH Tier 2 Officer can verify registry submissions';
    END IF;

    -- Get submission record
    SELECT rs.* INTO v_submission_record
    FROM registry_submissions rs
    WHERE rs.id = submission_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Registry submission not found';
    END IF;

    -- Validate submission is in 'submitted' status
    IF v_submission_record.status != 'submitted' THEN
        RAISE EXCEPTION 'Submission must be in ''submitted'' status to be verified. Current status: %', v_submission_record.status;
    END IF;

    -- Update submission status and verification fields
    UPDATE registry_submissions
    SET
        status = 'tier2_verified',
        verified_by = verifier_user_id,
        verified_at = now(),
        updated_at = now()
    WHERE id = submission_id;

    -- Create approval record and approval_history entry
    SELECT create_approval_record(
        submission_id,
        v_submission_record.submission_type,
        'submitted',
        'tier2_verified',
        verifier_user_id,
        v_user_record.role,
        comments,
        jsonb_build_object('verified_at', now())
    ) INTO v_approval_id;

    -- Get updated submission
    SELECT jsonb_build_object(
        'id', rs.id,
        'submission_type', rs.submission_type,
        'entity_type', rs.entity_type,
        'entity_id', rs.entity_id,
        'submission_data', rs.submission_data,
        'status', rs.status,
        'submitted_by', rs.submitted_by,
        'verified_by', rs.verified_by,
        'verified_at', rs.verified_at,
        'created_at', rs.created_at,
        'updated_at', rs.updated_at
    )
    INTO v_submission
    FROM registry_submissions rs
    WHERE rs.id = submission_id;

    RETURN v_submission;
END;
$$;

-- ============================================================================
-- Task 1.1.2.8: rmm_approve_registry_submission
-- Purpose: Tier 1 approves registry submission
-- State Transition: tier2_verified → tier1_approved (or tier2_peer_reviewed → tier1_approved)
-- Access Control: Only MOH Tier 1
-- ============================================================================

CREATE OR REPLACE FUNCTION rmm_approve_registry_submission(
    approver_user_id uuid,
    submission_id uuid,
    comments text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_user_record RECORD;
    v_submission_record RECORD;
    v_approval_id uuid;
    v_submission jsonb;
BEGIN
    -- Get user record and verify user exists
    SELECT u.id, u.role, u.is_active
    INTO v_user_record
    FROM users u
    WHERE u.id = approver_user_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'User not found';
    END IF;

    IF NOT v_user_record.is_active THEN
        RAISE EXCEPTION 'User is not active';
    END IF;

    -- Access control: Only MOH Tier 1 can approve
    IF v_user_record.role != 'tier1' THEN
        RAISE EXCEPTION 'Insufficient permissions: Only MOH Tier 1 can approve registry submissions';
    END IF;

    -- Get submission record
    SELECT rs.* INTO v_submission_record
    FROM registry_submissions rs
    WHERE rs.id = submission_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Registry submission not found';
    END IF;

    -- Validate submission is in 'tier2_verified' or 'tier2_peer_reviewed' status
    IF v_submission_record.status NOT IN ('tier2_verified', 'tier2_peer_reviewed') THEN
        RAISE EXCEPTION 'Submission must be in ''tier2_verified'' or ''tier2_peer_reviewed'' status to be approved. Current status: %', v_submission_record.status;
    END IF;

    -- Update submission status and approval fields
    UPDATE registry_submissions
    SET
        status = 'tier1_approved',
        approved_by = approver_user_id,
        approved_at = now(),
        updated_at = now()
    WHERE id = submission_id;

    -- Create approval record and approval_history entry
    SELECT create_approval_record(
        submission_id,
        v_submission_record.submission_type,
        v_submission_record.status,
        'tier1_approved',
        approver_user_id,
        v_user_record.role,
        comments,
        jsonb_build_object('approved_at', now())
    ) INTO v_approval_id;

    -- Get updated submission
    SELECT jsonb_build_object(
        'id', rs.id,
        'submission_type', rs.submission_type,
        'entity_type', rs.entity_type,
        'entity_id', rs.entity_id,
        'submission_data', rs.submission_data,
        'status', rs.status,
        'submitted_by', rs.submitted_by,
        'verified_by', rs.verified_by,
        'verified_at', rs.verified_at,
        'approved_by', rs.approved_by,
        'approved_at', rs.approved_at,
        'created_at', rs.created_at,
        'updated_at', rs.updated_at
    )
    INTO v_submission
    FROM registry_submissions rs
    WHERE rs.id = submission_id;

    RETURN v_submission;
END;
$$;

-- ============================================================================
-- Task 1.1.2.9: rmm_implement_registry_update
-- Purpose: Tier 2 Registrar implements registry update (applies changes to target tables)
-- State Transition: tier1_approved → tier2_implemented
-- Access Control: Only MOH Tier 2 Registrar
-- Action: Applies changes to target tables (companies/products/skus)
-- ============================================================================

CREATE OR REPLACE FUNCTION rmm_implement_registry_update(
    implementer_user_id uuid,
    submission_id uuid
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_user_record RECORD;
    v_submission_record RECORD;
    v_approval_id uuid;
    v_submission jsonb;
    v_entity_id uuid;
    v_submission_data jsonb;
BEGIN
    -- Get user record and verify user exists
    SELECT u.id, u.role, u.is_active
    INTO v_user_record
    FROM users u
    WHERE u.id = implementer_user_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'User not found';
    END IF;

    IF NOT v_user_record.is_active THEN
        RAISE EXCEPTION 'User is not active';
    END IF;

    -- Access control: Only MOH Tier 2 Registrar can implement
    IF v_user_record.role != 'tier2_registrar' THEN
        RAISE EXCEPTION 'Insufficient permissions: Only MOH Tier 2 Registrar can implement registry updates';
    END IF;

    -- Get submission record
    SELECT rs.* INTO v_submission_record
    FROM registry_submissions rs
    WHERE rs.id = submission_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Registry submission not found';
    END IF;

    -- Validate submission is in 'tier1_approved' status
    IF v_submission_record.status != 'tier1_approved' THEN
        RAISE EXCEPTION 'Submission must be in ''tier1_approved'' status to be implemented. Current status: %', v_submission_record.status;
    END IF;

    v_entity_id := v_submission_record.entity_id;
    v_submission_data := v_submission_record.submission_data;

    -- Apply changes based on submission_type and entity_type
    IF v_submission_record.submission_type = 'company_create' THEN
        -- Create company from submission_data
        INSERT INTO companies (
            name, registration_number, company_type, address, contact_email, contact_phone, is_active
        )
        SELECT
            submission_data->>'name',
            submission_data->>'registration_number',
            submission_data->>'company_type',
            submission_data->>'address',
            submission_data->>'contact_email',
            submission_data->>'contact_phone',
            COALESCE((submission_data->>'is_active')::boolean, true)
        FROM registry_submissions
        WHERE id = submission_id;

    ELSIF v_submission_record.submission_type = 'company_update' THEN
        -- Update company from submission_data
        UPDATE companies
        SET
            name = COALESCE((v_submission_data->>'name')::text, companies.name),
            registration_number = COALESCE((v_submission_data->>'registration_number')::text, companies.registration_number),
            company_type = COALESCE((v_submission_data->>'company_type')::text, companies.company_type),
            address = COALESCE((v_submission_data->>'address')::text, companies.address),
            contact_email = COALESCE((v_submission_data->>'contact_email')::text, companies.contact_email),
            contact_phone = COALESCE((v_submission_data->>'contact_phone')::text, companies.contact_phone),
            is_active = COALESCE((v_submission_data->>'is_active')::boolean, companies.is_active),
            updated_at = now()
        WHERE id = v_entity_id;

    ELSIF v_submission_record.submission_type = 'product_create' THEN
        -- Create product from submission_data
        INSERT INTO products (
            company_id, name, description, is_critical_medicine, is_active
        )
        SELECT
            (v_submission_data->>'company_id')::uuid,
            v_submission_data->>'name',
            v_submission_data->>'description',
            COALESCE((v_submission_data->>'is_critical_medicine')::boolean, false),
            COALESCE((v_submission_data->>'is_active')::boolean, true)
        FROM registry_submissions
        WHERE id = submission_id;

    ELSIF v_submission_record.submission_type = 'product_update' THEN
        -- Update product from submission_data
        UPDATE products
        SET
            name = COALESCE((v_submission_data->>'name')::text, products.name),
            description = COALESCE((v_submission_data->>'description')::text, products.description),
            is_critical_medicine = COALESCE((v_submission_data->>'is_critical_medicine')::boolean, products.is_critical_medicine),
            is_active = COALESCE((v_submission_data->>'is_active')::boolean, products.is_active),
            updated_at = now()
        WHERE id = v_entity_id;

    ELSIF v_submission_record.submission_type = 'sku_create' THEN
        -- Create SKU from submission_data
        INSERT INTO skus (
            product_id, sku_code, name, dosage_strength, dosage_form, pack_size, unit_of_measure,
            atc_code_id, is_moh_authorized_unregistered, is_active
        )
        SELECT
            (v_submission_data->>'product_id')::uuid,
            v_submission_data->>'sku_code',
            v_submission_data->>'name',
            v_submission_data->>'dosage_strength',
            v_submission_data->>'dosage_form',
            v_submission_data->>'pack_size',
            v_submission_data->>'unit_of_measure',
            NULLIF((v_submission_data->>'atc_code_id')::text, '')::uuid,
            COALESCE((v_submission_data->>'is_moh_authorized_unregistered')::boolean, false),
            COALESCE((v_submission_data->>'is_active')::boolean, true)
        FROM registry_submissions
        WHERE id = submission_id;

    ELSIF v_submission_record.submission_type = 'sku_update' THEN
        -- Update SKU from submission_data
        UPDATE skus
        SET
            sku_code = COALESCE((v_submission_data->>'sku_code')::text, skus.sku_code),
            name = COALESCE((v_submission_data->>'name')::text, skus.name),
            dosage_strength = COALESCE((v_submission_data->>'dosage_strength')::text, skus.dosage_strength),
            dosage_form = COALESCE((v_submission_data->>'dosage_form')::text, skus.dosage_form),
            pack_size = COALESCE((v_submission_data->>'pack_size')::text, skus.pack_size),
            unit_of_measure = COALESCE((v_submission_data->>'unit_of_measure')::text, skus.unit_of_measure),
            atc_code_id = COALESCE(NULLIF((v_submission_data->>'atc_code_id')::text, '')::uuid, skus.atc_code_id),
            is_moh_authorized_unregistered = COALESCE((v_submission_data->>'is_moh_authorized_unregistered')::boolean, skus.is_moh_authorized_unregistered),
            is_active = COALESCE((v_submission_data->>'is_active')::boolean, skus.is_active),
            updated_at = now()
        WHERE id = v_entity_id;

    ELSIF v_submission_record.submission_type IN ('company_delete', 'product_delete', 'sku_delete') THEN
        -- Soft delete: Set is_active = false
        IF v_submission_record.entity_type = 'company' THEN
            UPDATE companies
            SET is_active = false, updated_at = now()
            WHERE id = v_entity_id;
        ELSIF v_submission_record.entity_type = 'product' THEN
            UPDATE products
            SET is_active = false, updated_at = now()
            WHERE id = v_entity_id;
        ELSIF v_submission_record.entity_type = 'sku' THEN
            UPDATE skus
            SET is_active = false, updated_at = now()
            WHERE id = v_entity_id;
        END IF;
    END IF;

    -- Update submission status and implementation fields
    UPDATE registry_submissions
    SET
        status = 'tier2_implemented',
        implemented_by = implementer_user_id,
        implemented_at = now(),
        updated_at = now()
    WHERE id = submission_id;

    -- Create approval record and approval_history entry
    SELECT create_approval_record(
        submission_id,
        v_submission_record.submission_type,
        'tier1_approved',
        'tier2_implemented',
        implementer_user_id,
        v_user_record.role,
        'Registry update implemented',
        jsonb_build_object('implemented_at', now(), 'entity_id', v_entity_id)
    ) INTO v_approval_id;

    -- Get updated submission
    SELECT jsonb_build_object(
        'id', rs.id,
        'submission_type', rs.submission_type,
        'entity_type', rs.entity_type,
        'entity_id', rs.entity_id,
        'submission_data', rs.submission_data,
        'status', rs.status,
        'submitted_by', rs.submitted_by,
        'verified_by', rs.verified_by,
        'verified_at', rs.verified_at,
        'approved_by', rs.approved_by,
        'approved_at', rs.approved_at,
        'implemented_by', rs.implemented_by,
        'implemented_at', rs.implemented_at,
        'created_at', rs.created_at,
        'updated_at', rs.updated_at
    )
    INTO v_submission
    FROM registry_submissions rs
    WHERE rs.id = submission_id;

    RETURN v_submission;
END;
$$;

-- ============================================================================
-- Task 1.1.2.10: rmm_complete_registry_submission
-- Purpose: Complete registry submission workflow
-- State Transition: tier2_implemented → completed
-- Access Control: System or automatic (can be called by System Admin or triggered automatically)
-- ============================================================================

CREATE OR REPLACE FUNCTION rmm_complete_registry_submission(
    completer_user_id uuid,
    submission_id uuid
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_user_record RECORD;
    v_submission_record RECORD;
    v_approval_id uuid;
    v_submission jsonb;
BEGIN
    -- Get user record and verify user exists (if provided, otherwise system action)
    IF completer_user_id IS NOT NULL THEN
        SELECT u.id, u.role, u.is_active
        INTO v_user_record
        FROM users u
        WHERE u.id = completer_user_id;

        IF NOT FOUND THEN
            RAISE EXCEPTION 'User not found';
        END IF;

        IF NOT v_user_record.is_active THEN
            RAISE EXCEPTION 'User is not active';
        END IF;

        -- Access control: Only System Admin can manually complete (or system)
        IF v_user_record.role != 'system_admin' THEN
            RAISE EXCEPTION 'Insufficient permissions: Only System Admin can manually complete registry submissions';
        END IF;
    ELSE
        -- System action: Create a system user record for approval history
        v_user_record.role := 'system';
    END IF;

    -- Get submission record
    SELECT rs.* INTO v_submission_record
    FROM registry_submissions rs
    WHERE rs.id = submission_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Registry submission not found';
    END IF;

    -- Validate submission is in 'tier2_implemented' status
    IF v_submission_record.status != 'tier2_implemented' THEN
        RAISE EXCEPTION 'Submission must be in ''tier2_implemented'' status to be completed. Current status: %', v_submission_record.status;
    END IF;

    -- Update submission status
    UPDATE registry_submissions
    SET
        status = 'completed',
        updated_at = now()
    WHERE id = submission_id;

    -- Create approval record and approval_history entry
    SELECT create_approval_record(
        submission_id,
        v_submission_record.submission_type,
        'tier2_implemented',
        'completed',
        COALESCE(completer_user_id, '00000000-0000-0000-0000-000000000000'::uuid), -- System UUID if automatic
        COALESCE(v_user_record.role, 'system'),
        'Registry submission workflow completed',
        jsonb_build_object('completed_at', now())
    ) INTO v_approval_id;

    -- Get updated submission
    SELECT jsonb_build_object(
        'id', rs.id,
        'submission_type', rs.submission_type,
        'entity_type', rs.entity_type,
        'entity_id', rs.entity_id,
        'submission_data', rs.submission_data,
        'status', rs.status,
        'submitted_by', rs.submitted_by,
        'verified_by', rs.verified_by,
        'verified_at', rs.verified_at,
        'approved_by', rs.approved_by,
        'approved_at', rs.approved_at,
        'implemented_by', rs.implemented_by,
        'implemented_at', rs.implemented_at,
        'created_at', rs.created_at,
        'updated_at', rs.updated_at
    )
    INTO v_submission
    FROM registry_submissions rs
    WHERE rs.id = submission_id;

    RETURN v_submission;
END;
$$;

-- ============================================================================
-- Task 1.1.2.11: rmm_reject_registry_submission
-- Purpose: Reject registry submission at any stage
-- State Transition: Any state → rejected
-- Access Control: MOH Tier 1 or Tier 2 (depending on current state)
-- Requires: Rejection reason
-- ============================================================================

CREATE OR REPLACE FUNCTION rmm_reject_registry_submission(
    rejector_user_id uuid,
    submission_id uuid,
    rejection_reason text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_user_record RECORD;
    v_submission_record RECORD;
    v_approval_id uuid;
    v_submission jsonb;
    v_previous_status text;
BEGIN
    -- Get user record and verify user exists
    SELECT u.id, u.role, u.is_active
    INTO v_user_record
    FROM users u
    WHERE u.id = rejector_user_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'User not found';
    END IF;

    IF NOT v_user_record.is_active THEN
        RAISE EXCEPTION 'User is not active';
    END IF;

    -- Get submission record
    SELECT rs.* INTO v_submission_record
    FROM registry_submissions rs
    WHERE rs.id = submission_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Registry submission not found';
    END IF;

    -- Validate submission is not already completed or rejected
    IF v_submission_record.status IN ('completed', 'rejected') THEN
        RAISE EXCEPTION 'Cannot reject submission in status: %', v_submission_record.status;
    END IF;

    -- Access control: MOH Tier 1 can reject at any stage, Tier 2 Officer can reject before Tier 1 approval
    IF v_user_record.role = 'tier1' THEN
        -- Tier 1 can reject at any stage
        NULL; -- Allow
    ELSIF v_user_record.role = 'tier2_officer' THEN
        -- Tier 2 Officer can only reject before Tier 1 approval
        IF v_submission_record.status IN ('tier1_approved', 'tier2_implemented') THEN
            RAISE EXCEPTION 'Insufficient permissions: Tier 2 Officer cannot reject submissions after Tier 1 approval';
        END IF;
    ELSIF v_user_record.role = 'system_admin' THEN
        -- System Admin can reject at any stage
        NULL; -- Allow
    ELSE
        RAISE EXCEPTION 'Insufficient permissions: Only MOH Tier 1, Tier 2 Officer, or System Admin can reject submissions';
    END IF;

    -- Validate rejection reason is provided
    IF rejection_reason IS NULL OR trim(rejection_reason) = '' THEN
        RAISE EXCEPTION 'Rejection reason is required';
    END IF;

    v_previous_status := v_submission_record.status;

    -- Update submission status and rejection fields
    UPDATE registry_submissions
    SET
        status = 'rejected',
        rejection_reason = trim(rejection_reason),
        updated_at = now()
    WHERE id = submission_id;

    -- Create approval record and approval_history entry
    SELECT create_approval_record(
        submission_id,
        v_submission_record.submission_type,
        v_previous_status,
        'rejected',
        rejector_user_id,
        v_user_record.role,
        rejection_reason,
        jsonb_build_object('rejected_at', now(), 'previous_status', v_previous_status)
    ) INTO v_approval_id;

    -- Get updated submission
    SELECT jsonb_build_object(
        'id', rs.id,
        'submission_type', rs.submission_type,
        'entity_type', rs.entity_type,
        'entity_id', rs.entity_id,
        'submission_data', rs.submission_data,
        'status', rs.status,
        'submitted_by', rs.submitted_by,
        'verified_by', rs.verified_by,
        'verified_at', rs.verified_at,
        'approved_by', rs.approved_by,
        'approved_at', rs.approved_at,
        'rejection_reason', rs.rejection_reason,
        'created_at', rs.created_at,
        'updated_at', rs.updated_at
    )
    INTO v_submission
    FROM registry_submissions rs
    WHERE rs.id = submission_id;

    RETURN v_submission;
END;
$$;

-- ============================================================================
-- Task 1.1.2.12: rmm_peer_review_registry_submission
-- Purpose: MOH Tier 2 Officer peer review (additional verification step)
-- State Transition: tier2_verified → tier2_peer_reviewed
-- Access Control: MOH Tier 2 Officer (peer review)
-- Note: This requires adding 'tier2_peer_reviewed' to status enum if not already present
-- ============================================================================

-- First, check if tier2_peer_reviewed status exists, if not, we'll need to add it
-- For now, we'll assume it's in the enum (it should be added if needed)

CREATE OR REPLACE FUNCTION rmm_peer_review_registry_submission(
    reviewer_user_id uuid,
    submission_id uuid,
    comments text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_user_record RECORD;
    v_submission_record RECORD;
    v_approval_id uuid;
    v_submission jsonb;
BEGIN
    -- Get user record and verify user exists
    SELECT u.id, u.role, u.is_active
    INTO v_user_record
    FROM users u
    WHERE u.id = reviewer_user_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'User not found';
    END IF;

    IF NOT v_user_record.is_active THEN
        RAISE EXCEPTION 'User is not active';
    END IF;

    -- Access control: Only MOH Tier 2 Officer can perform peer review
    IF v_user_record.role != 'tier2_officer' THEN
        RAISE EXCEPTION 'Insufficient permissions: Only MOH Tier 2 Officer can perform peer review';
    END IF;

    -- Get submission record
    SELECT rs.* INTO v_submission_record
    FROM registry_submissions rs
    WHERE rs.id = submission_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Registry submission not found';
    END IF;

    -- Validate submission is in 'tier2_verified' status
    IF v_submission_record.status != 'tier2_verified' THEN
        RAISE EXCEPTION 'Submission must be in ''tier2_verified'' status for peer review. Current status: %', v_submission_record.status;
    END IF;

    -- Update submission status to tier2_peer_reviewed
    UPDATE registry_submissions
    SET
        status = 'tier2_peer_reviewed',
        updated_at = now()
    WHERE id = submission_id;

    -- Create approval record and approval_history entry
    SELECT create_approval_record(
        submission_id,
        v_submission_record.submission_type,
        'tier2_verified',
        'tier2_peer_reviewed',
        reviewer_user_id,
        v_user_record.role,
        comments,
        jsonb_build_object('peer_reviewed_at', now())
    ) INTO v_approval_id;

    -- Get updated submission
    SELECT jsonb_build_object(
        'id', rs.id,
        'submission_type', rs.submission_type,
        'entity_type', rs.entity_type,
        'entity_id', rs.entity_id,
        'submission_data', rs.submission_data,
        'status', rs.status,
        'submitted_by', rs.submitted_by,
        'verified_by', rs.verified_by,
        'verified_at', rs.verified_at,
        'created_at', rs.created_at,
        'updated_at', rs.updated_at
    )
    INTO v_submission
    FROM registry_submissions rs
    WHERE rs.id = submission_id;

    RETURN v_submission;
END;
$$;

-- ============================================================================
-- Task 1.1.2.13: Cascade Deactivation Logic
-- Purpose: When company is deactivated, cascade to products and SKUs
-- Access Control: MOH Tier 1 and System Admin
-- Creates: Registry submissions for cascaded deactivations
-- ============================================================================

CREATE OR REPLACE FUNCTION rmm_cascade_deactivate_company(
    deactivator_user_id uuid,
    company_id uuid,
    deactivation_reason text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_user_record RECORD;
    v_company_record RECORD;
    v_product RECORD;
    v_sku RECORD;
    v_submission_id uuid;
    v_product_count integer := 0;
    v_sku_count integer := 0;
BEGIN
    -- Get user record and verify user exists
    SELECT u.id, u.role, u.is_active
    INTO v_user_record
    FROM users u
    WHERE u.id = deactivator_user_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'User not found';
    END IF;

    IF NOT v_user_record.is_active THEN
        RAISE EXCEPTION 'User is not active';
    END IF;

    -- Access control: Only MOH Tier 1 and System Admin can cascade deactivate
    IF v_user_record.role NOT IN ('tier1', 'system_admin') THEN
        RAISE EXCEPTION 'Insufficient permissions: Only MOH Tier 1 or System Admin can cascade deactivate companies';
    END IF;

    -- Verify company exists
    SELECT * INTO v_company_record
    FROM companies
    WHERE id = company_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Company not found';
    END IF;

    -- Check if company is already deactivated
    IF NOT v_company_record.is_active THEN
        RAISE EXCEPTION 'Company is already deactivated';
    END IF;

    -- Deactivate company
    UPDATE companies
    SET
        is_active = false,
        suspended_at = now(),
        suspended_by = deactivator_user_id,
        suspended_reason = COALESCE(deactivation_reason, 'Cascade deactivation'),
        updated_at = now()
    WHERE id = company_id;

    -- Cascade to products: Create registry submissions for product deactivations
    FOR v_product IN
        SELECT id, name FROM products WHERE company_id = company_id AND is_active = true
    LOOP
        INSERT INTO registry_submissions (
            submission_type,
            entity_type,
            entity_id,
            submission_data,
            status,
            submitted_by
        ) VALUES (
            'product_delete',
            'product',
            v_product.id,
            jsonb_build_object(
                'product_id', v_product.id,
                'product_name', v_product.name,
                'cascade_deactivation', true,
                'parent_company_id', company_id,
                'deactivation_reason', COALESCE(deactivation_reason, 'Cascade deactivation from company')
            ),
            'submitted',
            deactivator_user_id
        )
        RETURNING id INTO v_submission_id;

        -- Create approval record
        PERFORM create_approval_record(
            v_submission_id,
            'product_delete',
            'draft',
            'submitted',
            deactivator_user_id,
            v_user_record.role,
            'Cascade deactivation from company',
            jsonb_build_object('cascade_deactivation', true, 'parent_company_id', company_id)
        );

        v_product_count := v_product_count + 1;
    END LOOP;

    -- Cascade to SKUs: Create registry submissions for SKU deactivations
    FOR v_sku IN
        SELECT s.id, s.name, s.sku_code
        FROM skus s
        JOIN products p ON s.product_id = p.id
        WHERE p.company_id = company_id AND s.is_active = true
    LOOP
        INSERT INTO registry_submissions (
            submission_type,
            entity_type,
            entity_id,
            submission_data,
            status,
            submitted_by
        ) VALUES (
            'sku_delete',
            'sku',
            v_sku.id,
            jsonb_build_object(
                'sku_id', v_sku.id,
                'sku_name', v_sku.name,
                'sku_code', v_sku.sku_code,
                'cascade_deactivation', true,
                'parent_company_id', company_id,
                'deactivation_reason', COALESCE(deactivation_reason, 'Cascade deactivation from company')
            ),
            'submitted',
            deactivator_user_id
        )
        RETURNING id INTO v_submission_id;

        -- Create approval record
        PERFORM create_approval_record(
            v_submission_id,
            'sku_delete',
            'draft',
            'submitted',
            deactivator_user_id,
            v_user_record.role,
            'Cascade deactivation from company',
            jsonb_build_object('cascade_deactivation', true, 'parent_company_id', company_id)
        );

        v_sku_count := v_sku_count + 1;
    END LOOP;

    -- Return cascade results
    RETURN jsonb_build_object(
        'company_id', company_id,
        'company_name', v_company_record.name,
        'deactivated', true,
        'cascade_results', jsonb_build_object(
            'products_deactivated', v_product_count,
            'skus_deactivated', v_sku_count,
            'total_submissions_created', v_product_count + v_sku_count
        ),
        'deactivation_reason', COALESCE(deactivation_reason, 'Cascade deactivation')
    );
END;
$$;

-- ============================================================================
-- Task 1.1.2.14: Soft Delete Safeguards
-- Purpose: Prevent accidental hard deletes, enforce soft delete pattern
-- Access Control: Based on entity type and role
-- Validation: Check for dependencies before allowing deactivation
-- ============================================================================

CREATE OR REPLACE FUNCTION rmm_safe_deactivate_entity(
    deactivator_user_id uuid,
    entity_type text,
    entity_id uuid,
    deactivation_reason text,
    check_dependencies boolean DEFAULT true
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_user_record RECORD;
    v_dependency_check jsonb;
    v_result jsonb;
BEGIN
    -- Get user record and verify user exists
    SELECT u.id, u.role, u.company_id, u.is_active
    INTO v_user_record
    FROM users u
    WHERE u.id = deactivator_user_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'User not found';
    END IF;

    IF NOT v_user_record.is_active THEN
        RAISE EXCEPTION 'User is not active';
    END IF;

    -- Validate deactivation reason is provided
    IF deactivation_reason IS NULL OR trim(deactivation_reason) = '' THEN
        RAISE EXCEPTION 'Deactivation reason is required';
    END IF;

    -- Check dependencies if requested
    IF check_dependencies THEN
        IF entity_type = 'company' THEN
            -- Check if company has active products
            SELECT jsonb_build_object(
                'has_active_products', EXISTS (SELECT 1 FROM products WHERE company_id = entity_id AND is_active = true),
                'active_products_count', (SELECT COUNT(*) FROM products WHERE company_id = entity_id AND is_active = true),
                'has_active_skus', EXISTS (
                    SELECT 1 FROM skus s
                    JOIN products p ON s.product_id = p.id
                    WHERE p.company_id = entity_id AND s.is_active = true
                )
            ) INTO v_dependency_check;

            IF (v_dependency_check->>'has_active_products')::boolean THEN
                RAISE EXCEPTION 'Cannot deactivate company with active products. Use cascade deactivation instead. Active products: %', v_dependency_check->>'active_products_count';
            END IF;

        ELSIF entity_type = 'product' THEN
            -- Check if product has active SKUs
            SELECT jsonb_build_object(
                'has_active_skus', EXISTS (SELECT 1 FROM skus WHERE product_id = entity_id AND is_active = true),
                'active_skus_count', (SELECT COUNT(*) FROM skus WHERE product_id = entity_id AND is_active = true)
            ) INTO v_dependency_check;

            IF (v_dependency_check->>'has_active_skus')::boolean THEN
                RAISE EXCEPTION 'Cannot deactivate product with active SKUs. Deactivate SKUs first or use cascade deactivation. Active SKUs: %', v_dependency_check->>'active_skus_count';
            END IF;
        END IF;
    END IF;

    -- Perform soft delete based on entity type
    IF entity_type = 'company' THEN
        -- Access control: MOH Tier 1 and System Admin can deactivate any company
        IF v_user_record.role IN ('tier1', 'system_admin') THEN
            UPDATE companies
            SET
                is_active = false,
                suspended_at = now(),
                suspended_by = deactivator_user_id,
                suspended_reason = trim(deactivation_reason),
                updated_at = now()
            WHERE id = entity_id
            RETURNING jsonb_build_object(
                'id', id,
                'name', name,
                'is_active', is_active,
                'suspended_at', suspended_at,
                'suspended_reason', suspended_reason
            ) INTO v_result;
        ELSE
            RAISE EXCEPTION 'Insufficient permissions: Only MOH Tier 1 or System Admin can directly deactivate companies';
        END IF;

    ELSIF entity_type = 'product' THEN
        -- Access control: MOH Tier 1 and System Admin can deactivate any product
        IF v_user_record.role IN ('tier1', 'system_admin') THEN
            UPDATE products
            SET
                is_active = false,
                deactivated_at = now(),
                deactivated_by = deactivator_user_id,
                deactivated_reason = trim(deactivation_reason),
                updated_at = now()
            WHERE id = entity_id
            RETURNING jsonb_build_object(
                'id', id,
                'name', name,
                'is_active', is_active,
                'deactivated_at', deactivated_at,
                'deactivated_reason', deactivated_reason
            ) INTO v_result;
        ELSE
            RAISE EXCEPTION 'Insufficient permissions: Only MOH Tier 1 or System Admin can directly deactivate products';
        END IF;

    ELSIF entity_type = 'sku' THEN
        -- Access control: MOH Tier 1 and System Admin can deactivate any SKU
        IF v_user_record.role IN ('tier1', 'system_admin') THEN
            UPDATE skus
            SET
                is_active = false,
                deactivated_at = now(),
                deactivated_by = deactivator_user_id,
                deactivated_reason = trim(deactivation_reason),
                updated_at = now()
            WHERE id = entity_id
            RETURNING jsonb_build_object(
                'id', id,
                'name', name,
                'sku_code', sku_code,
                'is_active', is_active,
                'deactivated_at', deactivated_at,
                'deactivated_reason', deactivated_reason
            ) INTO v_result;
        ELSE
            RAISE EXCEPTION 'Insufficient permissions: Only MOH Tier 1 or System Admin can directly deactivate SKUs';
        END IF;
    ELSE
        RAISE EXCEPTION 'Invalid entity type: %', entity_type;
    END IF;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Entity not found';
    END IF;

    RETURN jsonb_build_object(
        'entity_type', entity_type,
        'entity_id', entity_id,
        'deactivated', true,
        'deactivation_reason', trim(deactivation_reason),
        'dependency_check', v_dependency_check,
        'entity_data', v_result
    );
END;
$$;

-- ============================================================================
-- Task 1.1.2.15: Two-Person Rule for Critical Actions
-- Purpose: Require two approvers for critical actions
-- Access Control: Enforced in approval workflow
-- Validation: Check approval_history for required approvals
-- ============================================================================

CREATE OR REPLACE FUNCTION check_two_person_rule(
    submission_id uuid,
    required_approver_roles text[] DEFAULT ARRAY['tier1', 'tier1']::text[]
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_approval_count integer;
    v_approvals jsonb;
    v_is_satisfied boolean;
BEGIN
    -- Count distinct approvers with required roles
    SELECT COUNT(DISTINCT ah.approver_id), jsonb_agg(
        jsonb_build_object(
            'approver_id', ah.approver_id,
            'approver_role', ah.approver_role,
            'action_taken', ah.action_taken,
            'created_at', ah.created_at
        )
    )
    INTO v_approval_count, v_approvals
    FROM approval_history ah
    WHERE ah.submission_id = check_two_person_rule.submission_id
    AND ah.approver_role = ANY(required_approver_roles)
    AND ah.action_taken IN ('approved', 'verified');

    -- Check if two-person rule is satisfied
    v_is_satisfied := v_approval_count >= 2;

    RETURN jsonb_build_object(
        'submission_id', submission_id,
        'required_approvers', array_length(required_approver_roles, 1),
        'approval_count', v_approval_count,
        'is_satisfied', v_is_satisfied,
        'approvals', COALESCE(v_approvals, '[]'::jsonb)
    );
END;
$$;

-- Enhanced approval function with two-person rule check
CREATE OR REPLACE FUNCTION rmm_approve_registry_submission_with_two_person_rule(
    approver_user_id uuid,
    submission_id uuid,
    comments text DEFAULT NULL,
    require_two_person_rule boolean DEFAULT false
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_user_record RECORD;
    v_submission_record RECORD;
    v_two_person_check jsonb;
    v_approval_id uuid;
    v_submission jsonb;
BEGIN
    -- Get user record and verify user exists
    SELECT u.id, u.role, u.is_active
    INTO v_user_record
    FROM users u
    WHERE u.id = approver_user_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'User not found';
    END IF;

    IF NOT v_user_record.is_active THEN
        RAISE EXCEPTION 'User is not active';
    END IF;

    -- Access control: Only MOH Tier 1 can approve
    IF v_user_record.role != 'tier1' THEN
        RAISE EXCEPTION 'Insufficient permissions: Only MOH Tier 1 can approve registry submissions';
    END IF;

    -- Get submission record
    SELECT rs.* INTO v_submission_record
    FROM registry_submissions rs
    WHERE rs.id = submission_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Registry submission not found';
    END IF;

    -- Validate submission is in correct status
    IF v_submission_record.status NOT IN ('tier2_verified', 'tier2_peer_reviewed') THEN
        RAISE EXCEPTION 'Submission must be in ''tier2_verified'' or ''tier2_peer_reviewed'' status to be approved. Current status: %', v_submission_record.status;
    END IF;

    -- Check two-person rule if required
    IF require_two_person_rule THEN
        SELECT check_two_person_rule(submission_id, ARRAY['tier1', 'tier1']::text[]) INTO v_two_person_check;

        IF NOT (v_two_person_check->>'is_satisfied')::boolean THEN
            RAISE EXCEPTION 'Two-person rule not satisfied. Required: 2 Tier 1 approvers, Found: %', v_two_person_check->>'approval_count';
        END IF;
    END IF;

    -- Update submission status and approval fields
    UPDATE registry_submissions
    SET
        status = 'tier1_approved',
        approved_by = approver_user_id,
        approved_at = now(),
        updated_at = now()
    WHERE id = submission_id;

    -- Create approval record and approval_history entry
    SELECT create_approval_record(
        submission_id,
        v_submission_record.submission_type,
        v_submission_record.status,
        'tier1_approved',
        approver_user_id,
        v_user_record.role,
        comments,
        jsonb_build_object(
            'approved_at', now(),
            'two_person_rule_checked', require_two_person_rule,
            'two_person_rule_satisfied', COALESCE((v_two_person_check->>'is_satisfied')::boolean, false)
        )
    ) INTO v_approval_id;

    -- Get updated submission
    SELECT jsonb_build_object(
        'id', rs.id,
        'submission_type', rs.submission_type,
        'entity_type', rs.entity_type,
        'entity_id', rs.entity_id,
        'submission_data', rs.submission_data,
        'status', rs.status,
        'submitted_by', rs.submitted_by,
        'verified_by', rs.verified_by,
        'verified_at', rs.verified_at,
        'approved_by', rs.approved_by,
        'approved_at', rs.approved_at,
        'created_at', rs.created_at,
        'updated_at', rs.updated_at,
        'two_person_rule_checked', require_two_person_rule,
        'two_person_rule_status', v_two_person_check
    )
    INTO v_submission
    FROM registry_submissions rs
    WHERE rs.id = submission_id;

    RETURN v_submission;
END;
$$;

COMMIT;
