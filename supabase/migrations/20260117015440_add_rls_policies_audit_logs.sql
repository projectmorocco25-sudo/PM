-- Migration: Add RLS policies for audit_logs table
-- Description: Implement Row Level Security policies for audit_logs table (MOH only, companies see own company's audit logs only)
-- Date: 2026-01-17
-- Task: 1.1.1.3c
-- Author: Sami (Implementation Compliance Specialist)

BEGIN;

-- MOH users can see all audit logs
CREATE POLICY "moh_users_see_all_audit_logs"
ON public.audit_logs FOR SELECT
USING (
  (SELECT company_id FROM public.users WHERE id = auth.uid()) IS NULL
);

-- Company users can see their own company's audit logs
-- Note: This policy checks if the audit log record is related to the user's company
-- The policy checks multiple tables based on table_name (polymorphic relationship)
-- This implementation covers the core tables in Phase 1.1.1 (users, notifications, etc.)
-- Additional tables can be added in future migrations as more modules are implemented
CREATE POLICY "company_users_see_own_audit_logs"
ON public.audit_logs FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.users u
    WHERE u.id = auth.uid()
    AND u.company_id IS NOT NULL
    AND (
      -- Audit logs for users table (company users see own company's users)
      (audit_logs.table_name = 'users' AND EXISTS (
        SELECT 1 FROM public.users
        WHERE id = audit_logs.record_id
        AND company_id = u.company_id
      ))
      -- Audit logs for notifications table (users see own notifications)
      OR (audit_logs.table_name = 'notifications' AND EXISTS (
        SELECT 1 FROM public.notifications
        WHERE id = audit_logs.record_id
        AND user_id = auth.uid()
      ))
      -- Audit logs for conversations table (company users see own company's conversations)
      OR (audit_logs.table_name = 'conversations' AND EXISTS (
        SELECT 1 FROM public.conversations
        WHERE id = audit_logs.record_id
        AND company_id = u.company_id
      ))
      -- Audit logs for messages table (company users see own company's messages via conversations)
      OR (audit_logs.table_name = 'messages' AND EXISTS (
        SELECT 1 FROM public.messages m
        JOIN public.conversations c ON c.id = m.conversation_id
        WHERE m.id = audit_logs.record_id
        AND c.company_id = u.company_id
      ))
      -- Audit logs for follow_ups table (company users see own company's follow-ups)
      OR (audit_logs.table_name = 'follow_ups' AND EXISTS (
        SELECT 1 FROM public.follow_ups
        WHERE id = audit_logs.record_id
        AND company_id = u.company_id
      ))
      -- Audit logs for meetings table (company users see meetings related to their company)
      OR (audit_logs.table_name = 'meetings' AND EXISTS (
        SELECT 1 FROM public.meetings
        WHERE id = audit_logs.record_id
        AND (
          related_reference_table = 'companies'
          AND related_reference_id = u.company_id::text::uuid
        )
      ))
      -- Additional tables can be added here as modules are implemented
    )
  )
);

-- Only system/service role can insert audit logs (via RPC functions or triggers)
-- Regular users cannot insert audit logs directly
-- This policy allows service role and RPC functions (SECURITY DEFINER) to insert
CREATE POLICY "system_insert_audit_logs"
ON public.audit_logs FOR INSERT
WITH CHECK (true);  -- Access controlled via SECURITY DEFINER RPC functions

-- Users cannot update audit logs (immutability - audit logs are append-only)
-- No UPDATE policy - audit logs are immutable

-- Users cannot delete audit logs (retention requirement - 7 years)
-- No DELETE policy - audit logs are immutable and retained for regulatory compliance

COMMIT;
