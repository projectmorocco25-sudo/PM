# Project Roadmap

**Last Updated:** 2026-01-15

---

## High-Level Phases

### Phase 0: Technical Foundation ✅ COMPLETE
**Duration:** 4 weeks (Month 1)  
**Status:** ✅ COMPLETE - ALL DELIVERABLES APPROVED  
**Lead:** Oliver (Chief Architect)

**Week 1: Core Architecture & System Design**
- Supabase-based system architecture design
- Module architecture and dependencies
- Edge Functions and Scheduled Triggers strategy
- Deployment architecture
- Technology stack finalization (Supabase + Next.js)

**Week 2: Data Architecture & Schema Foundation**
- PostgreSQL database schema design
- Entity relationship modeling
- RLS (Row Level Security) policy framework design
- Data integrity rules and constraints
- Migration strategy

**Week 3: Integration Architecture & API Design**
- Supabase RPC function architecture design
- API specifications (RESTful + Edge Functions)
- Workflow architecture and state machines
- Integration patterns (ERP, customs)
- Error handling patterns

**Week 4: Security & Infrastructure Foundation**
- Supabase Auth integration design
- Authorization framework (RBAC integration with RLS)
- Audit logging architecture design
- Development environment setup
- CI/CD pipeline setup
- Testing framework setup

**Key Decisions:**
- ✅ Technology Stack: Supabase (PostgreSQL, Auth, Storage, Edge Functions) + Next.js
- ✅ Module Communication: Direct database access via Supabase with RLS
- ✅ Background Jobs: Supabase Edge Functions + Scheduled Triggers (pg_cron) + pg_boss
- ✅ Notifications: In-app system as system of record
- ✅ Module Integration: Explicit integration contracts between modules
- ✅ Testing: Separate test database with transaction rollback

**Deliverables:**
- System architecture document
- Database schema design
- API specifications
- Security architecture
- Development environment setup
- CI/CD pipeline configuration
- Testing framework
- Technical decision log

**Reference:** [Phase 0 Technical Foundation](../Archive/phase-0-technical-foundation.md)

---

### Phase 0.5: UI/UX Wireframes & Design Validation ✅ COMPLETE
**Duration:** 2-3 weeks  
**Status:** ✅ COMPLETE

- 120+ wireframes created across all modules
- Wireframe organization by priority
- Design validation with stakeholders
- Wireframe-to-route mapping

---

### Phase 0.6: Database Schema Audit & Alignment ✅ COMPLETE
**Duration:** 5-7 days  
**Status:** ✅ COMPLETE

- Complete audit of all wireframes against schema
- Gap analysis and resolution
- Schema updates (8 critical gaps)
- Migration scripts prepared

---

### Phase 1: Development with Seeded Supabase Data 🟡 IN PROGRESS
**Duration:** Months 2-6  
**Status:** 🟡 IN PROGRESS

#### Phase 1.1: RMM Development (Month 2) 🟡 IN PROGRESS
- **Duration:** 4 weeks
- **Status:** 🟡 IN PROGRESS (~30%)
- **Objective:** Build Registry Management Module (RMM) as foundation
- **Deliverables:**
  - Company, Product, SKU management
  - Registry submission workflow
  - Enforcement module
  - Seed data (75 companies)

#### Phase 1.2: VCI Development (Month 3) ⚪ NOT STARTED
- **Duration:** 4 weeks
- **Status:** ⚪ NOT STARTED
- **Prerequisites:** Phase 1.1 complete + integration checkpoints validated
- **Objective:** Build Value Chain Intelligence Module (VCI)
- **Deliverables:**
  - AAMS workflow (Annual Average Monthly Sales)
  - MSQ workflow (Monthly Sales Quantities)
  - WSL workflow (Weekly Stock Levels)
  - Threshold management
  - Breach detection and compliance violations

#### Phase 1.3: ECS Development (Month 4) ⚪ NOT STARTED
- **Duration:** 4 weeks
- **Status:** ⚪ NOT STARTED
- **Prerequisites:** Phase 1.2 complete + integration checkpoints validated
- **Objective:** Build Export Control System module
- **Deliverables:**
  - Export request management
  - Export authorization workflow
  - Threshold switching (VCI → ECS)
  - Replenishment schedule tracking

#### Phase 1.4: CMC Development (Month 5) ⚪ NOT STARTED
- **Duration:** 4 weeks
- **Status:** ⚪ NOT STARTED
- **Prerequisites:** Phase 1.3 complete + integration checkpoints validated
- **Objective:** Build Compliance Monitoring Center module
- **Deliverables:**
  - Compliance score calculation
  - Score disputes
  - Regulatory reports

#### Phase 1.5: Holistic MVP Testing (Month 6) ⚪ NOT STARTED
- **Duration:** 4 weeks
- **Status:** ⚪ NOT STARTED
- **Prerequisites:** Phase 1.4 complete
- **Objective:** End-to-end integration testing and validation
- **Deliverables:**
  - Integration testing
  - Performance testing
  - Security audit
  - Documentation
  - Customer presentation materials

---

## Future Phases

### Phase 2: MOH UAT & Production Deployment ⚪ NOT STARTED
**Duration:** TBD  
**Status:** ⚪ NOT STARTED

- User Acceptance Testing with MOH
- Production deployment
- User training
- Go-live support

---

## Phase Dependencies

```
Phase 0 → Phase 0.5 → Phase 0.6 → Phase 1.1 → Phase 1.2 → Phase 1.3 → Phase 1.4 → Phase 1.5 → Phase 2
```

### Integration Checkpoints
- **After Phase 1.1:** Validate RMM supports VCI requirements
- **After Phase 1.2:** Validate VCI supports ECS requirements
- **After Phase 1.3:** Validate ECS supports CMC requirements
- **After Phase 1.4:** Ready for Phase 1.5 holistic testing

---

## Key Milestones

| Milestone | Target Date | Status |
|-----------|-------------|--------|
| Phase 0 Complete | Month 1 | ✅ COMPLETE |
| Phase 0.5 Complete | Month 1 | ✅ COMPLETE |
| Phase 0.6 Complete | Month 1 | ✅ COMPLETE |
| Phase 1.1 Complete (RMM) | End of Month 2 | 🟡 IN PROGRESS |
| Phase 1.2 Complete (VCI) | End of Month 3 | ⚪ NOT STARTED |
| Phase 1.3 Complete (ECS) | End of Month 4 | ⚪ NOT STARTED |
| Phase 1.4 Complete (CMC) | End of Month 5 | ⚪ NOT STARTED |
| Phase 1.5 Complete (Testing) | End of Month 6 | ⚪ NOT STARTED |
| Phase 2 (UAT) | TBD | ⚪ NOT STARTED |

📋 **Details:** [milestones.md](./milestones.md)

---

## Risk Mitigation

### Timeline Risks
- **Mitigation:** Clear dependencies, integration checkpoints, buffer time in each phase
- **Contingency:** Simplified features if timeline tight, can expand later

### Integration Risks
- **Mitigation:** Integration checkpoints between phases, clear module interfaces
- **Contingency:** Additional integration testing time in Phase 1.5

### Technical Risks
- **Mitigation:** Early testing, performance monitoring, security validation
- **Contingency:** Performance tuning, security fixes in Phase 1.5

---

**Reference:** [Phase 1 Implementation Plan](../phase-1.md)
