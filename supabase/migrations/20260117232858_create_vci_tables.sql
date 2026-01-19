-- Migration: Create VCI core tables
-- Description: Create database migration for VCI core tables (aams_submissions, msq_submissions, wsl_submissions, thresholds, breaches, breach_analyses)
-- Date: 2026-01-17
-- Task: 1.1.1.9
-- Author: Sami (Implementation Compliance Specialist)

BEGIN;

-- ============================================
-- AAMS_SUBMISSIONS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS public.aams_submissions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    year integer NOT NULL,
    aams_value numeric(15, 2),
    submission_data jsonb NOT NULL,
    status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'tier2_verified', 'tier1_approved', 'completed', 'rejected')),
    is_late boolean DEFAULT false,
    correction_of uuid REFERENCES public.aams_submissions(id) ON DELETE SET NULL,
    submitted_by uuid NOT NULL REFERENCES public.users(id) ON DELETE RESTRICT,
    submitted_at timestamptz,
    verified_by uuid REFERENCES public.users(id) ON DELETE SET NULL,
    verified_at timestamptz,
    approved_by uuid REFERENCES public.users(id) ON DELETE SET NULL,
    approved_at timestamptz,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

COMMENT ON TABLE public.aams_submissions IS 'Annual Average Monthly Sales (Quantities) submissions - AAMS represents quantities of units sold, NOT financial values';
COMMENT ON COLUMN public.aams_submissions.submission_data IS 'SKU-level data: array of {sku_id, quantity}';

-- Indexes for aams_submissions table
CREATE INDEX IF NOT EXISTS idx_aams_company_id ON public.aams_submissions (company_id);
CREATE INDEX IF NOT EXISTS idx_aams_year ON public.aams_submissions (year);
CREATE INDEX IF NOT EXISTS idx_aams_company_year ON public.aams_submissions (company_id, year);
CREATE INDEX IF NOT EXISTS idx_aams_status ON public.aams_submissions (status);

-- ============================================
-- MSQ_SUBMISSIONS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS public.msq_submissions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    year integer NOT NULL,
    month integer NOT NULL CHECK (month >= 1 AND month <= 12),
    submission_data jsonb NOT NULL,
    status text NOT NULL DEFAULT 'submitted' CHECK (status IN ('submitted', 'flagged_for_review', 'accepted', 'rejected')),
    validation_flags jsonb,
    correction_of uuid REFERENCES public.msq_submissions(id) ON DELETE SET NULL,
    submitted_by uuid NOT NULL REFERENCES public.users(id) ON DELETE RESTRICT,
    submitted_at timestamptz DEFAULT now(),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

COMMENT ON TABLE public.msq_submissions IS 'Monthly Sales Quantities submissions - MSQ represents quantities of units sold, NOT financial values';
COMMENT ON COLUMN public.msq_submissions.submission_data IS 'Submission data (SKU quantities)';

-- Indexes for msq_submissions table
CREATE INDEX IF NOT EXISTS idx_msq_company_id ON public.msq_submissions (company_id);
CREATE INDEX IF NOT EXISTS idx_msq_year_month ON public.msq_submissions (year, month);
CREATE INDEX IF NOT EXISTS idx_msq_company_year_month ON public.msq_submissions (company_id, year, month);
CREATE INDEX IF NOT EXISTS idx_msq_status ON public.msq_submissions (status);

-- ============================================
-- WSL_SUBMISSIONS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS public.wsl_submissions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    week_ending_date date NOT NULL,
    submission_data jsonb NOT NULL,
    status text NOT NULL DEFAULT 'submitted' CHECK (status IN ('submitted', 'late', 'non_compliant', 'accepted')),
    is_late boolean DEFAULT false,
    is_non_compliant boolean DEFAULT false,
    submitted_by uuid NOT NULL REFERENCES public.users(id) ON DELETE RESTRICT,
    submitted_at timestamptz DEFAULT now(),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

COMMENT ON TABLE public.wsl_submissions IS 'Weekly Stock Levels submissions - WSL represents quantities of units in stock, NOT financial values';
COMMENT ON COLUMN public.wsl_submissions.submission_data IS 'SKU-level data: array of {sku_id, quantity, breach_reason?, replenishment_date?}';

-- Indexes for wsl_submissions table
CREATE INDEX IF NOT EXISTS idx_wsl_company_id ON public.wsl_submissions (company_id);
CREATE INDEX IF NOT EXISTS idx_wsl_week_ending ON public.wsl_submissions (week_ending_date);
CREATE INDEX IF NOT EXISTS idx_wsl_company_week ON public.wsl_submissions (company_id, week_ending_date);
CREATE INDEX IF NOT EXISTS idx_wsl_status ON public.wsl_submissions (status);

-- ============================================
-- THRESHOLDS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS public.thresholds (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    sku_id uuid REFERENCES public.skus(id) ON DELETE CASCADE,
    threshold_type text NOT NULL CHECK (threshold_type IN ('vci', 'ecs')),
    threshold_value numeric(15, 2) NOT NULL,
    multiplier_b numeric(5, 2) NOT NULL,
    aams_value numeric(15, 2) NOT NULL,
    effective_from date NOT NULL,
    effective_to date,
    is_current boolean DEFAULT true,
    duration_type text DEFAULT 'permanent' CHECK (duration_type IN ('permanent', 'temporary_auto_revert', 'temporary_manual_review')),
    revert_date date,
    revert_to_multiplier numeric(5, 2),
    revert_to_threshold_value numeric(15, 2),
    revert_notification_sent_7d boolean DEFAULT false,
    revert_notification_sent_1d boolean DEFAULT false,
    revert_notification_sent_on_revert boolean DEFAULT false,
    requires_manual_review boolean DEFAULT false,
    created_by uuid NOT NULL REFERENCES public.users(id) ON DELETE RESTRICT,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

COMMENT ON TABLE public.thresholds IS 'VCI thresholds (B × AAMS) - Version history supported (non-retroactive changes)';
COMMENT ON COLUMN public.thresholds.sku_id IS 'SKU ID (NULL for global threshold)';
COMMENT ON COLUMN public.thresholds.duration_type IS 'Duration type: permanent, temporary_auto_revert, temporary_manual_review';

-- Indexes for thresholds table
CREATE INDEX IF NOT EXISTS idx_thresholds_sku_id ON public.thresholds (sku_id) WHERE sku_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_thresholds_type ON public.thresholds (threshold_type);
CREATE INDEX IF NOT EXISTS idx_thresholds_effective_from ON public.thresholds (effective_from);
CREATE INDEX IF NOT EXISTS idx_thresholds_is_current ON public.thresholds (is_current);
CREATE INDEX IF NOT EXISTS idx_thresholds_duration_type ON public.thresholds (duration_type);
CREATE INDEX IF NOT EXISTS idx_thresholds_revert_date ON public.thresholds (revert_date) WHERE revert_date IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_thresholds_requires_manual_review ON public.thresholds (requires_manual_review) WHERE requires_manual_review = true;

-- ============================================
-- BREACHES TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS public.breaches (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    sku_id uuid NOT NULL REFERENCES public.skus(id) ON DELETE CASCADE,
    company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    wsl_submission_id uuid NOT NULL REFERENCES public.wsl_submissions(id) ON DELETE CASCADE,
    threshold_id uuid NOT NULL REFERENCES public.thresholds(id) ON DELETE CASCADE,
    stock_level numeric(15, 2) NOT NULL,
    threshold_value numeric(15, 2) NOT NULL,
    breach_date date NOT NULL,
    breach_reason text,
    replenishment_date date,
    priority text NOT NULL DEFAULT 'standard' CHECK (priority IN ('standard', 'high', 'critical')),
    status text NOT NULL DEFAULT 'detected' CHECK (status IN ('detected', 'tier2_analyzing', 'tier2_suggested', 'tier1_reviewed', 'action_taken', 'completed')),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

COMMENT ON TABLE public.breaches IS 'Threshold breach records';

-- Indexes for breaches table
CREATE INDEX IF NOT EXISTS idx_breaches_sku_id ON public.breaches (sku_id);
CREATE INDEX IF NOT EXISTS idx_breaches_company_id ON public.breaches (company_id);
CREATE INDEX IF NOT EXISTS idx_breaches_status ON public.breaches (status);
CREATE INDEX IF NOT EXISTS idx_breaches_detected_at ON public.breaches (breach_date);
CREATE INDEX IF NOT EXISTS idx_breaches_company_status ON public.breaches (company_id, status);
CREATE INDEX IF NOT EXISTS idx_breaches_priority ON public.breaches (priority);

-- ============================================
-- BREACH_ANALYSES TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS public.breach_analyses (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    breach_id uuid NOT NULL REFERENCES public.breaches(id) ON DELETE CASCADE,
    analyzed_by uuid NOT NULL REFERENCES public.users(id) ON DELETE RESTRICT,
    suggested_action text NOT NULL CHECK (suggested_action IN ('warning', 'require_replenishment_plan', 'require_production_plan', 'enhanced_monitoring', 'escalate')),
    suggested_action_details text,
    analysis_notes text,
    analyzed_at timestamptz DEFAULT now(),
    created_at timestamptz DEFAULT now()
);

COMMENT ON TABLE public.breach_analyses IS 'Tier 2 analysis of breaches';

-- Indexes for breach_analyses table
CREATE INDEX IF NOT EXISTS idx_breach_analyses_breach_id ON public.breach_analyses (breach_id);
CREATE INDEX IF NOT EXISTS idx_breach_analyses_analyzed_at ON public.breach_analyses (analyzed_at);
CREATE INDEX IF NOT EXISTS idx_breach_analyses_analyzed_by ON public.breach_analyses (analyzed_by);

-- ============================================
-- UPDATED_AT TRIGGERS
-- ============================================

CREATE TRIGGER set_aams_submissions_updated_at
BEFORE UPDATE ON public.aams_submissions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER set_msq_submissions_updated_at
BEFORE UPDATE ON public.msq_submissions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER set_wsl_submissions_updated_at
BEFORE UPDATE ON public.wsl_submissions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER set_thresholds_updated_at
BEFORE UPDATE ON public.thresholds
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER set_breaches_updated_at
BEFORE UPDATE ON public.breaches
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- ENABLE ROW LEVEL SECURITY
-- ============================================

ALTER TABLE public.aams_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.msq_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wsl_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.thresholds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.breaches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.breach_analyses ENABLE ROW LEVEL SECURITY;

COMMIT;
