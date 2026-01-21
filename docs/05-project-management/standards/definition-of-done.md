# Definition of Done

**Last Updated:** 2026-01-15  
**Purpose:** Standard criteria that must be met before a task is considered complete

---

## General Criteria

### Code Quality
- [ ] Code follows project coding standards
- [ ] Code is reviewed and approved
- [ ] No linting errors
- [ ] No TypeScript errors
- [ ] Code is properly formatted

### Testing
- [ ] Unit tests written (if applicable)
- [ ] Unit tests passing
- [ ] Integration tests passing (if applicable)
- [ ] Manual testing completed

### Documentation
- [ ] Code comments added (where needed)
- [ ] API documentation updated (if applicable)
- [ ] Database schema documented (if applicable)

---

## Frontend Tasks

### Required
- [ ] Wireframe compliance verified
- [ ] Wireframe binding comments in code
- [ ] PR includes wireframe link(s)
- [ ] All role variants implemented (where specified)
- [ ] All UI states implemented: loading, empty, error, success
- [ ] Layout integration verified
- [ ] No hardcoded data (queries Supabase only)
- [ ] Role names match database schema
- [ ] PR description includes all required proof items

### Wireframe Compliance
- [ ] Implementation matches wireframe specifications
- [ ] Layout matches wireframe
- [ ] Interactions match wireframe
- [ ] Role-based variations match wireframe
- [ ] Any deviations approved and documented

### Data & Integration
- [ ] Tables/fields used documented
- [ ] Queries use real Supabase data (no mocks)
- [ ] Phase 0.6 schema additions incorporated (if applicable)
- [ ] RLS policies verified (for new queries)

### PR Requirements
- [ ] Wireframe link(s) in PR description
- [ ] Screenshots for role variants
- [ ] Screenshots for UI states
- [ ] Data proof documentation
- [ ] Layout integration proof
- [ ] Role coverage proof
- [ ] Role name consistency proof

---

## Backend Tasks

### Required
- [ ] RPC functions implemented and tested
- [ ] Database migrations applied (if applicable)
- [ ] RLS policies implemented (for new tables)
- [ ] API contract documentation updated
- [ ] Unit tests written and passing (minimum 80% code coverage)
- [ ] Error handling implemented (appropriate HTTP status codes, no sensitive information exposed)
- [ ] Input validation implemented (required fields, data types, format validation, business rule validation)
- [ ] Input sanitization implemented (escape HTML, prevent SQL injection via parameterized queries)

### Database Migration Tasks
- [ ] Schema changes applied via versioned migration (timestamped format: `YYYYMMDDHHMMSS_description.sql`)
- [ ] Migration file stored in `supabase/migrations/` directory
- [ ] Migration applied using `supabase migration apply` or auto-apply in local dev
- [ ] Migration verified via `supabase migration list` or Supabase dashboard
- [ ] **Indexes MUST be created in the same migration file as table creation** (atomic schema definition)
- [ ] Migration scripts tested
- [ ] Tables verified using SQL queries via Supabase dashboard
- [ ] Schema verified using SQL queries (check columns, data types, constraints, indexes)
- [ ] Indexes verified immediately after migration (use SQL queries to verify pg_indexes)
- [ ] RLS policies defined and applied (for new tables)
- [ ] Foreign key constraints explicitly defined per schema-design.md
- [ ] Data type validation (verify all data types match schema-design.md and data-dictionary.md)
- [ ] Constraints verified (NOT NULL, CHECK, UNIQUE via information_schema queries)
- [ ] Security best practices verified (RLS policies, indexes, constraints) via SQL queries
- [ ] Schema documentation updated (schema-design.md, erd.md, data-dictionary.md)
- [ ] Rollback strategy documented (if applicable)

### RPC Function Tasks
- [ ] RPC functions implemented with proper error handling
- [ ] State machine validation implemented (if workflow functions - prevent invalid state transitions)
- [ ] Input validation implemented per backend-validation-strategy.md
- [ ] Input sanitization implemented per backend-input-sanitization-strategy.md
- [ ] RBAC permission checking implemented (validate user permissions before state transitions)
- [ ] Unit tests written and passing (minimum 80% code coverage)
- [ ] Error handling tests (invalid inputs, permission errors)
- [ ] RPC functions documented
- [ ] Request/response schemas defined
- [ ] Error codes documented (400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 500 Internal Server Error)
- [ ] Integration contracts updated (if applicable)

### RLS Policy Tasks
- [ ] RLS policies implemented for all tables
- [ ] Company isolation policies verified (company users see own company data only)
- [ ] MOH system-wide access policies verified (MOH Tier 1/2 see all data)
- [ ] Role-based access policies verified (different permissions per role)
- [ ] Module activation check policies implemented (if applicable)
- [ ] RLS policies tested under real roles
- [ ] RLS policy documentation updated

### Edge Function Tasks
- [ ] Edge Function implemented with proper error handling
- [ ] Error handling implemented (catch all errors, appropriate HTTP status codes, detailed error logging with correlation ID)
- [ ] Retry logic implemented for transient failures (network timeouts, rate limits)
- [ ] Authentication implemented (JWT validation, test valid/invalid/missing JWT)
- [ ] Unit tests written and passing (minimum 80% code coverage)
- [ ] Integration tests with mock services
- [ ] Edge Function documented

### Seed Migration Tasks
- [ ] Seed migration created as versioned SQL migration (idempotent)
- [ ] Seed migration uses deterministic IDs and UPSERT patterns (safe to re-run)
- [ ] Seed migration stored in `supabase/migrations/` directory
- [ ] Seed migration applied and verified via `supabase migration list`
- [ ] Seed data validated (integrity verification, realism + coverage verification, test DB isolation)
- [ ] RLS validation completed (seed data must be validated under real roles - Company, MOH Tier 1, MOH Tier 2)
- [ ] Scenario packs use deterministic IDs for idempotency
- [ ] Seed data covers wireframe scenarios
- [ ] Seed data documented

---

## Integration Tasks

### Required
- [ ] Integration tests written
- [ ] Integration tests passing
- [ ] Cross-module dependencies verified
- [ ] Integration contracts validated
- [ ] Data flow verified

---

## Testing Tasks

### Required
- [ ] Test cases written
- [ ] Test cases cover all scenarios
- [ ] Edge cases tested
- [ ] Test coverage meets minimum threshold
- [ ] Tests are maintainable

---

## Documentation Tasks

### Required
- [ ] Documentation complete and accurate
- [ ] Documentation reviewed
- [ ] Documentation links verified
- [ ] User-facing documentation tested (if applicable)

---

## Seed Data Tasks

### Required
- [ ] Seed data generation scripts created
- [ ] Seed data validated (integrity, realism, test isolation)
- [ ] Seed migrations applied and tested
- [ ] Seed data documented

---

## Definition of Done Checklist Summary

### For Every Task
1. ✅ Code quality standards met
2. ✅ Testing requirements met
3. ✅ Documentation requirements met
4. ✅ Compliance rules verified (Sami)
5. ✅ PR requirements met (if applicable)
6. ✅ Code reviewed and approved
7. ✅ Merged to target branch

### Additional for Frontend
1. ✅ Wireframe compliance verified
2. ✅ All role variants implemented
3. ✅ All UI states implemented
4. ✅ No hardcoded data
5. ✅ PR includes all proof items

### Additional for Backend
1. ✅ RLS policies implemented
2. ✅ Error handling implemented
3. ✅ Input validation implemented
4. ✅ API documentation updated

---

**Reference:** [Phase 1 Implementation Plan](../phase-1.md), [Compliance Rules](./compliance-rules.md)
