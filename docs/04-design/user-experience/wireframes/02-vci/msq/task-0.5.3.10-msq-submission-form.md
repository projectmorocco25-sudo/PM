# Task 0.5.3.10: MSQ Submission Form Wireframe

**Status:** ✅ Complete  
**Route:** `/vci/submissions/msq/new` (create) or `/vci/submissions/msq/[id]/edit` (edit draft)  
**File:** `task-0.5.3.10-msq-submission-form.png`  
**Priority:** 🟡 Supporting VCI & RMM

**Design Approach:** Simplified data entry form with SKU_ID + Quantity structure only. Professional, accessible, and optimized for monthly regulatory compliance submissions with bulk data entry capabilities.

---

## Wireframe Layout

```
┌─────────────────────────────────────────────────────────────┐
│ Home > VCI > MSQ > New Submission                          │
│                                                             │
│ MSQ Submission - January 2025                               │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Submission Information                                   ││
│ │                                                          ││
│ │ Year: [2025 ▼]                                           ││
│ │ Month: [January ▼]                                       ││
│ │ Company: [ABC Pharmaceuticals Inc.] (auto-filled)       ││
│ │ Status: Draft                                            ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Sales Data Entry                                          ││
│ │                                                          ││
│ │ [Import CSV] [Export CSV] [Add SKU] [Clear All]        ││
│ │                                                          ││
│ │ ┌────────────────────────────────────────────────────┐ ││
│ │ │ SKU        │ Product Description    │ Quantity      ││
│ │ │            │ (Name/Dosage/Form)     │ (units)       ││
│ │ ├────────────┼────────────────────────┼───────────────┤│
│ │ │ SKU001     │ Product A / 500mg /   │ [        ]    ││
│ │ │            │ Tablet                │               ││
│ │ ├────────────┼────────────────────────┼───────────────┤│
│ │ │ SKU002     │ Product B / 250mg /   │ [        ]    ││
│ │ │            │ Capsule               │               ││
│ │ ├────────────┼────────────────────────┼───────────────┤│
│ │ │ SKU003     │ Product C / 100mg /   │ [        ]    ││
│ │ │            │ Syrup                  │               ││
│ │ └────────────┴────────────────────────┴───────────────┘│
│ │                                                          ││
│ │ ℹ️ Enter quantity sold for each SKU for this month.     ││
│ │    All fields are required before submission.           ││
│ │                                                          ││
│ │ Validation Status: 2 of 3 SKUs complete                 ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Submission Actions                                       ││
│ │                                                          ││
│ │ [Save Draft] [Validate] [Submit]                        ││
│ │                                                          ││
│ │ ℹ️ Deadline: End of month (January 31, 2025)             ││
│ │    7-day grace period for corrections after submission. ││
│ │    [View Regulatory Framework]                          ││
│ └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

---

## Component Specifications

### Page Header
- **Breadcrumbs:** "Home > VCI > MSQ > New Submission" or "Home > VCI > MSQ > Edit Submission"
- **Title:** "MSQ Submission - [Month] [Year]"
  - **Typography:** 24px, font-weight: 600, color: #111827
- **Actions (Right-aligned):**
  - **Save Draft Button:** Secondary button (always available)
  - **Validate Button:** Secondary button (validates all fields)
  - **Submit Button:** Primary button (disabled until all fields valid)

### Submission Information Section
- **Year:** Dropdown (current year and past years)
- **Month:** Dropdown (January through December)
- **Company:** Auto-filled from user's company (read-only)
- **Status:** Badge showing current status (Draft, Submitted, etc.)
- **Layout:** Card with key-value pairs

### Sales Data Entry Table
- **Layout:** Full-width table with horizontal scroll for mobile
- **Columns:**
  1. **SKU:** SKU code/identifier (text, read-only after selection)
  2. **Product Description:** Product Name / Dosage / Form (read-only, from SKU)
  3. **Quantity:** Quantity input field (number, required, units)
- **Row Features:**
  - **Add SKU Button:** Opens SKU selector modal/dropdown
  - **Remove Row:** Delete button per row (if draft)
  - **Row Validation:** Visual indicator (green checkmark when complete, red border if incomplete)
- **Table Actions:**
  - **Import CSV:** Upload CSV file to populate table (format: SKU_ID, Quantity)
  - **Export CSV:** Download current table data as CSV
  - **Add SKU:** Add new row with SKU selector
  - **Clear All:** Clear all data (with confirmation)

### Quantity Input Field
- **Type:** Number input
- **Placeholder:** "Enter quantity"
- **Validation:**
  - Required (cannot be empty)
  - Must be non-negative number
  - Decimal values allowed (for partial units if applicable)
- **Format:** Numeric with thousand separators on display
- **Unit Display:** "(units)" label below input

### Validation Status Indicator
- **Display:** Below table
- **Format:** "X of Y SKUs complete"
- **Visual:** Progress indicator or text
- **Color Coding:**
  - Green: All complete
  - Yellow: Partial completion
  - Red: Incomplete

---

## Form Validation

### Field-Level Validation
- **SKU:** Required, must be valid SKU from company's product catalog
  - **Error States:**
    - "SKU not found" - Invalid SKU code entered
    - "SKU not in your catalog" - SKU belongs to different company
    - "Duplicate SKU" - SKU already added to submission
    - "SKU is inactive" - SKU status is inactive
- **Quantity:** Required, must be non-negative number
  - **Error States:**
    - "Quantity required" - Empty field
    - "Invalid quantity" - Non-numeric value
    - "Quantity must be 0 or greater" - Negative value

### Form-Level Validation
- **All SKUs:** At least one SKU must be entered
  - **Error State:** "At least one SKU is required"
- **All Quantities:** All entered SKUs must have quantity values
  - **Error State:** "All SKUs must have quantity values"
- **No Duplicates:** Cannot have duplicate SKU entries
  - **Error State:** "Duplicate SKUs found - please remove duplicates"

### Submission Validation
- **Pre-submit Check:** All fields must be valid
- **Anomaly Detection:** System checks for unusual patterns (e.g., significant deviations from previous months)
- **Validation Flags:** System may flag submissions for review if anomalies detected

---

## State Variations

### Empty State (No SKUs Added)
- **Message:** "No SKUs added yet"
- **Subtext:** "Click 'Add SKU' to start entering sales data"
- **Action Button:** "Add SKU"

### Draft State
- **Save Draft:** Available at all times
- **Edit:** All fields editable
- **Delete:** Can remove rows

### Validated State
- **Visual Indicator:** Green checkmark on validated rows
- **Submit Button:** Enabled
- **Validation Summary:** Shows validation results

### Submitted State
- **Read-Only:** Form becomes read-only after submission
- **Correction Available:** "Correct" button appears (within 7-day grace period)
- **Status Badge:** Shows submission status

---

## Role-Based Access

### Company Users
- **Create:** Can create new MSQ submissions
- **Edit:** Can edit draft submissions
- **Submit:** Can submit completed forms
- **Correct:** Can correct submissions within 7-day grace period

### MOH Users
- **View:** Can view all submissions (read-only)
- **Review:** Can review flagged submissions
- **No Edit:** Cannot edit company submissions

---

## Business Rules

1. **Data Structure:** SKU_ID + Quantity only (simplified compared to AAMS)
2. **Submission Deadline:** End of each month
3. **Grace Period:** 7 days after submission for corrections
4. **Validation:** Automatic anomaly detection on submission
5. **Anomaly Detection:** Flags submissions with unusual patterns for MOH review
6. **Status Flow:**
   - Draft → Submitted
   - Submitted → Flagged for Review (if anomalies)
   - Submitted → Accepted (if valid)
   - Flagged → Accepted/Rejected (after MOH review)

---

## CSV Import/Export

### CSV Format
- **Headers:** SKU_ID, Quantity
- **Example:**
  ```
  SKU_ID,Quantity
  sku-001,15000
  sku-002,8500
  sku-003,12000
  ```

### Import Validation
- **SKU Validation:** Must be valid SKU from company's catalog
- **Quantity Validation:** Must be valid number
- **Duplicate Check:** Duplicate SKUs in CSV are merged (last value wins)

### Export Format
- **Same as Import:** SKU_ID, Quantity columns
- **Includes:** All currently entered data

---

## Related Documents

- [MSQ Submissions List Wireframe](./task-0.5.3.9-msq-submissions-list.md)
- [MSQ Submission Detail Wireframe](./task-0.5.3.11-msq-submission-detail.md)
- [MSQ Correction Interface Wireframe](./task-0.5.3.12-msq-correction-interface.md)
- [AAMS Submission Form Wireframe](../aams/task-0.5.3.2-aams-submission-form.md) - Reference for similar form patterns
- [Data Dictionary](../../../../02-architecture/database/data-dictionary.md) - MSQ submission fields
- [Form Design Patterns](../../../../02-architecture/frontend/form-design-patterns.md)

---

**Last Updated:** 2025-01-15  
**Owner:** Emma (UI/UX + Next.js Frontend Specialist)

