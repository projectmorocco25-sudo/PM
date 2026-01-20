# Complete User Recreation Script
# 
# This script:
#   1. Deletes auth users via Admin API
#   2. Creates fresh auth users with passwords via Admin API
#   3. Re-runs seed migration via MCP (you'll need to do this manually or via script)
# 
# Usage:
#   $env:SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
#   .\supabase\scripts\recreate-users-complete.ps1

$SUPABASE_URL = "https://lbtgmetmfkikrelbedou.supabase.co"
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
    },
    @{
        id = "00000000-0000-0000-0101-000000000002"
        email = "moh.tier2@moh.gov.ma"
        name = "MOH Tier 2 Officer"
    },
    @{
        id = "00000000-0000-0000-0201-000000000002"
        email = "admin@pharmaco-active.ma"
        name = "PharmaCo Active Admin"
    },
    @{
        id = "00000000-0000-0000-0301-000000000002"
        email = "admin@pharmaco-empty.ma"
        name = "PharmaCo Empty Admin"
    },
    @{
        id = "00000000-0000-0000-0101-000000000099"
        email = "vendor@pm-platform.ma"
        name = "Platform Vendor"
    }
)

Write-Host "🗑️  Step 1: Deleting existing auth users..." -ForegroundColor Cyan
Write-Host ""

foreach ($user in $TEST_USERS) {
    Write-Host "   Deleting $($user.email)... " -NoNewline
    
    $url = "$SUPABASE_URL/auth/v1/admin/users/$($user.id)"
    $headers = @{
        "apikey" = $SUPABASE_SERVICE_ROLE_KEY
        "Authorization" = "Bearer $SUPABASE_SERVICE_ROLE_KEY"
    }
    
    try {
        Invoke-RestMethod -Uri $url -Method Delete -Headers $headers -ErrorAction Stop | Out-Null
        Write-Host "✅ Done" -ForegroundColor Green
    }
    catch {
        if ($_.Exception.Response.StatusCode -eq 404) {
            Write-Host "✅ Already deleted" -ForegroundColor Green
        }
        else {
            Write-Host "⚠️  $($_.Exception.Message)" -ForegroundColor Yellow
        }
    }
}

Write-Host ""
Write-Host "🔐 Step 2: Creating auth users with passwords..." -ForegroundColor Cyan
Write-Host "   Password: $TEST_PASSWORD"
Write-Host ""

$results = @()

foreach ($user in $TEST_USERS) {
    Write-Host "   Creating $($user.email)... " -NoNewline
    
    $url = "$SUPABASE_URL/auth/v1/admin/users"
    $body = @{
        id = $user.id
        email = $user.email
        password = $TEST_PASSWORD
        email_confirm = $true
        user_metadata = @{
            full_name = $user.name
        }
    } | ConvertTo-Json
    
    $headers = @{
        "apikey" = $SUPABASE_SERVICE_ROLE_KEY
        "Authorization" = "Bearer $SUPABASE_SERVICE_ROLE_KEY"
        "Content-Type" = "application/json"
    }
    
    try {
        $response = Invoke-RestMethod -Uri $url -Method Post -Headers $headers -Body $body -ErrorAction Stop
        Write-Host "✅ Success" -ForegroundColor Green
        $results += @{ user = $user; success = $true }
    }
    catch {
        Write-Host "❌ Failed: $($_.Exception.Message)" -ForegroundColor Red
        $results += @{ user = $user; success = $false; error = $_.Exception.Message }
    }
}

Write-Host ""
Write-Host "📊 Summary:" -ForegroundColor Cyan
$successful = ($results | Where-Object { $_.success }).Count
$failed = ($results | Where-Object { -not $_.success }).Count

Write-Host "   ✅ Created: $successful/$($TEST_USERS.Count)" -ForegroundColor Green
Write-Host "   ❌ Failed: $failed/$($TEST_USERS.Count)" -ForegroundColor $(if ($failed -gt 0) { "Red" } else { "Green" })

if ($failed -gt 0) {
    Write-Host ""
    Write-Host "❌ Failed users:" -ForegroundColor Red
    $results | Where-Object { -not $_.success } | ForEach-Object {
        Write-Host "   - $($_.user.email): $($_.error)" -ForegroundColor Red
    }
    exit 1
}

Write-Host ""
Write-Host "✅ All auth users created with passwords!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Next: Re-run seed migration to populate public.users and seed data" -ForegroundColor Cyan
Write-Host "   The seed migration will be applied via MCP tool"
Write-Host ""
Write-Host "🔑 Login credentials:" -ForegroundColor Cyan
Write-Host "   Email: any test user email"
Write-Host "   Password: $TEST_PASSWORD"
