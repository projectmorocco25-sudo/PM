# Backlog - What's Next

**Last Updated:** 2026-01-15

---

## Immediate Next (After Current Sprint)

### Phase 1.1.3: RMM Integration Testing & Seed Data (Week 4)
- [ ] Integration testing tasks (1.1.3.1-1.1.3.5)
- [ ] Seed data generation and population (1.1.3.6-1.1.3.8)
- [ ] Documentation tasks (1.1.3.9-1.1.3.10)
- [ ] Integration checkpoint validations (1.1.3.11-1.1.3.14)

**Prerequisites:** Phase 1.1.2 must be complete

---

## Phase 1.2: VCI Development (Month 3)

### Subphase 1.2.1: VCI Module - AAMS Workflow (Week 1)
- [ ] Database migration for VCI AAMS tables
- [ ] RLS policies for VCI AAMS tables
- [ ] Threshold calculation logic
- [ ] AAMS RPC functions (submission, verification, approval, completion, rejection)
- [ ] AAMS frontend pages (list, form, detail, workflow actions)
- [ ] Threshold management page and modification form

**Prerequisites:** Phase 1.1 complete + Integration checkpoints validated

### Subphase 1.2.2: VCI Module - MSQ Workflow (Week 2)
- [ ] Database migration for VCI MSQ tables
- [ ] RLS policies for VCI MSQ tables
- [ ] MSQ validation logic (20% threshold comparison)
- [ ] MSQ RPC functions
- [ ] MSQ frontend pages
- [ ] MSQ correction interface (7-day grace period)

### Subphase 1.2.3: VCI Module - WSL Workflow & Breach Detection (Week 3)
- [ ] Database migration for VCI WSL tables (wsl_submissions, breaches, breach_analyses)
- [ ] RLS policies for VCI WSL tables
- [ ] WSL validation logic (deadline, stock vs threshold)
- [ ] Breach detection logic
- [ ] WSL and breach RPC functions
- [ ] WSL and breach frontend pages
- [ ] Governance Dashboard

### Subphase 1.2.4: VCI Seed Data Validation & Integration Testing (Week 4)
- [ ] Seed data generation (AAMS, MSQ, WSL, breaches)
- [ ] Integration testing
- [ ] Historical data backend tasks
- [ ] Historical data frontend tasks
- [ ] Documentation
- [ ] Integration checkpoint validations

---

## Phase 1.3: ECS Development (Month 4)

### Subphase 1.3.1: ECS Backend Foundation (Week 1)
- [ ] Database migration for ECS tables
- [ ] RLS policies for ECS tables
- [ ] XAMS calculation logic
- [ ] ECS Threshold calculation logic
- [ ] Conditional validation logic (CMC score-based)
- [ ] Export request RPC functions

### Subphase 1.3.2: ECS Workflow & Threshold Switching (Week 2)
- [ ] Export request workflow RPC functions
- [ ] Threshold switching logic (VCI → ECS)
- [ ] Intervention window logic
- [ ] Export authorization RPC function
- [ ] Scheduled triggers

### Subphase 1.3.3: ECS Post-Authorization & Replenishment (Week 3)
- [ ] Export completion report RPC function
- [ ] Replenishment schedule tracking logic
- [ ] Replenishment delay escalation
- [ ] ECS frontend pages (export requests, authorizations, replenishment)

### Subphase 1.3.4: ECS Integration Testing & Seed Data (Week 4)
- [ ] Integration contract verification
- [ ] Testing tasks
- [ ] Seed data generation
- [ ] Documentation
- [ ] Integration checkpoint validations

**Prerequisites:** Phase 1.2 complete + Integration checkpoints validated

---

## Phase 1.4: CMC Development (Month 5)

### Subphase 1.4.1: CMC Scoring Engine (Week 1)
- [ ] Database migration for CMC tables
- [ ] RLS policies for CMC tables
- [ ] Component score calculation functions
- [ ] Total score calculation (weighted average)
- [ ] Configurable component weights

### Subphase 1.4.2: CMC Monthly Calculation & Disputes (Week 2)
- [ ] Monthly score calculation RPC function
- [ ] Scheduled trigger for monthly calculation
- [ ] Event-triggered score recalculation
- [ ] Score override and review functions
- [ ] Dispute creation, review, and resolution RPC functions
- [ ] CMC frontend pages (scores, disputes)

### Subphase 1.4.3: CMC Reports & Integration (Week 3)
- [ ] Regulatory report generation RPC function
- [ ] Report review workflow
- [ ] CMC reports frontend pages
- [ ] Governance dashboard analytics

### Subphase 1.4.4: CMC Testing & Seed Data (Week 4)
- [ ] Testing tasks
- [ ] Seed data generation
- [ ] Documentation

**Prerequisites:** Phase 1.3 complete + Integration checkpoints validated

---

## Phase 1.5: Holistic MVP Testing (Month 6)

### Subphase 1.5.1: End-to-End Integration Testing (Week 1)
- [ ] Complete RMM workflow tests
- [ ] Complete VCI workflow tests
- [ ] Complete ECS workflow tests
- [ ] Complete CMC workflow tests
- [ ] Cross-module test scenarios
- [ ] Module activation/deactivation tests

### Subphase 1.5.2: Performance & Security Testing (Week 2)
- [ ] Load testing (75 companies concurrent)
- [ ] Large dataset queries (2-3 years historical)
- [ ] Dashboard performance
- [ ] RLS policy performance
- [ ] Security audit (authentication, authorization, RLS, input validation, audit logging)

### Subphase 1.5.3: Edge Cases & Error Handling (Week 3)
- [ ] Late submissions
- [ ] Missing data scenarios
- [ ] Concurrent update conflicts
- [ ] Error recovery (transaction rollbacks)
- [ ] Audit log integrity

### Subphase 1.5.4: Documentation & Customer Presentation (Week 4)
- [ ] Complete system documentation
- [ ] User manuals (company, MOH, role-specific)
- [ ] API documentation
- [ ] Administrator documentation
- [ ] Demo scenarios
- [ ] Presentation materials
- [ ] Video walkthroughs

**Prerequisites:** Phase 1.4 complete

---

## Priority Order

1. **Current:** Phase 1.1.2 (RMM Core) - Week 2-3
2. **Next:** Phase 1.1.3 (RMM Testing & Seed Data) - Week 4
3. **Then:** Phase 1.2 (VCI Development) - Month 3
4. **Then:** Phase 1.3 (ECS Development) - Month 4
5. **Then:** Phase 1.4 (CMC Development) - Month 5
6. **Finally:** Phase 1.5 (Holistic Testing) - Month 6

---

## Notes

- All phases are sequential with integration checkpoints between them
- Each phase must complete integration checkpoint validations before next phase begins
- Seed data gates apply before frontend development in each subphase
- Backend tasks must complete before frontend tasks in each subphase

---

**Reference:** [Phase 1 Implementation Plan](../phase-1.md)
