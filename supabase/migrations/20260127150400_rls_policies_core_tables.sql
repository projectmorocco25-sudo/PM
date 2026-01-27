-- Migration: RLS policies for core tables
-- Description: Implement RLS for users, system_config, audit_logs, notifications, approvals.
-- Task: 1.1.1.4
-- Date: 2026-01-27
-- Author: Sami (Implementation Compliance Specialist)
-- Dependencies: 20260127150000_core_tables (1.1.1.2-verify)
-- Reference: feature-index.md#core-foundation-features, data-dictionary users/system_config/notifications/audit_logs/approvals

BEGIN;

-- Helper: current user's role (SECURITY DEFINER to read users without RLS recursion)
CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.users WHERE id = auth.uid();
$$;

-- Helper: current user's company_id (SECURITY DEFINER)
CREATE OR REPLACE FUNCTION public.current_user_company_id()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT company_id FROM public.users WHERE id = auth.uid();
$$;

COMMENT ON FUNCTION public.current_user_role() IS 'Returns role of the current user for RLS. Used by core table policies.';
COMMENT ON FUNCTION public.current_user_company_id() IS 'Returns company_id of the current user for RLS. NULL for MOH users.';

GRANT EXECUTE ON FUNCTION public.current_user_role() TO authenticated;
GRANT EXECUTE ON FUNCTION public.current_user_role() TO service_role;
GRANT EXECUTE ON FUNCTION public.current_user_company_id() TO authenticated;
GRANT EXECUTE ON FUNCTION public.current_user_company_id() TO service_role;

-- --------
-- users
-- --------
-- SELECT: own row, OR MOH/admin, OR same-company users (company isolation)
DROP POLICY IF EXISTS "users_select_own_or_moh" ON public.users;
CREATE POLICY "users_select_own_or_moh" ON public.users
  FOR SELECT
  TO authenticated
  USING (
    id = auth.uid()
    OR current_user_role() IN ('tier1', 'tier2_officer', 'tier2_registrar', 'auditor', 'system_admin')
    OR (
      current_user_company_id() IS NOT NULL
      AND company_id = current_user_company_id()
    )
  );

-- UPDATE: own row only (profile updates)
DROP POLICY IF EXISTS "users_update_own" ON public.users;
CREATE POLICY "users_update_own" ON public.users
  FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- INSERT/DELETE: service role only (auth hooks, admin); no anon/authenticated policy => denied
-- (RLS enabled; no policy => no access)

-- --------
-- system_config
-- --------
-- System configuration: MOH Tier 1 and system_admin only (wireframe: "System configuration (MOH Tier 1 only)")
DROP POLICY IF EXISTS "system_config_select_moh_tier1_admin" ON public.system_config;
CREATE POLICY "system_config_select_moh_tier1_admin" ON public.system_config
  FOR SELECT
  TO authenticated
  USING (current_user_role() IN ('tier1', 'system_admin'));

DROP POLICY IF EXISTS "system_config_insert_moh_tier1_admin" ON public.system_config;
CREATE POLICY "system_config_insert_moh_tier1_admin" ON public.system_config
  FOR INSERT
  TO authenticated
  WITH CHECK (current_user_role() IN ('tier1', 'system_admin'));

DROP POLICY IF EXISTS "system_config_update_moh_tier1_admin" ON public.system_config;
CREATE POLICY "system_config_update_moh_tier1_admin" ON public.system_config
  FOR UPDATE
  TO authenticated
  USING (current_user_role() IN ('tier1', 'system_admin'))
  WITH CHECK (current_user_role() IN ('tier1', 'system_admin'));

DROP POLICY IF EXISTS "system_config_delete_moh_tier1_admin" ON public.system_config;
CREATE POLICY "system_config_delete_moh_tier1_admin" ON public.system_config
  FOR DELETE
  TO authenticated
  USING (current_user_role() IN ('tier1', 'system_admin'));

-- --------
-- notifications
-- --------
-- Users see only their own notifications; can mark as read
DROP POLICY IF EXISTS "notifications_select_own" ON public.notifications;
CREATE POLICY "notifications_select_own" ON public.notifications
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "notifications_update_own" ON public.notifications;
CREATE POLICY "notifications_update_own" ON public.notifications
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- INSERT/DELETE: service role or RPC only; no policy for authenticated => denied

-- --------
-- audit_logs
-- --------
-- Audit logs: MOH and auditors only (wireframe: "Audit logs (MOH/Auditors only)")
DROP POLICY IF EXISTS "audit_logs_select_moh_auditor" ON public.audit_logs;
CREATE POLICY "audit_logs_select_moh_auditor" ON public.audit_logs
  FOR SELECT
  TO authenticated
  USING (current_user_role() IN ('tier1', 'tier2_officer', 'tier2_registrar', 'auditor', 'system_admin'));

-- INSERT/UPDATE/DELETE: service role only (backend/triggers)

-- --------
-- approvals
-- --------
-- Approvals: MOH and auditors (workflow visibility)
DROP POLICY IF EXISTS "approvals_select_moh_auditor" ON public.approvals;
CREATE POLICY "approvals_select_moh_auditor" ON public.approvals
  FOR SELECT
  TO authenticated
  USING (current_user_role() IN ('tier1', 'tier2_officer', 'tier2_registrar', 'auditor', 'system_admin'));

-- INSERT/UPDATE/DELETE: service role or RPC only

-- --------
-- approval_history view
-- --------
-- View selects from approvals. Use SECURITY INVOKER so RLS on approvals applies to viewer.
-- Only alter if approval_history is a view (relkind 'v'); skip when it exists as table (remote).
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_class c
             JOIN pg_namespace n ON n.oid = c.relnamespace
             WHERE n.nspname = 'public' AND c.relname = 'approval_history' AND c.relkind = 'v') THEN
    ALTER VIEW public.approval_history SET (security_invoker = on);
  END IF;
END $$;

COMMIT;
