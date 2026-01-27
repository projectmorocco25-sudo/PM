# Frontend Task Template

**Purpose:** Reusable template for frontend implementation tasks  
**Usage:** Copy this template when creating new frontend tasks  
**Template Version:** 1.0  
**Last Updated:** 2026-01-26

**🟢 Supabase cloud-only (never local):** All data must come from the **hosted** Supabase project only. **Never** use local mocks, local Supabase, `supabase start`, Docker, or a local database. All queries use the cloud project (`.env.local` → hosted URL/keys).

---

## Task Structure

All frontend tasks follow this structure:

1. **Verification Tasks** (MANDATORY - must be completed before implementation):
   - Task X.Y.Z.a: Verify wireframes
   - Task X.Y.Z.b: Verify database schema
   - Task X.Y.Z.c: Verify API contracts

2. **Implementation Task:**
   - Task X.Y.Z: Implement [Feature Name]

3. **Compliance Verification Task:**
   - Task X.Y.Z-verify: Verify compliance of implementation

---

## Task X.Y.Z: [Feature Name]

**Task ID:** X.Y.Z  
**Category:** Frontend - [Category Name]  
**Status:** ⏳ **AWAITING IMPLEMENTATION**  
**Template:** [frontend-task-template.md](../../standards/task-templates/frontend-task-template.md)

---

## Quick Reference

- 📐 **Wireframes:** [List wireframe task IDs]
- 🛣️ **Route:** `/route/path`
- 💾 **Database:** `table_name`, `table_name2`
- 🔌 **API:** `function_name()`, `function_name2()`
- 📋 **Feature:** [Feature Name - feature-index.md#feature-anchor](../../../02-architecture/feature-index.md#feature-anchor)

---

## Verification Tasks

### Task X.Y.Z.a: Verify Wireframes

**Status:** ⏳ **AWAITING IMPLEMENTATION**

- 📐 **Feature Reference:** [Feature Name - feature-index.md#feature-anchor](../../../02-architecture/feature-index.md#feature-anchor)
- 📐 **Wireframes to Read:**
  - [task-ID-wireframe-name.md](../../../04-design/user-experience/wireframes/...)

**✅ Verification Steps:**
1. Read all wireframe files completely
2. Document key requirements: layout, interactions, states, role-based variations
3. Verify wireframe covers all required user roles
4. Review wireframe annotations for edge cases and validation rules
5. Document any discrepancies or questions

**✅ Acceptance Criteria:**
- [ ] All wireframes read and requirements understood
- [ ] Key requirements documented
- [ ] All role variations identified
- [ ] Edge cases documented
- [ ] Wireframe annotations reviewed
- [ ] Ready to implement based on wireframe specifications

---

### Task X.Y.Z.b: Verify Database Schema

**Status:** ⏳ **AWAITING IMPLEMENTATION**

- 💾 **Feature Reference:** [Feature Name - feature-index.md#feature-anchor](../../../02-architecture/feature-index.md#feature-anchor)
- 💾 **Database Tables:** `table_name`, `table_name2`
- 💾 **Schema Reference:** [data-dictionary.md](../../../02-architecture/database/data-dictionary.md)

**✅ Verification Steps:**
1. Confirm all required tables/fields exist in data-dictionary.md (**hosted** project schema; no local DB).
2. Verify RLS policies are implemented
3. Check foreign key constraints and indexes
4. Validate data types match schema specifications
5. Verify table relationships are correct

**✅ Acceptance Criteria:**
- [ ] All required tables exist with correct structure
- [ ] All required fields exist with correct types
- [ ] RLS policies implemented
- [ ] Foreign keys and indexes verified
- [ ] Schema matches feature requirements

---

### Task X.Y.Z.c: Verify API Contracts

**Status:** ⏳ **AWAITING IMPLEMENTATION**

- 🔌 **Feature Reference:** [Feature Name - feature-index.md#feature-anchor](../../../02-architecture/feature-index.md#feature-anchor)
- 🔌 **API Functions:** `function_name()`, `function_name2()`
- 🔌 **API Reference:** [rpc-functions.md](../../../02-architecture/api/rpc-functions.md)

**✅ Verification Steps:**
1. Confirm all required RPC functions exist in rpc-functions.md
2. Verify function signatures match requirements
3. Check error handling and return types
4. Validate API permissions and access controls
5. Verify function parameters match feature needs

**✅ Acceptance Criteria:**
- [ ] All required RPC functions exist
- [ ] Function signatures verified
- [ ] Error handling documented
- [ ] Access controls verified
- [ ] API contracts match feature requirements

---

## Implementation Task

### Task X.Y.Z: Implement [Feature Name]

**Status:** ⏳ **AWAITING IMPLEMENTATION**  
**⚠️ DEPENDS ON:** Tasks X.Y.Z.a (wireframe verification), X.Y.Z.b (database verification), X.Y.Z.c (API verification), [other dependencies]

- 📐 **Wireframes:** 
  - [task-ID-wireframe-name.md](../../../04-design/user-experience/wireframes/...)
- 🛣️ **Route:** `/route/path` ([routing-structure.md](../../../02-architecture/frontend/routing-structure.md#route-section))
- 💾 **Database:** `table_name`, `table_name2` ([feature-index.md](../../../02-architecture/feature-index.md#feature-anchor))
- 🔌 **API:** `function_name()`, `function_name2()` ([feature-index.md](../../../02-architecture/feature-index.md#feature-anchor))
- 📋 **Reference:** [feature-index.md#feature-anchor](../../../02-architecture/feature-index.md#feature-anchor)

**✅ Implementation Notes:**
- Implement based on wireframe specifications reviewed in Task X.Y.Z.a
- Follow requirements documented in verification tasks
- Ensure all specifications from verification tasks are met

**✅ Acceptance Criteria:**
- [ ] Implementation matches wireframe specifications
- [ ] All database queries use **hosted** Supabase only (cloud-only; no local mocks, no local Supabase/Docker/DB)
- [ ] Wireframe binding comments added to code
- [ ] All user roles handled correctly
- [ ] RLS policies enforced
- [ ] Error handling implemented
- [ ] PR includes compliance section

---

## Compliance Verification Task

### Task X.Y.Z-verify: Verify Compliance

**Status:** ⏳ **AWAITING IMPLEMENTATION**  
**⚠️ DEPENDS ON:** Task X.Y.Z (implementation complete)  
**Owner:** Sami (Compliance) + Oliver (Technical Review)

**📐 Wireframe Compliance Check:**
- Compare implementation against wireframes verified in Task X.Y.Z.a
- Verify implementation matches all wireframe specifications (layout, interactions, states, responsive behavior)
- Verify wireframe binding comments are present in code (JSDoc format)

**💾 Database Compliance Check:**
- Verify implementation uses database schema verified in Task X.Y.Z.b
- Verify all database queries use **hosted** Supabase only (no local mocks, no local Supabase/Docker/DB)
- Verify RLS policies are respected

**🔌 API Compliance Check:**
- Verify implementation uses API contracts verified in Task X.Y.Z.c
- Verify function calls match verified signatures
- Verify error handling matches API contract specifications

**✅ Compliance Verification Steps:**
1. Review implementation code against wireframe specifications from Task X.Y.Z.a
2. Review implementation code against database schema from Task X.Y.Z.b
3. Review implementation code against API contracts from Task X.Y.Z.c
4. Test implementation matches all verified requirements
5. Verify wireframe binding comments are present
6. Verify PR description includes wireframe links and compliance section

**✅ Acceptance Criteria:**
- [ ] Implementation matches wireframe specifications
- [ ] Implementation uses verified database schema (**hosted** Supabase only; no local mocks, RLS respected)
- [ ] Implementation uses verified API contracts
- [ ] Wireframe binding comments present in code
- [ ] PR description includes wireframe links and compliance section
- [ ] All verification criteria from Tasks X.Y.Z.a, X.Y.Z.b, X.Y.Z.c are met
- [ ] Sami's compliance approval obtained

**🚫 Stop Conditions:**
- Implementation does not match wireframe specifications → **STOP** and fix
- Local mock data or local Supabase/Docker/DB used → **STOP** and remove; use **hosted** Supabase queries only
- API calls don't match verified contracts → **STOP** and fix
- Wireframe binding comments missing → **STOP** and add
- RLS policies not respected → **STOP** and fix

---

**Template Version:** 1.0  
**Last Updated:** 2026-01-26
