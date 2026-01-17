# Task 0.5.3.20: Governance Dashboard Wireframe

**Status:** 🟡 In Progress  
**Route:** `/vci/governance` or `/vci/dashboard`  
**File:** `task-0.5.3.18-governance-dashboard.png`  
**Note:** File name uses 0.5.3.18 but task number is 0.5.3.20 per phase-0-5-ui-ux-wireframes.md  
**Priority:** 🔴 Critical VCI Workflows

**Design Approach:** Modern enterprise dashboard with VCI-specific metrics, compliance monitoring, compliance violation trends, and submission status overview. Professional, accessible, and optimized for MOH governance oversight workflows.

---

## Wireframe Layout

```
┌─────────────────────────────────────────────────────────────┐
│ Home > VCI > Governance Dashboard                           │
│                                                             │
│ VCI Governance Dashboard              [Date Range ▼] [Refresh]│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Quick Actions                                            ││
│ │ [View All Submissions] [View All Compliance Violations] [Export] ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐        ││
│ │ Submission   │ │ Compliance    │ │ Compliance    │        ││
│ │ Status       │ │ Violations    │ │ Violation     │        ││
│ │              │ │               │ │ Trends        │        ││
│ │              │ │               │ │               │        ││
│ │ AAMS: 245    │ │ Active: 15    │ │ This Week: 8  │        ││
│ │ • Completed: │ │ • High: 5      │ │ • High: 3     │        ││
│ │   200        │ │ • Medium: 7    │ │ • Medium: 4   │        ││
│ │ • Pending:   │ │ • Low: 3       │ │ • Low: 1      │        ││
│ │   45         │ │                │ │               │        ││
│ │              │ │ WSL: 1,234     │ │ Last Week: 12 │        ││
│ │ WSL: 1,234   │ │ • On-Time:     │ │ Trend: ↓ 33%  │        ││
│ │ • On-Time:   │ │   1,100        │ │               │        ││
│ │   1,100      │ │ • Late: 100   │ │ [View Trends] │        ││
│ │ • Late: 100  │ │ • Missing: 34  │ │               │        ││
│ │ • Missing: 34│ │                │ │               │        ││
│ │              │ │ MSQ: 45        │ │               │        ││
│ │ MSQ: 45      │ │ • Complete: 40 │ │               │        ││
│ │ • Complete:  │ │ • Incomplete: 5│ │               │        ││
│ │   40         │ │                │ │               │        ││
│ │ • Incomplete:│ │ [View All →]  │ │               │        ││
│ │   5          │ │                │ │               │        ││
│ │              │ │                │ │               │        ││
│ │ [View All →]│ │                │ │               │        ││
│ └──────────────┘ └──────────────┘ └──────────────┘        ││
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Submission Compliance Trend (Last 30 Days)                ││
│ │                                                          ││
│ │ [Line Chart: %SC over time]                             ││
│ │                                                          ││
│ │ X-Axis: Days (1-30)                                      ││
│ │ Y-Axis: %SC (0-100%)                                    ││
│ │ Threshold Line: 75% (dashed red)                        ││
│ │ Current: 82% 🟢 Above Threshold                        ││
│ │                                                          ││
│ │ [View Full Report]                                      ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Compliance Violation Detection by Type (Last 30 Days)    ││
│ │                                                          ││
│ │ [Horizontal Bar Chart - Sorted by frequency]            ││
│ │                                                          ││
│ │ Stock Below Threshold        ████████████ 45            ││
│ │ Critical Medicine Violation  ████████ 28               ││
│ │ Multiple SKU Violation       ██████ 18                ││
│ │ Extended Duration Violation  ████ 12                  ││
│ │                                                          ││
│ │ [Click bar to filter by compliance violation type]     ││
│ │ [View All Compliance Violations]                       ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Pending Actions                                          ││
│ │                                                          ││
│ │ Tier 2 Analysis: 8 violations                           ││
│ │ • SKU002 - High Priority - Replen. 25/01/25 - 2 days ago││
│ │ • SKU003 - Medium Priority - Replen. 28/01/25 - 1 day ago││
│ │ • SKU005 - High Priority - Replen. 30/01/25 - 3 hours ago││
│ │                                                          ││
│ │ Tier 1 Approval: 5 actions                              ││
│ │ • Warning - ABC Pharma - Replen. 25/01/25 - Analyzed 1 day ago││
│ │ • Fine - XYZ Corp - Replen. 28/01/25 - Analyzed 2 days ago││
│ │                                                          ││
│ │ [View All Pending →]                                    ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Threshold Reversion Status                              ││
│ │                                                          ││
│ │ Pending Reversions: 8                                   ││
│ │ • 5 Auto-Revert (7 days)                                ││
│ │ • 3 Manual Review (2 days)                              ││
│ │                                                          ││
│ │ Reversions This Month: 12                                ││
│ │ • 10 Auto-Reverted                                      ││
│ │ • 2 Manual Confirmed                                    ││
│ │                                                          ││
│ │ [View Pending Reversions] [View Reversion History]     ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Company Compliance Ranking                              ││
│ │                                                          ││
│ │ [Table: Top 10 companies by compliance score]         ││
│ │                                                          ││
│ │ Rank  Company              Score  Submissions  Breaches ││
│ │ ────  ────────             ─────  ───────────  ────────││
│ │ 1     ABC Pharma           98%    245/245      0        ││
│ │ 2     XYZ Corp             95%    240/245      2        ││
│ │ 3     DEF Medical          92%    230/245      5        ││
│ │ ...                                                      ││
│ │                                                          ││
│ │ [View Full Ranking]                                     ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ℹ️ All metrics are calculated per DMP regulatory          ││
│    requirements. [View Regulatory Framework]              ││
└─────────────────────────────────────────────────────────────┘
```

---

## Component Specifications

### Page Header
- **Breadcrumbs:** "Home > VCI > Governance Dashboard"
- **Title:** "VCI Governance Dashboard"
  - **Typography:** 24px, font-weight: 600, color: #111827
- **Actions (Right-aligned):**
  - **Date Range Selector:** Dropdown (Last 7 days, Last 30 days, Last 90 days, Custom)
  - **Refresh Button:** Secondary button (refresh all data)
  - **Spacing:** 16px between actions

### Quick Actions Bar
- **Layout:** Horizontal bar with action buttons
- **Actions:**
  - **View All Submissions:** Link to submissions list
  - **View All Compliance Violations:** Link to compliance violations list
  - **Export:** Export dashboard data (CSV, PDF)
- **Styling:** Secondary buttons, consistent spacing

### Widget Grid (Top Row)
- **Layout:** 3-column grid (desktop), 1-column (mobile)
- **Gap:** 24px between widgets
- **Widget Height:** Auto (min 200px)

**Submission Status Widget:**
- **Title:** "Submission Status"
- **Sections:**
  - **AAMS:** Total count, breakdown (Completed, Pending)
  - **WSL:** Total count, breakdown (On-Time, Late, Missing)
  - **MSQ:** Total count, breakdown (Complete, Incomplete)
- **Visual Indicators:**
  - Color-coded badges for statuses
  - Counts with percentages
- **Action Link:** "View All →" (navigate to submissions list)

**Compliance Violations Widget:**
- **Title:** "Compliance Violations"
- **Active Count:** Total active violations
- **Priority Breakdown:**
  - High: Count with badge
  - Medium: Count with badge
  - Low: Count with badge
- **Submission Status:**
  - WSL breakdown (On-Time, Late, Missing)
  - MSQ breakdown (Complete, Incomplete)
- **Action Link:** "View All →" (navigate to violations list)

**Compliance Violation Trends Widget:**
- **Title:** "Compliance Violation Trends"
- **This Week:** Count with priority breakdown
- **Last Week:** Count with trend indicator (↑/↓ percentage)
- **Trend Analysis:** Visual trend indicator
- **Action Link:** "View Trends →" (navigate to trends report)

### Submission Compliance Trend Chart
- **Layout:** Full-width line chart
- **Chart Type:** Line chart with threshold line
- **Data:**
  - X-Axis: Days (1-30)
  - Y-Axis: %SC (0-100%)
  - Threshold Line: 75% (dashed red line)
  - Current Value: Displayed with status indicator
- **Visual Indicators:**
  - Green if above threshold
  - Red if below threshold
- **Action Link:** "View Full Report →"

### Compliance Violation Detection by Type Chart
- **Layout:** Full-width horizontal bar chart
- **Chart Type:** Horizontal bar chart
- **Data:**
  - Compliance violation types sorted by frequency
  - Count for each type
- **Interactivity:**
  - Click bar to filter by compliance violation type
  - Hover for details
- **Action Link:** "View All Compliance Violations →"

### Pending Actions Section
- **Layout:** Card with two subsections
- **Tier 2 Analysis:**
  - Count of violations pending analysis
  - List of top 3-5 violations with:
    - SKU code
    - Priority badge
    - Replenishment Date (from WSL submission, format: DD/MM/YY)
    - Age (days/hours since detection)
    - Format: "SKU002 - High Priority - Replen. 25/01/25 - 2 days ago"
- **Tier 1 Approval:**
  - Count of actions pending approval
  - List of top 3-5 actions with:
    - Action type (Warning, Fine, Suspension)
    - Company name
    - Replenishment Date (from WSL submission, format: DD/MM/YY)
    - Age (days/hours since analysis)
    - Format: "Warning - ABC Pharma - Replen. 25/01/25 - Analyzed 1 day ago"
- **Action Link:** "View All Pending →"
- **Purpose:** Show expected resolution timeline for prioritization

### Company Compliance Ranking Table
- **Layout:** Table with top 10 companies
- **Columns:**
  1. **Rank:** Ranking number
  2. **Company:** Company name (link to company detail)
  3. **Score:** Compliance score percentage
  4. **Submissions:** Submission completion (e.g., "245/245")
  5. **Compliance Violations:** Total compliance violation count
- **Sorting:** By compliance score (descending)
- **Visual Indicators:**
  - Color-coded scores (green for high, yellow for medium, red for low)
- **Action Link:** "View Full Ranking →"

### Compliance Information Banner
- **Display:** Info banner at bottom (collapsible)
- **Content:**
  - Regulatory basis for metrics
  - Regulatory framework link
- **Styling:** Light blue background (#eff6ff), info icon, dismissible

---

## Role-Based Access

### MOH Tier 1
- **Full Access:** Can view all metrics and data
- **Actions:** View all submissions, breaches, export data
- **Pending Actions:** Can see Tier 1 approval queue

### MOH Tier 2
- **View Access:** Can view all metrics and data
- **Actions:** View all submissions, breaches, export data
- **Pending Actions:** Can see Tier 2 analysis queue

### Company Users
- **Limited Access:** Can view own company metrics only
- **Filtered Data:** All widgets show only own company data
- **No Access:** Cannot view other companies' data or pending actions

---

## State Variations

### Normal State (All Metrics Healthy)
- **%SC:** Above threshold (green indicator)
- **Breaches:** Low count, manageable
- **Submissions:** High on-time rate

### Warning State (%SC Below Threshold)
- **%SC:** Below threshold (red indicator)
- **Warning Banner:** Prominent warning about %SC
- **Urgency Indicators:** Highlighted pending actions

### Critical State (High Compliance Violation Count)
- **Compliance Violations:** High count with many high-priority
- **Urgency Indicators:** Critical compliance violation alerts
- **Pending Actions:** High count in queues

---

## Responsive Design

### Desktop (≥1024px)
- **Layout:** 3-column widget grid
- **Charts:** Full-width
- **Table:** Full-width with all columns

### Tablet (768px - 1023px)
- **Layout:** 2-column widget grid
- **Charts:** Full-width, responsive
- **Table:** Horizontal scroll if needed

### Mobile (<768px)
- **Layout:** Single column
- **Widgets:** Stacked vertically
- **Charts:** Simplified or hidden
- **Table:** Card-based layout

---

## Interactions

### Click Actions
- **Widget Links:** Navigate to relevant list pages
- **Chart Elements:** Filter by selected type/date
- **Company Name:** Navigate to company detail
- **Pending Action Items:** Navigate to action detail
- **Export Button:** Trigger data export

### Hover States
- **Chart Elements:** Show tooltip with details
- **Table Rows:** Background color change
- **Links:** Underline on hover

### Keyboard Navigation
- **Tab:** Navigate through widgets and links
- **Enter:** Activate selected element
- **Arrow Keys:** Navigate table rows (if implemented)

---

## Design System References

### Components Used
- **Card Component:** Widget cards (shadcn/ui card)
- **Table Component:** Company ranking table (shadcn/ui table)
- **Chart Component:** Line chart, bar chart (chart library, e.g., Recharts)
- **Badge Component:** Status badges, priority badges (shadcn/ui badge)
- **Button Component:** Action buttons (shadcn/ui button)
- **Icon Component:** Trend icons, status icons (Lucide React via shadcn/ui)
- **Alert Component:** Compliance information banner (shadcn/ui alert)

### Design Inspiration References
- **Stripe Dashboard:** https://dashboard.stripe.com - Professional dashboard patterns
- **GitHub:** https://github.com - Clean dashboards, metric displays
- **Linear App:** https://linear.app - Modern dashboards, smooth interactions
- **shadcn/ui Components:** https://ui.shadcn.com - Component patterns

### Colors (From Design System)
- **Background:** #ffffff (white) - Clean, professional
- **Card Border:** #e5e7eb (border-default) - Subtle separation
- **Text Primary:** #111827 (text-primary) - High contrast
- **Text Secondary:** #6b7280 (text-secondary)
- **Status Colors:**
  - On-Time/Complete: #10b981 (success-500) - Green
  - Late/Incomplete: #fbbf24 (warning-500) - Yellow
  - Missing/Critical: #ef4444 (error-500) - Red
- **Priority Badge Colors:**
  - High: #ef4444 (error-500) - Red
  - Medium: #fbbf24 (warning-500) - Yellow
  - Low: #10b981 (success-500) - Green
- **Chart Colors:**
  - %SC Line: #3b82f6 (primary-500) - Blue
  - Threshold Line: #ef4444 (error-500) - Red (dashed)
  - Compliance Violation Bars: #f97316 (orange-500) - Orange

### Typography (From Design System)
- **Page Title:** 24px, font-weight: 600, color: #111827
- **Widget Title:** 18px, font-weight: 600
- **Metric Value:** 32px, font-weight: 700
- **Body Text:** 14px, font-weight: 400
- **Table Header:** 12px, font-weight: 600, uppercase
- **Table Cell:** 14px, font-weight: 400

### Spacing (8px Grid System)
- **Page Padding:** 24px (3 × 8px)
- **Widget Gap:** 24px (3 × 8px) between widgets
- **Section Spacing:** 16px (2 × 8px) between sections
- **Card Padding:** 16px or 24px
- **Button Padding:** 12px horizontal, 8px vertical

### Transitions & Animations
- **Chart Animation:** 300ms ease-in-out (if animated)
- **Widget Hover:** 150ms ease-in-out
- **Button Hover:** 150ms ease-in-out

### Accessibility (WCAG 2.1 AA Compliance)
- **Color Contrast:** Minimum 4.5:1 for text, 3:1 for UI components
- **Focus Indicators:** 2px solid outline, #3b82f6 (primary-500), 2px offset
- **Keyboard Navigation:** Full keyboard support (Tab, Enter, Arrow keys)
- **Screen Reader Support:** ARIA labels, roles, and descriptions
- **Chart Accessibility:** Proper ARIA labels for chart elements, alternative text
- **Table Headers:** Proper table header associations
- **Skip Links:** "Skip to main content" link for keyboard users

---

## Industry Best Practices Implementation

### Performance Optimizations
- **Lazy Loading:** Load chart data on demand
- **Data Aggregation:** Efficient server-side aggregation for metrics
- **Caching:** Cache dashboard data with appropriate TTL (5-10 minutes)
- **Progressive Loading:** Load critical metrics first, then charts

### State Management
- **Dashboard State:** Track date range, filters, refresh state
- **Real-time Updates:** WebSocket or polling for critical metrics (30s interval, optional)
- **Local Storage:** Cache date range preferences

### Error Handling
- **Loading States:** Skeleton loaders for widgets while loading
- **Error Boundaries:** Graceful degradation if data fails to load
- **Retry Logic:** Automatic retry with exponential backoff
- **Fallback:** Default empty state if all else fails

---

## Related Documents

- [Routing Structure](../../../../02-architecture/frontend/routing-structure.md) - Route: `/vci/governance` or `/vci/dashboard`
- [Regulatory Framework](../../../../03-governance/regulatory-framework.md) - Comprehensive regulatory reference including DMP regulations
- [Compliance Requirements](../../../../03-governance/compliance-requirements.md) - Detailed compliance requirements including dashboard metrics
- [Regulatory Policies](../../../../03-governance/regulatory-policies.md) - Regulatory policies including governance policies
- [Dashboard Design Patterns](../../../../02-architecture/frontend/dashboard-design-patterns.md) - Dashboard patterns and best practices
- [UI Component Specifications](../../../../02-architecture/frontend/ui-component-specifications.md) - Card, Table, Chart components
- [Role-Based UI Patterns](../../../../02-architecture/frontend/role-based-ui-patterns.md) - Role-based access

---

## Related Wireframes

- [VCI Overview](task-0.5.3.0-vci-overview.md) - VCI module overview
- [AAMS Submissions List](../aams/task-0.5.3.1-aams-submissions-list.md) - AAMS submissions list
- [WSL Submissions List](../wsl/task-0.5.3.11-wsl-submissions-list.md) - WSL submissions list
- [Compliance Violations List](../breaches/task-0.5.3.14-compliance-violations-list.md) - Compliance violations list
- [MOH Tier 1 Dashboard](../../00-core-foundation/dashboard/task-0.5.1.19-moh-tier1-dashboard.md) - Main MOH dashboard

---

**Status:** ✅ Complete - All Priority 3 wireframes created

