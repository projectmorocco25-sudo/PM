# Schema Verification Guide
**Task: 1.1.1.21b** - Comprehensive schema verification after all migrations

## Purpose
This guide provides steps to verify that all database migrations have been applied correctly and that the database schema matches the specifications in `schema-design.md`.

## Prerequisites
- Access to Supabase dashboard or Supabase CLI
- All migrations applied (check via `supabase migration list` or dashboard)

## Verification Steps

### 1. Verify Migration History
Run the SQL query in `verify-schema.sql` section 1, or use Supabase CLI:
```bash
supabase migration list
```

Expected: All migration files from `supabase/migrations/` should appear in the list.

### 2. Verify Tables Exist
Run the SQL queries in `verify-schema.sql` section 2, or check via Supabase dashboard:
- Navigate to Table Editor
- Verify all tables listed in `schema-design.md` are present

### 3. Verify Columns and Data Types
Run the SQL query in `verify-schema.sql` section 3 for each table, or use Supabase dashboard:
- Navigate to Table Editor > [Table Name] > Structure
- Compare columns, data types, and constraints with `schema-design.md`

### 4. Verify Foreign Key Constraints
Run the SQL query in `verify-schema.sql` section 4 to list all foreign keys.
Verify foreign key relationships match `schema-design.md`.

### 5. Verify Indexes
Run the SQL query in `verify-schema.sql` section 5 to list all indexes.
Verify indexes match the specifications in `schema-design.md`.

### 6. Verify Constraints
Run the SQL query in `verify-schema.sql` section 6 to list NOT NULL, CHECK, and UNIQUE constraints.
Verify constraints match `schema-design.md`.

### 7. Verify Triggers
Run the SQL query in `verify-schema.sql` section 7 to list all triggers.
Expected: Audit logging triggers should be present on audited tables.

### 8. Verify RLS Policies
Run the SQL query in `verify-schema.sql` section 8 to list all RLS policies.
Verify RLS policies are enabled on all tables per security requirements.

## Automated Verification
Use the `verify-schema.sql` script via Supabase dashboard SQL Editor or CLI:
```bash
supabase db execute --file supabase/scripts/verify-schema.sql
```

## Expected Results
All verification queries should return results matching `schema-design.md` specifications.

## Notes
- Some queries may return empty results if no data exists yet (e.g., constraints on empty tables)
- Compare actual schema with `docs/02-architecture/database/schema-design.md`
- Report any discrepancies for review
