# Task 0.5.3.25: SKU List Expanded View Wireframe

**Status:** 🟡 In Progress  
**Route:** Modal overlay (Level 4 - no route change, opened from Dosage/Forms Modal)  
**File:** `task-0.5.3.25-sku-list-expanded.png`  
**Priority:** 🟢 Analytics & Historical Data

**Design Approach:** Modal overlay showing full SKU list with compliance violation status for selected dosage form. External link icon indicates opens in new tab. Professional, accessible, and optimized for detailed SKU-level inspection.

**Guidance:** Fatima (MOH Regulatory Requirements) - SKU-level visibility enables precise regulatory intervention. Dr. Samir (Business Process Validation) - SKU-level insights support granular supply chain management.

---

## Wireframe Layout

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  [Modal Overlay - Dark background overlay 80% opacity]     │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │ SKU List - Amoxicillin 500mg Tablet              [✕]  │ │
│  │                                                       │ │
│  │ Product: Amoxicillin                                  │ │
│  │ Dosage Form: 500mg Tablet                             │ │
│  │ Total Compliance: 5% (10 violations)                  │ │
│  │                                                       │ │
│  │ ⓘ This view shows all SKUs with compliance data.     │ │
│  │    Click SKU to open full detail page in new tab.     │ │
│  │                                                       │ │
│  │ ┌───────────────────────────────────────────────────┐ │ │
│  │ │ SKU Compliance Table                              │ │ │
│  │ │                                                   │ │ │
│  │ │ [Export CSV] [Filter: All] [Sort: Compliance % ▼]│ │ │
│  │ │                                                   │ │ │
│  │ │ SKU      │ Compliance │ Threshold │ Stock │ Action│ │ │
│  │ │          │ %          │           │       │ Link  │ │ │
│  │ ├──────────┼────────────┼───────────┼───────┼───────┤ │ │
│  │ │ SKU001   │ 5% ⚠️      │ 1,234     │ 62    │ [↗]  │ │ │
│  │ │          │            │           │       │       │ │ │
│  │ │ SKU002   │ 4% ⚠️      │ 800       │ 32    │ [↗]  │ │ │
│  │ │          │            │           │       │       │ │ │
│  │ │ SKU003   │ 6% ⚠️      │ 600       │ 36    │ [↗]  │ │ │
│  │ │          │            │           │       │       │ │ │
│  │ │ SKU004   │ 8% ⚠️      │ 500       │ 40    │ [↗]  │ │ │
│  │ │          │            │           │       │       │ │ │
│  │ │ SKU005   │ 5% ⚠️      │ 400       │ 20    │ [↗]  │ │ │
│  │ │          │            │           │       │       │ │ │
│  │ │ SKU006   │ 7% ⚠️      │ 300       │ 21    │ [↗]  │ │ │
│  │ │          │            │           │       │       │ │ │
│  │ │ SKU007   │ 4% ⚠️      │ 250       │ 10    │ [↗]  │ │ │
│  │ │          │            │           │       │       │ │ │
│  │ │ SKU008   │ 5% ⚠️      │ 200       │ 10    │ [↗]  │ │ │
│  │ │          │            │           │       │       │ │ │
│  │ │ SKU009   │ 6% ⚠️      │ 150       │ 9     │ [↗]  │ │ │
│  │ │          │            │           │       │       │ │ │
│  │ │ SKU010   │ 5% ⚠️      │ 100       │ 5     │ [↗]  │ │ │
│  │ │          │            │           │       │       │ │ │
│  │ └──────────┴────────────┴───────────┴───────┴───────┘ │ │
│  │                                                       │ │
│  │ Showing 10 of 10 SKUs                                │ │
│  │                                                       │ │
│  │ [Export] [Close]                                     │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Key Features

### Modal Overlay
- **Background:** Dark overlay (80% opacity) covering entire screen
- **Position:** Centered modal, responsive width (max 90% viewport)
- **Dismissible:** Click outside, ESC key, or close button
- **No Route Change:** Modal overlay stays on current route
- **Focus Trap:** Keyboard navigation trapped within modal
- **Info Message:** Clear indication that clicking SKU opens in new tab

### SKU Compliance Table
- **Columns:** SKU code, Compliance %, Threshold, Actual Stock, Action Link (external icon)
- **Sortable:** Click column header to sort (default: Compliance % ascending)
- **Filterable:** Filter by compliance status (All, Violations Only, Compliant)
- **Export:** Download SKU list (CSV)
- **Pagination:** If more than 50 SKUs, show pagination controls

### Action Links
- **External Link Icon ([↗]):** Click SKU row or icon to open SKU Action Page (Level 5) in new tab
- **Opens in New Tab:** Preserves modal state, allows comparison
- **Query Params:** Includes back navigation parameter for returning to modal

---

## State Variations

### Loading State
```
│  │ ┌───────────────────────────────────────────────────┐ │ │
│  │ │ [Loading spinner]                                 │ │ │
│  │ │ Loading SKU compliance data...                    │ │ │
│  │ └───────────────────────────────────────────────────┘ │ │
```

### Empty State (No SKUs)
```
│  │ ┌───────────────────────────────────────────────────┐ │ │
│  │ │ ✓ No SKUs Found                                   │ │ │
│  │ │                                                   │ │ │
│  │ │  No SKUs found for this dosage form.             │ │ │
│  │ │                                                   │ │ │
│  │ │  [Close]                                          │ │ │
│  │ └───────────────────────────────────────────────────┘ │ │
```

### Error State
```
│  │ ┌───────────────────────────────────────────────────┐ │ │
│  │ │ ⚠️ Error Loading SKU Data                         │ │ │
│  │ │                                                   │ │ │
│  │ │  Unable to load SKU compliance data.             │ │ │
│  │ │                                                   │ │ │
│  │ │  [Retry] [Close]                                 │ │ │
│  │ └───────────────────────────────────────────────────┘ │ │
```

### Filtered State (Violations Only)
```
│  │ │ [Export CSV] [Filter: Violations Only ▼] [Sort: Compliance % ▼]│ │ │
│  │ │                                                   │ │ │
│  │ │ SKU      │ Compliance │ Threshold │ Stock │ Action│ │ │
│  │ │          │ %          │           │       │ Link  │ │ │
│  │ ├──────────┼────────────┼───────────┼───────┼───────┤ │ │
│  │ │ SKU001   │ 5% ⚠️      │ 1,234     │ 62    │ [↗]  │ │ │
│  │ │ SKU002   │ 4% ⚠️      │ 800       │ 32    │ [↗]  │ │ │
│  │ │ [Only showing SKUs with violations]                │ │ │
```

---

## Responsive Behavior

### Desktop (> 1024px)
- Full modal width (max 1000px)
- All columns visible
- Horizontal scroll if needed

### Tablet (768px - 1024px)
- Modal width (95% viewport)
- Scrollable table with horizontal scroll
- Collapsible columns on small screens

### Mobile (< 768px)
- Modal width (98% viewport, full screen feel)
- Stacked layout for table rows
- Action link always visible

---

## Interactions

1. **Click SKU Row/Icon:** Open SKU Action Page (Level 5) in new tab with query params
2. **Click Close/X:** Dismiss modal, return to Dosage/Forms Modal (Level 3)
3. **Click Outside:** Dismiss modal (if enabled)
4. **ESC Key:** Dismiss modal
5. **Sort Column:** Click column header to sort ascending/descending
6. **Filter:** Select filter option to show All/Violations/Compliant
7. **Export:** Download CSV with current filter/sort applied

---

## Data Requirements

- **Data Source:** WSL submissions filtered by selected product and dosage form
- **SKU Data:** Individual SKU compliance, threshold, actual stock
- **Calculation:** % compliance = (actual stock / threshold) * 100
- **Sorting:** Default by compliance % (ascending - worst first)

---

## Accessibility

- **Keyboard Navigation:** Tab through table, Enter to open SKU detail, ESC to close
- **Screen Reader:** Announce SKU code, compliance %, threshold, stock, external link indicator
- **Focus Management:** Focus trap within modal, return focus on close
- **ARIA Labels:** Modal role, table headers, external link indicators

---

## Related Wireframes

- **Opened From:** [Dosage/Forms Modal (Level 3)](task-0.5.3.24-dosage-forms-modal.md) - "View Full SKU List" link
- **Next Level:** [SKU Action Page Integration (Level 5)](task-0.5.3.27-sku-action-page-integration.md) - External link opens in new tab
- **Integration:** [SKU Detail Page](../../01-rmm/skus/task-0.5.2.7-sku-detail.md) - Uses existing route with query params

---

**Created:** 2025-01-15  
**Last Updated:** 2025-01-15  
**Owner:** Emma (UI/UX + Next.js Frontend Specialist)  
**Reviewers:** Fatima (MOH Regulatory Requirements), Dr. Samir (Business Process Validation)

