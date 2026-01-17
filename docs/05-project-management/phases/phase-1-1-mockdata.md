# Phase 1.1: Seeded Supabase "Mock Data" Playbook (Versioned Migrations)

**Owner (Seed Realism Gate):** Farah (Analytics/CMC Specialist)  
**DB Integrity Owner:** Nadia (Supabase/Postgres Data Modeler)  
**Test Data Owner:** Hassan (QA/Assurance Engineer)  
**Status:** Required for Phase 1.1  
**Purpose:** Ensure all Phase 1.1 UI is built and verified against **seeded Supabase database data**, not local mock providers.

---

## Non‑Negotiable Rules

1. **Single source of truth:** Phase 1.1 seed data = **seeded records in Supabase dev/staging DB** (note: the term "mock data" in the title refers to test/development data, but implementation uses "seed data" consistently).
2. **Versioned migrations only:** Seed data must be applied via **versioned SQL migration files** in `supabase/migrations/` directory, using standard Supabase CLI (`supabase migration apply`) or auto-applied in local development via `supabase start`.
3. **Idempotent by design:** Seed migrations must be safe to re-run (deterministic identifiers + `UPSERT` / `ON CONFLICT`).
4. **No manual edits:** No Supabase dashboard hand-edits for seed data (they are not reproducible).
5. **No local runtime mocks:** No hooks/services/repositories that return synthetic records for app runtime.
6. **RLS realism:** Seed must be validated under real roles (Company, MOH Tier 1, MOH Tier 2). Seeded data that users can’t see is invalid.

---

## Why this exists (Farah’s pushback)

If we seed only “entities” (companies/products/SKUs) without **scenario packs**, dashboards, filters, and workflow pages will be implemented against assumptions and will drift from wireframes. Seed data must guarantee:
- **Wireframe state coverage** (populated + empty states are reproducible)
- **Role coverage** (each role sees what the wireframe expects)
- **Distribution realism** (non-uniform, includes outliers and plausible clusters)

---

## Seed Strategy: Scenario Packs (Deterministic)

Seed data is organized into deterministic “scenario packs” with stable identifiers. Each pack is designed to validate specific wireframe behaviors.

### Required packs (Phase 1.1 baseline)

- **pack_foundation_moh_ops**
  - MOH Tier 1 + Tier 2 users
  - notifications (read/unread) and audit logs for dashboards/headers
  - comms conversations/messages across lifecycle states
  - at least one follow-up and one meeting to validate governance widgets

- **pack_company_active**
  - one company with meaningful activity (messages, notifications, follow-ups, registry submissions once RMM is seeded)

- **pack_company_empty**
  - one company intentionally empty (to validate empty states)

> As modules are added (RMM/VCI), add packs like `pack_company_breach_heavy`, `pack_threshold_reversion_auto`, `pack_threshold_manual_review_pending`, etc.

---

## Seed Stages (aligned to sequential Phase 1.1 implementation)

Each stage corresponds to a migration (or migration set) and is applied only when the prerequisite schema exists.

### Stage: seed_1_1_1_foundation (Subphase 1.1.1)

**Goal:** Make Core Foundation wireframes testable using DB data.

**Minimum tables touched (expected):**
- `users` (MOH + company users; include Phase 0.6 fields)
- `companies` (at least active + empty company)
- `system_config` (module activation flags used by navigation)
- `notifications`
- `audit_logs`
- `conversations`, `messages`, `conversation_participants`, `message_read_receipts`
- `follow_ups`, `meetings`, `meeting_attendees`

**Acceptance criteria:**
- Company/MOH roles can sign-in and see the correct scoped data (RLS validated).
- Header/avatar/notification badge has real data.
- Comms inbox shows lifecycle states; sent/delivered/read evidence exists where wireframes require it.
- Both populated and empty states are reproducible for at least one key page per role.

### Stage: seed_1_1_2_rmm (Subphase 1.1.2)

**Goal:** Make RMM pages (companies/products/SKUs/registry submissions) testable.

**Minimum tables touched (expected):**
- `companies`, `users`
- `atc_codes`
- `products`
- `skus` (must include Phase 0.6 pharma attributes: dosage_strength/dosage_form/pack_size/unit_of_measure)
- `registry_submissions` + approvals/workflow history tables as defined in schema

**Acceptance criteria:**
- Companies list has enough rows to validate pagination/sorting/filtering.
- Company detail tabs have meaningful content for “active” company and empty state for “empty” company.
- SKU list/detail show pharma attributes, not blanks.
- Registry submissions exist across statuses required by the wireframes.

### Stage: seed_1_1_3_vci_aams (Subphase 1.1.3)

**Goal:** Make VCI AAMS wireframes testable (including threshold and duration types).

**Minimum tables touched (expected):**
- `aams_submissions`
- `thresholds` (global/local, permanent + temporary duration types)
- any supporting tables for threshold history / reversions defined in schema

**Acceptance criteria:**
- AAMS lists have multi-year records and at least one late/grace-period scenario.
- Thresholds include examples of:
  - permanent
  - temporary_auto_revert (with upcoming revert date)
  - temporary_manual_review (pending review workflow)
- MOH and company role views match wireframes for visibility timing.

> Later stages extend this for MSQ/WSL/breaches, ECS, and CMC.

---

## Migration conventions (required)

### Naming

- `seed_1_1_1_foundation`
- `seed_1_1_2_rmm`
- `seed_1_1_3_vci_aams`

### Idempotency patterns

Use deterministic IDs (UUIDs) or deterministic unique keys (e.g., `seed_key` column if available). Always prefer UPSERT:

```sql
-- Example pattern: upsert by deterministic id
INSERT INTO companies (id, name, type, created_at)
VALUES ('00000000-0000-0000-0000-000000000101', 'SeedCo Active', 'IPC', now())
ON CONFLICT (id) DO UPDATE
SET name = EXCLUDED.name,
    type = EXCLUDED.type;
```

If a table does not have a stable unique key suitable for idempotency, **Nadia must add one** (or define a safe uniqueness constraint) before seeding proceeds.

---

## Verification checklist (must be executed after each seed migration)

### Nadia — integrity verification (SQL checks)

- Foreign key integrity (no orphan rows)
- Unique constraints are respected
- Required Phase 0.6 fields are populated where needed
- Indexes exist for key lists/filters

### Farah — realism + coverage verification

- **Wireframe coverage:** every implemented wireframe list/filter has at least one matching record.
- **Empty states:** at least one pack intentionally produces empty states for key pages.
- **Distribution realism:** avoid uniform random; include plausible clustering and outliers.
- **Analytics readiness:** seeded time-series supports trend pages without hardcoded fallbacks.

### Hassan — test DB isolation

- Test database seeding is separate from dev/staging
- Tests are repeatable and do not depend on ad-hoc manual data

---

## "Stop" conditions (do not proceed)

**STOP and fix before implementing UI** if:
- A required wireframe state cannot be reproduced from seeded DB data.
- Seed migration is not idempotent (must use deterministic IDs + UPSERT patterns per [Idempotency Patterns](#idempotency-patterns)).
- Seed data depends on manual dashboard edits (must use versioned migrations only).
- RLS prevents required role views.

**For complete stop conditions list (including wireframe, schema, and conflict requirements), see:** [Phase 1 Implementation Plan - Stop Conditions](../Phase-1-Implementation-Plan.md#stop-conditions-do-not-proceed)

---

## References

- Phase 1 plan: `Phase-1-Implementation-Plan.md`
- Wireframes: `docs/04-design/user-experience/wireframes/`
- DB schema: `docs/02-architecture/database/schema-design.md`
- Cursor rule: `.cursor/rules/wireframe_db_compliance.md`

