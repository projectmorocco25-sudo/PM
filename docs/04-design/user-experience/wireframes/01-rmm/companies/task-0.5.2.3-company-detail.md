# Task 0.5.2.3: Company Detail Page Wireframe

**Status:** 🟡 In Progress  
**Route:** `/rmm/companies/[id]`  
**File:** `task-0.5.2.3-company-detail.png`  
**Priority:** 🔴 Core RMM Workflows

**Design Approach:** Modern enterprise detail page pattern with tabs, comprehensive information display, and role-based actions. Professional, accessible, and optimized for registry management workflows.

---

## Wireframe Layout

```
┌─────────────────────────────────────────────────────────────┐
│ Home > RMM > Companies > ABC Pharmaceuticals Inc.          │
│                                                             │
│ ABC Pharmaceuticals Inc.              [Edit] [Actions ▼]   │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Company Information                                      ││
│ │                                                          ││
│ │ Type: IPC (Industrial Pharmaceutical Company)           ││
│ │ Status: Active                                           ││
│ │ Registration Number: REG-2024-001                       ││
│ │ Tax ID: TAX-123456789                                    ││
│ │                                                          ││
│ │ Address:                                                 ││
│ │ 123 Pharma Street, Casablanca, Morocco                  ││
│ │                                                          ││
│ │ Contact:                                                 ││
│ │ Email: contact@abcpharma.ma                             ││
│ │ Phone: +212 5XX XXX XXX                                  ││
│ │                                                          ││
│ │ Created: 2024-01-15                                      ││
│ │ Last Updated: 2024-12-20                                ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ Tabs: [Overview] [Products] [History]                      │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Overview Tab (Default)                                   ││
│ │                                                          ││
│ │ ┌─────────────────┐ ┌─────────────────┐                ││
│ │ │ Total Products  │ │ Active Products │                ││
│ │ │       45        │ │       42        │                ││
│ │ └─────────────────┘ └─────────────────┘                ││
│ │                                                          ││
│ │ ┌─────────────────┐ ┌─────────────────┐                ││
│ │ │ Total SKUs      │ │ Active SKUs     │                ││
│ │ │      120        │ │      115        │                ││
│ │ └─────────────────┘ └─────────────────┘                ││
│ │                                                          ││
│ │ Recent Activity:                                         ││
│ │ • Product "Paracetamol" created - 2 days ago            ││
│ │ • SKU "Paracetamol 500mg 30-pack" updated - 1 week ago ││
│ │ • Company information updated - 2 weeks ago            ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Products Tab                                             ││
│ │                                                          ││
│ │ [New Product]                                            ││
│ │                                                          ││
│ │ Product Name      ATC Code    SKUs    Status    Actions ││
│ │ ──────────────    ─────────   ────    ──────    ────── ││
│ │ Paracetamol      N02BE01     5       Active    [View]  ││
│ │ Ibuprofen        M01AE01     3       Active    [View]  ││
│ │ Amoxicillin      J01CA04     8       Active    [View]  ││
│ │                                                          ││
│ │ [View All Products]                                      ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ History Tab                                              ││
│ │                                                          ││
│ │ Timeline of all changes and updates                      ││
│ │                                                          ││
│ │ • Company information updated - 2 weeks ago             ││
│ │   Updated by: MOH Tier 2 - Ahmed Benali                ││
│ │                                                          ││
│ │ • Product "Paracetamol" created - 2 days ago           ││
│ │   Created by: Company Admin - John Doe                  ││
│ │                                                          ││
│ │ • Company created - 2024-01-15                          ││
│ │   Created by: MOH Tier 1 - Dr. Samir Hassan            ││
│ └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

---

## Component Specifications

### Page Header
- **Breadcrumbs:** "Home > RMM > Companies > [Company Name]"
- **Title:** Company name
  - **Typography:** 24px, font-weight: 600, color: #111827
- **Actions (Right-aligned):**
  - **Edit Button:** Secondary button (role-based visibility)
  - **Actions Dropdown:** More actions menu
    - Options: Deactivate, Delete (with approval), Export, View Audit Log

### Company Information Card
- **Layout:** Card with key-value pairs
- **Fields:**
  - **Type:** IPC or Wholesaler (badge)
  - **Status:** Active/Inactive (badge with color coding)
  - **Registration Number:** Registration identifier
  - **Tax ID:** Tax identification number
  - **Address:** Full address
  - **Contact:** Email, phone
  - **Metadata:** Created date, last updated date
- **Styling:**
  - **Labels:** 14px, color: #6b7280, font-weight: 500
  - **Values:** 16px, color: #111827

### Tabs
- **Tabs:** Overview (default), Products, History
- **Tab Content:**
  - **Overview:** Summary metrics and recent activity
  - **Products:** List of company products
  - **History:** Timeline of all changes

### Overview Tab
- **Metrics Cards:**
  - **Total Products:** Count of all products
  - **Active Products:** Count of active products
  - **Total SKUs:** Count of all SKUs
  - **Active SKUs:** Count of active SKUs
- **Recent Activity:**
  - **Format:** Timeline list of recent changes
  - **Max Items:** 5-10 recent items
  - **Format:** Action description, timestamp

### Products Tab
- **Header:** "New Product" button
- **Products Table:**
  - **Columns:** Product Name, ATC Code, SKU Count, Status, Actions
  - **Row Click:** Navigate to product detail
  - **Actions:** View button
- **Action Link:** "View All Products" (navigate to products list filtered by company)

### History Tab
- **Layout:** Vertical timeline
- **Timeline Items:**
  - **Format:** Change description, timestamp, user who made change
  - **Visual:** Timeline with connecting lines
  - **Chronological:** Most recent first

---

## Role-Based Access

### Company Users
- **Limited View:** Can only see their own company
- **Actions:** View only (no edit, unless Company Admin)

### Company Admin
- **Own Company:** Can view and edit own company
- **Actions:** View, Edit (for own company)

### MOH Tier 1
- **Full Access:** Can view all companies, edit, deactivate, delete
- **Actions:** All actions available

### MOH Tier 2
- **View Access:** Can view all companies
- **Limited Actions:** Can edit (subject to approval workflow)

---

## State Variations

### Inactive Company State
- **Status Badge:** Gray "Inactive"
- **Visual Indicator:** Muted styling
- **Actions:** Limited (reactivate, view)

### Loading State
- **Skeleton:** Placeholder cards and tables with shimmer effect

### Error State
- **Message:** "Unable to load company information"
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
- **Edit Button:** Navigate to `/rmm/companies/[id]/edit`
- **Product Row/Name:** Navigate to product detail
- **View All Products:** Navigate to products list filtered by company
- **History Items:** Expand to show details (if implemented)

### Hover States
- **Links:** Underline on hover
- **Buttons:** Slight elevation/shadow
- **Table Rows:** Background color change (#f9fafb)

---

## Design System References

- [UI Component Specifications](../../../../02-architecture/frontend/ui-component-specifications.md) - Cards, tabs, tables
- [Role-Based UI Patterns](../../../../02-architecture/frontend/role-based-ui-patterns.md) - Role-based access
- [Navigation & Layout Patterns](../../../../02-architecture/frontend/navigation-layout-patterns.md) - Detail pages

---

## Related Wireframes

- [Companies List](task-0.5.2.2-companies-list.md)
- [Company Create/Edit Form](task-0.5.2.8-company-create-edit-form.md)
- [Registry Submission List](task-0.5.2.11-registry-submission-list.md)

---

**Next:** [Company Create/Edit Form](task-0.5.2.8-company-create-edit-form.md)

