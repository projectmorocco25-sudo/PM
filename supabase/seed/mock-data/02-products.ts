/**
 * Task 1.1.6.2: Mock Data Generation - Products
 * Task 1.1.6.3 & 1.1.6.3a: Mock Data Generation - SKUs with pharmaceutical attributes
 * 
 * Generates 2-5 products per company with 3-10 SKUs each.
 */

import { seedUUID, randomElement, randomInt, randomElements } from '../utils'
import {
  CONFIG,
  DOSAGE_FORMS,
  STRENGTH_PATTERNS,
  PACK_SIZES,
} from './00-config'
import { MOCK_COMPANIES } from './01-companies'
import { MOCK_ATC_CODES } from './03-atc-codes'

// ============================================================================
// Types - Aligned with actual database schema
// ============================================================================

export interface MockProduct {
  id: string
  company_id: string
  name: string
  description: string | null
  is_critical_medicine: boolean
  is_active: boolean
}

// Task 1.1.6.3a: SKU with pharmaceutical attributes
export interface MockSKU {
  id: string
  product_id: string
  sku_code: string
  name: string
  dosage_strength: string
  dosage_form: string
  pack_size: string
  unit_of_measure: string
  atc_code_id: string | null
  is_moh_authorized_unregistered: boolean
  is_active: boolean
}

// ============================================================================
// Therapeutic Classes and Drugs
// ============================================================================

const THERAPEUTIC_CLASSES = [
  {
    class: 'Analgesics',
    drugs: [
      { generic: 'Paracetamol', atc: 'N02BE01' },
      { generic: 'Ibuprofen', atc: 'M01AE01' },
      { generic: 'Diclofenac', atc: 'M01AB05' },
      { generic: 'Tramadol', atc: 'N02AX02' },
    ],
  },
  {
    class: 'Antibiotics',
    drugs: [
      { generic: 'Amoxicillin', atc: 'J01CA04' },
      { generic: 'Azithromycin', atc: 'J01FA10' },
      { generic: 'Ciprofloxacin', atc: 'J01MA02' },
      { generic: 'Metronidazole', atc: 'J01XD01' },
    ],
  },
  {
    class: 'Antihypertensives',
    drugs: [
      { generic: 'Amlodipine', atc: 'C08CA01' },
      { generic: 'Losartan', atc: 'C09CA01' },
      { generic: 'Enalapril', atc: 'C09AA02' },
      { generic: 'Atenolol', atc: 'C07AB03' },
    ],
  },
  {
    class: 'Antidiabetics',
    drugs: [
      { generic: 'Metformin', atc: 'A10BA02' },
      { generic: 'Glimepiride', atc: 'A10BB12' },
      { generic: 'Insulin human', atc: 'A10AB01' },
      { generic: 'Sitagliptin', atc: 'A10BH01' },
    ],
  },
  {
    class: 'Gastrointestinal',
    drugs: [
      { generic: 'Omeprazole', atc: 'A02BC01' },
      { generic: 'Pantoprazole', atc: 'A02BC02' },
      { generic: 'Ranitidine', atc: 'A02BA02' },
      { generic: 'Domperidone', atc: 'A03FA03' },
    ],
  },
  {
    class: 'Cardiovascular',
    drugs: [
      { generic: 'Simvastatin', atc: 'C10AA01' },
      { generic: 'Atorvastatin', atc: 'C10AA05' },
      { generic: 'Clopidogrel', atc: 'B01AC04' },
      { generic: 'Warfarin', atc: 'B01AA03' },
    ],
  },
  {
    class: 'Respiratory',
    drugs: [
      { generic: 'Salbutamol', atc: 'R03AC02' },
      { generic: 'Montelukast', atc: 'R03DC03' },
      { generic: 'Cetirizine', atc: 'R06AE07' },
      { generic: 'Loratadine', atc: 'R06AX13' },
    ],
  },
  {
    class: 'Dermatological',
    drugs: [
      { generic: 'Betamethasone', atc: 'D07AC01' },
      { generic: 'Clotrimazole', atc: 'D01AC01' },
      { generic: 'Hydrocortisone', atc: 'D07AA02' },
      { generic: 'Fusidic acid', atc: 'D06AX01' },
    ],
  },
  {
    class: 'CNS',
    drugs: [
      { generic: 'Fluoxetine', atc: 'N06AB03' },
      { generic: 'Diazepam', atc: 'N05BA01' },
      { generic: 'Carbamazepine', atc: 'N03AF01' },
      { generic: 'Levetiracetam', atc: 'N03AX14' },
    ],
  },
  {
    class: 'Hormones',
    drugs: [
      { generic: 'Levothyroxine', atc: 'H03AA01' },
      { generic: 'Prednisolone', atc: 'H02AB06' },
      { generic: 'Dexamethasone', atc: 'H02AB02' },
      { generic: 'Progesterone', atc: 'G03DA04' },
    ],
  },
]

// ============================================================================
// Generation Functions
// ============================================================================

function generateProductName(generic: string, companyName: string): string {
  const suffix = companyName.split(' ')[0].substring(0, 4).toUpperCase()
  return `${generic} ${suffix}`
}

function generateSKUCode(generic: string, strength: string, packSize: number, skuIndex: number): string {
  const drugCode = generic.substring(0, 4).toUpperCase()
  const strengthNum = strength.replace(/[^0-9]/g, '').substring(0, 4)
  return `${drugCode}-${strengthNum}-${packSize}-${skuIndex}`
}

function formatPackSize(count: number, unit: string): string {
  return `${count} ${unit}`
}

// Find ATC code ID from the mock ATC codes
function findAtcCodeId(atcCode: string): string | null {
  const found = MOCK_ATC_CODES.find(a => a.code === atcCode)
  return found?.id || null
}

// ============================================================================
// Generate Products and SKUs
// ============================================================================

export function generateProductsAndSKUs(): { products: MockProduct[]; skus: MockSKU[] } {
  const products: MockProduct[] = []
  const skus: MockSKU[] = []
  let productIndex = 1
  let skuIndex = 1

  // Only generate for active IPCs (using correct field names)
  const activeIPCs = MOCK_COMPANIES.filter(c => c.company_type === 'ipc' && c.is_active)

  for (const company of activeIPCs) {
    // 2-5 products per company
    const productCount = randomInt(CONFIG.products.min, CONFIG.products.max)
    const selectedClasses = randomElements(THERAPEUTIC_CLASSES, productCount)

    for (const therapeuticClass of selectedClasses) {
      const drug = randomElement(therapeuticClass.drugs)
      const isCritical = Math.random() < CONFIG.criticalMedicine.ratio

      const product: MockProduct = {
        id: seedUUID('product', productIndex),
        company_id: company.id,
        name: generateProductName(drug.generic, company.name),
        description: `${drug.generic} - ${therapeuticClass.class}`,
        is_critical_medicine: isCritical,
        is_active: true,
      }
      products.push(product)

      // 3-10 SKUs per product
      const skuCount = randomInt(CONFIG.skus.min, CONFIG.skus.max)
      const selectedForms = randomElements(DOSAGE_FORMS, Math.min(skuCount, 3))

      for (let s = 0; s < skuCount; s++) {
        const formInfo = selectedForms[s % selectedForms.length]
        const strengths = STRENGTH_PATTERNS[formInfo.form] || STRENGTH_PATTERNS['Tablet']
        const packs = PACK_SIZES[formInfo.form] || PACK_SIZES['Tablet']
        
        const strength = randomElement(strengths)
        const packCount = randomElement(packs)
        const packSize = formatPackSize(packCount, formInfo.unit)

        const sku: MockSKU = {
          id: seedUUID('sku', skuIndex),
          product_id: product.id,
          sku_code: generateSKUCode(drug.generic, strength, packCount, skuIndex),
          name: `${product.name} ${strength} ${formInfo.form}`,
          dosage_strength: strength,
          dosage_form: formInfo.form,
          pack_size: packSize,
          unit_of_measure: formInfo.unit,
          atc_code_id: findAtcCodeId(drug.atc),
          is_moh_authorized_unregistered: false,
          is_active: true,
        }
        skus.push(sku)
        skuIndex++
      }

      productIndex++
    }
  }

  return { products, skus }
}

// Export generated data
const generated = generateProductsAndSKUs()
export const MOCK_PRODUCTS = generated.products
export const MOCK_SKUS = generated.skus
