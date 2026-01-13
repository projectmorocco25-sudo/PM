/**
 * Task 1.1.7.0d: Test Fixtures - VCI Submissions
 * 
 * Pre-defined submission test data for AAMS, MSQ, WSL scenarios.
 */

import { ACTIVE_IPC, LOW_COMPLIANCE_COMPANY } from './companies'
import { TABLET_SKU, CAPSULE_SKU, SYRUP_SKU, INJECTION_SKU } from './products'

// ============================================================================
// Types
// ============================================================================

export interface AAMSFixture {
  id: string
  company_id: string
  year: number
  submission_data: Array<{ sku_id: string; quantity: number }>
  aams_value: number
  status: string
  is_late: boolean
}

export interface MSQFixture {
  id: string
  company_id: string
  year: number
  month: number
  submission_data: Array<{ sku_id: string; quantity: number }>
  total_quantity: number
  status: string
}

export interface WSLFixture {
  id: string
  company_id: string
  week_ending_date: string
  submission_data: Array<{
    sku_id: string
    quantity: number
    breach_reason?: string
    replenishment_date?: string
  }>
  status: string
  breach_count: number
}

// ============================================================================
// AAMS Fixtures
// ============================================================================

/**
 * Standard AAMS submission - on time, complete
 */
export const STANDARD_AAMS: AAMSFixture = {
  id: 'fix-aams-standard',
  company_id: ACTIVE_IPC.id,
  year: 2026,
  submission_data: [
    { sku_id: TABLET_SKU.id, quantity: 100000 },
    { sku_id: CAPSULE_SKU.id, quantity: 80000 },
    { sku_id: SYRUP_SKU.id, quantity: 50000 },
  ],
  aams_value: 230000,
  status: 'approved',
  is_late: false,
}

/**
 * Late AAMS submission
 */
export const LATE_AAMS: AAMSFixture = {
  id: 'fix-aams-late',
  company_id: LOW_COMPLIANCE_COMPANY.id,
  year: 2026,
  submission_data: [
    { sku_id: TABLET_SKU.id, quantity: 75000 },
  ],
  aams_value: 75000,
  status: 'submitted',
  is_late: true,
}

/**
 * Rejected AAMS submission
 */
export const REJECTED_AAMS: AAMSFixture = {
  id: 'fix-aams-rejected',
  company_id: ACTIVE_IPC.id,
  year: 2025,
  submission_data: [
    { sku_id: TABLET_SKU.id, quantity: 50000 },
  ],
  aams_value: 50000,
  status: 'rejected',
  is_late: false,
}

// ============================================================================
// MSQ Fixtures
// ============================================================================

/**
 * Standard MSQ submission
 */
export const STANDARD_MSQ: MSQFixture = {
  id: 'fix-msq-standard',
  company_id: ACTIVE_IPC.id,
  year: 2026,
  month: 1,
  submission_data: [
    { sku_id: TABLET_SKU.id, quantity: 8000 },
    { sku_id: CAPSULE_SKU.id, quantity: 6500 },
    { sku_id: SYRUP_SKU.id, quantity: 4000 },
  ],
  total_quantity: 18500,
  status: 'accepted',
}

/**
 * MSQ with anomaly (flagged for review)
 */
export const ANOMALY_MSQ: MSQFixture = {
  id: 'fix-msq-anomaly',
  company_id: ACTIVE_IPC.id,
  year: 2026,
  month: 2,
  submission_data: [
    { sku_id: TABLET_SKU.id, quantity: 25000 }, // >20% deviation from typical
  ],
  total_quantity: 25000,
  status: 'flagged_for_review',
}

/**
 * Historical MSQ for XAMS calculation (6 months)
 */
export const HISTORICAL_MSQ_SET: MSQFixture[] = Array.from({ length: 6 }, (_, i) => ({
  id: `fix-msq-hist-${i + 1}`,
  company_id: ACTIVE_IPC.id,
  year: 2025,
  month: 7 + i, // July - December
  submission_data: [
    { sku_id: TABLET_SKU.id, quantity: 8000 + (i * 100) },
    { sku_id: CAPSULE_SKU.id, quantity: 6500 + (i * 50) },
  ],
  total_quantity: 14500 + (i * 150),
  status: 'accepted',
}))

// ============================================================================
// WSL Fixtures
// ============================================================================

/**
 * Standard WSL submission - no breaches
 */
export const STANDARD_WSL: WSLFixture = {
  id: 'fix-wsl-standard',
  company_id: ACTIVE_IPC.id,
  week_ending_date: '2026-01-10T17:00:00Z',
  submission_data: [
    { sku_id: TABLET_SKU.id, quantity: 5000 },
    { sku_id: CAPSULE_SKU.id, quantity: 4000 },
    { sku_id: SYRUP_SKU.id, quantity: 2500 },
  ],
  status: 'accepted',
  breach_count: 0,
}

/**
 * WSL with breach
 */
export const BREACH_WSL: WSLFixture = {
  id: 'fix-wsl-breach',
  company_id: ACTIVE_IPC.id,
  week_ending_date: '2026-01-03T17:00:00Z',
  submission_data: [
    { sku_id: TABLET_SKU.id, quantity: 5000 },
    { 
      sku_id: CAPSULE_SKU.id, 
      quantity: 500, // Below threshold
      breach_reason: 'Supply chain disruption',
      replenishment_date: '2026-01-20T00:00:00Z',
    },
  ],
  status: 'non_compliant',
  breach_count: 1,
}

/**
 * Late WSL submission
 */
export const LATE_WSL: WSLFixture = {
  id: 'fix-wsl-late',
  company_id: LOW_COMPLIANCE_COMPANY.id,
  week_ending_date: '2025-12-27T17:00:00Z',
  submission_data: [
    { sku_id: TABLET_SKU.id, quantity: 3000 },
  ],
  status: 'late',
  breach_count: 0,
}

/**
 * Critical medicine breach WSL
 */
export const CRITICAL_BREACH_WSL: WSLFixture = {
  id: 'fix-wsl-critical-breach',
  company_id: ACTIVE_IPC.id,
  week_ending_date: '2025-12-20T17:00:00Z',
  submission_data: [
    {
      sku_id: INJECTION_SKU.id,
      quantity: 50, // Below critical threshold
      breach_reason: 'Raw material shortage',
      replenishment_date: '2025-12-30T00:00:00Z',
    },
  ],
  status: 'non_compliant',
  breach_count: 1,
}

// ============================================================================
// Collections
// ============================================================================

export const ALL_AAMS: AAMSFixture[] = [
  STANDARD_AAMS,
  LATE_AAMS,
  REJECTED_AAMS,
]

export const ALL_MSQ: MSQFixture[] = [
  STANDARD_MSQ,
  ANOMALY_MSQ,
  ...HISTORICAL_MSQ_SET,
]

export const ALL_WSL: WSLFixture[] = [
  STANDARD_WSL,
  BREACH_WSL,
  LATE_WSL,
  CRITICAL_BREACH_WSL,
]
