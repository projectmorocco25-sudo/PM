-- Migration: create_enforcement_helper_rpc_functions
-- Description: Create Enforcement helper RPC functions for frontend (Tasks 1.1.2.37-1.1.2.44)
-- Date: 2026-01-23
-- Tasks: Helper functions for Enforcement frontend pages
-- Author: Sami (Implementation Compliance Specialist)
-- Dependencies: Task 1.1.2.31-1.1.2.36 (enforcement workflow RPC functions must exist)

BEGIN;

-- ============================================================================
-- enforcement_get_dashboard_stats(user_id uuid)
-- Purpose: Get dashboard statistics for Enforcement module
-- Access Control:
--   - MOH Tier 1 and Tier 2: Can see all statistics
--   - System Admin: Can see all statistics
-- Returns: JSON object with dashboard statistics
-- ============================================================================

CREATE OR REPLACE FUNCTION enforcement_get_dashboard_stats(
    user_id uuid
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_user_record RECORD;
    v_stats jsonb;
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

    -- Access control: Only MOH Tier 1, Tier 2, and System Admin can access
    IF v_user_record.role NOT IN ('tier1', 'tier2_officer', 'tier2_registrar', 'system_admin') THEN
        RAISE EXCEPTION 'Insufficient permissions: Only MOH Tier 1, Tier 2, and System Admin can access enforcement dashboard';
    END IF;

    -- Build statistics
    SELECT jsonb_build_object(
        'recent_actions_count', (
            SELECT COUNT(*)
            FROM enforcement_actions
            WHERE status IN ('executed', 'tier1_approved', 'tier2_reviewed')
            AND created_at >= now() - interval '7 days'
        ),
        'pending_approvals_count', (
            SELECT COUNT(*)
            FROM enforcement_actions
            WHERE status = 'tier1_approved'
            AND executed_at IS NULL
        ),
        'total_warnings', (
            SELECT COUNT(*)
            FROM enforcement_actions
            WHERE action_type = 'warning'
            AND status = 'executed'
        ),
        'total_fines', (
            SELECT COUNT(*)
            FROM enforcement_actions
            WHERE action_type = 'fine'
            AND status = 'executed'
        ),
        'total_suspensions', (
            SELECT COUNT(*)
            FROM enforcement_actions
            WHERE action_type = 'suspension'
            AND status = 'executed'
        ),
        'total_enforcement_actions', (
            SELECT COUNT(*)
            FROM enforcement_actions
            WHERE status = 'executed'
        ),
        'pending_approvals_urgent', (
            SELECT COUNT(*)
            FROM enforcement_actions
            WHERE status = 'tier1_approved'
            AND executed_at IS NULL
            AND created_at < now() - interval '3 days'
        ),
        'recent_actions', (
            SELECT jsonb_agg(
                jsonb_build_object(
                    'id', ea.id,
                    'action_type', ea.action_type,
                    'company_id', ea.company_id,
                    'company_name', c.name,
                    'legal_basis', ea.legal_basis,
                    'status', ea.status,
                    'executed_at', ea.executed_at,
                    'created_at', ea.created_at
                )
                ORDER BY ea.created_at DESC
            )
            FROM enforcement_actions ea
            LEFT JOIN companies c ON c.id = ea.company_id
            WHERE ea.status IN ('executed', 'tier1_approved', 'tier2_reviewed')
            AND ea.created_at >= now() - interval '7 days'
            LIMIT 5
        ),
        'pending_approvals', (
            SELECT jsonb_agg(
                jsonb_build_object(
                    'id', ea.id,
                    'action_type', ea.action_type,
                    'company_id', ea.company_id,
                    'company_name', c.name,
                    'amount', ea.amount,
                    'currency', ea.currency,
                    'legal_basis', ea.legal_basis,
                    'status', ea.status,
                    'created_at', ea.created_at,
                    'approved_at', ea.approved_at,
                    'days_since_approval', EXTRACT(DAY FROM now() - ea.approved_at)
                )
                ORDER BY 
                    CASE 
                        WHEN ea.approved_at < now() - interval '3 days' THEN 1
                        WHEN ea.approved_at < now() - interval '7 days' THEN 2
                        ELSE 3
                    END,
                    ea.approved_at ASC
            )
            FROM enforcement_actions ea
            LEFT JOIN companies c ON c.id = ea.company_id
            WHERE ea.status = 'tier1_approved'
            AND ea.executed_at IS NULL
            LIMIT 10
        )
    ) INTO v_stats;

    RETURN v_stats;
END;
$$;

-- ============================================================================
-- enforcement_get_action(user_id uuid, action_id uuid)
-- Purpose: Get single enforcement action by ID with role-based access control
-- Access Control:
--   - MOH Tier 1 and Tier 2: Can see all actions
--   - System Admin: Can see all actions
--   - Company users: Can only see actions for their own company
-- Returns: JSON object with action details
-- ============================================================================

CREATE OR REPLACE FUNCTION enforcement_get_action(
    user_id uuid,
    action_id uuid
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_user_record RECORD;
    v_action jsonb;
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

    -- Get action
    SELECT jsonb_build_object(
        'id', ea.id,
        'company_id', ea.company_id,
        'company_name', c.name,
        'action_type', ea.action_type,
        'violation_type', ea.violation_type,
        'violation_reference_id', ea.violation_reference_id,
        'violation_reference_table', ea.violation_reference_table,
        'amount', ea.amount,
        'currency', ea.currency,
        'status', ea.status,
        'legal_basis', ea.legal_basis,
        'justification', ea.justification,
        'notes', ea.notes,
        'created_by', ea.created_by,
        'created_at', ea.created_at,
        'reviewed_by', ea.reviewed_by,
        'reviewed_at', ea.reviewed_at,
        'review_notes', ea.review_notes,
        'approved_by', ea.approved_by,
        'approved_at', ea.approved_at,
        'approval_notes', ea.approval_notes,
        'executed_by', ea.executed_by,
        'executed_at', ea.executed_at,
        'execution_notes', ea.execution_notes,
        'appeal_id', ea.appeal_id,
        'resolution', ea.resolution,
        'resolved_by', ea.resolved_by,
        'resolved_at', ea.resolved_at,
        'updated_at', ea.updated_at
    )
    INTO v_action
    FROM enforcement_actions ea
    LEFT JOIN companies c ON c.id = ea.company_id
    WHERE ea.id = action_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Enforcement action not found';
    END IF;

    -- Access control: Company users can only see actions for their own company
    IF v_user_record.role IN ('company_admin', 'company_manager', 'company_user', 'vendor') THEN
        IF (v_action->>'company_id')::uuid != v_user_record.company_id THEN
            RAISE EXCEPTION 'Insufficient permissions: You can only view enforcement actions for your own company';
        END IF;
    END IF;

    RETURN v_action;
END;
$$;

-- ============================================================================
-- enforcement_list_actions(user_id uuid, limit integer DEFAULT 50, offset integer DEFAULT 0, status_filter text DEFAULT NULL, action_type_filter text DEFAULT NULL, company_id_filter uuid DEFAULT NULL, search_term text DEFAULT NULL, sort_by text DEFAULT 'created_at', sort_order text DEFAULT 'desc')
-- Purpose: List enforcement actions with filtering, pagination, and sorting
-- Access Control:
--   - MOH Tier 1 and Tier 2: Can see all actions
--   - System Admin: Can see all actions
--   - Company users: Can only see actions for their own company
-- Returns: JSON object with actions array and pagination info
-- ============================================================================

CREATE OR REPLACE FUNCTION enforcement_list_actions(
    user_id uuid,
    limit_count integer DEFAULT 50,
    offset_count integer DEFAULT 0,
    status_filter text DEFAULT NULL,
    action_type_filter text DEFAULT NULL,
    company_id_filter uuid DEFAULT NULL,
    search_term text DEFAULT NULL,
    sort_by text DEFAULT 'created_at',
    sort_order text DEFAULT 'desc'
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_user_record RECORD;
    v_actions jsonb;
    v_total_count integer;
    v_validated_limit integer;
    v_validated_offset integer;
    v_validated_sort_by text;
    v_validated_sort_order text;
    v_filtered_company_id uuid;
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

    -- Validate and sanitize inputs
    IF limit_count < 1 THEN
        limit_count := 50;
    ELSIF limit_count > 100 THEN
        limit_count := 100;
    END IF;
    v_validated_limit := limit_count;

    IF offset_count < 0 THEN
        offset_count := 0;
    END IF;
    v_validated_offset := offset_count;

    -- Validate sort_by
    IF sort_by NOT IN ('created_at', 'updated_at', 'executed_at', 'action_type', 'status', 'amount') THEN
        sort_by := 'created_at';
    END IF;
    v_validated_sort_by := sort_by;

    -- Validate sort_order
    IF lower(sort_order) NOT IN ('asc', 'desc') THEN
        sort_order := 'desc';
    END IF;
    v_validated_sort_order := lower(sort_order);

    -- Determine company filter based on user role
    IF v_user_record.role IN ('company_admin', 'company_manager', 'company_user', 'vendor') THEN
        -- Company users: Only their own company
        v_filtered_company_id := v_user_record.company_id;
    ELSE
        -- MOH users and System Admin: Use provided company_id or all companies
        v_filtered_company_id := company_id_filter;
    END IF;

    -- Get total count
    SELECT COUNT(*)
    INTO v_total_count
    FROM enforcement_actions ea
    WHERE (v_filtered_company_id IS NULL OR ea.company_id = v_filtered_company_id)
    AND (status_filter IS NULL OR ea.status = status_filter)
    AND (action_type_filter IS NULL OR ea.action_type = action_type_filter)
    AND (
        search_term IS NULL OR
        ea.legal_basis ILIKE '%' || search_term || '%' OR
        ea.justification ILIKE '%' || search_term || '%' OR
        EXISTS (
            SELECT 1 FROM companies c
            WHERE c.id = ea.company_id
            AND c.name ILIKE '%' || search_term || '%'
        )
    );

    -- Get paginated results
    SELECT jsonb_agg(
        jsonb_build_object(
            'id', ea.id,
            'company_id', ea.company_id,
            'company_name', c.name,
            'action_type', ea.action_type,
            'violation_type', ea.violation_type,
            'amount', ea.amount,
            'currency', ea.currency,
            'status', ea.status,
            'legal_basis', ea.legal_basis,
            'justification', ea.justification,
            'created_by', ea.created_by,
            'created_at', ea.created_at,
            'reviewed_by', ea.reviewed_by,
            'reviewed_at', ea.reviewed_at,
            'approved_by', ea.approved_by,
            'approved_at', ea.approved_at,
            'executed_by', ea.executed_by,
            'executed_at', ea.executed_at,
            'updated_at', ea.updated_at
        )
    )
    INTO v_actions
    FROM (
        SELECT ea.*
        FROM enforcement_actions ea
        WHERE (v_filtered_company_id IS NULL OR ea.company_id = v_filtered_company_id)
        AND (status_filter IS NULL OR ea.status = status_filter)
        AND (action_type_filter IS NULL OR ea.action_type = action_type_filter)
        AND (
            search_term IS NULL OR
            ea.legal_basis ILIKE '%' || search_term || '%' OR
            ea.justification ILIKE '%' || search_term || '%' OR
            EXISTS (
                SELECT 1 FROM companies c
                WHERE c.id = ea.company_id
                AND c.name ILIKE '%' || search_term || '%'
            )
        )
        ORDER BY
            CASE 
                WHEN v_validated_sort_by = 'created_at' AND v_validated_sort_order = 'asc' THEN ea.created_at
                WHEN v_validated_sort_by = 'created_at' AND v_validated_sort_order = 'desc' THEN ea.created_at
                WHEN v_validated_sort_by = 'updated_at' AND v_validated_sort_order = 'asc' THEN ea.updated_at
                WHEN v_validated_sort_by = 'updated_at' AND v_validated_sort_order = 'desc' THEN ea.updated_at
                WHEN v_validated_sort_by = 'executed_at' AND v_validated_sort_order = 'asc' THEN COALESCE(ea.executed_at, '1970-01-01'::timestamptz)
                WHEN v_validated_sort_by = 'executed_at' AND v_validated_sort_order = 'desc' THEN COALESCE(ea.executed_at, '1970-01-01'::timestamptz)
                WHEN v_validated_sort_by = 'action_type' AND v_validated_sort_order = 'asc' THEN ea.action_type
                WHEN v_validated_sort_by = 'action_type' AND v_validated_sort_order = 'desc' THEN ea.action_type
                WHEN v_validated_sort_by = 'status' AND v_validated_sort_order = 'asc' THEN ea.status
                WHEN v_validated_sort_by = 'status' AND v_validated_sort_order = 'desc' THEN ea.status
                WHEN v_validated_sort_by = 'amount' AND v_validated_sort_order = 'asc' THEN COALESCE(ea.amount, 0)
                WHEN v_validated_sort_by = 'amount' AND v_validated_sort_order = 'desc' THEN COALESCE(ea.amount, 0)
                ELSE ea.created_at
            END
        NULLS LAST
    ) ea
    LEFT JOIN companies c ON c.id = ea.company_id;

    RETURN jsonb_build_object(
        'data', COALESCE(v_actions, '[]'::jsonb),
        'pagination', jsonb_build_object(
            'total', v_total_count,
            'limit', v_validated_limit,
            'offset', v_validated_offset,
            'has_more', (v_validated_offset + v_validated_limit) < v_total_count
        )
    );
END;
$$;

-- ============================================================================
-- enforcement_list_pending_approvals(user_id uuid, limit integer DEFAULT 50, offset integer DEFAULT 0)
-- Purpose: List enforcement actions pending Tier 1 approval
-- Access Control:
--   - MOH Tier 1: Can see all pending approvals
--   - System Admin: Can see all pending approvals
-- Returns: JSON object with actions array and pagination info
-- ============================================================================

CREATE OR REPLACE FUNCTION enforcement_list_pending_approvals(
    user_id uuid,
    limit_count integer DEFAULT 50,
    offset_count integer DEFAULT 0
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_user_record RECORD;
    v_actions jsonb;
    v_total_count integer;
    v_validated_limit integer;
    v_validated_offset integer;
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

    -- Access control: Only MOH Tier 1 and System Admin can access
    IF v_user_record.role NOT IN ('tier1', 'system_admin') THEN
        RAISE EXCEPTION 'Insufficient permissions: Only MOH Tier 1 and System Admin can view pending approvals';
    END IF;

    -- Validate and sanitize inputs
    IF limit_count < 1 THEN
        limit_count := 50;
    ELSIF limit_count > 100 THEN
        limit_count := 100;
    END IF;
    v_validated_limit := limit_count;

    IF offset_count < 0 THEN
        offset_count := 0;
    END IF;
    v_validated_offset := offset_count;

    -- Get total count
    SELECT COUNT(*)
    INTO v_total_count
    FROM enforcement_actions
    WHERE status = 'tier1_approved'
    AND executed_at IS NULL;

    -- Get paginated results
    SELECT jsonb_agg(
        jsonb_build_object(
            'id', ea.id,
            'company_id', ea.company_id,
            'company_name', c.name,
            'action_type', ea.action_type,
            'violation_type', ea.violation_type,
            'amount', ea.amount,
            'currency', ea.currency,
            'status', ea.status,
            'legal_basis', ea.legal_basis,
            'justification', ea.justification,
            'created_by', ea.created_by,
            'created_at', ea.created_at,
            'reviewed_by', ea.reviewed_by,
            'reviewed_at', ea.reviewed_at,
            'approved_by', ea.approved_by,
            'approved_at', ea.approved_at,
            'days_since_approval', EXTRACT(DAY FROM now() - ea.approved_at),
            'is_urgent', ea.approved_at < now() - interval '3 days'
        )
        ORDER BY 
            CASE 
                WHEN ea.approved_at < now() - interval '3 days' THEN 1
                WHEN ea.approved_at < now() - interval '7 days' THEN 2
                ELSE 3
            END,
            ea.approved_at ASC
    )
    INTO v_actions
    FROM (
        SELECT ea.*
        FROM enforcement_actions ea
        WHERE ea.status = 'tier1_approved'
        AND ea.executed_at IS NULL
        ORDER BY 
            CASE 
                WHEN ea.approved_at < now() - interval '3 days' THEN 1
                WHEN ea.approved_at < now() - interval '7 days' THEN 2
                ELSE 3
            END,
            ea.approved_at ASC
        LIMIT v_validated_limit
        OFFSET v_validated_offset
    ) ea
    LEFT JOIN companies c ON c.id = ea.company_id;

    RETURN jsonb_build_object(
        'data', COALESCE(v_actions, '[]'::jsonb),
        'pagination', jsonb_build_object(
            'total', v_total_count,
            'limit', v_validated_limit,
            'offset', v_validated_offset,
            'has_more', (v_validated_offset + v_validated_limit) < v_total_count
        )
    );
END;
$$;

-- ============================================================================
-- enforcement_generate_reports(user_id uuid, start_date date DEFAULT NULL, end_date date DEFAULT NULL, action_type_filter text DEFAULT NULL, violation_type_filter text DEFAULT NULL)
-- Purpose: Generate enforcement reports with analytics
-- Access Control:
--   - MOH Tier 1 and Tier 2: Can generate reports
--   - System Admin: Can generate reports
-- Returns: JSON object with report data
-- ============================================================================

CREATE OR REPLACE FUNCTION enforcement_generate_reports(
    user_id uuid,
    start_date date DEFAULT NULL,
    end_date date DEFAULT NULL,
    action_type_filter text DEFAULT NULL,
    violation_type_filter text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_user_record RECORD;
    v_report jsonb;
    v_date_start date;
    v_date_end date;
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

    -- Access control: Only MOH Tier 1, Tier 2, and System Admin can access
    IF v_user_record.role NOT IN ('tier1', 'tier2_officer', 'tier2_registrar', 'system_admin') THEN
        RAISE EXCEPTION 'Insufficient permissions: Only MOH Tier 1, Tier 2, and System Admin can generate reports';
    END IF;

    -- Set default date range (last 30 days if not provided)
    IF start_date IS NULL THEN
        v_date_start := CURRENT_DATE - interval '30 days';
    ELSE
        v_date_start := start_date;
    END IF;

    IF end_date IS NULL THEN
        v_date_end := CURRENT_DATE;
    ELSE
        v_date_end := end_date;
    END IF;

    -- Build report
    SELECT jsonb_build_object(
        'date_range', jsonb_build_object(
            'start_date', v_date_start,
            'end_date', v_date_end
        ),
        'summary', jsonb_build_object(
            'total_actions', (
                SELECT COUNT(*)
                FROM enforcement_actions
                WHERE created_at::date BETWEEN v_date_start AND v_date_end
                AND (action_type_filter IS NULL OR action_type = action_type_filter)
                AND (violation_type_filter IS NULL OR violation_type = violation_type_filter)
            ),
            'executed_actions', (
                SELECT COUNT(*)
                FROM enforcement_actions
                WHERE status = 'executed'
                AND executed_at::date BETWEEN v_date_start AND v_date_end
                AND (action_type_filter IS NULL OR action_type = action_type_filter)
                AND (violation_type_filter IS NULL OR violation_type = violation_type_filter)
            ),
            'total_fine_amount', (
                SELECT COALESCE(SUM(amount), 0)
                FROM enforcement_actions
                WHERE action_type = 'fine'
                AND status = 'executed'
                AND executed_at::date BETWEEN v_date_start AND v_date_end
                AND (violation_type_filter IS NULL OR violation_type = violation_type_filter)
            ),
            'warnings_count', (
                SELECT COUNT(*)
                FROM enforcement_actions
                WHERE action_type = 'warning'
                AND status = 'executed'
                AND executed_at::date BETWEEN v_date_start AND v_date_end
                AND (violation_type_filter IS NULL OR violation_type = violation_type_filter)
            ),
            'fines_count', (
                SELECT COUNT(*)
                FROM enforcement_actions
                WHERE action_type = 'fine'
                AND status = 'executed'
                AND executed_at::date BETWEEN v_date_start AND v_date_end
                AND (violation_type_filter IS NULL OR violation_type = violation_type_filter)
            ),
            'suspensions_count', (
                SELECT COUNT(*)
                FROM enforcement_actions
                WHERE action_type = 'suspension'
                AND status = 'executed'
                AND executed_at::date BETWEEN v_date_start AND v_date_end
                AND (violation_type_filter IS NULL OR violation_type = violation_type_filter)
            )
        ),
        'by_action_type', (
            SELECT jsonb_object_agg(
                action_type,
                jsonb_build_object(
                    'count', COUNT(*),
                    'total_amount', COALESCE(SUM(amount), 0)
                )
            )
            FROM enforcement_actions
            WHERE status = 'executed'
            AND executed_at::date BETWEEN v_date_start AND v_date_end
            AND (violation_type_filter IS NULL OR violation_type = violation_type_filter)
            GROUP BY action_type
        ),
        'by_violation_type', (
            SELECT jsonb_object_agg(
                violation_type,
                COUNT(*)
            )
            FROM enforcement_actions
            WHERE status = 'executed'
            AND executed_at::date BETWEEN v_date_start AND v_date_end
            AND (action_type_filter IS NULL OR action_type = action_type_filter)
            GROUP BY violation_type
        ),
        'trends', (
            SELECT jsonb_agg(
                jsonb_build_object(
                    'date', date_series,
                    'warnings', COALESCE(warning_count, 0),
                    'fines', COALESCE(fine_count, 0),
                    'suspensions', COALESCE(suspension_count, 0)
                )
                ORDER BY date_series
            )
            FROM (
                SELECT 
                    date_series,
                    COUNT(*) FILTER (WHERE action_type = 'warning') as warning_count,
                    COUNT(*) FILTER (WHERE action_type = 'fine') as fine_count,
                    COUNT(*) FILTER (WHERE action_type = 'suspension') as suspension_count
                FROM generate_series(v_date_start, v_date_end, interval '1 day') as date_series
                LEFT JOIN enforcement_actions ea ON ea.executed_at::date = date_series::date
                    AND ea.status = 'executed'
                    AND (action_type_filter IS NULL OR ea.action_type = action_type_filter)
                    AND (violation_type_filter IS NULL OR ea.violation_type = violation_type_filter)
                GROUP BY date_series
            ) trends_data
        )
    ) INTO v_report;

    RETURN v_report;
END;
$$;

COMMIT;
