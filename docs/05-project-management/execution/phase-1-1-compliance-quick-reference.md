# Phase 1.1 Compliance Quick Reference

**Owner:** Sami (Implementation Compliance Specialist)  
**Purpose:** Quick reference checklist for Phase 1.1 task implementation  
**Full Details:** See [Phase 1.1 Compliance Adherence System](./phase-1-1-compliance-adherence-system.md)

---

## 🚨 BEFORE STARTING ANY TASK

### ✅ Pre-Task Checklist (5 minutes)
- [ ] All previous tasks complete (check phase-1.md)
- [ ] Wireframe exists and read completely (frontend tasks)
- [ ] Database tables/fields/RPC functions exist (verify with SQL)
- [ ] Seed data applied if required (`supabase migration list`)
- [ ] Backend tasks complete (for frontend tasks)
- [ ] No local mock data will be used

### 🚫 STOP If:
- ❌ Previous tasks incomplete
- ❌ Wireframe missing or not read
- ❌ Database tables/RPC functions missing
- ❌ Seed data not applied
- ❌ Backend tasks incomplete (for frontend)

---

## 📋 DURING IMPLEMENTATION

### Frontend Tasks
- [ ] Wireframe binding comment added (JSDoc format)
- [ ] All wireframe components implemented
- [ ] All wireframe states implemented (loading, empty, error, success)
- [ ] All responsive breakpoints implemented (desktop, tablet, mobile)
- [ ] All animations implemented (exact durations/easing from wireframe)
- [ ] All accessibility features implemented (ARIA, keyboard nav, focus trap)
- [ ] **NO local mock data** - All data from Supabase queries
- [ ] Role names match database schema exactly
- [ ] All role variants implemented (if specified in wireframe)

### Backend Tasks
- [ ] Migration is idempotent (deterministic IDs + UPSERT)
- [ ] RLS policies implemented (if new tables)
- [ ] RPC functions follow naming convention
- [ ] Phase 0.6 schema additions incorporated (if applicable)

---

## ✅ BEFORE MARKING COMPLETE

### Verification Checklist
- [ ] Implementation matches wireframe 100% (frontend tasks)
- [ ] All components/fields/interactions/states present
- [ ] Responsive design tested (desktop, tablet, mobile)
- [ ] Accessibility tested (keyboard nav, ARIA, focus trap)
- [ ] Animations tested (exact durations/easing)
- [ ] **NO local mock data** in codebase
- [ ] All data queries Supabase
- [ ] Role coverage verified (all required roles)
- [ ] Role names match database schema

### PR Description Required
- [ ] Wireframe link(s)
- [ ] Role variant screenshots (or N/A)
- [ ] State screenshots (loading, empty, error, success)
- [ ] Data proof (tables/fields + query locations)
- [ ] Deviations (if any) + approval reference
- [ ] **Compliance Section (MANDATORY)**

---

## 🔒 HARD GATES (Non-Negotiable)

1. **No Local Mock Data**
   - ❌ NO `const mockData = [...]`
   - ❌ NO `mockData.ts` files at runtime
   - ❌ NO runtime mock providers
   - ✅ All data from Supabase queries

2. **Wireframe Binding**
   - ✅ Wireframe link in code (JSDoc comment)
   - ✅ Wireframe link in PR description
   - ✅ Wireframe read completely before implementation

3. **Database Binding**
   - ✅ All queries use Supabase
   - ✅ Tables/fields documented
   - ✅ Phase 0.6 additions incorporated

4. **Role + States Coverage**
   - ✅ All role variants implemented (if wireframe specifies)
   - ✅ All UI states implemented (loading, empty, error, success)

5. **Sequential Execution**
   - ✅ All previous tasks complete
   - ✅ Dependencies satisfied

6. **Backend Completion Gate**
   - ✅ All backend tasks complete before frontend tasks

---

## 📝 COMPLIANCE SECTION TEMPLATE

**Copy-paste into PR description:**

```markdown
## Compliance Verification (Sami - Required)

**Compliance Rules Verified:**
- ✅ Sequential Task Verification: All previous tasks complete
- ✅ Wireframe Binding: Wireframe link added to component JSDoc comment
- ✅ Database Binding: Tables/fields documented, queries verified to use Supabase
- ✅ Role Coverage: All required role variants implemented
- ✅ UI States: Loading, empty, error, success states implemented
- ✅ No Local Mocks: Verified no local mock data, all data from Supabase queries
- ✅ Responsive Design: All breakpoints implemented
- ✅ Accessibility: ARIA labels, keyboard navigation, focus trap implemented
- ✅ Animations: All animations implemented with exact durations/easing

**Verification Evidence:**
- Wireframe binding: `src/app/route/page.tsx` line X-Y
- Database queries: `src/hooks/use-data.ts` uses `supabase.from('table').select()`
- Role coverage: Screenshots provided
- Seed data: Migration verified via `supabase migration list`

**Sami's Approval:** ✅ Approved - [Date]

**Deviations:** None
```

---

## 🚨 VIOLATION RESPONSE

**If compliance violated:**
1. ⛔ **STOP** implementation immediately
2. 📝 Document all violations
3. 🔧 Fix all violations
4. ✅ Re-verify compliance
5. ❌ **DO NOT** mark complete until fully compliant

---

**Quick Links:**
- [Full Compliance Adherence System](./phase-1-1-compliance-adherence-system.md)
- [Compliance Rules](../standards/compliance-rules.md)
- [Wireframe Compliance Checklist](../../.cursor/rules/wireframe-compliance-checklist.md)
- [Wireframe + DB Compliance](../../.cursor/rules/wireframe_db_compliance.md)
