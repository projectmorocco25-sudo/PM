-- Migration: seed_rmm_skus_company_005_part1
-- Description: Seed SKUs for Agadir Pharma Industries (005) - Part 1 (Products 601-606, 12 SKUs)
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
    -- Product 601: Atenolol 50mg
    ('00000000-0000-0000-0000-000000001601', '00000000-0000-0000-0000-000000000601', 'SKU-ATE-50-001', 'Atenolol 50mg Tablet', '50mg', 'Tablet', '30 tablets', 'tablets', '00000000-0000-0000-0000-000000000262', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000001602', '00000000-0000-0000-0000-000000000601', 'SKU-ATE-50-002', 'Atenolol 50mg Tablet', '50mg', 'Tablet', '60 tablets', 'tablets', '00000000-0000-0000-0000-000000000262', false, true, now(), now()),
    -- Product 602: Atenolol 100mg
    ('00000000-0000-0000-0000-000000001603', '00000000-0000-0000-0000-000000000602', 'SKU-ATE-100-001', 'Atenolol 100mg Tablet', '100mg', 'Tablet', '30 tablets', 'tablets', '00000000-0000-0000-0000-000000000263', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000001604', '00000000-0000-0000-0000-000000000602', 'SKU-ATE-100-002', 'Atenolol 100mg Tablet', '100mg', 'Tablet', '60 tablets', 'tablets', '00000000-0000-0000-0000-000000000263', false, true, now(), now()),
    -- Product 603: Propranolol 40mg
    ('00000000-0000-0000-0000-000000001605', '00000000-0000-0000-0000-000000000603', 'SKU-PRO-40-001', 'Propranolol 40mg Tablet', '40mg', 'Tablet', '30 tablets', 'tablets', '00000000-0000-0000-0000-000000000264', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000001606', '00000000-0000-0000-0000-000000000603', 'SKU-PRO-40-002', 'Propranolol 40mg Tablet', '40mg', 'Tablet', '60 tablets', 'tablets', '00000000-0000-0000-0000-000000000264', false, true, now(), now()),
    -- Product 604: Propranolol 80mg
    ('00000000-0000-0000-0000-000000001607', '00000000-0000-0000-0000-000000000604', 'SKU-PRO-80-001', 'Propranolol 80mg Tablet', '80mg', 'Tablet', '30 tablets', 'tablets', '00000000-0000-0000-0000-000000000265', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000001608', '00000000-0000-0000-0000-000000000604', 'SKU-PRO-80-002', 'Propranolol 80mg Tablet', '80mg', 'Tablet', '60 tablets', 'tablets', '00000000-0000-0000-0000-000000000265', false, true, now(), now()),
    -- Product 605: Carvedilol 25mg
    ('00000000-0000-0000-0000-000000001609', '00000000-0000-0000-0000-000000000605', 'SKU-CAR-25-001', 'Carvedilol 25mg Tablet', '25mg', 'Tablet', '30 tablets', 'tablets', '00000000-0000-0000-0000-000000000266', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000001610', '00000000-0000-0000-0000-000000000605', 'SKU-CAR-25-002', 'Carvedilol 25mg Tablet', '25mg', 'Tablet', '60 tablets', 'tablets', '00000000-0000-0000-0000-000000000266', false, true, now(), now()),
    -- Product 606: Carvedilol 12.5mg
    ('00000000-0000-0000-0000-000000001611', '00000000-0000-0000-0000-000000000606', 'SKU-CAR-12.5-001', 'Carvedilol 12.5mg Tablet', '12.5mg', 'Tablet', '30 tablets', 'tablets', '00000000-0000-0000-0000-000000000267', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000001612', '00000000-0000-0000-0000-000000000606', 'SKU-CAR-12.5-002', 'Carvedilol 12.5mg Tablet', '12.5mg', 'Tablet', '60 tablets', 'tablets', '00000000-0000-0000-0000-000000000267', false, true, now(), now())
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
