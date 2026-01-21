# Compliance Rules - Sami's Checklist

**Owner:** Sami (Implementation Compliance Specialist)  
**Last Updated:** 2026-01-15  
**Purpose:** Complete compliance checklist that must be verified before EVERY implementation task

---

## ⚠️ CRITICAL: Pre-Task Compliance Verification

**Sami's Stop Authority:** If any compliance rule is violated, Sami must **STOP** implementation immediately.

---

## Pre-Task Checklist

### 1. Sequential Task Verification
- [ ] All previous tasks in the sequence are complete
- [ ] Task dependencies are satisfied
- [ ] No blocking dependencies remain

### 2. Role Name Verification
- [ ] Frontend role names match database schema exactly
- [ ] Role constants match `users.role` enum values
- [ ] No hardcoded role strings (use constants)

### 3. Schema Verification
- [ ] Database schema verified before role-dependent code
- [ ] All required tables exist
- [ ] All required fields exist
- [ ] RLS policies are in place (for new tables)

### 4. Integration Verification
- [ ] Layout/components integrated into routes (if applicable)
- [ ] Navigation updated (if new routes added)
- [ ] Module routing structure updated

### 5. Role Coverage Verification
- [ ] All 9 roles are handled (where applicable)
  - Company roles: Company Admin, Company User
  - MOH roles: MOH Tier 1, MOH Tier 2, MOH Auditor
  - System roles: System Admin
  - Other roles as defined

### 6. Wireframe Compliance
- [ ] Wireframe reviewed before starting
- [ ] Wireframe task ID(s) identified
- [ ] Wireframe requirements understood (layout, interactions, states, role-based variations)
- [ ] Wireframe annotations reviewed

### 7. Data Source Verification
- [ ] No local mock data used (NO `const mockData = [...]`, NO `mockData.ts`, NO runtime mocks)
- [ ] All data queries Supabase database
- [ ] Seed data applied (if required) - verify via `supabase migration list`
- [ ] Database tables verified before starting (use SQL queries)

### 8. Wireframe Binding
- [ ] Wireframe binding comments added to code (JSDoc format with wireframe link)
- [ ] Wireframe task ID(s) documented in code comments
- [ ] PR description includes wireframe link(s)
- [ ] Wireframe binding in both PR description AND codebase

### 9. Seed Data Gate (If Applicable)
- [ ] Seed migration stage applied (verify via `supabase migration list`)
- [ ] Seed data acceptance criteria verified
- [ ] RLS validation completed (if required)
- [ ] Seed data covers wireframe scenarios

---

## Hard Gates (Non-Negotiable)

### No Hardcoded UI Data
- ❌ **NOT ALLOWED:** Inline arrays/objects as source of truth
- ❌ **NOT ALLOWED:** Local mock providers (hooks/services/repositories returning synthetic records)
- ✅ **REQUIRED:** All data from Supabase database
- ✅ **REQUIRED:** Seed data in database, then queried
- ✅ **REQUIRED:** Frontend must query Supabase for all displayed data during Phase 1

**Seed Data Clarification:**
- ✅ **Allowed:** Seeded Supabase database records (dev/staging) that are realistic and cover wireframe scenarios; test data inserted into the **test database** for automated tests
- ❌ **Not allowed:** Any locally-mocked application runtime data (including mocks behind data access layers) and any inline arrays/objects used as the source of truth in pages/components

### Wireframe Binding
- ✅ **REQUIRED:** Every route/page declares exact wireframe task file(s) (e.g., `task-0.5.x.x-...`)
- ✅ **REQUIRED:** Wireframe binding in both PR description AND codebase
- ✅ **REQUIRED:** Wireframe binding must appear as:
  - Top-of-file comment in route/page file (preferred format), OR
  - Maintained mapping module (e.g., `src/wireframe-bindings.ts`)
- ⚠️ **STOP:** If no wireframe exists, create/approve wireframe BEFORE coding

**Wireframe binding code example (preferred format):**
```typescript
/**
 * Wireframe: task-0.5.1.1-dashboard.md
 * Route: /dashboard
 * Implements: Dashboard page for Company role
 * Wireframe Link: ../../04-design/user-experience/wireframes/00-core-foundation/dashboard/task-0.5.1.1-dashboard.md
 */
export default function DashboardPage() {
  // Implementation...
}
```

### DB Binding
- ✅ **REQUIRED:** Every page lists tables/fields it uses
- ✅ **REQUIRED:** All queries use real data (no mocks)
- ✅ **REQUIRED:** Phase 0.6 schema additions incorporated where applicable:
  - `users.avatar_url`, `users.timezone`, `users.language`, `users.notification_preferences`
  - `conversations.lifecycle_state`, `messages.delivered_at`
  - `follow_ups`, `meetings`, `meeting_attendees`
  - `skus.dosage_strength`, `skus.dosage_form`, `skus.pack_size`, `skus.unit_of_measure`

### Role + States Coverage
- ✅ **REQUIRED:** Company + MOH Tier 1 + MOH Tier 2 implemented/verified where wireframe specifies role variants
- ✅ **REQUIRED:** "N/A" is allowed only when wireframe explicitly indicates no role variants apply (cite wireframe section/annotation in PR)
- ✅ **REQUIRED:** UI states implemented: **loading**, **empty**, **error**, **success**

---

## PR Description Checklist (Required)

Every frontend task PR must include:

1. **Wireframe link(s)** - Exact `task-0.5.x.x` file(s)
2. **Role variant screenshots** - Each role or explicit N/A
3. **State screenshots** - Loading/empty/error/success states
4. **Data proof** - Tables/fields used + query locations + evidence of queries
5. **Deviations** - Any deviations from wireframe + explicit approval reference
6. **Layout Integration Proof** - Screenshot showing integration into layout
7. **Role Coverage Proof** - Evidence all roles handled
8. **Role Name Consistency Proof** - Role names match schema
9. **Compliance Section (MANDATORY)** - Implementation summary with compliance verification documenting all compliance rules followed during implementation (see "Implementation Summary Compliance Requirement" section below)

**⚠️ CRITICAL:** PRs without a compliance section will be **REJECTED**. The compliance section is **REQUIRED** for PR approval.

---

## Implementation Summary Compliance Requirement (MANDATORY)

**After EVERY implementation task completion, the implementation summary MUST include a compliance section documenting:**

1. **Compliance Rules Followed:** List all compliance rules that were verified and followed during implementation
2. **Verification Evidence:** Document how each compliance rule was verified (e.g., "Wireframe binding verified: JSDoc comment added to component file with wireframe link")
3. **Compliance Checklist Status:** Confirm all required compliance checklist items were completed
4. **Any Deviations:** Document any deviations from compliance rules with explicit approval references
5. **Sami's Approval:** Confirm Sami's compliance review was completed before task completion

**Format for Implementation Summary Compliance Section:**
```markdown
## Compliance Verification (Sami - Required)

**Compliance Rules Verified:**
- ✅ Sequential Task Verification: All previous tasks complete (Task 1.1.1.X checked off)
- ✅ Wireframe Binding: Wireframe link added to component JSDoc comment
- ✅ Database Binding: Tables/fields documented, queries verified to use Supabase
- ✅ Role Coverage: All required role variants implemented (Company, MOH Tier 1, MOH Tier 2)
- ✅ UI States: Loading, empty, error, success states implemented
- ✅ No Local Mocks: Verified no local mock data, all data from Supabase queries
- ✅ Seed Data Gate: Seed migration verified applied before frontend work

**Verification Evidence:**
- Wireframe binding: `src/app/rmm/companies/page.tsx` line 5-10 (JSDoc comment)
- Database queries: `src/hooks/use-companies.ts` uses `supabase.from('companies').select()`
- Role coverage: Screenshots provided for Company, MOH Tier 1, MOH Tier 2 roles
- Seed data: Migration `seed_1_1_2_rmm` verified via `supabase migration list`

**Sami's Approval:** ✅ Approved - [Date] - [Sami's signature/approval]

**Deviations:** None
```

**⚠️ CRITICAL:** Implementation summaries without a compliance section are **INCOMPLETE** and will be rejected. The compliance section is **MANDATORY** for every task completion summary.

---

## Wireframe-First Implementation Principle

**Before starting ANY frontend implementation task:**

1. ✅ Review the corresponding wireframe
2. ✅ Understand wireframe requirements (layout, interactions, states, role variations)
3. ✅ Reference wireframe annotations
4. ✅ Check component mapping
5. ✅ Verify wireframe compliance

**Wireframes are the PRIMARY design reference** - Wireframe takes precedence over architecture docs.

**If a wireframe doesn't exist: STOP and create it first.**

---

## Stop Conditions (Do Not Proceed)

**STOP implementation and resolve before proceeding** if any of the following is true:

### Wireframe Requirements
- No wireframe link exists for the page/route being implemented. **STOP** and request/produce the wireframe first. Do not guess layouts, flows, or states.
- Wireframe is ambiguous or missing a required state/role behavior. **STOP** and clarify with wireframe owner before proceeding.

### Database & Schema Requirements
- Required DB table/field/RPC does not exist yet. **STOP** and implement the missing backend task first. Do not create local mocks as a workaround.
- A required wireframe state cannot be reproduced from seeded DB data. **STOP** and ensure seed migration covers the required state before proceeding.

### Security & Access Requirements
- RLS/policies prevent required access for the wireframed role. **STOP** and implement/update RLS policies before proceeding.

### Seed Data Requirements
- Seed migration is not idempotent (must use deterministic IDs + UPSERT patterns). **STOP** and fix migration per [Playbook - Idempotency Patterns](../Archive for now/phase-1-1-mockdata.md#idempotency-patterns).
- Seed data depends on manual dashboard edits (must use versioned migrations only). **STOP** and convert to versioned migration.

### Conflicts & Ambiguities
- Plan, wireframe, and/or DB schema conflict. **STOP** and surface the conflict with a clear recommendation. Wireframe wins for UI decisions; document and propose plan update. Do not invent requirements.

## Enforcement

### Violations
- **First violation:** Warning + immediate stop
- **Repeated violations:** Escalate to project manager
- **Critical violations:** Block PR merge until compliance verified

### Verification Process
1. Sami reviews task before start
2. Sami verifies compliance checklist
3. Sami verifies sequential task execution (all previous tasks complete)
4. If compliant: Proceed
5. If not compliant: Stop + fix before proceeding

### Sequential Task Execution (Sami Enforcement)
- Tasks MUST be executed sequentially - no task can start until all previous tasks are complete and checked off (`[x]`)
- Sami (Implementation Compliance Specialist) verifies sequential execution before every task
- Do not skip tasks or start tasks in parallel
- Tasks must be executed in dependency order (check `Depends on:` fields) - All prerequisite tasks must be marked complete before starting dependent tasks

---

**Reference:** [Phase 1 Implementation Plan](../phase-1.md#-compliance-enforcement-sami---implementation-compliance-specialist)
