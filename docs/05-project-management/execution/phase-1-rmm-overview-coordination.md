# Phase 1: RMM Overview Page - Team Coordination

**Date:** 2026-01-25  
**Coordinator:** Sami (Implementation Compliance Specialist)  
**Status:** 🟡 In Progress  
**Priority:** 🔴 Critical

---

## Pre-Task Compliance Verification (Sami)

### ✅ Completed Checks
- [x] Wireframe read completely: `docs/04-design/user-experience/wireframes/01-rmm/overview/task-0.5.2.1-rmm-overview.md`
- [x] Database tables verified: `companies`, `products`, `skus`, `registry_submissions`, `enforcement_actions` exist
- [x] Seed data verified: Migrations applied (verified via `supabase migration list`)
- [x] Previous tasks complete: None (first critical task)
- [x] Wireframe binding comment format prepared

### ⚠️ Missing RPC Functions (Maya - Action Required)
- [ ] `rmm_get_statistics(user_id)` - Returns counts for companies/products/SKUs
- [ ] `rmm_get_recent_activity(user_id, limit)` - Returns recent activity timeline
- [ ] `rmm_get_enforcement_actions(user_id, company_id, limit)` - Returns active enforcement actions for company users
- [ ] `rmm_get_submission_deadlines(user_id)` - Returns upcoming submission deadlines with regulatory references

---

## Task Assignment

### Backend (Maya - Workflow/RPC Engineer)
**Priority:** 🔴 Critical  
**Estimated Effort:** 4-6 hours

**Required RPC Functions:**

1. **`rmm_get_statistics(user_id uuid)`**
   - Returns: `{ companies: { total, active, inactive }, products: { total, active, inactive }, skus: { total, active, inactive } }`
   - Role-based filtering: Company users see own company only, MOH see all
   - Tables: `companies`, `products`, `skus`
   - RLS: Must respect user permissions

2. **`rmm_get_recent_activity(user_id uuid, p_limit integer DEFAULT 10)`**
   - Returns: Array of activity entries with `{ type, description, entity_type, entity_id, timestamp, user_name }`
   - Sources: `approval_history`, `registry_submissions`, `companies`, `products`, `skus` updates
   - Role-based filtering: Company users see own company only
   - Order: Most recent first

3. **`rmm_get_enforcement_actions(user_id uuid, company_id uuid, p_limit integer DEFAULT 10)`**
   - Returns: Array of active enforcement actions with:
     - `action_type`, `legal_basis`, `appeal_deadline`, `appeal_window_open`, `required_action`, `status`, `amount`, `currency`
   - Filter: Only `status = 'executed'` or `status = 'appealed'`
   - Role-based: Company users see own company only
   - Table: `enforcement_actions`
   - Calculate appeal deadline from `executed_at` + 30 days (DMP regulation)

4. **`rmm_get_submission_deadlines(user_id uuid)`**
   - Returns: Array of upcoming deadlines with:
     - `submission_type`, `due_date`, `days_remaining`, `regulatory_reference`, `regulatory_description`
   - Calculate from submission schedule (may need `submission_schedules` table or hardcoded rules)
   - Regulatory references: DMP Art. 10, DMP Art. 12, etc.
   - Role-based: Company users see own deadlines only

**Compliance Requirements:**
- All RPCs must use RLS policies
- All RPCs must handle role-based filtering
- All RPCs must return proper error messages
- All RPCs must be idempotent

---

### Frontend (Emma - UI/UX + Next.js Frontend Specialist)
**Priority:** 🔴 Critical  
**Estimated Effort:** 12-16 hours  
**Depends on:** Maya's RPC functions complete

**Implementation Sections:**

1. **Statistics Cards (3-column grid)**
   - Companies, Products, SKUs cards
   - Each shows: Total, Active, Inactive counts
   - "View All" buttons
   - Loading skeletons
   - Error states

2. **Module Summary Card**
   - Description text
   - Styling: Light background (#f9fafb), padding 16px

3. **Quick Links Section**
   - Horizontal button group
   - Links: Companies, Products, SKUs, Submissions, ATC Codes, Critical Medicines, Enforcement
   - Role-based visibility
   - Responsive (wraps on mobile)

4. **Regulatory Compliance Status Section (Fatima's Requirement)**
   - Status badge: "✓ Compliant", "⚠️ Non-Compliant ([X] violations)", "🟡 Under Review"
   - Link to compliance status page
   - Prominent for Company users

5. **Active Enforcement Actions Section (Company Users Only - Fatima's Requirement)**
   - Only visible for Company users
   - List of active enforcement actions
   - Each shows: Type, Legal Basis, Appeal Deadline, Required Action, Status, Link
   - Urgency indicators (🔴 <7 days, 🟡 7-14 days)
   - Empty state when no actions

6. **Recent Activity Section**
   - Chronological list (last 5-10)
   - Each entry: Description + relative timestamp
   - "View Full History" link
   - Role-based filtering

7. **Registry Submissions Status Card (Fatima's Requirement)**
   - Metrics: Pending, Approved, Rejected counts
   - Submission deadlines list with:
     - Type, due date, days remaining, regulatory reference
     - Urgency indicators
   - "View All Submissions" button

**Compliance Requirements:**
- Wireframe binding: JSDoc comment with wireframe link
- Database binding: Document all tables/fields used
- No local mocks: All data from Supabase RPCs
- Role coverage: Company, MOH Tier 1, MOH Tier 2
- UI states: Loading, empty, error, success
- Responsive design: Desktop, tablet, mobile

---

### Testing (Hassan - QA/Assurance Engineer)
**Priority:** 🔴 Critical  
**Estimated Effort:** 4-6 hours  
**Depends on:** Emma's frontend complete

**Test Coverage:**
- [ ] RPC functions tested (Maya's work)
- [ ] Role-based filtering verified (Company, MOH Tier 1, MOH Tier 2)
- [ ] UI states tested (loading, empty, error, success)
- [ ] Responsive design tested (desktop, tablet, mobile)
- [ ] All wireframe sections present and functional
- [ ] Regulatory requirements met (Fatima's requirements)
- [ ] Accessibility tested (keyboard navigation, screen readers)

---

## Implementation Sequence

### Step 1: Backend RPC Functions (Maya)
1. Create migration file: `20260125000000_create_rmm_overview_rpc_functions.sql`
2. Implement `rmm_get_statistics`
3. Implement `rmm_get_recent_activity`
4. Implement `rmm_get_enforcement_actions`
5. Implement `rmm_get_submission_deadlines`
6. Test RPCs with different user roles
7. **Sami Verification:** RPCs comply with RLS, role filtering, error handling

### Step 2: Frontend Implementation (Emma)
1. Read wireframe completely
2. Create component structure
3. Implement Statistics Cards
4. Implement Module Summary Card
5. Implement Quick Links Section
6. Implement Regulatory Compliance Status Section
7. Implement Active Enforcement Actions Section
8. Implement Recent Activity Section
9. Implement Registry Submissions Status Card
10. Add wireframe binding comment
11. Add loading/empty/error states
12. Test responsive design
13. **Sami Verification:** Wireframe compliance, no mocks, role coverage

### Step 3: Testing (Hassan)
1. Test all RPC functions
2. Test role-based filtering
3. Test UI states
4. Test responsive design
5. Test accessibility
6. Verify regulatory requirements
7. **Sami Final Verification:** All compliance rules met

---

## Compliance Checklist (Sami - Before Task Completion)

- [ ] Wireframe binding: JSDoc comment added with wireframe link
- [ ] Database binding: All tables/fields documented, queries verified
- [ ] No local mocks: All data from Supabase RPCs
- [ ] Role coverage: Screenshots for Company, MOH Tier 1, MOH Tier 2
- [ ] UI states: Screenshots for loading, empty, error, success
- [ ] Route file index updated: `docs/02-architecture/frontend/route-file-index.md`
- [ ] All Fatima's requirements met (regulatory sections)
- [ ] All wireframe sections implemented
- [ ] Responsive design verified
- [ ] Accessibility verified

---

## Current Status

**Maya (Backend):** ⏳ Pending - Need to create RPC functions  
**Emma (Frontend):** ⏳ Waiting for Maya's RPC functions  
**Hassan (Testing):** ⏳ Waiting for Emma's frontend  
**Sami (Compliance):** ✅ Pre-task verification complete, coordinating team

---

## Next Actions

1. **Maya:** Create RPC functions migration (Priority: Immediate)
2. **Sami:** Verify RPC functions comply with requirements
3. **Emma:** Start frontend implementation after RPCs verified
4. **Hassan:** Prepare test cases based on wireframe requirements

---

**Coordination Started:** 2026-01-25  
**Target Completion:** 2026-01-27 (2 days)
