# Task 0.5.2.1: Enforcement Actions List Page Wireframe

**Status:** 🟡 In Progress  
**Route:** `/enforcement/actions` (MOH Tier 1 and Tier 2 only)  
**File:** `task-0.5.2.1-enforcement-actions-list.png`  
**Priority:** 🔴 Core RMM Workflows

**Design Approach:** Modern enterprise list pattern with advanced filtering, search, and status indicators. Professional, accessible, and optimized for MOH governance enforcement workflows.

---

## Wireframe Layout

```
┌─────────────────────────────────────────────────────────────┐
│ Home > Enforcement > Actions                                 │
│                                                             │
│ Enforcement Actions                    [New Action]        │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Search actions...                        [🔍] [Filters ▼]││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌──────────┐ ┌───────────────────────────────────────────┐│
│ │ Filters  │ │ Actions Table                              ││
│ │          │ │                                             ││
│ │ Type     │ │ Type  Company  Violation  Amount  Status  ││
│ │ ☐ All    │ │ ────  ───────  ─────────  ──────  ────── ││
│ │ ☑ Warning│ │ ⚠️    ABC Inc   Submission  -      Executed││
│ │ ☐ Fine   │ │       Pharma   Non-Compl.        2h ago   ││
│ │ ☐ Susp.  │ │                                             ││
│ │          │ │ 💰    XYZ Ltd  Threshold  5,000  Pending ││
│ │ Status   │ │       Pharma   Breach     MAD    Approval ││
│ │ ☐ All    │ │                                             ││
│ │ ☑ Pending│ │ 🚫    DEF Co   Critical   -      Executed││
│ │ ☐ Executed│ │       Pharma   Medicine         1d ago   ││
│ │ ☐ Appealed│ │                  Non-Compl.               ││
│ │          │ │                                             ││
│ │ Company  │ │ ⚠️    GHI Inc   Export      -      Executed││
│ │ ☐ All    │ │       Pharma   Violation         3d ago   ││
│ │ ☐ ABC    │ │                                             ││
│ │ ☐ XYZ    │ │ 💰    JKL Ltd  Data        2,500  Pending ││
│ │          │ │       Pharma   Quality    MAD    Approval ││
│ │ Date     │ │                  Issue                      ││
│ │ Last 7d  │ │                                             ││
│ │ Last 30d │ │ [Load More]                                ││
│ │ Custom   │ │                                             ││
│ │          │ │                                             ││
│ │          │ │                                             ││
│ │ [Clear]  │ │                                             ││
│ └──────────┘ └───────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

---

## Component Specifications

### Page Header
- **Breadcrumbs:** "Home > Enforcement > Actions"
- **Title:** "Enforcement Actions"
  - **Typography:** 24px, font-weight: 600, color: #111827
- **Actions (Right-aligned):**
  - **New Action Button:** Primary button, click → Navigate to `/enforcement/actions/new`
  - **Spacing:** 16px between actions

### Search Bar
- **Input:** Full-width search input with placeholder "Search actions..."
- **Icon:** Search icon on right side
- **Functionality:** Real-time search as user types (searches company name, violation type, action type)
- **Clear Button:** X button appears when text entered

### Filters Sidebar (Left)
- **Width:** 240px (desktop), hidden on mobile (drawer)
- **Background:** White (#ffffff)
- **Border Right:** 1px solid #e5e7eb
- **Padding:** 16px

**Filter Sections:**
- **Action Type Filter:**
  - Checkboxes: All, Warning, Fine, Suspension
  - Default: All selected
- **Status Filter:**
  - Checkboxes: All, Pending Approval, Executed, Appealed, Resolved, Cancelled
  - Default: All selected
- **Company Filter:**
  - Multi-select dropdown or checkboxes
  - Shows list of companies with actions
- **Date Range Filter:**
  - Quick filters: Last 7 days, Last 30 days, Custom
  - Custom: Date range picker

**Clear Filters Button:**
- **Position:** Bottom of filters sidebar
- **Style:** Secondary button
- **Action:** Resets all filters to default

### Actions Table
- **Layout:** Full-width table with horizontal scroll on mobile
- **Columns:**
  1. **Type:** Icon + text (⚠️ Warning, 💰 Fine, 🚫 Suspension)
  2. **Company:** Company name (link to company detail)
  3. **Violation:** Violation type (truncated if long)
  4. **Amount:** Fine amount (MAD) or "-" for warnings/suspensions
  5. **Status:** Status badge with color coding
  6. **Date:** Relative time (e.g., "2h ago", "1d ago")

**Table Features:**
- **Sortable Columns:** Type, Company, Date (click header to sort)
- **Row Hover:** Background color change (#f9fafb)
- **Row Click:** Navigate to action detail page
- **Status Badges:**
  - Pending Approval: Yellow (#fbbf24)
  - Executed: Green (#10b981)
  - Appealed: Orange (#f97316)
  - Resolved: Blue (#3b82f6)
  - Cancelled: Gray (#6b7280)

**Pagination:**
- **Load More Button:** At bottom of table
- **Pagination Info:** "Showing 1-20 of 60 actions"
- **Page Size:** 20 items per page (default)

---

## Role-Based Access

### MOH Tier 1
- **Full Access:** Can view all actions, create, approve, execute
- **Actions:** "New Action" button, approve/reject actions

### MOH Tier 2
- **View Access:** Can view all actions
- **Limited Create:** Can create warnings (subject to approval for fines/suspensions)
- **Actions:** "New Action" button (limited action types)

### Companies
- **No Access:** This page is not accessible to company users
- **Alternative:** Companies view their own enforcement actions on Company Dashboard

---

## State Variations

### Empty State (No Actions)
- **Message:** "No enforcement actions found"
- **Subtext:** "Create your first enforcement action to get started"
- **Action Button:** "New Action"
- **Visual:** Empty state illustration

### Loading State
- **Skeleton:** Table rows with shimmer effect
- **Count:** 5-10 skeleton rows

### Error State
- **Message:** "Unable to load enforcement actions"
- **Action:** "Retry" button

### Filtered Empty State
- **Message:** "No actions match your filters"
- **Action:** "Clear Filters" button

---

## Responsive Design

### Desktop (≥1024px)
- **Layout:** Filters sidebar + table
- **Filters:** Always visible sidebar
- **Table:** Full columns visible

### Tablet (768px - 1023px)
- **Layout:** Collapsible filters sidebar
- **Table:** Horizontal scroll for additional columns
- **Filters:** Drawer on mobile

### Mobile (<768px)
- **Layout:** Stack layout
- **Filters:** Hidden (accessible via filter button)
- **Table:** Card-based layout instead of table
- **Cards:** Show key information, tap to expand

---

## Interactions

### Click Actions
- **Action Row:** Navigate to `/enforcement/actions/[id]`
- **Company Name:** Navigate to `/rmm/companies/[id]`
- **Status Badge:** Filter by status
- **"New Action" Button:** Navigate to `/enforcement/actions/new`

### Hover States
- **Table Rows:** Background color change (#f9fafb)
- **Links:** Underline on hover
- **Buttons:** Slight elevation/shadow

### Sort Actions
- **Column Headers:** Click to sort (ascending/descending)
- **Sort Indicator:** Arrow icon showing sort direction

---

## Design System References

- [UI Component Specifications](../../../../02-architecture/frontend/ui-component-specifications.md) - Tables, filters, badges
- [Role-Based UI Patterns](../../../../02-architecture/frontend/role-based-ui-patterns.md) - Role-based access
- [Form Design Patterns](../../../../02-architecture/frontend/form-design-patterns.md) - Filters

---

## Related Wireframes

- [Enforcement Dashboard](task-0.5.2.0-enforcement-dashboard.md)
- [Enforcement Action Detail](task-0.5.2.1a-enforcement-action-detail.md)
- [Create Enforcement Action](task-0.5.2.1b-create-enforcement-action-wizard.md)

---

**Next:** [Enforcement Action Detail](task-0.5.2.1a-enforcement-action-detail.md)

