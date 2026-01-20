# Task 0.5.5.2: Compliance Score Detail Page Wireframe

**Status:** ✅ Complete  
**Route:** `/cmc/scores/[id]`  
**File:** `task-0.5.5.2-compliance-score-detail.png`  
**Priority:** 🟡 CMC Module

**Design Approach:** Modern detail page with total score visualization, component breakdown chart/gauge, category-level tips for companies, and workflow status. Professional, accessible, and optimized for compliance score review workflows.

---

## Wireframe Layout

```
┌─────────────────────────────────────────────────────────────┐
│ Home > CMC > Compliance Scores > [Score ID]                 │
│                                                             │
│ Compliance Score - ABC Pharma Inc. - December 2024          │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Workflow Status                                          ││
│ │                                                          ││
│ │ Calculating → Tier 2 Reviewed → Tier 1 Approved → Published ││
│ │     ✓             ✓                ✓              ✓      ││
│ │                                                          ││
│ │ Current Status: Published                                ││
│ │ Published: January 2, 2025                               ││
│ │                                                          ││
│ │ Dispute Window: 30 days (27 days remaining) ⏱          ││
│ │ Regulatory Basis: Law No. 09-08 - 30-day appeal window ││
│ │ Appeal Deadline: [Date + 30 days from publication]     ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Total Score Visualization                                ││
│ │                                                          ││
│ │ ┌─────────────────────────────────────────────────────┐ ││
│ │ │                                                      │ ││
│ │ │          [Circular Gauge: 78/100]                   │ ││
│ │ │                                                      │ ││
│ │ │              Score: 78/100                          │ ││
│ │ │              Grade: Good                            │ ││
│ │ │                                                      │ ││
│ │ │          Trend: ↑ 2.3 (vs November)                 │ ││
│ │ │          Percentile: Top 35%                        │ ││
│ │ │          Rank Band: 25-35%                          │ ││
│ │ │                                                      │ ││
│ │ └─────────────────────────────────────────────────────┘ ││
│ │                                                          ││
│ │ [For Companies: Dispute Window Countdown]               ││
│ │ ⏱ You have 🔴 27 days remaining to dispute this score  ││
│ │ Appeal Deadline: [Date] (Prominently displayed)        ││
│ │ Regulatory Basis: Law No. 09-08 - 30-day appeal window ││
│ │ [Create Dispute]                                        ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ Tabs: [Overview] [Components] [History] [Adjustments]      │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Components Tab (Role-Based Content)                     ││
│ │                                                          ││
│ │ ┌─────────────────────────────────────────────────────┐ ││
│ │ │ Component Breakdown                                  │ ││
│ │ │                                                      │ ││
│ │ │ [Bar Chart: Component Scores]                       │ ││
│ │ │                                                      │ ││
│ │ │ Regulatory Reporting         ████████████ 85/100   │ ││
│ │ │ Stock Threshold Violations   ██████████   75/100   │ ││
│ │ │ Critical Medicine Coverage   ████████████ 88/100   │ ││
│ │ │ Non-Compliance Exposure      ████████████ 82/100   │ ││
│ │ │ Data Quality                 ████████████ 90/100   │ ││
│ │ │ Export Compliance            ████████████ 85/100   │ ││
│ │ │ Replenishment Adherence      ██████████   72/100   │ ││
│ │ │                                                      │ ││
│ │ └─────────────────────────────────────────────────────┘ ││
│ │                                                          ││
│ │ [For Companies: Category-Level Tips]                    ││
│ │ ┌─────────────────────────────────────────────────────┐ ││
│ │ │ Improvement Tips                                     │ ││
│ │ │                                                      │ ││
│ │ │ • Stock Threshold Violations: Improve stock levels  │ ││
│ │ │   to reduce violation frequency.                    │ ││
│ │ │                                                      │ ││
│ │ │ • Replenishment Adherence: Improve replenishment    │ ││
│ │ │   plan compliance to enhance this component.        │ ││
│ │ │                                                      │ ││
│ │ │ [Note: Component weights and formulas are hidden to │ ││
│ │ │  prevent gaming.]                                    │ ││
│ │ └─────────────────────────────────────────────────────┘ ││
│ │                                                          ││
│ │ [For MOH: Component Weights and Formulas]               ││
│ │ ┌─────────────────────────────────────────────────────┐ ││
│ │ │ Component Details Table                              │ ││
│ │ │                                                      │ ││
│ │ │ Component            │ Score │ Weight │ Contribution ││
│ │ │ Regulatory Reporting │ 85    │ 25%    │ 21.25       ││
│ │ │ Stock Threshold      │ 75    │ 20%    │ 15.00       ││
│ │ │ Critical Medicine    │ 88    │ 20%    │ 17.60       ││
│ │ │ Non-Compliance Exp.  │ 82    │ 15%    │ 12.30       ││
│ │ │ Data Quality         │ 90    │ 10%    │ 9.00        ││
│ │ │ Export Compliance    │ 85    │ 5%     │ 4.25        ││
│ │ │ Replenishment        │ 72    │ 5%     │ 3.60        ││
│ │ │ ─────────────────────────────────────────────────── ││
│ │ │ Total                │       │ 100%   │ 78.00       ││
│ │ └─────────────────────────────────────────────────────┘ ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ History Tab                                              ││
│ │                                                          ││
│ │ ┌─────────────────────────────────────────────────────┐ ││
│ │ │ Score History Timeline                               │ ││
│ │ │                                                      │ ││
│ │ │ [Line Chart: Score Trends Over Time]                │ ││
│ │ │                                                      │ ││
│ │ │ 100│                                                 │ ││
│ │ │  90│     ╭─╮                                         │ ││
│ │ │  80│   ╭─╯ ╰─╮  ╭─╮                                 │ ││
│ │ │  70│ ╭─╯     ╰─╯ ╰─╮                                │ ││
│ │ │  60│                                                 │ ││
│ │ │    └─────────────────────────────────────────────    │ ││
│ │ │    Jul  Aug  Sep  Oct  Nov  Dec                      │ ││
│ │ └─────────────────────────────────────────────────────┘ ││
│ │                                                          ││
│ │ ┌─────────────────────────────────────────────────────┐ ││
│ │ │ Recent Score History                                 │ ││
│ │ │                                                      │ ││
│ │ │ • December 2024: 78/100 (Published)                 │ ││
│ │ │ • November 2024: 76/100 (Published)                 │ ││
│ │ │ • October 2024: 74/100 (Published)                  │ ││
│ │ │ • September 2024: 72/100 (Published)                │ ││
│ │ │                                                      │ ││
│ │ │ [View Full History]                                 │ ││
│ │ └─────────────────────────────────────────────────────┘ ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Adjustments Tab (MOH Only)                              ││
│ │                                                          ││
│ │ ┌─────────────────────────────────────────────────────┐ ││
│ │ │ Score Adjustments History                            │ ││
│ │ │                                                      │ ││
│ │ │ No adjustments made.                                 │ ││
│ │ │                                                      │ ││
│ │ │ [If Adjustments Exist]                               │ ││
│ │ │ • January 5, 2025 - Tier 1 Override                 │ ││
│ │ │   Component: Stock Threshold Violations             │ ││
│ │ │   Original: 75/100 → Adjusted: 80/100               │ ││
│ │ │   Reason: "Exceptional circumstances verified"      │ ││
│ │ │   Adjusted by: Fatima Al-Mansouri                    │ ││
│ │ └─────────────────────────────────────────────────────┘ ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ [MOH Actions: Flag Anomalies] [Override Score]             │
│ [Export Score] [View Audit Log]                            │
└─────────────────────────────────────────────────────────────┘
```

---

## Component Specifications

### Page Header
- **Breadcrumbs:** "Home > CMC > Compliance Scores > [Score ID]"
- **Title:** "Compliance Score - [Company Name] - [Period]"
  - **Typography:** 24px, font-weight: 600, color: #111827
- **Actions (Right-aligned):**
  - **Export Button:** Secondary button (export PDF/CSV)
  - **Actions Dropdown:** More actions menu
    - Options: View Audit Log, Print, Download PDF

### Workflow Status Section
- **Layout:** Horizontal timeline showing workflow steps
- **Steps:** Calculating → Tier 2 Reviewed → Tier 1 Approved → Published
- **Visual Indicators:**
  - Completed steps: Green checkmark (✓)
  - Current step: Highlighted with status badge
  - Pending steps: Gray, disabled
- **Current Status Display:**
  - **Status Badge:** Color-coded badge (Published, Under Dispute, etc.)
  - **Published Date:** Publication timestamp
- **Dispute Window Indicator:**
  - **Countdown:** Days remaining to dispute (30-day window)
  - **Visual:** Clock icon (⏱) with countdown
  - **Action:** "Create Dispute" button (if within window)

### Total Score Visualization
- **Layout:** Centered circular gauge or large number display
- **Components:**
  - **Circular Gauge:**
    - **Type:** Donut or circular progress gauge
    - **Value:** Total score (e.g., 78/100)
    - **Color:** Based on score range (green ≥80, yellow 60-79, red <60)
    - **Size:** Large, prominent display (200-300px diameter)
  - **Score Display:**
    - **Score:** "XX/100" format (large, bold)
    - **Grade:** Text label (Excellent ≥90, Good 80-89, Fair 70-79, Poor 60-69, Critical <60)
    - **Trend:** Change vs previous period (↑/↓ with amount)
    - **Percentile:** System-wide percentile ranking
    - **Rank Band:** Anonymized rank band (for companies only, e.g., "25-35%")
- **Styling:**
  - **Card:** White card with shadow
  - **Centered Layout:** Centered on page
  - **Visual Hierarchy:** Score prominently displayed

### Tabs Navigation
- **Tabs:**
  1. **Overview:** Total score and summary
  2. **Components:** Component breakdown and details
  3. **History:** Score history and trends
  4. **Adjustments:** Score adjustments history (MOH only)
- **Styling:** Standard tab navigation with active state indicator

### Components Tab Content

#### For Companies: Category-Level Tips
- **Component Breakdown Chart:**
  - **Type:** Horizontal bar chart
  - **Content:** Component names with scores (no weights)
  - **Visual:** Color-coded bars based on score
  - **Order:** Sorted by score (descending) or by component name
- **Improvement Tips Section:**
  - **Layout:** List of actionable tips
  - **Content:** Tips for components with low scores
  - **Format:** Bullet points with component name and suggestion
  - **Styling:** Light background card
- **Note:**
  - **Text:** "Component weights and formulas are hidden to prevent gaming."
  - **Styling:** Italic, light gray text
  - **Purpose:** Explain why weights are not shown

#### For MOH: Component Weights and Formulas
- **Component Details Table:**
  - **Columns:**
    1. **Component:** Component name
    2. **Score:** Component score (out of 100)
    3. **Weight:** Component weight (percentage)
    4. **Contribution:** Component contribution to total (Score × Weight)
  - **Footer:** Total row showing sum of weights (100%) and total score
  - **Styling:** Table with borders, alternating row colors
- **Component Breakdown Chart:**
  - **Type:** Horizontal bar chart
  - **Content:** Component names with scores and weights
  - **Visual:** Color-coded bars with weight indicators

### History Tab Content
- **Score History Timeline:**
  - **Layout:** Line chart showing score trends over time
  - **Time Period:** Last 6-12 months (configurable)
  - **X-axis:** Months (Jul, Aug, Sep, Oct, Nov, Dec)
  - **Y-axis:** Score (0-100)
  - **Interactive:** Tooltips showing exact values on hover
- **Recent Score History:**
  - **Layout:** List of recent scores
  - **Content:** Period, score, and status for each entry
  - **Actions:** "View Full History" link
  - **Limit:** Show last 5-10 scores

### Adjustments Tab Content (MOH Only)
- **Score Adjustments History:**
  - **Layout:** List of adjustment entries
  - **Content:**
    - Date and adjustment type (Override, Correction)
    - Component affected (if component-specific)
    - Original value → Adjusted value
    - Adjustment reason/justification
    - Adjusted by (user name)
  - **Empty State:**
    - **Message:** "No adjustments made."
  - **Styling:** Timeline-style list with date indicators

### Action Buttons (MOH Only)
- **Flag Anomalies Button:**
  - **Role:** Tier 2 only
  - **Action:** Opens flag anomalies modal
  - **Styling:** Secondary button
- **Override Score Button:**
  - **Role:** Tier 1 only
  - **Action:** Opens override modal
  - **Styling:** Primary button
- **Export Score Button:**
  - **Action:** Export score as PDF or CSV
  - **Styling:** Secondary button
- **View Audit Log Button:**
  - **Action:** Navigate to audit log for this score
  - **Styling:** Link button

---

## Role-Based Access

### Company Users
- **View:** Own company score only
- **Total Score:** Full visualization with gauge, trend, percentile, rank band
- **Components Tab:**
  - Component scores displayed (no weights)
  - Category-level tips shown
  - Weights and formulas hidden
- **History Tab:** Own score history only
- **Adjustments Tab:** Not accessible (MOH only)
- **Actions:**
  - View Score Details
  - Create Dispute (if within 30-day window)
  - Export Score (own data only)
- **Data:**
  - Cannot see component weights (gaming prevention)
  - Cannot see formulas
  - Can see own percentile and rank band (anonymized)

### MOH Tier 1
- **View:** All companies' scores
- **Total Score:** Full visualization with all details
- **Components Tab:**
  - Full component breakdown with weights and formulas
  - Component contribution to total shown
  - All calculation details visible
- **History Tab:** Full score history
- **Adjustments Tab:** Full adjustments history with ability to create adjustments
- **Actions:**
  - Override Score
  - Export Score
  - View Audit Log
  - Generate Reports
- **Data:**
  - Can see all scores, formulas, weights
  - Can see component breakdown for all companies
  - Can override scores with justification

### MOH Tier 2
- **View:** All companies' scores (may be anonymized based on permission)
- **Total Score:** Full visualization with all details
- **Components Tab:**
  - Full component breakdown with weights and formulas (read-only)
  - Component contribution to total shown
- **History Tab:** Full score history
- **Adjustments Tab:** View-only access (cannot create adjustments)
- **Actions:**
  - Flag Anomalies
  - Export Score
  - View Audit Log
  - Generate Reports (read-only)
- **Data:**
  - Can see all scores and component breakdown
  - Can see component weights (read-only)
  - Cannot override scores

---

## State Variations

### Empty State (No Components)
- **Message:** "No component data available"
- **Subtext:** "Component scores are calculated as part of the score calculation process."

### Loading State
- **Skeleton Loaders:** Gauge, chart, and table placeholders
- **Tabs:** Skeleton tab content

### Error State
- **Message:** "Unable to load compliance score"
- **Subtext:** Error message details
- **Action Button:** "Retry"

### Under Dispute State
- **Status Badge:** "Under Dispute" badge (orange/yellow)
- **Dispute Link:** Link to dispute detail page
- **Dispute Window:** Disabled (cannot create new dispute while existing dispute is active)

### No History State
- **Message:** "No score history available"
- **Subtext:** "This is the first calculated score for this company."

### Module Inactive State
- **Message:** "CMC module is not active"
- **Subtext:** "Contact MOH Tier 1 to activate the CMC module"
- **Visual:** Inactive module indicator
- **Note:** Historical data may still be accessible if `has_historical_cmc_data()` returns true

---

## Business Rules

1. **Module Status:** CMC is optional (license-controlled)
2. **Module Activation Check:** Routes check `is_module_active('cmc')` for active module, or `has_historical_cmc_data()` for historical data access
3. **Score Calculation:** Scores calculated monthly on 1st of month (2 AM)
4. **Score Publication:** Only published scores accessible to companies (after Tier 1 approval)
5. **Dispute Window:** Companies have 30 days from publication to submit disputes
6. **Score Visibility:**
   - **Companies:** Exact total score + percentile/rank band (component weights hidden)
   - **MOH:** Full scores with component breakdown and weights
7. **Component Display:**
   - **Companies:** Component scores with category-level tips (weights hidden)
   - **MOH:** Full component breakdown with weights, formulas, and contributions
8. **History Display:** Shows last 6-12 months of scores (configurable)
9. **Trend Calculation:** Compares current score with previous period score
10. **Adjustments:** Only Tier 1 can create adjustments (overrides, corrections)
11. **Anomaly Flagging:** Only Tier 2 can flag anomalies for review
12. **Audit Log:** All score changes logged in audit trail
13. **Export:** Export score as PDF or CSV (includes all data based on role)
14. **Grade Classification:**
    - Excellent: ≥90
    - Good: 80-89
    - Fair: 70-79
    - Poor: 60-69
    - Critical: <60

---

## Related Documents

- [CMC Overview Wireframe](../overview/task-0.5.5.0-cmc-overview.md)
- [Compliance Scores List Wireframe](./task-0.5.5.1-compliance-scores-list.md)
- [Leaderboard Wireframe](./task-0.5.5.3-leaderboard.md)
- [Score Review Tier 2 Flag Anomalies Modal](./task-0.5.5.4-score-review-tier2-flag-anomalies.md)
- [Score Review Tier 1 Override Modal](./task-0.5.5.5-score-review-tier1-override.md)
- [Compliance Disputes List Wireframe](../disputes/task-0.5.5.6-compliance-disputes-list.md)
- [Routing Structure](../../../02-architecture/frontend/routing-structure.md) - CMC routes
- [CMC Component Weights](../../../02-architecture/modules/cmc-component-weights.md) - Score component definitions
- [Role-Based UI Patterns](../../../02-architecture/frontend/role-based-ui-patterns.md) - Score visibility rules

---

**Last Updated:** 2025-01-15  
**Owner:** Emma (UI/UX + Next.js Frontend Specialist)  
**Guided by:** Fatima (MOH Regulatory Requirements) & Dr. Samir (Business Process Validation)

