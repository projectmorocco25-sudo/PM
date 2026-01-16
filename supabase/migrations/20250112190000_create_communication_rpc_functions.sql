-- Migration: create_communication_rpc_functions
-- Description: Create communication RPC functions (create_conversation, send_message, mark_read, archive_conversation, create_announcement)
-- Date: 2025-01-12
-- Author: Nadia
-- Phase: 1.1.1
-- Task: 1.1.1.4g-4k
-- Related: communication-channels-lifecycle.md
-- Depends on: 20250112160000_add_rls_policies_communication_tables, 20250112180000_create_shared_rpc_functions

BEGIN;

-- ============================================
-- TASK 1.1.1.4g: communications_create_conversation
-- ============================================

CREATE OR REPLACE FUNCTION communications_create_conversation(
  p_type text,
  p_subject text,
  p_company_id uuid DEFAULT NULL,
  p_workflow_entity_type text DEFAULT NULL,
  p_workflow_entity_id uuid DEFAULT NULL,
  p_is_announcement boolean DEFAULT false,
  p_announcement_expires_at timestamptz DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_conversation_id uuid;
  v_user_id uuid;
  v_user_company_id uuid;
  v_result jsonb;
BEGIN
  -- Get current user
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'User must be authenticated';
  END IF;

  -- Get user's company_id
  SELECT company_id INTO v_user_company_id
  FROM users
  WHERE id = v_user_id;

  -- Validate permissions
  IF p_is_announcement THEN
    -- Only MOH Tier 1 can create announcements
    IF v_user_company_id IS NOT NULL OR (SELECT role FROM users WHERE id = v_user_id) != 'tier1' THEN
      RAISE EXCEPTION 'Only MOH Tier 1 can create announcements';
    END IF;
  END IF;

  -- Validate company access
  IF p_company_id IS NOT NULL AND v_user_company_id IS NOT NULL THEN
    -- Company user can only create conversations for their own company
    IF p_company_id != v_user_company_id THEN
      RAISE EXCEPTION 'Company users can only create conversations for their own company';
    END IF;
  END IF;

  -- Create conversation with lifecycle_state = 'CREATED'
  INSERT INTO conversations (
    type,
    subject,
    company_id,
    workflow_entity_type,
    workflow_entity_id,
    lifecycle_state,
    created_by,
    is_announcement,
    announcement_expires_at
  ) VALUES (
    p_type,
    p_subject,
    p_company_id,
    p_workflow_entity_type,
    p_workflow_entity_id,
    'CREATED',
    v_user_id,
    p_is_announcement,
    p_announcement_expires_at
  ) RETURNING id INTO v_conversation_id;

  -- Create audit log
  PERFORM shared_create_audit_log(
    v_user_id,
    'conversation_created',
    'conversations',
    v_conversation_id,
    NULL,
    jsonb_build_object(
      'type', p_type,
      'subject', p_subject,
      'company_id', p_company_id,
      'is_announcement', p_is_announcement
    ),
    NULL
  );

  v_result := jsonb_build_object(
    'success', true,
    'data', jsonb_build_object(
      'id', v_conversation_id,
      'type', p_type,
      'subject', p_subject,
      'lifecycle_state', 'CREATED'
    )
  );

  RETURN v_result;
END;
$$;

COMMENT ON FUNCTION communications_create_conversation IS 'Create a new conversation (lifecycle_state = CREATED)';

-- ============================================
-- TASK 1.1.1.4h: communications_send_message
-- ============================================

CREATE OR REPLACE FUNCTION communications_send_message(
  p_conversation_id uuid,
  p_content text,
  p_recipient_id uuid DEFAULT NULL,
  p_is_system_message boolean DEFAULT false
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_message_id uuid;
  v_user_id uuid;
  v_conversation_record conversations%ROWTYPE;
  v_lifecycle_state text;
  v_result jsonb;
BEGIN
  -- Get current user
  v_user_id := auth.uid();
  IF v_user_id IS NULL AND NOT p_is_system_message THEN
    RAISE EXCEPTION 'User must be authenticated';
  END IF;

  -- Get conversation
  SELECT * INTO v_conversation_record
  FROM conversations
  WHERE id = p_conversation_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Conversation not found';
  END IF;

  -- Validate user is participant or creator
  IF NOT p_is_system_message THEN
    IF v_conversation_record.created_by != v_user_id AND
       NOT EXISTS (
         SELECT 1 FROM conversation_participants
         WHERE conversation_id = p_conversation_id
         AND user_id = v_user_id
       ) THEN
      RAISE EXCEPTION 'User is not a participant in this conversation';
    END IF;
  END IF;

  -- Create message
  INSERT INTO messages (
    conversation_id,
    sender_id,
    recipient_id,
    content,
    is_system_message,
    delivered_at
  ) VALUES (
    p_conversation_id,
    COALESCE(v_user_id, '00000000-0000-0000-0000-000000000000'::uuid),  -- System user if system message
    p_recipient_id,
    p_content,
    p_is_system_message,
    now()  -- Set delivered_at immediately (message delivered to inbox)
  ) RETURNING id INTO v_message_id;

  -- Update conversation lifecycle_state
  v_lifecycle_state := v_conversation_record.lifecycle_state;
  IF v_lifecycle_state = 'CREATED' THEN
    v_lifecycle_state := 'SENT';
  ELSIF v_lifecycle_state = 'SENT' THEN
    v_lifecycle_state := 'DELIVERED';
  END IF;

  -- Check if conversation has multiple messages (threaded)
  IF (SELECT COUNT(*) FROM messages WHERE conversation_id = p_conversation_id AND is_system_message = false) > 1 THEN
    v_lifecycle_state := 'THREADED';
  END IF;

  -- Update conversation
  UPDATE conversations
  SET 
    lifecycle_state = v_lifecycle_state,
    updated_at = now()
  WHERE id = p_conversation_id;

  -- Create notification for recipient (if not system message and recipient exists)
  IF NOT p_is_system_message AND p_recipient_id IS NOT NULL THEN
    PERFORM shared_create_notification(
      p_recipient_id,
      'new_message',
      'New message: ' || v_conversation_record.subject,
      p_content,
      '/communications/conversations/' || p_conversation_id::text
    );
  END IF;

  -- Create audit log
  PERFORM shared_create_audit_log(
    v_user_id,
    'message_sent',
    'messages',
    v_message_id,
    NULL,
    jsonb_build_object(
      'conversation_id', p_conversation_id,
      'recipient_id', p_recipient_id,
      'is_system_message', p_is_system_message
    ),
    NULL
  );

  v_result := jsonb_build_object(
    'success', true,
    'data', jsonb_build_object(
      'id', v_message_id,
      'conversation_id', p_conversation_id,
      'lifecycle_state', v_lifecycle_state,
      'delivered_at', now()
    )
  );

  RETURN v_result;
END;
$$;

COMMENT ON FUNCTION communications_send_message IS 'Send a message in a conversation (updates lifecycle_state: CREATED/SENT → DELIVERED, sets delivered_at)';

-- ============================================
-- TASK 1.1.1.4i: communications_mark_read
-- ============================================

CREATE OR REPLACE FUNCTION communications_mark_read(
  p_message_id uuid
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid;
  v_message_record messages%ROWTYPE;
  v_conversation_record conversations%ROWTYPE;
  v_read_receipt_id uuid;
  v_result jsonb;
BEGIN
  -- Get current user
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'User must be authenticated';
  END IF;

  -- Get message
  SELECT * INTO v_message_record
  FROM messages
  WHERE id = p_message_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Message not found';
  END IF;

  -- Validate user is recipient
  IF v_message_record.recipient_id IS NOT NULL AND v_message_record.recipient_id != v_user_id THEN
    RAISE EXCEPTION 'User is not the recipient of this message';
  END IF;

  -- Check if read receipt already exists
  IF EXISTS (
    SELECT 1 FROM message_read_receipts
    WHERE message_id = p_message_id
    AND user_id = v_user_id
  ) THEN
    -- Already read, return success
    RETURN jsonb_build_object('success', true, 'data', jsonb_build_object('already_read', true));
  END IF;

  -- Create read receipt
  INSERT INTO message_read_receipts (
    message_id,
    user_id
  ) VALUES (
    p_message_id,
    v_user_id
  ) RETURNING id INTO v_read_receipt_id;

  -- Update notification (mark as read)
  UPDATE notifications
  SET is_read = true, read_at = now()
  WHERE user_id = v_user_id
  AND link LIKE '%/communications/conversations/' || v_message_record.conversation_id::text || '%'
  AND is_read = false;

  -- Get conversation
  SELECT * INTO v_conversation_record
  FROM conversations
  WHERE id = v_message_record.conversation_id;

  -- Update conversation lifecycle_state to READ if not already
  IF v_conversation_record.lifecycle_state != 'READ' THEN
    UPDATE conversations
    SET 
      lifecycle_state = 'READ',
      updated_at = now()
    WHERE id = v_message_record.conversation_id;
  END IF;

  -- Create audit log
  PERFORM shared_create_audit_log(
    v_user_id,
    'message_read',
    'message_read_receipts',
    v_read_receipt_id,
    NULL,
    jsonb_build_object(
      'message_id', p_message_id,
      'read_at', now()
    ),
    NULL
  );

  v_result := jsonb_build_object(
    'success', true,
    'data', jsonb_build_object(
      'read_receipt_id', v_read_receipt_id,
      'message_id', p_message_id,
      'read_at', now()
    )
  );

  RETURN v_result;
END;
$$;

COMMENT ON FUNCTION communications_mark_read IS 'Mark a message as read (creates read receipt, updates notification, lifecycle_state: DELIVERED → READ)';

-- ============================================
-- TASK 1.1.1.4j: communications_archive_conversation
-- ============================================

CREATE OR REPLACE FUNCTION communications_archive_conversation(
  p_conversation_id uuid
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid;
  v_conversation_record conversations%ROWTYPE;
  v_result jsonb;
BEGIN
  -- Get current user
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'User must be authenticated';
  END IF;

  -- Get conversation
  SELECT * INTO v_conversation_record
  FROM conversations
  WHERE id = p_conversation_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Conversation not found';
  END IF;

  -- Validate permissions (user is creator or MOH Tier 1)
  IF v_conversation_record.created_by != v_user_id THEN
    IF (SELECT company_id FROM users WHERE id = v_user_id) IS NOT NULL OR
       (SELECT role FROM users WHERE id = v_user_id) != 'tier1' THEN
      RAISE EXCEPTION 'User does not have permission to archive this conversation';
    END IF;
  END IF;

  -- Update conversation (soft delete via archived_at and lifecycle_state)
  UPDATE conversations
  SET 
    lifecycle_state = 'ARCHIVED',
    archived_at = now(),
    updated_at = now()
  WHERE id = p_conversation_id;

  -- Create audit log
  PERFORM shared_create_audit_log(
    v_user_id,
    'conversation_archived',
    'conversations',
    p_conversation_id,
    jsonb_build_object('lifecycle_state', v_conversation_record.lifecycle_state),
    jsonb_build_object('lifecycle_state', 'ARCHIVED', 'archived_at', now()),
    NULL
  );

  v_result := jsonb_build_object(
    'success', true,
    'data', jsonb_build_object(
      'conversation_id', p_conversation_id,
      'lifecycle_state', 'ARCHIVED',
      'archived_at', now()
    )
  );

  RETURN v_result;
END;
$$;

COMMENT ON FUNCTION communications_archive_conversation IS 'Archive a conversation (soft delete, lifecycle_state → ARCHIVED)';

-- ============================================
-- TASK 1.1.1.4k: communications_create_announcement
-- ============================================

CREATE OR REPLACE FUNCTION communications_create_announcement(
  p_subject text,
  p_content text,
  p_announcement_expires_at timestamptz DEFAULT NULL,
  p_target_company_ids uuid[] DEFAULT NULL  -- NULL = all companies
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid;
  v_user_role text;
  v_conversation_id uuid;
  v_message_id uuid;
  v_target_users uuid[];
  v_user_record record;
  v_notification_ids uuid[];
  v_result jsonb;
BEGIN
  -- Get current user
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'User must be authenticated';
  END IF;

  -- Verify user is MOH Tier 1
  SELECT role INTO v_user_role
  FROM users
  WHERE id = v_user_id;

  IF v_user_role != 'tier1' OR (SELECT company_id FROM users WHERE id = v_user_id) IS NOT NULL THEN
    RAISE EXCEPTION 'Only MOH Tier 1 can create announcements';
  END IF;

  -- Create conversation (announcement type)
  SELECT (communications_create_conversation(
    'announcement',
    p_subject,
    NULL,  -- company_id = NULL for announcements
    NULL,  -- workflow_entity_type
    NULL,  -- workflow_entity_id
    true,  -- is_announcement
    p_announcement_expires_at
  )->>'data'->>'id')::uuid INTO v_conversation_id;

  -- Send message (system message)
  SELECT (communications_send_message(
    v_conversation_id,
    NULL,  -- recipient_id = NULL for announcements
    p_content,
    true   -- is_system_message
  )->>'data'->>'id')::uuid INTO v_message_id;

  -- Get target users
  IF p_target_company_ids IS NULL THEN
    -- All company users
    SELECT array_agg(id) INTO v_target_users
    FROM users
    WHERE company_id IS NOT NULL
    AND is_active = true;
  ELSE
    -- Specific companies
    SELECT array_agg(id) INTO v_target_users
    FROM users
    WHERE company_id = ANY(p_target_company_ids)
    AND is_active = true;
  END IF;

  -- Create notifications for all target users
  IF v_target_users IS NOT NULL THEN
    FOR v_user_record IN SELECT unnest(v_target_users) AS user_id
    LOOP
      PERFORM shared_create_notification(
        v_user_record.user_id,
        'system_announcement',
        'Announcement: ' || p_subject,
        p_content,
        '/communications/conversations/' || v_conversation_id::text
      );
    END LOOP;
  END IF;

  v_result := jsonb_build_object(
    'success', true,
    'data', jsonb_build_object(
      'conversation_id', v_conversation_id,
      'message_id', v_message_id,
      'notifications_sent', COALESCE(array_length(v_target_users, 1), 0)
    )
  );

  RETURN v_result;
END;
$$;

COMMENT ON FUNCTION communications_create_announcement IS 'Create system announcement (MOH Tier 1 only, creates conversation, message, and notifications for all recipients)';

COMMIT;

-- Rollback Migration
-- BEGIN;
-- 
-- DROP FUNCTION IF EXISTS communications_create_announcement(text, text, timestamptz, uuid[]);
-- DROP FUNCTION IF EXISTS communications_archive_conversation(uuid);
-- DROP FUNCTION IF EXISTS communications_mark_read(uuid);
-- DROP FUNCTION IF EXISTS communications_send_message(uuid, text, uuid, boolean);
-- DROP FUNCTION IF EXISTS communications_create_conversation(text, text, uuid, text, uuid, boolean, timestamptz);
-- 
-- COMMIT;
