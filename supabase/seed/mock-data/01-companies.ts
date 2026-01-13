/**
 * Task 1.1.6.1: Mock Data Generation - Companies
 * 
 * Generates 75 companies: 15 IPCs + 60 Wholesalers with diverse profiles.
 */

import { seedUUID, daysAgo, randomElement, randomInt } from '../utils'
import {
  CONFIG,
  MOROCCAN_CITIES,
  ZONE_TYPES,
  IPC_PREFIXES,
  IPC_SUFFIXES,
  WHOLESALER_PREFIXES,
  WHOLESALER_SUFFIXES,
} from './00-config'

// ============================================================================
// Types
// ============================================================================

export interface MockCompany {
  id: string
  name: string
  company_type: 'ipc' | 'wholesaler'
  registration_number: string
  address: string
  contact_email: string
  contact_phone: string
  is_active: boolean
  suspended_at: string | null
  suspended_by: string | null
  suspended_reason: string | null
}

// ============================================================================
// Generation Functions
// ============================================================================

function generateCompanyName(type: 'ipc' | 'wholesaler', index: number): string {
  if (type === 'ipc') {
    const prefix = IPC_PREFIXES[index % IPC_PREFIXES.length]
    const suffix = IPC_SUFFIXES[(index + 3) % IPC_SUFFIXES.length]
    return `${prefix}${suffix} ${MOROCCAN_CITIES[index % MOROCCAN_CITIES.length].name}`
  } else {
    const prefix = WHOLESALER_PREFIXES[index % WHOLESALER_PREFIXES.length]
    const suffix = WHOLESALER_SUFFIXES[(index + 2) % WHOLESALER_SUFFIXES.length]
    return `${prefix}${suffix} ${index > 30 ? 'Express' : 'Maroc'}`
  }
}

function generateEmail(name: string): string {
  const domain = name.toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .substring(0, 20)
  return `contact@${domain}.ma`
}

function generatePhone(cityPrefix: string): string {
  const areaCode = cityPrefix === 'CAS' ? '22' : cityPrefix === 'RBT' ? '37' : randomElement(['22', '37', '24', '35', '39', '28'])
  return `+212 5 ${areaCode} ${randomInt(10, 99)} ${randomInt(10, 99)} ${randomInt(10, 99)}`
}

function generateRegistrationNumber(cityPrefix: string, year: number, index: number): string {
  return `RC-${cityPrefix}-${year}-${String(index).padStart(6, '0')}`
}

function generateTaxId(index: number): string {
  return `IF-${String(1000000 + index).padStart(7, '0')}`
}

// ============================================================================
// Generate Companies
// ============================================================================

export function generateCompanies(): MockCompany[] {
  const companies: MockCompany[] = []
  let companyIndex = 1

  // Generate IPCs (15)
  for (let i = 0; i < CONFIG.companies.ipc; i++) {
    const city = MOROCCAN_CITIES[i % MOROCCAN_CITIES.length]
    const zone = randomElement(ZONE_TYPES)
    const foundingYear = randomInt(2010, 2023)
    const isActive = i < 13 // 13 active, 2 inactive
    
    companies.push({
      id: seedUUID('company', companyIndex),
      name: generateCompanyName('ipc', i),
      company_type: 'ipc',
      registration_number: generateRegistrationNumber(city.prefix, foundingYear, companyIndex),
      address: `${randomInt(1, 200)} ${zone}, ${city.name}`,
      contact_phone: generatePhone(city.prefix),
      contact_email: generateEmail(generateCompanyName('ipc', i)),
      is_active: isActive,
      suspended_at: null,
      suspended_by: null,
      suspended_reason: null,
    })
    
    companyIndex++
  }

  // Generate Wholesalers (60)
  for (let i = 0; i < CONFIG.companies.wholesaler; i++) {
    const city = MOROCCAN_CITIES[i % MOROCCAN_CITIES.length]
    const zone = randomElement(ZONE_TYPES)
    const foundingYear = randomInt(2008, 2024)
    const statusRoll = Math.random()
    const isSuspended = statusRoll < 0.05 // 5% suspended
    const isActive = statusRoll > 0.1 && !isSuspended // 90% active, 5% inactive, 5% suspended
    
    companies.push({
      id: seedUUID('company', companyIndex + 100), // Offset for wholesalers
      name: generateCompanyName('wholesaler', i),
      company_type: 'wholesaler',
      registration_number: generateRegistrationNumber(city.prefix, foundingYear, companyIndex + 100),
      address: `${randomInt(1, 300)} ${zone}, ${randomElement(['Secteur A', 'Secteur B', 'Zone Logistique'])}, ${city.name}`,
      contact_phone: generatePhone(city.prefix),
      contact_email: generateEmail(generateCompanyName('wholesaler', i)),
      is_active: isActive,
      suspended_at: isSuspended ? daysAgo(randomInt(10, 100)) : null,
      suspended_by: isSuspended ? seedUUID('user', randomInt(1, 3)) : null,
      suspended_reason: isSuspended ? 'Compliance violation - multiple missed submissions' : null,
    })
    
    companyIndex++
  }

  return companies
}

// Export generated companies
export const MOCK_COMPANIES = generateCompanies()
