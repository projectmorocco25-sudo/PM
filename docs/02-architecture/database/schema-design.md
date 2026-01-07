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

## Communication Tables (Shared)

### conversations
**Purpose:** Thread management for conversations

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PRIMARY KEY, DEFAULT gen_random_uuid() | Conversation ID |
| type | text | NOT NULL | Conversation type (direct_message, workflow_related, announcement, internal_moh) |
| subject | text | NOT NULL | Conversation subject |
| company_id | uuid | REFERENCES companies(id), NULLABLE | Company ID (NULL for internal MOH conversations) |
| workflow_entity_type | text | NULLABLE | Workflow entity type (registry_submission, aams_submission, export_request, breach, etc.) |
| workflow_entity_id | uuid | NULLABLE | Workflow entity ID (links to specific submission/approval/breach) |
| created_by | uuid | REFERENCES users(id), NOT NULL | User who created conversation |
| created_at | timestamptz | DEFAULT now() | Creation timestamp |
| updated_at | timestamptz | DEFAULT now() | Last update timestamp |
| archived_at | timestamptz | NULLABLE | Archive timestamp (soft delete) |
| is_announcement | boolean | DEFAULT false | True for system announcements |
| announcement_expires_at | timestamptz | NULLABLE | Expiration date for announcements |

**Indexes:**
- `idx_conversations_company_id` on `company_id`
- `idx_conversations_workflow_entity` on `(workflow_entity_type, workflow_entity_id)`
- `idx_conversations_created_by` on `created_by`
- `idx_conversations_created_at` on `created_at`
- `idx_conversations_type` on `type`

**RLS Policies:**
- Company users: Can see conversations where `company_id = auth.company_id()`
- MOH users: Can see all conversations (system-wide access)
- Internal MOH conversations: Only visible to MOH users

---

### messages
**Purpose:** Individual messages within conversations

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PRIMARY KEY, DEFAULT gen_random_uuid() | Message ID |
| conversation_id | uuid | REFERENCES conversations(id), NOT NULL | Conversation ID |
| sender_id | uuid | REFERENCES users(id), NOT NULL | Sender user ID |
| recipient_id | uuid | REFERENCES users(id), NULLABLE | Recipient user ID (NULL for announcements) |
| content | text | NOT NULL | Message content |
| is_system_message | boolean | DEFAULT false | True for automated system messages |
| created_at | timestamptz | DEFAULT now() | Creation timestamp |
| updated_at | timestamptz | DEFAULT now() | Last update timestamp |
| edited_at | timestamptz | NULLABLE | Edit timestamp (if message was edited) |
| deleted_at | timestamptz | NULLABLE | Soft delete timestamp (immutable - no hard deletes) |

**Indexes:**
- `idx_messages_conversation_id` on `conversation_id`
- `idx_messages_sender_id` on `sender_id`
- `idx_messages_recipient_id` on `recipient_id`
- `idx_messages_created_at` on `created_at`

**RLS Policies:**
- Users can see messages in conversations they have access to (via conversation RLS)
- Senders can see their sent messages
- Recipients can see their received messages

**Notes:**
- Messages are immutable (no hard deletes)
- Edits are tracked via `edited_at` timestamp
- System messages are automated (workflow triggers, notifications)

---

### message_attachments
**Purpose:** File attachments for messages

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PRIMARY KEY, DEFAULT gen_random_uuid() | Attachment ID |
| message_id | uuid | REFERENCES messages(id), NOT NULL | Message ID |
| file_name | text | NOT NULL | Original file name |
| file_path | text | NOT NULL | Storage path (Supabase Storage) |
| file_size | bigint | NOT NULL | File size in bytes |
| mime_type | text | NOT NULL | MIME type |
| uploaded_by | uuid | REFERENCES users(id), NOT NULL | User who uploaded |
| created_at | timestamptz | DEFAULT now() | Creation timestamp |

**Indexes:**
- `idx_message_attachments_message_id` on `message_id`
- `idx_message_attachments_uploaded_by` on `uploaded_by`

**RLS Policies:**
- Users can see attachments for messages they have access to (via message RLS)

**Storage:**
- Files stored in Supabase Storage: `communications/attachments/{message_id}/{file_name}`
- File upload security per `file-upload-storage-security.md`

---

### message_read_receipts
**Purpose:** Track message read status

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PRIMARY KEY, DEFAULT gen_random_uuid() | Read receipt ID |
| message_id | uuid | REFERENCES messages(id), NOT NULL | Message ID |
| user_id | uuid | REFERENCES users(id), NOT NULL | User who read message |
| read_at | timestamptz | DEFAULT now() | Read timestamp |

**Indexes:**
- `idx_message_read_receipts_message_id` on `message_id`
- `idx_message_read_receipts_user_id` on `user_id`
- `idx_message_read_receipts_read_at` on `read_at`
- UNIQUE constraint on `(message_id, user_id)`

**RLS Policies:**
- Users can see their own read receipts only

---

### conversation_participants
**Purpose:** Track conversation participants (for multi-party conversations)

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PRIMARY KEY, DEFAULT gen_random_uuid() | Participant ID |
| conversation_id | uuid | REFERENCES conversations(id), NOT NULL | Conversation ID |
| user_id | uuid | REFERENCES users(id), NOT NULL | Participant user ID |
| role | text | NOT NULL | Participant role (sender, recipient, cc, bcc) |
| joined_at | timestamptz | DEFAULT now() | Join timestamp |
| left_at | timestamptz | NULLABLE | Leave timestamp (if participant left) |

**Indexes:**
- `idx_conversation_participants_conversation_id` on `conversation_id`
- `idx_conversation_participants_user_id` on `user_id`
- UNIQUE constraint on `(conversation_id, user_id)`

**RLS Policies:**
- Users can see participants for conversations they have access to (via conversation RLS)

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
**Purpose:** SKUs belong to products and contain complete pharmaceutical product specifications

**Important:** SKU includes all product details (name, dosage, form, pack size) so that submissions (AAMS, MSQ, WSL) only need to reference **SKU_ID + Quantity**.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PRIMARY KEY, DEFAULT gen_random_uuid() | SKU ID |
| product_id | uuid | REFERENCES products(id), NOT NULL | Product ID |
| sku_code | text | NOT NULL | SKU code (company's internal code) |
| name | text | NOT NULL | Full SKU name (e.g., "Paracetamol 500mg Tablets 30-pack") |
| dosage_strength | text | NOT NULL | Dosage/strength (e.g., "500mg", "10mg/ml", "250mg/5ml") |
| dosage_form | text | NOT NULL | Pharmaceutical form (e.g., "Tablet", "Capsule", "Syrup", "Injection", "Cream", "Ointment") |
| pack_size | text | NOT NULL | Pack size (e.g., "30 tablets", "100ml bottle", "50 capsules") |
| unit_of_measure | text | NOT NULL | Unit of measure for quantities (e.g., "tablets", "ml", "capsules", "vials", "boxes") |
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
- `idx_skus_dosage_form` on `dosage_form`

**Notes:**
- SKU contains all pharmaceutical specifications
- Submissions (AAMS, MSQ, WSL) only reference SKU_ID + quantity
- Full SKU details retrieved via JOIN for display/reporting

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
**Purpose:** Annual Average Monthly Sales (Quantities) submissions  
**Note:** AAMS represents **quantities of units sold**, NOT financial values or prices.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PRIMARY KEY, DEFAULT gen_random_uuid() | Submission ID |
| company_id | uuid | REFERENCES companies(id), NOT NULL | Company ID |
| year | integer | NOT NULL | Year (calendar year) |
| aams_value | numeric(15,2) | NULLABLE | Company-wide AAMS value (optional aggregate) |
| submission_data | jsonb | NOT NULL | SKU-level data: array of {sku_id, quantity}. Example: [{"sku_id": "uuid", "quantity": 10000}, ...] |
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
**Note:** MSQ represents **quantities of units sold**, NOT financial values or prices.

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
**Note:** WSL represents **quantities of units in stock**, NOT financial values.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PRIMARY KEY, DEFAULT gen_random_uuid() | Submission ID |
| company_id | uuid | REFERENCES companies(id), NOT NULL | Company ID |
| week_ending_date | date | NOT NULL | Week ending date (Friday) |
| submission_data | jsonb | NOT NULL | SKU-level data: array of {sku_id, quantity, breach_reason?, replenishment_date?}. Example: [{"sku_id": "uuid", "quantity": 45000}, ...] |
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
| duration_type | text | DEFAULT 'permanent' | Duration type (permanent, temporary_auto_revert, temporary_manual_review) |
| revert_date | date | NULLABLE | Date when temporary threshold reverts (NULL for permanent) |
| revert_to_multiplier | numeric(5,2) | NULLABLE | Multiplier to revert to (NULL for permanent) |
| revert_to_threshold_value | numeric(15,2) | NULLABLE | Threshold value to revert to (NULL for permanent) |
| revert_notification_sent_7d | boolean | DEFAULT false | 7-day warning notification sent |
| revert_notification_sent_1d | boolean | DEFAULT false | 1-day warning notification sent |
| revert_notification_sent_on_revert | boolean | DEFAULT false | Reversion completion notification sent |
| requires_manual_review | boolean | DEFAULT false | If true, requires Tier 1 confirmation before auto-revert |
| created_by | uuid | REFERENCES users(id), NOT NULL | User who created |
| created_at | timestamptz | DEFAULT now() | Creation timestamp |
| updated_at | timestamptz | DEFAULT now() | Last update timestamp |

**Indexes:**
- `idx_thresholds_sku_id` on `sku_id`
- `idx_thresholds_threshold_type` on `threshold_type`
- `idx_thresholds_effective_from` on `effective_from`
- `idx_thresholds_is_current` on `is_current`
- `idx_thresholds_duration_type` on `duration_type`
- `idx_thresholds_revert_date` on `revert_date` (WHERE revert_date IS NOT NULL)
- `idx_thresholds_requires_manual_review` on `requires_manual_review` (WHERE requires_manual_review = true)

**Notes:**
- Version history supported (non-retroactive changes)
- Query current: `WHERE is_current = true AND sku_id = ? OR sku_id IS NULL`
- ECS Threshold switches from VCI Threshold when export authorized
- **Time-Bound Modifications:**
  - `duration_type = 'permanent'`: Threshold remains until manually modified (default behavior)
  - `duration_type = 'temporary_auto_revert'`: Automatically reverts on `revert_date`
  - `duration_type = 'temporary_manual_review'`: Requires Tier 1 confirmation before reversion on `revert_date`
  - `revert_date` must be in the future when creating temporary threshold
  - `revert_to_multiplier` and `revert_to_threshold_value` must be set for temporary thresholds
  - Notifications are sent at 7 days, 1 day, and on reversion (tracked by notification flags)

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
| stock_level | numeric(15,2) | NOT NULL | Stock level (quantity) at time of breach |
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
| quantity | numeric(15,2) | NOT NULL | Export quantity (units to export) |
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

## Enforcement Module Tables

### enforcement_actions
**Purpose:** MOH enforcement actions (warnings, fines, suspensions) against companies

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PRIMARY KEY, DEFAULT gen_random_uuid() | Enforcement action ID |
| company_id | uuid | REFERENCES companies(id), NOT NULL | Company ID |
| action_type | text | NOT NULL | Action type (warning, fine, suspension) |
| violation_type | text | NOT NULL | Violation type (submission_non_compliance, threshold_breach, critical_medicine_non_compliance, export_violation, data_quality_issue, repeated_offender) |
| violation_reference_id | uuid | NULLABLE | Reference to specific violation (breach_id, compliance_score_id, submission_id, etc.) |
| violation_reference_table | text | NULLABLE | Table name of violation reference (breaches, compliance_scores, etc.) |
| amount | numeric(15,2) | NULLABLE | Fine amount (NULL for warnings/suspensions) |
| currency | text | DEFAULT 'MAD' | Currency code (default: MAD) |
| status | text | NOT NULL, DEFAULT 'draft' | Status (draft, pending_review, pending_approval, approved, executed, appealed, resolved, cancelled) |
| legal_basis | text | NOT NULL | Legal basis for enforcement action |
| justification | text | NOT NULL | Detailed justification for action |
| notes | text | NULLABLE | Internal notes (MOH only) |
| created_by | uuid | REFERENCES users(id), NOT NULL | User who created (Tier 1 or Tier 2) |
| created_at | timestamptz | DEFAULT now() | Creation timestamp |
| reviewed_by | uuid | REFERENCES users(id), NULLABLE | Tier 2 Officer who reviewed |
| reviewed_at | timestamptz | NULLABLE | Review timestamp |
| review_notes | text | NULLABLE | Review notes |
| approved_by | uuid | REFERENCES users(id), NULLABLE | Tier 1 who approved (required for fines and suspensions) |
| approved_at | timestamptz | NULLABLE | Approval timestamp |
| approval_notes | text | NULLABLE | Approval notes |
| executed_by | uuid | REFERENCES users(id), NULLABLE | User who executed action |
| executed_at | timestamptz | NULLABLE | Execution timestamp |
| execution_notes | text | NULLABLE | Execution notes |
| appeal_id | uuid | NULLABLE | Appeal ID if action was appealed (references appeals table if created) |
| resolution | text | NULLABLE | Resolution (if appealed or cancelled) |
| resolved_by | uuid | REFERENCES users(id), NULLABLE | User who resolved |
| resolved_at | timestamptz | NULLABLE | Resolution timestamp |
| updated_at | timestamptz | DEFAULT now() | Last update timestamp |

**Indexes:**
- `idx_enforcement_actions_company_id` on `company_id`
- `idx_enforcement_actions_action_type` on `action_type`
- `idx_enforcement_actions_status` on `status`
- `idx_enforcement_actions_violation_type` on `violation_type`
- `idx_enforcement_actions_created_at` on `created_at`
- `idx_enforcement_actions_violation_reference` on `violation_reference_table, violation_reference_id`

**Notes:**
- Fines and suspensions require Tier 1 approval
- Warnings can be approved by Tier 2 (with Tier 1 oversight)
- All actions create audit log entries
- Actions can be appealed by companies (30-day window)
- Cancelled actions remain in database for audit trail

---

### enforcement_action_appeals
**Purpose:** Company appeals against enforcement actions

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PRIMARY KEY, DEFAULT gen_random_uuid() | Appeal ID |
| enforcement_action_id | uuid | REFERENCES enforcement_actions(id), NOT NULL | Enforcement action ID |
| appeal_reason | text | NOT NULL | Appeal reason |
| evidence | jsonb | NULLABLE | Evidence files (file references) |
| status | text | NOT NULL, DEFAULT 'submitted' | Status (submitted, tier2_reviewed, tier1_reviewed, upheld, rejected, withdrawn) |
| submitted_by | uuid | REFERENCES users(id), NOT NULL | Company user who submitted |
| submitted_at | timestamptz | DEFAULT now() | Submission timestamp |
| reviewed_by | uuid | REFERENCES users(id), NULLABLE | Tier 2 Officer who reviewed |
| reviewed_at | timestamptz | NULLABLE | Review timestamp |
| reviewed_by_tier1 | uuid | REFERENCES users(id), NULLABLE | Tier 1 who reviewed |
| reviewed_at_tier1 | timestamptz | NULLABLE | Tier 1 review timestamp |
| resolution | text | NULLABLE | Resolution decision |
| resolved_by | uuid | REFERENCES users(id), NULLABLE | User who resolved |
| resolved_at | timestamptz | NULLABLE | Resolution timestamp |
| created_at | timestamptz | DEFAULT now() | Creation timestamp |
| updated_at | timestamptz | DEFAULT now() | Last update timestamp |

**Indexes:**
- `idx_enforcement_action_appeals_enforcement_action_id` on `enforcement_action_id`
- `idx_enforcement_action_appeals_status` on `status`
- `idx_enforcement_action_appeals_submitted_at` on `submitted_at`

**Notes:**
- 30-day appeal window from action execution date
- Appeals require evidence submission
- Tier 2 reviews first, then Tier 1 makes final decision
- If appeal upheld, enforcement action is reversed (status: resolved, resolution: appeal_upheld)

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
- `enforcement_action_appeals` has unique constraint on `enforcement_action_id` (one appeal per action)

### Default Values
- `is_active` defaults to `true`
- `created_at` and `updated_at` default to `now()`
- Status fields have appropriate defaults

## Related Documents

- [Entity Relationship Diagram](erd.md)
- [Data Dictionary](data-dictionary.md)
- [RLS Policy Framework Design](../../security/rls-policy-framework.md)
- [Migration Strategy](migration-strategy.md)
- [Regulatory Framework](../../../03-governance/regulatory-framework.md) - Comprehensive regulatory reference including data retention requirements
- [Compliance Requirements](../../../03-governance/compliance-requirements.md) - Detailed compliance requirements including data retention
- [Regulatory Policies](../../../03-governance/regulatory-policies.md) - Regulatory policies and guidelines
- [Technical Decision Log](../../../06-development/technical-decisions/decision-log.md)

---

**Next Review Date:** [To be scheduled]  
**Owner:** Nadia

