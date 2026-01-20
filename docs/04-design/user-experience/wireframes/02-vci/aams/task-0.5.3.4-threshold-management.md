# Task 0.5.3.4: Threshold Management Page Wireframe

**Status:** ✅ Complete  
**Route:** `/vci/thresholds` (MOH Tier 1 only)  
**File:** `task-0.5.3.4-threshold-management.png`  
**Priority:** 🔴 Critical VCI Workflows

**Design Approach:** Modern management interface with threshold list, filters, bulk actions, and modification interface. Professional, accessible, and optimized for MOH Tier 1 threshold management workflows.

---

## Wireframe Layout

```
┌─────────────────────────────────────────────────────────────┐
│ Home > VCI > Thresholds                                      │
│                                                             │
│ Threshold Management                    [New Threshold]     │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Search thresholds...                    [🔍] [Filters ▼]││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌──────────┐ ┌───────────────────────────────────────────┐│
│ │ Filters  │ │ Thresholds Table                          ││
│ │          │ │                                             ││
│ │ Type     │ │ SKU      Product        Threshold  Multiplier Duration Revert Date Status Actions││
│ │ ☐ All    │ │          Description    Value     (B)      Type    (if temp)        ││
│ │ ☑ AAMS   │ │ ──────   ────────────   ────────  ──────── ──────── ──────────── ──────── ──────││
│ │ ☐ MSQ    │ │ SKU001   Product A /    1,234     1.0x     Permanent -          Active [Modify]││
│ │ ☐ WSL    │ │          500mg / Tablet (default)         ││
│ │          │ │                                             ││
│ │ Status   │ │ SKU002   Product B /    600       1.5x     Temp    25/06/25     Active [Modify]││
│ │ ☐ All    │ │          250mg /        (modified)         Auto    (7 days)     ⚠️ Pending││
│ │ ☑ Active │ │          Capsule                            Revert              Reversion││
│ │ ☐ Modif. │ │                                             ││
│ │          │ │ SKU003   Product C /    800       2.0x     Temp    30/06/25     Active [Modify]││
│ │ Company  │ │          100mg /        (modified)         Manual  (12 days)   ⚠️ Review││
│ │ ☐ All    │ │          Syrup                              Review              Required││
│ │ ☐ ABC    │ │                                             ││
│ │ ☐ XYZ    │ │ [Load More]                                ││
│ │          │ │                                             ││
│ │ Duration │ │ ☑ Select All  [Bulk Modify] [Bulk Export] [View Pending Reversions]││
│ │ ☐ All    │ │                                             ││
│ │ ☑ Permanent││                                             ││
│ │ ☐ Temp   │ │                                             ││
│ │          │ │                                             ││
│ │ [Clear]  │ │                                             ││
│ └──────────┘ └───────────────────────────────────────────┘│
│                                                             │
│ ℹ️ Threshold Management                                   ││
│    Thresholds are calculated from AAMS submissions.       ││
│    Multipliers can be modified per regulatory requirements.││
│                                                             │
│    Regulatory Authorization Required (Fatima's Requirement):││
│    • DMP Regulation Article [X] - Threshold Modification    ││
│    • Legal Authority: Tier 1 Approval Required             ││
│    • Approval Workflow Compliance: Required                 ││
│    • Stakeholder Notification: Required                     ││
│                                                             │
│    [View Regulatory Framework]                             ││
└─────────────────────────────────────────────────────────────┘
```

---

## Component Specifications

### Page Header
- **Breadcrumbs:** "Home > VCI > Thresholds"
- **Title:** "Threshold Management"
  - **Typography:** 24px, font-weight: 600, color: #111827
- **Actions (Right-aligned):**
  - **New Threshold Button:** Primary button (if manual threshold creation allowed)
  - **Spacing:** 16px between actions

### Search Bar
- **Input:** Full-width search input with placeholder "Search thresholds..."
- **Icon:** Search icon on right side
- **Functionality:** Real-time search as user types (searches SKU, product name)
- **Clear Button:** X button appears when text entered

### Filters Sidebar (Left)
- **Width:** 240px (desktop), hidden on mobile (drawer)
- **Background:** White (#ffffff)
- **Border Right:** 1px solid #e5e7eb
- **Padding:** 16px

**Filter Sections:**
- **Type Filter:**
  - Checkboxes: All, AAMS, MSQ, WSL
  - Default: All selected
- **Status Filter:**
  - Checkboxes: All, Active, Modified (has custom multiplier)
  - Default: All selected
- **Duration Type Filter:**
  - Checkboxes: All, Permanent, Temporary
  - Default: All selected
  - Purpose: Filter by threshold duration type
- **Company Filter:**
  - Multi-select dropdown or checkboxes
  - Shows list of companies with thresholds
- **Multiplier Filter:**
  - Checkboxes: Default (1.0x), Modified (custom multiplier)
  - Default: All selected

**Clear Filters Button:**
- **Position:** Bottom of filters sidebar
- **Style:** Secondary button
- **Action:** Resets all filters to default

### Thresholds Table (Enhanced per Fatima's Requirement)
- **Layout:** Full-width table with horizontal scroll on mobile
- **Columns:**
  1. **SKU:** SKU code/identifier (link to SKU detail)
  2. **Product Description:** Product Name / Dosage / Form (read-only)
  3. **Threshold Value:** Calculated threshold value (read-only, from AAMS)
  4. **Multiplier (B):** Current multiplier value (1.0x default, editable)
  5. **Duration Type:** Badge showing duration type:
    - **Permanent:** Gray badge - "Permanent"
    - **Temporary Auto-Revert:** Orange badge - "Temp Auto Revert"
    - **Temporary Manual Review:** Yellow badge - "Temp Manual Review"
  6. **Revert Date:** Date when temporary threshold reverts:
    - Format: DD/MM/YY (e.g., "25/06/25")
    - Shows "-" for permanent thresholds
    - Shows days until reversion in parentheses (e.g., "(7 days)")
    - Color-coded: Green (>30 days), Yellow (7-30 days), Red (<7 days)
    - **Regulatory Deadline Tracking (Fatima's Requirement):** Days until reversion with urgency indicator
  7. **Status:** Badge showing status:
    - **Active:** Green badge - "Active"
    - **Pending Reversion:** Orange badge with warning icon - "⚠️ Pending Reversion"
    - **Review Required:** Yellow badge with warning icon - "⚠️ Review Required"
  8. **Regulatory Authorization (Fatima's Requirement):** Shows if threshold modification is authorized per regulation
  9. **Actions:** Modify button, View Details link
- **Row Features:**
  - **Checkbox:** Select row for bulk actions
  - **Row Hover:** Background color change (#f9fafb)
  - **Row Click:** Navigate to threshold detail page
  - **Pending Reversion Indicator:** Orange/yellow highlight for rows with pending reversions
- **Bulk Actions:**
  - **Select All:** Checkbox in table header
  - **Bulk Modify:** Apply multiplier to selected thresholds
  - **Bulk Export:** Export selected thresholds as CSV
  - **View Pending Reversions:** Button to view all thresholds with pending reversions (opens pending reversions list page)

### Compliance Information Banner
- **Display:** Info banner below filters (collapsible)
- **Content:**
  - Explanation of threshold calculation
  - Multiplier modification guidelines
  - Regulatory reference link
- **Styling:** Light blue background (#eff6ff), info icon, dismissible

---

## Role-Based Access

### MOH Tier 1
- **Full Access:** Can view all thresholds, modify multipliers, create manual thresholds
- **Actions:** Modify, Bulk Modify, Export, Create New

### MOH Tier 2
- **View Only:** Can view thresholds (read-only)
- **No Edit:** Cannot modify thresholds

### Company Users
- **No Access:** This page is not accessible to company users
- **Alternative:** Companies view thresholds on submission detail pages (after Tier 2 verification)

---

## State Variations

### Empty State (No Thresholds)
- **Message:** "No thresholds found"
- **Subtext:** "Thresholds are created from AAMS submissions"
- **Action Button:** "View AAMS Submissions" (if applicable)

### Loading State
- **Skeleton Loaders:** Table rows with skeleton placeholders
- **Filter Loading:** Skeleton for filter dropdowns

### Modified Thresholds
- **Visual Indicator:** Badge showing "Modified" status
- **Multiplier Display:** Highlighted if different from default (1.0x)
- **Modification History:** Link to view modification history

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
- **SKU/Product:** Navigate to SKU detail or threshold detail
- **Modify Button:** Open threshold modification modal
- **Bulk Modify:** Open bulk modification dialog
- **Export:** Trigger CSV download
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
- **Table Component:** Thresholds table (shadcn/ui table)
- **Filter Component:** Type, status, company filters (shadcn/ui select/checkbox)
- **Search Component:** Search input (shadcn/ui input)
- **Badge Component:** Status badges (shadcn/ui badge)
- **Button Component:** Modify, export, bulk action buttons (shadcn/ui button)
- **Checkbox Component:** Row selection (shadcn/ui checkbox)
- **Icon Component:** Action icons (Lucide React via shadcn/ui)
- **Skeleton Component:** Loading states (shadcn/ui skeleton)
- **Empty State Component:** No thresholds message (shadcn/ui empty state pattern)
- **Alert Component:** Compliance information banner (shadcn/ui alert)
- **Dialog/Modal Component:** Modification modal (shadcn/ui dialog)

### Design Inspiration References
- **Stripe Dashboard:** https://dashboard.stripe.com - Professional management interfaces
- **GitHub:** https://github.com - Clean list views, bulk actions
- **Linear App:** https://linear.app - Modern management, smooth interactions
- **shadcn/ui Components:** https://ui.shadcn.com - Component patterns

### Colors (From Design System)
- **Background:** #ffffff (white) - Clean, professional
- **Table Border:** #e5e7eb (border-default) - Subtle separation
- **Table Row Hover:** #f9fafb (bg-secondary) - Light gray on hover
- **Text Primary:** #111827 (text-primary) - High contrast
- **Text Secondary:** #6b7280 (text-secondary)
- **Status Badge Colors:**
  - Default: #6b7280 (gray-500)
  - Modified: #3b82f6 (primary-500)

### Typography (From Design System)
- **Page Title:** 24px, font-weight: 600, color: #111827
- **Table Header:** 12px, font-weight: 600, uppercase
- **Table Cell Text:** 14px, font-weight: 400
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
- **Lazy Loading:** Threshold rows load on demand (pagination or infinite scroll)
- **Debounced Search:** Debounce search input (300ms)
- **CSS Containment:** Use `contain: layout style paint` for table rows
- **Data Fetching:** Parallel API calls for filters and thresholds
- **Caching:** Cache thresholds with appropriate TTL (5-10 minutes)

### State Management
- **Thresholds State:** Track selected thresholds, filters, sort order, pagination
- **Bulk Selection:** Track selected rows for bulk actions
- **Local Storage:** Cache filter preferences, sort order, pagination state

### Error Handling
- **Loading States:** Skeleton loaders for table rows while loading
- **Error Boundaries:** Graceful degradation if thresholds fail to load
- **Retry Logic:** Automatic retry with exponential backoff
- **Fallback:** Default empty state if all else fails

---

## Related Documents

- [Routing Structure](../../../../02-architecture/frontend/routing-structure.md) - Route: `/vci/thresholds`
- [Regulatory Framework](../../../../03-governance/regulatory-framework.md) - Comprehensive regulatory reference including DMP regulations
- [Compliance Requirements](../../../../03-governance/compliance-requirements.md) - Detailed compliance requirements including threshold requirements
- [Regulatory Policies](../../../../03-governance/regulatory-policies.md) - Regulatory policies including threshold policies
- [UI Component Specifications](../../../../02-architecture/frontend/ui-component-specifications.md) - Table, Filter, Button components
- [Role-Based UI Patterns](../../../../02-architecture/frontend/role-based-ui-patterns.md) - Role-based access

---

## Related Wireframes

- [Threshold Modification Modal](task-0.5.3.6-threshold-modification-modal.md) - Modify threshold multiplier
- [Threshold Detail](../overview/task-0.5.3.5-threshold-detail.md) - Threshold detail page
- [AAMS Submission Detail](task-0.5.3.3-aams-submission-detail.md) - AAMS submission with threshold

---

**Next:** [Threshold Modification Modal](task-0.5.3.6-threshold-modification-modal.md)

