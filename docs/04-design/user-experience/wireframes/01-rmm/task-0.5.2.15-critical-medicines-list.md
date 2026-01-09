# Task 0.5.2.15: Critical Medicines List Page Wireframe

**Status:** ✅ Complete  
**Route:** `/rmm/critical-medicines`  
**File:** `task-0.5.2.15-critical-medicines-list.png`  
**Priority:** 🟡 Supporting VCI & RMM

**Design Approach:** MOH Tier 1-only interface for managing critical medicine designations. Professional, accessible, and optimized for regulatory designation workflows with search, filtering, and bulk actions.

---

## Wireframe Layout

```
┌─────────────────────────────────────────────────────────────┐
│ Home > RMM > Critical Medicines                             │
│                                                             │
│ Critical Medicines (MOH Tier 1 Only)                       │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Search critical medicines...     [🔍] [Filters ▼] [Designate]│
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌──────────┐ ┌───────────────────────────────────────────┐│
│ │ Filters  │ │ Critical Medicines Table                   ││
│ │          │ │                                             ││
│ │ Status   │ │ SKU        Product          Company   Actions││
│ │ ☐ All    │ │ ──────     ──────────      ──────    ──────││
│ │ ☑ Active │ │ SKU001     Product A /     ABC       [View]││
│ │ ☐ Inact. │ │            500mg Tablet     Pharma    [Edit]││
│ │          │ │                            Inc.      [Remove]││
│ │ Company  │ │                                             ││
│ │ ☐ All    │ │ SKU002     Product B /     XYZ       [View]││
│ │ ☐ ABC    │ │            250mg Capsule    Medical   [Edit]││
│ │ ☐ XYZ    │ │                            Supplies  [Remove]││
│ │          │ │                                             ││
│ │ ATC      │ │ SKU003     Product C /     DEF       [View]││
│ │ ☐ All    │ │            100mg Syrup      Pharma    [Edit]││
│ │ ☐ A      │ │                            Ltd.      [Remove]││
│ │ ☐ B      │ │                                             ││
│ │ ☐ C      │ │ [Load More]                                ││
│ │          │ │                                             ││
│ │ Date     │ │                                             ││
│ │ Last 7d  │ │                                             ││
│ │ Last 30d │ │                                             ││
│ │ Custom   │ │                                             ││
│ │          │ │                                             ││
│ │ [Clear]  │ │                                             ││
│ └──────────┘ └───────────────────────────────────────────┘│
│                                                             │
│ ℹ️ Critical medicines are designated by MOH Tier 1.      ││
│    These medicines receive higher threshold multipliers.  ││
└─────────────────────────────────────────────────────────────┘
```

---

## Component Specifications

### Page Header
- **Breadcrumbs:** "Home > RMM > Critical Medicines"
- **Title:** "Critical Medicines (MOH Tier 1 Only)"
  - **Typography:** 24px, font-weight: 600, color: #111827
- **Role Badge:** "MOH Tier 1 Only" badge (red/orange)
- **Actions (Right-aligned):**
  - **Designate Button:** Primary button (MOH Tier 1 only)
  - **Click Action:** Opens designation modal/wizard

### Search Bar
- **Input:** Full-width search input with placeholder "Search critical medicines..."
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
  - Checkboxes: All, Active, Inactive
  - Default: Active selected
- **Company Filter:**
  - Multi-select dropdown or checkboxes
  - Shows list of companies
- **ATC Filter:**
  - Checkboxes: All, A, B, C, D, etc.
  - Organized by ATC first letter
- **Date Range Filter:**
  - Quick filters: Last 7 days, Last 30 days, Custom
  - Custom: Date range picker

**Clear Filters Button:**
- **Position:** Bottom of filters sidebar
- **Style:** Secondary button
- **Action:** Resets all filters to default

### Critical Medicines Table
- **Layout:** Full-width table with horizontal scroll on mobile
- **Columns:**
  1. **SKU:** SKU code (link to SKU detail)
  2. **Product:** Product name, dosage, form
  3. **Company:** Company name
  4. **Actions:** View, Edit, Remove buttons
- **Row Features:**
  - **Hover:** Background color change (#f9fafb)
  - **Click:** Navigate to SKU detail page
  - **Status Indicator:** Visual indicator for active/inactive
- **Bulk Actions:**
  - Checkbox column for bulk selection
  - Bulk remove option (if multiple selected)

### Status Indicators
- **Active:** Green badge (#10b981) - "Active"
- **Inactive:** Gray badge (#6b7280) - "Inactive"

### Action Buttons
- **View:** Navigate to SKU detail page
- **Edit:** Open edit modal (update designation details)
- **Remove:** Remove critical medicine designation (with confirmation)

---

## Role-Based Access

### MOH Tier 1
- **View:** All critical medicine designations
- **Actions:**
  - Designate new critical medicines
  - Edit existing designations
  - Remove designations
  - Bulk actions
- **Full Access:** Complete management capabilities

### MOH Tier 2
- **View:** Can view critical medicines (read-only)
- **Actions:** None (read-only access)
- **Note:** Cannot designate or modify

### Company Users
- **View:** Cannot access this page
- **Note:** Companies can see if their products are designated as critical (via product/SKU detail pages) but cannot manage designations

---

## Designation Workflow

### Designate New Critical Medicine
1. **Click "Designate" Button:** Opens designation modal/wizard
2. **Select SKU:** Choose SKU from company product catalog
3. **Provide Justification:** Enter reason for designation (required)
4. **Review:** Review designation details
5. **Submit:** Submit designation
6. **Confirmation:** Designation created, threshold multiplier updated

### Edit Designation
1. **Click "Edit" Button:** Opens edit modal
2. **Update Details:** Modify justification or status
3. **Save:** Save changes
4. **Audit:** Changes logged in audit trail

### Remove Designation
1. **Click "Remove" Button:** Opens confirmation modal
2. **Confirm:** Confirm removal
3. **Justification:** Provide reason for removal (required)
4. **Remove:** Designation removed, threshold multiplier reverted
5. **Audit:** Removal logged in audit trail

---

## State Variations

### Empty State (No Designations)
- **Message:** "No critical medicines designated"
- **Subtext:** "Designate medicines as critical to apply higher threshold multipliers"
- **Action Button:** "Designate Critical Medicine" (MOH Tier 1 only)

### Loading State
- **Skeleton Loaders:** Table rows with skeleton placeholders
- **Filter Loading:** Skeleton for filter dropdowns

### Search Results State
- **Result Count:** "X critical medicines found" above table
- **Highlight:** Search terms highlighted in results

---

## Business Rules

1. **MOH Tier 1 Only:** Only MOH Tier 1 can designate and manage critical medicines
2. **Threshold Impact:** Critical medicines receive higher threshold multiplier (3.5 vs 3.0)
3. **Justification Required:** All designations and removals require justification
4. **Audit Trail:** All changes logged in audit trail
5. **Status Management:** Designations can be active or inactive
6. **Bulk Actions:** Support for bulk designation/removal (if applicable)

---

## Related Documents

- [RMM Overview Wireframe](../overview/task-0.5.2.1-rmm-overview.md)
- [Companies List Wireframe](../companies/task-0.5.2.2-companies-list.md) - Reference for list patterns
- [Threshold Management Wireframe](../../02-vci/aams/task-0.5.3.4-threshold-management.md) - Related threshold management
- [Data Dictionary](../../../02-architecture/database/data-dictionary.md) - Critical medicines table structure
- [System Architecture](../../../02-architecture/system-architecture.md) - Critical medicines ownership

---

**Last Updated:** 2025-01-15  
**Owner:** Emma (UI/UX + Next.js Frontend Specialist)

