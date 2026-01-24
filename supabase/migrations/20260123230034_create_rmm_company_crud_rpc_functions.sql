-- Migration: create_rmm_company_crud_rpc_functions
-- Description: Create RMM RPC functions for Company CRUD operations
-- Date: 2026-01-23
-- Task: 1.1.2.1
-- Author: Sami (Implementation Compliance Specialist)
-- Dependencies: Task 1.1.1.3 (companies, registry_submissions tables must exist), Task 1.1.1.5 (RLS policies must exist)

BEGIN;

-- ============================================================================
-- rmm_create_company(creator_user_id uuid, name text, registration_number text, company_type text, address text, contact_email text, contact_phone text)
-- Purpose: Create new company
-- Access Control:
--   - Company users: Cannot create companies (only MOH Tier 1 and System Admin can create)
--   - MOH Tier 1: Can create any company
--   - System Admin: Can create any company
-- Returns: JSON object with created company data
-- ============================================================================

CREATE OR REPLACE FUNCTION rmm_create_company(
    creator_user_id uuid,
    name text,
    registration_number text,
    company_type text,
    address text DEFAULT NULL,
    contact_email text DEFAULT NULL,
    contact_phone text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_user_record RECORD;
    v_company_id uuid;
    v_company jsonb;
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

    -- Access control: Only MOH Tier 1 and System Admin can create companies
    IF v_user_record.role NOT IN ('tier1', 'system_admin') THEN
        RAISE EXCEPTION 'Insufficient permissions: Only MOH Tier 1 and System Admin can create companies';
    END IF;

    -- Input validation
    IF name IS NULL OR trim(name) = '' THEN
        RAISE EXCEPTION 'Company name is required';
    END IF;

    IF registration_number IS NULL OR trim(registration_number) = '' THEN
        RAISE EXCEPTION 'Registration number is required';
    END IF;

    IF company_type NOT IN ('ipc', 'wholesaler') THEN
        RAISE EXCEPTION 'Invalid company type. Must be ''ipc'' or ''wholesaler''';
    END IF;

    -- Check if registration number already exists
    IF EXISTS (SELECT 1 FROM companies WHERE registration_number = trim(registration_number)) THEN
        RAISE EXCEPTION 'Registration number already exists: %', registration_number;
    END IF;

    -- Create company
    INSERT INTO companies (
        name,
        registration_number,
        company_type,
        address,
        contact_email,
        contact_phone,
        is_active
    ) VALUES (
        trim(name),
        trim(registration_number),
        company_type,
        address,
        contact_email,
        contact_phone,
        true
    )
    RETURNING id INTO v_company_id;

    -- Get created company
    SELECT jsonb_build_object(
        'id', c.id,
        'name', c.name,
        'registration_number', c.registration_number,
        'company_type', c.company_type,
        'address', c.address,
        'contact_email', c.contact_email,
        'contact_phone', c.contact_phone,
        'is_active', c.is_active,
        'created_at', c.created_at,
        'updated_at', c.updated_at
    )
    INTO v_company
    FROM companies c
    WHERE c.id = v_company_id;

    RETURN v_company;
END;
$$;

-- ============================================================================
-- rmm_update_company(updater_user_id uuid, company_id uuid, name text, registration_number text, company_type text, address text, contact_email text, contact_phone text, create_submission boolean DEFAULT true)
-- Purpose: Update existing company
-- Access Control:
--   - Company users: Cannot update companies (only MOH Tier 1 and System Admin can update)
--   - MOH Tier 1: Can update any company
--   - System Admin: Can update any company
-- Note: Updates create registry submissions by default (create_submission=true) unless explicitly disabled
-- Returns: JSON object with updated company data
-- ============================================================================

CREATE OR REPLACE FUNCTION rmm_update_company(
    updater_user_id uuid,
    company_id uuid,
    name text DEFAULT NULL,
    registration_number text DEFAULT NULL,
    company_type text DEFAULT NULL,
    address text DEFAULT NULL,
    contact_email text DEFAULT NULL,
    contact_phone text DEFAULT NULL,
    create_submission boolean DEFAULT true
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_user_record RECORD;
    v_company_record RECORD;
    v_old_values jsonb;
    v_new_values jsonb;
    v_submission_id uuid;
    v_company jsonb;
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

    -- Access control: Only MOH Tier 1 and System Admin can update companies
    IF v_user_record.role NOT IN ('tier1', 'system_admin') THEN
        RAISE EXCEPTION 'Insufficient permissions: Only MOH Tier 1 and System Admin can update companies';
    END IF;

    -- Get existing company
    SELECT * INTO v_company_record
    FROM companies
    WHERE id = company_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Company not found';
    END IF;

    -- Build old values
    v_old_values := row_to_json(v_company_record)::jsonb;

    -- Input validation
    IF registration_number IS NOT NULL THEN
        -- Check if new registration number already exists (excluding current company)
        IF EXISTS (
            SELECT 1 FROM companies 
            WHERE registration_number = trim(registration_number) 
            AND id != company_id
        ) THEN
            RAISE EXCEPTION 'Registration number already exists: %', registration_number;
        END IF;
    END IF;

    IF company_type IS NOT NULL AND company_type NOT IN ('ipc', 'wholesaler') THEN
        RAISE EXCEPTION 'Invalid company type. Must be ''ipc'' or ''wholesaler''';
    END IF;

    -- Update company (only update provided fields)
    UPDATE companies
    SET
        name = COALESCE(trim(name), companies.name),
        registration_number = COALESCE(trim(registration_number), companies.registration_number),
        company_type = COALESCE(company_type, companies.company_type),
        address = COALESCE(address, companies.address),
        contact_email = COALESCE(contact_email, companies.contact_email),
        contact_phone = COALESCE(contact_phone, companies.contact_phone),
        updated_at = now()
    WHERE id = company_id
    RETURNING * INTO v_company_record;

    -- Build new values
    v_new_values := row_to_json(v_company_record)::jsonb;

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
            'company_update',
            'company',
            company_id,
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

    -- Get updated company
    SELECT jsonb_build_object(
        'id', c.id,
        'name', c.name,
        'registration_number', c.registration_number,
        'company_type', c.company_type,
        'address', c.address,
        'contact_email', c.contact_email,
        'contact_phone', c.contact_phone,
        'is_active', c.is_active,
        'created_at', c.created_at,
        'updated_at', c.updated_at,
        'submission_id', v_submission_id
    )
    INTO v_company
    FROM companies c
    WHERE c.id = company_id;

    RETURN v_company;
END;
$$;

-- ============================================================================
-- rmm_get_company(user_id uuid, company_id uuid)
-- Purpose: Get company by ID with role-based access control
-- Access Control:
--   - Company users: Can only see their own company
--   - MOH users (tier1, tier2_officer, tier2_registrar, auditor): Can see all companies
--   - System Admin: Can see all companies
-- Returns: JSON object with company data
-- ============================================================================

CREATE OR REPLACE FUNCTION rmm_get_company(
    user_id uuid,
    company_id uuid
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_user_record RECORD;
    v_company jsonb;
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

    -- Get company
    SELECT jsonb_build_object(
        'id', c.id,
        'name', c.name,
        'registration_number', c.registration_number,
        'company_type', c.company_type,
        'address', c.address,
        'contact_email', c.contact_email,
        'contact_phone', c.contact_phone,
        'is_active', c.is_active,
        'suspended_at', c.suspended_at,
        'suspended_by', c.suspended_by,
        'suspended_reason', c.suspended_reason,
        'created_at', c.created_at,
        'updated_at', c.updated_at
    )
    INTO v_company
    FROM companies c
    WHERE c.id = company_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Company not found';
    END IF;

    -- Access control: Company users can only see their own company
    -- MOH users and System Admin can see all companies
    -- RLS policies will enforce this, but we also check here for clarity
    IF v_user_record.role IN ('company_admin', 'company_manager', 'company_user', 'vendor') THEN
        IF v_user_record.company_id != company_id THEN
            RAISE EXCEPTION 'Insufficient permissions: You can only view your own company';
        END IF;
    END IF;

    RETURN v_company;
END;
$$;

-- ============================================================================
-- rmm_list_companies(user_id uuid, page_number integer DEFAULT 1, page_size integer DEFAULT 50, company_type_filter text DEFAULT NULL, search_term text DEFAULT NULL, sort_by text DEFAULT 'name', sort_order text DEFAULT 'asc')
-- Purpose: List companies with role-based filtering, pagination, and sorting
-- Access Control:
--   - Company users: Can only see their own company
--   - MOH users (tier1, tier2_officer, tier2_registrar, auditor): Can see all companies
--   - System Admin: Can see all companies
-- Parameters:
--   - page_number: Page number (1-based)
--   - page_size: Number of items per page (default: 50, max: 100)
--   - company_type_filter: Filter by company type ('ipc' or 'wholesaler')
--   - search_term: Search in name and registration_number
--   - sort_by: Sort field ('name', 'registration_number', 'company_type', 'created_at', 'updated_at')
--   - sort_order: Sort order ('asc' or 'desc')
-- Returns: JSON object with companies array, pagination info, and total count
-- ============================================================================

CREATE OR REPLACE FUNCTION rmm_list_companies(
    user_id uuid,
    page_number integer DEFAULT 1,
    page_size integer DEFAULT 50,
    company_type_filter text DEFAULT NULL,
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
    v_companies jsonb;
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
    IF sort_by NOT IN ('name', 'registration_number', 'company_type', 'created_at', 'updated_at') THEN
        sort_by := 'name';
    END IF;
    v_validated_sort_by := sort_by;

    -- Validate sort_order
    IF lower(sort_order) NOT IN ('asc', 'desc') THEN
        sort_order := 'asc';
    END IF;
    v_validated_sort_order := lower(sort_order);

    -- Validate company_type_filter
    IF company_type_filter IS NOT NULL AND company_type_filter NOT IN ('ipc', 'wholesaler') THEN
        company_type_filter := NULL;
    END IF;

    -- Build query based on user role
    -- Company users: Only their own company
    -- MOH users and System Admin: All companies
    IF v_user_record.role IN ('company_admin', 'company_manager', 'company_user', 'vendor') THEN
        -- Company users: Only their own company
        -- First get total count
        SELECT COUNT(*)
        INTO v_total_count
        FROM companies c
        WHERE c.id = v_user_record.company_id
        AND (company_type_filter IS NULL OR c.company_type = company_type_filter)
        AND (
            search_term IS NULL OR
            c.name ILIKE '%' || search_term || '%' OR
            c.registration_number ILIKE '%' || search_term || '%'
        );

        -- Then get paginated results with proper sorting
        SELECT jsonb_agg(
            jsonb_build_object(
                'id', c.id,
                'name', c.name,
                'registration_number', c.registration_number,
                'company_type', c.company_type,
                'address', c.address,
                'contact_email', c.contact_email,
                'contact_phone', c.contact_phone,
                'is_active', c.is_active,
                'created_at', c.created_at,
                'updated_at', c.updated_at
            )
        )
        INTO v_companies
        FROM (
            SELECT c.*
            FROM companies c
            WHERE c.id = v_user_record.company_id
            AND (company_type_filter IS NULL OR c.company_type = company_type_filter)
            AND (
                search_term IS NULL OR
                c.name ILIKE '%' || search_term || '%' OR
                c.registration_number ILIKE '%' || search_term || '%'
            )
            ORDER BY
                CASE 
                    WHEN v_validated_sort_order = 'asc' THEN
                        CASE v_validated_sort_by
                            WHEN 'name' THEN c.name
                            WHEN 'registration_number' THEN c.registration_number
                            WHEN 'company_type' THEN c.company_type
                            WHEN 'created_at' THEN c.created_at::text
                            WHEN 'updated_at' THEN c.updated_at::text
                            ELSE c.name
                        END
                    ELSE NULL
                END ASC NULLS LAST,
                CASE 
                    WHEN v_validated_sort_order = 'desc' THEN
                        CASE v_validated_sort_by
                            WHEN 'name' THEN c.name
                            WHEN 'registration_number' THEN c.registration_number
                            WHEN 'company_type' THEN c.company_type
                            WHEN 'created_at' THEN c.created_at::text
                            WHEN 'updated_at' THEN c.updated_at::text
                            ELSE c.name
                        END
                    ELSE NULL
                END DESC NULLS LAST
            LIMIT v_validated_page_size
            OFFSET v_offset
        ) c;
    ELSE
        -- MOH users and System Admin: All companies
        -- First get total count
        SELECT COUNT(*)
        INTO v_total_count
        FROM companies c
        WHERE (company_type_filter IS NULL OR c.company_type = company_type_filter)
        AND (
            search_term IS NULL OR
            c.name ILIKE '%' || search_term || '%' OR
            c.registration_number ILIKE '%' || search_term || '%'
        );

        -- Then get paginated results with proper sorting
        SELECT jsonb_agg(
            jsonb_build_object(
                'id', c.id,
                'name', c.name,
                'registration_number', c.registration_number,
                'company_type', c.company_type,
                'address', c.address,
                'contact_email', c.contact_email,
                'contact_phone', c.contact_phone,
                'is_active', c.is_active,
                'created_at', c.created_at,
                'updated_at', c.updated_at
            )
        )
        INTO v_companies
        FROM (
            SELECT c.*
            FROM companies c
            WHERE (company_type_filter IS NULL OR c.company_type = company_type_filter)
            AND (
                search_term IS NULL OR
                c.name ILIKE '%' || search_term || '%' OR
                c.registration_number ILIKE '%' || search_term || '%'
            )
            ORDER BY
                CASE 
                    WHEN v_validated_sort_order = 'asc' THEN
                        CASE v_validated_sort_by
                            WHEN 'name' THEN c.name
                            WHEN 'registration_number' THEN c.registration_number
                            WHEN 'company_type' THEN c.company_type
                            WHEN 'created_at' THEN c.created_at::text
                            WHEN 'updated_at' THEN c.updated_at::text
                            ELSE c.name
                        END
                    ELSE NULL
                END ASC NULLS LAST,
                CASE 
                    WHEN v_validated_sort_order = 'desc' THEN
                        CASE v_validated_sort_by
                            WHEN 'name' THEN c.name
                            WHEN 'registration_number' THEN c.registration_number
                            WHEN 'company_type' THEN c.company_type
                            WHEN 'created_at' THEN c.created_at::text
                            WHEN 'updated_at' THEN c.updated_at::text
                            ELSE c.name
                        END
                    ELSE NULL
                END DESC NULLS LAST
            LIMIT v_validated_page_size
            OFFSET v_offset
        ) c;
    END IF;

    -- Return result with pagination info
    RETURN jsonb_build_object(
        'companies', COALESCE(v_companies, '[]'::jsonb),
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
-- rmm_submit_registry_update(submitter_user_id uuid, submission_type text, entity_type text, entity_id uuid, submission_data jsonb)
-- Purpose: Submit registry update (create registry submission)
-- Access Control:
--   - Company users: Can submit updates for their own company
--   - MOH Tier 1: Can submit updates for any entity
--   - System Admin: Can submit updates for any entity
-- Parameters:
--   - submission_type: 'company_create', 'company_update', 'product_create', 'product_update', 'sku_create', 'sku_update', 'company_delete', 'product_delete', 'sku_delete'
--   - entity_type: 'company', 'product', 'sku'
--   - entity_id: Entity ID (NULL for creates, required for updates/deletes)
--   - submission_data: JSONB with submission data
-- Returns: JSON object with created submission data
-- ============================================================================

CREATE OR REPLACE FUNCTION rmm_submit_registry_update(
    submitter_user_id uuid,
    submission_type text,
    entity_type text,
    entity_id uuid,
    submission_data jsonb
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_user_record RECORD;
    v_submission_id uuid;
    v_submission jsonb;
BEGIN
    -- Get user record and verify user exists
    SELECT u.id, u.role, u.company_id, u.is_active
    INTO v_user_record
    FROM users u
    WHERE u.id = submitter_user_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'User not found';
    END IF;

    IF NOT v_user_record.is_active THEN
        RAISE EXCEPTION 'User is not active';
    END IF;

    -- Input validation
    IF submission_type NOT IN (
        'company_create', 'company_update', 'product_create', 'product_update',
        'sku_create', 'sku_update', 'company_delete', 'product_delete', 'sku_delete'
    ) THEN
        RAISE EXCEPTION 'Invalid submission type: %', submission_type;
    END IF;

    IF entity_type NOT IN ('company', 'product', 'sku') THEN
        RAISE EXCEPTION 'Invalid entity type: %', entity_type;
    END IF;

    -- For updates and deletes, entity_id is required
    IF submission_type IN ('company_update', 'product_update', 'sku_update', 'company_delete', 'product_delete', 'sku_delete') THEN
        IF entity_id IS NULL THEN
            RAISE EXCEPTION 'Entity ID is required for update/delete submissions';
        END IF;
    END IF;

    -- Access control: Company users can only submit for their own company
    -- MOH Tier 1 and System Admin can submit for any entity
    IF v_user_record.role IN ('company_admin', 'company_manager', 'company_user', 'vendor') THEN
        IF entity_type = 'company' AND entity_id IS NOT NULL THEN
            -- For company updates/deletes, verify company belongs to user
            IF NOT EXISTS (
                SELECT 1 FROM companies
                WHERE id = entity_id
                AND id = v_user_record.company_id
            ) THEN
                RAISE EXCEPTION 'Insufficient permissions: You can only submit updates for your own company';
            END IF;
        ELSIF entity_type IN ('product', 'sku') THEN
            -- For product/SKU submissions, verify they belong to user's company
            IF entity_id IS NOT NULL THEN
                IF entity_type = 'product' THEN
                    IF NOT EXISTS (
                        SELECT 1 FROM products p
                        WHERE p.id = entity_id
                        AND p.company_id = v_user_record.company_id
                    ) THEN
                        RAISE EXCEPTION 'Insufficient permissions: You can only submit updates for your own company''s products';
                    END IF;
                ELSIF entity_type = 'sku' THEN
                    IF NOT EXISTS (
                        SELECT 1 FROM skus s
                        JOIN products p ON s.product_id = p.id
                        WHERE s.id = entity_id
                        AND p.company_id = v_user_record.company_id
                    ) THEN
                        RAISE EXCEPTION 'Insufficient permissions: You can only submit updates for your own company''s SKUs';
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Create registry submission
    INSERT INTO registry_submissions (
        submission_type,
        entity_type,
        entity_id,
        submission_data,
        status,
        submitted_by
    ) VALUES (
        submission_type,
        entity_type,
        entity_id,
        submission_data,
        'submitted', -- Status changes from 'draft' to 'submitted' when submitted
        submitter_user_id
    )
    RETURNING id INTO v_submission_id;

    -- Get created submission
    SELECT jsonb_build_object(
        'id', rs.id,
        'submission_type', rs.submission_type,
        'entity_type', rs.entity_type,
        'entity_id', rs.entity_id,
        'submission_data', rs.submission_data,
        'status', rs.status,
        'submitted_by', rs.submitted_by,
        'created_at', rs.created_at,
        'updated_at', rs.updated_at
    )
    INTO v_submission
    FROM registry_submissions rs
    WHERE rs.id = v_submission_id;

    RETURN v_submission;
END;
$$;

COMMIT;
