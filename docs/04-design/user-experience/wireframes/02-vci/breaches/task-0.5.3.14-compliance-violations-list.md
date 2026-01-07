# Task 0.5.3.14: Compliance Violations List Page Wireframe

**Status:** 🟡 In Progress  
**Route:** `/vci/breaches` or `/vci/compliance-violations`  
**File:** `task-0.5.3.14-compliance-violations-list.png`  
**Priority:** 🔴 Critical VCI Workflows

**Design Approach:** Modern enterprise list pattern with advanced filtering, priority indicators, and status tracking. Professional, accessible, and optimized for compliance violation monitoring and governance response workflows.

---

## Wireframe Layout

```
┌─────────────────────────────────────────────────────────────┐
│ Home > VCI > Compliance Violations                          │
│                                                             │
│ Compliance Violations                    [Filters ▼]       │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Search violations...                    [🔍] [Filters ▼]││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌──────────┐ ┌───────────────────────────────────────────┐│
│ │ Filters  │ │ Violations Table                         ││
│ │          │ │                                             ││
│ │ Status   │ │ Priority SKU      Product      Status    ││
│ │ ☐ All    │ │          Code     Description             ││
│ │ ☑ Active │ │ ──────── ──────   ──────────── ──────── ││
│ │ ☐ Resolv.│ │ 🔴 High  SKU002   Product B /  Active    ││
│ │          │ │          (Critical 250mg /      [Analyze] ││
│ │ Priority │ │          Medicine) Capsule                ││
│ │ ☐ All    │ │                                             ││
│ │ ☑ High   │ │ 🟡 Med   SKU003   Product C /  Active    ││
│ │ ☐ Medium │ │          100mg /   [Analyze]              ││
│ │ ☐ Low    │ │          Syrup                            ││
│ │          │ │                                             ││
│ │ Company  │ │ 🟢 Low   SKU005   Product E /  Resolved  ││
│ │ ☐ All    │ │          200mg /   [View]                 ││
│ │ ☐ ABC    │ │          Tablet                          ││
│ │ ☐ XYZ    │ │                                             ││
│ │          │ │ 🔴 High  SKU001   Product A /  Active    ││
│ │ Date     │ │          (Multiple 500mg /      [Analyze] ││
│ │ Last 7d  │ │          SKUs)    Tablet                 ││
│ │ Last 30d │ │                                             ││
│ │ Custom   │ │ [Load More]                               ││
│ │          │ │                                             ││
│ │ [Clear]  │ │ ☑ Select All  [Bulk Analyze]             ││
│ └──────────┘ └───────────────────────────────────────────┘│
│                                                             │
│ ℹ️ Compliance violations are automatically detected from ││
│    WSL submissions when stock levels fall below threshold. ││
│    [View Regulatory Framework]                            ││
└─────────────────────────────────────────────────────────────┘
```

---

## Component Specifications

### Page Header
- **Breadcrumbs:** "Home > VCI > Compliance Violations"
- **Title:** "Compliance Violations"
  - **Typography:** 24px, font-weight: 600, color: #111827
- **Actions (Right-aligned):**
  - **Filters Button:** Secondary button (toggle filters sidebar)
  - **Spacing:** 16px between actions

### Search Bar
- **Input:** Full-width search input with placeholder "Search violations..."
- **Icon:** Search icon on right side
- **Functionality:** Real-time search as user types (searches SKU, product name, company)
- **Clear Button:** X button appears when text entered

### Filters Sidebar (Left)
- **Width:** 240px (desktop), hidden on mobile (drawer)
- **Background:** White (#ffffff)
- **Border Right:** 1px solid #e5e7eb
- **Padding:** 16px

**Filter Sections:**
- **Status Filter:**
  - Checkboxes: All, Active, Resolved, Under Review
  - Default: Active selected
- **Priority Filter:**
  - Checkboxes: All, High, Medium, Low
  - Default: All selected
- **Company Filter:**
  - Multi-select dropdown or checkboxes
  - Shows list of companies with violations
- **SKU Filter:**
  - Multi-select dropdown or checkboxes
  - Shows list of SKUs with violations
- **Date Range Filter:**
  - Quick filters: Last 7 days, Last 30 days, Custom
  - Custom: Date range picker

**Clear Filters Button:**
- **Position:** Bottom of filters sidebar
- **Style:** Secondary button
- **Action:** Resets all filters to default

### Violations Table
- **Layout:** Full-width table with horizontal scroll on mobile
- **Columns:**
  1. **Priority:** Priority indicator with badge (🔴 High, 🟡 Medium, 🟢 Low)
  2. **SKU Code:** SKU identifier (link to SKU detail)
  3. **Product Description:** Product Name / Dosage / Form (truncated if long)
  4. **Replenishment Date:** Replenishment date from WSL submission:
     - Format: DD/MM/YY (e.g., "25/01/25")
     - Shows "-" or "(N/A)" if no replenishment date provided
     - Sortable: Sort by date to prioritize by expected resolution
     - Tooltip: Shows full date on hover (e.g., "25/01/2025")
  5. **Status:** Status badge with color coding
  6. **Actions:** Analyze (Tier 2), View (all), View Reason (tooltip/modal), Resolve (if applicable)
- **Compliance Violation Reason Display:**
  - **View Reason Button:** Opens tooltip or modal showing full Compliance Violation Reason text (up to 300 characters)
  - **Hover Indicator:** "[Hover]" text indicates hover for quick preview
  - **Full Text:** Displayed in tooltip or modal when "View Reason" clicked
- **Priority Indicators:**
  - **High (🔴):** Red badge - Critical medicines, multiple SKUs, extended breaches
  - **Medium (🟡):** Yellow badge - Standard breaches
  - **Low (🟢):** Green badge - Minor breaches, resolved
- **Priority Factors:**
  - Critical medicine status
  - Number of SKUs affected
  - Duration of compliance violation
  - Company compliance history
- **Status Badges:**
  - Active: Orange (#f97316) - "Active"
  - Under Review: Yellow (#fbbf24) - "Under Review"
  - Resolved: Green (#10b981) - "Resolved"
  - Pending Action: Blue (#3b82f6) - "Pending Action"

**Table Features:**
- **Sortable Columns:** Priority, SKU, Status, Date (click header to sort)
- **Row Hover:** Background color change (#f9fafb)
- **Row Click:** Navigate to violation detail page
- **Bulk Selection:**
  - Checkbox per row
  - Select All checkbox in header
  - Bulk Analyze button (Tier 2 only)

**Pagination:**
- **Load More Button:** At bottom of table
- **Pagination Info:** "Showing 1-20 of 45 violations"
- **Page Size:** 20 items per page (default)

### Compliance Information Banner
- **Display:** Info banner below filters (collapsible)
- **Content:**
  - Explanation of automatic compliance violation detection
  - Link to regulatory framework
- **Styling:** Light blue background (#eff6ff), info icon, dismissible

---

## Role-Based Access

### Company Users
- **View:** Only own company violations
- **Title:** "My Compliance Violations"
- **Actions:** View only (cannot analyze or resolve)
- **Bulk Actions:** Not available

### MOH Tier 1
- **Full Access:** Can view all violations
- **Title:** "All Compliance Violations"
- **Actions:** View, Approve Actions (from Tier 2 analysis)
- **Bulk Actions:** Not available (approval happens on individual basis)

### MOH Tier 2
- **View Access:** Can view all violations
- **Title:** "All Compliance Violations"
- **Actions:** Analyze (individual and bulk), View
- **Bulk Actions:** Bulk Analyze button available

---

## State Variations

### Empty State (No Violations)
- **Message:** "No compliance violations found"
- **Subtext:** "All stock levels are above thresholds"
- **Visual:** Empty state illustration

### Loading State
- **Skeleton Loaders:** Table rows with skeleton placeholders
- **Filter Loading:** Skeleton for filter dropdowns

### Active Violations
- **Visual Indicator:** Priority badges, status badges
- **Count Display:** "X active violations" in header or summary
- **Urgency Indicators:** High priority violations highlighted

### Resolved Violations
- **Visual Indicator:** Green "Resolved" badge
- **Filter Option:** Can filter to show only resolved
- **Historical View:** Resolved violations remain visible for audit

---

## Responsive Design

### Desktop (≥1024px)
- **Layout:** Full-width table with filters sidebar
- **Table:** All columns visible
- **Filters:** Sidebar visible

### Tablet (768px - 1023px)
- **Layout:** Filters in collapsible drawer
- **Table:** Horizontal scroll for table
- **Columns:** Priority columns visible

### Mobile (<768px)
- **Layout:** Single column
- **Table:** Card-based layout instead of table
- **Filters:** Collapsible filter drawer
- **Actions:** Full-width buttons

---

## Interactions

### Click Actions
- **Violation Row:** Navigate to violation detail page
- **SKU Code:** Navigate to SKU detail
- **Analyze Button:** Navigate to compliance violation analysis interface (Tier 2)
- **View Button:** Navigate to violation detail
- **Bulk Analyze:** Open bulk analysis interface (Tier 2)
- **Select All:** Toggle all row checkboxes

### Hover States
- **Table Row:** Background color change (#f9fafb)
- **Buttons:** Slight elevation/shadow
- **Links:** Underline on hover

### Keyboard Navigation
- **Tab:** Navigate through filters and table rows
- **Enter:** Activate selected row or button
- **Space:** Toggle checkbox
- **Arrow Keys:** Navigate table rows (if implemented)

---

## Design System References

### Components Used
- **Table Component:** Violations table (shadcn/ui table)
- **Filter Component:** Status, priority, company, SKU filters (shadcn/ui select/checkbox)
- **Search Component:** Search input (shadcn/ui input)
- **Badge Component:** Priority badges, status badges (shadcn/ui badge)
- **Button Component:** Analyze, view, bulk action buttons (shadcn/ui button)
- **Checkbox Component:** Row selection (shadcn/ui checkbox)
- **Icon Component:** Priority icons, action icons (Lucide React via shadcn/ui)
- **Skeleton Component:** Loading states (shadcn/ui skeleton)
- **Empty State Component:** No violations message (shadcn/ui empty state pattern)
- **Alert Component:** Compliance information banner (shadcn/ui alert)

### Design Inspiration References
- **Stripe Dashboard:** https://dashboard.stripe.com - Professional list patterns
- **GitHub:** https://github.com - Clean lists, priority indicators
- **Linear App:** https://linear.app - Modern lists, smooth interactions
- **shadcn/ui Components:** https://ui.shadcn.com - Component patterns

### Colors (From Design System)
- **Background:** #ffffff (white) - Clean, professional
- **Table Border:** #e5e7eb (border-default) - Subtle separation
- **Table Row Hover:** #f9fafb (bg-secondary) - Light gray on hover
- **Text Primary:** #111827 (text-primary) - High contrast
- **Text Secondary:** #6b7280 (text-secondary)
- **Priority Badge Colors:**
  - High: #ef4444 (error-500) - Red
  - Medium: #fbbf24 (warning-500) - Yellow
  - Low: #10b981 (success-500) - Green
- **Status Badge Colors:**
  - Active: #f97316 (orange-500)
  - Under Review: #fbbf24 (warning-500)
  - Resolved: #10b981 (success-500)
  - Pending Action: #3b82f6 (primary-500)

### Typography (From Design System)
- **Page Title:** 24px, font-weight: 600, color: #111827
- **Table Header:** 12px, font-weight: 600, uppercase
- **Table Cell Text:** 14px, font-weight: 400
- **Priority Badge:** 11px, font-weight: 600
- **Status Badge:** 11px, font-weight: 600
- **Filter Label:** 12px, font-weight: 500

### Spacing (8px Grid System)
- **Page Padding:** 24px (3 × 8px)
- **Table Cell Padding:** 12px horizontal (1.5 × 8px), 8px vertical (1 × 8px)
- **Table Row Height:** 48px (6 × 8px) minimum
- **Filter Section Padding:** 16px (2 × 8px)
- **Button Padding:** 12px horizontal (1.5 × 8px), 8px vertical (1 × 8px)
- **Section Spacing:** 16px (2 × 8px) between sections

### Transitions & Animations
- **Table Row Hover:** 150ms ease-in-out
- **Table Row Click:** 150ms ease-in-out
- **Filter Toggle:** 200ms ease-in-out
- **Button Hover:** 150ms ease-in-out

### Accessibility (WCAG 2.1 AA Compliance)
- **Color Contrast:** Minimum 4.5:1 for text, 3:1 for UI components
- **Focus Indicators:** 2px solid outline, #3b82f6 (primary-500), 2px offset
- **Keyboard Navigation:** Full keyboard support (Tab, Enter, Space, Arrow keys, Escape)
- **Screen Reader Support:** ARIA labels, roles, and descriptions
- **Touch Targets:** Minimum 40px × 40px for all interactive elements
- **ARIA Labels:** Descriptive labels for all table cells and actions
- **Table Headers:** Proper table header associations
- **Skip Links:** "Skip to main content" link for keyboard users

---

## Industry Best Practices Implementation

### Performance Optimizations
- **Lazy Loading:** Violation rows load on demand (pagination or infinite scroll)
- **Debounced Search:** Debounce search input (300ms)
- **CSS Containment:** Use `contain: layout style paint` for table rows
- **Data Fetching:** Parallel API calls for filters and violations
- **Caching:** Cache violations with appropriate TTL (5-10 minutes)

### State Management
- **Violations State:** Track selected violations, filters, sort order, pagination
- **Bulk Selection:** Track selected rows for bulk actions
- **Real-time Updates:** WebSocket or polling for new violations (30s interval, optional)
- **Local Storage:** Cache filter preferences, sort order, pagination state

### Error Handling
- **Loading States:** Skeleton loaders for table rows while loading
- **Error Boundaries:** Graceful degradation if violations fail to load
- **Retry Logic:** Automatic retry with exponential backoff
- **Fallback:** Default empty state if all else fails

---

## Related Documents

- [Routing Structure](../../../../02-architecture/frontend/routing-structure.md) - Route: `/vci/breaches` or `/vci/compliance-violations`
- [Regulatory Framework](../../../../03-governance/regulatory-framework.md) - Comprehensive regulatory reference including DMP regulations
- [Compliance Requirements](../../../../03-governance/compliance-requirements.md) - Detailed compliance requirements including compliance violation detection requirements
- [Regulatory Policies](../../../../03-governance/regulatory-policies.md) - Regulatory policies including compliance violation policies
- [UI Component Specifications](../../../../02-architecture/frontend/ui-component-specifications.md) - Table, Filter, Button components
- [Role-Based UI Patterns](../../../../02-architecture/frontend/role-based-ui-patterns.md) - Role-based access

---

## Related Wireframes

- [Compliance Violation Detail](task-0.5.3.15-compliance-violation-detail.md) - Individual violation detail page
- [Compliance Violation Analysis Interface](task-0.5.3.16-compliance-violation-analysis-interface.md) - Tier 2 analysis form
- [Compliance Violation Action Approval Interface](task-0.5.3.17-compliance-violation-action-approval-interface.md) - Tier 1 approval interface
- [WSL Submission Detail](../wsl/task-0.5.3.13-wsl-submission-detail.md) - WSL submission with compliance violations

---

**Next:** [Compliance Violation Detail](task-0.5.3.15-compliance-violation-detail.md)

