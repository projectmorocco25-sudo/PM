# Task 0.5.3.22: ATC Treemap Page Wireframe

**Status:** 🟡 In Progress  
**Route:** `/vci/treemap` (Level 1 - ATC therapeutic area view)  
**File:** `task-0.5.3.22-atc-treemap.png`  
**Priority:** 🟢 Analytics & Historical Data

**Design Approach:** Interactive treemap visualization showing % total stock level compliance violations by therapeutic area (ATC Level 1). Clickable tiles drill down to products. Professional, accessible, and optimized for MOH Tier 1 & Tier 2 oversight and supply chain visualization.

**Guidance:** Fatima (MOH Regulatory Requirements) - Compliance violation visualization critical for regulatory oversight. Dr. Samir (Business Process Validation) - Supply chain visibility enables proactive compliance management.

---

## Wireframe Layout

```
┌─────────────────────────────────────────────────────────────┐
│ Home > VCI > Treemap                                        │
│                                                             │
│ Stock Level Compliance Violations - ATC Level               │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Filters & Controls                                       ││
│ │                                                          ││
│ │ [Critical Medicines Only] [Date Range: Last 30 days ▼] ││
│ │                                                          ││
│ │ Date Range: [2024-12-01] to [2024-12-31]               ││
│ │ [Custom Range]                                          ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ ATC Treemap Visualization                                ││
│ │                                                          ││
│ │ Legend:                                                  ││
│ │ [████] 0-25% compliance  [████] 25-50%  [████] 50-75%  ││
│ │ [████] 75-90%  [████] 90-100% (green)                  ││
│ │                                                          ││
│ │ ┌──────────────────────────────────────────────────────┐││
│ │ │                                                       │││
│ │ │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │││
│ │ │  │ A - Aliment │  │ B - Blood   │  │ C - Cardiac │ │││
│ │ │  │   12%       │  │   45%       │  │   78%       │ │││
│ │ │  │ 15 violations│  │ 23 violations│ │ 8 violations ││││
│ │ │  └─────────────┘  └─────────────┘  └─────────────┘ │││
│ │ │                                                       │││
│ │ │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │││
│ │ │  │ J - Anti-   │  │ N - Nervous │  │ R - Respirat│ │││
│ │ │  │   infect.   │  │   System    │  │   ory       │ │││
│ │ │  │   8% ⚠️      │  │   65%       │  │   92% ✓     │ │││
│ │ │  │ 28 violations│  │ 12 violations│ │ 3 violations ││││
│ │ │  └─────────────┘  └─────────────┘  └─────────────┘ │││
│ │ │                                                       │││
│ │ │  [More tiles...]                                     │││
│ │ └──────────────────────────────────────────────────────┘││
│ │                                                          ││
│ │ Total Violations: 89                                    ││
│ │ Total ATC Codes: 14                                     ││
│ │ Time Period: Dec 1 - Dec 31, 2024                      ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Summary Statistics                                       ││
│ │                                                          ││
│ │ Critical ATC Codes (< 50% compliance):                  ││
│ │ • A - Alimentary tract: 12% (15 violations)            ││
│ │ • J - Anti-infectives: 8% (28 violations) ⚠️           ││
│ │                                                          ││
│ │ [Export Report] [View Details]                          ││
│ └─────────────────────────────────────────────────────────┘│
```

---

## Key Features

### Treemap Visualization
- **Tile Size:** Proportional to number of violations (larger = more violations)
- **Tile Color:** Color-coded by compliance % (red = low, yellow = medium, green = high)
- **Tile Content:** ATC code letter, description, compliance %, violation count
- **Clickable:** Click tile to drill down to Products Treemap (Level 2)
- **Hover:** Tooltip shows detailed stats (total products, companies affected, date range)

### Filters & Controls
- **Critical Medicines Filter:** Toggle to show only critical medicines
- **Date Range Picker:** Default to last 30 days, supports custom range (up to 7 years)
- **Quick Filters:** Last 7 days, 30 days, 3 months, year, custom
- **Refresh Button:** Reload data with current filters

### Summary Statistics
- **Total Violations:** System-wide count for selected period
- **Total ATC Codes:** Number of therapeutic areas with violations
- **Critical ATC Codes:** List of codes with < 50% compliance (sorted by priority)
- **Export Actions:** Export report (PDF/CSV), View detailed breakdown

---

## State Variations

### Empty State (No Violations)
```
┌─────────────────────────────────────────────────────────┐│
│ ┌─────────────────────────────────────────────────────┐││
│ │                                                      │││
│ │          ✓ No Compliance Violations                 │││
│ │                                                      │││
│ │  All ATC therapeutic areas are meeting              │││
│ │  stock level thresholds for the selected period.    │││
│ │                                                      │││
│ │  [View Historical Data] [Change Date Range]        │││
│ │                                                      │││
│ └─────────────────────────────────────────────────────┘││
```

### Loading State
```
┌─────────────────────────────────────────────────────────┐│
│ ┌─────────────────────────────────────────────────────┐││
│ │                                                      │││
│ │         [Loading spinner]                            │││
│ │         Loading compliance data...                   │││
│ │                                                      │││
│ └─────────────────────────────────────────────────────┘││
```

### Error State
```
┌─────────────────────────────────────────────────────────┐│
│ ┌─────────────────────────────────────────────────────┐││
│ │ ⚠️ Error Loading Data                                │││
│ │                                                      │││
│ │  Unable to load compliance violation data.          │││
│ │  Please try again or contact support.               │││
│ │                                                      │││
│ │  [Retry] [Contact Support]                          │││
│ └─────────────────────────────────────────────────────┘││
```

---

## Responsive Behavior

### Desktop (> 1024px)
- Full treemap visualization with all tiles visible
- Side panel for filters and summary statistics
- Hover tooltips for detailed information

### Tablet (768px - 1024px)
- Condensed treemap with smaller tiles
- Filters moved to top bar
- Summary statistics below treemap

### Mobile (< 768px)
- Stacked list view instead of treemap
- Filters in collapsible accordion
- Summary statistics first, then list

---

## Interactions

1. **Click ATC Tile:** Navigate to `/vci/treemap?atc=J01` (Products Treemap - Level 2)
2. **Hover Tile:** Show tooltip with detailed stats
3. **Filter Change:** Reload treemap with new data
4. **Export Report:** Download PDF/CSV report with current view
5. **View Details:** Open modal with detailed breakdown table

---

## Data Requirements

- **Data Source:** WSL submissions with compliance violations
- **Calculation:** % compliance = (actual stock / threshold) * 100
- **Grouping:** By ATC Level 1 (therapeutic area)
- **Time Period:** Default 30 days, supports up to 7 years
- **Filters:** Critical medicines only, date range, company (MOH only)

---

## Accessibility

- **Keyboard Navigation:** Tab through tiles, Enter to drill down
- **Screen Reader:** Announce tile content (ATC code, compliance %, violations)
- **Color Contrast:** WCAG AA compliant (color + text labels)
- **Focus Indicators:** Clear focus outline on interactive elements

---

## Related Wireframes

- **Next Level:** [Products Treemap (Level 2)](task-0.5.3.23-products-treemap.md) - Drill down from ATC to products
- **Integration:** [Governance Dashboard](../overview/task-0.5.3.18-governance-dashboard.md) - Link from compliance overview
- **Data Source:** [WSL Submissions List](../wsl/task-0.5.3.11-wsl-submissions-list.md) - Source of compliance data

---

**Created:** 2025-01-15  
**Last Updated:** 2025-01-15  
**Owner:** Emma (UI/UX + Next.js Frontend Specialist)  
**Reviewers:** Fatima (MOH Regulatory Requirements), Dr. Samir (Business Process Validation)

