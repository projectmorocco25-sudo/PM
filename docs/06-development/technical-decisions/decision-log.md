# Technical Decision Log - Pharmaceutical Governance Value Chain Platform (PM)

**Purpose:** This document records all significant technical decisions made during the project, including rationale and alternatives considered.

**Last Updated:** 2025-12-31  
**Maintained By:** Oliver (Chief Architect)

## Decision Status Legend

- ✅ **Locked** - Decision finalized and approved
- 🟡 **Provisional** - Decision made but subject to review
- 🔴 **Under Review** - Decision being discussed
- ⚪ **Pending** - Decision not yet made

## Decision Format

Each decision includes:
- **ID:** Unique decision identifier
- **Date:** When decision was made
- **Status:** Current status
- **Decision:** What was decided
- **Rationale:** Why this decision was made
- **Alternatives Considered:** Other options evaluated
- **Impact:** What this affects
- **Owner:** Who made/owns the decision

---

## Phase 0: Technical Foundation Decisions

### Decision 1: Module Communication Pattern ✅ Locked

**Date:** 2025-12-31  
**Status:** ✅ Locked  
**Owner:** Oliver

**Decision:**  
Direct database access via Supabase (modules share same DB, RLS enforces boundaries)

**Rationale:**
- Leverages Supabase architecture naturally
- Better performance (no network overhead between modules)
- Simpler implementation (no service layer needed)
- RLS provides security boundaries

**Alternatives Considered:**
- Inter-module API calls (rejected: unnecessary complexity, performance overhead)
- Service layer abstraction (rejected: adds complexity without clear benefit)

**Impact:**
- All modules access shared database directly
- RLS policies must be carefully designed to enforce module boundaries
- No inter-module API layer needed

---

### Decision 2: Module Architecture, Activation, and Data Access Strategy ✅ Locked

**Date:** 2025-12-31  
**Status:** ✅ Locked  
**Owner:** Oliver

**Decision:**  
- Core modules (always on): RMM and VCI
- Optional modules (license-controlled): ECS and CMC
- Module activation via `system_config` database table
- Activation order: RMM → VCI → (ECS) → (CMC)
- Direct database access between modules with RLS enforcement
- Clear data ownership per module

**Rationale:**
- Matches Project Brief requirements (RMM and VCI are core modules)
- Simple activation mechanism using database table
- Clear module boundaries and data ownership
- Supports progressive activation of optional modules

**Module Activation:**
- `system_config` table stores module activation status
- RMM must be activated first (foundation)
- VCI must be activated second (core, requires RMM)
- ECS and CMC are optional and can be activated independently
- ECS enhanced when CMC is active (uses compliance scores for validation)
- CMC enhanced when ECS is active (includes export compliance in scoring)

**Shared Components:**
- **Shared Database Tables:** companies, products, skus, users, user_roles, notifications, audit_logs, system_config
- **Shared RPC Functions:** get_user_permissions(), check_module_active(), create_audit_log(), create_notification()
- **Shared Frontend Components:** Layout, authentication, notification center, role-based access wrappers, common forms

**Data Ownership:**
- RMM owns: companies, products, skus, atc_codes, critical_medicines
- VCI owns: aams_submissions, msq_submissions, wsl_submissions, thresholds
- ECS owns: export_requests, export_authorizations, replenishment_schedules
- CMC owns: compliance_scores, disputes, regulatory_reports

**Alternatives Considered:**
- Separate databases per module (rejected: unnecessary complexity, harder to query across modules)
- Configuration file for module activation (rejected: database approach allows runtime changes, better for audit)

**Impact:**
- Module activation can be controlled at runtime
- Frontend must check module activation status
- RLS policies must check module activation for optional modules
- Clear separation of concerns per module

---

### Decision 3: Deployment and Environment Strategy ✅ Locked

**Date:** 2025-12-31  
**Status:** ✅ Locked  
**Owner:** Oliver

**Decision:**  
- Three environments: Development, Staging, Production
- Separate Supabase projects per environment (pm-dev, pm-staging, pm-prod)
- Next.js frontend deployed to Vercel
- Deployment strategy: main → prod, staging → staging, develop → dev preview

**Rationale:**
- Industry standard three-environment approach
- Complete isolation between environments
- Vercel optimized for Next.js deployments
- Supports safe testing and production deployments

**Environment Details:**
- **Development:** Local Supabase CLI + Docker, local Next.js dev server
- **Staging:** Separate Supabase project, Vercel staging branch deployment
- **Production:** Separate Supabase project, Vercel main branch deployment

**Alternatives Considered:**
- Single Supabase project with multiple databases (rejected: less isolation, harder to manage)
- Other deployment platforms (rejected: Vercel best for Next.js, good integration)

**Impact:**
- Environment variables must be configured per environment
- Database migrations must be applied to each environment
- CI/CD pipeline must handle environment-specific deployments

---

### Decision 4: Background Job Architecture ✅ Locked

**Date:** 2025-12-31  
**Status:** ✅ Locked  
**Owner:** Oliver

**Decision:**  
Supabase Edge Functions + Scheduled Triggers (pg_cron)

**Rationale:**
- Native Supabase capabilities
- Sufficient for MVP requirements
- No additional infrastructure needed
- Good balance of features and simplicity

**Alternatives Considered:**
- External job scheduler (rejected: adds complexity, additional infrastructure)
- Custom background job system (rejected: unnecessary, Supabase provides this)

**Impact:**
- All background processing uses Supabase native capabilities
- Edge Functions for event-driven and external API needs
- Scheduled Triggers for time-based recurring jobs

---

### Decision 5: Background Processing Strategy ✅ Locked

**Date:** 2025-12-31  
**Status:** ✅ Locked  
**Owner:** Oliver

**Decision:**  
Clear separation between Scheduled Triggers (pg_cron) and Edge Functions based on use case:
- Scheduled Triggers: Time-based recurring jobs, database-heavy operations
- Edge Functions: Event-triggered tasks, external API calls, email notifications

**Edge Functions Defined:**
1. `send-email-notification` - Email notification service (triggered by DB changes)
2. `erp-submit-data` - ERP integration handler (API-triggered)
3. `customs-verify-export` - Customs integration handler (API-triggered, future)
4. `recalculate-compliance-score` - Event-triggered CMC score recalculation

**Scheduled Triggers Defined:**
1. Monthly Compliance Score Calculation - `0 2 1 * *` (2 AM on 1st of month)
2. Weekly WSL Submission Deadline Check - `0 17 * * 5` (5 PM Friday)
3. AAMS Submission Deadline Check - `0 2 16 2 *` (2 AM Feb 16)
4. Export Authorization Expiration Check - `0 2 * * *` (Daily at 2 AM)
5. Threshold Switching Reversion - `0 2 * * *` (Daily at 2 AM)
6. Replenishment Schedule Delay Escalation - `0 9 * * *` (Daily at 9 AM)
7. Data Retention and Archival - `0 3 1 1 *` (3 AM Jan 1, annually, future)
8. System Health Checks - `*/15 * * * *` (Every 15 minutes)

**Rationale:**
- Clear decision framework prevents confusion
- Leverages strengths of each approach
- Scheduled Triggers for predictable recurring tasks
- Edge Functions for dynamic event-driven needs

**Alternatives Considered:**
- All jobs as Edge Functions (rejected: unnecessary for simple scheduled tasks)
- All jobs as Scheduled Triggers (rejected: can't handle external API calls easily)

**Impact:**
- Clear pattern for when to use each approach
- All background jobs defined and scheduled
- Timezone considerations (Morocco time) built into schedules

---

### Decision 6: Notification Architecture ✅ Locked

**Date:** 2025-12-31  
**Status:** ✅ Locked  
**Owner:** Oliver

**Decision:**  
In-app system as system of record (notifications stored in DB)

**Rationale:**
- Governance requirement (audit trail)
- User control over notifications
- Complete audit trail of all notifications
- Email notifications read from in-app notifications (Edge Functions)

**Implementation:**
- Notifications stored in `notifications` table
- Edge Functions read from notifications table to send emails
- Users see all notifications in-app
- Email is a delivery mechanism, not the source of truth

**Alternatives Considered:**
- Email as system of record (rejected: no audit trail, user can't control)
- Separate notification and email systems (rejected: unnecessary complexity)

**Impact:**
- All notifications must be stored in database first
- Email delivery is asynchronous via Edge Functions
- Complete audit trail of notification delivery

---

### Decision 7: Workflow Engine Pattern 🟡 Provisional

**Date:** 2025-12-31  
**Status:** 🟡 Provisional  
**Owner:** Maya

**Recommendation:**  
Database-driven state machines (status columns + RPC functions)

**Rationale:**
- Simpler than external workflow engine
- Leverages Supabase capabilities
- Easier to query and audit
- No additional infrastructure

**Alternatives Considered:**
- External workflow engine (rejected: adds complexity, additional infrastructure)
- Application-level state management only (rejected: harder to query, audit)

**Impact:**
- Workflows implemented as status columns + RPC functions
- State transitions enforced in database
- Easy to query workflow status

**Note:** Final decision pending Week 3 API design work

---

### Decision 8: Audit Logging Strategy 🟡 Provisional

**Date:** 2025-12-31  
**Status:** 🟡 Provisional  
**Owner:** Salim

**Recommendation:**  
Separate audit log table with hash chaining (Salim's approach)

**Rationale:**
- Full control over audit logging
- Immutability through hash chaining
- Regulatory compliance requirements
- Can't be tampered with

**Alternatives Considered:**
- Supabase built-in audit (rejected: may not meet regulatory requirements)
- External audit service (rejected: adds complexity, cost)

**Impact:**
- Custom audit logging implementation required
- Hash chaining ensures immutability
- Complete audit trail for regulatory compliance

**Note:** Final decision pending Week 4 security architecture work

---

### Decision 9: Technology Stack Details ✅ Locked

**Date:** 2025-12-31  
**Status:** ✅ Locked  
**Owner:** Oliver

**Decision:**  
Technology stack selections for frontend development:
- **UI Component Library:** Tailwind CSS + shadcn/ui
- **State Management:** React Server Components + TanStack Query (React Query) + React Context
- **Form Handling:** React Hook Form + Zod
- **Date/Time Handling:** date-fns + date-fns-tz
- **Validation:** Zod (for forms and API)
- **File Upload:** Supabase Storage with direct upload

**Rationale:**
- Modern, performant stack aligned with Next.js 13+ best practices
- Excellent TypeScript support throughout
- Minimal dependencies, good developer experience
- Tailwind + shadcn/ui provides accessible, customizable components
- TanStack Query handles server state efficiently with caching
- React Hook Form + Zod is industry standard for forms
- date-fns handles Morocco timezone requirements well
- Supabase Storage provides native integration

**Alternatives Considered:**
- Material-UI (rejected: heavier, less customizable)
- Redux for state management (rejected: unnecessary complexity, TanStack Query sufficient)
- Formik (rejected: React Hook Form has better performance)
- Moment.js (rejected: date-fns is lighter, more modern)
- External file storage service (rejected: Supabase Storage is native, simpler)

**Impact:**
- Frontend architecture defined
- Development standards established
- All team members use consistent stack
- TypeScript-first approach throughout

---

### Decision 10: Integration Architecture ✅ Locked

**Date:** 2025-12-31  
**Status:** ✅ Locked  
**Owner:** Maya

**Decision:**  
Integration architecture for external systems (ERP, customs):
- **Pattern:** REST API with webhook support (webhooks optional, future)
- **Authentication:** API Keys + JWT tokens
- **Versioning:** URL-based versioning (`/api/v1/...`)
- **Data Format:** JSON payloads with standardized request/response format

**ERP Integration Endpoints:**
- `POST /api/v1/submissions/msq` - Submit MSQ data
- `POST /api/v1/submissions/wsl` - Submit WSL data
- `POST /api/v1/submissions/aams` - Submit AAMS data
- `GET /api/v1/submissions/status/{id}` - Check submission status

**Authentication Flow:**
1. Company ERP system authenticates with API key: `X-API-Key: {key}`
2. System returns short-lived JWT token
3. Subsequent API calls use JWT: `Authorization: Bearer {token}`
4. API keys can be rotated/revoked per company
5. Different keys per environment (dev/staging/prod)

**Customs Integration (Future):**
- `POST /api/v1/exports/verify` - Verify export completion
- Similar authentication pattern
- Customs system calls API with export details
- System verifies and updates export authorization status

**Rationale:**
- REST API is standard, familiar to developers
- API key + JWT provides secure, scalable authentication
- URL-based versioning is explicit and clear
- Supports both real-time and batch operations
- Webhook support can be added later if needed

**Alternatives Considered:**
- GraphQL (rejected: REST is simpler, more familiar to ERP vendors)
- OAuth2 (rejected: API keys simpler for system-to-system integration)
- Header-based versioning (rejected: URL-based is more explicit)
- Webhooks required from start (rejected: can add later, not needed for MVP)

**Impact:**
- API architecture defined for external integrations
- Authentication mechanism established
- Versioning strategy allows evolution
- ERP and customs integration patterns clear

---

### Decision 11: Core Entity Model & Relationships ✅ Locked

**Date:** 2025-12-31  
**Status:** ✅ Locked  
**Owner:** Nadia

**Decision:**  
Core database entities and relationship structure:

**RMM Module Entities:**
- `companies` - IPC and Wholesaler companies
- `products` - Products belong to companies
- `skus` - SKUs belong to products
- `atc_codes` - ATC codes (MOH-controlled, read-only for companies)
- `critical_medicines` - Critical medicine designations (MOH-controlled)

**VCI Module Entities:**
- `aams_submissions` - Annual Average Monthly Sales submissions
- `msq_submissions` - Monthly Sales Quantities submissions
- `wsl_submissions` - Weekly Stock Levels submissions
- `thresholds` - VCI thresholds (B × AAMS, per-SKU or global)
- `breaches` - Threshold breach records
- `breach_analyses` - Tier 2 analysis of breaches

**ECS Module Entities:**
- `export_requests` - Export authorization requests
- `export_authorizations` - Approved export authorizations
- `replenishment_schedules` - Replenishment plans for exports

**CMC Module Entities:**
- `compliance_scores` - Monthly compliance scores (frozen snapshots)
- `compliance_score_components` - Individual component scores
- `disputes` - Score disputes
- `regulatory_reports` - Generated regulatory reports

**Shared Entities:**
- `users` - System users (via Supabase Auth)
  - `company_id` (nullable foreign key to companies)
  - Company users: `company_id` is set (belong to one company)
  - MOH users: `company_id` is NULL (system-wide access)
- `user_roles` - User role assignments
- `notifications` - In-app notifications
- `audit_logs` - Audit trail
- `system_config` - Module activation and system settings

**Key Relationships:**
- `users` → `companies` (many-to-one, nullable - company users have company_id, MOH users have NULL)
- `companies` → `products` (one-to-many, required)
- `products` → `skus` (one-to-many, required)
- `companies` → `aams_submissions` (one-to-many)
- `skus` → `wsl_submissions` (one-to-many)
- `skus` → `thresholds` (one-to-many)
- `companies` → `compliance_scores` (one-to-many)

**User-Company Relationship:**
- Company users: `users.company_id` → `companies.id` (required, many-to-one)
- MOH users: `users.company_id` is NULL (system-wide access to all companies)
- RLS policies check:
  - If `company_id` is set → user can only see their company's data
  - If `company_id` is NULL → user is MOH/system role, can see all companies (based on role permissions)

**Approval Workflow Modeling:**
- Status columns + approval tracking tables
- Each submission/request has a `status` column (pending, verified, approved, rejected, etc.)
- Separate `approvals` table tracks approval history
- Fields: `submission_id`, `approver_id`, `approval_type`, `status`, `comments`, `created_at`

**Cascade Rules:**
- When company is deactivated → products and SKUs cascade to deactivated
- When product is deactivated → SKUs cascade to deactivated
- Soft deletes (use `is_active` or `deleted_at` column) to preserve history

**Rationale:**
- Clear entity structure from Project Brief
- Standard relational model
- Supports audit requirements
- Soft deletes preserve regulatory history
- User-company relationship supports RLS policies
- Approval workflow model supports complex approval chains

**Alternatives Considered:**
- Hard deletes (rejected: need to preserve regulatory history)
- Separate approval tables per entity type (rejected: unified approvals table is simpler)
- User roles in separate many-to-many table (rejected: simpler to store role in users table or single user_roles table)

**Impact:**
- Database schema foundation defined
- Entity relationships clear for Week 2 design work
- User-company relationship supports RLS design
- Approval workflow structure defined
- Cascade rules preserve data integrity

---

### Decision 12: Cross-Module Query Handling with RLS ✅ Locked

**Date:** 2025-12-31  
**Status:** ✅ Locked  
**Owner:** Oliver (with input from Fatima)

**Decision:**  
Hybrid approach for handling cross-module queries with RLS:

1. **User-Triggered Queries:** RLS applies normally
   - Company users see only their company's data
   - MOH users see all data (based on role)
   - Standard RLS policy enforcement

2. **Scheduled Jobs:** Service role with comprehensive audit logging
   - Use Supabase service role key (bypasses RLS)
   - Log all operations in audit_logs table
   - Include: operation_type, data_accessed, timestamp, reason
   - Example: "Monthly compliance score calculation - accessed all VCI data for all companies"

3. **RPC Functions for Cross-Module:** SECURITY DEFINER with audit logging
   - For functions like `calculate_compliance_score()`
   - Log function calls in audit_logs
   - Include: function_name, caller_user_id, parameters, timestamp

4. **Audit Logging Requirements:**
   - All service role operations logged
   - All SECURITY DEFINER function calls logged
   - MOH can query audit logs to verify system operations
   - Audit logs retained for 7 years (regulatory requirement)

**Rationale:**
- **Technical (Oliver):** Efficient, secure, maintainable. Service role provides performance for bulk operations while maintaining security boundaries.
- **Regulatory (Fatima):** Compliant, auditable, transparent. All system operations logged for MOH oversight and regulatory compliance.

**Alternatives Considered:**
- RLS for all queries including scheduled jobs (rejected: performance impact, unnecessary for system operations)
- No audit logging for system operations (rejected: regulatory non-compliance, MOH oversight requirement)

**Impact:**
- Cross-module queries handled efficiently
- Regulatory compliance maintained through audit logging
- Performance optimized for scheduled jobs
- MOH oversight capability preserved
- Clear pattern for when to use service role vs user context

---

### Decision 13: RLS Policy Framework ✅ Locked

**Date:** 2025-12-31  
**Status:** ✅ Locked  
**Owner:** Rafi

**Decision:**  
RLS (Row Level Security) policy framework for data access control:

**RLS Policy Strategy:**
- Enable RLS on all tables containing sensitive data
- Policies check user role and company_id
- Policies are additive (if any policy allows access, user can access)

**Company Data Isolation:**
- Company users can only see their own company's data
- Policy pattern: `company_id = (SELECT company_id FROM users WHERE id = auth.uid())`
- Applies to: companies, products, skus, submissions, etc.
- Exception: MOH users bypass this (see below)

**MOH User Access:**
- MOH users have `company_id = NULL`
- Policy pattern: `(SELECT company_id FROM users WHERE id = auth.uid()) IS NULL`
- MOH users can see all companies' data
- Access level depends on role:
  - Tier 1: Full access (read/write/delete)
  - Tier 2 Officers: Read/write (can't delete without Tier 1)
  - Tier 2 Registrars: Read/write (implementation only)

**RLS Policy Patterns:**

**Pattern 1: Company Users (Isolated Access)**
```sql
-- Example: products table
CREATE POLICY "company_users_see_own_products"
ON products FOR SELECT
USING (
  company_id IN (
    SELECT company_id FROM users WHERE id = auth.uid()
  )
);
```

**Pattern 2: MOH Users (System-Wide Access)**
```sql
-- Example: products table
CREATE POLICY "moh_users_see_all_products"
ON products FOR SELECT
USING (
  (SELECT company_id FROM users WHERE id = auth.uid()) IS NULL
);
```

**Pattern 3: Module Activation Check**
```sql
-- Example: export_requests table (ECS module)
CREATE POLICY "users_see_exports_if_module_active"
ON export_requests FOR SELECT
USING (
  (SELECT is_active FROM system_config WHERE module_name = 'ecs') = true
  AND (
    -- Company user sees own company's exports
    company_id IN (SELECT company_id FROM users WHERE id = auth.uid())
    OR
    -- MOH user sees all exports
    (SELECT company_id FROM users WHERE id = auth.uid()) IS NULL
  )
);
```

**Role-Based Permissions (RLS + Application Logic):**
- RLS handles data visibility (who can see what)
- Application logic handles actions (who can do what)
- Example: RLS allows Tier 2 to see all companies, but app logic restricts deletions to Tier 1

**Two-Person Rule:**
- Not enforced in RLS (application logic)
- RLS allows both Tier 1 and Tier 2 to see the data
- Application enforces: Tier 1 approval + Tier 2 confirmation required

**Read-Only Roles:**
- Auditors: RLS allows read access to all data, app logic blocks writes
- Vendors: RLS allows limited read access, app logic restricts scope

**Cross-Module Queries:**
- User-triggered: RLS applies normally (see Decision 12)
- Scheduled jobs: Service role (bypasses RLS) with audit logging
- RPC functions: SECURITY DEFINER with audit logging

**Rationale:**
- RLS enforces data isolation at the database level (security at source)
- Company users can't access other companies' data (regulatory requirement)
- MOH users have system-wide access based on role (governance requirement)
- Module activation checked in RLS policies (supports optional modules)
- Application logic handles complex business rules (two-person rule, etc.)
- Cross-module queries handled efficiently with audit logging

**Alternatives Considered:**
- Application-level access control only (rejected: RLS provides defense in depth, database-level security)
- Separate databases per company (rejected: unnecessary complexity, RLS provides isolation)
- RLS for all operations including scheduled jobs (rejected: performance impact, see Decision 12)

**Impact:**
- All sensitive tables must have RLS enabled
- RLS policies must be designed for each table
- Helper functions may be needed for common policy checks
- Performance considerations for complex policy queries
- Clear separation between RLS (visibility) and application logic (actions)

---

### Decision 14: Effective Dating & Versioning Strategy ✅ Locked

**Date:** 2025-12-31  
**Status:** ✅ Locked  
**Owner:** Nadia

**Decision:**  
Effective dating and versioning strategy for historical data preservation:

**Effective Dating Strategy:**
- **No effective dating for most entities**
  - Most entities don't need historical versions (companies, products, SKUs)
  - Use soft deletes (`is_active` or `deleted_at`) to preserve history
  - Current state is what matters for most operations

**Versioning Strategy:**

**1. Compliance Scores (Frozen Snapshots):**
- Store monthly scores as immutable snapshots
- Each score has: `score_period` (year-month), `calculated_at`, `frozen_at`
- Corrections create `adjustment_notes`, not new scores
- Adjustment notes link to original score and document the correction
- Original score remains unchanged (regulatory requirement from Project Brief)

**2. Submissions (AAMS, MSQ, WSL):**
- **Single version with correction tracking**
  - Each submission is a single record
  - If company needs to correct: create new submission with `correction_of` reference
  - Original submission remains (for audit trail)
  - System tracks: original submission, corrections, final accepted version
  - MSQ has 7-day grace period for corrections (Project Brief requirement)

**3. Thresholds:**
- **Version history for threshold changes**
  - Store threshold changes with `effective_from` date
  - Query current threshold: `WHERE effective_from <= NOW() ORDER BY effective_from DESC LIMIT 1`
  - All threshold modifications are non-retroactive (Project Brief requirement)
  - Historical thresholds preserved for audit
  - Supports both global and per-SKU threshold modifications

**4. Approval Workflows:**
- **Status history in approvals table**
  - Each status change creates a new approval record
  - Track: `from_status`, `to_status`, `changed_at`, `changed_by`
  - Full audit trail of workflow progression
  - Supports complex approval chains (Tier 2 verification → Tier 1 approval → Tier 2 implementation)

**Rationale:**
- Compliance scores must be frozen (regulatory requirement - Project Brief line 49)
- Submissions can be corrected but originals preserved (audit requirement)
- Thresholds need version history (non-retroactive requirement - Project Brief)
- Approval workflows need full history (audit requirement)
- Simple for most entities (no effective dating needed, reduces complexity)
- Soft deletes preserve regulatory history without versioning overhead

**Alternatives Considered:**
- Effective dating for all entities (rejected: unnecessary complexity, most entities don't need it)
- Hard deletes with no history (rejected: regulatory requirement to preserve history)
- Rewriting compliance scores (rejected: regulatory requirement for frozen snapshots)
- No versioning for thresholds (rejected: need to track non-retroactive changes)

**Impact:**
- Compliance score calculations must create immutable snapshots
- Submission corrections must preserve originals
- Threshold queries must handle version history efficiently
- Approval workflows must track all status changes
- Database schema must support versioning where needed
- Query performance considerations for versioned data

---

### Decision 15: Workflow Architecture & State Machines ✅ Locked

**Date:** 2025-12-31  
**Status:** ✅ Locked  
**Owner:** Maya

**Decision:**  
Workflow architecture using database-driven state machines with explicit cross-module impact documentation:

**Workflow Modeling Approach:**
- Database-driven state machines (status columns + RPC functions)
- Each workflow entity has a `status` column
- RPC functions handle state transitions with validation
- Database enforces valid transitions
- Easy to query and audit

**Key Workflows Identified:**

**1. RMM Approval Workflow (Company Submissions):**
- States: `draft` → `submitted` → `tier2_verified` → `tier1_approved` → `tier2_implemented` → `completed`
- Transitions: Company submits → Tier 2 verifies → Tier 1 approves → Tier 2 implements → Completed

**2. RMM MOH Submission Workflow:**
- States: `draft` → `submitted` → `tier2_peer_reviewed` → `tier1_approved` → `tier2_implemented` → `completed`
- Transitions: Tier 2 submits → Another Tier 2 peer reviews → Tier 1 approves → Tier 2 implements → Completed

**3. VCI AAMS Submission Workflow:**
- States: `draft` → `submitted` → `tier2_verified` → `tier1_approved` → `completed`
- Transitions: Company submits → Tier 2 verifies and calculates threshold → Tier 1 approves → Completed

**4. VCI Breach Analysis Workflow:**
- States: `detected` → `tier2_analyzing` → `tier2_suggested` → `tier1_reviewed` → `action_taken` → `completed`
- Transitions: System detects → Tier 2 analyzes → Tier 2 suggests action → Tier 1 reviews → Action taken → Completed

**5. ECS Export Request Workflow (with CMC and VCI Impacts):**
- States: `draft` → `submitted` → `auto_approval_queue` / `manual_review` / `tier2_verification_required` → `approved` → `authorized` → `completed` (or `rejected`/`cancelled`)
- Transitions:
  - Company submits: `draft` → `submitted`
  - System evaluates (conditional validation based on CMC score when CMC module is active):
    - If CMC score < 60 OR multiple risk factors: `submitted` → `manual_review` (auto-approval disabled)
    - If CMC score 60-74: `submitted` → `tier2_verification_required` (Tier 2 verification before auto-approval)
    - If CMC score 75+: `submitted` → `auto_approval_queue` (standard auto-approval)
    - If CMC module not active: `submitted` → `auto_approval_queue` (standard auto-approval)
  - Tier 2 verification (if required): `tier2_verification_required` → `auto_approval_queue` (after Tier 2 verifies)
  - Intervention window: Tier 1 can intervene during `auto_approval_queue`
  - Auto-approved: `auto_approval_queue` → `approved` (after intervention window)
  - Manual review path: `manual_review` → `approved` or `rejected` (Tier 1/Tier 2 review)
  - Authorized: `approved` → `authorized`
  - Completed: `authorized` → `completed`
  - Cancelled/Revoked: `authorized` → `cancelled` or `revoked`

**6. CMC Dispute Workflow:**
- States: `draft` → `submitted` → `tier2_reviewing` → `tier1_deciding` → `resolved`
- Transitions: Company submits dispute → Tier 2 reviews → Forwarded to Tier 1 → Tier 1 decision → Resolved

**Cross-Module Workflow Impacts (Explicitly Documented):**

**CMC → ECS Impact (Conditional Validation):**
- CMC compliance scores determine ECS auto-approval eligibility (when CMC module is active)
- Score < 60 OR multiple risk factors: Auto-approval disabled, full manual review required
- Score 60-74: Tier 2 Officer verification required before auto-approval
- Score 75+: Standard auto-approval
- Checked when export request transitions from `submitted` state
- If CMC module not active: Standard auto-approval applies

**ECS → CMC Impact (Event-Triggered Recalculation):**
- ECS export approval (transition to `authorized` state) triggers CMC score recalculation
- Export compliance component in CMC score is updated
- Event-triggered (not scheduled) - happens immediately upon authorization
- CMC score recalculation uses Edge Function or RPC function

**ECS → VCI Impact (Threshold Switching):**
- On `authorized` transition:
  - SKU threshold switches: VCI Threshold → ECS Threshold immediately (ECS module)
  - VCI dashboard uses ECS Threshold for this SKU (VCI module)
  - VCI breach detection uses ECS Threshold for this SKU
  - VCI dashboard shows threshold status (ECS vs VCI)
  - Threshold remains at ECS Threshold for 3 calendar months from authorization date
- On `cancelled`/`revoked` transition:
  - SKU threshold reverts: ECS Threshold → VCI Threshold immediately (ECS module)
  - VCI dashboard reverts to VCI Threshold for this SKU (VCI module)
  - VCI breach detection reverts to VCI Threshold
- After 3 months (scheduled job):
  - Threshold automatically reverts: ECS Threshold → VCI Threshold
  - VCI dashboard automatically updates

**VCI → CMC Impact (Data for Scoring):**
- VCI provides WSL/MSQ/AAMS data to CMC for compliance scoring
- CMC reads from VCI (cross-module query) for score calculations
- This is a data flow, not a workflow state change

**State Transition Enforcement:**
- RPC functions with validation
- Each transition is an RPC function (e.g., `approve_submission()`, `authorize_export()`)
- Function validates: current status allows transition, user has permission, business rules met
- Updates status column and creates approval record
- Handles cross-module side effects (e.g., threshold switching, score recalculation)
- Returns success or error

**Cross-Module Workflow Documentation Requirement:**
- All cross-module impacts must be explicitly documented
- When a workflow state change in one module affects another module, document:
  - Which modules are affected
  - What changes occur
  - When it happens (which state transition)
  - How it's implemented (RPC function, Edge Function, scheduled job)
- This ensures all team members understand cross-module dependencies

**Rationale:**
- Simple - uses database, no external workflow engine
- Auditable - all state changes in database
- Queryable - easy to see workflow status
- Enforceable - RPC functions validate transitions
- Flexible - can add new states/transitions
- Cross-module aware - explicitly documents and handles module interactions
- Matches Project Brief requirements for conditional validation and event-triggered actions

**Alternatives Considered:**
- External workflow engine (rejected: adds complexity, additional infrastructure)
- Application-level state management only (rejected: harder to query, audit)
- No cross-module impact documentation (rejected: critical for understanding system behavior)

**Impact:**
- Workflows implemented as status columns + RPC functions
- State transitions enforced in database
- Easy to query workflow status
- Cross-module impacts clearly documented
- RPC functions must handle cross-module side effects
- Workflow state changes can trigger actions in other modules

---

### Decision 16: API Design & RPC Function Architecture ✅ Locked

**Date:** 2025-12-31  
**Status:** ✅ Locked  
**Owner:** Maya

**Decision:**  
API design and RPC function architecture:

**RPC Function Organization:**
- **By module:** Functions organized by module (RMM, VCI, ECS, CMC)
- **Naming convention:** `{module}_{action}_{entity}` (e.g., `rmm_create_company`, `vci_submit_aams`, `ecs_authorize_export`)
- **Shared functions:** Common functions in shared namespace (e.g., `get_user_permissions`, `check_module_active`, `create_audit_log`, `create_notification`)

**Request/Response Schemas:**
- **Input parameters:** Use PostgreSQL function parameters (typed)
- **Return values:** Return JSON or table types
- **Standard response format:**
  ```json
  {
    "success": true/false,
    "data": {...},
    "error": {...} // if success is false
  }
  ```

**Error Handling:**
- **Standard error codes:** Define error code constants
- **Error response format:** Consistent error structure
- **Validation errors:** Return detailed validation messages
- **Business rule violations:** Return clear business error messages
- **System errors:** Log and return generic error to user (don't expose internal details)

**Transaction Management:**
- RPC functions use database transactions
- Rollback on error
- Commit on success
- Ensures data consistency across multiple operations

**RPC Function Patterns:**
- **State transition functions:** Handle workflow state changes (e.g., `approve_submission()`, `authorize_export()`)
- **CRUD functions:** Standard create, read, update, delete operations
- **Query functions:** Complex queries with filtering, sorting, pagination
- **Calculation functions:** Business logic calculations (e.g., `calculate_compliance_score()`)
- **Cross-module functions:** Functions that read/write across modules (use SECURITY DEFINER with audit logging)

**Rationale:**
- Clear organization by module makes functions easy to find
- Consistent naming convention improves developer experience
- Standard error handling provides consistent API experience
- Transaction management ensures data integrity
- Matches Supabase best practices

**Alternatives Considered:**
- REST API for all operations (rejected: RPC functions more efficient for database operations, already using Supabase)
- No standard error format (rejected: inconsistent error handling makes frontend development harder)
- No transaction management (rejected: data consistency issues)

**Impact:**
- All RPC functions follow consistent patterns
- Frontend can rely on standard response format
- Error handling is consistent across system
- Data integrity maintained through transactions
- Clear organization supports maintainability

---

### Decision 17: Security & Infrastructure Architecture ✅ Locked

**Date:** 2025-12-31  
**Status:** ✅ Locked  
**Owner:** Salim (Security) + Leila (Infrastructure)

**Decision:**  
Security and infrastructure architecture:

**Authentication (Supabase Auth):**
- **Method:** Email/password (primary authentication method)
- **Password policies:** Complexity requirements, minimum length (configurable)
- **Session management:** Supabase handles sessions, configurable duration
- **Password reset:** Standard Supabase password reset flow
- **Multi-factor authentication:** Optional, can be added later if required

**Authorization Framework (RBAC + RLS):**
- **Role storage:** Roles in `user_roles` table or `users.role` column (to be finalized in Week 2)
- **Permission matrix:** Define permissions per role (see Decision 13 for RLS integration)
- **Integration with RLS:** RLS policies check roles (see Decision 13)
- **Two-person rule:** Application logic (not RLS) - both Tier 1 and Tier 2 must approve critical actions

**Audit Logging (from Decision 8 - Provisional, to be finalized Week 4):**
- **Approach:** Separate audit log table with hash chaining (Salim's approach)
- **What to audit:** All data changes, approvals, state transitions, system operations, cross-module queries
- **Hash chaining:** Each log entry includes hash of previous entry (ensures immutability)
- **Retention:** 7 years minimum (regulatory requirement)
- **Detail level:** Table names accessed, record IDs, operation type, before/after data (see Decision 12)

**Development Environment:**
- **Supabase CLI:** Local development with Supabase CLI
- **Docker:** Optional for local Supabase instance (if needed)
- **Environment variables:** `.env.local` for local development
- **Database migrations:** Supabase migration files (versioned)
- **Local database:** Supabase CLI provides local PostgreSQL instance

**CI/CD Pipeline:**
- **Git workflow:** Feature branches → PR → Merge to main/staging
- **CI stages:** Lint → Test → Build → Deploy
- **Database migrations:** Run migrations in CI/CD pipeline (automated)
- **Environment promotion:** Dev → Staging → Prod (manual approval for prod)
- **Deployment:** Vercel for frontend, Supabase for backend

**Testing Framework:**
- **Unit tests:** Jest/Vitest for frontend, pgTAP for database functions
- **Integration tests:** Test RPC functions, RLS policies, cross-module queries
- **E2E tests:** Playwright or Cypress for critical user flows
- **Test coverage target:** 80% for critical paths, 60% overall

**Rationale:**
- Leverages Supabase native authentication capabilities
- Clear security boundaries through RLS + RBAC
- Comprehensive audit trail for regulatory compliance
- Standard development workflow supports team productivity
- Automated testing ensures quality and prevents regressions

**Alternatives Considered:**
- Custom authentication system (rejected: Supabase Auth is sufficient, reduces complexity)
- External audit service (rejected: adds complexity, cost, Salim's approach provides full control)
- Manual deployment process (rejected: CI/CD reduces errors, improves consistency)
- No automated testing (rejected: quality risk, manual testing insufficient for scale)

**Impact:**
- Authentication mechanism defined
- Authorization framework integrated with RLS
- Audit logging approach established (details to be finalized Week 4)
- Development environment standardized
- CI/CD pipeline automates deployment
- Testing framework ensures quality

**Note:** Audit logging details to be finalized in Week 4 with Salim's input (see Decision 8)

---

## Decision Review Process

- **Weekly Review:** Decisions reviewed in weekly architecture meetings
- **Status Updates:** Status updated as decisions progress
- **Documentation:** All decisions documented with rationale
- **Sign-off:** Major decisions require team sign-off

## Related Documents

- [Phase 0 Plan](../../05-project-management/phases/phase-0-technical-foundation.md)
- [System Architecture](../../02-architecture/system-architecture.md) (to be created)
- [Project Plan](../../05-project-management/project-plan.md)

---

**Next Review Date:** [To be scheduled]  
**Owner:** Oliver (Chief Architect)

