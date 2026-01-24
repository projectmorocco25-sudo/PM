-- Migration: create_rmm_product_crud_rpc_functions
-- Description: Create RMM RPC functions for Product CRUD operations
-- Date: 2026-01-23
-- Task: 1.1.2.2
-- Author: Sami (Implementation Compliance Specialist)
-- Dependencies: Task 1.1.1.3 (products, registry_submissions tables must exist), Task 1.1.1.5 (RLS policies must exist)

BEGIN;

-- ============================================================================
-- rmm_create_product(creator_user_id uuid, company_id uuid, name text, description text DEFAULT NULL, is_critical_medicine boolean DEFAULT false)
-- Purpose: Create new product
-- Access Control:
--   - Company users: Can create products for their own company only
--   - MOH Tier 1: Can create products for any company
--   - System Admin: Can create products for any company
-- Returns: JSON object with created product data
-- ============================================================================

CREATE OR REPLACE FUNCTION rmm_create_product(
    creator_user_id uuid,
    company_id uuid,
    name text,
    description text DEFAULT NULL,
    is_critical_medicine boolean DEFAULT false
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_user_record RECORD;
    v_company_record RECORD;
    v_product_id uuid;
    v_product jsonb;
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

    -- Verify company exists
    SELECT * INTO v_company_record
    FROM companies
    WHERE id = company_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Company not found';
    END IF;

    -- Access control: Company users can only create products for their own company
    IF v_user_record.role IN ('company_admin', 'company_manager', 'company_user', 'vendor') THEN
        IF v_user_record.company_id != company_id THEN
            RAISE EXCEPTION 'Insufficient permissions: You can only create products for your own company';
        END IF;
    ELSIF v_user_record.role NOT IN ('tier1', 'system_admin') THEN
        RAISE EXCEPTION 'Insufficient permissions: Only MOH Tier 1, System Admin, and Company users can create products';
    END IF;

    -- Input validation
    IF name IS NULL OR trim(name) = '' THEN
        RAISE EXCEPTION 'Product name is required';
    END IF;

    -- Create product
    INSERT INTO products (
        company_id,
        name,
        description,
        is_critical_medicine,
        is_active
    ) VALUES (
        company_id,
        trim(name),
        description,
        is_critical_medicine,
        true
    )
    RETURNING id INTO v_product_id;

    -- Get created product
    SELECT jsonb_build_object(
        'id', p.id,
        'company_id', p.company_id,
        'name', p.name,
        'description', p.description,
        'is_critical_medicine', p.is_critical_medicine,
        'is_active', p.is_active,
        'created_at', p.created_at,
        'updated_at', p.updated_at
    )
    INTO v_product
    FROM products p
    WHERE p.id = v_product_id;

    RETURN v_product;
END;
$$;

-- ============================================================================
-- rmm_update_product(updater_user_id uuid, product_id uuid, name text DEFAULT NULL, description text DEFAULT NULL, is_critical_medicine boolean DEFAULT NULL, create_submission boolean DEFAULT true)
-- Purpose: Update existing product
-- Access Control:
--   - Company users: Can update products for their own company only
--   - MOH Tier 1: Can update products for any company
--   - System Admin: Can update products for any company
-- Note: Updates create registry submissions by default (create_submission=true) unless explicitly disabled
-- Returns: JSON object with updated product data
-- ============================================================================

CREATE OR REPLACE FUNCTION rmm_update_product(
    updater_user_id uuid,
    product_id uuid,
    name text DEFAULT NULL,
    description text DEFAULT NULL,
    is_critical_medicine boolean DEFAULT NULL,
    create_submission boolean DEFAULT true
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_user_record RECORD;
    v_product_record RECORD;
    v_old_values jsonb;
    v_new_values jsonb;
    v_submission_id uuid;
    v_product jsonb;
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

    -- Get existing product
    SELECT p.* INTO v_product_record
    FROM products p
    WHERE p.id = product_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Product not found';
    END IF;

    -- Access control: Company users can only update products for their own company
    IF v_user_record.role IN ('company_admin', 'company_manager', 'company_user', 'vendor') THEN
        IF v_user_record.company_id != v_product_record.company_id THEN
            RAISE EXCEPTION 'Insufficient permissions: You can only update products for your own company';
        END IF;
    ELSIF v_user_record.role NOT IN ('tier1', 'system_admin') THEN
        RAISE EXCEPTION 'Insufficient permissions: Only MOH Tier 1, System Admin, and Company users can update products';
    END IF;

    -- Build old values
    v_old_values := row_to_json(v_product_record)::jsonb;

    -- Input validation
    IF name IS NOT NULL AND trim(name) = '' THEN
        RAISE EXCEPTION 'Product name cannot be empty';
    END IF;

    -- Update product (only update provided fields)
    UPDATE products
    SET
        name = COALESCE(trim(name), products.name),
        description = COALESCE(description, products.description),
        is_critical_medicine = COALESCE(is_critical_medicine, products.is_critical_medicine),
        updated_at = now()
    WHERE id = product_id
    RETURNING * INTO v_product_record;

    -- Build new values
    v_new_values := row_to_json(v_product_record)::jsonb;

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
            'product_update',
            'product',
            product_id,
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

    -- Get updated product
    SELECT jsonb_build_object(
        'id', p.id,
        'company_id', p.company_id,
        'name', p.name,
        'description', p.description,
        'is_critical_medicine', p.is_critical_medicine,
        'is_active', p.is_active,
        'created_at', p.created_at,
        'updated_at', p.updated_at,
        'submission_id', v_submission_id
    )
    INTO v_product
    FROM products p
    WHERE p.id = product_id;

    RETURN v_product;
END;
$$;

-- ============================================================================
-- rmm_get_product(user_id uuid, product_id uuid)
-- Purpose: Get product by ID with role-based access control
-- Access Control:
--   - Company users: Can only see products for their own company
--   - MOH users (tier1, tier2_officer, tier2_registrar, auditor): Can see all products
--   - System Admin: Can see all products
-- Returns: JSON object with product data
-- ============================================================================

CREATE OR REPLACE FUNCTION rmm_get_product(
    user_id uuid,
    product_id uuid
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_user_record RECORD;
    v_product_record RECORD;
    v_product jsonb;
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

    -- Get product
    SELECT p.* INTO v_product_record
    FROM products p
    WHERE p.id = product_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Product not found';
    END IF;

    -- Access control: Company users can only see products for their own company
    -- MOH users and System Admin can see all products
    IF v_user_record.role IN ('company_admin', 'company_manager', 'company_user', 'vendor') THEN
        IF v_user_record.company_id != v_product_record.company_id THEN
            RAISE EXCEPTION 'Insufficient permissions: You can only view products for your own company';
        END IF;
    END IF;

    -- Build product JSON
    SELECT jsonb_build_object(
        'id', p.id,
        'company_id', p.company_id,
        'name', p.name,
        'description', p.description,
        'is_critical_medicine', p.is_critical_medicine,
        'is_active', p.is_active,
        'deactivated_at', p.deactivated_at,
        'deactivated_by', p.deactivated_by,
        'deactivated_reason', p.deactivated_reason,
        'created_at', p.created_at,
        'updated_at', p.updated_at
    )
    INTO v_product
    FROM products p
    WHERE p.id = product_id;

    RETURN v_product;
END;
$$;

-- ============================================================================
-- rmm_list_products(user_id uuid, company_id uuid DEFAULT NULL, page_number integer DEFAULT 1, page_size integer DEFAULT 50, is_critical_medicine_filter boolean DEFAULT NULL, search_term text DEFAULT NULL, sort_by text DEFAULT 'name', sort_order text DEFAULT 'asc')
-- Purpose: List products with role-based filtering, pagination, and sorting
-- Access Control:
--   - Company users: Can only see products for their own company
--   - MOH users (tier1, tier2_officer, tier2_registrar, auditor): Can see all products
--   - System Admin: Can see all products
-- Parameters:
--   - company_id: Filter by company (optional for MOH users, required for company users)
--   - page_number: Page number (1-based)
--   - page_size: Number of items per page (default: 50, max: 100)
--   - is_critical_medicine_filter: Filter by critical medicine status
--   - search_term: Search in name and description
--   - sort_by: Sort field ('name', 'created_at', 'updated_at')
--   - sort_order: Sort order ('asc' or 'desc')
-- Returns: JSON object with products array, pagination info, and total count
-- ============================================================================

CREATE OR REPLACE FUNCTION rmm_list_products(
    user_id uuid,
    company_id uuid DEFAULT NULL,
    page_number integer DEFAULT 1,
    page_size integer DEFAULT 50,
    is_critical_medicine_filter boolean DEFAULT NULL,
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
    v_products jsonb;
    v_total_count integer;
    v_offset integer;
    v_validated_page_size integer;
    v_validated_sort_by text;
    v_validated_sort_order text;
    v_filtered_company_id uuid;
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
    IF sort_by NOT IN ('name', 'created_at', 'updated_at') THEN
        sort_by := 'name';
    END IF;
    v_validated_sort_by := sort_by;

    -- Validate sort_order
    IF lower(sort_order) NOT IN ('asc', 'desc') THEN
        sort_order := 'asc';
    END IF;
    v_validated_sort_order := lower(sort_order);

    -- Determine company filter based on user role
    IF v_user_record.role IN ('company_admin', 'company_manager', 'company_user', 'vendor') THEN
        -- Company users: Only their own company
        v_filtered_company_id := v_user_record.company_id;
    ELSE
        -- MOH users and System Admin: Use provided company_id or all companies
        v_filtered_company_id := company_id;
    END IF;

    -- First get total count
    SELECT COUNT(*)
    INTO v_total_count
    FROM products p
    WHERE (v_filtered_company_id IS NULL OR p.company_id = v_filtered_company_id)
    AND (is_critical_medicine_filter IS NULL OR p.is_critical_medicine = is_critical_medicine_filter)
    AND (
        search_term IS NULL OR
        p.name ILIKE '%' || search_term || '%' OR
        p.description ILIKE '%' || search_term || '%'
    );

    -- Then get paginated results with proper sorting
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
        WHERE (v_filtered_company_id IS NULL OR p.company_id = v_filtered_company_id)
        AND (is_critical_medicine_filter IS NULL OR p.is_critical_medicine = is_critical_medicine_filter)
        AND (
            search_term IS NULL OR
            p.name ILIKE '%' || search_term || '%' OR
            p.description ILIKE '%' || search_term || '%'
        )
        ORDER BY
            CASE v_validated_sort_by
                WHEN 'name' THEN p.name
                WHEN 'created_at' THEN p.created_at::text
                WHEN 'updated_at' THEN p.updated_at::text
                ELSE p.name
            END
        ASC NULLS LAST
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

COMMIT;
