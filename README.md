# Pharmaceutical Governance Value Chain Platform (PM)

**Client:** Ministry of Health (MOH) – Morocco  
**Project Status:** Planning  
**Last Updated:** 2025-12-31

## Overview

The Pharmaceutical Governance Value Chain Platform (PM) is a secure digital portal designed to strengthen governance, oversight, and regulatory compliance across Morocco's pharmaceutical value chain. The platform enables Industrial Pharmaceutical Companies (IPCs) and wholesalers to meet their reporting obligations while providing MOH with real-time visibility into stock sufficiency, compliance, and export activities.

## Project Documentation

All project documentation is located in the `/docs` directory. This is the **single source of truth** for planning, specifications, and design documents.

**Quick Links:**
- [Project Brief](docs/00-overview/Project%20Brief%20–%20PM.md) - Comprehensive project overview
- [Project Plan](docs/05-project-management/project-plan.md) - Detailed project planning and timeline
- [Documentation Structure](docs/README.md) - Complete documentation structure and navigation

## Platform

- **Backend:** Supabase (PostgreSQL, Auth, Storage, Edge Functions, Scheduled Triggers)
- **Frontend:** Next.js (React) with Supabase client libraries
- **Architecture:** Modular design with core modules (RMM, VCI) and optional modules (ECS, CMC)

## Project Timeline

**Total Duration:** 12 months

- **Month 1:** Phase 0 - Technical Foundation
- **Months 2-3:** Phase 1.1 - RMM + VCI Development
- **Month 4:** Phase 1.2 - ECS Development
- **Month 5:** Phase 1.3 - CMC Development
- **Month 6:** Phase 1.4 - Holistic MVP Testing
- **Month 7:** Phase 2 - MOH UAT with Mock Data
- **Month 8:** Phase 3 - Real Company Pilot (20-30 companies)
- **Months 9-12:** Phase 4 - Full Production Rollout

## Documentation Structure

```
docs/
├── 00-overview/          # Project overview and navigation
├── 01-requirements/      # Requirements specifications
├── 02-architecture/      # Technical architecture
├── 03-governance/        # Governance and compliance
├── 04-design/            # UI/UX and workflow design
├── 05-project-management/# Project planning and management
├── 06-development/       # Development specifications
├── 07-testing/           # Testing strategy and planning
├── 08-deployment/        # Deployment planning
├── 09-training/          # Training and user documentation
└── 10-references/        # References and templates
```

See [Documentation README](docs/README.md) for complete structure and navigation.

## Implementation

Implementation code and configuration files live outside `/docs`:

- `frontend/` - Next.js frontend implementation
- `supabase/` - Supabase backend (migrations, functions, RPC)
- `scripts/` - Implementation scripts
- `tests/` - Test implementation code
- `config/` - Configuration files

## Getting Started

1. Review the [Project Brief](docs/00-overview/Project%20Brief%20–%20PM.md) for comprehensive overview
2. Check the [Project Plan](docs/05-project-management/project-plan.md) for timeline and phases
3. Explore [Architecture](docs/02-architecture/) for technical specifications
4. Review [Requirements](docs/01-requirements/) for functional requirements

## Team

See `.cursor/rules/pm_agent_team.md` for the AI agent team roster and responsibilities.

## Contact

For project inquiries, please refer to the project documentation in `/docs` or contact the project manager.

---

**Note:** This project uses a comprehensive mock data strategy (75 companies) for development, testing, and customer presentation, followed by a real company pilot (20-30 companies) before full production rollout.

