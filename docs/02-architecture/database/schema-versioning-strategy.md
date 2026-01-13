# Database Schema Versioning Strategy - PM Platform

**Purpose:** Defines the shared database schema versioning strategy including migration numbering, rollback procedures, and multi-environment management.

**Last Updated:** 2026-01-12  
**Status:** ✅ Implementation Ready (Phase 1.1.1)  
**Owner:** Nadia (Database Lead)  
**Task Reference:** Task 1.1.1.1b

---

## Overview

This document establishes a comprehensive versioning strategy for database schema management across the PM platform, ensuring consistent, traceable, and reversible database changes across all environments.

---

## Versioning Scheme

### Migration Numbering Format

```
{YYYYMMDD}_{HHMMSS}_{module}_{description}.sql
```

**Components:**
| Component | Format | Example | Purpose |
|-----------|--------|---------|---------|
| Date | YYYYMMDD | 20260112 | Chronological ordering |
| Time | HHMMSS | 143000 | Uniqueness within day |
| Module | lowercase | vci, ecs, cmc, rmm, core | Module ownership |
| Description | snake_case | create_thresholds_table | Change description |

**Examples:**
```
20260112_143000_core_create_users_table.sql
20260112_150000_rmm_create_companies_table.sql
20260112_160000_vci_create_msq_submissions.sql
20260112_170000_vci_add_lifecycle_state_to_conversations.sql
20260113_090000_ecs_create_export_authorizations.sql
```

### Version Categories

| Category | Prefix | Purpose | Example |
|----------|--------|---------|---------|
| Schema | (none) | Table/column changes | `create_users_table` |
| Index | `idx_` | Index additions | `idx_add_msq_company_year` |
| RLS | `rls_` | RLS policy changes | `rls_companies_company_isolation` |
| Seed | `seed_` | Reference data | `seed_atc_codes` |
| Fix | `fix_` | Bug fixes | `fix_threshold_constraint` |
| Rollback | `rollback_` | Revert migrations | `rollback_20260112_143000` |

---

## Migration File Structure

### Standard Migration Template

```sql
-- =============================================================================
-- Migration: {YYYYMMDD}_{HHMMSS}_{module}_{description}.sql
-- Module: {RMM|VCI|ECS|CMC|Core}
-- Author: {author_name}
-- Date: {YYYY-MM-DD}
-- Description: {Brief description of changes}
-- Dependencies: {List of dependent migrations, or "None"}
-- Rollback: {rollback_migration_name.sql or "See rollback section below"}
-- =============================================================================

-- Pre-flight checks
DO $$
BEGIN
  -- Verify dependencies exist
  -- Example: Check required table exists
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'users') THEN
    RAISE EXCEPTION 'Dependency not met: users table must exist';
  END IF;
END $$;

-- =============================================================================
-- UP MIGRATION
-- =============================================================================

BEGIN;

-- 1. Create table (if applicable)
CREATE TABLE IF NOT EXISTS {table_name} (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- columns...
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Add columns (if applicable)
ALTER TABLE {existing_table}
ADD COLUMN IF NOT EXISTS {column_name} {type} {constraints};

-- 3. Create indexes
CREATE INDEX IF NOT EXISTS idx_{table}_{column} ON {table}({column});

-- 4. Enable RLS (if applicable)
ALTER TABLE {table_name} ENABLE ROW LEVEL SECURITY;

-- 5. Create RLS policies (if applicable)
CREATE POLICY "{policy_name}"
ON {table_name} FOR {SELECT|INSERT|UPDATE|DELETE}
TO authenticated
USING ({policy_expression});

-- 6. Create/update functions (if applicable)
CREATE OR REPLACE FUNCTION {function_name}()
RETURNS {return_type}
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Function body
END;
$$;

-- 7. Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON {table_name} TO authenticated;
GRANT EXECUTE ON FUNCTION {function_name} TO authenticated;

COMMIT;

-- =============================================================================
-- VERIFICATION QUERIES
-- =============================================================================
-- Run these queries to verify migration success:
-- SELECT * FROM information_schema.tables WHERE table_name = '{table_name}';
-- SELECT * FROM information_schema.columns WHERE table_name = '{table_name}';
-- SELECT * FROM pg_policies WHERE tablename = '{table_name}';

-- =============================================================================
-- ROLLBACK SECTION (for reference, create separate rollback file)
-- =============================================================================
-- DROP POLICY IF EXISTS "{policy_name}" ON {table_name};
-- DROP INDEX IF EXISTS idx_{table}_{column};
-- ALTER TABLE {existing_table} DROP COLUMN IF EXISTS {column_name};
-- DROP TABLE IF EXISTS {table_name};
```

### Rollback Migration Template

```sql
-- =============================================================================
-- Rollback Migration: rollback_{original_migration_timestamp}.sql
-- Reverts: {YYYYMMDD}_{HHMMSS}_{module}_{description}.sql
-- Author: {author_name}
-- Date: {YYYY-MM-DD}
-- Reason: {Why rollback is needed}
-- =============================================================================

-- Pre-flight checks
DO $$
BEGIN
  -- Verify original migration was applied
  -- Check table/column exists before trying to drop
END $$;

BEGIN;

-- Reverse changes in OPPOSITE order of original migration

-- 1. Drop functions first (if they depend on tables)
DROP FUNCTION IF EXISTS {function_name};

-- 2. Drop policies
DROP POLICY IF EXISTS "{policy_name}" ON {table_name};

-- 3. Disable RLS (if no other policies remain)
-- ALTER TABLE {table_name} DISABLE ROW LEVEL SECURITY;

-- 4. Drop indexes
DROP INDEX IF EXISTS idx_{table}_{column};

-- 5. Drop columns (if added)
ALTER TABLE {existing_table} DROP COLUMN IF EXISTS {column_name};

-- 6. Drop tables (if created)
DROP TABLE IF EXISTS {table_name} CASCADE;

COMMIT;
```

---

## Version Control Integration

### Git Branch Strategy

```
main (production)
  └── staging
        └── develop
              ├── feature/rmm-company-registration
              ├── feature/vci-threshold-management
              └── hotfix/fix-rls-policy
```

### Migration Commit Convention

```bash
# Commit message format
git commit -m "db({module}): {action} {description}

Migration: {migration_filename}
Tables: {affected_tables}
Breaking: {yes|no}
Rollback: {rollback_filename|N/A}
"

# Examples
git commit -m "db(vci): create msq_submissions table

Migration: 20260112_160000_vci_create_msq_submissions.sql
Tables: msq_submissions
Breaking: no
Rollback: rollback_20260112_160000.sql
"

git commit -m "db(core): add lifecycle_state to conversations

Migration: 20260112_170000_core_add_lifecycle_state.sql
Tables: conversations
Breaking: no (nullable column added)
Rollback: rollback_20260112_170000.sql
"
```

### Pull Request Template for Migrations

```markdown
## Database Migration PR

### Migration Details
- **File:** `{migration_filename}`
- **Module:** {RMM|VCI|ECS|CMC|Core}
- **Type:** {Schema|Index|RLS|Seed|Fix}

### Changes
- [ ] New table(s): {list}
- [ ] New column(s): {list}
- [ ] New index(es): {list}
- [ ] New RLS policy: {list}
- [ ] Modified function(s): {list}

### Breaking Changes
- [ ] No breaking changes
- [ ] Breaking changes (describe below):

### Testing
- [ ] Tested locally with `supabase db reset`
- [ ] Verified with test data
- [ ] RLS policies tested with different roles
- [ ] Rollback tested

### Rollback Plan
- Rollback migration: `{rollback_filename}`
- Tested: {yes|no}

### Checklist
- [ ] Migration file follows naming convention
- [ ] Rollback migration created
- [ ] Documentation updated
- [ ] No hardcoded values (uses environment variables)
```

---

## Environment Management

### Environment Hierarchy

```
Development (Local)
    ↓ (test migrations)
Staging (supabase-staging)
    ↓ (verify migrations)
Production (supabase-prod)
```

### Migration Application Process

```bash
# 1. Local Development
supabase start
supabase db reset  # Apply all migrations fresh

# 2. Staging Deployment
supabase link --project-ref {staging-ref}
supabase db push  # Apply pending migrations

# 3. Production Deployment
supabase link --project-ref {prod-ref}
supabase db push  # Apply pending migrations
```

### Environment-Specific Configuration

```sql
-- Use environment variables for environment-specific values
-- Example: Different email service URLs per environment

CREATE OR REPLACE FUNCTION get_config(p_key TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_value TEXT;
BEGIN
  SELECT value INTO v_value
  FROM system_config
  WHERE key = p_key AND is_active = true;
  
  RETURN v_value;
END;
$$;

-- Never hardcode environment-specific values in migrations
-- Instead, use seed migrations per environment
```

---

## Rollback Procedures

### Rollback Decision Tree

```
Migration Failure Detected
    │
    ├── Immediate Rollback (< 5 minutes after deployment)
    │   └── Apply rollback migration
    │
    ├── Data-Preserving Rollback (data written since migration)
    │   ├── Backup new data
    │   ├── Apply rollback migration
    │   └── Restore/migrate data if needed
    │
    └── Forward Fix (rollback too risky)
        └── Create fix migration instead
```

### Rollback Execution

```bash
# 1. Create rollback migration file (if not exists)
# rollback_{original_timestamp}.sql

# 2. Apply rollback in staging first
supabase link --project-ref {staging-ref}
supabase db push

# 3. Verify rollback success
# Run verification queries

# 4. Apply to production (if staging successful)
supabase link --project-ref {prod-ref}
supabase db push
```

### Rollback Checklist

```markdown
## Rollback Checklist

### Pre-Rollback
- [ ] Identified affected migration(s)
- [ ] Rollback migration file exists and tested
- [ ] Data backup created (if applicable)
- [ ] Team notified of rollback

### During Rollback
- [ ] Application put in maintenance mode (if needed)
- [ ] Rollback applied to staging first
- [ ] Staging verified
- [ ] Rollback applied to production
- [ ] Production verified

### Post-Rollback
- [ ] Application back online
- [ ] Monitoring enabled
- [ ] Incident documented
- [ ] Root cause analysis scheduled
```

---

## Migration Dependencies

### Dependency Declaration

```sql
-- In migration header
-- Dependencies: 20260112_143000_core_create_users_table.sql,
--               20260112_150000_rmm_create_companies_table.sql

-- Pre-flight dependency check
DO $$
BEGIN
  -- Check users table exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_name = 'users'
  ) THEN
    RAISE EXCEPTION 'Migration dependency not met: users table required';
  END IF;
  
  -- Check companies table exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_name = 'companies'
  ) THEN
    RAISE EXCEPTION 'Migration dependency not met: companies table required';
  END IF;
END $$;
```

### Module Dependency Order

```
1. Core (users, system_config, audit_logs, notifications)
   ↓
2. RMM (companies, products, skus, atc_codes, critical_medicines)
   ↓
3. VCI (submissions, thresholds, breaches) - requires RMM
   ↓
4. ECS (export_authorizations) - requires RMM + VCI
5. CMC (compliance_scores) - requires RMM + VCI, optional ECS
```

---

## Schema Version Tracking

### Version Tracking Table

```sql
-- Supabase automatically tracks migrations in schema_migrations table
-- Additional custom tracking for application-level version

CREATE TABLE IF NOT EXISTS schema_version (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  version VARCHAR(20) NOT NULL, -- Semantic version: 1.0.0, 1.1.0, etc.
  migration_name TEXT NOT NULL,
  applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  applied_by TEXT NOT NULL DEFAULT current_user,
  checksum TEXT NOT NULL, -- MD5 of migration file
  execution_time_ms INTEGER,
  status TEXT NOT NULL CHECK (status IN ('applied', 'failed', 'rolled_back')),
  notes TEXT
);

CREATE INDEX idx_schema_version_applied_at ON schema_version(applied_at DESC);
```

### Version Queries

```sql
-- Get current schema version
SELECT version, migration_name, applied_at
FROM schema_version
WHERE status = 'applied'
ORDER BY applied_at DESC
LIMIT 1;

-- Get migration history
SELECT version, migration_name, applied_at, status, execution_time_ms
FROM schema_version
ORDER BY applied_at DESC
LIMIT 20;

-- Check if specific migration applied
SELECT EXISTS (
  SELECT 1 FROM schema_version
  WHERE migration_name = '{migration_name}'
  AND status = 'applied'
);
```

---

## Best Practices

### DO's

1. **Always create rollback migration** before applying to production
2. **Test migrations locally** with `supabase db reset`
3. **Apply to staging first** before production
4. **Use transactions** for all DDL changes
5. **Add nullable columns first**, then populate, then add constraints
6. **Use `IF NOT EXISTS`** for idempotency
7. **Document dependencies** in migration header
8. **Create indexes after data** for large tables

### DON'Ts

1. **Never modify** an already-applied migration
2. **Never drop production tables** without explicit approval
3. **Never use** environment-specific hardcoded values
4. **Never skip staging** when deploying to production
5. **Never apply migrations** during peak traffic hours
6. **Never delete** old migration files from repository

---

## Related Documents

- [Migration Strategy](migration-strategy.md) - Original migration approach
- [Schema Design](schema-design.md) - Database schema reference
- [Module Integration Contracts](../integration/module-integration-contracts.md) - Cross-module data contracts

---

**Next Review Date:** [To be scheduled]  
**Owner:** Nadia (Database Lead)
