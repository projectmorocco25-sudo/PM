-- Migration: seed_rmm_skus_company_007_part1
-- Description: Seed SKUs for Meknes Pharma Industries (007) - Part 1 (Products 801-806, 12 SKUs)
-- Date: 2026-01-24
-- Task: 1.1.3.6 (Seed Data Fixes)
-- Owner: Hassan (QA/Assurance Engineer)
-- Compliance: Deterministic IDs + idempotent UPSERTs

BEGIN;

-- ============================================================================
-- Seed SKUs for Meknes Pharma Industries (007) - Part 1
-- Products: 801-806 (12 SKUs = 2 SKUs per product)
-- ============================================================================

INSERT INTO skus (
    id, product_id, sku_code, name, dosage_strength, dosage_form, pack_size, unit_of_measure, atc_code_id,
    is_moh_authorized_unregistered, is_active, created_at, updated_at
)
VALUES
    -- Product 801: Montelukast 10mg
    ('00000000-0000-0000-0000-000000001801', '00000000-0000-0000-0000-000000000801', 'SKU-MON-10-001', 'Montelukast 10mg Tablet', '10mg', 'Tablet', '30 tablets', 'tablets', '00000000-0000-0000-0000-000000000288', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000001802', '00000000-0000-0000-0000-000000000801', 'SKU-MON-10-002', 'Montelukast 10mg Tablet', '10mg', 'Tablet', '60 tablets', 'tablets', '00000000-0000-0000-0000-000000000288', false, true, now(), now()),
    -- Product 802: Montelukast 5mg
    ('00000000-0000-0000-0000-000000001803', '00000000-0000-0000-0000-000000000802', 'SKU-MON-5-001', 'Montelukast 5mg Tablet', '5mg', 'Tablet', '30 tablets', 'tablets', '00000000-0000-0000-0000-000000000289', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000001804', '00000000-0000-0000-0000-000000000802', 'SKU-MON-5-002', 'Montelukast 5mg Tablet', '5mg', 'Tablet', '60 tablets', 'tablets', '00000000-0000-0000-0000-000000000289', false, true, now(), now()),
    -- Product 803: Budesonide Inhaler
    ('00000000-0000-0000-0000-000000001805', '00000000-0000-0000-0000-000000000803', 'SKU-BUD-INH-001', 'Budesonide Inhaler 200mcg', '200mcg', 'Inhaler', '200 doses', 'inhalers', '00000000-0000-0000-0000-000000000290', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000001806', '00000000-0000-0000-0000-000000000803', 'SKU-BUD-INH-002', 'Budesonide Inhaler 400mcg', '400mcg', 'Inhaler', '200 doses', 'inhalers', '00000000-0000-0000-0000-000000000290', false, true, now(), now()),
    -- Product 804: Fluticasone Inhaler
    ('00000000-0000-0000-0000-000000001807', '00000000-0000-0000-0000-000000000804', 'SKU-FLU-INH-001', 'Fluticasone Inhaler 125mcg', '125mcg', 'Inhaler', '120 doses', 'inhalers', '00000000-0000-0000-0000-000000000291', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000001808', '00000000-0000-0000-0000-000000000804', 'SKU-FLU-INH-002', 'Fluticasone Inhaler 250mcg', '250mcg', 'Inhaler', '120 doses', 'inhalers', '00000000-0000-0000-0000-000000000291', false, true, now(), now()),
    -- Product 805: Ipratropium Inhaler
    ('00000000-0000-0000-0000-000000001809', '00000000-0000-0000-0000-000000000805', 'SKU-IPR-INH-001', 'Ipratropium Inhaler 20mcg', '20mcg', 'Inhaler', '200 doses', 'inhalers', '00000000-0000-0000-0000-000000000292', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000001810', '00000000-0000-0000-0000-000000000805', 'SKU-IPR-INH-002', 'Ipratropium Inhaler 40mcg', '40mcg', 'Inhaler', '200 doses', 'inhalers', '00000000-0000-0000-0000-000000000292', false, true, now(), now()),
    -- Product 806: Tiotropium Inhaler
    ('00000000-0000-0000-0000-000000001811', '00000000-0000-0000-0000-000000000806', 'SKU-TIO-INH-001', 'Tiotropium Inhaler 18mcg', '18mcg', 'Inhaler', '30 capsules', 'capsules', '00000000-0000-0000-0000-000000000293', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000001812', '00000000-0000-0000-0000-000000000806', 'SKU-TIO-INH-002', 'Tiotropium Inhaler 9mcg', '9mcg', 'Inhaler', '30 capsules', 'capsules', '00000000-0000-0000-0000-000000000293', false, true, now(), now())
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
