# Registry Submission Workflow Feature Tracking

**Feature:** Registry Submission Workflow  
**Module:** RMM  
**Status:** ⚪ NOT STARTED  
**Last Updated:** 2026-01-15

---

## Overview

Registry submission workflow with approval chains (Tier 2 → Tier 1 → Tier 2 implementation) and two-person rule enforcement.

---

## Components

### Registry Submissions List Page
- **Route:** `/rmm/submissions`
- **Wireframe:** [task-0.5.2.11](../../../04-design/user-experience/wireframes/01-rmm/workflow/task-0.5.2.11-registry-submission-list.md) ✅
- **Database:** `registry_submissions`
- **API:** `rmm_list_submissions()`, `rmm_get_submission()`
- **Status:** ⚪ NOT STARTED
- **Phase:** 1.1.2
- **Owner:** Emma
- **Task:** 1.1.2.26

### Registry Submission Detail Page
- **Route:** `/rmm/submissions/[id]`
- **Wireframe:** [task-0.5.2.12](../../../04-design/user-experience/wireframes/01-rmm/workflow/task-0.5.2.12-registry-submission-detail.md) ✅
- **Database:** `registry_submissions`, `approval_history`
- **API:** `rmm_get_submission()`, `rmm_get_approval_history()`
- **Status:** ⚪ NOT STARTED
- **Phase:** 1.1.2
- **Owner:** Emma
- **Task:** 1.1.2.27

### Registry Submission Workflow Actions
- **Route:** Modal/action components on submission detail page
- **Wireframe:** [task-0.5.2.13](../../../04-design/user-experience/wireframes/01-rmm/workflow/task-0.5.2.13-registry-submission-workflow-states.md) ✅
- **Database:** `registry_submissions`, `approval_history`
- **API:** 
  - `rmm_verify_registry_submission()` (Tier 2)
  - `rmm_approve_registry_submission()` (Tier 1)
  - `rmm_implement_registry_update()` (Tier 2 Registrar)
  - `rmm_reject_registry_submission()` (Tier 1)
- **Status:** ⚪ NOT STARTED
- **Phase:** 1.1.2
- **Owner:** Emma
- **Task:** 1.1.2.28

---

## Workflow States

1. **draft** - Initial state when submission created
2. **submitted** - Company or Tier 2 Officer submits for review
3. **tier2_verified** - Tier 2 Officer verifies submission
4. **tier1_approved** - Tier 1 approves submission (issues command)
5. **tier2_implemented** - Tier 2 Registrar implements changes
6. **completed** - Workflow complete
7. **rejected** - Submission rejected (can occur at Tier 1)

---

## Deletion Workflow (Company, Product, SKU)

**Rule:** Tier 2 Officer can **request** deletion; Tier 1 must **approve** and **issue the command** to Tier 2 Registrar to **implement** the deletion. When deletion happens it must be **kept for audit**.

- **Request:** Tier 2 Officer creates a registry submission with `submission_type` = `company_delete`, `product_delete`, or `sku_delete` (and corresponding `entity_type`, `entity_id`).
- **Verify:** Tier 2 Officer verifies the submission (`rmm_verify_registry_submission`).
- **Approve:** Tier 1 approves (`rmm_approve_registry_submission`) — this is the formal command to implement.
- **Implement:** Tier 2 Registrar implements (`rmm_implement_registry_update`): applies **soft delete** (deactivation: `deactivated_at`, `deactivated_by`, `deactivated_reason`), respects cascade deactivation (company → products → SKUs), and completes the submission.
- **Audit:** All steps and the final deactivation are logged; audit_logs retain operation_type and old_values (see [audit-logging-spec.md](../../02-architecture/security/audit-logging-spec.md)). No hard deletes of auditable records.

---

## Backend Components

### Registry Submission Workflow RPC Functions
- **Status:** ⚪ NOT STARTED
- **Phase:** 1.1.2
- **Owner:** Maya
- **Tasks:** 1.1.2.6-1.1.2.15
- **Functions:**
  - `rmm_submit_registry_update()` - Create submission
  - `rmm_verify_registry_submission()` - Tier 2 verification
  - `rmm_approve_registry_submission()` - Tier 1 approval
  - `rmm_implement_registry_update()` - Tier 2 implementation
  - `rmm_complete_registry_submission()` - Completion
  - `rmm_reject_registry_submission()` - Rejection
  - Two-person rule validation functions
  - Cascade deactivation logic
  - Soft delete safeguards

---

## Related Documentation

- **Routes:** [route-inventory.md](../../../02-architecture/frontend/route-inventory.md#rmm-routes)
- **Wireframes:** [Registry Workflow Wireframes](../../../04-design/user-experience/wireframes/01-rmm/workflow/)
- **Database:** [registry_submissions table](../../../02-architecture/database/data-dictionary.md#registry-submissions), [approval_history table](../../../02-architecture/database/data-dictionary.md#approval-history)
- **APIs:** [rmm workflow functions](../../../02-architecture/api/rpc-functions.md#rmm-module-functions)
- **Architecture:** [Workflow Architecture](../../../02-architecture/workflow-architecture.md)

---

## Status Summary

- ⚪ Backend workflow RPC functions not started
- ⚪ Frontend pages not started (blocked until backend complete)
- ✅ Wireframes complete and approved
- ✅ Database schema ready

---

## Dependencies

- ⚠️ Frontend blocked until backend RPC functions complete (Tasks 1.1.2.6-1.1.2.15)
- ⚠️ Requires two-person rule implementation
- ⚠️ Requires approval history tracking
