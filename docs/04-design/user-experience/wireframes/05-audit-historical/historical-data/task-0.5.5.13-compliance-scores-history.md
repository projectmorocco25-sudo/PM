# Task 0.5.5.13: Compliance Scores History Page Wireframe

**Status:** ✅ Complete  
**Route:** `/cmc/scores/history` (historical compliance scores, filterable)  
**File:** `task-0.5.5.13-compliance-scores-history.png`  
**Priority:** 🟢 Analytics & Historical Data

**Design Approach:** Historical view of all past compliance scores with filtering by date and company. Trend visualization. Role-based access. Professional, accessible, and optimized for regulatory audit and compliance trend analysis.

**Guidance:** Fatima (MOH Regulatory Requirements) - Historical compliance score access critical for regulatory audit and trend monitoring. Dr. Samir (Business Process Validation) - Historical score data enables compliance pattern identification and benchmarking.

---

## Wireframe Layout

```
┌─────────────────────────────────────────────────────────────┐
│ Home > CMC > Scores > History                               │
│                                                             │
│ Compliance Scores History (All Past Scores)                 │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Data Retention Compliance (Fatima's Requirement)         ││
│ │                                                          ││
│ │ Retention Status:                                        ││
│ │ • Data retained until [date + 7 years]                  ││
│ │ • Retention period: 7 years (regulatory minimum)        ││
│ │ • Regulatory Basis: Law No. 09-08                       ││
│ │ • Immutability Warning: ⚠️ Historical data cannot be   ││
│ │   modified                                               ││
│ │ [View Retention Policy] [View Regulatory Framework]     ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Filters & Search                                         ││
│ │                                                          ││
│ │ [Company: All ▼] [Date Range ▼] [Period: All ▼]        ││
│ │                                                          ││
│ │ Company: [Search company...] (MOH only)                  ││
│ │ Date Range: [Custom Range ▼]                            ││
│ │ From: [2020-01-01] To: [2024-12-31]                    ││
│ │                                                          ││
│ │ Period: [ ] Monthly [ ] Quarterly [ ] Yearly [All]      ││
│ │                                                          ││
│ │ Quick Filters: [Last Year] [Last 3 Years] [Last 7 Years]││
│ │                                                          ││
│ │ [Clear Filters] [Export Report]                         ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Compliance Scores Trend Chart                            ││
│ │                                                          ││
│ │ Average Compliance Score Over Time                       ││
│ │                                                          ││
│ │ [Line Chart: Score % over time, 2020-2024]              ││
│ │                                                          ││
│ │ Y-axis: Score (0-100%)                                   ││
│ │ X-axis: Time (monthly/quarterly/yearly based on period)  ││
│ │                                                          ││
│ │ [View Full Chart] [Export Chart]                        ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Compliance Scores Table                                  ││
│ │                                                          ││
│ │ Showing 156 scores (2020-2024)                           ││
│ │                                                          ││
│ │ Period     │ Company              │ Score │ Trend │ Actions││
│ │ ─────────  │ ─────────────────── │ ────  │ ───── │ ────── ││
│ │ Dec 2024   │ ABC Pharmaceuticals  │ 85%   │ ↑ +2% │ [View] ││
│ │ Dec 2024   │ XYZ Pharmaceuticals  │ 78%   │ ↓ -1% │ [View] ││
│ │ Nov 2024   │ ABC Pharmaceuticals  │ 83%   │ ↑ +1% │ [View] ││
│ │ Nov 2024   │ XYZ Pharmaceuticals  │ 79%   │ ↑ +3% │ [View] ││
│ │ Oct 2024   │ ABC Pharmaceuticals  │ 82%   │ ↓ -2% │ [View] ││
│ │ Oct 2024   │ XYZ Pharmaceuticals  │ 76%   │ ↑ +2% │ [View] ││
│ │ ...        │ ...                  │ ...   │ ...   │ ...    ││
│ │                                                          ││
│ │ [← Previous] [1] [2] [3] ... [16] [Next →]              ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Summary Statistics                                       ││
│ │                                                          ││
│ │ Total Scores: 156 (2020-2024)                            ││
│ │ • Average Score: 78.5%                                   ││
│ │ • Highest Score: 95% (ABC Pharma, Dec 2022)              ││
│ │ • Lowest Score: 45% (XYZ Pharma, Mar 2021)               ││
│ │                                                          ││
│ │ Average per Year: 31.2 scores                           ││
│ │ Current Year (2024): 24 scores                          ││
│ │                                                          ││
│ │ Trend: ↑ Improving (average score increasing)           ││
│ │                                                          ││
│ │ ℹ️ Historical data includes scores from inactive CMC    ││
│ │   module periods. Data is read-only.                    ││
│ └─────────────────────────────────────────────────────────┘│
```

---

## Key Features

### Filters & Search
- **Company Filter:** Search/select (MOH only - shows all companies)
- **Date Range:** Custom date range picker (supports 7-year lookback)
- **Period Filter:** Multi-select (Monthly, Quarterly, Yearly, All)
- **Quick Filters:** Last Year, Last 3 Years, Last 7 Years, All Time
- **Export:** Download filtered report (PDF/CSV)

### Compliance Scores Trend Chart
- **Visualization:** Line chart showing score trends over time
- **X-axis:** Time (monthly/quarterly/yearly based on period selection)
- **Y-axis:** Score percentage (0-100%)
- **Multi-company:** Multiple lines if viewing all companies (MOH)
- **Interactive:** Hover for details, click to view period details
- **Export:** Download chart as image (PNG/SVG)

### Compliance Scores Table
- **Columns:** Period, Company, Score, Trend (↑/↓), Actions
- **Sortable:** Click column header to sort
- **Score Display:** Percentage with color coding (green = high, yellow = medium, red = low)
- **Trend Indicator:** Arrow showing change from previous period
- **Actions:** View details, Export individual score
- **Pagination:** 50 items per page (configurable)

### Summary Statistics
- **Total Count:** Total scores in filtered range
- **Average Score:** Overall average across all companies and periods
- **Highest/Lowest:** Best and worst scores with context
- **Per Year:** Average per year, current year count
- **Trend Analysis:** Overall trend direction (improving/declining)
- **Module Status Note:** Indicates if data from inactive module period (read-only)

---

## State Variations

### Empty State (No Results)
```
┌─────────────────────────────────────────────────────────┐│
│ ┌─────────────────────────────────────────────────────┐││
│ │                                                      │││
│ │          No Compliance Scores Found                  │││
│ │                                                      │││
│ │  No compliance scores match the selected filters.   │││
│ │                                                      │││
│ │  [Clear Filters] [View All Scores]                  │││
│ │                                                      │││
│ └─────────────────────────────────────────────────────┘││
```

### Loading State
```
┌─────────────────────────────────────────────────────────┐│
│ ┌─────────────────────────────────────────────────────┐││
│ │                                                      │││
│ │         [Loading spinner]                            │││
│ │         Loading compliance score history...            │││
│ │                                                      │││
│ └─────────────────────────────────────────────────────┘││
```

### Company User View (Limited)
```
│ Compliance Scores History (My Company Scores)            ││
│                                                          ││
│ [Date Range ▼] [Period: All ▼]                         ││
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
- Full-width chart above table
- Side panel for summary statistics
- All columns visible in table

### Tablet (768px - 1024px)
- Stacked filters
- Chart above table (responsive width)
- Scrollable table with horizontal scroll
- Summary statistics below table

### Mobile (< 768px)
- Filters in collapsible accordion
- Chart in mobile view (simplified)
- Card-based layout instead of table
- Summary statistics first, then list

---

## Interactions

1. **Click Filter:** Apply filter, reload chart and table
2. **Click Score Row:** Navigate to compliance score detail page
3. **Click Chart Point:** Navigate to period detail or show tooltip
4. **Click Export Report:** Download filtered report (PDF/CSV)
5. **Click Export Chart:** Download chart as image (PNG/SVG)
6. **Click Pagination:** Load next/previous page
7. **Click Sort:** Sort table by column (ascending/descending)

---

## Data Requirements

- **Data Source:** Historical CMC compliance scores from last 7 years
- **Access Control:** Companies see own scores only, MOH sees all
- **Module Status:** Accessible even if CMC module is inactive (read-only)
- **Pagination:** 50 items per page (server-side)
- **Date Range:** Supports up to 7-year lookback
- **Period Types:** Monthly, quarterly, yearly aggregation
- **Filters:** Company, Date Range, Period Type

---

## Accessibility

- **Keyboard Navigation:** Tab through filters, Enter to apply, Arrow keys in table
- **Screen Reader:** Announce filter state, period, company, score, trend
- **Focus Management:** Focus on chart after filter apply
- **ARIA Labels:** Filter controls, chart description, table headers, pagination, module status alert

---

## Related Wireframes

- **Detail View:** [Compliance Score Detail](../../04-cmc/scores/task-0.5.5.2-compliance-score-detail.md) - Individual score
- **Current View:** [Compliance Scores List](../../04-cmc/scores/task-0.5.5.1-compliance-scores-list.md) - Current scores
- **Integration:** [History Overview](../../00-core-foundation/global/task-0.5.1.30-history-overview.md) - Top-level history page

---

**Created:** 2025-01-15  
**Last Updated:** 2025-01-15  
**Owner:** Emma (UI/UX + Next.js Frontend Specialist)  
**Reviewers:** Fatima (MOH Regulatory Requirements), Dr. Samir (Business Process Validation)

