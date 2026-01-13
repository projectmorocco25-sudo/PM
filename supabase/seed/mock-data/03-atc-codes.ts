/**
 * Task 1.1.6.4: Mock Data Generation - ATC Codes
 * 
 * Comprehensive ATC code reference list for pharmaceuticals.
 */

import { seedUUID } from '../utils'

// ============================================================================
// Types - Aligned with actual database schema
// ============================================================================

export interface MockATCCode {
  id: string
  code: string
  description: string
  is_active: boolean
}

// ============================================================================
// ATC Code Data
// ============================================================================

const ATC_DATA: Array<{ code: string; description: string }> = [
  // Level 1 - Anatomical main group
  { code: 'A', description: 'Alimentary tract and metabolism' },
  { code: 'B', description: 'Blood and blood forming organs' },
  { code: 'C', description: 'Cardiovascular system' },
  { code: 'D', description: 'Dermatologicals' },
  { code: 'G', description: 'Genito-urinary system and sex hormones' },
  { code: 'H', description: 'Systemic hormonal preparations' },
  { code: 'J', description: 'Antiinfectives for systemic use' },
  { code: 'L', description: 'Antineoplastic and immunomodulating agents' },
  { code: 'M', description: 'Musculo-skeletal system' },
  { code: 'N', description: 'Nervous system' },
  { code: 'P', description: 'Antiparasitic products' },
  { code: 'R', description: 'Respiratory system' },
  { code: 'S', description: 'Sensory organs' },
  { code: 'V', description: 'Various' },

  // Level 2 - Therapeutic subgroup
  { code: 'A02', description: 'Drugs for acid related disorders' },
  { code: 'A10', description: 'Drugs used in diabetes' },
  { code: 'A03', description: 'Drugs for functional GI disorders' },
  { code: 'B01', description: 'Antithrombotic agents' },
  { code: 'B03', description: 'Antianemic preparations' },
  { code: 'C07', description: 'Beta blocking agents' },
  { code: 'C08', description: 'Calcium channel blockers' },
  { code: 'C09', description: 'Agents acting on RAS' },
  { code: 'C10', description: 'Lipid modifying agents' },
  { code: 'D01', description: 'Antifungals for dermatological use' },
  { code: 'D06', description: 'Antibiotics for dermatological use' },
  { code: 'D07', description: 'Corticosteroids, dermatological' },
  { code: 'H02', description: 'Corticosteroids for systemic use' },
  { code: 'H03', description: 'Thyroid therapy' },
  { code: 'J01', description: 'Antibacterials for systemic use' },
  { code: 'J02', description: 'Antimycotics for systemic use' },
  { code: 'M01', description: 'Antiinflammatory products' },
  { code: 'M02', description: 'Topical products for joint and muscle pain' },
  { code: 'N02', description: 'Analgesics' },
  { code: 'N03', description: 'Antiepileptics' },
  { code: 'N05', description: 'Psycholeptics' },
  { code: 'N06', description: 'Psychoanaleptics' },
  { code: 'R03', description: 'Drugs for obstructive airway diseases' },
  { code: 'R06', description: 'Antihistamines for systemic use' },

  // Level 3 - Pharmacological subgroup
  { code: 'A02B', description: 'Drugs for peptic ulcer and GORD' },
  { code: 'A10B', description: 'Blood glucose lowering drugs' },
  { code: 'C08C', description: 'Selective calcium channel blockers' },
  { code: 'C09C', description: 'Angiotensin II antagonists' },
  { code: 'C10A', description: 'Lipid modifying agents, plain' },
  { code: 'J01C', description: 'Beta-lactam antibacterials, penicillins' },
  { code: 'J01F', description: 'Macrolides, lincosamides' },
  { code: 'J01M', description: 'Quinolone antibacterials' },
  { code: 'N02B', description: 'Other analgesics and antipyretics' },

  // Level 4 - Chemical subgroup
  { code: 'A02BC', description: 'Proton pump inhibitors' },
  { code: 'A10BA', description: 'Biguanides' },
  { code: 'A10BB', description: 'Sulfonylureas' },
  { code: 'A10BH', description: 'DPP-4 inhibitors' },
  { code: 'C07AB', description: 'Beta blocking agents, selective' },
  { code: 'C08CA', description: 'Dihydropyridine derivatives' },
  { code: 'C09AA', description: 'ACE inhibitors, plain' },
  { code: 'C09CA', description: 'Angiotensin II antagonists, plain' },
  { code: 'C10AA', description: 'HMG CoA reductase inhibitors' },
  { code: 'J01CA', description: 'Penicillins with extended spectrum' },
  { code: 'J01FA', description: 'Macrolides' },
  { code: 'J01MA', description: 'Fluoroquinolones' },
  { code: 'J01XD', description: 'Imidazole derivatives' },
  { code: 'N02AX', description: 'Other opioids' },
  { code: 'N02BE', description: 'Anilides' },
  { code: 'N03AF', description: 'Carboxamide derivatives' },
  { code: 'N03AX', description: 'Other antiepileptics' },
  { code: 'N05BA', description: 'Benzodiazepine derivatives' },
  { code: 'N06AB', description: 'Selective serotonin reuptake inhibitors' },
  
  // Level 5 - Chemical substance (specific drugs)
  { code: 'A02BA02', description: 'Ranitidine' },
  { code: 'A02BC01', description: 'Omeprazole' },
  { code: 'A02BC02', description: 'Pantoprazole' },
  { code: 'A03FA03', description: 'Domperidone' },
  { code: 'A10AB01', description: 'Insulin human' },
  { code: 'A10BA02', description: 'Metformin' },
  { code: 'A10BB12', description: 'Glimepiride' },
  { code: 'A10BH01', description: 'Sitagliptin' },
  { code: 'B01AA03', description: 'Warfarin' },
  { code: 'B01AC04', description: 'Clopidogrel' },
  { code: 'C07AB03', description: 'Atenolol' },
  { code: 'C08CA01', description: 'Amlodipine' },
  { code: 'C09AA02', description: 'Enalapril' },
  { code: 'C09CA01', description: 'Losartan' },
  { code: 'C10AA01', description: 'Simvastatin' },
  { code: 'C10AA05', description: 'Atorvastatin' },
  { code: 'D01AC01', description: 'Clotrimazole' },
  { code: 'D06AX01', description: 'Fusidic acid' },
  { code: 'D07AA02', description: 'Hydrocortisone' },
  { code: 'D07AC01', description: 'Betamethasone' },
  { code: 'G03DA04', description: 'Progesterone' },
  { code: 'H02AB02', description: 'Dexamethasone' },
  { code: 'H02AB06', description: 'Prednisolone' },
  { code: 'H03AA01', description: 'Levothyroxine' },
  { code: 'J01CA04', description: 'Amoxicillin' },
  { code: 'J01FA10', description: 'Azithromycin' },
  { code: 'J01MA02', description: 'Ciprofloxacin' },
  { code: 'J01XD01', description: 'Metronidazole' },
  { code: 'M01AB05', description: 'Diclofenac' },
  { code: 'M01AE01', description: 'Ibuprofen' },
  { code: 'N02AX02', description: 'Tramadol' },
  { code: 'N02BE01', description: 'Paracetamol' },
  { code: 'N03AF01', description: 'Carbamazepine' },
  { code: 'N03AX14', description: 'Levetiracetam' },
  { code: 'N05BA01', description: 'Diazepam' },
  { code: 'N06AB03', description: 'Fluoxetine' },
  { code: 'R03AC02', description: 'Salbutamol' },
  { code: 'R03DC03', description: 'Montelukast' },
  { code: 'R06AE07', description: 'Cetirizine' },
  { code: 'R06AX13', description: 'Loratadine' },
]

// ============================================================================
// Generate ATC Codes
// ============================================================================

export function generateATCCodes(): MockATCCode[] {
  return ATC_DATA.map((atc, index) => ({
    id: seedUUID('atc', index + 1),
    code: atc.code,
    description: atc.description,
    is_active: true,
  }))
}

export const MOCK_ATC_CODES = generateATCCodes()
