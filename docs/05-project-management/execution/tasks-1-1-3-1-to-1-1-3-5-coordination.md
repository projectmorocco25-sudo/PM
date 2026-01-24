# Tasks 1.1.3.1 to 1.1.3.5 Coordination

**Date:** January 23, 2026  
**Coordinated By:** Sami (Implementation Compliance Specialist)  
**Status:** 🔄 IN PROGRESS

---

## Overview

This document coordinates the implementation of testing tasks for Subphase 1.1.3:
- **Task 1.1.3.1:** Create RMM module test suite (unit tests for RPC functions)
- **Task 1.1.3.2:** Create integration tests - RMM workflow (submission → approval → implementation)
- **Task 1.1.3.3:** Create integration tests - Enforcement workflow
- **Task 1.1.3.4:** Test RLS policy enforcement (company data isolation)
- **Task 1.1.3.5:** Test two-person rule enforcement

---

## Testing Framework Selection

**Selected Framework:** pgTAP (PostgreSQL Testing Framework)

**Rationale:**
- Native PostgreSQL testing framework
- Works directly with Supabase/PostgreSQL
- Supports unit tests for RPC functions
- Supports integration tests for workflows
- Supports RLS policy testing
- Can be run via Supabase CLI or directly in database

**Alternative Considered:** Jest + Supabase Test Client
- **Rejected:** More complex setup, requires Node.js test environment
- **Note:** May be used for frontend tests in future phases

---

## Test Structure

```
supabase/
├── tests/
│   ├── setup/
│   │   ├── test_users.sql          # Test user creation
│   │   └── test_data.sql            # Test data setup
│   ├── unit/
│   │   ├── rmm_company_tests.sql    # Company CRUD RPC tests
│   │   ├── rmm_product_tests.sql    # Product CRUD RPC tests
│   │   ├── rmm_sku_tests.sql        # SKU CRUD RPC tests
│   │   └── enforcement_tests.sql    # Enforcement RPC tests
│   ├── integration/
│   │   ├── rmm_workflow_tests.sql   # RMM workflow tests
│   │   └── enforcement_workflow_tests.sql # Enforcement workflow tests
│   ├── security/
│   │   ├── rls_policy_tests.sql     # RLS policy tests
│   │   └── two_person_rule_tests.sql # Two-person rule tests
│   └── README.md                    # Test documentation
```

---

## Task Breakdown

### Task 1.1.3.1: RMM Module Test Suite

**Scope:**
- Unit tests for all RMM RPC functions:
  - Company CRUD: `rmm_create_company`, `rmm_update_company`, `rmm_get_company`, `rmm_list_companies`
  - Product CRUD: `rmm_create_product`, `rmm_update_product`, `rmm_get_product`, `rmm_list_products`
  - SKU CRUD: `rmm_create_sku`, `rmm_update_sku`, `rmm_get_sku`, `rmm_list_skus`
  - Helper functions: `rmm_list_company_products`, `rmm_get_company_history`, etc.
  - ATC Code management: `rmm_create_atc_code`, `rmm_update_atc_code`, etc.
  - Critical Medicine management: `rmm_designate_critical_medicine`, etc.

**Test Coverage:**
- Function parameter validation
- Role-based access control
- Data integrity checks
- Error handling
- Return value validation

**Owner:** Oliver (Backend Lead) with Sami (Compliance)

---

### Task 1.1.3.2: RMM Workflow Integration Tests

**Scope:**
- End-to-end workflow tests:
  1. Company user submits registry update
  2. Tier 2 verifies submission
  3. Tier 1 approves submission
  4. Tier 2 implements update
  5. Submission completed

**Test Scenarios:**
- Successful workflow completion
- Rejection workflow
- Peer review workflow
- Cascade deactivation
- Two-person rule enforcement

**Owner:** Oliver (Backend Lead) with Sami (Compliance)

---

### Task 1.1.3.3: Enforcement Workflow Integration Tests

**Scope:**
- End-to-end enforcement workflow tests:
  1. Create enforcement action
  2. Submit for review
  3. Tier 2 review
  4. Tier 1 approval
  5. Execute action
  6. Appeal submission (if applicable)
  7. Appeal resolution

**Test Scenarios:**
- Successful enforcement workflow
- Appeal workflow
- Rejection workflow

**Owner:** Oliver (Backend Lead) with Sami (Compliance)

---

### Task 1.1.3.4: RLS Policy Enforcement Tests

**Scope:**
- Test company data isolation:
  - Company users can only access their own company data
  - MOH users can access all company data
  - Cross-company access is blocked
- Test role-based access:
  - Each role has correct access permissions
  - Unauthorized access is blocked

**Test Tables:**
- `companies`
- `products`
- `skus`
- `registry_submissions`
- `enforcement_actions`

**Owner:** Rafi (Security Lead) with Sami (Compliance)

---

### Task 1.1.3.5: Two-Person Rule Enforcement Tests

**Scope:**
- Test two-person rule validation:
  - Two different users required for critical actions
  - Same user cannot approve twice
  - Approval history tracking
  - Rule enforcement in workflows

**Test Scenarios:**
- Company deactivation requires two approvals
- Critical submission approvals require two approvals
- Enforcement action approvals require two approvals
- Same user attempting to approve twice is blocked

**Owner:** Rafi (Security Lead) with Sami (Compliance)

---

## Prerequisites

### Required Setup

1. **pgTAP Extension:**
   - Install pgTAP extension in Supabase database
   - Verify installation: `SELECT * FROM pg_available_extensions WHERE name = 'pgtap';`

2. **Test Users:**
   - Create test users for each role
   - Test users must have valid company associations
   - Test users must be active

3. **Test Data:**
   - Minimal test data for isolation
   - Deterministic test data for reproducibility
   - Cleanup procedures after tests

### Verification Steps

- [ ] pgTAP extension installed
- [ ] Test users created
- [ ] Test data setup scripts ready
- [ ] Test execution scripts ready

---

## Implementation Plan

### Phase 1: Setup (Sami)
1. Install pgTAP extension
2. Create test user setup scripts
3. Create test data setup scripts
4. Create test execution framework

### Phase 2: Unit Tests (Oliver)
1. Implement Company CRUD tests
2. Implement Product CRUD tests
3. Implement SKU CRUD tests
4. Implement Helper function tests
5. Implement ATC Code tests
6. Implement Critical Medicine tests

### Phase 3: Integration Tests (Oliver)
1. Implement RMM workflow tests
2. Implement Enforcement workflow tests

### Phase 4: Security Tests (Rafi)
1. Implement RLS policy tests
2. Implement two-person rule tests

### Phase 5: Documentation (Sami)
1. Document test structure
2. Document test execution procedures
3. Document test results

---

## Team Assignments

### Sami (Implementation Compliance Specialist)
- [x] Create coordination document
- [ ] Set up pgTAP extension
- [ ] Create test user setup scripts
- [ ] Create test data setup scripts
- [ ] Create test execution framework
- [ ] Verify compliance with testing standards
- [ ] Document test procedures

### Oliver (Backend Lead)
- [ ] Review test framework setup
- [ ] Implement unit tests for RMM RPC functions
- [ ] Implement integration tests for RMM workflow
- [ ] Implement integration tests for Enforcement workflow
- [ ] Review test coverage
- [ ] Verify test execution

### Rafi (Security Lead)
- [ ] Review RLS policy test requirements
- [ ] Implement RLS policy enforcement tests
- [ ] Implement two-person rule enforcement tests
- [ ] Verify security test coverage
- [ ] Review test results

### Nadia (Database Specialist)
- [ ] Review test data requirements
- [ ] Verify test data setup scripts
- [ ] Review test database state
- [ ] Verify test cleanup procedures

---

## Test Execution

### Running Tests

**Via Supabase CLI:**
```bash
supabase db test
```

**Via psql:**
```bash
psql -d postgres -f supabase/tests/unit/rmm_company_tests.sql
```

**Via Supabase Dashboard:**
- Execute test files in SQL Editor

### Test Results

Test results will be documented in:
- Test execution logs
- Test coverage reports
- Test failure reports

---

## Compliance Verification

### Pre-Implementation Checklist

- [x] Sequential task verification (Subphase 1.1.2 complete)
- [x] Compliance validation checklist verified
- [x] Test framework selected and approved
- [ ] Test structure defined
- [ ] Team assignments confirmed
- [ ] Prerequisites verified

### Hard Gates

- [x] **No Hardcoded Test Data:** Test data will be created via SQL scripts, not hardcoded in test files
- [x] **Database Binding:** All tests use real database tables and RPC functions
- [x] **Role Coverage:** Tests cover all 9 roles where applicable
- [ ] **Test Coverage:** All RPC functions have unit tests
- [ ] **Integration Coverage:** All workflows have integration tests

---

## Next Steps

1. **Sami:** Set up pgTAP extension and test infrastructure
2. **Oliver:** Begin implementing unit tests
3. **Rafi:** Begin implementing security tests
4. **Team:** Review and approve test structure

---

## Notes

- Tests will use deterministic test data for reproducibility
- Test cleanup procedures will ensure test isolation
- Test results will be documented for compliance verification
- Test coverage will be tracked and reported

---

**Document Owner:** Sami (Implementation Compliance Specialist)  
**Last Updated:** January 23, 2026
