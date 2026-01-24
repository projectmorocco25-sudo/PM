-- Migration: create_rmm_helper_rpc_functions
-- Description: Create RMM helper RPC functions (history and relationship queries)
-- Date: 2026-01-23
-- Task: 1.1.2.3a
-- Author: Sami (Implementation Compliance Specialist)
-- Dependencies: Task 1.1.1.3 (companies, products, skus, registry_submissions tables must exist), Task 1.1.1.5 (RLS policies must exist)

BEGIN;

-- ============================================================================
-- rmm_list_company_products(user_id uuid, company_id uuid, page_number integer DEFAULT 1, page_size integer DEFAULT 50)
-- Purpose: List all products for a company
-- Access Control:
--   - Company users: Can only see products for their own company
--   - MOH users: Can see products for any company
--   - System Admin: Can see products for any company
-- Returns: JSON object with products array and pagination info
-- ============================================================================

CREATE OR REPLACE FUNCTION rmm_list_company_products(
    user_id uuid,
    company_id uuid,
    page_number integer DEFAULT 1,
    page_size integer DEFAULT 50
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_user_record RECORD;
    v_products jsonb;
    v_total_count integer;
    v_offset integer;
    v_validated_page_size integer;
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

    -- Access control: Company users can only see products for their own company
    IF v_user_record.role IN ('company_admin', 'company_manager', 'company_user', 'vendor') THEN
        IF v_user_record.company_id != company_id THEN
            RAISE EXCEPTION 'Insufficient permissions: You can only view products for your own company';
        END IF;
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

    -- Verify company exists
    IF NOT EXISTS (SELECT 1 FROM companies WHERE id = company_id) THEN
        RAISE EXCEPTION 'Company not found';
    END IF;

    -- Get total count
    SELECT COUNT(*)
    INTO v_total_count
    FROM products p
    WHERE p.company_id = company_id;

    -- Get paginated products
    SELECT jsonb_agg(
        jsonb_build_object(
            'id', p.id,
            'company_id', p.company_id,
            'name', p.name,
            'description', p.description,
            'is_critical_medicine', p.is_critical_medicine,
            'is_active', p.is_active,
            'created_at', p.created_at,
            'updated_at', p.updated_at
        )
    )
    INTO v_products
    FROM (
        SELECT p.*
        FROM products p
        WHERE p.company_id = company_id
        ORDER BY p.name ASC
        LIMIT v_validated_page_size
        OFFSET v_offset
    ) p;

    -- Return result with pagination info
    RETURN jsonb_build_object(
        'products', COALESCE(v_products, '[]'::jsonb),
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
-- rmm_get_company_history(user_id uuid, company_id uuid, page_number integer DEFAULT 1, page_size integer DEFAULT 50)
-- Purpose: Get company history (registry submissions)
-- Access Control:
--   - Company users: Can only see history for their own company
--   - MOH users: Can see history for any company
--   - System Admin: Can see history for any company
-- Returns: JSON object with registry submissions array and pagination info
-- ============================================================================

CREATE OR REPLACE FUNCTION rmm_get_company_history(
    user_id uuid,
    company_id uuid,
    page_number integer DEFAULT 1,
    page_size integer DEFAULT 50
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_user_record RECORD;
    v_submissions jsonb;
    v_total_count integer;
    v_offset integer;
    v_validated_page_size integer;
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

    -- Access control: Company users can only see history for their own company
    IF v_user_record.role IN ('company_admin', 'company_manager', 'company_user', 'vendor') THEN
        IF v_user_record.company_id != company_id THEN
            RAISE EXCEPTION 'Insufficient permissions: You can only view history for your own company';
        END IF;
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

    -- Verify company exists
    IF NOT EXISTS (SELECT 1 FROM companies WHERE id = company_id) THEN
        RAISE EXCEPTION 'Company not found';
    END IF;

    -- Get total count (submissions for company entities)
    -- Note: For company_create submissions, entity_id is NULL and company_id is in submission_data
    -- For company_update/delete submissions, entity_id references the company
    SELECT COUNT(*)
    INTO v_total_count
    FROM registry_submissions rs
    WHERE rs.entity_type = 'company'
    AND (
        rs.entity_id = company_id
        OR (rs.entity_id IS NULL AND rs.submission_type = 'company_create' AND (rs.submission_data->>'company_id')::uuid = company_id)
    );

    -- Get paginated submissions
    SELECT jsonb_agg(
        jsonb_build_object(
            'id', rs.id,
            'submission_type', rs.submission_type,
            'entity_type', rs.entity_type,
            'entity_id', rs.entity_id,
            'submission_data', rs.submission_data,
            'status', rs.status,
            'submitted_by', rs.submitted_by,
            'verified_by', rs.verified_by,
            'verified_at', rs.verified_at,
            'approved_by', rs.approved_by,
            'approved_at', rs.approved_at,
            'implemented_by', rs.implemented_by,
            'implemented_at', rs.implemented_at,
            'rejection_reason', rs.rejection_reason,
            'created_at', rs.created_at,
            'updated_at', rs.updated_at
        )
    )
    INTO v_submissions
    FROM (
        SELECT rs.*
        FROM registry_submissions rs
        WHERE rs.entity_type = 'company'
        AND (
            rs.entity_id = company_id
            OR (rs.entity_id IS NULL AND rs.submission_type = 'company_create' AND (rs.submission_data->>'company_id')::uuid = company_id)
        )
        ORDER BY rs.created_at DESC
        LIMIT v_validated_page_size
        OFFSET v_offset
    ) rs;

    -- Return result with pagination info
    RETURN jsonb_build_object(
        'submissions', COALESCE(v_submissions, '[]'::jsonb),
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
-- rmm_list_product_skus(user_id uuid, product_id uuid, page_number integer DEFAULT 1, page_size integer DEFAULT 50)
-- Purpose: List all SKUs for a product
-- Access Control:
--   - Company users: Can only see SKUs for their own company's products
--   - MOH users: Can see SKUs for any product
--   - System Admin: Can see SKUs for any product
-- Returns: JSON object with SKUs array and pagination info
-- ============================================================================

CREATE OR REPLACE FUNCTION rmm_list_product_skus(
    user_id uuid,
    product_id uuid,
    page_number integer DEFAULT 1,
    page_size integer DEFAULT 50
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_user_record RECORD;
    v_product_record RECORD;
    v_skus jsonb;
    v_total_count integer;
    v_offset integer;
    v_validated_page_size integer;
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

    -- Verify product exists
    SELECT p.* INTO v_product_record
    FROM products p
    WHERE p.id = product_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Product not found';
    END IF;

    -- Access control: Company users can only see SKUs for their own company's products
    IF v_user_record.role IN ('company_admin', 'company_manager', 'company_user', 'vendor') THEN
        IF v_user_record.company_id != v_product_record.company_id THEN
            RAISE EXCEPTION 'Insufficient permissions: You can only view SKUs for your own company''s products';
        END IF;
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

    -- Get total count
    SELECT COUNT(*)
    INTO v_total_count
    FROM skus s
    WHERE s.product_id = product_id;

    -- Get paginated SKUs
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
        WHERE s.product_id = product_id
        ORDER BY s.name ASC
        LIMIT v_validated_page_size
        OFFSET v_offset
    ) s;

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

-- ============================================================================
-- rmm_get_product_history(user_id uuid, product_id uuid, page_number integer DEFAULT 1, page_size integer DEFAULT 50)
-- Purpose: Get product history (registry submissions)
-- Access Control:
--   - Company users: Can only see history for their own company's products
--   - MOH users: Can see history for any product
--   - System Admin: Can see history for any product
-- Returns: JSON object with registry submissions array and pagination info
-- ============================================================================

CREATE OR REPLACE FUNCTION rmm_get_product_history(
    user_id uuid,
    product_id uuid,
    page_number integer DEFAULT 1,
    page_size integer DEFAULT 50
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_user_record RECORD;
    v_product_record RECORD;
    v_submissions jsonb;
    v_total_count integer;
    v_offset integer;
    v_validated_page_size integer;
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

    -- Verify product exists
    SELECT p.* INTO v_product_record
    FROM products p
    WHERE p.id = product_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Product not found';
    END IF;

    -- Access control: Company users can only see history for their own company's products
    IF v_user_record.role IN ('company_admin', 'company_manager', 'company_user', 'vendor') THEN
        IF v_user_record.company_id != v_product_record.company_id THEN
            RAISE EXCEPTION 'Insufficient permissions: You can only view history for your own company''s products';
        END IF;
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

    -- Get total count
    SELECT COUNT(*)
    INTO v_total_count
    FROM registry_submissions rs
    WHERE rs.entity_type = 'product'
    AND rs.entity_id = product_id;

    -- Get paginated submissions
    SELECT jsonb_agg(
        jsonb_build_object(
            'id', rs.id,
            'submission_type', rs.submission_type,
            'entity_type', rs.entity_type,
            'entity_id', rs.entity_id,
            'submission_data', rs.submission_data,
            'status', rs.status,
            'submitted_by', rs.submitted_by,
            'verified_by', rs.verified_by,
            'verified_at', rs.verified_at,
            'approved_by', rs.approved_by,
            'approved_at', rs.approved_at,
            'implemented_by', rs.implemented_by,
            'implemented_at', rs.implemented_at,
            'rejection_reason', rs.rejection_reason,
            'created_at', rs.created_at,
            'updated_at', rs.updated_at
        )
    )
    INTO v_submissions
    FROM (
        SELECT rs.*
        FROM registry_submissions rs
        WHERE rs.entity_type = 'product'
        AND rs.entity_id = product_id
        ORDER BY rs.created_at DESC
        LIMIT v_validated_page_size
        OFFSET v_offset
    ) rs;

    -- Return result with pagination info
    RETURN jsonb_build_object(
        'submissions', COALESCE(v_submissions, '[]'::jsonb),
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
-- rmm_get_sku_history(user_id uuid, sku_id uuid, page_number integer DEFAULT 1, page_size integer DEFAULT 50)
-- Purpose: Get SKU history (registry submissions)
-- Access Control:
--   - Company users: Can only see history for their own company's SKUs
--   - MOH users: Can see history for any SKU
--   - System Admin: Can see history for any SKU
-- Returns: JSON object with registry submissions array and pagination info
-- ============================================================================

CREATE OR REPLACE FUNCTION rmm_get_sku_history(
    user_id uuid,
    sku_id uuid,
    page_number integer DEFAULT 1,
    page_size integer DEFAULT 50
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
    v_submissions jsonb;
    v_total_count integer;
    v_offset integer;
    v_validated_page_size integer;
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

    -- Verify SKU exists and get product info
    SELECT s.*, p.company_id as product_company_id
    INTO v_sku_record
    FROM skus s
    JOIN products p ON s.product_id = p.id
    WHERE s.id = sku_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'SKU not found';
    END IF;

    -- Access control: Company users can only see history for their own company's SKUs
    IF v_user_record.role IN ('company_admin', 'company_manager', 'company_user', 'vendor') THEN
        IF v_user_record.company_id != v_sku_record.product_company_id THEN
            RAISE EXCEPTION 'Insufficient permissions: You can only view history for your own company''s SKUs';
        END IF;
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

    -- Get total count
    SELECT COUNT(*)
    INTO v_total_count
    FROM registry_submissions rs
    WHERE rs.entity_type = 'sku'
    AND rs.entity_id = sku_id;

    -- Get paginated submissions
    SELECT jsonb_agg(
        jsonb_build_object(
            'id', rs.id,
            'submission_type', rs.submission_type,
            'entity_type', rs.entity_type,
            'entity_id', rs.entity_id,
            'submission_data', rs.submission_data,
            'status', rs.status,
            'submitted_by', rs.submitted_by,
            'verified_by', rs.verified_by,
            'verified_at', rs.verified_at,
            'approved_by', rs.approved_by,
            'approved_at', rs.approved_at,
            'implemented_by', rs.implemented_by,
            'implemented_at', rs.implemented_at,
            'rejection_reason', rs.rejection_reason,
            'created_at', rs.created_at,
            'updated_at', rs.updated_at
        )
    )
    INTO v_submissions
    FROM (
        SELECT rs.*
        FROM registry_submissions rs
        WHERE rs.entity_type = 'sku'
        AND rs.entity_id = sku_id
        ORDER BY rs.created_at DESC
        LIMIT v_validated_page_size
        OFFSET v_offset
    ) rs;

    -- Return result with pagination info
    RETURN jsonb_build_object(
        'submissions', COALESCE(v_submissions, '[]'::jsonb),
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
