/**
 * Task 1.1.7.0c: Authentication Mocking
 * 
 * Utilities for mocking authentication in tests.
 */

import { createClient, SupabaseClient, User } from '@supabase/supabase-js'
import { createServiceClient } from './test-database'

// ============================================================================
// Types
// ============================================================================

export interface TestUser {
  id: string
  email: string
  role: string
  company_id: string | null
  full_name: string
}

export interface AuthenticatedClient {
  client: SupabaseClient
  user: TestUser
  accessToken: string
}

// ============================================================================
// Predefined Test Users
// ============================================================================

export const TEST_USERS = {
  // MOH Users
  tier1: {
    id: '11111111-1111-1111-1111-111111111111',
    email: 'test-tier1@moh.gov.ma',
    role: 'tier1',
    company_id: null,
    full_name: 'Test Tier 1 User',
  },
  tier2_officer: {
    id: '22222222-2222-2222-2222-222222222222',
    email: 'test-tier2-officer@moh.gov.ma',
    role: 'tier2_officer',
    company_id: null,
    full_name: 'Test Tier 2 Officer',
  },
  tier2_registrar: {
    id: '33333333-3333-3333-3333-333333333333',
    email: 'test-tier2-registrar@moh.gov.ma',
    role: 'tier2_registrar',
    company_id: null,
    full_name: 'Test Tier 2 Registrar',
  },
  
  // Company Users
  company_admin: {
    id: '44444444-4444-4444-4444-444444444444',
    email: 'test-admin@testcompany.ma',
    role: 'company_admin',
    company_id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    full_name: 'Test Company Admin',
  },
  company_manager: {
    id: '55555555-5555-5555-5555-555555555555',
    email: 'test-manager@testcompany.ma',
    role: 'company_manager',
    company_id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    full_name: 'Test Company Manager',
  },
  company_user: {
    id: '66666666-6666-6666-6666-666666666666',
    email: 'test-user@testcompany.ma',
    role: 'company_user',
    company_id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    full_name: 'Test Company User',
  },
  
  // Other Company User (for cross-company testing)
  other_company_user: {
    id: '77777777-7777-7777-7777-777777777777',
    email: 'test-user@othercompany.ma',
    role: 'company_user',
    company_id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    full_name: 'Other Company User',
  },
} as const

// ============================================================================
// Authentication Functions
// ============================================================================

/**
 * Creates a test user in the database and auth system
 */
export async function createTestUser(user: TestUser): Promise<void> {
  const client = createServiceClient()
  
  // Create auth user
  const { error: authError } = await client.auth.admin.createUser({
    id: user.id,
    email: user.email,
    password: 'TestPassword123!',
    email_confirm: true,
    user_metadata: {
      full_name: user.full_name,
    },
  })
  
  if (authError && !authError.message.includes('already exists')) {
    throw new Error(`Failed to create auth user: ${authError.message}`)
  }
  
  // Create user profile
  const { error: profileError } = await client.from('users').upsert({
    id: user.id,
    email: user.email,
    full_name: user.full_name,
    role: user.role,
    company_id: user.company_id,
    is_active: true,
  })
  
  if (profileError) {
    throw new Error(`Failed to create user profile: ${profileError.message}`)
  }
}

/**
 * Signs in as a test user and returns an authenticated client
 */
export async function signInAsUser(user: TestUser): Promise<AuthenticatedClient> {
  const url = process.env.SUPABASE_TEST_URL || process.env.SUPABASE_URL!
  const anonKey = process.env.SUPABASE_TEST_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  
  const client = createClient(url, anonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
  
  const { data, error } = await client.auth.signInWithPassword({
    email: user.email,
    password: 'TestPassword123!',
  })
  
  if (error) {
    throw new Error(`Failed to sign in as ${user.email}: ${error.message}`)
  }
  
  return {
    client,
    user,
    accessToken: data.session!.access_token,
  }
}

/**
 * Creates a client authenticated as a specific role
 */
export async function getAuthenticatedClient(
  role: keyof typeof TEST_USERS
): Promise<AuthenticatedClient> {
  const user = TEST_USERS[role]
  
  // Ensure user exists
  await createTestUser(user)
  
  // Sign in
  return signInAsUser(user)
}

// ============================================================================
// Mock Authentication Helpers
// ============================================================================

/**
 * Mocks the current user for RLS policy testing
 */
export function mockCurrentUser(client: SupabaseClient, user: TestUser): void {
  // Set JWT claims for the user
  // This is done via the client headers in actual implementation
}

/**
 * Creates a JWT token for testing (without actual auth)
 */
export function createMockJWT(user: TestUser): string {
  // In a real implementation, this would create a properly signed JWT
  // For testing, we use the actual auth flow
  return `mock_token_${user.id}`
}

// ============================================================================
// Setup Functions
// ============================================================================

/**
 * Sets up all predefined test users
 */
export async function setupTestUsers(): Promise<void> {
  for (const user of Object.values(TEST_USERS)) {
    await createTestUser(user)
  }
}

/**
 * Sets up test companies for company users
 */
export async function setupTestCompanies(): Promise<void> {
  const client = createServiceClient()
  
  const testCompanies = [
    {
      id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
      name: 'Test Company A',
      type: 'ipc',
      registration_number: 'TEST-REG-001',
      tax_id: 'TEST-TAX-001',
      city: 'Casablanca',
      status: 'active',
    },
    {
      id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
      name: 'Test Company B',
      type: 'wholesaler',
      registration_number: 'TEST-REG-002',
      tax_id: 'TEST-TAX-002',
      city: 'Rabat',
      status: 'active',
    },
  ]
  
  for (const company of testCompanies) {
    const { error } = await client.from('companies').upsert(company)
    if (error) {
      console.warn(`Failed to create test company: ${error.message}`)
    }
  }
}
