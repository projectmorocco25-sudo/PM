# Task 0.5.8.4: User/Company Picker Modal Wireframe

**Status:** 🟡 In Progress  
**Route:** Modal overlay (reusable pattern, no specific route)  
**File:** `task-0.5.8.4-user-company-picker-modal.png`  
**Priority:** 🟢 Analytics & Historical Data (Reusable UI Patterns)

**Design Approach:** Reusable user/company picker modal with search, filters, multi-select, and role-based filtering. Professional, accessible, and optimized for recipient selection in communications and data filtering.

**Guidance:** Fatima (MOH Regulatory Requirements) - User/company picker critical for regulatory communication routing and data access control. Dr. Samir (Business Process Validation) - Efficient selection improves workflow efficiency and reduces errors.

---

## Wireframe Layout

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  [Modal Overlay - Dark background overlay 80% opacity]     │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │ Select Users / Companies                         [✕]  │ │
│  │                                                       │ │
│  │ ┌───────────────────────────────────────────────────┐ │ │
│  │ │ Search & Filters                                 │ │ │
│  │ │                                                   │ │ │
│  │ │ [Search users/companies...]                      │ │ │
│  │ │                                                   │ │ │
│  │ │ Filters:                                         │ │ │
│  │ │ [ ] Users  [ ] Companies  [ ] All                │ │ │
│  │ │                                                   │ │ │
│  │ │ Role: [All Roles ▼]                             │ │ │
│  │ │ • Company User                                   │ │ │
│  │ │ • MOH Tier 1                                     │ │ │
│  │ │ • MOH Tier 2                                     │ │ │
│  │ │                                                   │ │ │
│  │ │ Company: [All Companies ▼]                      │ │ │
│  │ │ • ABC Pharmaceuticals                            │ │ │
│  │ │ • XYZ Pharmaceuticals                            │ │ │
│  │ └───────────────────────────────────────────────────┘ │ │
│  │                                                       │ │
│  │ ┌───────────────────────────────────────────────────┐ │ │
│  │ │ Selection List                                    │ │ │
│  │ │                                                   │ │ │
│  │ │ [ ] Fatima Alami (MOH Tier 1)                    │ │ │
│  │ │     fatima.alami@moh.gov.ma                      │ │ │
│  │ │                                                   │ │ │
│  │ │ [✓] ABC Pharmaceuticals                           │ │ │
│  │ │     contact@abcpharma.com                        │ │ │
│  │ │                                                   │ │ │
│  │ │ [ ] Ahmed Benali (MOH Tier 2)                    │ │ │
│  │ │     ahmed.benali@moh.gov.ma                      │ │ │
│  │ │                                                   │ │ │
│  │ │ [ ] XYZ Pharmaceuticals                           │ │ │
│  │ │     contact@xyzpharma.com                        │ │ │
│  │ │                                                   │ │ │
│  │ │ [Showing 15 of 45 results]                       │ │ │
│  │ │ [Load More]                                      │ │ │
│  │ └───────────────────────────────────────────────────┘ │ │
│  │                                                       │ │
│  │ ┌───────────────────────────────────────────────────┐ │ │
│  │ │ Selected Items (2)                                │ │ │
│  │ │                                                   │ │ │
│  │ │ [✓ ABC Pharmaceuticals ×]                         │ │ │
│  │ │ [✓ Fatima Alami ×]                                │ │ │
│  │ │                                                   │ │ │
│  │ │ [Clear All]                                       │ │ │
│  │ └───────────────────────────────────────────────────┘ │ │
│  │                                                       │ │
│  │ [Cancel]                                 [Confirm]   │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Key Features

### Search & Filters
- **Search Field:** Real-time search for users/companies by name, email
- **Type Filter:** Multi-select (Users, Companies, All)
- **Role Filter:** Dropdown for user roles (Company User, MOH Tier 1, Tier 2)
- **Company Filter:** Dropdown for companies (if filtering users)
- **Role-Based Visibility:** MOH sees all, companies see relevant contacts only

### Selection List
- **Checkboxes:** Multi-select checkboxes for each item
- **Item Display:** Name, email, role/company type
- **Selected Indicator:** Checkmark (✓) for selected items
- **Pagination:** Load more results if list is long
- **Empty State:** "No results found" if search/filter yields no results

### Selected Items Summary
- **Selected Count:** Number of selected items displayed
- **Selected Chips:** Remove buttons (×) for each selected item
- **Clear All:** Clear all selections with one click
- **Persistent:** Remains visible while scrolling through list

### Actions
- **Cancel:** Close modal without applying selection
- **Confirm:** Apply selection and close modal

---

## State Variations

### Empty Selection
```
│  │ ┌───────────────────────────────────────────────────┐ │ │
│  │ │ Selected Items (0)                                │ │ │
│  │ │                                                   │ │ │
│  │ │ No items selected                                 │ │ │
│  │ └───────────────────────────────────────────────────┘ │ │
│  │                                                       │ │
│  │ [Cancel]                                 [Confirm]   │ │
│  │                              (disabled - no selection)│ │
```

### Search Results
```
│  │ │ [Search: "ABC"]                                    │ │ │
│  │ │                                                   │ │ │
│  │ │ [✓] ABC Pharmaceuticals                           │ │ │
│  │ │ [ ] ABC User (Company User)                       │ │ │
│  │ │                                                   │ │ │
│  │ │ [Showing 2 of 2 results]                         │ │ │
```

### Loading State
```
│  │ ┌───────────────────────────────────────────────────┐ │ │
│  │ │ Selection List                                    │ │ │
│  │ │                                                   │ │ │
│  │ │ [Loading spinner]                                 │ │ │
│  │ │ Loading users/companies...                        │ │ │
│  │ └───────────────────────────────────────────────────┘ │ │
```

### Single-Select Mode
```
│  │ │ (○) Radio buttons instead of checkboxes           │ │ │
│  │ │                                                   │ │ │
│  │ │ (○) Fatima Alami (MOH Tier 1)                    │ │ │
│  │ │ (●) ABC Pharmaceuticals (selected)                │ │ │
│  │ │ (○) Ahmed Benali (MOH Tier 2)                    │ │ │
```

---

## Responsive Behavior

### Desktop (> 1024px)
- Full modal width (max 600px)
- Side-by-side filters and list
- Selected items summary below list

### Tablet (768px - 1024px)
- Modal width (90% viewport)
- Stacked filters
- Scrollable list

### Mobile (< 768px)
- Modal width (95% viewport, full screen feel)
- Collapsible filters
- Touch-optimized selection

---

## Interactions

1. **Type in Search:** Real-time filtering of results
2. **Click Filter:** Apply filter, reload results
3. **Click Checkbox:** Select/deselect item
4. **Click Selected Chip X:** Remove item from selection
5. **Click Clear All:** Clear all selections
6. **Click Confirm:** Apply selection and close modal
7. **Click Cancel/X:** Close modal without applying

---

## Accessibility

- **Keyboard Navigation:** Tab through elements, Arrow keys in list, Enter to select
- **Screen Reader:** Announce item name, email, role, selection state
- **Focus Management:** Focus on search field on open
- **ARIA Labels:** Search role, list role, checkbox states, selected count

---

## Related Wireframes

- **Usage:** Used in compose message, export request filters, report generation
- **Examples:** Message recipients, export company filters, audit log filters
- **Integration:** All pages requiring user/company selection

---

**Created:** 2025-01-15  
**Last Updated:** 2025-01-15  
**Owner:** Emma (UI/UX + Next.js Frontend Specialist)  
**Reviewers:** Fatima (MOH Regulatory Requirements), Dr. Samir (Business Process Validation)

