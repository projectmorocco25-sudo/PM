# Dashboard Feature Tracking

**Feature:** Dashboard & Navigation  
**Module:** Core Foundation  
**Status:** ✅ COMPLETE  
**Last Updated:** 2026-01-15

---

## Overview

Role-based dashboards providing overview and quick access to key features for Company users, MOH Tier 1, and MOH Tier 2.

---

## Components

### Company Dashboard
- **Route:** `/dashboard` (Company role)
- **Wireframe:** [task-0.5.1.18](../../../04-design/user-experience/wireframes/00-core-foundation/dashboard/task-0.5.1.18-company-dashboard.md) ✅
- **Database:** `companies`, `submissions`, `notifications`, all module tables
- **API:** `shared_get_user_permissions()`, `rmm_*`, `vci_*`, all module RPCs
- **Status:** ✅ COMPLETE
- **Phase:** 1.1.1
- **Owner:** Emma

### MOH Tier 1 Dashboard
- **Route:** `/dashboard` (MOH Tier 1 role)
- **Wireframe:** [task-0.5.1.19](../../../04-design/user-experience/wireframes/00-core-foundation/dashboard/task-0.5.1.19-moh-tier1-dashboard.md) ✅
- **Database:** All tables
- **API:** `shared_get_user_permissions()`, All RPCs
- **Status:** ✅ COMPLETE
- **Phase:** 1.1.1
- **Owner:** Emma

### MOH Tier 2 Dashboard
- **Route:** `/dashboard` (MOH Tier 2 role)
- **Wireframe:** [task-0.5.1.20](../../../04-design/user-experience/wireframes/00-core-foundation/dashboard/task-0.5.1.20-moh-tier2-dashboard.md) ✅
- **Database:** All tables
- **API:** `shared_get_user_permissions()`, All RPCs
- **Status:** ✅ COMPLETE
- **Phase:** 1.1.1
- **Owner:** Emma

### Sidebar Navigation
- **Route:** N/A (Global component)
- **Wireframe:** [task-0.5.1.16](../../../04-design/user-experience/wireframes/00-core-foundation/layout-navigation/task-0.5.1.16-sidebar-navigation.md) ✅
- **Database:** `users.role`, `system_config`
- **API:** `shared_get_user_permissions()`
- **Status:** ✅ COMPLETE
- **Phase:** 1.1.1
- **Owner:** Emma

### Header Component
- **Route:** N/A (Global component)
- **Wireframe:** [task-0.5.1.15](../../../04-design/user-experience/wireframes/00-core-foundation/layout-navigation/task-0.5.1.15-header-component.md) ✅
- **Database:** `users`, `notifications`
- **API:** `shared_get_user_permissions()`
- **Status:** ✅ COMPLETE
- **Phase:** 1.1.1
- **Owner:** Emma

### Notification Center
- **Route:** N/A (Dropdown/Modal component)
- **Wireframe:** [task-0.5.1.17](../../../04-design/user-experience/wireframes/00-core-foundation/layout-navigation/task-0.5.1.17-notification-center-component.md) ✅
- **Database:** `notifications`
- **API:** `shared_create_notification()`, `shared_get_notifications()`
- **Status:** ✅ COMPLETE
- **Phase:** 1.1.1
- **Owner:** Emma

---

## Related Documentation

- **Routes:** [route-inventory.md](../../../02-architecture/frontend/route-inventory.md#dashboard-routes)
- **Wireframes:** [Dashboard Wireframes](../../../04-design/user-experience/wireframes/00-core-foundation/dashboard/)
- **Database:** [notifications table](../../../02-architecture/database/data-dictionary.md#notifications)
- **APIs:** [shared_get_user_permissions](../../../02-architecture/api/rpc-functions.md#shared_get_user_permissionsuser_id-uuid)

---

## Status Summary

- ✅ All dashboard pages implemented
- ✅ Role-based dashboards functional
- ✅ Navigation components complete
- ✅ Notification center integrated
