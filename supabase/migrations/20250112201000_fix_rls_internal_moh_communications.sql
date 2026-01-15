-- Migration: fix_rls_internal_moh_communications
-- Description: Prevent company users from seeing internal MOH (company_id IS NULL) conversations/messages
-- Date: 2025-01-12
-- Author: Rafi
-- Phase: 1.1.1
-- Task: 1.1.1.3e hardening (internal MOH conversations)
-- Depends on: 20250112160000_add_rls_policies_communication_tables

BEGIN;

-- Conversations: remove company_id IS NULL allowance from company policy
DROP POLICY IF EXISTS "company_users_see_own_conversations" ON conversations;
CREATE POLICY "company_users_see_own_conversations"
ON conversations FOR SELECT
USING (
  company_id IN (SELECT company_id FROM users WHERE id = auth.uid())
);

-- Messages: remove implicit access to company_id IS NULL conversations
DROP POLICY IF EXISTS "users_see_accessible_messages" ON messages;
CREATE POLICY "users_see_accessible_messages"
ON messages FOR SELECT
USING (
  conversation_id IN (
    SELECT c.id
    FROM conversations c
    WHERE
      -- Company users: only their company conversations
      c.company_id IN (SELECT company_id FROM users WHERE id = auth.uid())
      OR
      -- MOH users: all conversations
      (SELECT company_id FROM users WHERE id = auth.uid()) IS NULL
      OR
      -- Creator or explicit participant
      c.created_by = auth.uid()
      OR EXISTS (
        SELECT 1 FROM conversation_participants cp
        WHERE cp.conversation_id = c.id AND cp.user_id = auth.uid()
      )
  )
);

-- Attachments: align with messages visibility (replace policy)
DROP POLICY IF EXISTS "users_see_accessible_attachments" ON message_attachments;
CREATE POLICY "users_see_accessible_attachments"
ON message_attachments FOR SELECT
USING (
  message_id IN (
    SELECT m.id
    FROM messages m
    WHERE m.conversation_id IN (
      SELECT c.id
      FROM conversations c
      WHERE
        c.company_id IN (SELECT company_id FROM users WHERE id = auth.uid())
        OR (SELECT company_id FROM users WHERE id = auth.uid()) IS NULL
        OR c.created_by = auth.uid()
        OR EXISTS (
          SELECT 1 FROM conversation_participants cp
          WHERE cp.conversation_id = c.id AND cp.user_id = auth.uid()
        )
    )
  )
);

-- Participants: align with conversations visibility (replace policy)
DROP POLICY IF EXISTS "users_see_accessible_participants" ON conversation_participants;
CREATE POLICY "users_see_accessible_participants"
ON conversation_participants FOR SELECT
USING (
  conversation_id IN (
    SELECT c.id
    FROM conversations c
    WHERE
      c.company_id IN (SELECT company_id FROM users WHERE id = auth.uid())
      OR (SELECT company_id FROM users WHERE id = auth.uid()) IS NULL
      OR c.created_by = auth.uid()
      OR EXISTS (
        SELECT 1 FROM conversation_participants cp2
        WHERE cp2.conversation_id = c.id AND cp2.user_id = auth.uid()
      )
  )
);

COMMIT;

