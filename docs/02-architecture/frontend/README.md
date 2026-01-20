# Frontend Architecture Documentation

**Purpose:** This directory contains all frontend architecture, design patterns, component specifications, and routing documentation for the PM platform.

**Last Updated:** 2026-01-12  
**Status:** ⚠️ PARTIALLY COMPLETE - Documentation consolidation in progress (Phase 1.1.1.FIX)  
**Owner:** Emma (UI/UX + Next.js Frontend Specialist)

---

## 📚 Documentation Overview

This directory contains 10 core documents covering all aspects of frontend development:

| Document | Purpose | Single Source of Truth For |
|----------|---------|---------------------------|
| [routing-structure.md](./routing-structure.md) | Route definitions and Next.js App Router structure | ✅ All route paths and route organization |
| [navigation-layout-patterns.md](./navigation-layout-patterns.md) | Navigation structure and layout patterns | ✅ Sidebar organization, layout components, responsive design |
| [design-system.md](./design-system.md) | Design tokens, colors, typography, spacing | ✅ Visual design system and styling guidelines |
| [ui-component-specifications.md](./ui-component-specifications.md) | Component library specifications | ✅ UI component API, usage, and accessibility |
| [form-design-patterns.md](./form-design-patterns.md) | Form patterns and validation | ✅ Form structure, validation, error handling |
| [state-management-ui-patterns.md](./state-management-ui-patterns.md) | Data fetching and state patterns | ✅ Loading, error, empty, success state handling |
| [role-based-ui-patterns.md](./role-based-ui-patterns.md) | Role-based access and permissions | ✅ Role-based UI adaptations and visibility rules |
| [route-inventory.md](./route-inventory.md) | Route implementation status | ✅ Route status tracking and implementation matrix |
| [route-naming-decision.md](./route-naming-decision.md) | Route naming convention decision | ✅ Route naming standards and conventions |
| [historical-data-routing-proposal.md](./historical-data-routing-proposal.md) | Historical data access patterns | ✅ Historical data routing architecture and patterns |

---

## 🎯 Single Sources of Truth

**CRITICAL:** Each topic has ONE authoritative document. Do not duplicate information.

| Topic | Single Source of Truth | Do NOT Document In |
|-------|----------------------|-------------------|
| **Route paths** | [routing-structure.md](./routing-structure.md) | navigation-layout-patterns.md, role-based-ui-patterns.md |
| **Navigation structure** | [navigation-layout-patterns.md](./navigation-layout-patterns.md) | routing-structure.md, role-based-ui-patterns.md |
| **Route status** | [route-inventory.md](./route-inventory.md) | routing-structure.md |
| **Route naming** | [route-naming-decision.md](./route-naming-decision.md) | routing-structure.md, navigation-layout-patterns.md |
| **Component specifications** | [ui-component-specifications.md](./ui-component-specifications.md) | design-system.md, form-design-patterns.md |
| **Design tokens** | [design-system.md](./design-system.md) | ui-component-specifications.md |
| **Form patterns** | [form-design-patterns.md](./form-design-patterns.md) | ui-component-specifications.md |
| **State patterns** | [state-management-ui-patterns.md](./state-management-ui-patterns.md) | ui-component-specifications.md |
| **Role-based patterns** | [role-based-ui-patterns.md](./role-based-ui-patterns.md) | navigation-layout-patterns.md, routing-structure.md |
| **Historical data routing** | [historical-data-routing-proposal.md](./historical-data-routing-proposal.md) | routing-structure.md, navigation-layout-patterns.md |

---

## 📖 Reading Order by Audience

### For New Frontend Developers

**Start here to understand the frontend architecture:**

1. **README.md** (this document) - Overview and navigation guide
2. **[routing-structure.md](./routing-structure.md)** - Understand route organization and Next.js App Router structure
3. **[navigation-layout-patterns.md](./navigation-layout-patterns.md)** - Understand layout structure and navigation patterns
4. **[design-system.md](./design-system.md)** - Understand design tokens, colors, typography, spacing
5. **[ui-component-specifications.md](./ui-component-specifications.md)** - Understand component library and available components
6. **[state-management-ui-patterns.md](./state-management-ui-patterns.md)** - Understand data fetching, loading states, error handling
7. **[role-based-ui-patterns.md](./role-based-ui-patterns.md)** - Understand role-based access and permissions
8. **[form-design-patterns.md](./form-design-patterns.md)** - Understand form structure and validation patterns

**Reference documents (read as needed):**
- [route-inventory.md](./route-inventory.md) - Check route implementation status
- [route-naming-decision.md](./route-naming-decision.md) - Understand route naming conventions
- [historical-data-routing-proposal.md](./historical-data-routing-proposal.md) - Understand historical data access patterns

### For UI/UX Designers

**Start here to understand design system and components:**

1. **README.md** (this document) - Overview
2. **[design-system.md](./design-system.md)** - Design tokens, colors, typography, spacing system
3. **[ui-component-specifications.md](./ui-component-specifications.md)** - Component library, component API, usage examples
4. **[form-design-patterns.md](./form-design-patterns.md)** - Form structure, validation patterns, user experience guidelines
5. **[navigation-layout-patterns.md](./navigation-layout-patterns.md)** - Layout structure, responsive design, navigation patterns
6. **[role-based-ui-patterns.md](./role-based-ui-patterns.md)** - Role-based UI adaptations and visibility rules

**Reference documents:**
- [routing-structure.md](./routing-structure.md) - Route organization (for understanding page structure)
- [state-management-ui-patterns.md](./state-management-ui-patterns.md) - Loading, error, empty states

### For Implementation (Task-by-Task)

**When implementing a specific task, follow this order:**

1. **[route-inventory.md](./route-inventory.md)** - Check if route exists, what status it has
2. **[routing-structure.md](./routing-structure.md)** - Understand route structure and requirements
3. **[navigation-layout-patterns.md](./navigation-layout-patterns.md)** - Understand navigation structure and layout requirements
4. **Relevant pattern document:**
   - Forms → [form-design-patterns.md](./form-design-patterns.md)
   - Data fetching → [state-management-ui-patterns.md](./state-management-ui-patterns.md)
   - Role-based UI → [role-based-ui-patterns.md](./role-based-ui-patterns.md)
5. **[ui-component-specifications.md](./ui-component-specifications.md)** - Component API and usage details
6. **[design-system.md](./design-system.md)** - Design tokens and styling guidelines

---

## 📊 Implementation Status Summary

**Last Updated:** 2026-01-12

### Route Implementation Status

| Status | Count | Percentage |
|--------|-------|------------|
| ✅ Implemented | 12 | 23.5% |
| ⚠️ Placeholder | 30 | 58.8% |
| 📋 Planned | 9 | 17.6% |
| **Total Routes** | **51** | **100%** |

**Detailed Status:** See [route-inventory.md](./route-inventory.md) for complete route status matrix.

### Documentation Status

| Document | Status | Last Updated |
|----------|--------|--------------|
| design-system.md | ✅ Complete | 2025-01-01 |
| ui-component-specifications.md | ✅ Complete | 2025-01-01 |
| form-design-patterns.md | ✅ Complete | 2025-12-31 |
| state-management-ui-patterns.md | ✅ Complete | 2025-01-01 |
| role-based-ui-patterns.md | ✅ Complete | 2025-12-31 |
| historical-data-routing-proposal.md | ✅ Complete | 2025-01-01 |
| route-naming-decision.md | ✅ Complete | 2026-01-12 |
| route-inventory.md | ✅ Complete | 2026-01-12 |
| routing-structure.md | ⚠️ Partially Complete | 2026-01-12 |
| navigation-layout-patterns.md | ⚠️ Partially Complete | 2026-01-12 |
| README.md | ⚠️ Partially Complete | 2026-01-12 |

**Note:** routing-structure.md and navigation-layout-patterns.md are being updated in Phase 1.1.1.FIX to add implementation status and consolidate content.

---

## 🔍 Quick Reference Guide

### "Where do I find...?"

| I need to find... | Go to... |
|------------------|----------|
| Route paths and structure | [routing-structure.md](./routing-structure.md) |
| Route implementation status | [route-inventory.md](./route-inventory.md) |
| Route naming conventions | [route-naming-decision.md](./route-naming-decision.md) |
| Sidebar navigation structure | [navigation-layout-patterns.md](./navigation-layout-patterns.md) |
| Layout components (Header, Sidebar, MainContent) | [navigation-layout-patterns.md](./navigation-layout-patterns.md) |
| Design tokens (colors, spacing, typography) | [design-system.md](./design-system.md) |
| Component API and usage | [ui-component-specifications.md](./ui-component-specifications.md) |
| Form structure and validation | [form-design-patterns.md](./form-design-patterns.md) |
| Loading/error/empty states | [state-management-ui-patterns.md](./state-management-ui-patterns.md) |
| Role-based UI adaptations | [role-based-ui-patterns.md](./role-based-ui-patterns.md) |
| Historical data routing | [historical-data-routing-proposal.md](./historical-data-routing-proposal.md) |

### "I'm implementing a..."

| Task Type | Read These Documents |
|-----------|---------------------|
| **New route/page** | route-inventory.md → routing-structure.md → navigation-layout-patterns.md → relevant pattern doc → ui-component-specifications.md |
| **New form** | form-design-patterns.md → ui-component-specifications.md → design-system.md |
| **New component** | ui-component-specifications.md → design-system.md |
| **Role-based feature** | role-based-ui-patterns.md → routing-structure.md → navigation-layout-patterns.md |
| **Data fetching** | state-management-ui-patterns.md → ui-component-specifications.md |
| **Historical data feature** | historical-data-routing-proposal.md → routing-structure.md → state-management-ui-patterns.md |

---

## 🔗 Document Relationships

```
README.md (this document)
├── routing-structure.md (route definitions)
│   ├── route-inventory.md (route status)
│   └── route-naming-decision.md (naming conventions)
├── navigation-layout-patterns.md (navigation structure)
│   └── routing-structure.md (route references)
├── design-system.md (design tokens)
│   └── ui-component-specifications.md (component styling)
├── ui-component-specifications.md (component library)
│   ├── design-system.md (design tokens)
│   ├── form-design-patterns.md (form components)
│   └── state-management-ui-patterns.md (state components)
├── form-design-patterns.md (form patterns)
│   ├── ui-component-specifications.md (form components)
│   └── design-system.md (form styling)
├── state-management-ui-patterns.md (state patterns)
│   └── ui-component-specifications.md (state components)
├── role-based-ui-patterns.md (role-based UI)
│   ├── routing-structure.md (role-based routes)
│   └── navigation-layout-patterns.md (role-based navigation)
└── historical-data-routing-proposal.md (historical data)
    ├── routing-structure.md (historical routes)
    └── state-management-ui-patterns.md (data fetching)
```

---

## 📝 Document Update Guidelines

**When updating frontend documentation:**

1. **Check single source of truth** - Is this the right document for this information?
2. **Update cross-references** - If you change content, update related documents' cross-references
3. **Update route-inventory.md** - If route status changes, update route-inventory.md
4. **Update this README** - If document status changes, update the status table above
5. **Follow document headers** - Each document has a header with purpose, status, owner, last updated

---

## 🚨 Common Mistakes to Avoid

1. **❌ Don't duplicate route definitions** - Routes are ONLY in routing-structure.md
2. **❌ Don't duplicate navigation structure** - Navigation structure is ONLY in navigation-layout-patterns.md
3. **❌ Don't document route status in routing-structure.md** - Route status is ONLY in route-inventory.md
4. **❌ Don't add route examples to navigation-layout-patterns.md** - Link to routing-structure.md instead
5. **❌ Don't skip cross-references** - Always add "Related Documents" section when creating/updating docs

---

## 📚 Related Documentation

### Architecture Documentation
- [System Architecture](../system-architecture.md) - Overall system architecture
- [Workflow Architecture](../workflow-architecture.md) - Workflow and state machine design
- [Deployment Architecture](../deployment-architecture.md) - Deployment and infrastructure

### Project Management
- [Phase 1 Implementation Plan](../../05-project-management/phases/Phase-1-Implementation-Plan.md) - Implementation plan with wireframe references
- [Phase 0.5: UI/UX Wireframes](../../05-project-management/phases/phase-0-5-ui-ux-wireframes.md) - Wireframe specifications
- [Wireframe-First Implementation Principle](../../05-project-management/phases/wireframe-first-implementation-principle.md) - Core implementation directive

### Development
- [Development Setup](../../06-development/development-setup.md) - Development environment setup
- [Technical Decisions](../../06-development/technical-decisions/decision-log.md) - Architectural decisions

---

**Last Updated:** 2026-01-12  
**Status:** ⚠️ PARTIALLY COMPLETE - Documentation consolidation in progress (Phase 1.1.1.FIX)
