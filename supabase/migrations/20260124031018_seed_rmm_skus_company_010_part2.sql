-- Migration: seed_rmm_skus_company_010_part2
-- Description: Seed SKUs for Tetouan Pharma Industries (010) - Part 2 (Products 1107-1112, 12 SKUs)
-- Date: 2026-01-24
-- Task: 1.1.3.6 (Seed Data Fixes)
-- Owner: Hassan (QA/Assurance Engineer)
-- Compliance: Deterministic IDs + idempotent UPSERTs

BEGIN;

-- ============================================================================
-- Seed SKUs for Tetouan Pharma Industries (010) - Part 2
-- Products: 1107-1112 (12 SKUs = 2 SKUs per product)
-- ============================================================================

INSERT INTO skus (
    id, product_id, sku_code, name, dosage_strength, dosage_form, pack_size, unit_of_measure, atc_code_id,
    is_moh_authorized_unregistered, is_active, created_at, updated_at
)
VALUES
    -- Product 1107: Levetiracetam 500mg
    ('00000000-0000-0000-0000-000000002113', '00000000-0000-0000-0000-000000001107', 'SKU-LEV-500-001', 'Levetiracetam 500mg Tablet', '500mg', 'Tablet', '30 tablets', 'tablets', '00000000-0000-0000-0000-000000000294', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000002114', '00000000-0000-0000-0000-000000001107', 'SKU-LEV-500-002', 'Levetiracetam 500mg Tablet', '500mg', 'Tablet', '60 tablets', 'tablets', '00000000-0000-0000-0000-000000000294', false, true, now(), now()),
    -- Product 1108: Levetiracetam 1000mg
    ('00000000-0000-0000-0000-000000002115', '00000000-0000-0000-0000-000000001108', 'SKU-LEV-1000-001', 'Levetiracetam 1000mg Tablet', '1000mg', 'Tablet', '30 tablets', 'tablets', '00000000-0000-0000-0000-000000000295', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000002116', '00000000-0000-0000-0000-000000001108', 'SKU-LEV-1000-002', 'Levetiracetam 1000mg Tablet', '1000mg', 'Tablet', '60 tablets', 'tablets', '00000000-0000-0000-0000-000000000295', false, true, now(), now()),
    -- Product 1109: Lamotrigine 25mg
    ('00000000-0000-0000-0000-000000002117', '00000000-0000-0000-0000-000000001109', 'SKU-LAM-25-001', 'Lamotrigine 25mg Tablet', '25mg', 'Tablet', '30 tablets', 'tablets', '00000000-0000-0000-0000-000000000296', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000002118', '00000000-0000-0000-0000-000000001109', 'SKU-LAM-25-002', 'Lamotrigine 25mg Tablet', '25mg', 'Tablet', '60 tablets', 'tablets', '00000000-0000-0000-0000-000000000296', false, true, now(), now()),
    -- Product 1110: Lamotrigine 100mg
    ('00000000-0000-0000-0000-000000002119', '00000000-0000-0000-0000-000000001110', 'SKU-LAM-100-001', 'Lamotrigine 100mg Tablet', '100mg', 'Tablet', '30 tablets', 'tablets', '00000000-0000-0000-0000-000000000297', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000002120', '00000000-0000-0000-0000-000000001110', 'SKU-LAM-100-002', 'Lamotrigine 100mg Tablet', '100mg', 'Tablet', '60 tablets', 'tablets', '00000000-0000-0000-0000-000000000297', false, true, now(), now()),
    -- Product 1111: Topiramate 25mg
    ('00000000-0000-0000-0000-000000002121', '00000000-0000-0000-0000-000000001111', 'SKU-TOP-25-001', 'Topiramate 25mg Tablet', '25mg', 'Tablet', '30 tablets', 'tablets', '00000000-0000-0000-0000-000000000298', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000002122', '00000000-0000-0000-0000-000000001111', 'SKU-TOP-25-002', 'Topiramate 25mg Tablet', '25mg', 'Tablet', '60 tablets', 'tablets', '00000000-0000-0000-0000-000000000298', false, true, now(), now()),
    -- Product 1112: Topiramate 100mg
    ('00000000-0000-0000-0000-000000002123', '00000000-0000-0000-0000-000000001112', 'SKU-TOP-100-001', 'Topiramate 100mg Tablet', '100mg', 'Tablet', '30 tablets', 'tablets', '00000000-0000-0000-0000-000000000299', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000002124', '00000000-0000-0000-0000-000000001112', 'SKU-TOP-100-002', 'Topiramate 100mg Tablet', '100mg', 'Tablet', '60 tablets', 'tablets', '00000000-0000-0000-0000-000000000299', false, true, now(), now())
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
