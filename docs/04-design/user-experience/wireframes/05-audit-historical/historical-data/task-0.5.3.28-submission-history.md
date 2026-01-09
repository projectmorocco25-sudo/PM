# Task 0.5.3.28: Submission History Page Wireframe

**Status:** 🟡 In Progress  
**Route:** `/vci/submissions/history` (all past submissions, filterable)  
**File:** `task-0.5.3.28-submission-history.png`  
**Priority:** 🟢 Analytics & Historical Data

**Design Approach:** Historical view of all past VCI submissions (AAMS, MSQ, WSL) with filtering by type, year, and company. Role-based access. Professional, accessible, and optimized for regulatory audit and trend analysis.

**Guidance:** Fatima (MOH Regulatory Requirements) - Historical submission access critical for regulatory audit and 7-year retention compliance. Dr. Samir (Business Process Validation) - Historical data enables trend analysis and compliance pattern identification.

---

## Wireframe Layout

```
┌─────────────────────────────────────────────────────────────┐
│ Home > VCI > Submissions > History                          │
│                                                             │
│ Submission History (All Past Submissions)                   │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Filters & Search                                         ││
│ │                                                          ││
│ │ [Type: All ▼] [Year: All Years ▼] [Company: All ▼]     ││
│ │                                                          ││
│ │ Type: [ ] AAMS [ ] MSQ [ ] WSL [All]                    ││
│ │ Year: [2024] [2023] [2022] [All Years]                  ││
│ │ Company: [Search company...] (MOH only)                  ││
│ │                                                          ││
│ │ Date Range: [Custom Range ▼]                            ││
│ │ From: [2020-01-01] To: [2024-12-31]                    ││
│ │                                                          ││
│ │ [Clear Filters] [Export Report]                         ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Submissions Table                                        ││
│ │                                                          ││
│ │ Showing 247 submissions (2018-2024)                      ││
│ │                                                          ││
│ │ Type  │ Year │ Company              │ Submitted │ Status ││
│ │ ───── │ ──── │ ─────────────────── │ ────────  │ ────── ││
│ │ AAMS  │ 2024 │ ABC Pharmaceuticals  │ Jan 20    │ ✓ Done ││
│ │ MSQ   │ 2024 │ ABC Pharmaceuticals  │ Feb 15    │ ✓ Done ││
│ │ WSL   │ 2024 │ ABC Pharmaceuticals  │ Dec 31    │ ✓ Done ││
│ │ AAMS  │ 2024 │ XYZ Pharmaceuticals  │ Jan 18    │ ✓ Done ││
│ │ MSQ   │ 2024 │ XYZ Pharmaceuticals  │ Feb 10    │ ✓ Done ││
│ │ WSL   │ 2024 │ XYZ Pharmaceuticals  │ Dec 28    │ ✓ Done ││
│ │ AAMS  │ 2023 │ ABC Pharmaceuticals  │ Jan 22    │ ✓ Done ││
│ │ MSQ   │ 2023 │ ABC Pharmaceuticals  │ Feb 18    │ ✓ Done ││
│ │ WSL   │ 2023 │ ABC Pharmaceuticals  │ Dec 29    │ ✓ Done ││
│ │ ...   │ ...  │ ...                  │ ...       │ ...    ││
│ │                                                          ││
│ │ [← Previous] [1] [2] [3] ... [25] [Next →]              ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Summary Statistics                                       ││
│ │                                                          ││
│ │ Total Submissions: 247                                   ││
│ │ • AAMS: 83 (2018-2024)                                  ││
│ │ • MSQ: 83 (2018-2024)                                   ││
│ │ • WSL: 81 (2018-2024)                                   ││
│ │                                                          ││
│ │ Average per Year: 35.3 submissions                      ││
│ │ Current Year (2024): 24 submissions                     ││
│ └─────────────────────────────────────────────────────────┘│
```

---

## Key Features

### Filters & Search
- **Type Filter:** Multi-select (AAMS, MSQ, WSL, All)
- **Year Filter:** Dropdown (All Years, 2018-2024, Custom Range)
- **Company Filter:** Search/select (MOH only - shows all companies)
- **Date Range:** Custom date range picker (supports 7-year lookback)
- **Quick Filters:** Last Year, Last 3 Years, Last 7 Years, All Time
- **Export:** Download filtered report (PDF/CSV)

### Submissions Table
- **Columns:** Type, Year, Company, Submitted Date, Status, Actions
- **Sortable:** Click column header to sort
- **Status Badges:** Color-coded (✓ Done, ⏳ Pending, ❌ Rejected)
- **Actions:** View details, Export individual submission
- **Pagination:** 50 items per page (configurable)

### Summary Statistics
- **Total Count:** Total submissions in filtered range
- **By Type:** Breakdown by submission type (AAMS, MSQ, WSL)
- **By Year:** Average per year, current year count
- **Date Range:** Shows selected date range context

---

## State Variations

### Empty State (No Results)
```
┌─────────────────────────────────────────────────────────┐│
│ ┌─────────────────────────────────────────────────────┐││
│ │                                                      │││
│ │          No Submissions Found                        │││
│ │                                                      │││
│ │  No submissions match the selected filters.         │││
│ │                                                      │││
│ │  [Clear Filters] [View All Submissions]             │││
│ │                                                      │││
│ └─────────────────────────────────────────────────────┘││
```

### Loading State
```
┌─────────────────────────────────────────────────────────┐│
│ ┌─────────────────────────────────────────────────────┐││
│ │                                                      │││
│ │         [Loading spinner]                            │││
│ │         Loading historical submissions...            │││
│ │                                                      │││
│ └─────────────────────────────────────────────────────┘││
```

### Company User View (Limited)
```
│ Submission History (My Company Submissions)             ││
│                                                          ││
│ [Type: All ▼] [Year: All Years ▼]                      ││
│                                                          ││
│ [No company filter - shows own company only]            ││
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
2. **Click Submission Row:** Navigate to submission detail page
3. **Click Export:** Download filtered report (PDF/CSV)
4. **Click Pagination:** Load next/previous page
5. **Click Sort:** Sort table by column (ascending/descending)

---

## Data Requirements

- **Data Source:** Historical VCI submissions (AAMS, MSQ, WSL) from last 7 years
- **Access Control:** Companies see own submissions only, MOH sees all
- **Pagination:** 50 items per page (server-side)
- **Date Range:** Supports up to 7-year lookback
- **Filters:** Type, Year, Company, Date Range

---

## Accessibility

- **Keyboard Navigation:** Tab through filters, Enter to apply, Arrow keys in table
- **Screen Reader:** Announce filter state, submission type, year, company, status
- **Focus Management:** Focus on table after filter apply
- **ARIA Labels:** Filter controls, table headers, pagination

---

## Related Wireframes

- **Detail View:** [AAMS Submission Detail](../../02-vci/aams/task-0.5.3.3-aams-submission-detail.md) - Individual submission
- **Detail View:** [MSQ Submission Detail](../../02-vci/msq/task-0.5.3.11-msq-submission-detail.md) - Individual submission
- **Detail View:** [WSL Submission Detail](../../02-vci/wsl/task-0.5.3.13-wsl-submission-detail.md) - Individual submission
- **Integration:** [History Overview](../../00-core-foundation/global/task-0.5.1.30-history-overview.md) - Top-level history page

---

**Created:** 2025-01-15  
**Last Updated:** 2025-01-15  
**Owner:** Emma (UI/UX + Next.js Frontend Specialist)  
**Reviewers:** Fatima (MOH Regulatory Requirements), Dr. Samir (Business Process Validation)

