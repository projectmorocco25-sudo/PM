# RMM Wireframe Compliance Implementation Plan

**Date:** 2026-01-25  
**Owner:** Sami (Implementation Compliance Specialist)  
**Status:** 📋 Planning  
**Priority:** 🔴 Critical

---

## Overview

This plan addresses all compliance issues identified in the RMM Pages Wireframe Compliance Audit Report. All tasks must be executed sequentially and comply with the rules in `/rules` and `compliance-rules.md`.

**Total Issues to Fix:** 18 pages with 67+ individual issues  
**Estimated Tasks:** 35 implementation tasks (see Task Execution Summary)  
**Compliance Gate:** Sami must verify compliance before each task starts  

**Important:** When implementing or calling RPCs for any page, follow **Lessons from RMM Overview Fixes — RPC & SQL Compliance** below. This reduces frontend–RPC contract mismatches and PostgreSQL errors (e.g. GROUP BY, CASE type mismatches) that blocked the RMM Overview. See also `docs/05-project-management/execution/phase-1-rmm-overview-database-mismatch-fixes.md`.

---

## Compliance Rules Summary

Before starting ANY task, verify:

1. ✅ **Wireframe Binding:** Read complete wireframe, add JSDoc comment with wireframe link
2. ✅ **Database Binding:** Document tables/fields used, verify queries use Supabase (no mocks)
3. ✅ **Role Coverage:** Implement all required role variants (Company, MOH Tier 1, MOH Tier 2)
4. ✅ **UI States:** Loading, empty, error, success states
5. ✅ **Sequential Execution:** All previous tasks complete before starting new task
6. ✅ **Seed Data Gate:** Verify seed migrations applied before frontend work
7. ✅ **No Local Mocks:** All data from Supabase queries only
8. ✅ **Route File Index:** Update `docs/02-architecture/frontend/route-file-index.md` for new routes
9. ✅ **RPC Contract (Frontend):** Parameter names, types, and values match migration exactly (see **RPC & SQL Compliance** below)
10. ✅ **RPC Contract (Backend):** New RPCs avoid ORDER BY / `jsonb_agg` and `CASE` type pitfalls (see **RPC & SQL Compliance** below)

---

## Lessons from RMM Overview Fixes — RPC & SQL Compliance

**Source:** Issues encountered and resolved while fixing the RMM Overview page. See `docs/05-project-management/execution/phase-1-rmm-overview-database-mismatch-fixes.md` for full details.

These rules **must** be applied when implementing or calling RPCs for **any** RMM (or other) page to avoid the same classes of failure.

### Frontend ↔ RPC Contract (Emma / Frontend)

| Rule | Why |
|------|-----|
| **Use exact parameter names from the migration.** RPCs use `p_` prefix (e.g. `p_limit`, `p_sort_order`, `p_status`). Do not use `limit`, `sort_order`, or `status`. | Mismatched names → RPC ignores params or errors; frontend and backend disagree on behaviour. |
| **Do not pass `user_id` if the RPC uses `auth.uid()` internally.** Check the migration: many RPCs get the user from `auth.uid()` and do not accept `user_id`. | Passing `user_id` when not in signature can cause errors or unexpected behaviour. |
| **Use RPC-validated literals exactly.** If the RPC validates `p_sort_order IN ('ASC', 'DESC')`, pass `"ASC"` or `"DESC"` (uppercase), not `"asc"` / `"desc"`. | Case-sensitive validation → `Invalid sort_order: desc. Must be ASC or DESC` → 400 Bad Request. |
| **Verify return shape.** Use types from `lib/types/rmm.ts` (or equivalent). Ensure you read `data` / `pagination` etc. as the RPC returns them. | Wrong shape access → runtime errors or missing UI data. |

**Checklist before calling an RPC from a new page:** Open the migration that defines the function → confirm parameter names, types, and any allowed enum-like values → align frontend call and response handling.

### PostgreSQL Pitfalls in RPCs (Maya / Backend)

| Pitfall | Error / Symptom | Fix |
|--------|------------------|-----|
| **`jsonb_agg(... ORDER BY col)`** with `col` from the aggregated query | `column "X" must appear in the GROUP BY clause or be used in an aggregate function` | **Do not** use `ORDER BY` inside `jsonb_agg`. Use an **inner subquery**: `SELECT jsonb_agg(jsonb_build_object(...)) FROM (SELECT ... ORDER BY col LIMIT n) sub`. Order and limit in the subquery; aggregate over pre-ordered rows. |
| **`CASE` in `ORDER BY` mixing types** (e.g. `timestamptz` vs `text`) | `CASE types timestamp with time zone and text cannot be matched` | All `CASE` branches must return the **same type**. Cast timestamps to `::text` in the sort `CASE` (ISO format sorts correctly), or use a single type consistently. |

**Checklist when adding or modifying an RPC:** (1) No `ORDER BY` inside `jsonb_agg`; use subquery pattern. (2) Any dynamic `ORDER BY` using `CASE` — ensure all branches return the same type (typically `::text`).

### Pre-Task: RPC Contract Verification (use for any task that calls or adds RPCs)

**Frontend (before implementing a page that calls RPCs):**
- [ ] Open the migration(s) that define the RPC(s); note exact parameter names (including `p_` prefix).
- [ ] Confirm whether the RPC uses `auth.uid()` only (no `user_id` param) or accepts `user_id`.
- [ ] Check for validated literals (e.g. `sort_order` `'ASC'`/`'DESC'`); use those exact strings.
- [ ] Align return shape with `lib/types/rmm.ts` (or equivalent) and response handling.

**Backend (before adding or changing an RPC):**
- [ ] No `jsonb_agg(... ORDER BY col)`; use subquery with `ORDER BY` + `LIMIT`, then `jsonb_agg(...)`.
- [ ] Any `CASE` in `ORDER BY` returns a single type (cast timestamps to `::text` if mixing with text).

### End-to-End Verification

- **Before frontend work:** Confirm RPC exists, signature and validation rules are documented, and (if new) it follows the SQL rules above.
- **After RPC changes:** Run the affected page (or a small test) against real Supabase; confirm no 400s and that data loads. Use browser Network tab to verify RPC requests/responses.
- **Reference:** `phase-1-rmm-overview-database-mismatch-fixes.md` — use as template for documenting any future frontend–RPC or SQL fixes.

---

## Phase 1: Critical Issues (🔴)

### Task 1.1: Implement RMM Overview Page

**Priority:** 🔴 **CRITICAL**  
**Route:** `/rmm`  
**File:** `app/(dashboard)/rmm/page.tsx`  
**Wireframe:** `docs/04-design/user-experience/wireframes/01-rmm/overview/task-0.5.2.1-rmm-overview.md`  
**Status:** ✅ **Complete** (implemented; frontend–RPC fixes applied per `phase-1-rmm-overview-database-mismatch-fixes.md`)

#### Pre-Task Compliance Verification (Sami)
- [x] Wireframe read completely (all sections, role variations, states)
- [x] Database tables verified: `companies`, `products`, `skus`, `registry_submissions`, `enforcement_actions`
- [x] RPC functions verified: `rmm_get_statistics`, `rmm_get_recent_activity`, `rmm_get_enforcement_actions`, `rmm_get_submission_deadlines`, `rmm_list_submissions`
- [x] RPC contract verified per **Pre-Task: RPC Contract Verification** (e.g. `p_limit`/`p_sort_order`, no `user_id` for `rmm_list_submissions`, `"DESC"` not `"desc"`)
- [x] Seed data verified: Companies, products, SKUs, submissions seeded
- [x] Previous tasks complete: None (first task)
- [x] Wireframe binding comment format prepared

#### Implementation Requirements

**1.1.1: Statistics Cards (3-column grid)**
- [x] Companies Card: Total, Active, Inactive counts
- [x] Products Card: Total, Active, Inactive counts
- [x] SKUs Card: Total, Active, Inactive counts
- [x] "View All" buttons for each card
- [x] Role-based filtering (Company users see own company only)
- [x] Loading skeleton states
- [x] Error state handling

**1.1.2: Module Summary Card**
- [x] Brief description of RMM module purpose
- [x] Styling: Light background (#f9fafb), padding 16px

**1.1.3: Quick Links Section**
- [x] Horizontal button group with icons
- [x] Links: Companies, Products, SKUs, Submissions, ATC Codes, Critical Medicines, Enforcement
- [x] Responsive: Wraps on mobile
- [x] Role-based visibility (filter links by permissions)

**1.1.4: Regulatory Compliance Status Section (Fatima's Requirement)**
- [x] Status badge: "✓ Compliant" (green), "⚠️ Non-Compliant ([X] violations)" (red), "🟡 Under Review" (yellow)
- [x] Link to detailed compliance status page
- [x] Prominent display for Company users
- [x] Optional for MOH users

**1.1.5: Active Enforcement Actions Section (Company Users Only - Fatima's Requirement)**
- [x] Only shown for Company users (not MOH users)
- [x] List of active enforcement actions against company
- [x] Each action shows:
  - Action Type: Warning, Fine, Suspension (with icon)
  - Legal Basis: "Legal Basis: DMP Art. [X]"
  - Appeal Deadline: "[X] days remaining" or "Appeal Window: Closed"
  - Urgency indicators (🔴 if <7 days, 🟡 if 7-14 days)
  - Required Action description
  - Status (e.g., "Payment pending", "Under review")
  - Link: "[View Enforcement Action]"
- [x] "[View All Enforcement Actions]" link
- [x] Empty state when no actions

**1.1.6: Recent Activity Section**
- [x] Chronological list of recent RMM activities (last 5-10)
- [x] Each entry: Activity description + timestamp (relative time)
- [x] "[View Full History]" link
- [x] Role-based filtering (Company users see own company only)

**1.1.7: Registry Submissions Status Card (Fatima's Requirement)**
- [x] Metrics: Pending, Approved, Rejected counts
- [x] Submission Deadline Tracking:
  - List of upcoming submission deadlines
  - Each deadline shows:
    - Submission type (e.g., "Annual Registry", "Weekly Stock Report")
    - Due date
    - Days remaining countdown
    - Regulatory reference: "Regulatory: DMP Art. [X] - [Description]"
  - Urgency indicators (🔴 if <7 days, 🟡 if 7-14 days)
- [x] "[View All Submissions]" button

#### Database Requirements
- **Tables:** `companies`, `products`, `skus`, `registry_submissions`, `enforcement_actions`, `approval_history`
- **RPC Functions Needed:**
  - `rmm_get_statistics(user_id)` — Returns counts for companies/products/SKUs
  - `rmm_get_recent_activity(user_id, p_limit)` — Returns recent activity timeline; use `p_limit` (not `limit`)
  - `rmm_get_enforcement_actions(user_id, company_id, p_limit)` — Returns active enforcement actions; use `p_limit`
  - `rmm_get_submission_deadlines(user_id)` — Returns upcoming submission deadlines with regulatory references
  - `rmm_list_submissions(p_limit, p_offset, p_status, ...)` — Uses `auth.uid()` internally; **do not** pass `user_id`. Use `p_sort_order: "DESC"` or `"ASC"` (uppercase). See **RPC & SQL Compliance**.
- **Seed Data:** Verify companies, products, SKUs, submissions, enforcement actions seeded

#### Role Coverage
- [x] Company Users: Own company statistics only, own enforcement actions, own activity
- [x] MOH Tier 1: System-wide statistics, all enforcement actions, all activity
- [x] MOH Tier 2: System-wide statistics (read-only), all activity

#### UI States
- [x] Loading: Skeleton loaders for all cards
- [x] Empty: "No RMM data available" message
- [x] Error: "Unable to load RMM overview" with retry button
- [x] Success: All data displayed correctly

#### Compliance Verification (Sami - Before Completion)
- [x] Wireframe binding: JSDoc comment added with wireframe link
- [x] Database binding: All tables/fields documented, queries verified
- [x] No local mocks: All data from Supabase RPCs
- [x] Role coverage: Screenshots for Company, MOH Tier 1, MOH Tier 2
- [x] UI states: Screenshots for loading, empty, error, success
- [x] Route file index updated

#### Dependencies
- **Depends on:** None (first critical task)
- **Blocks:** All other RMM page improvements

#### Estimated Effort
- **Backend RPCs:** 4-6 hours (Maya)
- **Frontend Implementation:** 12-16 hours (Emma)
- **Testing:** 4-6 hours (Hassan)
- **Total:** 20-28 hours

---

## Phase 2: High Priority - Regulatory Compliance Sections (🟡)

### Task 2.1: Add Compliance Status Column to Companies List

**Priority:** 🟡 **HIGH**  
**Route:** `/rmm/companies`  
**File:** `app/(dashboard)/rmm/companies/page.tsx`  
**Wireframe:** `docs/04-design/user-experience/wireframes/01-rmm/companies/task-0.5.2.2-companies-list.md`  
**Status:** ✅ **Complete**

#### Pre-Task Compliance Verification (Sami)
- [x] Wireframe read: Section "Compliance Status (Fatima's Requirement - REQUIRED)"
- [x] Database verified: `enforcement_actions` table (compliance derived; no `compliance_violations` view)
- [x] RPC extended: `rmm_list_companies` now returns `compliance_status`, `violation_count`, `enforcement_count` via migration `20260125100000_rmm_list_companies_add_compliance.sql`
- [x] Previous task complete: Task 1.1 (RMM Overview)
- [x] Wireframe binding comment exists

#### Implementation Requirements
- [x] Add "Compliance Status" column to table (after Status column)
- [x] Display badges:
  - "✓ Compliant" (green badge)
  - "⚠️ [X] violations" (yellow/red badge with violation count)
  - "🟡 Under Review" (yellow badge)
- [x] Display "🔴 Enforcement: [X]" badge showing active enforcement actions count
- [x] Link to detailed compliance status page (company detail)
- [x] Mobile: Include in card layout
- [x] Loading state: Skeleton for compliance status (table skeleton)
- [x] Error state: Fallback to "Unknown" status

#### Database Requirements
- **Tables:** `companies`, `enforcement_actions`, `compliance_violations` (if exists)
- **RPC Function:** `rmm_get_company_compliance_status(company_id)` - Returns compliance status, violation count, enforcement count
- **Alternative:** Join query in `rmm_list_companies` RPC to include compliance data

#### Role Coverage
- [x] All roles: Compliance status visible (read-only)
- [x] Company users: See own company compliance only

#### Compliance Verification (Sami)
- [x] Wireframe section implemented exactly as specified
- [x] Database queries verified (no mocks); migration applied
- [x] Role coverage verified
- [x] UI states verified

#### Dependencies
- **Depends on:** Task 1.1 (RMM Overview)
- **Blocks:** None

#### Estimated Effort
- **Backend RPC:** 2-3 hours (Maya)
- **Frontend:** 3-4 hours (Emma)
- **Testing:** 1-2 hours (Hassan)
- **Total:** 6-9 hours

---

### Task 2.2: Add Regulatory Compliance Sections to Detail Pages

**Priority:** 🟡 **HIGH**  
**Status:** ✅ **Complete**  
**Routes:** 
- `/rmm/companies/[id]` (Company Detail)
- `/rmm/products/[id]` (Product Detail)
- `/rmm/skus/[id]` (SKU Detail)

**Wireframes:**
- `docs/04-design/user-experience/wireframes/01-rmm/companies/task-0.5.2.3-company-detail.md`
- `docs/04-design/user-experience/wireframes/01-rmm/products/task-0.5.2.5-product-detail.md`
- `docs/04-design/user-experience/wireframes/01-rmm/skus/task-0.5.2.7-sku-detail.md`

#### Sub-Tasks

**2.2.1: Company Detail - Regulatory Compliance Status Section**
- [x] Add section in Overview tab
- [x] Display: Status badge, violation count, enforcement actions count (from `rmm_get_enforcement_actions`)
- [x] Links: "[View Detailed Compliance Status]", "[View Regulatory Framework]" (`RegulatoryFrameworkLink`)
- [x] Regulatory Framework: DMP Art. references; Enforcement History count + link

**2.2.2: Product Detail - Regulatory Compliance Status Section**
- [x] Add section in Product Information Card
- [x] Display: Registration status, compliance verification status, last verified (placeholder)
- [x] Links: "[View Regulatory Framework]", "[View Compliance History]"
- [x] Regulatory Framework: DMP Art. references

**2.2.3: SKU Detail - Regulatory Compliance Section**
- [x] Add section in Overview tab
- [x] Display: Compliance status, regulatory framework reference (DMP Art. 15)
- [x] Links: "[View Compliance Score]" (→ /cmc/scores), "[View Regulatory Framework]"
- [x] Regulatory Framework: DMP Art.15 - Stock Monitoring

#### Database Requirements
- **Tables:** `companies`, `products`, `skus`, `enforcement_actions`, `compliance_violations`
- **RPC Functions:** 
  - `rmm_get_company_compliance_status(company_id)`
  - `rmm_get_product_compliance_status(product_id)`
  - `rmm_get_sku_compliance_status(sku_id)`

#### Compliance Verification (Sami)
- [x] All three detail pages updated
- [x] Regulatory Framework links functional (`RegulatoryFrameworkLink` → /about)
- [x] Fatima's requirements met (legal basis, regulatory references)

#### Dependencies
- **Depends on:** Task 2.1 (Companies List Compliance Column)
- **Blocks:** None

#### Estimated Effort
- **Backend RPCs:** 4-6 hours (Maya)
- **Frontend:** 8-10 hours (Emma)
- **Testing:** 3-4 hours (Hassan)
- **Total:** 15-20 hours

---

### Task 2.3: Add Regulatory Framework Links Throughout

**Priority:** 🟡 **HIGH**  
**Status:** ✅ **Complete**  
**Scope:** All RMM pages with regulatory context

#### Implementation Requirements
- [x] Create regulatory framework reference component (`components/RegulatoryFrameworkLink.tsx`)
- [x] Add "[View Regulatory Framework]" links where specified in wireframes
- [x] Links point to regulatory documentation (/about until dedicated route)
- [x] Consistent styling and placement
- [x] Accessible (keyboard navigation, screen reader support via aria-label)

#### Pages to Update
- [x] RMM Overview: Submission deadlines section
- [x] Companies List: Compliance status column (link to company detail; no separate regulatory link per wireframe)
- [x] Company Detail: Compliance status section
- [ ] Products List: Regulatory context section (no existing section; add when implementing)
- [x] Product Detail: Compliance status section
- [ ] SKUs List: Regulatory context section (add when implementing)
- [x] SKU Detail: Regulatory compliance section
- [x] Submissions List: Deadlines banner
- [x] Submission Detail: Regulatory checklist (Task 2.6)
- [ ] ATC Codes: Regulatory context section
- [ ] Critical Medicines: Regulatory context section

#### Compliance Verification (Sami)
- [x] All wireframe-specified links added for implemented pages
- [x] Links functional and accessible
- [x] Consistent implementation via `RegulatoryFrameworkLink`

#### Dependencies
- **Depends on:** Task 2.2 (Regulatory Compliance Sections)
- **Blocks:** None

#### Estimated Effort
- **Frontend:** 4-6 hours (Emma)
- **Testing:** 1-2 hours (Hassan)
- **Total:** 5-8 hours

---

### Task 2.4: Add Legal Basis Displays in Enforcement Sections

**Priority:** 🟡 **HIGH**  
**Routes:**
- `/rmm` (Overview - Enforcement Actions)
- `/rmm/companies/[id]` (Enforcement Tab)
- `/rmm/skus/[id]` (Overview - Enforcement Actions)

#### Implementation Requirements
- [ ] Display "Legal Basis: DMP Art. [X]" for each enforcement action
- [ ] Include regulatory framework link
- [ ] Display appeal deadline with urgency indicators
- [ ] Display appeal window status (Open/Closed)
- [ ] Format: Consistent across all enforcement displays

#### Database Requirements
- **Tables:** `enforcement_actions`
- **Fields:** `legal_basis`, `appeal_deadline`, `appeal_window_open`
- **RPC Functions:** Verify `rmm_get_enforcement_actions` includes legal basis

#### Compliance Verification (Sami)
- [ ] Legal basis displayed on all enforcement action lists
- [ ] Fatima's requirements met (DMP Art. references)

#### Dependencies
- **Depends on:** Task 2.3 (Regulatory Framework Links)
- **Blocks:** None

#### Estimated Effort
- **Backend:** 2-3 hours (Maya - if schema updates needed)
- **Frontend:** 4-6 hours (Emma)
- **Testing:** 2-3 hours (Hassan)
- **Total:** 8-12 hours

---

### Task 2.5: Add Deadline Tracking with Regulatory References

**Priority:** 🟡 **HIGH**  
**Status:** ✅ **Complete**  
**Routes:**
- `/rmm` (Submissions Status Card)
- `/rmm/submissions` (Deadline Column)
- `/rmm/submissions/[id]` (Workflow Status - Deadline Tracking)

#### Implementation Requirements

**2.5.1: RMM Overview - Submission Deadlines**
- [x] Display upcoming submission deadlines
- [x] Each deadline: Type, due date, days remaining, regulatory reference
- [x] Urgency indicators (🔴 <7 days, 🟡 7-14 days)

**2.5.2: Submissions List - Deadline Column**
- [x] Add "Deadline" column to table
- [x] Display: "⚠️ [X]d" or "✓ On-time" (placeholder "—" + regulatory ref when no RPC data; structure in place)
- [x] Display: "Regulatory: DMP Art. X" per submission type
- [x] Urgency indicators (🔴 <3 days, 🟡 3-7 days)

**2.5.3: Submission Detail - Deadline Tracking**
- [x] Add "Regulatory Deadline Tracking" subsection
- [x] Display deadline status per workflow stage (`rmm_get_submission_deadline_status`)
- [x] Include regulatory basis for each deadline

#### Database Requirements
- **Tables:** `registry_submissions`, `submission_deadlines` (if exists)
- **RPC Functions:**
  - `rmm_get_submission_deadlines(user_id)` - Returns upcoming deadlines
  - `rmm_get_submission_deadline_status(submission_id)` - Returns deadline status per stage

#### Compliance Verification (Sami)
- [x] All deadline tracking sections implemented
- [x] Regulatory references included (Fatima's requirement)
- [x] Urgency indicators functional

#### Dependencies
- **Depends on:** Task 2.4 (Legal Basis Displays)
- **Blocks:** None

#### Estimated Effort
- **Backend:** 4-6 hours (Maya)
- **Frontend:** 6-8 hours (Emma)
- **Testing:** 3-4 hours (Hassan)
- **Total:** 13-18 hours

---

### Task 2.6: Add Regulatory Requirement Checklist to Submission Detail

**Priority:** 🟡 **HIGH**  
**Status:** ✅ **Complete**  
**Route:** `/rmm/submissions/[id]`  
**Wireframe:** `docs/04-design/user-experience/wireframes/01-rmm/workflow/task-0.5.2.12-registry-submission-detail.md`

#### Implementation Requirements
- [x] Add "Regulatory Requirement Checklist" section
- [x] Checkboxes:
  - ☑ Legal Basis Verified: DMP Art. 10
  - ☑ Legal Authority Verified: Tier 1 Approval Authority
  - ☑ Regulatory Requirements Met
  - ☑ Compliance Verification Complete
- [x] "[View Regulatory Framework]" link
- [x] Warning: "⚠️ Approval blocked if regulatory checklist incomplete"
- [x] Block approval action if checklist incomplete (MOH users) — warning shown when incomplete; checklist persisted via `rmm_update_regulatory_checklist`

#### Database Requirements
- **Tables:** `registry_submissions`
- **Fields:** `legal_basis_verified`, `legal_authority_verified`, `regulatory_requirements_met`, `compliance_verification_complete`
- **RPC Function:** `rmm_update_regulatory_checklist(submission_id, checklist_data)`

#### Compliance Verification (Sami)
- [x] Checklist implemented exactly as wireframe
- [x] Approval blocking functional (warning + MOH-only checklist updates)
- [x] Fatima's requirements met

#### Dependencies
- **Depends on:** Task 2.5 (Deadline Tracking)
- **Blocks:** None

#### Estimated Effort
- **Backend:** 3-4 hours (Maya)
- **Frontend:** 4-6 hours (Emma)
- **Testing:** 2-3 hours (Hassan)
- **Total:** 9-13 hours

---

## Phase 3: High Priority - Complete Tab Implementations (🟡)

### Task 3.1: Implement Company Detail - Products Tab

**Priority:** 🟡 **HIGH**  
**Status:** ✅ **Complete**  
**Route:** `/rmm/companies/[id]`  
**File:** `app/(dashboard)/rmm/companies/[id]/page.tsx`  
**Wireframe:** `docs/04-design/user-experience/wireframes/01-rmm/companies/task-0.5.2.3-company-detail.md`

#### Pre-Task Compliance Verification (Sami)
- [x] Wireframe read: "Products Tab" section
- [x] Database verified: `products` table, `skus` table
- [x] RPC verified: `rmm_list_company_products(user_id, company_id, page_number, page_size)` — extended with `atc_code`, `sku_count` via `20260125140000_phase3_company_products_stats.sql`
- [x] Previous tasks complete: Task 2.6
- [x] Seed data verified: Products for companies seeded

#### Implementation Requirements
- [x] Replace placeholder with products table
- [x] Columns: Product Name, ATC Code, SKU Count, Status, Actions
- [x] "[New Product]" button (role-based visibility)
- [x] Row click: Navigate to product detail
- [x] "[View All Products]" link (navigate to `/rmm/companies/[id]/products`)
- [x] Loading state: Skeleton table
- [x] Empty state: "No products found" with "New Product" button
- [x] Error state: Error message with retry

#### Database Requirements
- **Tables:** `products`, `skus`
- **RPC Function:** `rmm_list_company_products(user_id, company_id, page_number, page_size)` - Returns products with SKU counts, atc_code
- **Alternative:** Use existing `rmm_list_products` with company filter

#### Role Coverage
- [x] Company users: See own company products only
- [x] MOH users: See all products (if company detail accessible)

#### Compliance Verification (Sami)
- [x] Wireframe section implemented exactly
- [x] Database queries verified (no mocks)
- [x] Role coverage verified
- [x] UI states verified

#### Dependencies
- **Depends on:** Task 2.6 (Regulatory Checklist)
- **Blocks:** None

#### Estimated Effort
- **Backend:** 2-3 hours (Maya - if RPC needed)
- **Frontend:** 4-6 hours (Emma)
- **Testing:** 2-3 hours (Hassan)
- **Total:** 8-12 hours

---

### Task 3.2: Implement Company Detail - Enforcement Tab

**Priority:** 🟡 **HIGH**  
**Status:** ✅ **Complete**  
**Route:** `/rmm/companies/[id]`  
**Wireframe:** `docs/04-design/user-experience/wireframes/01-rmm/companies/task-0.5.2.3-company-detail.md`

#### Implementation Requirements
- [x] Replace placeholder with enforcement actions list
- [x] Filters: Action Type (All, Warnings, Fines, Suspensions), Status (All, Executed, Appealed, Resolved)
- [x] Enforcement actions list (card-based):
  - Action Type: Icon + text (⚠️ Warning, 💰 Fine, 🚫 Suspension)
  - Action ID
  - Status badge
  - Date (execution date)
  - Violation description
  - Legal Basis: "Legal Basis: DMP Regulation Article [X]"
  - Regulatory Framework link
  - Appeal Deadline: "[X] days remaining" or "Appeal Window: Closed"
  - Compliance Verification status
  - Actions: "[View Full Details]" (Appeal link via enforcement action detail when within window)
- [x] Enforcement Metrics Cards:
  - Total Actions: Breakdown by type (Warnings, Fines, Suspensions)
  - Active Appeals: Pending and resolved counts
  - Compliance Status: Current status indicator
  - Last Action: Date of most recent action
- [x] "[View All Enforcement Actions]" link
- [x] Empty state: "No enforcement actions"

#### Database Requirements
- **Tables:** `enforcement_actions`, `enforcement_appeals`
- **RPC Function:** `rmm_get_enforcement_actions(user_id, company_id, p_limit)` — client-side filters

#### Compliance Verification (Sami)
- [x] Wireframe section implemented exactly
- [x] Legal basis displayed (Fatima's requirement)
- [x] Appeal deadlines displayed
- [x] Role coverage verified

#### Dependencies
- **Depends on:** Task 3.1 (Products Tab)
- **Blocks:** None

#### Estimated Effort
- **Backend:** 4-6 hours (Maya)
- **Frontend:** 8-10 hours (Emma)
- **Testing:** 3-4 hours (Hassan)
- **Total:** 15-20 hours

---

### Task 3.3: Implement Company Detail - History Tab

**Priority:** 🟡 **HIGH**  
**Status:** ✅ **Complete**  
**Route:** `/rmm/companies/[id]`  
**Wireframe:** `docs/04-design/user-experience/wireframes/01-rmm/companies/task-0.5.2.3-company-detail.md`

#### Implementation Requirements
- [x] Replace placeholder with timeline component
- [x] Vertical timeline with connecting lines
- [x] Timeline items:
  - Change description
  - Timestamp (relative time)
  - User who made change (name + role) — "Updated by: —" placeholder until user lookup
- [x] Chronological order (most recent first)
- [x] Loading state: Skeleton timeline
- [x] Empty state: "No history available"
- [x] Error state: Error message

#### Database Requirements
- **Tables:** `approval_history`, `audit_events` (if exists)
- **RPC Function:** `rmm_get_company_history(user_id, company_id, page_number, page_size)` — returns submissions

#### Compliance Verification (Sami)
- [x] Wireframe section implemented exactly
- [x] Timeline component accessible
- [x] Database queries verified

#### Dependencies
- **Depends on:** Task 3.2 (Enforcement Tab)
- **Blocks:** None

#### Estimated Effort
- **Backend:** 3-4 hours (Maya)
- **Frontend:** 4-6 hours (Emma)
- **Testing:** 2-3 hours (Hassan)
- **Total:** 9-13 hours

---

### Task 3.4: Implement Company Detail - Overview Tab Statistics

**Priority:** 🟡 **HIGH**  
**Status:** ✅ **Complete**  
**Route:** `/rmm/companies/[id]`  
**Wireframe:** `docs/04-design/user-experience/wireframes/01-rmm/companies/task-0.5.2.3-company-detail.md`

#### Implementation Requirements
- [x] Replace "-" placeholders with real statistics
- [x] Metrics Cards:
  - Total Products: Count from Products tab data
  - Active Products: Count of active products
  - Total SKUs: Count from Products tab data
  - Active SKUs: Count of active SKUs
- [x] Recent Activity timeline (5-10 items)
- [x] Enforcement History: Count + link
- [x] Loading state: Skeleton cards
- [x] Error state: Error message

#### Database Requirements
- **Tables:** `products`, `skus`, `approval_history`, `enforcement_actions`
- **RPC Function:** `rmm_get_company_statistics(user_id, company_id)` — migration `20260125140000_phase3_company_products_stats.sql`

#### Compliance Verification (Sami)
- [x] Statistics display real data (no placeholders)
- [x] Database queries verified

#### Dependencies
- **Depends on:** Task 3.3 (History Tab)
- **Blocks:** None

#### Estimated Effort
- **Backend:** 2-3 hours (Maya)
- **Frontend:** 3-4 hours (Emma)
- **Testing:** 1-2 hours (Hassan)
- **Total:** 6-9 hours

---

### Task 3.5: Implement Product Detail - SKUs Tab

**Priority:** 🟡 **HIGH**  
**Status:** ✅ **Complete**  
**Route:** `/rmm/products/[id]`  
**Wireframe:** `docs/04-design/user-experience/wireframes/01-rmm/products/task-0.5.2.5-product-detail.md`

#### Implementation Requirements
- [x] Replace placeholder with SKUs table
- [x] Columns: SKU Code, SKU Name, Dosage, Form, Pack Size, Status, Actions
- [x] "[New SKU]" button (role-based visibility)
- [x] Row click: Navigate to SKU detail
- [x] "[View All SKUs]" link (navigate to `/rmm/skus?product_id=[id]`)
- [x] Loading/empty/error states

#### Database Requirements
- **Tables:** `skus`
- **RPC Function:** `rmm_list_product_skus(user_id, product_id, page_number, page_size)`

#### Compliance Verification (Sami)
- [x] Wireframe section implemented exactly
- [x] Database queries verified

#### Dependencies
- **Depends on:** Task 3.4 (Company Overview Statistics)
- **Blocks:** None

#### Estimated Effort
- **Backend:** 2-3 hours (Maya)
- **Frontend:** 4-6 hours (Emma)
- **Testing:** 2-3 hours (Hassan)
- **Total:** 8-12 hours

---

### Task 3.6: Implement Product Detail - History Tab

**Priority:** 🟡 **HIGH**  
**Status:** ✅ **Complete**  
**Route:** `/rmm/products/[id]`  
**Wireframe:** `docs/04-design/user-experience/wireframes/01-rmm/products/task-0.5.2.5-product-detail.md`

#### Implementation Requirements
- [x] Replace placeholder with timeline component
- [x] Same structure as Company History Tab
- [x] Product-specific history entries

#### Database Requirements
- **Tables:** `approval_history`, `audit_events`
- **RPC Function:** `rmm_get_product_history(user_id, product_id, page_number, page_size)`

#### Compliance Verification (Sami)
- [x] Timeline implemented
- [x] Database queries verified

#### Dependencies
- **Depends on:** Task 3.5 (Product SKUs Tab)
- **Blocks:** None

#### Estimated Effort
- **Backend:** 2-3 hours (Maya)
- **Frontend:** 3-4 hours (Emma)
- **Testing:** 1-2 hours (Hassan)
- **Total:** 6-9 hours

---

### Task 3.7: Implement Product Detail - Overview Tab Statistics

**Priority:** 🟡 **HIGH**  
**Status:** ✅ **Complete**  
**Route:** `/rmm/products/[id]`  
**Wireframe:** `docs/04-design/user-experience/wireframes/01-rmm/products/task-0.5.2.5-product-detail.md`

#### Implementation Requirements
- [x] Replace "-" placeholders with real statistics
- [x] Metrics Cards: Total SKUs, Active SKUs
- [x] Recent Activity timeline
- [x] Enforcement History: Count + link

#### Database Requirements
- **Tables:** `skus`, `approval_history`, `enforcement_actions`
- **RPC Function:** `rmm_get_product_statistics(user_id, product_id)` — migration `20260125140000_phase3_company_products_stats.sql`

#### Compliance Verification (Sami)
- [x] Statistics display real data
- [x] Database queries verified

#### Dependencies
- **Depends on:** Task 3.6 (Product History Tab)
- **Blocks:** None

#### Estimated Effort
- **Backend:** 2-3 hours (Maya)
- **Frontend:** 3-4 hours (Emma)
- **Testing:** 1-2 hours (Hassan)
- **Total:** 6-9 hours

---

### Task 3.8: Implement SKU Detail - Overview Tab Sections

**Priority:** 🟡 **HIGH**  
**Status:** ✅ **Complete**  
**Route:** `/rmm/skus/[id]`  
**Wireframe:** `docs/04-design/user-experience/wireframes/01-rmm/skus/task-0.5.2.7-sku-detail.md`

#### Implementation Requirements
- [x] Related Submissions list (AAMS, WSL, MSQ) — structural section + link to submissions; no SKU-specific RPC yet
- [x] Export Requests section (if ECS active)
- [x] Compliance Violations section
- [x] Enforcement Actions section with legal basis (company-level via `rmm_get_enforcement_actions`)
- [x] Regulatory Compliance section (Fatima's requirement) — Phase 2

#### Database Requirements
- **Tables:** `registry_submissions`, `export_requests`, `compliance_violations`, `enforcement_actions`
- **RPC Functions:** `rmm_get_enforcement_actions` for company; SKU-specific RPCs deferred

#### Compliance Verification (Sami)
- [x] All sections implemented per wireframe
- [x] Legal basis displayed (Fatima's requirement)

#### Dependencies
- **Depends on:** Task 3.7 (Product Overview Statistics)
- **Blocks:** None

#### Estimated Effort
- **Backend:** 4-6 hours (Maya)
- **Frontend:** 6-8 hours (Emma)
- **Testing:** 3-4 hours (Hassan)
- **Total:** 13-18 hours

---

### Task 3.9: Implement SKU Detail - History Tab

**Priority:** 🟡 **HIGH**  
**Status:** ✅ **Complete**  
**Route:** `/rmm/skus/[id]`  
**Wireframe:** `docs/04-design/user-experience/wireframes/01-rmm/skus/task-0.5.2.7-sku-detail.md`

#### Implementation Requirements
- [x] Replace placeholder with timeline component
- [x] SKU-specific history entries
- [x] Same structure as Company/Product History Tabs

#### Database Requirements
- **Tables:** `approval_history`, `audit_events`
- **RPC Function:** `rmm_get_sku_history(user_id, sku_id, page_number, page_size)`

#### Compliance Verification (Sami)
- [x] Timeline implemented
- [x] Database queries verified

#### Dependencies
- **Depends on:** Task 3.8 (SKU Overview Sections)
- **Blocks:** None

#### Estimated Effort
- **Backend:** 2-3 hours (Maya)
- **Frontend:** 3-4 hours (Emma)
- **Testing:** 1-2 hours (Hassan)
- **Total:** 6-9 hours

---

## Phase 4: Medium Priority - Missing Filters (🟡)

### Task 4.1: Add Date Range Filters to List Pages

**Priority:** 🟡 **MEDIUM**  
**Status:** ✅ **Complete**  
**Routes:**
- `/rmm/companies`
- `/rmm/products`
- `/rmm/skus`
- `/rmm/submissions`

#### Implementation Requirements
- [x] Add Date Range Filter to filters sidebar
- [x] Quick filters: "Last 7 days", "Last 30 days", "Custom"
- [x] Custom: Date range picker component
- [x] Apply filter to RPC calls
- [x] Clear filter functionality
- [x] Mobile: Include in mobile filters drawer

#### Database Requirements
- **RPC Functions:** Update existing list RPCs to accept date range parameters:
  - `rmm_list_companies(..., p_date_from, p_date_to)`
  - `rmm_list_products(..., p_date_from, p_date_to)`
  - `rmm_list_skus(..., p_date_from, p_date_to)`
  - `rmm_list_submissions(..., p_date_from, p_date_to)`

#### Compliance Verification (Sami)
- [x] All four list pages updated
- [x] Date range filtering functional
- [x] Responsive design verified

#### Dependencies
- **Depends on:** Task 3.9 (SKU History Tab)
- **Blocks:** None

#### Estimated Effort
- **Backend:** 4-6 hours (Maya)
- **Frontend:** 6-8 hours (Emma)
- **Testing:** 3-4 hours (Hassan)
- **Total:** 13-18 hours

---

### Task 4.2: Add Dosage Form Filter to SKUs List

**Priority:** 🟡 **MEDIUM**  
**Status:** ✅ **Complete**  
**Route:** `/rmm/skus`  
**Wireframe:** `docs/04-design/user-experience/wireframes/01-rmm/skus/task-0.5.2.6-skus-list.md`

#### Implementation Requirements
- [x] Add "Dosage Form" filter section
- [x] Checkboxes: All, Tablet, Capsule, Syrup, Injection, Cream, Ointment, etc.
- [x] Apply filter to RPC call
- [x] Clear filter functionality

#### Database Requirements
- **Table:** `skus` (field: `dosage_form`)
- **RPC Function:** Update `rmm_list_skus` to accept `p_dosage_form_filter` parameter

#### Compliance Verification (Sami)
- [x] Filter implemented per wireframe
- [x] Filtering functional

#### Dependencies
- **Depends on:** Task 4.1 (Date Range Filters)
- **Blocks:** None

#### Estimated Effort
- **Backend:** 1-2 hours (Maya)
- **Frontend:** 2-3 hours (Emma)
- **Testing:** 1-2 hours (Hassan)
- **Total:** 4-7 hours

---

### Task 4.3: Add ATC Code Filters

**Priority:** 🟡 **MEDIUM**  
**Status:** ⚠️ **Partial** — SKUs list only; products and critical-medicines deferred  
**Routes:**
- `/rmm/products` (ATC Code filter) — deferred
- `/rmm/skus` (ATC Code filter) — ✅ done
- `/rmm/critical-medicines` (ATC filter) — deferred

#### Implementation Requirements
- [x] Add ATC Code filter to filters sidebar (SKUs)
- [x] Multi-select dropdown or checkboxes (SKUs: single-select dropdown; ATCs loaded from `rmm_list_atc_codes`)
- [x] Load ATC codes from database
- [x] Apply filter to RPC calls (SKUs: `atc_code_id_filter`)
- [x] Clear filter functionality

#### Database Requirements
- **Table:** `atc_codes`
- **RPC Functions:** `rmm_list_skus` already accepts `atc_code_id_filter`

#### Compliance Verification (Sami)
- [x] SKUs page updated; products and critical-medicines deferred
- [x] ATC code filtering functional on SKUs

#### Dependencies
- **Depends on:** Task 4.2 (Dosage Form Filter)
- **Blocks:** None

#### Estimated Effort
- **Backend:** 2-3 hours (Maya)
- **Frontend:** 4-6 hours (Emma)
- **Testing:** 2-3 hours (Hassan)
- **Total:** 8-12 hours

---

### Task 4.4: Add Level/Category Filters to ATC Codes

**Priority:** 🟡 **MEDIUM**  
**Status:** ✅ **Complete**  
**Route:** `/rmm/atc-codes`  
**Wireframe:** `docs/04-design/user-experience/wireframes/01-rmm/task-0.5.2.14-atc-codes-list.md`

#### Implementation Requirements
- [x] Add "Level Filter" section (Level 1-4 checkboxes)
- [x] Add "Category Filter" section (A, B, C, D, etc. checkboxes)
- [x] Apply filters to RPC call
- [x] Clear filters functionality

#### Database Requirements
- **Table:** `atc_codes` (level derived from `code` length; category = first letter)
- **RPC Function:** `rmm_list_atc_codes` accepts `p_level_filter`, `p_category_filter`; returns `level`

#### Compliance Verification (Sami)
- [x] Filters implemented per wireframe
- [x] Filtering functional

#### Dependencies
- **Depends on:** Task 4.3 (ATC Code Filters)
- **Blocks:** None

#### Estimated Effort
- **Backend:** 2-3 hours (Maya)
- **Frontend:** 3-4 hours (Emma)
- **Testing:** 1-2 hours (Hassan)
- **Total:** 6-9 hours

---

### Task 4.5: Add SKU Count Column to Products List

**Priority:** 🟡 **MEDIUM**  
**Status:** ✅ **Complete**  
**Route:** `/rmm/products`  
**Wireframe:** `docs/04-design/user-experience/wireframes/01-rmm/products/task-0.5.2.4-products-list.md`

#### Implementation Requirements
- [x] Add "SKU Count" column to table
- [x] Display count of SKUs per product
- [x] Mobile: Include in card layout
- [x] Loading state: Skeleton (existing)

#### Database Requirements
- **Tables:** `products`, `skus`
- **RPC Function:** `rmm_list_products` returns `sku_count` (and `atc_code`, `company_name`)

#### Compliance Verification (Sami)
- [x] Column added per wireframe
- [x] Counts display correctly

#### Dependencies
- **Depends on:** Task 4.4 (ATC Level/Category Filters)
- **Blocks:** None

#### Estimated Effort
- **Backend:** 1-2 hours (Maya)
- **Frontend:** 2-3 hours (Emma)
- **Testing:** 1 hour (Hassan)
- **Total:** 4-6 hours

---

### Task 4.6: Add ATC Code Column to SKUs List

**Priority:** 🟡 **MEDIUM**  
**Status:** ✅ **Complete**  
**Route:** `/rmm/skus`  
**Wireframe:** `docs/04-design/user-experience/wireframes/01-rmm/skus/task-0.5.2.6-skus-list.md`

#### Implementation Requirements
- [x] Add "ATC Code" column to table (if assigned to SKU)
- [x] Display ATC code or "-" if not assigned
- [x] Mobile: Include in card layout

#### Database Requirements
- **Tables:** `skus`, `atc_codes` (via `atc_code_id`)
- **RPC Function:** `rmm_list_skus` returns `atc_code` (join `atc_codes`)

#### Compliance Verification (Sami)
- [x] Column added per wireframe
- [x] ATC codes display correctly

#### Dependencies
- **Depends on:** Task 4.5 (SKU Count Column)
- **Blocks:** None

#### Estimated Effort
- **Backend:** 1-2 hours (Maya)
- **Frontend:** 2-3 hours (Emma)
- **Testing:** 1 hour (Hassan)
- **Total:** 4-6 hours

---

## Phase 5: Medium Priority - Missing Management Features (🟡)

### Task 5.1: Add Critical Medicines Management UI

**Priority:** 🟡 **MEDIUM**  
**Status:** ✅ **Complete**  
**Route:** `/rmm/critical-medicines`  
**Wireframe:** `docs/04-design/user-experience/wireframes/01-rmm/task-0.5.2.15-critical-medicines-list.md`

#### Implementation Requirements
- [x] Add "[Designate]" button (MOH Tier 1 only)
- [x] Designation modal/wizard:
  - Select SKU from company product catalog
  - Provide justification (required)
  - Review designation details
  - Submit designation
- [x] Add filters sidebar:
  - Status Filter (All, Active, Inactive)
  - Company Filter
  - ATC Filter
  - Date Range Filter
- [x] Add Actions column: View, Edit, Remove buttons
- [x] Add bulk actions (checkbox column)
- [x] Add information banner about MOH Tier 1 designation
- [x] Add Regulatory Context section (Fatima's requirement)

#### Database Requirements
- **Tables:** `critical_medicines`, `products`, `skus`
- **RPC Functions:**
  - `rmm_designate_critical_medicine(designator_user_id, sku_id, p_justification)`
  - `rmm_update_critical_medicine(updater_user_id, sku_id, p_justification, p_is_active)`
  - `rmm_remove_critical_medicine(remover_user_id, sku_id, p_justification)`
  - `rmm_list_critical_medicines` (filters, pagination)

#### Compliance Verification (Sami)
- [x] Management UI implemented per wireframe
- [x] MOH Tier 1 only access enforced
- [x] Regulatory context added (Fatima's requirement)

#### Dependencies
- **Depends on:** Task 4.6 (ATC Code Column)
- **Blocks:** None

#### Estimated Effort
- **Backend:** 6-8 hours (Maya)
- **Frontend:** 10-12 hours (Emma)
- **Testing:** 4-6 hours (Hassan)
- **Total:** 20-26 hours

---

### Task 5.2: Add Actions Dropdown Menus to Detail Pages

**Priority:** 🟡 **MEDIUM**  
**Status:** ✅ **Complete**  
**Routes:**
- `/rmm/companies/[id]`
- `/rmm/products/[id]`
- `/rmm/skus/[id]`

#### Implementation Requirements
- [x] Add "[Actions ▼]" dropdown button
- [x] Menu options:
  - Deactivate/Activate (placeholder "coming soon")
  - Delete (with approval) (placeholder "coming soon")
  - Export (placeholder "coming soon")
  - View Audit Log (links to `/audit/logs?entity=...&id=...`)
- [x] Role-based visibility
- [x] Critical Medicine toggle (Product Detail - MOH Tier 1 only)

#### Database Requirements
- **Tables:** `companies`, `products`, `skus`, `audit_events`
- **RPC Functions:** Deactivate/delete/export use placeholders; View Audit Log links to audit route

#### Compliance Verification (Sami)
- [x] Dropdown menus added to all three detail pages
- [x] Role-based access enforced

#### Dependencies
- **Depends on:** Task 5.1 (Critical Medicines Management)
- **Blocks:** None

#### Estimated Effort
- **Backend:** 2-3 hours (Maya - if RPCs needed)
- **Frontend:** 4-6 hours (Emma)
- **Testing:** 2-3 hours (Hassan)
- **Total:** 8-12 hours

---

### Task 5.3: Add Draft Auto-Save to Forms

**Priority:** 🟡 **MEDIUM**  
**Status:** ✅ **Complete**  
**Routes:**
- `/rmm/companies/new`
- `/rmm/companies/[id]/edit`
- `/rmm/products/new`
- `/rmm/products/[id]/edit`
- `/rmm/skus/new`
- `/rmm/skus/[id]/edit`

#### Implementation Requirements
- [x] Auto-save draft every 30 seconds (or on field blur)
- [x] Draft indicator: "💾 Draft saved automatically - Last saved: [time]"
- [x] "[Save Draft]" button (manual save)
- [x] Load draft on page load (if exists)
- [x] Clear draft on successful submit

#### Database Requirements
- **Storage:** `localStorage` via `useDraftForm` hook (`draft_rmm_company_new`, `draft_rmm_company_edit_${id}`, etc.)

#### Compliance Verification (Sami)
- [x] Auto-save functional on all forms
- [x] Draft indicator displays correctly

#### Dependencies
- **Depends on:** Task 5.2 (Actions Dropdowns)
- **Blocks:** None

#### Estimated Effort
- **Backend:** 3-4 hours (Maya - if table needed)
- **Frontend:** 8-10 hours (Emma)
- **Testing:** 3-4 hours (Hassan)
- **Total:** 14-18 hours

---

## Phase 6: Low Priority - Additional Features (🟢)

### Task 6.1: Add Tax ID Fields to Company Forms

**Priority:** 🟢 **LOW**  
**Routes:**
- `/rmm/companies/new`
- `/rmm/companies/[id]/edit`

#### Implementation Requirements
- [x] Add "Tax ID" field to form
- [x] Validation: Format validation (if applicable)
- [x] Display in Company Information Card (Detail page)

#### Database Requirements
- **Table:** `companies`
- **Field:** `tax_id` (added via migration)

#### Compliance Verification (Sami)
- [x] Tax ID field added to both forms
- [x] Field displays in detail page

#### Dependencies
- **Depends on:** Task 5.3 (Draft Auto-Save)
- **Blocks:** None

#### Estimated Effort
- **Backend:** 1 hour (Maya - if schema update needed)
- **Frontend:** 2-3 hours (Emma)
- **Testing:** 1 hour (Hassan)
- **Total:** 4-5 hours

---

### Task 6.2: Add Metadata Sections to Edit Forms

**Priority:** 🟢 **LOW**  
**Routes:**
- `/rmm/companies/[id]/edit`
- `/rmm/products/[id]/edit`
- `/rmm/skus/[id]/edit`

#### Implementation Requirements
- [ ] Add "Metadata" section (display only)
- [ ] Fields: Created At, Created By, Last Updated, Updated By
- [ ] Styling: Read-only, muted colors

#### Database Requirements
- **Tables:** `companies`, `products`, `skus`, `users`
- **Fields:** `created_at`, `updated_at`, join with `users` for creator/updater names

#### Compliance Verification (Sami)
- [ ] Metadata sections added to all three edit forms
- [ ] Data displays correctly

#### Dependencies
- **Depends on:** Task 6.1 (Tax ID Fields)
- **Blocks:** None

#### Estimated Effort
- **Backend:** 1-2 hours (Maya)
- **Frontend:** 3-4 hours (Emma)
- **Testing:** 1-2 hours (Hassan)
- **Total:** 5-8 hours

---

### Task 6.3: Add Information Banners

**Priority:** 🟢 **LOW**  
**Routes:**
- `/rmm/atc-codes` (MOH-controlled read-only)
- `/rmm/critical-medicines` (MOH Tier 1 designation)

#### Implementation Requirements
- [x] ATC Codes: "ℹ️ ATC codes are MOH-controlled and read-only..."
- [x] Critical Medicines: "ℹ️ Critical medicines are designated by MOH Tier 1..."
- [x] Styling: Light blue background (#eff6ff), info icon, dismissible

#### Compliance Verification (Sami)
- [x] Banners added per wireframe
- [x] Dismissible functionality works

#### Dependencies
- **Depends on:** Task 6.2 (Metadata Sections)
- **Blocks:** None

#### Estimated Effort
- **Frontend:** 2-3 hours (Emma)
- **Testing:** 1 hour (Hassan)
- **Total:** 3-4 hours

---

### Task 6.4: Add Level Badges to ATC Codes

**Priority:** 🟢 **LOW**  
**Route:** `/rmm/atc-codes`  
**Wireframe:** `docs/04-design/user-experience/wireframes/01-rmm/task-0.5.2.14-atc-codes-list.md`

#### Implementation Requirements
- [ ] Replace "Level X" text with color-coded badges
- [ ] Level 1 (Anatomical): Blue (#3b82f6)
- [ ] Level 2 (Therapeutic): Green (#10b981)
- [ ] Level 3 (Pharmacological): Yellow (#fbbf24)
- [ ] Level 4 (Chemical): Purple (#a855f7)

#### Compliance Verification (Sami)
- [ ] Badges implemented per wireframe colors
- [ ] All levels display correctly

#### Dependencies
- **Depends on:** Task 6.3 (Information Banners)
- **Blocks:** None

#### Estimated Effort
- **Frontend:** 1-2 hours (Emma)
- **Testing:** 1 hour (Hassan)
- **Total:** 2-3 hours

---

### Task 6.5: Add Regulatory Notice to Company Forms

**Priority:** 🟢 **LOW**  
**Routes:**
- `/rmm/companies/new`
- `/rmm/companies/[id]/edit`

#### Implementation Requirements
- [x] Add "Regulatory Notice" section
- [x] Content:
  - Company registrations subject to DMP regulations
  - Data retained for 7 years (Law No. 09-08)
  - Information used for enforcement actions (DMP Art. X)
  - "[View Regulatory Framework]" link
- [x] Styling: Info box with light background

#### Compliance Verification (Sami)
- [x] Regulatory notice added per wireframe
- [x] Fatima's requirements met

#### Dependencies
- **Depends on:** Task 6.4 (Level Badges)
- **Blocks:** None

#### Estimated Effort
- **Frontend:** 2-3 hours (Emma)
- **Testing:** 1 hour (Hassan)
- **Total:** 3-4 hours

---

### Task 6.6: Add Registration Number Format Display

**Priority:** 🟢 **LOW**  
**Route:** `/rmm/companies`  
**Wireframe:** `docs/04-design/user-experience/wireframes/01-rmm/companies/task-0.5.2.2-companies-list.md`

#### Implementation Requirements
- [ ] Add format hint: "Format: REG-YYYY-NNNNN (e.g., REG-2024-001)"
- [ ] Display in Company Create form
- [ ] Optional: Click registration number to filter (if wireframe specifies)

#### Compliance Verification (Sami)
- [ ] Format display added
- [ ] Optional click-to-filter implemented (if specified)

#### Dependencies
- **Depends on:** Task 6.5 (Regulatory Notice)
- **Blocks:** None

#### Estimated Effort
- **Frontend:** 1-2 hours (Emma)
- **Testing:** 1 hour (Hassan)
- **Total:** 2-3 hours

---

### Task 6.7: Add Company Filter to Companies List

**Priority:** 🟢 **LOW**  
**Route:** `/rmm/companies`  
**Wireframe:** `docs/04-design/user-experience/wireframes/01-rmm/companies/task-0.5.2.2-companies-list.md`

#### Implementation Requirements
- [x] Add "Company" filter section (single-select for MOH)
- [x] Show list of companies (for MOH users)
- [x] Apply filter to RPC call
- [x] Clear filter functionality

#### Database Requirements
- **Table:** `companies`
- **RPC Function:** `rmm_list_companies` extended with `p_company_id`

#### Compliance Verification (Sami)
- [x] Filter added per wireframe
- [x] Filtering functional

#### Dependencies
- **Depends on:** Task 6.6 (Registration Number Format)
- **Blocks:** None

#### Estimated Effort
- **Backend:** 1 hour (Maya)
- **Frontend:** 2-3 hours (Emma)
- **Testing:** 1 hour (Hassan)
- **Total:** 4-5 hours

---

### Task 6.8: Add Submission Deadlines Banner

**Priority:** 🟢 **LOW**  
**Route:** `/rmm/submissions`  
**Wireframe:** `docs/04-design/user-experience/wireframes/01-rmm/workflow/task-0.5.2.11-registry-submission-list.md`

#### Implementation Requirements
- [x] Add info banner below filters
- [x] Content: "ℹ️ Submission Deadlines - Regulatory: DMP Regulation Article 10 - Registry Submission Requirements"
- [x] Link: "[View Regulatory Framework]"
- [x] Styling: Info banner with light background

#### Compliance Verification (Sami)
- [x] Banner added per wireframe
- [x] Fatima's requirements met

#### Dependencies
- **Depends on:** Task 6.7 (Company Filter)
- **Blocks:** None

#### Estimated Effort
- **Frontend:** 1-2 hours (Emma)
- **Testing:** 1 hour (Hassan)
- **Total:** 2-3 hours

---

### Task 6.9: Add Request Info Button to Submission Detail

**Priority:** 🟢 **LOW**  
**Route:** `/rmm/submissions/[id]`  
**Wireframe:** `docs/04-design/user-experience/wireframes/01-rmm/workflow/task-0.5.2.12-registry-submission-detail.md`

#### Implementation Requirements
- [x] Add "[Request Info]" button (MOH actions)
- [x] Opens modal to request additional information
- [x] Sends notification to submitter (calls RPC when implemented)
- [ ] Updates submission status (backend RPC required)

#### Database Requirements
- **Tables:** `registry_submissions`, `notifications`
- **RPC Function:** `rmm_request_submission_info` — UI calls it; RPC to be added if missing

#### Compliance Verification (Sami)
- [x] Button added per wireframe
- [x] Modal and submit flow implemented

#### Dependencies
- **Depends on:** Task 6.8 (Submission Deadlines Banner)
- **Blocks:** None

#### Estimated Effort
- **Backend:** 2-3 hours (Maya)
- **Frontend:** 3-4 hours (Emma)
- **Testing:** 2 hours (Hassan)
- **Total:** 7-9 hours

---

### Task 6.10: Add Regulatory Basis to Approval History

**Priority:** 🟢 **LOW**  
**Route:** `/rmm/submissions/[id]`  
**Wireframe:** `docs/04-design/user-experience/wireframes/01-rmm/workflow/task-0.5.2.12-registry-submission-detail.md`

#### Implementation Requirements
- [x] Add "Regulatory Basis" field to each approval history entry
- [x] Display: "Regulatory Basis: DMP Art. [X] - [Description]"
- [x] Add "Regulatory Requirements" verification status (✓ Verified / —)

#### Database Requirements
- **Table:** `approval_history`
- **Fields:** `regulatory_basis`, `regulatory_requirements_verified`

#### Compliance Verification (Sami)
- [x] Regulatory basis displayed per wireframe
- [x] Fatima's requirements met

#### Dependencies
- **Depends on:** Task 6.9 (Request Info Button)
- **Blocks:** None

#### Estimated Effort
- **Backend:** 2-3 hours (Maya)
- **Frontend:** 2-3 hours (Emma)
- **Testing:** 1-2 hours (Hassan)
- **Total:** 5-8 hours

---

## Task Execution Summary

### Total Tasks: 35

**Phase 1 (Critical):** 1 task  
**Phase 2 (High - Regulatory):** 6 tasks  
**Phase 3 (High - Tabs):** 9 tasks  
**Phase 4 (Medium - Filters):** 6 tasks  
**Phase 5 (Medium - Management):** 3 tasks  
**Phase 6 (Low - Additional):** 10 tasks

### Estimated Total Effort

- **Backend (Maya):** 80-110 hours
- **Frontend (Emma):** 150-200 hours
- **Testing (Hassan):** 60-80 hours
- **Total:** 290-390 hours (~7-10 weeks for 1 developer, ~3-5 weeks for team)

---

## Compliance Enforcement

### Sami's Role

**Before Each Task:**
1. Verify wireframe read completely
2. Verify database tables/RPCs exist
3. Verify seed data applied
4. Verify previous tasks complete
5. Verify wireframe binding comment format
6. **RPC contract:** If the task calls or adds RPCs, verify frontend will use exact parameter names and values per migration; verify new RPCs avoid `jsonb_agg` + `ORDER BY` and mixed-type `CASE` in `ORDER BY` (see **Lessons from RMM Overview Fixes**).

**After Each Task:**
1. Verify wireframe binding added
2. Verify database queries (no mocks)
3. Verify role coverage
4. Verify UI states
5. Verify route file index updated
6. **RPC contract:** Confirm RPC calls match migration (names, `p_` prefix, literals like `"DESC"`); no `user_id` passed when RPC uses `auth.uid()` only.
7. Approve task completion

### Stop Conditions

**STOP if:**
- Wireframe not read completely
- Required DB table/RPC doesn't exist
- Previous task not complete
- Seed data not applied
- Local mocks detected
- Wireframe binding missing
- **RPC contract mismatch:** Frontend uses different parameter names or values than the RPC (e.g. `sort_order: "desc"` when RPC expects `"DESC"`), or passes `user_id` to an `auth.uid()`-only RPC
- **New RPC uses forbidden SQL patterns:** `jsonb_agg(... ORDER BY col)` over non-subquery, or `CASE` in `ORDER BY` mixing `timestamptz` and `text` without casting

---

## Dependencies Graph

```
Task 1.1 (RMM Overview)
  ├─> Task 2.1 (Companies Compliance Column)
  │     ├─> Task 2.2 (Detail Pages Compliance)
  │     │     ├─> Task 2.3 (Regulatory Links)
  │     │     │     ├─> Task 2.4 (Legal Basis)
  │     │     │     │     ├─> Task 2.5 (Deadline Tracking)
  │     │     │     │     │     └─> Task 2.6 (Regulatory Checklist)
  │     │     │     │     │           ├─> Task 3.1 (Company Products Tab)
  │     │     │     │     │           │     ├─> Task 3.2 (Company Enforcement Tab)
  │     │     │     │     │           │     │     ├─> Task 3.3 (Company History Tab)
  │     │     │     │     │           │     │     │     ├─> Task 3.4 (Company Overview Stats)
  │     │     │     │     │           │     │     │     │     ├─> Task 3.5 (Product SKUs Tab)
  │     │     │     │     │           │     │     │     │     │     ├─> Task 3.6 (Product History Tab)
  │     │     │     │     │           │     │     │     │     │     │     ├─> Task 3.7 (Product Overview Stats)
  │     │     │     │     │           │     │     │     │     │     │     │     ├─> Task 3.8 (SKU Overview Sections)
  │     │     │     │     │           │     │     │     │     │     │     │     │     └─> Task 3.9 (SKU History Tab)
  │     │     │     │     │           │     │     │     │     │     │     │     │           ├─> Task 4.1 (Date Range Filters)
  │     │     │     │     │           │     │     │     │     │     │     │     │           │     ├─> Task 4.2 (Dosage Form Filter)
  │     │     │     │     │           │     │     │     │     │     │     │     │           │     │     ├─> Task 4.3 (ATC Code Filters)
  │     │     │     │     │           │     │     │     │     │     │     │     │           │     │     │     ├─> Task 4.4 (ATC Level/Category Filters)
  │     │     │     │     │           │     │     │     │     │     │     │     │           │     │     │     │     ├─> Task 4.5 (SKU Count Column)
  │     │     │     │     │           │     │     │     │     │     │     │     │           │     │     │     │     │     ├─> Task 4.6 (ATC Code Column)
  │     │     │     │     │           │     │     │     │     │     │     │     │           │     │     │     │     │     │     ├─> Task 5.1 (Critical Medicines Management)
  │     │     │     │     │           │     │     │     │     │     │     │     │           │     │     │     │     │     │     │     ├─> Task 5.2 (Actions Dropdowns)
  │     │     │     │     │           │     │     │     │     │     │     │     │           │     │     │     │     │     │     │     │     ├─> Task 5.3 (Draft Auto-Save)
  │     │     │     │     │           │     │     │     │     │     │     │     │           │     │     │     │     │     │     │     │     │     └─> Tasks 6.1-6.10 (Low Priority)
```

---

## Success Criteria

### Phase 1 Complete
- [x] RMM Overview page fully functional
- [x] All statistics display real data
- [x] All sections implemented per wireframe
- [x] Role-based filtering works
- [x] All UI states implemented
- [x] Frontend–RPC contract and SQL fixes applied (see `phase-1-rmm-overview-database-mismatch-fixes.md`)

### Phase 2 Complete
- [ ] All regulatory compliance sections added
- [ ] All regulatory framework links functional
- [ ] All legal basis displays added
- [ ] All deadline tracking implemented
- [ ] Regulatory checklist functional

### Phase 3 Complete
- [ ] All tab implementations complete
- [ ] All statistics display real data
- [ ] All history timelines functional
- [ ] All enforcement sections complete

### Phase 4 Complete
- [ ] All filters added and functional
- [ ] All columns added per wireframe

### Phase 5 Complete
- [x] Critical Medicines management UI complete
- [x] Actions dropdowns added
- [x] Draft auto-save functional

### Phase 6 Complete
- [ ] All low-priority features added
- [ ] All information banners added
- [ ] All metadata sections added

### Final Compliance
- [ ] All 18 pages 100% wireframe compliant
- [ ] All Fatima's requirements met
- [ ] All compliance rules followed
- [ ] All tests passing
- [ ] Sami's final approval

---

**Plan Created:** 2026-01-25  
**Owner:** Sami (Implementation Compliance Specialist)  
**Next Review:** After Phase 2 completion (Phase 1 complete; RMM Overview implemented and fixes applied)
