-- Migration: Shared RPC functions
-- Description: shared_get_user_permissions, shared_get_notifications, shared_mark_notification_read,
--   shared_update_user_profile, shared_update_user_preferences, shared_get_audit_logs,
--   shared_get_audit_log_detail, shared_generate_audit_report.
-- Task: 1.1.1.2b
-- Date: 2026-01-27
-- Dependencies: 1.1.1.2-verify, 1.1.1.4 (RLS). Tables: users, notifications, audit_logs.

BEGIN;

-- shared_get_user_permissions(user_id uuid)
-- Returns { role, permissions[], company_id }. RLS applies via SELECT on users.
DROP FUNCTION IF EXISTS public.shared_get_user_permissions(uuid);
CREATE OR REPLACE FUNCTION public.shared_get_user_permissions(user_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
  r record;
  perms text[] := '{}';
BEGIN
  SELECT u.role, u.company_id INTO r
  FROM public.users u
  WHERE u.id = shared_get_user_permissions.user_id AND u.is_active = true;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('error', 'user_not_found', 'user_id', shared_get_user_permissions.user_id);
  END IF;
  -- Permissions derived from role (feature-index, role-based-ui-patterns)
  perms := CASE r.role
    WHEN 'system_admin' THEN ARRAY['admin', 'view_audit_logs', 'manage_system_config', 'manage_users', 'all_modules']
    WHEN 'tier1' THEN ARRAY['moh', 'view_audit_logs', 'manage_system_config', 'approve', 'rmm', 'vci', 'ecs', 'cmc']
    WHEN 'tier2_officer' THEN ARRAY['moh', 'view_audit_logs', 'verify', 'rmm', 'vci', 'ecs', 'cmc']
    WHEN 'tier2_registrar' THEN ARRAY['moh', 'view_audit_logs', 'implement', 'rmm', 'vci', 'ecs', 'cmc']
    WHEN 'auditor' THEN ARRAY['moh', 'view_audit_logs', 'read_only', 'rmm', 'vci', 'ecs', 'cmc']
    WHEN 'company_admin' THEN ARRAY['company', 'manage_company_users', 'submit', 'rmm', 'vci', 'ecs', 'cmc']
    WHEN 'company_manager' THEN ARRAY['company', 'submit', 'rmm', 'vci', 'ecs', 'cmc']
    WHEN 'company_user' THEN ARRAY['company', 'submit', 'rmm', 'vci', 'ecs', 'cmc']
    WHEN 'vendor' THEN ARRAY['vendor', 'limited']
    ELSE ARRAY['unknown']
  END;
  RETURN jsonb_build_object(
    'role', r.role,
    'company_id', r.company_id,
    'permissions', to_jsonb(perms)
  );
END;
$$;

COMMENT ON FUNCTION public.shared_get_user_permissions(uuid) IS 'Returns role and permissions for user. RLS applies. Task 1.1.1.2b.';

-- shared_get_notifications(p_limit int, p_offset int)
CREATE OR REPLACE FUNCTION public.shared_get_notifications(
  p_limit int DEFAULT 50,
  p_offset int DEFAULT 0
)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
  out jsonb;
BEGIN
  SELECT coalesce(jsonb_agg(row_to_json(t)::jsonb), '[]'::jsonb) INTO out
  FROM (
    SELECT id, type, title, message, link, is_read, read_at, created_at
    FROM public.notifications
    WHERE user_id = auth.uid()
    ORDER BY created_at DESC
    LIMIT greatest(1, least(p_limit, 500))
    OFFSET greatest(0, p_offset)
  ) t;
  RETURN jsonb_build_object('data', coalesce(out, '[]'::jsonb));
END;
$$;

COMMENT ON FUNCTION public.shared_get_notifications(int, int) IS 'List notifications for current user. RLS applies. Task 1.1.1.2b.';

-- shared_mark_notification_read(p_notification_id uuid)
CREATE OR REPLACE FUNCTION public.shared_mark_notification_read(p_notification_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
  n int;
BEGIN
  UPDATE public.notifications
  SET is_read = true, read_at = now()
  WHERE user_id = auth.uid() AND id = p_notification_id;
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n = 0 THEN
    RETURN jsonb_build_object('success', false, 'error', 'not_found_or_forbidden');
  END IF;
  RETURN jsonb_build_object('success', true);
END;
$$;

COMMENT ON FUNCTION public.shared_mark_notification_read(uuid) IS 'Mark notification read. Own notifications only. Task 1.1.1.2b.';

-- shared_update_user_profile(p_full_name text, p_avatar_url text, p_timezone text, p_language text)
CREATE OR REPLACE FUNCTION public.shared_update_user_profile(
  p_full_name text DEFAULT NULL,
  p_avatar_url text DEFAULT NULL,
  p_timezone text DEFAULT NULL,
  p_language text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
  r record;
BEGIN
  UPDATE public.users
  SET
    full_name = coalesce(p_full_name, full_name),
    avatar_url = coalesce(p_avatar_url, avatar_url),
    timezone = coalesce(nullif(trim(p_timezone), ''), timezone),
    language = coalesce(nullif(trim(p_language), ''), language)
  WHERE id = auth.uid();
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'user_not_found');
  END IF;
  SELECT id, email, full_name, avatar_url, timezone, language, role, company_id
  INTO r FROM public.users WHERE id = auth.uid();
  RETURN jsonb_build_object('success', true, 'user', to_jsonb(r));
END;
$$;

COMMENT ON FUNCTION public.shared_update_user_profile(text, text, text, text) IS 'Update own profile. Task 1.1.1.2b.';

-- shared_update_user_preferences(p_preferences jsonb)
CREATE OR REPLACE FUNCTION public.shared_update_user_preferences(p_preferences jsonb)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  IF p_preferences IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'preferences_required');
  END IF;
  UPDATE public.users
  SET notification_preferences = p_preferences
  WHERE id = auth.uid();
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'user_not_found');
  END IF;
  RETURN jsonb_build_object('success', true);
END;
$$;

COMMENT ON FUNCTION public.shared_update_user_preferences(jsonb) IS 'Update own notification preferences. Task 1.1.1.2b.';

-- shared_get_audit_logs(...) — MOH/auditor only via RLS
CREATE OR REPLACE FUNCTION public.shared_get_audit_logs(
  p_table_name text DEFAULT NULL,
  p_user_id uuid DEFAULT NULL,
  p_start_date timestamptz DEFAULT NULL,
  p_end_date timestamptz DEFAULT NULL,
  p_limit int DEFAULT 100,
  p_offset int DEFAULT 0
)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
  out jsonb;
  total bigint;
BEGIN
  SELECT count(*) INTO total
  FROM public.audit_logs
  WHERE (p_table_name IS NULL OR table_name = p_table_name)
    AND (p_user_id IS NULL OR user_id = p_user_id)
    AND (p_start_date IS NULL OR created_at >= p_start_date)
    AND (p_end_date IS NULL OR created_at <= p_end_date);
  SELECT coalesce(jsonb_agg(row_to_json(t)::jsonb), '[]'::jsonb) INTO out
  FROM (
    SELECT id, user_id, operation_type, table_name, record_id, old_values, new_values, reason, created_at
    FROM public.audit_logs
    WHERE (p_table_name IS NULL OR table_name = p_table_name)
      AND (p_user_id IS NULL OR user_id = p_user_id)
      AND (p_start_date IS NULL OR created_at >= p_start_date)
      AND (p_end_date IS NULL OR created_at <= p_end_date)
    ORDER BY created_at DESC
    LIMIT greatest(1, least(p_limit, 500))
    OFFSET greatest(0, p_offset)
  ) t;
  RETURN jsonb_build_object('data', coalesce(out, '[]'::jsonb), 'total', total);
END;
$$;

COMMENT ON FUNCTION public.shared_get_audit_logs(text, uuid, timestamptz, timestamptz, int, int) IS 'List audit logs with filters. MOH/auditor only (RLS). Task 1.1.1.2b.';

-- shared_get_audit_log_detail(p_id uuid)
CREATE OR REPLACE FUNCTION public.shared_get_audit_log_detail(p_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
  r record;
BEGIN
  SELECT id, previous_hash, current_hash, user_id, operation_type, table_name, record_id,
         old_values, new_values, reason, created_at
  INTO r FROM public.audit_logs WHERE id = p_id;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('error', 'not_found', 'id', p_id);
  END IF;
  RETURN to_jsonb(r);
END;
$$;

COMMENT ON FUNCTION public.shared_get_audit_log_detail(uuid) IS 'Get single audit log. MOH/auditor only (RLS). Task 1.1.1.2b.';

-- shared_generate_audit_report(...) — same filters as get_audit_logs; returns report-style payload
CREATE OR REPLACE FUNCTION public.shared_generate_audit_report(
  p_table_name text DEFAULT NULL,
  p_user_id uuid DEFAULT NULL,
  p_start_date timestamptz DEFAULT NULL,
  p_end_date timestamptz DEFAULT NULL,
  p_limit int DEFAULT 500,
  p_offset int DEFAULT 0
)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
  out jsonb;
  total bigint;
BEGIN
  SELECT count(*) INTO total
  FROM public.audit_logs
  WHERE (p_table_name IS NULL OR table_name = p_table_name)
    AND (p_user_id IS NULL OR user_id = p_user_id)
    AND (p_start_date IS NULL OR created_at >= p_start_date)
    AND (p_end_date IS NULL OR created_at <= p_end_date);
  SELECT coalesce(jsonb_agg(row_to_json(t)::jsonb), '[]'::jsonb) INTO out
  FROM (
    SELECT id, user_id, operation_type, table_name, record_id, old_values, new_values, reason, created_at
    FROM public.audit_logs
    WHERE (p_table_name IS NULL OR table_name = p_table_name)
      AND (p_user_id IS NULL OR user_id = p_user_id)
      AND (p_start_date IS NULL OR created_at >= p_start_date)
      AND (p_end_date IS NULL OR created_at <= p_end_date)
    ORDER BY created_at DESC
    LIMIT greatest(1, least(p_limit, 2000))
    OFFSET greatest(0, p_offset)
  ) t;
  RETURN jsonb_build_object(
    'data', coalesce(out, '[]'::jsonb),
    'total', total,
    'generated_at', now()
  );
END;
$$;

COMMENT ON FUNCTION public.shared_generate_audit_report(text, uuid, timestamptz, timestamptz, int, int) IS 'Generate audit report (paginated). MOH/auditor only (RLS). Task 1.1.1.2b.';

GRANT EXECUTE ON FUNCTION public.shared_get_user_permissions(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.shared_get_user_permissions(uuid) TO service_role;
GRANT EXECUTE ON FUNCTION public.shared_get_notifications(int, int) TO authenticated;
GRANT EXECUTE ON FUNCTION public.shared_get_notifications(int, int) TO service_role;
GRANT EXECUTE ON FUNCTION public.shared_mark_notification_read(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.shared_mark_notification_read(uuid) TO service_role;
GRANT EXECUTE ON FUNCTION public.shared_update_user_profile(text, text, text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.shared_update_user_profile(text, text, text, text) TO service_role;
GRANT EXECUTE ON FUNCTION public.shared_update_user_preferences(jsonb) TO authenticated;
GRANT EXECUTE ON FUNCTION public.shared_update_user_preferences(jsonb) TO service_role;
GRANT EXECUTE ON FUNCTION public.shared_get_audit_logs(text, uuid, timestamptz, timestamptz, int, int) TO authenticated;
GRANT EXECUTE ON FUNCTION public.shared_get_audit_logs(text, uuid, timestamptz, timestamptz, int, int) TO service_role;
GRANT EXECUTE ON FUNCTION public.shared_get_audit_log_detail(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.shared_get_audit_log_detail(uuid) TO service_role;
GRANT EXECUTE ON FUNCTION public.shared_generate_audit_report(text, uuid, timestamptz, timestamptz, int, int) TO authenticated;
GRANT EXECUTE ON FUNCTION public.shared_generate_audit_report(text, uuid, timestamptz, timestamptz, int, int) TO service_role;

COMMIT;
