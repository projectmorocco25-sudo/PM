# Team Suggestions Checklist

**Purpose:** Track implementation of items recommended by the team (Sami / Oliver / Emma) in [outstanding-scope-and-sequencing.md](./outstanding-scope-and-sequencing.md) and [pm_agent_team.md](../../.cursor/rules/pm_agent_team.md).  
**Last Updated:** 2026-01-29  
**Related:** [outstanding-scope-and-sequencing.md](./outstanding-scope-and-sequencing.md) §5 Suggested Order of Work

---

## Implementable Now (dependencies met)

| # | Item | Source | Owner | Status | Notes |
|---|------|--------|-------|--------|-------|
| 1 | **Dashboard Activity tab** | §1.1 Company Dashboard (task-0.5.1.18); §5 step 3 | Emma (UI) | Done | Uses `shared_get_history` (1.1.1.20). Filters: All / Submissions / Messages / Enforcement; date range; list with View Details. |
| 2 | **Pending Approvals urgency gauge** | §4.2 Enforcement dashboard (task-0.5.2.0) | Emma (UI) | Done | Wireframe: circular/linear gauge (e.g. pending/10), green/yellow/red, "Urgency: High/Medium/Low". No backend. |
| 3 | **Layout-level breadcrumbs** | §3.1 Core Layout (1.1.1.9) | Emma (UI) | Done | Centralise breadcrumbs in dashboard layout; path-derived. |

---

## Complete Before (per §5 order)

| # | Item | Blocked by | Owner |
|---|------|------------|-------|
| 4 | Dashboard **Submissions** tab | 1.1.2.6–1.1.2.11, list registry submissions RPC; VCI when Phase 1.2 | Oliver / Emma |
| 5 | Dashboard **Enforcement** tab | 1.1.2.31–1.1.2.36, 1.1.2.37 list APIs | Oliver / Emma |
| 6 | Enforcement Trends chart (30 days) | Chart library; optional RPC | Emma / Oliver |
| 7 | Violation Types chart | Chart library; RPC or query; system_config ECS/CMC | Emma / Oliver |
| 8 | **Action Type pie/donut chart** | — | ✅ **Done** (2026-01-29). Recharts donut + cards on Enforcement dashboard. |
| 9 | Pending item deadline/urgency indicators | Optional SLA/deadline on enforcement_actions | Nadia / Oliver |
| 10 | Follow-up entity & RPCs | New data model (MOH T1/T2 follow-ups) | Nadia / Maya |
| 11 | **Critical Medicines – justification** (Remove/Designate) | — | ✅ **Done** (2026-01-29). Migration 20260129140000; Remove/Designate modals with required justification. |
| 12 | VCI/CMC dashboard widgets | Phase 1.2 / 1.4 | — |

---

## Verification

- [ ] Sami (Compliance): Activity tab, urgency gauge, and layout breadcrumbs align with wireframes and §5 order.
- [ ] Oliver (Technical): No new backend required for items 1–3; data from existing RPCs only.
- [ ] Emma (UI/UX): Activity tab and gauge match task-0.5.1.18 and task-0.5.2.0 intent.

---

## Next steps (suggested order)

| # | Item | Blocker | Action |
|---|------|---------|--------|
| 1 | ~~**Critical Medicines – justification** (§4.1)~~ | — | ✅ **Done** (2026-01-29). |
| 2 | Dashboard Submissions tab | 1.1.2.6–1.1.2.11, list RPC | Schedule after registry list RPC. |
| 3 | Dashboard Enforcement tab | 1.1.2.37 list APIs | Schedule after enforcement list. |
| 4 | ~~Action Type pie/donut~~ | — | ✅ **Done** (2026-01-29). Recharts donut on Enforcement dashboard. |
| 5 | Enforcement Trends / Violation Types charts | Optional RPC for daily/violation counts | Recharts in place; add RPC when needed. |

---

## Changelog

| Date | Change |
|------|--------|
| 2026-01-29 | Initial checklist. Implemented: Dashboard Activity tab, Pending Approvals urgency gauge, layout-level breadcrumbs. |
| 2026-01-29 | Linked from outstanding-scope-and-sequencing.md; added Next steps. |
| 2026-01-29 | **Critical Medicines justification** implemented: migration 20260129140000, Remove modal (required reason), Designate modal (required justification). §4.1 closed. |
| 2026-01-29 | **Action Type pie/donut** implemented: Recharts, donut + summary cards on Enforcement dashboard (§4.2). |
