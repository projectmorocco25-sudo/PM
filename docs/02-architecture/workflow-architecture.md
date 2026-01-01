# Workflow Architecture - Pharmaceutical Governance Value Chain Platform (PM)

**Purpose:** This document defines the workflow architecture and state machines for all modules, including cross-module impacts.

**Last Updated:** 2025-12-31  
**Status:** ✅ Complete (Phase 0, Week 3)  
**Owner:** Maya

## Overview

The PM platform uses database-driven state machines for workflow management. Each workflow entity has a `status` column, and RPC functions handle state transitions with validation. This approach is simple, auditable, queryable, and supports complex cross-module interactions.

## Workflow Design Principles

1. **Database-Driven:** Status stored in database columns, not external workflow engine
2. **RPC Function Transitions:** Each state transition is an RPC function with validation
3. **Auditable:** All state changes logged in `approvals` table and `audit_logs`
4. **Queryable:** Easy to query workflow status using standard SQL
5. **Cross-Module Aware:** Explicitly documents and handles module interactions
6. **Enforceable:** Database and RPC functions validate valid transitions

## Workflow State Machine Patterns

### Pattern 1: Linear Approval Workflow

**Use Case:** Simple approval chain (e.g., AAMS submission)

**States:**
- `draft` → `submitted` → `tier2_verified` → `tier1_approved` → `completed`

**Transitions:**
- Company submits: `draft` → `submitted`
- Tier 2 verifies: `submitted` → `tier2_verified`
- Tier 1 approves: `tier2_verified` → `tier1_approved`
- System completes: `tier1_approved` → `completed`

---

### Pattern 2: Peer Review Workflow

**Use Case:** MOH submissions requiring peer review

**States:**
- `draft` → `submitted` → `tier2_peer_reviewed` → `tier1_approved` → `tier2_implemented` → `completed`

**Transitions:**
- Tier 2 submits: `draft` → `submitted`
- Another Tier 2 peer reviews: `submitted` → `tier2_peer_reviewed`
- Tier 1 approves: `tier2_peer_reviewed` → `tier1_approved`
- Tier 2 implements: `tier1_approved` → `tier2_implemented`
- System completes: `tier2_implemented` → `completed`

---

### Pattern 3: Conditional Branching Workflow

**Use Case:** Export requests with conditional validation

**States:**
- `draft` → `submitted` → `auto_approval_queue` / `manual_review` / `tier2_verification_required` → `approved` → `authorized` → `completed`

**Transitions:**
- Company submits: `draft` → `submitted`
- System evaluates (conditional validation):
  - If CMC score < 60 OR multiple risk factors: `submitted` → `manual_review`
  - If CMC score 60-74: `submitted` → `tier2_verification_required`
  - If CMC score 75+: `submitted` → `auto_approval_queue`
  - If CMC module not active: `submitted` → `auto_approval_queue`
- Tier 2 verification (if required): `tier2_verification_required` → `auto_approval_queue`
- Auto-approved: `auto_approval_queue` → `approved` (after intervention window)
- Manual review: `manual_review` → `approved` or `rejected`
- Authorized: `approved` → `authorized`
- Completed: `authorized` → `completed`

---

## RMM Module Workflows

### 1. Registry Submission Workflow (Company Submissions)

**Entity:** `registry_submissions`

**States:**
- `draft` - Company user creates submission
- `submitted` - Company submits for approval
- `tier2_verified` - Tier 2 Officer verifies
- `tier1_approved` - Tier 1 approves
- `tier2_implemented` - Tier 2 Registrar implements
- `completed` - Implementation confirmed
- `rejected` - Rejected at any stage

**State Transitions:**

| From | To | Trigger | Validator | RPC Function |
|------|-----|---------|-----------|--------------|
| `draft` | `submitted` | Company user submits | User is company user, submission is draft | `rmm_submit_registry_update()` |
| `submitted` | `tier2_verified` | Tier 2 Officer verifies | User is Tier 2 Officer, submission is submitted | `rmm_verify_registry_submission()` |
| `tier2_verified` | `tier1_approved` | Tier 1 approves | User is Tier 1, submission is tier2_verified | `rmm_approve_registry_submission()` |
| `tier1_approved` | `tier2_implemented` | Tier 2 Registrar implements | User is Tier 2 Registrar, submission is tier1_approved | `rmm_implement_registry_update()` |
| `tier2_implemented` | `completed` | System confirms | Automatic after implementation | `rmm_complete_registry_update()` |
| Any | `rejected` | Rejection at any stage | User has rejection permission | `rmm_reject_registry_submission()` |

**Business Rules:**
- Company users can only submit for their own company
- Tier 2 verification required before Tier 1 approval
- Tier 2 implementation required after Tier 1 approval
- Rejection can occur at any stage with reason

---

### 2. Registry Submission Workflow (MOH Submissions)

**Entity:** `registry_submissions`

**States:**
- `draft` - Tier 2 Officer creates submission
- `submitted` - Tier 2 submits
- `tier2_peer_reviewed` - Another Tier 2 Officer peer reviews
- `tier1_approved` - Tier 1 approves
- `tier2_implemented` - Tier 2 Registrar implements
- `completed` - Implementation confirmed
- `rejected` - Rejected at any stage

**State Transitions:**

| From | To | Trigger | Validator | RPC Function |
|------|-----|---------|-----------|--------------|
| `draft` | `submitted` | Tier 2 Officer submits | User is Tier 2 Officer, submission is draft | `rmm_submit_moh_registry_update()` |
| `submitted` | `tier2_peer_reviewed` | Another Tier 2 Officer peer reviews | User is Tier 2 Officer, different from submitter, submission is submitted | `rmm_peer_review_registry_submission()` |
| `tier2_peer_reviewed` | `tier1_approved` | Tier 1 approves | User is Tier 1, submission is tier2_peer_reviewed | `rmm_approve_registry_submission()` |
| `tier1_approved` | `tier2_implemented` | Tier 2 Registrar implements | User is Tier 2 Registrar, submission is tier1_approved | `rmm_implement_registry_update()` |
| `tier2_implemented` | `completed` | System confirms | Automatic after implementation | `rmm_complete_registry_update()` |
| Any | `rejected` | Rejection at any stage | User has rejection permission | `rmm_reject_registry_submission()` |

**Business Rules:**
- Peer review must be by different Tier 2 Officer
- Tier 1 approval required after peer review
- Tier 2 implementation required after Tier 1 approval

---

## VCI Module Workflows

### 3. AAMS Submission Workflow

**Entity:** `aams_submissions`

**States:**
- `draft` - Company user creates submission
- `submitted` - Company submits
- `tier2_verified` - Tier 2 Officer verifies and calculates threshold
- `tier1_approved` - Tier 1 approves threshold
- `completed` - Submission complete
- `rejected` - Rejected at any stage

**State Transitions:**

| From | To | Trigger | Validator | RPC Function |
|------|-----|---------|-----------|--------------|
| `draft` | `submitted` | Company user submits | User is company user, submission is draft, deadline check | `vci_submit_aams()` |
| `submitted` | `tier2_verified` | Tier 2 Officer verifies | User is Tier 2 Officer, submission is submitted | `vci_verify_aams()` |
| `tier2_verified` | `tier1_approved` | Tier 1 approves | User is Tier 1, submission is tier2_verified | `vci_approve_aams_threshold()` |
| `tier1_approved` | `completed` | System completes | Automatic after approval | `vci_complete_aams_submission()` |
| Any | `rejected` | Rejection at any stage | User has rejection permission | `vci_reject_aams_submission()` |

**Business Rules:**
- Must be submitted by January 31st (15-day grace period until February 15th)
- Tier 2 calculates threshold (B × AAMS) during verification
- Companies can view threshold after Tier 2 verification but before Tier 1 approval
- Threshold modifications are non-retroactive

**Side Effects:**
- On `tier2_verified`: Calculate and store threshold
- On `tier1_approved`: Threshold becomes effective

---

### 4. MSQ Submission Workflow

**Entity:** `msq_submissions`

**States:**
- `submitted` - Company submits MSQ data
- `flagged_for_review` - System flags anomalies
- `accepted` - Submission accepted
- `rejected` - Submission rejected

**State Transitions:**

| From | To | Trigger | Validator | RPC Function |
|------|-----|---------|-----------|--------------|
| - | `submitted` | Company user submits | User is company user | `vci_submit_msq()` |
| `submitted` | `flagged_for_review` | System detects anomalies | Automated validation | `vci_flag_msq_for_review()` |
| `submitted` | `accepted` | System accepts | Automated validation passes | `vci_accept_msq()` |
| `flagged_for_review` | `accepted` | Tier 2 Officer accepts | User is Tier 2 Officer | `vci_accept_msq()` |
| `flagged_for_review` | `rejected` | Tier 2 Officer rejects | User is Tier 2 Officer | `vci_reject_msq()` |

**Business Rules:**
- 7-day grace period for corrections
- Automated validation checks completeness, format, historical patterns
- MSQ vs AAMS validation (20% threshold, configurable)
- Used for ECS XAMS calculations

---

### 5. WSL Submission Workflow

**Entity:** `wsl_submissions`

**States:**
- `submitted` - Company submits WSL data
- `late` - Submitted after Friday EOD but before Monday EOD
- `non_compliant` - Submitted after Monday EOD
- `accepted` - Submission accepted

**State Transitions:**

| From | To | Trigger | Validator | RPC Function |
|------|-----|---------|-----------|--------------|
| - | `submitted` | Company user submits | User is company user, includes all SKUs | `vci_submit_wsl()` |
| `submitted` | `late` | System detects late submission | Submitted after Friday EOD but before Monday EOD | `vci_mark_wsl_late()` |
| `submitted` | `non_compliant` | System detects non-compliance | Submitted after Monday EOD | `vci_mark_wsl_non_compliant()` |
| `submitted` | `accepted` | System accepts | Submitted on time, validation passes | `vci_accept_wsl()` |
| `late` | `accepted` | System accepts | Late but accepted | `vci_accept_wsl()` |

**Business Rules:**
- Must include all SKUs at once (complete submission)
- Must be submitted by Friday EOD (late if after Friday, non-compliant if after Monday)
- Late submissions impact compliance scores
- Non-compliant submissions trigger alerts

**Side Effects:**
- On submission: Check for breaches (stock < threshold)
- On breach detection: Create breach record, trigger alerts

---

### 6. Breach Analysis Workflow

**Entity:** `breaches`

**States:**
- `detected` - System detects breach
- `tier2_analyzing` - Tier 2 Officer analyzing
- `tier2_suggested` - Tier 2 suggests action
- `tier1_reviewed` - Tier 1 reviews
- `action_taken` - Action taken
- `completed` - Breach resolved

**State Transitions:**

| From | To | Trigger | Validator | RPC Function |
|------|-----|---------|-----------|--------------|
| - | `detected` | System detects breach | Stock < threshold | `vci_detect_breach()` |
| `detected` | `tier2_analyzing` | Tier 2 Officer starts analysis | User is Tier 2 Officer | `vci_start_breach_analysis()` |
| `tier2_analyzing` | `tier2_suggested` | Tier 2 suggests action | User is Tier 2 Officer, action selected | `vci_suggest_breach_action()` |
| `tier2_suggested` | `tier1_reviewed` | Tier 1 reviews | User is Tier 1 | `vci_review_breach_action()` |
| `tier1_reviewed` | `action_taken` | Action taken | Action executed | `vci_execute_breach_action()` |
| `action_taken` | `completed` | Breach resolved | Stock restored above threshold | `vci_complete_breach()` |

**Business Rules:**
- Analysis must be completed within 3 working days (standard) or 1 working day (critical)
- Tier 2 can suggest batch actions for multiple breaches
- Tier 1 can approve, reject with feedback, or take independent action
- Maximum 2 rejection iterations before Tier 1 must take direct action

---

## ECS Module Workflows

### 7. Export Request Workflow

**Entity:** `export_requests`

**States:**
- `draft` - Company user creates request
- `submitted` - Company submits request
- `auto_approval_queue` - In auto-approval queue
- `tier2_verification_required` - Tier 2 verification required
- `manual_review` - Manual review required
- `approved` - Request approved
- `authorized` - Export authorized
- `completed` - Export completed
- `rejected` - Request rejected
- `cancelled` - Request cancelled

**State Transitions:**

| From | To | Trigger | Validator | RPC Function |
|------|-----|---------|-----------|--------------|
| `draft` | `submitted` | Company user submits | User is company user, request is draft | `ecs_submit_export_request()` |
| `submitted` | `auto_approval_queue` | System evaluates (CMC score 75+ or CMC inactive) | Conditional validation passes | `ecs_queue_for_auto_approval()` |
| `submitted` | `tier2_verification_required` | System evaluates (CMC score 60-74) | Conditional validation requires Tier 2 | `ecs_require_tier2_verification()` |
| `submitted` | `manual_review` | System evaluates (CMC score < 60 or risk factors) | Conditional validation fails | `ecs_require_manual_review()` |
| `tier2_verification_required` | `auto_approval_queue` | Tier 2 verifies | User is Tier 2 Officer | `ecs_verify_export_request()` |
| `auto_approval_queue` | `approved` | Auto-approved (after intervention window) | Intervention window expired, no Tier 1 intervention | `ecs_auto_approve_export()` |
| `auto_approval_queue` | `manual_review` | Tier 1 intervenes | User is Tier 1, intervenes during window | `ecs_intervene_export_request()` |
| `manual_review` | `approved` | Tier 1/Tier 2 approves | User is Tier 1 or Tier 2 | `ecs_approve_export_request()` |
| `manual_review` | `rejected` | Tier 1/Tier 2 rejects | User is Tier 1 or Tier 2 | `ecs_reject_export_request()` |
| `approved` | `authorized` | System authorizes | Automatic after approval | `ecs_authorize_export()` |
| `authorized` | `completed` | Export completed | Company reports completion | `ecs_complete_export()` |
| `authorized` | `cancelled` | Export cancelled | Company or MOH cancels | `ecs_cancel_export()` |
| `authorized` | `revoked` | Export revoked | MOH revokes authorization | `ecs_revoke_export()` |
| Any | `cancelled` | Request cancelled | Company user cancels before authorization | `ecs_cancel_export_request()` |

**Business Rules:**
- Conditional validation based on CMC score (when CMC module active)
- Intervention window: 2 working days (configurable 1-5 days)
- Auto-approval after intervention window if no intervention
- Tier 1 can intervene within 24 hours after auto-approval (post-approval intervention)
- Authorization valid for 90 calendar days
- Threshold switches on authorization (VCI → ECS for 3 months)

**Cross-Module Impacts:**
- **On `authorized` transition:**
  - **ECS → VCI:** Threshold switches from VCI Threshold to ECS Threshold
  - **ECS → CMC:** Triggers CMC score recalculation (event-triggered)
- **On `cancelled`/`revoked` transition:**
  - **ECS → VCI:** Threshold reverts from ECS Threshold to VCI Threshold

---

## CMC Module Workflows

### 8. Compliance Score Calculation Workflow

**Entity:** `compliance_scores`

**States:**
- `calculating` - Score being calculated
- `calculated` - Score calculated
- `tier2_reviewed` - Tier 2 reviewed
- `tier1_approved` - Tier 1 approved
- `published` - Score published
- `under_dispute` - Score under dispute

**State Transitions:**

| From | To | Trigger | Validator | RPC Function |
|------|-----|---------|-----------|--------------|
| - | `calculating` | Scheduled or event-triggered | Scheduled job or event | `cmc_calculate_compliance_score()` |
| `calculating` | `calculated` | Calculation complete | Calculation successful | `cmc_complete_score_calculation()` |
| `calculated` | `tier2_reviewed` | Tier 2 reviews | User is Tier 2 Officer | `cmc_review_compliance_score()` |
| `tier2_reviewed` | `tier1_approved` | Tier 1 approves | User is Tier 1 | `cmc_approve_compliance_score()` |
| `tier1_approved` | `published` | Score published | Automatic after approval | `cmc_publish_compliance_score()` |
| `published` | `under_dispute` | Company disputes | Company submits dispute | `cmc_dispute_compliance_score()` |
| `under_dispute` | `published` | Dispute resolved | Dispute resolved | `cmc_resolve_dispute()` |

**Business Rules:**
- Monthly scheduled calculation
- Event-triggered for major events (high/critical breaches, enforcement actions, ECS export approvals)
- Scores are frozen snapshots (immutable)
- Corrections create adjustment notes, not new scores
- Disputes must be submitted within 30 days

**Calculation Triggers:**
- Scheduled: Monthly (first day of month)
- Event-triggered:
  - High/critical breach detected
  - Enforcement action taken
  - ECS export authorized
  - Non-compliance case opened

---

### 9. Dispute Workflow

**Entity:** `disputes`

**States:**
- `draft` - Company user creates dispute
- `submitted` - Company submits dispute
- `tier2_reviewing` - Tier 2 Officer reviewing
- `tier1_deciding` - Tier 1 deciding
- `resolved` - Dispute resolved (upheld or rejected)

**State Transitions:**

| From | To | Trigger | Validator | RPC Function |
|------|-----|---------|-----------|--------------|
| `draft` | `submitted` | Company user submits | User is company user, within 30 days | `cmc_submit_dispute()` |
| `submitted` | `tier2_reviewing` | Tier 2 starts review | User is Tier 2 Officer | `cmc_start_dispute_review()` |
| `tier2_reviewing` | `tier1_deciding` | Tier 2 forwards to Tier 1 | User is Tier 2 Officer | `cmc_forward_dispute_to_tier1()` |
| `tier1_deciding` | `resolved` | Tier 1 makes decision | User is Tier 1 | `cmc_resolve_dispute()` |

**Business Rules:**
- Must be submitted within 30 days of score publication
- Score remains visible but marked as "Under Dispute"
- If upheld, Tier 1 creates adjustment note (original score unchanged)
- If rejected, dispute closed, score remains

---

## Cross-Module Workflow Impacts

### CMC → ECS Impact (Conditional Validation)

**When:** Export request transitions from `submitted` state

**Impact:**
- CMC compliance scores determine ECS auto-approval eligibility (when CMC module is active)
- Score < 60 OR multiple risk factors: Auto-approval disabled, full manual review required
- Score 60-74: Tier 2 Officer verification required before auto-approval
- Score 75+: Standard auto-approval
- If CMC module not active: Standard auto-approval applies

**Implementation:**
- RPC function `ecs_submit_export_request()` checks CMC score
- Queries `compliance_scores` table (latest score for company)
- Determines next state based on score
- Stores conditional validation result in `export_requests.conditional_validation_result`

---

### ECS → CMC Impact (Event-Triggered Recalculation)

**When:** Export request transitions to `authorized` state

**Impact:**
- ECS export approval triggers CMC score recalculation
- Export compliance component in CMC score is updated
- Event-triggered (not scheduled) - happens immediately upon authorization

**Implementation:**
- RPC function `ecs_authorize_export()` triggers CMC recalculation
- Calls Edge Function or RPC function `cmc_recalculate_score_event_triggered()`
- Passes export authorization details
- CMC recalculates score with updated export compliance component

---

### ECS → VCI Impact (Threshold Switching)

**When:** Export request transitions to `authorized` state

**Impact:**
- SKU threshold switches: VCI Threshold → ECS Threshold immediately
- VCI dashboard uses ECS Threshold for this SKU
- VCI breach detection uses ECS Threshold for this SKU
- Threshold remains at ECS Threshold for 3 calendar months from authorization date

**When:** Export request transitions to `cancelled`/`revoked` state

**Impact:**
- SKU threshold reverts: ECS Threshold → VCI Threshold immediately
- VCI dashboard reverts to VCI Threshold for this SKU
- VCI breach detection reverts to VCI Threshold

**When:** 3 months after authorization (scheduled job)

**Impact:**
- Threshold automatically reverts: ECS Threshold → VCI Threshold
- VCI dashboard automatically updates

**Implementation:**
- RPC function `ecs_authorize_export()` updates threshold reference
- Creates/updates threshold record with `threshold_type = 'ecs'`
- Sets `threshold_switch_date` and `threshold_revert_date` (3 months)
- VCI queries use threshold based on `threshold_type` and dates
- Scheduled job checks for expired ECS thresholds and reverts

---

### VCI → CMC Impact (Data for Scoring)

**When:** CMC score calculation (scheduled or event-triggered)

**Impact:**
- VCI provides WSL/MSQ/AAMS data to CMC for compliance scoring
- CMC reads from VCI (cross-module query) for score calculations

**Implementation:**
- CMC calculation function queries VCI tables:
  - `wsl_submissions` for Regulatory Reporting Compliance Rate
  - `msq_submissions` for Data Quality Signals
  - `aams_submissions` for compliance scoring
  - `breaches` for Stock Threshold Violation Frequency
- Uses service role for scheduled jobs (bypasses RLS)
- Uses RPC function with SECURITY DEFINER for event-triggered

---

## State Transition Enforcement

### RPC Function Pattern

**Function Signature:**
```sql
CREATE OR REPLACE FUNCTION {module}_{action}_{entity}(
  {entity}_id uuid,
  user_id uuid,
  comments text DEFAULT NULL,
  -- other parameters
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_status text;
  new_status text;
  result jsonb;
BEGIN
  -- 1. Validate current status allows transition
  SELECT status INTO current_status
  FROM {entity_table}
  WHERE id = {entity}_id;
  
  IF current_status != '{expected_status}' THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Invalid status transition'
    );
  END IF;
  
  -- 2. Validate user has permission
  IF NOT {permission_check} THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Insufficient permissions'
    );
  END IF;
  
  -- 3. Validate business rules
  IF NOT {business_rule_check} THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Business rule violation'
    );
  END IF;
  
  -- 4. Update status
  UPDATE {entity_table}
  SET status = '{new_status}',
      {action}_by = user_id,
      {action}_at = now(),
      updated_at = now()
  WHERE id = {entity}_id;
  
  -- 5. Create approval record
  INSERT INTO approvals (
    submission_id,
    submission_type,
    from_status,
    to_status,
    approver_id,
    approval_type,
    comments
  ) VALUES (
    {entity}_id,
    '{entity_type}',
    current_status,
    '{new_status}',
    user_id,
    '{action}',
    comments
  );
  
  -- 6. Handle cross-module side effects
  -- (e.g., threshold switching, score recalculation)
  
  -- 7. Create audit log
  PERFORM create_audit_log(
    user_id,
    '{operation_type}',
    '{entity_table}',
    {entity}_id,
    jsonb_build_object('from_status', current_status, 'to_status', '{new_status}')
  );
  
  -- 8. Create notifications
  PERFORM create_notification(...);
  
  -- 9. Return success
  RETURN jsonb_build_object(
    'success', true,
    'status', '{new_status}',
    '{entity}_id', {entity}_id
  );
END;
$$;
```

---

## Workflow Query Patterns

### Query Current Status

```sql
SELECT id, status, updated_at
FROM {entity_table}
WHERE id = {entity}_id;
```

### Query Status History

```sql
SELECT 
  from_status,
  to_status,
  approver_id,
  approval_type,
  comments,
  created_at
FROM approvals
WHERE submission_id = {entity}_id
  AND submission_type = '{entity_type}'
ORDER BY created_at;
```

### Query Entities by Status

```sql
SELECT *
FROM {entity_table}
WHERE status = '{status}'
ORDER BY updated_at DESC;
```

---

## Related Documents

- [API Specifications](api/api-specification.md) - API design details
- [RPC Function Specifications](api/rpc-functions.md) - RPC function details
- [Technical Decision Log](../../06-development/technical-decisions/decision-log.md)
- [Database Schema Design](database/schema-design.md)

---

**Next Review Date:** [To be scheduled]  
**Owner:** Maya

