-- Migration: add_rls_policies_vci_tables
-- Description: Enable RLS + policies for VCI tables (company isolation)
-- Date: 2025-01-12
-- Author: Nadia
-- Phase: 1.1.1
-- Task: 1.1.1.10a
-- Depends on: 20250112205000_create_vci_tables

BEGIN;

ALTER TABLE aams_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE msq_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE wsl_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE thresholds ENABLE ROW LEVEL SECURITY;
ALTER TABLE breaches ENABLE ROW LEVEL SECURITY;
ALTER TABLE breach_analyses ENABLE ROW LEVEL SECURITY;

-- Helpers are inlined as EXISTS on users table (consistent with earlier policies).

-- ================
-- aams_submissions
-- ================
DROP POLICY IF EXISTS "aams_select_moh_all" ON aams_submissions;
DROP POLICY IF EXISTS "aams_select_company_own" ON aams_submissions;
DROP POLICY IF EXISTS "aams_insert_company_own" ON aams_submissions;
DROP POLICY IF EXISTS "aams_update_company_own" ON aams_submissions;
DROP POLICY IF EXISTS "aams_update_moh_all" ON aams_submissions;

CREATE POLICY "aams_select_moh_all"
ON aams_submissions
FOR SELECT
USING (
  EXISTS (SELECT 1 FROM users u WHERE u.id=auth.uid() AND u.role IN ('moh_tier1','moh_tier2_officer','moh_tier2_registrar','system_admin'))
);

CREATE POLICY "aams_select_company_own"
ON aams_submissions
FOR SELECT
USING (
  EXISTS (SELECT 1 FROM users u WHERE u.id=auth.uid() AND u.company_id=aams_submissions.company_id AND u.role IN ('ipc_admin','ipc_user','wholesaler_admin','wholesaler_user'))
);

CREATE POLICY "aams_insert_company_own"
ON aams_submissions
FOR INSERT
WITH CHECK (
  EXISTS (SELECT 1 FROM users u WHERE u.id=auth.uid() AND u.company_id=aams_submissions.company_id AND u.role IN ('ipc_admin','ipc_user','wholesaler_admin','wholesaler_user'))
  OR EXISTS (SELECT 1 FROM users u WHERE u.id=auth.uid() AND u.role IN ('moh_tier1','moh_tier2_registrar','system_admin'))
);

CREATE POLICY "aams_update_company_own"
ON aams_submissions
FOR UPDATE
USING (
  EXISTS (SELECT 1 FROM users u WHERE u.id=auth.uid() AND u.company_id=aams_submissions.company_id AND u.role IN ('ipc_admin','ipc_user','wholesaler_admin','wholesaler_user'))
)
WITH CHECK (
  EXISTS (SELECT 1 FROM users u WHERE u.id=auth.uid() AND u.company_id=aams_submissions.company_id AND u.role IN ('ipc_admin','ipc_user','wholesaler_admin','wholesaler_user'))
);

CREATE POLICY "aams_update_moh_all"
ON aams_submissions
FOR UPDATE
USING (
  EXISTS (SELECT 1 FROM users u WHERE u.id=auth.uid() AND u.role IN ('moh_tier1','moh_tier2_officer','moh_tier2_registrar','system_admin'))
)
WITH CHECK (
  EXISTS (SELECT 1 FROM users u WHERE u.id=auth.uid() AND u.role IN ('moh_tier1','moh_tier2_officer','moh_tier2_registrar','system_admin'))
);

-- ===============
-- msq_submissions
-- ===============
DROP POLICY IF EXISTS "msq_select_moh_all" ON msq_submissions;
DROP POLICY IF EXISTS "msq_select_company_own" ON msq_submissions;
DROP POLICY IF EXISTS "msq_insert_company_own" ON msq_submissions;
DROP POLICY IF EXISTS "msq_update_company_own" ON msq_submissions;
DROP POLICY IF EXISTS "msq_update_moh_all" ON msq_submissions;

CREATE POLICY "msq_select_moh_all"
ON msq_submissions
FOR SELECT
USING (
  EXISTS (SELECT 1 FROM users u WHERE u.id=auth.uid() AND u.role IN ('moh_tier1','moh_tier2_officer','moh_tier2_registrar','system_admin'))
);

CREATE POLICY "msq_select_company_own"
ON msq_submissions
FOR SELECT
USING (
  EXISTS (SELECT 1 FROM users u WHERE u.id=auth.uid() AND u.company_id=msq_submissions.company_id AND u.role IN ('ipc_admin','ipc_user','wholesaler_admin','wholesaler_user'))
);

CREATE POLICY "msq_insert_company_own"
ON msq_submissions
FOR INSERT
WITH CHECK (
  EXISTS (SELECT 1 FROM users u WHERE u.id=auth.uid() AND u.company_id=msq_submissions.company_id AND u.role IN ('ipc_admin','ipc_user','wholesaler_admin','wholesaler_user'))
  OR EXISTS (SELECT 1 FROM users u WHERE u.id=auth.uid() AND u.role IN ('moh_tier1','moh_tier2_registrar','system_admin'))
);

CREATE POLICY "msq_update_company_own"
ON msq_submissions
FOR UPDATE
USING (
  EXISTS (SELECT 1 FROM users u WHERE u.id=auth.uid() AND u.company_id=msq_submissions.company_id AND u.role IN ('ipc_admin','ipc_user','wholesaler_admin','wholesaler_user'))
)
WITH CHECK (
  EXISTS (SELECT 1 FROM users u WHERE u.id=auth.uid() AND u.company_id=msq_submissions.company_id AND u.role IN ('ipc_admin','ipc_user','wholesaler_admin','wholesaler_user'))
);

CREATE POLICY "msq_update_moh_all"
ON msq_submissions
FOR UPDATE
USING (
  EXISTS (SELECT 1 FROM users u WHERE u.id=auth.uid() AND u.role IN ('moh_tier1','moh_tier2_officer','moh_tier2_registrar','system_admin'))
)
WITH CHECK (
  EXISTS (SELECT 1 FROM users u WHERE u.id=auth.uid() AND u.role IN ('moh_tier1','moh_tier2_officer','moh_tier2_registrar','system_admin'))
);

-- ===============
-- wsl_submissions
-- ===============
DROP POLICY IF EXISTS "wsl_select_moh_all" ON wsl_submissions;
DROP POLICY IF EXISTS "wsl_select_company_own" ON wsl_submissions;
DROP POLICY IF EXISTS "wsl_insert_company_own" ON wsl_submissions;
DROP POLICY IF EXISTS "wsl_update_company_own" ON wsl_submissions;
DROP POLICY IF EXISTS "wsl_update_moh_all" ON wsl_submissions;

CREATE POLICY "wsl_select_moh_all"
ON wsl_submissions
FOR SELECT
USING (
  EXISTS (SELECT 1 FROM users u WHERE u.id=auth.uid() AND u.role IN ('moh_tier1','moh_tier2_officer','moh_tier2_registrar','system_admin'))
);

CREATE POLICY "wsl_select_company_own"
ON wsl_submissions
FOR SELECT
USING (
  EXISTS (SELECT 1 FROM users u WHERE u.id=auth.uid() AND u.company_id=wsl_submissions.company_id AND u.role IN ('ipc_admin','ipc_user','wholesaler_admin','wholesaler_user'))
);

CREATE POLICY "wsl_insert_company_own"
ON wsl_submissions
FOR INSERT
WITH CHECK (
  EXISTS (SELECT 1 FROM users u WHERE u.id=auth.uid() AND u.company_id=wsl_submissions.company_id AND u.role IN ('ipc_admin','ipc_user','wholesaler_admin','wholesaler_user'))
  OR EXISTS (SELECT 1 FROM users u WHERE u.id=auth.uid() AND u.role IN ('moh_tier1','moh_tier2_registrar','system_admin'))
);

CREATE POLICY "wsl_update_company_own"
ON wsl_submissions
FOR UPDATE
USING (
  EXISTS (SELECT 1 FROM users u WHERE u.id=auth.uid() AND u.company_id=wsl_submissions.company_id AND u.role IN ('ipc_admin','ipc_user','wholesaler_admin','wholesaler_user'))
)
WITH CHECK (
  EXISTS (SELECT 1 FROM users u WHERE u.id=auth.uid() AND u.company_id=wsl_submissions.company_id AND u.role IN ('ipc_admin','ipc_user','wholesaler_admin','wholesaler_user'))
);

CREATE POLICY "wsl_update_moh_all"
ON wsl_submissions
FOR UPDATE
USING (
  EXISTS (SELECT 1 FROM users u WHERE u.id=auth.uid() AND u.role IN ('moh_tier1','moh_tier2_officer','moh_tier2_registrar','system_admin'))
)
WITH CHECK (
  EXISTS (SELECT 1 FROM users u WHERE u.id=auth.uid() AND u.role IN ('moh_tier1','moh_tier2_officer','moh_tier2_registrar','system_admin'))
);

-- ==========
-- thresholds
-- ==========
-- Company read-only; MOH write
DROP POLICY IF EXISTS "thresholds_select_all_authed" ON thresholds;
DROP POLICY IF EXISTS "thresholds_write_moh_only" ON thresholds;

CREATE POLICY "thresholds_select_all_authed"
ON thresholds
FOR SELECT
USING (auth.uid() IS NOT NULL);

CREATE POLICY "thresholds_write_moh_only"
ON thresholds
FOR ALL
USING (
  EXISTS (SELECT 1 FROM users u WHERE u.id=auth.uid() AND u.role IN ('moh_tier1','moh_tier2_officer','moh_tier2_registrar','system_admin'))
)
WITH CHECK (
  EXISTS (SELECT 1 FROM users u WHERE u.id=auth.uid() AND u.role IN ('moh_tier1','moh_tier2_officer','moh_tier2_registrar','system_admin'))
);

-- ========
-- breaches
-- ========
DROP POLICY IF EXISTS "breaches_select_moh_all" ON breaches;
DROP POLICY IF EXISTS "breaches_select_company_own" ON breaches;
DROP POLICY IF EXISTS "breaches_insert_moh_only" ON breaches;
DROP POLICY IF EXISTS "breaches_update_company_own" ON breaches;
DROP POLICY IF EXISTS "breaches_update_moh_all" ON breaches;

CREATE POLICY "breaches_select_moh_all"
ON breaches
FOR SELECT
USING (
  EXISTS (SELECT 1 FROM users u WHERE u.id=auth.uid() AND u.role IN ('moh_tier1','moh_tier2_officer','moh_tier2_registrar','system_admin'))
);

CREATE POLICY "breaches_select_company_own"
ON breaches
FOR SELECT
USING (
  EXISTS (SELECT 1 FROM users u WHERE u.id=auth.uid() AND u.company_id=breaches.company_id AND u.role IN ('ipc_admin','ipc_user','wholesaler_admin','wholesaler_user'))
);

CREATE POLICY "breaches_insert_moh_only"
ON breaches
FOR INSERT
WITH CHECK (
  EXISTS (SELECT 1 FROM users u WHERE u.id=auth.uid() AND u.role IN ('moh_tier1','moh_tier2_officer','moh_tier2_registrar','system_admin'))
);

CREATE POLICY "breaches_update_company_own"
ON breaches
FOR UPDATE
USING (
  EXISTS (SELECT 1 FROM users u WHERE u.id=auth.uid() AND u.company_id=breaches.company_id AND u.role IN ('ipc_admin','ipc_user','wholesaler_admin','wholesaler_user'))
)
WITH CHECK (
  EXISTS (SELECT 1 FROM users u WHERE u.id=auth.uid() AND u.company_id=breaches.company_id AND u.role IN ('ipc_admin','ipc_user','wholesaler_admin','wholesaler_user'))
);

CREATE POLICY "breaches_update_moh_all"
ON breaches
FOR UPDATE
USING (
  EXISTS (SELECT 1 FROM users u WHERE u.id=auth.uid() AND u.role IN ('moh_tier1','moh_tier2_officer','moh_tier2_registrar','system_admin'))
)
WITH CHECK (
  EXISTS (SELECT 1 FROM users u WHERE u.id=auth.uid() AND u.role IN ('moh_tier1','moh_tier2_officer','moh_tier2_registrar','system_admin'))
);

-- ==============
-- breach_analyses
-- ==============
-- MOH only; company cannot see.
DROP POLICY IF EXISTS "breach_analyses_select_moh_all" ON breach_analyses;
DROP POLICY IF EXISTS "breach_analyses_write_moh_only" ON breach_analyses;

CREATE POLICY "breach_analyses_select_moh_all"
ON breach_analyses
FOR SELECT
USING (
  EXISTS (SELECT 1 FROM users u WHERE u.id=auth.uid() AND u.role IN ('moh_tier1','moh_tier2_officer','moh_tier2_registrar','system_admin'))
);

CREATE POLICY "breach_analyses_write_moh_only"
ON breach_analyses
FOR ALL
USING (
  EXISTS (SELECT 1 FROM users u WHERE u.id=auth.uid() AND u.role IN ('moh_tier1','moh_tier2_officer','moh_tier2_registrar','system_admin'))
)
WITH CHECK (
  EXISTS (SELECT 1 FROM users u WHERE u.id=auth.uid() AND u.role IN ('moh_tier1','moh_tier2_officer','moh_tier2_registrar','system_admin'))
);

COMMIT;

