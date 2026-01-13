# PM Platform Test Suite

**Task Reference:** Tasks 1.1.7.0c, 1.1.7.0d  
**Last Updated:** 2026-01-13

## Overview

This directory contains the comprehensive testing infrastructure for the PM (Pharmaceutical Governance Value Chain Platform).

## Directory Structure

```
tests/
├── README.md               # This file
├── jest.config.js          # Jest configuration
├── setup/                  # Test setup utilities
│   ├── index.ts            # Setup exports
│   ├── test-database.ts    # Database connection & transaction isolation
│   ├── auth-mocking.ts     # Authentication mocking utilities
│   ├── test-helpers.ts     # Test data creation helpers
│   ├── jest.setup.ts       # Jest setup (runs before each test file)
│   ├── jest.global-setup.ts    # Global setup (runs once before all tests)
│   └── jest.global-teardown.ts # Global teardown (runs once after all tests)
├── fixtures/               # Pre-defined test data sets
│   ├── index.ts            # Fixture exports & loader
│   ├── companies.ts        # Company fixtures
│   ├── products.ts         # Product & SKU fixtures
│   └── submissions.ts      # VCI submission fixtures
├── unit/                   # Unit tests
│   └── (test files)
├── integration/            # Integration tests
│   ├── rpc/                # RPC function tests
│   ├── rls/                # RLS policy tests
│   └── cross-module/       # Cross-module integration tests
└── e2e/                    # End-to-end tests
    └── (Playwright tests)
```

## Environment Setup

### Required Environment Variables

Create a `.env.test` file with:

```bash
# Test Database Configuration
SUPABASE_URL=your-test-supabase-url
SUPABASE_SERVICE_ROLE_KEY=your-test-service-role-key
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-test-anon-key

# Optional: Use separate test database
SUPABASE_TEST_URL=your-test-database-url
SUPABASE_TEST_SERVICE_ROLE_KEY=your-test-service-key
SUPABASE_TEST_ANON_KEY=your-test-anon-key
```

### Install Dependencies

```bash
npm install --save-dev jest ts-jest @types/jest dotenv
```

## Running Tests

### All Tests
```bash
npm test
```

### Unit Tests Only
```bash
npm run test:unit
```

### Integration Tests Only
```bash
npm run test:integration
```

### E2E Tests
```bash
npm run test:e2e
```

### With Coverage
```bash
npm test -- --coverage
```

### Watch Mode
```bash
npm test -- --watch
```

## Test Fixtures

Pre-defined test data for consistent testing scenarios:

### Companies
- `ACTIVE_IPC` - Standard active IPC
- `ACTIVE_WHOLESALER` - Standard active wholesaler
- `PENDING_COMPANY` - Pending approval (blocked operations)
- `SUSPENDED_COMPANY` - Suspended (blocked all operations)
- `CRITICAL_MEDICINE_COMPANY` - Produces critical medicines

### Products & SKUs
- `STANDARD_PRODUCT` - Active product with multiple SKUs
- `CRITICAL_PRODUCT` - Critical medicine product
- `TABLET_SKU`, `CAPSULE_SKU`, `SYRUP_SKU` - Various dosage forms
- `INJECTION_SKU` - Critical medicine SKU

### Submissions
- `STANDARD_AAMS` - Normal AAMS submission
- `LATE_AAMS` - Late submission
- `BREACH_WSL` - WSL with stock breach
- `HISTORICAL_MSQ_SET` - 6 months history for XAMS

### Loading Fixtures

```typescript
import { loadAllFixtures, clearAllFixtures } from '@tests/fixtures'
import { createServiceClient } from '@tests/setup'

const client = createServiceClient()

// Load all fixtures
await loadAllFixtures(client)

// Clear all fixtures
await clearAllFixtures(client)
```

## Test Helpers

### Creating Test Data

```typescript
import {
  createTestCompany,
  createTestProduct,
  createTestSKU,
  createTestDataSet,
} from '@tests/setup'

// Create individual entities
const company = await createTestCompany(client, { type: 'ipc' })
const product = await createTestProduct(client, { company_id: company.id })
const sku = await createTestSKU(client, { product_id: product.id })

// Create complete data set
const { company, products, skus } = await createTestDataSet(client, {
  productCount: 3,
  skusPerProduct: 5,
})
```

### Authentication Testing

```typescript
import { getAuthenticatedClient, TEST_USERS } from '@tests/setup'

// Sign in as MOH Tier 1
const { client, user } = await getAuthenticatedClient('tier1')

// Sign in as company admin
const { client, user } = await getAuthenticatedClient('company_admin')
```

### Assertions

```typescript
import { assertRecordExists, assertRPCSuccess, assertRPCFailure } from '@tests/setup'

// Assert record exists
await assertRecordExists(client, 'companies', companyId)

// Assert RPC success
const result = await assertRPCSuccess(client, 'rmm_create_company', params)

// Assert RPC failure
await assertRPCFailure(client, 'vci_submit_aams', params, 'COMPANY_INACTIVE')
```

## Custom Jest Matchers

```typescript
// Check if value is a valid UUID
expect(id).toBeValidUUID()

// Check if date is within range
expect(date).toBeWithinDateRange(startDate, endDate)

// Check if response has valid RPC structure
expect(response).toBeValidRPCResponse()
```

## Test Database Isolation

Each test should run in isolation:

```typescript
import { createTestContext } from '@tests/setup'

describe('MyFeature', () => {
  let ctx: TestContext

  beforeEach(async () => {
    ctx = await createTestContext()
  })

  afterEach(async () => {
    await ctx.cleanup()
  })

  it('should do something', async () => {
    // Test using ctx.supabase
  })
})
```

## Writing Tests

### Unit Test Example

```typescript
import { createServiceClient, assertRPCSuccess } from '@tests/setup'

describe('RMM Company Creation', () => {
  const client = createServiceClient()

  it('creates a company with valid data', async () => {
    const result = await assertRPCSuccess(client, 'rmm_create_company', {
      p_name: 'Test Company',
      p_type: 'ipc',
      p_registration_number: 'TEST-001',
    })

    expect(result.id).toBeValidUUID()
    expect(result.status).toBe('draft')
  })
})
```

### Integration Test Example

```typescript
import { createTestContext, createTestDataSet } from '@tests/setup'

describe('VCI AAMS Workflow', () => {
  let ctx: TestContext

  beforeEach(async () => {
    ctx = await createTestContext()
  })

  afterEach(async () => {
    await ctx.cleanup()
  })

  it('completes full AAMS submission workflow', async () => {
    // Setup
    const { company, skus } = await createTestDataSet(ctx.serviceClient)

    // Submit
    const submission = await ctx.serviceClient.rpc('vci_submit_aams', {
      p_company_id: company.id,
      p_year: 2026,
      p_submission_data: skus.map(s => ({ sku_id: s.id, quantity: 10000 })),
    })

    // Verify
    expect(submission.data.status).toBe('submitted')

    // Approve
    const approved = await ctx.serviceClient.rpc('vci_approve_aams', {
      p_submission_id: submission.data.id,
    })

    expect(approved.data.status).toBe('approved')
  })
})
```

## Coverage Targets

| Area | Target |
|------|--------|
| Overall | 60% |
| New Code | 80% |
| Critical Paths | 80% |

## Related Documents

- [Testing Framework](../docs/08-deployment/testing-framework.md)
- [Integration Contracts](../docs/02-architecture/integration/module-integration-contracts.md)
- [RPC Functions](../docs/02-architecture/api/rpc-functions.md)
