-- VCI MSQ RPC Functions Migration
-- Implements Tasks 1.1.4.1 through 1.1.4.7

-- ============================================================================
-- Task 1.1.4.2: MSQ Validation Logic
-- ============================================================================

-- Helper: Check MSQ completeness and format
CREATE OR REPLACE FUNCTION public.vci_validate_msq_format(
    p_submission_data JSONB
) RETURNS JSONB AS $$
DECLARE
    v_flags JSONB := '[]'::JSONB;
    v_item JSONB;
    v_sku_id UUID;
    v_quantity NUMERIC;
    v_sku_exists BOOLEAN;
BEGIN
    -- Check if submission_data is an array
    IF jsonb_typeof(p_submission_data) != 'array' THEN
        v_flags := v_flags || jsonb_build_object(
            'type', 'error',
            'code', 'INVALID_FORMAT',
            'message', 'Submission data must be an array of SKU quantities'
        );
        RETURN v_flags;
    END IF;

    -- Check if array is empty
    IF jsonb_array_length(p_submission_data) = 0 THEN
        v_flags := v_flags || jsonb_build_object(
            'type', 'error',
            'code', 'EMPTY_SUBMISSION',
            'message', 'Submission must contain at least one SKU entry'
        );
        RETURN v_flags;
    END IF;

    -- Validate each item
    FOR v_item IN SELECT * FROM jsonb_array_elements(p_submission_data)
    LOOP
        -- Check required fields
        IF NOT (v_item ? 'sku_id' AND v_item ? 'quantity') THEN
            v_flags := v_flags || jsonb_build_object(
                'type', 'error',
                'code', 'MISSING_FIELDS',
                'message', 'Each entry must have sku_id and quantity'
            );
            CONTINUE;
        END IF;

        v_sku_id := (v_item->>'sku_id')::UUID;
        v_quantity := (v_item->>'quantity')::NUMERIC;

        -- Check SKU exists
        SELECT EXISTS(SELECT 1 FROM public.skus WHERE id = v_sku_id AND is_active = true)
        INTO v_sku_exists;

        IF NOT v_sku_exists THEN
            v_flags := v_flags || jsonb_build_object(
                'type', 'error',
                'code', 'INVALID_SKU',
                'message', format('SKU %s does not exist or is inactive', v_sku_id),
                'sku_id', v_sku_id
            );
        END IF;

        -- Check quantity is valid
        IF v_quantity IS NULL OR v_quantity < 0 THEN
            v_flags := v_flags || jsonb_build_object(
                'type', 'error',
                'code', 'INVALID_QUANTITY',
                'message', format('Quantity must be a non-negative number for SKU %s', v_sku_id),
                'sku_id', v_sku_id
            );
        END IF;
    END LOOP;

    RETURN v_flags;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper: Check historical patterns (compare with previous months)
CREATE OR REPLACE FUNCTION public.vci_validate_msq_historical(
    p_company_id UUID,
    p_year INTEGER,
    p_month INTEGER,
    p_submission_data JSONB
) RETURNS JSONB AS $$
DECLARE
    v_flags JSONB := '[]'::JSONB;
    v_item JSONB;
    v_sku_id UUID;
    v_quantity NUMERIC;
    v_prev_quantity NUMERIC;
    v_prev_submission RECORD;
    v_deviation NUMERIC;
BEGIN
    -- Get previous month's submission
    SELECT ms.* INTO v_prev_submission
    FROM public.msq_submissions ms
    WHERE ms.company_id = p_company_id
      AND (
          (ms.year = p_year AND ms.month = p_month - 1) OR
          (ms.year = p_year - 1 AND ms.month = 12 AND p_month = 1)
      )
      AND ms.status IN ('accepted', 'submitted')
    ORDER BY ms.created_at DESC
    LIMIT 1;

    IF v_prev_submission IS NULL THEN
        -- No previous submission to compare
        RETURN v_flags;
    END IF;

    -- Compare each SKU quantity with previous month
    FOR v_item IN SELECT * FROM jsonb_array_elements(p_submission_data)
    LOOP
        v_sku_id := (v_item->>'sku_id')::UUID;
        v_quantity := (v_item->>'quantity')::NUMERIC;

        -- Get previous quantity for this SKU
        SELECT (elem->>'quantity')::NUMERIC INTO v_prev_quantity
        FROM jsonb_array_elements(v_prev_submission.submission_data) elem
        WHERE (elem->>'sku_id')::UUID = v_sku_id;

        IF v_prev_quantity IS NOT NULL AND v_prev_quantity > 0 THEN
            v_deviation := ABS(v_quantity - v_prev_quantity) / v_prev_quantity * 100;
            
            -- Flag significant deviations (>50% change)
            IF v_deviation > 50 THEN
                v_flags := v_flags || jsonb_build_object(
                    'type', 'warning',
                    'code', 'HISTORICAL_DEVIATION',
                    'message', format('Quantity for SKU changed by %.1f%% from previous month', v_deviation),
                    'sku_id', v_sku_id,
                    'current_quantity', v_quantity,
                    'previous_quantity', v_prev_quantity,
                    'deviation_percent', v_deviation
                );
            END IF;
        END IF;
    END LOOP;

    RETURN v_flags;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- Task 1.1.4.3: MSQ vs AAMS Validation (20% Threshold Anomaly Detection)
-- ============================================================================

CREATE OR REPLACE FUNCTION public.vci_validate_msq_vs_aams(
    p_company_id UUID,
    p_year INTEGER,
    p_submission_data JSONB
) RETURNS JSONB AS $$
DECLARE
    v_flags JSONB := '[]'::JSONB;
    v_item JSONB;
    v_sku_id UUID;
    v_msq_quantity NUMERIC;
    v_aams_monthly NUMERIC;
    v_deviation NUMERIC;
    v_aams_submission RECORD;
BEGIN
    -- Get approved AAMS for this year
    SELECT aa.* INTO v_aams_submission
    FROM public.aams_submissions aa
    WHERE aa.company_id = p_company_id
      AND aa.year = p_year
      AND aa.status IN ('approved', 'completed')
    ORDER BY aa.created_at DESC
    LIMIT 1;

    IF v_aams_submission IS NULL THEN
        v_flags := v_flags || jsonb_build_object(
            'type', 'info',
            'code', 'NO_AAMS',
            'message', 'No approved AAMS found for comparison'
        );
        RETURN v_flags;
    END IF;

    -- Compare each MSQ SKU with AAMS monthly average
    FOR v_item IN SELECT * FROM jsonb_array_elements(p_submission_data)
    LOOP
        v_sku_id := (v_item->>'sku_id')::UUID;
        v_msq_quantity := (v_item->>'quantity')::NUMERIC;

        -- Get AAMS monthly average for this SKU (annual / 12)
        SELECT (elem->>'quantity')::NUMERIC / 12.0 INTO v_aams_monthly
        FROM jsonb_array_elements(v_aams_submission.submission_data) elem
        WHERE (elem->>'sku_id')::UUID = v_sku_id;

        IF v_aams_monthly IS NOT NULL AND v_aams_monthly > 0 THEN
            v_deviation := ABS(v_msq_quantity - v_aams_monthly) / v_aams_monthly * 100;
            
            -- Flag if deviation exceeds 20%
            IF v_deviation > 20 THEN
                v_flags := v_flags || jsonb_build_object(
                    'type', 'anomaly',
                    'code', 'AAMS_DEVIATION',
                    'message', format('MSQ quantity deviates %.1f%% from AAMS monthly average (threshold: 20%%)', v_deviation),
                    'sku_id', v_sku_id,
                    'msq_quantity', v_msq_quantity,
                    'aams_monthly_avg', v_aams_monthly,
                    'deviation_percent', v_deviation
                );
            END IF;
        END IF;
    END LOOP;

    RETURN v_flags;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- Task 1.1.4.1: MSQ Submission RPC
-- ============================================================================

CREATE OR REPLACE FUNCTION public.vci_submit_msq(
    p_year INTEGER,
    p_month INTEGER,
    p_submission_data JSONB,
    p_correction_of UUID DEFAULT NULL
) RETURNS JSONB AS $$
DECLARE
    v_user_id UUID;
    v_company_id UUID;
    v_user_role TEXT;
    v_submission_id UUID;
    v_validation_flags JSONB := '[]'::JSONB;
    v_format_flags JSONB;
    v_historical_flags JSONB;
    v_aams_flags JSONB;
    v_has_errors BOOLEAN := false;
    v_has_anomalies BOOLEAN := false;
    v_existing_submission RECORD;
    v_status TEXT;
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

    -- Verify company user
    IF v_company_id IS NULL THEN
        RETURN jsonb_build_object('success', false, 'error', 'User must be associated with a company');
    END IF;

    IF v_user_role NOT IN ('company_admin', 'company_manager') THEN
        RETURN jsonb_build_object('success', false, 'error', 'Only company admin or manager can submit MSQ');
    END IF;

    -- Validate month
    IF p_month < 1 OR p_month > 12 THEN
        RETURN jsonb_build_object('success', false, 'error', 'Month must be between 1 and 12');
    END IF;

    -- Check for existing submission (if not a correction)
    IF p_correction_of IS NULL THEN
        SELECT * INTO v_existing_submission
        FROM public.msq_submissions
        WHERE company_id = v_company_id
          AND year = p_year
          AND month = p_month
          AND status NOT IN ('rejected');
        
        IF v_existing_submission IS NOT NULL THEN
            RETURN jsonb_build_object(
                'success', false, 
                'error', 'MSQ for this month already exists',
                'existing_id', v_existing_submission.id
            );
        END IF;
    END IF;

    -- Task 1.1.4.2: Validate format and completeness
    v_format_flags := public.vci_validate_msq_format(p_submission_data);
    v_validation_flags := v_validation_flags || v_format_flags;

    -- Check for errors
    SELECT EXISTS(
        SELECT 1 FROM jsonb_array_elements(v_format_flags) elem
        WHERE elem->>'type' = 'error'
    ) INTO v_has_errors;

    IF v_has_errors THEN
        RETURN jsonb_build_object(
            'success', false, 
            'error', 'Validation failed',
            'validation_flags', v_validation_flags
        );
    END IF;

    -- Task 1.1.4.2: Validate historical patterns
    v_historical_flags := public.vci_validate_msq_historical(v_company_id, p_year, p_month, p_submission_data);
    v_validation_flags := v_validation_flags || v_historical_flags;

    -- Task 1.1.4.3: Validate MSQ vs AAMS (20% threshold)
    v_aams_flags := public.vci_validate_msq_vs_aams(v_company_id, p_year, p_submission_data);
    v_validation_flags := v_validation_flags || v_aams_flags;

    -- Check for anomalies
    SELECT EXISTS(
        SELECT 1 FROM jsonb_array_elements(v_validation_flags) elem
        WHERE elem->>'type' = 'anomaly'
    ) INTO v_has_anomalies;

    -- Determine status based on validation
    IF v_has_anomalies THEN
        v_status := 'flagged_for_review';
    ELSE
        v_status := 'submitted';
    END IF;

    -- Create submission
    INSERT INTO public.msq_submissions (
        company_id,
        year,
        month,
        submission_data,
        status,
        validation_flags,
        correction_of,
        submitted_by,
        submitted_at
    ) VALUES (
        v_company_id,
        p_year,
        p_month,
        p_submission_data,
        v_status,
        v_validation_flags,
        p_correction_of,
        v_user_id,
        NOW()
    )
    RETURNING id INTO v_submission_id;

    -- Create approval record
    INSERT INTO public.approvals (
        entity_type,
        entity_id,
        action,
        requested_by,
        status,
        notes
    ) VALUES (
        'msq_submission',
        v_submission_id,
        'submit',
        v_user_id,
        'approved',
        'MSQ submitted'
    );

    RETURN jsonb_build_object(
        'success', true,
        'submission_id', v_submission_id,
        'status', v_status,
        'validation_flags', v_validation_flags,
        'has_anomalies', v_has_anomalies
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- Task 1.1.4.4: MSQ Flag for Review
-- ============================================================================

CREATE OR REPLACE FUNCTION public.vci_flag_msq_for_review(
    p_submission_id UUID,
    p_reason TEXT,
    p_flag_details JSONB DEFAULT NULL
) RETURNS JSONB AS $$
DECLARE
    v_user_id UUID;
    v_user_role TEXT;
    v_submission RECORD;
    v_new_flags JSONB;
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

    IF v_user_role NOT IN ('tier1', 'tier2_officer', 'tier2_registrar') THEN
        RETURN jsonb_build_object('success', false, 'error', 'Only MOH users can flag submissions');
    END IF;

    -- Get submission
    SELECT * INTO v_submission
    FROM public.msq_submissions
    WHERE id = p_submission_id;

    IF v_submission IS NULL THEN
        RETURN jsonb_build_object('success', false, 'error', 'Submission not found');
    END IF;

    IF v_submission.status NOT IN ('submitted') THEN
        RETURN jsonb_build_object('success', false, 'error', 'Only submitted MSQ can be flagged');
    END IF;

    -- Validate reason
    IF p_reason IS NULL OR length(trim(p_reason)) < 10 THEN
        RETURN jsonb_build_object('success', false, 'error', 'Flag reason must be at least 10 characters');
    END IF;

    -- Add manual flag to validation_flags
    v_new_flags := COALESCE(v_submission.validation_flags, '[]'::JSONB) || jsonb_build_object(
        'type', 'manual_flag',
        'code', 'MOH_FLAGGED',
        'message', p_reason,
        'flagged_by', v_user_id,
        'flagged_at', NOW(),
        'details', p_flag_details
    );

    -- Update submission
    UPDATE public.msq_submissions
    SET status = 'flagged_for_review',
        validation_flags = v_new_flags,
        updated_at = NOW()
    WHERE id = p_submission_id;

    -- Create approval record
    INSERT INTO public.approvals (
        entity_type,
        entity_id,
        action,
        requested_by,
        status,
        notes
    ) VALUES (
        'msq_submission',
        p_submission_id,
        'flag_for_review',
        v_user_id,
        'approved',
        p_reason
    );

    RETURN jsonb_build_object(
        'success', true,
        'submission_id', p_submission_id,
        'status', 'flagged_for_review'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- Task 1.1.4.5: MSQ Accept
-- ============================================================================

CREATE OR REPLACE FUNCTION public.vci_accept_msq(
    p_submission_id UUID,
    p_notes TEXT DEFAULT NULL
) RETURNS JSONB AS $$
DECLARE
    v_user_id UUID;
    v_user_role TEXT;
    v_submission RECORD;
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

    IF v_user_role NOT IN ('tier1', 'tier2_officer', 'tier2_registrar') THEN
        RETURN jsonb_build_object('success', false, 'error', 'Only MOH users can accept submissions');
    END IF;

    -- Get submission
    SELECT * INTO v_submission
    FROM public.msq_submissions
    WHERE id = p_submission_id;

    IF v_submission IS NULL THEN
        RETURN jsonb_build_object('success', false, 'error', 'Submission not found');
    END IF;

    IF v_submission.status NOT IN ('submitted', 'flagged_for_review') THEN
        RETURN jsonb_build_object(
            'success', false, 
            'error', 'Only submitted or flagged MSQ can be accepted'
        );
    END IF;

    -- Update submission
    UPDATE public.msq_submissions
    SET status = 'accepted',
        updated_at = NOW()
    WHERE id = p_submission_id;

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
        'msq_submission',
        p_submission_id,
        'accept',
        v_submission.submitted_by,
        v_user_id,
        NOW(),
        'approved',
        COALESCE(p_notes, 'MSQ accepted')
    );

    RETURN jsonb_build_object(
        'success', true,
        'submission_id', p_submission_id,
        'status', 'accepted'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- Task 1.1.4.6: MSQ Reject
-- ============================================================================

CREATE OR REPLACE FUNCTION public.vci_reject_msq(
    p_submission_id UUID,
    p_rejection_reason TEXT
) RETURNS JSONB AS $$
DECLARE
    v_user_id UUID;
    v_user_role TEXT;
    v_submission RECORD;
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

    IF v_user_role NOT IN ('tier1', 'tier2_officer', 'tier2_registrar') THEN
        RETURN jsonb_build_object('success', false, 'error', 'Only MOH users can reject submissions');
    END IF;

    -- Validate rejection reason
    IF p_rejection_reason IS NULL OR length(trim(p_rejection_reason)) < 20 THEN
        RETURN jsonb_build_object('success', false, 'error', 'Rejection reason must be at least 20 characters');
    END IF;

    -- Get submission
    SELECT * INTO v_submission
    FROM public.msq_submissions
    WHERE id = p_submission_id;

    IF v_submission IS NULL THEN
        RETURN jsonb_build_object('success', false, 'error', 'Submission not found');
    END IF;

    IF v_submission.status NOT IN ('submitted', 'flagged_for_review') THEN
        RETURN jsonb_build_object(
            'success', false, 
            'error', 'Only submitted or flagged MSQ can be rejected'
        );
    END IF;

    -- Update submission
    UPDATE public.msq_submissions
    SET status = 'rejected',
        validation_flags = COALESCE(validation_flags, '[]'::JSONB) || jsonb_build_object(
            'type', 'rejection',
            'code', 'REJECTED',
            'message', p_rejection_reason,
            'rejected_by', v_user_id,
            'rejected_at', NOW()
        ),
        updated_at = NOW()
    WHERE id = p_submission_id;

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
        'msq_submission',
        p_submission_id,
        'reject',
        v_submission.submitted_by,
        v_user_id,
        NOW(),
        'rejected',
        p_rejection_reason
    );

    RETURN jsonb_build_object(
        'success', true,
        'submission_id', p_submission_id,
        'status', 'rejected'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- Task 1.1.4.7: 7-Day Grace Period for MSQ Corrections
-- ============================================================================

-- Helper: Check if MSQ is within correction window
CREATE OR REPLACE FUNCTION public.vci_is_msq_within_grace_period(
    p_submission_id UUID
) RETURNS BOOLEAN AS $$
DECLARE
    v_submission RECORD;
    v_grace_end TIMESTAMPTZ;
BEGIN
    SELECT * INTO v_submission
    FROM public.msq_submissions
    WHERE id = p_submission_id;

    IF v_submission IS NULL THEN
        RETURN false;
    END IF;

    -- Grace period is 7 days from submission
    v_grace_end := v_submission.submitted_at + INTERVAL '7 days';

    RETURN NOW() <= v_grace_end;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper: Get grace period end date
CREATE OR REPLACE FUNCTION public.vci_get_msq_grace_period_end(
    p_submission_id UUID
) RETURNS TIMESTAMPTZ AS $$
DECLARE
    v_submitted_at TIMESTAMPTZ;
BEGIN
    SELECT submitted_at INTO v_submitted_at
    FROM public.msq_submissions
    WHERE id = p_submission_id;

    IF v_submitted_at IS NULL THEN
        RETURN NULL;
    END IF;

    RETURN v_submitted_at + INTERVAL '7 days';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- MSQ Correction function
CREATE OR REPLACE FUNCTION public.vci_correct_msq(
    p_original_submission_id UUID,
    p_corrected_data JSONB
) RETURNS JSONB AS $$
DECLARE
    v_user_id UUID;
    v_user_role TEXT;
    v_company_id UUID;
    v_original RECORD;
    v_grace_end TIMESTAMPTZ;
    v_new_submission_id UUID;
    v_validation_flags JSONB := '[]'::JSONB;
    v_format_flags JSONB;
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

    IF v_user_role NOT IN ('company_admin', 'company_manager') THEN
        RETURN jsonb_build_object('success', false, 'error', 'Only company admin or manager can correct MSQ');
    END IF;

    -- Get original submission
    SELECT * INTO v_original
    FROM public.msq_submissions
    WHERE id = p_original_submission_id;

    IF v_original IS NULL THEN
        RETURN jsonb_build_object('success', false, 'error', 'Original submission not found');
    END IF;

    -- Verify same company
    IF v_original.company_id != v_company_id THEN
        RETURN jsonb_build_object('success', false, 'error', 'Cannot correct another company''s submission');
    END IF;

    -- Check grace period
    v_grace_end := v_original.submitted_at + INTERVAL '7 days';
    IF NOW() > v_grace_end THEN
        RETURN jsonb_build_object(
            'success', false, 
            'error', 'Grace period has expired. Corrections must be made within 7 days of original submission.',
            'grace_period_ended', v_grace_end
        );
    END IF;

    -- Validate new data
    v_format_flags := public.vci_validate_msq_format(p_corrected_data);
    
    SELECT EXISTS(
        SELECT 1 FROM jsonb_array_elements(v_format_flags) elem
        WHERE elem->>'type' = 'error'
    ) INTO STRICT v_validation_flags;

    IF v_validation_flags::TEXT = 'true' THEN
        RETURN jsonb_build_object(
            'success', false, 
            'error', 'Validation failed',
            'validation_flags', v_format_flags
        );
    END IF;

    -- Create correction submission
    INSERT INTO public.msq_submissions (
        company_id,
        year,
        month,
        submission_data,
        status,
        validation_flags,
        correction_of,
        submitted_by,
        submitted_at
    ) VALUES (
        v_company_id,
        v_original.year,
        v_original.month,
        p_corrected_data,
        'submitted',
        jsonb_build_object(
            'type', 'correction',
            'original_id', p_original_submission_id,
            'corrected_at', NOW()
        )::JSONB,
        p_original_submission_id,
        v_user_id,
        NOW()
    )
    RETURNING id INTO v_new_submission_id;

    -- Mark original as superseded
    UPDATE public.msq_submissions
    SET validation_flags = COALESCE(validation_flags, '[]'::JSONB) || jsonb_build_object(
            'type', 'superseded',
            'code', 'CORRECTED',
            'message', 'This submission has been corrected',
            'correction_id', v_new_submission_id,
            'corrected_at', NOW()
        ),
        updated_at = NOW()
    WHERE id = p_original_submission_id;

    -- Create approval record
    INSERT INTO public.approvals (
        entity_type,
        entity_id,
        action,
        requested_by,
        status,
        notes
    ) VALUES (
        'msq_submission',
        v_new_submission_id,
        'correction',
        v_user_id,
        'approved',
        format('Correction of submission %s', p_original_submission_id)
    );

    RETURN jsonb_build_object(
        'success', true,
        'correction_id', v_new_submission_id,
        'original_id', p_original_submission_id,
        'grace_period_remaining', EXTRACT(EPOCH FROM (v_grace_end - NOW())) / 86400.0
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- Helper Functions for MSQ List/Get
-- ============================================================================

CREATE OR REPLACE FUNCTION public.vci_list_msq_submissions(
    p_company_id UUID DEFAULT NULL,
    p_year INTEGER DEFAULT NULL,
    p_month INTEGER DEFAULT NULL,
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

    -- Company users can only see their own submissions
    IF v_user_role IN ('company_admin', 'company_manager', 'company_user') THEN
        p_company_id := v_user_company_id;
    END IF;

    -- Get total count
    SELECT COUNT(*) INTO v_total
    FROM public.msq_submissions ms
    WHERE (p_company_id IS NULL OR ms.company_id = p_company_id)
      AND (p_year IS NULL OR ms.year = p_year)
      AND (p_month IS NULL OR ms.month = p_month)
      AND (p_status IS NULL OR ms.status = p_status);

    -- Get submissions
    SELECT jsonb_agg(sub ORDER BY sub.year DESC, sub.month DESC) INTO v_submissions
    FROM (
        SELECT 
            ms.id,
            ms.company_id,
            c.name as company_name,
            ms.year,
            ms.month,
            ms.submission_data,
            ms.status,
            ms.validation_flags,
            ms.correction_of,
            ms.submitted_by,
            u.full_name as submitted_by_name,
            ms.submitted_at,
            ms.created_at,
            ms.updated_at
        FROM public.msq_submissions ms
        JOIN public.companies c ON c.id = ms.company_id
        LEFT JOIN public.users u ON u.id = ms.submitted_by
        WHERE (p_company_id IS NULL OR ms.company_id = p_company_id)
          AND (p_year IS NULL OR ms.year = p_year)
          AND (p_month IS NULL OR ms.month = p_month)
          AND (p_status IS NULL OR ms.status = p_status)
        ORDER BY ms.year DESC, ms.month DESC
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

CREATE OR REPLACE FUNCTION public.vci_get_msq_submission(
    p_submission_id UUID
) RETURNS JSONB AS $$
DECLARE
    v_user_id UUID;
    v_user_role TEXT;
    v_user_company_id UUID;
    v_submission JSONB;
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

    -- Get submission
    SELECT jsonb_build_object(
        'id', ms.id,
        'company_id', ms.company_id,
        'company_name', c.name,
        'year', ms.year,
        'month', ms.month,
        'submission_data', ms.submission_data,
        'status', ms.status,
        'validation_flags', ms.validation_flags,
        'correction_of', ms.correction_of,
        'submitted_by', ms.submitted_by,
        'submitted_by_name', u.full_name,
        'submitted_at', ms.submitted_at,
        'created_at', ms.created_at,
        'updated_at', ms.updated_at,
        'within_grace_period', public.vci_is_msq_within_grace_period(ms.id),
        'grace_period_end', public.vci_get_msq_grace_period_end(ms.id)
    ) INTO v_submission
    FROM public.msq_submissions ms
    JOIN public.companies c ON c.id = ms.company_id
    LEFT JOIN public.users u ON u.id = ms.submitted_by
    WHERE ms.id = p_submission_id;

    IF v_submission IS NULL THEN
        RETURN jsonb_build_object('success', false, 'error', 'Submission not found');
    END IF;

    -- Company users can only view their own submissions
    IF v_user_role IN ('company_admin', 'company_manager', 'company_user') THEN
        IF (v_submission->>'company_id')::UUID != v_user_company_id THEN
            RETURN jsonb_build_object('success', false, 'error', 'Access denied');
        END IF;
    END IF;

    RETURN jsonb_build_object(
        'success', true,
        'submission', v_submission
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.vci_validate_msq_format(JSONB) TO authenticated;
GRANT EXECUTE ON FUNCTION public.vci_validate_msq_historical(UUID, INTEGER, INTEGER, JSONB) TO authenticated;
GRANT EXECUTE ON FUNCTION public.vci_validate_msq_vs_aams(UUID, INTEGER, JSONB) TO authenticated;
GRANT EXECUTE ON FUNCTION public.vci_submit_msq(INTEGER, INTEGER, JSONB, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.vci_flag_msq_for_review(UUID, TEXT, JSONB) TO authenticated;
GRANT EXECUTE ON FUNCTION public.vci_accept_msq(UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.vci_reject_msq(UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.vci_is_msq_within_grace_period(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.vci_get_msq_grace_period_end(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.vci_correct_msq(UUID, JSONB) TO authenticated;
GRANT EXECUTE ON FUNCTION public.vci_list_msq_submissions(UUID, INTEGER, INTEGER, TEXT, INTEGER, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION public.vci_get_msq_submission(UUID) TO authenticated;

COMMENT ON FUNCTION public.vci_submit_msq IS 'Task 1.1.4.1: Submit Monthly Sales Quantity with validation';
COMMENT ON FUNCTION public.vci_validate_msq_format IS 'Task 1.1.4.2: MSQ format and completeness validation';
COMMENT ON FUNCTION public.vci_validate_msq_historical IS 'Task 1.1.4.2: MSQ historical pattern comparison';
COMMENT ON FUNCTION public.vci_validate_msq_vs_aams IS 'Task 1.1.4.3: MSQ vs AAMS 20% threshold anomaly detection';
COMMENT ON FUNCTION public.vci_flag_msq_for_review IS 'Task 1.1.4.4: Flag MSQ for manual review';
COMMENT ON FUNCTION public.vci_accept_msq IS 'Task 1.1.4.5: Accept MSQ submission';
COMMENT ON FUNCTION public.vci_reject_msq IS 'Task 1.1.4.6: Reject MSQ submission';
COMMENT ON FUNCTION public.vci_correct_msq IS 'Task 1.1.4.7: Correct MSQ within 7-day grace period';
COMMENT ON FUNCTION public.vci_is_msq_within_grace_period IS 'Task 1.1.4.7: Check if MSQ is within correction grace period';
