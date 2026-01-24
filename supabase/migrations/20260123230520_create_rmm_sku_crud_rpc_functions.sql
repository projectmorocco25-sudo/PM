-- Migration: create_rmm_sku_crud_rpc_functions
-- Description: Create RMM RPC functions for SKU CRUD operations
-- Date: 2026-01-23
-- Task: 1.1.2.3
-- Author: Sami (Implementation Compliance Specialist)
-- Dependencies: Task 1.1.1.3 (skus, products, registry_submissions tables must exist), Task 1.1.1.5 (RLS policies must exist)
-- Phase 0.6: Includes pharma attributes (dosage_strength, dosage_form, pack_size, unit_of_measure)

BEGIN;

-- ============================================================================
-- rmm_create_sku(creator_user_id uuid, product_id uuid, sku_code text, name text, dosage_strength text, dosage_form text, pack_size text, unit_of_measure text, atc_code_id uuid DEFAULT NULL, is_moh_authorized_unregistered boolean DEFAULT false)
-- Purpose: Create new SKU
-- Access Control:
--   - Company users: Can create SKUs for their own company's products only
--   - MOH Tier 1: Can create SKUs for any product
--   - System Admin: Can create SKUs for any product
-- Phase 0.6: Includes pharma attributes (dosage_strength, dosage_form, pack_size, unit_of_measure)
-- Returns: JSON object with created SKU data
-- ============================================================================

CREATE OR REPLACE FUNCTION rmm_create_sku(
    creator_user_id uuid,
    product_id uuid,
    sku_code text,
    name text,
    dosage_strength text,
    dosage_form text,
    pack_size text,
    unit_of_measure text,
    atc_code_id uuid DEFAULT NULL,
    is_moh_authorized_unregistered boolean DEFAULT false
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_user_record RECORD;
    v_product_record RECORD;
    v_sku_id uuid;
    v_sku jsonb;
BEGIN
    -- Get user record and verify user exists
    SELECT u.id, u.role, u.company_id, u.is_active
    INTO v_user_record
    FROM users u
    WHERE u.id = creator_user_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'User not found';
    END IF;

    IF NOT v_user_record.is_active THEN
        RAISE EXCEPTION 'User is not active';
    END IF;

    -- Verify product exists
    SELECT p.* INTO v_product_record
    FROM products p
    WHERE p.id = product_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Product not found';
    END IF;

    -- Access control: Company users can only create SKUs for their own company's products
    IF v_user_record.role IN ('company_admin', 'company_manager', 'company_user', 'vendor') THEN
        IF v_user_record.company_id != v_product_record.company_id THEN
            RAISE EXCEPTION 'Insufficient permissions: You can only create SKUs for your own company''s products';
        END IF;
    ELSIF v_user_record.role NOT IN ('tier1', 'system_admin') THEN
        RAISE EXCEPTION 'Insufficient permissions: Only MOH Tier 1, System Admin, and Company users can create SKUs';
    END IF;

    -- Input validation
    IF sku_code IS NULL OR trim(sku_code) = '' THEN
        RAISE EXCEPTION 'SKU code is required';
    END IF;

    IF name IS NULL OR trim(name) = '' THEN
        RAISE EXCEPTION 'SKU name is required';
    END IF;

    -- Phase 0.6: Validate pharma attributes
    IF dosage_strength IS NULL OR trim(dosage_strength) = '' THEN
        RAISE EXCEPTION 'Dosage strength is required';
    END IF;

    IF dosage_form IS NULL OR trim(dosage_form) = '' THEN
        RAISE EXCEPTION 'Dosage form is required';
    END IF;

    IF pack_size IS NULL OR trim(pack_size) = '' THEN
        RAISE EXCEPTION 'Pack size is required';
    END IF;

    IF unit_of_measure IS NULL OR trim(unit_of_measure) = '' THEN
        RAISE EXCEPTION 'Unit of measure is required';
    END IF;

    -- Verify ATC code exists if provided
    IF atc_code_id IS NOT NULL THEN
        IF NOT EXISTS (SELECT 1 FROM atc_codes WHERE id = atc_code_id AND is_active = true) THEN
            RAISE EXCEPTION 'ATC code not found or inactive';
        END IF;
    END IF;

    -- Create SKU
    INSERT INTO skus (
        product_id,
        sku_code,
        name,
        dosage_strength,
        dosage_form,
        pack_size,
        unit_of_measure,
        atc_code_id,
        is_moh_authorized_unregistered,
        is_active
    ) VALUES (
        product_id,
        trim(sku_code),
        trim(name),
        trim(dosage_strength),
        trim(dosage_form),
        trim(pack_size),
        trim(unit_of_measure),
        atc_code_id,
        is_moh_authorized_unregistered,
        true
    )
    RETURNING id INTO v_sku_id;

    -- Get created SKU
    SELECT jsonb_build_object(
        'id', s.id,
        'product_id', s.product_id,
        'sku_code', s.sku_code,
        'name', s.name,
        'dosage_strength', s.dosage_strength,
        'dosage_form', s.dosage_form,
        'pack_size', s.pack_size,
        'unit_of_measure', s.unit_of_measure,
        'atc_code_id', s.atc_code_id,
        'is_moh_authorized_unregistered', s.is_moh_authorized_unregistered,
        'is_active', s.is_active,
        'created_at', s.created_at,
        'updated_at', s.updated_at
    )
    INTO v_sku
    FROM skus s
    WHERE s.id = v_sku_id;

    RETURN v_sku;
END;
$$;

-- ============================================================================
-- rmm_update_sku(updater_user_id uuid, sku_id uuid, sku_code text DEFAULT NULL, name text DEFAULT NULL, dosage_strength text DEFAULT NULL, dosage_form text DEFAULT NULL, pack_size text DEFAULT NULL, unit_of_measure text DEFAULT NULL, atc_code_id uuid DEFAULT NULL, is_moh_authorized_unregistered boolean DEFAULT NULL, create_submission boolean DEFAULT true)
-- Purpose: Update existing SKU
-- Access Control:
--   - Company users: Can update SKUs for their own company's products only
--   - MOH Tier 1: Can update SKUs for any product
--   - System Admin: Can update SKUs for any product
-- Phase 0.6: Includes pharma attributes (dosage_strength, dosage_form, pack_size, unit_of_measure)
-- Note: Updates create registry submissions by default (create_submission=true) unless explicitly disabled
-- Returns: JSON object with updated SKU data
-- ============================================================================

CREATE OR REPLACE FUNCTION rmm_update_sku(
    updater_user_id uuid,
    sku_id uuid,
    sku_code text DEFAULT NULL,
    name text DEFAULT NULL,
    dosage_strength text DEFAULT NULL,
    dosage_form text DEFAULT NULL,
    pack_size text DEFAULT NULL,
    unit_of_measure text DEFAULT NULL,
    atc_code_id uuid DEFAULT NULL,
    is_moh_authorized_unregistered boolean DEFAULT NULL,
    create_submission boolean DEFAULT true
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_user_record RECORD;
    v_sku_record RECORD;
    v_product_record RECORD;
    v_old_values jsonb;
    v_new_values jsonb;
    v_submission_id uuid;
    v_sku jsonb;
BEGIN
    -- Get user record and verify user exists
    SELECT u.id, u.role, u.company_id, u.is_active
    INTO v_user_record
    FROM users u
    WHERE u.id = updater_user_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'User not found';
    END IF;

    IF NOT v_user_record.is_active THEN
        RAISE EXCEPTION 'User is not active';
    END IF;

    -- Get existing SKU with product info
    SELECT s.*, p.company_id as product_company_id
    INTO v_sku_record
    FROM skus s
    JOIN products p ON s.product_id = p.id
    WHERE s.id = sku_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'SKU not found';
    END IF;

    -- Access control: Company users can only update SKUs for their own company's products
    IF v_user_record.role IN ('company_admin', 'company_manager', 'company_user', 'vendor') THEN
        IF v_user_record.company_id != v_sku_record.product_company_id THEN
            RAISE EXCEPTION 'Insufficient permissions: You can only update SKUs for your own company''s products';
        END IF;
    ELSIF v_user_record.role NOT IN ('tier1', 'system_admin') THEN
        RAISE EXCEPTION 'Insufficient permissions: Only MOH Tier 1, System Admin, and Company users can update SKUs';
    END IF;

    -- Build old values
    SELECT row_to_json(s.*)::jsonb
    INTO v_old_values
    FROM skus s
    WHERE s.id = sku_id;

    -- Input validation
    IF sku_code IS NOT NULL AND trim(sku_code) = '' THEN
        RAISE EXCEPTION 'SKU code cannot be empty';
    END IF;

    IF name IS NOT NULL AND trim(name) = '' THEN
        RAISE EXCEPTION 'SKU name cannot be empty';
    END IF;

    -- Phase 0.6: Validate pharma attributes if provided
    IF dosage_strength IS NOT NULL AND trim(dosage_strength) = '' THEN
        RAISE EXCEPTION 'Dosage strength cannot be empty';
    END IF;

    IF dosage_form IS NOT NULL AND trim(dosage_form) = '' THEN
        RAISE EXCEPTION 'Dosage form cannot be empty';
    END IF;

    IF pack_size IS NOT NULL AND trim(pack_size) = '' THEN
        RAISE EXCEPTION 'Pack size cannot be empty';
    END IF;

    IF unit_of_measure IS NOT NULL AND trim(unit_of_measure) = '' THEN
        RAISE EXCEPTION 'Unit of measure cannot be empty';
    END IF;

    -- Verify ATC code exists if provided
    IF atc_code_id IS NOT NULL THEN
        IF NOT EXISTS (SELECT 1 FROM atc_codes WHERE id = atc_code_id AND is_active = true) THEN
            RAISE EXCEPTION 'ATC code not found or inactive';
        END IF;
    END IF;

    -- Update SKU (only update provided fields)
    UPDATE skus
    SET
        sku_code = COALESCE(trim(sku_code), skus.sku_code),
        name = COALESCE(trim(name), skus.name),
        dosage_strength = COALESCE(trim(dosage_strength), skus.dosage_strength),
        dosage_form = COALESCE(trim(dosage_form), skus.dosage_form),
        pack_size = COALESCE(trim(pack_size), skus.pack_size),
        unit_of_measure = COALESCE(trim(unit_of_measure), skus.unit_of_measure),
        atc_code_id = COALESCE(atc_code_id, skus.atc_code_id),
        is_moh_authorized_unregistered = COALESCE(is_moh_authorized_unregistered, skus.is_moh_authorized_unregistered),
        updated_at = now()
    WHERE id = sku_id
    RETURNING * INTO v_sku_record;

    -- Build new values
    SELECT row_to_json(s.*)::jsonb
    INTO v_new_values
    FROM skus s
    WHERE s.id = sku_id;

    -- Create registry submission if requested (default: true)
    IF create_submission THEN
        INSERT INTO registry_submissions (
            submission_type,
            entity_type,
            entity_id,
            submission_data,
            status,
            submitted_by
        ) VALUES (
            'sku_update',
            'sku',
            sku_id,
            jsonb_build_object(
                'old_values', v_old_values,
                'new_values', v_new_values,
                'updated_by', updater_user_id,
                'updated_at', now()
            ),
            'draft',
            updater_user_id
        )
        RETURNING id INTO v_submission_id;
    END IF;

    -- Get updated SKU
    SELECT jsonb_build_object(
        'id', s.id,
        'product_id', s.product_id,
        'sku_code', s.sku_code,
        'name', s.name,
        'dosage_strength', s.dosage_strength,
        'dosage_form', s.dosage_form,
        'pack_size', s.pack_size,
        'unit_of_measure', s.unit_of_measure,
        'atc_code_id', s.atc_code_id,
        'is_moh_authorized_unregistered', s.is_moh_authorized_unregistered,
        'is_active', s.is_active,
        'created_at', s.created_at,
        'updated_at', s.updated_at,
        'submission_id', v_submission_id
    )
    INTO v_sku
    FROM skus s
    WHERE s.id = sku_id;

    RETURN v_sku;
END;
$$;

-- ============================================================================
-- rmm_get_sku(user_id uuid, sku_id uuid)
-- Purpose: Get SKU by ID with role-based access control
-- Access Control:
--   - Company users: Can only see SKUs for their own company's products
--   - MOH users (tier1, tier2_officer, tier2_registrar, auditor): Can see all SKUs
--   - System Admin: Can see all SKUs
-- Phase 0.6: Returns pharma attributes (dosage_strength, dosage_form, pack_size, unit_of_measure)
-- Returns: JSON object with SKU data
-- ============================================================================

CREATE OR REPLACE FUNCTION rmm_get_sku(
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
    v_sku_record RECORD;
    v_product_record RECORD;
    v_sku jsonb;
BEGIN
    -- Get user record and verify user exists
    SELECT u.id, u.role, u.company_id, u.is_active
    INTO v_user_record
    FROM users u
    WHERE u.id = user_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'User not found';
    END IF;

    IF NOT v_user_record.is_active THEN
        RAISE EXCEPTION 'User is not active';
    END IF;

    -- Get SKU with product info
    SELECT s.*, p.company_id as product_company_id
    INTO v_sku_record
    FROM skus s
    JOIN products p ON s.product_id = p.id
    WHERE s.id = sku_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'SKU not found';
    END IF;

    -- Access control: Company users can only see SKUs for their own company's products
    -- MOH users and System Admin can see all SKUs
    IF v_user_record.role IN ('company_admin', 'company_manager', 'company_user', 'vendor') THEN
        IF v_user_record.company_id != v_sku_record.product_company_id THEN
            RAISE EXCEPTION 'Insufficient permissions: You can only view SKUs for your own company''s products';
        END IF;
    END IF;

    -- Build SKU JSON with Phase 0.6 pharma attributes
    SELECT jsonb_build_object(
        'id', s.id,
        'product_id', s.product_id,
        'sku_code', s.sku_code,
        'name', s.name,
        'dosage_strength', s.dosage_strength,
        'dosage_form', s.dosage_form,
        'pack_size', s.pack_size,
        'unit_of_measure', s.unit_of_measure,
        'atc_code_id', s.atc_code_id,
        'is_moh_authorized_unregistered', s.is_moh_authorized_unregistered,
        'is_active', s.is_active,
        'deactivated_at', s.deactivated_at,
        'deactivated_by', s.deactivated_by,
        'deactivated_reason', s.deactivated_reason,
        'created_at', s.created_at,
        'updated_at', s.updated_at
    )
    INTO v_sku
    FROM skus s
    WHERE s.id = sku_id;

    RETURN v_sku;
END;
$$;

-- ============================================================================
-- rmm_list_skus(user_id uuid, product_id uuid DEFAULT NULL, page_number integer DEFAULT 1, page_size integer DEFAULT 50, atc_code_id_filter uuid DEFAULT NULL, search_term text DEFAULT NULL, sort_by text DEFAULT 'name', sort_order text DEFAULT 'asc')
-- Purpose: List SKUs with role-based filtering, pagination, and sorting
-- Access Control:
--   - Company users: Can only see SKUs for their own company's products
--   - MOH users (tier1, tier2_officer, tier2_registrar, auditor): Can see all SKUs
--   - System Admin: Can see all SKUs
-- Phase 0.6: Includes pharma attributes in results
-- Parameters:
--   - product_id: Filter by product (optional)
--   - page_number: Page number (1-based)
--   - page_size: Number of items per page (default: 50, max: 100)
--   - atc_code_id_filter: Filter by ATC code
--   - search_term: Search in name, sku_code, dosage_strength, dosage_form
--   - sort_by: Sort field ('name', 'sku_code', 'dosage_strength', 'created_at', 'updated_at')
--   - sort_order: Sort order ('asc' or 'desc')
-- Returns: JSON object with SKUs array, pagination info, and total count
-- ============================================================================

CREATE OR REPLACE FUNCTION rmm_list_skus(
    user_id uuid,
    product_id uuid DEFAULT NULL,
    page_number integer DEFAULT 1,
    page_size integer DEFAULT 50,
    atc_code_id_filter uuid DEFAULT NULL,
    search_term text DEFAULT NULL,
    sort_by text DEFAULT 'name',
    sort_order text DEFAULT 'asc'
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_user_record RECORD;
    v_skus jsonb;
    v_total_count integer;
    v_offset integer;
    v_validated_page_size integer;
    v_validated_sort_by text;
    v_validated_sort_order text;
BEGIN
    -- Get user record and verify user exists
    SELECT u.id, u.role, u.company_id, u.is_active
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
    IF sort_by NOT IN ('name', 'sku_code', 'dosage_strength', 'created_at', 'updated_at') THEN
        sort_by := 'name';
    END IF;
    v_validated_sort_by := sort_by;

    -- Validate sort_order
    IF lower(sort_order) NOT IN ('asc', 'desc') THEN
        sort_order := 'asc';
    END IF;
    v_validated_sort_order := lower(sort_order);

    -- Build query based on user role
    -- Company users: Only their own company's SKUs
    -- MOH users and System Admin: All SKUs
    IF v_user_record.role IN ('company_admin', 'company_manager', 'company_user', 'vendor') THEN
        -- Company users: Only their own company's SKUs
        -- First get total count
        SELECT COUNT(*)
        INTO v_total_count
        FROM skus s
        JOIN products p ON s.product_id = p.id
        WHERE p.company_id = v_user_record.company_id
        AND (product_id IS NULL OR s.product_id = product_id)
        AND (atc_code_id_filter IS NULL OR s.atc_code_id = atc_code_id_filter)
        AND (
            search_term IS NULL OR
            s.name ILIKE '%' || search_term || '%' OR
            s.sku_code ILIKE '%' || search_term || '%' OR
            s.dosage_strength ILIKE '%' || search_term || '%' OR
            s.dosage_form ILIKE '%' || search_term || '%'
        );

        -- Then get paginated results with proper sorting
        SELECT jsonb_agg(
            jsonb_build_object(
                'id', s.id,
                'product_id', s.product_id,
                'sku_code', s.sku_code,
                'name', s.name,
                'dosage_strength', s.dosage_strength,
                'dosage_form', s.dosage_form,
                'pack_size', s.pack_size,
                'unit_of_measure', s.unit_of_measure,
                'atc_code_id', s.atc_code_id,
                'is_moh_authorized_unregistered', s.is_moh_authorized_unregistered,
                'is_active', s.is_active,
                'created_at', s.created_at,
                'updated_at', s.updated_at
            )
        )
        INTO v_skus
        FROM (
            SELECT s.*
            FROM skus s
            JOIN products p ON s.product_id = p.id
            WHERE p.company_id = v_user_record.company_id
            AND (product_id IS NULL OR s.product_id = product_id)
            AND (atc_code_id_filter IS NULL OR s.atc_code_id = atc_code_id_filter)
            AND (
                search_term IS NULL OR
                s.name ILIKE '%' || search_term || '%' OR
                s.sku_code ILIKE '%' || search_term || '%' OR
                s.dosage_strength ILIKE '%' || search_term || '%' OR
                s.dosage_form ILIKE '%' || search_term || '%'
            )
            ORDER BY
                CASE v_validated_sort_by
                    WHEN 'name' THEN s.name
                    WHEN 'sku_code' THEN s.sku_code
                    WHEN 'dosage_strength' THEN s.dosage_strength
                    WHEN 'created_at' THEN s.created_at::text
                    WHEN 'updated_at' THEN s.updated_at::text
                    ELSE s.name
                END
            ASC NULLS LAST
            LIMIT v_validated_page_size
            OFFSET v_offset
        ) s;
    ELSE
        -- MOH users and System Admin: All SKUs
        -- First get total count
        SELECT COUNT(*)
        INTO v_total_count
        FROM skus s
        WHERE (product_id IS NULL OR s.product_id = product_id)
        AND (atc_code_id_filter IS NULL OR s.atc_code_id = atc_code_id_filter)
        AND (
            search_term IS NULL OR
            s.name ILIKE '%' || search_term || '%' OR
            s.sku_code ILIKE '%' || search_term || '%' OR
            s.dosage_strength ILIKE '%' || search_term || '%' OR
            s.dosage_form ILIKE '%' || search_term || '%'
        );

        -- Then get paginated results with proper sorting
        SELECT jsonb_agg(
            jsonb_build_object(
                'id', s.id,
                'product_id', s.product_id,
                'sku_code', s.sku_code,
                'name', s.name,
                'dosage_strength', s.dosage_strength,
                'dosage_form', s.dosage_form,
                'pack_size', s.pack_size,
                'unit_of_measure', s.unit_of_measure,
                'atc_code_id', s.atc_code_id,
                'is_moh_authorized_unregistered', s.is_moh_authorized_unregistered,
                'is_active', s.is_active,
                'created_at', s.created_at,
                'updated_at', s.updated_at
            )
        )
        INTO v_skus
        FROM (
            SELECT s.*
            FROM skus s
            WHERE (product_id IS NULL OR s.product_id = product_id)
            AND (atc_code_id_filter IS NULL OR s.atc_code_id = atc_code_id_filter)
            AND (
                search_term IS NULL OR
                s.name ILIKE '%' || search_term || '%' OR
                s.sku_code ILIKE '%' || search_term || '%' OR
                s.dosage_strength ILIKE '%' || search_term || '%' OR
                s.dosage_form ILIKE '%' || search_term || '%'
            )
            ORDER BY
                CASE v_validated_sort_by
                    WHEN 'name' THEN s.name
                    WHEN 'sku_code' THEN s.sku_code
                    WHEN 'dosage_strength' THEN s.dosage_strength
                    WHEN 'created_at' THEN s.created_at::text
                    WHEN 'updated_at' THEN s.updated_at::text
                    ELSE s.name
                END
            ASC NULLS LAST
            LIMIT v_validated_page_size
            OFFSET v_offset
        ) s;
    END IF;

    -- Return result with pagination info
    RETURN jsonb_build_object(
        'skus', COALESCE(v_skus, '[]'::jsonb),
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
