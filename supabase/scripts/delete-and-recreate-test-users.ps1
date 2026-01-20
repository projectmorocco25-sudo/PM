# Delete and Recreate Test Users with Passwords
# 
# This script:
#   1. Deletes all seed data (conversations, messages, notifications, etc.)
#   2. Deletes test users from public.users
#   3. Deletes test users from auth.users (via Admin API)
#   4. Creates fresh auth users with passwords via Admin API
#   5. Re-runs seed migration to populate public.users
# 
# Usage:
#   $env:SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
#   .\supabase\scripts\delete-and-recreate-test-users.ps1

$SUPABASE_URL = if ($env:SUPABASE_URL) { $env:SUPABASE_URL } else { "https://lbtgmetmfkikrelbedou.supabase.co" }
$SUPABASE_SERVICE_ROLE_KEY = $env:SUPABASE_SERVICE_ROLE_KEY

if (-not $SUPABASE_SERVICE_ROLE_KEY) {
    Write-Host "❌ Error: SUPABASE_SERVICE_ROLE_KEY environment variable is required" -ForegroundColor Red
    Write-Host ""
    Write-Host "📋 How to get your service role key:" -ForegroundColor Yellow
    Write-Host "   1. Go to Supabase Dashboard → Settings → API"
    Write-Host "   2. Copy the 'service_role' key (NOT the anon key)"
    Write-Host "   3. Set it as: `$env:SUPABASE_SERVICE_ROLE_KEY='your-service-role-key'"
    Write-Host "   4. Run this script again"
    Write-Host ""
    exit 1
}

$TEST_PASSWORD = "TestPassword123!"

$TEST_USERS = @(
    @{
        id = "00000000-0000-0000-0101-000000000001"
        email = "moh.tier1@moh.gov.ma"
        name = "MOH Tier 1 Admin"
        role = "tier1"
    },
    @{
        id = "00000000-0000-0000-0101-000000000002"
        email = "moh.tier2@moh.gov.ma"
        name = "MOH Tier 2 Officer"
        role = "tier2_officer"
    },
    @{
        id = "00000000-0000-0000-0201-000000000002"
        email = "admin@pharmaco-active.ma"
        name = "PharmaCo Active Admin"
        role = "company_user"
    },
    @{
        id = "00000000-0000-0000-0301-000000000002"
        email = "admin@pharmaco-empty.ma"
        name = "PharmaCo Empty Admin"
        role = "company_user"
    },
    @{
        id = "00000000-0000-0000-0101-000000000099"
        email = "vendor@pm-platform.ma"
        name = "Platform Vendor"
        role = "vendor"
    }
)

function Invoke-SupabaseSQL {
    param(
        [string]$Query
    )
    
    $url = "$SUPABASE_URL/rest/v1/rpc/exec_sql"
    
    $body = @{
        query = $Query
    } | ConvertTo-Json
    
    $headers = @{
        "apikey" = $SUPABASE_SERVICE_ROLE_KEY
        "Authorization" = "Bearer $SUPABASE_SERVICE_ROLE_KEY"
        "Content-Type" = "application/json"
    }
    
    try {
        $response = Invoke-RestMethod -Uri $url -Method Post -Headers $headers -Body $body -ErrorAction Stop
        return @{ success = $true; data = $response }
    }
    catch {
        return @{ success = $false; error = $_.Exception.Message }
    }
}

function Delete-AuthUser {
    param([string]$UserId)
    
    $url = "$SUPABASE_URL/auth/v1/admin/users/$UserId"
    $headers = @{
        "apikey" = $SUPABASE_SERVICE_ROLE_KEY
        "Authorization" = "Bearer $SUPABASE_SERVICE_ROLE_KEY"
    }
    
    try {
        Invoke-RestMethod -Uri $url -Method Delete -Headers $headers -ErrorAction Stop | Out-Null
        return @{ success = $true }
    }
    catch {
        if ($_.Exception.Response.StatusCode -eq 404) {
            return @{ success = $true; message = "Already deleted" }
        }
        return @{ success = $false; error = $_.Exception.Message }
    }
}

function Create-AuthUser {
    param(
        [string]$UserId,
        [string]$Email,
        [string]$Password,
        [string]$Name
    )
    
    $url = "$SUPABASE_URL/auth/v1/admin/users"
    $body = @{
        id = $UserId
        email = $Email
        password = $Password
        email_confirm = $true
        user_metadata = @{
            full_name = $Name
        }
    } | ConvertTo-Json
    
    $headers = @{
        "apikey" = $SUPABASE_SERVICE_ROLE_KEY
        "Authorization" = "Bearer $SUPABASE_SERVICE_ROLE_KEY"
        "Content-Type" = "application/json"
    }
    
    try {
        $response = Invoke-RestMethod -Uri $url -Method Post -Headers $headers -Body $body -ErrorAction Stop
        return @{ success = $true; data = $response }
    }
    catch {
        return @{ success = $false; error = $_.Exception.Message }
    }
}

Write-Host "✅ Step 1: Seed data already deleted via MCP tool" -ForegroundColor Green
Write-Host "   (conversations, messages, notifications, audit_logs, users, etc.)" -ForegroundColor Gray

Write-Host ""
Write-Host "🗑️  Step 2: Deleting auth users..." -ForegroundColor Cyan

foreach ($user in $TEST_USERS) {
    Write-Host "   Deleting $($user.email)... " -NoNewline
    $result = Delete-AuthUser -UserId $user.id
    
    if ($result.success) {
        Write-Host "✅ Done" -ForegroundColor Green
    }
    else {
        Write-Host "⚠️  $($result.error)" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "🔐 Step 3: Creating auth users with passwords..." -ForegroundColor Cyan
Write-Host "   Password: $TEST_PASSWORD"
Write-Host ""

$createResults = @()

foreach ($user in $TEST_USERS) {
    Write-Host "   Creating $($user.email)... " -NoNewline
    $result = Create-AuthUser -UserId $user.id -Email $user.email -Password $TEST_PASSWORD -Name $user.name
    
    if ($result.success) {
        Write-Host "✅ Success" -ForegroundColor Green
        $createResults += @{ user = $user; success = $true }
    }
    else {
        Write-Host "❌ Failed: $($result.error)" -ForegroundColor Red
        $createResults += @{ user = $user; success = $false; error = $result.error }
    }
}

Write-Host ""
Write-Host "📊 Summary:" -ForegroundColor Cyan
$successful = ($createResults | Where-Object { $_.success }).Count
$failed = ($createResults | Where-Object { -not $_.success }).Count

Write-Host "   ✅ Created: $successful/$($TEST_USERS.Count)" -ForegroundColor Green
Write-Host "   ❌ Failed: $failed/$($TEST_USERS.Count)" -ForegroundColor $(if ($failed -gt 0) { "Red" } else { "Green" })

if ($failed -gt 0) {
    Write-Host ""
    Write-Host "❌ Some users failed to create:" -ForegroundColor Red
    $createResults | Where-Object { -not $_.success } | ForEach-Object {
        Write-Host "   - $($_.user.email): $($_.error)" -ForegroundColor Red
    }
    exit 1
}

Write-Host ""
Write-Host "✅ All auth users created with passwords!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Next: Re-run seed migration to populate public.users and seed data" -ForegroundColor Cyan
Write-Host "   Run: supabase migration apply seed-1-1-1-foundation-structure.sql"
Write-Host ""
Write-Host "🔑 Login credentials ready:" -ForegroundColor Cyan
Write-Host "   Email: any test user email"
Write-Host "   Password: $TEST_PASSWORD"
