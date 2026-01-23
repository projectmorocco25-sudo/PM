-- Migration: create_rmm_tables
-- Description: Create database migration for RMM tables (companies, products, skus, atc_codes, critical_medicines, registry_submissions)
-- Date: 2026-01-22
-- Task: 1.1.1.3
-- Author: Sami (Implementation Compliance Specialist)
-- Dependencies: Task 1.1.1.2 (users table must exist)

BEGIN;

-- ============================================================================
-- companies table
-- Purpose: IPC and Wholesaler companies
-- ============================================================================

CREATE TABLE IF NOT EXISTS companies (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    registration_number text NOT NULL UNIQUE,
    company_type text NOT NULL CHECK (company_type IN ('ipc', 'wholesaler')),
    address text,
    contact_email text,
    contact_phone text,
    is_active boolean NOT NULL DEFAULT true,
    suspended_at timestamptz,
    suspended_by uuid REFERENCES users(id),
    suspended_reason text,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

-- Indexes for companies table
CREATE INDEX IF NOT EXISTS idx_companies_registration_number ON companies(registration_number);
CREATE INDEX IF NOT EXISTS idx_companies_company_type ON companies(company_type);
CREATE INDEX IF NOT EXISTS idx_companies_is_active ON companies(is_active);

-- Trigger to update updated_at timestamp
CREATE TRIGGER update_companies_updated_at
    BEFORE UPDATE ON companies
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- products table
-- Purpose: Products belong to companies
-- ============================================================================

CREATE TABLE IF NOT EXISTS products (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    name text NOT NULL,
    description text,
    is_critical_medicine boolean NOT NULL DEFAULT false,
    is_active boolean NOT NULL DEFAULT true,
    deactivated_at timestamptz,
    deactivated_by uuid REFERENCES users(id),
    deactivated_reason text,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

-- Indexes for products table
CREATE INDEX IF NOT EXISTS idx_products_company_id ON products(company_id);
CREATE INDEX IF NOT EXISTS idx_products_is_critical_medicine ON products(is_critical_medicine);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active);

-- Trigger to update updated_at timestamp
CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- atc_codes table
-- Purpose: ATC codes (MOH-controlled, read-only for companies)
-- ============================================================================

CREATE TABLE IF NOT EXISTS atc_codes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    code text NOT NULL UNIQUE,
    description text,
    is_active boolean NOT NULL DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

-- Indexes for atc_codes table
CREATE INDEX IF NOT EXISTS idx_atc_codes_code ON atc_codes(code);

-- Trigger to update updated_at timestamp
CREATE TRIGGER update_atc_codes_updated_at
    BEFORE UPDATE ON atc_codes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- skus table
-- Purpose: SKUs belong to products and contain complete pharmaceutical product specifications
-- Important: SKU includes all product details (name, dosage, form, pack size) so that submissions
-- (AAMS, MSQ, WSL) only need to reference SKU_ID + Quantity.
-- ============================================================================

CREATE TABLE IF NOT EXISTS skus (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    sku_code text NOT NULL,
    name text NOT NULL,
    dosage_strength text NOT NULL, -- e.g., "500mg", "10mg/ml", "250mg/5ml"
    dosage_form text NOT NULL, -- e.g., "Tablet", "Capsule", "Syrup", "Injection", "Cream", "Ointment"
    pack_size text NOT NULL, -- e.g., "30 tablets", "100ml bottle", "50 capsules"
    unit_of_measure text NOT NULL, -- e.g., "tablets", "ml", "capsules", "vials", "boxes"
    atc_code_id uuid REFERENCES atc_codes(id),
    is_moh_authorized_unregistered boolean NOT NULL DEFAULT false,
    is_active boolean NOT NULL DEFAULT true,
    deactivated_at timestamptz,
    deactivated_by uuid REFERENCES users(id),
    deactivated_reason text,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

-- Indexes for skus table
CREATE INDEX IF NOT EXISTS idx_skus_product_id ON skus(product_id);
CREATE INDEX IF NOT EXISTS idx_skus_atc_code_id ON skus(atc_code_id);
CREATE INDEX IF NOT EXISTS idx_skus_is_active ON skus(is_active);
CREATE INDEX IF NOT EXISTS idx_skus_dosage_form ON skus(dosage_form);

-- Trigger to update updated_at timestamp
CREATE TRIGGER update_skus_updated_at
    BEFORE UPDATE ON skus
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- critical_medicines table
-- Purpose: Critical medicine designations (MOH-controlled)
-- ============================================================================

CREATE TABLE IF NOT EXISTS critical_medicines (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    sku_id uuid NOT NULL REFERENCES skus(id) ON DELETE CASCADE,
    designated_at timestamptz NOT NULL DEFAULT now(),
    designated_by uuid NOT NULL REFERENCES users(id),
    is_active boolean NOT NULL DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

-- Indexes for critical_medicines table
CREATE INDEX IF NOT EXISTS idx_critical_medicines_sku_id ON critical_medicines(sku_id);

-- Trigger to update updated_at timestamp
CREATE TRIGGER update_critical_medicines_updated_at
    BEFORE UPDATE ON critical_medicines
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- registry_submissions table
-- Purpose: Registry update submissions (companies, products, SKUs)
-- ============================================================================

CREATE TABLE IF NOT EXISTS registry_submissions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    submission_type text NOT NULL CHECK (submission_type IN (
        'company_create', 'company_update', 'product_create', 'product_update',
        'sku_create', 'sku_update', 'company_delete', 'product_delete', 'sku_delete'
    )),
    entity_type text NOT NULL CHECK (entity_type IN ('company', 'product', 'sku')),
    entity_id uuid, -- NULLABLE: For creates, NULL. For updates/deletes, references existing entity
    submission_data jsonb NOT NULL,
    status text NOT NULL DEFAULT 'draft' CHECK (status IN (
        'draft', 'submitted', 'tier2_verified', 'tier1_approved', 'tier2_implemented', 'completed', 'rejected'
    )),
    submitted_by uuid NOT NULL REFERENCES users(id),
    verified_by uuid REFERENCES users(id),
    verified_at timestamptz,
    approved_by uuid REFERENCES users(id),
    approved_at timestamptz,
    implemented_by uuid REFERENCES users(id),
    implemented_at timestamptz,
    rejection_reason text,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

-- Indexes for registry_submissions table
CREATE INDEX IF NOT EXISTS idx_registry_submissions_submission_type ON registry_submissions(submission_type);
CREATE INDEX IF NOT EXISTS idx_registry_submissions_entity_type ON registry_submissions(entity_type);
CREATE INDEX IF NOT EXISTS idx_registry_submissions_entity_id ON registry_submissions(entity_id);
CREATE INDEX IF NOT EXISTS idx_registry_submissions_status ON registry_submissions(status);
CREATE INDEX IF NOT EXISTS idx_registry_submissions_submitted_by ON registry_submissions(submitted_by);
CREATE INDEX IF NOT EXISTS idx_registry_submissions_created_at ON registry_submissions(created_at);

-- Trigger to update updated_at timestamp
CREATE TRIGGER update_registry_submissions_updated_at
    BEFORE UPDATE ON registry_submissions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- Add foreign key constraint for users.company_id -> companies.id
-- Note: This was referenced in users table but companies table didn't exist yet
-- ============================================================================

-- Add foreign key constraint for users.company_id
-- Note: We use ALTER TABLE IF EXISTS to avoid errors if constraint already exists
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'users') THEN
        -- Check if constraint already exists
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.table_constraints 
            WHERE constraint_name = 'users_company_id_fkey' 
            AND table_name = 'users'
        ) THEN
            ALTER TABLE users
            ADD CONSTRAINT users_company_id_fkey
            FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE SET NULL;
        END IF;
    END IF;
END $$;

COMMIT;
