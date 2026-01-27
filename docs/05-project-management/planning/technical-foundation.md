# Technical Foundation Reference

**Last Updated:** 2026-01-15  
**Reference:** [Phase 0 Technical Foundation](../Archive/phase-0-technical-foundation.md)

---

## Technology Stack (Locked)

### Backend Platform
- **Supabase** (PostgreSQL, Auth, Storage, Edge Functions, Scheduled Triggers)
- **Database:** PostgreSQL via Supabase
- **Authentication:** Supabase Auth
- **Storage:** Supabase Storage
- **Background Jobs:** Supabase Edge Functions + Scheduled Triggers (pg_cron) + Background Job Queue (pg_boss)

### Frontend
- **Next.js** (React) with Supabase client libraries
- **Framework:** React with Next.js App Router

### Platform Rules
- **Rule:** In-app system is the system of record for governance actions, notifications, and communications

---

## Key Architectural Decisions

### 1. Module Communication Pattern ✅ Locked
**Decision:** Direct database access via Supabase (modules share same DB, RLS enforces boundaries)

**Rationale:** Supabase architecture, performance, simplicity

### 2. Workflow Engine Pattern
**Recommendation:** Database-driven state machines (status columns + RPC functions)

**Rationale:** Simpler, leverages Supabase, easier to query/audit

### 3. Audit Logging Strategy
**Recommendation:** Separate audit log table with hash chaining (Salim's approach)

**Rationale:** Full control, immutability, regulatory compliance

### 4. Background Job Architecture ✅ Locked
**Decision:** Supabase Edge Functions + Scheduled Triggers (pg_cron) + Background Job Queue (pg_boss or similar)

**Rationale:** Native Supabase capabilities for scheduled jobs, pg_boss for complex job queues with retry logic

**Job Types:**
- email_notification
- report_generation
- data_export
- scheduled_calculation

### 5. Notification Architecture ✅ Locked
**Decision:** In-app system as system of record (notifications stored in DB)

**Rationale:** Governance requirement, audit trail, user control

**Implementation:** Email notifications via Edge Functions (read from in-app notifications)

### 6. Module Integration Pattern ✅ Locked
**Decision:** Define explicit integration contracts between modules (RMM→VCI, VCI→ECS, ECS→CMC)

**Rationale:** Clear data flow specifications prevent integration issues, ensure threshold switching works correctly

**Reference:** [Module Dependency Diagram](../../02-architecture/modules/module-dependency-diagram.md)

### 7. Testing Infrastructure Strategy ✅ Locked
**Decision:** Separate test database with transaction rollback, CI/CD integration, comprehensive test fixtures

**Rationale:** Ensures reliable testing, prevents test data pollution, enables parallel test execution

**Reference:** [Testing Framework](../../08-deployment/testing-framework.md)

---

## Phase 0 Deliverables

### Week 1-4 Deliverables
1. **System Architecture Document** (`02-architecture/system-architecture.md`)
2. **Database Schema Design** (`02-architecture/database/schema-design.md`)
3. **API Specifications** (`02-architecture/api/`)
4. **Security Architecture** (`02-architecture/security/security-architecture.md`)
5. **Development Environment Setup** (`06-development/development-setup.md`)
6. **Technical Decision Log** (`06-development/technical-decisions/decision-log.md`)
7. **CI/CD Pipeline** (operational)

### Gap Resolution Deliverables (Priority 1 - Backend Security)
8. **Backend Validation Strategy** (`02-architecture/security/backend-validation-strategy.md`)
9. **Database Triggers Specification** (`02-architecture/database/database-triggers-specification.md`)
10. **Backend Input Sanitization Strategy** (`02-architecture/security/backend-input-sanitization-strategy.md`)
11. **Backend Error Handling Framework** (`02-architecture/security/backend-error-handling-framework.md`)
12. **API Security Middleware Architecture** (`02-architecture/security/api-security-middleware-architecture.md`)
13. **Secrets Management Architecture** (`02-architecture/security/secrets-management-architecture.md`)
14. **Database Transaction Management Strategy** (`02-architecture/database/database-transaction-management-strategy.md`)
15. **Database Concurrency Control Strategy** (`02-architecture/database/database-concurrency-control-strategy.md`)
16. **File Upload and Storage Security** (`02-architecture/security/file-upload-storage-security.md`)
17. **Frontend Routing Structure** (`02-architecture/frontend/routing-structure.md`)

### Phase 1 Audit Resolution Deliverables
18. **Module Integration Contracts** (`02-architecture/integration/integration-architecture.md`)
19. **Background Job Queue Specifications** (documented in Phase 1 Implementation Plan)
20. **Testing Infrastructure Specifications** (`08-deployment/testing-framework.md`)
21. **Implementation Standards** (`05-project-management/phases/phase-1-implementation-standards.md`)

---

## Phase 0 Team Assignments

| Week | Focus | Lead | Team Members |
|------|-------|------|--------------|
| Week 1 | Core Architecture & System Design | Oliver | All team: Architecture review |
| Week 2 | Data Architecture & Schema Foundation | Nadia + Rafi | Oliver: Coordination and review |
| Week 3 | Integration Architecture & API Design | Maya | Oliver: Coordination and review |
| Week 4 | Security & Infrastructure Foundation | Salim + Leila | Oliver: Coordination and integration testing |

---

## Success Criteria

✅ Technology stack confirmed and documented  
✅ Database schema complete and reviewed  
✅ API specifications ready for implementation  
✅ Security framework designed  
✅ Development environment operational  
✅ CI/CD pipeline functional  
✅ Team aligned on architecture  
✅ Technical decision log complete

**Status:** ✅ **ALL SUCCESS CRITERIA MET**

---

## Review Status

✅ **Regulatory/Governance Review:** Approved by Fatima (MOH Governance & Regulation SME)  
✅ **Technical Review:** Approved by all technical team members (Oliver, Nadia, Rafi, Maya, Salim, Leila)  
✅ **Phase 0 Sign-off:** Complete - All reviewers approved

---

## Related Documents

### Architecture Documents
- [System Architecture](../../02-architecture/system-architecture.md)
- [Module Dependency Diagram](../../02-architecture/modules/module-dependency-diagram.md)
- [Integration Architecture](../../02-architecture/integration/integration-architecture.md)
- [Deployment Architecture](../../02-architecture/deployment-architecture.md)
- [Database Schema](../../02-architecture/database/schema-design.md)
- [Technical Decision Log](../../06-development/technical-decisions/decision-log.md)

### Subsequent Phase Documents
- [Phase 0.5: UI/UX Wireframes](../Archive/phase-0-5-wireframes-catalog.md) ✅ COMPLETE
- [Phase 0.6: Database Schema Audit](../Archive/phase-0-6-databases.md) ✅ COMPLETE
- [Phase 1 Implementation Plan](../phase-1.md) ✅ APPROVED FOR IMPLEMENTATION

---

**Reference:** [Phase 0 Technical Foundation](../Archive/phase-0-technical-foundation.md)
