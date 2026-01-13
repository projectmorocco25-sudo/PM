/**
 * Task 1.1.6.6: Mock Data Generation - AAMS (2-3 years historical)
 * Task 1.1.6.7: Mock Data Generation - MSQ (2-3 years monthly)
 * Task 1.1.6.8: Mock Data Generation - WSL (2-3 years weekly with breaches)
 * 
 * Generates historical VCI submission data with proper submission_data structure.
 */

import { seedUUID, randomInt, randomElement, startOfMonth, startOfWeek } from '../utils'
import { CONFIG, BREACH_REASONS } from './00-config'
import { MOCK_COMPANIES } from './01-companies'
import { MOCK_SKUS, MOCK_PRODUCTS } from './02-products'

// ============================================================================
// Types
// ============================================================================

// Task 1.1.6.6: AAMS submission with {sku_id, quantity} array
export interface MockAAMSSubmission {
  id: string
  company_id: string
  year: number
  submission_data: Array<{ sku_id: string; quantity: number }>
  aams_value: number // Total AAMS
  status: 'draft' | 'submitted' | 'tier2_verified' | 'tier1_approved' | 'completed' | 'rejected'
  submitted_at: string | null
  submitted_by: string | null
  verified_by: string | null
  approved_by: string | null
  is_late: boolean
}

// Task 1.1.6.7: MSQ submission with {sku_id, quantity} array
export interface MockMSQSubmission {
  id: string
  company_id: string
  year: number
  month: number
  submission_data: Array<{ sku_id: string; quantity: number }>
  status: 'submitted' | 'flagged_for_review' | 'accepted' | 'rejected'
  submitted_at: string
  submitted_by: string
  validation_flags: Array<{ type: string; message: string; sku_id?: string }>
}

// Task 1.1.6.8: WSL submission with breach support
export interface MockWSLSubmission {
  id: string
  company_id: string
  week_ending_date: string
  submission_data: Array<{
    sku_id: string
    quantity: number
    breach_reason?: string
    replenishment_date?: string
  }>
  status: 'submitted' | 'late' | 'non_compliant' | 'accepted'
  is_late: boolean
  is_non_compliant: boolean
  submitted_at: string
  submitted_by: string
}

// ============================================================================
// Helper Functions
// ============================================================================

function getCompanySKUs(companyId: string): typeof MOCK_SKUS {
  const companyProducts = MOCK_PRODUCTS.filter(p => p.company_id === companyId)
  const productIds = companyProducts.map(p => p.id)
  return MOCK_SKUS.filter(s => productIds.includes(s.product_id))
}

function getWeekEndingDate(weeksAgo: number): string {
  const date = new Date()
  date.setDate(date.getDate() - (date.getDay() || 7) + 5 - (weeksAgo * 7)) // Friday
  date.setHours(17, 0, 0, 0)
  return date.toISOString()
}

function getSubmissionDate(targetDate: Date, isLate: boolean): string {
  const offset = isLate ? randomInt(3, 15) : randomInt(-7, 0)
  const date = new Date(targetDate)
  date.setDate(date.getDate() + offset)
  return date.toISOString()
}

// ============================================================================
// Task 1.1.6.6: Generate AAMS Submissions
// ============================================================================

export function generateAAMSSubmissions(): MockAAMSSubmission[] {
  const submissions: MockAAMSSubmission[] = []
  let index = 1

  const activeIPCs = MOCK_COMPANIES.filter(c => c.company_type === 'ipc' && c.is_active)

  for (const company of activeIPCs) {
    const skus = getCompanySKUs(company.id)
    if (skus.length === 0) continue

    // Generate for each year (2024, 2025, 2026)
    for (let year = CONFIG.history.startYear; year <= CONFIG.history.currentYear; year++) {
      const submissionData = skus.map(sku => ({
        sku_id: sku.id,
        quantity: randomInt(10000, 500000),
      }))
      
      const aamsValue = submissionData.reduce((acc, d) => acc + d.quantity, 0)
      const isLate = Math.random() < 0.1 // 10% late
      const status = year < CONFIG.history.currentYear ? 'completed' :
                     Math.random() > 0.2 ? 'tier1_approved' : 'submitted'

      const submittedDate = new Date(year, 0, randomInt(15, 31)) // January
      
      submissions.push({
        id: seedUUID('aams', index),
        company_id: company.id,
        year,
        submission_data: submissionData,
        aams_value: aamsValue,
        status,
        submitted_at: getSubmissionDate(submittedDate, isLate),
        submitted_by: seedUUID('user', randomInt(1, 12)), // Use MOH users that exist
        verified_by: status !== 'submitted' ? seedUUID('user', randomInt(4, 8)) : null,
        approved_by: status === 'tier1_approved' || status === 'completed' ? seedUUID('user', randomInt(1, 3)) : null,
        is_late: isLate,
      })
      index++
    }
  }

  return submissions
}

// ============================================================================
// Task 1.1.6.7: Generate MSQ Submissions
// ============================================================================

export function generateMSQSubmissions(): MockMSQSubmission[] {
  const submissions: MockMSQSubmission[] = []
  let index = 1

  const activeIPCs = MOCK_COMPANIES.filter(c => c.company_type === 'ipc' && c.is_active)

  for (const company of activeIPCs) {
    const skus = getCompanySKUs(company.id)
    if (skus.length === 0) continue

    // Generate for each month over 3 years (36 months)
    for (let monthsAgo = 0; monthsAgo < 36; monthsAgo++) {
      const date = new Date()
      date.setMonth(date.getMonth() - monthsAgo)
      const year = date.getFullYear()
      const month = date.getMonth() + 1

      const submissionData = skus.map(sku => ({
        sku_id: sku.id,
        quantity: randomInt(500, 50000),
      }))
      
      const hasAnomalies = Math.random() < 0.05 // 5% have anomalies
      const status = hasAnomalies ? 'flagged_for_review' : 'accepted'

      const submittedDate = new Date(year, month, randomInt(1, 10)) // First 10 days of next month

      const validationFlags: Array<{ type: string; message: string; sku_id?: string }> = []
      if (hasAnomalies) {
        validationFlags.push({
          type: 'anomaly',
          message: 'Quantity deviates >20% from historical average',
          sku_id: randomElement(skus).id,
        })
      }

      submissions.push({
        id: seedUUID('msq', index),
        company_id: company.id,
        year,
        month,
        submission_data: submissionData,
        status,
        submitted_at: submittedDate.toISOString(),
        submitted_by: seedUUID('user', randomInt(1, 12)), // Use MOH users that exist
        validation_flags: validationFlags,
      })
      index++
    }
  }

  return submissions
}

// ============================================================================
// Task 1.1.6.8: Generate WSL Submissions
// ============================================================================

export function generateWSLSubmissions(): MockWSLSubmission[] {
  const submissions: MockWSLSubmission[] = []
  let index = 1

  const activeIPCs = MOCK_COMPANIES.filter(c => c.company_type === 'ipc' && c.is_active)

  for (const company of activeIPCs) {
    const skus = getCompanySKUs(company.id)
    if (skus.length === 0) continue

    // Generate for each week over 3 years (~156 weeks)
    for (let weeksAgo = 0; weeksAgo < 156; weeksAgo++) {
      const weekEndingDate = getWeekEndingDate(weeksAgo)
      let breachCount = 0

      const submissionData = skus.map(sku => {
        const quantity = randomInt(100, 10000)
        const isBreach = Math.random() < CONFIG.breaches.probability

        if (isBreach) {
          breachCount++
          return {
            sku_id: sku.id,
            quantity,
            breach_reason: randomElement(BREACH_REASONS),
            replenishment_date: new Date(
              Date.now() - (weeksAgo * 7 * 24 * 60 * 60 * 1000) + randomInt(7, 30) * 24 * 60 * 60 * 1000
            ).toISOString(),
          }
        }

        return { sku_id: sku.id, quantity }
      })

      const isLate = Math.random() < 0.05 // 5% late
      const status = breachCount > 0 ? 'non_compliant' : isLate ? 'late' : 'accepted'

      const weekEndDate = new Date(weekEndingDate)
      const submittedAt = new Date(weekEndDate)
      submittedAt.setDate(submittedAt.getDate() + (isLate ? randomInt(1, 3) : 0))

      submissions.push({
        id: seedUUID('wsl', index),
        company_id: company.id,
        week_ending_date: weekEndingDate.split('T')[0], // Date only
        submission_data: submissionData,
        status,
        is_late: isLate,
        is_non_compliant: breachCount > 0,
        submitted_at: submittedAt.toISOString(),
        submitted_by: seedUUID('user', randomInt(1, 12)), // Use MOH users that exist
      })
      index++
    }
  }

  return submissions
}

// Export generated data
export const MOCK_AAMS_SUBMISSIONS = generateAAMSSubmissions()
export const MOCK_MSQ_SUBMISSIONS = generateMSQSubmissions()
export const MOCK_WSL_SUBMISSIONS = generateWSLSubmissions()
