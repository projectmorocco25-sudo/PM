-- ============================================================================
-- Task 1.1.3.1 - 1.1.3.10a: VCI AAMS RPC Functions
-- Annual Average Monthly Sales workflow management
-- ============================================================================

-- ============================================================================
-- CONSTANTS AND HELPER FUNCTIONS
-- ============================================================================

-- Task 1.1.3.6: Threshold calculation constants
-- B multiplier: 3 for standard products, 3.5 for critical medicines
-- Formula: Threshold = B × AAMS (Annual Average Monthly Sales)

-- Helper function to check VCI permissions
CREATE OR REPLACE FUNCTION public.vci_check_permission(
  p_user_id UUID,
  p_required_permission TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_role TEXT;
BEGIN
  SELECT role INTO v_user_role FROM users WHERE id = p_user_id;
  
  CASE p_required_permission
    WHEN 'submit_aams' THEN
      -- Companies can submit their AAMS
      RETURN v_user_role IN ('company_admin', 'company_manager');
    WHEN 'verify_aams' THEN
      -- Tier 2 can verify
      RETURN v_user_role IN ('tier2_officer', 'tier2_registrar');
    WHEN 'approve_aams' THEN
      -- Tier 1 can approve
      RETURN v_user_role = 'tier1';
    WHEN 'modify_threshold' THEN
      -- Tier 1 can modify thresholds
      RETURN v_user_role = 'tier1';
    WHEN 'view_all' THEN
      -- MOH can view all
      RETURN v_user_role IN ('tier1', 'tier2_officer', 'tier2_registrar');
    ELSE
      RETURN FALSE;
  END CASE;
END;
$$;

-- Task 1.1.3.6: Get B multiplier for a SKU (based on critical medicine status)
CREATE OR REPLACE FUNCTION public.vci_get_b_multiplier(
  p_sku_id UUID
)
RETURNS NUMERIC
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_is_critical BOOLEAN;
  v_custom_multiplier NUMERIC;
BEGIN
  -- Check if there's a custom threshold for this SKU
  SELECT multiplier_b INTO v_custom_multiplier
  FROM thresholds
  WHERE sku_id = p_sku_id AND is_current = true
  ORDER BY effective_from DESC
  LIMIT 1;
  
  IF v_custom_multiplier IS NOT NULL THEN
    RETURN v_custom_multiplier;
  END IF;
  
  -- Check if product is critical medicine
  SELECT p.is_critical_medicine INTO v_is_critical
  FROM skus s
  JOIN products p ON p.id = s.product_id
  WHERE s.id = p_sku_id;
  
  -- Return 3.5 for critical medicines, 3 for standard
  RETURN CASE WHEN v_is_critical THEN 3.5 ELSE 3.0 END;
END;
$$;

-- Task 1.1.3.6: Calculate threshold value (B × AAMS)
CREATE OR REPLACE FUNCTION public.vci_calculate_threshold(
  p_aams_value NUMERIC,
  p_sku_id UUID
)
RETURNS NUMERIC
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_multiplier NUMERIC;
BEGIN
  v_multiplier := vci_get_b_multiplier(p_sku_id);
  RETURN ROUND(v_multiplier * p_aams_value, 2);
END;
$$;

-- Task 1.1.3.8: Check if submission is late (after Jan 31)
CREATE OR REPLACE FUNCTION public.vci_is_aams_late(
  p_submission_date TIMESTAMPTZ,
  p_year INTEGER
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_deadline DATE;
BEGIN
  -- AAMS deadline is January 31 of the submission year
  v_deadline := make_date(p_year, 1, 31);
  RETURN p_submission_date::date > v_deadline;
END;
$$;

-- Task 1.1.3.8a: Check if submission is within grace period (Feb 1-15)
CREATE OR REPLACE FUNCTION public.vci_is_within_grace_period(
  p_submission_date TIMESTAMPTZ,
  p_year INTEGER
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_deadline DATE;
  v_grace_end DATE;
BEGIN
  v_deadline := make_date(p_year, 1, 31);
  v_grace_end := make_date(p_year, 2, 15);
  
  RETURN p_submission_date::date > v_deadline AND p_submission_date::date <= v_grace_end;
END;
$$;

-- Task 1.1.3.8a: Check if submission violates compliance (after Feb 15)
CREATE OR REPLACE FUNCTION public.vci_is_compliance_violation(
  p_submission_date TIMESTAMPTZ,
  p_year INTEGER
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_grace_end DATE;
BEGIN
  v_grace_end := make_date(p_year, 2, 15);
  RETURN p_submission_date::date > v_grace_end;
END;
$$;

-- ============================================================================
-- Task 1.1.3.1: Submit AAMS
-- ============================================================================

CREATE OR REPLACE FUNCTION public.vci_submit_aams(
  p_year INTEGER,
  p_submission_data JSONB -- Array of {sku_id, quantity} objects
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
  v_user_company_id UUID;
  v_submission_id UUID;
  v_is_late BOOLEAN;
  v_is_grace_period BOOLEAN;
  v_is_violation BOOLEAN;
  v_existing_submission UUID;
  v_total_aams NUMERIC := 0;
  v_item JSONB;
  v_sku_record RECORD;
BEGIN
  v_user_id := auth.uid();
  
  -- Get user's company
  SELECT company_id INTO v_user_company_id FROM users WHERE id = v_user_id;
  
  IF v_user_company_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'User is not associated with a company');
  END IF;
  
  -- Check permission
  IF NOT vci_check_permission(v_user_id, 'submit_aams') THEN
    RETURN jsonb_build_object('success', false, 'error', 'Insufficient permissions to submit AAMS');
  END IF;
  
  -- Validate year (must be current year or previous year in January)
  IF p_year < EXTRACT(YEAR FROM CURRENT_DATE)::INTEGER - 1 OR p_year > EXTRACT(YEAR FROM CURRENT_DATE)::INTEGER THEN
    RETURN jsonb_build_object('success', false, 'error', 'Invalid year for AAMS submission');
  END IF;
  
  -- Check for existing submission for this company/year
  SELECT id INTO v_existing_submission
  FROM aams_submissions
  WHERE company_id = v_user_company_id AND year = p_year AND status NOT IN ('rejected', 'draft');
  
  IF v_existing_submission IS NOT NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'AAMS submission already exists for this year');
  END IF;
  
  -- Validate submission data
  IF p_submission_data IS NULL OR jsonb_array_length(p_submission_data) = 0 THEN
    RETURN jsonb_build_object('success', false, 'error', 'Submission data is required');
  END IF;
  
  -- Validate each item and calculate total AAMS
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_submission_data)
  LOOP
    -- Check SKU exists and belongs to company
    SELECT s.id, s.name, p.company_id, p.is_critical_medicine
    INTO v_sku_record
    FROM skus s
    JOIN products p ON p.id = s.product_id
    WHERE s.id = (v_item->>'sku_id')::uuid;
    
    IF v_sku_record.id IS NULL THEN
      RETURN jsonb_build_object('success', false, 'error', 'Invalid SKU: ' || (v_item->>'sku_id'));
    END IF;
    
    IF v_sku_record.company_id != v_user_company_id THEN
      RETURN jsonb_build_object('success', false, 'error', 'SKU does not belong to your company: ' || (v_item->>'sku_id'));
    END IF;
    
    IF (v_item->>'quantity')::numeric <= 0 THEN
      RETURN jsonb_build_object('success', false, 'error', 'Quantity must be positive for SKU: ' || (v_item->>'sku_id'));
    END IF;
    
    -- Calculate AAMS (quantity / 12 for monthly average)
    v_total_aams := v_total_aams + ((v_item->>'quantity')::numeric / 12);
  END LOOP;
  
  -- Task 1.1.3.8: Check deadline status
  v_is_late := vci_is_aams_late(NOW(), p_year);
  v_is_grace_period := vci_is_within_grace_period(NOW(), p_year);
  v_is_violation := vci_is_compliance_violation(NOW(), p_year);
  
  -- Create submission
  INSERT INTO aams_submissions (
    company_id, year, aams_value, submission_data, status, is_late,
    submitted_by, submitted_at
  ) VALUES (
    v_user_company_id, p_year, v_total_aams, p_submission_data, 'submitted', v_is_late,
    v_user_id, NOW()
  )
  RETURNING id INTO v_submission_id;
  
  -- Create approval record
  INSERT INTO approvals (entity_type, entity_id, approval_type, status, requested_by, requested_at)
  VALUES ('aams_submission', v_submission_id, 'submit', 'pending', v_user_id, NOW());
  
  -- Audit log
  PERFORM shared_create_audit_log(v_user_id, 'CREATE', 'aams_submissions', v_submission_id,
    jsonb_build_object('year', p_year, 'aams_value', v_total_aams, 'is_late', v_is_late));
  
  -- Notify Tier 2 for verification
  PERFORM shared_batch_create_notifications(
    'aams_submitted',
    'AAMS Submission Received',
    'A new AAMS submission requires verification',
    '/dashboard/vci/aams/' || v_submission_id::text,
    (SELECT array_agg(id) FROM users WHERE role IN ('tier2_officer', 'tier2_registrar'))
  );
  
  RETURN jsonb_build_object(
    'success', true,
    'submission_id', v_submission_id,
    'aams_value', v_total_aams,
    'is_late', v_is_late,
    'is_grace_period', v_is_grace_period,
    'is_compliance_violation', v_is_violation
  );
END;
$$;

-- ============================================================================
-- Task 1.1.3.2: Verify AAMS (Tier 2) - includes threshold calculation
-- ============================================================================

CREATE OR REPLACE FUNCTION public.vci_verify_aams(
  p_submission_id UUID,
  p_approve BOOLEAN,
  p_verification_notes TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
  v_submission RECORD;
  v_new_status TEXT;
  v_item JSONB;
  v_sku_id UUID;
  v_quantity NUMERIC;
  v_aams_value NUMERIC;
  v_threshold_value NUMERIC;
  v_multiplier NUMERIC;
  v_thresholds_created INTEGER := 0;
BEGIN
  v_user_id := auth.uid();
  
  -- Check permission
  IF NOT vci_check_permission(v_user_id, 'verify_aams') THEN
    RETURN jsonb_build_object('success', false, 'error', 'Only Tier 2 can verify AAMS submissions');
  END IF;
  
  -- Get submission
  SELECT * INTO v_submission FROM aams_submissions WHERE id = p_submission_id;
  
  IF v_submission.id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'AAMS submission not found');
  END IF;
  
  IF v_submission.status != 'submitted' THEN
    RETURN jsonb_build_object('success', false, 'error', 'Submission is not in submitted status');
  END IF;
  
  -- Determine new status
  IF p_approve THEN
    v_new_status := 'verified';
    
    -- Task 1.1.3.6: Calculate and create thresholds for each SKU
    FOR v_item IN SELECT * FROM jsonb_array_elements(v_submission.submission_data)
    LOOP
      v_sku_id := (v_item->>'sku_id')::uuid;
      v_quantity := (v_item->>'quantity')::numeric;
      v_aams_value := v_quantity / 12; -- Monthly average
      v_multiplier := vci_get_b_multiplier(v_sku_id);
      v_threshold_value := vci_calculate_threshold(v_aams_value, v_sku_id);
      
      -- Mark any existing thresholds for this SKU as non-current
      UPDATE thresholds 
      SET is_current = false, updated_at = NOW()
      WHERE sku_id = v_sku_id AND is_current = true;
      
      -- Create new threshold (pending approval)
      INSERT INTO thresholds (
        sku_id, threshold_type, threshold_value, multiplier_b, aams_value,
        effective_from, is_current, created_by
      ) VALUES (
        v_sku_id, 'calculated', v_threshold_value, v_multiplier, v_aams_value,
        make_date(v_submission.year, 1, 1), false, v_user_id
      );
      
      v_thresholds_created := v_thresholds_created + 1;
    END LOOP;
  ELSE
    v_new_status := 'submitted'; -- Return to submitted for revision
  END IF;
  
  -- Update submission
  UPDATE aams_submissions SET
    status = v_new_status,
    verified_by = v_user_id,
    verified_at = NOW(),
    updated_at = NOW()
  WHERE id = p_submission_id;
  
  -- Create approval record
  INSERT INTO approvals (entity_type, entity_id, approval_type, status, requested_by, requested_at, reviewed_by, reviewed_at, review_notes)
  VALUES ('aams_submission', p_submission_id, 'verify', 
    CASE WHEN p_approve THEN 'approved' ELSE 'rejected' END,
    v_submission.submitted_by, v_submission.submitted_at, v_user_id, NOW(), p_verification_notes);
  
  -- Audit log
  PERFORM shared_create_audit_log(v_user_id, 'UPDATE', 'aams_submissions', p_submission_id,
    jsonb_build_object('action', 'verify', 'approved', p_approve, 'thresholds_created', v_thresholds_created));
  
  -- Notifications
  IF p_approve THEN
    -- Notify Tier 1 for approval
    PERFORM shared_batch_create_notifications(
      'aams_verified',
      'AAMS Verified - Pending Approval',
      'An AAMS submission has been verified and requires approval',
      '/dashboard/vci/aams/' || p_submission_id::text,
      (SELECT array_agg(id) FROM users WHERE role = 'tier1')
    );
  ELSE
    -- Notify company of issues
    PERFORM shared_create_notification(
      'aams_verification_failed',
      'AAMS Verification Issues',
      'Your AAMS submission requires revision',
      '/dashboard/vci/aams/' || p_submission_id::text,
      v_submission.submitted_by
    );
  END IF;
  
  RETURN jsonb_build_object(
    'success', true,
    'submission_id', p_submission_id,
    'status', v_new_status,
    'thresholds_created', v_thresholds_created
  );
END;
$$;

-- ============================================================================
-- Task 1.1.3.3: Approve AAMS (Tier 1)
-- ============================================================================

CREATE OR REPLACE FUNCTION public.vci_approve_aams_threshold(
  p_submission_id UUID,
  p_approve BOOLEAN,
  p_approval_notes TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
  v_submission RECORD;
  v_new_status TEXT;
  v_item JSONB;
  v_sku_id UUID;
BEGIN
  v_user_id := auth.uid();
  
  -- Check permission
  IF NOT vci_check_permission(v_user_id, 'approve_aams') THEN
    RETURN jsonb_build_object('success', false, 'error', 'Only Tier 1 can approve AAMS thresholds');
  END IF;
  
  -- Get submission
  SELECT * INTO v_submission FROM aams_submissions WHERE id = p_submission_id;
  
  IF v_submission.id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'AAMS submission not found');
  END IF;
  
  IF v_submission.status != 'verified' THEN
    RETURN jsonb_build_object('success', false, 'error', 'Submission is not in verified status');
  END IF;
  
  -- Determine new status
  IF p_approve THEN
    v_new_status := 'approved';
    
    -- Activate all thresholds for this submission's SKUs
    FOR v_item IN SELECT * FROM jsonb_array_elements(v_submission.submission_data)
    LOOP
      v_sku_id := (v_item->>'sku_id')::uuid;
      
      -- Mark the threshold as current
      UPDATE thresholds 
      SET is_current = true, updated_at = NOW()
      WHERE sku_id = v_sku_id 
        AND effective_from = make_date(v_submission.year, 1, 1)
        AND is_current = false;
    END LOOP;
  ELSE
    v_new_status := 'verified'; -- Return to verification
  END IF;
  
  -- Update submission
  UPDATE aams_submissions SET
    status = v_new_status,
    approved_by = CASE WHEN p_approve THEN v_user_id ELSE NULL END,
    approved_at = CASE WHEN p_approve THEN NOW() ELSE NULL END,
    updated_at = NOW()
  WHERE id = p_submission_id;
  
  -- Create approval record
  INSERT INTO approvals (entity_type, entity_id, approval_type, status, requested_by, requested_at, reviewed_by, reviewed_at, review_notes)
  VALUES ('aams_submission', p_submission_id, 'approve', 
    CASE WHEN p_approve THEN 'approved' ELSE 'rejected' END,
    v_submission.submitted_by, v_submission.submitted_at, v_user_id, NOW(), p_approval_notes);
  
  -- Audit log
  PERFORM shared_create_audit_log(v_user_id, 'UPDATE', 'aams_submissions', p_submission_id,
    jsonb_build_object('action', 'approve', 'approved', p_approve));
  
  -- Notify company
  PERFORM shared_create_notification(
    CASE WHEN p_approve THEN 'aams_approved' ELSE 'aams_approval_rejected' END,
    CASE WHEN p_approve THEN 'AAMS Approved' ELSE 'AAMS Approval Rejected' END,
    CASE WHEN p_approve THEN 'Your AAMS submission has been approved. Thresholds are now active.' 
         ELSE 'Your AAMS submission requires revision.' END,
    '/dashboard/vci/aams/' || p_submission_id::text,
    v_submission.submitted_by
  );
  
  RETURN jsonb_build_object(
    'success', true,
    'submission_id', p_submission_id,
    'status', v_new_status
  );
END;
$$;

-- ============================================================================
-- Task 1.1.3.4: Complete AAMS Submission
-- ============================================================================

CREATE OR REPLACE FUNCTION public.vci_complete_aams_submission(
  p_submission_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
  v_submission RECORD;
BEGIN
  v_user_id := auth.uid();
  
  -- Check permission (MOH only)
  IF NOT vci_check_permission(v_user_id, 'view_all') THEN
    RETURN jsonb_build_object('success', false, 'error', 'Insufficient permissions');
  END IF;
  
  -- Get submission
  SELECT * INTO v_submission FROM aams_submissions WHERE id = p_submission_id;
  
  IF v_submission.id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'AAMS submission not found');
  END IF;
  
  IF v_submission.status != 'approved' THEN
    RETURN jsonb_build_object('success', false, 'error', 'Submission must be approved before completion');
  END IF;
  
  -- Update submission
  UPDATE aams_submissions SET
    status = 'completed',
    updated_at = NOW()
  WHERE id = p_submission_id;
  
  -- Audit log
  PERFORM shared_create_audit_log(v_user_id, 'UPDATE', 'aams_submissions', p_submission_id,
    jsonb_build_object('action', 'complete'));
  
  RETURN jsonb_build_object(
    'success', true,
    'submission_id', p_submission_id,
    'status', 'completed'
  );
END;
$$;

-- ============================================================================
-- Task 1.1.3.5: Reject AAMS Submission
-- ============================================================================

CREATE OR REPLACE FUNCTION public.vci_reject_aams_submission(
  p_submission_id UUID,
  p_rejection_reason TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
  v_user_role TEXT;
  v_submission RECORD;
BEGIN
  v_user_id := auth.uid();
  SELECT role INTO v_user_role FROM users WHERE id = v_user_id;
  
  -- MOH can reject
  IF v_user_role NOT IN ('tier1', 'tier2_officer', 'tier2_registrar') THEN
    RETURN jsonb_build_object('success', false, 'error', 'Only MOH can reject AAMS submissions');
  END IF;
  
  -- Validate rejection reason
  IF LENGTH(COALESCE(p_rejection_reason, '')) < 20 THEN
    RETURN jsonb_build_object('success', false, 'error', 'Rejection reason is required (minimum 20 characters)');
  END IF;
  
  -- Get submission
  SELECT * INTO v_submission FROM aams_submissions WHERE id = p_submission_id;
  
  IF v_submission.id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'AAMS submission not found');
  END IF;
  
  IF v_submission.status IN ('rejected', 'completed') THEN
    RETURN jsonb_build_object('success', false, 'error', 'Cannot reject this submission');
  END IF;
  
  -- Update submission
  UPDATE aams_submissions SET
    status = 'rejected',
    updated_at = NOW()
  WHERE id = p_submission_id;
  
  -- Delete any pending thresholds for this submission
  DELETE FROM thresholds 
  WHERE sku_id IN (
    SELECT (item->>'sku_id')::uuid 
    FROM jsonb_array_elements(v_submission.submission_data) AS item
  ) AND is_current = false 
    AND effective_from = make_date(v_submission.year, 1, 1);
  
  -- Create approval record
  INSERT INTO approvals (entity_type, entity_id, approval_type, status, requested_by, requested_at, reviewed_by, reviewed_at, review_notes)
  VALUES ('aams_submission', p_submission_id, 'reject', 'rejected',
    v_submission.submitted_by, v_submission.submitted_at, v_user_id, NOW(), p_rejection_reason);
  
  -- Audit log
  PERFORM shared_create_audit_log(v_user_id, 'UPDATE', 'aams_submissions', p_submission_id,
    jsonb_build_object('action', 'reject', 'reason', p_rejection_reason));
  
  -- Notify company
  PERFORM shared_create_notification(
    'aams_rejected',
    'AAMS Submission Rejected',
    'Your AAMS submission has been rejected: ' || LEFT(p_rejection_reason, 100),
    '/dashboard/vci/aams/' || p_submission_id::text,
    v_submission.submitted_by
  );
  
  RETURN jsonb_build_object(
    'success', true,
    'submission_id', p_submission_id,
    'status', 'rejected'
  );
END;
$$;

-- ============================================================================
-- Task 1.1.3.7: Threshold Modification (Local per-SKU, Global system-wide)
-- ============================================================================

CREATE OR REPLACE FUNCTION public.vci_modify_threshold(
  p_sku_id UUID DEFAULT NULL, -- NULL for global modification
  p_new_multiplier_b NUMERIC,
  p_effective_from DATE,
  p_effective_to DATE DEFAULT NULL, -- NULL for permanent
  p_justification TEXT,
  p_is_global BOOLEAN DEFAULT FALSE
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
  v_affected_count INTEGER := 0;
  v_threshold_id UUID;
  v_current_threshold RECORD;
  v_sku_record RECORD;
  v_new_threshold_value NUMERIC;
BEGIN
  v_user_id := auth.uid();
  
  -- Check permission
  IF NOT vci_check_permission(v_user_id, 'modify_threshold') THEN
    RETURN jsonb_build_object('success', false, 'error', 'Only Tier 1 can modify thresholds');
  END IF;
  
  -- Validate multiplier (must be positive)
  IF p_new_multiplier_b <= 0 THEN
    RETURN jsonb_build_object('success', false, 'error', 'Multiplier must be positive');
  END IF;
  
  -- Validate justification (minimum 50 chars per Task 1.1.2.15a)
  IF LENGTH(COALESCE(p_justification, '')) < 50 THEN
    RETURN jsonb_build_object('success', false, 'error', 'Justification is required (minimum 50 characters)');
  END IF;
  
  -- Task 1.1.3.7: Non-retroactive - effective_from must be in the future
  IF p_effective_from < CURRENT_DATE THEN
    RETURN jsonb_build_object('success', false, 'error', 'Threshold modifications cannot be retroactive');
  END IF;
  
  IF p_is_global THEN
    -- Global modification: Update all SKUs
    FOR v_sku_record IN 
      SELECT s.id, t.aams_value 
      FROM skus s
      LEFT JOIN thresholds t ON t.sku_id = s.id AND t.is_current = true
      WHERE s.is_active = true
    LOOP
      IF v_sku_record.aams_value IS NOT NULL THEN
        v_new_threshold_value := p_new_multiplier_b * v_sku_record.aams_value;
        
        -- Mark current as non-current
        UPDATE thresholds 
        SET is_current = false, updated_at = NOW()
        WHERE sku_id = v_sku_record.id AND is_current = true;
        
        -- Create new threshold
        INSERT INTO thresholds (
          sku_id, threshold_type, threshold_value, multiplier_b, aams_value,
          effective_from, effective_to, is_current, 
          duration_type, revert_date, revert_to_multiplier,
          created_by
        ) VALUES (
          v_sku_record.id, 'modified_global', v_new_threshold_value, p_new_multiplier_b, v_sku_record.aams_value,
          p_effective_from, p_effective_to, true,
          CASE WHEN p_effective_to IS NOT NULL THEN 'temporary' ELSE 'permanent' END,
          p_effective_to,
          CASE WHEN p_effective_to IS NOT NULL THEN 3.0 ELSE NULL END, -- Revert to default
          v_user_id
        );
        
        v_affected_count := v_affected_count + 1;
      END IF;
    END LOOP;
  ELSE
    -- Local modification: Update specific SKU
    IF p_sku_id IS NULL THEN
      RETURN jsonb_build_object('success', false, 'error', 'SKU ID is required for local modification');
    END IF;
    
    -- Get current threshold for SKU
    SELECT * INTO v_current_threshold
    FROM thresholds
    WHERE sku_id = p_sku_id AND is_current = true
    ORDER BY effective_from DESC
    LIMIT 1;
    
    IF v_current_threshold.id IS NULL THEN
      RETURN jsonb_build_object('success', false, 'error', 'No current threshold found for this SKU');
    END IF;
    
    v_new_threshold_value := p_new_multiplier_b * v_current_threshold.aams_value;
    
    -- Mark current as non-current
    UPDATE thresholds 
    SET is_current = false, updated_at = NOW()
    WHERE id = v_current_threshold.id;
    
    -- Create new threshold
    INSERT INTO thresholds (
      sku_id, threshold_type, threshold_value, multiplier_b, aams_value,
      effective_from, effective_to, is_current,
      duration_type, revert_date, revert_to_multiplier, revert_to_threshold_value,
      created_by
    ) VALUES (
      p_sku_id, 'modified_local', v_new_threshold_value, p_new_multiplier_b, v_current_threshold.aams_value,
      p_effective_from, p_effective_to, true,
      CASE WHEN p_effective_to IS NOT NULL THEN 'temporary' ELSE 'permanent' END,
      p_effective_to,
      CASE WHEN p_effective_to IS NOT NULL THEN v_current_threshold.multiplier_b ELSE NULL END,
      CASE WHEN p_effective_to IS NOT NULL THEN v_current_threshold.threshold_value ELSE NULL END,
      v_user_id
    )
    RETURNING id INTO v_threshold_id;
    
    v_affected_count := 1;
  END IF;
  
  -- Audit log
  PERFORM shared_create_audit_log(v_user_id, 'CREATE', 'thresholds', 
    COALESCE(v_threshold_id, gen_random_uuid()),
    jsonb_build_object(
      'action', 'modify_threshold',
      'is_global', p_is_global,
      'sku_id', p_sku_id,
      'new_multiplier', p_new_multiplier_b,
      'affected_count', v_affected_count,
      'justification', p_justification
    ));
  
  RETURN jsonb_build_object(
    'success', true,
    'affected_count', v_affected_count,
    'is_global', p_is_global,
    'new_multiplier', p_new_multiplier_b,
    'effective_from', p_effective_from,
    'effective_to', p_effective_to
  );
END;
$$;

-- ============================================================================
-- Task 1.1.3.7a: Advisory Suggestions for B/C Multipliers
-- ============================================================================

CREATE OR REPLACE FUNCTION public.vci_get_multiplier_advisory(
  p_sku_id UUID,
  p_proposed_b NUMERIC DEFAULT NULL,
  p_proposed_c NUMERIC DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_is_critical BOOLEAN;
  v_default_b NUMERIC;
  v_default_c NUMERIC;
  v_suggestions JSONB := '[]'::jsonb;
BEGIN
  -- Get product critical status
  SELECT p.is_critical_medicine INTO v_is_critical
  FROM skus s
  JOIN products p ON p.id = s.product_id
  WHERE s.id = p_sku_id;
  
  -- Set defaults based on critical status
  v_default_b := CASE WHEN v_is_critical THEN 3.5 ELSE 3.0 END;
  v_default_c := CASE WHEN v_is_critical THEN 3.5 ELSE 3.0 END;
  
  -- Advisory: B and C should typically match
  IF p_proposed_b IS NOT NULL AND p_proposed_c IS NOT NULL AND p_proposed_b != p_proposed_c THEN
    v_suggestions := v_suggestions || jsonb_build_object(
      'type', 'warning',
      'message', 'B and C multipliers typically should match. Consider setting both to ' || GREATEST(p_proposed_b, p_proposed_c)
    );
  END IF;
  
  -- Advisory: Suggest matching when only one is provided
  IF p_proposed_b IS NOT NULL AND p_proposed_c IS NULL THEN
    v_suggestions := v_suggestions || jsonb_build_object(
      'type', 'suggestion',
      'message', 'Consider setting C multiplier to match B (' || p_proposed_b || ')'
    );
  END IF;
  
  IF p_proposed_c IS NOT NULL AND p_proposed_b IS NULL THEN
    v_suggestions := v_suggestions || jsonb_build_object(
      'type', 'suggestion',
      'message', 'Consider setting B multiplier to match C (' || p_proposed_c || ')'
    );
  END IF;
  
  -- Advisory: Deviation from defaults
  IF p_proposed_b IS NOT NULL AND ABS(p_proposed_b - v_default_b) > 1 THEN
    v_suggestions := v_suggestions || jsonb_build_object(
      'type', 'info',
      'message', 'Proposed B (' || p_proposed_b || ') differs significantly from default (' || v_default_b || '). Ensure justification is documented.'
    );
  END IF;
  
  RETURN jsonb_build_object(
    'success', true,
    'sku_id', p_sku_id,
    'is_critical_medicine', v_is_critical,
    'default_b', v_default_b,
    'default_c', v_default_c,
    'suggestions', v_suggestions
  );
END;
$$;

-- ============================================================================
-- Task 1.1.3.9: Previous Year AAMS Fallback Logic
-- ============================================================================

CREATE OR REPLACE FUNCTION public.vci_apply_previous_year_fallback(
  p_company_id UUID,
  p_year INTEGER
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
  v_previous_submission RECORD;
  v_new_submission_id UUID;
  v_item JSONB;
  v_sku_id UUID;
  v_aams_value NUMERIC;
  v_threshold_value NUMERIC;
  v_multiplier NUMERIC;
BEGIN
  v_user_id := auth.uid();
  
  -- Check permission (Tier 1 only for fallback)
  IF NOT vci_check_permission(v_user_id, 'approve_aams') THEN
    RETURN jsonb_build_object('success', false, 'error', 'Only Tier 1 can apply fallback');
  END IF;
  
  -- Check if current year already has a submission
  IF EXISTS (SELECT 1 FROM aams_submissions WHERE company_id = p_company_id AND year = p_year AND status NOT IN ('rejected')) THEN
    RETURN jsonb_build_object('success', false, 'error', 'Submission already exists for this year');
  END IF;
  
  -- Get previous year's approved submission
  SELECT * INTO v_previous_submission
  FROM aams_submissions
  WHERE company_id = p_company_id AND year = p_year - 1 AND status IN ('approved', 'completed')
  ORDER BY submitted_at DESC
  LIMIT 1;
  
  IF v_previous_submission.id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'No previous year submission found');
  END IF;
  
  -- Create fallback submission
  INSERT INTO aams_submissions (
    company_id, year, aams_value, submission_data, status, is_late,
    submitted_by, submitted_at, verified_by, verified_at, approved_by, approved_at
  ) VALUES (
    p_company_id, p_year, v_previous_submission.aams_value, v_previous_submission.submission_data, 
    'approved', true, -- Fallback is always considered late
    v_user_id, NOW(), v_user_id, NOW(), v_user_id, NOW()
  )
  RETURNING id INTO v_new_submission_id;
  
  -- Create thresholds for each SKU
  FOR v_item IN SELECT * FROM jsonb_array_elements(v_previous_submission.submission_data)
  LOOP
    v_sku_id := (v_item->>'sku_id')::uuid;
    v_aams_value := (v_item->>'quantity')::numeric / 12;
    v_multiplier := vci_get_b_multiplier(v_sku_id);
    v_threshold_value := vci_calculate_threshold(v_aams_value, v_sku_id);
    
    -- Mark existing as non-current
    UPDATE thresholds 
    SET is_current = false, updated_at = NOW()
    WHERE sku_id = v_sku_id AND is_current = true;
    
    -- Create new threshold
    INSERT INTO thresholds (
      sku_id, threshold_type, threshold_value, multiplier_b, aams_value,
      effective_from, is_current, created_by
    ) VALUES (
      v_sku_id, 'fallback', v_threshold_value, v_multiplier, v_aams_value,
      make_date(p_year, 3, 1), true, v_user_id
    );
  END LOOP;
  
  -- Audit log
  PERFORM shared_create_audit_log(v_user_id, 'CREATE', 'aams_submissions', v_new_submission_id,
    jsonb_build_object('action', 'fallback', 'previous_year', p_year - 1));
  
  -- Notify company
  PERFORM shared_batch_create_notifications(
    'aams_fallback_applied',
    'Previous Year AAMS Applied',
    'Due to no submission by March 1, previous year AAMS has been applied to your thresholds',
    '/dashboard/vci/aams/' || v_new_submission_id::text,
    (SELECT array_agg(id) FROM users WHERE company_id = p_company_id)
  );
  
  RETURN jsonb_build_object(
    'success', true,
    'submission_id', v_new_submission_id,
    'fallback_from_year', p_year - 1,
    'aams_value', v_previous_submission.aams_value
  );
END;
$$;

-- ============================================================================
-- Task 1.1.3.10 & 1.1.3.10a: AAMS Deadline Check (Scheduled Job)
-- ============================================================================

-- Function to check AAMS deadlines and apply fallbacks
CREATE OR REPLACE FUNCTION public.vci_check_aams_deadlines()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_current_year INTEGER;
  v_current_date DATE;
  v_company RECORD;
  v_companies_checked INTEGER := 0;
  v_fallbacks_applied INTEGER := 0;
  v_notifications_sent INTEGER := 0;
BEGIN
  v_current_year := EXTRACT(YEAR FROM CURRENT_DATE)::INTEGER;
  v_current_date := CURRENT_DATE;
  
  -- Check each company
  FOR v_company IN 
    SELECT DISTINCT c.id, c.name
    FROM companies c
    WHERE c.is_active = true
      AND c.company_type = 'ipc' -- Only IPCs submit AAMS
  LOOP
    v_companies_checked := v_companies_checked + 1;
    
    -- Check if company has submitted AAMS for current year
    IF NOT EXISTS (
      SELECT 1 FROM aams_submissions 
      WHERE company_id = v_company.id AND year = v_current_year AND status NOT IN ('rejected')
    ) THEN
      -- Task 1.1.3.8a: Check if past grace period (Feb 15)
      IF v_current_date > make_date(v_current_year, 2, 15) THEN
        -- Send compliance warning
        PERFORM shared_batch_create_notifications(
          'aams_compliance_violation',
          'AAMS Compliance Violation',
          'Your company has not submitted AAMS for ' || v_current_year || '. This is a compliance violation.',
          '/dashboard/vci/aams',
          (SELECT array_agg(id) FROM users WHERE company_id = v_company.id)
        );
        v_notifications_sent := v_notifications_sent + 1;
        
        -- Task 1.1.3.9: Apply fallback on March 1
        IF v_current_date >= make_date(v_current_year, 3, 1) THEN
          -- Check if fallback already applied
          IF NOT EXISTS (
            SELECT 1 FROM aams_submissions 
            WHERE company_id = v_company.id AND year = v_current_year
          ) THEN
            -- Apply previous year fallback (using system user context)
            PERFORM vci_apply_previous_year_fallback(v_company.id, v_current_year);
            v_fallbacks_applied := v_fallbacks_applied + 1;
          END IF;
        END IF;
      -- Task 1.1.3.8: Check if past deadline but within grace period (Jan 31 - Feb 15)
      ELSIF v_current_date > make_date(v_current_year, 1, 31) THEN
        -- Send grace period reminder
        PERFORM shared_batch_create_notifications(
          'aams_grace_period_warning',
          'AAMS Grace Period Warning',
          'Your company has not submitted AAMS. You have until February 15 to submit without compliance violation.',
          '/dashboard/vci/aams',
          (SELECT array_agg(id) FROM users WHERE company_id = v_company.id)
        );
        v_notifications_sent := v_notifications_sent + 1;
      END IF;
    END IF;
  END LOOP;
  
  RETURN jsonb_build_object(
    'success', true,
    'companies_checked', v_companies_checked,
    'notifications_sent', v_notifications_sent,
    'fallbacks_applied', v_fallbacks_applied,
    'check_date', v_current_date
  );
END;
$$;

-- Task 1.1.3.10a: pg_cron job setup (to be run manually by DBA)
-- This creates the scheduled job for AAMS deadline checks
-- Morocco timezone: Africa/Casablanca

COMMENT ON FUNCTION vci_check_aams_deadlines IS 'Task 1.1.3.10: AAMS deadline check function. Run daily via pg_cron.
To set up pg_cron job (run as superuser):
  SELECT cron.schedule(
    ''aams-deadline-check'',
    ''0 9 * * *'',  -- Run daily at 9 AM
    $$SELECT vci_check_aams_deadlines()$$
  );
  
  -- To set timezone for Morocco:
  UPDATE cron.job SET nodename = ''Africa/Casablanca'' WHERE jobname = ''aams-deadline-check'';
';

-- ============================================================================
-- Helper Functions for AAMS Queries
-- ============================================================================

-- List AAMS submissions
CREATE OR REPLACE FUNCTION public.vci_list_aams_submissions(
  p_company_id UUID DEFAULT NULL,
  p_year INTEGER DEFAULT NULL,
  p_status TEXT DEFAULT NULL,
  p_limit INTEGER DEFAULT 50,
  p_offset INTEGER DEFAULT 0
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
  v_user_role TEXT;
  v_user_company_id UUID;
  v_result JSONB;
  v_total INTEGER;
BEGIN
  v_user_id := auth.uid();
  SELECT role, company_id INTO v_user_role, v_user_company_id FROM users WHERE id = v_user_id;
  
  WITH filtered AS (
    SELECT 
      a.*,
      c.name as company_name,
      submitter.full_name as submitted_by_name,
      verifier.full_name as verified_by_name,
      approver.full_name as approved_by_name
    FROM aams_submissions a
    JOIN companies c ON c.id = a.company_id
    LEFT JOIN users submitter ON submitter.id = a.submitted_by
    LEFT JOIN users verifier ON verifier.id = a.verified_by
    LEFT JOIN users approver ON approver.id = a.approved_by
    WHERE (p_company_id IS NULL OR a.company_id = p_company_id)
      AND (p_year IS NULL OR a.year = p_year)
      AND (p_status IS NULL OR a.status = p_status)
      AND (v_user_role IN ('tier1', 'tier2_officer', 'tier2_registrar') OR a.company_id = v_user_company_id)
    ORDER BY a.created_at DESC
    LIMIT p_limit OFFSET p_offset
  )
  SELECT jsonb_agg(row_to_json(filtered)::jsonb) INTO v_result FROM filtered;
  
  SELECT COUNT(*) INTO v_total
  FROM aams_submissions a
  WHERE (p_company_id IS NULL OR a.company_id = p_company_id)
    AND (p_year IS NULL OR a.year = p_year)
    AND (p_status IS NULL OR a.status = p_status)
    AND (v_user_role IN ('tier1', 'tier2_officer', 'tier2_registrar') OR a.company_id = v_user_company_id);
  
  RETURN jsonb_build_object(
    'success', true,
    'submissions', COALESCE(v_result, '[]'::jsonb),
    'total', v_total
  );
END;
$$;

-- Get single AAMS submission
CREATE OR REPLACE FUNCTION public.vci_get_aams_submission(p_submission_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
  v_user_role TEXT;
  v_user_company_id UUID;
  v_submission RECORD;
  v_thresholds JSONB;
BEGIN
  v_user_id := auth.uid();
  SELECT role, company_id INTO v_user_role, v_user_company_id FROM users WHERE id = v_user_id;
  
  SELECT 
    a.*,
    c.name as company_name,
    submitter.full_name as submitted_by_name,
    verifier.full_name as verified_by_name,
    approver.full_name as approved_by_name
  INTO v_submission
  FROM aams_submissions a
  JOIN companies c ON c.id = a.company_id
  LEFT JOIN users submitter ON submitter.id = a.submitted_by
  LEFT JOIN users verifier ON verifier.id = a.verified_by
  LEFT JOIN users approver ON approver.id = a.approved_by
  WHERE a.id = p_submission_id;
  
  IF v_submission.id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Submission not found');
  END IF;
  
  -- Check access
  IF v_user_role NOT IN ('tier1', 'tier2_officer', 'tier2_registrar') AND v_submission.company_id != v_user_company_id THEN
    RETURN jsonb_build_object('success', false, 'error', 'Access denied');
  END IF;
  
  -- Get thresholds for this submission's SKUs (only if verified/approved)
  IF v_submission.status IN ('verified', 'approved', 'completed') THEN
    SELECT jsonb_agg(jsonb_build_object(
      'sku_id', t.sku_id,
      'sku_name', s.name,
      'threshold_value', t.threshold_value,
      'multiplier_b', t.multiplier_b,
      'aams_value', t.aams_value,
      'is_current', t.is_current
    )) INTO v_thresholds
    FROM thresholds t
    JOIN skus s ON s.id = t.sku_id
    WHERE t.sku_id IN (
      SELECT (item->>'sku_id')::uuid 
      FROM jsonb_array_elements(v_submission.submission_data) AS item
    ) AND t.effective_from = make_date(v_submission.year, 1, 1);
  END IF;
  
  RETURN jsonb_build_object(
    'success', true, 
    'submission', row_to_json(v_submission)::jsonb,
    'thresholds', COALESCE(v_thresholds, '[]'::jsonb)
  );
END;
$$;

-- List thresholds
CREATE OR REPLACE FUNCTION public.vci_list_thresholds(
  p_sku_id UUID DEFAULT NULL,
  p_company_id UUID DEFAULT NULL,
  p_is_current BOOLEAN DEFAULT NULL,
  p_limit INTEGER DEFAULT 50,
  p_offset INTEGER DEFAULT 0
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
  v_user_role TEXT;
  v_result JSONB;
  v_total INTEGER;
BEGIN
  v_user_id := auth.uid();
  SELECT role INTO v_user_role FROM users WHERE id = v_user_id;
  
  -- MOH can view all thresholds
  IF v_user_role NOT IN ('tier1', 'tier2_officer', 'tier2_registrar') THEN
    RETURN jsonb_build_object('success', false, 'error', 'Insufficient permissions');
  END IF;
  
  WITH filtered AS (
    SELECT 
      t.*,
      s.name as sku_name,
      s.sku_code,
      s.dosage_strength,
      s.dosage_form,
      p.name as product_name,
      p.is_critical_medicine,
      c.name as company_name,
      creator.full_name as created_by_name
    FROM thresholds t
    JOIN skus s ON s.id = t.sku_id
    JOIN products p ON p.id = s.product_id
    JOIN companies c ON c.id = p.company_id
    LEFT JOIN users creator ON creator.id = t.created_by
    WHERE (p_sku_id IS NULL OR t.sku_id = p_sku_id)
      AND (p_company_id IS NULL OR c.id = p_company_id)
      AND (p_is_current IS NULL OR t.is_current = p_is_current)
    ORDER BY t.created_at DESC
    LIMIT p_limit OFFSET p_offset
  )
  SELECT jsonb_agg(row_to_json(filtered)::jsonb) INTO v_result FROM filtered;
  
  SELECT COUNT(*) INTO v_total
  FROM thresholds t
  JOIN skus s ON s.id = t.sku_id
  JOIN products p ON p.id = s.product_id
  JOIN companies c ON c.id = p.company_id
  WHERE (p_sku_id IS NULL OR t.sku_id = p_sku_id)
    AND (p_company_id IS NULL OR c.id = p_company_id)
    AND (p_is_current IS NULL OR t.is_current = p_is_current);
  
  RETURN jsonb_build_object(
    'success', true,
    'thresholds', COALESCE(v_result, '[]'::jsonb),
    'total', v_total
  );
END;
$$;

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON FUNCTION vci_submit_aams IS 'Task 1.1.3.1: Submit AAMS for a year';
COMMENT ON FUNCTION vci_verify_aams IS 'Task 1.1.3.2: Tier 2 verification with threshold calculation';
COMMENT ON FUNCTION vci_approve_aams_threshold IS 'Task 1.1.3.3: Tier 1 approval of AAMS thresholds';
COMMENT ON FUNCTION vci_complete_aams_submission IS 'Task 1.1.3.4: Complete AAMS submission';
COMMENT ON FUNCTION vci_reject_aams_submission IS 'Task 1.1.3.5: Reject AAMS submission';
COMMENT ON FUNCTION vci_calculate_threshold IS 'Task 1.1.3.6: Calculate threshold (B × AAMS)';
COMMENT ON FUNCTION vci_get_b_multiplier IS 'Task 1.1.3.6: Get B multiplier (3 standard, 3.5 critical)';
COMMENT ON FUNCTION vci_modify_threshold IS 'Task 1.1.3.7: Modify thresholds (local/global, non-retroactive)';
COMMENT ON FUNCTION vci_get_multiplier_advisory IS 'Task 1.1.3.7a: Advisory suggestions for B/C multipliers';
COMMENT ON FUNCTION vci_is_aams_late IS 'Task 1.1.3.8: Check if AAMS is late (after Jan 31)';
COMMENT ON FUNCTION vci_is_within_grace_period IS 'Task 1.1.3.8a: Check grace period (Feb 1-15)';
COMMENT ON FUNCTION vci_is_compliance_violation IS 'Task 1.1.3.8a: Check compliance violation (after Feb 15)';
COMMENT ON FUNCTION vci_apply_previous_year_fallback IS 'Task 1.1.3.9: Apply previous year AAMS fallback';
COMMENT ON FUNCTION vci_check_aams_deadlines IS 'Task 1.1.3.10: Scheduled AAMS deadline check';
