-- Migration: seed_rmm_skus_company_009_part1
-- Description: Seed SKUs for Kenitra Pharma Industries (009) - Part 1 (Products 1001-1006, 12 SKUs)
-- Date: 2026-01-24
-- Task: 1.1.3.6 (Seed Data Fixes)
-- Owner: Hassan (QA/Assurance Engineer)
-- Compliance: Deterministic IDs + idempotent UPSERTs

BEGIN;

-- ============================================================================
-- Seed SKUs for Kenitra Pharma Industries (009) - Part 1
-- Products: 1001-1006 (12 SKUs = 2 SKUs per product)
-- ============================================================================

INSERT INTO skus (
    id, product_id, sku_code, name, dosage_strength, dosage_form, pack_size, unit_of_measure, atc_code_id,
    is_moh_authorized_unregistered, is_active, created_at, updated_at
)
VALUES
    -- Product 1001: Hydrochlorothiazide 25mg
    ('00000000-0000-0000-0000-000000002001', '00000000-0000-0000-0000-000000001001', 'SKU-HYD-25-001', 'Hydrochlorothiazide 25mg Tablet', '25mg', 'Tablet', '30 tablets', 'tablets', '00000000-0000-0000-0000-000000000294', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000002002', '00000000-0000-0000-0000-000000001001', 'SKU-HYD-25-002', 'Hydrochlorothiazide 25mg Tablet', '25mg', 'Tablet', '60 tablets', 'tablets', '00000000-0000-0000-0000-000000000294', false, true, now(), now()),
    -- Product 1002: Hydrochlorothiazide 12.5mg
    ('00000000-0000-0000-0000-000000002003', '00000000-0000-0000-0000-000000001002', 'SKU-HYD-12.5-001', 'Hydrochlorothiazide 12.5mg Tablet', '12.5mg', 'Tablet', '30 tablets', 'tablets', '00000000-0000-0000-0000-000000000295', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000002004', '00000000-0000-0000-0000-000000001002', 'SKU-HYD-12.5-002', 'Hydrochlorothiazide 12.5mg Tablet', '12.5mg', 'Tablet', '60 tablets', 'tablets', '00000000-0000-0000-0000-000000000295', false, true, now(), now()),
    -- Product 1003: Spironolactone 25mg
    ('00000000-0000-0000-0000-000000002005', '00000000-0000-0000-0000-000000001003', 'SKU-SPI-25-001', 'Spironolactone 25mg Tablet', '25mg', 'Tablet', '30 tablets', 'tablets', '00000000-0000-0000-0000-000000000296', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000002006', '00000000-0000-0000-0000-000000001003', 'SKU-SPI-25-002', 'Spironolactone 25mg Tablet', '25mg', 'Tablet', '60 tablets', 'tablets', '00000000-0000-0000-0000-000000000296', false, true, now(), now()),
    -- Product 1004: Spironolactone 50mg
    ('00000000-0000-0000-0000-000000002007', '00000000-0000-0000-0000-000000001004', 'SKU-SPI-50-001', 'Spironolactone 50mg Tablet', '50mg', 'Tablet', '30 tablets', 'tablets', '00000000-0000-0000-0000-000000000297', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000002008', '00000000-0000-0000-0000-000000001004', 'SKU-SPI-50-002', 'Spironolactone 50mg Tablet', '50mg', 'Tablet', '60 tablets', 'tablets', '00000000-0000-0000-0000-000000000297', false, true, now(), now()),
    -- Product 1005: Amiloride 5mg
    ('00000000-0000-0000-0000-000000002009', '00000000-0000-0000-0000-000000001005', 'SKU-AMIL-5-001', 'Amiloride 5mg Tablet', '5mg', 'Tablet', '30 tablets', 'tablets', '00000000-0000-0000-0000-000000000298', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000002010', '00000000-0000-0000-0000-000000001005', 'SKU-AMIL-5-002', 'Amiloride 5mg Tablet', '5mg', 'Tablet', '60 tablets', 'tablets', '00000000-0000-0000-0000-000000000298', false, true, now(), now()),
    -- Product 1006: Triamterene 50mg
    ('00000000-0000-0000-0000-000000002011', '00000000-0000-0000-0000-000000001006', 'SKU-TRI-50-001', 'Triamterene 50mg Capsule', '50mg', 'Capsule', '30 capsules', 'capsules', '00000000-0000-0000-0000-000000000299', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000002012', '00000000-0000-0000-0000-000000001006', 'SKU-TRI-50-002', 'Triamterene 50mg Capsule', '50mg', 'Capsule', '60 capsules', 'capsules', '00000000-0000-0000-0000-000000000299', false, true, now(), now())
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
