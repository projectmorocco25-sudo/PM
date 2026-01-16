/**
 * Create Auth Users Script
 * 
 * Creates auth.users entries for all users in public.users table
 * so they can actually log in to the application.
 * 
 * Usage: tsx create-auth-users.ts
 */

import { config } from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'
import { createClient } from '@supabase/supabase-js'

// Load environment variables from multiple possible locations
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const projectRoot = resolve(__dirname, '../..')

// Try loading from various locations
const envPaths = [
  resolve(projectRoot, 'supabase/seed/.env.local'),
  resolve(projectRoot, 'supabase/.env.local'),
  resolve(projectRoot, '.env.local'),
  resolve(projectRoot, 'supabase/seed/.env'),
  resolve(projectRoot, 'supabase/.env'),
  resolve(projectRoot, '.env'),
]

for (const envPath of envPaths) {
  config({ path: envPath })
}

// Also try from process.env (may be set externally)
const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables')
  console.error('\nPlease ensure one of these files exists with your credentials:')
  for (const envPath of envPaths) {
    console.error(`   - ${envPath}`)
  }
  console.error('\nOr set environment variables:')
  console.error('   SUPABASE_URL=https://your-project.supabase.co')
  console.error('   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key')
  throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables')
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

// Standardized password for all test users
const TEST_PASSWORD = 'TempPassword123!@#'

async function createAuthUsers() {
  console.log('🔐 Creating Auth Users for all public.users...\n')

  // Get all users from public.users
  const { data: users, error: fetchError } = await supabase
    .from('users')
    .select('id, email, full_name, role, company_id')
    .order('role', { ascending: true })
    .order('email', { ascending: true })

  if (fetchError) {
    throw new Error(`Failed to fetch users: ${fetchError.message}`)
  }

  if (!users || users.length === 0) {
    console.log('⚠️  No users found in public.users table')
    return
  }

  console.log(`Found ${users.length} users in public.users\n`)

  let created = 0
  let skipped = 0
  let failed = 0

  // Create auth user for each public user
  for (const user of users) {
    try {
      // Try to create auth user with matching ID
      const { data: authUser, error: createError } = await supabase.auth.admin.createUser({
        id: user.id,
        email: user.email,
        password: TEST_PASSWORD,
        email_confirm: true,
        user_metadata: {
          full_name: user.full_name,
          role: user.role,
        },
      })

      if (createError) {
        if (createError.message.includes('already') || createError.message.includes('duplicate')) {
          console.log(`⏭️  Skipped: ${user.email} (already exists)`)
          skipped++
        } else {
          console.log(`❌ Failed: ${user.email} - ${createError.message}`)
          failed++
        }
      } else {
        console.log(`✅ Created: ${user.email} (${user.role})`)
        created++
      }
    } catch (error) {
      console.log(`❌ Error creating ${user.email}: ${error instanceof Error ? error.message : 'Unknown error'}`)
      failed++
    }
  }

  console.log('\n' + '='.repeat(60))
  console.log('📊 Summary:')
  console.log(`   Created: ${created}`)
  console.log(`   Skipped: ${skipped}`)
  console.log(`   Failed: ${failed}`)
  console.log(`   Total: ${users.length}`)
  console.log('='.repeat(60))
  console.log(`\n🔑 Password for all users: ${TEST_PASSWORD}`)
}

// Run if executed directly
createAuthUsers()
  .then(() => {
    console.log('\n✅ Auth users creation complete!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Error:', error)
    process.exit(1)
  })
