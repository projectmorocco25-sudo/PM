-- Migration: create_rls_policies_core_tables
-- Description: Implement RLS policies for core tables (users, system_config, audit_logs, notifications, approvals, approval_history)
-- Date: 2026-01-22
-- Task: 1.1.1.4
-- Author: Sami (Implementation Compliance Specialist)
-- Dependencies: Task 1.1.1.2 (core tables must exist)

BEGIN;

-- ============================================================================
-- Enable RLS on all core tables
-- ============================================================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE approval_history ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- users table RLS policies
-- ============================================================================

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

-- Users can update their own record (limited fields via RPC functions)
-- Note: Full user management is handled via RPC functions with proper authorization

-- ============================================================================
-- system_config table RLS policies
-- ============================================================================

-- All authenticated users can see system config (read-only)
CREATE POLICY "users_see_system_config"
ON system_config FOR SELECT
USING (auth.role() = 'authenticated');

-- Only Tier 1 and system_admin can modify system config (via RPC functions)
-- Note: Modifications are handled via RPC functions with proper authorization

-- ============================================================================
-- notifications table RLS policies
-- ============================================================================

-- Users can see their own notifications
CREATE POLICY "users_see_own_notifications"
ON notifications FOR SELECT
USING (user_id = auth.uid());

-- Users can update their own notifications (mark as read)
CREATE POLICY "users_update_own_notifications"
ON notifications FOR UPDATE
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- System can create notifications (via RPC functions with service role)
-- Note: Notification creation is handled via RPC functions

-- ============================================================================
-- audit_logs table RLS policies
-- ============================================================================

-- MOH users can see all audit logs
CREATE POLICY "moh_users_see_all_audit_logs"
ON audit_logs FOR SELECT
USING (
    (SELECT company_id FROM users WHERE id = auth.uid()) IS NULL
    AND (SELECT role FROM users WHERE id = auth.uid()) IN ('tier1', 'tier2_officer', 'tier2_registrar', 'auditor', 'system_admin')
);

-- Company users cannot see audit logs directly
-- Note: Audit logs are accessed via RPC functions with proper authorization
-- Company users can only see audit logs related to their own company's data via RPC functions

-- System can create audit logs (via RPC functions with service role)
-- Note: Audit log creation is handled via RPC functions

-- ============================================================================
-- approvals table RLS policies
-- ============================================================================

-- MOH users can see all approvals
CREATE POLICY "moh_users_see_all_approvals"
ON approvals FOR SELECT
USING (
    (SELECT company_id FROM users WHERE id = auth.uid()) IS NULL
);

-- Company users can see approvals for their own company's submissions
-- Note: This requires joining with the submission table to get company_id
-- For registry_submissions, we'll need to join via entity_id and entity_type
-- For now, we'll use a policy that checks if the submission belongs to the company
CREATE POLICY "company_users_see_own_approvals"
ON approvals FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM users
        WHERE id = auth.uid()
        AND company_id IS NOT NULL
        AND (
            -- For registry submissions, check via registry_submissions table
            (submission_type = 'registry' AND EXISTS (
                SELECT 1 FROM registry_submissions rs
                WHERE rs.id = approvals.submission_id
                AND rs.submitted_by IN (
                    SELECT id FROM users WHERE company_id = (SELECT company_id FROM users WHERE id = auth.uid())
                )
            ))
            -- For other submission types, similar logic will be added when tables exist
            -- For now, company users can see approvals where they are the approver
            OR approver_id = auth.uid()
        )
    )
);

-- System can create/update approvals (via RPC functions with proper authorization)
-- Note: Approval creation/updates are handled via RPC functions

-- ============================================================================
-- approval_history table RLS policies
-- ============================================================================

-- MOH users can see all approval history
CREATE POLICY "moh_users_see_all_approval_history"
ON approval_history FOR SELECT
USING (
    (SELECT company_id FROM users WHERE id = auth.uid()) IS NULL
);

-- Company users can see approval history for their own company's submissions
-- Similar logic to approvals table
CREATE POLICY "company_users_see_own_approval_history"
ON approval_history FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM users
        WHERE id = auth.uid()
        AND company_id IS NOT NULL
        AND (
            -- For registry submissions, check via registry_submissions table
            (submission_type = 'registry' AND EXISTS (
                SELECT 1 FROM registry_submissions rs
                WHERE rs.id = approval_history.submission_id
                AND rs.submitted_by IN (
                    SELECT id FROM users WHERE company_id = (SELECT company_id FROM users WHERE id = auth.uid())
                )
            ))
            -- For other submission types, similar logic will be added when tables exist
            -- For now, company users can see approval history where they are the approver
            OR approver_id = auth.uid()
        )
    )
);

-- System can create approval history (via RPC functions with proper authorization)
-- Note: Approval history creation is handled via RPC functions

COMMIT;
