-- Migration: seed_rmm_skus_company_002_part2
-- Description: Seed SKUs for Rabat Pharma Industries (002) - Part 2 (Products 307-312, 12 SKUs)
-- Date: 2026-01-24
-- Task: 1.1.3.6 (Seed Data Fixes)
-- Owner: Hassan (QA/Assurance Engineer)
-- Compliance: Deterministic IDs + idempotent UPSERTs

BEGIN;

-- ============================================================================
-- Seed SKUs for Rabat Pharma Industries (002) - Part 2
-- Products: 307-312 (12 SKUs = 2 SKUs per product)
-- ============================================================================

INSERT INTO skus (
    id, product_id, sku_code, name, dosage_strength, dosage_form, pack_size, unit_of_measure, atc_code_id,
    is_moh_authorized_unregistered, is_active, created_at, updated_at
)
VALUES
    -- Product 307: Levothyroxine 50mcg
    ('00000000-0000-0000-0000-000000001313', '00000000-0000-0000-0000-000000000307', 'SKU-LEV-50-001', 'Levothyroxine 50mcg Tablet', '50mcg', 'Tablet', '30 tablets', 'tablets', '00000000-0000-0000-0000-000000000282', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000001314', '00000000-0000-0000-0000-000000000307', 'SKU-LEV-50-002', 'Levothyroxine 50mcg Tablet', '50mcg', 'Tablet', '60 tablets', 'tablets', '00000000-0000-0000-0000-000000000282', false, true, now(), now()),
    -- Product 308: Levothyroxine 100mcg
    ('00000000-0000-0000-0000-000000001315', '00000000-0000-0000-0000-000000000308', 'SKU-LEV-100-001', 'Levothyroxine 100mcg Tablet', '100mcg', 'Tablet', '30 tablets', 'tablets', '00000000-0000-0000-0000-000000000283', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000001316', '00000000-0000-0000-0000-000000000308', 'SKU-LEV-100-002', 'Levothyroxine 100mcg Tablet', '100mcg', 'Tablet', '60 tablets', 'tablets', '00000000-0000-0000-0000-000000000283', false, true, now(), now()),
    -- Product 309: Warfarin 5mg
    ('00000000-0000-0000-0000-000000001317', '00000000-0000-0000-0000-000000000309', 'SKU-WAR-5-001', 'Warfarin 5mg Tablet', '5mg', 'Tablet', '30 tablets', 'tablets', '00000000-0000-0000-0000-000000000284', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000001318', '00000000-0000-0000-0000-000000000309', 'SKU-WAR-5-002', 'Warfarin 5mg Tablet', '5mg', 'Tablet', '60 tablets', 'tablets', '00000000-0000-0000-0000-000000000284', false, true, now(), now()),
    -- Product 310: Warfarin 2.5mg
    ('00000000-0000-0000-0000-000000001319', '00000000-0000-0000-0000-000000000310', 'SKU-WAR-2.5-001', 'Warfarin 2.5mg Tablet', '2.5mg', 'Tablet', '30 tablets', 'tablets', '00000000-0000-0000-0000-000000000285', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000001320', '00000000-0000-0000-0000-000000000310', 'SKU-WAR-2.5-002', 'Warfarin 2.5mg Tablet', '2.5mg', 'Tablet', '60 tablets', 'tablets', '00000000-0000-0000-0000-000000000285', false, true, now(), now()),
    -- Product 311: Furosemide 40mg
    ('00000000-0000-0000-0000-000000001321', '00000000-0000-0000-0000-000000000311', 'SKU-FUR-40-001', 'Furosemide 40mg Tablet', '40mg', 'Tablet', '30 tablets', 'tablets', '00000000-0000-0000-0000-000000000286', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000001322', '00000000-0000-0000-0000-000000000311', 'SKU-FUR-40-002', 'Furosemide 40mg Tablet', '40mg', 'Tablet', '60 tablets', 'tablets', '00000000-0000-0000-0000-000000000286', false, true, now(), now()),
    -- Product 312: Furosemide 20mg
    ('00000000-0000-0000-0000-000000001323', '00000000-0000-0000-0000-000000000312', 'SKU-FUR-20-001', 'Furosemide 20mg Tablet', '20mg', 'Tablet', '30 tablets', 'tablets', '00000000-0000-0000-0000-000000000287', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000001324', '00000000-0000-0000-0000-000000000312', 'SKU-FUR-20-002', 'Furosemide 20mg Tablet', '20mg', 'Tablet', '60 tablets', 'tablets', '00000000-0000-0000-0000-000000000287', false, true, now(), now())
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
