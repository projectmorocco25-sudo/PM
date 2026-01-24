# Tasks 1.1.2.16 to 1.1.2.30 Team Coordination - RMM Frontend Implementation

**Date:** 2026-01-23
**From:** Sami (Implementation Compliance Specialist)
**To:** Yasmine (Frontend Lead), Oliver (Backend Lead), Emma (UI/UX + Next.js Frontend Specialist), Nadia (Database Specialist)

---

## Subject: Proceeding with RMM Frontend Implementation

Team,

I am coordinating the implementation of **Tasks 1.1.2.16 through 1.1.2.30** for the RMM module frontend. These tasks implement all RMM frontend pages including layout, navigation, companies, products, SKUs, registry submissions, ATC codes, and critical medicines.

**⚠️ CRITICAL COMPLIANCE NOTE:** Task 1.1.2.16 (RMM module layout and navigation) **MUST BE FIRST** as all other pages depend on it.

---

## ✅ Prerequisites Verification

### Backend Tasks Completion
- ✅ **Tasks 1.1.2.1-1.1.2.15:** All RMM backend tasks complete
- ✅ **RMM RPC Functions:** All CRUD and workflow functions implemented
- ✅ **Helper Functions:** RMM helper functions (Task 1.1.2.3a) complete
- ✅ **Registry Submission Workflow:** All workflow functions complete

### Frontend Foundation
- ✅ **Core Layout:** Dashboard layout structure exists (Task 1.1.1.9)
- ✅ **Navigation:** Sidebar navigation structure exists
- ✅ **Authentication:** Auth pages implemented
- ✅ **Supabase Client:** Supabase integration configured

### Schema Verification
- ✅ All RMM tables exist (companies, products, skus, atc_codes, critical_medicines, registry_submissions)
- ✅ RLS policies are in place
- ✅ All required RPC functions exist

---

## 🎯 Tasks to Implement

### Task 1.1.2.16: Create RMM module layout and navigation ⚠️ **MUST BE FIRST**
- **Route:** `/rmm` layout
- **Wireframes:** task-0.5.1.14, task-0.5.1.16
- **Dependencies:** Core layout (Task 1.1.1.9)
- **API:** `shared_get_user_permissions()`

### Companies Pages (Tasks 1.1.2.17-1.1.2.19, 1.1.2.18a)
- **Task 1.1.2.17:** Companies list page (`/rmm/companies`)
- **Task 1.1.2.18:** Company detail page (`/rmm/companies/[id]`)
- **Task 1.1.2.18a:** Company products page (`/rmm/companies/[id]/products`)
- **Task 1.1.2.19:** Company create/edit forms (`/rmm/companies/new`, `/rmm/companies/[id]/edit`)

### Products Pages (Tasks 1.1.2.20-1.1.2.22)
- **Task 1.1.2.20:** Products list page (`/rmm/products`)
- **Task 1.1.2.21:** Product detail page (`/rmm/products/[id]`)
- **Task 1.1.2.22:** Product create/edit forms (`/rmm/products/new`, `/rmm/products/[id]/edit`)

### SKUs Pages (Tasks 1.1.2.23-1.1.2.25)
- **Task 1.1.2.23:** SKUs list page (`/rmm/skus`)
- **Task 1.1.2.24:** SKU detail page (`/rmm/skus/[id]`)
- **Task 1.1.2.25:** SKU create/edit forms (`/rmm/skus/new`, `/rmm/skus/[id]/edit`)

### Registry Submission Pages (Tasks 1.1.2.26-1.1.2.28)
- **Task 1.1.2.26:** Registry submission list page (`/rmm/submissions`)
- **Task 1.1.2.27:** Registry submission detail page (`/rmm/submissions/[id]`)
- **Task 1.1.2.28:** Registry submission workflow actions (modal/components)

### MOH-Only Pages (Tasks 1.1.2.29-1.1.2.30)
- **Task 1.1.2.29:** ATC Codes list page (`/rmm/atc-codes`) - MOH only
- **Task 1.1.2.30:** Critical Medicines list page (`/rmm/critical-medicines`) - MOH only

---

## 📋 Implementation Plan

### Phase 1: Foundation (Task 1.1.2.16)
1. **Task 1.1.2.16:** Create RMM module layout and navigation
   - Create `/app/(dashboard)/rmm/layout.tsx`
   - Implement RMM-specific sidebar navigation
   - Role-based navigation items
   - Integration with core dashboard layout

### Phase 2: Companies (Tasks 1.1.2.17-1.1.2.19, 1.1.2.18a)
2. **Task 1.1.2.17:** Companies list page
3. **Task 1.1.2.18:** Company detail page
4. **Task 1.1.2.18a:** Company products page
5. **Task 1.1.2.19:** Company create/edit forms

### Phase 3: Products (Tasks 1.1.2.20-1.1.2.22)
6. **Task 1.1.2.20:** Products list page
7. **Task 1.1.2.21:** Product detail page
8. **Task 1.1.2.22:** Product create/edit forms

### Phase 4: SKUs (Tasks 1.1.2.23-1.1.2.25)
9. **Task 1.1.2.23:** SKUs list page
10. **Task 1.1.2.24:** SKU detail page
11. **Task 1.1.2.25:** SKU create/edit forms

### Phase 5: Registry Submissions (Tasks 1.1.2.26-1.1.2.28)
12. **Task 1.1.2.26:** Registry submission list page
13. **Task 1.1.2.27:** Registry submission detail page
14. **Task 1.1.2.28:** Registry submission workflow actions

### Phase 6: MOH-Only Pages (Tasks 1.1.2.29-1.1.2.30)
15. **Task 1.1.2.29:** ATC Codes list page
16. **Task 1.1.2.30:** Critical Medicines list page

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
- **Timing:** After each task completion
- **Focus:** Wireframe binding, component patterns, state management

### Emma (UI/UX + Next.js Frontend Specialist)
- **Action:** Review Next.js App Router implementation and routing structure
- **Timing:** After layout task (1.1.2.16) and periodically
- **Focus:** Route structure, layout integration, navigation patterns

### Oliver (Backend Lead)
- **Action:** Verify RPC function usage and API integration
- **Timing:** As needed for API questions
- **Focus:** RPC function parameters, return formats, error handling

### Nadia (Database Specialist)
- **Action:** Verify database queries and RLS policy compliance
- **Timing:** As needed for data access questions
- **Focus:** Query patterns, RLS policy verification, data access

---

## 📝 Missing RPC Functions

The following RPC functions are referenced in tasks but may need to be created:
- `rmm_list_submissions()` - For Task 1.1.2.26
- `rmm_get_submission()` - For Task 1.1.2.27
- `rmm_get_approval_history()` - For Task 1.1.2.27

**Action Required:** Verify these functions exist or create them before frontend implementation.

---

## Expected Deliverables

- All RMM frontend pages and components
- Wireframe binding in all code files
- Role-based access control
- Integration with backend RPC functions
- Compliance documentation for each task
- Implementation summaries with compliance sections

---

Please acknowledge receipt. Implementation will proceed sequentially starting with Task 1.1.2.16 (RMM layout and navigation).

Best regards,
Sami
Implementation Compliance Specialist
