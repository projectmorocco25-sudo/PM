# Test Suite Documentation

**Purpose:** Comprehensive test suite for RMM and Enforcement modules  
**Framework:** pgTAP (PostgreSQL Testing Framework)  
**Last Updated:** January 24, 2026

---

## Overview

This test suite provides:
- **Unit Tests:** Individual RPC function tests
- **Integration Tests:** End-to-end workflow tests
- **Security Tests:** RLS policy and two-person rule tests

---

## Test Structure

```
supabase/tests/
├── setup/
│   ├── test_users.sql          # Test user creation
│   └── test_data.sql            # Test data setup
├── unit/
│   ├── rmm_company_tests.sql    # Company CRUD RPC tests
│   ├── rmm_product_tests.sql    # Product CRUD RPC tests
│   ├── rmm_sku_tests.sql        # SKU CRUD RPC tests
│   └── enforcement_tests.sql   # Enforcement RPC tests
├── integration/
│   ├── rmm_workflow_tests.sql   # RMM workflow tests
│   └── enforcement_workflow_tests.sql # Enforcement workflow tests
├── security/
│   ├── rls_policy_tests.sql     # RLS policy tests
│   └── two_person_rule_tests.sql # Two-person rule tests
└── README.md                    # This file
```

---

## Prerequisites

### 1. Install pgTAP Extension

The pgTAP extension must be installed in your Supabase database:

```sql
CREATE EXTENSION IF NOT EXISTS pgtap;
```

This is done automatically via migration: `20260124000000_install_pgtap_extension.sql`

### 2. Setup Test Users

Before running tests, execute the test user setup script:

```sql
\i supabase/tests/setup/test_users.sql
```

Or via psql:
```bash
psql -d postgres -f supabase/tests/setup/test_users.sql
```

---

## Running Tests

### Via psql

**Run all unit tests:**
```bash
psql -d postgres -f supabase/tests/unit/rmm_company_tests.sql
```

**Run all integration tests:**
```bash
psql -d postgres -f supabase/tests/integration/rmm_workflow_tests.sql
```

**Run all security tests:**
```bash
psql -d postgres -f supabase/tests/security/rls_policy_tests.sql
```

### Via Supabase Dashboard

1. Open Supabase Dashboard
2. Navigate to SQL Editor
3. Execute test files directly

### Test Execution Order

1. **Setup:** Run `test_users.sql` and `test_data.sql` (if applicable)
2. **Unit Tests:** Run unit test files
3. **Integration Tests:** Run integration test files
4. **Security Tests:** Run security test files

---

## Test User IDs

Test users are created with deterministic IDs for reproducibility:

- **MOH Tier 1:** `00000000-0000-0000-0000-000000000001`
- **MOH Tier 2 Officer:** `00000000-0000-0000-0000-000000000002`
- **MOH Tier 2 Registrar:** `00000000-0000-0000-0000-000000000003`
- **MOH Auditor:** `00000000-0000-0000-0000-000000000004`
- **Company Admin:** `00000000-0000-0000-0000-000000000005`
- **Company Manager:** `00000000-0000-0000-0000-000000000006`
- **Company User:** `00000000-0000-0000-0000-000000000007`
- **System Admin:** `00000000-0000-0000-0000-000000000008`
- **Vendor:** `00000000-0000-0000-0000-000000000009`

**Test Company ID:** `00000000-0000-0000-0000-000000000100`

---

## Test Coverage

### Unit Tests

- ✅ Company CRUD operations
- ✅ Product CRUD operations
- ✅ SKU CRUD operations
- ✅ Helper functions
- ✅ ATC Code management
- ✅ Critical Medicine management
- ✅ Enforcement RPC functions

### Integration Tests

- ✅ RMM workflow (submission → approval → implementation)
- ✅ Enforcement workflow (create → review → approve → execute)

### Security Tests

- ✅ RLS policy enforcement (company data isolation)
- ✅ Two-person rule enforcement

---

## Writing Tests

### Test Structure

```sql
BEGIN;

-- Test plan
SELECT plan(3); -- Number of tests

-- Test 1: Function exists
SELECT has_function('public', 'rmm_create_company', ARRAY['uuid', 'text', 'text', 'text', 'text', 'text', 'text', 'text']);

-- Test 2: Function returns expected result
SELECT ok(
    (SELECT rmm_create_company(...) IS NOT NULL),
    'rmm_create_company returns a result'
);

-- Test 3: Function validates input
SELECT throws_ok(
    'SELECT rmm_create_company(...)',
    '23505', -- Expected error code
    'Company with registration number already exists'
);

-- Finish
SELECT finish();

ROLLBACK;
```

### Best Practices

1. **Use Transactions:** Wrap tests in BEGIN/ROLLBACK for isolation
2. **Clean Test Data:** Clean up test data after each test
3. **Deterministic IDs:** Use deterministic IDs for reproducibility
4. **Test Isolation:** Each test should be independent
5. **Clear Test Names:** Use descriptive test names

---

## Test Results

Test results are displayed in the console when running tests. pgTAP provides:
- ✅ Pass count
- ❌ Fail count
- ⚠️ Skip count
- Summary statistics

---

## Troubleshooting

### pgTAP Extension Not Found

If you see an error about pgTAP not being available:
1. Verify pgTAP is installed: `SELECT * FROM pg_available_extensions WHERE name = 'pgtap';`
2. Install pgTAP: `CREATE EXTENSION IF NOT EXISTS pgtap;`

### Test Users Not Found

If tests fail because test users don't exist:
1. Run test user setup: `\i supabase/tests/setup/test_users.sql`
2. Verify users exist: `SELECT * FROM users WHERE email LIKE '%@test.%';`

### Test Data Conflicts

If tests fail due to data conflicts:
1. Clean up test data before running tests
2. Use deterministic IDs to avoid conflicts
3. Use transactions (BEGIN/ROLLBACK) for test isolation

---

## Maintenance

### Adding New Tests

1. Create test file in appropriate directory (`unit/`, `integration/`, `security/`)
2. Follow test structure guidelines
3. Update this README with new test coverage
4. Verify tests pass before committing

### Updating Test Users

If test user requirements change:
1. Update `test_users.sql`
2. Update test user IDs in this README
3. Verify all tests still pass

---

## References

- **pgTAP Documentation:** https://pgtap.org/
- **Supabase Testing Guide:** https://supabase.com/docs/guides/database/testing
- **Project Testing Standards:** `docs/05-project-management/standards/compliance-rules.md`

---

**Document Owner:** Sami (Implementation Compliance Specialist)  
**Last Updated:** January 24, 2026
