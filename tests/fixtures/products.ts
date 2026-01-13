/**
 * Task 1.1.7.0d: Test Fixtures - Products & SKUs
 * 
 * Pre-defined product and SKU test data sets.
 */

import { ACTIVE_IPC, CRITICAL_MEDICINE_COMPANY } from './companies'

// ============================================================================
// Types
// ============================================================================

export interface ProductFixture {
  id: string
  company_id: string
  name: string
  generic_name: string
  therapeutic_class: string
  atc_code: string
  is_critical_medicine: boolean
  status: 'active' | 'pending' | 'discontinued'
}

export interface SKUFixture {
  id: string
  product_id: string
  sku_code: string
  dosage_form: string
  dosage_strength: string
  pack_size: string
  unit_of_measure: string
  pack_count: number
  unit_price: number
  status: 'active' | 'pending' | 'discontinued'
}

// ============================================================================
// Product Fixtures
// ============================================================================

/**
 * Standard active product
 */
export const STANDARD_PRODUCT: ProductFixture = {
  id: 'fix-product-standard',
  company_id: ACTIVE_IPC.id,
  name: 'Fixture Paracetamol',
  generic_name: 'Paracetamol',
  therapeutic_class: 'Analgesics',
  atc_code: 'N02BE01',
  is_critical_medicine: false,
  status: 'active',
}

/**
 * Critical medicine product
 */
export const CRITICAL_PRODUCT: ProductFixture = {
  id: 'fix-product-critical',
  company_id: CRITICAL_MEDICINE_COMPANY.id,
  name: 'Fixture Insulin',
  generic_name: 'Insulin human',
  therapeutic_class: 'Insulins',
  atc_code: 'A10AB01',
  is_critical_medicine: true,
  status: 'active',
}

/**
 * Pending product awaiting approval
 */
export const PENDING_PRODUCT: ProductFixture = {
  id: 'fix-product-pending',
  company_id: ACTIVE_IPC.id,
  name: 'Fixture New Product',
  generic_name: 'New Generic',
  therapeutic_class: 'Test Class',
  atc_code: 'A01AA01',
  is_critical_medicine: false,
  status: 'pending',
}

/**
 * Discontinued product
 */
export const DISCONTINUED_PRODUCT: ProductFixture = {
  id: 'fix-product-discontinued',
  company_id: ACTIVE_IPC.id,
  name: 'Fixture Old Product',
  generic_name: 'Old Generic',
  therapeutic_class: 'Deprecated Class',
  atc_code: 'A01AA02',
  is_critical_medicine: false,
  status: 'discontinued',
}

// ============================================================================
// SKU Fixtures
// ============================================================================

/**
 * Standard tablet SKU
 */
export const TABLET_SKU: SKUFixture = {
  id: 'fix-sku-tablet',
  product_id: STANDARD_PRODUCT.id,
  sku_code: 'FIX-TAB-500-30',
  dosage_form: 'Tablet',
  dosage_strength: '500mg',
  pack_size: '30 tablets',
  unit_of_measure: 'tablets',
  pack_count: 30,
  unit_price: 25.00,
  status: 'active',
}

/**
 * Capsule SKU
 */
export const CAPSULE_SKU: SKUFixture = {
  id: 'fix-sku-capsule',
  product_id: STANDARD_PRODUCT.id,
  sku_code: 'FIX-CAP-250-20',
  dosage_form: 'Capsule',
  dosage_strength: '250mg',
  pack_size: '20 capsules',
  unit_of_measure: 'capsules',
  pack_count: 20,
  unit_price: 35.00,
  status: 'active',
}

/**
 * Syrup SKU
 */
export const SYRUP_SKU: SKUFixture = {
  id: 'fix-sku-syrup',
  product_id: STANDARD_PRODUCT.id,
  sku_code: 'FIX-SYR-125-100',
  dosage_form: 'Syrup',
  dosage_strength: '125mg/5ml',
  pack_size: '100ml',
  unit_of_measure: 'ml',
  pack_count: 100,
  unit_price: 45.00,
  status: 'active',
}

/**
 * Injection SKU (critical)
 */
export const INJECTION_SKU: SKUFixture = {
  id: 'fix-sku-injection',
  product_id: CRITICAL_PRODUCT.id,
  sku_code: 'FIX-INJ-100-5',
  dosage_form: 'Solution for injection',
  dosage_strength: '100IU/ml',
  pack_size: '5 vials',
  unit_of_measure: 'vials',
  pack_count: 5,
  unit_price: 180.00,
  status: 'active',
}

/**
 * Inactive SKU
 */
export const INACTIVE_SKU: SKUFixture = {
  id: 'fix-sku-inactive',
  product_id: STANDARD_PRODUCT.id,
  sku_code: 'FIX-TAB-OLD-30',
  dosage_form: 'Tablet',
  dosage_strength: '250mg',
  pack_size: '30 tablets',
  unit_of_measure: 'tablets',
  pack_count: 30,
  unit_price: 20.00,
  status: 'discontinued',
}

// ============================================================================
// Collections
// ============================================================================

export const ALL_PRODUCTS: ProductFixture[] = [
  STANDARD_PRODUCT,
  CRITICAL_PRODUCT,
  PENDING_PRODUCT,
  DISCONTINUED_PRODUCT,
]

export const ACTIVE_PRODUCTS: ProductFixture[] = [
  STANDARD_PRODUCT,
  CRITICAL_PRODUCT,
]

export const ALL_SKUS: SKUFixture[] = [
  TABLET_SKU,
  CAPSULE_SKU,
  SYRUP_SKU,
  INJECTION_SKU,
  INACTIVE_SKU,
]

export const ACTIVE_SKUS: SKUFixture[] = [
  TABLET_SKU,
  CAPSULE_SKU,
  SYRUP_SKU,
  INJECTION_SKU,
]

export const STANDARD_PRODUCT_SKUS: SKUFixture[] = [
  TABLET_SKU,
  CAPSULE_SKU,
  SYRUP_SKU,
  INACTIVE_SKU,
]
