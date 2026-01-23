-- Migration: create_communications_rpc_functions
-- Description: Create communications RPC functions
-- Date: 2026-01-22
-- Task: 1.1.1.2c
-- Author: Sami (Implementation Compliance Specialist)
-- Dependencies: Task 1.1.1.2a (conversations, messages, message_attachments, message_read_receipts tables must exist)

BEGIN;

-- ============================================================================
-- communications_list_conversations(user_id uuid, conversation_type text DEFAULT NULL, limit_count integer DEFAULT 50, offset_count integer DEFAULT 0)
-- Purpose: List conversations for a user with filtering and pagination
-- Returns: JSON array of conversations
-- ============================================================================

CREATE OR REPLACE FUNCTION communications_list_conversations(
    user_id uuid,
    conversation_type text DEFAULT NULL,
    limit_count integer DEFAULT 50,
    offset_count integer DEFAULT 0
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    user_record RECORD;
    user_role text;
    user_company_id uuid;
    conversations_result jsonb;
BEGIN
    -- Verify user exists and is active
    SELECT u.id, u.role, u.company_id
    INTO user_record
    FROM users u
    WHERE u.id = user_id AND u.is_active = true;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'User not found or not active';
    END IF;

    user_role := user_record.role;
    user_company_id := user_record.company_id;

    -- Get conversations based on user role
    -- Company users: Only see conversations where company_id matches
    -- MOH users: See all conversations (system-wide access)
    -- Internal MOH conversations: Only visible to MOH users
    SELECT jsonb_agg(
        jsonb_build_object(
            'id', c.id,
            'type', c.type,
            'subject', c.subject,
            'company_id', c.company_id,
            'workflow_entity_type', c.workflow_entity_type,
            'workflow_entity_id', c.workflow_entity_id,
            'lifecycle_state', c.lifecycle_state,
            'created_by', c.created_by,
            'created_at', c.created_at,
            'updated_at', c.updated_at,
            'archived_at', c.archived_at,
            'is_announcement', c.is_announcement,
            'announcement_expires_at', c.announcement_expires_at
        ) ORDER BY c.updated_at DESC
    )
    INTO conversations_result
    FROM conversations c
    WHERE 
        c.archived_at IS NULL
        AND (
            -- Company users: Only their company's conversations
            (user_role IN ('company_admin', 'company_manager', 'company_user') AND c.company_id = user_company_id)
            OR
            -- MOH users: All conversations except internal_moh (unless they're MOH)
            (user_role IN ('tier1', 'tier2_officer', 'tier2_registrar', 'auditor', 'system_admin') AND (c.type != 'internal_moh' OR user_role IN ('tier1', 'tier2_officer', 'tier2_registrar', 'auditor', 'system_admin')))
        )
        AND (conversation_type IS NULL OR c.type = conversation_type)
        AND (c.announcement_expires_at IS NULL OR c.announcement_expires_at > now())
    ORDER BY c.updated_at DESC
    LIMIT limit_count
    OFFSET offset_count;

    RETURN COALESCE(conversations_result, '[]'::jsonb);
END;
$$;

-- ============================================================================
-- communications_get_conversation(conversation_id uuid, user_id uuid)
-- Purpose: Get a single conversation with all messages and attachments
-- Returns: JSON object with conversation details and messages
-- ============================================================================

CREATE OR REPLACE FUNCTION communications_get_conversation(
    conversation_id uuid,
    user_id uuid
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    user_record RECORD;
    user_role text;
    user_company_id uuid;
    conversation_record RECORD;
    messages_result jsonb;
    attachments_result jsonb;
    result jsonb;
BEGIN
    -- Verify user exists and is active
    SELECT u.id, u.role, u.company_id
    INTO user_record
    FROM users u
    WHERE u.id = user_id AND u.is_active = true;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'User not found or not active';
    END IF;

    user_role := user_record.role;
    user_company_id := user_record.company_id;

    -- Get conversation
    SELECT c.*
    INTO conversation_record
    FROM conversations c
    WHERE c.id = conversation_id
        AND c.archived_at IS NULL;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Conversation not found or archived';
    END IF;

    -- Check access permissions
    IF user_role IN ('company_admin', 'company_manager', 'company_user') THEN
        -- Company users: Only their company's conversations
        IF conversation_record.company_id != user_company_id THEN
            RAISE EXCEPTION 'Insufficient permissions to view this conversation';
        END IF;
    ELSIF user_role IN ('tier1', 'tier2_officer', 'tier2_registrar', 'auditor', 'system_admin') THEN
        -- MOH users: Can see all conversations except internal_moh (unless they're MOH)
        IF conversation_record.type = 'internal_moh' AND user_role NOT IN ('tier1', 'tier2_officer', 'tier2_registrar', 'auditor', 'system_admin') THEN
            RAISE EXCEPTION 'Insufficient permissions to view this conversation';
        END IF;
    ELSE
        RAISE EXCEPTION 'Insufficient permissions to view conversations';
    END IF;

    -- Get messages
    SELECT jsonb_agg(
        jsonb_build_object(
            'id', m.id,
            'conversation_id', m.conversation_id,
            'sender_id', m.sender_id,
            'recipient_id', m.recipient_id,
            'content', m.content,
            'is_system_message', m.is_system_message,
            'delivered_at', m.delivered_at,
            'created_at', m.created_at,
            'updated_at', m.updated_at,
            'edited_at', m.edited_at,
            'deleted_at', m.deleted_at
        ) ORDER BY m.created_at ASC
    )
    INTO messages_result
    FROM messages m
    WHERE m.conversation_id = conversation_id
        AND m.deleted_at IS NULL
    ORDER BY m.created_at ASC;

    -- Get attachments for all messages
    SELECT jsonb_agg(
        jsonb_build_object(
            'id', ma.id,
            'message_id', ma.message_id,
            'file_name', ma.file_name,
            'file_path', ma.file_path,
            'file_size', ma.file_size,
            'mime_type', ma.mime_type,
            'uploaded_by', ma.uploaded_by,
            'created_at', ma.created_at
        )
    )
    INTO attachments_result
    FROM message_attachments ma
    WHERE ma.message_id IN (
        SELECT m.id FROM messages m WHERE m.conversation_id = conversation_id AND m.deleted_at IS NULL
    );

    -- Build result
    result := jsonb_build_object(
        'id', conversation_record.id,
        'type', conversation_record.type,
        'subject', conversation_record.subject,
        'company_id', conversation_record.company_id,
        'workflow_entity_type', conversation_record.workflow_entity_type,
        'workflow_entity_id', conversation_record.workflow_entity_id,
        'lifecycle_state', conversation_record.lifecycle_state,
        'created_by', conversation_record.created_by,
        'created_at', conversation_record.created_at,
        'updated_at', conversation_record.updated_at,
        'is_announcement', conversation_record.is_announcement,
        'announcement_expires_at', conversation_record.announcement_expires_at,
        'messages', COALESCE(messages_result, '[]'::jsonb),
        'attachments', COALESCE(attachments_result, '[]'::jsonb)
    );

    RETURN result;
END;
$$;

-- ============================================================================
-- communications_create_conversation(user_id uuid, conversation_type text, subject text, company_id uuid DEFAULT NULL, workflow_entity_type text DEFAULT NULL, workflow_entity_id uuid DEFAULT NULL)
-- Purpose: Create a new conversation
-- Returns: JSON object with created conversation
-- ============================================================================

CREATE OR REPLACE FUNCTION communications_create_conversation(
    user_id uuid,
    conversation_type text,
    subject text,
    company_id uuid DEFAULT NULL,
    workflow_entity_type text DEFAULT NULL,
    workflow_entity_id uuid DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    user_record RECORD;
    user_role text;
    new_conversation_id uuid;
    result jsonb;
BEGIN
    -- Verify user exists and is active
    SELECT u.id, u.role
    INTO user_record
    FROM users u
    WHERE u.id = user_id AND u.is_active = true;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'User not found or not active';
    END IF;

    user_role := user_record.role;

    -- Validate conversation_type
    IF conversation_type NOT IN ('direct_message', 'workflow_related', 'announcement', 'internal_moh') THEN
        RAISE EXCEPTION 'Invalid conversation type';
    END IF;

    -- Validate subject
    IF subject IS NULL OR trim(subject) = '' THEN
        RAISE EXCEPTION 'Subject is required';
    END IF;

    -- Validate permissions for internal_moh conversations
    IF conversation_type = 'internal_moh' AND user_role NOT IN ('tier1', 'tier2_officer', 'tier2_registrar', 'auditor', 'system_admin') THEN
        RAISE EXCEPTION 'Insufficient permissions to create internal MOH conversations';
    END IF;

    -- Create conversation
    INSERT INTO conversations (
        type,
        subject,
        company_id,
        workflow_entity_type,
        workflow_entity_id,
        lifecycle_state,
        created_by,
        is_announcement
    )
    VALUES (
        conversation_type,
        subject,
        company_id,
        workflow_entity_type,
        workflow_entity_id,
        'CREATED',
        user_id,
        (conversation_type = 'announcement')
    )
    RETURNING id INTO new_conversation_id;

    -- Get created conversation
    SELECT jsonb_build_object(
        'id', c.id,
        'type', c.type,
        'subject', c.subject,
        'company_id', c.company_id,
        'workflow_entity_type', c.workflow_entity_type,
        'workflow_entity_id', c.workflow_entity_id,
        'lifecycle_state', c.lifecycle_state,
        'created_by', c.created_by,
        'created_at', c.created_at,
        'is_announcement', c.is_announcement
    )
    INTO result
    FROM conversations c
    WHERE c.id = new_conversation_id;

    RETURN result;
END;
$$;

-- ============================================================================
-- communications_send_message(conversation_id uuid, sender_id uuid, content text, recipient_id uuid DEFAULT NULL)
-- Purpose: Send a message in a conversation (Phase 0.6: lifecycle_state transitions, delivered_at)
-- Returns: JSON object with created message
-- ============================================================================

CREATE OR REPLACE FUNCTION communications_send_message(
    conversation_id uuid,
    sender_id uuid,
    content text,
    recipient_id uuid DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    user_record RECORD;
    conversation_record RECORD;
    new_message_id uuid;
    is_first_message boolean;
    result jsonb;
BEGIN
    -- Verify sender exists and is active
    SELECT u.id, u.role
    INTO user_record
    FROM users u
    WHERE u.id = sender_id AND u.is_active = true;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Sender not found or not active';
    END IF;

    -- Get conversation
    SELECT c.*
    INTO conversation_record
    FROM conversations c
    WHERE c.id = conversation_id
        AND c.archived_at IS NULL;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Conversation not found or archived';
    END IF;

    -- Validate content
    IF content IS NULL OR trim(content) = '' THEN
        RAISE EXCEPTION 'Message content is required';
    END IF;

    IF length(content) > 10000 THEN
        RAISE EXCEPTION 'Message content exceeds maximum length (10000 characters)';
    END IF;

    -- Check if this is the first message in the conversation
    SELECT COUNT(*) = 0
    INTO is_first_message
    FROM messages m
    WHERE m.conversation_id = conversation_id
        AND m.deleted_at IS NULL;

    -- Create message
    INSERT INTO messages (
        conversation_id,
        sender_id,
        recipient_id,
        content,
        is_system_message,
        delivered_at
    )
    VALUES (
        conversation_id,
        sender_id,
        recipient_id,
        content,
        false,
        CASE WHEN recipient_id IS NOT NULL THEN now() ELSE NULL END -- Phase 0.6: Set delivered_at if recipient exists
    )
    RETURNING id INTO new_message_id;

    -- Phase 0.6: Update conversation lifecycle_state
    -- CREATED → SENT (first message)
    -- SENT → DELIVERED (when message delivered to recipient inbox)
    IF is_first_message THEN
        UPDATE conversations
        SET lifecycle_state = 'SENT',
            updated_at = now()
        WHERE id = conversation_id;
    ELSIF recipient_id IS NOT NULL AND conversation_record.lifecycle_state = 'SENT' THEN
        UPDATE conversations
        SET lifecycle_state = 'DELIVERED',
            updated_at = now()
        WHERE id = conversation_id;
    END IF;

    -- Get created message
    SELECT jsonb_build_object(
        'id', m.id,
        'conversation_id', m.conversation_id,
        'sender_id', m.sender_id,
        'recipient_id', m.recipient_id,
        'content', m.content,
        'is_system_message', m.is_system_message,
        'delivered_at', m.delivered_at,
        'created_at', m.created_at
    )
    INTO result
    FROM messages m
    WHERE m.id = new_message_id;

    RETURN result;
END;
$$;

-- ============================================================================
-- communications_list_sent(user_id uuid, limit_count integer DEFAULT 50, offset_count integer DEFAULT 0)
-- Purpose: List sent messages for a user
-- Returns: JSON array of sent messages
-- ============================================================================

CREATE OR REPLACE FUNCTION communications_list_sent(
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
    messages_result jsonb;
BEGIN
    -- Verify user exists and is active
    IF NOT EXISTS (SELECT 1 FROM users WHERE id = user_id AND is_active = true) THEN
        RAISE EXCEPTION 'User not found or not active';
    END IF;

    -- Get sent messages
    SELECT jsonb_agg(
        jsonb_build_object(
            'id', m.id,
            'conversation_id', m.conversation_id,
            'recipient_id', m.recipient_id,
            'content', m.content,
            'delivered_at', m.delivered_at,
            'created_at', m.created_at
        ) ORDER BY m.created_at DESC
    )
    INTO messages_result
    FROM messages m
    WHERE m.sender_id = user_id
        AND m.deleted_at IS NULL
    ORDER BY m.created_at DESC
    LIMIT limit_count
    OFFSET offset_count;

    RETURN COALESCE(messages_result, '[]'::jsonb);
END;
$$;

-- ============================================================================
-- communications_create_announcement(user_id uuid, subject text, content text, announcement_expires_at timestamptz DEFAULT NULL)
-- Purpose: Create a system announcement
-- Returns: JSON object with created announcement conversation and message
-- ============================================================================

CREATE OR REPLACE FUNCTION communications_create_announcement(
    user_id uuid,
    subject text,
    content text,
    announcement_expires_at timestamptz DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    user_record RECORD;
    user_role text;
    new_conversation_id uuid;
    new_message_id uuid;
    result jsonb;
BEGIN
    -- Verify user exists and is active
    SELECT u.id, u.role
    INTO user_record
    FROM users u
    WHERE u.id = user_id AND u.is_active = true;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'User not found or not active';
    END IF;

    user_role := user_record.role;

    -- Only MOH users and system_admin can create announcements
    IF user_role NOT IN ('tier1', 'tier2_officer', 'tier2_registrar', 'auditor', 'system_admin') THEN
        RAISE EXCEPTION 'Insufficient permissions to create announcements';
    END IF;

    -- Validate subject and content
    IF subject IS NULL OR trim(subject) = '' THEN
        RAISE EXCEPTION 'Subject is required';
    END IF;

    IF content IS NULL OR trim(content) = '' THEN
        RAISE EXCEPTION 'Content is required';
    END IF;

    -- Create announcement conversation
    INSERT INTO conversations (
        type,
        subject,
        lifecycle_state,
        created_by,
        is_announcement,
        announcement_expires_at
    )
    VALUES (
        'announcement',
        subject,
        'CREATED',
        user_id,
        true,
        announcement_expires_at
    )
    RETURNING id INTO new_conversation_id;

    -- Create announcement message
    INSERT INTO messages (
        conversation_id,
        sender_id,
        recipient_id,
        content,
        is_system_message,
        delivered_at
    )
    VALUES (
        new_conversation_id,
        user_id,
        NULL, -- Announcements have no specific recipient
        content,
        true,
        NULL -- Announcements are not "delivered" to a specific inbox
    )
    RETURNING id INTO new_message_id;

    -- Update conversation lifecycle_state to SENT
    UPDATE conversations
    SET lifecycle_state = 'SENT',
        updated_at = now()
    WHERE id = new_conversation_id;

    -- Get created announcement
    SELECT jsonb_build_object(
        'conversation_id', c.id,
        'message_id', m.id,
        'subject', c.subject,
        'content', m.content,
        'announcement_expires_at', c.announcement_expires_at,
        'created_at', c.created_at
    )
    INTO result
    FROM conversations c
    JOIN messages m ON m.conversation_id = c.id
    WHERE c.id = new_conversation_id AND m.id = new_message_id;

    RETURN result;
END;
$$;

-- ============================================================================
-- communications_list_announcements(user_id uuid, limit_count integer DEFAULT 50, offset_count integer DEFAULT 0)
-- Purpose: List system announcements
-- Returns: JSON array of announcements
-- ============================================================================

CREATE OR REPLACE FUNCTION communications_list_announcements(
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
    announcements_result jsonb;
BEGIN
    -- Verify user exists and is active
    IF NOT EXISTS (SELECT 1 FROM users WHERE id = user_id AND is_active = true) THEN
        RAISE EXCEPTION 'User not found or not active';
    END IF;

    -- Get announcements
    SELECT jsonb_agg(
        jsonb_build_object(
            'id', c.id,
            'subject', c.subject,
            'announcement_expires_at', c.announcement_expires_at,
            'created_at', c.created_at,
            'content', (
                SELECT m.content
                FROM messages m
                WHERE m.conversation_id = c.id
                    AND m.deleted_at IS NULL
                ORDER BY m.created_at ASC
                LIMIT 1
            )
        ) ORDER BY c.created_at DESC
    )
    INTO announcements_result
    FROM conversations c
    WHERE c.is_announcement = true
        AND c.archived_at IS NULL
        AND (c.announcement_expires_at IS NULL OR c.announcement_expires_at > now())
    ORDER BY c.created_at DESC
    LIMIT limit_count
    OFFSET offset_count;

    RETURN COALESCE(announcements_result, '[]'::jsonb);
END;
$$;

-- ============================================================================
-- communications_archive_conversation(conversation_id uuid, user_id uuid)
-- Purpose: Archive a conversation (soft delete)
-- Returns: JSON object with success status
-- ============================================================================

CREATE OR REPLACE FUNCTION communications_archive_conversation(
    conversation_id uuid,
    user_id uuid
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    user_record RECORD;
    user_role text;
    user_company_id uuid;
    conversation_record RECORD;
    result jsonb;
BEGIN
    -- Verify user exists and is active
    SELECT u.id, u.role, u.company_id
    INTO user_record
    FROM users u
    WHERE u.id = user_id AND u.is_active = true;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'User not found or not active';
    END IF;

    user_role := user_record.role;
    user_company_id := user_record.company_id;

    -- Get conversation
    SELECT c.*
    INTO conversation_record
    FROM conversations c
    WHERE c.id = conversation_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Conversation not found';
    END IF;

    -- Check access permissions
    IF user_role IN ('company_admin', 'company_manager', 'company_user') THEN
        -- Company users: Only their company's conversations
        IF conversation_record.company_id != user_company_id THEN
            RAISE EXCEPTION 'Insufficient permissions to archive this conversation';
        END IF;
    ELSIF user_role IN ('tier1', 'tier2_officer', 'tier2_registrar', 'auditor', 'system_admin') THEN
        -- MOH users: Can archive all conversations except internal_moh (unless they're MOH)
        IF conversation_record.type = 'internal_moh' AND user_role NOT IN ('tier1', 'tier2_officer', 'tier2_registrar', 'auditor', 'system_admin') THEN
            RAISE EXCEPTION 'Insufficient permissions to archive this conversation';
        END IF;
    ELSE
        RAISE EXCEPTION 'Insufficient permissions to archive conversations';
    END IF;

    -- Archive conversation (soft delete)
    UPDATE conversations
    SET archived_at = now(),
        lifecycle_state = 'ARCHIVED',
        updated_at = now()
    WHERE id = conversation_id
        AND archived_at IS NULL;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Conversation already archived';
    END IF;

    result := jsonb_build_object(
        'success', true,
        'conversation_id', conversation_id,
        'archived_at', now()
    );

    RETURN result;
END;
$$;

-- ============================================================================
-- communications_list_archived(user_id uuid, limit_count integer DEFAULT 50, offset_count integer DEFAULT 0)
-- Purpose: List archived conversations for a user
-- Returns: JSON array of archived conversations
-- ============================================================================

CREATE OR REPLACE FUNCTION communications_list_archived(
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
    user_record RECORD;
    user_role text;
    user_company_id uuid;
    conversations_result jsonb;
BEGIN
    -- Verify user exists and is active
    SELECT u.id, u.role, u.company_id
    INTO user_record
    FROM users u
    WHERE u.id = user_id AND u.is_active = true;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'User not found or not active';
    END IF;

    user_role := user_record.role;
    user_company_id := user_record.company_id;

    -- Get archived conversations based on user role
    SELECT jsonb_agg(
        jsonb_build_object(
            'id', c.id,
            'type', c.type,
            'subject', c.subject,
            'company_id', c.company_id,
            'lifecycle_state', c.lifecycle_state,
            'created_at', c.created_at,
            'archived_at', c.archived_at
        ) ORDER BY c.archived_at DESC
    )
    INTO conversations_result
    FROM conversations c
    WHERE 
        c.archived_at IS NOT NULL
        AND (
            -- Company users: Only their company's conversations
            (user_role IN ('company_admin', 'company_manager', 'company_user') AND c.company_id = user_company_id)
            OR
            -- MOH users: All conversations except internal_moh (unless they're MOH)
            (user_role IN ('tier1', 'tier2_officer', 'tier2_registrar', 'auditor', 'system_admin') AND (c.type != 'internal_moh' OR user_role IN ('tier1', 'tier2_officer', 'tier2_registrar', 'auditor', 'system_admin')))
        )
    ORDER BY c.archived_at DESC
    LIMIT limit_count
    OFFSET offset_count;

    RETURN COALESCE(conversations_result, '[]'::jsonb);
END;
$$;

COMMIT;
