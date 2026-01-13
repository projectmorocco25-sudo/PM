/**
 * Task 1.1.1.23: ATC Code Reference Data
 * 
 * Seeds WHO ATC (Anatomical Therapeutic Chemical) classification codes.
 */

import { log, batchInsert } from './utils'

// ============================================================================
// ATC Code Definitions
// ============================================================================

interface ATCCode {
  code: string
  name: string
  level: number
  parent_code: string | null
}

// Commonly used ATC codes for pharmaceuticals in Morocco
const ATC_CODES: ATCCode[] = [
  // Level 1: Anatomical main group
  { code: 'A', name: 'Alimentary tract and metabolism', level: 1, parent_code: null },
  { code: 'B', name: 'Blood and blood forming organs', level: 1, parent_code: null },
  { code: 'C', name: 'Cardiovascular system', level: 1, parent_code: null },
  { code: 'D', name: 'Dermatologicals', level: 1, parent_code: null },
  { code: 'G', name: 'Genito-urinary system and sex hormones', level: 1, parent_code: null },
  { code: 'H', name: 'Systemic hormonal preparations', level: 1, parent_code: null },
  { code: 'J', name: 'Antiinfectives for systemic use', level: 1, parent_code: null },
  { code: 'L', name: 'Antineoplastic and immunomodulating agents', level: 1, parent_code: null },
  { code: 'M', name: 'Musculo-skeletal system', level: 1, parent_code: null },
  { code: 'N', name: 'Nervous system', level: 1, parent_code: null },
  { code: 'P', name: 'Antiparasitic products', level: 1, parent_code: null },
  { code: 'R', name: 'Respiratory system', level: 1, parent_code: null },
  { code: 'S', name: 'Sensory organs', level: 1, parent_code: null },
  { code: 'V', name: 'Various', level: 1, parent_code: null },
  
  // Level 2: Therapeutic main group (selected)
  { code: 'A02', name: 'Drugs for acid related disorders', level: 2, parent_code: 'A' },
  { code: 'A10', name: 'Drugs used in diabetes', level: 2, parent_code: 'A' },
  { code: 'B01', name: 'Antithrombotic agents', level: 2, parent_code: 'B' },
  { code: 'C03', name: 'Diuretics', level: 2, parent_code: 'C' },
  { code: 'C07', name: 'Beta blocking agents', level: 2, parent_code: 'C' },
  { code: 'C08', name: 'Calcium channel blockers', level: 2, parent_code: 'C' },
  { code: 'C09', name: 'Agents acting on renin-angiotensin system', level: 2, parent_code: 'C' },
  { code: 'C10', name: 'Lipid modifying agents', level: 2, parent_code: 'C' },
  { code: 'J01', name: 'Antibacterials for systemic use', level: 2, parent_code: 'J' },
  { code: 'J05', name: 'Antivirals for systemic use', level: 2, parent_code: 'J' },
  { code: 'N02', name: 'Analgesics', level: 2, parent_code: 'N' },
  { code: 'N03', name: 'Antiepileptics', level: 2, parent_code: 'N' },
  { code: 'N05', name: 'Psycholeptics', level: 2, parent_code: 'N' },
  { code: 'N06', name: 'Psychoanaleptics', level: 2, parent_code: 'N' },
  { code: 'R03', name: 'Drugs for obstructive airway diseases', level: 2, parent_code: 'R' },
  { code: 'R06', name: 'Antihistamines for systemic use', level: 2, parent_code: 'R' },
  
  // Level 3: Pharmacological subgroup (selected)
  { code: 'A02B', name: 'Drugs for peptic ulcer and GORD', level: 3, parent_code: 'A02' },
  { code: 'A10A', name: 'Insulins and analogues', level: 3, parent_code: 'A10' },
  { code: 'A10B', name: 'Blood glucose lowering drugs, excl. insulins', level: 3, parent_code: 'A10' },
  { code: 'C08C', name: 'Selective calcium channel blockers with mainly vascular effects', level: 3, parent_code: 'C08' },
  { code: 'C09C', name: 'Angiotensin II receptor blockers (ARBs)', level: 3, parent_code: 'C09' },
  { code: 'C10A', name: 'Lipid modifying agents, plain', level: 3, parent_code: 'C10' },
  { code: 'J01C', name: 'Beta-lactam antibacterials, penicillins', level: 3, parent_code: 'J01' },
  { code: 'J01D', name: 'Other beta-lactam antibacterials', level: 3, parent_code: 'J01' },
  { code: 'J01F', name: 'Macrolides, lincosamides and streptogramins', level: 3, parent_code: 'J01' },
  { code: 'N02B', name: 'Other analgesics and antipyretics', level: 3, parent_code: 'N02' },
  
  // Level 4: Chemical subgroup (selected)
  { code: 'A02BC', name: 'Proton pump inhibitors', level: 4, parent_code: 'A02B' },
  { code: 'A10AB', name: 'Insulins and analogues, fast-acting', level: 4, parent_code: 'A10A' },
  { code: 'A10BA', name: 'Biguanides', level: 4, parent_code: 'A10B' },
  { code: 'C08CA', name: 'Dihydropyridine derivatives', level: 4, parent_code: 'C08C' },
  { code: 'C09CA', name: 'Angiotensin II receptor blockers (ARBs), plain', level: 4, parent_code: 'C09C' },
  { code: 'C10AA', name: 'HMG CoA reductase inhibitors', level: 4, parent_code: 'C10A' },
  { code: 'J01CA', name: 'Penicillins with extended spectrum', level: 4, parent_code: 'J01C' },
  { code: 'N02BE', name: 'Anilides', level: 4, parent_code: 'N02B' },
  
  // Level 5: Chemical substance (selected - commonly used)
  { code: 'A02BC01', name: 'Omeprazole', level: 5, parent_code: 'A02BC' },
  { code: 'A02BC02', name: 'Pantoprazole', level: 5, parent_code: 'A02BC' },
  { code: 'A02BC03', name: 'Lansoprazole', level: 5, parent_code: 'A02BC' },
  { code: 'A02BC05', name: 'Esomeprazole', level: 5, parent_code: 'A02BC' },
  { code: 'A10AB01', name: 'Insulin human', level: 5, parent_code: 'A10AB' },
  { code: 'A10BA02', name: 'Metformin', level: 5, parent_code: 'A10BA' },
  { code: 'C08CA01', name: 'Amlodipine', level: 5, parent_code: 'C08CA' },
  { code: 'C09CA01', name: 'Losartan', level: 5, parent_code: 'C09CA' },
  { code: 'C09CA03', name: 'Valsartan', level: 5, parent_code: 'C09CA' },
  { code: 'C10AA01', name: 'Simvastatin', level: 5, parent_code: 'C10AA' },
  { code: 'C10AA05', name: 'Atorvastatin', level: 5, parent_code: 'C10AA' },
  { code: 'C10AA07', name: 'Rosuvastatin', level: 5, parent_code: 'C10AA' },
  { code: 'J01CA04', name: 'Amoxicillin', level: 5, parent_code: 'J01CA' },
  { code: 'N02BE01', name: 'Paracetamol', level: 5, parent_code: 'N02BE' },
]

// ============================================================================
// Seed Function
// ============================================================================

export async function seedAtcCodes(): Promise<void> {
  log(`Preparing ${ATC_CODES.length} ATC codes...`)
  
  await batchInsert('atc_codes', ATC_CODES, { onConflict: 'code' })
  
  const byLevel = ATC_CODES.reduce((acc, code) => {
    acc[code.level] = (acc[code.level] || 0) + 1
    return acc
  }, {} as Record<number, number>)
  
  log(`ATC codes seeded: L1=${byLevel[1]}, L2=${byLevel[2]}, L3=${byLevel[3]}, L4=${byLevel[4]}, L5=${byLevel[5]}`, 'success')
}
