# VCI Schema Verification Checklist - Pharmaceutical Governance Value Chain Platform (PM)

**Purpose:** This document provides the verification checklist for VCI schema completeness after migration Task 1.1.1.9.

**Created:** 2026-01-17  
**Task:** 1.1.1.9a  
**Author:** Sami (Implementation Compliance Specialist)  
**Owner:** Nadia (Database Specialist)

---

## Overview

This document provides SQL queries and verification steps to ensure the VCI schema is complete and matches the specifications in `schema-design.md`. This verification must be performed after Task 1.1.1.9 (VCI migration) is applied.

---

## Verification Checklist for Task 1.1.1.9a

### Step 1: Verify All Tables Exist

```sql
-- Verify all VCI tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN (
    'aams_submissions', 'msq_submissions', 'wsl_submissions', 
    'thresholds', 'breaches', 'breach_analyses'
  )
ORDER BY table_name;
```

**Expected Result:** All 6 tables should be returned.

---

### Step 2: Verify Column Definitions

#### AAMS Submissions Table

```sql
-- Verify aams_submissions table columns
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'aams_submissions'
ORDER BY ordinal_position;
```

**Required Columns:**
- `id` (uuid, NOT NULL, PRIMARY KEY)
- `company_id` (uuid, NOT NULL, FK to companies.id)
- `year` (integer, NOT NULL)
- `aams_value` (numeric(15,2), NULLABLE)
- `submission_data` (jsonb, NOT NULL)
- `status` (text, NOT NULL, DEFAULT 'draft', CHECK constraint)
- `is_late` (boolean, DEFAULT false)
- `correction_of` (uuid, NULLABLE, FK to aams_submissions.id)
- `submitted_by` (uuid, NOT NULL, FK to users.id)
- `submitted_at` (timestamptz, NULLABLE)
- `verified_by` (uuid, NULLABLE, FK to users.id)
- `verified_at` (timestamptz, NULLABLE)
- `approved_by` (uuid, NULLABLE, FK to users.id)
- `approved_at` (timestamptz, NULLABLE)
- `created_at` (timestamptz, DEFAULT now())
- `updated_at` (timestamptz, DEFAULT now())

#### MSQ Submissions Table

```sql
-- Verify msq_submissions table columns
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'msq_submissions'
ORDER BY ordinal_position;
```

**Required Columns:**
- `id` (uuid, NOT NULL, PRIMARY KEY)
- `company_id` (uuid, NOT NULL, FK to companies.id)
- `year` (integer, NOT NULL)
- `month` (integer, NOT NULL, CHECK constraint: month >= 1 AND month <= 12)
- `submission_data` (jsonb, NOT NULL)
- `status` (text, NOT NULL, DEFAULT 'submitted', CHECK constraint)
- `validation_flags` (jsonb, NULLABLE)
- `correction_of` (uuid, NULLABLE, FK to msq_submissions.id)
- `submitted_by` (uuid, NOT NULL, FK to users.id)
- `submitted_at` (timestamptz, DEFAULT now())
- `created_at` (timestamptz, DEFAULT now())
- `updated_at` (timestamptz, DEFAULT now())

#### WSL Submissions Table

```sql
-- Verify wsl_submissions table columns
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'wsl_submissions'
ORDER BY ordinal_position;
```

**Required Columns:**
- `id` (uuid, NOT NULL, PRIMARY KEY)
- `company_id` (uuid, NOT NULL, FK to companies.id)
- `week_ending_date` (date, NOT NULL)
- `submission_data` (jsonb, NOT NULL)
- `status` (text, NOT NULL, DEFAULT 'submitted', CHECK constraint)
- `is_late` (boolean, DEFAULT false)
- `is_non_compliant` (boolean, DEFAULT false)
- `submitted_by` (uuid, NOT NULL, FK to users.id)
- `submitted_at` (timestamptz, DEFAULT now())
- `created_at` (timestamptz, DEFAULT now())
- `updated_at` (timestamptz, DEFAULT now())

#### Thresholds Table

```sql
-- Verify thresholds table columns
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'thresholds'
ORDER BY ordinal_position;
```

**Required Columns:**
- `id` (uuid, NOT NULL, PRIMARY KEY)
- `sku_id` (uuid, NULLABLE, FK to skus.id)
- `threshold_type` (text, NOT NULL, CHECK constraint)
- `threshold_value` (numeric(15,2), NOT NULL)
- `multiplier_b` (numeric(5,2), NOT NULL)
- `aams_value` (numeric(15,2), NOT NULL)
- `effective_from` (date, NOT NULL)
- `effective_to` (date, NULLABLE)
- `is_current` (boolean, DEFAULT true)
- `duration_type` (text, DEFAULT 'permanent', CHECK constraint)
- `revert_date` (date, NULLABLE)
- `revert_to_multiplier` (numeric(5,2), NULLABLE)
- `revert_to_threshold_value` (numeric(15,2), NULLABLE)
- `revert_notification_sent_7d` (boolean, DEFAULT false)
- `revert_notification_sent_1d` (boolean, DEFAULT false)
- `revert_notification_sent_on_revert` (boolean, DEFAULT false)
- `requires_manual_review` (boolean, DEFAULT false)
- `created_by` (uuid, NOT NULL, FK to users.id)
- `created_at` (timestamptz, DEFAULT now())
- `updated_at` (timestamptz, DEFAULT now())

#### Breaches Table

```sql
-- Verify breaches table columns
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'breaches'
ORDER BY ordinal_position;
```

**Required Columns:**
- `id` (uuid, NOT NULL, PRIMARY KEY)
- `sku_id` (uuid, NOT NULL, FK to skus.id)
- `company_id` (uuid, NOT NULL, FK to companies.id)
- `wsl_submission_id` (uuid, NOT NULL, FK to wsl_submissions.id)
- `threshold_id` (uuid, NOT NULL, FK to thresholds.id)
- `stock_level` (numeric(15,2), NOT NULL)
- `threshold_value` (numeric(15,2), NOT NULL)
- `breach_date` (date, NOT NULL)
- `breach_reason` (text, NULLABLE)
- `replenishment_date` (date, NULLABLE)
- `priority` (text, NOT NULL, DEFAULT 'standard', CHECK constraint)
- `status` (text, NOT NULL, DEFAULT 'detected', CHECK constraint)
- `created_at` (timestamptz, DEFAULT now())
- `updated_at` (timestamptz, DEFAULT now())

#### Breach Analyses Table

```sql
-- Verify breach_analyses table columns
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'breach_analyses'
ORDER BY ordinal_position;
```

**Required Columns:**
- `id` (uuid, NOT NULL, PRIMARY KEY)
- `breach_id` (uuid, NOT NULL, FK to breaches.id)
- `analyzed_by` (uuid, NOT NULL, FK to users.id)
- `suggested_action` (text, NOT NULL, CHECK constraint)
- `suggested_action_details` (text, NULLABLE)
- `analysis_notes` (text, NULLABLE)
- `analyzed_at` (timestamptz, DEFAULT now())
- `created_at` (timestamptz, DEFAULT now())

---

### Step 3: Verify Foreign Key Constraints

```sql
-- Verify foreign key constraints
SELECT
    tc.table_name,
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
  AND tc.table_name IN (
    'aams_submissions', 'msq_submissions', 'wsl_submissions', 
    'thresholds', 'breaches', 'breach_analyses'
  )
ORDER BY tc.table_name, kcu.column_name;
```

**Expected Foreign Keys:**
- `aams_submissions.company_id` → `companies.id`
- `aams_submissions.correction_of` → `aams_submissions.id`
- `aams_submissions.submitted_by` → `users.id`
- `aams_submissions.verified_by` → `users.id`
- `aams_submissions.approved_by` → `users.id`
- `msq_submissions.company_id` → `companies.id`
- `msq_submissions.correction_of` → `msq_submissions.id`
- `msq_submissions.submitted_by` → `users.id`
- `wsl_submissions.company_id` → `companies.id`
- `wsl_submissions.submitted_by` → `users.id`
- `thresholds.sku_id` → `skus.id`
- `thresholds.created_by` → `users.id`
- `breaches.sku_id` → `skus.id`
- `breaches.company_id` → `companies.id`
- `breaches.wsl_submission_id` → `wsl_submissions.id`
- `breaches.threshold_id` → `thresholds.id`
- `breach_analyses.breach_id` → `breaches.id`
- `breach_analyses.analyzed_by` → `users.id`

---

### Step 4: Verify Indexes

```sql
-- Verify indexes exist
SELECT
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE schemaname = 'public'
  AND tablename IN (
    'aams_submissions', 'msq_submissions', 'wsl_submissions', 
    'thresholds', 'breaches', 'breach_analyses'
  )
ORDER BY tablename, indexname;
```

**Required Indexes:**

**AAMS Submissions:**
- `idx_aams_company_id`
- `idx_aams_year`
- `idx_aams_company_year` (composite: company_id, year)
- `idx_aams_status`

**MSQ Submissions:**
- `idx_msq_company_id`
- `idx_msq_year_month` (composite: year, month)
- `idx_msq_company_year_month` (composite: company_id, year, month)
- `idx_msq_status`

**WSL Submissions:**
- `idx_wsl_company_id`
- `idx_wsl_week_ending`
- `idx_wsl_company_week` (composite: company_id, week_ending_date)
- `idx_wsl_status`

**Thresholds:**
- `idx_thresholds_sku_id` (WHERE sku_id IS NOT NULL)
- `idx_thresholds_type`
- `idx_thresholds_effective_from`
- `idx_thresholds_is_current`
- `idx_thresholds_duration_type`
- `idx_thresholds_revert_date` (WHERE revert_date IS NOT NULL)
- `idx_thresholds_requires_manual_review` (WHERE requires_manual_review = true)

**Breaches:**
- `idx_breaches_sku_id`
- `idx_breaches_company_id`
- `idx_breaches_status`
- `idx_breaches_detected_at` (on breach_date)
- `idx_breaches_company_status` (composite: company_id, status)
- `idx_breaches_priority`

**Breach Analyses:**
- `idx_breach_analyses_breach_id`
- `idx_breach_analyses_analyzed_at`
- `idx_breach_analyses_analyzed_by`

---

### Step 5: Verify CHECK Constraints

```sql
-- Verify CHECK constraints
SELECT
    tc.table_name,
    conname AS constraint_name,
    pg_get_constraintdef(c.oid) AS constraint_definition
FROM information_schema.table_constraints AS tc
JOIN pg_constraint AS c ON c.conname = tc.constraint_name
WHERE tc.constraint_type = 'CHECK'
  AND tc.table_schema = 'public'
  AND tc.table_name IN (
    'aams_submissions', 'msq_submissions', 'wsl_submissions', 
    'thresholds', 'breaches', 'breach_analyses'
  )
ORDER BY tc.table_name, conname;
```

**Expected CHECK Constraints:**
- `aams_submissions.status`: IN ('draft', 'submitted', 'tier2_verified', 'tier1_approved', 'completed', 'rejected')
- `msq_submissions.month`: >= 1 AND <= 12
- `msq_submissions.status`: IN ('submitted', 'flagged_for_review', 'accepted', 'rejected')
- `wsl_submissions.status`: IN ('submitted', 'late', 'non_compliant', 'accepted')
- `thresholds.threshold_type`: IN ('vci', 'ecs')
- `thresholds.duration_type`: IN ('permanent', 'temporary_auto_revert', 'temporary_manual_review')
- `breaches.priority`: IN ('standard', 'high', 'critical')
- `breaches.status`: IN ('detected', 'tier2_analyzing', 'tier2_suggested', 'tier1_reviewed', 'action_taken', 'completed')
- `breach_analyses.suggested_action`: IN ('warning', 'require_replenishment_plan', 'require_production_plan', 'enhanced_monitoring', 'escalate')

---

### Step 6: Verify Triggers

```sql
-- Verify updated_at triggers
SELECT
    tgname AS trigger_name,
    tgrelid::regclass AS table_name,
    tgfname AS function_name
FROM pg_trigger
WHERE tgrelid IN (
    'public.aams_submissions'::regclass,
    'public.msq_submissions'::regclass,
    'public.wsl_submissions'::regclass,
    'public.thresholds'::regclass,
    'public.breaches'::regclass
  )
  AND tgname LIKE '%updated_at%'
  AND tgisinternal = false
ORDER BY tgrelid::regclass, tgname;
```

**Expected Triggers:**
- `set_aams_submissions_updated_at`
- `set_msq_submissions_updated_at`
- `set_wsl_submissions_updated_at`
- `set_thresholds_updated_at`
- `set_breaches_updated_at`

**Note:** `breach_analyses` table does not have `updated_at` column, so no trigger needed.

---

### Step 7: Verify RLS is Enabled

```sql
-- Verify RLS is enabled on all tables
SELECT 
    schemaname,
    tablename,
    rowsecurity AS rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN (
    'aams_submissions', 'msq_submissions', 'wsl_submissions', 
    'thresholds', 'breaches', 'breach_analyses'
  )
ORDER BY tablename;
```

**Expected Result:** All tables should have `rlse_enabled = true`.

---

### Step 8: Verify Data Types Match Specifications

```sql
-- Verify numeric precision for threshold values
SELECT 
    column_name,
    data_type, 
    numeric_precision,
    numeric_scale
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name IN ('thresholds', 'breaches', 'aams_submissions')
  AND data_type = 'numeric';
```

**Expected Results:**
- `thresholds.threshold_value`: numeric(15,2)
- `thresholds.aams_value`: numeric(15,2)
- `thresholds.multiplier_b`: numeric(5,2)
- `breaches.stock_level`: numeric(15,2)
- `breaches.threshold_value`: numeric(15,2)
- `aams_submissions.aams_value`: numeric(15,2)

---

## Verification Summary

After completing all verification steps above:

- [ ] All 6 VCI tables exist
- [ ] All columns exist with correct data types
- [ ] All foreign key constraints are correctly defined
- [ ] All indexes are created per specification
- [ ] All CHECK constraints are correctly defined
- [ ] All triggers are applied (where applicable)
- [ ] RLS is enabled on all tables
- [ ] Data types match schema-design.md specifications (numeric precision, etc.)

---

## Related Documents

- [Schema Design - VCI Tables](../../02-architecture/database/schema-design.md#vci-tables)
- [Data Dictionary](../../02-architecture/database/data-dictionary.md)
- [Phase 1.1 Implementation Plan](../../../05-project-management/phases/Phase-1-Implementation-Plan.md)

---

**Last Updated:** 2026-01-17
