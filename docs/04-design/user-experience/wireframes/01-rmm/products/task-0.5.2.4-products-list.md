# Task 0.5.2.4: Products List Page Wireframe

**Status:** 🟡 In Progress  
**Route:** `/rmm/products` (all products) or `/rmm/companies/[id]/products` (company-scoped)  
**File:** `task-0.5.2.4-products-list.png`  
**Priority:** 🔴 Core RMM Workflows (Supporting Pages)

**Design Approach:** Modern enterprise list pattern with table view, company-scoped filtering, search, and role-based actions. Professional, accessible, and optimized for registry management workflows. Products are always scoped to a company.

---

## Wireframe Layout

```
┌─────────────────────────────────────────────────────────────┐
│ Home > RMM > Products                                        │
│                                                             │
│ Products                                 [New Product]      │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Search products...                      [🔍] [Filters ▼]││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌──────────┐ ┌───────────────────────────────────────────┐│
│ │ Filters  │ │ Products Table                             ││
│ │          │ │                                             ││
│ │ Company  │ │ Product Name    Company      ATC Code    Status    Actions ││
│ │ ☐ All    │ │ ────────────    ────────      ─────────   ──────    ────── ││
│ │ ☑ ABC    │ │ Paracetamol    ABC Pharma    N02BE01     Active    [View]  ││
│ │   Pharma │ │                 Inc.                                  [Edit]  ││
│ │ ☐ XYZ    │ │                                             ││
│ │   Medical│ │ Ibuprofen      ABC Pharma    M01AE01     Active    [View]  ││
│ │          │ │                 Inc.                                  [Edit]  ││
│ │ Status   │ │                                             ││
│ │ ☐ All    │ │ Amoxicillin    XYZ Medical   J01CA04     Active    [View]  ││
│ │ ☑ Active │ │                 Supplies                              [Edit]  ││
│ │ ☐ Inact. │ │                                             ││
│ │          │ │ Aspirin        ABC Pharma    B01AC06     Active    [View]  ││
│ │ Critical │ │                 Inc.                                  [Edit]  ││
│ │ ☐ All    │ │                                             ││
│ │ ☑ Yes    │ │ Ciprofloxacin  XYZ Medical   J01MA02     Inactive  [View]  ││
│ │ ☐ No     │ │                 Supplies                              [Edit] ││
│ │          │ │                                             ││
│ │ ATC Code │ │ [Load More]                                ││
│ │ ☐ All    │ │                                             ││
│ │ ☐ N02    │ │                                             ││
│ │ ☐ M01    │ │                                             ││
│ │          │ │                                             ││
│ │ Date     │ │                                             ││
│ │ Last 7d  │ │                                             ││
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
- **Breadcrumbs:** "Home > RMM > Products" or "Home > RMM > Companies > [Company Name] > Products"
- **Title:** "Products" or "Products - [Company Name]" (if company-scoped)
  - **Typography:** 24px, font-weight: 600, color: #111827
- **Actions (Right-aligned):**
  - **New Product Button:** Primary button (role-based visibility)
  - **Click Action:** Navigate to `/rmm/products/new` or `/rmm/companies/[id]/products/new`

### Search Bar
- **Input:** Full-width search input with placeholder "Search products..."
- **Icon:** Search icon on right side
- **Functionality:** Real-time search as user types (searches product name, ATC code, description)
- **Clear Button:** X button appears when text entered

### Filters Sidebar (Left)
- **Width:** 240px (desktop), hidden on mobile (drawer)
- **Background:** White (#ffffff)
- **Border Right:** 1px solid #e5e7eb
- **Padding:** 16px

**Filter Sections:**
- **Company Filter:**
  - Multi-select dropdown or checkboxes
  - Shows list of companies (only for MOH users)
  - Company users: Auto-filtered to their company (filter hidden)
  - Default: All selected (MOH) or single company (Company users)
- **Status Filter:**
  - Checkboxes: All, Active, Inactive
  - Default: Active selected
- **Critical Medicine Filter:**
  - Checkboxes: All, Yes (Critical), No (Not Critical)
  - Default: All selected
- **ATC Code Filter:**
  - Multi-select dropdown or checkboxes
  - Shows list of ATC codes (organized by level)
  - Default: All selected
- **Date Range Filter:**
  - Quick filters: Last 7 days, Last 30 days, Custom
  - Custom: Date range picker

**Clear Filters Button:**
- **Position:** Bottom of filters sidebar
- **Style:** Secondary button
- **Action:** Resets all filters to default

### Products Table
- **Layout:** Full-width table with horizontal scroll on mobile
- **Columns:**
  1. **Product Name:** Product name (link to product detail)
  2. **Company:** Company name (link to company detail) - Hidden if company-scoped view
  3. **ATC Code:** ATC code (e.g., N02BE01) - Link to ATC code detail if available
  4. **Critical Medicine:** Badge indicating if product is designated as critical medicine (MOH Tier 1 designation)
     - **Critical Badge:** Red/orange badge with "Critical" label
     - **Non-Critical:** No badge or gray badge
  5. **SKU Count:** Number of SKUs for this product
  6. **Status:** Active/Inactive (badge with color coding)
  7. **Actions:** Action buttons (View, Edit)

**Table Features:**
- **Sortable Columns:** Product Name, Company, ATC Code, Status, SKU Count (click header to sort)
- **Row Hover:** Background color change (#f9fafb)
- **Row Click:** Navigate to product detail page
- **Status Badges:**
  - Active: Green (#10b981)
  - Inactive: Gray (#6b7280)
- **Critical Medicine Badge:**
  - Critical: Red/orange (#ef4444 or #f97316)
  - Non-Critical: No badge

**Pagination:**
- **Load More Button:** At bottom of table
- **Pagination Info:** "Showing 1-20 of 150 products"
- **Page Size:** 20 items per page (default)

---

## Role-Based Access

### Company Users
- **Scoped View:** Can only see products for their own company
- **Company Filter:** Hidden (automatically filtered)
- **Actions:** View, Edit (for own company products), Create (for own company)
- **Critical Medicine Designation:** Read-only (can view but cannot designate)

### MOH Tier 1
- **Full Access:** Can view all products across all companies
- **Actions:** View, Edit, Create, Deactivate, Designate Critical Medicine
- **Company Filter:** Available (can filter by company)

### MOH Tier 2
- **View Access:** Can view all products across all companies
- **Limited Actions:** Can view, edit (limited), cannot designate critical medicines
- **Company Filter:** Available (can filter by company)

---

## State Variations

### Empty State (No Products)
- **Message:** "No products found"
- **Subtext:** "Create your first product to get started"
- **Action Button:** "New Product"
- **Visual:** Empty state illustration

### Loading State
- **Skeleton:** Table rows with shimmer effect
- **Count:** 5-10 skeleton rows

### Error State
- **Message:** "Unable to load products"
- **Action:** "Retry" button

### Filtered Empty State
- **Message:** "No products match your filters"
- **Action:** "Clear Filters" button

---

## Responsive Design

### Desktop (≥1024px)
- **Layout:** Filters sidebar + table
- **Filters:** Always visible sidebar
- **Table:** All columns visible

### Tablet (768px - 1023px)
- **Layout:** Collapsible filters sidebar
- **Table:** Horizontal scroll for additional columns
- **Filters:** Drawer on mobile

### Mobile (<768px)
- **Layout:** Stack layout
- **Filters:** Hidden (accessible via filter button)
- **Table:** Card-based layout instead of table
- **Cards:** Show key information (Product Name, Company, ATC Code, Status), tap to expand

---

## Interactions

### Click Actions
- **Product Row/Name:** Navigate to `/rmm/products/[id]` or `/rmm/companies/[id]/products/[product_id]`
- **Company Name:** Navigate to company detail (if not company-scoped view)
- **ATC Code:** Navigate to ATC code detail (if route exists)
- **View Button:** Navigate to product detail
- **Edit Button:** Navigate to `/rmm/products/[id]/edit` or `/rmm/companies/[id]/products/[product_id]/edit`
- **Status Badge:** Filter by status (optional click action)
- **Critical Medicine Badge:** Filter by critical medicine status (optional click action)
- **"New Product" Button:** Navigate to `/rmm/products/new` or `/rmm/companies/[id]/products/new`

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
- [Database Schema](../../../../02-architecture/database/schema-design.md) - Products table structure

---

## Related Wireframes

- [Companies List](../companies/task-0.5.2.2-companies-list.md) - Companies list page
- [Company Detail](../companies/task-0.5.2.3-company-detail.md) - Company detail page (Products tab)
- [Product Detail](task-0.5.2.5-product-detail.md) - Product detail page
- [Product Create/Edit Form](task-0.5.2.9-product-create-edit-form.md) - Product create/edit form
- [ATC Codes List](../task-0.5.2.14-atc-codes-list.md) - ATC codes reference list
- [Critical Medicines List](../task-0.5.2.15-critical-medicines-list.md) - Critical medicines list (MOH Tier 1)

---

**Next:** [Product Detail](task-0.5.2.5-product-detail.md)

