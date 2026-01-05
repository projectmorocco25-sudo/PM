# RMM Module Wireframes

**Subphase:** 0.5.2 - RMM Module Wireframes  
**Duration:** Days 4-5  
**Status:** ⚪ Not Started  
**Owner:** Emma (UI/UX + Next.js Frontend Specialist)

## Overview

Registry Management Module (RMM) wireframes cover company, product, and SKU management, registry submission workflows, and MOH-only pages (ATC codes, critical medicines).

## Wireframe List

### RMM Overview
- [ ] **Task 0.5.2.1:** RMM overview page (module summary, quick links, recent activity, statistics)

### List & Detail Pages
- [ ] **Task 0.5.2.2:** Companies list page (table view, filters, search, pagination, role-based actions)
- [ ] **Task 0.5.2.3:** Company detail page (information sections, tabs: Overview | Products | History, action buttons, related products)
- [ ] **Task 0.5.2.4:** Products list page (company-scoped, filters, search, product cards/table)
- [ ] **Task 0.5.2.5:** Product detail page (product info, tabs: Overview | SKUs | History, related submissions)
- [ ] **Task 0.5.2.6:** SKUs list page (product-scoped, filters, pharmaceutical attributes display)
- [ ] **Task 0.5.2.7:** SKU detail page (SKU information, tabs: Overview | History, pharmaceutical attributes: dosage_strength, dosage_form, pack_size, unit_of_measure)

### Forms
- [ ] **Task 0.5.2.8:** Company create/edit form (form sections, validation, draft auto-save indicator)
- [ ] **Task 0.5.2.9:** Product create/edit form (form sections, ATC code selection, validation)
- [ ] **Task 0.5.2.10:** SKU create/edit form (pharmaceutical attributes: dosage_strength, dosage_form, pack_size, unit_of_measure, validation, form sections)

### Workflow Pages
- [ ] **Task 0.5.2.11:** Registry submission list page (my submissions, pending approvals, status filters)
- [ ] **Task 0.5.2.12:** Registry submission detail page (submission data, workflow status indicator, approval history timeline, action buttons)
- [ ] **Task 0.5.2.13:** Registry submission workflow states (draft, submitted, tier2_verified, tier1_approved, tier2_implemented, completed, rejected)

### MOH-Only Pages
- [ ] **Task 0.5.2.14:** ATC Codes list page (MOH only, read-only for companies, search, filters)
- [ ] **Task 0.5.2.15:** Critical Medicines list page (MOH Tier 1 only, designation interface, filters)

## Subfolder Structure

```
01-rmm/
├── README.md (this file)
├── overview/
├── companies/
├── products/
├── skus/
├── forms/
└── workflow/
```

## Related Routes

See [Routing Structure](../../../../02-architecture/frontend/routing-structure.md) for RMM routes:
- `/rmm` - RMM overview
- `/rmm/companies` - Companies list
- `/rmm/companies/[id]` - Company detail
- `/rmm/products` - Products list
- `/rmm/products/[id]` - Product detail
- `/rmm/skus/[id]` - SKU detail
- `/rmm/submissions` - Registry submissions
- `/rmm/atc-codes` - ATC codes (MOH only)
- `/rmm/critical-medicines` - Critical medicines (MOH Tier 1 only)

## Key Design Considerations

### SKU Pharmaceutical Attributes
- **dosage_strength:** Text input (e.g., "500mg", "10mg/ml")
- **dosage_form:** Dropdown with standard forms (Tablet, Capsule, Syrup, etc.)
- **pack_size:** Text input (e.g., "30 tablets", "100ml")
- **unit_of_measure:** Dropdown with standard units (tablets, ml, etc.)

### Workflow States
Wireframes must show all workflow states clearly:
- Draft → Submitted → Tier 2 Verified → Tier 1 Approved → Tier 2 Implemented → Completed
- Rejection path with feedback

### Role-Based Access
- Companies: Can create/edit own registry items
- MOH Tier 2: Can verify submissions
- MOH Tier 1: Can approve/reject, designate critical medicines

## Design System References

- [Form Design Patterns](../../../../02-architecture/frontend/form-design-patterns.md) - Form validation, auto-save
- [Role-Based UI Patterns](../../../../02-architecture/frontend/role-based-ui-patterns.md) - Role-based actions
- [UI Component Specifications](../../../../02-architecture/frontend/ui-component-specifications.md) - Tables, forms, workflows

---

**Next:** Complete overview → list pages → detail pages → forms → workflow

