# Testing Framework - Pharmaceutical Governance Value Chain Platform (PM)

**Purpose:** This document defines the testing framework, test strategies, and testing guidelines for the PM platform.

**Last Updated:** 2025-12-31  
**Status:** ✅ Complete (Phase 0, Week 4)  
**Owner:** Leila

## Overview

The PM platform uses a comprehensive testing framework with unit tests, integration tests, and end-to-end (E2E) tests to ensure quality and prevent regressions.

## Testing Strategy

### Test Pyramid

```
        /\
       /  \
      / E2E \        (10% - Critical user flows)
     /--------\
    /          \
   / Integration \  (30% - RPC functions, RLS policies, cross-module)
  /--------------\
 /                \
/   Unit Tests      \  (60% - Functions, components, utilities)
/--------------------\
```

### Test Coverage Targets

- **Critical Paths:** 80% coverage
- **Overall:** 60% coverage
- **New Code:** 80% coverage required

---

## Testing Tools

### Frontend Testing

**Unit Tests:**
- **Framework:** Jest or Vitest
- **Testing Library:** @testing-library/react
- **Assertions:** @testing-library/jest-dom

**E2E Tests:**
- **Framework:** Playwright or Cypress
- **Browser:** Chromium, Firefox, WebKit

### Backend Testing

**Database Functions:**
- **Framework:** pgTAP
- **Language:** SQL/PLpgSQL

**RPC Functions:**
- **Framework:** Jest with Supabase client
- **Testing:** Integration tests with test database

**Edge Functions:**
- **Framework:** Deno test
- **Testing:** Unit tests with mocks

---

## Unit Tests

### Frontend Unit Tests

**Location:** `__tests__/` or `*.test.tsx`

**Example:**
```typescript
import { render, screen } from '@testing-library/react';
import { CompanyList } from './CompanyList';

describe('CompanyList', () => {
  it('renders company list', () => {
    render(<CompanyList companies={mockCompanies} />);
    expect(screen.getByText('Company 1')).toBeInTheDocument();
  });

  it('handles empty list', () => {
    render(<CompanyList companies={[]} />);
    expect(screen.getByText('No companies found')).toBeInTheDocument();
  });
});
```

### Backend Unit Tests

**Location:** `supabase/tests/`

**Example (pgTAP):**
```sql
BEGIN;

SELECT plan(3);

-- Test function
SELECT ok(
  rmm_create_company('Test Company', 'REG123', 'ipc') IS NOT NULL,
  'create_company returns company ID'
);

SELECT ok(
  (SELECT name FROM companies WHERE registration_number = 'REG123') = 'Test Company',
  'company created with correct name'
);

SELECT ok(
  (SELECT company_type FROM companies WHERE registration_number = 'REG123') = 'ipc',
  'company created with correct type'
);

SELECT * FROM finish();
ROLLBACK;
```

---

## Integration Tests

### RPC Function Tests

**Location:** `tests/integration/rpc/`

**Example:**
```typescript
import { createClient } from '@supabase/supabase-js';

describe('RPC Functions', () => {
  let supabase;

  beforeAll(() => {
    supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );
  });

  it('creates company via RPC', async () => {
    const { data, error } = await supabase.rpc('rmm_create_company', {
      name: 'Test Company',
      registration_number: 'REG123',
      company_type: 'ipc'
    });

    expect(error).toBeNull();
    expect(data).toHaveProperty('id');
    expect(data.name).toBe('Test Company');
  });
});
```

### RLS Policy Tests

**Location:** `tests/integration/rls/`

**Example:**
```typescript
describe('RLS Policies', () => {
  it('company users can only see own company', async () => {
    // Create test companies
    const company1 = await createTestCompany('Company 1');
    const company2 = await createTestCompany('Company 2');

    // Create test user for company1
    const user = await createTestUser({ company_id: company1.id });

    // Query as company1 user
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('company_id', company1.id);

    expect(error).toBeNull();
    expect(data).toHaveLength(1);
    expect(data[0].company_id).toBe(company1.id);
  });
});
```

### Cross-Module Tests

**Location:** `tests/integration/cross-module/`

**Example:**
```typescript
describe('Cross-Module Integration', () => {
  it('ECS authorization triggers CMC recalculation', async () => {
    // Create export request
    const request = await createExportRequest();

    // Authorize export
    const { data } = await supabase.rpc('ecs_authorize_export', {
      request_id: request.id
    });

    // Verify CMC score recalculated
    const score = await getLatestComplianceScore(request.company_id);
    expect(score.trigger_event).toBe('export_authorized');
  });
});
```

---

## End-to-End Tests

### Playwright Configuration

**File:** `playwright.config.ts`

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

### E2E Test Example

**Location:** `tests/e2e/company-submission.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

test.describe('Company Submission', () => {
  test('company user can submit registry update', async ({ page }) => {
    // Login as company user
    await page.goto('/login');
    await page.fill('[name="email"]', 'company@example.com');
    await page.fill('[name="password"]', 'password');
    await page.click('button[type="submit"]');

    // Navigate to registry
    await page.goto('/registry/companies');
    await page.click('button:has-text("Create Company")');

    // Fill form
    await page.fill('[name="name"]', 'New Company');
    await page.fill('[name="registration_number"]', 'REG123');
    await page.selectOption('[name="company_type"]', 'ipc');

    // Submit
    await page.click('button:has-text("Submit")');

    // Verify submission
    await expect(page.locator('text=Submission submitted')).toBeVisible();
  });
});
```

---

## Test Data Management

### Test Fixtures

**Location:** `tests/fixtures/`

**Example:**
```typescript
export const testCompanies = [
  {
    name: 'Test Company 1',
    registration_number: 'TEST001',
    company_type: 'ipc'
  },
  {
    name: 'Test Company 2',
    registration_number: 'TEST002',
    company_type: 'wholesaler'
  }
];

export const testUsers = [
  {
    email: 'tier1@example.com',
    role: 'tier1',
    company_id: null
  },
  {
    email: 'company@example.com',
    role: 'company_admin',
    company_id: 'test-company-1-id'
  }
];
```

### Test Database Setup

**Location:** `tests/setup/`

```typescript
export async function setupTestDatabase() {
  // Apply test migrations
  await supabase.rpc('apply_test_migrations');

  // Seed test data
  await seedTestData();

  // Return cleanup function
  return async () => {
    await supabase.rpc('cleanup_test_data');
  };
}
```

---

## Running Tests

### Run All Tests

```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Run in watch mode
npm test -- --watch
```

### Run Specific Tests

```bash
# Run unit tests only
npm run test:unit

# Run integration tests only
npm run test:integration

# Run E2E tests only
npm run test:e2e

# Run specific test file
npm test -- CompanyList.test.tsx
```

### Run Tests in CI

```bash
# CI mode (no watch, coverage required)
npm test -- --ci --coverage
```

---

## Test Coverage

### Coverage Configuration

**File:** `jest.config.js`

```javascript
module.exports = {
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.tsx',
  ],
  coverageThresholds: {
    global: {
      branches: 60,
      functions: 60,
      lines: 60,
      statements: 60,
    },
    './src/components/': {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
```

### Coverage Reports

**View Coverage:**
```bash
# Generate coverage report
npm test -- --coverage

# Open coverage report
open coverage/lcov-report/index.html
```

---

## Continuous Testing

### Pre-commit Hooks

**File:** `.husky/pre-commit`

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

# Run linting
npm run lint

# Run tests
npm test -- --bail
```

### CI Integration

Tests run automatically in CI/CD pipeline:
- On every push
- On every pull request
- Before deployment

---

## Related Documents

- [Development Environment Setup](../../06-development/development-setup.md)
- [CI/CD Pipeline Configuration](ci-cd-pipeline.md)
- [Technical Decision Log](../../06-development/technical-decisions/decision-log.md)

---

**Next Review Date:** [To be scheduled]  
**Owner:** Leila

