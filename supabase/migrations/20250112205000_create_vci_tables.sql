-- Migration: create_vci_tables
-- Description: Create VCI core tables (aams_submissions, msq_submissions, wsl_submissions, thresholds, breaches, breach_analyses)
-- Date: 2025-01-12
-- Author: Nadia
-- Phase: 1.1.1
-- Task: 1.1.1.9
-- Depends on: 20250112204000_create_rmm_tables (companies/products/skus)

BEGIN;

-- AAMS submissions (annual)
CREATE TABLE IF NOT EXISTS aams_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  year integer NOT NULL,
  aams_value numeric(15,2),
  submission_data jsonb NOT NULL,
  status text NOT NULL DEFAULT 'draft',
  is_late boolean DEFAULT false,
  correction_of uuid REFERENCES aams_submissions(id),
  submitted_by uuid NOT NULL REFERENCES users(id),
  submitted_at timestamptz,
  verified_by uuid REFERENCES users(id),
  verified_at timestamptz,
  approved_by uuid REFERENCES users(id),
  approved_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_aams_submissions_company_id ON aams_submissions(company_id);
CREATE INDEX IF NOT EXISTS idx_aams_submissions_year ON aams_submissions(year);
CREATE INDEX IF NOT EXISTS idx_aams_submissions_status ON aams_submissions(status);

CREATE TRIGGER set_aams_submissions_updated_at
BEFORE UPDATE ON aams_submissions
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- MSQ submissions (monthly)
CREATE TABLE IF NOT EXISTS msq_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  year integer NOT NULL,
  month integer NOT NULL CHECK (month >= 1 AND month <= 12),
  submission_data jsonb NOT NULL,
  status text NOT NULL DEFAULT 'submitted',
  validation_flags jsonb,
  correction_of uuid REFERENCES msq_submissions(id),
  submitted_by uuid NOT NULL REFERENCES users(id),
  submitted_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_msq_submissions_company_id ON msq_submissions(company_id);
CREATE INDEX IF NOT EXISTS idx_msq_submissions_year_month ON msq_submissions(year, month);
CREATE INDEX IF NOT EXISTS idx_msq_submissions_status ON msq_submissions(status);

CREATE TRIGGER set_msq_submissions_updated_at
BEFORE UPDATE ON msq_submissions
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- WSL submissions (weekly)
CREATE TABLE IF NOT EXISTS wsl_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  week_ending_date date NOT NULL,
  submission_data jsonb NOT NULL,
  status text NOT NULL DEFAULT 'submitted',
  is_late boolean DEFAULT false,
  is_non_compliant boolean DEFAULT false,
  submitted_by uuid NOT NULL REFERENCES users(id),
  submitted_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_wsl_submissions_company_id ON wsl_submissions(company_id);
CREATE INDEX IF NOT EXISTS idx_wsl_submissions_week_ending_date ON wsl_submissions(week_ending_date);
CREATE INDEX IF NOT EXISTS idx_wsl_submissions_status ON wsl_submissions(status);

CREATE TRIGGER set_wsl_submissions_updated_at
BEFORE UPDATE ON wsl_submissions
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Thresholds
CREATE TABLE IF NOT EXISTS thresholds (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sku_id uuid REFERENCES skus(id) ON DELETE CASCADE,
  threshold_type text NOT NULL,
  threshold_value numeric(15,2) NOT NULL,
  multiplier_b numeric(5,2) NOT NULL,
  aams_value numeric(15,2) NOT NULL,
  effective_from date NOT NULL,
  effective_to date,
  is_current boolean DEFAULT true,
  duration_type text DEFAULT 'permanent',
  revert_date date,
  revert_to_multiplier numeric(5,2),
  revert_to_threshold_value numeric(15,2),
  revert_notification_sent_7d boolean DEFAULT false,
  revert_notification_sent_1d boolean DEFAULT false,
  revert_notification_sent_on_revert boolean DEFAULT false,
  requires_manual_review boolean DEFAULT false,
  created_by uuid NOT NULL REFERENCES users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_thresholds_sku_id ON thresholds(sku_id);
CREATE INDEX IF NOT EXISTS idx_thresholds_threshold_type ON thresholds(threshold_type);
CREATE INDEX IF NOT EXISTS idx_thresholds_effective_from ON thresholds(effective_from);
CREATE INDEX IF NOT EXISTS idx_thresholds_is_current ON thresholds(is_current);
CREATE INDEX IF NOT EXISTS idx_thresholds_duration_type ON thresholds(duration_type);
CREATE INDEX IF NOT EXISTS idx_thresholds_revert_date ON thresholds(revert_date) WHERE revert_date IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_thresholds_requires_manual_review ON thresholds(requires_manual_review) WHERE requires_manual_review = true;

CREATE TRIGGER set_thresholds_updated_at
BEFORE UPDATE ON thresholds
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Breaches
CREATE TABLE IF NOT EXISTS breaches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sku_id uuid NOT NULL REFERENCES skus(id) ON DELETE CASCADE,
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  wsl_submission_id uuid NOT NULL REFERENCES wsl_submissions(id) ON DELETE CASCADE,
  threshold_id uuid NOT NULL REFERENCES thresholds(id) ON DELETE CASCADE,
  stock_level numeric(15,2) NOT NULL,
  threshold_value numeric(15,2) NOT NULL,
  breach_date date NOT NULL,
  breach_reason text,
  replenishment_date date,
  priority text NOT NULL DEFAULT 'standard',
  status text NOT NULL DEFAULT 'detected',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_breaches_sku_id ON breaches(sku_id);
CREATE INDEX IF NOT EXISTS idx_breaches_company_id ON breaches(company_id);
CREATE INDEX IF NOT EXISTS idx_breaches_status ON breaches(status);
CREATE INDEX IF NOT EXISTS idx_breaches_priority ON breaches(priority);

CREATE TRIGGER set_breaches_updated_at
BEFORE UPDATE ON breaches
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Breach analyses
CREATE TABLE IF NOT EXISTS breach_analyses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  breach_id uuid NOT NULL REFERENCES breaches(id) ON DELETE CASCADE,
  analyzed_by uuid NOT NULL REFERENCES users(id),
  suggested_action text NOT NULL,
  suggested_action_details text,
  analysis_notes text,
  analyzed_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_breach_analyses_breach_id ON breach_analyses(breach_id);
CREATE INDEX IF NOT EXISTS idx_breach_analyses_analyzed_by ON breach_analyses(analyzed_by);

COMMIT;

