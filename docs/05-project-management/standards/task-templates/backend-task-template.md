# Backend Task Template

**Purpose:** Reusable template for backend implementation tasks (RPC functions, RLS policies, business logic)  
**Usage:** Copy this template when creating new backend tasks  
**Template Version:** 1.0  
**Last Updated:** 2026-01-26

**🟢 Supabase cloud-only (never local):** All backend work (RPC, RLS, migrations) uses the **hosted** Supabase project only. **Never** use local Supabase, `supabase start`, Docker, or a local database. Verify schema and run migrations against the linked remote project.

---

## Task Structure

Backend tasks follow a simplified structure (no wireframe verification):

1. **Verification Tasks** (if applicable):
   - Task X.Y.Z.b: Verify database schema (if creating/modifying tables)
   - Task X.Y.Z.c: Verify API contracts (if creating/modifying RPC functions)

2. **Implementation Task:**
   - Task X.Y.Z: Implement [Feature Name]

3. **Compliance Verification Task:**
   - Task X.Y.Z-verify: Verify compliance of implementation

---

## Task X.Y.Z: [Feature Name]

**Task ID:** X.Y.Z  
**Category:** Backend - [Category Name]  
**Status:** ⏳ **AWAITING IMPLEMENTATION**  
**Template:** [backend-task-template.md](../../standards/task-templates/backend-task-template.md)

---

## Quick Reference

- 💾 **Database:** `table_name`, `table_name2`
- 🔌 **API:** `function_name()`, `function_name2()`
- 📋 **Feature:** [Feature Name - feature-index.md#feature-anchor](../../../02-architecture/feature-index.md#feature-anchor)

---

## Verification Tasks (If Applicable)

### Task X.Y.Z.b: Verify Database Schema

**Status:** ⏳ **AWAITING IMPLEMENTATION**  
**Note:** Only required if task involves creating/modifying database tables

- 💾 **Feature Reference:** [Feature Name - feature-index.md#feature-anchor](../../../02-architecture/feature-index.md#feature-anchor)
- 💾 **Database Tables:** `table_name`, `table_name2`
- 💾 **Schema Reference:** [data-dictionary.md](../../../02-architecture/database/data-dictionary.md)

**✅ Verification Steps:**
1. Confirm all required tables/fields exist in data-dictionary.md (**hosted** project schema only; no local DB).
2. Verify RLS policies are implemented for new tables
3. Check foreign key constraints and indexes
4. Validate data types match schema specifications
5. Verify table relationships are correct

**✅ Acceptance Criteria:**
- [ ] All required tables exist
- [ ] All required fields exist with correct types
- [ ] RLS policies implemented
- [ ] Foreign keys and indexes verified
- [ ] Schema matches feature requirements

---

### Task X.Y.Z.c: Verify API Contracts

**Status:** ⏳ **AWAITING IMPLEMENTATION**  
**Note:** Only required if task involves creating/modifying RPC functions

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
**⚠️ DEPENDS ON:** [List dependencies - verification tasks if applicable, other backend tasks]

- 💾 **Database:** `table_name`, `table_name2` ([feature-index.md](../../../02-architecture/feature-index.md#feature-anchor))
- 🔌 **API:** `function_name()`, `function_name2()` ([feature-index.md](../../../02-architecture/feature-index.md#feature-anchor))
- 📋 **Reference:** [feature-index.md#feature-anchor](../../../02-architecture/feature-index.md#feature-anchor)

**✅ Implementation Notes:**
- Follow requirements documented in verification tasks (if applicable)
- Ensure all specifications from verification tasks are met
- Follow database migration strategy guidelines
- Follow RPC function documentation standards
- **Hosted Supabase only:** All DB operations target the **hosted** project; never local Supabase/Docker/DB.

**✅ Acceptance Criteria:**
- [ ] Implementation matches feature requirements
- [ ] All database operations use **hosted** Supabase only (no local)
- [ ] RLS policies implemented correctly (if applicable)
- [ ] RPC functions documented in rpc-functions.md (if applicable)
- [ ] Error handling implemented
- [ ] PR includes compliance section

---

## Compliance Verification Task

### Task X.Y.Z-verify: Verify Compliance

**Status:** ⏳ **AWAITING IMPLEMENTATION**  
**⚠️ DEPENDS ON:** Task X.Y.Z (implementation complete)  
**Owner:** Sami (Compliance) + Oliver (Technical Review)

**💾 Database Compliance Check (if applicable):**
- Verify implementation uses database schema verified in Task X.Y.Z.b
- Verify RLS policies are correctly implemented
- Verify migrations are idempotent (if applicable)

**🔌 API Compliance Check (if applicable):**
- Verify implementation uses API contracts verified in Task X.Y.Z.c
- Verify function signatures match verified contracts
- Verify error handling matches API contract specifications

**✅ Compliance Verification Steps:**
1. Review implementation code against database schema from Task X.Y.Z.b (if applicable)
2. Review implementation code against API contracts from Task X.Y.Z.c (if applicable)
3. Test implementation matches all verified requirements
4. Verify PR description includes compliance section

**✅ Acceptance Criteria:**
- [ ] Implementation uses verified database schema (if applicable)
- [ ] Implementation uses verified API contracts (if applicable)
- [ ] PR description includes compliance section
- [ ] All verification criteria from Tasks X.Y.Z.b, X.Y.Z.c are met (if applicable)
- [ ] Sami's compliance approval obtained

**🚫 Stop Conditions:**
- Database schema doesn't match verified requirements → **STOP** and fix
- API contracts don't match verified requirements → **STOP** and fix
- RLS policies not correctly implemented → **STOP** and fix
- Local Supabase, Docker, or local DB used → **STOP**; use **hosted** Supabase only

---

**Template Version:** 1.0  
**Last Updated:** 2026-01-26
