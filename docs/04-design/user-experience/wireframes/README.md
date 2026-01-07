# Wireframes - Pharmaceutical Governance Value Chain Platform (PM)

**Purpose:** This directory contains all UI/UX wireframes for the PM platform, organized by module and subphase.

**Last Updated:** 2025-12-31  
**Status:** Wireframe structure ready for Phase 0.5  
**Owner:** Emma (UI/UX + Next.js Frontend Specialist)

## Overview

This directory stores wireframes created during Phase 0.5 (UI/UX Wireframes & Design Validation). Wireframes are organized by module and subphase to align with the Phase 1.1 implementation plan.

## Directory Structure

```
wireframes/
├── README.md (this file)
├── 00-core-foundation/        # Core Foundation Wireframes (Subphase 0.5.1)
├── 01-rmm/                    # RMM Module Wireframes (Subphase 0.5.2)
├── 02-vci/                    # VCI Module Wireframes (Subphase 0.5.3)
├── 03-ecs/                    # ECS Module Wireframes (Subphase 0.5.4)
├── 04-cmc/                    # CMC Module Wireframes (Subphase 0.5.5)
├── 05-audit-historical/       # Audit & Historical Data Wireframes (Subphase 0.5.6)
├── 06-documentation/          # Wireframe Documentation & Index
└── exports/                   # PDF exports (if applicable)
```

## File Naming Convention

Wireframes use the following naming pattern:
- **Format:** `task-{TASK_ID}-{descriptive-name}.{ext}`
- **Examples:**
  - `task-0.5.1.1-public-homepage.png`
  - `task-0.5.2.3-company-detail-page.pdf`
  - `task-0.5.3.1-aams-submissions-list.figma`

Alternatively, descriptive names without task IDs:
- `public-homepage.png`
- `company-detail-page.pdf`

## File Formats

Wireframes can be stored in multiple formats:
- **Image formats:** PNG, JPG, SVG
- **PDF:** For documentation and reference
- **Design tool links:** Figma, Miro, or similar (links stored in `06-documentation/design-tool-links.md`)

## Wireframe Status

| Subphase | Module | Status | Completion |
|----------|--------|--------|------------|
| 0.5.1 | Core Foundation | ⚪ Not Started | 0% |
| 0.5.2 | RMM | ⚪ Not Started | 0% |
| 0.5.3 | VCI | ⚪ Not Started | 0% |
| 0.5.4 | ECS | ⚪ Not Started | 0% |
| 0.5.5 | CMC | ⚪ Not Started | 0% |
| 0.5.6 | Audit & Historical | ⚪ Not Started | 0% |

**Status Legend:**
- ⚪ Not Started
- 🟡 In Progress
- ✅ Complete
- 📋 Pending Review
- ✅ Approved

## Quick Navigation

### Core Foundation (00-core-foundation/)
- Public pages (homepage, about, support, FAQ, legal pages)
- Authentication (login, register, password reset)
- Layout & Navigation (dashboard layout, header, sidebar, notifications)
- Dashboard (Company, MOH Tier 1, Tier 2)
- Utility pages (history, profile, notifications)

### RMM Module (01-rmm/)
- Companies (list, detail, create/edit forms)
- Products (list, detail, create/edit forms)
- SKUs (list, detail, create/edit forms)
- Registry submissions (workflow states, approval chains)
- MOH-only pages (ATC codes, critical medicines)

### VCI Module (02-vci/)
- AAMS (submissions, threshold management)
- MSQ (submissions, corrections)
- WSL (submissions, breach detection)
- Breaches (list, detail, analysis, approval)
- Governance Dashboard
- Analytics & Treemaps

### ECS Module (03-ecs/)
- Export requests (list, detail, form)
- Export authorizations (list, detail, expiration)
- Export completion reporting
- Replenishment schedule tracking

### CMC Module (04-cmc/)
- Compliance scores (list, detail, leaderboard)
- Compliance Disputes (creation, review, resolution)
- Reports (list, detail, review/approval)
- Score review & override interfaces

### Audit & Historical (05-audit-historical/)
- Audit logs (list, detail)
- Audit reports
- Historical data views

## Documentation

Comprehensive documentation is available in `06-documentation/`:
- **[Wireframe Index](06-documentation/wireframe-index.md)** - Complete index of all wireframes
- **[Wireframe Annotations](06-documentation/wireframe-annotations.md)** - Interactions, state transitions, validation rules
- **[Component Mapping](06-documentation/wireframe-to-component-mapping.md)** - Maps wireframes to UI components
- **[Design Tool Links](06-documentation/design-tool-links.md)** - Figma/Miro links (if used)

## Related Documents

- [Phase 0.5 Plan](../../05-project-management/phases/phase-0-5-ui-ux-wireframes.md)
- [UI Component Specifications](../../02-architecture/frontend/ui-component-specifications.md)
- [Form Design Patterns](../../02-architecture/frontend/form-design-patterns.md)
- [Role-Based UI Patterns](../../02-architecture/frontend/role-based-ui-patterns.md)
- [Navigation & Layout Patterns](../../02-architecture/frontend/navigation-layout-patterns.md)
- [Routing Structure](../../02-architecture/frontend/routing-structure.md)
- [Design System](../../02-architecture/frontend/design-system.md)

## Review Process

Wireframes go through the following review process:
1. **Internal Team Review** - Emma, Oliver, Maya (technical feasibility)
2. **Stakeholder Review** - Fatima (MOH), Dr. Samir (Business Process)
3. **Iteration** - Update based on feedback
4. **Final Approval** - Sign-off from all stakeholders

## Deliverables

Phase 0.5 deliverables:
1. ✅ Complete wireframe set for all modules (RMM, VCI, ECS, CMC)
2. ✅ Wireframe annotations and documentation
3. ✅ Wireframe-to-component mapping
4. ✅ Exported wireframes (PDF or design tool links)
5. ✅ Stakeholder approval documentation

---

**Next Steps:** Begin Subphase 0.5.1 (Core Foundation Wireframes)  
**Owner:** Emma (UI/UX + Next.js Frontend Specialist)

