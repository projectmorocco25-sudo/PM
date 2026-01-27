-- Migration: Communications RPC functions
-- Description: communications_list_conversations, communications_get_conversation, communications_send_message,
--   communications_create_conversation, communications_list_sent, communications_create_announcement,
--   communications_list_announcements, communications_archive_conversation, communications_list_archived.
-- Task: 1.1.1.2c
-- Date: 2026-01-27
-- Dependencies: 1.1.1.2a-verify, 1.1.1.8a (RLS). Tables: conversations, messages, message_attachments, message_read_receipts.

BEGIN;

-- communications_list_conversations(p_archived boolean DEFAULT false) — inbox-style: accessible, non-announcement, optionally archived
CREATE OR REPLACE FUNCTION public.communications_list_conversations(p_archived boolean DEFAULT false)
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
    SELECT c.id, c.type, c.subject, c.company_id, c.created_by, c.created_at, c.updated_at,
           c.is_announcement, c.archived_at
    FROM public.conversations c
    WHERE c.is_announcement = false
      AND (p_archived IS FALSE AND c.archived_at IS NULL OR p_archived IS TRUE AND c.archived_at IS NOT NULL)
    ORDER BY c.updated_at DESC NULLS LAST
    LIMIT 200
  ) t;
  RETURN jsonb_build_object('data', coalesce(out, '[]'::jsonb));
END;
$$;

COMMENT ON FUNCTION public.communications_list_conversations(boolean) IS 'List conversations (inbox). Excludes announcements. Task 1.1.1.2c.';

-- communications_get_conversation(p_conversation_id uuid)
CREATE OR REPLACE FUNCTION public.communications_get_conversation(p_conversation_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
  c record;
  msgs jsonb;
BEGIN
  SELECT id, type, subject, company_id, created_by, created_at, updated_at, is_announcement, archived_at
  INTO c FROM public.conversations WHERE id = p_conversation_id;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('error', 'not_found', 'id', p_conversation_id);
  END IF;
  SELECT coalesce(jsonb_agg(row_to_json(m)::jsonb ORDER BY m.created_at), '[]'::jsonb) INTO msgs
  FROM (
    SELECT id, conversation_id, sender_id, recipient_id, content, is_system_message, delivered_at, created_at
    FROM public.messages
    WHERE conversation_id = p_conversation_id AND deleted_at IS NULL
  ) m;
  RETURN jsonb_build_object('conversation', to_jsonb(c), 'messages', coalesce(msgs, '[]'::jsonb));
END;
$$;

COMMENT ON FUNCTION public.communications_get_conversation(uuid) IS 'Get conversation and messages. RLS applies. Task 1.1.1.2c.';

-- communications_send_message(p_conversation_id uuid, p_content text, p_recipient_id uuid DEFAULT NULL)
CREATE OR REPLACE FUNCTION public.communications_send_message(
  p_conversation_id uuid,
  p_content text,
  p_recipient_id uuid DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
  msg_id uuid;
BEGIN
  IF p_content IS NULL OR trim(p_content) = '' THEN
    RETURN jsonb_build_object('success', false, 'error', 'content_required');
  END IF;
  INSERT INTO public.messages (conversation_id, sender_id, recipient_id, content)
  VALUES (p_conversation_id, auth.uid(), p_recipient_id, trim(p_content))
  RETURNING id INTO msg_id;
  RETURN jsonb_build_object('success', true, 'id', msg_id);
EXCEPTION
  WHEN foreign_key_violation OR check_violation THEN
    RETURN jsonb_build_object('success', false, 'error', 'invalid_conversation_or_recipient');
END;
$$;

COMMENT ON FUNCTION public.communications_send_message(uuid, text, uuid) IS 'Send message. RLS applies. Task 1.1.1.2c.';

-- communications_create_conversation(p_subject text, p_type text, p_company_id uuid DEFAULT NULL, p_recipient_id uuid DEFAULT NULL, p_initial_content text DEFAULT NULL)
CREATE OR REPLACE FUNCTION public.communications_create_conversation(
  p_subject text,
  p_type text,
  p_company_id uuid DEFAULT NULL,
  p_recipient_id uuid DEFAULT NULL,
  p_initial_content text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
  conv_id uuid;
  msg_id uuid;
BEGIN
  IF p_subject IS NULL OR trim(p_subject) = '' THEN
    RETURN jsonb_build_object('success', false, 'error', 'subject_required');
  END IF;
  INSERT INTO public.conversations (type, subject, company_id, created_by, is_announcement)
  VALUES (coalesce(nullif(trim(p_type), ''), 'workflow_related'), trim(p_subject), p_company_id, auth.uid(), false)
  RETURNING id INTO conv_id;
  IF p_initial_content IS NOT NULL AND trim(p_initial_content) <> '' THEN
    INSERT INTO public.messages (conversation_id, sender_id, recipient_id, content)
    VALUES (conv_id, auth.uid(), p_recipient_id, trim(p_initial_content))
    RETURNING id INTO msg_id;
  END IF;
  RETURN jsonb_build_object('success', true, 'id', conv_id, 'message_id', msg_id);
EXCEPTION
  WHEN check_violation OR foreign_key_violation THEN
    RETURN jsonb_build_object('success', false, 'error', 'invalid_input');
END;
$$;

COMMENT ON FUNCTION public.communications_create_conversation(text, text, uuid, uuid, text) IS 'Create conversation; optional first message. Task 1.1.1.2c.';

-- communications_list_sent()
CREATE OR REPLACE FUNCTION public.communications_list_sent()
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
    SELECT c.id, c.type, c.subject, c.company_id, c.created_by, c.created_at, c.updated_at
    FROM public.conversations c
    WHERE c.is_announcement = false AND c.archived_at IS NULL
      AND (c.created_by = auth.uid() OR c.id IN (SELECT conversation_id FROM public.messages WHERE sender_id = auth.uid()))
    ORDER BY c.updated_at DESC NULLS LAST
    LIMIT 200
  ) t;
  RETURN jsonb_build_object('data', coalesce(out, '[]'::jsonb));
END;
$$;

COMMENT ON FUNCTION public.communications_list_sent() IS 'List sent conversations. Task 1.1.1.2c.';

-- communications_create_announcement(p_subject text, p_content text, p_expires_at timestamptz DEFAULT NULL) — MOH only
CREATE OR REPLACE FUNCTION public.communications_create_announcement(
  p_subject text,
  p_content text,
  p_expires_at timestamptz DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
  conv_id uuid;
  msg_id uuid;
  r text;
BEGIN
  r := current_user_role();
  IF r NOT IN ('tier1', 'tier2_officer', 'tier2_registrar', 'system_admin') THEN
    RETURN jsonb_build_object('success', false, 'error', 'forbidden');
  END IF;
  IF p_subject IS NULL OR trim(p_subject) = '' OR p_content IS NULL OR trim(p_content) = '' THEN
    RETURN jsonb_build_object('success', false, 'error', 'subject_and_content_required');
  END IF;
  INSERT INTO public.conversations (type, subject, company_id, created_by, is_announcement, announcement_expires_at)
  VALUES ('announcement', trim(p_subject), NULL, auth.uid(), true, p_expires_at)
  RETURNING id INTO conv_id;
  INSERT INTO public.messages (conversation_id, sender_id, content, is_system_message)
  VALUES (conv_id, auth.uid(), trim(p_content), true)
  RETURNING id INTO msg_id;
  RETURN jsonb_build_object('success', true, 'id', conv_id, 'message_id', msg_id);
EXCEPTION
  WHEN check_violation OR foreign_key_violation THEN
    RETURN jsonb_build_object('success', false, 'error', 'invalid_input');
END;
$$;

COMMENT ON FUNCTION public.communications_create_announcement(text, text, timestamptz) IS 'Create announcement. MOH only. Task 1.1.1.2c.';

-- communications_list_announcements()
CREATE OR REPLACE FUNCTION public.communications_list_announcements()
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
    SELECT id, type, subject, created_by, created_at, announcement_expires_at
    FROM public.conversations
    WHERE is_announcement = true
    ORDER BY created_at DESC
    LIMIT 200
  ) t;
  RETURN jsonb_build_object('data', coalesce(out, '[]'::jsonb));
END;
$$;

COMMENT ON FUNCTION public.communications_list_announcements() IS 'List announcements. All authenticated. Task 1.1.1.2c.';

-- communications_archive_conversation(p_conversation_id uuid) — MOH only per RLS
CREATE OR REPLACE FUNCTION public.communications_archive_conversation(p_conversation_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
  n int;
BEGIN
  UPDATE public.conversations SET archived_at = now() WHERE id = p_conversation_id;
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n = 0 THEN
    RETURN jsonb_build_object('success', false, 'error', 'not_found_or_forbidden');
  END IF;
  RETURN jsonb_build_object('success', true);
END;
$$;

COMMENT ON FUNCTION public.communications_archive_conversation(uuid) IS 'Archive conversation. MOH only (RLS). Task 1.1.1.2c.';

-- communications_list_archived()
CREATE OR REPLACE FUNCTION public.communications_list_archived()
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
    SELECT c.id, c.type, c.subject, c.company_id, c.created_by, c.created_at, c.archived_at
    FROM public.conversations c
    WHERE c.archived_at IS NOT NULL
    ORDER BY c.archived_at DESC
    LIMIT 200
  ) t;
  RETURN jsonb_build_object('data', coalesce(out, '[]'::jsonb));
END;
$$;

COMMENT ON FUNCTION public.communications_list_archived() IS 'List archived conversations. Task 1.1.1.2c.';

GRANT EXECUTE ON FUNCTION public.communications_list_conversations(boolean) TO authenticated;
GRANT EXECUTE ON FUNCTION public.communications_get_conversation(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.communications_send_message(uuid, text, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.communications_create_conversation(text, text, uuid, uuid, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.communications_list_sent() TO authenticated;
GRANT EXECUTE ON FUNCTION public.communications_create_announcement(text, text, timestamptz) TO authenticated;
GRANT EXECUTE ON FUNCTION public.communications_list_announcements() TO authenticated;
GRANT EXECUTE ON FUNCTION public.communications_archive_conversation(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.communications_list_archived() TO authenticated;

COMMIT;
