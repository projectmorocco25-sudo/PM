# Recreate Test Users with Passwords via Supabase Admin API
# 
# This script:
#   1. Deletes all test users from auth.users and public.users
#   2. Creates them fresh with passwords set to: TestPassword123!
#   3. Re-seeds public.users data
# 
# Usage:
#   1. Get your service role key from Supabase Dashboard → Settings → API → service_role key
#   2. Set it: $env:SUPABASE_SERVICE_ROLE_KEY="your-key"
#   3. Run: .\supabase\scripts\recreate-test-users-with-passwords.ps1

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
        company_id = $null
    },
    @{
        id = "00000000-0000-0000-0101-000000000002"
        email = "moh.tier2@moh.gov.ma"
        name = "MOH Tier 2 Officer"
        role = "tier2_officer"
        company_id = $null
    },
    @{
        id = "00000000-0000-0000-0201-000000000002"
        email = "admin@pharmaco-active.ma"
        name = "PharmaCo Active Admin"
        role = "company_user"
        company_id = "00000000-0000-0000-0201-000000000001"
    },
    @{
        id = "00000000-0000-0000-0301-000000000002"
        email = "admin@pharmaco-empty.ma"
        name = "PharmaCo Empty Admin"
        role = "company_user"
        company_id = "00000000-0000-0000-0301-000000000001"
    },
    @{
        id = "00000000-0000-0000-0101-000000000099"
        email = "vendor@pm-platform.ma"
        name = "Platform Vendor"
        role = "vendor"
        company_id = $null
    }
)

function Delete-User {
    param(
        [string]$UserId
    )
    
    $url = "$SUPABASE_URL/auth/v1/admin/users/$UserId"
    
    $headers = @{
        "apikey" = $SUPABASE_SERVICE_ROLE_KEY
        "Authorization" = "Bearer $SUPABASE_SERVICE_ROLE_KEY"
    }
    
    try {
        $response = Invoke-RestMethod -Uri $url -Method Delete -Headers $headers -ErrorAction Stop
        return @{ success = $true }
    }
    catch {
        # User might not exist, which is okay
        if ($_.Exception.Response.StatusCode -eq 404) {
            return @{ success = $true; message = "User not found (already deleted)" }
        }
        return @{ success = $false; error = $_.Exception.Message }
    }
}

function Create-User {
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

Write-Host "🗑️  Step 1: Deleting existing test users..." -ForegroundColor Cyan
Write-Host ""

foreach ($user in $TEST_USERS) {
    Write-Host "   Deleting $($user.email)... " -NoNewline
    $result = Delete-User -UserId $user.id
    
    if ($result.success) {
        Write-Host "✅ Done" -ForegroundColor Green
    }
    else {
        Write-Host "⚠️  $($result.error)" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "🔐 Step 2: Creating test users with passwords..." -ForegroundColor Cyan
Write-Host ""
Write-Host "📌 Supabase URL: $SUPABASE_URL"
Write-Host "🔑 Password: $TEST_PASSWORD"
Write-Host ""

$results = @()

foreach ($user in $TEST_USERS) {
    Write-Host "⏳ Creating $($user.email)... " -NoNewline
    $result = Create-User -UserId $user.id -Email $user.email -Password $TEST_PASSWORD -Name $user.name
    
    if ($result.success) {
        Write-Host "✅ Success" -ForegroundColor Green
        $results += @{ user = $user; success = $true }
    }
    else {
        Write-Host "❌ Failed: $($result.error)" -ForegroundColor Red
        $results += @{ user = $user; success = $false; error = $result.error }
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
    Write-Host ""
    Write-Host "⚠️  Some users failed to create. Please check the errors above." -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "✅ All test users created successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Next step: Re-run the seed migration to populate public.users:" -ForegroundColor Cyan
Write-Host "   The seed migration will insert user records into public.users"
Write-Host "   Run: supabase migration apply seed-1-1-1-foundation-structure.sql"
Write-Host ""
Write-Host "🔑 Login credentials:" -ForegroundColor Cyan
Write-Host "   Email: any of the test user emails"
Write-Host "   Password: $TEST_PASSWORD"
