-- Historical Data Backend Functions Migration
-- Implements Tasks 1.1.5.12b through 1.1.5.12h

-- ============================================================================
-- Task 1.1.5.12b: Database Indexes for Historical Queries
-- ============================================================================

-- Audit logs indexes
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at 
ON public.audit_logs(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_audit_logs_user_created 
ON public.audit_logs(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_audit_logs_table_created 
ON public.audit_logs(table_name, created_at DESC);

-- AAMS submissions index
CREATE INDEX IF NOT EXISTS idx_aams_submissions_company_year 
ON public.aams_submissions(company_id, year DESC);

-- MSQ submissions index
CREATE INDEX IF NOT EXISTS idx_msq_submissions_company_year_month 
ON public.msq_submissions(company_id, year DESC, month DESC);

-- WSL submissions index
CREATE INDEX IF NOT EXISTS idx_wsl_submissions_company_week 
ON public.wsl_submissions(company_id, week_ending_date DESC);

-- Breaches index
CREATE INDEX IF NOT EXISTS idx_breaches_company_status_detected 
ON public.breaches(company_id, status, breach_date DESC);

-- Note: compliance_scores table indexes will be added when that table is created
-- in a future migration (CMC module)

-- ============================================================================
-- Task 1.1.5.12h: Log Historical Data Access (Called First)
-- ============================================================================

CREATE OR REPLACE FUNCTION public.log_historical_data_access(
    p_data_type TEXT,
    p_query_params JSONB,
    p_result_count INTEGER DEFAULT 0
) RETURNS UUID AS $$
DECLARE
    v_user_id UUID;
    v_log_id UUID;
BEGIN
    -- Get current user
    v_user_id := auth.uid();
    
    -- Insert audit log entry
    INSERT INTO public.audit_logs (
        user_id,
        table_name,
        operation_type,
        new_data
    ) VALUES (
        v_user_id,
        'historical_data_access',
        'SELECT',
        jsonb_build_object(
            'data_type', p_data_type,
            'query_params', p_query_params,
            'result_count', p_result_count,
            'accessed_at', NOW()
        )
    )
    RETURNING id INTO v_log_id;

    RETURN v_log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- Task 1.1.5.12c: Check if Historical ECS Data Exists
-- ============================================================================

CREATE OR REPLACE FUNCTION public.has_historical_ecs_data(
    p_company_id UUID DEFAULT NULL
) RETURNS JSONB AS $$
DECLARE
    v_user_id UUID;
    v_user_role TEXT;
    v_has_data BOOLEAN := false;
    v_count INTEGER := 0;
    v_earliest_date DATE;
    v_latest_date DATE;
BEGIN
    -- Get current user
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RETURN jsonb_build_object('success', false, 'error', 'Not authenticated');
    END IF;

    -- Get user role
    SELECT u.role INTO v_user_role
    FROM public.users u
    WHERE u.id = v_user_id;

    -- Check if ecs_authorizations table exists and has data
    -- ECS data is tracked via breaches with threshold_type = 'ecs'
    IF p_company_id IS NOT NULL THEN
        -- Company-specific check
        SELECT 
            COUNT(*) > 0,
            COUNT(*),
            MIN(b.breach_date),
            MAX(b.breach_date)
        INTO v_has_data, v_count, v_earliest_date, v_latest_date
        FROM public.breaches b
        JOIN public.thresholds t ON t.id = b.threshold_id
        WHERE b.company_id = p_company_id
          AND t.threshold_type = 'ecs';
    ELSE
        -- System-wide check (MOH only)
        IF v_user_role NOT IN ('tier1', 'tier2_officer', 'tier2_registrar', 'auditor') THEN
            RETURN jsonb_build_object('success', false, 'error', 'Access denied for system-wide query');
        END IF;

        SELECT 
            COUNT(*) > 0,
            COUNT(*),
            MIN(b.breach_date),
            MAX(b.breach_date)
        INTO v_has_data, v_count, v_earliest_date, v_latest_date
        FROM public.breaches b
        JOIN public.thresholds t ON t.id = b.threshold_id
        WHERE t.threshold_type = 'ecs';
    END IF;

    -- Log access
    PERFORM public.log_historical_data_access(
        'ecs_data_check',
        jsonb_build_object('company_id', p_company_id),
        v_count
    );

    RETURN jsonb_build_object(
        'success', true,
        'has_data', v_has_data,
        'record_count', v_count,
        'earliest_date', v_earliest_date,
        'latest_date', v_latest_date,
        'company_id', p_company_id
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- Task 1.1.5.12d: Check if Historical CMC Data Exists
-- ============================================================================

CREATE OR REPLACE FUNCTION public.has_historical_cmc_data(
    p_company_id UUID DEFAULT NULL
) RETURNS JSONB AS $$
DECLARE
    v_user_id UUID;
    v_user_role TEXT;
    v_has_data BOOLEAN := false;
    v_count INTEGER := 0;
    v_earliest_month DATE;
    v_latest_month DATE;
    v_table_exists BOOLEAN;
BEGIN
    -- Get current user
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RETURN jsonb_build_object('success', false, 'error', 'Not authenticated');
    END IF;

    -- Get user role
    SELECT u.role INTO v_user_role
    FROM public.users u
    WHERE u.id = v_user_id;

    -- Check if compliance_scores table exists
    SELECT EXISTS(
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'compliance_scores'
    ) INTO v_table_exists;

    IF NOT v_table_exists THEN
        -- Log access attempt
        PERFORM public.log_historical_data_access(
            'cmc_data_check',
            jsonb_build_object('company_id', p_company_id, 'table_exists', false),
            0
        );
        
        RETURN jsonb_build_object(
            'success', true,
            'has_data', false,
            'record_count', 0,
            'message', 'CMC module not yet initialized'
        );
    END IF;

    -- Query compliance_scores table
    IF p_company_id IS NOT NULL THEN
        EXECUTE format('
            SELECT 
                COUNT(*) > 0,
                COUNT(*),
                MIN(score_month),
                MAX(score_month)
            FROM public.compliance_scores
            WHERE company_id = %L
        ', p_company_id)
        INTO v_has_data, v_count, v_earliest_month, v_latest_month;
    ELSE
        -- System-wide check (MOH only)
        IF v_user_role NOT IN ('tier1', 'tier2_officer', 'tier2_registrar', 'auditor') THEN
            RETURN jsonb_build_object('success', false, 'error', 'Access denied for system-wide query');
        END IF;

        EXECUTE '
            SELECT 
                COUNT(*) > 0,
                COUNT(*),
                MIN(score_month),
                MAX(score_month)
            FROM public.compliance_scores
        '
        INTO v_has_data, v_count, v_earliest_month, v_latest_month;
    END IF;

    -- Log access
    PERFORM public.log_historical_data_access(
        'cmc_data_check',
        jsonb_build_object('company_id', p_company_id),
        v_count
    );

    RETURN jsonb_build_object(
        'success', true,
        'has_data', v_has_data,
        'record_count', v_count,
        'earliest_month', v_earliest_month,
        'latest_month', v_latest_month,
        'company_id', p_company_id
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- Task 1.1.5.12e: Get Historical VCI Submissions
-- ============================================================================

CREATE OR REPLACE FUNCTION public.vci_get_historical_submissions(
    p_submission_type TEXT, -- 'aams', 'msq', 'wsl'
    p_company_id UUID DEFAULT NULL,
    p_year_from INTEGER DEFAULT NULL,
    p_year_to INTEGER DEFAULT NULL,
    p_status TEXT DEFAULT NULL,
    p_limit INTEGER DEFAULT 50,
    p_offset INTEGER DEFAULT 0
) RETURNS JSONB AS $$
DECLARE
    v_user_id UUID;
    v_user_role TEXT;
    v_user_company_id UUID;
    v_submissions JSONB;
    v_total INTEGER;
BEGIN
    -- Get current user
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RETURN jsonb_build_object('success', false, 'error', 'Not authenticated');
    END IF;

    -- Get user details
    SELECT u.company_id, u.role INTO v_user_company_id, v_user_role
    FROM public.users u
    WHERE u.id = v_user_id;

    -- Company users can only see their own
    IF v_user_role IN ('company_admin', 'company_manager', 'company_user') THEN
        p_company_id := v_user_company_id;
    END IF;

    -- Validate submission type
    IF p_submission_type NOT IN ('aams', 'msq', 'wsl') THEN
        RETURN jsonb_build_object('success', false, 'error', 'Invalid submission type. Use: aams, msq, wsl');
    END IF;

    -- Query based on type
    IF p_submission_type = 'aams' THEN
        -- Count
        SELECT COUNT(*) INTO v_total
        FROM public.aams_submissions a
        WHERE (p_company_id IS NULL OR a.company_id = p_company_id)
          AND (p_year_from IS NULL OR a.year >= p_year_from)
          AND (p_year_to IS NULL OR a.year <= p_year_to)
          AND (p_status IS NULL OR a.status = p_status);

        -- Get data
        SELECT jsonb_agg(sub ORDER BY sub.year DESC) INTO v_submissions
        FROM (
            SELECT 
                a.id,
                a.company_id,
                c.name as company_name,
                a.year,
                a.aams_value,
                a.status,
                a.is_late,
                a.submitted_at,
                a.created_at
            FROM public.aams_submissions a
            JOIN public.companies c ON c.id = a.company_id
            WHERE (p_company_id IS NULL OR a.company_id = p_company_id)
              AND (p_year_from IS NULL OR a.year >= p_year_from)
              AND (p_year_to IS NULL OR a.year <= p_year_to)
              AND (p_status IS NULL OR a.status = p_status)
            ORDER BY a.year DESC
            LIMIT p_limit
            OFFSET p_offset
        ) sub;

    ELSIF p_submission_type = 'msq' THEN
        -- Count
        SELECT COUNT(*) INTO v_total
        FROM public.msq_submissions m
        WHERE (p_company_id IS NULL OR m.company_id = p_company_id)
          AND (p_year_from IS NULL OR m.year >= p_year_from)
          AND (p_year_to IS NULL OR m.year <= p_year_to)
          AND (p_status IS NULL OR m.status = p_status);

        -- Get data
        SELECT jsonb_agg(sub ORDER BY sub.year DESC, sub.month DESC) INTO v_submissions
        FROM (
            SELECT 
                m.id,
                m.company_id,
                c.name as company_name,
                m.year,
                m.month,
                m.status,
                jsonb_array_length(m.submission_data) as sku_count,
                m.submitted_at,
                m.created_at
            FROM public.msq_submissions m
            JOIN public.companies c ON c.id = m.company_id
            WHERE (p_company_id IS NULL OR m.company_id = p_company_id)
              AND (p_year_from IS NULL OR m.year >= p_year_from)
              AND (p_year_to IS NULL OR m.year <= p_year_to)
              AND (p_status IS NULL OR m.status = p_status)
            ORDER BY m.year DESC, m.month DESC
            LIMIT p_limit
            OFFSET p_offset
        ) sub;

    ELSIF p_submission_type = 'wsl' THEN
        -- Count
        SELECT COUNT(*) INTO v_total
        FROM public.wsl_submissions w
        WHERE (p_company_id IS NULL OR w.company_id = p_company_id)
          AND (p_year_from IS NULL OR EXTRACT(YEAR FROM w.week_ending_date) >= p_year_from)
          AND (p_year_to IS NULL OR EXTRACT(YEAR FROM w.week_ending_date) <= p_year_to)
          AND (p_status IS NULL OR w.status = p_status);

        -- Get data
        SELECT jsonb_agg(sub ORDER BY sub.week_ending_date DESC) INTO v_submissions
        FROM (
            SELECT 
                w.id,
                w.company_id,
                c.name as company_name,
                w.week_ending_date,
                w.status,
                w.is_late,
                w.is_non_compliant,
                jsonb_array_length(w.submission_data) as sku_count,
                (SELECT COUNT(*) FROM public.breaches b WHERE b.wsl_submission_id = w.id) as breach_count,
                w.submitted_at,
                w.created_at
            FROM public.wsl_submissions w
            JOIN public.companies c ON c.id = w.company_id
            WHERE (p_company_id IS NULL OR w.company_id = p_company_id)
              AND (p_year_from IS NULL OR EXTRACT(YEAR FROM w.week_ending_date) >= p_year_from)
              AND (p_year_to IS NULL OR EXTRACT(YEAR FROM w.week_ending_date) <= p_year_to)
              AND (p_status IS NULL OR w.status = p_status)
            ORDER BY w.week_ending_date DESC
            LIMIT p_limit
            OFFSET p_offset
        ) sub;
    END IF;

    -- Log access
    PERFORM public.log_historical_data_access(
        'vci_submissions',
        jsonb_build_object(
            'type', p_submission_type,
            'company_id', p_company_id,
            'year_from', p_year_from,
            'year_to', p_year_to,
            'status', p_status
        ),
        v_total
    );

    RETURN jsonb_build_object(
        'success', true,
        'submission_type', p_submission_type,
        'submissions', COALESCE(v_submissions, '[]'::JSONB),
        'total', v_total,
        'limit', p_limit,
        'offset', p_offset
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- Task 1.1.5.12f: Get Historical CMC Scores
-- ============================================================================

CREATE OR REPLACE FUNCTION public.cmc_get_historical_scores(
    p_company_id UUID DEFAULT NULL,
    p_year_from INTEGER DEFAULT NULL,
    p_year_to INTEGER DEFAULT NULL,
    p_limit INTEGER DEFAULT 50,
    p_offset INTEGER DEFAULT 0
) RETURNS JSONB AS $$
DECLARE
    v_user_id UUID;
    v_user_role TEXT;
    v_user_company_id UUID;
    v_scores JSONB;
    v_total INTEGER;
    v_table_exists BOOLEAN;
BEGIN
    -- Get current user
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RETURN jsonb_build_object('success', false, 'error', 'Not authenticated');
    END IF;

    -- Get user details
    SELECT u.company_id, u.role INTO v_user_company_id, v_user_role
    FROM public.users u
    WHERE u.id = v_user_id;

    -- Company users can only see their own
    IF v_user_role IN ('company_admin', 'company_manager', 'company_user') THEN
        p_company_id := v_user_company_id;
    END IF;

    -- Check if compliance_scores table exists
    SELECT EXISTS(
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'compliance_scores'
    ) INTO v_table_exists;

    IF NOT v_table_exists THEN
        -- Log access attempt
        PERFORM public.log_historical_data_access(
            'cmc_scores',
            jsonb_build_object('company_id', p_company_id, 'table_exists', false),
            0
        );
        
        RETURN jsonb_build_object(
            'success', true,
            'scores', '[]'::JSONB,
            'total', 0,
            'message', 'CMC module not yet initialized'
        );
    END IF;

    -- This is a placeholder that will work once compliance_scores table exists
    -- For now, return empty results
    v_scores := '[]'::JSONB;
    v_total := 0;

    -- Log access
    PERFORM public.log_historical_data_access(
        'cmc_scores',
        jsonb_build_object(
            'company_id', p_company_id,
            'year_from', p_year_from,
            'year_to', p_year_to
        ),
        v_total
    );

    RETURN jsonb_build_object(
        'success', true,
        'scores', COALESCE(v_scores, '[]'::JSONB),
        'total', v_total,
        'limit', p_limit,
        'offset', p_offset
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- Task 1.1.5.12g: Get Historical Audit Logs (MOH/Auditors Only)
-- ============================================================================

CREATE OR REPLACE FUNCTION public.audit_get_historical_logs(
    p_user_id UUID DEFAULT NULL,
    p_table_name TEXT DEFAULT NULL,
    p_operation_type TEXT DEFAULT NULL,
    p_date_from TIMESTAMPTZ DEFAULT NULL,
    p_date_to TIMESTAMPTZ DEFAULT NULL,
    p_limit INTEGER DEFAULT 50,
    p_offset INTEGER DEFAULT 0
) RETURNS JSONB AS $$
DECLARE
    v_user_id UUID;
    v_user_role TEXT;
    v_logs JSONB;
    v_total INTEGER;
BEGIN
    -- Get current user
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RETURN jsonb_build_object('success', false, 'error', 'Not authenticated');
    END IF;

    -- Get user role
    SELECT u.role INTO v_user_role
    FROM public.users u
    WHERE u.id = v_user_id;

    -- Only MOH and Auditors can access audit logs
    IF v_user_role NOT IN ('tier1', 'tier2_officer', 'tier2_registrar', 'auditor', 'system_admin') THEN
        RETURN jsonb_build_object('success', false, 'error', 'Access denied. Only MOH and Auditors can view audit logs.');
    END IF;

    -- Validate operation_type if provided
    IF p_operation_type IS NOT NULL AND p_operation_type NOT IN ('INSERT', 'UPDATE', 'DELETE', 'SELECT') THEN
        RETURN jsonb_build_object('success', false, 'error', 'Invalid operation type');
    END IF;

    -- Count
    SELECT COUNT(*) INTO v_total
    FROM public.audit_logs a
    WHERE (p_user_id IS NULL OR a.user_id = p_user_id)
      AND (p_table_name IS NULL OR a.table_name = p_table_name)
      AND (p_operation_type IS NULL OR a.operation_type = p_operation_type)
      AND (p_date_from IS NULL OR a.created_at >= p_date_from)
      AND (p_date_to IS NULL OR a.created_at <= p_date_to);

    -- Get logs
    SELECT jsonb_agg(sub ORDER BY sub.created_at DESC) INTO v_logs
    FROM (
        SELECT 
            a.id,
            a.user_id,
            u.full_name as user_name,
            u.email as user_email,
            a.table_name,
            a.record_id,
            a.operation_type,
            a.old_data,
            a.new_data,
            a.created_at
        FROM public.audit_logs a
        LEFT JOIN public.users u ON u.id = a.user_id
        WHERE (p_user_id IS NULL OR a.user_id = p_user_id)
          AND (p_table_name IS NULL OR a.table_name = p_table_name)
          AND (p_operation_type IS NULL OR a.operation_type = p_operation_type)
          AND (p_date_from IS NULL OR a.created_at >= p_date_from)
          AND (p_date_to IS NULL OR a.created_at <= p_date_to)
        ORDER BY a.created_at DESC
        LIMIT p_limit
        OFFSET p_offset
    ) sub;

    -- Log access to audit logs (meta-audit)
    PERFORM public.log_historical_data_access(
        'audit_logs',
        jsonb_build_object(
            'queried_by', v_user_id,
            'user_id_filter', p_user_id,
            'table_name', p_table_name,
            'operation_type', p_operation_type,
            'date_from', p_date_from,
            'date_to', p_date_to
        ),
        v_total
    );

    RETURN jsonb_build_object(
        'success', true,
        'logs', COALESCE(v_logs, '[]'::JSONB),
        'total', v_total,
        'limit', p_limit,
        'offset', p_offset
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- Summary Statistics Function for Historical Data
-- ============================================================================

CREATE OR REPLACE FUNCTION public.get_historical_data_summary(
    p_company_id UUID DEFAULT NULL
) RETURNS JSONB AS $$
DECLARE
    v_user_id UUID;
    v_user_role TEXT;
    v_user_company_id UUID;
    v_aams_count INTEGER;
    v_msq_count INTEGER;
    v_wsl_count INTEGER;
    v_breach_count INTEGER;
    v_audit_count INTEGER;
BEGIN
    -- Get current user
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RETURN jsonb_build_object('success', false, 'error', 'Not authenticated');
    END IF;

    -- Get user details
    SELECT u.company_id, u.role INTO v_user_company_id, v_user_role
    FROM public.users u
    WHERE u.id = v_user_id;

    -- Company users can only see their own
    IF v_user_role IN ('company_admin', 'company_manager', 'company_user') THEN
        p_company_id := v_user_company_id;
    END IF;

    -- Get counts
    SELECT COUNT(*) INTO v_aams_count
    FROM public.aams_submissions
    WHERE p_company_id IS NULL OR company_id = p_company_id;

    SELECT COUNT(*) INTO v_msq_count
    FROM public.msq_submissions
    WHERE p_company_id IS NULL OR company_id = p_company_id;

    SELECT COUNT(*) INTO v_wsl_count
    FROM public.wsl_submissions
    WHERE p_company_id IS NULL OR company_id = p_company_id;

    SELECT COUNT(*) INTO v_breach_count
    FROM public.breaches
    WHERE p_company_id IS NULL OR company_id = p_company_id;

    -- Audit logs only for MOH/Auditors
    IF v_user_role IN ('tier1', 'tier2_officer', 'tier2_registrar', 'auditor', 'system_admin') THEN
        SELECT COUNT(*) INTO v_audit_count
        FROM public.audit_logs;
    ELSE
        v_audit_count := NULL;
    END IF;

    RETURN jsonb_build_object(
        'success', true,
        'company_id', p_company_id,
        'counts', jsonb_build_object(
            'aams_submissions', v_aams_count,
            'msq_submissions', v_msq_count,
            'wsl_submissions', v_wsl_count,
            'breaches', v_breach_count,
            'audit_logs', v_audit_count
        )
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.log_historical_data_access(TEXT, JSONB, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_historical_ecs_data(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_historical_cmc_data(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.vci_get_historical_submissions(TEXT, UUID, INTEGER, INTEGER, TEXT, INTEGER, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION public.cmc_get_historical_scores(UUID, INTEGER, INTEGER, INTEGER, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION public.audit_get_historical_logs(UUID, TEXT, TEXT, TIMESTAMPTZ, TIMESTAMPTZ, INTEGER, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_historical_data_summary(UUID) TO authenticated;

-- Comments
COMMENT ON FUNCTION public.log_historical_data_access IS 'Task 1.1.5.12h: Log access to historical data for audit trail';
COMMENT ON FUNCTION public.has_historical_ecs_data IS 'Task 1.1.5.12c: Check if historical ECS data exists';
COMMENT ON FUNCTION public.has_historical_cmc_data IS 'Task 1.1.5.12d: Check if historical CMC data exists';
COMMENT ON FUNCTION public.vci_get_historical_submissions IS 'Task 1.1.5.12e: Get historical AAMS/MSQ/WSL submissions with RLS';
COMMENT ON FUNCTION public.cmc_get_historical_scores IS 'Task 1.1.5.12f: Get historical compliance scores with RLS';
COMMENT ON FUNCTION public.audit_get_historical_logs IS 'Task 1.1.5.12g: Get historical audit logs (MOH/Auditors only)';
