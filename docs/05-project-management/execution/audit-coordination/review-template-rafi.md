# Seed Data Playbook Review - RLS Validation

**Reviewer:** Rafi (Security & RLS Specialist)  
**Document:** `docs/05-project-management/phase-1-1-mockdata.md`  
**Review Date:** _______________  
**Status:** ⏳ In Progress / ✅ Complete

---

## Review Checklist

### RLS Validation Procedures
- [ ] Test scripts are accurate and complete
- [ ] Role switching procedures are correct
- [ ] Data visibility tests are comprehensive
- [ ] Policy verification steps are clear

**Comments:**
```
[Add comments here]
```

### Role Coverage
- [ ] All 9 roles are covered in validation
- [ ] Role names match database schema exactly
- [ ] Role permissions are correctly tested
- [ ] Role variants are handled appropriately

**Comments:**
```
[Add comments here]
```

### Data Visibility
- [ ] Company users see only their company's data
- [ ] MOH users see all companies' data
- [ ] System Admin sees all data
- [ ] Vendor role access is appropriate
- [ ] Auditor role has read-only access

**Comments:**
```
[Add comments here]
```

### Wireframe Alignment
- [ ] Data visibility matches wireframe requirements
- [ ] Role-based views are correctly tested
- [ ] Timing of visibility is correct (e.g., MOH sees after approval)

**Comments:**
```
[Add comments here]
```

---

## Specific Section Reviews

### Section: RLS Realism Validation (Lines 81-100)
**Status:** ⏳ Not Reviewed / ✅ Approved / ⚠️ Needs Changes

**Test Script Review:**
- [ ] SET ROLE commands are correct
- [ ] SELECT queries test appropriate data
- [ ] Validation process is clear
- [ ] Documentation is sufficient

**Issues Found:**
```
[List any issues]
```

**Recommendations:**
```
[List recommendations]
```

---

### Section: Verification Checklist (Lines 124-137)
**Status:** ⏳ Not Reviewed / ✅ Approved / ⚠️ Needs Changes

**RLS Validation Item Review:**
- [ ] RLS validation checklist item is clear
- [ ] Role coverage is comprehensive
- [ ] Validation steps are actionable

**Issues Found:**
```
[List any issues]
```

**Recommendations:**
```
[List recommendations]
```

---

### Section: Seed Stage 1.1.1 - Foundation (Lines 140-158)
**Status:** ⏳ Not Reviewed / ✅ Approved / ⚠️ Needs Changes

**RLS Validation Requirements:**
- [ ] Company users see only their company
- [ ] MOH users see all companies
- [ ] System Admin sees all data

**Comments:**
```
[Add comments]
```

---

### Section: Seed Stage 1.1.2 - RMM (Lines 160-183)
**Status:** ⏳ Not Reviewed / ✅ Approved / ⚠️ Needs Changes

**RLS Validation Requirements:**
- [ ] Company users see only their company's products/SKUs/submissions
- [ ] MOH users see all companies' data
- [ ] Role-based visibility is correct

**Comments:**
```
[Add comments]
```

---

### Section: Seed Stage 1.2.1 - VCI AAMS (Lines 186-205)
**Status:** ⏳ Not Reviewed / ✅ Approved / ⚠️ Needs Changes

**RLS Validation Requirements:**
- [ ] Company users see only their company's AAMS submissions
- [ ] MOH users see all AAMS submissions
- [ ] Visibility timing matches wireframes (company sees immediately, MOH sees after approval)

**Comments:**
```
[Add comments]
```

---

### Section: Seed Stage 1.2.2 - VCI MSQ (Lines 209-219)
**Status:** ⏳ Not Reviewed / ✅ Approved / ⚠️ Needs Changes

**RLS Validation Requirements:**
- [ ] Company users see only their company's MSQ submissions
- [ ] MOH users see all MSQ submissions

**Comments:**
```
[Add comments]
```

---

### Section: Seed Stage 1.2.3 - VCI WSL (Lines 223-235)
**Status:** ⏳ Not Reviewed / ✅ Approved / ⚠️ Needs Changes

**RLS Validation Requirements:**
- [ ] Company users see only their company's WSL submissions and breaches
- [ ] MOH users see all WSL submissions and breaches

**Comments:**
```
[Add comments]
```

---

### Section: Seed Stage 1.3.3 - ECS (Lines 238-252)
**Status:** ⏳ Not Reviewed / ✅ Approved / ⚠️ Needs Changes

**RLS Validation Requirements:**
- [ ] Company users see only their company's export requests/authorizations
- [ ] MOH users see all export requests/authorizations

**Comments:**
```
[Add comments]
```

---

### Section: Seed Stage 1.4.2 - CMC (Lines 255-270)
**Status:** ⏳ Not Reviewed / ✅ Approved / ⚠️ Needs Changes

**RLS Validation Requirements:**
- [ ] Company users see only their company's scores and disputes
- [ ] MOH users see all scores, disputes, and reports

**Comments:**
```
[Add comments]
```

---

## Overall Assessment

**Overall Status:** ⏳ In Progress / ✅ Approved / ⚠️ Needs Changes / ❌ Rejected

**Critical Issues:** [ ] None / [ ] Yes (see below)

**Critical Issues List:**
```
[List critical issues that must be addressed]
```

**Blocking Issues:** [ ] None / [ ] Yes (see below)

**Blocking Issues List:**
```
[List issues that block approval]
```

**General Comments:**
```
[Add general comments about the playbook]
```

---

## Approval

**Reviewer Signature:** _______________  
**Date:** _______________  
**Status:** [ ] Approved / [ ] Approved with Changes / [ ] Needs Revision / [ ] Rejected

**Next Steps:**
```
[What needs to happen next]
```

---

**Submit this review to:** Hassan (Coordinator)
