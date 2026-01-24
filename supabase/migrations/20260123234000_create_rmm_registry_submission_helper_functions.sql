-- Migration: create_rmm_registry_submission_helper_functions
-- Description: Create RMM registry submission helper RPC functions for frontend (list, get, approval history)
-- Date: 2026-01-23
-- Tasks: Support for Tasks 1.1.2.26, 1.1.2.27 (Registry submission list and detail pages)
-- Author: Sami (Implementation Compliance Specialist)
-- Dependencies: Task 1.1.1.2 (registry_submissions, approvals, approval_history tables must exist)

BEGIN;

-- ============================================================================
-- rmm_list_submissions
-- Purpose: List registry submissions with filtering, pagination, and sorting
-- Access Control: Company users see their own submissions, MOH users see all
-- ============================================================================

CREATE OR REPLACE FUNCTION rmm_list_submissions(
    p_limit integer DEFAULT 100,
    p_offset integer DEFAULT 0,
    p_status text DEFAULT NULL,
    p_submission_type text DEFAULT NULL,
    p_entity_type text DEFAULT NULL,
    p_company_id uuid DEFAULT NULL,
    p_search text DEFAULT NULL,
    p_sort_by text DEFAULT 'created_at',
    p_sort_order text DEFAULT 'DESC'
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_user_record RECORD;
    v_submissions jsonb;
    v_total_count integer;
    v_filtered_count integer;
BEGIN
    -- Get user record
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

    -- Access control: Company users can only see their own company's submissions
    -- MOH users can see all submissions
    IF v_user_record.role IN ('company_admin', 'company_manager', 'company_user', 'vendor') THEN
        IF v_user_record.company_id IS NULL THEN
            RAISE EXCEPTION 'Company user must be associated with a company';
        END IF;
        -- Set company_id filter to user's company
        p_company_id := v_user_record.company_id;
    END IF;

    -- Validate pagination
    IF p_limit < 1 OR p_limit > 1000 THEN
        RAISE EXCEPTION 'Limit must be between 1 and 1000';
    END IF;

    IF p_offset < 0 THEN
        RAISE EXCEPTION 'Offset must be >= 0';
    END IF;

    -- Validate sort_by
    IF p_sort_by NOT IN ('created_at', 'updated_at', 'status', 'submission_type', 'entity_type') THEN
        RAISE EXCEPTION 'Invalid sort_by: %. Must be one of: created_at, updated_at, status, submission_type, entity_type', p_sort_by;
    END IF;

    -- Validate sort_order
    IF p_sort_order NOT IN ('ASC', 'DESC') THEN
        RAISE EXCEPTION 'Invalid sort_order: %. Must be ASC or DESC', p_sort_order;
    END IF;

    -- Build query with filters
    WITH filtered_submissions AS (
        SELECT 
            rs.id,
            rs.submission_type,
            rs.entity_type,
            rs.entity_id,
            rs.submission_data,
            rs.status,
            rs.submitted_by,
            rs.verified_by,
            rs.verified_at,
            rs.approved_by,
            rs.approved_at,
            rs.implemented_by,
            rs.implemented_at,
            rs.rejection_reason,
            rs.created_at,
            rs.updated_at,
            -- Get company name for company submissions
            CASE 
                WHEN rs.entity_type = 'company' AND rs.entity_id IS NOT NULL THEN
                    (SELECT name FROM companies WHERE id = rs.entity_id)
                WHEN rs.entity_type = 'product' AND rs.entity_id IS NOT NULL THEN
                    (SELECT c.name FROM products p JOIN companies c ON p.company_id = c.id WHERE p.id = rs.entity_id)
                WHEN rs.entity_type = 'sku' AND rs.entity_id IS NOT NULL THEN
                    (SELECT c.name FROM skus s JOIN products p ON s.product_id = p.id JOIN companies c ON p.company_id = c.id WHERE s.id = rs.entity_id)
                ELSE NULL
            END AS company_name,
            -- Get submitter name
            (SELECT full_name FROM users WHERE id = rs.submitted_by) AS submitted_by_name
        FROM registry_submissions rs
        WHERE 1=1
            -- Status filter
            AND (p_status IS NULL OR rs.status = p_status)
            -- Submission type filter
            AND (p_submission_type IS NULL OR rs.submission_type = p_submission_type)
            -- Entity type filter
            AND (p_entity_type IS NULL OR rs.entity_type = p_entity_type)
            -- Company filter (for company users, already set above)
            AND (
                p_company_id IS NULL 
                OR (
                    -- Direct company submission
                    (rs.entity_type = 'company' AND rs.entity_id = p_company_id)
                    -- Product submission for company
                    OR (rs.entity_type = 'product' AND EXISTS (
                        SELECT 1 FROM products p WHERE p.id = rs.entity_id AND p.company_id = p_company_id
                    ))
                    -- SKU submission for company
                    OR (rs.entity_type = 'sku' AND EXISTS (
                        SELECT 1 FROM skus s 
                        JOIN products p ON s.product_id = p.id 
                        WHERE s.id = rs.entity_id AND p.company_id = p_company_id
                    ))
                    -- Or submitted by company user
                    OR rs.submitted_by IN (
                        SELECT id FROM users WHERE company_id = p_company_id
                    )
                )
            )
            -- Search filter (searches in submission_data JSONB)
            AND (
                p_search IS NULL 
                OR rs.submission_data::text ILIKE '%' || p_search || '%'
                OR rs.submission_type ILIKE '%' || p_search || '%'
                OR rs.entity_type ILIKE '%' || p_search || '%'
            )
    ),
    total_count AS (
        SELECT COUNT(*) as count FROM filtered_submissions
    ),
    ordered_submissions AS (
        SELECT fs.*
        FROM filtered_submissions fs
        ORDER BY 
            CASE WHEN p_sort_order = 'ASC' THEN
                CASE p_sort_by
                    WHEN 'created_at' THEN fs.created_at
                    WHEN 'updated_at' THEN fs.updated_at
                    WHEN 'status' THEN fs.status
                    WHEN 'submission_type' THEN fs.submission_type
                    WHEN 'entity_type' THEN fs.entity_type
                END
            END ASC,
            CASE WHEN p_sort_order = 'DESC' THEN
                CASE p_sort_by
                    WHEN 'created_at' THEN fs.created_at
                    WHEN 'updated_at' THEN fs.updated_at
                    WHEN 'status' THEN fs.status
                    WHEN 'submission_type' THEN fs.submission_type
                    WHEN 'entity_type' THEN fs.entity_type
                END
            END DESC
        LIMIT p_limit OFFSET p_offset
    )
    SELECT 
        jsonb_agg(
            jsonb_build_object(
                'id', os.id,
                'submission_type', os.submission_type,
                'entity_type', os.entity_type,
                'entity_id', os.entity_id,
                'submission_data', os.submission_data,
                'status', os.status,
                'submitted_by', os.submitted_by,
                'submitted_by_name', os.submitted_by_name,
                'verified_by', os.verified_by,
                'verified_at', os.verified_at,
                'approved_by', os.approved_by,
                'approved_at', os.approved_at,
                'implemented_by', os.implemented_by,
                'implemented_at', os.implemented_at,
                'rejection_reason', os.rejection_reason,
                'company_name', os.company_name,
                'created_at', os.created_at,
                'updated_at', os.updated_at
            )
        ),
        (SELECT count FROM total_count)
    INTO v_submissions, v_total_count
    FROM ordered_submissions os;

    -- Return paginated results
    RETURN jsonb_build_object(
        'data', COALESCE(v_submissions, '[]'::jsonb),
        'pagination', jsonb_build_object(
            'total', v_total_count,
            'limit', p_limit,
            'offset', p_offset,
            'has_more', (p_offset + p_limit) < v_total_count
        )
    );
END;
$$;

-- ============================================================================
-- rmm_get_submission
-- Purpose: Get single registry submission with full details
-- Access Control: Company users can see their own submissions, MOH users can see all
-- ============================================================================

CREATE OR REPLACE FUNCTION rmm_get_submission(
    p_submission_id uuid
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_user_record RECORD;
    v_submission jsonb;
BEGIN
    -- Get user record
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

    -- Get submission
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
        -- Get company name
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

    -- Access control: Company users can only see their own company's submissions
    IF v_user_record.role IN ('company_admin', 'company_manager', 'company_user', 'vendor') THEN
        IF v_user_record.company_id IS NULL THEN
            RAISE EXCEPTION 'Company user must be associated with a company';
        END IF;

        -- Check if submission belongs to user's company
        IF NOT (
            -- Direct company submission
            (v_submission->>'entity_type' = 'company' AND (v_submission->>'entity_id')::uuid = v_user_record.company_id)
            -- Product submission for company
            OR (v_submission->>'entity_type' = 'product' AND EXISTS (
                SELECT 1 FROM products p WHERE p.id = (v_submission->>'entity_id')::uuid AND p.company_id = v_user_record.company_id
            ))
            -- SKU submission for company
            OR (v_submission->>'entity_type' = 'sku' AND EXISTS (
                SELECT 1 FROM skus s 
                JOIN products p ON s.product_id = p.id 
                WHERE s.id = (v_submission->>'entity_id')::uuid AND p.company_id = v_user_record.company_id
            ))
            -- Or submitted by company user
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

-- ============================================================================
-- rmm_get_approval_history
-- Purpose: Get approval history for a registry submission
-- Access Control: Company users can see their own submissions' history, MOH users can see all
-- ============================================================================

CREATE OR REPLACE FUNCTION rmm_get_approval_history(
    p_submission_id uuid
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_user_record RECORD;
    v_submission_record RECORD;
    v_history jsonb;
BEGIN
    -- Get user record
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

    -- Get submission to verify access
    SELECT rs.* INTO v_submission_record
    FROM registry_submissions rs
    WHERE rs.id = p_submission_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Registry submission not found';
    END IF;

    -- Access control: Company users can only see their own company's submissions' history
    IF v_user_record.role IN ('company_admin', 'company_manager', 'company_user', 'vendor') THEN
        IF v_user_record.company_id IS NULL THEN
            RAISE EXCEPTION 'Company user must be associated with a company';
        END IF;

        -- Check if submission belongs to user's company
        IF NOT (
            -- Direct company submission
            (v_submission_record.entity_type = 'company' AND v_submission_record.entity_id = v_user_record.company_id)
            -- Product submission for company
            OR (v_submission_record.entity_type = 'product' AND EXISTS (
                SELECT 1 FROM products p WHERE p.id = v_submission_record.entity_id AND p.company_id = v_user_record.company_id
            ))
            -- SKU submission for company
            OR (v_submission_record.entity_type = 'sku' AND EXISTS (
                SELECT 1 FROM skus s 
                JOIN products p ON s.product_id = p.id 
                WHERE s.id = v_submission_record.entity_id AND p.company_id = v_user_record.company_id
            ))
            -- Or submitted by company user
            OR v_submission_record.submitted_by IN (
                SELECT id FROM users WHERE company_id = v_user_record.company_id
            )
        ) THEN
            RAISE EXCEPTION 'Insufficient permissions: You can only view your own company''s submission history';
        END IF;
    END IF;

    -- Get approval history
    SELECT jsonb_agg(
        jsonb_build_object(
            'id', ah.id,
            'approval_id', ah.approval_id,
            'submission_id', ah.submission_id,
            'submission_type', ah.submission_type,
            'workflow_stage', ah.workflow_stage,
            'action_taken', ah.action_taken,
            'approver_id', ah.approver_id,
            'approver_name', (SELECT full_name FROM users WHERE id = ah.approver_id),
            'approver_role', ah.approver_role,
            'comments', ah.comments,
            'metadata', ah.metadata,
            'created_at', ah.created_at
        )
        ORDER BY ah.created_at ASC
    )
    INTO v_history
    FROM approval_history ah
    WHERE ah.submission_id = p_submission_id;

    RETURN jsonb_build_object(
        'submission_id', p_submission_id,
        'history', COALESCE(v_history, '[]'::jsonb)
    );
END;
$$;

COMMIT;
