-- ============================================================================
-- Task 1.1.2.31 - 1.1.2.36: Enforcement RPC Functions
-- Enforcement action workflow management
-- ============================================================================

-- ============================================================================
-- ENFORCEMENT ACTIONS TABLE (if not exists)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.enforcement_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id),
  action_type TEXT NOT NULL CHECK (action_type IN ('warning', 'fine', 'suspension', 'license_revocation')),
  violation_type TEXT NOT NULL,
  violation_id UUID, -- Optional reference to specific violation (breach, non-compliance, etc.)
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN (
    'draft', 'pending_review', 'pending_approval', 'approved', 
    'executed', 'appealed', 'appeal_upheld', 'appeal_rejected', 
    'resolved', 'cancelled'
  )),
  -- Action details
  legal_basis TEXT NOT NULL,
  justification TEXT NOT NULL,
  fine_amount DECIMAL(15,2), -- Required for fine type
  fine_currency TEXT DEFAULT 'MAD',
  suspension_start_date DATE,
  suspension_end_date DATE,
  -- Workflow tracking
  created_by UUID NOT NULL REFERENCES public.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  -- Review stage
  reviewed_by UUID REFERENCES public.users(id),
  reviewed_at TIMESTAMPTZ,
  review_notes TEXT,
  -- Approval stage
  approved_by UUID REFERENCES public.users(id),
  approved_at TIMESTAMPTZ,
  approval_notes TEXT,
  -- Execution stage
  executed_by UUID REFERENCES public.users(id),
  executed_at TIMESTAMPTZ,
  execution_notes TEXT,
  -- Appeal stage
  appeal_submitted_at TIMESTAMPTZ,
  appeal_grounds TEXT,
  appeal_explanation TEXT,
  appeal_resolved_at TIMESTAMPTZ,
  appeal_resolved_by UUID REFERENCES public.users(id),
  appeal_resolution TEXT CHECK (appeal_resolution IN ('upheld', 'rejected', 'partially_upheld')),
  appeal_resolution_notes TEXT,
  -- Metadata
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_enforcement_actions_company ON public.enforcement_actions(company_id);
CREATE INDEX IF NOT EXISTS idx_enforcement_actions_status ON public.enforcement_actions(status);
CREATE INDEX IF NOT EXISTS idx_enforcement_actions_type ON public.enforcement_actions(action_type);
CREATE INDEX IF NOT EXISTS idx_enforcement_actions_created_at ON public.enforcement_actions(created_at);

-- Updated at trigger
DROP TRIGGER IF EXISTS update_enforcement_actions_updated_at ON public.enforcement_actions;
CREATE TRIGGER update_enforcement_actions_updated_at
  BEFORE UPDATE ON public.enforcement_actions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS Policies
ALTER TABLE public.enforcement_actions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "MOH can view all enforcement actions" ON public.enforcement_actions;
CREATE POLICY "MOH can view all enforcement actions" ON public.enforcement_actions
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('tier1', 'tier2_officer', 'tier2_registrar'))
  );

DROP POLICY IF EXISTS "Companies can view their enforcement actions" ON public.enforcement_actions;
CREATE POLICY "Companies can view their enforcement actions" ON public.enforcement_actions
  FOR SELECT USING (
    company_id = (SELECT company_id FROM users WHERE id = auth.uid())
  );

DROP POLICY IF EXISTS "MOH can manage enforcement actions" ON public.enforcement_actions;
CREATE POLICY "MOH can manage enforcement actions" ON public.enforcement_actions
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('tier1', 'tier2_officer', 'tier2_registrar'))
  );

-- ============================================================================
-- Task 1.1.2.31: Submit for Review
-- ============================================================================

CREATE OR REPLACE FUNCTION public.enforcement_submit_for_review(
  p_company_id UUID,
  p_action_type TEXT,
  p_violation_type TEXT,
  p_legal_basis TEXT,
  p_justification TEXT,
  p_fine_amount DECIMAL DEFAULT NULL,
  p_suspension_start_date DATE DEFAULT NULL,
  p_suspension_end_date DATE DEFAULT NULL,
  p_violation_id UUID DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
  v_user_role TEXT;
  v_action_id UUID;
BEGIN
  v_user_id := auth.uid();
  SELECT role INTO v_user_role FROM users WHERE id = v_user_id;
  
  -- Validate permissions based on action type
  -- Tier 2 can only submit warnings
  -- Tier 1 can submit any action type
  IF v_user_role NOT IN ('tier1', 'tier2_officer', 'tier2_registrar') THEN
    RETURN jsonb_build_object('success', false, 'error', 'Insufficient permissions');
  END IF;
  
  IF v_user_role IN ('tier2_officer', 'tier2_registrar') AND p_action_type != 'warning' THEN
    RETURN jsonb_build_object('success', false, 'error', 'Tier 2 can only submit warnings. Fines and suspensions require Tier 1.');
  END IF;
  
  -- Validate action type
  IF p_action_type NOT IN ('warning', 'fine', 'suspension', 'license_revocation') THEN
    RETURN jsonb_build_object('success', false, 'error', 'Invalid action type');
  END IF;
  
  -- Validate fine amount for fine actions
  IF p_action_type = 'fine' AND (p_fine_amount IS NULL OR p_fine_amount <= 0) THEN
    RETURN jsonb_build_object('success', false, 'error', 'Fine amount is required for fine actions');
  END IF;
  
  -- Validate suspension dates for suspension actions
  IF p_action_type = 'suspension' THEN
    IF p_suspension_start_date IS NULL OR p_suspension_end_date IS NULL THEN
      RETURN jsonb_build_object('success', false, 'error', 'Suspension dates are required for suspension actions');
    END IF;
    IF p_suspension_end_date <= p_suspension_start_date THEN
      RETURN jsonb_build_object('success', false, 'error', 'Suspension end date must be after start date');
    END IF;
  END IF;
  
  -- Validate justification length (50+ chars per Task 1.1.2.15a)
  IF LENGTH(p_justification) < 50 THEN
    RETURN jsonb_build_object('success', false, 'error', 'Justification must be at least 50 characters');
  END IF;
  
  -- Validate company exists
  IF NOT EXISTS (SELECT 1 FROM companies WHERE id = p_company_id) THEN
    RETURN jsonb_build_object('success', false, 'error', 'Company not found');
  END IF;
  
  -- Create enforcement action
  INSERT INTO enforcement_actions (
    company_id, action_type, violation_type, violation_id,
    legal_basis, justification, fine_amount,
    suspension_start_date, suspension_end_date,
    status, created_by
  ) VALUES (
    p_company_id, p_action_type, p_violation_type, p_violation_id,
    p_legal_basis, p_justification, p_fine_amount,
    p_suspension_start_date, p_suspension_end_date,
    'pending_review', v_user_id
  )
  RETURNING id INTO v_action_id;
  
  -- Create approval record
  INSERT INTO approvals (submission_id, submission_type, from_status, to_status, approver_id, approval_type)
  VALUES (v_action_id, 'enforcement_action', 'draft', 'pending_review', v_user_id, 'submit');
  
  -- Audit log
  PERFORM shared_create_audit_log(v_user_id, 'CREATE', 'enforcement_actions', v_action_id,
    jsonb_build_object('action_type', p_action_type, 'status', 'pending_review'));
  
  -- Notify Tier 2 officers for review
  PERFORM shared_batch_create_notifications(
    'enforcement_pending_review',
    'Enforcement Action Pending Review',
    'A new enforcement action requires review',
    '/dashboard/enforcement/actions/' || v_action_id::text,
    (SELECT array_agg(id) FROM users WHERE role IN ('tier2_officer', 'tier2_registrar'))
  );
  
  RETURN jsonb_build_object(
    'success', true,
    'action_id', v_action_id,
    'status', 'pending_review'
  );
END;
$$;

-- ============================================================================
-- Task 1.1.2.32: Review Action (Tier 2)
-- ============================================================================

CREATE OR REPLACE FUNCTION public.enforcement_review_action(
  p_action_id UUID,
  p_approve BOOLEAN,
  p_review_notes TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
  v_user_role TEXT;
  v_action RECORD;
  v_new_status TEXT;
BEGIN
  v_user_id := auth.uid();
  SELECT role INTO v_user_role FROM users WHERE id = v_user_id;
  
  -- Only Tier 2 can review
  IF v_user_role NOT IN ('tier2_officer', 'tier2_registrar') THEN
    RETURN jsonb_build_object('success', false, 'error', 'Only Tier 2 can review enforcement actions');
  END IF;
  
  -- Get action
  SELECT * INTO v_action FROM enforcement_actions WHERE id = p_action_id;
  
  IF v_action.id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Enforcement action not found');
  END IF;
  
  IF v_action.status != 'pending_review' THEN
    RETURN jsonb_build_object('success', false, 'error', 'Action is not pending review');
  END IF;
  
  -- Validate review notes
  IF LENGTH(COALESCE(p_review_notes, '')) < 10 THEN
    RETURN jsonb_build_object('success', false, 'error', 'Review notes are required (minimum 10 characters)');
  END IF;
  
  -- Determine next status
  -- For warnings: Tier 2 approval is final (pending_approval -> approved by same function call pattern)
  -- For fines/suspensions: Forward to Tier 1
  IF p_approve THEN
    IF v_action.action_type = 'warning' THEN
      v_new_status := 'approved'; -- Tier 2 is final for warnings
    ELSE
      v_new_status := 'pending_approval'; -- Tier 1 required for fines/suspensions
    END IF;
  ELSE
    v_new_status := 'draft'; -- Return to draft for revision
  END IF;
  
  -- Update action
  UPDATE enforcement_actions SET
    status = v_new_status,
    reviewed_by = v_user_id,
    reviewed_at = NOW(),
    review_notes = p_review_notes,
    updated_at = NOW()
  WHERE id = p_action_id;
  
  -- Create approval record
  INSERT INTO approvals (submission_id, submission_type, from_status, to_status, approver_id, approval_type, comments)
  VALUES (p_action_id, 'enforcement_action', 'pending_review', v_new_status, v_user_id, 'review', p_review_notes);
  
  -- Audit log
  PERFORM shared_create_audit_log(v_user_id, 'UPDATE', 'enforcement_actions', p_action_id,
    jsonb_build_object('from_status', 'pending_review', 'to_status', v_new_status, 'approved', p_approve));
  
  -- Notifications
  IF v_new_status = 'pending_approval' THEN
    -- Notify Tier 1 for approval
    PERFORM shared_batch_create_notifications(
      'enforcement_pending_approval',
      'Enforcement Action Pending Approval',
      'An enforcement action requires Tier 1 approval',
      '/dashboard/enforcement/actions/' || p_action_id::text,
      (SELECT array_agg(id) FROM users WHERE role = 'tier1')
    );
  ELSIF v_new_status = 'approved' THEN
    -- Notify creator that warning is approved
    PERFORM shared_create_notification(
      'enforcement_approved',
      'Enforcement Action Approved',
      'Your warning has been approved and is ready for execution',
      '/dashboard/enforcement/actions/' || p_action_id::text,
      v_action.created_by
    );
  END IF;
  
  RETURN jsonb_build_object(
    'success', true,
    'action_id', p_action_id,
    'status', v_new_status
  );
END;
$$;

-- ============================================================================
-- Task 1.1.2.33: Approve Action (Tier 1)
-- ============================================================================

CREATE OR REPLACE FUNCTION public.enforcement_approve_action(
  p_action_id UUID,
  p_approve BOOLEAN,
  p_approval_notes TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
  v_user_role TEXT;
  v_action RECORD;
  v_new_status TEXT;
BEGIN
  v_user_id := auth.uid();
  SELECT role INTO v_user_role FROM users WHERE id = v_user_id;
  
  -- Only Tier 1 can approve fines/suspensions
  IF v_user_role != 'tier1' THEN
    RETURN jsonb_build_object('success', false, 'error', 'Only Tier 1 can approve fines and suspensions');
  END IF;
  
  -- Get action
  SELECT * INTO v_action FROM enforcement_actions WHERE id = p_action_id;
  
  IF v_action.id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Enforcement action not found');
  END IF;
  
  IF v_action.status != 'pending_approval' THEN
    RETURN jsonb_build_object('success', false, 'error', 'Action is not pending approval');
  END IF;
  
  -- Validate approval notes
  IF LENGTH(COALESCE(p_approval_notes, '')) < 10 THEN
    RETURN jsonb_build_object('success', false, 'error', 'Approval notes are required (minimum 10 characters)');
  END IF;
  
  -- Determine next status
  IF p_approve THEN
    v_new_status := 'approved';
  ELSE
    v_new_status := 'pending_review'; -- Return to Tier 2 for revision
  END IF;
  
  -- Update action
  UPDATE enforcement_actions SET
    status = v_new_status,
    approved_by = CASE WHEN p_approve THEN v_user_id ELSE approved_by END,
    approved_at = CASE WHEN p_approve THEN NOW() ELSE approved_at END,
    approval_notes = p_approval_notes,
    updated_at = NOW()
  WHERE id = p_action_id;
  
  -- Create approval record
  INSERT INTO approvals (submission_id, submission_type, from_status, to_status, approver_id, approval_type, comments)
  VALUES (p_action_id, 'enforcement_action', 'pending_approval', v_new_status, v_user_id, 'approve', p_approval_notes);
  
  -- Audit log
  PERFORM shared_create_audit_log(v_user_id, 'UPDATE', 'enforcement_actions', p_action_id,
    jsonb_build_object('from_status', 'pending_approval', 'to_status', v_new_status, 'approved', p_approve));
  
  -- Notifications
  IF v_new_status = 'approved' THEN
    PERFORM shared_create_notification(
      'enforcement_approved',
      'Enforcement Action Approved',
      'The enforcement action has been approved and is ready for execution',
      '/dashboard/enforcement/actions/' || p_action_id::text,
      v_action.created_by
    );
  END IF;
  
  RETURN jsonb_build_object(
    'success', true,
    'action_id', p_action_id,
    'status', v_new_status
  );
END;
$$;

-- ============================================================================
-- Task 1.1.2.34: Execute Action
-- ============================================================================

CREATE OR REPLACE FUNCTION public.enforcement_execute_action(
  p_action_id UUID,
  p_execution_notes TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
  v_user_role TEXT;
  v_action RECORD;
BEGIN
  v_user_id := auth.uid();
  SELECT role INTO v_user_role FROM users WHERE id = v_user_id;
  
  -- MOH can execute
  IF v_user_role NOT IN ('tier1', 'tier2_officer', 'tier2_registrar') THEN
    RETURN jsonb_build_object('success', false, 'error', 'Insufficient permissions');
  END IF;
  
  -- Get action
  SELECT * INTO v_action FROM enforcement_actions WHERE id = p_action_id;
  
  IF v_action.id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Enforcement action not found');
  END IF;
  
  IF v_action.status != 'approved' THEN
    RETURN jsonb_build_object('success', false, 'error', 'Action is not approved for execution');
  END IF;
  
  -- Update action
  UPDATE enforcement_actions SET
    status = 'executed',
    executed_by = v_user_id,
    executed_at = NOW(),
    execution_notes = p_execution_notes,
    updated_at = NOW()
  WHERE id = p_action_id;
  
  -- Apply enforcement effects based on type
  IF v_action.action_type = 'suspension' THEN
    -- Suspend the company
    UPDATE companies SET
      is_active = false,
      suspended_at = NOW(),
      suspended_by = v_user_id,
      suspended_reason = 'Enforcement action: ' || v_action.violation_type,
      updated_at = NOW()
    WHERE id = v_action.company_id;
  END IF;
  
  -- Create approval record
  INSERT INTO approvals (submission_id, submission_type, from_status, to_status, approver_id, approval_type, comments)
  VALUES (p_action_id, 'enforcement_action', 'approved', 'executed', v_user_id, 'execute', p_execution_notes);
  
  -- Audit log
  PERFORM shared_create_audit_log(v_user_id, 'UPDATE', 'enforcement_actions', p_action_id,
    jsonb_build_object('from_status', 'approved', 'to_status', 'executed', 'action_type', v_action.action_type));
  
  -- Notify company
  PERFORM shared_batch_create_notifications(
    'enforcement_executed',
    'Enforcement Action Executed',
    'An enforcement action has been executed against your company',
    '/dashboard/enforcement/actions/' || p_action_id::text,
    (SELECT array_agg(u.id) FROM users u WHERE u.company_id = v_action.company_id)
  );
  
  RETURN jsonb_build_object(
    'success', true,
    'action_id', p_action_id,
    'status', 'executed'
  );
END;
$$;

-- ============================================================================
-- Task 1.1.2.35: Appeal Action (Company)
-- ============================================================================

CREATE OR REPLACE FUNCTION public.enforcement_appeal_action(
  p_action_id UUID,
  p_appeal_grounds TEXT,
  p_appeal_explanation TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
  v_user_company_id UUID;
  v_action RECORD;
  v_days_since_execution INTEGER;
BEGIN
  v_user_id := auth.uid();
  SELECT company_id INTO v_user_company_id FROM users WHERE id = v_user_id;
  
  -- Get action
  SELECT * INTO v_action FROM enforcement_actions WHERE id = p_action_id;
  
  IF v_action.id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Enforcement action not found');
  END IF;
  
  -- Check company ownership
  IF v_action.company_id != v_user_company_id THEN
    RETURN jsonb_build_object('success', false, 'error', 'You can only appeal enforcement actions against your company');
  END IF;
  
  IF v_action.status != 'executed' THEN
    RETURN jsonb_build_object('success', false, 'error', 'Can only appeal executed enforcement actions');
  END IF;
  
  -- Check 30-day appeal window
  v_days_since_execution := EXTRACT(DAY FROM (NOW() - v_action.executed_at));
  IF v_days_since_execution > 30 THEN
    RETURN jsonb_build_object('success', false, 'error', 'Appeal window has expired (30 days)');
  END IF;
  
  -- Validate appeal grounds and explanation
  IF LENGTH(COALESCE(p_appeal_grounds, '')) < 20 THEN
    RETURN jsonb_build_object('success', false, 'error', 'Appeal grounds are required (minimum 20 characters)');
  END IF;
  
  IF LENGTH(COALESCE(p_appeal_explanation, '')) < 50 THEN
    RETURN jsonb_build_object('success', false, 'error', 'Appeal explanation is required (minimum 50 characters)');
  END IF;
  
  -- Update action
  UPDATE enforcement_actions SET
    status = 'appealed',
    appeal_submitted_at = NOW(),
    appeal_grounds = p_appeal_grounds,
    appeal_explanation = p_appeal_explanation,
    updated_at = NOW()
  WHERE id = p_action_id;
  
  -- Create approval record
  INSERT INTO approvals (submission_id, submission_type, from_status, to_status, approver_id, approval_type, comments)
  VALUES (p_action_id, 'enforcement_action', 'executed', 'appealed', v_user_id, 'appeal', p_appeal_grounds);
  
  -- Audit log
  PERFORM shared_create_audit_log(v_user_id, 'UPDATE', 'enforcement_actions', p_action_id,
    jsonb_build_object('from_status', 'executed', 'to_status', 'appealed'));
  
  -- Notify Tier 1 for appeal review
  PERFORM shared_batch_create_notifications(
    'enforcement_appeal_submitted',
    'Enforcement Appeal Submitted',
    'A company has submitted an appeal for an enforcement action',
    '/dashboard/enforcement/actions/' || p_action_id::text,
    (SELECT array_agg(id) FROM users WHERE role = 'tier1')
  );
  
  RETURN jsonb_build_object(
    'success', true,
    'action_id', p_action_id,
    'status', 'appealed',
    'days_remaining', 30 - v_days_since_execution
  );
END;
$$;

-- ============================================================================
-- Task 1.1.2.36: Resolve Appeal (Tier 1)
-- ============================================================================

CREATE OR REPLACE FUNCTION public.enforcement_resolve_appeal(
  p_action_id UUID,
  p_resolution TEXT,
  p_resolution_notes TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
  v_user_role TEXT;
  v_action RECORD;
  v_new_status TEXT;
BEGIN
  v_user_id := auth.uid();
  SELECT role INTO v_user_role FROM users WHERE id = v_user_id;
  
  -- Only Tier 1 can resolve appeals
  IF v_user_role != 'tier1' THEN
    RETURN jsonb_build_object('success', false, 'error', 'Only Tier 1 can resolve appeals');
  END IF;
  
  -- Get action
  SELECT * INTO v_action FROM enforcement_actions WHERE id = p_action_id;
  
  IF v_action.id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Enforcement action not found');
  END IF;
  
  IF v_action.status != 'appealed' THEN
    RETURN jsonb_build_object('success', false, 'error', 'Action is not under appeal');
  END IF;
  
  -- Validate resolution
  IF p_resolution NOT IN ('upheld', 'rejected', 'partially_upheld') THEN
    RETURN jsonb_build_object('success', false, 'error', 'Invalid resolution. Must be upheld, rejected, or partially_upheld');
  END IF;
  
  -- Validate resolution notes
  IF LENGTH(COALESCE(p_resolution_notes, '')) < 50 THEN
    RETURN jsonb_build_object('success', false, 'error', 'Resolution notes are required (minimum 50 characters)');
  END IF;
  
  -- Determine new status based on resolution
  IF p_resolution = 'upheld' THEN
    v_new_status := 'appeal_upheld'; -- Appeal successful, action reversed
  ELSE
    v_new_status := 'appeal_rejected'; -- Appeal failed, action stands
  END IF;
  
  -- Update action
  UPDATE enforcement_actions SET
    status = v_new_status,
    appeal_resolved_at = NOW(),
    appeal_resolved_by = v_user_id,
    appeal_resolution = p_resolution,
    appeal_resolution_notes = p_resolution_notes,
    updated_at = NOW()
  WHERE id = p_action_id;
  
  -- If appeal upheld, reverse effects
  IF p_resolution = 'upheld' THEN
    -- If suspension was applied, reverse it
    IF v_action.action_type = 'suspension' THEN
      UPDATE companies SET
        is_active = true,
        suspended_at = NULL,
        suspended_by = NULL,
        suspended_reason = NULL,
        updated_at = NOW()
      WHERE id = v_action.company_id;
    END IF;
  END IF;
  
  -- Create approval record
  INSERT INTO approvals (submission_id, submission_type, from_status, to_status, approver_id, approval_type, comments)
  VALUES (p_action_id, 'enforcement_action', 'appealed', v_new_status, v_user_id, 'resolve_appeal', p_resolution_notes);
  
  -- Audit log
  PERFORM shared_create_audit_log(v_user_id, 'UPDATE', 'enforcement_actions', p_action_id,
    jsonb_build_object('from_status', 'appealed', 'to_status', v_new_status, 'resolution', p_resolution));
  
  -- Notify company
  PERFORM shared_batch_create_notifications(
    'enforcement_appeal_resolved',
    'Appeal Resolution',
    CASE 
      WHEN p_resolution = 'upheld' THEN 'Your appeal has been upheld. The enforcement action has been reversed.'
      WHEN p_resolution = 'partially_upheld' THEN 'Your appeal has been partially upheld. Please review the resolution notes.'
      ELSE 'Your appeal has been rejected. The enforcement action remains in effect.'
    END,
    '/dashboard/enforcement/actions/' || p_action_id::text,
    (SELECT array_agg(u.id) FROM users u WHERE u.company_id = v_action.company_id)
  );
  
  RETURN jsonb_build_object(
    'success', true,
    'action_id', p_action_id,
    'status', v_new_status,
    'resolution', p_resolution
  );
END;
$$;

-- ============================================================================
-- Helper Functions for Enforcement
-- ============================================================================

-- List enforcement actions
CREATE OR REPLACE FUNCTION public.enforcement_list_actions(
  p_company_id UUID DEFAULT NULL,
  p_status TEXT DEFAULT NULL,
  p_action_type TEXT DEFAULT NULL,
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
      ea.*,
      c.name as company_name,
      creator.full_name as created_by_name,
      reviewer.full_name as reviewed_by_name,
      approver.full_name as approved_by_name
    FROM enforcement_actions ea
    JOIN companies c ON c.id = ea.company_id
    LEFT JOIN users creator ON creator.id = ea.created_by
    LEFT JOIN users reviewer ON reviewer.id = ea.reviewed_by
    LEFT JOIN users approver ON approver.id = ea.approved_by
    WHERE (p_company_id IS NULL OR ea.company_id = p_company_id)
      AND (p_status IS NULL OR ea.status = p_status)
      AND (p_action_type IS NULL OR ea.action_type = p_action_type)
      AND (v_user_role IN ('tier1', 'tier2_officer', 'tier2_registrar') OR ea.company_id = v_user_company_id)
    ORDER BY ea.created_at DESC
    LIMIT p_limit OFFSET p_offset
  )
  SELECT jsonb_agg(row_to_json(filtered)::jsonb) INTO v_result FROM filtered;
  
  SELECT COUNT(*) INTO v_total
  FROM enforcement_actions ea
  WHERE (p_company_id IS NULL OR ea.company_id = p_company_id)
    AND (p_status IS NULL OR ea.status = p_status)
    AND (p_action_type IS NULL OR ea.action_type = p_action_type)
    AND (v_user_role IN ('tier1', 'tier2_officer', 'tier2_registrar') OR ea.company_id = v_user_company_id);
  
  RETURN jsonb_build_object(
    'success', true,
    'actions', COALESCE(v_result, '[]'::jsonb),
    'total', v_total
  );
END;
$$;

-- Get enforcement action
CREATE OR REPLACE FUNCTION public.enforcement_get_action(p_action_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
  v_user_role TEXT;
  v_user_company_id UUID;
  v_action RECORD;
BEGIN
  v_user_id := auth.uid();
  SELECT role, company_id INTO v_user_role, v_user_company_id FROM users WHERE id = v_user_id;
  
  SELECT 
    ea.*,
    c.name as company_name,
    creator.full_name as created_by_name,
    reviewer.full_name as reviewed_by_name,
    approver.full_name as approved_by_name,
    executor.full_name as executed_by_name,
    resolver.full_name as appeal_resolved_by_name
  INTO v_action
  FROM enforcement_actions ea
  JOIN companies c ON c.id = ea.company_id
  LEFT JOIN users creator ON creator.id = ea.created_by
  LEFT JOIN users reviewer ON reviewer.id = ea.reviewed_by
  LEFT JOIN users approver ON approver.id = ea.approved_by
  LEFT JOIN users executor ON executor.id = ea.executed_by
  LEFT JOIN users resolver ON resolver.id = ea.appeal_resolved_by
  WHERE ea.id = p_action_id;
  
  IF v_action.id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Enforcement action not found');
  END IF;
  
  -- Check access
  IF v_user_role NOT IN ('tier1', 'tier2_officer', 'tier2_registrar') AND v_action.company_id != v_user_company_id THEN
    RETURN jsonb_build_object('success', false, 'error', 'Access denied');
  END IF;
  
  RETURN jsonb_build_object('success', true, 'action', row_to_json(v_action)::jsonb);
END;
$$;

-- Get enforcement statistics
CREATE OR REPLACE FUNCTION public.enforcement_get_statistics(
  p_company_id UUID DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
  v_user_role TEXT;
  v_stats JSONB;
BEGIN
  v_user_id := auth.uid();
  SELECT role INTO v_user_role FROM users WHERE id = v_user_id;
  
  IF v_user_role NOT IN ('tier1', 'tier2_officer', 'tier2_registrar') THEN
    RETURN jsonb_build_object('success', false, 'error', 'Insufficient permissions');
  END IF;
  
  SELECT jsonb_build_object(
    'total', COUNT(*),
    'by_status', jsonb_object_agg(COALESCE(status, 'unknown'), status_count),
    'by_type', (
      SELECT jsonb_object_agg(action_type, type_count)
      FROM (SELECT action_type, COUNT(*) as type_count FROM enforcement_actions 
            WHERE (p_company_id IS NULL OR company_id = p_company_id)
            GROUP BY action_type) t
    ),
    'pending_review', (SELECT COUNT(*) FROM enforcement_actions WHERE status = 'pending_review'),
    'pending_approval', (SELECT COUNT(*) FROM enforcement_actions WHERE status = 'pending_approval'),
    'pending_appeals', (SELECT COUNT(*) FROM enforcement_actions WHERE status = 'appealed'),
    'this_month', (SELECT COUNT(*) FROM enforcement_actions WHERE created_at >= date_trunc('month', CURRENT_DATE)),
    'total_fines', (SELECT COALESCE(SUM(fine_amount), 0) FROM enforcement_actions WHERE action_type = 'fine' AND status IN ('executed', 'appeal_rejected'))
  ) INTO v_stats
  FROM (
    SELECT status, COUNT(*) as status_count 
    FROM enforcement_actions 
    WHERE (p_company_id IS NULL OR company_id = p_company_id)
    GROUP BY status
  ) s;
  
  RETURN jsonb_build_object('success', true, 'statistics', v_stats);
END;
$$;

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE enforcement_actions IS 'Enforcement actions (warnings, fines, suspensions) against companies';
COMMENT ON FUNCTION enforcement_submit_for_review IS 'Task 1.1.2.31: Submit enforcement action for review';
COMMENT ON FUNCTION enforcement_review_action IS 'Task 1.1.2.32: Tier 2 review of enforcement action';
COMMENT ON FUNCTION enforcement_approve_action IS 'Task 1.1.2.33: Tier 1 approval of enforcement action';
COMMENT ON FUNCTION enforcement_execute_action IS 'Task 1.1.2.34: Execute approved enforcement action';
COMMENT ON FUNCTION enforcement_appeal_action IS 'Task 1.1.2.35: Company appeals executed action';
COMMENT ON FUNCTION enforcement_resolve_appeal IS 'Task 1.1.2.36: Tier 1 resolves appeal';
