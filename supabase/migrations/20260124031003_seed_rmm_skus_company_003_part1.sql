-- Migration: seed_rmm_skus_company_003_part1
-- Description: Seed SKUs for Marrakech Pharma Industries (003) - Part 1 (Products 401-406, 12 SKUs)
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
    -- Product 401: Ciprofloxacin 500mg
    ('00000000-0000-0000-0000-000000001401', '00000000-0000-0000-0000-000000000401', 'SKU-CIP-500-001', 'Ciprofloxacin 500mg Tablet', '500mg', 'Tablet', '10 tablets', 'tablets', '00000000-0000-0000-0000-000000000288', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000001402', '00000000-0000-0000-0000-000000000401', 'SKU-CIP-500-002', 'Ciprofloxacin 500mg Tablet', '500mg', 'Tablet', '20 tablets', 'tablets', '00000000-0000-0000-0000-000000000288', false, true, now(), now()),
    -- Product 402: Ciprofloxacin 250mg
    ('00000000-0000-0000-0000-000000001403', '00000000-0000-0000-0000-000000000402', 'SKU-CIP-250-001', 'Ciprofloxacin 250mg Tablet', '250mg', 'Tablet', '10 tablets', 'tablets', '00000000-0000-0000-0000-000000000289', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000001404', '00000000-0000-0000-0000-000000000402', 'SKU-CIP-250-002', 'Ciprofloxacin 250mg Tablet', '250mg', 'Tablet', '20 tablets', 'tablets', '00000000-0000-0000-0000-000000000289', false, true, now(), now()),
    -- Product 403: Doxycycline 100mg
    ('00000000-0000-0000-0000-000000001405', '00000000-0000-0000-0000-000000000403', 'SKU-DOX-100-001', 'Doxycycline 100mg Capsule', '100mg', 'Capsule', '10 capsules', 'capsules', '00000000-0000-0000-0000-000000000290', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000001406', '00000000-0000-0000-0000-000000000403', 'SKU-DOX-100-002', 'Doxycycline 100mg Capsule', '100mg', 'Capsule', '20 capsules', 'capsules', '00000000-0000-0000-0000-000000000290', false, true, now(), now()),
    -- Product 404: Doxycycline 50mg
    ('00000000-0000-0000-0000-000000001407', '00000000-0000-0000-0000-000000000404', 'SKU-DOX-50-001', 'Doxycycline 50mg Capsule', '50mg', 'Capsule', '10 capsules', 'capsules', '00000000-0000-0000-0000-000000000291', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000001408', '00000000-0000-0000-0000-000000000404', 'SKU-DOX-50-002', 'Doxycycline 50mg Capsule', '50mg', 'Capsule', '20 capsules', 'capsules', '00000000-0000-0000-0000-000000000291', false, true, now(), now()),
    -- Product 405: Clarithromycin 500mg
    ('00000000-0000-0000-0000-000000001409', '00000000-0000-0000-0000-000000000405', 'SKU-CLA-500-001', 'Clarithromycin 500mg Tablet', '500mg', 'Tablet', '14 tablets', 'tablets', '00000000-0000-0000-0000-000000000292', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000001410', '00000000-0000-0000-0000-000000000405', 'SKU-CLA-500-002', 'Clarithromycin 500mg Tablet', '500mg', 'Tablet', '28 tablets', 'tablets', '00000000-0000-0000-0000-000000000292', false, true, now(), now()),
    -- Product 406: Clarithromycin 250mg
    ('00000000-0000-0000-0000-000000001411', '00000000-0000-0000-0000-000000000406', 'SKU-CLA-250-001', 'Clarithromycin 250mg Tablet', '250mg', 'Tablet', '14 tablets', 'tablets', '00000000-0000-0000-0000-000000000293', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000001412', '00000000-0000-0000-0000-000000000406', 'SKU-CLA-250-002', 'Clarithromycin 250mg Tablet', '250mg', 'Tablet', '28 tablets', 'tablets', '00000000-0000-0000-0000-000000000293', false, true, now(), now())
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
