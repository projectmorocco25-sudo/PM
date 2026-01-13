-- VCI WSL & Breach RPC Functions Migration
-- Implements Tasks 1.1.5.1 through 1.1.5.12a

-- ============================================================================
-- Task 1.1.5.3: WSL Deadline Validation (Friday 17:00 Morocco Time)
-- ============================================================================

-- Helper: Get the expected Friday deadline for a week ending date
CREATE OR REPLACE FUNCTION public.vci_get_wsl_deadline(
    p_week_ending_date DATE
) RETURNS TIMESTAMPTZ AS $$
BEGIN
    -- WSL deadline is Friday at 17:00 Morocco time (Africa/Casablanca)
    RETURN (p_week_ending_date || ' 17:00:00')::TIMESTAMP AT TIME ZONE 'Africa/Casablanca';
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Helper: Check if WSL submission is late
CREATE OR REPLACE FUNCTION public.vci_is_wsl_late(
    p_week_ending_date DATE,
    p_submitted_at TIMESTAMPTZ DEFAULT NOW()
) RETURNS BOOLEAN AS $$
DECLARE
    v_deadline TIMESTAMPTZ;
BEGIN
    v_deadline := public.vci_get_wsl_deadline(p_week_ending_date);
    RETURN p_submitted_at > v_deadline;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Helper: Get valid week ending date (must be a Friday)
CREATE OR REPLACE FUNCTION public.vci_validate_week_ending_date(
    p_week_ending_date DATE
) RETURNS JSONB AS $$
DECLARE
    v_day_of_week INTEGER;
BEGIN
    v_day_of_week := EXTRACT(DOW FROM p_week_ending_date);
    
    -- Friday is 5 in PostgreSQL DOW
    IF v_day_of_week != 5 THEN
        RETURN jsonb_build_object(
            'valid', false,
            'error', 'Week ending date must be a Friday'
        );
    END IF;
    
    -- Cannot submit for future weeks
    IF p_week_ending_date > CURRENT_DATE THEN
        RETURN jsonb_build_object(
            'valid', false,
            'error', 'Cannot submit WSL for future weeks'
        );
    END IF;
    
    RETURN jsonb_build_object('valid', true);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ============================================================================
-- Task 1.1.5.2: WSL Validation Logic (All SKUs Required, Completeness Check)
-- ============================================================================

CREATE OR REPLACE FUNCTION public.vci_validate_wsl_completeness(
    p_company_id UUID,
    p_submission_data JSONB
) RETURNS JSONB AS $$
DECLARE
    v_flags JSONB := '[]'::JSONB;
    v_company_skus UUID[];
    v_submitted_skus UUID[];
    v_missing_skus UUID[];
    v_sku_id UUID;
    v_item JSONB;
    v_sku_exists BOOLEAN;
BEGIN
    -- Get all active SKUs for the company
    SELECT array_agg(s.id) INTO v_company_skus
    FROM public.skus s
    JOIN public.products p ON p.id = s.product_id
    WHERE p.company_id = p_company_id
      AND s.is_active = true;

    IF v_company_skus IS NULL OR array_length(v_company_skus, 1) = 0 THEN
        v_flags := v_flags || jsonb_build_object(
            'type', 'warning',
            'code', 'NO_SKUS',
            'message', 'Company has no active SKUs'
        );
        RETURN v_flags;
    END IF;

    -- Extract submitted SKU IDs
    SELECT array_agg((elem->>'sku_id')::UUID)
    INTO v_submitted_skus
    FROM jsonb_array_elements(p_submission_data) elem
    WHERE elem ? 'sku_id';

    -- Check for missing SKUs
    SELECT array_agg(sku_id)
    INTO v_missing_skus
    FROM unnest(v_company_skus) AS sku_id
    WHERE sku_id != ALL(COALESCE(v_submitted_skus, ARRAY[]::UUID[]));

    IF v_missing_skus IS NOT NULL AND array_length(v_missing_skus, 1) > 0 THEN
        v_flags := v_flags || jsonb_build_object(
            'type', 'error',
            'code', 'MISSING_SKUS',
            'message', format('%s SKU(s) are missing from submission', array_length(v_missing_skus, 1)),
            'missing_sku_ids', v_missing_skus
        );
    END IF;

    -- Validate each submitted item
    FOR v_item IN SELECT * FROM jsonb_array_elements(p_submission_data)
    LOOP
        v_sku_id := (v_item->>'sku_id')::UUID;
        
        -- Check SKU belongs to company
        IF NOT (v_sku_id = ANY(v_company_skus)) THEN
            v_flags := v_flags || jsonb_build_object(
                'type', 'error',
                'code', 'INVALID_SKU',
                'message', format('SKU %s does not belong to this company', v_sku_id),
                'sku_id', v_sku_id
            );
        END IF;

        -- Check quantity is valid
        IF (v_item->>'stock_level') IS NULL OR (v_item->>'stock_level')::NUMERIC < 0 THEN
            v_flags := v_flags || jsonb_build_object(
                'type', 'error',
                'code', 'INVALID_QUANTITY',
                'message', format('Invalid stock level for SKU %s', v_sku_id),
                'sku_id', v_sku_id
            );
        END IF;
    END LOOP;

    RETURN v_flags;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- Task 1.1.5.4 & 1.1.5.7: Breach Detection and Priority Logic
-- ============================================================================

-- Task 1.1.5.7: Calculate breach priority
CREATE OR REPLACE FUNCTION public.vci_calculate_breach_priority(
    p_sku_id UUID,
    p_stock_level NUMERIC,
    p_threshold_value NUMERIC
) RETURNS TEXT AS $$
DECLARE
    v_is_critical BOOLEAN;
    v_shortage_percent NUMERIC;
BEGIN
    -- Check if critical medicine
    SELECT EXISTS(
        SELECT 1 FROM public.critical_medicines 
        WHERE sku_id = p_sku_id AND is_current = true
    ) INTO v_is_critical;

    -- Calculate shortage percentage
    IF p_threshold_value > 0 THEN
        v_shortage_percent := (1 - (p_stock_level / p_threshold_value)) * 100;
    ELSE
        v_shortage_percent := 0;
    END IF;

    -- Priority rules:
    -- 'critical' - Critical medicine OR >50% shortage
    -- 'high' - >30% shortage
    -- 'standard' - Others
    IF v_is_critical OR v_shortage_percent > 50 THEN
        RETURN 'critical';
    ELSIF v_shortage_percent > 30 THEN
        RETURN 'high';
    ELSE
        RETURN 'standard';
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Task 1.1.5.4: Detect breaches from WSL submission
CREATE OR REPLACE FUNCTION public.vci_detect_breaches(
    p_company_id UUID,
    p_submission_data JSONB,
    p_week_ending_date DATE
) RETURNS TABLE (
    sku_id UUID,
    threshold_id UUID,
    stock_level NUMERIC,
    threshold_value NUMERIC,
    priority TEXT
) AS $$
DECLARE
    v_item JSONB;
    v_sku_id UUID;
    v_stock_level NUMERIC;
    v_threshold RECORD;
    v_priority TEXT;
BEGIN
    FOR v_item IN SELECT * FROM jsonb_array_elements(p_submission_data)
    LOOP
        v_sku_id := (v_item->>'sku_id')::UUID;
        v_stock_level := (v_item->>'stock_level')::NUMERIC;

        -- Get current threshold for this SKU
        SELECT t.* INTO v_threshold
        FROM public.thresholds t
        WHERE t.sku_id = v_sku_id
          AND t.is_current = true
          AND t.threshold_type = 'vci'
        ORDER BY t.created_at DESC
        LIMIT 1;

        -- Check if stock level is below threshold
        IF v_threshold IS NOT NULL AND v_stock_level < v_threshold.threshold_value THEN
            v_priority := public.vci_calculate_breach_priority(v_sku_id, v_stock_level, v_threshold.threshold_value);
            
            RETURN QUERY SELECT 
                v_sku_id,
                v_threshold.id,
                v_stock_level,
                v_threshold.threshold_value,
                v_priority;
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- Task 1.1.5.1, 1.1.5.5, 1.1.5.5a, 1.1.5.6: WSL Submission with Breach Creation
-- ============================================================================

CREATE OR REPLACE FUNCTION public.vci_submit_wsl(
    p_week_ending_date DATE,
    p_submission_data JSONB
) RETURNS JSONB AS $$
DECLARE
    v_user_id UUID;
    v_company_id UUID;
    v_user_role TEXT;
    v_submission_id UUID;
    v_validation_result JSONB;
    v_validation_flags JSONB;
    v_has_errors BOOLEAN;
    v_is_late BOOLEAN;
    v_breach RECORD;
    v_breach_id UUID;
    v_breaches_created INTEGER := 0;
    v_existing RECORD;
BEGIN
    -- Get current user
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RETURN jsonb_build_object('success', false, 'error', 'Not authenticated');
    END IF;

    -- Get user details
    SELECT u.company_id, u.role INTO v_company_id, v_user_role
    FROM public.users u
    WHERE u.id = v_user_id;

    IF v_company_id IS NULL THEN
        RETURN jsonb_build_object('success', false, 'error', 'User must be associated with a company');
    END IF;

    IF v_user_role NOT IN ('company_admin', 'company_manager') THEN
        RETURN jsonb_build_object('success', false, 'error', 'Only company admin or manager can submit WSL');
    END IF;

    -- Validate week ending date
    v_validation_result := public.vci_validate_week_ending_date(p_week_ending_date);
    IF NOT (v_validation_result->>'valid')::BOOLEAN THEN
        RETURN jsonb_build_object('success', false, 'error', v_validation_result->>'error');
    END IF;

    -- Check for existing submission
    SELECT * INTO v_existing
    FROM public.wsl_submissions
    WHERE company_id = v_company_id
      AND week_ending_date = p_week_ending_date;

    IF v_existing IS NOT NULL THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'WSL for this week already exists',
            'existing_id', v_existing.id
        );
    END IF;

    -- Task 1.1.5.2: Validate completeness
    v_validation_flags := public.vci_validate_wsl_completeness(v_company_id, p_submission_data);
    
    SELECT EXISTS(
        SELECT 1 FROM jsonb_array_elements(v_validation_flags) elem
        WHERE elem->>'type' = 'error'
    ) INTO v_has_errors;

    IF v_has_errors THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'Validation failed',
            'validation_flags', v_validation_flags
        );
    END IF;

    -- Task 1.1.5.3: Check if late
    v_is_late := public.vci_is_wsl_late(p_week_ending_date);

    -- Create submission
    INSERT INTO public.wsl_submissions (
        company_id,
        week_ending_date,
        submission_data,
        status,
        is_late,
        is_non_compliant,
        submitted_by,
        submitted_at
    ) VALUES (
        v_company_id,
        p_week_ending_date,
        p_submission_data,
        CASE WHEN v_is_late THEN 'late' ELSE 'submitted' END,
        v_is_late,
        false, -- Will be updated based on breaches
        v_user_id,
        NOW()
    )
    RETURNING id INTO v_submission_id;

    -- Task 1.1.5.5 & 1.1.5.5a: Detect and create breaches automatically
    FOR v_breach IN 
        SELECT * FROM public.vci_detect_breaches(v_company_id, p_submission_data, p_week_ending_date)
    LOOP
        -- Task 1.1.5.6: Get breach reason and replenishment date from submission
        INSERT INTO public.breaches (
            sku_id,
            company_id,
            wsl_submission_id,
            threshold_id,
            stock_level,
            threshold_value,
            breach_date,
            breach_reason,
            replenishment_date,
            priority,
            status
        )
        SELECT
            v_breach.sku_id,
            v_company_id,
            v_submission_id,
            v_breach.threshold_id,
            v_breach.stock_level,
            v_breach.threshold_value,
            p_week_ending_date,
            (item->>'breach_reason'),
            (item->>'replenishment_date')::DATE,
            v_breach.priority,
            'detected'
        FROM jsonb_array_elements(p_submission_data) AS item
        WHERE (item->>'sku_id')::UUID = v_breach.sku_id
        RETURNING id INTO v_breach_id;

        v_breaches_created := v_breaches_created + 1;
    END LOOP;

    -- Update non-compliant status if breaches detected
    IF v_breaches_created > 0 THEN
        UPDATE public.wsl_submissions
        SET is_non_compliant = true,
            status = CASE WHEN v_is_late THEN 'non_compliant' ELSE status END
        WHERE id = v_submission_id;
    END IF;

    -- Create approval record
    INSERT INTO public.approvals (
        entity_type,
        entity_id,
        action,
        requested_by,
        status,
        notes
    ) VALUES (
        'wsl_submission',
        v_submission_id,
        'submit',
        v_user_id,
        'approved',
        format('WSL submitted. %s breach(es) detected.', v_breaches_created)
    );

    RETURN jsonb_build_object(
        'success', true,
        'submission_id', v_submission_id,
        'is_late', v_is_late,
        'breaches_detected', v_breaches_created
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- Task 1.1.5.3a: MOH Request for WSL SKU Adjustments
-- ============================================================================

CREATE OR REPLACE FUNCTION public.vci_request_wsl_adjustment(
    p_company_id UUID,
    p_sku_ids UUID[],
    p_reason TEXT,
    p_due_date DATE
) RETURNS JSONB AS $$
DECLARE
    v_user_id UUID;
    v_user_role TEXT;
    v_request_id UUID;
BEGIN
    -- Get current user
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RETURN jsonb_build_object('success', false, 'error', 'Not authenticated');
    END IF;

    -- Verify MOH role
    SELECT u.role INTO v_user_role
    FROM public.users u
    WHERE u.id = v_user_id;

    IF v_user_role NOT IN ('tier1', 'tier2_officer') THEN
        RETURN jsonb_build_object('success', false, 'error', 'Only MOH Tier 1 or Tier 2 can request adjustments');
    END IF;

    IF p_reason IS NULL OR length(trim(p_reason)) < 10 THEN
        RETURN jsonb_build_object('success', false, 'error', 'Reason must be at least 10 characters');
    END IF;

    -- Create notification for company
    INSERT INTO public.notifications (
        user_id,
        title,
        message,
        type,
        data
    )
    SELECT
        u.id,
        'WSL Adjustment Request',
        format('MOH has requested updated stock levels for %s SKU(s). Due: %s', 
            array_length(p_sku_ids, 1), p_due_date),
        'wsl_adjustment_request',
        jsonb_build_object(
            'sku_ids', p_sku_ids,
            'reason', p_reason,
            'due_date', p_due_date,
            'requested_by', v_user_id
        )
    FROM public.users u
    WHERE u.company_id = p_company_id
      AND u.role IN ('company_admin', 'company_manager');

    RETURN jsonb_build_object(
        'success', true,
        'company_id', p_company_id,
        'sku_count', array_length(p_sku_ids, 1),
        'due_date', p_due_date
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- Task 1.1.5.11: Breach Analysis Deadline Logic
-- ============================================================================

CREATE OR REPLACE FUNCTION public.vci_get_breach_analysis_deadline(
    p_breach_id UUID
) RETURNS JSONB AS $$
DECLARE
    v_breach RECORD;
    v_deadline DATE;
    v_working_days INTEGER;
BEGIN
    SELECT b.*, 
           EXISTS(SELECT 1 FROM public.critical_medicines cm 
                  WHERE cm.sku_id = b.sku_id AND cm.is_current = true) as is_critical
    INTO v_breach
    FROM public.breaches b
    WHERE b.id = p_breach_id;

    IF v_breach IS NULL THEN
        RETURN jsonb_build_object('success', false, 'error', 'Breach not found');
    END IF;

    -- Task 1.1.5.11: 3 working days standard, 1 working day critical
    IF v_breach.is_critical OR v_breach.priority = 'critical' THEN
        v_working_days := 1;
    ELSE
        v_working_days := 3;
    END IF;

    -- Calculate deadline (simple: add days, skip weekends)
    v_deadline := v_breach.breach_date;
    WHILE v_working_days > 0 LOOP
        v_deadline := v_deadline + 1;
        -- Skip weekends (0 = Sunday, 6 = Saturday)
        IF EXTRACT(DOW FROM v_deadline) NOT IN (0, 6) THEN
            v_working_days := v_working_days - 1;
        END IF;
    END LOOP;

    RETURN jsonb_build_object(
        'success', true,
        'breach_id', p_breach_id,
        'priority', v_breach.priority,
        'is_critical', v_breach.is_critical,
        'deadline', v_deadline,
        'working_days_allowed', CASE WHEN v_breach.is_critical OR v_breach.priority = 'critical' THEN 1 ELSE 3 END,
        'is_overdue', CURRENT_DATE > v_deadline
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- Task 1.1.5.8 & 1.1.5.8a: Breach Analysis
-- ============================================================================

CREATE OR REPLACE FUNCTION public.vci_analyze_breach(
    p_breach_id UUID,
    p_suggested_action TEXT,
    p_suggested_action_details TEXT DEFAULT NULL,
    p_analysis_notes TEXT DEFAULT NULL
) RETURNS JSONB AS $$
DECLARE
    v_user_id UUID;
    v_user_role TEXT;
    v_breach RECORD;
    v_analysis_id UUID;
    v_deadline_info JSONB;
BEGIN
    -- Get current user
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RETURN jsonb_build_object('success', false, 'error', 'Not authenticated');
    END IF;

    -- Verify Tier 2 role
    SELECT u.role INTO v_user_role
    FROM public.users u
    WHERE u.id = v_user_id;

    IF v_user_role NOT IN ('tier2_officer', 'tier2_registrar') THEN
        RETURN jsonb_build_object('success', false, 'error', 'Only Tier 2 officers can analyze breaches');
    END IF;

    -- Get breach
    SELECT * INTO v_breach
    FROM public.breaches
    WHERE id = p_breach_id;

    IF v_breach IS NULL THEN
        RETURN jsonb_build_object('success', false, 'error', 'Breach not found');
    END IF;

    IF v_breach.status NOT IN ('detected', 'tier2_analyzing') THEN
        RETURN jsonb_build_object('success', false, 'error', 'Breach cannot be analyzed in current status');
    END IF;

    -- Validate suggested action
    IF p_suggested_action NOT IN ('warning', 'fine', 'suspension', 'no_action', 'refer_to_tier1') THEN
        RETURN jsonb_build_object('success', false, 'error', 'Invalid suggested action');
    END IF;

    -- Check deadline
    v_deadline_info := public.vci_get_breach_analysis_deadline(p_breach_id);
    
    -- Create analysis record
    INSERT INTO public.breach_analyses (
        breach_id,
        analyzed_by,
        suggested_action,
        suggested_action_details,
        analysis_notes,
        analyzed_at
    ) VALUES (
        p_breach_id,
        v_user_id,
        p_suggested_action,
        p_suggested_action_details,
        p_analysis_notes,
        NOW()
    )
    RETURNING id INTO v_analysis_id;

    -- Update breach status
    UPDATE public.breaches
    SET status = 'tier2_suggested',
        updated_at = NOW()
    WHERE id = p_breach_id;

    -- Create approval record
    INSERT INTO public.approvals (
        entity_type,
        entity_id,
        action,
        requested_by,
        status,
        notes
    ) VALUES (
        'breach',
        p_breach_id,
        'analyze',
        v_user_id,
        'approved',
        format('Analysis: %s', p_suggested_action)
    );

    RETURN jsonb_build_object(
        'success', true,
        'analysis_id', v_analysis_id,
        'breach_id', p_breach_id,
        'suggested_action', p_suggested_action,
        'is_overdue', (v_deadline_info->>'is_overdue')::BOOLEAN
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Task 1.1.5.8a: Batch breach analysis
CREATE OR REPLACE FUNCTION public.vci_analyze_breaches_batch(
    p_breach_ids UUID[],
    p_suggested_action TEXT,
    p_suggested_action_details TEXT DEFAULT NULL,
    p_analysis_notes TEXT DEFAULT NULL
) RETURNS JSONB AS $$
DECLARE
    v_user_id UUID;
    v_user_role TEXT;
    v_breach_id UUID;
    v_result JSONB;
    v_analyzed INTEGER := 0;
    v_failed INTEGER := 0;
    v_results JSONB := '[]'::JSONB;
BEGIN
    -- Get current user
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RETURN jsonb_build_object('success', false, 'error', 'Not authenticated');
    END IF;

    -- Verify Tier 2 role
    SELECT u.role INTO v_user_role
    FROM public.users u
    WHERE u.id = v_user_id;

    IF v_user_role NOT IN ('tier2_officer', 'tier2_registrar') THEN
        RETURN jsonb_build_object('success', false, 'error', 'Only Tier 2 officers can analyze breaches');
    END IF;

    -- Process each breach
    FOREACH v_breach_id IN ARRAY p_breach_ids
    LOOP
        v_result := public.vci_analyze_breach(
            v_breach_id,
            p_suggested_action,
            p_suggested_action_details,
            p_analysis_notes
        );

        IF (v_result->>'success')::BOOLEAN THEN
            v_analyzed := v_analyzed + 1;
        ELSE
            v_failed := v_failed + 1;
        END IF;

        v_results := v_results || jsonb_build_object(
            'breach_id', v_breach_id,
            'success', (v_result->>'success')::BOOLEAN,
            'error', v_result->>'error'
        );
    END LOOP;

    RETURN jsonb_build_object(
        'success', v_failed = 0,
        'analyzed', v_analyzed,
        'failed', v_failed,
        'results', v_results
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- Task 1.1.5.9: Breach Action Suggestion
-- ============================================================================

CREATE OR REPLACE FUNCTION public.vci_suggest_breach_action(
    p_breach_id UUID
) RETURNS JSONB AS $$
DECLARE
    v_breach RECORD;
    v_prior_breaches INTEGER;
    v_is_critical BOOLEAN;
    v_shortage_percent NUMERIC;
    v_suggestions JSONB := '[]'::JSONB;
BEGIN
    -- Get breach details
    SELECT b.*, 
           EXISTS(SELECT 1 FROM public.critical_medicines cm 
                  WHERE cm.sku_id = b.sku_id AND cm.is_current = true) as is_critical_medicine
    INTO v_breach
    FROM public.breaches b
    WHERE b.id = p_breach_id;

    IF v_breach IS NULL THEN
        RETURN jsonb_build_object('success', false, 'error', 'Breach not found');
    END IF;

    -- Count prior breaches for this company/SKU (last 12 months)
    SELECT COUNT(*) INTO v_prior_breaches
    FROM public.breaches
    WHERE company_id = v_breach.company_id
      AND sku_id = v_breach.sku_id
      AND id != p_breach_id
      AND breach_date >= (v_breach.breach_date - INTERVAL '12 months');

    -- Calculate shortage percentage
    IF v_breach.threshold_value > 0 THEN
        v_shortage_percent := (1 - (v_breach.stock_level / v_breach.threshold_value)) * 100;
    ELSE
        v_shortage_percent := 0;
    END IF;

    v_is_critical := v_breach.is_critical_medicine OR v_breach.priority = 'critical';

    -- Generate suggestions based on rules
    -- Rule 1: First-time minor breach - warning
    IF v_prior_breaches = 0 AND v_shortage_percent < 30 AND NOT v_is_critical THEN
        v_suggestions := v_suggestions || jsonb_build_object(
            'action', 'warning',
            'reason', 'First-time minor shortage',
            'confidence', 'high'
        );
    END IF;

    -- Rule 2: Repeat offender - fine
    IF v_prior_breaches >= 2 THEN
        v_suggestions := v_suggestions || jsonb_build_object(
            'action', 'fine',
            'reason', format('%s prior breaches in last 12 months', v_prior_breaches),
            'confidence', 'high'
        );
    END IF;

    -- Rule 3: Critical medicine breach - refer to Tier 1
    IF v_is_critical THEN
        v_suggestions := v_suggestions || jsonb_build_object(
            'action', 'refer_to_tier1',
            'reason', 'Critical medicine requires Tier 1 review',
            'confidence', 'high'
        );
    END IF;

    -- Rule 4: Severe shortage (>50%) - suspension consideration
    IF v_shortage_percent > 50 THEN
        v_suggestions := v_suggestions || jsonb_build_object(
            'action', 'suspension',
            'reason', format('Severe shortage of %.1f%%', v_shortage_percent),
            'confidence', 'medium'
        );
    END IF;

    -- Rule 5: Replenishment date provided - reduced action
    IF v_breach.replenishment_date IS NOT NULL AND v_breach.replenishment_date <= (CURRENT_DATE + INTERVAL '14 days') THEN
        v_suggestions := v_suggestions || jsonb_build_object(
            'action', 'warning',
            'reason', 'Replenishment expected within 2 weeks',
            'confidence', 'medium'
        );
    END IF;

    -- Default suggestion if none generated
    IF jsonb_array_length(v_suggestions) = 0 THEN
        v_suggestions := v_suggestions || jsonb_build_object(
            'action', 'warning',
            'reason', 'Standard first response',
            'confidence', 'medium'
        );
    END IF;

    RETURN jsonb_build_object(
        'success', true,
        'breach_id', p_breach_id,
        'priority', v_breach.priority,
        'is_critical', v_is_critical,
        'shortage_percent', v_shortage_percent,
        'prior_breaches', v_prior_breaches,
        'suggestions', v_suggestions
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- Task 1.1.5.10 & 1.1.5.10a: Breach Action Approval
-- ============================================================================

CREATE OR REPLACE FUNCTION public.vci_approve_breach_action(
    p_breach_id UUID,
    p_approve BOOLEAN,
    p_action_taken TEXT DEFAULT NULL,
    p_notes TEXT DEFAULT NULL
) RETURNS JSONB AS $$
DECLARE
    v_user_id UUID;
    v_user_role TEXT;
    v_breach RECORD;
    v_analysis RECORD;
    v_rejection_count INTEGER;
BEGIN
    -- Get current user
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RETURN jsonb_build_object('success', false, 'error', 'Not authenticated');
    END IF;

    -- Verify Tier 1 role
    SELECT u.role INTO v_user_role
    FROM public.users u
    WHERE u.id = v_user_id;

    IF v_user_role != 'tier1' THEN
        RETURN jsonb_build_object('success', false, 'error', 'Only Tier 1 can approve breach actions');
    END IF;

    -- Get breach
    SELECT * INTO v_breach
    FROM public.breaches
    WHERE id = p_breach_id;

    IF v_breach IS NULL THEN
        RETURN jsonb_build_object('success', false, 'error', 'Breach not found');
    END IF;

    IF v_breach.status NOT IN ('tier2_suggested', 'tier1_reviewed') THEN
        RETURN jsonb_build_object('success', false, 'error', 'Breach must have Tier 2 suggestion first');
    END IF;

    -- Get latest analysis
    SELECT * INTO v_analysis
    FROM public.breach_analyses
    WHERE breach_id = p_breach_id
    ORDER BY analyzed_at DESC
    LIMIT 1;

    -- Task 1.1.5.10a: Check rejection iteration count
    SELECT COUNT(*) INTO v_rejection_count
    FROM public.approvals
    WHERE entity_type = 'breach'
      AND entity_id = p_breach_id
      AND action = 'review'
      AND status = 'rejected';

    IF NOT p_approve AND v_rejection_count >= 2 THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'Maximum rejection iterations (2) reached. Tier 1 must take direct action.',
            'rejection_count', v_rejection_count,
            'requires_direct_action', true
        );
    END IF;

    IF p_approve THEN
        -- Approve and take action
        UPDATE public.breaches
        SET status = 'action_taken',
            updated_at = NOW()
        WHERE id = p_breach_id;

        -- Create approval record
        INSERT INTO public.approvals (
            entity_type,
            entity_id,
            action,
            requested_by,
            reviewed_by,
            reviewed_at,
            status,
            notes
        ) VALUES (
            'breach',
            p_breach_id,
            'approve_action',
            v_analysis.analyzed_by,
            v_user_id,
            NOW(),
            'approved',
            COALESCE(p_notes, format('Approved action: %s', COALESCE(p_action_taken, v_analysis.suggested_action)))
        );
    ELSE
        -- Reject - send back to Tier 2
        UPDATE public.breaches
        SET status = 'tier2_analyzing',
            updated_at = NOW()
        WHERE id = p_breach_id;

        -- Create rejection record
        INSERT INTO public.approvals (
            entity_type,
            entity_id,
            action,
            requested_by,
            reviewed_by,
            reviewed_at,
            status,
            notes
        ) VALUES (
            'breach',
            p_breach_id,
            'review',
            v_analysis.analyzed_by,
            v_user_id,
            NOW(),
            'rejected',
            COALESCE(p_notes, 'Action suggestion rejected - please re-analyze')
        );
    END IF;

    RETURN jsonb_build_object(
        'success', true,
        'breach_id', p_breach_id,
        'approved', p_approve,
        'new_status', CASE WHEN p_approve THEN 'action_taken' ELSE 'tier2_analyzing' END,
        'rejection_count', CASE WHEN p_approve THEN v_rejection_count ELSE v_rejection_count + 1 END
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Tier 1 direct action (when max rejections reached)
CREATE OR REPLACE FUNCTION public.vci_tier1_direct_action(
    p_breach_id UUID,
    p_action TEXT,
    p_action_details TEXT,
    p_notes TEXT DEFAULT NULL
) RETURNS JSONB AS $$
DECLARE
    v_user_id UUID;
    v_user_role TEXT;
    v_breach RECORD;
BEGIN
    -- Get current user
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RETURN jsonb_build_object('success', false, 'error', 'Not authenticated');
    END IF;

    -- Verify Tier 1 role
    SELECT u.role INTO v_user_role
    FROM public.users u
    WHERE u.id = v_user_id;

    IF v_user_role != 'tier1' THEN
        RETURN jsonb_build_object('success', false, 'error', 'Only Tier 1 can take direct action');
    END IF;

    -- Validate action
    IF p_action NOT IN ('warning', 'fine', 'suspension', 'no_action') THEN
        RETURN jsonb_build_object('success', false, 'error', 'Invalid action type');
    END IF;

    -- Get breach
    SELECT * INTO v_breach
    FROM public.breaches
    WHERE id = p_breach_id;

    IF v_breach IS NULL THEN
        RETURN jsonb_build_object('success', false, 'error', 'Breach not found');
    END IF;

    -- Update breach
    UPDATE public.breaches
    SET status = 'action_taken',
        updated_at = NOW()
    WHERE id = p_breach_id;

    -- Create direct action record
    INSERT INTO public.breach_analyses (
        breach_id,
        analyzed_by,
        suggested_action,
        suggested_action_details,
        analysis_notes,
        analyzed_at
    ) VALUES (
        p_breach_id,
        v_user_id,
        p_action,
        p_action_details,
        format('Tier 1 Direct Action: %s', COALESCE(p_notes, '')),
        NOW()
    );

    -- Create approval record
    INSERT INTO public.approvals (
        entity_type,
        entity_id,
        action,
        requested_by,
        reviewed_by,
        reviewed_at,
        status,
        notes
    ) VALUES (
        'breach',
        p_breach_id,
        'direct_action',
        v_user_id,
        v_user_id,
        NOW(),
        'approved',
        format('Tier 1 Direct Action: %s - %s', p_action, COALESCE(p_action_details, ''))
    );

    RETURN jsonb_build_object(
        'success', true,
        'breach_id', p_breach_id,
        'action', p_action,
        'new_status', 'action_taken'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- Task 1.1.5.12 & 1.1.5.12a: Scheduled WSL Deadline Check
-- ============================================================================

CREATE OR REPLACE FUNCTION public.vci_check_wsl_deadlines()
RETURNS JSONB AS $$
DECLARE
    v_current_friday DATE;
    v_companies_missing INTEGER := 0;
    v_notifications_sent INTEGER := 0;
    v_company RECORD;
BEGIN
    -- Get current week's Friday
    v_current_friday := CURRENT_DATE - EXTRACT(DOW FROM CURRENT_DATE)::INTEGER + 5;
    
    -- If today is after Friday, use this week's Friday
    IF CURRENT_DATE > v_current_friday THEN
        v_current_friday := v_current_friday + 7;
    END IF;

    -- Find companies without WSL submission for this week
    FOR v_company IN
        SELECT c.id, c.name
        FROM public.companies c
        WHERE c.is_active = true
          AND c.company_type = 'ipc'
          AND NOT EXISTS (
              SELECT 1 FROM public.wsl_submissions ws
              WHERE ws.company_id = c.id
                AND ws.week_ending_date = v_current_friday
          )
    LOOP
        v_companies_missing := v_companies_missing + 1;

        -- Send notification to company users
        INSERT INTO public.notifications (
            user_id,
            title,
            message,
            type,
            data
        )
        SELECT
            u.id,
            'WSL Submission Reminder',
            format('Weekly Stock Level submission for week ending %s is due. Please submit before 17:00 today.', v_current_friday),
            'wsl_reminder',
            jsonb_build_object(
                'week_ending_date', v_current_friday,
                'company_id', v_company.id
            )
        FROM public.users u
        WHERE u.company_id = v_company.id
          AND u.role IN ('company_admin', 'company_manager')
          AND u.is_active = true;

        GET DIAGNOSTICS v_notifications_sent = ROW_COUNT + v_notifications_sent;
    END LOOP;

    RETURN jsonb_build_object(
        'success', true,
        'check_date', CURRENT_DATE,
        'week_ending_date', v_current_friday,
        'companies_missing', v_companies_missing,
        'notifications_sent', v_notifications_sent
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- Helper Functions for WSL and Breaches List/Get
-- ============================================================================

CREATE OR REPLACE FUNCTION public.vci_list_wsl_submissions(
    p_company_id UUID DEFAULT NULL,
    p_week_ending_date DATE DEFAULT NULL,
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

    -- Get total
    SELECT COUNT(*) INTO v_total
    FROM public.wsl_submissions ws
    WHERE (p_company_id IS NULL OR ws.company_id = p_company_id)
      AND (p_week_ending_date IS NULL OR ws.week_ending_date = p_week_ending_date)
      AND (p_status IS NULL OR ws.status = p_status);

    -- Get submissions
    SELECT jsonb_agg(sub ORDER BY sub.week_ending_date DESC) INTO v_submissions
    FROM (
        SELECT 
            ws.id,
            ws.company_id,
            c.name as company_name,
            ws.week_ending_date,
            ws.status,
            ws.is_late,
            ws.is_non_compliant,
            jsonb_array_length(ws.submission_data) as sku_count,
            (SELECT COUNT(*) FROM public.breaches b WHERE b.wsl_submission_id = ws.id) as breach_count,
            ws.submitted_by,
            u.full_name as submitted_by_name,
            ws.submitted_at,
            ws.created_at
        FROM public.wsl_submissions ws
        JOIN public.companies c ON c.id = ws.company_id
        LEFT JOIN public.users u ON u.id = ws.submitted_by
        WHERE (p_company_id IS NULL OR ws.company_id = p_company_id)
          AND (p_week_ending_date IS NULL OR ws.week_ending_date = p_week_ending_date)
          AND (p_status IS NULL OR ws.status = p_status)
        ORDER BY ws.week_ending_date DESC
        LIMIT p_limit
        OFFSET p_offset
    ) sub;

    RETURN jsonb_build_object(
        'success', true,
        'submissions', COALESCE(v_submissions, '[]'::JSONB),
        'total', v_total
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.vci_list_breaches(
    p_company_id UUID DEFAULT NULL,
    p_sku_id UUID DEFAULT NULL,
    p_status TEXT DEFAULT NULL,
    p_priority TEXT DEFAULT NULL,
    p_limit INTEGER DEFAULT 50,
    p_offset INTEGER DEFAULT 0
) RETURNS JSONB AS $$
DECLARE
    v_user_id UUID;
    v_user_role TEXT;
    v_user_company_id UUID;
    v_breaches JSONB;
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

    -- Get total
    SELECT COUNT(*) INTO v_total
    FROM public.breaches b
    WHERE (p_company_id IS NULL OR b.company_id = p_company_id)
      AND (p_sku_id IS NULL OR b.sku_id = p_sku_id)
      AND (p_status IS NULL OR b.status = p_status)
      AND (p_priority IS NULL OR b.priority = p_priority);

    -- Get breaches
    SELECT jsonb_agg(sub ORDER BY sub.breach_date DESC) INTO v_breaches
    FROM (
        SELECT 
            b.id,
            b.sku_id,
            s.name as sku_name,
            s.sku_code,
            b.company_id,
            c.name as company_name,
            b.wsl_submission_id,
            b.threshold_id,
            b.stock_level,
            b.threshold_value,
            b.breach_date,
            b.breach_reason,
            b.replenishment_date,
            b.priority,
            b.status,
            EXISTS(SELECT 1 FROM public.critical_medicines cm 
                   WHERE cm.sku_id = b.sku_id AND cm.is_current = true) as is_critical_medicine,
            b.created_at,
            b.updated_at
        FROM public.breaches b
        JOIN public.skus s ON s.id = b.sku_id
        JOIN public.companies c ON c.id = b.company_id
        WHERE (p_company_id IS NULL OR b.company_id = p_company_id)
          AND (p_sku_id IS NULL OR b.sku_id = p_sku_id)
          AND (p_status IS NULL OR b.status = p_status)
          AND (p_priority IS NULL OR b.priority = p_priority)
        ORDER BY b.breach_date DESC
        LIMIT p_limit
        OFFSET p_offset
    ) sub;

    RETURN jsonb_build_object(
        'success', true,
        'breaches', COALESCE(v_breaches, '[]'::JSONB),
        'total', v_total
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.vci_get_breach(
    p_breach_id UUID
) RETURNS JSONB AS $$
DECLARE
    v_user_id UUID;
    v_user_role TEXT;
    v_user_company_id UUID;
    v_breach JSONB;
    v_analyses JSONB;
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

    -- Get breach
    SELECT jsonb_build_object(
        'id', b.id,
        'sku_id', b.sku_id,
        'sku_name', s.name,
        'sku_code', s.sku_code,
        'dosage_strength', s.dosage_strength,
        'dosage_form', s.dosage_form,
        'company_id', b.company_id,
        'company_name', c.name,
        'wsl_submission_id', b.wsl_submission_id,
        'threshold_id', b.threshold_id,
        'stock_level', b.stock_level,
        'threshold_value', b.threshold_value,
        'shortage_percent', CASE WHEN b.threshold_value > 0 
            THEN ROUND((1 - (b.stock_level / b.threshold_value)) * 100, 1)
            ELSE 0 END,
        'breach_date', b.breach_date,
        'breach_reason', b.breach_reason,
        'replenishment_date', b.replenishment_date,
        'priority', b.priority,
        'status', b.status,
        'is_critical_medicine', EXISTS(SELECT 1 FROM public.critical_medicines cm 
                                       WHERE cm.sku_id = b.sku_id AND cm.is_current = true),
        'created_at', b.created_at,
        'updated_at', b.updated_at
    ) INTO v_breach
    FROM public.breaches b
    JOIN public.skus s ON s.id = b.sku_id
    JOIN public.companies c ON c.id = b.company_id
    WHERE b.id = p_breach_id;

    IF v_breach IS NULL THEN
        RETURN jsonb_build_object('success', false, 'error', 'Breach not found');
    END IF;

    -- Company users can only view their own
    IF v_user_role IN ('company_admin', 'company_manager', 'company_user') THEN
        IF (v_breach->>'company_id')::UUID != v_user_company_id THEN
            RETURN jsonb_build_object('success', false, 'error', 'Access denied');
        END IF;
    END IF;

    -- Get analyses
    SELECT jsonb_agg(sub ORDER BY sub.analyzed_at DESC) INTO v_analyses
    FROM (
        SELECT 
            ba.id,
            ba.analyzed_by,
            u.full_name as analyzed_by_name,
            ba.suggested_action,
            ba.suggested_action_details,
            ba.analysis_notes,
            ba.analyzed_at
        FROM public.breach_analyses ba
        LEFT JOIN public.users u ON u.id = ba.analyzed_by
        WHERE ba.breach_id = p_breach_id
        ORDER BY ba.analyzed_at DESC
    ) sub;

    RETURN jsonb_build_object(
        'success', true,
        'breach', v_breach,
        'analyses', COALESCE(v_analyses, '[]'::JSONB),
        'deadline_info', public.vci_get_breach_analysis_deadline(p_breach_id)
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.vci_get_wsl_deadline(DATE) TO authenticated;
GRANT EXECUTE ON FUNCTION public.vci_is_wsl_late(DATE, TIMESTAMPTZ) TO authenticated;
GRANT EXECUTE ON FUNCTION public.vci_validate_week_ending_date(DATE) TO authenticated;
GRANT EXECUTE ON FUNCTION public.vci_validate_wsl_completeness(UUID, JSONB) TO authenticated;
GRANT EXECUTE ON FUNCTION public.vci_calculate_breach_priority(UUID, NUMERIC, NUMERIC) TO authenticated;
GRANT EXECUTE ON FUNCTION public.vci_detect_breaches(UUID, JSONB, DATE) TO authenticated;
GRANT EXECUTE ON FUNCTION public.vci_submit_wsl(DATE, JSONB) TO authenticated;
GRANT EXECUTE ON FUNCTION public.vci_request_wsl_adjustment(UUID, UUID[], TEXT, DATE) TO authenticated;
GRANT EXECUTE ON FUNCTION public.vci_get_breach_analysis_deadline(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.vci_analyze_breach(UUID, TEXT, TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.vci_analyze_breaches_batch(UUID[], TEXT, TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.vci_suggest_breach_action(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.vci_approve_breach_action(UUID, BOOLEAN, TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.vci_tier1_direct_action(UUID, TEXT, TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.vci_check_wsl_deadlines() TO authenticated;
GRANT EXECUTE ON FUNCTION public.vci_list_wsl_submissions(UUID, DATE, TEXT, INTEGER, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION public.vci_list_breaches(UUID, UUID, TEXT, TEXT, INTEGER, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION public.vci_get_breach(UUID) TO authenticated;

-- Comments for documentation
COMMENT ON FUNCTION public.vci_submit_wsl IS 'Task 1.1.5.1: Submit Weekly Stock Levels with automatic breach detection';
COMMENT ON FUNCTION public.vci_validate_wsl_completeness IS 'Task 1.1.5.2: WSL validation - all SKUs required';
COMMENT ON FUNCTION public.vci_is_wsl_late IS 'Task 1.1.5.3: WSL deadline validation (Friday 17:00 Morocco)';
COMMENT ON FUNCTION public.vci_request_wsl_adjustment IS 'Task 1.1.5.3a: MOH request for WSL SKU adjustments';
COMMENT ON FUNCTION public.vci_detect_breaches IS 'Task 1.1.5.4: Breach detection (stock vs threshold)';
COMMENT ON FUNCTION public.vci_calculate_breach_priority IS 'Task 1.1.5.7: Breach priority logic';
COMMENT ON FUNCTION public.vci_analyze_breach IS 'Task 1.1.5.8: Breach analysis';
COMMENT ON FUNCTION public.vci_analyze_breaches_batch IS 'Task 1.1.5.8a: Batch breach analysis';
COMMENT ON FUNCTION public.vci_suggest_breach_action IS 'Task 1.1.5.9: Breach action suggestion';
COMMENT ON FUNCTION public.vci_approve_breach_action IS 'Task 1.1.5.10: Breach action approval with iteration limit';
COMMENT ON FUNCTION public.vci_get_breach_analysis_deadline IS 'Task 1.1.5.11: Breach analysis deadline (3d/1d critical)';
COMMENT ON FUNCTION public.vci_check_wsl_deadlines IS 'Task 1.1.5.12: Scheduled WSL deadline check';

/*
Task 1.1.5.12a: pg_cron Setup for WSL Deadline Check

To set up the scheduled job, run these commands as superuser:

-- Enable pg_cron extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Schedule WSL deadline check for Friday at 17:00 Morocco time
SELECT cron.schedule(
    'wsl-deadline-check',
    '0 17 * * 5', -- Every Friday at 17:00
    $$SELECT public.vci_check_wsl_deadlines()$$
);

-- Verify job is scheduled
SELECT * FROM cron.job WHERE jobname = 'wsl-deadline-check';

Note: pg_cron uses UTC. Morocco time is UTC+01:00, so adjust cron expression accordingly:
- If Morocco is UTC+01:00, use '0 16 * * 5' for 17:00 Morocco time
- During DST (UTC+00:00), use '0 17 * * 5'

For timezone-aware scheduling, consider using a wrapper function that handles timezone conversion.
*/
