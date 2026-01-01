# Deployment Architecture - Pharmaceutical Governance Value Chain Platform (PM)

**Purpose:** This document describes the deployment architecture, environment strategy, and deployment processes for the PM platform.

**Last Updated:** 2025-12-31  
**Status:** ✅ Complete (Phase 0, Week 1)  
**Owner:** Oliver

## Overview

The PM platform uses a three-environment deployment strategy with separate Supabase projects per environment and Vercel for frontend deployment.

## Environment Strategy

### Three-Environment Approach

```
Development (Dev)
  │
  │ Local development
  │ Active feature work
  │
  └─→ Staging
        │
        │ Integration testing
        │ UAT preparation
        │ Demo environment
        │
        └─→ Production (Prod)
              │
              │ Live system
              │ Real users
              │ Real data
```

### Environment Details

**Development (Dev):**
- **Supabase:** Local Supabase CLI + Docker (optional)
- **Frontend:** Local Next.js dev server (`npm run dev`)
- **Database:** Local PostgreSQL via Supabase CLI
- **Purpose:** Active development, feature work, local testing
- **Access:** Developers only

**Staging:**
- **Supabase:** Separate Supabase project (`pm-staging`)
- **Frontend:** Vercel staging branch deployment
- **Database:** Supabase Cloud (staging project)
- **Purpose:** Integration testing, UAT preparation, demo environment
- **Access:** Development team, QA team, stakeholders

**Production (Prod):**
- **Supabase:** Separate Supabase project (`pm-prod`)
- **Frontend:** Vercel main branch deployment
- **Database:** Supabase Cloud (production project)
- **Purpose:** Live system, real users, real data
- **Access:** End users (companies, MOH), support team

## Deployment Architecture

### Frontend Deployment (Vercel)

**Platform:** Vercel

**Deployment Strategy:**
```
Git Repository
  │
  ├─→ main branch
  │     │
  │     └─→ Vercel Production
  │           - Automatic deployment
  │           - Production URL
  │
  ├─→ staging branch
  │     │
  │     └─→ Vercel Staging
  │           - Automatic deployment
  │           - Staging URL
  │
  └─→ feature branches
        │
        └─→ Vercel Preview
              - Preview deployments for PRs
              - Temporary URLs
```

**Vercel Configuration:**
- Automatic deployments from Git
- Environment variables per environment
- Build settings configured for Next.js
- Preview deployments for pull requests

### Backend Deployment (Supabase)

**Platform:** Supabase Cloud

**Project Structure:**
- **Development:** Local Supabase CLI (or `pm-dev` project)
- **Staging:** `pm-staging` Supabase project
- **Production:** `pm-prod` Supabase project

**Database Migrations:**
- Migrations stored in `supabase/migrations/` directory
- Applied via Supabase CLI or Supabase Dashboard
- Versioned and tracked in Git

**Edge Functions:**
- Deployed via Supabase CLI: `supabase functions deploy`
- Each function deployed independently
- Environment variables configured per function

**Scheduled Triggers:**
- Configured via Supabase Dashboard or SQL migrations
- pg_cron jobs configured per environment
- Different schedules per environment (if needed)

## Environment Configuration

### Environment Variables

**Frontend (Vercel):**
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anon key
- `NEXT_PUBLIC_APP_ENV` - Environment identifier (dev/staging/prod)
- Feature flags and configuration

**Backend (Supabase):**
- Edge Function environment variables
- Database configuration
- External service API keys (email, etc.)

**Per-Environment Configuration:**
- Different Supabase project URLs per environment
- Different API keys per environment
- Different feature flags per environment
- Different external service configurations

## Deployment Process

### Development Workflow

1. **Feature Development:**
   - Create feature branch from `develop` or `main`
   - Develop locally with Supabase CLI
   - Test locally

2. **Pull Request:**
   - Create PR to `staging` or `main`
   - Vercel creates preview deployment
   - Review and test in preview environment

3. **Merge to Staging:**
   - Merge PR to `staging` branch
   - Vercel automatically deploys to staging
   - Run integration tests in staging

4. **Merge to Production:**
   - Merge `staging` to `main` branch
   - Vercel automatically deploys to production
   - Monitor deployment

### Database Migration Process

1. **Create Migration:**
   - Create migration file: `supabase/migrations/YYYYMMDDHHMMSS_migration_name.sql`
   - Test migration locally

2. **Apply to Staging:**
   - Apply migration to staging Supabase project
   - Verify migration success
   - Test application with new schema

3. **Apply to Production:**
   - Apply migration to production Supabase project
   - Monitor for issues
   - Rollback plan ready if needed

### Edge Function Deployment

1. **Develop Function:**
   - Develop Edge Function locally
   - Test with Supabase CLI

2. **Deploy to Staging:**
   - Deploy: `supabase functions deploy {function-name} --project-ref {staging-ref}`
   - Test in staging environment

3. **Deploy to Production:**
   - Deploy: `supabase functions deploy {function-name} --project-ref {prod-ref}`
   - Monitor function logs

## CI/CD Pipeline

### Pipeline Stages

**Stage 1: Lint**
- Run ESLint on frontend code
- Run SQL linting on migrations
- Fail build if linting errors

**Stage 2: Test**
- Run unit tests
- Run integration tests (if applicable)
- Fail build if tests fail

**Stage 3: Build**
- Build Next.js application
- Verify build success
- Fail build if build errors

**Stage 4: Deploy**
- Deploy to appropriate environment
- Run smoke tests
- Notify team of deployment status

### Deployment Triggers

- **Push to main:** Deploy to production
- **Push to staging:** Deploy to staging
- **Pull Request:** Create preview deployment
- **Manual:** Manual deployment option available

## Rollback Strategy

### Frontend Rollback

- **Vercel:** Previous deployment can be promoted
- **Instant rollback:** Promote previous successful deployment
- **No downtime:** Seamless rollback process

### Database Rollback

- **Migration rollback:** Create reverse migration
- **Backup restore:** Restore from backup if needed
- **Careful process:** Database rollbacks require careful planning

### Edge Function Rollback

- **Previous version:** Deploy previous version of function
- **Quick rollback:** Functions can be rolled back quickly

## Monitoring & Observability

### Frontend Monitoring

- **Vercel Analytics:** Built-in analytics and monitoring
- **Error tracking:** Error logs and tracking
- **Performance monitoring:** Response times and performance metrics

### Backend Monitoring

- **Supabase Dashboard:** Built-in monitoring and logs
- **Database monitoring:** Query performance, connection pool
- **Edge Function logs:** Function execution logs
- **Scheduled job logs:** pg_cron job execution logs

### External Monitoring (Future)

- **Application Performance Monitoring (APM):** To be determined
- **Error tracking service:** To be determined
- **Uptime monitoring:** To be determined

## Security Considerations

### Environment Isolation

- **Complete isolation:** Separate Supabase projects per environment
- **No data leakage:** Production data never in staging/dev
- **Separate credentials:** Different API keys per environment

### Access Control

- **Production access:** Limited to authorized personnel
- **Staging access:** Development team and QA
- **Development access:** Development team only

### Secrets Management

- **Environment variables:** Stored in Vercel and Supabase
- **API keys:** Rotated regularly
- **Database credentials:** Managed by Supabase
- **External service keys:** Stored securely per environment

## Backup & Disaster Recovery

### Database Backups

- **Supabase backups:** Automatic daily backups
- **Backup retention:** Configurable retention period
- **Point-in-time recovery:** Available via Supabase

### Disaster Recovery Plan

- **Backup restoration:** Restore from Supabase backups
- **Infrastructure recovery:** Supabase handles infrastructure
- **Recovery time objective (RTO):** To be determined
- **Recovery point objective (RPO):** To be determined

## Performance & Scalability

### Frontend Scalability

- **Vercel:** Automatic scaling
- **Edge network:** Global CDN for fast delivery
- **No infrastructure management:** Vercel handles scaling

### Backend Scalability

- **Supabase:** Scales with plan
- **Database:** PostgreSQL scaling via Supabase
- **Edge Functions:** Auto-scaling
- **Connection pooling:** Handled by Supabase

## Related Documents

- [System Architecture](system-architecture.md)
- [Infrastructure Documentation](../../08-deployment/infrastructure.md) - Detailed infrastructure (Week 4)
- [Development Environment Setup](../../06-development/development-setup.md) - Setup guide (Week 4)
- [Technical Decision Log](../../06-development/technical-decisions/decision-log.md)
- [Project Plan](../../05-project-management/project-plan.md)

---

**Next Review Date:** [To be scheduled]  
**Owner:** Oliver (Chief Architect)

