# Design

**Purpose:** UI/UX design and workflow design for the PM platform

---

## Contents

### Subfolders

| Folder | Description |
|--------|-------------|
| `user-experience/` | User experience design including wireframes |
| `workflows/` | Workflow diagrams and process flows |

---

## User Experience Structure

```
user-experience/
└── wireframes/
    ├── 00-core-foundation/    # Auth, layout, dashboard, communications
    ├── 01-rmm/                # Registration & Market Management
    ├── 02-vci/                # Value Chain Integrity (WSL, MSQ, AAMS)
    ├── 03-ecs/                # Export Control System
    ├── 04-cmc/                # Compliance Monitoring Centre
    ├── 05-audit-historical/   # Audit and historical data views
    ├── 06-documentation/      # Design documentation and indices
    └── 07-modals/             # Reusable modal components
```

---

## Wireframe Naming Convention

All wireframe files follow the pattern: `task-0.5.X.Y-description.md`

- **0.5** = Phase 0.5 (UI/UX Design Phase)
- **X** = Module number (1=Core, 2=RMM, 3=VCI, 4=ECS, 5=CMC)
- **Y** = Task sequence within module

---

## Related Documentation

- [Frontend Architecture](../02-architecture/frontend/)
- [UI Component Specifications](../02-architecture/frontend/ui-component-specifications.md)
- [Design System](../02-architecture/frontend/design-system.md)

---

**Last Updated:** 2026-01-12
