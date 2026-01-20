# Task 0.5.5.1: Compliance Scores List Page Wireframe

**Status:** ✅ Complete  
**Route:** `/cmc/scores`  
**File:** `task-0.5.5.1-compliance-scores-list.png`  
**Priority:** 🟡 CMC Module

**Design Approach:** Modern list page with compliance scores table, period filters, role-based access, and score visualization. Professional, accessible, and optimized for compliance monitoring workflows.

---

## Wireframe Layout

```
┌─────────────────────────────────────────────────────────────┐
│ Home > CMC > Compliance Scores                               │
│                                                             │
│ Compliance Scores                                            │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Filters                                                   ││
│ │                                                          ││
│ │ Period: [2024-12 ▼]  Company: [All Companies ▼]        ││
│ │ Score Range: [All ▼]  Status: [All ▼]                  ││
│ │                                                          ││
│ │ [Apply Filters] [Clear] [Export CSV]                    ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ℹ️ Compliance Scores                                       ││
│    Regulatory Framework (Fatima's Requirement):            ││
│    DMP Regulation Article [X] - Compliance Scoring         ││
│    Legal Basis: [Citation]                                ││
│    Compliance Requirement Reference: [Link]                ││
│    [View Regulatory Framework]                             ││
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Compliance Scores Table                                  ││
│ │                                                          ││
│ │ [Sort: Score ▼] [Sort: Period ▼] [Sort: Company ▼]    ││
│ │                                                          ││
│ │ ┌──────┬─────────────────────┬──────────┬────────┬─────┐│
│ │ │ Period│ Company             │ Score    │ Trend  │ ... ││
│ │ ├──────┼─────────────────────┼──────────┼────────┼─────┤│
│ │ │ 12/24│ ABC Pharma Inc.      │ 85/100   │ ↑ 3.2  │ [>] ││
│ │ │ 11/24│ ABC Pharma Inc.      │ 82/100   │ ↑ 1.5  │ [>] ││
│ │ │ 12/24│ XYZ Medical Corp.    │ 78/100   │ ↓ 2.1  │ [>] ││
│ │ │ 11/24│ XYZ Medical Corp.    │ 80/100   │ → 0.0  │ [>] ││
│ │ │ 12/24│ DEF Healthcare Ltd.  │ 92/100   │ ↑ 5.0  │ [>] ││
│ │ │ 12/24│ GHI Pharmaceuticals  │ 55/100 ⚠│ ↓ 8.5  │ [>] ││
│ │ │ 12/24│ JKL Medical Supply   │ 48/100 ⚠│ ↓ 12.3 │ [>] ││
│ │ └──────┴─────────────────────┴──────────┴────────┴─────┘│
│ │                                                          ││
│ │ Showing 7 of 45 scores                                   ││
│ │ [< Previous] [1] [2] [3] ... [5] [Next >]               ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ [For Companies - Single Score Display]                      │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Your Compliance Score - December 2024                    ││
│ │                                                          ││
│ │ ┌─────────────────────────────────────────────────────┐ ││
│ │ │                                                      │ ││
│ │ │               [Score Gauge: 78/100]                 │ ││
│ │ │                                                      │ ││
│ │ │              Score: 78/100                           │ ││
│ │ │              Trend: ↑ 2.3 (vs November)             │ ││
│ │ │                                                      │ ││
│ │ │              Percentile: Top 35%                     │ ││
│ │ │              Rank Band: 25-35%                       │ ││
│ │ │                                                      │ ││
│ │ └─────────────────────────────────────────────────────┘ ││
│ │                                                          ││
│ │ [View Score Details] [View Leaderboard]                  ││
│ └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

---

## Component Specifications

### Page Header
- **Breadcrumbs:** "Home > CMC > Compliance Scores"
- **Title:** "Compliance Scores"
  - **Typography:** 24px, font-weight: 600, color: #111827
- **Actions (Right-aligned):**
  - **Export Button:** Secondary button (export CSV)
  - **Actions Dropdown:** More actions menu
    - Options: Export PDF, Print, Refresh

### Filters Section
- **Layout:** Horizontal filter bar
- **Filters:**
  1. **Period Dropdown:**
     - Options: All, Current Month, Last 3 Months, Last 6 Months, Last Year, Custom Range
     - Format: YYYY-MM (e.g., 2024-12)
     - Default: Current Month
  2. **Company Dropdown:**
     - Options: All Companies (MOH only), My Company (Company users)
     - Multi-select for MOH users
     - Searchable company list
  3. **Score Range Dropdown:**
     - Options: All, 90-100, 80-89, 70-79, 60-69, <60
     - Default: All
  4. **Status Dropdown:**
     - Options: All, Published, Under Dispute, Pending Review, Tier 2 Reviewed
     - Default: Published (for companies), All (for MOH)
- **Actions:**
  - **Apply Filters:** Primary button
  - **Clear:** Secondary button (reset all filters)
  - **Export CSV:** Secondary button (export filtered results)

### Compliance Scores Table (MOH Users)
- **Layout:** Scrollable table with sortable columns
- **Columns:**
  1. **Period:** Score period (YYYY-MM format, e.g., 2024-12)
  2. **Company:** Company name (link to company detail)
  3. **Score:** Total score out of 100
     - **Format:** "XX/100"
     - **Visual:** Color-coded score (green ≥80, yellow 60-79, red <60)
     - **Warning Icon (⚠️):** For scores below 60
  4. **Trend:** Score change vs previous period
     - **Format:** ↑/↓/→ with change amount (e.g., ↑ 3.2, ↓ 2.1, → 0.0)
     - **Color:** Green for increase, red for decrease, gray for no change
  5. **Status:** Score status badge
     - Options: Published, Under Dispute, Pending Review, Tier 2 Reviewed
  6. **Actions:** Expand button ([>]) to view details
- **Features:**
  - **Sortable Columns:** Click column header to sort
  - **Pagination:** Shows "Showing X of Y scores"
  - **Row Count:** Display total count
  - **Expandable Rows:** Click action button to expand and show component breakdown
- **Styling:**
  - **Table:** White background with borders
  - **Hover:** Row highlight on hover
  - **Alternating Rows:** Light gray background for even rows

### Single Score Display (Company Users)
- **Layout:** Centered card with score visualization
- **Score Gauge:**
  - **Type:** Circular gauge or large number display
  - **Value:** Current month score (e.g., 78/100)
  - **Color:** Based on score range (green ≥80, yellow 60-79, red <60)
  - **Size:** Large, prominent display
- **Score Information:**
  - **Score:** "XX/100" format
  - **Trend:** Change vs previous month (↑/↓ with amount)
  - **Percentile:** System-wide percentile ranking
  - **Rank Band:** Anonymized rank band (e.g., "25-35%")
- **Actions:**
  - **View Score Details:** Primary button (link to score detail page)
  - **View Leaderboard:** Secondary button (link to leaderboard)
- **Styling:**
  - **Card:** White card with shadow
  - **Centered Layout:** Centered on page
  - **Visual Hierarchy:** Score prominently displayed

### Expanded Row (MOH Users)
- **Layout:** Expandable component breakdown
- **Content:**
  - Component scores table:
    - Component name
    - Component score (out of 100)
    - Component weight (%)
    - Component contribution to total
  - Quick actions:
    - View Full Details
    - Flag Anomalies (Tier 2)
    - Override Score (Tier 1)
- **Styling:** Light gray background for expanded content

---

## Role-Based Access

### Company Users
- **View:** Own company score only (single score display)
- **Period Filter:** All periods (can view historical scores)
- **Score Display:** Gauge with score, trend, percentile, rank band
- **Actions:**
  - View Score Details
  - View Leaderboard (anonymized)
  - Create Dispute (if within 30-day window)
- **Data:**
  - Cannot see other companies' scores
  - Cannot see component weights (gaming prevention)
  - Can see own percentile and rank band (anonymized)

### MOH Tier 1
- **View:** All companies' scores
- **Filters:** All filters available
- **Table:** Full table with all columns
- **Actions:**
  - View Score Details
  - Override Score
  - Generate Reports
  - Export Data
- **Data:**
  - Can see all scores, formulas, weights
  - Can see component breakdown for all companies
  - Can override scores with justification

### MOH Tier 2
- **View:** All companies' scores (may be anonymized based on permission)
- **Filters:** All filters available
- **Table:** Full table with all columns
- **Actions:**
  - View Score Details
  - Flag Anomalies
  - Generate Reports (read-only)
  - Export Data
- **Data:**
  - Can see all scores and component breakdown
  - Can see component weights (read-only)
  - Cannot override scores

---

## State Variations

### Empty State (No Data)
- **Message:** "No compliance scores found"
- **Subtext:** "Scores are calculated monthly. Check back after the next calculation period."
- **Action Button:** "View Score Schedule" (if applicable)

### Loading State
- **Skeleton Loaders:** Table with skeleton rows
- **Filters:** Skeleton filter placeholders
- **Score Display:** Skeleton gauge placeholder

### Error State
- **Message:** "Unable to load compliance scores"
- **Subtext:** Error message details
- **Action Button:** "Retry"

### No Results (Filtered)
- **Message:** "No scores match your filters"
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
3. **Score Calculation:** Scores calculated monthly on 1st of month (2 AM)
4. **Score Publication:** Only published scores shown to companies (after Tier 1 approval)
5. **Period Filtering:** Default to current month, can filter by any period
6. **Role-Based Access:** Companies see own score only, MOH sees all scores
7. **Score Visibility:**
   - **Companies:** Exact total score + percentile/rank band (component weights hidden)
   - **MOH:** Full scores with component breakdown and weights
8. **Trend Calculation:** Compares current period score with previous period score
9. **Sorting:** Default sort by score (descending) or period (descending)
10. **Pagination:** 20 scores per page (configurable)
11. **Export:** Export filtered results to CSV (includes all columns based on role)
12. **Warning Indicator:** Scores below 60 show warning icon (⚠️)
13. **Dispute Window:** Companies can dispute scores within 30 days of publication
14. **Status Filtering:** Filter by publication status, dispute status, review status

---

## Related Documents

- [CMC Overview Wireframe](../overview/task-0.5.5.0-cmc-overview.md)
- [Compliance Score Detail Wireframe](./task-0.5.5.2-compliance-score-detail.md)
- [Leaderboard Wireframe](./task-0.5.5.3-leaderboard.md)
- [Score Review Modals](./task-0.5.5.4-score-review-tier2-flag-anomalies.md) and [Tier 1 Override](./task-0.5.5.5-score-review-tier1-override.md)
- [Compliance Disputes List Wireframe](../disputes/task-0.5.5.6-compliance-disputes-list.md)
- [Routing Structure](../../../02-architecture/frontend/routing-structure.md) - CMC routes
- [CMC Component Weights](../../../02-architecture/modules/cmc-component-weights.md) - Score component definitions
- [Role-Based UI Patterns](../../../02-architecture/frontend/role-based-ui-patterns.md) - Score visibility rules

---

**Last Updated:** 2025-01-15  
**Owner:** Emma (UI/UX + Next.js Frontend Specialist)  
**Guided by:** Fatima (MOH Regulatory Requirements) & Dr. Samir (Business Process Validation)

