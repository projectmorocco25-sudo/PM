-- Migration: seed_1_1_2_rmm
-- Description: Seed RMM data (companies, products, skus, atc_codes, critical_medicines, registry_submissions, approval_history)
-- Date: 2026-01-24
-- Task: 1.1.3.6
-- Owner: Hassan (Seed Data & Testing Owner)
-- Compliance: Deterministic IDs + idempotent UPSERTs

BEGIN;

-- Ensure pgcrypto is available for password hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Ensure auth instance exists (required for Auth UI visibility)
INSERT INTO auth.instances (id, uuid, raw_base_config, created_at, updated_at)
SELECT gen_random_uuid(), gen_random_uuid(), '{}'::text, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM auth.instances);

-- ============================================================================
-- Seed auth.users (deterministic IDs for testing + RLS validation)
-- ============================================================================

WITH instance_row AS (
    SELECT id FROM auth.instances LIMIT 1
),
user_seed AS (
    VALUES
        ('00000000-0000-0000-0000-000000000001', 'tier1@test.moh.gov.ma'),
        ('00000000-0000-0000-0000-000000000002', 'tier2officer@test.moh.gov.ma'),
        ('00000000-0000-0000-0000-000000000003', 'tier2registrar@test.moh.gov.ma'),
        ('00000000-0000-0000-0000-000000000004', 'auditor@test.moh.gov.ma'),
        ('00000000-0000-0000-0000-000000000005', 'admin@testcompany.com'),
        ('00000000-0000-0000-0000-000000000006', 'manager@testcompany.com'),
        ('00000000-0000-0000-0000-000000000007', 'user@testcompany.com'),
        ('00000000-0000-0000-0000-000000000008', 'admin@test.system'),
        ('00000000-0000-0000-0000-000000000009', 'vendor@test.vendor')
)
INSERT INTO auth.users (
    id,
    email,
    aud,
    role,
    raw_app_meta_data,
    raw_user_meta_data,
    encrypted_password,
    instance_id,
    created_at,
    updated_at,
    email_confirmed_at,
    is_sso_user,
    is_anonymous
)
SELECT
    (user_seed.column1)::uuid,
    user_seed.column2,
    'authenticated',
    'authenticated',
    '{}'::jsonb,
    '{}'::jsonb,
    crypt('TestPassword123!', gen_salt('bf')),
    instance_row.id,
    now(),
    now(),
    now(),
    false,
    false
FROM user_seed
CROSS JOIN instance_row
ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    encrypted_password = EXCLUDED.encrypted_password,
    instance_id = EXCLUDED.instance_id,
    updated_at = now(),
    email_confirmed_at = EXCLUDED.email_confirmed_at;

-- Ensure auth identities exist for email/password login
INSERT INTO auth.identities (
    provider_id,
    user_id,
    identity_data,
    provider,
    last_sign_in_at,
    created_at,
    updated_at,
    id
)
VALUES
    ('tier1@test.moh.gov.ma', '00000000-0000-0000-0000-000000000001', jsonb_build_object('sub', '00000000-0000-0000-0000-000000000001', 'email', 'tier1@test.moh.gov.ma'), 'email', now(), now(), now(), '00000000-0000-0000-0000-000000000001'),
    ('tier2officer@test.moh.gov.ma', '00000000-0000-0000-0000-000000000002', jsonb_build_object('sub', '00000000-0000-0000-0000-000000000002', 'email', 'tier2officer@test.moh.gov.ma'), 'email', now(), now(), now(), '00000000-0000-0000-0000-000000000002'),
    ('tier2registrar@test.moh.gov.ma', '00000000-0000-0000-0000-000000000003', jsonb_build_object('sub', '00000000-0000-0000-0000-000000000003', 'email', 'tier2registrar@test.moh.gov.ma'), 'email', now(), now(), now(), '00000000-0000-0000-0000-000000000003'),
    ('auditor@test.moh.gov.ma', '00000000-0000-0000-0000-000000000004', jsonb_build_object('sub', '00000000-0000-0000-0000-000000000004', 'email', 'auditor@test.moh.gov.ma'), 'email', now(), now(), now(), '00000000-0000-0000-0000-000000000004'),
    ('admin@testcompany.com', '00000000-0000-0000-0000-000000000005', jsonb_build_object('sub', '00000000-0000-0000-0000-000000000005', 'email', 'admin@testcompany.com'), 'email', now(), now(), now(), '00000000-0000-0000-0000-000000000005'),
    ('manager@testcompany.com', '00000000-0000-0000-0000-000000000006', jsonb_build_object('sub', '00000000-0000-0000-0000-000000000006', 'email', 'manager@testcompany.com'), 'email', now(), now(), now(), '00000000-0000-0000-0000-000000000006'),
    ('user@testcompany.com', '00000000-0000-0000-0000-000000000007', jsonb_build_object('sub', '00000000-0000-0000-0000-000000000007', 'email', 'user@testcompany.com'), 'email', now(), now(), now(), '00000000-0000-0000-0000-000000000007'),
    ('admin@test.system', '00000000-0000-0000-0000-000000000008', jsonb_build_object('sub', '00000000-0000-0000-0000-000000000008', 'email', 'admin@test.system'), 'email', now(), now(), now(), '00000000-0000-0000-0000-000000000008'),
    ('vendor@test.vendor', '00000000-0000-0000-0000-000000000009', jsonb_build_object('sub', '00000000-0000-0000-0000-000000000009', 'email', 'vendor@test.vendor'), 'email', now(), now(), now(), '00000000-0000-0000-0000-000000000009')
ON CONFLICT (id) DO UPDATE SET
    provider_id = EXCLUDED.provider_id,
    identity_data = EXCLUDED.identity_data,
    provider = EXCLUDED.provider,
    updated_at = now();

-- ============================================================================
-- Seed companies (75 total; includes active + empty packs)
-- ============================================================================

WITH company_seed AS (
    SELECT
        gs AS idx,
        ('00000000-0000-0000-0000-' || lpad(gs::text, 12, '0'))::uuid AS id,
        CASE
            WHEN gs = 1 THEN 'PharmaCorp Inc'
            WHEN gs = 2 THEN 'EmptyMed Ltd'
            ELSE 'Seed Company ' || gs::text
        END AS name,
        'REG-' || lpad(gs::text, 3, '0') AS registration_number,
        CASE WHEN gs % 2 = 0 THEN 'wholesaler' ELSE 'ipc' END AS company_type,
        'Seed Address ' || gs::text AS address,
        'seed' || lpad(gs::text, 3, '0') || '@company.test' AS contact_email,
        '+212600' || lpad(gs::text, 6, '0') AS contact_phone,
        true AS is_active
    FROM generate_series(1, 75) gs
)
INSERT INTO companies (
    id, name, registration_number, company_type, address, contact_email, contact_phone, is_active, created_at, updated_at
)
SELECT
    id, name, registration_number, company_type, address, contact_email, contact_phone, is_active, now(), now()
FROM company_seed
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    registration_number = EXCLUDED.registration_number,
    company_type = EXCLUDED.company_type,
    address = EXCLUDED.address,
    contact_email = EXCLUDED.contact_email,
    contact_phone = EXCLUDED.contact_phone,
    is_active = EXCLUDED.is_active,
    updated_at = now();

-- ============================================================================
-- Seed users (after companies to satisfy FK)
-- ============================================================================

INSERT INTO users (
    id,
    email,
    full_name,
    company_id,
    role,
    notification_preferences,
    is_active,
    created_at,
    updated_at
)
VALUES
    ('00000000-0000-0000-0000-000000000001', 'tier1@test.moh.gov.ma', 'MOH Tier 1 User', NULL, 'tier1',
     '{"email_enabled": true, "submission_updates": true, "compliance_alerts": true, "enforcement_actions": true, "system_announcements": true}'::jsonb, true, now(), now()),
    ('00000000-0000-0000-0000-000000000002', 'tier2officer@test.moh.gov.ma', 'MOH Tier 2 Officer', NULL, 'tier2_officer',
     '{"email_enabled": true, "submission_updates": true, "compliance_alerts": true, "enforcement_actions": true, "system_announcements": true}'::jsonb, true, now(), now()),
    ('00000000-0000-0000-0000-000000000003', 'tier2registrar@test.moh.gov.ma', 'MOH Tier 2 Registrar', NULL, 'tier2_registrar',
     '{"email_enabled": true, "submission_updates": true, "compliance_alerts": true, "enforcement_actions": true, "system_announcements": true}'::jsonb, true, now(), now()),
    ('00000000-0000-0000-0000-000000000004', 'auditor@test.moh.gov.ma', 'MOH Auditor', NULL, 'auditor',
     '{"email_enabled": true, "submission_updates": true, "compliance_alerts": true, "enforcement_actions": true, "system_announcements": true}'::jsonb, true, now(), now()),
    ('00000000-0000-0000-0000-000000000005', 'admin@testcompany.com', 'Company Admin', '00000000-0000-0000-0000-000000000001', 'company_admin',
     '{"email_enabled": true, "submission_updates": true, "compliance_alerts": true, "enforcement_actions": true, "system_announcements": true}'::jsonb, true, now(), now()),
    ('00000000-0000-0000-0000-000000000006', 'manager@testcompany.com', 'Company Manager', '00000000-0000-0000-0000-000000000001', 'company_manager',
     '{"email_enabled": true, "submission_updates": true, "compliance_alerts": true, "enforcement_actions": true, "system_announcements": true}'::jsonb, true, now(), now()),
    ('00000000-0000-0000-0000-000000000007', 'user@testcompany.com', 'Company User', '00000000-0000-0000-0000-000000000001', 'company_user',
     '{"email_enabled": true, "submission_updates": true, "compliance_alerts": true, "enforcement_actions": true, "system_announcements": true}'::jsonb, true, now(), now()),
    ('00000000-0000-0000-0000-000000000008', 'admin@test.system', 'System Admin', NULL, 'system_admin',
     '{"email_enabled": true, "submission_updates": true, "compliance_alerts": true, "enforcement_actions": true, "system_announcements": true}'::jsonb, true, now(), now()),
    ('00000000-0000-0000-0000-000000000009', 'vendor@test.vendor', 'Vendor User', NULL, 'vendor',
     '{"email_enabled": true, "submission_updates": true, "compliance_alerts": true, "enforcement_actions": true, "system_announcements": true}'::jsonb, true, now(), now())
ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    company_id = EXCLUDED.company_id,
    role = EXCLUDED.role,
    notification_preferences = EXCLUDED.notification_preferences,
    is_active = EXCLUDED.is_active,
    updated_at = now();

-- ============================================================================
-- Seed ATC codes (50 codes)
-- ============================================================================

WITH atc_seed AS (
    SELECT
        gs AS idx,
        ('00000000-0000-0000-0000-' || lpad((255 + gs)::text, 12, '0'))::uuid AS id,
        'A' || lpad(gs::text, 2, '0') || '01' AS code,
        'ATC Description ' || gs::text AS description
    FROM generate_series(1, 50) gs
)
INSERT INTO atc_codes (id, code, description, is_active, created_at, updated_at)
SELECT id, code, description, true, now(), now()
FROM atc_seed
ON CONFLICT (id) DO UPDATE SET
    code = EXCLUDED.code,
    description = EXCLUDED.description,
    is_active = EXCLUDED.is_active,
    updated_at = now();

-- ============================================================================
-- Seed products (10+ for active company)
-- ============================================================================

INSERT INTO products (
    id, company_id, name, description, is_critical_medicine, is_active, created_at, updated_at
)
VALUES
    ('00000000-0000-0000-0000-000000000101', '00000000-0000-0000-0000-000000000001', 'Paracetamol 500mg', 'Pain relief medication', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000000102', '00000000-0000-0000-0000-000000000001', 'Ibuprofen 200mg', 'Anti-inflammatory medication', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000000103', '00000000-0000-0000-0000-000000000001', 'Amoxicillin 500mg', 'Antibiotic medication', true, true, now(), now()),
    ('00000000-0000-0000-0000-000000000104', '00000000-0000-0000-0000-000000000001', 'Insulin Glargine', 'Diabetes medication', true, true, now(), now()),
    ('00000000-0000-0000-0000-000000000105', '00000000-0000-0000-0000-000000000001', 'Metformin 850mg', 'Diabetes medication', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000000106', '00000000-0000-0000-0000-000000000001', 'Lisinopril 10mg', 'Hypertension medication', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000000107', '00000000-0000-0000-0000-000000000001', 'Atorvastatin 20mg', 'Cholesterol medication', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000000108', '00000000-0000-0000-0000-000000000001', 'Salbutamol Inhaler', 'Asthma medication', true, true, now(), now()),
    ('00000000-0000-0000-0000-000000000109', '00000000-0000-0000-0000-000000000001', 'Omeprazole 20mg', 'Gastric medication', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000000110', '00000000-0000-0000-0000-000000000001', 'Azithromycin 250mg', 'Antibiotic medication', true, true, now(), now())
ON CONFLICT (id) DO UPDATE SET
    company_id = EXCLUDED.company_id,
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    is_critical_medicine = EXCLUDED.is_critical_medicine,
    is_active = EXCLUDED.is_active,
    updated_at = now();

-- ============================================================================
-- Seed SKUs (20+ for active company, with pharma attributes)
-- ============================================================================

INSERT INTO skus (
    id, product_id, sku_code, name, dosage_strength, dosage_form, pack_size, unit_of_measure, atc_code_id,
    is_moh_authorized_unregistered, is_active, created_at, updated_at
)
VALUES
    ('00000000-0000-0000-0000-000000000201', '00000000-0000-0000-0000-000000000101', 'SKU-PARA-001', 'Paracetamol 500mg Tablet', '500mg', 'Tablet', '30 tablets', 'tablets', '00000000-0000-0000-0000-000000000256', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000000202', '00000000-0000-0000-0000-000000000101', 'SKU-PARA-002', 'Paracetamol 500mg Capsule', '500mg', 'Capsule', '20 capsules', 'capsules', '00000000-0000-0000-0000-000000000257', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000000203', '00000000-0000-0000-0000-000000000102', 'SKU-IBU-001', 'Ibuprofen 200mg Tablet', '200mg', 'Tablet', '30 tablets', 'tablets', '00000000-0000-0000-0000-000000000258', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000000204', '00000000-0000-0000-0000-000000000102', 'SKU-IBU-002', 'Ibuprofen 400mg Tablet', '400mg', 'Tablet', '20 tablets', 'tablets', '00000000-0000-0000-0000-000000000259', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000000205', '00000000-0000-0000-0000-000000000103', 'SKU-AMOX-001', 'Amoxicillin 500mg Capsule', '500mg', 'Capsule', '21 capsules', 'capsules', '00000000-0000-0000-0000-000000000260', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000000206', '00000000-0000-0000-0000-000000000103', 'SKU-AMOX-002', 'Amoxicillin 250mg Capsule', '250mg', 'Capsule', '15 capsules', 'capsules', '00000000-0000-0000-0000-000000000261', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000000207', '00000000-0000-0000-0000-000000000104', 'SKU-INS-001', 'Insulin Glargine 100IU/ml', '100IU/ml', 'Injection', '10ml vial', 'vials', '00000000-0000-0000-0000-000000000262', true, true, now(), now()),
    ('00000000-0000-0000-0000-000000000208', '00000000-0000-0000-0000-000000000104', 'SKU-INS-002', 'Insulin Glargine 300IU/ml', '300IU/ml', 'Injection', '3ml pen', 'pens', '00000000-0000-0000-0000-000000000263', true, true, now(), now()),
    ('00000000-0000-0000-0000-000000000209', '00000000-0000-0000-0000-000000000105', 'SKU-MET-001', 'Metformin 850mg Tablet', '850mg', 'Tablet', '30 tablets', 'tablets', '00000000-0000-0000-0000-000000000264', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000000210', '00000000-0000-0000-0000-000000000105', 'SKU-MET-002', 'Metformin 500mg Tablet', '500mg', 'Tablet', '60 tablets', 'tablets', '00000000-0000-0000-0000-000000000265', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000000211', '00000000-0000-0000-0000-000000000106', 'SKU-LIS-001', 'Lisinopril 10mg Tablet', '10mg', 'Tablet', '30 tablets', 'tablets', '00000000-0000-0000-0000-000000000266', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000000212', '00000000-0000-0000-0000-000000000106', 'SKU-LIS-002', 'Lisinopril 20mg Tablet', '20mg', 'Tablet', '30 tablets', 'tablets', '00000000-0000-0000-0000-000000000267', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000000213', '00000000-0000-0000-0000-000000000107', 'SKU-ATO-001', 'Atorvastatin 20mg Tablet', '20mg', 'Tablet', '30 tablets', 'tablets', '00000000-0000-0000-0000-000000000268', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000000214', '00000000-0000-0000-0000-000000000107', 'SKU-ATO-002', 'Atorvastatin 40mg Tablet', '40mg', 'Tablet', '30 tablets', 'tablets', '00000000-0000-0000-0000-000000000269', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000000215', '00000000-0000-0000-0000-000000000108', 'SKU-SAL-001', 'Salbutamol 100mcg Inhaler', '100mcg', 'Inhaler', '200 doses', 'inhalers', '00000000-0000-0000-0000-000000000270', true, true, now(), now()),
    ('00000000-0000-0000-0000-000000000216', '00000000-0000-0000-0000-000000000108', 'SKU-SAL-002', 'Salbutamol 200mcg Inhaler', '200mcg', 'Inhaler', '200 doses', 'inhalers', '00000000-0000-0000-0000-000000000271', true, true, now(), now()),
    ('00000000-0000-0000-0000-000000000217', '00000000-0000-0000-0000-000000000109', 'SKU-OME-001', 'Omeprazole 20mg Capsule', '20mg', 'Capsule', '28 capsules', 'capsules', '00000000-0000-0000-0000-000000000272', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000000218', '00000000-0000-0000-0000-000000000109', 'SKU-OME-002', 'Omeprazole 40mg Capsule', '40mg', 'Capsule', '14 capsules', 'capsules', '00000000-0000-0000-0000-000000000273', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000000219', '00000000-0000-0000-0000-000000000110', 'SKU-AZI-001', 'Azithromycin 250mg Tablet', '250mg', 'Tablet', '6 tablets', 'tablets', '00000000-0000-0000-0000-000000000274', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000000220', '00000000-0000-0000-0000-000000000110', 'SKU-AZI-002', 'Azithromycin 500mg Tablet', '500mg', 'Tablet', '3 tablets', 'tablets', '00000000-0000-0000-0000-000000000275', false, true, now(), now())
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

-- ============================================================================
-- Seed critical medicines (10 entries)
-- ============================================================================

INSERT INTO critical_medicines (
    id, sku_id, designated_at, designated_by, is_active, created_at, updated_at
)
VALUES
    ('00000000-0000-0000-0000-000000000301', '00000000-0000-0000-0000-000000000203', now(), '00000000-0000-0000-0000-000000000001', true, now(), now()),
    ('00000000-0000-0000-0000-000000000302', '00000000-0000-0000-0000-000000000204', now(), '00000000-0000-0000-0000-000000000001', true, now(), now()),
    ('00000000-0000-0000-0000-000000000303', '00000000-0000-0000-0000-000000000205', now(), '00000000-0000-0000-0000-000000000001', true, now(), now()),
    ('00000000-0000-0000-0000-000000000304', '00000000-0000-0000-0000-000000000206', now(), '00000000-0000-0000-0000-000000000001', true, now(), now()),
    ('00000000-0000-0000-0000-000000000305', '00000000-0000-0000-0000-000000000207', now(), '00000000-0000-0000-0000-000000000001', true, now(), now()),
    ('00000000-0000-0000-0000-000000000306', '00000000-0000-0000-0000-000000000208', now(), '00000000-0000-0000-0000-000000000001', true, now(), now()),
    ('00000000-0000-0000-0000-000000000307', '00000000-0000-0000-0000-000000000215', now(), '00000000-0000-0000-0000-000000000001', true, now(), now()),
    ('00000000-0000-0000-0000-000000000308', '00000000-0000-0000-0000-000000000216', now(), '00000000-0000-0000-0000-000000000001', true, now(), now()),
    ('00000000-0000-0000-0000-000000000309', '00000000-0000-0000-0000-000000000219', now(), '00000000-0000-0000-0000-000000000001', true, now(), now()),
    ('00000000-0000-0000-0000-000000000310', '00000000-0000-0000-0000-000000000220', now(), '00000000-0000-0000-0000-000000000001', true, now(), now())
ON CONFLICT (id) DO UPDATE SET
    sku_id = EXCLUDED.sku_id,
    designated_by = EXCLUDED.designated_by,
    is_active = EXCLUDED.is_active,
    updated_at = now();

-- ============================================================================
-- Seed registry submissions (13 entries across all statuses)
-- ============================================================================

INSERT INTO registry_submissions (
    id, submission_type, entity_type, entity_id, submission_data, status,
    submitted_by, verified_by, verified_at, approved_by, approved_at,
    implemented_by, implemented_at, rejection_reason, created_at, updated_at
)
VALUES
    -- draft (2)
    ('00000000-0000-0000-0000-000000000311', 'company_update', 'company', '00000000-0000-0000-0000-000000000001',
     '{"name": "PharmaCorp Inc Updated"}'::jsonb, 'draft',
     '00000000-0000-0000-0000-000000000005', NULL, NULL, NULL, NULL, NULL, NULL, NULL, now(), now()),
    ('00000000-0000-0000-0000-000000000312', 'product_update', 'product', '00000000-0000-0000-0000-000000000101',
     '{"name": "Paracetamol 500mg Updated"}'::jsonb, 'draft',
     '00000000-0000-0000-0000-000000000005', NULL, NULL, NULL, NULL, NULL, NULL, NULL, now(), now()),

    -- submitted (2)
    ('00000000-0000-0000-0000-000000000313', 'sku_update', 'sku', '00000000-0000-0000-0000-000000000201',
     '{"pack_size": "60 tablets"}'::jsonb, 'submitted',
     '00000000-0000-0000-0000-000000000005', NULL, NULL, NULL, NULL, NULL, NULL, NULL, now(), now()),
    ('00000000-0000-0000-0000-000000000314', 'product_update', 'product', '00000000-0000-0000-0000-000000000102',
     '{"description": "Updated description"}'::jsonb, 'submitted',
     '00000000-0000-0000-0000-000000000005', NULL, NULL, NULL, NULL, NULL, NULL, NULL, now(), now()),

    -- tier2_verified (2)
    ('00000000-0000-0000-0000-000000000315', 'product_update', 'product', '00000000-0000-0000-0000-000000000103',
     '{"description": "Verified update"}'::jsonb, 'tier2_verified',
     '00000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000002', now(), NULL, NULL, NULL, NULL, NULL, now(), now()),
    ('00000000-0000-0000-0000-000000000316', 'sku_update', 'sku', '00000000-0000-0000-0000-000000000202',
     '{"dosage_strength": "650mg"}'::jsonb, 'tier2_verified',
     '00000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000002', now(), NULL, NULL, NULL, NULL, NULL, now(), now()),

    -- tier1_approved (2)
    ('00000000-0000-0000-0000-000000000317', 'product_update', 'product', '00000000-0000-0000-0000-000000000104',
     '{"description": "Approved update"}'::jsonb, 'tier1_approved',
     '00000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000002', now(), '00000000-0000-0000-0000-000000000001', now(), NULL, NULL, NULL, now(), now()),
    ('00000000-0000-0000-0000-000000000318', 'sku_update', 'sku', '00000000-0000-0000-0000-000000000203',
     '{"pack_size": "90 tablets"}'::jsonb, 'tier1_approved',
     '00000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000002', now(), '00000000-0000-0000-0000-000000000001', now(), NULL, NULL, NULL, now(), now()),

    -- tier2_implemented (2)
    ('00000000-0000-0000-0000-000000000319', 'product_update', 'product', '00000000-0000-0000-0000-000000000105',
     '{"description": "Implemented update"}'::jsonb, 'tier2_implemented',
     '00000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000002', now(), '00000000-0000-0000-0000-000000000001', now(), '00000000-0000-0000-0000-000000000003', now(), NULL, now(), now()),
    ('00000000-0000-0000-0000-000000000320', 'sku_update', 'sku', '00000000-0000-0000-0000-000000000204',
     '{"dosage_strength": "300mg"}'::jsonb, 'tier2_implemented',
     '00000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000002', now(), '00000000-0000-0000-0000-000000000001', now(), '00000000-0000-0000-0000-000000000003', now(), NULL, now(), now()),

    -- completed (2)
    ('00000000-0000-0000-0000-000000000321', 'product_update', 'product', '00000000-0000-0000-0000-000000000106',
     '{"description": "Completed update"}'::jsonb, 'completed',
     '00000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000002', now(), '00000000-0000-0000-0000-000000000001', now(), '00000000-0000-0000-0000-000000000003', now(), NULL, now(), now()),
    ('00000000-0000-0000-0000-000000000322', 'sku_update', 'sku', '00000000-0000-0000-0000-000000000205',
     '{"pack_size": "120 tablets"}'::jsonb, 'completed',
     '00000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000002', now(), '00000000-0000-0000-0000-000000000001', now(), '00000000-0000-0000-0000-000000000003', now(), NULL, now(), now()),

    -- rejected (1)
    ('00000000-0000-0000-0000-000000000323', 'product_update', 'product', '00000000-0000-0000-0000-000000000107',
     '{"description": "Rejected update"}'::jsonb, 'rejected',
     '00000000-0000-0000-0000-000000000005', NULL, NULL, NULL, NULL, NULL, NULL, 'Insufficient documentation', now(), now())
ON CONFLICT (id) DO UPDATE SET
    submission_type = EXCLUDED.submission_type,
    entity_type = EXCLUDED.entity_type,
    entity_id = EXCLUDED.entity_id,
    submission_data = EXCLUDED.submission_data,
    status = EXCLUDED.status,
    submitted_by = EXCLUDED.submitted_by,
    verified_by = EXCLUDED.verified_by,
    verified_at = EXCLUDED.verified_at,
    approved_by = EXCLUDED.approved_by,
    approved_at = EXCLUDED.approved_at,
    implemented_by = EXCLUDED.implemented_by,
    implemented_at = EXCLUDED.implemented_at,
    rejection_reason = EXCLUDED.rejection_reason,
    updated_at = now();

-- ============================================================================
-- Seed approvals + approval_history for registry submissions
-- ============================================================================

INSERT INTO approvals (
    id, submission_id, submission_type, from_status, to_status, approver_id, approval_type, comments, created_at
)
VALUES
    ('00000000-0000-0000-0000-000000000401', '00000000-0000-0000-0000-000000000315', 'registry', 'submitted', 'tier2_verified', '00000000-0000-0000-0000-000000000002', 'verify', 'Seed verification', now()),
    ('00000000-0000-0000-0000-000000000402', '00000000-0000-0000-0000-000000000316', 'registry', 'submitted', 'tier2_verified', '00000000-0000-0000-0000-000000000002', 'verify', 'Seed verification', now()),
    ('00000000-0000-0000-0000-000000000403', '00000000-0000-0000-0000-000000000317', 'registry', 'tier2_verified', 'tier1_approved', '00000000-0000-0000-0000-000000000001', 'approve', 'Seed approval', now()),
    ('00000000-0000-0000-0000-000000000404', '00000000-0000-0000-0000-000000000318', 'registry', 'tier2_verified', 'tier1_approved', '00000000-0000-0000-0000-000000000001', 'approve', 'Seed approval', now()),
    ('00000000-0000-0000-0000-000000000405', '00000000-0000-0000-0000-000000000319', 'registry', 'tier1_approved', 'tier2_implemented', '00000000-0000-0000-0000-000000000003', 'implement', 'Seed implementation', now()),
    ('00000000-0000-0000-0000-000000000406', '00000000-0000-0000-0000-000000000320', 'registry', 'tier1_approved', 'tier2_implemented', '00000000-0000-0000-0000-000000000003', 'implement', 'Seed implementation', now()),
    ('00000000-0000-0000-0000-000000000407', '00000000-0000-0000-0000-000000000321', 'registry', 'tier2_implemented', 'completed', '00000000-0000-0000-0000-000000000003', 'implement', 'Seed completion', now()),
    ('00000000-0000-0000-0000-000000000408', '00000000-0000-0000-0000-000000000322', 'registry', 'tier2_implemented', 'completed', '00000000-0000-0000-0000-000000000003', 'implement', 'Seed completion', now()),
    ('00000000-0000-0000-0000-000000000409', '00000000-0000-0000-0000-000000000323', 'registry', 'submitted', 'rejected', '00000000-0000-0000-0000-000000000001', 'reject', 'Seed rejection', now())
ON CONFLICT (id) DO UPDATE SET
    submission_id = EXCLUDED.submission_id,
    submission_type = EXCLUDED.submission_type,
    from_status = EXCLUDED.from_status,
    to_status = EXCLUDED.to_status,
    approver_id = EXCLUDED.approver_id,
    approval_type = EXCLUDED.approval_type,
    comments = EXCLUDED.comments,
    created_at = EXCLUDED.created_at;

INSERT INTO approval_history (
    id, approval_id, submission_id, submission_type, workflow_stage, action_taken, approver_id, approver_role, comments, metadata, created_at
)
VALUES
    ('00000000-0000-0000-0000-000000000501', '00000000-0000-0000-0000-000000000401', '00000000-0000-0000-0000-000000000315', 'registry', 'tier2_verified', 'verified', '00000000-0000-0000-0000-000000000002', 'tier2_officer', 'Seed verification', '{}'::jsonb, now()),
    ('00000000-0000-0000-0000-000000000502', '00000000-0000-0000-0000-000000000402', '00000000-0000-0000-0000-000000000316', 'registry', 'tier2_verified', 'verified', '00000000-0000-0000-0000-000000000002', 'tier2_officer', 'Seed verification', '{}'::jsonb, now()),
    ('00000000-0000-0000-0000-000000000503', '00000000-0000-0000-0000-000000000403', '00000000-0000-0000-0000-000000000317', 'registry', 'tier1_approved', 'approved', '00000000-0000-0000-0000-000000000001', 'tier1', 'Seed approval', '{}'::jsonb, now()),
    ('00000000-0000-0000-0000-000000000504', '00000000-0000-0000-0000-000000000404', '00000000-0000-0000-0000-000000000318', 'registry', 'tier1_approved', 'approved', '00000000-0000-0000-0000-000000000001', 'tier1', 'Seed approval', '{}'::jsonb, now()),
    ('00000000-0000-0000-0000-000000000505', '00000000-0000-0000-0000-000000000405', '00000000-0000-0000-0000-000000000319', 'registry', 'tier2_implemented', 'implemented', '00000000-0000-0000-0000-000000000003', 'tier2_registrar', 'Seed implementation', '{}'::jsonb, now()),
    ('00000000-0000-0000-0000-000000000506', '00000000-0000-0000-0000-000000000406', '00000000-0000-0000-0000-000000000320', 'registry', 'tier2_implemented', 'implemented', '00000000-0000-0000-0000-000000000003', 'tier2_registrar', 'Seed implementation', '{}'::jsonb, now()),
    ('00000000-0000-0000-0000-000000000507', '00000000-0000-0000-0000-000000000407', '00000000-0000-0000-0000-000000000321', 'registry', 'completed', 'completed', '00000000-0000-0000-0000-000000000003', 'tier2_registrar', 'Seed completion', '{}'::jsonb, now()),
    ('00000000-0000-0000-0000-000000000508', '00000000-0000-0000-0000-000000000408', '00000000-0000-0000-0000-000000000322', 'registry', 'completed', 'completed', '00000000-0000-0000-0000-000000000003', 'tier2_registrar', 'Seed completion', '{}'::jsonb, now()),
    ('00000000-0000-0000-0000-000000000509', '00000000-0000-0000-0000-000000000409', '00000000-0000-0000-0000-000000000323', 'registry', 'rejected', 'rejected', '00000000-0000-0000-0000-000000000001', 'tier1', 'Seed rejection', '{}'::jsonb, now())
ON CONFLICT (id) DO UPDATE SET
    approval_id = EXCLUDED.approval_id,
    submission_id = EXCLUDED.submission_id,
    submission_type = EXCLUDED.submission_type,
    workflow_stage = EXCLUDED.workflow_stage,
    action_taken = EXCLUDED.action_taken,
    approver_id = EXCLUDED.approver_id,
    approver_role = EXCLUDED.approver_role,
    comments = EXCLUDED.comments,
    metadata = EXCLUDED.metadata,
    created_at = EXCLUDED.created_at;

COMMIT;
