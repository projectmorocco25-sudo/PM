-- Migration: seed_rmm_skus_company_002_part1
-- Description: Seed SKUs for Rabat Pharma Industries (002) - Part 1 (Products 301-306, 12 SKUs)
-- Date: 2026-01-24
-- Task: 1.1.3.6 (Seed Data Fixes)
-- Owner: Hassan (QA/Assurance Engineer)
-- Compliance: Deterministic IDs + idempotent UPSERTs

BEGIN;

-- ============================================================================
-- Seed SKUs for Rabat Pharma Industries (002) - Part 1
-- Products: 301-306 (12 SKUs = 2 SKUs per product)
-- ============================================================================

INSERT INTO skus (
    id, product_id, sku_code, name, dosage_strength, dosage_form, pack_size, unit_of_measure, atc_code_id,
    is_moh_authorized_unregistered, is_active, created_at, updated_at
)
VALUES
    -- Product 301: Amlodipine 5mg
    ('00000000-0000-0000-0000-000000001301', '00000000-0000-0000-0000-000000000301', 'SKU-AML-5-001', 'Amlodipine 5mg Tablet', '5mg', 'Tablet', '30 tablets', 'tablets', '00000000-0000-0000-0000-000000000276', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000001302', '00000000-0000-0000-0000-000000000301', 'SKU-AML-5-002', 'Amlodipine 5mg Tablet', '5mg', 'Tablet', '60 tablets', 'tablets', '00000000-0000-0000-0000-000000000276', false, true, now(), now()),
    -- Product 302: Amlodipine 10mg
    ('00000000-0000-0000-0000-000000001303', '00000000-0000-0000-0000-000000000302', 'SKU-AML-10-001', 'Amlodipine 10mg Tablet', '10mg', 'Tablet', '30 tablets', 'tablets', '00000000-0000-0000-0000-000000000277', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000001304', '00000000-0000-0000-0000-000000000302', 'SKU-AML-10-002', 'Amlodipine 10mg Tablet', '10mg', 'Tablet', '60 tablets', 'tablets', '00000000-0000-0000-0000-000000000277', false, true, now(), now()),
    -- Product 303: Losartan 50mg
    ('00000000-0000-0000-0000-000000001305', '00000000-0000-0000-0000-000000000303', 'SKU-LOS-50-001', 'Losartan 50mg Tablet', '50mg', 'Tablet', '30 tablets', 'tablets', '00000000-0000-0000-0000-000000000278', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000001306', '00000000-0000-0000-0000-000000000303', 'SKU-LOS-50-002', 'Losartan 50mg Tablet', '50mg', 'Tablet', '60 tablets', 'tablets', '00000000-0000-0000-0000-000000000278', false, true, now(), now()),
    -- Product 304: Losartan 100mg
    ('00000000-0000-0000-0000-000000001307', '00000000-0000-0000-0000-000000000304', 'SKU-LOS-100-001', 'Losartan 100mg Tablet', '100mg', 'Tablet', '30 tablets', 'tablets', '00000000-0000-0000-0000-000000000279', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000001308', '00000000-0000-0000-0000-000000000304', 'SKU-LOS-100-002', 'Losartan 100mg Tablet', '100mg', 'Tablet', '60 tablets', 'tablets', '00000000-0000-0000-0000-000000000279', false, true, now(), now()),
    -- Product 305: Simvastatin 20mg
    ('00000000-0000-0000-0000-000000001309', '00000000-0000-0000-0000-000000000305', 'SKU-SIM-20-001', 'Simvastatin 20mg Tablet', '20mg', 'Tablet', '30 tablets', 'tablets', '00000000-0000-0000-0000-000000000280', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000001310', '00000000-0000-0000-0000-000000000305', 'SKU-SIM-20-002', 'Simvastatin 20mg Tablet', '20mg', 'Tablet', '60 tablets', 'tablets', '00000000-0000-0000-0000-000000000280', false, true, now(), now()),
    -- Product 306: Simvastatin 40mg
    ('00000000-0000-0000-0000-000000001311', '00000000-0000-0000-0000-000000000306', 'SKU-SIM-40-001', 'Simvastatin 40mg Tablet', '40mg', 'Tablet', '30 tablets', 'tablets', '00000000-0000-0000-0000-000000000281', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000001312', '00000000-0000-0000-0000-000000000306', 'SKU-SIM-40-002', 'Simvastatin 40mg Tablet', '40mg', 'Tablet', '60 tablets', 'tablets', '00000000-0000-0000-0000-000000000281', false, true, now(), now())
ON CONFLICT (id) DO UPDATE SET
    product_id = EXCLUDED.product_id,
    sku_code = EXCLUDED.sku_code,
    name = EXCLUDED.name,
    dosage_strength = EXCLUDED.dosage_strength,
    dosage_form = EXCLUDED.dosage_form,
    pack_size = EXCLUDED.pack_size,
    unit_of_measure = EXCLUDED.unit_of_measure,
    atc_code_id = EXCLUDED.atc_code_id,
    is_moh_authorized_unregistered = EXCLUDED.is_moh_authorized_unregistered,
    is_active = EXCLUDED.is_active,
    updated_at = now();

COMMIT;
