# VCI Schema Completeness Verification Report

**Task:** 1.1.1.9a  
**Purpose:** Verify VCI schema completeness against schema-design.md  
**Date:** 2026-01-13  
**Status:** ✅ VERIFIED

---

## Executive Summary

All VCI (Value Chain Intelligence) tables have been verified against the schema design document. All columns, data types, constraints, indexes, and foreign key relationships are correctly implemented.

---

## Tables Verified

### 1. aams_submissions ✅

| Column | Expected Type | Actual Type | Nullable | Constraints | Status |
|--------|---------------|-------------|----------|-------------|--------|
| id | uuid | uuid | NOT NULL | PRIMARY KEY, DEFAULT gen_random_uuid() | ✅ |
| company_id | uuid | uuid | NOT NULL | FK → companies.id | ✅ |
| year | integer | integer | NOT NULL | CHECK (2020-2100) | ✅ |
| aams_value | numeric | numeric | NULLABLE | - | ✅ |
| submission_data | jsonb | jsonb | NOT NULL | - | ✅ |
| status | text | text | NOT NULL | CHECK, DEFAULT 'draft' | ✅ |
| is_late | boolean | boolean | NULLABLE | DEFAULT false | ✅ |
| correction_of | uuid | uuid | NULLABLE | FK → aams_submissions.id | ✅ |
| submitted_by | uuid | uuid | NOT NULL | FK → users.id | ✅ |
| submitted_at | timestamptz | timestamptz | NULLABLE | - | ✅ |
| verified_by | uuid | uuid | NULLABLE | FK → users.id | ✅ |
| verified_at | timestamptz | timestamptz | NULLABLE | - | ✅ |
| approved_by | uuid | uuid | NULLABLE | FK → users.id | ✅ |
| approved_at | timestamptz | timestamptz | NULLABLE | - | ✅ |
| created_at | timestamptz | timestamptz | NULLABLE | DEFAULT now() | ✅ |
| updated_at | timestamptz | timestamptz | NULLABLE | DEFAULT now() | ✅ |

**Status CHECK Constraint:**
```sql
status = ANY (ARRAY['draft', 'submitted', 'tier2_verified', 'tier1_approved', 'completed', 'rejected'])
```

**RLS:** ✅ Enabled  
**Comment:** ✅ "Annual Average Monthly Sales submissions - quantities not financial values"

---

### 2. msq_submissions ✅

| Column | Expected Type | Actual Type | Nullable | Constraints | Status |
|--------|---------------|-------------|----------|-------------|--------|
| id | uuid | uuid | NOT NULL | PRIMARY KEY, DEFAULT gen_random_uuid() | ✅ |
| company_id | uuid | uuid | NOT NULL | FK → companies.id | ✅ |
| year | integer | integer | NOT NULL | CHECK (2020-2100) | ✅ |
| month | integer | integer | NOT NULL | CHECK (1-12) | ✅ |
| submission_data | jsonb | jsonb | NOT NULL | - | ✅ |
| status | text | text | NOT NULL | CHECK, DEFAULT 'submitted' | ✅ |
| validation_flags | jsonb | jsonb | NULLABLE | - | ✅ |
| correction_of | uuid | uuid | NULLABLE | FK → msq_submissions.id | ✅ |
| submitted_by | uuid | uuid | NOT NULL | FK → users.id | ✅ |
| submitted_at | timestamptz | timestamptz | NULLABLE | DEFAULT now() | ✅ |
| created_at | timestamptz | timestamptz | NULLABLE | DEFAULT now() | ✅ |
| updated_at | timestamptz | timestamptz | NULLABLE | DEFAULT now() | ✅ |

**Status CHECK Constraint:**
```sql
status = ANY (ARRAY['submitted', 'flagged_for_review', 'accepted', 'rejected'])
```

**RLS:** ✅ Enabled  
**Comment:** ✅ "Monthly Sales Quantities submissions - used for ECS XAMS calculations"

---

### 3. wsl_submissions ✅

| Column | Expected Type | Actual Type | Nullable | Constraints | Status |
|--------|---------------|-------------|----------|-------------|--------|
| id | uuid | uuid | NOT NULL | PRIMARY KEY, DEFAULT gen_random_uuid() | ✅ |
| company_id | uuid | uuid | NOT NULL | FK → companies.id | ✅ |
| week_ending_date | date | date | NOT NULL | - | ✅ |
| submission_data | jsonb | jsonb | NOT NULL | - | ✅ |
| status | text | text | NOT NULL | CHECK, DEFAULT 'submitted' | ✅ |
| is_late | boolean | boolean | NULLABLE | DEFAULT false | ✅ |
| is_non_compliant | boolean | boolean | NULLABLE | DEFAULT false | ✅ |
| submitted_by | uuid | uuid | NOT NULL | FK → users.id | ✅ |
| submitted_at | timestamptz | timestamptz | NULLABLE | DEFAULT now() | ✅ |
| created_at | timestamptz | timestamptz | NULLABLE | DEFAULT now() | ✅ |
| updated_at | timestamptz | timestamptz | NULLABLE | DEFAULT now() | ✅ |

**Status CHECK Constraint:**
```sql
status = ANY (ARRAY['submitted', 'late', 'non_compliant', 'accepted'])
```

**RLS:** ✅ Enabled  
**Comment:** ✅ "Weekly Stock Levels submissions - must include all SKUs"

---

### 4. thresholds ✅

| Column | Expected Type | Actual Type | Nullable | Constraints | Status |
|--------|---------------|-------------|----------|-------------|--------|
| id | uuid | uuid | NOT NULL | PRIMARY KEY, DEFAULT gen_random_uuid() | ✅ |
| sku_id | uuid | uuid | NULLABLE | FK → skus.id | ✅ |
| threshold_type | text | text | NOT NULL | CHECK (vci, ecs) | ✅ |
| threshold_value | numeric | numeric | NOT NULL | - | ✅ |
| multiplier_b | numeric | numeric | NOT NULL | DEFAULT 3.0 | ✅ |
| aams_value | numeric | numeric | NOT NULL | - | ✅ |
| effective_from | date | date | NOT NULL | - | ✅ |
| effective_to | date | date | NULLABLE | - | ✅ |
| is_current | boolean | boolean | NULLABLE | DEFAULT true | ✅ |
| duration_type | text | text | NULLABLE | CHECK, DEFAULT 'permanent' | ✅ |
| revert_date | date | date | NULLABLE | - | ✅ |
| revert_to_multiplier | numeric | numeric | NULLABLE | - | ✅ |
| revert_to_threshold_value | numeric | numeric | NULLABLE | - | ✅ |
| revert_notification_sent_7d | boolean | boolean | NULLABLE | DEFAULT false | ✅ |
| revert_notification_sent_1d | boolean | boolean | NULLABLE | DEFAULT false | ✅ |
| revert_notification_sent_on_revert | boolean | boolean | NULLABLE | DEFAULT false | ✅ |
| requires_manual_review | boolean | boolean | NULLABLE | DEFAULT false | ✅ |
| created_by | uuid | uuid | NOT NULL | FK → users.id | ✅ |
| created_at | timestamptz | timestamptz | NULLABLE | DEFAULT now() | ✅ |
| updated_at | timestamptz | timestamptz | NULLABLE | DEFAULT now() | ✅ |

**CHECK Constraints:**
```sql
threshold_type = ANY (ARRAY['vci', 'ecs'])
duration_type = ANY (ARRAY['permanent', 'temporary_auto_revert', 'temporary_manual_review'])
```

**RLS:** ✅ Enabled  
**Comment:** ✅ "VCI thresholds (B × AAMS) - supports temporary and permanent thresholds"

---

### 5. breaches ✅

| Column | Expected Type | Actual Type | Nullable | Constraints | Status |
|--------|---------------|-------------|----------|-------------|--------|
| id | uuid | uuid | NOT NULL | PRIMARY KEY, DEFAULT gen_random_uuid() | ✅ |
| sku_id | uuid | uuid | NOT NULL | FK → skus.id | ✅ |
| company_id | uuid | uuid | NOT NULL | FK → companies.id | ✅ |
| wsl_submission_id | uuid | uuid | NOT NULL | FK → wsl_submissions.id | ✅ |
| threshold_id | uuid | uuid | NOT NULL | FK → thresholds.id | ✅ |
| stock_level | numeric | numeric | NOT NULL | - | ✅ |
| threshold_value | numeric | numeric | NOT NULL | - | ✅ |
| breach_date | date | date | NOT NULL | - | ✅ |
| breach_reason | text | text | NULLABLE | - | ✅ |
| replenishment_date | date | date | NULLABLE | - | ✅ |
| priority | text | text | NOT NULL | CHECK, DEFAULT 'standard' | ✅ |
| status | text | text | NOT NULL | CHECK, DEFAULT 'detected' | ✅ |
| created_at | timestamptz | timestamptz | NULLABLE | DEFAULT now() | ✅ |
| updated_at | timestamptz | timestamptz | NULLABLE | DEFAULT now() | ✅ |

**CHECK Constraints:**
```sql
priority = ANY (ARRAY['standard', 'high', 'critical'])
status = ANY (ARRAY['detected', 'tier2_analyzing', 'tier2_suggested', 'tier1_reviewed', 'action_taken', 'completed'])
```

**RLS:** ✅ Enabled  
**Comment:** ✅ "Threshold breach records"

---

### 6. breach_analyses ✅

| Column | Expected Type | Actual Type | Nullable | Constraints | Status |
|--------|---------------|-------------|----------|-------------|--------|
| id | uuid | uuid | NOT NULL | PRIMARY KEY, DEFAULT gen_random_uuid() | ✅ |
| breach_id | uuid | uuid | NOT NULL | FK → breaches.id | ✅ |
| analyzed_by | uuid | uuid | NOT NULL | FK → users.id | ✅ |
| suggested_action | text | text | NOT NULL | CHECK | ✅ |
| suggested_action_details | text | text | NULLABLE | - | ✅ |
| analysis_notes | text | text | NULLABLE | - | ✅ |
| analyzed_at | timestamptz | timestamptz | NULLABLE | DEFAULT now() | ✅ |
| created_at | timestamptz | timestamptz | NULLABLE | DEFAULT now() | ✅ |

**CHECK Constraint:**
```sql
suggested_action = ANY (ARRAY['warning', 'require_replenishment_plan', 'require_production_plan', 'enhanced_monitoring', 'escalate'])
```

**RLS:** ✅ Enabled  
**Comment:** ✅ "Tier 2 analysis of breaches"

---

## Foreign Key Relationships

```
companies ←── aams_submissions.company_id
companies ←── msq_submissions.company_id
companies ←── wsl_submissions.company_id
companies ←── breaches.company_id

users ←── aams_submissions.submitted_by/verified_by/approved_by
users ←── msq_submissions.submitted_by
users ←── wsl_submissions.submitted_by
users ←── thresholds.created_by
users ←── breach_analyses.analyzed_by

skus ←── thresholds.sku_id
skus ←── breaches.sku_id

wsl_submissions ←── breaches.wsl_submission_id
thresholds ←── breaches.threshold_id
breaches ←── breach_analyses.breach_id

aams_submissions ←── aams_submissions.correction_of (self-reference)
msq_submissions ←── msq_submissions.correction_of (self-reference)
```

---

## Summary

| Table | Columns | Constraints | FK Relations | RLS | Status |
|-------|---------|-------------|--------------|-----|--------|
| aams_submissions | 16/16 | ✅ | ✅ | ✅ | ✅ |
| msq_submissions | 12/12 | ✅ | ✅ | ✅ | ✅ |
| wsl_submissions | 11/11 | ✅ | ✅ | ✅ | ✅ |
| thresholds | 20/20 | ✅ | ✅ | ✅ | ✅ |
| breaches | 14/14 | ✅ | ✅ | ✅ | ✅ |
| breach_analyses | 8/8 | ✅ | ✅ | ✅ | ✅ |

**Total:** 6/6 tables verified ✅

---

## Phase 0.6 Updates Verified

### Time-Bound Threshold Modifications ✅
- `duration_type` column with CHECK constraint
- `revert_date` column
- `revert_to_multiplier` column
- `revert_to_threshold_value` column
- Notification tracking columns (`revert_notification_sent_7d/1d/on_revert`)
- `requires_manual_review` column

### Correction Tracking ✅
- `aams_submissions.correction_of` self-referential FK
- `msq_submissions.correction_of` self-referential FK

---

## Verification Method

1. Used `mcp_supabase_list_tables` to get full table schemas
2. Compared each column against `schema-design.md` specifications
3. Verified data types, constraints, and nullable rules
4. Verified foreign key relationships
5. Confirmed RLS is enabled on all tables
6. Verified Phase 0.6 additions (time-bound thresholds)

---

**Verified By:** Automated verification via Supabase MCP  
**Date:** 2026-01-13
