# Project Plan - Pharmaceutical Governance Value Chain Platform (PM)

**Last Updated:** 2026-01-26  
**Project:** Pharmaceutical Governance Value Chain Platform (PM)  
**Client:** Ministry of Health (MOH) – Morocco  
**Status:** 🟡 IN PROGRESS - Phase 1 Development

---

## Executive Summary

The Pharmaceutical Governance Value Chain Platform (PM) is a secure digital portal designed to strengthen governance, oversight, and regulatory compliance across Morocco's pharmaceutical value chain. The platform enables Industrial Pharmaceutical Companies (IPCs) and wholesalers to meet their reporting obligations while providing MOH with real-time visibility into stock sufficiency, compliance, and export activities.

**Key Characteristics:**
- **Modular Architecture:** Core modules (RMM, VCI) + Optional modules (ECS, CMC)
- **License-Controlled:** Optional modules can be activated as needed
- **Role-Based Access:** Tiered permissions for MOH DMP staff, IPCs, wholesalers, and auditors
- **Regulatory Compliance:** Complete audit trails, 7-year data retention, regulatory reporting

---

## Project Overview

### Client & Stakeholders
- **Client:** Ministry of Health (MOH) – Morocco
- **Primary Users:** MOH DMP staff, IPCs, Wholesalers, Auditors
- **Project Team:** See [Team Assignments](#team-assignments)

### Project Objectives
1. Enable digital reporting for IPCs and wholesalers
2. Provide real-time stock sufficiency monitoring
3. Automate compliance monitoring and enforcement
4. Support export control while protecting national stock
5. Generate regulatory reports and compliance scores

### Success Criteria
- ≥99.5% system uptime
- 90% of registered companies actively using system within 6 months
- 100% compliance with regulatory reporting deadlines
- 70% reduction in manual reporting time
- Positive feedback from MOH leadership

---

## Project Phases

### Phase 0: Technical Foundation ✅ COMPLETE
**Duration:** 4 weeks (Month 1)  
**Status:** ✅ COMPLETE  
**Lead:** Oliver (Chief Architect)

**Deliverables:**
- System architecture design
- Database schema design
- API specifications
- Security architecture
- Development environment setup
- CI/CD pipeline configuration

📋 **Details:** [Technical Foundation](planning/technical-foundation.md) | [Phase 0 Archive](../Archive/phase-0-technical-foundation.md)

---

### Phase 0.5: UI/UX Wireframes & Design Validation ✅ COMPLETE
**Duration:** 2-3 weeks  
**Status:** ✅ COMPLETE

**Deliverables:**
- 120+ wireframes across all modules
- Wireframe organization by priority
- Design validation with stakeholders
- Wireframe-to-route mapping

📋 **Details:** [Wireframe Catalog](../Archive/phase-0-5-wireframes-catalog.md)

---

### Phase 0.6: Database Schema Audit & Alignment ✅ COMPLETE
**Duration:** 5-7 days  
**Status:** ✅ COMPLETE

**Deliverables:**
- Complete audit of all wireframes against schema
- Gap analysis and resolution (8 critical gaps)
- Schema updates and migration scripts

📋 **Details:** [Database Schema Audit](../Archive/phase-0-6-databases.md)

---

### Phase 1: Development with Seeded Supabase Data 🟡 IN PROGRESS
**Duration:** Months 2-6  
**Status:** 🟡 IN PROGRESS (~30%)

#### Phase 1.1: RMM Development (Month 2) 🟡 IN PROGRESS
- **Status:** 🟡 IN PROGRESS (~30%)
- **Objective:** Build Registry Management Module (RMM) as foundation
- **Deliverables:** Company/Product/SKU management, Registry workflows, Enforcement module

#### Phase 1.2: VCI Development (Month 3) ⚪ NOT STARTED
- **Prerequisites:** Phase 1.1 complete + integration checkpoints validated
- **Objective:** Build Value Chain Intelligence Module (VCI)
- **Deliverables:** AAMS/MSQ/WSL workflows, Threshold management, Breach detection

#### Phase 1.3: ECS Development (Month 4) ⚪ NOT STARTED
- **Prerequisites:** Phase 1.2 complete + integration checkpoints validated
- **Objective:** Build Export Control System module
- **Deliverables:** Export request management, Authorization workflows, Threshold switching

#### Phase 1.4: CMC Development (Month 5) ⚪ NOT STARTED
- **Prerequisites:** Phase 1.3 complete + integration checkpoints validated
- **Objective:** Build Compliance Monitoring Center module
- **Deliverables:** Compliance score calculation, Score disputes, Regulatory reports

#### Phase 1.5: Holistic MVP Testing (Month 6) ⚪ NOT STARTED
- **Prerequisites:** Phase 1.4 complete
- **Objective:** End-to-end integration testing and validation
- **Deliverables:** Integration testing, Performance testing, Security audit, Documentation

📋 **Details:** [Phase 1 Implementation Plan](phase-1.md) | [Roadmap](planning/roadmap.md) | [Milestones](planning/milestones.md)

---

### Phase 2: MOH UAT & Production Deployment ⚪ NOT STARTED
**Duration:** TBD  
**Status:** ⚪ NOT STARTED

**Deliverables:**
- User Acceptance Testing with MOH
- Production deployment
- User training
- Go-live support

---

## Module Architecture

### Core Modules (Always Active)
1. **RMM (Registry Management Module)** - Authoritative registry for all entities
2. **VCI (Value Chain Intelligence)** - Submission workflows and monitoring

### Optional Modules (License-Controlled)
3. **ECS (Export Control System)** - Export authorization and threshold switching
4. **CMC (Compliance Monitoring Center)** - Compliance scoring and reporting

**Module Dependencies:**
```
RMM (Foundation)
  │
  ├─→ VCI (requires RMM)
  │     │
  │     ├─→ ECS (requires RMM + VCI)
  │     │
  │     └─→ CMC (requires RMM + VCI, enhanced if ECS active)
```

📋 **Details:** [System Architecture](../../02-architecture/system-architecture.md) | [Module Dependencies](planning/dependencies.md)

---

## Technology Stack

### Backend
- **Platform:** Supabase (PostgreSQL, Auth, Storage, Edge Functions)
- **Database:** PostgreSQL via Supabase
- **Authentication:** Supabase Auth
- **Background Jobs:** Supabase Edge Functions + Scheduled Triggers (pg_cron) + pg_boss

### Frontend
- **Framework:** Next.js 13+ (React, App Router)
- **UI Library:** Tailwind CSS + shadcn/ui
- **State Management:** TanStack Query + React Context
- **Forms:** React Hook Form + Zod

### Deployment
- **Frontend:** Vercel
- **Backend:** Supabase Cloud
- **CI/CD:** GitHub Actions / Vercel CI/CD

📋 **Details:** [Technical Foundation](planning/technical-foundation.md) | [Deployment Architecture](../../02-architecture/deployment-architecture.md)

---

## Team Assignments

| Module/Phase | Owner | Team Members |
|--------------|-------|--------------|
| Architecture | Oliver | - |
| Database | Nadia | - |
| Security/RLS | Rafi | - |
| Backend/API | Maya | - |
| Frontend/UI | Emma | - |
| Testing | Hassan | - |
| Seed Data | Farah | - |
| Compliance | Sami | - |
| Project Management | Yasmine | - |

📋 **Details:** [Project Status Dashboard](README.md)

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

📋 **Details:** [Milestones](planning/milestones.md)

---

## Risk Management

### Technical Risks
- **System Integration Complexity:** Mitigation through early API design and phased integration
- **Performance Issues:** Mitigation through load testing and scalable architecture
- **Data Migration Challenges:** Mitigation through data mapping and validation tools

### Regulatory Risks
- **MOH Approval Delays:** Mitigation through early stakeholder engagement
- **Regulatory Policy Changes:** Mitigation through flexible architecture and change control process

### Organizational Risks
- **User Adoption Resistance:** Mitigation through comprehensive training and change management
- **Insufficient SME Availability:** Mitigation through dedicated SME allocation

---

## Compliance & Standards

### Development Standards
- **Wireframe-First Implementation:** Wireframes are PRIMARY design reference
- **Database Compliance:** All frontend tasks must comply with database schema
- **Sequential Execution:** Tasks must be completed in order
- **No Local Mocks:** All data must come from Supabase

📋 **Details:** [Compliance Rules](standards/compliance-rules.md) | [Definition of Done](standards/definition-of-done.md) | [PR Requirements](standards/pr-requirements.md)

---

## Related Documentation

### Planning Documents
- [Project Brief](../../00-overview/Project%20Brief%20–%20PM.md) - High-level project overview
- [Roadmap](planning/roadmap.md) - Detailed phase breakdown
- [Milestones](planning/milestones.md) - Key deliverables and dates
- [Dependencies](planning/dependencies.md) - Module dependencies
- [Technical Foundation](planning/technical-foundation.md) - Technology stack and decisions

### Implementation Documents
- [Phase 1 Implementation Plan](phase-1.md) - Detailed implementation tasks
- [Seed Data Playbook](planning/seed-data-playbook.md) - Seed data strategy
- [Project Status Dashboard](README.md) - Current status and progress

### Architecture Documents
- [System Architecture](../../02-architecture/system-architecture.md) - Overall system design
- [Workflow Architecture](../../02-architecture/workflow-architecture.md) - Workflow specifications
- [Database Schema](../../02-architecture/database/schema-design.md) - Database design
- [API Specifications](../../02-architecture/api/) - API documentation

### Standards & Compliance
- [Compliance Rules](standards/compliance-rules.md) - Development compliance requirements
- [Wireframe Compliance](standards/wireframe-compliance.md) - Wireframe implementation standards
- [Definition of Done](standards/definition-of-done.md) - Task completion criteria
- [PR Requirements](standards/pr-requirements.md) - Pull request standards

---

## Quick Links

### Current Status
- [Project Status Dashboard](README.md) - Current progress and status
- [Current Sprint](execution/current-sprint.md) - Active work
- [Backlog](execution/backlog.md) - Upcoming work
- [Completed](execution/completed.md) - Finished work

### Planning
- [Roadmap](planning/roadmap.md) - Phase overview
- [Milestones](planning/milestones.md) - Key dates
- [Dependencies](planning/dependencies.md) - Module relationships

### Implementation
- [Phase 1 Plan](phase-1.md) - Detailed implementation tasks
- [Feature Tracking](../../02-architecture/feature-index.md) - Feature status

---

**Last Updated:** 2026-01-26  
**Maintained By:** Yasmine (Project Manager)  
**Next Review:** Monthly or after major phase completion
