# Migration Task Template

**Purpose:** Reusable template for database migration tasks  
**Usage:** Copy this template when creating new migration tasks  
**Template Version:** 1.0  
**Last Updated:** 2026-01-26

**🟢 Supabase cloud-only (never local):** All migration work uses the **hosted** Supabase project only. Apply and verify against the **linked remote** project via `supabase link` + `supabase db push` + `supabase migration list`. **Never** use local Supabase, `supabase start`, Docker, or a local database.

---

## Task Structure

Migration tasks follow a three-step pattern:

1. **Task X.Y.Z.N:** Create database migration
2. **Task X.Y.Z.N-apply:** Apply migration to **hosted (remote)** database only (`supabase db push`); never local
3. **Task X.Y.Z.N-verify:** Verify migration on **hosted (remote)** only (e.g. `supabase migration list`, Dashboard, or SQL); never local

---

## Task X.Y.Z.N: Create Database Migration for [Table/Feature Name]

**Task ID:** X.Y.Z.N  
**Category:** Migration  
**Status:** ⏳ **AWAITING IMPLEMENTATION**  
**Template:** [migration-task-template.md](../../standards/task-templates/migration-task-template.md)

---

## Quick Reference

- 💾 **Database:** `table_name`, `table_name2`
- 📝 **Migration File:** `YYYYMMDDHHMMSS_[descriptive_name].sql`
- 📋 **Feature:** [Feature Name - feature-index.md#feature-anchor](../../../02-architecture/feature-index.md#feature-anchor)

---

## Migration Task

### Task X.Y.Z.N: Create Database Migration

**Status:** ⏳ **AWAITING IMPLEMENTATION**  
**⚠️ DEPENDS ON:** [List dependencies - e.g., prerequisite migrations, schema design tasks]

- 💾 **Database:** `table_name`, `table_name2` ([feature-index.md](../../../02-architecture/feature-index.md#feature-anchor))
- 💾 **Schema Reference:** [data-dictionary.md](../../../02-architecture/database/data-dictionary.md#table-name)
- 📝 **Migration File:** `YYYYMMDDHHMMSS_[descriptive_name].sql`
- 📋 **Migration Strategy:** [migration-strategy.md](../../../02-architecture/database/migration-strategy.md)

**✅ Implementation Notes:**
- Migration must be idempotent (uses IF NOT EXISTS, UPSERT patterns)
- Follow migration naming convention: `YYYYMMDDHHMMSS_descriptive_name.sql`
- All tables, columns, constraints must be defined
- Indexes created where needed
- Follow migration strategy guidelines

**✅ Acceptance Criteria:**
- [ ] Migration file created with proper naming convention
- [ ] Migration is idempotent (uses IF NOT EXISTS, UPSERT patterns)
- [ ] All tables, columns, constraints defined
- [ ] Indexes created where needed
- [ ] Migration follows migration-strategy.md guidelines

---

## Apply Migration Task

### Task X.Y.Z.N-apply: Apply Database Migration (Remote)

**Status:** ⏳ **AWAITING IMPLEMENTATION**  
**⚠️ DEPENDS ON:** Task X.Y.Z.N (migration creation)

- 💾 **Migration:** `YYYYMMDDHHMMSS_[descriptive_name].sql`
- 🟢 **Target:** **Hosted (linked remote)** Supabase project only. **Never** local DB, Docker, or `supabase start`.

**✅ Action Steps:**
1. Ensure project is linked: `supabase link --project-ref <ref>` (hosted project only).
2. Run `supabase db push` to apply pending migrations to the **hosted** project.
3. Verify migration appears in `supabase migration list` (remote/hosted only).
4. Check for any migration errors.
5. Document migration application in PR.

**✅ Acceptance Criteria:**
- [ ] Migration applied successfully to **hosted** project only (no local)
- [ ] Migration appears in hosted migration list
- [ ] No errors during application
- [ ] Database schema updated correctly in hosted project

---

## Verify Migration Task

### Task X.Y.Z.N-verify: Verify Database Migration (Remote)

**Status:** ⏳ **AWAITING IMPLEMENTATION**  
**⚠️ DEPENDS ON:** Task X.Y.Z.N-apply (migration application)

- 💾 **Migration:** `YYYYMMDDHHMMSS_[descriptive_name].sql`
- 💾 **Database:** `table_name`, `table_name2`
- 🟢 **Target:** **Hosted (linked remote)** Supabase project only. **Never** local.

**✅ Verification Steps:**
1. Connect to **hosted** database (Dashboard SQL editor or DB URL) and verify tables exist.
2. Check table structure matches migration (columns, types, constraints).
3. Verify indexes are created.
4. Test RLS policies if applicable.
5. Run `supabase migration list` to confirm migration status on **hosted** project.
6. Verify migration is idempotent (can be run multiple times safely).

**✅ Acceptance Criteria:**
- [ ] All tables exist with correct structure in **hosted** project
- [ ] All columns have correct types and constraints
- [ ] Indexes created successfully
- [ ] RLS policies working (if applicable)
- [ ] Migration is idempotent
- [ ] Migration status confirmed in hosted (remote) migration list

---

**Template Version:** 1.0  
**Last Updated:** 2026-01-26
