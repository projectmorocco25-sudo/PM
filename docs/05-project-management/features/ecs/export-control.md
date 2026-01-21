# Export Control System Feature Tracking

**Feature:** ECS (Export Control System) Module  
**Module:** ECS  
**Status:** ⚪ NOT STARTED  
**Last Updated:** 2026-01-15

---

## Overview

Export control workflow with threshold switching, authorization management, and replenishment tracking.

---

## Components

### Export Requests
- **Route:** `/ecs/export-requests`
- **Wireframe:** [task-0.5.4.1](../../../04-design/user-experience/wireframes/03-ecs/export-requests/task-0.5.4.1-export-requests-list.md) ✅
- **Database:** `export_requests`
- **API:** `ecs_list_export_requests()`, `ecs_get_export_request()`
- **Status:** ⚪ NOT STARTED
- **Phase:** 1.3.3
- **Owner:** Emma

### Export Authorizations
- **Route:** `/ecs/authorizations`
- **Wireframe:** [task-0.5.4.5](../../../04-design/user-experience/wireframes/03-ecs/authorizations/task-0.5.4.5-export-authorizations-list.md) ✅
- **Database:** `export_authorizations`
- **API:** `ecs_list_authorizations()`, `ecs_get_authorization()`
- **Status:** ⚪ NOT STARTED
- **Phase:** 1.3.3
- **Owner:** Emma

### Replenishment Tracking
- **Route:** `/ecs/replenishment`
- **Wireframe:** [task-0.5.4.8](../../../04-design/user-experience/wireframes/03-ecs/replenishment/task-0.5.4.8-replenishment-schedule-tracking.md) ✅
- **Database:** `replenishment_schedules`
- **API:** `ecs_get_replenishment_schedules()`
- **Status:** ⚪ NOT STARTED
- **Phase:** 1.3.3
- **Owner:** Emma

---

## Backend Components

### ECS Backend RPC Functions
- **Status:** ⚪ NOT STARTED
- **Phase:** 1.3.1-1.3.3
- **Owner:** Maya
- **Key Functions:**
  - Export request submission and evaluation
  - Threshold switching logic (VCI → ECS)
  - Export authorization workflow
  - Replenishment schedule tracking
  - XAMS calculation

---

## Related Documentation

- **Routes:** [route-inventory.md](../../../02-architecture/frontend/route-inventory.md#ecs-routes)
- **Wireframes:** [ECS Wireframes](../../../04-design/user-experience/wireframes/03-ecs/)
- **Database:** [ECS tables](../../../02-architecture/database/data-dictionary.md#ecs-tables)
- **APIs:** [ECS RPC functions](../../../02-architecture/api/rpc-functions.md#ecs-module-functions)

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
- ⚠️ **BLOCKED:** Requires integration checkpoint validations
- ⚠️ Frontend blocked until backend complete
