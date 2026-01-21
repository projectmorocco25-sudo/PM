# AAMS Workflow Feature Tracking

**Feature:** AAMS (Annual Average Monthly Sales) Workflow  
**Module:** VCI  
**Status:** ⚪ NOT STARTED  
**Last Updated:** 2026-01-15

---

## Overview

Annual submission workflow for calculating thresholds based on average monthly sales data. Includes threshold calculation, modification, and reversion management.

---

## Components

### AAMS Submissions List Page
- **Route:** `/vci/submissions/aams`
- **Wireframe:** [task-0.5.3.1](../../../04-design/user-experience/wireframes/02-vci/aams/task-0.5.3.1-aams-submissions-list.md) ✅
- **Database:** `aams_submissions`
- **API:** `vci_list_aams_submissions()`, `vci_get_aams_submission()`
- **Status:** ⚪ NOT STARTED
- **Phase:** 1.2.1
- **Owner:** Emma
- **Task:** 1.2.1.14

### AAMS Submission Form
- **Route:** `/vci/submissions/aams/new`
- **Wireframe:** [task-0.5.3.2](../../../04-design/user-experience/wireframes/02-vci/aams/task-0.5.3.2-aams-submission-form.md) ✅
- **Database:** `aams_submissions`
- **API:** `vci_submit_aams()`
- **Status:** ⚪ NOT STARTED
- **Phase:** 1.2.1
- **Owner:** Emma
- **Task:** 1.2.1.15

### AAMS Submission Detail Page
- **Route:** `/vci/submissions/aams/[id]`
- **Wireframe:** [task-0.5.3.3](../../../04-design/user-experience/wireframes/02-vci/aams/task-0.5.3.3-aams-submission-detail.md) ✅
- **Database:** `aams_submissions`, `thresholds`
- **API:** `vci_get_aams_submission()`, `vci_get_aams_threshold()`
- **Status:** ⚪ NOT STARTED
- **Phase:** 1.2.1
- **Owner:** Emma
- **Task:** 1.2.1.16

### AAMS Workflow Actions
- **Route:** Modal/action components on submission detail page
- **Wireframe:** [task-0.5.3.3](../../../04-design/user-experience/wireframes/02-vci/aams/task-0.5.3.3-aams-submission-detail.md) ✅
- **Database:** `aams_submissions`, `thresholds`
- **API:** `vci_verify_aams()`, `vci_approve_aams_threshold()`
- **Status:** ⚪ NOT STARTED
- **Phase:** 1.2.1
- **Owner:** Emma
- **Task:** 1.2.1.17

### Threshold Management Page
- **Route:** `/vci/thresholds`
- **Wireframe:** [task-0.5.3.4](../../../04-design/user-experience/wireframes/02-vci/aams/task-0.5.3.4-threshold-management.md) ✅
- **Database:** `thresholds`, `skus`, `companies`
- **API:** `vci_list_thresholds()`, `vci_get_threshold()`
- **Status:** ⚪ NOT STARTED
- **Phase:** 1.2.1
- **Owner:** Emma
- **Task:** 1.2.1.18

### Threshold Modification Form
- **Route:** Modal component on threshold detail page
- **Wireframe:** [task-0.5.3.6](../../../04-design/user-experience/wireframes/02-vci/aams/task-0.5.3.6-threshold-modification-modal.md) ✅
- **Database:** `thresholds`, `threshold_modifications`
- **API:** `vci_modify_threshold()`
- **Status:** ⚪ NOT STARTED
- **Phase:** 1.2.1
- **Owner:** Emma
- **Task:** 1.2.1.19

---

## Backend Components

### AAMS Backend RPC Functions
- **Status:** ⚪ NOT STARTED
- **Phase:** 1.2.1
- **Owner:** Maya
- **Tasks:** 1.2.1.1-1.2.1.12
- **Functions:**
  - `vci_submit_aams()` - AAMS submission
  - `vci_verify_aams()` - AAMS verification (includes threshold calculation)
  - `vci_approve_aams_threshold()` - Tier 1 approval
  - `vci_complete_aams()` - Completion workflow
  - `vci_reject_aams()` - Rejection workflow
  - Threshold calculation logic (B multiplier: 3 standard, 3.5 critical medicines)
  - Threshold modification logic (local per-SKU, global system-wide)
  - AAMS deadline validation (January 31 deadline, 15-day grace period)
  - Previous year AAMS fallback logic

---

## Related Documentation

- **Routes:** [route-inventory.md](../../../02-architecture/frontend/route-inventory.md#vci-routes)
- **Wireframes:** [AAMS Wireframes](../../../04-design/user-experience/wireframes/02-vci/aams/)
- **Database:** [aams_submissions table](../../../02-architecture/database/data-dictionary.md#aams-submissions), [thresholds table](../../../02-architecture/database/data-dictionary.md#thresholds)
- **APIs:** [vci_submit_aams](../../../02-architecture/api/rpc-functions.md#vci-module-functions)

---

## Status Summary

- ⚪ Backend RPC functions not started
- ⚪ Frontend pages not started (blocked until backend complete)
- ✅ Wireframes complete and approved
- ✅ Database schema ready

---

## Dependencies

- ⚠️ **BLOCKED:** Requires Phase 1.1 (RMM) complete
- ⚠️ **BLOCKED:** Requires integration checkpoint validations
- ⚠️ Frontend blocked until backend RPC functions complete
- ⚠️ Requires seed data stage: seed_1_2_1_vci_aams

---

## Key Features

- Annual submission deadline: January 31
- 15-day grace period
- Threshold calculation: B × threshold_base (B = 3 standard, 3.5 critical medicines)
- Duration types: permanent, temporary_auto_revert, temporary_manual_review
- Threshold reversion management
