-- Migration: create_shared_rpc_functions
-- Description: Create shared RPC functions (user permissions, notifications, profile, audit logs)
-- Date: 2026-01-22
-- Task: 1.1.1.2b
-- Author: Sami (Implementation Compliance Specialist)
-- Dependencies: Task 1.1.1.2 (users, notifications, audit_logs, system_config tables must exist)

BEGIN;

-- ============================================================================
-- shared_get_user_permissions(user_id uuid)
-- Purpose: Get user permissions based on role
-- Returns: JSON object with permissions structure
-- ============================================================================

CREATE OR REPLACE FUNCTION shared_get_user_permissions(user_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    user_record RECORD;
    permissions jsonb;
BEGIN
    -- Get user record
    SELECT u.id, u.role, u.company_id, u.is_active
    INTO user_record
    FROM users u
    WHERE u.id = user_id;

    -- Check if user exists and is active
    IF NOT FOUND THEN
        RAISE EXCEPTION 'User not found';
    END IF;

    IF NOT user_record.is_active THEN
        RAISE EXCEPTION 'User is not active';
    END IF;

    -- Build permissions based on role
    permissions := jsonb_build_object(
        'user_id', user_record.id,
        'role', user_record.role,
        'company_id', user_record.company_id,
        'permissions', CASE user_record.role
            -- MOH Tier 1: Full system access
            WHEN 'tier1' THEN jsonb_build_object(
                'can_view_all_companies', true,
                'can_approve_submissions', true,
                'can_manage_system_config', true,
                'can_view_audit_logs', true,
                'can_manage_users', true,
                'can_view_all_submissions', true,
                'can_export_data', true,
                'can_generate_reports', true
            )
            -- MOH Tier 2 Officer: Verification and review
            WHEN 'tier2_officer' THEN jsonb_build_object(
                'can_view_all_companies', true,
                'can_verify_submissions', true,
                'can_view_audit_logs', true,
                'can_view_all_submissions', true,
                'can_export_data', true
            )
            -- MOH Tier 2 Registrar: Implementation
            WHEN 'tier2_registrar' THEN jsonb_build_object(
                'can_view_all_companies', true,
                'can_implement_submissions', true,
                'can_view_audit_logs', true,
                'can_view_all_submissions', true
            )
            -- MOH Auditor: Read-only audit access
            WHEN 'auditor' THEN jsonb_build_object(
                'can_view_all_companies', true,
                'can_view_audit_logs', true,
                'can_view_all_submissions', true,
                'can_generate_reports', true,
                'can_export_data', true
            )
            -- Company Admin: Full company access
            WHEN 'company_admin' THEN jsonb_build_object(
                'can_manage_company_users', true,
                'can_submit_registry_updates', true,
                'can_view_company_submissions', true,
                'can_export_company_data', true
            )
            -- Company Manager: Company management
            WHEN 'company_manager' THEN jsonb_build_object(
                'can_submit_registry_updates', true,
                'can_view_company_submissions', true,
                'can_export_company_data', true
            )
            -- Company User: Limited company access
            WHEN 'company_user' THEN jsonb_build_object(
                'can_view_company_submissions', true
            )
            -- System Admin: Full system access
            WHEN 'system_admin' THEN jsonb_build_object(
                'can_view_all_companies', true,
                'can_manage_system_config', true,
                'can_manage_users', true,
                'can_view_audit_logs', true,
                'can_view_all_submissions', true,
                'can_export_data', true,
                'can_generate_reports', true
            )
            -- Vendor: Limited access
            WHEN 'vendor' THEN jsonb_build_object(
                'can_view_public_data', true
            )
            ELSE jsonb_build_object()
        END
    );

    RETURN permissions;
END;
$$;

-- ============================================================================
-- shared_get_notifications(user_id uuid, limit_count integer DEFAULT 50, offset_count integer DEFAULT 0)
-- Purpose: Get user notifications with pagination
-- Returns: JSON array of notifications
-- ============================================================================

CREATE OR REPLACE FUNCTION shared_get_notifications(
    user_id uuid,
    limit_count integer DEFAULT 50,
    offset_count integer DEFAULT 0
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    notifications_result jsonb;
BEGIN
    -- Verify user exists
    IF NOT EXISTS (SELECT 1 FROM users WHERE id = user_id AND is_active = true) THEN
        RAISE EXCEPTION 'User not found or not active';
    END IF;

    -- Get notifications
    SELECT jsonb_agg(
        jsonb_build_object(
            'id', n.id,
            'type', n.type,
            'title', n.title,
            'message', n.message,
            'link', n.link,
            'is_read', n.is_read,
            'read_at', n.read_at,
            'created_at', n.created_at
        ) ORDER BY n.created_at DESC
    )
    INTO notifications_result
    FROM notifications n
    WHERE n.user_id = user_id
    ORDER BY n.created_at DESC
    LIMIT limit_count
    OFFSET offset_count;

    RETURN COALESCE(notifications_result, '[]'::jsonb);
END;
$$;

-- ============================================================================
-- shared_mark_notification_read(notification_id uuid, user_id uuid)
-- Purpose: Mark notification as read
-- Returns: JSON object with success status
-- ============================================================================

CREATE OR REPLACE FUNCTION shared_mark_notification_read(
    notification_id uuid,
    user_id uuid
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    result jsonb;
BEGIN
    -- Verify user exists and is active
    IF NOT EXISTS (SELECT 1 FROM users WHERE id = user_id AND is_active = true) THEN
        RAISE EXCEPTION 'User not found or not active';
    END IF;

    -- Update notification
    UPDATE notifications
    SET is_read = true,
        read_at = now()
    WHERE id = notification_id
        AND user_id = user_id
        AND is_read = false;

    -- Check if update was successful
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Notification not found or already read';
    END IF;

    result := jsonb_build_object(
        'success', true,
        'notification_id', notification_id,
        'read_at', now()
    );

    RETURN result;
END;
$$;

-- ============================================================================
-- shared_update_user_profile(user_id uuid, full_name text, avatar_url text)
-- Purpose: Update user profile (full_name, avatar_url)
-- Returns: JSON object with updated user data
-- ============================================================================

CREATE OR REPLACE FUNCTION shared_update_user_profile(
    user_id uuid,
    full_name text DEFAULT NULL,
    avatar_url text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    result jsonb;
BEGIN
    -- Verify user exists and is active
    IF NOT EXISTS (SELECT 1 FROM users WHERE id = user_id AND is_active = true) THEN
        RAISE EXCEPTION 'User not found or not active';
    END IF;

    -- Update user profile
    UPDATE users
    SET 
        full_name = COALESCE(shared_update_user_profile.full_name, users.full_name),
        avatar_url = COALESCE(shared_update_user_profile.avatar_url, users.avatar_url),
        updated_at = now()
    WHERE id = user_id;

    -- Get updated user data
    SELECT jsonb_build_object(
        'id', u.id,
        'email', u.email,
        'full_name', u.full_name,
        'avatar_url', u.avatar_url,
        'updated_at', u.updated_at
    )
    INTO result
    FROM users u
    WHERE u.id = user_id;

    RETURN result;
END;
$$;

-- ============================================================================
-- shared_update_user_preferences(user_id uuid, timezone text, language text, notification_preferences jsonb)
-- Purpose: Update user preferences (timezone, language, notification_preferences)
-- Returns: JSON object with updated user preferences
-- ============================================================================

CREATE OR REPLACE FUNCTION shared_update_user_preferences(
    user_id uuid,
    timezone text DEFAULT NULL,
    language text DEFAULT NULL,
    notification_preferences jsonb DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    result jsonb;
BEGIN
    -- Verify user exists and is active
    IF NOT EXISTS (SELECT 1 FROM users WHERE id = user_id AND is_active = true) THEN
        RAISE EXCEPTION 'User not found or not active';
    END IF;

    -- Validate timezone format (basic validation)
    IF timezone IS NOT NULL AND timezone !~ '^UTC[+-]\d{2}:\d{2}$|^[A-Za-z_/]+$' THEN
        RAISE EXCEPTION 'Invalid timezone format';
    END IF;

    -- Validate language format (ISO 639-1: 2 characters)
    IF language IS NOT NULL AND length(language) != 2 THEN
        RAISE EXCEPTION 'Invalid language format (must be ISO 639-1 code)';
    END IF;

    -- Update user preferences
    UPDATE users
    SET 
        timezone = COALESCE(shared_update_user_preferences.timezone, users.timezone),
        language = COALESCE(shared_update_user_preferences.language, users.language),
        notification_preferences = COALESCE(shared_update_user_preferences.notification_preferences, users.notification_preferences),
        updated_at = now()
    WHERE id = user_id;

    -- Get updated user preferences
    SELECT jsonb_build_object(
        'id', u.id,
        'timezone', u.timezone,
        'language', u.language,
        'notification_preferences', u.notification_preferences,
        'updated_at', u.updated_at
    )
    INTO result
    FROM users u
    WHERE u.id = user_id;

    RETURN result;
END;
$$;

-- ============================================================================
-- shared_get_audit_logs(user_id uuid, table_name text DEFAULT NULL, operation_type text DEFAULT NULL, limit_count integer DEFAULT 100, offset_count integer DEFAULT 0)
-- Purpose: Get audit logs with filtering and pagination
-- Returns: JSON array of audit logs
-- ============================================================================

CREATE OR REPLACE FUNCTION shared_get_audit_logs(
    user_id uuid,
    table_name text DEFAULT NULL,
    operation_type text DEFAULT NULL,
    limit_count integer DEFAULT 100,
    offset_count integer DEFAULT 0
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    user_role text;
    audit_logs_result jsonb;
BEGIN
    -- Verify user exists and is active
    SELECT u.role INTO user_role
    FROM users u
    WHERE u.id = user_id AND u.is_active = true;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'User not found or not active';
    END IF;

    -- Check permissions: Only MOH users (tier1, tier2_officer, tier2_registrar, auditor) and system_admin can view audit logs
    IF user_role NOT IN ('tier1', 'tier2_officer', 'tier2_registrar', 'auditor', 'system_admin') THEN
        RAISE EXCEPTION 'Insufficient permissions to view audit logs';
    END IF;

    -- Get audit logs with filters
    SELECT jsonb_agg(
        jsonb_build_object(
            'id', a.id,
            'previous_hash', a.previous_hash,
            'current_hash', a.current_hash,
            'user_id', a.user_id,
            'operation_type', a.operation_type,
            'table_name', a.table_name,
            'record_id', a.record_id,
            'old_values', a.old_values,
            'new_values', a.new_values,
            'reason', a.reason,
            'ip_address', a.ip_address,
            'user_agent', a.user_agent,
            'created_at', a.created_at
        ) ORDER BY a.created_at DESC
    )
    INTO audit_logs_result
    FROM audit_logs a
    WHERE 
        (table_name IS NULL OR a.table_name = shared_get_audit_logs.table_name)
        AND (operation_type IS NULL OR a.operation_type = shared_get_audit_logs.operation_type)
    ORDER BY a.created_at DESC
    LIMIT limit_count
    OFFSET offset_count;

    RETURN COALESCE(audit_logs_result, '[]'::jsonb);
END;
$$;

-- ============================================================================
-- shared_get_audit_log_detail(audit_log_id uuid, user_id uuid)
-- Purpose: Get detailed audit log entry
-- Returns: JSON object with audit log details
-- ============================================================================

CREATE OR REPLACE FUNCTION shared_get_audit_log_detail(
    audit_log_id uuid,
    user_id uuid
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    user_role text;
    audit_log_result jsonb;
BEGIN
    -- Verify user exists and is active
    SELECT u.role INTO user_role
    FROM users u
    WHERE u.id = user_id AND u.is_active = true;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'User not found or not active';
    END IF;

    -- Check permissions: Only MOH users (tier1, tier2_officer, tier2_registrar, auditor) and system_admin can view audit logs
    IF user_role NOT IN ('tier1', 'tier2_officer', 'tier2_registrar', 'auditor', 'system_admin') THEN
        RAISE EXCEPTION 'Insufficient permissions to view audit logs';
    END IF;

    -- Get audit log detail
    SELECT jsonb_build_object(
        'id', a.id,
        'previous_hash', a.previous_hash,
        'current_hash', a.current_hash,
        'user_id', a.user_id,
        'operation_type', a.operation_type,
        'table_name', a.table_name,
        'record_id', a.record_id,
        'old_values', a.old_values,
        'new_values', a.new_values,
        'reason', a.reason,
        'ip_address', a.ip_address,
        'user_agent', a.user_agent,
        'created_at', a.created_at
    )
    INTO audit_log_result
    FROM audit_logs a
    WHERE a.id = audit_log_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Audit log not found';
    END IF;

    RETURN audit_log_result;
END;
$$;

-- ============================================================================
-- shared_generate_audit_report(user_id uuid, start_date timestamptz, end_date timestamptz, table_name text DEFAULT NULL, operation_type text DEFAULT NULL)
-- Purpose: Generate audit report with date range and filters
-- Returns: JSON object with report summary and logs
-- ============================================================================

CREATE OR REPLACE FUNCTION shared_generate_audit_report(
    user_id uuid,
    start_date timestamptz,
    end_date timestamptz,
    table_name text DEFAULT NULL,
    operation_type text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    user_role text;
    report_result jsonb;
    total_count integer;
    logs jsonb;
BEGIN
    -- Verify user exists and is active
    SELECT u.role INTO user_role
    FROM users u
    WHERE u.id = user_id AND u.is_active = true;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'User not found or not active';
    END IF;

    -- Check permissions: Only MOH users (tier1, auditor) and system_admin can generate audit reports
    IF user_role NOT IN ('tier1', 'auditor', 'system_admin') THEN
        RAISE EXCEPTION 'Insufficient permissions to generate audit reports';
    END IF;

    -- Validate date range
    IF start_date > end_date THEN
        RAISE EXCEPTION 'Start date must be before end date';
    END IF;

    -- Get total count
    SELECT COUNT(*)
    INTO total_count
    FROM audit_logs a
    WHERE 
        a.created_at >= start_date
        AND a.created_at <= end_date
        AND (table_name IS NULL OR a.table_name = shared_generate_audit_report.table_name)
        AND (operation_type IS NULL OR a.operation_type = shared_generate_audit_report.operation_type);

    -- Get audit logs
    SELECT jsonb_agg(
        jsonb_build_object(
            'id', a.id,
            'user_id', a.user_id,
            'operation_type', a.operation_type,
            'table_name', a.table_name,
            'record_id', a.record_id,
            'created_at', a.created_at
        ) ORDER BY a.created_at DESC
    )
    INTO logs
    FROM audit_logs a
    WHERE 
        a.created_at >= start_date
        AND a.created_at <= end_date
        AND (table_name IS NULL OR a.table_name = shared_generate_audit_report.table_name)
        AND (operation_type IS NULL OR a.operation_type = shared_generate_audit_report.operation_type)
    ORDER BY a.created_at DESC;

    -- Build report
    report_result := jsonb_build_object(
        'success', true,
        'start_date', start_date,
        'end_date', end_date,
        'table_name', table_name,
        'operation_type', operation_type,
        'total_count', total_count,
        'logs', COALESCE(logs, '[]'::jsonb),
        'generated_at', now(),
        'generated_by', user_id
    );

    RETURN report_result;
END;
$$;

COMMIT;
