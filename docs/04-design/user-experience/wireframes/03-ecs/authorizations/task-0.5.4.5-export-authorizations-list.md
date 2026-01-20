# Task 0.5.4.5: Export Authorizations List Page Wireframe

**Status:** ✅ Complete  
**Route:** `/ecs/authorizations`  
**File:** `task-0.5.4.5-export-authorizations-list.png`  
**Priority:** 🟡 ECS Module

**Design Approach:** Modern enterprise list pattern with table view, advanced filtering, search, and validity period indicators. Professional, accessible, and optimized for export authorization management with 90-day validity tracking.

---

## Wireframe Layout

```
┌─────────────────────────────────────────────────────────────┐
│ Home > ECS > Export Authorizations                           │
│                                                             │
│ Export Authorizations                                       │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Search authorizations...              [🔍] [Filters ▼] ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ℹ️ Export Authorizations                                   ││
│    Regulatory Compliance (Fatima's Requirement):            ││
│    • 90-Day Authorization Period: Regulatory requirement   ││
│    • Regulatory Deadline: Per DMP Art. [X]                 ││
│    • Expiration Consequences: [Link to consequences]       ││
│    [View Regulatory Framework]                             ││
│                                                             │
│ ┌──────────┐ ┌───────────────────────────────────────────┐│
│ │ Filters  │ │ Export Authorizations Table                  ││
│ │          │ │                                             ││
│ │ Validity │ │ ID          Company         SKU       Status    Authorized    Expires    Actions ││
│ │ ☐ All    │ │ ──────      ────────────    ────      ──────    ──────        ──────     ────── ││
│ │ ☑ Active │ │ AUTH-2025-01 ABC Pharma    SKU001    Active    Jan 15        Apr 15     [View]  ││
│ │ ☐ Expired│ │                            Tablet    (45d)                   (45d rem.)  [Complete││
│ │ ☐ Expiring││                           500mg                          [Revoke](T1) ││
│ │          │ │                                             ││
│ │ Status   │ │ AUTH-2025-03 XYZ Medical   SKU002    Expiring Jan 10        Apr 10     [View]  ││
│ │ ☐ All    │ │              Supplies      Capsule   (75d)   (7d rem.)      [Complete││
│ │ ☑ Active │ │                            250mg              ⚠️ 7 days      [Revoke](T1) ││
│ │ ☐ Expired│ │                                             ││
│ │ ☐ Expiring││ AUTH-2025-05 DEF Corp      SKU003    Expired Jan 5         Apr 5      [View]  ││
│ │          │ │                            Tablet    (expired)              [View History] ││
│ │ Company  │ │                            100mg                                            ││
│ │ ☐ All    │ │                                             ││
│ │ ☐ ABC    │ │ AUTH-2025-08 GHI Pharma    SKU004    Active    Jan 20        Apr 20     [View]  ││
│ │ ☐ XYZ    │ │                            Tablet    (25d)                   (25d rem.)  [Complete││
│ │          │ │                            250mg                          [Revoke](T1) ││
│ │ Date     │ │                                             ││
│ │ Last 7d  │ │ [Load More]                                 ││
│ │ Last 30d │ │                                             ││
│ │ Custom   │ │                                             ││
│ │          │ │                                             ││
│ │ [Clear]  │ │                                             ││
│ └──────────┘ └───────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

---

## Component Specifications

### Page Header
- **Breadcrumbs:** "Home > ECS > Export Authorizations"
- **Title:** "Export Authorizations"
  - **Typography:** 24px, font-weight: 600, color: #111827
- **Actions (Right-aligned):** None (authorizations created from approved requests)

### Search Bar
- **Input:** Full-width search input with placeholder "Search authorizations..."
- **Icon:** Search icon on right side
- **Functionality:** Real-time search as user types (searches authorization ID, company name, SKU ID)
- **Clear Button:** X button appears when text entered

### Filters Sidebar (Left)
- **Width:** 240px (desktop), hidden on mobile (drawer)
- **Background:** White (#ffffff)
- **Border Right:** 1px solid #e5e7eb
- **Padding:** 16px

**Filter Sections:**
- **Validity Filter:**
  - Checkboxes: All, Active, Expired, Expiring Soon
  - Default: Active selected
  - **Expiring Soon:** Authorizations expiring within 30/15/7 days (configurable)
- **Status Filter:**
  - Checkboxes: All, Active, Expired, Expiring Soon
  - Default: Active selected
- **Company Filter:**
  - Multi-select dropdown or checkboxes
  - Shows list of companies (IPC only)
  - Default: All selected
- **Date Range Filter:**
  - Quick filters: Last 7 days, Last 30 days, Custom
  - Custom: Date range picker (authorization date)

**Clear Filters Button:**
- **Position:** Bottom of filters sidebar
- **Style:** Secondary button
- **Action:** Resets all filters to default

### Export Authorizations Table
- **Layout:** Full-width table with horizontal scroll on mobile
- **Columns:**
  1. **ID:** Export authorization ID (e.g., AUTH-2025-01)
     - **Format:** AUTH-YYYY-NN
     - **Display:** Monospace font for better readability
     - **Click Action:** Navigate to authorization detail
  2. **Company:** Company name (link to company detail)
     - **Display:** Company name
     - **Click Action:** Filter by company (optional)
  3. **SKU:** SKU information
     - **Display:** SKU ID, product description, dosage form, strength
     - **Format:** "SKU001\nTablet 500mg" (two-line format)
  4. **Status:** Authorization status with validity indicator
     - **Badges:** Color-coded status badges
     - **Active:** Green badge + days remaining indicator (e.g., "(45d)")
     - **Expiring Soon:** Yellow/orange badge + warning indicator (e.g., "⚠️ 7 days")
     - **Expired:** Gray badge + "(expired)" text
     - **Display:** Status name + additional info (days remaining or expiration)
  5. **Authorized:** Authorization date
     - **Format:** "Jan 15" or "January 15, 2025"
     - **Sortable:** Yes
  6. **Expires:** Expiration date with countdown
     - **Format:** "Apr 15" or "April 15, 2025"
     - **Display:** Date + days remaining indicator (e.g., "(45d rem.)")
     - **Warning:** Expiring soon warnings (30/15/7 days before expiration)
     - **Sortable:** Yes
  7. **Actions:** Action buttons (role-based)
     - **View:** Navigate to detail page (all roles)
     - **Complete:** Company users only (if not completed)
     - **Revoke:** MOH Tier 1 only (if active)

**Table Features:**
- **Sortable Columns:** ID, Company, SKU, Status, Authorized, Expires (click header to sort)
- **Row Hover:** Background color change (#f9fafb)
- **Row Click:** Navigate to authorization detail page
- **Status Badges:**
  - Active: Green (#10b981) + days remaining indicator
  - Expiring Soon: Yellow (#eab308) or Orange (#f97316) + warning icon
  - Expired: Gray (#6b7280) + "(expired)" text
- **Expiration Warnings:**
  - 30 days before: Subtle warning
  - 15 days before: Yellow badge
  - 7 days before: Orange badge + warning icon
  - Expired: Gray badge
- **Validity Countdown:** Shows days remaining until expiration (e.g., "45d rem." = 45 days remaining)

**Pagination:**
- **Load More Button:** At bottom of table
- **Pagination Info:** "Showing 1-20 of 25 authorizations"
- **Page Size:** 20 items per page (default)

---

## Role-Based Access

### Company Users (IPC only)
- **View:** Can only see their own export authorizations
- **Actions:** 
  - View (own authorizations)
  - Complete (report export completion, if not completed)
- **Filters:** Limited to own company (automatically filtered)

### MOH Tier 1
- **Full Access:** Can view all export authorizations, revoke
- **Actions:** 
  - View all authorizations
  - Revoke active authorizations
  - View historical authorizations
- **Filters:** All companies, all validity statuses

### MOH Tier 2
- **View Access:** Can view all export authorizations
- **Actions:** 
  - View all authorizations
  - View historical authorizations
- **No Actions:** Cannot revoke (Tier 1 function)

---

## State Variations

### Empty State (No Authorizations)
- **Message:** "No export authorizations found"
- **Subtext:** "Authorizations are created when export requests are approved"
- **Visual:** Empty state illustration

### Loading State
- **Skeleton:** Table rows with shimmer effect
- **Count:** 5-10 skeleton rows

### Error State
- **Message:** "Unable to load export authorizations"
- **Action:** "Retry" button

### Filtered Empty State
- **Message:** "No authorizations match your filters"
- **Action:** "Clear Filters" button

### Module Inactive State
- **Message:** "ECS module is not active"
- **Subtext:** "Contact MOH Tier 1 to activate the ECS module"
- **Note:** Historical data may still be accessible if `has_historical_ecs_data()` returns true

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
- **Cards:** Show key information (ID, Company, SKU, Status, Expires), tap to expand for full details

---

## Interactions

### Click Actions
- **Authorization Row/ID:** Navigate to `/ecs/authorizations/[id]`
- **View Button:** Navigate to authorization detail
- **Complete Button:** Open completion reporting interface (Company users, if not completed)
- **Revoke Button:** Open revoke authorization modal (MOH Tier 1, if active)
- **Status Badge:** Filter by status (optional)

### Hover States
- **Table Rows:** Background color change (#f9fafb)
- **Links:** Underline on hover
- **Buttons:** Slight elevation/shadow

### Sort Actions
- **Column Headers:** Click to sort (ascending/descending)
- **Sort Indicator:** Arrow icon showing sort direction

---

## Validity Period Indicators

### Active Authorization
- **Badge Color:** Green (#10b981)
- **Display:** "Active (45d)" - shows days remaining until expiration
- **Expiration Warning:** None (if > 30 days remaining)

### Expiring Soon (30-15 days)
- **Badge Color:** Yellow (#eab308)
- **Display:** "Expiring (15d)" - shows days remaining
- **Expiration Warning:** Subtle warning icon

### Expiring Soon (15-7 days)
- **Badge Color:** Orange (#f97316)
- **Display:** "⚠️ Expiring (7d)" - shows warning icon and days remaining
- **Expiration Warning:** Prominent warning icon

### Expiring Soon (<7 days)
- **Badge Color:** Red (#ef4444)
- **Display:** "⚠️ Expiring (3d)" - shows urgent warning
- **Expiration Warning:** Urgent warning icon and countdown

### Expired Authorization
- **Badge Color:** Gray (#6b7280)
- **Display:** "Expired"
- **Expiration Warning:** "(expired)" text
- **Actions:** View only (no complete or revoke actions)

---

## Business Rules

1. **Authorization Validity:** 90 calendar days from authorization date
2. **Expiration Warnings:** Show warnings at 30, 15, and 7 days before expiration
3. **Completion:** Company users can report export completion (moves to `completed` state)
4. **Revocation:** MOH Tier 1 can revoke active authorizations (moves to `revoked` state)
5. **Extension:** Authorization extensions possible (up to 30 additional days) - handled on detail page
6. **Threshold Switching:** Occurs on authorization (VCI → ECS for 3 months)
7. **Threshold Reversion:** Occurs automatically after 3 months or on revocation/cancellation
8. **Filtering:** Validity filter (Active, Expired, Expiring Soon) and status filter
9. **Expiration Countdown:** Shows days remaining until expiration in status badge

---

## Design System References

- [UI Component Specifications](../../../../02-architecture/frontend/ui-component-specifications.md) - Tables, filters, badges, countdown timers
- [Role-Based UI Patterns](../../../../02-architecture/frontend/role-based-ui-patterns.md) - Role-based access
- [Form Design Patterns](../../../../02-architecture/frontend/form-design-patterns.md) - Filters
- [Workflow Architecture](../../../../02-architecture/workflow-architecture.md) - Export Request Workflow

---

## Related Wireframes

- [ECS Overview](../overview/task-0.5.4.0-ecs-overview.md)
- [Export Authorization Detail](task-0.5.4.6-export-authorization-detail.md)
- [Export Completion Reporting](task-0.5.4.7-export-completion-reporting.md)
- [Export Requests List](../export-requests/task-0.5.4.1-export-requests-list.md)

---

**Next:** [Export Authorization Detail](task-0.5.4.6-export-authorization-detail.md)

**Last Updated:** 2025-01-15  
**Owner:** Emma (UI/UX + Next.js Frontend Specialist)  
**Guided by:** Fatima (MOH Regulatory Requirements) & Dr. Samir (Business Process Validation)

