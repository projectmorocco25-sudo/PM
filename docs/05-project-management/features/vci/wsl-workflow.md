# WSL Workflow Feature Tracking

**Feature:** WSL (Weekly Stock Levels) Workflow & Compliance Violations  
**Module:** VCI  
**Status:** ⚪ NOT STARTED  
**Last Updated:** 2026-01-15

---

## Overview

Weekly submission workflow for stock levels with automatic breach detection (stock < 80% threshold), compliance violation tracking, and governance response workflows.

---

## Components

### WSL Submissions List Page
- **Route:** `/vci/submissions/wsl`
- **Wireframe:** [task-0.5.3.19](../../../04-design/user-experience/wireframes/02-vci/wsl/task-0.5.3.19-wsl-submissions-list.md) ✅
- **Database:** `wsl_submissions`, `breaches`
- **API:** `vci_list_wsl_submissions()`, `vci_get_wsl_submission()`
- **Status:** ⚪ NOT STARTED
- **Phase:** 1.2.3
- **Owner:** Emma
- **Task:** 1.2.3.13

### WSL Submission Form
- **Route:** `/vci/submissions/wsl/new`
- **Wireframe:** [task-0.5.3.20](../../../04-design/user-experience/wireframes/02-vci/wsl/task-0.5.3.20-wsl-submission-form.md) ✅
- **Database:** `wsl_submissions`, `breaches`
- **API:** `vci_submit_wsl()`
- **Status:** ⚪ NOT STARTED
- **Phase:** 1.2.3
- **Owner:** Emma
- **Task:** 1.2.3.14

### WSL Submission Detail Page
- **Route:** `/vci/submissions/wsl/[id]`
- **Wireframe:** [task-0.5.3.13](../../../04-design/user-experience/wireframes/02-vci/wsl/task-0.5.3.13-wsl-submission-detail.md) ✅
- **Database:** `wsl_submissions`, `breaches`, `thresholds`
- **API:** `vci_get_wsl_submission()`, `vci_get_wsl_breaches()`
- **Status:** ⚪ NOT STARTED
- **Phase:** 1.2.3
- **Owner:** Emma
- **Task:** 1.2.3.15

### Compliance Violations List Page
- **Route:** `/vci/breaches`
- **Wireframe:** [task-0.5.3.14](../../../04-design/user-experience/wireframes/02-vci/breaches/task-0.5.3.14-compliance-violations-list.md) ✅
- **Database:** `breaches`, `wsl_submissions`, `thresholds`
- **API:** `vci_list_breaches()`, `vci_get_breach()`
- **Status:** ⚪ NOT STARTED
- **Phase:** 1.2.3
- **Owner:** Emma
- **Task:** 1.2.3.16

### Compliance Violation Detail Page
- **Route:** `/vci/breaches/[id]`
- **Wireframe:** [task-0.5.3.15](../../../04-design/user-experience/wireframes/02-vci/breaches/task-0.5.3.15-compliance-violation-detail.md) ✅
- **Database:** `breaches`, `breach_actions`, `wsl_submissions`
- **API:** `vci_get_breach()`, `vci_get_breach_actions()`
- **Status:** ⚪ NOT STARTED
- **Phase:** 1.2.3
- **Owner:** Emma
- **Task:** 1.2.3.17

### Breach Analysis Interface (Tier 2)
- **Route:** Modal/interface on breach detail page
- **Wireframe:** [task-0.5.3.16](../../../04-design/user-experience/wireframes/02-vci/breaches/task-0.5.3.16-compliance-violation-analysis-interface.md) ✅
- **Database:** `breaches`, `breach_actions`
- **API:** `vci_suggest_breach_action()`, `vci_analyze_breach()`
- **Status:** ⚪ NOT STARTED
- **Phase:** 1.2.3
- **Owner:** Emma
- **Task:** 1.2.3.18

### Breach Action Approval Interface (Tier 1)
- **Route:** Modal/interface on breach detail page
- **Wireframe:** [task-0.5.3.17](../../../04-design/user-experience/wireframes/02-vci/breaches/task-0.5.3.17-compliance-violation-action-approval-interface.md) ✅
- **Database:** `breaches`, `breach_actions`, `approval_history`
- **API:** `vci_approve_breach_action()`, `vci_reject_breach_action()`
- **Status:** ⚪ NOT STARTED
- **Phase:** 1.2.3
- **Owner:** Emma
- **Task:** 1.2.3.19

### Governance Dashboard (MOH)
- **Route:** `/vci/governance`
- **Wireframe:** [task-0.5.3.18](../../../04-design/user-experience/wireframes/02-vci/overview/task-0.5.3.18-governance-dashboard.md) ✅
- **Database:** `breaches`, `thresholds`, `wsl_submissions`
- **API:** `vci_get_governance_dashboard()`, `vci_get_stock_sufficiency_charts()`
- **Status:** ⚪ NOT STARTED
- **Phase:** 1.2.3
- **Owner:** Emma
- **Task:** 1.2.3.20

---

## Backend Components

### WSL Backend RPC Functions
- **Status:** ⚪ NOT STARTED
- **Phase:** 1.2.3
- **Owner:** Maya
- **Tasks:** 1.2.3.1-1.2.3.12
- **Functions:**
  - `vci_submit_wsl()` - WSL submission (automatic breach detection)
  - `vci_detect_breach()` - Breach detection logic (stock < 80% threshold)
  - `vci_analyze_breach()` - Breach analysis
  - `vci_suggest_breach_action()` - Action suggestions
  - `vci_approve_breach_action()` - Tier 1 approval
  - `vci_reject_breach_action()` - Tier 1 rejection
  - WSL validation logic
  - WSL deadline validation (Friday EOD deadline)
  - Breach priority logic (normal, high, extreme)
  - Scheduled trigger for WSL deadline check

---

## Related Documentation

- **Routes:** [route-inventory.md](../../../02-architecture/frontend/route-inventory.md#vci-routes)
- **Wireframes:** [WSL Wireframes](../../../04-design/user-experience/wireframes/02-vci/wsl/), [Breach Wireframes](../../../04-design/user-experience/wireframes/02-vci/breaches/)
- **Database:** [wsl_submissions table](../../../02-architecture/database/data-dictionary.md#wsl-submissions), [breaches table](../../../02-architecture/database/data-dictionary.md#breaches)
- **APIs:** [vci_submit_wsl](../../../02-architecture/api/rpc-functions.md#vci-module-functions)

---

## Status Summary

- ⚪ Backend RPC functions not started
- ⚪ Frontend pages not started (blocked until backend complete)
- ✅ Wireframes complete and approved
- ✅ Database schema ready

---

## Dependencies

- ⚠️ **BLOCKED:** Requires Phase 1.1 (RMM) complete
- ⚠️ **BLOCKED:** Requires Phase 1.2.1 (AAMS) complete (for thresholds)
- ⚠️ **BLOCKED:** Requires integration checkpoint validations
- ⚠️ Frontend blocked until backend RPC functions complete
- ⚠️ Requires seed data stage: seed_1_2_3_vci_wsl

---

## Key Features

- Weekly submission deadline: Friday EOD
- All SKUs must be submitted (required for all SKUs)
- Automatic breach detection: stock < 80% threshold
- Threshold compliance % calculation (stock / threshold * 100)
- Conditional fields: replenishment_date and breach_reason if compliance < 80%
- Breach priority: normal, high, extreme
- Governance workflow: Tier 2 analysis → Tier 1 approval
