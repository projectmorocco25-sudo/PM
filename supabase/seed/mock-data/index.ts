/**
 * Task 1.1.6.13: Mock Data Population Execution Script
 * 
 * Main entry point for executing mock data generation and population.
 */

import { supabase, log, logSection, batchInsert } from '../utils'
import { MOCK_COMPANIES } from './01-companies'
import { MOCK_PRODUCTS, MOCK_SKUS } from './02-products'
import { MOCK_ATC_CODES } from './03-atc-codes'
import { MOCK_CRITICAL_MEDICINES } from './04-critical-medicines'
import { MOCK_USERS, MOCK_MOH_USERS, MOCK_COMPANY_USERS } from './05-users'
import { MOCK_AAMS_SUBMISSIONS, MOCK_MSQ_SUBMISSIONS, MOCK_WSL_SUBMISSIONS } from './06-vci-submissions'
import { MOCK_THRESHOLDS } from './07-thresholds'
import { MOCK_REGISTRY_SUBMISSIONS } from './08-registry-submissions'
import { MOCK_BREACHES, MOCK_BREACH_ANALYSES } from './09-breaches'

// ============================================================================
// Statistics
// ============================================================================

function printStatistics() {
  logSection('Mock Data Generation Statistics')
  
  console.log(`
📊 Generated Data Summary:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Companies:            ${MOCK_COMPANIES.length}
    - IPCs:             ${MOCK_COMPANIES.filter(c => c.company_type === 'ipc').length}
    - Wholesalers:      ${MOCK_COMPANIES.filter(c => c.company_type === 'wholesaler').length}
    - Active:           ${MOCK_COMPANIES.filter(c => c.is_active).length}
  
  Products:             ${MOCK_PRODUCTS.length}
    - Critical:         ${MOCK_PRODUCTS.filter(p => p.is_critical_medicine).length}
  
  SKUs:                 ${MOCK_SKUS.length}
    - Avg per product:  ${MOCK_PRODUCTS.length > 0 ? (MOCK_SKUS.length / MOCK_PRODUCTS.length).toFixed(1) : 0}
  
  ATC Codes:            ${MOCK_ATC_CODES.length}
  Critical Medicines:   ${MOCK_CRITICAL_MEDICINES.length}
  
  Users:                ${MOCK_USERS.length}
    - MOH Staff:        ${MOCK_MOH_USERS.length}
    - Company Users:    ${MOCK_COMPANY_USERS.length}
  
  VCI Submissions:
    - AAMS:             ${MOCK_AAMS_SUBMISSIONS.length}
    - MSQ:              ${MOCK_MSQ_SUBMISSIONS.length}
    - WSL:              ${MOCK_WSL_SUBMISSIONS.length}
  
  Thresholds:           ${MOCK_THRESHOLDS.length}
  Registry Submissions: ${MOCK_REGISTRY_SUBMISSIONS.length}
  
  Breaches:             ${MOCK_BREACHES.length}
    - Critical:         ${MOCK_BREACHES.filter(b => b.priority === 'critical').length}
    - High:             ${MOCK_BREACHES.filter(b => b.priority === 'high').length}
    - Standard:         ${MOCK_BREACHES.filter(b => b.priority === 'standard').length || 0}
  
  Breach Analyses:      ${MOCK_BREACH_ANALYSES.length}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  `)
}

// ============================================================================
// Seed Functions
// ============================================================================

async function seedMOHUsers() {
  logSection('Seeding MOH Users (Step 1)')
  
  // Create auth users first for MOH staff
  for (const user of MOCK_MOH_USERS) {
    try {
      const { error } = await supabase.auth.admin.createUser({
        id: user.id,
        email: user.email,
        password: 'Test123!',
        email_confirm: true,
        user_metadata: { full_name: user.full_name },
      })
      if (error && !error.message.includes('already')) {
        log(`Failed to create auth user ${user.email}: ${error.message}`, 'warn')
      }
    } catch {
      // User may already exist
    }
  }
  
  await batchInsert('users', MOCK_MOH_USERS, { onConflict: 'id', batchSize: 50 })
  log(`Seeded ${MOCK_MOH_USERS.length} MOH users`, 'success')
}

async function seedCompanies() {
  logSection('Seeding Companies (Step 2)')
  await batchInsert('companies', MOCK_COMPANIES, { onConflict: 'id', batchSize: 50 })
  log(`Seeded ${MOCK_COMPANIES.length} companies`, 'success')
}

async function seedCompanyUsers() {
  logSection('Seeding Company Users (Step 3)')
  
  // Create auth users AND collect successful ones
  // Only users with auth accounts can be inserted into public.users (FK constraint)
  const successfulUsers: typeof MOCK_COMPANY_USERS = []
  
  // Create auth users for first 50 company users (enough for testing)
  const usersToCreate = MOCK_COMPANY_USERS.slice(0, 50)
  
  for (const user of usersToCreate) {
    try {
      const { error } = await supabase.auth.admin.createUser({
        id: user.id,
        email: user.email,
        password: 'Test123!',
        email_confirm: true,
        user_metadata: { full_name: user.full_name },
      })
      if (!error) {
        successfulUsers.push(user)
      } else if (error.message.includes('already')) {
        // User exists, can still insert into public.users
        successfulUsers.push(user)
      } else {
        log(`Failed to create auth user ${user.email}: ${error.message}`, 'warn')
      }
    } catch {
      // User may already exist
      successfulUsers.push(user)
    }
  }
  
  if (successfulUsers.length > 0) {
    // Use id as conflict target to handle duplicates across runs
    await batchInsert('users', successfulUsers, { onConflict: 'id', batchSize: 50 })
  }
  log(`Seeded ${successfulUsers.length} company users (of ${usersToCreate.length} attempted)`, 'success')
}

async function seedATCCodes() {
  logSection('Seeding ATC Codes (Step 4)')
  await batchInsert('atc_codes', MOCK_ATC_CODES, { onConflict: 'id', batchSize: 50 })
  log(`Seeded ${MOCK_ATC_CODES.length} ATC codes`, 'success')
}

async function seedProducts() {
  logSection('Seeding Products and SKUs (Step 5)')
  await batchInsert('products', MOCK_PRODUCTS, { onConflict: 'id', batchSize: 50 })
  log(`Seeded ${MOCK_PRODUCTS.length} products`, 'success')
  await batchInsert('skus', MOCK_SKUS, { onConflict: 'id', batchSize: 100 })
  log(`Seeded ${MOCK_SKUS.length} SKUs`, 'success')
}

async function seedCriticalMedicines() {
  logSection('Seeding Critical Medicines (Step 6)')
  await batchInsert('critical_medicines', MOCK_CRITICAL_MEDICINES, { onConflict: 'id', batchSize: 50 })
  log(`Seeded ${MOCK_CRITICAL_MEDICINES.length} critical medicines`, 'success')
}

async function seedThresholds() {
  logSection('Seeding Thresholds (Step 7)')
  await batchInsert('thresholds', MOCK_THRESHOLDS, { onConflict: 'id', batchSize: 100 })
  log(`Seeded ${MOCK_THRESHOLDS.length} thresholds`, 'success')
}

async function seedVCISubmissions() {
  logSection('Seeding VCI Submissions (Step 8)')
  
  log('Seeding AAMS submissions...')
  await batchInsert('aams_submissions', MOCK_AAMS_SUBMISSIONS, { onConflict: 'id', batchSize: 50 })
  log(`Seeded ${MOCK_AAMS_SUBMISSIONS.length} AAMS submissions`, 'success')
  
  log('Seeding MSQ submissions...')
  await batchInsert('msq_submissions', MOCK_MSQ_SUBMISSIONS, { onConflict: 'id', batchSize: 100 })
  log(`Seeded ${MOCK_MSQ_SUBMISSIONS.length} MSQ submissions`, 'success')
  
  log('Seeding WSL submissions...')
  await batchInsert('wsl_submissions', MOCK_WSL_SUBMISSIONS, { onConflict: 'id', batchSize: 100 })
  log(`Seeded ${MOCK_WSL_SUBMISSIONS.length} WSL submissions`, 'success')
}

async function seedRegistrySubmissions() {
  logSection('Seeding Registry Submissions (Step 9)')
  await batchInsert('registry_submissions', MOCK_REGISTRY_SUBMISSIONS, { onConflict: 'id', batchSize: 50 })
  log(`Seeded ${MOCK_REGISTRY_SUBMISSIONS.length} registry submissions`, 'success')
}

async function seedBreaches() {
  logSection('Seeding Breaches (Step 10)')
  await batchInsert('breaches', MOCK_BREACHES, { onConflict: 'id', batchSize: 100 })
  log(`Seeded ${MOCK_BREACHES.length} breaches`, 'success')
  await batchInsert('breach_analyses', MOCK_BREACH_ANALYSES, { onConflict: 'id', batchSize: 100 })
  log(`Seeded ${MOCK_BREACH_ANALYSES.length} breach analyses`, 'success')
}

// ============================================================================
// Cleanup Function
// ============================================================================

async function clearMockData() {
  logSection('Clearing Existing Mock Data')
  log('Deleting in reverse dependency order...')
  
  // Delete in reverse order to respect foreign key constraints
  const tablesToClear = [
    'breach_analyses',
    'breaches',
    'registry_submissions',
    'wsl_submissions',
    'msq_submissions',
    'aams_submissions',
    'thresholds',
    'critical_medicines',
    'skus',
    'products',
    'atc_codes',
    // Don't clear users and companies - they may have FK references we can't easily delete
  ]
  
  for (const table of tablesToClear) {
    const { error } = await supabase.from(table).delete().neq('id', '00000000-0000-0000-0000-000000000000')
    if (error && !error.message.includes('permission denied')) {
      log(`Warning clearing ${table}: ${error.message}`, 'warn')
    } else {
      log(`Cleared ${table}`)
    }
  }
}

// ============================================================================
// Main Execution
// ============================================================================

export async function runMockDataSeeding() {
  const startTime = Date.now()
  
  logSection('Starting Mock Data Seeding')
  printStatistics()
  
  try {
    // Clear existing mock data first
    await clearMockData()
    
    // Execute in CORRECT order respecting foreign keys:
    // 1. MOH Users first (no dependencies - company_id is NULL)
    await seedMOHUsers()
    
    // 2. Companies (suspended_by can reference MOH users who now exist)
    await seedCompanies()
    
    // 3. Company Users (company_id references companies that now exist)
    await seedCompanyUsers()
    
    // 4. ATC Codes (no dependencies, but needed before SKUs)
    await seedATCCodes()
    
    // 5. Products and SKUs (references companies, atc_codes, users)
    await seedProducts()
    
    // 6. Critical Medicines (references skus, users)
    await seedCriticalMedicines()
    
    // 7. Thresholds (references skus, users)
    await seedThresholds()
    
    // 8. VCI Submissions (references companies, users)
    await seedVCISubmissions()
    
    // 9. Registry Submissions (references companies, users)
    await seedRegistrySubmissions()
    
    // 10. Breaches (references skus, companies, wsl_submissions, thresholds)
    await seedBreaches()
    
    const duration = ((Date.now() - startTime) / 1000).toFixed(2)
    logSection('Mock Data Seeding Complete')
    log(`Total execution time: ${duration}s`, 'success')
    
    return { success: true, duration }
  } catch (error) {
    log(`Seeding failed: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error')
    console.error(error)
    return { success: false, error }
  }
}

// Run if executed directly (ESM compatible)
import { fileURLToPath } from 'url'
const isMainModule = process.argv[1] && fileURLToPath(import.meta.url).includes(process.argv[1].replace(/\\/g, '/'))

if (isMainModule) {
  runMockDataSeeding()
    .then((result) => {
      process.exit(result.success ? 0 : 1)
    })
    .catch((error) => {
      console.error(error)
      process.exit(1)
    })
}
