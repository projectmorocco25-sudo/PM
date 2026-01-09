# Task 0.5.8.7: Comparison Modal Wireframe

**Status:** 🟡 In Progress  
**Route:** Modal overlay (reusable pattern, no specific route)  
**File:** `task-0.5.8.7-comparison-modal.png`  
**Priority:** 🟢 Analytics & Historical Data (Reusable UI Patterns)

**Design Approach:** Reusable comparison modal showing current vs historical side-by-side with highlighted differences. Professional, accessible, and optimized for comparing versions without navigation.

**Guidance:** Fatima (MOH Regulatory Requirements) - Comparison modal critical for regulatory audit and version verification. Dr. Samir (Business Process Validation) - Side-by-side comparison improves decision-making and reduces errors.

---

## Wireframe Layout

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  [Modal Overlay - Dark background overlay 80% opacity]     │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │ Compare Versions                                 [✕]  │ │
│  │                                                       │ │
│  │ Item: Product - Amoxicillin                            │ │
│  │                                                       │ │
│  │ ┌───────────────────────────────────────────────────┐ │ │
│  │ │ Current Version    │    Historical Version        │ │ │
│  │ │ (Dec 31, 2024)     │    (Nov 30, 2024)            │ │ │
│  │ ├────────────────────┼───────────────────────────────┤ │ │
│  │ │ Name:              │    Name:                      │ │ │
│  │ │ Amoxicillin        │    Amoxicillin                │ │ │
│  │ │                    │                               │ │ │
│  │ │ Description:       │    Description:               │ │ │
│  │ │ Pain reliever and  │    Pain reliever              │ │ │
│  │ │ fever reducer      │                               │ │ │
│  │ │ [Highlighted]      │    [No highlight]             │ │ │
│  │ │                    │                               │ │ │
│  │ │ Dosage:            │    Dosage:                    │ │ │
│  │ │ 500mg              │    250mg                      │ │ │
│  │ │ [Highlighted]      │    [Highlighted]              │ │ │
│  │ │                    │                               │ │ │
│  │ │ Status:            │    Status:                    │ │ │
│  │ │ Active             │    Active                     │ │ │
│  │ │                    │                               │ │ │
│  │ │ Created:           │    Created:                   │ │ │
│  │ │ 2024-01-15         │    2024-01-15                 │ │ │
│  │ └────────────────────┴───────────────────────────────┘ │ │
│  │                                                       │ │
│  │ Differences Found: 2                                  │ │
│  │                                                       │ │
│  │ [View Full History]                   [Close]        │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Key Features

### Side-by-Side Layout
- **Two Columns:** Current version (left) vs Historical version (right)
- **Date Labels:** Show dates for both versions
- **Field-by-Field:** Compare each field side-by-side
- **Differences Highlighted:** Highlight changed fields (yellow background)
- **No Change Indicator:** Gray out unchanged fields (optional)

### Difference Highlighting
- **Changed Fields:** Yellow highlight on both sides for changed fields
- **Added Fields:** Green highlight (only in current version)
- **Removed Fields:** Red highlight (only in historical version)
- **Difference Count:** Show total number of differences

### Comparison Info
- **Item Name:** What is being compared
- **Version Dates:** Current date and historical date
- **Difference Count:** Number of differences found
- **Summary:** Brief summary of key differences (optional)

### Actions
- **View Full History:** Navigate to full history page for detailed timeline
- **Close:** Dismiss modal

---

## State Variations

### No Differences
```
│  │ │ Differences Found: 0                                  │ │ │
│  │ │                                                       │ │ │
│  │ │ ✓ No differences found between versions.             │ │ │
│  │ │                                                       │ │ │
│  │ │ [View Full History]                   [Close]        │ │ │
```

### Loading State
```
│  │ │ [Loading spinner]                                     │ │ │
│  │ │ Comparing versions...                                 │ │ │
│  │ └───────────────────────────────────────────────────┘ │ │
```

### Long Content (Scrollable)
```
│  │ │ ┌───────────────────────────────────────────────────┐ │ │
│  │ │ │ [Scrollable content area]                         │ │ │
│  │ │ │                                                   │ │ │
│  │ │ │ [Both columns scroll together]                    │ │ │
│  │ │ │                                                   │ │ │
│  │ │ │ ...many fields...                                 │ │ │
│  │ │ └───────────────────────────────────────────────────┘ │ │
```

### Multiple Versions (Timeline)
```
│  │ │ Compare: [Current ▼] vs [Nov 30, 2024 ▼]            │ │ │
│  │ │                                                       │ │ │
│  │ │ [Version selector dropdowns for changing comparison]  │ │ │
│  │ │                                                       │ │ │
│  │ │ [Side-by-side comparison shown]                      │ │ │
```

---

## Responsive Behavior

### Desktop (> 1024px)
- Full modal width (max 900px for side-by-side)
- Side-by-side columns
- Both columns visible

### Tablet (768px - 1024px)
- Modal width (95% viewport)
- Stacked columns (current above, historical below)
- Scrollable content

### Mobile (< 768px)
- Modal width (98% viewport, full screen feel)
- Stacked columns (vertical layout)
- Touch-optimized scrolling

---

## Interactions

1. **Scroll:** Scroll through comparison (both columns scroll together)
2. **Click Highlighted Field:** Show detailed diff (inline or tooltip)
3. **Select Versions:** Change versions to compare (if dropdowns present)
4. **Click View Full History:** Navigate to full history page (closes modal)
5. **Click Close/X:** Dismiss modal
6. **ESC Key:** Dismiss modal

---

## Accessibility

- **Keyboard Navigation:** Tab through fields, Arrow keys to scroll, ESC to close
- **Screen Reader:** Announce field names, current values, historical values, differences
- **Focus Management:** Focus on first difference on open
- **ARIA Labels:** Comparison role, difference indicators, field labels

---

## Related Wireframes

- **Usage:** Used in detail pages for version comparison
- **Examples:** Product version comparison, submission version comparison, score comparison
- **Full History:** [History Overview](../../00-core-foundation/global/task-0.5.1.30-history-overview.md) - Full history page
- **History Tab:** History tabs on detail pages

---

**Created:** 2025-01-15  
**Last Updated:** 2025-01-15  
**Owner:** Emma (UI/UX + Next.js Frontend Specialist)  
**Reviewers:** Fatima (MOH Regulatory Requirements), Dr. Samir (Business Process Validation)

