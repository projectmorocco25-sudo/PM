# Database Schema Versioning Strategy - Pharmaceutical Governance Value Chain Platform (PM)

**Purpose:** This document defines the shared database schema versioning strategy, including migration numbering conventions, rollback procedures, and version tracking.

**Created:** 2026-01-17  
**Task:** 1.1.1.1b  
**Author:** Sami (Implementation Compliance Specialist)  
**Owner:** Nadia (Database Specialist)

---

## Overview

This document formalizes the database schema versioning strategy for the PM platform, ensuring consistent migration management across all environments (development, staging, production). This strategy is based on Supabase migration practices and enforces immutability, sequential ordering, and version tracking.

---

## Migration Numbering Convention

### Timestamp Format

**Format:** `{YYYYMMDDHHMMSS}` (14 digits)

**Examples:**
- `20260117120000` = January 17, 2026, 12:00:00
- `20260117143000` = January 17, 2026, 14:30:00

**Rules:**
- Always use UTC timezone for consistency
- Format: Year (4), Month (2), Day (2), Hour (2), Minute (2), Second (2)
- No separators or spaces
- Leading zeros required

### Migration File Naming

**Format:** `{timestamp}_{descriptive_name}.sql`

**Naming Convention:**
- Use snake_case for descriptive name
- Be descriptive but concise
- Include module prefix if module-specific (e.g., `create_rmm_core_tables`, `create_vci_tables`)
- Use action verb (create, add, update, remove, etc.)

**Examples:**
```
20260117120000_create_core_tables.sql
20260117143000_create_communication_tables.sql
20260117150000_create_governance_tables.sql
20260117200000_create_rmm_tables.sql
20260117210000_create_vci_tables.sql
```

### Migration Ordering

**Rule:** Migrations are applied in chronological order (by timestamp)

**Process:**
1. Supabase CLI orders migrations by timestamp (ascending)
2. Migrations are applied sequentially in order
3. Already-applied migrations are skipped (tracked in `supabase_migrations` table)
4. Failed migrations stop the migration process

**Important:**
- Never modify existing migration files after they've been applied to any environment
- Never reorder migrations (change timestamps)
- If changes are needed, create a new migration with later timestamp
- Migrations are immutable once applied to production

---

## Migration File Structure

### Standard Migration Template

```sql
-- Migration: {migration_name}
-- Description: Brief description of changes
-- Date: YYYY-MM-DD
-- Task: {task_id} (if applicable)
-- Author: {author_name}
-- Dependencies: {list of dependencies if any}

BEGIN;

-- Migration SQL statements here
-- Use transactions for atomicity
-- Use IF NOT EXISTS for idempotency

COMMIT;
```

### Migration Header Fields

**Required Fields:**
- `Migration:` - Migration name (matches filename)
- `Description:` - Brief description of what the migration does
- `Date:` - Date in YYYY-MM-DD format

**Optional Fields:**
- `Task:` - Task ID from implementation plan (e.g., Task 1.1.1.2)
- `Author:` - Author name
- `Dependencies:` - List of dependencies (other migrations, tasks)
- `Rollback:` - Rollback instructions or reference to rollback migration

### Example Migration Header

```sql
-- Migration: create_core_tables
-- Description: Create core tables (users, system_config, audit_logs, notifications, approvals)
-- Date: 2026-01-17
-- Task: 1.1.1.2
-- Author: Sami (Implementation Compliance Specialist)
-- Dependencies: None (foundation migration)

BEGIN;
-- Migration SQL...
COMMIT;
```

---

## Migration Categories

### Category 1: Schema Migrations

**Purpose:** Create/modify database schema (tables, columns, indexes, constraints)

**Naming Pattern:** `create_{entity}`, `add_{column}_to_{table}`, `modify_{entity}`

**Examples:**
- `create_core_tables`
- `create_rmm_tables`
- `add_lifecycle_state_to_conversations`

### Category 2: RLS Policy Migrations

**Purpose:** Add/modify Row Level Security policies

**Naming Pattern:** `add_rls_policies_{table}`, `update_rls_policy_{name}`

**Examples:**
- `add_rls_policies_users`
- `add_rls_policies_communication_tables`
- `update_rls_policy_companies_company_isolation`

### Category 3: RPC Function Migrations

**Purpose:** Create/modify RPC functions

**Naming Pattern:** `create_rpc_{function_name}`, `update_rpc_{function_name}`

**Examples:**
- `create_rpc_shared_get_user_permissions`
- `create_rpc_communications_create_conversation`
- `update_rpc_vci_submit_aams`

### Category 4: Seed Data Migrations

**Purpose:** Populate initial/test data (idempotent seed data)

**Naming Pattern:** `seed_{stage}_{module}`, `seed_{descriptive_name}`

**Examples:**
- `seed_1_1_1_foundation`
- `seed_1_1_2_rmm`
- `seed_1_1_3_vci_aams`

**Idempotency Requirements:**
- Use deterministic UUIDs (or gen_random_uuid() with fixed seed)
- Use UPSERT patterns (INSERT ... ON CONFLICT DO UPDATE)
- Safe to re-run without duplicates

### Category 5: Data Migrations

**Purpose:** Transform or migrate existing data

**Naming Pattern:** `migrate_{transformation_description}`, `backfill_{field_name}`

**Examples:**
- `migrate_lifecycle_states_for_existing_conversations`
- `backfill_previous_period_scores`
- `calculate_score_changes_for_existing_scores`

---

## Rollback Procedures

### Rollback Strategy Overview

**Approach:** Create reverse migrations (new migration files that undo changes)

**Principle:** Never modify existing migrations; always create new migrations to fix issues

### Rollback Migration Naming

**Format:** `{timestamp}_rollback_{original_migration_name}.sql`

**Example:**
- Original: `20260117120000_create_core_tables.sql`
- Rollback: `20260117180000_rollback_create_core_tables.sql`

### Rollback Process

**Step 1: Identify Issue**
- Monitor application logs
- Check database errors
- Verify data integrity

**Step 2: Assess Impact**
- Determine scope of issue
- Identify affected data
- Plan rollback approach

**Step 3: Create Rollback Migration**
```sql
-- Migration: rollback_{original_migration_name}
-- Description: Rollback changes from {original_migration_name}
-- Date: YYYY-MM-DD
-- Reason: {reason for rollback}

BEGIN;

-- Reverse changes from original migration
-- Use DROP IF EXISTS for safety
-- Preserve data where possible

COMMIT;
```

**Step 4: Test Rollback**
- Test locally first
- Test in staging
- Verify data integrity after rollback

**Step 5: Apply Rollback**
- Apply to staging first
- Monitor for issues
- Apply to production if staging successful

### Rollback Best Practices

1. **Preserve Data:** When possible, preserve data during rollback
2. **Incremental Rollback:** Rollback in stages if complex
3. **Documentation:** Document reason for rollback in migration header
4. **Testing:** Always test rollback in staging before production
5. **Communication:** Notify team before production rollback

---

## Migration Tracking

### Supabase Migration History

**Tracking Mechanism:** Supabase tracks applied migrations in `supabase_migrations` table

**Table Structure:**
- `version` - Migration timestamp (YYYYMMDDHHMMSS)
- `name` - Migration filename (without extension)
- `statements` - SQL statements (for reference)
- `inserted_at` - When migration was applied

### Migration Status Verification

**Local Development:**
```bash
# Check migration status
supabase migration list

# Check migration history
supabase db diff
```

**Production/Staging:**
```sql
-- Query migration history
SELECT version, name, inserted_at
FROM supabase_migrations.schema_migrations
ORDER BY version DESC;
```

### Migration Dependencies

**Documentation:** Dependencies must be documented in migration header

**Dependency Types:**
- **Migration Dependencies:** This migration requires another migration to be applied first
- **Task Dependencies:** This migration is part of a specific task with dependencies
- **Data Dependencies:** This migration requires specific data to exist

**Example:**
```sql
-- Migration: create_vci_tables
-- Dependencies: 
--   - Migration: 20260117200000_create_rmm_tables (companies, skus tables must exist)
--   - Task: 1.1.1.7 (RMM tables must be created first)
```

### Migration Tracking and Audit System

**System:** Supabase migration tracking + Git history.

| Component | Purpose |
|-----------|---------|
| `supabase_migrations.schema_migrations` | Records applied migration `version`, `name`, `statements`, `inserted_at` |
| `supabase migration list` | Shows applied vs pending migrations (local or linked project) |
| Git history | Audit trail for who created/changed migrations; use conventional commits and PRs |

**Audit:** Use `supabase migration list` and `SELECT * FROM supabase_migrations.schema_migrations ORDER BY version` to verify what is applied. For production, ensure migrations are applied via controlled CI/CD or manual process with sign-off.

---

## Migration Best Practices

### Idempotency

**Rule:** All migrations must be idempotent (safe to run multiple times)

**Techniques:**
- Use `CREATE TABLE IF NOT EXISTS`
- Use `CREATE INDEX IF NOT EXISTS`
- Use `CREATE OR REPLACE FUNCTION`
- Use `ADD COLUMN IF NOT EXISTS`
- Use transactions (BEGIN/COMMIT)

### Atomicity

**Rule:** Migrations must be atomic (all succeed or all fail)

**Techniques:**
- Use transactions (BEGIN/COMMIT)
- Test migrations locally before committing
- Verify migration success after applying

### Performance

**Rule:** Consider performance impact of migrations

**Techniques:**
- Create indexes after data population (for large tables)
- Use `CONCURRENTLY` for index creation when possible (PostgreSQL 12+)
- Batch large data migrations
- Test with production-like data volumes

### Security

**Rule:** Migrations must follow security best practices

**Techniques:**
- Enable RLS on all tables
- Create RLS policies in same migration as table creation
- Use SECURITY DEFINER appropriately for RPC functions
- Audit log all schema changes

---

## Environment-Specific Procedures

### Development Environment

**Approach:**
- Apply all migrations automatically on `supabase start`
- Reset database frequently (`supabase db reset`)
- Test new migrations locally before committing

**Commands:**
```bash
# Start Supabase (applies all migrations)
supabase start

# Reset database (drops all, applies all migrations)
supabase db reset

# Apply pending migrations only
supabase migration up
```

### Staging Environment

**Approach:**
- Apply migrations manually or via CI/CD
- Test before production
- Verify with production-like data
- Monitor after migration

**Commands:**
```bash
# Link to staging project
supabase link --project-ref {staging-ref}

# Push migrations
supabase db push

# Verify migration status
supabase migration list
```

### Production Environment

**Approach:**
- Apply migrations carefully with approval process
- Create backup before migration
- Monitor after migration
- Have rollback plan ready

**Pre-Migration Checklist:**
- [ ] Migration tested in staging
- [ ] Backup created
- [ ] Rollback plan ready
- [ ] Application code deployed (if needed)
- [ ] Team notified
- [ ] Monitoring enabled

**Commands:**
```bash
# Link to production project
supabase link --project-ref {prod-ref}

# Push migrations (requires approval)
supabase db push
```

---

## Migration Review Process

### Before Creating Migration

**Checklist:**
- [ ] Review schema design document
- [ ] Check for conflicts with existing migrations
- [ ] Plan rollback strategy
- [ ] Consider performance impact
- [ ] Document dependencies

### Before Applying to Staging

**Checklist:**
- [ ] Migration tested locally
- [ ] Migration file committed to Git
- [ ] Code review completed
- [ ] Documentation updated
- [ ] Dependencies verified

### Before Applying to Production

**Checklist:**
- [ ] Migration tested in staging
- [ ] Backup created
- [ ] Rollback plan ready
- [ ] Application code deployed (if needed)
- [ ] Team notified
- [ ] Monitoring enabled
- [ ] Approval obtained

---

## Seed Data Migration Guidelines

### Seed Migration Naming

**Format:** `seed_{stage}_{module}` or `seed_{descriptive_name}`

**Examples:**
- `seed_1_1_1_foundation`
- `seed_1_1_2_rmm`
- `seed_1_1_3_vci_aams`

### Seed Migration Idempotency

**Requirement:** All seed migrations must be idempotent

**Pattern:** Use deterministic IDs and UPSERT
```sql
-- Example: Idempotent seed data with deterministic UUIDs
INSERT INTO users (id, email, full_name, role)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'moh.tier1@example.com', 'MOH Tier 1 User', 'moh_tier1'),
  ('00000000-0000-0000-0000-000000000002', 'company.user@example.com', 'Company User', 'company_user')
ON CONFLICT (id) DO UPDATE
SET 
  email = EXCLUDED.email,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role;
```

### Seed Data Verification

**After Applying Seed Migration:**
- Verify data integrity (foreign keys valid)
- Verify scenario packs exist
- Verify RLS policies work correctly
- Verify seed data matches wireframe requirements

---

## Migration Conflict Resolution

### Scenario 1: Two Developers Create Migrations Simultaneously

**Problem:** Both migrations have same timestamp

**Solution:**
1. Developers communicate before creating migrations
2. If conflict occurs, one developer updates timestamp to later time
3. Update migration filename to match new timestamp
4. Git commit reflects correct ordering

### Scenario 2: Migration Fails Mid-Execution

**Problem:** Migration partially applied

**Solution:**
1. Rollback transaction (if transaction-based)
2. Fix migration SQL
3. Create new migration with later timestamp
4. Apply fixed migration

### Scenario 3: Need to Modify Already-Applied Migration

**Problem:** Migration already applied to production

**Solution:**
1. **Never modify existing migration file**
2. Create new migration that fixes/modifies the change
3. Document in migration header why modification was needed
4. Test new migration in staging before production

---

## Related Documents

- [Migration Strategy](./migration-strategy.md) - Comprehensive migration guide
- [Database Schema Design](./schema-design.md) - Complete schema reference
- [Seed Data Playbook](../05-project-management/planning/seed-data-playbook.md) - Seed migration guidelines
- [Schema Updates - Phase 0.6](./schema-updates-phase0-6-critical-gaps.md) - Phase 0.6 migration examples

---

**Last Updated:** 2026-01-27  
**Next Review Date:** After Phase 1.1 Complete
