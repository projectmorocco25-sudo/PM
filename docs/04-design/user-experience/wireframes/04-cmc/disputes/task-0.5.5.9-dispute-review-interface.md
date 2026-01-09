# Task 0.5.5.9: Dispute Review Interface Wireframe

**Status:** ✅ Complete  
**Route:** Modal or page from dispute detail  
**File:** `task-0.5.5.9-dispute-review-interface.png`  
**Priority:** 🟡 CMC Module

**Design Approach:** Review interface for Tier 2 to review disputes and Tier 1 to resolve disputes with adjustment notes. Professional, accessible, and optimized for dispute review workflows.

---

## Wireframe Layout

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                   [Modal/Page Overlay]                      │
│                                                             │
│         ┌─────────────────────────────────────────────┐     │
│         │ Review Compliance Dispute                    │     │
│         │                                              │     │
│         │ Dispute: DISP-2025-001                       │     │
│         │ Company: ABC Pharma Inc.                     │     │
│         │ Score: 78/100 (December 2024)                │     │
│         │                                              │     │
│         │ [For Tier 2: Review Interface]              │     │
│         │ ┌─────────────────────────────────────────┐ │     │
│         │ │ Dispute Information                      │ │     │
│         │ │                                          │ │     │
│         │ │ Type: Component Dispute                  │ │     │
│         │ │ Component: Stock Threshold Violations    │ │     │
│         │ │ Component Score: 75/100                  │ │     │
│         │ │                                          │ │     │
│         │ │ Dispute Reason:                          │ │     │
│         │ │ [Full dispute reason text displayed...] │ │     │
│         │ └─────────────────────────────────────────┘ │     │
│         │                                              │     │
│         │ ┌─────────────────────────────────────────┐ │     │
│         │ │ Supporting Evidence                      │ │     │
│         │ │                                          │ │     │
│         │ │ • evidence-001.pdf [View] [Download]    │ │     │
│         │ │ • evidence-002.xlsx [View] [Download]    │ │     │
│         │ └─────────────────────────────────────────┘ │     │
│         │                                              │     │
│         │ ┌─────────────────────────────────────────┐ │     │
│         │ │ Score Analysis                           │ │     │
│         │ │                                          │ │     │
│         │ │ [Score calculation details displayed]   │ │     │
│         │ │ [Component breakdown shown]              │ │     │
│         │ │ [Historical data comparison]             │ │     │
│         │ └─────────────────────────────────────────┘ │     │
│         │                                              │     │
│         │ ┌─────────────────────────────────────────┐ │     │
│         │ │ Review Notes *                           │ │     │
│         │ │                                          │ │     │
│         │ │ [Text Area - Provide review notes...]  │ │     │
│         │ │                                          │ │     │
│         │ │ Character count: 0/1000                    │ │     │
│         │ └─────────────────────────────────────────┘ │     │
│         │                                              │     │
│         │ ┌─────────────────────────────────────────┐ │     │
│         │ │ Recommendation                           │ │     │
│         │ │                                          │ │     │
│         │ │ ○ Dispute has merit - Recommend Tier 1  │ │     │
│         │ │   review                                  │ │     │
│         │ │ ● Dispute lacks merit - Recommend        │ │     │
│         │ │   rejection                                │ │     │
│         │ └─────────────────────────────────────────┘ │     │
│         │                                              │     │
│         │ [Cancel]            [Submit Review]         │     │
│         │                                              │     │
│         │ [For Tier 1: Resolution Interface]        │     │
│         │ ┌─────────────────────────────────────────┐ │     │
│         │ │ Dispute Information                      │ │     │
│         │ │ (Same as Tier 2)                         │ │     │
│         │ └─────────────────────────────────────────┘ │     │
│         │                                              │     │
│         │ ┌─────────────────────────────────────────┐ │     │
│         │ │ Tier 2 Review Notes                      │ │     │
│         │ │                                          │ │     │
│         │ │ Reviewed by: Ahmed Benali (Tier 2)      │ │     │
│         │ │ Reviewed: January 10, 2025               │ │     │
│         │ │                                          │ │     │
│         │ │ [Tier 2 review notes displayed...]     │ │     │
│         │ │                                          │ │     │
│         │ │ Recommendation: Dispute has merit       │ │     │
│         │ └─────────────────────────────────────────┘ │     │
│         │                                              │     │
│         │ ┌─────────────────────────────────────────┐ │     │
│         │ │ Supporting Evidence                      │ │     │
│         │ │ (Same as Tier 2)                         │ │     │
│         │ └─────────────────────────────────────────┘ │     │
│         │                                              │     │
│         │ ┌─────────────────────────────────────────┐ │     │
│         │ │ Score Analysis                           │ │     │
│         │ │ (Same as Tier 2)                         │ │     │
│         │ └─────────────────────────────────────────┘ │     │
│         │                                              │     │
│         │ ┌─────────────────────────────────────────┐ │     │
│         │ │ Resolution Decision *                    │ │     │
│         │ │                                          │ │     │
│         │ │ ○ Uphold Dispute - Adjust score          │ │     │
│         │ │ ● Reject Dispute - Maintain score        │ │     │
│         │ └─────────────────────────────────────────┘ │     │
│         │                                              │     │
│         │ ┌─────────────────────────────────────────┐ │     │
│         │ │ Adjustment Details (if Uphold)          │ │     │
│         │ │                                          │ │     │
│         │ │ Component: Stock Threshold Violations    │ │     │
│         │ │ Original Score: 75/100                   │ │     │
│         │ │ New Score: [Number Input: 0-100]        │ │     │
│         │ │                                          │ │     │
│         │ │ Preview:                                │ │     │
│         │ │ New Total Score: 82/100                  │ │     │
│         │ │ (Automatically calculated)               │ │     │
│         │ └─────────────────────────────────────────┘ │     │
│         │                                              │     │
│         │ ┌─────────────────────────────────────────┐ │     │
│         │ │ Adjustment Notes *                       │ │     │
│         │ │                                          │ │     │
│         │ │ [Text Area - Provide adjustment notes...]│ │     │
│         │ │                                          │ │     │
│         │ │ Character count: 0/1000                    │ │     │
│         │ │                                          │ │     │
│         │ │ Required: Explain the adjustment and     │ │     │
│         │ │ regulatory basis.                        │ │     │
│         │ └─────────────────────────────────────────┘ │     │
│         │                                              │     │
│         │ ┌─────────────────────────────────────────┐ │     │
│         │ │ Resolution Justification * (if Reject)   │ │     │
│         │ │                                          │ │     │
│         │ │ [Text Area - Provide rejection reason...]│ │     │
│         │ │                                          │ │     │
│         │ │ Character count: 0/1000                    │ │     │
│         │ └─────────────────────────────────────────┘ │     │
│         │                                              │     │
│         │ [Cancel]              [Resolve Dispute]     │     │
│         │                                              │     │
│         └─────────────────────────────────────────────┘     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Component Specifications

### Page/Modal Header
- **Title:** "Review Compliance Dispute" (Tier 2) or "Resolve Compliance Dispute" (Tier 1)
  - **Typography:** 20px, font-weight: 600, color: #111827
- **Dispute Context:**
  - **Dispute ID:** "DISP-2025-001"
  - **Company Name:** "ABC Pharma Inc."
  - **Score:** "78/100 (December 2024)"
  - **Typography:** 14px, color: #6b7280
- **Close Button:** X button (top-right corner, if modal)

### Tier 2 Review Interface

#### Dispute Information Section
- **Layout:** Card with key-value pairs
- **Fields:**
  - **Type:** Dispute type (Total Score Dispute, Component Dispute)
  - **Component:** Disputed component name (if component dispute)
  - **Component Score:** Current component score (if component dispute)
  - **Dispute Reason:** Full text of dispute reason
- **Styling:** Read-only text with light background

#### Supporting Evidence Section
- **Layout:** List of uploaded files
- **Each File Shows:**
  - File name (e.g., evidence-001.pdf)
  - Action buttons: [View] [Download]
- **Actions:**
  - **View:** Opens file viewer
  - **Download:** Downloads file
- **Styling:** File list with icons and action buttons

#### Score Analysis Section
- **Layout:** Card with score analysis information
- **Content:**
  - Score calculation details
  - Component breakdown
  - Historical data comparison
  - Related data points
- **Styling:** Analysis card with structured data display

#### Review Notes (Required)
- **Label:** "Review Notes *"
- **Type:** Text area
- **Placeholder:** "Provide detailed review notes..."
- **Character Limit:** 1000 characters
- **Character Count:** Display "X/1000" characters remaining
- **Validation:**
  - Required field
  - Minimum 50 characters
  - Maximum 1000 characters
- **Styling:** Multi-line text area with character counter

#### Recommendation Selection (Required)
- **Label:** "Recommendation"
- **Type:** Radio button group
- **Options:**
  1. **Dispute has merit - Recommend Tier 1 review:** Recommends upholding dispute
  2. **Dispute lacks merit - Recommend rejection:** Recommends rejecting dispute
- **Default:** First option (has merit)
- **Styling:** Radio buttons with labels
- **Validation:** Required field

#### Submit Review Button
- **Action:** Submits review and forwards to Tier 1
- **Disabled State:** Disabled if form is invalid
- **Styling:** Primary button

### Tier 1 Resolution Interface

#### Dispute Information Section
- **Layout:** Same as Tier 2
- **Content:** Same dispute information displayed

#### Tier 2 Review Notes Section
- **Layout:** Card with Tier 2 review information
- **Content:**
  - **Reviewed By:** User name and role (e.g., "Ahmed Benali (Tier 2)")
  - **Reviewed Date:** Review timestamp
  - **Review Notes:** Full text of Tier 2 review notes
  - **Recommendation:** Tier 2 recommendation
- **Styling:** Read-only text with light background

#### Supporting Evidence Section
- **Layout:** Same as Tier 2
- **Content:** Same evidence files displayed

#### Score Analysis Section
- **Layout:** Same as Tier 2
- **Content:** Same score analysis displayed

#### Resolution Decision (Required)
- **Label:** "Resolution Decision *"
- **Type:** Radio button group
- **Options:**
  1. **Uphold Dispute - Adjust score:** Upholds dispute and adjusts score
  2. **Reject Dispute - Maintain score:** Rejects dispute and maintains score
- **Default:** Based on Tier 2 recommendation
- **Styling:** Radio buttons with labels
- **Validation:** Required field

#### Adjustment Details Section (Conditional)
- **Layout:** Card with adjustment input fields
- **Visibility:** Only shown if "Uphold Dispute" selected
- **Fields:**
  - **Component:** Disputed component name (read-only)
  - **Original Score:** Current component score (read-only)
  - **New Score:** Number input (0-100)
  - **Preview:** New total score calculated automatically
- **Validation:**
  - Required if uphold selected
  - Must be between 0 and 100
  - Decimal precision: 2 decimal places
- **Styling:** Number input with validation feedback

#### Adjustment Notes (Conditional)
- **Label:** "Adjustment Notes *"
- **Type:** Text area
- **Visibility:** Only shown if "Uphold Dispute" selected
- **Placeholder:** "Provide detailed adjustment notes..."
- **Character Limit:** 1000 characters
- **Character Count:** Display "X/1000" characters remaining
- **Help Text:** "Required: Explain the adjustment and regulatory basis."
- **Validation:**
  - Required if uphold selected
  - Minimum 50 characters
  - Maximum 1000 characters
- **Styling:** Multi-line text area with character counter

#### Resolution Justification (Conditional)
- **Label:** "Resolution Justification *"
- **Type:** Text area
- **Visibility:** Only shown if "Reject Dispute" selected
- **Placeholder:** "Provide detailed rejection reason..."
- **Character Limit:** 1000 characters
- **Character Count:** Display "X/1000" characters remaining
- **Validation:**
  - Required if reject selected
  - Minimum 50 characters
  - Maximum 1000 characters
- **Styling:** Multi-line text area with character counter

#### Resolve Dispute Button
- **Action:** Submits resolution and closes dispute
- **Disabled State:** Disabled if form is invalid
- **Styling:** Primary button

---

## Role-Based Access

### MOH Tier 2
- **Access:** Can review disputes (cannot resolve)
- **Actions:**
  - View dispute information
  - Review evidence
  - Analyze score
  - Provide review notes
  - Make recommendation
  - Submit review
- **Workflow:** Review → Recommend → Forward to Tier 1

### MOH Tier 1
- **Access:** Can resolve disputes (after Tier 2 review)
- **Actions:**
  - View dispute information
  - View Tier 2 review notes
  - Review evidence
  - Analyze score
  - Make resolution decision
  - Provide adjustment notes (if uphold) or rejection reason (if reject)
  - Resolve dispute
- **Workflow:** Review Tier 2 notes → Decide → Resolve

### Company Users
- **Access:** Cannot review or resolve disputes (view only)
- **View:** Can see dispute status and resolution after resolved

---

## State Variations

### Empty State (Initial)
- **Form:** All fields empty
- **Submit Button:** Disabled
- **Character Count:** "0/1000"
- **Recommendation:** Not selected

### Valid State
- **Form:** All required fields filled
- **Submit Button:** Enabled
- **Character Count:** "X/1000" (within limit)
- **Recommendation/Decision:** Selected

### Invalid State
- **Form:** Required fields missing or invalid
- **Submit Button:** Disabled
- **Error Messages:** Display validation errors
- **Field Highlighting:** Invalid fields highlighted in red

### Loading State (Submitting)
- **Form:** Disabled (cannot edit)
- **Submit Button:** Loading spinner, "Submitting Review..." or "Resolving Dispute..."
- **Cancel Button:** Disabled

### Success State
- **Message:** "Review submitted successfully" or "Dispute resolved successfully"
- **Action:** Closes modal/page and refreshes dispute detail
- **Notification:** Success notification shown
- **Follow-up:** Dispute status updated (Tier 2 Reviewed or Resolved)

### Error State
- **Message:** "Unable to submit review" or "Unable to resolve dispute"
- **Subtext:** Error message details
- **Action Button:** "Retry"
- **Form:** Re-enabled for editing

### Uphold Dispute State (Tier 1)
- **Resolution Decision:** "Uphold Dispute" selected
- **Adjustment Details:** Shown and required
- **Adjustment Notes:** Shown and required
- **Resolution Justification:** Hidden

### Reject Dispute State (Tier 1)
- **Resolution Decision:** "Reject Dispute" selected
- **Adjustment Details:** Hidden
- **Adjustment Notes:** Hidden
- **Resolution Justification:** Shown and required

---

## Business Rules

1. **Role Access:**
   - Only MOH Tier 2 can review disputes
   - Only MOH Tier 1 can resolve disputes
2. **Workflow:** Submitted → Tier 2 Reviewed → Tier 1 Reviewed → Upheld/Rejected
3. **Review Required:** Tier 2 must review before Tier 1 can resolve
4. **Required Fields (Tier 2):**
   - Review Notes (minimum 50 characters)
   - Recommendation
5. **Required Fields (Tier 1 - Uphold):**
   - Resolution Decision
   - New Score (0-100)
   - Adjustment Notes (minimum 50 characters)
6. **Required Fields (Tier 1 - Reject):**
   - Resolution Decision
   - Resolution Justification (minimum 50 characters)
7. **Character Limit:** 1000 characters for notes/justification
8. **Adjustment Calculation:**
   - If component override: New total = Σ (Component Scores × Weights) with adjusted component
   - If total override: New total = input value
9. **Score Adjustment:**
   - Override creates adjustment record
   - Original frozen score remains unchanged
   - Adjustment visible in score adjustments history
10. **Notification:**
    - Companies notified when dispute is resolved
    - If upheld, score adjustment visible to company
11. **Audit Log:** All review and resolution actions logged in audit trail
12. **Status Update:** Dispute status updated after review/resolution
13. **Multiple Reviews:** Can review/resolve only once (status prevents duplicate actions)

---

## Related Documents

- [CMC Overview Wireframe](../overview/task-0.5.5.0-cmc-overview.md)
- [Compliance Disputes List Wireframe](./task-0.5.5.6-compliance-disputes-list.md)
- [Dispute Detail Wireframe](./task-0.5.5.7-dispute-detail.md)
- [Dispute Creation Interface](./task-0.5.5.8-dispute-creation-interface.md)
- [Compliance Score Detail Wireframe](../scores/task-0.5.5.2-compliance-score-detail.md)
- [Routing Structure](../../../02-architecture/frontend/routing-structure.md) - CMC routes
- [Form Design Patterns](../../../02-architecture/frontend/form-design-patterns.md) - Form design patterns
- [Workflow Architecture](../../../02-architecture/workflow-architecture.md) - Compliance Dispute Workflow

---

**Last Updated:** 2025-01-15  
**Owner:** Emma (UI/UX + Next.js Frontend Specialist)  
**Guided by:** Fatima (MOH Regulatory Requirements) & Dr. Samir (Business Process Validation)

