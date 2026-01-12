# Phase 1 Implementation Standards

**Purpose:** Defines standards, definitions of done, and task completion criteria for Phase 1 implementation

**Created:** 2025-01-21  
**Status:** Active  
**Owner:** Oliver (Chief Architect)  
**Applies To:** Phase 1 Implementation Plan

---

## Overview

This document provides standardized criteria for task completion, task format specifications, testing requirements, and implementation standards for Phase 1. All tasks in the Phase 1 Implementation Plan should conform to these standards.

---

## Task Format Specification

### Standard Task Format

All tasks in Phase 1 should follow this format (when applicable):

```markdown
- [ ] **Task ID:** Task Title (brief description)
  - **Reference:** [Link to architecture doc/wireframe/schema]
  - **Estimated Time:** X-Y hours (or TBD if unknown)
  - **Depends on:** Task X, Task Y (if applicable)
  - **Key Requirements:**
    - Requirement 1
    - Requirement 2
    - Requirement 3
  - **Acceptance Criteria:** See [Definition of Done - Task Type] below (or specific criteria)
  - **Testing:** [Testing requirements or "See testing standards below"]
  - **Notes:** Additional context if needed
```

### Format Guidelines

1. **Task ID:** Use consistent numbering (e.g., Task 1.1.1.2a)
2. **Title:** Brief, actionable description (verb + object)
3. **Reference:** Always link to relevant architecture docs, wireframes, or schema
4. **Estimated Time:** Include realistic estimates or mark as TBD
5. **Dependencies:** List prerequisite tasks explicitly
6. **Key Requirements:** 2-5 bullet points highlighting critical requirements
7. **Acceptance Criteria:** Reference standard DoD or specify custom criteria
8. **Testing:** Reference testing standards or specify test requirements
9. **Notes:** Optional context, warnings, or implementation hints

---

## Task Format Examples

The following examples show how to format tasks using the standard format. These examples demonstrate the before/after transformation and highlight the value of detailed task descriptions.

### Example 1: Database Migration Task

**Before (Minimal Format):**
```markdown
- [ ] **Task 1.1.1.2a:** Create all indexes per schema-design.md (performance indexes for foreign keys, query patterns)
```

**After (Standard Format):**
```markdown
- [ ] **Task 1.1.1.2a:** Create all indexes per schema-design.md (performance indexes for foreign keys, query patterns)
  - **Reference:** [Schema Design](../../02-architecture/database/schema-design.md) - Index specifications
  - **Estimated Time:** 2-4 hours
  - **Depends on:** Task 1.1.1.2, Task 1.1.1.2d, Task 1.1.1.2e (all table migrations complete)
  - **Key Requirements:**
    - Create indexes for all foreign keys
    - Create indexes for common query patterns (filters, sorting)
    - Create composite indexes for multi-column queries
    - Verify index creation using pg_indexes
  - **Acceptance Criteria:** See [Definition of Done - Database Migration Tasks](#database-migration-tasks)
  - **Testing:** Verify all indexes exist, test query performance improvement
  - **Notes:** Use schema-design.md as source of truth for all index specifications
```

**Improvements:**
- Added reference to schema documentation
- Added time estimate for planning
- Explicit dependencies prevent starting before prerequisites
- Key requirements clarify what needs to be done
- Acceptance criteria reference standard DoD
- Testing requirements ensure verification

---

### Example 2: RPC Function Task

**Before (Minimal Format):**
```markdown
- [ ] **Task 1.1.1.4a:** Implement `shared_get_user_permissions` RPC function (role-based permissions, permission matrix)
```

**After (Standard Format):**
```markdown
- [ ] **Task 1.1.1.4a:** Implement `shared_get_user_permissions` RPC function (role-based permissions, permission matrix)
  - **Reference:** [RPC Function Specifications](../../02-architecture/api/rpc-functions.md#shared_get_user_permissions)
  - **Estimated Time:** 4-6 hours
  - **Depends on:** Task 1.1.1.3 (users table and RLS policies)
  - **Key Requirements:**
    - Return permissions object based on user role
    - Support all defined roles (tier1, tier2_officer, tier2_registrar, company_admin, etc.)
    - Return format: JSON object with permission flags
    - Cache permissions (if caching strategy defined)
  - **Acceptance Criteria:** See [Definition of Done - RPC Function Tasks](#rpc-function-tasks)
  - **Testing:** Unit tests for all roles, test invalid user_id, test permission matrix correctness
  - **Notes:** Permission matrix defined in [RBAC Policy Framework](../../02-architecture/security/rls-policy-framework.md)
```

**Improvements:**
- Reference to RPC function specification document
- Time estimate for planning
- Dependency on users table makes sense
- Key requirements clarify what the function should do
- Testing requirements specify what needs to be tested
- Notes point to permission matrix location

---

### Example 3: RLS Policy Task

**Before (Minimal Format):**
```markdown
- [ ] **Task 1.1.1.3a:** Implement RLS policies for `users` table (company users see own record, MOH see all, self-service profile updates)
```

**After (Standard Format):**
```markdown
- [ ] **Task 1.1.1.3a:** Implement RLS policies for `users` table (company users see own record, MOH see all, self-service profile updates)
  - **Reference:** [RLS Policy Framework](../../02-architecture/security/rls-policy-framework.md) - Users table policies
  - **Estimated Time:** 2-3 hours
  - **Depends on:** Task 1.1.1.2 (users table created)
  - **Key Requirements:**
    - SELECT policy: Company users see own record, MOH see all users
    - UPDATE policy: Users can update own profile fields (self-service)
    - UPDATE policy: MOH can update any user (for user management)
    - Verify company isolation (company users cannot see other companies' users)
  - **Acceptance Criteria:** See [Definition of Done - RLS Policy Tasks](#rls-policy-tasks)
  - **Testing:** Test with company users (verify isolation), test with MOH users (verify system-wide access), test self-service updates
  - **Notes:** Profile update fields: full_name, avatar_url, timezone, language, notification_preferences (Phase 0.6 additions)
```

**Improvements:**
- Reference to RLS policy framework
- Time estimate
- Dependency on table creation
- Key requirements break down the policy logic
- Testing requirements specify role-based tests
- Notes include Phase 0.6 context

---

### Example 4: Frontend Component Task

**Before (Minimal Format):**
```markdown
- [ ] **Task 1.1.2.17:** Implement Companies list page (table view, filters, search, pagination) - **Wireframe:** [Task 0.5.2.2 - Companies List](../../04-design/user-experience/wireframes/01-rmm/companies/task-0.5.2.2-companies-list.md)
```

**After (Standard Format):**
```markdown
- [ ] **Task 1.1.2.17:** Implement Companies list page (table view, filters, search, pagination)
  - **Wireframe:** [Task 0.5.2.2 - Companies List](../../04-design/user-experience/wireframes/01-rmm/companies/task-0.5.2.2-companies-list.md)
  - **Reference:** [UI Component Specifications](../../02-architecture/frontend/ui-component-specifications.md) - DataTable component
  - **Estimated Time:** 8-12 hours
  - **Depends on:** Task 1.1.1.17a (DataTable component), Task 1.1.2.1 (RMM RPC functions)
  - **Key Requirements:**
    - Table view with columns: Name, Type, Status, Actions
    - Filters: Company type (IPC, Wholesaler), Status (Active, Inactive)
    - Search: Filter by company name
    - Pagination: 25 items per page (configurable)
    - Role-based: MOH see all companies, company users see only own company
  - **Acceptance Criteria:** See [Definition of Done - Frontend Component Tasks](#frontend-component-tasks)
  - **Testing:** Visual comparison with wireframe, test filters, test search, test pagination, test role-based access, accessibility testing
  - **Notes:** Use DataTable component from ui-component-specifications.md, wireframe is the primary design reference
```

**Improvements:**
- Wireframe reference maintained (critical for frontend)
- Additional reference to component specifications
- Time estimate for planning
- Dependencies on prerequisite components and backend
- Key requirements break down the feature
- Testing requirements include wireframe compliance
- Notes emphasize wireframe-first principle

---

### Example 5: Task with Complex Dependencies

**Before (Minimal Format):**
```markdown
- [ ] **Task 1.1.1.2b:** Implement database constraints (check constraints, unique constraints, foreign key constraints)
```

**After (Standard Format):**
```markdown
- [ ] **Task 1.1.1.2b:** Implement database constraints (check constraints, unique constraints, foreign key constraints)
  - **Reference:** [Schema Design](../../02-architecture/database/schema-design.md) - Constraint specifications
  - **Estimated Time:** 3-5 hours
  - **Depends on:** Task 1.1.1.2, Task 1.1.1.2d, Task 1.1.1.2e (all tables created before constraints)
  - **Key Requirements:**
    - Foreign key constraints: All relationships defined in schema-design.md
    - Unique constraints: All unique fields/combinations per schema
    - Check constraints: All validation rules (enums, ranges, business rules)
    - Verify constraint enforcement (test invalid data rejection)
  - **Acceptance Criteria:** See [Definition of Done - Database Migration Tasks](#database-migration-tasks)
  - **Testing:** Test foreign key violations, test unique constraint violations, test check constraint violations, verify all constraints exist
  - **Notes:** Constraints are critical for data integrity, test thoroughly with invalid data to ensure they work
```

**Improvements:**
- Reference to schema documentation
- Time estimate
- Explicit dependencies prevent constraint creation before tables
- Key requirements clarify constraint types
- Testing requirements ensure constraints work
- Notes emphasize importance

---

## Applying the Standard Format

### When to Use Full Format

Use the full standard format for:
- **Complex tasks** requiring multiple steps or decisions
- **Critical path tasks** that block other work
- **Tasks with dependencies** that need explicit documentation
- **Tasks requiring coordination** between team members

### When Minimal Format is Acceptable

Minimal format (title only) is acceptable for:
- **Simple, self-explanatory tasks** (e.g., "Install package X")
- **Tasks that are part of a larger task** with detailed parent task
- **Tasks with clear, obvious requirements** (e.g., "Run migration script X")

However, even minimal tasks benefit from:
- **Reference link** (if applicable)
- **Estimated Time** (for planning)
- **Dependencies** (if not obvious from task ordering)

### Conversion Guidelines

When converting existing tasks to the standard format:

1. **Start with the title** - Keep it clear and actionable
2. **Add references** - Link to architecture docs, wireframes, or schemas
3. **Estimate time** - Even rough estimates help with planning
4. **List dependencies** - Explicit dependencies prevent issues
5. **Identify key requirements** - What must be done? (2-5 bullets)
6. **Reference DoD** - Use standard Definition of Done
7. **Specify testing** - What needs to be tested?
8. **Add notes** - Context, warnings, or implementation hints

### Incremental Adoption

Tasks don't need to be converted all at once. Recommended approach:

1. **Start with Phase 1.1.1 tasks** - These are first to be implemented
2. **Convert tasks as work begins** - Update format when starting work on a task
3. **Use examples as templates** - Reference examples when creating new tasks
4. **Focus on critical path** - Prioritize formatting for blocking tasks

---

## Definition of Done

### Database Migration Tasks

**Task Types:** Tasks that create/modify database schema (tables, indexes, constraints, triggers)

**Completion Criteria:**
- [ ] Migration script executes without errors in development environment
- [ ] All tables/fields created per schema-design.md specifications
- [ ] All indexes created and verified (check index existence)
- [ ] All constraints validated (foreign keys, check constraints, unique constraints)
- [ ] Migration tested in staging environment
- [ ] Rollback script created and tested
- [ ] Migration script reviewed by database specialist (Nadia)
- [ ] Schema changes documented in schema-change-log.md (if applicable)
- [ ] Data integrity verified (no data loss, constraints work correctly)

**Testing Requirements:**
- Manual verification of schema changes in database
- Test constraint enforcement (try to insert invalid data, verify rejection)
- Test foreign key relationships
- Verify index creation (check pg_indexes)
- Test rollback script

---

### RPC Function Tasks

**Task Types:** Tasks that create PostgreSQL RPC functions (stored procedures)

**Completion Criteria:**
- [ ] Function signature matches specification in rpc-functions.md (if exists)
- [ ] All business logic implemented per requirements
- [ ] Error handling implemented per backend-error-handling-framework.md
- [ ] Input validation implemented (parameter validation, type checking)
- [ ] RLS policies enforced (security checks, permission validation)
- [ ] Function documented (parameters, return type, behavior, examples)
- [ ] Unit tests written and passing (if test framework exists)
- [ ] Function tested manually with valid and invalid inputs
- [ ] Edge cases tested (null values, boundary conditions, concurrent access)
- [ ] Code reviewed by RPC function specialist (Maya)

**Testing Requirements:**
- Unit tests for happy path
- Unit tests for error cases (invalid input, permission denied, etc.)
- Integration tests with actual database
- Performance testing (if applicable)
- Test with concurrent requests (if applicable)

**Documentation Requirements:**
- Function signature documented
- Parameters documented (name, type, description, constraints)
- Return type documented
- Behavior documented (what the function does)
- Examples provided (SQL call examples)
- Error cases documented

---

### RLS Policy Tasks

**Task Types:** Tasks that implement Row Level Security policies

**Completion Criteria:**
- [ ] RLS enabled on table
- [ ] All required policies created (SELECT, INSERT, UPDATE, DELETE as needed)
- [ ] Policy logic matches RLS policy framework specifications
- [ ] Policies tested with different user roles
- [ ] Company data isolation verified (company users cannot see other companies' data)
- [ ] MOH access verified (MOH users can see system-wide data)
- [ ] Permission boundaries tested (users cannot access data they shouldn't)
- [ ] Policies documented (purpose, access rules, role requirements)
- [ ] Code reviewed by RLS specialist (Rafi)

**Testing Requirements:**
- Test with company users (verify isolation)
- Test with MOH users (verify system-wide access)
- Test with different roles (Tier 1, Tier 2, company_admin, etc.)
- Test permission boundaries (try to access unauthorized data, verify denial)
- Test policy performance (if applicable)

---

### Edge Function Tasks

**Task Types:** Tasks that create Supabase Edge Functions (Deno serverless functions)

**Completion Criteria:**
- [ ] Edge Function created and deployed to Supabase
- [ ] Function handles errors appropriately (try-catch, error responses)
- [ ] Environment variables configured
- [ ] Function tested in development environment
- [ ] Function tested with valid and invalid inputs
- [ ] Function logs appropriately (for debugging)
- [ ] Function documented (purpose, triggers, inputs, outputs)
- [ ] Code reviewed by Edge Functions specialist (Leila)

**Testing Requirements:**
- Manual testing with valid inputs
- Manual testing with invalid inputs
- Test error handling
- Test logging (verify logs are created)
- Test environment variable access

---

### Frontend Component Tasks

**Task Types:** Tasks that create React components, pages, or UI elements

**Completion Criteria:**
- [ ] Component/page matches wireframe specifications (layout, styling, interactions)
- [ ] All required props/state implemented
- [ ] Error states implemented (loading, error, empty states)
- [ ] Accessibility features implemented (ARIA labels, keyboard navigation, focus management)
- [ ] Responsive design implemented (mobile, tablet, desktop breakpoints)
- [ ] Component tested (unit tests or manual testing)
- [ ] Component documented (props, usage examples)
- [ ] Code reviewed by frontend specialist (Emma)
- [ ] Wireframe compliance verified (matches wireframe design)

**Testing Requirements:**
- Visual comparison with wireframe
- Manual testing of interactions (click, hover, keyboard, touch)
- Test error states (loading, error, empty)
- Test responsive breakpoints
- Accessibility testing (keyboard navigation, screen reader)
- Browser compatibility testing (if applicable)

**Wireframe Compliance:**
- Layout matches wireframe (structure, spacing, positioning)
- Components match wireframe (buttons, inputs, tables, cards)
- Interactions match wireframe (click, hover, keyboard, touch)
- States implemented (loading, error, empty, success)
- Role-based variations implemented (if applicable)
- Responsive breakpoints match wireframe

---

### Frontend Integration Tasks

**Task Types:** Tasks that integrate frontend with backend (API calls, state management, routing)

**Completion Criteria:**
- [ ] API integration implemented (RPC calls, error handling)
- [ ] State management implemented (TanStack Query, React Context as needed)
- [ ] Loading states implemented
- [ ] Error handling implemented (error messages, retry logic)
- [ ] Routing implemented (if applicable)
- [ ] Integration tested (test actual API calls)
- [ ] Error scenarios tested (network errors, API errors, validation errors)
- [ ] Code reviewed by frontend specialist (Emma)

**Testing Requirements:**
- Test API integration (test actual RPC calls)
- Test error handling (simulate network errors, API errors)
- Test loading states
- Test state management (verify state updates correctly)
- Test routing (if applicable)

---

### Testing Tasks

**Task Types:** Tasks that create test suites, test frameworks, or test infrastructure

**Completion Criteria:**
- [ ] Test framework set up and configured
- [ ] Test infrastructure created (test database, test utilities, fixtures)
- [ ] Test suite covers specified functionality
- [ ] Tests are repeatable and isolated
- [ ] Tests pass consistently
- [ ] Test documentation created (how to run tests, test structure)
- [ ] Code reviewed by QA specialist (Hassan)

**Testing Requirements:**
- Tests run successfully
- Tests are isolated (don't depend on external state)
- Tests are repeatable (same results each run)
- Test coverage meets requirements (if coverage targets defined)

---

### Documentation Tasks

**Task Types:** Tasks that create user documentation, API documentation, or developer documentation

**Completion Criteria:**
- [ ] Documentation covers all required topics
- [ ] Documentation is clear and understandable
- [ ] Documentation includes examples (if applicable)
- [ ] Documentation is reviewed by subject matter expert
- [ ] Documentation is accessible (proper location, formatting)

**Quality Standards:**
- Clear, concise language
- Proper formatting (headings, lists, code blocks)
- Examples provided (if applicable)
- Screenshots or diagrams (if helpful)
- Table of contents (for long documents)

---

## Testing Standards

### Unit Testing

**Scope:** Individual functions, components, or modules

**Requirements:**
- Test happy path (normal operation)
- Test error cases (invalid input, error conditions)
- Test edge cases (boundary conditions, null values)
- Tests are isolated (don't depend on external services)
- Tests are repeatable (same results each run)

**Tools:**
- Backend: PostgreSQL function testing (pgTAP or manual SQL tests)
- Frontend: Jest + React Testing Library

---

### Integration Testing

**Scope:** Multiple components/modules working together

**Requirements:**
- Test data flows between components
- Test API integration (RPC functions, Edge Functions)
- Test database integration (queries, transactions)
- Test cross-module integration (RMM→VCI, VCI→ECS, etc.)
- Use test database with realistic test data

**Tools:**
- Backend: Integration test framework (test database setup)
- Frontend: Integration tests with mocked or real API

---

### End-to-End (E2E) Testing

**Scope:** Complete user workflows

**Requirements:**
- Test complete user workflows (e.g., submission → approval → implementation)
- Test user interactions (clicks, form submissions, navigation)
- Test across multiple pages/components
- Use realistic test data
- Test with different user roles

**Tools:**
- Playwright or Cypress (for browser automation)

---

### Accessibility Testing

**Scope:** All frontend components and pages

**Requirements:**
- Keyboard navigation works (Tab, Enter, Escape, arrow keys)
- Screen reader compatibility (ARIA labels, semantic HTML)
- Color contrast meets WCAG AA standards
- Focus management works correctly
- No keyboard traps

**Tools:**
- Manual testing with keyboard
- Screen reader testing (NVDA, JAWS, VoiceOver)
- Automated tools (axe DevTools, Lighthouse)

---

## Error Handling Standards

### Backend Error Handling

**Reference:** [Backend Error Handling Framework](../../02-architecture/security/backend-error-handling-framework.md)

**Standards:**
- All RPC functions should use consistent error codes
- Error messages should be user-friendly but not expose sensitive information
- Errors should be logged appropriately
- Error responses should follow standard format
- Input validation errors should be clear and specific

**Error Response Format:**
```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "User-friendly error message",
    "details": {} // Optional additional details
  }
}
```

---

### Frontend Error Handling

**Standards:**
- Network errors should show user-friendly messages
- API errors should display appropriate error messages
- Form validation errors should be field-specific
- Error states should be visually clear
- Retry logic should be provided for transient errors

**Error Display:**
- Show error messages in Alert components
- Field-level errors for form validation
- Toast notifications for non-critical errors
- Modal dialogs for critical errors

---

## Code Review Standards

### Review Requirements

- All code must be reviewed before merging
- Reviewer should be a specialist in the relevant area (database, frontend, backend, security)
- Review should check:
  - Code quality (readability, maintainability)
  - Adherence to standards (error handling, testing, documentation)
  - Security (input validation, authorization, data access)
  - Performance (if applicable)
  - Completeness (meets requirements)

### Reviewers by Domain

- **Database:** Nadia (Database Specialist)
- **RLS/RBAC:** Rafi (RLS/RBAC Specialist)
- **RPC Functions:** Maya (Workflow/RPC Engineer)
- **Frontend:** Emma (UI/UX + Next.js Frontend Specialist)
- **Security:** Salim (Security & Audit Engineer)
- **Edge Functions:** Leila (Edge Functions/Jobs Engineer)
- **Testing:** Hassan (QA/Assurance Engineer)

---

## Time Estimation Guidelines

### Estimation Levels

- **TBD:** Unknown - needs investigation
- **< 1 hour:** Quick task (configuration, simple changes)
- **1-4 hours:** Small task (single function, simple component)
- **4-8 hours:** Medium task (multiple functions, complex component)
- **8-16 hours:** Large task (major feature, multiple components)
- **16+ hours:** Very large task (consider breaking down)

### Factors to Consider

- Complexity of requirements
- Dependencies on other tasks
- Testing requirements
- Documentation requirements
- Code review time
- Learning curve (if new technology/concept)

---

## Dependency Management

### Dependency Types

1. **Hard Dependency:** Task cannot start until dependency is complete
2. **Soft Dependency:** Task can start but needs dependency for completion
3. **Parallel Dependency:** Tasks can be done in parallel but need coordination

### Dependency Documentation

All tasks with dependencies should:
- List dependencies explicitly
- Indicate dependency type (hard/soft/parallel)
- Note any coordination requirements

---

## Related Documents

- [Backend Error Handling Framework](../../02-architecture/security/backend-error-handling-framework.md)
- [Testing Framework](../../08-deployment/testing-framework.md)
- [RLS Policy Framework](../../02-architecture/security/rls-policy-framework.md)
- [RPC Function Specifications](../../02-architecture/api/rpc-functions.md)
- [Wireframe-First Implementation Principle](wireframe-first-implementation-principle.md)

---

**Last Updated:** 2025-01-21  
**Next Review:** After Phase 1.1 completion
