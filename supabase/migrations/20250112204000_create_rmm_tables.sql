-- Migration: create_rmm_tables
-- Description: Create RMM core tables (companies, products, skus, atc_codes, critical_medicines) and add missing FKs to companies
-- Date: 2025-01-12
-- Author: Nadia
-- Phase: 1.1.1
-- Task: 1.1.1.7
-- Depends on: 20250112120000_create_core_tables

BEGIN;

-- Companies
CREATE TABLE IF NOT EXISTS companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  registration_number text UNIQUE NOT NULL,
  company_type text NOT NULL CHECK (company_type IN ('ipc', 'wholesaler')),
  address text,
  contact_email text,
  contact_phone text,
  is_active boolean DEFAULT true,
  suspended_at timestamptz,
  suspended_by uuid REFERENCES users(id),
  suspended_reason text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_companies_registration_number ON companies(registration_number);
CREATE INDEX IF NOT EXISTS idx_companies_company_type ON companies(company_type);
CREATE INDEX IF NOT EXISTS idx_companies_is_active ON companies(is_active);

CREATE TRIGGER set_companies_updated_at
BEFORE UPDATE ON companies
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ATC codes (MOH controlled)
CREATE TABLE IF NOT EXISTS atc_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  description text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_atc_codes_code ON atc_codes(code);

CREATE TRIGGER set_atc_codes_updated_at
BEFORE UPDATE ON atc_codes
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Products
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  is_critical_medicine boolean DEFAULT false,
  is_active boolean DEFAULT true,
  deactivated_at timestamptz,
  deactivated_by uuid REFERENCES users(id),
  deactivated_reason text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_products_company_id ON products(company_id);
CREATE INDEX IF NOT EXISTS idx_products_is_critical_medicine ON products(is_critical_medicine);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active);

CREATE TRIGGER set_products_updated_at
BEFORE UPDATE ON products
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- SKUs (with pharmaceutical attributes)
CREATE TABLE IF NOT EXISTS skus (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  sku_code text NOT NULL,
  name text NOT NULL,
  dosage_strength text NOT NULL,
  dosage_form text NOT NULL,
  pack_size text NOT NULL,
  unit_of_measure text NOT NULL,
  atc_code_id uuid REFERENCES atc_codes(id),
  is_moh_authorized_unregistered boolean DEFAULT false,
  is_active boolean DEFAULT true,
  deactivated_at timestamptz,
  deactivated_by uuid REFERENCES users(id),
  deactivated_reason text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_skus_product_id ON skus(product_id);
CREATE INDEX IF NOT EXISTS idx_skus_atc_code_id ON skus(atc_code_id);
CREATE INDEX IF NOT EXISTS idx_skus_is_active ON skus(is_active);
CREATE INDEX IF NOT EXISTS idx_skus_dosage_form ON skus(dosage_form);

CREATE TRIGGER set_skus_updated_at
BEFORE UPDATE ON skus
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Critical medicines (MOH controlled)
CREATE TABLE IF NOT EXISTS critical_medicines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sku_id uuid NOT NULL REFERENCES skus(id) ON DELETE CASCADE,
  designated_at timestamptz DEFAULT now(),
  designated_by uuid NOT NULL REFERENCES users(id),
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_critical_medicines_sku_id ON critical_medicines(sku_id);

CREATE TRIGGER set_critical_medicines_updated_at
BEFORE UPDATE ON critical_medicines
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Add missing foreign keys to companies now that companies exists
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'fk_users_company'
  ) THEN
    ALTER TABLE users
      ADD CONSTRAINT fk_users_company
      FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE SET NULL;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'fk_conversations_company'
  ) THEN
    ALTER TABLE conversations
      ADD CONSTRAINT fk_conversations_company
      FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE SET NULL;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'fk_follow_ups_company'
  ) THEN
    ALTER TABLE follow_ups
      ADD CONSTRAINT fk_follow_ups_company
      FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE;
  END IF;
END $$;

COMMIT;

