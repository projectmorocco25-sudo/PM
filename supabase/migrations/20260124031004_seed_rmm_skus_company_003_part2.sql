-- Migration: seed_rmm_skus_company_003_part2
-- Description: Seed SKUs for Marrakech Pharma Industries (003) - Part 2 (Products 407-412, 12 SKUs)
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
    -- Product 407: Ceftriaxone 1g
    ('00000000-0000-0000-0000-000000001413', '00000000-0000-0000-0000-000000000407', 'SKU-CEF-1G-001', 'Ceftriaxone 1g Injection', '1g', 'Injection', '1 vial', 'vials', '00000000-0000-0000-0000-000000000294', true, true, now(), now()),
    ('00000000-0000-0000-0000-000000001414', '00000000-0000-0000-0000-000000000407', 'SKU-CEF-1G-002', 'Ceftriaxone 1g Injection', '1g', 'Injection', '5 vials', 'vials', '00000000-0000-0000-0000-000000000294', true, true, now(), now()),
    -- Product 408: Ceftriaxone 500mg
    ('00000000-0000-0000-0000-000000001415', '00000000-0000-0000-0000-000000000408', 'SKU-CEF-500-001', 'Ceftriaxone 500mg Injection', '500mg', 'Injection', '1 vial', 'vials', '00000000-0000-0000-0000-000000000295', true, true, now(), now()),
    ('00000000-0000-0000-0000-000000001416', '00000000-0000-0000-0000-000000000408', 'SKU-CEF-500-002', 'Ceftriaxone 500mg Injection', '500mg', 'Injection', '5 vials', 'vials', '00000000-0000-0000-0000-000000000295', true, true, now(), now()),
    -- Product 409: Vancomycin 500mg
    ('00000000-0000-0000-0000-000000001417', '00000000-0000-0000-0000-000000000409', 'SKU-VAN-500-001', 'Vancomycin 500mg Injection', '500mg', 'Injection', '1 vial', 'vials', '00000000-0000-0000-0000-000000000296', true, true, now(), now()),
    ('00000000-0000-0000-0000-000000001418', '00000000-0000-0000-0000-000000000409', 'SKU-VAN-500-002', 'Vancomycin 500mg Injection', '500mg', 'Injection', '5 vials', 'vials', '00000000-0000-0000-0000-000000000296', true, true, now(), now()),
    -- Product 410: Vancomycin 1g
    ('00000000-0000-0000-0000-000000001419', '00000000-0000-0000-0000-000000000410', 'SKU-VAN-1G-001', 'Vancomycin 1g Injection', '1g', 'Injection', '1 vial', 'vials', '00000000-0000-0000-0000-000000000297', true, true, now(), now()),
    ('00000000-0000-0000-0000-000000001420', '00000000-0000-0000-0000-000000000410', 'SKU-VAN-1G-002', 'Vancomycin 1g Injection', '1g', 'Injection', '5 vials', 'vials', '00000000-0000-0000-0000-000000000297', true, true, now(), now()),
    -- Product 411: Metronidazole 500mg
    ('00000000-0000-0000-0000-000000001421', '00000000-0000-0000-0000-000000000411', 'SKU-MET-500-001', 'Metronidazole 500mg Tablet', '500mg', 'Tablet', '20 tablets', 'tablets', '00000000-0000-0000-0000-000000000298', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000001422', '00000000-0000-0000-0000-000000000411', 'SKU-MET-500-002', 'Metronidazole 500mg Tablet', '500mg', 'Tablet', '40 tablets', 'tablets', '00000000-0000-0000-0000-000000000298', false, true, now(), now()),
    -- Product 412: Metronidazole 250mg
    ('00000000-0000-0000-0000-000000001423', '00000000-0000-0000-0000-000000000412', 'SKU-MET-250-001', 'Metronidazole 250mg Tablet', '250mg', 'Tablet', '20 tablets', 'tablets', '00000000-0000-0000-0000-000000000299', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000001424', '00000000-0000-0000-0000-000000000412', 'SKU-MET-250-002', 'Metronidazole 250mg Tablet', '250mg', 'Tablet', '40 tablets', 'tablets', '00000000-0000-0000-0000-000000000299', false, true, now(), now())
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
