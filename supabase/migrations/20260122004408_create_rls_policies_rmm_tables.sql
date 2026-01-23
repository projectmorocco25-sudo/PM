-- Migration: create_rls_policies_rmm_tables
-- Description: Implement RLS policies for RMM tables (companies, products, skus, atc_codes, critical_medicines, registry_submissions)
-- Date: 2026-01-22
-- Task: 1.1.1.5
-- Author: Sami (Implementation Compliance Specialist)
-- Dependencies: Task 1.1.1.3 (RMM tables must exist)

BEGIN;

-- ============================================================================
-- Enable RLS on all RMM tables
-- ============================================================================

ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE skus ENABLE ROW LEVEL SECURITY;
ALTER TABLE atc_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE critical_medicines ENABLE ROW LEVEL SECURITY;
ALTER TABLE registry_submissions ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- companies table RLS policies
-- ============================================================================

-- Company users can see their own company
CREATE POLICY "company_users_see_own_company"
ON companies FOR SELECT
USING (
    id IN (
        SELECT company_id FROM users WHERE id = auth.uid()
    )
);

-- MOH users can see all companies
CREATE POLICY "moh_users_see_all_companies"
ON companies FOR SELECT
USING (
    (SELECT company_id FROM users WHERE id = auth.uid()) IS NULL
);

-- Company users can update their own company (via RPC functions with proper authorization)
-- Note: Company updates are handled via RPC functions with proper authorization

-- MOH users can create/update companies (via RPC functions with proper authorization)
-- Note: Company management is handled via RPC functions with proper authorization

-- ============================================================================
-- products table RLS policies
-- ============================================================================

-- Company users can see their own company's products
CREATE POLICY "company_users_see_own_products"
ON products FOR SELECT
USING (
    company_id IN (
        SELECT company_id FROM users WHERE id = auth.uid()
    )
);

-- MOH users can see all products
CREATE POLICY "moh_users_see_all_products"
ON products FOR SELECT
USING (
    (SELECT company_id FROM users WHERE id = auth.uid()) IS NULL
);

-- Company users can create/update their own company's products (via RPC functions)
-- Note: Product management is handled via RPC functions with proper authorization

-- MOH users can create/update products (via RPC functions with proper authorization)
-- Note: Product management is handled via RPC functions with proper authorization

-- ============================================================================
-- skus table RLS policies
-- ============================================================================

-- Company users can see their own company's SKUs
CREATE POLICY "company_users_see_own_skus"
ON skus FOR SELECT
USING (
    product_id IN (
        SELECT id FROM products
        WHERE company_id IN (
            SELECT company_id FROM users WHERE id = auth.uid()
        )
    )
);

-- MOH users can see all SKUs
CREATE POLICY "moh_users_see_all_skus"
ON skus FOR SELECT
USING (
    (SELECT company_id FROM users WHERE id = auth.uid()) IS NULL
);

-- Company users can create/update their own company's SKUs (via RPC functions)
-- Note: SKU management is handled via RPC functions with proper authorization

-- MOH users can create/update SKUs (via RPC functions with proper authorization)
-- Note: SKU management is handled via RPC functions with proper authorization

-- ============================================================================
-- atc_codes table RLS policies
-- ============================================================================

-- All authenticated users can see ATC codes (read-only, MOH-controlled)
CREATE POLICY "users_see_atc_codes"
ON atc_codes FOR SELECT
USING (auth.role() = 'authenticated');

-- Only MOH users can create/update ATC codes (via RPC functions with proper authorization)
-- Note: ATC code management is handled via RPC functions with proper authorization

-- ============================================================================
-- critical_medicines table RLS policies
-- ============================================================================

-- All authenticated users can see critical medicines (read-only, MOH-controlled)
CREATE POLICY "users_see_critical_medicines"
ON critical_medicines FOR SELECT
USING (auth.role() = 'authenticated');

-- Only MOH users can create/update critical medicines (via RPC functions with proper authorization)
-- Note: Critical medicine management is handled via RPC functions with proper authorization

-- ============================================================================
-- registry_submissions table RLS policies
-- ============================================================================

-- Company users can see their own company's registry submissions
CREATE POLICY "company_users_see_own_registry_submissions"
ON registry_submissions FOR SELECT
USING (
    submitted_by IN (
        SELECT id FROM users
        WHERE company_id IN (
            SELECT company_id FROM users WHERE id = auth.uid()
        )
    )
);

-- MOH users can see all registry submissions
CREATE POLICY "moh_users_see_all_registry_submissions"
ON registry_submissions FOR SELECT
USING (
    (SELECT company_id FROM users WHERE id = auth.uid()) IS NULL
);

-- Company users can create their own company's registry submissions (via RPC functions)
-- Note: Registry submission creation is handled via RPC functions with proper authorization

-- MOH users can update registry submissions (via RPC functions with proper authorization)
-- Note: Registry submission updates (verify, approve, implement) are handled via RPC functions with proper authorization

COMMIT;
