# Project Plan - Pharmaceutical Governance Value Chain Platform (PM)

**Project Manager:** Yasmine  
**Last Updated:** 2025-12-31  
**Status:** Planning

## Executive Summary

The Pharmaceutical Governance Value Chain Platform (PM) will be delivered in 12 months through a structured phased approach. The project uses a comprehensive mock data strategy (75 companies) for development, testing, and customer presentation, followed by a real company pilot (20-30 companies) before full production rollout.

**Total Timeline:** 12 months (from technical foundation to full production)

## Platform & Deployment Model (Locked)

- **Backend Platform:** Supabase (PostgreSQL database, Supabase Authentication, Supabase Storage, Supabase Edge Functions, Scheduled Triggers/Cron)
- **Frontend:** Next.js (React) application using Supabase client libraries
- **Rule:** In-app system remains the system of record for governance actions, notifications, and communications

## Mock Data Strategy

- **75 Mock Companies:** 15 IPCs + 60 Wholesalers with diverse profiles
- **Historical Data:** 2-3 years of historical data (AAMS, MSQ, WSL, exports, compliance)
- **Usage:** Development, testing, customer MVP presentation, and MOH UAT
- **Benefits:** Zero risk to real companies, comprehensive testing coverage, realistic demonstrations

## Project Phases

### Phase 0: Technical Foundation (Month 1 - 4 weeks)

**Objective:** Establish technical architecture and development foundation

**Week 1: Core Architecture & System Design (Oliver leads)**
- Supabase-based system architecture
- Module architecture and dependencies
- Edge Functions and Scheduled Triggers strategy
- Deployment architecture

**Week 2: Data Architecture & Schema Foundation (Nadia + Rafi lead)**
- PostgreSQL database schema design
- RLS (Row Level Security) policy framework
- Data integrity rules and constraints

**Week 3: Integration Architecture & API Design (Maya leads)**
- Supabase RPC function architecture
- API specifications (RESTful + Edge Functions)
- Workflow architecture and state machines

**Week 4: Security & Infrastructure Foundation (Salim + Leila lead)**
- Supabase Auth integration
- Audit logging architecture
- Development environment setup (Supabase CLI, Docker)
- CI/CD pipeline setup
- Testing framework

**Deliverables:**
- System architecture document
- Database schema design
- API specifications
- Security framework
- Development environment operational
- Technical decision log
- CI/CD pipeline functional

**Success Criteria:**
- Technology stack confirmed and documented
- Database schema complete and reviewed
- API specifications ready for implementation
- Security framework designed
- Development environment operational
- Team aligned on architecture

---

### Phase 1: Development with Mock Data (Months 1-6)

#### Phase 1.1: RMM + VCI Development (Months 2-3)

**Objective:** Build core modules (Registry Management and Value Chain Intelligence)

**Activities:**
- User roles & RBAC implementation
- RMM module development (Company, Product, SKU registry management)
- VCI module development (AAMS, MSQ, WSL submissions, threshold calculation, breach detection)
- Mock data population (75 companies, 2-3 years historical data)
- Internal testing

**Deliverables:**
- RMM module functional
- VCI module functional
- Mock data populated (75 companies)
- Internal testing completed
- Documentation for RMM + VCI

**Success Criteria:**
- All RMM workflows functional (CRUD, approval chains, two-person rule)
- All VCI workflows functional (submissions, threshold calculation, breach detection)
- Mock data successfully populated
- Internal testing passed
- Documentation complete

---

#### Phase 1.2: ECS Development (Month 4)

**Objective:** Build Export Control System module

**Activities:**
- ECS module development (export request submission, conditional validation, threshold switching)
- Integration with RMM + VCI
- Mock export data population
- Internal testing

**Deliverables:**
- ECS module functional
- Integration with RMM + VCI validated
- Mock export data populated
- Internal testing completed
- Documentation for ECS

**Success Criteria:**
- All ECS workflows functional (export requests, approvals, threshold switching)
- Integration with RMM + VCI working correctly
- Mock export scenarios tested
- Internal testing passed

---

#### Phase 1.3: CMC Development (Month 5)

**Objective:** Build Compliance Monitoring Center module

**Activities:**
- CMC module development (compliance scoring, dispute workflow, report generation)
- Integration with all modules (RMM, VCI, ECS)
- Mock compliance data population
- Internal testing

**Deliverables:**
- CMC module functional
- Integration with all modules validated
- Mock compliance data populated
- Internal testing completed
- Documentation for CMC

**Success Criteria:**
- All CMC workflows functional (scoring, disputes, reports)
- Integration with all modules working correctly
- Mock compliance scenarios tested
- Internal testing passed

---

#### Phase 1.4: Holistic MVP Testing (Month 6)

**Objective:** Comprehensive end-to-end testing and customer presentation preparation

**Activities:**
- End-to-end testing across all modules
- Performance testing at scale (75 companies)
- Security testing
- Customer presentation preparation
- Demo scenario preparation

**Deliverables:**
- Holistic testing completed
- All issues resolved
- Customer presentation ready
- Complete system documentation
- Performance benchmarks met

**Success Criteria:**
- All modules working together correctly
- Performance targets met
- Security requirements validated
- Customer presentation materials ready
- System ready for MOH UAT

---

### Phase 2: MOH UAT with Mock Data (Month 7)

**Objective:** MOH validation of system functionality with mock data

**Activities:**
- MOH Tier 1 and Tier 2 Officers test with mock data
- Validate workflows, approvals, governance
- Gather feedback on UI/UX and functionality
- Incorporate feedback
- Sign-off on functionality

**Deliverables:**
- MOH UAT sign-off
- Feedback incorporated
- System ready for real company pilot

**Success Criteria:**
- All workflows validated by MOH
- Governance requirements confirmed
- MOH sign-off received
- System ready for real data

---

### Phase 3: Real Company Pilot (Month 8)

**Objective:** Validate system with real companies and real data

**Activities:**
- 20-30 real companies onboarded (5-7 IPCs + 15-23 Wholesalers)
- Real data integration
- ERP integration validation
- User feedback and adoption testing
- Production readiness validation

**Deliverables:**
- Real company pilot completed
- Integration validated
- User adoption feedback
- Production readiness confirmed

**Success Criteria:**
- 20-30 companies successfully onboarded
- Real workflows validated
- ERP integration working
- User adoption positive
- Production readiness confirmed

---

### Phase 4: Full Production Rollout (Months 9-12)

**Objective:** Deploy system to all companies with full support

**Activities:**
- Remaining companies onboarded (gradual rollout)
- Full support model active
- Monitor and optimize
- Continuous improvement based on feedback

**Deliverables:**
- Full production deployment
- All companies onboarded
- Support processes established
- Success metrics achieved

**Success Criteria:**
- All companies onboarded
- System operating at scale
- Support processes functioning
- Success metrics met

---

## Timeline Summary

| Phase | Duration | Months | Status |
|-------|----------|--------|--------|
| Phase 0: Technical Foundation | 4 weeks | Month 1 | Planning |
| Phase 1.1: RMM + VCI | 2 months | Months 2-3 | Not Started |
| Phase 1.2: ECS | 1 month | Month 4 | Not Started |
| Phase 1.3: CMC | 1 month | Month 5 | Not Started |
| Phase 1.4: Holistic Testing | 1 month | Month 6 | Not Started |
| Phase 2: MOH UAT | 1 month | Month 7 | Not Started |
| Phase 3: Real Company Pilot | 1 month | Month 8 | Not Started |
| Phase 4: Full Production | 4 months | Months 9-12 | Not Started |
| **Total** | **12 months** | **Months 1-12** | **Planning** |

## Key Success Factors

1. **Mock Data Strategy:** Enables comprehensive testing without real company risk
2. **Phased Development:** Allows progressive validation and issue identification
3. **Technical Foundation:** Ensures solid architecture before module development
4. **MOH UAT:** Validates governance requirements before real deployment
5. **Real Company Pilot:** Validates production readiness with manageable scale
6. **Gradual Rollout:** Reduces risk in production deployment

## Risk Mitigation

- **Mock Data Testing:** Reduces real-world risk during development
- **Phased Approach:** Allows early issue identification
- **Technical Foundation:** Prevents rework during development
- **MOH UAT:** Validates requirements before real deployment
- **Pilot Phase:** Validates production readiness with manageable scale

## Related Documents

- [Phase Plans](phases/) - Detailed phase-specific plans
- [Milestones](milestones/) - Milestone tracking
- [Deliverables](deliverables/) - Deliverables register
- [Risk Register](risks-issues/risk-register.md) - Risk management
- [Status Reports](status-reports/) - Project status reports

---

**Next Review Date:** [To be scheduled]  
**Owner:** Yasmine (Project Manager)

