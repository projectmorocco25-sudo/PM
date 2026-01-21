# Wireframe Compliance Standards

**Last Updated:** 2026-01-15  
**Purpose:** Standards for ensuring frontend implementation matches wireframe specifications

---

## Wireframe-First Implementation Principle

**Wireframes are the PRIMARY design reference** for all Phase 1 frontend implementation.

### Before Starting Implementation
1. ✅ Review the corresponding wireframe
2. ✅ Understand wireframe requirements
3. ✅ Reference wireframe annotations
4. ✅ Check component mapping
5. ✅ Verify wireframe compliance

**If a wireframe doesn't exist: STOP and create it first.**

---

## Wireframe Binding Requirements

### Code Comments
Every implemented route/page must include wireframe binding comments. Wireframe binding must appear in **both**:
- The PR description checklist (see "Proof Required"), and
- The codebase (either a top-of-file comment in the route/page file, or a maintained mapping module such as "route → wireframe task id(s)").

**Preferred format (top-of-file comment):**
```typescript
/**
 * Wireframe: task-0.5.1.1-dashboard.md
 * Route: /dashboard
 * Implements: Dashboard page for Company role
 * Wireframe Link: ../../04-design/user-experience/wireframes/00-core-foundation/dashboard/task-0.5.1.1-dashboard.md
 */
export default function DashboardPage() {
  // Implementation...
}
```

**Alternative format (maintained mapping module):**
- Location: `src/wireframe-bindings.ts` or similar
- Format: `{ route: '/dashboard', wireframe: 'task-0.5.1.1-dashboard.md' }`

### PR Description
Every PR must include:
- Exact wireframe task file(s) link(s) (e.g., `task-0.5.x.x-...`)
- Wireframe task ID(s)
- Statement of wireframe compliance

Example:
```
Wireframes Implemented:
- [task-0.5.2.2](../../../04-design/user-experience/wireframes/01-rmm/companies/task-0.5.2.2-companies-list.md)
- [task-0.5.2.3](../../../04-design/user-experience/wireframes/01-rmm/companies/task-0.5.2.3-company-detail.md)

Wireframe Compliance:
✅ Layout matches wireframe
✅ All role variants implemented
✅ All interactions match wireframe
✅ All states implemented (loading, empty, error, success)
```

---

## Compliance Checklist

### Layout Compliance
- [ ] Page structure matches wireframe layout
- [ ] Component placement matches wireframe
- [ ] Spacing and alignment match wireframe
- [ ] Responsive breakpoints match wireframe

### Interaction Compliance
- [ ] All interactive elements present
- [ ] Click/tap interactions match wireframe
- [ ] Form behaviors match wireframe
- [ ] Navigation flows match wireframe
- [ ] Modal/dialog behaviors match wireframe

### Content Compliance
- [ ] Text content matches wireframe (or approved alternatives)
- [ ] Data display format matches wireframe
- [ ] Labels and placeholders match wireframe
- [ ] Icons and images match wireframe

### Role-Based Compliance
- [ ] All role variants implemented (where wireframe specifies)
- [ ] Role-specific content matches wireframe
- [ ] Role-specific actions match wireframe
- [ ] Role-based visibility matches wireframe

### State Compliance
- [ ] Loading state matches wireframe
- [ ] Empty state matches wireframe
- [ ] Error state matches wireframe
- [ ] Success state matches wireframe
- [ ] All state transitions match wireframe

---

## Wireframe Reference Locations

### Core Foundation
- Authentication: `docs/04-design/user-experience/wireframes/00-core-foundation/authentication/`
- Layout & Navigation: `docs/04-design/user-experience/wireframes/00-core-foundation/layout-navigation/`
- Dashboard: `docs/04-design/user-experience/wireframes/00-core-foundation/dashboard/`
- Communications: `docs/04-design/user-experience/wireframes/00-core-foundation/communications/`
- Global: `docs/04-design/user-experience/wireframes/00-core-foundation/global/`

### RMM Module
- Companies: `docs/04-design/user-experience/wireframes/01-rmm/companies/`
- Products: `docs/04-design/user-experience/wireframes/01-rmm/products/`
- SKUs: `docs/04-design/user-experience/wireframes/01-rmm/skus/`
- Workflow: `docs/04-design/user-experience/wireframes/01-rmm/workflow/`
- Enforcement: `docs/04-design/user-experience/wireframes/01-rmm/enforcement/`

### VCI Module
- AAMS: `docs/04-design/user-experience/wireframes/02-vci/aams/`
- MSQ: `docs/04-design/user-experience/wireframes/02-vci/msq/`
- WSL: `docs/04-design/user-experience/wireframes/02-vci/wsl/`
- Breaches: `docs/04-design/user-experience/wireframes/02-vci/breaches/`

### Other Modules
- ECS: `docs/04-design/user-experience/wireframes/03-ecs/`
- CMC: `docs/04-design/user-experience/wireframes/04-cmc/`

---

## Deviation Process

If implementation must deviate from wireframe:

1. **STOP** - Do not proceed with deviation without approval
2. **Document deviation** - Explain why deviation is needed
3. **Get approval** - Get explicit approval from wireframe owner (Emma) or project manager
4. **Update wireframe** - If deviation is permanent, update wireframe
5. **Document in PR** - Include deviation documentation and approval reference in PR

**Important:** Wireframes are the PRIMARY design reference. Architecture docs, component specs, and implementation plans support wireframes, but **wireframes define the UI/UX**. If there is any conflict or ambiguity, the wireframe takes precedence.

### Deviation Documentation Template
```markdown
## Wireframe Deviation

**Wireframe:** task-0.5.x.x-description.md
**Deviation:** [Describe what differs from wireframe]
**Reason:** [Explain why deviation is necessary]
**Approval:** [Link to approval or approval person/date]
**Wireframe Updated:** [Yes/No - if permanent deviation]
```

---

## Verification Process

### Self-Verification (Developer)
1. Review wireframe before coding
2. Compare implementation to wireframe during development
3. Verify all compliance checklist items
4. Document any deviations

### Compliance Verification (Sami)
1. Verify wireframe binding in code
2. Verify wireframe link in PR description
3. Compare PR screenshots to wireframe
4. Verify role variants and states match wireframe

### Approval (Wireframe Owner/PM)
1. Review PR for wireframe compliance
2. Approve or request changes
3. Document any approved deviations

---

## Common Compliance Issues

### Issue 1: Missing Role Variants
**Problem:** Wireframe specifies multiple role views but only one implemented  
**Solution:** Implement all role variants or document why variant not needed

### Issue 2: Missing States
**Problem:** Wireframe specifies loading/empty/error states but not implemented  
**Solution:** Implement all required states

### Issue 3: Layout Differences
**Problem:** Layout doesn't match wireframe spacing/alignment  
**Solution:** Adjust layout to match wireframe exactly

### Issue 4: Missing Interactions
**Problem:** Wireframe specifies interaction but not implemented  
**Solution:** Implement interaction or document why not implemented

---

## Wireframe Catalog Reference

**Complete Wireframe Catalog:** [Phase 0.5 Wireframes Catalog](../Archive for now/phase-0-5-wireframes-catalog.md)

**Wireframe Index:** `docs/04-design/user-experience/wireframes/06-documentation/wireframe-index.md`

**Wireframe-Route Mapping:** [Wireframe-Route Mapping](../../02-architecture/frontend/wireframe-route-mapping.md)

---

**Reference:** [Phase 1 Implementation Plan](../phase-1.md#-critical-wireframe-first-implementation-principle), [Compliance Rules](./compliance-rules.md)
