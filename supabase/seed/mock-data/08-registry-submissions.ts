/**
 * Task 1.1.6.11: Mock Data Generation - Registry Submissions
 * 
 * Generates historical registry submission workflows.
 */

import { seedUUID, randomInt, randomElement, daysAgo } from '../utils'
// randomInt is already imported
import { MOCK_COMPANIES } from './01-companies'
import { MOCK_PRODUCTS } from './02-products'

// ============================================================================
// Types - Aligned with actual database schema
// ============================================================================

export interface MockRegistrySubmission {
  id: string
  submission_type: string
  entity_type: 'company' | 'product' | 'sku'
  entity_id: string | null
  company_id: string | null
  submission_data: Record<string, unknown>
  status: 'draft' | 'submitted' | 'tier2_verified' | 'tier1_approved' | 'tier2_implemented' | 'completed' | 'rejected'
  submitted_by: string
  submitted_at: string | null
  verified_by: string | null
  approved_by: string | null
  implemented_by: string | null
  rejection_reason: string | null
}

// ============================================================================
// Generate Registry Submissions
// ============================================================================

export function generateRegistrySubmissions(): MockRegistrySubmission[] {
  const submissions: MockRegistrySubmission[] = []
  let index = 1

  // Generate historical submissions for active companies
  for (const company of MOCK_COMPANIES) {
    if (company.is_active) {
      submissions.push({
        id: seedUUID('registry-sub', index),
        submission_type: 'company_create',
        entity_type: 'company',
        entity_id: company.id,
        company_id: company.id,
        submission_data: {
          name: company.name,
          company_type: company.company_type,
          address: company.address,
          contact_email: company.contact_email,
        },
        status: 'completed',
        submitted_by: seedUUID('user', randomInt(1, 12)), // Use MOH users that exist
        submitted_at: daysAgo(randomInt(100, 500)),
        verified_by: seedUUID('user', randomInt(4, 8)),
        approved_by: seedUUID('user', randomInt(1, 3)),
        implemented_by: seedUUID('user', randomInt(9, 11)),
        rejection_reason: null,
      })
      index++
    }

    // Inactive company submissions (pending approval)
    if (!company.is_active && !company.suspended_at) {
      submissions.push({
        id: seedUUID('registry-sub', index),
        submission_type: 'company_create',
        entity_type: 'company',
        entity_id: company.id,
        company_id: company.id,
        submission_data: {
          name: company.name,
          company_type: company.company_type,
          address: company.address,
        },
        status: 'submitted',
        submitted_by: seedUUID('user', randomInt(1, 12)), // Use MOH users that exist
        submitted_at: daysAgo(randomInt(5, 30)),
        verified_by: null,
        approved_by: null,
        implemented_by: null,
        rejection_reason: null,
      })
      index++
    }
  }

  // Generate product submissions
  for (const product of MOCK_PRODUCTS) {
    const company = MOCK_COMPANIES.find(c => c.id === product.company_id)
    if (!company || !company.is_active) continue

    submissions.push({
      id: seedUUID('registry-sub', index),
      submission_type: 'product_create',
      entity_type: 'product',
      entity_id: product.id,
      company_id: company.id,
      submission_data: {
        name: product.name,
        description: product.description,
        is_critical_medicine: product.is_critical_medicine,
      },
      status: 'completed',
      submitted_by: seedUUID('user', randomInt(1, 12)), // Use MOH users that exist
      submitted_at: daysAgo(randomInt(100, 500)),
      verified_by: seedUUID('user', randomInt(4, 8)),
      approved_by: seedUUID('user', randomInt(1, 3)),
      implemented_by: seedUUID('user', randomInt(9, 11)),
      rejection_reason: null,
    })
    index++
  }

  // Generate some recent/in-progress submissions
  const recentStatuses: MockRegistrySubmission['status'][] = [
    'submitted', 'tier2_verified', 'tier1_approved'
  ]

  const activeCompanies = MOCK_COMPANIES.filter(c => c.is_active)
  
  for (let i = 0; i < 20; i++) {
    if (activeCompanies.length === 0) break
    const company = randomElement(activeCompanies)
    const submissionType = randomElement(['company_update', 'product_update', 'sku_create'] as const)
    const status = randomElement(recentStatuses)

    submissions.push({
      id: seedUUID('registry-sub', index),
      submission_type: submissionType,
      entity_type: submissionType.includes('company') ? 'company' : submissionType.includes('product') ? 'product' : 'sku',
      entity_id: company.id,
      company_id: company.id,
      submission_data: { updated_field: 'sample_data' },
      status,
      submitted_by: seedUUID('user', randomInt(1, 12)), // Use MOH users that exist
      submitted_at: daysAgo(randomInt(1, 30)),
      verified_by: status !== 'submitted' ? seedUUID('user', randomInt(4, 8)) : null,
      approved_by: status === 'tier1_approved' ? seedUUID('user', randomInt(1, 3)) : null,
      implemented_by: null,
      rejection_reason: null,
    })
    index++
  }

  // Add some rejected submissions
  for (let i = 0; i < 10; i++) {
    if (activeCompanies.length === 0) break
    const company = randomElement(activeCompanies)

    submissions.push({
      id: seedUUID('registry-sub', index),
      submission_type: randomElement(['product_create', 'product_update'] as const),
      entity_type: 'product',
      entity_id: seedUUID('product', 1000 + i),
      company_id: company.id,
      submission_data: { rejected_data: 'sample' },
      status: 'rejected',
      submitted_by: seedUUID('user', randomInt(1, 12)), // Use MOH users that exist
      submitted_at: daysAgo(randomInt(30, 180)),
      verified_by: seedUUID('user', randomInt(4, 8)),
      approved_by: null,
      implemented_by: null,
      rejection_reason: randomElement([
        'Incomplete documentation',
        'Missing regulatory approval certificate',
        'Data inconsistencies found',
        'Quality certification expired',
        'Manufacturing facility not compliant',
      ]),
    })
    index++
  }

  return submissions
}

export const MOCK_REGISTRY_SUBMISSIONS = generateRegistrySubmissions()
