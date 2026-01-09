# Enforcement Cycle Specification

**Purpose:** Comprehensive specification for the enforcement action lifecycle, including creation, approval, execution, and appeal processes.

**Last Updated:** 2025-01-15  
**Status:** ✅ Complete  
**Owner:** Governance Team (Fatima, Dr. Samir)

## Overview

The enforcement cycle manages MOH enforcement actions (warnings, fines, suspensions) against companies for regulatory violations. This specification defines the complete workflow, state machine, appeal process, notifications, and integration requirements.

## Enforcement Action Types

### Action Types

1. **Warning** (`warning`)
   - Non-monetary enforcement action
   - Tier 2 can approve independently
   - Requires justification and legal basis
   - Creates compliance score impact

2. **Fine** (`fine`)
   - Monetary enforcement action
   - Requires Tier 1 approval
   - Requires amount specification (MAD currency)
   - Creates compliance score impact

3. **Suspension** (`suspension`)
   - Most severe enforcement action
   - Requires Tier 1 approval
   - May suspend company operations or specific activities
   - Creates compliance score impact

### Violation Types

- `submission_non_compliance` - Late or missing submissions (AAMS, MSQ, WSL)
- `threshold_breach` - Stock level below required threshold
- `critical_medicine_non_compliance` - Critical medicine stock below threshold
- `export_violation` - Export control violations
- `data_quality_issue` - Data quality or accuracy issues
- `repeated_offender` - Pattern of repeated violations

## Enforcement Action State Machine

### States

| State | Description | Who Can Be In This State |
|-------|-------------|-------------------------|
| `draft` | Action created but not yet submitted | Tier 2 (creator) |
| `pending_review` | Submitted for Tier 2 review | Tier 2 (reviewer) |
| `pending_approval` | Reviewed, awaiting Tier 1 approval | Tier 1 (approver) |
| `approved` | Approved, ready for execution | Tier 1 or Tier 2 (executor) |
| `executed` | Action has been executed | All (final state for non-appealed actions) |
| `appealed` | Company has submitted an appeal | Company (appeal submitter), Tier 1 (reviewer) |
| `resolved` | Appeal resolved or action cancelled | All (final state) |
| `cancelled` | Action cancelled before execution | Tier 1 or Tier 2 (canceller) |

### State Transitions

#### Creation Flow

```
draft → pending_review → pending_approval → approved → executed
```

**Transition Rules:**

1. **draft → pending_review**
   - **Trigger:** Tier 2 submits action for review
   - **Validation:**
     - Action must have: action_type, violation_type, legal_basis, justification
     - If action_type is `fine`: amount must be specified
     - Company must exist and be active
   - **RPC Function:** `enforcement_submit_for_review(enforcement_action_id, review_notes)`
   - **Notifications:**
     - Tier 2 reviewers: "Enforcement Action Created - Requires Review"
   - **Audit:** Logs transition with review_notes

2. **pending_review → pending_approval**
   - **Trigger:** Tier 2 reviews and approves for Tier 1 review
   - **Validation:**
     - User must be Tier 2 Officer
     - Action must be in `pending_review` state
     - Review notes required
   - **RPC Function:** `enforcement_review_action(enforcement_action_id, review_notes, approved)`
   - **Notifications:**
     - Tier 1 approvers: "Enforcement Action Reviewed - Pending Approval"
   - **Audit:** Logs review with review_notes

3. **pending_review → draft** (Rejection)
   - **Trigger:** Tier 2 rejects during review
   - **Validation:** Review notes required explaining rejection
   - **RPC Function:** `enforcement_review_action(enforcement_action_id, review_notes, approved=false)`
   - **Notifications:**
     - Creator: "Enforcement Action Review Rejected"
   - **Audit:** Logs rejection

4. **pending_approval → approved**
   - **Trigger:** Tier 1 approves action
   - **Validation:**
     - User must be Tier 1
     - Action must be in `pending_approval` state
     - For warnings: Tier 2 can also approve (if authorized)
     - Approval notes required
   - **RPC Function:** `enforcement_approve_action(enforcement_action_id, approval_notes)`
   - **Notifications:**
     - Tier 2 executors: "Enforcement Action Approved - Ready for Execution"
     - Company: "Enforcement Action Approved - Pending Execution"
   - **Audit:** Logs approval with approval_notes

5. **pending_approval → draft** (Rejection)
   - **Trigger:** Tier 1 rejects during approval
   - **Validation:** Approval notes required explaining rejection
   - **RPC Function:** `enforcement_approve_action(enforcement_action_id, approval_notes, approved=false)`
   - **Notifications:**
     - Creator: "Enforcement Action Approval Rejected"
   - **Audit:** Logs rejection

6. **approved → executed**
   - **Trigger:** Tier 1 or Tier 2 executes action
   - **Validation:**
     - User must be Tier 1 or Tier 2
     - Action must be in `approved` state
     - Execution notes optional
   - **RPC Function:** `enforcement_execute_action(enforcement_action_id, execution_notes)`
   - **Notifications:**
     - Company: "Enforcement Action - [Warning/Fine/Suspension] Executed"
     - MOH: "Enforcement Action Executed - Appeal Window Open"
   - **Audit:** Logs execution with execution_notes
   - **Side Effects:**
     - Updates company compliance score
     - Creates audit log entry
     - Opens 30-day appeal window
     - Sends notification to company

7. **approved → cancelled**
   - **Trigger:** Tier 1 or Tier 2 cancels before execution
   - **Validation:** Cancellation reason required
   - **RPC Function:** `enforcement_cancel_action(enforcement_action_id, cancellation_reason)`
   - **Notifications:**
     - Company: "Enforcement Action Cancelled"
     - Creator: "Enforcement Action Cancelled"
   - **Audit:** Logs cancellation

#### Appeal Flow

```
executed → appealed → resolved
```

8. **executed → appealed**
   - **Trigger:** Company submits appeal
   - **Validation:**
     - Must be within 30-day appeal window
     - No existing appeal for this action
     - Appeal form must be complete (grounds, explanation, optional documents)
   - **RPC Function:** `enforcement_submit_appeal(enforcement_action_id, appeal_data)`
   - **Notifications:**
     - Company: "Appeal Submitted - Under Review"
     - Tier 1 reviewers: "Appeal Submitted - Requires Review"
   - **Audit:** Logs appeal submission
   - **Side Effects:**
     - Creates `enforcement_action_appeals` record
     - Links appeal to enforcement action

9. **appealed → resolved**
   - **Trigger:** Tier 1 reviews and makes decision
   - **Validation:**
     - User must be Tier 1
     - Appeal must be in `submitted` status
     - Decision required (uphold, overturn, modify)
     - Justification required (minimum 50 characters)
   - **RPC Function:** `enforcement_review_appeal(appeal_id, decision, justification, adjustment_note)`
   - **Decision Options:**
     - **Uphold:** Maintain original enforcement action
     - **Uphold with Adjustment:** Maintain action but add adjustment note
     - **Overturn:** Reverse the enforcement action
   - **Notifications:**
     - Company: "Appeal Decision - [Uphold/Overturn/Modified]"
     - MOH: "Appeal Reviewed - [Decision]"
   - **Audit:** Logs appeal review and decision
   - **Side Effects:**
     - If overturned: Reverses enforcement action impact on compliance score
     - Updates enforcement action resolution status
     - Updates appeal status

### Authority Matrix

| Action Type | Creation | Review | Approval | Execution | Appeal Review |
|-------------|----------|--------|----------|-----------|---------------|
| **Warning** | Tier 2 | Tier 2 | Tier 2 (independent) or Tier 1 | Tier 2 or Tier 1 | Tier 1 |
| **Fine** | Tier 2 | Tier 2 | Tier 1 (required) | Tier 1 or Tier 2 | Tier 1 |
| **Suspension** | Tier 2 | Tier 2 | Tier 1 (required) | Tier 1 or Tier 2 | Tier 1 |

**Company Users:**
- Can view their own enforcement actions
- Can submit appeals (within 30-day window)
- Cannot create, approve, or execute enforcement actions

## Appeal Process Specification

### Appeal Window

- **Duration:** 30 calendar days from execution date
- **Start:** Immediately upon action execution
- **End:** 30 days after `executed_at` timestamp
- **Calculation:** `appeal_deadline = executed_at + 30 days`
- **Regulatory Basis:** DMP regulations

### Appeal Submission Requirements

#### Eligibility

- Action must be in `executed` state
- Must be within 30-day appeal window
- No existing appeal for this action (one appeal per action)
- Company user must belong to the affected company

#### Submission Form Fields

1. **Grounds for Appeal** (Required)
   - Dropdown selection:
     - `technical_error` - Technical system error prevented compliance
     - `procedural_issue` - Procedural error in enforcement process
     - `factual_inaccuracy` - Factual errors in enforcement justification
     - `mitigating_circumstances` - Mitigating circumstances not considered
     - `other` - Other grounds (requires detailed explanation)

2. **Detailed Explanation** (Required)
   - Minimum 50 characters
   - Must explain why enforcement action should be reconsidered
   - Should reference specific details from enforcement action
   - Should provide context and timeline

3. **Supporting Documents** (Optional)
   - Maximum 5 files
   - Maximum 10 MB per file
   - Supported formats: PDF, DOC, DOCX, XLS, XLSX, JPG, PNG
   - Documents should support appeal grounds

#### Submission Validation

- All required fields must be completed
- Explanation must meet minimum character requirement
- Files must meet size and format requirements
- Appeal window must not be expired
- No duplicate appeal exists

#### Submission Process

1. Company user navigates to `/enforcement/actions/[id]/appeal`
2. System validates eligibility (window, state, no existing appeal)
3. User completes appeal form
4. User submits appeal
5. System creates `enforcement_action_appeals` record
6. System updates enforcement action status to `appealed`
7. System sends notifications
8. System creates audit log entry

### Appeal Review Process

#### Review Authority

- **Tier 1 Only:** All appeals reviewed by MOH Tier 1
- **Review Timeline:** Within 14 business days of submission
- **Final Decision:** Tier 1 decision is final

#### Review Interface

**Route:** `/enforcement/actions/[id]/appeal/review` (Tier 1 only)

**Review Information Displayed:**
- Enforcement action summary (type, violation, legal basis, justification)
- Appeal details (grounds, explanation, supporting documents)
- Appeal submission information (submitted by, submitted at, deadline)
- Original enforcement action context

#### Review Decision Options

1. **Uphold Enforcement Action**
   - Maintains original enforcement action
   - Requires justification (minimum 50 characters)
   - Action remains in `executed` state
   - Appeal status: `upheld`

2. **Uphold with Adjustment Note**
   - Maintains original enforcement action
   - Adds adjustment note to enforcement action record
   - Adjustment note visible to company
   - Requires justification and adjustment note
   - Action remains in `executed` state
   - Appeal status: `upheld_with_adjustment`

3. **Overturn Enforcement Action**
   - Reverses the enforcement action
   - Requires detailed justification (minimum 50 characters)
   - Action status: `resolved` with resolution: `appeal_upheld`
   - Reverses compliance score impact
   - Appeal status: `overturned`

#### Review Validation

- Decision selection required
- Justification required (minimum 50 characters)
- If "Uphold with Adjustment" selected: adjustment note required
- Justification must align with DMP regulations

#### Review Process

1. Tier 1 navigates to appeal review interface
2. System displays enforcement action and appeal information
3. Tier 1 reviews appeal grounds, explanation, and supporting documents
4. Tier 1 selects decision option
5. Tier 1 enters justification (and adjustment note if applicable)
6. Tier 1 submits review decision
7. System updates appeal status
8. System updates enforcement action status/resolution
9. System sends notifications
10. System creates audit log entry
11. If overturned: System reverses compliance score impact

### Appeal States

| State | Description | Next States |
|-------|-------------|-------------|
| `submitted` | Appeal submitted by company | `tier1_reviewed` |
| `tier1_reviewed` | Tier 1 has reviewed | `upheld`, `upheld_with_adjustment`, `overturned` |
| `upheld` | Appeal rejected, action upheld | Final state |
| `upheld_with_adjustment` | Appeal rejected with adjustment note | Final state |
| `overturned` | Appeal accepted, action overturned | Final state |
| `withdrawn` | Appeal withdrawn by company | Final state |

## Notification Requirements

### Notification Types

#### Enforcement Action Notifications

1. **Creation Stage**
   - **Recipients:** Tier 2 reviewers
   - **Message:** "Enforcement Action Created - Requires Review"
   - **Link:** `/enforcement/actions/[id]`
   - **Priority:** Medium

2. **Review Stage**
   - **Recipients:** Tier 1 approvers
   - **Message:** "Enforcement Action Reviewed - Pending Approval"
   - **Link:** `/enforcement/pending-approvals`
   - **Priority:** High

3. **Approval Required**
   - **Recipients:** Tier 1 approvers
   - **Message:** "Enforcement Action Requires Approval"
   - **Link:** `/enforcement/pending-approvals`
   - **Priority:** High

4. **Execution Stage**
   - **Recipients:** Company users
   - **Messages:**
     - "Enforcement Action - Warning Issued"
     - "Enforcement Action - Fine Executed"
     - "Enforcement Action - Suspension Executed"
   - **Link:** `/enforcement/actions/[id]`
   - **Priority:** High

5. **Appeal Window Open**
   - **Recipients:** Company users
   - **Message:** "Appeal Window Open - 30 Days Remaining"
   - **Link:** `/enforcement/actions/[id]`
   - **Priority:** Medium

6. **Appeal Deadline Reminder**
   - **Recipients:** Company users
   - **Trigger:** 7 days before deadline
   - **Message:** "Appeal Deadline Approaching - 7 Days Remaining"
   - **Link:** `/enforcement/actions/[id]/appeal`
   - **Priority:** High

#### Appeal Notifications

1. **Appeal Submitted**
   - **Recipients:** Company users, Tier 1 reviewers
   - **Messages:**
     - Company: "Appeal Submitted - Under Review"
     - Tier 1: "Appeal Submitted - Requires Review"
   - **Link:** 
     - Company: `/enforcement/actions/[id]`
     - Tier 1: `/enforcement/actions/[id]/appeal/review`
   - **Priority:** High

2. **Appeal Status Update**
   - **Recipients:** Company users
   - **Messages:**
     - "Appeal Status Update - Upheld"
     - "Appeal Status Update - Upheld with Adjustment"
     - "Appeal Status Update - Overturned"
   - **Link:** `/enforcement/actions/[id]`
   - **Priority:** High

3. **Appeal Review Required**
   - **Recipients:** Tier 1 reviewers
   - **Message:** "Appeal Requires Review"
   - **Link:** `/enforcement/actions/[id]/appeal/review`
   - **Priority:** High

### Notification Delivery

- **Real-time:** Via WebSocket or polling
- **Email:** Optional email notifications for critical events
- **In-app:** Notification center component
- **Persistence:** All notifications stored in database

## Communication Requirements

### Communication Integration

Enforcement actions and appeals support in-system communications:

1. **Enforcement Action Communications**
   - Companies can message MOH about enforcement actions
   - MOH can message companies about enforcement actions
   - Communications linked to enforcement action entity
   - Visible in enforcement action detail page

2. **Appeal Communications**
   - Companies can message MOH about appeals
   - MOH can message companies about appeals
   - Communications linked to appeal entity
   - Visible in appeal review interface

### Communication Context

- Communications automatically include enforcement action context
- Communications can reference specific enforcement action details
- Communications preserved in audit trail

## Timeframes and Deadlines

### Enforcement Action Timeframes

| Stage | Timeframe | Notes |
|-------|-----------|-------|
| Creation | No limit | Tier 2 can create and save drafts |
| Review | 2 business days | Tier 2 review standard timeframe |
| Approval | 2 business days | Tier 1 approval standard timeframe |
| Execution | Immediate | Can execute immediately after approval |
| Appeal Window | 30 calendar days | From execution date |

### Appeal Timeframes

| Stage | Timeframe | Notes |
|-------|-----------|-------|
| Submission Window | 30 calendar days | From execution date |
| Review | 14 business days | Tier 1 review standard timeframe |
| Decision | Final | No further appeal after Tier 1 decision |

### Deadline Calculations

- **Appeal Deadline:** `executed_at + 30 days`
- **Review Deadline:** `submitted_at + 14 business days`
- **Business Days:** Excludes weekends and public holidays

## Validation Rules

### Enforcement Action Validation

#### Creation Validation

- `action_type` must be one of: `warning`, `fine`, `suspension`
- `violation_type` must be valid violation type
- `company_id` must reference existing active company
- `legal_basis` required (minimum 10 characters)
- `justification` required (minimum 50 characters)
- If `action_type` is `fine`: `amount` required and must be > 0
- `violation_reference_id` and `violation_reference_table` must be valid if provided

#### State Transition Validation

- State transitions must follow defined state machine
- User must have appropriate role and permissions
- Required fields must be completed for transition
- Previous state must be valid

### Appeal Validation

#### Submission Validation

- Appeal window must not be expired
- No existing appeal for this enforcement action
- `grounds_for_appeal` required (valid selection)
- `detailed_explanation` required (minimum 50 characters)
- Supporting documents (if provided):
  - Maximum 5 files
  - Maximum 10 MB per file
  - Valid file formats only

#### Review Validation

- User must be Tier 1
- Appeal must be in `submitted` state
- Decision selection required
- Justification required (minimum 50 characters)
- If "Uphold with Adjustment" selected: adjustment note required

## Integration Points

### Compliance Score Integration

- **Impact:** Enforcement actions affect company compliance scores
- **Calculation:** Score reduction based on action type and severity
- **Reversal:** If appeal overturned, compliance score impact is reversed
- **Timing:** Score updated upon execution

### Audit Log Integration

- **All State Transitions:** Logged in `audit_logs` table
- **All Decisions:** Logged with justification
- **All Appeals:** Logged with submission and review details
- **Immutable:** Audit logs cannot be modified

### Communication Integration

- **Entity Linking:** Communications can link to enforcement actions and appeals
- **Context Preservation:** Communication context includes enforcement action details
- **Visibility:** Communications visible in enforcement action detail pages

### Notification Integration

- **Event-Driven:** Notifications triggered by state transitions
- **Role-Based:** Recipients determined by role and permissions
- **Real-Time:** Notifications delivered via WebSocket or polling

### History Integration

- **Enforcement History:** All enforcement actions visible in company history
- **Appeal History:** All appeals visible in enforcement action history
- **Timeline View:** Chronological view of enforcement cycle

## Error Handling and Edge Cases

### Error Scenarios

1. **Appeal Window Expired**
   - **Scenario:** Company attempts to submit appeal after 30-day window
   - **Handling:** Display error message, disable appeal submission
   - **UI:** Show "Appeal Window Expired" message

2. **Duplicate Appeal**
   - **Scenario:** Company attempts to submit second appeal
   - **Handling:** Prevent submission, show existing appeal link
   - **UI:** Display existing appeal status

3. **Invalid State Transition**
   - **Scenario:** User attempts invalid state transition
   - **Handling:** Reject transition, log error
   - **UI:** Display error message with valid transitions

4. **Missing Required Fields**
   - **Scenario:** User attempts to submit without required fields
   - **Handling:** Validate client-side and server-side
   - **UI:** Display inline validation errors

5. **File Upload Errors**
   - **Scenario:** File exceeds size limit or invalid format
   - **Handling:** Reject upload, display error
   - **UI:** Show file-specific error messages

### Edge Cases

1. **Concurrent Appeals**
   - **Prevention:** Database constraint prevents multiple appeals
   - **Handling:** First submission wins, subsequent attempts rejected

2. **Appeal During Review**
   - **Scenario:** Appeal submitted while enforcement action in review
   - **Handling:** Appeal only allowed for `executed` state
   - **Validation:** Check state before allowing appeal submission

3. **Appeal After Resolution**
   - **Scenario:** Attempt to appeal already-resolved action
   - **Handling:** Prevent appeal, show resolution status
   - **UI:** Display resolution information

4. **Tier 1 Review Deadline**
   - **Scenario:** Appeal review exceeds 14 business days
   - **Handling:** System reminder notifications, escalation process
   - **Tracking:** Monitor review times, flag overdue reviews

## Database Schema Reference

### enforcement_actions Table

See [Database Schema Design](../../02-architecture/database/schema-design.md#enforcement_actions) for complete schema.

**Key Fields:**
- `status` - Current state (draft, pending_review, pending_approval, approved, executed, appealed, resolved, cancelled)
- `action_type` - warning, fine, suspension
- `violation_type` - Type of violation
- `amount` - Fine amount (NULL for warnings/suspensions)
- `legal_basis` - Legal basis reference
- `justification` - Detailed justification
- `executed_at` - Execution timestamp (starts appeal window)

### enforcement_action_appeals Table

See [Database Schema Design](../../02-architecture/database/schema-design.md#enforcement_action_appeals) for complete schema.

**Key Fields:**
- `enforcement_action_id` - Reference to enforcement action
- `appeal_reason` - Grounds for appeal
- `evidence` - Supporting documents (JSONB)
- `status` - Appeal status (submitted, tier1_reviewed, upheld, upheld_with_adjustment, overturned, withdrawn)
- `submitted_at` - Submission timestamp
- `reviewed_at_tier1` - Tier 1 review timestamp
- `resolution` - Review decision

**Constraints:**
- Unique constraint on `enforcement_action_id` (one appeal per action)
- Foreign key to `enforcement_actions(id)`

## RPC Functions

### Enforcement Action Functions

1. **enforcement_submit_for_review(enforcement_action_id, review_notes)**
   - Transitions: `draft` → `pending_review`
   - Validates: Required fields, user permissions
   - Creates: Audit log entry, notifications

2. **enforcement_review_action(enforcement_action_id, review_notes, approved)**
   - Transitions: `pending_review` → `pending_approval` or `draft`
   - Validates: User is Tier 2, state is `pending_review`
   - Creates: Audit log entry, notifications

3. **enforcement_approve_action(enforcement_action_id, approval_notes, approved)**
   - Transitions: `pending_approval` → `approved` or `draft`
   - Validates: User is Tier 1 (or Tier 2 for warnings), state is `pending_approval`
   - Creates: Audit log entry, notifications

4. **enforcement_execute_action(enforcement_action_id, execution_notes)**
   - Transitions: `approved` → `executed`
   - Validates: User is Tier 1 or Tier 2, state is `approved`
   - Creates: Audit log entry, notifications, compliance score impact
   - Side Effects: Opens appeal window

5. **enforcement_cancel_action(enforcement_action_id, cancellation_reason)**
   - Transitions: `approved` → `cancelled`
   - Validates: User is Tier 1 or Tier 2, state is `approved`
   - Creates: Audit log entry, notifications

### Appeal Functions

1. **enforcement_submit_appeal(enforcement_action_id, appeal_data)**
   - Transitions: `executed` → `appealed`
   - Validates: Appeal window, no existing appeal, form completeness
   - Creates: `enforcement_action_appeals` record, audit log entry, notifications

2. **enforcement_review_appeal(appeal_id, decision, justification, adjustment_note)**
   - Transitions: `appealed` → `resolved`
   - Validates: User is Tier 1, appeal is `submitted`, decision and justification provided
   - Creates: Audit log entry, notifications
   - Side Effects: Updates enforcement action, reverses compliance score if overturned

## Related Documents

- [Governance Workflows](governance-workflows.md) - High-level enforcement workflows
- [Regulatory Policies](regulatory-policies.md) - Appeal policy and regulatory basis
- [Approvals Authority Matrix](approvals-authority-matrix.md) - Role-based permissions
- [Database Schema Design](../../02-architecture/database/schema-design.md) - Database schema
- [Workflow Architecture](../../02-architecture/workflow-architecture.md) - General workflow patterns
- [Enforcement Action Detail Wireframe](../../04-design/user-experience/wireframes/01-rmm/enforcement/task-0.5.2.1a-enforcement-action-detail.md)
- [Appeal Submission Form Wireframe](../../04-design/user-experience/wireframes/01-rmm/enforcement/task-0.5.2.1f-appeal-submission-form.md)
- [Appeal Review Interface Wireframe](../../04-design/user-experience/wireframes/01-rmm/enforcement/task-0.5.2.1e-appeal-review-interface.md)

---

**Last Updated:** 2025-01-15  
**Status:** ✅ Complete  
**Next Review:** After implementation for validation

