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

### rmm_submit_registry_update(...)

**Purpose:** Submit registry update (company, product, SKU) **including deletion requests**.

**Parameters:**
- `submission_type` (text) - Submission type: `company_create`, `company_update`, `company_delete`, `product_create`, `product_update`, `product_delete`, `sku_create`, `sku_update`, `sku_delete`
- `entity_type` (text) - Entity type (`company`, `product`, `sku`)
- `entity_id` (uuid) - Entity ID (for updates/deletes) — **Required for deletion requests**
- `submission_data` (jsonb) - Submission data (JSON). **For deletion requests, must include:**
  - `reason` (text, required) - Reason for deletion
  - `detailed_explanation` (text, optional) - Detailed explanation

**Returns:** JSON with submission data

**State Transition:** `draft` → `submitted`

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

### rmm_verify_registry_submission(submission_id uuid, comments text DEFAULT NULL)

**Purpose:** Tier 2 Officer verifies registry submission (including deletion requests).

**Parameters:**
- `submission_id` (uuid) - Submission ID
- `comments` (text) - Verification comments

**Returns:** JSON with updated submission

**State Transition:** `submitted` → `tier2_verified`

**Validation:**
- User must be Tier 2 Officer
- Submission must be in `submitted` status

**Deletion requests:** Tier 2 Officer can verify deletion requests. Verification confirms the deletion request is valid and properly documented. After verification, the deletion request moves to Tier 1 for approval.

---

### rmm_approve_registry_submission(submission_id uuid, comments text DEFAULT NULL)

**Purpose:** Tier 1 approves registry submission (including deletion requests).

**Parameters:**
- `submission_id` (uuid) - Submission ID
- `comments` (text) - Approval comments

**Returns:** JSON with updated submission

**State Transition:** `tier2_verified` → `tier1_approved` (or `tier2_peer_reviewed` → `tier1_approved`)

**Validation:**
- User must be Tier 1
- Submission must be in `tier2_verified` or `tier2_peer_reviewed` status

**Deletion requests:** Tier 1 approval of a deletion request is the "issue the command" step. Approval authorizes the Tier 2 Registrar to implement the deletion. After approval, the deletion request moves to the Tier 2 Registrar for implementation.

---

### rmm_implement_registry_update(submission_id uuid)

**Purpose:** Tier 2 Registrar implements registry update (including approved deletions).

**Parameters:**
- `submission_id` (uuid) - Submission ID

**Returns:** JSON with updated submission

**State Transition:** `tier1_approved` → `tier2_implemented`

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

All **SECURITY INVOKER**; RLS applies.

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

All **SECURITY INVOKER**; RLS applies.

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
| `rmm_list_companies` | `(p_limit int DEFAULT 50, p_offset int DEFAULT 0)` | `{ data: [...], total }` |
| `rmm_list_products` | `(p_limit int, p_offset int, p_company_id uuid DEFAULT NULL)` | `{ data: [...], total }` |
| `rmm_list_skus` | `(p_limit int, p_offset int, p_product_id uuid DEFAULT NULL)` | `{ data: [...], total }` |

**Migration:** `20260127151300_rpc_rmm_list_functions.sql`. All **SECURITY INVOKER**; RLS applies. Used by dashboard.

---

**Last Updated:** 2026-01-27  
**Next Review Date:** [To be scheduled]  
**Owner:** Maya

