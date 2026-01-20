# Reset Test User Passwords via Supabase Admin API (PowerShell)
# 
# This script resets all test user passwords to: TestPassword123!
# 
# Usage:
#   1. Get your service role key from Supabase Dashboard → Settings → API → service_role key
#   2. Set it as an environment variable: $env:SUPABASE_SERVICE_ROLE_KEY="your-key"
#   3. Run: .\supabase\scripts\reset-test-user-passwords.ps1
# 
# Or set it inline:
#   $env:SUPABASE_SERVICE_ROLE_KEY="your-key"; .\supabase\scripts\reset-test-user-passwords.ps1

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
        name = "MOH Tier 1"
    },
    @{
        id = "00000000-0000-0000-0101-000000000002"
        email = "moh.tier2@moh.gov.ma"
        name = "MOH Tier 2"
    },
    @{
        id = "00000000-0000-0000-0201-000000000002"
        email = "admin@pharmaco-active.ma"
        name = "Company User - Active"
    },
    @{
        id = "00000000-0000-0000-0301-000000000002"
        email = "admin@pharmaco-empty.ma"
        name = "Company User - Empty"
    },
    @{
        id = "00000000-0000-0000-0101-000000000099"
        email = "vendor@pm-platform.ma"
        name = "Vendor"
    }
)

function Reset-UserPassword {
    param(
        [string]$UserId,
        [string]$Email,
        [string]$Name
    )
    
    $url = "$SUPABASE_URL/auth/v1/admin/users/$UserId"
    
    $body = @{
        password = $TEST_PASSWORD
        email_confirm = $true
    } | ConvertTo-Json
    
    $headers = @{
        "apikey" = $SUPABASE_SERVICE_ROLE_KEY
        "Authorization" = "Bearer $SUPABASE_SERVICE_ROLE_KEY"
        "Content-Type" = "application/json"
    }
    
    try {
        $response = Invoke-RestMethod -Uri $url -Method Put -Headers $headers -Body $body -ErrorAction Stop
        return @{ success = $true; data = $response }
    }
    catch {
        return @{ success = $false; error = $_.Exception.Message }
    }
}

Write-Host "🔐 Resetting test user passwords..." -ForegroundColor Cyan
Write-Host ""
Write-Host "📌 Supabase URL: $SUPABASE_URL"
Write-Host "🔑 Password: $TEST_PASSWORD"
Write-Host ""

$results = @()

foreach ($user in $TEST_USERS) {
    Write-Host "⏳ Resetting password for $($user.email)... " -NoNewline
    $result = Reset-UserPassword -UserId $user.id -Email $user.email -Name $user.name
    
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

Write-Host "   ✅ Successful: $successful/$($TEST_USERS.Count)" -ForegroundColor Green
Write-Host "   ❌ Failed: $failed/$($TEST_USERS.Count)" -ForegroundColor $(if ($failed -gt 0) { "Red" } else { "Green" })

if ($failed -gt 0) {
    Write-Host ""
    Write-Host "❌ Failed users:" -ForegroundColor Red
    $results | Where-Object { -not $_.success } | ForEach-Object {
        Write-Host "   - $($_.user.email): $($_.error)" -ForegroundColor Red
    }
    exit 1
}
else {
    Write-Host ""
    Write-Host "✅ All test user passwords have been reset successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📝 You can now log in with:" -ForegroundColor Cyan
    Write-Host "   Email: any of the test user emails"
    Write-Host "   Password: $TEST_PASSWORD"
}
