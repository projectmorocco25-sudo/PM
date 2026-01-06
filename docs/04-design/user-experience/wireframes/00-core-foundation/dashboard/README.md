# Dashboard Wireframes

**Category:** Dashboard (Role-Based)  
**Priority:** 1 - Critical Foundation  
**Status:** ⚪ Not Started

## Wireframes

### Task 0.5.1.18: Company Dashboard

**Route:** `/dashboard` (Company role)  
**File:** `task-0.5.1.18-company-dashboard.png`

**Layout:**
```
┌─────────────────────────────────────────┐
│ Welcome, [Company Name]                 │
│                                         │
│ ┌─────────┐ ┌─────────┐ ┌─────────┐   │
│ │ My      │ │ Pending│ │ Recent  │   │
│ │ Submissions│ │ Approvals│ │ Activity│   │
│ │ 12      │ │ 3      │ │ [List]  │   │
│ └─────────┘ └─────────┘ └─────────┘   │
│                                         │
│ ┌─────────────────────────────────┐   │
│ │ Key Metrics                      │   │
│ │ [Compliance Score, etc.]         │   │
│ └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

**Components:**
- Page Header: Welcome message, Quick actions (optional)
- Widget Grid:
  - **My Submissions:** Count, Recent submissions list, "View all" link
  - **Pending Approvals:** Count, Pending items list, "View all" link
  - **Recent Activity:** Timeline/list, Filter by type
- Key Metrics Section: Compliance Score card, Active Submissions, Pending Actions

**Annotations Required:**
- **Blue:** Click widget → Navigate to related page
- **Blue:** Click submission/item → Navigate to detail page
- **Green:** Loading state (skeleton loaders), Empty state (no submissions)

**Design System References:**
- Card component, Metric Card component, List component, Timeline component
- Grid system, widget layout

---

### Task 0.5.1.19: MOH Tier 1 Dashboard

**Route:** `/dashboard` (MOH Tier 1 role)  
**File:** `task-0.5.1.19-moh-tier1-dashboard.png`

**Layout:**
```
┌─────────────────────────────────────────┐
│ Governance Overview                     │
│                                         │
│ ┌─────────┐ ┌─────────┐ ┌─────────┐   │
│ │ System- │ │ Pending│ │ Action  │   │
│ │ Wide    │ │ Approvals│ │ Items   │   │
│ │ Metrics │ │ 15      │ │ [List]  │   │
│ │ [Charts]│ │ Items   │ │         │   │
│ └─────────┘ └─────────┘ └─────────┘   │
│                                         │
│ ┌─────────────────────────────────┐   │
│ │ Governance Dashboard             │   │
│ │ [Stock Sufficiency Charts]       │   │
│ │ [Breach Status Overview]        │   │
│ │ [Action Recommendations]        │   │
│ └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

**Components:**
- Page Header: "Governance Overview" title, Date range filter (optional), Refresh button
- Widget Grid:
  - **System-Wide Metrics:** Charts/stats (total companies, active submissions, system health), Real-time indicators
  - **Pending Approvals:** Count, Pending approvals list with priority, "View all" link
  - **Action Items:** List with priority indicators, "View all" link
- Governance Dashboard Section:
  - **Stock Sufficiency Charts:** Real-time stock level indicators, Breach status visualization
  - **Breach Status Overview:** Active breaches count, Critical breaches highlighted
  - **Action Recommendations:** Suggested actions, Priority indicators

**Annotations Required:**
- **Blue:** Click widget → Navigate to related page
- **Blue:** Click approval/item → Navigate to detail page
- **Blue:** Click chart → Drill down to detailed view
- **Green:** Real-time data updates (indicator), Loading state, Empty state

**Design System References:**
- Chart component, Metric Card component, List component, Badge component (priority)
- Dashboard widget layout

---

### Task 0.5.1.20: MOH Tier 2 Dashboard

**Route:** `/dashboard` (MOH Tier 2 role)  
**File:** `task-0.5.1.20-moh-tier2-dashboard.png`

**Layout:**
```
┌─────────────────────────────────────────┐
│ Verification Overview                  │
│                                         │
│ ┌─────────┐ ┌─────────┐ ┌─────────┐   │
│ │ Pending│ │ Oversight│ │ Review │   │
│ │ Verifications│ │ Metrics │ │ Queue  │   │
│ │ 8      │ │ [Charts]│ │ [List]  │   │
│ │ Items  │ │         │ │         │   │
│ └─────────┘ └─────────┘ └─────────┘   │
│                                         │
│ ┌─────────────────────────────────┐   │
│ │ Verification Queue               │   │
│ │ [Items requiring verification]   │   │
│ │ [Priority indicators]            │   │
│ └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

**Components:**
- Page Header: "Verification Overview" title, Filters (optional), Sort options
- Widget Grid:
  - **Pending Verifications:** Count, Recent pending items list, "View all" link
  - **Oversight Metrics:** Charts/stats (verification rates, system health), Trend indicators
  - **Review Queue:** List with priority indicators, "View all" link
- Verification Queue Section:
  - **Queue List:** Items requiring Tier 2 verification, Priority indicators (high, medium, low), Status indicators, Action buttons (Verify, Flag, etc.)

**Annotations Required:**
- **Blue:** Click widget → Navigate to related page
- **Blue:** Click verification item → Navigate to detail page
- **Blue:** Click action button → Perform action
- **Green:** Priority indicators (color-coded), Status indicators, Loading state, Empty state

**Design System References:**
- List component, Badge component (priority), Button component, Chart component
- Queue layout, widget layout

---

**Related Documents:**
- [Routing Structure](../../../../02-architecture/frontend/routing-structure.md)
- [Navigation & Layout Patterns](../../../../02-architecture/frontend/navigation-layout-patterns.md)
- [Role-Based UI Patterns](../../../../02-architecture/frontend/role-based-ui-patterns.md)

