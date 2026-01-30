# Outstanding Scope & Sequencing

**Purpose:** Team best-practice pushback. This document records **outstanding wireframe/feature scope** (deferred or not yet scheduled) and suggests **which tasks should be completed before readdressing** each item. Use it to prioritise follow-up work and avoid implementing UI before backend or dependencies exist.

**Last Updated:** 2026-01-29  
**Status:** Living document — update as tasks complete or new gaps are identified.  
**Related:** [phase-1-1-rmm.md](../phase-1-1-rmm.md) | [dependencies.md](./dependencies.md) | [roadmap.md](./roadmap.md) | [team-suggestions-checklist.md](./team-suggestions-checklist.md) (implementation tracking)

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
| **Activity tab** | 0.5.1.18 – Activity tab | ~~**`shared_get_history`** (done)~~ | ✅ **Implemented** (2026-01-29). Dashboard tab uses `shared_get_history`; date range; filter All/Submissions/Audit; list with View Details → `/history`. See [team-suggestions-checklist.md](./team-suggestions-checklist.md). |
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

## 2. Recently Completed (Update Sequencing / Dependencies)

| Completed item | Task | Notes |
|----------------|------|-------|
| **History overview** (`/history`) | 1.1.1.20 | Implemented. RPC `shared_get_history` (role-based: MOH → audit_logs, Company → registry_submissions). Date range, filters, timeline, Load More. |
| **Audit Logs pages** (`/audit/logs`, `/audit/logs/[id]`, `/audit/reports`) | 1.1.1.21 | List (filters, compliance banner, pagination, Export → reports), Detail (old/new values, hash chain), Reports (Generate modal, CSV download). APIs: `shared_get_audit_logs`, `shared_get_audit_log_detail`, `shared_generate_audit_report`. MOH/Auditors only (`view_audit_logs`). |

Use `shared_get_history` where a unified history/activity feed is needed (e.g. dashboard Activity tab). Use audit list/detail/reports (1.1.1.21) for MOH/auditor audit views; dashboard Activity tab or other UIs can link to `/audit/logs` or `/audit/reports` where appropriate.

---

## 3. Other Outstanding Items

### 3.1 Core Layout & Navigation (from 1.1.1.9)

| Outstanding item | Wireframe reference | Complete before | Notes |
|------------------|---------------------|-----------------|-------|
| **Breadcrumbs** (layout-level) | 0.5.1.14 | None | ✅ **Implemented** (2026-01-29). Path-derived breadcrumbs in dashboard layout (`Breadcrumbs` in `DashboardShell`). See [team-suggestions-checklist.md](./team-suggestions-checklist.md). |
| **Header search** (full-screen modal on mobile) | 0.5.1.15 | Search API or scope definition (global search vs module-specific). | Search trigger exists; modal + results not implemented. |

### 3.2 Placeholder / Help Routes

| Outstanding item | Wireframe reference | Complete before | Notes |
|------------------|---------------------|-----------------|-------|
| **Help & Support** (`/help/support`) | Support center wireframes | 1.1.1.15 (Support center pages) when scoped. | Currently placeholder; Quick Actions links here. |

---

## 4. Deferred from Phase 1.1 RMM / Enforcement Tasks

Items explicitly deferred during implementation of Phase 1.1 tasks (1.1.2.29, 1.1.2.30, 1.1.2.37). Wireframes define them; implementation delivered core scope only.

### 4.1 Critical Medicines (Task 1.1.2.30)

| Outstanding item | Wireframe reference | Complete before | Notes |
|------------------|---------------------|-----------------|-------|
| **Remove designation – justification** | task-0.5.2.15 – Remove flow | — | ✅ **Implemented** (2026-01-29). Migration `20260129140000_critical_medicines_justification.sql`: `p_justification` on `rmm_update_critical_medicine`; column `justification` on `critical_medicines`. Remove modal has required "Reason for removal" field. See [team-suggestions-checklist.md](./team-suggestions-checklist.md). |
| **Designate – justification** | task-0.5.2.15 – Designate flow | — | ✅ **Implemented** (2026-01-29). `rmm_create_critical_medicine` accepts `p_justification`; Designate flow opens modal with required "Justification" textarea before submit. See [team-suggestions-checklist.md](./team-suggestions-checklist.md). |

### 4.2 Enforcement Dashboard (Task 1.1.2.37)

| Outstanding item | Wireframe reference | Complete before | Notes |
|------------------|---------------------|-----------------|-------|
| **Enforcement Trends (Last 30 Days)** | task-0.5.2.0 – Trends section | Chart library (e.g. Recharts); optional RPC for daily counts by action type. | Multi-line chart: X = days 1–30, Y = count; lines for Warning (yellow), Fine (orange), Suspension (red). Hover tooltip; "View Full Trends Report" → `/enforcement/reports`. Not implemented (no chart library in project). |
| **Violation Types (Last 30 Days)** | task-0.5.2.0 – Violation Types section | Chart library; RPC or query for violation_type counts (last 30d); `system_config` for ECS/CMC activation. | Horizontal bar chart: violation type (with DMP Art. ref + "View Regulation") vs count; sorted by frequency. Conditional bars: Export Violation (if ECS active), Data Quality Issue (if CMC active). Module check: `system_config` ecs.is_active, cmc.is_active. Not implemented. |
| **Action Type Breakdown – chart** | task-0.5.2.0 – Action Type Breakdown | — | ✅ **Implemented** (2026-01-29). Recharts donut + summary cards; Warning/Fine/Suspension with tooltip and legend. "Click segment to filter" deferred. See [team-suggestions-checklist.md](./team-suggestions-checklist.md). |
| **Pending Approvals – urgency gauge** | task-0.5.2.0 – Pending widget | None | ✅ **Implemented** (2026-01-29). Linear gauge pending/10, green/yellow/red, "Urgency: Low/Medium/High" in Enforcement dashboard. See [team-suggestions-checklist.md](./team-suggestions-checklist.md). |
| **Pending item – deadline/urgency indicators** | task-0.5.2.0 – Pending list | Optional: approval SLA or deadline field on enforcement_actions. | Wireframe: "⚠️ [X]d deadline", 🔴 &lt;3d / 🟡 3–7d / 🟢 &gt;7d. Requires deadline/SLA definition and data; current list has no deadline display. |

---

## 5. Summary: Suggested Order of Work

To minimise rework and support full dashboard wireframe scope:

1. **Registry & enforcement backend**  
   Complete 1.1.2.6–1.1.2.11 (registry workflow), 1.1.2.31–1.1.2.36 (enforcement), and any **list** RPCs for submissions and enforcement.

2. **Enforcement dashboard & list UIs**  
   Complete 1.1.2.37 (Enforcement dashboard) and any enforcement list/detail views used by both enforcement module and dashboard. **Done:** Urgency gauge (§4.2), Action Type pie/donut (§4.2). **Deferred:** Trends chart, Violation Types chart, deadline indicators (§4.2).

3. **Activity feed**  
   ✅ **Done.** Dashboard Activity tab implemented (2026-01-29) using `shared_get_history` (1.1.1.20). Extend filters (e.g. messages) if needed later.

4. **Follow-up entity & RPCs**  
   Add follow-up data model and RPCs (create, list, assign, escalate) if MOH T1/T2 follow-up flows are in scope.

5. **VCI & CMC**  
   Phase 1.2 (VCI) and 1.4 (CMC) deliver %SC, compliance, thresholds, breaches. Dashboard %SC and related widgets depend on these.

6. **Dashboard follow-up tasks**  
   Add explicit tasks (e.g. “Dashboard – Submissions tab”, “Dashboard – Enforcement tab”, “Dashboard – Company/MOH modals”) **after** the above are done, and link them to this document.

---

## 6. What Still Needs to Be Implemented

This section consolidates **all outstanding items** (not yet implemented). Use the *Blocked by* column to prioritise; implement backend/list RPCs first, then UI that consumes them. See §1–§4 for full notes and wireframe references.

### 6.1 Company Dashboard (`/dashboard` — task-0.5.1.18)

| Item | Blocked by |
|------|------------|
| **Submissions tab** | 1.1.2.6–1.1.2.11; list registry submissions RPC (filter by status, company); 1.1.2.17. VCI: Phase 1.2. |
| **Enforcement tab** | 1.1.2.31–1.1.2.36, 1.1.2.37; list enforcement actions APIs; enforcement RLS. |
| **Regulatory Compliance Status** widget | Enforcement list RPC; optional compliance summary RPC. |
| **Active Enforcement Actions** widget (full) | Same as Enforcement tab. |
| **Key Metrics** (Compliance Score, Active Submissions, Pending Actions, Completed) | Registry + enforcement list/count RPCs; optional aggregation RPC. |
| **Appeal Enforcement Action** modal | 1.1.2.35; enforcement RPCs. |
| **New Submission** modal (type selection) | 1.1.2.6; routes to WSL/MSQ/AAMS/ECS when Phase 1.2+. |
| **View Enforcement Details** modal | Enforcement get-by-id/detail RPC; 1.1.2.31+. |

### 6.2 MOH Tier 1 Dashboard (task-0.5.1.19)

| Item | Blocked by |
|------|------------|
| **Compliance tab** | VCI breach/compliance APIs (Phase 1.2); list unsubmitted companies; enforcement list. |
| **Enforcement tab** | 1.1.2.31–1.1.2.36, 1.1.2.37; enforcement list, pending approvals. |
| **Modules tab** | 1.1.1.17; `system_config` / `shared_get_module_config`; RMM/VCI/ECS/CMC status. |
| **Reports tab** | Governance/compliance report APIs; VCI/CMC data (Phase 1.2 / 1.4). |
| **%SC (Submission Compliance)** widget | VCI submission + company data; %SC calculation (Phase 1.2 or CMC). |
| **System Health** widget | 1.1.1.2d (`system_get_status`); optionally health checks. |
| **Pending Approvals** (full), **Critical Compliance Violations** | 1.1.2.7–1.1.2.8; enforcement pending-approval list; VCI breach list. |
| **Module Activation Status** widget | 1.1.1.17; `system_config`; `shared_get_module_config` / `shared_activate_module`. |
| **Pending Threshold Reversions** widget | Thresholds (VCI/ECS) with `duration_type`, `revert_date`; reversion list RPC. |
| **Alert Company** modal | Communications RPC (e.g. `communications_create_conversation` or alert API). |
| **Assign Follow-up** modal | **Follow-up** entity + RPC (create, list, assign); user list for "Assign to". |
| **Schedule Emergency Meeting** modal | Calendar/meeting API or placeholder. |
| **Bulk Actions** modal | Same as Alert / Assign Follow-up; bulk APIs. |
| **Quick Preview slide-over** | Company detail + enforcement + CMC snapshot APIs. |

### 6.3 MOH Tier 2 Dashboard (task-0.5.1.20)

| Item | Blocked by |
|------|------------|
| **Verification tab** | 1.1.2.7; **list submissions pending verification** RPC; registry workflow. |
| **Follow-ups tab** | Follow-up entity + list RPC (same as MOH T1). |
| **Analysis tab** | VCI breach/VCI SKU APIs; threshold reversions; report APIs (Phase 1.2+). |
| **%SC** widget | Same as MOH T1. |
| **Pending Verifications** widget | 1.1.2.7; list pending verification RPC. |
| **Oversight Metrics** widget | Verification rate / avg time (registry or dedicated RPC). |
| **Review Queue** widget | Same as Verification tab; sort by regulatory deadline. |
| **Verify Submission** modal | 1.1.2.7; submission detail RPC. |
| **Flag Submission** modal | **Flag** RPC (or extension of verification workflow); audit. |
| **Request Information** modal | Communications RPC; link to submission. |
| **Start Follow-up** modal | Same follow-up APIs as MOH T1. |
| **Escalate to Tier 1** modal | Escalation RPC; transfer follow-up to Tier 1; notify. |

### 6.4 Core Layout & Navigation (1.1.1.9)

| Item | Blocked by |
|------|------------|
| **Header search** (full-screen modal on mobile) | Search API or scope definition (global vs module-specific). Search trigger exists; modal + results not implemented. |

### 6.5 Placeholder / Help Routes

| Item | Blocked by |
|------|------------|
| **Help & Support** (`/help/support`) | 1.1.1.15 (Support center pages) when scoped. Currently placeholder. |

### 6.6 Enforcement Dashboard (Task 1.1.2.37 — deferred)

| Item | Blocked by |
|------|------------|
| **Enforcement Trends (Last 30 Days)** | RPC for daily counts by action type (Recharts in place). |
| **Violation Types (Last 30 Days)** | RPC or query for violation_type counts (last 30d); `system_config` for ECS/CMC activation. |
| **Action Type – "Click segment to filter"** | UI only; optional enhancement. |
| **Pending item – deadline/urgency indicators** | Approval SLA or deadline field on `enforcement_actions`; then UI (deadline badges). |

### 6.7 Backend / data model (needed for above)

| Item | Notes |
|------|--------|
| **List registry submissions** RPC | Filter by status, company; used by Dashboard Submissions tab, Verification tab. |
| **List enforcement actions** (company-scoped) | For Company dashboard Enforcement tab and Active Enforcement Actions widget. |
| **List submissions pending verification** RPC | For MOH T2 Verification tab and Pending Verifications widget. |
| **Enforcement daily counts** RPC (optional) | For Enforcement Trends chart (last 30 days by action type). |
| **Violation type counts** RPC/query (optional) | For Violation Types chart; conditional on ECS/CMC via `system_config`. |
| **Follow-up entity + RPCs** | Create, list, assign, escalate; for MOH T1/T2 Follow-up tabs and modals. |
| **Deadline/SLA on enforcement_actions** (optional) | For Pending item deadline/urgency indicators. |
| **Search API or scope** | For Header search modal. |

---

## 7. Changelog

| Date | Change |
|------|--------|
| 2026-01-27 | Initial version. Dashboard (0.5.1.18–0.5.1.20) outstanding scope plus layout/search/help items; suggested sequencing. |
| 2026-01-27 | **History overview (1.1.1.20)** completed. Added §2 "Recently Completed"; Activity tab "Complete before" updated to reference `shared_get_history`. |
| 2026-01-27 | **Audit Logs pages (1.1.1.21)** completed. Added to §2 Recently Completed; list, detail, and reports available for MOH/auditors; dashboard or other UIs can link to audit routes. |
| 2026-01-29 | **§4 Deferred from Phase 1.1 RMM/Enforcement** added. Critical Medicines (1.1.2.30): Remove/Designate justification (wireframe-required; RPCs have no param). Enforcement dashboard (1.1.2.37): Enforcement Trends chart, Violation Types chart, Action Type pie/donut, urgency gauge, pending deadline/urgency indicators. Summary §5 updated to reference §4.2. Section numbers 4→5, 5→6. |
| 2026-01-29 | **Team suggestions implemented.** Dashboard Activity tab (§1.1), Pending Approvals urgency gauge (§4.2), layout-level breadcrumbs (§3.1). Related: [team-suggestions-checklist.md](./team-suggestions-checklist.md). §5 steps 2–3 updated (urgency gauge done; Activity tab done). |
| 2026-01-29 | **Critical Medicines justification (§4.1)** implemented. Migration `20260129140000_critical_medicines_justification.sql`: column `justification`, `p_justification` on create/update RPCs. Remove modal: required reason. Designate: modal with required justification. |
| 2026-01-29 | **Action Type Breakdown pie/donut (§4.2)** implemented. Recharts added; donut chart + summary cards on Enforcement dashboard; tooltip and legend. "Click segment to filter" deferred. |
| 2026-01-29 | **§6 What Still Needs to Be Implemented** added. Single place listing all outstanding items by area (Company dashboard, MOH T1/T2, layout, enforcement deferred, backend/data model). Changelog renumbered to §7. |

---

**Maintained by:** Team (Sami / Oliver / Emma). Update this file when closing gaps or when new outstanding scope is agreed.
