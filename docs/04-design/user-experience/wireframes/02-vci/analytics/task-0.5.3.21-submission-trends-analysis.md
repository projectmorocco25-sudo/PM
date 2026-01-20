# Task 0.5.3.21: Submission Trends Analysis Page Wireframe

**Status:** ✅ Complete  
**Route:** `/vci/submissions/history/trends` (MOH Tier 1 only)  
**File:** `task-0.5.3.21-submission-trends-analysis.png`  
**Priority:** 🟢 Analytics & Historical Data

**Design Approach:** Trend analysis dashboard with multi-year comparison charts for AAMS, MSQ, and WSL submissions. Interactive charts showing patterns, growth trends, and compliance metrics over time. Professional, accessible, and optimized for MOH Tier 1 strategic oversight and regulatory planning.

**Guidance:** Fatima (MOH Regulatory Requirements) - Trend analysis enables proactive regulatory planning and identification of compliance patterns. Multi-year comparisons support strategic decision-making. Dr. Samir (Business Process Validation) - Trend visualization helps identify systemic issues and improvement opportunities across the value chain.

---

## Wireframe Layout

```
┌─────────────────────────────────────────────────────────────┐
│ Home > VCI > Submissions > History > Trends                  │
│                                                             │
│ Submission Trends Analysis (MOH Tier 1 Only)                 │
│                                                             │
│ ℹ️ Submission Trends Analysis                              ││
│    Regulatory Framework (Fatima's Requirement):            ││
│    • AAMS: DMP Art. [X] - Annual Submission Trends        ││
│    • MSQ: DMP Art. [X] - Monthly Submission Trends        ││
│    • WSL: DMP Art. [X] - Weekly Submission Trends         ││
│    • Trends analyzed per regulatory requirements           ││
│    [View Regulatory Framework]                             ││
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Filters & Controls                                       ││
│ │                                                          ││
│ │ [Type: All ▼] [Year Range: 2018-2024] [Company: All ▼] ││
│ │                                                          ││
│ │ Type: [ ] AAMS [ ] MSQ [ ] WSL [All]                    ││
│ │ Year Range: [2018] to [2024] (multi-year comparison)    ││
│ │ Company: [All Companies ▼] (or select specific)         ││
│ │                                                          ││
│ │ [Compare Years] [Export Report] [Reset Filters]         ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ AAMS Submission Trends                                  ││
│ │                                                          ││
│ │ ┌──────────────────────────────────────────────────────┐││
│ │ │ AAMS Submissions by Year                              │││
│ │ │                                                       │││
│ │ │ 100│                                                 │││
│ │ │  80│      ┌─────┐                                    │││
│ │ │  60│  ┌───┘     └───┐                                │││
│ │ │  40│─┘              └─┐                              │││
│ │ │  20│                  └─┐  ┌─────┐                   │││
│ │ │   0└────────────────────└──┘     └───────────────── │││
│ │ │     2018 2019 2020 2021 2022 2023 2024              │││
│ │ │                                                       │││
│ │ │ Year-over-Year Change: +12% (2023-2024)             │││
│ │ │ Average: 42 submissions/year                         │││
│ │ └──────────────────────────────────────────────────────┘││
│ │                                                          ││
│ │ ┌──────────────────────────────────────────────────────┐││
│ │ │ AAMS Submission Timing (Days from Deadline)          │││
│ │ │                                                       │││
│ │ │ [Box plot showing distribution of submission dates]  │││
│ │ │                                                       │││
│ │ │ Average: 5 days before deadline                      │││
│ │ │ On-time: 78% | Late: 12% | Grace Period: 10%        │││
│ │ └──────────────────────────────────────────────────────┘││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ MSQ Submission Trends                                   ││
│ │                                                          ││
│ │ ┌──────────────────────────────────────────────────────┐││
│ │ │ MSQ Submissions by Month (2023-2024)                 │││
│ │ │                                                       │││
│ │ │ [Line chart showing monthly submission counts]       │││
│ │ │                                                       │││
│ │ │ Trend: ↗ Increasing (5% month-over-month)           │││
│ │ │ Seasonal Pattern: Higher in Q1, lower in Q4         │││
│ │ └──────────────────────────────────────────────────────┘││
│ │                                                          ││
│ │ ┌──────────────────────────────────────────────────────┐││
│ │ │ MSQ Validation Results                                │││
│ │ │                                                       │││
│ │ │ [Stacked bar chart: Accepted vs Flagged vs Rejected]│││
│ │ │                                                       │││
│ │ │ Acceptance Rate: 94% | Flag Rate: 5% | Reject: 1%   │││
│ │ └──────────────────────────────────────────────────────┘││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ WSL Submission Trends                                   ││
│ │                                                          ││
│ │ ┌──────────────────────────────────────────────────────┐││
│ │ │ WSL Submissions by Week (Last 52 Weeks)              │││
│ │ │                                                       │││
│ │ │ [Line chart with weekly submission counts]           │││
│ │ │                                                       │││
│ │ │ Consistency: 98% on-time submissions                 │││
│ │ │ Average: 52 submissions/week                         │││
│ │ └──────────────────────────────────────────────────────┘││
│ │                                                          ││
│ │ ┌──────────────────────────────────────────────────────┐││
│ │ │ Compliance Violation Trends                          │││
│ │ │                                                       │││
│ │ │ [Area chart showing violations over time]            │││
│ │ │                                                       │││
│ │ │ Trend: ↘ Decreasing (-15% year-over-year)           │││
│ │ │ Current: 5 active violations | Peak: 23 (2022)      │││
│ │ └──────────────────────────────────────────────────────┘││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Cross-Metric Analysis                                   ││
│ │                                                          ││
│ │ ┌──────────────────────────────────────────────────────┐││
│ │ │ Submission Volume Correlation                        │││
│ │ │                                                       │││
│ │ │ [Scatter plot: AAMS vs MSQ correlation]             │││
│ │ │ [Heat map: Submission patterns by month]            │││
│ │ │                                                       │││
│ │ │ Correlation: AAMS ↔ MSQ = 0.72 (strong positive)    │││
│ │ │ Pattern: Higher AAMS correlates with higher MSQ     │││
│ │ └──────────────────────────────────────────────────────┘││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Summary Insights                                         ││
│ │                                                          ││
│ │ • AAMS submissions trending upward (+12% YoY)           ││
│ │ • MSQ acceptance rate improving (94% vs 91% last year)  ││
│ │ • WSL compliance violations decreasing (-15% YoY)       ││
│ │ • Seasonal patterns identified in MSQ submissions       ││
│ │                                                          ││
│ │ [Generate Full Report] [Export Data]                    ││
│ └─────────────────────────────────────────────────────────┘│
```

---

## Component Specifications

### Page Header
- **Breadcrumbs:** "Home > VCI > Submissions > History > Trends"
- **Title:** "Submission Trends Analysis" (MOH Tier 1 only)
  - **Typography:** 24px, font-weight: 600, color: #111827
- **Role Restriction:** Only visible to MOH Tier 1 users (redirect others)

### Filters & Controls
- **Type Filter:** Multi-select checkboxes (AAMS, MSQ, WSL, All)
- **Year Range Selector:** Start year and end year dropdowns (supports 7-year lookback: 2018-2024)
- **Company Filter:** Dropdown "All Companies" or select specific company (MOH Tier 1 can filter by company)
- **Actions:**
  - "Compare Years" button: Updates all charts with selected filters
  - "Export Report" button: Downloads PDF report with all charts
  - "Reset Filters" button: Clears all filters to default view

### AAMS Submission Trends Section
- **Chart 1:** AAMS Submissions by Year (Line/Bar Chart)
  - X-axis: Years (2018-2024)
  - Y-axis: Number of submissions
  - Shows year-over-year comparison
  - Annotations: Year-over-year percentage change, average submissions
- **Chart 2:** AAMS Submission Timing (Box Plot/Distribution)
  - Shows distribution of submission dates relative to deadline
  - Statistics: Average days before deadline, on-time %, late %, grace period %

### MSQ Submission Trends Section
- **Chart 1:** MSQ Submissions by Month (Line Chart)
  - X-axis: Months (time series)
  - Y-axis: Submission count
  - Shows seasonal patterns and trends
  - Trend indicator: Increasing/decreasing with percentage
- **Chart 2:** MSQ Validation Results (Stacked Bar Chart)
  - Shows breakdown: Accepted, Flagged, Rejected
  - Acceptance rate percentage
  - Timeline comparison (current period vs previous period)

### WSL Submission Trends Section
- **Chart 1:** WSL Submissions by Week (Line Chart)
  - X-axis: Weeks (last 52 weeks)
  - Y-axis: Submission count
  - Shows consistency and on-time submission rate
  - Average submissions per week
- **Chart 2:** Compliance Violation Trends (Area Chart)
  - Shows violations over time
  - Trend indicator: Increasing/decreasing with percentage
  - Peak identification and current status

### Cross-Metric Analysis Section
- **Chart 1:** Submission Volume Correlation (Scatter Plot)
  - AAMS vs MSQ correlation visualization
  - Shows relationship between submission types
  - Correlation coefficient display
- **Chart 2:** Submission Patterns Heat Map
  - Monthly patterns across all submission types
  - Color intensity shows volume
  - Identifies seasonal patterns

### Summary Insights Panel
- **Bullet Points:** Key findings from trend analysis
- **Action Buttons:**
  - "Generate Full Report": Creates comprehensive PDF report
  - "Export Data": Downloads raw data (CSV) for further analysis

---

## Interaction Specifications

### Chart Interactions
- **Hover:** Tooltip shows detailed data point (value, date, context)
- **Click:** Drill-down to detailed view (if applicable)
- **Zoom:** Pan and zoom on time series charts (date range selection)
- **Legend:** Toggle series visibility (for multi-series charts)

### Filter Interactions
- **Type Filter Change:** Updates all relevant charts (filters data series)
- **Year Range Change:** Updates all time-based charts to selected range
- **Company Filter:** Updates all charts to show only selected company data (or all if "All Companies")

### Export Interactions
- **Export Report:** Generates PDF with all charts, insights, and summary statistics
- **Export Data:** Downloads CSV file with raw data used in charts

---

## State Specifications

### Loading State
- **Skeleton:** Chart skeletons with placeholder shapes
- **Spinner:** Loading overlay if data fetch > 1 second

### Empty State
- **No Data:** Message: "No trend data available for selected filters. Adjust filters or check data availability."
- **Insufficient Data:** Message: "Insufficient data for trend analysis. Minimum 2 years of data required."

### Error State
- **Error Message:** "Unable to load trend data. Please try again."
- **Retry Button:** Reloads trend data

### Success State
- **All Charts Rendered:** All trend visualizations displayed
- **Data Freshness Indicator:** "Data last updated: [timestamp]"

---

## Accessibility Specifications

- **Keyboard Navigation:** Tab through filters, use arrow keys to navigate chart data points
- **Screen Reader:** Chart data summarized in text below each chart
- **Color Contrast:** Charts use accessible color palettes (WCAG AA compliant)
- **Chart Descriptions:** Each chart has descriptive text explaining what it shows
- **ARIA Labels:**
  - Type filter: `aria-label="Filter by submission type"`
  - Year range: `aria-label="Select year range for comparison"`
  - Charts: `aria-label="[Chart type] showing [data description]"`

---

## Design Notes

- **Chart Library:** Use Recharts or similar accessible charting library
- **Responsive:** Charts stack vertically on tablet/mobile, maintain aspect ratios
- **Data Freshness:** Show "Data last updated" timestamp (from latest submission date)
- **Multi-Year Context:** Default to showing last 3-5 years for meaningful trend visualization
- **Export Format:** PDF report should include all charts, summary insights, and date range context
- **Performance:** Consider data aggregation for large date ranges (weekly/monthly summaries for > 1 year)

---

## Related Wireframes

- **VCI Overview:** [Task 0.5.3.0 - VCI Overview](../overview/task-0.5.3.0-vci-overview.md)
- **Submission History:** [Task 0.5.3.28 - Submission History](../../../05-audit-historical/historical-data/task-0.5.3.28-submission-history.md)
- **Governance Dashboard:** [Task 0.5.3.20 - Governance Dashboard](../overview/task-0.5.3.18-governance-dashboard.md)
- **ATC Treemap:** [Task 0.5.3.22 - ATC Treemap](../analytics/task-0.5.3.22-atc-treemap.md)

---

**Last Updated:** 2026-01-12  
**Created By:** Emma (UI/UX + Next.js Frontend Specialist)  
**Reviewed By:** Fatima (MOH Regulatory Requirements)
