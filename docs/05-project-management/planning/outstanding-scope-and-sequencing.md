# Outstanding Scope & Sequencing

**Purpose:** Team best-practice pushback. This document records **outstanding wireframe/feature scope** (deferred or not yet scheduled) and suggests **which tasks should be completed before readdressing** each item. Use it to prioritise follow-up work and avoid implementing UI before backend or dependencies exist.

**Last Updated:** 2026-01-27  
**Status:** Living document — update as tasks complete or new gaps are identified.  
**Related:** [phase-1-1-rmm.md](../phase-1-1-rmm.md) | [dependencies.md](./dependencies.md) | [roadmap.md](./roadmap.md)

---

## How to Use This Document

1. **Before scheduling new work** on an outstanding item, check the *Complete before* column and confirm those tasks are done.
2. **When adding new tasks** to the phase registry for outstanding scope, reference this doc and satisfy the suggested sequencing.
3. **Update this file** when outstanding items are implemented (move to a “Completed” section or remove) or when new gaps are agreed with the team.

---

## 1. Dashboard Page (`/dashboard`) — Full Wireframe Scope

**Context:** Task [1.1.1.11](../phase-1-1-rmm/tasks/frontend/1.1.1.11-dashboard-page.md) is **complete** with **Overview tab only**: breadcrumbs, role-based welcome, Quick Actions dropdown, and basic cards (Companies, Products, SKUs, Recent Activity). The wireframes [task-0.5.1.18](../../04-design/user-experience/wireframes/00-core-foundation/dashboard/task-0.5.1.18-company-dashboard.md), [task-0.5.1.19](../../04-design/user-experience/wireframes/00-core-foundation/dashboard/task-0.5.1.19-moh-tier1-dashboard.md), [task-0.5.1.20](../../04-design/user-experience/wireframes/00-core-foundation/dashboard/task-0.5.1.20-moh-tier2-dashboard.md) define additional tabs, widgets, and modals that are **not** yet implemented or scheduled.

### 1.1 Company Dashboard (task-0.5.1.18)

| Outstanding item | Wireframe reference | Complete before | Notes |
|------------------|---------------------|-----------------|-------|
| **Submissions tab** | 0.5.1.18 – Submissions tab | 1.1.2.6–1.1.2.11 (registry workflow); RPC to **list** registry submissions (filter by status, company); 1.1.2.17 (Companies list) if linking to company. For **VCI** submission types (WSL, MSQ, AAMS): Phase 1.2 VCI submission workflows & list APIs. | Tab shows “My Submissions” with filter/sort, submission rows, View Details / Edit / Withdraw / Resubmit. Depends on registry + (optionally) VCI submissions. |
| **Enforcement tab** | 0.5.1.18 – Enforcement tab | 1.1.2.31–1.1.2.36 (enforcement workflow RPCs); 1.1.2.37 (Enforcement dashboard page) or equivalent **list** enforcement actions APIs; enforcement RLS. | Tab shows company’s enforcement actions, filter by type/status, View Details / Appeal. |
| **Activity tab** | 0.5.1.18 – Activity tab | **Activity feed API** (e.g. `shared_get_audit_logs`–style with filters for submissions / messages / enforcement) or unified activity RPC; 1.1.1.21 (Audit logs pages) if reusing audit. | Filter: All / Submissions / Messages / Enforcement; date range; list with “View Details” etc. |
| **Regulatory Compliance Status** widget | 0.5.1.18 – Overview | Enforcement list RPC; optional compliance summary RPC. 1.1.2.31+ for enforcement data. | “Compliant / Non‑Compliant (X violations)”, active enforcement count, required actions, “View Detailed Compliance Status”. |
| **Active Enforcement Actions** widget (full) | 0.5.1.18 – Overview | Same as Enforcement tab. | List of active actions with legal basis, appeal deadline, View Details / Appeal. |
| **Key Metrics** (Compliance Score, Active Submissions, Pending Actions, Completed) | 0.5.1.18 – Key Metrics | Registry + enforcement list/count RPCs; optional aggregation RPC. | Four metric cards with counts and “View” links. |
| **Appeal Enforcement Action** modal | 0.5.1.18 – Modal | 1.1.2.35 (enforcement appeal action); enforcement RPCs. | Grounds, explanation, file upload, submit appeal. |
| **New Submission** modal (type selection) | 0.5.1.18 – Quick Actions | 1.1.2.6 (create submission); routes to WSL/MSQ/AAMS/ECS forms when those exist (Phase 1.2+). | Select type → navigate to submission form or wizard. |
| **View Enforcement Details** modal | 0.5.1.18 – Modal | Enforcement get-by-id or detail RPC; 1.1.2.31+. | Full action details, timeline, appeal info, Download / Print / Appeal. |

### 1.2 MOH Tier 1 Dashboard (task-0.5.1.19)

| Outstanding item | Wireframe reference | Complete before | Notes |
|------------------|---------------------|-----------------|-------|
| **Compliance tab** | 0.5.1.19 – Compliance tab | VCI breach/compliance APIs (Phase 1.2); list unsubmitted companies; enforcement list. | Critical Medicine Compliance, Unsubmitted Companies, CMC Low Scores (spider graph). |
| **Enforcement tab** | 0.5.1.19 – Enforcement tab | 1.1.2.31–1.1.2.36, 1.1.2.37; enforcement list, pending approvals. | This month / Pending approvals / Recent executions; list + Review & Approve. |
| **Modules tab** | 0.5.1.19 – Modules tab | 1.1.1.17 (System status page); `system_config` / `shared_get_module_config`; RMM/VCI/ECS/CMC module status. | RMM issues, VCI SKUs, ECS (if active), CMC (if active). |
| **Reports tab** | 0.5.1.19 – Reports tab | Governance/compliance report APIs; VCI/CMC data (Phase 1.2 / 1.4). | Data usable for governance; stock sufficiency; breach status; action recommendations; quick links. |
| **%SC (Submission Compliance)** widget | 0.5.1.19 – Overview | VCI submission + company data; %SC calculation (Phase 1.2 or CMC). | Emergency vs normal state; on‑time / late / unsubmitted breakdown. |
| **System Health** widget | 0.5.1.19 – Overview | 1.1.1.2d (`system_get_status`); optionally health checks. | Companies count, active submissions, status. |
| **Pending Approvals** (full), **Critical Compliance Violations** | 0.5.1.19 – Overview | 1.1.2.7–1.1.2.8 (verify/approve); enforcement pending-approval list; VCI breach list. | Legal basis verification, deadline countdown, priority sort. |
| **Module Activation Status** widget | 0.5.1.19 – Overview / Modules | 1.1.1.17; `system_config`; `shared_get_module_config` / `shared_activate_module`. | ECS/CMC on/off, regulatory basis, “View Config”. |
| **Pending Threshold Reversions** widget | 0.5.1.19 – Overview | Thresholds (VCI/ECS) with `duration_type`, `revert_date`; reversion list RPC. | Auto-revert / manual review counts, “Review All” link. |
| **Alert Company** modal | 0.5.1.19 – Modal | Communications RPC (e.g. `communications_create_conversation` or alert API); company context. | Template, message, email/SMS, audit log. |
| **Assign Follow-up** modal | 0.5.1.19 – Modal | **Follow-up** entity + RPC (create follow-up, assign to officer); user list for “Assign to”. | Officer, priority, due date, notes, notify, audit. |
| **Schedule Emergency Meeting** modal | 0.5.1.19 – Modal | Calendar/meeting API or placeholder; optional audit. | Date/time, attendees, location, agenda, invites. |
| **Bulk Actions** modal | 0.5.1.19 – Modal | Same as Alert / Assign Follow-up; bulk-enough APIs. | Alert All, Assign Follow-up, Export over selected companies. |
| **Quick Preview slide-over** | 0.5.1.19 – Panel | Company detail + enforcement + CMC snapshot APIs. | Company summary, recent activity, enforcement, CMC score, quick actions. |

### 1.3 MOH Tier 2 Dashboard (task-0.5.1.20)

| Outstanding item | Wireframe reference | Complete before | Notes |
|------------------|---------------------|-----------------|-------|
| **Verification tab** | 0.5.1.20 – Verification tab | 1.1.2.7 (Tier 2 verification); **list submissions pending verification** RPC; registry workflow. | Queue with filter/sort, Verify / Flag / Request Info / View Details. |
| **Follow-ups tab** | 0.5.1.20 – Follow-ups tab | Same **follow-up** entity + list RPC as MOH T1 “Assign Follow-up”. | Follow-up queue, My Active / Escalated / Resolved. |
| **Analysis tab** | 0.5.1.20 – Analysis tab | VCI breach/VCI SKU APIs; threshold reversions; report APIs (Phase 1.2+). | VCI SKUs, Breach Analysis, Pending Reversions (read‑only), Analysis reports. |
| **%SC** widget | 0.5.1.20 – Overview | Same as MOH T1. | Collapsed/expanded; “View Follow-up Queue”. |
| **Pending Verifications** widget | 0.5.1.20 – Overview | 1.1.2.7; list pending verification RPC. | Regulatory deadline indicator, urgency sort. |
| **Oversight Metrics** widget | 0.5.1.20 – Overview | Verification rate / avg time metrics (from registry or dedicated RPC). | Verification rate, avg time, trend. |
| **Review Queue** widget | 0.5.1.20 – Overview | Same as Verification tab; sort by regulatory deadline. | List with deadline, priority, [Verify]. |
| **Verify Submission** modal | 0.5.1.20 – Modal | 1.1.2.7; submission detail RPC. | Checklist, Approve / Reject / Request Info, notes. |
| **Flag Submission** modal | 0.5.1.20 – Modal | **Flag** RPC (or extension of verification workflow); audit. | Reason, description, severity, notify, escalate. |
| **Request Information** modal | 0.5.1.20 – Modal | Communications RPC; link to submission. | Info needed, message, due date, pause verification. |
| **Start Follow-up** modal | 0.5.1.20 – Modal | Same follow-up APIs as MOH T1. | Assign to self, priority, due date, actions, notes. |
| **Escalate to Tier 1** modal | 0.5.1.20 – Modal | Escalation RPC; transfer follow-up to Tier 1; notify. | Reason, details, assign to Tier 1 team. |

---

## 2. Other Outstanding Items

### 2.1 Core Layout & Navigation (from 1.1.1.9)

| Outstanding item | Wireframe reference | Complete before | Notes |
|------------------|---------------------|-----------------|-------|
| **Breadcrumbs** (layout-level) | 0.5.1.14 | None (page-level breadcrumbs exist on dashboard). | Optional: centralise in layout; currently deferred to per-page. |
| **Header search** (full-screen modal on mobile) | 0.5.1.15 | Search API or scope definition (global search vs module-specific). | Search trigger exists; modal + results not implemented. |

### 2.2 Placeholder / Help Routes

| Outstanding item | Wireframe reference | Complete before | Notes |
|------------------|---------------------|-----------------|-------|
| **Help & Support** (`/help/support`) | Support center wireframes | 1.1.1.15 (Support center pages) when scoped. | Currently placeholder; Quick Actions links here. |

---

## 3. Summary: Suggested Order of Work

To minimise rework and support full dashboard wireframe scope:

1. **Registry & enforcement backend**  
   Complete 1.1.2.6–1.1.2.11 (registry workflow), 1.1.2.31–1.1.2.36 (enforcement), and any **list** RPCs for submissions and enforcement.

2. **Enforcement dashboard & list UIs**  
   Complete 1.1.2.37 (Enforcement dashboard) and any enforcement list/detail views used by both enforcement module and dashboard.

3. **Activity feed**  
   Define and implement an activity-feed or audit-style API (filters: submissions / messages / enforcement) so the dashboard Activity tab can be built.

4. **Follow-up entity & RPCs**  
   Add follow-up data model and RPCs (create, list, assign, escalate) if MOH T1/T2 follow-up flows are in scope.

5. **VCI & CMC**  
   Phase 1.2 (VCI) and 1.4 (CMC) deliver %SC, compliance, thresholds, breaches. Dashboard %SC and related widgets depend on these.

6. **Dashboard follow-up tasks**  
   Add explicit tasks (e.g. “Dashboard – Submissions tab”, “Dashboard – Enforcement tab”, “Dashboard – Company/MOH modals”) **after** the above are done, and link them to this document.

---

## 4. Changelog

| Date | Change |
|------|--------|
| 2026-01-27 | Initial version. Dashboard (0.5.1.18–0.5.1.20) outstanding scope plus layout/search/help items; suggested sequencing. |

---

**Maintained by:** Team (Sami / Oliver / Emma). Update this file when closing gaps or when new outstanding scope is agreed.
