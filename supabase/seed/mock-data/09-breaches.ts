/**
 * Task 1.1.6.12: Mock Data Generation - Breaches
 * 
 * Generates historical breach records with analyses.
 */

import { seedUUID, randomInt, randomElement, daysAgo } from '../utils'
import { BREACH_REASONS } from './00-config'
import { MOCK_COMPANIES } from './01-companies'
import { MOCK_SKUS, MOCK_PRODUCTS } from './02-products'
import { MOCK_WSL_SUBMISSIONS } from './06-vci-submissions'
import { MOCK_THRESHOLDS } from './07-thresholds'

// ============================================================================
// Types - Aligned with actual database schema
// ============================================================================

export interface MockBreach {
  id: string
  sku_id: string
  company_id: string
  wsl_submission_id: string | null
  threshold_id: string | null
  stock_level: number
  threshold_value: number
  breach_date: string
  breach_reason: string
  replenishment_date: string | null
  priority: 'standard' | 'high' | 'critical'
  status: 'detected' | 'tier2_analyzing' | 'tier2_suggested' | 'tier1_reviewed' | 'action_taken' | 'completed'
}

export interface MockBreachAnalysis {
  id: string
  breach_id: string
  analyzed_by: string
  suggested_action: string
  suggested_action_details: string
  analysis_notes: string
  analyzed_at: string
}

// ============================================================================
// Constants
// ============================================================================

// Valid suggested_action values from DB constraint
const SUGGESTED_ACTIONS: Array<'warning' | 'require_replenishment_plan' | 'require_production_plan' | 'enhanced_monitoring' | 'escalate'> = [
  'warning',
  'require_replenishment_plan',
  'require_production_plan',
  'enhanced_monitoring',
  'escalate',
]

const PRIORITIES: MockBreach['priority'][] = ['standard', 'high', 'critical']
const STATUSES: MockBreach['status'][] = ['detected', 'tier2_analyzing', 'tier2_suggested', 'tier1_reviewed', 'action_taken', 'completed']

// ============================================================================
// Generate Breaches
// ============================================================================

export function generateBreaches(): { breaches: MockBreach[]; analyses: MockBreachAnalysis[] } {
  const breaches: MockBreach[] = []
  const analyses: MockBreachAnalysis[] = []
  let breachIndex = 1
  let analysisIndex = 1

  // Get IPCs for breaches
  const activeIPCs = MOCK_COMPANIES.filter(c => c.company_type === 'ipc' && c.is_active)

  for (const company of activeIPCs) {
    // Get company's products and SKUs
    const companyProducts = MOCK_PRODUCTS.filter(p => p.company_id === company.id)
    const productIds = companyProducts.map(p => p.id)
    const companySKUs = MOCK_SKUS.filter(s => productIds.includes(s.product_id))

    if (companySKUs.length === 0) continue

    // Get company's WSL submissions
    const companyWSLs = MOCK_WSL_SUBMISSIONS.filter(w => w.company_id === company.id)

    // Generate breaches from WSL submission data
    for (const wsl of companyWSLs) {
      if (!wsl.submission_data || !Array.isArray(wsl.submission_data)) continue
      
      for (const item of wsl.submission_data) {
        if (item.breach_reason) {
          const sku = companySKUs.find(s => s.id === item.sku_id)
          if (!sku) continue

          const threshold = MOCK_THRESHOLDS.find(t => t.sku_id === sku.id && t.is_current)
          const thresholdValue = threshold?.threshold_value || randomInt(5000, 50000)
          const stockLevel = randomInt(100, Math.floor(thresholdValue * 0.8))
          
          const priorityRoll = Math.random()
          const priority: MockBreach['priority'] = 
            priorityRoll > 0.9 ? 'critical' :
            priorityRoll > 0.6 ? 'high' : 'standard'

          const status = randomElement(STATUSES)

          const breach: MockBreach = {
            id: seedUUID('breach', breachIndex),
            sku_id: sku.id,
            company_id: company.id,
            wsl_submission_id: wsl.id,
            threshold_id: threshold?.id || null,
            stock_level: stockLevel,
            threshold_value: thresholdValue,
            breach_date: wsl.week_ending_date.split('T')[0],
            breach_reason: item.breach_reason,
            replenishment_date: item.replenishment_date ? item.replenishment_date.split('T')[0] : null,
            priority,
            status,
          }
          breaches.push(breach)

          // Create analysis for most breaches
          if (status !== 'detected' && Math.random() > 0.1) {
            analyses.push({
              id: seedUUID('breach-analysis', analysisIndex),
              breach_id: breach.id,
              analyzed_by: seedUUID('user', randomInt(4, 8)), // Tier 2 users
              suggested_action: randomElement(SUGGESTED_ACTIONS),
              suggested_action_details: `Action details for breach ${breachIndex}`,
              analysis_notes: `Analysis conducted for ${item.breach_reason}`,
              analyzed_at: daysAgo(randomInt(0, 14)),
            })
            analysisIndex++
          }

          breachIndex++
        }
      }
    }
  }

  return { breaches, analyses }
}

// Export generated data
const generated = generateBreaches()
export const MOCK_BREACHES = generated.breaches
export const MOCK_BREACH_ANALYSES = generated.analyses
