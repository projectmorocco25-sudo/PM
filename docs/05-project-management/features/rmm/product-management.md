# Product Management Feature Tracking

**Feature:** RMM Product Management  
**Module:** RMM  
**Status:** ⚪ NOT STARTED  
**Last Updated:** 2026-01-15

---

## Overview

Product entity management with CRUD operations, ATC code integration, and registry submission workflow.

---

## Components

### Products List Page
- **Route:** `/rmm/products`
- **Wireframe:** [task-0.5.2.4](../../../04-design/user-experience/wireframes/01-rmm/products/task-0.5.2.4-products-list.md) ✅
- **Database:** `products`, `companies`
- **API:** `rmm_list_products()`, `rmm_get_product()`
- **Status:** ⚪ NOT STARTED
- **Phase:** 1.1.2
- **Owner:** Emma
- **Task:** 1.1.2.20

### Product Detail Page
- **Route:** `/rmm/products/[id]`
- **Wireframe:** [task-0.5.2.5](../../../04-design/user-experience/wireframes/01-rmm/products/task-0.5.2.5-product-detail.md) ✅
- **Database:** `products`, `skus`, `registry_submissions`
- **API:** `rmm_get_product()`, `rmm_list_product_skus()`, `rmm_get_product_history()`
- **Status:** ⚪ NOT STARTED
- **Phase:** 1.1.2
- **Owner:** Emma
- **Task:** 1.1.2.21

### Product Create Form
- **Route:** `/rmm/products/new`
- **Wireframe:** [task-0.5.2.9](../../../04-design/user-experience/wireframes/01-rmm/products/task-0.5.2.9-product-create-edit-form.md) ✅
- **Database:** `products`, `registry_submissions`
- **API:** `rmm_create_product()`, `rmm_submit_registry_update()`
- **Status:** ⚪ NOT STARTED
- **Phase:** 1.1.2
- **Owner:** Emma
- **Task:** 1.1.2.22

### Product Edit Form
- **Route:** `/rmm/products/[id]/edit`
- **Wireframe:** [task-0.5.2.9](../../../04-design/user-experience/wireframes/01-rmm/products/task-0.5.2.9-product-create-edit-form.md) ✅
- **Database:** `products`, `registry_submissions`
- **API:** `rmm_update_product()`, `rmm_submit_registry_update()`
- **Status:** ⚪ NOT STARTED
- **Phase:** 1.1.2
- **Owner:** Emma
- **Task:** 1.1.2.22

---

## Backend Components

### Product CRUD RPC Functions
- **Status:** ⚪ NOT STARTED
- **Phase:** 1.1.2
- **Owner:** Maya
- **Task:** 1.1.2.2
- **Functions:**
  - `rmm_create_product()`
  - `rmm_update_product()`
  - `rmm_get_product()`
  - `rmm_list_products()`
  - `rmm_submit_registry_update()`

---

## Related Documentation

- **Routes:** [route-inventory.md](../../../02-architecture/frontend/route-inventory.md#rmm-routes)
- **Wireframes:** [Product Wireframes](../../../04-design/user-experience/wireframes/01-rmm/products/)
- **Database:** [products table](../../../02-architecture/database/data-dictionary.md#products)
- **APIs:** [rmm_create_product](../../../02-architecture/api/rpc-functions.md#rmm-module-functions)

---

## Status Summary

- ⚪ Backend RPC functions not started
- ⚪ Frontend pages not started (blocked until backend complete)
- ✅ Wireframes complete and approved
- ✅ Database schema ready

---

## Dependencies

- ⚠️ Frontend blocked until backend RPC functions complete (Task 1.1.2.2)
- ⚠️ Requires ATC codes seed data
- ⚠️ Requires seed data stage: seed_1_1_2_rmm
