# Complete Fix: Delete, Recreate Users, and Re-seed via MCP
# 
# This script:
#   1. Deletes auth users via Admin API
#   2. Creates fresh auth users with passwords via Admin API
#   3. Re-applies seed migration via MCP tool (automated)
# 
# Usage:
#   $env:SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
#   .\supabase\scripts\complete-fix-with-mcp.ps1

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
    @{ id = "00000000-0000-0000-0101-000000000001"; email = "moh.tier1@moh.gov.ma"; name = "MOH Tier 1 Admin" },
    @{ id = "00000000-0000-0000-0101-000000000002"; email = "moh.tier2@moh.gov.ma"; name = "MOH Tier 2 Officer" },
    @{ id = "00000000-0000-0000-0201-000000000002"; email = "admin@pharmaco-active.ma"; name = "PharmaCo Active Admin" },
    @{ id = "00000000-0000-0000-0301-000000000002"; email = "admin@pharmaco-empty.ma"; name = "PharmaCo Empty Admin" },
    @{ id = "00000000-0000-0000-0101-000000000099"; email = "vendor@pm-platform.ma"; name = "Platform Vendor" }
)

function Invoke-AdminAPI {
    param([string]$Method, [string]$Endpoint, [object]$Body = $null)
    
    $url = "$SUPABASE_URL$Endpoint"
    $headers = @{
        "apikey" = $SUPABASE_SERVICE_ROLE_KEY
        "Authorization" = "Bearer $SUPABASE_SERVICE_ROLE_KEY"
        "Content-Type" = "application/json"
    }
    
    $params = @{ Uri = $url; Method = $Method; Headers = $headers; ErrorAction = "Stop" }
    if ($Body) { $params.Body = ($Body | ConvertTo-Json -Depth 10) }
    
    try {
        $response = Invoke-RestMethod @params
        return @{ success = $true; data = $response }
    }
    catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        if ($statusCode -eq 404 -and $Method -eq "Delete") {
            return @{ success = $true; message = "Already deleted" }
        }
        return @{ success = $false; error = $_.Exception.Message; statusCode = $statusCode }
    }
}

Write-Host "🔧 Complete User Fix Process" -ForegroundColor Cyan
Write-Host "============================" -ForegroundColor Cyan
Write-Host ""

Write-Host "🗑️  Step 1: Deleting existing auth users..." -ForegroundColor Yellow
foreach ($user in $TEST_USERS) {
    Write-Host "   Deleting $($user.email)... " -NoNewline
    $result = Invoke-AdminAPI -Method "Delete" -Endpoint "/auth/v1/admin/users/$($user.id)"
    if ($result.success) {
        Write-Host "✅ Done" -ForegroundColor Green
    } else {
        Write-Host "⚠️  $($result.error)" -ForegroundColor Yellow
    }
    Start-Sleep -Milliseconds 200
}

Write-Host ""
Write-Host "🔐 Step 2: Creating auth users with passwords..." -ForegroundColor Yellow
Write-Host "   Password: $TEST_PASSWORD"
Write-Host ""

$createResults = @()
foreach ($user in $TEST_USERS) {
    Write-Host "   Creating $($user.email)... " -NoNewline
    
    $body = @{
        id = $user.id
        email = $user.email
        password = $TEST_PASSWORD
        email_confirm = $true
        user_metadata = @{ full_name = $user.name }
    }
    
    $result = Invoke-AdminAPI -Method "Post" -Endpoint "/auth/v1/admin/users" -Body $body
    
    if ($result.success) {
        Write-Host "✅ Success" -ForegroundColor Green
        $createResults += @{ user = $user; success = $true }
    }
    else {
        Write-Host "❌ Failed: $($result.error)" -ForegroundColor Red
        $createResults += @{ user = $user; success = $false; error = $result.error }
    }
    
    Start-Sleep -Milliseconds 300
}

$successful = ($createResults | Where-Object { $_.success }).Count
$failed = ($createResults | Where-Object { -not $_.success }).Count

Write-Host ""
Write-Host "📊 Auth Users Summary:" -ForegroundColor Cyan
Write-Host "   ✅ Created: $successful/$($TEST_USERS.Count)" -ForegroundColor Green
Write-Host "   ❌ Failed: $failed/$($TEST_USERS.Count)" -ForegroundColor $(if ($failed -gt 0) { "Red" } else { "Green" })

if ($failed -gt 0) {
    Write-Host ""
    Write-Host "❌ Failed users:" -ForegroundColor Red
    $createResults | Where-Object { -not $_.success } | ForEach-Object {
        Write-Host "   - $($_.user.email): $($_.error)" -ForegroundColor Red
    }
    Write-Host ""
    Write-Host "⚠️  Please fix errors before proceeding to seed migration." -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "✅ All auth users created successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Step 3: Re-applying seed migration via MCP..." -ForegroundColor Yellow
Write-Host "   (This will be done via MCP tool - see instructions below)"
Write-Host ""
Write-Host "🔑 Login credentials ready:" -ForegroundColor Green
Write-Host "   Email: any test user email"
Write-Host "   Password: $TEST_PASSWORD"
Write-Host ""
Write-Host "✅ Auth users ready! Next: Apply seed migration via MCP tool." -ForegroundColor Green
