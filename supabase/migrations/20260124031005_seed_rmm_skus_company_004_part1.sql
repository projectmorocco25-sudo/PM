-- Migration: seed_rmm_skus_company_004_part1
-- Description: Seed SKUs for Tangier Pharma Industries (004) - Part 1 (Products 501-506, 12 SKUs)
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
    -- Product 501: Pantoprazole 40mg
    ('00000000-0000-0000-0000-000000001501', '00000000-0000-0000-0000-000000000501', 'SKU-PAN-40-001', 'Pantoprazole 40mg Tablet', '40mg', 'Tablet', '14 tablets', 'tablets', '00000000-0000-0000-0000-000000000300', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000001502', '00000000-0000-0000-0000-000000000501', 'SKU-PAN-40-002', 'Pantoprazole 40mg Tablet', '40mg', 'Tablet', '28 tablets', 'tablets', '00000000-0000-0000-0000-000000000300', false, true, now(), now()),
    -- Product 502: Pantoprazole 20mg
    ('00000000-0000-0000-0000-000000001503', '00000000-0000-0000-0000-000000000502', 'SKU-PAN-20-001', 'Pantoprazole 20mg Tablet', '20mg', 'Tablet', '14 tablets', 'tablets', '00000000-0000-0000-0000-000000000301', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000001504', '00000000-0000-0000-0000-000000000502', 'SKU-PAN-20-002', 'Pantoprazole 20mg Tablet', '20mg', 'Tablet', '28 tablets', 'tablets', '00000000-0000-0000-0000-000000000301', false, true, now(), now()),
    -- Product 503: Ranitidine 150mg
    ('00000000-0000-0000-0000-000000001505', '00000000-0000-0000-0000-000000000503', 'SKU-RAN-150-001', 'Ranitidine 150mg Tablet', '150mg', 'Tablet', '20 tablets', 'tablets', '00000000-0000-0000-0000-000000000302', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000001506', '00000000-0000-0000-0000-000000000503', 'SKU-RAN-150-002', 'Ranitidine 150mg Tablet', '150mg', 'Tablet', '40 tablets', 'tablets', '00000000-0000-0000-0000-000000000302', false, true, now(), now()),
    -- Product 504: Ranitidine 300mg
    ('00000000-0000-0000-0000-000000001507', '00000000-0000-0000-0000-000000000504', 'SKU-RAN-300-001', 'Ranitidine 300mg Tablet', '300mg', 'Tablet', '20 tablets', 'tablets', '00000000-0000-0000-0000-000000000303', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000001508', '00000000-0000-0000-0000-000000000504', 'SKU-RAN-300-002', 'Ranitidine 300mg Tablet', '300mg', 'Tablet', '40 tablets', 'tablets', '00000000-0000-0000-0000-000000000303', false, true, now(), now()),
    -- Product 505: Domperidone 10mg
    ('00000000-0000-0000-0000-000000001509', '00000000-0000-0000-0000-000000000505', 'SKU-DOM-10-001', 'Domperidone 10mg Tablet', '10mg', 'Tablet', '30 tablets', 'tablets', '00000000-0000-0000-0000-000000000304', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000001510', '00000000-0000-0000-0000-000000000505', 'SKU-DOM-10-002', 'Domperidone 10mg Tablet', '10mg', 'Tablet', '60 tablets', 'tablets', '00000000-0000-0000-0000-000000000304', false, true, now(), now()),
    -- Product 506: Domperidone 5mg
    ('00000000-0000-0000-0000-000000001511', '00000000-0000-0000-0000-000000000506', 'SKU-DOM-5-001', 'Domperidone 5mg Tablet', '5mg', 'Tablet', '30 tablets', 'tablets', '00000000-0000-0000-0000-000000000305', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000001512', '00000000-0000-0000-0000-000000000506', 'SKU-DOM-5-002', 'Domperidone 5mg Tablet', '5mg', 'Tablet', '60 tablets', 'tablets', '00000000-0000-0000-0000-000000000305', false, true, now(), now())
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
