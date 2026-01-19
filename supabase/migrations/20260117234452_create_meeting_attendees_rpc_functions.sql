-- Migration: Create RPC functions for meeting_attendees table
-- Description: Create RPC functions for meeting_attendees table (meeting_attendees_add, meeting_attendees_remove, meeting_attendees_list)
-- Date: 2026-01-17
-- Task: 1.1.1.10d
-- Author: Sami (Implementation Compliance Specialist)

BEGIN;

-- ============================================
-- meeting_attendees_add
-- ============================================

/**
 * RPC Function: meeting_attendees_add
 * 
 * Purpose: Add attendee to meeting (MOH Tier 1/2 only)
 * 
 * Module: shared (governance)
 * Security: SECURITY DEFINER
 * 
 * Parameters:
 *   - p_meeting_id (uuid): Meeting ID (required)
 *   - p_user_id (uuid): User ID to add as attendee (required)
 * 
 * Returns: uuid - Meeting attendee ID
 * 
 * Business Rules:
 *   - Only MOH Tier 1/2 can add attendees
 *   - Cannot add attendee to cancelled or completed meetings
 *   - Creates notification for added attendee
 *   - Creates audit log entry
 */
CREATE OR REPLACE FUNCTION public.meeting_attendees_add(
  p_meeting_id uuid,
  p_user_id uuid
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  attendee_id uuid;
  current_user_id uuid;
  current_user_role text;
  meeting_record RECORD;
  user_record RECORD;
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
  
  -- Validate only MOH Tier 1/2 can add attendees
  IF current_user_role NOT IN ('moh_tier1', 'moh_tier2') THEN
    RAISE EXCEPTION 'Only MOH Tier 1/2 can add meeting attendees' USING ERRCODE = 'P0003';
  END IF;
  
  -- Validate required parameters
  IF p_meeting_id IS NULL OR p_user_id IS NULL THEN
    RAISE EXCEPTION 'Missing required parameters: meeting_id and user_id are required' USING ERRCODE = 'P0002';
  END IF;
  
  -- Get meeting
  SELECT * INTO meeting_record
  FROM public.meetings
  WHERE id = p_meeting_id;
  
  IF meeting_record IS NULL THEN
    RAISE EXCEPTION 'Meeting not found' USING ERRCODE = 'P0001';
  END IF;
  
  -- Validate meeting is not cancelled or completed
  IF meeting_record.status IN ('cancelled', 'completed') THEN
    RAISE EXCEPTION 'Cannot add attendees to cancelled or completed meeting' USING ERRCODE = 'P0002';
  END IF;
  
  -- Get user
  SELECT * INTO user_record
  FROM public.users
  WHERE id = p_user_id;
  
  IF user_record IS NULL THEN
    RAISE EXCEPTION 'User not found' USING ERRCODE = 'P0001';
  END IF;
  
  -- Check if attendee already exists
  IF EXISTS (
    SELECT 1 FROM public.meeting_attendees
    WHERE meeting_id = p_meeting_id
    AND user_id = p_user_id
  ) THEN
    RAISE EXCEPTION 'User is already an attendee of this meeting' USING ERRCODE = 'P0002';
  END IF;
  
  -- Add attendee
  INSERT INTO public.meeting_attendees (
    meeting_id,
    user_id,
    attendance_status,
    calendar_invite_sent,
    created_at
  ) VALUES (
    p_meeting_id,
    p_user_id,
    'pending',
    false,
    now()
  )
  RETURNING id INTO attendee_id;
  
  -- Create audit log
  PERFORM public.shared_create_audit_log(
    current_user_id,
    'INSERT',
    'meeting_attendees',
    attendee_id,
    NULL,
    jsonb_build_object(
      'meeting_id', p_meeting_id,
      'user_id', p_user_id,
      'attendance_status', 'pending'
    ),
    'Meeting attendee added'
  );
  
  -- Create notification for added attendee
  PERFORM public.shared_create_notification(
    p_user_id,
    'meeting_invitation',
    'Meeting Invitation',
    'You have been invited to attend: ' || meeting_record.title,
    '/dashboard/meetings/' || p_meeting_id::text
  );
  
  RETURN attendee_id;
END;
$$;

COMMENT ON FUNCTION public.meeting_attendees_add(uuid, uuid) IS 'Add attendee to meeting - MOH Tier 1/2 only';

-- ============================================
-- meeting_attendees_remove
-- ============================================

/**
 * RPC Function: meeting_attendees_remove
 * 
 * Purpose: Remove attendee from meeting (MOH Tier 1/2 only)
 * 
 * Module: shared (governance)
 * Security: SECURITY DEFINER
 * 
 * Parameters:
 *   - p_meeting_id (uuid): Meeting ID (required)
 *   - p_user_id (uuid): User ID to remove from attendees (required)
 * 
 * Returns: boolean - Success indicator
 * 
 * Business Rules:
 *   - Only MOH Tier 1/2 can remove attendees
 *   - Cannot remove attendee from cancelled or completed meetings
 *   - Creates audit log entry
 */
CREATE OR REPLACE FUNCTION public.meeting_attendees_remove(
  p_meeting_id uuid,
  p_user_id uuid
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_user_id uuid;
  current_user_role text;
  meeting_record RECORD;
  attendee_record RECORD;
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
  
  -- Validate only MOH Tier 1/2 can remove attendees
  IF current_user_role NOT IN ('moh_tier1', 'moh_tier2') THEN
    RAISE EXCEPTION 'Only MOH Tier 1/2 can remove meeting attendees' USING ERRCODE = 'P0003';
  END IF;
  
  -- Validate required parameters
  IF p_meeting_id IS NULL OR p_user_id IS NULL THEN
    RAISE EXCEPTION 'Missing required parameters: meeting_id and user_id are required' USING ERRCODE = 'P0002';
  END IF;
  
  -- Get meeting
  SELECT * INTO meeting_record
  FROM public.meetings
  WHERE id = p_meeting_id;
  
  IF meeting_record IS NULL THEN
    RAISE EXCEPTION 'Meeting not found' USING ERRCODE = 'P0001';
  END IF;
  
  -- Validate meeting is not cancelled or completed
  IF meeting_record.status IN ('cancelled', 'completed') THEN
    RAISE EXCEPTION 'Cannot remove attendees from cancelled or completed meeting' USING ERRCODE = 'P0002';
  END IF;
  
  -- Get attendee
  SELECT * INTO attendee_record
  FROM public.meeting_attendees
  WHERE meeting_id = p_meeting_id
  AND user_id = p_user_id;
  
  IF attendee_record IS NULL THEN
    RAISE EXCEPTION 'Attendee not found' USING ERRCODE = 'P0001';
  END IF;
  
  -- Remove attendee
  DELETE FROM public.meeting_attendees
  WHERE meeting_id = p_meeting_id
  AND user_id = p_user_id;
  
  -- Create audit log
  PERFORM public.shared_create_audit_log(
    current_user_id,
    'DELETE',
    'meeting_attendees',
    attendee_record.id,
    jsonb_build_object(
      'meeting_id', p_meeting_id,
      'user_id', p_user_id,
      'attendance_status', attendee_record.attendance_status
    ),
    NULL,
    'Meeting attendee removed'
  );
  
  RETURN true;
END;
$$;

COMMENT ON FUNCTION public.meeting_attendees_remove(uuid, uuid) IS 'Remove attendee from meeting - MOH Tier 1/2 only';

-- ============================================
-- meeting_attendees_list
-- ============================================

/**
 * RPC Function: meeting_attendees_list
 * 
 * Purpose: List attendees for a meeting (inherit meeting access permissions)
 * 
 * Module: shared (governance)
 * Security: SECURITY DEFINER
 * 
 * Parameters:
 *   - p_meeting_id (uuid): Meeting ID (required)
 * 
 * Returns: TABLE - Meeting attendees list
 * 
 * Business Rules:
 *   - Users can only see attendees for meetings they can access
 *   - MOH Tier 1/2 can see attendees for any meeting
 *   - Company users can see attendees for meetings where they are attendees OR meetings related to their company
 */
CREATE OR REPLACE FUNCTION public.meeting_attendees_list(
  p_meeting_id uuid
)
RETURNS TABLE (
  id uuid,
  meeting_id uuid,
  user_id uuid,
  attendance_status text,
  calendar_invite_sent boolean,
  responded_at timestamptz,
  created_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
DECLARE
  current_user_id uuid;
  current_user_role text;
  current_user_company_id uuid;
  meeting_record RECORD;
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
  
  -- Get meeting
  SELECT * INTO meeting_record
  FROM public.meetings
  WHERE id = p_meeting_id;
  
  IF meeting_record IS NULL THEN
    RAISE EXCEPTION 'Meeting not found' USING ERRCODE = 'P0001';
  END IF;
  
  -- Validate access
  IF current_user_role NOT IN ('moh_tier1', 'moh_tier2') THEN
    -- Check if user is attendee
    IF NOT EXISTS (
      SELECT 1 FROM public.meeting_attendees
      WHERE meeting_id = p_meeting_id
      AND user_id = current_user_id
    ) THEN
      -- Check if meeting is related to user's company
      IF NOT (
        current_user_company_id IS NOT NULL
        AND meeting_record.related_reference_table = 'companies'
        AND meeting_record.related_reference_id = current_user_company_id::text::uuid
      ) THEN
        RAISE EXCEPTION 'Access denied' USING ERRCODE = 'P0003';
      END IF;
    END IF;
  END IF;
  
  -- Return attendees
  RETURN QUERY
  SELECT 
    ma.id,
    ma.meeting_id,
    ma.user_id,
    ma.attendance_status,
    ma.calendar_invite_sent,
    ma.responded_at,
    ma.created_at
  FROM public.meeting_attendees ma
  WHERE ma.meeting_id = p_meeting_id
  ORDER BY ma.created_at ASC;
END;
$$;

COMMENT ON FUNCTION public.meeting_attendees_list(uuid) IS 'List attendees for a meeting - Inherit meeting access permissions';

COMMIT;
