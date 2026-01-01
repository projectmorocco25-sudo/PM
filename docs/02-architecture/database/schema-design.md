# Database Schema Design - Pharmaceutical Governance Value Chain Platform (PM)

**Purpose:** This document defines the complete database schema for the PM platform, including all tables, columns, data types, constraints, and relationships.

**Last Updated:** 2025-12-31  
**Status:** ✅ Complete (Phase 0, Week 2)  
**Owner:** Nadia

## Overview

The PM platform uses PostgreSQL (via Supabase) with a modular schema design supporting four modules: RMM (Registry Management Module), VCI (Value Chain Intelligence), ECS (Export Control System), and CMC (Compliance Monitoring Center).

## Schema Design Principles

1. **Modular Design:** Tables organized by module, with clear ownership
2. **Data Integrity:** Foreign keys, constraints, and validation rules
3. **Audit Trail:** All tables include `created_at`, `updated_at`, and audit fields
4. **Soft Deletes:** Use `is_active` or `deleted_at` to preserve regulatory history
5. **RLS Ready:** All tables designed to support Row Level Security policies
6. **Versioning:** Where needed (thresholds, compliance scores), version history supported

## Core Tables (Shared)

### users
**Purpose:** System users (extends Supabase Auth)

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PRIMARY KEY, REFERENCES auth.users(id) | User ID (from Supabase Auth) |
| email | text | UNIQUE, NOT NULL | User email |
| full_name | text | | User full name |
| company_id | uuid | REFERENCES companies(id), NULLABLE | Company ID (NULL for MOH users) |
| role | text | NOT NULL | User role (tier1, tier2_officer, tier2_registrar, company_admin, company_manager, company_user, auditor, system_admin, vendor) |
| is_active | boolean | DEFAULT true | User active status |
| created_at | timestamptz | DEFAULT now() | Creation timestamp |
| updated_at | timestamptz | DEFAULT now() | Last update timestamp |

**Indexes:**
- `idx_users_company_id` on `company_id`
- `idx_users_role` on `role`

**Notes:**
- Company users: `company_id` is set (belong to one company)
- MOH users: `company_id` is NULL (system-wide access)
- RLS policies check `company_id` for data isolation

---

### system_config
**Purpose:** Module activation and system settings

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PRIMARY KEY, DEFAULT gen_random_uuid() | Config ID |
| module_name | text | UNIQUE, NOT NULL | Module name (rmm, vci, ecs, cmc) |
| is_active | boolean | DEFAULT false | Module active status |
| activated_at | timestamptz | NULLABLE | Activation timestamp |
| activated_by | uuid | REFERENCES users(id), NULLABLE | User who activated |
| config_data | jsonb | | Module-specific configuration |
| created_at | timestamptz | DEFAULT now() | Creation timestamp |
| updated_at | timestamptz | DEFAULT now() | Last update timestamp |

**Indexes:**
- `idx_system_config_module_name` on `module_name`

**Notes:**
- RMM and VCI must be active (core modules)
- ECS and CMC are optional (license controlled)

---

### notifications
**Purpose:** In-app notifications (system of record)

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PRIMARY KEY, DEFAULT gen_random_uuid() | Notification ID |
| user_id | uuid | REFERENCES users(id), NOT NULL | Recipient user ID |
| type | text | NOT NULL | Notification type (submission_status, breach_alert, approval_required, etc.) |
| title | text | NOT NULL | Notification title |
| message | text | NOT NULL | Notification message |
| link | text | | Link to related entity |
| is_read | boolean | DEFAULT false | Read status |
| read_at | timestamptz | NULLABLE | Read timestamp |
| created_at | timestamptz | DEFAULT now() | Creation timestamp |

**Indexes:**
- `idx_notifications_user_id` on `user_id`
- `idx_notifications_is_read` on `is_read`
- `idx_notifications_created_at` on `created_at`

---

### audit_logs
**Purpose:** Comprehensive audit trail (hash-chained)

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PRIMARY KEY, DEFAULT gen_random_uuid() | Audit log ID |
| previous_hash | text | NULLABLE | Hash of previous audit log entry (hash chaining) |
| current_hash | text | NOT NULL | Hash of this entry |
| user_id | uuid | REFERENCES users(id), NULLABLE | User who performed action (NULL for system operations) |
| operation_type | text | NOT NULL | Operation type (create, update, delete, approve, etc.) |
| table_name | text | NOT NULL | Table name |
| record_id | uuid | NULLABLE | Record ID |
| old_values | jsonb | NULLABLE | Old values (for updates/deletes) |
| new_values | jsonb | NULLABLE | New values (for creates/updates) |
| reason | text | NULLABLE | Reason/justification |
| ip_address | inet | NULLABLE | IP address |
| user_agent | text | NULLABLE | User agent |
| created_at | timestamptz | DEFAULT now() | Creation timestamp |

**Indexes:**
- `idx_audit_logs_user_id` on `user_id`
- `idx_audit_logs_table_name` on `table_name`
- `idx_audit_logs_created_at` on `created_at`
- `idx_audit_logs_operation_type` on `operation_type`

**Notes:**
- Hash chaining ensures immutability
- All system operations logged (service role, scheduled jobs)
- Retained for 7 years (regulatory requirement)

---

## RMM Module Tables

### companies
**Purpose:** IPC and Wholesaler companies

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PRIMARY KEY, DEFAULT gen_random_uuid() | Company ID |
| name | text | NOT NULL | Company name |
| registration_number | text | UNIQUE, NOT NULL | Registration number |
| company_type | text | NOT NULL | Company type (ipc, wholesaler) |
| address | text | | Company address |
| contact_email | text | | Contact email |
| contact_phone | text | | Contact phone |
| is_active | boolean | DEFAULT true | Active status |
| suspended_at | timestamptz | NULLABLE | Suspension timestamp |
| suspended_by | uuid | REFERENCES users(id), NULLABLE | User who suspended |
| suspended_reason | text | NULLABLE | Suspension reason |
| created_at | timestamptz | DEFAULT now() | Creation timestamp |
| updated_at | timestamptz | DEFAULT now() | Last update timestamp |

**Indexes:**
- `idx_companies_registration_number` on `registration_number`
- `idx_companies_company_type` on `company_type`
- `idx_companies_is_active` on `is_active`

**Cascade Rules:**
- When company is deactivated → products and SKUs cascade to deactivated

---

### products
**Purpose:** Products belong to companies

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PRIMARY KEY, DEFAULT gen_random_uuid() | Product ID |
| company_id | uuid | REFERENCES companies(id), NOT NULL | Company ID |
| name | text | NOT NULL | Product name |
| description | text | | Product description |
| is_critical_medicine | boolean | DEFAULT false | Critical medicine designation |
| is_active | boolean | DEFAULT true | Active status |
| deactivated_at | timestamptz | NULLABLE | Deactivation timestamp |
| deactivated_by | uuid | REFERENCES users(id), NULLABLE | User who deactivated |
| deactivated_reason | text | NULLABLE | Deactivation reason |
| created_at | timestamptz | DEFAULT now() | Creation timestamp |
| updated_at | timestamptz | DEFAULT now() | Last update timestamp |

**Indexes:**
- `idx_products_company_id` on `company_id`
- `idx_products_is_critical_medicine` on `is_critical_medicine`
- `idx_products_is_active` on `is_active`

**Cascade Rules:**
- When product is deactivated → SKUs cascade to deactivated

---

### skus
**Purpose:** SKUs belong to products

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PRIMARY KEY, DEFAULT gen_random_uuid() | SKU ID |
| product_id | uuid | REFERENCES products(id), NOT NULL | Product ID |
| sku_code | text | NOT NULL | SKU code |
| name | text | NOT NULL | SKU name |
| atc_code_id | uuid | REFERENCES atc_codes(id), NULLABLE | ATC code ID |
| is_moh_authorized_unregistered | boolean | DEFAULT false | MOH-authorized unregistered product |
| is_active | boolean | DEFAULT true | Active status |
| deactivated_at | timestamptz | NULLABLE | Deactivation timestamp |
| deactivated_by | uuid | REFERENCES users(id), NULLABLE | User who deactivated |
| deactivated_reason | text | NULLABLE | Deactivation reason |
| created_at | timestamptz | DEFAULT now() | Creation timestamp |
| updated_at | timestamptz | DEFAULT now() | Last update timestamp |

**Indexes:**
- `idx_skus_product_id` on `product_id`
- `idx_skus_atc_code_id` on `atc_code_id`
- `idx_skus_is_active` on `is_active`

---

### atc_codes
**Purpose:** ATC codes (MOH-controlled, read-only for companies)

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PRIMARY KEY, DEFAULT gen_random_uuid() | ATC code ID |
| code | text | UNIQUE, NOT NULL | ATC code |
| description | text | | Description |
| is_active | boolean | DEFAULT true | Active status |
| created_at | timestamptz | DEFAULT now() | Creation timestamp |
| updated_at | timestamptz | DEFAULT now() | Last update timestamp |

**Indexes:**
- `idx_atc_codes_code` on `code`

**Notes:**
- MOH-controlled (companies have read-only access)

---

### critical_medicines
**Purpose:** Critical medicine designations (MOH-controlled)

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PRIMARY KEY, DEFAULT gen_random_uuid() | Critical medicine ID |
| sku_id | uuid | REFERENCES skus(id), NOT NULL | SKU ID |
| designated_at | timestamptz | DEFAULT now() | Designation timestamp |
| designated_by | uuid | REFERENCES users(id), NOT NULL | User who designated |
| is_active | boolean | DEFAULT true | Active status |
| created_at | timestamptz | DEFAULT now() | Creation timestamp |
| updated_at | timestamptz | DEFAULT now() | Last update timestamp |

**Indexes:**
- `idx_critical_medicines_sku_id` on `sku_id`

**Notes:**
- MOH-controlled (companies have read-only access)

---

### registry_submissions
**Purpose:** Registry update submissions (companies, products, SKUs)

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PRIMARY KEY, DEFAULT gen_random_uuid() | Submission ID |
| submission_type | text | NOT NULL | Submission type (company_create, company_update, product_create, product_update, sku_create, sku_update, company_delete, product_delete, sku_delete) |
| entity_type | text | NOT NULL | Entity type (company, product, sku) |
| entity_id | uuid | NULLABLE | Entity ID (for updates/deletes) |
| submission_data | jsonb | NOT NULL | Submission data (JSON) |
| status | text | NOT NULL, DEFAULT 'draft' | Status (draft, submitted, tier2_verified, tier1_approved, tier2_implemented, completed, rejected) |
| submitted_by | uuid | REFERENCES users(id), NOT NULL | User who submitted |
| verified_by | uuid | REFERENCES users(id), NULLABLE | Tier 2 Officer who verified |
| verified_at | timestamptz | NULLABLE | Verification timestamp |
| approved_by | uuid | REFERENCES users(id), NULLABLE | Tier 1 who approved |
| approved_at | timestamptz | NULLABLE | Approval timestamp |
| implemented_by | uuid | REFERENCES users(id), NULLABLE | Tier 2 Registrar who implemented |
| implemented_at | timestamptz | NULLABLE | Implementation timestamp |
| rejection_reason | text | NULLABLE | Rejection reason |
| created_at | timestamptz | DEFAULT now() | Creation timestamp |
| updated_at | timestamptz | DEFAULT now() | Last update timestamp |

**Indexes:**
- `idx_registry_submissions_status` on `status`
- `idx_registry_submissions_submitted_by` on `submitted_by`
- `idx_registry_submissions_entity_type` on `entity_type`

---

### approvals
**Purpose:** Approval history for all workflows

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PRIMARY KEY, DEFAULT gen_random_uuid() | Approval ID |
| submission_id | uuid | NULLABLE | Submission ID (for registry submissions) |
| submission_type | text | NOT NULL | Submission type (registry, aams, export_request, etc.) |
| from_status | text | NOT NULL | Previous status |
| to_status | text | NOT NULL | New status |
| approver_id | uuid | REFERENCES users(id), NOT NULL | User who approved |
| approval_type | text | NOT NULL | Approval type (verify, approve, implement, reject) |
| comments | text | NULLABLE | Comments |
| created_at | timestamptz | DEFAULT now() | Approval timestamp |

**Indexes:**
- `idx_approvals_submission_id` on `submission_id`
- `idx_approvals_approver_id` on `approver_id`
- `idx_approvals_created_at` on `created_at`

---

## VCI Module Tables

### aams_submissions
**Purpose:** Annual Average Monthly Sales submissions

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PRIMARY KEY, DEFAULT gen_random_uuid() | Submission ID |
| company_id | uuid | REFERENCES companies(id), NOT NULL | Company ID |
| year | integer | NOT NULL | Year (calendar year) |
| aams_value | numeric(15,2) | NOT NULL | AAMS value |
| submission_data | jsonb | NULLABLE | Full submission data (monthly breakdown) |
| status | text | NOT NULL, DEFAULT 'draft' | Status (draft, submitted, tier2_verified, tier1_approved, completed, rejected) |
| is_late | boolean | DEFAULT false | Late submission flag |
| correction_of | uuid | REFERENCES aams_submissions(id), NULLABLE | Original submission ID (if correction) |
| submitted_by | uuid | REFERENCES users(id), NOT NULL | User who submitted |
| submitted_at | timestamptz | NULLABLE | Submission timestamp |
| verified_by | uuid | REFERENCES users(id), NULLABLE | Tier 2 Officer who verified |
| verified_at | timestamptz | NULLABLE | Verification timestamp |
| approved_by | uuid | REFERENCES users(id), NULLABLE | Tier 1 who approved |
| approved_at | timestamptz | NULLABLE | Approval timestamp |
| created_at | timestamptz | DEFAULT now() | Creation timestamp |
| updated_at | timestamptz | DEFAULT now() | Last update timestamp |

**Indexes:**
- `idx_aams_submissions_company_id` on `company_id`
- `idx_aams_submissions_year` on `year`
- `idx_aams_submissions_status` on `status`

**Notes:**
- Must be submitted by January 31st (15-day grace period until February 15th)
- Corrections tracked via `correction_of` reference

---

### msq_submissions
**Purpose:** Monthly Sales Quantities submissions

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PRIMARY KEY, DEFAULT gen_random_uuid() | Submission ID |
| company_id | uuid | REFERENCES companies(id), NOT NULL | Company ID |
| year | integer | NOT NULL | Year |
| month | integer | NOT NULL, CHECK (month >= 1 AND month <= 12) | Month (1-12) |
| submission_data | jsonb | NOT NULL | Submission data (SKU quantities) |
| status | text | NOT NULL, DEFAULT 'submitted' | Status (submitted, flagged_for_review, accepted, rejected) |
| validation_flags | jsonb | NULLABLE | Validation flags (anomalies detected) |
| correction_of | uuid | REFERENCES msq_submissions(id), NULLABLE | Original submission ID (if correction) |
| submitted_by | uuid | REFERENCES users(id), NOT NULL | User who submitted |
| submitted_at | timestamptz | DEFAULT now() | Submission timestamp |
| created_at | timestamptz | DEFAULT now() | Creation timestamp |
| updated_at | timestamptz | DEFAULT now() | Last update timestamp |

**Indexes:**
- `idx_msq_submissions_company_id` on `company_id`
- `idx_msq_submissions_year_month` on `year, month`
- `idx_msq_submissions_status` on `status`

**Notes:**
- 7-day grace period for corrections
- Used for ECS XAMS calculations (default X=6 months)

---

### wsl_submissions
**Purpose:** Weekly Stock Levels submissions

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PRIMARY KEY, DEFAULT gen_random_uuid() | Submission ID |
| company_id | uuid | REFERENCES companies(id), NOT NULL | Company ID |
| week_ending_date | date | NOT NULL | Week ending date (Friday) |
| submission_data | jsonb | NOT NULL | Submission data (all SKUs with stock levels) |
| status | text | NOT NULL, DEFAULT 'submitted' | Status (submitted, late, non_compliant, accepted) |
| is_late | boolean | DEFAULT false | Late submission flag |
| is_non_compliant | boolean | DEFAULT false | Non-compliant flag |
| submitted_by | uuid | REFERENCES users(id), NOT NULL | User who submitted |
| submitted_at | timestamptz | DEFAULT now() | Submission timestamp |
| created_at | timestamptz | DEFAULT now() | Creation timestamp |
| updated_at | timestamptz | DEFAULT now() | Last update timestamp |

**Indexes:**
- `idx_wsl_submissions_company_id` on `company_id`
- `idx_wsl_submissions_week_ending_date` on `week_ending_date`
- `idx_wsl_submissions_status` on `status`

**Notes:**
- Must include all SKUs at once (complete submission)
- Must be submitted by Friday EOD (late if after Friday, non-compliant if after Monday)

---

### thresholds
**Purpose:** VCI thresholds (B × AAMS)

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PRIMARY KEY, DEFAULT gen_random_uuid() | Threshold ID |
| sku_id | uuid | REFERENCES skus(id), NULLABLE | SKU ID (NULL for global threshold) |
| threshold_type | text | NOT NULL | Threshold type (vci, ecs) |
| threshold_value | numeric(15,2) | NOT NULL | Threshold value |
| multiplier_b | numeric(5,2) | NOT NULL | Multiplier B (default 3.0 for standard, 3.5 for critical) |
| aams_value | numeric(15,2) | NOT NULL | AAMS value used for calculation |
| effective_from | date | NOT NULL | Effective from date |
| effective_to | date | NULLABLE | Effective to date (NULL for current) |
| is_current | boolean | DEFAULT true | Current threshold flag |
| created_by | uuid | REFERENCES users(id), NOT NULL | User who created |
| created_at | timestamptz | DEFAULT now() | Creation timestamp |
| updated_at | timestamptz | DEFAULT now() | Last update timestamp |

**Indexes:**
- `idx_thresholds_sku_id` on `sku_id`
- `idx_thresholds_threshold_type` on `threshold_type`
- `idx_thresholds_effective_from` on `effective_from`
- `idx_thresholds_is_current` on `is_current`

**Notes:**
- Version history supported (non-retroactive changes)
- Query current: `WHERE is_current = true AND sku_id = ? OR sku_id IS NULL`
- ECS Threshold switches from VCI Threshold when export authorized

---

### breaches
**Purpose:** Threshold breach records

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PRIMARY KEY, DEFAULT gen_random_uuid() | Breach ID |
| sku_id | uuid | REFERENCES skus(id), NOT NULL | SKU ID |
| company_id | uuid | REFERENCES companies(id), NOT NULL | Company ID |
| wsl_submission_id | uuid | REFERENCES wsl_submissions(id), NOT NULL | WSL submission ID |
| threshold_id | uuid | REFERENCES thresholds(id), NOT NULL | Threshold ID |
| stock_level | numeric(15,2) | NOT NULL | Stock level at breach |
| threshold_value | numeric(15,2) | NOT NULL | Threshold value |
| breach_date | date | NOT NULL | Breach date |
| breach_reason | text | NULLABLE | Company-provided reason |
| replenishment_date | date | NULLABLE | Replenishment date |
| priority | text | NOT NULL, DEFAULT 'standard' | Priority (standard, high, critical) |
| status | text | NOT NULL, DEFAULT 'detected' | Status (detected, tier2_analyzing, tier2_suggested, tier1_reviewed, action_taken, completed) |
| created_at | timestamptz | DEFAULT now() | Creation timestamp |
| updated_at | timestamptz | DEFAULT now() | Last update timestamp |

**Indexes:**
- `idx_breaches_sku_id` on `sku_id`
- `idx_breaches_company_id` on `company_id`
- `idx_breaches_status` on `status`
- `idx_breaches_priority` on `priority`

---

### breach_analyses
**Purpose:** Tier 2 analysis of breaches

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PRIMARY KEY, DEFAULT gen_random_uuid() | Analysis ID |
| breach_id | uuid | REFERENCES breaches(id), NOT NULL | Breach ID |
| analyzed_by | uuid | REFERENCES users(id), NOT NULL | Tier 2 Officer who analyzed |
| suggested_action | text | NOT NULL | Suggested action (warning, require_replenishment_plan, require_production_plan, enhanced_monitoring, escalate) |
| suggested_action_details | text | NULLABLE | Action details |
| analysis_notes | text | NULLABLE | Analysis notes |
| analyzed_at | timestamptz | DEFAULT now() | Analysis timestamp |
| created_at | timestamptz | DEFAULT now() | Creation timestamp |

**Indexes:**
- `idx_breach_analyses_breach_id` on `breach_id`
- `idx_breach_analyses_analyzed_by` on `analyzed_by`

---

## ECS Module Tables

### export_requests
**Purpose:** Export authorization requests

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PRIMARY KEY, DEFAULT gen_random_uuid() | Request ID |
| company_id | uuid | REFERENCES companies(id), NOT NULL | Company ID |
| sku_id | uuid | REFERENCES skus(id), NOT NULL | SKU ID |
| quantity | numeric(15,2) | NOT NULL | Export quantity |
| destination_country | text | NOT NULL | Destination country |
| destination_details | text | NULLABLE | Destination details |
| requested_export_date | date | NOT NULL | Requested export date |
| supporting_documentation | jsonb | NULLABLE | Supporting documentation (file references) |
| stock_confirmation | boolean | DEFAULT false | Stock confirmation |
| status | text | NOT NULL, DEFAULT 'draft' | Status (draft, submitted, auto_approval_queue, tier2_verification, tier1_review, approved, authorized, rejected, cancelled) |
| conditional_validation_result | jsonb | NULLABLE | Conditional validation result (CMC score check) |
| xams_value | numeric(15,2) | NULLABLE | XAMS value used for threshold calculation |
| ecs_threshold_value | numeric(15,2) | NULLABLE | ECS threshold value |
| intervention_window_end | timestamptz | NULLABLE | Intervention window end (2 working days default) |
| submitted_by | uuid | REFERENCES users(id), NOT NULL | User who submitted |
| submitted_at | timestamptz | NULLABLE | Submission timestamp |
| verified_by | uuid | REFERENCES users(id), NULLABLE | Tier 2 Officer who verified |
| verified_at | timestamptz | NULLABLE | Verification timestamp |
| approved_by | uuid | REFERENCES users(id), NULLABLE | Tier 1 who approved |
| approved_at | timestamptz | NULLABLE | Approval timestamp |
| rejected_by | uuid | REFERENCES users(id), NULLABLE | User who rejected |
| rejected_reason | text | NULLABLE | Rejection reason |
| cancelled_by | uuid | REFERENCES users(id), NULLABLE | User who cancelled |
| cancelled_at | timestamptz | NULLABLE | Cancellation timestamp |
| created_at | timestamptz | DEFAULT now() | Creation timestamp |
| updated_at | timestamptz | DEFAULT now() | Last update timestamp |

**Indexes:**
- `idx_export_requests_company_id` on `company_id`
- `idx_export_requests_sku_id` on `sku_id`
- `idx_export_requests_status` on `status`

---

### export_authorizations
**Purpose:** Approved export authorizations

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PRIMARY KEY, DEFAULT gen_random_uuid() | Authorization ID |
| export_request_id | uuid | REFERENCES export_requests(id), NOT NULL | Export request ID |
| authorization_number | text | UNIQUE, NOT NULL | Authorization number |
| valid_from | date | NOT NULL | Valid from date |
| valid_until | date | NOT NULL | Valid until date (90 calendar days) |
| status | text | NOT NULL, DEFAULT 'authorized' | Status (authorized, completed, expired, revoked, cancelled) |
| completed_at | timestamptz | NULLABLE | Completion timestamp |
| expired_at | timestamptz | NULLABLE | Expiration timestamp |
| revoked_at | timestamptz | NULLABLE | Revocation timestamp |
| revoked_by | uuid | REFERENCES users(id), NULLABLE | User who revoked |
| revoked_reason | text | NULLABLE | Revocation reason |
| threshold_switch_date | date | NULLABLE | Date threshold switched to ECS Threshold |
| threshold_revert_date | date | NULLABLE | Date threshold reverts to VCI Threshold (3 months) |
| created_at | timestamptz | DEFAULT now() | Creation timestamp |
| updated_at | timestamptz | DEFAULT now() | Last update timestamp |

**Indexes:**
- `idx_export_authorizations_export_request_id` on `export_request_id`
- `idx_export_authorizations_authorization_number` on `authorization_number`
- `idx_export_authorizations_status` on `status`
- `idx_export_authorizations_valid_until` on `valid_until`

**Notes:**
- Valid for 90 calendar days from approval
- Triggers threshold switch (VCI → ECS) for 3 months
- Triggers CMC score recalculation (event-triggered)

---

### export_completions
**Purpose:** Export completion records

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PRIMARY KEY, DEFAULT gen_random_uuid() | Completion ID |
| export_authorization_id | uuid | REFERENCES export_authorizations(id), NOT NULL | Export authorization ID |
| actual_export_date | date | NOT NULL | Actual export date |
| actual_quantity | numeric(15,2) | NOT NULL | Actual quantity |
| shipping_details | text | NULLABLE | Shipping details |
| destination_confirmation | text | NULLABLE | Destination confirmation |
| reported_by | uuid | REFERENCES users(id), NOT NULL | User who reported |
| reported_at | timestamptz | DEFAULT now() | Report timestamp |
| verified_by | uuid | REFERENCES users(id), NULLABLE | Tier 2 Officer who verified |
| verified_at | timestamptz | NULLABLE | Verification timestamp |
| created_at | timestamptz | DEFAULT now() | Creation timestamp |
| updated_at | timestamptz | DEFAULT now() | Last update timestamp |

**Indexes:**
- `idx_export_completions_export_authorization_id` on `export_authorization_id`

**Notes:**
- Must be reported within 7 days of export

---

### replenishment_schedules
**Purpose:** Replenishment plans for exports

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PRIMARY KEY, DEFAULT gen_random_uuid() | Schedule ID |
| export_authorization_id | uuid | REFERENCES export_authorizations(id), NOT NULL | Export authorization ID |
| planned_replenishment_date | date | NOT NULL | Planned replenishment date |
| planned_quantity | numeric(15,2) | NOT NULL | Planned quantity |
| status | text | NOT NULL, DEFAULT 'pending' | Status (pending, on_time, delayed, completed, missed) |
| delay_days | integer | DEFAULT 0 | Delay days |
| escalation_stage | text | NULLABLE | Escalation stage (initial_alert, warning, escalation, critical) |
| proof_of_replenishment | jsonb | NULLABLE | Proof of replenishment (file references) |
| verified_by | uuid | REFERENCES users(id), NULLABLE | Tier 2 Officer who verified |
| verified_at | timestamptz | NULLABLE | Verification timestamp |
| created_at | timestamptz | DEFAULT now() | Creation timestamp |
| updated_at | timestamptz | DEFAULT now() | Last update timestamp |

**Indexes:**
- `idx_replenishment_schedules_export_authorization_id` on `export_authorization_id`
- `idx_replenishment_schedules_status` on `status`
- `idx_replenishment_schedules_planned_replenishment_date` on `planned_replenishment_date`

**Notes:**
- Used for CMC Replenishment Plan Adherence component
- Tiered escalation process for delays

---

## CMC Module Tables

### compliance_scores
**Purpose:** Monthly compliance scores (frozen snapshots)

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PRIMARY KEY, DEFAULT gen_random_uuid() | Score ID |
| company_id | uuid | REFERENCES companies(id), NOT NULL | Company ID |
| score_period | text | NOT NULL | Score period (YYYY-MM format) |
| total_score | numeric(5,2) | NOT NULL, CHECK (total_score >= 0 AND total_score <= 100) | Total score (0-100) |
| calculated_at | timestamptz | NOT NULL | Calculation timestamp |
| frozen_at | timestamptz | NOT NULL | Frozen timestamp (immutable) |
| calculation_method | text | NOT NULL | Calculation method (scheduled, event_triggered) |
| trigger_event | text | NULLABLE | Trigger event (if event-triggered) |
| is_under_dispute | boolean | DEFAULT false | Under dispute flag |
| tier2_reviewed | boolean | DEFAULT false | Tier 2 reviewed flag |
| tier1_approved | boolean | DEFAULT false | Tier 1 approved flag |
| tier1_override | boolean | DEFAULT false | Tier 1 override flag |
| tier1_override_reason | text | NULLABLE | Tier 1 override reason |
| created_at | timestamptz | DEFAULT now() | Creation timestamp |
| updated_at | timestamptz | DEFAULT now() | Last update timestamp |

**Indexes:**
- `idx_compliance_scores_company_id` on `company_id`
- `idx_compliance_scores_score_period` on `score_period`
- `idx_compliance_scores_calculated_at` on `calculated_at`
- UNIQUE `idx_compliance_scores_company_period` on `company_id, score_period`

**Notes:**
- Frozen snapshots (immutable)
- Corrections create adjustment notes, not new scores
- Monthly scheduled calculation + event-triggered

---

### compliance_score_components
**Purpose:** Individual component scores

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PRIMARY KEY, DEFAULT gen_random_uuid() | Component ID |
| compliance_score_id | uuid | REFERENCES compliance_scores(id), NOT NULL | Compliance score ID |
| component_name | text | NOT NULL | Component name (regulatory_reporting, stock_threshold_violation, replenishment_adherence, non_compliance_exposure, data_quality, critical_medicine_coverage, export_compliance) |
| component_score | numeric(5,2) | NOT NULL | Component score |
| component_weight | numeric(5,2) | NOT NULL | Component weight |
| calculation_details | jsonb | NULLABLE | Calculation details |
| created_at | timestamptz | DEFAULT now() | Creation timestamp |

**Indexes:**
- `idx_compliance_score_components_compliance_score_id` on `compliance_score_id`
- `idx_compliance_score_components_component_name` on `component_name`

---

### compliance_score_adjustments
**Purpose:** Adjustment notes for score corrections

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PRIMARY KEY, DEFAULT gen_random_uuid() | Adjustment ID |
| compliance_score_id | uuid | REFERENCES compliance_scores(id), NOT NULL | Compliance score ID |
| adjustment_type | text | NOT NULL | Adjustment type (correction, override) |
| adjusted_component | text | NULLABLE | Adjusted component (NULL for total score) |
| original_value | numeric(5,2) | NULLABLE | Original value |
| adjusted_value | numeric(5,2) | NULLABLE | Adjusted value |
| adjustment_reason | text | NOT NULL | Adjustment reason |
| adjusted_by | uuid | REFERENCES users(id), NOT NULL | User who adjusted (Tier 1 only) |
| adjusted_at | timestamptz | DEFAULT now() | Adjustment timestamp |
| created_at | timestamptz | DEFAULT now() | Creation timestamp |

**Indexes:**
- `idx_compliance_score_adjustments_compliance_score_id` on `compliance_score_id`

**Notes:**
- Only Tier 1 can create adjustments
- Original score remains unchanged (frozen snapshot)

---

### disputes
**Purpose:** Score disputes

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PRIMARY KEY, DEFAULT gen_random_uuid() | Dispute ID |
| compliance_score_id | uuid | REFERENCES compliance_scores(id), NOT NULL | Compliance score ID |
| dispute_type | text | NOT NULL | Dispute type (total_score, component) |
| disputed_component | text | NULLABLE | Disputed component (NULL for total score) |
| dispute_reason | text | NOT NULL | Dispute reason |
| status | text | NOT NULL, DEFAULT 'submitted' | Status (submitted, tier2_reviewed, tier1_reviewed, upheld, rejected) |
| submitted_by | uuid | REFERENCES users(id), NOT NULL | User who submitted |
| submitted_at | timestamptz | DEFAULT now() | Submission timestamp |
| reviewed_by | uuid | REFERENCES users(id), NULLABLE | User who reviewed |
| reviewed_at | timestamptz | NULLABLE | Review timestamp |
| resolution | text | NULLABLE | Resolution |
| resolved_by | uuid | REFERENCES users(id), NULLABLE | User who resolved |
| resolved_at | timestamptz | NULLABLE | Resolution timestamp |
| created_at | timestamptz | DEFAULT now() | Creation timestamp |
| updated_at | timestamptz | DEFAULT now() | Last update timestamp |

**Indexes:**
- `idx_disputes_compliance_score_id` on `compliance_score_id`
- `idx_disputes_status` on `status`

**Notes:**
- Must be submitted within 30 days of score publication
- Score remains visible but marked as "Under Dispute"

---

### regulatory_reports
**Purpose:** Generated regulatory reports

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PRIMARY KEY, DEFAULT gen_random_uuid() | Report ID |
| report_type | text | NOT NULL | Report type (monthly, quarterly, annual) |
| report_period | text | NOT NULL | Report period |
| report_data | jsonb | NOT NULL | Report data |
| status | text | NOT NULL, DEFAULT 'draft' | Status (draft, tier2_reviewed, tier1_approved, released) |
| generated_by | uuid | REFERENCES users(id), NULLABLE | User/system who generated |
| generated_at | timestamptz | DEFAULT now() | Generation timestamp |
| reviewed_by | uuid | REFERENCES users(id), NULLABLE | Tier 2 Officer who reviewed |
| reviewed_at | timestamptz | NULLABLE | Review timestamp |
| approved_by | uuid | REFERENCES users(id), NULLABLE | Tier 1 who approved |
| approved_at | timestamptz | NULLABLE | Approval timestamp |
| released_at | timestamptz | NULLABLE | Release timestamp |
| created_at | timestamptz | DEFAULT now() | Creation timestamp |
| updated_at | timestamptz | DEFAULT now() | Last update timestamp |

**Indexes:**
- `idx_regulatory_reports_report_type` on `report_type`
- `idx_regulatory_reports_status` on `status`

---

## Database Constraints & Rules

### Foreign Key Constraints
- All foreign keys have `ON DELETE RESTRICT` (prevent accidental deletions)
- Cascade rules handled via application logic (soft deletes)

### Check Constraints
- `msq_submissions.month` must be between 1 and 12
- `compliance_scores.total_score` must be between 0 and 100
- Status values must match defined enums

### Unique Constraints
- `companies.registration_number` is unique
- `atc_codes.code` is unique
- `export_authorizations.authorization_number` is unique
- `compliance_scores` has unique constraint on `company_id, score_period`

### Default Values
- `is_active` defaults to `true`
- `created_at` and `updated_at` default to `now()`
- Status fields have appropriate defaults

## Related Documents

- [Entity Relationship Diagram](erd.md)
- [Data Dictionary](data-dictionary.md)
- [RLS Policy Framework Design](../../security/rls-policy-framework.md)
- [Migration Strategy](migration-strategy.md)
- [Technical Decision Log](../../../06-development/technical-decisions/decision-log.md)

---

**Next Review Date:** [To be scheduled]  
**Owner:** Nadia

