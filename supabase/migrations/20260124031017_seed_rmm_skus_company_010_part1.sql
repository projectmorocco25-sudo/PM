-- Migration: seed_rmm_skus_company_010_part1
-- Description: Seed SKUs for Tetouan Pharma Industries (010) - Part 1 (Products 1101-1106, 12 SKUs)
-- Date: 2026-01-24
-- Task: 1.1.3.6 (Seed Data Fixes)
-- Owner: Hassan (QA/Assurance Engineer)
-- Compliance: Deterministic IDs + idempotent UPSERTs

BEGIN;

-- ============================================================================
-- Seed SKUs for Tetouan Pharma Industries (010) - Part 1
-- Products: 1101-1106 (12 SKUs = 2 SKUs per product)
-- ============================================================================

INSERT INTO skus (
    id, product_id, sku_code, name, dosage_strength, dosage_form, pack_size, unit_of_measure, atc_code_id,
    is_moh_authorized_unregistered, is_active, created_at, updated_at
)
VALUES
    -- Product 1101: Carbamazepine 200mg
    ('00000000-0000-0000-0000-000000002101', '00000000-0000-0000-0000-000000001101', 'SKU-CAR-200-001', 'Carbamazepine 200mg Tablet', '200mg', 'Tablet', '30 tablets', 'tablets', '00000000-0000-0000-0000-000000000288', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000002102', '00000000-0000-0000-0000-000000001101', 'SKU-CAR-200-002', 'Carbamazepine 200mg Tablet', '200mg', 'Tablet', '60 tablets', 'tablets', '00000000-0000-0000-0000-000000000288', false, true, now(), now()),
    -- Product 1102: Carbamazepine 400mg
    ('00000000-0000-0000-0000-000000002103', '00000000-0000-0000-0000-000000001102', 'SKU-CAR-400-001', 'Carbamazepine 400mg Tablet', '400mg', 'Tablet', '30 tablets', 'tablets', '00000000-0000-0000-0000-000000000289', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000002104', '00000000-0000-0000-0000-000000001102', 'SKU-CAR-400-002', 'Carbamazepine 400mg Tablet', '400mg', 'Tablet', '60 tablets', 'tablets', '00000000-0000-0000-0000-000000000289', false, true, now(), now()),
    -- Product 1103: Phenytoin 100mg
    ('00000000-0000-0000-0000-000000002105', '00000000-0000-0000-0000-000000001103', 'SKU-PHE-100-001', 'Phenytoin 100mg Capsule', '100mg', 'Capsule', '30 capsules', 'capsules', '00000000-0000-0000-0000-000000000290', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000002106', '00000000-0000-0000-0000-000000001103', 'SKU-PHE-100-002', 'Phenytoin 100mg Capsule', '100mg', 'Capsule', '60 capsules', 'capsules', '00000000-0000-0000-0000-000000000290', false, true, now(), now()),
    -- Product 1104: Phenytoin 50mg
    ('00000000-0000-0000-0000-000000002107', '00000000-0000-0000-0000-000000001104', 'SKU-PHE-50-001', 'Phenytoin 50mg Capsule', '50mg', 'Capsule', '30 capsules', 'capsules', '00000000-0000-0000-0000-000000000291', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000002108', '00000000-0000-0000-0000-000000001104', 'SKU-PHE-50-002', 'Phenytoin 50mg Capsule', '50mg', 'Capsule', '60 capsules', 'capsules', '00000000-0000-0000-0000-000000000291', false, true, now(), now()),
    -- Product 1105: Valproic Acid 500mg
    ('00000000-0000-0000-0000-000000002109', '00000000-0000-0000-0000-000000001105', 'SKU-VAL-500-001', 'Valproic Acid 500mg Tablet', '500mg', 'Tablet', '30 tablets', 'tablets', '00000000-0000-0000-0000-000000000292', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000002110', '00000000-0000-0000-0000-000000001105', 'SKU-VAL-500-002', 'Valproic Acid 500mg Tablet', '500mg', 'Tablet', '60 tablets', 'tablets', '00000000-0000-0000-0000-000000000292', false, true, now(), now()),
    -- Product 1106: Valproic Acid 250mg
    ('00000000-0000-0000-0000-000000002111', '00000000-0000-0000-0000-000000001106', 'SKU-VAL-250-001', 'Valproic Acid 250mg Tablet', '250mg', 'Tablet', '30 tablets', 'tablets', '00000000-0000-0000-0000-000000000293', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000002112', '00000000-0000-0000-0000-000000001106', 'SKU-VAL-250-002', 'Valproic Acid 250mg Tablet', '250mg', 'Tablet', '60 tablets', 'tablets', '00000000-0000-0000-0000-000000000293', false, true, now(), now())
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
