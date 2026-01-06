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
│   ├── user-stories/
│   └── acceptance-criteria/
│
├── 02-architecture/                 # Technical architecture
│   ├── modules/
│   ├── database/
│   ├── api/
│   ├── security/
│   └── integration/
│
├── 03-governance/                   # Governance & compliance
│
├── 04-design/                       # UI/UX and workflow design
│   ├── user-experience/
│   │   └── wireframes/
│   └── workflows/
│
├── 05-project-management/           # Project planning & execution
│   ├── project-plan.md
│   ├── phases/
│   ├── milestones/
│   ├── deliverables/
│   ├── resources/
│   ├── stakeholders/
│   ├── communications/
│   │   └── meeting-notes/
│   ├── risks-issues/
│   ├── change-management/
│   ├── quality/
│   │   └── quality-reports/
│   └── status-reports/
│
├── 06-development/                  # Development specifications
│   └── technical-decisions/
│       └── decisions/
│
├── 07-testing/                      # Testing strategy & planning
│   ├── test-scenarios/
│   └── mock-data/
│
├── 08-deployment/                   # Deployment planning
│   ├── environments/
│   └── operations/
│
├── 09-training/                     # Training & user documentation
│   ├── user-manuals/
│   └── training-materials/
│
├── 10-references/                   # References & templates
│   ├── glossary.md
│   ├── acronyms.md
│   ├── filing-system.md
│   ├── regulations/
│   └── templates/
│
└── archive/                         # Archived documents
```

### Detailed Descriptions

### 00-overview/
High-level project documents and navigation
- Project Brief – PM.md (main project brief)
- Executive summaries
- Project charter

### 01-requirements/
Requirements specifications
- Business and functional requirements
- User stories (organized by module)
- Acceptance criteria (organized by module)

### 02-architecture/
Technical architecture and design specifications
- System architecture
- Module architecture specs (RMM, VCI, ECS, CMC)
- Database schema design
- API specifications
- Security architecture
- Integration architecture

### 03-governance/
Governance and compliance specifications
- Governance workflows
- Compliance requirements
- Regulatory policies
- Approvals and authority matrix

### 04-design/
UI/UX and workflow design
- User experience design
- User journeys and personas
- Wireframes
- Workflow diagrams
- UI component specifications

### 05-project-management/
Project planning and execution management
- Overall project plan
- Phase plans (Phase 0 through Phase 4)
- Milestones tracking
- Deliverables tracking
- Resource planning
- Stakeholder management
- Communications and meeting notes
- Risk and issue management
- Change management
- Quality management
- Status reports

### 06-development/
Development specifications and standards
- Development standards and conventions
- Technical decision log
- Development workflow (Git, branching)

### 07-testing/
Testing strategy and planning
- Test strategy and plan
- Test scenarios (organized by module)
- Mock data strategy and specifications

### 08-deployment/
Deployment planning
- Deployment plan
- Environment specifications (dev, staging, prod)
- Operations planning (monitoring, backup, disaster recovery)

### 09-training/
Training and user documentation
- Training plan
- User manuals (by role)
- Training materials

### 10-references/
Reference materials
- Glossary
- Acronyms
- Regulatory references
- Document templates

### archive/
Archived documents (old versions, deprecated items)

## Navigation

Each major section contains a README.md file with:
- Overview of the section
- List of documents in that section
- Links to related documents
- Navigation guidance

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
- [Glossary](10-references/glossary.md)
- [Acronyms](10-references/acronyms.md)

## Document Maintenance

- **Version Control:** All documents are tracked in Git
- **Review Process:** Documents go through review before finalization
- **Change Management:** Significant changes tracked in change log
- **Templates:** Use templates from `10-references/templates/` for consistency

---

**Last Updated:** 2025-12-31  
**Maintained By:** Project Management Team

