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

**Purpose:** Submit registry update (company, product, SKU)

**Parameters:**
- `submission_type` (text) - Submission type
- `entity_type` (text) - Entity type (company, product, sku)
- `entity_id` (uuid) - Entity ID (for updates/deletes)
- `submission_data` (jsonb) - Submission data

**Returns:** JSON with submission data

**State Transition:** `draft` → `submitted`

---

### rmm_verify_registry_submission(submission_id uuid, comments text DEFAULT NULL)

**Purpose:** Tier 2 Officer verifies registry submission

**Parameters:**
- `submission_id` (uuid) - Submission ID
- `comments` (text) - Verification comments

**Returns:** JSON with updated submission

**State Transition:** `submitted` → `tier2_verified`

**Validation:**
- User must be Tier 2 Officer
- Submission must be in `submitted` status

---

### rmm_approve_registry_submission(submission_id uuid, comments text DEFAULT NULL)

**Purpose:** Tier 1 approves registry submission

**Parameters:**
- `submission_id` (uuid) - Submission ID
- `comments` (text) - Approval comments

**Returns:** JSON with updated submission

**State Transition:** `tier2_verified` → `tier1_approved` (or `tier2_peer_reviewed` → `tier1_approved`)

**Validation:**
- User must be Tier 1
- Submission must be in `tier2_verified` or `tier2_peer_reviewed` status

---

### rmm_implement_registry_update(submission_id uuid)

**Purpose:** Tier 2 Registrar implements registry update

**Parameters:**
- `submission_id` (uuid) - Submission ID

**Returns:** JSON with updated submission

**State Transition:** `tier1_approved` → `tier2_implemented`

**Validation:**
- User must be Tier 2 Registrar
- Submission must be in `tier1_approved` status

---

## VCI Module Functions

### vci_submit_aams(...)

**Purpose:** Submit AAMS (Annual Average Monthly Sales)

**Parameters:**
- `company_id` (uuid) - Company ID
- `year` (integer) - Year
- `aams_value` (numeric) - AAMS value
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

## ECS Module Functions

### ecs_submit_export_request(...)

**Purpose:** Submit export request

**Parameters:**
- `company_id` (uuid) - Company ID
- `sku_id` (uuid) - SKU ID
- `quantity` (numeric) - Export quantity
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
- `actual_quantity` (numeric) - Actual quantity
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

## Related Documents

- [API Specification](api-specification.md) - API design overview
- [Edge Function Specifications](edge-functions.md) - Edge Function specs
- [Workflow Architecture](../workflow-architecture.md) - Workflow state machines
- [Technical Decision Log](../../../06-development/technical-decisions/decision-log.md)

---

**Next Review Date:** [To be scheduled]  
**Owner:** Maya

