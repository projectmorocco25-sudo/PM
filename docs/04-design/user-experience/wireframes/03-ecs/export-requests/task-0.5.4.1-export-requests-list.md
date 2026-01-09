# Task 0.5.4.1: Export Requests List Page Wireframe

**Status:** ✅ Complete  
**Route:** `/ecs/export-requests`  
**File:** `task-0.5.4.1-export-requests-list.png`  
**Priority:** 🟡 ECS Module

**Design Approach:** Modern enterprise list pattern with table view, advanced filtering, search, and role-based actions. Professional, accessible, and optimized for export control workflows.

---

## Wireframe Layout

```
┌─────────────────────────────────────────────────────────────┐
│ Home > ECS > Export Requests                                 │
│                                                             │
│ Export Requests                              [New Request]  │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Search export requests...              [🔍] [Filters ▼] ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌──────────┐ ┌───────────────────────────────────────────┐│
│ │ Filters  │ │ Export Requests Table                       ││
│ │          │ │                                             ││
│ │ Status   │ │ ID          Company         SKU       Status    Created    Actions ││
│ │ ☐ All    │ │ ──────      ────────────    ────      ──────    ──────     ────── ││
│ │ ☑ Pending│ │ REQ-2025-001 ABC Pharma    SKU001    Auto-     Jan 15     [View]  ││
│ │ ☐ Auto-  │ │                            Tablet    approval              [Inter- ││
│ │   Approv.│ │                           500mg      queue                 vene]  ││
│ │ ☐ Manual │ │                            (1d)                              (T1) ││
│ │ ☐ Tier2  │ │                                             ││
│ │ ☐ Approved││ REQ-2025-003 XYZ Medical   SKU002    Manual   Jan 14     [View]  ││
│ │ ☐ Rejected││              Supplies      Capsule   review                [Verify]││
│ │          │ │                            250mg                            (T2) ││
│ │ Company  │ │                                             ││
│ │ ☐ All    │ │ REQ-2025-005 DEF Corp      SKU003    Tier2    Jan 13     [View]  ││
│ │ ☐ ABC    │ │                            Tablet    verify                [Verify]││
│ │ ☐ XYZ    │ │                            100mg     (2d)                  (T2) ││
│ │          │ │                                             ││
│ │ Date     │ │ REQ-2025-018 GHI Pharma    SKU004    Approved Jan 10     [View]  ││
│ │ Last 7d  │ │                            Tablet                         ││
│ │ Last 30d │ │                            250mg                           ││
│ │ Custom   │ │                                             ││
│ │          │ │ [Load More]                                 ││
│ │ [Clear]  │ │                                             ││
│ └──────────┘ └───────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

---

## Component Specifications

### Page Header
- **Breadcrumbs:** "Home > ECS > Export Requests"
- **Title:** "Export Requests"
  - **Typography:** 24px, font-weight: 600, color: #111827
- **Actions (Right-aligned):**
  - **New Request Button:** Primary button (Company users only, IPC role)
  - **Click Action:** Navigate to `/ecs/export-requests/new`
  - **Visibility:** Only visible for Company users with IPC role

### Search Bar
- **Input:** Full-width search input with placeholder "Search export requests..."
- **Icon:** Search icon on right side
- **Functionality:** Real-time search as user types (searches request ID, company name, SKU ID)
- **Clear Button:** X button appears when text entered

### Filters Sidebar (Left)
- **Width:** 240px (desktop), hidden on mobile (drawer)
- **Background:** White (#ffffff)
- **Border Right:** 1px solid #e5e7eb
- **Padding:** 16px

**Filter Sections:**
- **Status Filter:**
  - Checkboxes: All, Pending (includes auto-approval_queue, manual_review, tier2_verification_required), Auto-approval Queue, Manual Review, Tier 2 Verification, Approved, Rejected
  - Default: All selected
  - **Status Badges:** Color-coded status indicators
- **Company Filter:**
  - Multi-select dropdown or checkboxes
  - Shows list of companies (IPC only)
  - Default: All selected
- **Date Range Filter:**
  - Quick filters: Last 7 days, Last 30 days, Custom
  - Custom: Date range picker

**Clear Filters Button:**
- **Position:** Bottom of filters sidebar
- **Style:** Secondary button
- **Action:** Resets all filters to default

### Export Requests Table
- **Layout:** Full-width table with horizontal scroll on mobile
- **Columns:**
  1. **ID:** Export request ID (e.g., REQ-2025-001)
     - **Format:** REQ-YYYY-NNNNN
     - **Display:** Monospace font for better readability
     - **Click Action:** Navigate to export request detail
  2. **Company:** Company name (link to company detail)
     - **Display:** Company name
     - **Click Action:** Filter by company (optional)
  3. **SKU:** SKU information
     - **Display:** SKU ID, product description, dosage form, strength
     - **Format:** "SKU001\nTablet 500mg" (two-line format)
  4. **Status:** Request status with workflow indicator
     - **Badges:** Color-coded status badges
     - **Workflow Indicators:**
       - Auto-approval queue: Blue badge + countdown timer (days remaining)
       - Manual review: Orange badge
       - Tier2 verification: Yellow badge + countdown timer
       - Approved: Green badge
       - Rejected: Red badge
     - **Display:** Status name + additional info (e.g., "(1d)" for days in queue)
  5. **Created:** Creation date
     - **Format:** "Jan 15" or "January 15, 2025"
     - **Sortable:** Yes
  6. **Actions:** Action buttons (role-based)
     - **View:** Navigate to detail page (all roles)
     - **Intervene:** MOH Tier 1 only (for auto-approval queue)
     - **Verify:** MOH Tier 2 only (for tier2_verification_required)
     - **Approve/Reject:** MOH Tier 1/Tier 2 (for manual_review)

**Table Features:**
- **Sortable Columns:** ID, Company, SKU, Status, Created (click header to sort)
- **Row Hover:** Background color change (#f9fafb)
- **Row Click:** Navigate to export request detail page
- **Status Badges:**
  - Auto-approval queue: Blue (#3b82f6) + countdown timer
  - Manual review: Orange (#f97316)
  - Tier2 verification: Yellow (#eab308) + countdown timer
  - Approved: Green (#10b981)
  - Rejected: Red (#ef4444)
- **Intervention Window Indicator:** Shows countdown timer for auto-approval queue requests (e.g., "1d" = 1 day remaining)

**Pagination:**
- **Load More Button:** At bottom of table
- **Pagination Info:** "Showing 1-20 of 25 export requests"
- **Page Size:** 20 items per page (default)

---

## Role-Based Access

### Company Users (IPC only)
- **View:** Can only see their own export requests
- **Actions:** 
  - View (own requests)
  - Create new request
  - Cancel own draft/submitted requests (before authorization)
- **Filters:** Limited to own company (automatically filtered)

### MOH Tier 1
- **Full Access:** Can view all export requests, approve, reject, intervene
- **Actions:** 
  - View all requests
  - Intervene in auto-approval queue (within intervention window)
  - Approve/Reject manual review requests
  - Post-approval intervention (within 24 hours after auto-approval)
  - Revoke authorizations
- **Filters:** All companies, all statuses

### MOH Tier 2
- **View Access:** Can view all export requests
- **Actions:** 
  - View all requests
  - Verify tier2_verification_required requests
  - Approve/Reject manual review requests (when authorized)
- **Filters:** All companies, all statuses
- **No Intervene Access:** Cannot intervene in auto-approval queue

---

## State Variations

### Empty State (No Requests)
- **Message:** "No export requests found"
- **Subtext:** "Create your first export request to get started"
- **Action Button:** "New Export Request" (Company users only)
- **Visual:** Empty state illustration

### Loading State
- **Skeleton:** Table rows with shimmer effect
- **Count:** 5-10 skeleton rows

### Error State
- **Message:** "Unable to load export requests"
- **Action:** "Retry" button

### Filtered Empty State
- **Message:** "No export requests match your filters"
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
- **Cards:** Show key information (ID, Company, SKU, Status, Created), tap to expand for full details

---

## Interactions

### Click Actions
- **Request Row/ID:** Navigate to `/ecs/export-requests/[id]`
- **View Button:** Navigate to export request detail
- **Intervene Button:** Open intervention modal (MOH Tier 1, auto-approval queue only)
- **Verify Button:** Navigate to verify interface (MOH Tier 2, tier2_verification_required only)
- **Approve/Reject Buttons:** Open approval/rejection modal (MOH Tier 1/Tier 2, manual_review only)
- **"New Request" Button:** Navigate to `/ecs/export-requests/new`
- **Status Badge:** Filter by status (optional)

### Hover States
- **Table Rows:** Background color change (#f9fafb)
- **Links:** Underline on hover
- **Buttons:** Slight elevation/shadow

### Sort Actions
- **Column Headers:** Click to sort (ascending/descending)
- **Sort Indicator:** Arrow icon showing sort direction

---

## Workflow Status Indicators

### Auto-Approval Queue
- **Badge Color:** Blue (#3b82f6)
- **Display:** "Auto-approval queue (1d)" - shows days remaining in intervention window
- **Timer:** Countdown timer showing days remaining (2 working days default, configurable 1-5 days)
- **Action:** "Intervene" button (MOH Tier 1 only)

### Manual Review
- **Badge Color:** Orange (#f97316)
- **Display:** "Manual review"
- **Action:** "Approve" or "Reject" buttons (MOH Tier 1/Tier 2)

### Tier 2 Verification Required
- **Badge Color:** Yellow (#eab308)
- **Display:** "Tier 2 verification (2d)" - shows days since submission
- **Action:** "Verify" button (MOH Tier 2 only)

### Approved
- **Badge Color:** Green (#10b981)
- **Display:** "Approved"

### Rejected
- **Badge Color:** Red (#ef4444)
- **Display:** "Rejected"

---

## Design System References

- [UI Component Specifications](../../../../02-architecture/frontend/ui-component-specifications.md) - Tables, filters, badges, countdown timers
- [Role-Based UI Patterns](../../../../02-architecture/frontend/role-based-ui-patterns.md) - Role-based access
- [Form Design Patterns](../../../../02-architecture/frontend/form-design-patterns.md) - Filters
- [Workflow Architecture](../../../../02-architecture/workflow-architecture.md) - Export Request Workflow

---

## Related Wireframes

- [ECS Overview](task-0.5.4.0-ecs-overview.md)
- [Export Request Form](../export-requests/task-0.5.4.2-export-request-form.md)
- [Export Request Detail](../export-requests/task-0.5.4.3-export-request-detail.md)
- [Export Workflow Actions](../export-requests/task-0.5.4.4-export-workflow-actions.md)

---

**Next:** [Export Request Form](task-0.5.4.2-export-request-form.md)

**Last Updated:** 2025-01-15  
**Owner:** Emma (UI/UX + Next.js Frontend Specialist)  
**Guided by:** Fatima (MOH Regulatory Requirements) & Dr. Samir (Business Process Validation)

