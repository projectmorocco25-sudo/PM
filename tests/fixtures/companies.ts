/**
 * Task 1.1.7.0d: Test Fixtures - Companies
 * 
 * Pre-defined company test data sets for various scenarios.
 */

// ============================================================================
// Types
// ============================================================================

export interface CompanyFixture {
  id: string
  name: string
  type: 'ipc' | 'wholesaler'
  registration_number: string
  tax_id: string
  city: string
  status: 'active' | 'pending' | 'suspended'
  description?: string
}

// ============================================================================
// Base Fixtures
// ============================================================================

/**
 * Active IPC company for standard testing
 */
export const ACTIVE_IPC: CompanyFixture = {
  id: 'fix-company-ipc-active',
  name: 'Fixture IPC Active',
  type: 'ipc',
  registration_number: 'FIX-IPC-001',
  tax_id: 'FIX-TAX-001',
  city: 'Casablanca',
  status: 'active',
  description: 'Standard active IPC for positive test cases',
}

/**
 * Active wholesaler company
 */
export const ACTIVE_WHOLESALER: CompanyFixture = {
  id: 'fix-company-ws-active',
  name: 'Fixture Wholesaler Active',
  type: 'wholesaler',
  registration_number: 'FIX-WS-001',
  tax_id: 'FIX-TAX-002',
  city: 'Rabat',
  status: 'active',
  description: 'Standard active wholesaler',
}

/**
 * Pending company awaiting approval
 */
export const PENDING_COMPANY: CompanyFixture = {
  id: 'fix-company-pending',
  name: 'Fixture Pending Company',
  type: 'ipc',
  registration_number: 'FIX-PND-001',
  tax_id: 'FIX-TAX-003',
  city: 'Marrakech',
  status: 'pending',
  description: 'Pending approval - should block certain operations',
}

/**
 * Suspended company
 */
export const SUSPENDED_COMPANY: CompanyFixture = {
  id: 'fix-company-suspended',
  name: 'Fixture Suspended Company',
  type: 'ipc',
  registration_number: 'FIX-SUS-001',
  tax_id: 'FIX-TAX-004',
  city: 'Fès',
  status: 'suspended',
  description: 'Suspended - should block all operations',
}

// ============================================================================
// Scenario-Based Fixtures
// ============================================================================

/**
 * Company with many products (performance testing)
 */
export const HIGH_VOLUME_COMPANY: CompanyFixture = {
  id: 'fix-company-high-volume',
  name: 'Fixture High Volume IPC',
  type: 'ipc',
  registration_number: 'FIX-HV-001',
  tax_id: 'FIX-TAX-005',
  city: 'Casablanca',
  status: 'active',
  description: 'Company with many products for volume testing',
}

/**
 * Company with critical medicines
 */
export const CRITICAL_MEDICINE_COMPANY: CompanyFixture = {
  id: 'fix-company-critical',
  name: 'Fixture Critical Medicine IPC',
  type: 'ipc',
  registration_number: 'FIX-CRT-001',
  tax_id: 'FIX-TAX-006',
  city: 'Casablanca',
  status: 'active',
  description: 'Company producing critical medicines - stricter rules apply',
}

/**
 * Company with compliance issues (low CMC score)
 */
export const LOW_COMPLIANCE_COMPANY: CompanyFixture = {
  id: 'fix-company-low-compliance',
  name: 'Fixture Low Compliance IPC',
  type: 'ipc',
  registration_number: 'FIX-LC-001',
  tax_id: 'FIX-TAX-007',
  city: 'Tanger',
  status: 'active',
  description: 'Company with poor compliance history',
}

// ============================================================================
// Collections
// ============================================================================

/**
 * All company fixtures for bulk operations
 */
export const ALL_COMPANIES: CompanyFixture[] = [
  ACTIVE_IPC,
  ACTIVE_WHOLESALER,
  PENDING_COMPANY,
  SUSPENDED_COMPANY,
  HIGH_VOLUME_COMPANY,
  CRITICAL_MEDICINE_COMPANY,
  LOW_COMPLIANCE_COMPANY,
]

/**
 * Active companies only
 */
export const ACTIVE_COMPANIES: CompanyFixture[] = [
  ACTIVE_IPC,
  ACTIVE_WHOLESALER,
  HIGH_VOLUME_COMPANY,
  CRITICAL_MEDICINE_COMPANY,
  LOW_COMPLIANCE_COMPANY,
]

/**
 * IPCs only
 */
export const IPC_COMPANIES: CompanyFixture[] = ALL_COMPANIES.filter(c => c.type === 'ipc')

/**
 * Wholesalers only
 */
export const WHOLESALER_COMPANIES: CompanyFixture[] = ALL_COMPANIES.filter(c => c.type === 'wholesaler')
