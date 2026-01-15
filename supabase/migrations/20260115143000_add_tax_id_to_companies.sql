-- Migration: add_tax_id_to_companies
-- Description: Add tax_id to companies for Company Detail/Create/Edit wireframes
-- Date: 2026-01-15
-- Author: Nadia
-- Phase: 1.1.2 (wireframe/db alignment hard-gate)

BEGIN;

ALTER TABLE companies
  ADD COLUMN IF NOT EXISTS tax_id text;

CREATE INDEX IF NOT EXISTS idx_companies_tax_id ON companies(tax_id);

COMMIT;

