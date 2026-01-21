# Compliance Monitoring Center Feature Tracking

**Feature:** CMC (Compliance Monitoring Center) Module  
**Module:** CMC  
**Status:** ⚪ NOT STARTED  
**Last Updated:** 2026-01-15

---

## Overview

Compliance scoring, disputes, and regulatory reporting based on aggregated data from all modules.

---

## Components

### Compliance Scores
- **Route:** `/cmc/scores`
- **Wireframe:** [task-0.5.5.1](../../../04-design/user-experience/wireframes/04-cmc/scores/task-0.5.5.1-compliance-scores-list.md) ✅
- **Database:** `compliance_scores`
- **API:** `cmc_list_compliance_scores()`, `cmc_get_compliance_score()`
- **Status:** ⚪ NOT STARTED
- **Phase:** 1.4.2
- **Owner:** Emma

### Compliance Disputes
- **Route:** `/cmc/disputes`
- **Wireframe:** [task-0.5.5.6](../../../04-design/user-experience/wireframes/04-cmc/disputes/task-0.5.5.6-compliance-disputes-list.md) ✅
- **Database:** `compliance_disputes`
- **API:** `cmc_list_disputes()`, `cmc_get_dispute()`
- **Status:** ⚪ NOT STARTED
- **Phase:** 1.4.2
- **Owner:** Emma

### Regulatory Reports
- **Route:** `/cmc/reports`
- **Wireframe:** [task-0.5.5.10](../../../04-design/user-experience/wireframes/04-cmc/reports/task-0.5.5.10-reports-list.md) ✅
- **Database:** `regulatory_reports`
- **API:** `cmc_list_reports()`, `cmc_generate_report()`
- **Status:** ⚪ NOT STARTED
- **Phase:** 1.4.3
- **Owner:** Emma

---

## Backend Components

### CMC Backend RPC Functions
- **Status:** ⚪ NOT STARTED
- **Phase:** 1.4.1-1.4.4
- **Owner:** Maya
- **Key Functions:**
  - Compliance score calculation (weighted components)
  - Monthly score calculation
  - Score disputes (creation, review, resolution)
  - Regulatory report generation
  - Component score calculations (from all modules)

---

## Related Documentation

- **Routes:** [route-inventory.md](../../../02-architecture/frontend/route-inventory.md#cmc-routes)
- **Wireframes:** [CMC Wireframes](../../../04-design/user-experience/wireframes/04-cmc/)
- **Database:** [CMC tables](../../../02-architecture/database/data-dictionary.md#cmc-tables)
- **APIs:** [CMC RPC functions](../../../02-architecture/api/rpc-functions.md#cmc-module-functions)

---

## Status Summary

- ⚪ Backend RPC functions not started
- ⚪ Frontend pages not started
- ✅ Wireframes complete and approved
- ✅ Database schema ready

---

## Dependencies

- ⚠️ **BLOCKED:** Requires Phase 1.1 (RMM) complete
- ⚠️ **BLOCKED:** Requires Phase 1.2 (VCI) complete
- ⚠️ **BLOCKED:** Requires Phase 1.3 (ECS) complete (if active)
- ⚠️ **BLOCKED:** Requires integration checkpoint validations
- ⚠️ Frontend blocked until backend complete
