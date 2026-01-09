# Task 0.5.2.1a: Enforcement Action Detail Page Wireframe

**Status:** 🟡 In Progress  
**Route:** `/enforcement/actions/[id]` (MOH Tier 1, Tier 2, and Company users for their own actions)  
**File:** `task-0.5.2.1a-enforcement-action-detail.png`  
**Priority:** 🔴 Core RMM Workflows

**Design Approach:** Modern enterprise detail page pattern with workflow status, approval chain, and comprehensive action information. Professional, accessible, and optimized for MOH governance enforcement workflows.

---

## Wireframe Layout

```
┌─────────────────────────────────────────────────────────────┐
│ Home > Enforcement > Actions > [Action ID]                  │
│                                                             │
│ ⚠️ Warning - Submission Non-Compliance    [Edit] [Actions ▼]│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Enforcement Cycle Status                                 ││
│ │                                                          ││
│ │ Creation → Review → Approval → Execution → Appeal → Resolution││
│ │   ✓         ✓        ✓          ✓         ⏳      -     ││
│ │                                                          ││
│ │ Current Stage: Appeal Window (28 days remaining)       ││
│ │ Executed: 2 days ago                                     ││
│ │                                                          ││
│ │ Stage Details:                                          ││
│ │ • Creation: Completed by Tier 2 - 3 days ago           ││
│ │ • Review: Completed by Tier 2 - 2 days ago             ││
│ │ • Approval: Completed by Tier 1 - 2 days ago            ││
│ │ • Execution: Completed - 2 days ago                     ││
│ │ • Appeal Window: Active (28 days remaining)            ││
│ │ • Resolution: Pending (if appeal submitted)            ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Action Information                                       ││
│ │                                                          ││
│ │ Action Type: Warning                                     ││
│ │ Company: ABC Pharmaceuticals Inc.                      ││
│ │ Violation Type: Submission Non-Compliance               ││
│ │ Violation Reference: WSL Submission #12345              ││
│ │                                                          ││
│ │ [WSL Submission Context - If violation from WSL]      ││
│ │ Replenishment Date: 25/01/2025                          ││
│ │ (From WSL Submission - Company provided)                ││
│ │                                                          ││
│ │ Compliance Violation Reason:                            ││
│ │ "Stock replenishment delayed due to supplier delay.     ││
│ │ Expected delivery date: 25/01/2025. Alternative         ││
│ │ supplier contacted for emergency supply."               ││
│ │ (From WSL Submission)                                   ││
│ │                                                          ││
│ │ Legal Basis: Article 15, Section 3 of Regulation...   ││
│ │ [View Regulatory Framework]                             ││
│ │                                                          ││
│ │ Justification:                                          ││
│ │ The company failed to submit weekly stock levels (WSL)   ││
│ │ for the week ending 2024-01-15. This is the second     ││
│ │ instance of late submission within the last 3 months.  ││
│ │                                                          ││
│ │ [View Full Justification]                               ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Approval Chain                                           ││
│ │                                                          ││
│ │ Created by: MOH Tier 2 Officer - Fatima Alami           ││
│ │ Created: 3 days ago                                     ││
│ │                                                          ││
│ │ Reviewed by: MOH Tier 2 Officer - Ahmed Benali          ││
│ │ Reviewed: 2 days ago                                     ││
│ │ Review Notes: Verified violation details. Approved.     ││
│ │                                                          ││
│ │ Approved by: MOH Tier 1 - Dr. Samir Hassan              ││
│ │ Approved: 2 days ago                                    ││
│ │ Approval Notes: Action approved. Execute immediately.  ││
│ │                                                          ││
│ │ Executed by: System (Automated)                          ││
│ │ Executed: 2 days ago                                    ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Appeal Status                                            ││
│ │                                                          ││
│ │ Status: No Appeal                                       ││
│ │ Appeal Window: 28 days remaining (30-day window)      ││
│ │ Appeal Period: 30 calendar days from execution date     ││
│ │ (per DMP regulations)                                   ││
│ │                                                          ││
│ │ [Company users only: Submit Appeal button]              ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Related Information                                      ││
│ │                                                          ││
│ │ • Violation: [Link to WSL Submission #12345]            ││
│ │ • Company: [Link to ABC Pharmaceuticals Inc.]           ││
│ │ • Related Actions: 2 other actions for this company     ││
│ │ • Audit Log: [View audit trail]                         ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ Tabs: [Details] [History] [Appeal]                         │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ History Tab Content                                      ││
│ │                                                          ││
│ │ Timeline of all status changes and updates              ││
│ │                                                          ││
│ │ • Status changed to "Executed" - 2 days ago             ││
│ │ • Approved by Dr. Samir Hassan - 2 days ago            ││
│ │ • Reviewed by Ahmed Benali - 2 days ago                 ││
│ │ • Created by Fatima Alami - 3 days ago                  ││
│ └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

---

## Component Specifications

### Page Header
- **Breadcrumbs:** "Home > Enforcement > Actions > [Action ID]"
- **Title:** Action type icon + title (e.g., "⚠️ Warning - Submission Non-Compliance")
  - **Typography:** 24px, font-weight: 600, color: #111827
- **Actions (Right-aligned):**
  - **Edit Button:** Secondary button (MOH only, if status allows)
  - **Actions Dropdown:** More actions menu
    - Options: Cancel (if pending), View Audit Log, Export PDF

### Enforcement Cycle Status Section
- **Layout:** Horizontal timeline showing full enforcement cycle
- **Cycle Stages:**
  1. **Creation:** Tier 2 creates enforcement action
  2. **Review:** Tier 2 reviews and submits for approval
  3. **Approval:** Tier 1 approves/rejects
  4. **Execution:** Action executed upon approval
  5. **Appeal:** Company has 30 days to appeal (if applicable)
  6. **Resolution:** Appeal reviewed by Tier 1 (if appeal submitted)
- **Visual Indicators:**
  - **Completed stages:** Green checkmark (✓)
  - **Current stage:** Highlighted with status badge and progress indicator (⏳)
  - **Pending stages:** Gray, disabled (-)
  - **Timeline:** Connecting lines between stages
- **Current Status Display:**
  - **Current Stage:** Badge showing current stage name
  - **Stage Details:** Expandable list showing:
    - Stage name
    - Completion status (Completed/Pending/Active)
    - User who completed (if applicable)
    - Timestamp
    - Days remaining (for appeal window)
- **Status Badge:** Color-coded badge for current stage
- **Timestamp:** Most recent action timestamp

### Action Information Section
- **Layout:** Card with key-value pairs
- **Fields:**
  - **Action Type:** Warning/Fine/Suspension (with icon)
  - **Company:** Company name (link to company detail)
  - **Violation Type:** Violation type description
  - **Violation Reference:** Link to related violation (breach, submission, etc.)
  - **WSL Submission Context (Conditional):** Shown when Violation Reference is a WSL submission:
    - **Replenishment Date:** Actual date from WSL submission (format: DD/MM/YYYY)
    - **Label:** "(From WSL Submission - Company provided)"
    - **Compliance Violation Reason:** Full text from WSL submission (up to 300 characters)
    - **Label:** "(From WSL Submission)"
    - **Purpose:** Provides company's stated resolution plan and context for enforcement decision
  - **Legal Basis:** Legal basis text (truncated, expandable) with link to regulatory framework
  - **Regulatory Reference:** "See [Regulatory Framework](../../../../03-governance/regulatory-framework.md) for complete regulatory basis"
  - **Justification:** Full justification text (truncated if long, expandable)
- **Styling:**
  - **Labels:** 14px, color: #6b7280, font-weight: 500
  - **Values:** 16px, color: #111827

### Approval Chain Section
- **Layout:** Vertical timeline
- **Approval Steps:**
  - **Created by:** Creator name, role, timestamp
  - **Reviewed by:** Reviewer name, role, timestamp, review notes
  - **Approved by:** Approver name, role, timestamp, approval notes
  - **Executed by:** Executor (system or user), timestamp
- **Visual:** Timeline with connecting lines
- **Notes:** Expandable review/approval notes

### Appeal Status Section
- **Layout:** Card with appeal information
- **Status Display:**
  - **Appeal Status:** "No Appeal" or appeal status
  - **Appeal Window:** Countdown (e.g., "28 days remaining")
  - **Appeal Period:** "30 calendar days from execution date (per DMP regulations)"
  - **Regulatory Reference:** Note that appeal period is per DMP regulations
- **Actions (Company users only):**
  - **Submit Appeal Button:** Primary button (if within 30-day window)
    - **Action:** Navigate to `/enforcement/actions/[id]/appeal` (appeal submission form)
  - **View Appeal Link:** If appeal exists
    - **Action:** Navigate to appeal section or appeal detail

### Related Information Section
- **Layout:** List of related links
- **Links:**
  - Violation reference (if applicable)
  - Company profile
  - Related enforcement actions
  - Audit log entry
- **Styling:** Link list with icons

### Tabs
- **Tabs:** Details (default), History, Appeal (if applicable)
- **Tab Content:**
  - **Details:** All action information (default view)
  - **History:** Timeline of all changes
  - **Appeal:** Appeal details and review (if appeal exists)

---

## Role-Based Access

### MOH Tier 1
- **Full Access:** Can view all information, edit (if status allows), approve, execute
- **Actions:** Edit, Approve, Execute, Cancel

### MOH Tier 2
- **View Access:** Can view all information
- **Limited Actions:** Can review, create (warnings), edit (if created by them and pending)

### Company Users
- **Limited Access:** Can view their own company's enforcement actions
- **Actions:** Submit Appeal (if within 30-day window), View Appeal Status
- **Hidden Information:** Internal notes, review notes (unless relevant to appeal)

---

## State Variations

### Pending Approval State
- **Status Badge:** Yellow "Pending Approval"
- **Actions:** Approve/Reject buttons for Tier 1
- **Workflow:** Shows current step highlighted

### Executed State
- **Status Badge:** Green "Executed"
- **Appeal Section:** Shows appeal window countdown
- **Actions:** Limited (view, export)

### Appealed State
- **Status Badge:** Orange "Appealed"
- **Appeal Tab:** Shows appeal details and review status
- **Actions:** Review appeal (MOH), view appeal (Company)

### Cancelled State
- **Status Badge:** Gray "Cancelled"
- **Actions:** Limited (view, export)

---

## Responsive Design

### Desktop (≥1024px)
- **Layout:** Full-width with sidebar (if needed)
- **Sections:** Side-by-side where appropriate

### Tablet (768px - 1023px)
- **Layout:** Stacked sections
- **Workflow:** Horizontal timeline

### Mobile (<768px)
- **Layout:** Single column
- **Workflow:** Vertical timeline
- **Tabs:** Full-width tab navigation

---

## Interactions

### Click Actions
- **Company Name:** Navigate to company detail
- **Violation Reference:** Navigate to violation detail
- **Related Actions:** Navigate to related action list
- **Audit Log:** Navigate to audit log entry
- **Edit Button:** Navigate to edit page (if allowed)
- **Submit Appeal:** Navigate to `/enforcement/actions/[id]/appeal` (appeal submission form)

### Hover States
- **Links:** Underline on hover
- **Buttons:** Slight elevation/shadow

---

## Design System References

- [UI Component Specifications](../../../../02-architecture/frontend/ui-component-specifications.md) - Cards, badges, timelines
- [Role-Based UI Patterns](../../../../02-architecture/frontend/role-based-ui-patterns.md) - Role-based access
- [Workflow Architecture](../../../../02-architecture/workflow-architecture.md) - Workflow states
- [Regulatory Framework](../../../../03-governance/regulatory-framework.md) - Comprehensive regulatory reference including DMP regulations
- [Compliance Requirements](../../../../03-governance/compliance-requirements.md) - Detailed compliance requirements including enforcement action requirements
- [Regulatory Policies](../../../../03-governance/regulatory-policies.md) - Regulatory policies including enforcement and appeal policies

---

## Related Wireframes

- [Enforcement Actions List](task-0.5.2.1-enforcement-actions-list.md)
- [Create Enforcement Action](task-0.5.2.1b-create-enforcement-action-wizard.md)
- [Pending Approvals](task-0.5.2.1c-pending-approvals.md)
- [Appeal Submission Form](task-0.5.2.1f-appeal-submission-form.md) - Company appeal submission form
- [Appeal Review Interface](task-0.5.2.1e-appeal-review-interface.md) - MOH Tier 1 appeal review interface

---

**Next:** [Create Enforcement Action](task-0.5.2.1b-create-enforcement-action-wizard.md)

