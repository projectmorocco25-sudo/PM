# Supabase Backend - Pharmaceutical Governance Value Chain Platform (PM)

**Purpose:** This directory contains all Supabase backend configuration, migrations, Edge Functions, and storage configurations.

**Last Updated:** 2026-01-XX  
**Status:** ✅ Initialized (Task 1.1.1.1)

---

## Directory Structure

```
supabase/
├── config.toml          # Supabase project configuration
├── migrations/          # Database migration files (SQL)
├── functions/           # Edge Functions (Deno/TypeScript)
└── README.md           # This file
```

---

## Migrations

**Location:** `supabase/migrations/`

**Purpose:** Database schema changes, table creation, RLS policies, functions, triggers, and seed data.

**Naming Convention:**
```
{YYYYMMDDHHMMSS}_{migration_name}.sql
```

**Example:**
```
20250112203000_audit_logging_trigger_infrastructure.sql
20250115000000_create_core_tables.sql
```

**Migration Workflow:**
1. Create migration: `supabase migration new {name}`
2. Edit migration file in `migrations/` directory
3. Test locally: `supabase db reset`
4. Apply to remote: `supabase db push`

**Reference:** [Migration Strategy](../../docs/02-architecture/database/migration-strategy.md)

---

## Edge Functions

**Location:** `supabase/functions/`

**Purpose:** Serverless functions for custom business logic, integrations, and scheduled jobs.

**Technology:** Deno runtime with TypeScript

**Function Structure:**
```
functions/
├── {function-name}/
│   ├── index.ts        # Function entry point
│   └── deno.json       # Deno configuration (optional)
```

**Deployment:**
```bash
# Deploy function
supabase functions deploy {function-name}

# Test locally
supabase functions serve {function-name}
```

**Reference:** [Edge Functions Specification](../../docs/02-architecture/api/edge-functions.md)

---

## Configuration

**File:** `config.toml`

**Purpose:** Supabase project configuration for local development.

**Initialization:**
- **Local:** Run `supabase init` to generate proper config
- **Remote:** Run `supabase link --project-ref {project-ref}` to link to remote project

**Note:** The current `config.toml` is a template. Run `supabase init` or `supabase link` to configure properly.

---

## Storage Buckets

Storage buckets are configured through Supabase Dashboard or via SQL migrations.

**Common Buckets:**
- `attachments` - File attachments for messages, submissions
- `documents` - Regulatory documents, reports
- `exports` - Generated export files

**Configuration:** Storage buckets are typically created via migrations or Supabase Dashboard.

---

## Development Workflow

### 1. Initialize Supabase (First Time)

**Option A: Local Development**
```bash
# Initialize Supabase
supabase init

# Start local Supabase
supabase start

# Note the API URL and keys from output
```

**Option B: Remote Project**
```bash
# Link to remote project
supabase link --project-ref {project-ref}

# Enter Supabase access token when prompted
```

### 2. Create Migration

```bash
# Create new migration
supabase migration new create_core_tables

# Edit the migration file
# supabase/migrations/{timestamp}_create_core_tables.sql
```

### 3. Apply Migrations

```bash
# Apply all migrations (local)
supabase db reset

# Or apply incrementally
supabase migration up
```

### 4. Create Edge Function

```bash
# Create new function
supabase functions new {function-name}

# Edit function
# supabase/functions/{function-name}/index.ts
```

### 5. Deploy

```bash
# Deploy migrations to remote
supabase db push

# Deploy functions to remote
supabase functions deploy {function-name}
```

---

## Related Documentation

- **Migration Strategy:** [docs/02-architecture/database/migration-strategy.md](../../docs/02-architecture/database/migration-strategy.md)
- **Edge Functions:** [docs/02-architecture/api/edge-functions.md](../../docs/02-architecture/api/edge-functions.md)
- **Development Setup:** [docs/06-development/development-setup.md](../../docs/06-development/development-setup.md)
- **Database Schema:** [docs/02-architecture/database/schema-design.md](../../docs/02-architecture/database/schema-design.md)
- **RPC Functions:** [docs/02-architecture/api/rpc-functions.md](../../docs/02-architecture/api/rpc-functions.md)

---

## Task Status

**Task 1.1.1.1:** ✅ **COMPLETE** - Supabase project structure initialized

**Next Tasks:**
- Task 1.1.1.2: Create database migration for core tables
- Task 1.1.1.1a: Define module integration contracts
- Task 1.1.1.1b: Set up shared database schema versioning strategy

---

**Owner:** Nadia (Database) + Leila (Edge Functions)  
**Last Updated:** 2026-01-XX
