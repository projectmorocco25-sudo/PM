-- Migration: create_rls_policies_communications_tables
-- Description: Implement RLS policies for communications tables (conversations, messages, message_attachments, message_read_receipts)
-- Date: 2026-01-22
-- Task: 1.1.1.8a
-- Author: Sami (Implementation Compliance Specialist)
-- Dependencies: Task 1.1.1.2a (communications tables must exist)

BEGIN;

-- ============================================================================
-- Enable RLS on all communications tables
-- ============================================================================

ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_read_receipts ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- conversations table RLS policies
-- ============================================================================

-- Company users can see conversations where company_id = their company_id
CREATE POLICY "company_users_see_own_conversations"
ON conversations FOR SELECT
USING (
    company_id IN (
        SELECT company_id FROM users WHERE id = auth.uid()
    )
    OR created_by = auth.uid() -- User can see conversations they created
);

-- MOH users can see all conversations (system-wide access)
CREATE POLICY "moh_users_see_all_conversations"
ON conversations FOR SELECT
USING (
    (SELECT company_id FROM users WHERE id = auth.uid()) IS NULL
);

-- Internal MOH conversations: Only visible to MOH users
-- Note: This is handled by the MOH policy above (MOH users see all conversations)

-- Users can create conversations (via RPC functions with proper authorization)
-- Note: Conversation creation is handled via RPC functions with proper authorization

-- Users can update conversations (via RPC functions with proper authorization)
-- Note: Conversation updates (archive, lifecycle_state) are handled via RPC functions with proper authorization

-- ============================================================================
-- messages table RLS policies
-- ============================================================================

-- Users can see messages in conversations they have access to (via conversation RLS)
-- Note: Messages inherit access from conversations, so we check conversation access
CREATE POLICY "users_see_messages_in_accessible_conversations"
ON messages FOR SELECT
USING (
    conversation_id IN (
        SELECT id FROM conversations
        WHERE (
            -- Company users see messages in their company's conversations
            company_id IN (SELECT company_id FROM users WHERE id = auth.uid())
            OR created_by = auth.uid()
            OR (SELECT company_id FROM users WHERE id = auth.uid()) IS NULL -- MOH users
        )
    )
    OR sender_id = auth.uid() -- Users can see messages they sent
    OR recipient_id = auth.uid() -- Users can see messages sent to them
);

-- Users can create messages (via RPC functions with proper authorization)
-- Note: Message creation is handled via RPC functions with proper authorization

-- Users can update their own messages (via RPC functions with proper authorization)
-- Note: Message updates (edit, delete) are handled via RPC functions with proper authorization

-- ============================================================================
-- message_attachments table RLS policies
-- ============================================================================

-- Users can see attachments for messages they have access to (via message RLS)
CREATE POLICY "users_see_attachments_for_accessible_messages"
ON message_attachments FOR SELECT
USING (
    message_id IN (
        SELECT id FROM messages
        WHERE conversation_id IN (
            SELECT id FROM conversations
            WHERE (
                company_id IN (SELECT company_id FROM users WHERE id = auth.uid())
                OR created_by = auth.uid()
                OR (SELECT company_id FROM users WHERE id = auth.uid()) IS NULL -- MOH users
            )
        )
        OR sender_id = auth.uid()
        OR recipient_id = auth.uid()
    )
);

-- Users can create attachments (via RPC functions with proper authorization)
-- Note: Attachment creation is handled via RPC functions with proper authorization

-- ============================================================================
-- message_read_receipts table RLS policies
-- ============================================================================

-- Users can see read receipts for messages they have access to (via message RLS)
CREATE POLICY "users_see_read_receipts_for_accessible_messages"
ON message_read_receipts FOR SELECT
USING (
    message_id IN (
        SELECT id FROM messages
        WHERE conversation_id IN (
            SELECT id FROM conversations
            WHERE (
                company_id IN (SELECT company_id FROM users WHERE id = auth.uid())
                OR created_by = auth.uid()
                OR (SELECT company_id FROM users WHERE id = auth.uid()) IS NULL -- MOH users
            )
        )
        OR sender_id = auth.uid()
        OR recipient_id = auth.uid()
    )
    OR user_id = auth.uid() -- Users can see their own read receipts
);

-- Users can create read receipts for messages they have access to (via RPC functions)
-- Note: Read receipt creation is handled via RPC functions with proper authorization

COMMIT;
