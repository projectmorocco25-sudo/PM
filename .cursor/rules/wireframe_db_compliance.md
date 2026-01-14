# Wireframe + Database Compliance (Hard Gate)

## Rule (for Cursor + all future chats in this repo)

When implementing **Phase 1** (and any UI work), enforce **wireframe-first + database-first** compliance. This rule is non-negotiable.

### Wireframes are primary

- Do **not** implement UI for a page/route until you have opened and read the linked wireframe task file(s) (e.g., `task-0.5.x.x-...`) under `docs/04-design/user-experience/wireframes/`.
- If there is no wireframe for a requested page/task: **STOP** and request/produce the wireframe first. Do not guess layouts, flows, or states.
- If the plan, wireframe, and/or DB schema conflict: **STOP** and surface the conflict with a clear recommendation. Do not invent requirements.

### No hardcoded demo data in production UI

- Production pages/components must **not** use inline arrays/objects as the source of truth for cards/tables/lists.
- During Phase 1, all “mock data” must be **seeded into Supabase** (dev/staging) and queried by the frontend.
- Local runtime mock providers (hooks/services returning synthetic records) are **not allowed**.
- Prefer querying real Supabase data once tables/RPCs exist. If a required table/field/RPC does not exist, implement the missing backend task first (migrations/RPC/RLS as per the plan).

### Seed data must be applied via Supabase MCP migrations (Phase 1)

- All Phase 1 “mock data” must be seeded into Supabase via **versioned migrations** executed with `mcp_supabase_apply_migration`.
- Seed migrations must be **idempotent** (deterministic IDs + UPSERT/`ON CONFLICT`) so they can be safely re-run.
- Do not seed via Supabase CLI, manual dashboard edits, or local runtime mocks.
- Seed migrations should be staged by subphase (e.g., `seed_1_1_1_foundation`, `seed_1_1_2_rmm`, `seed_1_1_3_vci`, etc.).

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

### Required “wireframe binding” + proof

- Each implemented page/route must include a clear “wireframe binding” reference (route → wireframe task id) either as a code comment or a maintained mapping module.
- Never mark a frontend task complete unless the PR summary includes:
  1) Wireframe link(s) (exact `task-0.5.x.x` file(s))
  2) Screenshots for each role variant (or explicit N/A)
  3) Screenshots for loading/empty/error/success
  4) Data proof: tables/fields used + where queries live (file paths/functions)
  5) Any deviations + explicit approval reference (decision/issue link)

