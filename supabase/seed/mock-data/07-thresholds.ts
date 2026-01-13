/**
 * Task 1.1.6.9: Mock Data Generation - Thresholds
 * 
 * Generates calculated thresholds for all SKUs based on AAMS data.
 */

import { seedUUID, randomInt, randomElement } from '../utils'
import { MOCK_SKUS, MOCK_PRODUCTS } from './02-products'
import { MOCK_AAMS_SUBMISSIONS } from './06-vci-submissions'
import { CONFIG } from './00-config'

// ============================================================================
// Types - Aligned with actual database schema
// ============================================================================

export interface MockThreshold {
  id: string
  sku_id: string
  threshold_type: 'vci' | 'ecs'
  threshold_value: number
  multiplier_b: number
  aams_value: number
  effective_from: string
  effective_to: string | null
  is_current: boolean
  duration_type: 'permanent' | 'temporary'
  created_by: string
}

// ============================================================================
// Constants
// ============================================================================

const STANDARD_MULTIPLIER = 3.0
const CRITICAL_MULTIPLIER = 3.5
const THRESHOLD_TYPES: ('vci' | 'ecs')[] = ['vci', 'ecs']

// ============================================================================
// Generate Thresholds
// ============================================================================

export function generateThresholds(): MockThreshold[] {
  const thresholds: MockThreshold[] = []
  let index = 1

  // Create a map of SKU AAMS values from submissions
  const skuAAMSMap = new Map<string, Map<number, number>>()

  for (const submission of MOCK_AAMS_SUBMISSIONS) {
    if (submission.submission_data && Array.isArray(submission.submission_data)) {
      for (const item of submission.submission_data) {
        if (!skuAAMSMap.has(item.sku_id)) {
          skuAAMSMap.set(item.sku_id, new Map())
        }
        skuAAMSMap.get(item.sku_id)!.set(submission.year, item.quantity)
      }
    }
  }

  // Generate thresholds for each SKU and year
  for (const sku of MOCK_SKUS) {
    const product = MOCK_PRODUCTS.find(p => p.id === sku.product_id)
    const isCritical = product?.is_critical_medicine || false
    const multiplier = isCritical ? CRITICAL_MULTIPLIER : STANDARD_MULTIPLIER

    for (let year = CONFIG.history.startYear; year <= CONFIG.history.currentYear; year++) {
      const skuYearData = skuAAMSMap.get(sku.id)
      let aamsValue = skuYearData?.get(year) || 0

      // Handle fallback scenarios
      if (aamsValue === 0) {
        // Try previous year
        const previousYear = skuYearData?.get(year - 1)
        if (previousYear) {
          aamsValue = previousYear
        } else {
          // Estimate based on random value
          aamsValue = randomInt(1000, 50000)
        }
      }

      const thresholdValue = Math.round(aamsValue * multiplier)
      const thresholdType = randomElement(THRESHOLD_TYPES)
      const isCurrentYear = year === CONFIG.history.currentYear

      thresholds.push({
        id: seedUUID('threshold', index),
        sku_id: sku.id,
        threshold_type: thresholdType,
        threshold_value: thresholdValue,
        multiplier_b: multiplier,
        aams_value: aamsValue,
        effective_from: `${year}-01-01`,
        effective_to: isCurrentYear ? null : `${year}-12-31`,
        is_current: isCurrentYear,
        duration_type: 'permanent',
        created_by: seedUUID('user', randomInt(1, 3)), // Tier 1 user
      })
      index++
    }
  }

  return thresholds
}

export const MOCK_THRESHOLDS = generateThresholds()
