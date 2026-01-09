# Task 0.5.2.7: SKU Detail Page Wireframe

**Status:** 🟡 In Progress  
**Route:** `/rmm/skus/[id]` or `/rmm/products/[id]/skus/[sku_id]`  
**File:** `task-0.5.2.7-sku-detail.png`  
**Priority:** 🔴 Core RMM Workflows (Supporting Pages)

**Design Approach:** Modern enterprise detail page pattern with tabs, comprehensive SKU information display including all pharmaceutical attributes, and role-based actions. Professional, accessible, and optimized for registry management workflows.

---

## Wireframe Layout

```
┌─────────────────────────────────────────────────────────────┐
│ Home > RMM > Products > Paracetamol > SKUs > SKU001          │
│                                                             │
│ Paracetamol 500mg Tablets 30-pack          [Edit] [Actions ▼]│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ SKU Information                                          ││
│ │                                                          ││
│ │ SKU Code: SKU001                                         ││
│ │ Product: Paracetamol                                     ││
│ │ Company: ABC Pharmaceuticals Inc.                        ││
│ │ ATC Code: N02BE01                                        ││
│ │ Status: Active                                           ││
│ │                                                          ││
│ │ Full Name: Paracetamol 500mg Tablets 30-pack            ││
│ │                                                          ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Pharmaceutical Attributes                                 ││
│ │                                                          ││
│ │ Dosage Strength: 500mg                                   ││
│ │ Dosage Form: Tablet                                      ││
│ │ Pack Size: 30 tablets                                    ││
│ │ Unit of Measure: tablets                                 ││
│ │                                                          ││
│ │ MOH Authorized Unregistered: No                          ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ Tabs: [Overview] [History]                                 │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Overview Tab (Default)                                   ││
│ │                                                          ││
│ │ Related Submissions:                                     ││
│ │ • AAMS 2024 Submission - Submitted                       ││
│ │ • WSL Week Ending 2025-01-19 - Submitted                ││
│ │ • MSQ January 2025 - Submitted                           ││
│ │                                                          ││
│ │ Export Requests (if ECS active):                         ││
│ │ • Export Request #12345 - Approved                      ││
│ │ • Export Request #12346 - Pending                       ││
│ │                                                          ││
│ │ Compliance Violations (if any):                          ││
│ │ • Threshold breach - Week Ending 2025-01-12             ││
│ │   [View Compliance Violation Detail]                     ││
│ │                                                          ││
│ │ Enforcement Actions (if any):                            ││
│ │ ⚠️ Warning - ENF-2025-001                               ││
│ │   Created from: Threshold breach violation               ││
│ │   Status: Executed  Date: 2 days ago                    ││
│ │   [View Enforcement Action Detail →]                    ││
│ │                                                          ││
│ │ [View All Enforcement Actions →]                        ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ History Tab                                              ││
│ │                                                          ││
│ │ Timeline of all changes and updates                      ││
│ │                                                          ││
│ │ • SKU updated - 1 week ago                             ││
│ │   Updated by: Company Admin - John Doe                  ││
│ │   Changes: Pack size changed from 20 to 30 tablets     ││
│ │                                                          ││
│ │ • SKU created - 2024-01-15                              ││
│ │   Created by: Company Admin - John Doe                  ││
│ └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

---

## Component Specifications

### Page Header
- **Breadcrumbs:** "Home > RMM > Products > [Product Name] > SKUs > [SKU Name]" or "Home > RMM > SKUs > [SKU Name]"
- **Title:** Full SKU name (e.g., "Paracetamol 500mg Tablets 30-pack")
  - **Typography:** 24px, font-weight: 600, color: #111827
- **Actions (Right-aligned):**
  - **Edit Button:** Secondary button (role-based visibility)
  - **Actions Dropdown:** More actions menu
    - Options: Deactivate, Delete (with approval), Export, View Audit Log

### SKU Information Card
- **Layout:** Card with key-value pairs
- **Fields:**
  - **SKU Code:** SKU code/identifier (company's internal code)
  - **Product:** Product name (link to product detail)
  - **Company:** Company name (link to company detail)
  - **ATC Code:** ATC code (link to ATC code detail if available)
  - **Full Name:** Complete SKU name (read-only, auto-generated from attributes)
  - **Status:** Active/Inactive (badge with color coding)
  - **Metadata:** Created date, last updated date
- **Styling:**
  - **Labels:** 14px, color: #6b7280, font-weight: 500
  - **Values:** 16px, color: #111827

### Pharmaceutical Attributes Card
- **Layout:** Card with key-value pairs (prominent display)
- **Fields:**
  - **Dosage Strength:** Dosage/strength (e.g., "500mg", "10mg/ml", "250mg/5ml")
    - **Format:** Text display with pharmaceutical notation
    - **Validation:** Must follow pharmaceutical standards
  - **Dosage Form:** Pharmaceutical form
    - **Options:** Tablet, Capsule, Syrup, Injection, Cream, Ointment, etc.
    - **Display:** Badge or text
  - **Pack Size:** Pack size (e.g., "30 tablets", "100ml bottle", "50 capsules")
    - **Format:** Text display combining quantity and unit
  - **Unit of Measure:** Unit of measure for quantities
    - **Options:** tablets, ml, capsules, vials, boxes, etc.
    - **Usage:** Used in submissions (AAMS, MSQ, WSL) for quantity entry
  - **MOH Authorized Unregistered:** Boolean flag
    - **Display:** Badge or Yes/No indicator
    - **Purpose:** Indicates if this is a MOH-authorized unregistered product
- **Styling:**
  - **Labels:** 14px, color: #6b7280, font-weight: 500
  - **Values:** 16px, color: #111827, font-weight: 500 (prominent)
  - **Background:** Light background (#f9fafb) to highlight pharmaceutical attributes

### Tabs
- **Tabs:** Overview (default), History
- **Tab Content:**
  - **Overview:** Related submissions, export requests, compliance violations
  - **History:** Timeline of all changes

### Overview Tab
- **Related Submissions:**
  - **AAMS Submissions:** List of AAMS submissions including this SKU
    - Link to submission detail
    - Status indicator
  - **MSQ Submissions:** List of MSQ submissions including this SKU
    - Link to submission detail
    - Status indicator
  - **WSL Submissions:** List of WSL submissions including this SKU
    - Link to submission detail
    - Status indicator
    - Threshold compliance information
- **Export Requests (if ECS module active):**
  - List of export requests for this SKU
  - Link to export request detail
  - Status indicator
- **Compliance Violations (if any):**
  - List of compliance violations related to this SKU
  - Link to compliance violation detail
  - Priority indicator
- **Enforcement Actions (if any):**
  - **Layout:** List of enforcement actions related to this SKU
  - **Display Condition:** Only shown if enforcement actions exist for this SKU
  - **Fields:**
    - **Action Type:** Icon + text (⚠️ Warning, 💰 Fine, 🚫 Suspension)
    - **Action ID:** Enforcement action identifier (e.g., "ENF-2025-001")
    - **Created From:** Link to related compliance violation (if applicable)
    - **Status:** Status badge (Executed, Pending Approval, etc.)
    - **Date:** Execution or creation date
  - **Actions:**
    - **View Enforcement Action Detail:** Navigate to `/enforcement/actions/[id]`
    - **View All Enforcement Actions:** Navigate to `/enforcement/actions?sku=[id]`
  - **Styling:**
    - **Action Items:** Card-based list with action details
    - **Status Badge:** Color-coded based on action status

### History Tab
- **Layout:** Vertical timeline
- **Timeline Items:**
  - **Format:** Change description, timestamp, user who made change, detailed changes (if applicable)
  - **Visual:** Timeline with connecting lines
  - **Chronological:** Most recent first
- **Events Tracked:**
  - SKU creation
  - SKU updates (pharmaceutical attributes, ATC code)
  - Status changes (active/inactive)
  - MOH authorized unregistered flag changes

---

## Role-Based Access

### Company Users
- **Limited View:** Can only see SKUs for their own company's products
- **Actions:** View, Edit (for own company SKUs)
- **MOH Authorized Unregistered:** Read-only flag display

### Company Admin
- **Own Company SKUs:** Can view and edit own company SKUs
- **Actions:** View, Edit (for own company SKUs)
- **Cannot:** Set MOH authorized unregistered flag

### MOH Tier 1
- **Full Access:** Can view all SKUs across all companies and products
- **Actions:** All actions available (View, Edit, Deactivate, Delete)
- **MOH Authorized Unregistered:** Can set/unset flag

### MOH Tier 2
- **View Access:** Can view all SKUs across all companies and products
- **Limited Actions:** Can view, edit (limited)
- **MOH Authorized Unregistered:** Read-only flag display

---

## State Variations

### Inactive SKU State
- **Status Badge:** Gray "Inactive"
- **Visual Indicator:** Muted styling
- **Actions:** Limited (reactivate, view)

### MOH Authorized Unregistered State
- **Badge:** Special badge indicating MOH authorization
- **Visual Indicator:** Highlighted or special styling
- **Purpose:** Indicates regulatory exception status

### Loading State
- **Skeleton:** Placeholder cards and tables with shimmer effect

### Error State
- **Message:** "Unable to load SKU information"
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
- **Edit Button:** Navigate to `/rmm/skus/[id]/edit` or `/rmm/products/[id]/skus/[sku_id]/edit`
- **Product Name:** Navigate to product detail
- **Company Name:** Navigate to company detail
- **ATC Code:** Navigate to ATC code detail (if route exists)
- **Related Submission Links:** Navigate to respective submission detail pages
- **Export Request Links:** Navigate to export request detail (if ECS active)
- **Compliance Violation Links:** Navigate to compliance violation detail
- **History Items:** Expand to show details (if implemented)

### Hover States
- **Links:** Underline on hover
- **Buttons:** Slight elevation/shadow
- **Cards:** Slight elevation on hover

---

## Design System References

- [UI Component Specifications](../../../../02-architecture/frontend/ui-component-specifications.md) - Cards, tabs, tables
- [Role-Based UI Patterns](../../../../02-architecture/frontend/role-based-ui-patterns.md) - Role-based access
- [Navigation & Layout Patterns](../../../../02-architecture/frontend/navigation-layout-patterns.md) - Detail pages
- [Database Schema](../../../../02-architecture/database/schema-design.md) - SKUs table structure

---

## Related Wireframes

- [SKUs List](task-0.5.2.6-skus-list.md) - SKUs list page
- [SKU Create/Edit Form](task-0.5.2.10-sku-create-edit-form.md) - SKU create/edit form
- [Products List](../products/task-0.5.2.4-products-list.md) - Products list page
- [Product Detail](../products/task-0.5.2.5-product-detail.md) - Product detail page (SKUs tab)

---

## Pharmaceutical Attributes Specification

### Dosage Strength
- **Format:** Text input supporting various formats
- **Examples:** "500mg", "10mg/ml", "250mg/5ml", "0.5%"
- **Validation:** Must follow pharmaceutical notation standards
- **Display:** Prominent display in pharmaceutical attributes card

### Dosage Form
- **Options:** Tablet, Capsule, Syrup, Injection, Cream, Ointment, Drops, Spray, etc.
- **Type:** Dropdown selection
- **Validation:** Must select from predefined list
- **Display:** Badge or text label

### Pack Size
- **Format:** Text input (e.g., "30 tablets", "100ml bottle", "50 capsules")
- **Validation:** Must include both quantity and descriptive text
- **Examples:** "30 tablets", "100ml bottle", "50 capsules", "10 vials"
- **Display:** Combined with unit of measure

### Unit of Measure
- **Options:** tablets, ml, capsules, vials, boxes, units, grams, etc.
- **Type:** Dropdown selection
- **Usage:** Used in submissions (AAMS, MSQ, WSL) for quantity entry
- **Validation:** Must select from predefined list
- **Display:** Combined with pack size

---

**Next:** [SKU Create/Edit Form](task-0.5.2.10-sku-create-edit-form.md)

