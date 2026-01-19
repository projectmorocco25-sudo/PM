-- Migration: Create RPC functions for meetings table
-- Description: Create RPC functions for meetings table (meetings_create, meetings_update, meetings_list, meetings_get, meetings_cancel, meetings_complete)
-- Date: 2026-01-17
-- Task: 1.1.1.10c
-- Author: Sami (Implementation Compliance Specialist)

BEGIN;

-- ============================================
-- meetings_create
-- ============================================

/**
 * RPC Function: meetings_create
 * 
 * Purpose: Create new meeting (MOH Tier 1/2 only)
 * 
 * Module: shared (governance)
 * Security: SECURITY DEFINER
 * 
 * Parameters:
 *   - p_title (text): Meeting title (required)
 *   - p_meeting_type (text): Meeting type (required)
 *   - p_scheduled_at (timestamptz): Scheduled date and time (required)
 *   - p_location (text): Meeting location (nullable)
 *   - p_agenda (text): Meeting agenda (nullable)
 *   - p_reason (text): Reason for meeting (nullable)
 *   - p_related_reference_id (uuid): Related entity ID (nullable)
 *   - p_related_reference_table (text): Related entity table (nullable)
 * 
 * Returns: uuid - Meeting ID
 * 
 * Business Rules:
 *   - Only MOH Tier 1/2 can create meetings
 *   - Validates meeting_type: 'emergency', 'scheduled', 'follow_up'
 *   - Validates related_reference_table if provided
 *   - Creates audit log entry
 */
CREATE OR REPLACE FUNCTION public.meetings_create(
  p_title text,
  p_meeting_type text,
  p_scheduled_at timestamptz,
  p_location text DEFAULT NULL,
  p_agenda text DEFAULT NULL,
  p_reason text DEFAULT NULL,
  p_related_reference_id uuid DEFAULT NULL,
  p_related_reference_table text DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  meeting_id uuid;
  current_user_id uuid;
  current_user_role text;
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
  
  -- Validate only MOH Tier 1/2 can create meetings
  IF current_user_role NOT IN ('moh_tier1', 'moh_tier2') THEN
    RAISE EXCEPTION 'Only MOH Tier 1/2 can create meetings' USING ERRCODE = 'P0003';
  END IF;
  
  -- Validate required parameters
  IF p_title IS NULL OR trim(p_title) = '' OR p_meeting_type IS NULL OR p_scheduled_at IS NULL THEN
    RAISE EXCEPTION 'Missing required parameters: title, meeting_type, and scheduled_at are required' USING ERRCODE = 'P0002';
  END IF;
  
  -- Validate meeting_type
  IF p_meeting_type NOT IN ('emergency', 'scheduled', 'follow_up') THEN
    RAISE EXCEPTION 'Invalid meeting_type: must be emergency, scheduled, or follow_up' USING ERRCODE = 'P0002';
  END IF;
  
  -- Validate related_reference_table if provided
  IF p_related_reference_table IS NOT NULL THEN
    IF p_related_reference_table NOT IN (
      'companies', 'aams_submissions', 'msq_submissions', 'wsl_submissions',
      'breaches', 'enforcement_actions', 'compliance_scores',
      'registry_submissions', 'export_requests', 'disputes', 'follow_ups'
    ) THEN
      RAISE EXCEPTION 'Invalid related_reference_table' USING ERRCODE = 'P0002';
    END IF;
    
    IF p_related_reference_id IS NULL THEN
      RAISE EXCEPTION 'related_reference_id is required when related_reference_table is provided' USING ERRCODE = 'P0002';
    END IF;
  END IF;
  
  -- Create meeting
  INSERT INTO public.meetings (
    title,
    meeting_type,
    scheduled_at,
    location,
    agenda,
    reason,
    related_reference_id,
    related_reference_table,
    status,
    created_by,
    created_at,
    updated_at
  ) VALUES (
    p_title,
    p_meeting_type,
    p_scheduled_at,
    p_location,
    p_agenda,
    p_reason,
    p_related_reference_id,
    p_related_reference_table,
    'scheduled',
    current_user_id,
    now(),
    now()
  )
  RETURNING id INTO meeting_id;
  
  -- Create audit log
  PERFORM public.shared_create_audit_log(
    current_user_id,
    'INSERT',
    'meetings',
    meeting_id,
    NULL,
    jsonb_build_object(
      'title', p_title,
      'meeting_type', p_meeting_type,
      'scheduled_at', p_scheduled_at,
      'status', 'scheduled'
    ),
    'Meeting created'
  );
  
  RETURN meeting_id;
END;
$$;

COMMENT ON FUNCTION public.meetings_create(text, text, timestamptz, text, text, text, uuid, text) IS 'Create new meeting - MOH Tier 1/2 only';

-- ============================================
-- meetings_update
-- ============================================

/**
 * RPC Function: meetings_update
 * 
 * Purpose: Update meeting details (title, scheduled_at, location, agenda, reason)
 * 
 * Module: shared (governance)
 * Security: SECURITY DEFINER
 * 
 * Parameters:
 *   - p_meeting_id (uuid): Meeting ID (required)
 *   - p_title (text): New title (nullable)
 *   - p_scheduled_at (timestamptz): New scheduled date/time (nullable)
 *   - p_location (text): New location (nullable)
 *   - p_agenda (text): New agenda (nullable)
 *   - p_reason (text): New reason (nullable)
 * 
 * Returns: boolean - Success indicator
 * 
 * Business Rules:
 *   - Only MOH Tier 1/2 can update meetings
 *   - Cannot update cancelled or completed meetings
 *   - Creates audit log entry
 */
CREATE OR REPLACE FUNCTION public.meetings_update(
  p_meeting_id uuid,
  p_title text DEFAULT NULL,
  p_scheduled_at timestamptz DEFAULT NULL,
  p_location text DEFAULT NULL,
  p_agenda text DEFAULT NULL,
  p_reason text DEFAULT NULL
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_user_id uuid;
  current_user_role text;
  meeting_record RECORD;
  old_values jsonb;
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
  
  -- Validate only MOH Tier 1/2 can update meetings
  IF current_user_role NOT IN ('moh_tier1', 'moh_tier2') THEN
    RAISE EXCEPTION 'Only MOH Tier 1/2 can update meetings' USING ERRCODE = 'P0003';
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
    RAISE EXCEPTION 'Cannot update cancelled or completed meeting' USING ERRCODE = 'P0002';
  END IF;
  
  -- Build old values for audit log
  old_values := jsonb_build_object(
    'title', meeting_record.title,
    'scheduled_at', meeting_record.scheduled_at,
    'location', meeting_record.location,
    'agenda', meeting_record.agenda,
    'reason', meeting_record.reason
  );
  
  -- Update meeting
  UPDATE public.meetings
  SET 
    title = COALESCE(p_title, title),
    scheduled_at = COALESCE(p_scheduled_at, scheduled_at),
    location = COALESCE(p_location, location),
    agenda = COALESCE(p_agenda, agenda),
    reason = COALESCE(p_reason, reason),
    updated_at = now()
  WHERE id = p_meeting_id;
  
  -- Create audit log
  PERFORM public.shared_create_audit_log(
    current_user_id,
    'UPDATE',
    'meetings',
    p_meeting_id,
    old_values,
    jsonb_build_object(
      'title', COALESCE(p_title, meeting_record.title),
      'scheduled_at', COALESCE(p_scheduled_at, meeting_record.scheduled_at),
      'location', COALESCE(p_location, meeting_record.location),
      'agenda', COALESCE(p_agenda, meeting_record.agenda),
      'reason', COALESCE(p_reason, meeting_record.reason)
    ),
    'Meeting updated'
  );
  
  RETURN true;
END;
$$;

COMMENT ON FUNCTION public.meetings_update(uuid, text, timestamptz, text, text, text) IS 'Update meeting details - MOH Tier 1/2 only';

-- ============================================
-- meetings_list
-- ============================================

/**
 * RPC Function: meetings_list
 * 
 * Purpose: List meetings (role-based: MOH see all, company users see related meetings)
 * 
 * Module: shared (governance)
 * Security: SECURITY DEFINER
 * 
 * Parameters:
 *   - p_status (text): Filter by status (nullable)
 *   - p_meeting_type (text): Filter by meeting type (nullable)
 *   - p_company_id (uuid): Filter by company ID (nullable, MOH only)
 *   - p_upcoming_only (boolean): Show only upcoming meetings (default: false)
 *   - p_limit (integer): Limit results (default: 100)
 *   - p_offset (integer): Offset for pagination (default: 0)
 * 
 * Returns: TABLE - Meetings list
 * 
 * Business Rules:
 *   - MOH Tier 1/2 see all meetings
 *   - Company users see meetings where they are attendees OR meetings related to their company
 *   - Results ordered by scheduled_at ASC
 */
CREATE OR REPLACE FUNCTION public.meetings_list(
  p_status text DEFAULT NULL,
  p_meeting_type text DEFAULT NULL,
  p_company_id uuid DEFAULT NULL,
  p_upcoming_only boolean DEFAULT false,
  p_limit integer DEFAULT 100,
  p_offset integer DEFAULT 0
)
RETURNS TABLE (
  id uuid,
  title text,
  meeting_type text,
  scheduled_at timestamptz,
  location text,
  agenda text,
  reason text,
  related_reference_id uuid,
  related_reference_table text,
  status text,
  cancelled_at timestamptz,
  cancelled_by uuid,
  created_by uuid,
  created_at timestamptz,
  updated_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
DECLARE
  current_user_id uuid;
  current_user_role text;
  current_user_company_id uuid;
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
  
  -- Validate status filter if provided
  IF p_status IS NOT NULL AND p_status NOT IN ('scheduled', 'cancelled', 'completed') THEN
    RAISE EXCEPTION 'Invalid status filter' USING ERRCODE = 'P0002';
  END IF;
  
  -- Validate meeting_type filter if provided
  IF p_meeting_type IS NOT NULL AND p_meeting_type NOT IN ('emergency', 'scheduled', 'follow_up') THEN
    RAISE EXCEPTION 'Invalid meeting_type filter' USING ERRCODE = 'P0002';
  END IF;
  
  -- Return filtered results
  RETURN QUERY
  SELECT 
    m.id,
    m.title,
    m.meeting_type,
    m.scheduled_at,
    m.location,
    m.agenda,
    m.reason,
    m.related_reference_id,
    m.related_reference_table,
    m.status,
    m.cancelled_at,
    m.cancelled_by,
    m.created_by,
    m.created_at,
    m.updated_at
  FROM public.meetings m
  WHERE (
    -- MOH users see all meetings
    (current_user_role IN ('moh_tier1', 'moh_tier2'))
    OR
    -- Company users see meetings where they are attendees
    EXISTS (
      SELECT 1 FROM public.meeting_attendees ma
      WHERE ma.meeting_id = m.id
      AND ma.user_id = current_user_id
    )
    OR
    -- Company users see meetings related to their company
    (
      current_user_company_id IS NOT NULL
      AND m.related_reference_table = 'companies'
      AND m.related_reference_id = current_user_company_id::text::uuid
    )
  )
  AND (p_status IS NULL OR m.status = p_status)
  AND (p_meeting_type IS NULL OR m.meeting_type = p_meeting_type)
  AND (p_company_id IS NULL OR (current_user_role IN ('moh_tier1', 'moh_tier2') AND m.related_reference_id = p_company_id::text::uuid AND m.related_reference_table = 'companies'))
  AND (NOT p_upcoming_only OR (m.scheduled_at >= now() AND m.status = 'scheduled'))
  ORDER BY m.scheduled_at ASC
  LIMIT p_limit
  OFFSET p_offset;
END;
$$;

COMMENT ON FUNCTION public.meetings_list(text, text, uuid, boolean, integer, integer) IS 'List meetings - Role-based: MOH see all, company users see related meetings';

-- ============================================
-- meetings_get
-- ============================================

/**
 * RPC Function: meetings_get
 * 
 * Purpose: Get single meeting by ID with attendees
 * 
 * Module: shared (governance)
 * Security: SECURITY DEFINER
 * 
 * Parameters:
 *   - p_meeting_id (uuid): Meeting ID (required)
 * 
 * Returns: jsonb - Meeting record with attendees array
 * 
 * Business Rules:
 *   - MOH Tier 1/2 can see any meeting
 *   - Company users can see meetings where they are attendees OR meetings related to their company
 */
CREATE OR REPLACE FUNCTION public.meetings_get(
  p_meeting_id uuid
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
DECLARE
  current_user_id uuid;
  current_user_role text;
  current_user_company_id uuid;
  meeting_record RECORD;
  attendees jsonb;
  result jsonb;
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
  
  -- Get attendees
  SELECT jsonb_agg(
    jsonb_build_object(
      'id', ma.id,
      'user_id', ma.user_id,
      'attendance_status', ma.attendance_status,
      'calendar_invite_sent', ma.calendar_invite_sent,
      'responded_at', ma.responded_at
    )
  ) INTO attendees
  FROM public.meeting_attendees ma
  WHERE ma.meeting_id = p_meeting_id;
  
  -- Build result
  result := jsonb_build_object(
    'id', meeting_record.id,
    'title', meeting_record.title,
    'meeting_type', meeting_record.meeting_type,
    'scheduled_at', meeting_record.scheduled_at,
    'location', meeting_record.location,
    'agenda', meeting_record.agenda,
    'reason', meeting_record.reason,
    'related_reference_id', meeting_record.related_reference_id,
    'related_reference_table', meeting_record.related_reference_table,
    'status', meeting_record.status,
    'cancelled_at', meeting_record.cancelled_at,
    'cancelled_by', meeting_record.cancelled_by,
    'created_by', meeting_record.created_by,
    'created_at', meeting_record.created_at,
    'updated_at', meeting_record.updated_at,
    'attendees', COALESCE(attendees, '[]'::jsonb)
  );
  
  RETURN result;
END;
$$;

COMMENT ON FUNCTION public.meetings_get(uuid) IS 'Get single meeting by ID with attendees - Role-based access control';

-- ============================================
-- meetings_cancel
-- ============================================

/**
 * RPC Function: meetings_cancel
 * 
 * Purpose: Cancel meeting (set status, cancelled_at, cancelled_by)
 * 
 * Module: shared (governance)
 * Security: SECURITY DEFINER
 * 
 * Parameters:
 *   - p_meeting_id (uuid): Meeting ID (required)
 * 
 * Returns: boolean - Success indicator
 * 
 * Business Rules:
 *   - Only MOH Tier 1/2 can cancel meetings
 *   - Cannot cancel already cancelled or completed meetings
 *   - Creates audit log entry
 */
CREATE OR REPLACE FUNCTION public.meetings_cancel(
  p_meeting_id uuid
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_user_id uuid;
  current_user_role text;
  meeting_record RECORD;
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
  
  -- Validate only MOH Tier 1/2 can cancel meetings
  IF current_user_role NOT IN ('moh_tier1', 'moh_tier2') THEN
    RAISE EXCEPTION 'Only MOH Tier 1/2 can cancel meetings' USING ERRCODE = 'P0003';
  END IF;
  
  -- Get meeting
  SELECT * INTO meeting_record
  FROM public.meetings
  WHERE id = p_meeting_id;
  
  IF meeting_record IS NULL THEN
    RAISE EXCEPTION 'Meeting not found' USING ERRCODE = 'P0001';
  END IF;
  
  -- Validate status
  IF meeting_record.status = 'cancelled' THEN
    RAISE EXCEPTION 'Meeting is already cancelled' USING ERRCODE = 'P0002';
  END IF;
  
  IF meeting_record.status = 'completed' THEN
    RAISE EXCEPTION 'Cannot cancel completed meeting' USING ERRCODE = 'P0002';
  END IF;
  
  -- Cancel meeting
  UPDATE public.meetings
  SET 
    status = 'cancelled',
    cancelled_at = now(),
    cancelled_by = current_user_id,
    updated_at = now()
  WHERE id = p_meeting_id;
  
  -- Create audit log
  PERFORM public.shared_create_audit_log(
    current_user_id,
    'UPDATE',
    'meetings',
    p_meeting_id,
    jsonb_build_object('status', meeting_record.status),
    jsonb_build_object('status', 'cancelled', 'cancelled_at', now(), 'cancelled_by', current_user_id),
    'Meeting cancelled'
  );
  
  -- Notify attendees
  PERFORM public.shared_create_notification(
    ma.user_id,
    'meeting_cancelled',
    'Meeting Cancelled',
    'Meeting "' || meeting_record.title || '" has been cancelled',
    '/dashboard/meetings/' || p_meeting_id::text
  )
  FROM public.meeting_attendees ma
  WHERE ma.meeting_id = p_meeting_id;
  
  RETURN true;
END;
$$;

COMMENT ON FUNCTION public.meetings_cancel(uuid) IS 'Cancel meeting - Sets status, cancelled_at, cancelled_by, notifies attendees';

-- ============================================
-- meetings_complete
-- ============================================

/**
 * RPC Function: meetings_complete
 * 
 * Purpose: Mark meeting as completed (set status)
 * 
 * Module: shared (governance)
 * Security: SECURITY DEFINER
 * 
 * Parameters:
 *   - p_meeting_id (uuid): Meeting ID (required)
 * 
 * Returns: boolean - Success indicator
 * 
 * Business Rules:
 *   - Only MOH Tier 1/2 can mark meetings as completed
 *   - Cannot complete already cancelled or completed meetings
 *   - Creates audit log entry
 */
CREATE OR REPLACE FUNCTION public.meetings_complete(
  p_meeting_id uuid
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_user_id uuid;
  current_user_role text;
  meeting_record RECORD;
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
  
  -- Validate only MOH Tier 1/2 can complete meetings
  IF current_user_role NOT IN ('moh_tier1', 'moh_tier2') THEN
    RAISE EXCEPTION 'Only MOH Tier 1/2 can complete meetings' USING ERRCODE = 'P0003';
  END IF;
  
  -- Get meeting
  SELECT * INTO meeting_record
  FROM public.meetings
  WHERE id = p_meeting_id;
  
  IF meeting_record IS NULL THEN
    RAISE EXCEPTION 'Meeting not found' USING ERRCODE = 'P0001';
  END IF;
  
  -- Validate status
  IF meeting_record.status = 'completed' THEN
    RAISE EXCEPTION 'Meeting is already completed' USING ERRCODE = 'P0002';
  END IF;
  
  IF meeting_record.status = 'cancelled' THEN
    RAISE EXCEPTION 'Cannot complete cancelled meeting' USING ERRCODE = 'P0002';
  END IF;
  
  -- Mark as completed
  UPDATE public.meetings
  SET 
    status = 'completed',
    updated_at = now()
  WHERE id = p_meeting_id;
  
  -- Create audit log
  PERFORM public.shared_create_audit_log(
    current_user_id,
    'UPDATE',
    'meetings',
    p_meeting_id,
    jsonb_build_object('status', meeting_record.status),
    jsonb_build_object('status', 'completed'),
    'Meeting marked as completed'
  );
  
  RETURN true;
END;
$$;

COMMENT ON FUNCTION public.meetings_complete(uuid) IS 'Mark meeting as completed - Sets status to completed';

COMMIT;
