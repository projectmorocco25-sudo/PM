-- Migration: create_enforcement_tables
-- Description: Create database migration for enforcement tables (enforcement_actions, enforcement_action_appeals)
-- Date: 2026-01-22
-- Task: 1.1.1.7
-- Author: Sami (Implementation Compliance Specialist)
-- Dependencies: Task 1.1.1.3 (companies table must exist), Task 1.1.1.2 (users table must exist)

BEGIN;

-- ============================================================================
-- enforcement_actions table
-- Purpose: MOH enforcement actions (warnings, fines, suspensions) against companies
-- ============================================================================

CREATE TABLE IF NOT EXISTS enforcement_actions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    action_type text NOT NULL CHECK (action_type IN ('warning', 'fine', 'suspension')),
    violation_type text NOT NULL CHECK (violation_type IN (
        'submission_non_compliance',
        'threshold_breach',
        'critical_medicine_non_compliance',
        'export_violation',
        'data_quality_issue',
        'repeated_offender'
    )),
    violation_reference_id uuid, -- NULLABLE: Reference to specific violation (breach_id, compliance_score_id, submission_id, etc.)
    violation_reference_table text, -- NULLABLE: Table name of violation reference (breaches, compliance_scores, etc.)
    amount numeric(15,2), -- NULLABLE: Fine amount (NULL for warnings/suspensions)
    currency text NOT NULL DEFAULT 'MAD',
    status text NOT NULL DEFAULT 'draft' CHECK (status IN (
        'draft',
        'pending_review',
        'pending_approval',
        'approved',
        'executed',
        'appealed',
        'resolved',
        'cancelled'
    )),
    legal_basis text NOT NULL,
    justification text NOT NULL,
    notes text, -- NULLABLE: Internal notes (MOH only)
    created_by uuid NOT NULL REFERENCES users(id),
    created_at timestamptz NOT NULL DEFAULT now(),
    reviewed_by uuid REFERENCES users(id),
    reviewed_at timestamptz,
    review_notes text,
    approved_by uuid REFERENCES users(id),
    approved_at timestamptz,
    approval_notes text,
    executed_by uuid REFERENCES users(id),
    executed_at timestamptz,
    execution_notes text,
    appeal_id uuid, -- NULLABLE: Appeal ID if action was appealed (references enforcement_action_appeals.id when table exists)
    resolution text, -- NULLABLE: Resolution (if appealed or cancelled)
    resolved_by uuid REFERENCES users(id),
    resolved_at timestamptz,
    updated_at timestamptz NOT NULL DEFAULT now()
);

-- Indexes for enforcement_actions table
CREATE INDEX IF NOT EXISTS idx_enforcement_actions_company_id ON enforcement_actions(company_id);
CREATE INDEX IF NOT EXISTS idx_enforcement_actions_action_type ON enforcement_actions(action_type);
CREATE INDEX IF NOT EXISTS idx_enforcement_actions_status ON enforcement_actions(status);
CREATE INDEX IF NOT EXISTS idx_enforcement_actions_violation_type ON enforcement_actions(violation_type);
CREATE INDEX IF NOT EXISTS idx_enforcement_actions_created_at ON enforcement_actions(created_at);
CREATE INDEX IF NOT EXISTS idx_enforcement_actions_violation_reference ON enforcement_actions(violation_reference_table, violation_reference_id) WHERE violation_reference_id IS NOT NULL;

-- Trigger to update updated_at timestamp
CREATE TRIGGER update_enforcement_actions_updated_at
    BEFORE UPDATE ON enforcement_actions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- enforcement_action_appeals table
-- Purpose: Company appeals against enforcement actions
-- ============================================================================

CREATE TABLE IF NOT EXISTS enforcement_action_appeals (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    enforcement_action_id uuid NOT NULL REFERENCES enforcement_actions(id) ON DELETE CASCADE,
    appeal_reason text NOT NULL,
    evidence jsonb, -- NULLABLE: Evidence files (file references)
    status text NOT NULL DEFAULT 'submitted' CHECK (status IN (
        'submitted',
        'tier2_reviewed',
        'tier1_reviewed',
        'upheld',
        'rejected',
        'withdrawn'
    )),
    submitted_by uuid NOT NULL REFERENCES users(id),
    submitted_at timestamptz NOT NULL DEFAULT now(),
    reviewed_by uuid REFERENCES users(id),
    reviewed_at timestamptz,
    reviewed_by_tier1 uuid REFERENCES users(id),
    reviewed_at_tier1 timestamptz,
    resolution text, -- NULLABLE: Resolution decision
    resolved_by uuid REFERENCES users(id),
    resolved_at timestamptz,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE(enforcement_action_id) -- One appeal per enforcement action
);

-- Indexes for enforcement_action_appeals table
CREATE INDEX IF NOT EXISTS idx_enforcement_action_appeals_enforcement_action_id ON enforcement_action_appeals(enforcement_action_id);
CREATE INDEX IF NOT EXISTS idx_enforcement_action_appeals_status ON enforcement_action_appeals(status);
CREATE INDEX IF NOT EXISTS idx_enforcement_action_appeals_submitted_at ON enforcement_action_appeals(submitted_at);

-- Trigger to update updated_at timestamp
CREATE TRIGGER update_enforcement_action_appeals_updated_at
    BEFORE UPDATE ON enforcement_action_appeals
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- Add foreign key constraint for enforcement_actions.appeal_id -> enforcement_action_appeals.id
-- Note: This was referenced in enforcement_actions table but enforcement_action_appeals table didn't exist yet
-- ============================================================================

-- Add foreign key constraint for enforcement_actions.appeal_id
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'enforcement_actions') THEN
        -- Check if constraint already exists
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.table_constraints 
            WHERE constraint_name = 'enforcement_actions_appeal_id_fkey' 
            AND table_name = 'enforcement_actions'
        ) THEN
            ALTER TABLE enforcement_actions
            ADD CONSTRAINT enforcement_actions_appeal_id_fkey
            FOREIGN KEY (appeal_id) REFERENCES enforcement_action_appeals(id) ON DELETE SET NULL;
        END IF;
    END IF;
END $$;

COMMIT;
