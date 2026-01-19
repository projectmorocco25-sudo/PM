-- Migration: Create core tables (users, system_config, audit_logs, notifications, approvals)
-- Date: 2026-01-17
-- Task: 1.1.1.2
-- Author: Sami (Implementation Compliance Specialist)

BEGIN;

-- Create users table (extends Supabase Auth)
-- Note: company_id foreign key will be added in Task 1.1.1.7 when companies table is created
CREATE TABLE IF NOT EXISTS public.users (
    id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email text UNIQUE NOT NULL,
    full_name text,
    company_id uuid, -- FK to companies.id will be added later
    role text NOT NULL CHECK (role IN ('company_user', 'moh_tier1', 'moh_tier2')),
    avatar_url text,
    timezone text NOT NULL DEFAULT 'UTC+01:00',
    language text NOT NULL DEFAULT 'en',
    notification_preferences jsonb,
    is_active boolean DEFAULT true,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

COMMENT ON TABLE public.users IS 'System users (extends Supabase Auth)';
COMMENT ON COLUMN public.users.company_id IS 'Company ID (NULL for MOH users) - FK will be added when companies table is created';
COMMENT ON COLUMN public.users.role IS 'User role: company_user, moh_tier1, moh_tier2';
COMMENT ON COLUMN public.users.avatar_url IS 'Avatar image URL (Supabase Storage path)';
COMMENT ON COLUMN public.users.timezone IS 'User timezone preference (default: UTC+01:00 for Morocco)';
COMMENT ON COLUMN public.users.language IS 'User language preference (default: en for English)';
COMMENT ON COLUMN public.users.notification_preferences IS 'Notification preferences JSONB: {email_enabled: boolean, submission_updates: boolean, compliance_alerts: boolean, enforcement_actions: boolean, system_announcements: boolean}';

-- Create system_config table
CREATE TABLE IF NOT EXISTS public.system_config (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    module_name text UNIQUE NOT NULL,
    is_active boolean DEFAULT false,
    activated_at timestamptz,
    activated_by uuid REFERENCES public.users(id) ON DELETE SET NULL,
    config_data jsonb,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

COMMENT ON TABLE public.system_config IS 'Module activation and system settings';
COMMENT ON COLUMN public.system_config.module_name IS 'Module name (rmm, vci, ecs, cmc)';
COMMENT ON COLUMN public.system_config.is_active IS 'Module active status';
COMMENT ON COLUMN public.system_config.config_data IS 'Module-specific configuration (JSONB)';

-- Create audit_logs table
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    previous_hash text,
    current_hash text NOT NULL,
    user_id uuid REFERENCES public.users(id) ON DELETE SET NULL,
    operation_type text NOT NULL CHECK (operation_type IN ('INSERT', 'UPDATE', 'DELETE')),
    table_name text NOT NULL,
    record_id uuid,
    old_values jsonb,
    new_values jsonb,
    reason text,
    ip_address inet,
    user_agent text,
    created_at timestamptz DEFAULT now()
);

COMMENT ON TABLE public.audit_logs IS 'Comprehensive audit trail (hash-chained)';
COMMENT ON COLUMN public.audit_logs.previous_hash IS 'Hash of previous audit log entry (hash chaining)';
COMMENT ON COLUMN public.audit_logs.current_hash IS 'Hash of this entry';
COMMENT ON COLUMN public.audit_logs.operation_type IS 'Operation type: INSERT, UPDATE, DELETE';
COMMENT ON COLUMN public.audit_logs.table_name IS 'Table name where operation occurred';
COMMENT ON COLUMN public.audit_logs.reason IS 'Reason/justification for the operation';

-- Create notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    type text NOT NULL,
    title text NOT NULL,
    message text NOT NULL,
    link text,
    is_read boolean DEFAULT false,
    read_at timestamptz,
    created_at timestamptz DEFAULT now()
);

COMMENT ON TABLE public.notifications IS 'In-app notifications (system of record)';
COMMENT ON COLUMN public.notifications.type IS 'Notification type (submission_status, breach_alert, approval_required, etc.)';
COMMENT ON COLUMN public.notifications.is_read IS 'Read status';
COMMENT ON COLUMN public.notifications.read_at IS 'Read timestamp';

-- Create approvals table (polymorphic relationship for all workflow approvals)
CREATE TABLE IF NOT EXISTS public.approvals (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    submission_id uuid, -- Polymorphic relationship identifier
    submission_type text NOT NULL CHECK (submission_type IN ('registry', 'aams', 'msq', 'wsl', 'export_request', 'enforcement_action')),
    from_status text NOT NULL,
    to_status text NOT NULL,
    approver_id uuid REFERENCES public.users(id) ON DELETE RESTRICT NOT NULL,
    approval_type text NOT NULL CHECK (approval_type IN ('verify', 'approve', 'implement', 'reject')),
    comments text,
    created_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.approvals IS 'Approval history for all workflows (polymorphic relationship via submission_type)';
COMMENT ON COLUMN public.approvals.submission_id IS 'Submission ID (polymorphic - identifies specific submission/workflow entity)';
COMMENT ON COLUMN public.approvals.submission_type IS 'Submission type: registry, aams, msq, wsl, export_request, enforcement_action';
COMMENT ON COLUMN public.approvals.from_status IS 'Previous workflow status';
COMMENT ON COLUMN public.approvals.to_status IS 'New workflow status';
COMMENT ON COLUMN public.approvals.approval_type IS 'Approval type: verify, approve, implement, reject';

-- Create indexes for users table
CREATE INDEX IF NOT EXISTS idx_users_company_id ON public.users (company_id);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users (role);
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users (email);
CREATE INDEX IF NOT EXISTS idx_users_notification_preferences ON public.users USING GIN (notification_preferences);

-- Create indexes for audit_logs table
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs (created_at);
CREATE INDEX IF NOT EXISTS idx_audit_logs_table_name ON public.audit_logs (table_name);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON public.audit_logs (user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_table_created ON public.audit_logs (table_name, created_at);

-- Create indexes for notifications table
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications (user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read_at ON public.notifications (read_at) WHERE read_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications (created_at);
CREATE INDEX IF NOT EXISTS idx_notifications_user_read_created ON public.notifications (user_id, read_at, created_at);

-- Create indexes for approvals table
CREATE INDEX IF NOT EXISTS idx_approvals_submission_id ON public.approvals (submission_id) WHERE submission_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_approvals_approver_id ON public.approvals (approver_id);
CREATE INDEX IF NOT EXISTS idx_approvals_created_at ON public.approvals (created_at);

-- Create index for system_config table
CREATE INDEX IF NOT EXISTS idx_system_config_module_name ON public.system_config (module_name);

-- Create updated_at trigger function (reusable for all tables)
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at trigger to users table
CREATE TRIGGER set_users_updated_at
BEFORE UPDATE ON public.users
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add updated_at trigger to system_config table
CREATE TRIGGER set_system_config_updated_at
BEFORE UPDATE ON public.system_config
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable Row Level Security on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.approvals ENABLE ROW LEVEL SECURITY;

COMMIT;
