-- Migration: update_seed_names
-- Description: Update seed company and user names to realistic values
-- Date: 2026-01-24
-- Task: 1.1.3.6 (seed data realism)
-- Owner: Hassan (Seed Data & Testing Owner)

BEGIN;

-- ============================================================================
-- Update company names, addresses, and contact emails to realistic values
-- ============================================================================

WITH city_names AS (
    SELECT ARRAY[
        'Casablanca', 'Rabat', 'Marrakech', 'Tangier', 'Agadir',
        'Fes', 'Meknes', 'Oujda', 'Kenitra', 'Tetouan',
        'Safi', 'El Jadida', 'Nador', 'Khouribga', 'Laayoune'
    ] AS cities
),
suffix_names AS (
    SELECT ARRAY[
        'Pharma Industries',
        'MedSupply Group',
        'Healthcare Solutions',
        'Pharmaceuticals',
        'Life Sciences'
    ] AS suffixes
),
company_seed AS (
    SELECT
        gs AS idx,
        ('00000000-0000-0000-0000-' || lpad(gs::text, 12, '0'))::uuid AS id,
        (cities[(gs - 1) % 15 + 1] || ' ' || suffixes[((gs - 1) / 15) + 1]) AS name,
        (cities[(gs - 1) % 15 + 1] || ', Morocco') AS address
    FROM generate_series(1, 75) gs
    CROSS JOIN city_names
    CROSS JOIN suffix_names
)
UPDATE companies c
SET
    name = s.name,
    address = s.address,
    contact_email = lower(regexp_replace(s.name, '[^a-zA-Z0-9]', '', 'g')) || '@example.ma',
    updated_at = now()
FROM company_seed s
WHERE c.id = s.id;

-- ============================================================================
-- Update user full names to realistic values
-- ============================================================================

UPDATE users u
SET
    full_name = v.full_name,
    updated_at = now()
FROM (
    VALUES
        ('00000000-0000-0000-0000-000000000001'::uuid, 'Amina Benali'),
        ('00000000-0000-0000-0000-000000000002'::uuid, 'Youssef El Amrani'),
        ('00000000-0000-0000-0000-000000000003'::uuid, 'Hassan El Idrissi'),
        ('00000000-0000-0000-0000-000000000004'::uuid, 'Salma Ouhdadi'),
        ('00000000-0000-0000-0000-000000000005'::uuid, 'Karim Bensalem'),
        ('00000000-0000-0000-0000-000000000006'::uuid, 'Nadia El Fassi'),
        ('00000000-0000-0000-0000-000000000007'::uuid, 'Omar El Mansouri'),
        ('00000000-0000-0000-0000-000000000008'::uuid, 'Leila Benkacem'),
        ('00000000-0000-0000-0000-000000000009'::uuid, 'Rachid Ait Lahcen')
) AS v(id, full_name)
WHERE u.id = v.id;

COMMIT;
