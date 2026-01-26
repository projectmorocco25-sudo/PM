-- Migration: seed_rmm_skus_company_006_part1
-- Description: Seed SKUs for Fes Pharma Industries (006) - Part 1 (Products 701-706, 12 SKUs)
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
    -- Product 701: Gliclazide 80mg
    ('00000000-0000-0000-0000-000000001701', '00000000-0000-0000-0000-000000000701', 'SKU-GLI-80-001', 'Gliclazide 80mg Tablet', '80mg', 'Tablet', '30 tablets', 'tablets', '00000000-0000-0000-0000-000000000274', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000001702', '00000000-0000-0000-0000-000000000701', 'SKU-GLI-80-002', 'Gliclazide 80mg Tablet', '80mg', 'Tablet', '60 tablets', 'tablets', '00000000-0000-0000-0000-000000000274', false, true, now(), now()),
    -- Product 702: Gliclazide 30mg
    ('00000000-0000-0000-0000-000000001703', '00000000-0000-0000-0000-000000000702', 'SKU-GLI-30-001', 'Gliclazide 30mg Tablet', '30mg', 'Tablet', '30 tablets', 'tablets', '00000000-0000-0000-0000-000000000275', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000001704', '00000000-0000-0000-0000-000000000702', 'SKU-GLI-30-002', 'Gliclazide 30mg Tablet', '30mg', 'Tablet', '60 tablets', 'tablets', '00000000-0000-0000-0000-000000000275', false, true, now(), now()),
    -- Product 703: Glimepiride 2mg
    ('00000000-0000-0000-0000-000000001705', '00000000-0000-0000-0000-000000000703', 'SKU-GLM-2-001', 'Glimepiride 2mg Tablet', '2mg', 'Tablet', '30 tablets', 'tablets', '00000000-0000-0000-0000-000000000276', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000001706', '00000000-0000-0000-0000-000000000703', 'SKU-GLM-2-002', 'Glimepiride 2mg Tablet', '2mg', 'Tablet', '60 tablets', 'tablets', '00000000-0000-0000-0000-000000000276', false, true, now(), now()),
    -- Product 704: Glimepiride 4mg
    ('00000000-0000-0000-0000-000000001707', '00000000-0000-0000-0000-000000000704', 'SKU-GLM-4-001', 'Glimepiride 4mg Tablet', '4mg', 'Tablet', '30 tablets', 'tablets', '00000000-0000-0000-0000-000000000277', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000001708', '00000000-0000-0000-0000-000000000704', 'SKU-GLM-4-002', 'Glimepiride 4mg Tablet', '4mg', 'Tablet', '60 tablets', 'tablets', '00000000-0000-0000-0000-000000000277', false, true, now(), now()),
    -- Product 705: Pioglitazone 15mg
    ('00000000-0000-0000-0000-000000001709', '00000000-0000-0000-0000-000000000705', 'SKU-PIO-15-001', 'Pioglitazone 15mg Tablet', '15mg', 'Tablet', '30 tablets', 'tablets', '00000000-0000-0000-0000-000000000278', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000001710', '00000000-0000-0000-0000-000000000705', 'SKU-PIO-15-002', 'Pioglitazone 15mg Tablet', '15mg', 'Tablet', '60 tablets', 'tablets', '00000000-0000-0000-0000-000000000278', false, true, now(), now()),
    -- Product 706: Pioglitazone 30mg
    ('00000000-0000-0000-0000-000000001711', '00000000-0000-0000-0000-000000000706', 'SKU-PIO-30-001', 'Pioglitazone 30mg Tablet', '30mg', 'Tablet', '30 tablets', 'tablets', '00000000-0000-0000-0000-000000000279', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000001712', '00000000-0000-0000-0000-000000000706', 'SKU-PIO-30-002', 'Pioglitazone 30mg Tablet', '30mg', 'Tablet', '60 tablets', 'tablets', '00000000-0000-0000-0000-000000000279', false, true, now(), now())
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
