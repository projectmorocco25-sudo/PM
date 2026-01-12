# Documentation Structure - Pharmaceutical Governance Value Chain Platform (PM)

This directory contains all planning, specifications, and design documentation for the PM project. This is the **single source of truth** for project documentation.

## Filing System Principles

- **Single Source of Truth:** All planning, specs, and design documents live in `/docs`
- **Clear Separation:** Implementation code lives outside `/docs` (frontend/, supabase/, scripts/, etc.)
- **Organized Structure:** Numbered folders (00-10) for easy navigation
- **Documentation Only:** `/docs` contains specifications and plans, not implementation code
- **Cross-References:** Documents reference implementation code; code references documentation

## Directory Structure

### Visual Tree

```
docs/
├── 00-overview/                    # High-level project documents
│   ├── Project Brief – PM.md
│   └── README.md
│
├── 01-requirements/                 # Requirements specifications
│   ├── README.md
│   ├── user-stories/
│   └── acceptance-criteria/
│
├── 02-architecture/                 # Technical architecture
│   ├── README.md
│   ├── system-architecture.md
│   ├── workflow-architecture.md
│   ├── deployment-architecture.md
│   ├── api/                        # API specifications
│   ├── database/                   # Schema, ERD, migrations
│   ├── frontend/                   # Frontend architecture
│   ├── security/                   # Security architecture
│   ├── integration/                # External integrations
│   ├── modules/                    # Module architecture
│   ├── implementation/             # Implementation guides
│   └── testing/                    # Testing specifications
│
├── 03-governance/                   # Governance & compliance
│   ├── README.md
│   ├── governance-workflows.md
│   ├── regulatory-framework.md
│   ├── compliance-requirements.md
│   ├── approvals-authority-matrix.md
│   └── communication-design/       # Communication lifecycle design
│
├── 04-design/                       # UI/UX and workflow design
│   ├── README.md
│   ├── user-experience/
│   │   └── wireframes/            # Organised by module (00-07)
│   └── workflows/
│
├── 05-project-management/           # Project planning & execution
│   ├── README.md
│   ├── project-plan.md
│   ├── phases/                     # Phase definitions + supporting docs
│   │   ├── phase-0-technical-foundation.md
│   │   ├── Phase-1-Implementation-Plan.md
│   │   ├── phase-2-moh-uat.md
│   │   ├── phase-3-pilot.md
│   │   ├── phase-4-production.md
│   │   ├── phase-0-supporting/     # Phase 0 working documents
│   │   ├── phase-1-supporting/     # Phase 1 working documents
│   │   ├── guidelines/             # Cross-phase principles
│   │   └── archive/                # Completed phase documents
│   ├── milestones/
│   ├── deliverables/
│   ├── resources/
│   ├── stakeholders/
│   ├── communications/
│   │   └── meeting-notes/
│   ├── risks-issues/
│   ├── change-management/
│   ├── quality/
│   └── status-reports/
│
├── 06-development/                  # Development specifications
│   ├── README.md
│   ├── development-setup.md
│   └── technical-decisions/
│       └── decision-log.md
│
├── 07-testing/                      # Testing strategy & planning
│   ├── README.md
│   ├── test-scenarios/
│   └── mock-data/
│
├── 08-deployment/                   # Deployment planning
│   ├── README.md
│   ├── ci-cd-pipeline.md
│   ├── infrastructure.md
│   ├── testing-framework.md
│   ├── environments/
│   └── operations/
│
├── 09-training/                     # Training & user documentation
│   ├── README.md
│   ├── user-manuals/
│   └── training-materials/
│
├── 10-references/                   # References & templates
│   ├── README.md
│   ├── glossary.md
│   ├── acronyms.md
│   ├── filing-system.md
│   ├── templates/
│   ├── regulations/
│   └── external-resources/
│
└── archive/                         # Archived documents
    └── README.md
```

### Folder Descriptions

| Folder | Purpose |
|--------|---------|
| `00-overview/` | High-level project documents, project brief, executive summaries |
| `01-requirements/` | Business requirements, user stories, acceptance criteria |
| `02-architecture/` | System architecture, API, database, security, integrations |
| `03-governance/` | Governance workflows, compliance, regulatory framework |
| `04-design/` | UI/UX wireframes, workflow diagrams |
| `05-project-management/` | Project plan, phases, milestones, risks, status reports |
| `06-development/` | Development setup, technical decisions |
| `07-testing/` | Test strategy, test scenarios, mock data |
| `08-deployment/` | CI/CD, environments, infrastructure, operations |
| `09-training/` | User manuals, training materials |
| `10-references/` | Glossary, acronyms, templates, external references |
| `archive/` | Deprecated and historical documents |

## Implementation Files

Implementation code and configuration files live outside `/docs`:

- `frontend/` - Next.js frontend implementation
- `supabase/` - Supabase backend (migrations, functions, RPC)
- `scripts/` - Implementation scripts (mock data generation, setup, utilities)
- `tests/` - Test implementation code
- `config/` - Configuration files
- `.github/` - CI/CD workflows
- `.cursor/` - Cursor configuration

## Quick Links

- [Project Brief](00-overview/Project%20Brief%20–%20PM.md)
- [Project Plan](05-project-management/project-plan.md)
- [System Architecture](02-architecture/system-architecture.md)
- [Phase 1 Implementation Plan](05-project-management/phases/Phase-1-Implementation-Plan.md)
- [Glossary](10-references/glossary.md)
- [Acronyms](10-references/acronyms.md)

## Navigation

Each major section contains a README.md file with:
- Overview of the section
- List of documents in that section
- Links to related documents
- Navigation guidance

## Document Maintenance

- **Version Control:** All documents are tracked in Git
- **Review Process:** Documents go through review before finalization
- **Change Management:** Significant changes tracked in change log
- **Templates:** Use templates from `10-references/templates/` for consistency

---

**Last Updated:** 2026-01-12  
**Maintained By:** Yasmine (Project Manager)
