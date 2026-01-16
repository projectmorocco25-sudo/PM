# Phase 1 Implementation Plan - Pharmaceutical Governance Value Chain Platform (PM)

**Phase:** Phase 1 - Development with Seeded Supabase Data (Months 2-6)  
**Status:** ✅ APPROVED FOR IMPLEMENTATION (January 12, 2026)  
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
  - 14 critical schema gaps identified and resolved
  - Schema changes integrated into migration tasks
  - Migration scripts created
- **Phase 1 Pre-Implementation Audit** ✅ COMPLETE - See [Phase 1 Audit Status Tracker](phase-1-audit-status-tracker.md)
  - 60 issues addressed (44 critical + 16 medium)
  - All 11 team members audited and approved

**✅ READY FOR IMPLEMENTATION:** This plan has been fully audited by all 11 team members. All 60 issues (44 critical + 16 medium) have been addressed. Begin with **Subphase 1.1.1: Core Foundation**.

---

## 🔒 HARD GATES: Wireframe + Database Compliance (Non-Negotiable)

These gates apply to **every** Phase 1 frontend page/component. If a gate is not met, the task is **not complete** and the PR must not merge.

### No Hardcoded UI Data

- Production pages/components must **not** use inline arrays/objects as the source of truth for cards/tables/lists.
- All “mock data” used during Phase 1 must be **seeded into the Supabase database** (dev/staging), then queried by the frontend.
- Local mock providers (hooks/services/repositories returning synthetic records) are **not allowed** for application runtime.
 - **Seed playbook (required):** See [Phase 1.1 Seeded Supabase “Mock Data” Playbook](phase-1-1-mockdata.md).

#### Phase 1 “Mock Data” Clarification (Required)

- **Allowed:** Seeded Supabase database records (dev/staging) that are realistic and cover wireframe scenarios; test data inserted into the **test database** for automated tests.
- **Not allowed:** Any locally-mocked application runtime data (including mocks behind data access layers) and any inline arrays/objects used as the source of truth in pages/components.
- **Goal:** UI components always read from the database in Phase 1; “mock” means **seeded DB data**, not local placeholders.

### Wireframe Binding

- Every implemented route/page must declare the exact wireframe task file(s) it implements (e.g., `task-0.5.x.x-...`).
- Wireframe binding must appear in **both**:
  - the PR description checklist (see “Proof Required”), and
  - the codebase (either a top-of-file comment in the route/page file, or a maintained mapping module such as “route → wireframe task id(s)”).
- If there is no wireframe for a page/task: **STOP** and create/approve the wireframe **before** coding.

### DB Binding

- Every page must list the tables/fields it uses and must query real data (no placeholders) once the schema exists.
- Phase 0.6 additions must be incorporated where applicable:
  - `users.avatar_url`, `users.timezone`, `users.language`, `users.notification_preferences`
  - `conversations.lifecycle_state`, `messages.delivered_at`
  - `follow_ups`, `meetings`, `meeting_attendees`
  - `skus.dosage_strength`, `skus.dosage_form`, `skus.pack_size`, `skus.unit_of_measure`

### Role + States Coverage

- Company + MOH Tier 1 + MOH Tier 2 must be implemented/verified where the wireframe specifies role variants.
- “N/A” is allowed only when the wireframe explicitly indicates no role variants apply; cite the relevant wireframe section/annotation in the PR.
- Required UI states: **loading**, **empty**, **error**, **success**.

### Proof Required (PR Description Checklist)

For every frontend task marked complete, the PR description must include:
1. Wireframe link(s) (exact `task-0.5.x.x` file(s))
2. Screenshots for each role variant (Company / MOH Tier 1 / MOH Tier 2) or explicit N/A
3. Screenshots for loading/empty/error/success states
4. Data proof: tables/fields used + where queries live (file paths/functions) and evidence they are actually queried (e.g., select clause/RPC name)
5. Any deviations + explicit approval reference (decision/issue link)

### Stop Conditions (Do Not Proceed)

Stop implementation and resolve before proceeding if any of the following is true:
- No wireframe link exists for the page/route being implemented.
- Wireframe is ambiguous or missing a required state/role behavior.
- Required DB table/field/RPC does not exist yet (implement the missing backend task first).
- RLS/policies prevent required access for the wireframed role.
- Plan and wireframe conflict (wireframe wins; document and propose plan update instead of guessing).

### Repo Enforcement (Required for Phase 1.1 unless explicitly waived)

- Add a PR template that embeds the “Proof Required” checklist above.
- Require reviewers by change type:
  - UI pages/layouts: UI/UX reviewer (Emma) or designated delegate
  - DB queries/schema usage: DB reviewer (Nadia) or designated delegate
  - RLS/RBAC/policies: RLS reviewer (Rafi) or designated delegate

**Optional (strongly advised):**
- Add a CI check (lint or grep-based) that flags likely hardcoded UI data in `frontend/src/app/**` pages/components (e.g., large inline arrays/objects used for rendering lists/cards/tables).

**Repo hardwire:** Cursor enforcement rule is present at `.cursor/rules/wireframe_db_compliance.md`.

## ⚠️ CRITICAL: Wireframe-First Implementation Principle

**📋 Complete Documentation:** See [Wireframe-First Implementation Principle](wireframe-first-implementation-principle.md) for comprehensive guidelines.

**Before starting ANY frontend implementation task, you MUST:**

1. **Review the corresponding wireframe** - Every page, component, and workflow has a wireframe specification in `docs/04-design/user-experience/wireframes/`
2. **Understand the wireframe requirements** - Layout, interactions, states, role-based variations
3. **Reference wireframe annotations** - See `docs/04-design/user-experience/wireframes/06-documentation/wireframe-annotations.md`
4. **Check component mapping** - See `docs/04-design/user-experience/wireframes/06-documentation/wireframe-to-component-mapping.md`
5. **Verify wireframe compliance** - Your implementation must match the wireframe specifications

**Wireframes are the PRIMARY design reference** - Architecture docs, component specs, and this plan support wireframes, but **wireframes define the UI/UX**. If there is any conflict or ambiguity, the wireframe takes precedence.

**Wireframe Index:** See [Wireframe Index](../../04-design/user-experience/wireframes/06-documentation/wireframe-index.md) for complete list of all 120 wireframes.

**Wireframe Organization:**
- Core Foundation: `docs/04-design/user-experience/wireframes/00-core-foundation/`
- RMM Module: `docs/04-design/user-experience/wireframes/01-rmm/`
- VCI Module: `docs/04-design/user-experience/wireframes/02-vci/`
- ECS Module: `docs/04-design/user-experience/wireframes/03-ecs/`
- CMC Module: `docs/04-design/user-experience/wireframes/04-cmc/`
- Historical Data: `docs/04-design/user-experience/wireframes/05-audit-historical/`
- Modals: `docs/04-design/user-experience/wireframes/07-modals/`

**If a wireframe doesn't exist for a task, STOP and create it first.**

### Wireframe Compliance Checklist

For every frontend task, verify before marking complete:
- [ ] Wireframe reviewed before starting implementation
- [ ] Layout matches wireframe (structure, spacing, positioning)
- [ ] Components match wireframe (buttons, inputs, tables, cards)
- [ ] Interactions match wireframe (click, hover, keyboard, touch)
- [ ] States implemented (loading, error, empty, success)
- [ ] Role-based variations implemented (Company, MOH Tier 1, MOH Tier 2)
- [ ] Responsive breakpoints match wireframe (mobile, tablet, desktop)

**Note:** The “HARD GATES” section above is authoritative; this checklist is a quick reminder and does not replace the PR proof requirements.

**Note:** All major frontend tasks in this plan now include wireframe references (e.g., **Wireframe:** [Task 0.5.X.X - Page Name](../../path/to/wireframe.md)). If a task doesn't have a wireframe reference, it may be:
1. A backend/infrastructure task (no UI)
2. A utility component that supports wireframe implementations
3. A task that needs a wireframe created first (STOP and create it before proceeding)
- [ ] Validation rules match wireframe annotations
- [ ] Accessibility features implemented (ARIA labels, keyboard navigation)
- [ ] Related wireframes reviewed (modals, state variations, workflow pages)

---

## Pre-Implementation Audit Status

**Current Status:** ✅ **COMPLETE & APPROVED FOR IMPLEMENTATION** - Begin with Subphase 1.1.1

The Phase 1 pre-implementation audit is complete. References and standards are embedded in this plan, including the “HARD GATES” and the wireframe-first principle.

**Audit Document:** [Phase 1 Audit Status Tracker](phase-1-audit-status-tracker.md) and [Phase 1 Pre-Implementation Audit Checklist](phase-1-pre-implementation-audit-checklist.md)

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

---

## Implementation Standards & Definition of Done

**📋 Complete Standards:** See [Phase 1 Implementation Standards](phase-1-implementation-standards.md) for comprehensive implementation standards, task format specifications, and definitions of done for all task types.

### Quick Reference - Definition of Done

All tasks must meet their respective Definition of Done criteria before being marked complete. Key completion criteria by task type:

**Database Migration Tasks:**
- [ ] Migration created as versioned SQL file in `supabase/migrations/` directory (format: `YYYYMMDDHHMMSS_description.sql`)
- [ ] Migration applied using Supabase CLI (`supabase migration apply`) or auto-applied in local dev
- [ ] All schema changes match schema-design.md
- [ ] Indexes and constraints created and verified (using SQL queries via Supabase dashboard or `supabase db execute`)
- [ ] Schema verification completed (using SQL queries to verify tables, columns, indexes via Supabase dashboard or CLI)
- [ ] Migration tracked in migration history (verify via `supabase migration list` or Supabase dashboard)
- [ ] Rollback script tested (if needed, create reverse migration or use SQL via Supabase dashboard)
- [ ] Security best practices verified (RLS policies, indexes, constraints checked via SQL queries)
- [ ] Code reviewed by database specialist

**RPC Function Tasks:**
- [ ] Function signature matches specification
- [ ] Business logic implemented
- [ ] Error handling implemented
- [ ] RLS policies enforced
- [ ] Function documented
- [ ] Unit tests written and passing
- [ ] Code reviewed by RPC specialist

**RLS Policy Tasks:**
- [ ] Policies created and enabled
- [ ] Access rules tested with different roles
- [ ] Company isolation verified
- [ ] Policies documented
- [ ] Code reviewed by RLS specialist

**Frontend Component Tasks:**
- [ ] Matches wireframe specifications
- [ ] Error states implemented
- [ ] Accessibility features implemented
- [ ] Responsive design implemented
- [ ] Component tested
- [ ] Wireframe compliance verified
- [ ] PR description includes required compliance proof:
  - [ ] Wireframe link(s) (exact `task-0.5.x.x` file(s))
  - [ ] Screenshots for each role variant (Company / MOH Tier 1 / MOH Tier 2) or explicit N/A
  - [ ] Screenshots for loading/empty/error/success states
  - [ ] Data proof: tables/fields used + where queries live (file paths/functions) and evidence they are actually queried (e.g., select clause/RPC name)
  - [ ] Any deviations + explicit approval reference (decision/issue link)
- [ ] Required reviewers obtained by change type (UI/UX, DB, RLS as applicable)
- [ ] Code reviewed by frontend specialist

**For complete criteria and standards, see:** [Phase 1 Implementation Standards](phase-1-implementation-standards.md)

---

## Database Management with Supabase

**Standard Practice: Versioned Migrations and CLI Tools**

All database setup, migrations, schema verification, and management operations throughout Phase 1 should follow standard Supabase practices using versioned SQL migration files and Supabase CLI tools.

### Standard Supabase Migration Workflow

**Migrations:**
- **Migration Files:** Store all migrations as SQL files in `supabase/migrations/` directory
- **Naming Convention:** Use timestamped format `YYYYMMDDHHMMSS_description.sql`
- **Application:** Apply migrations via `supabase migration apply` or automatically in local dev via `supabase start`
- **Tracking:** Verify applied migrations via `supabase migration list` or Supabase dashboard migration history

**Schema Verification:**
- Use SQL queries via Supabase dashboard SQL editor or `supabase db execute`
- Use PostgreSQL standard commands (`\d`, `\dt`, `\di`) in psql for schema inspection
- Use `EXPLAIN ANALYZE` for query performance analysis

**Type Generation:**
- Generate TypeScript types using Supabase CLI: `supabase gen types typescript --local > types/database.types.ts`
- Or use Supabase dashboard: Settings → API → Generate TypeScript types

### Migration Requirements

1. **All migrations** must be versioned SQL files in `supabase/migrations/` directory
2. **All migrations** must be idempotent (safe to re-run) when possible
3. **Migration tracking** should verify via `supabase migration list` or dashboard
4. **Schema validation** should use standard SQL queries via Supabase dashboard or CLI
5. **Security checks** should follow standard PostgreSQL security best practices (RLS policies, indexes, constraints)

**Reference:** Follow standard Supabase migration practices as documented in [Supabase Migration Guide](https://supabase.com/docs/guides/cli/local-development#database-migrations).

---

## Phase 1 Overview

Phase 1 delivers the complete MVP with seeded Supabase data, organized into 4 sequential subphases:
1. **Phase 1.1:** RMM + VCI Development (Months 2-3)
2. **Phase 1.2:** ECS Development (Month 4)
3. **Phase 1.3:** CMC Development (Month 5)
4. **Phase 1.4:** Holistic MVP Testing (Month 6)

---

# PHASE 1.1: RMM + VCI DEVELOPMENT (Months 2-3)

**Duration:** 8 weeks  
**Objective:** Build core modules (Registry Management and Value Chain Intelligence) with comprehensive seeded Supabase data

## Subphase 1.1.1: Foundation & Infrastructure Setup (Week 1)

**Prerequisites:**
- Phase 0.5 (Wireframes) completed and approved
- Phase 0.6 (Database Schema Audit & Alignment) completed
- Implementation Standards document reviewed
- Development environment configured

**Seed Data Gate (Required):**
- Before starting Phase 1.1 Core Foundation UI work, apply the seed migration stage `seed_1_1_1_foundation` per [Phase 1.1 Seeded Supabase "Mock Data" Playbook](phase-1-1-mockdata.md) (versioned SQL migrations, idempotent).

**Execution Notes:**
- Tasks should be executed in dependency order (check `Depends on:` fields)
- All tasks must meet Definition of Done criteria (see [Implementation Standards & Definition of Done](#implementation-standards--definition-of-done) section above)
- Reference [Phase 1 Implementation Standards](phase-1-implementation-standards.md) for detailed completion criteria
- Estimated times are for planning; actual time may vary

### Backend Setup Tasks
- [ ] **Task 1.1.1.1:** Initialize Supabase project structure (migrations, functions, storage buckets)
  - **Phase 0 Reference:** See [Phase 0: Technical Foundation](phase-0-technical-foundation.md) - Decision 1 (Module Communication), Decision 4 (Background Jobs), Decision 6 (Module Integration)
  - **Verification:** Verify Supabase project connection via Supabase dashboard or `supabase status`
  - **Estimated Time:** 0.5-1 hour
- [ ] **Task 1.1.1.1a:** Define module integration contracts (data flow specs between RMM→VCI, VCI→ECS, ECS→CMC)
- [ ] **Task 1.1.1.1b:** Set up shared database schema versioning strategy (migration numbering, rollback procedures)
- [ ] **Task 1.1.1.1c:** Define API contract documentation format (OpenAPI/Swagger for RPC functions)
- [ ] **Task 1.1.1.1d:** Set up Edge Functions project structure (Deno functions directory, deployment configuration)
- [ ] **Task 1.1.1.2:** Create database migration for core tables (users, system_config, audit_logs, notifications, approvals)
  - **Reference:** [Schema Design - Core Tables](../../02-architecture/database/schema-design.md#core-tables), [Data Dictionary](../../02-architecture/database/data-dictionary.md)
  - **Phase 0.6 Reference:** See [Phase 0.6: Database Schema Audit](phase-0-6-databases.md) for gap analysis and [schema-updates-phase0-6-critical-gaps.md](../../02-architecture/database/schema-updates-phase0-6-critical-gaps.md) for migration scripts
  - **Phase 0.6 Updates:** users table includes new fields (avatar_url, timezone, language, notification_preferences)
  - **Migration Scripts:** See [Schema Updates - Phase 0.6 Critical Gaps](../../02-architecture/database/schema-updates-phase0-6-critical-gaps.md) - Change 1
  - **Implementation Guide:** See [Phase 0.6 Implementation Priorities - Users Table](../../05-project-management/phases/phase-0-6-implementation-priorities.md#1-users-table---profile-preferences)
  - **Migration Requirements:**
    - Create migration file: `supabase/migrations/YYYYMMDDHHMMSS_create_core_tables.sql`
    - Apply migration using `supabase migration apply` or auto-apply in local dev
    - Verify migration applied via `supabase migration list` or Supabase dashboard
    - Verify tables created using SQL queries via Supabase dashboard (e.g., `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`)
    - Verify schema using SQL queries (check columns, data types, constraints)
    - Verify security best practices (RLS policies, indexes, constraints) via SQL queries
  - **Foreign Key Constraints:** Explicitly define all foreign key relationships per schema-design.md (e.g., notifications.user_id → users.id, approvals.user_id → users.id)
  - **Data Type Validation:** Verify all data types match schema-design.md and data-dictionary.md specifications (e.g., timestamps with timezone, JSONB structures, text length limits)
  - **Rollback Strategy:** Create rollback migration script, reference [Migration Strategy](../../02-architecture/database/migration-strategy.md) for rollback procedures
  - **Index Specifications:** (Nadia's Audit - Issue #44)
    - users: idx_users_company_id, idx_users_role, idx_users_email
    - audit_logs: idx_audit_logs_created_at, idx_audit_logs_table_name, idx_audit_logs_user_id
    - notifications: idx_notifications_user_id, idx_notifications_read_at, idx_notifications_created_at
  - **Constraint Specifications:** (Nadia's Audit - Issue #45)
    - users.email: UNIQUE constraint
    - users.role: CHECK constraint (valid roles: company_user, moh_tier1, moh_tier2)
    - audit_logs.action: CHECK constraint (valid actions: INSERT, UPDATE, DELETE)
  - **Estimated Time:** 1-2 hours
  - **Developer Notes:**
    - Avatar uploads should use Supabase Storage: `avatars/{user_id}/{filename}`
    - Timezone default: 'UTC+01:00' (Morocco standard time)
    - Language default: 'en' (English)
    - Notification preferences: JSONB object with boolean flags (see schema-design.md for structure)
    - Follow standard Supabase migration practices (see [Database Management with Supabase](#database-management-with-supabase) section)
- [ ] **Task 1.1.1.2d:** Create database migration for communication tables (conversations, messages, message_attachments, message_read_receipts, conversation_participants)
  - **Reference:** [Schema Design - Communication Tables](../../02-architecture/database/schema-design.md#communication-tables)
  - **Phase 0.6 Updates:**
    - conversations.lifecycle_state (text, NOT NULL, DEFAULT 'CREATED') - State tracking for communication lifecycle
    - messages.delivered_at (timestamptz, NULLABLE) - Delivery timestamp tracking
  - **Migration Scripts:** See [Schema Updates - Phase 0.6 Critical Gaps](../../02-architecture/database/schema-updates-phase0-6-critical-gaps.md) - Changes 2, 3
  - **Implementation Guide:** See [Phase 0.6 Implementation Priorities](../../05-project-management/phases/phase-0-6-implementation-priorities.md#2-conversations-table---lifecycle-state)
  - **Migration Requirements:**
    - Create migration file: `supabase/migrations/YYYYMMDDHHMMSS_create_communication_tables.sql`
    - Apply migration using `supabase migration apply` or auto-apply in local dev
    - Verify migration via `supabase migration list` or Supabase dashboard
    - Verify tables and new fields using SQL queries (check lifecycle_state, delivered_at columns)
    - Verify security best practices via SQL queries
  - **Estimated Time:** 2-4 hours (1-2h lifecycle_state, 1-2h delivered_at)
  - **Developer Notes:**
    - Lifecycle state transitions: CREATED → SENT → DELIVERED → READ → THREADED → WORKFLOW_LINKED → ARCHIVED
    - Use `idx_conversations_lifecycle_state` index for filtering
    - `delivered_at` is different from `read_at` (in message_read_receipts table)
    - Follow standard Supabase migration practices (see [Database Management with Supabase](#database-management-with-supabase) section)
- [ ] **Task 1.1.1.2e:** Create database migration for governance tables (follow_ups, meetings, meeting_attendees)
  - **Reference:** [Schema Design - Governance Tables](../../02-architecture/database/schema-design.md#follow_ups)
  - **Phase 0.6 Addition:** New tables for governance follow-up tracking and meeting scheduling
  - **Migration Scripts:** See [Schema Updates - Phase 0.6 Critical Gaps](../../02-architecture/database/schema-updates-phase0-6-critical-gaps.md) - Changes 4, 5, 6
  - **Implementation Guide:** See [Phase 0.6 Implementation Priorities](../../05-project-management/phases/phase-0-6-implementation-priorities.md#3-follow_ups-table)
  - **Migration Requirements:**
    - Create migration file: `supabase/migrations/YYYYMMDDHHMMSS_create_governance_tables.sql`
    - Apply migration using `supabase migration apply` or auto-apply in local dev
    - Verify migration via `supabase migration list` or Supabase dashboard
    - Verify tables created using SQL queries (verify follow_ups, meetings, meeting_attendees exist)
    - Verify schema using SQL queries (check columns, foreign keys, indexes)
    - Verify security best practices via SQL queries
  - **Estimated Time:** 8-13 hours (3-4h follow_ups, 3-4h meetings, 2-5h meeting_attendees)
  - **Tables to Create:**
    - follow_ups (governance follow-up tracking)
    - meetings (governance meeting scheduling)
    - meeting_attendees (meeting attendee tracking)
  - **Developer Notes:**
    - follow_ups supports polymorphic relationships via issue_reference_id + issue_reference_table
    - meetings supports polymorphic relationships via related_reference_id + related_reference_table
    - All tables include comprehensive indexes for performance
    - See schema-design.md for complete field definitions and constraints
    - Follow standard Supabase migration practices (see [Database Management with Supabase](#database-management-with-supabase) section)
### RLS Policies for Core Tables (Tasks 1.1.1.3a-3f)
- [ ] **Task 1.1.1.3a:** Implement RLS policies for `users` table (company users see own record, MOH see all, self-service profile updates)
  - **Depends on:** Task 1.1.1.2 (users table migration), Task 1.1.1.2a (indexes for RLS performance)
  - **Estimated Time:** 2-3 hours
- [ ] **Task 1.1.1.3b:** Implement RLS policies for `system_config` table (Tier 1 only for module activation, read-only for others)
  - **Depends on:** Task 1.1.1.2 (system_config table migration), Task 1.1.1.2a (indexes)
  - **Estimated Time:** 1-2 hours
- [ ] **Task 1.1.1.3c:** Implement RLS policies for `audit_logs` table (MOH only, companies see own company's audit logs only)
  - **Depends on:** Task 1.1.1.2 (audit_logs table migration), Task 1.1.1.2a (indexes)
  - **Estimated Time:** 2-3 hours
- [ ] **Task 1.1.1.3d:** Implement RLS policies for `notifications` table (users see own notifications only)
  - **Depends on:** Task 1.1.1.2 (notifications table migration), Task 1.1.1.2a (indexes)
  - **Estimated Time:** 1-2 hours
- [ ] **Task 1.1.1.3e:** Implement RLS policies for communication tables (conversations, messages, message_attachments, message_read_receipts, conversation_participants - company isolation, MOH system-wide access, internal MOH conversations)
  - **Depends on:** Task 1.1.1.2d (communication tables migration), Task 1.1.1.2a (indexes)
  - **Estimated Time:** 4-6 hours (complex policies for multiple tables)
- [ ] **Task 1.1.1.3f:** Implement RLS policies for governance tables (follow_ups, meetings, meeting_attendees)
  - **follow_ups:** 
    - MOH Tier 1/2: See all follow-ups
    - Company users: See follow-ups for their company (company_id match)
    - Self-service: Users can update follow-ups assigned to them
  - **meetings:** 
    - MOH Tier 1/2: See all meetings
    - Company users: See meetings where they are attendees OR meetings related to their company
    - Create: MOH Tier 1/2 only
  - **meeting_attendees:** 
    - Inherit access from meetings table (users can see attendees for meetings they can access)
    - Update: MOH Tier 1/2 only (add/remove attendees)
  - **Reference:** [RLS Policy Framework](../../02-architecture/security/rls-policy-framework.md)
  - **Phase 0.6 Context:** See [Phase 0.6 Team Handoff - Dashboard & Governance](../../05-project-management/phases/phase-0-6-team-handoff.md#3-dashboard--governance)
  - **Estimated Time:** 3-5 hours
### Shared RPC Functions (Tasks 1.1.1.4a-4d)
- [ ] **Task 1.1.1.4a:** Implement `shared_get_user_permissions` RPC function (role-based permissions, permission matrix)
  - **Depends on:** Task 1.1.1.3a (users table RLS policies)
  - **Reference:** [Approvals Authority Matrix](../../03-governance/approvals-authority-matrix.md)
  - **Estimated Time:** 4-6 hours
- [ ] **Task 1.1.1.4a1:** Verify permission matrix implementation against approvals-authority-matrix.md (Rafi's Audit - Issue #17)
  - **Depends on:** Task 1.1.1.4a (permission function)
  - **Reference:** [Approvals Authority Matrix](../../03-governance/approvals-authority-matrix.md)
  - **Verification Checklist:**
    - Verify all roles are correctly defined (Company User, MOH Tier 1, MOH Tier 2)
    - Verify all action permissions match approvals-authority-matrix.md exactly
    - Verify module-specific permissions are correctly implemented
    - Test permission matrix with all role × action combinations
  - **Estimated Time:** 2-3 hours
- [ ] **Task 1.1.1.4b:** Implement `shared_check_module_active` RPC function (module activation check, caching strategy)
  - **Depends on:** Task 1.1.1.3b (system_config table RLS policies)
  - **Estimated Time:** 3-5 hours
- [ ] **Task 1.1.1.4c:** Implement `shared_create_audit_log` RPC function (hash chaining, audit log creation)
  - **Depends on:** Task 1.1.1.3c (audit_logs table RLS policies)
  - **Estimated Time:** 6-8 hours (includes hash chaining logic)
- [ ] **Task 1.1.1.4d:** Implement `shared_create_notification` RPC function (notification creation, batch notifications)
  - **Depends on:** Task 1.1.1.3d (notifications table RLS policies)
  - **Estimated Time:** 3-5 hours
- [ ] **Task 1.1.1.4e:** Create Edge Function for email notifications (read from notifications table, send emails, mark as sent)
  - **Reference:** [Edge Functions Specification](../../02-architecture/api/edge-functions.md), [Backend Error Handling Framework](../../02-architecture/security/backend-error-handling-framework.md)
  - **Error Handling Specifications:** (Leila's Audit - Issue #52)
    - Catch and handle all errors (network errors, email service errors, database errors)
    - Return appropriate HTTP status codes (200 OK, 400 Bad Request, 500 Internal Server Error)
    - Do not expose sensitive information in error responses
    - Log detailed errors to audit system with correlation ID for debugging
    - Implement retry logic for transient failures (network timeouts, rate limits)
  - **Testing Specifications:** (Leila's Audit - Issue #53)
    - Unit tests for email notification logic (test successful send, test failure handling)
    - Unit tests for authentication (test valid JWT, test invalid JWT, test missing JWT)
    - Integration tests with mock email service
    - Minimum 80% code coverage
  - **Estimated Time:** 4-6 hours
### Communication RPC Functions (Tasks 1.1.1.4f-4k)
- [ ] **Task 1.1.1.4f:** Create communication RPC functions (communications_create_conversation, communications_send_message, communications_mark_read, communications_archive_conversation, communications_create_announcement) - **Reference:** [Communication Channels Lifecycle](../../02-architecture/communication-channels-lifecycle.md) for state transitions and validation rules
  - **Depends on:** Task 1.1.1.3e (communication tables RLS policies)
  - **Estimated Time:** TBD (see subtasks 4g-4k for individual estimates)
- [ ] **Task 1.1.1.4g:** Implement communication RPC function - Create conversation (communications_create_conversation - validates permissions, company access, workflow entity access, CREATED → SENT state transition)
  - **Phase 0.6 Field:** Set conversations.lifecycle_state = 'CREATED' on creation, transition to 'SENT' when first message sent
  - **Reference:** [Communication Channels Lifecycle](../../02-architecture/communication-channels-lifecycle.md)
- [ ] **Task 1.1.1.4h:** Implement communication RPC function - Send message (communications_send_message - validates user is participant, creates message, notification, audit log, SENT → DELIVERED state transition)
  - **Phase 0.6 Fields:** 
    - Update conversations.lifecycle_state: 'CREATED'/'SENT' → 'DELIVERED' when message sent
    - Set messages.delivered_at timestamp when message delivered to recipient inbox
  - **Reference:** [Communication Channels Lifecycle](../../02-architecture/communication-channels-lifecycle.md)
  - **Phase 0.6 Context:** See [Phase 0.6 Team Handoff - Communication System](../../05-project-management/phases/phase-0-6-team-handoff.md#2-communication-system)
  - **Estimated Time:** 5-7 hours (complex state transitions and notifications)
- [ ] **Task 1.1.1.4i:** Implement communication RPC function - Mark read (communications_mark_read - creates read receipt, updates notification, audit log, DELIVERED → READ state transition)
  - **Depends on:** Task 1.1.1.4h (send message function)
  - **Phase 0.6 Field:** Update conversations.lifecycle_state: 'DELIVERED' → 'READ' when message read
  - **Reference:** [Communication Channels Lifecycle](../../02-architecture/communication-channels-lifecycle.md)
  - **Estimated Time:** 3-4 hours
- [ ] **Task 1.1.1.4j:** Implement communication RPC function - Archive conversation (communications_archive_conversation - soft delete, validates permissions, audit log, ACTIVE → ARCHIVED state transition)
  - **Depends on:** Task 1.1.1.4i (mark read function)
  - **Phase 0.6 Field:** Update conversations.lifecycle_state to 'ARCHIVED' on archive
  - **Reference:** [Communication Channels Lifecycle](../../02-architecture/communication-channels-lifecycle.md)
  - **Estimated Time:** 2-3 hours
- [ ] **Task 1.1.1.4k:** Implement communication RPC function - Create announcement (communications_create_announcement - MOH Tier 1 only, creates conversation, message, notifications for all recipients)
  - **Depends on:** Task 1.1.1.4g (create conversation function), Task 1.1.1.4d (notification function)
  - **Estimated Time:** 4-6 hours (batch notification logic)
- [ ] **Task 1.1.1.4l:** Create Edge Function for message email notifications (read from notifications table for new messages, send emails, mark as sent)
  - **Depends on:** Task 1.1.1.4h (send message function)
  - **Estimated Time:** 4-6 hours
### Audit Logging Triggers (Tasks 1.1.1.5a-5c)
- [ ] **Task 1.1.1.5a:** Implement audit logging trigger function (hash chaining logic, previous_hash calculation, current_hash generation)
  - **Depends on:** Task 1.1.1.3c (audit_logs table RLS policies), Task 1.1.1.2c (triggers infrastructure)
  - **Estimated Time:** 6-8 hours (complex hash chaining logic)
- [ ] **Task 1.1.1.5b:** Apply audit triggers to all audited tables (companies, products, skus, submissions, etc.)
  - **Depends on:** Task 1.1.1.5a (trigger function), Task 1.1.1.7 (RMM tables), Task 1.1.1.9 (VCI tables)
  - **Estimated Time:** 2-4 hours
- [ ] **Task 1.1.1.5c:** Implement audit log hash verification function (verify hash chain integrity, detect tampering)
  - **Depends on:** Task 1.1.1.5a (hash chaining logic)
  - **Estimated Time:** 3-4 hours
### Supabase Auth Configuration (Tasks 1.1.1.6a-6b)
- [ ] **Task 1.1.1.6a:** Configure Supabase Auth password policies (minimum length, complexity requirements, password reset policies)
  - **Depends on:** Task 1.1.1.1 (Supabase project structure)
  - **Estimated Time:** 1-2 hours
- [ ] **Task 1.1.1.6b:** Implement session management (session timeout, concurrent session limits, session invalidation)
  - **Depends on:** Task 1.1.1.6a (Auth configuration)
  - **Estimated Time:** 2-4 hours
- [ ] **Task 1.1.1.7:** Create database migration for RMM core tables (companies, products, skus, atc_codes, critical_medicines)
  - **Depends on:** Task 1.1.1.2 (core tables migration - users table for foreign keys)
  - **Migration Requirements:**
    - Create migration file: `supabase/migrations/YYYYMMDDHHMMSS_create_rmm_tables.sql`
    - Apply migration using `supabase migration apply` or auto-apply in local dev
    - Verify migration via `supabase migration list` or Supabase dashboard
    - Verify tables created using SQL queries (verify companies, products, skus, atc_codes, critical_medicines exist)
    - Verify SKU pharmaceutical attributes using SQL queries (check dosage_strength, dosage_form, pack_size, unit_of_measure columns)
    - Verify security best practices via SQL queries
  - **Estimated Time:** 4-6 hours
  - **Developer Notes:**
    - Follow standard Supabase migration practices (see [Database Management with Supabase](#database-management-with-supabase) section)
- [ ] **Task 1.1.1.7a:** Verify RMM schema completeness (all columns per schema-design.md, data types, nullable rules, **including SKU pharmaceutical attributes: dosage_strength, dosage_form, pack_size, unit_of_measure**)
  - **Depends on:** Task 1.1.1.7 (RMM migration)
  - **Verification Requirements:**
    - Verify all tables exist using SQL queries via Supabase dashboard
    - Use SQL queries to verify column definitions, data types, constraints, indexes
    - Verify SKU pharmaceutical attributes using SQL queries
  - **Estimated Time:** 1 hour
- [ ] **Task 1.1.1.7b:** Verify SKU pharmaceutical attributes implementation (ensure dosage_strength, dosage_form, pack_size, unit_of_measure are NOT NULL, add index on dosage_form)
  - **Depends on:** Task 1.1.1.7a (schema verification)
  - **Estimated Time:** 1 hour
### RLS Policies for RMM Tables (Tasks 1.1.1.8a-8e)
- [ ] **Task 1.1.1.8a:** Implement RLS policies for `companies` table (company isolation, MOH system-wide access, two-person rule enforcement)
  - **Depends on:** Task 1.1.1.7 (companies table migration), Task 1.1.1.2a (indexes)
  - **Estimated Time:** 3-4 hours (complex two-person rule logic)
- [ ] **Task 1.1.1.8b:** Implement RLS policies for `products` table (company-scoped, relationship-based via company_id)
  - **Depends on:** Task 1.1.1.8a (companies RLS), Task 1.1.1.7 (products table migration)
  - **Estimated Time:** 2-3 hours
- [ ] **Task 1.1.1.8c:** Implement RLS policies for `skus` table (relationship-based via products→companies)
  - **Depends on:** Task 1.1.1.8b (products RLS), Task 1.1.1.7 (skus table migration)
  - **Estimated Time:** 2-3 hours
- [ ] **Task 1.1.1.8d:** Implement RLS policies for `atc_codes` table (MOH write, company read-only)
  - **Depends on:** Task 1.1.1.7 (atc_codes table migration)
  - **Estimated Time:** 1-2 hours
- [ ] **Task 1.1.1.8e:** Implement RLS policies for `critical_medicines` table (MOH Tier 1 only)
  - **Depends on:** Task 1.1.1.7 (critical_medicines table migration)
  - **Estimated Time:** 1-2 hours
- [ ] **Task 1.1.1.9:** Create database migration for VCI core tables (aams_submissions, msq_submissions, wsl_submissions, thresholds, breaches, breach_analyses)
  - **Depends on:** Task 1.1.1.7 (RMM tables migration - references skus, companies)
  - **Reference:** [Schema Design - VCI Tables](../../02-architecture/database/schema-design.md#vci-tables), [Data Dictionary](../../02-architecture/database/data-dictionary.md)
  - **Migration Requirements:**
    - Create migration file: `supabase/migrations/YYYYMMDDHHMMSS_create_vci_tables.sql`
    - Apply migration using `supabase migration apply` or auto-apply in local dev
    - Verify migration via `supabase migration list` or Supabase dashboard
    - Verify tables created using SQL queries (verify all VCI tables exist)
    - Verify foreign keys using SQL queries (check foreign key constraints)
    - Verify security best practices via SQL queries
  - **Foreign Key Constraints:** Explicitly define all foreign key relationships per schema-design.md (e.g., aams_submissions.sku_id → skus.id, aams_submissions.company_id → companies.id, thresholds.sku_id → skus.id)
  - **Data Type Validation:** Verify all data types match schema-design.md and data-dictionary.md specifications (e.g., submission_data JSONB structure, threshold values numeric precision)
  - **Rollback Strategy:** Create rollback migration script, reference [Migration Strategy](../../02-architecture/database/migration-strategy.md) for rollback procedures
  - **Estimated Time:** 6-8 hours (multiple complex tables)
  - **Developer Notes:**
    - Follow standard Supabase migration practices (see [Database Management with Supabase](#database-management-with-supabase) section)
- [ ] **Task 1.1.1.9a:** Verify VCI schema completeness (all columns per schema-design.md, relationships)
  - **Depends on:** Task 1.1.1.9 (VCI migration)
  - **Reference:** [Schema Design - VCI Tables](../../02-architecture/database/schema-design.md#vci-tables), [Data Dictionary](../../02-architecture/database/data-dictionary.md)
  - **Verification Requirements:**
    - Verify all VCI tables exist using SQL queries via Supabase dashboard
    - Use SQL queries to verify columns, data types, nullable rules, foreign keys, indexes, constraints
  - **Verification Checklist:** Verify all tables, columns, data types, nullable rules, foreign key constraints, indexes, and constraints match schema-design.md exactly
  - **Estimated Time:** 1-2 hours
- [ ] **Task 1.1.1.10a:** Implement RLS policies for all VCI tables (aams_submissions, msq_submissions, wsl_submissions, thresholds, breaches, breach_analyses) with company isolation
- [ ] **Task 1.1.1.10b:** Create RPC functions for follow_ups table (follow_ups_create, follow_ups_update, follow_ups_list, follow_ups_get, follow_ups_complete)
  - **Reference:** [Schema Design - follow_ups table](../../02-architecture/database/schema-design.md#follow_ups)
  - **Phase 0.6 Context:** See [Phase 0.6 Team Handoff - Dashboard & Governance](../../05-project-management/phases/phase-0-6-team-handoff.md#3-dashboard--governance)
  - **Functions:**
    - follow_ups_create: Create new follow-up assignment (MOH Tier 1/2 only)
    - follow_ups_update: Update follow-up details (assigned user, priority, due_date, notes)
    - follow_ups_list: List follow-ups (role-based: MOH see all, company users see company-scoped)
    - follow_ups_get: Get single follow-up by ID
    - follow_ups_complete: Mark follow-up as completed (set status, completed_at, completed_by)
  - **Estimated Time:** 4-6 hours
  - **Developer Notes:**
    - Support polymorphic relationships via issue_reference_id + issue_reference_table
    - Validate priority values: 'normal', 'high', 'extreme'
    - Validate status values: 'pending', 'in_progress', 'completed', 'cancelled'
    - Use indexes for performance (idx_follow_ups_active_priority for active follow-ups query)
- [ ] **Task 1.1.1.10c:** Create RPC functions for meetings table (meetings_create, meetings_update, meetings_list, meetings_get, meetings_cancel, meetings_complete)
  - **Reference:** [Schema Design - meetings table](../../02-architecture/database/schema-design.md#meetings)
  - **Phase 0.6 Context:** See [Phase 0.6 Team Handoff - Dashboard & Governance](../../05-project-management/phases/phase-0-6-team-handoff.md#3-dashboard--governance)
  - **Functions:**
    - meetings_create: Create new meeting (MOH Tier 1/2 only)
    - meetings_update: Update meeting details (title, scheduled_at, location, agenda, reason)
    - meetings_list: List meetings (role-based: MOH see all, company users see related meetings)
    - meetings_get: Get single meeting by ID with attendees
    - meetings_cancel: Cancel meeting (set status, cancelled_at, cancelled_by)
    - meetings_complete: Mark meeting as completed (set status)
  - **Estimated Time:** 4-6 hours
  - **Developer Notes:**
    - Support polymorphic relationships via related_reference_id + related_reference_table
    - Validate meeting_type: 'emergency', 'scheduled', 'follow_up'
    - Validate status: 'scheduled', 'cancelled', 'completed'
    - Use indexes for performance (idx_meetings_upcoming for upcoming meetings query)
- [ ] **Task 1.1.1.10d:** Create RPC functions for meeting_attendees table (meeting_attendees_add, meeting_attendees_remove, meeting_attendees_list)
  - **Depends on:** Task 1.1.1.10c (meetings RPC functions), Task 1.1.1.3f (meeting_attendees RLS policies)
  - **Reference:** [Schema Design - meeting_attendees table](../../02-architecture/database/schema-design.md#meeting_attendees)
  - **Phase 0.6 Context:** See [Phase 0.6 Team Handoff - Dashboard & Governance](../../05-project-management/phases/phase-0-6-team-handoff.md#3-dashboard--governance)
  - **Functions:**
    - meeting_attendees_add: Add attendee to meeting (MOH Tier 1/2 only)
    - meeting_attendees_remove: Remove attendee from meeting (MOH Tier 1/2 only)
    - meeting_attendees_list: List attendees for a meeting (inherit meeting access permissions)
  - **Estimated Time:** 2-3 hours
  - **Developer Notes:**
    - Validate response_status: 'pending', 'accepted', 'declined', 'tentative'
    - Enforce RLS: users can only see attendees for meetings they can access

### Frontend Setup Tasks

**⚠️ IMPORTANT:** All frontend tasks must follow the Wireframe-First Implementation Principle. See [Phase 0.5: UI/UX Wireframes](phase-0-5-ui-ux-wireframes.md) for wireframe index and component mapping.

- [ ] **Task 1.1.1.11:** Initialize Next.js project structure (app router, layout structure) - **Reference:** [Navigation & Layout Patterns](../../02-architecture/frontend/navigation-layout-patterns.md)
- [ ] **Task 1.1.1.12:** Set up Supabase client configuration (create client utilities, environment variables) - **Reference:** [State Management UI Patterns](../../02-architecture/frontend/state-management-ui-patterns.md)
- [ ] **Task 1.1.1.12a:** Set up TanStack Query (React Query) for server state management (per state-management-ui-patterns.md)
- [ ] **Task 1.1.1.12b:** Create API client hooks (useCompanies, useProducts, useSubmissions, etc.)
- [ ] **Task 1.1.1.12c:** Implement loading state patterns (Skeleton, Spinner, ProgressBar - per state-management-ui-patterns.md)
- [ ] **Task 1.1.1.12d:** Implement error state patterns (ErrorBoundary, error alerts, retry logic - per state-management-ui-patterns.md)
- [ ] **Task 1.1.1.12e:** Implement empty state patterns (no data, no results, first-time experience - per state-management-ui-patterns.md)
- [ ] **Task 1.1.1.12f:** Implement success state patterns (toast notifications, success messages - per state-management-ui-patterns.md)
- [ ] **Task 1.1.1.12g:** Create React Context for client-side state (auth, theme, UI preferences)
- [ ] **Task 1.1.1.12h:** Implement ErrorBoundary component (catch React errors, display user-friendly error page)
- [ ] **Task 1.1.1.12i:** Implement API error handling (network errors, validation errors, permission errors - per state-management-ui-patterns.md)
- [ ] **Task 1.1.1.12j:** Implement retry logic for failed API calls
- [ ] **Task 1.1.1.12k:** Implement code splitting (dynamic imports for routes, lazy loading)
- [ ] **Task 1.1.1.12l:** Implement image optimization (Next.js Image component, lazy loading)
- [ ] **Task 1.1.1.13:** Implement authentication pages (login, register, forgot-password, reset-password) - **Wireframes:** [Task 0.5.1.11 - Login Page](../../04-design/user-experience/wireframes/00-core-foundation/authentication/task-0.5.1.11-login-page.md), [Task 0.5.1.12 - Registration Page](../../04-design/user-experience/wireframes/00-core-foundation/authentication/task-0.5.1.12-registration-page.md), [Task 0.5.1.13 - Forgot/Reset Password](../../04-design/user-experience/wireframes/00-core-foundation/authentication/task-0.5.1.13-forgot-reset-password.md) - **Reference:** [Form Design Patterns](../../02-architecture/frontend/form-design-patterns.md), [Navigation & Layout Patterns](../../02-architecture/frontend/navigation-layout-patterns.md)
- [ ] **Task 1.1.1.14:** Create protected route middleware (auth check, role-based access) - **Reference:** [Role-Based UI Patterns](../../02-architecture/frontend/role-based-ui-patterns.md), [Navigation & Layout Patterns](../../02-architecture/frontend/navigation-layout-patterns.md)
- [ ] **Task 1.1.1.14a:** Create useUserRole hook (per role-based-ui-patterns.md - role detection, permissions, helper functions) - **Reference:** [Role-Based UI Patterns](../../02-architecture/frontend/role-based-ui-patterns.md), [State Management UI Patterns](../../02-architecture/frontend/state-management-ui-patterns.md)
- [ ] **Task 1.1.1.14b:** Create RoleGuard component (protect routes/components based on role) - **Reference:** [Role-Based UI Patterns](../../02-architecture/frontend/role-based-ui-patterns.md), [UI Component Specifications](../../02-architecture/frontend/ui-component-specifications.md)
- [ ] **Task 1.1.1.14c:** Create PermissionGuard component (protect actions based on permissions) - **Reference:** [Role-Based UI Patterns](../../02-architecture/frontend/role-based-ui-patterns.md), [UI Component Specifications](../../02-architecture/frontend/ui-component-specifications.md)
- [ ] **Task 1.1.1.14d:** Implement module activation check UI (redirect/hide modules if not active) - **Reference:** [Role-Based UI Patterns](../../02-architecture/frontend/role-based-ui-patterns.md), [Navigation & Layout Patterns](../../02-architecture/frontend/navigation-layout-patterns.md)
- [ ] **Task 1.1.1.15:** Implement base layout components (dashboard layout, navigation, header, footer) - **Wireframes:** [Task 0.5.1.14 - Dashboard Layout Structure](../../04-design/user-experience/wireframes/00-core-foundation/layout-navigation/task-0.5.1.14-dashboard-layout-structure.md), [Task 0.5.1.15 - Header Component](../../04-design/user-experience/wireframes/00-core-foundation/layout-navigation/task-0.5.1.15-header-component.md), [Task 0.5.1.16 - Sidebar Navigation](../../04-design/user-experience/wireframes/00-core-foundation/layout-navigation/task-0.5.1.16-sidebar-navigation.md) - **Reference:** [Navigation & Layout Patterns](../../02-architecture/frontend/navigation-layout-patterns.md)
- [ ] **Task 1.1.1.15a:** Implement Header component (logo, user menu, notifications, search - per navigation-layout-patterns.md) - **Wireframe:** [Task 0.5.1.15 - Header Component](../../04-design/user-experience/wireframes/00-core-foundation/layout-navigation/task-0.5.1.15-header-component.md) - **Reference:** [Navigation & Layout Patterns](../../02-architecture/frontend/navigation-layout-patterns.md)
- [ ] **Task 1.1.1.15b:** Implement Sidebar component (collapsible, module grouping, active states, badges - per navigation-layout-patterns.md) - **Wireframe:** [Task 0.5.1.16 - Sidebar Navigation](../../04-design/user-experience/wireframes/00-core-foundation/layout-navigation/task-0.5.1.16-sidebar-navigation.md) - **Reference:** [Navigation & Layout Patterns](../../02-architecture/frontend/navigation-layout-patterns.md)
- [ ] **Task 1.1.1.15c:** Implement DashboardLayout component (header + sidebar + main content area) - **Wireframe:** [Task 0.5.1.14 - Dashboard Layout Structure](../../04-design/user-experience/wireframes/00-core-foundation/layout-navigation/task-0.5.1.14-dashboard-layout-structure.md) - **Reference:** [Navigation & Layout Patterns](../../02-architecture/frontend/navigation-layout-patterns.md)
- [ ] **Task 1.1.1.15d:** Implement MainContent component (breadcrumbs, page title, action buttons area) - **Reference:** [Navigation & Layout Patterns](../../02-architecture/frontend/navigation-layout-patterns.md)
- [ ] **Task 1.1.1.15e:** Implement Footer component (for public pages) - **Reference:** [Navigation & Layout Patterns](../../02-architecture/frontend/navigation-layout-patterns.md)
- [ ] **Task 1.1.1.15f:** Implement responsive breakpoints and mobile navigation (hamburger menu for tablet) - **Reference:** [Navigation & Layout Patterns](../../02-architecture/frontend/navigation-layout-patterns.md)
- [ ] **Task 1.1.1.15g:** Implement responsive breakpoints (mobile, tablet, desktop - per navigation-layout-patterns.md) - **Reference:** [Navigation & Layout Patterns](../../02-architecture/frontend/navigation-layout-patterns.md)
- [ ] **Task 1.1.1.15h:** Implement mobile navigation (hamburger menu, bottom navigation for mobile) - **Reference:** [Navigation & Layout Patterns](../../02-architecture/frontend/navigation-layout-patterns.md)
- [ ] **Task 1.1.1.16:** Create notification center component (in-app notifications UI) - **Wireframe:** [Task 0.5.1.17 - Notification Center Component](../../04-design/user-experience/wireframes/00-core-foundation/layout-navigation/task-0.5.1.17-notification-center-component.md)
- [ ] **Task 1.1.1.16a:** Implement NotificationCenter component (dropdown/popover with notifications list) - **Wireframe:** [Task 0.5.1.17 - Notification Center Component](../../04-design/user-experience/wireframes/00-core-foundation/layout-navigation/task-0.5.1.17-notification-center-component.md) - **Reference:** [UI Component Specifications](../../02-architecture/frontend/ui-component-specifications.md), [Navigation & Layout Patterns](../../02-architecture/frontend/navigation-layout-patterns.md)
- [ ] **Task 1.1.1.16b:** Implement NotificationItem component (notification types, icons, read/unread states) - **Wireframe:** [Task 0.5.1.17 - Notification Center Component](../../04-design/user-experience/wireframes/00-core-foundation/layout-navigation/task-0.5.1.17-notification-center-component.md) - **Reference:** [UI Component Specifications](../../02-architecture/frontend/ui-component-specifications.md)
- [ ] **Task 1.1.1.16c:** Implement notification badge (unread count in header) - **Reference:** [UI Component Specifications](../../02-architecture/frontend/ui-component-specifications.md), [Navigation & Layout Patterns](../../02-architecture/frontend/navigation-layout-patterns.md)
- [ ] **Task 1.1.1.16d:** Create useNotifications hook (fetch, mark as read, real-time updates) - **Reference:** [State Management UI Patterns](../../02-architecture/frontend/state-management-ui-patterns.md)
- [ ] **Task 1.1.1.16e:** Implement toast notification system (success, error, warning, info - for action feedback) - **Reference:** [UI Component Specifications](../../02-architecture/frontend/ui-component-specifications.md)
- [ ] **Task 1.1.1.16f:** Create communication components (inbox, conversation detail, compose message) - **Reference:** [UI Component Specifications](../../02-architecture/frontend/ui-component-specifications.md)
- [ ] **Task 1.1.1.16g:** Implement CommunicationsInbox component (conversation list, unread indicators, filters, search, role-based access) - **Wireframe:** [Task 0.5.1.24 - Communications Inbox List](../../04-design/user-experience/wireframes/00-core-foundation/communications/task-0.5.1.24-communications-inbox-list.md) - **Reference:** [UI Component Specifications](../../02-architecture/frontend/ui-component-specifications.md), [Navigation & Layout Patterns](../../02-architecture/frontend/navigation-layout-patterns.md), [Role-Based UI Patterns](../../02-architecture/frontend/role-based-ui-patterns.md)
- [ ] **Task 1.1.1.16h:** Implement ConversationDetail component (message thread, reply interface, attachments, read receipts, workflow context) - **Wireframe:** [Task 0.5.1.25 - Conversation Detail](../../04-design/user-experience/wireframes/00-core-foundation/communications/task-0.5.1.25-conversation-detail.md) - **Reference:** [UI Component Specifications](../../02-architecture/frontend/ui-component-specifications.md), [Navigation & Layout Patterns](../../02-architecture/frontend/navigation-layout-patterns.md)
- [ ] **Task 1.1.1.16i:** Implement ComposeMessage component (recipient selection, subject, content, attachments, workflow entity linking) - **Wireframe:** [Task 0.5.1.26 - Compose Message](../../04-design/user-experience/wireframes/00-core-foundation/communications/task-0.5.1.26-compose-message.md) - **Reference:** [UI Component Specifications](../../02-architecture/frontend/ui-component-specifications.md), [Form Design Patterns](../../02-architecture/frontend/form-design-patterns.md)
- [ ] **Task 1.1.1.16j:** Implement SentMessages component (sent conversations list, status indicators) - **Wireframe:** [Task 0.5.1.27 - Sent Messages](../../04-design/user-experience/wireframes/00-core-foundation/communications/task-0.5.1.27-sent-messages.md) - **Reference:** [UI Component Specifications](../../02-architecture/frontend/ui-component-specifications.md), [Navigation & Layout Patterns](../../02-architecture/frontend/navigation-layout-patterns.md)
- [ ] **Task 1.1.1.16k:** Implement SystemAnnouncements component (MOH Tier 1 only - announcement list, creation interface, broadcast controls) - **Wireframe:** [Task 0.5.1.28 - System Announcements](../../04-design/user-experience/wireframes/00-core-foundation/communications/task-0.5.1.28-system-announcements.md) - **Reference:** [UI Component Specifications](../../02-architecture/frontend/ui-component-specifications.md), [Navigation & Layout Patterns](../../02-architecture/frontend/navigation-layout-patterns.md), [Role-Based UI Patterns](../../02-architecture/frontend/role-based-ui-patterns.md), [Form Design Patterns](../../02-architecture/frontend/form-design-patterns.md)
- [ ] **Task 1.1.1.16l:** Implement CommunicationWorkflowIntegration component (message button, conversation list, context display on workflow pages) - **Wireframe:** [Task 0.5.1.29 - Communication Integration Workflow](../../04-design/user-experience/wireframes/00-core-foundation/communications/task-0.5.1.29-communication-integration-workflow.md) - **Reference:** [UI Component Specifications](../../02-architecture/frontend/ui-component-specifications.md), [Navigation & Layout Patterns](../../02-architecture/frontend/navigation-layout-patterns.md)
- [ ] **Task 1.1.1.16m:** Create useCommunications hook (fetch conversations, messages, mark as read, real-time updates) - **Reference:** [State Management UI Patterns](../../02-architecture/frontend/state-management-ui-patterns.md)
- [ ] **Task 1.1.1.16n:** Implement communication real-time updates (Supabase Realtime for new messages, read receipts, conversation updates) - **Reference:** [State Management UI Patterns](../../02-architecture/frontend/state-management-ui-patterns.md)
- [ ] **Task 1.1.1.17:** Set up Tailwind CSS and shadcn/ui component library - **Reference:** [Design System](../../02-architecture/frontend/design-system.md), [UI Component Specifications](../../02-architecture/frontend/ui-component-specifications.md)
- [ ] **Task 1.1.1.17a:** Implement design system tokens (colors, typography, spacing, shadows - per design-system.md) - **Reference:** [Design System](../../02-architecture/frontend/design-system.md)
- [ ] **Task 1.1.1.17b:** Configure Tailwind with design system customizations (tailwind.config.js) - **Reference:** [Design System](../../02-architecture/frontend/design-system.md)
- [ ] **Task 1.1.1.17c:** Install and configure shadcn/ui base components (button, input, select, etc.) - **Reference:** [UI Component Specifications](../../02-architecture/frontend/ui-component-specifications.md)
- [ ] **Task 1.1.1.17d:** Create custom theme configuration (color palette, typography scale) - **Reference:** [Design System](../../02-architecture/frontend/design-system.md)
- [ ] **Task 1.1.1.17e:** Implement status color system (pending, approved, rejected, draft, etc.) - **Reference:** [Design System](../../02-architecture/frontend/design-system.md), [UI Component Specifications](../../02-architecture/frontend/ui-component-specifications.md)
- [ ] **Task 1.1.1.17f:** Implement base UI components from ui-component-specifications.md (Button, Input, Select, Checkbox, Radio, Textarea, DatePicker) - **Reference:** [UI Component Specifications](../../02-architecture/frontend/ui-component-specifications.md)
- [ ] **Task 1.1.1.17g:** Implement form components (FormField, FormGroup, FormLabel, FormError, FormHelperText) - **Reference:** [UI Component Specifications](../../02-architecture/frontend/ui-component-specifications.md), [Form Design Patterns](../../02-architecture/frontend/form-design-patterns.md)
- [ ] **Task 1.1.1.17h:** Implement data display components (Table, Card, Badge, StatusBadge, Avatar) - **Reference:** [UI Component Specifications](../../02-architecture/frontend/ui-component-specifications.md)
- [ ] **Task 1.1.1.17i:** Implement feedback components (Alert, Toast, LoadingSpinner, Skeleton, ProgressBar) - **Reference:** [UI Component Specifications](../../02-architecture/frontend/ui-component-specifications.md)
- [ ] **Task 1.1.1.17j:** Implement navigation components (Breadcrumbs, Sidebar, SidebarItem, SidebarGroup, Header, Footer) - **Reference:** [UI Component Specifications](../../02-architecture/frontend/ui-component-specifications.md), [Navigation & Layout Patterns](../../02-architecture/frontend/navigation-layout-patterns.md)
- [ ] **Task 1.1.1.17k:** Implement accessibility features (ARIA labels, keyboard navigation, focus management) - **Reference:** [UI Component Specifications](../../02-architecture/frontend/ui-component-specifications.md)
- [ ] **Task 1.1.1.17l:** Set up screen reader testing and WCAG 2.1 AA compliance validation - **Reference:** [UI Component Specifications](../../02-architecture/frontend/ui-component-specifications.md)
- [ ] **Task 1.1.1.17m:** Implement focus trap for modals/dialogs - **Reference:** [UI Component Specifications](../../02-architecture/frontend/ui-component-specifications.md)
- [ ] **Task 1.1.1.17n:** Implement skip navigation link - **Reference:** [Navigation & Layout Patterns](../../02-architecture/frontend/navigation-layout-patterns.md), [UI Component Specifications](../../02-architecture/frontend/ui-component-specifications.md)
- [ ] **Task 1.1.1.17o:** Ensure color contrast meets WCAG AA standards (per design-system.md) - **Reference:** [Design System](../../02-architecture/frontend/design-system.md), [UI Component Specifications](../../02-architecture/frontend/ui-component-specifications.md)
- [ ] **Task 1.1.1.18:** Create routing structure (public routes, auth routes, dashboard routes) - **Reference:** [Navigation & Layout Patterns](../../02-architecture/frontend/navigation-layout-patterns.md)
- [ ] **Task 1.1.1.18g:** Implement communication routes (/communications/inbox, /communications/inbox/[conversation_id], /communications/sent, /communications/compose, /communications/announcements, /communications/archived) - **Wireframe for Archived:** [Task 0.5.1.36 - Archived Conversations](../../04-design/user-experience/wireframes/00-core-foundation/communications/task-0.5.1.36-archived-conversations.md)
- [ ] **Task 1.1.1.18a:** Set up React Hook Form + Zod validation (per form-design-patterns.md)
- [ ] **Task 1.1.1.18b:** Create FormField wrapper component (label, error, helper text, required indicator) - **Reference:** [Form Design Patterns](../../02-architecture/frontend/form-design-patterns.md), [UI Component Specifications](../../02-architecture/frontend/ui-component-specifications.md)
- [ ] **Task 1.1.1.18c:** Create FormGroup component (field grouping, sectioned forms) - **Reference:** [Form Design Patterns](../../02-architecture/frontend/form-design-patterns.md), [UI Component Specifications](../../02-architecture/frontend/ui-component-specifications.md)
- [ ] **Task 1.1.1.18d:** Implement form validation patterns (onBlur, onChange, error display per form-design-patterns.md) - **Reference:** [Form Design Patterns](../../02-architecture/frontend/form-design-patterns.md)
- [ ] **Task 1.1.1.18e:** Set up date-fns and date-fns-tz (timezone handling for Morocco time) - **Reference:** [Form Design Patterns](../../02-architecture/frontend/form-design-patterns.md)
- [ ] **Task 1.1.1.18f:** Create DatePicker component (per ui-component-specifications.md) - **Reference:** [UI Component Specifications](../../02-architecture/frontend/ui-component-specifications.md), [Form Design Patterns](../../02-architecture/frontend/form-design-patterns.md)
- [ ] **Task 1.1.1.19:** Implement homepage (public landing page with MOH mission focus) - **Wireframe:** [Task 0.5.1.1 - Public Homepage](../../04-design/user-experience/wireframes/00-core-foundation/public-pages/task-0.5.1.1-public-homepage.md) - **Reference:** [Navigation & Layout Patterns](../../02-architecture/frontend/navigation-layout-patterns.md)
- [ ] **Task 1.1.1.20:** Create dashboard home page (role-based dashboard view) - **Reference:** [Navigation & Layout Patterns](../../02-architecture/frontend/navigation-layout-patterns.md), [Role-Based UI Patterns](../../02-architecture/frontend/role-based-ui-patterns.md)
- [ ] **Task 1.1.1.20a:** Implement role-based dashboard views (Company Dashboard, MOH Tier 1 Dashboard, Tier 2 Dashboard - per role-based-ui-patterns.md) - **Wireframes:** [Task 0.5.1.18 - Company Dashboard](../../04-design/user-experience/wireframes/00-core-foundation/dashboard/task-0.5.1.18-company-dashboard.md), [Task 0.5.1.19 - MOH Tier 1 Dashboard](../../04-design/user-experience/wireframes/00-core-foundation/dashboard/task-0.5.1.19-moh-tier1-dashboard.md), [Task 0.5.1.20 - MOH Tier 2 Dashboard](../../04-design/user-experience/wireframes/00-core-foundation/dashboard/task-0.5.1.20-moh-tier2-dashboard.md) - **Reference:** [Role-Based UI Patterns](../../02-architecture/frontend/role-based-ui-patterns.md), [Navigation & Layout Patterns](../../02-architecture/frontend/navigation-layout-patterns.md)
- [ ] **Task 1.1.1.20b:** Implement role-based navigation menu (different sidebar items per role) - **Reference:** [Role-Based UI Patterns](../../02-architecture/frontend/role-based-ui-patterns.md), [Navigation & Layout Patterns](../../02-architecture/frontend/navigation-layout-patterns.md)
- [ ] **Task 1.1.1.20c:** Add Communications link to Global section in sidebar navigation (with unread badge count) - **Reference:** [Navigation & Layout Patterns](../../02-architecture/frontend/navigation-layout-patterns.md), [UI Component Specifications](../../02-architecture/frontend/ui-component-specifications.md)
- [ ] **Task 1.1.1.20d:** Implement user profile page (user information, account settings, preferences) - **Wireframe:** [Task 0.5.1.22 - Profile Page](../../04-design/user-experience/wireframes/00-core-foundation/dashboard/task-0.5.1.22-profile-page.md) - **Reference:** [Navigation & Layout Patterns](../../02-architecture/frontend/navigation-layout-patterns.md), [Form Design Patterns](../../02-architecture/frontend/form-design-patterns.md)
  - **Phase 0.6 Fields to Implement:**
    - Avatar upload/display (avatar_url field, Supabase Storage: avatars/{user_id}/{filename})
    - Timezone preference selector (timezone field, default: 'UTC+01:00', Morocco timezone options)
    - Language preference selector (language field, default: 'en', language options)
    - Notification preferences (notification_preferences JSONB: email_enabled, submission_updates, compliance_alerts, enforcement_actions, system_announcements)
  - **Reference:** [Phase 0.6 Team Handoff - User Profile Management](../../05-project-management/phases/phase-0-6-team-handoff.md#1-user-profile-management), [File Upload Storage Security](../../02-architecture/security/file-upload-storage-security.md)
  - **File Upload Security Specifications:** (Salim's Audit - Issue #27)
    - File type validation: Allow only image types (jpeg, jpg, png, gif, webp), reject other file types
    - File size limits: Maximum 5MB per file (configurable via environment variable)
    - Filename sanitization: Remove special characters, generate UUID-based filename to prevent path traversal
    - Virus/malware scanning: Implement file scanning before storage (consider external service or Supabase Edge Function)
    - Secure storage: Use Supabase Storage with RLS policies, private bucket with signed URLs for access
    - Content-Type validation: Verify actual file content matches declared file type (magic number validation)
    - Reference: [File Upload Storage Security](../../02-architecture/security/file-upload-storage-security.md)
  - **Estimated Time:** 6-10 hours
  - **Developer Notes:**
    - Avatar uploads: Use Supabase Storage bucket 'avatars', path: {user_id}/{filename}
    - Timezone: Use date-fns-tz for timezone handling (Morocco standard: UTC+01:00)
    - Language: Support English (en) initially, structure for future i18n expansion
    - Notification preferences: JSONB form with boolean checkboxes for each preference type

### Integration Tasks
- [ ] **Task 1.1.1.21:** Set up CI/CD pipeline (GitHub Actions or Vercel)
- [ ] **Task 1.1.1.21a:** Set up testing infrastructure (test database, test environment configuration, CI/CD test integration)
- [ ] **Task 1.1.1.21b:** Comprehensive schema verification after all migrations (Nadia's Audit - Issue #13)
  - **Depends on:** All migration tasks (1.1.1.2, 1.1.1.7, 1.1.1.9)
  - **Reference:** [Schema Design](../../02-architecture/database/schema-design.md), [Data Dictionary](../../02-architecture/database/data-dictionary.md)
  - **Verification Requirements:**
    - Verify all migrations applied via `supabase migration list` or Supabase dashboard migration history
    - Verify all tables exist using SQL queries via Supabase dashboard
    - Use SQL queries for comprehensive schema verification:
      - Verify all columns with correct data types (query information_schema.columns)
      - Verify all foreign key constraints (query information_schema.table_constraints, key_column_usage)
      - Verify all indexes (query pg_indexes)
      - Verify all constraints (NOT NULL, CHECK, UNIQUE) (query information_schema.constraint_column_usage)
      - Verify all triggers (query pg_trigger)
    - Verify security and performance best practices via SQL queries and EXPLAIN ANALYZE
  - **Verification Checklist:**
    - Verify all tables exist per schema-design.md
    - Verify all columns exist with correct data types per data-dictionary.md
    - Verify all foreign key constraints are correctly defined
    - Verify all indexes are created per schema-design.md
    - Verify all constraints (NOT NULL, CHECK, UNIQUE) are correctly defined
    - Verify all triggers are correctly applied (audit logging)
    - Create automated schema verification script using SQL queries (compare actual schema to schema-design.md via information_schema queries)
  - **Estimated Time:** 3-4 hours
- [ ] **Task 1.1.1.22:** Configure environment variables (dev, staging, prod)
- [ ] **Task 1.1.1.23:** Set up database seeding script structure (seeded Supabase dev/staging data only - TypeScript/JavaScript, seed files location, execution order)
  - **Rule:** No local runtime mock providers. Frontend must query Supabase for all displayed data during Phase 1.

### Background Job Infrastructure
- [ ] **Task 1.1.1.4m:** Create background job queue infrastructure (Leila's Audit - Issue #31)
  - **Reference:** [Edge Functions Specification](../../02-architecture/api/edge-functions.md)
  - **Background Job Queue Specifications:**
    - Use pg_boss or similar for PostgreSQL-native job queue
    - Job types: email_notification, report_generation, data_export, scheduled_calculation
    - Job retry logic: Exponential backoff, max 3 retries, dead letter queue for failed jobs
    - Job monitoring: Job status tracking, execution time logging, failure alerting
    - Concurrency control: Limit concurrent jobs per type, prevent duplicate jobs
  - **Estimated Time:** 6-8 hours

---

## Subphase 1.1.2: RMM Module - Core Registry Management (Week 2-3)

**Seed Data Gate (Required):**
- Before starting RMM frontend pages, apply the seed migration stage `seed_1_1_2_rmm` per [Phase 1.1 Seeded Supabase "Mock Data" Playbook](phase-1-1-mockdata.md) (versioned SQL migrations, idempotent).

### RMM Backend Tasks
- [ ] **Task 1.1.2.1:** Create RMM RPC functions - Company CRUD (rmm_create_company, rmm_update_company, rmm_get_company, rmm_list_companies)
  - **Reference:** [Workflow Architecture](../../02-architecture/workflow-architecture.md), [Backend Error Handling Framework](../../02-architecture/security/backend-error-handling-framework.md), [Backend Input Sanitization Strategy](../../02-architecture/security/backend-input-sanitization-strategy.md)
  - **Workflow State Machine Specifications:** Registry submission workflow state machine (draft → pending_verification → pending_approval → approved → pending_implementation → implemented → completed, with rejection path: pending_verification → rejected, pending_approval → rejected)
  - **State Transition Validation Rules:** Validate state transitions are valid per workflow-architecture.md, prevent invalid transitions (e.g., cannot go from draft directly to approved, must go through verification first)
  - **Input Validation:** Validate all input parameters per backend-validation-strategy.md (required fields, data types, format validation, business rule validation)
  - **Input Sanitization Specifications:** (Salim's Audit - Issue #50)
    - Sanitize all text inputs (company_name, description, address) - escape HTML, prevent SQL injection (parameterized queries)
    - Validate email format, phone format
    - Trim whitespace, normalize unicode
  - **Error Handling Specifications:** (Maya's Audit - Issue #48)
    - Return appropriate error codes (400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 500 Internal Server Error)
    - Do not expose sensitive information in error messages (database structure, internal paths)
    - Log detailed errors to audit system for debugging
  - **Testing Specifications:** (Maya's Audit - Issue #49)
    - Unit tests for all CRUD operations (create, read, update, delete)
    - Unit tests for validation logic (required fields, format validation)
    - Unit tests for error handling (invalid inputs, permission errors)
    - Minimum 80% code coverage
- [ ] **Task 1.1.2.1a:** Implement RMM CRUD functions with workflow state validation (prevent invalid state transitions, error handling patterns)
- [ ] **Task 1.1.2.2:** Create RMM RPC functions - Product CRUD (rmm_create_product, rmm_update_product, rmm_get_product, rmm_list_products)
- [ ] **Task 1.1.2.3:** Create RMM RPC functions - SKU CRUD (rmm_create_sku, rmm_update_sku, rmm_get_sku, rmm_list_skus)
- [ ] **Task 1.1.2.4:** Create RMM RPC functions - ATC Code management (rmm_list_atc_codes, rmm_get_atc_code) - MOH only
- [ ] **Task 1.1.2.5:** Create RMM RPC functions - Critical Medicine management (rmm_designate_critical_medicine, rmm_list_critical_medicines) - MOH only
- [ ] **Task 1.1.2.6:** Implement registry submission workflow - Create submission (rmm_submit_registry_update)
- [ ] **Task 1.1.2.6a:** Implement state machine validation in `rmm_submit_registry_update` (status transition validation, business rule checks)
- [ ] **Task 1.1.2.7:** Implement registry submission workflow - Tier 2 verification (rmm_verify_registry_submission)
- [ ] **Task 1.1.2.8:** Implement registry submission workflow - Tier 1 approval (rmm_approve_registry_submission)
- [ ] **Task 1.1.2.9:** Implement registry submission workflow - Tier 2 implementation (rmm_implement_registry_update)
- [ ] **Task 1.1.2.10:** Implement registry submission workflow - Completion (rmm_complete_registry_update)
- [ ] **Task 1.1.2.11:** Implement registry submission workflow - Rejection (rmm_reject_registry_submission)
- [ ] **Task 1.1.2.11a:** Implement rejection with feedback workflow (Tier 1 → Tier 2 for revision, max 2 iterations before Tier 1 direct action)
- [ ] **Task 1.1.2.11b:** Implement rejection iteration tracking (max 2 iterations before Tier 1 must take direct action)
- [ ] **Task 1.1.2.12:** Implement MOH submission workflow - Peer review (rmm_peer_review_registry_submission)
- [ ] **Task 1.1.2.13:** Implement cascade deactivation logic (company deactivation → products/SKUs cascade)
- [ ] **Task 1.1.2.14:** Implement soft delete safeguards (deletion workflow, pending period, reversal logic)
- [ ] **Task 1.1.2.15:** Implement two-person rule for critical actions (company suspension/deletion, critical medicine product deactivation/deletion)
  - **Reference:** [Approvals Authority Matrix](../../03-governance/approvals-authority-matrix.md), [Governance Workflows](../../03-governance/governance-workflows.md)
  - **Two-Person Rule Validation Specifications:** (Fatima's Audit - Issue #42)
    - Validator 1: Initial requestor (MOH Tier 1 or Tier 2 depending on action type)
    - Validator 2: Approver must be different user than requestor (cannot approve own actions)
    - Critical actions requiring two-person rule: Company suspension, company deletion, critical medicine designation/removal, enforcement action approval (fines, suspensions)
    - Implementation: RPC function validates approver_id != requestor_id, both must have appropriate role permissions
    - Audit trail: Log both requestor and approver IDs with timestamps
  - **Estimated Time:** 4-6 hours
- [ ] **Task 1.1.2.15a:** Implement mandatory justification capture for all Tier 1 enforcement actions (50+ chars, evidence references, regulatory basis - immutable audit trail)
- [ ] **Task 1.1.2.15b:** Implement RBAC permission checking in RPC functions (validate user permissions before state transitions)

### RMM Frontend Tasks
- [ ] **Task 1.1.2.16:** Create RMM module layout and navigation - **Wireframe:** [Task 0.5.2.1 - RMM Overview](../../04-design/user-experience/wireframes/01-rmm/overview/task-0.5.2.1-rmm-overview.md)
- [ ] **Task 1.1.2.16a:** Implement module activation banner/indicator (if module inactive) - **Wireframe:** [Task 0.5.2.1 - RMM Overview](../../04-design/user-experience/wireframes/01-rmm/overview/task-0.5.2.1-rmm-overview.md)
- [ ] **Task 1.1.2.17:** Implement Companies list page (table view, filters, search, pagination) - **Wireframe:** [Task 0.5.2.2 - Companies List](../../04-design/user-experience/wireframes/01-rmm/companies/task-0.5.2.2-companies-list.md) - **Reference:** [Navigation & Layout Patterns](../../02-architecture/frontend/navigation-layout-patterns.md)
- [ ] **Task 1.1.2.17a:** Implement DataTable component (sorting, filtering, pagination, row selection - per ui-component-specifications.md) - **Reference:** [UI Component Specifications](../../02-architecture/frontend/ui-component-specifications.md)
- [ ] **Task 1.1.2.17b:** Implement SearchBar component (search input with filters dropdown) - **Reference:** [UI Component Specifications](../../02-architecture/frontend/ui-component-specifications.md)
- [ ] **Task 1.1.2.17c:** Implement responsive table (horizontal scroll, card view on mobile) - **Reference:** [UI Component Specifications](../../02-architecture/frontend/ui-component-specifications.md), [Navigation & Layout Patterns](../../02-architecture/frontend/navigation-layout-patterns.md)
- [ ] **Task 1.1.2.17d:** Implement virtual scrolling for large tables (if >100 rows) - **Reference:** [UI Component Specifications](../../02-architecture/frontend/ui-component-specifications.md)
- [ ] **Task 1.1.2.18:** Implement Company detail page (company information display) - **Wireframe:** [Task 0.5.2.3 - Company Detail](../../04-design/user-experience/wireframes/01-rmm/companies/task-0.5.2.3-company-detail.md) - **Reference:** [Navigation & Layout Patterns](../../02-architecture/frontend/navigation-layout-patterns.md)
- [ ] **Task 1.1.2.18a:** Implement DetailPage layout (sections, tabs, action buttons) - **Reference:** [Navigation & Layout Patterns](../../02-architecture/frontend/navigation-layout-patterns.md)
- [ ] **Task 1.1.2.19:** Implement Company create/edit forms (form validation, submission workflow) - **Wireframe:** [Task 0.5.2.8 - Company Create/Edit Form](../../04-design/user-experience/wireframes/01-rmm/companies/task-0.5.2.8-company-create-edit-form.md) - **Reference:** [Form Design Patterns](../../02-architecture/frontend/form-design-patterns.md)
- [ ] **Task 1.1.2.19a:** Implement draft auto-save functionality (per form-design-patterns.md) - **Reference:** [Form Design Patterns](../../02-architecture/frontend/form-design-patterns.md)
- [ ] **Task 1.1.2.19b:** Implement form sections (company information, contact information - per form-design-patterns.md) - **Reference:** [Form Design Patterns](../../02-architecture/frontend/form-design-patterns.md)
- [ ] **Task 1.1.2.19c:** Implement form error display (field-level and form-level errors - per form-design-patterns.md) - **Reference:** [Form Design Patterns](../../02-architecture/frontend/form-design-patterns.md)
- [ ] **Task 1.1.2.20:** Implement Products list page (company-scoped, filters, search) - **Wireframe:** [Task 0.5.2.4 - Products List](../../04-design/user-experience/wireframes/01-rmm/products/task-0.5.2.4-products-list.md) - **Reference:** [Navigation & Layout Patterns](../../02-architecture/frontend/navigation-layout-patterns.md)
- [ ] **Task 1.1.2.21:** Implement Product detail page (product information, SKUs list) - **Wireframe:** [Task 0.5.2.5 - Product Detail](../../04-design/user-experience/wireframes/01-rmm/products/task-0.5.2.5-product-detail.md) - **Reference:** [Navigation & Layout Patterns](../../02-architecture/frontend/navigation-layout-patterns.md)
- [ ] **Task 1.1.2.22:** Implement Product create/edit forms (form validation, submission workflow) - **Wireframe:** [Task 0.5.2.9 - Product Create/Edit Form](../../04-design/user-experience/wireframes/01-rmm/products/task-0.5.2.9-product-create-edit-form.md) - **Reference:** [Form Design Patterns](../../02-architecture/frontend/form-design-patterns.md)
- [ ] **Task 1.1.2.23:** Implement SKUs list page (product-scoped, filters, search) - **Wireframe:** [Task 0.5.2.6 - SKUs List](../../04-design/user-experience/wireframes/01-rmm/skus/task-0.5.2.6-skus-list.md) - **Reference:** [Navigation & Layout Patterns](../../02-architecture/frontend/navigation-layout-patterns.md)
- [ ] **Task 1.1.2.24:** Implement SKU detail page (SKU information) - **Wireframe:** [Task 0.5.2.7 - SKU Detail](../../04-design/user-experience/wireframes/01-rmm/skus/task-0.5.2.7-sku-detail.md) - **Reference:** [Navigation & Layout Patterns](../../02-architecture/frontend/navigation-layout-patterns.md)
- [ ] **Task 1.1.2.25:** Implement SKU create/edit forms (form validation, submission workflow, **include pharmaceutical attributes: dosage_strength, dosage_form, pack_size, unit_of_measure**) - **Wireframe:** [Task 0.5.2.10 - SKU Create/Edit Form](../../04-design/user-experience/wireframes/01-rmm/skus/task-0.5.2.10-sku-create-edit-form.md) - **Reference:** [Form Design Patterns](../../02-architecture/frontend/form-design-patterns.md)
- [ ] **Task 1.1.2.25a:** Implement SKU pharmaceutical attributes input fields (dosage_strength input, dosage_form dropdown with standard forms, pack_size input, unit_of_measure dropdown with standard units)
  - **Validation:** dosage_strength format (e.g., "500mg", "10mg/ml"), dosage_form standard list (Tablet, Capsule, Syrup, etc.), pack_size positive number with unit, unit_of_measure matching (must match dosage_form where applicable)
  - **Reference:** [Backend Validation Strategy](../../02-architecture/security/backend-validation-strategy.md)
- [ ] **Task 1.1.2.26:** Implement Registry submission list page (my submissions, pending approvals - role-based) - **Wireframe:** [Task 0.5.2.11 - Registry Submission List](../../04-design/user-experience/wireframes/01-rmm/workflow/task-0.5.2.11-registry-submission-list.md) - **Reference:** [Role-Based UI Patterns](../../02-architecture/frontend/role-based-ui-patterns.md)
- [ ] **Task 1.1.2.27:** Implement Registry submission detail page (submission data, workflow status, approval history) - **Wireframe:** [Task 0.5.2.12 - Registry Submission Detail](../../04-design/user-experience/wireframes/01-rmm/workflow/task-0.5.2.12-registry-submission-detail.md) - **Reference:** [Navigation & Layout Patterns](../../02-architecture/frontend/navigation-layout-patterns.md)
- [ ] **Task 1.1.2.27a:** Implement WorkflowStatusIndicator component (status badges, progress indicators) - **Reference:** [UI Component Specifications](../../02-architecture/frontend/ui-component-specifications.md)
- [ ] **Task 1.1.2.27b:** Implement ApprovalHistory component (timeline view of approvals - per ui-component-specifications.md) - **Reference:** [UI Component Specifications](../../02-architecture/frontend/ui-component-specifications.md)
- [ ] **Task 1.1.2.28:** Implement Registry submission workflow actions (submit, verify, approve, implement, reject buttons) - **Wireframe:** [Task 0.5.2.13 - Registry Submission Workflow States](../../04-design/user-experience/wireframes/01-rmm/workflow/task-0.5.2.13-registry-submission-workflow-states.md)
- [ ] **Task 1.1.2.28a:** Implement role-based action buttons (show/hide actions based on role/permissions) - **Reference:** [Role-Based UI Patterns](../../02-architecture/frontend/role-based-ui-patterns.md)
- [ ] **Task 1.1.2.28b:** Implement WorkflowActionButtons component (conditional buttons based on status/role) - **Reference:** [UI Component Specifications](../../02-architecture/frontend/ui-component-specifications.md), [Role-Based UI Patterns](../../02-architecture/frontend/role-based-ui-patterns.md)
- [ ] **Task 1.1.2.29:** Implement ATC Codes list page (MOH only, read-only for companies) - **Wireframe:** [Task 0.5.2.14 - ATC Codes List](../../04-design/user-experience/wireframes/01-rmm/task-0.5.2.14-atc-codes-list.md) - **Reference:** [Role-Based UI Patterns](../../02-architecture/frontend/role-based-ui-patterns.md)
- [ ] **Task 1.1.2.30:** Implement Critical Medicines list page (MOH only, designation interface) - **Wireframe:** [Task 0.5.2.15 - Critical Medicines List](../../04-design/user-experience/wireframes/01-rmm/task-0.5.2.15-critical-medicines-list.md) - **Reference:** [Role-Based UI Patterns](../../02-architecture/frontend/role-based-ui-patterns.md)

### Enforcement Backend Tasks (RPC Functions)

**Reference:** [Enforcement Cycle Specification](../../03-governance/enforcement-cycle-specification.md)

- [ ] **Task 1.1.2.31:** Create Enforcement RPC function - Submit for review (enforcement_submit_for_review)
  - **Description:** Submit enforcement action from draft → pending_review state
  - **Reference:** [Enforcement Cycle Specification](../../03-governance/enforcement-cycle-specification.md)
  - **Validation:** action_type, violation_type, legal_basis, justification required; if action_type is `fine`: amount required
  - **Approval Authority:** (Fatima's Audit - Issue #43)
    - Tier 2: Can submit warnings for review
    - Tier 1: Can submit fines, suspensions for review
    - Action type determines required approval level (warnings: Tier 2 final, fines/suspensions: Tier 1 final)
  - **Estimated Time:** 4-6 hours
  - **Depends on:** Task 1.1.1.7 (enforcement_actions table migration)

- [ ] **Task 1.1.2.32:** Create Enforcement RPC function - Review action (enforcement_review_action)
  - **Description:** Tier 2 review action (pending_review → pending_approval or draft)
  - **Reference:** [Enforcement Cycle Specification](../../03-governance/enforcement-cycle-specification.md)
  - **Validation:** Tier 2 role required, review_notes required
  - **Approval Authority:** Tier 2 reviews all enforcement actions before Tier 1 approval (for fines/suspensions) or final approval (for warnings)
  - **Estimated Time:** 4-6 hours
  - **Depends on:** Task 1.1.2.31

- [ ] **Task 1.1.2.33:** Create Enforcement RPC function - Approve action (enforcement_approve_action)
  - **Description:** Tier 1 approval (pending_approval → approved) - Tier 2 for warnings, Tier 1 for fines/suspensions
  - **Reference:** [Enforcement Cycle Specification](../../03-governance/enforcement-cycle-specification.md), [Approvals Authority Matrix](../../03-governance/approvals-authority-matrix.md)
  - **Validation:** Role-based approval logic (Tier 2 for warnings, Tier 1 for fines/suspensions), approval_notes required
  - **Estimated Time:** 4-6 hours
  - **Depends on:** Task 1.1.2.32

- [ ] **Task 1.1.2.34:** Create Enforcement RPC function - Execute action (enforcement_execute_action)
  - **Description:** Execute approved action (approved → executed)
  - **Reference:** [Enforcement Cycle Specification](../../03-governance/enforcement-cycle-specification.md)
  - **Estimated Time:** 3-4 hours
  - **Depends on:** Task 1.1.2.33

- [ ] **Task 1.1.2.35:** Create Enforcement RPC function - Appeal action (enforcement_appeal_action)
  - **Description:** Company appeal (executed → appealed)
  - **Reference:** [Enforcement Cycle Specification](../../03-governance/enforcement-cycle-specification.md)
  - **Validation:** 30-day appeal window, appeal_grounds required
  - **Estimated Time:** 4-6 hours
  - **Depends on:** Task 1.1.2.34

- [ ] **Task 1.1.2.36:** Create Enforcement RPC function - Resolve appeal (enforcement_resolve_appeal)
  - **Description:** Tier 1 appeal resolution (appealed → resolved or executed)
  - **Reference:** [Enforcement Cycle Specification](../../03-governance/enforcement-cycle-specification.md)
  - **Validation:** Tier 1 role required, resolution_notes required
  - **Estimated Time:** 4-6 hours
  - **Depends on:** Task 1.1.2.35

### Enforcement Frontend Tasks

- [ ] **Task 1.1.2.37:** Implement Enforcement dashboard page (summary, recent actions, pending approvals, enforcement metrics, action type breakdown) - **Wireframe:** [Task 0.5.2.0 - Enforcement Dashboard](../../04-design/user-experience/wireframes/01-rmm/enforcement/task-0.5.2.0-enforcement-dashboard.md) - **Reference:** [Navigation & Layout Patterns](../../02-architecture/frontend/navigation-layout-patterns.md), [Role-Based UI Patterns](../../02-architecture/frontend/role-based-ui-patterns.md)
- [ ] **Task 1.1.2.38:** Implement Enforcement actions list page (all actions, filters: action type/status/company/date range, search, pagination, status indicators) - **Wireframe:** [Task 0.5.2.1 - Enforcement Actions List](../../04-design/user-experience/wireframes/01-rmm/enforcement/task-0.5.2.1-enforcement-actions-list.md) - **Reference:** [UI Component Specifications](../../02-architecture/frontend/ui-component-specifications.md), [Role-Based UI Patterns](../../02-architecture/frontend/role-based-ui-patterns.md)
- [ ] **Task 1.1.2.39:** Implement Enforcement action detail page (action information, workflow status, approval chain, violation details, appeal status, execution tracking) - **Wireframe:** [Task 0.5.2.1a - Enforcement Action Detail](../../04-design/user-experience/wireframes/01-rmm/enforcement/task-0.5.2.1a-enforcement-action-detail.md) - **Reference:** [Navigation & Layout Patterns](../../02-architecture/frontend/navigation-layout-patterns.md), [UI Component Specifications](../../02-architecture/frontend/ui-component-specifications.md)
- [ ] **Task 1.1.2.40:** Implement Create enforcement action wizard (action type selection, violation selection, amount input for fines, legal basis, justification, approval workflow) - **Wireframe:** [Task 0.5.2.1b - Create Enforcement Action Wizard](../../04-design/user-experience/wireframes/01-rmm/enforcement/task-0.5.2.1b-create-enforcement-action-wizard.md) - **Reference:** [Form Design Patterns](../../02-architecture/frontend/form-design-patterns.md), [Navigation & Layout Patterns](../../02-architecture/frontend/navigation-layout-patterns.md)
- [ ] **Task 1.1.2.41:** Implement Pending approvals page (actions pending Tier 1 approval, approval interface, bulk approval actions) - **Wireframe:** [Task 0.5.2.1c - Pending Approvals](../../04-design/user-experience/wireframes/01-rmm/enforcement/task-0.5.2.1c-pending-approvals.md) - **Reference:** [Role-Based UI Patterns](../../02-architecture/frontend/role-based-ui-patterns.md), [UI Component Specifications](../../02-architecture/frontend/ui-component-specifications.md)
- [ ] **Task 1.1.2.42:** Implement Enforcement reports page (enforcement analytics, trends, action type breakdown, company compliance tracking) - **Wireframe:** [Task 0.5.2.1d - Enforcement Reports](../../04-design/user-experience/wireframes/01-rmm/enforcement/task-0.5.2.1d-enforcement-reports.md) - **Reference:** [Navigation & Layout Patterns](../../02-architecture/frontend/navigation-layout-patterns.md), [UI Component Specifications](../../02-architecture/frontend/ui-component-specifications.md), [Role-Based UI Patterns](../../02-architecture/frontend/role-based-ui-patterns.md)
- [ ] **Task 1.1.2.43:** Implement Appeal review interface (MOH Tier 1 - review company appeals, uphold/overturn decisions, adjustment notes) - **Wireframe:** [Task 0.5.2.1e - Appeal Review Interface](../../04-design/user-experience/wireframes/01-rmm/enforcement/task-0.5.2.1e-appeal-review-interface.md) - **Reference:** [Form Design Patterns](../../02-architecture/frontend/form-design-patterns.md), [Role-Based UI Patterns](../../02-architecture/frontend/role-based-ui-patterns.md)
- [ ] **Task 1.1.2.44:** Implement Appeal submission form (Company users - submit appeals with grounds, explanation, supporting documents) - **Wireframe:** [Task 0.5.2.1f - Appeal Submission Form](../../04-design/user-experience/wireframes/01-rmm/enforcement/task-0.5.2.1f-appeal-submission-form.md) - **Reference:** [Form Design Patterns](../../02-architecture/frontend/form-design-patterns.md)

---

## Subphase 1.1.3: VCI Module - AAMS Workflow (Week 4)

**Seed Data Gate (Required):**
- Before starting VCI AAMS frontend pages, apply the seed migration stage `seed_1_1_3_vci_aams` per [Phase 1.1 Seeded Supabase "Mock Data" Playbook](phase-1-1-mockdata.md) (versioned SQL migrations, idempotent).

### VCI AAMS Backend Tasks
- [ ] **Task 1.1.3.1:** Create VCI RPC function - AAMS submission (vci_submit_aams)
- [ ] **Task 1.1.3.2:** Create VCI RPC function - AAMS verification (vci_verify_aams) - includes threshold calculation (B × AAMS)
- [ ] **Task 1.1.3.3:** Create VCI RPC function - AAMS approval (vci_approve_aams_threshold)
- [ ] **Task 1.1.3.4:** Create VCI RPC function - AAMS completion (vci_complete_aams_submission)
- [ ] **Task 1.1.3.5:** Create VCI RPC function - AAMS rejection (vci_reject_aams_submission)
- [ ] **Task 1.1.3.6:** Implement threshold calculation logic (B multiplier: 3 standard, 3.5 critical medicines, default B = C = 3 for standard, B_critical = C_critical = 3.5 for critical medicines)
- [ ] **Task 1.1.3.7:** Implement threshold modification logic (local per-SKU, global system-wide, non-retroactive)
- [ ] **Task 1.1.3.7a:** Implement advisory suggestions when configuring B/C multipliers (suggest matching values when one is configured)
- [ ] **Task 1.1.3.8:** Implement AAMS deadline validation (January 31 deadline, 15-day grace period until February 15, late submission handling)
- [ ] **Task 1.1.3.8a:** Implement AAMS grace period compliance logic (marked late but no compliance violation until after Feb 15, compliance impact after grace period)
- [ ] **Task 1.1.3.9:** Implement previous year AAMS fallback logic (if no submission by March 1)
- [ ] **Task 1.1.3.10:** Create scheduled trigger for AAMS deadline check (February 16)
- [ ] **Task 1.1.3.10a:** Implement pg_cron setup for AAMS deadline check (scheduled job configuration, timezone handling for Morocco)

### VCI AAMS Frontend Tasks
- [ ] **Task 1.1.3.11:** Create VCI module layout and navigation - **Wireframe:** [Task 0.5.3.0 - VCI Overview](../../04-design/user-experience/wireframes/02-vci/overview/task-0.5.3.0-vci-overview.md) - **Reference:** [Navigation & Layout Patterns](../../02-architecture/frontend/navigation-layout-patterns.md)
- [ ] **Task 1.1.3.12:** Implement AAMS submissions list page (my submissions, all submissions for MOH) - **Wireframe:** [Task 0.5.3.1 - AAMS Submissions List](../../04-design/user-experience/wireframes/02-vci/aams/task-0.5.3.1-aams-submissions-list.md) - **Reference:** [Navigation & Layout Patterns](../../02-architecture/frontend/navigation-layout-patterns.md), [Role-Based UI Patterns](../../02-architecture/frontend/role-based-ui-patterns.md)
- [ ] **Task 1.1.3.13:** Implement AAMS submission create/edit form (year selection, **SKU selector + quantity input only** - simplified submission structure) - **Wireframe:** [Task 0.5.3.2 - AAMS Submission Form](../../04-design/user-experience/wireframes/02-vci/aams/task-0.5.3.2-aams-submission-form.md) - **Reference:** [Form Design Patterns](../../02-architecture/frontend/form-design-patterns.md)
- [ ] **Task 1.1.3.13a:** Implement SKU selector component (dropdown/autocomplete with full SKU description: name, dosage, form, pack size) - **Reference:** [UI Component Specifications](../../02-architecture/frontend/ui-component-specifications.md), [Form Design Patterns](../../02-architecture/frontend/form-design-patterns.md)
- [ ] **Task 1.1.3.13b:** Implement quantity input with unit display (show unit_of_measure from selected SKU, e.g., "Quantity (tablets)") - **Reference:** [UI Component Specifications](../../02-architecture/frontend/ui-component-specifications.md), [Form Design Patterns](../../02-architecture/frontend/form-design-patterns.md)
- [ ] **Task 1.1.3.13c:** Implement SKU data entry table (add/remove SKU rows, SKU_ID + Quantity only - per phase-0-schema-correction) - **Reference:** [UI Component Specifications](../../02-architecture/frontend/ui-component-specifications.md), [Form Design Patterns](../../02-architecture/frontend/form-design-patterns.md)
- [ ] **Task 1.1.3.13d:** Implement deadline indicators (AAMS deadlines with countdown) - **Reference:** [UI Component Specifications](../../02-architecture/frontend/ui-component-specifications.md)
- [ ] **Task 1.1.3.14:** Implement AAMS submission detail page (submission data, calculated threshold display, workflow status) - **Wireframe:** [Task 0.5.3.3 - AAMS Submission Detail](../../04-design/user-experience/wireframes/02-vci/aams/task-0.5.3.3-aams-submission-detail.md) - **Reference:** [Navigation & Layout Patterns](../../02-architecture/frontend/navigation-layout-patterns.md)
- [ ] **Task 1.1.3.14a:** Implement ThresholdDisplay component (calculated threshold visualization, visible to companies after Tier 2 verification but before Tier 1 approval) - **Wireframe:** [Task 0.5.3.3 - AAMS Submission Detail](../../04-design/user-experience/wireframes/02-vci/aams/task-0.5.3.3-aams-submission-detail.md) - **Reference:** [UI Component Specifications](../../02-architecture/frontend/ui-component-specifications.md)
- [ ] **Task 1.1.3.15:** Implement AAMS workflow actions (submit, verify, approve, reject buttons - role-based) - **Wireframe:** [Task 0.5.3.3 - AAMS Submission Detail](../../04-design/user-experience/wireframes/02-vci/aams/task-0.5.3.3-aams-submission-detail.md) - **Reference:** [Role-Based UI Patterns](../../02-architecture/frontend/role-based-ui-patterns.md)
- [ ] **Task 1.1.3.16:** Implement Threshold management page (MOH Tier 1 - list thresholds, modify thresholds) - **Wireframe:** [Task 0.5.3.4 - Threshold Management](../../04-design/user-experience/wireframes/02-vci/aams/task-0.5.3.4-threshold-management.md) - **Reference:** [Navigation & Layout Patterns](../../02-architecture/frontend/navigation-layout-patterns.md), [Role-Based UI Patterns](../../02-architecture/frontend/role-based-ui-patterns.md)
- [ ] **Task 1.1.3.16a:** Implement ThresholdTable component (list thresholds with filters, bulk actions) - **Wireframe:** [Task 0.5.3.4 - Threshold Management](../../04-design/user-experience/wireframes/02-vci/aams/task-0.5.3.4-threshold-management.md)
- [ ] **Task 1.1.3.17:** Implement Threshold modification form (local vs global, B multiplier adjustment) - **Wireframe:** [Task 0.5.3.6 - Threshold Modification Modal](../../04-design/user-experience/wireframes/02-vci/aams/task-0.5.3.6-threshold-modification-modal.md)
- [ ] **Task 1.1.3.17a:** Implement ThresholdModificationModal component (local vs global selector, B multiplier input with advisory suggestions) - **Wireframe:** [Task 0.5.3.6 - Threshold Modification Modal](../../04-design/user-experience/wireframes/02-vci/aams/task-0.5.3.6-threshold-modification-modal.md)

---

## Subphase 1.1.4: VCI Module - MSQ Workflow (Week 5)

### VCI MSQ Backend Tasks
- [ ] **Task 1.1.4.1:** Create VCI RPC function - MSQ submission (vci_submit_msq)
- [ ] **Task 1.1.4.2:** Implement MSQ validation logic (completeness checks, format validation, historical pattern comparison)
- [ ] **Task 1.1.4.3:** Implement MSQ vs AAMS validation (20% threshold comparison, anomaly detection - note: AAMS and MSQ are independent, validation is for anomaly detection only, not for calculating AAMS)
- [ ] **Task 1.1.4.4:** Create VCI RPC function - MSQ flag for review (vci_flag_msq_for_review)
- [ ] **Task 1.1.4.5:** Create VCI RPC function - MSQ accept (vci_accept_msq)
- [ ] **Task 1.1.4.6:** Create VCI RPC function - MSQ reject (vci_reject_msq)
- [ ] **Task 1.1.4.7:** Implement 7-day grace period for MSQ corrections

### VCI MSQ Frontend Tasks
- [ ] **Task 1.1.4.8:** Implement MSQ submissions list page (my submissions, flagged for review for MOH) - **Wireframe:** [Task 0.5.3.9 - MSQ Submissions List](../../04-design/user-experience/wireframes/02-vci/msq/task-0.5.3.9-msq-submissions-list.md) - **Reference:** [Navigation & Layout Patterns](../../02-architecture/frontend/navigation-layout-patterns.md), [Role-Based UI Patterns](../../02-architecture/frontend/role-based-ui-patterns.md)
- [ ] **Task 1.1.4.9:** Implement MSQ submission form (month selection, **SKU_ID + Quantity data entry only** - simplified submission structure) - **Wireframe:** [Task 0.5.3.10 - MSQ Submission Form](../../04-design/user-experience/wireframes/02-vci/msq/task-0.5.3.10-msq-submission-form.md) - **Reference:** [Form Design Patterns](../../02-architecture/frontend/form-design-patterns.md)
- [ ] **Task 1.1.4.9a:** Implement SKUDataEntryTable component (SKU selector + quantity input per row, display full SKU description - per phase-0-schema-correction) - **Reference:** [UI Component Specifications](../../02-architecture/frontend/ui-component-specifications.md), [Form Design Patterns](../../02-architecture/frontend/form-design-patterns.md)
- [ ] **Task 1.1.4.9b:** Implement BulkUpload component (CSV template: SKU_ID,Quantity - file upload, parsing, validation preview with SKU details display) - **Reference:** [UI Component Specifications](../../02-architecture/frontend/ui-component-specifications.md), [Form Design Patterns](../../02-architecture/frontend/form-design-patterns.md)
- [ ] **Task 1.1.4.10:** Implement MSQ submission detail page (submission data, validation status, review actions) - **Wireframe:** [Task 0.5.3.11 - MSQ Submission Detail](../../04-design/user-experience/wireframes/02-vci/msq/task-0.5.3.11-msq-submission-detail.md) - **Reference:** [Navigation & Layout Patterns](../../02-architecture/frontend/navigation-layout-patterns.md)
- [ ] **Task 1.1.4.10a:** Implement ValidationStatusIndicator component (passed, flagged, rejected states) - **Wireframe:** [Task 0.5.3.11 - MSQ Submission Detail](../../04-design/user-experience/wireframes/02-vci/msq/task-0.5.3.11-msq-submission-detail.md) - **Reference:** [UI Component Specifications](../../02-architecture/frontend/ui-component-specifications.md)
- [ ] **Task 1.1.4.11:** Implement MSQ correction interface (7-day grace period, edit submitted data) - **Wireframe:** [Task 0.5.3.12 - MSQ Correction Interface](../../04-design/user-experience/wireframes/02-vci/msq/task-0.5.3.12-msq-correction-interface.md)
- [ ] **Task 1.1.4.11a:** Implement CorrectionInterface component (editable submitted data with grace period indicator) - **Wireframe:** [Task 0.5.3.12 - MSQ Correction Interface](../../04-design/user-experience/wireframes/02-vci/msq/task-0.5.3.12-msq-correction-interface.md)

---

## Subphase 1.1.5: VCI Module - WSL Workflow & Breach Detection (Week 6)

### VCI WSL Backend Tasks
- [ ] **Task 1.1.5.1:** Create VCI RPC function - WSL submission (vci_submit_wsl)
- [ ] **Task 1.1.5.2:** Implement WSL validation logic (all SKUs required, completeness check)
- [ ] **Task 1.1.5.3:** Implement WSL deadline validation (Friday EOD deadline 17:00 Morocco time, submission window Monday-Friday 17:00, late submission handling)
- [ ] **Task 1.1.5.3a:** Implement MOH request for WSL SKU adjustments (MOH requests adjustments → company submits separately)
- [ ] **Task 1.1.5.4:** Implement breach detection logic (stock level vs threshold comparison)
- [ ] **Task 1.1.5.5:** Create VCI RPC function - Breach creation (automatic on WSL submission)
- [ ] **Task 1.1.5.5a:** Implement automatic breach creation logic (trigger on WSL submission, threshold comparison logic)
- [ ] **Task 1.1.5.6:** Implement breach reason and replenishment date capture
- [ ] **Task 1.1.5.7:** Implement breach priority logic (critical medicine breaches, multiple SKUs, extended breaches)
- [ ] **Task 1.1.5.8:** Create VCI RPC function - Breach analysis (vci_analyze_breach)
- [ ] **Task 1.1.5.8a:** Implement batch breach analysis capability (Tier 2 can analyze multiple breaches together, suggest batch actions)
- [ ] **Task 1.1.5.9:** Create VCI RPC function - Breach action suggestion (vci_suggest_breach_action)
- [ ] **Task 1.1.5.10:** Create VCI RPC function - Breach action approval (vci_approve_breach_action)
- [ ] **Task 1.1.5.10a:** Implement rejection iteration limit logic (max 2 rejection iterations before Tier 1 must take direct action)
- [ ] **Task 1.1.5.11:** Implement breach analysis deadline logic (3 working days standard, 1 working day critical)
- [ ] **Task 1.1.5.12:** Create scheduled trigger for WSL deadline check (Friday 5 PM Morocco time)
- [ ] **Task 1.1.5.12a:** Implement pg_cron setup for WSL deadline check (Friday 5 PM Morocco time, cron expression)
  - **Reference:** [Edge Functions Specification](../../02-architecture/api/edge-functions.md)
  - **Scheduled Job Specifications:** (Leila's Audit - Issue #28)
    - Cron expression: `0 17 * * 5` (Friday at 17:00)
    - Timezone handling: Morocco time (UTC+01:00), use pg_cron with proper timezone settings
    - Job logic: Check all companies for missing WSL submissions, send notifications for missing submissions
    - Error handling: Log failures, retry mechanism, alerting for persistent failures
    - Monitoring: Job execution logs, success/failure tracking, execution time monitoring

### Historical Data Backend Tasks
- [ ] **Task 1.1.5.12b:** Create database indexes for historical queries (audit_logs: created_at, user_id+created_at, table_name+created_at; aams_submissions: company_id+year; msq_submissions: company_id+year+month; wsl_submissions: company_id+week_ending; compliance_scores: company_id+score_month; breaches: company_id+status+detected_at)
- [ ] **Task 1.1.5.12c:** Create RPC function - has_historical_ecs_data (check if historical ECS data exists for company or system-wide)
- [ ] **Task 1.1.5.12d:** Create RPC function - has_historical_cmc_data (check if historical CMC data exists for company or system-wide)
- [ ] **Task 1.1.5.12e:** Create RPC function - vci_get_historical_submissions (get historical AAMS/MSQ/WSL submissions with filtering and pagination, RLS applied)
- [ ] **Task 1.1.5.12f:** Create RPC function - cmc_get_historical_scores (get historical compliance scores with filtering and pagination, RLS applied)
- [ ] **Task 1.1.5.12g:** Create RPC function - audit_get_historical_logs (get historical audit logs with filtering and pagination, MOH/Auditors only, role check)
- [ ] **Task 1.1.5.12h:** Create RPC function - log_historical_data_access (log access to historical data for audit trail, called automatically by historical data RPC functions)

### VCI WSL Frontend Tasks
- [ ] **Task 1.1.5.13:** Implement WSL submissions list page (my submissions, all submissions for MOH) - **Wireframe:** [Task 0.5.3.13 - WSL Submissions List](../../04-design/user-experience/wireframes/02-vci/wsl/task-0.5.3.11-wsl-submissions-list.md) - **Reference:** [Navigation & Layout Patterns](../../02-architecture/frontend/navigation-layout-patterns.md), [Role-Based UI Patterns](../../02-architecture/frontend/role-based-ui-patterns.md)
- [ ] **Task 1.1.5.14:** Implement WSL submission form (week ending date, **all SKUs with stock quantity entry** - SKU_ID + Quantity structure) - **Wireframe:** [Task 0.5.3.14 - WSL Submission Form](../../04-design/user-experience/wireframes/02-vci/wsl/task-0.5.3.12-wsl-submission-form.md) - **Reference:** [Form Design Patterns](../../02-architecture/frontend/form-design-patterns.md)
- [ ] **Task 1.1.5.14a:** Implement WSLBulkEntryTable component (pre-populated with all company SKUs showing full description, quantity input only, optional breach reason/replenishment date fields) - **Wireframe:** [Task 0.5.3.14 - WSL Submission Form](../../04-design/user-experience/wireframes/02-vci/wsl/task-0.5.3.12-wsl-submission-form.md) - **Reference:** [UI Component Specifications](../../02-architecture/frontend/ui-component-specifications.md), [Form Design Patterns](../../02-architecture/frontend/form-design-patterns.md)
- [ ] **Task 1.1.5.15:** Implement WSL submission detail page (submission data, breach indicators) - **Wireframe:** [Task 0.5.3.15 - WSL Submission Detail](../../04-design/user-experience/wireframes/02-vci/wsl/task-0.5.3.13-wsl-submission-detail.md) - **Reference:** [Navigation & Layout Patterns](../../02-architecture/frontend/navigation-layout-patterns.md)
- [ ] **Task 1.1.5.16:** Implement Breaches list page (active breaches, resolved breaches, filters by priority/company/SKU) - **Wireframe:** [Task 0.5.3.16 - Compliance Violations List](../../04-design/user-experience/wireframes/02-vci/breaches/task-0.5.3.14-compliance-violations-list.md) - **Reference:** [Navigation & Layout Patterns](../../02-architecture/frontend/navigation-layout-patterns.md), [Role-Based UI Patterns](../../02-architecture/frontend/role-based-ui-patterns.md)
- [ ] **Task 1.1.5.16a:** Implement BreachFilters component (priority, company, SKU, date range filters) - **Reference:** [UI Component Specifications](../../02-architecture/frontend/ui-component-specifications.md)
- [ ] **Task 1.1.5.17:** Implement Breach detail page (breach information, stock level vs threshold, reason, replenishment date) - **Wireframe:** [Task 0.5.3.17 - Compliance Violation Detail](../../04-design/user-experience/wireframes/02-vci/breaches/task-0.5.3.15-compliance-violation-detail.md) - **Reference:** [Navigation & Layout Patterns](../../02-architecture/frontend/navigation-layout-patterns.md)
- [ ] **Task 1.1.5.17a:** Implement BreachDetailCard component (threshold comparison, stock level visualization) - **Wireframe:** [Task 0.5.3.17 - Compliance Violation Detail](../../04-design/user-experience/wireframes/02-vci/breaches/task-0.5.3.15-compliance-violation-detail.md) - **Reference:** [UI Component Specifications](../../02-architecture/frontend/ui-component-specifications.md)
- [ ] **Task 1.1.5.18:** Implement Breach analysis interface (Tier 2 - analysis form, action suggestions) - **Wireframe:** [Task 0.5.3.18 - Compliance Violation Analysis Interface](../../04-design/user-experience/wireframes/02-vci/breaches/task-0.5.3.16-compliance-violation-analysis-interface.md) - **Reference:** [Form Design Patterns](../../02-architecture/frontend/form-design-patterns.md), [Role-Based UI Patterns](../../02-architecture/frontend/role-based-ui-patterns.md)
- [ ] **Task 1.1.5.18a:** Implement BreachAnalysisForm component (action suggestions dropdown, comments) - **Wireframe:** [Task 0.5.3.18 - Compliance Violation Analysis Interface](../../04-design/user-experience/wireframes/02-vci/breaches/task-0.5.3.16-compliance-violation-analysis-interface.md) - **Reference:** [UI Component Specifications](../../02-architecture/frontend/ui-component-specifications.md), [Form Design Patterns](../../02-architecture/frontend/form-design-patterns.md)
- [ ] **Task 1.1.5.18b:** Implement BatchBreachAnalysis interface (select multiple breaches, batch actions) - **Wireframe:** [Task 0.5.3.18 - Compliance Violation Analysis Interface](../../04-design/user-experience/wireframes/02-vci/breaches/task-0.5.3.16-compliance-violation-analysis-interface.md) - **Reference:** [UI Component Specifications](../../02-architecture/frontend/ui-component-specifications.md), [Form Design Patterns](../../02-architecture/frontend/form-design-patterns.md), [Role-Based UI Patterns](../../02-architecture/frontend/role-based-ui-patterns.md)
- [ ] **Task 1.1.5.19:** Implement Breach action approval interface (Tier 1 - review suggestions, approve/reject/independent action) - **Wireframe:** [Task 0.5.3.19 - Compliance Violation Action Approval Interface](../../04-design/user-experience/wireframes/02-vci/breaches/task-0.5.3.17-compliance-violation-action-approval-interface.md) - **Reference:** [Form Design Patterns](../../02-architecture/frontend/form-design-patterns.md), [Role-Based UI Patterns](../../02-architecture/frontend/role-based-ui-patterns.md)
- [ ] **Task 1.1.5.20:** Implement Governance Dashboard (MOH - real-time stock sufficiency, breach status, action recommendations) - **Wireframe:** [Task 0.5.3.20 - Governance Dashboard](../../04-design/user-experience/wireframes/02-vci/overview/task-0.5.3.18-governance-dashboard.md) - **Reference:** [Navigation & Layout Patterns](../../02-architecture/frontend/navigation-layout-patterns.md), [Role-Based UI Patterns](../../02-architecture/frontend/role-based-ui-patterns.md)
- [ ] **Task 1.1.5.20a:** Set up charting library (Recharts or similar - for governance dashboard) - **Reference:** [UI Component Specifications](../../02-architecture/frontend/ui-component-specifications.md)
- [ ] **Task 1.1.5.20b:** Implement DashboardWidget component (reusable widget for metrics/charts) - **Reference:** [UI Component Specifications](../../02-architecture/frontend/ui-component-specifications.md)
- [ ] **Task 1.1.5.20c:** Implement responsive dashboard layout (widget stacking on tablet/mobile) - **Reference:** [Navigation & Layout Patterns](../../02-architecture/frontend/navigation-layout-patterns.md)
- [ ] **Task 1.1.5.20d:** Implement dashboard data prefetching and caching strategy
- [ ] **Task 1.1.5.20e:** Implement stock sufficiency charts (line charts, bar charts)

---

## Subphase 1.1.5.5: Historical Data Frontend Tasks

### Historical Data Component Implementation
- [ ] **Task 1.1.5.21:** Implement Timeline component (vertical timeline, date/user/action display, expandable details, filter by date range) - **Wireframe Reference:** See [Task 0.5.1.30 - History Overview](../../04-design/user-experience/wireframes/00-core-foundation/global/task-0.5.1.30-history-overview.md) for timeline pattern
- [ ] **Task 1.1.5.22:** Implement DateRangePicker component (start/end date selection, quick filters: Last 7 days, 30 days, 3 months, year, 7 years, custom range, Morocco timezone support) - **Wireframe:** [Task 0.5.8.3 - Date Range Picker Modal](../../04-design/user-experience/wireframes/07-modals/task-0.5.8.3-date-range-picker-modal.md)
- [ ] **Task 1.1.5.23:** Implement ExportButton component (dropdown with PDF/Excel/CSV options, progress indicator, export metadata tracking) - **Wireframe:** [Task 0.5.8.5 - Export Options Modal](../../04-design/user-experience/wireframes/07-modals/task-0.5.8.5-export-options-modal.md)
- [ ] **Task 1.1.5.24:** Implement virtual scrolling component for large lists (using @tanstack/react-virtual, for audit logs)

### History Tabs on Detail Pages
- [ ] **Task 1.1.5.25:** Implement History tab on Company detail page (registry changes timeline, submission history, compliance history, lazy loading)
- [ ] **Task 1.1.5.26:** Implement History tab on Product detail page (product changes timeline, SKU history)
- [ ] **Task 1.1.5.27:** Implement History tab on SKU detail page (SKU changes timeline)
- [ ] **Task 1.1.5.28:** Implement History tab on AAMS submission detail page (corrections history, status changes)
- [ ] **Task 1.1.5.29:** Implement History tab on MSQ submission detail page (corrections history, status changes)
- [ ] **Task 1.1.5.30:** Implement History tab on WSL submission detail page (submission history)
- [ ] **Task 1.1.5.31:** Implement History tab on Breach detail page (resolution timeline, actions taken)
- [ ] **Task 1.1.5.32:** Implement History tab on Compliance Score detail page (score trends, component breakdown over time)

### Filtered List Views
- [ ] **Task 1.1.5.33:** Add year filter to AAMS submissions list page (query parameter ?year=2023, quick filter chips, default to current year)
- [ ] **Task 1.1.5.34:** Add year/month filters to MSQ submissions list page (query parameters ?year=2023&month=6, quick filter chips)
- [ ] **Task 1.1.5.35:** Add week filter to WSL submissions list page (query parameter ?week=2023-W01, quick filter chips)
- [ ] **Task 1.1.5.36:** Add status/year filters to Breaches list page (query parameters ?status=resolved&year=2023, filter tabs)
- [ ] **Task 1.1.5.37:** Add year filter to Compliance Scores list page (query parameter ?year=2023, quick filter chips)

### Dedicated History Routes
- [ ] **Task 1.1.5.38:** Implement `/history` route (role-based historical overview page, company users: personal, MOH: system-wide) - **Wireframe:** [Task 0.5.1.30 - History Overview](../../04-design/user-experience/wireframes/00-core-foundation/global/task-0.5.1.30-history-overview.md)
- [ ] **Task 1.1.5.39:** Implement `/audit/logs` route (audit log list page, MOH/Auditors only, virtual scrolling, search, date range filter) - **Wireframe:** [Task 0.5.1.32 - Audit Logs List](../../04-design/user-experience/wireframes/00-core-foundation/global/task-0.5.1.32-audit-logs-list.md)
- [ ] **Task 1.1.5.40:** Implement `/audit/logs/[id]` route (audit log detail page) - **Wireframe:** [Task 0.5.1.33 - Audit Log Detail](../../04-design/user-experience/wireframes/00-core-foundation/global/task-0.5.1.33-audit-log-detail.md)
- [ ] **Task 1.1.5.41:** Implement `/audit/reports` route (audit reports page, MOH/Auditors only) - **Wireframe:** [Task 0.5.1.34 - Audit Reports](../../04-design/user-experience/wireframes/00-core-foundation/global/task-0.5.1.34-audit-reports.md)
- [ ] **Task 1.1.5.42:** Implement `/vci/submissions/history` route (all past submissions, filterable by type, year, company) - **Wireframe:** [Task 0.5.3.28 - Submission History](../../04-design/user-experience/wireframes/05-audit-historical/historical-data/task-0.5.3.28-submission-history.md)
- [ ] **Task 1.1.5.43:** Implement `/vci/submissions/history/trends` route (trend analysis charts, MOH Tier 1 only, AAMS/MSQ/WSL trends, multi-year comparisons) - **Wireframe:** [Task 0.5.3.20 - Submission Trends Analysis](../../04-design/user-experience/wireframes/02-vci/analytics/task-0.5.3.20-submission-trends-analysis.md)

### Modal Patterns for Historical Data
- [ ] **Task 1.1.5.44:** Implement Quick History Preview modal (recent 5-10 changes, timeline view, "View Full History" button) - **Wireframe:** [Task 0.5.8.6 - Quick History Preview Modal](../../04-design/user-experience/wireframes/07-modals/task-0.5.8.6-quick-history-preview-modal.md) - **Reference:** [UI Component Specifications](../../02-architecture/frontend/ui-component-specifications.md)
- [ ] **Task 1.1.5.45:** Implement Comparison modal (current vs historical side-by-side, highlight differences) - **Wireframe:** [Task 0.5.8.7 - Comparison Modal](../../04-design/user-experience/wireframes/07-modals/task-0.5.8.7-comparison-modal.md) - **Reference:** [UI Component Specifications](../../02-architecture/frontend/ui-component-specifications.md)
- [ ] **Task 1.1.5.46:** Implement Export Options modal (format selection, date range picker, progress indicator) - **Wireframe:** [Task 0.5.8.5 - Export Options Modal](../../04-design/user-experience/wireframes/07-modals/task-0.5.8.5-export-options-modal.md)
- [ ] **Task 1.1.5.47:** Implement Detail Inspection modal (quick detail view from list, "View Full Page" button) - **Wireframe:** [Task 0.5.8.8 - Detail Inspection Modal](../../04-design/user-experience/wireframes/07-modals/task-0.5.8.8-detail-inspection-modal.md)

### Module Activation Impact
- [ ] **Task 1.1.5.48:** Implement inactive module indicators (informational banners, read-only badges, module activation period display)
- [ ] **Task 1.1.5.49:** Implement data existence checks for ECS/CMC routes (has_historical_ecs_data, has_historical_cmc_data RPC calls)
- [ ] **Task 1.1.5.50:** Update navigation to show ECS/CMC if active OR historical data exists (with "Historical" badge if inactive)
- [ ] **Task 1.1.5.51:** Implement route protection pattern for historical data (check data existence, not module status)

### Navigation Updates
- [ ] **Task 1.1.5.52:** Add History link to sidebar navigation (all roles, links to `/history`)
- [ ] **Task 1.1.5.53:** Add Audit link to sidebar navigation (MOH Tier 1/2, links to `/audit/logs`)
- [ ] **Task 1.1.5.54:** Add Submissions History link to VCI section (links to `/vci/submissions/history`)
- [ ] **Task 1.1.5.55:** Add Trends link to VCI section (Tier 1 only, links to `/vci/submissions/history/trends`)
- [ ] **Task 1.1.5.56:** Update breadcrumbs for historical routes (Home > History, Home > Audit > Logs, etc.)

### Trend Analysis Components (MOH Tier 1)
- [ ] **Task 1.1.5.57:** Implement AAMS trend analysis component (year-over-year comparison, seasonal patterns, line/bar charts) - **Wireframe:** [Task 0.5.3.20 - Submission Trends Analysis](../../04-design/user-experience/wireframes/02-vci/analytics/task-0.5.3.20-submission-trends-analysis.md)
- [ ] **Task 1.1.5.58:** Implement MSQ trend analysis component (monthly patterns, growth trends, anomaly detection) - **Wireframe:** [Task 0.5.3.20 - Submission Trends Analysis](../../04-design/user-experience/wireframes/02-vci/analytics/task-0.5.3.20-submission-trends-analysis.md)
- [ ] **Task 1.1.5.59:** Implement WSL trend analysis component (stock level patterns, stockout identification) - **Wireframe:** [Task 0.5.3.20 - Submission Trends Analysis](../../04-design/user-experience/wireframes/02-vci/analytics/task-0.5.3.20-submission-trends-analysis.md)
- [ ] **Task 1.1.5.60:** Implement cross-metric analysis component (AAMS vs MSQ vs WSL correlations) - **Wireframe:** [Task 0.5.3.20 - Submission Trends Analysis](../../04-design/user-experience/wireframes/02-vci/analytics/task-0.5.3.20-submission-trends-analysis.md)

---

## Subphase 1.1.6: Seed Data Validation & Enhancement (Week 7)

**Purpose:** Validate all applied seed migrations and create additional seed migration stages for comprehensive historical data (MSQ, WSL, breaches, etc.).

**Note:** Initial seed migrations (`seed_1_1_1_foundation`, `seed_1_1_2_rmm`, `seed_1_1_3_vci_aams`) have already been applied in earlier subphases per the [Phase 1.1 Seeded Supabase "Mock Data" Playbook](phase-1-1-mockdata.md). This subphase focuses on validation and extending seed coverage.

### Additional Seed Migration Stages (Versioned SQL Migrations)

- [ ] **Task 1.1.6.1:** Create and apply seed migration `seed_1_1_4_vci_msq` - MSQ historical data
  - **Migration File:** `supabase/migrations/YYYYMMDDHHMMSS_seed_1_1_4_vci_msq.sql`
  - **Application Method:** `supabase migration apply` (or auto-applied in local dev via `supabase start`)
  - **Goal:** 2-3 years historical monthly MSQ data per company
  - **Tables:** `msq_submissions` (submission_data as array of {sku_id, quantity} objects)
  - **Idempotency:** Use deterministic IDs and UPSERT patterns per [Playbook idempotency patterns](phase-1-1-mockdata.md#idempotency-patterns)
  - **Reference:** See [Playbook - Seed Strategy: Scenario Packs](phase-1-1-mockdata.md#seed-strategy-scenario-packs-deterministic) for scenario pack requirements
  - **Estimated Time:** 3-4 hours

- [ ] **Task 1.1.6.2:** Create and apply seed migration `seed_1_1_5_vci_wsl` - WSL historical data
  - **Migration File:** `supabase/migrations/YYYYMMDDHHMMSS_seed_1_1_5_vci_wsl.sql`
  - **Application Method:** `supabase migration apply`
  - **Goal:** 2-3 years historical weekly WSL data per company, include breach scenarios
  - **Tables:** `wsl_submissions` (submission_data as array of {sku_id, quantity, breach_reason?, replenishment_date?} objects)
  - **Idempotency:** Use deterministic IDs and UPSERT patterns
  - **Estimated Time:** 3-4 hours

- [ ] **Task 1.1.6.3:** Create and apply seed migration `seed_1_1_6_vci_breaches` - Breach records
  - **Migration File:** `supabase/migrations/YYYYMMDDHHMMSS_seed_1_1_6_vci_breaches.sql`
  - **Application Method:** `supabase migration apply`
  - **Goal:** Historical breach records with analyses, various breach scenarios
  - **Tables:** `breaches`, `breach_analyses`
  - **Idempotency:** Use deterministic IDs and UPSERT patterns
  - **Estimated Time:** 2-3 hours

- [ ] **Task 1.1.6.4:** Create and apply seed migration `seed_1_1_7_rmm_comprehensive` - Comprehensive RMM seed data
  - **Migration File:** `supabase/migrations/YYYYMMDDHHMMSS_seed_1_1_7_rmm_comprehensive.sql`
  - **Application Method:** `supabase migration apply`
  - **Goal:** Expand RMM seed data to 75 companies (15 IPCs + 60 Wholesalers), 2-5 products per company, 3-10 SKUs per product with realistic pharmaceutical attributes
  - **Tables:** `companies`, `products`, `skus` (ensure dosage_strength, dosage_form, pack_size, unit_of_measure are populated with realistic values), `atc_codes`, `critical_medicines`, `registry_submissions`
  - **Pharmaceutical Attributes:** Generate realistic data (dosage_strength: "500mg", "10mg/ml", etc.; dosage_form: "Tablet", "Capsule", "Syrup", etc.; pack_size: "30 tablets", "100ml", etc.; unit_of_measure: "tablets", "ml", etc.)
  - **Idempotency:** Use deterministic IDs and UPSERT patterns
  - **Estimated Time:** 4-6 hours

- [ ] **Task 1.1.6.5:** Create and apply seed migration `seed_1_1_8_vci_aams_comprehensive` - Comprehensive AAMS historical data
  - **Migration File:** `supabase/migrations/YYYYMMDDHHMMSS_seed_1_1_8_vci_aams_comprehensive.sql`
  - **Application Method:** `supabase migration apply`
  - **Goal:** Expand AAMS seed data to 2-3 years historical data per company
  - **Tables:** `aams_submissions`, `thresholds` (calculated thresholds for all SKUs)
  - **Idempotency:** Use deterministic IDs and UPSERT patterns
  - **Estimated Time:** 2-3 hours

### Seed Data Validation Tasks

- [ ] **Task 1.1.6.6:** Validate all seed migrations using SQL verification queries
  - **Verification Method:** Execute SQL queries via Supabase dashboard SQL editor or `supabase db execute`
  - **Verification Checklist:** Per [Playbook - Verification Checklist](phase-1-1-mockdata.md#verification-checklist-must-be-executed-after-each-seed-migration)
    - Foreign key integrity (no orphan rows)
    - Unique constraints respected
    - Required Phase 0.6 fields populated where needed
    - Indexes exist for key lists/filters
  - **SQL Example:**
    ```sql
    -- Verify foreign key integrity
    SELECT COUNT(*) FROM companies WHERE id NOT IN (SELECT DISTINCT company_id FROM users WHERE company_id IS NOT NULL);
    
    -- Verify unique constraints
    SELECT email, COUNT(*) FROM users GROUP BY email HAVING COUNT(*) > 1;
    
    -- Verify Phase 0.6 fields populated
    SELECT COUNT(*) FROM users WHERE avatar_url IS NULL OR timezone IS NULL;
    ```
  - **Estimated Time:** 2-3 hours

- [ ] **Task 1.1.6.7:** Verify seed data completeness and relationships
  - **Verification Method:** Execute SQL queries via Supabase dashboard or CLI
  - **Verify:**
    - All foreign key relationships are valid
    - Scenario packs are complete (pack_foundation_moh_ops, pack_company_active, pack_company_empty, etc.)
    - Wireframe coverage requirements met
  - **Estimated Time:** 2-3 hours

- [ ] **Task 1.1.6.8:** Performance test seed data queries (execution time, index effectiveness)
  - **Verification Method:** Use `EXPLAIN ANALYZE` queries via Supabase SQL editor
  - **Test:** Key list queries, filter queries, pagination queries
  - **Example:**
    ```sql
    EXPLAIN ANALYZE SELECT * FROM companies WHERE type = 'IPC' ORDER BY name LIMIT 20;
    ```
  - **Estimated Time:** 1-2 hours

#### Farah’s Seed Data Quality Gate (Required)

Seed data must be reviewed by **Farah (Analytics/CMC Specialist)** before declaring “seed complete”:
- **Wireframe coverage:** every major wireframe filter/state has supporting records (empty states are intentional and reproducible).
- **Distribution realism:** no uniform/random-only distributions for scores/breaches/thresholds; include plausible clustering and outliers.
- **State coverage:** include examples across workflow statuses needed for dashboards and lists (pending, approved, rejected, implemented, archived, etc.).
- **Analytics readiness:** seeded data supports trend components and governance dashboards without hardcoded fallbacks.

---

## Subphase 1.1.7: Integration Testing & Documentation (Week 8)

### Integration Contract Verification Tasks
- [ ] **Task 1.1.7.0:** Verify RMM→VCI integration contract (data flow specs, threshold switching contract, data dependencies) - **Reference:** [Module Dependency Diagram](../../02-architecture/modules/module-dependency-diagram.md), [Integration Architecture](../../02-architecture/integration/integration-architecture.md)
  - **Depends on:** Task 1.1.1.1a (module integration contracts definition)
  - **Verification:** Verify RMM data (companies, products, SKUs) is accessible to VCI; verify threshold data flow from VCI to RMM
  - **Estimated Time:** 4-6 hours
- [ ] **Task 1.1.7.0a:** Verify VCI→ECS integration contract (threshold switching contract, data dependencies, conditional validation) - **Reference:** [Module Dependency Diagram](../../02-architecture/modules/module-dependency-diagram.md), [Integration Architecture](../../02-architecture/integration/integration-architecture.md)
  - **Depends on:** Task 1.1.1.1a (module integration contracts definition), Task 1.2.1.1b (ECS integration points)
  - **Verification:** Verify VCI threshold data is accessible to ECS; verify threshold switching logic (VCI → ECS → VCI reversion); verify conditional validation (CMC score-based if CMC active)
  - **Estimated Time:** 4-6 hours
- [ ] **Task 1.1.7.0b:** Verify ECS→CMC integration contract (score recalculation triggers, conditional validation) - **Reference:** [Module Dependency Diagram](../../02-architecture/modules/module-dependency-diagram.md), [Integration Architecture](../../02-architecture/integration/integration-architecture.md)
  - **Depends on:** Task 1.1.1.1a (module integration contracts definition), Task 1.3.2.3a (event-triggered recalculation coordinator)
  - **Verification:** Verify ECS export approval events trigger CMC score recalculation; verify CMC scores are accessible to ECS for conditional validation
  - **Estimated Time:** 4-6 hours

### Testing Infrastructure Setup (Hassan's Audit - Issue #54)
- [ ] **Task 1.1.7.0c:** Set up comprehensive testing infrastructure
  - **Reference:** [Testing Framework](../../08-deployment/testing-framework.md)
  - **Testing Infrastructure Specifications:**
    - Test database: Separate test database with transaction rollback after each test
    - Test environment: Environment variables for test configuration, mock services for external integrations
    - CI/CD integration: Automated test execution on commits, test reporting, coverage thresholds
    - Test utilities: Helper functions for test data creation, authentication mocking, API testing
    - Test fixtures: Reusable test data sets for common scenarios
  - **Estimated Time:** 4-6 hours

### Test Data Management (Hassan's Audit - Issue #55)
- [ ] **Task 1.1.7.0d:** Set up test data management infrastructure
  - **Reference:** [Mock Data README](../../07-testing/mock-data/README.md)
  - **Test Data Management Specifications:**
    - Test data generation: Scripts to generate realistic test data (companies, products, skus, submissions)
    - Test data isolation: Each test gets its own data set, cleaned up after test completion
    - Test data fixtures: Pre-defined data sets for specific test scenarios (happy path, edge cases, error cases)
    - Test data seeding: Scripts to seed test database with baseline data
    - Test data cleanup: Automated cleanup after test runs, prevent test data pollution
  - **Estimated Time:** 3-4 hours

### Testing Tasks
- [ ] **Task 1.1.7.1:** Create RMM module test suite (unit tests for RPC functions)
- [ ] **Task 1.1.7.1a:** Create RPC function unit test framework (test database setup, transaction isolation, mock data helpers)
- [ ] **Task 1.1.7.2:** Create VCI module test suite (unit tests for RPC functions)
- [ ] **Task 1.1.7.2a:** Set up frontend testing framework (Jest configuration, React Testing Library setup, Playwright configuration, test utilities)
- [ ] **Task 1.1.7.2b:** Create component unit tests (test base components, form components)
- [ ] **Task 1.1.7.2c:** Create integration tests for forms (form submission, validation)
- [ ] **Task 1.1.7.2d:** Create E2E tests for critical user flows (login, submission, approval workflows)
- [ ] **Task 1.1.7.2e:** Create accessibility tests (keyboard navigation, screen reader)
- [ ] **Task 1.1.7.2f:** Create visual regression testing setup (screenshot comparison, component visual tests)
- [ ] **Task 1.1.7.3:** Create integration tests - RMM workflows (end-to-end submission → approval → implementation)
- [ ] **Task 1.1.7.3a:** Create integration test data fixtures (realistic test scenarios, edge case data, workflow test data)
- [ ] **Task 1.1.7.4:** Create integration tests - VCI AAMS workflow (submission → verification → approval)
- [ ] **Task 1.1.7.5:** Create integration tests - VCI MSQ workflow (submission → validation → acceptance)
- [ ] **Task 1.1.7.6:** Create integration tests - VCI WSL workflow (submission → breach detection → analysis)
- [ ] **Task 1.1.7.7:** Create integration tests - Cross-module (RMM registry → VCI submissions)
- [ ] **Task 1.1.7.7a:** Create integration test framework setup (test database, test data isolation, parallel test execution)
- [ ] **Task 1.1.7.8:** Perform role-based access testing (company users, MOH users, permissions)
- [ ] **Task 1.1.7.9:** Perform RLS policy testing (data isolation, module activation checks)
- [ ] **Task 1.1.7.9a:** Create RLS policy test suite (test company data isolation, test MOH access, test module activation blocking)
- [ ] **Task 1.1.7.10:** Perform audit logging verification (all actions logged correctly)
- [ ] **Task 1.1.7.10a:** Create audit log verification test suite (hash chain integrity, completeness, tampering detection)

### Documentation Tasks
- [ ] **Task 1.1.7.11:** Create RMM module user documentation (company user guide, MOH user guide)
- [ ] **Task 1.1.7.12:** Create VCI module user documentation (AAMS, MSQ, WSL submission guides)
- [ ] **Task 1.1.7.13:** Create API documentation (RPC function documentation, request/response schemas)
- [ ] **Task 1.1.7.14:** Create developer documentation (setup guide, architecture overview)

### Phase 1.1 Sign-off
- [ ] **Task 1.1.7.15:** Phase 1.1 internal review and testing
- [ ] **Task 1.1.7.16:** Phase 1.1 sign-off and approval to proceed to Phase 1.2

---

# PHASE 1.2: ECS DEVELOPMENT (Month 4 - Weeks 9-12)

**Duration:** 4 weeks  
**Objective:** Build Export Control System module and integrate with RMM + VCI

## Subphase 1.2.1: ECS Backend Foundation (Week 9)

### ECS Backend Setup Tasks
- [ ] **Task 1.2.1.1:** Create database migration for ECS tables (export_requests, export_authorizations, replenishment_schedules)
  - **Migration Requirements:**
    - Create migration file: `supabase/migrations/YYYYMMDDHHMMSS_create_ecs_tables.sql`
    - Apply migration using `supabase migration apply` or auto-apply in local dev
    - Verify migration via `supabase migration list` or Supabase dashboard
    - Verify tables using SQL queries via Supabase dashboard
    - Verify security best practices via SQL queries
  - **Developer Notes:**
    - Follow standard Supabase migration practices (see [Database Management with Supabase](#database-management-with-supabase) section)
- [ ] **Task 1.2.1.1a:** Verify ECS schema completeness (all columns, foreign key relationships to RMM/VCI)
  - **Verification Requirements:**
    - Verify all ECS tables exist using SQL queries via Supabase dashboard
    - Use SQL queries to verify columns, foreign keys, constraints
- [ ] **Task 1.2.1.1b:** Define ECS integration points with RMM+VCI (threshold switching contract, data dependencies)
- [ ] **Task 1.2.1.2:** Implement RLS policies for ECS tables (module activation check, company isolation)
- [ ] **Task 1.2.1.2a:** Implement detailed RLS policies for ECS tables (export_requests, export_authorizations, replenishment_schedules) with module activation checks
- [ ] **Task 1.2.1.3:** Create ECS RPC function - Export request submission (ecs_submit_export_request)
- [ ] **Task 1.2.1.4:** Create ECS RPC function - Export request modification (ecs_modify_export_request)
- [ ] **Task 1.2.1.5:** Create ECS RPC function - Export request cancellation (ecs_cancel_export_request)
- [ ] **Task 1.2.1.6:** Implement XAMS calculation logic (X months average, default X=6, configurable 3-12 months, minimum 3 months required, adapt calculation if less than configured X)
- [ ] **Task 1.2.1.6a:** Implement XAMS seasonal-aware validation (when X=12, compare to AAMS/12 only when periods align in December, otherwise use trend analysis)
- [ ] **Task 1.2.1.7:** Implement ECS Threshold calculation logic (C × XAMS, default C=3 standard, 3.5 critical, default B = C = 3 for standard, B_critical = C_critical = 3.5 for critical medicines)
- [ ] **Task 1.2.1.8:** Implement conditional validation logic (CMC score-based if CMC active, risk factor assessment)
- [ ] **Task 1.2.1.9:** Create ECS RPC function - Export request evaluation (ecs_evaluate_export_request)

---

## Subphase 1.2.2: ECS Workflow & Threshold Switching (Week 10)

### ECS Workflow Backend Tasks
- [ ] **Task 1.2.2.1:** Create ECS RPC function - Export request auto-approval queue (ecs_queue_auto_approval)
- [ ] **Task 1.2.2.2:** Create ECS RPC function - Export request Tier 2 verification (ecs_verify_export_request)
- [ ] **Task 1.2.2.3:** Create ECS RPC function - Export request manual review (ecs_manual_review_export_request)
- [ ] **Task 1.2.2.4:** Create ECS RPC function - Export request approval (ecs_approve_export_request)
- [ ] **Task 1.2.2.5:** Create ECS RPC function - Export request rejection (ecs_reject_export_request)
- [ ] **Task 1.2.2.6:** Create ECS RPC function - Export authorization (ecs_authorize_export)
- [ ] **Task 1.2.2.7:** Implement threshold switching logic (VCI Threshold → ECS Threshold on authorization)
- [ ] **Task 1.2.2.7a:** Implement threshold switching coordination (VCI→ECS threshold update, 3-month reversion tracking)
- [ ] **Task 1.2.2.8:** Create scheduled trigger for threshold reversion (3 months after authorization)
- [ ] **Task 1.2.2.8a:** Implement pg_cron setup for threshold reversion (3-month tracking, daily check job)
- [ ] **Task 1.2.2.9:** Implement intervention window logic (default 2 working days, configurable 1-5 days)
- [ ] **Task 1.2.2.9a:** Implement post-approval intervention logic (Tier 1 can intervene within 24 hours after auto-approval with stronger justification)
- [ ] **Task 1.2.2.10:** Create ECS RPC function - Export authorization expiration check (ecs_check_expiration) - 90 calendar days validity from authorization date
- [ ] **Task 1.2.2.10a:** Implement export authorization expiration reminders (automated reminders at 30, 15, and 7 days before expiration - email + in-app)
- [ ] **Task 1.2.2.10b:** Implement Edge Function for export expiration reminders (30, 15, 7 days before expiration)
- [ ] **Task 1.2.2.11:** Create scheduled trigger for export expiration checks (daily)
- [ ] **Task 1.2.2.11a:** Implement pg_cron setup for export expiration checks (daily job, timezone handling)
  - **Reference:** [Edge Functions Specification](../../02-architecture/api/edge-functions.md)
  - **Scheduled Job Specifications:** (Leila's Audit - Issue #28)
    - Cron expression: `0 9 * * *` (daily at 09:00)
    - Timezone handling: Morocco time (UTC+01:00), use pg_cron with proper timezone settings
    - Job logic: Check all export authorizations for approaching expiration (30, 15, 7 days), send reminder notifications
    - Error handling: Log failures, retry mechanism, alerting for persistent failures
    - Monitoring: Job execution logs, success/failure tracking, execution time monitoring
- [ ] **Task 1.2.2.12:** Create ECS RPC function - Export authorization extension (ecs_request_extension) - up to 30 additional days, subject to Tier 1 approval

---

## Subphase 1.2.3: ECS Post-Authorization & Replenishment (Week 11)

### ECS Post-Authorization Backend Tasks
- [ ] **Task 1.2.3.1:** Create ECS RPC function - Export completion report (ecs_report_export_completion)
- [ ] **Task 1.2.3.2:** Create ECS RPC function - Export cancellation/modification request (ecs_request_export_change)
- [ ] **Task 1.2.3.3:** Implement replenishment schedule tracking logic
- [ ] **Task 1.2.3.4:** Create ECS RPC function - Replenishment delay escalation (ecs_escalate_delay)
- [ ] **Task 1.2.3.5:** Create scheduled trigger for replenishment delay escalation (daily check)
- [ ] **Task 1.2.3.5a:** Implement pg_cron setup for replenishment delay escalation (daily check, escalation logic)
- [ ] **Task 1.2.3.11b:** Implement file upload security (file type validation, virus scanning, storage bucket RLS policies)
- [ ] **Task 1.2.3.6:** Implement tiered escalation process (day 1 alerts, days 2-7 warnings, days 8-14 escalation, 15+ critical)
- [ ] **Task 1.2.3.7:** Create ECS RPC function - Replenishment proof submission (ecs_submit_replenishment_proof)
- [ ] **Task 1.2.3.8:** Create ECS RPC function - Replenishment verification (ecs_verify_replenishment)

### ECS Frontend Tasks
- [ ] **Task 1.2.3.9:** Create ECS module layout and navigation (module activation check) - **Wireframe:** [Task 0.5.4.0 - ECS Overview](../../04-design/user-experience/wireframes/03-ecs/overview/task-0.5.4.0-ecs-overview.md) - **Reference:** [Navigation & Layout Patterns](../../02-architecture/frontend/navigation-layout-patterns.md)
- [ ] **Task 1.2.3.9a:** Implement ECS module activation check UI (per routing-structure.md) - **Wireframe:** [Task 0.5.4.0 - ECS Overview](../../04-design/user-experience/wireframes/03-ecs/overview/task-0.5.4.0-ecs-overview.md) - **Reference:** [Navigation & Layout Patterns](../../02-architecture/frontend/navigation-layout-patterns.md), [Role-Based UI Patterns](../../02-architecture/frontend/role-based-ui-patterns.md)
- [ ] **Task 1.2.3.10:** Implement Export requests list page (my requests, pending approvals for MOH) - **Wireframe:** [Task 0.5.4.1 - Export Requests List](../../04-design/user-experience/wireframes/03-ecs/export-requests/task-0.5.4.1-export-requests-list.md) - **Reference:** [Role-Based UI Patterns](../../02-architecture/frontend/role-based-ui-patterns.md), [Navigation & Layout Patterns](../../02-architecture/frontend/navigation-layout-patterns.md)
- [ ] **Task 1.2.3.11:** Implement Export request form (SKU selection, destination, timeline, documentation upload) - **Wireframe:** [Task 0.5.4.2 - Export Request Form](../../04-design/user-experience/wireframes/03-ecs/export-requests/task-0.5.4.2-export-request-form.md) - **Reference:** [Form Design Patterns](../../02-architecture/frontend/form-design-patterns.md)
- [ ] **Task 1.2.3.11a:** Implement ExportRequestForm sections (SKU selection, destination, timeline, documentation upload) - **Reference:** [Form Design Patterns](../../02-architecture/frontend/form-design-patterns.md)
- [ ] **Task 1.2.3.11b:** Implement FileUpload component (drag-drop, progress, validation - per file-upload-storage-security.md) - **Reference:** [UI Component Specifications](../../02-architecture/frontend/ui-component-specifications.md), [Form Design Patterns](../../02-architecture/frontend/form-design-patterns.md)
- [ ] **Task 1.2.3.12:** Implement Export request detail page (request data, evaluation status, threshold comparison) - **Wireframe:** [Task 0.5.4.3 - Export Request Detail](../../04-design/user-experience/wireframes/03-ecs/export-requests/task-0.5.4.3-export-request-detail.md) - **Reference:** [Navigation & Layout Patterns](../../02-architecture/frontend/navigation-layout-patterns.md)
- [ ] **Task 1.2.3.12a:** Implement ThresholdComparisonCard component (current stock vs VCI threshold vs ECS threshold) - **Wireframe:** [Task 0.5.4.3 - Export Request Detail](../../04-design/user-experience/wireframes/03-ecs/export-requests/task-0.5.4.3-export-request-detail.md) - **Reference:** [UI Component Specifications](../../02-architecture/frontend/ui-component-specifications.md)
- [ ] **Task 1.2.3.13:** Implement Export workflow actions (submit, verify, approve, reject, intervene buttons - role-based) - **Wireframe:** [Task 0.5.4.4 - Export Workflow Actions](../../04-design/user-experience/wireframes/03-ecs/export-requests/task-0.5.4.4-export-workflow-actions.md) - **Reference:** [Role-Based UI Patterns](../../02-architecture/frontend/role-based-ui-patterns.md)
- [ ] **Task 1.2.3.13a:** Implement InterventionWindowIndicator component (countdown timer, intervention actions) - **Reference:** [UI Component Specifications](../../02-architecture/frontend/ui-component-specifications.md)
- [ ] **Task 1.2.3.14:** Implement Export authorizations list page (active authorizations, expired authorizations) - **Wireframe:** [Task 0.5.4.5 - Export Authorizations List](../../04-design/user-experience/wireframes/03-ecs/authorizations/task-0.5.4.5-export-authorizations-list.md) - **Reference:** [Role-Based UI Patterns](../../02-architecture/frontend/role-based-ui-patterns.md)
- [ ] **Task 1.2.3.15:** Implement Export authorization detail page (authorization details, validity period, threshold status) - **Wireframe:** [Task 0.5.4.6 - Export Authorization Detail](../../04-design/user-experience/wireframes/03-ecs/authorizations/task-0.5.4.6-export-authorization-detail.md) - **Reference:** [Navigation & Layout Patterns](../../02-architecture/frontend/navigation-layout-patterns.md)
- [ ] **Task 1.2.3.15a:** Implement AuthorizationValidityIndicator component (90-day countdown, expiration warnings) - **Wireframe:** [Task 0.5.4.6 - Export Authorization Detail](../../04-design/user-experience/wireframes/03-ecs/authorizations/task-0.5.4.6-export-authorization-detail.md) - **Reference:** [UI Component Specifications](../../02-architecture/frontend/ui-component-specifications.md)
- [ ] **Task 1.2.3.15b:** Implement expiration countdown (export authorization 90-day countdown with reminders) - **Wireframe:** [Task 0.5.4.6 - Export Authorization Detail](../../04-design/user-experience/wireframes/03-ecs/authorizations/task-0.5.4.6-export-authorization-detail.md) - **Reference:** [UI Component Specifications](../../02-architecture/frontend/ui-component-specifications.md)
- [ ] **Task 1.2.3.16:** Implement Export completion reporting interface - **Wireframe:** [Task 0.5.4.7 - Export Completion Reporting](../../04-design/user-experience/wireframes/03-ecs/authorizations/task-0.5.4.7-export-completion-reporting.md) - **Reference:** [Form Design Patterns](../../02-architecture/frontend/form-design-patterns.md)
- [ ] **Task 1.2.3.16a:** Implement ExportCompletionForm component (actual export details, shipping info) - **Wireframe:** [Task 0.5.4.7 - Export Completion Reporting](../../04-design/user-experience/wireframes/03-ecs/authorizations/task-0.5.4.7-export-completion-reporting.md) - **Reference:** [UI Component Specifications](../../02-architecture/frontend/ui-component-specifications.md)
- [ ] **Task 1.2.3.17:** Implement Replenishment schedule tracking interface - **Wireframe:** [Task 0.5.4.8 - Replenishment Schedule Tracking](../../04-design/user-experience/wireframes/03-ecs/replenishment/task-0.5.4.8-replenishment-schedule-tracking.md) - **Reference:** [Navigation & Layout Patterns](../../02-architecture/frontend/navigation-layout-patterns.md)
- [ ] **Task 1.2.3.17a:** Implement ReplenishmentScheduleTimeline component (schedule visualization, delay indicators) - **Wireframe:** [Task 0.5.4.8 - Replenishment Schedule Tracking](../../04-design/user-experience/wireframes/03-ecs/replenishment/task-0.5.4.8-replenishment-schedule-tracking.md) - **Reference:** [UI Component Specifications](../../02-architecture/frontend/ui-component-specifications.md)

---

## Subphase 1.2.4: ECS Integration Testing & Seed Data (Week 12)

### ECS Testing & Data Tasks
- [ ] **Task 1.2.4.1:** Create ECS module test suite (unit tests for RPC functions)
- [ ] **Task 1.2.4.1a:** Create ECS-specific test scenarios (threshold switching tests, conditional validation tests, intervention window tests)
- [ ] **Task 1.2.4.2:** Create integration tests - ECS workflow (submission → evaluation → approval → authorization)
- [ ] **Task 1.2.4.3:** Create integration tests - Threshold switching (VCI → ECS → VCI)
- [ ] **Task 1.2.4.4:** Create integration tests - Conditional validation (CMC score integration)
- [ ] **Task 1.2.4.5:** Create integration tests - Replenishment delay escalation
- [ ] **Task 1.2.4.6:** Create mock data generation script - Export requests (historical export request scenarios)
- [ ] **Task 1.2.4.7:** Create mock data generation script - Export authorizations (active and expired authorizations)
- [ ] **Task 1.2.4.8:** Create mock data generation script - Replenishment schedules (various scenarios including delays)
- [ ] **Task 1.2.4.9:** Execute ECS mock data population
- [ ] **Task 1.2.4.10:** Create ECS module user documentation
- [ ] **Task 1.2.4.11:** Phase 1.2 internal review and sign-off

---

# PHASE 1.3: CMC DEVELOPMENT (Month 5 - Weeks 13-16)

**Duration:** 4 weeks  
**Objective:** Build Compliance Monitoring Center module and integrate with all modules

## Subphase 1.3.1: CMC Scoring Engine (Week 13)

### CMC Backend Setup Tasks
- [ ] **Task 1.3.1.1:** Create database migration for CMC tables (compliance_scores, compliance_score_components, disputes, regulatory_reports)
  - **Migration Requirements:**
    - Create migration file: `supabase/migrations/YYYYMMDDHHMMSS_create_cmc_tables.sql`
    - Apply migration using `supabase migration apply` or auto-apply in local dev
    - Verify migration via `supabase migration list` or Supabase dashboard
    - Verify tables using SQL queries via Supabase dashboard
    - Verify security best practices via SQL queries
  - **Developer Notes:**
    - Follow standard Supabase migration practices (see [Database Management with Supabase](#database-management-with-supabase) section)
- [ ] **Task 1.3.1.1a:** Verify CMC schema completeness (all columns, score calculation fields, dispute workflow fields)
  - **Verification Requirements:**
    - Verify all CMC tables exist using SQL queries via Supabase dashboard
    - Use SQL queries to verify columns, constraints, indexes
- [ ] **Task 1.3.1.1b:** Define CMC integration points with all modules (event triggers, score calculation dependencies)
- [ ] **Task 1.3.1.2:** Implement RLS policies for CMC tables (module activation check, score visibility rules)
- [ ] **Task 1.3.1.2a:** Implement detailed RLS policies for CMC tables (compliance_scores visibility rules, disputes, regulatory_reports) with module activation checks
- [ ] **Task 1.3.1.3:** Create CMC RPC function - Component score calculation (cmc_calculate_component_scores)
- [ ] **Task 1.3.1.4:** Implement Regulatory Reporting Compliance Rate calculation (percentage of mandatory weekly stock reports submitted within deadline over 12 months)
- [ ] **Task 1.3.1.4a:** Implement detailed Regulatory Reporting Compliance Rate formula (12-month rolling window, deadline calculation logic, percentage calculation)
- [ ] **Task 1.3.1.5:** Implement Stock Threshold Violation Frequency calculation (average count of SKUs per reporting cycle failing minimum stock requirements over 6 months)
- [ ] **Task 1.3.1.5a:** Implement detailed Stock Threshold Violation Frequency formula (6-month rolling average, SKU count per cycle, average calculation)
- [ ] **Task 1.3.1.6:** Implement Replenishment Plan Adherence calculation (composite of historical fulfillment and future commitment horizons, ECS module only, if active)
- [ ] **Task 1.3.1.6a:** Implement detailed Replenishment Plan Adherence formula (historical fulfillment percentage, future commitment horizon calculation, composite score)
- [ ] **Task 1.3.1.7:** Implement Aggregate Non-Compliance Exposure calculation (total SKU-days of threshold non-compliance over 12 months)
- [ ] **Task 1.3.1.7a:** Implement detailed Aggregate Non-Compliance Exposure formula (SKU-days calculation, 12-month rolling sum, exposure metric)
- [ ] **Task 1.3.1.8:** Implement Data Quality Signals calculation (formulas and calculation methods to be defined)
- [ ] **Task 1.3.1.8a:** Define Data Quality Signals calculation formulas (completeness metrics, accuracy metrics, timeliness metrics, formula specifications)
- [ ] **Task 1.3.1.9:** Implement Critical Medicine Coverage calculation (formulas and calculation methods to be defined)
- [ ] **Task 1.3.1.9a:** Define Critical Medicine Coverage calculation formulas (coverage percentage, critical SKU tracking, formula specifications)
- [ ] **Task 1.3.1.10:** Implement Export Compliance calculation (ECS module only, if active, formulas and calculation methods to be defined)
- [ ] **Task 1.3.1.10a:** Define Export Compliance calculation formulas (export authorization compliance, replenishment adherence, formula specifications)
- [ ] **Task 1.3.1.11:** Create CMC RPC function - Total score calculation (cmc_calculate_total_score) - weighted average of component factors (0-100 scale)
- [ ] **Task 1.3.1.11a:** Implement weighted average calculation logic (component weight normalization, weighted sum calculation, 0-100 scale mapping)
- [ ] **Task 1.3.1.12:** Implement configurable component weights (Tier 1 configuration, module-specific components excluded when modules not active)
- [ ] **Task 1.3.1.12a:** Implement component weight configuration UI (Tier 1 weight configuration interface, weight validation, weight persistence, default component weights if not configured)
  - **Reference:** [CMC Component Weights](../../../02-architecture/modules/cmc-component-weights.md) - Default weights and rationale

---

## Subphase 1.3.2: CMC Monthly Calculation & Disputes (Week 14)

### CMC Calculation Backend Tasks
- [ ] **Task 1.3.2.1:** Create CMC RPC function - Monthly score calculation (cmc_calculate_monthly_scores)
- [ ] **Task 1.3.2.2:** Create scheduled trigger for monthly compliance score calculation (1st of month at 2 AM)
- [ ] **Task 1.3.2.2a:** Implement pg_cron setup for monthly CMC score calculation (1st of month at 2 AM, timezone handling)
  - **Reference:** [Edge Functions Specification](../../02-architecture/api/edge-functions.md)
  - **Scheduled Job Specifications:** (Leila's Audit - Issue #28)
    - Cron expression: `0 2 1 * *` (1st of month at 02:00)
    - Timezone handling: Morocco time (UTC+01:00), use pg_cron with proper timezone settings
    - Job logic: Calculate compliance scores for all companies for previous month, create compliance_score records
    - Error handling: Log failures, retry mechanism, alerting for persistent failures, partial failure handling (continue with other companies)
    - Monitoring: Job execution logs, success/failure tracking, execution time monitoring, score calculation audit trail
- [ ] **Task 1.3.2.3:** Implement event-triggered score recalculation (high breaches, enforcement actions, ECS approvals)
- [ ] **Task 1.3.2.3a:** Implement event-triggered recalculation coordinator (ECS approval event → CMC recalculation trigger)
- [ ] **Task 1.3.2.3b:** Implement event-triggered recalculation logic (event detection, recalculation trigger, score update workflow)
- [ ] **Task 1.3.2.4:** Create CMC RPC function - Score freeze (cmc_freeze_score_snapshot) - create frozen snapshot
- [ ] **Task 1.3.2.5:** Create CMC RPC function - Tier 2 review flag (cmc_flag_score_for_review)
- [ ] **Task 1.3.2.6:** Create CMC RPC function - Tier 1 score override (cmc_override_score) - with mandatory justification
  - **Validation:** Justification required (minimum 50 characters, required field, format validation)
  - **Reference:** [Governance Workflows](../../03-governance/governance-workflows.md), [Backend Validation Strategy](../../02-architecture/security/backend-validation-strategy.md)
- [ ] **Task 1.3.2.7:** Implement adjustment notes system (Tier 1 only, preserves original snapshot, immutable audit trail)
- [ ] **Task 1.3.2.8:** Create CMC RPC function - Dispute creation (cmc_create_dispute) - can address total score or specific components
- [ ] **Task 1.3.2.9:** Create CMC RPC function - Dispute review (cmc_review_dispute) - Tier 2 reviews and forwards to Tier 1
- [ ] **Task 1.3.2.10:** Create CMC RPC function - Dispute resolution (cmc_resolve_dispute) - Tier 1 final decision, creates adjustment note if upheld
- [ ] **Task 1.3.2.11:** Implement 30-day dispute window logic (from score publication date, scores marked "Under Dispute" but remain visible during review)

### CMC Frontend Tasks
- [ ] **Task 1.3.2.12:** Create CMC module layout and navigation (module activation check) - **Wireframe:** [Task 0.5.5.0 - CMC Overview](../../04-design/user-experience/wireframes/04-cmc/overview/task-0.5.5.0-cmc-overview.md) - **Reference:** [Navigation & Layout Patterns](../../02-architecture/frontend/navigation-layout-patterns.md)
- [ ] **Task 1.3.2.12a:** Implement CMC module activation check UI (per routing-structure.md) - **Wireframe:** [Task 0.5.5.0 - CMC Overview](../../04-design/user-experience/wireframes/04-cmc/overview/task-0.5.5.0-cmc-overview.md) - **Reference:** [Navigation & Layout Patterns](../../02-architecture/frontend/navigation-layout-patterns.md), [Role-Based UI Patterns](../../02-architecture/frontend/role-based-ui-patterns.md)
- [ ] **Task 1.3.2.13:** Implement Compliance scores list page (my score for companies, all scores for MOH) - **Wireframe:** [Task 0.5.5.1 - Compliance Scores List](../../04-design/user-experience/wireframes/04-cmc/scores/task-0.5.5.1-compliance-scores-list.md) - **Reference:** [Role-Based UI Patterns](../../02-architecture/frontend/role-based-ui-patterns.md)
- [ ] **Task 1.3.2.14:** Implement Compliance score detail page (total score, component breakdown, category-level tips for companies - formulas/weights hidden to prevent gaming, companies see exact score + category-level tips) - **Wireframe:** [Task 0.5.5.2 - Compliance Score Detail](../../04-design/user-experience/wireframes/04-cmc/scores/task-0.5.5.2-compliance-score-detail.md) - **Reference:** [Navigation & Layout Patterns](../../02-architecture/frontend/navigation-layout-patterns.md)
- [ ] **Task 1.3.2.14a:** Implement ScoreVisualization component (score display, component breakdown chart/gauge) - **Wireframe:** [Task 0.5.5.2 - Compliance Score Detail](../../04-design/user-experience/wireframes/04-cmc/scores/task-0.5.5.2-compliance-score-detail.md) - **Reference:** [UI Component Specifications](../../02-architecture/frontend/ui-component-specifications.md)
- [ ] **Task 1.3.2.14b:** Implement ComponentBreakdownCard component (individual component scores, weights - hidden for companies) - **Wireframe:** [Task 0.5.5.2 - Compliance Score Detail](../../04-design/user-experience/wireframes/04-cmc/scores/task-0.5.5.2-compliance-score-detail.md) - **Reference:** [UI Component Specifications](../../02-architecture/frontend/ui-component-specifications.md)
- [ ] **Task 1.3.2.14c:** Implement compliance score charts (component breakdown visualization) - **Wireframe:** [Task 0.5.5.2 - Compliance Score Detail](../../04-design/user-experience/wireframes/04-cmc/scores/task-0.5.5.2-compliance-score-detail.md) - **Reference:** [UI Component Specifications](../../02-architecture/frontend/ui-component-specifications.md)
- [ ] **Task 1.3.2.15:** Implement Leaderboard page (anonymized for companies - percentile/rank band, full for Tier 1, oversight for Tier 2) - **Wireframe:** [Task 0.5.5.3 - Leaderboard](../../04-design/user-experience/wireframes/04-cmc/scores/task-0.5.5.3-leaderboard.md) - **Reference:** [Role-Based UI Patterns](../../02-architecture/frontend/role-based-ui-patterns.md)
- [ ] **Task 1.3.2.15a:** Implement LeaderboardTable component (anonymized for companies, full for Tier 1, oversight for Tier 2) - **Wireframe:** [Task 0.5.5.3 - Leaderboard](../../04-design/user-experience/wireframes/04-cmc/scores/task-0.5.5.3-leaderboard.md) - **Reference:** [UI Component Specifications](../../02-architecture/frontend/ui-component-specifications.md)
- [ ] **Task 1.3.2.16:** Implement Score review interface (Tier 2 - flag anomalies, Tier 1 - override with justification) - **Wireframes:** [Task 0.5.5.4 - Score Review Tier 2 Flag Anomalies](../../04-design/user-experience/wireframes/04-cmc/scores/task-0.5.5.4-score-review-tier2-flag-anomalies.md), [Task 0.5.5.5 - Score Review Tier 1 Override](../../04-design/user-experience/wireframes/04-cmc/scores/task-0.5.5.5-score-review-tier1-override.md) - **Reference:** [Form Design Patterns](../../02-architecture/frontend/form-design-patterns.md), [Role-Based UI Patterns](../../02-architecture/frontend/role-based-ui-patterns.md)
- [ ] **Task 1.3.2.16a:** Implement ScoreOverrideModal component (justification input, override reason, immutable audit trail) - **Wireframe:** [Task 0.5.5.5 - Score Review Tier 1 Override](../../04-design/user-experience/wireframes/04-cmc/scores/task-0.5.5.5-score-review-tier1-override.md) - **Reference:** [UI Component Specifications](../../02-architecture/frontend/ui-component-specifications.md)
- [ ] **Task 1.3.2.17:** Implement Dispute creation interface (companies - 30-day window, dispute form) - **Wireframe:** [Task 0.5.5.8 - Dispute Creation Interface](../../04-design/user-experience/wireframes/04-cmc/disputes/task-0.5.5.8-dispute-creation-interface.md) - **Reference:** [Form Design Patterns](../../02-architecture/frontend/form-design-patterns.md), [Role-Based UI Patterns](../../02-architecture/frontend/role-based-ui-patterns.md)
- [ ] **Task 1.3.2.17a:** Implement DisputeForm component (dispute reason, component selection, evidence upload) - **Wireframe:** [Task 0.5.5.8 - Dispute Creation Interface](../../04-design/user-experience/wireframes/04-cmc/disputes/task-0.5.5.8-dispute-creation-interface.md) - **Reference:** [UI Component Specifications](../../02-architecture/frontend/ui-component-specifications.md)
- [ ] **Task 1.3.2.17b:** Implement file upload for dispute evidence - **Wireframe:** [Task 0.5.8.2 - File Upload Modal](../../04-design/user-experience/wireframes/07-modals/task-0.5.8.2-file-upload-modal.md) - **Reference:** [UI Component Specifications](../../02-architecture/frontend/ui-component-specifications.md), [Form Design Patterns](../../02-architecture/frontend/form-design-patterns.md)
- [ ] **Task 1.3.2.18:** Implement Dispute review interface (Tier 2 - review, Tier 1 - resolution with adjustment notes) - **Wireframe:** [Task 0.5.5.9 - Dispute Review Interface](../../04-design/user-experience/wireframes/04-cmc/disputes/task-0.5.5.9-dispute-review-interface.md) - **Reference:** [Form Design Patterns](../../02-architecture/frontend/form-design-patterns.md), [Role-Based UI Patterns](../../02-architecture/frontend/role-based-ui-patterns.md)
- [ ] **Task 1.3.2.18a:** Implement DisputeReviewInterface component (dispute details, resolution actions, adjustment notes) - **Wireframe:** [Task 0.5.5.9 - Dispute Review Interface](../../04-design/user-experience/wireframes/04-cmc/disputes/task-0.5.5.9-dispute-review-interface.md) - **Reference:** [UI Component Specifications](../../02-architecture/frontend/ui-component-specifications.md)

---

## Subphase 1.3.3: CMC Reports & Integration (Week 15)

### CMC Reports Backend Tasks
- [ ] **Task 1.3.3.1:** Create CMC RPC function - Report generation (cmc_generate_regulatory_report)
- [ ] **Task 1.3.3.2:** Implement monthly report template
- [ ] **Task 1.3.3.3:** Implement quarterly report template
- [ ] **Task 1.3.3.4:** Implement annual report template
- [ ] **Task 1.3.3.5:** Create scheduled triggers for report generation (monthly, quarterly, annual)
- [ ] **Task 1.3.3.5a:** Implement pg_cron setup for report generation (monthly, quarterly, annual schedules)
- [ ] **Task 1.3.3.6:** Create CMC RPC function - Report review (cmc_review_report) - Tier 2 reviews for completeness and flags issues
- [ ] **Task 1.3.3.7:** Create CMC RPC function - Report approval (cmc_approve_report) - Tier 1 approves release
- [ ] **Task 1.3.3.8:** Implement report template customization (Tier 1 approval required for template changes)
- [ ] **Task 1.3.3.9:** Create CMC RPC function - Automated reminder trigger (cmc_send_regulatory_reminders)
- [ ] **Task 1.3.3.9a:** Implement Edge Function for regulatory reminders (7 days, 3 days, deadline day reminders)
- [ ] **Task 1.3.3.10:** Implement automated reminders (7 days, 3 days, deadline day - email + in-app notifications)
- [ ] **Task 1.3.3.14b:** Implement report analytics calculations (aggregate statistics, trend analysis, comparative analytics for reports)

### CMC Integration Tasks
- [ ] **Task 1.3.3.11:** Integrate CMC scores with ECS conditional validation (if ECS active)
- [ ] **Task 1.3.3.12:** Implement event-triggered CMC recalculation on ECS export approval
- [ ] **Task 1.3.3.13:** Create CMC Frontend Tasks - Reports list page - **Wireframe:** [Task 0.5.5.10 - Reports List](../../04-design/user-experience/wireframes/04-cmc/reports/task-0.5.5.10-reports-list.md) - **Reference:** [Navigation & Layout Patterns](../../02-architecture/frontend/navigation-layout-patterns.md), [Role-Based UI Patterns](../../02-architecture/frontend/role-based-ui-patterns.md)
- [ ] **Task 1.3.3.13a:** Implement ReportsListTable component (report types, status, download actions) - **Wireframe:** [Task 0.5.5.10 - Reports List](../../04-design/user-experience/wireframes/04-cmc/reports/task-0.5.5.10-reports-list.md) - **Reference:** [UI Component Specifications](../../02-architecture/frontend/ui-component-specifications.md)
- [ ] **Task 1.3.3.14:** Create CMC Frontend Tasks - Report detail page (view, download) - **Wireframe:** [Task 0.5.5.11 - Report Detail](../../04-design/user-experience/wireframes/04-cmc/reports/task-0.5.5.11-report-detail.md) - **Reference:** [Navigation & Layout Patterns](../../02-architecture/frontend/navigation-layout-patterns.md)
- [ ] **Task 1.3.3.14a:** Implement ReportViewer component (PDF viewer, data tables, charts) - **Wireframe:** [Task 0.5.5.11 - Report Detail](../../04-design/user-experience/wireframes/04-cmc/reports/task-0.5.5.11-report-detail.md) - **Reference:** [UI Component Specifications](../../02-architecture/frontend/ui-component-specifications.md)
- [ ] **Task 1.3.3.14b:** Implement report charts (data visualization in reports) - **Wireframe:** [Task 0.5.5.11 - Report Detail](../../04-design/user-experience/wireframes/04-cmc/reports/task-0.5.5.11-report-detail.md) - **Reference:** [UI Component Specifications](../../02-architecture/frontend/ui-component-specifications.md)
- [ ] **Task 1.3.3.15:** Create CMC Frontend Tasks - Report review/approval interface (Tier 2 review, Tier 1 approval) - **Wireframe:** [Task 0.5.5.12 - Report Review/Approval Interface](../../04-design/user-experience/wireframes/04-cmc/reports/task-0.5.5.12-report-review-approval-interface.md) - **Reference:** [Form Design Patterns](../../02-architecture/frontend/form-design-patterns.md), [Role-Based UI Patterns](../../02-architecture/frontend/role-based-ui-patterns.md)
- [ ] **Task 1.3.3.15a:** Implement ReportReviewInterface component (review checklist, approval actions) - **Wireframe:** [Task 0.5.5.12 - Report Review/Approval Interface](../../04-design/user-experience/wireframes/04-cmc/reports/task-0.5.5.12-report-review-approval-interface.md) - **Reference:** [UI Component Specifications](../../02-architecture/frontend/ui-component-specifications.md)

---

## Subphase 1.3.4: CMC Testing & Seed Data (Week 16)

### CMC Testing & Data Tasks
- [ ] **Task 1.3.4.1:** Create CMC module test suite (unit tests for scoring calculations)
- [ ] **Task 1.3.4.1a:** Create CMC-specific test scenarios (score calculation accuracy tests, dispute workflow tests, report generation tests)
- [ ] **Task 1.3.4.2:** Create integration tests - Monthly score calculation (all components, weighted average)
- [ ] **Task 1.3.4.3:** Create integration tests - Dispute workflow (creation → review → resolution)
- [ ] **Task 1.3.4.4:** Create integration tests - Report generation (monthly, quarterly, annual templates)
- [ ] **Task 1.3.4.5:** Create integration tests - CMC-ECS integration (scores to ECS validation)
- [ ] **Task 1.3.4.6:** Create integration tests - Event-triggered recalculation (ECS approval triggers)
- [ ] **Task 1.3.4.7:** Create mock data generation script - Compliance scores (2-3 years monthly scores for all companies)
- [ ] **Task 1.3.4.8:** Create mock data generation script - Disputes (historical dispute scenarios)
- [ ] **Task 1.3.4.9:** Create mock data generation script - Regulatory reports (historical reports)
- [ ] **Task 1.3.4.10:** Execute CMC mock data population
- [ ] **Task 1.3.4.11:** Create CMC module user documentation
- [ ] **Task 1.3.4.12:** Phase 1.3 internal review and sign-off

---

# PHASE 1.4: HOLISTIC MVP TESTING (Month 6 - Weeks 17-20)

**Duration:** 4 weeks  
**Objective:** Comprehensive end-to-end testing, performance validation, and customer presentation preparation

## Subphase 1.4.1: End-to-End Integration Testing (Week 17)

### Integration Testing Tasks
- [ ] **Task 1.4.1.1:** Create end-to-end test scenarios - Complete RMM workflow (company submission → approval → implementation)
- [ ] **Task 1.4.1.2:** Create end-to-end test scenarios - Complete VCI workflow (AAMS → MSQ → WSL → breach detection → analysis)
- [ ] **Task 1.4.1.3:** Create end-to-end test scenarios - Complete ECS workflow (export request → approval → authorization → completion)
- [ ] **Task 1.4.1.4:** Create end-to-end test scenarios - Complete CMC workflow (monthly calculation → dispute → resolution)
- [ ] **Task 1.4.1.5:** Create cross-module test scenarios - ECS export → CMC score impact
- [ ] **Task 1.4.1.6:** Create cross-module test scenarios - CMC score → ECS conditional validation
- [ ] **Task 1.4.1.7:** Create cross-module test scenarios - ECS authorization → VCI threshold switching
- [ ] **Task 1.4.1.8:** Create cross-module test scenarios - VCI breach → CMC score impact
- [ ] **Task 1.4.1.9:** Test data flows between all modules (MSQ → XAMS, WSL → compliance scoring, etc.)
- [ ] **Task 1.4.1.9a:** Test data flow contracts (MSQ→XAMS calculation details, WSL→compliance scoring formulas)
- [ ] **Task 1.4.1.10:** Test module activation/deactivation scenarios
- [ ] **Task 1.4.1.11:** Test all scheduled triggers (monthly calculations, deadline checks, expiration checks)
- [ ] **Task 1.4.1.11a:** Test all scheduled jobs execution (manual trigger tests, timezone accuracy, job failure handling)
- [ ] **Task 1.4.1.12:** Test module activation sequence (RMM→VCI→ECS→CMC dependency chain)
- [ ] **Task 1.4.1.13:** Test module deactivation impact (what happens when optional modules are disabled mid-workflow)
- [ ] **Task 1.4.1.14:** Test cross-module workflow dependencies (RMM product update → VCI threshold recalculation, ECS export → CMC score impact)
- [ ] **Task 1.4.1.15:** Create test data cleanup strategy (test isolation, data cleanup between tests, parallel test execution)

---

## Subphase 1.4.2: Performance & Security Testing (Week 18)

### Performance Testing Tasks
- [ ] **Task 1.4.2.1:** Perform load testing - 75 companies concurrent access
- [ ] **Task 1.4.2.1a:** Set up load testing tools (k6, Artillery, or similar, test script creation, performance baseline)
- [ ] **Task 1.4.2.2:** Perform load testing - Large dataset queries (2-3 years historical data)
- [ ] **Task 1.4.2.3:** Perform load testing - Dashboard performance (governance dashboard with all companies)
- [ ] **Task 1.4.2.4:** Test RLS policy performance (company isolation queries)
- [ ] **Task 1.4.2.5:** Test database query optimization (index usage, query plans)
- [ ] **Task 1.4.2.5a:** Analyze and optimize slow queries (EXPLAIN ANALYZE, query plan review)
- [ ] **Task 1.4.2.5b:** Create missing indexes based on query patterns (composite indexes for common filters)
- [ ] **Task 1.4.2.6:** Test scheduled job performance (monthly score calculation, deadline checks)
- [ ] **Task 1.4.2.6a:** Performance test scheduled jobs (execution time, database load, concurrent job handling)
- [ ] **Task 1.4.2.7:** Measure response times (target: <2 seconds for standard operations)
- [ ] **Task 1.4.2.7a:** Define performance benchmarks (response time targets per operation, throughput targets, resource usage limits)
- [ ] **Task 1.4.2.8:** Test concurrent submission handling

### Security Testing Tasks
- [ ] **Task 1.4.2.9:** Perform security audit - Authentication and authorization
- [ ] **Task 1.4.2.10:** Perform security audit - RLS policy enforcement (company data isolation)
- [ ] **Task 1.4.2.10a:** Security audit - RLS policy coverage (all tables have RLS enabled, all policies tested)
- [ ] **Task 1.4.2.11:** Perform security audit - Input validation and sanitization
- [ ] **Task 1.4.2.11a:** Implement input sanitization validation (SQL injection prevention, XSS prevention, parameterized queries)
- [ ] **Task 1.4.2.11b:** Comprehensive security testing (Salim's Audit - Issue #51)
  - **Reference:** [Security Architecture](../../02-architecture/security/security-architecture.md)
  - **Security Testing Checklist:**
    - SQL injection testing: Test all RPC function inputs with SQL injection payloads
    - XSS testing: Test all text inputs with XSS payloads
    - Authentication testing: Test JWT validation, session management, password policies
    - Authorization testing: Test role-based access control, RLS policy enforcement
    - Audit logging testing: Verify all security-relevant actions are logged
    - File upload testing: Test file type validation, file size limits, malicious file detection
  - **Estimated Time:** 6-8 hours
- [ ] **Task 1.4.2.12:** Perform security audit - Audit logging completeness
- [ ] **Task 1.4.2.13:** Perform security audit - API security (rate limiting, error handling)
- [ ] **Task 1.4.2.13a:** Implement API rate limiting (per-user rate limits, per-endpoint rate limits, rate limit error handling)
- [ ] **Task 1.4.2.14:** Test two-person rule enforcement
- [ ] **Task 1.4.2.14a:** Test two-person rule implementation (approval workflow, audit trail, enforcement logic)
- [ ] **Task 1.4.2.15:** Test role-based access control (all roles, all permissions)
- [ ] **Task 1.4.2.15a:** Create comprehensive RBAC test matrix (all roles × all permissions, test denial of access)

---

## Subphase 1.4.3: Edge Cases & Error Handling (Week 19)

### Edge Case Testing Tasks
- [ ] **Task 1.4.3.1:** Test edge cases - Late AAMS submissions (grace period, overdue handling)
- [ ] **Task 1.4.3.2:** Test edge cases - Missing AAMS (previous year fallback, manual threshold)
- [ ] **Task 1.4.3.3:** Test edge cases - WSL deadline violations (Friday EOD, Monday EOD)
- [ ] **Task 1.4.3.4:** Test edge cases - Multiple concurrent breaches
- [ ] **Task 1.4.3.5:** Test edge cases - Export authorization expiration (90 days, extension requests)
- [ ] **Task 1.4.3.6:** Test edge cases - Replenishment delay escalation (all stages)
- [ ] **Task 1.4.3.7:** Test edge cases - Threshold switching edge cases (ECS Threshold < VCI Threshold)
- [ ] **Task 1.4.3.8:** Test edge cases - CMC score calculation with missing data
- [ ] **Task 1.4.3.9:** Test edge cases - Module activation/deactivation during active workflows
- [ ] **Task 1.4.3.10:** Test error handling - Network failures, timeout scenarios
- [ ] **Task 1.4.3.11:** Test error handling - Invalid data submissions
- [ ] **Task 1.4.3.12:** Test error handling - Concurrent update conflicts
- [ ] **Task 1.4.3.13:** Test error recovery - Transaction rollbacks
- [ ] **Task 1.4.3.14:** Test audit log integrity - All operations logged correctly
- [ ] **Task 1.4.3.15:** Create test coverage reporting (code coverage metrics, coverage targets, coverage reporting in CI/CD)

---

## Subphase 1.4.4: Documentation & Customer Presentation (Week 20)

### Documentation Tasks
- [ ] **Task 1.4.4.1:** Create complete system documentation (architecture overview, module documentation)
- [ ] **Task 1.4.4.1a:** Create architecture decision records (ADRs) documentation for key technical decisions
- [ ] **Task 1.4.4.2:** Create user manuals (company user guide, MOH user guide, role-specific guides)
- [ ] **Task 1.4.4.3:** Create API documentation (complete RPC function documentation, request/response schemas)
- [ ] **Task 1.4.4.4:** Create administrator documentation (deployment guide, configuration guide, troubleshooting)
- [ ] **Task 1.4.4.5:** Create mock data documentation (data structure, usage instructions)

### Customer Presentation Tasks
- [ ] **Task 1.4.4.6:** Prepare demo scenarios (realistic workflows showcasing all modules)
- [ ] **Task 1.4.4.7:** Create presentation materials (PowerPoint, demo script, talking points)
- [ ] **Task 1.4.4.8:** Prepare demo environment (clean data set, pre-configured scenarios)
- [ ] **Task 1.4.4.9:** Create video walkthroughs (key workflows, module overviews)
- [ ] **Task 1.4.4.10:** Prepare Q&A document (anticipated questions and answers)
- [ ] **Task 1.4.4.11:** Conduct internal presentation rehearsal

### Phase 1.4 Sign-off
- [ ] **Task 1.4.4.12:** Final system review (all modules, all features)
- [ ] **Task 1.4.4.13:** Performance benchmarks validation (all targets met)
- [ ] **Task 1.4.4.14:** Security validation (all requirements met)
- [ ] **Task 1.4.4.15:** Phase 1.4 sign-off and approval for Phase 2 (MOH UAT)

---

## Phase 1 Success Criteria Summary

### Phase 1.1 (RMM + VCI)
✅ All RMM workflows functional (CRUD, approval chains, two-person rule)  
✅ All VCI workflows functional (submissions, threshold calculation, breach detection)  
✅ Mock data successfully populated (75 companies)  
✅ Internal testing passed  
✅ Documentation complete

### Phase 1.2 (ECS)
✅ All ECS workflows functional (export requests, approvals, threshold switching)  
✅ Integration with RMM + VCI working correctly  
✅ Mock export scenarios tested  
✅ Internal testing passed

### Phase 1.3 (CMC)
✅ All CMC workflows functional (scoring, disputes, reports)  
✅ Integration with all modules working correctly  
✅ Mock compliance scenarios tested  
✅ Internal testing passed

### Phase 1.4 (Holistic Testing)
✅ All modules working together correctly  
✅ Performance targets met  
✅ Security requirements validated  
✅ Customer presentation materials ready  
✅ System ready for MOH UAT

---

## Risk Mitigation

**Risk 1: Development Timeline Delays**
- **Mitigation:** Bite-size tasks enable parallel work, clear dependencies documented
- **Contingency:** Buffer time in Week 8, 12, 16, 20 for catch-up

**Risk 2: Integration Issues Between Modules**
- **Mitigation:** Clear module interfaces defined in Phase 0, integration tests at each phase
- **Contingency:** Additional integration testing time in Phase 1.4

**Risk 3: Seed Data Complexity**
- **Mitigation:** Seed data generation scripts created early, validated incrementally (Farah quality gate + automated integrity checks)
- **Contingency:** Simplified data sets if needed, can expand later

**Risk 4: Performance Issues with 75 Companies**
- **Mitigation:** Performance testing early, query optimization, indexing strategy
- **Contingency:** Performance tuning in Phase 1.4, database optimization

---

## Team Assignments (Recommended)

**Note:** Phase 0.5 team assignments are in [Phase 0.5: UI/UX Wireframes & Design Validation](phase-0-5-ui-ux-wireframes.md)

**Phase 1.1:**
- **Oliver:** Architecture oversight, integration coordination
- **Nadia:** Database migrations, RLS policies
- **Rafi:** RLS implementation, security policies
- **Maya:** RPC functions, workflow implementation
- **Salim:** Security implementation, audit logging
- **Leila:** Scheduled triggers, background jobs
- **Emma:** Frontend development, UI/UX (using wireframes as reference)
- **Hassan:** Testing strategy, test implementation
- **Farah:** Seed data generation oversight, analytics realism, data validation (coverage + distributions + KPI sanity checks)

**Phase 1.2-1.4:**
- Similar team assignments with module-specific focus

---

---

## Audit Notes

**Last Updated:** 2025-01-01  
**Audited By:** Fatima (MOH Governance & Regulation SME), Dr. Samir (Pharma Value Chain SME), Emma (UI/UX + Next.js Frontend Specialist), Oliver (Chief Architect), Nadia (Database Modeler), Rafi (RLS/RBAC Specialist), Maya (Workflow/RPC Engineer), Salim (Security & Audit Engineer), Leila (Edge Functions/Jobs Engineer), Hassan (QA/Assurance Engineer), Farah (Analytics/CMC Specialist)

### Key Additions from Audits

**Communication Channels (Approved 2025-01-01):**
- Communication tables added to database schema (conversations, messages, message_attachments, message_read_receipts, conversation_participants)
- Communication RPC functions (create conversation, send message, mark read, archive, create announcement)
- Communication routes added to routing structure (/communications/inbox, /communications/compose, etc.)
- Communication components (inbox, conversation detail, compose, announcements)
- Communication wireframes added to Phase 0.5 Priority 1 (6 wireframe tasks)
- Communication navigation added to Global section in sidebar
- **Communication lifecycle defined** with state transitions, governance requirements, and regulatory compliance (see [Communication Channels Lifecycle](../../02-architecture/communication-channels-lifecycle.md))
- All communication requirements approved (governance, security, UI/UX, architecture)
- See [Communication Channels Requirements](../../02-architecture/communication-channels-requirements.md) for complete specifications

**Governance & Regulatory (Fatima):**
- Mandatory justification for Tier 1 enforcement actions
- Rejection iteration tracking (max 2 iterations)
- AAMS grace period compliance logic
- Threshold modification advisory suggestions
- MOH WSL adjustment requests
- Enforcement action documentation requirements
- Regulatory report review workflow (Tier 2 → Tier 1)

**Value Chain Business Processes (Dr. Samir):**
- XAMS seasonal awareness and minimum months validation
- Batch breach analysis capability
- Export expiration reminders (30, 15, 7 days)
- Post-approval intervention logic
- CMC component calculation details
- Score and leaderboard visibility rules
- AAMS vs MSQ independence clarification
- Export authorization validity (90 calendar days)
- SKU pharmaceutical attributes specification (dosage_strength, dosage_form, pack_size, unit_of_measure)
- Simplified submission structure (SKU_ID + Quantity only)

**Frontend & UI/UX (Emma):**
- Design system implementation (tokens, theme, components)
- Base component library (80+ UI components)
- Layout and navigation components
- Role-based UI patterns and hooks
- Form patterns and validation
- State management (TanStack Query, error/loading/empty states)
- Notification system (in-app + toast)
- Module-specific UI components
- Accessibility (WCAG 2.1 AA compliance)
- Responsive design patterns
- Performance optimization
- Frontend testing framework
- Historical data components (Timeline, DateRangePicker, ExportButton)
- Historical data routing and access patterns (history tabs, filtered lists, dedicated routes, modals)
- Module activation impact on historical data (inactive module indicators, data existence checks)

**Architecture & Integration (Oliver):**
- Module integration contracts (data flow specs between modules)
- Database schema versioning strategy
- API contract documentation format
- Integration test framework setup
- Module activation sequence testing
- Architecture decision records (ADRs)

**Database & Schema (Nadia):**
- Complete index implementation (performance indexes, foreign keys)
- Database constraints (check, unique, foreign key constraints)
- Timestamp update triggers
- Schema completeness verification (including SKU pharmaceutical attributes)
- SKU pharmaceutical attributes implementation (dosage_strength, dosage_form, pack_size, unit_of_measure)
- Submission data structure as JSONB arrays (SKU_ID + Quantity)
- Seed data validation scripts
- Query optimization and index analysis

**RLS/RBAC (Rafi):**
- Detailed RLS policies for all tables (users, system_config, audit_logs, notifications, companies, products, skus, atc_codes, critical_medicines, all VCI/ECS/CMC tables)
- Company isolation policies
- Module activation check policies
- RLS policy test suite
- RBAC permission checking in RPC functions

**RPC Functions & Workflows (Maya):**
- Shared RPC function implementation (permissions, module checks, audit logs, notifications)
- State machine validation in workflow functions
- Automatic breach creation logic
- Threshold switching coordination
- Event-triggered recalculation coordinator
- RPC function unit test framework
- Historical data RPC functions (vci_get_historical_submissions, cmc_get_historical_scores, audit_get_historical_logs, has_historical_ecs_data, has_historical_cmc_data, log_historical_data_access)

**Security & Audit (Salim):**
- Audit logging trigger function (hash chaining logic)
- Audit triggers applied to all audited tables
- Audit log hash verification function
- Supabase Auth password policies
- Session management
- File upload security
- Input sanitization validation
- API rate limiting
- Security testing (two-person rule, RBAC test matrix)

**Edge Functions & Scheduled Jobs (Leila):**
- Edge Functions project structure
- pg_cron setup for all scheduled triggers (AAMS deadline, WSL deadline, threshold reversion, export expiration, replenishment delay, monthly CMC calculation, report generation)
- Edge Function for email notifications
- Edge Functions for regulatory reminders and export expiration reminders
- Scheduled job performance testing

**Testing (Hassan):**
- Testing infrastructure setup
- RPC function unit test framework
- Expanded frontend testing framework (Jest, React Testing Library, Playwright)
- Visual regression testing setup
- Integration test data fixtures
- Integration test framework setup
- Module-specific test scenarios (ECS, CMC)
- Load testing tools setup
- Performance benchmarks definition
- Test coverage reporting
- Test data cleanup strategy

**CMC/Analytics (Farah):**
- Detailed CMC component calculation formulas (Regulatory Reporting Compliance Rate, Stock Threshold Violation Frequency, Replenishment Plan Adherence, Aggregate Non-Compliance Exposure, Data Quality Signals, Critical Medicine Coverage, Export Compliance)
- Weighted average calculation logic
- Component weight configuration UI
- Event-triggered recalculation logic
- Report analytics calculations
- Governance dashboard analytics

**Status:** ✅ Updated with All Audit Recommendations  
**Next Step:** Review this plan, adjust task breakdown as needed, assign team members, begin Phase 1.1

---

## Historical Data Implementation

**Status:** ✅ Historical data tasks added to Phase 1.1  
**Reference:** See [Historical Data Routing Proposal](../../02-architecture/frontend/historical-data-routing-proposal.md) for complete specifications

**Tasks Added:**
- **Backend:** Database indexes, RPC functions for historical data access, data existence checks
- **Frontend:** Timeline, DateRangePicker, ExportButton components, history tabs, filtered lists, dedicated routes, modal patterns
- **Navigation:** History/audit links, inactive module indicators, breadcrumb updates
- **Module Activation:** Data existence checks, inactive module UI indicators, route protection patterns
- **Trend Analysis:** AAMS/MSQ/WSL trend components (MOH Tier 1)

**Key Implementation Points:**
- Historical data accessible based on data existence and permissions, not module activation status
- All historical data is read-only (immutable for regulatory compliance)
- 7-year data retention requirement supported
- Access controlled via RLS policies through RPC functions

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

---

## Audit Notes

**Last Updated:** January 12, 2026

**Retroactive Phase Updates (January 12, 2026):**
- Phase 0, 0.5, and 0.6 documents updated to reflect Phase 1 audit learnings
- Cross-references added between all phases
- Phase completion sequence documented
- See [Retroactive Update Plan](phase-0-0.5-0.6-retroactive-update-plan.md) for details