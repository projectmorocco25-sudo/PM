# Migration Strategy - Pharmaceutical Governance Value Chain Platform (PM)

**Purpose:** This document defines the database migration strategy, versioning approach, and migration processes for the PM platform.

**Last Updated:** 2025-12-31  
**Status:** ✅ Complete (Phase 0, Week 2)  
**Owner:** Nadia

## Overview

The PM platform uses Supabase migrations for database schema management. Migrations are versioned, tracked in Git, and applied in sequence to ensure consistent database state across all environments.

## Migration Approach

### Supabase Migrations

**Tool:** Supabase CLI  
**Location:** `supabase/migrations/` directory  
**Format:** SQL files with timestamp prefix

**Migration File Naming:**
```
{YYYYMMDDHHMMSS}_{migration_name}.sql
```

**Example:**
```
20250101120000_initial_schema.sql
20250102140000_add_rls_policies.sql
20250103100000_add_ecs_module_tables.sql
```

---

## Migration Workflow

### 1. Create Migration

**Local Development:**
```bash
# Create new migration file
supabase migration new {migration_name}

# Or manually create file:
# supabase/migrations/{timestamp}_{migration_name}.sql
```

**Migration File Structure:**
```sql
-- Migration: {migration_name}
-- Description: Brief description of changes
-- Date: YYYY-MM-DD
-- Author: {author}

-- Up migration (applies changes)
BEGIN;

-- Create table
CREATE TABLE IF NOT EXISTS companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  -- ... other columns
);

-- Add indexes
CREATE INDEX idx_companies_registration_number ON companies(registration_number);

-- Add RLS policies
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "company_users_see_own_company"
ON companies FOR SELECT
USING (
  id IN (SELECT company_id FROM users WHERE id = auth.uid())
);

COMMIT;
```

---

### 2. Test Migration Locally

**Apply Migration:**
```bash
# Start local Supabase
supabase start

# Apply migrations
supabase db reset  # Resets and applies all migrations
# OR
supabase migration up  # Applies pending migrations
```

**Verify Migration:**
- Check tables created correctly
- Verify indexes created
- Test RLS policies
- Run data validation queries

---

### 3. Commit to Git

**Git Workflow:**
```bash
# Commit migration file
git add supabase/migrations/{timestamp}_{migration_name}.sql
git commit -m "Add migration: {migration_name}"
git push
```

**Branch Strategy:**
- Create feature branch for migration
- Create PR for review
- Merge to `main` after approval

---

### 4. Apply to Staging

**Apply Migration to Staging:**
```bash
# Link to staging project
supabase link --project-ref {staging-project-ref}

# Apply migrations
supabase db push
```

**Or via Supabase Dashboard:**
- Go to Database → Migrations
- Apply pending migrations

**Verify in Staging:**
- Test application functionality
- Verify data integrity
- Check RLS policies
- Run smoke tests

---

### 5. Apply to Production

**Apply Migration to Production:**
```bash
# Link to production project
supabase link --project-ref {prod-project-ref}

# Apply migrations
supabase db push
```

**Or via Supabase Dashboard:**
- Go to Database → Migrations
- Apply pending migrations

**Production Checklist:**
- ✅ Migration tested in staging
- ✅ Backup created
- ✅ Rollback plan ready
- ✅ Application code deployed
- ✅ Monitoring enabled
- ✅ Team notified

---

## Migration Types

### 1. Schema Migrations

**Purpose:** Create/modify tables, columns, indexes, constraints

**Examples:**
- Create new table
- Add column to existing table
- Modify column type
- Add/remove indexes
- Add/remove constraints

**Best Practices:**
- Use `IF NOT EXISTS` for idempotency
- Add columns as nullable first, then populate, then make NOT NULL
- Use transactions (BEGIN/COMMIT)
- Test with sample data

---

### 2. RLS Policy Migrations

**Purpose:** Add/modify Row Level Security policies

**Examples:**
- Enable RLS on table
- Create new policy
- Modify existing policy
- Drop obsolete policy

**Best Practices:**
- Test policies with different user roles
- Use helper functions for common checks
- Document policy purpose in comments

---

### 3. Data Migrations

**Purpose:** Transform or populate data

**Examples:**
- Populate initial data (seed data)
- Transform existing data
- Backfill missing values
- Migrate data structure

**Best Practices:**
- Use transactions
- Test with sample data first
- Verify data integrity after migration
- Consider performance for large datasets

---

### 4. Function Migrations

**Purpose:** Create/modify database functions

**Examples:**
- Create helper functions
- Create RPC functions
- Modify function logic
- Add function security settings

**Best Practices:**
- Use `CREATE OR REPLACE FUNCTION` for updates
- Set `SECURITY DEFINER` appropriately
- Document function purpose and parameters

---

## Migration Versioning

### Version Number Format

**Format:** `{YYYYMMDDHHMMSS}`

**Example:**
- `20250101120000` = January 1, 2025, 12:00:00

**Benefits:**
- Chronological ordering
- No conflicts
- Easy to identify migration date

---

### Migration Order

**Rule:** Migrations are applied in chronological order (by timestamp)

**Example Sequence:**
1. `20250101120000_initial_schema.sql`
2. `20250102140000_add_rls_policies.sql`
3. `20250103100000_add_ecs_module_tables.sql`

**Important:**
- Never modify existing migration files (creates inconsistencies)
- Create new migration for changes
- Migrations are immutable once applied to production

---

## Rollback Strategy

### Rollback Approach

**Option 1: Create Reverse Migration**
```sql
-- Migration: rollback_{original_migration_name}
-- Description: Rollback changes from {original_migration_name}

BEGIN;

-- Reverse changes
DROP TABLE IF EXISTS {table_name};

COMMIT;
```

**Option 2: Create Corrective Migration**
```sql
-- Migration: fix_{issue_description}
-- Description: Fix issue from {original_migration_name}

BEGIN;

-- Fix changes
ALTER TABLE {table_name} DROP COLUMN {column_name};

COMMIT;
```

---

### Rollback Process

1. **Identify Issue:**
   - Monitor application logs
   - Check database errors
   - Verify data integrity

2. **Create Rollback Migration:**
   - Create reverse migration file
   - Test locally
   - Review with team

3. **Apply Rollback:**
   - Apply to staging first
   - Verify fix
   - Apply to production

4. **Document:**
   - Document issue and resolution
   - Update migration notes

---

## Migration Best Practices

### 1. Idempotency

**Rule:** Migrations should be idempotent (safe to run multiple times)

**Techniques:**
- Use `IF NOT EXISTS` for tables
- Use `CREATE OR REPLACE` for functions
- Check existence before creating indexes
- Use transactions

**Example:**
```sql
CREATE TABLE IF NOT EXISTS companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  -- ...
);

CREATE INDEX IF NOT EXISTS idx_companies_registration_number 
ON companies(registration_number);
```

---

### 2. Backward Compatibility

**Rule:** Migrations should maintain backward compatibility when possible

**Techniques:**
- Add columns as nullable first
- Deprecate gradually (mark as deprecated, remove later)
- Version API changes
- Maintain old column names during transition

---

### 3. Performance Considerations

**Rule:** Consider performance impact of migrations

**Techniques:**
- Add indexes after data population
- Use `CONCURRENTLY` for index creation (if supported)
- Batch large data migrations
- Test with production-like data volumes

---

### 4. Testing

**Rule:** Test migrations thoroughly before production

**Testing Checklist:**
- ✅ Test locally with sample data
- ✅ Test in staging environment
- ✅ Verify RLS policies work correctly
- ✅ Test rollback procedure
- ✅ Performance testing (if applicable)

---

## Migration Templates

### Template 1: Create Table

```sql
-- Migration: create_{table_name}
-- Description: Create {table_name} table
-- Date: YYYY-MM-DD

BEGIN;

CREATE TABLE IF NOT EXISTS {table_name} (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  -- columns
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_{table_name}_{column} 
ON {table_name}({column});

-- RLS
ALTER TABLE {table_name} ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "{policy_name}"
ON {table_name} FOR SELECT
USING (/* policy logic */);

COMMIT;
```

---

### Template 2: Add Column

```sql
-- Migration: add_{column_name}_to_{table_name}
-- Description: Add {column_name} column to {table_name}
-- Date: YYYY-MM-DD

BEGIN;

-- Add column (nullable first)
ALTER TABLE {table_name}
ADD COLUMN IF NOT EXISTS {column_name} {type};

-- Populate data (if needed)
-- UPDATE {table_name} SET {column_name} = {default_value} WHERE {column_name} IS NULL;

-- Make NOT NULL (if needed)
-- ALTER TABLE {table_name}
-- ALTER COLUMN {column_name} SET NOT NULL;

COMMIT;
```

---

### Template 3: Add RLS Policy

```sql
-- Migration: add_rls_policy_{policy_name}
-- Description: Add RLS policy {policy_name} to {table_name}
-- Date: YYYY-MM-DD

BEGIN;

-- Enable RLS (if not already enabled)
ALTER TABLE {table_name} ENABLE ROW LEVEL SECURITY;

-- Create policy
CREATE POLICY "{policy_name}"
ON {table_name} FOR {operation}
USING (/* policy logic */);

COMMIT;
```

---

## Environment-Specific Migrations

### Development

**Approach:**
- Apply all migrations automatically
- Reset database frequently
- Test new migrations locally

**Commands:**
```bash
supabase start
supabase db reset  # Resets and applies all migrations
```

---

### Staging

**Approach:**
- Apply migrations manually or via CI/CD
- Test before production
- Verify with production-like data

**Commands:**
```bash
supabase link --project-ref {staging-ref}
supabase db push
```

---

### Production

**Approach:**
- Apply migrations carefully
- Create backup before migration
- Monitor after migration
- Have rollback plan ready

**Commands:**
```bash
supabase link --project-ref {prod-ref}
supabase db push
```

---

## Migration Checklist

### Before Creating Migration

- [ ] Review schema design document
- [ ] Check for conflicts with existing migrations
- [ ] Plan rollback strategy
- [ ] Consider performance impact

### Before Applying to Staging

- [ ] Migration tested locally
- [ ] Migration file committed to Git
- [ ] Code review completed
- [ ] Documentation updated

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

## Historical Data Migrations

**Status:** ✅ Documented - To be implemented in Phase 1.1  
**Reference:** See [Historical Data Routing Proposal](../../frontend/historical-data-routing-proposal.md) and [RPC Functions](../../api/rpc-functions.md)

### Required Migrations

**1. Historical Data Indexes Migration:**
```sql
-- Migration: add_historical_data_indexes
-- Purpose: Create indexes for historical data queries (7-year lookback support)

-- Audit logs indexes
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_created ON audit_logs(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_table_created ON audit_logs(table_name, created_at DESC);

-- AAMS submissions indexes
CREATE INDEX IF NOT EXISTS idx_aams_submissions_company_year ON aams_submissions(company_id, year DESC);

-- MSQ submissions indexes
CREATE INDEX IF NOT EXISTS idx_msq_submissions_company_year_month ON msq_submissions(company_id, year DESC, month DESC);

-- WSL submissions indexes
CREATE INDEX IF NOT EXISTS idx_wsl_submissions_company_week ON wsl_submissions(company_id, week_ending_date DESC);

-- Compliance scores indexes
CREATE INDEX IF NOT EXISTS idx_compliance_scores_company_month ON compliance_scores(company_id, score_month DESC);

-- Breaches indexes
CREATE INDEX IF NOT EXISTS idx_breaches_company_status_date ON breaches(company_id, status, detected_at DESC);
```

**2. Historical Data RPC Functions Migration:**
- `has_historical_ecs_data()` - Check if historical ECS data exists
- `has_historical_cmc_data()` - Check if historical CMC data exists
- `vci_get_historical_submissions()` - Get historical submissions with filtering
- `cmc_get_historical_scores()` - Get historical compliance scores
- `audit_get_historical_logs()` - Get historical audit logs (MOH/Auditors only)
- `log_historical_data_access()` - Log historical data access

**Implementation Notes:**
- All RPC functions must apply RLS automatically via SECURITY DEFINER
- All functions must log access via `log_historical_data_access()`
- Indexes should be created before RPC functions for optimal performance
- See [RPC Functions](../../api/rpc-functions.md) for complete function specifications

---

## Related Documents

- [Database Schema Design](schema-design.md)
- [RLS Policy Framework Design](../security/rls-policy-framework.md)
- [Development Environment Setup](../../../06-development/development-setup.md) - Setup guide (Week 4)
- [Technical Decision Log](../../../06-development/technical-decisions/decision-log.md)

---

**Next Review Date:** [To be scheduled]  
**Owner:** Nadia

