-- Migration: seed_rmm_skus_company_009_part2
-- Description: Seed SKUs for Kenitra Pharma Industries (009) - Part 2 (Products 1007-1012, 12 SKUs)
-- Date: 2026-01-24
-- Task: 1.1.3.6 (Seed Data Fixes)
-- Owner: Hassan (QA/Assurance Engineer)
-- Compliance: Deterministic IDs + idempotent UPSERTs

BEGIN;

-- ============================================================================
-- Seed SKUs for Kenitra Pharma Industries (009) - Part 2
-- Products: 1007-1012 (12 SKUs = 2 SKUs per product)
-- ============================================================================

INSERT INTO skus (
    id, product_id, sku_code, name, dosage_strength, dosage_form, pack_size, unit_of_measure, atc_code_id,
    is_moh_authorized_unregistered, is_active, created_at, updated_at
)
VALUES
    -- Product 1007: Indapamide 2.5mg
    ('00000000-0000-0000-0000-000000002013', '00000000-0000-0000-0000-000000001007', 'SKU-IND-2.5-001', 'Indapamide 2.5mg Tablet', '2.5mg', 'Tablet', '30 tablets', 'tablets', '00000000-0000-0000-0000-000000000300', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000002014', '00000000-0000-0000-0000-000000001007', 'SKU-IND-2.5-002', 'Indapamide 2.5mg Tablet', '2.5mg', 'Tablet', '60 tablets', 'tablets', '00000000-0000-0000-0000-000000000300', false, true, now(), now()),
    -- Product 1008: Bumetanide 1mg
    ('00000000-0000-0000-0000-000000002015', '00000000-0000-0000-0000-000000001008', 'SKU-BUM-1-001', 'Bumetanide 1mg Tablet', '1mg', 'Tablet', '30 tablets', 'tablets', '00000000-0000-0000-0000-000000000301', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000002016', '00000000-0000-0000-0000-000000001008', 'SKU-BUM-1-002', 'Bumetanide 1mg Tablet', '1mg', 'Tablet', '60 tablets', 'tablets', '00000000-0000-0000-0000-000000000301', false, true, now(), now()),
    -- Product 1009: Torasemide 10mg
    ('00000000-0000-0000-0000-000000002017', '00000000-0000-0000-0000-000000001009', 'SKU-TOR-10-001', 'Torasemide 10mg Tablet', '10mg', 'Tablet', '30 tablets', 'tablets', '00000000-0000-0000-0000-000000000302', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000002018', '00000000-0000-0000-0000-000000001009', 'SKU-TOR-10-002', 'Torasemide 10mg Tablet', '10mg', 'Tablet', '60 tablets', 'tablets', '00000000-0000-0000-0000-000000000302', false, true, now(), now()),
    -- Product 1010: Mannitol 20%
    ('00000000-0000-0000-0000-000000002019', '00000000-0000-0000-0000-000000001010', 'SKU-MAN-20-001', 'Mannitol 20% Injection', '20%', 'Injection', '500ml', 'bottles', '00000000-0000-0000-0000-000000000303', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000002020', '00000000-0000-0000-0000-000000001010', 'SKU-MAN-20-002', 'Mannitol 20% Injection', '20%', 'Injection', '1000ml', 'bottles', '00000000-0000-0000-0000-000000000303', false, true, now(), now()),
    -- Product 1011: Acetazolamide 250mg
    ('00000000-0000-0000-0000-000000002021', '00000000-0000-0000-0000-000000001011', 'SKU-ACE-250-001', 'Acetazolamide 250mg Tablet', '250mg', 'Tablet', '30 tablets', 'tablets', '00000000-0000-0000-0000-000000000304', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000002022', '00000000-0000-0000-0000-000000001011', 'SKU-ACE-250-002', 'Acetazolamide 250mg Tablet', '250mg', 'Tablet', '60 tablets', 'tablets', '00000000-0000-0000-0000-000000000304', false, true, now(), now()),
    -- Product 1012: Chlorthalidone 25mg
    ('00000000-0000-0000-0000-000000002023', '00000000-0000-0000-0000-000000001012', 'SKU-CHL-25-001', 'Chlorthalidone 25mg Tablet', '25mg', 'Tablet', '30 tablets', 'tablets', '00000000-0000-0000-0000-000000000305', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000002024', '00000000-0000-0000-0000-000000001012', 'SKU-CHL-25-002', 'Chlorthalidone 25mg Tablet', '25mg', 'Tablet', '60 tablets', 'tablets', '00000000-0000-0000-0000-000000000305', false, true, now(), now())
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
