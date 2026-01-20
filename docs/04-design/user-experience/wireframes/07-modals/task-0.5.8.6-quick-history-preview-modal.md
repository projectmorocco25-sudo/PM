# Task 0.5.8.6: Quick History Preview Modal Wireframe

**Status:** ✅ Complete  
**Route:** Modal overlay (reusable pattern, no specific route)  
**File:** `task-0.5.8.6-quick-history-preview-modal.png`  
**Priority:** 🟢 Analytics & Historical Data (Reusable UI Patterns)

**Design Approach:** Reusable quick history preview modal showing recent changes timeline with "View Full History" button. Professional, accessible, and optimized for quick inspection without navigation.

**Guidance:** Fatima (MOH Regulatory Requirements) - Quick history preview critical for regulatory audit traceability. Dr. Samir (Business Process Validation) - Quick preview improves workflow efficiency and reduces navigation overhead.

---

## Wireframe Layout

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  [Modal Overlay - Dark background overlay 80% opacity]     │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │ Recent History                                  [✕]  │ │
│  │                                                       │ │
│  │ Product: Amoxicillin                                  │ │
│  │                                                       │ │
│  │ ┌───────────────────────────────────────────────────┐ │ │
│  │ │ Recent Changes Timeline                           │ │ │
│  │ │                                                   │ │ │
│  │ │ ──────────── Today ────────────                   │ │ │
│  │ │                                                   │ │ │
│  │ │ • SKU "Paracetamol 500mg 30-pack" created         │ │ │
│  │ │   2 hours ago                                      │ │ │
│  │ │   User: Company Admin                             │ │ │
│  │ │                                                   │ │ │
│  │ │ • Product description updated                      │ │ │
│  │ │   1 day ago                                        │ │ │
│  │ │   User: Company Admin                             │ │ │
│  │ │   Changes: Updated dosage information             │ │ │
│  │ │                                                   │ │ │
│  │ │ ──────────── This Week ────────────               │ │ │
│  │ │                                                   │ │ │
│  │ │ • Product status changed: Active → Inactive       │ │ │
│  │ │   3 days ago                                       │ │ │
│  │ │   User: MOH Tier 1 - Fatima Alami                  │ │ │
│  │ │   Reason: Regulatory compliance                    │ │ │
│  │ │                                                   │ │ │
│  │ │ • Product created                                  │ │ │
│  │ │   1 week ago                                       │ │ │
│  │ │   User: Company Admin                             │ │ │
│  │ │                                                   │ │ │
│  │ │ ──────────── Last 30 Days ────────────            │ │ │
│  │ │                                                   │ │ │
│  │ │ • 5 more changes...                                │ │ │
│  │ │                                                   │ │ │
│  │ │ Showing 5 of 24 total changes                      │ │ │
│  │ │                                                   │ │ │
│  │ │ Regulatory Context (Fatima's Requirement):        │ │ │
│  │ │ • History maintained per regulatory audit          │ │ │
│  │ │   requirements (Law No. 09-08)                    │ │ │
│  │ │ • Data retention: 7 years minimum                 │ │ │
│  │ │ • [View Regulatory Framework]                     │ │ │
│  │ └───────────────────────────────────────────────────┘ │ │
│  │                                                       │ │
│  │ [View Full History]                                  │ │
│  │                                                       │ │
│  │ [Close]                                               │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Key Features

### Recent Changes Timeline
- **Grouped by Time:** Today, This Week, Last 30 Days, etc.
- **Recent First:** Most recent changes at top
- **Item Display:** Action, timestamp, user, details
- **Expandable Details:** Show/hide additional details (changes, reasons)
- **Limit Display:** Show last 5-10 changes (configurable)

### History Items
- **Action Description:** Clear description of what changed
- **Timestamp:** Relative time (2 hours ago) or absolute date
- **User Attribution:** User name and role
- **Change Details:** What changed (old → new values)
- **Reason/Notes:** Additional context if available

### Actions
- **View Full History:** Navigate to full history page (History tab)
- **Close:** Dismiss modal

---

## State Variations

### Empty State (No History)
```
│  │ │ ┌───────────────────────────────────────────────────┐ │ │
│  │ │ │ No History Available                               │ │ │
│  │ │ │                                                   │ │ │
│  │ │ │  No changes recorded for this item.               │ │ │
│  │ │ └───────────────────────────────────────────────────┘ │ │
```

### Loading State
```
│  │ │ ┌───────────────────────────────────────────────────┐ │ │
│  │ │ │ [Loading spinner]                                 │ │ │
│  │ │ │ Loading recent changes...                          │ │ │
│  │ │ └───────────────────────────────────────────────────┘ │ │
```

### Expanded Details
```
│  │ │ • Product description updated                      │ │ │
│  │ │   1 day ago                                        │ │ │
│  │ │   User: Company Admin                             │ │ │
│  │ │   [▼ Show Details]                                 │ │ │
│  │ │                                                   │ │ │
│  │ │   Changes:                                         │ │ │
│  │ │   • Description: "Pain reliever" →                 │ │ │
│  │ │                  "Pain reliever and fever reducer"  │ │ │
│  │ │   • Dosage: Added "500mg"                          │ │ │
│  │ │   [▲ Hide Details]                                 │ │ │
```

---

## Responsive Behavior

### Desktop (> 1024px)
- Full modal width (max 600px)
- Full timeline visible
- Scrollable if many items

### Tablet (768px - 1024px)
- Modal width (90% viewport)
- Condensed timeline
- Scrollable list

### Mobile (< 768px)
- Modal width (95% viewport, full screen feel)
- Simplified timeline
- Touch-optimized scrolling

---

## Interactions

1. **Click Item:** Expand/collapse item details
2. **Click View Full History:** Navigate to full history page (closes modal)
3. **Click Close/X:** Dismiss modal
4. **Scroll:** Scroll through timeline if many items
5. **ESC Key:** Dismiss modal

---

## Accessibility

- **Keyboard Navigation:** Tab through items, Enter to expand, ESC to close
- **Screen Reader:** Announce item, action, timestamp, user, details
- **Focus Management:** Focus on first item on open
- **ARIA Labels:** Timeline role, expandable items, item states

---

## Related Wireframes

- **Usage:** Used in detail pages for quick history preview
- **Examples:** Product detail, company detail, submission detail
- **Full History:** [History Overview](../../00-core-foundation/global/task-0.5.1.30-history-overview.md) - Full history page
- **History Tab:** History tabs on detail pages

---

**Created:** 2025-01-15  
**Last Updated:** 2025-01-15  
**Owner:** Emma (UI/UX + Next.js Frontend Specialist)  
**Reviewers:** Fatima (MOH Regulatory Requirements), Dr. Samir (Business Process Validation)

