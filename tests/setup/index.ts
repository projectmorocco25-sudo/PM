/**
 * Task 1.1.7.0c: Test Setup Index
 * 
 * Exports all test setup utilities.
 */

// Test Database
export {
  createServiceClient,
  createUserClient,
  createTestContext,
  withTransaction,
  globalSetup,
  globalTeardown,
  type TestDatabaseConfig,
  type TestContext,
} from './test-database'

// Authentication Mocking
export {
  TEST_USERS,
  createTestUser,
  signInAsUser,
  getAuthenticatedClient,
  setupTestUsers,
  setupTestCompanies,
  type TestUser,
  type AuthenticatedClient,
} from './auth-mocking'

// Test Helpers
export {
  generateTestId,
  generateTestUUID,
  createTestCompany,
  createTestProduct,
  createTestSKU,
  createTestDataSet,
  createTestAAMS,
  createTestMSQ,
  assertRecordExists,
  assertRecordNotExists,
  assertRPCSuccess,
  assertRPCFailure,
  cleanupTable,
  CleanupTracker,
  type TestCompany,
  type TestProduct,
  type TestSKU,
  type TestSubmission,
} from './test-helpers'
