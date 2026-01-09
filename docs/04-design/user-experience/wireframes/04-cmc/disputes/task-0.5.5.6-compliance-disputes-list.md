# Task 0.5.5.6: Compliance Disputes List Page Wireframe

**Status:** ✅ Complete  
**Route:** `/cmc/disputes`  
**File:** `task-0.5.5.6-compliance-disputes-list.png`  
**Priority:** 🟡 CMC Module

**Design Approach:** Modern list page with compliance disputes table, status filters, date filters, and role-based access. Professional, accessible, and optimized for dispute management workflows.

---

## Wireframe Layout

```
┌─────────────────────────────────────────────────────────────┐
│ Home > CMC > Compliance Disputes                             │
│                                                             │
│ Compliance Disputes                                          │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Filters                                                   ││
│ │                                                          ││
│ │ Status: [All ▼]  Company: [All Companies ▼]            ││
│ │ Date Range: [Last 30 Days ▼]                            ││
│ │ Dispute Type: [All ▼]                                  ││
│ │                                                          ││
│ │ [Apply Filters] [Clear] [Export CSV]                    ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Compliance Disputes Table                                ││
│ │                                                          ││
│ │ [Sort: Date ▼] [Sort: Status ▼] [Sort: Company ▼]     ││
│ │                                                          ││
│ │ ┌──────┬─────────────────────┬────────────┬───────────┐│
│ │ │ ID   │ Company             │ Type       │ Status    ││
│ │ ├──────┼─────────────────────┼────────────┼───────────┤│
│ │ │ DISP-│ ABC Pharma Inc.     │ Component  │ Pending   ││
│ │ │ 2025-│                     │ Dispute    │ Review    ││
│ │ │ 001  │ Score: 78/100       │ (Stock     │ (2 days)  ││
│ │ │      │ Period: Dec 2024    │ Threshold) │           ││
│ │ ├──────┼─────────────────────┼────────────┼───────────┤│
│ │ │ DISP-│ XYZ Medical Corp.   │ Total      │ Tier 2    ││
│ │ │ 2025-│                     │ Score      │ Reviewed  ││
│ │ │ 003  │ Score: 55/100 ⚠     │ Dispute    │ (5 days)  ││
│ │ │      │ Period: Dec 2024    │            │           ││
│ │ ├──────┼─────────────────────┼────────────┼───────────┤│
│ │ │ DISP-│ DEF Healthcare Ltd. │ Component  │ Upheld    ││
│ │ │ 2025-│                     │ Dispute    │           ││
│ │ │ 005  │ Score: 92/100       │ (Critical  │           ││
│ │ │      │ Period: Nov 2024    │ Medicine)  │           ││
│ │ └──────┴─────────────────────┴────────────┴───────────┘│
│ │                                                          ││
│ │ Showing 3 of 15 disputes                                  ││
│ │ [< Previous] [1] [2] [3] ... [2] [Next >]              ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ [For Companies: Create Dispute Button]                      │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ ⏱ Dispute Window: 30 days from score publication        ││
│ │                                                          ││
│ │ [Create Dispute]                                         ││
│ └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

---

## Component Specifications

### Page Header
- **Breadcrumbs:** "Home > CMC > Compliance Disputes"
- **Title:** "Compliance Disputes"
  - **Typography:** 24px, font-weight: 600, color: #111827
- **Actions (Right-aligned):**
  - **Export Button:** Secondary button (export CSV)
  - **Actions Dropdown:** More actions menu
    - Options: Export PDF, Print, Refresh

### Filters Section
- **Layout:** Horizontal filter bar
- **Filters:**
  1. **Status Dropdown:**
     - Options: All, Submitted, Tier 2 Reviewed, Tier 1 Reviewed, Upheld, Rejected
     - Default: All
  2. **Company Dropdown:**
     - Options: All Companies (MOH only), My Company (Company users)
     - Multi-select for MOH users
     - Searchable company list
  3. **Date Range Dropdown:**
     - Options: All, Last 7 Days, Last 30 Days, Last 90 Days, Last Year, Custom Range
     - Default: Last 30 Days
  4. **Dispute Type Dropdown:**
     - Options: All, Total Score Dispute, Component Dispute
     - Default: All
- **Actions:**
  - **Apply Filters:** Primary button
  - **Clear:** Secondary button (reset all filters)
  - **Export CSV:** Secondary button (export filtered results)

### Compliance Disputes Table
- **Layout:** Scrollable table with sortable columns
- **Columns:**
  1. **ID:** Dispute ID (e.g., DISP-2025-001)
     - **Link:** Click to view dispute detail
  2. **Company:** Company name (link to company detail)
  3. **Score Context:**
     - **Score:** Total score with warning icon if below 60
     - **Period:** Score period (e.g., Dec 2024)
  4. **Type:** Dispute type
     - Options: Total Score Dispute, Component Dispute
     - **Component Name:** If component dispute, shows component name in parentheses
  5. **Status:** Dispute status badge
     - Options: Submitted (gray), Tier 2 Reviewed (yellow), Tier 1 Reviewed (blue), Upheld (green), Rejected (red)
     - **Days:** Days since status change (e.g., "2 days")
- **Features:**
  - **Sortable Columns:** Click column header to sort
  - **Pagination:** Shows "Showing X of Y disputes"
  - **Row Count:** Display total count
  - **Row Click:** Click row to view dispute detail
- **Styling:**
  - **Table:** White background with borders
  - **Hover:** Row highlight on hover
  - **Alternating Rows:** Light gray background for even rows
  - **Status Badges:** Color-coded status badges

### Create Dispute Section (Company Users Only)
- **Layout:** Prominent call-to-action card
- **Content:**
  - **Dispute Window Info:** "⏱ Dispute Window: 30 days from score publication"
  - **Note:** Shows remaining time for eligible scores
- **Action:**
  - **Create Dispute Button:** Primary button
    - **Action:** Opens dispute creation interface
    - **Disabled:** If no eligible scores or dispute window expired
- **Styling:** Highlighted card with icon and button

---

## Role-Based Access

### Company Users
- **View:** Own company disputes only
- **Filters:** Limited filters (status, date range, dispute type)
- **Actions:**
  - View Dispute Details
  - Create Dispute (if within 30-day window)
  - Export Own Data
- **Create Dispute Section:** Visible with dispute window info
- **Data:**
  - Cannot see other companies' disputes
  - Can see own dispute status and details

### MOH Tier 1
- **View:** All companies' disputes
- **Filters:** All filters available
- **Table:** Full table with all columns
- **Actions:**
  - View Dispute Details
  - Resolve Disputes (approve/reject)
  - Generate Reports
  - Export Data
- **Data:**
  - Can see all disputes, status, and details
  - Can resolve disputes with adjustment notes

### MOH Tier 2
- **View:** All companies' disputes
- **Filters:** All filters available
- **Table:** Full table with all columns
- **Actions:**
  - View Dispute Details
  - Review Disputes (flag for Tier 1)
  - Generate Reports (read-only)
  - Export Data
- **Data:**
  - Can see all disputes, status, and details
  - Can review disputes but cannot resolve (Tier 1 only)

---

## State Variations

### Empty State (No Data)
- **Message:** "No disputes found"
- **Subtext:** "Disputes will appear here once submitted"
- **Action Button:** "Create Dispute" (if applicable, Company users)

### Loading State
- **Skeleton Loaders:** Table with skeleton rows
- **Filters:** Skeleton filter placeholders

### Error State
- **Message:** "Unable to load disputes"
- **Subtext:** Error message details
- **Action Button:** "Retry"

### No Results (Filtered)
- **Message:** "No disputes match your filters"
- **Subtext:** "Try adjusting your filters to see more results"
- **Action Button:** "Clear Filters"

### Module Inactive State
- **Message:** "CMC module is not active"
- **Subtext:** "Contact MOH Tier 1 to activate the CMC module"
- **Visual:** Inactive module indicator
- **Note:** Historical data may still be accessible if `has_historical_cmc_data()` returns true

---

## Business Rules

1. **Module Status:** CMC is optional (license-controlled)
2. **Module Activation Check:** Routes check `is_module_active('cmc')` for active module, or `has_historical_cmc_data()` for historical data access
3. **Dispute Window:** Companies have 30 days from score publication to submit disputes
4. **Dispute Types:**
   - **Total Score Dispute:** Disputes the total score
   - **Component Dispute:** Disputes a specific component score
5. **Status Workflow:** Submitted → Tier 2 Reviewed → Tier 1 Reviewed → Upheld/Rejected
6. **Role-Based Access:** Companies see own disputes only, MOH sees all disputes
7. **Filtering:** Default to last 30 days, can filter by status, company, date range, dispute type
8. **Sorting:** Default sort by date (descending) or status (ascending)
9. **Pagination:** 20 disputes per page (configurable)
10. **Export:** Export filtered results to CSV (includes all columns based on role)
11. **Status Badges:** Color-coded based on status (gray, yellow, blue, green, red)
12. **Days Display:** Shows days since last status change
13. **Warning Indicator:** Scores below 60 show warning icon (⚠️)
14. **Create Dispute:** Only available for companies within 30-day window for published scores

---

## Related Documents

- [CMC Overview Wireframe](../overview/task-0.5.5.0-cmc-overview.md)
- [Compliance Disputes Detail Wireframe](./task-0.5.5.7-dispute-detail.md)
- [Dispute Creation Interface](./task-0.5.5.8-dispute-creation-interface.md)
- [Dispute Review Interface](./task-0.5.5.9-dispute-review-interface.md)
- [Routing Structure](../../../02-architecture/frontend/routing-structure.md) - CMC routes
- [Workflow Architecture](../../../02-architecture/workflow-architecture.md) - Compliance Dispute Workflow

---

**Last Updated:** 2025-01-15  
**Owner:** Emma (UI/UX + Next.js Frontend Specialist)  
**Guided by:** Fatima (MOH Regulatory Requirements) & Dr. Samir (Business Process Validation)

