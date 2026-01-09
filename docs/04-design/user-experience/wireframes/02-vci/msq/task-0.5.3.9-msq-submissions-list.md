# Task 0.5.3.9: MSQ Submissions List Page Wireframe

**Status:** ✅ Complete  
**Route:** `/vci/submissions/msq`  
**File:** `task-0.5.3.9-msq-submissions-list.png`  
**Priority:** 🟡 Supporting VCI & RMM

**Design Approach:** Modern submission queue interface with month filters, validation status indicators, and role-based views. Professional, accessible, and optimized for monthly regulatory compliance submissions with 7-day grace period for corrections.

---

## Wireframe Layout

```
┌─────────────────────────────────────────────────────────────┐
│ Home > VCI > MSQ                                              │
│                                                             │
│ My MSQ Submissions (Company) / All MSQ Submissions (MOH)   │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Filters: [All Years ▼] [All Months ▼] [All Status ▼]   ││
│ │          [New Submission]                                ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────────────────────────────────────────┐│
│ │ Month      Year   Status          Validation  Submitted    Flagged    Actions              ││
│ │ ──────     ────   ──────────      ──────────  ─────────   ────────   ──────               ││
│ │ January    2025   Submitted       ✓ Valid     Jan 15      No         [View]              ││
│ │                          (On Time)                        [Edit]                          ││
│ │                                                           [Correct]                       ││
│ │                                                           (7 days left)                   ││
│ │                                                           ││
│ │ December   2024   Flagged for     ⚠️ Anomalies Jan 5       Yes        [View]              ││
│ │            Review                  Detected    (2024)      (Review)   [Review]            ││
│ │                          (Pending)                        Required    [Correct]           ││
│ │                                                           (Grace expired)                 ││
│ │                                                           ││
│ │ November   2024   Accepted        ✓ Valid     Dec 5       No         [View]              ││
│ │                          (Complete)                       (2024)     [Details]           ││
│ │                                                           ││
│ │ October    2024   Rejected        ✗ Invalid   Nov 5       Yes        [View]              ││
│ │                          (Errors)                         (2024)     [Details]           ││
│ │                                                           ││
│ │ [Load More]                                                                              ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ℹ️ Monthly submissions are due by end of month.             ││
│    7-day grace period for corrections after submission.     ││
│    [View Regulatory Framework]                              ││
└─────────────────────────────────────────────────────────────┘
```

---

## Component Specifications

### Page Header
- **Breadcrumbs:** "Home > VCI > MSQ"
- **Title:** "My MSQ Submissions" (Company) or "All MSQ Submissions" (MOH)
  - **Typography:** 24px, font-weight: 600, color: #111827
- **Actions (Right-aligned):**
  - **New Submission Button:** Primary button (Company only)
  - **Spacing:** 16px between actions

### Filters Bar
- **Year Filter:** Dropdown (All Years, 2025, 2024, 2023, etc.)
- **Month Filter:** Dropdown (All Months, January, February, etc.)
- **Status Filter:** Dropdown (All, Submitted, Flagged for Review, Accepted, Rejected)
- **Layout:** Horizontal bar above table, responsive (stacks on mobile)

### Compliance Information Banner
- **Display:** Info banner below filters (collapsible)
- **Content:**
  - Monthly submission deadline: End of month
  - 7-day grace period for corrections
  - Regulatory reference link
- **Styling:** Light blue background (#eff6ff), info icon, dismissible

### Submissions Table
- **Layout:** Full-width table with horizontal scroll on mobile
- **Columns:**
  1. **Month:** Month name (January, February, etc.)
  2. **Year:** Submission year (2025, 2024, etc.)
  3. **Status:** Workflow status with badge
  4. **Validation:** Validation status indicator
  5. **Submitted:** Submission date
  6. **Flagged:** Whether submission is flagged for review (Yes/No badge)
  7. **Actions:** View, Edit (if draft), Correct (if within grace period), Review (MOH)
- **Status Badges:**
  - Submitted: Blue (#3b82f6) - "On Time" or "Late" indicator
  - Flagged for Review: Orange (#f97316) - "Pending Review"
  - Accepted: Green (#10b981) - "Accepted"
  - Rejected: Red (#ef4444) - "Rejected"
- **Validation Indicators:**
  - ✓ Valid: Green checkmark - "Valid"
  - ⚠️ Anomalies Detected: Orange warning - "Anomalies Detected"
  - ✗ Invalid: Red X - "Invalid"
- **Grace Period Indicator:**
  - Shows "7 days left" or "Grace expired" for correction window
  - Only visible for submitted/flagged statuses
- **Row Features:**
  - **Hover:** Background color change (#f9fafb)
  - **Click:** Navigate to submission detail page

---

## Role-Based Access

### Company Users
- **View:** Only own company submissions
- **Title:** "My MSQ Submissions"
- **Actions:**
  - Create new submission
  - Edit draft submissions
  - View submitted submissions
  - Correct submissions (within 7-day grace period)
- **Grace Period Visibility:** See countdown for correction window

### MOH Tier 1
- **View:** All company submissions
- **Title:** "All MSQ Submissions"
- **Actions:**
  - View all submissions
  - Review flagged submissions
  - Accept/reject submissions
  - View validation flags

### MOH Tier 2
- **View:** All company submissions
- **Title:** "All MSQ Submissions"
- **Actions:**
  - View all submissions
  - Review flagged submissions
  - Request additional information

---

## State Variations

### Empty State (No Submissions)
- **Message:** "No MSQ submissions found"
- **Subtext:** "Create your first MSQ submission to get started"
- **Action Button:** "New Submission" (Company only)
- **Visual:** Empty state illustration

### Loading State
- **Skeleton Loaders:** Table rows with skeleton placeholders
- **Filter Loading:** Skeleton for filter dropdowns

### Grace Period Active State
- **Visual Indicator:** Green badge showing days remaining
- **Action Button:** "Correct" button enabled
- **Warning:** Orange badge if grace period expires soon (< 2 days)

### Grace Period Expired State
- **Visual Indicator:** Gray badge "Grace expired"
- **Action Button:** "Correct" button disabled or hidden
- **Message:** "Correction window has closed"

---

## Business Rules

1. **Submission Deadline:** End of each month
2. **Grace Period:** 7 days after submission for corrections
3. **Validation:** Automatic anomaly detection on submission
4. **Flagging:** Submissions with anomalies are flagged for MOH review
5. **Status Transitions:**
   - Submitted → Flagged for Review (if anomalies detected)
   - Submitted → Accepted (if valid)
   - Flagged for Review → Accepted (after MOH review)
   - Flagged for Review → Rejected (after MOH review)
   - Any status → Corrected (within grace period)

---

## Related Documents

- [MSQ Submission Form Wireframe](./task-0.5.3.10-msq-submission-form.md)
- [MSQ Submission Detail Wireframe](./task-0.5.3.11-msq-submission-detail.md)
- [MSQ Correction Interface Wireframe](./task-0.5.3.12-msq-correction-interface.md)
- [Data Dictionary](../../../../02-architecture/database/data-dictionary.md) - MSQ submission fields
- [Routing Structure](../../../../02-architecture/frontend/routing-structure.md) - MSQ routes

---

**Last Updated:** 2025-01-15  
**Owner:** Emma (UI/UX + Next.js Frontend Specialist)

