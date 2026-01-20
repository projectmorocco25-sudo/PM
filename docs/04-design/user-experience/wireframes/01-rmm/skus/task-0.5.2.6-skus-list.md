# Task 0.5.2.6: SKUs List Page Wireframe

**Status:** ✅ Complete  
**Route:** `/rmm/products/[id]/skus` (product-scoped) or `/rmm/skus` (all SKUs)  
**File:** `task-0.5.2.6-skus-list.png`  
**Priority:** 🔴 Core RMM Workflows (Supporting Pages)

**Design Approach:** Modern enterprise list pattern with table view, product-scoped filtering, pharmaceutical attributes display, and role-based actions. Professional, accessible, and optimized for registry management workflows. SKUs are scoped to products (which are scoped to companies).

---

## Wireframe Layout

```
┌─────────────────────────────────────────────────────────────┐
│ Home > RMM > Products > Paracetamol > SKUs                   │
│                                                             │
│ SKUs - Paracetamol                      [New SKU]          │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Search SKUs...                          [🔍] [Filters ▼]││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌──────────┐ ┌───────────────────────────────────────────┐│
│ │ Filters  │ │ SKUs Table                                 ││
│ │          │ │                                             ││
│ │ Product  │ │ SKU Code    SKU Name          Dosage    Form     Pack Size    Status    Actions ││
│ │ ☐ All    │ │ ─────────   ────────────────   ────────   ─────   ──────────   ──────    ────── ││
│ │ ☑ Parac. │ │ SKU001     Paracetamol 500mg  500mg      Tablet  30 tablets  Active    [View]  ││
│ │   etamol │ │            Tablets 30-pack                                     [Edit]  ││
│ │ ☐ Ibup.  │ │                                             ││
│ │   rofen  │ │ SKU002     Paracetamol 250mg  250mg      Tablet  30 tablets  Active    [View]  ││
│ │          │ │            Tablets 30-pack                                     [Edit]  ││
│ │ Status   │ │                                             ││
│ │ ☐ All    │ │ SKU003     Paracetamol 100mg/ 100mg/ml   Syrup   100ml       Active    [View]  ││
│ │ ☑ Active │ │            ml Syrup 100ml      bottle                        [Edit]  ││
│ │ ☐ Inact. │ │                                             ││
│ │          │ │ SKU004     Paracetamol 500mg  500mg      Tablet  60 tablets  Active    [View]  ││
│ │ Form     │ │            Tablets 60-pack                                     [Edit]  ││
│ │ ☐ All    │ │                                             ││
│ │ ☑ Tablet │ │ SKU005     Paracetamol 500mg  500mg      Capsule 30 capsules Active    [View]  ││
│ │ ☐ Capsule│ │            Capsules 30-pack                                     [Edit]  ││
│ │ ☐ Syrup  │ │                                             ││
│ │          │ │ [Load More]                                ││
│ │ ATC Code │ │                                             ││
│ │ ☐ All    │ │                                             ││
│ │ ☐ N02    │ │                                             ││
│ │          │ │                                             ││
│ │ [Clear]  │ │                                             ││
│ └──────────┘ └───────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

---

## Component Specifications

### Page Header
- **Breadcrumbs:** "Home > RMM > Products > [Product Name] > SKUs" or "Home > RMM > SKUs"
- **Title:** "SKUs - [Product Name]" (if product-scoped) or "SKUs" (if all SKUs)
  - **Typography:** 24px, font-weight: 600, color: #111827
- **Actions (Right-aligned):**
  - **New SKU Button:** Primary button (role-based visibility)
  - **Click Action:** Navigate to `/rmm/products/[id]/skus/new` or `/rmm/skus/new`

### Search Bar
- **Input:** Full-width search input with placeholder "Search SKUs..."
- **Icon:** Search icon on right side
- **Functionality:** Real-time search as user types (searches SKU code, SKU name, dosage strength)
- **Clear Button:** X button appears when text entered

### Filters Sidebar (Left)
- **Width:** 240px (desktop), hidden on mobile (drawer)
- **Background:** White (#ffffff)
- **Border Right:** 1px solid #e5e7eb
- **Padding:** 16px

**Filter Sections:**
- **Product Filter:**
  - Multi-select dropdown or checkboxes
  - Shows list of products (only for MOH users if all SKUs view)
  - Company users: Auto-filtered to their company's products
  - Product-scoped view: Filter hidden (automatically filtered)
  - Default: All selected (MOH) or product-scoped (if from product detail)
- **Status Filter:**
  - Checkboxes: All, Active, Inactive
  - Default: Active selected
- **Dosage Form Filter:**
  - Checkboxes: All, Tablet, Capsule, Syrup, Injection, Cream, Ointment, etc.
  - Default: All selected
- **ATC Code Filter:**
  - Multi-select dropdown or checkboxes
  - Shows list of ATC codes
  - Default: All selected
- **Date Range Filter:**
  - Quick filters: Last 7 days, Last 30 days, Custom
  - Custom: Date range picker

**Clear Filters Button:**
- **Position:** Bottom of filters sidebar
- **Style:** Secondary button
- **Action:** Resets all filters to default

### SKUs Table
- **Layout:** Full-width table with horizontal scroll on mobile
- **Columns:**
  1. **SKU Code:** SKU code/identifier (company's internal code)
  2. **SKU Name:** Full SKU name (e.g., "Paracetamol 500mg Tablets 30-pack") (link to SKU detail)
  3. **Product:** Product name (link to product detail) - Hidden if product-scoped view
  4. **Dosage Strength:** Dosage/strength (e.g., "500mg", "10mg/ml", "250mg/5ml")
  5. **Dosage Form:** Pharmaceutical form (e.g., "Tablet", "Capsule", "Syrup")
  6. **Pack Size:** Pack size (e.g., "30 tablets", "100ml bottle")
  7. **Unit of Measure:** Unit of measure (e.g., "tablets", "ml", "capsules")
  8. **ATC Code:** ATC code (if assigned)
  9. **Status:** Active/Inactive (badge with color coding)
  10. **Actions:** Action buttons (View, Edit)

**Table Features:**
- **Sortable Columns:** SKU Code, SKU Name, Product, Dosage Strength, Dosage Form, Status (click header to sort)
- **Row Hover:** Background color change (#f9fafb)
- **Row Click:** Navigate to SKU detail page
- **Status Badges:**
  - Active: Green (#10b981)
  - Inactive: Gray (#6b7280)
- **Pharmaceutical Attributes Display:**
  - Dosage Strength, Dosage Form, Pack Size displayed prominently
  - Unit of Measure displayed with Pack Size

**Pagination:**
- **Load More Button:** At bottom of table
- **Pagination Info:** "Showing 1-20 of 150 SKUs"
- **Page Size:** 20 items per page (default)

---

## Role-Based Access

### Company Users
- **Scoped View:** Can only see SKUs for their own company's products
- **Product Filter:** Hidden if product-scoped, auto-filtered to company products if all SKUs
- **Actions:** View, Edit (for own company SKUs), Create (for own company products)
- **MOH Authorized Unregistered:** Read-only flag display

### MOH Tier 1
- **Full Access:** Can view all SKUs across all companies and products
- **Actions:** View, Edit, Create, Deactivate
- **Product Filter:** Available (can filter by product/company)

### MOH Tier 2
- **View Access:** Can view all SKUs across all companies and products
- **Limited Actions:** Can view, edit (limited)
- **Product Filter:** Available (can filter by product/company)

---

## State Variations

### Empty State (No SKUs)
- **Message:** "No SKUs found"
- **Subtext:** "Create your first SKU to get started"
- **Action Button:** "New SKU"
- **Visual:** Empty state illustration

### Loading State
- **Skeleton:** Table rows with shimmer effect
- **Count:** 5-10 skeleton rows

### Error State
- **Message:** "Unable to load SKUs"
- **Action:** "Retry" button

### Filtered Empty State
- **Message:** "No SKUs match your filters"
- **Action:** "Clear Filters" button

---

## Responsive Design

### Desktop (≥1024px)
- **Layout:** Filters sidebar + table
- **Filters:** Always visible sidebar
- **Table:** All columns visible (may require horizontal scroll)

### Tablet (768px - 1023px)
- **Layout:** Collapsible filters sidebar
- **Table:** Horizontal scroll for additional columns
- **Filters:** Drawer on mobile

### Mobile (<768px)
- **Layout:** Stack layout
- **Filters:** Hidden (accessible via filter button)
- **Table:** Card-based layout instead of table
- **Cards:** Show key information (SKU Code, SKU Name, Dosage, Form, Pack Size, Status), tap to expand

---

## Interactions

### Click Actions
- **SKU Row/Name:** Navigate to `/rmm/skus/[id]` or `/rmm/products/[id]/skus/[sku_id]`
- **Product Name:** Navigate to product detail (if not product-scoped view)
- **View Button:** Navigate to SKU detail
- **Edit Button:** Navigate to `/rmm/skus/[id]/edit` or `/rmm/products/[id]/skus/[sku_id]/edit`
- **Status Badge:** Filter by status (optional click action)
- **Dosage Form Badge:** Filter by dosage form (optional click action)
- **"New SKU" Button:** Navigate to `/rmm/products/[id]/skus/new` or `/rmm/skus/new`

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
- [Database Schema](../../../../02-architecture/database/schema-design.md) - SKUs table structure

---

## Related Wireframes

- [Products List](../products/task-0.5.2.4-products-list.md) - Products list page
- [Product Detail](../products/task-0.5.2.5-product-detail.md) - Product detail page (SKUs tab)
- [SKU Detail](task-0.5.2.7-sku-detail.md) - SKU detail page
- [SKU Create/Edit Form](task-0.5.2.10-sku-create-edit-form.md) - SKU create/edit form

---

## Pharmaceutical Attributes

### Key Attributes Displayed
- **Dosage Strength:** e.g., "500mg", "10mg/ml", "250mg/5ml"
- **Dosage Form:** e.g., "Tablet", "Capsule", "Syrup", "Injection", "Cream", "Ointment"
- **Pack Size:** e.g., "30 tablets", "100ml bottle", "50 capsules"
- **Unit of Measure:** e.g., "tablets", "ml", "capsules", "vials", "boxes"

These attributes are critical for pharmaceutical product identification and are used in all submissions (AAMS, MSQ, WSL).

**Regulatory Context (Fatima's Requirement):**
- SKU data is used in regulatory submissions (AAMS, MSQ, WSL) per DMP Art.15
- All SKU data is retained for 7 years per regulatory requirements (Law No. 09-08)
- SKU information is subject to compliance monitoring and threshold calculations
- [View Regulatory Framework]

---

**Next:** [SKU Detail](task-0.5.2.7-sku-detail.md)

