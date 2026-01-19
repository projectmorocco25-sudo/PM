-- Migration: Add RLS policies for governance tables
-- Description: Implement Row Level Security policies for governance tables (follow_ups, meetings, meeting_attendees)
-- Date: 2026-01-17
-- Task: 1.1.1.3f
-- Author: Sami (Implementation Compliance Specialist)

BEGIN;

-- ============================================
-- FOLLOW_UPS TABLE POLICIES
-- ============================================

-- MOH Tier 1/2 can see all follow-ups
CREATE POLICY "moh_tier1_tier2_see_all_follow_ups"
ON public.follow_ups FOR SELECT
USING (
  (SELECT company_id FROM public.users WHERE id = auth.uid()) IS NULL
  AND (SELECT role FROM public.users WHERE id = auth.uid()) IN ('moh_tier1', 'moh_tier2')
);

-- Company users can see follow-ups for their company
CREATE POLICY "company_users_see_own_follow_ups"
ON public.follow_ups FOR SELECT
USING (
  company_id IN (
    SELECT company_id FROM public.users WHERE id = auth.uid()
  )
);

-- MOH Tier 1/2 can create follow-ups
CREATE POLICY "moh_tier1_tier2_create_follow_ups"
ON public.follow_ups FOR INSERT
WITH CHECK (
  (SELECT company_id FROM public.users WHERE id = auth.uid()) IS NULL
  AND (SELECT role FROM public.users WHERE id = auth.uid()) IN ('moh_tier1', 'moh_tier2')
);

-- Users can update follow-ups assigned to them (self-service)
CREATE POLICY "users_update_assigned_follow_ups"
ON public.follow_ups FOR UPDATE
USING (assigned_to = auth.uid())
WITH CHECK (assigned_to = auth.uid());

-- MOH Tier 1/2 can update any follow-up
CREATE POLICY "moh_tier1_tier2_update_all_follow_ups"
ON public.follow_ups FOR UPDATE
USING (
  (SELECT company_id FROM public.users WHERE id = auth.uid()) IS NULL
  AND (SELECT role FROM public.users WHERE id = auth.uid()) IN ('moh_tier1', 'moh_tier2')
)
WITH CHECK (
  (SELECT company_id FROM public.users WHERE id = auth.uid()) IS NULL
  AND (SELECT role FROM public.users WHERE id = auth.uid()) IN ('moh_tier1', 'moh_tier2')
);

-- Users cannot delete follow-ups (soft delete via status = 'cancelled' only)
-- No DELETE policy - deletion should be handled via status = 'cancelled'

-- ============================================
-- MEETINGS TABLE POLICIES
-- ============================================

-- MOH Tier 1/2 can see all meetings
CREATE POLICY "moh_tier1_tier2_see_all_meetings"
ON public.meetings FOR SELECT
USING (
  (SELECT company_id FROM public.users WHERE id = auth.uid()) IS NULL
  AND (SELECT role FROM public.users WHERE id = auth.uid()) IN ('moh_tier1', 'moh_tier2')
);

-- Company users can see meetings where they are attendees
CREATE POLICY "company_users_see_meetings_as_attendees"
ON public.meetings FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.meeting_attendees ma
    WHERE ma.meeting_id = meetings.id
    AND ma.user_id = auth.uid()
  )
);

-- Company users can see meetings related to their company
CREATE POLICY "company_users_see_company_related_meetings"
ON public.meetings FOR SELECT
USING (
  related_reference_table = 'companies'
  AND related_reference_id IN (
    SELECT company_id::text::uuid FROM public.users WHERE id = auth.uid()
    WHERE company_id IS NOT NULL
  )
);

-- MOH Tier 1/2 can create meetings
CREATE POLICY "moh_tier1_tier2_create_meetings"
ON public.meetings FOR INSERT
WITH CHECK (
  (SELECT company_id FROM public.users WHERE id = auth.uid()) IS NULL
  AND (SELECT role FROM public.users WHERE id = auth.uid()) IN ('moh_tier1', 'moh_tier2')
);

-- MOH Tier 1/2 can update meetings
CREATE POLICY "moh_tier1_tier2_update_meetings"
ON public.meetings FOR UPDATE
USING (
  (SELECT company_id FROM public.users WHERE id = auth.uid()) IS NULL
  AND (SELECT role FROM public.users WHERE id = auth.uid()) IN ('moh_tier1', 'moh_tier2')
)
WITH CHECK (
  (SELECT company_id FROM public.users WHERE id = auth.uid()) IS NULL
  AND (SELECT role FROM public.users WHERE id = auth.uid()) IN ('moh_tier1', 'moh_tier2')
);

-- Users cannot delete meetings (soft delete via cancelled_at only)
-- No DELETE policy - deletion should be handled via cancelled_at timestamp

-- ============================================
-- MEETING_ATTENDEES TABLE POLICIES
-- ============================================

-- Users can see attendees for meetings they can access (inherits from meetings RLS)
CREATE POLICY "users_see_attendees_in_accessible_meetings"
ON public.meeting_attendees FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.meetings m
    WHERE m.id = meeting_attendees.meeting_id
    AND (
      -- MOH Tier 1/2 can see all attendees
      (
        (SELECT company_id FROM public.users WHERE id = auth.uid()) IS NULL
        AND (SELECT role FROM public.users WHERE id = auth.uid()) IN ('moh_tier1', 'moh_tier2')
      )
      OR
      -- Company users can see attendees for meetings where they are attendees
      EXISTS (
        SELECT 1 FROM public.meeting_attendees ma2
        WHERE ma2.meeting_id = m.id
        AND ma2.user_id = auth.uid()
      )
      OR
      -- Company users can see attendees for meetings related to their company
      (
        m.related_reference_table = 'companies'
        AND m.related_reference_id IN (
          SELECT company_id::text::uuid FROM public.users WHERE id = auth.uid()
          WHERE company_id IS NOT NULL
        )
      )
      OR
      -- Users can see their own attendee record
      meeting_attendees.user_id = auth.uid()
    )
  )
);

-- MOH Tier 1/2 can create attendee records (add attendees to meetings)
CREATE POLICY "moh_tier1_tier2_create_attendees"
ON public.meeting_attendees FOR INSERT
WITH CHECK (
  (SELECT company_id FROM public.users WHERE id = auth.uid()) IS NULL
  AND (SELECT role FROM public.users WHERE id = auth.uid()) IN ('moh_tier1', 'moh_tier2')
);

-- Users can update their own attendee record (e.g., accept/decline invitation, mark as attended)
CREATE POLICY "users_update_own_attendee_record"
ON public.meeting_attendees FOR UPDATE
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- MOH Tier 1/2 can update any attendee record (e.g., change attendance status, add/remove attendees)
CREATE POLICY "moh_tier1_tier2_update_all_attendees"
ON public.meeting_attendees FOR UPDATE
USING (
  (SELECT company_id FROM public.users WHERE id = auth.uid()) IS NULL
  AND (SELECT role FROM public.users WHERE id = auth.uid()) IN ('moh_tier1', 'moh_tier2')
)
WITH CHECK (
  (SELECT company_id FROM public.users WHERE id = auth.uid()) IS NULL
  AND (SELECT role FROM public.users WHERE id = auth.uid()) IN ('moh_tier1', 'moh_tier2')
);

-- MOH Tier 1/2 can delete attendee records (remove attendees from meetings)
CREATE POLICY "moh_tier1_tier2_delete_attendees"
ON public.meeting_attendees FOR DELETE
USING (
  (SELECT company_id FROM public.users WHERE id = auth.uid()) IS NULL
  AND (SELECT role FROM public.users WHERE id = auth.uid()) IN ('moh_tier1', 'moh_tier2')
);

COMMIT;
