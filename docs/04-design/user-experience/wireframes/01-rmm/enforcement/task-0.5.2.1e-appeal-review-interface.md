# Task 0.5.2.1e: Appeal Review Interface Wireframe

**Status:** ✅ Complete  
**Route:** `/enforcement/actions/[id]/appeal/review` (MOH Tier 1 only)  
**File:** `task-0.5.2.1e-appeal-review-interface.png`  
**Priority:** 🔴 Core RMM Workflows

**Design Approach:** Modern review interface for Tier 1 to review company appeals of enforcement actions. Professional, accessible, and optimized for MOH governance appeal review workflows.

---

## Wireframe Layout

```
┌─────────────────────────────────────────────────────────────┐
│ Home > Enforcement > Actions > ENF-2025-001 > Appeal Review │
│                                                             │
│ Review Appeal - ENF-2025-001                               │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Enforcement Action Summary                              ││
│ │                                                          ││
│ │ Action ID: ENF-2025-001                                 ││
│ │ Type: ⚠️ Warning                                        ││
│ │ Company: ABC Pharmaceuticals Inc.                        ││
│ │ Violation: Submission Non-Compliance                    ││
│ │ Executed: 2 days ago                                    ││
│ │                                                          ││
│ │ Legal Basis (Fatima's Requirement):                      ││
│ │ DMP Regulation Article [X], Section [Y]                ││
│ │ Regulatory Framework Reference: [Citation]             ││
│ │ Justification: [View Full Justification]                ││
│ │ [View Regulatory Framework]                             ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Appeal Information                                      ││
│ │                                                          ││
│ │ Submitted: 1 day ago                                   ││
│ │ Submitted by: Company Admin - John Doe                  ││
│ │ Appeal Deadline: ⏱ 28 days remaining                   ││
│ │ Regulatory Basis: Law No. 09-08 - 30-day appeal window ││
│ │ Appeal Deadline Date: [Date + 30 days from execution]  ││
│ │                                                          ││
│ │ Grounds for Appeal: Technical Error                    ││
│ │                                                          ││
│ │ Detailed Explanation:                                  ││
│ │ "We experienced a system outage during the submission  ││
│ │ period which prevented timely submission. We have        ││
│ │ attached evidence of the outage and subsequent          ││
│ │ submission attempt. We request that this warning be     ││
│ │ reconsidered given the technical circumstances."        ││
│ │                                                          ││
│ │ Supporting Documents:                                   ││
│ │ • system-outage-report.pdf (2.3 MB)                    ││
│ │ • submission-attempt-log.pdf (1.1 MB)                   ││
│ │   [Download All] [View Document]                        ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Review Decision *                                        ││
│ │                                                          ││
│ │ ○ Uphold Enforcement Action                             ││
│ │   Maintain the original enforcement action              ││
│ │                                                          ││
│ │ ○ Uphold with Adjustment Note                           ││
│ │   Maintain action but add adjustment note to record     ││
│ │                                                          ││
│ │ ○ Overturn Enforcement Action                           ││
│ │   Reverse the enforcement action                        ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Review Justification *                                   ││
│ │                                                          ││
│ │ [Minimum 50 characters required]                        ││
│ │                                                          ││
│ │ ┌────────────────────────────────────────────────────┐ ││
│ │ │ Enter detailed justification for your review      │ ││
│ │ │ decision. Include assessment of appeal grounds,   │ ││
│ │ │ supporting evidence review, and regulatory basis  │ ││
│ │ │ for the decision.                                  │ ││
│ │ │                                                     │ ││
│ │ │                                                     │ ││
│ │ └────────────────────────────────────────────────────┘ ││
│ │                                                          ││
│ │ Character count: 0 / 50 minimum                         ││
│ │                                                          ││
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Regulatory Requirement Checklist (Fatima's Requirement) ││
│ │                                                          ││
│ │ ☑ Legal Basis for Appeal Review: DMP Art. [X]          ││
│ │ ☑ Legal Authority Verification: ✓ Verified             ││
│ │ ☑ Regulatory Requirements Met                           ││
│ │ ☑ Compliance Verification Complete                     ││
│ │                                                          ││
│ │ ⚠️ Review decision blocked if regulatory checklist      ││
│ │    incomplete                                            ││
│ │ [View Regulatory Framework]                             ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ │ ℹ️ Justification must align with DMP regulations.   ││
│ │    [View Regulatory Framework]                         ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Adjustment Note (if "Uphold with Adjustment" selected) ││
│ │                                                          ││
│ │ ┌────────────────────────────────────────────────────┐ ││
│ │ │ Enter adjustment note to be added to the record.  │ ││
│ │ │ This note will be visible to the company and       │ ││
│ │ │ preserved in the audit trail.                      │ ││
│ │ │                                                     │ ││
│ │ └────────────────────────────────────────────────────┘ ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Internal Notes (MOH Only)                               ││
│ │                                                          ││
│ │ ┌────────────────────────────────────────────────────┐ ││
│ │ │ Internal notes visible only to MOH staff.          │ ││
│ │ │                                                     │ ││
│ │ └────────────────────────────────────────────────────┘ ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ [Cancel]                                    [Submit Review] │
└─────────────────────────────────────────────────────────────┘
```

---

## Component Specifications

### Page Header
- **Breadcrumbs:** "Home > Enforcement > Actions > [Action ID] > Appeal Review"
- **Title:** "Review Appeal - [Action ID]"
  - **Typography:** 24px, font-weight: 600, color: #111827
- **Actions (Right-aligned):**
  - **Cancel Button:** Secondary button
  - **Submit Review Button:** Primary button (disabled until validations pass)

### Enforcement Action Summary Section
- **Layout:** Card with key enforcement action information
- **Fields:**
  - **Action ID:** Enforcement action identifier
  - **Type:** Action type with icon (⚠️ Warning, 💰 Fine, 🚫 Suspension)
  - **Company:** Company name (link to company detail)
  - **Violation:** Violation type description
  - **Executed:** Execution date
  - **Legal Basis:** Legal basis reference
  - **Justification:** Link to view full justification
- **Purpose:** Provide context for appeal review

### Appeal Information Section
- **Layout:** Card displaying appeal details
- **Fields:**
  - **Submitted:** Appeal submission date and time
  - **Submitted By:** Company user name and role
  - **Appeal Deadline:** Days remaining in 30-day window
  - **Grounds for Appeal:** Selected appeal grounds (Technical Error, Procedural Issue, Factual Inaccuracy, Mitigating Circumstances, Other)
  - **Detailed Explanation:** Full text of company's appeal explanation
  - **Supporting Documents:** List of uploaded documents with download/view options
- **Styling:**
  - **Document List:** List with file names, sizes, and action buttons
  - **Download All:** Button to download all documents as ZIP
  - **View Document:** Button to view document in modal or new tab

### Review Decision Section
- **Input Type:** Radio buttons
- **Options:**
  1. **Uphold Enforcement Action:** Maintain the original enforcement action
  2. **Uphold with Adjustment Note:** Maintain action but add adjustment note to record
  3. **Overturn Enforcement Action:** Reverse the enforcement action
- **Validation:** Required field
- **Help Text:** Explanation of each option
- **Conditional Field:** Adjustment Note field appears if "Uphold with Adjustment Note" selected

### Review Justification Section
- **Input Type:** Multi-line textarea
- **Label:** "Review Justification *"
- **Minimum Length:** 50 characters
- **Character Counter:** Shows current count / minimum
- **Placeholder:** Guidance text on what to include
- **Validation:** Required, minimum 50 characters
- **Regulatory Note:** "Justification must align with DMP regulations"
- **Regulatory Framework Link:** Link to comprehensive regulatory framework
- **Help Text:** "Include assessment of appeal grounds, supporting evidence review, and regulatory basis for the decision"

### Adjustment Note Section (Conditional)
- **Input Type:** Multi-line textarea
- **Label:** "Adjustment Note"
- **Conditional:** Only shown if "Uphold with Adjustment Note" selected
- **Purpose:** Note to be added to enforcement action record
- **Visibility:** Visible to company and preserved in audit trail
- **Validation:** Required if adjustment option selected

### Internal Notes Section
- **Input Type:** Multi-line textarea
- **Label:** "Internal Notes (MOH Only)"
- **Optional:** Not required
- **Visibility:** MOH staff only
- **Purpose:** Internal review notes

### Action Buttons
- **Cancel:** Secondary button (left-aligned)
  - **Action:** Cancel review, return to enforcement action detail
- **Submit Review:** Primary button (right-aligned)
  - **Action:** Submit review decision
  - **Disabled State:** Disabled until all validations pass
- **Layout:** Right-aligned, 16px spacing between buttons

---

## Role-Based Access

### MOH Tier 1
- **Full Access:** Can review all appeals
- **Actions:** Submit Review, Uphold, Overturn, Add Adjustment Note

### MOH Tier 2
- **No Access:** Cannot review appeals (Tier 1 only)

### Company Users
- **No Access:** This interface is not accessible to company users
- **View Only:** Can view appeal status on enforcement action detail page

---

## State Variations

### Initial State (Empty)
- **Review Decision:** Not selected (required)
- **Adjustment Note Field:** Hidden (shown only if adjustment option selected)
- **Justification:** Empty (required, minimum 50 characters)
- **Submit Button:** Disabled

### Uphold Action State
- **Radio Selected:** "Uphold Enforcement Action"
- **Adjustment Note Field:** Hidden
- **Justification:** Required
- **Submit Button:** Enabled when justification valid

### Uphold with Adjustment State
- **Radio Selected:** "Uphold with Adjustment Note"
- **Adjustment Note Field:** Visible, required
- **Justification:** Required
- **Submit Button:** Enabled when all fields valid

### Overturn Action State
- **Radio Selected:** "Overturn Enforcement Action"
- **Adjustment Note Field:** Hidden
- **Justification:** Required (must explain overturn reasoning)
- **Submit Button:** Enabled when justification valid

### Valid State
- **All Fields Valid:** Decision selected, justification meets minimum, adjustment note valid (if applicable)
- **Submit Button:** Enabled
- **Visual Indicators:** Green checkmarks on valid fields

### Invalid State
- **Validation Errors:** Red borders on invalid fields
- **Error Messages:** Inline error messages
- **Submit Button:** Disabled
- **Error Types:**
  - Decision not selected
  - Justification too short
  - Adjustment note missing (if adjustment option selected)

### Loading State (After Submit)
- **Submit Button:** Shows loading spinner
- **Form:** Disabled during submission
- **Success:** Navigate to enforcement action detail, show success notification, update appeal status

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
- **Cancel:** Return to enforcement action detail page
- **Submit Review:** Submit review decision
- **View Full Justification:** Expand or navigate to full justification
- **Download All Documents:** Download all supporting documents as ZIP
- **View Document:** Open document in modal or new tab
- **Radio Selection:** Show/hide conditional fields

### Input Interactions
- **Decision Selection:**
  - Show/hide adjustment note field
  - Update form validation requirements
- **Justification Input:**
  - Real-time character count
  - Validation on blur
- **Adjustment Note Input:**
  - Real-time validation
  - Character limit (if applicable)

### Keyboard Navigation
- **Tab:** Navigate through form fields
- **Enter:** Submit form (if valid)
- **Escape:** Cancel (close form)
- **Arrow Keys:** Navigate radio buttons

---

## Design System References

### Components Used
- **Form Component:** Review form (shadcn/ui form)
- **Radio Group Component:** Decision selection (shadcn/ui radio-group)
- **Textarea Component:** Justification, notes inputs (shadcn/ui textarea)
- **Button Component:** Action buttons (shadcn/ui button)
- **Card Component:** Summary, appeal sections (shadcn/ui card)
- **Alert Component:** Regulatory note (shadcn/ui alert)
- **File List Component:** Supporting documents list (shadcn/ui file-list)
- **Icon Component:** Action icons (Lucide React via shadcn/ui)

### Design Inspiration References
- **Stripe Dashboard:** https://dashboard.stripe.com - Professional review patterns
- **GitHub:** https://github.com - Clean forms, validation patterns
- **Linear App:** https://linear.app - Modern review interfaces, smooth interactions
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
- **Conditional Rendering:** Show adjustment note field only when selected
- **Debounced Validation:** Debounce validation checks (300ms)
- **Lazy Loading:** Load documents on demand
- **Document Preview:** Generate previews for common file types

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

- [Routing Structure](../../../../02-architecture/frontend/routing-structure.md) - Route: `/enforcement/actions/[id]/appeal/review`
- [Regulatory Framework](../../../../03-governance/regulatory-framework.md) - Comprehensive regulatory reference including DMP regulations
- [Compliance Requirements](../../../../03-governance/compliance-requirements.md) - Detailed compliance requirements including appeal review requirements
- [Regulatory Policies](../../../../03-governance/regulatory-policies.md) - Regulatory policies including enforcement and appeal policies
- [Form Design Patterns](../../../../02-architecture/frontend/form-design-patterns.md) - Form validation, conditional fields
- [UI Component Specifications](../../../../02-architecture/frontend/ui-component-specifications.md) - Form, Radio, Textarea components
- [Role-Based UI Patterns](../../../../02-architecture/frontend/role-based-ui-patterns.md) - Role-based access

---

## Related Wireframes

- [Enforcement Action Detail](task-0.5.2.1a-enforcement-action-detail.md) - Enforcement action detail page with appeal section
- [Appeal Submission Form](task-0.5.2.1f-appeal-submission-form.md) - Company appeal submission form
- [Enforcement Actions List](task-0.5.2.1-enforcement-actions-list.md) - Enforcement actions list
- [Pending Approvals](task-0.5.2.1c-pending-approvals.md) - Pending approvals page

---

**Next:** [Enforcement Reports](task-0.5.2.1d-enforcement-reports.md)

