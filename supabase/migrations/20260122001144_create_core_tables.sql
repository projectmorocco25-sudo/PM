-- Migration: create_core_tables
-- Description: Create core tables (users, system_config, audit_logs, notifications, approvals, approval_history)
-- Date: 2026-01-22
-- Task: 1.1.1.2
-- Author: Sami (Implementation Compliance Specialist)
-- Dependencies: None (foundation migration)

BEGIN;

-- ============================================================================
-- users table
-- Purpose: System users (extends Supabase Auth)
-- Phase 0.6 additions: avatar_url, timezone, language, notification_preferences
-- ============================================================================

CREATE TABLE IF NOT EXISTS users (
    id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email text NOT NULL UNIQUE,
    full_name text,
    company_id uuid, -- NULL for MOH users, references companies.id (will be added when companies table exists)
    role text NOT NULL CHECK (role IN (
        'tier1',
        'tier2_officer',
        'tier2_registrar',
        'company_admin',
        'company_manager',
        'company_user',
        'auditor',
        'system_admin',
        'vendor'
    )),
    avatar_url text, -- Phase 0.6: URL path to Supabase Storage bucket: avatars/{user_id}/{filename}
    timezone text NOT NULL DEFAULT 'UTC+01:00', -- Phase 0.6: User timezone preference (Morocco standard time)
    language text NOT NULL DEFAULT 'en', -- Phase 0.6: User language preference (ISO 639-1 code)
    notification_preferences jsonb, -- Phase 0.6: {email_enabled, submission_updates, compliance_alerts, enforcement_actions, system_announcements}
    is_active boolean NOT NULL DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

-- Indexes for users table
CREATE INDEX IF NOT EXISTS idx_users_company_id ON users(company_id);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_notification_preferences ON users USING GIN(notification_preferences);
CREATE INDEX IF NOT EXISTS idx_users_timezone ON users(timezone);

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- system_config table
-- Purpose: Module activation and system settings
-- ============================================================================

CREATE TABLE IF NOT EXISTS system_config (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    module_name text NOT NULL UNIQUE CHECK (module_name IN ('rmm', 'vci', 'ecs', 'cmc')),
    is_active boolean NOT NULL DEFAULT false,
    activated_at timestamptz,
    activated_by uuid REFERENCES users(id),
    config_data jsonb,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

-- Indexes for system_config table
CREATE INDEX IF NOT EXISTS idx_system_config_module_name ON system_config(module_name);

-- Trigger to update updated_at timestamp
CREATE TRIGGER update_system_config_updated_at
    BEFORE UPDATE ON system_config
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- notifications table
-- Purpose: In-app notifications (system of record)
-- ============================================================================

CREATE TABLE IF NOT EXISTS notifications (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type text NOT NULL, -- submission_status, breach_alert, approval_required, export_approved, score_published, etc.
    title text NOT NULL,
    message text NOT NULL,
    link text, -- URL or entity reference
    is_read boolean NOT NULL DEFAULT false,
    read_at timestamptz,
    created_at timestamptz NOT NULL DEFAULT now()
);

-- Indexes for notifications table
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);

-- ============================================================================
-- audit_logs table
-- Purpose: Comprehensive audit trail (hash-chained for immutability)
-- ============================================================================

CREATE TABLE IF NOT EXISTS audit_logs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    previous_hash text, -- Hash of previous audit log entry (hash chaining)
    current_hash text NOT NULL, -- SHA-256 hash of this entry
    user_id uuid REFERENCES users(id), -- NULL for system operations
    operation_type text NOT NULL, -- create, update, delete, approve, reject, etc.
    table_name text NOT NULL,
    record_id uuid,
    old_values jsonb, -- Old field values (for updates/deletes)
    new_values jsonb, -- New field values (for creates/updates)
    reason text, -- Reason/justification (mandatory for certain operations)
    ip_address inet,
    user_agent text,
    created_at timestamptz NOT NULL DEFAULT now()
);

-- Indexes for audit_logs table
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_table_name ON audit_logs(table_name);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_audit_logs_operation_type ON audit_logs(operation_type);

-- ============================================================================
-- approvals table
-- Purpose: Approval records for all workflows
-- ============================================================================

CREATE TABLE IF NOT EXISTS approvals (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    submission_id uuid, -- NULLABLE: For registry submissions (will reference registry_submissions.id when table exists)
    submission_type text NOT NULL, -- registry, aams, export_request, etc.
    from_status text NOT NULL, -- Previous status
    to_status text NOT NULL, -- New status
    approver_id uuid NOT NULL REFERENCES users(id),
    approval_type text NOT NULL CHECK (approval_type IN ('verify', 'approve', 'implement', 'reject')),
    comments text,
    created_at timestamptz NOT NULL DEFAULT now()
);

-- Indexes for approvals table
CREATE INDEX IF NOT EXISTS idx_approvals_submission_id ON approvals(submission_id);
CREATE INDEX IF NOT EXISTS idx_approvals_approver_id ON approvals(approver_id);
CREATE INDEX IF NOT EXISTS idx_approvals_created_at ON approvals(created_at);

-- ============================================================================
-- approval_history table
-- Purpose: Detailed approval history tracking (comprehensive audit trail for approvals)
-- Note: This table provides detailed history tracking separate from approvals table
-- ============================================================================

CREATE TABLE IF NOT EXISTS approval_history (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    approval_id uuid NOT NULL REFERENCES approvals(id) ON DELETE CASCADE,
    submission_id uuid, -- References the submission being approved
    submission_type text NOT NULL,
    workflow_stage text NOT NULL, -- draft, submitted, tier2_verification, tier1_review, approved, etc.
    action_taken text NOT NULL, -- verified, approved, rejected, implemented, etc.
    approver_id uuid NOT NULL REFERENCES users(id),
    approver_role text NOT NULL, -- Role of approver at time of action
    comments text,
    metadata jsonb, -- Additional metadata about the approval action
    created_at timestamptz NOT NULL DEFAULT now()
);

-- Indexes for approval_history table
CREATE INDEX IF NOT EXISTS idx_approval_history_approval_id ON approval_history(approval_id);
CREATE INDEX IF NOT EXISTS idx_approval_history_submission_id ON approval_history(submission_id);
CREATE INDEX IF NOT EXISTS idx_approval_history_approver_id ON approval_history(approver_id);
CREATE INDEX IF NOT EXISTS idx_approval_history_created_at ON approval_history(created_at);
CREATE INDEX IF NOT EXISTS idx_approval_history_workflow_stage ON approval_history(workflow_stage);

COMMIT;
