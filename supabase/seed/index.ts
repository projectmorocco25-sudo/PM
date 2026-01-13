/**
 * Task 1.1.1.23: Database Seeding Script
 * Task 1.1.6.13: Mock Data Population Execution
 * 
 * Main entry point for database seeding.
 * Executes all seed files in order.
 * 
 * Usage:
 *   # Basic seeds
 *   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... npx ts-node supabase/seed/index.ts
 * 
 *   # Full mock data (75 companies, 3 years history)
 *   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... npx ts-node supabase/seed/index.ts --mock
 * 
 *   # Validate mock data
 *   npx ts-node supabase/seed/mock-data/validate.ts
 * 
 *   # Performance test
 *   npx ts-node supabase/seed/mock-data/performance-test.ts
 */

import { log, logSection } from './utils'

// Import seed functions
import { seedUsers } from './01-users'
import { seedCompanies } from './02-companies'
import { seedProducts } from './03-products'
import { seedAtcCodes } from './04-atc-codes'
import { seedSubmissions } from './05-submissions'
import { seedCommunications } from './06-communications'

// Import mock data seeder
import { runMockDataSeeding } from './mock-data'

// ============================================================================
// Seed Configuration
// ============================================================================

interface SeedConfig {
  name: string
  fn: () => Promise<void>
  enabled: boolean
}

const seeds: SeedConfig[] = [
  { name: 'Users', fn: seedUsers, enabled: true },
  { name: 'Companies', fn: seedCompanies, enabled: true },
  { name: 'Products', fn: seedProducts, enabled: true },
  { name: 'ATC Codes', fn: seedAtcCodes, enabled: true },
  { name: 'Submissions', fn: seedSubmissions, enabled: true },
  { name: 'Communications', fn: seedCommunications, enabled: true },
]

// ============================================================================
// Main Execution
// ============================================================================

async function main() {
  const useMockData = process.argv.includes('--mock')
  
  if (useMockData) {
    // Task 1.1.6.13: Full mock data seeding
    logSection('Mock Data Seeding Mode')
    log('This will generate and populate comprehensive mock data (75 companies, 3 years history)')
    
    const result = await runMockDataSeeding()
    if (!result.success) {
      process.exit(1)
    }
    return
  }
  
  // Standard seeding
  logSection('Database Seeding Started')
  log(`Environment: ${process.env.NODE_ENV || 'development'}`)
  
  const startTime = Date.now()
  let successCount = 0
  let errorCount = 0
  
  for (const seed of seeds) {
    if (!seed.enabled) {
      log(`Skipping ${seed.name} (disabled)`, 'warn')
      continue
    }
    
    logSection(`Seeding: ${seed.name}`)
    
    try {
      await seed.fn()
      successCount++
      log(`${seed.name} completed`, 'success')
    } catch (error) {
      errorCount++
      log(`${seed.name} failed: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error')
      
      // Continue with other seeds or abort?
      if (process.env.SEED_ABORT_ON_ERROR === 'true') {
        throw error
      }
    }
  }
  
  // Summary
  const duration = ((Date.now() - startTime) / 1000).toFixed(2)
  logSection('Seeding Complete')
  log(`Duration: ${duration}s`)
  log(`Success: ${successCount}/${seeds.filter(s => s.enabled).length}`)
  
  if (errorCount > 0) {
    log(`Errors: ${errorCount}`, 'error')
    process.exit(1)
  }
}

// Run if executed directly
main().catch((error) => {
  log(`Fatal error: ${error.message}`, 'error')
  process.exit(1)
})

export { main as seed }
