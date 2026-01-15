-- Migration: add_rls_policies_communication_tables
-- Description: Add RLS policies for communication tables (conversations, messages, message_attachments, message_read_receipts, conversation_participants)
-- Date: 2025-01-12
-- Author: Rafi
-- Phase: 1.1.1
-- Task: 1.1.1.3e
-- Related: rls-policy-framework.md
-- Depends on: 20250112130000_create_communication_tables

BEGIN;

-- Enable RLS on all communication tables
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_read_receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_participants ENABLE ROW LEVEL SECURITY;

-- ============================================
-- CONVERSATIONS TABLE POLICIES
-- ============================================

-- Company users can see conversations for their company
CREATE POLICY "company_users_see_own_conversations"
ON conversations FOR SELECT
USING (
  company_id IN (
    SELECT company_id FROM users WHERE id = auth.uid()
  )
  OR company_id IS NULL  -- Internal MOH conversations (if user is MOH)
);

-- MOH users can see all conversations
CREATE POLICY "moh_users_see_all_conversations"
ON conversations FOR SELECT
USING (
  (SELECT company_id FROM users WHERE id = auth.uid()) IS NULL
);

-- Users can see conversations they created
CREATE POLICY "users_see_own_created_conversations"
ON conversations FOR SELECT
USING (created_by = auth.uid());

-- Users can see conversations where they are participants
CREATE POLICY "users_see_participant_conversations"
ON conversations FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM conversation_participants
    WHERE conversation_id = conversations.id
    AND user_id = auth.uid()
  )
);

-- Users can create conversations (for their company or as MOH)
CREATE POLICY "users_create_conversations"
ON conversations FOR INSERT
WITH CHECK (
  created_by = auth.uid()
  AND (
    company_id IS NULL  -- MOH user
    OR company_id IN (SELECT company_id FROM users WHERE id = auth.uid())  -- Company user
  )
);

-- Users can update conversations they created (for lifecycle state, etc.)
CREATE POLICY "users_update_own_conversations"
ON conversations FOR UPDATE
USING (created_by = auth.uid())
WITH CHECK (created_by = auth.uid());

-- MOH Tier 1 can update any conversation (for moderation, archival)
CREATE POLICY "moh_tier1_update_conversations"
ON conversations FOR UPDATE
USING (
  (SELECT company_id FROM users WHERE id = auth.uid()) IS NULL
  AND (SELECT role FROM users WHERE id = auth.uid()) = 'tier1'
)
WITH CHECK (
  (SELECT company_id FROM users WHERE id = auth.uid()) IS NULL
  AND (SELECT role FROM users WHERE id = auth.uid()) = 'tier1'
);

-- ============================================
-- MESSAGES TABLE POLICIES
-- ============================================

-- Users can see messages in conversations they have access to
CREATE POLICY "users_see_accessible_messages"
ON messages FOR SELECT
USING (
  conversation_id IN (
    SELECT id FROM conversations
    WHERE company_id IN (SELECT company_id FROM users WHERE id = auth.uid())
    OR company_id IS NULL
    OR created_by = auth.uid()
    OR EXISTS (
      SELECT 1 FROM conversation_participants
      WHERE conversation_id = conversations.id
      AND user_id = auth.uid()
    )
  )
);

-- Users can see messages they sent
CREATE POLICY "users_see_sent_messages"
ON messages FOR SELECT
USING (sender_id = auth.uid());

-- Users can see messages they received
CREATE POLICY "users_see_received_messages"
ON messages FOR SELECT
USING (recipient_id = auth.uid());

-- Users can create messages in conversations they have access to
CREATE POLICY "users_create_messages"
ON messages FOR INSERT
WITH CHECK (
  sender_id = auth.uid()
  AND conversation_id IN (
    SELECT id FROM conversations
    WHERE company_id IN (SELECT company_id FROM users WHERE id = auth.uid())
    OR company_id IS NULL
    OR created_by = auth.uid()
    OR EXISTS (
      SELECT 1 FROM conversation_participants
      WHERE conversation_id = conversations.id
      AND user_id = auth.uid()
    )
  )
);

-- Users can update their own messages (for editing)
CREATE POLICY "users_update_own_messages"
ON messages FOR UPDATE
USING (sender_id = auth.uid())
WITH CHECK (sender_id = auth.uid());

-- ============================================
-- MESSAGE_ATTACHMENTS TABLE POLICIES
-- ============================================

-- Users can see attachments for messages they have access to
CREATE POLICY "users_see_accessible_attachments"
ON message_attachments FOR SELECT
USING (
  message_id IN (
    SELECT id FROM messages
    WHERE conversation_id IN (
      SELECT id FROM conversations
      WHERE company_id IN (SELECT company_id FROM users WHERE id = auth.uid())
      OR company_id IS NULL
      OR created_by = auth.uid()
      OR EXISTS (
        SELECT 1 FROM conversation_participants
        WHERE conversation_id = conversations.id
        AND user_id = auth.uid()
      )
    )
  )
);

-- Users can create attachments for messages they sent
CREATE POLICY "users_create_attachments"
ON message_attachments FOR INSERT
WITH CHECK (
  uploaded_by = auth.uid()
  AND message_id IN (
    SELECT id FROM messages WHERE sender_id = auth.uid()
  )
);

-- ============================================
-- MESSAGE_READ_RECEIPTS TABLE POLICIES
-- ============================================

-- Users can see their own read receipts
CREATE POLICY "users_see_own_read_receipts"
ON message_read_receipts FOR SELECT
USING (user_id = auth.uid());

-- Users can see read receipts for messages they sent
CREATE POLICY "users_see_sent_message_read_receipts"
ON message_read_receipts FOR SELECT
USING (
  message_id IN (
    SELECT id FROM messages WHERE sender_id = auth.uid()
  )
);

-- Users can create read receipts for themselves
CREATE POLICY "users_create_own_read_receipts"
ON message_read_receipts FOR INSERT
WITH CHECK (user_id = auth.uid());

-- ============================================
-- CONVERSATION_PARTICIPANTS TABLE POLICIES
-- ============================================

-- Users can see participants for conversations they have access to
CREATE POLICY "users_see_accessible_participants"
ON conversation_participants FOR SELECT
USING (
  conversation_id IN (
    SELECT id FROM conversations
    WHERE company_id IN (SELECT company_id FROM users WHERE id = auth.uid())
    OR company_id IS NULL
    OR created_by = auth.uid()
    OR EXISTS (
      SELECT 1 FROM conversation_participants cp2
      WHERE cp2.conversation_id = conversations.id
      AND cp2.user_id = auth.uid()
    )
  )
);

-- Users can see their own participant records
CREATE POLICY "users_see_own_participants"
ON conversation_participants FOR SELECT
USING (user_id = auth.uid());

-- Users can create participant records (for conversations they created or are invited to)
CREATE POLICY "users_create_participants"
ON conversation_participants FOR INSERT
WITH CHECK (
  conversation_id IN (
    SELECT id FROM conversations
    WHERE created_by = auth.uid()
    OR EXISTS (
      SELECT 1 FROM conversation_participants cp2
      WHERE cp2.conversation_id = conversations.id
      AND cp2.user_id = auth.uid()
    )
  )
);

COMMIT;

-- Rollback Migration
-- BEGIN;
-- 
-- DROP POLICY IF EXISTS users_create_participants ON conversation_participants;
-- DROP POLICY IF EXISTS users_see_own_participants ON conversation_participants;
-- DROP POLICY IF EXISTS users_see_accessible_participants ON conversation_participants;
-- 
-- DROP POLICY IF EXISTS users_create_own_read_receipts ON message_read_receipts;
-- DROP POLICY IF EXISTS users_see_sent_message_read_receipts ON message_read_receipts;
-- DROP POLICY IF EXISTS users_see_own_read_receipts ON message_read_receipts;
-- 
-- DROP POLICY IF EXISTS users_create_attachments ON message_attachments;
-- DROP POLICY IF EXISTS users_see_accessible_attachments ON message_attachments;
-- 
-- DROP POLICY IF EXISTS users_update_own_messages ON messages;
-- DROP POLICY IF EXISTS users_create_messages ON messages;
-- DROP POLICY IF EXISTS users_see_received_messages ON messages;
-- DROP POLICY IF EXISTS users_see_sent_messages ON messages;
-- DROP POLICY IF EXISTS users_see_accessible_messages ON messages;
-- 
-- DROP POLICY IF EXISTS moh_tier1_update_conversations ON conversations;
-- DROP POLICY IF EXISTS users_update_own_conversations ON conversations;
-- DROP POLICY IF EXISTS users_create_conversations ON conversations;
-- DROP POLICY IF EXISTS users_see_participant_conversations ON conversations;
-- DROP POLICY IF EXISTS users_see_own_created_conversations ON conversations;
-- DROP POLICY IF EXISTS moh_users_see_all_conversations ON conversations;
-- DROP POLICY IF EXISTS company_users_see_own_conversations ON conversations;
-- 
-- ALTER TABLE conversation_participants DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE message_read_receipts DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE message_attachments DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE messages DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE conversations DISABLE ROW LEVEL SECURITY;
-- 
-- COMMIT;
