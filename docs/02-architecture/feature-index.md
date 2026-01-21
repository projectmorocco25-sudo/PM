# Master Feature Index - Pharmaceutical Governance Value Chain Platform (PM)

**Purpose:** This document provides a comprehensive, feature-centric view of all system features, linking routes, wireframes, database tables, APIs, and implementation status. This is the master index for feature traceability.

**Last Updated:** 2026-01-12  
**Status:** ✅ COMPLETE - Master feature tracking index  
**Owner:** Yasmine (Project Manager) + Emma (UI/UX) + Maya (Backend/API) + Nadia (Database)

---

## Overview

This index groups features by module and provides quick access to all related artifacts:
- **Routes** - Frontend routes and pages
- **Wireframes** - UI/UX design specifications
- **Database** - Database tables and schema
- **APIs** - RPC functions, Edge Functions, REST endpoints
- **Status** - Implementation and completion status

**For detailed information, see referenced documents:**
- **Route definitions:** [routing-structure.md](./frontend/routing-structure.md) - SINGLE SOURCE OF TRUTH for route paths
- **Route status:** [route-inventory.md](./frontend/route-inventory.md) - SINGLE SOURCE OF TRUTH for route implementation status
- **Wireframe-route mapping:** [wireframe-route-mapping.md](./frontend/wireframe-route-mapping.md) - SINGLE SOURCE OF TRUTH for wireframe-route relationships
- **Wireframes:** [Phase 0.5 Wireframes Catalog](../../05-project-management/phases/phase-0-5-wireframes-catalog.md)
- **Database:** [data-dictionary.md](./database/data-dictionary.md) | [schema-design.md](./database/schema-design.md)
- **APIs:** [rpc-functions.md](./api/rpc-functions.md) | [api-specification.md](./api/api-specification.md)
- **Implementation:** [Phase 1 Implementation Plan](../../05-project-management/phases/Phase-1-Implementation-Plan.md)

---

## Status Legend

### Overall Feature Status
- ✅ **Complete** - All components (Route, Wireframe, Database, API) complete and functional
- 🟡 **In Progress** - Work underway, some components complete
- ⚪ **Not Started** - Feature documented but not implemented
- ❌ **Blocked** - Implementation blocked by dependencies or issues

### Component Status (within features)
- ✅ **Complete** - Component implemented and tested
- 🟡 **In Progress** - Component being developed
- ⚪ **Not Started** - Component documented but not started
- 📋 **Pending** - Waiting for prerequisite

---

## Core Foundation Features

### Authentication & Access

| Feature | Route | Wireframe | Database | API | Status | Owner | Phase |
|---------|-------|-----------|----------|-----|--------|-------|-------|
| Login | `/auth/login` | task-0.5.1.11 ✅ | `users`, `auth.users` | Supabase Auth | ✅ | Emma | 1.1.1 |
| Registration | `/auth/register` | task-0.5.1.12 ✅ | `users` | Supabase Auth + `rmm_create_user` | ✅ | Emma | 1.1.1 |
| Forgot Password | `/auth/forgot-password` | task-0.5.1.13 ✅ | `auth.users` | Supabase Auth | ✅ | Emma | 1.1.1 |
| Reset Password | `/auth/reset-password` | task-0.5.1.13 ✅ | `auth.users` | Supabase Auth | ✅ | Emma | 1.1.1 |

**Related Documentation:**
- Routes: [route-inventory.md](./frontend/route-inventory.md#authentication-routes)
- Wireframes: [Authentication Wireframes](../../04-design/user-experience/wireframes/00-core-foundation/authentication/)
- Database: [users table](./database/data-dictionary.md#users)
- APIs: [Supabase Auth Configuration](./security/supabase-auth-configuration.md)

---

### Dashboard & Navigation

| Feature | Route | Wireframe | Database | API | Status | Owner | Phase |
|---------|-------|-----------|----------|-----|--------|-------|-------|
| Public Homepage | `/` | task-0.5.1.1 ✅ | None | None | ✅ | Emma | 1.1.1 |
| Company Dashboard | `/dashboard` | task-0.5.1.18 ✅ | `companies`, `submissions`, `notifications` | `shared_get_user_permissions`, `rmm_*`, `vci_*` | ✅ | Emma | 1.1.1 |
| MOH Tier 1 Dashboard | `/dashboard` | task-0.5.1.19 ✅ | All tables | `shared_get_user_permissions`, All RPCs | ✅ | Emma | 1.1.1 |
| MOH Tier 2 Dashboard | `/dashboard` | task-0.5.1.20 ✅ | All tables | `shared_get_user_permissions`, All RPCs | ✅ | Emma | 1.1.1 |
| Sidebar Navigation | N/A | task-0.5.1.16 ✅ | `users.role` | `shared_get_user_permissions` | ✅ | Emma | 1.1.1 |
| Header Component | N/A | task-0.5.1.15 ✅ | `users`, `notifications` | `shared_get_user_permissions` | ✅ | Emma | 1.1.1 |
| Notification Center | N/A | task-0.5.1.17 ✅ | `notifications` | `shared_create_notification`, `shared_get_notifications` | ✅ | Emma | 1.1.1 |

**Related Documentation:**
- Routes: [route-inventory.md](./frontend/route-inventory.md#dashboard-routes)
- Wireframes: [Dashboard Wireframes](../../04-design/user-experience/wireframes/00-core-foundation/dashboard/)
- Database: [notifications table](./database/data-dictionary.md#notifications)
- APIs: [shared_get_user_permissions](./api/rpc-functions.md#shared_get_user_permissionsuser_id-uuid)

---

### Communications

| Feature | Route | Wireframe | Database | API | Status | Owner | Phase |
|---------|-------|-----------|----------|-----|--------|-------|-------|
| Inbox | `/communications/inbox` | task-0.5.1.24 ✅ | `conversations`, `messages`, `message_attachments` | `communications_list_conversations`, `communications_get_conversation` | ✅ | Emma | 1.1.1 |
| Conversation Detail | `/communications/inbox/[id]` | task-0.5.1.25 ✅ | `conversations`, `messages`, `message_attachments`, `message_read_receipts` | `communications_get_conversation`, `communications_send_message` | ✅ | Emma | 1.1.1 |
| Compose Message | `/communications/compose` | task-0.5.1.26 ✅ | `conversations`, `messages`, `message_attachments` | `communications_create_conversation`, `communications_send_message` | ✅ | Emma | 1.1.1 |
| Sent Messages | `/communications/sent` | task-0.5.1.27 ✅ | `conversations`, `messages` | `communications_list_sent` | ✅ | Emma | 1.1.1 |
| System Announcements | `/communications/announcements` | task-0.5.1.28 ✅ | `conversations`, `messages` | `communications_create_announcement`, `communications_list_announcements` | ✅ | Emma | 1.1.1 |
| Archived Conversations | `/communications/archived` | task-0.5.1.36 ✅ | `conversations` | `communications_archive_conversation`, `communications_list_archived` | 📋 | Emma | 1.1.1 |

**Related Documentation:**
- Routes: [route-inventory.md](./frontend/route-inventory.md#communications-routes)
- Wireframes: [Communication Wireframes](../../04-design/user-experience/wireframes/00-core-foundation/communications/)
- Database: [Communication Channels Schema](./database/data-dictionary.md#communications-tables)
- APIs: [Communication API Specifications](./api/rpc-functions.md#communications-module-functions)

---

### Global Pages

| Feature | Route | Wireframe | Database | API | Status | Owner | Phase |
|---------|-------|-----------|----------|-----|--------|-------|-------|
| History Overview | `/history` | task-0.5.1.30 ✅ | All modules | `vci_get_historical_submissions`, `rmm_get_history` | ⚠️ | Emma | 1.1.7 |
| Notifications Page | `/notifications` | task-0.5.1.31 ✅ | `notifications` | `shared_get_notifications`, `shared_mark_notification_read` | ⚠️ | Emma | 1.1.1 |
| Audit Logs List | `/audit/logs` | task-0.5.1.32 ✅ | `audit_logs` | `shared_get_audit_logs`, `shared_get_audit_log_detail` | ⚠️ | Emma | 1.1.7 |
| Audit Log Detail | `/audit/logs/[id]` | task-0.5.1.33 ✅ | `audit_logs` | `shared_get_audit_log_detail` | ⚠️ | Emma | 1.1.7 |
| Audit Reports | `/audit/reports` | task-0.5.1.34 ✅ | `audit_logs` | `shared_generate_audit_report` | ⚠️ | Emma | 1.1.7 |
| System Configuration | `/system-config` | task-0.5.1.35 ✅ | `system_config` | `shared_get_module_config`, `shared_activate_module` | ⚠️ | Emma | 1.1.1 |
| User Profile | `/profile` | task-0.5.1.22 ✅ | `users` | `shared_update_user_profile`, `shared_update_user_preferences` | ✅ | Emma | 1.1.1 |

**Related Documentation:**
- Routes: [route-inventory.md](./frontend/route-inventory.md#global-routes)
- Wireframes: [Global Section Wireframes](../../04-design/user-experience/wireframes/00-core-foundation/global/)
- Database: [audit_logs table](./database/data-dictionary.md#audit_logs), [system_config table](./database/data-dictionary.md#system_config)
- APIs: [shared audit functions](./api/rpc-functions.md#shared_functions)

---

## RMM Module Features

### Company Management

| Feature | Route | Wireframe | Database | API | Status | Owner | Phase |
|---------|-------|-----------|----------|-----|--------|-------|-------|
| Companies List | `/rmm/companies` | task-0.5.2.2 ✅ | `companies` | `rmm_list_companies`, `rmm_get_company` | ⚠️ | Emma | 1.1.2 |
| Company Detail | `/rmm/companies/[id]` | task-0.5.2.3 ✅ | `companies`, `products`, `registry_submissions` | `rmm_get_company`, `rmm_list_company_products`, `rmm_get_company_history` | ⚠️ | Emma | 1.1.2 |
| Create Company | `/rmm/companies/new` | task-0.5.2.8 ✅ | `companies`, `registry_submissions` | `rmm_create_company`, `rmm_submit_registry_update` | ⚠️ | Emma | 1.1.2 |
| Edit Company | `/rmm/companies/[id]/edit` | task-0.5.2.8 ✅ | `companies`, `registry_submissions` | `rmm_update_company`, `rmm_submit_registry_update` | ⚠️ | Emma | 1.1.2 |
| RMM Overview | `/rmm` | task-0.5.2.16 ✅ | `companies`, `products`, `skus`, `registry_submissions` | `rmm_get_overview_stats` | ⚠️ | Emma | 1.1.2 |

**Related Documentation:**
- Routes: [route-inventory.md](./frontend/route-inventory.md#rmm-routes)
- Wireframes: [Company Wireframes](../../04-design/user-experience/wireframes/01-rmm/companies/)
- Database: [companies table](./database/data-dictionary.md#companies), [registry_submissions table](./database/data-dictionary.md#registry-submissions)
- APIs: [rmm_create_company](./api/rpc-functions.md#rmm_create_company), [rmm_submit_registry_update](./api/rpc-functions.md#rmm_submit_registry_update)

---

### Product Management

| Feature | Route | Wireframe | Database | API | Status | Owner | Phase |
|---------|-------|-----------|----------|-----|--------|-------|-------|
| Products List | `/rmm/products` | task-0.5.2.4 ✅ | `products`, `companies` | `rmm_list_products`, `rmm_get_product` | ⚠️ | Emma | 1.1.2 |
| Product Detail | `/rmm/products/[id]` | task-0.5.2.5 ✅ | `products`, `skus`, `registry_submissions` | `rmm_get_product`, `rmm_list_product_skus`, `rmm_get_product_history` | ⚠️ | Emma | 1.1.2 |
| Create Product | `/rmm/products/new` | task-0.5.2.9 ✅ | `products`, `registry_submissions` | `rmm_create_product`, `rmm_submit_registry_update` | ⚠️ | Emma | 1.1.2 |
| Edit Product | `/rmm/products/[id]/edit` | task-0.5.2.9 ✅ | `products`, `registry_submissions` | `rmm_update_product`, `rmm_submit_registry_update` | ⚠️ | Emma | 1.1.2 |

**Related Documentation:**
- Routes: [route-inventory.md](./frontend/route-inventory.md#rmm-routes)
- Wireframes: [Product Wireframes](../../04-design/user-experience/wireframes/01-rmm/products/)
- Database: [products table](./database/data-dictionary.md#products)
- APIs: [rmm_create_product](./api/rpc-functions.md#rmm-module-functions)

---

### SKU Management

| Feature | Route | Wireframe | Database | API | Status | Owner | Phase |
|---------|-------|-----------|----------|-----|--------|-------|-------|
| SKUs List | `/rmm/skus` | task-0.5.2.6 ✅ | `skus`, `products` | `rmm_list_skus`, `rmm_get_sku` | ⚠️ | Emma | 1.1.2 |
| SKU Detail | `/rmm/skus/[id]` | task-0.5.2.7 ✅ | `skus`, `registry_submissions`, `thresholds` | `rmm_get_sku`, `rmm_get_sku_history`, `vci_get_sku_thresholds` | ⚠️ | Emma | 1.1.2 |
| Create SKU | `/rmm/skus/new` | task-0.5.2.10 ✅ | `skus`, `registry_submissions` | `rmm_create_sku`, `rmm_submit_registry_update` | ⚠️ | Emma | 1.1.2 |
| Edit SKU | `/rmm/skus/[id]/edit` | task-0.5.2.10 ✅ | `skus`, `registry_submissions` | `rmm_update_sku`, `rmm_submit_registry_update` | ⚠️ | Emma | 1.1.2 |

**Related Documentation:**
- Routes: [route-inventory.md](./frontend/route-inventory.md#rmm-routes)
- Wireframes: [SKU Wireframes](../../04-design/user-experience/wireframes/01-rmm/skus/)
- Database: [skus table](./database/data-dictionary.md#skus)
- APIs: [rmm_create_sku](./api/rpc-functions.md#rmm-module-functions)

---

### Registry Submission Workflow

| Feature | Route | Wireframe | Database | API | Status | Owner | Phase |
|---------|-------|-----------|----------|-----|--------|-------|-------|
| Registry Submissions List | `/rmm/submissions` | task-0.5.2.11 ✅ | `registry_submissions` | `rmm_list_submissions`, `rmm_get_submission` | ⚠️ | Emma | 1.1.2 |
| Registry Submission Detail | `/rmm/submissions/[id]` | task-0.5.2.12 ✅ | `registry_submissions`, `approval_history` | `rmm_get_submission`, `rmm_get_approval_history` | ⚠️ | Emma | 1.1.2 |
| Verify Submission (Tier 2) | N/A (Modal/Action) | task-0.5.2.13 ✅ | `registry_submissions`, `approval_history` | `rmm_verify_registry_submission` | ⚠️ | Emma | 1.1.2 |
| Approve Submission (Tier 1) | N/A (Modal/Action) | task-0.5.2.13 ✅ | `registry_submissions`, `approval_history` | `rmm_approve_registry_submission` | ⚠️ | Emma | 1.1.2 |
| Implement Submission (Tier 2 Registrar) | N/A (Modal/Action) | task-0.5.2.13 ✅ | `registry_submissions`, `approval_history` | `rmm_implement_registry_update` | ⚠️ | Emma | 1.1.2 |

**Related Documentation:**
- Routes: [route-inventory.md](./frontend/route-inventory.md#rmm-routes)
- Wireframes: [Registry Workflow Wireframes](../../04-design/user-experience/wireframes/01-rmm/workflow/)
- Database: [registry_submissions table](./database/data-dictionary.md#registry-submissions), [approval_history table](./database/data-dictionary.md#approval-history)
- APIs: [rmm workflow functions](./api/rpc-functions.md#rmm_verify_registry_submission), [workflow architecture](./workflow-architecture.md)

---

### Enforcement Module

| Feature | Route | Wireframe | Database | API | Status | Owner | Phase |
|---------|-------|-----------|----------|-----|--------|-------|-------|
| Enforcement Dashboard | `/enforcement` | task-0.5.2.0 ✅ | `enforcement_actions`, `companies` | `enforcement_get_dashboard_stats` | ⚠️ | Emma | 1.1.2 |
| Enforcement Actions List | `/enforcement/actions` | task-0.5.2.1 ✅ | `enforcement_actions` | `enforcement_list_actions`, `enforcement_get_action` | ⚠️ | Emma | 1.1.2 |
| Enforcement Action Detail | `/enforcement/actions/[id]` | task-0.5.2.1a ✅ | `enforcement_actions`, `approval_history`, `appeals` | `enforcement_get_action`, `enforcement_get_appeals` | ⚠️ | Emma | 1.1.2 |
| Create Enforcement Action | `/enforcement/actions/new` | task-0.5.2.1b ✅ | `enforcement_actions`, `registry_submissions` | `enforcement_create_action`, `enforcement_submit_action` | ⚠️ | Emma | 1.1.2 |
| Pending Approvals | `/enforcement/pending-approvals` | task-0.5.2.1c ✅ | `enforcement_actions` | `enforcement_list_pending_approvals`, `enforcement_approve_action` | ⚠️ | Emma | 1.1.2 |
| Enforcement Reports | `/enforcement/reports` | task-0.5.2.1d ✅ | `enforcement_actions` | `enforcement_generate_reports` | ⚠️ | Emma | 1.1.2 |
| Appeal Review | `/enforcement/appeals/[id]` | task-0.5.2.1e ✅ | `appeals`, `enforcement_actions` | `enforcement_review_appeal`, `enforcement_uphold_appeal`, `enforcement_overturn_appeal` | 📋 | Emma | 1.1.2 |
| Submit Appeal | `/enforcement/actions/[id]/appeal` | task-0.5.2.1f ✅ | `appeals` | `enforcement_submit_appeal` | 📋 | Emma | 1.1.2 |

**Related Documentation:**
- Routes: [route-inventory.md](./frontend/route-inventory.md#enforcement-routes)
- Wireframes: [Enforcement Wireframes](../../04-design/user-experience/wireframes/01-rmm/enforcement/)
- Database: [enforcement_actions table](./database/data-dictionary.md#enforcement-actions), [appeals table](./database/data-dictionary.md#appeals)
- APIs: [enforcement functions](./api/rpc-functions.md#enforcement-module-functions)

---

## VCI Module Features

### AAMS (Annual Average Monthly Sales)

| Feature | Route | Wireframe | Database | API | Status | Owner | Phase |
|---------|-------|-----------|----------|-----|--------|-------|-------|
| AAMS Submissions List | `/vci/submissions/aams` | task-0.5.3.1 ✅ | `aams_submissions` | `vci_list_aams_submissions`, `vci_get_aams_submission` | ⚠️ | Emma | 1.1.3 |
| AAMS Submission Detail | `/vci/submissions/aams/[id]` | task-0.5.3.3 ✅ | `aams_submissions`, `thresholds` | `vci_get_aams_submission`, `vci_get_aams_threshold` | ⚠️ | Emma | 1.1.3 |
| Create AAMS Submission | `/vci/submissions/aams/new` | task-0.5.3.2 ✅ | `aams_submissions` | `vci_submit_aams` | ⚠️ | Emma | 1.1.3 |
| Verify AAMS (Tier 2) | N/A (Modal/Action) | task-0.5.3.3 ✅ | `aams_submissions`, `thresholds` | `vci_verify_aams` | ⚠️ | Emma | 1.1.3 |
| Approve AAMS Threshold (Tier 1) | N/A (Modal/Action) | task-0.5.3.3 ✅ | `aams_submissions`, `thresholds` | `vci_approve_aams_threshold` | ⚠️ | Emma | 1.1.3 |

**Related Documentation:**
- Routes: [route-inventory.md](./frontend/route-inventory.md#vci-routes)
- Wireframes: [AAMS Wireframes](../../04-design/user-experience/wireframes/02-vci/aams/)
- Database: [aams_submissions table](./database/data-dictionary.md#aams-submissions), [thresholds table](./database/data-dictionary.md#thresholds)
- APIs: [vci_submit_aams](./api/rpc-functions.md#vci_submit_aams), [vci_verify_aams](./api/rpc-functions.md#vci_verify_aamssubmission_id-uuid-comments-text-default-null)

---

### Threshold Management

| Feature | Route | Wireframe | Database | API | Status | Owner | Phase |
|---------|-------|-----------|----------|-----|--------|-------|-------|
| Threshold Management | `/vci/thresholds` | task-0.5.3.4 ✅ | `thresholds`, `skus`, `companies` | `vci_list_thresholds`, `vci_get_threshold` | ⚠️ | Emma | 1.1.3 |
| Threshold Detail | `/vci/thresholds/[id]` | task-0.5.3.5 ✅ | `thresholds`, `threshold_modifications` | `vci_get_threshold`, `vci_get_threshold_history` | ⚠️ | Emma | 1.1.3 |
| Modify Threshold | N/A (Modal) | task-0.5.3.6 ✅ | `thresholds`, `threshold_modifications` | `vci_modify_threshold` | ⚠️ | Emma | 1.1.3 |
| Pending Reversions List | `/vci/thresholds/pending-reversions` | task-0.5.3.8 ✅ | `thresholds` | `vci_list_pending_reversions` | ⚠️ | Emma | 1.1.3 |
| Threshold Reversion Review | `/vci/thresholds/[id]/revert-review` | task-0.5.3.7 ✅ | `thresholds`, `threshold_modifications` | `vci_review_threshold_reversion`, `vci_confirm_reversion`, `vci_cancel_reversion`, `vci_extend_reversion` | ⚠️ | Emma | 1.1.3 |

**Related Documentation:**
- Routes: [route-inventory.md](./frontend/route-inventory.md#vci-routes)
- Wireframes: [Threshold Wireframes](../../04-design/user-experience/wireframes/02-vci/aams/)
- Database: [thresholds table](./database/data-dictionary.md#thresholds), [threshold_modifications table](./database/data-dictionary.md#threshold-modifications)
- APIs: [vci_modify_threshold](./api/rpc-functions.md#vci_modify_threshold), [threshold reversion functions](./api/rpc-functions.md#threshold-reversion-functions)

---

### MSQ (Monthly Sales Quantities)

| Feature | Route | Wireframe | Database | API | Status | Owner | Phase |
|---------|-------|-----------|----------|-----|--------|-------|-------|
| MSQ Submissions List | `/vci/submissions/msq` | task-0.5.3.9 ✅ | `msq_submissions` | `vci_list_msq_submissions`, `vci_get_msq_submission` | ⚠️ | Emma | 1.1.4 |
| MSQ Submission Detail | `/vci/submissions/msq/[id]` | task-0.5.3.11 ✅ | `msq_submissions` | `vci_get_msq_submission` | ⚠️ | Emma | 1.1.4 |
| Create MSQ Submission | `/vci/submissions/msq/new` | task-0.5.3.10 ✅ | `msq_submissions` | `vci_submit_msq` | ⚠️ | Emma | 1.1.4 |
| MSQ Correction Interface | `/vci/submissions/msq/[id]/correct` | task-0.5.3.20 ✅ | `msq_submissions` | `vci_correct_msq_submission` | ⚠️ | Emma | 1.1.4 |

**Related Documentation:**
- Routes: [route-inventory.md](./frontend/route-inventory.md#vci-routes)
- Wireframes: [MSQ Wireframes](../../04-design/user-experience/wireframes/02-vci/msq/)
- Database: [msq_submissions table](./database/data-dictionary.md#msq-submissions)
- APIs: [vci_submit_msq](./api/rpc-functions.md#vci_submit_msq)

---

### WSL (Weekly Stock Levels)

| Feature | Route | Wireframe | Database | API | Status | Owner | Phase |
|---------|-------|-----------|----------|-----|--------|-------|-------|
| WSL Submissions List | `/vci/submissions/wsl` | task-0.5.3.13 ✅ | `wsl_submissions`, `breaches` | `vci_list_wsl_submissions`, `vci_get_wsl_submission` | ⚠️ | Emma | 1.1.5 |
| WSL Submission Detail | `/vci/submissions/wsl/[id]` | task-0.5.3.13 ✅ | `wsl_submissions`, `breaches`, `thresholds` | `vci_get_wsl_submission`, `vci_get_wsl_breaches` | ⚠️ | Emma | 1.1.5 |
| Create WSL Submission | `/vci/submissions/wsl/new` | task-0.5.3.12 ✅ | `wsl_submissions`, `breaches` | `vci_submit_wsl` | ⚠️ | Emma | 1.1.5 |

**Related Documentation:**
- Routes: [route-inventory.md](./frontend/route-inventory.md#vci-routes)
- Wireframes: [WSL Wireframes](../../04-design/user-experience/wireframes/02-vci/wsl/)
- Database: [wsl_submissions table](./database/data-dictionary.md#wsl-submissions)
- APIs: [vci_submit_wsl](./api/rpc-functions.md#vci_submit_wsl)

---

### Compliance Violations (Breaches)

| Feature | Route | Wireframe | Database | API | Status | Owner | Phase |
|---------|-------|-----------|----------|-----|--------|-------|-------|
| Compliance Violations List | `/vci/breaches` | task-0.5.3.14 ✅ | `breaches`, `wsl_submissions`, `thresholds` | `vci_list_breaches`, `vci_get_breach` | ⚠️ | Emma | 1.1.5 |
| Compliance Violation Detail | `/vci/breaches/[id]` | task-0.5.3.15 ✅ | `breaches`, `breach_actions`, `wsl_submissions` | `vci_get_breach`, `vci_get_breach_actions` | ⚠️ | Emma | 1.1.5 |
| Breach Analysis (Tier 2) | N/A (Modal/Interface) | task-0.5.3.16 ✅ | `breaches`, `breach_actions` | `vci_suggest_breach_action`, `vci_analyze_breach` | ⚠️ | Emma | 1.1.5 |
| Breach Action Approval (Tier 1) | N/A (Modal/Interface) | task-0.5.3.17 ✅ | `breaches`, `breach_actions`, `approval_history` | `vci_approve_breach_action`, `vci_reject_breach_action` | ⚠️ | Emma | 1.1.5 |

**Related Documentation:**
- Routes: [route-inventory.md](./frontend/route-inventory.md#vci-routes)
- Wireframes: [Breach Wireframes](../../04-design/user-experience/wireframes/02-vci/breaches/)
- Database: [breaches table](./database/data-dictionary.md#breaches), [breach_actions table](./database/data-dictionary.md#breach-actions)
- APIs: [vci_detect_breach](./api/rpc-functions.md#vci_detect_breach), [vci_suggest_breach_action](./api/rpc-functions.md#vci_suggest_breach_actionbreach_id-uuid-suggested_action-text-details-text-default-null)

---

### VCI Governance Dashboard

| Feature | Route | Wireframe | Database | API | Status | Owner | Phase |
|---------|-------|-----------|----------|-----|--------|-------|-------|
| VCI Overview | `/vci` | task-0.5.3.0 ✅ | All VCI tables | `vci_get_dashboard_stats` | ⚠️ | Emma | 1.1.3 |
| Governance Dashboard | `/vci/governance` | task-0.5.3.18 ✅ | `breaches`, `thresholds`, `wsl_submissions` | `vci_get_governance_dashboard`, `vci_get_stock_sufficiency_charts` | ⚠️ | Emma | 1.1.5 |
| Submission Trends Analysis | `/vci/analytics/trends` | task-0.5.3.21 ✅ | All submission tables | `vci_get_submission_trends`, `vci_get_multi_year_comparison` | 📋 | Emma | 1.1.7 |
| ATC Treemap | `/vci/analytics/treemap/atc` | task-0.5.3.22 ✅ | `breaches`, `skus`, `atc_codes` | `vci_get_atc_treemap_data` | 📋 | Emma | 1.1.7 |
| Products Treemap | `/vci/analytics/treemap/products` | task-0.5.3.23 ✅ | `breaches`, `products` | `vci_get_products_treemap_data` | 📋 | Emma | 1.1.7 |
| Submission History | `/vci/submissions/history` | task-0.5.3.28 ✅ | All submission tables | `vci_get_historical_submissions` | ⚠️ | Emma | 1.1.7 |

**Related Documentation:**
- Routes: [route-inventory.md](./frontend/route-inventory.md#vci-routes)
- Wireframes: [VCI Overview Wireframes](../../04-design/user-experience/wireframes/02-vci/overview/), [Analytics Wireframes](../../04-design/user-experience/wireframes/02-vci/analytics/)
- Database: [All VCI tables](./database/data-dictionary.md#vci-module-tables)
- APIs: [vci_get_historical_submissions](./api/rpc-functions.md#vci_get_historical_submissions)

---

## ECS Module Features

| Feature | Route | Wireframe | Database | API | Status | Owner | Phase |
|---------|-------|-----------|----------|-----|--------|-------|-------|
| ECS Overview | `/ecs` | task-0.5.4.0 ✅ | `export_requests`, `export_authorizations` | `ecs_get_overview_stats` | ⚠️ | Emma | 1.2 |
| Export Requests List | `/ecs/export-requests` | task-0.5.4.1 ✅ | `export_requests` | `ecs_list_export_requests`, `ecs_get_export_request` | ⚠️ | Emma | 1.2 |
| Export Request Detail | `/ecs/export-requests/[id]` | task-0.5.4.3 ✅ | `export_requests`, `export_authorizations`, `thresholds` | `ecs_get_export_request`, `ecs_evaluate_export_request` | ⚠️ | Emma | 1.2 |
| Create Export Request | `/ecs/export-requests/new` | task-0.5.4.2 ✅ | `export_requests` | `ecs_create_export_request`, `ecs_submit_export_request` | ⚠️ | Emma | 1.2 |
| Export Workflow Actions | N/A (Actions) | task-0.5.4.4 ✅ | `export_requests`, `export_authorizations` | `ecs_verify_export`, `ecs_approve_export`, `ecs_reject_export`, `ecs_intervene_export` | ⚠️ | Emma | 1.2 |
| Export Authorizations List | `/ecs/authorizations` | task-0.5.4.5 ✅ | `export_authorizations` | `ecs_list_authorizations`, `ecs_get_authorization` | ⚠️ | Emma | 1.2 |
| Export Authorization Detail | `/ecs/authorizations/[id]` | task-0.5.4.6 ✅ | `export_authorizations`, `replenishment_schedules` | `ecs_get_authorization`, `ecs_get_replenishment_schedule` | ⚠️ | Emma | 1.2 |
| Export Completion Reporting | `/ecs/authorizations/[id]/complete` | task-0.5.4.7 ✅ | `export_authorizations`, `export_completions` | `ecs_report_export_completion` | ⚠️ | Emma | 1.2 |
| Replenishment Schedule Tracking | `/ecs/replenishment` | task-0.5.4.8 ✅ | `replenishment_schedules` | `ecs_get_replenishment_schedules`, `ecs_update_replenishment_status` | ⚠️ | Emma | 1.2 |
| Export History | `/ecs/history` | task-0.5.4.9 ✅ | `export_authorizations`, `export_completions` | `ecs_get_export_history` | 📋 | Emma | 1.2 |

**Related Documentation:**
- Routes: [route-inventory.md](./frontend/route-inventory.md#ecs-routes)
- Wireframes: [ECS Wireframes](../../04-design/user-experience/wireframes/03-ecs/)
- Database: [ECS tables](./database/data-dictionary.md#ecs-module-tables)
- APIs: [ECS functions](./api/rpc-functions.md#ecs-module-functions)

---

## CMC Module Features

| Feature | Route | Wireframe | Database | API | Status | Owner | Phase |
|---------|-------|-----------|----------|-----|--------|-------|-------|
| CMC Overview | `/cmc` | task-0.5.5.0 ✅ | `compliance_scores`, `compliance_disputes` | `cmc_get_overview_stats` | ⚠️ | Emma | 1.3 |
| Compliance Scores List | `/cmc/scores` | task-0.5.5.1 ✅ | `compliance_scores` | `cmc_list_compliance_scores`, `cmc_get_compliance_score` | ⚠️ | Emma | 1.3 |
| Compliance Score Detail | `/cmc/scores/[id]` | task-0.5.5.2 ✅ | `compliance_scores`, `compliance_score_components` | `cmc_get_compliance_score`, `cmc_get_score_breakdown` | ⚠️ | Emma | 1.3 |
| Score Review - Flag Anomalies (Tier 2) | N/A (Modal) | task-0.5.5.4 ✅ | `compliance_scores`, `score_flags` | `cmc_flag_score_anomaly` | ⚠️ | Emma | 1.3 |
| Score Review - Override (Tier 1) | N/A (Modal) | task-0.5.5.5 ✅ | `compliance_scores`, `score_overrides` | `cmc_override_compliance_score` | ⚠️ | Emma | 1.3 |
| Leaderboard | `/cmc/leaderboard` | task-0.5.5.3 ✅ | `compliance_scores` | `cmc_get_leaderboard` | ⚠️ | Emma | 1.3 |
| Compliance Disputes List | `/cmc/disputes` | task-0.5.5.6 ✅ | `compliance_disputes` | `cmc_list_disputes`, `cmc_get_dispute` | ⚠️ | Emma | 1.3 |
| Dispute Detail | `/cmc/disputes/[id]` | task-0.5.5.7 ✅ | `compliance_disputes`, `dispute_evidence` | `cmc_get_dispute`, `cmc_get_dispute_evidence` | ⚠️ | Emma | 1.3 |
| Create Dispute | `/cmc/disputes/new` | task-0.5.5.8 ✅ | `compliance_disputes`, `dispute_evidence` | `cmc_create_dispute`, `cmc_submit_dispute` | ⚠️ | Emma | 1.3 |
| Dispute Review (Tier 2/Tier 1) | `/cmc/disputes/[id]/review` | task-0.5.5.9 ✅ | `compliance_disputes`, `dispute_resolutions` | `cmc_review_dispute`, `cmc_resolve_dispute` | ⚠️ | Emma | 1.3 |
| Reports List | `/cmc/reports` | task-0.5.5.10 ✅ | `regulatory_reports` | `cmc_list_reports`, `cmc_generate_report` | ⚠️ | Emma | 1.3 |
| Report Detail | `/cmc/reports/[id]` | task-0.5.5.11 ✅ | `regulatory_reports` | `cmc_get_report`, `cmc_download_report` | ⚠️ | Emma | 1.3 |
| Report Review/Approval | `/cmc/reports/[id]/review` | task-0.5.5.12 ✅ | `regulatory_reports`, `approval_history` | `cmc_review_report`, `cmc_approve_report` | ⚠️ | Emma | 1.3 |
| Compliance Scores History | `/cmc/scores/history` | task-0.5.5.13 ✅ | `compliance_scores` | `cmc_get_score_history` | 📋 | Emma | 1.3 |
| Compliance Disputes History | `/cmc/disputes/history` | task-0.5.5.14 ✅ | `compliance_disputes` | `cmc_get_dispute_history` | 📋 | Emma | 1.3 |

**Related Documentation:**
- Routes: [route-inventory.md](./frontend/route-inventory.md#cmc-routes)
- Wireframes: [CMC Wireframes](../../04-design/user-experience/wireframes/04-cmc/)
- Database: [CMC tables](./database/data-dictionary.md#cmc-module-tables)
- APIs: [CMC functions](./api/rpc-functions.md#cmc-module-functions)

---

## Support & Help Pages

| Feature | Route | Wireframe | Database | API | Status | Owner | Phase |
|---------|-------|-----------|----------|-----|--------|-------|-------|
| Support Center | `/support` | task-0.5.1.37 ✅ | None | None | ⚠️ | Emma | 1.1.1 |
| FAQ | `/support/faq` | task-0.5.1.38 ✅ | None | None | ⚠️ | Emma | 1.1.1 |
| Contact Support | `/support/contact` | task-0.5.1.39 ✅ | `support_tickets` | `support_create_ticket` | ⚠️ | Emma | 1.1.1 |
| Documentation | `/support/documentation` | task-0.5.1.40 ✅ | None | None | ⚠️ | Emma | 1.1.1 |
| System Status | `/status` | task-0.5.1.41 ✅ | `system_status` | `shared_get_system_status` | ⚠️ | Emma | 1.1.1 |

**Related Documentation:**
- Routes: [route-inventory.md](./frontend/route-inventory.md#support-routes)
- Wireframes: [Support Wireframes](../../04-design/user-experience/wireframes/00-core-foundation/public-pages/)
- Database: [support_tickets table](./database/data-dictionary.md) (if implemented)

---

## Feature Dependency Matrix

### Module Activation Order

1. **RMM** (Core - Always On) → Foundation
2. **VCI** (Core - Always On) → Requires RMM
3. **ECS** (Optional) → Requires RMM + VCI
4. **CMC** (Optional) → Requires RMM + VCI (enhanced by ECS if active)

**See:** [Module Dependency Diagram](./modules/module-dependency-diagram.md) for complete dependency details.

### Cross-Module Feature Dependencies

| Feature | Depends On | Type |
|---------|------------|------|
| VCI Submissions | RMM Companies, Products, SKUs | Database |
| ECS Export Requests | RMM SKUs, VCI Thresholds | Database |
| CMC Compliance Scores | VCI Submissions, Breaches | Database + Calculation |
| Threshold Reversion | ECS Export Authorizations | Event Trigger |
| Compliance Score Recalculation | ECS Export Authorizations | Event Trigger |

---

## Quick Reference Guide

### "Where do I find...?"

| I need to find... | Go to... |
|------------------|----------|
| **Feature status** | This document (feature-index.md) |
| **Route details** | [route-inventory.md](./frontend/route-inventory.md) |
| **Wireframe specs** | [wireframe-route-mapping.md](./frontend/wireframe-route-mapping.md) |
| **Database schema** | [data-dictionary.md](./database/data-dictionary.md) |
| **API specifications** | [rpc-functions.md](./api/rpc-functions.md) |
| **Implementation tasks** | [Phase 1 Implementation Plan](../../05-project-management/phases/Phase-1-Implementation-Plan.md) |

### Status Tracking Workflow

1. **Check feature status** → This document
2. **Review detailed artifacts** → Follow links to specific documentation
3. **Check implementation status** → [Phase 1 Implementation Plan](../../05-project-management/phases/Phase-1-Implementation-Plan.md)
4. **Verify compliance** → [Wireframe DB Compliance Rules](../../.cursor/rules/wireframe_db_compliance.md)

---

## Maintenance Guidelines

**When updating this document:**

1. **Update feature status** when components are completed
2. **Add new features** when they're added to the system
3. **Link to detailed docs** - Don't duplicate information, link instead
4. **Keep cross-references updated** - If route/wireframe/database changes, update all related entries
5. **Update ownership** if feature ownership changes
6. **Track dependencies** - Update dependency matrix when new dependencies are identified

**Review cadence:** Monthly or after major phase completion

---

## Related Documents

### Primary References
- [Route Inventory](./frontend/route-inventory.md) - Detailed route status tracking
- [Wireframe-Route Mapping](./frontend/wireframe-route-mapping.md) - Wireframe-route relationships
- [Routing Structure](./frontend/routing-structure.md) - Route definitions
- [Data Dictionary](./database/data-dictionary.md) - Complete database schema
- [RPC Functions](./api/rpc-functions.md) - Complete API specifications

### Project Management
- [Phase 1 Implementation Plan](../../05-project-management/phases/Phase-1-Implementation-Plan.md) - Implementation tasks
- [Phase 0.5 Wireframes Catalog](../../05-project-management/phases/phase-0-5-wireframes-catalog.md) - All wireframes
- [Module Dependency Diagram](./modules/module-dependency-diagram.md) - Module relationships

### Architecture
- [System Architecture](./system-architecture.md) - Overall system design
- [Workflow Architecture](./workflow-architecture.md) - Workflow and state machines
- [API Specification](./api/api-specification.md) - API design principles

---

**Last Updated:** 2026-01-12  
**Next Review:** After Phase 1.1.2 completion  
**Maintainers:** Yasmine (Project Manager), Emma (UI/UX), Maya (Backend/API), Nadia (Database)
