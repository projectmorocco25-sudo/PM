# PowerShell Script to Apply All Supabase Migrations via CLI
# Pharmaceutical Governance Value Chain Platform (PM)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Supabase Migration Application (CLI)" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$projectRef = "lbtgmetmfkikrelbedou"
$migrationsPath = "supabase/migrations"

# Check if Supabase CLI is installed
Write-Host "Checking Supabase CLI..." -ForegroundColor Yellow
$supabaseVersion = supabase --version 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Supabase CLI is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install Supabase CLI: https://supabase.com/docs/guides/cli/getting-started" -ForegroundColor Yellow
    exit 1
}
Write-Host "✓ Supabase CLI found" -ForegroundColor Green
Write-Host ""

# Count migration files
$migrationFiles = Get-ChildItem -Path $migrationsPath -Filter "*.sql" | Sort-Object Name
$migrationCount = $migrationFiles.Count
Write-Host "Found $migrationCount migration files:" -ForegroundColor Green
$migrationFiles | ForEach-Object { Write-Host "  - $($_.Name)" -ForegroundColor Gray }
Write-Host ""

# Step 1: Link to project
Write-Host "Step 1: Linking to Supabase project..." -ForegroundColor Yellow
Write-Host "Project Ref: $projectRef" -ForegroundColor Cyan
Write-Host ""

# Check if already linked (skip check if .env.local has issues)
$isLinked = $false
try {
    $linkCheck = supabase status 2>&1 | Out-String
    if ($LASTEXITCODE -eq 0 -and $linkCheck -match "project_id") {
        Write-Host "✓ Project is already linked" -ForegroundColor Green
        $isLinked = $true
    }
} catch {
    # Ignore errors - will attempt to link
}

if ($isLinked -eq $false) {
    Write-Host "Project needs to be linked." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "To get your database password:" -ForegroundColor Cyan
    Write-Host "  1. Go to: https://supabase.com/dashboard/project/$projectRef/settings/database" -ForegroundColor White
    Write-Host "  2. Find 'Database Password' section" -ForegroundColor White
    Write-Host "  3. Copy the password (or reset it if needed)" -ForegroundColor White
    Write-Host ""
    
    $dbPassword = Read-Host "Enter your database password" -AsSecureString
    $passwordPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($dbPassword))
    
    Write-Host ""
    Write-Host "Linking to project..." -ForegroundColor Yellow
    supabase link --project-ref $projectRef -p $passwordPlain
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Project linked successfully" -ForegroundColor Green
    } else {
        Write-Host "✗ Failed to link project" -ForegroundColor Red
        Write-Host "Error details above. Please check and try again." -ForegroundColor Yellow
        exit 1
    }
}
Write-Host ""

# Step 2: Push migrations
Write-Host "Step 2: Pushing all migrations to remote database..." -ForegroundColor Yellow
Write-Host ""

# Dry run first to preview
Write-Host "Running dry-run to preview changes..." -ForegroundColor Cyan
supabase db push --dry-run
Write-Host ""

$confirm = Read-Host "Do you want to apply these migrations? (Y/N)"
if ($confirm -eq "Y" -or $confirm -eq "y") {
    Write-Host ""
    Write-Host "Applying migrations..." -ForegroundColor Yellow
    supabase db push --linked --yes
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "✓ All migrations applied successfully!" -ForegroundColor Green
    } else {
        Write-Host ""
        Write-Host "✗ Failed to apply migrations" -ForegroundColor Red
        Write-Host "Check the error messages above for details." -ForegroundColor Yellow
        exit 1
    }
} else {
    Write-Host "Migration application cancelled." -ForegroundColor Yellow
    exit 0
}

# Step 3: Verify migrations
Write-Host ""
Write-Host "Step 3: Verifying applied migrations..." -ForegroundColor Yellow
Write-Host ""
supabase migration list

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Migration Application Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. Verify all tables exist in Supabase Dashboard" -ForegroundColor White
Write-Host "  2. Verify RPC functions are created" -ForegroundColor White
Write-Host "  3. Verify RLS policies are enabled" -ForegroundColor White
Write-Host "  4. Test frontend pages to ensure database connectivity" -ForegroundColor White
Write-Host ""
