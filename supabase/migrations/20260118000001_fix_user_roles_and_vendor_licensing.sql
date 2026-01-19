-- Migration: Fix User Roles CHECK Constraint and Vendor Licensing Access
-- Description: Fix users.role CHECK constraint to include all 9 roles (per schema design), and add vendor access to system_config for module licensing
-- Date: 2026-01-18
-- Task: CRITICAL FIX - Vendor Role and Module Licensing
-- Author: Nadia (Supabase/Postgres Data Modeler) - DB Integrity Owner
-- Pushback: Vendor (System Integrator) - Module Licensing Control Required
--
-- ISSUE:
-- - Migration 20260117014412 only allows 3 roles: 'company_user', 'moh_tier1', 'moh_tier2'
-- - Schema design specifies 9 roles: tier1, tier2_officer, tier2_registrar, company_admin, company_manager, company_user, auditor, system_admin, vendor
-- - Vendor role is blocked from database, breaking module licensing control
-- - system_config RLS policies only allow moh_tier1, but vendor needs module licensing access
--
-- FIX:
-- 1. Drop incorrect CHECK constraint
-- 2. Add correct CHECK constraint with all 9 roles
-- 3. Update COMMENT to reflect all roles
-- 4. Add vendor access to system_config RLS policies for module licensing

BEGIN;

-- ============================================
-- FIX 1: Update users.role CHECK Constraint
-- ============================================

-- Drop the incorrect CHECK constraint
ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_role_check;

-- Add the correct CHECK constraint with all 9 roles per schema design
ALTER TABLE public.users ADD CONSTRAINT users_role_check 
  CHECK (role IN (
    'tier1',              -- MOH DMP Tier 1 (Approver/Admin)
    'tier2_officer',      -- MOH DMP Tier 2 Officer (Verification, analysis, escalation)
    'tier2_registrar',    -- MOH DMP Tier 2 Registrar (Implementation)
    'company_admin',      -- Company Admin (Full company management)
    'company_manager',    -- Company Manager (Product/SKU management)
    'company_user',       -- Company User (View and limited submissions)
    'auditor',            -- Auditor (Read-only for monitoring/compliance)
    'system_admin',       -- System Administrator (Technical configuration)
    'vendor'              -- Vendor (Module licensing and control)
  ));

-- Update COMMENT to reflect all roles
COMMENT ON COLUMN public.users.role IS 'User role: tier1, tier2_officer, tier2_registrar, company_admin, company_manager, company_user, auditor, system_admin, vendor';

-- ============================================
-- FIX 2: Add Vendor Access to system_config for Module Licensing
-- ============================================

-- Drop existing moh_tier1-only policies (we'll recreate them with vendor access)
DROP POLICY IF EXISTS "moh_tier1_insert_system_config" ON public.system_config;
DROP POLICY IF EXISTS "moh_tier1_update_system_config" ON public.system_config;

-- Create INSERT policy: Tier 1 OR Vendor can insert system config (module activation)
CREATE POLICY "tier1_or_vendor_insert_system_config"
ON public.system_config FOR INSERT
WITH CHECK (
  (SELECT company_id FROM public.users WHERE id = auth.uid()) IS NULL
  AND (SELECT role FROM public.users WHERE id = auth.uid()) IN ('tier1', 'vendor')
);

-- Create UPDATE policy: Tier 1 OR Vendor can update system config (module activation/deactivation, licensing)
CREATE POLICY "tier1_or_vendor_update_system_config"
ON public.system_config FOR UPDATE
USING (
  (SELECT company_id FROM public.users WHERE id = auth.uid()) IS NULL
  AND (SELECT role FROM public.users WHERE id = auth.uid()) IN ('tier1', 'vendor')
)
WITH CHECK (
  (SELECT company_id FROM public.users WHERE id = auth.uid()) IS NULL
  AND (SELECT role FROM public.users WHERE id = auth.uid()) IN ('tier1', 'vendor')
);

-- Note: DELETE policy remains unchanged (no deletion allowed - soft delete via is_active flag only)

COMMIT;
