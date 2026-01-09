# Task 0.5.3.12: MSQ Correction Interface Wireframe

**Status:** ✅ Complete  
**Route:** `/vci/submissions/msq/[id]/correction`  
**File:** `task-0.5.3.12-msq-correction-interface.png`  
**Priority:** 🟡 Supporting VCI & RMM

**Design Approach:** Editable correction interface with grace period countdown, original vs corrected value comparison, and validation. Professional, accessible, and optimized for 7-day grace period corrections with clear change tracking.

---

## Wireframe Layout

```
┌─────────────────────────────────────────────────────────────┐
│ Home > VCI > MSQ > January 2025 Submission > Correction     │
│                                                             │
│ Correct MSQ Submission - January 2025                      │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ ⚠️ Correction Window: 5 days remaining                  ││
│ │    Grace period ends: January 22, 2025 at 23:59        ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Original Submission Information                          ││
│ │                                                          ││
│ │ Month: January 2025                                     ││
│ │ Submitted: January 15, 2025 at 14:30                    ││
│ │ Status: Submitted (Flagged for Review)                  ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Correction Reason                                        ││
│ │                                                          ││
│ │ [Text area for reason...]                                ││
│ │                                                          ││
│ │ ℹ️ Please provide a reason for this correction.         ││
│ │    Minimum 20 characters required.                     ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Sales Data Corrections                                   ││
│ │                                                          ││
│ │ ┌────────────────────────────────────────────────────┐ ││
│ │ │ SKU        │ Product        │ Original │ Corrected ││
│ │ │            │                │          │           ││
│ │ │ SKU001     │ Product A /    │ 15,000   │ [15,500] ││
│ │ │            │ 500mg Tablet   │          │           ││
│ │ │            │                │          │ [Change]  ││
│ │ ├────────────┼────────────────┼──────────┼───────────┤│
│ │ │ SKU002     │ Product B /    │ 8,500    │ [8,500]  ││
│ │ │            │ 250mg Capsule  │          │ (no change)││
│ │ ├────────────┼────────────────┼──────────┼───────────┤│
│ │ │ SKU003     │ Product C /    │ 12,000   │ [11,800] ││
│ │ │            │ 100mg Syrup    │          │           ││
│ │ │            │                │          │ [Change]  ││
│ │ └────────────┴────────────────┴──────────┴───────────┘│
│ │                                                          ││
│ │ Changes Summary:                                         ││
│ │ • SKU001: 15,000 → 15,500 (+500 units)                  ││
│ │ • SKU003: 12,000 → 11,800 (-200 units)                   ││
│ │ • Total change: +300 units                              ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Correction Actions                                       ││
│ │                                                          ││
│ │ [Cancel] [Save Draft] [Submit Correction]               ││
│ │                                                          ││
│ │ ℹ️ After submission, the correction will be reviewed.   ││
│ │    Original submission is preserved for audit.          ││
│ └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

---

## Component Specifications

### Page Header
- **Breadcrumbs:** "Home > VCI > MSQ > [Month] [Year] Submission > Correction"
- **Title:** "Correct MSQ Submission - [Month] [Year]"
  - **Typography:** 24px, font-weight: 600, color: #111827

### Grace Period Banner
- **Display:** Prominent warning banner at top
- **Content:**
  - Days remaining countdown
  - Grace period end date and time
- **Color Coding:**
  - Green: > 3 days remaining
  - Yellow: 1-3 days remaining
  - Red: < 1 day remaining
- **Styling:** Warning background (#fef3c7), bold text

### Original Submission Information Card
- **Fields:**
  - Month and Year
  - Original submission date and time
  - Original status
- **Layout:** Read-only card showing original submission context
- **Purpose:** Provide context for correction

### Correction Reason Section
- **Input:** Multi-line text area
- **Placeholder:** "Enter reason for correction..."
- **Validation:**
  - Required field
  - Minimum 20 characters
  - Maximum 500 characters
- **Helper Text:** Guidance on required format
- **Character Counter:** Shows remaining characters

### Sales Data Corrections Table
- **Layout:** Full-width table with comparison view
- **Columns:**
  1. **SKU:** SKU code (read-only)
  2. **Product:** Product description (read-only)
  3. **Original:** Original quantity value (read-only, grayed out)
  4. **Corrected:** Editable quantity input field
- **Row Features:**
  - **Change Indicator:** Visual indicator if value changed (e.g., "Change" badge)
  - **No Change Indicator:** "No change" text if value unchanged
  - **Highlight:** Highlighted row if value changed
- **Input Validation:**
  - Must be valid number
  - Non-negative
  - Decimal values allowed if applicable

### Changes Summary Section
- **Display:** Below table
- **Content:**
  - List of changed SKUs with old → new values
  - Total change calculation
- **Format:**
  - Bullet list of changes
  - Arrow notation (→) for value changes
  - Plus/minus indicators for increases/decreases
- **Empty State:** "No changes made" if all values unchanged

### Correction Actions
- **Cancel Button:** Secondary button (returns to detail page)
- **Save Draft Button:** Secondary button (saves correction as draft)
- **Submit Correction Button:** Primary button (submits correction)
- **Validation:** Submit button disabled until:
  - Correction reason provided (min 20 chars)
  - At least one value changed OR reason provided
  - All quantity fields valid

---

## State Variations

### Grace Period Active (> 3 days)
- **Banner:** Green/yellow warning
- **Countdown:** Days remaining displayed
- **Submit Button:** Enabled (if valid)

### Grace Period Ending (1-3 days)
- **Banner:** Yellow/orange warning
- **Countdown:** Prominent days/hours remaining
- **Urgency Indicator:** "Correction window closing soon"
- **Submit Button:** Enabled (if valid)

### Grace Period Expiring (< 1 day)
- **Banner:** Red warning
- **Countdown:** Hours/minutes remaining
- **Urgency Indicator:** "Correction window closing soon - submit immediately"
- **Submit Button:** Enabled (if valid)

### Grace Period Expired
- **Banner:** Gray "Grace period expired"
- **Message:** "Correction window has closed. This submission can no longer be corrected."
- **Submit Button:** Disabled
- **Redirect:** Automatic redirect to detail page with message

### No Changes Made
- **Message:** "No changes detected"
- **Submit Button:** Disabled (unless reason provided)
- **Helper Text:** "Make at least one change or provide a reason"

### Validation Errors
- **Error Display:** Inline error messages below fields
- **Submit Button:** Disabled
- **Error Summary:** List of validation errors at top

---

## Role-Based Access

### Company Users
- **Access:** Can correct own company submissions
- **Time Limit:** Only within 7-day grace period
- **Actions:**
  - Edit quantities
  - Provide correction reason
  - Save draft
  - Submit correction

### MOH Users
- **Access:** Cannot correct company submissions
- **View:** Can view correction history (read-only)
- **Review:** Can review submitted corrections

---

## Business Rules

1. **Grace Period:** 7 days after original submission
2. **Correction Tracking:** All corrections tracked with original values preserved
3. **Reason Required:** Correction reason mandatory (min 20 chars)
4. **Change Requirement:** At least one value must change OR reason must be provided
5. **Validation:** Corrected values validated same as original submission
6. **Status:** Correction creates new submission record linked to original
7. **Audit Trail:** Original submission preserved, correction linked via `correction_of` field

---

## Validation Rules

### Correction Reason
- **Required:** Yes
- **Min Length:** 20 characters
- **Max Length:** 500 characters
- **Format:** Plain text

### Quantity Fields
- **Required:** If SKU row is present
- **Type:** Number
- **Min Value:** 0
- **Decimal:** Allowed if applicable
- **Change Detection:** Must differ from original to be considered changed

### Form-Level Validation
- **At Least One Change:** Either quantity changed OR reason provided
- **All Fields Valid:** All quantity fields must be valid numbers
- **No Duplicate SKUs:** Cannot have duplicate SKU entries

---

## User Flow

1. **Access:** User clicks "Correct" button on submission detail page
2. **Grace Period Check:** System checks if within 7-day window
3. **Load Original Data:** Original submission data loaded
4. **Edit Values:** User edits quantities as needed
5. **Provide Reason:** User enters correction reason
6. **Review Changes:** User reviews changes summary
7. **Save Draft (Optional):** User can save as draft
8. **Submit:** User submits correction
9. **Validation:** System validates correction
10. **Confirmation:** User redirected to detail page with success message

---

## Related Documents

- [MSQ Submissions List Wireframe](./task-0.5.3.9-msq-submissions-list.md)
- [MSQ Submission Form Wireframe](./task-0.5.3.10-msq-submission-form.md)
- [MSQ Submission Detail Wireframe](./task-0.5.3.11-msq-submission-detail.md)
- [Data Dictionary](../../../../02-architecture/database/data-dictionary.md) - MSQ submission fields and correction tracking
- [Form Design Patterns](../../../../02-architecture/frontend/form-design-patterns.md)

---

**Last Updated:** 2025-01-15  
**Owner:** Emma (UI/UX + Next.js Frontend Specialist)

