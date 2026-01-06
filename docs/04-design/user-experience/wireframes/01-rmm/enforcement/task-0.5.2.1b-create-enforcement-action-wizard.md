# Task 0.5.2.1b: Create Enforcement Action Wizard Wireframe

**Status:** 🟡 In Progress  
**Route:** `/enforcement/actions/new` (MOH Tier 1 and Tier 2 only)  
**File:** `task-0.5.2.1b-create-enforcement-action-wizard.png`  
**Priority:** 🔴 Core RMM Workflows

**Design Approach:** Multi-step wizard pattern for creating enforcement actions with validation, legal basis selection, and approval workflow configuration. Professional, accessible, and optimized for MOH governance enforcement workflows.

---

## Wireframe Layout

```
┌─────────────────────────────────────────────────────────────┐
│ Home > Enforcement > Actions > New                          │
│                                                             │
│ Create Enforcement Action                                   │
│                                                             │
│ Step 1 of 3: Action Details                                 │
│ ────────────────────────────────────────────────────────── │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Action Type *                                            ││
│ │                                                          ││
│ │ ○ Warning                                                ││
│ │ ○ Fine                                                   ││
│ │ ○ Suspension                                             ││
│ │                                                          ││
│ │ [Info: Fines and suspensions require Tier 1 approval]   ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Company *                                                ││
│ │                                                          ││
│ │ [Select Company ▼]                                      ││
│ │                                                          ││
│ │ Search: [________________]                              ││
│ │                                                          ││
│ │ • ABC Pharmaceuticals Inc.                              ││
│ │ • XYZ Pharma Ltd.                                        ││
│ │ • DEF Medical Supplies                                  ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Violation Type *                                         ││
│ │                                                          ││
│ │ [Select Violation Type ▼]                               ││
│ │                                                          ││
│ │ • Submission Non-Compliance                             ││
│ │ • Threshold Breach                                       ││
│ │ • Critical Medicine Non-Compliance                      ││
│ │ • Export Violation                                       ││
│ │ • Data Quality Issue                                     ││
│ │ • Repeated Offender                                      ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Violation Reference (Optional)                           ││
│ │                                                          ││
│ │ Link this action to a specific violation:               ││
│ │                                                          ││
│ │ Entity Type: [Select Type ▼]                           ││
│ │ Entity ID: [Enter ID or search...]                      ││
│ │                                                          ││
│ │ [Link Violation]                                        ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Fine Amount (Required if Fine selected)                 ││
│ │                                                          ││
│ │ Amount: [________] MAD                                  ││
│ │                                                          ││
│ │ Currency: MAD (Moroccan Dirham)                         ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ [Cancel]                                    [Next Step →]  │
│                                                             │
│ ────────────────────────────────────────────────────────── │
│                                                             │
│ Step 2: Legal Basis & Justification                         │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Legal Basis *                                            ││
│ │                                                          ││
│ │ [Select Legal Basis ▼]                                  ││
│ │                                                          ││
│ │ • Article 15, Section 3 - Submission Requirements      ││
│ │ • Article 22, Section 1 - Threshold Compliance         ││
│ │ • Article 30, Section 2 - Critical Medicine Standards  ││
│ │                                                          ││
│ │ Or enter custom legal basis:                            ││
│ │ [________________________________________________]      ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Justification *                                          ││
│ │                                                          ││
│ │ [Minimum 50 characters required]                       ││
│ │                                                          ││
│ │ ┌────────────────────────────────────────────────────┐ ││
│ │ │                                                     │ ││
│ │ │ Enter detailed justification for this enforcement │ ││
│ │ │ action. Include specific details about the         │ ││
│ │ │ violation, previous warnings (if applicable), and  │ ││
│ │ │ regulatory basis for the action.                   │ ││
│ │ │                                                     │ ││
│ │ │                                                     │ ││
│ │ │                                                     │ ││
│ │ └────────────────────────────────────────────────────┘ ││
│ │                                                          ││
│ │ Character count: 245 / 50 minimum                       ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Internal Notes (Optional - MOH Only)                    ││
│ │                                                          ││
│ │ ┌────────────────────────────────────────────────────┐ ││
│ │ │                                                     │ ││
│ │ │ Internal notes visible only to MOH staff.         │ ││
│ │ │                                                     │ ││
│ │ └────────────────────────────────────────────────────┘ ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ [← Previous Step]                          [Next Step →]    │
│                                                             │
│ ────────────────────────────────────────────────────────── │
│                                                             │
│ Step 3: Review & Submit                                     │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Review Your Action                                       ││
│ │                                                          ││
│ │ Action Type: Warning                                    ││
│ │ Company: ABC Pharmaceuticals Inc.                       ││
│ │ Violation: Submission Non-Compliance                   ││
│ │ Legal Basis: Article 15, Section 3                     ││
│ │                                                          ││
│ │ Justification:                                          ││
│ │ [Preview of justification text...]                      ││
│ │                                                          ││
│ │ Approval Required: No (Warning - Tier 2 can approve)  ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Confirmation                                             ││
│ │                                                          ││
│ │ ☑ I confirm that all information is accurate           ││
│ │ ☑ I understand this action will be logged in audit trail││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ [← Previous Step]                    [Create Action]       │
└─────────────────────────────────────────────────────────────┘
```

---

## Component Specifications

### Page Header
- **Breadcrumbs:** "Home > Enforcement > Actions > New"
- **Title:** "Create Enforcement Action"
  - **Typography:** 24px, font-weight: 600, color: #111827
- **Progress Indicator:** "Step X of 3: [Step Name]"
  - **Visual:** Progress bar or step indicator

### Step 1: Action Details

**Action Type Selection:**
- **Input Type:** Radio buttons
- **Options:** Warning, Fine, Suspension
- **Info Message:** "Fines and suspensions require Tier 1 approval"
- **Validation:** Required field

**Company Selection:**
- **Input Type:** Searchable dropdown/combobox
- **Search Functionality:** Real-time search as user types
- **Display:** Company name list
- **Validation:** Required field, must select from list

**Violation Type Selection:**
- **Input Type:** Dropdown
- **Options:**
  - Submission Non-Compliance
  - Threshold Breach
  - Critical Medicine Non-Compliance
  - Export Violation
  - Data Quality Issue
  - Repeated Offender
- **Validation:** Required field

**Violation Reference (Optional):**
- **Input Type:** Entity type selector + ID input/search
- **Purpose:** Link action to specific violation (breach, submission, etc.)
- **Entity Types:** Dropdown with entity types
- **Entity ID:** Text input or search

**Fine Amount (Conditional):**
- **Input Type:** Number input with currency display
- **Conditional:** Only shown if "Fine" is selected
- **Validation:** Required if Fine selected, must be > 0
- **Currency:** MAD (Moroccan Dirham) - fixed

### Step 2: Legal Basis & Justification

**Legal Basis Selection:**
- **Input Type:** Dropdown with common legal bases + custom input
- **Options:** Pre-defined legal bases from regulations
- **Custom Option:** Text input for custom legal basis
- **Validation:** Required field

**Justification:**
- **Input Type:** Multi-line textarea
- **Minimum Length:** 50 characters
- **Character Counter:** Shows current count / minimum
- **Validation:** Required, minimum 50 characters
- **Placeholder:** Guidance text on what to include

**Internal Notes (Optional):**
- **Input Type:** Multi-line textarea
- **Purpose:** Internal MOH-only notes
- **Visibility:** Only visible to MOH staff
- **Validation:** Optional

### Step 3: Review & Submit

**Review Summary:**
- **Layout:** Card showing all entered information
- **Fields:** Action type, company, violation, legal basis, justification preview
- **Approval Info:** Shows if approval required

**Confirmation Checkboxes:**
- **Checkbox 1:** "I confirm that all information is accurate"
- **Checkbox 2:** "I understand this action will be logged in audit trail"
- **Validation:** Both required before submission

**Navigation Buttons:**
- **Previous Step:** Secondary button (left)
- **Create Action:** Primary button (right)
- **Cancel:** Link or secondary button (left)

---

## Role-Based Access

### MOH Tier 1
- **Full Access:** Can create all action types (Warning, Fine, Suspension)
- **Approval:** Can approve their own actions (if policy allows) or require review

### MOH Tier 2
- **Limited Access:** Can create warnings (auto-approved or Tier 2 approval)
- **Restricted:** Fines and suspensions require Tier 1 approval (shown in workflow)

---

## State Variations

### Validation Errors
- **Error Messages:** Display below each invalid field
- **Error Styling:** Red border, error icon, error message
- **Form State:** Disable submit until all errors resolved

### Loading State (Submission)
- **Button State:** Loading spinner on "Create Action" button
- **Form State:** Disabled during submission
- **Message:** "Creating enforcement action..."

### Success State
- **Redirect:** Navigate to action detail page
- **Success Message:** Toast notification "Enforcement action created successfully"

### Draft Save
- **Auto-save:** Save draft automatically (if implemented)
- **Indicator:** "Draft saved" indicator
- **Resume:** Ability to resume from saved draft

---

## Responsive Design

### Desktop (≥1024px)
- **Layout:** Centered form, max-width 800px
- **Steps:** Horizontal step indicator
- **Form:** Full-width form fields

### Tablet (768px - 1023px)
- **Layout:** Centered form, max-width 600px
- **Steps:** Horizontal step indicator (compact)
- **Form:** Full-width form fields

### Mobile (<768px)
- **Layout:** Full-width form
- **Steps:** Vertical step indicator or compact horizontal
- **Form:** Full-width form fields, stacked

---

## Interactions

### Step Navigation
- **Next Button:** Validate current step, then proceed to next
- **Previous Button:** Go back to previous step (preserve data)
- **Step Indicator:** Click to jump to step (if validation allows)

### Form Validation
- **Real-time:** Validate on blur
- **Submit Validation:** Validate all fields before submission
- **Error Display:** Show errors inline below fields

### Auto-save (if implemented)
- **Trigger:** Auto-save on field change (debounced)
- **Indicator:** "Draft saved" notification
- **Resume:** Load draft on return to form

---

## Design System References

- [Form Design Patterns](../../../../02-architecture/frontend/form-design-patterns.md) - Form validation, multi-step forms
- [UI Component Specifications](../../../../02-architecture/frontend/ui-component-specifications.md) - Forms, wizards
- [Role-Based UI Patterns](../../../../02-architecture/frontend/role-based-ui-patterns.md) - Role-based access

---

## Related Wireframes

- [Enforcement Actions List](task-0.5.2.1-enforcement-actions-list.md)
- [Enforcement Action Detail](task-0.5.2.1a-enforcement-action-detail.md)
- [Pending Approvals](task-0.5.2.1c-pending-approvals.md)

---

**Next:** [Pending Approvals](task-0.5.2.1c-pending-approvals.md)

