# Task 0.5.3.24: Dosage/Forms Modal Wireframe

**Status:** ✅ Complete  
**Route:** Modal overlay (Level 3 - no route change, opened from Products Treemap)  
**File:** `task-0.5.3.24-dosage-forms-modal.png`  
**Priority:** 🟢 Analytics & Historical Data

**Design Approach:** Modal overlay showing dosage/form compliance breakdown table for selected product. Expandable rows for SKU details. Professional, accessible, and optimized for quick inspection without navigation.

**Guidance:** Fatima (MOH Regulatory Requirements) - Dosage/form level visibility supports targeted regulatory action. Dr. Samir (Business Process Validation) - Dosage/form breakdown enables precise supply chain analysis.

---

## Wireframe Layout

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  [Modal Overlay - Dark background overlay 80% opacity]     │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │ Dosage/Forms Compliance - Amoxicillin            [✕]  │ │
│  │                                                       │ │
│  │ Product: Amoxicillin                                  │ │
│  │ ATC Code: J01CA04                                     │ │
│  │ Total Compliance: 5% (15 violations)                  │ │
│  │                                                       │ │
│  │ Regulatory Framework (Fatima's Requirement):          │ │
│  │ Stock Level Compliance: DMP Art.15                    │ │
│  │ [View Regulatory Framework]                           │ │
│  │                                                       │ │
│  │ ┌───────────────────────────────────────────────────┐ │ │
│  │ │ Dosage/Forms Table                                │ │ │
│  │ │                                                   │ │ │
│  │ │ Dosage Form    │ Compliance % │ Violations │ SKUs│ │ │
│  │ ├────────────────┼──────────────┼────────────┼─────┤ │ │
│  │ │ 500mg Tablet   │ 5% ⚠️        │ 10        │ [▶] │ │ │
│  │ │ 250mg Capsule  │ 8% ⚠️        │ 3         │ [▶] │ │ │
│  │ │ 125mg Syrup    │ 45% ⚠️       │ 2         │ [▶] │ │ │
│  │ │ 250mg Suspension│ 78% ✓       │ 0         │ [▶] │ │ │
│  │ └────────────────┴──────────────┴────────────┴─────┘ │ │
│  │                                                       │ │
│  │ [Export] [View SKU Details] [Close]                  │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Expanded Row State (SKU List)

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │ Dosage/Forms Compliance - Amoxicillin            [✕]  │ │
│  │                                                       │ │
│  │ Product: Amoxicillin                                  │ │
│  │ ATC Code: J01CA04                                     │ │
│  │ Total Compliance: 5% (15 violations)                  │ │
│  │                                                       │ │
│  │ Regulatory Framework (Fatima's Requirement):          │ │
│  │ Stock Level Compliance: DMP Art.15                    │ │
│  │ [View Regulatory Framework]                           │ │
│  │                                                       │ │
│  │ ┌───────────────────────────────────────────────────┐ │ │
│  │ │ Dosage/Forms Table                                │ │ │
│  │ │                                                   │ │ │
│  │ │ Dosage Form    │ Compliance % │ Violations │ SKUs│ │ │
│  │ ├────────────────┼──────────────┼────────────┼─────┤ │ │
│  │ │ 500mg Tablet ▼ │ 5% ⚠️        │ 10        │ [▼] │ │ │
│  │ │ ┌───────────────────────────────────────────────┐ │ │ │
│  │ │ │ SKU List (Expandable):                        │ │ │
│  │ │ │                                               │ │ │
│  │ │ │ SKU        │ Compliance │ Threshold │ Stock │ │ │ │
│  │ │ │            │ %          │           │       │ │ │ │
│  │ │ ├────────────┼────────────┼───────────┼───────┤ │ │ │
│  │ │ │ SKU001     │ 5% ⚠️      │ 1,234     │ 62    │ │ │ │
│  │ │ │            │            │           │       │ │ │ │
│  │ │ │ SKU002     │ 4% ⚠️      │ 800       │ 32    │ │ │ │
│  │ │ │            │            │           │       │ │ │ │
│  │ │ │ SKU003     │ 6% ⚠️      │ 600       │ 36    │ │ │ │
│  │ │ │            │            │           │       │ │ │ │
│  │ │ │ [View Full SKU List ↗] (opens in new tab)   │ │ │ │
│  │ │ └───────────────────────────────────────────────┘ │ │ │
│  │ ├────────────────┼──────────────┼────────────┼─────┤ │ │
│  │ │ 250mg Capsule  │ 8% ⚠️        │ 3         │ [▶] │ │ │
│  │ │ 125mg Syrup    │ 45% ⚠️       │ 2         │ [▶] │ │ │
│  │ │ 250mg Suspension│ 78% ✓       │ 0         │ [▶] │ │ │
│  │ └────────────────┴──────────────┴────────────┴─────┘ │ │
│  │                                                       │ │
│  │ [Export] [View SKU Details] [Close]                  │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Key Features

### Modal Overlay
- **Background:** Dark overlay (80% opacity) covering entire screen
- **Position:** Centered modal, responsive width (max 80% viewport)
- **Dismissible:** Click outside, ESC key, or close button
- **No Route Change:** Modal overlay stays on current route
- **Focus Trap:** Keyboard navigation trapped within modal

### Dosage/Forms Table
- **Columns:** Dosage Form, Compliance %, Violations count, SKUs (expandable indicator)
- **Expandable Rows:** Click row or SKU icon to expand SKU list
- **SKU List:** Shows SKU code, compliance %, threshold, actual stock
- **Compliance Indicators:** Color-coded % with warning/success icons
- **Sortable:** Click column header to sort

### Actions
- **Export:** Download dosage/form breakdown (CSV/PDF)
- **View SKU Details:** External link to SKU List expanded view (Level 4 - opens in new tab)
- **Close:** Dismiss modal and return to Products Treemap

---

## State Variations

### Loading State (Expanding Row)
```
│  │ │ 500mg Tablet ▼ │ 5% ⚠️        │ 10        │ [⏳] │ │ │
│  │ │ ┌───────────────────────────────────────────────┐ │ │ │
│  │ │ │ [Loading spinner]                             │ │ │ │
│  │ │ │ Loading SKU details...                        │ │ │ │
│  │ │ └───────────────────────────────────────────────┘ │ │ │
```

### Empty State (No SKUs)
```
│  │ │ 500mg Tablet ▼ │ 5% ⚠️        │ 10        │ [▼] │ │ │
│  │ │ ┌───────────────────────────────────────────────┐ │ │ │
│  │ │ │ No SKUs found for this dosage form.           │ │ │ │
│  │ │ └───────────────────────────────────────────────┘ │ │ │
```

### Error State
```
│  │ ┌───────────────────────────────────────────────────┐ │ │
│  │ │ ⚠️ Error Loading Dosage/Forms                     │ │ │
│  │ │                                                   │ │ │
│  │ │  Unable to load dosage/form compliance data.    │ │ │
│  │ │                                                   │ │ │
│  │ │  [Retry] [Close]                                 │ │ │
│  │ └───────────────────────────────────────────────────┘ │ │
```

---

## Responsive Behavior

### Desktop (> 1024px)
- Full modal width (max 800px)
- Expandable rows with inline SKU list
- Side-by-side layout for table columns

### Tablet (768px - 1024px)
- Modal width (90% viewport)
- Scrollable table with horizontal scroll
- Expanded rows show full SKU list

### Mobile (< 768px)
- Modal width (95% viewport)
- Stacked layout for table columns
- Expanded rows in full-screen view

---

## Interactions

1. **Click Row/Icon:** Expand/collapse SKU list for dosage form
2. **Click "View Full SKU List":** Open SKU List expanded view (Level 4) in new tab
3. **Click Close/X:** Dismiss modal, return to Products Treemap
4. **Click Outside:** Dismiss modal (if enabled)
5. **ESC Key:** Dismiss modal
6. **Tab Navigation:** Focus trap within modal

---

## Data Requirements

- **Data Source:** WSL submissions filtered by selected product
- **Grouping:** By dosage form (dosage_strength + dosage_form)
- **Calculation:** % compliance = (actual stock / threshold) * 100 (aggregated by dosage form)
- **SKU Details:** Individual SKU compliance data for selected dosage form

---

## Accessibility

- **Keyboard Navigation:** Tab through table, Enter to expand row, ESC to close
- **Screen Reader:** Announce dosage form, compliance %, violations, SKU count
- **Focus Management:** Focus trap within modal, return focus on close
- **ARIA Labels:** Modal role, expandable row states, table headers

---

## Related Wireframes

- **Opened From:** [Products Treemap (Level 2)](task-0.5.3.23-products-treemap.md) - Click product tile
- **Next Level:** [SKU List Expanded View (Level 4)](task-0.5.3.25-sku-list-expanded.md) - External link in new tab
- **Integration:** [Product Detail Page](../../01-rmm/products/task-0.5.2.5-product-detail.md) - Related product information

---

**Created:** 2025-01-15  
**Last Updated:** 2025-01-15  
**Owner:** Emma (UI/UX + Next.js Frontend Specialist)  
**Reviewers:** Fatima (MOH Regulatory Requirements), Dr. Samir (Business Process Validation)

