# Fix Supabase CLI "Initialising login role" Hang

## Quick Fixes (Try in Order)

### 1. **Upgrade Supabase CLI** (Most Common Fix)
```powershell
# Update via Scoop (if using Scoop)
scoop update supabase

# Or update via npm (if using npx)
npm install -g supabase@latest

# Verify version
npx supabase --version
```

### 2. **Wait 15-30 Minutes** (IP Rate Limit Reset)
If you've run multiple migration repairs, Supabase may have temporarily rate-limited your IP. Wait 15-30 minutes and try again.

### 3. **Use Direct Database Connection** (Bypass Pooler)
Instead of `db push`, try using direct connection:

```powershell
# Get your database password from:
# https://supabase.com/dashboard/project/lbtgmetmfkikrelbedou/settings/database

# Then use psql directly (if you have it installed)
$env:PGPASSWORD="your-db-password"
psql -h aws-0-us-east-1.pooler.supabase.com -p 6543 -U postgres.lbtgmetmfkikrelbedou -d postgres
```

### 4. **Check Project Link Status**
```powershell
# Check if project is linked
npx supabase status

# If not linked or link is broken, re-link:
npx supabase link --project-ref lbtgmetmfkikrelbedou
# (You'll need your database password)
```

### 5. **Use Alternative: Supabase Dashboard SQL Editor**
If CLI continues to hang, apply migrations manually:
1. Go to: https://supabase.com/dashboard/project/lbtgmetmfkikrelbedou/sql/new
2. Copy contents of each migration file
3. Run them in order:
   - `20260125180000_phase6_tax_id.sql`
   - `20260125180001_phase6_company_filter.sql`
   - `20260125190000_rmm_request_submission_info.sql`
   - `20260125190001_created_by_updated_by.sql`

### 6. **Check Network/VPN**
- Try a different network (mobile hotspot, VPN)
- Some users report regional issues (us-east-1 vs us-east-2)

### 7. **Clear Supabase CLI Cache**
```powershell
# Clear npx cache
Remove-Item -Recurse -Force "$env:APPDATA\npm-cache" -ErrorAction SilentlyContinue

# Clear Supabase CLI cache (if exists)
Remove-Item -Recurse -Force "$env:USERPROFILE\.supabase" -ErrorAction SilentlyContinue
```

### 8. **Use Local Supabase (Alternative)**
If remote push continues to fail, you can test locally:
```powershell
# Start local Supabase
npx supabase start

# Apply migrations locally
npx supabase db reset

# Then manually sync to remote later
```

## Recommended Approach

**For immediate migration needs:**
1. Use **Supabase Dashboard SQL Editor** (Option 5) - most reliable
2. Apply migrations in order manually

**For long-term fix:**
1. Upgrade CLI (Option 1)
2. Wait 30 minutes (Option 2)
3. Try `db push` again

## Verify Migrations Applied

After applying migrations, verify in Supabase Dashboard:
1. Go to: https://supabase.com/dashboard/project/lbtgmetmfkikrelbedou/database/migrations
2. Check that all 4 new migrations appear:
   - `20260125180000_phase6_tax_id`
   - `20260125180001_phase6_company_filter`
   - `20260125190000_rmm_request_submission_info`
   - `20260125190001_created_by_updated_by`

## Check Functions Created

Verify RPCs exist:
```sql
-- Run in Supabase SQL Editor
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_schema = 'public' 
  AND routine_name IN (
    'rmm_request_submission_info',
    'rmm_create_company',
    'rmm_update_company',
    'rmm_get_company',
    'rmm_list_companies'
  );
```

## Check Columns Added

```sql
-- Verify tax_id column
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'companies' 
  AND column_name = 'tax_id';

-- Verify created_by/updated_by columns
SELECT table_name, column_name 
FROM information_schema.columns 
WHERE table_name IN ('companies', 'products', 'skus')
  AND column_name IN ('created_by', 'updated_by');
```
