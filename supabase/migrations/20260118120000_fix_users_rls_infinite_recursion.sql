-- Migration: Fix Users Table RLS Infinite Recursion
-- Description: Fix infinite recursion in users table RLS policies by using security definer function
-- Date: 2026-01-18
-- Task: CRITICAL FIX - RLS Infinite Recursion
-- Author: Sami (Implementation Compliance Specialist)
--
-- ISSUE:
-- - RLS policies on users table query the users table itself (SELECT company_id FROM public.users WHERE id = auth.uid())
-- - This creates infinite recursion: policy check -> queries users table -> triggers policy -> infinite loop
-- - Error: "infinite recursion detected in policy for relation users"
--
-- FIX:
-- - Create security definer function to check if user is MOH (company_id IS NULL) without triggering RLS
-- - Replace direct SELECT queries in RLS policies with calls to this function
-- - This function runs with elevated privileges and bypasses RLS, preventing recursion

BEGIN;

-- ============================================
-- STEP 1: Create Security Definer Function
-- ============================================

-- Function to check if current user is MOH (company_id IS NULL) without triggering RLS
CREATE OR REPLACE FUNCTION public.is_moh_user()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_company_id uuid;
BEGIN
  -- Get company_id for current user (security definer bypasses RLS)
  SELECT company_id INTO user_company_id
  FROM public.users
  WHERE id = auth.uid();
  
  -- Return true if company_id IS NULL (MOH user)
  RETURN user_company_id IS NULL;
END;
$$;

COMMENT ON FUNCTION public.is_moh_user() IS 'Check if current user is MOH (company_id IS NULL). Security definer function to avoid RLS infinite recursion.';

-- Function to get current user's role without triggering RLS
CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_role text;
BEGIN
  -- Get role for current user (security definer bypasses RLS)
  SELECT role INTO user_role
  FROM public.users
  WHERE id = auth.uid();
  
  RETURN user_role;
END;
$$;

COMMENT ON FUNCTION public.current_user_role() IS 'Get current user role. Security definer function to avoid RLS infinite recursion.';

-- ============================================
-- STEP 2: Drop Existing Policies
-- ============================================

DROP POLICY IF EXISTS "users_see_own_record" ON public.users;
DROP POLICY IF EXISTS "moh_users_see_all_users" ON public.users;
DROP POLICY IF EXISTS "users_update_own_profile" ON public.users;
DROP POLICY IF EXISTS "moh_users_update_all_users" ON public.users;
DROP POLICY IF EXISTS "users_insert_own_record" ON public.users;
DROP POLICY IF EXISTS "moh_users_insert_all_users" ON public.users;

-- ============================================
-- STEP 3: Recreate Policies Using Security Definer Functions
-- ============================================

-- Users can see their own record
CREATE POLICY "users_see_own_record"
ON public.users FOR SELECT
USING (id = auth.uid());

-- MOH users can see all users (using security definer function to avoid recursion)
CREATE POLICY "moh_users_see_all_users"
ON public.users FOR SELECT
USING (public.is_moh_user());

-- Users can update their own profile (self-service)
-- Allowed fields: full_name, avatar_url, timezone, language, notification_preferences
-- Restricted fields: id, email, company_id, role, is_active (can only be changed by MOH)
CREATE POLICY "users_update_own_profile"
ON public.users FOR UPDATE
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- MOH users can update any user (full access) - using security definer function to avoid recursion
CREATE POLICY "moh_users_update_all_users"
ON public.users FOR UPDATE
USING (public.is_moh_user())
WITH CHECK (public.is_moh_user());

-- Users can insert their own record (via Supabase Auth trigger - typically handled by auth.users creation)
-- This policy allows the public.users record to be created when auth.users is created
CREATE POLICY "users_insert_own_record"
ON public.users FOR INSERT
WITH CHECK (id = auth.uid());

-- MOH users can insert any user record - using security definer function to avoid recursion
CREATE POLICY "moh_users_insert_all_users"
ON public.users FOR INSERT
WITH CHECK (
  public.is_moh_user() OR id = auth.uid()
);

COMMIT;
