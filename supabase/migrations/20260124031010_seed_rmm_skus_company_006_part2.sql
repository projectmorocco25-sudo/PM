-- Migration: seed_rmm_skus_company_006_part2
-- Description: Seed SKUs for Fes Pharma Industries (006) - Part 2 (Products 707-712, 12 SKUs)
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
    -- Product 707: Sitagliptin 100mg
    ('00000000-0000-0000-0000-000000001713', '00000000-0000-0000-0000-000000000707', 'SKU-SIT-100-001', 'Sitagliptin 100mg Tablet', '100mg', 'Tablet', '30 tablets', 'tablets', '00000000-0000-0000-0000-000000000280', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000001714', '00000000-0000-0000-0000-000000000707', 'SKU-SIT-100-002', 'Sitagliptin 100mg Tablet', '100mg', 'Tablet', '60 tablets', 'tablets', '00000000-0000-0000-0000-000000000280', false, true, now(), now()),
    -- Product 708: Sitagliptin 50mg
    ('00000000-0000-0000-0000-000000001715', '00000000-0000-0000-0000-000000000708', 'SKU-SIT-50-001', 'Sitagliptin 50mg Tablet', '50mg', 'Tablet', '30 tablets', 'tablets', '00000000-0000-0000-0000-000000000281', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000001716', '00000000-0000-0000-0000-000000000708', 'SKU-SIT-50-002', 'Sitagliptin 50mg Tablet', '50mg', 'Tablet', '60 tablets', 'tablets', '00000000-0000-0000-0000-000000000281', false, true, now(), now()),
    -- Product 709: Insulin Aspart
    ('00000000-0000-0000-0000-000000001717', '00000000-0000-0000-0000-000000000709', 'SKU-INS-ASP-001', 'Insulin Aspart 100IU/ml', '100IU/ml', 'Injection', '10ml vial', 'vials', '00000000-0000-0000-0000-000000000282', true, true, now(), now()),
    ('00000000-0000-0000-0000-000000001718', '00000000-0000-0000-0000-000000000709', 'SKU-INS-ASP-002', 'Insulin Aspart 100IU/ml', '100IU/ml', 'Injection', '3ml pen', 'pens', '00000000-0000-0000-0000-000000000282', true, true, now(), now()),
    -- Product 710: Insulin Lispro
    ('00000000-0000-0000-0000-000000001719', '00000000-0000-0000-0000-000000000710', 'SKU-INS-LIS-001', 'Insulin Lispro 100IU/ml', '100IU/ml', 'Injection', '10ml vial', 'vials', '00000000-0000-0000-0000-000000000283', true, true, now(), now()),
    ('00000000-0000-0000-0000-000000001720', '00000000-0000-0000-0000-000000000710', 'SKU-INS-LIS-002', 'Insulin Lispro 100IU/ml', '100IU/ml', 'Injection', '3ml pen', 'pens', '00000000-0000-0000-0000-000000000283', true, true, now(), now()),
    -- Product 711: Insulin NPH
    ('00000000-0000-0000-0000-000000001721', '00000000-0000-0000-0000-000000000711', 'SKU-INS-NPH-001', 'Insulin NPH 100IU/ml', '100IU/ml', 'Injection', '10ml vial', 'vials', '00000000-0000-0000-0000-000000000284', true, true, now(), now()),
    ('00000000-0000-0000-0000-000000001722', '00000000-0000-0000-0000-000000000711', 'SKU-INS-NPH-002', 'Insulin NPH 100IU/ml', '100IU/ml', 'Injection', '3ml pen', 'pens', '00000000-0000-0000-0000-000000000284', true, true, now(), now()),
    -- Product 712: Insulin Regular
    ('00000000-0000-0000-0000-000000001723', '00000000-0000-0000-0000-000000000712', 'SKU-INS-REG-001', 'Insulin Regular 100IU/ml', '100IU/ml', 'Injection', '10ml vial', 'vials', '00000000-0000-0000-0000-000000000285', true, true, now(), now()),
    ('00000000-0000-0000-0000-000000001724', '00000000-0000-0000-0000-000000000712', 'SKU-INS-REG-002', 'Insulin Regular 100IU/ml', '100IU/ml', 'Injection', '3ml pen', 'pens', '00000000-0000-0000-0000-000000000285', true, true, now(), now())
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
