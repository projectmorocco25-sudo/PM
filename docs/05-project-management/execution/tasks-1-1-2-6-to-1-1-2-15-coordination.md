# Tasks 1.1.2.6 to 1.1.2.15 Team Coordination - Registry Submission Workflow & Advanced Features

**Date:** 2026-01-23
**From:** Sami (Implementation Compliance Specialist)
**To:** Oliver (Backend Lead), Yasmine (Frontend Lead), Nadia (Database Specialist), Fatima (MOH Regulatory Requirements), Dr. Samir (Business Process Validation)

---

## Subject: Proceeding with Registry Submission Workflow & Advanced RMM Features

Team,

I am coordinating the implementation of **Tasks 1.1.2.6 through 1.1.2.15** for the RMM module. These tasks implement the complete registry submission workflow, MOH peer review, cascade deactivation, soft delete safeguards, and the two-person rule for critical actions.

---

## ✅ Prerequisites Verification

### Previous Tasks Completion
- ✅ **Tasks 1.1.2.1-1.1.2.5:** All complete and reviewed
- ✅ **Oliver's Review:** Approved with minor suggestions
- ✅ **Nadia's Review:** Approved with minor suggestions
- ✅ **Medium-Priority Issue:** JSONB query fixed

### Schema Verification
- ✅ `registry_submissions` table exists with status enum: 'draft', 'submitted', 'tier2_verified', 'tier1_approved', 'tier2_implemented', 'completed', 'rejected'
- ✅ `approval_history` table exists (from Task 1.1.1.2)
- ✅ `approvals` table exists (from Task 1.1.1.2)
- ✅ All RMM tables exist (companies, products, skus)
- ✅ RLS policies are in place

---

## 🎯 Tasks to Implement

### Registry Submission Workflow Tasks (1.1.2.6-1.1.2.11)

#### Task 1.1.2.6: Create submission
- **Function:** `rmm_submit_registry_update()` (partially exists, needs enhancement)
- **State Transition:** `draft` → `submitted`
- **Access Control:** Company users can submit for their own entities, MOH Tier 1 can submit for any

#### Task 1.1.2.7: Tier 2 verification
- **Function:** `rmm_verify_registry_submission()`
- **State Transition:** `submitted` → `tier2_verified`
- **Access Control:** Only MOH Tier 2 Officer
- **Creates:** Approval history entry

#### Task 1.1.2.8: Tier 1 approval
- **Function:** `rmm_approve_registry_submission()`
- **State Transition:** `tier2_verified` → `tier1_approved` (or `tier2_peer_reviewed` → `tier1_approved`)
- **Access Control:** Only MOH Tier 1
- **Creates:** Approval history entry

#### Task 1.1.2.9: Tier 2 implementation
- **Function:** `rmm_implement_registry_update()`
- **State Transition:** `tier1_approved` → `tier2_implemented`
- **Access Control:** Only MOH Tier 2 Registrar
- **Action:** Applies changes to target tables (companies/products/skus)
- **Creates:** Approval history entry

#### Task 1.1.2.10: Completion
- **Function:** `rmm_complete_registry_submission()`
- **State Transition:** `tier2_implemented` → `completed`
- **Access Control:** System or automatic
- **Creates:** Approval history entry

#### Task 1.1.2.11: Rejection
- **Function:** `rmm_reject_registry_submission()`
- **State Transition:** Any state → `rejected`
- **Access Control:** MOH Tier 1 or Tier 2 (depending on current state)
- **Requires:** Rejection reason
- **Creates:** Approval history entry

### Advanced Features Tasks (1.1.2.12-1.1.2.15)

#### Task 1.1.2.12: MOH Peer Review
- **Function:** `rmm_peer_review_registry_submission()`
- **State Transition:** `tier2_verified` → `tier2_peer_reviewed`
- **Access Control:** MOH Tier 2 Officer (peer review)
- **Purpose:** Additional verification step for complex submissions

#### Task 1.1.2.13: Cascade Deactivation
- **Functions:** Cascade deactivation RPC functions
- **Purpose:** When company is deactivated, cascade to products and SKUs
- **Access Control:** MOH Tier 1 and System Admin
- **Creates:** Registry submissions for cascaded deactivations

#### Task 1.1.2.14: Soft Delete Safeguards
- **Functions:** Soft delete safeguard functions
- **Purpose:** Prevent accidental hard deletes, enforce soft delete pattern
- **Access Control:** Based on entity type and role
- **Validation:** Check for dependencies before allowing deactivation

#### Task 1.1.2.15: Two-Person Rule
- **Functions:** Two-person rule validation functions
- **Purpose:** Require two approvers for critical actions
- **Access Control:** Enforced in approval workflow
- **Validation:** Check approval_history for required approvals

---

## 📋 Implementation Plan

### Sequential Execution:
1. **Task 1.1.2.6:** Enhance/create submission function
2. **Task 1.1.2.7:** Tier 2 verification function
3. **Task 1.1.2.8:** Tier 1 approval function
4. **Task 1.1.2.9:** Tier 2 implementation function
5. **Task 1.1.2.10:** Completion function
6. **Task 1.1.2.11:** Rejection function
7. **Task 1.1.2.12:** Peer review function
8. **Task 1.1.2.13:** Cascade deactivation functions
9. **Task 1.1.2.14:** Soft delete safeguard functions
10. **Task 1.1.2.15:** Two-person rule validation functions

### Expected Deliverables:
- Migration files for workflow functions
- All RPC functions implemented with proper state transitions
- Approval history tracking
- Error handling and validation
- Compliance verification documents

---

## 🔄 Team Coordination Points

### Oliver (Backend Lead)
- **Action:** Review workflow state transitions and business logic
- **Timing:** After each workflow task completion
- **Focus:** State machine correctness, error handling, business rules

### Nadia (Database Specialist)
- **Action:** Review approval_history tracking and data integrity
- **Timing:** After workflow tasks complete
- **Focus:** Approval history structure, cascade logic, transaction integrity

### Fatima (MOH Regulatory Requirements)
- **Action:** Review workflow compliance with regulatory requirements
- **Timing:** After all workflow tasks complete
- **Focus:** Approval workflow correctness, two-person rule, audit trail

### Dr. Samir (Business Process Validation)
- **Action:** Review business process alignment
- **Timing:** After all tasks complete
- **Focus:** Workflow correctness, state transitions, business rules

---

## ⚠️ Compliance Reminders

- **Sequential Execution:** All tasks must be completed in sequence
- **State Machine:** Workflow state transitions must be strictly enforced
- **Approval History:** All state transitions must create approval_history entries
- **Access Control:** Role-based access control must be enforced at each step
- **Audit Trail:** All actions must be auditable
- **Sami's Stop Authority:** Any compliance violation will result in immediate stop

---

Please acknowledge receipt. Implementation will proceed sequentially through all tasks.

Best regards,
Sami
Implementation Compliance Specialist
