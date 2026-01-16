-- Migration: seed_1_1_1_foundation
-- Description: Foundation seed data for Phase 1.1.1 testing (users, companies, module activation, base notifications)
-- Date: 2026-01-15
-- Author: Farah (Seed Realism Gate), Nadia (DB Integrity)
-- Phase: 1.1.1
-- Playbook: phase-1-1-mockdata.md
-- Status: Idempotent (safe to re-run)

BEGIN;

-- Enable pgcrypto extension for hash functions (if not already enabled)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Temporarily disable FK constraint to auth.users for seed data
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_id_fkey;

-- ====================
-- MODULE ACTIVATION
-- ====================

INSERT INTO system_config (module_name, is_active, activated_at)
VALUES 
  ('rmm', true, '2026-01-01 00:00:00+00'),
  ('vci', true, '2026-01-01 00:00:00+00'),
  ('ecs', false, NULL),
  ('cmc', false, NULL)
ON CONFLICT (module_name) 
DO UPDATE SET 
  is_active = EXCLUDED.is_active,
  activated_at = EXCLUDED.activated_at;

-- ====================
-- SCENARIO PACK: pack_foundation_moh_ops
-- Purpose: MOH users for all role-based testing
-- ====================

-- NOTE: These users reference auth.users. You must first create these users via Supabase Dashboard > Authentication
--       OR use the Supabase Auth API to create them programmatically
--       Test password for all: TempPassword123!@#
-- 
-- Quick create via SQL (if auth schema is accessible):
-- Do this BEFORE running this seed migration:
/*
DO $$
DECLARE
  v_user_id uuid;
BEGIN
  -- Create each auth user if not exists
  FOR v_user_id IN 
    SELECT unnest(ARRAY[
      '10000000-0000-0000-0000-000000000001'::uuid,
      '10000000-0000-0000-0000-000000000002'::uuid,
      '10000000-0000-0000-0000-000000000003'::uuid,
      '10000000-0000-0000-0000-000000000011'::uuid,
      '10000000-0000-0000-0000-000000000012'::uuid,
      '10000000-0000-0000-0000-000000000021'::uuid,
      '10000000-0000-0000-0000-000000000031'::uuid
    ])
  LOOP
    -- Use Supabase Auth API or Dashboard to create users
    NULL;
  END LOOP;
END $$;
*/

-- MOH Tier 1 User (Dr. Samir Hassan - approves everything)
INSERT INTO users (
  id, email, full_name, role, company_id, 
  is_active, notification_preferences, created_at
)
VALUES (
  '10000000-0000-0000-0000-000000000001',
  'samir.hassan@moh.gov.ma',
  'Dr. Samir Hassan',
  'tier1',
  NULL,
  true,
  '{"email_enabled": true, "in_app_enabled": true}'::jsonb,
  '2026-01-01 00:00:00+00'
)
ON CONFLICT (id) 
DO UPDATE SET 
  email = EXCLUDED.email,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  is_active = EXCLUDED.is_active;

-- MOH Tier 2 Officer (Fatima Alami - verifies submissions)
INSERT INTO users (
  id, email, full_name, role, company_id, 
  is_active, notification_preferences, created_at
)
VALUES (
  '10000000-0000-0000-0000-000000000002',
  'fatima.alami@moh.gov.ma',
  'Fatima Alami',
  'tier2_officer',
  NULL,
  true,
  '{"email_enabled": true, "in_app_enabled": true}'::jsonb,
  '2026-01-01 00:00:00+00'
)
ON CONFLICT (id) 
DO UPDATE SET 
  email = EXCLUDED.email,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  is_active = EXCLUDED.is_active;

-- MOH Tier 2 Registrar (Ahmed Benali - implements approved changes)
INSERT INTO users (
  id, email, full_name, role, company_id, 
  is_active, notification_preferences, created_at
)
VALUES (
  '10000000-0000-0000-0000-000000000003',
  'ahmed.benali@moh.gov.ma',
  'Ahmed Benali',
  'tier2_registrar',
  NULL,
  true,
  '{"email_enabled": true, "in_app_enabled": true}'::jsonb,
  '2026-01-01 00:00:00+00'
)
ON CONFLICT (id) 
DO UPDATE SET 
  email = EXCLUDED.email,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  is_active = EXCLUDED.is_active;

-- ====================
-- SCENARIO PACK: pack_company_active
-- Purpose: Active company with meaningful data
-- ====================

-- Company: Active Pharma Co (IPC - Importer/Producer/Combiner)
INSERT INTO companies (
  id, name, registration_number, tax_id, company_type, 
  address, contact_email, contact_phone, 
  is_active, created_at
)
VALUES (
  '20000000-0000-0000-0000-000000000001',
  'Active Pharma Co',
  'IPC-2024-001',
  'MAR-TAX-001',
  'ipc',
  '123 Pharmaceutical Avenue, Casablanca, 20250, Morocco',
  'contact@activepharma.ma',
  '+212522123456',
  true,
  '2024-06-01 00:00:00+00'
)
ON CONFLICT (id) 
DO UPDATE SET 
  name = EXCLUDED.name,
  registration_number = EXCLUDED.registration_number,
  company_type = EXCLUDED.company_type,
  is_active = EXCLUDED.is_active;

-- Company Admin: Youssef Bennis
INSERT INTO users (
  id, email, full_name, role, company_id, 
  is_active, notification_preferences, created_at
)
VALUES (
  '10000000-0000-0000-0000-000000000011',
  'youssef.bennis@activepharma.ma',
  'Youssef Bennis',
  'company_admin',
  '20000000-0000-0000-0000-000000000001',
  true,
  '{"email_enabled": true, "in_app_enabled": true}'::jsonb,
  '2024-06-01 00:00:00+00'
)
ON CONFLICT (id) 
DO UPDATE SET 
  email = EXCLUDED.email,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  company_id = EXCLUDED.company_id,
  is_active = EXCLUDED.is_active;

-- Company Manager: Sara Khalil
INSERT INTO users (
  id, email, full_name, role, company_id, 
  is_active, notification_preferences, created_at
)
VALUES (
  '10000000-0000-0000-0000-000000000012',
  'sara.khalil@activepharma.ma',
  'Sara Khalil',
  'company_manager',
  '20000000-0000-0000-0000-000000000001',
  true,
  '{"email_enabled": true, "in_app_enabled": true}'::jsonb,
  '2024-06-15 00:00:00+00'
)
ON CONFLICT (id) 
DO UPDATE SET 
  email = EXCLUDED.email,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  company_id = EXCLUDED.company_id,
  is_active = EXCLUDED.is_active;

-- ====================
-- SCENARIO PACK: pack_company_empty
-- Purpose: Empty company for testing empty states
-- ====================

-- Company: Empty Holdings Ltd (Wholesaler)
INSERT INTO companies (
  id, name, registration_number, tax_id, company_type, 
  address, contact_email, contact_phone, 
  is_active, created_at
)
VALUES (
  '20000000-0000-0000-0000-000000000002',
  'Empty Holdings Ltd',
  'WHS-2025-999',
  'MAR-TAX-999',
  'wholesaler',
  '999 Empty Street, Rabat, 10000, Morocco',
  'contact@emptyholdings.ma',
  '+212537999999',
  true,
  '2025-12-01 00:00:00+00'
)
ON CONFLICT (id) 
DO UPDATE SET 
  name = EXCLUDED.name,
  registration_number = EXCLUDED.registration_number,
  company_type = EXCLUDED.company_type,
  is_active = EXCLUDED.is_active;

-- Company Admin: Hassan Empty
INSERT INTO users (
  id, email, full_name, role, company_id, 
  is_active, notification_preferences, created_at
)
VALUES (
  '10000000-0000-0000-0000-000000000021',
  'hassan.empty@emptyholdings.ma',
  'Hassan Empty',
  'company_admin',
  '20000000-0000-0000-0000-000000000002',
  true,
  '{"email_enabled": true, "in_app_enabled": false}'::jsonb,
  '2025-12-01 00:00:00+00'
)
ON CONFLICT (id) 
DO UPDATE SET 
  email = EXCLUDED.email,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  company_id = EXCLUDED.company_id,
  is_active = EXCLUDED.is_active;

-- ====================
-- THIRD COMPANY: For Better List Testing
-- ====================

INSERT INTO companies (
  id, name, registration_number, tax_id, company_type, 
  address, contact_email, contact_phone, 
  is_active, created_at
)
VALUES (
  '20000000-0000-0000-0000-000000000003',
  'MediSupply Maroc',
  'WHS-2024-042',
  'MAR-TAX-042',
  'wholesaler',
  '42 Supply Chain Road, Marrakech, 40000, Morocco',
  'info@medisupply.ma',
  '+212524420042',
  true,
  '2024-08-15 00:00:00+00'
)
ON CONFLICT (id) 
DO UPDATE SET 
  name = EXCLUDED.name,
  registration_number = EXCLUDED.registration_number,
  is_active = EXCLUDED.is_active;

INSERT INTO users (
  id, email, full_name, role, company_id, 
  is_active, notification_preferences, created_at
)
VALUES (
  '10000000-0000-0000-0000-000000000031',
  'karim.idrissi@medisupply.ma',
  'Karim Idrissi',
  'company_admin',
  '20000000-0000-0000-0000-000000000003',
  true,
  '{"email_enabled": true, "in_app_enabled": true}'::jsonb,
  '2024-08-15 00:00:00+00'
)
ON CONFLICT (id) 
DO UPDATE SET 
  email = EXCLUDED.email,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  company_id = EXCLUDED.company_id,
  is_active = EXCLUDED.is_active;

-- ====================
-- BASE NOTIFICATIONS (for header badge and dashboard)
-- ====================

-- Unread notification for MOH Tier 1
INSERT INTO notifications (
  id, user_id, type, title, message, link, 
  is_read, created_at
)
VALUES (
  '30000000-0000-0000-0000-000000000001',
  '10000000-0000-0000-0000-000000000001',
  'registry_submission_pending',
  'Registry Submission Pending Approval',
  'A new registry submission requires your approval',
  '/rmm/submissions',
  false,
  now() - interval '2 hours'
)
ON CONFLICT (id) DO NOTHING;

-- Read notification for MOH Tier 1
INSERT INTO notifications (
  id, user_id, type, title, message, link, 
  is_read, read_at, created_at
)
VALUES (
  '30000000-0000-0000-0000-000000000002',
  '10000000-0000-0000-0000-000000000001',
  'enforcement_action_executed',
  'Enforcement Action Executed',
  'Warning enforcement action has been executed',
  '/enforcement/actions',
  true,
  now() - interval '1 day',
  now() - interval '2 days'
)
ON CONFLICT (id) DO NOTHING;

-- Unread notification for Company Admin
INSERT INTO notifications (
  id, user_id, type, title, message, link, 
  is_read, created_at
)
VALUES (
  '30000000-0000-0000-0000-000000000011',
  '10000000-0000-0000-0000-000000000011',
  'submission_approved',
  'Registry Submission Approved',
  'Your product registration has been approved',
  '/rmm/submissions',
  false,
  now() - interval '3 hours'
)
ON CONFLICT (id) DO NOTHING;

-- Unread notification for MOH Tier 2 Officer
INSERT INTO notifications (
  id, user_id, type, title, message, link, 
  is_read, created_at
)
VALUES (
  '30000000-0000-0000-0000-000000000021',
  '10000000-0000-0000-0000-000000000002',
  'registry_submission_submitted',
  'New Registry Submission for Review',
  'Active Pharma Co submitted a new product registration',
  '/rmm/submissions',
  false,
  now() - interval '4 hours'
)
ON CONFLICT (id) DO NOTHING;

-- ====================
-- BASE AUDIT LOGS (for dashboard and integrity demo)
-- ====================

-- Company creation audit
INSERT INTO audit_logs (
  id, user_id, operation_type, table_name, record_id,
  old_values, new_values, entry_data, created_at,
  previous_hash, current_hash
)
SELECT 
  '40000000-0000-0000-0000-000000000001',
  '10000000-0000-0000-0000-000000000001',
  'create',
  'companies',
  '20000000-0000-0000-0000-000000000001',
  NULL,
  jsonb_build_object('name', 'Active Pharma Co', 'is_active', true),
  jsonb_build_object(
    'user_id', '10000000-0000-0000-0000-000000000001',
    'operation_type', 'create',
    'table_name', 'companies',
    'record_id', '20000000-0000-0000-0000-000000000001',
    'created_at', '2024-06-01 00:00:00+00'
  ),
  '2024-06-01 00:00:00+00',
  NULL,
  'seed_foundation_audit_1_hash'
WHERE NOT EXISTS (SELECT 1 FROM audit_logs WHERE id = '40000000-0000-0000-0000-000000000001');

-- Re-add FK constraint to auth.users (optional - can stay disabled for development)
-- ALTER TABLE users ADD CONSTRAINT users_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;

COMMIT;

-- Verification queries (run these manually to verify seed worked):
-- SELECT COUNT(*) FROM users WHERE company_id IS NULL; -- Should be 3 MOH users
-- SELECT COUNT(*) FROM users WHERE company_id IS NOT NULL; -- Should be 4 company users
-- SELECT COUNT(*) FROM companies; -- Should be 3
-- SELECT COUNT(*) FROM notifications WHERE is_read = false; -- Should have unread notifications
-- SELECT module_name, is_active FROM system_config ORDER BY module_name;
