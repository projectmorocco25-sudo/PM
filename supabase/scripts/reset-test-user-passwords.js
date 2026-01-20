/**
 * Reset Test User Passwords via Supabase Admin API
 * 
 * This script resets all test user passwords to: TestPassword123!
 * 
 * Usage:
 *   1. Get your service role key from Supabase Dashboard → Settings → API → service_role key
 *   2. Set it as an environment variable: export SUPABASE_SERVICE_ROLE_KEY="your-key"
 *   3. Run: node supabase/scripts/reset-test-user-passwords.js
 * 
 * Or set it inline:
 *   SUPABASE_SERVICE_ROLE_KEY="your-key" node supabase/scripts/reset-test-user-passwords.js
 */

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://lbtgmetmfkikrelbedou.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Error: SUPABASE_SERVICE_ROLE_KEY environment variable is required');
  console.log('\n📋 How to get your service role key:');
  console.log('   1. Go to Supabase Dashboard → Settings → API');
  console.log('   2. Copy the "service_role" key (NOT the anon key)');
  console.log('   3. Set it as: export SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"');
  console.log('   4. Run this script again\n');
  process.exit(1);
}

const TEST_PASSWORD = 'TestPassword123!';

const TEST_USERS = [
  {
    id: '00000000-0000-0000-0101-000000000001',
    email: 'moh.tier1@moh.gov.ma',
    name: 'MOH Tier 1'
  },
  {
    id: '00000000-0000-0000-0101-000000000002',
    email: 'moh.tier2@moh.gov.ma',
    name: 'MOH Tier 2'
  },
  {
    id: '00000000-0000-0000-0201-000000000002',
    email: 'admin@pharmaco-active.ma',
    name: 'Company User - Active'
  },
  {
    id: '00000000-0000-0000-0301-000000000002',
    email: 'admin@pharmaco-empty.ma',
    name: 'Company User - Empty'
  },
  {
    id: '00000000-0000-0000-0101-000000000099',
    email: 'vendor@pm-platform.ma',
    name: 'Vendor'
  }
];

async function resetUserPassword(user) {
  const url = `${SUPABASE_URL}/auth/v1/admin/users/${user.id}`;
  
  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'apikey': SUPABASE_SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        password: TEST_PASSWORD,
        email_confirm: true
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`HTTP ${response.status}: ${error}`);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function main() {
  console.log('🔐 Resetting test user passwords...\n');
  console.log(`📌 Supabase URL: ${SUPABASE_URL}`);
  console.log(`🔑 Password: ${TEST_PASSWORD}\n`);

  const results = [];

  for (const user of TEST_USERS) {
    process.stdout.write(`⏳ Resetting password for ${user.email}... `);
    const result = await resetUserPassword(user);
    
    if (result.success) {
      console.log('✅ Success');
      results.push({ user, success: true });
    } else {
      console.log(`❌ Failed: ${result.error}`);
      results.push({ user, success: false, error: result.error });
    }
  }

  console.log('\n📊 Summary:');
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  
  console.log(`   ✅ Successful: ${successful}/${TEST_USERS.length}`);
  console.log(`   ❌ Failed: ${failed}/${TEST_USERS.length}`);

  if (failed > 0) {
    console.log('\n❌ Failed users:');
    results
      .filter(r => !r.success)
      .forEach(r => {
        console.log(`   - ${r.user.email}: ${r.error}`);
      });
    process.exit(1);
  } else {
    console.log('\n✅ All test user passwords have been reset successfully!');
    console.log('\n📝 You can now log in with:');
    console.log(`   Email: any of the test user emails`);
    console.log(`   Password: ${TEST_PASSWORD}`);
  }
}

main().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
