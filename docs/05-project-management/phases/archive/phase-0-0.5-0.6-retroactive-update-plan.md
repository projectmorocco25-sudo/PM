# Phase 0, 0.5, 0.6 Retroactive Update Plan

**Purpose:** Update foundational phase documents to reflect learnings and changes from Phase 1 Pre-Implementation Audit  
**Date:** January 12, 2026  
**Status:** ✅ COMPLETE - All Phases (A, B, C, D, E) Complete  
**Owner:** Oliver (Chief Architect)

---

## Executive Summary

The Phase 1 Pre-Implementation Audit identified 60 issues (44 critical + 16 medium) that have now been addressed in the Phase 1 Implementation Plan. This retroactive update plan ensures that the foundational phase documents (Phase 0, Phase 0.5, Phase 0.6) are updated to:

1. Reflect their actual completion status
2. Document learnings and decisions made during Phase 1 audit
3. Ensure cross-references and traceability across all phases
4. Maintain documentation consistency

**Total Tasks:** 61-67 tasks across 5 phases  
**Estimated Duration:** 3.75-4 hours

---

## Phase Summary

| Phase | Document | Current Status | Target Status | Tasks |
|-------|----------|---------------|---------------|-------|
| **A** | Phase 0: Technical Foundation | ✅ COMPLETE (outdated) | ✅ COMPLETE (updated) | 14 tasks ✅ |
| **B** | Phase 0.5: UI/UX Wireframes | ❌ "Not Started" (incorrect) | ✅ COMPLETE | 15 tasks ✅ |
| **C** | Phase 0.6: Database Schema Audit | ⏳ "In Progress" (outdated) | ✅ COMPLETE | 13 tasks ✅ |
| **D** | Phase 1: Implementation Plan | ✅ APPROVED (needs cross-refs) | ✅ APPROVED (integrated) | 7 tasks ✅ |
| **E** | Wireframe Updates (Audit-Driven) | ⏳ Not assessed | ✅ Audited & Updated | 12 tasks ✅ |

---

# PHASE A: Update Phase 0 - Technical Foundation

**Document:** `docs/05-project-management/phases/phase-0-technical-foundation.md`  
**Current Issue:** Document shows complete but doesn't reflect Phase 1 audit learnings  
**Estimated Time:** 45 minutes

---

## Subphase A.1: Add New Architectural Decisions

**Rationale:** The Phase 1 audit identified architectural patterns that should be documented in Phase 0 as foundational decisions.

### Task A.1.1: Add Decision 6 - Module Integration Pattern
- **Location:** After Decision 5 (Notification Architecture)
- **Content to Add:**
  ```markdown
  ### Decision 6: Module Integration Pattern ✅ Locked
  - **Decision:** Define explicit integration contracts between modules (RMM→VCI, VCI→ECS, ECS→CMC)
  - **Rationale:** Clear data flow specifications prevent integration issues, ensure threshold switching works correctly
  - **Reference:** See [Module Dependency Diagram](../../02-architecture/modules/module-dependency-diagram.md)
  ```
- **Depends on:** None
- **Estimated Time:** 5 minutes

### Task A.1.2: Add Decision 7 - Testing Infrastructure Strategy
- **Location:** After Decision 6
- **Content to Add:**
  ```markdown
  ### Decision 7: Testing Infrastructure Strategy ✅ Locked
  - **Decision:** Separate test database with transaction rollback, CI/CD integration, comprehensive test fixtures
  - **Rationale:** Ensures reliable testing, prevents test data pollution, enables parallel test execution
  - **Reference:** See [Testing Framework](../../08-deployment/testing-framework.md)
  ```
- **Depends on:** Task A.1.1
- **Estimated Time:** 5 minutes

### Task A.1.3: Update Decision 4 - Background Job Architecture
- **Location:** Decision 4 (Background Job Architecture)
- **Update:** Add pg_boss reference for background job queue
- **Content to Update:**
  ```markdown
  ### Decision 4: Background Job Architecture ✅ Locked
  - **Decision:** Supabase Edge Functions + Scheduled Triggers (pg_cron) + Background Job Queue (pg_boss or similar)
  - **Rationale:** Native Supabase capabilities for scheduled jobs, pg_boss for complex job queues with retry logic
  - **Job Types:** email_notification, report_generation, data_export, scheduled_calculation
  ```
- **Depends on:** None
- **Estimated Time:** 5 minutes

---

## Subphase A.2: Add Gap Resolution Deliverables

**Rationale:** Additional architecture documents were created during Phase 1 audit that should be listed as Phase 0 deliverables.

### Task A.2.1: Add Module Integration Architecture Deliverable
- **Location:** Gap Resolution Deliverables section (after item 17)
- **Content to Add:**
  ```markdown
  18. **Module Integration Contracts** (`02-architecture/integration/integration-architecture.md`) - Data flow specifications between modules
  ```
- **Depends on:** None
- **Estimated Time:** 2 minutes

### Task A.2.2: Add Background Job Queue Specifications Deliverable
- **Location:** Gap Resolution Deliverables section
- **Content to Add:**
  ```markdown
  19. **Background Job Queue Specifications** (documented in Phase 1 Implementation Plan) - pg_boss configuration, job types, retry logic
  ```
- **Depends on:** Task A.2.1
- **Estimated Time:** 2 minutes

### Task A.2.3: Add Testing Infrastructure Specifications Deliverable
- **Location:** Gap Resolution Deliverables section
- **Content to Add:**
  ```markdown
  20. **Testing Infrastructure Specifications** (`08-deployment/testing-framework.md`) - Test database setup, CI/CD integration
  ```
- **Depends on:** Task A.2.2
- **Estimated Time:** 2 minutes

### Task A.2.4: Add Implementation Standards Deliverable
- **Location:** Gap Resolution Deliverables section
- **Content to Add:**
  ```markdown
  21. **Implementation Standards** (`05-project-management/phases/phase-1-implementation-standards.md`) - Task format, Definition of Done, testing standards
  ```
- **Depends on:** Task A.2.3
- **Estimated Time:** 2 minutes

---

## Subphase A.3: Update Related Documents Section

**Rationale:** Add cross-references to Phase 0.5, Phase 0.6, and Phase 1 documents.

### Task A.3.1: Add Phase 0.5 Reference
- **Location:** Related Documents section
- **Content to Add:**
  ```markdown
  - [Phase 0.5: UI/UX Wireframes](phase-0-5-ui-ux-wireframes.md) ✅ COMPLETE - 120 wireframes
  ```
- **Depends on:** None
- **Estimated Time:** 2 minutes

### Task A.3.2: Add Phase 0.6 Reference
- **Location:** Related Documents section
- **Content to Add:**
  ```markdown
  - [Phase 0.6: Database Schema Audit](phase-0-6-databases.md) ✅ COMPLETE - 8 critical gaps resolved
  ```
- **Depends on:** Task A.3.1
- **Estimated Time:** 2 minutes

### Task A.3.3: Add Phase 1 Implementation Plan Reference
- **Location:** Related Documents section
- **Content to Add:**
  ```markdown
  - [Phase 1 Implementation Plan](Phase-1-Implementation-Plan.md) ✅ APPROVED FOR IMPLEMENTATION
  ```
- **Depends on:** Task A.3.2
- **Estimated Time:** 2 minutes

### Task A.3.4: Add Implementation Standards Reference
- **Location:** Related Documents section
- **Content to Add:**
  ```markdown
  - [Implementation Standards](phase-1-implementation-standards.md) - Task format, Definition of Done
  ```
- **Depends on:** Task A.3.3
- **Estimated Time:** 2 minutes

---

## Subphase A.4: Update Next Phase Section

**Rationale:** Clarify the phase sequence and current status.

### Task A.4.1: Update Next Phase Information
- **Location:** Bottom of document (Next Phase section)
- **Update From:**
  ```markdown
  **Next Phase:** [Phase 0.5: UI/UX Wireframes & Design Validation](phase-0-5-ui-ux-wireframes.md) (recommended) → [Phase 1 Overview](phase-1-overview.md#phase-11-rmm-vci-development)
  ```
- **Update To:**
  ```markdown
  **Next Phase:** ✅ [Phase 0.5: UI/UX Wireframes](phase-0-5-ui-ux-wireframes.md) COMPLETE → ✅ [Phase 0.6: Database Schema Audit](phase-0-6-databases.md) COMPLETE → ✅ [Phase 1 Implementation Plan](Phase-1-Implementation-Plan.md) APPROVED
  ```
- **Depends on:** None
- **Estimated Time:** 3 minutes

### Task A.4.2: Add Phase Sequence Diagram
- **Location:** After Next Phase section
- **Content to Add:**
  ```markdown
  ## Phase Completion Sequence
  
  ```
  Phase 0: Technical Foundation ✅ COMPLETE
      ↓
  Phase 0.5: UI/UX Wireframes ✅ COMPLETE (120 wireframes)
      ↓
  Phase 0.6: Database Schema Audit ✅ COMPLETE (8 critical gaps)
      ↓
  Phase 1 Pre-Implementation Audit ✅ COMPLETE (60 issues addressed)
      ↓
  Phase 1: Implementation ✅ APPROVED FOR IMPLEMENTATION
  ```
  ```
- **Depends on:** Task A.4.1
- **Estimated Time:** 3 minutes

---

# PHASE B: Update Phase 0.5 - UI/UX Wireframes

**Document:** `docs/05-project-management/phases/phase-0-5-ui-ux-wireframes.md`  
**Current Issue:** Shows "Status: Not Started" but 120 wireframes are 100% complete  
**Estimated Time:** 50 minutes

---

## Subphase B.1: Update Header and Status

**Rationale:** Document shows incorrect status - wireframes are 100% complete.

### Task B.1.1: Update Document Status
- **Location:** Header section (line 6)
- **Update From:** `**Status:** Not Started`
- **Update To:** `**Status:** ✅ COMPLETE (January 22, 2026) - 120/120 wireframes`
- **Depends on:** None
- **Estimated Time:** 2 minutes

### Task B.1.2: Add Phase 0.6 Prerequisite
- **Location:** Prerequisites section (after Phase 0 reference)
- **Content to Add:**
  ```markdown
  - Phase 0.6 (Database Schema Audit) ✅ COMPLETE - Schema aligned with wireframes
  ```
- **Depends on:** Task B.1.1
- **Estimated Time:** 2 minutes

### Task B.1.3: Update Owner Last Updated Date
- **Location:** Bottom of document
- **Update From:** `**Last Updated:** 2025-01-15`
- **Update To:** `**Last Updated:** 2026-01-12`
- **Depends on:** Task B.1.1
- **Estimated Time:** 1 minute

---

## Subphase B.2: Add Wireframe-First Implementation Principle

**Rationale:** This principle was established during Phase 1 audit and should be referenced in Phase 0.5.

### Task B.2.1: Add Wireframe-First Principle Section
- **Location:** After "Wireframe Principles" section
- **Content to Add:**
  ```markdown
  ## ⚠️ CRITICAL: Wireframe-First Implementation Principle
  
  **📋 Complete Documentation:** See [Wireframe-First Implementation Principle](wireframe-first-implementation-principle.md)
  
  Wireframes created in this phase are the **PRIMARY design reference** for all Phase 1 frontend implementation. The principle states:
  
  1. **Review wireframe BEFORE starting any frontend task**
  2. **Wireframe defines the UI/UX** - Architecture docs support wireframes
  3. **If wireframe doesn't exist, STOP and create it first**
  4. **Verify implementation matches wireframe** before marking task complete
  
  All frontend tasks in Phase 1 Implementation Plan include wireframe references.
  ```
- **Depends on:** None
- **Estimated Time:** 5 minutes

---

## Subphase B.3: Add Pattern Document References

**Rationale:** Pattern documents support wireframe implementation and should be explicitly referenced.

### Task B.3.1: Add Pattern Documents Section
- **Location:** After Wireframe-First Principle section
- **Content to Add:**
  ```markdown
  ## Implementation Pattern References
  
  The following architecture documents provide technical implementation guidance for wireframes:
  
  | Pattern Document | Purpose | Reference |
  |-----------------|---------|-----------|
  | Navigation & Layout Patterns | Layout structure, responsive design, navigation | [navigation-layout-patterns.md](../../02-architecture/frontend/navigation-layout-patterns.md) |
  | Form Design Patterns | Form structure, validation, error handling | [form-design-patterns.md](../../02-architecture/frontend/form-design-patterns.md) |
  | Role-Based UI Patterns | Role-based access, permissions, conditional UI | [role-based-ui-patterns.md](../../02-architecture/frontend/role-based-ui-patterns.md) |
  | UI Component Specifications | Component library, design system | [ui-component-specifications.md](../../02-architecture/frontend/ui-component-specifications.md) |
  | State Management UI Patterns | Data fetching, loading states, error states | [state-management-ui-patterns.md](../../02-architecture/frontend/state-management-ui-patterns.md) |
  
  **Note:** All frontend tasks in Phase 1 Implementation Plan include references to relevant pattern documents.
  ```
- **Depends on:** Task B.2.1
- **Estimated Time:** 5 minutes

---

## Subphase B.4: Update Success Criteria

**Rationale:** All success criteria have been met and should be marked complete.

### Task B.4.1: Mark All Success Criteria Complete
- **Location:** Success Criteria section
- **Current:** Some criteria may not show ✅
- **Update:** Ensure ALL criteria show ✅ COMPLETE
- **Depends on:** None
- **Estimated Time:** 3 minutes

---

## Subphase B.5: Update Deliverables Section

**Rationale:** All deliverables have been completed and should be marked.

### Task B.5.1: Verify All Deliverables Marked Complete
- **Location:** Deliverables section
- **Action:** Verify all 7 deliverables show ✅
- **Depends on:** None
- **Estimated Time:** 3 minutes

### Task B.5.2: Add Wireframe-First Principle Deliverable
- **Location:** Deliverables section
- **Content to Add:**
  ```markdown
  8. ✅ Wireframe-First Implementation Principle - Documented and integrated into Phase 1 Implementation Plan
  ```
- **Depends on:** Task B.5.1
- **Estimated Time:** 2 minutes

---

## Subphase B.6: Update Related Documents Section

**Rationale:** Add cross-references to Phase 1 audit documents and implementation plan.

### Task B.6.1: Add Phase 1 Audit Documents References
- **Location:** Related Documents section (Phase 0.5 Planning & Decisions subsection)
- **Content to Add:**
  ```markdown
  ### Phase 1 Integration
  - [Phase 1 Implementation Plan](Phase-1-Implementation-Plan.md) - Implementation plan with wireframe references
  - [Wireframe-First Implementation Principle](wireframe-first-implementation-principle.md) - Core implementation directive
  - [Implementation Standards](phase-1-implementation-standards.md) - Task format and Definition of Done
  - [Phase 1 Audit Status Tracker](phase-1-audit-status-tracker.md) - Pre-implementation audit status
  ```
- **Depends on:** None
- **Estimated Time:** 3 minutes

---

## Subphase B.7: Update Next Phase Section

**Rationale:** Update to reflect completed phases and current status.

### Task B.7.1: Update Next Phase Information
- **Location:** Bottom of document
- **Update From:** 
  ```markdown
  **Next Phase:** [Phase 1 Overview](phase-1-overview.md#phase-11-rmm-vci-development)  
  **Status:** Not Started
  ```
- **Update To:**
  ```markdown
  **Next Phase:** ✅ [Phase 0.6: Database Schema Audit](phase-0-6-databases.md) COMPLETE → ✅ [Phase 1 Implementation Plan](Phase-1-Implementation-Plan.md) APPROVED FOR IMPLEMENTATION  
  **Status:** ✅ COMPLETE
  ```
- **Depends on:** None
- **Estimated Time:** 3 minutes

---

## Subphase B.8: Add Phase 1 Audit Integration Note

**Rationale:** Document that Phase 1 audit validated all wireframes.

### Task B.8.1: Add Audit Integration Note
- **Location:** After Recent Updates section (bottom of document)
- **Content to Add:**
  ```markdown
  **Phase 1 Pre-Implementation Audit Integration:**
  - All 120 wireframes validated during Phase 1 Pre-Implementation Audit (January 2026)
  - Wireframe references added to all frontend tasks in Phase 1 Implementation Plan
  - Pattern document references added to all frontend tasks
  - Wireframe-First Implementation Principle established and documented
  - 11 team members audited and approved wireframe-implementation alignment
  ```
- **Depends on:** None
- **Estimated Time:** 3 minutes

---

# PHASE C: Update Phase 0.6 - Database Schema Audit

**Document:** `docs/05-project-management/phases/phase-0-6-databases.md`  
**Current Issue:** Shows "In Progress" but all phases are complete  
**Estimated Time:** 45 minutes

---

## Subphase C.1: Update Header and Status

**Rationale:** Document shows "In Progress" but all 9 phases are complete.

### Task C.1.1: Update Document Status
- **Location:** Header section (line 15)
- **Update From:** `**Status:** In Progress - Phase 1 In Progress, Specifications Complete`
- **Update To:** `**Status:** ✅ COMPLETE (January 21, 2026)`
- **Depends on:** None
- **Estimated Time:** 2 minutes

### Task C.1.2: Update Last Updated Date
- **Location:** Header section (line 17)
- **Update From:** `**Last Updated:** 2025-01-21`
- **Update To:** `**Last Updated:** 2026-01-12`
- **Depends on:** Task C.1.1
- **Estimated Time:** 1 minute

---

## Subphase C.2: Add Schema Changes Summary

**Rationale:** Document the specific schema changes that were implemented.

### Task C.2.1: Add Schema Changes Summary Section
- **Location:** After "Key Deliverables Completed" section
- **Content to Add:**
  ```markdown
  **Schema Changes Implemented:**
  
  | Change # | Table | Field/Change | Type | Purpose |
  |----------|-------|--------------|------|---------|
  | 1 | users | avatar_url, timezone, language, notification_preferences | New fields | User profile preferences |
  | 2 | conversations | lifecycle_state | New field | Communication lifecycle tracking |
  | 3 | messages | delivered_at | New field | Delivery timestamp tracking |
  | 4 | follow_ups | New table | New table | Governance follow-up tracking |
  | 5 | meetings | New table | New table | Governance meeting scheduling |
  | 6 | meeting_attendees | New table | New table | Meeting attendee tracking |
  | 7 | skus | dosage_strength, dosage_form, pack_size, unit_of_measure | New fields | SKU pharmaceutical attributes |
  | 8 | Various | Indexes | Performance | Performance indexes for new fields |
  
  **Reference:** [Schema Updates - Phase 0.6 Critical Gaps](../../02-architecture/database/schema-updates-phase0-6-critical-gaps.md)
  ```
- **Depends on:** None
- **Estimated Time:** 5 minutes

---

## Subphase C.3: Add Phase 1 Integration Section

**Rationale:** Document how Phase 0.6 changes were integrated into Phase 1.

### Task C.3.1: Add Phase 1 Integration Section
- **Location:** After Schema Changes Summary
- **Content to Add:**
  ```markdown
  ## Phase 1 Implementation Plan Integration
  
  All Phase 0.6 schema changes have been integrated into the Phase 1 Implementation Plan:
  
  1. **Migration Tasks Updated:**
     - Task 1.1.1.2: Core tables migration includes new user profile fields
     - Task 1.1.1.2d: Communication tables migration includes lifecycle_state, delivered_at
     - Task 1.1.1.2e: Governance tables migration includes follow_ups, meetings, meeting_attendees
     - Task 1.1.1.7: RMM tables migration includes SKU pharmaceutical attributes
  
  2. **RLS Policies Added:**
     - Task 1.1.1.3f: RLS policies for governance tables (follow_ups, meetings, meeting_attendees)
  
  3. **RPC Functions Added:**
     - Task 1.1.1.10b-10d: RPC functions for follow_ups, meetings, meeting_attendees
  
  4. **Frontend Tasks Updated:**
     - Task 1.1.1.20d: User profile page includes avatar, timezone, language, notification preferences
     - Task 1.1.1.16g-16n: Communication components include lifecycle state handling
  
  **Reference:** [Phase 1 Implementation Plan](Phase-1-Implementation-Plan.md) - See "Phase 0.6 Updates" references in tasks
  ```
- **Depends on:** Task C.2.1
- **Estimated Time:** 5 minutes

---

## Subphase C.4: Mark All Phase Tasks Complete

**Rationale:** All phases (0-9) have been completed and checkboxes should be marked.

### Task C.4.1: Mark Phase 0 Tasks Complete
- **Location:** Phase 0: Preparation & Setup section
- **Action:** Change all `- [ ]` to `- [x]` for Phase 0 tasks
- **Depends on:** None
- **Estimated Time:** 3 minutes

### Task C.4.2: Mark Phase 1-6 Tasks Complete
- **Location:** Phases 1-6 sections
- **Action:** Change all `- [ ]` to `- [x]` for all batch tasks
- **Note:** Some may already show ⚠️ (Partially done) - update to ✅ Complete
- **Depends on:** Task C.4.1
- **Estimated Time:** 10 minutes

---

## Subphase C.5: Update Progress Indicators

**Rationale:** All progress indicators should show 100% complete.

### Task C.5.1: Update All Progress Percentages
- **Location:** Progress Update section (lines 19-26)
- **Action:** Verify all show ✅ COMPLETE (100%)
- **Depends on:** None
- **Estimated Time:** 2 minutes

---

## Subphase C.6: Add Cross-References

**Rationale:** Add links to related documents updated during audit.

### Task C.6.1: Add Cross-References Section
- **Location:** After Phase 1 Integration section
- **Content to Add:**
  ```markdown
  ## Related Documents Updated
  
  The following documents were updated as part of Phase 0.6:
  
  | Document | Updates |
  |----------|---------|
  | [schema-design.md](../../02-architecture/database/schema-design.md) | New fields and tables added |
  | [erd.md](../../02-architecture/database/erd.md) | ERD updated with new relationships |
  | [data-dictionary.md](../../02-architecture/database/data-dictionary.md) | New field definitions added |
  | [schema-updates-phase0-6-critical-gaps.md](../../02-architecture/database/schema-updates-phase0-6-critical-gaps.md) | Migration scripts for all changes |
  | [Phase 1 Implementation Plan](Phase-1-Implementation-Plan.md) | All schema changes integrated |
  ```
- **Depends on:** None
- **Estimated Time:** 3 minutes

---

## Subphase C.7: Add Next Steps Section

**Rationale:** Clarify that Phase 0.6 is complete and Phase 1 is next.

### Task C.7.1: Add Next Steps Section
- **Location:** End of document
- **Content to Add:**
  ```markdown
  ---
  
  ## Next Steps
  
  Phase 0.6 is **COMPLETE**. The next step is:
  
  **→ [Phase 1 Implementation Plan](Phase-1-Implementation-Plan.md)** - ✅ APPROVED FOR IMPLEMENTATION (January 12, 2026)
  
  All Phase 0.6 schema changes have been:
  1. ✅ Documented in schema-design.md
  2. ✅ Migration scripts created in schema-updates-phase0-6-critical-gaps.md
  3. ✅ Integrated into Phase 1 Implementation Plan tasks
  4. ✅ Validated by team audit
  
  **Implementation begins with Subphase 1.1.1: Core Foundation**
  ```
- **Depends on:** None
- **Estimated Time:** 3 minutes

---

# Implementation Checklist

## Phase A: Update Phase 0 - Technical Foundation (14 tasks) ✅ COMPLETE
- [x] A.1.1: Add Decision 6 - Module Integration Pattern ✅
- [x] A.1.2: Add Decision 7 - Testing Infrastructure Strategy ✅
- [x] A.1.3: Update Decision 4 - Background Job Architecture ✅
- [x] A.2.1: Add Module Integration Architecture Deliverable ✅
- [x] A.2.2: Add Background Job Queue Specifications Deliverable ✅
- [x] A.2.3: Add Testing Infrastructure Specifications Deliverable ✅
- [x] A.2.4: Add Implementation Standards Deliverable ✅
- [x] A.3.1: Add Phase 0.5 Reference ✅
- [x] A.3.2: Add Phase 0.6 Reference ✅
- [x] A.3.3: Add Phase 1 Implementation Plan Reference ✅
- [x] A.3.4: Add Implementation Standards Reference ✅
- [x] A.4.1: Update Next Phase Information ✅
- [x] A.4.2: Add Phase Sequence Diagram ✅

## Phase B: Update Phase 0.5 - UI/UX Wireframes (15 tasks) ✅ COMPLETE
- [x] B.1.1: Update Document Status ✅
- [x] B.1.2: Add Phase 0.6 Prerequisite ✅
- [x] B.1.3: Update Owner Last Updated Date ✅
- [x] B.2.1: Add Wireframe-First Principle Section ✅
- [x] B.3.1: Add Pattern Documents Section ✅
- [x] B.4.1: Mark All Success Criteria Complete ✅ (already complete)
- [x] B.5.1: Verify All Deliverables Marked Complete ✅ (already complete)
- [x] B.5.2: Add Wireframe-First Principle Deliverable ✅
- [x] B.6.1: Add Phase 1 Audit Documents References ✅
- [x] B.7.1: Update Next Phase Information ✅
- [x] B.8.1: Add Audit Integration Note ✅

## Phase C: Update Phase 0.6 - Database Schema Audit (13 tasks) ✅ COMPLETE
- [x] C.1.1: Update Document Status ✅
- [x] C.1.2: Update Last Updated Date ✅
- [x] C.2.1: Add Schema Changes Summary Section ✅
- [x] C.3.1: Add Phase 1 Integration Section ✅
- [x] C.4.1: Mark Phase 0 Tasks Complete ✅
- [x] C.4.2: Mark Phase 1-6 Tasks Complete ✅ (already marked in Progress Update)
- [x] C.5.1: Update All Progress Percentages ✅ (Estimated Timeline table updated)
- [x] C.6.1: Add Cross-References Section ✅
- [x] C.7.1: Add Next Steps Section ✅ (marked as complete)

## Phase D: Update Phase 1 - Implementation Plan (7 tasks)
- [ ] D.1.1: Enhance Prerequisites with Document Links
- [ ] D.2.1: Add Foundational Phase Summary
- [ ] D.3.1: Add Foundational Phases to Related Documents
- [ ] D.4.1: Add Phase 0 Reference to Task 1.1.1.1
- [ ] D.4.2: Add Phase 0.5 Reference to Frontend Setup Section
- [ ] D.4.3: Add Phase 0.6 Reference to Migration Tasks
- [ ] D.5.1: Add Retroactive Update Note to Audit Notes

## Phase E: Wireframe Updates - Audit-Driven (12 tasks) ✅ COMPLETE
- [x] E.1.1: Audit SKU Form Wireframe ✅ (Already complete - all validation present)
- [x] E.1.2: Audit WSL Submission Form Wireframe ✅ (Already complete - replenishment validation present)
- [x] E.1.3: Audit AAMS Submission Form Wireframe ✅ (Enhanced with explicit error states)
- [x] E.1.4: Audit MSQ Submission Form Wireframe ✅ (Enhanced with explicit error states)
- [x] E.1.5: Audit Profile Page Wireframe ✅ (Already complete - Phase 0.6 fields present)
- [x] E.2.1: Assess Testing Dashboard Wireframe Need ✅ (NOT NEEDED - dev tooling)
- [x] E.2.2: Assess Job Queue Monitor Wireframe Need ✅ (NOT NEEDED - use Supabase)
- [x] E.2.3: Assess Data Export Page Wireframe Need ✅ (NOT NEEDED - modal sufficient)
- [x] E.3.1: Create Testing Dashboard Wireframe ✅ (SKIPPED - not needed)
- [x] E.3.2: Create Job Queue Monitor Wireframe ✅ (SKIPPED - not needed)
- [x] E.3.3: Create Data Export Page Wireframe ✅ (SKIPPED - not needed)
- [x] E.4.1: Update Wireframe Index ✅ (SKIPPED - no new wireframes)
- [x] E.4.2: Update Phase 0.5 Recent Updates ✅
- [x] E.4.3: Update Wireframe-to-Component Mapping ✅ (SKIPPED - no new wireframes)

---

# PHASE D: Update Phase 1 Implementation Plan

**Document:** `docs/05-project-management/phases/Phase-1-Implementation-Plan.md`  
**Current Issue:** Phase 1 should reference the updated Phase 0, 0.5, 0.6 documents for traceability  
**Estimated Time:** 30 minutes

---

## Subphase D.1: Update Prerequisites Section

**Rationale:** Prerequisites section should clearly reference all completed foundational phases.

### Task D.1.1: Enhance Prerequisites with Document Links
- **Location:** Prerequisites section (lines 5-9)
- **Current:**
  ```markdown
  **Prerequisites:** 
  - Phase 0 (Technical Foundation) ✅ COMPLETE
  - Phase 0.5 (UI/UX Wireframes) ✅ COMPLETE - See [Phase 0.5: UI/UX Wireframes & Design Validation](phase-0-5-ui-ux-wireframes.md)
  - Phase 0.6 (Database Schema Audit) ✅ COMPLETE - See [Phase 0.6: Database Schema Audit](phase-0-6-databases.md)
  - **Phase 1 Pre-Implementation Audit** ✅ COMPLETE - See [Phase 1 Audit Status Tracker](phase-1-audit-status-tracker.md)
  ```
- **Update To:**
  ```markdown
  **Prerequisites:** 
  - Phase 0 (Technical Foundation) ✅ COMPLETE - See [Phase 0: Technical Foundation](phase-0-technical-foundation.md)
    - Architectural decisions documented (7 key decisions)
    - Security framework established
    - Development environment operational
  - Phase 0.5 (UI/UX Wireframes) ✅ COMPLETE - See [Phase 0.5: UI/UX Wireframes](phase-0-5-ui-ux-wireframes.md)
    - 120 wireframes created and approved
    - Wireframe-First Implementation Principle established
    - Pattern document references integrated
  - Phase 0.6 (Database Schema Audit) ✅ COMPLETE - See [Phase 0.6: Database Schema Audit](phase-0-6-databases.md)
    - 8 critical schema gaps identified and resolved
    - Schema changes integrated into migration tasks
    - Migration scripts created
  - **Phase 1 Pre-Implementation Audit** ✅ COMPLETE - See [Phase 1 Audit Status Tracker](phase-1-audit-status-tracker.md)
    - 60 issues addressed (44 critical + 16 medium)
    - All 11 team members audited and approved
  ```
- **Depends on:** None
- **Estimated Time:** 5 minutes

---

## Subphase D.2: Add Foundational Phase Summary Section

**Rationale:** Add a clear summary of what was established in foundational phases for implementers.

### Task D.2.1: Add Foundational Phase Summary
- **Location:** After "Pre-Implementation Audit Status" section (after line 80)
- **Content to Add:**
  ```markdown
  ---
  
  ## Foundational Phase Summary
  
  Before beginning implementation, review these key deliverables from foundational phases:
  
  ### From Phase 0: Technical Foundation
  | Decision | Description | Reference |
  |----------|-------------|-----------|
  | Module Communication | Direct database access via Supabase, RLS enforces boundaries | [system-architecture.md](../../02-architecture/system-architecture.md) |
  | Workflow Engine | Database-driven state machines (status columns + RPC functions) | [workflow-architecture.md](../../02-architecture/workflow-architecture.md) |
  | Audit Logging | Separate audit log table with hash chaining | [audit-logging-spec.md](../../02-architecture/security/audit-logging-spec.md) |
  | Background Jobs | Edge Functions + pg_cron + pg_boss for job queues | [edge-functions.md](../../02-architecture/api/edge-functions.md) |
  | Notifications | In-app system as system of record | [system-architecture.md](../../02-architecture/system-architecture.md) |
  | Module Integration | Explicit contracts between RMM→VCI→ECS→CMC | [module-dependency-diagram.md](../../02-architecture/modules/module-dependency-diagram.md) |
  | Testing Infrastructure | Separate test database, CI/CD integration | [testing-framework.md](../../08-deployment/testing-framework.md) |
  
  ### From Phase 0.5: UI/UX Wireframes
  - **120 wireframes** define all UI/UX specifications
  - **Wireframe-First Principle:** Wireframes are PRIMARY design reference
  - **Wireframe Index:** [wireframe-index.md](../../04-design/user-experience/wireframes/06-documentation/wireframe-index.md)
  - **Component Mapping:** [wireframe-to-component-mapping.md](../../04-design/user-experience/wireframes/06-documentation/wireframe-to-component-mapping.md)
  
  ### From Phase 0.6: Database Schema Audit
  | Schema Change | Tables Affected | Migration Reference |
  |---------------|-----------------|---------------------|
  | User profile fields | users | Task 1.1.1.2 |
  | Communication lifecycle | conversations, messages | Task 1.1.1.2d |
  | Governance tables | follow_ups, meetings, meeting_attendees | Task 1.1.1.2e |
  | SKU pharmaceutical attributes | skus | Task 1.1.1.7 |
  
  **Schema Changes Document:** [schema-updates-phase0-6-critical-gaps.md](../../02-architecture/database/schema-updates-phase0-6-critical-gaps.md)
  ```
- **Depends on:** None
- **Estimated Time:** 10 minutes

---

## Subphase D.3: Update Related Documents Section

**Rationale:** Ensure Phase 1 references all foundational phase documents.

### Task D.3.1: Add Foundational Phases to Related Documents
- **Location:** End of document, before or after "Historical Data Implementation" section
- **Content to Add:**
  ```markdown
  ---
  
  ## Foundational Phase Documents
  
  These foundational phases must be reviewed before implementation:
  
  | Phase | Document | Key Deliverables |
  |-------|----------|------------------|
  | Phase 0 | [Technical Foundation](phase-0-technical-foundation.md) | Architecture decisions, security framework, CI/CD |
  | Phase 0.5 | [UI/UX Wireframes](phase-0-5-ui-ux-wireframes.md) | 120 wireframes, wireframe-first principle |
  | Phase 0.6 | [Database Schema Audit](phase-0-6-databases.md) | Schema gap analysis, migration scripts |
  | Retroactive Updates | [Retroactive Update Plan](phase-0-0.5-0.6-retroactive-update-plan.md) | Phase integration documentation |
  
  **Implementation Standards:** [phase-1-implementation-standards.md](phase-1-implementation-standards.md)
  ```
- **Depends on:** None
- **Estimated Time:** 5 minutes

---

## Subphase D.4: Add Cross-Reference Notes to Key Tasks

**Rationale:** Add notes to key tasks referencing relevant foundational phase decisions.

### Task D.4.1: Add Phase 0 Reference to Task 1.1.1.1
- **Location:** Task 1.1.1.1 (Initialize Supabase project structure)
- **Content to Add:** After task description
  ```markdown
  - **Phase 0 Reference:** See [Phase 0: Technical Foundation](phase-0-technical-foundation.md) - Decision 1 (Module Communication), Decision 4 (Background Jobs)
  ```
- **Depends on:** None
- **Estimated Time:** 2 minutes

### Task D.4.2: Add Phase 0.5 Reference to Frontend Setup Section
- **Location:** Frontend Setup Tasks section header (around line 408)
- **Content to Add:** After "### Frontend Setup Tasks"
  ```markdown
  **⚠️ IMPORTANT:** All frontend tasks must follow the Wireframe-First Implementation Principle. See [Phase 0.5: UI/UX Wireframes](phase-0-5-ui-ux-wireframes.md) for wireframe index and component mapping.
  ```
- **Depends on:** None
- **Estimated Time:** 2 minutes

### Task D.4.3: Add Phase 0.6 Reference to Migration Tasks
- **Location:** Task 1.1.1.2 (Core tables migration)
- **Content to Add:** After existing references
  ```markdown
  - **Phase 0.6 Reference:** See [Phase 0.6: Database Schema Audit](phase-0-6-databases.md) for gap analysis and [schema-updates-phase0-6-critical-gaps.md](../../02-architecture/database/schema-updates-phase0-6-critical-gaps.md) for migration scripts
  ```
- **Depends on:** None
- **Estimated Time:** 2 minutes

---

## Subphase D.5: Update Audit Notes Section

**Rationale:** Document that retroactive updates were made to foundational phases.

### Task D.5.1: Add Retroactive Update Note to Audit Notes
- **Location:** Audit Notes section (around line 1385)
- **Content to Add:** After "**Last Updated:**" line
  ```markdown
  
  **Retroactive Phase Updates (January 12, 2026):**
  - Phase 0, 0.5, and 0.6 documents updated to reflect Phase 1 audit learnings
  - Cross-references added between all phases
  - Phase completion sequence documented
  - See [Retroactive Update Plan](phase-0-0.5-0.6-retroactive-update-plan.md) for details
  ```
- **Depends on:** None
- **Estimated Time:** 3 minutes

---

## Phase D Implementation Checklist ✅ COMPLETE

- [x] D.1.1: Enhance Prerequisites with Document Links ✅
- [x] D.2.1: Add Foundational Phase Summary ✅
- [x] D.3.1: Add Foundational Phases to Related Documents ✅
- [x] D.4.1: Add Phase 0 Reference to Task 1.1.1.1 ✅
- [x] D.4.2: Add Phase 0.5 Reference to Frontend Setup Section ✅
- [x] D.4.3: Add Phase 0.6 Reference to Migration Tasks ✅
- [x] D.5.1: Add Retroactive Update Note to Audit Notes ✅

---

# PHASE E: Wireframe Updates Based on Audit Findings

**Document:** Various wireframe files in `docs/04-design/user-experience/wireframes/`  
**Current Issue:** Audit findings identified validation specifications and new features that may require wireframe updates  
**Estimated Time:** 60 minutes

---

## Subphase E.1: Audit Existing Wireframes Against Validation Specs

**Rationale:** Audit findings identified specific validation requirements that should be reflected in wireframe error states.

### Task E.1.1: Audit SKU Form Wireframe
- **Location:** `docs/04-design/user-experience/wireframes/01-rmm/skus/task-0.5.2.10-sku-create-edit-form.md`
- **Audit Finding:** Issue #5 - SKU Pharmaceutical Attributes Validation
- **Check For:** Validation error states for dosage_strength, dosage_form, pack_size, unit_of_measure
- **Action:** If missing, add validation error state annotations
- **Depends on:** None
- **Estimated Time:** 10 minutes

### Task E.1.2: Audit WSL Submission Form Wireframe
- **Location:** `docs/04-design/user-experience/wireframes/02-vci/wsl/task-0.5.3.12-wsl-submission-form.md`
- **Audit Finding:** Issue #6 - Replenishment Date Validation
- **Check For:** Validation error states for replenishment date (future date, within 90 days, format)
- **Action:** If missing, add validation error state annotations
- **Depends on:** None
- **Estimated Time:** 10 minutes

### Task E.1.3: Audit AAMS Submission Form Wireframe
- **Location:** `docs/04-design/user-experience/wireframes/02-vci/aams/task-0.5.3.2-aams-submission-form.md`
- **Audit Finding:** Issue #4 - Submission Data Structure Validation
- **Check For:** Validation error states for array structure, sku_id validation, quantity validation
- **Action:** If missing, add validation error state annotations
- **Depends on:** None
- **Estimated Time:** 10 minutes

### Task E.1.4: Audit MSQ Submission Form Wireframe
- **Location:** `docs/04-design/user-experience/wireframes/02-vci/msq/task-0.5.3.10-msq-submission-form.md`
- **Audit Finding:** Issue #4 - Submission Data Structure Validation
- **Check For:** Validation error states for SKU_ID + Quantity data structure
- **Action:** If missing, add validation error state annotations
- **Depends on:** None
- **Estimated Time:** 5 minutes

### Task E.1.5: Audit Profile Page Wireframe
- **Location:** `docs/04-design/user-experience/wireframes/00-core-foundation/dashboard/task-0.5.1.22-profile-page.md`
- **Audit Finding:** Phase 0.6 - New user profile fields (avatar_url, timezone, language, notification_preferences)
- **Check For:** Fields for avatar upload, timezone selection, language preference, notification settings
- **Action:** If missing, add field annotations
- **Depends on:** None
- **Estimated Time:** 10 minutes

---

## Subphase E.2: Assess Need for New Wireframes

**Rationale:** Audit findings identified new features that may require dedicated wireframes.

### Task E.2.1: Assess Testing Dashboard Wireframe Need
- **Audit Finding:** Issues #32-36 - Testing specifications
- **Question:** Do QA/developers need a testing dashboard UI in the application?
- **Assessment Criteria:** 
  - If testing is backend-only with external tools (Jest, Playwright) → No wireframe needed
  - If admin dashboard needs test status visibility → Create wireframe
- **Recommendation:** ❓ TBD - Likely NOT needed (testing is dev tooling, not application UI)
- **Estimated Time:** 5 minutes (assessment only)

### Task E.2.2: Assess Job Queue Monitor Wireframe Need
- **Audit Finding:** Issues #28, #31 - Background Job Queue specifications
- **Question:** Does admin dashboard need job queue monitoring UI?
- **Assessment Criteria:**
  - If using external monitoring (Supabase dashboard, pg_boss UI) → No wireframe needed
  - If in-app monitoring needed → Create wireframe
- **Recommendation:** ❓ TBD - Likely NOT needed (use Supabase dashboard for monitoring)
- **Estimated Time:** 5 minutes (assessment only)

### Task E.2.3: Assess Data Export Page Wireframe Need
- **Audit Finding:** Issue #57 - Data Export specifications
- **Question:** Is Export Options Modal (Task 0.5.8.5) sufficient, or is a full page needed?
- **Assessment Criteria:**
  - If export is always modal-based → No new wireframe needed
  - If bulk export needs dedicated page → Create wireframe
- **Recommendation:** ❓ TBD - Likely modal is sufficient
- **Estimated Time:** 5 minutes (assessment only)

---

## Subphase E.3: Create New Wireframes (If Needed)

**Rationale:** Based on Subphase E.2 assessments, create any required new wireframes.

### Task E.3.1: Create Testing Dashboard Wireframe (CONDITIONAL)
- **Condition:** Only if Task E.2.1 determines wireframe is needed
- **Location:** `docs/04-design/user-experience/wireframes/00-core-foundation/admin/task-0.5.x.x-testing-dashboard.md`
- **Content:** Test status overview, test run history, coverage metrics
- **Estimated Time:** 20 minutes (if needed)

### Task E.3.2: Create Job Queue Monitor Wireframe (CONDITIONAL)
- **Condition:** Only if Task E.2.2 determines wireframe is needed
- **Location:** `docs/04-design/user-experience/wireframes/00-core-foundation/admin/task-0.5.x.x-job-queue-monitor.md`
- **Content:** Job queue status, pending jobs, failed jobs, retry controls
- **Estimated Time:** 20 minutes (if needed)

### Task E.3.3: Create Data Export Page Wireframe (CONDITIONAL)
- **Condition:** Only if Task E.2.3 determines wireframe is needed
- **Location:** `docs/04-design/user-experience/wireframes/00-core-foundation/global/task-0.5.x.x-data-export-page.md`
- **Content:** Export type selection, date range, format options, download history
- **Estimated Time:** 20 minutes (if needed)

---

## Subphase E.4: Update Wireframe Documentation

**Rationale:** Document all wireframe changes and update indexes.

### Task E.4.1: Update Wireframe Index
- **Location:** `docs/04-design/user-experience/wireframes/06-documentation/wireframe-index.md`
- **Action:** Add entries for any new wireframes created in E.3
- **Depends on:** Tasks E.3.1, E.3.2, E.3.3
- **Estimated Time:** 5 minutes

### Task E.4.2: Update Phase 0.5 Recent Updates
- **Location:** `docs/05-project-management/phases/phase-0-5-ui-ux-wireframes.md`
- **Action:** Add entry for audit-driven wireframe updates
- **Content to Add:**
  ```markdown
  - 2026-01-12: Post-audit wireframe review completed. Validation error states verified/added to form wireframes (SKU, WSL, AAMS, MSQ). Profile page verified for Phase 0.6 fields. Assessment completed for Testing Dashboard, Job Queue Monitor, and Data Export Page wireframe needs.
  ```
- **Depends on:** All E.1 and E.2 tasks
- **Estimated Time:** 5 minutes

### Task E.4.3: Update Wireframe-to-Component Mapping
- **Location:** `docs/04-design/user-experience/wireframes/06-documentation/wireframe-to-component-mapping.md`
- **Action:** If new wireframes created, add component mappings
- **Depends on:** Tasks E.3.1, E.3.2, E.3.3
- **Estimated Time:** 5 minutes

---

## Phase E Task Checklist

## Phase E: Wireframe Updates (12-18 tasks depending on assessments)
- [ ] E.1.1: Audit SKU Form Wireframe
- [ ] E.1.2: Audit WSL Submission Form Wireframe
- [ ] E.1.3: Audit AAMS Submission Form Wireframe
- [ ] E.1.4: Audit MSQ Submission Form Wireframe
- [ ] E.1.5: Audit Profile Page Wireframe
- [ ] E.2.1: Assess Testing Dashboard Wireframe Need
- [ ] E.2.2: Assess Job Queue Monitor Wireframe Need
- [ ] E.2.3: Assess Data Export Page Wireframe Need
- [ ] E.3.1: Create Testing Dashboard Wireframe (CONDITIONAL)
- [ ] E.3.2: Create Job Queue Monitor Wireframe (CONDITIONAL)
- [ ] E.3.3: Create Data Export Page Wireframe (CONDITIONAL)
- [ ] E.4.1: Update Wireframe Index
- [ ] E.4.2: Update Phase 0.5 Recent Updates
- [ ] E.4.3: Update Wireframe-to-Component Mapping

---

## Updated Summary

| Phase | Document | Tasks | Time Estimate |
|-------|----------|-------|---------------|
| **Phase A** | Phase 0: Technical Foundation | 14 tasks | 45 min ✅ |
| **Phase B** | Phase 0.5: UI/UX Wireframes | 15 tasks | 50 min ✅ |
| **Phase C** | Phase 0.6: Database Schema Audit | 13 tasks | 45 min ✅ |
| **Phase D** | Phase 1: Implementation Plan | 7 tasks | 30 min |
| **Phase E** | Wireframe Updates (Audit-Driven) | 12 tasks | 30 min ✅ |
| **TOTAL** | | **61 tasks** | **~3.25 hours** |

---

## Implementation Priority

**Recommended Order:**
1. ✅ **Phase B first** (Phase 0.5 status is completely wrong - shows "Not Started" vs 100% complete) - **COMPLETE**
2. ✅ **Phase E second** (Wireframe updates should happen while Phase 0.5 is fresh) - **COMPLETE**
3. ✅ **Phase C third** (Phase 0.6 status is outdated - shows "In Progress" vs complete) - **COMPLETE**
4. ✅ **Phase A fourth** (Phase 0 just needs audit learning additions) - **COMPLETE**
5. ✅ **Phase D last** (Phase 1 needs cross-references to updated foundational phases) - **COMPLETE**

---

## Success Criteria

- [x] All three foundational phase documents show correct completion status (Phase B ✅, Phase C ✅)
- [x] Cross-references exist between all phases (including Phase 1) - Phase C ✅
- [x] Phase 1 audit learnings documented in foundational phases (Phase A ✅)
- [x] Schema changes from Phase 0.6 properly documented (Phase C ✅)
- [x] Wireframe-First Implementation Principle referenced in Phase 0.5 (Phase B ✅)
- [x] Pattern document references added to Phase 0.5 (Phase B ✅)
- [x] Phase sequence clearly documented in all phases (Phase A ✅, Phase D ✅)
- [x] Phase 1 Implementation Plan references all foundational phases (Phase D ✅)
- [x] Foundational Phase Summary added to Phase 1 Implementation Plan (Phase D ✅)
- [x] Retroactive update note added to Phase 1 Audit Notes (Phase D ✅)
- [x] Wireframes audited against validation specifications (Phase E) ✅
- [x] New wireframe needs assessed (Phase E) ✅ (None needed)
- [x] Wireframe documentation updated (Phase E) ✅

**✅ ALL SUCCESS CRITERIA MET - RETROACTIVE UPDATE PLAN COMPLETE**

---

**Document Created:** January 12, 2026  
**Owner:** Oliver (Chief Architect)  
**Ready for Implementation:** Yes
