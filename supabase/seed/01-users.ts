/**
 * Task 1.1.1.23: User Seed Data
 * 
 * Creates test users with various roles for development and testing.
 */

import { supabase, log, seedUUID, batchInsert } from './utils'

// ============================================================================
// Test User Definitions
// ============================================================================

interface TestUser {
  id: string
  email: string
  full_name: string
  role: string
  company_id: string | null
  phone?: string
  is_active: boolean
}

const TEST_USERS: TestUser[] = [
  // MOH Tier 1 Users
  {
    id: seedUUID('user', 1),
    email: 'tier1@moh.gov.ma',
    full_name: 'Dr. Fatima Zahra El Alaoui',
    role: 'tier1',
    company_id: null,
    phone: '+212 5 37 XX XX XX',
    is_active: true,
  },
  {
    id: seedUUID('user', 2),
    email: 'tier1-2@moh.gov.ma',
    full_name: 'Dr. Mohammed Benjelloun',
    role: 'tier1',
    company_id: null,
    phone: '+212 5 37 XX XX XX',
    is_active: true,
  },
  
  // MOH Tier 2 Officers
  {
    id: seedUUID('user', 3),
    email: 'tier2-officer@moh.gov.ma',
    full_name: 'Khadija Amrani',
    role: 'tier2_officer',
    company_id: null,
    phone: '+212 5 37 XX XX XX',
    is_active: true,
  },
  {
    id: seedUUID('user', 4),
    email: 'tier2-officer-2@moh.gov.ma',
    full_name: 'Ahmed El Mansouri',
    role: 'tier2_officer',
    company_id: null,
    phone: '+212 5 37 XX XX XX',
    is_active: true,
  },
  
  // MOH Tier 2 Registrars
  {
    id: seedUUID('user', 5),
    email: 'tier2-registrar@moh.gov.ma',
    full_name: 'Rachid Bennani',
    role: 'tier2_registrar',
    company_id: null,
    phone: '+212 5 37 XX XX XX',
    is_active: true,
  },
  
  // Company Users - IPC 1 (Pharmaceutical Industries)
  {
    id: seedUUID('user', 10),
    email: 'admin@pharma-industries.ma',
    full_name: 'Youssef El Idrissi',
    role: 'company_admin',
    company_id: seedUUID('company', 1), // Will be created in 02-companies.ts
    phone: '+212 5 22 XX XX XX',
    is_active: true,
  },
  {
    id: seedUUID('user', 11),
    email: 'manager@pharma-industries.ma',
    full_name: 'Salma Tazi',
    role: 'company_manager',
    company_id: seedUUID('company', 1),
    phone: '+212 5 22 XX XX XX',
    is_active: true,
  },
  {
    id: seedUUID('user', 12),
    email: 'user@pharma-industries.ma',
    full_name: 'Omar Belkadi',
    role: 'company_user',
    company_id: seedUUID('company', 1),
    phone: '+212 5 22 XX XX XX',
    is_active: true,
  },
  
  // Company Users - IPC 2 (MedLab Morocco)
  {
    id: seedUUID('user', 20),
    email: 'admin@medlab.ma',
    full_name: 'Nadia Chraibi',
    role: 'company_admin',
    company_id: seedUUID('company', 2),
    phone: '+212 5 22 XX XX XX',
    is_active: true,
  },
  {
    id: seedUUID('user', 21),
    email: 'manager@medlab.ma',
    full_name: 'Hamid Fassi-Fihri',
    role: 'company_manager',
    company_id: seedUUID('company', 2),
    phone: '+212 5 22 XX XX XX',
    is_active: true,
  },
  
  // Company Users - Wholesaler 1 (PharmaDist)
  {
    id: seedUUID('user', 30),
    email: 'admin@pharmadist.ma',
    full_name: 'Leila Berrada',
    role: 'company_admin',
    company_id: seedUUID('company', 10),
    phone: '+212 5 22 XX XX XX',
    is_active: true,
  },
  {
    id: seedUUID('user', 31),
    email: 'manager@pharmadist.ma',
    full_name: 'Amine Lahlou',
    role: 'company_manager',
    company_id: seedUUID('company', 10),
    phone: '+212 5 22 XX XX XX',
    is_active: true,
  },
  
  // Company Users - Wholesaler 2 (MedSupply)
  {
    id: seedUUID('user', 40),
    email: 'admin@medsupply.ma',
    full_name: 'Zineb Alami',
    role: 'company_admin',
    company_id: seedUUID('company', 11),
    phone: '+212 5 22 XX XX XX',
    is_active: true,
  },
  
  // Inactive user for testing
  {
    id: seedUUID('user', 99),
    email: 'inactive@pharma-industries.ma',
    full_name: 'Inactive User',
    role: 'company_user',
    company_id: seedUUID('company', 1),
    phone: '+212 5 22 XX XX XX',
    is_active: false,
  },
]

// ============================================================================
// Seed Function
// ============================================================================

export async function seedUsers(): Promise<void> {
  log(`Preparing ${TEST_USERS.length} test users...`)
  
  // Create auth users first (requires admin API)
  for (const user of TEST_USERS) {
    try {
      // Check if auth user exists
      const { data: existingUser } = await supabase.auth.admin.getUserById(user.id)
      
      if (!existingUser.user) {
        // Create auth user
        const { error: authError } = await supabase.auth.admin.createUser({
          id: user.id,
          email: user.email,
          password: 'Test123!',
          email_confirm: true,
          user_metadata: {
            full_name: user.full_name,
          },
        })
        
        if (authError) {
          log(`Failed to create auth user ${user.email}: ${authError.message}`, 'warn')
          continue
        }
      }
      
      log(`Auth user ready: ${user.email}`, 'info')
    } catch (error) {
      log(`Error with auth user ${user.email}: ${error instanceof Error ? error.message : 'Unknown'}`, 'warn')
    }
  }
  
  // Insert/update users table (profile data)
  await batchInsert('users', TEST_USERS, { onConflict: 'id' })
  
  log(`Users seeded successfully`, 'success')
}
