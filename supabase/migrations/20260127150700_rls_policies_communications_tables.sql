-- Migration: RLS policies for communications tables
-- Description: Implement RLS for conversations, messages, message_attachments, message_read_receipts.
-- Task: 1.1.1.8a
-- Date: 2026-01-27
-- Author: Sami (Implementation Compliance Specialist)
-- Dependencies: 20260127150100_communications_tables (1.1.1.2a-verify), 20260127150400 (current_user_role, current_user_company_id)
-- Reference: feature-index.md#communications. Company isolation; announcements: MOH create, all view.

BEGIN;

-- --------
-- conversations
-- --------
-- SELECT: MOH all; company users own company (company_id = theirs) OR announcements (all can view)
DROP POLICY IF EXISTS "conversations_select" ON public.conversations;
CREATE POLICY "conversations_select" ON public.conversations
  FOR SELECT
  TO authenticated
  USING (
    current_user_role() IN ('tier1', 'tier2_officer', 'tier2_registrar', 'auditor', 'system_admin')
    OR (current_user_company_id() IS NOT NULL AND company_id = current_user_company_id())
    OR (is_announcement = true)
  );

-- INSERT: MOH can create any (including announcements); company users create company convos only (not announcements)
DROP POLICY IF EXISTS "conversations_insert" ON public.conversations;
CREATE POLICY "conversations_insert" ON public.conversations
  FOR INSERT
  TO authenticated
  WITH CHECK (
    current_user_role() IN ('tier1', 'tier2_officer', 'tier2_registrar', 'system_admin')
    OR (
      current_user_company_id() IS NOT NULL
      AND company_id = current_user_company_id()
      AND is_announcement = false
      AND created_by = auth.uid()
    )
  );

-- UPDATE/DELETE: MOH only (manage all); company users could update own company convos — keep MOH-only for simplicity
DROP POLICY IF EXISTS "conversations_update_moh" ON public.conversations;
CREATE POLICY "conversations_update_moh" ON public.conversations
  FOR UPDATE
  TO authenticated
  USING (current_user_role() IN ('tier1', 'tier2_officer', 'tier2_registrar', 'system_admin'))
  WITH CHECK (current_user_role() IN ('tier1', 'tier2_officer', 'tier2_registrar', 'system_admin'));

DROP POLICY IF EXISTS "conversations_delete_moh" ON public.conversations;
CREATE POLICY "conversations_delete_moh" ON public.conversations
  FOR DELETE
  TO authenticated
  USING (current_user_role() IN ('tier1', 'tier2_officer', 'tier2_registrar', 'system_admin'));

-- --------
-- messages
-- --------
-- SELECT: messages in conversations user can access (via conversation visibility)
DROP POLICY IF EXISTS "messages_select" ON public.messages;
CREATE POLICY "messages_select" ON public.messages
  FOR SELECT
  TO authenticated
  USING (
    conversation_id IN (
      SELECT id FROM public.conversations
      WHERE current_user_role() IN ('tier1', 'tier2_officer', 'tier2_registrar', 'auditor', 'system_admin')
         OR (current_user_company_id() IS NOT NULL AND company_id = current_user_company_id())
         OR is_announcement = true
    )
  );

-- INSERT: MOH or participants in allowed conversations (sender = self)
DROP POLICY IF EXISTS "messages_insert" ON public.messages;
CREATE POLICY "messages_insert" ON public.messages
  FOR INSERT
  TO authenticated
  WITH CHECK (
    sender_id = auth.uid()
    AND conversation_id IN (
      SELECT id FROM public.conversations
      WHERE current_user_role() IN ('tier1', 'tier2_officer', 'tier2_registrar', 'system_admin')
         OR (current_user_company_id() IS NOT NULL AND company_id = current_user_company_id())
         OR is_announcement = true
    )
  );

-- UPDATE/DELETE: sender can soft-delete own? Typically via RPC. Keep MOH-only for simplicity.
DROP POLICY IF EXISTS "messages_update_moh" ON public.messages;
CREATE POLICY "messages_update_moh" ON public.messages
  FOR UPDATE
  TO authenticated
  USING (current_user_role() IN ('tier1', 'tier2_officer', 'tier2_registrar', 'system_admin'))
  WITH CHECK (current_user_role() IN ('tier1', 'tier2_officer', 'tier2_registrar', 'system_admin'));

DROP POLICY IF EXISTS "messages_delete_moh" ON public.messages;
CREATE POLICY "messages_delete_moh" ON public.messages
  FOR DELETE
  TO authenticated
  USING (current_user_role() IN ('tier1', 'tier2_officer', 'tier2_registrar', 'system_admin'));

-- --------
-- message_attachments
-- --------
-- SELECT: attachments for messages in accessible conversations
DROP POLICY IF EXISTS "message_attachments_select" ON public.message_attachments;
CREATE POLICY "message_attachments_select" ON public.message_attachments
  FOR SELECT
  TO authenticated
  USING (
    message_id IN (
      SELECT m.id FROM public.messages m
      JOIN public.conversations c ON c.id = m.conversation_id
      WHERE current_user_role() IN ('tier1', 'tier2_officer', 'tier2_registrar', 'auditor', 'system_admin')
         OR (current_user_company_id() IS NOT NULL AND c.company_id = current_user_company_id())
         OR c.is_announcement = true
    )
  );

-- INSERT: uploaded_by = self, message in accessible conversation
DROP POLICY IF EXISTS "message_attachments_insert" ON public.message_attachments;
CREATE POLICY "message_attachments_insert" ON public.message_attachments
  FOR INSERT
  TO authenticated
  WITH CHECK (
    uploaded_by = auth.uid()
    AND message_id IN (
      SELECT m.id FROM public.messages m
      JOIN public.conversations c ON c.id = m.conversation_id
      WHERE current_user_role() IN ('tier1', 'tier2_officer', 'tier2_registrar', 'system_admin')
         OR (current_user_company_id() IS NOT NULL AND c.company_id = current_user_company_id())
         OR c.is_announcement = true
    )
  );

-- UPDATE/DELETE: MOH only
DROP POLICY IF EXISTS "message_attachments_update_moh" ON public.message_attachments;
CREATE POLICY "message_attachments_update_moh" ON public.message_attachments
  FOR UPDATE
  TO authenticated
  USING (current_user_role() IN ('tier1', 'tier2_officer', 'tier2_registrar', 'system_admin'))
  WITH CHECK (current_user_role() IN ('tier1', 'tier2_officer', 'tier2_registrar', 'system_admin'));

DROP POLICY IF EXISTS "message_attachments_delete_moh" ON public.message_attachments;
CREATE POLICY "message_attachments_delete_moh" ON public.message_attachments
  FOR DELETE
  TO authenticated
  USING (current_user_role() IN ('tier1', 'tier2_officer', 'tier2_registrar', 'system_admin'));

-- --------
-- message_read_receipts
-- --------
-- SELECT: receipts for messages in accessible conversations
DROP POLICY IF EXISTS "message_read_receipts_select" ON public.message_read_receipts;
CREATE POLICY "message_read_receipts_select" ON public.message_read_receipts
  FOR SELECT
  TO authenticated
  USING (
    message_id IN (
      SELECT m.id FROM public.messages m
      JOIN public.conversations c ON c.id = m.conversation_id
      WHERE current_user_role() IN ('tier1', 'tier2_officer', 'tier2_registrar', 'auditor', 'system_admin')
         OR (current_user_company_id() IS NOT NULL AND c.company_id = current_user_company_id())
         OR c.is_announcement = true
    )
  );

-- INSERT: user_id = self (mark as read), message in accessible conversation
DROP POLICY IF EXISTS "message_read_receipts_insert" ON public.message_read_receipts;
CREATE POLICY "message_read_receipts_insert" ON public.message_read_receipts
  FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = auth.uid()
    AND message_id IN (
      SELECT m.id FROM public.messages m
      JOIN public.conversations c ON c.id = m.conversation_id
      WHERE current_user_role() IN ('tier1', 'tier2_officer', 'tier2_registrar', 'system_admin')
         OR (current_user_company_id() IS NOT NULL AND c.company_id = current_user_company_id())
         OR c.is_announcement = true
    )
  );

-- UPDATE/DELETE: MOH only (or own receipt? typically not needed)
DROP POLICY IF EXISTS "message_read_receipts_update_moh" ON public.message_read_receipts;
CREATE POLICY "message_read_receipts_update_moh" ON public.message_read_receipts
  FOR UPDATE
  TO authenticated
  USING (current_user_role() IN ('tier1', 'tier2_officer', 'tier2_registrar', 'system_admin'))
  WITH CHECK (current_user_role() IN ('tier1', 'tier2_officer', 'tier2_registrar', 'system_admin'));

DROP POLICY IF EXISTS "message_read_receipts_delete_moh" ON public.message_read_receipts;
CREATE POLICY "message_read_receipts_delete_moh" ON public.message_read_receipts
  FOR DELETE
  TO authenticated
  USING (current_user_role() IN ('tier1', 'tier2_officer', 'tier2_registrar', 'system_admin'));

COMMIT;
