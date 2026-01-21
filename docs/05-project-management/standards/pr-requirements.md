# PR Requirements

**Last Updated:** 2026-01-15  
**Purpose:** Required elements for all Pull Requests

---

## PR Title Format

```
[Module] [Type] Brief description
```

Examples:
- `[RMM] [Frontend] Implement Companies list page`
- `[VCI] [Backend] Create AAMS submission RPC function`
- `[Core] [Database] Add pharmaceutical attributes to SKUs table`

---

## PR Description Template

### Required Sections

#### 1. Overview
Brief description of what this PR implements.

#### 2. Wireframe Links (Frontend Only)
- Exact wireframe task file(s) link(s) (e.g., `task-0.5.x.x-...`)
- Wireframe task ID(s)
- Wireframe binding must appear in **both** PR description AND codebase

Example:
```
Wireframes Implemented:
- [task-0.5.2.2](../../../04-design/user-experience/wireframes/01-rmm/companies/task-0.5.2.2-companies-list.md)
- [task-0.5.2.3](../../../04-design/user-experience/wireframes/01-rmm/companies/task-0.5.2.3-company-detail.md)

Wireframe Binding:
- Code comments: Added to component files (see code)
- PR description: Included above
```

#### 3. Related Tasks
- Phase 1 task ID(s)
- Related task IDs (if part of larger feature)

Example:
```
Tasks:
- Task 1.1.2.17: Implement Companies list page
- Task 1.1.2.18: Implement Company detail page
```

#### 4. Database Tables/Fields Used
- Tables accessed
- Fields used
- Phase 0.6 additions (if applicable)

Example:
```
Database:
- `companies` table: id, name, registration_number, status
- `products` table: id, name, company_id (for related products)
- Phase 0.6 additions: None
```

#### 5. API Functions Used
- RPC functions called
- Edge functions (if applicable)
- Supabase Auth (if applicable)

Example:
```
API:
- `rmm_list_companies()` - List companies
- `rmm_get_company()` - Get company detail
```

#### 6. Screenshots

##### Role Variants (Frontend Only)
Screenshots for each role variant or explicit N/A:

```
Role Variants:
- Company: [screenshot]
- MOH Tier 1: [screenshot]
- MOH Tier 2: [screenshot]
```

##### UI States (Frontend Only)
Screenshots for all required states:

```
UI States:
- Loading: [screenshot]
- Empty: [screenshot]
- Error: [screenshot]
- Success: [screenshot]
```

##### Layout Integration (Frontend Only)
Screenshot showing integration into main layout:

```
Layout Integration: [screenshot showing page in full layout with navigation]
```

#### 7. Wireframe Compliance
Statement of compliance:

```
Wireframe Compliance:
✅ Layout matches wireframe
✅ All role variants implemented
✅ All interactions match wireframe
✅ All states implemented (loading, empty, error, success)
```

#### 8. Data Proof (Frontend Only)
Evidence that queries use real Supabase data (NO local mocks, NO hardcoded data):

```
Data Proof:
- Queries located in: `src/app/rmm/companies/page.tsx` (lines 45-60)
- Evidence: [screenshot of browser DevTools Network tab showing Supabase queries]
- Tables queried: `companies` via `rmm_list_companies()` RPC
- Seed data: `seed_1_1_2_rmm` applied (verified via `supabase migration list`)
- No local mocks: ✅ Verified (no `const mockData = [...]`, no `mockData.ts`, no runtime mocks)
```

#### 9. Role Coverage Proof (Frontend Only)
Evidence that all roles are handled:

```
Role Coverage:
- Company: Can view own companies only
- MOH Tier 1: Can view all companies
- MOH Tier 2: Can view all companies
- Role names match schema: ✅ (using constants from `src/lib/roles.ts`)
```

#### 10. Deviations (If Any)
Any deviations from wireframe or requirements:

```
Deviations:
- None

OR

Deviations:
- [Description of deviation]
- Reason: [Why deviation is needed]
- Approval: [Link to approval or approval person/date]
```

#### 11. Testing
Testing completed:

```
Testing:
- Unit tests: [list or N/A]
- Integration tests: [list or N/A]
- Manual testing: [description]
```

#### 12. Checklist
- [ ] Code follows project standards
- [ ] All tests passing
- [ ] Wireframe compliance verified
- [ ] No hardcoded data
- [ ] Role names match schema
- [ ] Documentation updated (if applicable)

---

## Frontend PR Requirements (Additional)

### Required Elements
1. ✅ Wireframe link(s) in PR description
2. ✅ Wireframe binding comments in code
3. ✅ Screenshots for role variants
4. ✅ Screenshots for UI states (loading, empty, error, success)
5. ✅ Data proof (queries use Supabase, no mocks)
6. ✅ Layout integration proof
7. ✅ Role coverage proof
8. ✅ Role name consistency proof

### Wireframe Binding in Code
Every route/page must include wireframe binding comment:

```typescript
/**
 * Wireframe: task-0.5.2.2-companies-list.md
 * Route: /rmm/companies
 * Role variants: Company, MOH Tier 1, MOH Tier 2
 */
```

---

## Backend PR Requirements

### Required Elements
1. ✅ RPC function documentation
2. ✅ Database changes documented (if applicable)
3. ✅ RLS policies documented (if applicable)
4. ✅ Error handling implemented
5. ✅ Input validation implemented
6. ✅ Unit tests written and passing

### Database Migration PRs
1. ✅ Migration script included
2. ✅ Migration tested
3. ✅ Schema documentation updated (schema-design.md, erd.md, data-dictionary.md)
4. ✅ RLS policies defined (for new tables)

---

## PR Review Checklist (Reviewers)

### For All PRs
- [ ] PR description complete
- [ ] Code follows standards
- [ ] Tests written and passing
- [ ] No breaking changes (or documented)
- [ ] Documentation updated (if applicable)
- [ ] Sequential task execution verified (all previous tasks complete)

### For Frontend PRs
- [ ] Wireframe compliance verified
- [ ] Wireframe binding in code (JSDoc format with wireframe link)
- [ ] Wireframe binding in PR description
- [ ] All role variants implemented (or explicit N/A with wireframe citation)
- [ ] All UI states implemented (loading, empty, error, success)
- [ ] No hardcoded data (NO `const mockData = [...]`, NO `mockData.ts`, NO runtime mocks)
- [ ] All data queries Supabase database
- [ ] Seed data applied (if required) - verify via `supabase migration list`
- [ ] Screenshots provided (role variants, UI states, layout integration)
- [ ] Data proof provided (query locations, evidence of Supabase queries)
- [ ] Role name consistency verified (frontend role names match database schema exactly)
- [ ] Layout integration verified (components integrated into routes)

### For Backend PRs
- [ ] RLS policies implemented (if applicable)
- [ ] Error handling adequate (appropriate HTTP status codes, no sensitive information exposed)
- [ ] Input validation adequate (required fields, data types, format validation)
- [ ] Input sanitization implemented (escape HTML, prevent SQL injection)
- [ ] Unit tests written and passing (minimum 80% code coverage)
- [ ] API documentation updated
- [ ] Integration contracts updated (if applicable)
- [ ] Database migrations verified (if applicable - indexes created in same migration, schema verified)

### For Database Migration PRs
- [ ] Migration file in `supabase/migrations/` directory (timestamped format)
- [ ] Migration applied and verified via `supabase migration list`
- [ ] Indexes created in same migration file as table creation (atomic schema definition)
- [ ] Tables verified using SQL queries
- [ ] Schema verified (columns, data types, constraints, indexes)
- [ ] RLS policies defined (for new tables)
- [ ] Foreign key constraints explicitly defined
- [ ] Security best practices verified (RLS policies, indexes, constraints)
- [ ] Schema documentation updated (schema-design.md, erd.md, data-dictionary.md)

### For Seed Migration PRs
- [ ] Seed migration uses deterministic IDs and UPSERT patterns (idempotent)
- [ ] Seed migration applied and verified via `supabase migration list`
- [ ] Seed data validated (integrity verification, realism + coverage verification)
- [ ] RLS validation completed (seed data validated under real roles)
- [ ] Scenario packs use deterministic IDs for idempotency
- [ ] Seed data covers wireframe scenarios

---

## PR Approval Requirements

### Minimum Approvals
- 1 code review approval
- **Sami compliance verification (REQUIRED for ALL Phase 1 frontend tasks)** - Wireframe + database compliance verified
- Wireframe owner approval (if wireframe deviations)
- Module owner approval (if module-specific changes)

### Compliance Enforcement
**Sami (Implementation Compliance Specialist) reviews ALL PRs for wireframe + database compliance before merge.**

**Required Reviewers:**
- **Sami:** Compliance verification (wireframe binding, database compliance, sequential task execution, role name consistency, seed data usage)
- **Code Reviewer:** Technical review (code quality, standards, testing)
- **Wireframe Owner (Emma):** Wireframe compliance approval (if wireframe deviations or complex UI changes)
- **Module Owner:** Module-specific approval (if module-specific changes)

### Merge Requirements
- All checks passing
- All approvals obtained
- No blocking comments
- Compliance verified (Sami approval)
- Sequential task execution verified (all previous tasks complete)
- Wireframe compliance verified (for frontend)
- Database compliance verified (no hardcoded data, Supabase queries only)

---

## Common PR Issues

### Issue 1: Missing Wireframe Link
**Problem:** PR doesn't include wireframe link  
**Solution:** Add wireframe link(s) to PR description

### Issue 2: Missing Screenshots
**Problem:** PR missing role variant or state screenshots  
**Solution:** Add all required screenshots

### Issue 3: Hardcoded Data
**Problem:** Code uses hardcoded data instead of Supabase queries  
**Solution:** Replace with Supabase queries, seed data in database

### Issue 4: Missing Wireframe Binding
**Problem:** Code doesn't include wireframe binding comments  
**Solution:** Add wireframe binding comments to code

---

**Reference:** [Phase 1 Implementation Plan](../phase-1.md#-hard-gates-wireframe--database-compliance-non-negotiable), [Compliance Rules](./compliance-rules.md), [Wireframe Compliance](./wireframe-compliance.md)
