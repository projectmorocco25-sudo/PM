/**
 * Task 1.1.1.23: Product and SKU Seed Data
 * 
 * Creates pharmaceutical products and their SKUs.
 */

import { log, seedUUID, batchInsert, randomInt } from './utils'

// ============================================================================
// Product Definitions
// ============================================================================

interface Product {
  id: string
  company_id: string
  name: string
  generic_name: string
  therapeutic_class: string
  atc_code: string
  is_critical_medicine: boolean
  status: 'active' | 'pending' | 'discontinued'
}

interface SKU {
  id: string
  product_id: string
  sku_code: string
  dosage_form: string
  strength: string
  pack_size: number
  unit_price: number
  status: 'active' | 'pending' | 'discontinued'
}

// Products for IPC 1: Pharma Industries Morocco
const PRODUCTS: Product[] = [
  // Pharma Industries Morocco (company 1)
  {
    id: seedUUID('product', 1),
    company_id: seedUUID('company', 1),
    name: 'Paracetamol PM',
    generic_name: 'Paracetamol',
    therapeutic_class: 'Analgesics',
    atc_code: 'N02BE01',
    is_critical_medicine: true,
    status: 'active',
  },
  {
    id: seedUUID('product', 2),
    company_id: seedUUID('company', 1),
    name: 'Amoxicilline PM',
    generic_name: 'Amoxicillin',
    therapeutic_class: 'Antibiotics',
    atc_code: 'J01CA04',
    is_critical_medicine: true,
    status: 'active',
  },
  {
    id: seedUUID('product', 3),
    company_id: seedUUID('company', 1),
    name: 'Omeprazole PM',
    generic_name: 'Omeprazole',
    therapeutic_class: 'Proton pump inhibitors',
    atc_code: 'A02BC01',
    is_critical_medicine: false,
    status: 'active',
  },
  
  // MedLab Morocco (company 2)
  {
    id: seedUUID('product', 10),
    company_id: seedUUID('company', 2),
    name: 'Metformine MedLab',
    generic_name: 'Metformin',
    therapeutic_class: 'Antidiabetics',
    atc_code: 'A10BA02',
    is_critical_medicine: true,
    status: 'active',
  },
  {
    id: seedUUID('product', 11),
    company_id: seedUUID('company', 2),
    name: 'Amlodipine MedLab',
    generic_name: 'Amlodipine',
    therapeutic_class: 'Calcium channel blockers',
    atc_code: 'C08CA01',
    is_critical_medicine: true,
    status: 'active',
  },
  
  // BioPharm Maroc (company 3)
  {
    id: seedUUID('product', 20),
    company_id: seedUUID('company', 3),
    name: 'Insuline BioPharm',
    generic_name: 'Insulin human',
    therapeutic_class: 'Insulins',
    atc_code: 'A10AB01',
    is_critical_medicine: true,
    status: 'active',
  },
  
  // GeneriMed (company 4)
  {
    id: seedUUID('product', 30),
    company_id: seedUUID('company', 4),
    name: 'Losartan GeneriMed',
    generic_name: 'Losartan',
    therapeutic_class: 'Angiotensin II receptor blockers',
    atc_code: 'C09CA01',
    is_critical_medicine: false,
    status: 'active',
  },
  {
    id: seedUUID('product', 31),
    company_id: seedUUID('company', 4),
    name: 'Simvastatine GeneriMed',
    generic_name: 'Simvastatin',
    therapeutic_class: 'Statins',
    atc_code: 'C10AA01',
    is_critical_medicine: false,
    status: 'active',
  },
]

// SKUs for each product
const SKUS: SKU[] = [
  // Paracetamol PM SKUs
  {
    id: seedUUID('sku', 1),
    product_id: seedUUID('product', 1),
    sku_code: 'PARA-500-20',
    dosage_form: 'Tablet',
    strength: '500mg',
    pack_size: 20,
    unit_price: 15.00,
    status: 'active',
  },
  {
    id: seedUUID('sku', 2),
    product_id: seedUUID('product', 1),
    sku_code: 'PARA-500-30',
    dosage_form: 'Tablet',
    strength: '500mg',
    pack_size: 30,
    unit_price: 22.00,
    status: 'active',
  },
  {
    id: seedUUID('sku', 3),
    product_id: seedUUID('product', 1),
    sku_code: 'PARA-1000-16',
    dosage_form: 'Tablet',
    strength: '1000mg',
    pack_size: 16,
    unit_price: 18.00,
    status: 'active',
  },
  
  // Amoxicilline PM SKUs
  {
    id: seedUUID('sku', 10),
    product_id: seedUUID('product', 2),
    sku_code: 'AMOX-500-12',
    dosage_form: 'Capsule',
    strength: '500mg',
    pack_size: 12,
    unit_price: 35.00,
    status: 'active',
  },
  {
    id: seedUUID('sku', 11),
    product_id: seedUUID('product', 2),
    sku_code: 'AMOX-1000-6',
    dosage_form: 'Tablet',
    strength: '1000mg',
    pack_size: 6,
    unit_price: 45.00,
    status: 'active',
  },
  
  // Omeprazole PM SKUs
  {
    id: seedUUID('sku', 20),
    product_id: seedUUID('product', 3),
    sku_code: 'OMEP-20-14',
    dosage_form: 'Capsule',
    strength: '20mg',
    pack_size: 14,
    unit_price: 50.00,
    status: 'active',
  },
  
  // Metformine MedLab SKUs
  {
    id: seedUUID('sku', 30),
    product_id: seedUUID('product', 10),
    sku_code: 'METF-500-30',
    dosage_form: 'Tablet',
    strength: '500mg',
    pack_size: 30,
    unit_price: 25.00,
    status: 'active',
  },
  {
    id: seedUUID('sku', 31),
    product_id: seedUUID('product', 10),
    sku_code: 'METF-850-30',
    dosage_form: 'Tablet',
    strength: '850mg',
    pack_size: 30,
    unit_price: 32.00,
    status: 'active',
  },
  {
    id: seedUUID('sku', 32),
    product_id: seedUUID('product', 10),
    sku_code: 'METF-1000-30',
    dosage_form: 'Tablet',
    strength: '1000mg',
    pack_size: 30,
    unit_price: 38.00,
    status: 'active',
  },
  
  // Amlodipine MedLab SKUs
  {
    id: seedUUID('sku', 40),
    product_id: seedUUID('product', 11),
    sku_code: 'AMLO-5-30',
    dosage_form: 'Tablet',
    strength: '5mg',
    pack_size: 30,
    unit_price: 45.00,
    status: 'active',
  },
  {
    id: seedUUID('sku', 41),
    product_id: seedUUID('product', 11),
    sku_code: 'AMLO-10-30',
    dosage_form: 'Tablet',
    strength: '10mg',
    pack_size: 30,
    unit_price: 55.00,
    status: 'active',
  },
  
  // Insuline BioPharm SKUs
  {
    id: seedUUID('sku', 50),
    product_id: seedUUID('product', 20),
    sku_code: 'INS-100-5',
    dosage_form: 'Solution for injection',
    strength: '100IU/ml',
    pack_size: 5,
    unit_price: 180.00,
    status: 'active',
  },
  
  // Losartan GeneriMed SKUs
  {
    id: seedUUID('sku', 60),
    product_id: seedUUID('product', 30),
    sku_code: 'LOSA-50-30',
    dosage_form: 'Tablet',
    strength: '50mg',
    pack_size: 30,
    unit_price: 65.00,
    status: 'active',
  },
  
  // Simvastatine GeneriMed SKUs
  {
    id: seedUUID('sku', 70),
    product_id: seedUUID('product', 31),
    sku_code: 'SIMV-20-30',
    dosage_form: 'Tablet',
    strength: '20mg',
    pack_size: 30,
    unit_price: 55.00,
    status: 'active',
  },
]

// ============================================================================
// Seed Function
// ============================================================================

export async function seedProducts(): Promise<void> {
  log(`Preparing ${PRODUCTS.length} products and ${SKUS.length} SKUs...`)
  
  // Insert products first
  await batchInsert('products', PRODUCTS, { onConflict: 'id' })
  
  // Then insert SKUs
  await batchInsert('skus', SKUS, { onConflict: 'id' })
  
  const criticalCount = PRODUCTS.filter(p => p.is_critical_medicine).length
  log(`Products seeded: ${PRODUCTS.length} products (${criticalCount} critical), ${SKUS.length} SKUs`, 'success')
}
