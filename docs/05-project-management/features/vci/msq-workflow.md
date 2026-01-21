# MSQ Workflow Feature Tracking

**Feature:** MSQ (Monthly Sales Quantities) Workflow  
**Module:** VCI  
**Status:** ⚪ NOT STARTED  
**Last Updated:** 2026-01-15

---

## Overview

Monthly submission workflow for sales quantities with 20% threshold validation against AAMS and 7-day grace period for corrections.

---

## Components

### MSQ Submissions List Page
- **Route:** `/vci/submissions/msq`
- **Wireframe:** [task-0.5.3.9](../../../04-design/user-experience/wireframes/02-vci/msq/task-0.5.3.9-msq-submissions-list.md) ✅
- **Database:** `msq_submissions`
- **API:** `vci_list_msq_submissions()`, `vci_get_msq_submission()`
- **Status:** ⚪ NOT STARTED
- **Phase:** 1.2.2
- **Owner:** Emma
- **Task:** 1.2.2.10

### MSQ Submission Form
- **Route:** `/vci/submissions/msq/new`
- **Wireframe:** [task-0.5.3.10](../../../04-design/user-experience/wireframes/02-vci/msq/task-0.5.3.10-msq-submission-form.md) ✅
- **Database:** `msq_submissions`
- **API:** `vci_submit_msq()`
- **Status:** ⚪ NOT STARTED
- **Phase:** 1.2.2
- **Owner:** Emma
- **Task:** 1.2.2.11

### MSQ Submission Detail Page
- **Route:** `/vci/submissions/msq/[id]`
- **Wireframe:** [task-0.5.3.11](../../../04-design/user-experience/wireframes/02-vci/msq/task-0.5.3.11-msq-submission-detail.md) ✅
- **Database:** `msq_submissions`
- **API:** `vci_get_msq_submission()`
- **Status:** ⚪ NOT STARTED
- **Phase:** 1.2.2
- **Owner:** Emma
- **Task:** 1.2.2.12

### MSQ Correction Interface
- **Route:** `/vci/submissions/msq/[id]/correct`
- **Wireframe:** [task-0.5.3.20](../../../04-design/user-experience/wireframes/02-vci/msq/task-0.5.3.12-msq-correction-interface.md) ✅
- **Database:** `msq_submissions`
- **API:** `vci_correct_msq_submission()`
- **Status:** ⚪ NOT STARTED
- **Phase:** 1.2.2
- **Owner:** Emma
- **Task:** 1.2.2.13

---

## Backend Components

### MSQ Backend RPC Functions
- **Status:** ⚪ NOT STARTED
- **Phase:** 1.2.2
- **Owner:** Maya
- **Tasks:** 1.2.2.1-1.2.2.9
- **Functions:**
  - `vci_submit_msq()` - MSQ submission
  - `vci_flag_msq_for_review()` - Flag for MOH review
  - `vci_accept_msq()` - Accept submission
  - `vci_reject_msq()` - Reject submission
  - `vci_correct_msq_submission()` - Correction within grace period
  - MSQ validation logic
  - MSQ vs AAMS validation (20% threshold comparison)
  - 7-day grace period for corrections

---

## Related Documentation

- **Routes:** [route-inventory.md](../../../02-architecture/frontend/route-inventory.md#vci-routes)
- **Wireframes:** [MSQ Wireframes](../../../04-design/user-experience/wireframes/02-vci/msq/)
- **Database:** [msq_submissions table](../../../02-architecture/database/data-dictionary.md#msq-submissions)
- **APIs:** [vci_submit_msq](../../../02-architecture/api/rpc-functions.md#vci-module-functions)

---

## Status Summary

- ⚪ Backend RPC functions not started
- ⚪ Frontend pages not started (blocked until backend complete)
- ✅ Wireframes complete and approved
- ✅ Database schema ready

---

## Dependencies

- ⚠️ **BLOCKED:** Requires Phase 1.1 (RMM) complete
- ⚠️ **BLOCKED:** Requires Phase 1.2.1 (AAMS) complete (for validation)
- ⚠️ **BLOCKED:** Requires integration checkpoint validations
- ⚠️ Frontend blocked until backend RPC functions complete
- ⚠️ Requires seed data stage: seed_1_2_2_vci_msq

---

## Key Features

- Monthly submission (simplified structure: SKU_ID + Quantity only)
- 20% threshold validation against AAMS
- Flagged for review if exceeds 20% threshold
- 7-day grace period for corrections
- Correction tracking (correction_of field)
