/**
 * Task 1.1.6.14: Mock Data Completeness Verification
 * Task 1.1.6.15: Database Seed Data Validation Script
 * 
 * Validates foreign key integrity, constraint validation, and data quality checks.
 */

import { supabase, log, logSection } from '../utils'
import { MOCK_COMPANIES } from './01-companies'
import { MOCK_PRODUCTS, MOCK_SKUS } from './02-products'
import { MOCK_USERS } from './05-users'
import { MOCK_AAMS_SUBMISSIONS, MOCK_MSQ_SUBMISSIONS, MOCK_WSL_SUBMISSIONS } from './06-vci-submissions'
import { MOCK_THRESHOLDS } from './07-thresholds'
import { MOCK_BREACHES } from './09-breaches'

// ============================================================================
// Types
// ============================================================================

interface ValidationResult {
  check: string
  passed: boolean
  message: string
  details?: string[]
}

// ============================================================================
// Validation Functions
// ============================================================================

function validateForeignKeys(): ValidationResult[] {
  const results: ValidationResult[] = []

  // Check product -> company FK
  const productCompanyIds = new Set(MOCK_PRODUCTS.map(p => p.company_id))
  const companyIds = new Set(MOCK_COMPANIES.map(c => c.id))
  const invalidProductCompanies = [...productCompanyIds].filter(id => !companyIds.has(id))
  
  results.push({
    check: 'Product -> Company FK',
    passed: invalidProductCompanies.length === 0,
    message: invalidProductCompanies.length === 0 
      ? 'All products reference valid companies'
      : `${invalidProductCompanies.length} products have invalid company references`,
    details: invalidProductCompanies,
  })

  // Check SKU -> Product FK
  const skuProductIds = new Set(MOCK_SKUS.map(s => s.product_id))
  const productIds = new Set(MOCK_PRODUCTS.map(p => p.id))
  const invalidSKUProducts = [...skuProductIds].filter(id => !productIds.has(id))
  
  results.push({
    check: 'SKU -> Product FK',
    passed: invalidSKUProducts.length === 0,
    message: invalidSKUProducts.length === 0 
      ? 'All SKUs reference valid products'
      : `${invalidSKUProducts.length} SKUs have invalid product references`,
    details: invalidSKUProducts,
  })

  // Check User -> Company FK (for company users)
  const companyUserCompanyIds = MOCK_USERS
    .filter(u => u.company_id !== null)
    .map(u => u.company_id!)
  const invalidUserCompanies = companyUserCompanyIds.filter(id => !companyIds.has(id))
  
  results.push({
    check: 'User -> Company FK',
    passed: invalidUserCompanies.length === 0,
    message: invalidUserCompanies.length === 0 
      ? 'All company users reference valid companies'
      : `${invalidUserCompanies.length} users have invalid company references`,
    details: invalidUserCompanies as string[],
  })

  // Check AAMS -> Company FK
  const aamsCompanyIds = new Set(MOCK_AAMS_SUBMISSIONS.map(a => a.company_id))
  const invalidAAMSCompanies = [...aamsCompanyIds].filter(id => !companyIds.has(id))
  
  results.push({
    check: 'AAMS -> Company FK',
    passed: invalidAAMSCompanies.length === 0,
    message: invalidAAMSCompanies.length === 0 
      ? 'All AAMS submissions reference valid companies'
      : `${invalidAAMSCompanies.length} AAMS submissions have invalid company references`,
  })

  // Check Threshold -> SKU FK
  const thresholdSKUIds = new Set(MOCK_THRESHOLDS.map(t => t.sku_id))
  const skuIds = new Set(MOCK_SKUS.map(s => s.id))
  const invalidThresholdSKUs = [...thresholdSKUIds].filter(id => !skuIds.has(id))
  
  results.push({
    check: 'Threshold -> SKU FK',
    passed: invalidThresholdSKUs.length === 0,
    message: invalidThresholdSKUs.length === 0 
      ? 'All thresholds reference valid SKUs'
      : `${invalidThresholdSKUs.length} thresholds have invalid SKU references`,
  })

  return results
}

function validateConstraints(): ValidationResult[] {
  const results: ValidationResult[] = []

  // Check unique company registration numbers
  const regNumbers = MOCK_COMPANIES.map(c => c.registration_number)
  const uniqueRegNumbers = new Set(regNumbers)
  results.push({
    check: 'Unique Company Registration Numbers',
    passed: regNumbers.length === uniqueRegNumbers.size,
    message: regNumbers.length === uniqueRegNumbers.size
      ? 'All registration numbers are unique'
      : `${regNumbers.length - uniqueRegNumbers.size} duplicate registration numbers found`,
  })

  // Check unique user emails
  const emails = MOCK_USERS.map(u => u.email)
  const uniqueEmails = new Set(emails)
  results.push({
    check: 'Unique User Emails',
    passed: emails.length === uniqueEmails.size,
    message: emails.length === uniqueEmails.size
      ? 'All user emails are unique'
      : `${emails.length - uniqueEmails.size} duplicate emails found`,
  })

  // Check SKU codes are unique
  const skuCodes = MOCK_SKUS.map(s => s.sku_code)
  const uniqueSKUCodes = new Set(skuCodes)
  results.push({
    check: 'Unique SKU Codes',
    passed: skuCodes.length === uniqueSKUCodes.size,
    message: skuCodes.length === uniqueSKUCodes.size
      ? 'All SKU codes are unique'
      : `${skuCodes.length - uniqueSKUCodes.size} duplicate SKU codes found`,
  })

  // Check company is_active is boolean
  const invalidCompanyActive = MOCK_COMPANIES.filter(c => typeof c.is_active !== 'boolean')
  results.push({
    check: 'Valid Company is_active',
    passed: invalidCompanyActive.length === 0,
    message: invalidCompanyActive.length === 0
      ? 'All companies have valid is_active boolean'
      : `${invalidCompanyActive.length} companies have invalid is_active`,
  })

  // Check positive threshold values
  const negativeThresholds = MOCK_THRESHOLDS.filter(t => t.threshold_value <= 0)
  results.push({
    check: 'Positive Threshold Values',
    passed: negativeThresholds.length === 0,
    message: negativeThresholds.length === 0
      ? 'All thresholds have positive values'
      : `${negativeThresholds.length} thresholds have non-positive values`,
  })

  return results
}

function validateDataQuality(): ValidationResult[] {
  const results: ValidationResult[] = []

  // Check companies have users
  const companiesWithUsers = new Set(MOCK_USERS.filter(u => u.company_id).map(u => u.company_id))
  const activeCompanies = MOCK_COMPANIES.filter(c => c.is_active)
  const companiesWithoutUsers = activeCompanies.filter(c => !companiesWithUsers.has(c.id))
  
  results.push({
    check: 'Active Companies Have Users',
    passed: companiesWithoutUsers.length === 0,
    message: companiesWithoutUsers.length === 0
      ? 'All active companies have at least one user'
      : `${companiesWithoutUsers.length} active companies have no users`,
  })

  // Check IPCs have products
  const companiesWithProducts = new Set(MOCK_PRODUCTS.map(p => p.company_id))
  const ipcs = MOCK_COMPANIES.filter(c => c.company_type === 'ipc' && c.is_active)
  const ipcsWithoutProducts = ipcs.filter(c => !companiesWithProducts.has(c.id))
  
  results.push({
    check: 'Active IPCs Have Products',
    passed: ipcsWithoutProducts.length === 0,
    message: ipcsWithoutProducts.length === 0
      ? 'All active IPCs have products'
      : `${ipcsWithoutProducts.length} active IPCs have no products`,
  })

  // Check products have SKUs
  const productsWithSKUs = new Set(MOCK_SKUS.map(s => s.product_id))
  const productsWithoutSKUs = MOCK_PRODUCTS.filter(p => !productsWithSKUs.has(p.id))
  
  results.push({
    check: 'Products Have SKUs',
    passed: productsWithoutSKUs.length === 0,
    message: productsWithoutSKUs.length === 0
      ? 'All products have at least one SKU'
      : `${productsWithoutSKUs.length} products have no SKUs`,
  })

  // Check AAMS values are reasonable
  const unreasonableAAMS = MOCK_AAMS_SUBMISSIONS.filter(a => a.aams_value < 1000 || a.aams_value > 100000000)
  results.push({
    check: 'Reasonable AAMS Values',
    passed: unreasonableAAMS.length === 0,
    message: unreasonableAAMS.length === 0
      ? 'All AAMS values are within reasonable range'
      : `${unreasonableAAMS.length} AAMS submissions have extreme values`,
  })

  // Check breach priorities match critical medicine status
  const criticalMismatch = MOCK_BREACHES.filter(b => 
    b.is_critical_medicine && b.priority === 'low'
  )
  results.push({
    check: 'Critical Medicine Breach Priority',
    passed: criticalMismatch.length === 0,
    message: criticalMismatch.length === 0
      ? 'Critical medicine breaches have appropriate priority'
      : `${criticalMismatch.length} critical medicine breaches have low priority`,
  })

  return results
}

// ============================================================================
// Main Validation
// ============================================================================

export async function runValidation(): Promise<{ passed: boolean; results: ValidationResult[] }> {
  logSection('Running Mock Data Validation')
  
  const allResults: ValidationResult[] = [
    ...validateForeignKeys(),
    ...validateConstraints(),
    ...validateDataQuality(),
  ]

  const passed = allResults.filter(r => r.passed).length
  const failed = allResults.filter(r => !r.passed).length

  console.log('\n📋 Validation Results:')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  
  for (const result of allResults) {
    const icon = result.passed ? '✅' : '❌'
    console.log(`${icon} ${result.check}: ${result.message}`)
  }

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log(`\n📊 Summary: ${passed} passed, ${failed} failed`)

  const allPassed = failed === 0
  if (allPassed) {
    log('All validation checks passed!', 'success')
  } else {
    log('Some validation checks failed. Review the results above.', 'error')
  }

  return { passed: allPassed, results: allResults }
}

// Run if executed directly
if (require.main === module) {
  runValidation()
    .then((result) => {
      process.exit(result.passed ? 0 : 1)
    })
    .catch((error) => {
      console.error(error)
      process.exit(1)
    })
}
