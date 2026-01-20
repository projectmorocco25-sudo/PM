# Task 0.5.3.8: Pending Reversions List Wireframe

**Status:** ✅ Complete  
**Route:** `/vci/thresholds/pending-reversions`  
**File:** `task-0.5.3.8-pending-reversions-list.png`  
**Priority:** 🔴 Critical VCI Workflows

**Design Approach:** Modern list page for viewing all thresholds with pending reversions, with filters, sorting, and quick actions. Professional, accessible, and optimized for MOH Tier 1 and Tier 2 threshold reversion management workflows.

---

## Wireframe Layout

```
┌─────────────────────────────────────────────────────────────┐
│ Home > VCI > Thresholds > Pending Reversions                │
│                                                             │
│ Pending Threshold Reversions              [Export CSV]     │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Search pending reversions...          [🔍] [Filters ▼]││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌──────────┐ ┌───────────────────────────────────────────┐│
│ │ Filters  │ │ Pending Reversions Table                  ││
│ │          │ │                                           ││
│ │ Type     │ │ SKU      Product        Current  Revert To ││
│ │ ☐ All    │ │          Description   Multiplier Multiplier││
│ │ ☑ Auto   │ │          Company       Threshold  Threshold││
│ │   Revert │ │ ──────   ────────────  ────────  ────────││
│ │ ☐ Manual │ │ SKU002   Product B /   1.5x      1.0x     ││
│ │   Review  │ │          250mg /       600       400      ││
│ │          │ │          Capsule       units     units     ││
│ │ Days     │ │          ABC Pharma    (7 days)  (default) ││
│ │ Until    │ │                      [Review]              ││
│ │ ☐ All    │ │                                           ││
│ │ ☑ <7     │ │ SKU003   Product C /   2.0x      1.0x     ││
│ │ ☐ 7-30   │ │          100mg /       800       400      ││
│ │ ☐ >30    │ │          Syrup         units     units     ││
│ │          │ │          XYZ Corp      (12 days) (default) ││
│ │ Company  │ │                      [Review]              ││
│ │ ☐ All    │ │                                           ││
│ │ ☐ ABC    │ │ SKU005   Product E /   1.8x      1.0x     ││
│ │ ☐ XYZ    │ │          200mg /       720       400      ││
│ │          │ │          Tablet        units     units     ││
│ │ [Clear]  │ │          ABC Pharma    (30 days) (default) ││
│ └──────────┘ │                      [View]                ││
│              │                                           ││
│              │ [Load More]                               ││
│              │                                           ││
│              │ ☑ Select All  [Bulk Review] [Export]    ││
│              └───────────────────────────────────────────┘│
│                                                             │
│ ℹ️ Pending Threshold Reversions                           ││
│    Pending reversions are thresholds scheduled to revert. ││
│    Auto-revert thresholds will revert automatically.      ││
│    Manual review thresholds require Tier 1 confirmation.   ││
│                                                             │
│    Regulatory Deadline Tracking (Fatima's Requirement):    ││
│    • Days until reversion shown per threshold             ││
│    • Regulatory impact priority displayed                  ││
│    • Compliance risk level indicated                       ││
│    • Regulatory basis: DMP Art. [X]                        ││
│                                                             │
│    [View Regulatory Framework]                             ││
└─────────────────────────────────────────────────────────────┘
```

---

## Component Specifications

### Page Header
- **Breadcrumbs:** "Home > VCI > Thresholds > Pending Reversions"
- **Title:** "Pending Threshold Reversions"
- **Actions:** Export CSV button
- **Styling:** Standard page header with actions

### Search Bar
- **Position:** Below header
- **Placeholder:** "Search pending reversions..."
- **Icon:** Search icon (left)
- **Filters Button:** Dropdown for advanced filters
- **Styling:** Standard search input with icon

### Filters Sidebar
- **Layout:** Left sidebar (collapsible on mobile)
- **Filter Sections:**
  - **Type Filter:**
    - Checkboxes: All, Auto-Revert, Manual Review
    - Default: All selected
  - **Days Until Reversion Filter:**
    - Checkboxes: All, <7 days, 7-30 days, >30 days
    - Default: All selected
    - Purpose: Filter by urgency
  - **Company Filter:**
    - Multi-select dropdown or checkboxes
    - Shows list of companies with pending reversions
- **Clear Filters Button:** Resets all filters to default
- **Styling:** Standard filter sidebar

### Pending Reversions Table
- **Layout:** Full-width table with horizontal scroll on mobile
- **Columns:**
  1. **SKU:** SKU code/identifier (link to SKU detail)
  2. **Product Description:** Product Name / Dosage / Form (read-only)
  3. **Company:** Company name (link to company detail)
  4. **Current Multiplier:** Current multiplier value (e.g., "1.5x")
  5. **Current Threshold:** Current threshold value with days until reversion (e.g., "600 units (7 days)")
  6. **Revert To Multiplier:** Multiplier to revert to (e.g., "1.0x (default)")
  7. **Revert To Threshold:** Threshold value to revert to (e.g., "400 units")
  8. **Actions:** Review button (Manual Review) or View button (Auto-Revert)
- **Row Features:**
  - **Checkbox:** Select row for bulk actions
  - **Row Hover:** Background color change (#f9fafb)
  - **Row Click:** Navigate to threshold detail or review page
  - **Color Coding:**
    - Red highlight: <7 days until reversion
    - Yellow highlight: 7-30 days until reversion
    - Green highlight: >30 days until reversion
- **Bulk Actions:**
  - **Select All:** Checkbox in table header
  - **Bulk Review:** Review multiple manual review thresholds (Tier 1 only)
  - **Export:** Export selected reversions as CSV
- **Sorting:**
  - Default: Sort by revert_date (earliest first)
  - Sortable columns: Revert Date, Company, SKU
- **Empty State:**
  - Message: "No pending reversions found"
  - Icon: Calendar icon
  - Action: Link to threshold management

### Action Buttons
- **Review (Manual Review Type):**
  - Visible for Tier 1 only
  - Links to reversion review page
  - Primary button style
- **View (Auto-Revert Type):**
  - Visible for Tier 1 and Tier 2
  - Links to threshold detail page
  - Secondary button style
- **Bulk Review:**
  - Visible for Tier 1 only
  - Opens bulk review modal
  - Primary button style

### Compliance Information Banner
- **Display:** Info banner below table (collapsible)
- **Content:**
  - Explanation of pending reversions
  - Difference between auto-revert and manual review
  - Regulatory reference link
- **Styling:** Light blue background (#eff6ff), info icon, dismissible

---

## State Variations

### Empty State
- **No Pending Reversions:**
  - Message: "No pending reversions found"
  - Icon: Calendar icon
  - Action: Link to threshold management
  - Filters: Show "Clear filters" option

### Loading State
- **Loading Data:**
  - Skeleton loaders for table rows
  - Disable filters and actions
  - Message: "Loading pending reversions..."

### Error State
- **Error Loading:**
  - Error message: "Failed to load pending reversions"
  - Retry button
  - Error details (if available)

---

## Input Interactions

### Search
- **Type:** Real-time search filtering
- **Debounce:** 300ms delay
- **Clear:** X button appears when text entered

### Filters
- **Select Filter:** Updates table immediately
- **Clear Filters:** Resets all filters, refreshes table
- **Mobile:** Filters collapse to dropdown

### Table Actions
- **Click Row:** Navigate to threshold detail or review page
- **Click Review:** Navigate to reversion review page (Tier 1 only)
- **Click View:** Navigate to threshold detail page
- **Select Checkbox:** Enables bulk actions
- **Select All:** Selects/deselects all visible rows

### Bulk Actions
- **Bulk Review:**
  - Opens modal with selected thresholds
  - Allows batch review (Tier 1 only)
  - Shows confirmation before processing
- **Export:**
  - Downloads CSV file
  - Includes all selected reversions
  - Shows success toast

---

## Access Control

### Tier 1
- **View Access:** Can view all pending reversions
- **Actions:**
  - Review (Manual Review type)
  - View (Auto-Revert type)
  - Bulk Review
  - Export
- **Audit:** All actions logged

### Tier 2
- **View Access:** Can view all pending reversions (read-only for review)
- **Actions:**
  - View (all types)
  - Export
- **Review Actions:** Not available (Tier 1 only)

### Company Users
- **No Access:** Cannot access this page
- **Redirect:** Redirected to appropriate page

---

## Related Documents

- [Threshold Reversion Review](task-0.5.3.7-threshold-reversion-review.md)
- [Threshold Management](task-0.5.3.4-threshold-management.md)
- [Threshold Modification Modal](task-0.5.3.6-threshold-modification-modal.md)
- [Governance Workflows](../../../../03-governance/governance-workflows.md)
- [Regulatory Policies](../../../../03-governance/regulatory-policies.md)

---

**Last Updated:** 2025-01-15  
**Owner:** UX Design Team

