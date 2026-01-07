# System Architecture - Pharmaceutical Governance Value Chain Platform (PM)

**Purpose:** This document describes the overall system architecture for the PM platform.

**Last Updated:** 2025-12-31  
**Status:** ✅ Complete (Phase 0, Week 1)  
**Owner:** Oliver (Chief Architect)

## Overview

The Pharmaceutical Governance Value Chain Platform (PM) is a modular, secure digital portal built on Supabase and Next.js. The platform enables Industrial Pharmaceutical Companies (IPCs) and wholesalers to meet their reporting obligations while providing the Ministry of Health (MOH) with real-time visibility into stock sufficiency, compliance, and export activities.

**Platform Stack (Locked):**
- **Backend:** Supabase (PostgreSQL, Auth, Storage, Edge Functions, Scheduled Triggers)
- **Frontend:** Next.js 13+ (React) with Supabase client libraries
- **Deployment:** Vercel (frontend), Supabase Cloud (backend)

## High-Level Architecture

### System Layers

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend Layer                       │
│              Next.js (React) Application                │
│  - Tailwind CSS + shadcn/ui components                  │
│  - TanStack Query for server state                      │
│  - React Hook Form + Zod for forms                      │
└─────────────────────────────────────────────────────────┘
                          │
                          │ Supabase Client
                          │
┌─────────────────────────────────────────────────────────┐
│                    Backend Layer                         │
│                    Supabase Platform                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │ PostgreSQL   │  │   Auth       │  │   Storage    │ │
│  │  Database    │  │              │  │              │ │
│  │  + RLS       │  │              │  │              │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
│  ┌──────────────┐  ┌──────────────┐                    │
│  │ Edge         │  │  Scheduled   │                    │
│  │ Functions    │  │  Triggers    │                    │
│  │              │  │  (pg_cron)   │                    │
│  └──────────────┘  └──────────────┘                    │
└─────────────────────────────────────────────────────────┘
                          │
                          │ External APIs
                          │
┌─────────────────────────────────────────────────────────┐
│              External Systems                           │
│  - ERP Systems (data submission)                        │
│  - Customs Systems (export verification)                │
│  - Email Service (notifications)                        │
└─────────────────────────────────────────────────────────┘
```

## Module Architecture

### Module Overview

The platform consists of four modules:

1. **RMM (Registry Management Module)** - Core, always on
2. **VCI (Value Chain Intelligence)** - Core, always on
3. **ECS (Export Control System)** - Optional, license-controlled
4. **CMC (Compliance Monitoring Center)** - Optional, license-controlled

### Module Activation

- **Activation mechanism:** `system_config` database table
- **Activation order:** RMM → VCI → (ECS) → (CMC)
- **Core modules:** RMM and VCI are always on
- **Optional modules:** ECS and CMC can be activated independently
- **Enhancement relationships:**
  - ECS enhanced when CMC is active (uses compliance scores for validation)
  - CMC enhanced when ECS is active (includes export compliance in scoring)

### Module Communication

- **Pattern:** Direct database access via Supabase (Decision 1)
- **Security:** RLS (Row Level Security) enforces module boundaries
- **Data ownership:** Each module owns its data (see Data Ownership below)
- **Cross-module queries:** See Cross-Module Query Handling section

### Module Dependencies

```
RMM (Foundation)
  │
  ├─→ VCI (requires RMM)
  │     │
  │     ├─→ ECS (requires RMM + VCI)
  │     │
  │     └─→ CMC (requires RMM + VCI, enhanced if ECS active)
```

## Data Architecture

### Data Ownership

Each module maintains clear data ownership:

**RMM Module:**
- `companies` - IPC and Wholesaler companies
- `products` - Products belong to companies
- `skus` - SKUs belong to products
- `atc_codes` - ATC codes (MOH-controlled)
- `critical_medicines` - Critical medicine designations (MOH-controlled)

**VCI Module:**
- `aams_submissions` - Annual Average Monthly Sales submissions
- `msq_submissions` - Monthly Sales Quantities submissions
- `wsl_submissions` - Weekly Stock Levels submissions
- `thresholds` - VCI thresholds (B × AAMS), supports time-bound modifications with automatic and manual reversion
- `breaches` - Threshold breach records
- `breach_analyses` - Tier 2 analysis of breaches

**ECS Module:**
- `export_requests` - Export authorization requests
- `export_authorizations` - Approved export authorizations
- `replenishment_schedules` - Replenishment plans for exports

**CMC Module:**
- `compliance_scores` - Monthly compliance scores (frozen snapshots)
- `compliance_score_components` - Individual component scores
- `disputes` - Score disputes
- `regulatory_reports` - Generated regulatory reports

**Shared Entities:**
- `users` - System users (via Supabase Auth)
- `user_roles` - User role assignments
- `notifications` - In-app notifications
- `audit_logs` - Audit trail
- `system_config` - Module activation and system settings

### Key Relationships

- `users` → `companies` (many-to-one, nullable - company users have company_id, MOH users have NULL)
- `companies` → `products` (one-to-many, required)
- `products` → `skus` (one-to-many, required)
- `companies` → `aams_submissions` (one-to-many)
- `skus` → `wsl_submissions` (one-to-many)
- `skus` → `thresholds` (one-to-many)
- `companies` → `compliance_scores` (one-to-many)

## Security Architecture

### Authentication

- **Method:** Supabase Auth (email/password)
- **Session management:** Supabase handles sessions
- **Password policies:** Configurable complexity requirements

### Authorization (RBAC + RLS)

- **RLS (Row Level Security):** Database-level security (Decision 13)
  - Company users: Isolated access to own company's data
  - MOH users: System-wide access (company_id is NULL)
  - Policies check module activation for optional modules
- **RBAC (Role-Based Access Control):** Application-level permissions
  - Roles: Tier 1, Tier 2 Officers, Tier 2 Registrars, Company Admin, Company Manager, Company User, Auditor, System Admin, Vendor
  - RLS handles data visibility, application logic handles actions
- **Two-person rule:** Application logic (Tier 1 approval + Tier 2 confirmation)

### Audit Logging

- **Approach:** Separate audit log table with hash chaining (Decision 8 - Provisional)
- **What's audited:** All data changes, approvals, state transitions, system operations
- **Retention:** 7 years minimum (regulatory requirement)
- **Detail level:** Table names, record IDs, operation type, before/after data

## Cross-Module Interactions

### Data Flows

**VCI → ECS:**
- VCI provides MSQ data to ECS for XAMS calculations (default X=6 months)

**VCI → CMC:**
- VCI provides WSL/MSQ/AAMS data to CMC for compliance scoring

**ECS → CMC:**
- ECS provides export compliance data to CMC for scoring

**CMC → ECS:**
- CMC provides compliance scores to ECS for conditional export validation
  - Score < 60: Auto-approval disabled, full manual review
  - Score 60-74: Tier 2 verification required before auto-approval
  - Score 75+: Standard auto-approval

### Event-Triggered Actions

**ECS → CMC:**
- ECS export approval triggers CMC score recalculation (event-triggered)

**ECS → VCI:**
- ECS authorization triggers threshold switch (VCI Threshold → ECS Threshold)
- VCI dashboard uses ECS Threshold for SKUs with active exports
- Threshold reverts after 3 months or on cancellation/revocation

**VCI → CMC:**
- High-priority breaches in VCI trigger enhanced monitoring workflows

### Cross-Module Query Handling

- **User-triggered queries:** RLS applies normally (Decision 12)
- **Scheduled jobs:** Service role (bypasses RLS) with comprehensive audit logging
- **RPC functions:** SECURITY DEFINER with audit logging for cross-module calculations

## API Architecture

### Internal APIs (RPC Functions)

- **Organization:** By module (RMM, VCI, ECS, CMC)
- **Naming:** `{module}_{action}_{entity}` (e.g., `rmm_create_company`, `vci_submit_aams`)
- **Response format:** Standard JSON with success/data/error structure
- **Error handling:** Consistent error codes and messages
- **Transactions:** All RPC functions use database transactions

### External APIs (REST)

- **Pattern:** REST API with webhook support (webhooks optional, future)
- **Authentication:** API Keys + JWT tokens
- **Versioning:** URL-based (`/api/v1/...`)
- **Endpoints:**
  - ERP Integration: `POST /api/v1/submissions/msq`, `/wsl`, `/aams`
  - Customs Integration: `POST /api/v1/exports/verify` (future)

## Workflow Architecture

### Workflow Pattern

- **Approach:** Database-driven state machines (status columns + RPC functions)
- **State storage:** `status` column on workflow entities
- **State transitions:** RPC functions validate and execute transitions
- **Approval tracking:** Separate `approvals` table tracks approval history

### Key Workflows

1. **RMM Approval Workflow:** Company submissions → Tier 2 verification → Tier 1 approval → Tier 2 implementation
2. **RMM MOH Submission Workflow:** Tier 2 submission → Tier 2 peer review → Tier 1 approval → Tier 2 implementation
3. **VCI AAMS Submission Workflow:** Company submission → Tier 2 verification → Tier 1 approval
4. **VCI Breach Analysis Workflow:** Breach detected → Tier 2 analysis → Tier 1 review → Action taken
5. **ECS Export Request Workflow:** Submission → Conditional validation (CMC scores) → Auto-approval queue/Manual review → Authorization (triggers threshold switch)
6. **CMC Dispute Workflow:** Company dispute → Tier 2 review → Tier 1 decision

**Cross-Module Workflow Impacts:**
- CMC scores determine ECS auto-approval eligibility
- ECS authorization triggers CMC score recalculation
- ECS authorization triggers VCI threshold switch

## Background Processing

### Edge Functions

1. `send-email-notification` - Email notification service (triggered by DB changes)
2. `erp-submit-data` - ERP integration handler (API-triggered)
3. `customs-verify-export` - Customs integration handler (API-triggered, future)
4. `recalculate-compliance-score` - Event-triggered CMC score recalculation

### Scheduled Triggers (pg_cron)

1. Monthly Compliance Score Calculation - `0 2 1 * *` (2 AM on 1st of month)
2. Weekly WSL Submission Deadline Check - `0 17 * * 5` (5 PM Friday)
3. AAMS Submission Deadline Check - `0 2 16 2 *` (2 AM Feb 16)
4. Export Authorization Expiration Check - `0 2 * * *` (Daily at 2 AM)
5. Threshold Switching Reversion - `0 2 * * *` (Daily at 2 AM)
6. Replenishment Schedule Delay Escalation - `0 9 * * *` (Daily at 9 AM)
7. Data Retention and Archival - `0 3 1 1 *` (3 AM Jan 1, annually, future)
8. System Health Checks - `*/15 * * * *` (Every 15 minutes)

**Decision Framework:**
- Scheduled Triggers: Time-based recurring jobs, database-heavy operations
- Edge Functions: Event-triggered tasks, external API calls, email notifications

## Deployment Architecture

### Environments

- **Development:** Local Supabase CLI + Docker, local Next.js dev server
- **Staging:** Separate Supabase project (pm-staging), Vercel staging branch
- **Production:** Separate Supabase project (pm-prod), Vercel main branch

### Deployment Strategy

- **Frontend:** Vercel (automatic deployments from Git)
  - `main` branch → Production
  - `staging` branch → Staging
  - PR branches → Preview deployments
- **Backend:** Supabase Cloud (separate projects per environment)
- **Database migrations:** Supabase migration files

## Technology Stack

### Frontend
- **Framework:** Next.js 13+ (React, App Router)
- **UI Library:** Tailwind CSS + shadcn/ui
- **State Management:** React Server Components + TanStack Query + React Context
- **Forms:** React Hook Form + Zod
- **Date/Time:** date-fns + date-fns-tz
- **Validation:** Zod
- **File Upload:** Supabase Storage

### Backend
- **Database:** PostgreSQL (via Supabase)
- **Auth:** Supabase Auth
- **Storage:** Supabase Storage
- **Functions:** Supabase Edge Functions (Deno)
- **Scheduled Jobs:** pg_cron (Scheduled Triggers)
- **API:** Supabase RPC functions + REST API endpoints

### Infrastructure
- **Frontend Hosting:** Vercel
- **Backend Hosting:** Supabase Cloud
- **CI/CD:** GitHub Actions (or Vercel CI/CD)
- **Monitoring:** Supabase Dashboard + external monitoring (to be determined)

## Integration Architecture

### ERP Integration

- **Pattern:** REST API
- **Endpoints:** `/api/v1/submissions/msq`, `/wsl`, `/aams`
- **Authentication:** API Keys + JWT tokens
- **Data Flow:** ERP systems submit data via API → Stored in VCI module

### Customs Integration (Future)

- **Pattern:** REST API
- **Endpoint:** `/api/v1/exports/verify`
- **Authentication:** API Keys + JWT tokens
- **Data Flow:** Customs system verifies exports → Updates ECS export authorization status

## Notification Architecture

- **System of record:** In-app notifications (stored in database)
- **Email delivery:** Edge Functions read from notifications table and send emails
- **Notification types:** User notifications, system alerts, deadline reminders
- **Audit trail:** All notifications logged in database

## Data Retention & Archival

- **Active retention:** 7 years minimum
- **Archival process:** Annual archival job (January 1st)
- **Archive access:** MOH must be able to access archived data for regulatory review
- **Archive storage:** Separate archive tables or archive storage (to be determined)

## Performance Considerations

- **RLS policies:** Designed for performance (indexed queries, helper functions)
- **Cross-module queries:** Service role for scheduled jobs (bypasses RLS for performance)
- **Caching:** TanStack Query handles frontend caching
- **Database indexing:** Indexes on foreign keys and frequently queried columns
- **Connection pooling:** Supabase handles connection pooling

## Scalability

- **Database:** Supabase PostgreSQL (scales with plan)
- **Frontend:** Vercel (automatic scaling)
- **Edge Functions:** Supabase Edge Functions (scales automatically)
- **Scheduled Jobs:** pg_cron (runs on database server)

## Monitoring & Logging

- **Application logs:** Structured logging (to be determined)
- **Error tracking:** Error logging and alerting (to be determined)
- **Performance monitoring:** Supabase Dashboard + external monitoring (to be determined)
- **Audit logs:** Comprehensive audit trail in database

## Related Documents

- [Technical Decision Log](../../06-development/technical-decisions/decision-log.md) - All architectural decisions
- [Database Schema Design](database/schema-design.md) - Detailed database design (to be created Week 2)
- [API Specifications](api/) - Detailed API documentation (to be created Week 3)
- [Security Architecture](security/security-architecture.md) - Detailed security design (to be created Week 4)
- [Regulatory Framework](../../03-governance/regulatory-framework.md) - Comprehensive regulatory reference including Law No. 09-08 and Cloud Services Regulation
- [Compliance Requirements](../../03-governance/compliance-requirements.md) - Detailed compliance requirements including CNDP and cloud services compliance
- [Regulatory Policies](../../03-governance/regulatory-policies.md) - Regulatory policies and guidelines
- [Phase 0 Plan](../../05-project-management/phases/phase-0-technical-foundation.md)
- [Project Plan](../../05-project-management/project-plan.md)
- [Project Brief](../../00-overview/Project%20Brief%20–%20PM.md)

---

**Next Review Date:** [To be scheduled]  
**Owner:** Oliver (Chief Architect)
