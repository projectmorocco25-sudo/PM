-- Migration: seed_rmm_skus_company_007_part2
-- Description: Seed SKUs for Meknes Pharma Industries (007) - Part 2 (Products 807-812, 12 SKUs)
-- Date: 2026-01-24
-- Task: 1.1.3.6 (Seed Data Fixes)
-- Owner: Hassan (QA/Assurance Engineer)
-- Compliance: Deterministic IDs + idempotent UPSERTs

BEGIN;

-- ============================================================================
-- Seed SKUs for Meknes Pharma Industries (007) - Part 2
-- Products: 807-812 (12 SKUs = 2 SKUs per product)
-- ============================================================================

INSERT INTO skus (
    id, product_id, sku_code, name, dosage_strength, dosage_form, pack_size, unit_of_measure, atc_code_id,
    is_moh_authorized_unregistered, is_active, created_at, updated_at
)
VALUES
    -- Product 807: Formoterol Inhaler
    ('00000000-0000-0000-0000-000000001813', '00000000-0000-0000-0000-000000000807', 'SKU-FOR-INH-001', 'Formoterol Inhaler 12mcg', '12mcg', 'Inhaler', '120 doses', 'inhalers', '00000000-0000-0000-0000-000000000294', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000001814', '00000000-0000-0000-0000-000000000807', 'SKU-FOR-INH-002', 'Formoterol Inhaler 24mcg', '24mcg', 'Inhaler', '120 doses', 'inhalers', '00000000-0000-0000-0000-000000000294', false, true, now(), now()),
    -- Product 808: Salmeterol Inhaler
    ('00000000-0000-0000-0000-000000001815', '00000000-0000-0000-0000-000000000808', 'SKU-SAL-INH-001', 'Salmeterol Inhaler 25mcg', '25mcg', 'Inhaler', '120 doses', 'inhalers', '00000000-0000-0000-0000-000000000295', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000001816', '00000000-0000-0000-0000-000000000808', 'SKU-SAL-INH-002', 'Salmeterol Inhaler 50mcg', '50mcg', 'Inhaler', '120 doses', 'inhalers', '00000000-0000-0000-0000-000000000295', false, true, now(), now()),
    -- Product 809: Theophylline 200mg
    ('00000000-0000-0000-0000-000000001817', '00000000-0000-0000-0000-000000000809', 'SKU-THE-200-001', 'Theophylline 200mg Tablet', '200mg', 'Tablet', '30 tablets', 'tablets', '00000000-0000-0000-0000-000000000296', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000001818', '00000000-0000-0000-0000-000000000809', 'SKU-THE-200-002', 'Theophylline 200mg Tablet', '200mg', 'Tablet', '60 tablets', 'tablets', '00000000-0000-0000-0000-000000000296', false, true, now(), now()),
    -- Product 810: Theophylline 400mg
    ('00000000-0000-0000-0000-000000001819', '00000000-0000-0000-0000-000000000810', 'SKU-THE-400-001', 'Theophylline 400mg Tablet', '400mg', 'Tablet', '30 tablets', 'tablets', '00000000-0000-0000-0000-000000000297', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000001820', '00000000-0000-0000-0000-000000000810', 'SKU-THE-400-002', 'Theophylline 400mg Tablet', '400mg', 'Tablet', '60 tablets', 'tablets', '00000000-0000-0000-0000-000000000297', false, true, now(), now()),
    -- Product 811: Prednisolone 5mg
    ('00000000-0000-0000-0000-000000001821', '00000000-0000-0000-0000-000000000811', 'SKU-PRE-5-001', 'Prednisolone 5mg Tablet', '5mg', 'Tablet', '30 tablets', 'tablets', '00000000-0000-0000-0000-000000000298', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000001822', '00000000-0000-0000-0000-000000000811', 'SKU-PRE-5-002', 'Prednisolone 5mg Tablet', '5mg', 'Tablet', '60 tablets', 'tablets', '00000000-0000-0000-0000-000000000298', false, true, now(), now()),
    -- Product 812: Prednisolone 20mg
    ('00000000-0000-0000-0000-000000001823', '00000000-0000-0000-0000-000000000812', 'SKU-PRE-20-001', 'Prednisolone 20mg Tablet', '20mg', 'Tablet', '30 tablets', 'tablets', '00000000-0000-0000-0000-000000000299', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000001824', '00000000-0000-0000-0000-000000000812', 'SKU-PRE-20-002', 'Prednisolone 20mg Tablet', '20mg', 'Tablet', '60 tablets', 'tablets', '00000000-0000-0000-0000-000000000299', false, true, now(), now())
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
