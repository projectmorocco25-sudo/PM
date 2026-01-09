# Task 0.5.5.3: Leaderboard Page Wireframe

**Status:** ✅ Complete  
**Route:** `/cmc/leaderboard`  
**File:** `task-0.5.5.3-leaderboard.png`  
**Priority:** 🟡 CMC Module

**Design Approach:** Leaderboard page with anonymized percentile/rank band for companies, full leaderboard for MOH Tier 1, and oversight view for Tier 2. Professional, accessible, and optimized for compliance comparison workflows.

---

## Wireframe Layout

```
┌─────────────────────────────────────────────────────────────┐
│ Home > CMC > Leaderboard                                     │
│                                                             │
│ Compliance Score Leaderboard                                 │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Filters                                                   ││
│ │                                                          ││
│ │ Period: [2024-12 ▼]  Score Range: [All ▼]              ││
│ │                                                          ││
│ │ [Apply Filters] [Clear] [Export CSV]                    ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ [For Companies: Anonymized Leaderboard]                    │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Your Position                                            ││
│ │                                                          ││
│ │ ┌─────────────────────────────────────────────────────┐ ││
│ │ │                                                      │ ││
│ │ │         [Circular Gauge: 78/100]                    │ ││
│ │ │                                                      │ ││
│ │ │         Your Score: 78/100                          │ ││
│ │ │         Percentile: Top 35%                         │ ││
│ │ │         Rank Band: 25-35%                           │ ││
│ │ │                                                      │ ││
│ │ └─────────────────────────────────────────────────────┘ ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Percentile Distribution                                 ││
│ │                                                          ││
│ │ ┌─────────────────────────────────────────────────────┐ ││
│ │ │ [Bar Chart: Percentile Ranges]                      │ ││
│ │ │                                                      │ ││
│ │ │ Top 10%:  ████ (5 companies)                        │ ││
│ │ │ 11-25%:   ████████ (18 companies)                   │ ││
│ │ │ 26-50%:   ███████ (15 companies) ← You are here    │ ││
│ │ │ 51-75%:   ████ (10 companies)                       │ ││
│ │ │ 76-100%:  ██ (2 companies)                          │ ││
│ │ └─────────────────────────────────────────────────────┘ ││
│ │                                                          ││
│ │ Total Companies: 50                                      ││
│ │                                                          ││
│ │ [Note: Individual company names are anonymized to     ││
│ │  prevent gaming and ensure fair competition.]          ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ [For MOH Tier 1: Full Leaderboard]                        │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Full Leaderboard (Ranked by Score)                      ││
│ │                                                          ││
│ │ ┌──────┬─────────────────────┬──────────┬──────────────┐│
│ │ │ Rank │ Company             │ Score    │ Change       ││
│ │ ├──────┼─────────────────────┼──────────┼──────────────┤│
│ │ │ 1    │ DEF Healthcare Ltd. │ 92/100 🥇│ ↑ 5.0       ││
│ │ │ 2    │ ABC Pharma Inc.     │ 85/100 🥈│ ↑ 3.2       ││
│ │ │ 3    │ MNO Medical Corp.   │ 84/100 🥉│ ↑ 2.5       ││
│ │ │ 4    │ XYZ Medical Corp.   │ 78/100   │ ↓ 2.1       ││
│ │ │ 5    │ PQR Pharmaceuticals │ 77/100   │ ↑ 1.8       ││
│ │ │ ...  │ ...                 │ ...      │ ...         ││
│ │ │ 47   │ GHI Pharmaceuticals │ 55/100 ⚠│ ↓ 8.5       ││
│ │ │ 48   │ JKL Medical Supply  │ 48/100 ⚠│ ↓ 12.3      ││
│ │ └──────┴─────────────────────┴──────────┴──────────────┘│
│ │                                                          ││
│ │ Showing 1-10 of 50 companies                            ││
│ │ [< Previous] [1] [2] [3] ... [5] [Next >]             ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ [For MOH Tier 2: Oversight View]                          │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Leaderboard Overview (Anonymized or Full based on       ││
│ │ permission)                                             ││
│ │                                                          ││
│ │ [Same structure as Tier 1, but may show anonymized      ││
│ │  data based on Tier 2 permission settings]              ││
│ └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

---

## Component Specifications

### Page Header
- **Breadcrumbs:** "Home > CMC > Leaderboard"
- **Title:** "Compliance Score Leaderboard"
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
  2. **Score Range Dropdown:**
     - Options: All, 90-100, 80-89, 70-79, 60-69, <60
     - Default: All
- **Actions:**
  - **Apply Filters:** Primary button
  - **Clear:** Secondary button (reset all filters)
  - **Export CSV:** Secondary button (export filtered results)

### Company Users: Anonymized Leaderboard

#### Your Position Card
- **Layout:** Centered card with score visualization
- **Components:**
  - **Circular Gauge:**
    - **Type:** Donut or circular progress gauge
    - **Value:** Current month score (e.g., 78/100)
    - **Color:** Based on score range (green ≥80, yellow 60-79, red <60)
    - **Size:** Large, prominent display (200-300px diameter)
  - **Score Information:**
    - **Your Score:** "XX/100" format (large, bold)
    - **Percentile:** System-wide percentile ranking (e.g., "Top 35%")
    - **Rank Band:** Anonymized rank band (e.g., "25-35%")
- **Styling:**
  - **Card:** White card with shadow
  - **Centered Layout:** Centered on page
  - **Visual Hierarchy:** Score prominently displayed

#### Percentile Distribution Chart
- **Layout:** Horizontal bar chart showing percentile ranges
- **Ranges:**
  - Top 10%
  - 11-25%
  - 26-50%
  - 51-75%
  - 76-100%
- **Content:**
  - Bar for each range with company count
  - Visual indicator showing user's position ("← You are here")
  - Total company count
- **Note:**
  - **Text:** "Individual company names are anonymized to prevent gaming and ensure fair competition."
  - **Styling:** Italic, light gray text
- **Styling:**
  - **Chart:** Color-coded bars (green for top ranges, red for bottom ranges)
  - **Position Indicator:** Arrow or highlight showing user's rank band

### MOH Tier 1: Full Leaderboard

#### Full Leaderboard Table
- **Layout:** Scrollable table with sortable columns
- **Columns:**
  1. **Rank:** Numeric rank (1, 2, 3, ...)
     - **Medals:** 🥇 (1st), 🥈 (2nd), 🥉 (3rd) for top 3
  2. **Company:** Company name (link to company detail)
  3. **Score:** Total score out of 100
     - **Format:** "XX/100"
     - **Visual:** Color-coded score (green ≥80, yellow 60-79, red <60)
     - **Warning Icon (⚠️):** For scores below 60
  4. **Change:** Score change vs previous period
     - **Format:** ↑/↓/→ with change amount (e.g., ↑ 3.2, ↓ 2.1, → 0.0)
     - **Color:** Green for increase, red for decrease, gray for no change
- **Features:**
  - **Sortable Columns:** Click column header to sort
  - **Pagination:** Shows "Showing X-Y of Z companies"
  - **Row Count:** Display total count
- **Styling:**
  - **Table:** White background with borders
  - **Hover:** Row highlight on hover
  - **Alternating Rows:** Light gray background for even rows
  - **Top 3:** Highlighted with medal icons and special styling

### MOH Tier 2: Oversight View
- **Layout:** Same structure as Tier 1, but data visibility depends on permission settings
- **Options:**
  1. **Full Leaderboard:** Same as Tier 1 (if permission granted)
  2. **Anonymized Leaderboard:** Same as Company users view (if permission restricted)
  3. **Hybrid View:** Top 10 fully visible, rest anonymized
- **Styling:** Same as Tier 1 or Company view depending on permission

---

## Role-Based Access

### Company Users
- **View:** Anonymized leaderboard only
- **Your Position:**
  - Own score with gauge visualization
  - Percentile ranking (e.g., "Top 35%")
  - Rank band (e.g., "25-35%")
- **Percentile Distribution:**
  - Anonymized percentile ranges with company counts
  - Position indicator showing user's rank band
  - No individual company names visible
- **Actions:**
  - View Own Score Details
  - Export Own Data (anonymized)
- **Data:**
  - Cannot see other companies' names or exact ranks
  - Cannot see exact positions within rank band
  - Can see overall percentile distribution

### MOH Tier 1
- **View:** Full leaderboard with all company names
- **Full Leaderboard:**
  - All companies ranked by score
  - Company names visible
  - Exact ranks and scores shown
  - Top 3 highlighted with medals
- **Actions:**
  - View Company Score Details
  - Export Full Data
  - Generate Reports
  - Filter and Sort
- **Data:**
  - Can see all companies' names, ranks, and scores
  - Can see score changes and trends
  - Can filter and export data

### MOH Tier 2
- **View:** Leaderboard based on permission settings (may be anonymized or full)
- **Options:**
  - **If Full Permission:** Same as Tier 1
  - **If Restricted Permission:** Same as Company users (anonymized)
  - **If Hybrid Permission:** Top 10 fully visible, rest anonymized
- **Actions:**
  - View Score Details (if permission allows)
  - Export Data (based on permission)
  - Generate Reports (read-only)
- **Data:**
  - Visibility depends on permission settings
  - May see anonymized or full data based on role configuration

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
- **Message:** "Unable to load leaderboard"
- **Subtext:** Error message details
- **Action Button:** "Retry"

### No Results (Filtered)
- **Message:** "No companies match your filters"
- **Subtext:** "Try adjusting your filters to see more results"
- **Action Button:** "Clear Filters"

### Single Company State (Edge Case)
- **Message:** "Leaderboard requires at least 2 companies"
- **Subtext:** "Additional companies needed for comparison"
- **Note:** Only applicable if system has only 1 company

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
4. **Score Publication:** Only published scores included in leaderboard (after Tier 1 approval)
5. **Ranking:** Companies ranked by total score (descending)
6. **Anonymization:**
   - **Companies:** Percentile/rank band only (individual names hidden)
   - **MOH Tier 1:** Full leaderboard with company names
   - **MOH Tier 2:** Depends on permission settings (may be anonymized or full)
7. **Percentile Calculation:**
   - Percentile = (Number of companies below) / (Total companies) × 100
   - Rank band = Percentile range (e.g., 25-35% means between 25th and 35th percentile)
8. **Period Filtering:** Default to current month, can filter by any period
9. **Ties Handling:** Companies with same score share rank (e.g., if 3 companies have 85, they all rank 2nd)
10. **Medals:** Top 3 companies highlighted with 🥇 🥈 🥉 icons
11. **Change Calculation:** Compares current period score with previous period score
12. **Pagination:** 20 companies per page (configurable)
13. **Export:** Export filtered results to CSV (includes all columns based on role)
14. **Warning Indicator:** Companies with scores below 60 show warning icon (⚠️)
15. **Position Indicator:** For company users, shows visual indicator of their position in percentile distribution

---

## Related Documents

- [CMC Overview Wireframe](../overview/task-0.5.5.0-cmc-overview.md)
- [Compliance Scores List Wireframe](./task-0.5.5.1-compliance-scores-list.md)
- [Compliance Score Detail Wireframe](./task-0.5.5.2-compliance-score-detail.md)
- [Routing Structure](../../../02-architecture/frontend/routing-structure.md) - CMC routes
- [Role-Based UI Patterns](../../../02-architecture/frontend/role-based-ui-patterns.md) - Leaderboard visibility rules
- [CMC Component Weights](../../../02-architecture/modules/cmc-component-weights.md) - Score component definitions

---

**Last Updated:** 2025-01-15  
**Owner:** Emma (UI/UX + Next.js Frontend Specialist)  
**Guided by:** Fatima (MOH Regulatory Requirements) & Dr. Samir (Business Process Validation)

