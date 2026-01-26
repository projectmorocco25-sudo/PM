-- Migration: create_rmm_overview_rpc_functions
-- Description: Create RPC functions for RMM Overview page (Phase 1 - Task 1.1)
-- Date: 2026-01-25
-- Task: Phase 1 - RMM Overview Page Implementation
-- Author: Maya (Workflow/RPC Engineer) - Coordinated by Sami
-- Dependencies: 
--   - companies, products, skus, registry_submissions, enforcement_actions tables must exist
--   - users table must exist
--   - RLS policies must be in place

BEGIN;

-- ============================================================================
-- rmm_get_statistics
-- Purpose: Get statistics (counts) for companies, products, and SKUs
-- Role-based filtering: Company users see own company only, MOH see all
-- Returns: JSON object with counts for companies, products, and SKUs
-- ============================================================================

CREATE OR REPLACE FUNCTION rmm_get_statistics(
    user_id uuid
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_user_record RECORD;
    v_company_id uuid;
    v_statistics jsonb;
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

    -- Determine company filter based on role
    IF v_user_record.role IN ('company_admin', 'company_manager', 'company_user', 'vendor') THEN
        v_company_id := v_user_record.company_id;
    ELSE
        v_company_id := NULL; -- MOH users see all
    END IF;

    -- Build statistics query
    SELECT jsonb_build_object(
        'companies', jsonb_build_object(
            'total', (
                SELECT COUNT(*)::integer
                FROM companies c
                WHERE (v_company_id IS NULL OR c.id = v_company_id)
            ),
            'active', (
                SELECT COUNT(*)::integer
                FROM companies c
                WHERE (v_company_id IS NULL OR c.id = v_company_id)
                AND c.is_active = true
            ),
            'inactive', (
                SELECT COUNT(*)::integer
                FROM companies c
                WHERE (v_company_id IS NULL OR c.id = v_company_id)
                AND c.is_active = false
            )
        ),
        'products', jsonb_build_object(
            'total', (
                SELECT COUNT(*)::integer
                FROM products p
                WHERE (v_company_id IS NULL OR p.company_id = v_company_id)
            ),
            'active', (
                SELECT COUNT(*)::integer
                FROM products p
                WHERE (v_company_id IS NULL OR p.company_id = v_company_id)
                AND p.is_active = true
            ),
            'inactive', (
                SELECT COUNT(*)::integer
                FROM products p
                WHERE (v_company_id IS NULL OR p.company_id = v_company_id)
                AND p.is_active = false
            )
        ),
        'skus', jsonb_build_object(
            'total', (
                SELECT COUNT(*)::integer
                FROM skus s
                INNER JOIN products p ON s.product_id = p.id
                WHERE (v_company_id IS NULL OR p.company_id = v_company_id)
            ),
            'active', (
                SELECT COUNT(*)::integer
                FROM skus s
                INNER JOIN products p ON s.product_id = p.id
                WHERE (v_company_id IS NULL OR p.company_id = v_company_id)
                AND s.is_active = true
            ),
            'inactive', (
                SELECT COUNT(*)::integer
                FROM skus s
                INNER JOIN products p ON s.product_id = p.id
                WHERE (v_company_id IS NULL OR p.company_id = v_company_id)
                AND s.is_active = false
            )
        )
    ) INTO v_statistics;

    RETURN v_statistics;
END;
$$;

-- ============================================================================
-- rmm_get_recent_activity
-- Purpose: Get recent RMM activities (company/product/SKU changes, submissions)
-- Role-based filtering: Company users see own company only
-- Returns: Array of activity entries with type, description, timestamp
-- ============================================================================

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
        LEFT JOIN registry_submissions rs ON rs.entity_type = 'company' AND rs.entity_id = c.id::text AND rs.submission_type = 'create'
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
        LEFT JOIN registry_submissions rs ON rs.entity_type = 'product' AND rs.entity_id = p.id::text AND rs.submission_type = 'create'
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
        LEFT JOIN registry_submissions rs ON rs.entity_type = 'sku' AND rs.entity_id = s.id::text AND rs.submission_type = 'create'
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
        WHERE (v_company_id IS NULL OR rs.company_id = v_company_id)
    ) activity
    ORDER BY activity.timestamp DESC
    LIMIT v_limit;

    RETURN COALESCE(v_activities, '[]'::jsonb);
END;
$$;

-- ============================================================================
-- rmm_get_enforcement_actions
-- Purpose: Get active enforcement actions for company users (overview page)
-- Role-based: Company users see own company only, MOH users see all
-- Returns: Array of active enforcement actions with legal basis, appeal deadlines
-- ============================================================================

CREATE OR REPLACE FUNCTION rmm_get_enforcement_actions(
    user_id uuid,
    company_id uuid DEFAULT NULL,
    p_limit integer DEFAULT 10
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_user_record RECORD;
    v_filter_company_id uuid;
    v_limit integer;
    v_actions jsonb;
    v_appeal_deadline_date date;
    v_days_remaining integer;
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
        -- Company users: Only their own company
        v_filter_company_id := v_user_record.company_id;
    ELSE
        -- MOH users: Use provided company_id or all
        v_filter_company_id := company_id;
    END IF;

    -- Get active enforcement actions (executed or appealed status)
    SELECT jsonb_agg(
        jsonb_build_object(
            'id', ea.id,
            'action_type', ea.action_type,
            'violation_type', ea.violation_type,
            'legal_basis', ea.legal_basis,
            'amount', ea.amount,
            'currency', ea.currency,
            'status', ea.status,
            'required_action', 
                CASE 
                    WHEN ea.action_type = 'warning' THEN 'Review enforcement details and take corrective action'
                    WHEN ea.action_type = 'fine' THEN 'Payment required: ' || COALESCE(ea.amount::text, '0') || ' ' || ea.currency
                    WHEN ea.action_type = 'suspension' THEN 'Review suspension details and appeal if necessary'
                    ELSE 'Review enforcement action details'
                END,
            'executed_at', ea.executed_at,
            'appeal_deadline', 
                CASE 
                    WHEN ea.executed_at IS NOT NULL THEN 
                        (ea.executed_at::date + INTERVAL '30 days')::date
                    ELSE NULL
                END,
            'appeal_window_open',
                CASE 
                    WHEN ea.executed_at IS NOT NULL AND ea.executed_at::date + INTERVAL '30 days' >= CURRENT_DATE THEN true
                    ELSE false
                END,
            'days_remaining',
                CASE 
                    WHEN ea.executed_at IS NOT NULL AND ea.executed_at::date + INTERVAL '30 days' >= CURRENT_DATE THEN
                        (ea.executed_at::date + INTERVAL '30 days' - CURRENT_DATE)::integer
                    ELSE NULL
                END,
            'company_id', ea.company_id,
            'company_name', c.name
        )
        ORDER BY ea.executed_at DESC NULLS LAST, ea.created_at DESC
    )
    INTO v_actions
    FROM enforcement_actions ea
    INNER JOIN companies c ON ea.company_id = c.id
    WHERE (v_filter_company_id IS NULL OR ea.company_id = v_filter_company_id)
    AND ea.status IN ('executed', 'appealed')
    LIMIT v_limit;

    RETURN COALESCE(v_actions, '[]'::jsonb);
END;
$$;

-- ============================================================================
-- rmm_get_submission_deadlines
-- Purpose: Get upcoming submission deadlines with regulatory references
-- Role-based: Company users see own deadlines only
-- Returns: Array of deadlines with type, due date, days remaining, regulatory reference
-- Note: Submission schedule logic may need to be implemented based on business rules
-- ============================================================================

CREATE OR REPLACE FUNCTION rmm_get_submission_deadlines(
    user_id uuid
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_user_record RECORD;
    v_company_id uuid;
    v_deadlines jsonb;
    v_current_date date;
    v_annual_registry_due date;
    v_weekly_stock_due date;
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

    -- Determine company filter based on role
    IF v_user_record.role IN ('company_admin', 'company_manager', 'company_user', 'vendor') THEN
        v_company_id := v_user_record.company_id;
    ELSE
        v_company_id := NULL; -- MOH users see all deadlines
    END IF;

    v_current_date := CURRENT_DATE;

    -- Calculate deadlines (example logic - adjust based on actual business rules)
    -- Annual Registry: Due March 31 of each year
    v_annual_registry_due := DATE_TRUNC('year', v_current_date) + INTERVAL '1 year' + INTERVAL '2 months' + INTERVAL '30 days';
    IF v_annual_registry_due < v_current_date THEN
        v_annual_registry_due := v_annual_registry_due + INTERVAL '1 year';
    END IF;

    -- Weekly Stock Report: Next Friday (example - adjust based on actual schedule)
    v_weekly_stock_due := v_current_date + (6 - EXTRACT(DOW FROM v_current_date)::integer)::integer;
    IF v_weekly_stock_due <= v_current_date THEN
        v_weekly_stock_due := v_weekly_stock_due + INTERVAL '7 days';
    END IF;

    -- Build deadlines array
    SELECT jsonb_agg(
        jsonb_build_object(
            'submission_type', deadline.submission_type,
            'due_date', deadline.due_date,
            'days_remaining', deadline.days_remaining,
            'regulatory_reference', deadline.regulatory_reference,
            'regulatory_description', deadline.regulatory_description
        )
        ORDER BY deadline.due_date ASC
    )
    INTO v_deadlines
    FROM (
        SELECT 
            'Annual Registry' as submission_type,
            v_annual_registry_due as due_date,
            (v_annual_registry_due - v_current_date)::integer as days_remaining,
            'DMP Art. 12' as regulatory_reference,
            'Annual Submission' as regulatory_description
        
        UNION ALL
        
        SELECT 
            'Weekly Stock Report' as submission_type,
            v_weekly_stock_due as due_date,
            (v_weekly_stock_due - v_current_date)::integer as days_remaining,
            'DMP Art. 12' as regulatory_reference,
            'Weekly Stock Report' as regulatory_description
    ) deadline
    WHERE deadline.days_remaining >= 0
    ORDER BY deadline.due_date ASC
    LIMIT 10;

    RETURN COALESCE(v_deadlines, '[]'::jsonb);
END;
$$;

-- ============================================================================
-- Grant execute permissions
-- ============================================================================

GRANT EXECUTE ON FUNCTION rmm_get_statistics(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION rmm_get_recent_activity(uuid, integer) TO authenticated;
GRANT EXECUTE ON FUNCTION rmm_get_enforcement_actions(uuid, uuid, integer) TO authenticated;
GRANT EXECUTE ON FUNCTION rmm_get_submission_deadlines(uuid) TO authenticated;

COMMIT;
