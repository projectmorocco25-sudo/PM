/**
 * Task 1.1.7.0c: Test Helper Functions
 * 
 * Utility functions for test data creation, assertions, and API testing.
 */

import { SupabaseClient } from '@supabase/supabase-js'
import { createServiceClient } from './test-database'

// ============================================================================
// Types
// ============================================================================

export interface TestCompany {
  id?: string
  name: string
  type: 'ipc' | 'wholesaler'
  registration_number?: string
  status?: 'active' | 'pending' | 'suspended'
}

export interface TestProduct {
  id?: string
  company_id: string
  name: string
  generic_name: string
  atc_code?: string
  is_critical_medicine?: boolean
  status?: 'active' | 'pending' | 'discontinued'
}

export interface TestSKU {
  id?: string
  product_id: string
  sku_code: string
  dosage_form?: string
  dosage_strength?: string
  pack_size?: string
  status?: 'active' | 'pending' | 'discontinued'
}

export interface TestSubmission {
  company_id: string
  year: number
  month?: number
  submission_data: Array<{ sku_id: string; quantity: number }>
}

// ============================================================================
// ID Generation
// ============================================================================

let idCounter = 0

/**
 * Generates a unique test ID
 */
export function generateTestId(prefix: string = 'test'): string {
  idCounter++
  return `${prefix}_${Date.now()}_${idCounter}`
}

/**
 * Generates a UUID-like test ID
 */
export function generateTestUUID(): string {
  const hex = (Math.random() * 0xffffffff).toString(16).padStart(8, '0')
  return `${hex.slice(0, 8)}-${hex.slice(0, 4)}-4${hex.slice(1, 4)}-8${hex.slice(0, 3)}-${hex}0000`
}

// ============================================================================
// Test Data Factories
// ============================================================================

/**
 * Creates a test company
 */
export async function createTestCompany(
  client: SupabaseClient,
  data: Partial<TestCompany> = {}
): Promise<TestCompany & { id: string }> {
  const company = {
    id: data.id || generateTestUUID(),
    name: data.name || `Test Company ${generateTestId()}`,
    type: data.type || 'ipc',
    registration_number: data.registration_number || `REG-${generateTestId()}`,
    tax_id: `TAX-${generateTestId()}`,
    city: 'Casablanca',
    address: 'Test Address',
    phone: '+212 5 22 00 00 00',
    email: `test-${generateTestId()}@example.com`,
    status: data.status || 'active',
  }

  const { error } = await client.from('companies').insert(company)
  if (error) throw new Error(`Failed to create test company: ${error.message}`)

  return company as TestCompany & { id: string }
}

/**
 * Creates a test product
 */
export async function createTestProduct(
  client: SupabaseClient,
  data: Partial<TestProduct> & { company_id: string }
): Promise<TestProduct & { id: string }> {
  const product = {
    id: data.id || generateTestUUID(),
    company_id: data.company_id,
    name: data.name || `Test Product ${generateTestId()}`,
    generic_name: data.generic_name || 'Test Generic',
    therapeutic_class: 'Test Class',
    atc_code: data.atc_code || 'N02BE01',
    is_critical_medicine: data.is_critical_medicine ?? false,
    status: data.status || 'active',
  }

  const { error } = await client.from('products').insert(product)
  if (error) throw new Error(`Failed to create test product: ${error.message}`)

  return product as TestProduct & { id: string }
}

/**
 * Creates a test SKU
 */
export async function createTestSKU(
  client: SupabaseClient,
  data: Partial<TestSKU> & { product_id: string }
): Promise<TestSKU & { id: string }> {
  const sku = {
    id: data.id || generateTestUUID(),
    product_id: data.product_id,
    sku_code: data.sku_code || `SKU-${generateTestId()}`,
    dosage_form: data.dosage_form || 'Tablet',
    dosage_strength: data.dosage_strength || '500mg',
    pack_size: data.pack_size || '30 tablets',
    unit_of_measure: 'tablets',
    pack_count: 30,
    unit_price: 25.00,
    status: data.status || 'active',
  }

  const { error } = await client.from('skus').insert(sku)
  if (error) throw new Error(`Failed to create test SKU: ${error.message}`)

  return sku as TestSKU & { id: string }
}

/**
 * Creates a complete test data set (company + products + SKUs)
 */
export async function createTestDataSet(
  client: SupabaseClient,
  options: {
    productCount?: number
    skusPerProduct?: number
    companyType?: 'ipc' | 'wholesaler'
  } = {}
): Promise<{
  company: TestCompany & { id: string }
  products: Array<TestProduct & { id: string }>
  skus: Array<TestSKU & { id: string }>
}> {
  const { productCount = 2, skusPerProduct = 3, companyType = 'ipc' } = options

  const company = await createTestCompany(client, { type: companyType })
  const products: Array<TestProduct & { id: string }> = []
  const skus: Array<TestSKU & { id: string }> = []

  for (let p = 0; p < productCount; p++) {
    const product = await createTestProduct(client, {
      company_id: company.id,
      name: `Test Product ${p + 1}`,
    })
    products.push(product)

    for (let s = 0; s < skusPerProduct; s++) {
      const sku = await createTestSKU(client, {
        product_id: product.id,
        sku_code: `SKU-${product.id.slice(0, 8)}-${s + 1}`,
      })
      skus.push(sku)
    }
  }

  return { company, products, skus }
}

// ============================================================================
// VCI Submission Helpers
// ============================================================================

/**
 * Creates a test AAMS submission
 */
export async function createTestAAMS(
  client: SupabaseClient,
  data: TestSubmission
): Promise<{ id: string }> {
  const aams = {
    id: generateTestUUID(),
    company_id: data.company_id,
    year: data.year,
    submission_data: data.submission_data,
    aams_value: data.submission_data.reduce((acc, d) => acc + d.quantity, 0),
    status: 'submitted',
    submitted_at: new Date().toISOString(),
    is_late: false,
  }

  const { error } = await client.from('aams_submissions').insert(aams)
  if (error) throw new Error(`Failed to create test AAMS: ${error.message}`)

  return { id: aams.id }
}

/**
 * Creates a test MSQ submission
 */
export async function createTestMSQ(
  client: SupabaseClient,
  data: TestSubmission & { month: number }
): Promise<{ id: string }> {
  const msq = {
    id: generateTestUUID(),
    company_id: data.company_id,
    year: data.year,
    month: data.month,
    submission_data: data.submission_data,
    total_quantity: data.submission_data.reduce((acc, d) => acc + d.quantity, 0),
    status: 'submitted',
    submitted_at: new Date().toISOString(),
  }

  const { error } = await client.from('msq_submissions').insert(msq)
  if (error) throw new Error(`Failed to create test MSQ: ${error.message}`)

  return { id: msq.id }
}

// ============================================================================
// Assertion Helpers
// ============================================================================

/**
 * Asserts that a database record exists
 */
export async function assertRecordExists(
  client: SupabaseClient,
  table: string,
  id: string
): Promise<void> {
  const { data, error } = await client.from(table).select('id').eq('id', id).single()
  
  if (error || !data) {
    throw new Error(`Expected record ${id} to exist in ${table}`)
  }
}

/**
 * Asserts that a database record does not exist
 */
export async function assertRecordNotExists(
  client: SupabaseClient,
  table: string,
  id: string
): Promise<void> {
  const { data } = await client.from(table).select('id').eq('id', id).single()
  
  if (data) {
    throw new Error(`Expected record ${id} to not exist in ${table}`)
  }
}

/**
 * Asserts RPC function success
 */
export async function assertRPCSuccess<T>(
  client: SupabaseClient,
  functionName: string,
  params: Record<string, unknown>
): Promise<T> {
  const { data, error } = await client.rpc(functionName, params)
  
  if (error) {
    throw new Error(`RPC ${functionName} failed: ${error.message}`)
  }
  
  return data as T
}

/**
 * Asserts RPC function failure
 */
export async function assertRPCFailure(
  client: SupabaseClient,
  functionName: string,
  params: Record<string, unknown>,
  expectedErrorCode?: string
): Promise<void> {
  const { error } = await client.rpc(functionName, params)
  
  if (!error) {
    throw new Error(`Expected RPC ${functionName} to fail`)
  }
  
  if (expectedErrorCode && !error.message.includes(expectedErrorCode)) {
    throw new Error(`Expected error code ${expectedErrorCode}, got: ${error.message}`)
  }
}

// ============================================================================
// Cleanup Helpers
// ============================================================================

/**
 * Deletes test records from a table
 */
export async function cleanupTable(
  client: SupabaseClient,
  table: string,
  ids: string[]
): Promise<void> {
  if (ids.length === 0) return
  
  const { error } = await client.from(table).delete().in('id', ids)
  if (error) {
    console.warn(`Cleanup warning for ${table}: ${error.message}`)
  }
}

/**
 * Cleanup context for tracking created resources
 */
export class CleanupTracker {
  private resources: Map<string, string[]> = new Map()
  private client: SupabaseClient

  constructor() {
    this.client = createServiceClient()
  }

  track(table: string, id: string): void {
    if (!this.resources.has(table)) {
      this.resources.set(table, [])
    }
    this.resources.get(table)!.push(id)
  }

  async cleanup(): Promise<void> {
    // Clean up in reverse dependency order
    const order = [
      'breach_analyses',
      'breaches',
      'wsl_submissions',
      'msq_submissions',
      'aams_submissions',
      'thresholds',
      'registry_submissions',
      'skus',
      'products',
      'companies',
    ]

    for (const table of order) {
      const ids = this.resources.get(table) || []
      await cleanupTable(this.client, table, ids)
    }
  }
}
