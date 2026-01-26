-- Migration: seed_rmm_skus_company_004_part2
-- Description: Seed SKUs for Tangier Pharma Industries (004) - Part 2 (Products 507-512, 12 SKUs)
-- Date: 2026-01-24
-- Task: 1.1.3.6 (Seed Data Fixes)
-- Owner: Hassan (QA/Assurance Engineer)
-- Compliance: Deterministic IDs + idempotent UPSERTs

BEGIN;

INSERT INTO skus (
    id, product_id, sku_code, name, dosage_strength, dosage_form, pack_size, unit_of_measure, atc_code_id,
    is_moh_authorized_unregistered, is_active, created_at, updated_at
)
VALUES
    -- Product 507: Lansoprazole 30mg
    ('00000000-0000-0000-0000-000000001513', '00000000-0000-0000-0000-000000000507', 'SKU-LAN-30-001', 'Lansoprazole 30mg Capsule', '30mg', 'Capsule', '14 capsules', 'capsules', '00000000-0000-0000-0000-000000000256', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000001514', '00000000-0000-0000-0000-000000000507', 'SKU-LAN-30-002', 'Lansoprazole 30mg Capsule', '30mg', 'Capsule', '28 capsules', 'capsules', '00000000-0000-0000-0000-000000000256', false, true, now(), now()),
    -- Product 508: Lansoprazole 15mg
    ('00000000-0000-0000-0000-000000001515', '00000000-0000-0000-0000-000000000508', 'SKU-LAN-15-001', 'Lansoprazole 15mg Capsule', '15mg', 'Capsule', '14 capsules', 'capsules', '00000000-0000-0000-0000-000000000257', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000001516', '00000000-0000-0000-0000-000000000508', 'SKU-LAN-15-002', 'Lansoprazole 15mg Capsule', '15mg', 'Capsule', '28 capsules', 'capsules', '00000000-0000-0000-0000-000000000257', false, true, now(), now()),
    -- Product 509: Esomeprazole 40mg
    ('00000000-0000-0000-0000-000000001517', '00000000-0000-0000-0000-000000000509', 'SKU-ESO-40-001', 'Esomeprazole 40mg Capsule', '40mg', 'Capsule', '14 capsules', 'capsules', '00000000-0000-0000-0000-000000000258', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000001518', '00000000-0000-0000-0000-000000000509', 'SKU-ESO-40-002', 'Esomeprazole 40mg Capsule', '40mg', 'Capsule', '28 capsules', 'capsules', '00000000-0000-0000-0000-000000000258', false, true, now(), now()),
    -- Product 510: Esomeprazole 20mg
    ('00000000-0000-0000-0000-000000001519', '00000000-0000-0000-0000-000000000510', 'SKU-ESO-20-001', 'Esomeprazole 20mg Capsule', '20mg', 'Capsule', '14 capsules', 'capsules', '00000000-0000-0000-0000-000000000259', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000001520', '00000000-0000-0000-0000-000000000510', 'SKU-ESO-20-002', 'Esomeprazole 20mg Capsule', '20mg', 'Capsule', '28 capsules', 'capsules', '00000000-0000-0000-0000-000000000259', false, true, now(), now()),
    -- Product 511: Famotidine 20mg
    ('00000000-0000-0000-0000-000000001521', '00000000-0000-0000-0000-000000000511', 'SKU-FAM-20-001', 'Famotidine 20mg Tablet', '20mg', 'Tablet', '20 tablets', 'tablets', '00000000-0000-0000-0000-000000000260', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000001522', '00000000-0000-0000-0000-000000000511', 'SKU-FAM-20-002', 'Famotidine 20mg Tablet', '20mg', 'Tablet', '40 tablets', 'tablets', '00000000-0000-0000-0000-000000000260', false, true, now(), now()),
    -- Product 512: Famotidine 40mg
    ('00000000-0000-0000-0000-000000001523', '00000000-0000-0000-0000-000000000512', 'SKU-FAM-40-001', 'Famotidine 40mg Tablet', '40mg', 'Tablet', '20 tablets', 'tablets', '00000000-0000-0000-0000-000000000261', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000001524', '00000000-0000-0000-0000-000000000512', 'SKU-FAM-40-002', 'Famotidine 40mg Tablet', '40mg', 'Tablet', '40 tablets', 'tablets', '00000000-0000-0000-0000-000000000261', false, true, now(), now())
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
