# Task 0.5.2.2: Companies List Page Wireframe

**Status:** 🟡 In Progress  
**Route:** `/rmm/companies`  
**File:** `task-0.5.2.2-companies-list.png`  
**Priority:** 🔴 Core RMM Workflows

**Design Approach:** Modern enterprise list pattern with table view, advanced filtering, search, and role-based actions. Professional, accessible, and optimized for registry management workflows.

---

## Wireframe Layout

```
┌─────────────────────────────────────────────────────────────┐
│ Home > RMM > Companies                                       │
│                                                             │
│ Companies                              [New Company]        │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Search companies...                      [🔍] [Filters ▼]││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌──────────┐ ┌───────────────────────────────────────────┐│
│ │ Filters  │ │ Companies Table                           ││
│ │          │ │                                             ││
│ │ Type     │ │ Name          Reg. Number      Type      Status    Actions ││
│ │ ☐ All    │ │ ──────        ────────────      ────      ──────    ────── ││
│ │ ☑ IPC    │ │ ABC Pharma    REG-2024-001      IPC       Active    [View]  ││
│ │ ☐ Whole. │ │               Inc.                                        [Edit]  ││
│ │          │ │                                             ││
│ │ Status   │ │ XYZ Medical   REG-2024-002      Wholesaler Active    [View]  ││
│ │ ☐ All    │ │   Supplies                              ││
│ │ ☑ Active │ │                                             ││
│ │ ☐ Inact. │ │ DEF Pharma   REG-2024-003      IPC       Active    [View]  ││
│ │          │ │               Ltd.                                        [Edit]  ││
│ │ Company  │ │                                             ││
│ │ ☐ All    │ │ GHI Pharma   REG-2024-004      IPC       Inactive  [View]  ││
│ │ ☐ ABC    │ │               Corp.                                        [Edit] ││
│ │ ☐ XYZ    │ │                                             ││
│ │          │ │ JKL Medical   REG-2024-005      Wholesaler Active    [View]  ││
│ │ Date     │ │   Distrib.                              ││
│ │ Last 7d  │ │                                             ││
│ │ Last 30d │ │ [Load More]                              ││
│ │ Custom   │ │                                             ││
│ │          │ │                                             ││
│ │ [Clear]  │ │                                             ││
│ └──────────┘ └───────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

---

## Component Specifications

### Page Header
- **Breadcrumbs:** "Home > RMM > Companies"
- **Title:** "Companies"
  - **Typography:** 24px, font-weight: 600, color: #111827
- **Actions (Right-aligned):**
  - **New Company Button:** Primary button (role-based visibility)
  - **Click Action:** Navigate to `/rmm/companies/new`

### Search Bar
- **Input:** Full-width search input with placeholder "Search companies..."
- **Icon:** Search icon on right side
- **Functionality:** Real-time search as user types (searches company name, registration number)
- **Clear Button:** X button appears when text entered

### Filters Sidebar (Left)
- **Width:** 240px (desktop), hidden on mobile (drawer)
- **Background:** White (#ffffff)
- **Border Right:** 1px solid #e5e7eb
- **Padding:** 16px

**Filter Sections:**
- **Type Filter:**
  - Checkboxes: All, IPC (Industrial Pharmaceutical Company), Wholesaler
  - Default: All selected
- **Status Filter:**
  - Checkboxes: All, Active, Inactive
  - Default: Active selected
- **Company Filter:**
  - Multi-select dropdown or checkboxes
  - Shows list of companies
- **Date Range Filter:**
  - Quick filters: Last 7 days, Last 30 days, Custom
  - Custom: Date range picker

**Clear Filters Button:**
- **Position:** Bottom of filters sidebar
- **Style:** Secondary button
- **Action:** Resets all filters to default

### Companies Table
- **Layout:** Full-width table with horizontal scroll on mobile
- **Columns:**
  1. **Name:** Company name (link to company detail)
  2. **Registration Number:** Registration identifier (e.g., REG-2024-001)
     - **Format:** REG-YYYY-NNNNN
     - **Display:** Monospace font for better readability
     - **Width:** Fixed width or minimum width to prevent wrapping
  3. **Type:** IPC or Wholesaler (badge)
  4. **Status:** Active/Inactive (badge with color coding)
  5. **Actions:** Action buttons (View, Edit)

**Table Features:**
- **Sortable Columns:** Name, Registration Number, Type, Status (click header to sort)
- **Row Hover:** Background color change (#f9fafb)
- **Row Click:** Navigate to company detail page
- **Registration Number:**
  - **Format:** REG-YYYY-NNNNN (e.g., REG-2024-001)
  - **Styling:** Monospace font for better readability
  - **Click Action:** Can click to filter by registration number (optional)
- **Status Badges:**
  - Active: Green (#10b981)
  - Inactive: Gray (#6b7280)

**Pagination:**
- **Load More Button:** At bottom of table
- **Pagination Info:** "Showing 1-20 of 150 companies"
- **Page Size:** 20 items per page (default)

---

## Role-Based Access

### Company Users
- **Limited View:** Can only see their own company
- **Actions:** View only (no edit, unless Company Admin)

### Company Admin
- **Own Company:** Can view and edit own company
- **Actions:** View, Edit (for own company)

### MOH Tier 1
- **Full Access:** Can view all companies, create, edit, deactivate
- **Actions:** View, Edit, Deactivate, Delete (with approval)

### MOH Tier 2
- **View Access:** Can view all companies
- **Limited Actions:** Can create, edit (subject to approval workflow)

---

## State Variations

### Empty State (No Companies)
- **Message:** "No companies found"
- **Subtext:** "Create your first company to get started"
- **Action Button:** "New Company"
- **Visual:** Empty state illustration

### Loading State
- **Skeleton:** Table rows with shimmer effect
- **Count:** 5-10 skeleton rows

### Error State
- **Message:** "Unable to load companies"
- **Action:** "Retry" button

### Filtered Empty State
- **Message:** "No companies match your filters"
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
- **Cards:** Show key information (Name, Registration Number, Type, Status), tap to expand for full details
- **Registration Number:** Visible on mobile cards (important for verification)

---

## Interactions

### Click Actions
- **Company Row/Name:** Navigate to `/rmm/companies/[id]`
- **View Button:** Navigate to company detail
- **Edit Button:** Navigate to `/rmm/companies/[id]/edit`
- **Status Badge:** Filter by status
- **"New Company" Button:** Navigate to `/rmm/companies/new`

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

- [Company Detail](task-0.5.2.3-company-detail.md)
- [Company Create/Edit Form](task-0.5.2.8-company-create-edit-form.md)
- [Registry Submission List](task-0.5.2.11-registry-submission-list.md)

---

**Next:** [Company Detail](task-0.5.2.3-company-detail.md)

