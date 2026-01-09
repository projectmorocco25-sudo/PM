# Task 0.5.4.9: Export History Page Wireframe

**Status:** 🟡 In Progress  
**Route:** `/ecs/history` or `/ecs/exports/history` (historical export authorizations, filterable)  
**File:** `task-0.5.4.9-export-history.png`  
**Priority:** 🟢 Analytics & Historical Data

**Design Approach:** Historical view of all past export authorizations with filtering by date, company, and status. Role-based access. Professional, accessible, and optimized for regulatory audit and export tracking.

**Guidance:** Fatima (MOH Regulatory Requirements) - Historical export tracking critical for regulatory compliance and 7-year retention. Dr. Samir (Business Process Validation) - Historical export data enables supply chain analysis and pattern identification.

---

## Wireframe Layout

```
┌─────────────────────────────────────────────────────────────┐
│ Home > ECS > Export History                                  │
│                                                             │
│ Export History (All Past Export Authorizations)             │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Filters & Search                                         ││
│ │                                                          ││
│ │ [Status: All ▼] [Company: All ▼] [Date Range ▼]        ││
│ │                                                          ││
│ │ Status: [ ] Active [ ] Expired [ ] Completed [ ] Cancelled││
│ │ Company: [Search company...] (MOH only)                  ││
│ │ Date Range: [Custom Range ▼]                            ││
│ │ From: [2020-01-01] To: [2024-12-31]                    ││
│ │                                                          ││
│ │ Quick Filters: [Last Year] [Last 3 Years] [Last 7 Years]││
│ │                                                          ││
│ │ [Clear Filters] [Export Report]                         ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Export Authorizations Table                              ││
│ │                                                          ││
│ │ Showing 156 export authorizations (2018-2024)            ││
│ │                                                          ││
│ │ Request ID │ Company              │ SKU      │ Date    │ Status││
│ │ ────────── │ ─────────────────── │ ──────── │ ──────  │ ──────││
│ │ EXP-2024-001│ ABC Pharmaceuticals │ SKU001   │ Jan 15  │ ✓ Active││
│ │ EXP-2024-002│ ABC Pharmaceuticals │ SKU002   │ Jan 20  │ ⏳ Expired││
│ │ EXP-2024-003│ XYZ Pharmaceuticals │ SKU003   │ Feb 1   │ ✓ Completed││
│ │ EXP-2023-001│ ABC Pharmaceuticals │ SKU001   │ Jan 10  │ ✓ Completed││
│ │ EXP-2023-002│ XYZ Pharmaceuticals │ SKU002   │ Jan 25  │ ❌ Cancelled││
│ │ EXP-2022-001│ ABC Pharmaceuticals │ SKU001   │ Dec 30  │ ✓ Completed││
│ │ ...         │ ...                 │ ...      │ ...     │ ...    ││
│ │                                                          ││
│ │ [← Previous] [1] [2] [3] ... [16] [Next →]              ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Summary Statistics                                       ││
│ │                                                          ││
│ │ Total Exports: 156 (2018-2024)                          ││
│ │ • Active: 12                                            ││
│ │ • Expired: 8                                            ││
│ │ • Completed: 128                                        ││
│ │ • Cancelled: 8                                          ││
│ │                                                          ││
│ │ Average per Year: 22.3 exports                          ││
│ │ Current Year (2024): 18 exports                         ││
│ │                                                          ││
│ │ ℹ️ Historical data includes exports from inactive ECS   ││
│ │   module periods. Data is read-only.                    ││
│ └─────────────────────────────────────────────────────────┘│
```

---

## Key Features

### Filters & Search
- **Status Filter:** Multi-select (Active, Expired, Completed, Cancelled, All)
- **Company Filter:** Search/select (MOH only - shows all companies)
- **Date Range:** Custom date range picker (supports 7-year lookback)
- **Quick Filters:** Last Year, Last 3 Years, Last 7 Years, All Time
- **Export:** Download filtered report (PDF/CSV)

### Export Authorizations Table
- **Columns:** Request ID, Company, SKU, Date, Status, Actions
- **Sortable:** Click column header to sort
- **Status Badges:** Color-coded (✓ Active, ⏳ Expired, ✓ Completed, ❌ Cancelled)
- **Actions:** View details, Export individual authorization
- **Pagination:** 50 items per page (configurable)

### Summary Statistics
- **Total Count:** Total exports in filtered range
- **By Status:** Breakdown by status (Active, Expired, Completed, Cancelled)
- **By Year:** Average per year, current year count
- **Module Status Note:** Indicates if data from inactive module period (read-only)

---

## State Variations

### Empty State (No Results)
```
┌─────────────────────────────────────────────────────────┐│
│ ┌─────────────────────────────────────────────────────┐││
│ │                                                      │││
│ │          No Export History Found                     │││
│ │                                                      │││
│ │  No export authorizations match the selected        │││
│ │  filters.                                            │││
│ │                                                      │││
│ │  [Clear Filters] [View All Exports]                 │││
│ │                                                      │││
│ └─────────────────────────────────────────────────────┘││
```

### Loading State
```
┌─────────────────────────────────────────────────────────┐│
│ ┌─────────────────────────────────────────────────────┐││
│ │                                                      │││
│ │         [Loading spinner]                            │││
│ │         Loading export history...                    │││
│ │                                                      │││
│ └─────────────────────────────────────────────────────┘││
```

### Inactive Module Alert (if ECS module inactive)
```
│ ┌─────────────────────────────────────────────────────┐││
│ │ ⓘ Historical Data - Module Currently Inactive       │││
│ │                                                      │││
│ │  ECS module is currently inactive. You are viewing  │││
│ │  historical data from when the module was active.    │││
│ │  This data is read-only.                             │││
│ └─────────────────────────────────────────────────────┘││
```

---

## Responsive Behavior

### Desktop (> 1024px)
- Full-width table with all columns visible
- Side panel for summary statistics
- Horizontal scroll if needed

### Tablet (768px - 1024px)
- Stacked filters
- Scrollable table with horizontal scroll
- Summary statistics below table

### Mobile (< 768px)
- Filters in collapsible accordion
- Card-based layout instead of table
- Summary statistics first, then list

---

## Interactions

1. **Click Filter:** Apply filter, reload table
2. **Click Export Row:** Navigate to historical authorization detail page
3. **Click Export Report:** Download filtered report (PDF/CSV)
4. **Click Pagination:** Load next/previous page
5. **Click Sort:** Sort table by column (ascending/descending)

---

## Data Requirements

- **Data Source:** Historical ECS export authorizations from last 7 years
- **Access Control:** Companies see own exports only, MOH sees all
- **Module Status:** Accessible even if ECS module is inactive (read-only)
- **Pagination:** 50 items per page (server-side)
- **Date Range:** Supports up to 7-year lookback
- **Filters:** Status, Company, Date Range

---

## Accessibility

- **Keyboard Navigation:** Tab through filters, Enter to apply, Arrow keys in table
- **Screen Reader:** Announce filter state, request ID, company, SKU, status
- **Focus Management:** Focus on table after filter apply
- **ARIA Labels:** Filter controls, table headers, pagination, module status alert

---

## Related Wireframes

- **Detail View:** [Historical Authorization Detail](task-0.5.4.10-historical-authorization-detail.md) - Individual export
- **Current View:** [Export Authorizations List](../../03-ecs/authorizations/task-0.5.4.5-export-authorizations-list.md) - Current exports
- **Integration:** [History Overview](../../00-core-foundation/global/task-0.5.1.30-history-overview.md) - Top-level history page

---

**Created:** 2025-01-15  
**Last Updated:** 2025-01-15  
**Owner:** Emma (UI/UX + Next.js Frontend Specialist)  
**Reviewers:** Fatima (MOH Regulatory Requirements), Dr. Samir (Business Process Validation)

