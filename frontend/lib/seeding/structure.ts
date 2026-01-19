/**
 * Database Seeding Script Structure
 * Task: 1.1.1.23
 * Reference: Phase 1.1 Mockdata Playbook
 * 
 * Seeding script structure for Supabase dev/staging data
 * Rule: No local runtime mock providers. Frontend must query Supabase for all displayed data during Phase 1.
 */

/**
 * Seed execution order:
 * 1. Core tables (users, companies, system_config)
 * 2. RMM tables (products, skus, atc_codes)
 * 3. VCI tables (submissions, thresholds, breaches)
 * 4. Communication tables (conversations, messages)
 * 5. Governance tables (follow_ups, meetings)
 */

// Placeholder structure - actual seed scripts will be created in subsequent phases
export const SEED_EXECUTION_ORDER = [
  'core',
  'rmm',
  'vci',
  'communication',
  'governance',
] as const

export type SeedStage = typeof SEED_EXECUTION_ORDER[number]
