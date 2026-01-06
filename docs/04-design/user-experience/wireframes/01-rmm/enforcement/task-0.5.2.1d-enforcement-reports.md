# Task 0.5.2.1d: Enforcement Reports Page Wireframe

**Status:** 🟡 In Progress  
**Route:** `/enforcement/reports` (MOH Tier 1 and Tier 2 only)  
**File:** `task-0.5.2.1d-enforcement-reports.png`  
**Priority:** 🔴 Core RMM Workflows

**Design Approach:** Modern analytics dashboard with charts, trends, and exportable reports. Professional, accessible, and optimized for MOH governance reporting and analysis.

---

## Wireframe Layout

```
┌─────────────────────────────────────────────────────────────┐
│ Home > Enforcement > Reports                                │
│                                                             │
│ Enforcement Reports                    [Export Report]      │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Date Range: [Last 30 Days ▼] [Custom Range]             ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐│
│ │ Total Actions   │ │ By Action Type   │ │ By Violation    ││
│ │                 │ │                  │ │ Type            ││
│ │       60        │ │                  │ │                 ││
│ │                 │ │  Warning: 45     │ │ Submission: 25  ││
│ │ ↗ +12% vs last │ │  Fine: 12        │ │ Threshold: 18   ││
│ │    period       │ │  Suspension: 3    │ │ Critical: 8     ││
│ │                 │ │                  │ │ Export: 5       ││
│ │                 │ │ [Chart: Pie]     │ │ Data Quality: 3 ││
│ │                 │ │                  │ │ Repeated: 1     ││
│ │                 │ │                  │ │                 ││
│ └─────────────────┘ └─────────────────┘ └─────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Enforcement Trends (Last 12 Months)                      ││
│ │                                                          ││
│ │ [Line Chart: Actions over time by type]                  ││
│ │                                                          ││
│ │ Legend: Warning | Fine | Suspension                     ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Top Companies by Enforcement Actions                     ││
│ │                                                          ││
│ │ 1. ABC Pharmaceuticals Inc. - 8 actions                ││
│ │ 2. XYZ Pharma Ltd. - 6 actions                          ││
│ │ 3. DEF Medical Supplies - 5 actions                     ││
│ │ 4. GHI Inc. - 4 actions                                 ││
│ │ 5. JKL Ltd. - 3 actions                                 ││
│ │                                                          ││
│ │ [View All Companies]                                    ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Fine Amount Analysis                                     ││
│ │                                                          ││
│ │ Total Fines: 45,000 MAD                                  ││
│ │ Average Fine: 3,750 MAD                                 ││
│ │ Highest Fine: 10,000 MAD                                ││
│ │                                                          ││
│ │ [Bar Chart: Fine amounts by month]                      ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Appeal Statistics                                        ││
│ │                                                          ││
│ │ Total Appeals: 5                                        ││
│ │ Upheld: 1 (20%)                                         ││
│ │ Rejected: 4 (80%)                                       ││
│ │                                                          ││
│ │ [Pie Chart: Appeal outcomes]                            ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ Tabs: [Overview] [Trends] [Companies] [Appeals]            │
└─────────────────────────────────────────────────────────────┘
```

---

## Component Specifications

### Page Header
- **Breadcrumbs:** "Home > Enforcement > Reports"
- **Title:** "Enforcement Reports"
  - **Typography:** 24px, font-weight: 600, color: #111827
- **Actions (Right-aligned):**
  - **Export Report Button:** Primary button
    - **Dropdown Options:** PDF, Excel, CSV
    - **Click Action:** Export report with current filters

### Date Range Selector
- **Layout:** Horizontal bar with date range controls
- **Quick Filters:** Last 7 days, Last 30 days, Last 90 days, Last 12 months
- **Custom Range:** Date range picker button
- **Default:** Last 30 days
- **Functionality:** Updates all charts and metrics when changed

### Metrics Cards (Top Row)
- **Layout:** 3-column grid (desktop), 1-column (mobile)
- **Gap:** 24px between cards

**Total Actions Card:**
- **Title:** "Total Actions"
- **Count:** Large number (e.g., "60")
  - **Typography:** 32px, font-weight: 700, color: #111827
- **Trend Indicator:** Percentage change vs previous period
  - **Format:** "↗ +12% vs last period"
  - **Color:** Green for increase, red for decrease

**By Action Type Card:**
- **Title:** "By Action Type"
- **Breakdown:** List or pie chart
  - Warning: 45
  - Fine: 12
  - Suspension: 3
- **Visual:** Pie chart or horizontal bar chart

**By Violation Type Card:**
- **Title:** "By Violation Type"
- **Breakdown:** List of violation types with counts
  - Submission Non-Compliance: 25
  - Threshold Breach: 18
  - Critical Medicine Non-Compliance: 8
  - Export Violation: 5
  - Data Quality Issue: 3
  - Repeated Offender: 1

### Trends Chart Section
- **Title:** "Enforcement Trends (Last 12 Months)"
- **Chart Type:** Line chart
- **Data:** Actions over time, grouped by action type
- **X-Axis:** Months
- **Y-Axis:** Number of actions
- **Legend:** Warning, Fine, Suspension (color-coded)
- **Interactivity:** Hover to see exact values

### Top Companies Section
- **Title:** "Top Companies by Enforcement Actions"
- **Layout:** Ranked list
- **Format:** Number, Company name, action count
- **Max Items:** Top 5-10 companies
- **Action Link:** "View All Companies" (navigate to filtered actions list)

### Fine Amount Analysis Section
- **Title:** "Fine Amount Analysis"
- **Metrics:**
  - Total Fines: Sum of all fines
  - Average Fine: Average fine amount
  - Highest Fine: Maximum fine amount
- **Chart:** Bar chart showing fine amounts by month
- **Visual:** Bar chart with values

### Appeal Statistics Section
- **Title:** "Appeal Statistics"
- **Metrics:**
  - Total Appeals: Count of appeals
  - Upheld: Count and percentage
  - Rejected: Count and percentage
- **Chart:** Pie chart showing appeal outcomes
- **Visual:** Pie chart with percentages

### Tabs
- **Tabs:** Overview (default), Trends, Companies, Appeals
- **Tab Content:**
  - **Overview:** Summary metrics and charts (default view)
  - **Trends:** Detailed trend analysis
  - **Companies:** Company-specific enforcement data
  - **Appeals:** Appeal statistics and analysis

---

## Role-Based Access

### MOH Tier 1
- **Full Access:** Can view all reports, export reports
- **Actions:** Export, customize date ranges

### MOH Tier 2
- **View Access:** Can view all reports
- **Limited Actions:** Can export reports (read-only)

---

## State Variations

### Loading State
- **Skeleton:** Placeholder charts and metrics with shimmer effect
- **Count:** Match expected chart/metric count

### Error State
- **Message:** "Unable to load enforcement reports"
- **Action:** "Retry" button

### Empty State (No Data)
- **Message:** "No enforcement data for selected period"
- **Action:** "Change Date Range" button

---

## Responsive Design

### Desktop (≥1024px)
- **Layout:** 3-column grid for metrics
- **Charts:** Full-width charts
- **Sections:** Side-by-side where appropriate

### Tablet (768px - 1023px)
- **Layout:** 2-column grid for metrics
- **Charts:** Full-width charts
- **Sections:** Stacked

### Mobile (<768px)
- **Layout:** 1-column stack for metrics
- **Charts:** Full-width, simplified charts
- **Sections:** Stacked

---

## Interactions

### Click Actions
- **Export Report:** Open export modal or direct download
- **Date Range:** Update all charts and metrics
- **Chart Elements:** Hover to see tooltips, click to drill down (if implemented)
- **Top Companies Link:** Navigate to filtered actions list

### Export Functionality
- **Format Options:** PDF, Excel, CSV
- **Content:** Current view with applied filters
- **Modal:** Export options modal (if needed)

### Chart Interactions
- **Hover:** Show tooltips with exact values
- **Click:** Drill down to detailed view (if implemented)
- **Zoom:** Zoom in on time periods (if implemented)

---

## Design System References

- [UI Component Specifications](../../../../02-architecture/frontend/ui-component-specifications.md) - Charts, cards, tables
- [Role-Based UI Patterns](../../../../02-architecture/frontend/role-based-ui-patterns.md) - Role-based access
- [Regulatory Framework](../../../../03-governance/regulatory-framework.md) - Comprehensive regulatory reference including DMP regulations
- [Compliance Requirements](../../../../03-governance/compliance-requirements.md) - Detailed compliance requirements including enforcement action requirements
- [Regulatory Policies](../../../../03-governance/regulatory-policies.md) - Regulatory policies including enforcement and reporting policies

---

## Related Wireframes

- [Enforcement Dashboard](task-0.5.2.0-enforcement-dashboard.md)
- [Enforcement Actions List](task-0.5.2.1-enforcement-actions-list.md)

---

**Next:** RMM Core Workflows

