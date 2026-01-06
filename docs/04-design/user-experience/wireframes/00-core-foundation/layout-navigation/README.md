# Layout & Navigation Wireframes

**Category:** Layout & Navigation  
**Priority:** 1 - Critical Foundation  
**Status:** ⚪ Not Started

## Wireframes

### Task 0.5.1.14: Dashboard Layout Structure

**Route:** All dashboard pages (layout component)  
**File:** `task-0.5.1.14-dashboard-layout-structure.png`

**Layout:**
```
┌─────────────────────────────────────────┐
│ Header (Fixed Top, ~64px)              │
├──────────┬──────────────────────────────┤
│ Sidebar  │ Main Content Area            │
│ (~256px) │ (Flexible width)             │
│          │                              │
│          │                              │
└──────────┴──────────────────────────────┘
```

**Components:**
- Header: Fixed top, white background, border bottom
- Sidebar: Left navigation, collapsible (256px expanded, 64px collapsed)
- Main Content: Flexible width, scrollable, padding ~24px

**Annotations Required:**
- **Blue:** Sidebar collapse/expand toggle
- **Green:** Sidebar expanded/collapsed states
- **Green:** Active navigation item highlight

**Responsive:**
- Desktop (1024px+): Full sidebar, full header
- Tablet (768-1023px): Sidebar collapses to icons, header remains full
- Mobile (<768px): Sidebar becomes drawer, hamburger menu (annotate)

---

### Task 0.5.1.15: Header Component

**Route:** All dashboard pages (header component)  
**File:** `task-0.5.1.15-header-component.png`

**Layout:**
```
┌─────────────────────────────────────────┐
│ [Logo] [Module]    [🔍] [🔔(3)] [User ▼]│
└─────────────────────────────────────────┘
```

**Components:**
- **Left:** Logo (clickable → `/dashboard`), Module indicator (if in module)
- **Right:** Search icon, Notifications icon (badge with count), User menu (avatar + dropdown)

**User Menu Dropdown:**
- Profile
- Settings
- Logout

**Annotations Required:**
- **Blue:** Click logo → Navigate to `/dashboard`
- **Blue:** Click search → Open search modal
- **Blue:** Click notifications → Open notification center
- **Blue:** Click user menu → Open dropdown
- **Green:** Notification badge count (dynamic), Unread indicator (red dot)

**Design System References:**
- Badge component, Avatar component, Dropdown component
- Module colors for module indicator

---

### Task 0.5.1.16: Sidebar Navigation

**Route:** All dashboard pages (sidebar component)  
**File:** `task-0.5.1.16-sidebar-navigation.png`

**Layout:**
```
┌──────────┐
│ Global   │
│ ├ Dashboard│
│ ├ Communications│
│ ├ History│
│ ├ Notifications│
│ └ Audit  │
│           │
│ RMM      │
│ ├ Overview│
│ ├ Companies│
│ ├ Products │
│ └ SKUs    │
│           │
│ VCI       │
│ ├ Dashboard│
│ ├ Submissions│
│ └ ...     │
│           │
│ [Collapse]│
└──────────┘
```

**Sections:**
1. **Global:** Dashboard, Communications, History, Notifications, Audit (MOH only), System Config (Tier 1 only)
2. **RMM:** Overview, Companies, Products, SKUs
3. **VCI:** Dashboard, Submissions, Thresholds, Breaches, Governance (MOH), Treemap (MOH)
4. **ECS:** (if active OR historical data exists) Overview, Export Requests, Authorizations, History
5. **CMC:** (if active OR historical data exists) Overview, Scores, Disputes, Reports, History
6. **Help & Info:** Support, FAQ, Documentation, Contact, Status

**Components:**
- Module groups with labels
- Navigation items: Icon + Label
- Active state: Highlighted background, colored left border
- Badge support: Count indicators (e.g., pending approvals)
- Collapse toggle at bottom

**Role-Based Variations (Annotate):**
- Company Users: See all modules (if activated)
- MOH Tier 1: See all modules + MOH-only items + System Config
- MOH Tier 2: See all modules + verification items
- Auditors: Limited navigation (Audit-focused)

**Annotations Required:**
- **Blue:** Click navigation item → Navigate to route
- **Blue:** Click collapse toggle → Collapse/expand sidebar
- **Green:** Active navigation item (highlighted), Collapsed state (icons only)

**Design System References:**
- Navigation patterns (from Navigation & Layout Patterns)
- Module icons, navigation icons
- Active state colors, module colors

---

### Task 0.5.1.17: Notification Center Component

**Route:** All dashboard pages (component in header)  
**File:** `task-0.5.1.17-notification-center-component.png`

**Layout (Dropdown/Popover):**
```
┌─────────────────────────────┐
│ Notifications    [Mark all] │
├─────────────────────────────┤
│ ● Submission approved       │
│   Just now                  │
├─────────────────────────────┤
│ ○ New breach detected       │
│   5 minutes ago             │
├─────────────────────────────┤
│ [View All Notifications →]  │
└─────────────────────────────┘
```

**Components:**
- Header: "Notifications" title, "Mark all as read" button
- Notification List: Unread indicator (●), Title, Message, Timestamp
- Footer: "View All Notifications" link → `/notifications`

**Notification Types (Annotate):**
- Submission Status: Approved, rejected, pending
- Breach Alerts: New breach detected
- Action Required: Items needing user attention
- System: System updates, maintenance

**Annotations Required:**
- **Blue:** Click notification → Navigate to related page
- **Blue:** Click "Mark all as read" → Mark all as read
- **Blue:** Click "View All" → Navigate to `/notifications`
- **Green:** Unread notification (colored dot, bold text), Read notification (empty circle, normal text), Empty state

**Design System References:**
- Dropdown/Popover component, List component, Badge component
- Unread indicator color, hover states

---

**Related Documents:**
- [Navigation & Layout Patterns](../../../../02-architecture/frontend/navigation-layout-patterns.md)
- [Routing Structure](../../../../02-architecture/frontend/routing-structure.md)
- [Role-Based UI Patterns](../../../../02-architecture/frontend/role-based-ui-patterns.md)

