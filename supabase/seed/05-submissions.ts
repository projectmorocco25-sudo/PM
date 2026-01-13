/**
 * Task 1.1.1.23: VCI Submission Seed Data
 * 
 * Creates sample AAMS, MSQ, and WSL submissions.
 */

import { log, seedUUID, batchInsert, daysAgo, startOfMonth, startOfWeek, randomInt } from './utils'

// ============================================================================
// Submission Definitions
// ============================================================================

interface AAMSSubmission {
  id: string
  company_id: string
  sku_id: string
  year: number
  average_monthly_sales: number
  status: 'draft' | 'submitted' | 'verified' | 'rejected'
  submitted_at: string | null
  verified_by: string | null
  verified_at: string | null
}

interface MSQSubmission {
  id: string
  company_id: string
  sku_id: string
  month: string
  quantity_sold: number
  status: 'draft' | 'submitted' | 'verified' | 'rejected'
  submitted_at: string | null
}

interface WSLSubmission {
  id: string
  company_id: string
  sku_id: string
  week_ending: string
  opening_stock: number
  closing_stock: number
  units_received: number
  units_sold: number
  status: 'draft' | 'submitted' | 'verified' | 'rejected'
  submitted_at: string | null
}

// AAMS submissions for 2025
const AAMS_SUBMISSIONS: AAMSSubmission[] = [
  // Pharma Industries Morocco (company 1)
  {
    id: seedUUID('aams', 1),
    company_id: seedUUID('company', 1),
    sku_id: seedUUID('sku', 1), // PARA-500-20
    year: 2025,
    average_monthly_sales: 15000,
    status: 'verified',
    submitted_at: daysAgo(60),
    verified_by: seedUUID('user', 3),
    verified_at: daysAgo(55),
  },
  {
    id: seedUUID('aams', 2),
    company_id: seedUUID('company', 1),
    sku_id: seedUUID('sku', 2), // PARA-500-30
    year: 2025,
    average_monthly_sales: 8000,
    status: 'verified',
    submitted_at: daysAgo(60),
    verified_by: seedUUID('user', 3),
    verified_at: daysAgo(55),
  },
  {
    id: seedUUID('aams', 3),
    company_id: seedUUID('company', 1),
    sku_id: seedUUID('sku', 10), // AMOX-500-12
    year: 2025,
    average_monthly_sales: 5000,
    status: 'verified',
    submitted_at: daysAgo(60),
    verified_by: seedUUID('user', 3),
    verified_at: daysAgo(55),
  },
  
  // MedLab Morocco (company 2)
  {
    id: seedUUID('aams', 10),
    company_id: seedUUID('company', 2),
    sku_id: seedUUID('sku', 30), // METF-500-30
    year: 2025,
    average_monthly_sales: 12000,
    status: 'verified',
    submitted_at: daysAgo(45),
    verified_by: seedUUID('user', 4),
    verified_at: daysAgo(40),
  },
  {
    id: seedUUID('aams', 11),
    company_id: seedUUID('company', 2),
    sku_id: seedUUID('sku', 40), // AMLO-5-30
    year: 2025,
    average_monthly_sales: 9000,
    status: 'submitted',
    submitted_at: daysAgo(5),
    verified_by: null,
    verified_at: null,
  },
]

// MSQ submissions for recent months
const MSQ_SUBMISSIONS: MSQSubmission[] = [
  // Pharma Industries - December 2025
  {
    id: seedUUID('msq', 1),
    company_id: seedUUID('company', 1),
    sku_id: seedUUID('sku', 1),
    month: startOfMonth(1),
    quantity_sold: 14500,
    status: 'verified',
    submitted_at: daysAgo(20),
  },
  {
    id: seedUUID('msq', 2),
    company_id: seedUUID('company', 1),
    sku_id: seedUUID('sku', 2),
    month: startOfMonth(1),
    quantity_sold: 7800,
    status: 'verified',
    submitted_at: daysAgo(20),
  },
  
  // MedLab - December 2025
  {
    id: seedUUID('msq', 10),
    company_id: seedUUID('company', 2),
    sku_id: seedUUID('sku', 30),
    month: startOfMonth(1),
    quantity_sold: 11500,
    status: 'submitted',
    submitted_at: daysAgo(10),
  },
]

// WSL submissions for recent weeks
const WSL_SUBMISSIONS: WSLSubmission[] = [
  // Pharma Industries - Last week
  {
    id: seedUUID('wsl', 1),
    company_id: seedUUID('company', 1),
    sku_id: seedUUID('sku', 1),
    week_ending: startOfWeek(0),
    opening_stock: 50000,
    closing_stock: 46500,
    units_received: 0,
    units_sold: 3500,
    status: 'submitted',
    submitted_at: daysAgo(1),
  },
  {
    id: seedUUID('wsl', 2),
    company_id: seedUUID('company', 1),
    sku_id: seedUUID('sku', 2),
    week_ending: startOfWeek(0),
    opening_stock: 25000,
    closing_stock: 23100,
    units_received: 0,
    units_sold: 1900,
    status: 'submitted',
    submitted_at: daysAgo(1),
  },
  
  // Pharma Industries - Two weeks ago
  {
    id: seedUUID('wsl', 3),
    company_id: seedUUID('company', 1),
    sku_id: seedUUID('sku', 1),
    week_ending: startOfWeek(1),
    opening_stock: 53500,
    closing_stock: 50000,
    units_received: 0,
    units_sold: 3500,
    status: 'verified',
    submitted_at: daysAgo(8),
  },
  
  // MedLab - Last week
  {
    id: seedUUID('wsl', 10),
    company_id: seedUUID('company', 2),
    sku_id: seedUUID('sku', 30),
    week_ending: startOfWeek(0),
    opening_stock: 40000,
    closing_stock: 37200,
    units_received: 0,
    units_sold: 2800,
    status: 'submitted',
    submitted_at: daysAgo(1),
  },
]

// ============================================================================
// Seed Function
// ============================================================================

export async function seedSubmissions(): Promise<void> {
  log(`Preparing submissions: ${AAMS_SUBMISSIONS.length} AAMS, ${MSQ_SUBMISSIONS.length} MSQ, ${WSL_SUBMISSIONS.length} WSL...`)
  
  await batchInsert('aams_submissions', AAMS_SUBMISSIONS, { onConflict: 'id' })
  await batchInsert('msq_submissions', MSQ_SUBMISSIONS, { onConflict: 'id' })
  await batchInsert('wsl_submissions', WSL_SUBMISSIONS, { onConflict: 'id' })
  
  log(`Submissions seeded successfully`, 'success')
}
