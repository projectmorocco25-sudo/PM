# Task 0.5.5.14: Compliance Disputes History Page Wireframe

**Status:** 🟡 In Progress  
**Route:** `/cmc/disputes/history` (historical compliance disputes, filterable)  
**File:** `task-0.5.5.14-compliance-disputes-history.png`  
**Priority:** 🟢 Analytics & Historical Data

**Design Approach:** Historical view of all past compliance disputes with filtering by date, company, and status. Role-based access. Professional, accessible, and optimized for regulatory audit and dispute resolution tracking.

**Guidance:** Fatima (MOH Regulatory Requirements) - Historical dispute access critical for regulatory audit trail and resolution pattern analysis. Dr. Samir (Business Process Validation) - Historical dispute data enables dispute trend identification and process improvement.

---

## Wireframe Layout

```
┌─────────────────────────────────────────────────────────────┐
│ Home > CMC > Disputes > History                              │
│                                                             │
│ Compliance Disputes History (All Past Disputes)              │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Filters & Search                                         ││
│ │                                                          ││
│ │ [Status: All ▼] [Company: All ▼] [Date Range ▼]        ││
│ │                                                          ││
│ │ Status: [ ] Open [ ] Resolved [ ] Rejected [ ] Closed   ││
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
│ │ Disputes Table                                           ││
│ │                                                          ││
│ │ Showing 89 disputes (2020-2024)                          ││
│ │                                                          ││
│ │ Dispute ID │ Company              │ Period   │ Status │ Date ││
│ │ ────────── │ ─────────────────── │ ──────── │ ────── │ ──── ││
│ │ DISP-2024-001│ ABC Pharmaceuticals │ Dec 2024 │ ✓ Resolved │ Jan 2││
│ │ DISP-2024-002│ XYZ Pharmaceuticals │ Nov 2024 │ ⏳ Open │ Dec 15││
│ │ DISP-2024-003│ ABC Pharmaceuticals │ Oct 2024 │ ✓ Resolved │ Nov 5││
│ │ DISP-2023-001│ XYZ Pharmaceuticals │ Dec 2023 │ ❌ Rejected │ Jan 10││
│ │ DISP-2023-002│ ABC Pharmaceuticals │ Nov 2023 │ ✓ Resolved │ Dec 20││
│ │ DISP-2022-001│ ABC Pharmaceuticals │ Dec 2022 │ ✓ Resolved │ Jan 15││
│ │ ...         │ ...                 │ ...      │ ...    │ ...  ││
│ │                                                          ││
│ │ [← Previous] [1] [2] [3] ... [9] [Next →]                ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Summary Statistics                                       ││
│ │                                                          ││
│ │ Total Disputes: 89 (2020-2024)                           ││
│ │ • Open: 5                                               ││
│ │ • Resolved: 72                                          ││
│ │ • Rejected: 10                                          ││
│ │ • Closed: 2                                             ││
│ │                                                          ││
│ │ Resolution Rate: 80.9% (72 resolved / 89 total)          ││
│ │ Average Resolution Time: 18.5 days                      ││
│ │                                                          ││
│ │ Average per Year: 17.8 disputes                         ││
│ │ Current Year (2024): 12 disputes                        ││
│ │                                                          ││
│ │ Trend: ↓ Decreasing (fewer disputes per year)           ││
│ │                                                          ││
│ │ ℹ️ Historical data includes disputes from inactive CMC   ││
│ │   module periods. Data is read-only.                    ││
│ └─────────────────────────────────────────────────────────┘│
```

---

## Key Features

### Filters & Search
- **Status Filter:** Multi-select (Open, Resolved, Rejected, Closed, All)
- **Company Filter:** Search/select (MOH only - shows all companies)
- **Date Range:** Custom date range picker (supports 7-year lookback)
- **Quick Filters:** Last Year, Last 3 Years, Last 7 Years, All Time
- **Export:** Download filtered report (PDF/CSV)

### Disputes Table
- **Columns:** Dispute ID, Company, Period (score period), Status, Date (creation/resolution)
- **Sortable:** Click column header to sort
- **Status Badges:** Color-coded (⏳ Open, ✓ Resolved, ❌ Rejected, 🔒 Closed)
- **Actions:** View details, Export individual dispute
- **Pagination:** 50 items per page (configurable)

### Summary Statistics
- **Total Count:** Total disputes in filtered range
- **By Status:** Breakdown by status (Open, Resolved, Rejected, Closed)
- **Resolution Metrics:** Resolution rate, average resolution time
- **Per Year:** Average per year, current year count
- **Trend Analysis:** Overall trend direction (increasing/decreasing)
- **Module Status Note:** Indicates if data from inactive module period (read-only)

---

## State Variations

### Empty State (No Results)
```
┌─────────────────────────────────────────────────────────┐│
│ ┌─────────────────────────────────────────────────────┐││
│ │                                                      │││
│ │          No Compliance Disputes Found                │││
│ │                                                      │││
│ │  No compliance disputes match the selected filters.  │││
│ │                                                      │││
│ │  [Clear Filters] [View All Disputes]                │││
│ │                                                      │││
│ └─────────────────────────────────────────────────────┘││
```

### Loading State
```
┌─────────────────────────────────────────────────────────┐│
│ ┌─────────────────────────────────────────────────────┐││
│ │                                                      │││
│ │         [Loading spinner]                            │││
│ │         Loading dispute history...                   │││
│ │                                                      │││
│ └─────────────────────────────────────────────────────┘││
```

### Company User View (Limited)
```
│ Compliance Disputes History (My Company Disputes)        ││
│                                                          ││
│ [Status: All ▼] [Date Range ▼]                         ││
│                                                          ││
│ [No company filter - shows own company only]            ││
```

### Inactive Module Alert (if CMC module inactive)
```
│ ┌─────────────────────────────────────────────────────┐││
│ │ ⓘ Historical Data - Module Currently Inactive       │││
│ │                                                      │││
│ │  CMC module is currently inactive. You are viewing  │││
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
2. **Click Dispute Row:** Navigate to dispute detail page
3. **Click Export Report:** Download filtered report (PDF/CSV)
4. **Click Pagination:** Load next/previous page
5. **Click Sort:** Sort table by column (ascending/descending)

---

## Data Requirements

- **Data Source:** Historical CMC compliance disputes from last 7 years
- **Access Control:** Companies see own disputes only, MOH sees all
- **Module Status:** Accessible even if CMC module is inactive (read-only)
- **Pagination:** 50 items per page (server-side)
- **Date Range:** Supports up to 7-year lookback
- **Filters:** Status, Company, Date Range

---

## Accessibility

- **Keyboard Navigation:** Tab through filters, Enter to apply, Arrow keys in table
- **Screen Reader:** Announce filter state, dispute ID, company, period, status, date
- **Focus Management:** Focus on table after filter apply
- **ARIA Labels:** Filter controls, table headers, pagination, module status alert

---

## Related Wireframes

- **Detail View:** [Dispute Detail](../../04-cmc/disputes/task-0.5.5.7-dispute-detail.md) - Individual dispute
- **Current View:** [Compliance Disputes List](../../04-cmc/disputes/task-0.5.5.6-compliance-disputes-list.md) - Current disputes
- **Integration:** [History Overview](../../00-core-foundation/global/task-0.5.1.30-history-overview.md) - Top-level history page

---

**Created:** 2025-01-15  
**Last Updated:** 2025-01-15  
**Owner:** Emma (UI/UX + Next.js Frontend Specialist)  
**Reviewers:** Fatima (MOH Regulatory Requirements), Dr. Samir (Business Process Validation)

