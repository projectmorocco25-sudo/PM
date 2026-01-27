# Phase File Structure Template

**Purpose:** Template for creating phase-specific implementation files (e.g., `phase-1-1-rmm.md`, `phase-1-2-vci.md`)  
**Owner:** Yasmine (Project Manager) + Sami (Implementation Compliance Specialist) + Oliver (Technical Lead)  
**Last Updated:** 2026-01-26

---

## 📋 Template Usage

This template provides the structure for phase-specific implementation files using the **Modular Task Registry Architecture**.

**Architecture Overview:**
- **Main Phase File:** Registry/index pattern - links to individual task files (~200-450 lines)
- **Task Files:** Individual files in `phase-X-Y/tasks/` directory (~100-200 lines each)
- **Task Templates:** Reusable templates in `standards/task-templates/` for creating task files

When creating a new phase file:

1. Copy this template
2. Replace `[PHASE-X.Y]` placeholders with actual phase identifiers
3. Replace `[MODULE-NAME]` with the module name (RMM, VCI, ECS, CMC, HMVPT)
4. Create directory structure: `phase-X-Y/tasks/frontend/`, `phase-X-Y/tasks/backend/`, `phase-X-Y/tasks/migrations/`
5. Create task files using templates from `standards/task-templates/`
6. Link to task files from main phase file (registry pattern)
7. Ensure all verification tasks are added before implementation tasks
8. Add migration apply/verify tasks after each migration creation task

**📋 Task Templates:**
- [Frontend Task Template](./task-templates/frontend-task-template.md) - For frontend implementation tasks
- [Backend Task Template](./task-templates/backend-task-template.md) - For backend implementation tasks
- [Migration Task Template](./task-templates/migration-task-template.md) - For database migration tasks

---

# Phase [PHASE-X.Y]: [MODULE-NAME] Development

**Phase:** Phase [X.Y] - [Module Name] Development  
**Duration:** [X weeks/months]  
**Status:** ⏳ **AWAITING IMPLEMENTATION**  
**Document Version:** 1.0

---

## 🚨 **READ THIS FIRST: COMPLIANCE RULES ARE MANDATORY**

**⚠️ CRITICAL:** Before starting ANY task, you MUST read and follow the compliance rules. Non-compliance will result in immediate task rejection.

**📋 [COMPLIANCE RULES - READ NOW](./compliance-rules.md)** ← **CLICK HERE FIRST**

**Key Points:**
- ✅ Every task requires compliance verification before starting
- ✅ Every PR must include a compliance section (see format in compliance rules)
- ✅ Wireframe binding is mandatory for all frontend tasks
- ✅ No local mock data - Supabase queries only
- ✅ Sequential task execution - no skipping tasks
- ✅ Sami has STOP authority - compliance violations = immediate stop
- ✅ **Verification tasks (wireframe, database, API) must be completed BEFORE implementation tasks**

**If you skip reading the compliance rules, your work will be rejected.**

**Prerequisites:** 
- [List prerequisite phases/tasks that must be complete]
- Phase 0 (Technical Foundation) ✅ COMPLETE
- Phase 0.5 (UI/UX Wireframes) ✅ COMPLETE
- Phase 0.6 (Database Schema Audit) ✅ COMPLETE

---

## Executive Summary

[Brief description of what this phase delivers]

**Success Criteria:**
- ✅ [Success criterion 1]
- ✅ [Success criterion 2]
- ✅ [Success criterion 3]
- ✅ [Success criterion 4]

**Integration Checkpoint (After Phase [X.Y]):**
Before Phase [X.Y+1] can begin, the following must be validated:
1. **Data Model Validation:** [Validation requirement]
2. **RLS Policy Validation:** [Validation requirement]
3. **API Contract Validation:** [Validation requirement]
4. **Seed Data Validation:** [Validation requirement]

**Gate:** Phase [X.Y+1] cannot start until all validations pass.

---

## Task Organization

**📁 Task Definitions:** All detailed task definitions are in `phase-[X.Y]/tasks/` directory  
**📋 Task Templates:** See `standards/task-templates/` for reusable task structures  
**🔗 Task Registry:** This file serves as the index/registry of all tasks

**Directory Structure:**
```
phase-[X.Y]/
├── README.md                        # Task organization guide
└── tasks/
    ├── frontend/                    # Frontend task files
    ├── backend/                     # Backend task files
    └── migrations/                 # Migration task files
```

---

## 🔒 COMPLIANCE ENFORCEMENT (Sami - Implementation Compliance Specialist)

**🚨 MANDATORY:** Every developer and AI agent MUST read and follow compliance rules. Non-compliance = immediate task rejection.

**📋 Complete Compliance Rules:** 
- **🔴 PRIMARY SOURCE:** [Compliance Rules](./compliance-rules.md) ← **READ THIS FIRST** - Complete 9-item pre-task verification checklist that must be verified before EVERY task
- **Cursor AI Enforcement:** [.cursor/rules/wireframe_db_compliance.md](../../.cursor/rules/wireframe_db_compliance.md) - Auto-loaded technical enforcement rules for AI agents during code generation

**⚠️ COMPLIANCE CHECKLIST (Quick Reference):**
1. ✅ Read [Compliance Rules](./compliance-rules.md) before starting
2. ✅ Verify all previous tasks are complete (sequential execution)
3. ✅ Complete verification tasks (wireframe, database, API) BEFORE implementation
4. ✅ Review wireframe before frontend work
5. ✅ No local mocks - Supabase queries only
6. ✅ Add wireframe binding comments to code
7. ✅ Include compliance section in PR description
8. ✅ Get Sami's approval before marking task complete

**Key Requirements:**
- Sequential Task Verification - All previous tasks must be complete
- **Verification Tasks First** - Wireframe, Database, and API verification tasks must be completed before implementation tasks
- Role Name Verification - Frontend role names must match database schema exactly
- Schema Verification - Verify database schema before role-dependent code
- Integration Verification - Layout/components must be integrated into routes
- Role Coverage Verification - All 9 roles must be handled
- Wireframe compliance - Review wireframe before starting
- No local mock data - Query Supabase only
- Wireframe binding - Add binding comments to code
- **Migration Workflow** - Apply and verify migrations after creation

**Sami's Stop Authority:** If any compliance rule is violated, Sami must **STOP** implementation immediately.

**📋 Implementation Summary Compliance Requirement:** See [Compliance Rules - Implementation Summary Compliance Requirement](./compliance-rules.md#implementation-summary-compliance-requirement-mandatory) for the complete requirement, format template, and mandatory elements.

**🔒 HARD GATES: Wireframe + Database Compliance (Non-Negotiable):** See [Compliance Rules - Hard Gates](./compliance-rules.md#hard-gates-non-negotiable) for complete details. These gates apply to **every** Phase 1 frontend page/component. If a gate is not met, the task is **not complete** and the PR must not merge.

**📋 PR Description Checklist:** See [Compliance Rules - PR Description Checklist](./compliance-rules.md#pr-description-checklist-required) for the complete 9-item checklist that every frontend task PR must include.

**⚠️ Wireframe-First Implementation Principle:** See [Compliance Rules - Wireframe-First Implementation Principle](./compliance-rules.md#wireframe-first-implementation-principle) for complete requirements. Wireframes are the PRIMARY design reference - If there is any conflict or ambiguity, the wireframe takes precedence.

---

## Subphase [X.Y.Z]: [Subphase Name] (Week [N])

**Status:** ⏳ **AWAITING IMPLEMENTATION** - No tasks have been started. All implementation tasks are pending.  
**Task Directory:** `phase-[X.Y]/tasks/`

**🔒 COMPLIANCE VALIDATION (Sami - Required Before ANY Task):**

**⚠️ STOP AUTHORITY:** Sami (Implementation Compliance Specialist) has **MANDATORY STOP AUTHORITY**. If ANY compliance rule is violated, implementation **MUST STOP IMMEDIATELY**. No exceptions.

**Before starting ANY task in this subphase, the following MUST be verified and documented:**

- [ ] **1. Sequential Task Verification (MANDATORY):** All prerequisite phases/tasks are complete. **NO TASK CAN START UNTIL ALL PREREQUISITES ARE COMPLETE.** Sami verifies this before every task. Starting a task out of sequence is a **COMPLIANCE VIOLATION**.
- [ ] **2. Role Name Verification:** Frontend role names match database schema exactly; role constants match `users.role` enum values; no hardcoded role strings (use constants).
- [ ] **3. Schema Verification:** Database schema verified before role-dependent code; all required tables/fields/RLS policies exist; Phase 0.6 schema additions incorporated where applicable.
- [ ] **4. Integration Verification:** Layout/components integrated into routes (if applicable); navigation updated (if new routes added); module routing structure updated.
- [ ] **5. Role Coverage Verification:** All 9 roles are handled where applicable (Company Admin, Company Manager, Company User, MOH Tier 1, MOH Tier 2 Officer, MOH Tier 2 Registrar, MOH Auditor, System Admin, Vendor); role variants match wireframe specifications.
- [ ] **6. Wireframe Compliance:** Wireframe reviewed before starting; wireframe task ID(s) identified; wireframe requirements understood (layout, interactions, states, role-based variations); wireframe annotations reviewed.
- [ ] **7. Data Source Verification:** NO local mock data used (NO `const mockData = [...]`, NO `mockData.ts`, NO runtime mocks); all data queries Supabase database; seed data applied if required (verify via `supabase migration list`); database tables verified before starting (use SQL queries).
- [ ] **8. Wireframe Binding:** Wireframe binding comments will be added to code (JSDoc format with wireframe link); wireframe task ID(s) documented in code comments; PR description will include wireframe link(s); wireframe binding in both PR description AND codebase.
- [ ] **9. Seed Data Gate (If Applicable):** Seed migration `[seed-name]` applied and verified (see below for verification requirements); seed data acceptance criteria verified; RLS validation completed if required; seed data covers wireframe scenarios.
- [ ] **Wireframe-First Implementation Principle:** Wireframes are the PRIMARY design reference. If a wireframe doesn't exist, **STOP** and create it first. See [Compliance Rules - Wireframe-First Implementation Principle](./compliance-rules.md#wireframe-first-implementation-principle) for complete requirements.
- [ ] **Sami's Compliance Checklist:** Will be used for EVERY task in this subphase. **No task proceeds without Sami's approval.**
- [ ] **Sami's Approval:** Compliance review completed and approved by Sami before task start. **MANDATORY - No task can proceed without this approval.**
- [ ] **Implementation Summary Compliance Section:** After task completion, implementation summary MUST include compliance section documenting all rules followed (see "Implementation Summary Compliance Requirement" section above). **PRs without compliance section will be REJECTED.**
- [ ] **PR Description Checklist:** See [Compliance Rules - PR Description Checklist](./compliance-rules.md#pr-description-checklist-required) for the complete 9-item checklist that every frontend task PR must include.

**🚫 STOP CONDITIONS (Do Not Proceed):**

**STOP implementation and resolve before proceeding** if any of the following is true:

- **Prerequisites Incomplete:** Prerequisite phases/tasks are not complete. **STOP** and complete prerequisites first.
- **Wireframe Requirements:** No wireframe link exists for the page/route being implemented. **STOP** and request/produce the wireframe first. Do not guess layouts, flows, or states.
- **Database & Schema Requirements:** Required DB table/field/RPC does not exist yet. **STOP** and implement the missing backend task first. Do not create local mocks as a workaround.
- **Security & Access Requirements:** RLS/policies prevent required access for the wireframed role. **STOP** and implement/update RLS policies before proceeding.
- **Seed Data Requirements:** Seed migration is not idempotent (must use deterministic IDs + UPSERT patterns) or not applied. **STOP** and fix/apply migration first.
- **Sequential Execution:** Previous tasks are not complete. **STOP** and complete all prerequisite tasks first.
- **Role Name Mismatch:** Frontend role names don't match database schema. **STOP** and fix role names to match schema exactly.
- **Verification Tasks Incomplete:** Wireframe, database, or API verification tasks are not complete. **STOP** and complete verification tasks first.

**Prerequisites:**
- [List specific prerequisites for this subphase]

**Seed Data Gate (If Applicable):**
- Before starting [specific work], apply the seed migration stage `[seed-name]` per [Seed Data Playbook](./planning/seed-data-playbook.md#stage-[seed-name]) (versioned SQL migrations, idempotent).

---

### [Task Category] Tasks

**⚠️ IMPORTANT:** This phase file uses the **Modular Task Registry Architecture**. Task details are in individual files, not inline.

**Creating New Tasks:**
1. Use appropriate template from `standards/task-templates/`:
   - Frontend tasks → [frontend-task-template.md](./task-templates/frontend-task-template.md)
   - Backend tasks → [backend-task-template.md](./task-templates/backend-task-template.md)
   - Migration tasks → [migration-task-template.md](./task-templates/migration-task-template.md)
2. Create task file: `phase-[X.Y]/tasks/[category]/[task-id]-[descriptive-name].md`
3. Add task entry to this registry file with link to task file

#### Example: Frontend Feature Implementation (Registry Pattern)

**⚠️ IMPORTANT:** Verification tasks (X.Y.Z.a, X.Y.Z.b, X.Y.Z.c) MUST be completed BEFORE the implementation task (X.Y.Z).

- [ ] **Task X.Y.Z.a:** Verify wireframes for [Feature Name]
  - 📋 **Details:** [tasks/frontend/X.Y.Z-feature-name.md#task-xyza-verify-wireframes](./phase-[X.Y]/tasks/frontend/X.Y.Z-feature-name.md#task-xyza-verify-wireframes)

- [ ] **Task X.Y.Z.b:** Verify database schema for [Feature Name]
  - 📋 **Details:** [tasks/frontend/X.Y.Z-feature-name.md#task-xyzb-verify-database-schema](./phase-[X.Y]/tasks/frontend/X.Y.Z-feature-name.md#task-xyzb-verify-database-schema)

- [ ] **Task X.Y.Z.c:** Verify API contracts for [Feature Name]
  - 📋 **Details:** [tasks/frontend/X.Y.Z-feature-name.md#task-xyzc-verify-api-contracts](./phase-[X.Y]/tasks/frontend/X.Y.Z-feature-name.md#task-xyzc-verify-api-contracts)

- [ ] **Task X.Y.Z:** Implement [Feature Name]
  - 📋 **Details:** [tasks/frontend/X.Y.Z-feature-name.md#implementation-task](./phase-[X.Y]/tasks/frontend/X.Y.Z-feature-name.md#implementation-task)
  - ⚠️ **DEPENDS ON:** Tasks X.Y.Z.a (wireframe verification), X.Y.Z.b (database verification), X.Y.Z.c (API verification), [other dependencies]

- [ ] **Task X.Y.Z-verify:** Verify compliance of [Feature Name] implementation
  - 📋 **Details:** [tasks/frontend/X.Y.Z-feature-name.md#compliance-verification-task](./phase-[X.Y]/tasks/frontend/X.Y.Z-feature-name.md#compliance-verification-task)
  - ⚠️ **DEPENDS ON:** Task X.Y.Z (implementation complete) | **Owner:** Sami (Compliance) + Oliver (Technical Review)

**Note:** Full task details (verification steps, acceptance criteria, compliance checks) are in the linked task file, not in this registry.

---

#### Example: Database Migration (Registry Pattern)

- [ ] **Task X.Y.Z.1:** Create database migration for [Table/Feature Name]
  - 📋 **Details:** [tasks/migrations/X.Y.Z.1-table-name-migration.md](./phase-[X.Y]/tasks/migrations/X.Y.Z.1-table-name-migration.md)

- [ ] **Task X.Y.Z.1-apply:** Apply database migration for [Table/Feature Name]
  - 📋 **Details:** [tasks/migrations/X.Y.Z.1-table-name-migration.md#apply-migration-task](./phase-[X.Y]/tasks/migrations/X.Y.Z.1-table-name-migration.md#apply-migration-task)
  - ⚠️ **DEPENDS ON:** Task X.Y.Z.1 (migration creation)

- [ ] **Task X.Y.Z.1-verify:** Verify database migration for [Table/Feature Name]
  - 📋 **Details:** [tasks/migrations/X.Y.Z.1-table-name-migration.md#verify-migration-task](./phase-[X.Y]/tasks/migrations/X.Y.Z.1-table-name-migration.md#verify-migration-task)
  - ⚠️ **DEPENDS ON:** Task X.Y.Z.1-apply (migration application)

**Note:** Full migration details (creation, apply steps, verification steps) are in the linked task file.

---

#### Example: Backend RPC Function (Registry Pattern)

- [ ] **Task X.Y.Z.2:** Create RPC function [function_name] for [Feature Name]
  - 📋 **Details:** [tasks/backend/X.Y.Z.2-function-name.md](./phase-[X.Y]/tasks/backend/X.Y.Z.2-function-name.md)
  - ⚠️ **DEPENDS ON:** [List dependencies]

**Note:** Backend tasks use simplified structure (no wireframe verification). See [backend-task-template.md](./task-templates/backend-task-template.md).

---

#### Example: Seed Data Migration (Registry Pattern)

- [ ] **Task X.Y.Z.4:** Create seed data migration for [Feature/Module Name]
  - 📋 **Details:** [tasks/migrations/X.Y.Z.4-seed-data-migration.md](./phase-[X.Y]/tasks/migrations/X.Y.Z.4-seed-data-migration.md)

- [ ] **Task X.Y.Z.4-apply:** Apply seed data migration for [Feature/Module Name]
  - 📋 **Details:** [tasks/migrations/X.Y.Z.4-seed-data-migration.md#apply-seed-migration-task](./phase-[X.Y]/tasks/migrations/X.Y.Z.4-seed-data-migration.md#apply-seed-migration-task)
  - ⚠️ **DEPENDS ON:** Task X.Y.Z.4 (seed migration creation)

- [ ] **Task X.Y.Z.4-verify:** Verify seed data migration for [Feature/Module Name]
  - 📋 **Details:** [tasks/migrations/X.Y.Z.4-seed-data-migration.md#verify-seed-migration-task](./phase-[X.Y]/tasks/migrations/X.Y.Z.4-seed-data-migration.md#verify-seed-migration-task)
  - ⚠️ **DEPENDS ON:** Task X.Y.Z.4-apply (seed migration application)

---

## Task Naming Conventions

### Verification Tasks
- **Format:** `X.Y.Z.a`, `X.Y.Z.b`, `X.Y.Z.c`
- **Purpose:** Verify wireframes, database schema, and API contracts before implementation
- **Required:** Must be completed before implementation task `X.Y.Z`

### Migration Tasks
- **Creation:** `X.Y.Z.N` - Create migration file
- **Apply:** `X.Y.Z.N-apply` - Apply migration to database
- **Verify:** `X.Y.Z.N-verify` - Verify migration was applied correctly

### Implementation Tasks
- **Format:** `X.Y.Z` (main implementation)
- **Sub-tasks:** `X.Y.Z.1`, `X.Y.Z.2`, etc. (if breaking into smaller tasks)

### Dependencies
- Use `⚠️ **DEPENDS ON:**` to indicate task dependencies
- List all prerequisite tasks explicitly
- Verification tasks must be listed as dependencies for implementation tasks

---

## Feature Reference Format

All tasks should reference features in [feature-index.md](../../02-architecture/feature-index.md) using anchor links:

- **Feature Reference:** `[Feature Name - feature-index.md#feature-anchor](../../02-architecture/feature-index.md#feature-anchor)`

This ensures traceability and makes it easy to find all related artifacts (wireframes, database tables, APIs) for a feature.

---

## Related Documents

- [Compliance Rules](./compliance-rules.md) - Mandatory compliance checklist
- [Feature Index](../../02-architecture/feature-index.md) - Single source of truth for features
- [Seed Data Playbook](./planning/seed-data-playbook.md) - Seed data strategy
- [Migration Strategy](../../02-architecture/database/migration-strategy.md) - Database migration guidelines
- [Definition of Done](./definition-of-done.md) - Task completion criteria

---

**Last Updated:** 2026-01-26  
**Template Version:** 2.0 (Modular Architecture)  
**Architecture:** Modular Task Registry Pattern  
**Maintainers:** Yasmine (Project Manager), Sami (Implementation Compliance Specialist), Oliver (Technical Lead)

---

## Architecture Notes

**This template uses the Modular Task Registry Architecture:**
- Main phase file = Registry/index (~200-450 lines)
- Individual task files = Detailed definitions (~100-200 lines each)
- Templates = Reusable structures for creating task files

**Benefits:**
- ✅ Scalable to 1000+ tasks without main file bloat
- ✅ Easy to find and update individual tasks
- ✅ No merge conflicts (isolated files)
- ✅ Focused context for AI agents
- ✅ Maintainable structure

**See:** [Modular Architecture Implementation Summary](./modular-architecture-implementation-summary.md) for complete details.
