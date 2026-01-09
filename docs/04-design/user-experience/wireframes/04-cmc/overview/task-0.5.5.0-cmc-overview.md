# Task 0.5.5.0: CMC Overview Page Wireframe

**Status:** ✅ Complete  
**Route:** `/cmc`  
**File:** `task-0.5.5.0-cmc-overview.png`  
**Priority:** 🟡 CMC Module

**Design Approach:** Module overview dashboard with compliance overview, score trends, and quick links. Professional, accessible, and optimized for compliance monitoring workflows.

---

## Wireframe Layout

```
┌─────────────────────────────────────────────────────────────┐
│ Home > CMC                                                    │
│                                                             │
│ Compliance Monitoring Center (CMC)                          │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Module Summary                                           ││
│ │                                                          ││
│ │ CMC provides comprehensive compliance scoring, dispute   ││
│ │ management, and regulatory reporting for all companies.  ││
│ │ Scores are calculated monthly based on regulatory        ││
│ │ reporting, stock compliance, and export adherence.       ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐        │
│ │ Compliance  │ │ Average      │ │ Active       │        │
│ │ Scores      │ │ Score        │ │ Disputes     │        │
│ │              │ │              │ │              │        │
│ │ Total: 45   │ │ This Month:  │ │ Total: 8     │        │
│ │ This Month: │ │ 78.5/100     │ │ Pending: 5   │        │
│ │ 45          │ │              │ │ Resolved: 3  │        │
│ │ Published:  │ │ Trend: ↑ 2.3 │ │              │        │
│ │ 45          │ │ (vs last)    │ │              │        │
│ │              │ │              │ │              │        │
│ │ [View All]  │ │              │ │ [View All]   │        │
│ └──────────────┘ └──────────────┘ └──────────────┘        │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Compliance Overview                                      ││
│ │                                                          ││
│ │ Score Distribution                                       ││
│ │                                                          ││
│ │ ┌─────────────────────────────────────────────────────┐ ││
│ │ │ [Bar Chart: Score Ranges]                           │ ││
│ │ │                                                      │ ││
│ │ │ 90-100: ████ (10 companies)                         │ ││
│ │ │ 80-89:  ████████ (18 companies)                     │ ││
│ │ │ 70-79:  ███████ (15 companies)                      │ ││
│ │ │ 60-69:  ███ (5 companies)                           │ ││
│ │ │ <60:    ██ (2 companies) ⚠️                         │ ││
│ │ └─────────────────────────────────────────────────────┘ ││
│ │                                                          ││
│ │ [View Leaderboard] [View Score Details]                  ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Score Trends (Last 6 Months)                            ││
│ │                                                          ││
│ │ ┌─────────────────────────────────────────────────────┐ ││
│ │ │ [Line Chart: Average Score Over Time]               │ ││
│ │ │                                                      │ ││
│ │ │ 100│                                                 │ ││
│ │ │  90│     ╭─╮                                         │ ││
│ │ │  80│   ╭─╯ ╰─╮  ╭─╮                                 │ ││
│ │ │  70│ ╭─╯     ╰─╯ ╰─╮                                │ ││
│ │ │  60│                                                 │ ││
│ │ │  50│                                                 │ ││
│ │ │    └─────────────────────────────────────────────    │ ││
│ │ │    Jul  Aug  Sep  Oct  Nov  Dec                      │ ││
│ │ └─────────────────────────────────────────────────────┘ ││
│ │                                                          ││
│ │ [View Full Trend] [Export Data]                          ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Low Scores Alert (Requires Attention)                    ││
│ │                                                          ││
│ │ ⚠️ 2 Companies Below 60                                  ││
│ │                                                          ││
│ │ • ABC Pharma: 55/100 (Component: Stock violations)      ││
│ │ • XYZ Medical: 48/100 (Component: Reporting compliance) ││
│ │                                                          ││
│ │ [View All Low Scores] [Review Scores] (MOH only)        ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Active Disputes (Requires Action)                        ││
│ │                                                          ││
│ │ ⚠️ 5 Disputes Pending Review                             ││
│ │                                                          ││
│ │ • DISP-2025-001: ABC Pharma - Component dispute (2d)     ││
│ │ • DISP-2025-003: DEF Corp - Total score dispute (5d)     ││
│ │ • DISP-2025-005: GHI Ltd - Component dispute (1d)        ││
│ │                                                          ││
│ │ [View All Disputes] [Review Disputes] (MOH only)        ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Quick Links                                              ││
│ │                                                          ││
│ │ [Compliance Scores] [Leaderboard] [Disputes] [Reports] ││
│ │ [Score History] [Dispute History]                       ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Recent Activity                                          ││
│ │                                                          ││
│ │ • December 2024 scores published (2 hours ago)          ││
│ │ • Dispute DISP-2025-006 resolved (1 day ago)            ││
│ │ • Score reviewed by Tier 2 (2 days ago)                 ││
│ │ • Quarterly report generated (3 days ago)               ││
│ │                                                          ││
│ │ [View Full History]                                     ││
│ └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

---

## Component Specifications

### Page Header
- **Breadcrumbs:** "Home > CMC"
- **Title:** "Compliance Monitoring Center (CMC)"
  - **Typography:** 24px, font-weight: 600, color: #111827
- **Module Badge:** "Optional Module" badge (gray, shown only when active)

### Module Summary Card
- **Content:** Brief description of CMC module purpose
- **Text:** Explains that CMC provides comprehensive compliance scoring, dispute management, and regulatory reporting
- **Layout:** Card with descriptive text
- **Styling:** Light background (#f9fafb), padding 16px

### Statistics Cards (3-column grid)
- **Layout:** Responsive grid (3 columns desktop, 1 column mobile)
- **Cards:**
  1. **Compliance Scores Card:**
     - Total scores count
     - This month count
     - Published count
     - "View All" button
  2. **Average Score Card:**
     - This month average score (out of 100)
     - Trend indicator (↑/↓) with change vs last month
     - Visual trend indicator
  3. **Active Disputes Card:**
     - Total disputes count
     - Pending count
     - Resolved count
     - "View All" button
- **Styling:** White cards with border, hover effect

### Compliance Overview Card
- **Layout:** Card with score distribution visualization
- **Content:**
  - Horizontal bar chart showing score ranges (90-100, 80-89, 70-79, 60-69, <60)
  - Company counts for each range
  - Warning indicator (⚠️) for low scores (<60)
- **Actions:**
  - "View Leaderboard" button
  - "View Score Details" button
- **Styling:** Chart with color coding (green for high scores, red for low scores)

### Score Trends Card
- **Layout:** Card with line chart
- **Content:**
  - Line chart showing average score over last 6 months
  - X-axis: Months (Jul, Aug, Sep, Oct, Nov, Dec)
  - Y-axis: Score (0-100)
- **Actions:**
  - "View Full Trend" button
  - "Export Data" button
- **Styling:** Interactive chart with tooltips

### Low Scores Alert Card
- **Layout:** Prominent alert card
- **Content:**
  - Count of companies below 60
  - List of low-scoring companies (top 3-5)
  - Each shows company name, score, and problematic component
- **Actions:**
  - "View All Low Scores" button
  - "Review Scores" button (MOH only)
- **Styling:** Orange/yellow alert styling for low scores

### Active Disputes Alert Card
- **Layout:** Prominent alert card
- **Content:**
  - Pending disputes count
  - List of recent disputes (top 3-5)
  - Each shows dispute ID, company, type, and days pending
- **Actions:**
  - "View All Disputes" button
  - "Review Disputes" button (MOH only)
- **Styling:** Orange/yellow alert styling for pending actions

### Quick Links Section
- **Layout:** Horizontal button group
- **Links:**
  - Compliance Scores
  - Leaderboard
  - Disputes
  - Reports
  - Score History
  - Dispute History
- **Styling:** Button group with icons (optional)
- **Responsive:** Wraps on mobile

### Recent Activity Section
- **Layout:** Card with activity list
- **Content:** Chronological list of recent CMC activities
- **Each Entry Shows:**
  - Activity description
  - Timestamp (relative time)
- **Actions:**
  - "View Full History" link
- **Limit:** Show last 5-10 activities

---

## Role-Based Access

### Company Users
- **View:** Own company statistics only
- **Statistics:**
  - Own compliance scores
  - Own disputes
  - System-wide average (anonymized)
- **Score Distribution:** Anonymized (percentile/rank band only)
- **Score Trends:** System-wide trends (anonymized)
- **Low Scores Alert:** Not shown (only own score if below 60)
- **Active Disputes:** Own disputes only
- **Quick Links:** Filtered to accessible pages
- **Recent Activity:** Own company activities only
- **Actions:** Can view own scores, create disputes, view own disputes

### MOH Tier 1
- **View:** System-wide statistics
- **Statistics:**
  - All compliance scores
  - All disputes
  - System-wide averages
- **Score Distribution:** Full distribution with company names
- **Score Trends:** System-wide trends
- **Low Scores Alert:** All companies below 60
- **Active Disputes:** All pending disputes
- **Quick Links:** All links available
- **Recent Activity:** System-wide activities
- **Actions:** Can review scores, override scores, resolve disputes, generate reports

### MOH Tier 2
- **View:** System-wide statistics
- **Statistics:**
  - All compliance scores
  - All disputes
  - System-wide averages
- **Score Distribution:** Full distribution with company names (may be anonymized based on permission)
- **Score Trends:** System-wide trends
- **Low Scores Alert:** All companies below 60
- **Active Disputes:** All pending disputes
- **Quick Links:** All links available (no override actions)
- **Recent Activity:** System-wide activities
- **Actions:** Can flag anomalies, review disputes, generate reports

---

## State Variations

### Empty State (No Data)
- **Message:** "No CMC data available"
- **Subtext:** "Scores will be calculated monthly after module activation"
- **Action Button:** "View Module Status" (if applicable)

### Module Inactive State
- **Message:** "CMC module is not active"
- **Subtext:** "Contact MOH Tier 1 to activate the CMC module"
- **Visual:** Inactive module indicator
- **Note:** Historical data may still be accessible if `has_historical_cmc_data()` returns true

### Loading State
- **Skeleton Loaders:** Cards with skeleton placeholders
- **Statistics:** Skeleton numbers
- **Charts:** Skeleton chart placeholders
- **Activity:** Skeleton list items

### Error State
- **Message:** "Unable to load CMC overview"
- **Subtext:** Error message details
- **Action Button:** "Retry"

### No Low Scores State
- **Message:** "✓ All companies above 60"
- **Styling:** Green success styling
- **Subtext:** "All companies meet minimum compliance threshold"

### No Pending Disputes State
- **Message:** "✓ No pending disputes"
- **Styling:** Green success styling
- **Subtext:** "All disputes have been resolved"

---

## Widgets and Metrics

### Compliance Scores Statistics
- **Total:** Count of all compliance scores
- **This Month:** Count of scores for current month
- **Published:** Count of published scores (approved and published)

### Average Score Statistics
- **This Month:** Average score for current month (0-100)
- **Trend:** Change vs previous month (↑/↓ with percentage)
- **Visual Indicator:** Up/down arrow with color (green for increase, red for decrease)

### Active Disputes Statistics
- **Total:** Count of all disputes
- **Pending:** Count of disputes pending review (by status: submitted, tier2_reviewed)
- **Resolved:** Count of resolved disputes (upheld, rejected)

### Score Distribution
- **Ranges:** 90-100, 80-89, 70-79, 60-69, <60
- **Company Counts:** Number of companies in each range
- **Color Coding:** Green (90-100), Light green (80-89), Yellow (70-79), Orange (60-69), Red (<60)
- **Warning:** ⚠️ indicator for scores below 60

### Score Trends
- **Time Period:** Last 6 months
- **Metric:** Average system-wide score
- **Chart Type:** Line chart
- **Interactive:** Tooltips showing exact values on hover

---

## Business Rules

1. **Module Status:** CMC is optional (license-controlled)
2. **Module Activation Check:** Routes check `is_module_active('cmc')` for active module, or `has_historical_cmc_data()` for historical data access
3. **Statistics:** Real-time counts from database
4. **Score Calculation:** Scores calculated monthly on 1st of month (2 AM)
5. **Score Publication:** Scores published after Tier 1 approval
6. **Activity Feed:** Shows last 5-10 activities
7. **Role-Based Filtering:** Statistics filtered by user role
8. **Quick Links:** Links to key CMC pages
9. **Navigation:** Overview page serves as CMC module landing page
10. **Score Distribution:** Based on latest published scores for current month
11. **Trend Calculation:** Compares current month average with previous month average
12. **Low Score Threshold:** Companies below 60/100 are flagged for attention
13. **Dispute Window:** Companies have 30 days from score publication to submit disputes

---

## Related Documents

- [Compliance Scores List Wireframe](../scores/task-0.5.5.1-compliance-scores-list.md)
- [Compliance Score Detail Wireframe](../scores/task-0.5.5.2-compliance-score-detail.md)
- [Leaderboard Wireframe](../scores/task-0.5.5.3-leaderboard.md)
- [Compliance Disputes List Wireframe](../disputes/task-0.5.5.6-compliance-disputes-list.md)
- [Reports List Wireframe](../reports/task-0.5.5.10-reports-list.md)
- [Routing Structure](../../../02-architecture/frontend/routing-structure.md) - CMC routes
- [CMC Component Weights](../../../02-architecture/modules/cmc-component-weights.md) - Score component definitions
- [Workflow Architecture](../../../02-architecture/workflow-architecture.md) - Compliance Score Calculation Workflow

---

**Last Updated:** 2025-01-15  
**Owner:** Emma (UI/UX + Next.js Frontend Specialist)  
**Guided by:** Fatima (MOH Regulatory Requirements) & Dr. Samir (Business Process Validation)

