# RMM Database-Frontend Mismatch: Root Cause Analysis

**Date:** 2026-01-25  
**Author:** Oliver (System Architect)  
**Status:** 🔴 **CRITICAL - ROOT CAUSE IDENTIFIED**

---

## Executive Summary

We've been fixing individual SQL errors (symptoms) but not addressing the **systematic disconnection** between:
1. **Database Schema** (PostgreSQL tables/columns)
2. **Backend RPC Functions** (PostgreSQL functions returning JSONB)
3. **Frontend TypeScript Interfaces** (Component-level type definitions)

This creates a **translation layer problem** where data flows through three disconnected systems with no validation or type safety.

---

## Root Causes Identified

### 1. **No Single Source of Truth for Data Contracts**

**Problem:**
- Database schema is defined in SQL migrations
- RPC function signatures are defined in SQL migrations
- Frontend TypeScript interfaces are defined locally in components
- **No shared type definitions or contracts between layers**

**Evidence:**
- `app/(dashboard)/rmm/page.tsx` defines `Activity`, `Statistics`, `EnforcementAction` interfaces locally
- RPC functions return `jsonb` with no type validation
- No verification that RPC return structure matches frontend interfaces

**Impact:**
- Type mismatches only discovered at runtime
- No compile-time safety
- Manual verification required for every change

---

### 2. **Schema Assumptions Without Validation**

**Problem:**
- RPC functions make assumptions about database schema (e.g., `created_by` columns, `company_id` in `registry_submissions`)
- No validation that assumed columns exist before function execution
- Schema changes can break RPCs silently

**Evidence:**
- `rmm_get_recent_activity` assumed `companies.created_by` existed (it didn't)
- `rmm_get_recent_activity` assumed `registry_submissions.company_id` existed (it didn't)
- Functions fail at runtime with cryptic SQL errors

**Impact:**
- Runtime failures instead of compile-time errors
- Difficult to trace which assumption is wrong
- Requires multiple fix iterations

---

### 3. **Parameter Name Translation Mismatch**

**Problem:**
- RPC functions use `p_` prefix convention (`p_limit`, `p_offset`)
- Frontend calls use inconsistent naming (`limit`, `offset`, `user_id`)
- No validation that parameter names match

**Evidence:**
- `rmm_list_submissions` expects `p_limit`, frontend called with `limit`
- `rmm_list_submissions` doesn't accept `user_id`, frontend passed it
- Some RPCs use `user_id`, others use `auth.uid()` internally

**Impact:**
- Silent parameter mismatches (defaults used instead of intended values)
- Runtime errors for missing required parameters
- Inconsistent API surface

---

### 4. **No Type Generation or Contract System**

**Problem:**
- No automated type generation from database schema
- No type generation from RPC function signatures
- No shared type definitions between backend and frontend
- Manual type definitions prone to drift

**Evidence:**
- TypeScript interfaces defined manually in each component
- No `types/` directory with shared definitions
- No tooling to generate types from SQL

**Impact:**
- Type definitions can drift from actual database/RPC structure
- No way to detect mismatches until runtime
- Manual maintenance burden

---

### 5. **Incomplete Schema Documentation**

**Problem:**
- Database schema not fully documented in accessible format
- RPC function contracts not documented (parameter types, return structures)
- Frontend developers must read SQL migrations to understand data structures

**Evidence:**
- Frontend code has JSDoc comments referencing tables, but no actual schema reference
- No centralized schema documentation
- Developers must search through migrations to understand structure

**Impact:**
- Developers make incorrect assumptions about schema
- Time wasted searching for schema information
- Higher error rate

---

## Systematic Solution Proposal

### Phase 1: Immediate Fixes (This Session)

1. **Create Shared Type Definitions**
   - Create `lib/types/rmm.ts` with shared TypeScript interfaces
   - Document exact mapping to database schema and RPC return types
   - Update components to use shared types

2. **Add Schema Validation to RPC Functions**
   - Add explicit column existence checks (or use safer queries)
   - Add parameter validation with clear error messages
   - Document all schema assumptions in function comments

3. **Create RPC Function Contract Documentation**
   - Document all RPC function signatures, parameters, and return types
   - Create mapping between frontend calls and RPC functions
   - Add examples for each RPC

### Phase 2: Systematic Improvements (Next Sprint)

1. **Type Generation System**
   - Investigate tools to generate TypeScript types from PostgreSQL schema
   - Generate types from RPC function signatures
   - Automate type sync in CI/CD

2. **Contract Testing**
   - Create integration tests that verify RPC return types match frontend interfaces
   - Add schema validation tests
   - Add parameter validation tests

3. **Schema Documentation System**
   - Create centralized schema documentation
   - Auto-generate from migrations
   - Link to RPC function contracts

### Phase 3: Long-term Architecture (Future)

1. **API Gateway Pattern**
   - Create typed API layer between frontend and Supabase
   - Centralize all RPC calls
   - Add runtime type validation

2. **Schema Migration Validation**
   - Add pre-migration checks for breaking changes
   - Validate RPC functions against schema before deployment
   - Automated compatibility checks

---

## Immediate Action Items

### For Current RMM Overview Page:

1. ✅ **Create shared type definitions** (`lib/types/rmm.ts`)
2. ✅ **Add schema validation comments** to RPC functions
3. ✅ **Create RPC function contract documentation**
4. ✅ **Update frontend to use shared types**
5. ✅ **Add runtime type validation** (optional, but recommended)

---

## Files to Create/Modify

1. `lib/types/rmm.ts` - Shared TypeScript type definitions
2. `docs/02-architecture/database/rpc-contracts.md` - RPC function contracts
3. `supabase/migrations/20260125000005_add_rmm_rpc_schema_validation.sql` - Add validation helpers
4. Update `app/(dashboard)/rmm/page.tsx` to use shared types

---

**Next Steps:** Implement Phase 1 immediate fixes to establish foundation for systematic improvements.
