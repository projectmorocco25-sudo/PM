-- Migration: Add RLS policies for RMM tables
-- Description: Implement Row Level Security policies for RMM tables (companies, products, skus, atc_codes, critical_medicines, enforcement_actions, registry_submissions)
-- Date: 2026-01-17
-- Task: 1.1.1.8a, 1.1.1.8b, 1.1.1.8c, 1.1.1.8d, 1.1.1.8e, 1.1.1.8f, 1.1.1.8g
-- Author: Sami (Implementation Compliance Specialist)

BEGIN;

-- ============================================
-- COMPANIES TABLE POLICIES (Task 1.1.1.8a)
-- ============================================

-- Company users can see their own company
CREATE POLICY "company_users_see_own_company"
ON public.companies FOR SELECT
USING (
  id IN (
    SELECT company_id FROM public.users WHERE id = auth.uid()
  )
);

-- MOH users can see all companies
CREATE POLICY "moh_users_see_all_companies"
ON public.companies FOR SELECT
USING (
  (SELECT company_id FROM public.users WHERE id = auth.uid()) IS NULL
);

-- Company users can create companies (via registry submission workflow, not directly)
-- Direct creation is not allowed - must go through registry_submissions
-- Only MOH can create companies directly (via registry submissions)
-- No INSERT policy for company users

-- Company users can update their own company (via registry submission workflow, not directly)
-- Updates should go through registry_submissions workflow
-- MOH can update companies directly (for administrative purposes)
CREATE POLICY "moh_users_update_companies"
ON public.companies FOR UPDATE
USING (
  (SELECT company_id FROM public.users WHERE id = auth.uid()) IS NULL
)
WITH CHECK (
  (SELECT company_id FROM public.users WHERE id = auth.uid()) IS NULL
);

-- Users cannot delete companies (soft delete via is_active = false, handled through registry_submissions workflow)
-- No DELETE policy - deletion handled via registry_submissions workflow

-- ============================================
-- PRODUCTS TABLE POLICIES (Task 1.1.1.8b)
-- ============================================

-- Company users can see their own company's products
CREATE POLICY "company_users_see_own_products"
ON public.products FOR SELECT
USING (
  company_id IN (
    SELECT company_id FROM public.users WHERE id = auth.uid()
  )
);

-- MOH users can see all products
CREATE POLICY "moh_users_see_all_products"
ON public.products FOR SELECT
USING (
  (SELECT company_id FROM public.users WHERE id = auth.uid()) IS NULL
);

-- Company users can create products (via registry submission workflow)
-- RPC functions will handle workflow
-- No direct INSERT policy - handled via registry_submissions

-- Company users can update their own company's products (via registry submission workflow)
-- MOH can update products directly
CREATE POLICY "moh_users_update_products"
ON public.products FOR UPDATE
USING (
  (SELECT company_id FROM public.users WHERE id = auth.uid()) IS NULL
)
WITH CHECK (
  (SELECT company_id FROM public.users WHERE id = auth.uid()) IS NULL
);

-- Users cannot delete products (soft delete via is_active = false, handled through registry_submissions workflow)
-- No DELETE policy

-- ============================================
-- SKUS TABLE POLICIES (Task 1.1.1.8c)
-- ============================================

-- Company users can see their own company's SKUs (via products→companies relationship)
CREATE POLICY "company_users_see_own_skus"
ON public.skus FOR SELECT
USING (
  product_id IN (
    SELECT id FROM public.products
    WHERE company_id IN (
      SELECT company_id FROM public.users WHERE id = auth.uid()
    )
  )
);

-- MOH users can see all SKUs
CREATE POLICY "moh_users_see_all_skus"
ON public.skus FOR SELECT
USING (
  (SELECT company_id FROM public.users WHERE id = auth.uid()) IS NULL
);

-- Company users can create SKUs (via registry submission workflow)
-- RPC functions will handle workflow
-- No direct INSERT policy - handled via registry_submissions

-- Company users can update their own company's SKUs (via registry submission workflow)
-- MOH can update SKUs directly
CREATE POLICY "moh_users_update_skus"
ON public.skus FOR UPDATE
USING (
  product_id IN (
    SELECT id FROM public.products
    WHERE company_id IS NULL OR (SELECT company_id FROM public.users WHERE id = auth.uid()) IS NULL
  )
)
WITH CHECK (
  (SELECT company_id FROM public.users WHERE id = auth.uid()) IS NULL
);

-- Users cannot delete SKUs (soft delete via is_active = false, handled through registry_submissions workflow)
-- No DELETE policy

-- ============================================
-- ATC_CODES TABLE POLICIES (Task 1.1.1.8d)
-- ============================================

-- All authenticated users can see ATC codes (read-only for companies)
CREATE POLICY "users_see_atc_codes"
ON public.atc_codes FOR SELECT
USING (auth.role() = 'authenticated');

-- MOH can create/update ATC codes (MOH write access)
CREATE POLICY "moh_users_insert_atc_codes"
ON public.atc_codes FOR INSERT
WITH CHECK (
  (SELECT company_id FROM public.users WHERE id = auth.uid()) IS NULL
);

CREATE POLICY "moh_users_update_atc_codes"
ON public.atc_codes FOR UPDATE
USING (
  (SELECT company_id FROM public.users WHERE id = auth.uid()) IS NULL
)
WITH CHECK (
  (SELECT company_id FROM public.users WHERE id = auth.uid()) IS NULL
);

-- Users cannot delete ATC codes (soft delete via is_active = false)
-- No DELETE policy

-- ============================================
-- CRITICAL_MEDICINES TABLE POLICIES (Task 1.1.1.8e)
-- ============================================

-- All authenticated users can see critical medicines (read-only for companies)
CREATE POLICY "users_see_critical_medicines"
ON public.critical_medicines FOR SELECT
USING (auth.role() = 'authenticated');

-- MOH Tier 1 can create/update critical medicines
CREATE POLICY "moh_tier1_insert_critical_medicines"
ON public.critical_medicines FOR INSERT
WITH CHECK (
  (SELECT company_id FROM public.users WHERE id = auth.uid()) IS NULL
  AND (SELECT role FROM public.users WHERE id = auth.uid()) = 'moh_tier1'
);

CREATE POLICY "moh_tier1_update_critical_medicines"
ON public.critical_medicines FOR UPDATE
USING (
  (SELECT company_id FROM public.users WHERE id = auth.uid()) IS NULL
  AND (SELECT role FROM public.users WHERE id = auth.uid()) = 'moh_tier1'
)
WITH CHECK (
  (SELECT company_id FROM public.users WHERE id = auth.uid()) IS NULL
  AND (SELECT role FROM public.users WHERE id = auth.uid()) = 'moh_tier1'
);

-- Users cannot delete critical medicines (soft delete via is_active = false)
-- No DELETE policy

-- ============================================
-- ENFORCEMENT_ACTIONS TABLE POLICIES (Task 1.1.1.8f)
-- ============================================

-- Company users can see enforcement_actions for their company only
CREATE POLICY "company_users_see_own_enforcement_actions"
ON public.enforcement_actions FOR SELECT
USING (
  company_id IN (
    SELECT company_id FROM public.users WHERE id = auth.uid()
  )
);

-- MOH Tier 1/2 can see all enforcement_actions
CREATE POLICY "moh_tier1_tier2_see_all_enforcement_actions"
ON public.enforcement_actions FOR SELECT
USING (
  (SELECT company_id FROM public.users WHERE id = auth.uid()) IS NULL
  AND (SELECT role FROM public.users WHERE id = auth.uid()) IN ('moh_tier1', 'moh_tier2')
);

-- MOH Tier 1/2 can create enforcement actions
CREATE POLICY "moh_tier1_tier2_create_enforcement_actions"
ON public.enforcement_actions FOR INSERT
WITH CHECK (
  (SELECT company_id FROM public.users WHERE id = auth.uid()) IS NULL
  AND (SELECT role FROM public.users WHERE id = auth.uid()) IN ('moh_tier1', 'moh_tier2')
);

-- Tier 2 can update draft/pending_review enforcement actions
CREATE POLICY "tier2_update_draft_pending_review_enforcement_actions"
ON public.enforcement_actions FOR UPDATE
USING (
  (SELECT company_id FROM public.users WHERE id = auth.uid()) IS NULL
  AND (SELECT role FROM public.users WHERE id = auth.uid()) = 'moh_tier2'
  AND status IN ('draft', 'pending_review')
)
WITH CHECK (
  (SELECT company_id FROM public.users WHERE id = auth.uid()) IS NULL
  AND (SELECT role FROM public.users WHERE id = auth.uid()) = 'moh_tier2'
  AND status IN ('draft', 'pending_review')
);

-- Tier 1 can update pending_approval/approved enforcement actions
CREATE POLICY "tier1_update_pending_approval_approved_enforcement_actions"
ON public.enforcement_actions FOR UPDATE
USING (
  (SELECT company_id FROM public.users WHERE id = auth.uid()) IS NULL
  AND (SELECT role FROM public.users WHERE id = auth.uid()) = 'moh_tier1'
  AND status IN ('pending_approval', 'approved')
)
WITH CHECK (
  (SELECT company_id FROM public.users WHERE id = auth.uid()) IS NULL
  AND (SELECT role FROM public.users WHERE id = auth.uid()) = 'moh_tier1'
  AND status IN ('pending_approval', 'approved')
);

-- Users cannot delete enforcement actions (soft delete via status = 'cancelled')
-- No DELETE policy

-- ============================================
-- REGISTRY_SUBMISSIONS TABLE POLICIES (Task 1.1.1.8g)
-- ============================================

-- Company users can see registry_submissions for their company
-- This is complex because submission_data contains company_id, or entity_id references company
-- For simplicity, we'll use a policy that checks entity relationships
-- More precise filtering handled in RPC functions
CREATE POLICY "company_users_see_own_registry_submissions"
ON public.registry_submissions FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.users u
    WHERE u.id = auth.uid()
    AND u.company_id IS NOT NULL
    AND (
      -- If entity_type is 'company' and entity_id matches user's company
      (entity_type = 'company' AND entity_id = u.company_id)
      OR
      -- If entity_type is 'product', check product belongs to user's company
      (entity_type = 'product' AND EXISTS (
        SELECT 1 FROM public.products p
        WHERE p.id = entity_id
        AND p.company_id = u.company_id
      ))
      OR
      -- If entity_type is 'sku', check sku belongs to user's company via product
      (entity_type = 'sku' AND EXISTS (
        SELECT 1 FROM public.skus s
        JOIN public.products p ON p.id = s.product_id
        WHERE s.id = entity_id
        AND p.company_id = u.company_id
      ))
      OR
      -- If submitted_by is the user
      submitted_by = auth.uid()
    )
  )
);

-- MOH Tier 1/2 can see all registry_submissions
CREATE POLICY "moh_tier1_tier2_see_all_registry_submissions"
ON public.registry_submissions FOR SELECT
USING (
  (SELECT company_id FROM public.users WHERE id = auth.uid()) IS NULL
  AND (SELECT role FROM public.users WHERE id = auth.uid()) IN ('moh_tier1', 'moh_tier2')
);

-- Company users can create draft submissions for their company
CREATE POLICY "company_users_create_draft_registry_submissions"
ON public.registry_submissions FOR INSERT
WITH CHECK (
  status = 'draft'
  AND EXISTS (
    SELECT 1 FROM public.users u
    WHERE u.id = auth.uid()
    AND u.company_id IS NOT NULL
  )
);

-- MOH can create submissions for any company
CREATE POLICY "moh_create_registry_submissions"
ON public.registry_submissions FOR INSERT
WITH CHECK (
  (SELECT company_id FROM public.users WHERE id = auth.uid()) IS NULL
);

-- Company users can update own draft submissions
CREATE POLICY "company_users_update_own_draft_registry_submissions"
ON public.registry_submissions FOR UPDATE
USING (
  status = 'draft'
  AND submitted_by = auth.uid()
)
WITH CHECK (
  status = 'draft'
  AND submitted_by = auth.uid()
);

-- Tier 2 can update submitted/tier2_verified submissions
CREATE POLICY "tier2_update_submitted_verified_registry_submissions"
ON public.registry_submissions FOR UPDATE
USING (
  (SELECT company_id FROM public.users WHERE id = auth.uid()) IS NULL
  AND (SELECT role FROM public.users WHERE id = auth.uid()) = 'moh_tier2'
  AND status IN ('submitted', 'tier2_verified')
)
WITH CHECK (
  (SELECT company_id FROM public.users WHERE id = auth.uid()) IS NULL
  AND (SELECT role FROM public.users WHERE id = auth.uid()) = 'moh_tier2'
  AND status IN ('submitted', 'tier2_verified')
);

-- Tier 1 can update tier1_approved submissions
CREATE POLICY "tier1_update_approved_registry_submissions"
ON public.registry_submissions FOR UPDATE
USING (
  (SELECT company_id FROM public.users WHERE id = auth.uid()) IS NULL
  AND (SELECT role FROM public.users WHERE id = auth.uid()) = 'moh_tier1'
  AND status = 'tier1_approved'
)
WITH CHECK (
  (SELECT company_id FROM public.users WHERE id = auth.uid()) IS NULL
  AND (SELECT role FROM public.users WHERE id = auth.uid()) = 'moh_tier1'
  AND status = 'tier1_approved'
);

-- Users cannot delete registry_submissions (immutable audit trail)
-- No DELETE policy

COMMIT;
