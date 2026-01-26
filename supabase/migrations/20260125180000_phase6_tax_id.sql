-- Phase 6 Task 6.1: Add Tax ID to companies
-- Wireframe: task-0.5.2.8 (Company form), task-0.5.2.3 (Company detail)
-- Adds companies.tax_id, extends rmm_create_company, rmm_update_company, rmm_get_company

BEGIN;

ALTER TABLE companies ADD COLUMN IF NOT EXISTS tax_id text;

-- rmm_create_company: add tax_id param and persist
CREATE OR REPLACE FUNCTION rmm_create_company(
    creator_user_id uuid,
    name text,
    registration_number text,
    company_type text,
    address text DEFAULT NULL,
    contact_email text DEFAULT NULL,
    contact_phone text DEFAULT NULL,
    tax_id text DEFAULT NULL
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

    IF v_user_record.role NOT IN ('tier1', 'system_admin') THEN
        RAISE EXCEPTION 'Insufficient permissions: Only MOH Tier 1 and System Admin can create companies';
    END IF;

    IF name IS NULL OR trim(name) = '' THEN
        RAISE EXCEPTION 'Company name is required';
    END IF;

    IF registration_number IS NULL OR trim(registration_number) = '' THEN
        RAISE EXCEPTION 'Registration number is required';
    END IF;

    IF company_type NOT IN ('ipc', 'wholesaler') THEN
        RAISE EXCEPTION 'Invalid company type. Must be ''ipc'' or ''wholesaler''';
    END IF;

    IF EXISTS (SELECT 1 FROM companies WHERE registration_number = trim(registration_number)) THEN
        RAISE EXCEPTION 'Registration number already exists: %', registration_number;
    END IF;

    INSERT INTO companies (
        name,
        registration_number,
        company_type,
        address,
        contact_email,
        contact_phone,
        tax_id,
        is_active
    ) VALUES (
        trim(name),
        trim(registration_number),
        company_type,
        address,
        contact_email,
        contact_phone,
        NULLIF(trim(tax_id), ''),
        true
    )
    RETURNING id INTO v_company_id;

    SELECT jsonb_build_object(
        'id', c.id,
        'name', c.name,
        'registration_number', c.registration_number,
        'company_type', c.company_type,
        'address', c.address,
        'contact_email', c.contact_email,
        'contact_phone', c.contact_phone,
        'tax_id', c.tax_id,
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

-- rmm_update_company: add tax_id param and update
CREATE OR REPLACE FUNCTION rmm_update_company(
    updater_user_id uuid,
    company_id uuid,
    name text DEFAULT NULL,
    registration_number text DEFAULT NULL,
    company_type text DEFAULT NULL,
    address text DEFAULT NULL,
    contact_email text DEFAULT NULL,
    contact_phone text DEFAULT NULL,
    tax_id text DEFAULT NULL,
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

    IF v_user_record.role NOT IN ('tier1', 'system_admin') THEN
        RAISE EXCEPTION 'Insufficient permissions: Only MOH Tier 1 and System Admin can update companies';
    END IF;

    SELECT * INTO v_company_record
    FROM companies
    WHERE id = company_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Company not found';
    END IF;

    v_old_values := row_to_json(v_company_record)::jsonb;

    IF registration_number IS NOT NULL THEN
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

    UPDATE companies
    SET
        name = COALESCE(NULLIF(trim(name), ''), companies.name),
        registration_number = COALESCE(NULLIF(trim(registration_number), ''), companies.registration_number),
        company_type = COALESCE(company_type, companies.company_type),
        address = COALESCE(address, companies.address),
        contact_email = COALESCE(contact_email, companies.contact_email),
        contact_phone = COALESCE(contact_phone, companies.contact_phone),
        tax_id = NULLIF(trim(COALESCE(tax_id, '')), ''),
        updated_at = now()
    WHERE id = company_id
    RETURNING * INTO v_company_record;

    v_new_values := row_to_json(v_company_record)::jsonb;

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

    SELECT jsonb_build_object(
        'id', c.id,
        'name', c.name,
        'registration_number', c.registration_number,
        'company_type', c.company_type,
        'address', c.address,
        'contact_email', c.contact_email,
        'contact_phone', c.contact_phone,
        'tax_id', c.tax_id,
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

-- rmm_get_company: return tax_id
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

    SELECT jsonb_build_object(
        'id', c.id,
        'name', c.name,
        'registration_number', c.registration_number,
        'company_type', c.company_type,
        'address', c.address,
        'contact_email', c.contact_email,
        'contact_phone', c.contact_phone,
        'tax_id', c.tax_id,
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

    IF v_user_record.role IN ('company_admin', 'company_manager', 'company_user', 'vendor') THEN
        IF v_user_record.company_id != company_id THEN
            RAISE EXCEPTION 'Insufficient permissions: You can only view your own company';
        END IF;
    END IF;

    RETURN v_company;
END;
$$;

COMMIT;
