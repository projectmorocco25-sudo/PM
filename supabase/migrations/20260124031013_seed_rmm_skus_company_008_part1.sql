-- Migration: seed_rmm_skus_company_008_part1
-- Description: Seed SKUs for Oujda Pharma Industries (008) - Part 1 (Products 901-906, 12 SKUs)
-- Date: 2026-01-24
-- Task: 1.1.3.6 (Seed Data Fixes)
-- Owner: Hassan (QA/Assurance Engineer)
-- Compliance: Deterministic IDs + idempotent UPSERTs

BEGIN;

-- ============================================================================
-- Seed SKUs for Oujda Pharma Industries (008) - Part 1
-- Products: 901-906 (12 SKUs = 2 SKUs per product)
-- ============================================================================

INSERT INTO skus (
    id, product_id, sku_code, name, dosage_strength, dosage_form, pack_size, unit_of_measure, atc_code_id,
    is_moh_authorized_unregistered, is_active, created_at, updated_at
)
VALUES
    -- Product 901: Diazepam 5mg
    ('00000000-0000-0000-0000-000000001901', '00000000-0000-0000-0000-000000000901', 'SKU-DIA-5-001', 'Diazepam 5mg Tablet', '5mg', 'Tablet', '30 tablets', 'tablets', '00000000-0000-0000-0000-000000000300', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000001902', '00000000-0000-0000-0000-000000000901', 'SKU-DIA-5-002', 'Diazepam 5mg Tablet', '5mg', 'Tablet', '60 tablets', 'tablets', '00000000-0000-0000-0000-000000000300', false, true, now(), now()),
    -- Product 902: Diazepam 10mg
    ('00000000-0000-0000-0000-000000001903', '00000000-0000-0000-0000-000000000902', 'SKU-DIA-10-001', 'Diazepam 10mg Tablet', '10mg', 'Tablet', '30 tablets', 'tablets', '00000000-0000-0000-0000-000000000301', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000001904', '00000000-0000-0000-0000-000000000902', 'SKU-DIA-10-002', 'Diazepam 10mg Tablet', '10mg', 'Tablet', '60 tablets', 'tablets', '00000000-0000-0000-0000-000000000301', false, true, now(), now()),
    -- Product 903: Lorazepam 1mg
    ('00000000-0000-0000-0000-000000001905', '00000000-0000-0000-0000-000000000903', 'SKU-LOR-1-001', 'Lorazepam 1mg Tablet', '1mg', 'Tablet', '30 tablets', 'tablets', '00000000-0000-0000-0000-000000000302', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000001906', '00000000-0000-0000-0000-000000000903', 'SKU-LOR-1-002', 'Lorazepam 1mg Tablet', '1mg', 'Tablet', '60 tablets', 'tablets', '00000000-0000-0000-0000-000000000302', false, true, now(), now()),
    -- Product 904: Lorazepam 2.5mg
    ('00000000-0000-0000-0000-000000001907', '00000000-0000-0000-0000-000000000904', 'SKU-LOR-2.5-001', 'Lorazepam 2.5mg Tablet', '2.5mg', 'Tablet', '30 tablets', 'tablets', '00000000-0000-0000-0000-000000000303', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000001908', '00000000-0000-0000-0000-000000000904', 'SKU-LOR-2.5-002', 'Lorazepam 2.5mg Tablet', '2.5mg', 'Tablet', '60 tablets', 'tablets', '00000000-0000-0000-0000-000000000303', false, true, now(), now()),
    -- Product 905: Alprazolam 0.5mg
    ('00000000-0000-0000-0000-000000001909', '00000000-0000-0000-0000-000000000905', 'SKU-ALP-0.5-001', 'Alprazolam 0.5mg Tablet', '0.5mg', 'Tablet', '30 tablets', 'tablets', '00000000-0000-0000-0000-000000000304', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000001910', '00000000-0000-0000-0000-000000000905', 'SKU-ALP-0.5-002', 'Alprazolam 0.5mg Tablet', '0.5mg', 'Tablet', '60 tablets', 'tablets', '00000000-0000-0000-0000-000000000304', false, true, now(), now()),
    -- Product 906: Alprazolam 1mg
    ('00000000-0000-0000-0000-000000001911', '00000000-0000-0000-0000-000000000906', 'SKU-ALP-1-001', 'Alprazolam 1mg Tablet', '1mg', 'Tablet', '30 tablets', 'tablets', '00000000-0000-0000-0000-000000000305', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000001912', '00000000-0000-0000-0000-000000000906', 'SKU-ALP-1-002', 'Alprazolam 1mg Tablet', '1mg', 'Tablet', '60 tablets', 'tablets', '00000000-0000-0000-0000-000000000305', false, true, now(), now())
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
