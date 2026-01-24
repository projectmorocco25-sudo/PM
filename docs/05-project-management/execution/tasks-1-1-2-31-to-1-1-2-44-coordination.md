# Tasks 1.1.2.31 to 1.1.2.44 Team Coordination - Enforcement Module

**Date:** 2026-01-23
**From:** Sami (Implementation Compliance Specialist)
**To:** Oliver (Backend Lead), Yasmine (Frontend Lead), Nadia (Database Specialist), Fatima (MOH Regulatory Requirements), Dr. Samir (Business Process Validation)

---

## Subject: Proceeding with Enforcement Module Implementation

Team,

I am coordinating the implementation of **Tasks 1.1.2.31 through 1.1.2.44** for the Enforcement module. These tasks include Enforcement backend RPC functions (1.1.2.31-1.1.2.36) and Enforcement frontend pages (1.1.2.37-1.1.2.44).

**⚠️ CRITICAL COMPLIANCE NOTE:** Per compliance rules, all backend tasks (1.1.2.31-1.1.2.36) **MUST BE COMPLETE** before any frontend tasks (1.1.2.37-1.1.2.44) begin.

---

## ✅ Prerequisites Verification

### Previous Tasks Completion
- ✅ **Tasks 1.1.2.1-1.1.2.15:** All RMM backend tasks complete
- ✅ **Tasks 1.1.2.16-1.1.2.30:** RMM frontend tasks (pending - will be done after Enforcement backend)
- ✅ **Enforcement Tables:** `enforcement_actions`, `enforcement_action_appeals` exist (Task 1.1.1.7)
- ✅ **RLS Policies:** Enforcement tables have RLS policies (Task 1.1.1.8)
- ✅ **Audit Logging:** Enforcement tables have audit triggers (Task 1.1.1.6)

### Schema Verification
- ✅ `enforcement_actions` table exists with status enum: 'draft', 'submitted', 'tier2_reviewed', 'tier1_approved', 'executed', 'cancelled'
- ✅ `enforcement_action_appeals` table exists with status enum: 'submitted', 'tier2_reviewed', 'tier1_reviewed', 'upheld', 'rejected', 'withdrawn'
- ✅ `approval_history` table exists (from Task 1.1.1.2)
- ✅ `approvals` table exists (from Task 1.1.1.2)
- ✅ `companies` table exists
- ✅ RLS policies are in place

---

## 🎯 Tasks to Implement

### Enforcement Backend Tasks (1.1.2.31-1.1.2.36) ⚠️ **MUST BE COMPLETE FIRST**

#### Task 1.1.2.31: Create Enforcement RPC function - Submit for review
- **Functions:** `enforcement_create_action()`, `enforcement_submit_action()`
- **State Transition:** `draft` → `submitted`
- **Access Control:** MOH Tier 1 and System Admin can create/submit

#### Task 1.1.2.32: Create Enforcement RPC function - Review action
- **Function:** `enforcement_review_action()`
- **State Transition:** `submitted` → `tier2_reviewed`
- **Access Control:** Only MOH Tier 2 Officer
- **Creates:** Approval history entry

#### Task 1.1.2.33: Create Enforcement RPC function - Approve action
- **Function:** `enforcement_approve_action()`
- **State Transition:** `tier2_reviewed` → `tier1_approved`
- **Access Control:** Only MOH Tier 1
- **Creates:** Approval history entry

#### Task 1.1.2.34: Create Enforcement RPC function - Execute action
- **Function:** `enforcement_execute_action()`
- **State Transition:** `tier1_approved` → `executed`
- **Access Control:** Only MOH Tier 2 Registrar
- **Action:** Applies enforcement action to company (suspension, fine, etc.)
- **Creates:** Approval history entry

#### Task 1.1.2.35: Create Enforcement RPC function - Appeal action
- **Function:** `enforcement_submit_appeal()`
- **State Transition:** Creates appeal with status 'submitted'
- **Access Control:** Company users can appeal their own company's actions
- **Creates:** Appeal record linked to enforcement action

#### Task 1.1.2.36: Create Enforcement RPC function - Resolve appeal
- **Functions:** `enforcement_review_appeal()`, `enforcement_uphold_appeal()`, `enforcement_overturn_appeal()`
- **State Transitions:** 
  - `submitted` → `tier2_reviewed` (Tier 2 review)
  - `tier2_reviewed` → `tier1_reviewed` (Tier 1 review)
  - `tier1_reviewed` → `upheld` or `rejected` (Tier 1 decision)
- **Access Control:** MOH Tier 2 Officer and Tier 1
- **Creates:** Approval history entries

### Enforcement Frontend Tasks (1.1.2.37-1.1.2.44) ⚠️ **CANNOT START UNTIL BACKEND COMPLETE**

#### Task 1.1.2.37: Implement Enforcement dashboard page
#### Task 1.1.2.38: Implement Enforcement actions list page
#### Task 1.1.2.39: Implement Enforcement action detail page
#### Task 1.1.2.40: Implement Create enforcement action wizard
#### Task 1.1.2.41: Implement Pending approvals page
#### Task 1.1.2.42: Implement Enforcement reports page
#### Task 1.1.2.43: Implement Appeal review interface (MOH Tier 1)
#### Task 1.1.2.44: Implement Appeal submission form (Company users)

---

## 📋 Implementation Plan

### Phase 1: Enforcement Backend (Tasks 1.1.2.31-1.1.2.36)
1. **Task 1.1.2.31:** Create and submit enforcement action functions
2. **Task 1.1.2.32:** Review action function
3. **Task 1.1.2.33:** Approve action function
4. **Task 1.1.2.34:** Execute action function
5. **Task 1.1.2.35:** Submit appeal function
6. **Task 1.1.2.36:** Resolve appeal functions

### Phase 2: Enforcement Frontend (Tasks 1.1.2.37-1.1.2.44)
**⚠️ CANNOT START UNTIL PHASE 1 COMPLETE**
- Will proceed after backend tasks are complete and reviewed

---

## 🔄 Team Coordination Points

### Oliver (Backend Lead)
- **Action:** Review enforcement workflow state transitions and business logic
- **Timing:** After each backend task completion
- **Focus:** State machine correctness, error handling, business rules

### Nadia (Database Specialist)
- **Action:** Review approval_history tracking and data integrity
- **Timing:** After backend tasks complete
- **Focus:** Approval history structure, appeal workflow, transaction integrity

### Fatima (MOH Regulatory Requirements)
- **Action:** Review enforcement workflow compliance with regulatory requirements
- **Timing:** After all backend tasks complete
- **Focus:** Enforcement action types, appeal process, regulatory compliance

### Dr. Samir (Business Process Validation)
- **Action:** Review business process alignment
- **Timing:** After all tasks complete
- **Focus:** Workflow correctness, state transitions, business rules

### Yasmine (Frontend Lead)
- **Action:** Prepare for frontend implementation after backend completion
- **Timing:** After backend tasks complete
- **Focus:** Wireframe review, component planning, route structure

---

## ⚠️ Compliance Reminders

- **Sequential Execution:** Backend tasks must be completed before frontend tasks
- **State Machine:** Workflow state transitions must be strictly enforced
- **Approval History:** All state transitions must create approval_history entries
- **Access Control:** Role-based access control must be enforced at each step
- **Audit Trail:** All actions must be auditable
- **Sami's Stop Authority:** Any compliance violation will result in immediate stop

---

## Expected Deliverables

### Backend (Phase 1):
- Migration file with all enforcement RPC functions
- All workflow functions implemented with proper state transitions
- Approval history tracking
- Error handling and validation
- Compliance verification documents

### Frontend (Phase 2):
- All enforcement pages and components
- Wireframe binding in all code
- Role-based access control
- Integration with backend RPC functions

---

Please acknowledge receipt. Implementation will proceed with Phase 1 (Backend) first, then Phase 2 (Frontend) after backend completion and review.

Best regards,
Sami
Implementation Compliance Specialist
