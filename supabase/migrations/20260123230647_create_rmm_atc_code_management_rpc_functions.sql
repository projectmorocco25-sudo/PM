-- Migration: create_rmm_atc_code_management_rpc_functions
-- Description: Create RMM RPC functions for ATC Code management (MOH only)
-- Date: 2026-01-23
-- Task: 1.1.2.4
-- Author: Sami (Implementation Compliance Specialist)
-- Dependencies: Task 1.1.1.3 (atc_codes table must exist), Task 1.1.1.5 (RLS policies must exist)
-- Access Control: MOH Tier 1 and System Admin can manage, all users can read

BEGIN;

-- ============================================================================
-- rmm_create_atc_code(creator_user_id uuid, code text, description text DEFAULT NULL)
-- Purpose: Create new ATC code (MOH only)
-- Access Control:
--   - MOH Tier 1: Can create ATC codes
--   - System Admin: Can create ATC codes
--   - All other roles: Cannot create
-- Returns: JSON object with created ATC code data
-- ============================================================================

CREATE OR REPLACE FUNCTION rmm_create_atc_code(
    creator_user_id uuid,
    code text,
    description text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_user_record RECORD;
    v_atc_code_id uuid;
    v_atc_code jsonb;
BEGIN
    -- Get user record and verify user exists
    SELECT u.id, u.role, u.is_active
    INTO v_user_record
    FROM users u
    WHERE u.id = creator_user_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'User not found';
    END IF;

    IF NOT v_user_record.is_active THEN
        RAISE EXCEPTION 'User is not active';
    END IF;

    -- Access control: Only MOH Tier 1 and System Admin can create ATC codes
    IF v_user_record.role NOT IN ('tier1', 'system_admin') THEN
        RAISE EXCEPTION 'Insufficient permissions: Only MOH Tier 1 and System Admin can create ATC codes';
    END IF;

    -- Input validation
    IF code IS NULL OR trim(code) = '' THEN
        RAISE EXCEPTION 'ATC code is required';
    END IF;

    -- Check if ATC code already exists
    IF EXISTS (SELECT 1 FROM atc_codes WHERE code = trim(code)) THEN
        RAISE EXCEPTION 'ATC code already exists: %', code;
    END IF;

    -- Create ATC code
    INSERT INTO atc_codes (
        code,
        description,
        is_active
    ) VALUES (
        trim(code),
        description,
        true
    )
    RETURNING id INTO v_atc_code_id;

    -- Get created ATC code
    SELECT jsonb_build_object(
        'id', a.id,
        'code', a.code,
        'description', a.description,
        'is_active', a.is_active,
        'created_at', a.created_at,
        'updated_at', a.updated_at
    )
    INTO v_atc_code
    FROM atc_codes a
    WHERE a.id = v_atc_code_id;

    RETURN v_atc_code;
END;
$$;

-- ============================================================================
-- rmm_update_atc_code(updater_user_id uuid, atc_code_id uuid, code text DEFAULT NULL, description text DEFAULT NULL, is_active boolean DEFAULT NULL)
-- Purpose: Update existing ATC code (MOH only)
-- Access Control:
--   - MOH Tier 1: Can update ATC codes
--   - System Admin: Can update ATC codes
--   - All other roles: Cannot update
-- Returns: JSON object with updated ATC code data
-- ============================================================================

CREATE OR REPLACE FUNCTION rmm_update_atc_code(
    updater_user_id uuid,
    atc_code_id uuid,
    code text DEFAULT NULL,
    description text DEFAULT NULL,
    is_active boolean DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_user_record RECORD;
    v_atc_code jsonb;
BEGIN
    -- Get user record and verify user exists
    SELECT u.id, u.role, u.is_active
    INTO v_user_record
    FROM users u
    WHERE u.id = updater_user_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'User not found';
    END IF;

    IF NOT v_user_record.is_active THEN
        RAISE EXCEPTION 'User is not active';
    END IF;

    -- Access control: Only MOH Tier 1 and System Admin can update ATC codes
    IF v_user_record.role NOT IN ('tier1', 'system_admin') THEN
        RAISE EXCEPTION 'Insufficient permissions: Only MOH Tier 1 and System Admin can update ATC codes';
    END IF;

    -- Verify ATC code exists
    IF NOT EXISTS (SELECT 1 FROM atc_codes WHERE id = atc_code_id) THEN
        RAISE EXCEPTION 'ATC code not found';
    END IF;

    -- Input validation
    IF code IS NOT NULL THEN
        IF trim(code) = '' THEN
            RAISE EXCEPTION 'ATC code cannot be empty';
        END IF;

        -- Check if new code already exists (excluding current ATC code)
        IF EXISTS (
            SELECT 1 FROM atc_codes
            WHERE code = trim(code)
            AND id != atc_code_id
        ) THEN
            RAISE EXCEPTION 'ATC code already exists: %', code;
        END IF;
    END IF;

    -- Update ATC code (only update provided fields)
    UPDATE atc_codes
    SET
        code = COALESCE(trim(code), atc_codes.code),
        description = COALESCE(description, atc_codes.description),
        is_active = COALESCE(is_active, atc_codes.is_active),
        updated_at = now()
    WHERE id = atc_code_id;

    -- Get updated ATC code
    SELECT jsonb_build_object(
        'id', a.id,
        'code', a.code,
        'description', a.description,
        'is_active', a.is_active,
        'created_at', a.created_at,
        'updated_at', a.updated_at
    )
    INTO v_atc_code
    FROM atc_codes a
    WHERE a.id = atc_code_id;

    RETURN v_atc_code;
END;
$$;

-- ============================================================================
-- rmm_get_atc_code(user_id uuid, atc_code_id uuid)
-- Purpose: Get ATC code by ID (read-only for all users)
-- Access Control: All authenticated users can read ATC codes
-- Returns: JSON object with ATC code data
-- ============================================================================

CREATE OR REPLACE FUNCTION rmm_get_atc_code(
    user_id uuid,
    atc_code_id uuid
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_user_record RECORD;
    v_atc_code jsonb;
BEGIN
    -- Get user record and verify user exists
    SELECT u.id, u.role, u.is_active
    INTO v_user_record
    FROM users u
    WHERE u.id = user_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'User not found';
    END IF;

    IF NOT v_user_record.is_active THEN
        RAISE EXCEPTION 'User is not active';
    END IF;

    -- Get ATC code (read-only for all authenticated users)
    SELECT jsonb_build_object(
        'id', a.id,
        'code', a.code,
        'description', a.description,
        'is_active', a.is_active,
        'created_at', a.created_at,
        'updated_at', a.updated_at
    )
    INTO v_atc_code
    FROM atc_codes a
    WHERE a.id = atc_code_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'ATC code not found';
    END IF;

    RETURN v_atc_code;
END;
$$;

-- ============================================================================
-- rmm_list_atc_codes(user_id uuid, page_number integer DEFAULT 1, page_size integer DEFAULT 50, is_active_filter boolean DEFAULT NULL, search_term text DEFAULT NULL, sort_by text DEFAULT 'code', sort_order text DEFAULT 'asc')
-- Purpose: List ATC codes (read-only for all users, MOH can manage)
-- Access Control: All authenticated users can read ATC codes
-- Parameters:
--   - page_number: Page number (1-based)
--   - page_size: Number of items per page (default: 50, max: 100)
--   - is_active_filter: Filter by active status
--   - search_term: Search in code and description
--   - sort_by: Sort field ('code', 'created_at', 'updated_at')
--   - sort_order: Sort order ('asc' or 'desc')
-- Returns: JSON object with ATC codes array, pagination info, and total count
-- ============================================================================

CREATE OR REPLACE FUNCTION rmm_list_atc_codes(
    user_id uuid,
    page_number integer DEFAULT 1,
    page_size integer DEFAULT 50,
    is_active_filter boolean DEFAULT NULL,
    search_term text DEFAULT NULL,
    sort_by text DEFAULT 'code',
    sort_order text DEFAULT 'asc'
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_user_record RECORD;
    v_atc_codes jsonb;
    v_total_count integer;
    v_offset integer;
    v_validated_page_size integer;
    v_validated_sort_by text;
    v_validated_sort_order text;
BEGIN
    -- Get user record and verify user exists
    SELECT u.id, u.role, u.is_active
    INTO v_user_record
    FROM users u
    WHERE u.id = user_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'User not found';
    END IF;

    IF NOT v_user_record.is_active THEN
        RAISE EXCEPTION 'User is not active';
    END IF;

    -- Validate and sanitize inputs
    IF page_number < 1 THEN
        page_number := 1;
    END IF;

    IF page_size < 1 THEN
        page_size := 50;
    ELSIF page_size > 100 THEN
        page_size := 100;
    END IF;

    v_validated_page_size := page_size;
    v_offset := (page_number - 1) * v_validated_page_size;

    -- Validate sort_by
    IF sort_by NOT IN ('code', 'created_at', 'updated_at') THEN
        sort_by := 'code';
    END IF;
    v_validated_sort_by := sort_by;

    -- Validate sort_order
    IF lower(sort_order) NOT IN ('asc', 'desc') THEN
        sort_order := 'asc';
    END IF;
    v_validated_sort_order := lower(sort_order);

    -- First get total count
    SELECT COUNT(*)
    INTO v_total_count
    FROM atc_codes a
    WHERE (is_active_filter IS NULL OR a.is_active = is_active_filter)
    AND (
        search_term IS NULL OR
        a.code ILIKE '%' || search_term || '%' OR
        a.description ILIKE '%' || search_term || '%'
    );

    -- Then get paginated results with proper sorting
    SELECT jsonb_agg(
        jsonb_build_object(
            'id', a.id,
            'code', a.code,
            'description', a.description,
            'is_active', a.is_active,
            'created_at', a.created_at,
            'updated_at', a.updated_at
        )
    )
    INTO v_atc_codes
    FROM (
        SELECT a.*
        FROM atc_codes a
        WHERE (is_active_filter IS NULL OR a.is_active = is_active_filter)
        AND (
            search_term IS NULL OR
            a.code ILIKE '%' || search_term || '%' OR
            a.description ILIKE '%' || search_term || '%'
        )
        ORDER BY
            CASE v_validated_sort_by
                WHEN 'code' THEN a.code
                WHEN 'created_at' THEN a.created_at::text
                WHEN 'updated_at' THEN a.updated_at::text
                ELSE a.code
            END
        ASC NULLS LAST
        LIMIT v_validated_page_size
        OFFSET v_offset
    ) a;

    -- Return result with pagination info
    RETURN jsonb_build_object(
        'atc_codes', COALESCE(v_atc_codes, '[]'::jsonb),
        'pagination', jsonb_build_object(
            'page_number', page_number,
            'page_size', v_validated_page_size,
            'total_count', COALESCE(v_total_count, 0),
            'total_pages', CEIL(COALESCE(v_total_count, 0)::numeric / v_validated_page_size)
        )
    );
END;
$$;

COMMIT;
