# Task 0.5.3.11: MSQ Submission Detail Page Wireframe

**Status:** ✅ Complete  
**Route:** `/vci/submissions/msq/[id]`  
**File:** `task-0.5.3.11-msq-submission-detail.png`  
**Priority:** 🟡 Supporting VCI & RMM

**Design Approach:** Comprehensive submission detail view with tabs for details, history, and corrections. Professional, accessible, and optimized for monthly regulatory compliance review with validation status indicators and 7-day grace period tracking.

---

## Wireframe Layout

```
┌─────────────────────────────────────────────────────────────┐
│ Home > VCI > MSQ > January 2025 Submission                │
│                                                             │
│ MSQ Submission - January 2025                              │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Status: [Submitted] [✓ Valid]  [Correct] (7 days left)   ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ [Details] [History] [Corrections]                       ││
│ │                                                          ││
│ │ ┌────────────────────────────────────────────────────┐ ││
│ │ │ Submission Information                               ││
│ │ │                                                      ││
│ │ │ Month: January 2025                                 ││
│ │ │ Company: ABC Pharmaceuticals Inc.                  ││
│ │ │ Submitted: January 15, 2025 at 14:30              ││
│ │ │ Submitted By: John Doe (john.doe@abcpharma.com)     ││
│ │ │ Validation Status: ✓ Valid                          ││
│ │ │ Flagged for Review: No                              ││
│ │ └────────────────────────────────────────────────────┘ ││
│ │                                                          ││
│ │ ┌────────────────────────────────────────────────────┐ ││
│ │ │ Sales Data                                           ││
│ │ │                                                      ││
│ │ │ ┌────────────────────────────────────────────────┐ ││
│ │ │ │ SKU        │ Product Description    │ Quantity ││
│ │ │ │            │                        │          ││
│ │ │ │ SKU001     │ Product A / 500mg /   │ 15,000   ││
│ │ │ │            │ Tablet                │ units    ││
│ │ │ │ SKU002     │ Product B / 250mg /   │ 8,500    ││
│ │ │ │            │ Capsule               │ units    ││
│ │ │ │ SKU003     │ Product C / 100mg /   │ 12,000   ││
│ │ │ │            │ Syrup                 │ units    ││
│ │ │ └────────────────────────────────────────────────┘ ││
│ │ │                                                      ││
│ │ │ Total SKUs: 3                                        ││
│ │ │ Total Quantity: 35,500 units                        ││
│ │ └────────────────────────────────────────────────────┘ ││
│ │                                                          ││
│ │ ┌────────────────────────────────────────────────────┐ ││
│ │ │ Validation Results                                   ││
│ │ │                                                      ││
│ │ │ ✓ All quantities validated                            ││
│ │ │ ✓ No anomalies detected                               ││
│ │ │ ✓ Submission accepted                                 ││
│ │ └────────────────────────────────────────────────────┘ ││
│ │                                                          ││
│ │ ┌────────────────────────────────────────────────────┐ ││
│ │ │ Enforcement Actions (if any)                         ││
│ │ │                                                      ││
│ │ │ Enforcement actions related to data quality issues: ││
│ │ │                                                      ││
│ │ │ ⚠️ Warning - ENF-2024-050                           ││
│ │ │   Related to: Data Quality Issue                     ││
│ │ │   Status: Executed  Date: 2 weeks ago                ││
│ │ │   [View Enforcement Action Detail →]                 ││
│ │ │                                                      ││
│ │ │ [View All Enforcement Actions →]                    ││
│ │ └────────────────────────────────────────────────────┘ ││
│ │                                                          ││
│ │ [Export Data] [Print] [Correct] (if within grace period)││
│ └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

---

## Component Specifications

### Page Header
- **Breadcrumbs:** "Home > VCI > MSQ > [Month] [Year] Submission"
- **Title:** "MSQ Submission - [Month] [Year]"
  - **Typography:** 24px, font-weight: 600, color: #111827
- **Status Badge:** Large status badge (Submitted, Flagged, Accepted, Rejected)
- **Validation Badge:** Validation status indicator (✓ Valid, ⚠️ Anomalies, ✗ Invalid)
- **Actions (Right-aligned):**
  - **Correct Button:** Primary button (only if within 7-day grace period)
  - **Export Data Button:** Secondary button
  - **Print Button:** Secondary button

### Status Banner
- **Layout:** Horizontal bar below header
- **Status Badge:** Current workflow status
- **Validation Indicator:** Validation result badge
- **Grace Period Indicator:** Days remaining for correction (if applicable)
- **Color Coding:**
  - Green: Valid and accepted
  - Yellow: Flagged for review
  - Red: Rejected or invalid

### Tab Navigation
- **Tabs:**
  1. **Details:** Submission data and validation results (default)
  2. **History:** Submission history and status changes
  3. **Corrections:** Correction history (if any)
- **Active Tab:** Highlighted with underline
- **Tab Content:** Changes based on selected tab

### Details Tab Content

#### Submission Information Card
- **Fields:**
  - Month and Year
  - Company name
  - Submission date and time
  - Submitted by (user name and email)
  - Validation status
  - Flagged for review (Yes/No)
- **Layout:** Key-value pairs in card

#### Sales Data Table
- **Columns:**
  1. **SKU:** SKU code
  2. **Product Description:** Product name, dosage, form
  3. **Quantity:** Quantity sold (read-only)
- **Summary:**
  - Total SKUs count
  - Total quantity sum
- **Export:** Export button for CSV download

#### Validation Results Card
- **Status Indicators:**
  - ✓ All quantities validated
  - ✓ No anomalies detected
  - ✓ Submission accepted
  - OR
  - ⚠️ Anomalies detected (with details)
  - ✗ Validation errors (with error list)
- **Anomaly Details:** Expandable list of detected anomalies (if any)

### History Tab Content
- **Timeline View:** Chronological list of status changes
- **Entries:**
  - Created (draft)
  - Submitted
  - Validated
  - Flagged (if applicable)
  - Accepted/Rejected
  - Corrected (if applicable)
- **Each Entry Shows:**
  - Date and time
  - Status change
  - User who made change
  - Comments/notes (if any)

### Corrections Tab Content
- **Correction History:** List of corrections made (if any)
- **Each Correction Shows:**
  - Correction date
  - Original values
  - Corrected values
  - Reason for correction
  - User who made correction
- **Empty State:** "No corrections made" (if none)

---

## Role-Based Access

### Company Users
- **View:** Full submission details
- **Actions:**
  - View submission (read-only after submission)
  - Correct submission (within 7-day grace period)
  - Export data
  - Print submission
- **Grace Period:** See countdown and correction button

### MOH Tier 1
- **View:** Full submission details
- **Actions:**
  - View submission
  - Review flagged submissions
  - Accept/reject submissions
  - Export data
  - Print submission
- **Review Interface:** Additional review actions for flagged submissions

### MOH Tier 2
- **View:** Full submission details
- **Actions:**
  - View submission
  - Review flagged submissions
  - Request additional information
  - Export data
  - Print submission

---

## State Variations

### Valid Submission State
- **Status Badge:** Green "Accepted"
- **Validation:** ✓ Valid indicator
- **Actions:** Export, Print available
- **Correction:** Available if within grace period

### Flagged for Review State
- **Status Badge:** Orange "Flagged for Review"
- **Validation:** ⚠️ Anomalies Detected
- **Anomaly Details:** Expandable section showing detected issues
- **MOH Actions:** Review, Accept, Reject buttons

### Rejected State
- **Status Badge:** Red "Rejected"
- **Validation:** ✗ Invalid
- **Error Details:** List of rejection reasons
- **Correction:** Available if within grace period

### Grace Period Active State
- **Visual Indicator:** Green badge "7 days left" or countdown
- **Correct Button:** Enabled and prominent
- **Warning:** Orange badge if < 2 days remaining

### Grace Period Expired State
- **Visual Indicator:** Gray badge "Grace expired"
- **Correct Button:** Disabled or hidden
- **Message:** "Correction window has closed"

---

## Business Rules

1. **Read-Only After Submission:** Submission data cannot be edited after submission (only corrected)
2. **Grace Period:** 7 days after submission for corrections
3. **Validation:** Automatic on submission, results displayed
4. **Anomaly Detection:** Flags unusual patterns for MOH review
5. **Correction Tracking:** All corrections tracked in history
6. **Status Transitions:**
   - Submitted → Flagged (if anomalies)
   - Submitted → Accepted (if valid)
   - Flagged → Accepted/Rejected (after MOH review)

---

## Related Documents

- [MSQ Submissions List Wireframe](./task-0.5.3.9-msq-submissions-list.md)
- [MSQ Submission Form Wireframe](./task-0.5.3.10-msq-submission-form.md)
- [MSQ Correction Interface Wireframe](./task-0.5.3.12-msq-correction-interface.md)
- [AAMS Submission Detail Wireframe](../aams/task-0.5.3.3-aams-submission-detail.md) - Reference for similar detail page patterns
- [Data Dictionary](../../../../02-architecture/database/data-dictionary.md) - MSQ submission fields
- [Routing Structure](../../../../02-architecture/frontend/routing-structure.md) - MSQ routes

---

**Last Updated:** 2025-01-15  
**Owner:** Emma (UI/UX + Next.js Frontend Specialist)

