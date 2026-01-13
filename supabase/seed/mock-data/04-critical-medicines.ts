/**
 * Task 1.1.6.5: Mock Data Generation - Critical Medicines
 * 
 * Designates a subset of SKUs as critical medicines based on therapeutic importance.
 */

import { seedUUID, randomElement } from '../utils'
import { MOCK_SKUS, MOCK_PRODUCTS } from './02-products'

// ============================================================================
// Types - Aligned with actual database schema
// ============================================================================

export interface MockCriticalMedicine {
  id: string
  sku_id: string
  designation_date: string
  designated_by: string
  reason: string
  is_active: boolean
}

// ============================================================================
// Critical Medicine Criteria
// ============================================================================

const DESIGNATION_REASONS = [
  'Essential medicine per WHO list',
  'High therapeutic importance - chronic disease management',
  'Limited alternative sources in market',
  'Critical for emergency care',
  'Public health priority',
  'High volume consumption medicine',
  'Life-sustaining medication',
  'Pediatric essential medicine',
]

// ============================================================================
// Generate Critical Medicines
// ============================================================================

export function generateCriticalMedicines(): MockCriticalMedicine[] {
  const criticalMedicines: MockCriticalMedicine[] = []
  let index = 1

  // Get products marked as critical
  const criticalProducts = MOCK_PRODUCTS.filter(p => p.is_critical_medicine)

  for (const product of criticalProducts) {
    // Get SKUs for this product
    const productSKUs = MOCK_SKUS.filter(s => s.product_id === product.id)

    for (const sku of productSKUs) {
      criticalMedicines.push({
        id: seedUUID('critical-medicine', index),
        sku_id: sku.id,
        designation_date: new Date(
          Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000 * 2 // Random date within last 2 years
        ).toISOString().split('T')[0], // Just the date part
        designated_by: seedUUID('user', 1), // Tier 1 user
        reason: randomElement(DESIGNATION_REASONS),
        is_active: true,
      })
      index++
    }
  }

  return criticalMedicines
}

export const MOCK_CRITICAL_MEDICINES = generateCriticalMedicines()
