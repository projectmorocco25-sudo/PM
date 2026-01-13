/**
 * Task 1.1.6: Mock Data Configuration
 * 
 * Shared configuration and constants for mock data generation.
 */

// ============================================================================
// Generation Configuration
// ============================================================================

export const CONFIG = {
  // Task 1.1.6.1: Company counts
  companies: {
    ipc: 15,
    wholesaler: 60,
    total: 75,
  },
  
  // Task 1.1.6.2: Products per company
  products: {
    min: 2,
    max: 5,
  },
  
  // Task 1.1.6.3: SKUs per product
  skus: {
    min: 3,
    max: 10,
  },
  
  // Task 1.1.6.6-8: Historical data years
  history: {
    years: 3, // 2024, 2025, 2026
    startYear: 2024,
    currentYear: 2026,
  },
  
  // Task 1.1.6.5: Critical medicine ratio
  criticalMedicine: {
    ratio: 0.15, // 15% of products are critical
  },
  
  // Task 1.1.6.8: Breach probability
  breaches: {
    probability: 0.08, // 8% chance of breach per WSL entry
  },
}

// ============================================================================
// Moroccan Cities and Locations
// ============================================================================

export const MOROCCAN_CITIES = [
  { name: 'Casablanca', prefix: 'CAS' },
  { name: 'Rabat', prefix: 'RBT' },
  { name: 'Marrakech', prefix: 'MRK' },
  { name: 'Fès', prefix: 'FES' },
  { name: 'Tanger', prefix: 'TNG' },
  { name: 'Agadir', prefix: 'AGA' },
  { name: 'Meknès', prefix: 'MEK' },
  { name: 'Oujda', prefix: 'OUJ' },
  { name: 'Kénitra', prefix: 'KEN' },
  { name: 'Tétouan', prefix: 'TET' },
  { name: 'Safi', prefix: 'SAF' },
  { name: 'El Jadida', prefix: 'ELJ' },
  { name: 'Beni Mellal', prefix: 'BME' },
  { name: 'Nador', prefix: 'NAD' },
  { name: 'Taza', prefix: 'TAZ' },
]

export const ZONE_TYPES = [
  'Zone Industrielle',
  'Zone Franche',
  'Technopolis',
  'Zone Logistique',
  'Quartier Industriel',
  'Zone Aéropolis',
]

// ============================================================================
// Task 1.1.6.3a: Pharmaceutical Data Templates
// ============================================================================

// Valid dosage_form values from DB constraint:
// Tablet, Capsule, Syrup, Injection, Cream, Ointment, Gel, Solution, 
// Suspension, Powder, Drops, Inhaler, Patch, Suppository, Spray, Lotion, Other
export const DOSAGE_FORMS = [
  { form: 'Tablet', abbreviation: 'TAB', unit: 'tablets' },
  { form: 'Capsule', abbreviation: 'CAP', unit: 'capsules' },
  { form: 'Syrup', abbreviation: 'SYR', unit: 'ml' },
  { form: 'Injection', abbreviation: 'INJ', unit: 'vials' },
  { form: 'Cream', abbreviation: 'CRM', unit: 'units' },
  { form: 'Ointment', abbreviation: 'OIN', unit: 'units' },
  { form: 'Drops', abbreviation: 'DRP', unit: 'bottles' },
  { form: 'Suspension', abbreviation: 'SUS', unit: 'ml' },
  { form: 'Powder', abbreviation: 'PWD', unit: 'sachets' },
  { form: 'Suppository', abbreviation: 'SUP', unit: 'packs' },
]

export const STRENGTH_PATTERNS: Record<string, string[]> = {
  Tablet: ['100mg', '250mg', '500mg', '1000mg', '5mg', '10mg', '20mg', '40mg'],
  Capsule: ['100mg', '250mg', '500mg', '10mg', '20mg', '50mg'],
  Syrup: ['100mg/5ml', '125mg/5ml', '250mg/5ml', '50mg/5ml'],
  Injection: ['10mg/ml', '25mg/ml', '50mg/ml', '100IU/ml', '40IU/ml'],
  Cream: ['0.1%', '0.5%', '1%', '2%', '5%'],
  Ointment: ['0.1%', '0.5%', '1%', '3%'],
  Drops: ['0.1%', '0.5%', '1%', '5mg/ml'],
  Suspension: ['125mg/5ml', '250mg/5ml', '100mg/5ml'],
  Powder: ['125mg', '250mg', '500mg'],
  Suppository: ['125mg', '250mg', '500mg', '1000mg'],
}

export const PACK_SIZES: Record<string, number[]> = {
  Tablet: [10, 14, 20, 28, 30, 60, 100],
  Capsule: [10, 14, 20, 28, 30, 60],
  Syrup: [60, 100, 120, 150, 200],
  Injection: [1, 3, 5, 10],
  Cream: [15, 30, 50],
  Ointment: [15, 30, 50],
  Drops: [5, 10, 15],
  Suspension: [60, 100, 120],
  Powder: [6, 12, 14],
  Suppository: [6, 10, 12],
}

// ============================================================================
// Company Name Components
// ============================================================================

export const IPC_PREFIXES = [
  'Pharma', 'Bio', 'Medi', 'Sante', 'Vita', 'Lab', 'Chem', 'Gen', 'Pro', 'Neo',
]

export const IPC_SUFFIXES = [
  'Lab', 'Pharma', 'Med', 'Industries', 'Maroc', 'SA', 'SARL', 'Group', 'Plus', 'Tech',
]

export const WHOLESALER_PREFIXES = [
  'Distri', 'Stock', 'Medi', 'Pharma', 'Supply', 'Express', 'Rapid', 'Central', 'Grand', 'United',
]

export const WHOLESALER_SUFFIXES = [
  'Pharma', 'Distribution', 'Express', 'Maroc', 'Plus', 'Stock', 'Supply', 'Gross', 'Central', 'Med',
]

// ============================================================================
// User Name Components (Moroccan)
// ============================================================================

export const FIRST_NAMES = [
  'Mohammed', 'Ahmed', 'Youssef', 'Omar', 'Hamid', 'Khalid', 'Rachid', 'Noureddine', 'Abdelkader', 'Said',
  'Fatima', 'Khadija', 'Salma', 'Nadia', 'Zineb', 'Leila', 'Houda', 'Samira', 'Amina', 'Meriem',
]

export const LAST_NAMES = [
  'El Alaoui', 'Benjelloun', 'Tazi', 'Chraibi', 'Berrada', 'El Idrissi', 'Bennani', 'Lahlou', 'Fassi-Fihri', 'Amrani',
  'El Mansouri', 'Kettani', 'Belhaj', 'Ouazzani', 'Sqalli', 'Benkirane', 'Lahrichi', 'Mouline', 'Kadiri', 'Slaoui',
]

// ============================================================================
// Breach Reasons
// ============================================================================

export const BREACH_REASONS = [
  'Supply chain disruption',
  'Unexpected demand surge',
  'Raw material shortage',
  'Production delay',
  'Quality control hold',
  'Transportation issues',
  'Customs clearance delay',
  'Supplier delivery failure',
  'Equipment maintenance',
  'Regulatory compliance hold',
]
