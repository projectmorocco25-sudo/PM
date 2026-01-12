# Filing System Documentation

**Purpose:** This document describes the filing system structure for the PM project documentation.

**Last Updated:** 2026-01-12

## Overview

The `/docs` directory serves as the **single source of truth** for all planning, specifications, and design documentation. Implementation code and configuration files live outside `/docs`.

## Key Principles

1. **Single Source of Truth:** All planning, specs, and design documents in `/docs`
2. **Clear Separation:** Implementation code lives outside `/docs` (frontend/, supabase/, scripts/, etc.)
3. **Organized Structure:** Numbered folders (00-10) for easy navigation
4. **Documentation Only:** `/docs` contains specifications and plans, not implementation code
5. **Cross-References:** Documents reference implementation code; code references documentation
6. **README Navigation:** Every folder has a README.md for navigation and context

## Directory Structure

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
- Workflow architecture
- Deployment architecture
- **api/** - API specifications (REST, RPC, Edge Functions)
- **database/** - Schema, ERD, migrations, data dictionary
- **frontend/** - Frontend architecture, routing, components
- **security/** - Security architecture, RLS, audit logging
- **integration/** - External integrations (ERP, Customs)
- **modules/** - Module-specific architecture
- **implementation/** - Implementation guides and checklists
- **testing/** - Testing specifications

### 03-governance/
Governance and compliance specifications
- Governance workflows
- Compliance requirements
- Regulatory policies and framework
- Approvals and authority matrix
- **communication-design/** - Communication lifecycle and requirements

### 04-design/
UI/UX and workflow design
- **user-experience/wireframes/** - Wireframes organised by module:
  - 00-core-foundation (auth, layout, dashboard, communications)
  - 01-rmm (Registration & Market Management)
  - 02-vci (Value Chain Integrity)
  - 03-ecs (Export Control System)
  - 04-cmc (Compliance Monitoring Centre)
  - 05-audit-historical (Audit and history views)
  - 06-documentation (Design documentation)
  - 07-modals (Reusable modal components)
- **workflows/** - Workflow diagrams and process flows

### 05-project-management/
Project planning and execution management
- **project-plan.md** - Overall project plan
- **phases/** - Phase definitions and supporting documents
  - Core phase files (phase-0 through phase-4)
  - phase-0-supporting/ (Phase 0 working documents)
  - phase-1-supporting/ (Phase 1 working documents)
  - guidelines/ (Cross-phase principles)
  - archive/ (Completed phase documents)
- **milestones/** - Milestone tracking
- **deliverables/** - Deliverable tracking
- **resources/** - Resource planning
- **stakeholders/** - Stakeholder management
- **communications/** - Communications and meeting notes
- **risks-issues/** - Risk and issue management
- **change-management/** - Change control
- **quality/** - Quality management
- **status-reports/** - Status reports

### 06-development/
Development specifications and standards
- Development setup and environment
- Technical decision log
- Development workflow (Git, branching)

### 07-testing/
Testing strategy and planning
- Test strategy and plan
- Test scenarios (organized by module)
- Mock data strategy and specifications

### 08-deployment/
Deployment planning
- CI/CD pipeline configuration
- Infrastructure specifications
- **environments/** - Environment specs (dev, staging, prod)
- **operations/** - Monitoring, backup, disaster recovery

### 09-training/
Training and user documentation
- **user-manuals/** - User manuals by role
- **training-materials/** - Training presentations and guides

### 10-references/
Reference materials
- Glossary
- Acronyms
- Filing system documentation (this file)
- **templates/** - Document templates
- **regulations/** - Regulatory references
- **external-resources/** - External reference materials

### archive/
Archived documents (old versions, deprecated items)
- Organised by original location
- README with archive index

## Implementation Files (Outside /docs)

Implementation code and configuration files live outside `/docs`:

- `frontend/` - Next.js frontend implementation
- `supabase/` - Supabase backend (migrations, functions, RPC)
- `scripts/` - Implementation scripts (mock data generation, setup, utilities)
- `tests/` - Test implementation code
- `config/` - Configuration files
- `.github/` - CI/CD workflows
- `.cursor/` - Cursor configuration

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

## Archive Policy

Documents are archived when:
1. Superseded by newer versions
2. Deprecated or no longer applicable
3. Completed one-time documents (plans, audits)
4. Historical reference only

Archived documents are moved to `archive/` (top-level) or section-specific archive folders.

## Quick Navigation

- [Main Documentation README](../README.md)
- [Project Brief](../00-overview/Project%20Brief%20–%20PM.md)
- [Project Plan](../05-project-management/project-plan.md)
- [Glossary](glossary.md)
- [Acronyms](acronyms.md)
