-- Migration: create_rmm_critical_medicine_management_rpc_functions
-- Description: Create RMM RPC functions for Critical Medicine management (MOH only)
-- Date: 2026-01-23
-- Task: 1.1.2.5
-- Author: Sami (Implementation Compliance Specialist)
-- Dependencies: Task 1.1.1.3 (critical_medicines, skus tables must exist), Task 1.1.1.5 (RLS policies must exist)
-- Access Control: MOH Tier 1 and System Admin can manage, all users can read

BEGIN;

-- ============================================================================
-- rmm_designate_critical_medicine(designator_user_id uuid, sku_id uuid)
-- Purpose: Designate SKU as critical medicine (MOH only)
-- Access Control:
--   - MOH Tier 1: Can designate critical medicines
--   - System Admin: Can designate critical medicines
--   - All other roles: Cannot designate
-- Returns: JSON object with critical medicine designation data
-- ============================================================================

CREATE OR REPLACE FUNCTION rmm_designate_critical_medicine(
    designator_user_id uuid,
    sku_id uuid
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_user_record RECORD;
    v_sku_record RECORD;
    v_critical_medicine_id uuid;
    v_critical_medicine jsonb;
BEGIN
    -- Get user record and verify user exists
    SELECT u.id, u.role, u.is_active
    INTO v_user_record
    FROM users u
    WHERE u.id = designator_user_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'User not found';
    END IF;

    IF NOT v_user_record.is_active THEN
        RAISE EXCEPTION 'User is not active';
    END IF;

    -- Access control: Only MOH Tier 1 and System Admin can designate critical medicines
    IF v_user_record.role NOT IN ('tier1', 'system_admin') THEN
        RAISE EXCEPTION 'Insufficient permissions: Only MOH Tier 1 and System Admin can designate critical medicines';
    END IF;

    -- Verify SKU exists
    SELECT * INTO v_sku_record
    FROM skus
    WHERE id = sku_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'SKU not found';
    END IF;

    -- Check if already designated
    IF EXISTS (
        SELECT 1 FROM critical_medicines cm
        WHERE cm.sku_id = sku_id
        AND cm.is_active = true
    ) THEN
        RAISE EXCEPTION 'SKU is already designated as a critical medicine';
    END IF;

    -- Create critical medicine designation
    INSERT INTO critical_medicines (
        sku_id,
        designated_by,
        is_active
    ) VALUES (
        sku_id,
        designator_user_id,
        true
    )
    RETURNING id INTO v_critical_medicine_id;

    -- Get created critical medicine designation
    SELECT jsonb_build_object(
        'id', cm.id,
        'sku_id', cm.sku_id,
        'designated_at', cm.designated_at,
        'designated_by', cm.designated_by,
        'is_active', cm.is_active,
        'created_at', cm.created_at,
        'updated_at', cm.updated_at
    )
    INTO v_critical_medicine
    FROM critical_medicines cm
    WHERE cm.id = v_critical_medicine_id;

    RETURN v_critical_medicine;
END;
$$;

-- ============================================================================
-- rmm_remove_critical_medicine(remover_user_id uuid, sku_id uuid)
-- Purpose: Remove critical medicine designation (MOH only)
-- Access Control:
--   - MOH Tier 1: Can remove critical medicine designations
--   - System Admin: Can remove critical medicine designations
--   - All other roles: Cannot remove
-- Returns: JSON object with removal confirmation
-- ============================================================================

CREATE OR REPLACE FUNCTION rmm_remove_critical_medicine(
    remover_user_id uuid,
    sku_id uuid
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_user_record RECORD;
    v_critical_medicine_record RECORD;
BEGIN
    -- Get user record and verify user exists
    SELECT u.id, u.role, u.is_active
    INTO v_user_record
    FROM users u
    WHERE u.id = remover_user_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'User not found';
    END IF;

    IF NOT v_user_record.is_active THEN
        RAISE EXCEPTION 'User is not active';
    END IF;

    -- Access control: Only MOH Tier 1 and System Admin can remove critical medicine designations
    IF v_user_record.role NOT IN ('tier1', 'system_admin') THEN
        RAISE EXCEPTION 'Insufficient permissions: Only MOH Tier 1 and System Admin can remove critical medicine designations';
    END IF;

    -- Verify critical medicine designation exists
    SELECT * INTO v_critical_medicine_record
    FROM critical_medicines
    WHERE sku_id = sku_id
    AND is_active = true;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Critical medicine designation not found for this SKU';
    END IF;

    -- Deactivate critical medicine designation (soft delete)
    UPDATE critical_medicines cm
    SET
        is_active = false,
        updated_at = now()
    WHERE cm.sku_id = sku_id
    AND cm.is_active = true;

    -- Return confirmation
    RETURN jsonb_build_object(
        'success', true,
        'message', 'Critical medicine designation removed successfully',
        'sku_id', sku_id
    );
END;
$$;

-- ============================================================================
-- rmm_get_critical_medicines(user_id uuid, page_number integer DEFAULT 1, page_size integer DEFAULT 50, search_term text DEFAULT NULL, sort_by text DEFAULT 'designated_at', sort_order text DEFAULT 'desc')
-- Purpose: List critical medicines (read-only for all users)
-- Access Control: All authenticated users can read critical medicines
-- Parameters:
--   - page_number: Page number (1-based)
--   - page_size: Number of items per page (default: 50, max: 100)
--   - search_term: Search in SKU name, code, dosage_strength
--   - sort_by: Sort field ('designated_at', 'sku_name', 'created_at')
--   - sort_order: Sort order ('asc' or 'desc')
-- Returns: JSON object with critical medicines array, pagination info, and total count
-- ============================================================================

CREATE OR REPLACE FUNCTION rmm_get_critical_medicines(
    user_id uuid,
    page_number integer DEFAULT 1,
    page_size integer DEFAULT 50,
    search_term text DEFAULT NULL,
    sort_by text DEFAULT 'designated_at',
    sort_order text DEFAULT 'desc'
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_user_record RECORD;
    v_critical_medicines jsonb;
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
    IF sort_by NOT IN ('designated_at', 'sku_name', 'created_at') THEN
        sort_by := 'designated_at';
    END IF;
    v_validated_sort_by := sort_by;

    -- Validate sort_order
    IF lower(sort_order) NOT IN ('asc', 'desc') THEN
        sort_order := 'desc';
    END IF;
    v_validated_sort_order := lower(sort_order);

    -- First get total count
    SELECT COUNT(*)
    INTO v_total_count
    FROM critical_medicines cm
    JOIN skus s ON cm.sku_id = s.id
    WHERE cm.is_active = true
    AND (
        search_term IS NULL OR
        s.name ILIKE '%' || search_term || '%' OR
        s.sku_code ILIKE '%' || search_term || '%' OR
        s.dosage_strength ILIKE '%' || search_term || '%'
    );

    -- Then get paginated results with proper sorting
    SELECT jsonb_agg(
        jsonb_build_object(
            'id', cm.id,
            'sku_id', cm.sku_id,
            'sku_name', s.name,
            'sku_code', s.sku_code,
            'dosage_strength', s.dosage_strength,
            'dosage_form', s.dosage_form,
            'designated_at', cm.designated_at,
            'designated_by', cm.designated_by,
            'is_active', cm.is_active,
            'created_at', cm.created_at,
            'updated_at', cm.updated_at
        )
    )
    INTO v_critical_medicines
    FROM (
        SELECT cm.*, s.name as sku_name, s.sku_code, s.dosage_strength, s.dosage_form
        FROM critical_medicines cm
        JOIN skus s ON cm.sku_id = s.id
        WHERE cm.is_active = true
        AND (
            search_term IS NULL OR
            s.name ILIKE '%' || search_term || '%' OR
            s.sku_code ILIKE '%' || search_term || '%' OR
            s.dosage_strength ILIKE '%' || search_term || '%'
        )
        ORDER BY
            CASE v_validated_sort_by
                WHEN 'designated_at' THEN cm.designated_at::text
                WHEN 'sku_name' THEN s.name
                WHEN 'created_at' THEN cm.created_at::text
                ELSE cm.designated_at::text
            END
        ASC NULLS LAST
        LIMIT v_validated_page_size
        OFFSET v_offset
    ) cm;

    -- Return result with pagination info
    RETURN jsonb_build_object(
        'critical_medicines', COALESCE(v_critical_medicines, '[]'::jsonb),
        'pagination', jsonb_build_object(
            'page_number', page_number,
            'page_size', v_validated_page_size,
            'total_count', COALESCE(v_total_count, 0),
            'total_pages', CEIL(COALESCE(v_total_count, 0)::numeric / v_validated_page_size)
        )
    );
END;
$$;

-- ============================================================================
-- rmm_is_critical_medicine(user_id uuid, sku_id uuid)
-- Purpose: Check if SKU is designated as critical medicine (read-only for all users)
-- Access Control: All authenticated users can check critical medicine status
-- Returns: JSON object with critical medicine status
-- ============================================================================

CREATE OR REPLACE FUNCTION rmm_is_critical_medicine(
    user_id uuid,
    sku_id uuid
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_user_record RECORD;
    v_critical_medicine_record RECORD;
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

    -- Verify SKU exists
    IF NOT EXISTS (SELECT 1 FROM skus WHERE id = sku_id) THEN
        RAISE EXCEPTION 'SKU not found';
    END IF;

    -- Check if SKU is designated as critical medicine
    SELECT * INTO v_critical_medicine_record
    FROM critical_medicines
    WHERE sku_id = sku_id
    AND is_active = true;

    -- Return status
    IF FOUND THEN
        RETURN jsonb_build_object(
            'is_critical_medicine', true,
            'critical_medicine_id', v_critical_medicine_record.id,
            'designated_at', v_critical_medicine_record.designated_at,
            'designated_by', v_critical_medicine_record.designated_by
        );
    ELSE
        RETURN jsonb_build_object(
            'is_critical_medicine', false
        );
    END IF;
END;
$$;

COMMIT;
