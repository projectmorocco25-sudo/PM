-- Migration: seed_rmm_skus_company_005_part2
-- Description: Seed SKUs for Agadir Pharma Industries (005) - Part 2 (Products 607-612, 12 SKUs)
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
    -- Product 607: Bisoprolol 5mg
    ('00000000-0000-0000-0000-000000001613', '00000000-0000-0000-0000-000000000607', 'SKU-BIS-5-001', 'Bisoprolol 5mg Tablet', '5mg', 'Tablet', '30 tablets', 'tablets', '00000000-0000-0000-0000-000000000268', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000001614', '00000000-0000-0000-0000-000000000607', 'SKU-BIS-5-002', 'Bisoprolol 5mg Tablet', '5mg', 'Tablet', '60 tablets', 'tablets', '00000000-0000-0000-0000-000000000268', false, true, now(), now()),
    -- Product 608: Bisoprolol 10mg
    ('00000000-0000-0000-0000-000000001615', '00000000-0000-0000-0000-000000000608', 'SKU-BIS-10-001', 'Bisoprolol 10mg Tablet', '10mg', 'Tablet', '30 tablets', 'tablets', '00000000-0000-0000-0000-000000000269', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000001616', '00000000-0000-0000-0000-000000000608', 'SKU-BIS-10-002', 'Bisoprolol 10mg Tablet', '10mg', 'Tablet', '60 tablets', 'tablets', '00000000-0000-0000-0000-000000000269', false, true, now(), now()),
    -- Product 609: Metoprolol 50mg
    ('00000000-0000-0000-0000-000000001617', '00000000-0000-0000-0000-000000000609', 'SKU-MET-50-001', 'Metoprolol 50mg Tablet', '50mg', 'Tablet', '30 tablets', 'tablets', '00000000-0000-0000-0000-000000000270', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000001618', '00000000-0000-0000-0000-000000000609', 'SKU-MET-50-002', 'Metoprolol 50mg Tablet', '50mg', 'Tablet', '60 tablets', 'tablets', '00000000-0000-0000-0000-000000000270', false, true, now(), now()),
    -- Product 610: Metoprolol 100mg
    ('00000000-0000-0000-0000-000000001619', '00000000-0000-0000-0000-000000000610', 'SKU-MET-100-001', 'Metoprolol 100mg Tablet', '100mg', 'Tablet', '30 tablets', 'tablets', '00000000-0000-0000-0000-000000000271', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000001620', '00000000-0000-0000-0000-000000000610', 'SKU-MET-100-002', 'Metoprolol 100mg Tablet', '100mg', 'Tablet', '60 tablets', 'tablets', '00000000-0000-0000-0000-000000000271', false, true, now(), now()),
    -- Product 611: Nebivolol 5mg
    ('00000000-0000-0000-0000-000000001621', '00000000-0000-0000-0000-000000000611', 'SKU-NEB-5-001', 'Nebivolol 5mg Tablet', '5mg', 'Tablet', '30 tablets', 'tablets', '00000000-0000-0000-0000-000000000272', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000001622', '00000000-0000-0000-0000-000000000611', 'SKU-NEB-5-002', 'Nebivolol 5mg Tablet', '5mg', 'Tablet', '60 tablets', 'tablets', '00000000-0000-0000-0000-000000000272', false, true, now(), now()),
    -- Product 612: Nebivolol 10mg
    ('00000000-0000-0000-0000-000000001623', '00000000-0000-0000-0000-000000000612', 'SKU-NEB-10-001', 'Nebivolol 10mg Tablet', '10mg', 'Tablet', '30 tablets', 'tablets', '00000000-0000-0000-0000-000000000273', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000001624', '00000000-0000-0000-0000-000000000612', 'SKU-NEB-10-002', 'Nebivolol 10mg Tablet', '10mg', 'Tablet', '60 tablets', 'tablets', '00000000-0000-0000-0000-000000000273', false, true, now(), now())
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
