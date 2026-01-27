# Wireframe Task ID Audit Report

**Date:** 2026-01-26  
**Status:** ⚠️ **CONFLICTS FOUND**  
**Auditor:** AI Assistant (Oliver + Sami)

---

## Executive Summary

Comprehensive audit of all wireframe task IDs across documentation and file names. **4 conflicts identified** requiring resolution.

---

## Conflicts Identified

### 🔴 **CRITICAL CONFLICT 1: task-0.5.3.7**

**Issue:** Task ID used for two different wireframes in documentation

**Actual Wireframe File:**
- `task-0.5.3.7-threshold-reversion-review.md` (Threshold Reversion Review)

**Documentation References:**
- `wireframe-route-mapping.md` line 72: `/vci/submissions/msq` → `task-0.5.3.7` ❌ **WRONG**
- `wireframe-route-mapping.md` line 82: `/vci/thresholds/[id]/revert-review` → `task-0.5.3.7` ✅ **CORRECT**
- `feature-index.md` line 312: Threshold Reversion Review → `task-0.5.3.7` ✅ **CORRECT**
- `route-inventory.md` line 62: `/vci/submissions/msq` → `task-0.5.3.7` ❌ **WRONG**

**Correct Task ID for MSQ Submissions List:**
- Actual file: `task-0.5.3.9-msq-submissions-list.md`
- `feature-index.md` line 326: MSQ Submissions List → `task-0.5.3.9` ✅ **CORRECT**

**Resolution Required:**
- Update `wireframe-route-mapping.md` line 72: Change `/vci/submissions/msq` from `task-0.5.3.7` to `task-0.5.3.9`
- Update `route-inventory.md` line 62: Change `/vci/submissions/msq` from `task-0.5.3.7` to `task-0.5.3.9`

---

### 🔴 **CRITICAL CONFLICT 2: task-0.5.3.11**

**Issue:** Two different wireframe files use the same task ID

**Files with Same Task ID:**
1. `task-0.5.3.11-msq-submission-detail.md` (MSQ Submission Detail)
2. `task-0.5.3.11-wsl-submissions-list.md` (WSL Submissions List)

**Documentation References:**
- `feature-index.md` line 327: MSQ Submission Detail → `task-0.5.3.11` ✅ **CORRECT** (matches file)
- `wireframe-route-mapping.md` line 75: `/vci/submissions/wsl` → `task-0.5.3.11` ✅ **CORRECT** (matches file)
- `feature-index.md` line 343: WSL Submissions List → `task-0.5.3.13` ❌ **WRONG** (should be 0.5.3.11)

**Resolution Required:**
- **Option A:** Renumber WSL submissions list to a new number (e.g., `task-0.5.3.19` or next available)
- **Option B:** Renumber MSQ submission detail to a new number
- **Recommendation:** Renumber WSL submissions list to `task-0.5.3.19` (next available in sequence) since MSQ is earlier in the workflow

**Files to Update if Option A (Renumber WSL list):**
- Rename file: `task-0.5.3.11-wsl-submissions-list.md` → `task-0.5.3.19-wsl-submissions-list.md`
- Update `wireframe-route-mapping.md` line 75: Change to `task-0.5.3.19`
- Update `route-inventory.md` line 63: Change to `task-0.5.3.19`
- Update `feature-index.md` line 343: Change to `task-0.5.3.19`
- Update VCI README.md: Change WSL submissions list to `task-0.5.3.19`

---

### 🔴 **CRITICAL CONFLICT 3: task-0.5.3.12**

**Issue:** Two different wireframe files use the same task ID

**Files with Same Task ID:**
1. `task-0.5.3.12-msq-correction-interface.md` (MSQ Correction Interface)
2. `task-0.5.3.12-wsl-submission-form.md` (WSL Submission Form)

**Documentation References:**
- `feature-index.md` line 329: MSQ Correction Interface → `task-0.5.3.20` ❌ **WRONG** (should be 0.5.3.12)
- `wireframe-route-mapping.md` line 77: `/vci/submissions/wsl/new` → `task-0.5.3.13` ❌ **WRONG** (should be 0.5.3.12)
- `feature-index.md` line 345: Create WSL Submission → `task-0.5.3.12` ✅ **CORRECT** (matches file)

**Resolution Required:**
- **Option A:** Renumber WSL submission form to a new number (e.g., `task-0.5.3.20`)
- **Option B:** Renumber MSQ correction interface to a new number
- **Recommendation:** Renumber WSL submission form to `task-0.5.3.20` since MSQ correction is a workflow action

**Files to Update if Option A (Renumber WSL form):**
- Rename file: `task-0.5.3.12-wsl-submission-form.md` → `task-0.5.3.20-wsl-submission-form.md`
- Update `wireframe-route-mapping.md` line 77: Change to `task-0.5.3.20`
- Update `feature-index.md` line 345: Change to `task-0.5.3.20`
- Update VCI README.md: Change WSL submission form to `task-0.5.3.20`

---

### 🟡 **DOCUMENTATION ERROR: task-0.5.3.13**

**Issue:** Feature-index.md incorrectly lists task-0.5.3.13 for both WSL submissions list AND WSL submission detail

**Actual Wireframe File:**
- `task-0.5.3.13-wsl-submission-detail.md` (WSL Submission Detail) ✅

**Documentation References:**
- `feature-index.md` line 343: WSL Submissions List → `task-0.5.3.13` ❌ **WRONG** (should be 0.5.3.11 or 0.5.3.19 after renumbering)
- `feature-index.md` line 344: WSL Submission Detail → `task-0.5.3.13` ✅ **CORRECT**
- `wireframe-route-mapping.md` line 76: `/vci/submissions/wsl/[id]` → `task-0.5.3.12` ❌ **WRONG** (should be 0.5.3.13)

**Resolution Required:**
- Update `feature-index.md` line 343: Change WSL Submissions List to correct task ID (after resolving conflict 2)
- Update `wireframe-route-mapping.md` line 76: Change `/vci/submissions/wsl/[id]` from `task-0.5.3.12` to `task-0.5.3.13`

---

### 🟡 **DOCUMENTATION ERROR: task-0.5.3.20**

**Issue:** Feature-index.md references task-0.5.3.20 for MSQ Correction Interface, but actual file is task-0.5.3.12

**Actual Wireframe File:**
- `task-0.5.3.12-msq-correction-interface.md` (MSQ Correction Interface) ✅

**Documentation References:**
- `feature-index.md` line 329: MSQ Correction Interface → `task-0.5.3.20` ❌ **WRONG** (should be 0.5.3.12)

**Resolution Required:**
- Update `feature-index.md` line 329: Change MSQ Correction Interface from `task-0.5.3.20` to `task-0.5.3.12`

---

## Summary of Required Fixes

### Priority 1: Resolve File Name Conflicts (Renumber Files)

1. **Renumber WSL Submissions List:**
   - Rename: `task-0.5.3.11-wsl-submissions-list.md` → `task-0.5.3.19-wsl-submissions-list.md`
   - Update all documentation references

2. **Renumber WSL Submission Form:**
   - Rename: `task-0.5.3.12-wsl-submission-form.md` → `task-0.5.3.20-wsl-submission-form.md`
   - Update all documentation references

### Priority 2: Fix Documentation References

1. **wireframe-route-mapping.md:**
   - Line 72: `/vci/submissions/msq` → Change from `task-0.5.3.7` to `task-0.5.3.9`
   - Line 75: `/vci/submissions/wsl` → Change from `task-0.5.3.11` to `task-0.5.3.19`
   - Line 76: `/vci/submissions/wsl/[id]` → Change from `task-0.5.3.12` to `task-0.5.3.13`
   - Line 77: `/vci/submissions/wsl/new` → Change from `task-0.5.3.13` to `task-0.5.3.20`

2. **feature-index.md:**
   - Line 326: MSQ Submissions List → Already correct (`task-0.5.3.9`)
   - Line 327: MSQ Submission Detail → Already correct (`task-0.5.3.11`)
   - Line 329: MSQ Correction Interface → Change from `task-0.5.3.20` to `task-0.5.3.12`
   - Line 343: WSL Submissions List → Change from `task-0.5.3.13` to `task-0.5.3.19`
   - Line 344: WSL Submission Detail → Already correct (`task-0.5.3.13`)
   - Line 345: Create WSL Submission → Change from `task-0.5.3.12` to `task-0.5.3.20`

3. **route-inventory.md:**
   - Line 62: `/vci/submissions/msq` → Change from `task-0.5.3.7` to `task-0.5.3.9`
   - Line 63: `/vci/submissions/wsl` → Change from `task-0.5.3.13` to `task-0.5.3.19`

4. **VCI README.md:**
   - Update WSL wireframes section to reflect correct task IDs

---

## Corrected Task ID Mapping (After Fixes)

### MSQ Wireframes:
- `task-0.5.3.9` - MSQ submissions list ✅
- `task-0.5.3.10` - MSQ submission form ✅
- `task-0.5.3.11` - MSQ submission detail ✅
- `task-0.5.3.12` - MSQ correction interface ✅

### WSL Wireframes (After Renumbering):
- `task-0.5.3.19` - WSL submissions list (renumbered from 0.5.3.11)
- `task-0.5.3.20` - WSL submission form (renumbered from 0.5.3.12)
- `task-0.5.3.13` - WSL submission detail ✅ (unchanged)

### Threshold Wireframes:
- `task-0.5.3.7` - Threshold reversion review ✅

---

## Verification Checklist

After fixes are applied, verify:
- [ ] No duplicate task IDs in wireframe file names
- [ ] All documentation references match actual file names
- [ ] wireframe-route-mapping.md matches feature-index.md
- [ ] route-inventory.md matches wireframe-route-mapping.md
- [ ] VCI README.md matches actual file structure

---

**Last Updated:** 2026-01-26  
**Next Review:** After conflict resolution
