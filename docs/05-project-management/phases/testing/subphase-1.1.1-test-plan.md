# Subphase 1.1.1 Test Plan - Foundation & Infrastructure Setup

**Prepared by:** Hassan (QA/Assurance Engineer)  
**Subphase:** 1.1.1 - Foundation & Infrastructure Setup  
**Date:** 2026-01-18  
**Test Coverage Target:** 80% for critical paths, 60% overall  
**Test Database Isolation:** Required per Hassan's responsibility

---

## **0. PREREQUISITES: Seed Data Gate (MUST BE COMPLETE BEFORE TESTING)**

**🚨 BLOCKING ISSUE:** Seed data migration `seed_1_1_1_foundation` MUST be created and applied BEFORE any testing can begin.

### **0.1 Seed Data Gate Acceptance Criteria (Required Before Testing)**

- [x] **Seed migration `seed_1_1_1_foundation` created** per [Phase 1.1 Playbook - Stage: seed_1_1_1_foundation](../phase-1-1-mockdata.md#stage-seed_1_1_1_foundation-subphase-111) ✅ COMPLETE
- [x] **Seed migration applied** via Supabase MCP tool ✅ COMPLETE (2026-01-19)
- [x] **Seed migration verified** in migration history (`supabase migration list` or Supabase dashboard) ✅ COMPLETE
- [x] **All scenario packs seeded** (deterministic IDs) ✅ COMPLETE
  - [x] pack_foundation_moh_ops: MOH users, notifications, audit logs
  - [x] pack_company_active: Active company with full activity
  - [x] pack_company_empty: Empty company for empty state validation
- [x] **Nadia's integrity verification complete** (foreign keys, constraints, indexes) ✅ COMPLETE (see seed migration file)
- [x] **Farah's realism + coverage verification complete** (wireframe coverage, empty states, distribution realism) ✅ COMPLETE (see seed migration file)
- [x] **Hassan's test DB isolation verified** (separate test database, test fixtures ready) ✅ COMPLETE (see seed migration file)
- [ ] **RLS validation passed** (all roles tested) ⚠️ PENDING - Requires role-based authentication testing

**Pushback:** Testing cannot proceed until seed data is validated under RLS by all roles (Company, MOH Tier 1, MOH Tier 2, Vendor). Seed data invisible due to RLS policies is invalid and blocks all test execution.

**Status:** Seed data inserted successfully (5 users, 2 companies, 4 system_config, 5 notifications, 2 audit_logs, 5 conversations, 4 messages, 2 follow_ups, 1 meeting). RLS validation testing required before gate complete.

**Reference:** See [Phase 1.1 Mockdata Playbook](../phase-1-1-mockdata.md) and [Seed Migration Structure](../../../../../supabase/migrations/seed-1-1-1-foundation-structure.sql).

---

## **1. Test Scope & Critical Paths**

**Scope:**
- Database migrations (core, communication, governance tables)
- RLS policies (users, system_config, audit_logs, notifications, communication, governance)
- RPC functions (shared, communication, permission checks)
- Edge Functions (email notifications, background jobs)
- Frontend components (auth, layout, navigation, notifications, communications, UI components)
- Seed data validation (`seed_1_1_1_foundation`)
- CI/CD integration

**Critical Paths:**
1. Authentication and authorization flow
2. RLS enforcement (company isolation, role-based access)
3. Communication lifecycle (conversations, messages, read receipts)
4. Notification system (in-app + email)
5. Audit logging (hash chaining)
6. Seed data visibility under RLS (all roles)

---

## **2. Database Testing Requirements**

### **2.1 Migration Verification (Nadia + Hassan)**

**Pushback:** Schema must be verified before any test execution.

**Test Requirements:**
- [ ] All migrations applied (`supabase migration list`)
- [ ] All tables exist per `schema-design.md`
- [ ] All columns exist with correct data types (`information_schema.columns`)
- [ ] All foreign key constraints defined (`information_schema.table_constraints`)
- [ ] All indexes exist (`pg_indexes`) - **atomic with table creation**
- [ ] All constraints (NOT NULL, CHECK, UNIQUE)
- [ ] All triggers (audit logging)
- [ ] Use `supabase/scripts/verify-schema.sql` for automated verification

**Acceptance:** All schema verification checks pass before seed data testing begins.

### **2.2 Seed Data Integrity (Nadia + Hassan)**

**Test Requirements:**
- [ ] Seed migration `seed_1_1_1_foundation` applies idempotently (safe to re-run)
- [ ] Deterministic IDs used for all scenario packs (UPSERT patterns)
- [ ] All required tables seeded:
  - `users` (MOH Tier 1/2 + company users)
  - `companies` (active + empty)
  - `system_config` (module activation flags)
  - `notifications` (read/unread)
  - `audit_logs`
  - `conversations`, `messages`, `conversation_participants`, `message_read_receipts`
  - `follow_ups`, `meetings`, `meeting_attendees`
- [ ] Scenario packs seeded:
  - `pack_foundation_moh_ops` - MOH operations data
  - `pack_company_active` - active company with activity
  - `pack_company_empty` - empty company for empty state validation

**Pushback:** Seed data that fails integrity checks blocks all subsequent testing.

### **2.3 RLS Data Visibility Testing (Hassan + Rafi)**

**Pushback:** Seed data MUST be validated under real roles - data invisible due to RLS is invalid.

**Test Matrix (All Must Pass):**
- [ ] Company users see only their own company's data (company isolation)
- [ ] MOH Tier 1 sees all data (system-wide access)
- [ ] MOH Tier 2 sees all data (system-wide access)
- [ ] `pack_company_active` data visible to correct roles
- [ ] `pack_company_empty` shows empty states correctly
- [ ] `pack_foundation_moh_ops` visible to MOH only (not to company users)

**Test Procedure:**
1. Authenticate as Company User → verify data isolation
2. Authenticate as MOH Tier 1 → verify system-wide access
3. Authenticate as MOH Tier 2 → verify system-wide access
4. Verify empty states for empty company
5. Verify populated states for active company

**Acceptance:** All role × data combinations match wireframe requirements.

---

## **3. RLS Policy Testing**

### **3.1 Users Table RLS (Task 1.1.1.3a)**
- [ ] Company users see own record only
- [ ] MOH sees all users
- [ ] Self-service profile updates (own record only)
- [ ] Cannot update other company users
- [ ] Cannot access other company users' data

### **3.2 System Config RLS (Task 1.1.1.3b)**
- [ ] Tier 1: full access (read + write)
- [ ] Tier 2: read-only access
- [ ] Company: read-only access
- [ ] Cannot modify module activation flags (non-Tier 1)

### **3.3 Audit Logs RLS (Task 1.1.1.3c)**
- [ ] MOH: sees all audit logs
- [ ] Company: sees own company's audit logs only
- [ ] Cannot access other companies' audit logs

### **3.4 Notifications RLS (Task 1.1.1.3d)**
- [ ] Users see own notifications only
- [ ] Cannot access other users' notifications
- [ ] Badge count reflects unread correctly

### **3.5 Communication Tables RLS (Task 1.1.1.3e)**
- [ ] Company isolation for conversations/messages
- [ ] MOH system-wide access
- [ ] Internal MOH conversations accessible to MOH only
- [ ] Participants can access conversation
- [ ] Read receipts scoped correctly

### **3.6 Governance Tables RLS (Task 1.1.1.3f)**
- [ ] Follow-ups: MOH sees all, company sees own
- [ ] Meetings: MOH sees all, company sees attended/related
- [ ] Create: MOH Tier 1/2 only
- [ ] Update: users can update assigned follow-ups

**Test Method:** Integration tests with role-based Supabase clients.

---

## **4. RPC Function Testing**

### **4.1 Shared RPC Functions (Tasks 1.1.1.4a-4d)**

**4.1.1 `shared_get_user_permissions` (Task 1.1.1.4a)**
- [ ] Permission matrix matches `approvals-authority-matrix.md` exactly
- [ ] All roles defined correctly (Company, MOH Tier 1, MOH Tier 2)
- [ ] All role × action combinations tested
- [ ] Module-specific permissions correct

**Pushback:** Permission matrix MUST be verified against `approvals-authority-matrix.md` before frontend uses it.

**4.1.2 `shared_check_module_active` (Task 1.1.1.4b)**
- [ ] Returns correct activation status
- [ ] Caching strategy works
- [ ] Handles missing config gracefully

**4.1.3 `shared_create_audit_log` (Task 1.1.1.4c)**
- [ ] Hash chaining works correctly
- [ ] Audit log created with correct fields
- [ ] Previous hash linked correctly
- [ ] RLS enforced

**4.1.4 `shared_create_notification` (Task 1.1.1.4d)**
- [ ] Single notification created
- [ ] Batch notifications created
- [ ] Recipients receive notifications
- [ ] RLS enforced

### **4.2 Communication RPC Functions (Tasks 1.1.1.4f-4k)**

**4.2.1 `communications_create_conversation`**
- [ ] Creates conversation with participants
- [ ] Lifecycle state set to `CREATED`
- [ ] Workflow entity linking (if provided)
- [ ] RLS enforced

**4.2.2 `communications_send_message`**
- [ ] Sends message in conversation
- [ ] Updates `delivered_at` (if applicable)
- [ ] Lifecycle state transitions correctly
- [ ] RLS enforced

**4.2.3 `communications_mark_read`**
- [ ] Marks messages as read
- [ ] Read receipts created
- [ ] Lifecycle state updates correctly
- [ ] RLS enforced

**4.2.4 `communications_archive_conversation`**
- [ ] Archives conversation
- [ ] Lifecycle state set to `ARCHIVED`
- [ ] RLS enforced

**4.2.5 `communications_create_announcement`**
- [ ] Creates system announcement (MOH Tier 1 only)
- [ ] Broadcasts to all users/companies
- [ ] Lifecycle state set to `CREATED`
- [ ] RLS enforced

**Test Method:** Integration tests with test database, transaction rollback after each test.

**Coverage:** Minimum 80% per function.

---

## **5. Edge Function Testing**

### **5.1 Email Notification Edge Function (Task 1.1.1.4e)**

**Test Requirements (Leila's Audit - Issue #53):**
- [ ] Unit tests: email notification logic (success, failure handling)
- [ ] Unit tests: authentication (valid JWT, invalid JWT, missing JWT)
- [ ] Integration tests: mock email service
- [ ] Error handling: network errors, email service errors, database errors
- [ ] HTTP status codes: 200 OK, 400 Bad Request, 500 Internal Server Error
- [ ] Retry logic for transient failures
- [ ] No sensitive information in error responses
- [ ] Audit logging with correlation ID

**Minimum Coverage:** 80%

**Test Method:** Deno test with mocks.

---

## **6. Frontend Component Testing**

### **6.1 Authentication Components (Task 1.1.1.13)**
- [ ] Login page: wireframe compliance, form validation, remember me functionality
- [ ] Registration page: wireframe compliance, password requirements, company fields
- [ ] Forgot/Reset password: wireframe compliance, email validation, reset flow

**Test Method:** React Testing Library + Playwright E2E tests

### **6.2 Layout Components (Tasks 1.1.1.15-15h)**
- [ ] Header: MOH logo, module indicator, search, notifications, user menu
- [ ] Sidebar: 280px width, two-line headers, active states, role-based navigation
- [ ] DashboardLayout: header + sidebar + main content layout
- [ ] Responsive breakpoints (mobile, tablet, desktop)

**Test Method:** React Testing Library + Playwright visual regression tests

### **6.3 Notification Components (Tasks 1.1.1.16-16n)**
- [ ] NotificationCenter: dropdown, unread indicators, mark all read
- [ ] Notification badge: unread count, "99+" for large counts
- [ ] Toast system: success/error/warning/info, positioning, auto-dismiss

**Test Method:** React Testing Library + Playwright E2E tests

### **6.4 Communication Components (Tasks 1.1.1.16g-16n)**
- [ ] CommunicationsInbox: conversation list, filters, search, real-time updates
- [ ] ConversationDetail: message thread, read receipts, reply interface
- [ ] ComposeMessage: recipient selection, workflow entity linking, form validation
- [ ] SentMessages: sent conversations list, status indicators
- [ ] SystemAnnouncements: MOH Tier 1 only, announcement creation, broadcast

**Test Method:** React Testing Library + Playwright E2E tests + visual regression

---

## **7. Integration Testing**

### **7.1 Authentication Flow**
- [ ] Login → dashboard redirect works
- [ ] Registration → email verification → login works
- [ ] Forgot password → email → reset → login works
- [ ] Protected routes enforce authentication
- [ ] Logout clears session

**Test Method:** Playwright E2E tests

### **7.2 Communication Lifecycle**
- [ ] Create conversation → send message → deliver → read flow works
- [ ] Lifecycle state transitions: CREATED → SENT → DELIVERED → READ
- [ ] Read receipts update in real-time
- [ ] Archive conversation works
- [ ] Workflow entity linking works

**Test Method:** Playwright E2E tests + integration tests

### **7.3 Notification System**
- [ ] Create notification → appears in NotificationCenter
- [ ] Badge count updates correctly
- [ ] Mark as read → badge count decreases
- [ ] Email notification sent (Edge Function)
- [ ] Real-time updates work

**Test Method:** Playwright E2E tests + integration tests

### **7.4 Audit Logging Integration**
- [ ] RPC functions create audit logs
- [ ] Hash chaining works correctly
- [ ] Audit logs visible per RLS policies
- [ ] Hash chain integrity maintained

**Test Method:** Integration tests with test database

---

## **8. Accessibility Testing (WCAG 2.1 AA)**

**Test Requirements (Task 1.1.1.17l):**
- [ ] Screen reader support (ARIA labels, semantic HTML)
- [ ] Keyboard navigation (Tab, Enter, Escape)
- [ ] Focus management (focus trap in modals)
- [ ] Color contrast (minimum 4.5:1 for text)
- [ ] Touch targets (minimum 40px×40px)
- [ ] ARIA live regions (dynamic content)

**Test Tools:** axe DevTools, keyboard navigation manual testing, screen reader testing (NVDA/JAWS)

**Pushback:** Accessibility MUST be verified before frontend tasks marked complete.

---

## **9. Test Data Requirements**

### **9.1 Test Database Isolation (Hassan)**

**Pushback:** Separate test database REQUIRED - test data must not pollute dev/staging.

**Requirements:**
- [ ] Separate test database (transaction rollback after each test)
- [ ] Test environment configuration
- [ ] CI/CD test integration
- [ ] Test data fixtures for common scenarios
- [ ] Test data cleanup after test runs

### **9.2 Test Fixtures**
- [ ] Test users (Company, MOH Tier 1, MOH Tier 2)
- [ ] Test companies (active, empty)
- [ ] Test conversations/messages (all lifecycle states)
- [ ] Test notifications (read, unread)
- [ ] Test follow-ups/meetings

**Location:** `tests/fixtures/` per `testing-framework.md`

---

## **10. Test Environment Setup**

### **10.1 Test Infrastructure (Task 1.1.1.21a)**
- [ ] Jest configured (Next.js integration)
- [ ] Test database configured
- [ ] CI/CD test integration
- [ ] Coverage collection configured
- [ ] Test utilities (test data creation, auth mocking, API testing)

**Status:** ✅ COMPLIANT (per Task 1.1.1.21a)

**Verification:**
- [ ] `frontend/jest.config.js` exists and configured
- [ ] `frontend/jest.setup.js` exists and configured
- [ ] Test database connection works
- [ ] Coverage thresholds configured

### **10.2 CI/CD Test Integration**
- [ ] Tests run on push/PR
- [ ] Test failures block merge
- [ ] Coverage reporting configured
- [ ] Test artifacts uploaded

**Status:** ✅ COMPLIANT (per Task 1.1.1.21)

**Verification:**
- [ ] `.github/workflows/ci.yml` includes test jobs
- [ ] Test job runs `npm test`
- [ ] Coverage reports generated

---

## **11. Acceptance Criteria**

### **11.1 Overall Subphase Acceptance**
- [ ] All migrations applied and verified
- [ ] **Seed data migration `seed_1_1_1_foundation` applied and verified**
- [ ] All RLS policies tested and passing
- [ ] All RPC functions tested (80% coverage minimum)
- [ ] All frontend components tested (wireframe compliance verified)
- [ ] Seed data validated under RLS (all roles tested)
- [ ] Integration tests passing
- [ ] Accessibility tests passing (WCAG 2.1 AA)
- [ ] E2E critical flows passing
- [ ] Test database isolation verified
- [ ] CI/CD test integration working

### **11.2 Seed Data Gate Acceptance**
**Note:** Detailed acceptance criteria moved to Section 0.1 (Prerequisites) above. This section references the prerequisite gate.

- [x] Seed Data Gate prerequisites met (see Section 0.1) ✅ COMPLETE (except RLS validation)
- [ ] RLS validation passed (all roles tested) ⚠️ PENDING - Requires role-based authentication testing

**Pushback:** Subphase NOT complete until seed data validated under RLS by all roles.

---

## **12. Test Execution Plan**

### **12.1 Test Phases**

**Phase 0: Seed Data Preparation (BLOCKING)**
- Seed migration creation (Farah)
- Seed migration application
- Seed data verification (Nadia, Farah, Hassan)

**Phase 1: Database & RLS (Hassan + Nadia + Rafi)**
- Migration verification
- Seed data integrity
- RLS policy testing

**Phase 2: Backend (Hassan + Maya + Leila)**
- RPC function unit/integration tests
- Edge Function testing
- Audit logging integration

**Phase 3: Frontend (Hassan + Emma)**
- Component unit tests
- Wireframe compliance verification
- Accessibility tests

**Phase 4: Integration & E2E (Hassan)**
- Integration tests
- E2E critical flows
- End-to-end workflows

### **12.2 Test Reporting**
- [ ] Test execution report (pass/fail per test)
- [ ] Coverage report (80% critical paths, 60% overall)
- [ ] RLS validation report (role × data matrix)
- [ ] Accessibility test report (WCAG 2.1 AA)
- [ ] E2E test report

---

## **13. Blocking Issues & Pushback**

**Critical Blockers:**
1. **Seed data migration not created/applied** → **BLOCK ALL TESTING until fixed**
2. **Seed data not validated under RLS** → **BLOCK until validated by all roles**
3. **Permission matrix not verified** → **BLOCK frontend permission usage**
4. **Test database not isolated** → **BLOCK all test execution**
5. **Coverage below 80% for critical paths** → **BLOCK until improved**
6. **Accessibility tests failing** → **BLOCK frontend tasks**

**Escalation:** All blocking issues must be resolved before subphase completion.

---

## **14. References**

- [Testing Framework](../../../08-deployment/testing-framework.md)
- [Phase 1.1 Playbook - Verification Checklist](../phase-1-1-mockdata.md#verification-checklist-must-be-executed-after-each-seed-migration)
- [Approvals Authority Matrix](../../../03-governance/approvals-authority-matrix.md)
- [RLS Policy Framework](../../../02-architecture/security/rls-policy-framework.md)
- [Backend Error Handling Framework](../../../02-architecture/security/backend-error-handling-framework.md)
- [Seed Migration Structure](../../../../../supabase/migrations/seed-1-1-1-foundation-structure.sql) (to be created by Farah)

---

**Test Plan Prepared:** 2026-01-18  
**Next Review:** After seed data migration is created and applied  
**Status:** Ready for execution (pending seed data migration)
