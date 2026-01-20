# Task 0.5.3.2: AAMS Submission Form Wireframe

**Status:** ✅ Complete  
**Route:** `/vci/aams/new` (create) or `/vci/aams/[id]/edit` (edit draft)  
**File:** `task-0.5.3.2-aams-submission-form.png`  
**Priority:** 🔴 Critical VCI Workflows

**Design Approach:** Modern data entry form with monthly sales table, calculated AAMS values, and validation. Professional, accessible, and optimized for annual regulatory compliance submissions with bulk data entry and import/export capabilities.

---

## Wireframe Layout

```
┌─────────────────────────────────────────────────────────────┐
│ Home > VCI > AAMS > New Submission                          │
│                                                             │
│ AAMS Submission - 2025                                      │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Submission Information                                   ││
│ │                                                          ││
│ │ Year: [2025 ▼] (read-only for existing submissions)    ││
│ │ Company: [ABC Pharmaceuticals Inc.] (auto-filled)      ││
│ │ Status: Draft                                           ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Sales Data Table                                         ││
│ │                                                          ││
│ │ [Import CSV] [Export CSV] [Add SKU] [Clear All]        ││
│ │                                                          ││
│ │ ┌────────────────────────────────────────────────────┐ ││
│ │ │ SKU    │ Product Description    │ Jan │ Feb │ ... │ Dec │ AAMS ││
│ │ │        │ (Name/Dosage/Form)     │     │     │     │     │ (calc)││
│ │ ├────────┼────────────────────────┼─────┼─────┼─────┼─────┼───────┤│
│ │ │ SKU001 │ Product A / 500mg /   │ [ ] │ [ ] │ ... │ [ ] │ 0     ││
│ │ │        │ Tablet                │     │     │     │     │       ││
│ │ ├────────┼────────────────────────┼─────┼─────┼─────┼─────┼───────┤│
│ │ │ SKU002 │ Product B / 250mg /   │ [ ] │ [ ] │ ... │ [ ] │ 0     ││
│ │ │        │ Capsule               │     │     │     │     │       ││
│ │ ├────────┼────────────────────────┼─────┼─────┼─────┼─────┼─────┤│
│ │ │ SKU003 │ Product C / 100mg /   │ [ ] │ [ ] │ ... │ [ ] │ 0     ││
│ │ │        │ Syrup                 │     │     │     │     │       ││
│ │ └────────┴────────────────────────┴─────┴─────┴─────┴─────┴─────┘│
│ │                                                          ││
│ │ ℹ️ All fields must be filled before submission.         ││
│ │    AAMS is automatically calculated from 12 months.     ││
│ │                                                          ││
│ │ Validation Status: 2 of 3 SKUs complete                ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Submission Actions                                       ││
│ │                                                          ││
│ │ [Save Draft] [Validate] [Submit]                        ││
│ │                                                          ││
│ │ ℹ️ Annual Submission Deadline                            ││
│ │    Deadline: January 31, 2025 (15 days remaining)       ││
│ │    Grace Period: Until February 15, 2025 (30 days total)││
│ │    Regulatory Basis (Fatima's Requirement):             ││
│ │    DMP Regulation Article 12 - Annual Registry Submission││
│ │    Late Submission Penalties: [Link to penalties]       ││
│ │    [View Regulatory Framework]                          ││
│ └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

---

## Component Specifications

### Page Header
- **Breadcrumbs:** "Home > VCI > AAMS > New Submission" or "Home > VCI > AAMS > Edit Submission"
- **Title:** "AAMS Submission - [Year]"
  - **Typography:** 24px, font-weight: 600, color: #111827
- **Actions (Right-aligned):**
  - **Save Draft Button:** Secondary button (always available)
  - **Validate Button:** Secondary button (validates all fields)
  - **Submit Button:** Primary button (disabled until all fields valid)

### Submission Information Section
- **Year:** Dropdown (read-only for existing submissions, editable for new)
- **Company:** Auto-filled from user's company (read-only)
- **Status:** Badge showing current status (Draft, Submitted, etc.)
- **Layout:** Card with key-value pairs

### Sales Data Table
- **Layout:** Full-width table with horizontal scroll for months
- **Columns:**
  1. **SKU:** SKU code/identifier (text, read-only after selection)
  2. **Product Description:** Product Name / Dosage / Form (read-only, from SKU)
  3. **Jan through Dec:** Quantity input fields (number, required)
  4. **AAMS:** Calculated field (read-only, sum of 12 months)
- **Row Features:**
  - **Add SKU Button:** Opens SKU selector modal/dropdown
  - **Remove Row:** Delete button per row (if draft)
  - **Row Validation:** Visual indicator (green checkmark when complete, red border if incomplete)
- **Table Actions:**
  - **Import CSV:** Upload CSV file to populate table
  - **Export CSV:** Download current table data as CSV
  - **Add SKU:** Add new row with SKU selector
  - **Clear All:** Clear all data (with confirmation)

### Input Field Specifications
- **Monthly Quantity Fields:**
  - **Type:** Number input
  - **Placeholder:** Blank (empty by default)
  - **Validation:** Required, must be number ≥ 0
  - **Format:** Integer (no decimals)
  - **Width:** Sufficient for 4-5 digit numbers
- **AAMS Calculated Field:**
  - **Type:** Read-only number display
  - **Calculation:** Sum of Jan + Feb + ... + Dec
  - **Format:** Integer with thousand separators (e.g., "1,234")
  - **Color:** #6b7280 (secondary text) to indicate read-only

### Validation
- **Real-time Validation:**
  - Field-level: Red border if invalid, green checkmark if valid
  - Row-level: Visual indicator when all months filled
  - Table-level: Validation status counter (e.g., "2 of 3 SKUs complete")
- **Submit Validation:**
  - All SKU rows must have all 12 months filled
  - At least one SKU row required
  - Submit button disabled until all validations pass
- **SKU Validation:**
  - SKU must exist in company's product catalog
  - SKU must be active (not inactive/archived)
  - No duplicate SKUs in submission
  - **Error States:**
    - "SKU not found" - Invalid SKU code entered
    - "SKU not in your catalog" - SKU belongs to different company
    - "Duplicate SKU" - SKU already added to submission
    - "SKU is inactive" - SKU status is inactive
- **Quantity Validation:**
  - All 12 months required (cannot be empty)
  - Must be integer ≥ 0 (no negative values)
  - Must be numeric (no text)
  - **Error States:**
    - "Quantity required" - Empty field
    - "Invalid quantity" - Non-numeric value
    - "Quantity must be 0 or greater" - Negative value
- **Error Messages:**
  - Inline error messages below invalid fields
  - Summary error message at top if validation fails
  - Row-level error indicators for incomplete/invalid rows

### Import/Export Functionality

#### Import CSV
- **Button:** "Import CSV" in table actions
- **Modal/Dialog:**
  - File upload input
  - CSV format instructions/example
  - Preview of imported data
  - "Import" and "Cancel" buttons
- **CSV Format:**
  - Headers: SKU, Product Description, Jan, Feb, Mar, Apr, May, Jun, Jul, Aug, Sep, Oct, Nov, Dec
  - SKU must match existing SKUs in system
  - Product Description auto-filled from SKU
  - Quantity values must be numbers ≥ 0
- **Validation:**
  - Validate CSV format on upload
  - Show errors for invalid rows
  - Allow partial import (valid rows only)

#### Export CSV
- **Button:** "Export CSV" in table actions
- **Action:** Download CSV file with current table data
- **Format:** Same as import format
- **Includes:** All rows, all months, calculated AAMS values

---

## Role-Based Access

### Company Users
- **Create:** Can create new AAMS submissions (if deadline not passed)
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
- **Year:** Read-only
- **Status:** Shows "Draft" badge
- **Actions:** Save Draft, Validate, Submit

### Deadline Passed
- **Message:** "AAMS submission deadline has passed"
- **Actions:** View-only, cannot create new or edit existing
- **Grace Period:** If within grace period, submit button available with warning

---

## Responsive Design

### Desktop (≥1024px)
- **Table:** Full-width with horizontal scroll for months
- **Columns:** All columns visible
- **Actions:** Horizontal button bar

### Tablet (768px - 1023px)
- **Table:** Horizontal scroll for months
- **SKU/Description:** Fixed columns, months scrollable
- **Actions:** Stacked buttons

### Mobile (<768px)
- **Table:** Card-based layout per SKU
- **Months:** Grid layout (3×4 or 4×3)
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
- **Quantity Input:** 
  - Auto-calculate AAMS on change
  - Real-time validation
  - Format numbers (thousand separators on blur)
- **SKU Selection:**
  - Searchable dropdown/combobox
  - Auto-fill product description
  - Prevent duplicate SKUs

### Keyboard Navigation
- **Tab:** Navigate through inputs
- **Enter:** Move to next field or submit (if all valid)
- **Arrow Keys:** Navigate table cells (if implemented)
- **Escape:** Close modals/dropdowns

---

## Design System References

### Components Used
- **Table Component:** Sales data table (shadcn/ui table)
- **Input Component:** Number inputs for quantities (shadcn/ui input)
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
- **Read-only Text:** #6b7280 (text-secondary) - AAMS calculated field
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
- **AAMS Calculation Update:** Instant (no animation needed)

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
- **Lazy Calculation:** Calculate AAMS only when months change
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

- [Routing Structure](../../../../02-architecture/frontend/routing-structure.md) - Route: `/vci/aams/new` or `/vci/aams/[id]/edit`
- [Regulatory Framework](../../../../03-governance/regulatory-framework.md) - Comprehensive regulatory reference including DMP regulations
- [Compliance Requirements](../../../../03-governance/compliance-requirements.md) - Detailed compliance requirements including AAMS submission requirements
- [Regulatory Policies](../../../../03-governance/regulatory-policies.md) - Regulatory policies including submission policies
- [Form Design Patterns](../../../../02-architecture/frontend/form-design-patterns.md) - Form validation, data entry patterns
- [UI Component Specifications](../../../../02-architecture/frontend/ui-component-specifications.md) - Table, Input, Button components
- [Role-Based UI Patterns](../../../../02-architecture/frontend/role-based-ui-patterns.md) - Role-based access

---

## Related Wireframes

- [AAMS Submissions List](task-0.5.3.1-aams-submissions-list.md) - Submissions list page
- [AAMS Submission Detail](task-0.5.3.3-aams-submission-detail.md) - Submission detail page
- [VCI Overview](../overview/task-0.5.3.0-vci-overview.md) - VCI module overview

---

## CSV Import/Export Format

### CSV Format Specification

**Headers (required):**
```
SKU,Product Description,Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec
```

**Example Row:**
```
SKU001,Product A / 500mg / Tablet,100,120,110,105,115,125,130,120,115,110,105,100
```

**Rules:**
- SKU must match existing SKU in system
- Product Description is auto-filled from SKU (can be included but ignored)
- All month values must be integers ≥ 0
- Empty values are treated as 0
- AAMS is calculated automatically (not included in import)

**Export Format:**
- Same as import format
- Includes calculated AAMS column (read-only in export)
- All rows from current submission

---

**Next:** [AAMS Submission Detail](task-0.5.3.3-aams-submission-detail.md)

