-- Migration: seed_rmm_skus_company_011_part1
-- Description: Seed SKUs for Safi Pharma Industries (011) - Part 1 (Products 1201-1206, 12 SKUs)
-- Date: 2026-01-24
-- Task: 1.1.3.6 (Seed Data Fixes)
-- Owner: Hassan (QA/Assurance Engineer)
-- Compliance: Deterministic IDs + idempotent UPSERTs

BEGIN;

-- ============================================================================
-- Seed SKUs for Safi Pharma Industries (011) - Part 1
-- Products: 1201-1206 (12 SKUs = 2 SKUs per product)
-- ============================================================================

INSERT INTO skus (
    id, product_id, sku_code, name, dosage_strength, dosage_form, pack_size, unit_of_measure, atc_code_id,
    is_moh_authorized_unregistered, is_active, created_at, updated_at
)
VALUES
    -- Product 1201: Tramadol 50mg
    ('00000000-0000-0000-0000-000000002201', '00000000-0000-0000-0000-000000001201', 'SKU-TRA-50-001', 'Tramadol 50mg Capsule', '50mg', 'Capsule', '30 capsules', 'capsules', '00000000-0000-0000-0000-000000000300', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000002202', '00000000-0000-0000-0000-000000001201', 'SKU-TRA-50-002', 'Tramadol 50mg Capsule', '50mg', 'Capsule', '60 capsules', 'capsules', '00000000-0000-0000-0000-000000000300', false, true, now(), now()),
    -- Product 1202: Tramadol 100mg
    ('00000000-0000-0000-0000-000000002203', '00000000-0000-0000-0000-000000001202', 'SKU-TRA-100-001', 'Tramadol 100mg Capsule', '100mg', 'Capsule', '30 capsules', 'capsules', '00000000-0000-0000-0000-000000000301', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000002204', '00000000-0000-0000-0000-000000001202', 'SKU-TRA-100-002', 'Tramadol 100mg Capsule', '100mg', 'Capsule', '60 capsules', 'capsules', '00000000-0000-0000-0000-000000000301', false, true, now(), now()),
    -- Product 1203: Codeine 30mg
    ('00000000-0000-0000-0000-000000002205', '00000000-0000-0000-0000-000000001203', 'SKU-COD-30-001', 'Codeine 30mg Tablet', '30mg', 'Tablet', '30 tablets', 'tablets', '00000000-0000-0000-0000-000000000302', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000002206', '00000000-0000-0000-0000-000000001203', 'SKU-COD-30-002', 'Codeine 30mg Tablet', '30mg', 'Tablet', '60 tablets', 'tablets', '00000000-0000-0000-0000-000000000302', false, true, now(), now()),
    -- Product 1204: Codeine 15mg
    ('00000000-0000-0000-0000-000000002207', '00000000-0000-0000-0000-000000001204', 'SKU-COD-15-001', 'Codeine 15mg Tablet', '15mg', 'Tablet', '30 tablets', 'tablets', '00000000-0000-0000-0000-000000000303', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000002208', '00000000-0000-0000-0000-000000001204', 'SKU-COD-15-002', 'Codeine 15mg Tablet', '15mg', 'Tablet', '60 tablets', 'tablets', '00000000-0000-0000-0000-000000000303', false, true, now(), now()),
    -- Product 1205: Morphine 10mg
    ('00000000-0000-0000-0000-000000002209', '00000000-0000-0000-0000-000000001205', 'SKU-MOR-10-001', 'Morphine 10mg Tablet', '10mg', 'Tablet', '30 tablets', 'tablets', '00000000-0000-0000-0000-000000000304', true, true, now(), now()),
    ('00000000-0000-0000-0000-000000002210', '00000000-0000-0000-0000-000000001205', 'SKU-MOR-10-002', 'Morphine 10mg Tablet', '10mg', 'Tablet', '60 tablets', 'tablets', '00000000-0000-0000-0000-000000000304', true, true, now(), now()),
    -- Product 1206: Morphine 5mg
    ('00000000-0000-0000-0000-000000002211', '00000000-0000-0000-0000-000000001206', 'SKU-MOR-5-001', 'Morphine 5mg Tablet', '5mg', 'Tablet', '30 tablets', 'tablets', '00000000-0000-0000-0000-000000000305', true, true, now(), now()),
    ('00000000-0000-0000-0000-000000002212', '00000000-0000-0000-0000-000000001206', 'SKU-MOR-5-002', 'Morphine 5mg Tablet', '5mg', 'Tablet', '60 tablets', 'tablets', '00000000-0000-0000-0000-000000000305', true, true, now(), now())
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
