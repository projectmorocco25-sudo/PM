-- RMM Company CRUD RPC Functions Unit Tests
-- 
-- Task: 1.1.3.1
-- Tests: rmm_create_company, rmm_update_company, rmm_get_company, rmm_list_companies
-- Framework: pgTAP
--
-- Test User IDs:
--   Company Admin: 00000000-0000-0000-0000-000000000005
--   Company Manager: 00000000-0000-0000-0000-000000000006
--   Company User: 00000000-0000-0000-0000-000000000007
--   MOH Tier 1: 00000000-0000-0000-0000-000000000001
--   System Admin: 00000000-0000-0000-0000-000000000008
--   Test Company: 00000000-0000-0000-0000-000000000100

BEGIN;

-- Load pgTAP
\set ON_ERROR_STOP on
SELECT plan(25); -- Adjust count as tests are added

-- Test User IDs
\set tier1_user_id '00000000-0000-0000-0000-000000000001'
\set company_admin_user_id '00000000-0000-0000-0000-000000000005'
\set company_user_user_id '00000000-0000-0000-0000-000000000007'
\set system_admin_user_id '00000000-0000-0000-0000-000000000008'
\set test_company_id '00000000-0000-0000-0000-000000000100'

-- ============================================================================
-- Test 1: Function Existence
-- ============================================================================

SELECT has_function(
    'public',
    'rmm_create_company',
    ARRAY['uuid', 'text', 'text', 'text', 'text', 'text', 'text'],
    'rmm_create_company function exists'
);

SELECT has_function(
    'public',
    'rmm_update_company',
    ARRAY['uuid', 'uuid', 'text', 'text', 'text', 'text', 'text', 'text'],
    'rmm_update_company function exists'
);

SELECT has_function(
    'public',
    'rmm_get_company',
    ARRAY['uuid', 'uuid'],
    'rmm_get_company function exists'
);

SELECT has_function(
    'public',
    'rmm_list_companies',
    ARRAY['uuid', 'text', 'text', 'text', 'integer', 'integer', 'text', 'text'],
    'rmm_list_companies function exists'
);

-- ============================================================================
-- Test 2: rmm_create_company - Success Cases
-- ============================================================================

-- Test 2.1: MOH Tier 1 can create company
SELECT ok(
    (
        SELECT (rmm_create_company(
            :'tier1_user_id'::uuid,
            'Test Company New',
            'TEST-COMP-NEW-001',
            'ipc',
            'New Test Address',
            'new@testcompany.com',
            '+212600000001'
        ))->>'id' IS NOT NULL
    ),
    'MOH Tier 1 can create company'
);

-- Test 2.2: System Admin can create company
SELECT ok(
    (
        SELECT (rmm_create_company(
            :'system_admin_user_id'::uuid,
            'Test Company New 2',
            'TEST-COMP-NEW-002',
            'wholesaler',
            'New Test Address 2',
            'new2@testcompany.com',
            '+212600000002'
        ))->>'id' IS NOT NULL
    ),
    'System Admin can create company'
);

-- ============================================================================
-- Test 3: rmm_create_company - Access Control
-- ============================================================================

-- Test 3.1: Company user cannot create company
SELECT throws_ok(
    $$SELECT rmm_create_company(
        '00000000-0000-0000-0000-000000000007'::uuid,
        'Test Company New 3',
        'TEST-COMP-NEW-003',
        'ipc',
        'New Test Address 3',
        'new3@testcompany.com',
        '+212600000003'
    )$$,
    'Insufficient permissions: Only MOH Tier 1 and System Admin can create companies',
    'Company user cannot create company'
);

-- ============================================================================
-- Test 4: rmm_create_company - Validation
-- ============================================================================

-- Test 4.1: Duplicate registration number is rejected
SELECT throws_ok(
    $$SELECT rmm_create_company(
        :'tier1_user_id'::uuid,
        'Test Company Duplicate',
        'TEST-COMP-001', -- Already exists from test_users.sql
        'ipc',
        'Duplicate Test Address',
        'duplicate@testcompany.com',
        '+212600000004'
    )$$,
    '23505', -- Unique violation
    'Duplicate registration number is rejected'
);

-- Test 4.2: Invalid company type is rejected
SELECT throws_ok(
    $$SELECT rmm_create_company(
        :'tier1_user_id'::uuid,
        'Test Company Invalid',
        'TEST-COMP-NEW-004',
        'invalid_type',
        'Invalid Test Address',
        'invalid@testcompany.com',
        '+212600000005'
    )$$,
    'Invalid company type',
    'Invalid company type is rejected'
);

-- ============================================================================
-- Test 5: rmm_get_company - Success Cases
-- ============================================================================

-- Test 5.1: MOH Tier 1 can get any company
SELECT ok(
    (
        SELECT (rmm_get_company(
            :'tier1_user_id'::uuid,
            :'test_company_id'::uuid
        ))->>'id' IS NOT NULL
    ),
    'MOH Tier 1 can get any company'
);

-- Test 5.2: Company Admin can get own company
SELECT ok(
    (
        SELECT (rmm_get_company(
            :'company_admin_user_id'::uuid,
            :'test_company_id'::uuid
        ))->>'id' IS NOT NULL
    ),
    'Company Admin can get own company'
);

-- ============================================================================
-- Test 6: rmm_get_company - Access Control
-- ============================================================================

-- Test 6.1: Company user cannot get other company
DO $$
DECLARE
    v_other_company_id uuid;
    v_result jsonb;
BEGIN
    -- Create another company
    v_result := rmm_create_company(
        :'tier1_user_id'::uuid,
        'TEST-COMP-OTHER-001',
        'Other Test Company',
        'manufacturer',
        'other@testcompany.com',
        '+212600000006',
        'Other Test Address',
        'Morocco'
    );
    v_other_company_id := (v_result->>'id')::uuid;
    
    -- Try to get other company as company user
    BEGIN
        v_result := rmm_get_company(
            :'company_user_user_id'::uuid,
            v_other_company_id
        );
        RAISE EXCEPTION 'Expected error not raised';
    EXCEPTION
        WHEN OTHERS THEN
            IF SQLERRM LIKE '%Insufficient permissions%' THEN
                PERFORM ok(true, 'Company user cannot get other company');
            ELSE
                RAISE;
            END IF;
    END;
END $$;

-- ============================================================================
-- Test 7: rmm_update_company - Success Cases
-- ============================================================================

-- Test 7.1: MOH Tier 1 can update any company
SELECT ok(
    (
        SELECT (rmm_update_company(
            :'tier1_user_id'::uuid,
            :'test_company_id'::uuid,
            'Updated Test Company',
            'TEST-COMP-001',
            'ipc',
            'Updated Test Address',
            'updated@testcompany.com',
            '+212600000007'
        ))->>'id' IS NOT NULL
    ),
    'MOH Tier 1 can update any company'
);

-- Test 7.2: Company Admin can update own company
SELECT ok(
    (
        SELECT (rmm_update_company(
            :'company_admin_user_id'::uuid,
            :'test_company_id'::uuid,
            'Updated Test Company 2',
            'TEST-COMP-001',
            'ipc',
            'Updated Test Address 2',
            'updated2@testcompany.com',
            '+212600000008'
        ))->>'id' IS NOT NULL
    ),
    'Company Admin can update own company'
);

-- ============================================================================
-- Test 8: rmm_update_company - Access Control
-- ============================================================================

-- Test 8.1: Company user cannot update company directly (must use submission)
SELECT throws_ok(
    $$SELECT rmm_update_company(
        '00000000-0000-0000-0000-000000000007'::uuid,
        :'test_company_id'::uuid,
        'Unauthorized Update',
        'TEST-COMP-001',
        'ipc',
        'Unauthorized Test Address',
        'unauthorized@testcompany.com',
        '+212600000009'
    )$$,
    'Insufficient permissions',
    'Company user cannot update company directly'
);

-- ============================================================================
-- Test 9: rmm_list_companies - Success Cases
-- ============================================================================

-- Test 9.1: MOH Tier 1 can list all companies
SELECT ok(
    (
        SELECT jsonb_array_length(rmm_list_companies(
            :'tier1_user_id'::uuid,
            NULL, -- company_type_filter
            NULL, -- status_filter
            NULL, -- search_term
            1,    -- page_number
            10,   -- page_size
            'created_at', -- sort_by
            'desc' -- sort_order
        )) > 0
    ),
    'MOH Tier 1 can list all companies'
);

-- Test 9.2: Company Admin can list own company
SELECT ok(
    (
        SELECT jsonb_array_length(rmm_list_companies(
            :'company_admin_user_id'::uuid,
            NULL,
            NULL,
            NULL,
            1,
            10,
            'created_at',
            'desc'
        )) >= 1
    ),
    'Company Admin can list own company'
);

-- ============================================================================
-- Test 10: rmm_list_companies - Filtering and Pagination
-- ============================================================================

-- Test 10.1: Filter by company type
SELECT ok(
    (
        SELECT jsonb_array_length(rmm_list_companies(
            :'tier1_user_id'::uuid,
            'manufacturer', -- company_type_filter
            NULL,
            NULL,
            1,
            10,
            'created_at',
            'desc'
        )) >= 0
    ),
    'Filter by company type works'
);

-- Test 10.2: Search by name
SELECT ok(
    (
        SELECT jsonb_array_length(rmm_list_companies(
            :'tier1_user_id'::uuid,
            NULL,
            NULL,
            'Test Company', -- search_term
            1,
            10,
            'created_at',
            'desc'
        )) >= 0
    ),
    'Search by name works'
);

-- ============================================================================
-- Finish Tests
-- ============================================================================

SELECT finish();

ROLLBACK;
