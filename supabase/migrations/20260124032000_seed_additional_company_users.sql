-- Migration: seed_additional_company_users
-- Description: Seed users for 10 additional companies to meet seed data requirements
-- Date: 2026-01-24
-- Task: 1.1.3.6 (Seed Data Fixes)
-- Owner: Hassan (QA/Assurance Engineer)
-- Compliance: Deterministic IDs + idempotent UPSERTs

BEGIN;

-- Note: Using pre-computed bcrypt hash for 'TestPassword123!'
-- This avoids gen_salt() issues in migration context
-- Hash format: $2a$10$... (bcrypt with cost factor 10)

-- Ensure auth instance exists
INSERT INTO auth.instances (id, uuid, raw_base_config, created_at, updated_at)
SELECT gen_random_uuid(), gen_random_uuid(), '{}'::text, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM auth.instances);

-- ============================================================================
-- Seed auth.users for 10 additional companies
-- Companies: 002-011 (Rabat, Marrakech, Tangier, Agadir, Fes, Meknes, Oujda, Kenitra, Tetouan, Safi)
-- ============================================================================

WITH instance_row AS (
    SELECT id FROM auth.instances LIMIT 1
),
user_seed AS (
    VALUES
        -- Rabat Pharma Industries (002)
        ('00000000-0000-0000-0000-000000000010', 'admin@rabatpharma.ma', '00000000-0000-0000-0000-000000000002'),
        ('00000000-0000-0000-0000-000000000011', 'manager@rabatpharma.ma', '00000000-0000-0000-0000-000000000002'),
        -- Marrakech Pharma Industries (003)
        ('00000000-0000-0000-0000-000000000012', 'admin@marrakechpharma.ma', '00000000-0000-0000-0000-000000000003'),
        ('00000000-0000-0000-0000-000000000013', 'manager@marrakechpharma.ma', '00000000-0000-0000-0000-000000000003'),
        -- Tangier Pharma Industries (004)
        ('00000000-0000-0000-0000-000000000014', 'admin@tangierpharma.ma', '00000000-0000-0000-0000-000000000004'),
        ('00000000-0000-0000-0000-000000000015', 'user@tangierpharma.ma', '00000000-0000-0000-0000-000000000004'),
        -- Agadir Pharma Industries (005)
        ('00000000-0000-0000-0000-000000000016', 'admin@agadirpharma.ma', '00000000-0000-0000-0000-000000000005'),
        ('00000000-0000-0000-0000-000000000017', 'manager@agadirpharma.ma', '00000000-0000-0000-0000-000000000005'),
        -- Fes Pharma Industries (006)
        ('00000000-0000-0000-0000-000000000018', 'admin@fespharma.ma', '00000000-0000-0000-0000-000000000006'),
        ('00000000-0000-0000-0000-000000000019', 'user@fespharma.ma', '00000000-0000-0000-0000-000000000006'),
        -- Meknes Pharma Industries (007)
        ('00000000-0000-0000-0000-000000000020', 'admin@meknespharma.ma', '00000000-0000-0000-0000-000000000007'),
        ('00000000-0000-0000-0000-000000000021', 'manager@meknespharma.ma', '00000000-0000-0000-0000-000000000007'),
        -- Oujda Pharma Industries (008)
        ('00000000-0000-0000-0000-000000000022', 'admin@oujdapharma.ma', '00000000-0000-0000-0000-000000000008'),
        ('00000000-0000-0000-0000-000000000023', 'user@oujdapharma.ma', '00000000-0000-0000-0000-000000000008'),
        -- Kenitra Pharma Industries (009)
        ('00000000-0000-0000-0000-000000000024', 'admin@kenitrapharma.ma', '00000000-0000-0000-0000-000000000009'),
        ('00000000-0000-0000-0000-000000000025', 'manager@kenitrapharma.ma', '00000000-0000-0000-0000-000000000009'),
        -- Tetouan Pharma Industries (010)
        ('00000000-0000-0000-0000-000000000026', 'admin@tetouanpharma.ma', '00000000-0000-0000-0000-000000000010'),
        ('00000000-0000-0000-0000-000000000027', 'user@tetouanpharma.ma', '00000000-0000-0000-0000-000000000010'),
        -- Safi Pharma Industries (011)
        ('00000000-0000-0000-0000-000000000028', 'admin@safipharma.ma', '00000000-0000-0000-0000-000000000011'),
        ('00000000-0000-0000-0000-000000000029', 'manager@safipharma.ma', '00000000-0000-0000-0000-000000000011')
)
INSERT INTO auth.users (
    id, email, aud, role, raw_app_meta_data, raw_user_meta_data, encrypted_password,
    instance_id, confirmation_token, recovery_token, email_change_token_new,
    email_change_token_current, email_change, phone_change_token, phone_change,
    reauthentication_token, created_at, updated_at, email_confirmed_at, is_sso_user, is_anonymous
)
SELECT
    (user_seed.column1)::uuid,
    user_seed.column2,
    'authenticated',
    'authenticated',
    '{}'::jsonb,
    '{}'::jsonb,
    '$2b$10$GOeTWoYmPTPzc1RZ473blOoW7hXY5Qp.1e3kdjOD61tDDHxD2lvXq'::text,
    instance_row.id,
    '', '', '', '', '', '', '', '', now(), now(), now(), false, false
FROM user_seed
CROSS JOIN instance_row
ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    encrypted_password = EXCLUDED.encrypted_password,
    updated_at = now();

-- Ensure auth identities exist
INSERT INTO auth.identities (
    id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
)
SELECT
    gen_random_uuid(),
    u.id,
    jsonb_build_object('sub', u.id::text, 'email', u.email),
    'email',
    u.id::text,
    now(),
    now(),
    now()
FROM auth.users u
WHERE u.id IN (
    '00000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000011',
    '00000000-0000-0000-0000-000000000012', '00000000-0000-0000-0000-000000000013',
    '00000000-0000-0000-0000-000000000014', '00000000-0000-0000-0000-000000000015',
    '00000000-0000-0000-0000-000000000016', '00000000-0000-0000-0000-000000000017',
    '00000000-0000-0000-0000-000000000018', '00000000-0000-0000-0000-000000000019',
    '00000000-0000-0000-0000-000000000020', '00000000-0000-0000-0000-000000000021',
    '00000000-0000-0000-0000-000000000022', '00000000-0000-0000-0000-000000000023',
    '00000000-0000-0000-0000-000000000024', '00000000-0000-0000-0000-000000000025',
    '00000000-0000-0000-0000-000000000026', '00000000-0000-0000-0000-000000000027',
    '00000000-0000-0000-0000-000000000028', '00000000-0000-0000-0000-000000000029'
)
AND NOT EXISTS (SELECT 1 FROM auth.identities WHERE user_id = u.id);

-- ============================================================================
-- Seed public.users for 10 additional companies
-- ============================================================================

INSERT INTO users (
    id, email, full_name, company_id, role, notification_preferences, is_active, created_at, updated_at
)
VALUES
    -- Rabat Pharma Industries (002)
    ('00000000-0000-0000-0000-000000000010', 'admin@rabatpharma.ma', 'Ahmed Benali', '00000000-0000-0000-0000-000000000002', 'company_admin',
     '{"email_enabled": true, "submission_updates": true, "compliance_alerts": true, "enforcement_actions": true, "system_announcements": true}'::jsonb, true, now(), now()),
    ('00000000-0000-0000-0000-000000000011', 'manager@rabatpharma.ma', 'Fatima El Amrani', '00000000-0000-0000-0000-000000000002', 'company_manager',
     '{"email_enabled": true, "submission_updates": true, "compliance_alerts": true, "enforcement_actions": true, "system_announcements": true}'::jsonb, true, now(), now()),
    -- Marrakech Pharma Industries (003)
    ('00000000-0000-0000-0000-000000000012', 'admin@marrakechpharma.ma', 'Youssef Idrissi', '00000000-0000-0000-0000-000000000003', 'company_admin',
     '{"email_enabled": true, "submission_updates": true, "compliance_alerts": true, "enforcement_actions": true, "system_announcements": true}'::jsonb, true, now(), now()),
    ('00000000-0000-0000-0000-000000000013', 'manager@marrakechpharma.ma', 'Aicha Ouhdadi', '00000000-0000-0000-0000-000000000003', 'company_manager',
     '{"email_enabled": true, "submission_updates": true, "compliance_alerts": true, "enforcement_actions": true, "system_announcements": true}'::jsonb, true, now(), now()),
    -- Tangier Pharma Industries (004)
    ('00000000-0000-0000-0000-000000000014', 'admin@tangierpharma.ma', 'Mohamed Bensalem', '00000000-0000-0000-0000-000000000004', 'company_admin',
     '{"email_enabled": true, "submission_updates": true, "compliance_alerts": true, "enforcement_actions": true, "system_announcements": true}'::jsonb, true, now(), now()),
    ('00000000-0000-0000-0000-000000000015', 'user@tangierpharma.ma', 'Khadija El Fassi', '00000000-0000-0000-0000-000000000004', 'company_user',
     '{"email_enabled": true, "submission_updates": true, "compliance_alerts": true, "enforcement_actions": true, "system_announcements": true}'::jsonb, true, now(), now()),
    -- Agadir Pharma Industries (005)
    ('00000000-0000-0000-0000-000000000016', 'admin@agadirpharma.ma', 'Hassan El Mansouri', '00000000-0000-0000-0000-000000000005', 'company_admin',
     '{"email_enabled": true, "submission_updates": true, "compliance_alerts": true, "enforcement_actions": true, "system_announcements": true}'::jsonb, true, now(), now()),
    ('00000000-0000-0000-0000-000000000017', 'manager@agadirpharma.ma', 'Nadia Benkacem', '00000000-0000-0000-0000-000000000005', 'company_manager',
     '{"email_enabled": true, "submission_updates": true, "compliance_alerts": true, "enforcement_actions": true, "system_announcements": true}'::jsonb, true, now(), now()),
    -- Fes Pharma Industries (006)
    ('00000000-0000-0000-0000-000000000018', 'admin@fespharma.ma', 'Omar Ait Lahcen', '00000000-0000-0000-0000-000000000006', 'company_admin',
     '{"email_enabled": true, "submission_updates": true, "compliance_alerts": true, "enforcement_actions": true, "system_announcements": true}'::jsonb, true, now(), now()),
    ('00000000-0000-0000-0000-000000000019', 'user@fespharma.ma', 'Salma Tazi', '00000000-0000-0000-0000-000000000006', 'company_user',
     '{"email_enabled": true, "submission_updates": true, "compliance_alerts": true, "enforcement_actions": true, "system_announcements": true}'::jsonb, true, now(), now()),
    -- Meknes Pharma Industries (007)
    ('00000000-0000-0000-0000-000000000020', 'admin@meknespharma.ma', 'Karim Alaoui', '00000000-0000-0000-0000-000000000007', 'company_admin',
     '{"email_enabled": true, "submission_updates": true, "compliance_alerts": true, "enforcement_actions": true, "system_announcements": true}'::jsonb, true, now(), now()),
    ('00000000-0000-0000-0000-000000000021', 'manager@meknespharma.ma', 'Layla Berrada', '00000000-0000-0000-0000-000000000007', 'company_manager',
     '{"email_enabled": true, "submission_updates": true, "compliance_alerts": true, "enforcement_actions": true, "system_announcements": true}'::jsonb, true, now(), now()),
    -- Oujda Pharma Industries (008)
    ('00000000-0000-0000-0000-000000000022', 'admin@oujdapharma.ma', 'Rachid Chraibi', '00000000-0000-0000-0000-000000000008', 'company_admin',
     '{"email_enabled": true, "submission_updates": true, "compliance_alerts": true, "enforcement_actions": true, "system_announcements": true}'::jsonb, true, now(), now()),
    ('00000000-0000-0000-0000-000000000023', 'user@oujdapharma.ma', 'Sanae El Ouazzani', '00000000-0000-0000-0000-000000000008', 'company_user',
     '{"email_enabled": true, "submission_updates": true, "compliance_alerts": true, "enforcement_actions": true, "system_announcements": true}'::jsonb, true, now(), now()),
    -- Kenitra Pharma Industries (009)
    ('00000000-0000-0000-0000-000000000024', 'admin@kenitrapharma.ma', 'Mehdi Bennani', '00000000-0000-0000-0000-000000000009', 'company_admin',
     '{"email_enabled": true, "submission_updates": true, "compliance_alerts": true, "enforcement_actions": true, "system_announcements": true}'::jsonb, true, now(), now()),
    ('00000000-0000-0000-0000-000000000025', 'manager@kenitrapharma.ma', 'Imane El Malki', '00000000-0000-0000-0000-000000000009', 'company_manager',
     '{"email_enabled": true, "submission_updates": true, "compliance_alerts": true, "enforcement_actions": true, "system_announcements": true}'::jsonb, true, now(), now()),
    -- Tetouan Pharma Industries (010)
    ('00000000-0000-0000-0000-000000000026', 'admin@tetouanpharma.ma', 'Anass El Fassi', '00000000-0000-0000-0000-000000000010', 'company_admin',
     '{"email_enabled": true, "submission_updates": true, "compliance_alerts": true, "enforcement_actions": true, "system_announcements": true}'::jsonb, true, now(), now()),
    ('00000000-0000-0000-0000-000000000027', 'user@tetouanpharma.ma', 'Hind El Amrani', '00000000-0000-0000-0000-000000000010', 'company_user',
     '{"email_enabled": true, "submission_updates": true, "compliance_alerts": true, "enforcement_actions": true, "system_announcements": true}'::jsonb, true, now(), now()),
    -- Safi Pharma Industries (011)
    ('00000000-0000-0000-0000-000000000028', 'admin@safipharma.ma', 'Yassine Idrissi', '00000000-0000-0000-0000-000000000011', 'company_admin',
     '{"email_enabled": true, "submission_updates": true, "compliance_alerts": true, "enforcement_actions": true, "system_announcements": true}'::jsonb, true, now(), now()),
    ('00000000-0000-0000-0000-000000000029', 'manager@safipharma.ma', 'Zineb Ouhdadi', '00000000-0000-0000-0000-000000000011', 'company_manager',
     '{"email_enabled": true, "submission_updates": true, "compliance_alerts": true, "enforcement_actions": true, "system_announcements": true}'::jsonb, true, now(), now())
ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    company_id = EXCLUDED.company_id,
    role = EXCLUDED.role,
    notification_preferences = EXCLUDED.notification_preferences,
    is_active = EXCLUDED.is_active,
    updated_at = now();

COMMIT;
