-- Migration: rmm_tables
-- Description: Create RMM tables (companies, products, skus, atc_codes, critical_medicines, registry_submissions).
-- Date: 2026-01-27
-- Task: 1.1.1.3
-- Author: Sami (Implementation Compliance Specialist)
-- Dependencies: 1.1.1.2 (core tables), 1.1.1.2a (communications). update_updated_at from core_tables.

BEGIN;

-- atc_codes (MOH-controlled, no FK to other RMM tables)
CREATE TABLE IF NOT EXISTS public.atc_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  description text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_atc_codes_code ON public.atc_codes(code);
CREATE INDEX IF NOT EXISTS idx_atc_codes_is_active ON public.atc_codes(is_active);
DROP TRIGGER IF EXISTS atc_codes_updated_at ON public.atc_codes;
CREATE TRIGGER atc_codes_updated_at BEFORE UPDATE ON public.atc_codes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- companies (suspended_by -> users)
CREATE TABLE IF NOT EXISTS public.companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  registration_number text UNIQUE NOT NULL,
  company_type text NOT NULL CHECK (company_type IN ('ipc', 'wholesaler')),
  address text,
  contact_email text,
  contact_phone text,
  is_active boolean NOT NULL DEFAULT true,
  suspended_at timestamptz,
  suspended_by uuid REFERENCES public.users(id),
  suspended_reason text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_companies_registration_number ON public.companies(registration_number);
CREATE INDEX IF NOT EXISTS idx_companies_company_type ON public.companies(company_type);
CREATE INDEX IF NOT EXISTS idx_companies_is_active ON public.companies(is_active);
CREATE INDEX IF NOT EXISTS idx_companies_name ON public.companies(name);
DROP TRIGGER IF EXISTS companies_updated_at ON public.companies;
CREATE TRIGGER companies_updated_at BEFORE UPDATE ON public.companies FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- products (company_id -> companies)
CREATE TABLE IF NOT EXISTS public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  is_critical_medicine boolean NOT NULL DEFAULT false,
  is_active boolean NOT NULL DEFAULT true,
  deactivated_at timestamptz,
  deactivated_by uuid REFERENCES public.users(id),
  deactivated_reason text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_products_company_id ON public.products(company_id);
CREATE INDEX IF NOT EXISTS idx_products_is_critical_medicine ON public.products(is_critical_medicine);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON public.products(is_active);
DROP TRIGGER IF EXISTS products_updated_at ON public.products;
CREATE TRIGGER products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- skus (product_id -> products, atc_code_id -> atc_codes)
CREATE TABLE IF NOT EXISTS public.skus (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  sku_code text NOT NULL,
  name text NOT NULL,
  dosage_strength text NOT NULL,
  dosage_form text NOT NULL,
  pack_size text NOT NULL,
  unit_of_measure text NOT NULL,
  atc_code_id uuid REFERENCES public.atc_codes(id),
  is_moh_authorized_unregistered boolean NOT NULL DEFAULT false,
  is_active boolean NOT NULL DEFAULT true,
  deactivated_at timestamptz,
  deactivated_by uuid REFERENCES public.users(id),
  deactivated_reason text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_skus_product_id ON public.skus(product_id);
CREATE INDEX IF NOT EXISTS idx_skus_atc_code_id ON public.skus(atc_code_id);
CREATE INDEX IF NOT EXISTS idx_skus_is_active ON public.skus(is_active);
CREATE INDEX IF NOT EXISTS idx_skus_dosage_form ON public.skus(dosage_form);
DROP TRIGGER IF EXISTS skus_updated_at ON public.skus;
CREATE TRIGGER skus_updated_at BEFORE UPDATE ON public.skus FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- critical_medicines (sku_id -> skus, designated_by -> users)
CREATE TABLE IF NOT EXISTS public.critical_medicines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sku_id uuid NOT NULL REFERENCES public.skus(id) ON DELETE CASCADE,
  designated_at timestamptz NOT NULL DEFAULT now(),
  designated_by uuid NOT NULL REFERENCES public.users(id),
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_critical_medicines_sku_id ON public.critical_medicines(sku_id);
CREATE INDEX IF NOT EXISTS idx_critical_medicines_is_active ON public.critical_medicines(is_active);
DROP TRIGGER IF EXISTS critical_medicines_updated_at ON public.critical_medicines;
CREATE TRIGGER critical_medicines_updated_at BEFORE UPDATE ON public.critical_medicines FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- registry_submissions (submitted_by, verified_by, approved_by, implemented_by -> users)
CREATE TABLE IF NOT EXISTS public.registry_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_type text NOT NULL CHECK (submission_type IN (
    'company_create', 'company_update', 'product_create', 'product_update',
    'sku_create', 'sku_update', 'company_delete', 'product_delete', 'sku_delete'
  )),
  entity_type text NOT NULL CHECK (entity_type IN ('company', 'product', 'sku')),
  entity_id uuid,
  submission_data jsonb NOT NULL,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN (
    'draft', 'submitted', 'tier2_verified', 'tier1_approved', 'tier2_implemented', 'completed', 'rejected'
  )),
  submitted_by uuid NOT NULL REFERENCES public.users(id),
  verified_by uuid REFERENCES public.users(id),
  verified_at timestamptz,
  approved_by uuid REFERENCES public.users(id),
  approved_at timestamptz,
  implemented_by uuid REFERENCES public.users(id),
  implemented_at timestamptz,
  rejection_reason text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_registry_submissions_status ON public.registry_submissions(status);
CREATE INDEX IF NOT EXISTS idx_registry_submissions_submitted_by ON public.registry_submissions(submitted_by);
CREATE INDEX IF NOT EXISTS idx_registry_submissions_entity_type ON public.registry_submissions(entity_type);
DROP TRIGGER IF EXISTS registry_submissions_updated_at ON public.registry_submissions;
CREATE TRIGGER registry_submissions_updated_at BEFORE UPDATE ON public.registry_submissions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

ALTER TABLE public.atc_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skus ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.critical_medicines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.registry_submissions ENABLE ROW LEVEL SECURITY;

COMMIT;
