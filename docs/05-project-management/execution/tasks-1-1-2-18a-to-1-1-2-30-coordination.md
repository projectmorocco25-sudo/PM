# Tasks 1.1.2.18a to 1.1.2.30 Team Coordination - RMM Frontend Implementation (Continued)

**Date:** 2026-01-23
**From:** Sami (Implementation Compliance Specialist)
**To:** Yasmine (Frontend Lead), Oliver (Backend Lead), Emma (UI/UX + Next.js Frontend Specialist), Nadia (Database Specialist)

---

## Subject: Continuing RMM Frontend Implementation

Team,

I am coordinating the continuation of RMM frontend implementation for **Tasks 1.1.2.18a through 1.1.2.30**. These tasks complete the RMM module frontend, including company products, create/edit forms, products module, SKUs module, registry submissions, and MOH-only pages.

**✅ Prerequisites Completed:**
- Task 1.1.2.16: RMM module layout and navigation ✅
- Task 1.1.2.17: Companies list page ✅
- Task 1.1.2.18: Company detail page ✅
- Helper RPC functions for registry submissions ✅

---

## 🎯 Tasks to Implement (13 tasks)

### Companies Module (2 tasks)
- **Task 1.1.2.18a:** Company products page (`/rmm/companies/[id]/products`)
- **Task 1.1.2.19:** Company create/edit forms (`/rmm/companies/new`, `/rmm/companies/[id]/edit`)

### Products Module (3 tasks)
- **Task 1.1.2.20:** Products list page (`/rmm/products`)
- **Task 1.1.2.21:** Product detail page (`/rmm/products/[id]`)
- **Task 1.1.2.22:** Product create/edit forms (`/rmm/products/new`, `/rmm/products/[id]/edit`)

### SKUs Module (3 tasks)
- **Task 1.1.2.23:** SKUs list page (`/rmm/skus`)
- **Task 1.1.2.24:** SKU detail page (`/rmm/skus/[id]`)
- **Task 1.1.2.25:** SKU create/edit forms (`/rmm/skus/new`, `/rmm/skus/[id]/edit`)

### Registry Submissions Module (3 tasks)
- **Task 1.1.2.26:** Registry submission list page (`/rmm/submissions`)
- **Task 1.1.2.27:** Registry submission detail page (`/rmm/submissions/[id]`)
- **Task 1.1.2.28:** Registry submission workflow actions (modal/components)

### MOH-Only Pages (2 tasks)
- **Task 1.1.2.29:** ATC Codes list page (`/rmm/atc-codes`) - MOH only
- **Task 1.1.2.30:** Critical Medicines list page (`/rmm/critical-medicines`) - MOH only

---

## 📋 Implementation Strategy

### Established Patterns
1. **List Pages:** Search, filters, sortable table, pagination, responsive design
2. **Detail Pages:** Tabbed interface, information cards, role-based actions
3. **Forms:** Create/edit forms with validation, role-based access
4. **Compliance:** Wireframe bindings, database integration, role-based access

### Reusable Components
- List page patterns (from Companies list)
- Detail page patterns (from Company detail)
- Form patterns (to be established)
- Filter components
- Table components

---

## ⚠️ Compliance Requirements

### Hard Gates (Non-Negotiable)
1. **No Hardcoded UI Data:** All data must come from Supabase database
2. **Wireframe Binding:** Every page must declare wireframe task file(s) in JSDoc comment
3. **DB Binding:** Every page must list tables/fields used
4. **Role + States Coverage:** All roles and UI states (loading, empty, error, success) must be implemented
5. **Wireframe-First:** Wireframes must be reviewed before implementation

### Required for Each Task
- Wireframe link(s) in code (JSDoc format)
- Role variant screenshots (or N/A with wireframe citation)
- State screenshots (loading/empty/error/success)
- Data proof (tables/fields + query locations)
- Layout integration proof
- Role coverage proof
- Compliance section in implementation summary

---

## 🔄 Team Coordination Points

### Yasmine (Frontend Lead)
- **Action:** Review wireframe compliance and component structure
- **Timing:** After each major task completion
- **Focus:** Wireframe binding, component patterns, state management

### Emma (UI/UX + Next.js Frontend Specialist)
- **Action:** Review Next.js App Router implementation and routing structure
- **Timing:** After form implementations
- **Focus:** Route structure, form patterns, validation

### Oliver (Backend Lead)
- **Action:** Verify RPC function usage and API integration
- **Timing:** As needed for API questions
- **Focus:** RPC function parameters, return formats, error handling

### Nadia (Database Specialist)
- **Action:** Verify database queries and RLS policy compliance
- **Timing:** As needed for data access questions
- **Focus:** Query patterns, RLS policy verification, data access

---

## 📝 Implementation Order

1. **Company Products Page** (1.1.2.18a) - Completes company detail
2. **Company Create/Edit Forms** (1.1.2.19) - Establishes form pattern
3. **Products List** (1.1.2.20) - Reuses list pattern
4. **Product Detail** (1.1.2.21) - Reuses detail pattern
5. **Product Create/Edit Forms** (1.1.2.22) - Reuses form pattern
6. **SKUs List** (1.1.2.23) - Reuses list pattern
7. **SKU Detail** (1.1.2.24) - Reuses detail pattern
8. **SKU Create/Edit Forms** (1.1.2.25) - Reuses form pattern
9. **Registry Submission List** (1.1.2.26) - Uses helper RPC functions
10. **Registry Submission Detail** (1.1.2.27) - Uses helper RPC functions
11. **Registry Submission Workflow Actions** (1.1.2.28) - Workflow components
12. **ATC Codes List** (1.1.2.29) - MOH-only, simple list
13. **Critical Medicines List** (1.1.2.30) - MOH-only, simple list

---

## Expected Deliverables

- All RMM frontend pages and components
- Wireframe binding in all code files
- Role-based access control
- Integration with backend RPC functions
- Compliance documentation for each task
- Implementation summaries with compliance sections

---

Please acknowledge receipt. Implementation will proceed sequentially starting with Task 1.1.2.18a (Company products page).

Best regards,
Sami
Implementation Compliance Specialist
