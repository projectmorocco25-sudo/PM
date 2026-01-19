-- Schema Verification Script
-- Task: 1.1.1.21b - Comprehensive schema verification after all migrations
-- Reference: Schema Design, Data Dictionary
-- Purpose: Verify all migrations applied correctly, all tables/columns/constraints exist per schema-design.md

-- 1. Verify all migrations are applied
-- Check migration history (this should match the files in supabase/migrations/)
SELECT 
  version,
  name,
  inserted_at
FROM supabase_migrations.schema_migrations
ORDER BY inserted_at ASC;

-- 2. Verify all tables exist per schema-design.md
-- Core Tables
SELECT 'users' as table_name, EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'users') as exists;
SELECT 'system_config' as table_name, EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'system_config') as exists;
SELECT 'audit_logs' as table_name, EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'audit_logs') as exists;
SELECT 'notifications' as table_name, EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'notifications') as exists;
SELECT 'approvals' as table_name, EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'approvals') as exists;

-- Communication Tables
SELECT 'conversations' as table_name, EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'conversations') as exists;
SELECT 'messages' as table_name, EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'messages') as exists;
SELECT 'message_attachments' as table_name, EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'message_attachments') as exists;
SELECT 'message_read_receipts' as table_name, EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'message_read_receipts') as exists;
SELECT 'conversation_participants' as table_name, EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'conversation_participants') as exists;

-- Governance Tables
SELECT 'follow_ups' as table_name, EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'follow_ups') as exists;
SELECT 'meetings' as table_name, EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'meetings') as exists;
SELECT 'meeting_attendees' as table_name, EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'meeting_attendees') as exists;

-- RMM Tables
SELECT 'companies' as table_name, EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'companies') as exists;
SELECT 'products' as table_name, EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'products') as exists;
SELECT 'skus' as table_name, EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'skus') as exists;
SELECT 'atc_codes' as table_name, EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'atc_codes') as exists;
SELECT 'critical_medicines' as table_name, EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'critical_medicines') as exists;
SELECT 'enforcement_actions' as table_name, EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'enforcement_actions') as exists;
SELECT 'registry_submissions' as table_name, EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'registry_submissions') as exists;

-- VCI Tables
SELECT 'aams_submissions' as table_name, EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'aams_submissions') as exists;
SELECT 'msq_submissions' as table_name, EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'msq_submissions') as exists;
SELECT 'wsl_submissions' as table_name, EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'wsl_submissions') as exists;
SELECT 'thresholds' as table_name, EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'thresholds') as exists;
SELECT 'breaches' as table_name, EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'breaches') as exists;
SELECT 'breach_analyses' as table_name, EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'breach_analyses') as exists;

-- 3. Verify all columns with correct data types
-- Query information_schema.columns for each table to verify columns exist with correct types
-- Example for users table:
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'users'
ORDER BY ordinal_position;

-- 4. Verify all foreign key constraints
-- Query information_schema.table_constraints and key_column_usage
SELECT
  tc.table_name,
  tc.constraint_name,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_schema = 'public'
ORDER BY tc.table_name, tc.constraint_name;

-- 5. Verify all indexes
-- Query pg_indexes
SELECT
  schemaname,
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;

-- 6. Verify all constraints (NOT NULL, CHECK, UNIQUE)
-- Query information_schema.constraint_column_usage
SELECT
  tc.table_name,
  tc.constraint_name,
  tc.constraint_type,
  kcu.column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
WHERE tc.table_schema = 'public'
  AND tc.constraint_type IN ('NOT NULL', 'CHECK', 'UNIQUE')
ORDER BY tc.table_name, tc.constraint_type;

-- 7. Verify all triggers (audit logging)
-- Query pg_trigger
SELECT
  tgname AS trigger_name,
  tgrelid::regclass AS table_name,
  tgenabled AS enabled
FROM pg_trigger
WHERE tgname NOT LIKE 'pg_%'
  AND tgisinternal = false
ORDER BY tgrelid::regclass, tgname;

-- 8. Verify RLS policies
-- Query pg_policies
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
