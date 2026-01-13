/**
 * Task 1.1.7.0c: Test Database Setup
 * 
 * Configures test database with transaction rollback after each test.
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js'

// ============================================================================
// Types
// ============================================================================

export interface TestDatabaseConfig {
  url: string
  serviceRoleKey: string
  anonKey: string
}

export interface TestContext {
  supabase: SupabaseClient
  serviceClient: SupabaseClient
  cleanup: () => Promise<void>
  testId: string
}

// ============================================================================
// Configuration
// ============================================================================

function getTestConfig(): TestDatabaseConfig {
  const url = process.env.SUPABASE_TEST_URL || process.env.SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_TEST_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY
  const anonKey = process.env.SUPABASE_TEST_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !serviceRoleKey || !anonKey) {
    throw new Error(
      'Missing test database configuration. Set SUPABASE_TEST_URL, ' +
      'SUPABASE_TEST_SERVICE_ROLE_KEY, and SUPABASE_TEST_ANON_KEY'
    )
  }

  return { url, serviceRoleKey, anonKey }
}

// ============================================================================
// Test Database Client Factory
// ============================================================================

/**
 * Creates a Supabase client for testing with the service role
 */
export function createServiceClient(): SupabaseClient {
  const config = getTestConfig()
  return createClient(config.url, config.serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

/**
 * Creates a Supabase client for testing as a specific user
 */
export function createUserClient(accessToken?: string): SupabaseClient {
  const config = getTestConfig()
  return createClient(config.url, config.anonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
    global: accessToken ? {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    } : undefined,
  })
}

// ============================================================================
// Test Context Management
// ============================================================================

/**
 * Generates a unique test ID for data isolation
 */
function generateTestId(): string {
  return `test_${Date.now()}_${Math.random().toString(36).substring(7)}`
}

/**
 * Creates a test context with isolated data and cleanup
 */
export async function createTestContext(): Promise<TestContext> {
  const testId = generateTestId()
  const serviceClient = createServiceClient()
  const supabase = createUserClient()

  const cleanup = async () => {
    // Clean up test data using the test ID prefix
    await cleanupTestData(serviceClient, testId)
  }

  return {
    supabase,
    serviceClient,
    cleanup,
    testId,
  }
}

/**
 * Cleans up all test data created with a specific test ID
 */
async function cleanupTestData(client: SupabaseClient, testId: string): Promise<void> {
  // Tables to clean up in reverse dependency order
  const tables = [
    'breach_analyses',
    'breaches',
    'wsl_submissions',
    'msq_submissions',
    'aams_submissions',
    'thresholds',
    'registry_submissions',
    'skus',
    'products',
    'companies',
    'users',
  ]

  for (const table of tables) {
    try {
      // Delete records where any metadata contains the test ID
      await client.from(table).delete().like('id', `%${testId}%`)
    } catch (error) {
      // Ignore errors for tables that might not exist or have FK constraints
      console.warn(`Cleanup warning for ${table}:`, error)
    }
  }
}

// ============================================================================
// Transaction Isolation
// ============================================================================

/**
 * Wraps a test function in a transaction that rolls back
 */
export async function withTransaction<T>(
  client: SupabaseClient,
  fn: () => Promise<T>
): Promise<T> {
  // Start transaction
  await client.rpc('begin_test_transaction')

  try {
    const result = await fn()
    // Rollback after test
    await client.rpc('rollback_test_transaction')
    return result
  } catch (error) {
    // Rollback on error
    await client.rpc('rollback_test_transaction')
    throw error
  }
}

/**
 * SQL functions for transaction management (to be created in test database)
 */
export const transactionFunctions = `
-- Create transaction management functions for testing
CREATE OR REPLACE FUNCTION begin_test_transaction()
RETURNS void AS $$
BEGIN
  -- Start a savepoint for test isolation
  EXECUTE 'SAVEPOINT test_savepoint';
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION rollback_test_transaction()
RETURNS void AS $$
BEGIN
  -- Rollback to the savepoint
  EXECUTE 'ROLLBACK TO SAVEPOINT test_savepoint';
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION commit_test_transaction()
RETURNS void AS $$
BEGIN
  -- Release the savepoint (commit)
  EXECUTE 'RELEASE SAVEPOINT test_savepoint';
END;
$$ LANGUAGE plpgsql;
`

// ============================================================================
// Jest Setup Hooks
// ============================================================================

/**
 * Global setup for Jest test suite
 */
export async function globalSetup(): Promise<void> {
  console.log('🔧 Setting up test database...')
  
  const client = createServiceClient()
  
  // Verify connection
  const { error } = await client.from('companies').select('count').limit(1)
  if (error) {
    throw new Error(`Failed to connect to test database: ${error.message}`)
  }
  
  console.log('✅ Test database connected')
}

/**
 * Global teardown for Jest test suite
 */
export async function globalTeardown(): Promise<void> {
  console.log('🧹 Cleaning up test database...')
  
  const client = createServiceClient()
  
  // Clean up any orphaned test data
  await cleanupTestData(client, 'test_')
  
  console.log('✅ Test database cleaned up')
}
