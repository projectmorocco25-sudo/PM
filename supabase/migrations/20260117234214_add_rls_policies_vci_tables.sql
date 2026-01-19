-- Migration: Add RLS policies for VCI tables
-- Description: Implement Row Level Security policies for VCI tables (aams_submissions, msq_submissions, wsl_submissions, thresholds, breaches, breach_analyses) with company isolation
-- Date: 2026-01-17
-- Task: 1.1.1.10a
-- Author: Sami (Implementation Compliance Specialist)

BEGIN;

-- ============================================
-- AAMS_SUBMISSIONS TABLE POLICIES
-- ============================================

-- Company users can see their own company's AAMS submissions
CREATE POLICY "company_users_see_own_aams"
ON public.aams_submissions FOR SELECT
USING (
  company_id IN (
    SELECT company_id FROM public.users WHERE id = auth.uid()
  )
);

-- MOH users can see all AAMS submissions
CREATE POLICY "moh_users_see_all_aams"
ON public.aams_submissions FOR SELECT
USING (
  (SELECT company_id FROM public.users WHERE id = auth.uid()) IS NULL
);

-- Company users can create AAMS submissions for their company
CREATE POLICY "company_users_create_aams_submissions"
ON public.aams_submissions FOR INSERT
WITH CHECK (
  company_id IN (
    SELECT company_id FROM public.users WHERE id = auth.uid()
  )
);

-- Company users can update their own draft AAMS submissions
CREATE POLICY "company_users_update_own_draft_aams"
ON public.aams_submissions FOR UPDATE
USING (
  status = 'draft'
  AND company_id IN (
    SELECT company_id FROM public.users WHERE id = auth.uid()
  )
)
WITH CHECK (
  status = 'draft'
  AND company_id IN (
    SELECT company_id FROM public.users WHERE id = auth.uid()
  )
);

-- MOH Tier 1/2 can update AAMS submissions (for verification/approval)
CREATE POLICY "moh_tier1_tier2_update_aams_submissions"
ON public.aams_submissions FOR UPDATE
USING (
  (SELECT company_id FROM public.users WHERE id = auth.uid()) IS NULL
  AND (SELECT role FROM public.users WHERE id = auth.uid()) IN ('moh_tier1', 'moh_tier2')
)
WITH CHECK (
  (SELECT company_id FROM public.users WHERE id = auth.uid()) IS NULL
  AND (SELECT role FROM public.users WHERE id = auth.uid()) IN ('moh_tier1', 'moh_tier2')
);

-- Users cannot delete AAMS submissions (immutable audit trail)
-- No DELETE policy

-- ============================================
-- MSQ_SUBMISSIONS TABLE POLICIES
-- ============================================

-- Company users can see their own company's MSQ submissions
CREATE POLICY "company_users_see_own_msq"
ON public.msq_submissions FOR SELECT
USING (
  company_id IN (
    SELECT company_id FROM public.users WHERE id = auth.uid()
  )
);

-- MOH users can see all MSQ submissions
CREATE POLICY "moh_users_see_all_msq"
ON public.msq_submissions FOR SELECT
USING (
  (SELECT company_id FROM public.users WHERE id = auth.uid()) IS NULL
);

-- Company users can create MSQ submissions for their company
CREATE POLICY "company_users_create_msq_submissions"
ON public.msq_submissions FOR INSERT
WITH CHECK (
  company_id IN (
    SELECT company_id FROM public.users WHERE id = auth.uid()
  )
);

-- Company users can update their own MSQ submissions (for corrections)
CREATE POLICY "company_users_update_own_msq_submissions"
ON public.msq_submissions FOR UPDATE
USING (
  company_id IN (
    SELECT company_id FROM public.users WHERE id = auth.uid()
  )
)
WITH CHECK (
  company_id IN (
    SELECT company_id FROM public.users WHERE id = auth.uid()
  )
);

-- MOH Tier 1/2 can update MSQ submissions (for review/flagging)
CREATE POLICY "moh_tier1_tier2_update_msq_submissions"
ON public.msq_submissions FOR UPDATE
USING (
  (SELECT company_id FROM public.users WHERE id = auth.uid()) IS NULL
  AND (SELECT role FROM public.users WHERE id = auth.uid()) IN ('moh_tier1', 'moh_tier2')
)
WITH CHECK (
  (SELECT company_id FROM public.users WHERE id = auth.uid()) IS NULL
  AND (SELECT role FROM public.users WHERE id = auth.uid()) IN ('moh_tier1', 'moh_tier2')
);

-- Users cannot delete MSQ submissions (immutable audit trail)
-- No DELETE policy

-- ============================================
-- WSL_SUBMISSIONS TABLE POLICIES
-- ============================================

-- Company users can see their own company's WSL submissions
CREATE POLICY "company_users_see_own_wsl"
ON public.wsl_submissions FOR SELECT
USING (
  company_id IN (
    SELECT company_id FROM public.users WHERE id = auth.uid()
  )
);

-- MOH users can see all WSL submissions
CREATE POLICY "moh_users_see_all_wsl"
ON public.wsl_submissions FOR SELECT
USING (
  (SELECT company_id FROM public.users WHERE id = auth.uid()) IS NULL
);

-- Company users can create WSL submissions for their company
CREATE POLICY "company_users_create_wsl_submissions"
ON public.wsl_submissions FOR INSERT
WITH CHECK (
  company_id IN (
    SELECT company_id FROM public.users WHERE id = auth.uid()
  )
);

-- Company users can update their own WSL submissions
CREATE POLICY "company_users_update_own_wsl_submissions"
ON public.wsl_submissions FOR UPDATE
USING (
  company_id IN (
    SELECT company_id FROM public.users WHERE id = auth.uid()
  )
)
WITH CHECK (
  company_id IN (
    SELECT company_id FROM public.users WHERE id = auth.uid()
  )
);

-- MOH Tier 1/2 can update WSL submissions (for review/status updates)
CREATE POLICY "moh_tier1_tier2_update_wsl_submissions"
ON public.wsl_submissions FOR UPDATE
USING (
  (SELECT company_id FROM public.users WHERE id = auth.uid()) IS NULL
  AND (SELECT role FROM public.users WHERE id = auth.uid()) IN ('moh_tier1', 'moh_tier2')
)
WITH CHECK (
  (SELECT company_id FROM public.users WHERE id = auth.uid()) IS NULL
  AND (SELECT role FROM public.users WHERE id = auth.uid()) IN ('moh_tier1', 'moh_tier2')
);

-- Users cannot delete WSL submissions (immutable audit trail)
-- No DELETE policy

-- ============================================
-- THRESHOLDS TABLE POLICIES
-- ============================================

-- Company users can see thresholds for their own company's SKUs
CREATE POLICY "company_users_see_own_thresholds"
ON public.thresholds FOR SELECT
USING (
  sku_id IN (
    SELECT id FROM public.skus
    WHERE product_id IN (
      SELECT id FROM public.products
      WHERE company_id IN (
        SELECT company_id FROM public.users WHERE id = auth.uid()
      )
    )
  )
  OR sku_id IS NULL  -- Global thresholds visible to all
);

-- MOH users can see all thresholds
CREATE POLICY "moh_users_see_all_thresholds"
ON public.thresholds FOR SELECT
USING (
  (SELECT company_id FROM public.users WHERE id = auth.uid()) IS NULL
);

-- MOH Tier 1 can create thresholds (INSERT for new versions)
CREATE POLICY "moh_tier1_insert_thresholds"
ON public.thresholds FOR INSERT
WITH CHECK (
  (SELECT company_id FROM public.users WHERE id = auth.uid()) IS NULL
  AND (SELECT role FROM public.users WHERE id = auth.uid()) = 'moh_tier1'
);

-- MOH Tier 1 can update thresholds (for status changes, reversion)
CREATE POLICY "moh_tier1_update_thresholds"
ON public.thresholds FOR UPDATE
USING (
  (SELECT company_id FROM public.users WHERE id = auth.uid()) IS NULL
  AND (SELECT role FROM public.users WHERE id = auth.uid()) = 'moh_tier1'
)
WITH CHECK (
  (SELECT company_id FROM public.users WHERE id = auth.uid()) IS NULL
  AND (SELECT role FROM public.users WHERE id = auth.uid()) = 'moh_tier1'
);

-- System can update thresholds (for auto-reversion via scheduled job)
-- Note: This uses a system user UUID - actual implementation may use service role
CREATE POLICY "system_update_thresholds_for_reversion"
ON public.thresholds FOR UPDATE
USING (false)  -- Disabled by default - use service role in RPC functions instead
WITH CHECK (false);

-- Users cannot delete thresholds (version history - mark as not current instead)
-- No DELETE policy

-- ============================================
-- BREACHES TABLE POLICIES
-- ============================================

-- Company users can see breaches for their company
CREATE POLICY "company_users_see_own_breaches"
ON public.breaches FOR SELECT
USING (
  company_id IN (
    SELECT company_id FROM public.users WHERE id = auth.uid()
  )
);

-- MOH users can see all breaches
CREATE POLICY "moh_users_see_all_breaches"
ON public.breaches FOR SELECT
USING (
  (SELECT company_id FROM public.users WHERE id = auth.uid()) IS NULL
);

-- System/RPC functions can create breaches (automated detection)
-- No direct INSERT policy - handled via RPC functions

-- Company users can update their own company's breaches (add breach_reason, replenishment_date)
CREATE POLICY "company_users_update_own_breaches"
ON public.breaches FOR UPDATE
USING (
  company_id IN (
    SELECT company_id FROM public.users WHERE id = auth.uid()
  )
)
WITH CHECK (
  company_id IN (
    SELECT company_id FROM public.users WHERE id = auth.uid()
  )
  -- Only allow updating breach_reason and replenishment_date
  AND OLD.sku_id = NEW.sku_id
  AND OLD.company_id = NEW.company_id
  AND OLD.wsl_submission_id = NEW.wsl_submission_id
  AND OLD.threshold_id = NEW.threshold_id
  AND OLD.stock_level = NEW.stock_level
  AND OLD.threshold_value = NEW.threshold_value
  AND OLD.breach_date = NEW.breach_date
);

-- MOH Tier 1/2 can update breaches (for status changes, priority updates)
CREATE POLICY "moh_tier1_tier2_update_breaches"
ON public.breaches FOR UPDATE
USING (
  (SELECT company_id FROM public.users WHERE id = auth.uid()) IS NULL
  AND (SELECT role FROM public.users WHERE id = auth.uid()) IN ('moh_tier1', 'moh_tier2')
)
WITH CHECK (
  (SELECT company_id FROM public.users WHERE id = auth.uid()) IS NULL
  AND (SELECT role FROM public.users WHERE id = auth.uid()) IN ('moh_tier1', 'moh_tier2')
);

-- Users cannot delete breaches (immutable audit trail)
-- No DELETE policy

-- ============================================
-- BREACH_ANALYSES TABLE POLICIES
-- ============================================

-- Users can see breach_analyses for breaches they have access to
CREATE POLICY "users_see_breach_analyses_for_accessible_breaches"
ON public.breach_analyses FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.breaches b
    WHERE b.id = breach_analyses.breach_id
    AND (
      -- Company users can see analyses for their company's breaches
      b.company_id IN (
        SELECT company_id FROM public.users WHERE id = auth.uid()
      )
      OR
      -- MOH users can see all analyses
      (SELECT company_id FROM public.users WHERE id = auth.uid()) IS NULL
    )
  )
);

-- MOH Tier 2 can create breach analyses
CREATE POLICY "moh_tier2_create_breach_analyses"
ON public.breach_analyses FOR INSERT
WITH CHECK (
  (SELECT company_id FROM public.users WHERE id = auth.uid()) IS NULL
  AND (SELECT role FROM public.users WHERE id = auth.uid()) = 'moh_tier2'
);

-- MOH Tier 2 can update their own breach analyses
CREATE POLICY "moh_tier2_update_own_breach_analyses"
ON public.breach_analyses FOR UPDATE
USING (
  (SELECT company_id FROM public.users WHERE id = auth.uid()) IS NULL
  AND (SELECT role FROM public.users WHERE id = auth.uid()) = 'moh_tier2'
  AND analyzed_by = auth.uid()
)
WITH CHECK (
  (SELECT company_id FROM public.users WHERE id = auth.uid()) IS NULL
  AND (SELECT role FROM public.users WHERE id = auth.uid()) = 'moh_tier2'
  AND analyzed_by = auth.uid()
);

-- Users cannot delete breach analyses (immutable audit trail)
-- No DELETE policy

COMMIT;
