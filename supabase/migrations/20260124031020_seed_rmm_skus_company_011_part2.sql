-- Migration: seed_rmm_skus_company_011_part2
-- Description: Seed SKUs for Safi Pharma Industries (011) - Part 2 (Products 1207-1212, 12 SKUs)
-- Date: 2026-01-24
-- Task: 1.1.3.6 (Seed Data Fixes)
-- Owner: Hassan (QA/Assurance Engineer)
-- Compliance: Deterministic IDs + idempotent UPSERTs

BEGIN;

-- ============================================================================
-- Seed SKUs for Safi Pharma Industries (011) - Part 2
-- Products: 1207-1212 (12 SKUs = 2 SKUs per product)
-- ============================================================================

INSERT INTO skus (
    id, product_id, sku_code, name, dosage_strength, dosage_form, pack_size, unit_of_measure, atc_code_id,
    is_moh_authorized_unregistered, is_active, created_at, updated_at
)
VALUES
    -- Product 1207: Gabapentin 300mg
    ('00000000-0000-0000-0000-000000002213', '00000000-0000-0000-0000-000000001207', 'SKU-GAB-300-001', 'Gabapentin 300mg Capsule', '300mg', 'Capsule', '30 capsules', 'capsules', '00000000-0000-0000-0000-000000000288', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000002214', '00000000-0000-0000-0000-000000001207', 'SKU-GAB-300-002', 'Gabapentin 300mg Capsule', '300mg', 'Capsule', '60 capsules', 'capsules', '00000000-0000-0000-0000-000000000288', false, true, now(), now()),
    -- Product 1208: Gabapentin 600mg
    ('00000000-0000-0000-0000-000000002215', '00000000-0000-0000-0000-000000001208', 'SKU-GAB-600-001', 'Gabapentin 600mg Capsule', '600mg', 'Capsule', '30 capsules', 'capsules', '00000000-0000-0000-0000-000000000289', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000002216', '00000000-0000-0000-0000-000000001208', 'SKU-GAB-600-002', 'Gabapentin 600mg Capsule', '600mg', 'Capsule', '60 capsules', 'capsules', '00000000-0000-0000-0000-000000000289', false, true, now(), now()),
    -- Product 1209: Pregabalin 75mg
    ('00000000-0000-0000-0000-000000002217', '00000000-0000-0000-0000-000000001209', 'SKU-PRE-75-001', 'Pregabalin 75mg Capsule', '75mg', 'Capsule', '30 capsules', 'capsules', '00000000-0000-0000-0000-000000000290', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000002218', '00000000-0000-0000-0000-000000001209', 'SKU-PRE-75-002', 'Pregabalin 75mg Capsule', '75mg', 'Capsule', '60 capsules', 'capsules', '00000000-0000-0000-0000-000000000290', false, true, now(), now()),
    -- Product 1210: Pregabalin 150mg
    ('00000000-0000-0000-0000-000000002219', '00000000-0000-0000-0000-000000001210', 'SKU-PRE-150-001', 'Pregabalin 150mg Capsule', '150mg', 'Capsule', '30 capsules', 'capsules', '00000000-0000-0000-0000-000000000291', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000002220', '00000000-0000-0000-0000-000000001210', 'SKU-PRE-150-002', 'Pregabalin 150mg Capsule', '150mg', 'Capsule', '60 capsules', 'capsules', '00000000-0000-0000-0000-000000000291', false, true, now(), now()),
    -- Product 1211: Diclofenac 50mg
    ('00000000-0000-0000-0000-000000002221', '00000000-0000-0000-0000-000000001211', 'SKU-DIC-50-001', 'Diclofenac 50mg Tablet', '50mg', 'Tablet', '30 tablets', 'tablets', '00000000-0000-0000-0000-000000000292', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000002222', '00000000-0000-0000-0000-000000001211', 'SKU-DIC-50-002', 'Diclofenac 50mg Tablet', '50mg', 'Tablet', '60 tablets', 'tablets', '00000000-0000-0000-0000-000000000292', false, true, now(), now()),
    -- Product 1212: Diclofenac 100mg
    ('00000000-0000-0000-0000-000000002223', '00000000-0000-0000-0000-000000001212', 'SKU-DIC-100-001', 'Diclofenac 100mg Tablet', '100mg', 'Tablet', '30 tablets', 'tablets', '00000000-0000-0000-0000-000000000293', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000002224', '00000000-0000-0000-0000-000000001212', 'SKU-DIC-100-002', 'Diclofenac 100mg Tablet', '100mg', 'Tablet', '60 tablets', 'tablets', '00000000-0000-0000-0000-000000000293', false, true, now(), now())
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
