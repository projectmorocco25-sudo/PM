-- Migration: create_core_tables
-- Description: Create core foundation tables (users, system_config, audit_logs, notifications, approvals)
-- Date: 2025-01-12
-- Author: Nadia
-- Phase: 1.1.1
-- Task: 1.1.1.2
-- Related: schema-design.md, data-dictionary.md, schema-updates-phase0-6-critical-gaps.md

BEGIN;

-- Create users table (extends Supabase Auth)
-- Note: company_id is nullable (NULL for MOH users)
-- Note: companies table will be created in RMM module migrations
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL UNIQUE,
  full_name text,
  company_id uuid, -- REFERENCES companies(id) - will be added when companies table exists
  role text NOT NULL CHECK (role IN ('tier1', 'tier2_officer', 'tier2_registrar', 'company_admin', 'company_manager', 'company_user', 'auditor', 'system_admin', 'vendor')),
  avatar_url text,
  timezone text NOT NULL DEFAULT 'UTC+01:00',
  language text NOT NULL DEFAULT 'en',
  notification_preferences jsonb,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

COMMENT ON TABLE users IS 'System users (extends Supabase Auth)';
COMMENT ON COLUMN users.company_id IS 'Company ID (NULL for MOH users)';
COMMENT ON COLUMN users.role IS 'User role (tier1, tier2_officer, tier2_registrar, company_admin, company_manager, company_user, auditor, system_admin, vendor)';
COMMENT ON COLUMN users.avatar_url IS 'Avatar image URL (Supabase Storage path: avatars/{user_id}/{filename})';
COMMENT ON COLUMN users.timezone IS 'User timezone preference (default: UTC+01:00 for Morocco)';
COMMENT ON COLUMN users.language IS 'User language preference (default: en for English)';
COMMENT ON COLUMN users.notification_preferences IS 'Notification preferences: {email_enabled: boolean, submission_updates: boolean, compliance_alerts: boolean, enforcement_actions: boolean, system_announcements: boolean}';

-- Create indexes for users table
CREATE INDEX IF NOT EXISTS idx_users_company_id ON users(company_id);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_notification_preferences ON users USING GIN (notification_preferences);

-- Create system_config table
CREATE TABLE IF NOT EXISTS system_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  module_name text UNIQUE NOT NULL,
  is_active boolean DEFAULT false,
  activated_at timestamptz,
  activated_by uuid REFERENCES users(id),
  config_data jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

COMMENT ON TABLE system_config IS 'Module activation and system settings';
COMMENT ON COLUMN system_config.module_name IS 'Module name (rmm, vci, ecs, cmc)';
COMMENT ON COLUMN system_config.config_data IS 'Module-specific configuration';

-- Create index for system_config
CREATE INDEX IF NOT EXISTS idx_system_config_module_name ON system_config(module_name);

-- Create audit_logs table (hash-chained audit trail)
CREATE TABLE IF NOT EXISTS audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  previous_hash text,
  current_hash text NOT NULL,
  user_id uuid REFERENCES users(id),
  operation_type text NOT NULL CHECK (operation_type IN ('create', 'update', 'delete', 'approve', 'reject', 'verify', 'implement', 'suspend', 'activate', 'deactivate')),
  table_name text NOT NULL,
  record_id uuid,
  old_values jsonb,
  new_values jsonb,
  reason text,
  ip_address inet,
  user_agent text,
  created_at timestamptz DEFAULT now()
);

COMMENT ON TABLE audit_logs IS 'Comprehensive audit trail (hash-chained)';
COMMENT ON COLUMN audit_logs.previous_hash IS 'Hash of previous audit log entry (hash chaining)';
COMMENT ON COLUMN audit_logs.current_hash IS 'Hash of this entry';
COMMENT ON COLUMN audit_logs.operation_type IS 'Operation type (create, update, delete, approve, reject, verify, implement, suspend, activate, deactivate)';

-- Create indexes for audit_logs table
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_table_name ON audit_logs(table_name);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_audit_logs_operation_type ON audit_logs(operation_type);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  type text NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  link text,
  is_read boolean DEFAULT false,
  read_at timestamptz,
  created_at timestamptz DEFAULT now()
);

COMMENT ON TABLE notifications IS 'In-app notifications (system of record)';
COMMENT ON COLUMN notifications.type IS 'Notification type (submission_status, breach_alert, approval_required, etc.)';

-- Create indexes for notifications table
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read_at ON notifications(read_at);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);

-- Create approvals table
CREATE TABLE IF NOT EXISTS approvals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id uuid,
  submission_type text NOT NULL,
  from_status text NOT NULL,
  to_status text NOT NULL,
  approver_id uuid REFERENCES users(id) NOT NULL,
  approval_type text NOT NULL,
  comments text,
  created_at timestamptz DEFAULT now()
);

COMMENT ON TABLE approvals IS 'Approval history for all workflows';
COMMENT ON COLUMN approvals.submission_type IS 'Submission type (registry, aams, export_request, etc.)';
COMMENT ON COLUMN approvals.approval_type IS 'Approval type (verify, approve, implement, reject)';

-- Create indexes for approvals table
CREATE INDEX IF NOT EXISTS idx_approvals_submission_id ON approvals(submission_id);
CREATE INDEX IF NOT EXISTS idx_approvals_approver_id ON approvals(approver_id);
CREATE INDEX IF NOT EXISTS idx_approvals_created_at ON approvals(created_at);

-- Create updated_at trigger function (if not exists)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER set_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_system_config_updated_at
BEFORE UPDATE ON system_config
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

COMMIT;

-- Rollback Migration
-- BEGIN;
-- 
-- DROP TRIGGER IF EXISTS set_system_config_updated_at ON system_config;
-- DROP TRIGGER IF EXISTS set_users_updated_at ON users;
-- DROP FUNCTION IF EXISTS update_updated_at_column();
-- 
-- DROP INDEX IF EXISTS idx_approvals_created_at;
-- DROP INDEX IF EXISTS idx_approvals_approver_id;
-- DROP INDEX IF EXISTS idx_approvals_submission_id;
-- DROP TABLE IF EXISTS approvals;
-- 
-- DROP INDEX IF EXISTS idx_notifications_created_at;
-- DROP INDEX IF EXISTS idx_notifications_read_at;
-- DROP INDEX IF EXISTS idx_notifications_user_id;
-- DROP TABLE IF EXISTS notifications;
-- 
-- DROP INDEX IF EXISTS idx_audit_logs_operation_type;
-- DROP INDEX IF EXISTS idx_audit_logs_created_at;
-- DROP INDEX IF EXISTS idx_audit_logs_table_name;
-- DROP INDEX IF EXISTS idx_audit_logs_user_id;
-- DROP TABLE IF EXISTS audit_logs;
-- 
-- DROP INDEX IF EXISTS idx_system_config_module_name;
-- DROP TABLE IF EXISTS system_config;
-- 
-- DROP INDEX IF EXISTS idx_users_notification_preferences;
-- DROP INDEX IF EXISTS idx_users_email;
-- DROP INDEX IF EXISTS idx_users_role;
-- DROP INDEX IF EXISTS idx_users_company_id;
-- DROP TABLE IF EXISTS users;
-- 
-- COMMIT;
