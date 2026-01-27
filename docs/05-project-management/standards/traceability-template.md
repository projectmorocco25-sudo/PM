# Traceability Template Standard

**Purpose:** This document defines the standard traceability template structure for linking implementation tasks to their design artifacts, routes, database tables, and API functions.

**Last Updated:** 2025-01-15  
**Version:** 1.0

---

## Overview

All implementation tasks in Phase 1+ should include traceability links to ensure proper alignment between:
- **Design** (wireframes)
- **Frontend** (routes, components)
- **Backend** (database tables, RPC functions)
- **Architecture** (feature index, integration contracts)

---

## Template Structure by Task Type

### 1. Frontend Tasks

**Use for:** All UI/UX implementation tasks (pages, components, forms, lists, etc.)

**Template:**
```markdown
- [ ] **Task X.X.X.X:** [Task description]
  - 📐 **Wireframe:** [wireframe-link](path/to/wireframe.md)
  - 🛣️ **Route:** `/module/page` ([routing-structure.md](../../02-architecture/frontend/routing-structure.md#section))
  - 💾 **Database:** `table_name`, `related_table` ([feature-index.md](../../02-architecture/feature-index.md#feature-name))
  - 🔌 **API:** `rpc_function_name()`, `another_function()` ([feature-index.md](../../02-architecture/feature-index.md#feature-name))
```

**Example:**
```markdown
- [ ] **Task 1.1.2.17:** Implement Companies list page
  - 📐 **Wireframe:** [task-0.5.2.2](../../04-design/user-experience/wireframes/01-rmm/companies/task-0.5.2.2-companies-list.md)
  - 🛣️ **Route:** `/rmm/companies` ([routing-structure.md](../../02-architecture/frontend/routing-structure.md#rmm-routes))
  - 💾 **Database:** `companies` table ([feature-index.md](../../02-architecture/feature-index.md#company-management))
  - 🔌 **API:** `rmm_list_companies()`, `rmm_get_company()` ([feature-index.md](../../02-architecture/feature-index.md#company-management))
```

**Guidelines:**
- Always include wireframe link (use wireframe catalog if multiple wireframes)
- Route should match routing-structure.md exactly
- List all database tables the page reads/writes
- List all RPC functions the page calls
- Reference feature-index.md for feature documentation

---

### 2. Backend Tasks (RPC Functions, Database Migrations)

**Use for:** Database migrations, RPC function creation, RLS policies, triggers, etc.

**Template:**
```markdown
- [ ] **Task X.X.X.X:** [Task description]
  - 💾 **Database:** `table_name`, `related_table` ([feature-index.md](../../02-architecture/feature-index.md#feature-name))
  - 🔌 **API:** `rpc_function_name()` or schema/documentation reference ([feature-index.md](../../02-architecture/feature-index.md#feature-name))
```

**Example:**
```markdown
- [ ] **Task 1.1.2.1:** Create RMM RPC functions - Company CRUD
  - 💾 **Database:** `companies`, `registry_submissions` ([feature-index.md](../../02-architecture/feature-index.md#company-management))
  - 🔌 **API:** `rmm_create_company()`, `rmm_update_company()`, `rmm_get_company()`, `rmm_list_companies()`, `rmm_submit_registry_update()` ([feature-index.md](../../02-architecture/feature-index.md#company-management))
```

**Guidelines:**
- List all tables created/modified/accessed
- List all RPC functions created (or reference if many)
- For migrations, reference data-dictionary.md
- For RLS policies, reference security-architecture.md
- For integration contracts, reference module-integration-contracts.md

---

### 3. Testing Tasks

**Use for:** Unit tests, integration tests, end-to-end tests

**Template:**
```markdown
- [ ] **Task X.X.X.X:** [Test description]
  - 💾 **Database:** `table_name` or "All [module] tables" ([feature-index.md](../../02-architecture/feature-index.md#feature-name))
  - 🔌 **API:** `rpc_function_name()` or "All [module] RPC functions" ([feature-index.md](../../02-architecture/feature-index.md#feature-name))
```

**Example:**
```markdown
- [ ] **Task 1.1.3.1:** Create RMM module test suite (unit tests for RPC functions)
  - 💾 **Database:** All RMM tables (companies, products, skus, registry_submissions, enforcement_actions) ([feature-index.md](../../02-architecture/feature-index.md#rmm-module-features))
  - 🔌 **API:** All RMM RPC functions ([feature-index.md](../../02-architecture/feature-index.md#rmm-module-features))
```

**Guidelines:**
- Reference what is being tested (tables, functions)
- For security testing, reference security-architecture.md
- For integration testing, reference module-integration-contracts.md

---

### 4. Seed Data Tasks

**Use for:** Seed data generation scripts, seed data population, seed data validation

**Template:**
```markdown
- [ ] **Task X.X.X.X:** [Seed data description]
  - 💾 **Database:** `table_name` ([feature-index.md](../../02-architecture/feature-index.md#feature-name))
  - 🔌 **API:** Seed data generation scripts ([planning/seed-data-playbook.md](planning/seed-data-playbook.md))
```

**Example:**
```markdown
- [ ] **Task 1.1.3.6:** Create comprehensive RMM seed data (75 companies, products, SKUs)
  - 💾 **Database:** `companies`, `products`, `skus`, `atc_codes`, `critical_medicines` ([feature-index.md](../../02-architecture/feature-index.md#rmm-module-features))
  - 🔌 **API:** Seed data generation scripts ([planning/seed-data-playbook.md](planning/seed-data-playbook.md))
```

**Guidelines:**
- List all tables populated by seed data
- Reference seed data playbook/documentation
- For validation tasks, omit API reference or reference validation scripts

---

### 5. Documentation Tasks

**Use for:** User documentation, API documentation, system documentation

**Template:**
```markdown
- [ ] **Task X.X.X.X:** [Documentation description]
  - 💾 **Database:** All [module] tables ([feature-index.md](../../02-architecture/feature-index.md#module-features))
  - 🔌 **API:** All [module] RPC functions ([feature-index.md](../../02-architecture/feature-index.md#module-features))
  - 📐 **Wireframe:** All [module] wireframes ([phase-0-5-wireframes-catalog.md](../Archive/phase-0-5-wireframes-catalog.md))
```

**Example:**
```markdown
- [ ] **Task 1.1.3.9:** Create RMM module user documentation
  - 💾 **Database:** All RMM tables ([feature-index.md](../../02-architecture/feature-index.md#rmm-module-features))
  - 🔌 **API:** All RMM RPC functions ([feature-index.md](../../02-architecture/feature-index.md#rmm-module-features))
  - 📐 **Wireframe:** All RMM wireframes ([phase-0-5-wireframes-catalog.md](../Archive/phase-0-5-wireframes-catalog.md))
```

**Guidelines:**
- Include wireframe reference for user-facing documentation
- Reference all relevant tables and functions for the module
- For API documentation, focus on API references
- For user documentation, include wireframe references

---

### 6. Integration Checkpoint Validation Tasks

**Use for:** Data model validation, RLS policy validation, API contract validation, seed data validation

**Template:**
```markdown
- [ ] **Task X.X.X.X:** [Validation description] - [What is validated]
  - 💾 **Database:** [Module] tables for [target module] integration ([feature-index.md](../../02-architecture/feature-index.md#feature-dependency-matrix))
  - 🔌 **API:** Module integration contracts ([module-integration-contracts.md](../../02-architecture/integration/module-integration-contracts.md))
```

**Example:**
```markdown
- [ ] **Task 1.1.3.11:** Data Model Validation (Nadia) - Verify RMM schema supports VCI requirements
  - 💾 **Database:** RMM tables (companies, products, skus) for VCI integration ([feature-index.md](../../02-architecture/feature-index.md#feature-dependency-matrix))
  - 🔌 **API:** Module integration contracts ([module-integration-contracts.md](../../02-architecture/integration/module-integration-contracts.md))
```

**Guidelines:**
- Reference source module tables and target module requirements
- Always reference feature-dependency-matrix for integration validations
- Reference module-integration-contracts.md for API contract validations
- Reference security-architecture.md for RLS policy validations

---

### 7. Performance Testing Tasks

**Use for:** Load testing, performance benchmarking, query optimization

**Template:**
```markdown
- [ ] **Task X.X.X.X:** [Performance test description]
  - 💾 **Database:** [Tables being tested] ([feature-index.md](../../02-architecture/feature-index.md))
  - 🔌 **API:** [Functions being tested] ([feature-index.md](../../02-architecture/feature-index.md))
```

**Example:**
```markdown
- [ ] **Task 1.5.2.1:** Perform load testing - 75 companies concurrent access
  - 💾 **Database:** All module tables ([feature-index.md](../../02-architecture/feature-index.md))
  - 🔌 **API:** All RPC functions ([feature-index.md](../../02-architecture/feature-index.md))
```

**Guidelines:**
- Reference all relevant tables/functions being tested
- For RLS performance, reference security-architecture.md
- For query optimization, reference database documentation

---

### 8. Security Testing Tasks

**Use for:** Security audits, authentication testing, authorization testing

**Template:**
```markdown
- [ ] **Task X.X.X.X:** Perform security audit - [Audit area]
  - 💾 **Database:** [Relevant tables] ([feature-index.md](../../02-architecture/feature-index.md))
  - 🔌 **API:** [Security functions] ([security-architecture.md](../../02-architecture/security/security-architecture.md))
```

**Example:**
```markdown
- [ ] **Task 1.5.2.9:** Perform security audit - Authentication and authorization
  - 💾 **Database:** `users`, `system_config` ([feature-index.md](../../02-architecture/feature-index.md#core-foundation-features))
  - 🔌 **API:** Authentication and authorization functions ([security-architecture.md](../../02-architecture/security/security-architecture.md))
```

**Guidelines:**
- Always reference security-architecture.md
- Reference specific security documentation (RLS, input validation, audit logging) as appropriate
- List tables and functions being audited

---

### 9. Edge Case Testing Tasks

**Use for:** Edge case scenarios, error handling, boundary conditions

**Template:**
```markdown
- [ ] **Task X.X.X.X:** Test edge cases - [Edge case description]
  - 💾 **Database:** [Relevant tables] ([feature-index.md](../../02-architecture/feature-index.md#feature-name))
  - 🔌 **API:** [Relevant functions] ([feature-index.md](../../02-architecture/feature-index.md#feature-name))
```

**Example:**
```markdown
- [ ] **Task 1.5.3.1:** Test edge cases - Late AAMS submissions
  - 💾 **Database:** `aams_submissions` ([feature-index.md](../../02-architecture/feature-index.md#aams-annual-average-monthly-sales))
  - 🔌 **API:** AAMS submission and deadline validation functions ([feature-index.md](../../02-architecture/feature-index.md#aams-annual-average-monthly-sales))
```

**Guidelines:**
- Reference specific tables/functions related to the edge case
- For error handling, reference backend-error-handling-framework.md
- For concurrency, reference database-concurrency-control-strategy.md

---

## Common Reference Documents

### Architecture Documents
- `feature-index.md` - Master feature index with all routes, tables, APIs
- `routing-structure.md` - Frontend route definitions
- `wireframe-route-mapping.md` - Wireframe to route mapping
- `data-dictionary.md` - Database schema documentation
- `module-integration-contracts.md` - Cross-module integration specs

### Security Documents
- `security-architecture.md` - Overall security architecture
- `rls-policy-framework.md` - RLS policy documentation
- `backend-validation-strategy.md` - Input validation
- `backend-error-handling-framework.md` - Error handling
- `audit-logging-spec.md` - Audit logging

### Design Documents
- `phase-0-5-wireframes-catalog.md` - Complete wireframe catalog
- Individual wireframe files in `04-design/user-experience/wireframes/`

### Database Documents
- `database-concurrency-control-strategy.md` - Concurrency handling
- `database-transaction-management-strategy.md` - Transaction management

### Seed Data Documents
- `planning/seed-data-playbook.md` - Seed data playbook and strategy

---

## Emoji Legend

- 📐 **Wireframe** - Design wireframe reference
- 🛣️ **Route** - Frontend route/path
- 💾 **Database** - Database table(s) or schema
- 🔌 **API** - RPC function(s) or API endpoint(s)

---

## Best Practices

1. **Consistency:** Always use the same structure for similar task types
2. **Completeness:** Include all relevant references (don't skip fields)
3. **Accuracy:** Verify links point to correct sections in target documents
4. **Specificity:** Use specific table/function names, not generic references
5. **Maintainability:** Update links if documents are reorganized
6. **Cross-referencing:** Use feature-index.md as the primary cross-reference hub

---

## Template Application Checklist

When adding traceability to a task, verify:

- [ ] Task type is correctly identified (frontend/backend/testing/etc.)
- [ ] Appropriate template variant is used
- [ ] All relevant emoji sections are included
- [ ] Links point to correct documents and sections
- [ ] Table/function names match actual implementation
- [ ] Feature-index.md references use correct anchor links
- [ ] Wireframe links are valid (if applicable)
- [ ] Route paths match routing-structure.md exactly

---

## Examples by Module

### RMM Module Example
```markdown
- [ ] **Task 1.1.2.17:** Implement Companies list page
  - 📐 **Wireframe:** [task-0.5.2.2](../../04-design/user-experience/wireframes/01-rmm/companies/task-0.5.2.2-companies-list.md)
  - 🛣️ **Route:** `/rmm/companies` ([routing-structure.md](../../02-architecture/frontend/routing-structure.md#rmm-routes))
  - 💾 **Database:** `companies` table ([feature-index.md](../../02-architecture/feature-index.md#company-management))
  - 🔌 **API:** `rmm_list_companies()`, `rmm_get_company()` ([feature-index.md](../../02-architecture/feature-index.md#company-management))
```

### VCI Module Example
```markdown
- [ ] **Task 1.2.1.3:** Create VCI RPC function - AAMS submission
  - 💾 **Database:** `aams_submissions` ([feature-index.md](../../02-architecture/feature-index.md#aams-annual-average-monthly-sales))
  - 🔌 **API:** `vci_submit_aams()` ([feature-index.md](../../02-architecture/feature-index.md#aams-annual-average-monthly-sales))
```

### ECS Module Example
```markdown
- [ ] **Task 1.3.2.7:** Implement threshold switching logic (VCI Threshold → ECS Threshold on authorization) ⚠️ **CRITICAL:** Must be implemented BEFORE authorization RPC function (1.3.2.6)
  - 💾 **Database:** `thresholds` (VCI and ECS), `export_authorizations` ([feature-index.md](../../02-architecture/feature-index.md#ecs-module-features))
  - 🔌 **API:** Threshold switching functions (used by authorization RPC) ([feature-index.md](../../02-architecture/feature-index.md#feature-dependency-matrix))
```

### CMC Module Example
```markdown
- [ ] **Task 1.4.2.1:** Create CMC RPC function - Monthly score calculation
  - 💾 **Database:** `compliance_scores`, all module data sources ([feature-index.md](../../02-architecture/feature-index.md#cmc-module-features))
  - 🔌 **API:** `cmc_calculate_monthly_scores()` ([feature-index.md](../../02-architecture/feature-index.md#cmc-module-features))
```

---

## Notes

- This template was first applied comprehensively in Phase 1
- Future phases (Phase 2, Phase 3, etc.) should follow this same structure
- If new task types emerge, add them to this document
- Keep this document updated as the project evolves

---

## Version History

- **v1.0** (2025-01-15): Initial template structure based on Phase 1 implementation
