# Applying Database Migrations

**Last Updated:** 2026-01-22  
**Status:** Ready for Application

---

## Overview

All 13 migration files for Subphase 1.1.1 have been created and are ready to be applied to your remote Supabase database.

---

## Migration Files (in order)

1. `20260122001144_create_core_tables.sql` - Core tables (users, system_config, audit_logs, notifications, approvals, approval_history)
2. `20260122002012_create_communication_tables.sql` - Communications tables (conversations, messages, message_attachments, message_read_receipts)
3. `20260122002358_create_shared_rpc_functions.sql` - Shared RPC functions (8 functions)
4. `20260122002646_create_communications_rpc_functions.sql` - Communications RPC functions (9 functions)
5. `20260122003026_create_system_status_rpc_functions.sql` - System status RPC functions (5 functions)
6. `20260122003519_create_authentication_rpc_function.sql` - Authentication RPC function (rmm_create_user)
7. `20260122003829_create_rmm_tables.sql` - RMM tables (companies, products, skus, atc_codes, critical_medicines, registry_submissions)
8. `20260122004206_create_rls_policies_core_tables.sql` - RLS policies for core tables
9. `20260122004408_create_rls_policies_rmm_tables.sql` - RLS policies for RMM tables
10. `20260122004841_create_enforcement_tables.sql` - Enforcement tables (enforcement_actions, enforcement_action_appeals)
11. `20260122005107_create_rls_policies_enforcement_tables.sql` - RLS policies for enforcement tables
12. `20260122005200_create_rls_policies_communications_tables.sql` - RLS policies for communications tables
13. `20260122005821_create_audit_logging_trigger_infrastructure.sql` - Audit logging triggers

---

## Method 1: Using Supabase CLI (Recommended)

### Step 1: Authenticate with Supabase

```bash
# Login to Supabase (will open browser for authentication)
supabase login

# OR use an access token
supabase login --token YOUR_ACCESS_TOKEN
```

To get an access token:
1. Go to https://supabase.com/dashboard/account/tokens
2. Generate a new access token
3. Use it with `supabase login --token YOUR_ACCESS_TOKEN`

### Step 2: Link to Your Project

```bash
# Link to your remote Supabase project
supabase link --project-ref lbtgmetmfkikrelbedou
```

You'll be prompted for your database password. You can find it in:
- Supabase Dashboard → Project Settings → Database → Database Password

### Step 3: Push Migrations

```bash
# Push all migrations to remote database
supabase db push

# Or push with dry-run first to see what will be applied
supabase db push --dry-run
```

### Step 4: Verify Migrations

```bash
# Check which migrations are applied
supabase migration list

# Or check in Supabase Dashboard:
# Database → Migrations → View migration history
```

---

## Method 2: Using Supabase Dashboard (Alternative)

If you prefer to apply migrations manually via the Supabase Dashboard:

1. **Go to Supabase Dashboard:**
   - Navigate to: https://supabase.com/dashboard/project/lbtgmetmfkikrelbedou

2. **Open SQL Editor:**
   - Click on "SQL Editor" in the left sidebar

3. **Apply Migrations in Order:**
   - Open each migration file from `supabase/migrations/` in order (by timestamp)
   - Copy the entire SQL content
   - Paste into SQL Editor
   - Click "Run" to execute

4. **Verify:**
   - Go to Database → Migrations
   - Check that all 13 migrations appear in the migration history

---

## Method 3: Using Database Connection String

If you have the database connection string:

```bash
# Push migrations using database URL
supabase db push --db-url "postgresql://postgres:[PASSWORD]@db.lbtgmetmfkikrelbedou.supabase.co:5432/postgres"
```

Replace `[PASSWORD]` with your database password.

---

## Verification Checklist

After applying migrations, verify:

- [ ] All 13 migrations appear in Supabase Dashboard → Database → Migrations
- [ ] Core tables exist: `users`, `system_config`, `audit_logs`, `notifications`, `approvals`, `approval_history`
- [ ] Communications tables exist: `conversations`, `messages`, `message_attachments`, `message_read_receipts`
- [ ] RMM tables exist: `companies`, `products`, `skus`, `atc_codes`, `critical_medicines`, `registry_submissions`
- [ ] Enforcement tables exist: `enforcement_actions`, `enforcement_action_appeals`
- [ ] RPC functions exist (check in Supabase Dashboard → Database → Functions)
- [ ] RLS policies are enabled (check in Supabase Dashboard → Database → Tables → [table] → Policies)
- [ ] Audit triggers are created (check in Supabase Dashboard → Database → Triggers)

---

## Troubleshooting

### Issue: "failed to parse environment file: .env.local"

**Solution:** The `.env.local` file may have encoding issues. Temporarily rename it:
```bash
# Windows PowerShell
Rename-Item .env.local .env.local.backup

# After migrations, restore it
Rename-Item .env.local.backup .env.local
```

### Issue: "Missing required field in config: project_id"

**Solution:** This is normal before linking. The `project_id` will be populated automatically when you run `supabase link`.

### Issue: "Cannot use automatic login flow"

**Solution:** Use the token-based login:
```bash
supabase login --token YOUR_ACCESS_TOKEN
```

### Issue: Migration fails with foreign key constraint error

**Solution:** Ensure migrations are applied in order (by timestamp). The migrations are designed to be idempotent, but dependencies must be created first.

---

## Next Steps

After migrations are applied:

1. ✅ Verify all tables, functions, and policies are created
2. ✅ Test frontend pages to ensure database connectivity
3. ✅ Proceed with Subphase 1.1.2 (RMM Module implementation)

---

## Support

If you encounter issues:
- Check Supabase Dashboard → Database → Migrations for error details
- Review migration files for syntax errors
- Contact the team for assistance

---

**Status:** Ready for application  
**Total Migrations:** 13  
**Estimated Time:** 5-10 minutes
