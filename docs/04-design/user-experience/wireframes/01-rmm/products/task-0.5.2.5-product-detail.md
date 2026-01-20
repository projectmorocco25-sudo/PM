# Task 0.5.2.5: Product Detail Page Wireframe

**Status:** ✅ Complete  
**Route:** `/rmm/products/[id]` or `/rmm/companies/[id]/products/[product_id]`  
**File:** `task-0.5.2.5-product-detail.png`  
**Priority:** 🔴 Core RMM Workflows (Supporting Pages)

**Design Approach:** Modern enterprise detail page pattern with tabs, comprehensive product information display, SKUs list, and role-based actions. Professional, accessible, and optimized for registry management workflows.

---

## Wireframe Layout

```
┌─────────────────────────────────────────────────────────────┐
│ Home > RMM > Products > Paracetamol                          │
│                                                             │
│ Paracetamol                            [Edit] [Actions ▼]   │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Product Information                                      ││
│ │                                                          ││
│ │ Company: ABC Pharmaceuticals Inc.                        ││
│ │ ATC Code: N02BE01                                        ││
│ │ Critical Medicine: No                                    ││
│ │ Status: Active                                           ││
│ │                                                          ││
│ │ Description:                                             ││
│ │ Pain reliever and fever reducer medication.              ││
│ │                                                          ││
│ │ Created: 2024-01-15                                      ││
│ │ Last Updated: 2024-12-20                                 ││
│ │                                                          ││
│ │ Regulatory Compliance Status (Fatima's Requirement):     ││
│ │ • Regulatory Framework: DMP Art. [X]                     ││
│ │ • Registration Status: ✓ Approved                        ││
│ │ • Compliance Verification: ✓ Complete                    ││
│ │ • Last Verified: [Date]                                  ││
│ │ [View Regulatory Framework] [View Compliance History]    ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ Tabs: [Overview] [SKUs] [History]                          │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Overview Tab (Default)                                   ││
│ │                                                          ││
│ │ ┌─────────────────┐ ┌─────────────────┐                ││
│ │ │ Total SKUs      │ │ Active SKUs     │                ││
│ │ │       8         │ │       7         │                ││
│ │ └─────────────────┘ └─────────────────┘                ││
│ │                                                          ││
│ │ Recent Activity:                                         ││
│ │ • SKU "Paracetamol 500mg 30-pack" created - 2 days ago ││
│ │ • Product description updated - 1 week ago             ││
│ │ • Product created - 2024-01-15                         ││
│ │                                                          ││
│ │ Enforcement History:                                    ││
│ │ • 2 enforcement actions for this product's SKUs        ││
│ │   [View Enforcement History →]                          ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ SKUs Tab                                                 ││
│ │                                                          ││
│ │ [New SKU]                                                ││
│ │                                                          ││
│ │ SKU Code    SKU Name                    Dosage      Status    Actions ││
│ │ ─────────   ─────────────────────────   ────────    ──────    ────── ││
│ │ SKU001     Paracetamol 500mg         500mg       Active    [View]  ││
│ │            Tablets 30-pack            Tablet                  [Edit]  ││
│ │                                                          ││
│ │ SKU002     Paracetamol 250mg         250mg       Active    [View]  ││
│ │            Tablets 30-pack            Tablet                  [Edit]  ││
│ │                                                          ││
│ │ SKU003     Paracetamol 100mg/ml      100mg/ml    Active    [View]  ││
│ │            Syrup 100ml                Syrup                  [Edit]  ││
│ │                                                          ││
│ │ [View All SKUs]                                          ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ History Tab                                              ││
│ │                                                          ││
│ │ Timeline of all changes and updates                      ││
│ │                                                          ││
│ │ • Product description updated - 1 week ago              ││
│ │   Updated by: Company Admin - John Doe                  ││
│ │                                                          ││
│ │ • SKU "Paracetamol 500mg 30-pack" created - 2 days ago││
│ │   Created by: Company Admin - John Doe                  ││
│ │                                                          ││
│ │ • Product created - 2024-01-15                          ││
│ │   Created by: Company Admin - John Doe                  ││
│ └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

---

## Component Specifications

### Page Header
- **Breadcrumbs:** "Home > RMM > Products > [Product Name]" or "Home > RMM > Companies > [Company Name] > Products > [Product Name]"
- **Title:** Product name
  - **Typography:** 24px, font-weight: 600, color: #111827
- **Actions (Right-aligned):**
  - **Edit Button:** Secondary button (role-based visibility)
  - **Actions Dropdown:** More actions menu
    - Options: Deactivate, Delete (with approval), Export, View Audit Log
    - **Critical Medicine Toggle:** For MOH Tier 1 only - "Mark as Critical Medicine" or "Remove Critical Medicine"

### Product Information Card
- **Layout:** Card with key-value pairs
- **Fields:**
  - **Company:** Company name (link to company detail)
  - **ATC Code:** ATC code (link to ATC code detail if available)
  - **Critical Medicine:** Badge indicating if product is designated as critical medicine
    - **Critical Badge:** Red/orange badge with "Critical Medicine" label (MOH Tier 1 designation)
    - **Non-Critical:** "No" or gray badge
  - **Status:** Active/Inactive (badge with color coding)
  - **Description:** Product description (full text)
  - **Metadata:** Created date, last updated date
- **Styling:**
  - **Labels:** 14px, color: #6b7280, font-weight: 500
  - **Values:** 16px, color: #111827

### Tabs
- **Tabs:** Overview (default), SKUs, History
- **Tab Content:**
  - **Overview:** Summary metrics and recent activity
  - **SKUs:** List of product SKUs
  - **History:** Timeline of all changes

### Overview Tab
- **Metrics Cards:**
  - **Total SKUs:** Count of all SKUs for this product
  - **Active SKUs:** Count of active SKUs for this product
- **Recent Activity:**
  - **Format:** Timeline list of recent changes
  - **Max Items:** 5-10 recent items
  - **Format:** Action description, timestamp
- **Enforcement History:**
  - **Display:** Count of enforcement actions related to this product's SKUs
  - **Link:** "View Enforcement History" button
  - **Action:** Navigate to `/enforcement/actions?product=[id]` (filtered by product)
  - **Styling:** Link with icon, highlighted if actions exist

### SKUs Tab
- **Header:** "New SKU" button
- **SKUs Table:**
  - **Columns:** SKU Code, SKU Name, Dosage Strength, Dosage Form, Pack Size, Status, Actions
  - **Row Click:** Navigate to SKU detail
  - **Actions:** View button, Edit button
- **Action Link:** "View All SKUs" (navigate to SKUs list filtered by product)

### History Tab
- **Layout:** Vertical timeline
- **Timeline Items:**
  - **Format:** Change description, timestamp, user who made change
  - **Visual:** Timeline with connecting lines
  - **Chronological:** Most recent first
- **Events Tracked:**
  - Product creation
  - Product updates (description, ATC code)
  - Critical medicine designation changes
  - Status changes (active/inactive)
  - SKU additions/updates

---

## Role-Based Access

### Company Users
- **Limited View:** Can only see products for their own company
- **Actions:** View, Edit (for own company products)
- **Critical Medicine Designation:** Read-only (can view but cannot designate)

### Company Admin
- **Own Company Products:** Can view and edit own company products
- **Actions:** View, Edit (for own company products)
- **Cannot:** Designate critical medicines

### MOH Tier 1
- **Full Access:** Can view all products across all companies
- **Actions:** All actions available (View, Edit, Deactivate, Delete, Designate Critical Medicine)
- **Critical Medicine Toggle:** Can mark/unmark products as critical medicines

### MOH Tier 2
- **View Access:** Can view all products across all companies
- **Limited Actions:** Can edit (limited), cannot designate critical medicines
- **Cannot:** Designate critical medicines

---

## State Variations

### Inactive Product State
- **Status Badge:** Gray "Inactive"
- **Visual Indicator:** Muted styling
- **Actions:** Limited (reactivate, view)
- **SKUs:** All SKUs show as inactive (cascade deactivation)

### Critical Medicine State
- **Critical Medicine Badge:** Red/orange badge visible
- **Visual Indicator:** Highlighted or special styling
- **MOH Tier 1 Actions:** Can toggle off critical medicine designation

### Loading State
- **Skeleton:** Placeholder cards and tables with shimmer effect

### Error State
- **Message:** "Unable to load product information"
- **Action:** "Retry" button

---

## Responsive Design

### Desktop (≥1024px)
- **Layout:** Full-width with sidebar (if needed)
- **Tabs:** Horizontal tab navigation
- **Sections:** Side-by-side where appropriate

### Tablet (768px - 1023px)
- **Layout:** Stacked sections
- **Tabs:** Horizontal tab navigation (scrollable if needed)

### Mobile (<768px)
- **Layout:** Single column
- **Tabs:** Full-width tab navigation
- **Cards:** Stacked

---

## Interactions

### Click Actions
- **Edit Button:** Navigate to `/rmm/products/[id]/edit` or `/rmm/companies/[id]/products/[product_id]/edit`
- **Company Name:** Navigate to company detail
- **ATC Code:** Navigate to ATC code detail (if route exists)
- **SKU Row/Name:** Navigate to SKU detail
- **View All SKUs:** Navigate to SKUs list filtered by product
- **History Items:** Expand to show details (if implemented)
- **Critical Medicine Toggle (MOH Tier 1):** Open modal to confirm designation change

### Hover States
- **Links:** Underline on hover
- **Buttons:** Slight elevation/shadow
- **Table Rows:** Background color change (#f9fafb)

---

## Design System References

- [UI Component Specifications](../../../../02-architecture/frontend/ui-component-specifications.md) - Cards, tabs, tables
- [Role-Based UI Patterns](../../../../02-architecture/frontend/role-based-ui-patterns.md) - Role-based access
- [Navigation & Layout Patterns](../../../../02-architecture/frontend/navigation-layout-patterns.md) - Detail pages
- [Database Schema](../../../../02-architecture/database/schema-design.md) - Products table structure

---

## Related Wireframes

- [Products List](task-0.5.2.4-products-list.md) - Products list page
- [Product Create/Edit Form](task-0.5.2.9-product-create-edit-form.md) - Product create/edit form
- [SKUs List](../skus/task-0.5.2.6-skus-list.md) - SKUs list page
- [SKU Detail](../skus/task-0.5.2.7-sku-detail.md) - SKU detail page
- [Company Detail](../companies/task-0.5.2.3-company-detail.md) - Company detail page (Products tab)

---

**Next:** [SKUs List](../skus/task-0.5.2.6-skus-list.md)

