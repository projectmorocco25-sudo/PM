-- Migration: seed_rmm_skus_company_008_part2
-- Description: Seed SKUs for Oujda Pharma Industries (008) - Part 2 (Products 907-912, 12 SKUs)
-- Date: 2026-01-24
-- Task: 1.1.3.6 (Seed Data Fixes)
-- Owner: Hassan (QA/Assurance Engineer)
-- Compliance: Deterministic IDs + idempotent UPSERTs

BEGIN;

-- ============================================================================
-- Seed SKUs for Oujda Pharma Industries (008) - Part 2
-- Products: 907-912 (12 SKUs = 2 SKUs per product)
-- ============================================================================

INSERT INTO skus (
    id, product_id, sku_code, name, dosage_strength, dosage_form, pack_size, unit_of_measure, atc_code_id,
    is_moh_authorized_unregistered, is_active, created_at, updated_at
)
VALUES
    -- Product 907: Sertraline 50mg
    ('00000000-0000-0000-0000-000000001913', '00000000-0000-0000-0000-000000000907', 'SKU-SER-50-001', 'Sertraline 50mg Tablet', '50mg', 'Tablet', '30 tablets', 'tablets', '00000000-0000-0000-0000-000000000288', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000001914', '00000000-0000-0000-0000-000000000907', 'SKU-SER-50-002', 'Sertraline 50mg Tablet', '50mg', 'Tablet', '60 tablets', 'tablets', '00000000-0000-0000-0000-000000000288', false, true, now(), now()),
    -- Product 908: Sertraline 100mg
    ('00000000-0000-0000-0000-000000001915', '00000000-0000-0000-0000-000000000908', 'SKU-SER-100-001', 'Sertraline 100mg Tablet', '100mg', 'Tablet', '30 tablets', 'tablets', '00000000-0000-0000-0000-000000000289', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000001916', '00000000-0000-0000-0000-000000000908', 'SKU-SER-100-002', 'Sertraline 100mg Tablet', '100mg', 'Tablet', '60 tablets', 'tablets', '00000000-0000-0000-0000-000000000289', false, true, now(), now()),
    -- Product 909: Fluoxetine 20mg
    ('00000000-0000-0000-0000-000000001917', '00000000-0000-0000-0000-000000000909', 'SKU-FLU-20-001', 'Fluoxetine 20mg Capsule', '20mg', 'Capsule', '30 capsules', 'capsules', '00000000-0000-0000-0000-000000000290', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000001918', '00000000-0000-0000-0000-000000000909', 'SKU-FLU-20-002', 'Fluoxetine 20mg Capsule', '20mg', 'Capsule', '60 capsules', 'capsules', '00000000-0000-0000-0000-000000000290', false, true, now(), now()),
    -- Product 910: Fluoxetine 40mg
    ('00000000-0000-0000-0000-000000001919', '00000000-0000-0000-0000-000000000910', 'SKU-FLU-40-001', 'Fluoxetine 40mg Capsule', '40mg', 'Capsule', '30 capsules', 'capsules', '00000000-0000-0000-0000-000000000291', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000001920', '00000000-0000-0000-0000-000000000910', 'SKU-FLU-40-002', 'Fluoxetine 40mg Capsule', '40mg', 'Capsule', '60 capsules', 'capsules', '00000000-0000-0000-0000-000000000291', false, true, now(), now()),
    -- Product 911: Amitriptyline 25mg
    ('00000000-0000-0000-0000-000000001921', '00000000-0000-0000-0000-000000000911', 'SKU-AMI-25-001', 'Amitriptyline 25mg Tablet', '25mg', 'Tablet', '30 tablets', 'tablets', '00000000-0000-0000-0000-000000000292', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000001922', '00000000-0000-0000-0000-000000000911', 'SKU-AMI-25-002', 'Amitriptyline 25mg Tablet', '25mg', 'Tablet', '60 tablets', 'tablets', '00000000-0000-0000-0000-000000000292', false, true, now(), now()),
    -- Product 912: Amitriptyline 50mg
    ('00000000-0000-0000-0000-000000001923', '00000000-0000-0000-0000-000000000912', 'SKU-AMI-50-001', 'Amitriptyline 50mg Tablet', '50mg', 'Tablet', '30 tablets', 'tablets', '00000000-0000-0000-0000-000000000293', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000001924', '00000000-0000-0000-0000-000000000912', 'SKU-AMI-50-002', 'Amitriptyline 50mg Tablet', '50mg', 'Tablet', '60 tablets', 'tablets', '00000000-0000-0000-0000-000000000293', false, true, now(), now())
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
