# Wireframe + Database Compliance (Hard Gate)

## Rule (for Cursor + all future chats in this repo)

When implementing **Phase 1** (and any UI work), enforce **wireframe-first + database-first** compliance. This rule is non-negotiable.

### Wireframes are primary

- Do **not** implement UI for a page/route until you have opened and read the linked wireframe task file(s) (e.g., `task-0.5.x.x-...`) under `docs/04-design/user-experience/wireframes/`.
- If there is no wireframe for a requested page/task: **STOP** and request/produce the wireframe first. Do not guess layouts, flows, or states.
- If the plan, wireframe, and/or DB schema conflict: **STOP** and surface the conflict with a clear recommendation. Do not invent requirements.

**For complete stop conditions list, see:** [Phase 1 Implementation Plan - Stop Conditions](../docs/05-project-management/phases/Phase-1-Implementation-Plan.md#stop-conditions-do-not-proceed)

### No local seed data alternatives — Supabase is the single source of truth

**CRITICAL:** All data (including seed/test data) must originate from Supabase. Local runtime mocks or synthetic data generation is strictly forbidden.

**Prohibited:**
- ❌ Inline arrays/objects as data sources in components (`const mockData = [...]`)
- ❌ Local seed data files (`mockData.ts`, `fixtures.ts`, etc.) used at runtime
- ❌ Runtime mock providers/hooks/services that generate synthetic records
- ❌ In-memory data generators or factories that create synthetic records
- ❌ Any form of synthetic data created at runtime in frontend code

**Required:**
- ✅ All seed/test data must be **seeded into Supabase** via migrations (see "Seed data" section below)
- ✅ Frontend must query Supabase tables/RPCs for all data
- ✅ Apply to **all environments** (dev, staging, production) during Phase 1

**If a required table/field/RPC does not exist:** Implement the missing backend task first (migrations/RPC/RLS as per the plan). Do not create local mocks as a workaround.

### Seed data must be applied via versioned Supabase migrations (Phase 1)

**The only acceptable way to create seed/test data:**

- All Phase 1 seed data must be seeded into Supabase via **versioned SQL migrations** stored in `supabase/migrations/` directory.
- Seed migrations must be applied using standard Supabase CLI (`supabase migration apply`) or automatically in local development via `supabase start`.
- Seed migrations must be **idempotent** (deterministic IDs + UPSERT/`ON CONFLICT`) so they can be safely re-run.
- Seed migrations should be staged by subphase (e.g., `seed_1_1_1_foundation`, `seed_1_1_2_rmm`, `seed_1_1_3_vci`, etc.).
- Migration files should follow naming convention: `YYYYMMDDHHMMSS_seed_description.sql`
- **Reference:** See [Phase 1.1 Seeded Supabase "Mock Data" Playbook](../docs/05-project-management/phases/phase-1-1-mockdata.md) for detailed strategy, scenario packs, acceptance criteria, and migration conventions.

**Do NOT seed data via:**
- ❌ Manual dashboard edits (not versioned or reproducible)
- ❌ Local runtime mocks (see "No local seed data alternatives" section above)
- ❌ Frontend code that inserts data on component mount
- ❌ Scripts executed outside of migration workflow

**Verification:** Before implementing UI that displays data, ensure the required seed migration exists and has been applied to your Supabase instance. Verify via `supabase migration list` or Supabase dashboard migration history.

### DB binding (Phase 0.6 coverage)

- For each page/route, identify the required tables/fields and ensure the UI actually uses them.
- Incorporate Phase 0.6 additions where applicable:
  - `users.avatar_url`, `users.timezone`, `users.language`, `users.notification_preferences`
  - `conversations.lifecycle_state`, `messages.delivered_at`
  - `follow_ups`, `meetings`, `meeting_attendees`
  - `skus.dosage_strength`, `skus.dosage_form`, `skus.pack_size`, `skus.unit_of_measure`

### Role + states coverage

- Implement and verify role variants where the wireframe specifies them (Company / MOH Tier 1 / MOH Tier 2).
- “N/A” is allowed only when the wireframe explicitly indicates no role variants apply; cite the relevant wireframe section/annotation in the PR summary.
- Implement required UI states: loading, empty, error, success.

### Required "wireframe binding" + proof

- Each implemented page/route must include a clear "wireframe binding" reference (route → wireframe task id) either as a code comment or a maintained mapping module.
- **Wireframe binding code example (preferred format):**
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
- **Alternative:** Maintained mapping module (e.g., `src/wireframe-bindings.ts`) with route-to-wireframe mapping.
- Never mark a frontend task complete unless the PR summary includes:
  1. Wireframe link(s) (exact `task-0.5.x.x` file(s))
  2. Screenshots for each role variant (Company / MOH Tier 1 / MOH Tier 2) or explicit N/A
  3. Screenshots for loading/empty/error/success states
  4. Data proof: tables/fields used + where queries live (file paths/functions) and evidence they are actually queried (e.g., select clause/RPC name)
  5. Any deviations + explicit approval reference (decision/issue link)

**For complete PR proof requirements, see:** [Phase 1 Implementation Plan - Proof Required](../docs/05-project-management/phases/Phase-1-Implementation-Plan.md#proof-required-pr-description-checklist)

