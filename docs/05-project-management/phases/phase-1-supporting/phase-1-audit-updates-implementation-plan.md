# Phase 1 Implementation Plan - Audit Updates Implementation Plan

**Purpose:** Document the comprehensive updates needed to Phase 1 Implementation Plan based on audit findings  
**Date:** 2025-01-21  
**Status:** 📋 DRAFT  
**Owner:** Oliver (Chief Architect)

---

## Executive Summary

This document outlines all updates needed to the Phase 1 Implementation Plan based on the consolidated audit findings. The updates fall into several categories:

1. **Missing Enforcement Module Tasks** - Enforcement frontend tasks and RPC functions are missing
2. **Missing Wireframe References** - Enforcement tasks need wireframe references
3. **Missing Pattern References** - Many tasks need explicit pattern document references
4. **Missing Specifications** - Various tasks need more detailed specifications
5. **Missing Verification Tasks** - Various verification tasks need to be added

**Total Issues to Address:** 44 Critical + 16 Medium = 60 issues

---

## 1. ENFORCEMENT MODULE ADDITIONS (Fatima's Audit - Critical Issues #1, #3)

### 1.1 Missing Enforcement RPC Functions

**Location:** Should be added to Phase 1.1.2 (RMM Module) as a new subsection, OR create new Subphase 1.1.2.5: Enforcement Module

**Tasks to Add:**

```
### Enforcement Backend Tasks (RPC Functions)

- [ ] **Task 1.1.2.31:** Create Enforcement RPC function - Submit for review (enforcement_submit_for_review)
  - **Description:** Submit enforcement action from draft → pending_review
  - **Reference:** enforcement-cycle-specification.md
  - **Validation:** action_type, violation_type, legal_basis, justification required; if fine: amount required
  - **Estimated Time:** 4-6 hours

- [ ] **Task 1.1.2.32:** Create Enforcement RPC function - Review action (enforcement_review_action)
  - **Description:** Tier 2 review action (pending_review → pending_approval or draft)
  - **Reference:** enforcement-cycle-specification.md
  - **Validation:** Tier 2 role required, review_notes required
  - **Estimated Time:** 4-6 hours

- [ ] **Task 1.1.2.33:** Create Enforcement RPC function - Approve action (enforcement_approve_action)
  - **Description:** Tier 1 approval (pending_approval → approved) - Tier 2 for warnings, Tier 1 for fines/suspensions
  - **Reference:** enforcement-cycle-specification.md, approvals-authority-matrix.md
  - **Validation:** Role-based approval logic (Tier 2 for warnings, Tier 1 for fines/suspensions)
  - **Estimated Time:** 4-6 hours

- [ ] **Task 1.1.2.34:** Create Enforcement RPC function - Execute action (enforcement_execute_action)
  - **Description:** Execute approved action (approved → executed)
  - **Reference:** enforcement-cycle-specification.md
  - **Estimated Time:** 3-4 hours

- [ ] **Task 1.1.2.35:** Create Enforcement RPC function - Appeal action (enforcement_appeal_action)
  - **Description:** Company appeal (executed → appealed)
  - **Reference:** enforcement-cycle-specification.md
  - **Validation:** 30-day appeal window, appeal_grounds required
  - **Estimated Time:** 4-6 hours

- [ ] **Task 1.1.2.36:** Create Enforcement RPC function - Resolve appeal (enforcement_resolve_appeal)
  - **Description:** Tier 1 appeal resolution (appealed → resolved or executed)
  - **Reference:** enforcement-cycle-specification.md
  - **Estimated Time:** 4-6 hours
```

### 1.2 Missing Enforcement Frontend Tasks with Wireframe References

**Location:** Should be added to Phase 1.1.2 (RMM Module) as Enforcement Frontend Tasks

**Tasks to Add:**

```
### Enforcement Frontend Tasks

- [ ] **Task 1.1.2.37:** Implement Enforcement dashboard page (summary, recent actions, pending approvals, enforcement metrics, action type breakdown) - **Wireframe:** [Task 0.5.2.0 - Enforcement Dashboard](../../04-design/user-experience/wireframes/01-rmm/enforcement/task-0.5.2.0-enforcement-dashboard.md)
- [ ] **Task 1.1.2.38:** Implement Enforcement actions list page (all actions, filters: action type/status/company/date range, search, pagination, status indicators) - **Wireframe:** [Task 0.5.2.1 - Enforcement Actions List](../../04-design/user-experience/wireframes/01-rmm/enforcement/task-0.5.2.1-enforcement-actions-list.md)
- [ ] **Task 1.1.2.39:** Implement Enforcement action detail page (action information, workflow status, approval chain, violation details, appeal status, execution tracking) - **Wireframe:** [Task 0.5.2.1a - Enforcement Action Detail](../../04-design/user-experience/wireframes/01-rmm/enforcement/task-0.5.2.1a-enforcement-action-detail.md)
- [ ] **Task 1.1.2.40:** Implement Create enforcement action wizard (action type selection, violation selection, amount input for fines, legal basis, justification, approval workflow) - **Wireframe:** [Task 0.5.2.1b - Create Enforcement Action Wizard](../../04-design/user-experience/wireframes/01-rmm/enforcement/task-0.5.2.1b-create-enforcement-action-wizard.md)
- [ ] **Task 1.1.2.41:** Implement Pending approvals page (actions pending Tier 1 approval, approval interface, bulk approval actions) - **Wireframe:** [Task 0.5.2.1c - Pending Approvals](../../04-design/user-experience/wireframes/01-rmm/enforcement/task-0.5.2.1c-pending-approvals.md)
- [ ] **Task 1.1.2.42:** Implement Enforcement reports page (enforcement analytics, trends, action type breakdown, company compliance tracking) - **Wireframe:** [Task 0.5.2.1d - Enforcement Reports](../../04-design/user-experience/wireframes/01-rmm/enforcement/task-0.5.2.1d-enforcement-reports.md)
- [ ] **Task 1.1.2.43:** Implement Appeal review interface (MOH Tier 1 - review company appeals, uphold/overturn decisions, adjustment notes) - **Wireframe:** [Task 0.5.2.1e - Appeal Review Interface](../../04-design/user-experience/wireframes/01-rmm/enforcement/task-0.5.2.1e-appeal-review-interface.md)
- [ ] **Task 1.1.2.44:** Implement Appeal submission form (Company users - submit appeals with grounds, explanation, supporting documents) - **Wireframe:** [Task 0.5.2.1f - Appeal Submission Form](../../04-design/user-experience/wireframes/01-rmm/enforcement/task-0.5.2.1f-appeal-submission-form.md)
```

---

## 2. PATTERN REFERENCES (Emma's Audit - Critical Issues #8, #9, #10, #11)

### 2.1 Navigation Layout Pattern References

**Tasks to Update:** All navigation/layout tasks
- Task 1.1.1.15 (Header component)
- Task 1.1.1.15a (Sidebar navigation)
- Task 1.1.1.15b (Breadcrumbs)
- Task 1.1.1.15c (Module layout)
- Task 1.1.2.16 (RMM module layout)
- Task 1.1.3.11 (VCI module layout)
- Task 1.2.3.9 (ECS module layout)
- Task 1.3.2.12 (CMC module layout)

**Update Pattern:**
Add to each task: **Reference:** [Navigation & Layout Patterns](../../02-architecture/frontend/navigation-layout-patterns.md)

### 2.2 Form Design Pattern References

**Tasks to Update:** All form-related tasks
- Task 1.1.2.19 (Company create/edit forms)
- Task 1.1.2.22 (Product create/edit forms)
- Task 1.1.2.25 (SKU create/edit forms)
- Task 1.1.3.13 (AAMS submission form)
- Task 1.1.4.9 (MSQ submission form)
- Task 1.1.5.14 (WSL submission form)
- All enforcement forms (new tasks)
- All other form tasks

**Update Pattern:**
Add to each task: **Reference:** [Form Design Patterns](../../02-architecture/frontend/form-design-patterns.md)

### 2.3 Role-Based UI Pattern References

**Tasks to Update:** All role-based UI tasks
- Task 1.1.2.28a (Role-based action buttons)
- Task 1.1.2.29 (ATC Codes list - MOH only)
- Task 1.1.2.30 (Critical Medicines list - MOH only)
- Task 1.1.3.12 (AAMS submissions list - role-based)
- Task 1.1.3.16 (Threshold management - MOH Tier 1)
- All enforcement tasks (role-based access)
- All other role-based tasks

**Update Pattern:**
Add to each task: **Reference:** [Role-Based UI Patterns](../../02-architecture/frontend/role-based-ui-patterns.md)

### 2.4 Component Specification References

**Tasks to Update:** All component implementation tasks
- Task 1.1.2.17a (DataTable component)
- Task 1.1.2.27a (WorkflowStatusIndicator component)
- Task 1.1.2.27b (ApprovalHistory component)
- All other component tasks

**Update Pattern:**
Add to each task: **Reference:** [UI Component Specifications](../../02-architecture/frontend/ui-component-specifications.md)

---

## 3. VALIDATION SPECIFICATIONS (Dr. Samir's Audit - Critical Issues #4, #5, #6)

### 3.1 Submission Data Structure Validation

**Tasks to Update:**
- Task 1.1.3.1 (AAMS submission RPC function)
- Task 1.1.4.1 (MSQ submission RPC function)
- Task 1.1.5.2 (WSL submission RPC function)

**Update Pattern:**
Add validation specifications:
- Array structure validation (submission_data must be array)
- sku_id existence check (all sku_ids must exist in database)
- Quantity validation (non-negative numbers, reasonable range)
- **Reference:** backend-validation-strategy.md

### 3.2 SKU Pharmaceutical Attributes Validation

**Task to Update:**
- Task 1.1.2.25a (SKU pharmaceutical attributes input fields)

**Update Pattern:**
Add validation specifications:
- dosage_strength format (e.g., "500mg", "10mg/ml")
- dosage_form standard list (Tablet, Capsule, Syrup, etc.)
- pack_size positive number with unit
- unit_of_measure matching (must match dosage_form where applicable)
- **Reference:** backend-validation-strategy.md

### 3.3 Replenishment Date Validation

**Task to Update:**
- Task 1.1.5.6 (Breach reason and replenishment date capture)

**Update Pattern:**
Add validation specifications:
- Future date (after submission date)
- Within 90 days
- Format and timezone handling
- **Reference:** backend-validation-strategy.md

---

## 4. MANDATORY JUSTIFICATION VALIDATION (Fatima's Audit - Critical Issue #2)

### 4.1 CMC Score Override Justification Validation

**Task to Update:**
- Task 1.3.2.6 (CMC RPC function - Tier 1 score override)

**Update Pattern:**
Add validation specifications:
- Minimum 50 characters
- Required field
- Format validation
- **Reference:** governance-workflows.md

---

## 5. ADDITIONAL UPDATES NEEDED

This is a comprehensive list. The full implementation will require:
1. Systematic task-by-task updates
2. Cross-referencing with architecture documents
3. Ensuring consistency across all tasks
4. Adding missing verification tasks
5. Adding missing testing specifications

---

## Implementation Priority

1. **🔴 HIGH PRIORITY (Must Fix Before Implementation):**
   - Add enforcement module tasks (RPC functions + frontend tasks)
   - Add wireframe references to enforcement tasks
   - Add pattern references to all relevant tasks
   - Add validation specifications to submission RPC functions

2. **🟡 MEDIUM PRIORITY (Should Fix Before Implementation):**
   - Add missing verification tasks
   - Add missing testing specifications
   - Add missing deployment specifications

---

**Next Steps:**
1. Review this plan
2. Update Phase 1 Implementation Plan systematically
3. Update Phase 0.5 document with pattern reference guidelines
4. Update wireframes with pattern reference annotations
