# Update Test User Passwords
$SUPABASE_URL = "https://lbtgmetmfkikrelbedou.supabase.co"
$SUPABASE_SERVICE_ROLE_KEY = $env:SUPABASE_SERVICE_ROLE_KEY

if (-not $SUPABASE_SERVICE_ROLE_KEY) {
    Write-Host "Error: SUPABASE_SERVICE_ROLE_KEY required" -ForegroundColor Red
    exit 1
}

$TEST_PASSWORD = "TestPassword123!"

$TEST_USERS = @(
    @{ id = "00000000-0000-0000-0101-000000000001"; email = "moh.tier1@moh.gov.ma" },
    @{ id = "00000000-0000-0000-0101-000000000002"; email = "moh.tier2@moh.gov.ma" },
    @{ id = "00000000-0000-0000-0201-000000000002"; email = "admin@pharmaco-active.ma" },
    @{ id = "00000000-0000-0000-0301-000000000002"; email = "admin@pharmaco-empty.ma" },
    @{ id = "00000000-0000-0000-0101-000000000099"; email = "vendor@pm-platform.ma" }
)

Write-Host "Updating passwords for test users..." -ForegroundColor Yellow
Write-Host "Password: $TEST_PASSWORD"
Write-Host ""

$results = @()
foreach ($user in $TEST_USERS) {
    Write-Host "Updating $($user.email)..." -NoNewline
    
    $url = "$SUPABASE_URL/auth/v1/admin/users/$($user.id)"
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
        Write-Host " Success" -ForegroundColor Green
        $results += @{ user = $user; success = $true }
    }
    catch {
        Write-Host " Failed: $($_.Exception.Message)" -ForegroundColor Red
        $results += @{ user = $user; success = $false; error = $_.Exception.Message }
    }
    
    Start-Sleep -Milliseconds 300
}

$successful = ($results | Where-Object { $_.success }).Count
$failed = ($results | Where-Object { -not $_.success }).Count

Write-Host ""
Write-Host "Summary:" -ForegroundColor Cyan
Write-Host "Updated: $successful/$($TEST_USERS.Count)" -ForegroundColor Green
Write-Host "Failed: $failed/$($TEST_USERS.Count)" -ForegroundColor $(if ($failed -gt 0) { "Red" } else { "Green" })

if ($failed -gt 0) {
    Write-Host ""
    Write-Host "Failed users:" -ForegroundColor Red
    $results | Where-Object { -not $_.success } | ForEach-Object {
        Write-Host "- $($_.user.email): $($_.error)" -ForegroundColor Red
    }
    exit 1
}

Write-Host ""
Write-Host "All passwords updated successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Login credentials:" -ForegroundColor Cyan
Write-Host "Email: any test user email"
Write-Host "Password: $TEST_PASSWORD"
