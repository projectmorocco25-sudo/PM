# Architecture

**Purpose:** Technical architecture and design specifications for the PM platform

---

## Contents

### Core Documents

| Document | Description |
|----------|-------------|
| `system-architecture.md` | Overall system architecture |
| `workflow-architecture.md` | Workflow and state machine design |
| `deployment-architecture.md` | Deployment and infrastructure design |

### Subfolders

| Folder | Description |
|--------|-------------|
| `api/` | API specifications (REST, RPC, Edge Functions) |
| `database/` | Database schema, ERD, migrations, data dictionary |
| `frontend/` | Frontend architecture, routing, components, patterns |
| `security/` | Security architecture, RLS, audit logging, validation |
| `integration/` | External system integrations (ERP, Customs) |
| `modules/` | Module-specific architecture (RMM, VCI, ECS, CMC) |
| `implementation/` | Implementation checklists and guides |
| `testing/` | Testing specifications |

---

## Key Architectural Decisions

See [Decision Log](../06-development/technical-decisions/decision-log.md) for architectural decisions and rationale.

---

## Related Documentation

- [Requirements](../01-requirements/README.md)
- [Governance](../03-governance/README.md)
- [Development Setup](../06-development/development-setup.md)

---

**Last Updated:** 2026-01-12
