# RPC Function Specifications - Pharmaceutical Governance Value Chain Platform (PM)

**Purpose:** This document provides detailed specifications for all RPC functions in the PM platform.

**Last Updated:** 2025-12-31  
**Status:** ✅ Complete (Phase 0, Week 3)  
**Owner:** Maya

## Overview

RPC functions are PostgreSQL functions called via Supabase client. They handle business logic, state transitions, and cross-module operations.

## RPC Function Organization

**By Module:**
- `rmm_*` - Registry Management Module functions
- `vci_*` - Value Chain Intelligence functions
- `ecs_*` - Export Control System functions
- `cmc_*` - Compliance Monitoring Center functions
- `shared_*` - Shared/common functions

## Shared Functions

### shared_get_user_permissions(user_id uuid)

**Purpose:** Get user permissions based on role

**Parameters:**
- `user_id` (uuid) - User ID

**Returns:** JSON object with permissions

**Example:**
```sql
SELECT shared_get_user_permissions(auth.uid());
```

---

### shared_check_module_active(module_name text)

**Purpose:** Check if module is active

**Parameters:**
- `module_name` (text) - Module name (rmm, vci, ecs, cmc)

**Returns:** boolean

**Example:**
```sql
SELECT shared_check_module_active('ecs');
```

---

### shared_create_audit_log(...)

**Purpose:** Create audit log entry

**Parameters:**
- `user_id` (uuid) - User ID
- `operation_type` (text) - Operation type
- `table_name` (text) - Table name
- `record_id` (uuid) - Record ID
- `old_values` (jsonb) - Old values
- `new_values` (jsonb) - New values
- `reason` (text) - Reason/justification

**Returns:** uuid (audit log ID)

---

### shared_create_notification(...)

**Purpose:** Create in-app notification

**Parameters:**
- `user_id` (uuid) - Recipient user ID
- `type` (text) - Notification type
- `title` (text) - Notification title
- `message` (text) - Notification message
- `link` (text) - Link to related entity

**Returns:** uuid (notification ID)

---

## RMM Module Functions

### rmm_create_company(...)

**Purpose:** Create new company

**Migration:** `20260129120000_rpc_rmm_company_crud.sql` (Task 1.1.2.1). **SECURITY INVOKER**; RLS applies (MOH only).

**Parameters:**
- `name` (text) - Company name
- `registration_number` (text) - Registration number
- `company_type` (text) - Company type (ipc, wholesaler)
- `address` (text) - Company address
- `contact_email` (text) - Contact email
- `contact_phone` (text) - Contact phone

**Returns:** JSON with company data

**Security:** SECURITY INVOKER (uses caller's permissions)

**Example:**
```sql
SELECT rmm_create_company(
  'Company Name',
  'REG123',
  'ipc',
  'Address',
  'email@example.com',
  '+1234567890'
);
```

---

### rmm_update_company(p_id uuid, p_name text DEFAULT NULL, ...)

**Purpose:** Update company. Only non-null parameters are updated.

**Parameters:**
- `p_id` (uuid) - Company ID (required)
- `p_name` (text, optional) - Company name
- `p_registration_number` (text, optional) - Registration number
- `p_company_type` (text, optional) - Company type (ipc, wholesaler)
- `p_address` (text, optional) - Company address
- `p_contact_email` (text, optional) - Contact email
- `p_contact_phone` (text, optional) - Contact phone

**Returns:** JSON with `{ company }` or `{ error, message }` / `{ error, company_id }` (e.g. not_found)

**Security:** SECURITY INVOKER (uses caller's permissions; RLS applies — MOH only for UPDATE)

**Migration:** `20260129120000_rpc_rmm_company_crud.sql` (Task 1.1.2.1)

---

### rmm_submit_registry_update(submission_type text, entity_type text, entity_id uuid, submission_data jsonb)

**Purpose:** Create draft registry submission (company-originated). Submit registry update (company, product, SKU) **including deletion requests**.

**Migration:** `20260129120600_rpc_rmm_registry_submission_create.sql` (Task 1.1.2.6). **SECURITY DEFINER**; company users only; entity must belong to caller's company. Creates row in `registry_submissions` with status `draft`.

**Parameters:**
- `submission_type` (text) - Submission type: `company_create`, `company_update`, `company_delete`, `product_create`, `product_update`, `product_delete`, `sku_create`, `sku_update`, `sku_delete`
- `entity_type` (text) - Entity type (`company`, `product`, `sku`)
- `entity_id` (uuid) - Entity ID (for updates/deletes); null allowed for `company_create`, `product_create`, `sku_create`. **Required for deletion requests**
- `submission_data` (jsonb) - Submission data (JSON). **For deletion requests, must include:**
  - `reason` (text, required, min 50 characters) - Reason for deletion (BUSINESS-LOGIC §4.3)
  - `detailed_explanation` (text, optional) - Detailed explanation

**Returns:** JSON with `{ submission: { id, submission_type, entity_type, entity_id, submission_data, status, submitted_by, created_at, updated_at } }` or `{ error, message }`

**State Transition:** Creates in `draft`; later workflow (Task 1.1.2.7+) moves `draft` → `submitted` → …

**Deletion requests:**
- **Who can create:** Tier 2 Officer (or Company for their own entities, if allowed).
- **Submission types:** `company_delete`, `product_delete`, `sku_delete`.
- **Required fields:**
  - `entity_id`: Must reference an existing entity.
  - `submission_data.reason`: Mandatory reason for deletion.
- **Workflow:** A deletion request follows the same workflow as other submissions:
  1. Created in `draft` status.
  2. Submitted → `submitted` status.
  3. Tier 2 Officer verifies → `tier2_verified` status.
  4. Tier 1 approves → `tier1_approved` status (issues command).
  5. Tier 2 Registrar implements → `tier2_implemented` status → applies soft delete.
  6. Completed → `completed` status.
- **Audit:** All steps are logged; the final deletion is logged with `old_values` preserved (see audit-logging-spec).

---

### rmm_list_submissions_page(p_limit int, p_offset int, p_status text, p_entity_type text, p_date_from timestamptz, p_date_to timestamptz)

**Purpose:** List registry submissions for the submissions list page with filters (status, entity type, date range). Returns entity display name, days until regulatory deadline (DMP Art. 10), and view_type (company | moh) for page title.

**Migration:** `20260129123800_rmm_list_submissions_page.sql` (Task 1.1.2.26). **SECURITY INVOKER**; RLS applies — company users see only their submissions; MOH see all.

**Parameters:**
- `p_limit` (int, default 50) - Page size (1–500)
- `p_offset` (int, default 0) - Offset for pagination
- `p_status` (text, optional) - Filter by status: `all`, `draft`, `submitted`, `tier2_verified`, `tier1_approved`, `completed`, `rejected`. `tier2_verified` includes `tier2_peer_reviewed`
- `p_entity_type` (text, optional) - Filter by entity type: `all`, `company`, `product`, `sku`
- `p_date_from` (timestamptz, optional) - Filter submissions created on or after this date
- `p_date_to` (timestamptz, optional) - Filter submissions created on or before this date

**Returns:** JSON with `{ data: array of { id, submission_type, entity_type, entity_id, entity_display_name, status, created_at, updated_at, days_until_deadline }, total: number, view_type: 'company' | 'moh' }`

**Security:** SECURITY INVOKER; RLS on `registry_submissions` enforces company isolation (company users) or system-wide (MOH).

---

### rmm_get_submission(p_id uuid)

**Purpose:** Get a single registry submission by ID with entity display name, days until regulatory deadline (DMP Art. 10), and view_type (company | moh) for role-based UI.

**Migration:** `20260129123900_rmm_get_submission_and_approval_history.sql` (Task 1.1.2.27). **SECURITY DEFINER**; explicit access check — MOH see any; company users see only same-company submissions or draft company_create where they are submitter.

**Parameters:**
- `p_id` (uuid) - Submission ID

**Returns:** JSON object with submission fields (`id`, `submission_type`, `entity_type`, `entity_id`, `entity_display_name`, `submission_data`, `status`, `submitted_by`, `verified_by`, `verified_at`, `approved_by`, `approved_at`, `implemented_by`, `implemented_at`, `rejection_reason`, `created_at`, `updated_at`, `days_until_deadline`, `view_type`, `allowed_actions`) or `{ error: 'not_found' }`. `allowed_actions` is an array of strings (`verify`, `peer_review`, `approve`, `implement`, `reject`) based on current user role and submission status (Task 1.1.2.28).

---

### rmm_get_submission_approval_history(p_submission_id uuid)

**Purpose:** Get approval history for a registry submission with approver name and role. Same access as `rmm_get_submission`.

**Migration:** `20260129123900_rmm_get_submission_and_approval_history.sql` (Task 1.1.2.27). **SECURITY DEFINER**; same access check as `rmm_get_submission`.

**Parameters:**
- `p_submission_id` (uuid) - Submission ID

**Returns:** JSON with `{ data: array of { id, submission_id, from_status, to_status, approval_type, comments, created_at, approver_name, approver_role } }` (newest first).

---

### rmm_verify_registry_submission(submission_id uuid, comments text DEFAULT NULL)

**Purpose:** Tier 2 Officer verifies registry submission (including deletion requests).

**Migration:** `20260129120700_rpc_rmm_verify_registry_submission.sql` (Task 1.1.2.7). **SECURITY DEFINER**; Tier 2 Officer (`tier2_officer`) only; updates `registry_submissions` (status, verified_by, verified_at) and inserts into `approvals`.

**Parameters:**
- `submission_id` (uuid) - Submission ID
- `comments` (text) - Verification comments (optional)

**Returns:** JSON with `{ submission: { id, submission_type, entity_type, entity_id, submission_data, status, submitted_by, verified_by, verified_at, ... } }` or `{ error, message }` / `{ error, message, current_status }`

**State Transition:** `submitted` → `tier2_verified`

**Validation:**
- User must be Tier 2 Officer (`tier2_officer`)
- Submission must be in `submitted` status

**Deletion requests:** Tier 2 Officer can verify deletion requests. Verification confirms the deletion request is valid and properly documented. After verification, the deletion request moves to Tier 1 for approval.

---

### rmm_peer_review_registry_submission(submission_id uuid, comments text DEFAULT NULL)

**Purpose:** Tier 2 Officer (different from submitter) peer reviews MOH-originated registry submission. Required for MOH submissions before Tier 1 approval (two-person rule).

**Migration:** `20260129121200_rpc_rmm_moh_peer_review.sql` (Task 1.1.2.12). **SECURITY DEFINER**; Tier 2 Officer (`tier2_officer`) only; peer reviewer must be different from `submitted_by`; updates `registry_submissions` (status → `tier2_peer_reviewed`, verified_by, verified_at) and inserts into `approvals` with `approval_type = 'peer_review'`.

**Parameters:**
- `submission_id` (uuid) - Submission ID
- `comments` (text) - Peer review comments (optional)

**Returns:** JSON with `{ submission: { id, submission_type, entity_type, entity_id, submission_data, status, submitted_by, verified_by, verified_at, ... } }` or `{ error, message }` / `{ error, message, current_status }`

**State Transition:** `submitted` → `tier2_peer_reviewed`

**Validation:**
- User must be Tier 2 Officer (`tier2_officer`)
- Submission must be in `submitted` status
- Peer reviewer must be a different user than `submitted_by` (distinct Tier 2 for MOH submissions)

---

### rmm_approve_registry_submission(submission_id uuid, comments text DEFAULT NULL)

**Purpose:** Tier 1 approves registry submission (including deletion requests).

**Migration:** `20260129120800_rpc_rmm_approve_registry_submission.sql` (Task 1.1.2.8), updated in `20260129121200_rpc_rmm_moh_peer_review.sql` (Task 1.1.2.12). **SECURITY DEFINER**; Tier 1 (`tier1`) only; updates `registry_submissions` (status, approved_by, approved_at) and inserts into `approvals`.

**Parameters:**
- `submission_id` (uuid) - Submission ID
- `comments` (text) - Approval comments (optional)

**Returns:** JSON with `{ submission: { id, submission_type, entity_type, entity_id, submission_data, status, submitted_by, verified_by, verified_at, approved_by, approved_at, ... } }` or `{ error, message }` / `{ error, message, current_status }`

**State Transition:** `tier2_verified` or `tier2_peer_reviewed` → `tier1_approved`

**Validation:**
- User must be Tier 1 (`tier1`)
- Submission must be in `tier2_verified` (company path) or `tier2_peer_reviewed` (MOH peer-review path) status

**Deletion requests:** Tier 1 approval of a deletion request is the "issue the command" step. Approval authorizes the Tier 2 Registrar to implement the deletion. After approval, the deletion request moves to the Tier 2 Registrar for implementation.

---

### rmm_implement_registry_update(submission_id uuid)

**Purpose:** Tier 2 Registrar implements registry update (including approved deletions).

**Migration:** `20260129120900_rpc_rmm_implement_registry_update.sql` (Task 1.1.2.9), updated in `20260129121500_two_person_rule.sql` (Task 1.1.2.15). **SECURITY DEFINER**; Tier 2 Registrar (`tier2_registrar`) only; for **critical actions** (`company_delete`, `product_delete`) enforces **two-person rule** via `rmm_two_person_rule_satisfied` (Tier 2 Officer verification + Tier 1 approval, two different users) before implementing; applies create/update via existing CRUD RPCs; applies soft delete for delete types with cascade and `insert_audit_log`; updates `registry_submissions` (status, implemented_by, implemented_at) and inserts into `approvals`.

**Parameters:**
- `submission_id` (uuid) - Submission ID

**Returns:** JSON with updated submission or `{ error: 'two_person_rule_not_satisfied', satisfied: false, message }` when the two-person rule is not satisfied for critical actions.

**State Transition:** `tier1_approved` → `tier2_implemented`

**Two-person rule (Task 1.1.2.15):** For `company_delete` (company suspension/deletion) and `product_delete` (product deactivation/deletion including critical medicines), implementation is blocked unless the submission has Tier 2 Officer verification (`verified_by` with role `tier2_officer`) and Tier 1 approval (`approved_by` with role `tier1`), and verifier ≠ approver.

**Validation:**
- User must be Tier 2 Registrar
- Submission must be in `tier1_approved` status

**Deletion implementation:**  
When `submission_type` is `company_delete`, `product_delete`, or `sku_delete`:

1. **Soft delete applied**
   - **Products/SKUs:** Sets `deactivated_at` = current timestamp, `deactivated_by` = implementing user (Tier 2 Registrar), `deactivated_reason` = reason from `submission_data`.
   - **Companies:** Uses suspension/deactivation semantics per schema (e.g. `suspended_at`, `suspended_by`, `suspended_reason` and/or `is_active`); entity record is retained.

2. **Cascade deactivation**
   - Company deletion → deactivates all products and SKUs for that company.
   - Product deletion → deactivates all SKUs for that product.
   - SKU deletion → no cascade (leaf entity).

3. **Audit log entry**
   - Creates an `audit_logs` row with:
     - `operation_type` = `'DELETE'`
     - `table_name` = entity table (`companies` / `products` / `skus`)
     - `record_id` = entity ID
     - `old_values` = full entity data before deletion (JSONB) — **mandatory**
     - `new_values` = deactivation/suspension fields set
     - `user_id` = implementing user
   - Hash chain and retention follow audit-logging-spec (e.g. 7-year retention).

4. **Submission status**
   - Updates submission status to `tier2_implemented` and marks the submission as completed.

5. **No hard deletes**
   - Entity row remains in the database; only deactivation/suspension fields are set. All data is preserved for audit (see audit-logging-spec).

---

### rmm_complete_registry_submission(submission_id uuid)

**Purpose:** Tier 2 Registrar marks registry submission as completed (workflow closure).

**Migration:** `20260129121000_rpc_rmm_complete_registry_submission.sql` (Task 1.1.2.10). **SECURITY DEFINER**; Tier 2 Registrar (`tier2_registrar`) only; updates `registry_submissions` (status → `completed`, updated_at) and inserts into `approvals` with `approval_type = 'completion'`.

**Parameters:**
- `submission_id` (uuid) - Submission ID

**Returns:** JSON with `{ submission: { id, submission_type, entity_type, entity_id, submission_data, status, submitted_by, verified_by, verified_at, approved_by, approved_at, implemented_by, implemented_at, rejection_reason, created_at, updated_at } }` or `{ error, message }` / `{ error, message, current_status }`

**State Transition:** `tier2_implemented` → `completed`

**Validation:**
- User must be Tier 2 Registrar (`tier2_registrar`)
- Submission must be in `tier2_implemented` status

---

### rmm_two_person_rule_satisfied(submission_id uuid)

**Purpose:** Check that a registry submission satisfies the two-person rule (Tier 2 Officer verification + Tier 1 approval, two different users). Used by `rmm_implement_registry_update` for critical actions and by frontend/tests.

**Migration:** `20260129121500_two_person_rule.sql` (Task 1.1.2.15). **SECURITY DEFINER**; read-only check on `registry_submissions` and `users`.

**Parameters:**
- `submission_id` (uuid) - Submission ID

**Returns:** `{ satisfied: true }` or `{ satisfied: false, message: "..." }` (e.g. verification/approval missing, same user, or role mismatch).

**Validation:** Verifies `verified_by` and `approved_by` are set; `verified_by` has role `tier2_officer`; `approved_by` has role `tier1`; `verified_by` ≠ `approved_by`.

---

### rmm_reject_registry_submission(submission_id uuid, rejection_reason text)

**Purpose:** Tier 2 Officer or Tier 1 rejects a registry submission (workflow rejection with reason).

**Migration:** `20260129121100_rpc_rmm_reject_registry_submission.sql` (Task 1.1.2.11). **SECURITY DEFINER**; Tier 2 Officer (`tier2_officer`) or Tier 1 (`tier1`) only; updates `registry_submissions` (status → `rejected`, rejection_reason) and inserts into `approvals` with `approval_type = 'rejection'`.

**Parameters:**
- `submission_id` (uuid) - Submission ID
- `rejection_reason` (text) - Mandatory reason for rejection (min 10 characters)

**Returns:** JSON with `{ submission: { id, submission_type, entity_type, entity_id, submission_data, status, submitted_by, verified_by, verified_at, approved_by, approved_at, implemented_by, implemented_at, rejection_reason, created_at, updated_at } }` or `{ error, message }` / `{ error, message, current_status }`

**State Transition:** Any eligible status → `rejected`

**Validation:**
- User must be Tier 2 Officer or Tier 1
- **Tier 2 Officer:** can reject only when status is `submitted`, `tier2_verified`, or `tier2_peer_reviewed`
- **Tier 1:** can reject only when status is `tier2_verified`, `tier2_peer_reviewed`, or `tier1_approved`
- Submission must not be `draft`, `rejected`, `completed`, or `tier2_implemented`
- `rejection_reason` is required and must be at least 10 characters (trimmed)

---

## Enforcement Module Functions

### enforcement_create_action(company_id uuid, action_type text, violation_type text, legal_basis text, justification text, ...)

**Purpose:** Create a draft enforcement action. MOH only.

**Migration:** `20260129121600_rpc_enforcement_submit_for_review.sql` (Task 1.1.2.31). **SECURITY DEFINER**; MOH roles only (`tier1`, `tier2_officer`, `tier2_registrar`, `system_admin`); creates row in `enforcement_actions` with status `draft`.

**Parameters:**
- `p_company_id` (uuid) - Company ID (required)
- `p_action_type` (text) - `warning`, `fine`, or `suspension` (determines approval path: Warning → Tier 2; Fine/Suspension → Tier 1)
- `p_violation_type` (text) - One of: `submission_non_compliance`, `threshold_breach`, `critical_medicine_non_compliance`, `export_violation`, `data_quality_issue`, `repeated_offender`
- `p_legal_basis` (text) - Legal basis (required)
- `p_justification` (text) - Justification (required; min 50 characters per BUSINESS-LOGIC)
- `p_amount` (numeric, optional) - Amount (e.g. for fine)
- `p_currency` (text, optional) - Default `MAD`
- `p_notes` (text, optional)
- `p_violation_reference_id` (uuid, optional)
- `p_violation_reference_table` (text, optional)

**Returns:** JSON with `{ action: { id, company_id, action_type, violation_type, ... } }` or `{ error, message }`

**Validation:** Company must exist and be active; justification min 50 chars.

---

### enforcement_submit_action(action_id uuid)

**Purpose:** Submit an enforcement action for review. Transitions draft → pending_review and records approval.

**Migration:** `20260129121600_rpc_enforcement_submit_for_review.sql` (Task 1.1.2.31). **SECURITY DEFINER**; MOH only; action must be in `draft`; updates `enforcement_actions.status` to `pending_review` and inserts into `approvals` with `approval_type = 'submit'`.

**Parameters:**
- `p_action_id` (uuid) - Enforcement action ID

**Returns:** JSON with `{ action: { id, company_id, action_type, violation_type, status, ... } }` or `{ error, message }` / `{ error, message, current_status }`

**State Transition:** `draft` → `pending_review`

**Validation:** Action must exist and be in `draft`. Approval path (Tier 2 vs Tier 1) is determined by `action_type` in review/approve RPCs (Tasks 1.1.2.32, 1.1.2.33).

---

### enforcement_review_action(action_id uuid, review_notes text DEFAULT NULL)

**Purpose:** Tier 2 Officer reviews an enforcement action. Warning → approved (Tier 2 alone); Fine/Suspension → pending_approval (Tier 1 must approve).

**Migration:** `20260129121700_rpc_enforcement_review_action.sql` (Task 1.1.2.32). **SECURITY DEFINER**; Tier 2 Officer (`tier2_officer`) only; action must be in `pending_review`; updates `enforcement_actions` (status, reviewed_by, reviewed_at, review_notes; for Warning also approved_by, approved_at) and inserts into `approvals` with `approval_type = 'review'`. Audit: existing AFTER UPDATE trigger on `enforcement_actions` logs row change (including review_notes).

**Parameters:**
- `p_action_id` (uuid) - Enforcement action ID
- `p_review_notes` (text, optional for Warning) - For **Fine/Suspension**: mandatory justification (min 50 characters); stored in `review_notes` and audited via trigger.

**Returns:** JSON with `{ action: { id, company_id, action_type, violation_type, status, reviewed_by, reviewed_at, review_notes, approved_by, approved_at, ... } }` or `{ error, message }` / `{ error, message, current_status }`

**State Transitions:**
- **Warning:** `pending_review` → `approved` (Tier 2 alone; sets approved_by = reviewer).
- **Fine/Suspension:** `pending_review` → `pending_approval` (justification min 50 chars required).

**Validation:** Action must exist and be in `pending_review`. For Fine/Suspension, `p_review_notes` (justification) required and min 50 characters.

---

### enforcement_approve_action(action_id uuid, approval_notes text)

**Purpose:** Tier 1 approves an enforcement action (Fine/Suspension path). Enforces two-person rule (Tier 2 must have reviewed); requires justification (min 50 chars).

**Migration:** `20260129121800_rpc_enforcement_approve_action.sql` (Task 1.1.2.33). **SECURITY DEFINER**; Tier 1 (`tier1`) only; action must be in `pending_approval`; **two-person rule:** `reviewed_by` must be set (Tier 2 Officer) and different from approver (Tier 1); updates `enforcement_actions` (status → `approved`, approved_by, approved_at, approval_notes) and inserts into `approvals` with `approval_type = 'approval'`. Audit: existing AFTER UPDATE trigger on `enforcement_actions` logs row change (including approval_notes).

**Parameters:**
- `p_action_id` (uuid) - Enforcement action ID
- `p_approval_notes` (text, required) - Justification for Tier 1 approval (min 50 characters); stored in `approval_notes` and audited via trigger.

**Returns:** JSON with `{ action: { id, company_id, action_type, violation_type, status, reviewed_by, approved_by, approval_notes, ... } }` or `{ error, message }` / `{ error, message, current_status }` / `{ error, two_person_rule, message }`

**State Transition:** `pending_approval` → `approved`

**Validation:** Action must exist and be in `pending_approval`. **Two-person rule:** `reviewed_by` must be set and be a Tier 2 Officer; approver must be Tier 1 and different from reviewer. `p_approval_notes` required and min 50 characters.

---

### enforcement_reject_action(action_id uuid, rejection_reason text)

**Purpose:** Tier 1 rejects a pending enforcement action (Fine/Suspension path). Sets status to `cancelled` and records rejection reason; inserts into `approvals` with `approval_type = 'rejection'`.

**Migration:** `20260129129000_rpc_enforcement_reject_action.sql` (Task 1.1.2.41). **SECURITY DEFINER**; Tier 1 (`tier1`) only; action must be in `pending_approval`; updates `enforcement_actions` (status → `cancelled`, resolution, resolved_by, resolved_at) and inserts into `approvals` with `approval_type = 'rejection'`. Audit: existing AFTER UPDATE trigger on `enforcement_actions` logs row change.

**Parameters:**
- `p_action_id` (uuid) - Enforcement action ID
- `p_rejection_reason` (text, required) - Rejection reason (min 20 characters); stored in `resolution` and in `approvals.comments`.

**Returns:** JSON with `{ action: { id, company_id, action_type, violation_type, status, resolution, resolved_by, resolved_at, ... } }` or `{ error, message }` / `{ error, message, current_status }`

**State Transition:** `pending_approval` → `cancelled`

**Validation:** Action must exist and be in `pending_approval`. `p_rejection_reason` required and min 20 characters.

---

### enforcement_execute_action(action_id uuid, execution_notes text DEFAULT NULL)

**Purpose:** Execute an approved enforcement action. MOH only. When Tier 1 executes, justification (execution_notes) min 50 chars required. Suspension applies to company (suspended_at, is_active=false; cascade deactivates products/SKUs).

**Migration:** `20260129121900_rpc_enforcement_execute_action.sql` (Task 1.1.2.34). **SECURITY DEFINER**; MOH roles only (`tier1`, `tier2_officer`, `tier2_registrar`, `system_admin`); action must be in `approved`; **when Tier 1 executes:** `p_execution_notes` required and min 50 characters; updates `enforcement_actions` (status → `executed`, executed_by, executed_at, execution_notes) and inserts into `approvals` with `approval_type = 'execute'`. **Suspension:** updates `companies` (suspended_at, suspended_by, suspended_reason, is_active = false); cascade deactivation applies to products/SKUs. Audit: existing AFTER UPDATE triggers on `enforcement_actions` and `companies` log row changes.

**Parameters:**
- `p_action_id` (uuid) - Enforcement action ID
- `p_execution_notes` (text, optional for Tier 2) - **When Tier 1 executes:** required justification (min 50 characters); stored in `execution_notes` and audited via trigger. Used as `suspended_reason` when action_type = suspension.

**Returns:** JSON with `{ action: { id, company_id, action_type, violation_type, status, executed_by, executed_at, execution_notes, ... } }` or `{ error, message }` / `{ error, message, current_status }`

**State Transition:** `approved` → `executed`

**Side effects:** For **suspension**, updates `companies` (suspended_at, suspended_by, suspended_reason, is_active = false); cascade deactivation applies to associated products and SKUs.

**Validation:** Action must exist and be in `approved`. When caller is Tier 1, `p_execution_notes` required and min 50 characters.

---

### enforcement_submit_appeal(action_id uuid, appeal_reason text, evidence jsonb DEFAULT NULL)

**Purpose:** Company users submit an appeal against an executed enforcement action. Appeal must be submitted within **30 days of execution** (BUSINESS-LOGIC); rejected after the window. One appeal per action.

**Migration:** `20260129122000_rpc_enforcement_submit_appeal.sql` (Task 1.1.2.35). **SECURITY DEFINER**; company users only (`company_admin`, `company_manager`, `company_user`); action must belong to caller's company; action must be in `executed` status; **30-day window:** `executed_at` must be within last 30 days; creates row in `enforcement_action_appeals` (status `submitted`) and updates `enforcement_actions` (appeal_id, status → `appealed`). Audit: existing AFTER INSERT/UPDATE triggers on `enforcement_action_appeals` and `enforcement_actions` log changes.

**Parameters:**
- `p_action_id` (uuid) - Enforcement action ID (must be executed and belong to caller's company)
- `p_appeal_reason` (text, required) - Appeal reason (min 20 characters)
- `p_evidence` (jsonb, optional) - Supporting evidence

**Returns:** JSON with `{ appeal: { id, enforcement_action_id, appeal_reason, evidence, status, submitted_by, submitted_at, ... }, action: { id, company_id, action_type, status, appeal_id, ... } }` or `{ error, message }` / `{ error, appeal_window_expired, message }` / `{ error, already_appealed, message }`

**Validation:** Action must exist, be in `executed`, belong to caller's company. **30-day window:** `executed_at >= now() - 30 days`. No existing appeal for this action. `p_appeal_reason` required and min 20 characters.

---

### enforcement_review_appeal(appeal_id uuid, review_notes text DEFAULT NULL)

**Purpose:** Tier 1 marks an enforcement appeal as under Tier 1 review (submitted/tier2_reviewed → tier1_reviewed). **SLA:** Tier 1 review target within **14 business days** (documented; not enforced in DB).

**Migration:** `20260129122100_rpc_enforcement_resolve_appeal.sql` (Task 1.1.2.36). **SECURITY DEFINER**; Tier 1 (`tier1`) only; appeal must be in `submitted` or `tier2_reviewed`; updates `enforcement_action_appeals` (reviewed_by_tier1, reviewed_at_tier1, status → `tier1_reviewed`).

**Parameters:** `p_appeal_id` (uuid), `p_review_notes` (text, optional).

**Returns:** JSON with `{ appeal: { id, enforcement_action_id, status, reviewed_by_tier1, reviewed_at_tier1, ... } }` or error.

---

### enforcement_uphold_appeal(appeal_id uuid, resolution text)

**Purpose:** Tier 1 upholds appeal (company wins). Appeal → `upheld`; enforcement action → `resolved`. If action was **suspension**, company is reinstated (is_active = true, suspended_* cleared). Resolution min 50 chars.

**Migration:** `20260129122100_rpc_enforcement_resolve_appeal.sql` (Task 1.1.2.36). **SECURITY DEFINER**; Tier 1 only; appeal in `submitted`, `tier2_reviewed`, or `tier1_reviewed`; updates appeal (status → `upheld`, resolution, resolved_by, resolved_at), enforcement_actions (status → `resolved`, resolution, resolved_by, resolved_at); if action_type = suspension, updates companies (is_active = true, clear suspended_*).

**Parameters:** `p_appeal_id` (uuid), `p_resolution` (text, required; min 50 characters).

**Returns:** JSON with `{ appeal: { ... }, action: { ... } }` or error.

---

### enforcement_overturn_appeal(appeal_id uuid, resolution text)

**Purpose:** Tier 1 overturns (rejects) appeal. Appeal → `rejected`; enforcement action → `resolved`. Resolution min 50 chars.

**Migration:** `20260129122100_rpc_enforcement_resolve_appeal.sql` (Task 1.1.2.36). **SECURITY DEFINER**; Tier 1 only; appeal in `submitted`, `tier2_reviewed`, or `tier1_reviewed`; updates appeal (status → `rejected`, resolution, resolved_by, resolved_at), enforcement_actions (status → `resolved`, resolution, resolved_by, resolved_at).

**Parameters:** `p_appeal_id` (uuid), `p_resolution` (text, required; min 50 characters).

**Returns:** JSON with `{ appeal: { ... }, action: { ... } }` or error.

---

### enforcement_get_dashboard_stats()

**Purpose:** Return enforcement dashboard metrics. MOH only (tier1, tier2_officer, tier2_registrar, system_admin).

**Migration:** `20260129126000_rpc_enforcement_dashboard.sql` (Task 1.1.2.37). **SECURITY DEFINER**; MOH only.

**Parameters:** None.

**Returns:** JSON with `recent_count`, `pending_count`, `warnings`, `fines`, `suspensions`, `total`, `legal_basis_compliance_pct`, `deadline_compliance_pct`, `regulatory_requirements_pct` or `{ error, message }`.

---

### enforcement_list_recent_actions(p_limit int DEFAULT 5)

**Purpose:** List recent enforcement actions (executed/approved/resolved) for dashboard. MOH only.

**Migration:** `20260129126000_rpc_enforcement_dashboard.sql` (Task 1.1.2.37). **SECURITY DEFINER**; MOH only.

**Parameters:** `p_limit` (int, 1–50) — max rows (default 5).

**Returns:** JSON with `{ data: [ { id, company_id, company_name, action_type, violation_type, status, amount, currency, legal_basis, executed_at, updated_at }, ... ] }` or `{ error, message }`.

---

### enforcement_list_pending_approvals(p_limit int DEFAULT 5)

**Purpose:** List pending enforcement approvals (pending_review, pending_approval) for dashboard. MOH only.

**Migration:** `20260129126000_rpc_enforcement_dashboard.sql` (Task 1.1.2.37). **SECURITY DEFINER**; MOH only.

**Parameters:** `p_limit` (int, 1–50) — max rows (default 5).

**Returns:** JSON with `{ data: [ { id, company_id, company_name, action_type, violation_type, status, amount, currency, legal_basis, created_at, updated_at }, ... ] }` or `{ error, message }`.

---

### enforcement_list_actions(p_search, p_action_types, p_status, p_company_id, p_date_from, p_date_to, p_limit, p_offset)

**Purpose:** List enforcement actions with filters and pagination for the Enforcement Actions list page. MOH only (tier1, tier2_officer, tier2_registrar, system_admin).

**Migration:** `20260129127000_rpc_enforcement_list_actions.sql` (Task 1.1.2.38). **SECURITY DEFINER**; MOH only.

**Parameters:**
- `p_search` (text, optional) — search in company name, violation_type, action_type, legal_basis
- `p_action_types` (text[], optional) — filter by action_type (e.g. `ARRAY['warning','fine']`); NULL = all
- `p_status` (text, default 'all') — `all`, `pending` (pending_review + pending_approval), `executed`, `appealed`, `resolved`, `cancelled`
- `p_company_id` (uuid, optional) — filter by company
- `p_date_from`, `p_date_to` (timestamptz, optional) — filter by created_at range
- `p_limit` (int, default 20), `p_offset` (int, default 0) — pagination

**Returns:** JSON with `{ data: [ { id, company_id, company_name, action_type, violation_type, legal_basis, amount, currency, status, executed_at, created_at, updated_at }, ... ] }`, `total` (bigint), or `{ error, message }`.

**Access:** MOH Tier 1 and Tier 2 only. Excludes `draft` status.

---

### enforcement_get_reports(p_date_from timestamptz DEFAULT NULL, p_date_to timestamptz DEFAULT NULL)

**Purpose:** Return enforcement reports summary for a date range (Enforcement Reports page). MOH Tier 1 and Tier 2 only. Default range: last 30 days if NULL.

**Migration:** `20260129130000_rpc_enforcement_reports.sql` (Task 1.1.2.42). **SECURITY DEFINER**; MOH only (`tier1`, `tier2_officer`, `tier2_registrar`, `system_admin`). Reads from `enforcement_actions`, `companies`, `enforcement_action_appeals`.

**Parameters:**
- `p_date_from` (timestamptz, optional) — start of report period; NULL = 30 days before p_date_to
- `p_date_to` (timestamptz, optional) — end of report period; NULL = now()

**Returns:** JSON with `date_from`, `date_to`, `total_actions`, `previous_period_total`, `trend_pct`, `by_action_type` (warning, fine, suspension counts), `by_violation_type` (array of { violation_type, count }), `compliance` (legal_basis_pct, legal_basis_count, total_count, deadline_pct, legal_authority_pct, legal_authority_count), `top_companies` (array of { company_id, company_name, action_count } up to 10), `fine_analysis` (total_fines, average_fine, highest_fine, fine_count), `appeal_stats` (total_appeals, upheld_count, rejected_count), or `{ error, message }`.

---

### enforcement_get_analytics(p_date_from timestamptz DEFAULT NULL, p_date_to timestamptz DEFAULT NULL)

**Purpose:** Return enforcement analytics (trends by month, fines by month) for charts on the Enforcement Reports page. MOH Tier 1 and Tier 2 only. Default range: last 12 months if NULL.

**Migration:** `20260129130000_rpc_enforcement_reports.sql` (Task 1.1.2.42). **SECURITY DEFINER**; MOH only.

**Parameters:**
- `p_date_from` (timestamptz, optional) — start of analytics period; NULL = 12 months before p_date_to
- `p_date_to` (timestamptz, optional) — end of analytics period; NULL = now()

**Returns:** JSON with `date_from`, `date_to`, `trends` (array of { month, year, month_label, warning, fine, suspension, total } per month), `fines_by_month` (array of { month, year, month_label, total_amount, count } per month), or `{ error, message }`.

---

### enforcement_get_action(p_action_id uuid)

**Purpose:** Get a single enforcement action for the detail page with company name and creator/reviewer/approver/executor names and roles.

**Migration:** `20260129128000_rpc_enforcement_get_action_and_history.sql` (Task 1.1.2.39). **SECURITY DEFINER**; access: MOH (tier1, tier2_officer, tier2_registrar, auditor, system_admin) or same company (company_id = current_user_company_id()).

**Parameters:** `p_action_id` (uuid) — enforcement action ID.

**Returns:** JSON with `action` (full row), `company_name`, `created_by_name`, `created_by_role`, `reviewed_by_name`, `reviewed_by_role`, `approved_by_name`, `approved_by_role`, `executed_by_name`, `executed_by_role`, or `{ error, message }`.

---

### enforcement_get_action_history(p_action_id uuid)

**Purpose:** Get approval chain (approval history) for an enforcement action.

**Migration:** `20260129128000_rpc_enforcement_get_action_and_history.sql` (Task 1.1.2.39). **SECURITY DEFINER**; same access as enforcement_get_action.

**Parameters:** `p_action_id` (uuid) — enforcement action ID.

**Returns:** JSON with `{ data: [ { id, approval_type, from_status, to_status, approver_id, approver_name, approver_role, comments, created_at }, ... ] }` (ordered by created_at ASC), or `{ error, message }`.

---

### enforcement_get_appeal_status(p_action_id uuid)

**Purpose:** Get appeal status for an enforcement action (appeal if any, appeal window remaining days if executed and no appeal).

**Migration:** `20260129128000_rpc_enforcement_get_action_and_history.sql` (Task 1.1.2.39). **SECURITY DEFINER**; same access as enforcement_get_action.

**Parameters:** `p_action_id` (uuid) — enforcement action ID.

**Returns:** JSON with `appeal` (object or null), `appeal_window_remaining_days` (int or null), `executed_at` (timestamptz or null), or `{ error, message }`.

---

## VCI Module Functions

### vci_submit_aams(...)

**Purpose:** Submit AAMS (Annual Average Monthly Sales)

**Parameters:**
- `company_id` (uuid) - Company ID
- `year` (integer) - Year
- `aams_value` (numeric) - AAMS value (quantity of units sold per month average)
- `submission_data` (jsonb) - Full submission data (monthly breakdown)

**Returns:** JSON with submission data

**State Transition:** `draft` → `submitted`

**Business Rules:**
- Must be submitted by January 31st (15-day grace period until February 15th)
- Late submissions marked with `is_late = true`

---

### vci_verify_aams(submission_id uuid, comments text DEFAULT NULL)

**Purpose:** Tier 2 Officer verifies AAMS and calculates threshold

**Parameters:**
- `submission_id` (uuid) - Submission ID
- `comments` (text) - Verification comments

**Returns:** JSON with submission and calculated threshold

**State Transition:** `submitted` → `tier2_verified`

**Side Effects:**
- Calculates threshold (B × AAMS)
- Creates threshold record

---

### vci_approve_aams_threshold(submission_id uuid, comments text DEFAULT NULL)

**Purpose:** Tier 1 approves AAMS threshold

**Parameters:**
- `submission_id` (uuid) - Submission ID
- `comments` (text) - Approval comments

**Returns:** JSON with updated submission

**State Transition:** `tier2_verified` → `tier1_approved`

---

### vci_submit_msq(...)

**Purpose:** Submit MSQ (Monthly Sales Quantities)

**Parameters:**
- `company_id` (uuid) - Company ID
- `year` (integer) - Year
- `month` (integer) - Month (1-12)
- `submission_data` (jsonb) - Submission data (SKU quantities)

**Returns:** JSON with submission data

**State Transition:** - → `submitted`

**Business Rules:**
- 7-day grace period for corrections
- Automated validation checks completeness, format, historical patterns
- MSQ vs AAMS validation (20% threshold, configurable)

---

### vci_submit_wsl(...)

**Purpose:** Submit WSL (Weekly Stock Levels)

**Parameters:**
- `company_id` (uuid) - Company ID
- `week_ending_date` (date) - Week ending date (Friday)
- `submission_data` (jsonb) - Submission data (all SKUs with stock levels)

**Returns:** JSON with submission data

**State Transition:** - → `submitted`

**Business Rules:**
- Must include all SKUs at once (complete submission)
- Must be submitted by Friday EOD (late if after Friday, non-compliant if after Monday)
- Checks for breaches (stock < threshold)

**Side Effects:**
- Creates breach records if stock < threshold
- Triggers alerts for breaches

---

### vci_detect_breach(...)

**Purpose:** System detects threshold breach

**Parameters:**
- `sku_id` (uuid) - SKU ID
- `company_id` (uuid) - Company ID
- `wsl_submission_id` (uuid) - WSL submission ID
- `stock_level` (numeric) - Stock level
- `threshold_value` (numeric) - Threshold value

**Returns:** JSON with breach data

**State Transition:** - → `detected`

**Side Effects:**
- Creates breach record
- Triggers alerts (Tier 2, Tier 1 for critical)
- Sets priority (standard, high, critical)

---

### vci_suggest_breach_action(breach_id uuid, suggested_action text, details text DEFAULT NULL)

**Purpose:** Tier 2 suggests action for breach

**Parameters:**
- `breach_id` (uuid) - Breach ID
- `suggested_action` (text) - Suggested action (warning, require_replenishment_plan, require_production_plan, enhanced_monitoring, escalate)
- `details` (text) - Action details

**Returns:** JSON with updated breach

**State Transition:** `tier2_analyzing` → `tier2_suggested`

---

### vci_get_historical_submissions(...)

**Purpose:** Get historical submissions (AAMS, MSQ, WSL) with filtering and pagination

**Parameters:**
- `p_submission_type` (text) - Submission type ('aams', 'msq', 'wsl')
- `p_company_id` (uuid, DEFAULT NULL) - Company ID (NULL for MOH - all companies)
- `p_year` (integer, DEFAULT NULL) - Filter by year
- `p_month` (integer, DEFAULT NULL) - Filter by month (for MSQ)
- `p_limit` (integer, DEFAULT 100) - Number of records to return
- `p_offset` (integer, DEFAULT 0) - Offset for pagination

**Returns:** TABLE with submission data

**Access Control:**
- Company users: Only own company's submissions
- MOH users: All companies' submissions
- RLS automatically applied via SECURITY DEFINER

**Example:**
```sql
SELECT * FROM vci_get_historical_submissions(
  'aams',
  NULL,  -- MOH: all companies
  2023,  -- Year filter
  NULL,  -- No month filter for AAMS
  100,   -- Limit
  0      -- Offset
);
```

**Business Rules:**
- Returns submissions ordered by year DESC, month DESC (for MSQ), week_ending DESC (for WSL)
- Applies RLS policies automatically
- Logs access via audit_logs table
- Supports 7-year lookback (regulatory requirement)

---

### vci_modify_threshold(
  threshold_id uuid,
  new_multiplier numeric,
  scope text,
  duration_type text DEFAULT 'permanent',
  revert_date date DEFAULT NULL,
  revert_to_multiplier numeric DEFAULT NULL,
  requires_manual_review boolean DEFAULT false,
  justification text
)

**Purpose:** Tier 1 modifies threshold multiplier (permanent or time-bound)

**Parameters:**
- `threshold_id` (uuid) - Current threshold ID to modify
- `new_multiplier` (numeric) - New multiplier value (0.1 to 5.0)
- `scope` (text) - Modification scope ('local' for this SKU, 'global' for all SKUs of same product)
- `duration_type` (text) - Duration type: 'permanent', 'temporary_auto_revert', 'temporary_manual_review' (default: 'permanent')
- `revert_date` (date) - Date when temporary threshold reverts (required if duration_type is temporary, must be future date)
- `revert_to_multiplier` (numeric) - Multiplier to revert to (required if duration_type is temporary)
- `requires_manual_review` (boolean) - If true, requires Tier 1 confirmation before auto-revert (only for temporary_manual_review)
- `justification` (text) - Regulatory justification (minimum 50 characters, required)

**Returns:** JSON with new threshold data

**State Transition:** Creates new threshold version (non-retroactive)

**Validation:**
- User must be Tier 1
- `new_multiplier` must be between 0.1 and 5.0
- `justification` must be at least 50 characters
- If `duration_type = 'temporary'`:
  - `revert_date` must be provided and in the future
  - `revert_to_multiplier` must be provided and between 0.1 and 5.0
  - `revert_date` must be > `effective_from` date
- Cannot modify if another temporary modification is scheduled before `revert_date` (conflict detection)

**Side Effects:**
- Marks current threshold as `is_current = false` and sets `effective_to = CURRENT_DATE`
- Creates new threshold version with new multiplier
- Calculates new threshold value: `new_multiplier × AAMS`
- If `scope = 'global'`, applies to all SKUs under same product
- If temporary, sets `revert_date`, `revert_to_multiplier`, `revert_to_threshold_value`
- Creates audit log entry with justification
- Schedules notifications (7 days, 1 day before reversion if temporary)

**Business Rules:**
- Non-retroactive: Only affects future calculations
- Version history: Old threshold preserved with `is_current = false`
- Temporary thresholds: Auto-revert or require manual review on `revert_date`
- Conflict resolution: If new modification scheduled before existing `revert_date`, cancels existing temporary threshold

**Example:**
```sql
SELECT vci_modify_threshold(
  '123e4567-e89b-12d3-a456-426614174000'::uuid,  -- threshold_id
  1.5,                                            -- new_multiplier
  'local',                                        -- scope
  'temporary_auto_revert',                        -- duration_type
  '2025-06-30'::date,                            -- revert_date
  1.0,                                            -- revert_to_multiplier
  false,                                          -- requires_manual_review
  'Temporary increase due to supply chain disruption. Expected to resolve by Q2 2025. Regulatory basis: DMP Circular 2024-15.'  -- justification
);
```

---

### vci_revert_threshold(threshold_id uuid, confirmation_justification text DEFAULT NULL)

**Purpose:** Manually revert temporary threshold (for manual review type or early reversion)

**Parameters:**
- `threshold_id` (uuid) - Threshold ID to revert
- `confirmation_justification` (text) - Optional justification for manual reversion (required if early reversion)

**Returns:** JSON with reverted threshold data

**State Transition:** Creates new threshold version with revert values

**Validation:**
- User must be Tier 1
- Threshold must have `duration_type IN ('temporary_auto_revert', 'temporary_manual_review')`
- If reverting before `revert_date`, `confirmation_justification` is required (minimum 50 characters)

**Side Effects:**
- Calls `revert_temporary_threshold()` function
- Creates new threshold version with `revert_to_*` values
- Marks old threshold as `is_current = false`
- Creates audit log entry
- Sends notification to threshold creator

**Example:**
```sql
SELECT vci_revert_threshold(
  '123e4567-e89b-12d3-a456-426614174000'::uuid,  -- threshold_id
  'Early reversion due to supply chain recovery. Regulatory basis: DMP approval.'  -- confirmation_justification
);
```

---

### vci_get_pending_reversions(
  p_limit integer DEFAULT 100,
  p_offset integer DEFAULT 0,
  p_duration_type text DEFAULT NULL,
  p_date_from date DEFAULT NULL,
  p_date_to date DEFAULT NULL
)

**Purpose:** Get thresholds pending reversion (for dashboard and review)

**Parameters:**
- `p_limit` (integer) - Number of records to return (default: 100)
- `p_offset` (integer) - Offset for pagination (default: 0)
- `p_duration_type` (text) - Filter by duration type: 'temporary_auto_revert', 'temporary_manual_review', or NULL for all
- `p_date_from` (date) - Filter by revert_date >= date_from
- `p_date_to` (date) - Filter by revert_date <= date_to

**Returns:** TABLE with threshold data including:
- Threshold ID, SKU, product, current multiplier, revert date, days until reversion
- Revert to multiplier, revert to threshold value
- Duration type, requires manual review flag
- Notification status flags

**Access Control:**
- Tier 1: Full access
- Tier 2: Read-only access
- Company users: No access

**Example:**
```sql
SELECT * FROM vci_get_pending_reversions(
  50,                              -- limit
  0,                               -- offset
  'temporary_manual_review',       -- duration_type filter
  CURRENT_DATE,                    -- date_from
  CURRENT_DATE + INTERVAL '30 days' -- date_to
);
```

**Business Rules:**
- Returns thresholds with `duration_type IN ('temporary_auto_revert', 'temporary_manual_review')`
- Only returns current thresholds (`is_current = true`)
- Ordered by `revert_date` ASC (earliest first)
- Includes calculated field: `days_until_reversion` (revert_date - CURRENT_DATE)

---

### vci_confirm_threshold_reversion(threshold_id uuid, confirmation_justification text)

**Purpose:** Tier 1 confirms manual review threshold reversion

**Parameters:**
- `threshold_id` (uuid) - Threshold ID to confirm reversion
- `confirmation_justification` (text) - Justification for confirming reversion (minimum 50 characters, required)

**Returns:** JSON with reverted threshold data

**State Transition:** Reverts threshold from temporary to permanent

**Validation:**
- User must be Tier 1
- Threshold must have `duration_type = 'temporary_manual_review'`
- Threshold must have `revert_date <= CURRENT_DATE` (ready for reversion)
- `confirmation_justification` must be at least 50 characters

**Side Effects:**
- Calls `revert_temporary_threshold()` function
- Creates new threshold version with `revert_to_*` values
- Marks old threshold as `is_current = false`
- Creates audit log entry with confirmation justification
- Sends notification to threshold creator

**Example:**
```sql
SELECT vci_confirm_threshold_reversion(
  '123e4567-e89b-12d3-a456-426614174000'::uuid,  -- threshold_id
  'Confirmed reversion after review. Supply chain has stabilized. Regulatory basis: DMP approval.'  -- confirmation_justification
);
```

---

## ECS Module Functions

### ecs_submit_export_request(...)

**Purpose:** Submit export request

**Parameters:**
- `company_id` (uuid) - Company ID
- `sku_id` (uuid) - SKU ID
- `quantity` (numeric) - Export quantity (units to export)
- `destination_country` (text) - Destination country
- `destination_details` (text) - Destination details
- `requested_export_date` (date) - Requested export date
- `supporting_documentation` (jsonb) - Supporting documentation

**Returns:** JSON with request data

**State Transition:** `draft` → `submitted`

**Side Effects:**
- Performs conditional validation (checks CMC score if CMC module active)
- Determines next state based on validation:
  - CMC score < 60 or risk factors: `submitted` → `manual_review`
  - CMC score 60-74: `submitted` → `tier2_verification_required`
  - CMC score 75+: `submitted` → `auto_approval_queue`
  - CMC inactive: `submitted` → `auto_approval_queue`

---

### ecs_verify_export_request(request_id uuid, comments text DEFAULT NULL)

**Purpose:** Tier 2 verifies export request (required for score 60-74)

**Parameters:**
- `request_id` (uuid) - Request ID
- `comments` (text) - Verification comments

**Returns:** JSON with updated request

**State Transition:** `tier2_verification_required` → `auto_approval_queue`

**Validation:**
- User must be Tier 2 Officer
- Request must be in `tier2_verification_required` status

---

### ecs_authorize_export(request_id uuid)

**Purpose:** Authorize export (after approval)

**Parameters:**
- `request_id` (uuid) - Request ID

**Returns:** JSON with authorization data

**State Transition:** `approved` → `authorized`

**Side Effects:**
- Creates export authorization record
- **ECS → VCI:** Switches threshold from VCI Threshold to ECS Threshold
- **ECS → CMC:** Triggers CMC score recalculation (event-triggered)
- Sets authorization valid for 90 calendar days
- Sets threshold revert date (3 months from authorization)

---

### ecs_complete_export(authorization_id uuid, ...)

**Purpose:** Report export completion

**Parameters:**
- `authorization_id` (uuid) - Authorization ID
- `actual_export_date` (date) - Actual export date
- `actual_quantity` (numeric) - Actual quantity exported (units)
- `shipping_details` (text) - Shipping details
- `destination_confirmation` (text) - Destination confirmation

**Returns:** JSON with completion data

**State Transition:** `authorized` → `completed`

**Validation:**
- Must be reported within 7 days of export

---

## CMC Module Functions

### cmc_calculate_compliance_score(company_id uuid, score_period text, trigger_event text DEFAULT NULL)

**Purpose:** Calculate compliance score (scheduled or event-triggered)

**Parameters:**
- `company_id` (uuid) - Company ID
- `score_period` (text) - Score period (YYYY-MM)
- `trigger_event` (text) - Trigger event (if event-triggered)

**Returns:** JSON with score data

**Security:** SECURITY DEFINER (needs to read from VCI and ECS)

**Side Effects:**
- Reads data from VCI (WSL, MSQ, AAMS, breaches)
- Reads data from ECS (if active: export authorizations, replenishment schedules)
- Calculates component scores
- Calculates total score
- Creates frozen snapshot (immutable)

---

### cmc_recalculate_score_event_triggered(company_id uuid, trigger_event text, event_data jsonb)

**Purpose:** Event-triggered score recalculation

**Parameters:**
- `company_id` (uuid) - Company ID
- `trigger_event` (text) - Trigger event (export_authorized, breach_detected, etc.)
- `event_data` (jsonb) - Event data

**Returns:** JSON with updated score

**Security:** SECURITY DEFINER

**Called By:** ECS module when export authorized

---

### cmc_submit_dispute(score_id uuid, dispute_type text, disputed_component text DEFAULT NULL, dispute_reason text)

**Purpose:** Submit score dispute

**Parameters:**
- `score_id` (uuid) - Score ID
- `dispute_type` (text) - Dispute type (total_score, component)
- `disputed_component` (text) - Disputed component (NULL for total score)
- `dispute_reason` (text) - Dispute reason

**Returns:** JSON with dispute data

**State Transition:** `published` → `under_dispute`

**Business Rules:**
- Must be submitted within 30 days of score publication

---

### cmc_get_historical_scores(...)

**Purpose:** Get historical compliance scores with filtering and pagination

**Parameters:**
- `p_company_id` (uuid, DEFAULT NULL) - Company ID (NULL for MOH - all companies)
- `p_start_date` (date, DEFAULT NULL) - Start date filter
- `p_end_date` (date, DEFAULT NULL) - End date filter
- `p_limit` (integer, DEFAULT 100) - Number of records to return
- `p_offset` (integer, DEFAULT 0) - Offset for pagination

**Returns:** TABLE with score data including trend information

**Access Control:**
- Company users: Only own company's scores
- MOH users: All companies' scores
- RLS automatically applied via SECURITY DEFINER

**Example:**
```sql
SELECT * FROM cmc_get_historical_scores(
  NULL,           -- MOH: all companies
  '2023-01-01',   -- Start date
  '2023-12-31',   -- End date
  100,            -- Limit
  0               -- Offset
);
```

**Business Rules:**
- Returns scores ordered by score_month DESC
- Includes component breakdown (submission compliance, deadline compliance, breach history)
- Applies RLS policies automatically
- Logs access via audit_logs table
- Supports 7-year lookback (regulatory requirement)

---

## Historical Data Helper Functions

### has_historical_ecs_data(p_company_id uuid DEFAULT NULL)

**Purpose:** Check if historical ECS (export) data exists for a company or system-wide

**Parameters:**
- `p_company_id` (uuid, DEFAULT NULL) - Company ID (NULL for MOH - check system-wide)

**Returns:** boolean

**Access Control:**
- Company users: Checks only their company's data
- MOH users: Checks system-wide data

**Example:**
```sql
SELECT has_historical_ecs_data(NULL);  -- MOH: check system-wide
SELECT has_historical_ecs_data('company-uuid');  -- Company: check own data
```

**Business Rules:**
- Returns true if any export_requests exist (for company or system-wide)
- Used for route protection (check data existence, not module status)
- Does not check module activation status

---

### has_historical_cmc_data(p_company_id uuid DEFAULT NULL)

**Purpose:** Check if historical CMC (compliance score) data exists for a company or system-wide

**Parameters:**
- `p_company_id` (uuid, DEFAULT NULL) - Company ID (NULL for MOH - check system-wide)

**Returns:** boolean

**Access Control:**
- Company users: Checks only their company's data
- MOH users: Checks system-wide data

**Example:**
```sql
SELECT has_historical_cmc_data(NULL);  -- MOH: check system-wide
SELECT has_historical_cmc_data('company-uuid');  -- Company: check own data
```

**Business Rules:**
- Returns true if any compliance_scores exist (for company or system-wide)
- Used for route protection (check data existence, not module status)
- Does not check module activation status

---

## Audit Functions

### audit_get_historical_logs(...)

**Purpose:** Get historical audit logs with filtering and pagination (MOH/Auditors only)

**Parameters:**
- `p_table_name` (text, DEFAULT NULL) - Filter by table name
- `p_user_id` (uuid, DEFAULT NULL) - Filter by user ID
- `p_start_date` (timestamptz, DEFAULT NULL) - Start date filter
- `p_end_date` (timestamptz, DEFAULT NULL) - End date filter
- `p_limit` (integer, DEFAULT 100) - Number of records to return
- `p_offset` (integer, DEFAULT 0) - Offset for pagination

**Returns:** TABLE with audit log data

**Access Control:**
- MOH Tier 1/2: Full access
- Auditors: Full access
- Company users: No access (returns empty)
- Role check performed within function

**Example:**
```sql
SELECT * FROM audit_get_historical_logs(
  'aams_submissions',  -- Table filter
  NULL,                -- All users
  '2023-01-01 00:00:00+00',  -- Start date
  '2023-12-31 23:59:59+00',  -- End date
  100,                 -- Limit
  0                    -- Offset
);
```

**Business Rules:**
- Returns audit logs ordered by created_at DESC
- Includes hash chain information for integrity verification
- Logs access to audit logs (meta-audit)
- Supports 7-year lookback (regulatory requirement)
- Virtual scrolling recommended for large result sets

---

### log_historical_data_access(...)

**Purpose:** Log access to historical data for audit trail

**Parameters:**
- `p_user_id` (uuid) - User ID
- `p_data_type` (text) - Data type ('submissions', 'scores', 'breaches', 'audit_logs')
- `p_date_range` (daterange) - Date range accessed
- `p_exported` (boolean, DEFAULT false) - Whether data was exported

**Returns:** void

**Access Control:**
- Called automatically by historical data RPC functions
- No direct user access required

**Example:**
```sql
SELECT log_historical_data_access(
  auth.uid(),
  'submissions',
  '[2023-01-01,2023-12-31)',
  false
);
```

**Business Rules:**
- Creates audit log entry with action 'VIEW_HISTORICAL_DATA'
- Includes metadata: date_range, exported flag, accessed_at timestamp
- Required for regulatory compliance (track who accessed what historical data)
- Used for monitoring unusual access patterns

---

## Related Documents

- [API Specification](api-specification.md) - API design overview
- [Edge Function Specifications](edge-functions.md) - Edge Function specs
- [Workflow Architecture](../workflow-architecture.md) - Workflow state machines
- [Historical Data Routing Proposal](../frontend/historical-data-routing-proposal.md) - Historical data access patterns
- [Regulatory Framework](../../../03-governance/regulatory-framework.md) - Comprehensive regulatory reference
- [Compliance Requirements](../../../03-governance/compliance-requirements.md) - Detailed compliance requirements
- [Regulatory Policies](../../../03-governance/regulatory-policies.md) - Regulatory policies and guidelines
- [Technical Decision Log](../../../06-development/technical-decisions/decision-log.md)

---

## Historical Data RPC Functions

**Status:** ✅ Historical data RPC functions added  
**Implementation:** See [Historical Data Routing Proposal](../frontend/historical-data-routing-proposal.md) for complete specifications

**Functions Added:**
- `vci_get_historical_submissions()` - Get historical AAMS, MSQ, WSL submissions
- `cmc_get_historical_scores()` - Get historical compliance scores
- `audit_get_historical_logs()` - Get historical audit logs (MOH/Auditors only)
- `has_historical_ecs_data()` - Check if historical ECS data exists
- `has_historical_cmc_data()` - Check if historical CMC data exists
- `log_historical_data_access()` - Log historical data access for audit trail

**Key Features:**
- All functions apply RLS automatically via SECURITY DEFINER
- Support pagination (limit/offset)
- Support filtering (year, month, date range, company)
- Log access for regulatory compliance
- Support 7-year data retention requirement

---

## Phase 1.1 Implementation (Tasks 1.1.1.2b–1.1.1.2e)

**Migrations:** `20260127150900_rpc_shared_functions`, `20260127151000_rpc_communications_functions`, `20260127151100_rpc_system_status_function`, `20260127151200_rpc_authentication_function`, `20260127151300_rpc_rmm_list_functions`, `20260127151500_rpc_system_get_status_public`.

### Shared (1.1.1.2b)

| Function | Signature | Returns |
|----------|-----------|---------|
| `shared_get_user_permissions` | `(user_id uuid)` | `{ role, company_id, permissions[] }` |
| `shared_get_notifications` | `(p_limit int DEFAULT 50, p_offset int DEFAULT 0)` | `{ data: [...] }` |
| `shared_mark_notification_read` | `(p_notification_id uuid)` | `{ success }` |
| `shared_update_user_profile` | `(p_full_name, p_avatar_url, p_timezone, p_language text)` | `{ success, user? }` |
| `shared_update_user_preferences` | `(p_preferences jsonb)` | `{ success }` |
| `shared_get_audit_logs` | `(p_table_name, p_user_id, p_start_date, p_end_date, p_limit, p_offset)` | `{ data, total }` |
| `shared_get_audit_log_detail` | `(p_id uuid)` | single audit log or `{ error }` |
| `shared_generate_audit_report` | same as `shared_get_audit_logs` | `{ data, total, generated_at }` |
| `shared_get_history` | `(p_start_date, p_end_date, p_table_name, p_limit, p_offset)` | `{ data, total }` |

`shared_get_history`: **SECURITY DEFINER**. Role-based: MOH/auditor → `audit_logs`; Company → `registry_submissions` (company-scoped). For /history page. Migration: `20260127151700_rpc_shared_get_history.sql`. All other shared: **SECURITY INVOKER**; RLS applies.

### Communications (1.1.1.2c)

| Function | Signature | Returns |
|----------|-----------|---------|
| `communications_list_conversations` | `(p_archived boolean DEFAULT false)` | `{ data: [...] }` |
| `communications_get_conversation` | `(p_conversation_id uuid)` | `{ conversation, messages }` |
| `communications_send_message` | `(p_conversation_id uuid, p_content text, p_recipient_id uuid DEFAULT NULL)` | `{ success, id? }` |
| `communications_create_conversation` | `(p_subject, p_type text, p_company_id, p_recipient_id uuid, p_initial_content text)` | `{ success, id, message_id? }` |
| `communications_list_sent` | `()` | `{ data: [...] }` |
| `communications_create_announcement` | `(p_subject, p_content text, p_expires_at timestamptz DEFAULT NULL)` | `{ success, id, message_id? }` |
| `communications_list_announcements` | `()` | `{ data: [...] }` |
| `communications_archive_conversation` | `(p_conversation_id uuid)` | `{ success }` |
| `communications_list_archived` | `()` | `{ data: [...] }` |
| `communications_restore_conversation` | `(p_conversation_id uuid)` | `{ success }` |

All **SECURITY INVOKER**; RLS applies. `communications_restore_conversation` (Task 1.1.1.24): MOH only; sets `archived_at` to NULL.

### System (1.1.1.2d, 1.1.1.17)

| Function | Signature | Returns |
|----------|-----------|---------|
| `system_get_status` | `()` | `{ modules: [...], at }` |
| `system_get_status_public` | `()` | `{ overall, components[], incidents[], maintenance[], at }` |

**`system_get_status`:** SECURITY INVOKER; RLS on `system_config` (MOH Tier 1 / system_admin).

**`system_get_status_public`:** SECURITY DEFINER. Public /status page (Task 1.1.1.17). Grant to `anon`, `authenticated`, `service_role`. Migration: `20260127151500_rpc_system_get_status_public`.

### Authentication (1.1.1.2e)

| Function | Signature | Returns |
|----------|-----------|---------|
| `rmm_create_user` | `(p_id uuid, p_email text, p_full_name text, p_company_id uuid, p_role text)` | `{ success, user? }` |

**SECURITY DEFINER**. Self-create only (`p_id = auth.uid()`). Upsert on conflict.

### RMM List (1.1.1.11 — Dashboard)

| Function | Signature | Returns |
|----------|-----------|---------|
| `rmm_get_company` | `(p_id uuid)` | `{ company }` or `{ error, company_id }` |
| `rmm_get_company_for_detail` | `(p_id uuid)` | `{ company }` or `{ error, company_id }` — full fields, includes inactive (Task 1.1.2.18) |
| `rmm_list_companies` | `(p_limit int DEFAULT 50, p_offset int DEFAULT 0, p_search text DEFAULT NULL, p_company_type text DEFAULT NULL, p_status text DEFAULT 'active')` | `{ data: [...], total }`. Search: name/registration_number. type: ipc\|wholesaler. status: all\|active\|inactive. RLS applies. Task 1.1.2.17. |
| `rmm_list_products` | `(p_limit int, p_offset int, p_company_id uuid DEFAULT NULL)` | `{ data: [...], total }` |
| `rmm_list_skus` | `(p_limit int, p_offset int, p_product_id uuid DEFAULT NULL)` | `{ data: [...], total }` |

**Migration:** `20260127151300_rpc_rmm_list_functions.sql`. All **SECURITY INVOKER**; RLS applies. Used by dashboard.

### RMM Company CRUD (1.1.2.1)

| Function | Signature | Returns |
|----------|-----------|---------|
| `rmm_create_company` | `(p_name text, p_registration_number text, p_company_type text, p_address text DEFAULT NULL, p_contact_email text DEFAULT NULL, p_contact_phone text DEFAULT NULL)` | `{ company }` or `{ error, message }` |
| `rmm_update_company` | `(p_id uuid, p_name text DEFAULT NULL, ..., p_is_active boolean DEFAULT NULL)` | `{ company }` or `{ error, company_id }` / `{ error, message }`. p_is_active for status (Task 1.1.2.19). |

**Migration:** `20260129120000_rpc_rmm_company_crud.sql`. **SECURITY INVOKER**; RLS applies (MOH only for INSERT/UPDATE).

### RMM Product CRUD (1.1.2.2)

| Function | Signature | Returns |
|----------|-----------|---------|
| `rmm_get_product` | `(p_id uuid)` | `{ product }` or `{ error, product_id }` |
| `rmm_create_product` | `(p_company_id uuid, p_name text, p_description text DEFAULT NULL, p_is_critical_medicine boolean DEFAULT false, p_atc_code_id uuid DEFAULT NULL)` | `{ product }` or `{ error, message }`. Task 1.1.2.22. |
| `rmm_update_product` | `(p_id uuid, p_name text DEFAULT NULL, p_description text DEFAULT NULL, p_is_critical_medicine boolean DEFAULT NULL, p_is_active boolean DEFAULT NULL, p_atc_code_id uuid DEFAULT NULL)` | `{ product }` or `{ error, product_id }` / `{ error, message }`. Task 1.1.2.22. |
| `rmm_list_products` | (existing) | `{ data: [...], total }` |

**Migration:** `20260129120100_rpc_rmm_product_crud.sql` (get/create/update). `rmm_list_products` in `20260127151300_rpc_rmm_list_functions.sql`. All **SECURITY INVOKER**; RLS applies (MOH only for INSERT/UPDATE).

### RMM SKU CRUD (1.1.2.3)

| Function | Signature | Returns |
|----------|-----------|---------|
| `rmm_get_sku` | `(p_id uuid)` | `{ sku }` or `{ error, sku_id }` |
| `rmm_create_sku` | `(p_product_id uuid, p_sku_code text, p_name text, p_dosage_strength text, p_dosage_form text, p_pack_size text, p_unit_of_measure text, p_atc_code_id uuid DEFAULT NULL, p_is_moh_authorized_unregistered boolean DEFAULT false)` | `{ sku }` or `{ error, message }` |
| `rmm_update_sku` | `(p_id uuid, p_sku_code text DEFAULT NULL, p_name text DEFAULT NULL, p_dosage_strength text DEFAULT NULL, p_dosage_form text DEFAULT NULL, p_pack_size text DEFAULT NULL, p_unit_of_measure text DEFAULT NULL, p_is_moh_authorized_unregistered boolean DEFAULT NULL, p_is_active boolean DEFAULT NULL)` | `{ sku }` or `{ error, sku_id }` / `{ error, message }`. p_is_active for status (Task 1.1.2.25). |
| `rmm_list_skus` | (existing) | `{ data: [...], total }` |

**Migration:** `20260129120200_rpc_rmm_sku_crud.sql` (get/create/update). `20260129123700_rmm_update_sku_is_active.sql` adds `p_is_active` (Task 1.1.2.25). `rmm_list_skus` in `20260127151300_rpc_rmm_list_functions.sql`. All **SECURITY INVOKER**; RLS applies (MOH only for INSERT/UPDATE).

### RMM Helper RPCs (1.1.2.3a)

Helper functions for entity-scoped lists and history. List helpers wrap existing `rmm_list_products` / `rmm_list_skus` with required entity ID. History helpers use **SECURITY DEFINER** and role-based logic: MOH/auditor see `audit_logs` for the entity; Company users see `registry_submissions` for that entity only when they own it (company/product/sku).

| Function | Signature | Returns |
|----------|-----------|---------|
| `rmm_list_company_products` | `(p_company_id uuid, p_limit int DEFAULT 50, p_offset int DEFAULT 0, p_search text DEFAULT NULL)` | `{ data, total }` or `{ error }`. Each row: id, company_id, name, description, is_critical_medicine, is_active, created_at, company_name, sku_count, atc_code. Task 1.1.2.18.1. |
| `rmm_list_products_page` | `(p_limit int, p_offset int, p_search text, p_company_id uuid, p_status text, p_is_critical text, p_atc_code text)` | `{ data, total }`. Products list page: search, company/status/critical/ATC filters; sku_count, atc_code per row. RLS applies. Task 1.1.2.20. |
| `rmm_list_skus_page` | `(p_limit int, p_offset int, p_search text, p_product_id uuid, p_status text, p_dosage_form text, p_atc_code text)` | `{ data, total }`. SKUs list page: search (code/name/dosage), product/status/dosage_form/ATC filters; atc_code per row. RLS applies. Task 1.1.2.23. |
| `rmm_list_product_skus` | `(p_product_id uuid, p_limit int DEFAULT 50, p_offset int DEFAULT 0)` | `{ data, total }` or `{ error }` |
| `rmm_get_product_for_detail` | `(p_id uuid)` | `{ product }` or `{ error, product_id }`. Product includes atc_code, skus_total, skus_active. Includes inactive. RLS applies. Task 1.1.2.21. |
| `rmm_get_sku_for_detail` | `(p_id uuid)` | `{ sku }` or `{ error, sku_id }`. SKU includes company_name, atc_code. Includes inactive. RLS applies. Task 1.1.2.24. |
| `rmm_get_company_history` | `(p_company_id uuid, p_start_date timestamptz DEFAULT NULL, p_end_date timestamptz DEFAULT NULL, p_limit int DEFAULT 50, p_offset int DEFAULT 0)` | `{ data, total }` or `{ error }` |
| `rmm_get_product_history` | `(p_product_id uuid, p_start_date timestamptz DEFAULT NULL, p_end_date timestamptz DEFAULT NULL, p_limit int DEFAULT 50, p_offset int DEFAULT 0)` | `{ data, total }` or `{ error }` |
| `rmm_get_sku_history` | `(p_sku_id uuid, p_start_date timestamptz DEFAULT NULL, p_end_date timestamptz DEFAULT NULL, p_limit int DEFAULT 50, p_offset int DEFAULT 0)` | `{ data, total }` or `{ error }` |

- **List helpers:** **SECURITY INVOKER**; they call `rmm_list_products` / `rmm_list_skus`, so RLS applies. Used by Company detail, Company products, Product detail, SKU detail pages.
- **History helpers:** **SECURITY DEFINER**. MOH/auditor: rows from `audit_logs` filtered by `table_name` and `record_id`. Company: rows from `registry_submissions` for that `entity_type`/`entity_id` only when the entity belongs to the user’s company.

**Migration:** `20260129120300_rpc_rmm_helper_functions.sql` (Task 1.1.2.3a).

### RMM Overview (1.1.2.16.1)

| Function | Signature | Returns |
|----------|-----------|---------|
| `rmm_get_overview_stats` | `(p_company_id uuid DEFAULT NULL)` | `{ companies_total, companies_active, companies_inactive, products_total, products_active, products_inactive, skus_total, skus_active, skus_inactive, submissions_pending, submissions_approved, submissions_rejected }` |

- **SECURITY DEFINER.** Company users: stats for own company (from `users.company_id`). MOH: all stats. Used by RMM overview page (`/rmm/overview`).

**Migration:** `20260129122200_rpc_rmm_get_overview_stats.sql` (Task 1.1.2.16.1).

### RMM ATC Code Management (1.1.2.4) — MOH Only

ATC Code management RPCs. **List/get:** all authenticated (companies need list for SKU/product forms). **Create/update:** MOH only (RLS `atc_codes_insert_moh`, `atc_codes_update_moh`).

| Function | Signature | Returns |
|----------|-----------|---------|
| `rmm_list_atc_codes` | `(p_limit int DEFAULT 50, p_offset int DEFAULT 0, p_code_filter text DEFAULT NULL)` | `{ data, total }` |
| `rmm_list_atc_codes` | `(p_limit int, p_offset int, p_code_filter text, p_level int DEFAULT NULL, p_category text DEFAULT NULL)` | `{ data, total }` — each row includes computed `level` (1–5). Filters by code/description search, level (1–4), category (first letter). Task 1.1.2.29. |
| `rmm_get_atc_code` | `(p_id uuid)` | `{ atc_code }` or `{ error, atc_code_id }` |
| `rmm_create_atc_code` | `(p_code text, p_description text DEFAULT NULL, p_is_active boolean DEFAULT true)` | `{ atc_code }` or `{ error, message }` |
| `rmm_update_atc_code` | `(p_id uuid, p_code text DEFAULT NULL, p_description text DEFAULT NULL, p_is_active boolean DEFAULT NULL)` | `{ atc_code }` or `{ error, atc_code_id }` / `{ error, message }` |

**Migrations:** `20260129120400_rpc_rmm_atc_code_management.sql` (Task 1.1.2.4); `20260129124000_rmm_list_atc_codes_level_category.sql` (Task 1.1.2.29 — 5-arg overload). All **SECURITY INVOKER**; RLS enforces MOH-only for create/update.

### RMM Critical Medicine Management (1.1.2.5) — MOH Only

Critical Medicine management RPCs. **List/get:** all authenticated. **Create/update:** MOH only (RLS `critical_medicines_insert_moh`, `critical_medicines_update_moh`). Create uses `auth.uid()` as `designated_by`.

| Function | Signature | Returns |
|----------|-----------|---------|
| `rmm_list_critical_medicines` | `(p_limit int DEFAULT 50, p_offset int DEFAULT 0, p_sku_id uuid DEFAULT NULL)` | `{ data, total }` |
| `rmm_list_critical_medicines` | `(p_limit, p_offset, p_sku_id, p_search text, p_status text, p_company_id uuid, p_atc_first_letter text, p_designated_from timestamptz, p_designated_to timestamptz)` | `{ data, total }` — list page: search (SKU/product/company), status (all/active/inactive), company, ATC first letter, date range; each row includes company_name. Task 1.1.2.30. |
| `rmm_get_critical_medicine` | `(p_id uuid)` | `{ critical_medicine }` or `{ error, critical_medicine_id }` |
| `rmm_create_critical_medicine` | `(p_sku_id uuid)` | `{ critical_medicine }` or `{ error, message }` |
| `rmm_update_critical_medicine` | `(p_id uuid, p_is_active boolean DEFAULT NULL)` | `{ critical_medicine }` or `{ error, critical_medicine_id }` |

**Migrations:** `20260129120500_rpc_rmm_critical_medicine_management.sql` (Task 1.1.2.5); `20260129125000_rmm_list_critical_medicines_page.sql` (Task 1.1.2.30 — 9-arg overload). All **SECURITY INVOKER**; RLS enforces MOH-only for create/update.

---

**Last Updated:** 2026-01-29  
**Next Review Date:** [To be scheduled]  
**Owner:** Maya

