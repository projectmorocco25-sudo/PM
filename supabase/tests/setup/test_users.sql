-- Test User Setup Script
-- Creates test users for each role to be used in tests
-- 
-- Usage: This script should be run before executing tests to ensure test users exist
-- 
-- Note: Test users are created with deterministic IDs for reproducibility
-- Test users should be cleaned up after tests complete

BEGIN;

-- Test User IDs (deterministic for reproducibility)
DO $$
DECLARE
    v_tier1_user_id uuid := '00000000-0000-0000-0000-000000000001';
    v_tier2_officer_user_id uuid := '00000000-0000-0000-0000-000000000002';
    v_tier2_registrar_user_id uuid := '00000000-0000-0000-0000-000000000003';
    v_auditor_user_id uuid := '00000000-0000-0000-0000-000000000004';
    v_company_admin_user_id uuid := '00000000-0000-0000-0000-000000000005';
    v_company_manager_user_id uuid := '00000000-0000-0000-0000-000000000006';
    v_company_user_user_id uuid := '00000000-0000-0000-0000-000000000007';
    v_system_admin_user_id uuid := '00000000-0000-0000-0000-000000000008';
    v_vendor_user_id uuid := '00000000-0000-0000-0000-000000000009';
    v_test_company_id uuid := '00000000-0000-0000-0000-000000000100';
BEGIN
    -- Create test company first (required for company users)
    INSERT INTO companies (
        id,
        registration_number,
        name,
        company_type,
        email,
        phone,
        address,
        status,
        created_at,
        updated_at
    ) VALUES (
        v_test_company_id,
        'TEST-COMP-001',
        'Test Company Ltd',
        'manufacturer',
        'test@testcompany.com',
        '+212600000000',
        'Test Address',
        'active',
        now(),
        now()
    ) ON CONFLICT (id) DO NOTHING;

    -- Create MOH Tier 1 test user
    INSERT INTO users (
        id,
        email,
        role,
        is_active,
        created_at,
        updated_at
    ) VALUES (
        v_tier1_user_id,
        'tier1@test.moh.gov.ma',
        'tier1',
        true,
        now(),
        now()
    ) ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        role = EXCLUDED.role,
        is_active = EXCLUDED.is_active,
        updated_at = now();

    -- Create MOH Tier 2 Officer test user
    INSERT INTO users (
        id,
        email,
        role,
        is_active,
        created_at,
        updated_at
    ) VALUES (
        v_tier2_officer_user_id,
        'tier2officer@test.moh.gov.ma',
        'tier2_officer',
        true,
        now(),
        now()
    ) ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        role = EXCLUDED.role,
        is_active = EXCLUDED.is_active,
        updated_at = now();

    -- Create MOH Tier 2 Registrar test user
    INSERT INTO users (
        id,
        email,
        role,
        is_active,
        created_at,
        updated_at
    ) VALUES (
        v_tier2_registrar_user_id,
        'tier2registrar@test.moh.gov.ma',
        'tier2_registrar',
        true,
        now(),
        now()
    ) ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        role = EXCLUDED.role,
        is_active = EXCLUDED.is_active,
        updated_at = now();

    -- Create MOH Auditor test user
    INSERT INTO users (
        id,
        email,
        role,
        is_active,
        created_at,
        updated_at
    ) VALUES (
        v_auditor_user_id,
        'auditor@test.moh.gov.ma',
        'auditor',
        true,
        now(),
        now()
    ) ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        role = EXCLUDED.role,
        is_active = EXCLUDED.is_active,
        updated_at = now();

    -- Create Company Admin test user
    INSERT INTO users (
        id,
        email,
        role,
        company_id,
        is_active,
        created_at,
        updated_at
    ) VALUES (
        v_company_admin_user_id,
        'admin@testcompany.com',
        'company_admin',
        v_test_company_id,
        true,
        now(),
        now()
    ) ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        role = EXCLUDED.role,
        company_id = EXCLUDED.company_id,
        is_active = EXCLUDED.is_active,
        updated_at = now();

    -- Create Company Manager test user
    INSERT INTO users (
        id,
        email,
        role,
        company_id,
        is_active,
        created_at,
        updated_at
    ) VALUES (
        v_company_manager_user_id,
        'manager@testcompany.com',
        'company_manager',
        v_test_company_id,
        true,
        now(),
        now()
    ) ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        role = EXCLUDED.role,
        company_id = EXCLUDED.company_id,
        is_active = EXCLUDED.is_active,
        updated_at = now();

    -- Create Company User test user
    INSERT INTO users (
        id,
        email,
        role,
        company_id,
        is_active,
        created_at,
        updated_at
    ) VALUES (
        v_company_user_user_id,
        'user@testcompany.com',
        'company_user',
        v_test_company_id,
        true,
        now(),
        now()
    ) ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        role = EXCLUDED.role,
        company_id = EXCLUDED.company_id,
        is_active = EXCLUDED.is_active,
        updated_at = now();

    -- Create System Admin test user
    INSERT INTO users (
        id,
        email,
        role,
        is_active,
        created_at,
        updated_at
    ) VALUES (
        v_system_admin_user_id,
        'admin@test.system',
        'system_admin',
        true,
        now(),
        now()
    ) ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        role = EXCLUDED.role,
        is_active = EXCLUDED.is_active,
        updated_at = now();

    -- Create Vendor test user
    INSERT INTO users (
        id,
        email,
        role,
        is_active,
        created_at,
        updated_at
    ) VALUES (
        v_vendor_user_id,
        'vendor@test.vendor',
        'vendor',
        true,
        now(),
        now()
    ) ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        role = EXCLUDED.role,
        is_active = EXCLUDED.is_active,
        updated_at = now();
END $$;

COMMIT;
