# Phase 0.5: UI/UX Wireframes & Design Validation

**Phase:** Phase 0.5 - UI/UX Wireframes & Design Validation (Pre-Phase 1)  
**Duration:** 2-3 weeks (before Phase 1.1) - Expanded to include all routes  
**Status:** ✅ COMPLETE (January 22, 2026) - 120/120 wireframes  
**Prerequisites:** 
- Phase 0 (Technical Foundation) ✅ COMPLETE - See [Phase 0: Technical Foundation](phase-0-technical-foundation.md)
- Phase 0.6 (Database Schema Audit) ✅ COMPLETE - Schema aligned with wireframes. See [Phase 0.6: Database Schema Audit](phase-0-6-databases.md)  
**Owner:** Emma (UI/UX + Next.js Frontend Specialist)

## Objective

Create wireframes for all critical pages and workflows to validate UX, align stakeholders, and guide implementation.

## Why Wireframes Before Implementation?

1. **Stakeholder Alignment:** Validate layouts with MOH and company users before coding
2. **Early UX Validation:** Catch usability issues before development
3. **Development Efficiency:** Clear visual specs reduce rework and speed up implementation
4. **Risk Mitigation:** Identify complex UI patterns and workflow issues early

## Wireframe Principles

- **Low-Fidelity Focus:** Quick sketches focusing on layout, hierarchy, and flow (not visual design)
- **Component-Based:** Reference existing design system and component specifications
- **Role-Aware:** Different wireframes for different user roles (Company, MOH Tier 1, Tier 2)
- **Responsive Considerations:** Wireframe key breakpoints (desktop, tablet)
- **Workflow-Focused:** Emphasize user flows and state transitions

---

## ⚠️ CRITICAL: Wireframe-First Implementation Principle

**📋 Complete Documentation:** See [Wireframe-First Implementation Principle](wireframe-first-implementation-principle.md)

Wireframes created in this phase are the **PRIMARY design reference** for all Phase 1 frontend implementation. The principle states:

1. **Review wireframe BEFORE starting any frontend task**
2. **Wireframe defines the UI/UX** - Architecture docs support wireframes, but wireframes take precedence
3. **If wireframe doesn't exist, STOP and create it first**
4. **Verify implementation matches wireframe** before marking task complete

**Implementation Integration:**
- All frontend tasks in [Phase 1 Implementation Plan](Phase-1-Implementation-Plan.md) include wireframe references
- Pattern documents provide technical implementation guidance for wireframes
- Wireframe compliance is part of the Definition of Done for all frontend tasks

---

## Implementation Pattern References

The following architecture documents provide technical implementation guidance for wireframes:

| Pattern Document | Purpose | Reference |
|-----------------|---------|-----------|
| Navigation & Layout Patterns | Layout structure, responsive design, navigation | [navigation-layout-patterns.md](../../02-architecture/frontend/navigation-layout-patterns.md) |
| Form Design Patterns | Form structure, validation, error handling | [form-design-patterns.md](../../02-architecture/frontend/form-design-patterns.md) |
| Role-Based UI Patterns | Role-based access, permissions, conditional UI | [role-based-ui-patterns.md](../../02-architecture/frontend/role-based-ui-patterns.md) |
| UI Component Specifications | Component library, design system | [ui-component-specifications.md](../../02-architecture/frontend/ui-component-specifications.md) |
| State Management UI Patterns | Data fetching, loading states, error states | [state-management-ui-patterns.md](../../02-architecture/frontend/state-management-ui-patterns.md) |

**Note:** All frontend tasks in Phase 1 Implementation Plan include references to relevant pattern documents.

---

## Wireframe Storage & Organization

All wireframes are stored in [`docs/04-design/user-experience/wireframes/`](../../04-design/user-experience/wireframes/README.md), organized by module and subphase:

- **00-core-foundation/** - Core foundation wireframes
- **01-rmm/** - RMM module wireframes
- **02-vci/** - VCI module wireframes
- **03-ecs/** - ECS module wireframes
- **04-cmc/** - CMC module wireframes
- **05-audit-historical/** - Audit & historical data wireframes
- **06-documentation/** - Wireframe documentation (index, annotations, mappings, design tool links)
- **exports/** - PDF exports (if applicable)

**File Naming Convention:** `task-{TASK_ID}-{descriptive-name}.{ext}` (e.g., `task-0.5.1.1-public-homepage.png`)

**Design Tool:** Wireframes are created in [Miro](https://miro.com/app/board/uXjVGUps93A=/) (Master Board). See [Design Tool Links](../../04-design/user-experience/wireframes/06-documentation/design-tool-links.md) for board organization and access.

See the [Wireframes Directory README](../../04-design/user-experience/wireframes/README.md) for complete structure and organization details.

## Priority-Based Approach

Wireframes are organized by priority to focus on critical path items first, enabling early stakeholder validation and unblocking Phase 1.1 development. This approach ensures:

1. **Critical Foundation First:** Authentication, layout, and navigation wireframed before all other work
2. **Core Workflows Early:** Critical approval chains and regulatory workflows validated first
3. **Module Completeness:** Complete modules (RMM, VCI) before moving to dependent modules (ECS, CMC)
4. **Flexible Timeline:** Lower priority items can be deferred if timeline is tight

**Note:** After Priority 3 (Critical VCI Workflows), schedule module-level stakeholder reviews for RMM + VCI to ensure regulatory compliance validation.

### Priority Summary

| Priority | Focus | Days | Wireframes | Status |
|----------|-------|------|------------|--------|
| **Priority 1** 🔴 | Critical Foundation | 1-2 | 20 wireframes | ✅ Complete |
| **Priority 2** 🔴 | Enforcement + Core RMM Workflows | 3-4 | 20 wireframes | ✅ Complete |
| **Priority 3** 🔴 | Critical VCI Workflows | 5-6 | 14 wireframes | ✅ Complete |
| **Priority 4** 🟡 | Supporting VCI & RMM | 7-8 | 9 wireframes | ✅ Complete |
| **Priority 5** 🟡 | ECS Module | 9-10 | 9 wireframes | ✅ Complete |
| **Priority 6** 🟡 | CMC Module | 11-12 | 13 wireframes | ✅ Complete |
| **Priority 7** 🟢 | Global & Help Pages | 13-14 | 14 wireframes | ✅ Complete |
| **Priority 8** 🟢 | Analytics, Historical & Modals | 14-15 | 21 wireframes | ✅ Complete |
| **Review** | Final Review & Iteration | 14-15 | Documentation | ✅ Complete |
| **TOTAL** | | **2-3 weeks** | **120 wireframes** | **120 wireframes complete (100%)** |

**Note:** Modal wireframes (Priority 8) include reusable UI patterns. Some module-specific modals are already included in their respective module sections.

---

## Priority 1: Critical Foundation (Days 1-2) 🔴 HIGHEST PRIORITY

**Rationale:** Must be done first — blocks everything else. Enables early stakeholder validation of navigation and role-based access.

**📋 Implementation Guide:** See [Priority 1 Implementation Guide](../../04-design/user-experience/wireframes/00-core-foundation/PRIORITY-1-IMPLEMENTATION-GUIDE.md) for detailed wireframe specifications, layout structures, and annotations.

**📁 Wireframe Specifications:**
- [Authentication Wireframes](../../04-design/user-experience/wireframes/00-core-foundation/authentication/README.md)
- [Layout & Navigation Wireframes](../../04-design/user-experience/wireframes/00-core-foundation/layout-navigation/README.md)
- [Dashboard Wireframes](../../04-design/user-experience/wireframes/00-core-foundation/dashboard/README.md)
- [Communication Wireframes](../../04-design/user-experience/wireframes/00-core-foundation/communications/README.md)
- [Global Section Wireframes](../../04-design/user-experience/wireframes/00-core-foundation/global/README.md)

### Authentication & Layout (Critical Path)

- [x] **Task 0.5.1.11:** Wireframe - Login page (email/password, forgot password link, registration link) - [Wireframe](../../04-design/user-experience/wireframes/00-core-foundation/authentication/task-0.5.1.11-login-page.md)
- [x] **Task 0.5.1.14:** Wireframe - Dashboard layout structure (header, sidebar, main content area, responsive breakpoints) - [Wireframe](../../04-design/user-experience/wireframes/00-core-foundation/layout-navigation/task-0.5.1.14-dashboard-layout-structure.md)
- [x] **Task 0.5.1.15:** Wireframe - Header component (logo, user menu, notifications badge, search) - [Wireframe](../../04-design/user-experience/wireframes/00-core-foundation/layout-navigation/task-0.5.1.15-header-component.md)
- [x] **Task 0.5.1.16:** Wireframe - Sidebar navigation (module grouping, active states, role-based items) - [Wireframe](../../04-design/user-experience/wireframes/00-core-foundation/layout-navigation/task-0.5.1.16-sidebar-navigation.md)
- [x] **Task 0.5.1.17:** Wireframe - Notification center component (dropdown/popover, notification list, read/unread states, threshold reversion notifications) - [Wireframe](../../04-design/user-experience/wireframes/00-core-foundation/layout-navigation/task-0.5.1.17-notification-center-component.md)

### Core Dashboards (Role-Based)
- [x] **Task 0.5.1.18:** Wireframe - Company Dashboard (my submissions, pending approvals, recent activity, key metrics) - [Wireframe](../../04-design/user-experience/wireframes/00-core-foundation/dashboard/task-0.5.1.18-company-dashboard.md)
- [x] **Task 0.5.1.19:** Wireframe - MOH Tier 1 Dashboard (governance overview, pending approvals, system-wide metrics, action items, pending threshold reversions widget) - [Wireframe](../../04-design/user-experience/wireframes/00-core-foundation/dashboard/task-0.5.1.19-moh-tier1-dashboard.md)
- [x] **Task 0.5.1.20:** Wireframe - MOH Tier 2 Dashboard (pending verifications, oversight metrics, review queue, pending threshold reversions view) - [Wireframe](../../04-design/user-experience/wireframes/00-core-foundation/dashboard/task-0.5.1.20-moh-tier2-dashboard.md)

### Communication Interfaces (Critical Foundation)
- [x] **Task 0.5.1.24:** Wireframe - Communications inbox list page (conversation list, unread indicators, lifecycle state filters, status indicators, search, role-based access) - [Wireframe](../../04-design/user-experience/wireframes/00-core-foundation/communications/task-0.5.1.24-communications-inbox-list.md)
- [x] **Task 0.5.1.25:** Wireframe - Conversation detail page (message thread, reply interface, attachments, read receipts with ✓✓ format, workflow context, archive button, threaded indicator, lifecycle state panel) - [Wireframe](../../04-design/user-experience/wireframes/00-core-foundation/communications/task-0.5.1.25-conversation-detail.md)
- [x] **Task 0.5.1.26:** Wireframe - Compose message interface (recipient selection, subject, content, attachments, workflow entity linking with immutability warning, lifecycle state information) - [Wireframe](../../04-design/user-experience/wireframes/00-core-foundation/communications/task-0.5.1.26-compose-message.md)
- [x] **Task 0.5.1.27:** Wireframe - Sent messages page (sent conversations list, status indicators with ✓✓ format: sent/delivered/read) - [Wireframe](../../04-design/user-experience/wireframes/00-core-foundation/communications/task-0.5.1.27-sent-messages.md)
- [x] **Task 0.5.1.28:** Wireframe - System announcements interface (MOH Tier 1 only - announcement list, creation interface, broadcast controls, lifecycle state indicators) - [Wireframe](../../04-design/user-experience/wireframes/00-core-foundation/communications/task-0.5.1.28-system-announcements.md)
- [x] **Task 0.5.1.29:** Wireframe - Communication integration in workflow pages (message button, conversation list, context display, workflow-linked state indicators) - [Wireframe](../../04-design/user-experience/wireframes/00-core-foundation/communications/task-0.5.1.29-communication-integration-workflow.md)

**Note:** Communication wireframes are critical foundation items as they must be integrated into navigation and workflow pages from the start. See [Communication Channels Requirements](../../02-architecture/communication-channels-requirements.md) and [Communication Channels Lifecycle](../../02-architecture/communication-channels-lifecycle.md) for detailed requirements and lifecycle specifications.

**Status:** ✅ All communication requirements approved (2025-01-01) - All questions answered, database schema and routing structure updated. ✅ Lifecycle implementation complete (2025-01-15) - All wireframes aligned with Communication Channels Lifecycle specification including 7-year retention, status indicators (✓✓ format), lifecycle state visibility, and regulatory compliance requirements. See [Communication Lifecycle Change List](../../04-design/user-experience/wireframes/00-core-foundation/communications/COMMUNICATION-LIFECYCLE-CHANGE-LIST.md) and [Implementation Summary](../../04-design/user-experience/wireframes/00-core-foundation/communications/IMPLEMENTATION-SUMMARY.md) for details.

**Note:** All Priority 1 wireframes have been updated to integrate the enforcement lifecycle (2025-01-01). This includes:
- Enforcement action viewing and appeals on Company Dashboard
- Enforcement action creation and management on MOH Tier 1 & Tier 2 Dashboards
- Enforcement action notifications and filtering in Notifications and Notification Center
- Enforcement action linking in Communications (inbox, compose, conversation detail)
- Enforcement action history and audit logging in History, Audit Logs, and Audit Reports
- Enforcement navigation in Sidebar and Header module indicators

See Priority 2 for dedicated enforcement module wireframes (dashboard, actions list, detail, creation wizard, pending approvals, reports).

### Global Section Pages (Critical Foundation)
- [x] **Task 0.5.1.30:** Wireframe - History overview page (role-based historical overview, quick filters, recent history summary, date range picker) - [Wireframe](../../04-design/user-experience/wireframes/00-core-foundation/global/task-0.5.1.30-history-overview.md)
- [x] **Task 0.5.1.31:** Wireframe - Notifications page (full notification list, filters, mark as read, notification settings, notification types, threshold reversion notifications) - [Wireframe](../../04-design/user-experience/wireframes/00-core-foundation/global/task-0.5.1.31-notifications-page.md)
- [x] **Task 0.5.1.32:** Wireframe - Audit logs list page (MOH/Auditors only - audit log entries, filters: date range/table/user/action, search, pagination, virtual scrolling) - [Wireframe](../../04-design/user-experience/wireframes/00-core-foundation/global/task-0.5.1.32-audit-logs-list.md)
- [x] **Task 0.5.1.33:** Wireframe - Audit log detail page (log entry details, related changes, user information, timestamp, hash chain verification) - [Wireframe](../../04-design/user-experience/wireframes/00-core-foundation/global/task-0.5.1.33-audit-log-detail.md)
- [x] **Task 0.5.1.34:** Wireframe - Audit reports page (MOH/Auditors only - audit report list, report types, date range filters, download actions) - [Wireframe](../../04-design/user-experience/wireframes/00-core-foundation/global/task-0.5.1.34-audit-reports.md)
- [x] **Task 0.5.1.35:** Wireframe - System Configuration page (MOH Tier 1 only - module activation, system settings, configuration interface, cloud services compliance) - [Wireframe](../../04-design/user-experience/wireframes/00-core-foundation/global/task-0.5.1.35-system-configuration.md)

---

## Priority 2: Core RMM Workflows (Days 3-4) 🔴 HIGH PRIORITY

**Rationale:** Foundation for registry management — critical for Phase 1.1. RMM is the foundation module; registry submission workflow is the most critical approval chain.

### Enforcement Module (Critical Governance Function)

**Rationale:** Enforcement actions (warnings, fines, suspensions) are critical MOH governance functions requiring dedicated workflow management, approval processes, and regulatory compliance tracking. Must be wireframed early to support dashboard integration and regulatory requirements.

- [x] **Task 0.5.2.0:** Wireframe - Enforcement dashboard page (summary, recent actions, pending approvals, enforcement metrics, action type breakdown) - [Wireframe](../../04-design/user-experience/wireframes/01-rmm/enforcement/task-0.5.2.0-enforcement-dashboard.md)
- [x] **Task 0.5.2.1:** Wireframe - Enforcement actions list page (all actions, filters: action type/status/company/date range, search, pagination, status indicators) - [Wireframe](../../04-design/user-experience/wireframes/01-rmm/enforcement/task-0.5.2.1-enforcement-actions-list.md)
- [x] **Task 0.5.2.1a:** Wireframe - Enforcement action detail page (action information, workflow status, approval chain, violation details, appeal status, execution tracking) - [Wireframe](../../04-design/user-experience/wireframes/01-rmm/enforcement/task-0.5.2.1a-enforcement-action-detail.md)
- [x] **Task 0.5.2.1b:** Wireframe - Create enforcement action wizard (action type selection, violation selection, amount input for fines, legal basis, justification, approval workflow) - [Wireframe](../../04-design/user-experience/wireframes/01-rmm/enforcement/task-0.5.2.1b-create-enforcement-action-wizard.md)
- [x] **Task 0.5.2.1c:** Wireframe - Pending approvals page (actions pending Tier 1 approval, approval interface, bulk approval actions) - [Wireframe](../../04-design/user-experience/wireframes/01-rmm/enforcement/task-0.5.2.1c-pending-approvals.md)
- [x] **Task 0.5.2.1d:** Wireframe - Enforcement reports page (enforcement analytics, trends, action type breakdown, company compliance tracking) - [Wireframe](../../04-design/user-experience/wireframes/01-rmm/enforcement/task-0.5.2.1d-enforcement-reports.md)
- [x] **Task 0.5.2.1e:** Wireframe - Appeal review interface (MOH Tier 1 - review company appeals, uphold/overturn decisions, adjustment notes) - [Wireframe](../../04-design/user-experience/wireframes/01-rmm/enforcement/task-0.5.2.1e-appeal-review-interface.md)
- [x] **Task 0.5.2.1f:** Wireframe - Appeal submission form (Company users - submit appeals with grounds, explanation, supporting documents) - [Wireframe](../../04-design/user-experience/wireframes/01-rmm/enforcement/task-0.5.2.1f-appeal-submission-form.md)

**Note:** Enforcement module is MOH Tier 1 and Tier 2 only. Companies can view their own enforcement actions but cannot create or manage them.

### RMM Core Workflows (Critical)
- [x] **Task 0.5.2.2:** Wireframe - Companies list page (table view, filters, search, pagination, role-based actions) - [Wireframe](../../04-design/user-experience/wireframes/01-rmm/companies/task-0.5.2.2-companies-list.md)
- [x] **Task 0.5.2.3:** Wireframe - Company detail page (information sections, tabs: Overview | Products | History, action buttons, related products) - [Wireframe](../../04-design/user-experience/wireframes/01-rmm/companies/task-0.5.2.3-company-detail.md)
- [x] **Task 0.5.2.8:** Wireframe - Company create/edit form (form sections, validation, draft auto-save indicator) - [Wireframe](../../04-design/user-experience/wireframes/01-rmm/companies/task-0.5.2.8-company-create-edit-form.md)
- [x] **Task 0.5.2.11:** Wireframe - Registry submission list page (my submissions, pending approvals, status filters) - [Wireframe](../../04-design/user-experience/wireframes/01-rmm/workflow/task-0.5.2.11-registry-submission-list.md)
- [x] **Task 0.5.2.12:** Wireframe - Registry submission detail page (submission data, workflow status indicator, approval history timeline, action buttons) - [Wireframe](../../04-design/user-experience/wireframes/01-rmm/workflow/task-0.5.2.12-registry-submission-detail.md)
- [x] **Task 0.5.2.13:** Wireframe - Registry submission workflow states (draft, submitted, tier2_verified, tier1_approved, tier2_implemented, completed, rejected) - [Wireframe](../../04-design/user-experience/wireframes/01-rmm/workflow/task-0.5.2.13-registry-submission-workflow-states.md)

### RMM Supporting Pages
- [x] **Task 0.5.2.4:** Wireframe - Products list page (company-scoped, filters, search, product cards/table) - [Wireframe](../../04-design/user-experience/wireframes/01-rmm/products/task-0.5.2.4-products-list.md)
- [x] **Task 0.5.2.5:** Wireframe - Product detail page (product info, tabs: Overview | SKUs | History, related submissions) - [Wireframe](../../04-design/user-experience/wireframes/01-rmm/products/task-0.5.2.5-product-detail.md)
- [x] **Task 0.5.2.6:** Wireframe - SKUs list page (product-scoped, filters, pharmaceutical attributes display) - [Wireframe](../../04-design/user-experience/wireframes/01-rmm/skus/task-0.5.2.6-skus-list.md)
- [x] **Task 0.5.2.7:** Wireframe - SKU detail page (SKU information, tabs: Overview | History, pharmaceutical attributes: dosage_strength, dosage_form, pack_size, unit_of_measure) - [Wireframe](../../04-design/user-experience/wireframes/01-rmm/skus/task-0.5.2.7-sku-detail.md)
- [x] **Task 0.5.2.9:** Wireframe - Product create/edit form (form sections, ATC code selection, validation) - [Wireframe](../../04-design/user-experience/wireframes/01-rmm/products/task-0.5.2.9-product-create-edit-form.md)
- [x] **Task 0.5.2.10:** Wireframe - SKU create/edit form (pharmaceutical attributes: dosage_strength, dosage_form, pack_size, unit_of_measure, validation, form sections) - [Wireframe](../../04-design/user-experience/wireframes/01-rmm/skus/task-0.5.2.10-sku-create-edit-form.md)

---

## Priority 3: Critical VCI Workflows (Days 5-6) 🔴 HIGH PRIORITY

**Rationale:** Regulatory compliance workflows — MOH priority. AAMS is annual regulatory requirement. WSL enables compliance violation detection and governance response.

### VCI AAMS (Annual Submission — Highest Regulatory Priority)
- [x] **Task 0.5.3.1:** Wireframe - AAMS submissions list page (my submissions, all submissions for MOH, year filter, status filter) - [Wireframe](../../04-design/user-experience/wireframes/02-vci/aams/task-0.5.3.1-aams-submissions-list.md)
- [x] **Task 0.5.3.2:** Wireframe - AAMS submission form (year selection, monthly sales table with Jan-Dec columns, calculated AAMS, import/export CSV, validation) - [Wireframe](../../04-design/user-experience/wireframes/02-vci/aams/task-0.5.3.2-aams-submission-form.md)
- [x] **Task 0.5.3.3:** Wireframe - AAMS submission detail page (submission data, calculated threshold display, workflow status, threshold visibility timing, duration type, revert date) - [Wireframe](../../04-design/user-experience/wireframes/02-vci/aams/task-0.5.3.3-aams-submission-detail.md)
- [x] **Task 0.5.3.4:** Wireframe - Threshold management page (MOH Tier 1 - threshold list, filters, bulk actions, modification interface, duration type, revert date, pending reversion indicators) - [Wireframe](../../04-design/user-experience/wireframes/02-vci/aams/task-0.5.3.4-threshold-management.md)
- [x] **Task 0.5.3.6:** Wireframe - Threshold modification modal (local vs global selector, B multiplier input, advisory suggestions, duration type selection: permanent/temporary, time-bound options) - [Wireframe](../../04-design/user-experience/wireframes/02-vci/aams/task-0.5.3.6-threshold-modification-modal.md)
- [x] **Task 0.5.3.7:** Wireframe - Threshold reversion review page (Tier 1 - review and confirm manual review reversions, decision options: confirm/cancel/extend, justification input) - [Wireframe](../../04-design/user-experience/wireframes/02-vci/aams/task-0.5.3.7-threshold-reversion-review.md)
- [x] **Task 0.5.3.8:** Wireframe - Pending reversions list page (all thresholds with pending reversions, filters: type/days until/company, color-coded by urgency, bulk actions) - [Wireframe](../../04-design/user-experience/wireframes/02-vci/aams/task-0.5.3.8-pending-reversions-list.md)

### VCI WSL (Weekly Compliance — Critical for Compliance Violation Detection)
- [x] **Task 0.5.3.11:** Wireframe - WSL submissions list page (my submissions, all submissions for MOH, week filter, deadline indicators, threshold, threshold compliance %, replenishment date, compliance violation reason) - [Wireframe](../../04-design/user-experience/wireframes/02-vci/wsl/task-0.5.3.11-wsl-submissions-list.md)
- [x] **Task 0.5.3.12:** Wireframe - WSL submission form (week ending date, **all SKUs with stock quantity entry** - SKU_ID + Quantity structure, threshold (read-only), threshold compliance % (calculated), replenishment date, compliance violation reason) - [Wireframe](../../04-design/user-experience/wireframes/02-vci/wsl/task-0.5.3.12-wsl-submission-form.md)
- [x] **Task 0.5.3.13:** Wireframe - WSL submission detail page (submission data, compliance violation indicators, stock level visualization, threshold, threshold compliance %, replenishment date, compliance violation reason) - [Wireframe](../../04-design/user-experience/wireframes/02-vci/wsl/task-0.5.3.13-wsl-submission-detail.md)
- [x] **Task 0.5.3.14:** Wireframe - Compliance Violations list page (active compliance violations, resolved compliance violations, priority/company/SKU filters, date range, replenishment date, compliance violation reason) - [Wireframe](../../04-design/user-experience/wireframes/02-vci/breaches/task-0.5.3.14-compliance-violations-list.md)
- [x] **Task 0.5.3.15:** Wireframe - Compliance Violation detail page (compliance violation information, stock level vs threshold comparison, reason, replenishment date, priority indicator) - [Wireframe](../../04-design/user-experience/wireframes/02-vci/breaches/task-0.5.3.15-compliance-violation-detail.md)
- [x] **Task 0.5.3.16:** Wireframe - Compliance Violation analysis interface (Tier 2 - analysis form, action suggestions dropdown, comments, batch analysis option) - [Wireframe](../../04-design/user-experience/wireframes/02-vci/breaches/task-0.5.3.16-compliance-violation-analysis-interface.md)
- [x] **Task 0.5.3.17:** Wireframe - Compliance Violation action approval interface (Tier 1 - review suggestions, approve/reject/independent action, justification input) - [Wireframe](../../04-design/user-experience/wireframes/02-vci/breaches/task-0.5.3.17-compliance-violation-action-approval-interface.md)

### VCI Governance Dashboard (MOH Oversight Priority)
- [x] **Task 0.5.3.18:** Wireframe - Governance Dashboard (MOH - real-time stock sufficiency charts, compliance violation status overview, action recommendations, widget layout, pending threshold reversions metric) - [Wireframe](../../04-design/user-experience/wireframes/02-vci/overview/task-0.5.3.18-governance-dashboard.md)

**📋 Module Review Checkpoint:** After Priority 3, schedule stakeholder review for RMM + VCI modules to ensure regulatory compliance validation.

---

## Priority 4: Supporting VCI & RMM (Days 7-8) 🟡 MEDIUM PRIORITY

**Rationale:** Complete core modules. MSQ is monthly reporting. MOH-only pages support governance functions.

### VCI MSQ (Monthly Reporting)
- [x] **Task 0.5.3.9:** Wireframe - MSQ submissions list page (my submissions, flagged for review for MOH, month filter) - [Wireframe](../../04-design/user-experience/wireframes/02-vci/msq/task-0.5.3.9-msq-submissions-list.md)
- [x] **Task 0.5.3.10:** Wireframe - MSQ submission form (month selection, **SKU_ID + Quantity data entry only** - simplified submission structure) - [Wireframe](../../04-design/user-experience/wireframes/02-vci/msq/task-0.5.3.10-msq-submission-form.md)
- [x] **Task 0.5.3.19:** Wireframe - MSQ submission detail page (submission data, validation status indicator, review actions, 7-day grace period indicator) - [Wireframe](../../04-design/user-experience/wireframes/02-vci/msq/task-0.5.3.11-msq-submission-detail.md)
- [x] **Task 0.5.3.20:** Wireframe - MSQ correction interface (editable submitted data, grace period countdown, correction form) - [Wireframe](../../04-design/user-experience/wireframes/02-vci/msq/task-0.5.3.12-msq-correction-interface.md)

### VCI Combined Submissions Overview
- [x] **Task 0.5.3.26:** Wireframe - VCI Submissions overview page (all current submissions - AAMS, MSQ, WSL in unified view, type filters/tabs, status filters, role-based) - [Wireframe](../../04-design/user-experience/wireframes/02-vci/overview/task-0.5.3.26-vci-submissions.md)
- [x] **Task 0.5.3.21:** Wireframe - Submission Trends Analysis page (MOH Tier 1 only - trend analysis charts, AAMS/MSQ/WSL trends, multi-year comparisons) - [Wireframe](../../04-design/user-experience/wireframes/02-vci/analytics/task-0.5.3.21-submission-trends-analysis.md)

### RMM MOH-Only Pages
- [x] **Task 0.5.2.14:** Wireframe - ATC Codes list page (MOH only, read-only for companies, search, filters) - [Wireframe](../../04-design/user-experience/wireframes/01-rmm/task-0.5.2.14-atc-codes-list.md)
- [x] **Task 0.5.2.15:** Wireframe - Critical Medicines list page (MOH Tier 1 only, designation interface, filters) - [Wireframe](../../04-design/user-experience/wireframes/01-rmm/task-0.5.2.15-critical-medicines-list.md)

### Module Overview Pages
- [x] **Task 0.5.2.1:** Wireframe - RMM overview page (module summary, quick links, recent activity, statistics) - [Wireframe](../../04-design/user-experience/wireframes/01-rmm/overview/task-0.5.2.1-rmm-overview.md)
- [x] **Task 0.5.3.0:** Wireframe - VCI overview page (module summary, submission overview, compliance violation alerts, quick links) - [Wireframe](../../04-design/user-experience/wireframes/02-vci/overview/task-0.5.3.0-vci-overview.md)
- [x] **Task 0.5.3.5:** Wireframe - Threshold detail page (threshold information, modification history, related thresholds, thresholds/[id] route) - [Wireframe](../../04-design/user-experience/wireframes/02-vci/aams/task-0.5.3.5-threshold-detail.md)

---

## Priority 5: ECS Module (Days 9-10) 🟡 MEDIUM PRIORITY

**Rationale:** Export control — depends on RMM + VCI. Export workflow is critical for regulatory compliance.

### ECS Core Workflows
- [x] **Task 0.5.4.1:** Wireframe - Export requests list page (my requests, pending approvals for MOH, status filters) - [Wireframe](../../04-design/user-experience/wireframes/03-ecs/export-requests/task-0.5.4.1-export-requests-list.md)
- [x] **Task 0.5.4.2:** Wireframe - Export request form (SKU selection, destination, timeline, documentation upload, file upload component) - [Wireframe](../../04-design/user-experience/wireframes/03-ecs/export-requests/task-0.5.4.2-export-request-form.md)
- [x] **Task 0.5.4.3:** Wireframe - Export request detail page (request data, evaluation status, threshold comparison card: current stock vs VCI threshold vs ECS threshold) - [Wireframe](../../04-design/user-experience/wireframes/03-ecs/export-requests/task-0.5.4.3-export-request-detail.md)
- [x] **Task 0.5.4.4:** Wireframe - Export workflow actions (submit, verify, approve, reject, intervene buttons - role-based, intervention window indicator) - [Wireframe](../../04-design/user-experience/wireframes/03-ecs/export-requests/task-0.5.4.4-export-workflow-actions.md)
- [x] **Task 0.5.4.5:** Wireframe - Export authorizations list page (active authorizations, expired authorizations, validity filters) - [Wireframe](../../04-design/user-experience/wireframes/03-ecs/authorizations/task-0.5.4.5-export-authorizations-list.md)
- [x] **Task 0.5.4.6:** Wireframe - Export authorization detail page (authorization details, validity period indicator, 90-day countdown, expiration warnings, threshold status) - [Wireframe](../../04-design/user-experience/wireframes/03-ecs/authorizations/task-0.5.4.6-export-authorization-detail.md)

### ECS Supporting
- [x] **Task 0.5.4.7:** Wireframe - Export completion reporting interface (completion form, actual export details, shipping info) - [Wireframe](../../04-design/user-experience/wireframes/03-ecs/authorizations/task-0.5.4.7-export-completion-reporting.md)
- [x] **Task 0.5.4.8:** Wireframe - Replenishment schedule tracking interface (schedule timeline visualization, delay indicators, escalation stages) - [Wireframe](../../04-design/user-experience/wireframes/03-ecs/replenishment/task-0.5.4.8-replenishment-schedule-tracking.md)
- [x] **Task 0.5.4.0:** Wireframe - ECS overview page (module summary, export requests overview, authorization status, quick links) - [Wireframe](../../04-design/user-experience/wireframes/03-ecs/overview/task-0.5.4.0-ecs-overview.md)

---

## Priority 6: CMC Module (Days 11-12) 🟡 MEDIUM PRIORITY

**Rationale:** Compliance monitoring — depends on other modules. Compliance scoring and disputes are regulatory requirements.

### CMC Core Workflows
- [x] **Task 0.5.5.1:** Wireframe - Compliance scores list page (my score for companies, all scores for MOH, period filter) - [Wireframe](../../04-design/user-experience/wireframes/04-cmc/scores/task-0.5.5.1-compliance-scores-list.md)
- [x] **Task 0.5.5.2:** Wireframe - Compliance score detail page (total score visualization, component breakdown chart/gauge, category-level tips for companies, formulas/weights hidden) - [Wireframe](../../04-design/user-experience/wireframes/04-cmc/scores/task-0.5.5.2-compliance-score-detail.md)
- [x] **Task 0.5.5.4:** Wireframe - Score review - Tier 2 flag anomalies modal (quick action, contextual to score detail, flag anomalies interface) - [Wireframe](../../04-design/user-experience/wireframes/04-cmc/scores/task-0.5.5.4-score-review-tier2-flag-anomalies.md)
- [x] **Task 0.5.5.5:** Wireframe - Score review - Tier 1 override modal (justification input, quick action, contextual to score detail) - [Wireframe](../../04-design/user-experience/wireframes/04-cmc/scores/task-0.5.5.5-score-review-tier1-override.md)
- [x] **Task 0.5.5.6:** Wireframe - Compliance Disputes list page (my compliance disputes for companies, all compliance disputes for MOH, status filters, date filters) - [Wireframe](../../04-design/user-experience/wireframes/04-cmc/disputes/task-0.5.5.6-compliance-disputes-list.md)
- [x] **Task 0.5.5.7:** Wireframe - Dispute detail page (dispute information, evidence display, review status, dispute details route) - [Wireframe](../../04-design/user-experience/wireframes/04-cmc/disputes/task-0.5.5.7-dispute-detail.md)
- [x] **Task 0.5.5.8:** Wireframe - Dispute creation interface (companies - 30-day window indicator, dispute form, component selection, evidence upload) - [Wireframe](../../04-design/user-experience/wireframes/04-cmc/disputes/task-0.5.5.8-dispute-creation-interface.md)
- [x] **Task 0.5.5.9:** Wireframe - Dispute review interface (Tier 2 - review, Tier 1 - resolution with adjustment notes, dispute details) - [Wireframe](../../04-design/user-experience/wireframes/04-cmc/disputes/task-0.5.5.9-dispute-review-interface.md)

### CMC Supporting
- [x] **Task 0.5.5.3:** Wireframe - Leaderboard page (anonymized for companies - percentile/rank band, full for Tier 1, oversight for Tier 2) - [Wireframe](../../04-design/user-experience/wireframes/04-cmc/scores/task-0.5.5.3-leaderboard.md)
- [x] **Task 0.5.5.10:** Wireframe - Reports list page (report types, status, download actions, period filters) - [Wireframe](../../04-design/user-experience/wireframes/04-cmc/reports/task-0.5.5.10-reports-list.md)
- [x] **Task 0.5.5.11:** Wireframe - Report detail page (PDF viewer, data tables, charts, download action) - [Wireframe](../../04-design/user-experience/wireframes/04-cmc/reports/task-0.5.5.11-report-detail.md)
- [x] **Task 0.5.5.12:** Wireframe - Report review/approval interface (Tier 2 review checklist, Tier 1 approval actions) - [Wireframe](../../04-design/user-experience/wireframes/04-cmc/reports/task-0.5.5.12-report-review-approval-interface.md)
- [x] **Task 0.5.5.0:** Wireframe - CMC overview page (module summary, compliance overview, score trends, quick links) - [Wireframe](../../04-design/user-experience/wireframes/04-cmc/overview/task-0.5.5.0-cmc-overview.md)

---

## Priority 7: Global & Help Pages (Days 13-14) 🟢 LOWER PRIORITY

**Rationale:** Global section pages and Help & Info pages needed for complete navigation. Can be done in parallel with development but should be wireframed for consistency.

### Global Section Pages (Additional)
- [x] **Task 0.5.1.36:** Wireframe - Archived conversations page (archived conversations list, restore option, filters, 7-year retention period indicators, retention status information) - [Wireframe](../../04-design/user-experience/wireframes/00-core-foundation/communications/task-0.5.1.36-archived-conversations.md)

### Help & Info Section Pages
- [x] **Task 0.5.1.37:** Wireframe - Support center page (support options, help sections, contact links, support hours) - [Wireframe](../../04-design/user-experience/wireframes/00-core-foundation/public-pages/task-0.5.1.37-support-center.md)
- [x] **Task 0.5.1.38:** Wireframe - FAQ page (searchable questions, categories, expandable answers, search functionality) - [Wireframe](../../04-design/user-experience/wireframes/00-core-foundation/public-pages/task-0.5.1.38-faq-page.md)
- [x] **Task 0.5.1.39:** Wireframe - Contact support page (contact form, support channels, response time info, escalation procedures) - [Wireframe](../../04-design/user-experience/wireframes/00-core-foundation/public-pages/task-0.5.1.39-contact-support.md)
- [x] **Task 0.5.1.40:** Wireframe - Documentation page (user guides, documentation sections, search, API documentation links) - [Wireframe](../../04-design/user-experience/wireframes/00-core-foundation/public-pages/task-0.5.1.40-documentation.md)
- [x] **Task 0.5.1.41:** Wireframe - System status page (system health, incident history, status indicators, maintenance schedule) - [Wireframe](../../04-design/user-experience/wireframes/00-core-foundation/public-pages/task-0.5.1.41-system-status.md)

### Public Pages
- [x] **Task 0.5.1.1:** Wireframe - Public homepage (MOH mission focus, navigation, CTA, partnership info) - [Wireframe](../../04-design/user-experience/wireframes/00-core-foundation/public-pages/task-0.5.1.1-public-homepage.md)
- [x] **Task 0.5.1.2:** Wireframe - About page (MOH regulatory mission, framework overview, partnership info, contact information) - [Wireframe](../../04-design/user-experience/wireframes/00-core-foundation/public-pages/task-0.5.1.2-about-page.md)

### Legal Pages
- [x] **Task 0.5.1.7:** Wireframe - Terms of service page (legal text, sections, acceptance checkbox) - [Wireframe](../../04-design/user-experience/wireframes/00-core-foundation/public-pages/task-0.5.1.7-terms-of-service.md)
- [x] **Task 0.5.1.8:** Wireframe - Privacy policy page (privacy information, data handling, sections, GDPR compliance) - [Wireframe](../../04-design/user-experience/wireframes/00-core-foundation/public-pages/task-0.5.1.8-privacy-policy.md)
- [x] **Task 0.5.1.9:** Wireframe - Cookie policy page (cookie information, consent management, sections, opt-out options) - [Wireframe](../../04-design/user-experience/wireframes/00-core-foundation/public-pages/task-0.5.1.9-cookie-policy.md)

### Authentication Supporting
- [x] **Task 0.5.1.12:** Wireframe - Registration page (form fields, validation indicators, terms acceptance) - [Wireframe](../../04-design/user-experience/wireframes/00-core-foundation/authentication/task-0.5.1.12-registration-page.md)
- [x] **Task 0.5.1.13:** Wireframe - Forgot password / Reset password flow (forgot password page, reset password page, email confirmation) - [Wireframe](../../04-design/user-experience/wireframes/00-core-foundation/authentication/task-0.5.1.13-forgot-reset-password.md)

### Dashboard Utilities
- [x] **Task 0.5.1.22:** Wireframe - Profile page (user information, account settings, password change, preferences, user menu integration) - [Wireframe](../../04-design/user-experience/wireframes/00-core-foundation/dashboard/task-0.5.1.22-profile-page.md)

---

## Priority 8: Analytics & Historical Data (Days 14-15) 🟢 LOWEST PRIORITY

**Rationale:** Nice-to-have for MVP — can defer if timeline is tight. Analytics and historical data are valuable but not critical for MVP.

**📋 Implementation Guide:** All Priority 8 wireframes created with guidance from Fatima (MOH Regulatory Requirements) and Dr. Samir (Business Process Validation).

**📁 Wireframe Specifications:**
- [Analytics Wireframes](../../04-design/user-experience/wireframes/02-vci/analytics/README.md)
- [Historical Data Wireframes](../../04-design/user-experience/wireframes/05-audit-historical/historical-data/README.md)
- [Modal Wireframes](../../04-design/user-experience/wireframes/07-modals/README.md)

### Analytics (VCI Treemap)
- [x] **Task 0.5.3.22:** Wireframe - ATC Treemap page (Level 1 - % total stock level compliance violations by therapeutic area/ATC code, clickable tiles, filters: critical medicines/date range) - [Wireframe](../../04-design/user-experience/wireframes/02-vci/analytics/task-0.5.3.22-atc-treemap.md)
- [x] **Task 0.5.3.23:** Wireframe - Products Treemap page (Level 2 - % total stock level compliance violations by product within selected ATC, drill-down from ATC, back navigation, breadcrumbs) - [Wireframe](../../04-design/user-experience/wireframes/02-vci/analytics/task-0.5.3.23-products-treemap.md)
- [x] **Task 0.5.3.24:** Wireframe - Dosage/Forms Modal (Level 3 - table showing dosage/form with % compliance, expandable rows, modal overlay, no route change) - [Wireframe](../../04-design/user-experience/wireframes/02-vci/analytics/task-0.5.3.24-dosage-forms-modal.md)
- [x] **Task 0.5.3.25:** Wireframe - SKU List expanded view (Level 4 - SKUs with compliance violation status, external link icon indicating opens in new tab, info message, modal stays open) - [Wireframe](../../04-design/user-experience/wireframes/02-vci/analytics/task-0.5.3.25-sku-list-expanded.md)
- [x] **Task 0.5.3.27:** Wireframe - SKU Action Page integration (Level 5 - uses existing SKU detail route, opens in new tab, role-based actions for Tier 1/Tier 2, query params for back navigation) - [Wireframe](../../04-design/user-experience/wireframes/02-vci/analytics/task-0.5.3.27-sku-action-page-integration.md)

### Historical Data Pages
- [x] **Task 0.5.3.28:** Wireframe - Submission history page (all past submissions, filterable by type/year/company, submission history route) - [Wireframe](../../04-design/user-experience/wireframes/05-audit-historical/historical-data/task-0.5.3.28-submission-history.md)
- [x] **Task 0.5.4.9:** Wireframe - Export history page (historical export authorizations, filterable by date/company/status, export history route) - [Wireframe](../../04-design/user-experience/wireframes/05-audit-historical/historical-data/task-0.5.4.9-export-history.md)
- [x] **Task 0.5.4.10:** Wireframe - Historical authorization detail page (historical authorization details, authorization history route) - [Wireframe](../../04-design/user-experience/wireframes/05-audit-historical/historical-data/task-0.5.4.10-historical-authorization-detail.md)
- [x] **Task 0.5.5.13:** Wireframe - Compliance scores history page (historical compliance scores, filterable by date/company, scores history route) - [Wireframe](../../04-design/user-experience/wireframes/05-audit-historical/historical-data/task-0.5.5.13-compliance-scores-history.md)
- [x] **Task 0.5.5.14:** Wireframe - Compliance Disputes history page (historical compliance disputes, filterable by date/company/status, compliance disputes history route) - [Wireframe](../../04-design/user-experience/wireframes/05-audit-historical/historical-data/task-0.5.5.14-compliance-disputes-history.md)

### Modal & Dialog Wireframes (Reusable UI Patterns)
- [x] **Task 0.5.8.1:** Wireframe - Confirmation modal (delete, archive, approve, reject actions - confirmation message, cancel/confirm buttons) - [Wireframe](../../04-design/user-experience/wireframes/07-modals/task-0.5.8.1-confirmation-modal.md)
- [x] **Task 0.5.8.2:** Wireframe - File upload modal (drag-drop interface, file list, progress indicators, validation errors) - [Wireframe](../../04-design/user-experience/wireframes/07-modals/task-0.5.8.2-file-upload-modal.md)
- [x] **Task 0.5.8.3:** Wireframe - Date range picker modal (calendar interface, quick filters, timezone display) - [Wireframe](../../04-design/user-experience/wireframes/07-modals/task-0.5.8.3-date-range-picker-modal.md)
- [x] **Task 0.5.8.4:** Wireframe - User/Company picker modal (search, filters, multi-select, role-based filtering) - [Wireframe](../../04-design/user-experience/wireframes/07-modals/task-0.5.8.4-user-company-picker-modal.md)
- [x] **Task 0.5.8.5:** Wireframe - Export options modal (format selection, date range, progress indicator, download link) - [Wireframe](../../04-design/user-experience/wireframes/07-modals/task-0.5.8.5-export-options-modal.md)
- [x] **Task 0.5.8.6:** Wireframe - Quick history preview modal (recent changes timeline, "View Full History" button) - [Wireframe](../../04-design/user-experience/wireframes/07-modals/task-0.5.8.6-quick-history-preview-modal.md)
- [x] **Task 0.5.8.7:** Wireframe - Comparison modal (current vs historical side-by-side, highlight differences) - [Wireframe](../../04-design/user-experience/wireframes/07-modals/task-0.5.8.7-comparison-modal.md)
- [x] **Task 0.5.8.8:** Wireframe - Detail inspection modal (quick detail view from list, "View Full Page" button) - [Wireframe](../../04-design/user-experience/wireframes/07-modals/task-0.5.8.8-detail-inspection-modal.md)
- [x] **Task 0.5.8.9:** Wireframe - Message attachment viewer modal (image preview, document viewer, download actions) - [Wireframe](../../04-design/user-experience/wireframes/07-modals/task-0.5.8.9-message-attachment-viewer-modal.md)
- [x] **Task 0.5.8.10:** Wireframe - Workflow status modal (workflow progress, approval chain, status transitions) - [Wireframe](../../04-design/user-experience/wireframes/07-modals/task-0.5.8.10-workflow-status-modal.md)

**Note:** Some modals are already included in their respective module sections (e.g., Threshold modification modal in VCI, Score review modals in CMC). These are additional reusable modal patterns.

---

## Subphase 0.5.7: Wireframe Review & Iteration (Days 14-15)

---
## Review Checkpoints

### Checkpoint 1: After Priority 3 (Critical VCI Workflows)

**📋 Review Document:** [Checkpoint 1 Review Document](phase-0-5-checkpoint-1-review.md) - Complete review process, templates, and feedback tracking

- [x] **Checkpoint 1.1:** Module-level stakeholder review - RMM + VCI modules (Fatima, Dr. Samir review for regulatory compliance and business process alignment) - ✅ Complete 2025-01-16
- [x] **Checkpoint 1.2:** Internal team review - Priority 1-3 wireframes (Emma, Oliver, Maya review for technical feasibility) - ✅ Complete 2025-01-17
- [x] **Checkpoint 1.3:** Iterate Priority 1-3 wireframes based on feedback - ✅ Complete 2025-01-19

**Rationale:** Validate critical workflows and regulatory compliance before proceeding to supporting features.

**Status:** ✅ Complete - All reviews completed, 8 wireframe iterations done, all sign-offs obtained (2025-01-19)

**Review Summary:**
- **Critical Issues:** 0
- **Medium Priority Issues:** 7 (all addressed)
- **Low Priority Issues:** 6 (documented for implementation)
- **Wireframes Updated:** 8 wireframes enhanced based on feedback
- **Sign-offs:** All 5 reviewers approved

**📋 Implementation Resources:**
- [Checkpoint 1 Review Document](phase-0-5-checkpoint-1-review.md) - Main review tracking
- [Checkpoint 1 Process Guide](phase-0-5-checkpoint-1-process-guide.md) - Step-by-step implementation guide
- [Checkpoint 1 Review Checklist](phase-0-5-checkpoint-1-review-checklist.md) - Actionable checklists for reviewers
- [Review Meeting Template](../communications/meeting-notes/checkpoint-1-review-meeting-template.md) - Review meeting structure

---

## Subphase 0.5.7: Final Wireframe Review & Iteration (Days 14-15)

**📋 Final Review Document:** [Final Review Document](phase-0-5-final-review.md) - Complete final review process, tasks, and tracking

**📋 Final Review Checklist:** [Final Review Checklist](phase-0-5-final-review-checklist.md) - Comprehensive checklists for all reviewers

### Final Review Tasks
- [x] **Task 0.5.7.1:** Internal team review - All wireframes (Emma, Oliver, Maya review for technical feasibility) - ✅ Complete 2025-01-20
- [x] **Task 0.5.7.2:** Stakeholder review - MOH review (Fatima, Tier 1/Tier 2 users review workflows and layouts) - ✅ Complete 2025-01-21
- [x] **Task 0.5.7.3:** Stakeholder review - Business review (Dr. Samir review value chain workflows) - ✅ Complete 2025-01-21
- [x] **Task 0.5.7.4:** Iterate wireframes based on feedback (update layouts, workflows, add missing states) - ✅ Complete 2025-01-22
- [x] **Task 0.5.7.5:** Final wireframe approval (sign-off from all stakeholders) - ✅ Complete 2025-01-22

### Documentation Tasks
- [x] **Task 0.5.7.6:** Document wireframe annotations (interactions, state transitions, validation rules, responsive breakpoints) - ✅ Complete 2025-01-22
- [x] **Task 0.5.7.7:** Create wireframe-to-component mapping (which components from ui-component-specifications.md map to each wireframe section) - ✅ Complete 2025-01-22
- [x] **Task 0.5.7.8:** Export wireframes for development reference (PDF or design tool links, organized by module) - ✅ Complete 2025-01-22

### Phase 0.5 Sign-off
- [x] **Task 0.5.7.9:** Phase 0.5 internal review and approval - ✅ Complete 2025-01-22
- [x] **Task 0.5.7.10:** Phase 0.5 sign-off and approval to proceed to Phase 1.1 - ✅ Complete 2025-01-22

**Status:** ✅ Complete - All reviews completed, 6 wireframe iterations done, documentation complete, all sign-offs obtained (2025-01-22)

**Final Review Summary:**
- **Critical Issues:** 0
- **Medium Priority Issues:** 6 (all addressed)
- **Low Priority Issues:** 6 (documented for implementation)
- **Wireframes Updated:** 6 wireframes enhanced
- **Sign-offs:** All 5 reviewers approved
- **Documentation:** Complete (annotations, component mapping, exports)

---

## Success Criteria

- ✅ All critical pages wireframed
- ✅ All workflows wireframed
- ✅ Stakeholder approval obtained
- ✅ Wireframes documented and exported
- ✅ Wireframe navigation & connection map created (with Miro flow diagram)
- ✅ Wireframe-to-component mapping created
- ✅ Team aligned on UI/UX approach
- ✅ Phase 0.5 sign-off complete

---

## Deliverables

1. ✅ Complete wireframe set for all modules (RMM, VCI, ECS, CMC) - 120 wireframes
2. ✅ Wireframe navigation & connection map - Complete page-to-page navigation mapping with Miro flow diagram
3. ✅ Wireframe annotations and documentation
4. ✅ Wireframe-to-component mapping
5. ✅ Exported wireframes (PDF or design tool links)
6. ✅ Miro navigation flow diagram - Visual representation of all page connections
7. ✅ Stakeholder approval documentation
8. ✅ Wireframe-First Implementation Principle - Documented and integrated into Phase 1 Implementation Plan

**Storage Location:** All wireframes and documentation are stored in [`docs/04-design/user-experience/wireframes/`](../../04-design/user-experience/wireframes/README.md)

**Key Deliverable:** [Wireframe Navigation & Connection Map](../../04-design/user-experience/wireframes/06-documentation/wireframe-navigation-connection-map.md) - **Complete mapping of all navigation connections between all 120 wireframes**

---

## Team Assignments

**Phase 0.5 (Wireframes):**
- **Emma:** Lead wireframe creation, UX design, stakeholder coordination
- **Oliver:** Technical feasibility review, integration considerations
- **Maya:** Workflow validation, state transition review
- **Fatima:** MOH workflow and regulatory requirement validation
- **Dr. Samir:** Business process validation

---

## Related Documents

### Wireframe Documentation
- [Wireframes Directory](../../04-design/user-experience/wireframes/README.md) - Wireframe storage structure and organization
- [Wireframe Index](../../04-design/user-experience/wireframes/06-documentation/wireframe-index.md) - Complete index of all wireframes
- [Wireframe Navigation & Connection Map](../../04-design/user-experience/wireframes/06-documentation/wireframe-navigation-connection-map.md) - **Complete navigation flow mapping showing all page connections**
- [Wireframe Annotations](../../04-design/user-experience/wireframes/06-documentation/wireframe-annotations.md) - Detailed annotations and interactions
- [Component Mapping](../../04-design/user-experience/wireframes/06-documentation/wireframe-to-component-mapping.md) - Wireframe to UI component mappings
- [Design Tool Links](../../04-design/user-experience/wireframes/06-documentation/design-tool-links.md) - External design tool links (includes Miro flow diagram)

### Phase 0.5 Planning & Decisions
- [Pre-Priority 1 Discussion Summary](phase-0-5-pre-priority-1-decisions.md) - All wireframing decisions, tools, process, and approach

### Phase 1 Integration
- [Phase 1 Implementation Plan](Phase-1-Implementation-Plan.md) - Implementation plan with wireframe references
- [Wireframe-First Implementation Principle](wireframe-first-implementation-principle.md) - Core implementation directive
- [Implementation Standards](phase-1-implementation-standards.md) - Task format and Definition of Done
- [Phase 1 Audit Status Tracker](phase-1-audit-status-tracker.md) - Pre-implementation audit status
- [Retroactive Update Plan](phase-0-0.5-0.6-retroactive-update-plan.md) - Phase integration documentation

### Architecture & Design References
- [Phase 0: Technical Foundation](phase-0-technical-foundation.md)
- [Phase 1 Overview](phase-1-overview.md)
- [Phase 1 Implementation Plan](Phase-1-Implementation-Plan.md)
- [Communication Channels Requirements](../../02-architecture/communication-channels-requirements.md) - Communication system requirements and design
- [Communication Channels Lifecycle](../../02-architecture/communication-channels-lifecycle.md) - Communications lifecycle states, transitions, and UI status indicators (added 2025-01-01)
- [Communication Lifecycle Change List](../../04-design/user-experience/wireframes/00-core-foundation/communications/COMMUNICATION-LIFECYCLE-CHANGE-LIST.md) - Detailed change list for lifecycle implementation
- [Communication Implementation Summary](../../04-design/user-experience/wireframes/00-core-foundation/communications/IMPLEMENTATION-SUMMARY.md) - Implementation summary of all lifecycle changes
- [UI Component Specifications](../../02-architecture/frontend/ui-component-specifications.md)
- [Form Design Patterns](../../02-architecture/frontend/form-design-patterns.md)
- [Role-Based UI Patterns](../../02-architecture/frontend/role-based-ui-patterns.md)
- [Navigation & Layout Patterns](../../02-architecture/frontend/navigation-layout-patterns.md)
- [Routing Structure](../../02-architecture/frontend/routing-structure.md)
- [Design System](../../02-architecture/frontend/design-system.md)
- [State Management UI Patterns](../../02-architecture/frontend/state-management-ui-patterns.md)
- [Historical Data Routing Proposal](../../02-architecture/frontend/historical-data-routing-proposal.md)

---

**Next Phase:** ✅ [Phase 0.6: Database Schema Audit](phase-0-6-databases.md) COMPLETE → ✅ [Phase 1 Implementation Plan](Phase-1-Implementation-Plan.md) APPROVED FOR IMPLEMENTATION  
**Phase 0.5 Status:** ✅ COMPLETE

---

**Owner:** Emma (UI/UX + Next.js Frontend Specialist)  
**Last Updated:** 2026-01-12

**Recent Updates:**
- 2025-01-01: All Priority 1 wireframes updated to integrate enforcement lifecycle (enforcement actions, appeals, notifications, communications, history, audit, navigation)
- 2025-01-01: Enforcement module wireframes added to Priority 2 (6 wireframes: dashboard, actions list, detail, creation wizard, pending approvals, reports)
- 2025-01-15: Priority 1, 2, and 3 wireframes marked as complete. All existing wireframes updated with links and status. Priority 1: 20/20 complete ✅, Priority 2: 12/18 complete (67% - Core workflows complete, Supporting Pages pending), Priority 3: 14/14 complete ✅. Time-bound threshold modification features integrated across all relevant wireframes.
- 2025-01-15: Priority 4 wireframes created and marked as complete. All 9 wireframes created: MSQ submissions (list, form, detail, correction), ATC codes list, Critical medicines list, RMM overview, VCI overview, and Threshold detail pages. Priority 4: 9/9 complete ✅.
- 2025-01-15: Priority 5 wireframes created and marked as complete. All 9 ECS module wireframes created: ECS overview, export requests (list, form, detail, workflow actions), export authorizations (list, detail, completion reporting), and replenishment schedule tracking. Priority 5: 9/9 complete ✅. Wireframes created with guidance from Fatima (MOH Regulatory Requirements) & Dr. Samir (Business Process Validation).
- 2025-01-15: Priority 6 wireframes created and marked as complete. All 13 CMC module wireframes created: CMC overview, compliance scores (list, detail, leaderboard), score review modals (Tier 2 flag anomalies, Tier 1 override), compliance disputes (list, detail, creation, review), and reports (list, detail, review/approval). Priority 6: 13/13 complete ✅. Wireframes created with guidance from Fatima (MOH Regulatory Requirements) & Dr. Samir (Business Process Validation).
- 2025-01-15: Priority 2 RMM Supporting Pages wireframes created and marked as complete. All 6 wireframes created: Products list, Product detail, SKUs list, SKU detail, Product create/edit form, and SKU create/edit form. Priority 2: 18/18 complete ✅ (Enforcement: 6, Core RMM: 6, Supporting Pages: 6). Wireframes created with guidance from Fatima (Governance & Regulatory Requirements) and Dr. Samir (Business Process Validation).
- 2025-01-15: Priority 7 wireframes created and marked as complete. All 14 wireframes created: Global section (archived conversations), Help & Info (support center, FAQ, contact support, documentation, system status), Public pages (homepage, about), Legal pages (terms, privacy, cookies), Authentication (registration, forgot/reset password), and Dashboard utilities (profile). Priority 7: 14/14 complete ✅. Wireframes created with guidance from Fatima (MOH Regulatory Requirements) & Dr. Samir (Business Process Validation).
- 2025-01-15: Priority 8 wireframes created and marked as complete. All 21 wireframes created: Analytics (VCI Treemap - 5 wireframes: ATC treemap, Products treemap, Dosage/Forms modal, SKU list expanded, SKU action page integration), Historical Data Pages (5 wireframes: Submission history, Export history, Historical authorization detail, Compliance scores history, Compliance disputes history), and Modal & Dialog Wireframes (10 wireframes: Confirmation, File upload, Date range picker, User/Company picker, Export options, Quick history preview, Comparison, Detail inspection, Message attachment viewer, Workflow status). Priority 8: 21/21 complete ✅. Wireframes created with guidance from Fatima (MOH Regulatory Requirements) & Dr. Samir (Business Process Validation). All wireframes follow established patterns and include comprehensive state variations, responsive behavior, interactions, and accessibility considerations.
- 2025-01-15: Enforcement cycle audit completed. All wireframes audited and updated with enforcement cycle integration. Two new appeal wireframes created: Appeal Review Interface (MOH Tier 1 - task-0.5.2.1e) and Appeal Submission Form (Company users - task-0.5.2.1f). Priority 2 updated: 20/20 complete ✅ (added 2 appeal wireframes). Total wireframes: 120/120 complete (100%). All enforcement cycle stages now properly integrated across all wireframes with links, forms, communications, and notifications.
- 2025-01-15: Communication lifecycle implementation completed. All 7 communication wireframes (Priority 1: tasks 0.5.1.24-0.5.1.29, Priority 7: task 0.5.1.36) updated to align with Communication Channels Lifecycle specification. Changes include: 7-year retention period (regulatory compliance), standardized status indicators (✓✓ format for delivered/read), lifecycle state visibility (threaded, workflow-linked, archived), archive functionality, immutability warnings, and lifecycle information panels. All 45+ changes across 3 phases implemented. See [Communication Lifecycle Change List](../../04-design/user-experience/wireframes/00-core-foundation/communications/COMMUNICATION-LIFECYCLE-CHANGE-LIST.md) and [Implementation Summary](../../04-design/user-experience/wireframes/00-core-foundation/communications/IMPLEMENTATION-SUMMARY.md) for complete details.

---

**Phase 1 Pre-Implementation Audit Integration (January 2026):**
- All 120 wireframes validated during Phase 1 Pre-Implementation Audit

---

## 🔴 CRITICAL: Missing Wireframes for Phase 1.1.1.FIX Routes

**Status:** ✅ COMPLETE - P0 Wireframes Signed Off (2026-01-12)  
**Created:** 2026-01-12  
**Last Updated:** 2026-01-12  
**Owner:** Emma (UI/UX) with guidance from Fatima (MOH Governance) and Dr. Samir (Pharma Value Chain SME)

### Problem Statement

During Phase 1.1.1.FIX route inventory, we identified routes that need placeholder pages. These routes require wireframes before implementation can proceed. Wireframes must be created, reviewed by team specialists, and signed off before Phase 1.1.2 begins.

**✅ RESOLVED:** All P0 wireframes for Phase 1.1.2 have been created, reviewed, and signed off.

### Wireframes Status

The following wireframes have been created and signed off for routes identified in Phase 1.1.1.FIX:

#### Global Section Routes (Core Foundation)
| Task ID | Wireframe | Route | Status | Priority | Sign-Off Date |
|---------|-----------|-------|--------|----------|---------------|
| 0.5.1.30 | History overview page | `/history` | ✅ Signed Off | P0 - CRITICAL | 2026-01-12 |
| 0.5.1.31 | Notifications page | `/notifications` | ✅ Signed Off | P0 - CRITICAL | 2026-01-12 |
| 0.5.1.32 | Audit logs list page | `/audit/logs` | ✅ Signed Off | P0 - CRITICAL | 2026-01-12 |
| 0.5.1.33 | Audit log detail page | `/audit/logs/[id]` | ⚪ Not Started | P1 - HIGH | - |
| 0.5.1.34 | Audit reports page | `/audit/reports` | ⚪ Not Started | P1 - HIGH | - |
| 0.5.1.35 | System Configuration page | `/system-config` | ✅ Signed Off | P0 - CRITICAL | 2026-01-12 |

#### Public Routes (Support & Status)
| Task ID | Wireframe | Route | Status | Priority | Sign-Off Date |
|---------|-----------|-------|--------|----------|---------------|
| 0.5.1.37 | Support center page | `/support` | ✅ Complete | P1 - HIGH | - |
| 0.5.1.38 | FAQ page | `/support/faq` | ✅ Complete | P1 - HIGH | - |
| 0.5.1.39 | Contact support page | `/support/contact` | ✅ Complete | P1 - HIGH | - |
| 0.5.1.40 | Documentation page | `/support/documentation` | ✅ Complete | P1 - HIGH | - |
| 0.5.1.41 | System status page | `/status` | ✅ Complete | P1 - HIGH | - |

#### RMM Module Routes
| Task ID | Wireframe | Route | Status | Priority | Sign-Off Date |
|---------|-----------|-------|--------|----------|---------------|
| 0.5.2.1 | RMM overview page | `/rmm` | ✅ Signed Off | P0 - CRITICAL (Phase 1.1.2) | 2026-01-12 |
| 0.5.2.2 | Companies list page | `/rmm/companies` | ✅ Complete | P0 - CRITICAL (Phase 1.1.2) | - |
| 0.5.2.4 | Products list page | `/rmm/products` | ✅ Complete | P0 - CRITICAL (Phase 1.1.2) | - |
| 0.5.2.6 | SKUs list page | `/rmm/skus` | ✅ Complete | P0 - CRITICAL (Phase 1.1.2) | - |

#### VCI Module Routes
| Task ID | Wireframe | Route | Status | Priority |
|---------|-----------|-------|--------|----------|
| 0.5.3.0 | VCI overview page | `/vci` | ⚪ Not Started | P0 - CRITICAL (Phase 1.1.3) |
| 0.5.3.1 | AAMS submissions list page | `/vci/submissions/aams` | ⚪ Not Started | P0 - CRITICAL (Phase 1.1.3) |
| 0.5.3.9 | MSQ submissions list page | `/vci/submissions/msq` | ⚪ Not Started | P0 - CRITICAL (Phase 1.1.4) |
| 0.5.3.11 | WSL submissions list page | `/vci/submissions/wsl` | ⚪ Not Started | P0 - CRITICAL (Phase 1.1.5) |
| 0.5.3.28 | Submission history page | `/vci/submissions/history` | ⚪ Not Started | P1 - HIGH (Phase 1.1.7) |
| 0.5.3.4 | Threshold management page | `/vci/thresholds` | ⚪ Not Started | P0 - CRITICAL (Phase 1.1.3) |
| 0.5.3.14 | Compliance Violations list page | `/vci/breaches` | ⚪ Not Started | P0 - CRITICAL (Phase 1.1.5) |
| 0.5.3.18 | Governance Dashboard | `/vci/governance` | ⚪ Not Started | P0 - CRITICAL (Phase 1.1.5) |

#### ECS Module Routes
| Task ID | Wireframe | Route | Status | Priority |
|---------|-----------|-------|--------|----------|
| 0.5.4.0 | ECS overview page | `/ecs` | ⚪ Not Started | P0 - CRITICAL (Phase 1.2) |
| 0.5.4.1 | Export requests list page | `/ecs/export-requests` | ⚪ Not Started | P0 - CRITICAL (Phase 1.2) |
| 0.5.4.5 | Export authorizations list page | `/ecs/authorizations` | ⚪ Not Started | P0 - CRITICAL (Phase 1.2) |

#### CMC Module Routes
| Task ID | Wireframe | Route | Status | Priority |
|---------|-----------|-------|--------|----------|
| 0.5.5.0 | CMC overview page | `/cmc` | ⚪ Not Started | P0 - CRITICAL (Phase 1.3) |
| 0.5.5.1 | Compliance scores list page | `/cmc/scores` | ⚪ Not Started | P0 - CRITICAL (Phase 1.3) |
| 0.5.5.8 | Compliance Disputes list page | `/cmc/disputes` | ⚪ Not Started | P0 - CRITICAL (Phase 1.3) |
| 0.5.5.10 | Reports list page | `/cmc/reports` | ⚪ Not Started | P0 - CRITICAL (Phase 1.3) |

#### Enforcement Module Routes
| Task ID | Wireframe | Route | Status | Priority | Sign-Off Date |
|---------|-----------|-------|--------|----------|---------------|
| 0.5.2.0 | Enforcement Dashboard | `/enforcement` | ✅ Signed Off | P0 - CRITICAL (Phase 1.1.2) | 2026-01-12 |
| 0.5.2.1 | Enforcement Actions list page | `/enforcement/actions` | ✅ Signed Off | P0 - CRITICAL (Phase 1.1.2) | 2026-01-12 |
| 0.5.2.1c | Pending Approvals page | `/enforcement/pending-approvals` | ✅ Signed Off | P0 - CRITICAL (Phase 1.1.2) | 2026-01-12 |
| 0.5.2.1d | Enforcement Reports page | `/enforcement/reports` | ✅ Signed Off | P0 - CRITICAL (Phase 1.1.2) | 2026-01-12 |

### Wireframe Creation Workflow

**Step 1: Wireframe Creation (Emma)**
- Emma creates wireframes following established patterns
- Reference existing wireframes for consistency
- Follow design system and component specifications
- Include role-based variations where applicable

**Step 2: Team Specialist Review**
- **Fatima (MOH Governance & Regulation SME):** Review for regulatory compliance, governance workflows, MOH requirements
- **Dr. Samir (Pharma Value Chain SME):** Review for business process accuracy, value chain workflows
- **Oliver (Chief Architect):** Review for technical feasibility, integration considerations
- **Emma (UI/UX):** Incorporate feedback and iterate

**Step 3: Sign-Off Process**
- Present wireframes to project stakeholders
- Document approval and sign-off
- Update wireframe index with status
- Link wireframes to Phase 1 Implementation Plan tasks

**Step 4: Database Schema Review (Phase 0.6)**
- After wireframe sign-off, update Phase 0.6 database audit
- Identify any new database requirements from wireframes
- Update schema-design.md if needed
- Create migration tasks if schema changes required

**Step 5: Phase 1 Plan Integration**
- Add tasks to Phase 1 Implementation Plan with:
  - Wireframe links (task-0.5.X.X)
  - Database requirements (if any)
  - Implementation phase reference

### Priority Order

**P0 - CRITICAL (Must Complete Before Phase 1.1.2):**
1. RMM overview (0.5.2.1)
2. Companies list (0.5.2.2)
3. Products list (0.5.2.4)
4. SKUs list (0.5.2.6)
5. Enforcement Dashboard (0.5.2.0)
6. Enforcement Actions list (0.5.2.1)
7. History overview (0.5.1.30)
8. Notifications page (0.5.1.31)
9. Audit logs list (0.5.1.32)
10. System Configuration (0.5.1.35)

**P1 - HIGH (Complete Before Phase 1.1.3):**
- VCI overview and submission routes
- Support routes
- Audit detail routes

**P2 - MEDIUM (Complete Before Respective Phases):**
- ECS routes (Phase 1.2)
- CMC routes (Phase 1.3)

### Deliverables

1. ✅ **Wireframe List Created:** This section documents all missing wireframes
2. ✅ **P0 Wireframes Created:** All 9 P0 wireframes for Phase 1.1.2 created by Emma with team guidance
3. ✅ **Team Review Complete:** Fatima, Dr. Samir, Oliver reviewed and approved
4. ✅ **Sign-Off Obtained:** Stakeholder sign-off documented (2026-01-12)
5. ⏳ **Phase 0.6 Updated:** Database requirements identified and documented (in progress)
6. ⏳ **Phase 1 Plan Updated:** Tasks added with wireframe and DB links (in progress)

### P0 Wireframes Signed Off (2026-01-12)

All 9 P0 wireframes for Phase 1.1.2 have been created, reviewed, and signed off:

1. ✅ **task-0.5.1.30** - History overview page (`/history`)
2. ✅ **task-0.5.1.31** - Notifications page (`/notifications`)
3. ✅ **task-0.5.1.32** - Audit logs list page (`/audit/logs`)
4. ✅ **task-0.5.1.35** - System Configuration page (`/system-config`)
5. ✅ **task-0.5.2.1** - RMM overview page (`/rmm`)
6. ✅ **task-0.5.2.0** - Enforcement Dashboard (`/enforcement`)
7. ✅ **task-0.5.2.1** - Enforcement Actions list page (`/enforcement/actions`)
8. ✅ **task-0.5.2.1c** - Pending Approvals page (`/enforcement/pending-approvals`)
9. ✅ **task-0.5.2.1d** - Enforcement Reports page (`/enforcement/reports`)

**Sign-Off Date:** 2026-01-12  
**Status:** ✅ Ready for Phase 1.1.2 implementation

---

**Last Updated:** 2026-01-12  
**Next Action:** Emma to create P0 wireframes with team specialist guidance
- Wireframe references added to all frontend tasks in Phase 1 Implementation Plan
- Pattern document references added to all frontend tasks (Navigation Layout, Form Design, Role-Based UI, Component Specifications)
- Wireframe-First Implementation Principle established and documented
- 11 team members audited and approved wireframe-implementation alignment
- 60 audit issues addressed (44 critical + 16 medium)
- See [Phase 1 Audit Status Tracker](phase-1-audit-status-tracker.md) for complete audit details
**Post-Audit Wireframe Review (January 12, 2026):**
- Validation error states verified/enhanced in form wireframes:
  - ✅ SKU Form (task-0.5.2.10): Pharmaceutical attributes validation already complete
  - ✅ WSL Form (task-0.5.3.12): Replenishment date validation already complete
  - ✅ AAMS Form (task-0.5.3.2): Added explicit SKU/quantity validation error states
  - ✅ MSQ Form (task-0.5.3.10): Added explicit SKU/quantity validation error states
  - ✅ Profile Page (task-0.5.1.22): Phase 0.6 fields (avatar, timezone, language, notifications) already present
- Assessed new wireframe needs:
  - ❌ Testing Dashboard: Not needed (dev tooling, not application UI)
  - ❌ Job Queue Monitor: Not needed (use Supabase dashboard)
  - ❌ Data Export Page: Not needed (Export Options Modal sufficient)
