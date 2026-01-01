# CI/CD Pipeline Configuration - Pharmaceutical Governance Value Chain Platform (PM)

**Purpose:** This document defines the CI/CD pipeline configuration for automated testing, building, and deployment.

**Last Updated:** 2025-12-31  
**Status:** ✅ Complete (Phase 0, Week 4)  
**Owner:** Leila

## Overview

The PM platform uses a CI/CD pipeline to automate testing, building, and deployment across development, staging, and production environments.

## CI/CD Architecture

### Pipeline Stages

1. **Lint** - Code linting and formatting checks
2. **Test** - Unit tests, integration tests, E2E tests
3. **Build** - Build application for production
4. **Deploy** - Deploy to appropriate environment

### Deployment Environments

- **Development** - Local development (manual)
- **Staging** - Automatic deployment from `staging` branch
- **Production** - Automatic deployment from `main` branch (with approval)

---

## GitHub Actions Configuration

### Workflow File: `.github/workflows/ci-cd.yml`

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, staging, develop]
  pull_request:
    branches: [main, staging]

jobs:
  lint:
    name: Lint Code
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run ESLint
        run: npm run lint
      
      - name: Check formatting
        run: npm run format:check

  test:
    name: Run Tests
    runs-on: ubuntu-latest
    needs: lint
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run unit tests
        run: npm test -- --coverage
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info

  build:
    name: Build Application
    runs-on: ubuntu-latest
    needs: test
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build application
        run: npm run build
        env:
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_ANON_KEY }}
      
      - name: Upload build artifacts
        uses: actions/upload-artifact@v3
        with:
          name: build
          path: .next

  deploy-staging:
    name: Deploy to Staging
    runs-on: ubuntu-latest
    needs: build
    if: github.ref == 'refs/heads/staging'
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Vercel (Staging)
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID_STAGING }}
          vercel-args: '--prod'
          scope: ${{ secrets.VERCEL_ORG_ID }}

  deploy-production:
    name: Deploy to Production
    runs-on: ubuntu-latest
    needs: build
    if: github.ref == 'refs/heads/main'
    environment:
      name: production
      url: https://pm-prod.vercel.app
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Vercel (Production)
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID_PROD }}
          vercel-args: '--prod'
          scope: ${{ secrets.VERCEL_ORG_ID }}
```

---

## Database Migration Pipeline

### Migration Workflow

**File:** `.github/workflows/migrations.yml`

```yaml
name: Database Migrations

on:
  push:
    branches: [main, staging]
    paths:
      - 'supabase/migrations/**'

jobs:
  migrate-staging:
    name: Apply Migrations to Staging
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/staging'
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Supabase CLI
        uses: supabase/setup-cli@v1
        with:
          version: latest
      
      - name: Link to Staging Project
        run: |
          supabase link --project-ref ${{ secrets.SUPABASE_PROJECT_REF_STAGING }}
        env:
            SUPABASE_ACCESS_TOKEN: ${{ secrets.SUPABASE_ACCESS_TOKEN }}
      
      - name: Apply Migrations
        run: supabase db push
        env:
          SUPABASE_ACCESS_TOKEN: ${{ secrets.SUPABASE_ACCESS_TOKEN }}

  migrate-production:
    name: Apply Migrations to Production
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    environment:
      name: production
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Supabase CLI
        uses: supabase/setup-cli@v1
        with:
          version: latest
      
      - name: Link to Production Project
        run: |
          supabase link --project-ref ${{ secrets.SUPABASE_PROJECT_REF_PROD }}
        env:
          SUPABASE_ACCESS_TOKEN: ${{ secrets.SUPABASE_ACCESS_TOKEN }}
      
      - name: Apply Migrations
        run: supabase db push
        env:
          SUPABASE_ACCESS_TOKEN: ${{ secrets.SUPABASE_ACCESS_TOKEN }}
```

---

## Edge Functions Deployment

### Edge Functions Workflow

**File:** `.github/workflows/edge-functions.yml`

```yaml
name: Deploy Edge Functions

on:
  push:
    branches: [main, staging]
    paths:
      - 'supabase/functions/**'

jobs:
  deploy-staging:
    name: Deploy Edge Functions to Staging
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/staging'
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Supabase CLI
        uses: supabase/setup-cli@v1
        with:
          version: latest
      
      - name: Deploy Edge Functions
        run: |
          for func in supabase/functions/*/; do
            func_name=$(basename $func)
            supabase functions deploy $func_name --project-ref ${{ secrets.SUPABASE_PROJECT_REF_STAGING }}
          done
        env:
          SUPABASE_ACCESS_TOKEN: ${{ secrets.SUPABASE_ACCESS_TOKEN }}

  deploy-production:
    name: Deploy Edge Functions to Production
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    environment:
      name: production
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Supabase CLI
        uses: supabase/setup-cli@v1
        with:
          version: latest
      
      - name: Deploy Edge Functions
        run: |
          for func in supabase/functions/*/; do
            func_name=$(basename $func)
            supabase functions deploy $func_name --project-ref ${{ secrets.SUPABASE_PROJECT_REF_PROD }}
          done
        env:
          SUPABASE_ACCESS_TOKEN: ${{ secrets.SUPABASE_ACCESS_TOKEN }}
```

---

## Required Secrets

### GitHub Secrets

**Vercel:**
- `VERCEL_TOKEN` - Vercel API token
- `VERCEL_ORG_ID` - Vercel organization ID
- `VERCEL_PROJECT_ID_STAGING` - Staging project ID
- `VERCEL_PROJECT_ID_PROD` - Production project ID

**Supabase:**
- `SUPABASE_ACCESS_TOKEN` - Supabase access token
- `SUPABASE_PROJECT_REF_STAGING` - Staging project reference
- `SUPABASE_PROJECT_REF_PROD` - Production project reference
- `SUPABASE_URL` - Supabase URL (for build)
- `SUPABASE_ANON_KEY` - Supabase anon key (for build)

---

## Branch Strategy

### Branch Workflow

```
feature/feature-name
  │
  │ Development
  │
  └─→ develop
        │
        │ Integration testing
        │
        └─→ staging
              │
              │ UAT and staging testing
              │
              └─→ main
                    │
                    │ Production
```

### Branch Protection Rules

**Main Branch:**
- Require pull request reviews (2 approvals)
- Require status checks to pass
- Require branches to be up to date
- No force pushes
- No deletion

**Staging Branch:**
- Require pull request reviews (1 approval)
- Require status checks to pass
- No force pushes

---

## Deployment Process

### Staging Deployment

1. **Merge to Staging:**
   - Create PR from `develop` to `staging`
   - Review and approve
   - Merge PR

2. **Automatic Deployment:**
   - CI/CD pipeline triggers
   - Lint → Test → Build → Deploy
   - Database migrations applied (if any)
   - Edge Functions deployed (if any)
   - Frontend deployed to Vercel staging

3. **Verification:**
   - Smoke tests run
   - Manual verification
   - UAT testing

### Production Deployment

1. **Merge to Main:**
   - Create PR from `staging` to `main`
   - Review and approve (2 approvals required)
   - Merge PR

2. **Automatic Deployment:**
   - CI/CD pipeline triggers
   - Lint → Test → Build → Deploy
   - Database migrations applied (if any)
   - Edge Functions deployed (if any)
   - Frontend deployed to Vercel production

3. **Verification:**
   - Smoke tests run
   - Monitor for errors
   - Rollback plan ready

---

## Rollback Process

### Frontend Rollback

**Vercel:**
1. Go to Vercel Dashboard
2. Select deployment
3. Promote previous deployment
4. Verify rollback success

### Database Rollback

1. Create reverse migration
2. Test reverse migration locally
3. Apply reverse migration to staging
4. Verify rollback success
5. Apply reverse migration to production

### Edge Functions Rollback

1. Deploy previous version:
   ```bash
   supabase functions deploy {function_name} --project-ref {ref} --version {previous_version}
   ```

---

## Monitoring & Alerts

### Pipeline Monitoring

- **GitHub Actions:** Built-in monitoring
- **Status Badges:** Display pipeline status in README
- **Notifications:** Email/Slack notifications on failure

### Deployment Monitoring

- **Vercel:** Built-in deployment monitoring
- **Supabase:** Built-in function monitoring
- **Application:** Application performance monitoring (to be configured)

---

## Related Documents

- [Deployment Architecture](../../02-architecture/deployment-architecture.md)
- [Development Environment Setup](../../06-development/development-setup.md)
- [Testing Framework](testing-framework.md)
- [Infrastructure Documentation](infrastructure.md)

---

**Next Review Date:** [To be scheduled]  
**Owner:** Leila

