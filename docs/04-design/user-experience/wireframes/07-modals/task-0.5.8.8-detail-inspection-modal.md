# Task 0.5.8.8: Detail Inspection Modal Wireframe

**Status:** 🟡 In Progress  
**Route:** Modal overlay (reusable pattern, no specific route)  
**File:** `task-0.5.8.8-detail-inspection-modal.png`  
**Priority:** 🟢 Analytics & Historical Data (Reusable UI Patterns)

**Design Approach:** Reusable detail inspection modal showing quick detail view from list with "View Full Page" button. Professional, accessible, and optimized for quick inspection without navigation.

**Guidance:** Fatima (MOH Regulatory Requirements) - Detail inspection modal critical for regulatory review and quick decision-making. Dr. Samir (Business Process Validation) - Quick inspection improves workflow efficiency and reduces context switching.

---

## Wireframe Layout

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  [Modal Overlay - Dark background overlay 80% opacity]     │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │ Submission Details                               [✕]  │ │
│  │                                                       │ │
│  │ AAMS Submission - 2024                                │ │
│  │                                                       │ │
│  │ ┌───────────────────────────────────────────────────┐ │ │
│  │ │ Submission Information                            │ │ │
│  │ │                                                   │ │ │
│  │ │ Submission ID: SUB-2024-001                        │ │ │
│  │ │ Year: 2024                                        │ │ │
│  │ │ Company: ABC Pharmaceuticals Inc.                  │ │ │
│  │ │ Status: Tier 2 Verified                           │ │ │
│  │ │                                                   │ │ │
│  │ │ Submitted: January 15, 2024                        │ │ │
│  │ │ Verified: February 5, 2024 (Tier 2 - Ahmed Benali)│ │ │
│  │ │                                                   │ │ │
│  │ │ Calculated Threshold: 1,234 units                │ │ │
│  │ └───────────────────────────────────────────────────┘ │ │
│  │                                                       │ │
│  │ ┌───────────────────────────────────────────────────┐ │ │
│  │ │ Summary Data                                      │ │ │
│  │ │                                                   │ │ │
│  │ │ Total SKUs: 15                                    │ │ │
│  │ │ Total AAMS: 12,000 units                          │ │ │
│  │ │                                                   │ │ │
│  │ │ [View Full Submission Details]                    │ │ │
│  │ └───────────────────────────────────────────────────┘ │ │
│  │                                                       │ │
│  │ ┌───────────────────────────────────────────────────┐ │ │
│  │ │ Quick Actions                                     │ │ │
│  │ │                                                   │ │ │
│  │ │ [View Full Page]  [Export]  [Communicate]         │ │ │
│  │ └───────────────────────────────────────────────────┘ │ │
│  │                                                       │ │
│  │ [Close]                                               │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Key Features

### Quick Detail View
- **Item Type:** Clear label of what is being inspected (Submission, Product, Company, etc.)
- **Key Information:** Most important details visible at a glance
- **Status Display:** Current status with badge
- **Summary Metrics:** Key numbers and metrics
- **Condensed Format:** Essential information only (not full page)

### Actions
- **View Full Page:** Navigate to full detail page (closes modal)
- **Quick Actions:** Common actions (Export, Communicate, etc.)
- **Close:** Dismiss modal

### Content Sections
- **Information Section:** Key identification and status info
- **Summary Section:** Condensed data/metrics
- **Actions Section:** Quick action buttons

---

## State Variations

### Loading State
```
│  │ │ ┌───────────────────────────────────────────────────┐ │ │
│  │ │ │ [Loading spinner]                                 │ │ │
│  │ │ │ Loading details...                                │ │ │
│  │ │ └───────────────────────────────────────────────────┘ │ │
```

### Error State
```
│  │ │ ┌───────────────────────────────────────────────────┐ │ │
│  │ │ │ ⚠️ Error Loading Details                           │ │ │
│  │ │ │                                                   │ │ │
│  │ │ │ Unable to load details. Please try again.         │ │ │
│  │ │ │                                                   │ │ │
│  │ │ │ [Retry] [Close]                                    │ │ │
│  │ │ └───────────────────────────────────────────────────┘ │ │
```

### Empty State (No Details)
```
│  │ │ ┌───────────────────────────────────────────────────┐ │ │
│  │ │ │ No Details Available                               │ │ │
│  │ │ │                                                   │ │ │
│  │ │ │ Details not available for this item.               │ │ │
│  │ │ └───────────────────────────────────────────────────┘ │ │
```

### Minimal Details (Limited Access)
```
│  │ │ ┌───────────────────────────────────────────────────┐ │ │
│  │ │ │ Limited Details Available                         │ │ │
│  │ │ │                                                   │ │ │
│  │ │ │ You have limited access to this item.              │ │ │
│  │ │ │ [View Full Page] for complete details.             │ │ │
│  │ │ └───────────────────────────────────────────────────┘ │ │
```

---

## Responsive Behavior

### Desktop (> 1024px)
- Full modal width (max 600px)
- All sections visible
- Side-by-side quick actions

### Tablet (768px - 1024px)
- Modal width (90% viewport)
- Stacked sections
- Stacked quick actions

### Mobile (< 768px)
- Modal width (95% viewport, full screen feel)
- Full-width sections
- Touch-optimized actions

---

## Interactions

1. **Click View Full Page:** Navigate to full detail page (closes modal)
2. **Click Quick Action:** Execute action (Export, Communicate, etc.)
3. **Click Close/X:** Dismiss modal
4. **ESC Key:** Dismiss modal

---

## Usage Patterns

### From List Page
- **Trigger:** Click "View Details" or row in list
- **Content:** Condensed version of detail page
- **Actions:** View Full Page, Export, Communicate

### From Dashboard
- **Trigger:** Click widget or summary card
- **Content:** Summary information from dashboard context
- **Actions:** View Full Page, Quick actions

### From Notification
- **Trigger:** Click notification item
- **Content:** Relevant details about notification item
- **Actions:** View Full Page, Dismiss notification

---

## Accessibility

- **Keyboard Navigation:** Tab through sections, Enter to activate actions, ESC to close
- **Screen Reader:** Announce item type, key information, status, actions
- **Focus Management:** Focus on first action on open
- **ARIA Labels:** Modal role, item type, status, action buttons

---

## Related Wireframes

- **Usage:** Used in list pages, dashboards, notifications for quick inspection
- **Examples:** Submission list preview, product list preview, notification detail preview
- **Full Page:** Corresponding detail page wireframes (full page view)
- **Integration:** All list pages and dashboards

---

**Created:** 2025-01-15  
**Last Updated:** 2025-01-15  
**Owner:** Emma (UI/UX + Next.js Frontend Specialist)  
**Reviewers:** Fatima (MOH Regulatory Requirements), Dr. Samir (Business Process Validation)

