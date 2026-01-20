# RMM Schema Verification Checklist - Pharmaceutical Governance Value Chain Platform (PM)

**Purpose:** This document provides the verification checklist for RMM schema completeness after migration Task 1.1.1.7.

**Created:** 2026-01-17  
**Task:** 1.1.1.7a, 1.1.1.7b  
**Author:** Sami (Implementation Compliance Specialist)  
**Owner:** Nadia (Database Specialist)

---

## Overview

This document provides SQL queries and verification steps to ensure the RMM schema is complete and matches the specifications in `schema-design.md`. This verification must be performed after Task 1.1.1.7 (RMM migration) is applied.

---

## Verification Checklist for Task 1.1.1.7a

### Step 1: Verify All Tables Exist

```sql
-- Verify all RMM tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN (
    'companies', 'products', 'skus', 'atc_codes', 
    'critical_medicines', 'enforcement_actions', 'registry_submissions'
  )
ORDER BY table_name;
```

**Expected Result:** All 7 tables should be returned.

---

### Step 2: Verify Column Definitions

#### Companies Table

```sql
-- Verify companies table columns
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'companies'
ORDER BY ordinal_position;
```

**Required Columns:**
- `id` (uuid, NOT NULL, PRIMARY KEY)
- `name` (text, NOT NULL)
- `registration_number` (text, NOT NULL, UNIQUE)
- `company_type` (text, NOT NULL, CHECK constraint)
- `address` (text, NULLABLE)
- `contact_email` (text, NULLABLE)
- `contact_phone` (text, NULLABLE)
- `is_active` (boolean, DEFAULT true)
- `suspended_at` (timestamptz, NULLABLE)
- `suspended_by` (uuid, NULLABLE, FK to users.id)
- `suspended_reason` (text, NULLABLE)
- `created_at` (timestamptz, DEFAULT now())
- `updated_at` (timestamptz, DEFAULT now())

#### Products Table

```sql
-- Verify products table columns
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'products'
ORDER BY ordinal_position;
```

**Required Columns:**
- `id` (uuid, NOT NULL, PRIMARY KEY)
- `company_id` (uuid, NOT NULL, FK to companies.id)
- `name` (text, NOT NULL)
- `description` (text, NULLABLE)
- `is_critical_medicine` (boolean, DEFAULT false)
- `is_active` (boolean, DEFAULT true)
- `deactivated_at` (timestamptz, NULLABLE)
- `deactivated_by` (uuid, NULLABLE, FK to users.id)
- `deactivated_reason` (text, NULLABLE)
- `created_at` (timestamptz, DEFAULT now())
- `updated_at` (timestamptz, DEFAULT now())

#### SKUs Table (Task 1.1.1.7b - Pharmaceutical Attributes)

```sql
-- Verify skus table columns (including pharmaceutical attributes)
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'skus'
ORDER BY ordinal_position;
```

**Required Columns (including pharmaceutical attributes):**
- `id` (uuid, NOT NULL, PRIMARY KEY)
- `product_id` (uuid, NOT NULL, FK to products.id)
- `sku_code` (text, NOT NULL)
- `name` (text, NOT NULL)
- `dosage_strength` (text, NOT NULL) ⚠️ **REQUIRED - Phase 0.6 field**
- `dosage_form` (text, NOT NULL) ⚠️ **REQUIRED - Phase 0.6 field**
- `pack_size` (text, NOT NULL) ⚠️ **REQUIRED - Phase 0.6 field**
- `unit_of_measure` (text, NOT NULL) ⚠️ **REQUIRED - Phase 0.6 field**
- `atc_code_id` (uuid, NULLABLE, FK to atc_codes.id)
- `is_moh_authorized_unregistered` (boolean, DEFAULT false)
- `is_active` (boolean, DEFAULT true)
- `deactivated_at` (timestamptz, NULLABLE)
- `deactivated_by` (uuid, NULLABLE, FK to users.id)
- `deactivated_reason` (text, NULLABLE)
- `created_at` (timestamptz, DEFAULT now())
- `updated_at` (timestamptz, DEFAULT now())

**⚠️ Critical Verification (Task 1.1.1.7b):**
```sql
-- Verify SKU pharmaceutical attributes are NOT NULL
SELECT 
    column_name, 
    is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'skus'
  AND column_name IN ('dosage_strength', 'dosage_form', 'pack_size', 'unit_of_measure');
```

**Expected Result:** All 4 columns should have `is_nullable = 'NO'`.

#### Enforcement Actions Table (State Machine)

```sql
-- Verify enforcement_actions table columns (state machine and workflow fields)
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'enforcement_actions'
ORDER BY ordinal_position;
```

**Required Columns:**
- `id` (uuid, NOT NULL, PRIMARY KEY)
- `company_id` (uuid, NOT NULL, FK to companies.id)
- `action_type` (text, NOT NULL, CHECK constraint)
- `violation_type` (text, NOT NULL, CHECK constraint)
- `legal_basis` (text, NOT NULL)
- `justification` (text, NOT NULL)
- `amount` (numeric(15,2), NULLABLE - required if action_type = 'fine')
- `status` (text, NOT NULL, DEFAULT 'draft', CHECK constraint) ⚠️ **State Machine**
- `requestor_id` (uuid, NOT NULL, FK to users.id) ⚠️ **Two-Person Rule**
- `approver_id` (uuid, NULLABLE, FK to users.id) ⚠️ **Two-Person Rule**
- `appeal_grounds` (text, NULLABLE) ⚠️ **Appeal Workflow**
- `appeal_submitted_at` (timestamptz, NULLABLE) ⚠️ **Appeal Workflow**
- `appeal_resolved_at` (timestamptz, NULLABLE) ⚠️ **Appeal Workflow**
- `appeal_resolution_notes` (text, NULLABLE) ⚠️ **Appeal Workflow**
- `submitted_at` (timestamptz, NULLABLE) ⚠️ **Workflow Tracking**
- `reviewed_at` (timestamptz, NULLABLE) ⚠️ **Workflow Tracking**
- `approved_at` (timestamptz, NULLABLE) ⚠️ **Workflow Tracking**
- `executed_at` (timestamptz, NULLABLE) ⚠️ **Workflow Tracking**
- `review_notes` (text, NULLABLE)
- `approval_notes` (text, NULLABLE)
- `execution_notes` (text, NULLABLE)
- `cancellation_reason` (text, NULLABLE)
- `created_at` (timestamptz, NOT NULL, DEFAULT now())
- `updated_at` (timestamptz, NOT NULL, DEFAULT now())

**Verify State Machine CHECK Constraint:**
```sql
-- Verify status CHECK constraint (state machine)
SELECT 
    conname AS constraint_name,
    pg_get_constraintdef(oid) AS constraint_definition
FROM pg_constraint
WHERE conrelid = 'public.enforcement_actions'::regclass
  AND conname LIKE '%status%'
  AND contype = 'c';
```

**Expected Result:** Should include CHECK constraint with values: `'draft', 'pending_review', 'pending_approval', 'approved', 'executed', 'appealed', 'resolved', 'cancelled'`

#### Registry Submissions Table (State Machine)

```sql
-- Verify registry_submissions table columns (state machine and workflow fields)
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'registry_submissions'
ORDER BY ordinal_position;
```

**Required Columns:**
- `id` (uuid, NOT NULL, PRIMARY KEY)
- `submission_type` (text, NOT NULL, CHECK constraint)
- `entity_type` (text, NOT NULL, CHECK constraint)
- `entity_id` (uuid, NULLABLE)
- `submission_data` (jsonb, NOT NULL)
- `status` (text, NOT NULL, DEFAULT 'draft', CHECK constraint) ⚠️ **State Machine**
- `submitted_by` (uuid, NOT NULL, FK to users.id) ⚠️ **Workflow Field**
- `verified_by` (uuid, NULLABLE, FK to users.id) ⚠️ **Workflow Field**
- `verified_at` (timestamptz, NULLABLE) ⚠️ **Workflow Field**
- `approved_by` (uuid, NULLABLE, FK to users.id) ⚠️ **Workflow Field**
- `approved_at` (timestamptz, NULLABLE) ⚠️ **Workflow Field**
- `implemented_by` (uuid, NULLABLE, FK to users.id) ⚠️ **Workflow Field**
- `implemented_at` (timestamptz, NULLABLE) ⚠️ **Workflow Field**
- `rejection_reason` (text, NULLABLE)
- `created_at` (timestamptz, NOT NULL, DEFAULT now())
- `updated_at` (timestamptz, NOT NULL, DEFAULT now())

**Verify State Machine CHECK Constraint:**
```sql
-- Verify status CHECK constraint (state machine)
SELECT 
    conname AS constraint_name,
    pg_get_constraintdef(oid) AS constraint_definition
FROM pg_constraint
WHERE conrelid = 'public.registry_submissions'::regclass
  AND conname LIKE '%status%'
  AND contype = 'c';
```

**Expected Result:** Should include CHECK constraint with values: `'draft', 'submitted', 'tier2_verified', 'tier1_approved', 'tier2_implemented', 'completed', 'rejected'`

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
    'companies', 'products', 'skus', 'atc_codes', 
    'critical_medicines', 'enforcement_actions', 'registry_submissions'
  )
ORDER BY tc.table_name, kcu.column_name;
```

**Expected Foreign Keys:**
- `products.company_id` → `companies.id`
- `skus.product_id` → `products.id`
- `skus.atc_code_id` → `atc_codes.id`
- `critical_medicines.sku_id` → `skus.id`
- `enforcement_actions.company_id` → `companies.id`
- `enforcement_actions.requestor_id` → `users.id`
- `enforcement_actions.approver_id` → `users.id`
- `registry_submissions.submitted_by` → `users.id`
- `registry_submissions.verified_by` → `users.id`
- `registry_submissions.approved_by` → `users.id`
- `registry_submissions.implemented_by` → `users.id`

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
    'companies', 'products', 'skus', 'atc_codes', 
    'critical_medicines', 'enforcement_actions', 'registry_submissions'
  )
ORDER BY tablename, indexname;
```

**Required Indexes:**

**Companies:**
- `idx_companies_type`
- `idx_companies_name`
- `idx_companies_registration_number`
- `idx_companies_is_active`

**Products:**
- `idx_products_company_id`
- `idx_products_name`
- `idx_products_is_critical_medicine`
- `idx_products_is_active`

**SKUs:**
- `idx_skus_product_id`
- `idx_skus_atc_code_id`
- `idx_skus_is_active`
- `idx_skus_dosage_form` ⚠️ **REQUIRED - Task 1.1.1.7b**

**ATC Codes:**
- `idx_atc_codes_code`
- `idx_atc_codes_is_active`

**Critical Medicines:**
- `idx_critical_medicines_sku_id`
- `idx_critical_medicines_is_active`

**Enforcement Actions:**
- `idx_enforcement_company_id`
- `idx_enforcement_status`
- `idx_enforcement_action_type`
- `idx_enforcement_created_at`
- `idx_enforcement_status_company` (composite: status, company_id)
- `idx_enforcement_requestor_id`
- `idx_enforcement_approver_id`

**Registry Submissions:**
- `idx_registry_submissions_status`
- `idx_registry_submissions_submitted_by`
- `idx_registry_submissions_entity_type`

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
    'companies', 'products', 'skus', 'atc_codes', 
    'critical_medicines', 'enforcement_actions', 'registry_submissions'
  )
ORDER BY tc.table_name, conname;
```

**Expected CHECK Constraints:**
- `companies.company_type`: IN ('ipc', 'wholesaler')
- `enforcement_actions.action_type`: IN ('warning', 'fine', 'suspension')
- `enforcement_actions.violation_type`: IN ('submission_non_compliance', 'threshold_breach', 'critical_medicine_non_compliance', 'export_violation', 'data_quality_issue', 'repeated_offender')
- `enforcement_actions.status`: IN ('draft', 'pending_review', 'pending_approval', 'approved', 'executed', 'appealed', 'resolved', 'cancelled')
- `registry_submissions.submission_type`: IN ('company_create', 'company_update', 'product_create', 'product_update', 'sku_create', 'sku_update', 'company_delete', 'product_delete', 'sku_delete')
- `registry_submissions.entity_type`: IN ('company', 'product', 'sku')
- `registry_submissions.status`: IN ('draft', 'submitted', 'tier2_verified', 'tier1_approved', 'tier2_implemented', 'completed', 'rejected')

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
    'public.companies'::regclass,
    'public.products'::regclass,
    'public.skus'::regclass,
    'public.atc_codes'::regclass,
    'public.critical_medicines'::regclass,
    'public.enforcement_actions'::regclass,
    'public.registry_submissions'::regclass
  )
  AND tgname LIKE '%updated_at%'
  AND tgisinternal = false
ORDER BY tgrelid::regclass, tgname;
```

**Expected Triggers:**
- `set_companies_updated_at`
- `set_products_updated_at`
- `set_skus_updated_at`
- `set_atc_codes_updated_at`
- `set_critical_medicines_updated_at`
- `set_enforcement_actions_updated_at`
- `set_registry_submissions_updated_at`

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
    'companies', 'products', 'skus', 'atc_codes', 
    'critical_medicines', 'enforcement_actions', 'registry_submissions'
  )
ORDER BY tablename;
```

**Expected Result:** All tables should have `rlse_enabled = true`.

---

## Task 1.1.1.7b: Verify SKU Pharmaceutical Attributes

### Critical Verification: Index on dosage_form

```sql
-- Verify index on dosage_form exists (Task 1.1.1.7b requirement)
SELECT
    indexname,
    indexdef
FROM pg_indexes
WHERE schemaname = 'public'
  AND tablename = 'skus'
  AND indexname = 'idx_skus_dosage_form';
```

**Expected Result:** Index `idx_skus_dosage_form` should exist.

### Verify Pharmaceutical Attributes are NOT NULL

```sql
-- Verify pharmaceutical attributes are NOT NULL
SELECT 
    column_name,
    is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'skus'
  AND column_name IN ('dosage_strength', 'dosage_form', 'pack_size', 'unit_of_measure');
```

**Expected Result:**
- `dosage_strength`: `is_nullable = 'NO'`
- `dosage_form`: `is_nullable = 'NO'`
- `pack_size`: `is_nullable = 'NO'`
- `unit_of_measure`: `is_nullable = 'NO'`

---

## Verification Summary

After completing all verification steps above:

- [ ] All 7 tables exist
- [ ] All columns exist with correct data types
- [ ] All pharmaceutical attributes (dosage_strength, dosage_form, pack_size, unit_of_measure) are NOT NULL
- [ ] Index `idx_skus_dosage_form` exists
- [ ] All foreign key constraints are correctly defined
- [ ] All indexes are created per specification
- [ ] All CHECK constraints are correctly defined (including state machines)
- [ ] All triggers are applied
- [ ] RLS is enabled on all tables

---

## Related Documents

- [Schema Design - RMM Tables](../../02-architecture/database/schema-design.md#rmm-tables)
- [Enforcement Cycle Specification](../../../03-governance/enforcement-cycle-specification.md)
- [Phase 1.1 Implementation Plan](../../../05-project-management/phases/Phase-1-Implementation-Plan.md)

---

**Last Updated:** 2026-01-17
