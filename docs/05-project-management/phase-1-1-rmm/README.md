# Phase 1.1 RMM - Task Organization

**Purpose:** This directory contains all detailed task definitions for Phase 1.1 (RMM Development)  
**Main Registry:** [phase-1-1-rmm.md](../phase-1-1-rmm.md)  
**Last Updated:** 2026-01-26

---

## Directory Structure

```
phase-1-1-rmm/
├── README.md (this file)
└── tasks/
    ├── frontend/          # Frontend implementation tasks
    ├── backend/           # Backend implementation tasks (RPC functions, RLS policies)
    └── migrations/        # Database migration tasks
```

---

## Task Organization

### Frontend Tasks
- **Location:** `tasks/frontend/`
- **Naming:** `{task-id}-{descriptive-name}.md`
- **Example:** `1.1.1.9-core-layout.md`
- **Template:** [frontend-task-template.md](../../standards/task-templates/frontend-task-template.md)

### Backend Tasks
- **Location:** `tasks/backend/`
- **Naming:** `{task-id}-{descriptive-name}.md`
- **Example:** `1.1.1.2-core-tables.md`
- **Template:** [backend-task-template.md](../../standards/task-templates/backend-task-template.md)

### Migration Tasks
- **Location:** `tasks/migrations/`
- **Naming:** `{task-id}-{descriptive-name}.md`
- **Example:** `1.1.1.2-core-tables-migration.md`
- **Template:** [migration-task-template.md](../../standards/task-templates/migration-task-template.md)

---

## Task File Structure

Each task file contains:
- **Quick Reference:** Wireframes, routes, database, API, feature links
- **Verification Tasks:** Pre-implementation verification (wireframe, database, API)
- **Implementation Task:** Main implementation details
- **Compliance Verification:** Post-implementation compliance check

---

## Finding Tasks

1. **By Task ID:** Use main registry file `phase-1-1-rmm.md` to find task, then follow link to detailed task file
2. **By Category:** Browse `tasks/frontend/`, `tasks/backend/`, or `tasks/migrations/`
3. **By Feature:** Use feature-index.md to find feature, then search for related tasks

---

## Task Status Tracking

- **Main Registry:** `phase-1-1-rmm.md` shows checkbox status `[ ]` or `[x]`
- **Task Files:** Detailed status with timestamps, assignee, completion notes
- **Synchronization:** Both must be updated when task status changes

---

## Related Documents

- [Main Phase Registry](../phase-1-1-rmm.md) - Task index and overview
- [Task Templates](../../standards/task-templates/) - Reusable task structures
- [Compliance Rules](../../standards/compliance-rules.md) - Mandatory compliance checklist
- [Feature Index](../../../02-architecture/feature-index.md) - Single source of truth for features

---

**Last Updated:** 2026-01-26
