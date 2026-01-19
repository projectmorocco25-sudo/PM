-- Migration: Create RMM core tables
-- Description: Create database migration for RMM core tables (companies, products, skus, atc_codes, critical_medicines, enforcement_actions, registry_submissions)
-- Date: 2026-01-17
-- Task: 1.1.1.7
-- Author: Sami (Implementation Compliance Specialist)

BEGIN;

-- ============================================
-- COMPANIES TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS public.companies (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    registration_number text UNIQUE NOT NULL,
    company_type text NOT NULL CHECK (company_type IN ('ipc', 'wholesaler')),
    address text,
    contact_email text,
    contact_phone text,
    is_active boolean DEFAULT true,
    suspended_at timestamptz,
    suspended_by uuid REFERENCES public.users(id) ON DELETE SET NULL,
    suspended_reason text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

COMMENT ON TABLE public.companies IS 'IPC and Wholesaler companies';
COMMENT ON COLUMN public.companies.company_type IS 'Company type: ipc (Industrial Pharmaceutical Company), wholesaler';
COMMENT ON COLUMN public.companies.suspended_at IS 'Suspension timestamp (if company is suspended)';

-- Indexes for companies table
CREATE INDEX IF NOT EXISTS idx_companies_type ON public.companies (company_type);
CREATE INDEX IF NOT EXISTS idx_companies_name ON public.companies (name);
CREATE INDEX IF NOT EXISTS idx_companies_registration_number ON public.companies (registration_number);
CREATE INDEX IF NOT EXISTS idx_companies_is_active ON public.companies (is_active);

-- ============================================
-- PRODUCTS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS public.products (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    name text NOT NULL,
    description text,
    is_critical_medicine boolean DEFAULT false,
    is_active boolean DEFAULT true,
    deactivated_at timestamptz,
    deactivated_by uuid REFERENCES public.users(id) ON DELETE SET NULL,
    deactivated_reason text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

COMMENT ON TABLE public.products IS 'Products belong to companies';
COMMENT ON COLUMN public.products.is_critical_medicine IS 'Critical medicine designation (true if product contains critical medicines)';

-- Indexes for products table
CREATE INDEX IF NOT EXISTS idx_products_company_id ON public.products (company_id);
CREATE INDEX IF NOT EXISTS idx_products_name ON public.products (name);
CREATE INDEX IF NOT EXISTS idx_products_is_critical_medicine ON public.products (is_critical_medicine);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON public.products (is_active);

-- ============================================
-- ATC_CODES TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS public.atc_codes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    code text UNIQUE NOT NULL,
    description text,
    is_active boolean DEFAULT true,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

COMMENT ON TABLE public.atc_codes IS 'ATC codes (MOH-controlled, read-only for companies)';

-- Indexes for atc_codes table
CREATE INDEX IF NOT EXISTS idx_atc_codes_code ON public.atc_codes (code);
CREATE INDEX IF NOT EXISTS idx_atc_codes_is_active ON public.atc_codes (is_active);

-- ============================================
-- SKUS TABLE (with pharmaceutical attributes)
-- ============================================

CREATE TABLE IF NOT EXISTS public.skus (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    sku_code text NOT NULL,
    name text NOT NULL,
    dosage_strength text NOT NULL,
    dosage_form text NOT NULL,
    pack_size text NOT NULL,
    unit_of_measure text NOT NULL,
    atc_code_id uuid REFERENCES public.atc_codes(id) ON DELETE SET NULL,
    is_moh_authorized_unregistered boolean DEFAULT false,
    is_active boolean DEFAULT true,
    deactivated_at timestamptz,
    deactivated_by uuid REFERENCES public.users(id) ON DELETE SET NULL,
    deactivated_reason text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

COMMENT ON TABLE public.skus IS 'SKUs belong to products and contain complete pharmaceutical product specifications';
COMMENT ON COLUMN public.skus.dosage_strength IS 'Dosage/strength (e.g., "500mg", "10mg/ml", "250mg/5ml")';
COMMENT ON COLUMN public.skus.dosage_form IS 'Pharmaceutical form (e.g., "Tablet", "Capsule", "Syrup", "Injection", "Cream", "Ointment")';
COMMENT ON COLUMN public.skus.pack_size IS 'Pack size (e.g., "30 tablets", "100ml bottle", "50 capsules")';
COMMENT ON COLUMN public.skus.unit_of_measure IS 'Unit of measure for quantities (e.g., "tablets", "ml", "capsules", "vials", "boxes")';

-- Indexes for skus table
CREATE INDEX IF NOT EXISTS idx_skus_product_id ON public.skus (product_id);
CREATE INDEX IF NOT EXISTS idx_skus_atc_code_id ON public.skus (atc_code_id);
CREATE INDEX IF NOT EXISTS idx_skus_is_active ON public.skus (is_active);
CREATE INDEX IF NOT EXISTS idx_skus_dosage_form ON public.skus (dosage_form);

-- Composite index for company-scoped queries (via product relationship)
-- Note: This requires JOIN but provides efficient filtering
CREATE INDEX IF NOT EXISTS idx_skus_product_company ON public.products(company_id, id);

-- ============================================
-- CRITICAL_MEDICINES TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS public.critical_medicines (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    sku_id uuid NOT NULL REFERENCES public.skus(id) ON DELETE CASCADE,
    designated_at timestamptz DEFAULT now(),
    designated_by uuid NOT NULL REFERENCES public.users(id) ON DELETE RESTRICT,
    is_active boolean DEFAULT true,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

COMMENT ON TABLE public.critical_medicines IS 'Critical medicine designations (MOH-controlled)';

-- Indexes for critical_medicines table
CREATE INDEX IF NOT EXISTS idx_critical_medicines_sku_id ON public.critical_medicines (sku_id);
CREATE INDEX IF NOT EXISTS idx_critical_medicines_is_active ON public.critical_medicines (is_active);

-- ============================================
-- ENFORCEMENT_ACTIONS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS public.enforcement_actions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    action_type text NOT NULL CHECK (action_type IN ('warning', 'fine', 'suspension')),
    violation_type text NOT NULL CHECK (violation_type IN ('submission_non_compliance', 'threshold_breach', 'critical_medicine_non_compliance', 'export_violation', 'data_quality_issue', 'repeated_offender')),
    legal_basis text NOT NULL,
    justification text NOT NULL,
    amount numeric(15, 2),
    status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'pending_review', 'pending_approval', 'approved', 'executed', 'appealed', 'resolved', 'cancelled')),
    -- Two-Person Rule Fields
    requestor_id uuid NOT NULL REFERENCES public.users(id) ON DELETE RESTRICT,
    approver_id uuid REFERENCES public.users(id) ON DELETE SET NULL,
    -- Appeal Workflow Fields
    appeal_grounds text,
    appeal_submitted_at timestamptz,
    appeal_resolved_at timestamptz,
    appeal_resolution_notes text,
    -- Workflow Tracking Fields
    submitted_at timestamptz,
    reviewed_at timestamptz,
    approved_at timestamptz,
    executed_at timestamptz,
    -- Review/Approval Notes
    review_notes text,
    approval_notes text,
    execution_notes text,
    cancellation_reason text,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    -- Constraints
    CONSTRAINT check_amount_required_for_fine CHECK (
        (action_type = 'fine' AND amount IS NOT NULL) OR
        (action_type != 'fine')
    ),
    CONSTRAINT check_appeal_fields CHECK (
        (appeal_submitted_at IS NULL AND appeal_grounds IS NULL) OR
        (appeal_submitted_at IS NOT NULL AND appeal_grounds IS NOT NULL)
    )
);

COMMENT ON TABLE public.enforcement_actions IS 'Enforcement action workflow table with state machine, approval chain, appeal tracking';
COMMENT ON COLUMN public.enforcement_actions.status IS 'Workflow state: draft, pending_review, pending_approval, approved, executed, appealed, resolved, cancelled';
COMMENT ON COLUMN public.enforcement_actions.action_type IS 'Action type: warning, fine, suspension';
COMMENT ON COLUMN public.enforcement_actions.violation_type IS 'Violation type: submission_non_compliance, threshold_breach, critical_medicine_non_compliance, export_violation, data_quality_issue, repeated_offender';
COMMENT ON COLUMN public.enforcement_actions.approver_id IS 'Approver ID (must be different from requestor_id - enforced in RPC functions)';

-- Indexes for enforcement_actions table
CREATE INDEX IF NOT EXISTS idx_enforcement_company_id ON public.enforcement_actions (company_id);
CREATE INDEX IF NOT EXISTS idx_enforcement_status ON public.enforcement_actions (status);
CREATE INDEX IF NOT EXISTS idx_enforcement_action_type ON public.enforcement_actions (action_type);
CREATE INDEX IF NOT EXISTS idx_enforcement_created_at ON public.enforcement_actions (created_at);
CREATE INDEX IF NOT EXISTS idx_enforcement_status_company ON public.enforcement_actions (status, company_id);
CREATE INDEX IF NOT EXISTS idx_enforcement_requestor_id ON public.enforcement_actions (requestor_id);
CREATE INDEX IF NOT EXISTS idx_enforcement_approver_id ON public.enforcement_actions (approver_id);

-- ============================================
-- REGISTRY_SUBMISSIONS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS public.registry_submissions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    submission_type text NOT NULL CHECK (submission_type IN ('company_create', 'company_update', 'product_create', 'product_update', 'sku_create', 'sku_update', 'company_delete', 'product_delete', 'sku_delete')),
    entity_type text NOT NULL CHECK (entity_type IN ('company', 'product', 'sku')),
    entity_id uuid,
    submission_data jsonb NOT NULL,
    status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'tier2_verified', 'tier1_approved', 'tier2_implemented', 'completed', 'rejected')),
    -- Workflow Fields
    submitted_by uuid NOT NULL REFERENCES public.users(id) ON DELETE RESTRICT,
    verified_by uuid REFERENCES public.users(id) ON DELETE SET NULL,
    verified_at timestamptz,
    approved_by uuid REFERENCES public.users(id) ON DELETE SET NULL,
    approved_at timestamptz,
    implemented_by uuid REFERENCES public.users(id) ON DELETE SET NULL,
    implemented_at timestamptz,
    rejection_reason text,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.registry_submissions IS 'Registry update submissions workflow table with state machine, approval chain, implementation tracking';
COMMENT ON COLUMN public.registry_submissions.status IS 'Workflow state: draft, submitted, tier2_verified, tier1_approved, tier2_implemented, completed, rejected';
COMMENT ON COLUMN public.registry_submissions.submission_type IS 'Submission type: company_create, company_update, product_create, product_update, sku_create, sku_update, company_delete, product_delete, sku_delete';
COMMENT ON COLUMN public.registry_submissions.entity_type IS 'Entity type: company, product, sku';

-- Indexes for registry_submissions table
CREATE INDEX IF NOT EXISTS idx_registry_submissions_status ON public.registry_submissions (status);
CREATE INDEX IF NOT EXISTS idx_registry_submissions_submitted_by ON public.registry_submissions (submitted_by);
CREATE INDEX IF NOT EXISTS idx_registry_submissions_entity_type ON public.registry_submissions (entity_type);
CREATE INDEX IF NOT EXISTS idx_registry_submissions_entity_id ON public.registry_submissions (entity_id) WHERE entity_id IS NOT NULL;

-- ============================================
-- UPDATED_AT TRIGGERS
-- ============================================

-- Apply updated_at triggers to all RMM tables
CREATE TRIGGER set_companies_updated_at
BEFORE UPDATE ON public.companies
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER set_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER set_skus_updated_at
BEFORE UPDATE ON public.skus
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER set_atc_codes_updated_at
BEFORE UPDATE ON public.atc_codes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER set_critical_medicines_updated_at
BEFORE UPDATE ON public.critical_medicines
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER set_enforcement_actions_updated_at
BEFORE UPDATE ON public.enforcement_actions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER set_registry_submissions_updated_at
BEFORE UPDATE ON public.registry_submissions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- ENABLE ROW LEVEL SECURITY
-- ============================================

ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skus ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.atc_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.critical_medicines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enforcement_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.registry_submissions ENABLE ROW LEVEL SECURITY;

COMMIT;
