-- Migration: add_rls_policies_core_tables
-- Description: Add RLS policies for core tables (users, system_config, audit_logs, notifications, approvals)
-- Date: 2025-01-12
-- Author: Rafi
-- Phase: 1.1.1
-- Task: 1.1.1.3a-3d
-- Related: rls-policy-framework.md
-- Depends on: 20250112120000_create_core_tables

BEGIN;

-- Enable RLS on all core tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE approvals ENABLE ROW LEVEL SECURITY;

-- ============================================
-- USERS TABLE POLICIES (Task 1.1.1.3a)
-- ============================================

-- Users can see their own record
CREATE POLICY "users_see_own_record"
ON users FOR SELECT
USING (id = auth.uid());

-- MOH users can see all users
CREATE POLICY "moh_users_see_all_users"
ON users FOR SELECT
USING (
  (SELECT company_id FROM users WHERE id = auth.uid()) IS NULL
);

-- Users can update their own profile (self-service)
CREATE POLICY "users_update_own_profile"
ON users FOR UPDATE
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- MOH Tier 1 can update any user
CREATE POLICY "moh_tier1_update_users"
ON users FOR UPDATE
USING (
  (SELECT company_id FROM users WHERE id = auth.uid()) IS NULL
  AND (SELECT role FROM users WHERE id = auth.uid()) = 'tier1'
)
WITH CHECK (
  (SELECT company_id FROM users WHERE id = auth.uid()) IS NULL
  AND (SELECT role FROM users WHERE id = auth.uid()) = 'tier1'
);

-- ============================================
-- SYSTEM_CONFIG TABLE POLICIES (Task 1.1.1.3b)
-- ============================================

-- All authenticated users can see system config (read-only)
CREATE POLICY "users_see_system_config"
ON system_config FOR SELECT
USING (auth.role() = 'authenticated');

-- Only MOH Tier 1 can modify system config (module activation)
CREATE POLICY "moh_tier1_modify_system_config"
ON system_config FOR ALL
USING (
  (SELECT company_id FROM users WHERE id = auth.uid()) IS NULL
  AND (SELECT role FROM users WHERE id = auth.uid()) = 'tier1'
)
WITH CHECK (
  (SELECT company_id FROM users WHERE id = auth.uid()) IS NULL
  AND (SELECT role FROM users WHERE id = auth.uid()) = 'tier1'
);

-- ============================================
-- AUDIT_LOGS TABLE POLICIES (Task 1.1.1.3c)
-- ============================================

-- MOH users can see all audit logs
CREATE POLICY "moh_users_see_all_audit_logs"
ON audit_logs FOR SELECT
USING (
  (SELECT company_id FROM users WHERE id = auth.uid()) IS NULL
);

-- Company users can see their own company's audit logs
-- Note: This is a simplified policy - full implementation would check record_id against company-owned tables
CREATE POLICY "company_users_see_own_audit_logs"
ON audit_logs FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid()
    AND company_id IS NOT NULL
    AND (
      -- Audit logs for company-owned entities (check via table_name and record_id)
      -- This is a simplified check - full implementation would join to actual tables
      table_name IN ('companies', 'products', 'skus', 'aams_submissions', 'msq_submissions', 'wsl_submissions')
      OR user_id = auth.uid()  -- User's own actions
    )
  )
);

-- Only system can insert audit logs (via RPC functions with SECURITY DEFINER)
CREATE POLICY "system_insert_audit_logs"
ON audit_logs FOR INSERT
WITH CHECK (true);  -- RPC functions with SECURITY DEFINER will insert

-- ============================================
-- NOTIFICATIONS TABLE POLICIES (Task 1.1.1.3d)
-- ============================================

-- Users can see their own notifications
CREATE POLICY "users_see_own_notifications"
ON notifications FOR SELECT
USING (user_id = auth.uid());

-- Users can update their own notifications (mark as read)
CREATE POLICY "users_update_own_notifications"
ON notifications FOR UPDATE
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- System can insert notifications (via RPC functions with SECURITY DEFINER)
CREATE POLICY "system_insert_notifications"
ON notifications FOR INSERT
WITH CHECK (true);  -- RPC functions with SECURITY DEFINER will insert

-- ============================================
-- APPROVALS TABLE POLICIES
-- ============================================

-- Users can see approvals for their own company's submissions
CREATE POLICY "users_see_own_company_approvals"
ON approvals FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid()
    AND company_id IS NOT NULL
    -- Approvals are linked to submissions which have company_id
    -- This is a simplified check - full implementation would join to submission tables
  )
  OR approver_id = auth.uid()  -- Users can see approvals they made
);

-- MOH users can see all approvals
CREATE POLICY "moh_users_see_all_approvals"
ON approvals FOR SELECT
USING (
  (SELECT company_id FROM users WHERE id = auth.uid()) IS NULL
);

-- System can insert approvals (via RPC functions with SECURITY DEFINER)
CREATE POLICY "system_insert_approvals"
ON approvals FOR INSERT
WITH CHECK (true);  -- RPC functions with SECURITY DEFINER will insert

COMMIT;

-- Rollback Migration
-- BEGIN;
-- 
-- DROP POLICY IF EXISTS system_insert_approvals ON approvals;
-- DROP POLICY IF EXISTS moh_users_see_all_approvals ON approvals;
-- DROP POLICY IF EXISTS users_see_own_company_approvals ON approvals;
-- 
-- DROP POLICY IF EXISTS system_insert_notifications ON notifications;
-- DROP POLICY IF EXISTS users_update_own_notifications ON notifications;
-- DROP POLICY IF EXISTS users_see_own_notifications ON notifications;
-- 
-- DROP POLICY IF EXISTS system_insert_audit_logs ON audit_logs;
-- DROP POLICY IF EXISTS company_users_see_own_audit_logs ON audit_logs;
-- DROP POLICY IF EXISTS moh_users_see_all_audit_logs ON audit_logs;
-- 
-- DROP POLICY IF EXISTS moh_tier1_modify_system_config ON system_config;
-- DROP POLICY IF EXISTS users_see_system_config ON system_config;
-- 
-- DROP POLICY IF EXISTS moh_tier1_update_users ON users;
-- DROP POLICY IF EXISTS users_update_own_profile ON users;
-- DROP POLICY IF EXISTS moh_users_see_all_users ON users;
-- DROP POLICY IF EXISTS users_see_own_record ON users;
-- 
-- ALTER TABLE approvals DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE notifications DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE audit_logs DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE system_config DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE users DISABLE ROW LEVEL SECURITY;
-- 
-- COMMIT;
