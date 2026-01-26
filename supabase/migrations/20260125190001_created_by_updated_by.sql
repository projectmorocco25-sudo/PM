-- Migration: created_by / updated_by on companies, products, skus
-- Description: Add creator/updater columns, set them in create/update RPCs, return names from get RPCs.
-- Used by: Metadata sections on company/product/SKU edit forms (replace "—" placeholders).

BEGIN;

-- Companies
ALTER TABLE companies ADD COLUMN IF NOT EXISTS created_by uuid REFERENCES users(id);
ALTER TABLE companies ADD COLUMN IF NOT EXISTS updated_by uuid REFERENCES users(id);

-- Products
ALTER TABLE products ADD COLUMN IF NOT EXISTS created_by uuid REFERENCES users(id);
ALTER TABLE products ADD COLUMN IF NOT EXISTS updated_by uuid REFERENCES users(id);

-- SKUs
ALTER TABLE skus ADD COLUMN IF NOT EXISTS created_by uuid REFERENCES users(id);
ALTER TABLE skus ADD COLUMN IF NOT EXISTS updated_by uuid REFERENCES users(id);

-- ============================================================================
-- rmm_create_company: set created_by
-- ============================================================================
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
        is_active,
        created_by
    ) VALUES (
        trim(name),
        trim(registration_number),
        company_type,
        address,
        contact_email,
        contact_phone,
        NULLIF(trim(tax_id), ''),
        true,
        creator_user_id
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

-- ============================================================================
-- rmm_update_company: set updated_by
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
        updated_by = updater_user_id,
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
        'submission_id', v_submission_id,
        'created_by_name', (SELECT COALESCE(u.full_name, u.email, '') FROM users u WHERE u.id = c.created_by LIMIT 1),
        'updated_by_name', (SELECT COALESCE(u.full_name, u.email, '') FROM users u WHERE u.id = c.updated_by LIMIT 1)
    )
    INTO v_company
    FROM companies c
    WHERE c.id = company_id;

    RETURN v_company;
END;
$$;

-- ============================================================================
-- rmm_get_company: return created_by_name, updated_by_name
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
        'updated_at', c.updated_at,
        'created_by_name', (SELECT COALESCE(u.full_name, u.email, '') FROM users u WHERE u.id = c.created_by LIMIT 1),
        'updated_by_name', (SELECT COALESCE(u.full_name, u.email, '') FROM users u WHERE u.id = c.updated_by LIMIT 1)
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

-- ============================================================================
-- Products: create sets created_by; update sets updated_by; get returns names
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

    SELECT * INTO v_company_record
    FROM companies
    WHERE id = company_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Company not found';
    END IF;

    IF v_user_record.role IN ('company_admin', 'company_manager', 'company_user', 'vendor') THEN
        IF v_user_record.company_id != company_id THEN
            RAISE EXCEPTION 'Insufficient permissions: You can only create products for your own company';
        END IF;
    ELSIF v_user_record.role NOT IN ('tier1', 'system_admin') THEN
        RAISE EXCEPTION 'Insufficient permissions: Only MOH Tier 1, System Admin, and Company users can create products';
    END IF;

    IF name IS NULL OR trim(name) = '' THEN
        RAISE EXCEPTION 'Product name is required';
    END IF;

    INSERT INTO products (
        company_id,
        name,
        description,
        is_critical_medicine,
        is_active,
        created_by
    ) VALUES (
        company_id,
        trim(name),
        description,
        is_critical_medicine,
        true,
        creator_user_id
    )
    RETURNING id INTO v_product_id;

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

    SELECT p.* INTO v_product_record
    FROM products p
    WHERE p.id = product_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Product not found';
    END IF;

    IF v_user_record.role IN ('company_admin', 'company_manager', 'company_user', 'vendor') THEN
        IF v_user_record.company_id != v_product_record.company_id THEN
            RAISE EXCEPTION 'Insufficient permissions: You can only update products for your own company';
        END IF;
    ELSIF v_user_record.role NOT IN ('tier1', 'system_admin') THEN
        RAISE EXCEPTION 'Insufficient permissions: Only MOH Tier 1, System Admin, and Company users can update products';
    END IF;

    v_old_values := row_to_json(v_product_record)::jsonb;

    IF name IS NOT NULL AND trim(name) = '' THEN
        RAISE EXCEPTION 'Product name cannot be empty';
    END IF;

    UPDATE products
    SET
        name = COALESCE(trim(name), products.name),
        description = COALESCE(description, products.description),
        is_critical_medicine = COALESCE(is_critical_medicine, products.is_critical_medicine),
        updated_by = updater_user_id,
        updated_at = now()
    WHERE id = product_id
    RETURNING * INTO v_product_record;

    v_new_values := row_to_json(v_product_record)::jsonb;

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

    SELECT jsonb_build_object(
        'id', p.id,
        'company_id', p.company_id,
        'name', p.name,
        'description', p.description,
        'is_critical_medicine', p.is_critical_medicine,
        'is_active', p.is_active,
        'created_at', p.created_at,
        'updated_at', p.updated_at,
        'submission_id', v_submission_id,
        'created_by_name', (SELECT COALESCE(u.full_name, u.email, '') FROM users u WHERE u.id = p.created_by LIMIT 1),
        'updated_by_name', (SELECT COALESCE(u.full_name, u.email, '') FROM users u WHERE u.id = p.updated_by LIMIT 1)
    )
    INTO v_product
    FROM products p
    WHERE p.id = product_id;

    RETURN v_product;
END;
$$;

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
    v_product jsonb;
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
        'id', p.id,
        'company_id', p.company_id,
        'name', p.name,
        'description', p.description,
        'is_critical_medicine', p.is_critical_medicine,
        'is_active', p.is_active,
        'created_at', p.created_at,
        'updated_at', p.updated_at,
        'created_by_name', (SELECT COALESCE(u.full_name, u.email, '') FROM users u WHERE u.id = p.created_by LIMIT 1),
        'updated_by_name', (SELECT COALESCE(u.full_name, u.email, '') FROM users u WHERE u.id = p.updated_by LIMIT 1)
    )
    INTO v_product
    FROM products p
    WHERE p.id = product_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Product not found';
    END IF;

    IF v_user_record.role IN ('company_admin', 'company_manager', 'company_user', 'vendor') THEN
        IF (v_product->>'company_id')::uuid != v_user_record.company_id THEN
            RAISE EXCEPTION 'Insufficient permissions: You can only view products for your own company';
        END IF;
    ELSIF v_user_record.role NOT IN ('tier1', 'tier2_officer', 'tier2_registrar', 'auditor', 'system_admin') THEN
        RAISE EXCEPTION 'Insufficient permissions';
    END IF;

    RETURN v_product;
END;
$$;

-- ============================================================================
-- SKUs: create sets created_by; update sets updated_by; get returns names
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

    SELECT p.* INTO v_product_record
    FROM products p
    WHERE p.id = product_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Product not found';
    END IF;

    IF v_user_record.role IN ('company_admin', 'company_manager', 'company_user', 'vendor') THEN
        IF v_user_record.company_id != v_product_record.company_id THEN
            RAISE EXCEPTION 'Insufficient permissions: You can only create SKUs for your own company''s products';
        END IF;
    ELSIF v_user_record.role NOT IN ('tier1', 'system_admin') THEN
        RAISE EXCEPTION 'Insufficient permissions: Only MOH Tier 1, System Admin, and Company users can create SKUs';
    END IF;

    IF sku_code IS NULL OR trim(sku_code) = '' THEN
        RAISE EXCEPTION 'SKU code is required';
    END IF;

    IF name IS NULL OR trim(name) = '' THEN
        RAISE EXCEPTION 'SKU name is required';
    END IF;

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

    IF atc_code_id IS NOT NULL THEN
        IF NOT EXISTS (SELECT 1 FROM atc_codes WHERE id = atc_code_id AND is_active = true) THEN
            RAISE EXCEPTION 'ATC code not found or inactive';
        END IF;
    END IF;

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
        is_active,
        created_by
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
        true,
        creator_user_id
    )
    RETURNING id INTO v_sku_id;

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
    v_old_values jsonb;
    v_new_values jsonb;
    v_submission_id uuid;
    v_sku jsonb;
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

    SELECT s.*, p.company_id as product_company_id
    INTO v_sku_record
    FROM skus s
    JOIN products p ON s.product_id = p.id
    WHERE s.id = sku_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'SKU not found';
    END IF;

    IF v_user_record.role IN ('company_admin', 'company_manager', 'company_user', 'vendor') THEN
        IF v_user_record.company_id != v_sku_record.product_company_id THEN
            RAISE EXCEPTION 'Insufficient permissions: You can only update SKUs for your own company''s products';
        END IF;
    ELSIF v_user_record.role NOT IN ('tier1', 'system_admin') THEN
        RAISE EXCEPTION 'Insufficient permissions: Only MOH Tier 1, System Admin, and Company users can update SKUs';
    END IF;

    SELECT row_to_json(s.*)::jsonb INTO v_old_values
    FROM skus s WHERE s.id = sku_id;

    IF sku_code IS NOT NULL AND trim(sku_code) = '' THEN
        RAISE EXCEPTION 'SKU code cannot be empty';
    END IF;

    IF name IS NOT NULL AND trim(name) = '' THEN
        RAISE EXCEPTION 'SKU name cannot be empty';
    END IF;

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

    IF atc_code_id IS NOT NULL THEN
        IF NOT EXISTS (SELECT 1 FROM atc_codes WHERE id = atc_code_id AND is_active = true) THEN
            RAISE EXCEPTION 'ATC code not found or inactive';
        END IF;
    END IF;

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
        updated_by = updater_user_id,
        updated_at = now()
    WHERE id = sku_id
    RETURNING * INTO v_sku_record;

    SELECT row_to_json(s.*)::jsonb INTO v_new_values
    FROM skus s WHERE s.id = sku_id;

    IF create_submission THEN
        INSERT INTO registry_submissions (
            submission_type, entity_type, entity_id, submission_data, status, submitted_by
        ) VALUES (
            'sku_update', 'sku', sku_id,
            jsonb_build_object('old_values', v_old_values, 'new_values', v_new_values, 'updated_by', updater_user_id, 'updated_at', now()),
            'draft', updater_user_id
        )
        RETURNING id INTO v_submission_id;
    END IF;

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
        'submission_id', v_submission_id,
        'created_by_name', (SELECT COALESCE(u.full_name, u.email, '') FROM users u WHERE u.id = s.created_by LIMIT 1),
        'updated_by_name', (SELECT COALESCE(u.full_name, u.email, '') FROM users u WHERE u.id = s.updated_by LIMIT 1)
    )
    INTO v_sku
    FROM skus s
    WHERE s.id = sku_id;

    RETURN v_sku;
END;
$$;

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
    v_sku jsonb;
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

    SELECT s.*, p.company_id as product_company_id
    INTO v_sku_record
    FROM skus s
    JOIN products p ON s.product_id = p.id
    WHERE s.id = sku_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'SKU not found';
    END IF;

    IF v_user_record.role IN ('company_admin', 'company_manager', 'company_user', 'vendor') THEN
        IF v_user_record.company_id != v_sku_record.product_company_id THEN
            RAISE EXCEPTION 'Insufficient permissions: You can only view SKUs for your own company''s products';
        END IF;
    END IF;

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
        'updated_at', s.updated_at,
        'created_by_name', (SELECT COALESCE(u.full_name, u.email, '') FROM users u WHERE u.id = s.created_by LIMIT 1),
        'updated_by_name', (SELECT COALESCE(u.full_name, u.email, '') FROM users u WHERE u.id = s.updated_by LIMIT 1)
    )
    INTO v_sku
    FROM skus s
    WHERE s.id = sku_id;

    RETURN v_sku;
END;
$$;

COMMIT;