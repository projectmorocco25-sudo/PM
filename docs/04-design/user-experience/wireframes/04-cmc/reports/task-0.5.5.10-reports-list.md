# Task 0.5.5.10: Reports List Page Wireframe

**Status:** ✅ Complete  
**Route:** `/cmc/reports`  
**File:** `task-0.5.5.10-reports-list.png`  
**Priority:** 🟡 CMC Module

**Design Approach:** Modern list page with reports table, report type filters, status filters, period filters, and download actions. Professional, accessible, and optimized for regulatory reporting workflows.

---

## Wireframe Layout

```
┌─────────────────────────────────────────────────────────────┐
│ Home > CMC > Reports                                         │
│                                                             │
│ Compliance Reports                                           │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Filters                                                   ││
│ │                                                          ││
│ │ Report Type: [All ▼]  Status: [All ▼]                  ││
│ │ Period: [Last 3 Months ▼]                              ││
│ │                                                          ││
│ │ [Apply Filters] [Clear] [Generate New Report]          ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Compliance Reports Table                                 ││
│ │                                                          ││
│ │ [Sort: Date ▼] [Sort: Type ▼] [Sort: Status ▼]         ││
│ │                                                          ││
│ │ ┌──────┬─────────────┬──────────┬──────────┬──────────┐│
│ │ │ ID   │ Report Type │ Period   │ Status   │ Actions  ││
│ │ ├──────┼─────────────┼──────────┼──────────┼──────────┤│
│ │ │ REP- │ Monthly     │ Dec 2024 │ Approved │ [>] [↓]  ││
│ │ │ 2025-│ Compliance  │          │          │          ││
│ │ │ 001  │ Report      │          │          │          ││
│ │ ├──────┼─────────────┼──────────┼──────────┼──────────┤│
│ │ │ REP- │ Quarterly   │ Q4 2024  │ Pending  │ [>] [⏸]  ││
│ │ │ 2025-│ Compliance  │          │ Review   │          ││
│ │ │ 005  │ Report      │          │          │          ││
│ │ ├──────┼─────────────┼──────────┼──────────┼──────────┤│
│ │ │ REP- │ Annual      │ 2024     │ Tier 2   │ [>] [⏸]  ││
│ │ │ 2025-│ Compliance  │          │ Reviewed │          ││
│ │ │ 012  │ Report      │          │          │          ││
│ │ └──────┴─────────────┴──────────┴──────────┴──────────┘│
│ │                                                          ││
│ │ Showing 3 of 15 reports                                   ││
│ │ [< Previous] [1] [2] [3] ... [2] [Next >]               ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Report Types                                             ││
│ │                                                          ││
│ │ • Monthly Compliance Report                              ││
│ │   Generated monthly after score calculation              ││
│ │   Contains: Score distribution, trends, disputes        ││
│ │                                                          ││
│ │ • Quarterly Compliance Report                            ││
│ │   Generated quarterly with aggregated analysis          ││
│ │   Contains: Quarterly trends, comparative analysis      ││
│ │                                                          ││
│ │ • Annual Compliance Report                               ││
│ │   Generated annually with comprehensive overview        ││
│ │   Contains: Annual summary, regulatory compliance      ││
│ │                                                          ││
│ │ [Generate Custom Report] (MOH Tier 1 only)              ││
│ └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

---

## Component Specifications

### Page Header
- **Breadcrumbs:** "Home > CMC > Reports"
- **Title:** "Compliance Reports"
  - **Typography:** 24px, font-weight: 600, color: #111827
- **Actions (Right-aligned):**
  - **Generate New Report Button:** Primary button (MOH only)
  - **Export Button:** Secondary button (export list CSV)
  - **Actions Dropdown:** More actions menu
    - Options: Refresh, Print

### Filters Section
- **Layout:** Horizontal filter bar
- **Filters:**
  1. **Report Type Dropdown:**
     - Options: All, Monthly Compliance Report, Quarterly Compliance Report, Annual Compliance Report
     - Default: All
  2. **Status Dropdown:**
     - Options: All, Draft, Pending Review, Tier 2 Reviewed, Approved, Rejected
     - Default: All
  3. **Period Dropdown:**
     - Options: All, Current Month, Last 3 Months, Last 6 Months, Last Year, Custom Range
     - Default: Last 3 Months
- **Actions:**
  - **Apply Filters:** Primary button
  - **Clear:** Secondary button (reset all filters)
  - **Generate New Report:** Primary button (MOH Tier 1 only)

### Compliance Reports Table
- **Layout:** Scrollable table with sortable columns
- **Columns:**
  1. **ID:** Report ID (e.g., REP-2025-001)
     - **Link:** Click to view report detail
  2. **Report Type:** Report type name
     - Options: Monthly Compliance Report, Quarterly Compliance Report, Annual Compliance Report
  3. **Period:** Report period
     - Format: YYYY-MM (e.g., Dec 2024) for monthly
     - Format: QX YYYY (e.g., Q4 2024) for quarterly
     - Format: YYYY (e.g., 2024) for annual
  4. **Status:** Report status badge
     - Options: Draft (gray), Pending Review (yellow), Tier 2 Reviewed (blue), Approved (green), Rejected (red)
  5. **Actions:** Action buttons
     - **[>]:** View report detail (expand row or navigate)
     - **[↓]:** Download report (if approved)
     - **[⏸]:** Pending/Reviewing indicator (if not approved)
- **Features:**
  - **Sortable Columns:** Click column header to sort
  - **Pagination:** Shows "Showing X of Y reports"
  - **Row Count:** Display total count
  - **Expandable Rows:** Click action button to expand and show preview
- **Styling:**
  - **Table:** White background with borders
  - **Hover:** Row highlight on hover
  - **Alternating Rows:** Light gray background for even rows
  - **Status Badges:** Color-coded based on status

### Report Types Section
- **Layout:** Information card explaining report types
- **Content:**
  - **Monthly Compliance Report:**
    - Generated monthly after score calculation
    - Contains: Score distribution, trends, disputes
  - **Quarterly Compliance Report:**
    - Generated quarterly with aggregated analysis
    - Contains: Quarterly trends, comparative analysis
  - **Annual Compliance Report:**
    - Generated annually with comprehensive overview
    - Contains: Annual summary, regulatory compliance
- **Actions:**
  - **Generate Custom Report Button:** Primary button (MOH Tier 1 only)
    - **Action:** Opens custom report generation interface
- **Styling:** Information card with light background

### Expanded Row Preview
- **Layout:** Expandable preview section
- **Content:**
  - Report preview summary
  - Key metrics preview
  - Generation date and time
  - Generated by (user name, if manual)
- **Actions:**
  - View Full Report
  - Download Report (if approved)
- **Styling:** Light gray background for expanded content

---

## Role-Based Access

### Company Users
- **View:** Cannot access reports (MOH only)
- **Access:** Redirected or shown "Access Denied" message
- **Note:** Companies can access their own score details but not system-wide reports

### MOH Tier 1
- **View:** All reports
- **Filters:** All filters available
- **Table:** Full table with all columns
- **Actions:**
  - View Report Details
  - Download Reports (if approved)
  - Generate New Reports
  - Approve Reports
  - Export Data
- **Data:**
  - Can see all reports, status, and details
  - Can approve reports for release

### MOH Tier 2
- **View:** All reports
- **Filters:** All filters available
- **Table:** Full table with all columns
- **Actions:**
  - View Report Details
  - Download Reports (if approved)
  - Review Reports (read-only)
  - Export Data
- **Data:**
  - Can see all reports, status, and details
  - Can review reports but cannot approve (Tier 1 only)

---

## State Variations

### Empty State (No Data)
- **Message:** "No reports found"
- **Subtext:** "Reports are generated monthly, quarterly, and annually. Check back after the next generation period."
- **Action Button:** "Generate New Report" (if applicable, MOH Tier 1 only)

### Loading State
- **Skeleton Loaders:** Table with skeleton rows
- **Filters:** Skeleton filter placeholders

### Error State
- **Message:** "Unable to load reports"
- **Subtext:** Error message details
- **Action Button:** "Retry"

### No Results (Filtered)
- **Message:** "No reports match your filters"
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
3. **Report Generation:**
   - Monthly reports generated automatically after score calculation
   - Quarterly reports generated automatically at end of quarter
   - Annual reports generated automatically at end of year
   - Custom reports can be generated by MOH Tier 1
4. **Report Types:**
   - **Monthly Compliance Report:** Generated monthly
   - **Quarterly Compliance Report:** Generated quarterly
   - **Annual Compliance Report:** Generated annually
5. **Status Workflow:** Draft → Pending Review → Tier 2 Reviewed → Approved/Rejected
6. **Role-Based Access:**
   - Companies cannot access reports (MOH only)
   - MOH Tier 1 can generate, approve, and download reports
   - MOH Tier 2 can review and download approved reports
7. **Filtering:** Default to last 3 months, can filter by type, status, period
8. **Sorting:** Default sort by date (descending) or status (ascending)
9. **Pagination:** 20 reports per page (configurable)
10. **Download:** Only approved reports can be downloaded
11. **Status Badges:** Color-coded based on status (gray, yellow, blue, green, red)
12. **Report Generation:** MOH Tier 1 can generate custom reports with custom parameters
13. **Review Workflow:** Tier 2 reviews reports before Tier 1 approval
14. **Export:** Export filtered results to CSV (includes all columns)

---

## Related Documents

- [CMC Overview Wireframe](../overview/task-0.5.5.0-cmc-overview.md)
- [Report Detail Wireframe](./task-0.5.5.11-report-detail.md)
- [Report Review/Approval Interface](./task-0.5.5.12-report-review-approval-interface.md)
- [Routing Structure](../../../02-architecture/frontend/routing-structure.md) - CMC routes
- [Workflow Architecture](../../../02-architecture/workflow-architecture.md) - Report Generation Workflow

---

**Last Updated:** 2025-01-15  
**Owner:** Emma (UI/UX + Next.js Frontend Specialist)  
**Guided by:** Fatima (MOH Regulatory Requirements) & Dr. Samir (Business Process Validation)

