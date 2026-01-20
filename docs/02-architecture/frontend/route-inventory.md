# Frontend Route Inventory & Status

**Purpose:** Complete inventory of all routes: what exists in sidebar, documentation, and codebase. This document tracks route implementation status. For comprehensive feature tracking including Database and API references, see [feature-index.md](../feature-index.md).

**Last Updated:** 2026-01-12  
**Status:** 🔄 IN PROGRESS - Phase 1.1.1.FIX  
**Owner:** Emma (UI/UX)

---

## Route Status Legend

- ✅ **Implemented:** Route exists in codebase, matches docs, works
- ⚠️ **Mismatch:** Route exists but doesn't match docs/sidebar
- ❌ **Missing:** Route in sidebar/docs but doesn't exist in codebase
- 📋 **Planned:** Route documented but not implemented yet
- 🔄 **Placeholder:** Placeholder page created (to be implemented)

**Note:** For Database and API references for each route, see [feature-index.md](../feature-index.md). This document focuses on route implementation status.

---

## Route Status Matrix

| Route | Sidebar | Docs | Exists | Status | Wireframe | Action Required | Phase |
|-------|---------|------|--------|--------|-----------|-----------------|-------|
| `/` | ❌ | ✅ | ✅ | ✅ Implemented | ✅ task-0.5.1.1 | None | 1.1.1 |
| `/dashboard` | ✅ | ✅ | ✅ | ✅ Implemented | ✅ task-0.5.1.18/19/20 | None | 1.1.1 |
| `/auth/login` | ❌ | ✅ | ✅ | ✅ Implemented | ✅ task-0.5.1.11 | None | 1.1.1 |
| `/auth/register` | ❌ | ✅ | ✅ | ✅ Implemented | ✅ task-0.5.1.12 | None | 1.1.1 |
| `/auth/forgot-password` | ❌ | ✅ | ✅ | ✅ Implemented | ✅ task-0.5.1.13 | None | 1.1.1 |
| `/auth/reset-password` | ❌ | ✅ | ✅ | ✅ Implemented | ✅ task-0.5.1.13 | None | 1.1.1 |
| `/profile` | ❌ | ✅ | ✅ | ✅ Implemented | ✅ task-0.5.1.22 | None | 1.1.1 |
| `/communications/inbox` | ✅ | ✅ | ✅ | ✅ Implemented | ✅ task-0.5.1.24 | None | 1.1.1 |
| `/communications/inbox/[id]` | ❌ | ✅ | ✅ | ✅ Implemented | ✅ task-0.5.1.25 | None | 1.1.1 |
| `/communications/sent` | ❌ | ✅ | ✅ | ✅ Implemented | ✅ task-0.5.1.27 | None | 1.1.1 |
| `/communications/compose` | ❌ | ✅ | ✅ | ✅ Implemented | ✅ task-0.5.1.26 | None | 1.1.1 |
| `/communications/announcements` | ❌ | ✅ | ✅ | ✅ Implemented | ✅ task-0.5.1.28 | None | 1.1.1 |
| `/history` | ✅ | ✅ | ⚠️ Placeholder | ⚠️ Placeholder | 📋 task-0.5.1.30 | Wireframe required | 1.1.1.FIX |
| `/notifications` | ✅ | ✅ | ⚠️ Placeholder | ⚠️ Placeholder | 📋 task-0.5.1.31 | Wireframe required | 1.1.1.FIX |
| `/audit/logs` | ✅ | ✅ | ⚠️ Placeholder | ⚠️ Placeholder | 📋 task-0.5.1.32 | Wireframe required | 1.1.1.FIX |
| `/audit/reports` | ❌ | ✅ | ⚠️ Placeholder | ⚠️ Placeholder | 📋 task-0.5.1.34 | Wireframe required | 1.1.1.FIX |
| `/system-config` | ❌ | ✅ | ⚠️ Placeholder | ⚠️ Placeholder | 📋 task-0.5.1.35 | Wireframe required | 1.1.1.FIX |
| `/support` | ❌ | ✅ | ⚠️ Placeholder | ⚠️ Placeholder | ✅ task-0.5.1.37 | None | 1.1.1.FIX |
| `/support/faq` | ❌ | ✅ | ⚠️ Placeholder | ⚠️ Placeholder | ✅ task-0.5.1.38 | None | 1.1.1.FIX |
| `/support/contact` | ❌ | ✅ | ⚠️ Placeholder | ⚠️ Placeholder | ✅ task-0.5.1.39 | None | 1.1.1.FIX |
| `/support/documentation` | ❌ | ✅ | ⚠️ Placeholder | ⚠️ Placeholder | ✅ task-0.5.1.40 | None | 1.1.1.FIX |
| `/status` | ❌ | ✅ | ⚠️ Placeholder | ⚠️ Placeholder | ✅ task-0.5.1.41 | None | 1.1.1.FIX |
| `/rmm` | ❌ | ✅ | ⚠️ Placeholder | ⚠️ Placeholder | ✅ task-0.5.2.16 | None | 1.1.1.FIX |
| `/rmm/companies` | ✅ | ✅ | ⚠️ Placeholder | ⚠️ Placeholder | ✅ task-0.5.2.2 | None | 1.1.1.FIX |
| `/rmm/products` | ✅ | ✅ | ⚠️ Placeholder | ⚠️ Placeholder | ✅ task-0.5.2.4 | None | 1.1.1.FIX |
| `/rmm/skus` | ✅ | ✅ | ⚠️ Placeholder | ⚠️ Placeholder | ✅ task-0.5.2.6 | None | 1.1.1.FIX |
| `/vci` | ❌ | ✅ | ⚠️ Placeholder | ⚠️ Placeholder | 📋 task-0.5.3.0 | Wireframe required | 1.1.1.FIX |
| `/vci/submissions/aams` | ❌ | ✅ | ⚠️ Placeholder | ⚠️ Placeholder | ✅ task-0.5.3.1 | None | 1.1.1.FIX |
| `/vci/submissions/msq` | ❌ | ✅ | ⚠️ Placeholder | ⚠️ Placeholder | ✅ task-0.5.3.7 | None | 1.1.1.FIX |
| `/vci/submissions/wsl` | ❌ | ✅ | ⚠️ Placeholder | ⚠️ Placeholder | ✅ task-0.5.3.13 | None | 1.1.1.FIX |
| `/vci/submissions/history` | ❌ | ✅ | ⚠️ Placeholder | ⚠️ Placeholder | ✅ task-0.5.3.28 | None | 1.1.1.FIX |
| `/vci/thresholds` | ✅ | ✅ | ⚠️ Placeholder | ⚠️ Placeholder | ✅ task-0.5.3.4 | None | 1.1.1.FIX |
| `/vci/breaches` | ✅ | ✅ | ⚠️ Placeholder | ⚠️ Placeholder | ✅ task-0.5.3.14 | None | 1.1.1.FIX |
| `/vci/governance` | ✅ | ✅ | ⚠️ Placeholder | ⚠️ Placeholder | ✅ task-0.5.3.18 | None | 1.1.1.FIX |
| `/ecs` | ❌ | ✅ | ⚠️ Placeholder | ⚠️ Placeholder | 📋 task-0.5.4.0 | Wireframe required | 1.1.1.FIX |
| `/ecs/export-requests` | ✅ | ✅ | ⚠️ Placeholder | ⚠️ Placeholder | ✅ task-0.5.4.1 | None | 1.1.1.FIX |
| `/ecs/authorizations` | ✅ | ✅ | ⚠️ Placeholder | ⚠️ Placeholder | ✅ task-0.5.4.5 | None | 1.1.1.FIX |
| `/cmc` | ❌ | ✅ | ⚠️ Placeholder | ⚠️ Placeholder | 📋 task-0.5.5.0 | Wireframe required | 1.1.1.FIX |
| `/cmc/scores` | ✅ | ✅ | ⚠️ Placeholder | ⚠️ Placeholder | ✅ task-0.5.5.1 | None | 1.1.1.FIX |
| `/cmc/disputes` | ✅ | ✅ | ⚠️ Placeholder | ⚠️ Placeholder | ✅ task-0.5.5.8 | None | 1.1.1.FIX |
| `/cmc/reports` | ✅ | ✅ | ⚠️ Placeholder | ⚠️ Placeholder | ✅ task-0.5.5.10 | None | 1.1.1.FIX |
| `/enforcement` | ✅ | ✅ | ⚠️ Placeholder | ⚠️ Placeholder | ✅ task-0.5.2.0 | None | 1.1.1.FIX |
| `/enforcement/actions` | ✅ | ✅ | ⚠️ Placeholder | ⚠️ Placeholder | ✅ task-0.5.2.1 | None | 1.1.1.FIX |
| `/enforcement/pending-approvals` | ✅ | ✅ | ⚠️ Placeholder | ⚠️ Placeholder | ✅ task-0.5.2.1c | None | 1.1.1.FIX |
| `/enforcement/reports` | ✅ | ✅ | ⚠️ Placeholder | ⚠️ Placeholder | ✅ task-0.5.2.1d | None | 1.1.1.FIX |

---

## Summary Statistics

### Route Implementation Status

- **Total Routes:** 51
- **✅ Implemented:** 12 (23.5%)
- **⚠️ Placeholder:** 30 (58.8%)
- **📋 Planned:** 9 (17.6%)

### Wireframe Status

- **✅ Has Wireframe:** 51 (100%)
- **📋 Missing Wireframe:** 0 (0%)

**All routes now have wireframes.** See [wireframe-route-mapping.md](./wireframe-route-mapping.md) for complete mapping.

---

## Critical Issues

### Route Naming Mismatches (Must Fix)

1. **Help vs Support:**
   - Sidebar: `/help/*`
   - Docs: `/support/*`
   - **Action:** Update sidebar to use `/support/*`

2. **Module Overview Routes:**
   - Sidebar: `/rmm/overview`, `/vci/dashboard`, `/ecs/overview`, `/cmc/overview`
   - Docs: `/rmm`, `/vci`, `/ecs`, `/cmc`
   - **Action:** Update sidebar to use module roots

3. **VCI Submissions:**
   - Sidebar: `/vci/submissions` (generic)
   - Docs: `/vci/submissions/aams`, `/vci/submissions/msq`, `/vci/submissions/wsl` (specific)
   - **Action:** Update sidebar to use specific routes OR create unified page

4. **System Config:**
   - Sidebar: `/system/config`
   - Docs: `/system-config`
   - **Action:** Update sidebar to use `/system-config`

---

## Next Steps

1. ✅ **Route Decision Made:** Option A (Documentation routes) - See [route-naming-decision.md](./route-naming-decision.md)
2. ⏳ **Fix Sidebar Routes:** Update sidebar.tsx to match documentation routes
3. ⏳ **Create Placeholder Pages:** Create placeholder pages for all missing routes
4. ⏳ **Update Documentation:** Add implementation status to routing-structure.md

---

## Related Documents

### Primary References
- [feature-index.md](../feature-index.md) - **Master feature index** with Database and API references for each route
- [routing-structure.md](./routing-structure.md) - Route definitions and Next.js App Router structure (SINGLE SOURCE OF TRUTH for route paths)
- [wireframe-route-mapping.md](./wireframe-route-mapping.md) - Wireframe-route mapping (SINGLE SOURCE OF TRUTH for wireframe-route relationships)
- [route-naming-decision.md](./route-naming-decision.md) - Route naming conventions and standards
- [navigation-layout-patterns.md](./navigation-layout-patterns.md) - Navigation structure (sidebar organization)

### Supporting Documents
- [README.md](./README.md) - Frontend documentation overview and navigation guide
- [role-based-ui-patterns.md](./role-based-ui-patterns.md) - Role-based UI patterns (role-based route access)
- [historical-data-routing-proposal.md](./historical-data-routing-proposal.md) - Historical data routing (historical route definitions)

### Project Management
- [Phase 1 Implementation Plan](../../05-project-management/phases/Phase-1-Implementation-Plan.md) - Implementation plan with route implementation tasks
- [Phase 1.1.1 Fix Plan](../../05-project-management/phases/phase-1-1-1-frontend-route-fix-plan.md) - Route fix plan and status
- [Phase 0.5 Wireframes](../../05-project-management/phases/phase-0-5-ui-ux-wireframes.md) - Wireframe creation workflow and missing wireframes list

---

**Last Updated:** 2026-01-12  
**Next Review:** After Phase 1.1.1.FIX completion
