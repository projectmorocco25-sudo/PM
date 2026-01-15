-- Migration: create_enforcement_tables
-- Description: Create enforcement tables (enforcement_actions, enforcement_action_appeals) + RLS
-- Date: 2026-01-15
-- Author: Nadia, Rafi
-- Phase: 1.1.2
-- Supports: Tasks 1.1.2.31-1.1.2.36, 1.1.2.15a

BEGIN;

CREATE TABLE IF NOT EXISTS enforcement_actions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  action_type text NOT NULL CHECK (action_type IN ('warning','fine','suspension')),
  violation_type text NOT NULL CHECK (violation_type IN (
    'submission_non_compliance','threshold_breach','critical_medicine_non_compliance',
    'export_violation','data_quality_issue','repeated_offender'
  )),
  violation_reference_id uuid,
  violation_reference_table text,
  amount numeric(15,2),
  currency text NOT NULL DEFAULT 'MAD',
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','pending_review','pending_approval','approved','executed','appealed','resolved','cancelled')),
  legal_basis text NOT NULL,
  regulatory_basis text, -- explicit capture for audits (may mirror legal_basis)
  justification text NOT NULL,
  evidence_references jsonb,
  notes text,
  created_by uuid NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  created_at timestamptz NOT NULL DEFAULT now(),
  reviewed_by uuid REFERENCES users(id) ON DELETE SET NULL,
  reviewed_at timestamptz,
  review_notes text,
  approved_by uuid REFERENCES users(id) ON DELETE SET NULL,
  approved_at timestamptz,
  approval_notes text,
  executed_by uuid REFERENCES users(id) ON DELETE SET NULL,
  executed_at timestamptz,
  execution_notes text,
  resolution text,
  resolved_by uuid REFERENCES users(id) ON DELETE SET NULL,
  resolved_at timestamptz,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_enforcement_actions_company_id ON enforcement_actions(company_id);
CREATE INDEX IF NOT EXISTS idx_enforcement_actions_action_type ON enforcement_actions(action_type);
CREATE INDEX IF NOT EXISTS idx_enforcement_actions_status ON enforcement_actions(status);
CREATE INDEX IF NOT EXISTS idx_enforcement_actions_violation_type ON enforcement_actions(violation_type);
CREATE INDEX IF NOT EXISTS idx_enforcement_actions_created_at ON enforcement_actions(created_at);
CREATE INDEX IF NOT EXISTS idx_enforcement_actions_violation_reference ON enforcement_actions(violation_reference_table, violation_reference_id);

DROP TRIGGER IF EXISTS set_enforcement_actions_updated_at ON enforcement_actions;
CREATE TRIGGER set_enforcement_actions_updated_at
BEFORE UPDATE ON enforcement_actions
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Immutability: once out of draft, lock legal/regulatory basis + justification + evidence refs
CREATE OR REPLACE FUNCTION enforcement_lock_tier1_justification_fields()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF TG_OP = 'UPDATE' AND OLD.status <> 'draft' THEN
    IF (NEW.legal_basis IS DISTINCT FROM OLD.legal_basis)
      OR (NEW.regulatory_basis IS DISTINCT FROM OLD.regulatory_basis)
      OR (NEW.justification IS DISTINCT FROM OLD.justification)
      OR (NEW.evidence_references IS DISTINCT FROM OLD.evidence_references) THEN
      RAISE EXCEPTION 'Justification fields are immutable after submission';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_enforcement_lock_justification ON enforcement_actions;
CREATE TRIGGER trg_enforcement_lock_justification
BEFORE UPDATE ON enforcement_actions
FOR EACH ROW
EXECUTE FUNCTION enforcement_lock_tier1_justification_fields();

CREATE TABLE IF NOT EXISTS enforcement_action_appeals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  enforcement_action_id uuid NOT NULL REFERENCES enforcement_actions(id) ON DELETE CASCADE,
  appeal_reason text NOT NULL,
  evidence jsonb,
  status text NOT NULL DEFAULT 'submitted' CHECK (status IN ('submitted','tier2_reviewed','tier1_reviewed','upheld','rejected','withdrawn')),
  submitted_by uuid NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  submitted_at timestamptz NOT NULL DEFAULT now(),
  reviewed_by uuid REFERENCES users(id) ON DELETE SET NULL,
  reviewed_at timestamptz,
  reviewed_by_tier1 uuid REFERENCES users(id) ON DELETE SET NULL,
  reviewed_at_tier1 timestamptz,
  resolution text,
  resolved_by uuid REFERENCES users(id) ON DELETE SET NULL,
  resolved_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_enforcement_action_appeals_enforcement_action_id ON enforcement_action_appeals(enforcement_action_id);
CREATE INDEX IF NOT EXISTS idx_enforcement_action_appeals_status ON enforcement_action_appeals(status);
CREATE INDEX IF NOT EXISTS idx_enforcement_action_appeals_submitted_at ON enforcement_action_appeals(submitted_at);

DROP TRIGGER IF EXISTS set_enforcement_action_appeals_updated_at ON enforcement_action_appeals;
CREATE TRIGGER set_enforcement_action_appeals_updated_at
BEFORE UPDATE ON enforcement_action_appeals
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ============================
-- RLS policies
-- ============================

ALTER TABLE enforcement_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE enforcement_action_appeals ENABLE ROW LEVEL SECURITY;

-- enforcement_actions
DROP POLICY IF EXISTS "enforcement_actions_select_moh_all" ON enforcement_actions;
DROP POLICY IF EXISTS "enforcement_actions_select_company_own" ON enforcement_actions;
DROP POLICY IF EXISTS "enforcement_actions_insert_moh_only" ON enforcement_actions;
DROP POLICY IF EXISTS "enforcement_actions_update_moh_only" ON enforcement_actions;

CREATE POLICY "enforcement_actions_select_moh_all"
ON enforcement_actions
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM users u
    WHERE u.id = auth.uid()
      AND u.company_id IS NULL
      AND u.role IN ('tier1','tier2_officer','tier2_registrar','system_admin','auditor')
  )
);

CREATE POLICY "enforcement_actions_select_company_own"
ON enforcement_actions
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM users u
    WHERE u.id = auth.uid()
      AND u.company_id = enforcement_actions.company_id
      AND u.role IN ('company_admin','company_manager','company_user')
  )
);

CREATE POLICY "enforcement_actions_insert_moh_only"
ON enforcement_actions
FOR INSERT
WITH CHECK (
  created_by = auth.uid()
  AND EXISTS (
    SELECT 1 FROM users u
    WHERE u.id = auth.uid()
      AND u.company_id IS NULL
      AND u.role IN ('tier1','tier2_officer','system_admin')
  )
);

CREATE POLICY "enforcement_actions_update_moh_only"
ON enforcement_actions
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM users u
    WHERE u.id = auth.uid()
      AND u.company_id IS NULL
      AND u.role IN ('tier1','tier2_officer','system_admin')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users u
    WHERE u.id = auth.uid()
      AND u.company_id IS NULL
      AND u.role IN ('tier1','tier2_officer','system_admin')
  )
);

-- appeals: company submits; MOH reviews
DROP POLICY IF EXISTS "enforcement_appeals_select_moh_all" ON enforcement_action_appeals;
DROP POLICY IF EXISTS "enforcement_appeals_select_company_own" ON enforcement_action_appeals;
DROP POLICY IF EXISTS "enforcement_appeals_insert_company_own" ON enforcement_action_appeals;
DROP POLICY IF EXISTS "enforcement_appeals_update_moh_only" ON enforcement_action_appeals;

CREATE POLICY "enforcement_appeals_select_moh_all"
ON enforcement_action_appeals
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM users u
    WHERE u.id = auth.uid()
      AND u.company_id IS NULL
      AND u.role IN ('tier1','tier2_officer','tier2_registrar','system_admin','auditor')
  )
);

CREATE POLICY "enforcement_appeals_select_company_own"
ON enforcement_action_appeals
FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM users u
    JOIN enforcement_actions ea ON ea.id = enforcement_action_appeals.enforcement_action_id
    WHERE u.id = auth.uid()
      AND u.company_id = ea.company_id
      AND u.role IN ('company_admin','company_manager','company_user')
  )
);

CREATE POLICY "enforcement_appeals_insert_company_own"
ON enforcement_action_appeals
FOR INSERT
WITH CHECK (
  submitted_by = auth.uid()
  AND EXISTS (
    SELECT 1
    FROM users u
    JOIN enforcement_actions ea ON ea.id = enforcement_action_appeals.enforcement_action_id
    WHERE u.id = auth.uid()
      AND u.company_id = ea.company_id
      AND u.role IN ('company_admin','company_manager','company_user')
  )
);

CREATE POLICY "enforcement_appeals_update_moh_only"
ON enforcement_action_appeals
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM users u
    WHERE u.id = auth.uid()
      AND u.company_id IS NULL
      AND u.role IN ('tier1','tier2_officer','system_admin')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users u
    WHERE u.id = auth.uid()
      AND u.company_id IS NULL
      AND u.role IN ('tier1','tier2_officer','system_admin')
  )
);

COMMIT;

