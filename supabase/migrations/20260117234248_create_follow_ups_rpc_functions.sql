-- Migration: Create RPC functions for follow_ups table
-- Description: Create RPC functions for follow_ups table (follow_ups_create, follow_ups_update, follow_ups_list, follow_ups_get, follow_ups_complete)
-- Date: 2026-01-17
-- Task: 1.1.1.10b
-- Author: Sami (Implementation Compliance Specialist)

BEGIN;

-- ============================================
-- follow_ups_create
-- ============================================

/**
 * RPC Function: follow_ups_create
 * 
 * Purpose: Create new follow-up assignment (MOH Tier 1/2 only)
 * 
 * Module: shared (governance)
 * Security: SECURITY DEFINER
 * 
 * Parameters:
 *   - p_company_id (uuid): Company ID (required)
 *   - p_assigned_to (uuid): User ID to assign follow-up to (required)
 *   - p_priority (text): Priority level (required)
 *   - p_due_date (date): Due date (required)
 *   - p_issue_type (text): Issue type (required)
 *   - p_issue_reference_id (uuid): Issue reference ID (nullable)
 *   - p_issue_reference_table (text): Issue reference table (nullable)
 *   - p_notes (text): Follow-up notes (nullable)
 * 
 * Returns: uuid - Follow-up ID
 * 
 * Business Rules:
 *   - Only MOH Tier 1/2 can create follow-ups
 *   - Validates priority: 'normal', 'high', 'extreme'
 *   - Validates issue_reference_table if provided
 *   - Creates audit log entry
 */
CREATE OR REPLACE FUNCTION public.follow_ups_create(
  p_company_id uuid,
  p_assigned_to uuid,
  p_priority text,
  p_due_date date,
  p_issue_type text,
  p_issue_reference_id uuid DEFAULT NULL,
  p_issue_reference_table text DEFAULT NULL,
  p_notes text DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  follow_up_id uuid;
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
  
  -- Validate only MOH Tier 1/2 can create follow-ups
  IF current_user_role NOT IN ('moh_tier1', 'moh_tier2') THEN
    RAISE EXCEPTION 'Only MOH Tier 1/2 can create follow-ups' USING ERRCODE = 'P0003';
  END IF;
  
  -- Validate required parameters
  IF p_company_id IS NULL OR p_assigned_to IS NULL OR p_priority IS NULL OR p_due_date IS NULL OR p_issue_type IS NULL THEN
    RAISE EXCEPTION 'Missing required parameters: company_id, assigned_to, priority, due_date, and issue_type are required' USING ERRCODE = 'P0002';
  END IF;
  
  -- Validate priority
  IF p_priority NOT IN ('normal', 'high', 'extreme') THEN
    RAISE EXCEPTION 'Invalid priority: must be normal, high, or extreme' USING ERRCODE = 'P0002';
  END IF;
  
  -- Validate issue_reference_table if provided
  IF p_issue_reference_table IS NOT NULL THEN
    IF p_issue_reference_table NOT IN (
      'aams_submissions', 'msq_submissions', 'wsl_submissions',
      'breaches', 'enforcement_actions', 'compliance_scores',
      'registry_submissions', 'export_requests', 'disputes'
    ) THEN
      RAISE EXCEPTION 'Invalid issue_reference_table' USING ERRCODE = 'P0002';
    END IF;
    
    IF p_issue_reference_id IS NULL THEN
      RAISE EXCEPTION 'issue_reference_id is required when issue_reference_table is provided' USING ERRCODE = 'P0002';
    END IF;
  END IF;
  
  -- Create follow-up
  INSERT INTO public.follow_ups (
    company_id,
    assigned_to,
    priority,
    due_date,
    issue_type,
    issue_reference_id,
    issue_reference_table,
    notes,
    status,
    created_by,
    created_at,
    updated_at
  ) VALUES (
    p_company_id,
    p_assigned_to,
    p_priority,
    p_due_date,
    p_issue_type,
    p_issue_reference_id,
    p_issue_reference_table,
    p_notes,
    'pending',
    current_user_id,
    now(),
    now()
  )
  RETURNING id INTO follow_up_id;
  
  -- Create audit log
  PERFORM public.shared_create_audit_log(
    current_user_id,
    'INSERT',
    'follow_ups',
    follow_up_id,
    NULL,
    jsonb_build_object(
      'company_id', p_company_id,
      'assigned_to', p_assigned_to,
      'priority', p_priority,
      'due_date', p_due_date,
      'issue_type', p_issue_type
    ),
    'Follow-up created'
  );
  
  -- Create notification for assigned user
  PERFORM public.shared_create_notification(
    p_assigned_to,
    'follow_up_assigned',
    'New Follow-up Assigned',
    'You have been assigned a new follow-up: ' || p_issue_type,
    '/dashboard/follow-ups/' || follow_up_id::text
  );
  
  RETURN follow_up_id;
END;
$$;

COMMENT ON FUNCTION public.follow_ups_create(uuid, uuid, text, date, text, uuid, text, text) IS 'Create new follow-up assignment - MOH Tier 1/2 only';

-- ============================================
-- follow_ups_update
-- ============================================

/**
 * RPC Function: follow_ups_update
 * 
 * Purpose: Update follow-up details (assigned user, priority, due_date, notes)
 * 
 * Module: shared (governance)
 * Security: SECURITY DEFINER
 * 
 * Parameters:
 *   - p_follow_up_id (uuid): Follow-up ID (required)
 *   - p_assigned_to (uuid): New assigned user ID (nullable)
 *   - p_priority (text): New priority (nullable)
 *   - p_due_date (date): New due date (nullable)
 *   - p_notes (text): Follow-up notes (nullable)
 * 
 * Returns: boolean - Success indicator
 * 
 * Business Rules:
 *   - MOH Tier 1/2 can update any follow-up
 *   - Users can update follow-ups assigned to them (self-service)
 *   - Validates priority and status values
 *   - Creates audit log entry
 */
CREATE OR REPLACE FUNCTION public.follow_ups_update(
  p_follow_up_id uuid,
  p_assigned_to uuid DEFAULT NULL,
  p_priority text DEFAULT NULL,
  p_due_date date DEFAULT NULL,
  p_notes text DEFAULT NULL
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_user_id uuid;
  current_user_role text;
  follow_up_record RECORD;
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
  
  -- Get follow-up
  SELECT * INTO follow_up_record
  FROM public.follow_ups
  WHERE id = p_follow_up_id;
  
  IF follow_up_record IS NULL THEN
    RAISE EXCEPTION 'Follow-up not found' USING ERRCODE = 'P0001';
  END IF;
  
  -- Validate permissions
  IF current_user_role NOT IN ('moh_tier1', 'moh_tier2') AND follow_up_record.assigned_to != current_user_id THEN
    RAISE EXCEPTION 'Cannot update follow-up - user is not assigned to this follow-up' USING ERRCODE = 'P0003';
  END IF;
  
  -- Validate priority if provided
  IF p_priority IS NOT NULL AND p_priority NOT IN ('normal', 'high', 'extreme') THEN
    RAISE EXCEPTION 'Invalid priority: must be normal, high, or extreme' USING ERRCODE = 'P0002';
  END IF;
  
  -- Build old values for audit log
  old_values := jsonb_build_object(
    'assigned_to', follow_up_record.assigned_to,
    'priority', follow_up_record.priority,
    'due_date', follow_up_record.due_date,
    'notes', follow_up_record.notes
  );
  
  -- Update follow-up
  UPDATE public.follow_ups
  SET 
    assigned_to = COALESCE(p_assigned_to, assigned_to),
    priority = COALESCE(p_priority, priority),
    due_date = COALESCE(p_due_date, due_date),
    notes = COALESCE(p_notes, notes),
    updated_at = now()
  WHERE id = p_follow_up_id;
  
  -- Create notification if assigned_to changed
  IF p_assigned_to IS NOT NULL AND p_assigned_to != follow_up_record.assigned_to THEN
    PERFORM public.shared_create_notification(
      p_assigned_to,
      'follow_up_assigned',
      'Follow-up Reassigned',
      'You have been assigned a follow-up: ' || follow_up_record.issue_type,
      '/dashboard/follow-ups/' || p_follow_up_id::text
    );
  END IF;
  
  -- Create audit log
  PERFORM public.shared_create_audit_log(
    current_user_id,
    'UPDATE',
    'follow_ups',
    p_follow_up_id,
    old_values,
    jsonb_build_object(
      'assigned_to', COALESCE(p_assigned_to, follow_up_record.assigned_to),
      'priority', COALESCE(p_priority, follow_up_record.priority),
      'due_date', COALESCE(p_due_date, follow_up_record.due_date),
      'notes', COALESCE(p_notes, follow_up_record.notes)
    ),
    'Follow-up updated'
  );
  
  RETURN true;
END;
$$;

COMMENT ON FUNCTION public.follow_ups_update(uuid, uuid, text, date, text) IS 'Update follow-up details - MOH Tier 1/2 can update any, users can update assigned to them';

-- ============================================
-- follow_ups_list
-- ============================================

/**
 * RPC Function: follow_ups_list
 * 
 * Purpose: List follow-ups (role-based: MOH see all, company users see company-scoped)
 * 
 * Module: shared (governance)
 * Security: SECURITY DEFINER
 * 
 * Parameters:
 *   - p_status (text): Filter by status (nullable)
 *   - p_priority (text): Filter by priority (nullable)
 *   - p_company_id (uuid): Filter by company ID (nullable, MOH only)
 *   - p_assigned_to (uuid): Filter by assigned user (nullable)
 *   - p_limit (integer): Limit results (default: 100)
 *   - p_offset (integer): Offset for pagination (default: 0)
 * 
 * Returns: TABLE - Follow-ups list
 * 
 * Business Rules:
 *   - MOH Tier 1/2 see all follow-ups
 *   - Company users see follow-ups for their company only
 *   - Results ordered by due_date ASC, priority DESC
 */
CREATE OR REPLACE FUNCTION public.follow_ups_list(
  p_status text DEFAULT NULL,
  p_priority text DEFAULT NULL,
  p_company_id uuid DEFAULT NULL,
  p_assigned_to uuid DEFAULT NULL,
  p_limit integer DEFAULT 100,
  p_offset integer DEFAULT 0
)
RETURNS TABLE (
  id uuid,
  company_id uuid,
  assigned_to uuid,
  priority text,
  due_date date,
  issue_type text,
  issue_reference_id uuid,
  issue_reference_table text,
  notes text,
  status text,
  completed_at timestamptz,
  completed_by uuid,
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
  IF p_status IS NOT NULL AND p_status NOT IN ('pending', 'in_progress', 'completed', 'cancelled') THEN
    RAISE EXCEPTION 'Invalid status filter' USING ERRCODE = 'P0002';
  END IF;
  
  -- Validate priority filter if provided
  IF p_priority IS NOT NULL AND p_priority NOT IN ('normal', 'high', 'extreme') THEN
    RAISE EXCEPTION 'Invalid priority filter' USING ERRCODE = 'P0002';
  END IF;
  
  -- Return filtered results
  RETURN QUERY
  SELECT 
    f.id,
    f.company_id,
    f.assigned_to,
    f.priority,
    f.due_date,
    f.issue_type,
    f.issue_reference_id,
    f.issue_reference_table,
    f.notes,
    f.status,
    f.completed_at,
    f.completed_by,
    f.created_by,
    f.created_at,
    f.updated_at
  FROM public.follow_ups f
  WHERE (
    -- MOH users see all follow-ups
    (current_user_role IN ('moh_tier1', 'moh_tier2'))
    OR
    -- Company users see follow-ups for their company
    (current_user_company_id IS NOT NULL AND f.company_id = current_user_company_id)
  )
  AND (p_status IS NULL OR f.status = p_status)
  AND (p_priority IS NULL OR f.priority = p_priority)
  AND (p_company_id IS NULL OR (current_user_role IN ('moh_tier1', 'moh_tier2') AND f.company_id = p_company_id))
  AND (p_assigned_to IS NULL OR f.assigned_to = p_assigned_to)
  ORDER BY f.due_date ASC, 
    CASE f.priority 
      WHEN 'extreme' THEN 1
      WHEN 'high' THEN 2
      WHEN 'normal' THEN 3
    END ASC
  LIMIT p_limit
  OFFSET p_offset;
END;
$$;

COMMENT ON FUNCTION public.follow_ups_list(text, text, uuid, uuid, integer, integer) IS 'List follow-ups - Role-based: MOH see all, company users see company-scoped';

-- ============================================
-- follow_ups_get
-- ============================================

/**
 * RPC Function: follow_ups_get
 * 
 * Purpose: Get single follow-up by ID
 * 
 * Module: shared (governance)
 * Security: SECURITY DEFINER
 * 
 * Parameters:
 *   - p_follow_up_id (uuid): Follow-up ID (required)
 * 
 * Returns: jsonb - Follow-up record
 * 
 * Business Rules:
 *   - MOH Tier 1/2 can see any follow-up
 *   - Company users can see follow-ups for their company
 *   - Users can see follow-ups assigned to them
 */
CREATE OR REPLACE FUNCTION public.follow_ups_get(
  p_follow_up_id uuid
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
  follow_up_record RECORD;
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
  
  -- Get follow-up
  SELECT * INTO follow_up_record
  FROM public.follow_ups
  WHERE id = p_follow_up_id;
  
  IF follow_up_record IS NULL THEN
    RAISE EXCEPTION 'Follow-up not found' USING ERRCODE = 'P0001';
  END IF;
  
  -- Validate access
  IF current_user_role NOT IN ('moh_tier1', 'moh_tier2') 
    AND follow_up_record.company_id != current_user_company_id
    AND follow_up_record.assigned_to != current_user_id THEN
    RAISE EXCEPTION 'Access denied' USING ERRCODE = 'P0003';
  END IF;
  
  -- Return follow-up as JSONB
  RETURN to_jsonb(follow_up_record);
END;
$$;

COMMENT ON FUNCTION public.follow_ups_get(uuid) IS 'Get single follow-up by ID - Role-based access control';

-- ============================================
-- follow_ups_complete
-- ============================================

/**
 * RPC Function: follow_ups_complete
 * 
 * Purpose: Mark follow-up as completed (set status, completed_at, completed_by)
 * 
 * Module: shared (governance)
 * Security: SECURITY DEFINER
 * 
 * Parameters:
 *   - p_follow_up_id (uuid): Follow-up ID (required)
 * 
 * Returns: boolean - Success indicator
 * 
 * Business Rules:
 *   - Only assigned user or MOH Tier 1/2 can mark as completed
 *   - Sets status = 'completed', completed_at = now(), completed_by = current_user_id
 *   - Creates audit log entry
 */
CREATE OR REPLACE FUNCTION public.follow_ups_complete(
  p_follow_up_id uuid
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_user_id uuid;
  current_user_role text;
  follow_up_record RECORD;
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
  
  -- Get follow-up
  SELECT * INTO follow_up_record
  FROM public.follow_ups
  WHERE id = p_follow_up_id;
  
  IF follow_up_record IS NULL THEN
    RAISE EXCEPTION 'Follow-up not found' USING ERRCODE = 'P0001';
  END IF;
  
  -- Validate permissions
  IF current_user_role NOT IN ('moh_tier1', 'moh_tier2') AND follow_up_record.assigned_to != current_user_id THEN
    RAISE EXCEPTION 'Cannot complete follow-up - user is not assigned to this follow-up' USING ERRCODE = 'P0003';
  END IF;
  
  -- Validate status
  IF follow_up_record.status = 'completed' THEN
    RAISE EXCEPTION 'Follow-up is already completed' USING ERRCODE = 'P0002';
  END IF;
  
  IF follow_up_record.status = 'cancelled' THEN
    RAISE EXCEPTION 'Cannot complete cancelled follow-up' USING ERRCODE = 'P0002';
  END IF;
  
  -- Mark as completed
  UPDATE public.follow_ups
  SET 
    status = 'completed',
    completed_at = now(),
    completed_by = current_user_id,
    updated_at = now()
  WHERE id = p_follow_up_id;
  
  -- Create audit log
  PERFORM public.shared_create_audit_log(
    current_user_id,
    'UPDATE',
    'follow_ups',
    p_follow_up_id,
    jsonb_build_object('status', follow_up_record.status),
    jsonb_build_object('status', 'completed', 'completed_at', now(), 'completed_by', current_user_id),
    'Follow-up marked as completed'
  );
  
  RETURN true;
END;
$$;

COMMENT ON FUNCTION public.follow_ups_complete(uuid) IS 'Mark follow-up as completed - Sets status, completed_at, completed_by';

COMMIT;
