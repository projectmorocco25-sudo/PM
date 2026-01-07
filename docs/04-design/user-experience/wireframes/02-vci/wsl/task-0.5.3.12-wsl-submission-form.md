# Task 0.5.3.12: WSL Submission Form Wireframe

**Status:** 🟡 In Progress  
**Route:** `/vci/wsl/new` (create) or `/vci/wsl/[id]/edit` (edit draft)  
**File:** `task-0.5.3.12-wsl-submission-form.png`  
**Priority:** 🔴 Critical VCI Workflows

**Design Approach:** Modern data entry form with SKU stock quantity table, validation, and bulk entry capabilities. Professional, accessible, and optimized for weekly compliance monitoring with deadline awareness.

---

## Wireframe Layout

```
┌─────────────────────────────────────────────────────────────┐
│ Home > VCI > WSL > New Submission                          │
│                                                             │
│ WSL Submission - Week Ending [Date]                        │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Submission Information                                   ││
│ │                                                          ││
│ │ Week Ending Date: [2025-01-19 ▼] (Friday required)      ││
│ │ Company: [ABC Pharmaceuticals Inc.] (auto-filled)      ││
│ │ Status: Draft                                           ││
│ │                                                          ││
│ │ Deadline: Friday, January 19, 2025 at 5:00 PM          ││
│ │ Submission Window: Monday-Friday 17:00                 ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Stock Levels Table                                       ││
│ │                                                          ││
│ │ [Import CSV] [Export CSV] [Add SKU] [Clear All]        ││
│ │                                                          ││
│ │ ┌────────────────────────────────────────────────────────────────────────────────────────────────────────────┐ ││
│ │ │ SKU    │ Product Description    │ Threshold │ Stock Qty │ Compliance % │ Replen. Date │ Violation Reason ││
│ │ │        │ (Name/Dosage/Form)     │ (read-only)│ (units)   │ (calculated) │ (DD/MM/YYYY) │ (max 300 chars)  ││
│ │ ├────────┼────────────────────────┼───────────┼───────────┼──────────────┼──────────────┼──────────────────┤│
│ │ │ SKU001 │ Product A / 500mg /   │ 1,234     │ [1,234]   │ 100% ✓      │ -            │ -                ││
│ │ │        │ Tablet                │           │           │              │              │                  ││
│ │ ├────────┼────────────────────────┼───────────┼───────────┼──────────────┼──────────────┼──────────────────┤│
│ │ │ SKU002 │ Product B / 250mg /   │ 600       │ [400]     │ 67% ⚠️       │ [DD/MM/YYYY] │ [Text entry...]  ││
│ │ │        │ Capsule               │           │           │              │              │                  ││
│ │ ├────────┼────────────────────────┼───────────┼───────────┼──────────────┼──────────────┼──────────────────┤│
│ │ │ SKU003 │ Product C / 100mg /   │ 800       │ [800]     │ 100% ✓      │ -            │ -                ││
│ │ │        │ Syrup                 │           │           │              │              │                  ││
│ │ └────────┴────────────────────────┴───────────┴───────────┴──────────────┴──────────────┴──────────────────┘│
│ │                                                          ││
│ │ ℹ️ All SKUs must have stock quantity entered.          ││
│ │    If Threshold Compliance < 100%, Replenishment Date and Compliance Violation Reason are required. ││
│ │    Compliance violation detection runs automatically on submission. ││
│ │                                                          ││
│ │ Validation Status: 3 of 15 SKUs complete              ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Submission Actions                                       ││
│ │                                                          ││
│ │ [Save Draft] [Validate] [Submit]                        ││
│ │                                                          ││
│ │ ℹ️ Deadline: Friday, January 19, 2025 at 5:00 PM      ││
│ │    Late submissions trigger compliance violations.      ││
│ │    [View Regulatory Framework]                          ││
│ └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

---

## Component Specifications

### Page Header
- **Breadcrumbs:** "Home > VCI > WSL > New Submission" or "Home > VCI > WSL > Edit Submission"
- **Title:** "WSL Submission - Week Ending [Date]"
  - **Typography:** 24px, font-weight: 600, color: #111827
- **Actions (Right-aligned):**
  - **Save Draft Button:** Secondary button (always available)
  - **Validate Button:** Secondary button (validates all fields)
  - **Submit Button:** Primary button (disabled until all fields valid)

### Submission Information Section
- **Week Ending Date:** Date picker (Friday required, auto-suggested to current/next Friday)
- **Company:** Auto-filled from user's company (read-only)
- **Status:** Badge showing current status (Draft, Submitted, etc.)
- **Deadline Display:**
  - **Deadline:** Friday date and time (5:00 PM)
  - **Submission Window:** Monday-Friday 17:00
  - **Countdown:** Days/hours until deadline (if before deadline)
- **Layout:** Card with key-value pairs

### Stock Levels Table
- **Layout:** Full-width table
- **Columns:**
  1. **SKU:** SKU code/identifier (text, read-only after selection)
  2. **Product Description:** Product Name / Dosage / Form (read-only, from SKU)
  3. **Threshold:** Threshold value (read-only, displayed from AAMS calculation or threshold management)
  4. **Stock Quantity:** Number input field (required, integer ≥ 0)
  5. **Threshold Compliance %:** Calculated field (Stock Quantity / Threshold × 100), displayed with visual indicator:
     - ✓ Green checkmark if ≥ 100%
     - ⚠️ Orange warning if < 100%
  6. **Replenishment Date:** Date input field (conditional, required if Threshold Compliance < 100%)
     - Format: DD/MM/YYYY
     - Validation: Only future dates allowed
     - Disabled/hidden if Threshold Compliance ≥ 100%
  7. **Compliance Violation Reason:** Text input field (conditional, required if Threshold Compliance < 100%)
     - Maximum: 300 characters
     - Placeholder: "Enter reason for compliance violation..."
     - Character counter: Shows remaining characters (e.g., "250 characters remaining")
     - Disabled/hidden if Threshold Compliance ≥ 100%
- **Row Features:**
  - **Add SKU Button:** Opens SKU selector modal/dropdown
  - **Remove Row:** Delete button per row (if draft)
  - **Row Validation:** Visual indicator (green checkmark when complete, red border if incomplete)
  - **Conditional Field Display:** Replenishment Date and Compliance Violation Reason fields appear/disappear based on Threshold Compliance % calculation
- **Table Actions:**
  - **Import CSV:** Upload CSV file to populate table
  - **Export CSV:** Download current table data as CSV
  - **Add SKU:** Add new row with SKU selector
  - **Clear All:** Clear all data (with confirmation)

### Input Field Specifications
- **Threshold Fields:**
  - **Type:** Read-only text display
  - **Source:** Retrieved from AAMS threshold calculation or threshold management
  - **Format:** Integer with thousand separators (e.g., "1,234")
  - **Styling:** Gray text color to indicate read-only status
- **Stock Quantity Fields:**
  - **Type:** Number input
  - **Placeholder:** Blank (empty by default)
  - **Validation:** Required, must be integer ≥ 0
  - **Format:** Integer (no decimals)
  - **Width:** Sufficient for 4-5 digit numbers
  - **Unit Display:** Show unit_of_measure from selected SKU (e.g., "units", "packs")
  - **Real-time Calculation:** Automatically calculates Threshold Compliance % on input
- **Threshold Compliance % Fields:**
  - **Type:** Calculated read-only display
  - **Calculation:** (Stock Quantity / Threshold) × 100
  - **Format:** Percentage with 0 decimal places (e.g., "100%", "67%")
  - **Visual Indicators:**
    - Green checkmark (✓) if ≥ 100%
    - Orange warning (⚠️) if < 100%
  - **Styling:** Color-coded (green for compliant, orange for non-compliant)
- **Replenishment Date Fields (Conditional):**
  - **Type:** Date picker input
  - **Format:** DD/MM/YYYY
  - **Validation:** 
    - Required if Threshold Compliance < 100%
    - Only future dates allowed (date must be after today)
    - Error message: "Replenishment date must be in the future"
  - **Visibility:** Only shown when Threshold Compliance < 100%
  - **Placeholder:** "DD/MM/YYYY"
- **Compliance Violation Reason Fields (Conditional):**
  - **Type:** Textarea input
  - **Maximum Length:** 300 characters
  - **Validation:**
    - Required if Threshold Compliance < 100%
    - Maximum 300 characters
    - Error message: "Compliance violation reason is required (maximum 300 characters)"
  - **Character Counter:** Display remaining characters (e.g., "250 characters remaining")
  - **Placeholder:** "Enter reason for compliance violation..."
  - **Visibility:** Only shown when Threshold Compliance < 100%

### Validation
- **Real-time Validation:**
  - Field-level: Red border if invalid, green checkmark if valid
  - Row-level: Visual indicator when all required fields filled
  - Table-level: Validation status counter (e.g., "3 of 15 SKUs complete")
  - Threshold Compliance Calculation: Automatically calculated when Stock Quantity changes
  - Conditional Field Display: Replenishment Date and Compliance Violation Reason appear when Threshold Compliance < 100%
- **Submit Validation:**
  - All SKU rows must have stock quantity filled
  - At least one SKU row required
  - Week ending date must be a Friday
  - **For rows with Threshold Compliance < 100%:**
    - Replenishment Date must be filled and must be a future date
    - Compliance Violation Reason must be filled (1-300 characters)
  - All required fields must be completed before submission
  - Submit button disabled until all validations pass
- **Error Messages:**
  - Inline error messages below invalid fields
  - Summary error message at top if validation fails
  - Specific error messages:
    - "Replenishment date is required when stock is below threshold"
    - "Replenishment date must be in the future"
    - "Compliance violation reason is required when stock is below threshold"
    - "Compliance violation reason must not exceed 300 characters"

### Import/Export Functionality

#### Import CSV
- **Button:** "Import CSV" in table actions
- **Modal/Dialog:**
  - File upload input
  - CSV format instructions/example
  - Preview of imported data
  - "Import" and "Cancel" buttons
- **CSV Format:**
  - Headers: SKU, Product Description, Threshold, Stock Quantity, Threshold Compliance %, Replenishment Date, Compliance Violation Reason
  - SKU must match existing SKUs in system
  - Product Description auto-filled from SKU (can be included but ignored)
  - Threshold auto-filled from system (can be included but ignored)
  - Stock Quantity must be integer ≥ 0
  - Threshold Compliance % is calculated automatically (can be included but will be recalculated)
  - Replenishment Date: Optional, format DD/MM/YYYY, must be future date if provided
  - Compliance Violation Reason: Optional, max 300 characters
- **Validation:**
  - Validate CSV format on upload
  - Show errors for invalid rows
  - Allow partial import (valid rows only)
  - Validate conditional fields: If Threshold Compliance < 100%, Replenishment Date and Compliance Violation Reason become required

#### Export CSV
- **Button:** "Export CSV" in table actions
- **Action:** Download CSV file with current table data
- **Format:** Same as import format
- **Includes:** All rows, all stock quantities

### Compliance Violation Detection Notice
- **Display:** Info message in table section
- **Content:**
  - Automatic compliance violation detection on submission
  - Link to compliance violations if violations detected
  - Explanation of conditional fields (Replenishment Date and Compliance Violation Reason required when Threshold Compliance < 100%)
- **Styling:** Info text, link to violations page

---

## Role-Based Access

### Company Users
- **Create:** Can create new WSL submissions (if deadline not passed)
- **Edit:** Can edit draft submissions
- **View:** Can view submitted submissions (read-only)
- **Import/Export:** Full access to CSV import/export

### MOH Users
- **View Only:** Can view all submissions (read-only)
- **No Edit:** Cannot edit company submissions
- **Actions:** Verify, approve, reject (on detail page, not form)

---

## State Variations

### New Submission (Empty)
- **Empty Table:** "No SKUs added yet"
- **Action:** "Add SKU" button prominent
- **Import Option:** "Import CSV" button available
- **Week Ending:** Auto-suggested to current/next Friday

### Draft Submission (In Progress)
- **Partially Filled:** Shows validation status
- **Save Draft:** Available at any time
- **Submit:** Disabled until all validations pass

### Draft Submission (Complete)
- **All Fields Filled:** Validation status shows "All SKUs complete"
- **Submit Button:** Enabled
- **Visual Indicator:** Green checkmark or success message

### Editing Existing Draft
- **Pre-filled Data:** All previously entered data loaded
- **Week Ending:** Read-only (cannot change week)
- **Status:** Shows "Draft" badge
- **Actions:** Save Draft, Validate, Submit

### Deadline Passed
- **Message:** "WSL submission deadline has passed"
- **Actions:** View-only, cannot create new or edit existing
- **Late Submission:** If within grace period, submit button available with warning

### Before Deadline
- **Countdown:** Days/hours until deadline displayed
- **Warning:** Orange badge if < 24 hours remaining
- **Critical:** Red badge if < 6 hours remaining

---

## Responsive Design

### Desktop (≥1024px)
- **Table:** Full-width with all columns visible
- **Actions:** Horizontal button bar

### Tablet (768px - 1023px)
- **Table:** Horizontal scroll if needed
- **SKU/Description:** Fixed columns, quantity scrollable
- **Actions:** Stacked buttons

### Mobile (<768px)
- **Table:** Card-based layout per SKU
- **Actions:** Full-width buttons
- **Import/Export:** Full-width buttons

---

## Interactions

### Click Actions
- **Add SKU:** Open SKU selector modal/dropdown
- **Remove Row:** Delete row (with confirmation if data entered)
- **Import CSV:** Open file upload dialog
- **Export CSV:** Trigger CSV download
- **Save Draft:** Save current state (auto-save optional)
- **Validate:** Run validation and show results
- **Submit:** Submit form (with confirmation)

### Input Interactions
- **Stock Quantity Input:**
  - Real-time validation
  - Format numbers (thousand separators on blur)
  - Auto-calculate Threshold Compliance % on change
  - Show/hide conditional fields (Replenishment Date, Compliance Violation Reason) based on Threshold Compliance %
  - Auto-focus next field (optional)
- **Threshold Compliance % Calculation:**
  - Automatically calculated when Stock Quantity changes
  - Triggers conditional field display/hide
  - Updates visual indicators (✓ or ⚠️)
- **Replenishment Date Input (Conditional):**
  - Date picker restricted to future dates only
  - Format: DD/MM/YYYY
  - Validation: Must be future date
  - Error message if past date selected
- **Compliance Violation Reason Input (Conditional):**
  - Real-time character count
  - Maximum 300 characters enforced
  - Character counter updates as user types
  - Validation on blur
- **SKU Selection:**
  - Searchable dropdown/combobox
  - Auto-fill product description and threshold value
  - Prevent duplicate SKUs
- **Week Ending Date:**
  - Date picker restricted to Fridays
  - Auto-suggest current/next Friday
  - Validation: Must be Friday

### Keyboard Navigation
- **Tab:** Navigate through inputs
- **Enter:** Move to next field or submit (if all valid)
- **Arrow Keys:** Navigate table cells (if implemented)
- **Escape:** Close modals/dropdowns

---

## Design System References

### Components Used
- **Table Component:** Stock levels table (shadcn/ui table)
- **Input Component:** Number inputs for quantities (shadcn/ui input)
- **Date Picker Component:** Week ending date (shadcn/ui date-picker)
- **Button Component:** Action buttons (shadcn/ui button)
- **Badge Component:** Status badges (shadcn/ui badge)
- **Dialog/Modal Component:** SKU selector, import dialog (shadcn/ui dialog)
- **File Upload Component:** CSV import (shadcn/ui input type="file")
- **Alert Component:** Validation messages, deadline info (shadcn/ui alert)
- **Icon Component:** Validation icons, action icons (Lucide React via shadcn/ui)

### Design Inspiration References
- **Stripe Dashboard:** https://dashboard.stripe.com - Professional form patterns, data entry tables
- **GitHub:** https://github.com - Clean forms, validation patterns
- **Linear App:** https://linear.app - Modern data entry, smooth interactions
- **shadcn/ui Components:** https://ui.shadcn.com - Component patterns

### Colors (From Design System)
- **Background:** #ffffff (white) - Clean, professional
- **Table Border:** #e5e7eb (border-default) - Subtle separation
- **Table Row Hover:** #f9fafb (bg-secondary) - Light gray on hover
- **Input Border:** #d1d5db (border-default) - Default state
- **Input Border Focus:** #3b82f6 (primary-500) - Focus state
- **Input Border Error:** #ef4444 (error-500) - Error state
- **Input Border Valid:** #10b981 (success-500) - Valid state
- **Text Primary:** #111827 (text-primary) - High contrast
- **Text Secondary:** #6b7280 (text-secondary)
- **Focus Ring:** #3b82f6 (primary-500), 2px outline

### Typography (From Design System)
- **Page Title:** 24px, font-weight: 600, color: #111827
- **Table Header:** 12px, font-weight: 600, uppercase
- **Table Cell Text:** 14px, font-weight: 400
- **Input Text:** 14px, font-weight: 400
- **Label:** 14px, font-weight: 500, color: #6b7280
- **Validation Message:** 12px, font-weight: 400
- **Button Text:** 14px, font-weight: 500

### Spacing (8px Grid System)
- **Page Padding:** 24px (3 × 8px)
- **Section Spacing:** 16px (2 × 8px) between sections
- **Table Cell Padding:** 12px horizontal (1.5 × 8px), 8px vertical (1 × 8px)
- **Table Row Height:** 48px (6 × 8px) minimum
- **Input Padding:** 12px horizontal (1.5 × 8px), 8px vertical (1 × 8px)
- **Button Padding:** 12px horizontal (1.5 × 8px), 8px vertical (1 × 8px)
- **Button Spacing:** 16px (2 × 8px) between buttons

### Transitions & Animations
- **Input Focus:** 200ms ease-in-out
- **Validation State Change:** 200ms ease-in-out
- **Button Hover:** 150ms ease-in-out
- **Table Row Hover:** 150ms ease-in-out

### Accessibility (WCAG 2.1 AA Compliance)
- **Color Contrast:** Minimum 4.5:1 for text, 3:1 for UI components
- **Focus Indicators:** 2px solid outline, #3b82f6 (primary-500), 2px offset
- **Keyboard Navigation:** Full keyboard support (Tab, Enter, Arrow keys, Escape)
- **Screen Reader Support:** ARIA labels, roles, and descriptions
- **Touch Targets:** Minimum 40px × 40px for all interactive elements
- **ARIA Labels:** Descriptive labels for all inputs and buttons
- **Error Announcements:** ARIA live regions for validation errors
- **Required Fields:** Clear indication (asterisk, label, or both)
- **Table Headers:** Proper table header associations

---

## Industry Best Practices Implementation

### Performance Optimizations
- **Lazy Validation:** Validate only when field changes or on blur
- **Debounced Validation:** Debounce validation checks (300ms)
- **Virtual Scrolling:** For large tables (100+ SKUs), use virtual scrolling
- **CSV Parsing:** Efficient CSV parsing for large files
- **Auto-save:** Optional auto-save draft every 30 seconds

### State Management
- **Form State:** Track all input values, validation status, dirty state
- **Draft State:** Save draft to local storage and server
- **Validation State:** Track field-level and form-level validation
- **Import State:** Track import progress and errors

### Error Handling
- **Input Validation:** Real-time validation with clear error messages
- **CSV Import Errors:** Show detailed error messages for invalid rows
- **Network Errors:** Graceful handling of save/submit failures
- **Retry Logic:** Automatic retry for failed saves with exponential backoff

### Data Persistence
- **Draft Auto-save:** Save draft automatically every 30 seconds
- **Local Storage:** Cache draft in local storage as backup
- **Server Sync:** Sync draft with server on save
- **Recovery:** Restore draft on page reload

---

## Related Documents

- [Routing Structure](../../../../02-architecture/frontend/routing-structure.md) - Route: `/vci/wsl/new` or `/vci/wsl/[id]/edit`
- [Regulatory Framework](../../../../03-governance/regulatory-framework.md) - Comprehensive regulatory reference including DMP regulations
- [Compliance Requirements](../../../../03-governance/compliance-requirements.md) - Detailed compliance requirements including WSL submission requirements
- [Regulatory Policies](../../../../03-governance/regulatory-policies.md) - Regulatory policies including submission policies
- [Form Design Patterns](../../../../02-architecture/frontend/form-design-patterns.md) - Form validation, data entry patterns
- [UI Component Specifications](../../../../02-architecture/frontend/ui-component-specifications.md) - Table, Input, Button components
- [Role-Based UI Patterns](../../../../02-architecture/frontend/role-based-ui-patterns.md) - Role-based access

---

## Related Wireframes

- [WSL Submissions List](task-0.5.3.11-wsl-submissions-list.md) - Submissions list page
- [WSL Submission Detail](task-0.5.3.13-wsl-submission-detail.md) - Submission detail page
- [Compliance Violations List](../breaches/task-0.5.3.14-compliance-violations-list.md) - Compliance violations triggered by WSL
- [VCI Overview](../overview/task-0.5.3.0-vci-overview.md) - VCI module overview

---

## CSV Import/Export Format

### CSV Format Specification

**Headers (required):**
```
SKU,Product Description,Threshold,Stock Quantity,Threshold Compliance %,Replenishment Date,Compliance Violation Reason
```

**Example Rows:**
```
SKU001,Product A / 500mg / Tablet,1234,1234,100%,,
SKU002,Product B / 250mg / Capsule,600,400,67%,25/01/2025,Stock replenishment delayed due to supplier delay
```

**Rules:**
- SKU must match existing SKU in system
- Product Description is auto-filled from SKU (can be included but ignored)
- Threshold is auto-filled from system (can be included but ignored)
- Stock Quantity must be integer ≥ 0
- Threshold Compliance % is calculated automatically (can be included but will be recalculated)
- Replenishment Date: Required if Threshold Compliance < 100%, format DD/MM/YYYY, must be future date
- Compliance Violation Reason: Required if Threshold Compliance < 100%, max 300 characters
- Empty values: Replenishment Date and Compliance Violation Reason can be empty if Threshold Compliance ≥ 100%

**Export Format:**
- Same as import format
- All rows from current submission
- Includes all SKUs with all fields (Threshold, Stock Quantity, Threshold Compliance %, Replenishment Date, Compliance Violation Reason)

---

**Next:** [WSL Submission Detail](task-0.5.3.13-wsl-submission-detail.md)

