-- Migration: Add RLS policies for communication tables
-- Description: Implement Row Level Security policies for communication tables (conversations, messages, message_attachments, message_read_receipts, conversation_participants - company isolation, MOH system-wide access, internal MOH conversations)
-- Date: 2026-01-17
-- Task: 1.1.1.3e
-- Author: Sami (Implementation Compliance Specialist)

BEGIN;

-- ============================================
-- CONVERSATIONS TABLE POLICIES
-- ============================================

-- Company users can see conversations for their company
CREATE POLICY "company_users_see_own_conversations"
ON public.conversations FOR SELECT
USING (
  company_id IN (
    SELECT company_id FROM public.users WHERE id = auth.uid()
  )
);

-- MOH users can see all conversations (including internal MOH conversations)
CREATE POLICY "moh_users_see_all_conversations"
ON public.conversations FOR SELECT
USING (
  (SELECT company_id FROM public.users WHERE id = auth.uid()) IS NULL
);

-- Authenticated users can create conversations (via RPC functions or direct insert)
-- RPC functions will validate permissions before creating
CREATE POLICY "users_create_conversations"
ON public.conversations FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

-- Users can update conversations they have access to (via RPC functions)
-- RPC functions will validate permissions before updating
CREATE POLICY "users_update_own_conversations"
ON public.conversations FOR UPDATE
USING (
  -- Company users can update conversations for their company
  company_id IN (SELECT company_id FROM public.users WHERE id = auth.uid())
  OR
  -- MOH users can update all conversations
  (SELECT company_id FROM public.users WHERE id = auth.uid()) IS NULL
)
WITH CHECK (
  company_id IN (SELECT company_id FROM public.users WHERE id = auth.uid())
  OR
  (SELECT company_id FROM public.users WHERE id = auth.uid()) IS NULL
);

-- Users cannot delete conversations (soft delete via archived_at only)
-- No DELETE policy - deletion should be handled via archived_at timestamp

-- ============================================
-- MESSAGES TABLE POLICIES
-- ============================================

-- Users can see messages in conversations they have access to
CREATE POLICY "users_see_messages_in_accessible_conversations"
ON public.messages FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.conversations c
    WHERE c.id = messages.conversation_id
    AND (
      -- Company users can see messages in their company's conversations
      c.company_id IN (SELECT company_id FROM public.users WHERE id = auth.uid())
      OR
      -- MOH users can see messages in all conversations
      (SELECT company_id FROM public.users WHERE id = auth.uid()) IS NULL
      OR
      -- Users can see messages they sent
      messages.sender_id = auth.uid()
      OR
      -- Users can see messages sent to them
      messages.recipient_id = auth.uid()
    )
  )
);

-- Authenticated users can create messages (via RPC functions or direct insert)
-- RPC functions will validate permissions (user must be participant in conversation)
CREATE POLICY "users_create_messages"
ON public.messages FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

-- Users can update their own messages (edits, soft deletes)
CREATE POLICY "users_update_own_messages"
ON public.messages FOR UPDATE
USING (sender_id = auth.uid())
WITH CHECK (sender_id = auth.uid());

-- Users cannot delete messages (soft delete via deleted_at only)
-- No DELETE policy - deletion should be handled via deleted_at timestamp

-- ============================================
-- MESSAGE_ATTACHMENTS TABLE POLICIES
-- ============================================

-- Users can see attachments for messages they have access to
CREATE POLICY "users_see_attachments_in_accessible_messages"
ON public.message_attachments FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.messages m
    JOIN public.conversations c ON c.id = m.conversation_id
    WHERE m.id = message_attachments.message_id
    AND (
      -- Company users can see attachments in their company's conversations
      c.company_id IN (SELECT company_id FROM public.users WHERE id = auth.uid())
      OR
      -- MOH users can see attachments in all conversations
      (SELECT company_id FROM public.users WHERE id = auth.uid()) IS NULL
      OR
      -- Users can see attachments for messages they sent
      m.sender_id = auth.uid()
      OR
      -- Users can see attachments for messages sent to them
      m.recipient_id = auth.uid()
    )
  )
);

-- Authenticated users can create attachments (via RPC functions or direct insert)
-- RPC functions will validate permissions (user must be participant in conversation)
CREATE POLICY "users_create_attachments"
ON public.message_attachments FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

-- Users can update attachments they uploaded
CREATE POLICY "users_update_own_attachments"
ON public.message_attachments FOR UPDATE
USING (uploaded_by = auth.uid())
WITH CHECK (uploaded_by = auth.uid());

-- Users cannot delete attachments (files retained for audit trail)
-- No DELETE policy - attachments are immutable

-- ============================================
-- MESSAGE_READ_RECEIPTS TABLE POLICIES
-- ============================================

-- Users can see read receipts for messages they have access to
CREATE POLICY "users_see_read_receipts_in_accessible_messages"
ON public.message_read_receipts FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.messages m
    JOIN public.conversations c ON c.id = m.conversation_id
    WHERE m.id = message_read_receipts.message_id
    AND (
      -- Company users can see read receipts in their company's conversations
      c.company_id IN (SELECT company_id FROM public.users WHERE id = auth.uid())
      OR
      -- MOH users can see read receipts in all conversations
      (SELECT company_id FROM public.users WHERE id = auth.uid()) IS NULL
      OR
      -- Users can see read receipts for messages they sent or received
      m.sender_id = auth.uid()
      OR
      m.recipient_id = auth.uid()
      OR
      -- Users can see their own read receipts
      message_read_receipts.user_id = auth.uid()
    )
  )
);

-- Users can create read receipts for messages they have access to
CREATE POLICY "users_create_read_receipts"
ON public.message_read_receipts FOR INSERT
WITH CHECK (
  user_id = auth.uid()
  AND EXISTS (
    SELECT 1 FROM public.messages m
    JOIN public.conversations c ON c.id = m.conversation_id
    WHERE m.id = message_read_receipts.message_id
    AND (
      c.company_id IN (SELECT company_id FROM public.users WHERE id = auth.uid())
      OR
      (SELECT company_id FROM public.users WHERE id = auth.uid()) IS NULL
      OR
      m.sender_id = auth.uid()
      OR
      m.recipient_id = auth.uid()
    )
  )
);

-- Users can update their own read receipts
CREATE POLICY "users_update_own_read_receipts"
ON public.message_read_receipts FOR UPDATE
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Users cannot delete read receipts (retained for audit trail)
-- No DELETE policy - read receipts are immutable

-- ============================================
-- CONVERSATION_PARTICIPANTS TABLE POLICIES
-- ============================================

-- Users can see participants for conversations they have access to
CREATE POLICY "users_see_participants_in_accessible_conversations"
ON public.conversation_participants FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.conversations c
    WHERE c.id = conversation_participants.conversation_id
    AND (
      -- Company users can see participants in their company's conversations
      c.company_id IN (SELECT company_id FROM public.users WHERE id = auth.uid())
      OR
      -- MOH users can see participants in all conversations
      (SELECT company_id FROM public.users WHERE id = auth.uid()) IS NULL
      OR
      -- Users can see participants for conversations they are part of
      conversation_participants.user_id = auth.uid()
    )
  )
);

-- Authenticated users can create participant records (via RPC functions or direct insert)
-- RPC functions will validate permissions (user must have access to conversation)
CREATE POLICY "users_create_participants"
ON public.conversation_participants FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

-- Users can update participant records for conversations they have access to
-- (e.g., mark as left, change role)
CREATE POLICY "users_update_participants_in_accessible_conversations"
ON public.conversation_participants FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.conversations c
    WHERE c.id = conversation_participants.conversation_id
    AND (
      c.company_id IN (SELECT company_id FROM public.users WHERE id = auth.uid())
      OR
      (SELECT company_id FROM public.users WHERE id = auth.uid()) IS NULL
    )
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.conversations c
    WHERE c.id = conversation_participants.conversation_id
    AND (
      c.company_id IN (SELECT company_id FROM public.users WHERE id = auth.uid())
      OR
      (SELECT company_id FROM public.users WHERE id = auth.uid()) IS NULL
    )
  )
);

-- Users cannot delete participant records (soft delete via left_at only)
-- No DELETE policy - deletion should be handled via left_at timestamp

COMMIT;
