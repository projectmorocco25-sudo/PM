-- Migration: add_rls_policies_governance_tables
-- Description: Add RLS policies for governance tables (follow_ups, meetings, meeting_attendees)
-- Date: 2025-01-12
-- Author: Rafi
-- Phase: 1.1.1
-- Task: 1.1.1.3f
-- Related: rls-policy-framework.md
-- Depends on: 20250112140000_create_governance_tables

BEGIN;

-- Enable RLS on all governance tables
ALTER TABLE follow_ups ENABLE ROW LEVEL SECURITY;
ALTER TABLE meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE meeting_attendees ENABLE ROW LEVEL SECURITY;

-- ============================================
-- FOLLOW_UPS TABLE POLICIES
-- ============================================

-- MOH Tier 1/2 can see all follow-ups
CREATE POLICY "moh_users_see_all_follow_ups"
ON follow_ups FOR SELECT
USING (
  (SELECT company_id FROM users WHERE id = auth.uid()) IS NULL
);

-- Company users can see follow-ups for their company
CREATE POLICY "company_users_see_own_follow_ups"
ON follow_ups FOR SELECT
USING (
  company_id IN (
    SELECT company_id FROM users WHERE id = auth.uid()
  )
);

-- Users can see follow-ups assigned to them
CREATE POLICY "users_see_assigned_follow_ups"
ON follow_ups FOR SELECT
USING (assigned_to = auth.uid());

-- MOH Tier 1/2 can create follow-ups
CREATE POLICY "moh_users_create_follow_ups"
ON follow_ups FOR INSERT
WITH CHECK (
  (SELECT company_id FROM users WHERE id = auth.uid()) IS NULL
  AND created_by = auth.uid()
);

-- Users can update follow-ups assigned to them (self-service status updates)
CREATE POLICY "users_update_assigned_follow_ups"
ON follow_ups FOR UPDATE
USING (assigned_to = auth.uid())
WITH CHECK (assigned_to = auth.uid());

-- MOH Tier 1/2 can update any follow-up
CREATE POLICY "moh_users_update_follow_ups"
ON follow_ups FOR UPDATE
USING (
  (SELECT company_id FROM users WHERE id = auth.uid()) IS NULL
)
WITH CHECK (
  (SELECT company_id FROM users WHERE id = auth.uid()) IS NULL
);

-- ============================================
-- MEETINGS TABLE POLICIES
-- ============================================

-- MOH Tier 1/2 can see all meetings
CREATE POLICY "moh_users_see_all_meetings"
ON meetings FOR SELECT
USING (
  (SELECT company_id FROM users WHERE id = auth.uid()) IS NULL
);

-- Company users can see meetings where they are attendees
CREATE POLICY "company_users_see_attended_meetings"
ON meetings FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM meeting_attendees
    WHERE meeting_id = meetings.id
    AND user_id = auth.uid()
  )
);

-- Company users can see meetings related to their company
-- Note: This requires checking related_reference_id against company_id
-- Simplified version - full implementation would check polymorphic relationships
CREATE POLICY "company_users_see_company_meetings"
ON meetings FOR SELECT
USING (
  related_reference_table = 'companies'
  AND related_reference_id IN (
    SELECT company_id FROM users WHERE id = auth.uid()
  )
);

-- MOH Tier 1/2 can create meetings
CREATE POLICY "moh_users_create_meetings"
ON meetings FOR INSERT
WITH CHECK (
  (SELECT company_id FROM users WHERE id = auth.uid()) IS NULL
  AND created_by = auth.uid()
);

-- MOH Tier 1/2 can update meetings
CREATE POLICY "moh_users_update_meetings"
ON meetings FOR UPDATE
USING (
  (SELECT company_id FROM users WHERE id = auth.uid()) IS NULL
)
WITH CHECK (
  (SELECT company_id FROM users WHERE id = auth.uid()) IS NULL
);

-- ============================================
-- MEETING_ATTENDEES TABLE POLICIES
-- ============================================

-- Users can see attendees for meetings they can access
CREATE POLICY "users_see_accessible_attendees"
ON meeting_attendees FOR SELECT
USING (
  meeting_id IN (
    SELECT id FROM meetings
    WHERE (
      (SELECT company_id FROM users WHERE id = auth.uid()) IS NULL  -- MOH user
      OR EXISTS (
        SELECT 1 FROM meeting_attendees ma2
        WHERE ma2.meeting_id = meetings.id
        AND ma2.user_id = auth.uid()
      )
      OR related_reference_table = 'companies'
      AND related_reference_id IN (
        SELECT company_id FROM users WHERE id = auth.uid()
      )
    )
  )
);

-- Users can see their own attendance records
CREATE POLICY "users_see_own_attendance"
ON meeting_attendees FOR SELECT
USING (user_id = auth.uid());

-- Users can update their own attendance status (accept/decline)
CREATE POLICY "users_update_own_attendance"
ON meeting_attendees FOR UPDATE
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- MOH Tier 1/2 can create and update attendee records
CREATE POLICY "moh_users_manage_attendees"
ON meeting_attendees FOR ALL
USING (
  (SELECT company_id FROM users WHERE id = auth.uid()) IS NULL
)
WITH CHECK (
  (SELECT company_id FROM users WHERE id = auth.uid()) IS NULL
);

COMMIT;

-- Rollback Migration
-- BEGIN;
-- 
-- DROP POLICY IF EXISTS moh_users_manage_attendees ON meeting_attendees;
-- DROP POLICY IF EXISTS users_update_own_attendance ON meeting_attendees;
-- DROP POLICY IF EXISTS users_see_own_attendance ON meeting_attendees;
-- DROP POLICY IF EXISTS users_see_accessible_attendees ON meeting_attendees;
-- 
-- DROP POLICY IF EXISTS moh_users_update_meetings ON meetings;
-- DROP POLICY IF EXISTS moh_users_create_meetings ON meetings;
-- DROP POLICY IF EXISTS company_users_see_company_meetings ON meetings;
-- DROP POLICY IF EXISTS company_users_see_attended_meetings ON meetings;
-- DROP POLICY IF EXISTS moh_users_see_all_meetings ON meetings;
-- 
-- DROP POLICY IF EXISTS moh_users_update_follow_ups ON follow_ups;
-- DROP POLICY IF EXISTS users_update_assigned_follow_ups ON follow_ups;
-- DROP POLICY IF EXISTS moh_users_create_follow_ups ON follow_ups;
-- DROP POLICY IF EXISTS users_see_assigned_follow_ups ON follow_ups;
-- DROP POLICY IF EXISTS company_users_see_own_follow_ups ON follow_ups;
-- DROP POLICY IF EXISTS moh_users_see_all_follow_ups ON follow_ups;
-- 
-- ALTER TABLE meeting_attendees DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE meetings DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE follow_ups DISABLE ROW LEVEL SECURITY;
-- 
-- COMMIT;
