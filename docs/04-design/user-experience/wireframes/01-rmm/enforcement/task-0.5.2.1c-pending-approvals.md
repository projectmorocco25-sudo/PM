# Task 0.5.2.1c: Pending Approvals Page Wireframe

**Status:** ✅ Complete  
**Route:** `/enforcement/pending-approvals` (MOH Tier 1 only)  
**File:** `task-0.5.2.1c-pending-approvals.png`  
**Priority:** 🔴 Core RMM Workflows

**Design Approach:** Modern approval queue interface with bulk actions, priority indicators, and quick approval workflow. Professional, accessible, and optimized for MOH Tier 1 approval workflows.

---

## Wireframe Layout

```
┌─────────────────────────────────────────────────────────────┐
│ Home > Enforcement > Pending Approvals                     │
│                                                             │
│ Pending Approvals (8)                                       │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Filters: [All Types ▼] [All Companies ▼] [Sort: Date ▼] ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ ☑ Select All  [Bulk Approve] [Bulk Reject]              ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ ☑ ⚠️ Warning - ABC Pharmaceuticals Inc.                  ││
│ │                                                          ││
│ │ Legal Basis: DMP Regulation Article 12 - Non-Compliance││
│ │ Legal Authority: ✓ Verified                            ││
│ │ Regulatory Limit: N/A (Warning)                        ││
│ │                                                          ││
│ │ Violation: Submission Non-Compliance                    ││
│ │ Created: 2 days ago  |  Reviewed by: Ahmed Benali       ││
│ │                                                          ││
│ │ Approval Deadline: 🔴 5 days remaining (Due: [date])   ││
│ │                                                          ││
│ │ Regulatory Requirements Checklist:                      ││
│ │ ☑ Legal basis verified                                 ││
│ │ ☑ Legal authority confirmed                            ││
│ │ ☑ Regulatory deadline met                              ││
│ │ ☐ Amount within regulatory limits (N/A - Warning)      ││
│ │ ☑ Justification meets regulatory requirements          ││
│ │                                                          ││
│ │ Justification Preview:                                  ││
│ │ The company failed to submit weekly stock levels...     ││
│ │ ✓ Meets regulatory requirements                         ││
│ │                                                          ││
│ │ [View Details] [Approve] [Reject] [Request Info]        ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ 💰 Fine - $5,000 - XYZ Pharma Ltd.                      ││
│ │                                                          ││
│ │ Violation: Threshold Breach                             ││
│ │ Created: 1 day ago  |  Reviewed by: Fatima Alami       ││
│ │                                                          ││
│ │ Justification Preview:                                  ││
│ │ Repeated threshold violations for critical medicine...  ││
│ │                                                          ││
│ │ [View Details] [Approve] [Reject] [Request Info]        ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ 🚫 Suspension - DEF Medical Supplies                    ││
│ │                                                          ││
│ │ Violation: Repeated Offender                            ││
│ │ Created: 3 hours ago  |  Reviewed by: Ahmed Benali     ││
│ │                                                          ││
│ │ Justification Preview:                                  ││
│ │ Multiple violations over 6 months. Escalation required.││
│ │                                                          ││
│ │ [View Details] [Approve] [Reject] [Request Info]        ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ [Load More]                                                 │
└─────────────────────────────────────────────────────────────┘
```

---

## Component Specifications

### Page Header
- **Breadcrumbs:** "Home > Enforcement > Pending Approvals"
- **Title:** "Pending Approvals"
  - **Typography:** 24px, font-weight: 600, color: #111827
- **Count Badge:** Number of pending approvals (e.g., "(8)")
  - **Styling:** Badge with count

### Filters Bar
- **Layout:** Horizontal filter bar
- **Filters:**
  - **Action Type:** Dropdown (All Types, Warning, Fine, Suspension)
  - **Company:** Dropdown (All Companies, specific companies)
  - **Sort:** Dropdown (Date, Priority, Company)
- **Styling:** Compact filter controls

### Bulk Actions Bar (Enhanced per Fatima's Requirement)
- **Layout:** Horizontal bar with checkboxes and buttons
- **Select All Checkbox:** Select/deselect all items
- **Bulk Actions:**
  - **Bulk Approve Button:** Primary button (enabled when items selected)
    - **Regulatory Validation (Fatima's Requirement):**
      - Before bulk approval, validates all selected actions can be bulk approved
      - Verifies all legal bases are confirmed
      - Shows regulatory requirement status for bulk selection
      - Warns if any action requires individual review per regulations
  - **Bulk Reject Button:** Secondary/destructive button (enabled when items selected)
- **Regulatory Status Indicator (Fatima's Requirement):**
  - Shows count of selected actions that pass all regulatory requirements
  - Warning if any selected actions have incomplete regulatory checklists
- **Styling:** Sticky bar (stays visible when scrolling)

### Approval Cards (Enhanced per Fatima's Requirements)
- **Layout:** Card-based layout (one card per pending action)
- **Card Structure:**
  - **Header:**
    - **Checkbox:** Select item for bulk action
    - **Action Type Icon:** ⚠️ Warning, 💰 Fine, 🚫 Suspension
    - **Title:** Action type + company name
  - **Body:**
    - **Legal Basis (Fatima's Requirement - REQUIRED):**
      - Prominently displayed: "Legal Basis: [Regulation Article X] - [Description]"
      - **Legal Authority Verification:** "Legal Authority: ✓ Verified" or "⚠️ Needs Verification"
    - **Regulatory Limit Check (Fatima's Requirement):**
      - For fines: "Regulatory Limit: [Maximum] MAD"
      - Verification: "✓ Within limit" or "⚠️ Verify" indicator
      - For warnings/suspensions: "Regulatory Limit: N/A"
    - **Violation Type:** Violation description
    - **Metadata:** Created date, reviewed by (Tier 2 officer)
    - **Approval Deadline Tracking (Fatima's Requirement):**
      - "Approval Deadline: 🔴 [X] days remaining (Due: [date])"
      - Urgency indicator: 🔴 if <3 days, 🟡 if 3-7 days, 🟢 if >7 days
    - **Regulatory Requirements Checklist (Fatima's Requirement - REQUIRED):**
      - Checklist items:
        - ☑ Legal basis verified
        - ☑ Legal authority confirmed
        - ☑ Regulatory deadline met (if applicable)
        - ☐ Amount within regulatory limits (if fine)
        - ☑ Justification meets regulatory requirements
      - **BLOCKER:** Cannot approve unless all checks pass (blocked by UI)
    - **Justification Preview:** Truncated justification text
      - **Justification Validation Indicator (Fatima's Requirement):**
        - "✓ Meets regulatory requirements" or "⚠️ Missing required elements: [list]"
  - **Actions:**
    - **View Details Button:** Navigate to action detail
    - **Approve Button:** Primary button (disabled if regulatory checklist incomplete)
    - **Reject Button:** Secondary/destructive button
    - **Request Info Button:** Secondary button (request additional information)

**Card Styling:**
- **Background:** White (#ffffff)
- **Border:** 1px solid #e5e7eb
- **Border Radius:** 8px
- **Padding:** 16px
- **Spacing:** 16px between cards
- **Hover:** Slight elevation/shadow

### Priority Indicators
- **High Priority:** Visual indicator (red badge or icon)
- **Priority Factors:**
  - Suspensions (always high priority)
  - Fines over threshold amount
  - Critical medicine violations
  - Repeated offenders

---

## Role-Based Access

### MOH Tier 1
- **Full Access:** Can view all pending approvals, approve, reject, request info
- **Actions:** All action buttons available

### MOH Tier 2
- **No Access:** This page is not accessible to Tier 2
- **Alternative:** Tier 2 can view actions they reviewed in actions list

---

## State Variations

### Empty State (No Pending Approvals)
- **Message:** "No pending approvals"
- **Subtext:** "All enforcement actions have been reviewed"
- **Visual:** Empty state illustration

### Loading State
- **Skeleton:** Card placeholders with shimmer effect
- **Count:** 3-5 skeleton cards

### Error State
- **Message:** "Unable to load pending approvals"
- **Action:** "Retry" button

### Bulk Selection State
- **Visual:** Selected cards highlighted
- **Actions:** Bulk action buttons enabled
- **Count:** "X items selected" indicator

---

## Responsive Design

### Desktop (≥1024px)
- **Layout:** Full-width cards
- **Filters:** Horizontal filter bar
- **Bulk Actions:** Always visible bar

### Tablet (768px - 1023px)
- **Layout:** Full-width cards
- **Filters:** Collapsible filter bar
- **Bulk Actions:** Sticky bar

### Mobile (<768px)
- **Layout:** Full-width cards, stacked
- **Filters:** Hidden (accessible via filter button)
- **Bulk Actions:** Sticky bottom bar
- **Actions:** Stacked buttons in cards

---

## Interactions

### Click Actions
- **View Details:** Navigate to `/enforcement/actions/[id]`
- **Approve:** Open approval modal or inline approval
- **Reject:** Open rejection modal (requires reason)
- **Request Info:** Open request info modal

### Bulk Actions
- **Select All:** Toggle all checkboxes
- **Bulk Approve:** Open bulk approval modal (confirmation required)
- **Bulk Reject:** Open bulk rejection modal (requires reason for each)

### Approval Modal (if modal used)
- **Confirmation:** "Approve this enforcement action?"
- **Approval Notes:** Optional textarea for approval notes
- **Actions:** Confirm Approve, Cancel

### Rejection Modal
- **Confirmation:** "Reject this enforcement action?"
- **Rejection Reason:** Required textarea
- **Feedback:** Will be sent to creator (Tier 2 officer)
- **Actions:** Confirm Reject, Cancel

---

## Design System References

- [UI Component Specifications](../../../../02-architecture/frontend/ui-component-specifications.md) - Cards, buttons, modals
- [Role-Based UI Patterns](../../../../02-architecture/frontend/role-based-ui-patterns.md) - Role-based access
- [Form Design Patterns](../../../../02-architecture/frontend/form-design-patterns.md) - Modals, confirmations
- [Regulatory Framework](../../../../03-governance/regulatory-framework.md) - Comprehensive regulatory reference including DMP regulations
- [Compliance Requirements](../../../../03-governance/compliance-requirements.md) - Detailed compliance requirements including enforcement action requirements
- [Regulatory Policies](../../../../03-governance/regulatory-policies.md) - Regulatory policies including enforcement and approval policies

---

## Related Wireframes

- [Enforcement Dashboard](task-0.5.2.0-enforcement-dashboard.md)
- [Enforcement Actions List](task-0.5.2.1-enforcement-actions-list.md)
- [Enforcement Action Detail](task-0.5.2.1a-enforcement-action-detail.md)

---

**Next:** [Enforcement Reports](task-0.5.2.1d-enforcement-reports.md)

