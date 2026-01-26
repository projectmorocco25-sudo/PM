-- Migration: fix_users_rls_and_system_config
-- Description: Fix users RLS recursion and seed missing system_config modules
-- Date: 2026-01-24

BEGIN;

-- ----------------------------------------------------------------------------
-- Fix RLS recursion on public.users by using a SECURITY DEFINER helper
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.shared_is_moh_user(user_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.users
    WHERE id = user_id
      AND company_id IS NULL
  );
$$;

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS moh_users_see_all_users ON public.users;
CREATE POLICY moh_users_see_all_users
ON public.users
FOR SELECT
USING (public.shared_is_moh_user(auth.uid()));

-- ----------------------------------------------------------------------------
-- Ensure system_config rows exist for optional modules
-- ----------------------------------------------------------------------------
INSERT INTO public.system_config (module_name, is_active, created_at, updated_at)
SELECT v.module_name, true, now(), now()
FROM (VALUES ('ecs'), ('cmc')) AS v(module_name)
WHERE NOT EXISTS (
  SELECT 1
  FROM public.system_config sc
  WHERE sc.module_name = v.module_name
);

COMMIT;
