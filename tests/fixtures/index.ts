/**
 * Task 1.1.7.0d: Test Fixtures Index
 * 
 * Exports all test fixtures for easy import.
 */

// Company Fixtures
export {
  ACTIVE_IPC,
  ACTIVE_WHOLESALER,
  PENDING_COMPANY,
  SUSPENDED_COMPANY,
  HIGH_VOLUME_COMPANY,
  CRITICAL_MEDICINE_COMPANY,
  LOW_COMPLIANCE_COMPANY,
  ALL_COMPANIES,
  ACTIVE_COMPANIES,
  IPC_COMPANIES,
  WHOLESALER_COMPANIES,
  type CompanyFixture,
} from './companies'

// Product & SKU Fixtures
export {
  STANDARD_PRODUCT,
  CRITICAL_PRODUCT,
  PENDING_PRODUCT,
  DISCONTINUED_PRODUCT,
  ALL_PRODUCTS,
  ACTIVE_PRODUCTS,
  TABLET_SKU,
  CAPSULE_SKU,
  SYRUP_SKU,
  INJECTION_SKU,
  INACTIVE_SKU,
  ALL_SKUS,
  ACTIVE_SKUS,
  STANDARD_PRODUCT_SKUS,
  type ProductFixture,
  type SKUFixture,
} from './products'

// Submission Fixtures
export {
  STANDARD_AAMS,
  LATE_AAMS,
  REJECTED_AAMS,
  ALL_AAMS,
  STANDARD_MSQ,
  ANOMALY_MSQ,
  HISTORICAL_MSQ_SET,
  ALL_MSQ,
  STANDARD_WSL,
  BREACH_WSL,
  LATE_WSL,
  CRITICAL_BREACH_WSL,
  ALL_WSL,
  type AAMSFixture,
  type MSQFixture,
  type WSLFixture,
} from './submissions'

// ============================================================================
// Fixture Loader
// ============================================================================

import { SupabaseClient } from '@supabase/supabase-js'
import { ALL_COMPANIES } from './companies'
import { ALL_PRODUCTS, ALL_SKUS } from './products'
import { ALL_AAMS, ALL_MSQ, ALL_WSL } from './submissions'

/**
 * Loads all fixtures into the test database
 */
export async function loadAllFixtures(client: SupabaseClient): Promise<void> {
  console.log('📦 Loading test fixtures...')

  // Load in dependency order
  await client.from('companies').upsert(ALL_COMPANIES)
  await client.from('products').upsert(ALL_PRODUCTS)
  await client.from('skus').upsert(ALL_SKUS)
  await client.from('aams_submissions').upsert(ALL_AAMS)
  await client.from('msq_submissions').upsert(ALL_MSQ)
  await client.from('wsl_submissions').upsert(ALL_WSL)

  console.log('✅ Test fixtures loaded')
}

/**
 * Clears all fixtures from the test database
 */
export async function clearAllFixtures(client: SupabaseClient): Promise<void> {
  console.log('🧹 Clearing test fixtures...')

  // Clear in reverse dependency order
  const fixtureIds = {
    wsl_submissions: ALL_WSL.map(w => w.id),
    msq_submissions: ALL_MSQ.map(m => m.id),
    aams_submissions: ALL_AAMS.map(a => a.id),
    skus: ALL_SKUS.map(s => s.id),
    products: ALL_PRODUCTS.map(p => p.id),
    companies: ALL_COMPANIES.map(c => c.id),
  }

  for (const [table, ids] of Object.entries(fixtureIds)) {
    await client.from(table).delete().in('id', ids)
  }

  console.log('✅ Test fixtures cleared')
}
