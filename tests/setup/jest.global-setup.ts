/**
 * Task 1.1.7.0c: Jest Global Setup
 * 
 * Runs once before all tests.
 */

import { config } from 'dotenv'

export default async function globalSetup() {
  // Load environment variables
  config({ path: '.env.test' })
  config({ path: '.env.local' })
  config({ path: '.env' })

  console.log('\n🔧 Global Test Setup')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

  // Verify required environment variables
  const requiredEnvVars = [
    'SUPABASE_URL',
    'SUPABASE_SERVICE_ROLE_KEY',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  ]

  const missingVars = requiredEnvVars.filter(v => !process.env[v])
  if (missingVars.length > 0) {
    console.error(`❌ Missing environment variables: ${missingVars.join(', ')}`)
    console.error('   Create a .env.test file with the required variables')
    throw new Error('Missing required environment variables for tests')
  }

  console.log('✅ Environment variables loaded')

  // Test database connection
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

  try {
    const { error } = await client.from('companies').select('count').limit(1)
    if (error) throw error
    console.log('✅ Test database connection verified')
  } catch (error) {
    console.error('❌ Failed to connect to test database:', error)
    throw error
  }

  // Load test fixtures
  console.log('📦 Loading test fixtures...')
  const { loadAllFixtures } = await import('../fixtures')
  try {
    await loadAllFixtures(client)
    console.log('✅ Test fixtures loaded')
  } catch (error) {
    console.warn('⚠️  Some fixtures may have already existed:', error)
  }

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('🚀 Ready to run tests\n')
}
