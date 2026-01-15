-- Migration: add_rls_policies_rmm_tables
-- Description: Enable RLS + policies for RMM tables (companies, products, skus, atc_codes, critical_medicines)
-- Date: 2025-01-12
-- Author: Nadia
-- Phase: 1.1.1
-- Task: 1.1.1.8a-8e
-- Depends on: 20250112204000_create_rmm_tables

BEGIN;

-- Enable RLS
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE skus ENABLE ROW LEVEL SECURITY;
ALTER TABLE atc_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE critical_medicines ENABLE ROW LEVEL SECURITY;

-- Drop existing policies (idempotent)
DROP POLICY IF EXISTS "companies_select_moh_all" ON companies;
DROP POLICY IF EXISTS "companies_select_company_own" ON companies;
DROP POLICY IF EXISTS "companies_insert_moh" ON companies;
DROP POLICY IF EXISTS "companies_update_moh" ON companies;
DROP POLICY IF EXISTS "companies_delete_system_admin" ON companies;

-- companies: MOH system-wide access
CREATE POLICY "companies_select_moh_all"
ON companies
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM users u
    WHERE u.id = auth.uid()
      AND u.role IN ('moh_tier1','moh_tier2_officer','moh_tier2_registrar','system_admin')
  )
);

-- companies: company users can read their own company row
CREATE POLICY "companies_select_company_own"
ON companies
FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM users u
    WHERE u.id = auth.uid()
      AND u.company_id = companies.id
      AND u.role IN ('ipc_admin','ipc_user','wholesaler_admin','wholesaler_user')
  )
);

-- companies: insert only MOH registrar/tier1/admin
CREATE POLICY "companies_insert_moh"
ON companies
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users u
    WHERE u.id = auth.uid()
      AND u.role IN ('moh_tier1','moh_tier2_registrar','system_admin')
  )
);

-- companies: update only MOH; approximate two-person rule by restricting suspended/inactive rows to Tier 1/Admin
CREATE POLICY "companies_update_moh"
ON companies
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM users u
    WHERE u.id = auth.uid()
      AND u.role IN ('moh_tier1','moh_tier2_registrar','system_admin')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users u
    WHERE u.id = auth.uid()
      AND (
        -- Tier 1/Admin can modify any company row
        u.role IN ('moh_tier1','system_admin')
        OR
        -- Tier 2 Registrar may only modify active, non-suspended companies
        (
          u.role = 'moh_tier2_registrar'
          AND companies.is_active = true
          AND companies.suspended_at IS NULL
        )
      )
  )
);

-- companies: delete restricted to system_admin only (normally avoided)
CREATE POLICY "companies_delete_system_admin"
ON companies
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM users u
    WHERE u.id = auth.uid()
      AND u.role = 'system_admin'
  )
);

-- products policies
DROP POLICY IF EXISTS "products_select_moh_all" ON products;
DROP POLICY IF EXISTS "products_select_company_own" ON products;
DROP POLICY IF EXISTS "products_insert_company_own" ON products;
DROP POLICY IF EXISTS "products_update_company_own" ON products;
DROP POLICY IF EXISTS "products_update_moh_all" ON products;

CREATE POLICY "products_select_moh_all"
ON products
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM users u
    WHERE u.id = auth.uid()
      AND u.role IN ('moh_tier1','moh_tier2_officer','moh_tier2_registrar','system_admin')
  )
);

CREATE POLICY "products_select_company_own"
ON products
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM users u
    WHERE u.id = auth.uid()
      AND u.company_id = products.company_id
      AND u.role IN ('ipc_admin','ipc_user','wholesaler_admin','wholesaler_user')
  )
);

CREATE POLICY "products_insert_company_own"
ON products
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users u
    WHERE u.id = auth.uid()
      AND (
        (u.role IN ('ipc_admin','ipc_user','wholesaler_admin','wholesaler_user') AND u.company_id = products.company_id)
        OR u.role IN ('moh_tier1','moh_tier2_registrar','system_admin')
      )
  )
);

CREATE POLICY "products_update_company_own"
ON products
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM users u
    WHERE u.id = auth.uid()
      AND u.role IN ('ipc_admin','ipc_user','wholesaler_admin','wholesaler_user')
      AND u.company_id = products.company_id
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users u
    WHERE u.id = auth.uid()
      AND u.role IN ('ipc_admin','ipc_user','wholesaler_admin','wholesaler_user')
      AND u.company_id = products.company_id
  )
);

CREATE POLICY "products_update_moh_all"
ON products
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM users u
    WHERE u.id = auth.uid()
      AND u.role IN ('moh_tier1','moh_tier2_registrar','system_admin')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users u
    WHERE u.id = auth.uid()
      AND u.role IN ('moh_tier1','moh_tier2_registrar','system_admin')
  )
);

-- skus policies
DROP POLICY IF EXISTS "skus_select_moh_all" ON skus;
DROP POLICY IF EXISTS "skus_select_company_own" ON skus;
DROP POLICY IF EXISTS "skus_insert_company_own" ON skus;
DROP POLICY IF EXISTS "skus_update_company_own" ON skus;
DROP POLICY IF EXISTS "skus_update_moh_all" ON skus;

CREATE POLICY "skus_select_moh_all"
ON skus
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM users u
    WHERE u.id = auth.uid()
      AND u.role IN ('moh_tier1','moh_tier2_officer','moh_tier2_registrar','system_admin')
  )
);

CREATE POLICY "skus_select_company_own"
ON skus
FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM users u
    JOIN products p ON p.id = skus.product_id
    WHERE u.id = auth.uid()
      AND u.company_id = p.company_id
      AND u.role IN ('ipc_admin','ipc_user','wholesaler_admin','wholesaler_user')
  )
);

CREATE POLICY "skus_insert_company_own"
ON skus
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM users u
    JOIN products p ON p.id = skus.product_id
    WHERE u.id = auth.uid()
      AND (
        (u.role IN ('ipc_admin','ipc_user','wholesaler_admin','wholesaler_user') AND u.company_id = p.company_id)
        OR u.role IN ('moh_tier1','moh_tier2_registrar','system_admin')
      )
  )
);

CREATE POLICY "skus_update_company_own"
ON skus
FOR UPDATE
USING (
  EXISTS (
    SELECT 1
    FROM users u
    JOIN products p ON p.id = skus.product_id
    WHERE u.id = auth.uid()
      AND u.role IN ('ipc_admin','ipc_user','wholesaler_admin','wholesaler_user')
      AND u.company_id = p.company_id
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM users u
    JOIN products p ON p.id = skus.product_id
    WHERE u.id = auth.uid()
      AND u.role IN ('ipc_admin','ipc_user','wholesaler_admin','wholesaler_user')
      AND u.company_id = p.company_id
  )
);

CREATE POLICY "skus_update_moh_all"
ON skus
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM users u
    WHERE u.id = auth.uid()
      AND u.role IN ('moh_tier1','moh_tier2_registrar','system_admin')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users u
    WHERE u.id = auth.uid()
      AND u.role IN ('moh_tier1','moh_tier2_registrar','system_admin')
  )
);

-- atc_codes: readable by all authenticated; write by MOH only
DROP POLICY IF EXISTS "atc_codes_select_all_authed" ON atc_codes;
DROP POLICY IF EXISTS "atc_codes_write_moh_only" ON atc_codes;

CREATE POLICY "atc_codes_select_all_authed"
ON atc_codes
FOR SELECT
USING (auth.uid() IS NOT NULL);

CREATE POLICY "atc_codes_write_moh_only"
ON atc_codes
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM users u
    WHERE u.id = auth.uid()
      AND u.role IN ('moh_tier1','moh_tier2_registrar','system_admin')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users u
    WHERE u.id = auth.uid()
      AND u.role IN ('moh_tier1','moh_tier2_registrar','system_admin')
  )
);

-- critical_medicines: MOH Tier 1 only (strict)
DROP POLICY IF EXISTS "critical_medicines_all_tier1_only" ON critical_medicines;

CREATE POLICY "critical_medicines_all_tier1_only"
ON critical_medicines
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM users u
    WHERE u.id = auth.uid()
      AND u.role IN ('moh_tier1','system_admin')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users u
    WHERE u.id = auth.uid()
      AND u.role IN ('moh_tier1','system_admin')
  )
);

COMMIT;

