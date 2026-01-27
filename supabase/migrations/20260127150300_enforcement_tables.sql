-- Migration: enforcement_tables
-- Description: Create enforcement tables (enforcement_actions, enforcement_action_appeals).
-- Date: 2026-01-27
-- Task: 1.1.1.7
-- Author: Sami (Implementation Compliance Specialist)
-- Dependencies: 1.1.1.3 (RMM tables). update_updated_at from core_tables.

BEGIN;

-- enforcement_actions (company_id -> companies; created_by, reviewed_by, approved_by, etc. -> users)
-- appeal_id nullable, no FK to avoid circular dependency with enforcement_action_appeals
CREATE TABLE IF NOT EXISTS public.enforcement_actions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  action_type text NOT NULL CHECK (action_type IN ('warning', 'fine', 'suspension')),
  violation_type text NOT NULL CHECK (violation_type IN (
    'submission_non_compliance', 'threshold_breach', 'critical_medicine_non_compliance',
    'export_violation', 'data_quality_issue', 'repeated_offender'
  )),
  violation_reference_id uuid,
  violation_reference_table text,
  amount numeric(15,2),
  currency text NOT NULL DEFAULT 'MAD',
  status text NOT NULL DEFAULT 'draft' CHECK (status IN (
    'draft', 'pending_review', 'pending_approval', 'approved', 'executed',
    'appealed', 'resolved', 'cancelled'
  )),
  legal_basis text NOT NULL,
  justification text NOT NULL,
  notes text,
  created_by uuid NOT NULL REFERENCES public.users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  reviewed_by uuid REFERENCES public.users(id),
  reviewed_at timestamptz,
  review_notes text,
  approved_by uuid REFERENCES public.users(id),
  approved_at timestamptz,
  approval_notes text,
  executed_by uuid REFERENCES public.users(id),
  executed_at timestamptz,
  execution_notes text,
  appeal_id uuid,
  resolution text,
  resolved_by uuid REFERENCES public.users(id),
  resolved_at timestamptz,
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_enforcement_actions_company_id ON public.enforcement_actions(company_id);
CREATE INDEX IF NOT EXISTS idx_enforcement_actions_action_type ON public.enforcement_actions(action_type);
CREATE INDEX IF NOT EXISTS idx_enforcement_actions_status ON public.enforcement_actions(status);
CREATE INDEX IF NOT EXISTS idx_enforcement_actions_violation_type ON public.enforcement_actions(violation_type);
CREATE INDEX IF NOT EXISTS idx_enforcement_actions_created_at ON public.enforcement_actions(created_at);
CREATE INDEX IF NOT EXISTS idx_enforcement_actions_violation_reference ON public.enforcement_actions(violation_reference_table, violation_reference_id);
DROP TRIGGER IF EXISTS enforcement_actions_updated_at ON public.enforcement_actions;
CREATE TRIGGER enforcement_actions_updated_at BEFORE UPDATE ON public.enforcement_actions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- enforcement_action_appeals (appeals; enforcement_action_id -> enforcement_actions)
CREATE TABLE IF NOT EXISTS public.enforcement_action_appeals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  enforcement_action_id uuid NOT NULL REFERENCES public.enforcement_actions(id) ON DELETE CASCADE,
  appeal_reason text NOT NULL,
  evidence jsonb,
  status text NOT NULL DEFAULT 'submitted' CHECK (status IN (
    'submitted', 'tier2_reviewed', 'tier1_reviewed', 'upheld', 'rejected', 'withdrawn'
  )),
  submitted_by uuid NOT NULL REFERENCES public.users(id),
  submitted_at timestamptz NOT NULL DEFAULT now(),
  reviewed_by uuid REFERENCES public.users(id),
  reviewed_at timestamptz,
  reviewed_by_tier1 uuid REFERENCES public.users(id),
  reviewed_at_tier1 timestamptz,
  resolution text,
  resolved_by uuid REFERENCES public.users(id),
  resolved_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT uq_enforcement_action_appeals_action UNIQUE (enforcement_action_id)
);
CREATE INDEX IF NOT EXISTS idx_enforcement_action_appeals_enforcement_action_id ON public.enforcement_action_appeals(enforcement_action_id);
CREATE INDEX IF NOT EXISTS idx_enforcement_action_appeals_status ON public.enforcement_action_appeals(status);
CREATE INDEX IF NOT EXISTS idx_enforcement_action_appeals_submitted_at ON public.enforcement_action_appeals(submitted_at);
DROP TRIGGER IF EXISTS enforcement_action_appeals_updated_at ON public.enforcement_action_appeals;
CREATE TRIGGER enforcement_action_appeals_updated_at BEFORE UPDATE ON public.enforcement_action_appeals FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

ALTER TABLE public.enforcement_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enforcement_action_appeals ENABLE ROW LEVEL SECURITY;

COMMIT;
