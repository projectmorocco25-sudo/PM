# Seed Migration Schema Audit Report
**Date:** 2026-01-16  
**Status:** Schema mismatches identified - fixes required

---

## Schema Audit Results

### ✅ Tables Exist:
All 11 required tables exist in database.

### ❌ Schema Mismatches Found:

#### 1. **atc_codes** table
- **Missing columns in DB:** `level`
- **Actual schema:** id, code, description, is_active, created_at, updated_at
- **Impact:** Seed file tries to insert `level` column (ATC hierarchy level 1-4)
- **Fix:** Remove `level` column from all ATC inserts

#### 2. **companies** table  
- **Constraint:** `company_type` must be lowercase: `'ipc'` or `'wholesaler'`
- **Seed had:** `'IPC'` (uppercase)
- **Fix:** ✅ Already fixed to lowercase

#### 3. **products** table
- **Missing in DB:** `atc_code_id`
- **Actual schema:** id, company_id, name, description, is_critical_medicine, is_active, deactivated_at/by/reason, created_at, updated_at
- **Impact:** Seed tries to link products to ATC codes
- **Fix:** Remove `atc_code_id` from products (keep only in SKUs)

#### 4. **skus** table
- **Schema:** ✅ Correct (has atc_code_id, all pharma attributes)
- **Required fields:** dosage_strength, dosage_form, pack_size, unit_of_measure (all NOT NULL)

#### 5. **registry_submissions** table
- **Required columns:** `submitted_by` (NOT NULL)
- **Missing in DB:** `completed_at`
- **entity_type constraint:** ONLY `['company', 'product', 'sku']`
- **Status includes:** 'completed' (no separate completed_at timestamp)
- **Impact:** 
  - All inserts missing `submitted_by`
  - MOH entity types ('atc_code', 'critical_medicine_designation') not allowed
  - Trying to use `completed_at` column that doesn't exist
- **Fix:** 
  - Add `submitted_by` to ALL 16 records
  - Remove MOH workflow records with invalid entity_types
  - Remove `completed_at` from completed state records

#### 6. **enforcement_actions** table
- **Required:** `created_by` (NOT NULL)
- **Constraints:**
  - action_type: `['warning', 'fine', 'suspension']`
  - violation_type: `['submission_non_compliance', 'threshold_breach', 'critical_medicine_non_compliance', 'export_violation', 'data_quality_issue', 'repeated_offender']`
  - status: `['draft', 'pending_review', 'pending_approval', 'approved', 'executed', 'appealed', 'resolved', 'cancelled']`
- **Impact:** All inserts missing `created_by`
- **Fix:** Add `created_by` to all 15 enforcement_actions

#### 7. **enforcement_action_appeals** table
- **Required:** `submitted_by` (NOT NULL)
- **Status constraint:** `['submitted', 'tier2_reviewed', 'tier1_reviewed', 'upheld', 'rejected', 'withdrawn']`
- **Fix:** Verify all appeals have `submitted_by`

#### 8. **audit_logs** table
- **Required:** `entry_data` jsonb (NOT NULL)
- **Fix:** ✅ Already fixed

---

## Fix Strategy

1. ✅ seed_1_1_1_foundation.sql - Apply schema fixes
2. ❌ seed_1_1_2_rmm.sql - Needs comprehensive fixes:
   - Remove `level` from atc_codes (23 records)
   - Remove `atc_code_id` from products (4 records)  
   - Add `submitted_by` + workflow actor columns to registry_submissions (16 records)
   - Remove `completed_at` from completed submissions
   - Remove invalid entity_type records (MOH workflow)
   - Add `created_by` to enforcement_actions (15 records)
   - Verify enforcement_action_appeals (2 records)

---

## Estimated Fixes Needed

- **ATC codes:** 2 INSERT statements (remove level)
- **Products:** 4 INSERT statements (remove atc_code_id)
- **Registry submissions:** 16 INSERT statements (add submitted_by, remove completed_at, fix MOH records)
- **Enforcement actions:** 15 INSERT statements (add created_by)
- **Enforcement appeals:** 2 INSERT statements (verify submitted_by)

**Total:** ~39 INSERT statement fixes
