/**
 * Task 1.1.6.10: Mock Data Generation - Users
 * 
 * Generates company users for each company and MOH users.
 */

import { seedUUID, randomElement, randomInt } from '../utils'
import { FIRST_NAMES, LAST_NAMES } from './00-config'
import { MOCK_COMPANIES } from './01-companies'

// ============================================================================
// Types
// ============================================================================

export interface MockUser {
  id: string
  email: string
  full_name: string
  role: string
  company_id: string | null
  is_active: boolean
}

// ============================================================================
// Generation Functions
// ============================================================================

function generateEmail(firstName: string, lastName: string, domain: string): string {
  const f = firstName.toLowerCase().replace(/\s+/g, '')
  const l = lastName.toLowerCase().replace(/\s+/g, '').replace(/[^a-z]/g, '')
  return `${f}.${l}@${domain}`
}

// ============================================================================
// Generate Users
// ============================================================================

export function generateUsers(): MockUser[] {
  const users: MockUser[] = []
  let userIndex = 1

  // MOH Tier 1 Users (3)
  for (let i = 0; i < 3; i++) {
    const firstName = randomElement(FIRST_NAMES)
    const lastName = randomElement(LAST_NAMES)
    users.push({
      id: seedUUID('user', userIndex),
      email: `tier1-${i + 1}@moh.gov.ma`,
      full_name: `Dr. ${firstName} ${lastName}`,
      role: 'tier1',
      company_id: null,
      is_active: true,
    })
    userIndex++
  }

  // MOH Tier 2 Officers (5)
  for (let i = 0; i < 5; i++) {
    const firstName = randomElement(FIRST_NAMES)
    const lastName = randomElement(LAST_NAMES)
    users.push({
      id: seedUUID('user', userIndex),
      email: `tier2-officer-${i + 1}@moh.gov.ma`,
      full_name: `${firstName} ${lastName}`,
      role: 'tier2_officer',
      company_id: null,
      is_active: true,
    })
    userIndex++
  }

  // MOH Tier 2 Registrars (3)
  for (let i = 0; i < 3; i++) {
    const firstName = randomElement(FIRST_NAMES)
    const lastName = randomElement(LAST_NAMES)
    users.push({
      id: seedUUID('user', userIndex),
      email: `tier2-registrar-${i + 1}@moh.gov.ma`,
      full_name: `${firstName} ${lastName}`,
      role: 'tier2_registrar',
      company_id: null,
      is_active: true,
    })
    userIndex++
  }

  // System Admin (1)
  users.push({
    id: seedUUID('user', userIndex),
    email: 'admin@pm-system.ma',
    full_name: 'System Administrator',
    role: 'system_admin',
    company_id: null,
    is_active: true,
  })
  userIndex++

  // Company Users
  for (const company of MOCK_COMPANIES) {
    if (!company.is_active) continue

    const companyDomain = company.contact_email.split('@')[1] || `${company.name.toLowerCase().replace(/\s+/g, '-')}.ma`

    // Company Admin (1 per company)
    const adminFirst = randomElement(FIRST_NAMES)
    const adminLast = randomElement(LAST_NAMES)
    users.push({
      id: seedUUID('user', userIndex),
      email: generateEmail(adminFirst, adminLast, companyDomain),
      full_name: `${adminFirst} ${adminLast}`,
      role: 'company_admin',
      company_id: company.id,
      is_active: true,
    })
    userIndex++

    // Company Managers (1-2 per company)
    const managerCount = company.company_type === 'ipc' ? 2 : 1
    for (let m = 0; m < managerCount; m++) {
      const mgrFirst = randomElement(FIRST_NAMES)
      const mgrLast = randomElement(LAST_NAMES)
      users.push({
        id: seedUUID('user', userIndex),
        email: generateEmail(mgrFirst, mgrLast, companyDomain),
        full_name: `${mgrFirst} ${mgrLast}`,
        role: 'company_manager',
        company_id: company.id,
        is_active: true,
      })
      userIndex++
    }

    // Company Users (1-3 per company)
    const userCount = randomInt(1, 3)
    for (let u = 0; u < userCount; u++) {
      const usrFirst = randomElement(FIRST_NAMES)
      const usrLast = randomElement(LAST_NAMES)
      users.push({
        id: seedUUID('user', userIndex),
        email: generateEmail(usrFirst, usrLast, companyDomain),
        full_name: `${usrFirst} ${usrLast}`,
        role: 'company_user',
        company_id: company.id,
        is_active: Math.random() > 0.1, // 90% active
      })
      userIndex++
    }
  }

  return users
}

export const MOCK_USERS = generateUsers()

// Separate MOH and Company users for proper seeding order
export const MOCK_MOH_USERS = MOCK_USERS.filter(u => u.company_id === null)
export const MOCK_COMPANY_USERS = MOCK_USERS.filter(u => u.company_id !== null)
