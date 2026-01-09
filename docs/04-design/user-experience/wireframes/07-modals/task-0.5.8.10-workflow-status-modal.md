# Task 0.5.8.10: Workflow Status Modal Wireframe

**Status:** 🟡 In Progress  
**Route:** Modal overlay (reusable pattern, no specific route)  
**File:** `task-0.5.8.10-workflow-status-modal.png`  
**Priority:** 🟢 Analytics & Historical Data (Reusable UI Patterns)

**Design Approach:** Reusable workflow status modal showing workflow progress, approval chain, and status transitions. Professional, accessible, and optimized for quick workflow inspection without navigation.

**Guidance:** Fatima (MOH Regulatory Requirements) - Workflow status modal critical for regulatory approval chain visibility and audit trail. Dr. Samir (Business Process Validation) - Workflow visibility improves decision-making and process efficiency.

---

## Wireframe Layout

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  [Modal Overlay - Dark background overlay 80% opacity]     │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │ Workflow Status                                   [✕]  │ │
│  │                                                       │ │
│  │ Submission: AAMS 2024 - ABC Pharmaceuticals           │ │
│  │                                                       │ │
│  │ ┌───────────────────────────────────────────────────┐ │ │
│  │ │ Workflow Progress                                 │ │ │
│  │ │                                                   │ │ │
│  │ │ Draft → Submitted → Tier 2 Verified → Tier 1 Approved│ │ │
│  │ │   ✓        ✓              ✓              ⏳       │ │ │
│  │ │                                                   │ │ │
│  │ │ Current Status: Tier 1 Approval Pending           │ │ │
│  │ │ Progress: 75% (3 of 4 steps complete)              │ │ │
│  │ └───────────────────────────────────────────────────┘ │ │
│  │                                                       │ │
│  │ ┌───────────────────────────────────────────────────┐ │ │
│  │ │ Approval Chain                                    │ │ │
│  │ │                                                   │ │ │
│  │ │ 1. Draft                                          │ │ │
│  │ │    ✓ Completed - January 10, 2024                  │ │ │
│  │ │    User: Company Admin                            │ │ │
│  │ │    Notes: Initial draft created                    │ │ │
│  │ │                                                   │ │ │
│  │ │ 2. Submitted                                      │ │ │
│  │ │    ✓ Completed - January 15, 2024                  │ │ │
│  │ │    User: Company Admin                            │ │ │
│  │ │    Notes: Submission finalized and submitted        │ │ │
│  │ │                                                   │ │ │
│  │ │ 3. Tier 2 Verified                                │ │ │
│  │ │    ✓ Completed - February 5, 2024                  │ │ │
│  │ │    User: MOH Tier 2 - Ahmed Benali                  │ │ │
│  │ │    Notes: Sales data verified. Threshold calculated.│ │ │
│  │ │                                                   │ │ │
│  │ │ 4. Tier 1 Approved                                │ │ │
│  │ │    ⏳ Pending                                      │ │ │
│  │ │    Assigned to: MOH Tier 1 - Fatima Alami            │ │ │
│  │ │    Due: February 20, 2024                          │ │ │
│  │ │    Notes: Awaiting Tier 1 approval                 │ │ │
│  │ └───────────────────────────────────────────────────┘ │ │
│  │                                                       │ │
│  │ ┌───────────────────────────────────────────────────┐ │ │
│  │ │ Status Transitions                                │ │ │
│  │ │                                                   │ │ │
│  │ │ • Draft → Submitted (Jan 10 → Jan 15)              │ │ │
│  │ │ • Submitted → Tier 2 Verified (Jan 15 → Feb 5)     │ │ │
│  │ │ • Tier 2 Verified → Tier 1 Approved (Feb 5 → Pending)│ │ │
│  │ └───────────────────────────────────────────────────┘ │ │
│  │                                                       │ │
│  │ [View Full Details]                  [Close]          │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Key Features

### Workflow Progress
- **Visual Progress:** Step indicators with checkmarks (✓) and pending (⏳)
- **Current Status:** Clear indication of current workflow step
- **Progress Percentage:** Numerical progress (X% or X of Y steps)
- **Status Label:** Current status text

### Approval Chain
- **Step-by-Step:** List of all workflow steps in order
- **Status Indicators:** Completed (✓), Pending (⏳), Rejected (❌)
- **Timestamps:** Date/time for each completed step
- **User Attribution:** User name and role for each action
- **Notes:** Comments or notes for each step
- **Assigned To:** For pending steps, show who is assigned
- **Due Date:** For pending steps, show due date

### Status Transitions
- **Transition History:** Timeline of status changes
- **Duration:** Time between transitions (if available)
- **Current Transition:** Highlight current transition in progress

### Actions
- **View Full Details:** Navigate to full detail page (closes modal)
- **Close:** Dismiss modal

---

## State Variations

### Completed Workflow
```
│  │ │ Draft → Submitted → Tier 2 Verified → Tier 1 Approved│ │ │
│  │ │   ✓        ✓              ✓              ✓        │ │ │
│  │ │                                                   │ │ │
│  │ │ Current Status: Completed                         │ │ │
│  │ │ Progress: 100% (4 of 4 steps complete)             │ │ │
```

### Rejected Workflow
```
│  │ │ Draft → Submitted → Tier 2 Verified → Rejected     │ │ │
│  │ │   ✓        ✓              ✓              ❌       │ │ │
│  │ │                                                   │ │ │
│  │ │ Current Status: Rejected                          │ │ │
│  │ │ Progress: 75% (3 of 4 steps complete)              │ │ │
│  │ │                                                   │ │ │
│  │ │ Reason: Insufficient stock level data             │ │ │
│  │ │ Rejected by: MOH Tier 2 - Ahmed Benali              │ │ │
│  │ │ Rejected on: February 5, 2024                      │ │ │
```

### Loading State
```
│  │ │ ┌───────────────────────────────────────────────────┐ │ │
│  │ │ │ [Loading spinner]                                 │ │ │
│  │ │ │ Loading workflow status...                        │ │ │
│  │ │ └───────────────────────────────────────────────────┘ │ │
```

### Complex Workflow (Multiple Steps)
```
│  │ │ Draft → Submitted → Tier 2 Verified → Tier 1 Review →│ │ │
│  │ │   ✓        ✓              ✓              ⏳           │ │ │
│  │ │   Tier 2 Implemented → Completed                     │ │ │
│  │ │                                   ⏳       ⏳        │ │ │
│  │ │                                                   │ │ │
│  │ │ Current Status: Tier 1 Review Pending               │ │ │
│  │ │ Progress: 50% (3 of 6 steps complete)                │ │ │
```

---

## Responsive Behavior

### Desktop (> 1024px)
- Full modal width (max 700px)
- Side-by-side progress and chain
- Full approval chain visible

### Tablet (768px - 1024px)
- Modal width (90% viewport)
- Stacked progress and chain
- Scrollable approval chain

### Mobile (< 768px)
- Modal width (95% viewport, full screen feel)
- Stacked sections
- Simplified progress indicator
- Touch-optimized scrolling

---

## Interactions

1. **Click Step:** Expand/collapse step details (if expandable)
2. **Click View Full Details:** Navigate to full detail page (closes modal)
3. **Click Close/X:** Dismiss modal
4. **Scroll:** Scroll through approval chain if long
5. **ESC Key:** Dismiss modal

---

## Accessibility

- **Keyboard Navigation:** Tab through steps, Enter to expand, ESC to close
- **Screen Reader:** Announce current status, progress, step status, timestamps, users
- **Focus Management:** Focus on current step on open
- **ARIA Labels:** Progress role, step states, status indicators, timeline

---

## Related Wireframes

- **Usage:** Used in submission details, export requests, enforcement actions
- **Examples:** AAMS submission workflow, export request workflow, enforcement action workflow
- **Full Details:** Corresponding detail page wireframes (full workflow view)
- **Integration:** All pages with workflow status indicators

---

**Created:** 2025-01-15  
**Last Updated:** 2025-01-15  
**Owner:** Emma (UI/UX + Next.js Frontend Specialist)  
**Reviewers:** Fatima (MOH Regulatory Requirements), Dr. Samir (Business Process Validation)

