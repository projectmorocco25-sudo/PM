# Route Naming Convention Decision

**Date:** 2026-01-12  
**Status:** ✅ DECIDED  
**Decision Maker:** Emma (UI/UX), Yasmine (Frontend Lead), Oliver (Architecture)  
**Decision:** Option A - Use Documentation Routes

---

## Decision

**Selected Option:** Option A - Use Documentation Routes

**Rationale:**
1. Documentation is more comprehensive and reviewed by all specialists
2. Routes follow RESTful conventions better
3. Historical data routing proposal uses these routes
4. Wireframes reference these routes
5. Documentation represents the intended system design

---

## Route Naming Convention

### Standard Routes

| Current (Wrong) | Correct (Documentation) | Notes |
|----------------|------------------------|-------|
| `/help/*` | `/support/*` | Support routes use `/support` prefix |
| `/rmm/overview` | `/rmm` | Module root is the overview page |
| `/vci/dashboard` | `/vci` | Module root is the dashboard page |
| `/vci/submissions` | `/vci/submissions/aams`, `/vci/submissions/msq`, `/vci/submissions/wsl` | Individual submission type routes |
| `/ecs/overview` | `/ecs` | Module root is the overview page |
| `/cmc/overview` | `/cmc` | Module root is the overview page |
| `/system/config` | `/system-config` | Use hyphen for multi-word routes |

### Implementation Rules

1. **Module Overview Routes:** Use module root (`/rmm`, `/vci`, `/ecs`, `/cmc`) - not `/module/overview` or `/module/dashboard`
2. **Support Routes:** Use `/support/*` prefix - not `/help/*`
3. **System Routes:** Use hyphenated format (`/system-config`) - not `/system/config`
4. **Submission Routes:** Use specific type routes (`/vci/submissions/aams`) - not generic `/vci/submissions`

---

## Action Items

1. ✅ **Decision Documented:** This document
2. ⏳ **Sidebar Updated:** Update sidebar.tsx to use correct routes
3. ⏳ **Routing Structure Updated:** Add implementation status to routing-structure.md
4. ⏳ **Route Inventory Created:** Complete route inventory document
5. ⏳ **Documentation Updated:** Update navigation-layout-patterns.md and role-based-ui-patterns.md

---

## Related Documents

### Primary References
- [routing-structure.md](./routing-structure.md) - Route definitions and Next.js App Router structure (uses naming convention from this document)
- [route-inventory.md](./route-inventory.md) - Route implementation status (tracks routes using this naming convention)
- [navigation-layout-patterns.md](./navigation-layout-patterns.md) - Navigation structure (sidebar uses routes following this naming convention)

### Supporting Documents
- [README.md](./README.md) - Frontend documentation overview and navigation guide
- [historical-data-routing-proposal.md](./historical-data-routing-proposal.md) - Historical data routing (uses naming convention for historical routes)

### Project Management
- [Phase 1 Implementation Plan](../../05-project-management/phases/Phase-1-Implementation-Plan.md) - Implementation plan
- [Phase 1.1.1 Fix Plan](../../05-project-management/phases/phase-1-1-1-frontend-route-fix-plan.md) - Route fix plan (implements this naming convention)

---

**Last Updated:** 2026-01-12  
**Next Review:** After Phase 1.1.1.FIX completion
