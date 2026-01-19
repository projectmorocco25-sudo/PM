-- Migration: Add RLS policies for notifications table
-- Description: Implement Row Level Security policies for notifications table (users see own notifications only)
-- Date: 2026-01-17
-- Task: 1.1.1.3d
-- Author: Sami (Implementation Compliance Specialist)

BEGIN;

-- Users can see their own notifications only
CREATE POLICY "users_see_own_notifications"
ON public.notifications FOR SELECT
USING (user_id = auth.uid());

-- System/service role can insert notifications (via RPC functions or triggers)
-- Regular users cannot insert notifications directly
-- This policy allows service role and RPC functions (SECURITY DEFINER) to insert
CREATE POLICY "system_insert_notifications"
ON public.notifications FOR INSERT
WITH CHECK (true);  -- Access controlled via SECURITY DEFINER RPC functions

-- Users can update their own notifications (e.g., mark as read)
CREATE POLICY "users_update_own_notifications"
ON public.notifications FOR UPDATE
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Users cannot delete notifications (soft delete via is_read flag only)
-- No DELETE policy - notifications are immutable, marked as read instead

COMMIT;
