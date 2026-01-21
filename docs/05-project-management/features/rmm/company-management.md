# Company Management Feature Tracking

**Feature:** RMM Company Management  
**Module:** RMM  
**Status:** 🟡 IN PROGRESS  
**Last Updated:** 2026-01-15

---

## Overview

Company entity management with CRUD operations, registry submission workflow, and approval chains.

---

## Components

### Companies List Page
- **Route:** `/rmm/companies`
- **Wireframe:** [task-0.5.2.2](../../../04-design/user-experience/wireframes/01-rmm/companies/task-0.5.2.2-companies-list.md) ✅
- **Database:** `companies` table
- **API:** `rmm_list_companies()`, `rmm_get_company()`
- **Status:** ⚪ NOT STARTED
- **Phase:** 1.1.2
- **Owner:** Emma
- **Task:** 1.1.2.17

### Company Detail Page
- **Route:** `/rmm/companies/[id]`
- **Wireframe:** [task-0.5.2.3](../../../04-design/user-experience/wireframes/01-rmm/companies/task-0.5.2.3-company-detail.md) ✅
- **Database:** `companies`, `products`, `registry_submissions`
- **API:** `rmm_get_company()`, `rmm_list_company_products()`, `rmm_get_company_history()`
- **Status:** ⚪ NOT STARTED
- **Phase:** 1.1.2
- **Owner:** Emma
- **Task:** 1.1.2.18

### Company Create Form
- **Route:** `/rmm/companies/new`
- **Wireframe:** [task-0.5.2.8](../../../04-design/user-experience/wireframes/01-rmm/companies/task-0.5.2.8-company-create-edit-form.md) ✅
- **Database:** `companies`, `registry_submissions`
- **API:** `rmm_create_company()`, `rmm_submit_registry_update()`
- **Status:** ⚪ NOT STARTED
- **Phase:** 1.1.2
- **Owner:** Emma
- **Task:** 1.1.2.19

### Company Edit Form
- **Route:** `/rmm/companies/[id]/edit`
- **Wireframe:** [task-0.5.2.8](../../../04-design/user-experience/wireframes/01-rmm/companies/task-0.5.2.8-company-create-edit-form.md) ✅
- **Database:** `companies`, `registry_submissions`
- **API:** `rmm_update_company()`, `rmm_submit_registry_update()`
- **Status:** ⚪ NOT STARTED
- **Phase:** 1.1.2
- **Owner:** Emma
- **Task:** 1.1.2.19

---

## Backend Components

### Company CRUD RPC Functions
- **Status:** 🟡 IN PROGRESS
- **Phase:** 1.1.2
- **Owner:** Maya
- **Task:** 1.1.2.1
- **Functions:**
  - `rmm_create_company()`
  - `rmm_update_company()`
  - `rmm_get_company()`
  - `rmm_list_companies()`
  - `rmm_submit_registry_update()`

---

## Related Documentation

- **Routes:** [route-inventory.md](../../../02-architecture/frontend/route-inventory.md#rmm-routes)
- **Wireframes:** [Company Wireframes](../../../04-design/user-experience/wireframes/01-rmm/companies/)
- **Database:** [companies table](../../../02-architecture/database/data-dictionary.md#companies), [registry_submissions table](../../../02-architecture/database/data-dictionary.md#registry-submissions)
- **APIs:** [rmm_create_company](../../../02-architecture/api/rpc-functions.md#rmm-module-functions)

---

## Status Summary

- 🟡 Backend RPC functions in progress
- ⚪ Frontend pages not started (blocked until backend complete)
- ✅ Wireframes complete and approved
- ✅ Database schema ready

---

## Dependencies

- ⚠️ Frontend blocked until backend RPC functions complete (Task 1.1.2.1)
- ⚠️ Requires seed data stage: seed_1_1_2_rmm
