-- Migration: Add RLS policies for system_config table
-- Description: Implement Row Level Security policies for system_config table (Tier 1 only for module activation, read-only for others)
-- Date: 2026-01-17
-- Task: 1.1.1.3b
-- Author: Sami (Implementation Compliance Specialist)

BEGIN;

-- All authenticated users can see system config (read-only for most users)
CREATE POLICY "users_see_system_config"
ON public.system_config FOR SELECT
USING (auth.role() = 'authenticated');

-- MOH Tier 1 can insert system config (module activation)
CREATE POLICY "moh_tier1_insert_system_config"
ON public.system_config FOR INSERT
WITH CHECK (
  (SELECT company_id FROM public.users WHERE id = auth.uid()) IS NULL
  AND (SELECT role FROM public.users WHERE id = auth.uid()) = 'moh_tier1'
);

-- MOH Tier 1 can update system config (module activation/deactivation, config updates)
CREATE POLICY "moh_tier1_update_system_config"
ON public.system_config FOR UPDATE
USING (
  (SELECT company_id FROM public.users WHERE id = auth.uid()) IS NULL
  AND (SELECT role FROM public.users WHERE id = auth.uid()) = 'moh_tier1'
)
WITH CHECK (
  (SELECT company_id FROM public.users WHERE id = auth.uid()) IS NULL
  AND (SELECT role FROM public.users WHERE id = auth.uid()) = 'moh_tier1'
);

-- Users cannot delete system config (soft delete via is_active flag only)
-- No DELETE policy - deletion should be handled via is_active = false

COMMIT;
