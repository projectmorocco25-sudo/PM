/**
 * Task 1.1.7.0c: Jest Global Teardown
 * 
 * Runs once after all tests complete.
 */

import { config } from 'dotenv'

export default async function globalTeardown() {
  // Load environment variables
  config({ path: '.env.test' })
  config({ path: '.env.local' })
  config({ path: '.env' })

  console.log('\n🧹 Global Test Teardown')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

  // Connect to database
  const { createClient } = await import('@supabase/supabase-js')
  const client = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )

  // Clear test fixtures
  console.log('🗑️  Clearing test fixtures...')
  const { clearAllFixtures } = await import('../fixtures')
  try {
    await clearAllFixtures(client)
    console.log('✅ Test fixtures cleared')
  } catch (error) {
    console.warn('⚠️  Some fixtures may not have existed:', error)
  }

  // Clean up any test data prefixed with 'test_'
  console.log('🗑️  Cleaning up test data...')
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
  ]

  for (const table of tables) {
    try {
      await client.from(table).delete().like('id', 'test_%')
    } catch {
      // Ignore errors for tables that might not exist
    }
  }
  console.log('✅ Test data cleaned up')

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('✨ Teardown complete\n')
}
