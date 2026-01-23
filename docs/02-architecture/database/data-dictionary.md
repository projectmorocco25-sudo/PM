# Data Dictionary - Pharmaceutical Governance Value Chain Platform (PM)

**Purpose:** This document provides a comprehensive data dictionary with definitions for all database fields.

**Last Updated:** 2025-01-21  
**Status:** ✅ Complete (Phase 0.6, Schema Audit Complete)  
**Owner:** Nadia

## Overview

This data dictionary defines all fields across all database tables, including data types, constraints, business rules, and usage notes.

## Field Naming Conventions

- **Primary Keys:** `id` (uuid)
- **Foreign Keys:** `{entity}_id` (uuid)
- **Timestamps:** `created_at`, `updated_at`, `{action}_at` (timestamptz)
- **Status Fields:** `status` (text, enum values)
- **Boolean Flags:** `is_{condition}` (boolean)
- **Soft Deletes:** `is_active` (boolean) or `deleted_at` (timestamptz)

## Core Tables

### users

| Field | Type | Nullable | Description | Business Rules |
|-------|------|----------|-------------|----------------|
| id | uuid | No | User ID (from Supabase Auth) | Primary key, references auth.users(id) |
| email | text | No | User email address | Unique, used for authentication |
| full_name | text | Yes | User's full name | Display name for UI |
| company_id | uuid | Yes | Company ID (NULL for MOH users) | Foreign key to companies.id. NULL = MOH user, NOT NULL = Company user |
| role | text | No | User role | Enum: tier1, tier2_officer, tier2_registrar, company_admin, company_manager, company_user, auditor, system_admin, vendor |
| avatar_url | text | Yes | Avatar image URL | URL path to Supabase Storage bucket: `avatars/{user_id}/{filename}`. NULL for users without avatars |
| timezone | text | No | User timezone preference | Default: 'UTC+01:00' (Morocco standard time). Valid timezone identifier (e.g., 'UTC+01:00', 'UTC+00:00', 'Africa/Casablanca') |
| language | text | No | User language preference | Default: 'en' (English). ISO 639-1 language code (e.g., 'en', 'ar', 'fr') |
| notification_preferences | jsonb | Yes | Notification preferences | JSON object: {email_enabled: boolean, submission_updates: boolean, compliance_alerts: boolean, enforcement_actions: boolean, system_announcements: boolean}. NULL means all notifications enabled by default |
| is_active | boolean | No | User active status | Default: true. Inactive users cannot log in |
| created_at | timestamptz | No | Creation timestamp | Auto-set on insert |
| updated_at | timestamptz | No | Last update timestamp | Auto-updated on update |

---

### system_config

| Field | Type | Nullable | Description | Business Rules |
|-------|------|----------|-------------|----------------|
| id | uuid | No | Config ID | Primary key |
| module_name | text | No | Module name | Unique. Values: rmm, vci, ecs, cmc |
| is_active | boolean | No | Module active status | Default: false. RMM and VCI must be active (core modules) |
| activated_at | timestamptz | Yes | Activation timestamp | Set when module is activated |
| activated_by | uuid | Yes | User who activated | Foreign key to users.id |
| config_data | jsonb | Yes | Module-specific configuration | JSON object with module settings |
| created_at | timestamptz | No | Creation timestamp | Auto-set on insert |
| updated_at | timestamptz | No | Last update timestamp | Auto-updated on update |

---

### notifications

| Field | Type | Nullable | Description | Business Rules |
|-------|------|----------|-------------|----------------|
| id | uuid | No | Notification ID | Primary key |
| user_id | uuid | No | Recipient user ID | Foreign key to users.id |
| type | text | No | Notification type | Enum: submission_status, breach_alert, approval_required, export_approved, score_published, etc. |
| title | text | No | Notification title | Display title |
| message | text | No | Notification message | Display message |
| link | text | Yes | Link to related entity | URL or entity reference |
| is_read | boolean | No | Read status | Default: false |
| read_at | timestamptz | Yes | Read timestamp | Set when user marks as read |
| created_at | timestamptz | No | Creation timestamp | Auto-set on insert |

---

### audit_logs

| Field | Type | Nullable | Description | Business Rules |
|-------|------|----------|-------------|----------------|
| id | uuid | No | Audit log ID | Primary key |
| previous_hash | text | Yes | Hash of previous entry | Hash chaining for immutability |
| current_hash | text | No | Hash of this entry | SHA-256 hash of entry data |
| user_id | uuid | Yes | User who performed action | Foreign key to users.id. NULL for system operations |
| operation_type | text | No | Operation type | Enum: create, update, delete, approve, reject, etc. |
| table_name | text | No | Table name | Table where operation occurred |
| record_id | uuid | Yes | Record ID | ID of affected record |
| old_values | jsonb | Yes | Old values | JSON object with old field values (for updates/deletes) |
| new_values | jsonb | Yes | New values | JSON object with new field values (for creates/updates) |
| reason | text | Yes | Reason/justification | Mandatory for certain operations (deletions, approvals) |
| ip_address | inet | Yes | IP address | Client IP address |
| user_agent | text | Yes | User agent | Client user agent string |
| created_at | timestamptz | No | Creation timestamp | Auto-set on insert, immutable |

---

### approvals

| Field | Type | Nullable | Description | Business Rules |
|-------|------|----------|-------------|----------------|
| id | uuid | No | Approval ID | Primary key |
| submission_id | uuid | Yes | Submission ID | Foreign key to registry_submissions.id (or other submission tables). NULLABLE for flexibility |
| submission_type | text | No | Submission type | Enum: registry, aams, export_request, etc. |
| from_status | text | No | Previous status | Status before approval action |
| to_status | text | No | New status | Status after approval action |
| approver_id | uuid | No | User who approved | Foreign key to users.id |
| approval_type | text | No | Approval type | Enum: verify, approve, implement, reject |
| comments | text | Yes | Comments | Optional comments from approver |
| created_at | timestamptz | No | Approval timestamp | Auto-set on insert |

---

### approval_history

| Field | Type | Nullable | Description | Business Rules |
|-------|------|----------|-------------|----------------|
| id | uuid | No | Approval history ID | Primary key |
| approval_id | uuid | No | Approval ID | Foreign key to approvals.id ON DELETE CASCADE |
| submission_id | uuid | Yes | Submission ID | References the submission being approved |
| submission_type | text | No | Submission type | Enum: registry, aams, export_request, etc. |
| workflow_stage | text | No | Workflow stage | Enum: draft, submitted, tier2_verification, tier1_review, approved, etc. |
| action_taken | text | No | Action taken | Enum: verified, approved, rejected, implemented, etc. |
| approver_id | uuid | No | User who performed action | Foreign key to users.id |
| approver_role | text | No | Approver role | Role of approver at time of action (captures role snapshot for audit trail) |
| comments | text | Yes | Comments | Optional comments |
| metadata | jsonb | Yes | Additional metadata | JSON object with additional metadata about the approval action |
| created_at | timestamptz | No | Creation timestamp | Auto-set on insert |

**Business Rules:**
- Provides detailed history tracking separate from `approvals` table
- `approver_role` captures role at time of action (important for audit trail if user role changes)
- `metadata` jsonb field allows for flexible additional data
- Linked to `approvals` table via `approval_id` with CASCADE delete

---

## RMM Module Tables

### companies

| Field | Type | Nullable | Description | Business Rules |
|-------|------|----------|-------------|----------------|
| id | uuid | No | Company ID | Primary key |
| name | text | No | Company name | Company legal name |
| registration_number | text | No | Registration number | Unique, government registration number |
| company_type | text | No | Company type | Enum: ipc, wholesaler |
| address | text | Yes | Company address | Physical address |
| contact_email | text | Yes | Contact email | Primary contact email |
| contact_phone | text | Yes | Contact phone | Primary contact phone |
| is_active | boolean | No | Active status | Default: true. Deactivation cascades to products/SKUs |
| suspended_at | timestamptz | Yes | Suspension timestamp | Set when company is suspended |
| suspended_by | uuid | Yes | User who suspended | Foreign key to users.id (Tier 1 only) |
| suspended_reason | text | Yes | Suspension reason | Mandatory justification (min 50 characters) |
| created_at | timestamptz | No | Creation timestamp | Auto-set on insert |
| updated_at | timestamptz | No | Last update timestamp | Auto-updated on update |

---

### products

| Field | Type | Nullable | Description | Business Rules |
|-------|------|----------|-------------|----------------|
| id | uuid | No | Product ID | Primary key |
| company_id | uuid | No | Company ID | Foreign key to companies.id |
| name | text | No | Product name | Product name |
| description | text | Yes | Product description | Product description |
| is_critical_medicine | boolean | No | Critical medicine flag | Default: false |
| is_active | boolean | No | Active status | Default: true. Deactivation cascades to SKUs |
| deactivated_at | timestamptz | Yes | Deactivation timestamp | Set when product is deactivated |
| deactivated_by | uuid | Yes | User who deactivated | Foreign key to users.id |
| deactivated_reason | text | Yes | Deactivation reason | Mandatory justification |
| created_at | timestamptz | No | Creation timestamp | Auto-set on insert |
| updated_at | timestamptz | No | Last update timestamp | Auto-updated on update |

---

### skus

| Field | Type | Nullable | Description | Business Rules |
|-------|------|----------|-------------|----------------|
| id | uuid | No | SKU ID | Primary key |
| product_id | uuid | No | Product ID | Foreign key to products.id |
| sku_code | text | No | SKU code | SKU identifier |
| name | text | No | SKU name | SKU name |
| atc_code_id | uuid | Yes | ATC code ID | Foreign key to atc_codes.id |
| is_moh_authorized_unregistered | boolean | No | MOH-authorized unregistered flag | Default: false. Indicates unregistered product authorized by MOH |
| is_active | boolean | No | Active status | Default: true |
| deactivated_at | timestamptz | Yes | Deactivation timestamp | Set when SKU is deactivated |
| deactivated_by | uuid | Yes | User who deactivated | Foreign key to users.id |
| deactivated_reason | text | Yes | Deactivation reason | Mandatory justification |
| created_at | timestamptz | No | Creation timestamp | Auto-set on insert |
| updated_at | timestamptz | No | Last update timestamp | Auto-updated on update |

---

### thresholds

| Field | Type | Nullable | Description | Business Rules |
|-------|------|----------|-------------|----------------|
| id | uuid | No | Threshold ID | Primary key |
| sku_id | uuid | Yes | SKU ID | Foreign key to skus.id. NULL = global threshold |
| threshold_type | text | No | Threshold type | Enum: vci, ecs |
| threshold_value | numeric(15,2) | No | Threshold value (quantity) | Calculated threshold **quantity** (minimum stock units required). NOT a financial value. |
| multiplier_b | numeric(5,2) | No | Multiplier B | Default: 3.0 (standard), 3.5 (critical medicines) |
| aams_value | numeric(15,2) | No | AAMS value used (quantity) | AAMS **quantity** used for threshold calculation (units). NOT a financial value. |
| effective_from | date | No | Effective from date | When threshold becomes effective |
| effective_to | date | Yes | Effective to date | NULL for current threshold |
| is_current | boolean | No | Current threshold flag | Default: true. Only one current threshold per SKU/type |
| duration_type | text | No | Duration type | Enum: permanent, temporary_auto_revert, temporary_manual_review. Default: permanent. Determines if threshold is permanent or time-bound |
| revert_date | date | Yes | Revert date | Date when temporary threshold reverts. NULL for permanent thresholds. Must be in the future when creating temporary threshold. Required if duration_type is temporary |
| revert_to_multiplier | numeric(5,2) | Yes | Revert to multiplier | Multiplier value to revert to after temporary period. NULL for permanent thresholds. Required if duration_type is temporary. Must match a valid multiplier (0.1 to 5.0) |
| revert_to_threshold_value | numeric(15,2) | Yes | Revert to threshold value | Threshold value to revert to after temporary period. NULL for permanent thresholds. Required if duration_type is temporary. Calculated from revert_to_multiplier × AAMS |
| revert_notification_sent_7d | boolean | No | 7-day warning sent | Default: false. Tracks if 7-day warning notification was sent before reversion |
| revert_notification_sent_1d | boolean | No | 1-day warning sent | Default: false. Tracks if 1-day warning notification was sent before reversion |
| revert_notification_sent_on_revert | boolean | No | Reversion notification sent | Default: false. Tracks if reversion completion notification was sent |
| requires_manual_review | boolean | No | Requires manual review | Default: false. If true (temporary_manual_review), requires Tier 1 confirmation before auto-revert. If false (temporary_auto_revert), automatically reverts on revert_date |
| created_by | uuid | No | User who created | Foreign key to users.id |
| created_at | timestamptz | No | Creation timestamp | Auto-set on insert |
| updated_at | timestamptz | No | Last update timestamp | Auto-updated on update |

**Versioning:** Thresholds support version history. Non-retroactive changes create new versions.

**Time-Bound Modifications:**
- **Permanent (default):** Threshold remains until manually modified. All revert fields are NULL.
- **Temporary Auto-Revert:** Automatically reverts on `revert_date`. `requires_manual_review = false`. Notifications sent at 7 days, 1 day, and on reversion.
- **Temporary Manual Review:** Requires Tier 1 confirmation before reversion on `revert_date`. `requires_manual_review = true`. Notifications sent at 7 days and 1 day before reversion, plus review required notification.
- **Validation Rules:**
  - `revert_date` must be > `effective_from` (future date)
  - `revert_to_multiplier` and `revert_to_threshold_value` must be set for temporary thresholds
  - Cannot modify threshold if another modification is scheduled before `revert_date` (conflict detection)
  - Reversion creates new threshold version with `revert_to_*` values and marks old version as `is_current = false`

---

## VCI Module Tables

### aams_submissions

**Purpose:** Annual Average Monthly Sales (Quantities) submissions  
**Note:** AAMS represents **quantities of units sold**, NOT financial values or prices.

| Field | Type | Nullable | Description | Business Rules |
|-------|------|----------|-------------|----------------|
| id | uuid | No | Submission ID | Primary key |
| company_id | uuid | No | Company ID | Foreign key to companies.id |
| year | integer | No | Year | Calendar year (e.g., 2024) |
| aams_value | numeric(15,2) | Yes | Company-wide AAMS (optional) | Optional aggregate AAMS value. NOT a financial value. |
| submission_data | jsonb | No | SKU-level quantities | Array of {sku_id, quantity}. Example: [{"sku_id": "uuid", "quantity": 10000}, ...]. Each entry represents AAMS quantity for that SKU. |
| status | text | No | Status | Enum: draft, submitted, tier2_verified, tier1_approved, completed, rejected. Default: draft |
| is_late | boolean | No | Late submission flag | Default: false. True if submitted after January 31st |
| correction_of | uuid | Yes | Original submission ID | Foreign key to aams_submissions.id. Set if this is a correction |
| submitted_by | uuid | No | User who submitted | Foreign key to users.id |
| submitted_at | timestamptz | Yes | Submission timestamp | Set when submitted |
| verified_by | uuid | Yes | Tier 2 Officer who verified | Foreign key to users.id |
| verified_at | timestamptz | Yes | Verification timestamp | Set when verified |
| approved_by | uuid | Yes | Tier 1 who approved | Foreign key to users.id |
| approved_at | timestamptz | Yes | Approval timestamp | Set when approved |
| created_at | timestamptz | No | Creation timestamp | Auto-set on insert |
| updated_at | timestamptz | No | Last update timestamp | Auto-updated on update |

**Business Rules:**
- Must be submitted by January 31st (15-day grace period until February 15th)
- Corrections tracked via `correction_of` reference
- Original submission preserved for audit

---

### msq_submissions

**Purpose:** Monthly Sales Quantities submissions  
**Note:** MSQ represents **quantities of units sold**, NOT financial values or prices.

| Field | Type | Nullable | Description | Business Rules |
|-------|------|----------|-------------|----------------|
| id | uuid | No | Submission ID | Primary key |
| company_id | uuid | No | Company ID | Foreign key to companies.id |
| year | integer | No | Year | Calendar year |
| month | integer | No | Month | 1-12 (CHECK constraint) |
| submission_data | jsonb | No | Submission data | JSON with SKU quantities |
| status | text | No | Status | Enum: submitted, flagged_for_review, accepted, rejected. Default: submitted |
| validation_flags | jsonb | Yes | Validation flags | JSON with anomaly detection results |
| correction_of | uuid | Yes | Original submission ID | Foreign key to msq_submissions.id. Set if this is a correction |
| submitted_by | uuid | No | User who submitted | Foreign key to users.id |
| submitted_at | timestamptz | No | Submission timestamp | Default: now() |
| created_at | timestamptz | No | Creation timestamp | Auto-set on insert |
| updated_at | timestamptz | No | Last update timestamp | Auto-updated on update |

**Business Rules:**
- 7-day grace period for corrections
- Used for ECS XAMS calculations (default X=6 months)

---

### wsl_submissions

**Purpose:** Weekly Stock Levels submissions  
**Note:** WSL represents **quantities of units in stock**, NOT financial values.

| Field | Type | Nullable | Description | Business Rules |
|-------|------|----------|-------------|----------------|
| id | uuid | No | Submission ID | Primary key |
| company_id | uuid | No | Company ID | Foreign key to companies.id |
| week_ending_date | date | No | Week ending date | Friday date |
| submission_data | jsonb | No | Submission data | JSON with all SKUs and stock levels |
| status | text | No | Status | Enum: submitted, late, non_compliant, accepted. Default: submitted |
| is_late | boolean | No | Late submission flag | Default: false. True if submitted after Friday EOD |
| is_non_compliant | boolean | No | Non-compliant flag | Default: false. True if submitted after Monday EOD |
| submitted_by | uuid | No | User who submitted | Foreign key to users.id |
| submitted_at | timestamptz | No | Submission timestamp | Default: now() |
| created_at | timestamptz | No | Creation timestamp | Auto-set on insert |
| updated_at | timestamptz | No | Last update timestamp | Auto-updated on update |

**Business Rules:**
- Must include all SKUs at once (complete submission)
- Must be submitted by Friday EOD (late if after Friday, non-compliant if after Monday)

---

### breaches

| Field | Type | Nullable | Description | Business Rules |
|-------|------|----------|-------------|----------------|
| id | uuid | No | Breach ID | Primary key |
| sku_id | uuid | No | SKU ID | Foreign key to skus.id |
| company_id | uuid | No | Company ID | Foreign key to companies.id |
| wsl_submission_id | uuid | No | WSL submission ID | Foreign key to wsl_submissions.id |
| threshold_id | uuid | No | Threshold ID | Foreign key to thresholds.id |
| stock_level | numeric(15,2) | No | Stock level at breach (quantity) | Stock **quantity** when breach detected (units). NOT a financial value. |
| threshold_value | numeric(15,2) | No | Threshold value | Threshold value at time of breach |
| breach_date | date | No | Breach date | Date when breach occurred |
| breach_reason | text | Yes | Company-provided reason | Reason provided by company |
| replenishment_date | date | Yes | Replenishment date | Expected replenishment date |
| priority | text | No | Priority | Enum: standard, high, critical. Default: standard |
| status | text | No | Status | Enum: detected, tier2_analyzing, tier2_suggested, tier1_reviewed, action_taken, completed. Default: detected |
| created_at | timestamptz | No | Creation timestamp | Auto-set on insert |
| updated_at | timestamptz | No | Last update timestamp | Auto-updated on update |

---

## ECS Module Tables

### export_requests

| Field | Type | Nullable | Description | Business Rules |
|-------|------|----------|-------------|----------------|
| id | uuid | No | Request ID | Primary key |
| company_id | uuid | No | Company ID | Foreign key to companies.id |
| sku_id | uuid | No | SKU ID | Foreign key to skus.id |
| quantity | numeric(15,2) | No | Export quantity | Quantity to export |
| destination_country | text | No | Destination country | Country code or name |
| destination_details | text | Yes | Destination details | Additional destination information |
| requested_export_date | date | No | Requested export date | Desired export date |
| supporting_documentation | jsonb | Yes | Supporting documentation | JSON with file references |
| stock_confirmation | boolean | No | Stock confirmation | Default: false. Company confirms stock availability |
| status | text | No | Status | Enum: draft, submitted, auto_approval_queue, tier2_verification, tier1_review, approved, authorized, rejected, cancelled. Default: draft |
| conditional_validation_result | jsonb | Yes | Conditional validation result | JSON with CMC score check results |
| xams_value | numeric(15,2) | Yes | XAMS value | XAMS value used for threshold calculation |
| ecs_threshold_value | numeric(15,2) | Yes | ECS threshold value | ECS threshold value |
| intervention_window_end | timestamptz | Yes | Intervention window end | Default: 2 working days from submission |
| submitted_by | uuid | No | User who submitted | Foreign key to users.id |
| submitted_at | timestamptz | Yes | Submission timestamp | Set when submitted |
| verified_by | uuid | Yes | Tier 2 Officer who verified | Foreign key to users.id |
| verified_at | timestamptz | Yes | Verification timestamp | Set when verified |
| approved_by | uuid | Yes | Tier 1 who approved | Foreign key to users.id |
| approved_at | timestamptz | Yes | Approval timestamp | Set when approved |
| rejected_by | uuid | Yes | User who rejected | Foreign key to users.id |
| rejected_reason | text | Yes | Rejection reason | Mandatory if rejected |
| cancelled_by | uuid | Yes | User who cancelled | Foreign key to users.id |
| cancelled_at | timestamptz | Yes | Cancellation timestamp | Set when cancelled |
| created_at | timestamptz | No | Creation timestamp | Auto-set on insert |
| updated_at | timestamptz | No | Last update timestamp | Auto-updated on update |

---

### export_authorizations

| Field | Type | Nullable | Description | Business Rules |
|-------|------|----------|-------------|----------------|
| id | uuid | No | Authorization ID | Primary key |
| export_request_id | uuid | No | Export request ID | Foreign key to export_requests.id, unique |
| authorization_number | text | No | Authorization number | Unique authorization number |
| valid_from | date | No | Valid from date | Authorization start date |
| valid_until | date | No | Valid until date | Authorization end date (90 calendar days from approval) |
| status | text | No | Status | Enum: authorized, completed, expired, revoked, cancelled. Default: authorized |
| completed_at | timestamptz | Yes | Completion timestamp | Set when export is completed |
| expired_at | timestamptz | Yes | Expiration timestamp | Set when authorization expires |
| revoked_at | timestamptz | Yes | Revocation timestamp | Set when authorization is revoked |
| revoked_by | uuid | Yes | User who revoked | Foreign key to users.id |
| revoked_reason | text | Yes | Revocation reason | Mandatory if revoked |
| threshold_switch_date | date | Yes | Threshold switch date | Date when threshold switched to ECS Threshold |
| threshold_revert_date | date | Yes | Threshold revert date | Date when threshold reverts to VCI Threshold (3 months from authorization) |
| created_at | timestamptz | No | Creation timestamp | Auto-set on insert |
| updated_at | timestamptz | No | Last update timestamp | Auto-updated on update |

**Business Rules:**
- Valid for 90 calendar days from approval
- Triggers threshold switch (VCI → ECS) for 3 months
- Triggers CMC score recalculation (event-triggered)

---

## CMC Module Tables

### compliance_scores

| Field | Type | Nullable | Description | Business Rules |
|-------|------|----------|-------------|----------------|
| id | uuid | No | Score ID | Primary key |
| company_id | uuid | No | Company ID | Foreign key to companies.id |
| score_period | text | No | Score period | Format: YYYY-MM (e.g., "2024-01") |
| total_score | numeric(5,2) | No | Total score | Range: 0-100 (CHECK constraint) |
| previous_period_score | numeric(5,2) | Yes | Previous period score | Previous period score for trend calculation |
| score_change | numeric(5,2) | Yes | Score change | Score change from previous period (calculated or stored) |
| calculated_at | timestamptz | No | Calculation timestamp | When score was calculated |
| frozen_at | timestamptz | No | Frozen timestamp | When score was frozen (immutable) |
| calculation_method | text | No | Calculation method | Enum: scheduled, event_triggered |
| trigger_event | text | Yes | Trigger event | Event that triggered calculation (if event-triggered) |
| is_under_dispute | boolean | No | Under dispute flag | Default: false |
| tier2_reviewed | boolean | No | Tier 2 reviewed flag | Default: false |
| tier1_approved | boolean | No | Tier 1 approved flag | Default: false |
| tier1_override | boolean | No | Tier 1 override flag | Default: false |
| tier1_override_reason | text | Yes | Tier 1 override reason | Mandatory if override |
| created_at | timestamptz | No | Creation timestamp | Auto-set on insert |
| updated_at | timestamptz | No | Last update timestamp | Auto-updated on update |

**Business Rules:**
- Frozen snapshots (immutable)
- Unique constraint on (company_id, score_period)
- Corrections create adjustment notes, not new scores

---

### compliance_score_components

| Field | Type | Nullable | Description | Business Rules |
|-------|------|----------|-------------|----------------|
| id | uuid | No | Component ID | Primary key |
| compliance_score_id | uuid | No | Compliance score ID | Foreign key to compliance_scores.id |
| component_name | text | No | Component name | Enum: regulatory_reporting, stock_threshold_violation, replenishment_adherence, non_compliance_exposure, data_quality, critical_medicine_coverage, export_compliance |
| component_score | numeric(5,2) | No | Component score | Component score value |
| component_weight | numeric(5,2) | No | Component weight | Weight in total score calculation |
| calculation_details | jsonb | Yes | Calculation details | JSON with calculation parameters |
| created_at | timestamptz | No | Creation timestamp | Auto-set on insert |

---

### compliance_score_adjustments

| Field | Type | Nullable | Description | Business Rules |
|-------|------|----------|-------------|----------------|
| id | uuid | No | Adjustment ID | Primary key |
| compliance_score_id | uuid | No | Compliance score ID | Foreign key to compliance_scores.id |
| adjustment_type | text | No | Adjustment type | Enum: correction, override |
| adjusted_component | text | Yes | Adjusted component | NULL for total score adjustments |
| original_value | numeric(5,2) | Yes | Original value | Original score value |
| adjusted_value | numeric(5,2) | Yes | Adjusted value | Adjusted score value |
| adjustment_reason | text | No | Adjustment reason | Mandatory reason for adjustment |
| adjusted_by | uuid | No | User who adjusted | Foreign key to users.id (Tier 1 only) |
| adjusted_at | timestamptz | No | Adjustment timestamp | When adjustment was made |
| created_at | timestamptz | No | Creation timestamp | Auto-set on insert |

**Business Rules:**
- Only Tier 1 can create adjustments
- Original score remains unchanged (frozen snapshot)

---

### disputes

| Field | Type | Nullable | Description | Business Rules |
|-------|------|----------|-------------|----------------|
| id | uuid | No | Dispute ID | Primary key |
| compliance_score_id | uuid | No | Compliance score ID | Foreign key to compliance_scores.id |
| dispute_type | text | No | Dispute type | Enum: total_score, component |
| disputed_component | text | Yes | Disputed component | NULL for total score disputes |
| dispute_reason | text | No | Dispute reason | Mandatory reason for dispute |
| evidence | jsonb | Yes | Evidence files | JSON array of file references. Files stored in Supabase Storage: `disputes/evidence/{dispute_id}/{file_name}` |
| status | text | No | Status | Enum: submitted, tier2_reviewed, tier1_reviewed, upheld, rejected. Default: submitted |
| submitted_by | uuid | No | User who submitted | Foreign key to users.id (company user) |
| submitted_at | timestamptz | No | Submission timestamp | When dispute was submitted |
| reviewed_by | uuid | Yes | User who reviewed | Foreign key to users.id (Tier 2 Officer) |
| reviewed_at | timestamptz | Yes | Review timestamp | When dispute was reviewed |
| resolution | text | Yes | Resolution | Resolution decision (if resolved) |
| resolved_by | uuid | Yes | User who resolved | Foreign key to users.id (Tier 1) |
| resolved_at | timestamptz | Yes | Resolution timestamp | When dispute was resolved |
| created_at | timestamptz | No | Creation timestamp | Auto-set on insert |
| updated_at | timestamptz | No | Last update timestamp | Auto-updated on update |

**Business Rules:**
- Must be submitted within 30 days of score publication
- Score remains visible but marked as "Under Dispute"
- Evidence stored as JSONB array of file references (similar to enforcement_action_appeals.evidence)

---

### regulatory_reports

| Field | Type | Nullable | Description | Business Rules |
|-------|------|----------|-------------|----------------|
| id | uuid | No | Report ID | Primary key |
| report_type | text | No | Report type | Enum: monthly, quarterly, annual |
| report_period | text | No | Report period | Report period identifier |
| report_data | jsonb | No | Report data | JSON with report content |
| status | text | No | Status | Enum: draft, tier2_reviewed, tier1_approved, released. Default: draft |
| generated_by | uuid | Yes | User/system who generated | Foreign key to users.id |
| generated_at | timestamptz | No | Generation timestamp | When report was generated |
| reviewed_by | uuid | Yes | Tier 2 Officer who reviewed | Foreign key to users.id |
| reviewed_at | timestamptz | Yes | Review timestamp | When report was reviewed |
| approved_by | uuid | Yes | Tier 1 who approved | Foreign key to users.id |
| approved_at | timestamptz | Yes | Approval timestamp | When report was approved |
| released_at | timestamptz | Yes | Release timestamp | When report was released |
| created_at | timestamptz | No | Creation timestamp | Auto-set on insert |
| updated_at | timestamptz | No | Last update timestamp | Auto-updated on update |

---

## Governance Tables (Shared)

### follow_ups

| Field | Type | Nullable | Description | Business Rules |
|-------|------|----------|-------------|----------------|
| id | uuid | No | Follow-up ID | Primary key |
| company_id | uuid | No | Company ID | Foreign key to companies.id |
| assigned_to | uuid | No | Officer assigned to follow-up | Foreign key to users.id (MOH user) |
| priority | text | No | Priority | Enum: normal, high, extreme. Default: normal |
| due_date | date | No | Due date | Due date for follow-up completion |
| issue_type | text | No | Issue type | Enum: submission_overdue, compliance_violation, threshold_breach, enforcement_action, etc. |
| issue_reference_id | uuid | Yes | Reference to specific issue | UUID of related entity (polymorphic relationship) |
| issue_reference_table | text | Yes | Table name of issue reference | Table name for polymorphic relationship (e.g., 'aams_submissions', 'breaches', 'enforcement_actions') |
| notes | text | Yes | Follow-up notes | Notes about the follow-up |
| status | text | No | Status | Enum: pending, in_progress, completed, cancelled. Default: pending |
| completed_at | timestamptz | Yes | Completion timestamp | When follow-up was completed |
| completed_by | uuid | Yes | User who marked complete | Foreign key to users.id |
| created_by | uuid | No | User who created follow-up | Foreign key to users.id (MOH user) |
| created_at | timestamptz | No | Creation timestamp | Auto-set on insert |
| updated_at | timestamptz | No | Last update timestamp | Auto-updated on update |

**Business Rules:**
- Used for governance action tracking and dashboard displays
- Polymorphic relationship via `issue_reference_table` and `issue_reference_id`
- Completed follow-ups must have both `completed_at` and `completed_by` set (or both NULL)

---

### meetings

| Field | Type | Nullable | Description | Business Rules |
|-------|------|----------|-------------|----------------|
| id | uuid | No | Meeting ID | Primary key |
| title | text | No | Meeting title | Meeting title |
| meeting_type | text | No | Meeting type | Enum: emergency, scheduled, follow_up |
| scheduled_at | timestamptz | No | Meeting date and time | Scheduled meeting date and time |
| location | text | Yes | Meeting location | Physical or virtual meeting location |
| agenda | text | Yes | Meeting agenda | Meeting agenda items |
| reason | text | Yes | Reason for meeting | Reason for scheduling (e.g., "Submission Compliance Below Threshold") |
| related_reference_id | uuid | Yes | Related entity ID | UUID of related entity (polymorphic relationship) |
| related_reference_table | text | Yes | Related entity table | Table name for polymorphic relationship |
| status | text | No | Status | Enum: scheduled, cancelled, completed. Default: scheduled |
| cancelled_at | timestamptz | Yes | Cancellation timestamp | When meeting was cancelled |
| cancelled_by | uuid | Yes | User who cancelled | Foreign key to users.id |
| created_by | uuid | No | User who created meeting | Foreign key to users.id (MOH user) |
| created_at | timestamptz | No | Creation timestamp | Auto-set on insert |
| updated_at | timestamptz | No | Last update timestamp | Auto-updated on update |

**Business Rules:**
- Used for governance meeting scheduling and tracking
- Polymorphic relationship via `related_reference_table` and `related_reference_id`
- Cancelled meetings must have both `cancelled_at` and `cancelled_by` set (or both NULL)

---

### meeting_attendees

| Field | Type | Nullable | Description | Business Rules |
|-------|------|----------|-------------|----------------|
| id | uuid | No | Attendee ID | Primary key |
| meeting_id | uuid | No | Meeting ID | Foreign key to meetings.id |
| user_id | uuid | No | Attendee user ID | Foreign key to users.id |
| attendance_status | text | No | Attendance status | Enum: invited, accepted, declined, attended. Default: invited |
| calendar_invite_sent | boolean | No | Calendar invite sent flag | Default: false. True when calendar invite (iCal) has been sent |
| responded_at | timestamptz | Yes | Response timestamp | When attendee responded to invitation |
| created_at | timestamptz | No | Creation timestamp | Auto-set on insert |

**Business Rules:**
- Used for meeting attendee tracking and calendar integration
- Unique constraint on (meeting_id, user_id) - one attendee record per meeting-user combination
- Cascade delete when meeting is deleted

---

## Common Field Patterns

### Timestamps
- **created_at:** Always present, auto-set on insert, immutable
- **updated_at:** Always present, auto-updated on update
- **{action}_at:** Set when specific action occurs (e.g., `submitted_at`, `approved_at`)

### Status Fields
- **status:** Text field with enum values
- **is_{condition}:** Boolean flags for conditions (e.g., `is_active`, `is_late`)

### Foreign Keys
- **{entity}_id:** References another entity's `id` field
- **{entity}_by:** References `users.id` (e.g., `submitted_by`, `approved_by`)

### Soft Deletes
- **is_active:** Boolean flag (default: true)
- **deleted_at:** Timestamp (nullable)

### Versioning
- **effective_from:** Date when version becomes effective
- **effective_to:** Date when version ends (NULL for current)
- **is_current:** Boolean flag for current version

## Related Documents

- [Database Schema Design](schema-design.md)
- [Entity Relationship Diagram](erd.md)
- [RLS Policy Framework Design](../../security/rls-policy-framework.md)
- [Regulatory Framework](../../../03-governance/regulatory-framework.md) - Comprehensive regulatory reference including data retention requirements
- [Compliance Requirements](../../../03-governance/compliance-requirements.md) - Detailed compliance requirements including data retention
- [Regulatory Policies](../../../03-governance/regulatory-policies.md) - Regulatory policies and guidelines
- [Technical Decision Log](../../../06-development/technical-decisions/decision-log.md)

---

**Next Review Date:** [To be scheduled]  
**Owner:** Nadia

