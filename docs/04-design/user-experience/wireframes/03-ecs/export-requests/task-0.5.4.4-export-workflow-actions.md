# Task 0.5.4.4: Export Workflow Actions Wireframe

**Status:** ✅ Complete  
**Route:** `/ecs/export-requests/[id]` (actions on detail page)  
**File:** `task-0.5.4.4-export-workflow-actions.png`  
**Priority:** 🟡 ECS Module

**Design Approach:** Role-based action buttons and modals for export request workflow transitions (submit, verify, approve, reject, intervene). Professional, accessible, and optimized for regulatory compliance workflows with intervention window indicators.

---

## Wireframe Layout

### Action Buttons Section (Detail Page)

```
┌─────────────────────────────────────────────────────────────┐
│ Export Request Detail Page                                   │
│                                                             │
│ [Previous Content: Request Info, Threshold Comparison]      │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Workflow Actions (Role-Based)                            ││
│ │                                                          ││
│ │ [If Company User - Draft State]                         ││
│ │ [Save Draft] [Submit Request] [Cancel Request]          ││
│ │                                                          ││
│ │ [If Company User - Submitted State]                     ││
│ │ [Cancel Request] [View Status]                          ││
│ │                                                          ││
│ │ [If MOH Tier 1 - Auto-Approval Queue]                  ││
│ │ ⚠️ Intervention Window: 1 day remaining                ││
│ │ [Intervene] [View Details]                              ││
│ │                                                          ││
│ │ [If MOH Tier 1 - Approved (Post-Approval)]            ││
│ │ ⚠️ Post-Approval Intervention: 24 hours remaining     ││
│ │ [Intervene] [View Details]                              ││
│ │                                                          ││
│ │ [If MOH Tier 2 - Tier 2 Verification Required]        ││
│ │ [Verify Request] [Request Info]                        ││
│ │                                                          ││
│ │ [If MOH Tier 1/Tier 2 - Manual Review]                ││
│ │ [Approve Request] [Reject Request] [Request Info]      ││
│ │                                                          ││
│ │ [If MOH Tier 1 - Authorized]                           ││
│ │ [Revoke Authorization] [View Authorization]            ││
│ └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

### Submit Request Modal

```
┌─────────────────────────────────────────────────────────────┐
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Submit Export Request                                    ││
│ │                                                          ││
│ │ Are you sure you want to submit this export request?    ││
│ │                                                          ││
│ │ Request Details:                                         ││
│ │ • SKU: SKU001 - Product A / 500mg / Tablet             ││
│ │ • Destination: Country X                                 ││
│ │ • Quantity: 1,000 units                                  ││
│ │ • Expected Date: February 15, 2025                     ││
│ │                                                          ││
│ │ Upon submission:                                         ││
│ │ • Request will be evaluated based on your compliance    ││
│ │   score (CMC module active)                            ││
│ │ • Request status will move to: Submitted               ││
│ │ • Conditional validation will determine next workflow  ││
│ │   state (Auto-approval queue / Tier 2 / Manual review)││
│ │                                                          ││
│ │ You will not be able to edit the request after         ││
│ │ submission, but you can cancel it before authorization.││
│ │                                                          ││
│ │ [Cancel] [Confirm & Submit]                             ││
│ └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

### Intervene Modal (Tier 1 - Auto-Approval Queue)

```
┌─────────────────────────────────────────────────────────────┐
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Intervene in Export Request                             ││
│ │                                                          ││
│ │ Request: REQ-2025-001                                    ││
│ │ Company: ABC Pharmaceuticals Inc.                      ││
│ │ Status: Auto-approval queue (1 day remaining)         ││
│ │                                                          ││
│ │ Intervention Reason *                                   ││
│ │ ┌────────────────────────────────────────────────────┐ ││
│ │ │ [Enter reason for intervention...]                 │ ││
│ │ │                                                     │ ││
│ │ │ (Required: Explain why this request requires      │ ││
│ │ │  manual review instead of auto-approval)          │ ││
│ │ └────────────────────────────────────────────────────┘ ││
│ │                                                          ││
│ │ Upon intervention:                                       ││
│ │ • Request will move to Manual Review status            ││
│ │ • Request will be removed from auto-approval queue     ││
│ │ • Request will require Tier 1 or Tier 2 approval      ││
│ │                                                          ││
│ │ Intervention Window: 1 day remaining                    ││
│ │                                                          ││
│ │ [Cancel] [Confirm Intervention]                         ││
│ └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

### Verify Request Modal (Tier 2)

```
┌─────────────────────────────────────────────────────────────┐
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Verify Export Request                                   ││
│ │                                                          ││
│ │ Request: REQ-2025-001                                    ││
│ │ Company: ABC Pharmaceuticals Inc.                      ││
│ │ Status: Tier 2 Verification Required                   ││
│ │                                                          ││
│ │ Verification Notes                                       ││
│ │ ┌────────────────────────────────────────────────────┐ ││
│ │ │ [Enter verification notes...]                      │ ││
│ │ │                                                     │ ││
│ │ │ (Optional: Add notes about verification process)  │ ││
│ │ └────────────────────────────────────────────────────┘ ││
│ │                                                          ││
│ │ Upon verification:                                       ││
│ │ • Request will move to Auto-approval queue             ││
│ │ • Intervention window will start (2 working days)     ││
│ │ • Request will be auto-approved after window expires  ││
│ │   (unless Tier 1 intervenes)                          ││
│ │                                                          ││
│ │ [Cancel] [Verify & Move to Auto-Approval]             ││
│ └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

### Approve Request Modal (Tier 1/Tier 2)

```
┌─────────────────────────────────────────────────────────────┐
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Approve Export Request                                  ││
│ │                                                          ││
│ │ Request: REQ-2025-001                                    ││
│ │ Company: ABC Pharmaceuticals Inc.                      ││
│ │ Status: Manual Review                                   ││
│ │                                                          ││
│ │ Approval Notes                                          ││
│ │ ┌────────────────────────────────────────────────────┐ ││
│ │ │ [Enter approval notes...]                          │ ││
│ │ │                                                     │ ││
│ │ │ (Optional: Add notes about approval decision)     │ ││
│ │ └────────────────────────────────────────────────────┘ ││
│ │                                                          ││
│ │ Upon approval:                                          ││
│ │ • Request will move to Approved status                 ││
│ │ • System will automatically authorize the export       ││
│ │ • Authorization will be valid for 90 calendar days     ││
│ │ • Threshold will switch from VCI → ECS for 3 months   ││
│ │ • CMC compliance score will be recalculated            ││
│ │                                                          ││
│ │ Threshold Impact:                                       ││
│ │ • VCI Threshold: 3,000 units → ECS Threshold: 4,200   ││
│ │ • Threshold switch date: [Today + 1 day]               ││
│ │ • Revert date: [Authorization date + 3 months]         ││
│ │                                                          ││
│ │ [Cancel] [Confirm Approval]                             ││
│ └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

### Reject Request Modal (Tier 1/Tier 2)

```
┌─────────────────────────────────────────────────────────────┐
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Reject Export Request                                   ││
│ │                                                          ││
│ │ Request: REQ-2025-001                                    ││
│ │ Company: ABC Pharmaceuticals Inc.                      ││
│ │ Status: Manual Review                                   ││
│ │                                                          ││
│ │ Rejection Reason *                                      ││
│ │ ┌────────────────────────────────────────────────────┐ ││
│ │ │ [Enter rejection reason...]                        │ ││
│ │ │                                                     │ ││
│ │ │ (Required: Explain why this request is rejected)  │ ││
│ │ └────────────────────────────────────────────────────┘ ││
│ │                                                          ││
│ │ Upon rejection:                                         ││
│ │ • Request will move to Rejected status                 ││
│ │ • Company will be notified of rejection                ││
│ │ • Request cannot be resubmitted (must create new)      ││
│ │ • No threshold switch will occur                       ││
│ │                                                          ││
│ │ ⚠️ Warning: Rejection cannot be undone.                ││
│ │                                                          ││
│ │ [Cancel] [Confirm Rejection]                            ││
│ └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

### Post-Approval Intervention Modal (Tier 1 - 24 Hours After Auto-Approval)

```
┌─────────────────────────────────────────────────────────────┐
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Post-Approval Intervention                               ││
│ │                                                          ││
│ │ Request: REQ-2025-001                                    ││
│ │ Company: ABC Pharmaceuticals Inc.                      ││
│ │ Status: Approved (Auto-approved 20 hours ago)          ││
│ │                                                          ││
│ │ ⚠️ Post-Approval Intervention Window: 4 hours remaining││
│ │                                                          ││
│ │ Intervention Reason *                                   ││
│ │ ┌────────────────────────────────────────────────────┐ ││
│ │ │ [Enter reason for post-approval intervention...]   │ ││
│ │ │                                                     │ ││
│ │ │ (Required: Explain why this auto-approved request │ ││
│ │ │  requires intervention after approval)             │ ││
│ │ └────────────────────────────────────────────────────┘ ││
│ │                                                          ││
│ │ Upon intervention:                                       ││
│ │ • Authorization will be revoked                         ││
│ │ • Request will move to Manual Review status            ││
│ │ • Threshold switch will be cancelled                   ││
│ │ • Request will require re-approval                     ││
│ │                                                          ││
│ │ ⚠️ Warning: This action will revoke the authorization   ││
│ │    and require manual review.                           ││
│ │                                                          ││
│ │ [Cancel] [Confirm Post-Approval Intervention]          ││
│ └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

### Cancel Request Modal (Company User)

```
┌─────────────────────────────────────────────────────────────┐
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Cancel Export Request                                   ││
│ │                                                          ││
│ │ Request: REQ-2025-001                                    ││
│ │ Status: Draft / Submitted                                ││
│ │                                                          ││
│ │ Cancellation Reason                                     ││
│ │ ┌────────────────────────────────────────────────────┐ ││
│ │ │ [Enter cancellation reason...]                     │ ││
│ │ │                                                     │ ││
│ │ │ (Optional: Add notes about cancellation reason)   │ ││
│ │ └────────────────────────────────────────────────────┘ ││
│ │                                                          ││
│ │ Upon cancellation:                                       ││
│ │ • Request will move to Cancelled status                ││
│ │ • Request cannot be edited or resubmitted              ││
│ │ • You will need to create a new request if needed      ││
│ │                                                          ││
│ │ ⚠️ Warning: Cancellation cannot be undone.             ││
│ │                                                          ││
│ │ [Cancel] [Confirm Cancellation]                         ││
│ └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

---

## Component Specifications

### Action Buttons (Role-Based)

#### Company Users (IPC only)
- **Draft State:**
  - **Save Draft:** Secondary button (auto-save also available)
  - **Submit Request:** Primary button (opens Submit Request modal)
  - **Cancel Request:** Secondary button (opens Cancel Request modal)
- **Submitted State:**
  - **Cancel Request:** Secondary button (opens Cancel Request modal)
  - **View Status:** Secondary button (scroll to workflow status)
- **Approved/Authorized/Completed/Rejected/Cancelled:**
  - **View Only:** No action buttons (read-only)

#### MOH Tier 1
- **Auto-Approval Queue State:**
  - **Intervene:** Primary button (opens Intervene modal)
  - **Intervention Window Indicator:** Warning banner with countdown timer
  - **View Details:** Secondary button (scroll to details)
- **Approved State (Post-Approval):**
  - **Intervene:** Primary button (opens Post-Approval Intervention modal)
  - **Post-Approval Window Indicator:** Warning banner with 24-hour countdown
  - **View Details:** Secondary button (scroll to details)
- **Manual Review State:**
  - **Approve Request:** Primary button (opens Approve Request modal)
  - **Reject Request:** Secondary button (opens Reject Request modal)
  - **Request Info:** Secondary button (scroll to details)
- **Authorized State:**
  - **Revoke Authorization:** Secondary button (opens Revoke Authorization modal)
  - **View Authorization:** Secondary button (link to authorization detail)

#### MOH Tier 2
- **Tier 2 Verification Required State:**
  - **Verify Request:** Primary button (opens Verify Request modal)
  - **Request Info:** Secondary button (scroll to details)
- **Manual Review State:**
  - **Approve Request:** Primary button (opens Approve Request modal)
  - **Reject Request:** Secondary button (opens Reject Request modal)
  - **Request Info:** Secondary button (scroll to details)
- **Auto-Approval Queue / Approved / Authorized:**
  - **View Only:** No action buttons (read-only, Tier 1 functions)

---

## Modal Specifications

### Submit Request Modal
- **Purpose:** Confirm submission of export request
- **Content:**
  - Request details summary
  - Explanation of submission consequences
  - Conditional validation information
- **Actions:** Cancel, Confirm & Submit
- **Validation:** All required fields must be valid before submission

### Intervene Modal (Auto-Approval Queue)
- **Purpose:** Tier 1 intervention in auto-approval queue
- **Required Fields:**
  - Intervention Reason (required, textarea)
- **Content:**
  - Request information
  - Intervention window countdown
  - Explanation of intervention consequences
- **Actions:** Cancel, Confirm Intervention
- **Validation:** Reason is required

### Verify Request Modal (Tier 2)
- **Purpose:** Tier 2 verification of export request
- **Optional Fields:**
  - Verification Notes (optional, textarea)
- **Content:**
  - Request information
  - Explanation of verification consequences
- **Actions:** Cancel, Verify & Move to Auto-Approval
- **Validation:** None (verification is confirmation action)

### Approve Request Modal
- **Purpose:** Approve export request (manual review)
- **Optional Fields:**
  - Approval Notes (optional, textarea)
- **Content:**
  - Request information
  - Explanation of approval consequences
  - Threshold impact preview (if applicable)
- **Actions:** Cancel, Confirm Approval
- **Validation:** None (approval is confirmation action)

### Reject Request Modal
- **Purpose:** Reject export request (manual review)
- **Required Fields:**
  - Rejection Reason (required, textarea)
- **Content:**
  - Request information
  - Explanation of rejection consequences
  - Warning about irreversible action
- **Actions:** Cancel, Confirm Rejection
- **Validation:** Reason is required

### Post-Approval Intervention Modal
- **Purpose:** Tier 1 post-approval intervention (24 hours after auto-approval)
- **Required Fields:**
  - Intervention Reason (required, textarea)
- **Content:**
  - Request information
  - Post-approval window countdown (24 hours)
  - Explanation of intervention consequences
  - Warning about revocation
- **Actions:** Cancel, Confirm Post-Approval Intervention
- **Validation:** Reason is required

### Cancel Request Modal (Company User)
- **Purpose:** Cancel export request (draft or submitted)
- **Optional Fields:**
  - Cancellation Reason (optional, textarea)
- **Content:**
  - Request information
  - Explanation of cancellation consequences
  - Warning about irreversible action
- **Actions:** Cancel, Confirm Cancellation
- **Validation:** None (cancellation is confirmation action)

---

## Intervention Window Indicators

### Auto-Approval Queue Intervention Window
- **Default Duration:** 2 working days (configurable 1-5 days)
- **Display:** Countdown timer showing days remaining
- **Format:** "Intervention Window: X day(s) remaining"
- **Color Coding:**
  - Green: 2+ days remaining
  - Yellow: 1 day remaining
  - Red: < 1 day remaining (or expired)
- **Visibility:** Only shown to MOH Tier 1
- **Actions:** "Intervene" button available during window

### Post-Approval Intervention Window
- **Duration:** 24 hours after auto-approval
- **Display:** Countdown timer showing hours remaining
- **Format:** "Post-Approval Intervention: X hours remaining"
- **Color Coding:**
  - Yellow: 12+ hours remaining
  - Orange: 6-12 hours remaining
  - Red: < 6 hours remaining (or expired)
- **Visibility:** Only shown to MOH Tier 1
- **Actions:** "Intervene" button available during window

---

## Business Rules

1. **Submit Action:** Company users can submit draft requests (moves to `submitted` state)
2. **Intervene Action:** Tier 1 can intervene in auto-approval queue (within intervention window)
3. **Post-Approval Intervention:** Tier 1 can intervene within 24 hours after auto-approval
4. **Verify Action:** Tier 2 can verify tier2_verification_required requests
5. **Approve Action:** Tier 1/Tier 2 can approve manual review requests
6. **Reject Action:** Tier 1/Tier 2 can reject manual review requests (requires reason)
7. **Cancel Action:** Company users can cancel draft/submitted requests (before authorization)
8. **Revoke Action:** Tier 1 can revoke authorized exports
9. **Validation:** Conditional validation based on CMC score determines workflow state
10. **Threshold Switching:** Occurs on authorization (VCI → ECS for 3 months)

---

## Design System References

- [UI Component Specifications](../../../../02-architecture/frontend/ui-component-specifications.md) - Modals, buttons, forms
- [Form Design Patterns](../../../../02-architecture/frontend/form-design-patterns.md) - Modal forms, validation
- [Workflow Architecture](../../../../02-architecture/workflow-architecture.md) - Export Request Workflow

---

## Related Wireframes

- [Export Request Detail](task-0.5.4.3-export-request-detail.md)
- [Export Requests List](task-0.5.4.1-export-requests-list.md)
- [Export Authorization Detail](../authorizations/task-0.5.4.6-export-authorization-detail.md)

---

**Next:** [Export Authorizations List](../authorizations/task-0.5.4.5-export-authorizations-list.md)

**Last Updated:** 2025-01-15  
**Owner:** Emma (UI/UX + Next.js Frontend Specialist)  
**Guided by:** Fatima (MOH Regulatory Requirements) & Dr. Samir (Business Process Validation)

