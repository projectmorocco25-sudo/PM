-- Migration: fix_shared_get_notifications_group_by
-- Description: Fix jsonb_agg/ORDER BY pattern that can cause 400 - order/limit in subquery, then aggregate
-- Date: 2026-01-25
-- Issue: shared_get_notifications used jsonb_agg(... ORDER BY n.created_at) + outer ORDER BY/LIMIT;
--        same pattern as rmm_get_recent_activity / rmm_get_submission_deadlines fixes.

BEGIN;

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
    v_limit integer;
    v_offset integer;
BEGIN
    IF NOT EXISTS (SELECT 1 FROM users WHERE id = user_id AND is_active = true) THEN
        RAISE EXCEPTION 'User not found or not active';
    END IF;

    v_limit := GREATEST(1, LEAST(COALESCE(limit_count, 50), 100));
    v_offset := GREATEST(0, COALESCE(offset_count, 0));

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
        )
    )
    INTO notifications_result
    FROM (
        SELECT id, type, title, message, link, is_read, read_at, created_at
        FROM notifications
        WHERE user_id = shared_get_notifications.user_id
        ORDER BY created_at DESC
        LIMIT v_limit
        OFFSET v_offset
    ) n;

    RETURN COALESCE(notifications_result, '[]'::jsonb);
END;
$$;

COMMIT;
