-- Migration: Add RLS policies for users table
-- Description: Implement Row Level Security policies for users table (company users see own record, MOH see all, self-service profile updates)
-- Date: 2026-01-17
-- Task: 1.1.1.3a
-- Author: Sami (Implementation Compliance Specialist)

BEGIN;

-- Users can see their own record
CREATE POLICY "users_see_own_record"
ON public.users FOR SELECT
USING (id = auth.uid());

-- MOH users can see all users
CREATE POLICY "moh_users_see_all_users"
ON public.users FOR SELECT
USING (
  (SELECT company_id FROM public.users WHERE id = auth.uid()) IS NULL
);

-- Users can update their own profile (self-service)
-- Allowed fields: full_name, avatar_url, timezone, language, notification_preferences
-- Restricted fields: id, email, company_id, role, is_active (can only be changed by MOH)
-- Note: Field restrictions enforced via RPC functions (trigger or application level)
CREATE POLICY "users_update_own_profile"
ON public.users FOR UPDATE
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- MOH users can update any user (full access)
CREATE POLICY "moh_users_update_all_users"
ON public.users FOR UPDATE
USING (
  (SELECT company_id FROM public.users WHERE id = auth.uid()) IS NULL
)
WITH CHECK (
  (SELECT company_id FROM public.users WHERE id = auth.uid()) IS NULL
);

-- Users can insert their own record (via Supabase Auth trigger - typically handled by auth.users creation)
-- This policy allows the public.users record to be created when auth.users is created
CREATE POLICY "users_insert_own_record"
ON public.users FOR INSERT
WITH CHECK (id = auth.uid());

-- MOH users can insert any user record
CREATE POLICY "moh_users_insert_all_users"
ON public.users FOR INSERT
WITH CHECK (
  (SELECT company_id FROM public.users WHERE id = auth.uid()) IS NULL
  OR id = auth.uid()
);

-- Users cannot delete their own record (soft delete via is_active flag only)
-- MOH users cannot delete user records (soft delete via is_active flag only)
-- No DELETE policy - deletion should be handled via is_active = false

COMMIT;
