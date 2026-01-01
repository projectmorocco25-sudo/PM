# Phase 1 Implementation Plan - Pharmaceutical Governance Value Chain Platform (PM)

**Phase:** Phase 1 - Development with Mock Data (Months 2-6)  
**Status:** Ready to Begin  
**Prerequisites:** Phase 0 (Technical Foundation) ✅ COMPLETE

---

## Phase 1 Overview

Phase 1 delivers the complete MVP with mock data, organized into 4 sequential subphases:
1. **Phase 1.1:** RMM + VCI Development (Months 2-3)
2. **Phase 1.2:** ECS Development (Month 4)
3. **Phase 1.3:** CMC Development (Month 5)
4. **Phase 1.4:** Holistic MVP Testing (Month 6)

---

# PHASE 1.1: RMM + VCI DEVELOPMENT (Months 2-3)

**Duration:** 8 weeks  
**Objective:** Build core modules (Registry Management and Value Chain Intelligence) with comprehensive mock data

## Subphase 1.1.1: Foundation & Infrastructure Setup (Week 1)

### Backend Setup Tasks
- [ ] **Task 1.1.1.1:** Initialize Supabase project structure (migrations, functions, storage buckets)
- [ ] **Task 1.1.1.2:** Create database migration for core tables (users, system_config, audit_logs, notifications)
- [ ] **Task 1.1.1.3:** Implement RLS policies for core tables (users, system_config, audit_logs, notifications)
- [ ] **Task 1.1.1.4:** Create shared RPC functions (shared_get_user_permissions, shared_check_module_active, shared_create_audit_log, shared_create_notification)
- [ ] **Task 1.1.1.5:** Implement audit logging triggers (audit_logs table triggers)
- [ ] **Task 1.1.1.6:** Set up Supabase Auth configuration (email/password, password policies)
- [ ] **Task 1.1.1.7:** Create database migration for RMM core tables (companies, products, skus, atc_codes, critical_medicines)
- [ ] **Task 1.1.1.8:** Implement RLS policies for RMM tables
- [ ] **Task 1.1.1.9:** Create database migration for VCI core tables (aams_submissions, msq_submissions, wsl_submissions, thresholds, breaches, breach_analyses)
- [ ] **Task 1.1.1.10:** Implement RLS policies for VCI tables

### Frontend Setup Tasks
- [ ] **Task 1.1.1.11:** Initialize Next.js project structure (app router, layout structure)
- [ ] **Task 1.1.1.12:** Set up Supabase client configuration (create client utilities, environment variables)
- [ ] **Task 1.1.1.13:** Implement authentication pages (login, register, forgot-password, reset-password)
- [ ] **Task 1.1.1.14:** Create protected route middleware (auth check, role-based access)
- [ ] **Task 1.1.1.15:** Implement base layout components (dashboard layout, navigation, header, footer)
- [ ] **Task 1.1.1.16:** Create notification center component (in-app notifications UI)
- [ ] **Task 1.1.1.17:** Set up Tailwind CSS and shadcn/ui component library
- [ ] **Task 1.1.1.18:** Create routing structure (public routes, auth routes, dashboard routes)
- [ ] **Task 1.1.1.19:** Implement homepage (public landing page with MOH mission focus)
- [ ] **Task 1.1.1.20:** Create dashboard home page (role-based dashboard view)

### Integration Tasks
- [ ] **Task 1.1.1.21:** Set up CI/CD pipeline (GitHub Actions or Vercel)
- [ ] **Task 1.1.1.22:** Configure environment variables (dev, staging, prod)
- [ ] **Task 1.1.1.23:** Set up database seeding script structure (mock data generation framework)

---

## Subphase 1.1.2: RMM Module - Core Registry Management (Week 2-3)

### RMM Backend Tasks
- [ ] **Task 1.1.2.1:** Create RMM RPC functions - Company CRUD (rmm_create_company, rmm_update_company, rmm_get_company, rmm_list_companies)
- [ ] **Task 1.1.2.2:** Create RMM RPC functions - Product CRUD (rmm_create_product, rmm_update_product, rmm_get_product, rmm_list_products)
- [ ] **Task 1.1.2.3:** Create RMM RPC functions - SKU CRUD (rmm_create_sku, rmm_update_sku, rmm_get_sku, rmm_list_skus)
- [ ] **Task 1.1.2.4:** Create RMM RPC functions - ATC Code management (rmm_list_atc_codes, rmm_get_atc_code) - MOH only
- [ ] **Task 1.1.2.5:** Create RMM RPC functions - Critical Medicine management (rmm_designate_critical_medicine, rmm_list_critical_medicines) - MOH only
- [ ] **Task 1.1.2.6:** Implement registry submission workflow - Create submission (rmm_submit_registry_update)
- [ ] **Task 1.1.2.7:** Implement registry submission workflow - Tier 2 verification (rmm_verify_registry_submission)
- [ ] **Task 1.1.2.8:** Implement registry submission workflow - Tier 1 approval (rmm_approve_registry_submission)
- [ ] **Task 1.1.2.9:** Implement registry submission workflow - Tier 2 implementation (rmm_implement_registry_update)
- [ ] **Task 1.1.2.10:** Implement registry submission workflow - Completion (rmm_complete_registry_update)
- [ ] **Task 1.1.2.11:** Implement registry submission workflow - Rejection (rmm_reject_registry_submission)
- [ ] **Task 1.1.2.12:** Implement MOH submission workflow - Peer review (rmm_peer_review_registry_submission)
- [ ] **Task 1.1.2.13:** Implement cascade deactivation logic (company deactivation → products/SKUs cascade)
- [ ] **Task 1.1.2.14:** Implement soft delete safeguards (deletion workflow, pending period, reversal logic)
- [ ] **Task 1.1.2.15:** Implement two-person rule for critical actions (company suspension/deletion, critical medicine product deactivation/deletion)

### RMM Frontend Tasks
- [ ] **Task 1.1.2.16:** Create RMM module layout and navigation
- [ ] **Task 1.1.2.17:** Implement Companies list page (table view, filters, search, pagination)
- [ ] **Task 1.1.2.18:** Implement Company detail page (company information display)
- [ ] **Task 1.1.2.19:** Implement Company create/edit forms (form validation, submission workflow)
- [ ] **Task 1.1.2.20:** Implement Products list page (company-scoped, filters, search)
- [ ] **Task 1.1.2.21:** Implement Product detail page (product information, SKUs list)
- [ ] **Task 1.1.2.22:** Implement Product create/edit forms (form validation, submission workflow)
- [ ] **Task 1.1.2.23:** Implement SKUs list page (product-scoped, filters, search)
- [ ] **Task 1.1.2.24:** Implement SKU detail page (SKU information)
- [ ] **Task 1.1.2.25:** Implement SKU create/edit forms (form validation, submission workflow)
- [ ] **Task 1.1.2.26:** Implement Registry submission list page (my submissions, pending approvals - role-based)
- [ ] **Task 1.1.2.27:** Implement Registry submission detail page (submission data, workflow status, approval history)
- [ ] **Task 1.1.2.28:** Implement Registry submission workflow actions (submit, verify, approve, implement, reject buttons)
- [ ] **Task 1.1.2.29:** Implement ATC Codes list page (MOH only, read-only for companies)
- [ ] **Task 1.1.2.30:** Implement Critical Medicines list page (MOH only, designation interface)

---

## Subphase 1.1.3: VCI Module - AAMS Workflow (Week 4)

### VCI AAMS Backend Tasks
- [ ] **Task 1.1.3.1:** Create VCI RPC function - AAMS submission (vci_submit_aams)
- [ ] **Task 1.1.3.2:** Create VCI RPC function - AAMS verification (vci_verify_aams) - includes threshold calculation (B × AAMS)
- [ ] **Task 1.1.3.3:** Create VCI RPC function - AAMS approval (vci_approve_aams_threshold)
- [ ] **Task 1.1.3.4:** Create VCI RPC function - AAMS completion (vci_complete_aams_submission)
- [ ] **Task 1.1.3.5:** Create VCI RPC function - AAMS rejection (vci_reject_aams_submission)
- [ ] **Task 1.1.3.6:** Implement threshold calculation logic (B multiplier: 3 standard, 3.5 critical medicines)
- [ ] **Task 1.1.3.7:** Implement threshold modification logic (local per-SKU, global system-wide, non-retroactive)
- [ ] **Task 1.1.3.8:** Implement AAMS deadline validation (January 31 deadline, 15-day grace period, late submission handling)
- [ ] **Task 1.1.3.9:** Implement previous year AAMS fallback logic (if no submission by March 1)
- [ ] **Task 1.1.3.10:** Create scheduled trigger for AAMS deadline check (February 16)

### VCI AAMS Frontend Tasks
- [ ] **Task 1.1.3.11:** Create VCI module layout and navigation
- [ ] **Task 1.1.3.12:** Implement AAMS submissions list page (my submissions, all submissions for MOH)
- [ ] **Task 1.1.3.13:** Implement AAMS submission create/edit form (year selection, monthly breakdown entry, validation)
- [ ] **Task 1.1.3.14:** Implement AAMS submission detail page (submission data, calculated threshold display, workflow status)
- [ ] **Task 1.1.3.15:** Implement AAMS workflow actions (submit, verify, approve, reject buttons - role-based)
- [ ] **Task 1.1.3.16:** Implement Threshold management page (MOH Tier 1 - list thresholds, modify thresholds)
- [ ] **Task 1.1.3.17:** Implement Threshold modification form (local vs global, B multiplier adjustment)

---

## Subphase 1.1.4: VCI Module - MSQ Workflow (Week 5)

### VCI MSQ Backend Tasks
- [ ] **Task 1.1.4.1:** Create VCI RPC function - MSQ submission (vci_submit_msq)
- [ ] **Task 1.1.4.2:** Implement MSQ validation logic (completeness checks, format validation, historical pattern comparison)
- [ ] **Task 1.1.4.3:** Implement MSQ vs AAMS validation (20% threshold comparison, anomaly detection)
- [ ] **Task 1.1.4.4:** Create VCI RPC function - MSQ flag for review (vci_flag_msq_for_review)
- [ ] **Task 1.1.4.5:** Create VCI RPC function - MSQ accept (vci_accept_msq)
- [ ] **Task 1.1.4.6:** Create VCI RPC function - MSQ reject (vci_reject_msq)
- [ ] **Task 1.1.4.7:** Implement 7-day grace period for MSQ corrections

### VCI MSQ Frontend Tasks
- [ ] **Task 1.1.4.8:** Implement MSQ submissions list page (my submissions, flagged for review for MOH)
- [ ] **Task 1.1.4.9:** Implement MSQ submission form (month selection, SKU data entry, bulk upload option)
- [ ] **Task 1.1.4.10:** Implement MSQ submission detail page (submission data, validation status, review actions)
- [ ] **Task 1.1.4.11:** Implement MSQ correction interface (7-day grace period, edit submitted data)

---

## Subphase 1.1.5: VCI Module - WSL Workflow & Breach Detection (Week 6)

### VCI WSL Backend Tasks
- [ ] **Task 1.1.5.1:** Create VCI RPC function - WSL submission (vci_submit_wsl)
- [ ] **Task 1.1.5.2:** Implement WSL validation logic (all SKUs required, completeness check)
- [ ] **Task 1.1.5.3:** Implement WSL deadline validation (Friday EOD deadline, late submission handling)
- [ ] **Task 1.1.5.4:** Implement breach detection logic (stock level vs threshold comparison)
- [ ] **Task 1.1.5.5:** Create VCI RPC function - Breach creation (automatic on WSL submission)
- [ ] **Task 1.1.5.6:** Implement breach reason and replenishment date capture
- [ ] **Task 1.1.5.7:** Implement breach priority logic (critical medicine breaches, multiple SKUs, extended breaches)
- [ ] **Task 1.1.5.8:** Create VCI RPC function - Breach analysis (vci_analyze_breach)
- [ ] **Task 1.1.5.9:** Create VCI RPC function - Breach action suggestion (vci_suggest_breach_action)
- [ ] **Task 1.1.5.10:** Create VCI RPC function - Breach action approval (vci_approve_breach_action)
- [ ] **Task 1.1.5.11:** Implement breach analysis deadline logic (3 working days standard, 1 working day critical)
- [ ] **Task 1.1.5.12:** Create scheduled trigger for WSL deadline check (Friday 5 PM)

### VCI WSL Frontend Tasks
- [ ] **Task 1.1.5.13:** Implement WSL submissions list page (my submissions, all submissions for MOH)
- [ ] **Task 1.1.5.14:** Implement WSL submission form (week ending date, all SKUs stock levels entry, bulk entry interface)
- [ ] **Task 1.1.5.15:** Implement WSL submission detail page (submission data, breach indicators)
- [ ] **Task 1.1.5.16:** Implement Breaches list page (active breaches, resolved breaches, filters by priority/company/SKU)
- [ ] **Task 1.1.5.17:** Implement Breach detail page (breach information, stock level vs threshold, reason, replenishment date)
- [ ] **Task 1.1.5.18:** Implement Breach analysis interface (Tier 2 - analysis form, action suggestions)
- [ ] **Task 1.1.5.19:** Implement Breach action approval interface (Tier 1 - review suggestions, approve/reject/independent action)
- [ ] **Task 1.1.5.20:** Implement Governance Dashboard (MOH - real-time stock sufficiency, breach status, action recommendations)

---

## Subphase 1.1.6: Mock Data Generation & Population (Week 7)

### Mock Data Tasks
- [ ] **Task 1.1.6.1:** Create mock data generation script - Companies (75 companies: 15 IPCs + 60 Wholesalers, diverse profiles)
- [ ] **Task 1.1.6.2:** Create mock data generation script - Products (2-5 products per company, varied types)
- [ ] **Task 1.1.6.3:** Create mock data generation script - SKUs (3-10 SKUs per product, varied codes)
- [ ] **Task 1.1.6.4:** Create mock data generation script - ATC Codes (comprehensive ATC code list)
- [ ] **Task 1.1.6.5:** Create mock data generation script - Critical Medicines (designate subset of SKUs as critical)
- [ ] **Task 1.1.6.6:** Create mock data generation script - AAMS (2-3 years historical AAMS data per company)
- [ ] **Task 1.1.6.7:** Create mock data generation script - MSQ (2-3 years historical monthly MSQ data)
- [ ] **Task 1.1.6.8:** Create mock data generation script - WSL (2-3 years historical weekly WSL data, include breach scenarios)
- [ ] **Task 1.1.6.9:** Create mock data generation script - Thresholds (calculated thresholds for all SKUs)
- [ ] **Task 1.1.6.10:** Create mock data generation script - Users (company users for each company, MOH users)
- [ ] **Task 1.1.6.11:** Create mock data generation script - Registry submissions (historical submission workflows)
- [ ] **Task 1.1.6.12:** Create mock data generation script - Breaches (historical breach records with analyses)
- [ ] **Task 1.1.6.13:** Execute mock data population scripts (validate data integrity)
- [ ] **Task 1.1.6.14:** Verify mock data completeness and relationships

---

## Subphase 1.1.7: Integration Testing & Documentation (Week 8)

### Testing Tasks
- [ ] **Task 1.1.7.1:** Create RMM module test suite (unit tests for RPC functions)
- [ ] **Task 1.1.7.2:** Create VCI module test suite (unit tests for RPC functions)
- [ ] **Task 1.1.7.3:** Create integration tests - RMM workflows (end-to-end submission → approval → implementation)
- [ ] **Task 1.1.7.4:** Create integration tests - VCI AAMS workflow (submission → verification → approval)
- [ ] **Task 1.1.7.5:** Create integration tests - VCI MSQ workflow (submission → validation → acceptance)
- [ ] **Task 1.1.7.6:** Create integration tests - VCI WSL workflow (submission → breach detection → analysis)
- [ ] **Task 1.1.7.7:** Create integration tests - Cross-module (RMM registry → VCI submissions)
- [ ] **Task 1.1.7.8:** Perform role-based access testing (company users, MOH users, permissions)
- [ ] **Task 1.1.7.9:** Perform RLS policy testing (data isolation, module activation checks)
- [ ] **Task 1.1.7.10:** Perform audit logging verification (all actions logged correctly)

### Documentation Tasks
- [ ] **Task 1.1.7.11:** Create RMM module user documentation (company user guide, MOH user guide)
- [ ] **Task 1.1.7.12:** Create VCI module user documentation (AAMS, MSQ, WSL submission guides)
- [ ] **Task 1.1.7.13:** Create API documentation (RPC function documentation, request/response schemas)
- [ ] **Task 1.1.7.14:** Create developer documentation (setup guide, architecture overview)

### Phase 1.1 Sign-off
- [ ] **Task 1.1.7.15:** Phase 1.1 internal review and testing
- [ ] **Task 1.1.7.16:** Phase 1.1 sign-off and approval to proceed to Phase 1.2

---

# PHASE 1.2: ECS DEVELOPMENT (Month 4 - Weeks 9-12)

**Duration:** 4 weeks  
**Objective:** Build Export Control System module and integrate with RMM + VCI

## Subphase 1.2.1: ECS Backend Foundation (Week 9)

### ECS Backend Setup Tasks
- [ ] **Task 1.2.1.1:** Create database migration for ECS tables (export_requests, export_authorizations, replenishment_schedules)
- [ ] **Task 1.2.1.2:** Implement RLS policies for ECS tables (module activation check, company isolation)
- [ ] **Task 1.2.1.3:** Create ECS RPC function - Export request submission (ecs_submit_export_request)
- [ ] **Task 1.2.1.4:** Create ECS RPC function - Export request modification (ecs_modify_export_request)
- [ ] **Task 1.2.1.5:** Create ECS RPC function - Export request cancellation (ecs_cancel_export_request)
- [ ] **Task 1.2.1.6:** Implement XAMS calculation logic (X months average, default X=6, configurable 3-12 months)
- [ ] **Task 1.2.1.7:** Implement ECS Threshold calculation logic (C × XAMS, default C=3 standard, 3.5 critical)
- [ ] **Task 1.2.1.8:** Implement conditional validation logic (CMC score-based if CMC active, risk factor assessment)
- [ ] **Task 1.2.1.9:** Create ECS RPC function - Export request evaluation (ecs_evaluate_export_request)

---

## Subphase 1.2.2: ECS Workflow & Threshold Switching (Week 10)

### ECS Workflow Backend Tasks
- [ ] **Task 1.2.2.1:** Create ECS RPC function - Export request auto-approval queue (ecs_queue_auto_approval)
- [ ] **Task 1.2.2.2:** Create ECS RPC function - Export request Tier 2 verification (ecs_verify_export_request)
- [ ] **Task 1.2.2.3:** Create ECS RPC function - Export request manual review (ecs_manual_review_export_request)
- [ ] **Task 1.2.2.4:** Create ECS RPC function - Export request approval (ecs_approve_export_request)
- [ ] **Task 1.2.2.5:** Create ECS RPC function - Export request rejection (ecs_reject_export_request)
- [ ] **Task 1.2.2.6:** Create ECS RPC function - Export authorization (ecs_authorize_export)
- [ ] **Task 1.2.2.7:** Implement threshold switching logic (VCI Threshold → ECS Threshold on authorization)
- [ ] **Task 1.2.2.8:** Create scheduled trigger for threshold reversion (3 months after authorization)
- [ ] **Task 1.2.2.9:** Implement intervention window logic (default 2 working days, configurable 1-5 days)
- [ ] **Task 1.2.2.10:** Create ECS RPC function - Export authorization expiration check (ecs_check_expiration)
- [ ] **Task 1.2.2.11:** Create scheduled trigger for export expiration checks (daily)
- [ ] **Task 1.2.2.12:** Create ECS RPC function - Export authorization extension (ecs_request_extension)

---

## Subphase 1.2.3: ECS Post-Authorization & Replenishment (Week 11)

### ECS Post-Authorization Backend Tasks
- [ ] **Task 1.2.3.1:** Create ECS RPC function - Export completion report (ecs_report_export_completion)
- [ ] **Task 1.2.3.2:** Create ECS RPC function - Export cancellation/modification request (ecs_request_export_change)
- [ ] **Task 1.2.3.3:** Implement replenishment schedule tracking logic
- [ ] **Task 1.2.3.4:** Create ECS RPC function - Replenishment delay escalation (ecs_escalate_delay)
- [ ] **Task 1.2.3.5:** Create scheduled trigger for replenishment delay escalation (daily check)
- [ ] **Task 1.2.3.6:** Implement tiered escalation process (day 1 alerts, days 2-7 warnings, days 8-14 escalation, 15+ critical)
- [ ] **Task 1.2.3.7:** Create ECS RPC function - Replenishment proof submission (ecs_submit_replenishment_proof)
- [ ] **Task 1.2.3.8:** Create ECS RPC function - Replenishment verification (ecs_verify_replenishment)

### ECS Frontend Tasks
- [ ] **Task 1.2.3.9:** Create ECS module layout and navigation (module activation check)
- [ ] **Task 1.2.3.10:** Implement Export requests list page (my requests, pending approvals for MOH)
- [ ] **Task 1.2.3.11:** Implement Export request form (SKU selection, destination, timeline, documentation upload)
- [ ] **Task 1.2.3.12:** Implement Export request detail page (request data, evaluation status, threshold comparison)
- [ ] **Task 1.2.3.13:** Implement Export workflow actions (submit, verify, approve, reject, intervene buttons - role-based)
- [ ] **Task 1.2.3.14:** Implement Export authorizations list page (active authorizations, expired authorizations)
- [ ] **Task 1.2.3.15:** Implement Export authorization detail page (authorization details, validity period, threshold status)
- [ ] **Task 1.2.3.16:** Implement Export completion reporting interface
- [ ] **Task 1.2.3.17:** Implement Replenishment schedule tracking interface

---

## Subphase 1.2.4: ECS Integration Testing & Mock Data (Week 12)

### ECS Testing & Data Tasks
- [ ] **Task 1.2.4.1:** Create ECS module test suite (unit tests for RPC functions)
- [ ] **Task 1.2.4.2:** Create integration tests - ECS workflow (submission → evaluation → approval → authorization)
- [ ] **Task 1.2.4.3:** Create integration tests - Threshold switching (VCI → ECS → VCI)
- [ ] **Task 1.2.4.4:** Create integration tests - Conditional validation (CMC score integration)
- [ ] **Task 1.2.4.5:** Create integration tests - Replenishment delay escalation
- [ ] **Task 1.2.4.6:** Create mock data generation script - Export requests (historical export request scenarios)
- [ ] **Task 1.2.4.7:** Create mock data generation script - Export authorizations (active and expired authorizations)
- [ ] **Task 1.2.4.8:** Create mock data generation script - Replenishment schedules (various scenarios including delays)
- [ ] **Task 1.2.4.9:** Execute ECS mock data population
- [ ] **Task 1.2.4.10:** Create ECS module user documentation
- [ ] **Task 1.2.4.11:** Phase 1.2 internal review and sign-off

---

# PHASE 1.3: CMC DEVELOPMENT (Month 5 - Weeks 13-16)

**Duration:** 4 weeks  
**Objective:** Build Compliance Monitoring Center module and integrate with all modules

## Subphase 1.3.1: CMC Scoring Engine (Week 13)

### CMC Backend Setup Tasks
- [ ] **Task 1.3.1.1:** Create database migration for CMC tables (compliance_scores, compliance_score_components, disputes, regulatory_reports)
- [ ] **Task 1.3.1.2:** Implement RLS policies for CMC tables (module activation check, score visibility rules)
- [ ] **Task 1.3.1.3:** Create CMC RPC function - Component score calculation (cmc_calculate_component_scores)
- [ ] **Task 1.3.1.4:** Implement Regulatory Reporting Compliance Rate calculation (WSL submission compliance over 12 months)
- [ ] **Task 1.3.1.5:** Implement Stock Threshold Violation Frequency calculation (average breaches per cycle over 6 months)
- [ ] **Task 1.3.1.6:** Implement Replenishment Plan Adherence calculation (ECS module, if active)
- [ ] **Task 1.3.1.7:** Implement Aggregate Non-Compliance Exposure calculation (SKU-days of non-compliance over 12 months)
- [ ] **Task 1.3.1.8:** Implement Data Quality Signals calculation
- [ ] **Task 1.3.1.9:** Implement Critical Medicine Coverage calculation
- [ ] **Task 1.3.1.10:** Implement Export Compliance calculation (ECS module, if active)
- [ ] **Task 1.3.1.11:** Create CMC RPC function - Total score calculation (cmc_calculate_total_score) - weighted average
- [ ] **Task 1.3.1.12:** Implement configurable component weights (Tier 1 configuration)

---

## Subphase 1.3.2: CMC Monthly Calculation & Disputes (Week 14)

### CMC Calculation Backend Tasks
- [ ] **Task 1.3.2.1:** Create CMC RPC function - Monthly score calculation (cmc_calculate_monthly_scores)
- [ ] **Task 1.3.2.2:** Create scheduled trigger for monthly compliance score calculation (1st of month at 2 AM)
- [ ] **Task 1.3.2.3:** Implement event-triggered score recalculation (high breaches, enforcement actions, ECS approvals)
- [ ] **Task 1.3.2.4:** Create CMC RPC function - Score freeze (cmc_freeze_score_snapshot) - create frozen snapshot
- [ ] **Task 1.3.2.5:** Create CMC RPC function - Tier 2 review flag (cmc_flag_score_for_review)
- [ ] **Task 1.3.2.6:** Create CMC RPC function - Tier 1 score override (cmc_override_score)
- [ ] **Task 1.3.2.7:** Implement adjustment notes system (Tier 1 only, preserves original snapshot)
- [ ] **Task 1.3.2.8:** Create CMC RPC function - Dispute creation (cmc_create_dispute)
- [ ] **Task 1.3.2.9:** Create CMC RPC function - Dispute review (cmc_review_dispute)
- [ ] **Task 1.3.2.10:** Create CMC RPC function - Dispute resolution (cmc_resolve_dispute)
- [ ] **Task 1.3.2.11:** Implement 30-day dispute window logic

### CMC Frontend Tasks
- [ ] **Task 1.3.2.12:** Create CMC module layout and navigation (module activation check)
- [ ] **Task 1.3.2.13:** Implement Compliance scores list page (my score for companies, all scores for MOH)
- [ ] **Task 1.3.2.14:** Implement Compliance score detail page (total score, component breakdown, category-level tips for companies)
- [ ] **Task 1.3.2.15:** Implement Leaderboard page (anonymized for companies, full for Tier 1, oversight for Tier 2)
- [ ] **Task 1.3.2.16:** Implement Score review interface (Tier 2 - flag anomalies, Tier 1 - override with justification)
- [ ] **Task 1.3.2.17:** Implement Dispute creation interface (companies - 30-day window, dispute form)
- [ ] **Task 1.3.2.18:** Implement Dispute review interface (Tier 2 - review, Tier 1 - resolution with adjustment notes)

---

## Subphase 1.3.3: CMC Reports & Integration (Week 15)

### CMC Reports Backend Tasks
- [ ] **Task 1.3.3.1:** Create CMC RPC function - Report generation (cmc_generate_regulatory_report)
- [ ] **Task 1.3.3.2:** Implement monthly report template
- [ ] **Task 1.3.3.3:** Implement quarterly report template
- [ ] **Task 1.3.3.4:** Implement annual report template
- [ ] **Task 1.3.3.5:** Create scheduled triggers for report generation (monthly, quarterly, annual)
- [ ] **Task 1.3.3.6:** Create CMC RPC function - Report review (cmc_review_report)
- [ ] **Task 1.3.3.7:** Create CMC RPC function - Report approval (cmc_approve_report)
- [ ] **Task 1.3.3.8:** Implement report template customization (Tier 1 approval required)
- [ ] **Task 1.3.3.9:** Create CMC RPC function - Automated reminder trigger (cmc_send_regulatory_reminders)
- [ ] **Task 1.3.3.10:** Implement automated reminders (7 days, 3 days, deadline day - email + in-app)

### CMC Integration Tasks
- [ ] **Task 1.3.3.11:** Integrate CMC scores with ECS conditional validation (if ECS active)
- [ ] **Task 1.3.3.12:** Implement event-triggered CMC recalculation on ECS export approval
- [ ] **Task 1.3.3.13:** Create CMC Frontend Tasks - Reports list page
- [ ] **Task 1.3.3.14:** Create CMC Frontend Tasks - Report detail page (view, download)
- [ ] **Task 1.3.3.15:** Create CMC Frontend Tasks - Report review/approval interface (Tier 2 review, Tier 1 approval)

---

## Subphase 1.3.4: CMC Testing & Mock Data (Week 16)

### CMC Testing & Data Tasks
- [ ] **Task 1.3.4.1:** Create CMC module test suite (unit tests for scoring calculations)
- [ ] **Task 1.3.4.2:** Create integration tests - Monthly score calculation (all components, weighted average)
- [ ] **Task 1.3.4.3:** Create integration tests - Dispute workflow (creation → review → resolution)
- [ ] **Task 1.3.4.4:** Create integration tests - Report generation (monthly, quarterly, annual templates)
- [ ] **Task 1.3.4.5:** Create integration tests - CMC-ECS integration (scores to ECS validation)
- [ ] **Task 1.3.4.6:** Create integration tests - Event-triggered recalculation (ECS approval triggers)
- [ ] **Task 1.3.4.7:** Create mock data generation script - Compliance scores (2-3 years monthly scores for all companies)
- [ ] **Task 1.3.4.8:** Create mock data generation script - Disputes (historical dispute scenarios)
- [ ] **Task 1.3.4.9:** Create mock data generation script - Regulatory reports (historical reports)
- [ ] **Task 1.3.4.10:** Execute CMC mock data population
- [ ] **Task 1.3.4.11:** Create CMC module user documentation
- [ ] **Task 1.3.4.12:** Phase 1.3 internal review and sign-off

---

# PHASE 1.4: HOLISTIC MVP TESTING (Month 6 - Weeks 17-20)

**Duration:** 4 weeks  
**Objective:** Comprehensive end-to-end testing, performance validation, and customer presentation preparation

## Subphase 1.4.1: End-to-End Integration Testing (Week 17)

### Integration Testing Tasks
- [ ] **Task 1.4.1.1:** Create end-to-end test scenarios - Complete RMM workflow (company submission → approval → implementation)
- [ ] **Task 1.4.1.2:** Create end-to-end test scenarios - Complete VCI workflow (AAMS → MSQ → WSL → breach detection → analysis)
- [ ] **Task 1.4.1.3:** Create end-to-end test scenarios - Complete ECS workflow (export request → approval → authorization → completion)
- [ ] **Task 1.4.1.4:** Create end-to-end test scenarios - Complete CMC workflow (monthly calculation → dispute → resolution)
- [ ] **Task 1.4.1.5:** Create cross-module test scenarios - ECS export → CMC score impact
- [ ] **Task 1.4.1.6:** Create cross-module test scenarios - CMC score → ECS conditional validation
- [ ] **Task 1.4.1.7:** Create cross-module test scenarios - ECS authorization → VCI threshold switching
- [ ] **Task 1.4.1.8:** Create cross-module test scenarios - VCI breach → CMC score impact
- [ ] **Task 1.4.1.9:** Test data flows between all modules (MSQ → XAMS, WSL → compliance scoring, etc.)
- [ ] **Task 1.4.1.10:** Test module activation/deactivation scenarios
- [ ] **Task 1.4.1.11:** Test all scheduled triggers (monthly calculations, deadline checks, expiration checks)

---

## Subphase 1.4.2: Performance & Security Testing (Week 18)

### Performance Testing Tasks
- [ ] **Task 1.4.2.1:** Perform load testing - 75 companies concurrent access
- [ ] **Task 1.4.2.2:** Perform load testing - Large dataset queries (2-3 years historical data)
- [ ] **Task 1.4.2.3:** Perform load testing - Dashboard performance (governance dashboard with all companies)
- [ ] **Task 1.4.2.4:** Test RLS policy performance (company isolation queries)
- [ ] **Task 1.4.2.5:** Test database query optimization (index usage, query plans)
- [ ] **Task 1.4.2.6:** Test scheduled job performance (monthly score calculation, deadline checks)
- [ ] **Task 1.4.2.7:** Measure response times (target: <2 seconds for standard operations)
- [ ] **Task 1.4.2.8:** Test concurrent submission handling

### Security Testing Tasks
- [ ] **Task 1.4.2.9:** Perform security audit - Authentication and authorization
- [ ] **Task 1.4.2.10:** Perform security audit - RLS policy enforcement (company data isolation)
- [ ] **Task 1.4.2.11:** Perform security audit - Input validation and sanitization
- [ ] **Task 1.4.2.12:** Perform security audit - Audit logging completeness
- [ ] **Task 1.4.2.13:** Perform security audit - API security (rate limiting, error handling)
- [ ] **Task 1.4.2.14:** Test two-person rule enforcement
- [ ] **Task 1.4.2.15:** Test role-based access control (all roles, all permissions)

---

## Subphase 1.4.3: Edge Cases & Error Handling (Week 19)

### Edge Case Testing Tasks
- [ ] **Task 1.4.3.1:** Test edge cases - Late AAMS submissions (grace period, overdue handling)
- [ ] **Task 1.4.3.2:** Test edge cases - Missing AAMS (previous year fallback, manual threshold)
- [ ] **Task 1.4.3.3:** Test edge cases - WSL deadline violations (Friday EOD, Monday EOD)
- [ ] **Task 1.4.3.4:** Test edge cases - Multiple concurrent breaches
- [ ] **Task 1.4.3.5:** Test edge cases - Export authorization expiration (90 days, extension requests)
- [ ] **Task 1.4.3.6:** Test edge cases - Replenishment delay escalation (all stages)
- [ ] **Task 1.4.3.7:** Test edge cases - Threshold switching edge cases (ECS Threshold < VCI Threshold)
- [ ] **Task 1.4.3.8:** Test edge cases - CMC score calculation with missing data
- [ ] **Task 1.4.3.9:** Test edge cases - Module activation/deactivation during active workflows
- [ ] **Task 1.4.3.10:** Test error handling - Network failures, timeout scenarios
- [ ] **Task 1.4.3.11:** Test error handling - Invalid data submissions
- [ ] **Task 1.4.3.12:** Test error handling - Concurrent update conflicts
- [ ] **Task 1.4.3.13:** Test error recovery - Transaction rollbacks
- [ ] **Task 1.4.3.14:** Test audit log integrity - All operations logged correctly

---

## Subphase 1.4.4: Documentation & Customer Presentation (Week 20)

### Documentation Tasks
- [ ] **Task 1.4.4.1:** Create complete system documentation (architecture overview, module documentation)
- [ ] **Task 1.4.4.2:** Create user manuals (company user guide, MOH user guide, role-specific guides)
- [ ] **Task 1.4.4.3:** Create API documentation (complete RPC function documentation, request/response schemas)
- [ ] **Task 1.4.4.4:** Create administrator documentation (deployment guide, configuration guide, troubleshooting)
- [ ] **Task 1.4.4.5:** Create mock data documentation (data structure, usage instructions)

### Customer Presentation Tasks
- [ ] **Task 1.4.4.6:** Prepare demo scenarios (realistic workflows showcasing all modules)
- [ ] **Task 1.4.4.7:** Create presentation materials (PowerPoint, demo script, talking points)
- [ ] **Task 1.4.4.8:** Prepare demo environment (clean data set, pre-configured scenarios)
- [ ] **Task 1.4.4.9:** Create video walkthroughs (key workflows, module overviews)
- [ ] **Task 1.4.4.10:** Prepare Q&A document (anticipated questions and answers)
- [ ] **Task 1.4.4.11:** Conduct internal presentation rehearsal

### Phase 1.4 Sign-off
- [ ] **Task 1.4.4.12:** Final system review (all modules, all features)
- [ ] **Task 1.4.4.13:** Performance benchmarks validation (all targets met)
- [ ] **Task 1.4.4.14:** Security validation (all requirements met)
- [ ] **Task 1.4.4.15:** Phase 1.4 sign-off and approval for Phase 2 (MOH UAT)

---

## Phase 1 Success Criteria Summary

### Phase 1.1 (RMM + VCI)
✅ All RMM workflows functional (CRUD, approval chains, two-person rule)  
✅ All VCI workflows functional (submissions, threshold calculation, breach detection)  
✅ Mock data successfully populated (75 companies)  
✅ Internal testing passed  
✅ Documentation complete

### Phase 1.2 (ECS)
✅ All ECS workflows functional (export requests, approvals, threshold switching)  
✅ Integration with RMM + VCI working correctly  
✅ Mock export scenarios tested  
✅ Internal testing passed

### Phase 1.3 (CMC)
✅ All CMC workflows functional (scoring, disputes, reports)  
✅ Integration with all modules working correctly  
✅ Mock compliance scenarios tested  
✅ Internal testing passed

### Phase 1.4 (Holistic Testing)
✅ All modules working together correctly  
✅ Performance targets met  
✅ Security requirements validated  
✅ Customer presentation materials ready  
✅ System ready for MOH UAT

---

## Risk Mitigation

**Risk 1: Development Timeline Delays**
- **Mitigation:** Bite-size tasks enable parallel work, clear dependencies documented
- **Contingency:** Buffer time in Week 8, 12, 16, 20 for catch-up

**Risk 2: Integration Issues Between Modules**
- **Mitigation:** Clear module interfaces defined in Phase 0, integration tests at each phase
- **Contingency:** Additional integration testing time in Phase 1.4

**Risk 3: Mock Data Complexity**
- **Mitigation:** Mock data generation scripts created early, validated incrementally
- **Contingency:** Simplified data sets if needed, can expand later

**Risk 4: Performance Issues with 75 Companies**
- **Mitigation:** Performance testing early, query optimization, indexing strategy
- **Contingency:** Performance tuning in Phase 1.4, database optimization

---

## Team Assignments (Recommended)

**Phase 1.1:**
- **Oliver:** Architecture oversight, integration coordination
- **Nadia:** Database migrations, RLS policies
- **Rafi:** RLS implementation, security policies
- **Maya:** RPC functions, workflow implementation
- **Salim:** Security implementation, audit logging
- **Leila:** Scheduled triggers, background jobs
- **Emma:** Frontend development, UI/UX
- **Hassan:** Testing strategy, test implementation
- **Farah:** Mock data generation, data validation

**Phase 1.2-1.4:**
- Similar team assignments with module-specific focus

---

**Status:** Ready for Review and Approval  
**Next Step:** Review this plan, adjust task breakdown as needed, assign team members, begin Phase 1.1