/**
 * Task 1.1.1.23: Company Seed Data
 * 
 * Creates IPCs (pharmaceutical manufacturers) and wholesalers.
 */

import { log, seedUUID, batchInsert, daysAgo } from './utils'

// ============================================================================
// Company Definitions
// ============================================================================

interface Company {
  id: string
  name: string
  type: 'ipc' | 'wholesaler'
  registration_number: string
  tax_id: string
  address: string
  city: string
  phone: string
  email: string
  status: 'active' | 'pending' | 'suspended'
  approved_at: string | null
  approved_by: string | null
}

const COMPANIES: Company[] = [
  // IPCs (Industrial Pharmaceutical Companies / Manufacturers)
  {
    id: seedUUID('company', 1),
    name: 'Pharma Industries Morocco',
    type: 'ipc',
    registration_number: 'RC-CAS-2015-001234',
    tax_id: 'IF-1234567',
    address: '123 Zone Industrielle, Bouskoura',
    city: 'Casablanca',
    phone: '+212 5 22 XX XX XX',
    email: 'contact@pharma-industries.ma',
    status: 'active',
    approved_at: daysAgo(365),
    approved_by: seedUUID('user', 1),
  },
  {
    id: seedUUID('company', 2),
    name: 'MedLab Morocco',
    type: 'ipc',
    registration_number: 'RC-RBT-2018-005678',
    tax_id: 'IF-2345678',
    address: '45 Avenue Hassan II',
    city: 'Rabat',
    phone: '+212 5 37 XX XX XX',
    email: 'contact@medlab.ma',
    status: 'active',
    approved_at: daysAgo(300),
    approved_by: seedUUID('user', 1),
  },
  {
    id: seedUUID('company', 3),
    name: 'BioPharm Maroc',
    type: 'ipc',
    registration_number: 'RC-TNG-2020-009012',
    tax_id: 'IF-3456789',
    address: '78 Zone Franche',
    city: 'Tanger',
    phone: '+212 5 39 XX XX XX',
    email: 'contact@biopharm.ma',
    status: 'active',
    approved_at: daysAgo(200),
    approved_by: seedUUID('user', 2),
  },
  {
    id: seedUUID('company', 4),
    name: 'GeneriMed SARL',
    type: 'ipc',
    registration_number: 'RC-FES-2021-003456',
    tax_id: 'IF-4567890',
    address: '12 Quartier Industriel',
    city: 'Fès',
    phone: '+212 5 35 XX XX XX',
    email: 'contact@generimed.ma',
    status: 'active',
    approved_at: daysAgo(150),
    approved_by: seedUUID('user', 1),
  },
  {
    id: seedUUID('company', 5),
    name: 'Atlas Pharmaceuticals',
    type: 'ipc',
    registration_number: 'RC-MRK-2019-007890',
    tax_id: 'IF-5678901',
    address: '56 Boulevard Mohammed V',
    city: 'Marrakech',
    phone: '+212 5 24 XX XX XX',
    email: 'contact@atlas-pharma.ma',
    status: 'pending',
    approved_at: null,
    approved_by: null,
  },
  
  // Wholesalers
  {
    id: seedUUID('company', 10),
    name: 'PharmaDist',
    type: 'wholesaler',
    registration_number: 'RC-CAS-2010-002345',
    tax_id: 'IF-6789012',
    address: '234 Zone Logistique, Ain Sebaa',
    city: 'Casablanca',
    phone: '+212 5 22 XX XX XX',
    email: 'contact@pharmadist.ma',
    status: 'active',
    approved_at: daysAgo(500),
    approved_by: seedUUID('user', 1),
  },
  {
    id: seedUUID('company', 11),
    name: 'MedSupply Maroc',
    type: 'wholesaler',
    registration_number: 'RC-CAS-2012-004567',
    tax_id: 'IF-7890123',
    address: '89 Zone Industrielle Moulay Rachid',
    city: 'Casablanca',
    phone: '+212 5 22 XX XX XX',
    email: 'contact@medsupply.ma',
    status: 'active',
    approved_at: daysAgo(400),
    approved_by: seedUUID('user', 1),
  },
  {
    id: seedUUID('company', 12),
    name: 'DistriPharma Nord',
    type: 'wholesaler',
    registration_number: 'RC-TNG-2015-006789',
    tax_id: 'IF-8901234',
    address: '34 Zone Industrielle',
    city: 'Tanger',
    phone: '+212 5 39 XX XX XX',
    email: 'contact@distripharma-nord.ma',
    status: 'active',
    approved_at: daysAgo(350),
    approved_by: seedUUID('user', 2),
  },
  {
    id: seedUUID('company', 13),
    name: 'SudPharma Distribution',
    type: 'wholesaler',
    registration_number: 'RC-AGA-2017-008901',
    tax_id: 'IF-9012345',
    address: '67 Zone Industrielle Tassila',
    city: 'Agadir',
    phone: '+212 5 28 XX XX XX',
    email: 'contact@sudpharma.ma',
    status: 'active',
    approved_at: daysAgo(250),
    approved_by: seedUUID('user', 1),
  },
  {
    id: seedUUID('company', 14),
    name: 'MediStock Express',
    type: 'wholesaler',
    registration_number: 'RC-RBT-2022-001234',
    tax_id: 'IF-0123456',
    address: '23 Technopolis',
    city: 'Rabat',
    phone: '+212 5 37 XX XX XX',
    email: 'contact@medistock.ma',
    status: 'pending',
    approved_at: null,
    approved_by: null,
  },
]

// ============================================================================
// Seed Function
// ============================================================================

export async function seedCompanies(): Promise<void> {
  log(`Preparing ${COMPANIES.length} companies...`)
  
  await batchInsert('companies', COMPANIES, { onConflict: 'id' })
  
  const ipcCount = COMPANIES.filter(c => c.type === 'ipc').length
  const wholesalerCount = COMPANIES.filter(c => c.type === 'wholesaler').length
  
  log(`Companies seeded: ${ipcCount} IPCs, ${wholesalerCount} wholesalers`, 'success')
}
