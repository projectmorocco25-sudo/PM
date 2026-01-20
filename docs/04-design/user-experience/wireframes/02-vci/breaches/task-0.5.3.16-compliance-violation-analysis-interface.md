# Task 0.5.3.18: Compliance Violation Analysis Interface Wireframe

**Status:** ✅ Complete  
**Route:** `/vci/compliance-violations/[id]/analyze` (Tier 2 only)  
**File:** `task-0.5.3.16-compliance-violation-analysis-interface.png`  
**Note:** File name uses 0.5.3.16 but task number is 0.5.3.18 per phase-0-5-ui-ux-wireframes.md  
**Priority:** 🔴 Critical VCI Workflows

**Design Approach:** Modern analysis form with action suggestions, comments, and batch analysis capability. Professional, accessible, and optimized for MOH Tier 2 compliance violation analysis workflows.

---

## Wireframe Layout

```
┌─────────────────────────────────────────────────────────────┐
│ Home > VCI > Compliance Violations > [Violation ID] > Analyze │
│                                                             │
│ Analyze Compliance Violation                               │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Violation Summary                                        ││
│ │                                                          ││
│ │ SKU: SKU002 - Product B / 250mg / Capsule              ││
│ │ Company: ABC Pharmaceuticals Inc.                       ││
│ │ Stock Level: 400 units | Threshold: 600 units           ││
│ │ Threshold Compliance: 67% (below threshold)            ││
│ │ Priority: 🔴 High (Critical Medicine)                 ││
│ │ Duration: 3 days                                         ││
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
│ │ Analysis Form                                            ││
│ │                                                          ││
│ │ Suggested Action *                                       ││
│ │                                                          ││
│ │ [Select Action ▼]                                       ││
│ │                                                          ││
│ │ • No Action (Stock will replenish soon)                ││
│ │ • Warning (First violation, minor compliance violation) ││
│ │ • Fine (Repeated violation, significant compliance violation) ││
│ │ • Suspension (Critical medicine, extended compliance violation) ││
│ │                                                          ││
│ │ Regulatory Context (Fatima's Requirement):              ││
│ │ • Regulatory Basis for Violation: DMP Art. [X]         ││
│ │ • Legal Authority for Suggested Actions: DMP Art. [Y]   ││
│ │ • Regulatory Requirement Compliance: [Status]           ││
│ │                                                          ││
│ │ ℹ️ Action suggestions based on:                         ││
│ │   • Compliance violation severity and duration          ││
│ │   • Company compliance history                          ││
│ │   • Critical medicine status                            ││
│ │   • Regulatory requirements                             ││
│ │   [View Regulatory Framework]                          ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Fine Amount (Required if Fine selected)                 ││
│ │                                                          ││
│ │ Amount: [5,000] MAD                                    ││
│ │                                                          ││
│ │ Suggested Amount: 5,000 MAD (based on compliance violation severity) ││
│ │ [Apply Suggestion]                                     ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Analysis Comments *                                      ││
│ │                                                          ││
│ │ [Minimum 50 characters required]                        ││
│ │                                                          ││
│ │ ┌────────────────────────────────────────────────────┐ ││
│ │ │ Enter detailed analysis of this compliance          │ ││
│ │ │ violation. Include assessment of compliance violation severity, │ ││
│ │ │ company response, replenishment timeline, and       │ ││
│ │ │ recommended action justification.                   │ ││
│ │ │                                                      │ ││
│ │ │                                                      │ ││
│ │ └────────────────────────────────────────────────────┘ ││
│ │                                                          ││
│ │ Character count: 0 / 50 minimum                         ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Batch Analysis (Optional)                               ││
│ │                                                          ││
│ │ ☐ Analyze related violations together                  ││
│ │                                                          ││
│ │ If checked, this analysis will apply to:               ││
│ │ • 2 other violations for this SKU                      ││
│ │ • 1 violation for related product                     ││
│ │                                                          ││
│ │ [Select Related Violations]                            ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Internal Notes (MOH Only)                              ││
│ │                                                          ││
│ │ ┌────────────────────────────────────────────────────┐ ││
│ │ │ Internal notes visible only to MOH staff.          │ ││
│ │ │                                                      │ ││
│ │ └────────────────────────────────────────────────────┘ ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ [Cancel]                                    [Submit Analysis]│
└─────────────────────────────────────────────────────────────┘
```

---

## Component Specifications

### Page Header
- **Breadcrumbs:** "Home > VCI > Compliance Violations > [Violation ID] > Analyze"
- **Title:** "Analyze Compliance Violation"
  - **Typography:** 24px, font-weight: 600, color: #111827
- **Actions (Right-aligned):**
  - **Cancel Button:** Secondary button
  - **Submit Analysis Button:** Primary button (disabled until validations pass)

### Violation Summary Section
- **Layout:** Card with key violation information
- **Fields:**
  - **SKU:** SKU code and product description
  - **Company:** Company name
  - **Stock vs Threshold:** Comparison with visual indicator
  - **Threshold Compliance %:** Calculated percentage (Stock / Threshold × 100) with indicator
  - **Priority:** Priority badge with reason
  - **Duration:** Days since detection
  - **Replenishment Date:** Actual date from WSL submission:
    - Format: DD/MM/YYYY (e.g., "25/01/2025")
    - Label: "(From WSL Submission - Company provided)"
    - Read-only: Cannot be edited (from submission)
  - **Compliance Violation Reason:** Company-provided reason from WSL submission:
    - Full text display (up to 300 characters)
    - Label: "(From WSL Submission)"
    - Read-only: Cannot be edited (from submission)
- **Purpose:** Provide context for analysis, including company's stated resolution plan

### Analysis Form Section

#### Suggested Action Field
- **Input Type:** Dropdown/Select
- **Options:**
  - No Action (Stock will replenish soon)
  - Warning (First violation, minor compliance violation)
  - Fine (Repeated violation, significant compliance violation)
  - Suspension (Critical medicine, extended compliance violation)
- **Validation:** Required field
- **Help Text:** Info message explaining basis for suggestions
- **Regulatory Reference:** Link to regulatory framework
- **Suggestion Basis:**
  - Compliance violation severity and duration
  - Company compliance history
  - Critical medicine status
  - Regulatory requirements

#### Fine Amount Field (Conditional)
- **Input Type:** Number input with currency display
- **Label:** "Fine Amount *"
- **Required:** Only if "Fine" is selected
- **Placeholder:** "0"
- **Currency:** MAD (Moroccan Dirham)
- **Suggested Amount:** Display suggested amount with "Apply Suggestion" button
- **Validation:**
  - Required if Fine selected
  - Must be number > 0
  - Maximum limit (if applicable)

#### Analysis Comments Field
- **Input Type:** Multi-line textarea
- **Label:** "Analysis Comments *"
- **Minimum Length:** 50 characters
- **Character Counter:** Shows current count / minimum
- **Placeholder:** Guidance text on what to include
- **Validation:** Required, minimum 50 characters
- **Help Text:** "Include assessment of compliance violation severity, company response, replenishment timeline, and recommended action justification"

#### Batch Analysis Option
- **Input Type:** Checkbox
- **Label:** "Analyze related violations together"
- **Optional:** Not required
- **Functionality:**
  - When checked, shows related violations
  - Allows selection of related violations to analyze together
  - Applies same analysis to selected violations
- **Related Violations Display:**
  - List of related violations with checkboxes
  - Shows violation details (SKU, product, status)
  - "Select All" option

#### Internal Notes Field
- **Input Type:** Multi-line textarea
- **Label:** "Internal Notes (MOH Only)"
- **Optional:** Not required
- **Visibility:** MOH staff only (not visible to companies)
- **Purpose:** Internal analysis notes, not shared with company

### Action Buttons
- **Cancel:** Secondary button (left-aligned)
  - **Action:** Cancel analysis, return to compliance violation detail
- **Submit Analysis:** Primary button (right-aligned)
  - **Action:** Submit analysis for Tier 1 approval
  - **Disabled State:** Disabled until all validations pass
- **Layout:** Right-aligned, 16px spacing between buttons

---

## Role-Based Access

### MOH Tier 2
- **Full Access:** Can analyze violations
- **Actions:** Submit analysis, batch analyze
- **Cannot Approve:** Analysis requires Tier 1 approval

### MOH Tier 1
- **No Access:** Cannot use analysis interface (uses approval interface instead)
- **View Only:** Can view completed analyses

### Company Users
- **No Access:** This interface is not accessible to company users

---

## State Variations

### Initial State (Empty)
- **Suggested Action:** Empty (required)
- **Fine Amount:** Hidden (shown only if Fine selected)
- **Analysis Comments:** Empty (required, minimum 50 characters)
- **Submit Button:** Disabled

### Valid State
- **All Fields Valid:** Action selected, comments meet minimum, fine amount valid (if applicable)
- **Submit Button:** Enabled
- **Visual Indicators:** Green checkmarks on valid fields

### Invalid State
- **Validation Errors:** Red borders on invalid fields
- **Error Messages:** Inline error messages
- **Submit Button:** Disabled
- **Error Types:**
  - Action not selected
  - Fine amount invalid or missing (if Fine selected)
  - Comments too short
  - Required fields missing

### Batch Analysis State
- **Checkbox Checked:** Shows related violations list
- **Violations Selected:** Checkboxes selected
- **Submit Action:** Will analyze all selected violations together

### Loading State (After Submit)
- **Submit Button:** Shows loading spinner
- **Form:** Disabled during submission
- **Success:** Navigate to compliance violation detail, show success notification

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
- **Submit Analysis:** Submit form and navigate to compliance violation detail
- **Apply Suggestion:** Fill fine amount with suggested value
- **Select Related Violations:** Toggle checkboxes for batch analysis

### Input Interactions
- **Action Selection:**
  - Show/hide fine amount field based on selection
  - Update suggestion basis display
- **Fine Amount Input:**
  - Real-time validation
  - Format currency (thousand separators)
- **Comments Input:**
  - Real-time character count
  - Validation on blur
- **Batch Analysis Checkbox:**
  - Show/hide related violations list
  - Update form state

### Keyboard Navigation
- **Tab:** Navigate through form fields
- **Enter:** Submit form (if valid)
- **Escape:** Cancel (close form)
- **Arrow Keys:** Navigate dropdown options

---

## Design System References

### Components Used
- **Form Component:** Analysis form (shadcn/ui form)
- **Select Component:** Action dropdown (shadcn/ui select)
- **Input Component:** Fine amount input (shadcn/ui input)
- **Textarea Component:** Comments, notes inputs (shadcn/ui textarea)
- **Checkbox Component:** Batch analysis, violation selection (shadcn/ui checkbox)
- **Button Component:** Action buttons (shadcn/ui button)
- **Card Component:** Summary section (shadcn/ui card)
- **Alert Component:** Suggestion basis info (shadcn/ui alert)
- **Icon Component:** Action icons (Lucide React via shadcn/ui)

### Design Inspiration References
- **Stripe Dashboard:** https://dashboard.stripe.com - Professional form patterns
- **GitHub:** https://github.com - Clean forms, validation patterns
- **Linear App:** https://linear.app - Modern forms, smooth interactions
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
- **Field Show/Hide:** 200ms ease-in-out (fine amount field)

### Accessibility (WCAG 2.1 AA Compliance)
- **Color Contrast:** Minimum 4.5:1 for text, 3:1 for UI components
- **Focus Indicators:** 2px solid outline, #3b82f6 (primary-500), 2px offset
- **Keyboard Navigation:** Full keyboard support (Tab, Enter, Escape)
- **Screen Reader Support:** ARIA labels, roles, and descriptions
- **ARIA Labels:** Descriptive labels for all inputs and buttons
- **Error Announcements:** ARIA live regions for validation errors
- **Required Fields:** Clear indication (asterisk, label, or both)

---

## Industry Best Practices Implementation

### Performance Optimizations
- **Conditional Rendering:** Show fine amount field only when Fine selected
- **Debounced Validation:** Debounce validation checks (300ms)
- **Lazy Loading:** Load related violations on demand (if batch analysis)

### State Management
- **Form State:** Track all input values, validation status
- **Batch Selection:** Track selected violations for batch analysis
- **Validation State:** Track field-level and form-level validation

### Error Handling
- **Input Validation:** Real-time validation with clear error messages
- **Submission Errors:** Display error message if submission fails
- **Retry Logic:** Allow retry on submission failure

---

## Related Documents

- [Routing Structure](../../../../02-architecture/frontend/routing-structure.md) - Route: `/vci/compliance-violations/[id]/analyze`
- [Regulatory Framework](../../../../03-governance/regulatory-framework.md) - Comprehensive regulatory reference including DMP regulations
- [Compliance Requirements](../../../../03-governance/compliance-requirements.md) - Detailed compliance requirements including compliance violation analysis requirements
- [Regulatory Policies](../../../../03-governance/regulatory-policies.md) - Regulatory policies including enforcement policies
- [Form Design Patterns](../../../../02-architecture/frontend/form-design-patterns.md) - Form validation, conditional fields
- [UI Component Specifications](../../../../02-architecture/frontend/ui-component-specifications.md) - Form, Input, Select components
- [Role-Based UI Patterns](../../../../02-architecture/frontend/role-based-ui-patterns.md) - Role-based access

---

## Related Wireframes

- [Compliance Violation Detail](task-0.5.3.15-compliance-violation-detail.md) - Compliance violation detail page
- [Compliance Violation Action Approval Interface](task-0.5.3.17-compliance-violation-action-approval-interface.md) - Tier 1 approval interface
- [Compliance Violations List](task-0.5.3.14-compliance-violations-list.md) - Violations list page

---

**Next:** [Compliance Violation Action Approval Interface](task-0.5.3.17-compliance-violation-action-approval-interface.md)

