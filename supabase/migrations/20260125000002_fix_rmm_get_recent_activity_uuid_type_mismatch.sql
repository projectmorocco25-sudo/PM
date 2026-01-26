-- Migration: fix_rmm_get_recent_activity_uuid_type_mismatch
-- Description: Fix UUID type mismatch in rmm_get_recent_activity - entity_id is UUID, not TEXT
-- Date: 2026-01-25
-- Task: Phase 1 - RMM Overview Page Fix
-- Author: Sami (Implementation Compliance Specialist)
-- Issue: Comparing UUID column (rs.entity_id) with TEXT value (c.id::text) causes "operator does not exist: uuid = text"

BEGIN;

-- Drop and recreate the function with fixed UUID comparisons
CREATE OR REPLACE FUNCTION rmm_get_recent_activity(
    user_id uuid,
    p_limit integer DEFAULT 10
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_user_record RECORD;
    v_company_id uuid;
    v_limit integer;
    v_activities jsonb;
BEGIN
    -- Get user record and verify user exists
    SELECT u.id, u.role, u.company_id, u.is_active
    INTO v_user_record
    FROM users u
    WHERE u.id = user_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'User not found';
    END IF;

    IF NOT v_user_record.is_active THEN
        RAISE EXCEPTION 'User is not active';
    END IF;

    -- Validate limit
    IF p_limit < 1 THEN
        v_limit := 10;
    ELSIF p_limit > 50 THEN
        v_limit := 50;
    ELSE
        v_limit := p_limit;
    END IF;

    -- Determine company filter based on role
    IF v_user_record.role IN ('company_admin', 'company_manager', 'company_user', 'vendor') THEN
        v_company_id := v_user_record.company_id;
    ELSE
        v_company_id := NULL; -- MOH users see all
    END IF;

    -- Get recent activities from multiple sources
    SELECT jsonb_agg(
        jsonb_build_object(
            'type', activity.type,
            'description', activity.description,
            'entity_type', activity.entity_type,
            'entity_id', activity.entity_id,
            'timestamp', activity.timestamp,
            'user_name', activity.user_name
        )
        ORDER BY activity.timestamp DESC
    )
    INTO v_activities
    FROM (
        -- Company activities (from registry_submissions if available, otherwise just creation)
        SELECT 
            'company_created' as type,
            'Company "' || c.name || '" registered' as description,
            'company' as entity_type,
            c.id::text as entity_id,
            c.created_at as timestamp,
            COALESCE(submitter.full_name, submitter.email, 'System') as user_name
        FROM companies c
        LEFT JOIN registry_submissions rs ON rs.entity_type = 'company' AND rs.entity_id = c.id AND rs.submission_type = 'company_create'
        LEFT JOIN users submitter ON rs.submitted_by = submitter.id
        WHERE (v_company_id IS NULL OR c.id = v_company_id)
        
        UNION ALL
        
        -- Product activities (from registry_submissions if available, otherwise just creation)
        SELECT 
            'product_created' as type,
            'Product "' || p.name || '" created' as description,
            'product' as entity_type,
            p.id::text as entity_id,
            p.created_at as timestamp,
            COALESCE(submitter.full_name, submitter.email, 'System') as user_name
        FROM products p
        LEFT JOIN registry_submissions rs ON rs.entity_type = 'product' AND rs.entity_id = p.id AND rs.submission_type = 'product_create'
        LEFT JOIN users submitter ON rs.submitted_by = submitter.id
        WHERE (v_company_id IS NULL OR p.company_id = v_company_id)
        
        UNION ALL
        
        -- SKU activities (from registry_submissions if available, otherwise just creation)
        SELECT 
            'sku_created' as type,
            'SKU "' || s.name || '" created' as description,
            'sku' as entity_type,
            s.id::text as entity_id,
            s.created_at as timestamp,
            COALESCE(submitter.full_name, submitter.email, 'System') as user_name
        FROM skus s
        INNER JOIN products p ON s.product_id = p.id
        LEFT JOIN registry_submissions rs ON rs.entity_type = 'sku' AND rs.entity_id = s.id AND rs.submission_type = 'sku_create'
        LEFT JOIN users submitter ON rs.submitted_by = submitter.id
        WHERE (v_company_id IS NULL OR p.company_id = v_company_id)
        
        UNION ALL
        
        -- Submission activities
        SELECT 
            CASE 
                WHEN rs.status = 'tier1_approved' THEN 'submission_approved'
                WHEN rs.status = 'rejected' THEN 'submission_rejected'
                ELSE 'submission_updated'
            END as type,
            CASE 
                WHEN rs.status = 'tier1_approved' THEN 'Submission #' || SUBSTRING(rs.id::text, 1, 8) || ' approved'
                WHEN rs.status = 'rejected' THEN 'Submission #' || SUBSTRING(rs.id::text, 1, 8) || ' rejected'
                ELSE 'Submission #' || SUBSTRING(rs.id::text, 1, 8) || ' updated'
            END as description,
            rs.entity_type as entity_type,
            rs.entity_id::text as entity_id,
            COALESCE(rs.approved_at, rs.updated_at, rs.created_at) as timestamp,
            COALESCE(approver.full_name, approver.email, submitter.full_name, submitter.email) as user_name
        FROM registry_submissions rs
        LEFT JOIN users submitter ON rs.submitted_by = submitter.id
        LEFT JOIN users approver ON rs.approved_by = approver.id
        LEFT JOIN companies c_sub ON rs.entity_type = 'company' AND rs.entity_id = c_sub.id
        LEFT JOIN products p_sub ON rs.entity_type = 'product' AND rs.entity_id = p_sub.id
        LEFT JOIN skus s_sub ON rs.entity_type = 'sku' AND rs.entity_id = s_sub.id
        LEFT JOIN products p_sub_sku ON s_sub.product_id = p_sub_sku.id
        WHERE (
            v_company_id IS NULL 
            OR (rs.entity_type = 'company' AND rs.entity_id = v_company_id)
            OR (rs.entity_type = 'product' AND p_sub.company_id = v_company_id)
            OR (rs.entity_type = 'sku' AND p_sub_sku.company_id = v_company_id)
        )
    ) activity
    ORDER BY activity.timestamp DESC
    LIMIT v_limit;

    RETURN COALESCE(v_activities, '[]'::jsonb);
END;
$$;

COMMIT;
