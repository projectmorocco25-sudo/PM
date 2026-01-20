# Phase 0.5: Wireframes Catalog

**Phase:** Phase 0.5 - UI/UX Wireframes & Design Validation (Pre-Phase 1)  
**Duration:** 2-3 weeks (before Phase 1.1)  
**Owner:** Emma (UI/UX + Next.js Frontend Specialist)  
**Prerequisites:** 
- Phase 0 (Technical Foundation) - See [Phase 0: Technical Foundation](phase-0-technical-foundation.md)
- Phase 0.6 (Database Schema Audit) - See [Phase 0.6: Database Schema Audit](phase-0-6-databases.md)

---

## Table of Contents

1. [Overview](#overview)
2. [Wireframe Principles](#wireframe-principles)
3. [Wireframe Storage & Organization](#wireframe-storage--organization)
4. [Implementation Pattern References](#implementation-pattern-references)
5. [Wireframe Catalog](#wireframe-catalog)
   - [Priority 1: Critical Foundation](#priority-1-critical-foundation)
   - [Priority 2: Core RMM Workflows](#priority-2-core-rmm-workflows)
   - [Priority 3: Critical VCI Workflows](#priority-3-critical-vci-workflows)
   - [Priority 4: Supporting VCI & RMM](#priority-4-supporting-vci--rmm)
   - [Priority 5: ECS Module](#priority-5-ecs-module)
   - [Priority 6: CMC Module](#priority-6-cmc-module)
   - [Priority 7: Global & Help Pages](#priority-7-global--help-pages)
   - [Priority 8: Analytics & Historical Data](#priority-8-analytics--historical-data)
6. [Related Documents](#related-documents)

---

## Overview

### Objective

Create wireframes for all critical pages and workflows to validate UX, align stakeholders, and guide implementation.

### Purpose

Wireframes serve as the primary design reference for all Phase 1 frontend implementation. They enable:

- **Stakeholder Alignment:** Validate layouts with MOH and company users before coding
- **Early UX Validation:** Catch usability issues before development
- **Development Efficiency:** Clear visual specs reduce rework and speed up implementation
- **Risk Mitigation:** Identify complex UI patterns and workflow issues early

### Wireframe-First Implementation Principle

Wireframes created in this phase are the **PRIMARY design reference** for all Phase 1 frontend implementation. The principle states:

1. Review wireframe BEFORE starting any frontend task
2. Wireframe defines the UI/UX - Architecture docs support wireframes, but wireframes take precedence
3. If wireframe doesn't exist, STOP and create it first
4. Verify implementation matches wireframe before marking task complete

**Complete Documentation:** See [Wireframe-First Implementation Principle](wireframe-first-implementation-principle.md)

---

## Wireframe Principles

- **Low-Fidelity Focus:** Quick sketches focusing on layout, hierarchy, and flow (not visual design)
- **Component-Based:** Reference existing design system and component specifications
- **Role-Aware:** Different wireframes for different user roles (Company, MOH Tier 1, Tier 2)
- **Responsive Considerations:** Wireframe key breakpoints (desktop, tablet)
- **Workflow-Focused:** Emphasize user flows and state transitions

---

## Wireframe Storage & Organization

All wireframes are stored in [`docs/04-design/user-experience/wireframes/`](../../04-design/user-experience/wireframes/README.md), organized by module:

- **00-core-foundation/** - Core foundation wireframes
- **01-rmm/** - RMM module wireframes
- **02-vci/** - VCI module wireframes
- **03-ecs/** - ECS module wireframes
- **04-cmc/** - CMC module wireframes
- **05-audit-historical/** - Audit & historical data wireframes
- **06-documentation/** - Wireframe documentation (index, annotations, mappings, design tool links)
- **07-modals/** - Reusable modal patterns

**File Naming Convention:** `task-{TASK_ID}-{descriptive-name}.{ext}` (e.g., `task-0.5.1.1-public-homepage.md`)

**Design Tool:** Wireframes are created in [Miro](https://miro.com/app/board/uXjVGUps93A=/) (Master Board). See [Design Tool Links](../../04-design/user-experience/wireframes/06-documentation/design-tool-links.md) for board organization and access.

See the [Wireframes Directory README](../../04-design/user-experience/wireframes/README.md) for complete structure and organization details.

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

---

## Wireframe Catalog

Wireframes are organized by priority to focus on critical path items first, enabling early stakeholder validation and unblocking Phase 1.1 development.

### Priority Summary

| Priority | Focus | Estimated Days | Wireframe Count |
|----------|-------|-----------------|------------------|
| Priority 1 | Critical Foundation | 1-2 | 20 wireframes |
| Priority 2 | Enforcement + Core RMM Workflows | 3-4 | 20 wireframes |
| Priority 3 | Critical VCI Workflows | 5-6 | 14 wireframes |
| Priority 4 | Supporting VCI & RMM | 7-8 | 9 wireframes |
| Priority 5 | ECS Module | 9-10 | 9 wireframes |
| Priority 6 | CMC Module | 11-12 | 13 wireframes |
| Priority 7 | Global & Help Pages | 13-14 | 14 wireframes |
| Priority 8 | Analytics, Historical & Modals | 14-15 | 21 wireframes |
| **TOTAL** | | **2-3 weeks** | **120 wireframes** |

---

## Priority 1: Critical Foundation

**Rationale:** Must be done first — blocks everything else. Enables early stakeholder validation of navigation and role-based access.

**Implementation Guide:** See [Priority 1 Implementation Guide](../../04-design/user-experience/wireframes/00-core-foundation/PRIORITY-1-IMPLEMENTATION-GUIDE.md) for detailed wireframe specifications, layout structures, and annotations.

**Wireframe Specifications:**
- [Authentication Wireframes](../../04-design/user-experience/wireframes/00-core-foundation/authentication/README.md)
- [Layout & Navigation Wireframes](../../04-design/user-experience/wireframes/00-core-foundation/layout-navigation/README.md)
- [Dashboard Wireframes](../../04-design/user-experience/wireframes/00-core-foundation/dashboard/README.md)
- [Communication Wireframes](../../04-design/user-experience/wireframes/00-core-foundation/communications/README.md)
- [Global Section Wireframes](../../04-design/user-experience/wireframes/00-core-foundation/global/README.md)

### Authentication & Layout

| Task ID | Wireframe Name | Description | Link |
|---------|----------------|-------------|------|
| 0.5.1.11 | Login page | Email/password, forgot password link, registration link | [Wireframe](../../04-design/user-experience/wireframes/00-core-foundation/authentication/task-0.5.1.11-login-page.md) |
| 0.5.1.14 | Dashboard layout structure | Header, sidebar, main content area, responsive breakpoints | [Wireframe](../../04-design/user-experience/wireframes/00-core-foundation/layout-navigation/task-0.5.1.14-dashboard-layout-structure.md) |
| 0.5.1.15 | Header component | Logo, user menu, notifications badge, search | [Wireframe](../../04-design/user-experience/wireframes/00-core-foundation/layout-navigation/task-0.5.1.15-header-component.md) |
| 0.5.1.16 | Sidebar navigation | Module grouping, active states, role-based items | [Wireframe](../../04-design/user-experience/wireframes/00-core-foundation/layout-navigation/task-0.5.1.16-sidebar-navigation.md) |
| 0.5.1.17 | Notification center component | Dropdown/popover, notification list, read/unread states, threshold reversion notifications | [Wireframe](../../04-design/user-experience/wireframes/00-core-foundation/layout-navigation/task-0.5.1.17-notification-center-component.md) |

### Core Dashboards (Role-Based)

| Task ID | Wireframe Name | Description | Link |
|---------|----------------|-------------|------|
| 0.5.1.18 | Company Dashboard | My submissions, pending approvals, recent activity, key metrics | [Wireframe](../../04-design/user-experience/wireframes/00-core-foundation/dashboard/task-0.5.1.18-company-dashboard.md) |
| 0.5.1.19 | MOH Tier 1 Dashboard | Governance overview, pending approvals, system-wide metrics, action items, pending threshold reversions widget | [Wireframe](../../04-design/user-experience/wireframes/00-core-foundation/dashboard/task-0.5.1.19-moh-tier1-dashboard.md) |
| 0.5.1.20 | MOH Tier 2 Dashboard | Pending verifications, oversight metrics, review queue, pending threshold reversions view | [Wireframe](../../04-design/user-experience/wireframes/00-core-foundation/dashboard/task-0.5.1.20-moh-tier2-dashboard.md) |

### Communication Interfaces

**Note:** Communication wireframes are critical foundation items as they must be integrated into navigation and workflow pages from the start. See [Communication Channels Requirements](../../02-architecture/communication-channels-requirements.md) and [Communication Channels Lifecycle](../../02-architecture/communication-channels-lifecycle.md) for detailed requirements and lifecycle specifications.

| Task ID | Wireframe Name | Description | Link |
|---------|----------------|-------------|------|
| 0.5.1.24 | Communications inbox list page | Conversation list, unread indicators, lifecycle state filters, status indicators, search, role-based access | [Wireframe](../../04-design/user-experience/wireframes/00-core-foundation/communications/task-0.5.1.24-communications-inbox-list.md) |
| 0.5.1.25 | Conversation detail page | Message thread, reply interface, attachments, read receipts with ✓✓ format, workflow context, archive button, threaded indicator, lifecycle state panel | [Wireframe](../../04-design/user-experience/wireframes/00-core-foundation/communications/task-0.5.1.25-conversation-detail.md) |
| 0.5.1.26 | Compose message interface | Recipient selection, subject, content, attachments, workflow entity linking with immutability warning, lifecycle state information | [Wireframe](../../04-design/user-experience/wireframes/00-core-foundation/communications/task-0.5.1.26-compose-message.md) |
| 0.5.1.27 | Sent messages page | Sent conversations list, status indicators with ✓✓ format: sent/delivered/read | [Wireframe](../../04-design/user-experience/wireframes/00-core-foundation/communications/task-0.5.1.27-sent-messages.md) |
| 0.5.1.28 | System announcements interface | MOH Tier 1 only - announcement list, creation interface, broadcast controls, lifecycle state indicators | [Wireframe](../../04-design/user-experience/wireframes/00-core-foundation/communications/task-0.5.1.28-system-announcements.md) |
| 0.5.1.29 | Communication integration in workflow pages | Message button, conversation list, context display, workflow-linked state indicators | [Wireframe](../../04-design/user-experience/wireframes/00-core-foundation/communications/task-0.5.1.29-communication-integration-workflow.md) |

### Global Section Pages

| Task ID | Wireframe Name | Description | Link |
|---------|----------------|-------------|------|
| 0.5.1.30 | History overview page | Role-based historical overview, quick filters, recent history summary, date range picker | [Wireframe](../../04-design/user-experience/wireframes/00-core-foundation/global/task-0.5.1.30-history-overview.md) |
| 0.5.1.31 | Notifications page | Full notification list, filters, mark as read, notification settings, notification types, threshold reversion notifications | [Wireframe](../../04-design/user-experience/wireframes/00-core-foundation/global/task-0.5.1.31-notifications-page.md) |
| 0.5.1.32 | Audit logs list page | MOH/Auditors only - audit log entries, filters: date range/table/user/action, search, pagination, virtual scrolling | [Wireframe](../../04-design/user-experience/wireframes/00-core-foundation/global/task-0.5.1.32-audit-logs-list.md) |
| 0.5.1.33 | Audit log detail page | Log entry details, related changes, user information, timestamp, hash chain verification | [Wireframe](../../04-design/user-experience/wireframes/00-core-foundation/global/task-0.5.1.33-audit-log-detail.md) |
| 0.5.1.34 | Audit reports page | MOH/Auditors only - audit report list, report types, date range filters, download actions | [Wireframe](../../04-design/user-experience/wireframes/00-core-foundation/global/task-0.5.1.34-audit-reports.md) |
| 0.5.1.35 | System Configuration page | MOH Tier 1 only - module activation, system settings, configuration interface, cloud services compliance | [Wireframe](../../04-design/user-experience/wireframes/00-core-foundation/global/task-0.5.1.35-system-configuration.md) |

---

## Priority 2: Core RMM Workflows

**Rationale:** Foundation for registry management — critical for Phase 1.1. RMM is the foundation module; registry submission workflow is the most critical approval chain.

### Enforcement Module

**Rationale:** Enforcement actions (warnings, fines, suspensions) are critical MOH governance functions requiring dedicated workflow management, approval processes, and regulatory compliance tracking. Must be wireframed early to support dashboard integration and regulatory requirements.

**Note:** Enforcement module is MOH Tier 1 and Tier 2 only. Companies can view their own enforcement actions but cannot create or manage them.

| Task ID | Wireframe Name | Description | Link |
|---------|----------------|-------------|------|
| 0.5.2.0 | Enforcement dashboard page | Summary, recent actions, pending approvals, enforcement metrics, action type breakdown | [Wireframe](../../04-design/user-experience/wireframes/01-rmm/enforcement/task-0.5.2.0-enforcement-dashboard.md) |
| 0.5.2.1 | Enforcement actions list page | All actions, filters: action type/status/company/date range, search, pagination, status indicators | [Wireframe](../../04-design/user-experience/wireframes/01-rmm/enforcement/task-0.5.2.1-enforcement-actions-list.md) |
| 0.5.2.1a | Enforcement action detail page | Action information, workflow status, approval chain, violation details, appeal status, execution tracking | [Wireframe](../../04-design/user-experience/wireframes/01-rmm/enforcement/task-0.5.2.1a-enforcement-action-detail.md) |
| 0.5.2.1b | Create enforcement action wizard | Action type selection, violation selection, amount input for fines, legal basis, justification, approval workflow | [Wireframe](../../04-design/user-experience/wireframes/01-rmm/enforcement/task-0.5.2.1b-create-enforcement-action-wizard.md) |
| 0.5.2.1c | Pending approvals page | Actions pending Tier 1 approval, approval interface, bulk approval actions | [Wireframe](../../04-design/user-experience/wireframes/01-rmm/enforcement/task-0.5.2.1c-pending-approvals.md) |
| 0.5.2.1d | Enforcement reports page | Enforcement analytics, trends, action type breakdown, company compliance tracking | [Wireframe](../../04-design/user-experience/wireframes/01-rmm/enforcement/task-0.5.2.1d-enforcement-reports.md) |
| 0.5.2.1e | Appeal review interface | MOH Tier 1 - review company appeals, uphold/overturn decisions, adjustment notes | [Wireframe](../../04-design/user-experience/wireframes/01-rmm/enforcement/task-0.5.2.1e-appeal-review-interface.md) |
| 0.5.2.1f | Appeal submission form | Company users - submit appeals with grounds, explanation, supporting documents | [Wireframe](../../04-design/user-experience/wireframes/01-rmm/enforcement/task-0.5.2.1f-appeal-submission-form.md) |

### RMM Core Workflows

| Task ID | Wireframe Name | Description | Link |
|---------|----------------|-------------|------|
| 0.5.2.2 | Companies list page | Table view, filters, search, pagination, role-based actions | [Wireframe](../../04-design/user-experience/wireframes/01-rmm/companies/task-0.5.2.2-companies-list.md) |
| 0.5.2.3 | Company detail page | Information sections, tabs: Overview \| Products \| History, action buttons, related products | [Wireframe](../../04-design/user-experience/wireframes/01-rmm/companies/task-0.5.2.3-company-detail.md) |
| 0.5.2.8 | Company create/edit form | Form sections, validation, draft auto-save indicator | [Wireframe](../../04-design/user-experience/wireframes/01-rmm/companies/task-0.5.2.8-company-create-edit-form.md) |
| 0.5.2.11 | Registry submission list page | My submissions, pending approvals, status filters | [Wireframe](../../04-design/user-experience/wireframes/01-rmm/workflow/task-0.5.2.11-registry-submission-list.md) |
| 0.5.2.12 | Registry submission detail page | Submission data, workflow status indicator, approval history timeline, action buttons | [Wireframe](../../04-design/user-experience/wireframes/01-rmm/workflow/task-0.5.2.12-registry-submission-detail.md) |
| 0.5.2.13 | Registry submission workflow states | Draft, submitted, tier2_verified, tier1_approved, tier2_implemented, completed, rejected | [Wireframe](../../04-design/user-experience/wireframes/01-rmm/workflow/task-0.5.2.13-registry-submission-workflow-states.md) |

### RMM Supporting Pages

| Task ID | Wireframe Name | Description | Link |
|---------|----------------|-------------|------|
| 0.5.2.4 | Products list page | Company-scoped, filters, search, product cards/table | [Wireframe](../../04-design/user-experience/wireframes/01-rmm/products/task-0.5.2.4-products-list.md) |
| 0.5.2.5 | Product detail page | Product info, tabs: Overview \| SKUs \| History, related submissions | [Wireframe](../../04-design/user-experience/wireframes/01-rmm/products/task-0.5.2.5-product-detail.md) |
| 0.5.2.6 | SKUs list page | Product-scoped, filters, pharmaceutical attributes display | [Wireframe](../../04-design/user-experience/wireframes/01-rmm/skus/task-0.5.2.6-skus-list.md) |
| 0.5.2.7 | SKU detail page | SKU information, tabs: Overview \| History, pharmaceutical attributes: dosage_strength, dosage_form, pack_size, unit_of_measure | [Wireframe](../../04-design/user-experience/wireframes/01-rmm/skus/task-0.5.2.7-sku-detail.md) |
| 0.5.2.9 | Product create/edit form | Form sections, ATC code selection, validation | [Wireframe](../../04-design/user-experience/wireframes/01-rmm/products/task-0.5.2.9-product-create-edit-form.md) |
| 0.5.2.10 | SKU create/edit form | Pharmaceutical attributes: dosage_strength, dosage_form, pack_size, unit_of_measure, validation, form sections | [Wireframe](../../04-design/user-experience/wireframes/01-rmm/skus/task-0.5.2.10-sku-create-edit-form.md) |

---

## Priority 3: Critical VCI Workflows

**Rationale:** Regulatory compliance workflows — MOH priority. AAMS is annual regulatory requirement. WSL enables compliance violation detection and governance response.

### VCI AAMS (Annual Submission)

| Task ID | Wireframe Name | Description | Link |
|---------|----------------|-------------|------|
| 0.5.3.1 | AAMS submissions list page | My submissions, all submissions for MOH, year filter, status filter | [Wireframe](../../04-design/user-experience/wireframes/02-vci/aams/task-0.5.3.1-aams-submissions-list.md) |
| 0.5.3.2 | AAMS submission form | Year selection, monthly sales table with Jan-Dec columns, calculated AAMS, import/export CSV, validation | [Wireframe](../../04-design/user-experience/wireframes/02-vci/aams/task-0.5.3.2-aams-submission-form.md) |
| 0.5.3.3 | AAMS submission detail page | Submission data, calculated threshold display, workflow status, threshold visibility timing, duration type, revert date | [Wireframe](../../04-design/user-experience/wireframes/02-vci/aams/task-0.5.3.3-aams-submission-detail.md) |
| 0.5.3.4 | Threshold management page | MOH Tier 1 - threshold list, filters, bulk actions, modification interface, duration type, revert date, pending reversion indicators | [Wireframe](../../04-design/user-experience/wireframes/02-vci/aams/task-0.5.3.4-threshold-management.md) |
| 0.5.3.5 | Threshold detail page | Threshold information, modification history, related thresholds, thresholds/[id] route | [Wireframe](../../04-design/user-experience/wireframes/02-vci/aams/task-0.5.3.5-threshold-detail.md) |
| 0.5.3.6 | Threshold modification modal | Local vs global selector, B multiplier input, advisory suggestions, duration type selection: permanent/temporary, time-bound options | [Wireframe](../../04-design/user-experience/wireframes/02-vci/aams/task-0.5.3.6-threshold-modification-modal.md) |
| 0.5.3.7 | Threshold reversion review page | Tier 1 - review and confirm manual review reversions, decision options: confirm/cancel/extend, justification input | [Wireframe](../../04-design/user-experience/wireframes/02-vci/aams/task-0.5.3.7-threshold-reversion-review.md) |
| 0.5.3.8 | Pending reversions list page | All thresholds with pending reversions, filters: type/days until/company, color-coded by urgency, bulk actions | [Wireframe](../../04-design/user-experience/wireframes/02-vci/aams/task-0.5.3.8-pending-reversions-list.md) |

### VCI WSL (Weekly Compliance)

| Task ID | Wireframe Name | Description | Link |
|---------|----------------|-------------|------|
| 0.5.3.11 | WSL submissions list page | My submissions, all submissions for MOH, week filter, deadline indicators, threshold, threshold compliance %, replenishment date, compliance violation reason | [Wireframe](../../04-design/user-experience/wireframes/02-vci/wsl/task-0.5.3.11-wsl-submissions-list.md) |
| 0.5.3.12 | WSL submission form | Week ending date, all SKUs with stock quantity entry - SKU_ID + Quantity structure, threshold (read-only), threshold compliance % (calculated), replenishment date, compliance violation reason | [Wireframe](../../04-design/user-experience/wireframes/02-vci/wsl/task-0.5.3.12-wsl-submission-form.md) |
| 0.5.3.13 | WSL submission detail page | Submission data, compliance violation indicators, stock level visualization, threshold, threshold compliance %, replenishment date, compliance violation reason | [Wireframe](../../04-design/user-experience/wireframes/02-vci/wsl/task-0.5.3.13-wsl-submission-detail.md) |
| 0.5.3.14 | Compliance Violations list page | Active compliance violations, resolved compliance violations, priority/company/SKU filters, date range, replenishment date, compliance violation reason | [Wireframe](../../04-design/user-experience/wireframes/02-vci/breaches/task-0.5.3.14-compliance-violations-list.md) |
| 0.5.3.15 | Compliance Violation detail page | Compliance violation information, stock level vs threshold comparison, reason, replenishment date, priority indicator | [Wireframe](../../04-design/user-experience/wireframes/02-vci/breaches/task-0.5.3.15-compliance-violation-detail.md) |
| 0.5.3.16 | Compliance Violation analysis interface | Tier 2 - analysis form, action suggestions dropdown, comments, batch analysis option | [Wireframe](../../04-design/user-experience/wireframes/02-vci/breaches/task-0.5.3.16-compliance-violation-analysis-interface.md) |
| 0.5.3.17 | Compliance Violation action approval interface | Tier 1 - review suggestions, approve/reject/independent action, justification input | [Wireframe](../../04-design/user-experience/wireframes/02-vci/breaches/task-0.5.3.17-compliance-violation-action-approval-interface.md) |

### VCI Governance Dashboard

| Task ID | Wireframe Name | Description | Link |
|---------|----------------|-------------|------|
| 0.5.3.18 | Governance Dashboard | MOH - real-time stock sufficiency charts, compliance violation status overview, action recommendations, widget layout, pending threshold reversions metric | [Wireframe](../../04-design/user-experience/wireframes/02-vci/overview/task-0.5.3.18-governance-dashboard.md) |

---

## Priority 4: Supporting VCI & RMM

**Rationale:** Complete core modules. MSQ is monthly reporting. MOH-only pages support governance functions.

### VCI MSQ (Monthly Reporting)

| Task ID | Wireframe Name | Description | Link |
|---------|----------------|-------------|------|
| 0.5.3.9 | MSQ submissions list page | My submissions, flagged for review for MOH, month filter | [Wireframe](../../04-design/user-experience/wireframes/02-vci/msq/task-0.5.3.9-msq-submissions-list.md) |
| 0.5.3.10 | MSQ submission form | Month selection, SKU_ID + Quantity data entry only - simplified submission structure | [Wireframe](../../04-design/user-experience/wireframes/02-vci/msq/task-0.5.3.10-msq-submission-form.md) |
| 0.5.3.19 | MSQ submission detail page | Submission data, validation status indicator, review actions, 7-day grace period indicator | [Wireframe](../../04-design/user-experience/wireframes/02-vci/msq/task-0.5.3.11-msq-submission-detail.md) |
| 0.5.3.20 | MSQ correction interface | Editable submitted data, grace period countdown, correction form | [Wireframe](../../04-design/user-experience/wireframes/02-vci/msq/task-0.5.3.12-msq-correction-interface.md) |

### VCI Combined Submissions Overview

| Task ID | Wireframe Name | Description | Link |
|---------|----------------|-------------|------|
| 0.5.3.26 | VCI Submissions overview page | All current submissions - AAMS, MSQ, WSL in unified view, type filters/tabs, status filters, role-based | [Wireframe](../../04-design/user-experience/wireframes/02-vci/overview/task-0.5.3.26-vci-submissions.md) |
| 0.5.3.21 | Submission Trends Analysis page | MOH Tier 1 only - trend analysis charts, AAMS/MSQ/WSL trends, multi-year comparisons | [Wireframe](../../04-design/user-experience/wireframes/02-vci/analytics/task-0.5.3.21-submission-trends-analysis.md) |

### RMM MOH-Only Pages

| Task ID | Wireframe Name | Description | Link |
|---------|----------------|-------------|------|
| 0.5.2.14 | ATC Codes list page | MOH only, read-only for companies, search, filters | [Wireframe](../../04-design/user-experience/wireframes/01-rmm/task-0.5.2.14-atc-codes-list.md) |
| 0.5.2.15 | Critical Medicines list page | MOH Tier 1 only, designation interface, filters | [Wireframe](../../04-design/user-experience/wireframes/01-rmm/task-0.5.2.15-critical-medicines-list.md) |

### Module Overview Pages

| Task ID | Wireframe Name | Description | Link |
|---------|----------------|-------------|------|
| 0.5.2.1 | RMM overview page | Module summary, quick links, recent activity, statistics | [Wireframe](../../04-design/user-experience/wireframes/01-rmm/overview/task-0.5.2.1-rmm-overview.md) |
| 0.5.3.0 | VCI overview page | Module summary, submission overview, compliance violation alerts, quick links | [Wireframe](../../04-design/user-experience/wireframes/02-vci/overview/task-0.5.3.0-vci-overview.md) |

---

## Priority 5: ECS Module

**Rationale:** Export control — depends on RMM + VCI. Export workflow is critical for regulatory compliance.

### ECS Core Workflows

| Task ID | Wireframe Name | Description | Link |
|---------|----------------|-------------|------|
| 0.5.4.1 | Export requests list page | My requests, pending approvals for MOH, status filters | [Wireframe](../../04-design/user-experience/wireframes/03-ecs/export-requests/task-0.5.4.1-export-requests-list.md) |
| 0.5.4.2 | Export request form | SKU selection, destination, timeline, documentation upload, file upload component | [Wireframe](../../04-design/user-experience/wireframes/03-ecs/export-requests/task-0.5.4.2-export-request-form.md) |
| 0.5.4.3 | Export request detail page | Request data, evaluation status, threshold comparison card: current stock vs VCI threshold vs ECS threshold | [Wireframe](../../04-design/user-experience/wireframes/03-ecs/export-requests/task-0.5.4.3-export-request-detail.md) |
| 0.5.4.4 | Export workflow actions | Submit, verify, approve, reject, intervene buttons - role-based, intervention window indicator | [Wireframe](../../04-design/user-experience/wireframes/03-ecs/export-requests/task-0.5.4.4-export-workflow-actions.md) |
| 0.5.4.5 | Export authorizations list page | Active authorizations, expired authorizations, validity filters | [Wireframe](../../04-design/user-experience/wireframes/03-ecs/authorizations/task-0.5.4.5-export-authorizations-list.md) |
| 0.5.4.6 | Export authorization detail page | Authorization details, validity period indicator, 90-day countdown, expiration warnings, threshold status | [Wireframe](../../04-design/user-experience/wireframes/03-ecs/authorizations/task-0.5.4.6-export-authorization-detail.md) |

### ECS Supporting

| Task ID | Wireframe Name | Description | Link |
|---------|----------------|-------------|------|
| 0.5.4.7 | Export completion reporting interface | Completion form, actual export details, shipping info | [Wireframe](../../04-design/user-experience/wireframes/03-ecs/authorizations/task-0.5.4.7-export-completion-reporting.md) |
| 0.5.4.8 | Replenishment schedule tracking interface | Schedule timeline visualization, delay indicators, escalation stages | [Wireframe](../../04-design/user-experience/wireframes/03-ecs/replenishment/task-0.5.4.8-replenishment-schedule-tracking.md) |
| 0.5.4.0 | ECS overview page | Module summary, export requests overview, authorization status, quick links | [Wireframe](../../04-design/user-experience/wireframes/03-ecs/overview/task-0.5.4.0-ecs-overview.md) |

---

## Priority 6: CMC Module

**Rationale:** Compliance monitoring — depends on other modules. Compliance scoring and disputes are regulatory requirements.

### CMC Core Workflows

| Task ID | Wireframe Name | Description | Link |
|---------|----------------|-------------|------|
| 0.5.5.1 | Compliance scores list page | My score for companies, all scores for MOH, period filter | [Wireframe](../../04-design/user-experience/wireframes/04-cmc/scores/task-0.5.5.1-compliance-scores-list.md) |
| 0.5.5.2 | Compliance score detail page | Total score visualization, component breakdown chart/gauge, category-level tips for companies, formulas/weights hidden | [Wireframe](../../04-design/user-experience/wireframes/04-cmc/scores/task-0.5.5.2-compliance-score-detail.md) |
| 0.5.5.4 | Score review - Tier 2 flag anomalies modal | Quick action, contextual to score detail, flag anomalies interface | [Wireframe](../../04-design/user-experience/wireframes/04-cmc/scores/task-0.5.5.4-score-review-tier2-flag-anomalies.md) |
| 0.5.5.5 | Score review - Tier 1 override modal | Justification input, quick action, contextual to score detail | [Wireframe](../../04-design/user-experience/wireframes/04-cmc/scores/task-0.5.5.5-score-review-tier1-override.md) |
| 0.5.5.6 | Compliance Disputes list page | My compliance disputes for companies, all compliance disputes for MOH, status filters, date filters | [Wireframe](../../04-design/user-experience/wireframes/04-cmc/disputes/task-0.5.5.6-compliance-disputes-list.md) |
| 0.5.5.7 | Dispute detail page | Dispute information, evidence display, review status, dispute details route | [Wireframe](../../04-design/user-experience/wireframes/04-cmc/disputes/task-0.5.5.7-dispute-detail.md) |
| 0.5.5.8 | Dispute creation interface | Companies - 30-day window indicator, dispute form, component selection, evidence upload | [Wireframe](../../04-design/user-experience/wireframes/04-cmc/disputes/task-0.5.5.8-dispute-creation-interface.md) |
| 0.5.5.9 | Dispute review interface | Tier 2 - review, Tier 1 - resolution with adjustment notes, dispute details | [Wireframe](../../04-design/user-experience/wireframes/04-cmc/disputes/task-0.5.5.9-dispute-review-interface.md) |

### CMC Supporting

| Task ID | Wireframe Name | Description | Link |
|---------|----------------|-------------|------|
| 0.5.5.3 | Leaderboard page | Anonymized for companies - percentile/rank band, full for Tier 1, oversight for Tier 2 | [Wireframe](../../04-design/user-experience/wireframes/04-cmc/scores/task-0.5.5.3-leaderboard.md) |
| 0.5.5.10 | Reports list page | Report types, status, download actions, period filters | [Wireframe](../../04-design/user-experience/wireframes/04-cmc/reports/task-0.5.5.10-reports-list.md) |
| 0.5.5.11 | Report detail page | PDF viewer, data tables, charts, download action | [Wireframe](../../04-design/user-experience/wireframes/04-cmc/reports/task-0.5.5.11-report-detail.md) |
| 0.5.5.12 | Report review/approval interface | Tier 2 review checklist, Tier 1 approval actions | [Wireframe](../../04-design/user-experience/wireframes/04-cmc/reports/task-0.5.5.12-report-review-approval-interface.md) |
| 0.5.5.0 | CMC overview page | Module summary, compliance overview, score trends, quick links | [Wireframe](../../04-design/user-experience/wireframes/04-cmc/overview/task-0.5.5.0-cmc-overview.md) |

---

## Priority 7: Global & Help Pages

**Rationale:** Global section pages and Help & Info pages needed for complete navigation. Can be done in parallel with development but should be wireframed for consistency.

### Global Section Pages (Additional)

| Task ID | Wireframe Name | Description | Link |
|---------|----------------|-------------|------|
| 0.5.1.36 | Archived conversations page | Archived conversations list, restore option, filters, 7-year retention period indicators, retention status information | [Wireframe](../../04-design/user-experience/wireframes/00-core-foundation/communications/task-0.5.1.36-archived-conversations.md) |

### Help & Info Section Pages

| Task ID | Wireframe Name | Description | Link |
|---------|----------------|-------------|------|
| 0.5.1.37 | Support center page | Support options, help sections, contact links, support hours | [Wireframe](../../04-design/user-experience/wireframes/00-core-foundation/public-pages/task-0.5.1.37-support-center.md) |
| 0.5.1.38 | FAQ page | Searchable questions, categories, expandable answers, search functionality | [Wireframe](../../04-design/user-experience/wireframes/00-core-foundation/public-pages/task-0.5.1.38-faq-page.md) |
| 0.5.1.39 | Contact support page | Contact form, support channels, response time info, escalation procedures | [Wireframe](../../04-design/user-experience/wireframes/00-core-foundation/public-pages/task-0.5.1.39-contact-support.md) |
| 0.5.1.40 | Documentation page | User guides, documentation sections, search, API documentation links | [Wireframe](../../04-design/user-experience/wireframes/00-core-foundation/public-pages/task-0.5.1.40-documentation.md) |
| 0.5.1.41 | System status page | System health, incident history, status indicators, maintenance schedule | [Wireframe](../../04-design/user-experience/wireframes/00-core-foundation/public-pages/task-0.5.1.41-system-status.md) |

### Public Pages

| Task ID | Wireframe Name | Description | Link |
|---------|----------------|-------------|------|
| 0.5.1.1 | Public homepage | MOH mission focus, navigation, CTA, partnership info | [Wireframe](../../04-design/user-experience/wireframes/00-core-foundation/public-pages/task-0.5.1.1-public-homepage.md) |
| 0.5.1.2 | About page | MOH regulatory mission, framework overview, partnership info, contact information | [Wireframe](../../04-design/user-experience/wireframes/00-core-foundation/public-pages/task-0.5.1.2-about-page.md) |

### Legal Pages

| Task ID | Wireframe Name | Description | Link |
|---------|----------------|-------------|------|
| 0.5.1.7 | Terms of service page | Legal text, sections, acceptance checkbox | [Wireframe](../../04-design/user-experience/wireframes/00-core-foundation/public-pages/task-0.5.1.7-terms-of-service.md) |
| 0.5.1.8 | Privacy policy page | Privacy information, data handling, sections, GDPR compliance | [Wireframe](../../04-design/user-experience/wireframes/00-core-foundation/public-pages/task-0.5.1.8-privacy-policy.md) |
| 0.5.1.9 | Cookie policy page | Cookie information, consent management, sections, opt-out options | [Wireframe](../../04-design/user-experience/wireframes/00-core-foundation/public-pages/task-0.5.1.9-cookie-policy.md) |

### Authentication Supporting

| Task ID | Wireframe Name | Description | Link |
|---------|----------------|-------------|------|
| 0.5.1.12 | Registration page | Form fields, validation indicators, terms acceptance | [Wireframe](../../04-design/user-experience/wireframes/00-core-foundation/authentication/task-0.5.1.12-registration-page.md) |
| 0.5.1.13 | Forgot password / Reset password flow | Forgot password page, reset password page, email confirmation | [Wireframe](../../04-design/user-experience/wireframes/00-core-foundation/authentication/task-0.5.1.13-forgot-reset-password.md) |

### Dashboard Utilities

| Task ID | Wireframe Name | Description | Link |
|---------|----------------|-------------|------|
| 0.5.1.22 | Profile page | User information, account settings, password change, preferences, user menu integration | [Wireframe](../../04-design/user-experience/wireframes/00-core-foundation/dashboard/task-0.5.1.22-profile-page.md) |

---

## Priority 8: Analytics & Historical Data

**Rationale:** Nice-to-have for MVP — can defer if timeline is tight. Analytics and historical data are valuable but not critical for MVP.

**Wireframe Specifications:**
- [Analytics Wireframes](../../04-design/user-experience/wireframes/02-vci/analytics/README.md)
- [Historical Data Wireframes](../../04-design/user-experience/wireframes/05-audit-historical/historical-data/README.md)
- [Modal Wireframes](../../04-design/user-experience/wireframes/07-modals/README.md)

### Analytics (VCI Treemap)

| Task ID | Wireframe Name | Description | Link |
|---------|----------------|-------------|------|
| 0.5.3.22 | ATC Treemap page | Level 1 - % total stock level compliance violations by therapeutic area/ATC code, clickable tiles, filters: critical medicines/date range | [Wireframe](../../04-design/user-experience/wireframes/02-vci/analytics/task-0.5.3.22-atc-treemap.md) |
| 0.5.3.23 | Products Treemap page | Level 2 - % total stock level compliance violations by product within selected ATC, drill-down from ATC, back navigation, breadcrumbs | [Wireframe](../../04-design/user-experience/wireframes/02-vci/analytics/task-0.5.3.23-products-treemap.md) |
| 0.5.3.24 | Dosage/Forms Modal | Level 3 - table showing dosage/form with % compliance, expandable rows, modal overlay, no route change | [Wireframe](../../04-design/user-experience/wireframes/02-vci/analytics/task-0.5.3.24-dosage-forms-modal.md) |
| 0.5.3.25 | SKU List expanded view | Level 4 - SKUs with compliance violation status, external link icon indicating opens in new tab, info message, modal stays open | [Wireframe](../../04-design/user-experience/wireframes/02-vci/analytics/task-0.5.3.25-sku-list-expanded.md) |
| 0.5.3.27 | SKU Action Page integration | Level 5 - uses existing SKU detail route, opens in new tab, role-based actions for Tier 1/Tier 2, query params for back navigation | [Wireframe](../../04-design/user-experience/wireframes/02-vci/analytics/task-0.5.3.27-sku-action-page-integration.md) |

### Historical Data Pages

| Task ID | Wireframe Name | Description | Link |
|---------|----------------|-------------|------|
| 0.5.3.28 | Submission history page | All past submissions, filterable by type/year/company, submission history route | [Wireframe](../../04-design/user-experience/wireframes/05-audit-historical/historical-data/task-0.5.3.28-submission-history.md) |
| 0.5.4.9 | Export history page | Historical export authorizations, filterable by date/company/status, export history route | [Wireframe](../../04-design/user-experience/wireframes/05-audit-historical/historical-data/task-0.5.4.9-export-history.md) |
| 0.5.4.10 | Historical authorization detail page | Historical authorization details, authorization history route | [Wireframe](../../04-design/user-experience/wireframes/05-audit-historical/historical-data/task-0.5.4.10-historical-authorization-detail.md) |
| 0.5.5.13 | Compliance scores history page | Historical compliance scores, filterable by date/company, scores history route | [Wireframe](../../04-design/user-experience/wireframes/05-audit-historical/historical-data/task-0.5.5.13-compliance-scores-history.md) |
| 0.5.5.14 | Compliance Disputes history page | Historical compliance disputes, filterable by date/company/status, compliance disputes history route | [Wireframe](../../04-design/user-experience/wireframes/05-audit-historical/historical-data/task-0.5.5.14-compliance-disputes-history.md) |

### Modal & Dialog Wireframes (Reusable UI Patterns)

**Note:** Some modals are already included in their respective module sections (e.g., Threshold modification modal in VCI, Score review modals in CMC). These are additional reusable modal patterns.

| Task ID | Wireframe Name | Description | Link |
|---------|----------------|-------------|------|
| 0.5.8.1 | Confirmation modal | Delete, archive, approve, reject actions - confirmation message, cancel/confirm buttons | [Wireframe](../../04-design/user-experience/wireframes/07-modals/task-0.5.8.1-confirmation-modal.md) |
| 0.5.8.2 | File upload modal | Drag-drop interface, file list, progress indicators, validation errors | [Wireframe](../../04-design/user-experience/wireframes/07-modals/task-0.5.8.2-file-upload-modal.md) |
| 0.5.8.3 | Date range picker modal | Calendar interface, quick filters, timezone display | [Wireframe](../../04-design/user-experience/wireframes/07-modals/task-0.5.8.3-date-range-picker-modal.md) |
| 0.5.8.4 | User/Company picker modal | Search, filters, multi-select, role-based filtering | [Wireframe](../../04-design/user-experience/wireframes/07-modals/task-0.5.8.4-user-company-picker-modal.md) |
| 0.5.8.5 | Export options modal | Format selection, date range, progress indicator, download link | [Wireframe](../../04-design/user-experience/wireframes/07-modals/task-0.5.8.5-export-options-modal.md) |
| 0.5.8.6 | Quick history preview modal | Recent changes timeline, "View Full History" button | [Wireframe](../../04-design/user-experience/wireframes/07-modals/task-0.5.8.6-quick-history-preview-modal.md) |
| 0.5.8.7 | Comparison modal | Current vs historical side-by-side, highlight differences | [Wireframe](../../04-design/user-experience/wireframes/07-modals/task-0.5.8.7-comparison-modal.md) |
| 0.5.8.8 | Detail inspection modal | Quick detail view from list, "View Full Page" button | [Wireframe](../../04-design/user-experience/wireframes/07-modals/task-0.5.8.8-detail-inspection-modal.md) |
| 0.5.8.9 | Message attachment viewer modal | Image preview, document viewer, download actions | [Wireframe](../../04-design/user-experience/wireframes/07-modals/task-0.5.8.9-message-attachment-viewer-modal.md) |
| 0.5.8.10 | Workflow status modal | Workflow progress, approval chain, status transitions | [Wireframe](../../04-design/user-experience/wireframes/07-modals/task-0.5.8.10-workflow-status-modal.md) |

---

## Related Documents

### Wireframe Documentation

- [Wireframes Directory](../../04-design/user-experience/wireframes/README.md) - Wireframe storage structure and organization
- [Wireframe Index](../../04-design/user-experience/wireframes/06-documentation/wireframe-index.md) - Complete index of all wireframes
- [Wireframe Navigation & Connection Map](../../04-design/user-experience/wireframes/06-documentation/wireframe-navigation-connection-map.md) - Complete navigation flow mapping showing all page connections
- [Wireframe Annotations](../../04-design/user-experience/wireframes/06-documentation/wireframe-annotations.md) - Detailed annotations and interactions
- [Component Mapping](../../04-design/user-experience/wireframes/06-documentation/wireframe-to-component-mapping.md) - Wireframe to UI component mappings
- [Design Tool Links](../../04-design/user-experience/wireframes/06-documentation/design-tool-links.md) - External design tool links (includes Miro flow diagram)

### Phase Integration

- [Phase 1 Implementation Plan](Phase-1-Implementation-Plan.md) - Implementation plan with wireframe references
- [Wireframe-First Implementation Principle](wireframe-first-implementation-principle.md) - Core implementation directive
- [Phase 0: Technical Foundation](phase-0-technical-foundation.md)
- [Phase 0.6: Database Schema Audit](phase-0-6-databases.md)

### Architecture & Design References

- [Communication Channels Requirements](../../02-architecture/communication-channels-requirements.md) - Communication system requirements and design
- [Communication Channels Lifecycle](../../02-architecture/communication-channels-lifecycle.md) - Communications lifecycle states, transitions, and UI status indicators
- [UI Component Specifications](../../02-architecture/frontend/ui-component-specifications.md)
- [Form Design Patterns](../../02-architecture/frontend/form-design-patterns.md)
- [Role-Based UI Patterns](../../02-architecture/frontend/role-based-ui-patterns.md)
- [Navigation & Layout Patterns](../../02-architecture/frontend/navigation-layout-patterns.md)
- [Routing Structure](../../02-architecture/frontend/routing-structure.md)
- [Design System](../../02-architecture/frontend/design-system.md)
- [State Management UI Patterns](../../02-architecture/frontend/state-management-ui-patterns.md)

---

**Owner:** Emma (UI/UX + Next.js Frontend Specialist)
