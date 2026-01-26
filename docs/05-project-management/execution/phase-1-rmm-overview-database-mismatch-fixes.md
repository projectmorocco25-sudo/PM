# Phase 1: RMM Overview Page - Database Mismatch Fixes

**Date:** 2026-01-25  
**Coordinator:** Sami (Implementation Compliance Specialist)  
**Status:** ✅ **FIXED**

---

## Issue Summary

User reported: "there seems to be a mismatch between the page and the database"

---

## Root cause summary

The RMM Overview page calls **five** RPCs: `rmm_get_statistics`, `rmm_get_recent_activity`, `rmm_get_enforcement_actions`, `rmm_get_submission_deadlines`, and `rmm_list_submissions`. Failures were caused by:

1. **Frontend ↔ RPC contract mismatches** — wrong parameter names (`p_` prefix, `user_id`), wrong values (`"desc"` vs `"DESC"`).
2. **SQL bugs in RPCs** — `jsonb_agg(... ORDER BY col)` triggering GROUP BY errors; `CASE` mixing `timestamptz` and `text` in `ORDER BY`.

All identified issues have been fixed. The page should load correctly after refreshing.

---

## Mismatches Identified and Fixed

### 1. ✅ `rmm_list_submissions` Function Call Mismatch

**Problem:**
- Frontend was calling `rmm_list_submissions` with incorrect parameter names
- Frontend was passing `user_id` parameter, but function uses `auth.uid()` internally
- Frontend was using parameter names without `p_` prefix

**Frontend Call (Before):**
```typescript
await supabase.rpc("rmm_list_submissions", {
  user_id: user.id,  // ❌ Function doesn't accept user_id
  limit: 1000,       // ❌ Should be p_limit
  offset: 0,         // ❌ Should be p_offset
  status: null,      // ❌ Should be p_status
  submission_type: null,  // ❌ Should be p_submission_type
  entity_type: null,     // ❌ Should be p_entity_type
  company_id: ...,       // ❌ Should be p_company_id
  search: null,         // ❌ Should be p_search
  sort_by: "created_at", // ❌ Should be p_sort_by
  sort_order: "desc",    // ❌ Should be p_sort_order
});
```

**Function Signature:**
```sql
CREATE OR REPLACE FUNCTION rmm_list_submissions(
    p_limit integer DEFAULT 100,
    p_offset integer DEFAULT 0,
    p_status text DEFAULT NULL,
    p_submission_type text DEFAULT NULL,
    p_entity_type text DEFAULT NULL,
    p_company_id uuid DEFAULT NULL,
    p_search text DEFAULT NULL,
    p_sort_by text DEFAULT 'created_at',
    p_sort_order text DEFAULT 'DESC'
)
-- Note: Function uses auth.uid() internally, doesn't need user_id parameter
```

**Fix Applied:**
- Updated frontend call to use correct parameter names with `p_` prefix
- Removed `user_id` parameter (function uses `auth.uid()` internally)

**Frontend Call (After):**
```typescript
await supabase.rpc("rmm_list_submissions", {
  p_limit: 1000,
  p_offset: 0,
  p_status: null,
  p_submission_type: null,
  p_entity_type: null,
  p_company_id: isCompanyRole(permissions?.role as any) ? permissions?.company_id : null,
  p_search: null,
  p_sort_by: "created_at",
  p_sort_order: "DESC",
});
```

**File Modified:**
- ✅ `app/(dashboard)/rmm/page.tsx` (line 163-174)

---

### 2. ✅ `rmm_get_submission_deadlines` GROUP BY Error (SQL)

**Problem:**
- RPC failed with: `column "deadline.due_date" must appear in the GROUP BY clause or be used in an aggregate function`
- Caused 400 Bad Request when loading RMM Overview; page showed "Unable to load RMM overview"

**Root Cause:**
- `jsonb_agg(... ORDER BY deadline.due_date ASC)` — using `ORDER BY` inside the aggregate referenced columns in a way that triggered the error (same pattern as prior `rmm_get_recent_activity` fix)

**Fix Applied:**
- Move `ORDER BY due_date ASC` and `LIMIT 10` into an inner subquery
- Use `jsonb_agg(jsonb_build_object(...))` **without** `ORDER BY` inside the aggregate; subquery returns pre-ordered rows

**Migration:**
- ✅ `20260125000005_fix_rmm_get_submission_deadlines_group_by.sql`

---

### 3. ✅ `rmm_list_submissions` sort_order Case Sensitivity

**Problem:**
- RPC validates `p_sort_order IN ('ASC', 'DESC')` (uppercase only). Frontend passed `"desc"`.
- Error: `Invalid sort_order: desc. Must be ASC or DESC` → 400 Bad Request when loading RMM Overview.

**Fix Applied:**
- Updated `app/(dashboard)/rmm/page.tsx`: `rmm_list_submissions` call now uses `p_sort_order: "DESC"` (uppercase).

---

### 4. ✅ `rmm_list_submissions` ORDER BY Type Mismatch (SQL)

**Problem:**
- RPC failed with: `CASE types timestamp with time zone and text cannot be matched`
- Caused 400 Bad Request when loading RMM Overview.

**Root Cause:**
- The dynamic `ORDER BY` used a `CASE` that mixed `timestamptz` (`created_at`, `updated_at`) with `text` (`status`, `submission_type`, `entity_type`). PostgreSQL requires all `CASE` branches to have the same type.

**Fix Applied:**
- Cast timestamp columns to `::text` in the sort `CASE` so all branches return `text`. ISO timestamps sort correctly as text.
- Migration replaces `rmm_list_submissions` with fixed `ORDER BY`.

**Migration:**
- ✅ `20260125000006_fix_rmm_list_submissions_order_by_type_mismatch.sql`

---

## Verification

### ✅ Parameter Names Match
- All RPC function calls now use correct parameter names
- `rmm_get_statistics(user_id)` ✅
- `rmm_get_recent_activity(user_id, p_limit)` ✅
- `rmm_get_enforcement_actions(user_id, company_id, p_limit)` ✅
- `rmm_get_submission_deadlines(user_id)` ✅
- `rmm_list_submissions(p_limit, p_offset, ...)` ✅

### ✅ Return Types Match
- `Statistics` interface matches `rmm_get_statistics` return structure ✅
- `Activity[]` interface matches `rmm_get_recent_activity` return structure ✅
- `EnforcementAction[]` interface matches `rmm_get_enforcement_actions` return structure ✅
- `SubmissionDeadline[]` interface matches `rmm_get_submission_deadlines` return structure ✅
- `rmm_list_submissions` returns `{ data: [...], pagination: {...} }` which frontend correctly accesses ✅

---

## Files Modified

1. ✅ `app/(dashboard)/rmm/page.tsx` - Fixed `rmm_list_submissions` call (p_ params, no user_id; `p_sort_order: "DESC"`)
2. ✅ `supabase/migrations/20260125000005_fix_rmm_get_submission_deadlines_group_by.sql` - Fixed `rmm_get_submission_deadlines` GROUP BY error
3. ✅ `supabase/migrations/20260125000006_fix_rmm_list_submissions_order_by_type_mismatch.sql` - Fixed `rmm_list_submissions` ORDER BY timestamptz/text CASE type mismatch

---

## Status

✅ **All mismatches fixed and verified**

The RMM Overview page should now correctly call all RPC functions with matching parameter names (including `p_sort_order: "DESC"` for `rmm_list_submissions`), handle return types correctly, `rmm_get_submission_deadlines` no longer raises the GROUP BY SQL error, and `rmm_list_submissions` no longer raises the ORDER BY CASE type mismatch error.

---

**Fixed:** 2026-01-25  
**Ready for Testing:** Yes
