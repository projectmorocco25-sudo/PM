# Migration Versioning Strategy - Pharmaceutical Governance Value Chain Platform (PM)

**Purpose:** This document defines the shared database schema versioning strategy, migration numbering conventions, and rollback procedures for the PM platform.

**Last Updated:** 2025-01-12  
**Status:** ✅ Complete (Phase 1.1.1, Task 1.1.1.1b)  
**Owner:** Nadia

## Overview

This document establishes the versioning strategy for all database migrations in the PM platform. All migrations follow a consistent numbering scheme and include rollback procedures.

## Version Number Format

### Timestamp-Based Versioning

**Format:** `{YYYYMMDDHHMMSS}_{migration_name}.sql`

**Example:**
- `20250112120000_create_core_tables.sql`
- `20250112130000_add_rls_policies.sql`
- `20250112140000_add_communication_tables.sql`

**Benefits:**
- Chronological ordering guaranteed
- No conflicts between developers
- Easy to identify migration date
- Compatible with Supabase migration system

### Migration Naming Convention

**Pattern:** `{action}_{target}_{description}`

**Actions:**
- `create` - Create new tables/functions
- `add` - Add columns/policies/indexes
- `modify` - Modify existing structures
- `drop` - Remove structures (rare, use with caution)
- `update` - Update data or configurations
- `seed` - Seed data migrations

**Examples:**
- `create_core_tables` - Create core foundation tables
- `add_rls_policies_companies` - Add RLS policies to companies table
- `modify_users_add_avatar_url` - Add avatar_url column to users
- `seed_1_1_1_foundation` - Seed foundation data for Phase 1.1.1

---

## Migration File Structure

### Standard Migration Template

```sql
-- Migration: {migration_name}
-- Description: {Brief description of changes}
-- Date: {YYYY-MM-DD}
-- Author: {Author name}
-- Phase: {Phase number}
-- Task: {Task ID}
-- Related: {Related migration IDs or documents}

-- Up Migration (applies changes)
BEGIN;

-- Migration SQL here
-- Use IF NOT EXISTS for idempotency
-- Use transactions for atomicity

COMMIT;

-- Rollback Migration (reverses changes)
-- DO NOT REMOVE - Required for rollback procedures
-- BEGIN;
-- 
-- -- Rollback SQL here
-- 
-- COMMIT;
```

### Example Migration

```sql
-- Migration: create_core_tables
-- Description: Create core foundation tables (users, system_config, audit_logs, notifications, approvals)
-- Date: 2025-01-12
-- Author: Nadia
-- Phase: 1.1.1
-- Task: 1.1.1.2
-- Related: schema-design.md, data-dictionary.md

BEGIN;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  role text NOT NULL CHECK (role IN ('company_user', 'moh_tier1', 'moh_tier2')),
  company_id uuid REFERENCES companies(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_users_company_id ON users(company_id);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

COMMIT;

-- Rollback Migration
-- BEGIN;
-- 
-- DROP INDEX IF EXISTS idx_users_email;
-- DROP INDEX IF EXISTS idx_users_role;
-- DROP INDEX IF EXISTS idx_users_company_id;
-- DROP TABLE IF EXISTS users;
-- 
-- COMMIT;
```

---

## Migration Numbering Rules

### Rule 1: Sequential Timestamps

**Requirement:** Each migration must have a unique timestamp

**Process:**
1. Check existing migrations in `supabase/migrations/`
2. Use current timestamp (YYYYMMDDHHMMSS format)
3. Ensure timestamp is later than all existing migrations
4. If conflicts occur, increment seconds

**Example:**
```
Existing: 20250112120000_create_core_tables.sql
New:      20250112120001_add_users_avatar_url.sql  (conflict - increment)
Correct:  20250112120010_add_users_avatar_url.sql  (use next available)
```

### Rule 2: Grouped Migrations

**Requirement:** Related migrations can share base timestamp with suffix

**Pattern:** `{base_timestamp}_{sequence}_{migration_name}.sql`

**Example:**
```
20250112120000_create_core_tables.sql
20250112120001_add_rls_policies_core.sql
20250112120002_add_indexes_core.sql
```

**Use Case:** Multiple related changes in same development session

### Rule 3: Phase-Based Prefixes (Optional)

**Requirement:** Migrations can include phase identifier in name

**Pattern:** `{timestamp}_phase_{phase}_{migration_name}.sql`

**Example:**
```
20250112120000_phase_1_1_1_create_core_tables.sql
20250112130000_phase_1_1_2_create_rmm_tables.sql
```

**Note:** Phase prefix is optional; timestamp is primary identifier

---

## Rollback Procedures

### Rollback Strategy

**Approach:** Create reverse migration for rollback

**Process:**
1. Identify migration to rollback
2. Create new migration with `rollback_` prefix
3. Include reverse SQL operations
4. Test rollback in development
5. Apply rollback to staging
6. Apply rollback to production

### Rollback Migration Template

```sql
-- Migration: rollback_{original_migration_name}
-- Description: Rollback changes from {original_migration_name}
-- Date: {YYYY-MM-DD}
-- Author: {Author name}
-- Phase: {Phase number}
-- Task: {Task ID}
-- Reverts: {Original migration timestamp and name}

BEGIN;

-- Reverse operations from original migration
-- Example: If original created table, drop table here
-- Example: If original added column, drop column here

COMMIT;
```

### Rollback Example

```sql
-- Migration: rollback_create_core_tables
-- Description: Rollback changes from create_core_tables
-- Date: 2025-01-12
-- Author: Nadia
-- Phase: 1.1.1
-- Task: 1.1.1.2
-- Reverts: 20250112120000_create_core_tables

BEGIN;

-- Drop indexes first
DROP INDEX IF EXISTS idx_users_email;
DROP INDEX IF EXISTS idx_users_role;
DROP INDEX IF EXISTS idx_users_company_id;

-- Drop table
DROP TABLE IF EXISTS users;

COMMIT;
```

### Rollback Best Practices

1. **Test First:** Always test rollback in development
2. **Backup:** Create database backup before rollback
3. **Document:** Document reason for rollback
4. **Verify:** Verify rollback success
5. **Monitor:** Monitor application after rollback

---

## Migration Dependencies

### Dependency Tracking

**Requirement:** Document migration dependencies

**Format:** Include in migration header
```sql
-- Depends on: {migration_timestamp}_{migration_name}
-- Required by: {migration_timestamp}_{migration_name}
```

### Example with Dependencies

```sql
-- Migration: add_rls_policies_companies
-- Description: Add RLS policies to companies table
-- Date: 2025-01-12
-- Depends on: 20250112120000_create_core_tables
-- Required by: 20250112140000_create_rmm_tables

BEGIN;

-- RLS policies depend on companies table existing
CREATE POLICY "company_users_see_own_company"
ON companies FOR SELECT
USING (
  id IN (SELECT company_id FROM users WHERE id = auth.uid())
);

COMMIT;
```

### Dependency Validation

**Process:**
1. Check `Depends on:` in migration header
2. Verify dependent migration exists
3. Verify dependent migration applied before this one
4. Fail if dependencies not met

---

## Migration Categories

### Category 1: Schema Migrations

**Purpose:** Create/modify database schema

**Examples:**
- Create tables
- Add/modify columns
- Add/modify indexes
- Add/modify constraints

**Naming:** `{action}_{target}_{description}`

**Example:** `create_core_tables`, `add_users_avatar_url`

---

### Category 2: RLS Policy Migrations

**Purpose:** Add/modify Row Level Security policies

**Examples:**
- Enable RLS on tables
- Create policies
- Modify policies
- Drop policies

**Naming:** `add_rls_policies_{table}`, `modify_rls_policy_{policy_name}`

**Example:** `add_rls_policies_companies`, `modify_rls_policy_company_users_see_own`

---

### Category 3: Function Migrations

**Purpose:** Create/modify database functions

**Examples:**
- Create RPC functions
- Create helper functions
- Modify function logic

**Naming:** `create_{function_name}`, `modify_{function_name}`

**Example:** `create_rmm_create_company`, `modify_vci_calculate_threshold`

---

### Category 4: Data Migrations

**Purpose:** Transform or populate data

**Examples:**
- Seed data
- Backfill data
- Transform data structure

**Naming:** `seed_{phase}_{description}`, `backfill_{target}_{description}`

**Example:** `seed_1_1_1_foundation`, `backfill_users_timezone`

---

## Migration Workflow

### Step 1: Create Migration

```bash
# Create migration file manually
# Format: {YYYYMMDDHHMMSS}_{migration_name}.sql
touch supabase/migrations/20250112120000_create_core_tables.sql
```

### Step 2: Write Migration SQL

- Use standard template
- Include rollback section (commented)
- Document dependencies
- Test locally

### Step 3: Test Migration

```bash
# Start local Supabase
supabase start

# Apply migration
supabase db reset  # Resets and applies all migrations
# OR
supabase migration up  # Applies pending migrations
```

### Step 4: Verify Migration

- Check tables created correctly
- Verify indexes created
- Test RLS policies
- Run data validation queries

### Step 5: Commit to Git

```bash
git add supabase/migrations/{timestamp}_{migration_name}.sql
git commit -m "Add migration: {migration_name} (Phase 1.1.1, Task 1.1.1.2)"
git push
```

### Step 6: Apply to Staging

```bash
# Link to staging project
supabase link --project-ref {staging-project-ref}

# Apply migrations
supabase db push
```

### Step 7: Apply to Production

```bash
# Link to production project
supabase link --project-ref {prod-project-ref}

# Apply migrations
supabase db push
```

---

## Migration Checklist

### Before Creating Migration

- [ ] Review schema design document
- [ ] Check for conflicts with existing migrations
- [ ] Plan rollback strategy
- [ ] Consider performance impact
- [ ] Document dependencies

### Before Applying to Staging

- [ ] Migration tested locally
- [ ] Migration file committed to Git
- [ ] Code review completed
- [ ] Documentation updated
- [ ] Dependencies verified

### Before Applying to Production

- [ ] Migration tested in staging
- [ ] Backup created
- [ ] Rollback plan ready
- [ ] Application code deployed
- [ ] Team notified
- [ ] Monitoring enabled

### After Applying to Production

- [ ] Verify migration success
- [ ] Check application functionality
- [ ] Monitor for errors
- [ ] Update documentation
- [ ] Archive backup

---

## Migration Tools

### Supabase MCP Tools (Required)

**All database operations must use Supabase MCP tools:**

- `mcp_supabase_apply_migration` - Apply migration
- `mcp_supabase_list_migrations` - List applied migrations
- `mcp_supabase_list_tables` - List tables
- `mcp_supabase_execute_sql` - Execute SQL queries
- `mcp_supabase_get_advisors` - Check security advisors

**Note:** Do not use Supabase CLI for migrations in Phase 1.1.1+

---

## Related Documents

- [Migration Strategy](migration-strategy.md) - General migration strategy
- [Database Schema Design](schema-design.md) - Schema specifications
- [RLS Policy Framework](../security/rls-policy-framework.md) - RLS specifications
- [Phase 1 Implementation Plan](../../05-project-management/phases/Phase-1-Implementation-Plan.md) - Implementation tasks

---

**Next Review Date:** [To be scheduled]  
**Owner:** Nadia
