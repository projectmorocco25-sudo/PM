-- Migration: create_enforcement_workflow_rpc_functions
-- Description: Create Enforcement workflow RPC functions (Tasks 1.1.2.31-1.1.2.36)
-- Date: 2026-01-23
-- Tasks: 1.1.2.31, 1.1.2.32, 1.1.2.33, 1.1.2.34, 1.1.2.35, 1.1.2.36
-- Author: Sami (Implementation Compliance Specialist)
-- Dependencies: Task 1.1.1.7 (enforcement_actions, enforcement_action_appeals tables must exist), Task 1.1.1.2 (approvals, approval_history tables must exist)

BEGIN;

-- ============================================================================
-- Update enforcement_actions status enum to match workflow
-- Purpose: Align status values with workflow described in tasks
-- ============================================================================

-- Drop existing constraint
ALTER TABLE enforcement_actions DROP CONSTRAINT IF EXISTS enforcement_actions_status_check;

-- Add constraint with workflow-aligned status values
ALTER TABLE enforcement_actions ADD CONSTRAINT enforcement_actions_status_check
    CHECK (status IN (
        'draft',
        'submitted',
        'tier2_reviewed',
        'tier1_approved',
        'executed',
        'appealed',
        'resolved',
        'cancelled'
    ));

-- ============================================================================
-- Task 1.1.2.31: enforcement_create_action, enforcement_submit_action
-- Purpose: Create and submit enforcement action for review
-- State Transition: draft → submitted
-- Access Control: MOH Tier 1 and System Admin can create/submit
-- ============================================================================

CREATE OR REPLACE FUNCTION enforcement_create_action(
    creator_user_id uuid,
    company_id uuid,
    action_type text,
    violation_type text,
    legal_basis text,
    justification text,
    violation_reference_id uuid DEFAULT NULL,
    violation_reference_table text DEFAULT NULL,
    amount numeric(15,2) DEFAULT NULL,
    currency text DEFAULT 'MAD',
    notes text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_user_record RECORD;
    v_company_record RECORD;
    v_action_id uuid;
    v_action jsonb;
BEGIN
    -- Get user record and verify user exists
    SELECT u.id, u.role, u.is_active
    INTO v_user_record
    FROM users u
    WHERE u.id = creator_user_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'User not found';
    END IF;

    IF NOT v_user_record.is_active THEN
        RAISE EXCEPTION 'User is not active';
    END IF;

    -- Access control: Only MOH Tier 1 and System Admin can create enforcement actions
    IF v_user_record.role NOT IN ('tier1', 'system_admin') THEN
        RAISE EXCEPTION 'Insufficient permissions: Only MOH Tier 1 or System Admin can create enforcement actions';
    END IF;

    -- Verify company exists
    SELECT * INTO v_company_record
    FROM companies
    WHERE id = company_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Company not found';
    END IF;

    -- Input validation
    IF action_type NOT IN ('warning', 'fine', 'suspension') THEN
        RAISE EXCEPTION 'Invalid action type: %. Must be one of: warning, fine, suspension', action_type;
    END IF;

    IF violation_type NOT IN (
        'submission_non_compliance',
        'threshold_breach',
        'critical_medicine_non_compliance',
        'export_violation',
        'data_quality_issue',
        'repeated_offender'
    ) THEN
        RAISE EXCEPTION 'Invalid violation type: %', violation_type;
    END IF;

    -- Fine amount is required for fine action type
    IF action_type = 'fine' AND (amount IS NULL OR amount <= 0) THEN
        RAISE EXCEPTION 'Fine amount is required and must be greater than 0 for fine action type';
    END IF;

    -- Fine amount should be NULL for warning/suspension
    IF action_type IN ('warning', 'suspension') AND amount IS NOT NULL THEN
        RAISE EXCEPTION 'Amount must be NULL for % action type', action_type;
    END IF;

    IF legal_basis IS NULL OR trim(legal_basis) = '' THEN
        RAISE EXCEPTION 'Legal basis is required';
    END IF;

    IF justification IS NULL OR trim(justification) = '' THEN
        RAISE EXCEPTION 'Justification is required';
    END IF;

    -- Create enforcement action
    INSERT INTO enforcement_actions (
        company_id,
        action_type,
        violation_type,
        violation_reference_id,
        violation_reference_table,
        amount,
        currency,
        status,
        legal_basis,
        justification,
        notes,
        created_by
    ) VALUES (
        company_id,
        action_type,
        violation_type,
        violation_reference_id,
        violation_reference_table,
        amount,
        currency,
        'draft',
        trim(legal_basis),
        trim(justification),
        notes,
        creator_user_id
    )
    RETURNING id INTO v_action_id;

    -- Get created action
    SELECT jsonb_build_object(
        'id', ea.id,
        'company_id', ea.company_id,
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
        'updated_at', ea.updated_at
    )
    INTO v_action
    FROM enforcement_actions ea
    WHERE ea.id = v_action_id;

    RETURN v_action;
END;
$$;

CREATE OR REPLACE FUNCTION enforcement_submit_action(
    submitter_user_id uuid,
    action_id uuid
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_user_record RECORD;
    v_action_record RECORD;
    v_approval_id uuid;
    v_action jsonb;
BEGIN
    -- Get user record and verify user exists
    SELECT u.id, u.role, u.is_active
    INTO v_user_record
    FROM users u
    WHERE u.id = submitter_user_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'User not found';
    END IF;

    IF NOT v_user_record.is_active THEN
        RAISE EXCEPTION 'User is not active';
    END IF;

    -- Access control: Only MOH Tier 1 and System Admin can submit enforcement actions
    IF v_user_record.role NOT IN ('tier1', 'system_admin') THEN
        RAISE EXCEPTION 'Insufficient permissions: Only MOH Tier 1 or System Admin can submit enforcement actions';
    END IF;

    -- Get action record
    SELECT ea.* INTO v_action_record
    FROM enforcement_actions ea
    WHERE ea.id = action_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Enforcement action not found';
    END IF;

    -- Validate action is in 'draft' status
    IF v_action_record.status != 'draft' THEN
        RAISE EXCEPTION 'Enforcement action must be in ''draft'' status to be submitted. Current status: %', v_action_record.status;
    END IF;

    -- Validate creator matches submitter (or System Admin can submit any)
    IF v_user_record.role != 'system_admin' AND v_action_record.created_by != submitter_user_id THEN
        RAISE EXCEPTION 'Insufficient permissions: You can only submit enforcement actions you created';
    END IF;

    -- Update action status
    UPDATE enforcement_actions
    SET
        status = 'submitted',
        updated_at = now()
    WHERE id = action_id;

    -- Create approval record and approval_history entry
    SELECT create_approval_record(
        NULL, -- submission_id (enforcement actions don't use registry_submissions)
        'enforcement_action',
        'draft',
        'submitted',
        submitter_user_id,
        v_user_record.role,
        'Enforcement action submitted for review',
        jsonb_build_object('action_id', action_id, 'submitted_at', now())
    ) INTO v_approval_id;

    -- Get updated action
    SELECT jsonb_build_object(
        'id', ea.id,
        'company_id', ea.company_id,
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
        'updated_at', ea.updated_at
    )
    INTO v_action
    FROM enforcement_actions ea
    WHERE ea.id = action_id;

    RETURN v_action;
END;
$$;

-- ============================================================================
-- Task 1.1.2.32: enforcement_review_action
-- Purpose: Tier 2 Officer reviews enforcement action
-- State Transition: submitted → tier2_reviewed
-- Access Control: Only MOH Tier 2 Officer
-- ============================================================================

CREATE OR REPLACE FUNCTION enforcement_review_action(
    reviewer_user_id uuid,
    action_id uuid,
    review_notes text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_user_record RECORD;
    v_action_record RECORD;
    v_approval_id uuid;
    v_action jsonb;
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

    -- Access control: Only MOH Tier 2 Officer can review
    IF v_user_record.role != 'tier2_officer' THEN
        RAISE EXCEPTION 'Insufficient permissions: Only MOH Tier 2 Officer can review enforcement actions';
    END IF;

    -- Get action record
    SELECT ea.* INTO v_action_record
    FROM enforcement_actions ea
    WHERE ea.id = action_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Enforcement action not found';
    END IF;

    -- Validate action is in 'submitted' status
    IF v_action_record.status != 'submitted' THEN
        RAISE EXCEPTION 'Enforcement action must be in ''submitted'' status to be reviewed. Current status: %', v_action_record.status;
    END IF;

    -- Update action status and review fields
    UPDATE enforcement_actions
    SET
        status = 'tier2_reviewed',
        reviewed_by = reviewer_user_id,
        reviewed_at = now(),
        review_notes = review_notes,
        updated_at = now()
    WHERE id = action_id;

    -- Create approval record and approval_history entry
    SELECT create_approval_record(
        NULL,
        'enforcement_action',
        'submitted',
        'tier2_reviewed',
        reviewer_user_id,
        v_user_record.role,
        review_notes,
        jsonb_build_object('action_id', action_id, 'reviewed_at', now())
    ) INTO v_approval_id;

    -- Get updated action
    SELECT jsonb_build_object(
        'id', ea.id,
        'company_id', ea.company_id,
        'action_type', ea.action_type,
        'violation_type', ea.violation_type,
        'amount', ea.amount,
        'currency', ea.currency,
        'status', ea.status,
        'legal_basis', ea.legal_basis,
        'justification', ea.justification,
        'reviewed_by', ea.reviewed_by,
        'reviewed_at', ea.reviewed_at,
        'review_notes', ea.review_notes,
        'created_at', ea.created_at,
        'updated_at', ea.updated_at
    )
    INTO v_action
    FROM enforcement_actions ea
    WHERE ea.id = action_id;

    RETURN v_action;
END;
$$;

-- ============================================================================
-- Task 1.1.2.33: enforcement_approve_action
-- Purpose: Tier 1 approves enforcement action
-- State Transition: tier2_reviewed → tier1_approved
-- Access Control: Only MOH Tier 1
-- ============================================================================

CREATE OR REPLACE FUNCTION enforcement_approve_action(
    approver_user_id uuid,
    action_id uuid,
    approval_notes text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_user_record RECORD;
    v_action_record RECORD;
    v_approval_id uuid;
    v_action jsonb;
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
        RAISE EXCEPTION 'Insufficient permissions: Only MOH Tier 1 can approve enforcement actions';
    END IF;

    -- Get action record
    SELECT ea.* INTO v_action_record
    FROM enforcement_actions ea
    WHERE ea.id = action_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Enforcement action not found';
    END IF;

    -- Validate action is in 'tier2_reviewed' status
    IF v_action_record.status != 'tier2_reviewed' THEN
        RAISE EXCEPTION 'Enforcement action must be in ''tier2_reviewed'' status to be approved. Current status: %', v_action_record.status;
    END IF;

    -- Update action status and approval fields
    UPDATE enforcement_actions
    SET
        status = 'tier1_approved',
        approved_by = approver_user_id,
        approved_at = now(),
        approval_notes = approval_notes,
        updated_at = now()
    WHERE id = action_id;

    -- Create approval record and approval_history entry
    SELECT create_approval_record(
        NULL,
        'enforcement_action',
        'tier2_reviewed',
        'tier1_approved',
        approver_user_id,
        v_user_record.role,
        approval_notes,
        jsonb_build_object('action_id', action_id, 'approved_at', now())
    ) INTO v_approval_id;

    -- Get updated action
    SELECT jsonb_build_object(
        'id', ea.id,
        'company_id', ea.company_id,
        'action_type', ea.action_type,
        'violation_type', ea.violation_type,
        'amount', ea.amount,
        'currency', ea.currency,
        'status', ea.status,
        'legal_basis', ea.legal_basis,
        'justification', ea.justification,
        'reviewed_by', ea.reviewed_by,
        'reviewed_at', ea.reviewed_at,
        'review_notes', ea.review_notes,
        'approved_by', ea.approved_by,
        'approved_at', ea.approved_at,
        'approval_notes', ea.approval_notes,
        'created_at', ea.created_at,
        'updated_at', ea.updated_at
    )
    INTO v_action
    FROM enforcement_actions ea
    WHERE ea.id = action_id;

    RETURN v_action;
END;
$$;

-- ============================================================================
-- Task 1.1.2.34: enforcement_execute_action
-- Purpose: Tier 2 Registrar executes enforcement action (applies to company)
-- State Transition: tier1_approved → executed
-- Access Control: Only MOH Tier 2 Registrar
-- Action: Applies enforcement action to company (suspension, fine, etc.)
-- ============================================================================

CREATE OR REPLACE FUNCTION enforcement_execute_action(
    executor_user_id uuid,
    action_id uuid,
    execution_notes text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_user_record RECORD;
    v_action_record RECORD;
    v_company_record RECORD;
    v_approval_id uuid;
    v_action jsonb;
BEGIN
    -- Get user record and verify user exists
    SELECT u.id, u.role, u.is_active
    INTO v_user_record
    FROM users u
    WHERE u.id = executor_user_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'User not found';
    END IF;

    IF NOT v_user_record.is_active THEN
        RAISE EXCEPTION 'User is not active';
    END IF;

    -- Access control: Only MOH Tier 2 Registrar can execute
    IF v_user_record.role != 'tier2_registrar' THEN
        RAISE EXCEPTION 'Insufficient permissions: Only MOH Tier 2 Registrar can execute enforcement actions';
    END IF;

    -- Get action record
    SELECT ea.* INTO v_action_record
    FROM enforcement_actions ea
    WHERE ea.id = action_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Enforcement action not found';
    END IF;

    -- Validate action is in 'tier1_approved' status
    IF v_action_record.status != 'tier1_approved' THEN
        RAISE EXCEPTION 'Enforcement action must be in ''tier1_approved'' status to be executed. Current status: %', v_action_record.status;
    END IF;

    -- Get company record
    SELECT * INTO v_company_record
    FROM companies
    WHERE id = v_action_record.company_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Company not found';
    END IF;

    -- Apply enforcement action based on action_type
    IF v_action_record.action_type = 'suspension' THEN
        -- Suspend company
        UPDATE companies
        SET
            is_active = false,
            suspended_at = now(),
            suspended_by = executor_user_id,
            suspended_reason = v_action_record.justification,
            updated_at = now()
        WHERE id = v_action_record.company_id;

    ELSIF v_action_record.action_type = 'fine' THEN
        -- Fine is recorded in enforcement_actions table (amount field)
        -- No direct company table update needed for fines
        -- Fine payment tracking would be in a separate system/table
        NULL; -- Fine is recorded, no company status change

    ELSIF v_action_record.action_type = 'warning' THEN
        -- Warning is recorded in enforcement_actions table
        -- No direct company table update needed for warnings
        -- Warning serves as a record and may affect future enforcement
        NULL; -- Warning is recorded, no company status change
    END IF;

    -- Update action status and execution fields
    UPDATE enforcement_actions
    SET
        status = 'executed',
        executed_by = executor_user_id,
        executed_at = now(),
        execution_notes = execution_notes,
        updated_at = now()
    WHERE id = action_id;

    -- Create approval record and approval_history entry
    SELECT create_approval_record(
        NULL,
        'enforcement_action',
        'tier1_approved',
        'executed',
        executor_user_id,
        v_user_record.role,
        execution_notes,
        jsonb_build_object(
            'action_id', action_id,
            'action_type', v_action_record.action_type,
            'executed_at', now(),
            'company_id', v_action_record.company_id
        )
    ) INTO v_approval_id;

    -- Get updated action
    SELECT jsonb_build_object(
        'id', ea.id,
        'company_id', ea.company_id,
        'action_type', ea.action_type,
        'violation_type', ea.violation_type,
        'amount', ea.amount,
        'currency', ea.currency,
        'status', ea.status,
        'legal_basis', ea.legal_basis,
        'justification', ea.justification,
        'reviewed_by', ea.reviewed_by,
        'reviewed_at', ea.reviewed_at,
        'approved_by', ea.approved_by,
        'approved_at', ea.approved_at,
        'executed_by', ea.executed_by,
        'executed_at', ea.executed_at,
        'execution_notes', ea.execution_notes,
        'created_at', ea.created_at,
        'updated_at', ea.updated_at
    )
    INTO v_action
    FROM enforcement_actions ea
    WHERE ea.id = action_id;

    RETURN v_action;
END;
$$;

-- ============================================================================
-- Task 1.1.2.35: enforcement_submit_appeal
-- Purpose: Company users submit appeal against enforcement action
-- State Transition: Creates appeal with status 'submitted'
-- Access Control: Company users can appeal their own company's actions
-- ============================================================================

CREATE OR REPLACE FUNCTION enforcement_submit_appeal(
    submitter_user_id uuid,
    enforcement_action_id uuid,
    appeal_reason text,
    evidence jsonb DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_user_record RECORD;
    v_action_record RECORD;
    v_appeal_record RECORD;
    v_appeal_id uuid;
    v_appeal jsonb;
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

    -- Access control: Only Company users can submit appeals
    IF v_user_record.role NOT IN ('company_admin', 'company_manager', 'company_user') THEN
        RAISE EXCEPTION 'Insufficient permissions: Only Company users can submit appeals';
    END IF;

    IF v_user_record.company_id IS NULL THEN
        RAISE EXCEPTION 'Company user must be associated with a company to submit appeals';
    END IF;

    -- Get enforcement action record
    SELECT ea.* INTO v_action_record
    FROM enforcement_actions ea
    WHERE ea.id = enforcement_action_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Enforcement action not found';
    END IF;

    -- Verify action belongs to user's company
    IF v_action_record.company_id != v_user_record.company_id THEN
        RAISE EXCEPTION 'Insufficient permissions: You can only appeal enforcement actions for your own company';
    END IF;

    -- Validate action can be appealed (must be executed or approved)
    IF v_action_record.status NOT IN ('tier1_approved', 'executed') THEN
        RAISE EXCEPTION 'Enforcement action must be approved or executed to be appealed. Current status: %', v_action_record.status;
    END IF;

    -- Check if appeal already exists
    IF EXISTS (SELECT 1 FROM enforcement_action_appeals eaa WHERE eaa.enforcement_action_id = enforcement_submit_appeal.enforcement_action_id) THEN
        RAISE EXCEPTION 'An appeal already exists for this enforcement action';
    END IF;

    -- Validate appeal reason
    IF appeal_reason IS NULL OR trim(appeal_reason) = '' THEN
        RAISE EXCEPTION 'Appeal reason is required';
    END IF;

    -- Create appeal
    INSERT INTO enforcement_action_appeals (
        enforcement_action_id,
        appeal_reason,
        evidence,
        status,
        submitted_by
    ) VALUES (
        enforcement_action_id,
        trim(appeal_reason),
        evidence,
        'submitted',
        submitter_user_id
    )
    RETURNING id INTO v_appeal_id;

    -- Update enforcement action status to 'appealed'
    UPDATE enforcement_actions
    SET
        status = 'appealed',
        appeal_id = v_appeal_id,
        updated_at = now()
    WHERE id = enforcement_action_id;

    -- Get created appeal
    SELECT jsonb_build_object(
        'id', eaa.id,
        'enforcement_action_id', eaa.enforcement_action_id,
        'appeal_reason', eaa.appeal_reason,
        'evidence', eaa.evidence,
        'status', eaa.status,
        'submitted_by', eaa.submitted_by,
        'submitted_at', eaa.submitted_at,
        'created_at', eaa.created_at,
        'updated_at', eaa.updated_at
    )
    INTO v_appeal
    FROM enforcement_action_appeals eaa
    WHERE eaa.id = v_appeal_id;

    RETURN v_appeal;
END;
$$;

-- ============================================================================
-- Task 1.1.2.36: enforcement_review_appeal, enforcement_uphold_appeal, enforcement_overturn_appeal
-- Purpose: MOH reviews and resolves appeals
-- State Transitions:
--   - submitted → tier2_reviewed (Tier 2 review)
--   - tier2_reviewed → tier1_reviewed (Tier 1 review)
--   - tier1_reviewed → upheld or rejected (Tier 1 decision)
-- Access Control: MOH Tier 2 Officer and Tier 1
-- ============================================================================

CREATE OR REPLACE FUNCTION enforcement_review_appeal(
    reviewer_user_id uuid,
    appeal_id uuid,
    review_notes text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_user_record RECORD;
    v_appeal_record RECORD;
    v_action_record RECORD;
    v_approval_id uuid;
    v_appeal jsonb;
    v_new_status text;
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

    -- Get appeal record
    SELECT eaa.* INTO v_appeal_record
    FROM enforcement_action_appeals eaa
    WHERE eaa.id = appeal_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Appeal not found';
    END IF;

    -- Get enforcement action record
    SELECT ea.* INTO v_action_record
    FROM enforcement_actions ea
    WHERE ea.id = v_appeal_record.enforcement_action_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Enforcement action not found';
    END IF;

    -- Determine new status based on current status and reviewer role
    IF v_appeal_record.status = 'submitted' THEN
        -- Tier 2 Officer reviews submitted appeal
        IF v_user_record.role != 'tier2_officer' THEN
            RAISE EXCEPTION 'Insufficient permissions: Only MOH Tier 2 Officer can review submitted appeals';
        END IF;
        v_new_status := 'tier2_reviewed';

    ELSIF v_appeal_record.status = 'tier2_reviewed' THEN
        -- Tier 1 reviews tier2_reviewed appeal
        IF v_user_record.role != 'tier1' THEN
            RAISE EXCEPTION 'Insufficient permissions: Only MOH Tier 1 can review tier2_reviewed appeals';
        END IF;
        v_new_status := 'tier1_reviewed';

    ELSE
        RAISE EXCEPTION 'Appeal cannot be reviewed in current status: %', v_appeal_record.status;
    END IF;

    -- Update appeal status and review fields
    IF v_new_status = 'tier2_reviewed' THEN
        UPDATE enforcement_action_appeals
        SET
            status = v_new_status,
            reviewed_by = reviewer_user_id,
            reviewed_at = now(),
            updated_at = now()
        WHERE id = appeal_id;
    ELSIF v_new_status = 'tier1_reviewed' THEN
        UPDATE enforcement_action_appeals
        SET
            status = v_new_status,
            reviewed_by_tier1 = reviewer_user_id,
            reviewed_at_tier1 = now(),
            updated_at = now()
        WHERE id = appeal_id;
    END IF;

    -- Create approval record and approval_history entry
    SELECT create_approval_record(
        NULL,
        'enforcement_appeal',
        v_appeal_record.status,
        v_new_status,
        reviewer_user_id,
        v_user_record.role,
        review_notes,
        jsonb_build_object('appeal_id', appeal_id, 'action_id', v_action_record.id, 'reviewed_at', now())
    ) INTO v_approval_id;

    -- Get updated appeal
    SELECT jsonb_build_object(
        'id', eaa.id,
        'enforcement_action_id', eaa.enforcement_action_id,
        'appeal_reason', eaa.appeal_reason,
        'evidence', eaa.evidence,
        'status', eaa.status,
        'submitted_by', eaa.submitted_by,
        'submitted_at', eaa.submitted_at,
        'reviewed_by', eaa.reviewed_by,
        'reviewed_at', eaa.reviewed_at,
        'reviewed_by_tier1', eaa.reviewed_by_tier1,
        'reviewed_at_tier1', eaa.reviewed_at_tier1,
        'created_at', eaa.created_at,
        'updated_at', eaa.updated_at
    )
    INTO v_appeal
    FROM enforcement_action_appeals eaa
    WHERE eaa.id = appeal_id;

    RETURN v_appeal;
END;
$$;

CREATE OR REPLACE FUNCTION enforcement_uphold_appeal(
    resolver_user_id uuid,
    appeal_id uuid,
    resolution text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_user_record RECORD;
    v_appeal_record RECORD;
    v_action_record RECORD;
    v_approval_id uuid;
    v_appeal jsonb;
BEGIN
    -- Get user record and verify user exists
    SELECT u.id, u.role, u.is_active
    INTO v_user_record
    FROM users u
    WHERE u.id = resolver_user_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'User not found';
    END IF;

    IF NOT v_user_record.is_active THEN
        RAISE EXCEPTION 'User is not active';
    END IF;

    -- Access control: Only MOH Tier 1 can uphold appeals
    IF v_user_record.role != 'tier1' THEN
        RAISE EXCEPTION 'Insufficient permissions: Only MOH Tier 1 can uphold appeals';
    END IF;

    -- Get appeal record
    SELECT eaa.* INTO v_appeal_record
    FROM enforcement_action_appeals eaa
    WHERE eaa.id = appeal_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Appeal not found';
    END IF;

    -- Validate appeal is in 'tier1_reviewed' status
    IF v_appeal_record.status != 'tier1_reviewed' THEN
        RAISE EXCEPTION 'Appeal must be in ''tier1_reviewed'' status to be upheld. Current status: %', v_appeal_record.status;
    END IF;

    -- Get enforcement action record
    SELECT ea.* INTO v_action_record
    FROM enforcement_actions ea
    WHERE ea.id = v_appeal_record.enforcement_action_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Enforcement action not found';
    END IF;

    -- Validate resolution text
    IF resolution IS NULL OR trim(resolution) = '' THEN
        RAISE EXCEPTION 'Resolution text is required';
    END IF;

    -- Update appeal status
    UPDATE enforcement_action_appeals
    SET
        status = 'upheld',
        resolution = trim(resolution),
        resolved_by = resolver_user_id,
        resolved_at = now(),
        updated_at = now()
    WHERE id = appeal_id;

    -- Update enforcement action status to 'resolved' and set resolution
    UPDATE enforcement_actions
    SET
        status = 'resolved',
        resolution = trim(resolution),
        resolved_by = resolver_user_id,
        resolved_at = now(),
        updated_at = now()
    WHERE id = v_action_record.id;

    -- If action was a suspension, reverse it
    IF v_action_record.action_type = 'suspension' THEN
        UPDATE companies
        SET
            is_active = true,
            suspended_at = NULL,
            suspended_by = NULL,
            suspended_reason = NULL,
            updated_at = now()
        WHERE id = v_action_record.company_id;
    END IF;

    -- Create approval record and approval_history entry
    SELECT create_approval_record(
        NULL,
        'enforcement_appeal',
        'tier1_reviewed',
        'upheld',
        resolver_user_id,
        v_user_record.role,
        resolution,
        jsonb_build_object(
            'appeal_id', appeal_id,
            'action_id', v_action_record.id,
            'action_type', v_action_record.action_type,
            'resolved_at', now()
        )
    ) INTO v_approval_id;

    -- Get updated appeal
    SELECT jsonb_build_object(
        'id', eaa.id,
        'enforcement_action_id', eaa.enforcement_action_id,
        'appeal_reason', eaa.appeal_reason,
        'evidence', eaa.evidence,
        'status', eaa.status,
        'resolution', eaa.resolution,
        'resolved_by', eaa.resolved_by,
        'resolved_at', eaa.resolved_at,
        'created_at', eaa.created_at,
        'updated_at', eaa.updated_at
    )
    INTO v_appeal
    FROM enforcement_action_appeals eaa
    WHERE eaa.id = appeal_id;

    RETURN v_appeal;
END;
$$;

CREATE OR REPLACE FUNCTION enforcement_overturn_appeal(
    resolver_user_id uuid,
    appeal_id uuid,
    resolution text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_user_record RECORD;
    v_appeal_record RECORD;
    v_action_record RECORD;
    v_approval_id uuid;
    v_appeal jsonb;
BEGIN
    -- Get user record and verify user exists
    SELECT u.id, u.role, u.is_active
    INTO v_user_record
    FROM users u
    WHERE u.id = resolver_user_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'User not found';
    END IF;

    IF NOT v_user_record.is_active THEN
        RAISE EXCEPTION 'User is not active';
    END IF;

    -- Access control: Only MOH Tier 1 can overturn appeals
    IF v_user_record.role != 'tier1' THEN
        RAISE EXCEPTION 'Insufficient permissions: Only MOH Tier 1 can overturn appeals';
    END IF;

    -- Get appeal record
    SELECT eaa.* INTO v_appeal_record
    FROM enforcement_action_appeals eaa
    WHERE eaa.id = appeal_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Appeal not found';
    END IF;

    -- Validate appeal is in 'tier1_reviewed' status
    IF v_appeal_record.status != 'tier1_reviewed' THEN
        RAISE EXCEPTION 'Appeal must be in ''tier1_reviewed'' status to be overturned. Current status: %', v_appeal_record.status;
    END IF;

    -- Get enforcement action record
    SELECT ea.* INTO v_action_record
    FROM enforcement_actions ea
    WHERE ea.id = v_appeal_record.enforcement_action_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Enforcement action not found';
    END IF;

    -- Validate resolution text
    IF resolution IS NULL OR trim(resolution) = '' THEN
        RAISE EXCEPTION 'Resolution text is required';
    END IF;

    -- Update appeal status
    UPDATE enforcement_action_appeals
    SET
        status = 'rejected',
        resolution = trim(resolution),
        resolved_by = resolver_user_id,
        resolved_at = now(),
        updated_at = now()
    WHERE id = appeal_id;

    -- Update enforcement action status back to 'executed' (appeal rejected, action stands)
    UPDATE enforcement_actions
    SET
        status = 'executed',
        resolution = trim(resolution),
        resolved_by = resolver_user_id,
        resolved_at = now(),
        updated_at = now()
    WHERE id = v_action_record.id;

    -- Create approval record and approval_history entry
    SELECT create_approval_record(
        NULL,
        'enforcement_appeal',
        'tier1_reviewed',
        'rejected',
        resolver_user_id,
        v_user_record.role,
        resolution,
        jsonb_build_object(
            'appeal_id', appeal_id,
            'action_id', v_action_record.id,
            'action_type', v_action_record.action_type,
            'resolved_at', now()
        )
    ) INTO v_approval_id;

    -- Get updated appeal
    SELECT jsonb_build_object(
        'id', eaa.id,
        'enforcement_action_id', eaa.enforcement_action_id,
        'appeal_reason', eaa.appeal_reason,
        'evidence', eaa.evidence,
        'status', eaa.status,
        'resolution', eaa.resolution,
        'resolved_by', eaa.resolved_by,
        'resolved_at', eaa.resolved_at,
        'created_at', eaa.created_at,
        'updated_at', eaa.updated_at
    )
    INTO v_appeal
    FROM enforcement_action_appeals eaa
    WHERE eaa.id = appeal_id;

    RETURN v_appeal;
END;
$$;

COMMIT;
