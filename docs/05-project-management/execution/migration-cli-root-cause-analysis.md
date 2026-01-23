# Root Cause Analysis: Supabase CLI Migration Connection Issues

**Date:** 2026-01-23  
**Team:** Hassan, Nadia, Maya  
**Status:** 🔴 BLOCKED - Network Connection Timeout

## Problem Statement

Supabase CLI cannot connect to the remote database to apply migrations, resulting in connection timeouts.

## Root Cause Analysis

### ✅ What Works
1. **CLI Installation:** Updated from v2.47.2 to v2.72.7 successfully via Scoop
2. **Project Linking:** `supabase link` command succeeds
3. **Network Connectivity:** Port 6543 (pooler) is reachable per `Test-NetConnection`
4. **MCP Tools:** Database connections via MCP work perfectly
5. **API Access:** Supabase API calls succeed (project info, API keys)

### ❌ What Fails
1. **Database Connection:** CLI times out when connecting to database
   - Error: `tls error (read tcp ... i/o timeout)`
   - Occurs on both pooler (6543) and direct (5432) ports
   - Happens during `supabase db push` operations

## Technical Details

### Connection Attempts
- **Pooler Connection:** `aws-1-eu-west-1.pooler.supabase.com:6543`
- **Direct Connection:** `aws-1-eu-west-1.pooler.supabase.com:5432` (fallback)
- **User:** `postgres.lbtgmetmfkikrelbedou`
- **Database:** `postgres`

### Error Pattern
```
Connecting to remote database...
failed to connect to postgres: failed to connect to `host=aws-1-eu-west-1.pooler.supabase.com user=postgres.lbtgmetmfkikrelbedou database=postgres`: tls error (read tcp 10.216.46.66:XXXXX->18.202.64.2:5432: i/o timeout)
```

## Possible Root Causes

### 1. Windows Firewall / Antivirus (HIGH PROBABILITY)
- **Hypothesis:** Windows Defender or third-party antivirus blocking Go binary network connections
- **Evidence:** MCP tools (different connection method) work fine
- **Test:** Temporarily disable firewall/antivirus and retry

### 2. TLS/SSL Handshake Issues (MEDIUM PROBABILITY)
- **Hypothesis:** TLS negotiation failing between CLI and database
- **Evidence:** Error mentions "tls error" specifically
- **Test:** Try disabling TLS verification (not recommended for production)

### 3. IP Restrictions on Supabase Project (MEDIUM PROBABILITY)
- **Hypothesis:** Supabase project has IP allowlist enabled
- **Evidence:** MCP might use different IP or connection method
- **Test:** Check Supabase Dashboard → Settings → Network Restrictions

### 4. Network Proxy/VPN Interference (LOW PROBABILITY)
- **Hypothesis:** Corporate proxy or VPN blocking database connections
- **Evidence:** Port test succeeds but actual connection fails
- **Test:** Try from different network or disable VPN

### 5. Go Runtime Network Stack Issue (LOW PROBABILITY)
- **Hypothesis:** Bug in Go's network stack for this specific Windows configuration
- **Evidence:** CLI is Go-based, MCP uses different runtime
- **Test:** Try different CLI version or installation method

## Current Migration Status

### Applied Migrations (via MCP - should be CLI)
- ✅ `20260121160839_factory_reset_scorched_earth_v2`
- ✅ `20260121161226_factory_reset_clear_auth_users`
- ✅ `20260123132550_create_core_tables` (applied via MCP)
- ✅ `20260123134140_create_communication_tables` (applied via MCP)
- ✅ `20260123134254_create_shared_rpc_functions` (applied via MCP)

### Pending Migrations (need to apply via CLI)
- ⏳ `20260122002646_create_communications_rpc_functions.sql`
- ⏳ `20260122003026_create_system_status_rpc_functions.sql`
- ⏳ `20260122003519_create_authentication_rpc_function.sql`
- ⏳ `20260122003829_create_rmm_tables.sql`
- ⏳ `20260122004206_create_rls_policies_core_tables.sql`
- ⏳ `20260122004408_create_rls_policies_rmm_tables.sql`
- ⏳ `20260122004841_create_enforcement_tables.sql`
- ⏳ `20260122005107_create_rls_policies_enforcement_tables.sql`
- ⏳ `20260122005200_create_rls_policies_communications_tables.sql`
- ⏳ `20260122005821_create_audit_logging_trigger_infrastructure.sql`

## Recommended Solutions

### Solution 1: Check Windows Firewall (IMMEDIATE)
```powershell
# Check if supabase.exe is blocked
Get-NetFirewallApplicationFilter | Where-Object {$_.Program -like "*supabase*"}

# Temporarily allow (for testing)
New-NetFirewallRule -DisplayName "Allow Supabase CLI" -Direction Outbound -Program "C:\Users\Proje\scoop\apps\supabase\current\supabase.exe" -Action Allow
```

### Solution 2: Check Supabase Network Restrictions
1. Go to: https://supabase.com/dashboard/project/lbtgmetmfkikrelbedou/settings/network-restrictions
2. Check if IP allowlist is enabled
3. Add current IP if needed

### Solution 3: Use Direct Connection String
Try using `psql` directly to test connection:
```powershell
$env:PGPASSWORD="Projectmorocco_2025"
psql -h aws-1-eu-west-1.pooler.supabase.com -p 6543 -U postgres.lbtgmetmfkikrelbedou -d postgres
```

### Solution 4: Check for Proxy Settings
```powershell
# Check if proxy is configured
netsh winhttp show proxy
```

## Next Steps

1. **Hassan:** Test Windows Firewall rules
2. **Nadia:** Check Supabase Dashboard for IP restrictions
3. **Maya:** Verify network proxy/VPN settings
4. **Team:** Coordinate findings and implement fix

## Workaround (Temporary)

Until CLI connection is fixed, migrations can be applied via:
- MCP Supabase tools (not preferred per user request)
- Direct SQL execution via Supabase Dashboard
- Manual `psql` connection if available

**⚠️ NOTE:** User explicitly requested CLI-only migration, so workarounds should be temporary.
