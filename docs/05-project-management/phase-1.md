# Phase 1 Implementation Plan - Pharmaceutical Governance Value Chain Platform (PM)

**Phase:** Phase 1 - Development with Seeded Supabase Data (Months 2-6)  
**Status:** ✅ APPROVED FOR IMPLEMENTATION (January 12, 2026)  
**Document Version:** 2.0 (Restructured - January 2026)

---

## 🚨 **READ THIS FIRST: COMPLIANCE RULES ARE MANDATORY**

**⚠️ CRITICAL:** Before starting ANY task, you MUST read and follow the compliance rules. Non-compliance will result in immediate task rejection.

**📋 [COMPLIANCE RULES - READ NOW](../standards/compliance-rules.md)** ← **CLICK HERE FIRST**

**Key Points:**
- ✅ Every task requires compliance verification before starting
- ✅ Every PR must include a compliance section (see format in compliance rules)
- ✅ Wireframe binding is mandatory for all frontend tasks
- ✅ No local mock data - Supabase queries only
- ✅ Sequential task execution - no skipping tasks
- ✅ Sami has STOP authority - compliance violations = immediate stop

**If you skip reading the compliance rules, your work will be rejected.**

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

**🚨 MANDATORY:** Every developer and AI agent MUST read and follow compliance rules. Non-compliance = immediate task rejection.

**📋 Complete Compliance Rules:** 
- **🔴 PRIMARY SOURCE:** [Compliance Rules](../standards/compliance-rules.md) ← **READ THIS FIRST** - Complete 9-item pre-task verification checklist that must be verified before EVERY task
- **Cursor AI Enforcement:** [.cursor/rules/wireframe_db_compliance.md](../../.cursor/rules/wireframe_db_compliance.md) - Auto-loaded technical enforcement rules for AI agents during code generation
- **Phase 1.1 Compliance System:** [Phase 1.1 Compliance Adherence System](./execution/phase-1-1-compliance-adherence-system.md) - Comprehensive compliance enforcement system for Phase 1.1 implementation
- **Quick Reference:** [Phase 1.1 Compliance Quick Reference](./execution/phase-1-1-compliance-quick-reference.md) - Quick reference checklist for daily use

**⚠️ COMPLIANCE CHECKLIST (Quick Reference):**
1. ✅ Read [Compliance Rules](../standards/compliance-rules.md) before starting
2. ✅ Verify all previous tasks are complete (sequential execution)
3. ✅ Review wireframe before frontend work
4. ✅ No local mocks - Supabase queries only
5. ✅ Add wireframe binding comments to code
6. ✅ Include compliance section in PR description
7. ✅ Get Sami's approval before marking task complete

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

**📋 Implementation Summary Compliance Requirement:** See [Compliance Rules - Implementation Summary Compliance Requirement](../standards/compliance-rules.md#implementation-summary-compliance-requirement-mandatory) for the complete requirement, format template, and mandatory elements.

**🔒 HARD GATES: Wireframe + Database Compliance (Non-Negotiable):** See [Compliance Rules - Hard Gates](../standards/compliance-rules.md#hard-gates-non-negotiable) for complete details. These gates apply to **every** Phase 1 frontend page/component. If a gate is not met, the task is **not complete** and the PR must not merge.

**📋 PR Description Checklist:** See [Compliance Rules - PR Description Checklist](../standards/compliance-rules.md#pr-description-checklist-required) for the complete 9-item checklist that every frontend task PR must include.

**⚠️ Wireframe-First Implementation Principle:** See [Compliance Rules - Wireframe-First Implementation Principle](../standards/compliance-rules.md#wireframe-first-implementation-principle) for complete requirements. Wireframes are the PRIMARY design reference - If there is any conflict or ambiguity, the wireframe takes precedence.

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
4. **Seed Data Validation (Hassan):** Verify seed data covers VCI test scenarios (coordinates with Farah for realism validation)

**Gate:** Phase 1.2 cannot start until all 4 validations pass.

---

## Subphase 1.1.1: Foundation & Infrastructure Setup (Week 1)

**Status:** ✅ **COMPLETE** - All tasks (1.1.1.1-1.1.1.24) have been completed. Subphase 1.1.1 is ready for Subphase 1.1.2.

**🔒 COMPLIANCE VALIDATION (Sami - Required Before ANY Task):**

**⚠️ STOP AUTHORITY:** Sami (Implementation Compliance Specialist) has **MANDATORY STOP AUTHORITY**. If ANY compliance rule is violated, implementation **MUST STOP IMMEDIATELY**. No exceptions.

**Before starting ANY task in this subphase, the following MUST be verified and documented:**

- [ ] **1. Sequential Task Verification (MANDATORY):** All prerequisite phases (Phase 0, 0.5, 0.6) are complete. **NO TASK CAN START UNTIL ALL PREREQUISITES ARE COMPLETE.** Sami verifies this before every task. Starting a task out of sequence is a **COMPLIANCE VIOLATION**.
- [ ] **2. Role Name Verification:** Frontend role names match database schema exactly; role constants match `users.role` enum values; no hardcoded role strings (use constants).
- [ ] **3. Schema Verification:** Database schema verified before role-dependent code; all required tables/fields/RLS policies exist; Phase 0.6 schema additions incorporated where applicable.
- [ ] **4. Integration Verification:** Layout/components integrated into routes (if applicable); navigation updated (if new routes added); module routing structure updated.
- [ ] **5. Role Coverage Verification:** All 9 roles are handled where applicable (Company Admin, Company Manager, Company User, MOH Tier 1, MOH Tier 2 Officer, MOH Tier 2 Registrar, MOH Auditor, System Admin, Vendor); role variants match wireframe specifications.
- [ ] **6. Wireframe Compliance:** Wireframe reviewed before starting; wireframe task ID(s) identified; wireframe requirements understood (layout, interactions, states, role-based variations); wireframe annotations reviewed.
- [ ] **7. Data Source Verification:** NO local mock data used (NO `const mockData = [...]`, NO `mockData.ts`, NO runtime mocks); all data queries Supabase database; seed data applied if required (verify via `supabase migration list`); database tables verified before starting (use SQL queries).
- [ ] **8. Wireframe Binding:** Wireframe binding comments will be added to code (JSDoc format with wireframe link); wireframe task ID(s) documented in code comments; PR description will include wireframe link(s); wireframe binding in both PR description AND codebase.
- [ ] **9. Seed Data Gate (If Applicable):** Seed migration `seed_1_1_1_foundation` applied and verified (see below for verification requirements); seed data acceptance criteria verified; RLS validation completed if required; seed data covers wireframe scenarios.
- [ ] **Wireframe-First Implementation Principle:** Wireframes are the PRIMARY design reference. If a wireframe doesn't exist, **STOP** and create it first. See [Compliance Rules - Wireframe-First Implementation Principle](../standards/compliance-rules.md#wireframe-first-implementation-principle) for complete requirements.
- [ ] **Sami's Compliance Checklist:** Will be used for EVERY task in this subphase. **No task proceeds without Sami's approval.**
- [ ] **Sami's Approval:** Compliance review completed and approved by Sami before task start. **MANDATORY - No task can proceed without this approval.**
- [ ] **Implementation Summary Compliance Section:** After task completion, implementation summary MUST include compliance section documenting all rules followed (see "Implementation Summary Compliance Requirement" section above). **PRs without compliance section will be REJECTED.**
- [ ] **PR Description Checklist:** See [Compliance Rules - PR Description Checklist](../standards/compliance-rules.md#pr-description-checklist-required) for the complete 9-item checklist that every frontend task PR must include.

**🚫 STOP CONDITIONS (Do Not Proceed):**

**STOP implementation and resolve before proceeding** if any of the following is true:

- **Prerequisites Incomplete:** Phase 0, 0.5, or 0.6 are not complete. **STOP** and complete prerequisites first.
- **Wireframe Requirements:** No wireframe link exists for the page/route being implemented. **STOP** and request/produce the wireframe first. Do not guess layouts, flows, or states.
- **Database & Schema Requirements:** Required DB table/field/RPC does not exist yet. **STOP** and implement the missing backend task first. Do not create local mocks as a workaround.
- **Security & Access Requirements:** RLS/policies prevent required access for the wireframed role. **STOP** and implement/update RLS policies before proceeding.
- **Seed Data Requirements:** Seed migration is not idempotent (must use deterministic IDs + UPSERT patterns) or not applied. **STOP** and fix/apply migration first.
- **Sequential Execution:** Previous tasks are not complete. **STOP** and complete all prerequisite tasks first.
- **Role Name Mismatch:** Frontend role names don't match database schema. **STOP** and fix role names to match schema exactly.

**Prerequisites:**
- Phase 0.5 (Wireframes) completed and approved
- Phase 0.6 (Database Schema Audit & Alignment) completed
- Implementation Standards document reviewed
- Development environment configured

**Seed Data Gate (Required):**
- Before starting Phase 1.1 Core Foundation UI work, apply the seed migration stage `seed_1_1_1_foundation` per [Phase 1.1 Playbook - Stage: seed_1_1_1_foundation](phase-1-1-mockdata.md#stage-seed_1_1_1_foundation-subphase-111) (versioned SQL migrations, idempotent).

### Backend Setup Tasks
- [x] **Task 1.1.1.1:** Initialize Supabase project structure (migrations, functions, storage buckets) ✅ **COMPLETE**
  - 💾 **Database:** Project infrastructure setup (all future tables)
  - 🔌 **API:** Supabase project configuration ([feature-index.md](../../02-architecture/feature-index.md))
  - ✅ **Completed:** Created `supabase/` directory structure with `migrations/`, `functions/`, `config.toml`, and documentation

- [x] **Task 1.1.1.1a:** Define module integration contracts (data flow specs between RMM→VCI, VCI→ECS, ECS→CMC) ✅ **COMPLETE** ⚠️ **PENDING OLIVER'S REVIEW**
  - 💾 **Database:** Cross-module table references ([feature-index.md](../../02-architecture/feature-index.md#feature-dependency-matrix))
  - 🔌 **API:** Module integration contracts ([module-integration-contracts.md](../../02-architecture/integration/module-integration-contracts.md))
  - ✅ **Completed:** Created comprehensive module integration contracts document defining all 6 integration contracts (RMM→VCI, VCI→ECS, VCI→CMC, ECS→CMC, ECS→VCI, Event-triggered) with data flow examples, module activation dependencies, and error handling patterns. Document ready for Oliver's (Chief Architect) review.

- [x] **Task 1.1.1.1b:** Set up shared database schema versioning strategy ✅ **COMPLETE** ⚠️ **PENDING NADIA'S REVIEW**
  - 💾 **Database:** All tables (versioning system) ([schema-versioning-strategy.md](../../02-architecture/database/schema-versioning-strategy.md))
  - 🔌 **API:** Migration management system
  - ✅ **Completed:** Created comprehensive database schema versioning strategy document covering migration numbering, file structure, categories, rollback procedures, tracking, best practices, environment-specific procedures, review process, seed guidelines, and conflict resolution. Document ready for Nadia's (Database Specialist) review.

- [x] **Task 1.1.1.1c:** Define API contract documentation format (OpenAPI/Swagger for RPC functions) ✅ **COMPLETE** ⚠️ **PENDING MAYA'S REVIEW**
  - 🔌 **API:** All RPC functions (documentation format) ([api-contract-documentation-format.md](../../02-architecture/api/api-contract-documentation-format.md))
  - ✅ **Completed:** Created comprehensive API contract documentation format document covering RPC function documentation template, API contract format, parameter/return/error documentation standards, examples, OpenAPI/Swagger mapping, and documentation maintenance. Document ready for Maya's (Workflow/RPC Engineer) review.

- [x] **Task 1.1.1.1d:** Set up Edge Functions project structure ✅ **COMPLETE** ⚠️ **PENDING LEILA'S REVIEW**
  - 🔌 **API:** Edge Functions infrastructure ([feature-index.md](../../02-architecture/feature-index.md))
  - ✅ **Completed:** Created Edge Functions project structure with comprehensive README covering directory structure, function template, naming convention, development workflow, function categories, environment variables, error handling, and scheduled triggers. Structure ready for Leila's (Edge Functions) review.

- [x] **Task 1.1.1.2:** Create database migration for core tables (users, system_config, audit_logs, notifications, approvals, approval_history) ✅ **COMPLETE** ✅ **NADIA APPROVED**
  - 💾 **Database:** `users`, `system_config`, `audit_logs`, `notifications`, `approvals`, `approval_history` ([feature-index.md](../../02-architecture/feature-index.md#core-foundation-features))
  - 🔌 **API:** Core table schema ([data-dictionary.md](../../02-architecture/database/data-dictionary.md))
  - ✅ **Completed:** Created migration `20260122001144_create_core_tables.sql` with all 6 core tables (users, system_config, audit_logs, notifications, approvals, approval_history). Migration includes Phase 0.6 additions (avatar_url, timezone, language, notification_preferences), all indexes, triggers for updated_at, and foreign key constraints. Migration follows schema-versioning-strategy.md with idempotency (IF NOT EXISTS) and atomicity (BEGIN/COMMIT).
  - ✅ **Nadia's Approval:** Approved - 2026-01-22 - Migration is well-structured and follows all best practices. All schema specifications correctly implemented. Minor note: `approval_history` table not documented in schema docs (migration is correct, documentation should be updated). See [Nadia's Review](./execution/task-1-1-1-2-nadia-review-approval.md) for complete review details.

- [x] **Task 1.1.1.2a:** Create database migration for communications tables (conversations, messages, message_attachments, message_read_receipts) ✅ **COMPLETE** ✅ **NADIA APPROVED**
  - 💾 **Database:** `conversations`, `messages`, `message_attachments`, `message_read_receipts` ([feature-index.md](../../02-architecture/feature-index.md#communications))
  - 🔌 **API:** Communications table schema ([data-dictionary.md](../../02-architecture/database/data-dictionary.md))
  - ✅ **Completed:** Created migration `20260122002012_create_communication_tables.sql` with all 4 communications tables (conversations, messages, message_attachments, message_read_receipts). Migration includes Phase 0.6 additions (conversations.lifecycle_state, messages.delivered_at), all indexes, triggers for updated_at, foreign key constraints, unique constraint on message_read_receipts, and partial index on messages.delivered_at. Migration follows schema-versioning-strategy.md with idempotency (IF NOT EXISTS) and atomicity (BEGIN/COMMIT).
  - ✅ **Nadia's Approval:** Approved - 2026-01-22 - Migration is well-structured and follows all best practices. All schema specifications correctly implemented. Phase 0.6 additions properly incorporated. See [Nadia's Review](./execution/task-1-1-1-2a-nadia-review-approval.md) for complete review details.

- [x] **Task 1.1.1.2b:** Create shared RPC functions (user permissions, notifications, profile, audit logs) ✅ **COMPLETE**
  - 💾 **Database:** `users`, `notifications`, `audit_logs`, `system_config` ([feature-index.md](../../02-architecture/feature-index.md#core-foundation-features))
  - 🔌 **API:** `shared_get_user_permissions()`, `shared_get_notifications()`, `shared_mark_notification_read()`, `shared_update_user_profile()`, `shared_update_user_preferences()`, `shared_get_audit_logs()`, `shared_get_audit_log_detail()`, `shared_generate_audit_report()` ([feature-index.md](../../02-architecture/feature-index.md#core-foundation-features))
  - ✅ **Completed:** Created migration `20260122002358_create_shared_rpc_functions.sql` with all 8 shared RPC functions. Functions include: shared_get_user_permissions (handles all 9 roles), shared_get_notifications (with pagination), shared_mark_notification_read, shared_update_user_profile (Phase 0.6: avatar_url), shared_update_user_preferences (Phase 0.6: timezone, language, notification_preferences with validation), shared_get_audit_logs (with filtering and role-based access control), shared_get_audit_log_detail (with role-based access control), shared_generate_audit_report (with date range and role-based access control). All functions use SECURITY DEFINER, proper error handling, input validation, and follow API contract specifications. Migration follows schema-versioning-strategy.md with idempotency (CREATE OR REPLACE) and atomicity (BEGIN/COMMIT).

- [x] **Task 1.1.1.2c:** Create communications RPC functions ✅ **COMPLETE**
  - 💾 **Database:** `conversations`, `messages`, `message_attachments`, `message_read_receipts` ([feature-index.md](../../02-architecture/feature-index.md#communications))
  - 🔌 **API:** `communications_list_conversations()`, `communications_get_conversation()`, `communications_send_message()`, `communications_create_conversation()`, `communications_list_sent()`, `communications_create_announcement()`, `communications_list_announcements()`, `communications_archive_conversation()`, `communications_list_archived()` ([feature-index.md](../../02-architecture/feature-index.md#communications))
  - ✅ **Completed:** Created migration `20260122002646_create_communications_rpc_functions.sql` with all 9 communications RPC functions. Functions include: communications_list_conversations (with role-based access control and pagination), communications_get_conversation (with messages and attachments), communications_create_conversation (Phase 0.6: lifecycle_state='CREATED'), communications_send_message (Phase 0.6: lifecycle_state transitions CREATED→SENT→DELIVERED, delivered_at handling), communications_list_sent, communications_create_announcement (only MOH users and system_admin), communications_list_announcements, communications_archive_conversation (Phase 0.6: lifecycle_state='ARCHIVED'), communications_list_archived. All functions use SECURITY DEFINER, proper error handling, input validation, role-based access control (company users vs MOH users), and follow API contract specifications. Migration follows schema-versioning-strategy.md with idempotency (CREATE OR REPLACE) and atomicity (BEGIN/COMMIT).

- [x] **Task 1.1.1.2d:** Create system status RPC function ✅ **COMPLETE**
  - 💾 **Database:** `system_config` ([feature-index.md](../../02-architecture/feature-index.md#core-foundation-features))
  - 🔌 **API:** System status check functions ([feature-index.md](../../02-architecture/feature-index.md#core-foundation-features))
  - ✅ **Completed:** Created migration `20260122003026_create_system_status_rpc_functions.sql` with all 5 system status RPC functions. Functions include: shared_check_module_active (check if module is active, returns boolean), shared_get_module_config (get module configuration), shared_activate_module (activate module, only tier1 and system_admin), shared_deactivate_module (deactivate module, only tier1 and system_admin, protects core modules RMM and VCI from deactivation), shared_get_system_status (get overall system status with all modules, core/optional distinction). All functions use SECURITY DEFINER, proper error handling, input validation (module_name validation: rmm, vci, ecs, cmc), role-based access control, and follow API contract specifications. Migration follows schema-versioning-strategy.md with idempotency (CREATE OR REPLACE) and atomicity (BEGIN/COMMIT).

- [x] **Task 1.1.1.2e:** Create authentication RPC function - User creation ✅ **COMPLETE**
  - 💾 **Database:** `users`, `auth.users` ([feature-index.md](../../02-architecture/feature-index.md#authentication--access))
  - 🔌 **API:** `rmm_create_user()` ([feature-index.md](../../02-architecture/feature-index.md#authentication--access))
  - ✅ **Completed:** Created migration `20260122003519_create_authentication_rpc_function.sql` with authentication RPC function. Function: rmm_create_user(creator_user_id, email, password, full_name, role, company_id, timezone, language) - creates user in users table with comprehensive validation. Access control: Only tier1 and system_admin can create users. Validation includes: email format, password length (minimum 8 characters), role validation (all 9 roles), role and company_id relationship (MOH roles must have company_id = NULL, Company roles must have company_id NOT NULL), timezone format, language format (ISO 639-1), email uniqueness check. Phase 0.6: Handles timezone (default: 'UTC+01:00') and language (default: 'en') with validation. Function uses SECURITY DEFINER, proper error handling, extensive input validation, and follows API contract specifications. Migration follows schema-versioning-strategy.md with idempotency (CREATE OR REPLACE) and atomicity (BEGIN/COMMIT). Note: Function creates user in users table; auth.users entry should be created separately via Supabase Admin API or frontend registration flow (documented in migration).

- [x] **Task 1.1.1.3:** Create database migration for RMM tables (companies, products, skus, atc_codes, critical_medicines, registry_submissions) ✅ **COMPLETE** ⚠️ **PENDING NADIA'S REVIEW**
  - 💾 **Database:** `companies`, `products`, `skus`, `atc_codes`, `critical_medicines`, `registry_submissions` ([feature-index.md](../../02-architecture/feature-index.md#rmm-module-features))
  - 🔌 **API:** RMM table schema ([data-dictionary.md](../../02-architecture/database/data-dictionary.md))
  - ✅ **Completed:** Created migration `20260122003829_create_rmm_tables.sql` with all 6 RMM tables (companies, products, skus, atc_codes, critical_medicines, registry_submissions). Migration includes all fields per schema-design.md, all indexes, triggers for updated_at, foreign key constraints with appropriate ON DELETE behavior, CHECK constraints for enums (company_type, submission_type, entity_type, status), unique constraints (companies.registration_number, atc_codes.code), and additional foreign key constraint for users.company_id -> companies.id ON DELETE SET NULL. Migration follows schema-versioning-strategy.md with idempotency (IF NOT EXISTS) and atomicity (BEGIN/COMMIT). Ready for Nadia's (Database Specialist) review.

- [x] **Task 1.1.1.4:** Implement RLS policies for core tables (including approval_history) ✅ **COMPLETE**
  - 💾 **Database:** `users`, `system_config`, `audit_logs`, `notifications`, `approvals`, `approval_history` ([feature-index.md](../../02-architecture/feature-index.md#core-foundation-features))
  - 🔌 **API:** RLS policy implementation ([security-architecture.md](../../02-architecture/security/security-architecture.md))
  - ✅ **Completed:** Created migration `20260122004206_create_rls_policies_core_tables.sql` with RLS policies for all 6 core tables. RLS enabled on: users, system_config, audit_logs, notifications, approvals, approval_history. Policies created: users_see_own_record, moh_users_see_all_users, users_see_system_config, users_see_own_notifications, users_update_own_notifications, moh_users_see_all_audit_logs, moh_users_see_all_approvals, company_users_see_own_approvals, moh_users_see_all_approval_history, company_users_see_own_approval_history. All policies follow rls-policy-framework.md patterns: company data isolation, MOH system-wide access, efficient queries, proper authentication checks. Migration follows schema-versioning-strategy.md with atomicity (BEGIN/COMMIT). Ready for optional reviews by Rafi (Security & Access Control Engineer) or Nadia (Database Specialist).

- [x] **Task 1.1.1.5:** Implement RLS policies for RMM tables ✅ **COMPLETE**
  - 💾 **Database:** `companies`, `products`, `skus`, `atc_codes`, `critical_medicines`, `registry_submissions` ([feature-index.md](../../02-architecture/feature-index.md#rmm-module-features))
  - 🔌 **API:** RLS policy implementation ([security-architecture.md](../../02-architecture/security/security-architecture.md))
  - ✅ **Completed:** Created migration `20260122004408_create_rls_policies_rmm_tables.sql` with RLS policies for all 6 RMM tables. RLS enabled on: companies, products, skus, atc_codes, critical_medicines, registry_submissions. Policies created: company_users_see_own_company, moh_users_see_all_companies, company_users_see_own_products, moh_users_see_all_products, company_users_see_own_skus (via products relationship), moh_users_see_all_skus, users_see_atc_codes (read-only), users_see_critical_medicines (read-only), company_users_see_own_registry_submissions, moh_users_see_all_registry_submissions. All policies follow rls-policy-framework.md patterns: company data isolation, MOH system-wide access, efficient queries, proper authentication checks. Migration follows schema-versioning-strategy.md with atomicity (BEGIN/COMMIT). Ready for optional reviews by Rafi (Security & Access Control Engineer) or Nadia (Database Specialist).

- [x] **Task 1.1.1.7:** Create database migration for enforcement tables (enforcement_actions, appeals) ✅ **COMPLETE**
  - 💾 **Database:** `enforcement_actions`, `appeals` ([feature-index.md](../../02-architecture/feature-index.md#enforcement-module))
  - 🔌 **API:** Enforcement table schema ([data-dictionary.md](../../02-architecture/database/data-dictionary.md))
  - ✅ **Completed:** Created migration `20260122004841_create_enforcement_tables.sql` with enforcement_actions and enforcement_action_appeals tables. Migration includes all fields per schema-design.md, all indexes, triggers for updated_at, foreign key constraints with appropriate ON DELETE behavior, CHECK constraints for enums (action_type, violation_type, status for both tables), unique constraint (enforcement_action_appeals.enforcement_action_id), and additional foreign key constraint for enforcement_actions.appeal_id -> enforcement_action_appeals.id ON DELETE SET NULL. Migration follows schema-versioning-strategy.md with idempotency (IF NOT EXISTS) and atomicity (BEGIN/COMMIT). Ready for optional review by Nadia (Database Specialist).

- [x] **Task 1.1.1.8:** Implement RLS policies for enforcement tables (including appeals) ✅ **COMPLETE**
  - 💾 **Database:** `enforcement_actions`, `appeals` ([feature-index.md](../../02-architecture/feature-index.md#enforcement-module))
  - 🔌 **API:** RLS policy implementation ([security-architecture.md](../../02-architecture/security/security-architecture.md))
  - ✅ **Completed:** Created migration `20260122005107_create_rls_policies_enforcement_tables.sql` with RLS policies for all 2 enforcement tables. RLS enabled on: enforcement_actions, enforcement_action_appeals. Policies created: company_users_see_own_enforcement_actions, moh_users_see_all_enforcement_actions, company_users_see_own_appeals (via enforcement_actions relationship), moh_users_see_all_appeals. All policies follow rls-policy-framework.md patterns: company data isolation, MOH system-wide access, efficient queries, proper authentication checks. Migration follows schema-versioning-strategy.md with atomicity (BEGIN/COMMIT). Ready for optional reviews by Rafi (Security & Access Control Engineer) or Nadia (Database Specialist).

- [x] **Task 1.1.1.8a:** Implement RLS policies for communications tables ✅ **COMPLETE**
  - 💾 **Database:** `conversations`, `messages`, `message_attachments`, `message_read_receipts` ([feature-index.md](../../02-architecture/feature-index.md#communications))
  - 🔌 **API:** RLS policy implementation ([security-architecture.md](../../02-architecture/security/security-architecture.md))
  - ✅ **Completed:** Created migration `20260122005200_create_rls_policies_communications_tables.sql` with RLS policies for all 4 communications tables. RLS enabled on: conversations, messages, message_attachments, message_read_receipts. Policies created: company_users_see_own_conversations, moh_users_see_all_conversations, users_see_messages_in_accessible_conversations, users_see_attachments_for_accessible_messages, users_see_read_receipts_for_accessible_messages. All policies follow rls-policy-framework.md patterns: company data isolation, MOH system-wide access, relationship-based access (messages, attachments, read receipts inherit access from conversations), efficient queries, proper authentication checks. Migration follows schema-versioning-strategy.md with atomicity (BEGIN/COMMIT). Ready for optional reviews by Rafi (Security & Access Control Engineer) or Nadia (Database Specialist).

- [x] **Task 1.1.1.6:** Create audit logging trigger function ⚠️ **CRITICAL:** Must come AFTER all RLS policies are implemented to properly audit policy-enforced actions ✅ **COMPLETE**
  - 💾 **Database:** `audit_logs` (all tables audited) ([feature-index.md](../../02-architecture/feature-index.md#global-pages))
  - 🔌 **API:** Audit trigger infrastructure ([audit-logging-trigger-infrastructure.sql](../../supabase/migrations/20260122005821_create_audit_logging_trigger_infrastructure.sql))
  - ✅ **Completed:** Created migration `20260122005821_create_audit_logging_trigger_infrastructure.sql` with audit logging trigger infrastructure. Functions created: calculate_audit_hash() (SHA-256 hash calculation for hash chaining), create_audit_log() (RPC function to create audit log entries with hash chaining), audit_trigger_function() (main trigger function for automatic audit logging), create_audit_trigger() (helper function to create audit triggers on tables). Triggers created: 16 triggers on all audited tables (users, notifications, approvals, approval_history, conversations, messages, companies, products, skus, atc_codes, critical_medicines, registry_submissions, enforcement_actions, enforcement_action_appeals). Hash chaining implemented per audit-logging-spec.md (SHA-256, previous_hash + entry_data). All CRUD operations logged (INSERT, UPDATE, DELETE) with old_values, new_values, user_id, operation_type, table_name, record_id. Security: SECURITY DEFINER functions with proper search_path. Compliance: Matches audit-logging-spec.md specifications exactly. Migration follows schema-versioning-strategy.md with atomicity (BEGIN/COMMIT). Ready for optional reviews by Salim (Audit & Compliance Specialist) or Nadia (Database Specialist).

### Frontend Setup Tasks
- [x] **Task 1.1.1.9:** Create core foundation layout and navigation ⚠️ **DEPENDS ON:** Task 1.1.1.2b (shared RPC functions) ✅ **COMPLETE**
  - 📐 **Wireframe:** [task-0.5.1.14](../../04-design/user-experience/wireframes/00-core-foundation/layout-navigation/task-0.5.1.14-dashboard-layout-structure.md), [task-0.5.1.15](../../04-design/user-experience/wireframes/00-core-foundation/layout-navigation/task-0.5.1.15-header-component.md), [task-0.5.1.16](../../04-design/user-experience/wireframes/00-core-foundation/layout-navigation/task-0.5.1.16-sidebar-navigation.md), [task-0.5.1.17](../../04-design/user-experience/wireframes/00-core-foundation/layout-navigation/task-0.5.1.17-notification-center-component.md)
  - 🛣️ **Route:** Root layout, dashboard layout ([routing-structure.md](../../02-architecture/frontend/routing-structure.md#route-organization))
  - 💾 **Database:** `users`, `notifications`, `system_config` ([feature-index.md](../../02-architecture/feature-index.md#dashboard--navigation))
  - 🔌 **API:** `shared_get_user_permissions()`, `shared_get_notifications()` ([feature-index.md](../../02-architecture/feature-index.md#dashboard--navigation))
  - ✅ **Completed:** Created Next.js project structure with TypeScript, Tailwind CSS, and Supabase integration. Components created: Header (fixed 64px, logo, module indicator, search, notifications, user menu), Sidebar (280px expanded/64px collapsed, navigation sections with role-based visibility, collapse toggle), NotificationCenter (dropdown with notifications list, mark all read, view all), UserMenu (avatar, dropdown: Profile, Settings, Logout). Dashboard layout combines Header, Sidebar, and Main Content Area. All data queries Supabase (RPC functions: shared_get_user_permissions, shared_get_notifications; table queries: users, system_config). Role-based navigation visibility implemented (all 9 roles handled). Responsive: Desktop (1024px+), Tablet (768px-1023px), Mobile (<768px). Accessibility: ARIA labels, keyboard navigation, focus management, touch targets (40px × 40px minimum). Wireframe binding comments added to all component files. All compliance rules verified and followed. Ready for dependency installation (`npm install`) and optional reviews by Emma (UI/UX + Next.js Frontend Specialist).

- [x] **Task 1.1.1.10:** Implement authentication pages (login, signup, password reset) ⚠️ **DEPENDS ON:** Task 1.1.1.2e (rmm_create_user RPC function)
  - 📐 **Wireframe:** [task-0.5.1.11](../../04-design/user-experience/wireframes/00-core-foundation/authentication/task-0.5.1.11-login-page.md), [task-0.5.1.12](../../04-design/user-experience/wireframes/00-core-foundation/authentication/task-0.5.1.12-registration-page.md), [task-0.5.1.13](../../04-design/user-experience/wireframes/00-core-foundation/authentication/task-0.5.1.13-forgot-reset-password.md)
  - 🛣️ **Route:** `/login`, `/register`, `/forgot-password`, `/reset-password` ([routing-structure.md](../../02-architecture/frontend/routing-structure.md#public-routes))
  - 💾 **Database:** `users`, `auth.users` ([feature-index.md](../../02-architecture/feature-index.md#authentication--access))
  - 🔌 **API:** Supabase Auth + `rmm_create_user()` ([feature-index.md](../../02-architecture/feature-index.md#authentication--access))

- [x] **Task 1.1.1.11:** Implement dashboard page (role-based)
  - 📐 **Wireframe:** [task-0.5.1.18](../../04-design/user-experience/wireframes/00-core-foundation/dashboard/task-0.5.1.18-company-dashboard.md), [task-0.5.1.19](../../04-design/user-experience/wireframes/00-core-foundation/dashboard/task-0.5.1.19-moh-tier1-dashboard.md), [task-0.5.1.20](../../04-design/user-experience/wireframes/00-core-foundation/dashboard/task-0.5.1.20-moh-tier2-dashboard.md)
  - 🛣️ **Route:** `/dashboard` ([routing-structure.md](../../02-architecture/frontend/routing-structure.md#dashboard-routes))
  - 💾 **Database:** `companies`, `submissions`, `notifications`, all module tables ([feature-index.md](../../02-architecture/feature-index.md#dashboard--navigation))
  - 🔌 **API:** `shared_get_user_permissions()`, `rmm_*`, `vci_*`, all module RPCs ([feature-index.md](../../02-architecture/feature-index.md#dashboard--navigation))

- [x] **Task 1.1.1.12:** Implement placeholder pages for all routes (30 placeholder pages with route protection) ✅ **COMPLETE**
  - 📐 **Wireframe:** See [wireframe-route-mapping.md](../../02-architecture/frontend/wireframe-route-mapping.md) for complete mapping
  - 🛣️ **Route:** All routes per [route-inventory.md](../../02-architecture/frontend/route-inventory.md) ([routing-structure.md](../../02-architecture/frontend/routing-structure.md))
  - 💾 **Database:** All module tables (referenced per route) ([feature-index.md](../../02-architecture/feature-index.md))
  - 🔌 **API:** All RPC functions (referenced per route) ([feature-index.md](../../02-architecture/feature-index.md))
  - ✅ **Completed:** Created 51 placeholder pages for all routes using the `PlaceholderPage` component. Pages created include: RMM routes (14 pages: overview, companies list/detail/edit/new/products, products list/detail/edit/new, SKUs list/detail/edit/new), VCI routes (20 pages: overview, AAMS/MSQ/WSL submissions list/detail/new, submission history/trends, thresholds list/detail/revert-review/pending-reversions, breaches list/detail, governance, treemap), ECS routes (7 pages: overview, export-requests list/detail/new, authorizations list/detail, exports history), CMC routes (8 pages: overview, scores list/detail/history, disputes list/detail/history, reports list/detail), Enforcement routes (6 pages: dashboard, actions list/detail/new, pending-approvals, reports), and System Config (1 page). All pages include wireframe binding comments with wireframe task IDs and links, route information, and proper back navigation. All pages are protected by dashboard layout (authentication required). Pages follow Next.js App Router conventions and use TypeScript. All compliance rules verified and followed. Ready for full implementation in future tasks.

### Public Pages Tasks
- [x] **Task 1.1.1.13:** Implement public homepage
  - 📐 **Wireframe:** [task-0.5.1.1](../../04-design/user-experience/wireframes/00-core-foundation/public/task-0.5.1.1-homepage.md)
  - 🛣️ **Route:** `/` ([routing-structure.md](../../02-architecture/frontend/routing-structure.md#public-routes))
  - 💾 **Database:** N/A (public page) ([feature-index.md](../../02-architecture/feature-index.md))
  - 🔌 **API:** N/A (public page) ([feature-index.md](../../02-architecture/feature-index.md))

- [x] **Task 1.1.1.14:** Implement About page
  - 📐 **Wireframe:** [task-0.5.1.2](../../04-design/user-experience/wireframes/00-core-foundation/public/task-0.5.1.2-about-page.md)
  - 🛣️ **Route:** `/about` ([routing-structure.md](../../02-architecture/frontend/routing-structure.md#public-routes))
  - 💾 **Database:** N/A (public page) ([feature-index.md](../../02-architecture/feature-index.md))
  - 🔌 **API:** N/A (public page) ([feature-index.md](../../02-architecture/feature-index.md))

- [x] **Task 1.1.1.15:** Implement Support center pages
  - 📐 **Wireframe:** [task-0.5.1.37](../../04-design/user-experience/wireframes/00-core-foundation/public/task-0.5.1.37-support-center.md), [task-0.5.1.38](../../04-design/user-experience/wireframes/00-core-foundation/public/task-0.5.1.38-faq-page.md), [task-0.5.1.39](../../04-design/user-experience/wireframes/00-core-foundation/public/task-0.5.1.39-contact-support.md), [task-0.5.1.40](../../04-design/user-experience/wireframes/00-core-foundation/public/task-0.5.1.40-documentation-page.md)
  - 🛣️ **Route:** `/support`, `/support/faq`, `/support/contact`, `/support/documentation` ([routing-structure.md](../../02-architecture/frontend/routing-structure.md#public-routes))
  - 💾 **Database:** N/A (public pages) ([feature-index.md](../../02-architecture/feature-index.md))
  - 🔌 **API:** N/A (public pages) ([feature-index.md](../../02-architecture/feature-index.md))

- [x] **Task 1.1.1.16:** Implement Legal pages
  - 📐 **Wireframe:** Legal pages wireframes (see [wireframe-route-mapping.md](../../02-architecture/frontend/wireframe-route-mapping.md))
  - 🛣️ **Route:** `/legal/terms`, `/legal/privacy`, `/legal/cookies` ([routing-structure.md](../../02-architecture/frontend/routing-structure.md#public-routes))
  - 💾 **Database:** N/A (public pages) ([feature-index.md](../../02-architecture/feature-index.md))
  - 🔌 **API:** N/A (public pages) ([feature-index.md](../../02-architecture/feature-index.md))

- [x] **Task 1.1.1.17:** Implement System status page ⚠️ **DEPENDS ON:** Task 1.1.1.2d (system status RPC function)
  - 📐 **Wireframe:** [task-0.5.1.41](../../04-design/user-experience/wireframes/00-core-foundation/public/task-0.5.1.41-system-status.md)
  - 🛣️ **Route:** `/status` ([routing-structure.md](../../02-architecture/frontend/routing-structure.md#public-routes))
  - 💾 **Database:** `system_config` (for status information) ([feature-index.md](../../02-architecture/feature-index.md))
  - 🔌 **API:** System status check functions ([feature-index.md](../../02-architecture/feature-index.md))

### Core Dashboard Pages Tasks
- [x] **Task 1.1.1.18:** Implement User profile page ⚠️ **DEPENDS ON:** Task 1.1.1.2b (shared RPC functions)
  - 📐 **Wireframe:** [task-0.5.1.22](../../04-design/user-experience/wireframes/00-core-foundation/profile/task-0.5.1.22-user-profile.md)
  - 🛣️ **Route:** `/profile` ([routing-structure.md](../../02-architecture/frontend/routing-structure.md#dashboard-routes))
  - 💾 **Database:** `users` ([feature-index.md](../../02-architecture/feature-index.md#user-profile))
  - 🔌 **API:** `shared_update_user_profile()`, `shared_update_user_preferences()` ([feature-index.md](../../02-architecture/feature-index.md#user-profile))

- [x] **Task 1.1.1.19:** Implement Notifications page ⚠️ **DEPENDS ON:** Task 1.1.1.2b (shared RPC functions)
  - 📐 **Wireframe:** [task-0.5.1.31](../../04-design/user-experience/wireframes/00-core-foundation/notifications/task-0.5.1.31-notifications-page.md)
  - 🛣️ **Route:** `/notifications` ([routing-structure.md](../../02-architecture/frontend/routing-structure.md#dashboard-routes))
  - 💾 **Database:** `notifications` ([feature-index.md](../../02-architecture/feature-index.md#notifications-page))
  - 🔌 **API:** `shared_get_notifications()`, `shared_mark_notification_read()` ([feature-index.md](../../02-architecture/feature-index.md#notifications-page))

- [x] **Task 1.1.1.20:** Implement History overview page (role-based)
  - 📐 **Wireframe:** [task-0.5.1.30](../../04-design/user-experience/wireframes/05-audit-historical/historical-data/task-0.5.1.30-history-overview.md)
  - 🛣️ **Route:** `/history` ([routing-structure.md](../../02-architecture/frontend/routing-structure.md#historical-data-routes))
  - 💾 **Database:** All module tables (historical data) ([feature-index.md](../../02-architecture/feature-index.md#history-overview))
  - 🔌 **API:** `vci_get_historical_submissions()`, `rmm_get_history()`, historical data RPC functions ([feature-index.md](../../02-architecture/feature-index.md#history-overview))

- [x] **Task 1.1.1.21:** Implement Audit logs pages ⚠️ **DEPENDS ON:** Task 1.1.1.2b (shared RPC functions)
  - 📐 **Wireframe:** [task-0.5.1.32](../../04-design/user-experience/wireframes/05-audit-historical/audit/task-0.5.1.32-audit-logs-list.md), [task-0.5.1.33](../../04-design/user-experience/wireframes/05-audit-historical/audit/task-0.5.1.33-audit-log-detail.md), [task-0.5.1.34](../../04-design/user-experience/wireframes/05-audit-historical/audit/task-0.5.1.34-audit-reports.md)
  - 🛣️ **Route:** `/audit/logs`, `/audit/logs/[id]`, `/audit/reports` ([routing-structure.md](../../02-architecture/frontend/routing-structure.md#historical-data-routes))
  - 💾 **Database:** `audit_logs` ([feature-index.md](../../02-architecture/feature-index.md#audit-logs))
  - 🔌 **API:** `shared_get_audit_logs()`, `shared_get_audit_log_detail()`, `shared_generate_audit_report()` ([feature-index.md](../../02-architecture/feature-index.md#audit-logs))

### Communications Module Tasks
- [x] **Task 1.1.1.22:** Implement Communications inbox and conversation pages ⚠️ **DEPENDS ON:** Tasks 1.1.1.2a (communications tables migration), 1.1.1.2c (communications RPC functions), 1.1.1.8a (communications RLS policies)
  - 📐 **Wireframe:** [task-0.5.1.24](../../04-design/user-experience/wireframes/00-core-foundation/communications/task-0.5.1.24-inbox-list.md), [task-0.5.1.25](../../04-design/user-experience/wireframes/00-core-foundation/communications/task-0.5.1.25-conversation-detail.md)
  - 🛣️ **Route:** `/communications/inbox`, `/communications/inbox/[conversation_id]` ([routing-structure.md](../../02-architecture/frontend/routing-structure.md#historical-data-routes))
  - 💾 **Database:** `conversations`, `messages`, `message_attachments`, `message_read_receipts` ([feature-index.md](../../02-architecture/feature-index.md#communications))
  - 🔌 **API:** `communications_list_conversations()`, `communications_get_conversation()`, `communications_send_message()` ([feature-index.md](../../02-architecture/feature-index.md#communications))

- [x] **Task 1.1.1.23:** Implement Communications compose and sent pages ⚠️ **DEPENDS ON:** Tasks 1.1.1.2a (communications tables migration), 1.1.1.2c (communications RPC functions), 1.1.1.8a (communications RLS policies)
  - 📐 **Wireframe:** [task-0.5.1.26](../../04-design/user-experience/wireframes/00-core-foundation/communications/task-0.5.1.26-compose-message.md), [task-0.5.1.27](../../04-design/user-experience/wireframes/00-core-foundation/communications/task-0.5.1.27-sent-messages.md)
  - 🛣️ **Route:** `/communications/compose`, `/communications/sent` ([routing-structure.md](../../02-architecture/frontend/routing-structure.md#historical-data-routes))
  - 💾 **Database:** `conversations`, `messages`, `message_attachments` ([feature-index.md](../../02-architecture/feature-index.md#communications))
  - 🔌 **API:** `communications_create_conversation()`, `communications_send_message()`, `communications_list_sent()` ([feature-index.md](../../02-architecture/feature-index.md#communications))

- [x] **Task 1.1.1.24:** Implement Communications announcements and archived pages ⚠️ **DEPENDS ON:** Tasks 1.1.1.2a (communications tables migration), 1.1.1.2c (communications RPC functions), 1.1.1.8a (communications RLS policies)
  - 📐 **Wireframe:** [task-0.5.1.28](../../04-design/user-experience/wireframes/00-core-foundation/communications/task-0.5.1.28-system-announcements.md), [task-0.5.1.36](../../04-design/user-experience/wireframes/00-core-foundation/communications/task-0.5.1.36-archived-conversations.md)
  - 🛣️ **Route:** `/communications/announcements`, `/communications/archived` ([routing-structure.md](../../02-architecture/frontend/routing-structure.md#historical-data-routes))
  - 💾 **Database:** `conversations`, `messages` ([feature-index.md](../../02-architecture/feature-index.md#communications))
  - 🔌 **API:** `communications_create_announcement()`, `communications_list_announcements()`, `communications_archive_conversation()`, `communications_list_archived()` ([feature-index.md](../../02-architecture/feature-index.md#communications))

---

## Subphase 1.1.2: RMM Module - Core Registry Management (Week 2-3)

**🔒 COMPLIANCE VALIDATION (Sami - Required Before ANY Task):**

**⚠️ STOP AUTHORITY:** Sami (Implementation Compliance Specialist) has **MANDATORY STOP AUTHORITY**. If ANY compliance rule is violated, implementation **MUST STOP IMMEDIATELY**. No exceptions.

**Before starting ANY task in this subphase, the following MUST be verified and documented:**

- [ ] **1. Sequential Task Verification (MANDATORY):** All previous tasks from Subphase 1.1.1 are complete and checked off (`[x]`). **NO TASK CAN START UNTIL ALL PREVIOUS TASKS ARE COMPLETE.** Sami verifies this before every task. Starting a task out of sequence is a **COMPLIANCE VIOLATION**.
- [ ] **2. Role Name Verification:** Frontend role names match database schema exactly; role constants match `users.role` enum values; no hardcoded role strings (use constants).
- [ ] **3. Schema Verification:** Database schema verified before role-dependent code; all required tables/fields/RLS policies exist; Phase 0.6 schema additions incorporated where applicable.
- [ ] **4. Integration Verification:** Layout/components integrated into routes (if applicable); navigation updated (if new routes added); module routing structure updated.
- [ ] **5. Role Coverage Verification:** All 9 roles are handled where applicable (Company Admin, Company Manager, Company User, MOH Tier 1, MOH Tier 2 Officer, MOH Tier 2 Registrar, MOH Auditor, System Admin, Vendor); role variants match wireframe specifications.
- [ ] **6. Wireframe Compliance:** Wireframe reviewed before starting; wireframe task ID(s) identified; wireframe requirements understood (layout, interactions, states, role-based variations); wireframe annotations reviewed.
- [ ] **7. Data Source Verification:** NO local mock data used (NO `const mockData = [...]`, NO `mockData.ts`, NO runtime mocks); all data queries Supabase database; seed data applied if required (verify via `supabase migration list`); database tables verified before starting (use SQL queries).
- [ ] **8. Wireframe Binding:** Wireframe binding comments will be added to code (JSDoc format with wireframe link); wireframe task ID(s) documented in code comments; PR description will include wireframe link(s); wireframe binding in both PR description AND codebase.
- [ ] **9. Seed Data Gate (If Applicable):** Seed migration `seed_1_1_2_rmm` applied and verified (see below for verification requirements); seed data acceptance criteria verified; RLS validation completed if required; seed data covers wireframe scenarios.
- [ ] **Wireframe-First Implementation Principle:** Wireframes are the PRIMARY design reference. If a wireframe doesn't exist, **STOP** and create it first. See [Compliance Rules - Wireframe-First Implementation Principle](../standards/compliance-rules.md#wireframe-first-implementation-principle) for complete requirements.
- [ ] **Sami's Compliance Checklist:** Will be used for EVERY task in this subphase. **No task proceeds without Sami's approval.**
- [ ] **Sami's Approval:** Compliance review completed and approved by Sami before task start. **MANDATORY - No task can proceed without this approval.**
- [ ] **Implementation Summary Compliance Section:** After task completion, implementation summary MUST include compliance section documenting all rules followed (see "Implementation Summary Compliance Requirement" section above). **PRs without compliance section will be REJECTED.**
- [ ] **PR Description Checklist:** See [Compliance Rules - PR Description Checklist](../standards/compliance-rules.md#pr-description-checklist-required) for the complete 9-item checklist that every frontend task PR must include.

**🚫 STOP CONDITIONS (Do Not Proceed):**

**STOP implementation and resolve before proceeding** if any of the following is true:

- **Wireframe Requirements:** No wireframe link exists for the page/route being implemented. **STOP** and request/produce the wireframe first. Do not guess layouts, flows, or states.
- **Database & Schema Requirements:** Required DB table/field/RPC does not exist yet. **STOP** and implement the missing backend task first. Do not create local mocks as a workaround.
- **Security & Access Requirements:** RLS/policies prevent required access for the wireframed role. **STOP** and implement/update RLS policies before proceeding.
- **Seed Data Requirements:** Seed migration is not idempotent (must use deterministic IDs + UPSERT patterns). **STOP** and fix migration per [Playbook - Idempotency Patterns](phase-1-1-mockdata.md#idempotency-patterns).
- **Sequential Execution:** Previous tasks are not complete. **STOP** and complete all prerequisite tasks first.
- **Role Name Mismatch:** Frontend role names don't match database schema. **STOP** and fix role names to match schema exactly.

**Prerequisites:**
- ✅ Phase 0.5 (Wireframes) completed and approved - 9 P0 wireframes signed off (2026-01-12)
- ✅ Phase 0.6 (Database Schema Audit & Alignment) completed - Database review ready for P0 routes
- **Reference Documents:**
  - [Route Inventory](../../02-architecture/frontend/route-inventory.md) - Complete status of all 51 routes
  - [Wireframe-Route Mapping](../../02-architecture/frontend/wireframe-route-mapping.md) - All routes mapped to wireframes
  - [Route Naming Decision](../../02-architecture/frontend/route-naming-decision.md) - Naming convention documentation
  - [Frontend Architecture README](../../02-architecture/frontend/README.md) - Single source of truth for frontend docs

**⚠️ CRITICAL:** All implementation tasks in Subphase 1.1.1 (Tasks 1.1.1.1 through 1.1.1.24) are **AWAITING IMPLEMENTATION** and have not been started.

**Seed Data Gate (Required):**
- Before starting RMM frontend pages, apply the seed migration stage `seed_1_1_2_rmm` per [Phase 1.1 Playbook - Stage: seed_1_1_2_rmm](phase-1-1-mockdata.md#stage-seed_1_1_2_rmm-subphase-112) (versioned SQL migrations, idempotent).

**Seed Stage Acceptance Criteria (from Playbook):**
- **Goal:** Make RMM pages (companies/products/SKUs/registry submissions) testable.
- **Minimum tables touched (expected):**
  - `companies`, `users`
  - `atc_codes`
  - `products`
  - `skus` (must include Phase 0.6 pharma attributes: dosage_strength/dosage_form/pack_size/unit_of_measure)
  - `registry_submissions` + approvals/workflow history tables as defined in schema
- **Scenario packs required (deterministic IDs):**
  - Continue using `pack_company_active` and `pack_company_empty` from foundation stage
  - Extend `pack_company_active` with registry submissions across workflow statuses (draft, pending_verification, pending_approval, approved, pending_implementation, implemented, completed, rejected)
  - Ensure `pack_company_active` has registry submission activity to validate workflow wireframes
- **Acceptance criteria:**
  - Companies list has enough rows to validate pagination/sorting/filtering.
  - Company detail tabs have meaningful content for "active" company and empty state for "empty" company.
  - SKU list/detail show pharma attributes, not blanks.
  - Registry submissions exist across statuses required by the wireframes.
  - **RLS validation required:** Seed data must be validated under real roles (Company, MOH Tier 1, MOH Tier 2). Seeded data that users can't see under RLS policies is invalid. Test each role's data visibility matches wireframe requirements. See [Playbook - RLS Realism](phase-1-1-mockdata.md) for requirements.
  - Scenario packs use deterministic IDs for idempotency (safe to re-run migrations). See [Playbook - Idempotency Patterns](phase-1-1-mockdata.md#idempotency-patterns) for SQL examples and requirements.
- **Verification Required:** After applying seed migration, complete verification checklist per [Phase 1.1 Playbook - Verification Checklist](phase-1-1-mockdata.md#verification-checklist-must-be-executed-after-each-seed-migration) (Hassan - full ownership of seed data seeding and testing; coordinates with Nadia for integrity verification, Farah for realism validation).
- **Reference:** See [Playbook - Stage: seed_1_1_2_rmm](phase-1-1-mockdata.md#stage-seed_1_1_2_rmm-subphase-112), [Playbook - Scenario Packs](phase-1-1-mockdata.md#seed-strategy-scenario-packs-deterministic), and [Playbook - Idempotency Patterns](phase-1-1-mockdata.md#idempotency-patterns) for complete details.

**⚠️ Backend Completion Gate:** All RMM backend tasks (1.1.2.1-1.1.2.15) and Enforcement backend tasks (1.1.2.31-1.1.2.36) must be complete before frontend tasks begin. **Frontend tasks starting before backend completion is a COMPLIANCE VIOLATION.**

**Note:** All phases now have explicit backend completion gates. RMM has 51 backend tasks explicitly listed. VCI, ECS, and CMC phases have explicit gates at each subphase (backend tasks must complete before frontend tasks begin). **Frontend tasks starting before backend completion is a COMPLIANCE VIOLATION in all phases.**

### RMM Backend Tasks
- [ ] **Task 1.1.2.1:** Create RMM RPC functions - Company CRUD
  - 💾 **Database:** `companies`, `registry_submissions` ([feature-index.md](../../02-architecture/feature-index.md#company-management))
  - 🔌 **API:** `rmm_create_company()`, `rmm_update_company()`, `rmm_get_company()`, `rmm_list_companies()`, `rmm_submit_registry_update()` ([feature-index.md](../../02-architecture/feature-index.md#company-management))

- [ ] **Task 1.1.2.2:** Create RMM RPC functions - Product CRUD
  - 💾 **Database:** `products`, `registry_submissions` ([feature-index.md](../../02-architecture/feature-index.md#product-management))
  - 🔌 **API:** `rmm_create_product()`, `rmm_update_product()`, `rmm_get_product()`, `rmm_list_products()`, `rmm_submit_registry_update()` ([feature-index.md](../../02-architecture/feature-index.md#product-management))

- [ ] **Task 1.1.2.3:** Create RMM RPC functions - SKU CRUD
  - 💾 **Database:** `skus`, `registry_submissions` ([feature-index.md](../../02-architecture/feature-index.md#sku-management))
  - 🔌 **API:** `rmm_create_sku()`, `rmm_update_sku()`, `rmm_get_sku()`, `rmm_list_skus()`, `rmm_submit_registry_update()` ([feature-index.md](../../02-architecture/feature-index.md#sku-management))

- [ ] **Task 1.1.2.3a:** Create RMM helper RPC functions (history and relationship queries)
  - 💾 **Database:** `companies`, `products`, `skus`, `registry_submissions` ([feature-index.md](../../02-architecture/feature-index.md#company-management))
  - 🔌 **API:** `rmm_list_company_products()`, `rmm_get_company_history()`, `rmm_list_product_skus()`, `rmm_get_product_history()`, `rmm_get_sku_history()` ([feature-index.md](../../02-architecture/feature-index.md#company-management))

- [ ] **Task 1.1.2.4:** Create RMM RPC functions - ATC Code management (MOH only)
  - 💾 **Database:** `atc_codes` ([feature-index.md](../../02-architecture/feature-index.md))
  - 🔌 **API:** RMM ATC Code management functions ([feature-index.md](../../02-architecture/feature-index.md))

- [ ] **Task 1.1.2.5:** Create RMM RPC functions - Critical Medicine management (MOH only)
  - 💾 **Database:** `critical_medicines` ([feature-index.md](../../02-architecture/feature-index.md))
  - 🔌 **API:** RMM Critical Medicine management functions ([feature-index.md](../../02-architecture/feature-index.md))

- [ ] **Task 1.1.2.6:** Implement registry submission workflow - Create submission
  - 💾 **Database:** `registry_submissions`, `approval_history` ([feature-index.md](../../02-architecture/feature-index.md#registry-submission-workflow))
  - 🔌 **API:** `rmm_submit_registry_update()` ([feature-index.md](../../02-architecture/feature-index.md#registry-submission-workflow))

- [ ] **Task 1.1.2.7:** Implement registry submission workflow - Tier 2 verification
  - 💾 **Database:** `registry_submissions`, `approval_history` ([feature-index.md](../../02-architecture/feature-index.md#registry-submission-workflow))
  - 🔌 **API:** `rmm_verify_registry_submission()` ([feature-index.md](../../02-architecture/feature-index.md#registry-submission-workflow))

- [ ] **Task 1.1.2.8:** Implement registry submission workflow - Tier 1 approval
  - 💾 **Database:** `registry_submissions`, `approval_history` ([feature-index.md](../../02-architecture/feature-index.md#registry-submission-workflow))
  - 🔌 **API:** `rmm_approve_registry_submission()` ([feature-index.md](../../02-architecture/feature-index.md#registry-submission-workflow))

- [ ] **Task 1.1.2.9:** Implement registry submission workflow - Tier 2 implementation
  - 💾 **Database:** `registry_submissions`, `approval_history`, target tables (companies/products/skus) ([feature-index.md](../../02-architecture/feature-index.md#registry-submission-workflow))
  - 🔌 **API:** `rmm_implement_registry_update()` ([feature-index.md](../../02-architecture/feature-index.md#registry-submission-workflow))

- [ ] **Task 1.1.2.10:** Implement registry submission workflow - Completion
  - 💾 **Database:** `registry_submissions`, `approval_history` ([feature-index.md](../../02-architecture/feature-index.md#registry-submission-workflow))
  - 🔌 **API:** Registry submission completion workflow ([feature-index.md](../../02-architecture/feature-index.md#registry-submission-workflow))

- [ ] **Task 1.1.2.11:** Implement registry submission workflow - Rejection
  - 💾 **Database:** `registry_submissions`, `approval_history` ([feature-index.md](../../02-architecture/feature-index.md#registry-submission-workflow))
  - 🔌 **API:** Registry submission rejection workflow ([feature-index.md](../../02-architecture/feature-index.md#registry-submission-workflow))

- [ ] **Task 1.1.2.12:** Implement MOH submission workflow - Peer review
  - 💾 **Database:** `registry_submissions`, `approval_history` ([feature-index.md](../../02-architecture/feature-index.md#registry-submission-workflow))
  - 🔌 **API:** MOH peer review workflow functions ([feature-index.md](../../02-architecture/feature-index.md#registry-submission-workflow))

- [ ] **Task 1.1.2.13:** Implement cascade deactivation logic
  - 💾 **Database:** `companies`, `products`, `skus`, `registry_submissions` ([feature-index.md](../../02-architecture/feature-index.md))
  - 🔌 **API:** Cascade deactivation RPC functions ([feature-index.md](../../02-architecture/feature-index.md))

- [ ] **Task 1.1.2.14:** Implement soft delete safeguards
  - 💾 **Database:** All RMM tables with soft delete support ([feature-index.md](../../02-architecture/feature-index.md))
  - 🔌 **API:** Soft delete safeguard functions ([feature-index.md](../../02-architecture/feature-index.md))

- [ ] **Task 1.1.2.15:** Implement two-person rule for critical actions
  - 💾 **Database:** `approval_history`, all workflow tables ([feature-index.md](../../02-architecture/feature-index.md))
  - 🔌 **API:** Two-person rule validation functions ([feature-index.md](../../02-architecture/feature-index.md))

### Enforcement Backend Tasks ⚠️ **CRITICAL:** Must be complete before Enforcement frontend tasks
- [ ] **Task 1.1.2.31:** Create Enforcement RPC function - Submit for review
  - 💾 **Database:** `enforcement_actions`, `registry_submissions` ([feature-index.md](../../02-architecture/feature-index.md#enforcement-module))
  - 🔌 **API:** `enforcement_create_action()`, `enforcement_submit_action()` ([feature-index.md](../../02-architecture/feature-index.md#enforcement-module))

- [ ] **Task 1.1.2.32:** Create Enforcement RPC function - Review action
  - 💾 **Database:** `enforcement_actions`, `approval_history` ([feature-index.md](../../02-architecture/feature-index.md#enforcement-module))
  - 🔌 **API:** Enforcement review action functions ([feature-index.md](../../02-architecture/feature-index.md#enforcement-module))

- [ ] **Task 1.1.2.33:** Create Enforcement RPC function - Approve action
  - 💾 **Database:** `enforcement_actions`, `approval_history` ([feature-index.md](../../02-architecture/feature-index.md#enforcement-module))
  - 🔌 **API:** `enforcement_approve_action()` ([feature-index.md](../../02-architecture/feature-index.md#enforcement-module))

- [ ] **Task 1.1.2.34:** Create Enforcement RPC function - Execute action
  - 💾 **Database:** `enforcement_actions`, `approval_history` ([feature-index.md](../../02-architecture/feature-index.md#enforcement-module))
  - 🔌 **API:** Enforcement execute action functions ([feature-index.md](../../02-architecture/feature-index.md#enforcement-module))

- [ ] **Task 1.1.2.35:** Create Enforcement RPC function - Appeal action
  - 💾 **Database:** `appeals`, `enforcement_actions` ([feature-index.md](../../02-architecture/feature-index.md#enforcement-module))
  - 🔌 **API:** `enforcement_submit_appeal()` ([feature-index.md](../../02-architecture/feature-index.md#enforcement-module))

- [ ] **Task 1.1.2.36:** Create Enforcement RPC function - Resolve appeal
  - 💾 **Database:** `appeals`, `enforcement_actions`, `approval_history` ([feature-index.md](../../02-architecture/feature-index.md#enforcement-module))
  - 🔌 **API:** `enforcement_review_appeal()`, `enforcement_uphold_appeal()`, `enforcement_overturn_appeal()` ([feature-index.md](../../02-architecture/feature-index.md#enforcement-module))

### RMM Frontend Tasks
- [ ] **Task 1.1.2.16:** Create RMM module layout and navigation ⚠️ **MUST BE FIRST** - Other pages depend on this
  - 📐 **Wireframe:** [task-0.5.1.14](../../04-design/user-experience/wireframes/00-core-foundation/layout-navigation/task-0.5.1.14-dashboard-layout-structure.md), [task-0.5.1.16](../../04-design/user-experience/wireframes/00-core-foundation/layout-navigation/task-0.5.1.16-sidebar-navigation.md)
  - 🛣️ **Route:** `/rmm` layout ([routing-structure.md](../../02-architecture/frontend/routing-structure.md#rmm-routes))
  - 💾 **Database:** `users`, `system_config` ([feature-index.md](../../02-architecture/feature-index.md#dashboard--navigation))
  - 🔌 **API:** `shared_get_user_permissions()` ([feature-index.md](../../02-architecture/feature-index.md#dashboard--navigation))

- [ ] **Task 1.1.2.17:** Implement Companies list page
  - 📐 **Wireframe:** [task-0.5.2.2](../../04-design/user-experience/wireframes/01-rmm/companies/task-0.5.2.2-companies-list.md)
  - 🛣️ **Route:** `/rmm/companies` ([routing-structure.md](../../02-architecture/frontend/routing-structure.md#rmm-routes))
  - 💾 **Database:** `companies` table ([feature-index.md](../../02-architecture/feature-index.md#company-management))
  - 🔌 **API:** `rmm_list_companies()`, `rmm_get_company()` ([feature-index.md](../../02-architecture/feature-index.md#company-management))

- [ ] **Task 1.1.2.18:** Implement Company detail page ⚠️ **DEPENDS ON:** Task 1.1.2.3a (RMM helper RPC functions)
  - 📐 **Wireframe:** [task-0.5.2.3](../../04-design/user-experience/wireframes/01-rmm/companies/task-0.5.2.3-company-detail.md)
  - 🛣️ **Route:** `/rmm/companies/[id]` ([routing-structure.md](../../02-architecture/frontend/routing-structure.md#rmm-routes))
  - 💾 **Database:** `companies`, `products`, `registry_submissions` ([feature-index.md](../../02-architecture/feature-index.md#company-management))
  - 🔌 **API:** `rmm_get_company()`, `rmm_list_company_products()`, `rmm_get_company_history()` ([feature-index.md](../../02-architecture/feature-index.md#company-management))

- [ ] **Task 1.1.2.18a:** Implement Company products page (Products tab view) ⚠️ **DEPENDS ON:** Task 1.1.2.3a (RMM helper RPC functions)
  - 📐 **Wireframe:** [task-0.5.2.3](../../04-design/user-experience/wireframes/01-rmm/companies/task-0.5.2.3-company-detail.md) (Products tab)
  - 🛣️ **Route:** `/rmm/companies/[id]/products` ([routing-structure.md](../../02-architecture/frontend/routing-structure.md#rmm-routes))
  - 💾 **Database:** `companies`, `products` ([feature-index.md](../../02-architecture/feature-index.md#company-management))
  - 🔌 **API:** `rmm_list_company_products()`, `rmm_get_product()` ([feature-index.md](../../02-architecture/feature-index.md#company-management))

- [ ] **Task 1.1.2.19:** Implement Company create/edit forms
  - 📐 **Wireframe:** [task-0.5.2.8](../../04-design/user-experience/wireframes/01-rmm/companies/task-0.5.2.8-company-create-edit-form.md)
  - 🛣️ **Route:** `/rmm/companies/new`, `/rmm/companies/[id]/edit` ([routing-structure.md](../../02-architecture/frontend/routing-structure.md#rmm-routes))
  - 💾 **Database:** `companies`, `registry_submissions` ([feature-index.md](../../02-architecture/feature-index.md#company-management))
  - 🔌 **API:** `rmm_create_company()`, `rmm_update_company()`, `rmm_submit_registry_update()` ([feature-index.md](../../02-architecture/feature-index.md#company-management))

- [ ] **Task 1.1.2.20:** Implement Products list page
  - 📐 **Wireframe:** [task-0.5.2.4](../../04-design/user-experience/wireframes/01-rmm/products/task-0.5.2.4-products-list.md)
  - 🛣️ **Route:** `/rmm/products` ([routing-structure.md](../../02-architecture/frontend/routing-structure.md#rmm-routes))
  - 💾 **Database:** `products`, `companies` ([feature-index.md](../../02-architecture/feature-index.md#product-management))
  - 🔌 **API:** `rmm_list_products()`, `rmm_get_product()` ([feature-index.md](../../02-architecture/feature-index.md#product-management))

- [ ] **Task 1.1.2.21:** Implement Product detail page ⚠️ **DEPENDS ON:** Task 1.1.2.3a (RMM helper RPC functions)
  - 📐 **Wireframe:** [task-0.5.2.5](../../04-design/user-experience/wireframes/01-rmm/products/task-0.5.2.5-product-detail.md)
  - 🛣️ **Route:** `/rmm/products/[id]` ([routing-structure.md](../../02-architecture/frontend/routing-structure.md#rmm-routes))
  - 💾 **Database:** `products`, `skus`, `registry_submissions` ([feature-index.md](../../02-architecture/feature-index.md#product-management))
  - 🔌 **API:** `rmm_get_product()`, `rmm_list_product_skus()`, `rmm_get_product_history()` ([feature-index.md](../../02-architecture/feature-index.md#product-management))

- [ ] **Task 1.1.2.22:** Implement Product create/edit forms
  - 📐 **Wireframe:** [task-0.5.2.9](../../04-design/user-experience/wireframes/01-rmm/products/task-0.5.2.9-product-create-edit-form.md)
  - 🛣️ **Route:** `/rmm/products/new`, `/rmm/products/[id]/edit` ([routing-structure.md](../../02-architecture/frontend/routing-structure.md#rmm-routes))
  - 💾 **Database:** `products`, `registry_submissions` ([feature-index.md](../../02-architecture/feature-index.md#product-management))
  - 🔌 **API:** `rmm_create_product()`, `rmm_update_product()`, `rmm_submit_registry_update()` ([feature-index.md](../../02-architecture/feature-index.md#product-management))

- [ ] **Task 1.1.2.23:** Implement SKUs list page
  - 📐 **Wireframe:** [task-0.5.2.6](../../04-design/user-experience/wireframes/01-rmm/skus/task-0.5.2.6-skus-list.md)
  - 🛣️ **Route:** `/rmm/skus` ([routing-structure.md](../../02-architecture/frontend/routing-structure.md#rmm-routes))
  - 💾 **Database:** `skus`, `products` ([feature-index.md](../../02-architecture/feature-index.md#sku-management))
  - 🔌 **API:** `rmm_list_skus()`, `rmm_get_sku()` ([feature-index.md](../../02-architecture/feature-index.md#sku-management))

- [ ] **Task 1.1.2.24:** Implement SKU detail page ⚠️ **DEPENDS ON:** Task 1.1.2.3a (RMM helper RPC functions)
  - 📐 **Wireframe:** [task-0.5.2.7](../../04-design/user-experience/wireframes/01-rmm/skus/task-0.5.2.7-sku-detail.md)
  - 🛣️ **Route:** `/rmm/skus/[id]` ([routing-structure.md](../../02-architecture/frontend/routing-structure.md#rmm-routes))
  - 💾 **Database:** `skus`, `registry_submissions`, `thresholds` ([feature-index.md](../../02-architecture/feature-index.md#sku-management))
  - 🔌 **API:** `rmm_get_sku()`, `rmm_get_sku_history()`, `vci_get_sku_thresholds()` ([feature-index.md](../../02-architecture/feature-index.md#sku-management))

- [ ] **Task 1.1.2.25:** Implement SKU create/edit forms (include pharmaceutical attributes)
  - 📐 **Wireframe:** [task-0.5.2.10](../../04-design/user-experience/wireframes/01-rmm/skus/task-0.5.2.10-sku-create-edit-form.md)
  - 🛣️ **Route:** `/rmm/skus/new`, `/rmm/skus/[id]/edit` ([routing-structure.md](../../02-architecture/frontend/routing-structure.md#rmm-routes))
  - 💾 **Database:** `skus`, `registry_submissions` ([feature-index.md](../../02-architecture/feature-index.md#sku-management))
  - 🔌 **API:** `rmm_create_sku()`, `rmm_update_sku()`, `rmm_submit_registry_update()` ([feature-index.md](../../02-architecture/feature-index.md#sku-management))

- [ ] **Task 1.1.2.26:** Implement Registry submission list page
  - 📐 **Wireframe:** [task-0.5.2.11](../../04-design/user-experience/wireframes/01-rmm/workflow/task-0.5.2.11-registry-submission-list.md)
  - 🛣️ **Route:** `/rmm/submissions` ([routing-structure.md](../../02-architecture/frontend/routing-structure.md#rmm-routes))
  - 💾 **Database:** `registry_submissions` ([feature-index.md](../../02-architecture/feature-index.md#registry-submission-workflow))
  - 🔌 **API:** `rmm_list_submissions()`, `rmm_get_submission()` ([feature-index.md](../../02-architecture/feature-index.md#registry-submission-workflow))

- [ ] **Task 1.1.2.27:** Implement Registry submission detail page
  - 📐 **Wireframe:** [task-0.5.2.12](../../04-design/user-experience/wireframes/01-rmm/workflow/task-0.5.2.12-registry-submission-detail.md)
  - 🛣️ **Route:** `/rmm/submissions/[id]` ([routing-structure.md](../../02-architecture/frontend/routing-structure.md#rmm-routes))
  - 💾 **Database:** `registry_submissions`, `approval_history` ([feature-index.md](../../02-architecture/feature-index.md#registry-submission-workflow))
  - 🔌 **API:** `rmm_get_submission()`, `rmm_get_approval_history()` ([feature-index.md](../../02-architecture/feature-index.md#registry-submission-workflow))

- [ ] **Task 1.1.2.28:** Implement Registry submission workflow actions
  - 📐 **Wireframe:** [task-0.5.2.13](../../04-design/user-experience/wireframes/01-rmm/workflow/task-0.5.2.13-registry-submission-workflow-states.md)
  - 🛣️ **Route:** Modal/action components on submission detail page ([routing-structure.md](../../02-architecture/frontend/routing-structure.md#rmm-routes))
  - 💾 **Database:** `registry_submissions`, `approval_history` ([feature-index.md](../../02-architecture/feature-index.md#registry-submission-workflow))
  - 🔌 **API:** `rmm_verify_registry_submission()`, `rmm_approve_registry_submission()`, `rmm_implement_registry_update()` ([feature-index.md](../../02-architecture/feature-index.md#registry-submission-workflow))

- [ ] **Task 1.1.2.29:** Implement ATC Codes list page (MOH only)
  - 📐 **Wireframe:** [task-0.5.2.14](../../04-design/user-experience/wireframes/01-rmm/task-0.5.2.14-atc-codes-list.md)
  - 🛣️ **Route:** `/rmm/atc-codes` or similar ([routing-structure.md](../../02-architecture/frontend/routing-structure.md#rmm-routes))
  - 💾 **Database:** `atc_codes` ([feature-index.md](../../02-architecture/feature-index.md))
  - 🔌 **API:** RMM ATC Code management functions ([feature-index.md](../../02-architecture/feature-index.md))

- [ ] **Task 1.1.2.30:** Implement Critical Medicines list page (MOH only)
  - 📐 **Wireframe:** [task-0.5.2.15](../../04-design/user-experience/wireframes/01-rmm/task-0.5.2.15-critical-medicines-list.md)
  - 🛣️ **Route:** `/rmm/critical-medicines` or similar ([routing-structure.md](../../02-architecture/frontend/routing-structure.md#rmm-routes))
  - 💾 **Database:** `critical_medicines` ([feature-index.md](../../02-architecture/feature-index.md))
  - 🔌 **API:** RMM Critical Medicine management functions ([feature-index.md](../../02-architecture/feature-index.md))

### Enforcement Frontend Tasks
- [ ] **Task 1.1.2.37:** Implement Enforcement dashboard page
  - 📐 **Wireframe:** [task-0.5.2.0](../../04-design/user-experience/wireframes/01-rmm/enforcement/task-0.5.2.0-enforcement-dashboard.md)
  - 🛣️ **Route:** `/enforcement` ([routing-structure.md](../../02-architecture/frontend/routing-structure.md#enforcement-routes))
  - 💾 **Database:** `enforcement_actions`, `companies` ([feature-index.md](../../02-architecture/feature-index.md#enforcement-module))
  - 🔌 **API:** `enforcement_get_dashboard_stats()` ([feature-index.md](../../02-architecture/feature-index.md#enforcement-module))

- [ ] **Task 1.1.2.38:** Implement Enforcement actions list page
  - 📐 **Wireframe:** [task-0.5.2.1](../../04-design/user-experience/wireframes/01-rmm/enforcement/task-0.5.2.1-enforcement-actions-list.md)
  - 🛣️ **Route:** `/enforcement/actions` ([routing-structure.md](../../02-architecture/frontend/routing-structure.md#enforcement-routes))
  - 💾 **Database:** `enforcement_actions` ([feature-index.md](../../02-architecture/feature-index.md#enforcement-module))
  - 🔌 **API:** `enforcement_list_actions()`, `enforcement_get_action()` ([feature-index.md](../../02-architecture/feature-index.md#enforcement-module))

- [ ] **Task 1.1.2.39:** Implement Enforcement action detail page
  - 📐 **Wireframe:** [task-0.5.2.1a](../../04-design/user-experience/wireframes/01-rmm/enforcement/task-0.5.2.1a-enforcement-action-detail.md)
  - 🛣️ **Route:** `/enforcement/actions/[id]` ([routing-structure.md](../../02-architecture/frontend/routing-structure.md#enforcement-routes))
  - 💾 **Database:** `enforcement_actions`, `approval_history`, `appeals` ([feature-index.md](../../02-architecture/feature-index.md#enforcement-module))
  - 🔌 **API:** `enforcement_get_action()`, `enforcement_get_appeals()` ([feature-index.md](../../02-architecture/feature-index.md#enforcement-module))

- [ ] **Task 1.1.2.40:** Implement Create enforcement action wizard
  - 📐 **Wireframe:** [task-0.5.2.1b](../../04-design/user-experience/wireframes/01-rmm/enforcement/task-0.5.2.1b-create-enforcement-action-wizard.md)
  - 🛣️ **Route:** `/enforcement/actions/new` ([routing-structure.md](../../02-architecture/frontend/routing-structure.md#enforcement-routes))
  - 💾 **Database:** `enforcement_actions`, `registry_submissions` ([feature-index.md](../../02-architecture/feature-index.md#enforcement-module))
  - 🔌 **API:** `enforcement_create_action()`, `enforcement_submit_action()` ([feature-index.md](../../02-architecture/feature-index.md#enforcement-module))

- [ ] **Task 1.1.2.41:** Implement Pending approvals page
  - 📐 **Wireframe:** [task-0.5.2.1c](../../04-design/user-experience/wireframes/01-rmm/enforcement/task-0.5.2.1c-pending-approvals.md)
  - 🛣️ **Route:** `/enforcement/pending-approvals` ([routing-structure.md](../../02-architecture/frontend/routing-structure.md#enforcement-routes))
  - 💾 **Database:** `enforcement_actions` ([feature-index.md](../../02-architecture/feature-index.md#enforcement-module))
  - 🔌 **API:** `enforcement_list_pending_approvals()`, `enforcement_approve_action()` ([feature-index.md](../../02-architecture/feature-index.md#enforcement-module))

- [ ] **Task 1.1.2.42:** Implement Enforcement reports page
  - 📐 **Wireframe:** [task-0.5.2.1d](../../04-design/user-experience/wireframes/01-rmm/enforcement/task-0.5.2.1d-enforcement-reports.md)
  - 🛣️ **Route:** `/enforcement/reports` ([routing-structure.md](../../02-architecture/frontend/routing-structure.md#enforcement-routes))
  - 💾 **Database:** `enforcement_actions` ([feature-index.md](../../02-architecture/feature-index.md#enforcement-module))
  - 🔌 **API:** `enforcement_generate_reports()` ([feature-index.md](../../02-architecture/feature-index.md#enforcement-module))

- [ ] **Task 1.1.2.43:** Implement Appeal review interface (MOH Tier 1)
  - 📐 **Wireframe:** [task-0.5.2.1e](../../04-design/user-experience/wireframes/01-rmm/enforcement/task-0.5.2.1e-appeal-review-interface.md)
  - 🛣️ **Route:** `/enforcement/appeals/[id]` ([routing-structure.md](../../02-architecture/frontend/routing-structure.md#enforcement-routes))
  - 💾 **Database:** `appeals`, `enforcement_actions` ([feature-index.md](../../02-architecture/feature-index.md#enforcement-module))
  - 🔌 **API:** `enforcement_review_appeal()`, `enforcement_uphold_appeal()`, `enforcement_overturn_appeal()` ([feature-index.md](../../02-architecture/feature-index.md#enforcement-module))

- [ ] **Task 1.1.2.44:** Implement Appeal submission form (Company users)
  - 📐 **Wireframe:** [task-0.5.2.1f](../../04-design/user-experience/wireframes/01-rmm/enforcement/task-0.5.2.1f-appeal-submission-form.md)
  - 🛣️ **Route:** `/enforcement/actions/[id]/appeal` ([routing-structure.md](../../02-architecture/frontend/routing-structure.md#enforcement-routes))
  - 💾 **Database:** `appeals` ([feature-index.md](../../02-architecture/feature-index.md#enforcement-module))
  - 🔌 **API:** `enforcement_submit_appeal()` ([feature-index.md](../../02-architecture/feature-index.md#enforcement-module))

---

## Subphase 1.1.3: RMM Integration Testing & Seed Data (Week 4)

**🔒 COMPLIANCE VALIDATION (Sami - Required Before ANY Task):**

**⚠️ STOP AUTHORITY:** Sami (Implementation Compliance Specialist) has **MANDATORY STOP AUTHORITY**. If ANY compliance rule is violated, implementation **MUST STOP IMMEDIATELY**. No exceptions.

**Before starting ANY task in this subphase, the following MUST be verified and documented:**

- [ ] **1. Sequential Task Verification (MANDATORY):** All previous tasks from Subphases 1.1.1 and 1.1.2 are complete and checked off (`[x]`). **NO TASK CAN START UNTIL ALL PREVIOUS TASKS ARE COMPLETE.** Sami verifies this before every task. Starting a task out of sequence is a **COMPLIANCE VIOLATION**.
- [ ] **Subphase 1.1.2 Complete:** All RMM backend and frontend tasks (1.1.2.1-1.1.2.44) are complete and verified.
- [ ] **2. Role Name Verification:** Frontend role names match database schema exactly; role constants match `users.role` enum values; no hardcoded role strings (use constants).
- [ ] **3. Schema Verification:** Database schema verified before role-dependent code; all required tables/fields/RLS policies exist; Phase 0.6 schema additions incorporated where applicable.
- [ ] **4. Integration Verification:** Layout/components integrated into routes (if applicable); navigation updated (if new routes added); module routing structure updated.
- [ ] **5. Role Coverage Verification:** All 9 roles are handled where applicable (Company Admin, Company Manager, Company User, MOH Tier 1, MOH Tier 2 Officer, MOH Tier 2 Registrar, MOH Auditor, System Admin, Vendor); role variants match wireframe specifications.
- [ ] **6. Wireframe Compliance:** Wireframe reviewed before starting; wireframe task ID(s) identified; wireframe requirements understood (layout, interactions, states, role-based variations); wireframe annotations reviewed.
- [ ] **7. Data Source Verification:** NO local mock data used (NO `const mockData = [...]`, NO `mockData.ts`, NO runtime mocks); all data queries Supabase database; seed data applied if required (verify via `supabase migration list`); database tables verified before starting (use SQL queries).
- [ ] **8. Wireframe Binding:** Wireframe binding comments will be added to code (JSDoc format with wireframe link); wireframe task ID(s) documented in code comments; PR description will include wireframe link(s); wireframe binding in both PR description AND codebase.
- [ ] **9. Seed Data Gate (If Applicable):** N/A for this subphase (seed data tasks are part of this subphase).
- [ ] **Wireframe-First Implementation Principle:** Wireframes are the PRIMARY design reference. If a wireframe doesn't exist, **STOP** and create it first. See [Compliance Rules - Wireframe-First Implementation Principle](../standards/compliance-rules.md#wireframe-first-implementation-principle) for complete requirements.
- [ ] **Sami's Compliance Checklist:** Will be used for EVERY task in this subphase. **No task proceeds without Sami's approval.**
- [ ] **Sami's Approval:** Compliance review completed and approved by Sami before task start. **MANDATORY - No task can proceed without this approval.**
- [ ] **Implementation Summary Compliance Section:** After task completion, implementation summary MUST include compliance section documenting all rules followed (see "Implementation Summary Compliance Requirement" section above). **PRs without compliance section will be REJECTED.**
- [ ] **PR Description Checklist:** See [Compliance Rules - PR Description Checklist](../standards/compliance-rules.md#pr-description-checklist-required) for the complete 9-item checklist that every frontend task PR must include.

**🚫 STOP CONDITIONS (Do Not Proceed):**

**STOP implementation and resolve before proceeding** if any of the following is true:

- **Previous Subphase Incomplete:** Subphase 1.1.2 tasks are not complete. **STOP** and complete all prerequisite tasks first.
- **Backend Not Complete:** RMM backend RPC functions are not implemented. **STOP** and implement backend first.
- **Frontend Not Complete:** RMM frontend pages are not implemented. **STOP** and implement frontend first.
- **Wireframe Requirements:** No wireframe link exists for the page/route being implemented. **STOP** and request/produce the wireframe first. Do not guess layouts, flows, or states.
- **Database & Schema Requirements:** Required DB table/field/RPC does not exist yet. **STOP** and implement the missing backend task first. Do not create local mocks as a workaround.
- **Security & Access Requirements:** RLS/policies prevent required access for the wireframed role. **STOP** and implement/update RLS policies before proceeding.
- **Seed Data Requirements:** Seed migration is not idempotent (must use deterministic IDs + UPSERT patterns) or not applied. **STOP** and fix/apply migration first.
- **Role Name Mismatch:** Frontend role names don't match database schema. **STOP** and fix role names to match schema exactly.

### Integration Testing Tasks
- [ ] **Task 1.1.3.1:** Create RMM module test suite (unit tests for RPC functions)
  - 💾 **Database:** All RMM tables (companies, products, skus, registry_submissions, enforcement_actions) ([feature-index.md](../../02-architecture/feature-index.md#rmm-module-features))
  - 🔌 **API:** All RMM RPC functions ([feature-index.md](../../02-architecture/feature-index.md#rmm-module-features))

- [ ] **Task 1.1.3.2:** Create integration tests - RMM workflow (submission → approval → implementation)
  - 💾 **Database:** `registry_submissions`, `approval_history`, target tables (companies/products/skus) ([feature-index.md](../../02-architecture/feature-index.md#registry-submission-workflow))
  - 🔌 **API:** RMM workflow RPC functions ([feature-index.md](../../02-architecture/feature-index.md#registry-submission-workflow))

- [ ] **Task 1.1.3.3:** Create integration tests - Enforcement workflow
  - 💾 **Database:** `enforcement_actions`, `approval_history`, `appeals` ([feature-index.md](../../02-architecture/feature-index.md#enforcement-module))
  - 🔌 **API:** Enforcement RPC functions ([feature-index.md](../../02-architecture/feature-index.md#enforcement-module))

- [ ] **Task 1.1.3.4:** Test RLS policy enforcement (company data isolation)
  - 💾 **Database:** All RMM tables (companies, products, skus) ([feature-index.md](../../02-architecture/feature-index.md#rmm-module-features))
  - 🔌 **API:** RLS policy testing ([security-architecture.md](../../02-architecture/security/security-architecture.md))

- [ ] **Task 1.1.3.5:** Test two-person rule enforcement
  - 💾 **Database:** `approval_history`, workflow tables ([feature-index.md](../../02-architecture/feature-index.md))
  - 🔌 **API:** Two-person rule validation functions ([feature-index.md](../../02-architecture/feature-index.md))

### Seed Data Tasks (Hassan - Full Ownership)
- [ ] **Task 1.1.3.6:** Create comprehensive RMM seed data (75 companies, products, SKUs) (Hassan)
  - 💾 **Database:** `companies`, `products`, `skus`, `atc_codes`, `critical_medicines` ([feature-index.md](../../02-architecture/feature-index.md#rmm-module-features))
  - 🔌 **API:** Seed data generation scripts ([phase-1-1-mockdata.md](phase-1-1-mockdata.md))

- [ ] **Task 1.1.3.7:** Execute RMM seed data population (Hassan)
  - 💾 **Database:** All RMM tables ([feature-index.md](../../02-architecture/feature-index.md#rmm-module-features))
  - 🔌 **API:** Seed migration execution ([phase-1-1-mockdata.md](phase-1-1-mockdata.md))

- [ ] **Task 1.1.3.8:** Validate seed data (Hassan - full ownership; coordinates with Nadia for integrity, Farah for realism)
  - 💾 **Database:** All RMM tables ([feature-index.md](../../02-architecture/feature-index.md#rmm-module-features))
  - 🔌 **API:** Seed data validation scripts

### Documentation Tasks
- [ ] **Task 1.1.3.9:** Create RMM module user documentation
  - 💾 **Database:** All RMM tables ([feature-index.md](../../02-architecture/feature-index.md#rmm-module-features))
  - 🔌 **API:** All RMM RPC functions ([feature-index.md](../../02-architecture/feature-index.md#rmm-module-features))
  - 📐 **Wireframe:** All RMM wireframes ([phase-0-5-wireframes-catalog.md](../Archive for now/phase-0-5-wireframes-catalog.md))

- [ ] **Task 1.1.3.10:** Phase 1.1 internal review and sign-off
  - 💾 **Database:** All RMM tables ([feature-index.md](../../02-architecture/feature-index.md#rmm-module-features))
  - 🔌 **API:** All RMM RPC functions ([feature-index.md](../../02-architecture/feature-index.md#rmm-module-features))

### Integration Checkpoint Validation
- [ ] **Task 1.1.3.11:** Data Model Validation (Nadia) - Verify RMM schema supports VCI requirements
  - 💾 **Database:** RMM tables (companies, products, skus) for VCI integration ([feature-index.md](../../02-architecture/feature-index.md#feature-dependency-matrix))
  - 🔌 **API:** Module integration contracts ([module-integration-contracts.md](../../02-architecture/integration/module-integration-contracts.md))

- [ ] **Task 1.1.3.12:** RLS Policy Validation (Rafi) - Verify RLS policies allow VCI module access
  - 💾 **Database:** RMM tables accessible by VCI ([feature-index.md](../../02-architecture/feature-index.md#feature-dependency-matrix))
  - 🔌 **API:** RLS policy verification ([security-architecture.md](../../02-architecture/security/security-architecture.md))

- [ ] **Task 1.1.3.13:** API Contract Validation (Maya) - Verify RPC functions provide VCI data
  - 💾 **Database:** RMM tables accessed by VCI ([feature-index.md](../../02-architecture/feature-index.md#feature-dependency-matrix))
  - 🔌 **API:** RMM RPC functions used by VCI ([module-integration-contracts.md](../../02-architecture/integration/module-integration-contracts.md))

- [ ] **Task 1.1.3.14:** Seed Data Validation (Hassan) - Verify seed data covers VCI test scenarios
  - 💾 **Database:** RMM seed data needed for VCI testing ([feature-index.md](../../02-architecture/feature-index.md#feature-dependency-matrix))
  - 🔌 **API:** Seed data validation for VCI requirements

**Gate:** Phase 1.2 (VCI) cannot start until all 4 validations pass.

---

# PHASE 1.2: VCI DEVELOPMENT (Month 3)

**Duration:** 4 weeks  
**Objective:** Build Value Chain Intelligence Module (VCI) with AAMS, MSQ, and WSL workflows, including breach detection

**Prerequisites:**
- ⏳ Phase 1.1 (RMM) - **AWAITING IMPLEMENTATION** (not started)
- ⏳ RMM data model supports VCI requirements - **AWAITING IMPLEMENTATION**
- ⏳ RLS policies allow VCI module access to RMM data - **AWAITING IMPLEMENTATION**
- ⏳ API contracts provide VCI-required data - **AWAITING IMPLEMENTATION**
- ⏳ Seed data covers VCI test scenarios - **AWAITING IMPLEMENTATION**

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
4. **Seed Data Validation (Hassan):** Verify seed data covers ECS test scenarios (coordinates with Farah for realism validation)

**Gate:** Phase 1.3 cannot start until all 4 validations pass.

---

## Subphase 1.2.1: VCI Module - AAMS Workflow (Week 1)

**🔒 COMPLIANCE VALIDATION (Sami - Required Before ANY Task):**

**⚠️ STOP AUTHORITY:** Sami (Implementation Compliance Specialist) has **MANDATORY STOP AUTHORITY**. If ANY compliance rule is violated, implementation **MUST STOP IMMEDIATELY**. No exceptions.

**Before starting ANY task in this subphase, the following MUST be verified and documented:**

- [ ] **Phase 1.1 Complete (MANDATORY):** All Phase 1.1 tasks are complete and all 4 integration checkpoints validated. **NO VCI TASKS CAN START UNTIL PHASE 1.1 IS COMPLETE.** Starting VCI tasks before Phase 1.1 completion is a **COMPLIANCE VIOLATION**.
- [ ] **Integration Checkpoint 1 - Data Model Validation (Nadia):** RMM schema supports VCI requirements. **VERIFIED: [Date] [Nadia's signature]**
- [ ] **Integration Checkpoint 2 - RLS Policy Validation (Rafi):** RLS policies allow VCI module access to RMM data. **VERIFIED: [Date] [Rafi's signature]**
- [ ] **Integration Checkpoint 3 - API Contract Validation (Maya):** RPC functions provide data VCI needs. **VERIFIED: [Date] [Maya's signature]**
- [ ] **Integration Checkpoint 4 - Seed Data Validation (Hassan):** Seed data covers VCI test scenarios (coordinates with Farah for realism validation). **VERIFIED: [Date] [Hassan's signature]**
- [ ] **1. Sequential Task Verification (MANDATORY):** All previous tasks from Phase 1.1 are complete and checked off (`[x]`). **NO TASK CAN START UNTIL ALL PREVIOUS TASKS ARE COMPLETE.** Sami verifies this before every task. Starting a task out of sequence is a **COMPLIANCE VIOLATION**.
- [ ] **2. Role Name Verification:** Frontend role names match database schema exactly; role constants match `users.role` enum values; no hardcoded role strings (use constants).
- [ ] **3. Schema Verification:** Database schema verified before role-dependent code; all required tables/fields/RLS policies exist; Phase 0.6 schema additions incorporated where applicable.
- [ ] **4. Integration Verification:** Layout/components integrated into routes (if applicable); navigation updated (if new routes added); module routing structure updated.
- [ ] **5. Role Coverage Verification:** All 9 roles are handled where applicable (Company Admin, Company Manager, Company User, MOH Tier 1, MOH Tier 2 Officer, MOH Tier 2 Registrar, MOH Auditor, System Admin, Vendor); role variants match wireframe specifications.
- [ ] **6. Wireframe Compliance:** Wireframe reviewed before starting; wireframe task ID(s) identified; wireframe requirements understood (layout, interactions, states, role-based variations); wireframe annotations reviewed.
- [ ] **7. Data Source Verification:** NO local mock data used (NO `const mockData = [...]`, NO `mockData.ts`, NO runtime mocks); all data queries Supabase database; seed data applied if required (verify via `supabase migration list`); database tables verified before starting (use SQL queries).
- [ ] **8. Wireframe Binding:** Wireframe binding comments will be added to code (JSDoc format with wireframe link); wireframe task ID(s) documented in code comments; PR description will include wireframe link(s); wireframe binding in both PR description AND codebase.
- [ ] **9. Seed Data Gate (If Applicable):** Seed migration `seed_1_2_1_vci_aams` applied and verified (see below for verification requirements); seed data acceptance criteria verified; RLS validation completed if required; seed data covers wireframe scenarios.
- [ ] **Wireframe-First Implementation Principle:** Wireframes are the PRIMARY design reference. If a wireframe doesn't exist, **STOP** and create it first. See [Compliance Rules - Wireframe-First Implementation Principle](../standards/compliance-rules.md#wireframe-first-implementation-principle) for complete requirements.
- [ ] **Sami's Compliance Checklist:** Will be used for EVERY task in this subphase. **No task proceeds without Sami's approval.**
- [ ] **Sami's Approval:** Compliance review completed and approved by Sami before task start. **MANDATORY - No task can proceed without this approval.**
- [ ] **Implementation Summary Compliance Section:** After task completion, implementation summary MUST include compliance section documenting all rules followed (see "Implementation Summary Compliance Requirement" section above). **PRs without compliance section will be REJECTED.**
- [ ] **PR Description Checklist:** See [Compliance Rules - PR Description Checklist](../standards/compliance-rules.md#pr-description-checklist-required) for the complete 9-item checklist that every frontend task PR must include.

**🚫 STOP CONDITIONS (Do Not Proceed):**

**STOP implementation and resolve before proceeding** if any of the following is true:

- **Phase 1.1 Incomplete:** Phase 1.1 integration checkpoints are not validated. **STOP** and complete Phase 1.1 first.
- **Wireframe Requirements:** No wireframe link exists for the page/route being implemented. **STOP** and request/produce the wireframe first. Do not guess layouts, flows, or states.
- **Database & Schema Requirements:** Required DB table/field/RPC does not exist yet. **STOP** and implement the missing backend task first. Do not create local mocks as a workaround.
- **Security & Access Requirements:** RLS/policies prevent required access for the wireframed role. **STOP** and implement/update RLS policies before proceeding.
- **Seed Data Requirements:** Seed migration is not idempotent (must use deterministic IDs + UPSERT patterns) or not applied. **STOP** and fix/apply migration first.
- **Sequential Execution:** Previous tasks are not complete. **STOP** and complete all prerequisite tasks first.
- **Role Name Mismatch:** Frontend role names don't match database schema. **STOP** and fix role names to match schema exactly.

**Seed Data Gate (Required):**
- Before starting VCI AAMS frontend pages, apply the seed migration stage `seed_1_2_1_vci_aams` per [Phase 1.1 Playbook - Stage: seed_1_2_1_vci_aams](phase-1-1-mockdata.md#stage-seed_1_2_1_vci_aams-subphase-121) (versioned SQL migrations, idempotent).

**Seed Stage Acceptance Criteria (from Playbook):**
- **Goal:** Make VCI AAMS wireframes testable (including threshold and duration types).
- **Minimum tables touched (expected):**
  - `aams_submissions`
  - `thresholds` (global/local, permanent + temporary duration types)
  - any supporting tables for threshold history / reversions defined in schema
- **Scenario packs required (deterministic IDs):**
  - Continue using `pack_company_active` from previous stages
  - Add threshold-related scenario packs:
    - `pack_threshold_reversion_auto` - temporary_auto_revert thresholds with upcoming revert dates
    - `pack_threshold_manual_review_pending` - temporary_manual_review thresholds pending review workflow
    - `pack_threshold_permanent` - permanent threshold examples (global and local)
  - Ensure AAMS submissions span multiple years with late/grace-period scenarios
- **Acceptance criteria:**
  - AAMS lists have multi-year records and at least one late/grace-period scenario.
  - Thresholds include examples of: permanent, temporary_auto_revert (with upcoming revert date), temporary_manual_review (pending review workflow)
  - MOH and company role views match wireframes for visibility timing.
  - **RLS validation required:** Seed data must be validated under real roles (Company, MOH Tier 1, MOH Tier 2). Seeded data that users can't see under RLS policies is invalid. Test each role's data visibility matches wireframe requirements. See [Playbook - RLS Realism](phase-1-1-mockdata.md) for requirements.
  - Scenario packs use deterministic IDs for idempotency (safe to re-run migrations). See [Playbook - Idempotency Patterns](phase-1-1-mockdata.md#idempotency-patterns) for SQL examples and requirements.
- **Verification Required:** After applying seed migration, complete verification checklist per [Phase 1.1 Playbook - Verification Checklist](phase-1-1-mockdata.md#verification-checklist-must-be-executed-after-each-seed-migration) (Hassan - full ownership of seed data seeding and testing; coordinates with Nadia for integrity verification, Farah for realism validation).

**⚠️ Backend Completion Gate:** All VCI AAMS backend tasks (1.2.1.1-1.2.1.12) must be complete before frontend tasks begin. **Frontend tasks starting before backend completion is a COMPLIANCE VIOLATION.**

### VCI AAMS Backend Tasks
- [ ] **Task 1.2.1.1:** Create database migration for VCI AAMS tables (aams_submissions, thresholds)
  - 💾 **Database:** `aams_submissions`, `thresholds` ([feature-index.md](../../02-architecture/feature-index.md#aams-annual-average-monthly-sales))
  - 🔌 **API:** VCI AAMS table schema ([data-dictionary.md](../../02-architecture/database/data-dictionary.md))

- [ ] **Task 1.2.1.2:** Implement RLS policies for VCI AAMS tables
  - 💾 **Database:** `aams_submissions`, `thresholds` ([feature-index.md](../../02-architecture/feature-index.md#aams-annual-average-monthly-sales))
  - 🔌 **API:** RLS policy implementation ([security-architecture.md](../../02-architecture/security/security-architecture.md))

- [ ] **Task 1.2.1.8:** Implement threshold calculation logic (B multiplier: 3 standard, 3.5 critical medicines) ⚠️ **CRITICAL:** Must be implemented BEFORE verification RPC function (1.2.1.4)
  - 💾 **Database:** `aams_submissions`, `thresholds`, `skus`, `critical_medicines` ([feature-index.md](../../02-architecture/feature-index.md#threshold-management))
  - 🔌 **API:** Threshold calculation functions (used by verification) ([feature-index.md](../../02-architecture/feature-index.md#threshold-management))

- [ ] **Task 1.2.1.9:** Implement threshold modification logic (local per-SKU, global system-wide) ⚠️ **DEPENDS ON:** Task 1.2.1.8 (threshold calculation logic)
  - 💾 **Database:** `thresholds`, `threshold_modifications` ([feature-index.md](../../02-architecture/feature-index.md#threshold-management))
  - 🔌 **API:** `vci_modify_threshold()` ([feature-index.md](../../02-architecture/feature-index.md#threshold-management))

- [ ] **Task 1.2.1.10:** Implement AAMS deadline validation (January 31 deadline, 15-day grace period)
  - 💾 **Database:** `aams_submissions` ([feature-index.md](../../02-architecture/feature-index.md#aams-annual-average-monthly-sales))
  - 🔌 **API:** AAMS deadline validation functions ([feature-index.md](../../02-architecture/feature-index.md#aams-annual-average-monthly-sales))

- [ ] **Task 1.2.1.11:** Implement previous year AAMS fallback logic
  - 💾 **Database:** `aams_submissions` (historical data) ([feature-index.md](../../02-architecture/feature-index.md#aams-annual-average-monthly-sales))
  - 🔌 **API:** AAMS fallback logic functions ([feature-index.md](../../02-architecture/feature-index.md#aams-annual-average-monthly-sales))

- [ ] **Task 1.2.1.3:** Create VCI RPC function - AAMS submission
  - 💾 **Database:** `aams_submissions` ([feature-index.md](../../02-architecture/feature-index.md#aams-annual-average-monthly-sales))
  - 🔌 **API:** `vci_submit_aams()` ([feature-index.md](../../02-architecture/feature-index.md#aams-annual-average-monthly-sales))

- [ ] **Task 1.2.1.4:** Create VCI RPC function - AAMS verification (includes threshold calculation) ⚠️ **DEPENDS ON:** Task 1.2.1.8 (threshold calculation logic)
  - 💾 **Database:** `aams_submissions`, `thresholds` ([feature-index.md](../../02-architecture/feature-index.md#aams-annual-average-monthly-sales))
  - 🔌 **API:** `vci_verify_aams()` ([feature-index.md](../../02-architecture/feature-index.md#aams-annual-average-monthly-sales))

- [ ] **Task 1.2.1.5:** Create VCI RPC function - AAMS approval
  - 💾 **Database:** `aams_submissions`, `thresholds` ([feature-index.md](../../02-architecture/feature-index.md#aams-annual-average-monthly-sales))
  - 🔌 **API:** `vci_approve_aams_threshold()` ([feature-index.md](../../02-architecture/feature-index.md#aams-annual-average-monthly-sales))

- [ ] **Task 1.2.1.6:** Create VCI RPC function - AAMS completion
  - 💾 **Database:** `aams_submissions`, `thresholds` ([feature-index.md](../../02-architecture/feature-index.md#aams-annual-average-monthly-sales))
  - 🔌 **API:** AAMS completion workflow functions ([feature-index.md](../../02-architecture/feature-index.md#aams-annual-average-monthly-sales))

- [ ] **Task 1.2.1.7:** Create VCI RPC function - AAMS rejection
  - 💾 **Database:** `aams_submissions` ([feature-index.md](../../02-architecture/feature-index.md#aams-annual-average-monthly-sales))
  - 🔌 **API:** AAMS rejection workflow functions ([feature-index.md](../../02-architecture/feature-index.md#aams-annual-average-monthly-sales))

- [ ] **Task 1.2.1.12:** Create scheduled trigger for AAMS deadline check
  - 💾 **Database:** `aams_submissions` ([feature-index.md](../../02-architecture/feature-index.md#aams-annual-average-monthly-sales))
  - 🔌 **API:** Scheduled trigger functions ([feature-index.md](../../02-architecture/feature-index.md#aams-annual-average-monthly-sales))

### VCI AAMS Frontend Tasks
- [ ] **Task 1.2.1.13:** Create VCI module layout and navigation ⚠️ **MUST BE FIRST** - Other pages depend on this
  - 📐 **Wireframe:** [task-0.5.1.14](../../04-design/user-experience/wireframes/00-core-foundation/layout-navigation/task-0.5.1.14-dashboard-layout-structure.md), [task-0.5.1.16](../../04-design/user-experience/wireframes/00-core-foundation/layout-navigation/task-0.5.1.16-sidebar-navigation.md)
  - 🛣️ **Route:** `/vci` layout ([routing-structure.md](../../02-architecture/frontend/routing-structure.md#vci-routes))
  - 💾 **Database:** `users`, `system_config` ([feature-index.md](../../02-architecture/feature-index.md#vci-module-features))
  - 🔌 **API:** `shared_get_user_permissions()` ([feature-index.md](../../02-architecture/feature-index.md#vci-module-features))

- [ ] **Task 1.2.1.13a:** Implement VCI dashboard page
  - 📐 **Wireframe:** [task-0.5.3.0](../../04-design/user-experience/wireframes/02-vci/overview/task-0.5.3.0-vci-overview.md)
  - 🛣️ **Route:** `/vci` ([routing-structure.md](../../02-architecture/frontend/routing-structure.md#vci-routes))
  - 💾 **Database:** `aams_submissions`, `msq_submissions`, `wsl_submissions`, `breaches`, `thresholds` ([feature-index.md](../../02-architecture/feature-index.md#vci-module-features))
  - 🔌 **API:** VCI dashboard aggregation functions ([feature-index.md](../../02-architecture/feature-index.md#vci-module-features))

- [ ] **Task 1.2.1.14:** Implement AAMS submissions list page
  - 📐 **Wireframe:** [task-0.5.3.1](../../04-design/user-experience/wireframes/02-vci/aams/task-0.5.3.1-aams-submissions-list.md)
  - 🛣️ **Route:** `/vci/submissions/aams` ([routing-structure.md](../../02-architecture/frontend/routing-structure.md#vci-routes))
  - 💾 **Database:** `aams_submissions` ([feature-index.md](../../02-architecture/feature-index.md#aams-annual-average-monthly-sales))
  - 🔌 **API:** `vci_list_aams_submissions()`, `vci_get_aams_submission()` ([feature-index.md](../../02-architecture/feature-index.md#aams-annual-average-monthly-sales))

- [ ] **Task 1.2.1.15:** Implement AAMS submission create/edit form
  - 📐 **Wireframe:** [task-0.5.3.2](../../04-design/user-experience/wireframes/02-vci/aams/task-0.5.3.2-aams-submission-form.md)
  - 🛣️ **Route:** `/vci/submissions/aams/new` ([routing-structure.md](../../02-architecture/frontend/routing-structure.md#vci-routes))
  - 💾 **Database:** `aams_submissions` ([feature-index.md](../../02-architecture/feature-index.md#aams-annual-average-monthly-sales))
  - 🔌 **API:** `vci_submit_aams()` ([feature-index.md](../../02-architecture/feature-index.md#aams-annual-average-monthly-sales))

- [ ] **Task 1.2.1.16:** Implement AAMS submission detail page
  - 📐 **Wireframe:** [task-0.5.3.3](../../04-design/user-experience/wireframes/02-vci/aams/task-0.5.3.3-aams-submission-detail.md)
  - 🛣️ **Route:** `/vci/submissions/aams/[id]` ([routing-structure.md](../../02-architecture/frontend/routing-structure.md#vci-routes))
  - 💾 **Database:** `aams_submissions`, `thresholds` ([feature-index.md](../../02-architecture/feature-index.md#aams-annual-average-monthly-sales))
  - 🔌 **API:** `vci_get_aams_submission()`, `vci_get_aams_threshold()` ([feature-index.md](../../02-architecture/feature-index.md#aams-annual-average-monthly-sales))

- [ ] **Task 1.2.1.17:** Implement AAMS workflow actions
  - 📐 **Wireframe:** [task-0.5.3.3](../../04-design/user-experience/wireframes/02-vci/aams/task-0.5.3.3-aams-submission-detail.md)
  - 🛣️ **Route:** Modal/action components on submission detail page ([routing-structure.md](../../02-architecture/frontend/routing-structure.md#vci-routes))
  - 💾 **Database:** `aams_submissions`, `thresholds` ([feature-index.md](../../02-architecture/feature-index.md#aams-annual-average-monthly-sales))
  - 🔌 **API:** `vci_verify_aams()`, `vci_approve_aams_threshold()` ([feature-index.md](../../02-architecture/feature-index.md#aams-annual-average-monthly-sales))

- [ ] **Task 1.2.1.18:** Implement Threshold management page (MOH Tier 1)
  - 📐 **Wireframe:** [task-0.5.3.4](../../04-design/user-experience/wireframes/02-vci/aams/task-0.5.3.4-threshold-management.md)
  - 🛣️ **Route:** `/vci/thresholds` ([routing-structure.md](../../02-architecture/frontend/routing-structure.md#vci-routes))
  - 💾 **Database:** `thresholds`, `skus`, `companies` ([feature-index.md](../../02-architecture/feature-index.md#threshold-management))
  - 🔌 **API:** `vci_list_thresholds()`, `vci_get_threshold()` ([feature-index.md](../../02-architecture/feature-index.md#threshold-management))

- [ ] **Task 1.2.1.19:** Implement Threshold modification form
  - 📐 **Wireframe:** [task-0.5.3.6](../../04-design/user-experience/wireframes/02-vci/aams/task-0.5.3.6-threshold-modification-modal.md)
  - 🛣️ **Route:** Modal component on threshold detail page ([routing-structure.md](../../02-architecture/frontend/routing-structure.md#vci-routes))
  - 💾 **Database:** `thresholds`, `threshold_modifications` ([feature-index.md](../../02-architecture/feature-index.md#threshold-management))
  - 🔌 **API:** `vci_modify_threshold()` ([feature-index.md](../../02-architecture/feature-index.md#threshold-management))

- [ ] **Task 1.2.1.20:** Implement Pending threshold reversions list page
  - 📐 **Wireframe:** [task-0.5.3.6](../../04-design/user-experience/wireframes/02-vci/aams/task-0.5.3.6-pending-reversions-list.md) (see [wireframe-route-mapping.md](../../02-architecture/frontend/wireframe-route-mapping.md))
  - 🛣️ **Route:** `/vci/thresholds/pending-reversions` ([routing-structure.md](../../02-architecture/frontend/routing-structure.md#vci-routes))
  - 💾 **Database:** `thresholds` ([feature-index.md](../../02-architecture/feature-index.md#threshold-management))
  - 🔌 **API:** `vci_list_pending_reversions()` ([feature-index.md](../../02-architecture/feature-index.md#threshold-management))

- [ ] **Task 1.2.1.21:** Implement Threshold reversion review page
  - 📐 **Wireframe:** [task-0.5.3.7](../../04-design/user-experience/wireframes/02-vci/aams/task-0.5.3.7-threshold-reversion-review.md) (see [wireframe-route-mapping.md](../../02-architecture/frontend/wireframe-route-mapping.md))
  - 🛣️ **Route:** `/vci/thresholds/[id]/revert-review` ([routing-structure.md](../../02-architecture/frontend/routing-structure.md#vci-routes))
  - 💾 **Database:** `thresholds`, `threshold_modifications` ([feature-index.md](../../02-architecture/feature-index.md#threshold-management))
  - 🔌 **API:** `vci_review_threshold_reversion()`, `vci_confirm_reversion()`, `vci_cancel_reversion()`, `vci_extend_reversion()` ([feature-index.md](../../02-architecture/feature-index.md#threshold-management))

---

## Subphase 1.2.2: VCI Module - MSQ Workflow (Week 2)

**🔒 COMPLIANCE VALIDATION (Sami - Required Before ANY Task):**

**⚠️ STOP AUTHORITY:** Sami (Implementation Compliance Specialist) has **MANDATORY STOP AUTHORITY**. If ANY compliance rule is violated, implementation **MUST STOP IMMEDIATELY**. No exceptions.

**Before starting ANY task in this subphase, the following MUST be verified and documented:**

- [ ] **1. Sequential Task Verification (MANDATORY):** All previous tasks from Subphase 1.2.1 are complete and checked off (`[x]`). **NO TASK CAN START UNTIL ALL PREVIOUS TASKS ARE COMPLETE.** Sami verifies this before every task. Starting a task out of sequence is a **COMPLIANCE VIOLATION**.
- [ ] **Subphase 1.2.1 Complete:** All VCI AAMS backend and frontend tasks (1.2.1.1-1.2.1.21) are complete and verified.
- [ ] **2. Role Name Verification:** Frontend role names match database schema exactly; role constants match `users.role` enum values; no hardcoded role strings (use constants).
- [ ] **3. Schema Verification:** Database schema verified before role-dependent code; all required tables/fields/RLS policies exist; Phase 0.6 schema additions incorporated where applicable.
- [ ] **4. Integration Verification:** Layout/components integrated into routes (if applicable); navigation updated (if new routes added); module routing structure updated.
- [ ] **5. Role Coverage Verification:** All 9 roles are handled where applicable (Company Admin, Company Manager, Company User, MOH Tier 1, MOH Tier 2 Officer, MOH Tier 2 Registrar, MOH Auditor, System Admin, Vendor); role variants match wireframe specifications.
- [ ] **6. Wireframe Compliance:** Wireframe reviewed before starting; wireframe task ID(s) identified; wireframe requirements understood (layout, interactions, states, role-based variations); wireframe annotations reviewed.
- [ ] **7. Data Source Verification:** NO local mock data used (NO `const mockData = [...]`, NO `mockData.ts`, NO runtime mocks); all data queries Supabase database; seed data applied if required (verify via `supabase migration list`); database tables verified before starting (use SQL queries).
- [ ] **8. Wireframe Binding:** Wireframe binding comments will be added to code (JSDoc format with wireframe link); wireframe task ID(s) documented in code comments; PR description will include wireframe link(s); wireframe binding in both PR description AND codebase.
- [ ] **9. Seed Data Gate (If Applicable):** Seed migration `seed_1_2_2_vci_msq` applied and verified (see below for verification requirements); seed data acceptance criteria verified; RLS validation completed if required; seed data covers wireframe scenarios.
- [ ] **Wireframe-First Implementation Principle:** Wireframes are the PRIMARY design reference. If a wireframe doesn't exist, **STOP** and create it first. See [Compliance Rules - Wireframe-First Implementation Principle](../standards/compliance-rules.md#wireframe-first-implementation-principle) for complete requirements.
- [ ] **Sami's Compliance Checklist:** Will be used for EVERY task in this subphase. **No task proceeds without Sami's approval.**
- [ ] **Sami's Approval:** Compliance review completed and approved by Sami before task start. **MANDATORY - No task can proceed without this approval.**
- [ ] **Implementation Summary Compliance Section:** After task completion, implementation summary MUST include compliance section documenting all rules followed (see "Implementation Summary Compliance Requirement" section above). **PRs without compliance section will be REJECTED.**
- [ ] **PR Description Checklist:** See [Compliance Rules - PR Description Checklist](../standards/compliance-rules.md#pr-description-checklist-required) for the complete 9-item checklist that every frontend task PR must include.

**🚫 STOP CONDITIONS (Do Not Proceed):**

**STOP implementation and resolve before proceeding** if any of the following is true:

- **Previous Subphase Incomplete:** Subphase 1.2.1 tasks are not complete. **STOP** and complete all prerequisite tasks first.
- **Wireframe Requirements:** No wireframe link exists for the page/route being implemented. **STOP** and request/produce the wireframe first. Do not guess layouts, flows, or states.
- **Database & Schema Requirements:** Required DB table/field/RPC does not exist yet. **STOP** and implement the missing backend task first. Do not create local mocks as a workaround.
- **Security & Access Requirements:** RLS/policies prevent required access for the wireframed role. **STOP** and implement/update RLS policies before proceeding.
- **Seed Data Requirements:** Seed migration is not idempotent (must use deterministic IDs + UPSERT patterns) or not applied. **STOP** and fix/apply migration first.
- **Sequential Execution:** Previous tasks are not complete. **STOP** and complete all prerequisite tasks first.
- **Role Name Mismatch:** Frontend role names don't match database schema. **STOP** and fix role names to match schema exactly.

**Seed Data Gate (Required):**
- Before starting VCI MSQ frontend pages, apply the seed migration stage `seed_1_2_2_vci_msq` per [Phase 1.1 Playbook - Stage: seed_1_2_2_vci_msq](phase-1-1-mockdata.md#stage-seed_1_2_2_vci_msq-subphase-122) (versioned SQL migrations, idempotent).

**⚠️ Backend Completion Gate:** All VCI MSQ backend tasks (1.2.2.1-1.2.2.9) must be complete before frontend tasks begin. **Frontend tasks starting before backend completion is a COMPLIANCE VIOLATION.**

### VCI MSQ Backend Tasks
- [ ] **Task 1.2.2.1:** Create database migration for VCI MSQ tables (msq_submissions)
  - 💾 **Database:** `msq_submissions` ([feature-index.md](../../02-architecture/feature-index.md#msq-monthly-sales-quantities))
  - 🔌 **API:** VCI MSQ table schema ([data-dictionary.md](../../02-architecture/database/data-dictionary.md))

- [ ] **Task 1.2.2.2:** Implement RLS policies for VCI MSQ tables
  - 💾 **Database:** `msq_submissions` ([feature-index.md](../../02-architecture/feature-index.md#msq-monthly-sales-quantities))
  - 🔌 **API:** RLS policy implementation ([security-architecture.md](../../02-architecture/security/security-architecture.md))

- [ ] **Task 1.2.2.4:** Implement MSQ validation logic ⚠️ **CRITICAL:** Must be implemented BEFORE MSQ submission RPC function
  - 💾 **Database:** `msq_submissions`, `aams_submissions` (for comparison) ([feature-index.md](../../02-architecture/feature-index.md#msq-monthly-sales-quantities))
  - 🔌 **API:** MSQ validation functions (used by submission RPC) ([feature-index.md](../../02-architecture/feature-index.md#msq-monthly-sales-quantities))

- [ ] **Task 1.2.2.5:** Implement MSQ vs AAMS validation (20% threshold comparison) ⚠️ **DEPENDS ON:** Task 1.2.2.4 (MSQ validation logic)
  - 💾 **Database:** `msq_submissions`, `aams_submissions` ([feature-index.md](../../02-architecture/feature-index.md#msq-monthly-sales-quantities))
  - 🔌 **API:** MSQ vs AAMS comparison functions ([feature-index.md](../../02-architecture/feature-index.md#msq-monthly-sales-quantities))

- [ ] **Task 1.2.2.3:** Create VCI RPC function - MSQ submission ⚠️ **DEPENDS ON:** Tasks 1.2.2.4-1.2.2.5 (validation logic)
  - 💾 **Database:** `msq_submissions` ([feature-index.md](../../02-architecture/feature-index.md#msq-monthly-sales-quantities))
  - 🔌 **API:** `vci_submit_msq()` ([feature-index.md](../../02-architecture/feature-index.md#msq-monthly-sales-quantities))

- [ ] **Task 1.2.2.6:** Create VCI RPC function - MSQ flag for review
  - 💾 **Database:** `msq_submissions` ([feature-index.md](../../02-architecture/feature-index.md#msq-monthly-sales-quantities))
  - 🔌 **API:** `vci_flag_msq_for_review()` or similar ([feature-index.md](../../02-architecture/feature-index.md#msq-monthly-sales-quantities))

- [ ] **Task 1.2.2.7:** Create VCI RPC function - MSQ accept
  - 💾 **Database:** `msq_submissions` ([feature-index.md](../../02-architecture/feature-index.md#msq-monthly-sales-quantities))
  - 🔌 **API:** MSQ accept workflow functions ([feature-index.md](../../02-architecture/feature-index.md#msq-monthly-sales-quantities))

- [ ] **Task 1.2.2.8:** Create VCI RPC function - MSQ reject
  - 💾 **Database:** `msq_submissions` ([feature-index.md](../../02-architecture/feature-index.md#msq-monthly-sales-quantities))
  - 🔌 **API:** MSQ reject workflow functions ([feature-index.md](../../02-architecture/feature-index.md#msq-monthly-sales-quantities))

- [ ] **Task 1.2.2.9:** Implement 7-day grace period for MSQ corrections
  - 💾 **Database:** `msq_submissions` ([feature-index.md](../../02-architecture/feature-index.md#msq-monthly-sales-quantities))
  - 🔌 **API:** MSQ grace period validation functions ([feature-index.md](../../02-architecture/feature-index.md#msq-monthly-sales-quantities))

### VCI MSQ Frontend Tasks
- [ ] **Task 1.2.2.10:** Implement MSQ submissions list page
  - 📐 **Wireframe:** [task-0.5.3.9](../../04-design/user-experience/wireframes/02-vci/msq/task-0.5.3.9-msq-submissions-list.md)
  - 🛣️ **Route:** `/vci/submissions/msq` ([routing-structure.md](../../02-architecture/frontend/routing-structure.md#vci-routes))
  - 💾 **Database:** `msq_submissions` ([feature-index.md](../../02-architecture/feature-index.md#msq-monthly-sales-quantities))
  - 🔌 **API:** `vci_list_msq_submissions()`, `vci_get_msq_submission()` ([feature-index.md](../../02-architecture/feature-index.md#msq-monthly-sales-quantities))

- [ ] **Task 1.2.2.11:** Implement MSQ submission form
  - 📐 **Wireframe:** [task-0.5.3.10](../../04-design/user-experience/wireframes/02-vci/msq/task-0.5.3.10-msq-submission-form.md)
  - 🛣️ **Route:** `/vci/submissions/msq/new` ([routing-structure.md](../../02-architecture/frontend/routing-structure.md#vci-routes))
  - 💾 **Database:** `msq_submissions` ([feature-index.md](../../02-architecture/feature-index.md#msq-monthly-sales-quantities))
  - 🔌 **API:** `vci_submit_msq()` ([feature-index.md](../../02-architecture/feature-index.md#msq-monthly-sales-quantities))

- [ ] **Task 1.2.2.12:** Implement MSQ submission detail page
  - 📐 **Wireframe:** [task-0.5.3.11](../../04-design/user-experience/wireframes/02-vci/msq/task-0.5.3.11-msq-submission-detail.md)
  - 🛣️ **Route:** `/vci/submissions/msq/[id]` ([routing-structure.md](../../02-architecture/frontend/routing-structure.md#vci-routes))
  - 💾 **Database:** `msq_submissions` ([feature-index.md](../../02-architecture/feature-index.md#msq-monthly-sales-quantities))
  - 🔌 **API:** `vci_get_msq_submission()` ([feature-index.md](../../02-architecture/feature-index.md#msq-monthly-sales-quantities))

- [ ] **Task 1.2.2.13:** Implement MSQ correction interface (7-day grace period)
  - 📐 **Wireframe:** [task-0.5.3.20](../../04-design/user-experience/wireframes/02-vci/msq/task-0.5.3.12-msq-correction-interface.md)
  - 🛣️ **Route:** `/vci/submissions/msq/[id]/correct` ([routing-structure.md](../../02-architecture/frontend/routing-structure.md#vci-routes))
  - 💾 **Database:** `msq_submissions` ([feature-index.md](../../02-architecture/feature-index.md#msq-monthly-sales-quantities))
  - 🔌 **API:** `vci_correct_msq_submission()` ([feature-index.md](../../02-architecture/feature-index.md#msq-monthly-sales-quantities))

---

## Subphase 1.2.3: VCI Module - WSL Workflow & Breach Detection (Week 3)

**🔒 COMPLIANCE VALIDATION (Sami - Required Before ANY Task):**

**⚠️ STOP AUTHORITY:** Sami (Implementation Compliance Specialist) has **MANDATORY STOP AUTHORITY**. If ANY compliance rule is violated, implementation **MUST STOP IMMEDIATELY**. No exceptions.

**Before starting ANY task in this subphase, the following MUST be verified and documented:**

- [ ] **1. Sequential Task Verification (MANDATORY):** All previous tasks from Subphases 1.2.1 and 1.2.2 are complete and checked off (`[x]`). **NO TASK CAN START UNTIL ALL PREVIOUS TASKS ARE COMPLETE.** Sami verifies this before every task. Starting a task out of sequence is a **COMPLIANCE VIOLATION**.
- [ ] **Subphase 1.2.2 Complete:** All VCI MSQ backend and frontend tasks (1.2.2.1-1.2.2.13) are complete and verified.
- [ ] **2. Role Name Verification:** Frontend role names match database schema exactly; role constants match `users.role` enum values; no hardcoded role strings (use constants).
- [ ] **3. Schema Verification:** Database schema verified before role-dependent code; all required tables/fields/RLS policies exist; Phase 0.6 schema additions incorporated where applicable.
- [ ] **4. Integration Verification:** Layout/components integrated into routes (if applicable); navigation updated (if new routes added); module routing structure updated.
- [ ] **5. Role Coverage Verification:** All 9 roles are handled where applicable (Company Admin, Company Manager, Company User, MOH Tier 1, MOH Tier 2 Officer, MOH Tier 2 Registrar, MOH Auditor, System Admin, Vendor); role variants match wireframe specifications.
- [ ] **6. Wireframe Compliance:** Wireframe reviewed before starting; wireframe task ID(s) identified; wireframe requirements understood (layout, interactions, states, role-based variations); wireframe annotations reviewed.
- [ ] **7. Data Source Verification:** NO local mock data used (NO `const mockData = [...]`, NO `mockData.ts`, NO runtime mocks); all data queries Supabase database; seed data applied if required (verify via `supabase migration list`); database tables verified before starting (use SQL queries).
- [ ] **8. Wireframe Binding:** Wireframe binding comments will be added to code (JSDoc format with wireframe link); wireframe task ID(s) documented in code comments; PR description will include wireframe link(s); wireframe binding in both PR description AND codebase.
- [ ] **9. Seed Data Gate (If Applicable):** Seed migration `seed_1_2_3_vci_wsl` applied and verified (see below for verification requirements); seed data acceptance criteria verified; RLS validation completed if required; seed data covers wireframe scenarios.
- [ ] **Wireframe-First Implementation Principle:** Wireframes are the PRIMARY design reference. If a wireframe doesn't exist, **STOP** and create it first. See [Compliance Rules - Wireframe-First Implementation Principle](../standards/compliance-rules.md#wireframe-first-implementation-principle) for complete requirements.
- [ ] **Sami's Compliance Checklist:** Will be used for EVERY task in this subphase. **No task proceeds without Sami's approval.**
- [ ] **Sami's Approval:** Compliance review completed and approved by Sami before task start. **MANDATORY - No task can proceed without this approval.**
- [ ] **Implementation Summary Compliance Section:** After task completion, implementation summary MUST include compliance section documenting all rules followed (see "Implementation Summary Compliance Requirement" section above). **PRs without compliance section will be REJECTED.**
- [ ] **PR Description Checklist:** See [Compliance Rules - PR Description Checklist](../standards/compliance-rules.md#pr-description-checklist-required) for the complete 9-item checklist that every frontend task PR must include.

**🚫 STOP CONDITIONS (Do Not Proceed):**

**STOP implementation and resolve before proceeding** if any of the following is true:

- **Previous Subphase Incomplete:** Subphase 1.2.2 tasks are not complete. **STOP** and complete all prerequisite tasks first.
- **Wireframe Requirements:** No wireframe link exists for the page/route being implemented. **STOP** and request/produce the wireframe first. Do not guess layouts, flows, or states.
- **Database & Schema Requirements:** Required DB table/field/RPC does not exist yet. **STOP** and implement the missing backend task first. Do not create local mocks as a workaround.
- **Security & Access Requirements:** RLS/policies prevent required access for the wireframed role. **STOP** and implement/update RLS policies before proceeding.
- **Seed Data Requirements:** Seed migration is not idempotent (must use deterministic IDs + UPSERT patterns) or not applied. **STOP** and fix/apply migration first.
- **Sequential Execution:** Previous tasks are not complete. **STOP** and complete all prerequisite tasks first.
- **Role Name Mismatch:** Frontend role names don't match database schema. **STOP** and fix role names to match schema exactly.

**Seed Data Gate (Required):**
- Before starting VCI WSL/Breaches frontend pages, apply the seed migration stage `seed_1_2_3_vci_wsl` per [Phase 1.1 Playbook - Stage: seed_1_2_3_vci_wsl](phase-1-1-mockdata.md#stage-seed_1_2_3_vci_wsl-subphase-123) (versioned SQL migrations, idempotent).

**⚠️ Backend Completion Gate:** All VCI WSL backend tasks (1.2.3.1-1.2.3.12) must be complete before frontend tasks begin. **Frontend tasks starting before backend completion is a COMPLIANCE VIOLATION.**

### VCI WSL Backend Tasks
- [ ] **Task 1.2.3.1:** Create database migration for VCI WSL tables (wsl_submissions, breaches, breach_analyses)
  - 💾 **Database:** `wsl_submissions`, `breaches`, `breach_analyses` ([feature-index.md](../../02-architecture/feature-index.md#wsl-weekly-stock-levels))
  - 🔌 **API:** VCI WSL table schema ([data-dictionary.md](../../02-architecture/database/data-dictionary.md))

- [ ] **Task 1.2.3.2:** Implement RLS policies for VCI WSL tables
  - 💾 **Database:** `wsl_submissions`, `breaches`, `breach_analyses` ([feature-index.md](../../02-architecture/feature-index.md#wsl-weekly-stock-levels))
  - 🔌 **API:** RLS policy implementation ([security-architecture.md](../../02-architecture/security/security-architecture.md))

- [ ] **Task 1.2.3.4:** Implement WSL validation logic ⚠️ **CRITICAL:** Must be implemented BEFORE WSL submission RPC function
  - 💾 **Database:** `wsl_submissions`, `thresholds` ([feature-index.md](../../02-architecture/feature-index.md#wsl-weekly-stock-levels))
  - 🔌 **API:** WSL validation functions (used by submission RPC) ([feature-index.md](../../02-architecture/feature-index.md#wsl-weekly-stock-levels))

- [ ] **Task 1.2.3.5:** Implement WSL deadline validation (Friday EOD deadline) ⚠️ **DEPENDS ON:** Task 1.2.3.4 (WSL validation logic)
  - 💾 **Database:** `wsl_submissions` ([feature-index.md](../../02-architecture/feature-index.md#wsl-weekly-stock-levels))
  - 🔌 **API:** WSL deadline validation functions ([feature-index.md](../../02-architecture/feature-index.md#wsl-weekly-stock-levels))

- [ ] **Task 1.2.3.6:** Implement breach detection logic (stock level vs threshold comparison) ⚠️ **CRITICAL:** Must be implemented BEFORE breach creation RPC function
  - 💾 **Database:** `wsl_submissions`, `thresholds`, `breaches` ([feature-index.md](../../02-architecture/feature-index.md#compliance-violations-breaches))
  - 🔌 **API:** `vci_detect_breach()` (used by breach creation RPC) ([feature-index.md](../../02-architecture/feature-index.md#compliance-violations-breaches))

- [ ] **Task 1.2.3.8:** Implement breach priority logic ⚠️ **DEPENDS ON:** Task 1.2.3.6 (breach detection logic)
  - 💾 **Database:** `breaches` ([feature-index.md](../../02-architecture/feature-index.md#compliance-violations-breaches))
  - 🔌 **API:** Breach priority calculation functions ([feature-index.md](../../02-architecture/feature-index.md#compliance-violations-breaches))

- [ ] **Task 1.2.3.3:** Create VCI RPC function - WSL submission ⚠️ **DEPENDS ON:** Tasks 1.2.3.4-1.2.3.5 (validation logic)
  - 💾 **Database:** `wsl_submissions`, `breaches` ([feature-index.md](../../02-architecture/feature-index.md#wsl-weekly-stock-levels))
  - 🔌 **API:** `vci_submit_wsl()` ([feature-index.md](../../02-architecture/feature-index.md#wsl-weekly-stock-levels))

- [ ] **Task 1.2.3.7:** Create VCI RPC function - Breach creation (automatic on WSL submission) ⚠️ **DEPENDS ON:** Tasks 1.2.3.6-1.2.3.8 (breach detection and priority logic)
  - 💾 **Database:** `breaches`, `wsl_submissions` ([feature-index.md](../../02-architecture/feature-index.md#compliance-violations-breaches))
  - 🔌 **API:** Automatic breach creation functions ([feature-index.md](../../02-architecture/feature-index.md#compliance-violations-breaches))

- [ ] **Task 1.2.3.9:** Create VCI RPC function - Breach analysis
  - 💾 **Database:** `breaches`, `breach_analyses` ([feature-index.md](../../02-architecture/feature-index.md#compliance-violations-breaches))
  - 🔌 **API:** `vci_analyze_breach()` ([feature-index.md](../../02-architecture/feature-index.md#compliance-violations-breaches))

- [ ] **Task 1.2.3.10:** Create VCI RPC function - Breach action suggestion
  - 💾 **Database:** `breaches`, `breach_actions` ([feature-index.md](../../02-architecture/feature-index.md#compliance-violations-breaches))
  - 🔌 **API:** `vci_suggest_breach_action()` ([feature-index.md](../../02-architecture/feature-index.md#compliance-violations-breaches))

- [ ] **Task 1.2.3.11:** Create VCI RPC function - Breach action approval
  - 💾 **Database:** `breaches`, `breach_actions`, `approval_history` ([feature-index.md](../../02-architecture/feature-index.md#compliance-violations-breaches))
  - 🔌 **API:** `vci_approve_breach_action()`, `vci_reject_breach_action()` ([feature-index.md](../../02-architecture/feature-index.md#compliance-violations-breaches))

- [ ] **Task 1.2.3.12:** Create scheduled trigger for WSL deadline check
  - 💾 **Database:** `wsl_submissions` ([feature-index.md](../../02-architecture/feature-index.md#wsl-weekly-stock-levels))
  - 🔌 **API:** Scheduled trigger functions ([feature-index.md](../../02-architecture/feature-index.md#wsl-weekly-stock-levels))

### VCI WSL Frontend Tasks
- [ ] **Task 1.2.3.13:** Implement WSL submissions list page
  - 📐 **Wireframe:** [task-0.5.3.13](../../04-design/user-experience/wireframes/02-vci/wsl/task-0.5.3.11-wsl-submissions-list.md)
  - 🛣️ **Route:** `/vci/submissions/wsl` ([routing-structure.md](../../02-architecture/frontend/routing-structure.md#vci-routes))
  - 💾 **Database:** `wsl_submissions`, `breaches` ([feature-index.md](../../02-architecture/feature-index.md#wsl-weekly-stock-levels))
  - 🔌 **API:** `vci_list_wsl_submissions()`, `vci_get_wsl_submission()` ([feature-index.md](../../02-architecture/feature-index.md#wsl-weekly-stock-levels))

- [ ] **Task 1.2.3.14:** Implement WSL submission form
  - 📐 **Wireframe:** [task-0.5.3.12](../../04-design/user-experience/wireframes/02-vci/wsl/task-0.5.3.12-wsl-submission-form.md)
  - 🛣️ **Route:** `/vci/submissions/wsl/new` ([routing-structure.md](../../02-architecture/frontend/routing-structure.md#vci-routes))
  - 💾 **Database:** `wsl_submissions`, `breaches` ([feature-index.md](../../02-architecture/feature-index.md#wsl-weekly-stock-levels))
  - 🔌 **API:** `vci_submit_wsl()` ([feature-index.md](../../02-architecture/feature-index.md#wsl-weekly-stock-levels))

- [ ] **Task 1.2.3.15:** Implement WSL submission detail page
  - 📐 **Wireframe:** [task-0.5.3.13](../../04-design/user-experience/wireframes/02-vci/wsl/task-0.5.3.13-wsl-submission-detail.md)
  - 🛣️ **Route:** `/vci/submissions/wsl/[id]` ([routing-structure.md](../../02-architecture/frontend/routing-structure.md#vci-routes))
  - 💾 **Database:** `wsl_submissions`, `breaches`, `thresholds` ([feature-index.md](../../02-architecture/feature-index.md#wsl-weekly-stock-levels))
  - 🔌 **API:** `vci_get_wsl_submission()`, `vci_get_wsl_breaches()` ([feature-index.md](../../02-architecture/feature-index.md#wsl-weekly-stock-levels))

- [ ] **Task 1.2.3.16:** Implement Breaches list page
  - 📐 **Wireframe:** [task-0.5.3.14](../../04-design/user-experience/wireframes/02-vci/breaches/task-0.5.3.14-compliance-violations-list.md)
  - 🛣️ **Route:** `/vci/breaches` ([routing-structure.md](../../02-architecture/frontend/routing-structure.md#vci-routes))
  - 💾 **Database:** `breaches`, `wsl_submissions`, `thresholds` ([feature-index.md](../../02-architecture/feature-index.md#compliance-violations-breaches))
  - 🔌 **API:** `vci_list_breaches()`, `vci_get_breach()` ([feature-index.md](../../02-architecture/feature-index.md#compliance-violations-breaches))

- [ ] **Task 1.2.3.17:** Implement Breach detail page
  - 📐 **Wireframe:** [task-0.5.3.15](../../04-design/user-experience/wireframes/02-vci/breaches/task-0.5.3.15-compliance-violation-detail.md)
  - 🛣️ **Route:** `/vci/breaches/[id]` ([routing-structure.md](../../02-architecture/frontend/routing-structure.md#vci-routes))
  - 💾 **Database:** `breaches`, `breach_actions`, `wsl_submissions` ([feature-index.md](../../02-architecture/feature-index.md#compliance-violations-breaches))
  - 🔌 **API:** `vci_get_breach()`, `vci_get_breach_actions()` ([feature-index.md](../../02-architecture/feature-index.md#compliance-violations-breaches))

- [ ] **Task 1.2.3.18:** Implement Breach analysis interface (Tier 2)
  - 📐 **Wireframe:** [task-0.5.3.16](../../04-design/user-experience/wireframes/02-vci/breaches/task-0.5.3.16-compliance-violation-analysis-interface.md)
  - 🛣️ **Route:** Modal/interface on breach detail page ([routing-structure.md](../../02-architecture/frontend/routing-structure.md#vci-routes))
  - 💾 **Database:** `breaches`, `breach_actions` ([feature-index.md](../../02-architecture/feature-index.md#compliance-violations-breaches))
  - 🔌 **API:** `vci_suggest_breach_action()`, `vci_analyze_breach()` ([feature-index.md](../../02-architecture/feature-index.md#compliance-violations-breaches))

- [ ] **Task 1.2.3.19:** Implement Breach action approval interface (Tier 1)
  - 📐 **Wireframe:** [task-0.5.3.17](../../04-design/user-experience/wireframes/02-vci/breaches/task-0.5.3.17-compliance-violation-action-approval-interface.md)
  - 🛣️ **Route:** Modal/interface on breach detail page ([routing-structure.md](../../02-architecture/frontend/routing-structure.md#vci-routes))
  - 💾 **Database:** `breaches`, `breach_actions`, `approval_history` ([feature-index.md](../../02-architecture/feature-index.md#compliance-violations-breaches))
  - 🔌 **API:** `vci_approve_breach_action()`, `vci_reject_breach_action()` ([feature-index.md](../../02-architecture/feature-index.md#compliance-violations-breaches))

- [ ] **Task 1.2.3.20:** Implement Governance Dashboard (MOH)
  - 📐 **Wireframe:** [task-0.5.3.18](../../04-design/user-experience/wireframes/02-vci/overview/task-0.5.3.18-governance-dashboard.md)
  - 🛣️ **Route:** `/vci/governance` ([routing-structure.md](../../02-architecture/frontend/routing-structure.md#vci-routes))
  - 💾 **Database:** `breaches`, `thresholds`, `wsl_submissions` ([feature-index.md](../../02-architecture/feature-index.md#vci-governance-dashboard))
  - 🔌 **API:** `vci_get_governance_dashboard()`, `vci_get_stock_sufficiency_charts()` ([feature-index.md](../../02-architecture/feature-index.md#vci-governance-dashboard))

- [ ] **Task 1.2.3.21:** Implement VCI Treemap visualization page
  - 📐 **Wireframe:** [task-0.5.3.16](../../04-design/user-experience/wireframes/02-vci/analytics/task-0.5.3.16-treemap-visualization.md)
  - 🛣️ **Route:** `/vci/treemap` ([routing-structure.md](../../02-architecture/frontend/routing-structure.md#vci-routes))
  - 💾 **Database:** `breaches`, `skus`, `atc_codes`, `products` ([feature-index.md](../../02-architecture/feature-index.md#vci-analytics))
  - 🔌 **API:** `vci_get_atc_treemap_data()`, `vci_get_products_treemap_data()` ([feature-index.md](../../02-architecture/feature-index.md#vci-analytics))

---

## Subphase 1.2.4: VCI Seed Data Validation & Integration Testing (Week 4)

**🔒 COMPLIANCE VALIDATION (Sami - Required Before ANY Task):**

**⚠️ STOP AUTHORITY:** Sami (Implementation Compliance Specialist) has **MANDATORY STOP AUTHORITY**. If ANY compliance rule is violated, implementation **MUST STOP IMMEDIATELY**. No exceptions.

**Before starting ANY task in this subphase, the following MUST be verified and documented:**

- [ ] **1. Sequential Task Verification (MANDATORY):** All previous tasks from Subphases 1.2.1, 1.2.2, and 1.2.3 are complete and checked off (`[x]`). **NO TASK CAN START UNTIL ALL PREVIOUS TASKS ARE COMPLETE.** Sami verifies this before every task. Starting a task out of sequence is a **COMPLIANCE VIOLATION**.
- [ ] **Subphase 1.2.3 Complete:** All VCI WSL/Breaches backend and frontend tasks (1.2.3.1-1.2.3.21) are complete and verified.
- [ ] **2. Role Name Verification:** Frontend role names match database schema exactly; role constants match `users.role` enum values; no hardcoded role strings (use constants).
- [ ] **3. Schema Verification:** Database schema verified before role-dependent code; all required tables/fields/RLS policies exist; Phase 0.6 schema additions incorporated where applicable.
- [ ] **4. Integration Verification:** Layout/components integrated into routes (if applicable); navigation updated (if new routes added); module routing structure updated.
- [ ] **5. Role Coverage Verification:** All 9 roles are handled where applicable (Company Admin, Company Manager, Company User, MOH Tier 1, MOH Tier 2 Officer, MOH Tier 2 Registrar, MOH Auditor, System Admin, Vendor); role variants match wireframe specifications.
- [ ] **6. Wireframe Compliance:** Wireframe reviewed before starting; wireframe task ID(s) identified; wireframe requirements understood (layout, interactions, states, role-based variations); wireframe annotations reviewed.
- [ ] **7. Data Source Verification:** NO local mock data used (NO `const mockData = [...]`, NO `mockData.ts`, NO runtime mocks); all data queries Supabase database; seed data applied if required (verify via `supabase migration list`); database tables verified before starting (use SQL queries).
- [ ] **8. Wireframe Binding:** Wireframe binding comments will be added to code (JSDoc format with wireframe link); wireframe task ID(s) documented in code comments; PR description will include wireframe link(s); wireframe binding in both PR description AND codebase.
- [ ] **9. Seed Data Gate (If Applicable):** N/A for this subphase (seed data tasks are part of this subphase).
- [ ] **Wireframe-First Implementation Principle:** Wireframes are the PRIMARY design reference. If a wireframe doesn't exist, **STOP** and create it first. See [Compliance Rules - Wireframe-First Implementation Principle](../standards/compliance-rules.md#wireframe-first-implementation-principle) for complete requirements.
- [ ] **Sami's Compliance Checklist:** Will be used for EVERY task in this subphase. **No task proceeds without Sami's approval.**
- [ ] **Sami's Approval:** Compliance review completed and approved by Sami before task start. **MANDATORY - No task can proceed without this approval.**
- [ ] **Implementation Summary Compliance Section:** After task completion, implementation summary MUST include compliance section documenting all rules followed (see "Implementation Summary Compliance Requirement" section above). **PRs without compliance section will be REJECTED.**
- [ ] **PR Description Checklist:** See [Compliance Rules - PR Description Checklist](../standards/compliance-rules.md#pr-description-checklist-required) for the complete 9-item checklist that every frontend task PR must include.

**🚫 STOP CONDITIONS (Do Not Proceed):**

**STOP implementation and resolve before proceeding** if any of the following is true:

- **Previous Subphase Incomplete:** Subphase 1.2.3 tasks are not complete. **STOP** and complete all prerequisite tasks first.
- **Backend Not Complete:** VCI backend RPC functions are not implemented. **STOP** and implement backend first.
- **Frontend Not Complete:** VCI frontend pages are not implemented. **STOP** and implement frontend first.
- **Wireframe Requirements:** No wireframe link exists for the page/route being implemented. **STOP** and request/produce the wireframe first. Do not guess layouts, flows, or states.
- **Database & Schema Requirements:** Required DB table/field/RPC does not exist yet. **STOP** and implement the missing backend task first. Do not create local mocks as a workaround.
- **Security & Access Requirements:** RLS/policies prevent required access for the wireframed role. **STOP** and implement/update RLS policies before proceeding.
- **Seed Data Requirements:** Seed migration is not idempotent (must use deterministic IDs + UPSERT patterns) or not applied. **STOP** and fix/apply migration first.
- **Role Name Mismatch:** Frontend role names don't match database schema. **STOP** and fix role names to match schema exactly.

### Seed Data Tasks (Hassan - Full Ownership)
- [ ] **Task 1.2.4.1:** Expand seed migration - Comprehensive MSQ historical data (Hassan)
  - 💾 **Database:** `msq_submissions` ([feature-index.md](../../02-architecture/feature-index.md#msq-monthly-sales-quantities))
  - 🔌 **API:** Seed data generation scripts ([phase-1-1-mockdata.md](phase-1-1-mockdata.md))

- [ ] **Task 1.2.4.2:** Expand seed migration - Comprehensive WSL historical data (Hassan)
  - 💾 **Database:** `wsl_submissions` ([feature-index.md](../../02-architecture/feature-index.md#wsl-weekly-stock-levels))
  - 🔌 **API:** Seed data generation scripts ([phase-1-1-mockdata.md](phase-1-1-mockdata.md))

- [ ] **Task 1.2.4.3:** Create seed migration - Breach records (Hassan)
  - 💾 **Database:** `breaches`, `breach_analyses` ([feature-index.md](../../02-architecture/feature-index.md#compliance-violations-breaches))
  - 🔌 **API:** Seed data generation scripts ([phase-1-1-mockdata.md](phase-1-1-mockdata.md))

- [ ] **Task 1.2.4.4:** Expand seed migration - Comprehensive AAMS historical data (Hassan)
  - 💾 **Database:** `aams_submissions` ([feature-index.md](../../02-architecture/feature-index.md#aams-annual-average-monthly-sales))
  - 🔌 **API:** Seed data generation scripts ([phase-1-1-mockdata.md](phase-1-1-mockdata.md))

- [ ] **Task 1.2.4.5:** Validate all seed migrations (Hassan - full ownership; coordinates with Nadia for integrity, Farah for realism)
  - 💾 **Database:** All VCI tables (aams_submissions, msq_submissions, wsl_submissions, breaches) ([feature-index.md](../../02-architecture/feature-index.md#vci-module-features))
  - 🔌 **API:** Seed data validation scripts

### Integration Testing Tasks
- [ ] **Task 1.2.4.6:** Create VCI module test suite (unit tests for RPC functions)
  - 💾 **Database:** All VCI tables (aams_submissions, msq_submissions, wsl_submissions, breaches, thresholds) ([feature-index.md](../../02-architecture/feature-index.md#vci-module-features))
  - 🔌 **API:** All VCI RPC functions ([feature-index.md](../../02-architecture/feature-index.md#vci-module-features))

- [ ] **Task 1.2.4.7:** Create integration tests - VCI workflow (AAMS → MSQ → WSL → breach detection)
  - 💾 **Database:** `aams_submissions`, `msq_submissions`, `wsl_submissions`, `breaches`, `thresholds` ([feature-index.md](../../02-architecture/feature-index.md#vci-module-features))
  - 🔌 **API:** VCI workflow RPC functions ([feature-index.md](../../02-architecture/feature-index.md#vci-module-features))

- [ ] **Task 1.2.4.8:** Verify RMM→VCI integration contract (data flow, threshold switching)
  - 💾 **Database:** RMM tables (companies, products, skus) and VCI tables (thresholds) ([feature-index.md](../../02-architecture/feature-index.md#feature-dependency-matrix))
  - 🔌 **API:** Module integration contracts ([module-integration-contracts.md](../../02-architecture/integration/module-integration-contracts.md))

- [ ] **Task 1.2.4.9:** Test RLS policy enforcement (VCI data isolation)
  - 💾 **Database:** All VCI tables ([feature-index.md](../../02-architecture/feature-index.md#vci-module-features))
  - 🔌 **API:** RLS policy testing ([security-architecture.md](../../02-architecture/security/security-architecture.md))

### Historical Data Backend Tasks
- [ ] **Task 1.2.4.10:** Create database indexes for historical queries
  - 💾 **Database:** All module tables with historical data (indexes on date fields) ([feature-index.md](../../02-architecture/feature-index.md))
  - 🔌 **API:** Database index optimization

- [ ] **Task 1.2.4.11:** Create RPC function - vci_get_historical_submissions
  - 💾 **Database:** All VCI submission tables (`aams_submissions`, `msq_submissions`, `wsl_submissions`) ([feature-index.md](../../02-architecture/feature-index.md#vci-governance-dashboard))
  - 🔌 **API:** `vci_get_historical_submissions()` ([feature-index.md](../../02-architecture/feature-index.md#vci-governance-dashboard))

- [ ] **Task 1.2.4.12:** Create RPC function - log_historical_data_access
  - 💾 **Database:** `audit_logs` ([feature-index.md](../../02-architecture/feature-index.md#global-pages))
  - 🔌 **API:** `log_historical_data_access()` ([feature-index.md](../../02-architecture/feature-index.md))

### Historical Data Frontend Tasks
- [ ] **Task 1.2.4.13:** Implement Timeline component ⚠️ **RECOMMENDATION:** Consider moving to Phase 1.2.1 if needed for history tabs
  - 📐 **Wireframe:** [task-0.5.8.6](../../04-design/user-experience/wireframes/07-modals/task-0.5.8.6-quick-history-preview-modal.md) (component pattern)
  - 🛣️ **Route:** Shared component used across detail pages
  - 💾 **Database:** All module historical tables ([feature-index.md](../../02-architecture/feature-index.md))
  - 🔌 **API:** Historical data RPC functions ([feature-index.md](../../02-architecture/feature-index.md))

- [ ] **Task 1.2.4.14:** Implement DateRangePicker component ⚠️ **RECOMMENDATION:** Consider moving to Phase 1.2.1 if needed for history tabs
  - 📐 **Wireframe:** [task-0.5.8.3](../../04-design/user-experience/wireframes/07-modals/task-0.5.8.3-date-range-picker-modal.md)
  - 🛣️ **Route:** Shared component used across list pages
  - 💾 **Database:** All module historical tables ([feature-index.md](../../02-architecture/feature-index.md))
  - 🔌 **API:** Historical data RPC functions with date filters ([feature-index.md](../../02-architecture/feature-index.md))

- [ ] **Task 1.2.4.15:** Implement ExportButton component ⚠️ **RECOMMENDATION:** Consider moving to Phase 1.2.1 if needed for history tabs
  - 📐 **Wireframe:** [task-0.5.8.5](../../04-design/user-experience/wireframes/07-modals/task-0.5.8.5-export-options-modal.md)
  - 🛣️ **Route:** Shared component used across pages
  - 💾 **Database:** All module tables ([feature-index.md](../../02-architecture/feature-index.md))
  - 🔌 **API:** Export/generate functions ([feature-index.md](../../02-architecture/feature-index.md))

- [ ] **Task 1.2.4.16:** Implement History tabs on detail pages ⚠️ **DEPENDS ON:** Tasks 1.2.4.13-1.2.4.15 (shared components)
  - 📐 **Wireframe:** History tabs referenced in detail page wireframes ([wireframe-route-mapping.md](../../02-architecture/frontend/wireframe-route-mapping.md))
  - 🛣️ **Route:** Tabs on detail pages: `/rmm/companies/[id]`, `/rmm/products/[id]`, `/vci/submissions/{type}/[id]`, etc. ([routing-structure.md](../../02-architecture/frontend/routing-structure.md#historical-data-routes))
  - 💾 **Database:** All module historical tables ([feature-index.md](../../02-architecture/feature-index.md))
  - 🔌 **API:** `vci_get_historical_submissions()`, `rmm_get_history()`, etc. ([feature-index.md](../../02-architecture/feature-index.md))

- [ ] **Task 1.2.4.17:** Add year/month/week filters to submission list pages ⚠️ **DEPENDS ON:** Task 1.2.4.14 (DateRangePicker component)
  - 📐 **Wireframe:** Filter controls in submission list wireframes ([wireframe-route-mapping.md](../../02-architecture/frontend/wireframe-route-mapping.md))
  - 🛣️ **Route:** List pages with query params: `/vci/submissions/aams?year=2023`, `/vci/submissions/msq?year=2023&month=6`, etc. ([routing-structure.md](../../02-architecture/frontend/routing-structure.md#historical-data-routes))
  - 💾 **Database:** Submission tables with date fields ([feature-index.md](../../02-architecture/feature-index.md))
  - 🔌 **API:** List functions with date filter parameters ([feature-index.md](../../02-architecture/feature-index.md))

- [ ] **Task 1.2.4.18:** Implement `/vci/submissions/history` route
  - 📐 **Wireframe:** [task-0.5.3.28](../../04-design/user-experience/wireframes/05-audit-historical/historical-data/task-0.5.3.28-submission-history.md)
  - 🛣️ **Route:** `/vci/submissions/history` ([routing-structure.md](../../02-architecture/frontend/routing-structure.md#historical-data-routes))
  - 💾 **Database:** All VCI submission tables ([feature-index.md](../../02-architecture/feature-index.md#vci-governance-dashboard))
  - 🔌 **API:** `vci_get_historical_submissions()` ([feature-index.md](../../02-architecture/feature-index.md#vci-governance-dashboard))

- [ ] **Task 1.2.4.19:** Implement `/vci/submissions/history/trends` route (MOH Tier 1)
  - 📐 **Wireframe:** [task-0.5.3.21](../../04-design/user-experience/wireframes/02-vci/analytics/task-0.5.3.21-submission-trends-analysis.md)
  - 🛣️ **Route:** `/vci/submissions/history/trends` ([routing-structure.md](../../02-architecture/frontend/routing-structure.md#historical-data-routes))
  - 💾 **Database:** All VCI submission tables ([feature-index.md](../../02-architecture/feature-index.md#vci-governance-dashboard))
  - 🔌 **API:** `vci_get_submission_trends()`, `vci_get_multi_year_comparison()` ([feature-index.md](../../02-architecture/feature-index.md#vci-governance-dashboard))

### Documentation Tasks
- [ ] **Task 1.2.4.20:** Create VCI module user documentation
  - 💾 **Database:** All VCI tables ([feature-index.md](../../02-architecture/feature-index.md#vci-module-features))
  - 🔌 **API:** All VCI RPC functions ([feature-index.md](../../02-architecture/feature-index.md#vci-module-features))
  - 📐 **Wireframe:** All VCI wireframes ([phase-0-5-wireframes-catalog.md](../Archive for now/phase-0-5-wireframes-catalog.md))

- [ ] **Task 1.2.4.21:** Phase 1.2 internal review and sign-off
  - 💾 **Database:** All VCI tables ([feature-index.md](../../02-architecture/feature-index.md#vci-module-features))
  - 🔌 **API:** All VCI RPC functions ([feature-index.md](../../02-architecture/feature-index.md#vci-module-features))

### Integration Checkpoint Validation
- [ ] **Task 1.2.4.22:** Data Model Validation (Nadia) - Verify VCI schema supports ECS requirements
  - 💾 **Database:** VCI tables (thresholds) for ECS integration ([feature-index.md](../../02-architecture/feature-index.md#feature-dependency-matrix))
  - 🔌 **API:** Module integration contracts ([module-integration-contracts.md](../../02-architecture/integration/module-integration-contracts.md))

- [ ] **Task 1.2.4.23:** RLS Policy Validation (Rafi) - Verify RLS policies allow ECS module access
  - 💾 **Database:** VCI tables accessible by ECS ([feature-index.md](../../02-architecture/feature-index.md#feature-dependency-matrix))
  - 🔌 **API:** RLS policy verification ([security-architecture.md](../../02-architecture/security/security-architecture.md))

- [ ] **Task 1.2.4.24:** API Contract Validation (Maya) - Verify threshold switching contract
  - 💾 **Database:** VCI tables accessed by ECS ([feature-index.md](../../02-architecture/feature-index.md#feature-dependency-matrix))
  - 🔌 **API:** VCI RPC functions used by ECS (threshold switching) ([module-integration-contracts.md](../../02-architecture/integration/module-integration-contracts.md))

- [ ] **Task 1.2.4.25:** Seed Data Validation (Hassan) - Verify seed data covers ECS test scenarios
  - 💾 **Database:** VCI seed data needed for ECS testing ([feature-index.md](../../02-architecture/feature-index.md#feature-dependency-matrix))
  - 🔌 **API:** Seed data validation for ECS requirements

**Gate:** Phase 1.3 (ECS) cannot start until all 4 validations pass.

---

# PHASE 1.3: ECS DEVELOPMENT (Month 4)

**Duration:** 4 weeks  
**Objective:** Build Export Control System module and integrate with RMM + VCI

**Prerequisites:**
- ⏳ Phase 1.1 (RMM) - **AWAITING IMPLEMENTATION** (not started)
- ⏳ Phase 1.2 (VCI) - **AWAITING IMPLEMENTATION** (not started)
- ⏳ VCI schema supports ECS requirements - **AWAITING IMPLEMENTATION**
- ⏳ RLS policies allow ECS module access to VCI data - **AWAITING IMPLEMENTATION**
- ⏳ API contracts provide ECS-required data (threshold switching) - **AWAITING IMPLEMENTATION**
- ⏳ Seed data covers ECS test scenarios - **AWAITING IMPLEMENTATION**

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
4. **Seed Data Validation (Hassan):** Verify seed data covers CMC test scenarios (coordinates with Farah for realism validation)

**Gate:** Phase 1.4 cannot start until all 4 validations pass.

---

## Subphase 1.3.1: ECS Backend Foundation (Week 1)

**🔒 COMPLIANCE VALIDATION (Sami - Required Before ANY Task):**

**⚠️ STOP AUTHORITY:** Sami (Implementation Compliance Specialist) has **MANDATORY STOP AUTHORITY**. If ANY compliance rule is violated, implementation **MUST STOP IMMEDIATELY**. No exceptions.

**Before starting ANY task in this subphase, the following MUST be verified and documented:**

- [ ] **Phase 1.2 Complete (MANDATORY):** All Phase 1.2 tasks are complete and all 4 integration checkpoints validated. **NO ECS TASKS CAN START UNTIL PHASE 1.2 IS COMPLETE.** Starting ECS tasks before Phase 1.2 completion is a **COMPLIANCE VIOLATION**.
- [ ] **Integration Checkpoint 1 - Data Model Validation (Nadia):** VCI schema supports ECS requirements. **VERIFIED: [Date] [Nadia's signature]**
- [ ] **Integration Checkpoint 2 - RLS Policy Validation (Rafi):** RLS policies allow ECS module access to VCI data. **VERIFIED: [Date] [Rafi's signature]**
- [ ] **Integration Checkpoint 3 - API Contract Validation (Maya):** Threshold switching contract verified - RPC functions provide data ECS needs. **VERIFIED: [Date] [Maya's signature]**
- [ ] **Integration Checkpoint 4 - Seed Data Validation (Hassan):** Seed data covers ECS test scenarios (coordinates with Farah for realism validation). **VERIFIED: [Date] [Hassan's signature]**
- [ ] **1. Sequential Task Verification (MANDATORY):** All previous tasks from Phases 1.1 and 1.2 are complete and checked off (`[x]`). **NO TASK CAN START UNTIL ALL PREVIOUS TASKS ARE COMPLETE.** Sami verifies this before every task. Starting a task out of sequence is a **COMPLIANCE VIOLATION**.
- [ ] **2. Role Name Verification:** Frontend role names match database schema exactly; role constants match `users.role` enum values; no hardcoded role strings (use constants).
- [ ] **3. Schema Verification:** Database schema verified before role-dependent code; all required tables/fields/RLS policies exist; Phase 0.6 schema additions incorporated where applicable.
- [ ] **4. Integration Verification:** Layout/components integrated into routes (if applicable); navigation updated (if new routes added); module routing structure updated.
- [ ] **5. Role Coverage Verification:** All 9 roles are handled where applicable (Company Admin, Company Manager, Company User, MOH Tier 1, MOH Tier 2 Officer, MOH Tier 2 Registrar, MOH Auditor, System Admin, Vendor); role variants match wireframe specifications.
- [ ] **6. Wireframe Compliance:** Wireframe reviewed before starting; wireframe task ID(s) identified; wireframe requirements understood (layout, interactions, states, role-based variations); wireframe annotations reviewed.
- [ ] **7. Data Source Verification:** NO local mock data used (NO `const mockData = [...]`, NO `mockData.ts`, NO runtime mocks); all data queries Supabase database; seed data applied if required (verify via `supabase migration list`); database tables verified before starting (use SQL queries).
- [ ] **8. Wireframe Binding:** Wireframe binding comments will be added to code (JSDoc format with wireframe link); wireframe task ID(s) documented in code comments; PR description will include wireframe link(s); wireframe binding in both PR description AND codebase.
- [ ] **9. Seed Data Gate (If Applicable):** N/A for this subphase (seed data tasks are in Subphase 1.3.4).
- [ ] **Wireframe-First Implementation Principle:** Wireframes are the PRIMARY design reference. If a wireframe doesn't exist, **STOP** and create it first. See [Compliance Rules - Wireframe-First Implementation Principle](../standards/compliance-rules.md#wireframe-first-implementation-principle) for complete requirements.
- [ ] **Sami's Compliance Checklist:** Will be used for EVERY task in this subphase. **No task proceeds without Sami's approval.**
- [ ] **Sami's Approval:** Compliance review completed and approved by Sami before task start. **MANDATORY - No task can proceed without this approval.**
- [ ] **Implementation Summary Compliance Section:** After task completion, implementation summary MUST include compliance section documenting all rules followed (see "Implementation Summary Compliance Requirement" section above). **PRs without compliance section will be REJECTED.**
- [ ] **PR Description Checklist:** See [Compliance Rules - PR Description Checklist](../standards/compliance-rules.md#pr-description-checklist-required) for the complete 9-item checklist that every frontend task PR must include.

**🚫 STOP CONDITIONS (Do Not Proceed):**

**STOP implementation and resolve before proceeding** if any of the following is true:

- **Phase 1.2 Incomplete:** Phase 1.2 integration checkpoints are not validated. **STOP** and complete Phase 1.2 first.
- **Wireframe Requirements:** No wireframe link exists for the page/route being implemented. **STOP** and request/produce the wireframe first. Do not guess layouts, flows, or states.
- **Database & Schema Requirements:** Required DB table/field/RPC does not exist yet. **STOP** and implement the missing backend task first. Do not create local mocks as a workaround.
- **Security & Access Requirements:** RLS/policies prevent required access for the wireframed role. **STOP** and implement/update RLS policies before proceeding.
- **Seed Data Requirements:** Seed migration is not idempotent (must use deterministic IDs + UPSERT patterns) or not applied. **STOP** and fix/apply migration first.
- **Sequential Execution:** Previous tasks are not complete. **STOP** and complete all prerequisite tasks first.
- **Role Name Mismatch:** Frontend role names don't match database schema. **STOP** and fix role names to match schema exactly.

**⚠️ Backend Completion Gate:** All ECS backend foundation tasks (1.3.1.1-1.3.1.11) must be complete before workflow tasks begin. All ECS workflow backend tasks (1.3.2.1-1.3.2.12) and post-authorization backend tasks (1.3.3.1-1.3.3.8) must be complete before frontend tasks begin. **Frontend tasks starting before backend completion is a COMPLIANCE VIOLATION.**

### ECS Backend Setup Tasks
- [ ] **Task 1.3.1.1:** Create database migration for ECS tables (export_requests, export_authorizations, replenishment_schedules)
  - 💾 **Database:** `export_requests`, `export_authorizations`, `replenishment_schedules` ([feature-index.md](../../02-architecture/feature-index.md#ecs-module-features))
  - 🔌 **API:** ECS table schema ([data-dictionary.md](../../02-architecture/database/data-dictionary.md))

- [ ] **Task 1.3.1.2:** Verify ECS schema completeness
  - 💾 **Database:** `export_requests`, `export_authorizations`, `replenishment_schedules` ([feature-index.md](../../02-architecture/feature-index.md#ecs-module-features))
  - 🔌 **API:** Schema verification against requirements

- [ ] **Task 1.3.1.3:** Define ECS integration points with RMM+VCI
  - 💾 **Database:** Cross-module table references (RMM: `skus`, VCI: `thresholds`) ([feature-index.md](../../02-architecture/feature-index.md#feature-dependency-matrix))
  - 🔌 **API:** Module integration contracts ([module-integration-contracts.md](../../02-architecture/integration/module-integration-contracts.md))

- [ ] **Task 1.3.1.4:** Implement RLS policies for ECS tables
  - 💾 **Database:** `export_requests`, `export_authorizations`, `replenishment_schedules` ([feature-index.md](../../02-architecture/feature-index.md#ecs-module-features))
  - 🔌 **API:** RLS policy implementation ([security-architecture.md](../../02-architecture/security/security-architecture.md))

- [ ] **Task 1.3.1.5:** Create ECS RPC function - Export request submission
  - 💾 **Database:** `export_requests` ([feature-index.md](../../02-architecture/feature-index.md#ecs-module-features))
  - 🔌 **API:** `ecs_create_export_request()`, `ecs_submit_export_request()` ([feature-index.md](../../02-architecture/feature-index.md#ecs-module-features))

- [ ] **Task 1.3.1.6:** Create ECS RPC function - Export request modification
  - 💾 **Database:** `export_requests` ([feature-index.md](../../02-architecture/feature-index.md#ecs-module-features))
  - 🔌 **API:** ECS export request modification functions ([feature-index.md](../../02-architecture/feature-index.md#ecs-module-features))

- [ ] **Task 1.3.1.7:** Create ECS RPC function - Export request cancellation
  - 💾 **Database:** `export_requests` ([feature-index.md](../../02-architecture/feature-index.md#ecs-module-features))
  - 🔌 **API:** ECS export request cancellation functions ([feature-index.md](../../02-architecture/feature-index.md#ecs-module-features))

- [ ] **Task 1.3.1.8:** Implement XAMS calculation logic
  - 💾 **Database:** `aams_submissions`, `msq_submissions` (for XAMS calculation) ([feature-index.md](../../02-architecture/feature-index.md#ecs-module-features))
  - 🔌 **API:** XAMS calculation functions (used by ECS threshold calculation) ([feature-index.md](../../02-architecture/feature-index.md#ecs-module-features))

- [ ] **Task 1.3.1.9:** Implement ECS Threshold calculation logic (C × XAMS) ⚠️ **DEPENDS ON:** Task 1.3.1.8 (XAMS calculation logic)
  - 💾 **Database:** `thresholds` (ECS thresholds), `aams_submissions`, `msq_submissions` ([feature-index.md](../../02-architecture/feature-index.md#ecs-module-features))
  - 🔌 **API:** ECS threshold calculation functions ([feature-index.md](../../02-architecture/feature-index.md#ecs-module-features))

- [ ] **Task 1.3.1.10:** Implement conditional validation logic (CMC score-based if CMC active)
  - 💾 **Database:** `export_requests`, `compliance_scores` (if CMC active) ([feature-index.md](../../02-architecture/feature-index.md#ecs-module-features))
  - 🔌 **API:** Conditional validation functions ([feature-index.md](../../02-architecture/feature-index.md#ecs-module-features))

- [ ] **Task 1.3.1.11:** Create ECS RPC function - Export request evaluation
  - 💾 **Database:** `export_requests`, `thresholds`, `compliance_scores` ([feature-index.md](../../02-architecture/feature-index.md#ecs-module-features))
  - 🔌 **API:** `ecs_evaluate_export_request()` ([feature-index.md](../../02-architecture/feature-index.md#ecs-module-features))

---

## Subphase 1.3.2: ECS Workflow & Threshold Switching (Week 2)

**🔒 COMPLIANCE VALIDATION (Sami - Required Before ANY Task):**

**⚠️ STOP AUTHORITY:** Sami (Implementation Compliance Specialist) has **MANDATORY STOP AUTHORITY**. If ANY compliance rule is violated, implementation **MUST STOP IMMEDIATELY**. No exceptions.

**Before starting ANY task in this subphase, the following MUST be verified and documented:**

- [ ] **1. Sequential Task Verification (MANDATORY):** All previous tasks from Subphase 1.3.1 are complete and checked off (`[x]`). **NO TASK CAN START UNTIL ALL PREVIOUS TASKS ARE COMPLETE.** Sami verifies this before every task. Starting a task out of sequence is a **COMPLIANCE VIOLATION**.
- [ ] **Subphase 1.3.1 Complete:** All ECS backend foundation tasks (1.3.1.1-1.3.1.11) are complete and verified.
- [ ] **2. Role Name Verification:** Frontend role names match database schema exactly; role constants match `users.role` enum values; no hardcoded role strings (use constants).
- [ ] **3. Schema Verification:** Database schema verified before role-dependent code; all required tables/fields/RLS policies exist; Phase 0.6 schema additions incorporated where applicable.
- [ ] **4. Integration Verification:** Layout/components integrated into routes (if applicable); navigation updated (if new routes added); module routing structure updated.
- [ ] **5. Role Coverage Verification:** All 9 roles are handled where applicable (Company Admin, Company Manager, Company User, MOH Tier 1, MOH Tier 2 Officer, MOH Tier 2 Registrar, MOH Auditor, System Admin, Vendor); role variants match wireframe specifications.
- [ ] **6. Wireframe Compliance:** Wireframe reviewed before starting; wireframe task ID(s) identified; wireframe requirements understood (layout, interactions, states, role-based variations); wireframe annotations reviewed.
- [ ] **7. Data Source Verification:** NO local mock data used (NO `const mockData = [...]`, NO `mockData.ts`, NO runtime mocks); all data queries Supabase database; seed data applied if required (verify via `supabase migration list`); database tables verified before starting (use SQL queries).
- [ ] **8. Wireframe Binding:** Wireframe binding comments will be added to code (JSDoc format with wireframe link); wireframe task ID(s) documented in code comments; PR description will include wireframe link(s); wireframe binding in both PR description AND codebase.
- [ ] **9. Seed Data Gate (If Applicable):** N/A for this subphase (seed data tasks are in Subphase 1.3.4).
- [ ] **Wireframe-First Implementation Principle:** Wireframes are the PRIMARY design reference. If a wireframe doesn't exist, **STOP** and create it first. See [Compliance Rules - Wireframe-First Implementation Principle](../standards/compliance-rules.md#wireframe-first-implementation-principle) for complete requirements.
- [ ] **Sami's Compliance Checklist:** Will be used for EVERY task in this subphase. **No task proceeds without Sami's approval.**
- [ ] **Sami's Approval:** Compliance review completed and approved by Sami before task start. **MANDATORY - No task can proceed without this approval.**
- [ ] **Implementation Summary Compliance Section:** After task completion, implementation summary MUST include compliance section documenting all rules followed (see "Implementation Summary Compliance Requirement" section above). **PRs without compliance section will be REJECTED.**
- [ ] **PR Description Checklist:** See [Compliance Rules - PR Description Checklist](../standards/compliance-rules.md#pr-description-checklist-required) for the complete 9-item checklist that every frontend task PR must include.

**🚫 STOP CONDITIONS (Do Not Proceed):**

**STOP implementation and resolve before proceeding** if any of the following is true:

- **Previous Subphase Incomplete:** Subphase 1.3.1 tasks are not complete. **STOP** and complete all prerequisite tasks first.
- **Backend Foundation Not Complete:** ECS backend foundation is not implemented. **STOP** and implement backend foundation first.
- **Wireframe Requirements:** No wireframe link exists for the page/route being implemented. **STOP** and request/produce the wireframe first. Do not guess layouts, flows, or states.
- **Database & Schema Requirements:** Required DB table/field/RPC does not exist yet. **STOP** and implement the missing backend task first. Do not create local mocks as a workaround.
- **Security & Access Requirements:** RLS/policies prevent required access for the wireframed role. **STOP** and implement/update RLS policies before proceeding.
- **Seed Data Requirements:** Seed migration is not idempotent (must use deterministic IDs + UPSERT patterns) or not applied. **STOP** and fix/apply migration first.
- **Sequential Execution:** Previous tasks are not complete. **STOP** and complete all prerequisite tasks first.
- **Role Name Mismatch:** Frontend role names don't match database schema. **STOP** and fix role names to match schema exactly.

### ECS Workflow Backend Tasks
- [ ] **Task 1.3.2.1:** Create ECS RPC function - Export request auto-approval queue
  - 💾 **Database:** `export_requests` ([feature-index.md](../../02-architecture/feature-index.md#ecs-module-features))
  - 🔌 **API:** ECS auto-approval queue functions ([feature-index.md](../../02-architecture/feature-index.md#ecs-module-features))

- [ ] **Task 1.3.2.2:** Create ECS RPC function - Export request Tier 2 verification
  - 💾 **Database:** `export_requests` ([feature-index.md](../../02-architecture/feature-index.md#ecs-module-features))
  - 🔌 **API:** `ecs_verify_export()` ([feature-index.md](../../02-architecture/feature-index.md#ecs-module-features))

- [ ] **Task 1.3.2.3:** Create ECS RPC function - Export request manual review
  - 💾 **Database:** `export_requests` ([feature-index.md](../../02-architecture/feature-index.md#ecs-module-features))
  - 🔌 **API:** `ecs_intervene_export()` ([feature-index.md](../../02-architecture/feature-index.md#ecs-module-features))

- [ ] **Task 1.3.2.4:** Create ECS RPC function - Export request approval
  - 💾 **Database:** `export_requests` ([feature-index.md](../../02-architecture/feature-index.md#ecs-module-features))
  - 🔌 **API:** `ecs_approve_export()` ([feature-index.md](../../02-architecture/feature-index.md#ecs-module-features))

- [ ] **Task 1.3.2.5:** Create ECS RPC function - Export request rejection
  - 💾 **Database:** `export_requests` ([feature-index.md](../../02-architecture/feature-index.md#ecs-module-features))
  - 🔌 **API:** `ecs_reject_export()` ([feature-index.md](../../02-architecture/feature-index.md#ecs-module-features))

- [ ] **Task 1.3.2.7:** Implement threshold switching logic (VCI Threshold → ECS Threshold on authorization) ⚠️ **CRITICAL:** Must be implemented BEFORE authorization RPC function (1.3.2.6)
  - 💾 **Database:** `thresholds` (VCI and ECS), `export_authorizations` ([feature-index.md](../../02-architecture/feature-index.md#ecs-module-features))
  - 🔌 **API:** Threshold switching functions (used by authorization RPC) ([feature-index.md](../../02-architecture/feature-index.md#feature-dependency-matrix))

- [ ] **Task 1.3.2.9:** Implement intervention window logic ⚠️ **DEPENDS ON:** Task 1.3.2.7 (threshold switching logic)
  - 💾 **Database:** `export_authorizations` ([feature-index.md](../../02-architecture/feature-index.md#ecs-module-features))
  - 🔌 **API:** Intervention window validation functions ([feature-index.md](../../02-architecture/feature-index.md#ecs-module-features))

- [ ] **Task 1.3.2.6:** Create ECS RPC function - Export authorization ⚠️ **DEPENDS ON:** Task 1.3.2.7 (threshold switching logic)
  - 💾 **Database:** `export_authorizations`, `thresholds` ([feature-index.md](../../02-architecture/feature-index.md#ecs-module-features))
  - 🔌 **API:** Export authorization workflow functions ([feature-index.md](../../02-architecture/feature-index.md#ecs-module-features))

- [ ] **Task 1.3.2.8:** Create scheduled trigger for threshold reversion (3 months after authorization) ⚠️ **DEPENDS ON:** Task 1.3.2.7 (threshold switching logic)
  - 💾 **Database:** `thresholds`, `export_authorizations` ([feature-index.md](../../02-architecture/feature-index.md#ecs-module-features))
  - 🔌 **API:** Scheduled trigger for threshold reversion ([feature-index.md](../../02-architecture/feature-index.md#ecs-module-features))

- [ ] **Task 1.3.2.10:** Create ECS RPC function - Export authorization expiration check
  - 💾 **Database:** `export_authorizations` ([feature-index.md](../../02-architecture/feature-index.md#ecs-module-features))
  - 🔌 **API:** Export authorization expiration check functions ([feature-index.md](../../02-architecture/feature-index.md#ecs-module-features))

- [ ] **Task 1.3.2.11:** Create scheduled trigger for export expiration checks
  - 💾 **Database:** `export_authorizations` ([feature-index.md](../../02-architecture/feature-index.md#ecs-module-features))
  - 🔌 **API:** Scheduled trigger for expiration checks ([feature-index.md](../../02-architecture/feature-index.md#ecs-module-features))

- [ ] **Task 1.3.2.12:** Create ECS RPC function - Export authorization extension
  - 💾 **Database:** `export_authorizations` ([feature-index.md](../../02-architecture/feature-index.md#ecs-module-features))
  - 🔌 **API:** Export authorization extension functions ([feature-index.md](../../02-architecture/feature-index.md#ecs-module-features))

---

## Subphase 1.3.3: ECS Post-Authorization & Replenishment (Week 3)

**🔒 COMPLIANCE VALIDATION (Sami - Required Before ANY Task):**

**⚠️ STOP AUTHORITY:** Sami (Implementation Compliance Specialist) has **MANDATORY STOP AUTHORITY**. If ANY compliance rule is violated, implementation **MUST STOP IMMEDIATELY**. No exceptions.

**Before starting ANY task in this subphase, the following MUST be verified and documented:**

- [ ] **1. Sequential Task Verification (MANDATORY):** All previous tasks from Subphases 1.3.1 and 1.3.2 are complete and checked off (`[x]`). **NO TASK CAN START UNTIL ALL PREVIOUS TASKS ARE COMPLETE.** Sami verifies this before every task. Starting a task out of sequence is a **COMPLIANCE VIOLATION**.
- [ ] **Subphase 1.3.2 Complete:** All ECS workflow backend tasks (1.3.2.1-1.3.2.12) are complete and verified.
- [ ] **2. Role Name Verification:** Frontend role names match database schema exactly; role constants match `users.role` enum values; no hardcoded role strings (use constants).
- [ ] **3. Schema Verification:** Database schema verified before role-dependent code; all required tables/fields/RLS policies exist; Phase 0.6 schema additions incorporated where applicable.
- [ ] **4. Integration Verification:** Layout/components integrated into routes (if applicable); navigation updated (if new routes added); module routing structure updated.
- [ ] **5. Role Coverage Verification:** All 9 roles are handled where applicable (Company Admin, Company Manager, Company User, MOH Tier 1, MOH Tier 2 Officer, MOH Tier 2 Registrar, MOH Auditor, System Admin, Vendor); role variants match wireframe specifications.
- [ ] **6. Wireframe Compliance:** Wireframe reviewed before starting; wireframe task ID(s) identified; wireframe requirements understood (layout, interactions, states, role-based variations); wireframe annotations reviewed.
- [ ] **7. Data Source Verification:** NO local mock data used (NO `const mockData = [...]`, NO `mockData.ts`, NO runtime mocks); all data queries Supabase database; seed data applied if required (verify via `supabase migration list`); database tables verified before starting (use SQL queries).
- [ ] **8. Wireframe Binding:** Wireframe binding comments will be added to code (JSDoc format with wireframe link); wireframe task ID(s) documented in code comments; PR description will include wireframe link(s); wireframe binding in both PR description AND codebase.
- [ ] **9. Seed Data Gate (If Applicable):** Seed migration `seed_1_3_3_ecs` applied and verified (see below for verification requirements); seed data acceptance criteria verified; RLS validation completed if required; seed data covers wireframe scenarios.
- [ ] **Wireframe-First Implementation Principle:** Wireframes are the PRIMARY design reference. If a wireframe doesn't exist, **STOP** and create it first. See [Compliance Rules - Wireframe-First Implementation Principle](../standards/compliance-rules.md#wireframe-first-implementation-principle) for complete requirements.
- [ ] **Sami's Compliance Checklist:** Will be used for EVERY task in this subphase. **No task proceeds without Sami's approval.**
- [ ] **Sami's Approval:** Compliance review completed and approved by Sami before task start. **MANDATORY - No task can proceed without this approval.**
- [ ] **Implementation Summary Compliance Section:** After task completion, implementation summary MUST include compliance section documenting all rules followed (see "Implementation Summary Compliance Requirement" section above). **PRs without compliance section will be REJECTED.**
- [ ] **PR Description Checklist:** See [Compliance Rules - PR Description Checklist](../standards/compliance-rules.md#pr-description-checklist-required) for the complete 9-item checklist that every frontend task PR must include.

**🚫 STOP CONDITIONS (Do Not Proceed):**

**STOP implementation and resolve before proceeding** if any of the following is true:

- **Previous Subphase Incomplete:** Subphase 1.3.2 tasks are not complete. **STOP** and complete all prerequisite tasks first.
- **Wireframe Requirements:** No wireframe link exists for the page/route being implemented. **STOP** and request/produce the wireframe first. Do not guess layouts, flows, or states.
- **Database & Schema Requirements:** Required DB table/field/RPC does not exist yet. **STOP** and implement the missing backend task first. Do not create local mocks as a workaround.
- **Security & Access Requirements:** RLS/policies prevent required access for the wireframed role. **STOP** and implement/update RLS policies before proceeding.
- **Seed Data Requirements:** Seed migration is not idempotent (must use deterministic IDs + UPSERT patterns) or not applied. **STOP** and fix/apply migration first.
- **Sequential Execution:** Previous tasks are not complete. **STOP** and complete all prerequisite tasks first.
- **Role Name Mismatch:** Frontend role names don't match database schema. **STOP** and fix role names to match schema exactly.

**Seed Data Gate (Required):**
- Before starting ECS frontend pages, apply the seed migration stage `seed_1_3_3_ecs` per [Phase 1.1 Playbook - Seed Strategy](phase-1-1-mockdata.md#seed-strategy-scenario-packs-deterministic) (versioned SQL migrations, idempotent).

### ECS Post-Authorization Backend Tasks
- [ ] **Task 1.3.3.1:** Create ECS RPC function - Export completion report
  - 💾 **Database:** `export_authorizations`, `export_requests` ([feature-index.md](../../02-architecture/feature-index.md#ecs-module-features))
  - 🔌 **API:** Export completion report functions ([feature-index.md](../../02-architecture/feature-index.md#ecs-module-features))

- [ ] **Task 1.3.3.2:** Create ECS RPC function - Export cancellation/modification request
  - 💾 **Database:** `export_authorizations`, `export_requests` ([feature-index.md](../../02-architecture/feature-index.md#ecs-module-features))
  - 🔌 **API:** Export cancellation/modification request functions ([feature-index.md](../../02-architecture/feature-index.md#ecs-module-features))

- [ ] **Task 1.3.3.3:** Implement replenishment schedule tracking logic
  - 💾 **Database:** `replenishment_schedules`, `export_authorizations` ([feature-index.md](../../02-architecture/feature-index.md#ecs-module-features))
  - 🔌 **API:** Replenishment schedule tracking functions ([feature-index.md](../../02-architecture/feature-index.md#ecs-module-features))

- [ ] **Task 1.3.3.4:** Create ECS RPC function - Replenishment delay escalation
  - 💾 **Database:** `replenishment_schedules` ([feature-index.md](../../02-architecture/feature-index.md#ecs-module-features))
  - 🔌 **API:** Replenishment delay escalation functions ([feature-index.md](../../02-architecture/feature-index.md#ecs-module-features))

- [ ] **Task 1.3.3.5:** Create scheduled trigger for replenishment delay escalation
  - 💾 **Database:** `replenishment_schedules` ([feature-index.md](../../02-architecture/feature-index.md#ecs-module-features))
  - 🔌 **API:** Scheduled trigger for escalation ([feature-index.md](../../02-architecture/feature-index.md#ecs-module-features))

- [ ] **Task 1.3.3.6:** Implement tiered escalation process
  - 💾 **Database:** `replenishment_schedules`, `notifications` ([feature-index.md](../../02-architecture/feature-index.md#ecs-module-features))
  - 🔌 **API:** Tiered escalation process functions ([feature-index.md](../../02-architecture/feature-index.md#ecs-module-features))

- [ ] **Task 1.3.3.7:** Create ECS RPC function - Replenishment proof submission
  - 💾 **Database:** `replenishment_schedules` ([feature-index.md](../../02-architecture/feature-index.md#ecs-module-features))
  - 🔌 **API:** Replenishment proof submission functions ([feature-index.md](../../02-architecture/feature-index.md#ecs-module-features))

- [ ] **Task 1.3.3.8:** Create ECS RPC function - Replenishment verification
  - 💾 **Database:** `replenishment_schedules` ([feature-index.md](../../02-architecture/feature-index.md#ecs-module-features))
  - 🔌 **API:** Replenishment verification functions ([feature-index.md](../../02-architecture/feature-index.md#ecs-module-features))

### ECS Frontend Tasks
- [ ] **Task 1.3.3.9:** Create ECS module layout and navigation
  - 📐 **Wireframe:** [task-0.5.1.14](../../04-design/user-experience/wireframes/00-core-foundation/layout-navigation/task-0.5.1.14-dashboard-layout-structure.md), [task-0.5.1.16](../../04-design/user-experience/wireframes/00-core-foundation/layout-navigation/task-0.5.1.16-sidebar-navigation.md)
  - 🛣️ **Route:** `/ecs` layout ([routing-structure.md](../../02-architecture/frontend/routing-structure.md#ecs-routes))
  - 💾 **Database:** `users`, `system_config` ([feature-index.md](../../02-architecture/feature-index.md#ecs-module-features))
  - 🔌 **API:** `shared_get_user_permissions()` ([feature-index.md](../../02-architecture/feature-index.md#ecs-module-features))

- [ ] **Task 1.3.3.10:** Implement Export requests list page
  - 📐 **Wireframe:** [task-0.5.4.1](../../04-design/user-experience/wireframes/03-ecs/export-requests/task-0.5.4.1-export-requests-list.md)
  - 🛣️ **Route:** `/ecs/export-requests` ([routing-structure.md](../../02-architecture/frontend/routing-structure.md#ecs-routes))
  - 💾 **Database:** `export_requests` ([feature-index.md](../../02-architecture/feature-index.md#ecs-module-features))
  - 🔌 **API:** `ecs_list_export_requests()`, `ecs_get_export_request()` ([feature-index.md](../../02-architecture/feature-index.md#ecs-module-features))

- [ ] **Task 1.3.3.11:** Implement Export request form
  - 📐 **Wireframe:** [task-0.5.4.2](../../04-design/user-experience/wireframes/03-ecs/export-requests/task-0.5.4.2-export-request-form.md)
  - 🛣️ **Route:** `/ecs/export-requests/new` ([routing-structure.md](../../02-architecture/frontend/routing-structure.md#ecs-routes))
  - 💾 **Database:** `export_requests` ([feature-index.md](../../02-architecture/feature-index.md#ecs-module-features))
  - 🔌 **API:** `ecs_create_export_request()`, `ecs_submit_export_request()` ([feature-index.md](../../02-architecture/feature-index.md#ecs-module-features))

- [ ] **Task 1.3.3.12:** Implement Export request detail page
  - 📐 **Wireframe:** [task-0.5.4.3](../../04-design/user-experience/wireframes/03-ecs/export-requests/task-0.5.4.3-export-request-detail.md)
  - 🛣️ **Route:** `/ecs/export-requests/[id]` ([routing-structure.md](../../02-architecture/frontend/routing-structure.md#ecs-routes))
  - 💾 **Database:** `export_requests`, `export_authorizations`, `thresholds` ([feature-index.md](../../02-architecture/feature-index.md#ecs-module-features))
  - 🔌 **API:** `ecs_get_export_request()`, `ecs_evaluate_export_request()` ([feature-index.md](../../02-architecture/feature-index.md#ecs-module-features))

- [ ] **Task 1.3.3.13:** Implement Export workflow actions
  - 📐 **Wireframe:** [task-0.5.4.4](../../04-design/user-experience/wireframes/03-ecs/export-requests/task-0.5.4.4-export-workflow-actions.md)
  - 🛣️ **Route:** Actions on export request detail page ([routing-structure.md](../../02-architecture/frontend/routing-structure.md#ecs-routes))
  - 💾 **Database:** `export_requests`, `export_authorizations` ([feature-index.md](../../02-architecture/feature-index.md#ecs-module-features))
  - 🔌 **API:** `ecs_verify_export()`, `ecs_approve_export()`, `ecs_reject_export()`, `ecs_intervene_export()` ([feature-index.md](../../02-architecture/feature-index.md#ecs-module-features))

- [ ] **Task 1.3.3.14:** Implement Export authorizations list page
  - 📐 **Wireframe:** [task-0.5.4.5](../../04-design/user-experience/wireframes/03-ecs/authorizations/task-0.5.4.5-export-authorizations-list.md)
  - 🛣️ **Route:** `/ecs/authorizations` ([routing-structure.md](../../02-architecture/frontend/routing-structure.md#ecs-routes))
  - 💾 **Database:** `export_authorizations` ([feature-index.md](../../02-architecture/feature-index.md#ecs-module-features))
  - 🔌 **API:** `ecs_list_authorizations()`, `ecs_get_authorization()` ([feature-index.md](../../02-architecture/feature-index.md#ecs-module-features))

- [ ] **Task 1.3.3.15:** Implement Export authorization detail page
  - 📐 **Wireframe:** [task-0.5.4.6](../../04-design/user-experience/wireframes/03-ecs/authorizations/task-0.5.4.6-export-authorization-detail.md)
  - 🛣️ **Route:** `/ecs/authorizations/[id]` ([routing-structure.md](../../02-architecture/frontend/routing-structure.md#ecs-routes))
  - 💾 **Database:** `export_authorizations`, `replenishment_schedules` ([feature-index.md](../../02-architecture/feature-index.md#ecs-module-features))
  - 🔌 **API:** `ecs_get_authorization()`, `ecs_get_replenishment_schedule()` ([feature-index.md](../../02-architecture/feature-index.md#ecs-module-features))

- [ ] **Task 1.3.3.16:** Implement Export completion reporting interface
  - 📐 **Wireframe:** [task-0.5.4.7](../../04-design/user-experience/wireframes/03-ecs/authorizations/task-0.5.4.7-export-completion-reporting.md)
  - 🛣️ **Route:** `/ecs/authorizations/[id]/complete` ([routing-structure.md](../../02-architecture/frontend/routing-structure.md#ecs-routes))
  - 💾 **Database:** `export_authorizations`, `export_completions` ([feature-index.md](../../02-architecture/feature-index.md#ecs-module-features))
  - 🔌 **API:** `ecs_report_export_completion()` ([feature-index.md](../../02-architecture/feature-index.md#ecs-module-features))

- [ ] **Task 1.3.3.17:** Implement Replenishment schedule tracking interface
  - 📐 **Wireframe:** [task-0.5.4.8](../../04-design/user-experience/wireframes/03-ecs/replenishment/task-0.5.4.8-replenishment-schedule-tracking.md)
  - 🛣️ **Route:** `/ecs/replenishment` ([routing-structure.md](../../02-architecture/frontend/routing-structure.md#ecs-routes))
  - 💾 **Database:** `replenishment_schedules` ([feature-index.md](../../02-architecture/feature-index.md#ecs-module-features))
  - 🔌 **API:** `ecs_get_replenishment_schedules()`, `ecs_update_replenishment_status()` ([feature-index.md](../../02-architecture/feature-index.md#ecs-module-features))

- [ ] **Task 1.3.3.18:** Implement ECS Export history page
  - 📐 **Wireframe:** [task-0.5.4.9](../../04-design/user-experience/wireframes/03-ecs/history/task-0.5.4.9-export-history.md)
  - 🛣️ **Route:** `/ecs/exports/history` ([routing-structure.md](../../02-architecture/frontend/routing-structure.md#historical-data-routes))
  - 💾 **Database:** `export_authorizations`, `export_completions` ([feature-index.md](../../02-architecture/feature-index.md#ecs-module-features))
  - 🔌 **API:** `ecs_get_export_history()` ([feature-index.md](../../02-architecture/feature-index.md#ecs-module-features))

---

## Subphase 1.3.4: ECS Integration Testing & Seed Data (Week 4)

**🔒 COMPLIANCE VALIDATION (Sami - Required Before ANY Task):**

**⚠️ STOP AUTHORITY:** Sami (Implementation Compliance Specialist) has **MANDATORY STOP AUTHORITY**. If ANY compliance rule is violated, implementation **MUST STOP IMMEDIATELY**. No exceptions.

**Before starting ANY task in this subphase, the following MUST be verified and documented:**

- [ ] **1. Sequential Task Verification (MANDATORY):** All previous tasks from Subphases 1.3.1, 1.3.2, and 1.3.3 are complete and checked off (`[x]`). **NO TASK CAN START UNTIL ALL PREVIOUS TASKS ARE COMPLETE.** Sami verifies this before every task. Starting a task out of sequence is a **COMPLIANCE VIOLATION**.
- [ ] **Subphase 1.3.3 Complete:** All ECS post-authorization and frontend tasks (1.3.3.1-1.3.3.18) are complete and verified.
- [ ] **2. Role Name Verification:** Frontend role names match database schema exactly; role constants match `users.role` enum values; no hardcoded role strings (use constants).
- [ ] **3. Schema Verification:** Database schema verified before role-dependent code; all required tables/fields/RLS policies exist; Phase 0.6 schema additions incorporated where applicable.
- [ ] **4. Integration Verification:** Layout/components integrated into routes (if applicable); navigation updated (if new routes added); module routing structure updated.
- [ ] **5. Role Coverage Verification:** All 9 roles are handled where applicable (Company Admin, Company Manager, Company User, MOH Tier 1, MOH Tier 2 Officer, MOH Tier 2 Registrar, MOH Auditor, System Admin, Vendor); role variants match wireframe specifications.
- [ ] **6. Wireframe Compliance:** Wireframe reviewed before starting; wireframe task ID(s) identified; wireframe requirements understood (layout, interactions, states, role-based variations); wireframe annotations reviewed.
- [ ] **7. Data Source Verification:** NO local mock data used (NO `const mockData = [...]`, NO `mockData.ts`, NO runtime mocks); all data queries Supabase database; seed data applied if required (verify via `supabase migration list`); database tables verified before starting (use SQL queries).
- [ ] **8. Wireframe Binding:** Wireframe binding comments will be added to code (JSDoc format with wireframe link); wireframe task ID(s) documented in code comments; PR description will include wireframe link(s); wireframe binding in both PR description AND codebase.
- [ ] **9. Seed Data Gate (If Applicable):** N/A for this subphase (seed data tasks are part of this subphase).
- [ ] **Wireframe-First Implementation Principle:** Wireframes are the PRIMARY design reference. If a wireframe doesn't exist, **STOP** and create it first. See [Compliance Rules - Wireframe-First Implementation Principle](../standards/compliance-rules.md#wireframe-first-implementation-principle) for complete requirements.
- [ ] **Sami's Compliance Checklist:** Will be used for EVERY task in this subphase. **No task proceeds without Sami's approval.**
- [ ] **Sami's Approval:** Compliance review completed and approved by Sami before task start. **MANDATORY - No task can proceed without this approval.**
- [ ] **Implementation Summary Compliance Section:** After task completion, implementation summary MUST include compliance section documenting all rules followed (see "Implementation Summary Compliance Requirement" section above). **PRs without compliance section will be REJECTED.**
- [ ] **PR Description Checklist:** See [Compliance Rules - PR Description Checklist](../standards/compliance-rules.md#pr-description-checklist-required) for the complete 9-item checklist that every frontend task PR must include.

**🚫 STOP CONDITIONS (Do Not Proceed):**

**STOP implementation and resolve before proceeding** if any of the following is true:

- **Previous Subphase Incomplete:** Subphase 1.3.3 tasks are not complete. **STOP** and complete all prerequisite tasks first.
- **Backend Not Complete:** ECS backend RPC functions are not implemented. **STOP** and implement backend first.
- **Frontend Not Complete:** ECS frontend pages are not implemented. **STOP** and implement frontend first.
- **Wireframe Requirements:** No wireframe link exists for the page/route being implemented. **STOP** and request/produce the wireframe first. Do not guess layouts, flows, or states.
- **Database & Schema Requirements:** Required DB table/field/RPC does not exist yet. **STOP** and implement the missing backend task first. Do not create local mocks as a workaround.
- **Security & Access Requirements:** RLS/policies prevent required access for the wireframed role. **STOP** and implement/update RLS policies before proceeding.
- **Seed Data Requirements:** Seed migration is not idempotent (must use deterministic IDs + UPSERT patterns) or not applied. **STOP** and fix/apply migration first.
- **Role Name Mismatch:** Frontend role names don't match database schema. **STOP** and fix role names to match schema exactly.

### Integration Contract Verification
- [ ] **Task 1.3.4.1:** Verify VCI→ECS integration contract (threshold switching contract, data dependencies)
  - 💾 **Database:** VCI tables (thresholds) and ECS tables (export_authorizations) ([feature-index.md](../../02-architecture/feature-index.md#feature-dependency-matrix))
  - 🔌 **API:** Module integration contracts ([module-integration-contracts.md](../../02-architecture/integration/module-integration-contracts.md))

### ECS Testing & Data Tasks
- [ ] **Task 1.3.4.2:** Create ECS module test suite (unit tests for RPC functions)
  - 💾 **Database:** All ECS tables (export_requests, export_authorizations, replenishment_schedules) ([feature-index.md](../../02-architecture/feature-index.md#ecs-module-features))
  - 🔌 **API:** All ECS RPC functions ([feature-index.md](../../02-architecture/feature-index.md#ecs-module-features))

- [ ] **Task 1.3.4.3:** Create integration tests - ECS workflow (submission → evaluation → approval → authorization)
  - 💾 **Database:** `export_requests`, `export_authorizations`, `thresholds` ([feature-index.md](../../02-architecture/feature-index.md#ecs-module-features))
  - 🔌 **API:** ECS workflow RPC functions ([feature-index.md](../../02-architecture/feature-index.md#ecs-module-features))

- [ ] **Task 1.3.4.4:** Create integration tests - Threshold switching (VCI → ECS → VCI)
  - 💾 **Database:** `thresholds` (VCI and ECS), `export_authorizations` ([feature-index.md](../../02-architecture/feature-index.md#feature-dependency-matrix))
  - 🔌 **API:** Threshold switching functions ([module-integration-contracts.md](../../02-architecture/integration/module-integration-contracts.md))

- [ ] **Task 1.3.4.5:** Create integration tests - Conditional validation (CMC score integration)
  - 💾 **Database:** `export_requests`, `compliance_scores` ([feature-index.md](../../02-architecture/feature-index.md#ecs-module-features))
  - 🔌 **API:** Conditional validation functions ([feature-index.md](../../02-architecture/feature-index.md#ecs-module-features))

- [ ] **Task 1.3.4.6:** Create integration tests - Replenishment delay escalation
  - 💾 **Database:** `replenishment_schedules`, `notifications` ([feature-index.md](../../02-architecture/feature-index.md#ecs-module-features))
  - 🔌 **API:** Replenishment escalation functions ([feature-index.md](../../02-architecture/feature-index.md#ecs-module-features))

- [ ] **Task 1.3.4.7:** Create seed data generation script - Export requests (Hassan)
  - 💾 **Database:** `export_requests` ([feature-index.md](../../02-architecture/feature-index.md#ecs-module-features))
  - 🔌 **API:** Seed data generation scripts ([phase-1-1-mockdata.md](phase-1-1-mockdata.md))

- [ ] **Task 1.3.4.8:** Create seed data generation script - Export authorizations (Hassan)
  - 💾 **Database:** `export_authorizations` ([feature-index.md](../../02-architecture/feature-index.md#ecs-module-features))
  - 🔌 **API:** Seed data generation scripts ([phase-1-1-mockdata.md](phase-1-1-mockdata.md))

- [ ] **Task 1.3.4.9:** Create seed data generation script - Replenishment schedules (Hassan)
  - 💾 **Database:** `replenishment_schedules` ([feature-index.md](../../02-architecture/feature-index.md#ecs-module-features))
  - 🔌 **API:** Seed data generation scripts ([phase-1-1-mockdata.md](phase-1-1-mockdata.md))

- [ ] **Task 1.3.4.10:** Execute ECS seed data population (Hassan)
  - 💾 **Database:** All ECS tables ([feature-index.md](../../02-architecture/feature-index.md#ecs-module-features))
  - 🔌 **API:** Seed migration execution ([phase-1-1-mockdata.md](phase-1-1-mockdata.md))

- [ ] **Task 1.3.4.11:** Create ECS module user documentation
  - 💾 **Database:** All ECS tables ([feature-index.md](../../02-architecture/feature-index.md#ecs-module-features))
  - 🔌 **API:** All ECS RPC functions ([feature-index.md](../../02-architecture/feature-index.md#ecs-module-features))
  - 📐 **Wireframe:** All ECS wireframes ([phase-0-5-wireframes-catalog.md](../Archive for now/phase-0-5-wireframes-catalog.md))

- [ ] **Task 1.3.4.12:** Phase 1.3 internal review and sign-off
  - 💾 **Database:** All ECS tables ([feature-index.md](../../02-architecture/feature-index.md#ecs-module-features))
  - 🔌 **API:** All ECS RPC functions ([feature-index.md](../../02-architecture/feature-index.md#ecs-module-features))

### Integration Checkpoint Validation
- [ ] **Task 1.3.4.13:** Data Model Validation (Nadia) - Verify ECS schema supports CMC requirements
  - 💾 **Database:** ECS tables (export_authorizations, replenishment_schedules) for CMC integration ([feature-index.md](../../02-architecture/feature-index.md#feature-dependency-matrix))
  - 🔌 **API:** Module integration contracts ([module-integration-contracts.md](../../02-architecture/integration/module-integration-contracts.md))

- [ ] **Task 1.3.4.14:** RLS Policy Validation (Rafi) - Verify RLS policies allow CMC module access
  - 💾 **Database:** ECS tables accessible by CMC ([feature-index.md](../../02-architecture/feature-index.md#feature-dependency-matrix))
  - 🔌 **API:** RLS policy verification ([security-architecture.md](../../02-architecture/security/security-architecture.md))

- [ ] **Task 1.3.4.15:** API Contract Validation (Maya) - Verify RPC functions provide CMC data
  - 💾 **Database:** ECS tables accessed by CMC ([feature-index.md](../../02-architecture/feature-index.md#feature-dependency-matrix))
  - 🔌 **API:** ECS RPC functions used by CMC ([module-integration-contracts.md](../../02-architecture/integration/module-integration-contracts.md))

- [ ] **Task 1.3.4.16:** Seed Data Validation (Hassan) - Verify seed data covers CMC test scenarios
  - 💾 **Database:** ECS seed data needed for CMC testing ([feature-index.md](../../02-architecture/feature-index.md#feature-dependency-matrix))
  - 🔌 **API:** Seed data validation for CMC requirements

**Gate:** Phase 1.4 (CMC) cannot start until all 4 validations pass.

---

# PHASE 1.4: CMC DEVELOPMENT (Month 5)

**Duration:** 4 weeks  
**Objective:** Build Compliance Monitoring Center module and integrate with all modules

**Prerequisites:**
- ⏳ Phase 1.1 (RMM) - **AWAITING IMPLEMENTATION** (not started)
- ⏳ Phase 1.2 (VCI) - **AWAITING IMPLEMENTATION** (not started)
- ⏳ Phase 1.3 (ECS) - **AWAITING IMPLEMENTATION** (not started)
- ⏳ ECS schema supports CMC requirements - **AWAITING IMPLEMENTATION**
- ⏳ RLS policies allow CMC module access to ECS data - **AWAITING IMPLEMENTATION**
- ⏳ API contracts provide CMC-required data - **AWAITING IMPLEMENTATION**
- ⏳ Seed data covers CMC test scenarios - **AWAITING IMPLEMENTATION**

**Success Criteria:**
- ✅ All CMC workflows functional (scoring, disputes, reports)
- ✅ Integration with all modules working correctly
- ✅ Mock compliance scenarios tested
- ✅ Internal testing passed
- ✅ Documentation complete
- ✅ Integration checkpoints validated (ready for Phase 1.5)

---

## Subphase 1.4.1: CMC Scoring Engine (Week 1)

**🔒 COMPLIANCE VALIDATION (Sami - Required Before ANY Task):**

**⚠️ STOP AUTHORITY:** Sami (Implementation Compliance Specialist) has **MANDATORY STOP AUTHORITY**. If ANY compliance rule is violated, implementation **MUST STOP IMMEDIATELY**. No exceptions.

**Before starting ANY task in this subphase, the following MUST be verified and documented:**

- [ ] **Phase 1.3 Complete (MANDATORY):** All Phase 1.3 tasks are complete and all 4 integration checkpoints validated. **NO CMC TASKS CAN START UNTIL PHASE 1.3 IS COMPLETE.** Starting CMC tasks before Phase 1.3 completion is a **COMPLIANCE VIOLATION**.
- [ ] **Integration Checkpoint 1 - Data Model Validation (Nadia):** ECS schema supports CMC requirements. **VERIFIED: [Date] [Nadia's signature]**
- [ ] **Integration Checkpoint 2 - RLS Policy Validation (Rafi):** RLS policies allow CMC module access to ECS data. **VERIFIED: [Date] [Rafi's signature]**
- [ ] **Integration Checkpoint 3 - API Contract Validation (Maya):** RPC functions provide data CMC needs. **VERIFIED: [Date] [Maya's signature]**
- [ ] **Integration Checkpoint 4 - Seed Data Validation (Hassan):** Seed data covers CMC test scenarios (coordinates with Farah for realism validation). **VERIFIED: [Date] [Hassan's signature]**
- [ ] **1. Sequential Task Verification (MANDATORY):** All previous tasks from Phases 1.1, 1.2, and 1.3 are complete and checked off (`[x]`). **NO TASK CAN START UNTIL ALL PREVIOUS TASKS ARE COMPLETE.** Sami verifies this before every task. Starting a task out of sequence is a **COMPLIANCE VIOLATION**.
- [ ] **2. Role Name Verification:** Frontend role names match database schema exactly; role constants match `users.role` enum values; no hardcoded role strings (use constants).
- [ ] **3. Schema Verification:** Database schema verified before role-dependent code; all required tables/fields/RLS policies exist; Phase 0.6 schema additions incorporated where applicable.
- [ ] **4. Integration Verification:** Layout/components integrated into routes (if applicable); navigation updated (if new routes added); module routing structure updated.
- [ ] **5. Role Coverage Verification:** All 9 roles are handled where applicable (Company Admin, Company Manager, Company User, MOH Tier 1, MOH Tier 2 Officer, MOH Tier 2 Registrar, MOH Auditor, System Admin, Vendor); role variants match wireframe specifications.
- [ ] **6. Wireframe Compliance:** Wireframe reviewed before starting; wireframe task ID(s) identified; wireframe requirements understood (layout, interactions, states, role-based variations); wireframe annotations reviewed.
- [ ] **7. Data Source Verification:** NO local mock data used (NO `const mockData = [...]`, NO `mockData.ts`, NO runtime mocks); all data queries Supabase database; seed data applied if required (verify via `supabase migration list`); database tables verified before starting (use SQL queries).
- [ ] **8. Wireframe Binding:** Wireframe binding comments will be added to code (JSDoc format with wireframe link); wireframe task ID(s) documented in code comments; PR description will include wireframe link(s); wireframe binding in both PR description AND codebase.
- [ ] **9. Seed Data Gate (If Applicable):** N/A for this subphase (seed data tasks are in Subphase 1.4.4).
- [ ] **Wireframe-First Implementation Principle:** Wireframes are the PRIMARY design reference. If a wireframe doesn't exist, **STOP** and create it first. See [Compliance Rules - Wireframe-First Implementation Principle](../standards/compliance-rules.md#wireframe-first-implementation-principle) for complete requirements.
- [ ] **Sami's Compliance Checklist:** Will be used for EVERY task in this subphase. **No task proceeds without Sami's approval.**
- [ ] **Sami's Approval:** Compliance review completed and approved by Sami before task start. **MANDATORY - No task can proceed without this approval.**
- [ ] **Implementation Summary Compliance Section:** After task completion, implementation summary MUST include compliance section documenting all rules followed (see "Implementation Summary Compliance Requirement" section above). **PRs without compliance section will be REJECTED.**
- [ ] **PR Description Checklist:** See [Compliance Rules - PR Description Checklist](../standards/compliance-rules.md#pr-description-checklist-required) for the complete 9-item checklist that every frontend task PR must include.

**🚫 STOP CONDITIONS (Do Not Proceed):**

**STOP implementation and resolve before proceeding** if any of the following is true:

- **Phase 1.3 Incomplete:** Phase 1.3 integration checkpoints are not validated. **STOP** and complete Phase 1.3 first.
- **Wireframe Requirements:** No wireframe link exists for the page/route being implemented. **STOP** and request/produce the wireframe first. Do not guess layouts, flows, or states.
- **Database & Schema Requirements:** Required DB table/field/RPC does not exist yet. **STOP** and implement the missing backend task first. Do not create local mocks as a workaround.
- **Security & Access Requirements:** RLS/policies prevent required access for the wireframed role. **STOP** and implement/update RLS policies before proceeding.
- **Seed Data Requirements:** Seed migration is not idempotent (must use deterministic IDs + UPSERT patterns) or not applied. **STOP** and fix/apply migration first.
- **Sequential Execution:** Previous tasks are not complete. **STOP** and complete all prerequisite tasks first.
- **Role Name Mismatch:** Frontend role names don't match database schema. **STOP** and fix role names to match schema exactly.

**⚠️ Backend Completion Gate:** All CMC backend setup tasks (1.4.1.1-1.4.1.14) and calculation/disputes backend tasks (1.4.2.1-1.4.2.10) must be complete before frontend tasks begin. **Frontend tasks starting before backend completion is a COMPLIANCE VIOLATION.**

### CMC Backend Setup Tasks
- [ ] **Task 1.4.1.1:** Create database migration for CMC tables (compliance_scores, compliance_score_components, disputes, regulatory_reports)
  - 💾 **Database:** `compliance_scores`, `compliance_score_components`, `disputes`, `regulatory_reports` ([feature-index.md](../../02-architecture/feature-index.md#cmc-module-features))
  - 🔌 **API:** CMC table schema ([data-dictionary.md](../../02-architecture/database/data-dictionary.md))

- [ ] **Task 1.4.1.2:** Verify CMC schema completeness
  - 💾 **Database:** `compliance_scores`, `compliance_score_components`, `disputes`, `regulatory_reports` ([feature-index.md](../../02-architecture/feature-index.md#cmc-module-features))
  - 🔌 **API:** Schema verification against requirements

- [ ] **Task 1.4.1.3:** Define CMC integration points with all modules
  - 💾 **Database:** Cross-module table references (RMM, VCI, ECS tables) ([feature-index.md](../../02-architecture/feature-index.md#feature-dependency-matrix))
  - 🔌 **API:** Module integration contracts ([module-integration-contracts.md](../../02-architecture/integration/module-integration-contracts.md))

- [ ] **Task 1.4.1.4:** Implement RLS policies for CMC tables
  - 💾 **Database:** `compliance_scores`, `compliance_score_components`, `disputes`, `regulatory_reports` ([feature-index.md](../../02-architecture/feature-index.md#cmc-module-features))
  - 🔌 **API:** RLS policy implementation ([security-architecture.md](../../02-architecture/security/security-architecture.md))

- [ ] **Task 1.4.1.5:** Create CMC RPC function - Component score calculation
  - 💾 **Database:** `compliance_score_components`, cross-module data sources ([feature-index.md](../../02-architecture/feature-index.md#cmc-module-features))
  - 🔌 **API:** Component score calculation functions ([feature-index.md](../../02-architecture/feature-index.md#cmc-module-features))

- [ ] **Task 1.4.1.6:** Implement Regulatory Reporting Compliance Rate calculation
  - 💾 **Database:** VCI submission tables (`aams_submissions`, `msq_submissions`, `wsl_submissions`) ([feature-index.md](../../02-architecture/feature-index.md#cmc-module-features))
  - 🔌 **API:** Regulatory Reporting Compliance Rate calculation functions ([feature-index.md](../../02-architecture/feature-index.md#cmc-module-features))

- [ ] **Task 1.4.1.7:** Implement Stock Threshold Violation Frequency calculation
  - 💾 **Database:** `breaches`, `wsl_submissions`, `thresholds` ([feature-index.md](../../02-architecture/feature-index.md#cmc-module-features))
  - 🔌 **API:** Stock Threshold Violation Frequency calculation functions ([feature-index.md](../../02-architecture/feature-index.md#cmc-module-features))

- [ ] **Task 1.4.1.8:** Implement Replenishment Plan Adherence calculation (ECS module only, if active)
  - 💾 **Database:** `replenishment_schedules`, `export_authorizations` ([feature-index.md](../../02-architecture/feature-index.md#cmc-module-features))
  - 🔌 **API:** Replenishment Plan Adherence calculation functions ([feature-index.md](../../02-architecture/feature-index.md#cmc-module-features))

- [ ] **Task 1.4.1.9:** Implement Aggregate Non-Compliance Exposure calculation
  - 💾 **Database:** `breaches`, `enforcement_actions`, compliance data ([feature-index.md](../../02-architecture/feature-index.md#cmc-module-features))
  - 🔌 **API:** Aggregate Non-Compliance Exposure calculation functions ([feature-index.md](../../02-architecture/feature-index.md#cmc-module-features))

- [ ] **Task 1.4.1.10:** Implement Data Quality Signals calculation
  - 💾 **Database:** All module submission tables, data validation records ([feature-index.md](../../02-architecture/feature-index.md#cmc-module-features))
  - 🔌 **API:** Data Quality Signals calculation functions ([feature-index.md](../../02-architecture/feature-index.md#cmc-module-features))

- [ ] **Task 1.4.1.11:** Implement Critical Medicine Coverage calculation
  - 💾 **Database:** `critical_medicines`, `skus`, stock data ([feature-index.md](../../02-architecture/feature-index.md#cmc-module-features))
  - 🔌 **API:** Critical Medicine Coverage calculation functions ([feature-index.md](../../02-architecture/feature-index.md#cmc-module-features))

- [ ] **Task 1.4.1.12:** Implement Export Compliance calculation (ECS module only, if active)
  - 💾 **Database:** `export_authorizations`, `export_requests`, `replenishment_schedules` ([feature-index.md](../../02-architecture/feature-index.md#cmc-module-features))
  - 🔌 **API:** Export Compliance calculation functions ([feature-index.md](../../02-architecture/feature-index.md#cmc-module-features))

- [ ] **Task 1.4.1.13:** Create CMC RPC function - Total score calculation (weighted average)
  - 💾 **Database:** `compliance_scores`, `compliance_score_components` ([feature-index.md](../../02-architecture/feature-index.md#cmc-module-features))
  - 🔌 **API:** `cmc_calculate_total_score()` ([feature-index.md](../../02-architecture/feature-index.md#cmc-module-features))

- [ ] **Task 1.4.1.14:** Implement configurable component weights
  - 💾 **Database:** `compliance_score_components`, `component_weights` configuration ([feature-index.md](../../02-architecture/feature-index.md#cmc-module-features))
  - 🔌 **API:** Component weight configuration functions ([feature-index.md](../../02-architecture/feature-index.md#cmc-module-features))

---

## Subphase 1.4.2: CMC Monthly Calculation & Disputes (Week 2)

**🔒 COMPLIANCE VALIDATION (Sami - Required Before ANY Task):**

**⚠️ STOP AUTHORITY:** Sami (Implementation Compliance Specialist) has **MANDATORY STOP AUTHORITY**. If ANY compliance rule is violated, implementation **MUST STOP IMMEDIATELY**. No exceptions.

**Before starting ANY task in this subphase, the following MUST be verified and documented:**

- [ ] **1. Sequential Task Verification (MANDATORY):** All previous tasks from Subphase 1.4.1 are complete and checked off (`[x]`). **NO TASK CAN START UNTIL ALL PREVIOUS TASKS ARE COMPLETE.** Sami verifies this before every task. Starting a task out of sequence is a **COMPLIANCE VIOLATION**.
- [ ] **Subphase 1.4.1 Complete:** All CMC scoring engine tasks (1.4.1.1-1.4.1.14) are complete and verified.
- [ ] **2. Role Name Verification:** Frontend role names match database schema exactly; role constants match `users.role` enum values; no hardcoded role strings (use constants).
- [ ] **3. Schema Verification:** Database schema verified before role-dependent code; all required tables/fields/RLS policies exist; Phase 0.6 schema additions incorporated where applicable.
- [ ] **4. Integration Verification:** Layout/components integrated into routes (if applicable); navigation updated (if new routes added); module routing structure updated.
- [ ] **5. Role Coverage Verification:** All 9 roles are handled where applicable (Company Admin, Company Manager, Company User, MOH Tier 1, MOH Tier 2 Officer, MOH Tier 2 Registrar, MOH Auditor, System Admin, Vendor); role variants match wireframe specifications.
- [ ] **6. Wireframe Compliance:** Wireframe reviewed before starting; wireframe task ID(s) identified; wireframe requirements understood (layout, interactions, states, role-based variations); wireframe annotations reviewed.
- [ ] **7. Data Source Verification:** NO local mock data used (NO `const mockData = [...]`, NO `mockData.ts`, NO runtime mocks); all data queries Supabase database; seed data applied if required (verify via `supabase migration list`); database tables verified before starting (use SQL queries).
- [ ] **8. Wireframe Binding:** Wireframe binding comments will be added to code (JSDoc format with wireframe link); wireframe task ID(s) documented in code comments; PR description will include wireframe link(s); wireframe binding in both PR description AND codebase.
- [ ] **9. Seed Data Gate (If Applicable):** Seed migration `seed_1_4_2_cmc` applied and verified (see below for verification requirements); seed data acceptance criteria verified; RLS validation completed if required; seed data covers wireframe scenarios.
- [ ] **Wireframe-First Implementation Principle:** Wireframes are the PRIMARY design reference. If a wireframe doesn't exist, **STOP** and create it first. See [Compliance Rules - Wireframe-First Implementation Principle](../standards/compliance-rules.md#wireframe-first-implementation-principle) for complete requirements.
- [ ] **Sami's Compliance Checklist:** Will be used for EVERY task in this subphase. **No task proceeds without Sami's approval.**
- [ ] **Sami's Approval:** Compliance review completed and approved by Sami before task start. **MANDATORY - No task can proceed without this approval.**
- [ ] **Implementation Summary Compliance Section:** After task completion, implementation summary MUST include compliance section documenting all rules followed (see "Implementation Summary Compliance Requirement" section above). **PRs without compliance section will be REJECTED.**
- [ ] **PR Description Checklist:** See [Compliance Rules - PR Description Checklist](../standards/compliance-rules.md#pr-description-checklist-required) for the complete 9-item checklist that every frontend task PR must include.

**🚫 STOP CONDITIONS (Do Not Proceed):**

**STOP implementation and resolve before proceeding** if any of the following is true:

- **Previous Subphase Incomplete:** Subphase 1.4.1 tasks are not complete. **STOP** and complete all prerequisite tasks first.
- **Wireframe Requirements:** No wireframe link exists for the page/route being implemented. **STOP** and request/produce the wireframe first. Do not guess layouts, flows, or states.
- **Database & Schema Requirements:** Required DB table/field/RPC does not exist yet. **STOP** and implement the missing backend task first. Do not create local mocks as a workaround.
- **Security & Access Requirements:** RLS/policies prevent required access for the wireframed role. **STOP** and implement/update RLS policies before proceeding.
- **Seed Data Requirements:** Seed migration is not idempotent (must use deterministic IDs + UPSERT patterns) or not applied. **STOP** and fix/apply migration first.
- **Sequential Execution:** Previous tasks are not complete. **STOP** and complete all prerequisite tasks first.
- **Role Name Mismatch:** Frontend role names don't match database schema. **STOP** and fix role names to match schema exactly.

**Seed Data Gate (Required):**
- Before starting CMC frontend pages, apply the seed migration stage `seed_1_4_2_cmc` per [Phase 1.1 Playbook - Seed Strategy](phase-1-1-mockdata.md#seed-strategy-scenario-packs-deterministic) (versioned SQL migrations, idempotent).

### CMC Calculation Backend Tasks
- [ ] **Task 1.4.2.1:** Create CMC RPC function - Monthly score calculation
  - 💾 **Database:** `compliance_scores`, all module data sources ([feature-index.md](../../02-architecture/feature-index.md#cmc-module-features))
  - 🔌 **API:** `cmc_calculate_monthly_scores()` ([feature-index.md](../../02-architecture/feature-index.md#cmc-module-features))

- [ ] **Task 1.4.2.2:** Create scheduled trigger for monthly compliance score calculation
  - 💾 **Database:** `compliance_scores` ([feature-index.md](../../02-architecture/feature-index.md#cmc-module-features))
  - 🔌 **API:** Scheduled trigger for monthly calculation ([feature-index.md](../../02-architecture/feature-index.md#cmc-module-features))

- [ ] **Task 1.4.2.3:** Implement event-triggered score recalculation
  - 💾 **Database:** `compliance_scores`, event source tables ([feature-index.md](../../02-architecture/feature-index.md#cmc-module-features))
  - 🔌 **API:** Event-triggered recalculation functions ([feature-index.md](../../02-architecture/feature-index.md#cmc-module-features))

- [ ] **Task 1.4.2.4:** Create CMC RPC function - Score freeze
  - 💾 **Database:** `compliance_scores` ([feature-index.md](../../02-architecture/feature-index.md#cmc-module-features))
  - 🔌 **API:** `cmc_freeze_score()` ([feature-index.md](../../02-architecture/feature-index.md#cmc-module-features))

- [ ] **Task 1.4.2.5:** Create CMC RPC function - Tier 2 review flag
  - 💾 **Database:** `compliance_scores` ([feature-index.md](../../02-architecture/feature-index.md#cmc-module-features))
  - 🔌 **API:** `cmc_flag_for_review()` ([feature-index.md](../../02-architecture/feature-index.md#cmc-module-features))

- [ ] **Task 1.4.2.6:** Create CMC RPC function - Tier 1 score override
  - 💾 **Database:** `compliance_scores`, `score_overrides` ([feature-index.md](../../02-architecture/feature-index.md#cmc-module-features))
  - 🔌 **API:** `cmc_override_compliance_score()` ([feature-index.md](../../02-architecture/feature-index.md#cmc-module-features))

- [ ] **Task 1.4.2.7:** Implement adjustment notes system
  - 💾 **Database:** `compliance_scores`, `adjustment_notes` ([feature-index.md](../../02-architecture/feature-index.md#cmc-module-features))
  - 🔌 **API:** Adjustment notes functions ([feature-index.md](../../02-architecture/feature-index.md#cmc-module-features))

- [ ] **Task 1.4.2.8:** Create CMC RPC function - Dispute creation
  - 💾 **Database:** `compliance_disputes`, `dispute_evidence` ([feature-index.md](../../02-architecture/feature-index.md#cmc-module-features))
  - 🔌 **API:** `cmc_create_dispute()`, `cmc_submit_dispute()` ([feature-index.md](../../02-architecture/feature-index.md#cmc-module-features))

- [ ] **Task 1.4.2.9:** Create CMC RPC function - Dispute review
  - 💾 **Database:** `compliance_disputes` ([feature-index.md](../../02-architecture/feature-index.md#cmc-module-features))
  - 🔌 **API:** `cmc_review_dispute()` ([feature-index.md](../../02-architecture/feature-index.md#cmc-module-features))

- [ ] **Task 1.4.2.10:** Create CMC RPC function - Dispute resolution
  - 💾 **Database:** `compliance_disputes`, `compliance_scores` (potential score adjustments) ([feature-index.md](../../02-architecture/feature-index.md#cmc-module-features))
  - 🔌 **API:** `cmc_resolve_dispute()` ([feature-index.md](../../02-architecture/feature-index.md#cmc-module-features))

### CMC Frontend Tasks
- [ ] **Task 1.4.2.11:** Create CMC module layout and navigation
  - 📐 **Wireframe:** [task-0.5.1.14](../../04-design/user-experience/wireframes/00-core-foundation/layout-navigation/task-0.5.1.14-dashboard-layout-structure.md), [task-0.5.1.16](../../04-design/user-experience/wireframes/00-core-foundation/layout-navigation/task-0.5.1.16-sidebar-navigation.md)
  - 🛣️ **Route:** `/cmc` layout ([routing-structure.md](../../02-architecture/frontend/routing-structure.md#cmc-routes))
  - 💾 **Database:** `users`, `system_config` ([feature-index.md](../../02-architecture/feature-index.md#cmc-module-features))
  - 🔌 **API:** `shared_get_user_permissions()` ([feature-index.md](../../02-architecture/feature-index.md#cmc-module-features))

- [ ] **Task 1.4.2.12:** Implement Compliance scores list page
  - 📐 **Wireframe:** [task-0.5.5.1](../../04-design/user-experience/wireframes/04-cmc/scores/task-0.5.5.1-compliance-scores-list.md)
  - 🛣️ **Route:** `/cmc/scores` ([routing-structure.md](../../02-architecture/frontend/routing-structure.md#cmc-routes))
  - 💾 **Database:** `compliance_scores` ([feature-index.md](../../02-architecture/feature-index.md#cmc-module-features))
  - 🔌 **API:** `cmc_list_compliance_scores()`, `cmc_get_compliance_score()` ([feature-index.md](../../02-architecture/feature-index.md#cmc-module-features))

- [ ] **Task 1.4.2.13:** Implement Compliance score detail page
  - 📐 **Wireframe:** [task-0.5.5.2](../../04-design/user-experience/wireframes/04-cmc/scores/task-0.5.5.2-compliance-score-detail.md)
  - 🛣️ **Route:** `/cmc/scores/[id]` ([routing-structure.md](../../02-architecture/frontend/routing-structure.md#cmc-routes))
  - 💾 **Database:** `compliance_scores`, `compliance_score_components` ([feature-index.md](../../02-architecture/feature-index.md#cmc-module-features))
  - 🔌 **API:** `cmc_get_compliance_score()`, `cmc_get_score_breakdown()` ([feature-index.md](../../02-architecture/feature-index.md#cmc-module-features))

- [ ] **Task 1.4.2.14:** Implement Score override interface (Tier 1)
  - 📐 **Wireframe:** [task-0.5.5.5](../../04-design/user-experience/wireframes/04-cmc/scores/task-0.5.5.5-score-review-tier1-override.md)
  - 🛣️ **Route:** Modal on score detail page ([routing-structure.md](../../02-architecture/frontend/routing-structure.md#cmc-routes))
  - 💾 **Database:** `compliance_scores`, `score_overrides` ([feature-index.md](../../02-architecture/feature-index.md#cmc-module-features))
  - 🔌 **API:** `cmc_override_compliance_score()` ([feature-index.md](../../02-architecture/feature-index.md#cmc-module-features))

- [ ] **Task 1.4.2.15:** Implement Dispute creation form (Company users)
  - 📐 **Wireframe:** [task-0.5.5.8](../../04-design/user-experience/wireframes/04-cmc/disputes/task-0.5.5.8-dispute-creation-interface.md)
  - 🛣️ **Route:** `/cmc/disputes/new` ([routing-structure.md](../../02-architecture/frontend/routing-structure.md#cmc-routes))
  - 💾 **Database:** `compliance_disputes`, `dispute_evidence` ([feature-index.md](../../02-architecture/feature-index.md#cmc-module-features))
  - 🔌 **API:** `cmc_create_dispute()`, `cmc_submit_dispute()` ([feature-index.md](../../02-architecture/feature-index.md#cmc-module-features))

- [ ] **Task 1.4.2.16:** Implement Dispute review interface (MOH)
  - 📐 **Wireframe:** [task-0.5.5.9](../../04-design/user-experience/wireframes/04-cmc/disputes/task-0.5.5.9-dispute-review-interface.md)
  - 🛣️ **Route:** `/cmc/disputes/[id]/review` ([routing-structure.md](../../02-architecture/frontend/routing-structure.md#cmc-routes))
  - 💾 **Database:** `compliance_disputes`, `dispute_resolutions` ([feature-index.md](../../02-architecture/feature-index.md#cmc-module-features))
  - 🔌 **API:** `cmc_review_dispute()`, `cmc_resolve_dispute()` ([feature-index.md](../../02-architecture/feature-index.md#cmc-module-features))

---

## Subphase 1.4.3: CMC Reports & Integration (Week 3)

**🔒 COMPLIANCE VALIDATION (Sami - Required Before ANY Task):**

**⚠️ STOP AUTHORITY:** Sami (Implementation Compliance Specialist) has **MANDATORY STOP AUTHORITY**. If ANY compliance rule is violated, implementation **MUST STOP IMMEDIATELY**. No exceptions.

**Before starting ANY task in this subphase, the following MUST be verified and documented:**

- [ ] **1. Sequential Task Verification (MANDATORY):** All previous tasks from Subphases 1.4.1 and 1.4.2 are complete and checked off (`[x]`). **NO TASK CAN START UNTIL ALL PREVIOUS TASKS ARE COMPLETE.** Sami verifies this before every task. Starting a task out of sequence is a **COMPLIANCE VIOLATION**.
- [ ] **Subphase 1.4.2 Complete:** All CMC monthly calculation and disputes tasks (1.4.2.1-1.4.2.16) are complete and verified.
- [ ] **2. Role Name Verification:** Frontend role names match database schema exactly; role constants match `users.role` enum values; no hardcoded role strings (use constants).
- [ ] **3. Schema Verification:** Database schema verified before role-dependent code; all required tables/fields/RLS policies exist; Phase 0.6 schema additions incorporated where applicable.
- [ ] **4. Integration Verification:** Layout/components integrated into routes (if applicable); navigation updated (if new routes added); module routing structure updated.
- [ ] **5. Role Coverage Verification:** All 9 roles are handled where applicable (Company Admin, Company Manager, Company User, MOH Tier 1, MOH Tier 2 Officer, MOH Tier 2 Registrar, MOH Auditor, System Admin, Vendor); role variants match wireframe specifications.
- [ ] **6. Wireframe Compliance:** Wireframe reviewed before starting; wireframe task ID(s) identified; wireframe requirements understood (layout, interactions, states, role-based variations); wireframe annotations reviewed.
- [ ] **7. Data Source Verification:** NO local mock data used (NO `const mockData = [...]`, NO `mockData.ts`, NO runtime mocks); all data queries Supabase database; seed data applied if required (verify via `supabase migration list`); database tables verified before starting (use SQL queries).
- [ ] **8. Wireframe Binding:** Wireframe binding comments will be added to code (JSDoc format with wireframe link); wireframe task ID(s) documented in code comments; PR description will include wireframe link(s); wireframe binding in both PR description AND codebase.
- [ ] **9. Seed Data Gate (If Applicable):** N/A for this subphase (seed data tasks are in Subphase 1.4.4).
- [ ] **Wireframe-First Implementation Principle:** Wireframes are the PRIMARY design reference. If a wireframe doesn't exist, **STOP** and create it first. See [Compliance Rules - Wireframe-First Implementation Principle](../standards/compliance-rules.md#wireframe-first-implementation-principle) for complete requirements.
- [ ] **Sami's Compliance Checklist:** Will be used for EVERY task in this subphase. **No task proceeds without Sami's approval.**
- [ ] **Sami's Approval:** Compliance review completed and approved by Sami before task start. **MANDATORY - No task can proceed without this approval.**
- [ ] **Implementation Summary Compliance Section:** After task completion, implementation summary MUST include compliance section documenting all rules followed (see "Implementation Summary Compliance Requirement" section above). **PRs without compliance section will be REJECTED.**
- [ ] **PR Description Checklist:** See [Compliance Rules - PR Description Checklist](../standards/compliance-rules.md#pr-description-checklist-required) for the complete 9-item checklist that every frontend task PR must include.

**🚫 STOP CONDITIONS (Do Not Proceed):**

**STOP implementation and resolve before proceeding** if any of the following is true:

- **Previous Subphase Incomplete:** Subphase 1.4.2 tasks are not complete. **STOP** and complete all prerequisite tasks first.
- **Wireframe Requirements:** No wireframe link exists for the page/route being implemented. **STOP** and request/produce the wireframe first. Do not guess layouts, flows, or states.
- **Database & Schema Requirements:** Required DB table/field/RPC does not exist yet. **STOP** and implement the missing backend task first. Do not create local mocks as a workaround.
- **Security & Access Requirements:** RLS/policies prevent required access for the wireframed role. **STOP** and implement/update RLS policies before proceeding.
- **Seed Data Requirements:** Seed migration is not idempotent (must use deterministic IDs + UPSERT patterns) or not applied. **STOP** and fix/apply migration first.
- **Sequential Execution:** Previous tasks are not complete. **STOP** and complete all prerequisite tasks first.
- **Role Name Mismatch:** Frontend role names don't match database schema. **STOP** and fix role names to match schema exactly.

### CMC Reports Backend Tasks
- [ ] **Task 1.4.3.1:** Create CMC RPC function - Generate regulatory report
  - 💾 **Database:** `regulatory_reports`, `compliance_scores`, all module data ([feature-index.md](../../02-architecture/feature-index.md#cmc-module-features))
  - 🔌 **API:** `cmc_generate_regulatory_report()` ([feature-index.md](../../02-architecture/feature-index.md#cmc-module-features))

- [ ] **Task 1.4.3.2:** Create scheduled trigger for report generation
  - 💾 **Database:** `regulatory_reports` ([feature-index.md](../../02-architecture/feature-index.md#cmc-module-features))
  - 🔌 **API:** Scheduled trigger for report generation ([feature-index.md](../../02-architecture/feature-index.md#cmc-module-features))

- [ ] **Task 1.4.3.3:** Implement report analytics calculations
  - 💾 **Database:** `compliance_scores`, `regulatory_reports`, aggregated data ([feature-index.md](../../02-architecture/feature-index.md#cmc-module-features))
  - 🔌 **API:** Report analytics calculation functions ([feature-index.md](../../02-architecture/feature-index.md#cmc-module-features))

- [ ] **Task 1.4.3.4:** Create CMC RPC function - Report review workflow
  - 💾 **Database:** `regulatory_reports`, `approval_history` ([feature-index.md](../../02-architecture/feature-index.md#cmc-module-features))
  - 🔌 **API:** Report review workflow functions ([feature-index.md](../../02-architecture/feature-index.md#cmc-module-features))

### CMC Reports Frontend Tasks
- [ ] **Task 1.4.3.5:** Implement Regulatory reports list page
  - 📐 **Wireframe:** [task-0.5.5.10](../../04-design/user-experience/wireframes/04-cmc/reports/task-0.5.5.10-reports-list.md)
  - 🛣️ **Route:** `/cmc/reports` ([routing-structure.md](../../02-architecture/frontend/routing-structure.md#cmc-routes))
  - 💾 **Database:** `regulatory_reports` ([feature-index.md](../../02-architecture/feature-index.md#cmc-module-features))
  - 🔌 **API:** `cmc_list_reports()`, `cmc_generate_report()` ([feature-index.md](../../02-architecture/feature-index.md#cmc-module-features))

- [ ] **Task 1.4.3.6:** Implement Regulatory report detail page
  - 📐 **Wireframe:** [task-0.5.5.11](../../04-design/user-experience/wireframes/04-cmc/reports/task-0.5.5.11-report-detail.md)
  - 🛣️ **Route:** `/cmc/reports/[id]` ([routing-structure.md](../../02-architecture/frontend/routing-structure.md#cmc-routes))
  - 💾 **Database:** `regulatory_reports` ([feature-index.md](../../02-architecture/feature-index.md#cmc-module-features))
  - 🔌 **API:** `cmc_get_report()`, `cmc_download_report()` ([feature-index.md](../../02-architecture/feature-index.md#cmc-module-features))

- [ ] **Task 1.4.3.7:** Implement Report review interface (Tier 2 → Tier 1)
  - 📐 **Wireframe:** [task-0.5.5.12](../../04-design/user-experience/wireframes/04-cmc/reports/task-0.5.5.12-report-review-approval-interface.md)
  - 🛣️ **Route:** `/cmc/reports/[id]/review` ([routing-structure.md](../../02-architecture/frontend/routing-structure.md#cmc-routes))
  - 💾 **Database:** `regulatory_reports`, `approval_history` ([feature-index.md](../../02-architecture/feature-index.md#cmc-module-features))
  - 🔌 **API:** `cmc_review_report()`, `cmc_approve_report()` ([feature-index.md](../../02-architecture/feature-index.md#cmc-module-features))

- [ ] **Task 1.4.3.8:** Implement Governance dashboard analytics (MOH Tier 1)
  - 📐 **Wireframe:** CMC overview dashboard (see [CMC overview wireframe](../../04-design/user-experience/wireframes/04-cmc/overview/task-0.5.5.0-cmc-overview.md))
  - 🛣️ **Route:** `/cmc` dashboard ([routing-structure.md](../../02-architecture/frontend/routing-structure.md#cmc-routes))
  - 💾 **Database:** `compliance_scores`, `compliance_disputes`, `regulatory_reports` ([feature-index.md](../../02-architecture/feature-index.md#cmc-module-features))
  - 🔌 **API:** `cmc_get_overview_stats()` ([feature-index.md](../../02-architecture/feature-index.md#cmc-module-features))

- [ ] **Task 1.4.3.9:** Implement CMC Compliance scores history page
  - 📐 **Wireframe:** [task-0.5.5.13](../../04-design/user-experience/wireframes/04-cmc/history/task-0.5.5.13-compliance-scores-history.md)
  - 🛣️ **Route:** `/cmc/scores/history` ([routing-structure.md](../../02-architecture/frontend/routing-structure.md#historical-data-routes))
  - 💾 **Database:** `compliance_scores` ([feature-index.md](../../02-architecture/feature-index.md#cmc-module-features))
  - 🔌 **API:** `cmc_get_score_history()` ([feature-index.md](../../02-architecture/feature-index.md#cmc-module-features))

- [ ] **Task 1.4.3.10:** Implement CMC Compliance disputes history page
  - 📐 **Wireframe:** [task-0.5.5.14](../../04-design/user-experience/wireframes/04-cmc/history/task-0.5.5.14-compliance-disputes-history.md)
  - 🛣️ **Route:** `/cmc/disputes/history` ([routing-structure.md](../../02-architecture/frontend/routing-structure.md#historical-data-routes))
  - 💾 **Database:** `compliance_disputes` ([feature-index.md](../../02-architecture/feature-index.md#cmc-module-features))
  - 🔌 **API:** `cmc_get_dispute_history()` ([feature-index.md](../../02-architecture/feature-index.md#cmc-module-features))

---

## Subphase 1.4.4: CMC Testing & Seed Data (Week 4)

**🔒 COMPLIANCE VALIDATION (Sami - Required Before ANY Task):**

**⚠️ STOP AUTHORITY:** Sami (Implementation Compliance Specialist) has **MANDATORY STOP AUTHORITY**. If ANY compliance rule is violated, implementation **MUST STOP IMMEDIATELY**. No exceptions.

**Before starting ANY task in this subphase, the following MUST be verified and documented:**

- [ ] **1. Sequential Task Verification (MANDATORY):** All previous tasks from Subphases 1.4.1, 1.4.2, and 1.4.3 are complete and checked off (`[x]`). **NO TASK CAN START UNTIL ALL PREVIOUS TASKS ARE COMPLETE.** Sami verifies this before every task. Starting a task out of sequence is a **COMPLIANCE VIOLATION**.
- [ ] **Subphase 1.4.3 Complete:** All CMC reports and integration tasks (1.4.3.1-1.4.3.10) are complete and verified.
- [ ] **2. Role Name Verification:** Frontend role names match database schema exactly; role constants match `users.role` enum values; no hardcoded role strings (use constants).
- [ ] **3. Schema Verification:** Database schema verified before role-dependent code; all required tables/fields/RLS policies exist; Phase 0.6 schema additions incorporated where applicable.
- [ ] **4. Integration Verification:** Layout/components integrated into routes (if applicable); navigation updated (if new routes added); module routing structure updated.
- [ ] **5. Role Coverage Verification:** All 9 roles are handled where applicable (Company Admin, Company Manager, Company User, MOH Tier 1, MOH Tier 2 Officer, MOH Tier 2 Registrar, MOH Auditor, System Admin, Vendor); role variants match wireframe specifications.
- [ ] **6. Wireframe Compliance:** Wireframe reviewed before starting; wireframe task ID(s) identified; wireframe requirements understood (layout, interactions, states, role-based variations); wireframe annotations reviewed.
- [ ] **7. Data Source Verification:** NO local mock data used (NO `const mockData = [...]`, NO `mockData.ts`, NO runtime mocks); all data queries Supabase database; seed data applied if required (verify via `supabase migration list`); database tables verified before starting (use SQL queries).
- [ ] **8. Wireframe Binding:** Wireframe binding comments will be added to code (JSDoc format with wireframe link); wireframe task ID(s) documented in code comments; PR description will include wireframe link(s); wireframe binding in both PR description AND codebase.
- [ ] **9. Seed Data Gate (If Applicable):** N/A for this subphase (seed data tasks are part of this subphase).
- [ ] **Wireframe-First Implementation Principle:** Wireframes are the PRIMARY design reference. If a wireframe doesn't exist, **STOP** and create it first. See [Compliance Rules - Wireframe-First Implementation Principle](../standards/compliance-rules.md#wireframe-first-implementation-principle) for complete requirements.
- [ ] **Sami's Compliance Checklist:** Will be used for EVERY task in this subphase. **No task proceeds without Sami's approval.**
- [ ] **Sami's Approval:** Compliance review completed and approved by Sami before task start. **MANDATORY - No task can proceed without this approval.**
- [ ] **Implementation Summary Compliance Section:** After task completion, implementation summary MUST include compliance section documenting all rules followed (see "Implementation Summary Compliance Requirement" section above). **PRs without compliance section will be REJECTED.**
- [ ] **PR Description Checklist:** See [Compliance Rules - PR Description Checklist](../standards/compliance-rules.md#pr-description-checklist-required) for the complete 9-item checklist that every frontend task PR must include.

**🚫 STOP CONDITIONS (Do Not Proceed):**

**STOP implementation and resolve before proceeding** if any of the following is true:

- **Previous Subphase Incomplete:** Subphase 1.4.3 tasks are not complete. **STOP** and complete all prerequisite tasks first.
- **Backend Not Complete:** CMC backend RPC functions are not implemented. **STOP** and implement backend first.
- **Frontend Not Complete:** CMC frontend pages are not implemented. **STOP** and implement frontend first.
- **Wireframe Requirements:** No wireframe link exists for the page/route being implemented. **STOP** and request/produce the wireframe first. Do not guess layouts, flows, or states.
- **Database & Schema Requirements:** Required DB table/field/RPC does not exist yet. **STOP** and implement the missing backend task first. Do not create local mocks as a workaround.
- **Security & Access Requirements:** RLS/policies prevent required access for the wireframed role. **STOP** and implement/update RLS policies before proceeding.
- **Seed Data Requirements:** Seed migration is not idempotent (must use deterministic IDs + UPSERT patterns) or not applied. **STOP** and fix/apply migration first.
- **Role Name Mismatch:** Frontend role names don't match database schema. **STOP** and fix role names to match schema exactly.

### CMC Testing Tasks
- [ ] **Task 1.4.4.1:** Create CMC module test suite (unit tests for RPC functions)
  - 💾 **Database:** All CMC tables (compliance_scores, compliance_score_components, disputes, regulatory_reports) ([feature-index.md](../../02-architecture/feature-index.md#cmc-module-features))
  - 🔌 **API:** All CMC RPC functions ([feature-index.md](../../02-architecture/feature-index.md#cmc-module-features))

- [ ] **Task 1.4.4.2:** Create integration tests - CMC workflow (monthly calculation → dispute → resolution)
  - 💾 **Database:** `compliance_scores`, `compliance_score_components`, `disputes` ([feature-index.md](../../02-architecture/feature-index.md#cmc-module-features))
  - 🔌 **API:** CMC workflow RPC functions ([feature-index.md](../../02-architecture/feature-index.md#cmc-module-features))

- [ ] **Task 1.4.4.3:** Create integration tests - Cross-module score impact (ECS export → CMC score)
  - 💾 **Database:** `export_authorizations`, `compliance_scores` ([feature-index.md](../../02-architecture/feature-index.md#cmc-module-features))
  - 🔌 **API:** Cross-module integration functions ([module-integration-contracts.md](../../02-architecture/integration/module-integration-contracts.md))

- [ ] **Task 1.4.4.4:** Create integration tests - Event-triggered recalculation
  - 💾 **Database:** `compliance_scores`, event source tables ([feature-index.md](../../02-architecture/feature-index.md#cmc-module-features))
  - 🔌 **API:** Event-triggered recalculation functions ([feature-index.md](../../02-architecture/feature-index.md#cmc-module-features))

### Seed Data Tasks (Hassan - Full Ownership)
- [ ] **Task 1.4.4.5:** Create seed data generation script - Compliance scores (Hassan)
  - 💾 **Database:** `compliance_scores`, `compliance_score_components` ([feature-index.md](../../02-architecture/feature-index.md#cmc-module-features))
  - 🔌 **API:** Seed data generation scripts ([phase-1-1-mockdata.md](phase-1-1-mockdata.md))

- [ ] **Task 1.4.4.6:** Create seed data generation script - Disputes (Hassan)
  - 💾 **Database:** `disputes`, `dispute_evidence` ([feature-index.md](../../02-architecture/feature-index.md#cmc-module-features))
  - 🔌 **API:** Seed data generation scripts ([phase-1-1-mockdata.md](phase-1-1-mockdata.md))

- [ ] **Task 1.4.4.7:** Create seed data generation script - Regulatory reports (Hassan)
  - 💾 **Database:** `regulatory_reports` ([feature-index.md](../../02-architecture/feature-index.md#cmc-module-features))
  - 🔌 **API:** Seed data generation scripts ([phase-1-1-mockdata.md](phase-1-1-mockdata.md))

- [ ] **Task 1.4.4.8:** Execute CMC seed data population (Hassan)
  - 💾 **Database:** All CMC tables ([feature-index.md](../../02-architecture/feature-index.md#cmc-module-features))
  - 🔌 **API:** Seed migration execution ([phase-1-1-mockdata.md](phase-1-1-mockdata.md))

- [ ] **Task 1.4.4.9:** Validate seed data (Hassan - full ownership; coordinates with Nadia for integrity, Farah for realism)
  - 💾 **Database:** All CMC tables ([feature-index.md](../../02-architecture/feature-index.md#cmc-module-features))
  - 🔌 **API:** Seed data validation scripts

### Documentation Tasks
- [ ] **Task 1.4.4.10:** Create CMC module user documentation
  - 💾 **Database:** All CMC tables ([feature-index.md](../../02-architecture/feature-index.md#cmc-module-features))
  - 🔌 **API:** All CMC RPC functions ([feature-index.md](../../02-architecture/feature-index.md#cmc-module-features))
  - 📐 **Wireframe:** All CMC wireframes ([phase-0-5-wireframes-catalog.md](../Archive for now/phase-0-5-wireframes-catalog.md))

- [ ] **Task 1.4.4.11:** Phase 1.4 internal review and sign-off
  - 💾 **Database:** All CMC tables ([feature-index.md](../../02-architecture/feature-index.md#cmc-module-features))
  - 🔌 **API:** All CMC RPC functions ([feature-index.md](../../02-architecture/feature-index.md#cmc-module-features))

---

# PHASE 1.5: HOLISTIC MVP TESTING (Month 6)

**Duration:** 4 weeks  
**Objective:** End-to-end integration testing, performance validation, security audit, and customer presentation preparation

**Prerequisites:**
- ⏳ Phase 1.1 (RMM) - **AWAITING IMPLEMENTATION** (not started)
- ⏳ Phase 1.2 (VCI) - **AWAITING IMPLEMENTATION** (not started)
- ⏳ Phase 1.3 (ECS) - **AWAITING IMPLEMENTATION** (not started)
- ⏳ Phase 1.4 (CMC) - **AWAITING IMPLEMENTATION** (not started)

**Success Criteria:**
- ✅ All modules working together correctly
- ✅ Performance targets met
- ✅ Security requirements validated
- ✅ Customer presentation materials ready
- ✅ System ready for MOH UAT

---

## Subphase 1.5.1: End-to-End Integration Testing (Week 1)

**🔒 COMPLIANCE VALIDATION (Sami - Required Before ANY Task):**

**⚠️ STOP AUTHORITY:** Sami (Implementation Compliance Specialist) has **MANDATORY STOP AUTHORITY**. If ANY compliance rule is violated, implementation **MUST STOP IMMEDIATELY**. No exceptions.

**Before starting ANY task in this subphase, the following MUST be verified and documented:**

- [ ] **Phase 1.4 Complete (MANDATORY):** All Phase 1.4 tasks are complete. **NO HOLISTIC TESTING TASKS CAN START UNTIL PHASE 1.4 IS COMPLETE.** Starting Phase 1.5 tasks before Phase 1.4 completion is a **COMPLIANCE VIOLATION**.
- [ ] **Phase 1.4 Integration Validation:** All Phase 1.4 integration checkpoints validated (Phase 1.4 is final module, no downstream dependencies). **VERIFIED: [Date] [Sami's signature]**
- [ ] **1. Sequential Task Verification (MANDATORY):** All previous tasks from Phases 1.1, 1.2, 1.3, and 1.4 are complete and checked off (`[x]`). **NO TASK CAN START UNTIL ALL PREVIOUS TASKS ARE COMPLETE.** Sami verifies this before every task. Starting a task out of sequence is a **COMPLIANCE VIOLATION**.
- [ ] **2. Role Name Verification:** Frontend role names match database schema exactly; role constants match `users.role` enum values; no hardcoded role strings (use constants).
- [ ] **3. Schema Verification:** Database schema verified before role-dependent code; all required tables/fields/RLS policies exist; Phase 0.6 schema additions incorporated where applicable.
- [ ] **4. Integration Verification:** Layout/components integrated into routes (if applicable); navigation updated (if new routes added); module routing structure updated.
- [ ] **5. Role Coverage Verification:** All 9 roles are handled where applicable (Company Admin, Company Manager, Company User, MOH Tier 1, MOH Tier 2 Officer, MOH Tier 2 Registrar, MOH Auditor, System Admin, Vendor); role variants match wireframe specifications.
- [ ] **6. Wireframe Compliance:** Wireframe reviewed before starting; wireframe task ID(s) identified; wireframe requirements understood (layout, interactions, states, role-based variations); wireframe annotations reviewed.
- [ ] **7. Data Source Verification:** NO local mock data used (NO `const mockData = [...]`, NO `mockData.ts`, NO runtime mocks); all data queries Supabase database; seed data applied if required (verify via `supabase migration list`); database tables verified before starting (use SQL queries).
- [ ] **8. Wireframe Binding:** Wireframe binding comments will be added to code (JSDoc format with wireframe link); wireframe task ID(s) documented in code comments; PR description will include wireframe link(s); wireframe binding in both PR description AND codebase.
- [ ] **9. Seed Data Gate (If Applicable):** N/A for this subphase - Testing phase uses existing seeded data from previous phases (RMM, VCI, ECS, CMC seed data already applied).
- [ ] **Wireframe-First Implementation Principle:** Wireframes are the PRIMARY design reference. If a wireframe doesn't exist, **STOP** and create it first. See [Compliance Rules - Wireframe-First Implementation Principle](../standards/compliance-rules.md#wireframe-first-implementation-principle) for complete requirements.
- [ ] **Sami's Compliance Checklist:** Will be used for EVERY task in this subphase. **No task proceeds without Sami's approval.**
- [ ] **Sami's Approval:** Compliance review completed and approved by Sami before task start. **MANDATORY - No task can proceed without this approval.**
- [ ] **Implementation Summary Compliance Section:** After task completion, implementation summary MUST include compliance section documenting all rules followed (see "Implementation Summary Compliance Requirement" section above). **PRs without compliance section will be REJECTED.**
- [ ] **PR Description Checklist:** See [Compliance Rules - PR Description Checklist](../standards/compliance-rules.md#pr-description-checklist-required) for the complete 9-item checklist that every frontend task PR must include.

**🚫 STOP CONDITIONS (Do Not Proceed):**

**STOP implementation and resolve before proceeding** if any of the following is true:

- **Phase 1.4 Incomplete:** Phase 1.4 tasks are not complete. **STOP** and complete Phase 1.4 first.
- **All Modules Not Complete:** Any module (RMM, VCI, ECS, CMC) is not fully implemented. **STOP** and complete all modules first.
- **Wireframe Requirements:** No wireframe link exists for the page/route being implemented. **STOP** and request/produce the wireframe first. Do not guess layouts, flows, or states.
- **Database & Schema Requirements:** Required DB table/field/RPC does not exist yet. **STOP** and implement the missing backend task first. Do not create local mocks as a workaround.
- **Security & Access Requirements:** RLS/policies prevent required access for the wireframed role. **STOP** and implement/update RLS policies before proceeding.
- **Seed Data Requirements:** Seed migration is not idempotent (must use deterministic IDs + UPSERT patterns) or not applied. **STOP** and fix/apply migration first.
- **Sequential Execution:** Previous tasks are not complete. **STOP** and complete all prerequisite tasks first.
- **Role Name Mismatch:** Frontend role names don't match database schema. **STOP** and fix role names to match schema exactly.

### Integration Testing Tasks
- [ ] **Task 1.5.1.1:** Create end-to-end test scenarios - Complete RMM workflow
  - 💾 **Database:** All RMM tables ([feature-index.md](../../02-architecture/feature-index.md#rmm-module-features))
  - 🔌 **API:** All RMM RPC functions ([feature-index.md](../../02-architecture/feature-index.md#rmm-module-features))

- [ ] **Task 1.5.1.2:** Create end-to-end test scenarios - Complete VCI workflow
  - 💾 **Database:** All VCI tables ([feature-index.md](../../02-architecture/feature-index.md#vci-module-features))
  - 🔌 **API:** All VCI RPC functions ([feature-index.md](../../02-architecture/feature-index.md#vci-module-features))

- [ ] **Task 1.5.1.3:** Create end-to-end test scenarios - Complete ECS workflow
  - 💾 **Database:** All ECS tables ([feature-index.md](../../02-architecture/feature-index.md#ecs-module-features))
  - 🔌 **API:** All ECS RPC functions ([feature-index.md](../../02-architecture/feature-index.md#ecs-module-features))

- [ ] **Task 1.5.1.4:** Create end-to-end test scenarios - Complete CMC workflow
  - 💾 **Database:** All CMC tables ([feature-index.md](../../02-architecture/feature-index.md#cmc-module-features))
  - 🔌 **API:** All CMC RPC functions ([feature-index.md](../../02-architecture/feature-index.md#cmc-module-features))

- [ ] **Task 1.5.1.5:** Create cross-module test scenarios - ECS export → CMC score impact
  - 💾 **Database:** `export_authorizations`, `compliance_scores` ([feature-index.md](../../02-architecture/feature-index.md#feature-dependency-matrix))
  - 🔌 **API:** Cross-module integration functions ([module-integration-contracts.md](../../02-architecture/integration/module-integration-contracts.md))

- [ ] **Task 1.5.1.6:** Create cross-module test scenarios - CMC score → ECS conditional validation
  - 💾 **Database:** `compliance_scores`, `export_requests` ([feature-index.md](../../02-architecture/feature-index.md#feature-dependency-matrix))
  - 🔌 **API:** Cross-module integration functions ([module-integration-contracts.md](../../02-architecture/integration/module-integration-contracts.md))

- [ ] **Task 1.5.1.7:** Create cross-module test scenarios - ECS authorization → VCI threshold switching
  - 💾 **Database:** `export_authorizations`, `thresholds` ([feature-index.md](../../02-architecture/feature-index.md#feature-dependency-matrix))
  - 🔌 **API:** Threshold switching functions ([module-integration-contracts.md](../../02-architecture/integration/module-integration-contracts.md))

- [ ] **Task 1.5.1.8:** Create cross-module test scenarios - VCI breach → CMC score impact
  - 💾 **Database:** `breaches`, `compliance_scores` ([feature-index.md](../../02-architecture/feature-index.md#feature-dependency-matrix))
  - 🔌 **API:** Cross-module integration functions ([module-integration-contracts.md](../../02-architecture/integration/module-integration-contracts.md))

- [ ] **Task 1.5.1.9:** Test data flows between all modules
  - 💾 **Database:** All module tables ([feature-index.md](../../02-architecture/feature-index.md#feature-dependency-matrix))
  - 🔌 **API:** Module integration contracts ([module-integration-contracts.md](../../02-architecture/integration/module-integration-contracts.md))

- [ ] **Task 1.5.1.10:** Test module activation/deactivation scenarios
  - 💾 **Database:** All module tables ([feature-index.md](../../02-architecture/feature-index.md))
  - 🔌 **API:** Module activation/deactivation functions

- [ ] **Task 1.5.1.11:** Test all scheduled triggers
  - 💾 **Database:** All tables with scheduled triggers ([feature-index.md](../../02-architecture/feature-index.md))
  - 🔌 **API:** Scheduled trigger functions

- [ ] **Task 1.5.1.12:** Test module activation sequence (RMM→VCI→ECS→CMC dependency chain)
  - 💾 **Database:** All module tables ([feature-index.md](../../02-architecture/feature-index.md#feature-dependency-matrix))
  - 🔌 **API:** Module integration contracts ([module-integration-contracts.md](../../02-architecture/integration/module-integration-contracts.md))

- [ ] **Task 1.5.1.13:** Test module deactivation impact
  - 💾 **Database:** All module tables ([feature-index.md](../../02-architecture/feature-index.md))
  - 🔌 **API:** Module deactivation impact functions

- [ ] **Task 1.5.1.14:** Test cross-module workflow dependencies
  - 💾 **Database:** All module tables ([feature-index.md](../../02-architecture/feature-index.md#feature-dependency-matrix))
  - 🔌 **API:** Cross-module workflow functions ([module-integration-contracts.md](../../02-architecture/integration/module-integration-contracts.md))

- [ ] **Task 1.5.1.15:** Create test data cleanup strategy
  - 💾 **Database:** All module tables ([feature-index.md](../../02-architecture/feature-index.md))
  - 🔌 **API:** Test data management functions

---

## Subphase 1.5.2: Performance & Security Testing (Week 2)

**🔒 COMPLIANCE VALIDATION (Sami - Required Before ANY Task):**

**⚠️ STOP AUTHORITY:** Sami (Implementation Compliance Specialist) has **MANDATORY STOP AUTHORITY**. If ANY compliance rule is violated, implementation **MUST STOP IMMEDIATELY**. No exceptions.

**Before starting ANY task in this subphase, the following MUST be verified and documented:**

- [ ] **1. Sequential Task Verification (MANDATORY):** All previous tasks from Subphase 1.5.1 are complete and checked off (`[x]`). **NO TASK CAN START UNTIL ALL PREVIOUS TASKS ARE COMPLETE.** Sami verifies this before every task. Starting a task out of sequence is a **COMPLIANCE VIOLATION**.
- [ ] **Subphase 1.5.1 Complete:** All end-to-end integration testing tasks (1.5.1.1-1.5.1.15) are complete and verified.
- [ ] **2. Role Name Verification:** Frontend role names match database schema exactly; role constants match `users.role` enum values; no hardcoded role strings (use constants).
- [ ] **3. Schema Verification:** Database schema verified before role-dependent code; all required tables/fields/RLS policies exist; Phase 0.6 schema additions incorporated where applicable.
- [ ] **4. Integration Verification:** Layout/components integrated into routes (if applicable); navigation updated (if new routes added); module routing structure updated.
- [ ] **5. Role Coverage Verification:** All 9 roles are handled where applicable (Company Admin, Company Manager, Company User, MOH Tier 1, MOH Tier 2 Officer, MOH Tier 2 Registrar, MOH Auditor, System Admin, Vendor); role variants match wireframe specifications.
- [ ] **6. Wireframe Compliance:** Wireframe reviewed before starting; wireframe task ID(s) identified; wireframe requirements understood (layout, interactions, states, role-based variations); wireframe annotations reviewed.
- [ ] **7. Data Source Verification:** NO local mock data used (NO `const mockData = [...]`, NO `mockData.ts`, NO runtime mocks); all data queries Supabase database; seed data applied if required (verify via `supabase migration list`); database tables verified before starting (use SQL queries).
- [ ] **8. Wireframe Binding:** Wireframe binding comments will be added to code (JSDoc format with wireframe link); wireframe task ID(s) documented in code comments; PR description will include wireframe link(s); wireframe binding in both PR description AND codebase.
- [ ] **9. Seed Data Gate (If Applicable):** N/A for this subphase - Testing phase uses existing seeded data from previous phases (RMM, VCI, ECS, CMC seed data already applied).
- [ ] **Wireframe-First Implementation Principle:** Wireframes are the PRIMARY design reference. If a wireframe doesn't exist, **STOP** and create it first. See [Compliance Rules - Wireframe-First Implementation Principle](../standards/compliance-rules.md#wireframe-first-implementation-principle) for complete requirements.
- [ ] **Sami's Compliance Checklist:** Will be used for EVERY task in this subphase. **No task proceeds without Sami's approval.**
- [ ] **Sami's Approval:** Compliance review completed and approved by Sami before task start. **MANDATORY - No task can proceed without this approval.**
- [ ] **Implementation Summary Compliance Section:** After task completion, implementation summary MUST include compliance section documenting all rules followed (see "Implementation Summary Compliance Requirement" section above). **PRs without compliance section will be REJECTED.**
- [ ] **PR Description Checklist:** See [Compliance Rules - PR Description Checklist](../standards/compliance-rules.md#pr-description-checklist-required) for the complete 9-item checklist that every frontend task PR must include.

**🚫 STOP CONDITIONS (Do Not Proceed):**

**STOP implementation and resolve before proceeding** if any of the following is true:

- **Previous Subphase Incomplete:** Subphase 1.5.1 tasks are not complete. **STOP** and complete all prerequisite tasks first.
- **Integration Tests Not Complete:** End-to-end integration tests are not complete. **STOP** and complete integration tests first.
- **Wireframe Requirements:** No wireframe link exists for the page/route being implemented. **STOP** and request/produce the wireframe first. Do not guess layouts, flows, or states.
- **Database & Schema Requirements:** Required DB table/field/RPC does not exist yet. **STOP** and implement the missing backend task first. Do not create local mocks as a workaround.
- **Security & Access Requirements:** RLS/policies prevent required access for the wireframed role. **STOP** and implement/update RLS policies before proceeding.
- **Seed Data Requirements:** Seed migration is not idempotent (must use deterministic IDs + UPSERT patterns) or not applied. **STOP** and fix/apply migration first.
- **Sequential Execution:** Previous tasks are not complete. **STOP** and complete all prerequisite tasks first.
- **Role Name Mismatch:** Frontend role names don't match database schema. **STOP** and fix role names to match schema exactly.

### Performance Testing Tasks
- [ ] **Task 1.5.2.1:** Perform load testing - 75 companies concurrent access
  - 💾 **Database:** All module tables ([feature-index.md](../../02-architecture/feature-index.md))
  - 🔌 **API:** All RPC functions ([feature-index.md](../../02-architecture/feature-index.md))

- [ ] **Task 1.5.2.2:** Perform load testing - Large dataset queries (2-3 years historical data)
  - 💾 **Database:** All historical data tables ([feature-index.md](../../02-architecture/feature-index.md))
  - 🔌 **API:** Historical data query functions ([feature-index.md](../../02-architecture/feature-index.md))

- [ ] **Task 1.5.2.3:** Perform load testing - Dashboard performance
  - 💾 **Database:** Dashboard data sources ([feature-index.md](../../02-architecture/feature-index.md))
  - 🔌 **API:** Dashboard data aggregation functions

- [ ] **Task 1.5.2.4:** Test RLS policy performance
  - 💾 **Database:** All tables with RLS policies ([feature-index.md](../../02-architecture/feature-index.md))
  - 🔌 **API:** RLS policy performance testing ([security-architecture.md](../../02-architecture/security/security-architecture.md))

- [ ] **Task 1.5.2.5:** Test database query optimization
  - 💾 **Database:** All module tables ([feature-index.md](../../02-architecture/feature-index.md))
  - 🔌 **API:** Query optimization testing

- [ ] **Task 1.5.2.6:** Test scheduled job performance
  - 💾 **Database:** All tables with scheduled triggers ([feature-index.md](../../02-architecture/feature-index.md))
  - 🔌 **API:** Scheduled job performance testing

- [ ] **Task 1.5.2.7:** Measure response times (target: <2 seconds for standard operations)
  - 💾 **Database:** All module tables ([feature-index.md](../../02-architecture/feature-index.md))
  - 🔌 **API:** All RPC functions ([feature-index.md](../../02-architecture/feature-index.md))

- [ ] **Task 1.5.2.8:** Test concurrent submission handling
  - 💾 **Database:** Submission tables (registry_submissions, aams_submissions, msq_submissions, wsl_submissions, export_requests) ([feature-index.md](../../02-architecture/feature-index.md))
  - 🔌 **API:** Submission RPC functions ([feature-index.md](../../02-architecture/feature-index.md))

### Security Testing Tasks
- [ ] **Task 1.5.2.9:** Perform security audit - Authentication and authorization
  - 💾 **Database:** `users`, `system_config` ([feature-index.md](../../02-architecture/feature-index.md#core-foundation-features))
  - 🔌 **API:** Authentication and authorization functions ([security-architecture.md](../../02-architecture/security/security-architecture.md))

- [ ] **Task 1.5.2.10:** Perform security audit - RLS policy enforcement
  - 💾 **Database:** All tables with RLS policies ([feature-index.md](../../02-architecture/feature-index.md))
  - 🔌 **API:** RLS policy enforcement testing ([security-architecture.md](../../02-architecture/security/security-architecture.md))

- [ ] **Task 1.5.2.11:** Perform security audit - Input validation and sanitization
  - 💾 **Database:** All input-receiving tables ([feature-index.md](../../02-architecture/feature-index.md))
  - 🔌 **API:** Input validation functions ([backend-validation-strategy.md](../../02-architecture/security/backend-validation-strategy.md))

- [ ] **Task 1.5.2.12:** Perform security audit - Audit logging completeness
  - 💾 **Database:** `audit_logs` ([feature-index.md](../../02-architecture/feature-index.md#global-pages))
  - 🔌 **API:** Audit logging infrastructure ([audit-logging-spec.md](../../02-architecture/security/audit-logging-spec.md))

- [ ] **Task 1.5.2.13:** Perform security audit - API security (rate limiting, error handling)
  - 💾 **Database:** All module tables ([feature-index.md](../../02-architecture/feature-index.md))
  - 🔌 **API:** All RPC functions ([feature-index.md](../../02-architecture/feature-index.md))

- [ ] **Task 1.5.2.14:** Test two-person rule enforcement
  - 💾 **Database:** `approval_history`, workflow tables ([feature-index.md](../../02-architecture/feature-index.md))
  - 🔌 **API:** Two-person rule validation functions ([feature-index.md](../../02-architecture/feature-index.md))

- [ ] **Task 1.5.2.15:** Test role-based access control (all roles, all permissions)
  - 💾 **Database:** All module tables ([feature-index.md](../../02-architecture/feature-index.md))
  - 🔌 **API:** Role-based access control functions ([security-architecture.md](../../02-architecture/security/security-architecture.md))

---

## Subphase 1.5.3: Edge Cases & Error Handling (Week 3)

**🔒 COMPLIANCE VALIDATION (Sami - Required Before ANY Task):**

**⚠️ STOP AUTHORITY:** Sami (Implementation Compliance Specialist) has **MANDATORY STOP AUTHORITY**. If ANY compliance rule is violated, implementation **MUST STOP IMMEDIATELY**. No exceptions.

**Before starting ANY task in this subphase, the following MUST be verified and documented:**

- [ ] **1. Sequential Task Verification (MANDATORY):** All previous tasks from Subphases 1.5.1 and 1.5.2 are complete and checked off (`[x]`). **NO TASK CAN START UNTIL ALL PREVIOUS TASKS ARE COMPLETE.** Sami verifies this before every task. Starting a task out of sequence is a **COMPLIANCE VIOLATION**.
- [ ] **Subphase 1.5.2 Complete:** All performance and security testing tasks (1.5.2.1-1.5.2.15) are complete and verified.
- [ ] **2. Role Name Verification:** Frontend role names match database schema exactly; role constants match `users.role` enum values; no hardcoded role strings (use constants).
- [ ] **3. Schema Verification:** Database schema verified before role-dependent code; all required tables/fields/RLS policies exist; Phase 0.6 schema additions incorporated where applicable.
- [ ] **4. Integration Verification:** Layout/components integrated into routes (if applicable); navigation updated (if new routes added); module routing structure updated.
- [ ] **5. Role Coverage Verification:** All 9 roles are handled where applicable (Company Admin, Company Manager, Company User, MOH Tier 1, MOH Tier 2 Officer, MOH Tier 2 Registrar, MOH Auditor, System Admin, Vendor); role variants match wireframe specifications.
- [ ] **6. Wireframe Compliance:** Wireframe reviewed before starting; wireframe task ID(s) identified; wireframe requirements understood (layout, interactions, states, role-based variations); wireframe annotations reviewed.
- [ ] **7. Data Source Verification:** NO local mock data used (NO `const mockData = [...]`, NO `mockData.ts`, NO runtime mocks); all data queries Supabase database; seed data applied if required (verify via `supabase migration list`); database tables verified before starting (use SQL queries).
- [ ] **8. Wireframe Binding:** Wireframe binding comments will be added to code (JSDoc format with wireframe link); wireframe task ID(s) documented in code comments; PR description will include wireframe link(s); wireframe binding in both PR description AND codebase.
- [ ] **9. Seed Data Gate (If Applicable):** N/A for this subphase - Testing phase uses existing seeded data from previous phases (RMM, VCI, ECS, CMC seed data already applied).
- [ ] **Wireframe-First Implementation Principle:** Wireframes are the PRIMARY design reference. If a wireframe doesn't exist, **STOP** and create it first. See [Compliance Rules - Wireframe-First Implementation Principle](../standards/compliance-rules.md#wireframe-first-implementation-principle) for complete requirements.
- [ ] **Sami's Compliance Checklist:** Will be used for EVERY task in this subphase. **No task proceeds without Sami's approval.**
- [ ] **Sami's Approval:** Compliance review completed and approved by Sami before task start. **MANDATORY - No task can proceed without this approval.**
- [ ] **Implementation Summary Compliance Section:** After task completion, implementation summary MUST include compliance section documenting all rules followed (see "Implementation Summary Compliance Requirement" section above). **PRs without compliance section will be REJECTED.**
- [ ] **PR Description Checklist:** See [Compliance Rules - PR Description Checklist](../standards/compliance-rules.md#pr-description-checklist-required) for the complete 9-item checklist that every frontend task PR must include.

**🚫 STOP CONDITIONS (Do Not Proceed):**

**STOP implementation and resolve before proceeding** if any of the following is true:

- **Previous Subphase Incomplete:** Subphase 1.5.2 tasks are not complete. **STOP** and complete all prerequisite tasks first.
- **Performance/Security Tests Not Complete:** Performance and security tests are not complete. **STOP** and complete tests first.
- **Wireframe Requirements:** No wireframe link exists for the page/route being implemented. **STOP** and request/produce the wireframe first. Do not guess layouts, flows, or states.
- **Database & Schema Requirements:** Required DB table/field/RPC does not exist yet. **STOP** and implement the missing backend task first. Do not create local mocks as a workaround.
- **Security & Access Requirements:** RLS/policies prevent required access for the wireframed role. **STOP** and implement/update RLS policies before proceeding.
- **Seed Data Requirements:** Seed migration is not idempotent (must use deterministic IDs + UPSERT patterns) or not applied. **STOP** and fix/apply migration first.
- **Sequential Execution:** Previous tasks are not complete. **STOP** and complete all prerequisite tasks first.
- **Role Name Mismatch:** Frontend role names don't match database schema. **STOP** and fix role names to match schema exactly.

### Edge Case Testing Tasks
- [ ] **Task 1.5.3.1:** Test edge cases - Late AAMS submissions
  - 💾 **Database:** `aams_submissions` ([feature-index.md](../../02-architecture/feature-index.md#aams-annual-average-monthly-sales))
  - 🔌 **API:** AAMS submission and deadline validation functions ([feature-index.md](../../02-architecture/feature-index.md#aams-annual-average-monthly-sales))

- [ ] **Task 1.5.3.2:** Test edge cases - Missing AAMS
  - 💾 **Database:** `aams_submissions`, fallback logic ([feature-index.md](../../02-architecture/feature-index.md#aams-annual-average-monthly-sales))
  - 🔌 **API:** AAMS fallback logic functions ([feature-index.md](../../02-architecture/feature-index.md#aams-annual-average-monthly-sales))

- [ ] **Task 1.5.3.3:** Test edge cases - WSL deadline violations
  - 💾 **Database:** `wsl_submissions` ([feature-index.md](../../02-architecture/feature-index.md#wsl-weekly-stock-levels))
  - 🔌 **API:** WSL deadline validation functions ([feature-index.md](../../02-architecture/feature-index.md#wsl-weekly-stock-levels))

- [ ] **Task 1.5.3.4:** Test edge cases - Multiple concurrent breaches
  - 💾 **Database:** `breaches`, `breach_analyses` ([feature-index.md](../../02-architecture/feature-index.md#compliance-violations-breaches))
  - 🔌 **API:** Breach detection and processing functions ([feature-index.md](../../02-architecture/feature-index.md#compliance-violations-breaches))

- [ ] **Task 1.5.3.5:** Test edge cases - Export authorization expiration
  - 💾 **Database:** `export_authorizations` ([feature-index.md](../../02-architecture/feature-index.md#ecs-module-features))
  - 🔌 **API:** Export authorization expiration functions ([feature-index.md](../../02-architecture/feature-index.md#ecs-module-features))

- [ ] **Task 1.5.3.6:** Test edge cases - Replenishment delay escalation
  - 💾 **Database:** `replenishment_schedules` ([feature-index.md](../../02-architecture/feature-index.md#ecs-module-features))
  - 🔌 **API:** Replenishment escalation functions ([feature-index.md](../../02-architecture/feature-index.md#ecs-module-features))

- [ ] **Task 1.5.3.7:** Test edge cases - Threshold switching edge cases
  - 💾 **Database:** `thresholds`, `export_authorizations` ([feature-index.md](../../02-architecture/feature-index.md#feature-dependency-matrix))
  - 🔌 **API:** Threshold switching functions ([module-integration-contracts.md](../../02-architecture/integration/module-integration-contracts.md))

- [ ] **Task 1.5.3.8:** Test edge cases - CMC score calculation with missing data
  - 💾 **Database:** `compliance_scores`, `compliance_score_components` ([feature-index.md](../../02-architecture/feature-index.md#cmc-module-features))
  - 🔌 **API:** CMC score calculation functions ([feature-index.md](../../02-architecture/feature-index.md#cmc-module-features))

- [ ] **Task 1.5.3.9:** Test edge cases - Module activation/deactivation during active workflows
  - 💾 **Database:** All module tables ([feature-index.md](../../02-architecture/feature-index.md))
  - 🔌 **API:** Module activation/deactivation functions

- [ ] **Task 1.5.3.10:** Test error handling - Network failures, timeout scenarios
  - 💾 **Database:** All module tables ([feature-index.md](../../02-architecture/feature-index.md))
  - 🔌 **API:** All RPC functions with error handling ([backend-error-handling-framework.md](../../02-architecture/security/backend-error-handling-framework.md))

- [ ] **Task 1.5.3.11:** Test error handling - Invalid data submissions
  - 💾 **Database:** All submission tables ([feature-index.md](../../02-architecture/feature-index.md))
  - 🔌 **API:** Input validation functions ([backend-validation-strategy.md](../../02-architecture/security/backend-validation-strategy.md))

- [ ] **Task 1.5.3.12:** Test error handling - Concurrent update conflicts
  - 💾 **Database:** All module tables ([feature-index.md](../../02-architecture/feature-index.md))
  - 🔌 **API:** Concurrency control functions ([database-concurrency-control-strategy.md](../../02-architecture/database/database-concurrency-control-strategy.md))

- [ ] **Task 1.5.3.13:** Test error recovery - Transaction rollbacks
  - 💾 **Database:** All module tables ([feature-index.md](../../02-architecture/feature-index.md))
  - 🔌 **API:** Transaction management ([database-transaction-management-strategy.md](../../02-architecture/database/database-transaction-management-strategy.md))

- [ ] **Task 1.5.3.14:** Test audit log integrity
  - 💾 **Database:** `audit_logs` ([feature-index.md](../../02-architecture/feature-index.md#global-pages))
  - 🔌 **API:** Audit logging infrastructure ([audit-logging-spec.md](../../02-architecture/security/audit-logging-spec.md))

- [ ] **Task 1.5.3.15:** Create test coverage reporting
  - 💾 **Database:** All module tables ([feature-index.md](../../02-architecture/feature-index.md))
  - 🔌 **API:** All RPC functions ([feature-index.md](../../02-architecture/feature-index.md))

---

## Subphase 1.5.4: Documentation & Customer Presentation (Week 4)

**🔒 COMPLIANCE VALIDATION (Sami - Required Before ANY Task):**

**⚠️ STOP AUTHORITY:** Sami (Implementation Compliance Specialist) has **MANDATORY STOP AUTHORITY**. If ANY compliance rule is violated, implementation **MUST STOP IMMEDIATELY**. No exceptions.

**Before starting ANY task in this subphase, the following MUST be verified and documented:**

- [ ] **1. Sequential Task Verification (MANDATORY):** All previous tasks from Subphases 1.5.1, 1.5.2, and 1.5.3 are complete and checked off (`[x]`). **NO TASK CAN START UNTIL ALL PREVIOUS TASKS ARE COMPLETE.** Sami verifies this before every task. Starting a task out of sequence is a **COMPLIANCE VIOLATION**.
- [ ] **Subphase 1.5.3 Complete:** All edge case and error handling testing tasks (1.5.3.1-1.5.3.15) are complete and verified.
- [ ] **2. Role Name Verification:** Frontend role names match database schema exactly; role constants match `users.role` enum values; no hardcoded role strings (use constants).
- [ ] **3. Schema Verification:** Database schema verified before role-dependent code; all required tables/fields/RLS policies exist; Phase 0.6 schema additions incorporated where applicable.
- [ ] **4. Integration Verification:** Layout/components integrated into routes (if applicable); navigation updated (if new routes added); module routing structure updated.
- [ ] **5. Role Coverage Verification:** All 9 roles are handled where applicable (Company Admin, Company Manager, Company User, MOH Tier 1, MOH Tier 2 Officer, MOH Tier 2 Registrar, MOH Auditor, System Admin, Vendor); role variants match wireframe specifications.
- [ ] **6. Wireframe Compliance:** Wireframe reviewed before starting; wireframe task ID(s) identified; wireframe requirements understood (layout, interactions, states, role-based variations); wireframe annotations reviewed.
- [ ] **7. Data Source Verification:** NO local mock data used (NO `const mockData = [...]`, NO `mockData.ts`, NO runtime mocks); all data queries Supabase database; seed data applied if required (verify via `supabase migration list`); database tables verified before starting (use SQL queries).
- [ ] **8. Wireframe Binding:** Wireframe binding comments will be added to code (JSDoc format with wireframe link); wireframe task ID(s) documented in code comments; PR description will include wireframe link(s); wireframe binding in both PR description AND codebase.
- [ ] **9. Seed Data Gate (If Applicable):** N/A for this subphase (documentation phase).
- [ ] **Wireframe-First Implementation Principle:** Wireframes are the PRIMARY design reference. If a wireframe doesn't exist, **STOP** and create it first. See [Compliance Rules - Wireframe-First Implementation Principle](../standards/compliance-rules.md#wireframe-first-implementation-principle) for complete requirements.
- [ ] **Sami's Compliance Checklist:** Will be used for EVERY task in this subphase. **No task proceeds without Sami's approval.**
- [ ] **Sami's Approval:** Compliance review completed and approved by Sami before task start. **MANDATORY - No task can proceed without this approval.**
- [ ] **Implementation Summary Compliance Section:** After task completion, implementation summary MUST include compliance section documenting all rules followed (see "Implementation Summary Compliance Requirement" section above). **PRs without compliance section will be REJECTED.**
- [ ] **PR Description Checklist:** See [Compliance Rules - PR Description Checklist](../standards/compliance-rules.md#pr-description-checklist-required) for the complete 9-item checklist that every frontend task PR must include.

**🚫 STOP CONDITIONS (Do Not Proceed):**

**STOP implementation and resolve before proceeding** if any of the following is true:

- **Previous Subphase Incomplete:** Subphase 1.5.3 tasks are not complete. **STOP** and complete all prerequisite tasks first.
- **All Testing Not Complete:** Integration, performance, security, and edge case testing are not complete. **STOP** and complete all testing first.
- **Wireframe Requirements:** No wireframe link exists for the page/route being implemented. **STOP** and request/produce the wireframe first. Do not guess layouts, flows, or states.
- **Database & Schema Requirements:** Required DB table/field/RPC does not exist yet. **STOP** and implement the missing backend task first. Do not create local mocks as a workaround.
- **Security & Access Requirements:** RLS/policies prevent required access for the wireframed role. **STOP** and implement/update RLS policies before proceeding.
- **Seed Data Requirements:** Seed migration is not idempotent (must use deterministic IDs + UPSERT patterns) or not applied. **STOP** and fix/apply migration first.
- **Sequential Execution:** Previous tasks are not complete. **STOP** and complete all prerequisite tasks first.
- **Role Name Mismatch:** Frontend role names don't match database schema. **STOP** and fix role names to match schema exactly.

### Documentation Tasks
- [ ] **Task 1.5.4.1:** Create complete system documentation (architecture overview, module documentation)
  - 💾 **Database:** All module tables ([feature-index.md](../../02-architecture/feature-index.md))
  - 🔌 **API:** All RPC functions ([feature-index.md](../../02-architecture/feature-index.md))
  - 📐 **Wireframe:** All wireframes ([phase-0-5-wireframes-catalog.md](../Archive for now/phase-0-5-wireframes-catalog.md))

- [ ] **Task 1.5.4.2:** Create user manuals (company user guide, MOH user guide, role-specific guides)
  - 💾 **Database:** All module tables ([feature-index.md](../../02-architecture/feature-index.md))
  - 🔌 **API:** All RPC functions ([feature-index.md](../../02-architecture/feature-index.md))
  - 📐 **Wireframe:** All user-facing wireframes ([phase-0-5-wireframes-catalog.md](../Archive for now/phase-0-5-wireframes-catalog.md))

- [ ] **Task 1.5.4.3:** Create API documentation (complete RPC function documentation, request/response schemas)
  - 💾 **Database:** All module tables ([feature-index.md](../../02-architecture/feature-index.md))
  - 🔌 **API:** All RPC functions ([feature-index.md](../../02-architecture/feature-index.md))

- [ ] **Task 1.5.4.4:** Create administrator documentation (deployment guide, configuration guide, troubleshooting)
  - 💾 **Database:** All module tables ([feature-index.md](../../02-architecture/feature-index.md))
  - 🔌 **API:** All RPC functions and system configuration ([feature-index.md](../../02-architecture/feature-index.md))
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
- **Hassan:** Testing strategy, test implementation, **full ownership of mock data seeding and testing** (creates and executes seed migrations after each phase, validates seed data integrity/realism/coverage, ensures test DB isolation)
- **Farah:** Analytics realism validation (coordinates with Hassan for seed data validation), CMC scoring
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
