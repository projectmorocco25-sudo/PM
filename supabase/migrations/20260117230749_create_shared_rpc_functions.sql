-- Migration: Create shared RPC functions
-- Description: Implement shared RPC functions (shared_get_user_permissions, shared_check_module_active, shared_create_audit_log, shared_create_notification)
-- Date: 2026-01-17
-- Task: 1.1.1.4a, 1.1.1.4b, 1.1.1.4c, 1.1.1.4d
-- Author: Sami (Implementation Compliance Specialist)

BEGIN;

-- ============================================
-- shared_get_user_permissions
-- ============================================

/**
 * RPC Function: shared_get_user_permissions
 * 
 * Purpose: Get user permissions based on role
 * 
 * Module: shared
 * Security: SECURITY DEFINER
 * 
 * Parameters:
 *   - user_id (uuid): User ID (required)
 * 
 * Returns: jsonb - Permission object with role-based permissions
 * 
 * Business Rules:
 *   - Permissions are derived from user role in users table
 *   - Role must exist in users table
 *   - Returns permissions matrix based on approvals-authority-matrix.md
 * 
 * Error Cases:
 *   - NOT_FOUND: User not found in users table
 */
CREATE OR REPLACE FUNCTION public.shared_get_user_permissions(user_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
DECLARE
  user_role text;
  user_company_id uuid;
  permissions jsonb;
BEGIN
  -- Get user role and company_id
  SELECT role, company_id INTO user_role, user_company_id
  FROM public.users
  WHERE id = user_id;
  
  IF user_role IS NULL THEN
    RAISE EXCEPTION 'User not found' USING ERRCODE = 'P0001';
  END IF;
  
  -- Build permissions object based on role
  -- Simplified permissions structure - full matrix implementation in subsequent updates
  -- For Phase 1.1.1, we'll return a basic structure that can be extended
  
  permissions := jsonb_build_object(
    'user_id', user_id,
    'role', user_role,
    'company_id', user_company_id,
    'is_moh', (user_company_id IS NULL),
    'permissions', jsonb_build_object(
      'registry_management', CASE
        WHEN user_role = 'moh_tier1' THEN 'full_access'
        WHEN user_role = 'moh_tier2' THEN 'verify_implement'
        WHEN user_role = 'company_user' THEN 'submit'
        ELSE 'read_only'
      END,
      'submissions', CASE
        WHEN user_role IN ('moh_tier1', 'moh_tier2') THEN 'verify_approve'
        WHEN user_role = 'company_user' THEN 'submit'
        ELSE 'read_only'
      END,
      'enforcement', CASE
        WHEN user_role = 'moh_tier1' THEN 'full_access'
        WHEN user_role = 'moh_tier2' THEN 'create_review'
        ELSE 'read_only'
      END,
      'system_config', CASE
        WHEN user_role = 'moh_tier1' THEN 'full_access'
        ELSE 'read_only'
      END
    )
  );
  
  RETURN permissions;
END;
$$;

COMMENT ON FUNCTION public.shared_get_user_permissions(uuid) IS 'Get user permissions based on role - Returns permission matrix from approvals-authority-matrix.md';

-- ============================================
-- shared_check_module_active
-- ============================================

/**
 * RPC Function: shared_check_module_active
 * 
 * Purpose: Check if module is active
 * 
 * Module: shared
 * Security: SECURITY DEFINER
 * 
 * Parameters:
 *   - module_name (text): Module name (rmm, vci, ecs, cmc) (required)
 * 
 * Returns: boolean - True if module is active, false otherwise
 * 
 * Business Rules:
 *   - Module must exist in system_config table
 *   - Returns is_active value from system_config
 *   - Returns false if module doesn't exist
 * 
 * Error Cases:
 *   - None - Returns false for invalid module names
 */
CREATE OR REPLACE FUNCTION public.shared_check_module_active(module_name text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
DECLARE
  module_active boolean;
BEGIN
  SELECT is_active INTO module_active
  FROM public.system_config
  WHERE module_name = shared_check_module_active.module_name;
  
  RETURN COALESCE(module_active, false);
END;
$$;

COMMENT ON FUNCTION public.shared_check_module_active(text) IS 'Check if module is active - Returns is_active status from system_config table';

-- ============================================
-- shared_create_audit_log
-- ============================================

/**
 * RPC Function: shared_create_audit_log
 * 
 * Purpose: Create audit log entry with hash chaining
 * 
 * Module: shared
 * Security: SECURITY DEFINER
 * 
 * Parameters:
 *   - p_user_id (uuid): User ID (nullable for system operations)
 *   - p_operation_type (text): Operation type (INSERT, UPDATE, DELETE, etc.)
 *   - p_table_name (text): Table name
 *   - p_record_id (uuid): Record ID (nullable)
 *   - p_old_values (jsonb): Old values (nullable)
 *   - p_new_values (jsonb): New values (nullable)
 *   - p_reason (text): Reason/justification (nullable)
 *   - p_ip_address (inet): IP address (nullable)
 *   - p_user_agent (text): User agent (nullable)
 * 
 * Returns: uuid - Audit log ID
 * 
 * Business Rules:
 *   - Calculates previous_hash from most recent audit log entry for the same table
 *   - Generates current_hash using SHA256(previous_hash + entry_data)
 *   - First entry for a table has previous_hash = NULL
 * 
 * Error Cases:
 *   - VALIDATION_ERROR: Missing required parameters
 */
CREATE OR REPLACE FUNCTION public.shared_create_audit_log(
  p_user_id uuid,
  p_operation_type text,
  p_table_name text,
  p_record_id uuid DEFAULT NULL,
  p_old_values jsonb DEFAULT NULL,
  p_new_values jsonb DEFAULT NULL,
  p_reason text DEFAULT NULL,
  p_ip_address inet DEFAULT NULL,
  p_user_agent text DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  previous_hash text;
  entry_data jsonb;
  current_hash text;
  log_id uuid;
BEGIN
  -- Validate required parameters
  IF p_operation_type IS NULL OR p_table_name IS NULL THEN
    RAISE EXCEPTION 'Missing required parameters: operation_type and table_name are required' USING ERRCODE = 'P0002';
  END IF;
  
  -- Get previous hash (most recent entry for this table)
  SELECT current_hash INTO previous_hash
  FROM public.audit_logs
  WHERE table_name = p_table_name
  ORDER BY created_at DESC
  LIMIT 1;
  
  -- Build entry data for hash calculation
  entry_data := jsonb_build_object(
    'table_name', p_table_name,
    'record_id', p_record_id,
    'operation_type', p_operation_type,
    'old_values', p_old_values,
    'new_values', p_new_values,
    'timestamp', extract(epoch from now())
  );
  
  -- Calculate current hash: SHA256(previous_hash + entry_data)
  -- Using NULL for previous_hash if this is the first entry
  current_hash := encode(
    digest(
      COALESCE(previous_hash, '') || entry_data::text,
      'sha256'
    ),
    'hex'
  );
  
  -- Insert audit log entry
  INSERT INTO public.audit_logs (
    previous_hash,
    current_hash,
    user_id,
    operation_type,
    table_name,
    record_id,
    old_values,
    new_values,
    reason,
    ip_address,
    user_agent,
    created_at
  ) VALUES (
    previous_hash,
    current_hash,
    p_user_id,
    p_operation_type,
    p_table_name,
    p_record_id,
    p_old_values,
    p_new_values,
    p_reason,
    p_ip_address,
    p_user_agent,
    now()
  )
  RETURNING id INTO log_id;
  
  RETURN log_id;
END;
$$;

COMMENT ON FUNCTION public.shared_create_audit_log(uuid, text, text, uuid, jsonb, jsonb, text, inet, text) IS 'Create audit log entry with hash chaining - Implements hash chaining for immutability per audit-logging-spec.md';

-- ============================================
-- shared_create_notification
-- ============================================

/**
 * RPC Function: shared_create_notification
 * 
 * Purpose: Create in-app notification
 * 
 * Module: shared
 * Security: SECURITY DEFINER
 * 
 * Parameters:
 *   - p_user_id (uuid): Recipient user ID (required)
 *   - p_type (text): Notification type (required)
 *   - p_title (text): Notification title (required)
 *   - p_message (text): Notification message (required)
 *   - p_link (text): Link to related entity (nullable)
 * 
 * Returns: uuid - Notification ID
 * 
 * Business Rules:
 *   - User must exist in users table
 *   - Notification is created with is_read = false
 * 
 * Error Cases:
 *   - NOT_FOUND: User not found
 *   - VALIDATION_ERROR: Missing required parameters
 */
CREATE OR REPLACE FUNCTION public.shared_create_notification(
  p_user_id uuid,
  p_type text,
  p_title text,
  p_message text,
  p_link text DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  notification_id uuid;
BEGIN
  -- Validate required parameters
  IF p_user_id IS NULL OR p_type IS NULL OR p_title IS NULL OR p_message IS NULL THEN
    RAISE EXCEPTION 'Missing required parameters: user_id, type, title, and message are required' USING ERRCODE = 'P0002';
  END IF;
  
  -- Verify user exists
  IF NOT EXISTS (SELECT 1 FROM public.users WHERE id = p_user_id) THEN
    RAISE EXCEPTION 'User not found' USING ERRCODE = 'P0001';
  END IF;
  
  -- Insert notification
  INSERT INTO public.notifications (
    user_id,
    type,
    title,
    message,
    link,
    is_read,
    created_at
  ) VALUES (
    p_user_id,
    p_type,
    p_title,
    p_message,
    p_link,
    false,
    now()
  )
  RETURNING id INTO notification_id;
  
  RETURN notification_id;
END;
$$;

COMMENT ON FUNCTION public.shared_create_notification(uuid, text, text, text, text) IS 'Create in-app notification - Creates notification record in notifications table';

COMMIT;
