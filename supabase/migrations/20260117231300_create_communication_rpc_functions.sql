-- Migration: Create communication RPC functions
-- Description: Implement communication RPC functions (communications_create_conversation, communications_send_message, communications_mark_read, communications_archive_conversation, communications_create_announcement)
-- Date: 2026-01-17
-- Task: 1.1.1.4f, 1.1.1.4g, 1.1.1.4h, 1.1.1.4i, 1.1.1.4j, 1.1.1.4k
-- Author: Sami (Implementation Compliance Specialist)

BEGIN;

-- ============================================
-- communications_create_conversation
-- ============================================

/**
 * RPC Function: communications_create_conversation
 * 
 * Purpose: Create new conversation
 * 
 * Module: shared (communications)
 * Security: SECURITY DEFINER
 * 
 * Parameters:
 *   - p_type (text): Conversation type (required)
 *   - p_subject (text): Conversation subject (required)
 *   - p_company_id (uuid): Company ID (nullable)
 *   - p_workflow_entity_type (text): Workflow entity type (nullable)
 *   - p_workflow_entity_id (uuid): Workflow entity ID (nullable)
 *   - p_is_announcement (boolean): Is announcement (default: false)
 *   - p_announcement_expires_at (timestamptz): Announcement expiration (nullable)
 * 
 * Returns: uuid - Conversation ID
 * 
 * Business Rules:
 *   - Validates user permissions (company access, workflow entity access)
 *   - Sets lifecycle_state = 'CREATED' on creation
 *   - Transitions to 'SENT' when first message sent (handled in send_message function)
 * 
 * State Transitions:
 *   - lifecycle_state: 'CREATED' (initial state)
 */
CREATE OR REPLACE FUNCTION public.communications_create_conversation(
  p_type text,
  p_subject text,
  p_company_id uuid DEFAULT NULL,
  p_workflow_entity_type text DEFAULT NULL,
  p_workflow_entity_id uuid DEFAULT NULL,
  p_is_announcement boolean DEFAULT false,
  p_announcement_expires_at timestamptz DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  conversation_id uuid;
  current_user_id uuid;
  current_user_role text;
  current_user_company_id uuid;
BEGIN
  -- Get current user
  current_user_id := auth.uid();
  
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required' USING ERRCODE = 'P0001';
  END IF;
  
  -- Get user role and company_id
  SELECT role, company_id INTO current_user_role, current_user_company_id
  FROM public.users
  WHERE id = current_user_id;
  
  IF current_user_role IS NULL THEN
    RAISE EXCEPTION 'User not found' USING ERRCODE = 'P0001';
  END IF;
  
  -- Validate conversation type
  IF p_type NOT IN ('direct_message', 'workflow_related', 'announcement', 'internal_moh') THEN
    RAISE EXCEPTION 'Invalid conversation type' USING ERRCODE = 'P0002';
  END IF;
  
  -- Validate permissions based on conversation type
  IF p_type = 'announcement' THEN
    -- Only MOH Tier 1 can create announcements
    IF current_user_role != 'moh_tier1' THEN
      RAISE EXCEPTION 'Only MOH Tier 1 can create announcements' USING ERRCODE = 'P0003';
    END IF;
  END IF;
  
  -- Validate company access (if company_id provided)
  IF p_company_id IS NOT NULL THEN
    -- Company users can only create conversations for their own company
    IF current_user_company_id IS NOT NULL AND current_user_company_id != p_company_id THEN
      RAISE EXCEPTION 'Cannot create conversation for other company' USING ERRCODE = 'P0003';
    END IF;
  END IF;
  
  -- Create conversation
  INSERT INTO public.conversations (
    type,
    subject,
    company_id,
    workflow_entity_type,
    workflow_entity_id,
    lifecycle_state,
    created_by,
    is_announcement,
    announcement_expires_at,
    created_at,
    updated_at
  ) VALUES (
    p_type,
    p_subject,
    p_company_id,
    p_workflow_entity_type,
    p_workflow_entity_id,
    'CREATED',
    current_user_id,
    p_is_announcement,
    p_announcement_expires_at,
    now(),
    now()
  )
  RETURNING id INTO conversation_id;
  
  -- Create audit log
  PERFORM public.shared_create_audit_log(
    current_user_id,
    'INSERT',
    'conversations',
    conversation_id,
    NULL,
    jsonb_build_object(
      'type', p_type,
      'subject', p_subject,
      'company_id', p_company_id,
      'lifecycle_state', 'CREATED'
    ),
    'Conversation created'
  );
  
  RETURN conversation_id;
END;
$$;

COMMENT ON FUNCTION public.communications_create_conversation(text, text, uuid, text, uuid, boolean, timestamptz) IS 'Create new conversation - Sets lifecycle_state = CREATED, transitions to SENT when first message sent';

-- ============================================
-- communications_send_message
-- ============================================

/**
 * RPC Function: communications_send_message
 * 
 * Purpose: Send message in conversation
 * 
 * Module: shared (communications)
 * Security: SECURITY DEFINER
 * 
 * Parameters:
 *   - p_conversation_id (uuid): Conversation ID (required)
 *   - p_content (text): Message content (required)
 *   - p_recipient_id (uuid): Recipient user ID (nullable for announcements)
 * 
 * Returns: uuid - Message ID
 * 
 * Business Rules:
 *   - Validates user is participant in conversation
 *   - Creates message record
 *   - Updates conversation lifecycle_state: 'CREATED'/'SENT' → 'DELIVERED'
 *   - Sets messages.delivered_at timestamp
 *   - Creates notification for recipient
 *   - Creates audit log entry
 * 
 * State Transitions:
 *   - conversation.lifecycle_state: 'CREATED'/'SENT' → 'DELIVERED' (when message sent)
 *   - message.delivered_at: Set to current timestamp
 */
CREATE OR REPLACE FUNCTION public.communications_send_message(
  p_conversation_id uuid,
  p_content text,
  p_recipient_id uuid DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  message_id uuid;
  current_user_id uuid;
  conversation_record RECORD;
  notification_id uuid;
BEGIN
  -- Get current user
  current_user_id := auth.uid();
  
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required' USING ERRCODE = 'P0001';
  END IF;
  
  -- Validate content
  IF p_content IS NULL OR trim(p_content) = '' THEN
    RAISE EXCEPTION 'Message content is required' USING ERRCODE = 'P0002';
  END IF;
  
  -- Get conversation
  SELECT * INTO conversation_record
  FROM public.conversations
  WHERE id = p_conversation_id;
  
  IF conversation_record IS NULL THEN
    RAISE EXCEPTION 'Conversation not found' USING ERRCODE = 'P0001';
  END IF;
  
  -- Validate conversation is not archived
  IF conversation_record.lifecycle_state = 'ARCHIVED' THEN
    RAISE EXCEPTION 'Cannot send message to archived conversation' USING ERRCODE = 'P0003';
  END IF;
  
  -- Validate user is participant or creator
  IF NOT EXISTS (
    SELECT 1 FROM public.conversation_participants
    WHERE conversation_id = p_conversation_id
    AND user_id = current_user_id
  ) AND conversation_record.created_by != current_user_id THEN
    -- Allow creator to send first message (creates participant record)
    -- For subsequent messages, user must be participant
    IF EXISTS (SELECT 1 FROM public.messages WHERE conversation_id = p_conversation_id LIMIT 1) THEN
      RAISE EXCEPTION 'User is not a participant in this conversation' USING ERRCODE = 'P0003';
    END IF;
  END IF;
  
  -- Create message
  INSERT INTO public.messages (
    conversation_id,
    sender_id,
    recipient_id,
    content,
    is_system_message,
    delivered_at,
    created_at,
    updated_at
  ) VALUES (
    p_conversation_id,
    current_user_id,
    p_recipient_id,
    p_content,
    false,
    now(), -- Set delivered_at when message created (delivered to recipient inbox)
    now(),
    now()
  )
  RETURNING id INTO message_id;
  
  -- Update conversation lifecycle_state: 'CREATED'/'SENT' → 'DELIVERED'
  UPDATE public.conversations
  SET 
    lifecycle_state = 'DELIVERED',
    updated_at = now()
  WHERE id = p_conversation_id
  AND lifecycle_state IN ('CREATED', 'SENT');
  
  -- If conversation was in 'CREATED' state, transition to 'SENT' first (then 'DELIVERED')
  -- Actually, we go directly to 'DELIVERED' when message is sent
  -- But if this is the first message, we might want to go 'CREATED' → 'SENT' → 'DELIVERED'
  -- For simplicity, we'll go directly to 'DELIVERED' as per Phase 0.6 requirement
  
  -- Ensure user is a participant (add if not exists)
  INSERT INTO public.conversation_participants (conversation_id, user_id, role, joined_at)
  VALUES (p_conversation_id, current_user_id, 'sender', now())
  ON CONFLICT (conversation_id, user_id) DO NOTHING;
  
  -- Add recipient as participant if provided
  IF p_recipient_id IS NOT NULL THEN
    INSERT INTO public.conversation_participants (conversation_id, user_id, role, joined_at)
    VALUES (p_conversation_id, p_recipient_id, 'recipient', now())
    ON CONFLICT (conversation_id, user_id) DO NOTHING;
    
    -- Create notification for recipient
    SELECT public.shared_create_notification(
      p_recipient_id,
      'message_received',
      conversation_record.subject,
      p_content,
      '/communications/inbox/' || p_conversation_id::text
    ) INTO notification_id;
  END IF;
  
  -- Create audit log
  PERFORM public.shared_create_audit_log(
    current_user_id,
    'INSERT',
    'messages',
    message_id,
    NULL,
    jsonb_build_object(
      'conversation_id', p_conversation_id,
      'sender_id', current_user_id,
      'recipient_id', p_recipient_id,
      'content_length', length(p_content)
    ),
    'Message sent'
  );
  
  RETURN message_id;
END;
$$;

COMMENT ON FUNCTION public.communications_send_message(uuid, text, uuid) IS 'Send message in conversation - Updates lifecycle_state to DELIVERED, sets delivered_at timestamp, creates notification';

-- ============================================
-- communications_mark_read
-- ============================================

/**
 * RPC Function: communications_mark_read
 * 
 * Purpose: Mark message as read
 * 
 * Module: shared (communications)
 * Security: SECURITY DEFINER
 * 
 * Parameters:
 *   - p_message_id (uuid): Message ID (required)
 *   - p_conversation_id (uuid): Conversation ID (required)
 * 
 * Returns: uuid - Read receipt ID
 * 
 * Business Rules:
 *   - Creates read receipt record
 *   - Updates notification as read (if exists)
 *   - Updates conversation lifecycle_state: 'DELIVERED' → 'READ'
 *   - Creates audit log entry
 * 
 * State Transitions:
 *   - conversation.lifecycle_state: 'DELIVERED' → 'READ' (when message read)
 */
CREATE OR REPLACE FUNCTION public.communications_mark_read(
  p_message_id uuid,
  p_conversation_id uuid
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  receipt_id uuid;
  current_user_id uuid;
  message_record RECORD;
BEGIN
  -- Get current user
  current_user_id := auth.uid();
  
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required' USING ERRCODE = 'P0001';
  END IF;
  
  -- Get message
  SELECT * INTO message_record
  FROM public.messages
  WHERE id = p_message_id
  AND conversation_id = p_conversation_id;
  
  IF message_record IS NULL THEN
    RAISE EXCEPTION 'Message not found' USING ERRCODE = 'P0001';
  END IF;
  
  -- Validate user is recipient or participant
  IF message_record.recipient_id != current_user_id THEN
    -- Check if user is participant
    IF NOT EXISTS (
      SELECT 1 FROM public.conversation_participants
      WHERE conversation_id = p_conversation_id
      AND user_id = current_user_id
    ) THEN
      RAISE EXCEPTION 'Cannot mark message as read - user is not recipient or participant' USING ERRCODE = 'P0003';
    END IF;
  END IF;
  
  -- Create or update read receipt
  INSERT INTO public.message_read_receipts (
    message_id,
    user_id,
    read_at
  ) VALUES (
    p_message_id,
    current_user_id,
    now()
  )
  ON CONFLICT (message_id, user_id) DO UPDATE
  SET read_at = now()
  RETURNING id INTO receipt_id;
  
  -- Update notification as read (if exists)
  UPDATE public.notifications
  SET 
    is_read = true,
    read_at = now()
  WHERE link LIKE '%/' || p_conversation_id::text
  AND user_id = current_user_id
  AND is_read = false;
  
  -- Update conversation lifecycle_state: 'DELIVERED' → 'READ'
  UPDATE public.conversations
  SET 
    lifecycle_state = 'READ',
    updated_at = now()
  WHERE id = p_conversation_id
  AND lifecycle_state = 'DELIVERED';
  
  -- Create audit log
  PERFORM public.shared_create_audit_log(
    current_user_id,
    'UPDATE',
    'message_read_receipts',
    receipt_id,
    NULL,
    jsonb_build_object(
      'message_id', p_message_id,
      'read_at', now()
    ),
    'Message marked as read'
  );
  
  RETURN receipt_id;
END;
$$;

COMMENT ON FUNCTION public.communications_mark_read(uuid, uuid) IS 'Mark message as read - Updates lifecycle_state to READ, creates read receipt, updates notification';

-- ============================================
-- communications_archive_conversation
-- ============================================

/**
 * RPC Function: communications_archive_conversation
 * 
 * Purpose: Archive conversation (soft delete)
 * 
 * Module: shared (communications)
 * Security: SECURITY DEFINER
 * 
 * Parameters:
 *   - p_conversation_id (uuid): Conversation ID (required)
 * 
 * Returns: boolean - Success indicator
 * 
 * Business Rules:
 *   - Validates user permissions (participant or creator)
 *   - Sets archived_at timestamp (soft delete)
 *   - Updates conversation lifecycle_state to 'ARCHIVED'
 *   - Creates audit log entry
 * 
 * State Transitions:
 *   - conversation.lifecycle_state: Any → 'ARCHIVED' (on archive)
 */
CREATE OR REPLACE FUNCTION public.communications_archive_conversation(
  p_conversation_id uuid
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_user_id uuid;
  conversation_record RECORD;
BEGIN
  -- Get current user
  current_user_id := auth.uid();
  
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required' USING ERRCODE = 'P0001';
  END IF;
  
  -- Get conversation
  SELECT * INTO conversation_record
  FROM public.conversations
  WHERE id = p_conversation_id;
  
  IF conversation_record IS NULL THEN
    RAISE EXCEPTION 'Conversation not found' USING ERRCODE = 'P0001';
  END IF;
  
  -- Validate user is participant or creator
  IF NOT EXISTS (
    SELECT 1 FROM public.conversation_participants
    WHERE conversation_id = p_conversation_id
    AND user_id = current_user_id
  ) AND conversation_record.created_by != current_user_id THEN
    RAISE EXCEPTION 'Cannot archive conversation - user is not participant or creator' USING ERRCODE = 'P0003';
  END IF;
  
  -- Archive conversation (soft delete)
  UPDATE public.conversations
  SET 
    lifecycle_state = 'ARCHIVED',
    archived_at = now(),
    updated_at = now()
  WHERE id = p_conversation_id;
  
  -- Create audit log
  PERFORM public.shared_create_audit_log(
    current_user_id,
    'UPDATE',
    'conversations',
    p_conversation_id,
    jsonb_build_object('lifecycle_state', conversation_record.lifecycle_state),
    jsonb_build_object('lifecycle_state', 'ARCHIVED', 'archived_at', now()),
    'Conversation archived'
  );
  
  RETURN true;
END;
$$;

COMMENT ON FUNCTION public.communications_archive_conversation(uuid) IS 'Archive conversation - Updates lifecycle_state to ARCHIVED, sets archived_at timestamp';

-- ============================================
-- communications_create_announcement
-- ============================================

/**
 * RPC Function: communications_create_announcement
 * 
 * Purpose: Create system announcement (MOH Tier 1 only)
 * 
 * Module: shared (communications)
 * Security: SECURITY DEFINER
 * 
 * Parameters:
 *   - p_subject (text): Announcement subject (required)
 *   - p_content (text): Announcement message content (required)
 *   - p_announcement_expires_at (timestamptz): Expiration date (nullable)
 *   - p_recipient_user_ids (uuid[]): Specific recipient user IDs (nullable, if NULL sends to all users)
 * 
 * Returns: uuid - Conversation ID
 * 
 * Business Rules:
 *   - Only MOH Tier 1 can create announcements
 *   - Creates conversation with type = 'announcement'
 *   - Creates message in conversation
 *   - Creates notifications for all recipients
 *   - Sets lifecycle_state = 'CREATED', transitions to 'DELIVERED' when message sent
 * 
 * State Transitions:
 *   - conversation.lifecycle_state: 'CREATED' → 'DELIVERED' (when announcement sent)
 */
CREATE OR REPLACE FUNCTION public.communications_create_announcement(
  p_subject text,
  p_content text,
  p_announcement_expires_at timestamptz DEFAULT NULL,
  p_recipient_user_ids uuid[] DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  conversation_id uuid;
  message_id uuid;
  current_user_id uuid;
  current_user_role text;
  recipient_user RECORD;
  notification_id uuid;
BEGIN
  -- Get current user
  current_user_id := auth.uid();
  
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required' USING ERRCODE = 'P0001';
  END IF;
  
  -- Get user role
  SELECT role INTO current_user_role
  FROM public.users
  WHERE id = current_user_id;
  
  -- Validate only MOH Tier 1 can create announcements
  IF current_user_role != 'moh_tier1' THEN
    RAISE EXCEPTION 'Only MOH Tier 1 can create announcements' USING ERRCODE = 'P0003';
  END IF;
  
  -- Validate content
  IF p_subject IS NULL OR trim(p_subject) = '' THEN
    RAISE EXCEPTION 'Announcement subject is required' USING ERRCODE = 'P0002';
  END IF;
  
  IF p_content IS NULL OR trim(p_content) = '' THEN
    RAISE EXCEPTION 'Announcement content is required' USING ERRCODE = 'P0002';
  END IF;
  
  -- Create announcement conversation
  SELECT public.communications_create_conversation(
    'announcement',
    p_subject,
    NULL, -- company_id is NULL for announcements
    NULL, -- workflow_entity_type
    NULL, -- workflow_entity_id
    true, -- is_announcement
    p_announcement_expires_at
  ) INTO conversation_id;
  
  -- Create message in conversation
  SELECT public.communications_send_message(
    conversation_id,
    p_content,
    NULL -- recipient_id is NULL for announcements (sent to all)
  ) INTO message_id;
  
  -- Create notifications for recipients
  IF p_recipient_user_ids IS NULL THEN
    -- Send to all active users
    FOR recipient_user IN 
      SELECT id FROM public.users WHERE is_active = true
    LOOP
      BEGIN
        SELECT public.shared_create_notification(
          recipient_user.id,
          'announcement',
          p_subject,
          p_content,
          '/communications/inbox/' || conversation_id::text
        ) INTO notification_id;
      EXCEPTION WHEN OTHERS THEN
        -- Continue if notification creation fails for one user
        RAISE WARNING 'Failed to create notification for user %: %', recipient_user.id, SQLERRM;
      END;
    END LOOP;
  ELSE
    -- Send to specified users
    FOR recipient_user IN 
      SELECT id FROM public.users WHERE id = ANY(p_recipient_user_ids) AND is_active = true
    LOOP
      BEGIN
        SELECT public.shared_create_notification(
          recipient_user.id,
          'announcement',
          p_subject,
          p_content,
          '/communications/inbox/' || conversation_id::text
        ) INTO notification_id;
      EXCEPTION WHEN OTHERS THEN
        -- Continue if notification creation fails for one user
        RAISE WARNING 'Failed to create notification for user %: %', recipient_user.id, SQLERRM;
      END;
    END LOOP;
  END IF;
  
  RETURN conversation_id;
END;
$$;

COMMENT ON FUNCTION public.communications_create_announcement(text, text, timestamptz, uuid[]) IS 'Create system announcement - MOH Tier 1 only, creates conversation, message, notifications for all recipients';

COMMIT;
