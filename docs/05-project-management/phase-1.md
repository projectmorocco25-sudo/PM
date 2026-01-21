# Phase 1 Implementation Plan - Pharmaceutical Governance Value Chain Platform (PM)

**Phase:** Phase 1 - Development with Seeded Supabase Data (Months 2-6)  
**Status:** ✅ APPROVED FOR IMPLEMENTATION (January 12, 2026)  
**Document Version:** 2.0 (Restructured - January 2026)

**Prerequisites:** 
- Phase 0 (Technical Foundation) ✅ COMPLETE
- Phase 0.5 (UI/UX Wireframes) ✅ COMPLETE
- Phase 0.6 (Database Schema Audit) ✅ COMPLETE
- **Phase 1 Pre-Implementation Audit** ✅ COMPLETE

---

## Executive Summary

Phase 1 delivers the complete MVP with seeded Supabase data, organized into **5 sequential phases** following industry best practices for modular development and incremental delivery:

1. **Phase 1.1:** RMM Development (Month 2) - Foundation module
2. **Phase 1.2:** VCI Development (Month 3) - Depends on RMM
3. **Phase 1.3:** ECS Development (Month 4) - Depends on RMM + VCI
4. **Phase 1.4:** CMC Development (Month 5) - Depends on all previous modules
5. **Phase 1.5:** Holistic MVP Testing (Month 6) - Integration and validation

**Key Restructuring Rationale:**
- **Separation of Concerns:** RMM and VCI are now separate phases to enable proper integration testing and clearer dependency management
- **Incremental Delivery:** Each phase delivers a complete, testable module before moving to the next
- **Risk Mitigation:** Earlier detection of integration issues between modules
- **Resource Allocation:** Clearer team assignments and parallel work opportunities within each phase

---

## 🔒 COMPLIANCE ENFORCEMENT (Sami - Implementation Compliance Specialist)

**CRITICAL:** Before starting ANY implementation task, Sami (Implementation Compliance Specialist) must validate compliance.

**📋 Complete Compliance Rules:** See [Compliance Rules](../standards/compliance-rules.md) for Sami's complete compliance checklist that must be verified before EVERY task.

**Key Requirements:**
- Sequential Task Verification - All previous tasks must be complete
- Role Name Verification - Frontend role names must match database schema exactly
- Schema Verification - Verify database schema before role-dependent code
- Integration Verification - Layout/components must be integrated into routes
- Role Coverage Verification - All 9 roles must be handled
- Wireframe compliance - Review wireframe before starting
- No local mock data - Query Supabase only
- Wireframe binding - Add binding comments to code

**Sami's Stop Authority:** If any compliance rule is violated, Sami must **STOP** implementation immediately.

---

## 🔒 HARD GATES: Wireframe + Database Compliance (Non-Negotiable)

These gates apply to **every** Phase 1 frontend page/component. If a gate is not met, the task is **not complete** and the PR must not merge.

### No Hardcoded UI Data
- Production pages/components must **not** use inline arrays/objects as the source of truth
- All seed data must be **seeded into the Supabase database** (dev/staging), then queried by the frontend
- Local mock providers are **not allowed** for application runtime
- **Seed playbook (required):** See [Phase 1.1 Seeded Supabase "Mock Data" Playbook](phase-1-1-mockdata.md)

### Wireframe Binding
- Every implemented route/page must declare the exact wireframe task file(s) it implements
- Wireframe binding must appear in **both** PR description and codebase
- If there is no wireframe for a page/task: **STOP** and create/approve the wireframe **before** coding

### DB Binding
- Every page must list the tables/fields it uses and must query real data
- Phase 0.6 additions must be incorporated where applicable

### Role + States Coverage
- Company + MOH Tier 1 + MOH Tier 2 must be implemented/verified where the wireframe specifies role variants
- Required UI states: **loading**, **empty**, **error**, **success**

### Proof Required (PR Description Checklist)
Every frontend task PR must include:
1. Wireframe link(s) (exact `task-0.5.x.x` file(s))
2. Screenshots for each role variant or explicit N/A
3. Screenshots for loading/empty/error/success states
4. Data proof: tables/fields used + where queries live + evidence they are queried
5. Any deviations + explicit approval reference
6. Layout Integration Proof
7. Role Coverage Proof
8. Role Name Consistency Proof

---

## ⚠️ CRITICAL: Wireframe-First Implementation Principle

**Before starting ANY frontend implementation task, you MUST:**

1. **Review the corresponding wireframe** - Every page, component, and workflow has a wireframe specification
2. **Understand the wireframe requirements** - Layout, interactions, states, role-based variations
3. **Reference wireframe annotations** - See wireframe documentation
4. **Check component mapping** - See component mapping documentation
5. **Verify wireframe compliance** - Your implementation must match the wireframe specifications

**Wireframes are the PRIMARY design reference** - If there is any conflict or ambiguity, the wireframe takes precedence.

**If a wireframe doesn't exist for a task, STOP and create it first.**

---

# PHASE 1.1: RMM DEVELOPMENT (Month 2)

**Duration:** 4 weeks  
**Objective:** Build Registry Management Module (RMM) as the foundation module with comprehensive seeded Supabase data

**Success Criteria:**
- ✅ All RMM workflows functional (CRUD, approval chains, two-person rule)
- ✅ Seed data successfully populated (75 companies)
- ✅ Internal testing passed
- ✅ Documentation complete
- ✅ Integration checkpoints validated (ready for VCI)

**Integration Checkpoint (After Phase 1.1):**
Before Phase 1.2 (VCI) can begin, the following must be validated:
1. **Data Model Validation (Nadia):** Verify RMM schema supports VCI requirements
2. **RLS Policy Validation (Rafi):** Verify RLS policies allow VCI module access to RMM data
3. **API Contract Validation (Maya):** Verify RPC functions provide data VCI needs
4. **Seed Data Validation (Farah):** Verify seed data covers VCI test scenarios

**Gate:** Phase 1.2 cannot start until all 4 validations pass.

---

## Subphase 1.1.1: Foundation & Infrastructure Setup (Week 1)

**Status:** ✅ COMPLETE (2026-01-12) - Phase 1.1.1.FIX completed, all route fixes applied

**Prerequisites:**
- Phase 0.5 (Wireframes) completed and approved
- Phase 0.6 (Database Schema Audit & Alignment) completed
- Implementation Standards document reviewed
- Development environment configured

**Seed Data Gate (Required):**
- Before starting Phase 1.1 Core Foundation UI work, apply the seed migration stage `seed_1_1_1_foundation` per [Phase 1.1 Playbook - Stage: seed_1_1_1_foundation](phase-1-1-mockdata.md#stage-seed_1_1_1_foundation-subphase-111)

### Backend Setup Tasks
- [ ] **Task 1.1.1.1:** Initialize Supabase project structure (migrations, functions, storage buckets)
- [ ] **Task 1.1.1.1a:** Define module integration contracts (data flow specs between RMM→VCI, VCI→ECS, ECS→CMC)
- [ ] **Task 1.1.1.1b:** Set up shared database schema versioning strategy
- [ ] **Task 1.1.1.1c:** Define API contract documentation format (OpenAPI/Swagger for RPC functions)
- [ ] **Task 1.1.1.1d:** Set up Edge Functions project structure
- [ ] **Task 1.1.1.2:** Create database migration for core tables (users, system_config, audit_logs, notifications, approvals)
- [ ] **Task 1.1.1.3:** Create database migration for RMM tables (companies, products, skus, atc_codes, critical_medicines, registry_submissions)
- [ ] **Task 1.1.1.4:** Implement RLS policies for core tables
- [ ] **Task 1.1.1.5:** Implement RLS policies for RMM tables
- [ ] **Task 1.1.1.6:** Create audit logging trigger function
- [ ] **Task 1.1.1.7:** Create database migration for enforcement tables (enforcement_actions)
- [ ] **Task 1.1.1.8:** Implement RLS policies for enforcement tables

### Frontend Setup Tasks
- [ ] **Task 1.1.1.9:** Create core foundation layout and navigation
- [ ] **Task 1.1.1.10:** Implement authentication pages (login, signup, password reset)
- [ ] **Task 1.1.1.11:** Implement dashboard page (role-based)
- [ ] **Task 1.1.1.12:** Implement placeholder pages for all routes (30 placeholder pages with route protection)

---

## Subphase 1.1.2: RMM Module - Core Registry Management (Week 2-3)

**Prerequisites:**
- ✅ Phase 1.1.1.FIX complete (2026-01-12)
- ✅ Phase 0.5 (Wireframes) completed and approved
- ✅ Phase 0.6 (Database Schema Audit & Alignment) completed

**Seed Data Gate (Required):**
- Before starting RMM frontend pages, apply the seed migration stage `seed_1_1_2_rmm` per [Phase 1.1 Playbook - Stage: seed_1_1_2_rmm](phase-1-1-mockdata.md#stage-seed_1_1_2_rmm-subphase-112)

### RMM Backend Tasks
- [ ] **Task 1.1.2.1:** Create RMM RPC functions - Company CRUD
- [ ] **Task 1.1.2.2:** Create RMM RPC functions - Product CRUD
- [ ] **Task 1.1.2.3:** Create RMM RPC functions - SKU CRUD
- [ ] **Task 1.1.2.4:** Create RMM RPC functions - ATC Code management (MOH only)
- [ ] **Task 1.1.2.5:** Create RMM RPC functions - Critical Medicine management (MOH only)
- [ ] **Task 1.1.2.6:** Implement registry submission workflow - Create submission
- [ ] **Task 1.1.2.7:** Implement registry submission workflow - Tier 2 verification
- [ ] **Task 1.1.2.8:** Implement registry submission workflow - Tier 1 approval
- [ ] **Task 1.1.2.9:** Implement registry submission workflow - Tier 2 implementation
- [ ] **Task 1.1.2.10:** Implement registry submission workflow - Completion
- [ ] **Task 1.1.2.11:** Implement registry submission workflow - Rejection
- [ ] **Task 1.1.2.12:** Implement MOH submission workflow - Peer review
- [ ] **Task 1.1.2.13:** Implement cascade deactivation logic
- [ ] **Task 1.1.2.14:** Implement soft delete safeguards
- [ ] **Task 1.1.2.15:** Implement two-person rule for critical actions

### RMM Frontend Tasks
- [ ] **Task 1.1.2.16:** Create RMM module layout and navigation
- [ ] **Task 1.1.2.17:** Implement Companies list page
- [ ] **Task 1.1.2.18:** Implement Company detail page
- [ ] **Task 1.1.2.19:** Implement Company create/edit forms
- [ ] **Task 1.1.2.20:** Implement Products list page
- [ ] **Task 1.1.2.21:** Implement Product detail page
- [ ] **Task 1.1.2.22:** Implement Product create/edit forms
- [ ] **Task 1.1.2.23:** Implement SKUs list page
- [ ] **Task 1.1.2.24:** Implement SKU detail page
- [ ] **Task 1.1.2.25:** Implement SKU create/edit forms (include pharmaceutical attributes)
- [ ] **Task 1.1.2.26:** Implement Registry submission list page
- [ ] **Task 1.1.2.27:** Implement Registry submission detail page
- [ ] **Task 1.1.2.28:** Implement Registry submission workflow actions
- [ ] **Task 1.1.2.29:** Implement ATC Codes list page (MOH only)
- [ ] **Task 1.1.2.30:** Implement Critical Medicines list page (MOH only)

### Enforcement Backend Tasks
- [ ] **Task 1.1.2.31:** Create Enforcement RPC function - Submit for review
- [ ] **Task 1.1.2.32:** Create Enforcement RPC function - Review action
- [ ] **Task 1.1.2.33:** Create Enforcement RPC function - Approve action
- [ ] **Task 1.1.2.34:** Create Enforcement RPC function - Execute action
- [ ] **Task 1.1.2.35:** Create Enforcement RPC function - Appeal action
- [ ] **Task 1.1.2.36:** Create Enforcement RPC function - Resolve appeal

### Enforcement Frontend Tasks
- [ ] **Task 1.1.2.37:** Implement Enforcement dashboard page
- [ ] **Task 1.1.2.38:** Implement Enforcement actions list page
- [ ] **Task 1.1.2.39:** Implement Enforcement action detail page
- [ ] **Task 1.1.2.40:** Implement Create enforcement action wizard
- [ ] **Task 1.1.2.41:** Implement Pending approvals page
- [ ] **Task 1.1.2.42:** Implement Enforcement reports page
- [ ] **Task 1.1.2.43:** Implement Appeal review interface (MOH Tier 1)
- [ ] **Task 1.1.2.44:** Implement Appeal submission form (Company users)

---

## Subphase 1.1.3: RMM Integration Testing & Seed Data (Week 4)

### Integration Testing Tasks
- [ ] **Task 1.1.3.1:** Create RMM module test suite (unit tests for RPC functions)
- [ ] **Task 1.1.3.2:** Create integration tests - RMM workflow (submission → approval → implementation)
- [ ] **Task 1.1.3.3:** Create integration tests - Enforcement workflow
- [ ] **Task 1.1.3.4:** Test RLS policy enforcement (company data isolation)
- [ ] **Task 1.1.3.5:** Test two-person rule enforcement

### Seed Data Tasks
- [ ] **Task 1.1.3.6:** Create comprehensive RMM seed data (75 companies, products, SKUs)
- [ ] **Task 1.1.3.7:** Execute RMM seed data population
- [ ] **Task 1.1.3.8:** Validate seed data (Nadia - integrity, Farah - realism, Hassan - test isolation)

### Documentation Tasks
- [ ] **Task 1.1.3.9:** Create RMM module user documentation
- [ ] **Task 1.1.3.10:** Phase 1.1 internal review and sign-off

### Integration Checkpoint Validation
- [ ] **Task 1.1.3.11:** Data Model Validation (Nadia) - Verify RMM schema supports VCI requirements
- [ ] **Task 1.1.3.12:** RLS Policy Validation (Rafi) - Verify RLS policies allow VCI module access
- [ ] **Task 1.1.3.13:** API Contract Validation (Maya) - Verify RPC functions provide VCI data
- [ ] **Task 1.1.3.14:** Seed Data Validation (Farah) - Verify seed data covers VCI test scenarios

**Gate:** Phase 1.2 (VCI) cannot start until all 4 validations pass.

---

# PHASE 1.2: VCI DEVELOPMENT (Month 3)

**Duration:** 4 weeks  
**Objective:** Build Value Chain Intelligence Module (VCI) with AAMS, MSQ, and WSL workflows, including breach detection

**Prerequisites:**
- ✅ Phase 1.1 (RMM) complete with all integration checkpoints validated
- ✅ RMM data model supports VCI requirements
- ✅ RLS policies allow VCI module access to RMM data
- ✅ API contracts provide VCI-required data
- ✅ Seed data covers VCI test scenarios

**Success Criteria:**
- ✅ All VCI workflows functional (AAMS, MSQ, WSL submissions, threshold calculation, breach detection)
- ✅ Integration with RMM working correctly
- ✅ Seed data successfully populated
- ✅ Internal testing passed
- ✅ Documentation complete
- ✅ Integration checkpoints validated (ready for ECS)

**Integration Checkpoint (After Phase 1.2):**
Before Phase 1.3 (ECS) can begin, the following must be validated:
1. **Data Model Validation (Nadia):** Verify VCI schema supports ECS requirements
2. **RLS Policy Validation (Rafi):** Verify RLS policies allow ECS module access to VCI data
3. **API Contract Validation (Maya):** Verify RPC functions provide data ECS needs (threshold switching)
4. **Seed Data Validation (Farah):** Verify seed data covers ECS test scenarios

**Gate:** Phase 1.3 cannot start until all 4 validations pass.

---

## Subphase 1.2.1: VCI Module - AAMS Workflow (Week 1)

**Seed Data Gate (Required):**
- Before starting VCI AAMS frontend pages, apply the seed migration stage `seed_1_2_1_vci_aams` per [Phase 1.1 Playbook - Stage: seed_1_2_1_vci_aams](phase-1-1-mockdata.md#stage-seed_1_2_1_vci_aams-subphase-121)

### VCI AAMS Backend Tasks
- [ ] **Task 1.2.1.1:** Create database migration for VCI AAMS tables (aams_submissions, thresholds)
- [ ] **Task 1.2.1.2:** Implement RLS policies for VCI AAMS tables
- [ ] **Task 1.2.1.3:** Create VCI RPC function - AAMS submission
- [ ] **Task 1.2.1.4:** Create VCI RPC function - AAMS verification (includes threshold calculation)
- [ ] **Task 1.2.1.5:** Create VCI RPC function - AAMS approval
- [ ] **Task 1.2.1.6:** Create VCI RPC function - AAMS completion
- [ ] **Task 1.2.1.7:** Create VCI RPC function - AAMS rejection
- [ ] **Task 1.2.1.8:** Implement threshold calculation logic (B multiplier: 3 standard, 3.5 critical medicines)
- [ ] **Task 1.2.1.9:** Implement threshold modification logic (local per-SKU, global system-wide)
- [ ] **Task 1.2.1.10:** Implement AAMS deadline validation (January 31 deadline, 15-day grace period)
- [ ] **Task 1.2.1.11:** Implement previous year AAMS fallback logic
- [ ] **Task 1.2.1.12:** Create scheduled trigger for AAMS deadline check

### VCI AAMS Frontend Tasks
- [ ] **Task 1.2.1.13:** Create VCI module layout and navigation
- [ ] **Task 1.2.1.14:** Implement AAMS submissions list page
- [ ] **Task 1.2.1.15:** Implement AAMS submission create/edit form
- [ ] **Task 1.2.1.16:** Implement AAMS submission detail page
- [ ] **Task 1.2.1.17:** Implement AAMS workflow actions
- [ ] **Task 1.2.1.18:** Implement Threshold management page (MOH Tier 1)
- [ ] **Task 1.2.1.19:** Implement Threshold modification form

---

## Subphase 1.2.2: VCI Module - MSQ Workflow (Week 2)

**Seed Data Gate (Required):**
- Before starting VCI MSQ frontend pages, apply the seed migration stage `seed_1_2_2_vci_msq` per [Phase 1.1 Playbook - Stage: seed_1_2_2_vci_msq](phase-1-1-mockdata.md#stage-seed_1_2_2_vci_msq-subphase-122)

### VCI MSQ Backend Tasks
- [ ] **Task 1.2.2.1:** Create database migration for VCI MSQ tables (msq_submissions)
- [ ] **Task 1.2.2.2:** Implement RLS policies for VCI MSQ tables
- [ ] **Task 1.2.2.3:** Create VCI RPC function - MSQ submission
- [ ] **Task 1.2.2.4:** Implement MSQ validation logic
- [ ] **Task 1.2.2.5:** Implement MSQ vs AAMS validation (20% threshold comparison)
- [ ] **Task 1.2.2.6:** Create VCI RPC function - MSQ flag for review
- [ ] **Task 1.2.2.7:** Create VCI RPC function - MSQ accept
- [ ] **Task 1.2.2.8:** Create VCI RPC function - MSQ reject
- [ ] **Task 1.2.2.9:** Implement 7-day grace period for MSQ corrections

### VCI MSQ Frontend Tasks
- [ ] **Task 1.2.2.10:** Implement MSQ submissions list page
- [ ] **Task 1.2.2.11:** Implement MSQ submission form
- [ ] **Task 1.2.2.12:** Implement MSQ submission detail page
- [ ] **Task 1.2.2.13:** Implement MSQ correction interface (7-day grace period)

---

## Subphase 1.2.3: VCI Module - WSL Workflow & Breach Detection (Week 3)

**Seed Data Gate (Required):**
- Before starting VCI WSL/Breaches frontend pages, apply the seed migration stage `seed_1_2_3_vci_wsl` per [Phase 1.1 Playbook - Stage: seed_1_2_3_vci_wsl](phase-1-1-mockdata.md#stage-seed_1_2_3_vci_wsl-subphase-123)

### VCI WSL Backend Tasks
- [ ] **Task 1.2.3.1:** Create database migration for VCI WSL tables (wsl_submissions, breaches, breach_analyses)
- [ ] **Task 1.2.3.2:** Implement RLS policies for VCI WSL tables
- [ ] **Task 1.2.3.3:** Create VCI RPC function - WSL submission
- [ ] **Task 1.2.3.4:** Implement WSL validation logic
- [ ] **Task 1.2.3.5:** Implement WSL deadline validation (Friday EOD deadline)
- [ ] **Task 1.2.3.6:** Implement breach detection logic (stock level vs threshold comparison)
- [ ] **Task 1.2.3.7:** Create VCI RPC function - Breach creation (automatic on WSL submission)
- [ ] **Task 1.2.3.8:** Implement breach priority logic
- [ ] **Task 1.2.3.9:** Create VCI RPC function - Breach analysis
- [ ] **Task 1.2.3.10:** Create VCI RPC function - Breach action suggestion
- [ ] **Task 1.2.3.11:** Create VCI RPC function - Breach action approval
- [ ] **Task 1.2.3.12:** Create scheduled trigger for WSL deadline check

### VCI WSL Frontend Tasks
- [ ] **Task 1.2.3.13:** Implement WSL submissions list page
- [ ] **Task 1.2.3.14:** Implement WSL submission form
- [ ] **Task 1.2.3.15:** Implement WSL submission detail page
- [ ] **Task 1.2.3.16:** Implement Breaches list page
- [ ] **Task 1.2.3.17:** Implement Breach detail page
- [ ] **Task 1.2.3.18:** Implement Breach analysis interface (Tier 2)
- [ ] **Task 1.2.3.19:** Implement Breach action approval interface (Tier 1)
- [ ] **Task 1.2.3.20:** Implement Governance Dashboard (MOH)

---

## Subphase 1.2.4: VCI Seed Data Validation & Integration Testing (Week 4)

### Seed Data Tasks
- [ ] **Task 1.2.4.1:** Expand seed migration - Comprehensive MSQ historical data
- [ ] **Task 1.2.4.2:** Expand seed migration - Comprehensive WSL historical data
- [ ] **Task 1.2.4.3:** Create seed migration - Breach records
- [ ] **Task 1.2.4.4:** Expand seed migration - Comprehensive AAMS historical data
- [ ] **Task 1.2.4.5:** Validate all seed migrations (Nadia - integrity, Farah - realism, Hassan - test isolation)

### Integration Testing Tasks
- [ ] **Task 1.2.4.6:** Create VCI module test suite (unit tests for RPC functions)
- [ ] **Task 1.2.4.7:** Create integration tests - VCI workflow (AAMS → MSQ → WSL → breach detection)
- [ ] **Task 1.2.4.8:** Verify RMM→VCI integration contract (data flow, threshold switching)
- [ ] **Task 1.2.4.9:** Test RLS policy enforcement (VCI data isolation)

### Historical Data Backend Tasks
- [ ] **Task 1.2.4.10:** Create database indexes for historical queries
- [ ] **Task 1.2.4.11:** Create RPC function - vci_get_historical_submissions
- [ ] **Task 1.2.4.12:** Create RPC function - log_historical_data_access

### Historical Data Frontend Tasks
- [ ] **Task 1.2.4.13:** Implement Timeline component
- [ ] **Task 1.2.4.14:** Implement DateRangePicker component
- [ ] **Task 1.2.4.15:** Implement ExportButton component
- [ ] **Task 1.2.4.16:** Implement History tabs on detail pages
- [ ] **Task 1.2.4.17:** Add year/month/week filters to submission list pages
- [ ] **Task 1.2.4.18:** Implement `/vci/submissions/history` route
- [ ] **Task 1.2.4.19:** Implement `/vci/submissions/history/trends` route (MOH Tier 1)

### Documentation Tasks
- [ ] **Task 1.2.4.20:** Create VCI module user documentation
- [ ] **Task 1.2.4.21:** Phase 1.2 internal review and sign-off

### Integration Checkpoint Validation
- [ ] **Task 1.2.4.22:** Data Model Validation (Nadia) - Verify VCI schema supports ECS requirements
- [ ] **Task 1.2.4.23:** RLS Policy Validation (Rafi) - Verify RLS policies allow ECS module access
- [ ] **Task 1.2.4.24:** API Contract Validation (Maya) - Verify threshold switching contract
- [ ] **Task 1.2.4.25:** Seed Data Validation (Farah) - Verify seed data covers ECS test scenarios

**Gate:** Phase 1.3 (ECS) cannot start until all 4 validations pass.

---

# PHASE 1.3: ECS DEVELOPMENT (Month 4)

**Duration:** 4 weeks  
**Objective:** Build Export Control System module and integrate with RMM + VCI

**Prerequisites:**
- ✅ Phase 1.1 (RMM) complete
- ✅ Phase 1.2 (VCI) complete with all integration checkpoints validated
- ✅ VCI schema supports ECS requirements
- ✅ RLS policies allow ECS module access to VCI data
- ✅ API contracts provide ECS-required data (threshold switching)
- ✅ Seed data covers ECS test scenarios

**Success Criteria:**
- ✅ All ECS workflows functional (export requests, approvals, threshold switching)
- ✅ Integration with RMM + VCI working correctly
- ✅ Mock export scenarios tested
- ✅ Internal testing passed
- ✅ Documentation complete
- ✅ Integration checkpoints validated (ready for CMC)

**Integration Checkpoint (After Phase 1.3):**
Before Phase 1.4 (CMC) can begin, the following must be validated:
1. **Data Model Validation (Nadia):** Verify ECS schema supports CMC requirements
2. **RLS Policy Validation (Rafi):** Verify RLS policies allow CMC module access to ECS data
3. **API Contract Validation (Maya):** Verify RPC functions provide data CMC needs
4. **Seed Data Validation (Farah):** Verify seed data covers CMC test scenarios

**Gate:** Phase 1.4 cannot start until all 4 validations pass.

---

## Subphase 1.3.1: ECS Backend Foundation (Week 1)

### ECS Backend Setup Tasks
- [ ] **Task 1.3.1.1:** Create database migration for ECS tables (export_requests, export_authorizations, replenishment_schedules)
- [ ] **Task 1.3.1.2:** Verify ECS schema completeness
- [ ] **Task 1.3.1.3:** Define ECS integration points with RMM+VCI
- [ ] **Task 1.3.1.4:** Implement RLS policies for ECS tables
- [ ] **Task 1.3.1.5:** Create ECS RPC function - Export request submission
- [ ] **Task 1.3.1.6:** Create ECS RPC function - Export request modification
- [ ] **Task 1.3.1.7:** Create ECS RPC function - Export request cancellation
- [ ] **Task 1.3.1.8:** Implement XAMS calculation logic
- [ ] **Task 1.3.1.9:** Implement ECS Threshold calculation logic (C × XAMS)
- [ ] **Task 1.3.1.10:** Implement conditional validation logic (CMC score-based if CMC active)
- [ ] **Task 1.3.1.11:** Create ECS RPC function - Export request evaluation

---

## Subphase 1.3.2: ECS Workflow & Threshold Switching (Week 2)

### ECS Workflow Backend Tasks
- [ ] **Task 1.3.2.1:** Create ECS RPC function - Export request auto-approval queue
- [ ] **Task 1.3.2.2:** Create ECS RPC function - Export request Tier 2 verification
- [ ] **Task 1.3.2.3:** Create ECS RPC function - Export request manual review
- [ ] **Task 1.3.2.4:** Create ECS RPC function - Export request approval
- [ ] **Task 1.3.2.5:** Create ECS RPC function - Export request rejection
- [ ] **Task 1.3.2.6:** Create ECS RPC function - Export authorization
- [ ] **Task 1.3.2.7:** Implement threshold switching logic (VCI Threshold → ECS Threshold on authorization)
- [ ] **Task 1.3.2.8:** Create scheduled trigger for threshold reversion (3 months after authorization)
- [ ] **Task 1.3.2.9:** Implement intervention window logic
- [ ] **Task 1.3.2.10:** Create ECS RPC function - Export authorization expiration check
- [ ] **Task 1.3.2.11:** Create scheduled trigger for export expiration checks
- [ ] **Task 1.3.2.12:** Create ECS RPC function - Export authorization extension

---

## Subphase 1.3.3: ECS Post-Authorization & Replenishment (Week 3)

**Seed Data Gate (Required):**
- Before starting ECS frontend pages, apply the seed migration stage `seed_1_3_3_ecs` per [Phase 1.1 Playbook - Seed Strategy](phase-1-1-mockdata.md#seed-strategy-scenario-packs-deterministic)

### ECS Post-Authorization Backend Tasks
- [ ] **Task 1.3.3.1:** Create ECS RPC function - Export completion report
- [ ] **Task 1.3.3.2:** Create ECS RPC function - Export cancellation/modification request
- [ ] **Task 1.3.3.3:** Implement replenishment schedule tracking logic
- [ ] **Task 1.3.3.4:** Create ECS RPC function - Replenishment delay escalation
- [ ] **Task 1.3.3.5:** Create scheduled trigger for replenishment delay escalation
- [ ] **Task 1.3.3.6:** Implement tiered escalation process
- [ ] **Task 1.3.3.7:** Create ECS RPC function - Replenishment proof submission
- [ ] **Task 1.3.3.8:** Create ECS RPC function - Replenishment verification

### ECS Frontend Tasks
- [ ] **Task 1.3.3.9:** Create ECS module layout and navigation
- [ ] **Task 1.3.3.10:** Implement Export requests list page
- [ ] **Task 1.3.3.11:** Implement Export request form
- [ ] **Task 1.3.3.12:** Implement Export request detail page
- [ ] **Task 1.3.3.13:** Implement Export workflow actions
- [ ] **Task 1.3.3.14:** Implement Export authorizations list page
- [ ] **Task 1.3.3.15:** Implement Export authorization detail page
- [ ] **Task 1.3.3.16:** Implement Export completion reporting interface
- [ ] **Task 1.3.3.17:** Implement Replenishment schedule tracking interface

---

## Subphase 1.3.4: ECS Integration Testing & Seed Data (Week 4)

### Integration Contract Verification
- [ ] **Task 1.3.4.1:** Verify VCI→ECS integration contract (threshold switching contract, data dependencies)

### ECS Testing & Data Tasks
- [ ] **Task 1.3.4.2:** Create ECS module test suite (unit tests for RPC functions)
- [ ] **Task 1.3.4.3:** Create integration tests - ECS workflow (submission → evaluation → approval → authorization)
- [ ] **Task 1.3.4.4:** Create integration tests - Threshold switching (VCI → ECS → VCI)
- [ ] **Task 1.3.4.5:** Create integration tests - Conditional validation (CMC score integration)
- [ ] **Task 1.3.4.6:** Create integration tests - Replenishment delay escalation
- [ ] **Task 1.3.4.7:** Create seed data generation script - Export requests
- [ ] **Task 1.3.4.8:** Create seed data generation script - Export authorizations
- [ ] **Task 1.3.4.9:** Create seed data generation script - Replenishment schedules
- [ ] **Task 1.3.4.10:** Execute ECS seed data population
- [ ] **Task 1.3.4.11:** Create ECS module user documentation
- [ ] **Task 1.3.4.12:** Phase 1.3 internal review and sign-off

### Integration Checkpoint Validation
- [ ] **Task 1.3.4.13:** Data Model Validation (Nadia) - Verify ECS schema supports CMC requirements
- [ ] **Task 1.3.4.14:** RLS Policy Validation (Rafi) - Verify RLS policies allow CMC module access
- [ ] **Task 1.3.4.15:** API Contract Validation (Maya) - Verify RPC functions provide CMC data
- [ ] **Task 1.3.4.16:** Seed Data Validation (Farah) - Verify seed data covers CMC test scenarios

**Gate:** Phase 1.4 (CMC) cannot start until all 4 validations pass.

---

# PHASE 1.4: CMC DEVELOPMENT (Month 5)

**Duration:** 4 weeks  
**Objective:** Build Compliance Monitoring Center module and integrate with all modules

**Prerequisites:**
- ✅ Phase 1.1 (RMM) complete
- ✅ Phase 1.2 (VCI) complete
- ✅ Phase 1.3 (ECS) complete with all integration checkpoints validated
- ✅ ECS schema supports CMC requirements
- ✅ RLS policies allow CMC module access to ECS data
- ✅ API contracts provide CMC-required data
- ✅ Seed data covers CMC test scenarios

**Success Criteria:**
- ✅ All CMC workflows functional (scoring, disputes, reports)
- ✅ Integration with all modules working correctly
- ✅ Mock compliance scenarios tested
- ✅ Internal testing passed
- ✅ Documentation complete
- ✅ Integration checkpoints validated (ready for Phase 1.5)

---

## Subphase 1.4.1: CMC Scoring Engine (Week 1)

### CMC Backend Setup Tasks
- [ ] **Task 1.4.1.1:** Create database migration for CMC tables (compliance_scores, compliance_score_components, disputes, regulatory_reports)
- [ ] **Task 1.4.1.2:** Verify CMC schema completeness
- [ ] **Task 1.4.1.3:** Define CMC integration points with all modules
- [ ] **Task 1.4.1.4:** Implement RLS policies for CMC tables
- [ ] **Task 1.4.1.5:** Create CMC RPC function - Component score calculation
- [ ] **Task 1.4.1.6:** Implement Regulatory Reporting Compliance Rate calculation
- [ ] **Task 1.4.1.7:** Implement Stock Threshold Violation Frequency calculation
- [ ] **Task 1.4.1.8:** Implement Replenishment Plan Adherence calculation (ECS module only, if active)
- [ ] **Task 1.4.1.9:** Implement Aggregate Non-Compliance Exposure calculation
- [ ] **Task 1.4.1.10:** Implement Data Quality Signals calculation
- [ ] **Task 1.4.1.11:** Implement Critical Medicine Coverage calculation
- [ ] **Task 1.4.1.12:** Implement Export Compliance calculation (ECS module only, if active)
- [ ] **Task 1.4.1.13:** Create CMC RPC function - Total score calculation (weighted average)
- [ ] **Task 1.4.1.14:** Implement configurable component weights

---

## Subphase 1.4.2: CMC Monthly Calculation & Disputes (Week 2)

**Seed Data Gate (Required):**
- Before starting CMC frontend pages, apply the seed migration stage `seed_1_4_2_cmc` per [Phase 1.1 Playbook - Seed Strategy](phase-1-1-mockdata.md#seed-strategy-scenario-packs-deterministic)

### CMC Calculation Backend Tasks
- [ ] **Task 1.4.2.1:** Create CMC RPC function - Monthly score calculation
- [ ] **Task 1.4.2.2:** Create scheduled trigger for monthly compliance score calculation
- [ ] **Task 1.4.2.3:** Implement event-triggered score recalculation
- [ ] **Task 1.4.2.4:** Create CMC RPC function - Score freeze
- [ ] **Task 1.4.2.5:** Create CMC RPC function - Tier 2 review flag
- [ ] **Task 1.4.2.6:** Create CMC RPC function - Tier 1 score override
- [ ] **Task 1.4.2.7:** Implement adjustment notes system
- [ ] **Task 1.4.2.8:** Create CMC RPC function - Dispute creation
- [ ] **Task 1.4.2.9:** Create CMC RPC function - Dispute review
- [ ] **Task 1.4.2.10:** Create CMC RPC function - Dispute resolution

### CMC Frontend Tasks
- [ ] **Task 1.4.2.11:** Create CMC module layout and navigation
- [ ] **Task 1.4.2.12:** Implement Compliance scores list page
- [ ] **Task 1.4.2.13:** Implement Compliance score detail page
- [ ] **Task 1.4.2.14:** Implement Score override interface (Tier 1)
- [ ] **Task 1.4.2.15:** Implement Dispute creation form (Company users)
- [ ] **Task 1.4.2.16:** Implement Dispute review interface (MOH)

---

## Subphase 1.4.3: CMC Reports & Integration (Week 3)

### CMC Reports Backend Tasks
- [ ] **Task 1.4.3.1:** Create CMC RPC function - Generate regulatory report
- [ ] **Task 1.4.3.2:** Create scheduled trigger for report generation
- [ ] **Task 1.4.3.3:** Implement report analytics calculations
- [ ] **Task 1.4.3.4:** Create CMC RPC function - Report review workflow

### CMC Reports Frontend Tasks
- [ ] **Task 1.4.3.5:** Implement Regulatory reports list page
- [ ] **Task 1.4.3.6:** Implement Regulatory report detail page
- [ ] **Task 1.4.3.7:** Implement Report review interface (Tier 2 → Tier 1)
- [ ] **Task 1.4.3.8:** Implement Governance dashboard analytics (MOH Tier 1)

---

## Subphase 1.4.4: CMC Testing & Seed Data (Week 4)

### CMC Testing Tasks
- [ ] **Task 1.4.4.1:** Create CMC module test suite (unit tests for RPC functions)
- [ ] **Task 1.4.4.2:** Create integration tests - CMC workflow (monthly calculation → dispute → resolution)
- [ ] **Task 1.4.4.3:** Create integration tests - Cross-module score impact (ECS export → CMC score)
- [ ] **Task 1.4.4.4:** Create integration tests - Event-triggered recalculation

### Seed Data Tasks
- [ ] **Task 1.4.4.5:** Create seed data generation script - Compliance scores
- [ ] **Task 1.4.4.6:** Create seed data generation script - Disputes
- [ ] **Task 1.4.4.7:** Create seed data generation script - Regulatory reports
- [ ] **Task 1.4.4.8:** Execute CMC seed data population
- [ ] **Task 1.4.4.9:** Validate seed data (Nadia - integrity, Farah - realism, Hassan - test isolation)

### Documentation Tasks
- [ ] **Task 1.4.4.10:** Create CMC module user documentation
- [ ] **Task 1.4.4.11:** Phase 1.4 internal review and sign-off

---

# PHASE 1.5: HOLISTIC MVP TESTING (Month 6)

**Duration:** 4 weeks  
**Objective:** End-to-end integration testing, performance validation, security audit, and customer presentation preparation

**Prerequisites:**
- ✅ Phase 1.1 (RMM) complete
- ✅ Phase 1.2 (VCI) complete
- ✅ Phase 1.3 (ECS) complete
- ✅ Phase 1.4 (CMC) complete

**Success Criteria:**
- ✅ All modules working together correctly
- ✅ Performance targets met
- ✅ Security requirements validated
- ✅ Customer presentation materials ready
- ✅ System ready for MOH UAT

---

## Subphase 1.5.1: End-to-End Integration Testing (Week 1)

### Integration Testing Tasks
- [ ] **Task 1.5.1.1:** Create end-to-end test scenarios - Complete RMM workflow
- [ ] **Task 1.5.1.2:** Create end-to-end test scenarios - Complete VCI workflow
- [ ] **Task 1.5.1.3:** Create end-to-end test scenarios - Complete ECS workflow
- [ ] **Task 1.5.1.4:** Create end-to-end test scenarios - Complete CMC workflow
- [ ] **Task 1.5.1.5:** Create cross-module test scenarios - ECS export → CMC score impact
- [ ] **Task 1.5.1.6:** Create cross-module test scenarios - CMC score → ECS conditional validation
- [ ] **Task 1.5.1.7:** Create cross-module test scenarios - ECS authorization → VCI threshold switching
- [ ] **Task 1.5.1.8:** Create cross-module test scenarios - VCI breach → CMC score impact
- [ ] **Task 1.5.1.9:** Test data flows between all modules
- [ ] **Task 1.5.1.10:** Test module activation/deactivation scenarios
- [ ] **Task 1.5.1.11:** Test all scheduled triggers
- [ ] **Task 1.5.1.12:** Test module activation sequence (RMM→VCI→ECS→CMC dependency chain)
- [ ] **Task 1.5.1.13:** Test module deactivation impact
- [ ] **Task 1.5.1.14:** Test cross-module workflow dependencies
- [ ] **Task 1.5.1.15:** Create test data cleanup strategy

---

## Subphase 1.5.2: Performance & Security Testing (Week 2)

### Performance Testing Tasks
- [ ] **Task 1.5.2.1:** Perform load testing - 75 companies concurrent access
- [ ] **Task 1.5.2.2:** Perform load testing - Large dataset queries (2-3 years historical data)
- [ ] **Task 1.5.2.3:** Perform load testing - Dashboard performance
- [ ] **Task 1.5.2.4:** Test RLS policy performance
- [ ] **Task 1.5.2.5:** Test database query optimization
- [ ] **Task 1.5.2.6:** Test scheduled job performance
- [ ] **Task 1.5.2.7:** Measure response times (target: <2 seconds for standard operations)
- [ ] **Task 1.5.2.8:** Test concurrent submission handling

### Security Testing Tasks
- [ ] **Task 1.5.2.9:** Perform security audit - Authentication and authorization
- [ ] **Task 1.5.2.10:** Perform security audit - RLS policy enforcement
- [ ] **Task 1.5.2.11:** Perform security audit - Input validation and sanitization
- [ ] **Task 1.5.2.12:** Perform security audit - Audit logging completeness
- [ ] **Task 1.5.2.13:** Perform security audit - API security (rate limiting, error handling)
- [ ] **Task 1.5.2.14:** Test two-person rule enforcement
- [ ] **Task 1.5.2.15:** Test role-based access control (all roles, all permissions)

---

## Subphase 1.5.3: Edge Cases & Error Handling (Week 3)

### Edge Case Testing Tasks
- [ ] **Task 1.5.3.1:** Test edge cases - Late AAMS submissions
- [ ] **Task 1.5.3.2:** Test edge cases - Missing AAMS
- [ ] **Task 1.5.3.3:** Test edge cases - WSL deadline violations
- [ ] **Task 1.5.3.4:** Test edge cases - Multiple concurrent breaches
- [ ] **Task 1.5.3.5:** Test edge cases - Export authorization expiration
- [ ] **Task 1.5.3.6:** Test edge cases - Replenishment delay escalation
- [ ] **Task 1.5.3.7:** Test edge cases - Threshold switching edge cases
- [ ] **Task 1.5.3.8:** Test edge cases - CMC score calculation with missing data
- [ ] **Task 1.5.3.9:** Test edge cases - Module activation/deactivation during active workflows
- [ ] **Task 1.5.3.10:** Test error handling - Network failures, timeout scenarios
- [ ] **Task 1.5.3.11:** Test error handling - Invalid data submissions
- [ ] **Task 1.5.3.12:** Test error handling - Concurrent update conflicts
- [ ] **Task 1.5.3.13:** Test error recovery - Transaction rollbacks
- [ ] **Task 1.5.3.14:** Test audit log integrity
- [ ] **Task 1.5.3.15:** Create test coverage reporting

---

## Subphase 1.5.4: Documentation & Customer Presentation (Week 4)

### Documentation Tasks
- [ ] **Task 1.5.4.1:** Create complete system documentation (architecture overview, module documentation)
- [ ] **Task 1.5.4.2:** Create user manuals (company user guide, MOH user guide, role-specific guides)
- [ ] **Task 1.5.4.3:** Create API documentation (complete RPC function documentation, request/response schemas)
- [ ] **Task 1.5.4.4:** Create administrator documentation (deployment guide, configuration guide, troubleshooting)
- [ ] **Task 1.5.4.5:** Create seed data documentation

### Customer Presentation Tasks
- [ ] **Task 1.5.4.6:** Prepare demo scenarios (realistic workflows showcasing all modules)
- [ ] **Task 1.5.4.7:** Create presentation materials (PowerPoint, demo script, talking points)
- [ ] **Task 1.5.4.8:** Prepare demo environment (clean data set, pre-configured scenarios)
- [ ] **Task 1.5.4.9:** Create video walkthroughs (key workflows, module overviews)
- [ ] **Task 1.5.4.10:** Prepare Q&A document (anticipated questions and answers)
- [ ] **Task 1.5.4.11:** Conduct internal presentation rehearsal

### Phase 1.5 Sign-off
- [ ] **Task 1.5.4.12:** Final system review (all modules, all features)
- [ ] **Task 1.5.4.13:** Performance benchmarks validation (all targets met)
- [ ] **Task 1.5.4.14:** Security validation (all requirements met)
- [ ] **Task 1.5.4.15:** Phase 1.5 sign-off and approval for Phase 2 (MOH UAT)

---

## Phase 1 Success Criteria Summary

### Phase 1.1 (RMM)
✅ All RMM workflows functional (CRUD, approval chains, two-person rule)  
✅ Seed data successfully populated (75 companies)  
✅ Internal testing passed  
✅ Documentation complete  
✅ Integration checkpoints validated (ready for VCI)

### Phase 1.2 (VCI)
✅ All VCI workflows functional (submissions, threshold calculation, breach detection)  
✅ Integration with RMM working correctly  
✅ Seed data successfully populated  
✅ Internal testing passed  
✅ Documentation complete  
✅ Integration checkpoints validated (ready for ECS)

### Phase 1.3 (ECS)
✅ All ECS workflows functional (export requests, approvals, threshold switching)  
✅ Integration with RMM + VCI working correctly  
✅ Mock export scenarios tested  
✅ Internal testing passed  
✅ Documentation complete  
✅ Integration checkpoints validated (ready for CMC)

### Phase 1.4 (CMC)
✅ All CMC workflows functional (scoring, disputes, reports)  
✅ Integration with all modules working correctly  
✅ Mock compliance scenarios tested  
✅ Internal testing passed  
✅ Documentation complete

### Phase 1.5 (Holistic Testing)
✅ All modules working together correctly  
✅ Performance targets met  
✅ Security requirements validated  
✅ Customer presentation materials ready  
✅ System ready for MOH UAT

---

## Risk Mitigation

**Risk 1: Development Timeline Delays**
- **Mitigation:** Bite-size tasks enable parallel work, clear dependencies documented
- **Contingency:** Buffer time in each phase for catch-up

**Risk 2: Integration Issues Between Modules**
- **Mitigation:** Clear module interfaces defined in Phase 0, integration tests at each phase, integration checkpoints between phases
- **Contingency:** Additional integration testing time in Phase 1.5

**Risk 3: Seed Data Complexity**
- **Mitigation:** Seed data generation scripts created early, validated incrementally
- **Contingency:** Simplified data sets if needed, can expand later

**Risk 4: Performance Issues with 75 Companies**
- **Mitigation:** Performance testing early, query optimization, indexing strategy
- **Contingency:** Performance tuning in Phase 1.5, database optimization

---

## Team Assignments (Recommended)

**Phase 1.1 (RMM):**
- **Oliver:** Architecture oversight, integration coordination
- **Nadia:** Database migrations, RLS policies
- **Rafi:** RLS implementation, security policies
- **Maya:** RPC functions, workflow implementation
- **Salim:** Security implementation, audit logging
- **Leila:** Scheduled triggers, background jobs
- **Emma:** Frontend development, UI/UX
- **Hassan:** Testing strategy, test implementation
- **Farah:** Seed data generation oversight, analytics realism
- **Sami:** Implementation compliance enforcement

**Phase 1.2-1.5:**
- Similar team assignments with module-specific focus

---

## Specialist Pushback & Recommendations

### Architecture Pushback (Oliver)
**Concern:** Separating RMM and VCI into distinct phases may create unnecessary overhead if integration is straightforward.

**Recommendation:** Maintain separation but add a lightweight "integration validation sprint" at the end of Phase 1.1 to verify RMM→VCI integration points before full VCI development begins. This reduces risk while maintaining phase independence.

**Status:** ✅ Incorporated - Integration checkpoints added between all phases

### Database Pushback (Nadia)
**Concern:** Seed data strategy needs to be consistent across all phases to avoid data conflicts.

**Recommendation:** Establish a centralized seed data management strategy with deterministic IDs and idempotent migrations. Each phase should extend, not replace, previous phase seed data.

**Status:** ✅ Incorporated - Seed data gates and validation checkpoints added

### Security Pushback (Salim)
**Concern:** Security testing should not be deferred to Phase 1.5. Security should be validated incrementally.

**Recommendation:** Add security validation checkpoints in each phase (RLS policy testing, input validation testing) with comprehensive security audit in Phase 1.5.

**Status:** ✅ Incorporated - Security validation tasks added to each phase

### Testing Pushback (Hassan)
**Concern:** Integration testing deferred to Phase 1.5 may miss early integration issues.

**Recommendation:** Add integration testing checkpoints at the end of each phase (Phase 1.1→1.2, Phase 1.2→1.3, etc.) with comprehensive end-to-end testing in Phase 1.5.

**Status:** ✅ Incorporated - Integration checkpoints and testing tasks added to each phase

### Compliance Pushback (Sami)
**Concern:** Compliance enforcement must be consistent across all phases.

**Recommendation:** Maintain Sami's compliance validation checkpoints in every subphase with consistent enforcement rules.

**Status:** ✅ Incorporated - Compliance validation checkpoints maintained in all subphases
