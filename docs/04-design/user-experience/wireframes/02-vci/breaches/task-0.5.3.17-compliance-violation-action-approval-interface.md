# Task 0.5.3.17: Compliance Violation Action Approval Interface Wireframe

**Status:** ✅ Complete  
**Route:** `/vci/compliance-violations/[id]/approve` (Tier 1 only)  
**File:** `task-0.5.3.17-compliance-violation-action-approval-interface.png`  
**Priority:** 🔴 Critical VCI Workflows

**Design Approach:** Modern approval interface with Tier 2 analysis review, approve/reject/independent action options, and justification input. Professional, accessible, and optimized for MOH Tier 1 approval workflows.

---

## Wireframe Layout

```
┌─────────────────────────────────────────────────────────────┐
│ Home > VCI > Compliance Violations > [Violation ID] > Approve │
│                                                             │
│ Approve Compliance Violation Action                        │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Violation Summary                                        ││
│ │                                                          ││
│ │ SKU: SKU002 - Product B / 250mg / Capsule              ││
│ │ Company: ABC Pharmaceuticals Inc.                       ││
│ │ Stock Level: 400 units | Threshold: 600 units           ││
│ │ Threshold Compliance: 67% (below threshold)            ││
│ │ Priority: 🔴 High (Critical Medicine)                 ││
│ │                                                          ││
│ │ Replenishment Date: 25/01/2025                          ││
│ │ (From WSL Submission - Company provided)                ││
│ │                                                          ││
│ │ Compliance Violation Reason:                            ││
│ │ "Stock replenishment delayed due to supplier delay.     ││
│ │ Expected delivery date: 25/01/2025. Alternative         ││
│ │ supplier contacted for emergency supply."               ││
│ │ (From WSL Submission)                                   ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Tier 2 Analysis Review                                   ││
│ │                                                          ││
│ │ Analyzed by: Ahmed Benali (Tier 2 Officer)              ││
│ │ Analyzed: 1 day ago                                     ││
│ │                                                          ││
│ │ Suggested Action: Warning                               ││
│ │                                                          ││
│ │ Analysis Comments:                                      ││
│ │ "This is the first violation for this SKU. Stock level  ││
│ │ is 33% below threshold. Company has indicated           ││
│ │ replenishment expected within 7 days. Recommend         ││
│ │ warning as first violation."                            ││
│ │                                                          ││
│ │ [View Full Analysis]                                    ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Approval Decision *                                      ││
│ │                                                          ││
│ │ ○ Approve Suggested Action (Warning)                    ││
│ │   Accept Tier 2's suggested action                     ││
│ │                                                          ││
│ │ ○ Reject Suggested Action                               ││
│ │   Reject Tier 2's suggestion, no action taken          ││
│ │                                                          ││
│ │ ○ Independent Action                                    ││
│ │   Take different action than suggested                  ││
│ │                                                          ││
│ │   If Independent Action selected:                       ││
│ │   Action Type: [Select Action ▼]                       ││
│ │   • Warning                                             ││
│ │   • Fine                                                ││
│ │   • Suspension                                          ││
│ │                                                          ││
│ │   Fine Amount (if Fine selected): [5,000] MAD          ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Approval Justification *                                 ││
│ │                                                          ││
│ │ [Minimum 50 characters required]                        ││
│ │                                                          ││
│ │ ┌────────────────────────────────────────────────────┐ ││
│ │ │ Enter justification for your approval decision.   │ ││
│ │ │ Include regulatory basis and reasoning for          │ ││
│ │ │ approving, rejecting, or taking independent action. │ ││
│ │ │                                                      │ ││
│ │ │                                                      │ ││
│ │ └────────────────────────────────────────────────────┘ ││
│ │                                                          ││
│ │ Character count: 0 / 50 minimum                         ││
│ │                                                          ││
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Regulatory Requirement Checklist (Fatima's Requirement) ││
│ │                                                          ││
│ │ ☑ Legal Basis Verified: DMP Art. [X]                   ││
│ │ ☑ Legal Authority Verified: Tier 1 Approval Authority   ││
│ │ ☑ Regulatory Requirements Met                           ││
│ │ ☑ Compliance Verification Complete                     ││
│ │ ☑ Regulatory Limit Check: ✓ Verified (if Fine)         ││
│ │                                                          ││
│ │ ⚠️ Approval blocked if regulatory checklist incomplete  ││
│ │ [View Regulatory Framework]                             ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ │ ℹ️ Justification must align with DMP regulations.    ││
│ │    [View Regulatory Framework]                         ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Internal Notes (MOH Only)                               ││
│ │                                                          ││
│ │ ┌────────────────────────────────────────────────────┐ ││
│ │ │ Internal notes visible only to MOH staff.          │ ││
│ │ │                                                      │ ││
│ │ └────────────────────────────────────────────────────┘ ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ [Cancel]                                    [Approve Action]│
└─────────────────────────────────────────────────────────────┘
```

---

## Component Specifications

### Page Header
- **Breadcrumbs:** "Home > VCI > Compliance Violations > [Violation ID] > Approve"
- **Title:** "Approve Compliance Violation Action"
  - **Typography:** 24px, font-weight: 600, color: #111827
- **Actions (Right-aligned):**
  - **Cancel Button:** Secondary button
  - **Approve Action Button:** Primary button (disabled until validations pass)

### Violation Summary Section
- **Layout:** Card with key violation information
- **Fields:**
  - **SKU:** SKU code and product description
  - **Company:** Company name
  - **Stock vs Threshold:** Comparison
  - **Threshold Compliance %:** Calculated percentage (Stock / Threshold × 100) with indicator
  - **Priority:** Priority badge with reason
  - **Replenishment Date:** Actual date from WSL submission:
    - Format: DD/MM/YYYY (e.g., "25/01/2025")
    - Label: "(From WSL Submission - Company provided)"
    - Read-only: Cannot be edited (from submission)
  - **Compliance Violation Reason:** Company-provided reason from WSL submission:
    - Full text display (up to 300 characters)
    - Label: "(From WSL Submission)"
    - Read-only: Cannot be edited (from submission)
- **Purpose:** Provide context for approval decision, including company's stated resolution plan

### Tier 2 Analysis Review Section
- **Layout:** Card displaying Tier 2 analysis
- **Fields:**
  - **Analyzed By:** Tier 2 officer name and role
  - **Analyzed:** Analysis timestamp
  - **Suggested Action:** Action type suggested by Tier 2
  - **Analysis Comments:** Full analysis comments (truncated, expandable)
  - **View Full Analysis Link:** Link to complete analysis details
- **Styling:** Read-only display, clearly labeled as Tier 2 analysis

### Approval Decision Section
- **Input Type:** Radio buttons
- **Options:**
  1. **Approve Suggested Action:** Accept Tier 2's suggestion
  2. **Reject Suggested Action:** Reject suggestion, no action
  3. **Independent Action:** Take different action than suggested
- **Conditional Fields (if Independent Action selected):**
  - **Action Type:** Dropdown (Warning, Fine, Suspension)
  - **Fine Amount:** Number input (if Fine selected)
- **Validation:** Required field
- **Help Text:** Explanation of each option

### Approval Justification Section
- **Input Type:** Multi-line textarea
- **Label:** "Approval Justification *"
- **Minimum Length:** 50 characters
- **Character Counter:** Shows current count / minimum
- **Placeholder:** Guidance text on what to include
- **Validation:** Required, minimum 50 characters
- **Regulatory Note:** "Justification must align with DMP regulations"
- **Regulatory Framework Link:** Link to comprehensive regulatory framework
- **Help Text:** "Include regulatory basis and reasoning for your decision"

### Internal Notes Section
- **Input Type:** Multi-line textarea
- **Label:** "Internal Notes (MOH Only)"
- **Optional:** Not required
- **Visibility:** MOH staff only
- **Purpose:** Internal approval notes

### Action Buttons
- **Cancel:** Secondary button (left-aligned)
  - **Action:** Cancel approval, return to compliance violation detail
- **Approve Action:** Primary button (right-aligned)
  - **Action:** Submit approval decision
  - **Disabled State:** Disabled until all validations pass
- **Layout:** Right-aligned, 16px spacing between buttons

---

## Role-Based Access

### MOH Tier 1
- **Full Access:** Can approve, reject, or take independent action
- **Actions:** Approve Action, Reject, Independent Action

### MOH Tier 2
- **No Access:** Cannot use approval interface (uses analysis interface)
- **View Only:** Can view completed approvals

### Company Users
- **No Access:** This interface is not accessible to company users

---

## State Variations

### Initial State (Empty)
- **Approval Decision:** Not selected (required)
- **Independent Action Fields:** Hidden (shown only if Independent Action selected)
- **Justification:** Empty (required, minimum 50 characters)
- **Approve Button:** Disabled

### Approve Suggested Action State
- **Radio Selected:** "Approve Suggested Action"
- **Independent Action Fields:** Hidden
- **Justification:** Required
- **Approve Button:** Enabled when justification valid

### Reject Suggested Action State
- **Radio Selected:** "Reject Suggested Action"
- **Independent Action Fields:** Hidden
- **Justification:** Required (must explain rejection)
- **Approve Button:** Enabled when justification valid

### Independent Action State
- **Radio Selected:** "Independent Action"
- **Action Type Field:** Visible, required
- **Fine Amount Field:** Visible if Fine selected, required
- **Justification:** Required
- **Approve Button:** Enabled when all fields valid

### Valid State
- **All Fields Valid:** Decision selected, justification meets minimum, action type selected (if independent), fine amount valid (if applicable)
- **Approve Button:** Enabled
- **Visual Indicators:** Green checkmarks on valid fields

### Invalid State
- **Validation Errors:** Red borders on invalid fields
- **Error Messages:** Inline error messages
- **Approve Button:** Disabled
- **Error Types:**
  - Decision not selected
  - Action type not selected (if independent)
  - Fine amount invalid or missing (if Fine selected)
  - Justification too short

### Loading State (After Submit)
- **Approve Button:** Shows loading spinner
- **Form:** Disabled during submission
- **Success:** Navigate to compliance violation detail, show success notification, create enforcement action (if applicable)

---

## Responsive Design

### Desktop (≥1024px)
- **Layout:** Full-width form
- **Sections:** Stacked vertically
- **Inputs:** Full-width inputs

### Tablet (768px - 1023px)
- **Layout:** Stacked sections
- **Inputs:** Full-width inputs

### Mobile (<768px)
- **Layout:** Single column
- **Inputs:** Full-width inputs
- **Buttons:** Full-width, stacked

---

## Interactions

### Click Actions
- **Cancel:** Return to compliance violation detail page
- **Approve Action:** Submit approval decision
- **View Full Analysis:** Expand or navigate to full analysis
- **Radio Selection:** Show/hide conditional fields

### Input Interactions
- **Decision Selection:**
  - Show/hide independent action fields
  - Update form validation requirements
- **Action Type Selection:**
  - Show/hide fine amount field
  - Update validation requirements
- **Fine Amount Input:**
  - Real-time validation
  - Format currency (thousand separators)
- **Justification Input:**
  - Real-time character count
  - Validation on blur

### Keyboard Navigation
- **Tab:** Navigate through form fields
- **Enter:** Submit form (if valid)
- **Escape:** Cancel (close form)
- **Arrow Keys:** Navigate radio buttons

---

## Design System References

### Components Used
- **Form Component:** Approval form (shadcn/ui form)
- **Radio Group Component:** Decision selection (shadcn/ui radio-group)
- **Select Component:** Action type dropdown (shadcn/ui select)
- **Input Component:** Fine amount input (shadcn/ui input)
- **Textarea Component:** Justification, notes inputs (shadcn/ui textarea)
- **Button Component:** Action buttons (shadcn/ui button)
- **Card Component:** Summary, analysis sections (shadcn/ui card)
- **Alert Component:** Regulatory note (shadcn/ui alert)
- **Icon Component:** Action icons (Lucide React via shadcn/ui)

### Design Inspiration References
- **Stripe Dashboard:** https://dashboard.stripe.com - Professional approval patterns
- **GitHub:** https://github.com - Clean forms, validation patterns
- **Linear App:** https://linear.app - Modern approval interfaces, smooth interactions
- **shadcn/ui Components:** https://ui.shadcn.com - Component patterns

### Colors (From Design System)
- **Background:** #ffffff (white) - Clean, professional
- **Input Border:** #d1d5db (border-default) - Default state
- **Input Border Focus:** #3b82f6 (primary-500) - Focus state
- **Input Border Error:** #ef4444 (error-500) - Error state
- **Input Border Valid:** #10b981 (success-500) - Valid state
- **Text Primary:** #111827 (text-primary)
- **Text Secondary:** #6b7280 (text-secondary)
- **Alert Background:** #eff6ff (info background)

### Typography (From Design System)
- **Page Title:** 24px, font-weight: 600, color: #111827
- **Section Title:** 18px, font-weight: 600
- **Label:** 14px, font-weight: 500, color: #6b7280
- **Input Text:** 14px, font-weight: 400
- **Help Text:** 12px, font-weight: 400, color: #6b7280
- **Button Text:** 14px, font-weight: 500

### Spacing (8px Grid System)
- **Page Padding:** 24px (3 × 8px)
- **Section Spacing:** 16px (2 × 8px) between sections
- **Input Padding:** 12px horizontal (1.5 × 8px), 8px vertical (1 × 8px)
- **Button Padding:** 12px horizontal (1.5 × 8px), 8px vertical (1 × 8px)
- **Button Spacing:** 16px (2 × 8px) between buttons

### Transitions & Animations
- **Input Focus:** 200ms ease-in-out
- **Validation State Change:** 200ms ease-in-out
- **Button Hover:** 150ms ease-in-out
- **Field Show/Hide:** 200ms ease-in-out (conditional fields)

### Accessibility (WCAG 2.1 AA Compliance)
- **Color Contrast:** Minimum 4.5:1 for text, 3:1 for UI components
- **Focus Indicators:** 2px solid outline, #3b82f6 (primary-500), 2px offset
- **Keyboard Navigation:** Full keyboard support (Tab, Enter, Escape, Arrow keys)
- **Screen Reader Support:** ARIA labels, roles, and descriptions
- **ARIA Labels:** Descriptive labels for all inputs and buttons
- **Error Announcements:** ARIA live regions for validation errors
- **Required Fields:** Clear indication (asterisk, label, or both)
- **Radio Groups:** Proper ARIA grouping for radio buttons

---

## Industry Best Practices Implementation

### Performance Optimizations
- **Conditional Rendering:** Show independent action fields only when selected
- **Debounced Validation:** Debounce validation checks (300ms)
- **Lazy Loading:** Load analysis details on demand

### State Management
- **Form State:** Track all input values, validation status
- **Validation State:** Track field-level and form-level validation
- **Decision State:** Track selected decision option

### Error Handling
- **Input Validation:** Real-time validation with clear error messages
- **Submission Errors:** Display error message if submission fails
- **Retry Logic:** Allow retry on submission failure

---

## Related Documents

- [Routing Structure](../../../../02-architecture/frontend/routing-structure.md) - Route: `/vci/compliance-violations/[id]/approve`
- [Regulatory Framework](../../../../03-governance/regulatory-framework.md) - Comprehensive regulatory reference including DMP regulations
- [Compliance Requirements](../../../../03-governance/compliance-requirements.md) - Detailed compliance requirements including compliance violation approval requirements
- [Regulatory Policies](../../../../03-governance/regulatory-policies.md) - Regulatory policies including enforcement and approval policies
- [Form Design Patterns](../../../../02-architecture/frontend/form-design-patterns.md) - Form validation, conditional fields
- [UI Component Specifications](../../../../02-architecture/frontend/ui-component-specifications.md) - Form, Radio, Select components
- [Role-Based UI Patterns](../../../../02-architecture/frontend/role-based-ui-patterns.md) - Role-based access

---

## Related Wireframes

- [Compliance Violation Detail](task-0.5.3.15-compliance-violation-detail.md) - Compliance violation detail page
- [Compliance Violation Analysis Interface](task-0.5.3.16-compliance-violation-analysis-interface.md) - Tier 2 analysis form
- [Enforcement Action Detail](../../../01-rmm/enforcement/task-0.5.2.1a-enforcement-action-detail.md) - Enforcement action created from approval

---

**Next:** [Governance Dashboard](../overview/task-0.5.3.18-governance-dashboard.md)

