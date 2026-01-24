# Tasks 1.1.2.21 to 1.1.2.30 Team Coordination - Final RMM Frontend Implementation

**Date:** 2026-01-23
**From:** Sami (Implementation Compliance Specialist)
**To:** Yasmine (Frontend Lead), Oliver (Backend Lead), Emma (UI/UX + Next.js Frontend Specialist), Nadia (Database Specialist)

---

## Subject: Final RMM Frontend Implementation Sprint

Team,

I am coordinating the final RMM frontend implementation for **Tasks 1.1.2.21 through 1.1.2.30**. These tasks complete the RMM module frontend, including product detail/forms, SKUs module, registry submissions, and MOH-only pages.

**✅ Prerequisites Completed:**
- Tasks 1.1.2.16-1.1.2.20: RMM layout, Companies module, Products list ✅
- All backend RPC functions available ✅
- Helper RPC functions for registry submissions ✅

---

## 🎯 Tasks to Implement (10 tasks)

### Products Module (2 tasks)
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

### Reusable Patterns Established
1. **List Pages:** Search, filters, sortable table, pagination, responsive design
2. **Detail Pages:** Tabbed interface, information cards, role-based actions
3. **Forms:** Validation, role-based access, responsive design
4. **Compliance:** Wireframe bindings, database integration, role-based access

### Implementation Order
1. Product detail (1.1.2.21) - Reuses detail pattern
2. Product forms (1.1.2.22) - Reuses form pattern
3. SKUs list (1.1.2.23) - Reuses list pattern
4. SKU detail (1.1.2.24) - Reuses detail pattern
5. SKU forms (1.1.2.25) - Reuses form pattern (includes pharma attributes)
6. Registry submission list (1.1.2.26) - Uses helper RPC functions
7. Registry submission detail (1.1.2.27) - Uses helper RPC functions
8. Registry submission workflow (1.1.2.28) - Workflow components
9. ATC Codes list (1.1.2.29) - MOH-only, simple list
10. Critical Medicines list (1.1.2.30) - MOH-only, simple list

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
- **Timing:** After completion
- **Focus:** Wireframe binding, component patterns, state management

### Emma (UI/UX + Next.js Frontend Specialist)
- **Action:** Review Next.js App Router implementation
- **Timing:** After completion
- **Focus:** Route structure, form patterns, validation

### Oliver (Backend Lead)
- **Action:** Verify RPC function usage
- **Timing:** As needed
- **Focus:** RPC function parameters, return formats

### Nadia (Database Specialist)
- **Action:** Verify database queries and RLS compliance
- **Timing:** As needed
- **Focus:** Query patterns, RLS policy verification

---

## Expected Deliverables

- All remaining RMM frontend pages and components
- Wireframe binding in all code files
- Role-based access control
- Integration with backend RPC functions
- Compliance documentation
- Implementation summaries with compliance sections

---

Please acknowledge receipt. Implementation will proceed sequentially.

Best regards,
Sami
Implementation Compliance Specialist
