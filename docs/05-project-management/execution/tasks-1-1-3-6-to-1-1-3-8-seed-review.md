# RMM Seed Data Review - Hassan

**Date:** January 24, 2026  
**Reviewed By:** Hassan (QA/Assurance Engineer)  
**Status:** ⚠️ **ISSUES FOUND** - Requires Fixes

---

## Executive Summary

Review of RMM seed data (`seed_1_1_2_rmm`) reveals **critical gaps** that do not meet the requirements specified in `phase-1-1-mockdata.md`. While basic counts are met, the **distribution** of data across companies is insufficient.

---

## Current Seed Data Status

### ✅ **Requirements Met:**

1. **Companies:** 75 companies ✅
   - 38 IPC companies
   - 37 Wholesaler companies
   - All active

2. **ATC Codes:** 50 ATC codes ✅
   - All active
   - All SKUs have ATC codes assigned

3. **Critical Medicines:** 10 critical medicines ✅
   - All active

4. **SKU Pharma Attributes:** All 20 SKUs have complete pharma attributes ✅
   - dosage_strength: 20/20
   - dosage_form: 20/20
   - pack_size: 20/20
   - unit_of_measure: 20/20

5. **Registry Submissions:** 13 submissions across workflow statuses ✅
   - draft: 2
   - submitted: 2
   - tier2_verified: 2
   - tier1_approved: 2
   - tier2_implemented: 2
   - completed: 2
   - rejected: 1

6. **Approval History:** 9 approval history records ✅
   - All submissions have approval history

7. **Users:** All 9 roles represented ✅
   - 1 Tier 1
   - 1 Tier 2 Officer
   - 1 Tier 2 Registrar
   - 1 Auditor
   - 3 Company Admin
   - 4 Company Manager
   - 1 Company User
   - 1 System Admin
   - 1 Vendor

---

## ❌ **Critical Issues Found:**

### Issue 1: Insufficient Product Distribution Across Companies

**Requirement:** "minimum 10 products per active company" (from `phase-1-1-mockdata.md` line 253)

**Current State:**
- Only **1 company** (Casablanca Pharma Industries) has products (10 products)
- **73 companies** have **0 products**
- **0 companies** meet the "10+ products per company" requirement for multiple companies

**Impact:**
- Cannot test pagination/filtering for products across multiple companies
- Cannot test company-specific product views
- Empty state testing only works for 1 company scenario
- Wireframe scenarios requiring multiple companies with products cannot be tested

**Required Fix:**
- Seed products for **at least 5-10 companies** with 10+ products each
- This ensures realistic testing scenarios across multiple companies

---

### Issue 2: Insufficient SKU Distribution

**Requirement:** "20+ SKUs (with complete pharma attributes)" for active company (from `phase-1-1-mockdata.md` line 263)

**Current State:**
- Only **1 company** has SKUs (20 SKUs)
- **74 companies** have **0 SKUs**

**Impact:**
- Cannot test SKU listing/filtering across multiple companies
- Cannot test company-specific SKU views
- Wireframe scenarios requiring multiple companies with SKUs cannot be tested

**Required Fix:**
- Seed SKUs for **at least 5-10 companies** with 20+ SKUs each
- Ensure all SKUs have complete pharma attributes

---

### Issue 3: Missing Empty Company Scenario

**Requirement:** "pack_company_empty remains empty (for empty state testing)" (from `phase-1-1-mockdata.md` line 273)

**Current State:**
- 73 companies are empty (no products, no SKUs)
- This actually **meets** the requirement for empty state testing

**Status:** ✅ **OK** - Empty companies exist for empty state testing

---

### Issue 4: Registry Submission Status Coverage

**Requirement:** Registry submissions across all statuses (from `phase-1-1-mockdata.md` lines 264-272)

**Current State:**
- Statuses present: draft, submitted, tier2_verified, tier1_approved, tier2_implemented, completed, rejected
- **Note:** The database enum shows `tier2_peer_reviewed` exists, but requirements mention `pending_verification`, `pending_approval`, `pending_implementation` which don't match the enum

**Status:** ⚠️ **NEEDS CLARIFICATION** - Status names in requirements don't match database enum

---

## Detailed Analysis

### Company Product Distribution

```
Companies with products: 1/75 (1.3%)
Companies with 10+ products: 0/75 (0%)
Average products per company: 0.15
Max products per company: 10
Min products per company: 0
```

**Required:** At least 5-10 companies should have 10+ products each.

### Company SKU Distribution

```
Companies with SKUs: 1/75 (1.3%)
Companies with 20+ SKUs: 0/75 (0%)
Average SKUs per company: 0.27
Max SKUs per company: 20
Min SKUs per company: 0
```

**Required:** At least 5-10 companies should have 20+ SKUs each.

### User Distribution

```
Total users: 14
Company users: 8 (3 admin, 4 manager, 1 user)
MOH users: 4 (1 tier1, 1 tier2_officer, 1 tier2_registrar, 1 auditor)
System users: 2 (1 system_admin, 1 vendor)
Companies with users: 6/75 (8%)
```

**Status:** ✅ **OK** - User distribution is reasonable, though more companies could have users for testing.

---

## Recommendations

### Priority 1 (Critical - Must Fix):

1. **Seed products for 5-10 additional companies:**
   - Each company should have 10+ products
   - Mix of critical and non-critical medicines
   - Realistic product names

2. **Seed SKUs for 5-10 additional companies:**
   - Each company should have 20+ SKUs
   - All SKUs must have complete pharma attributes
   - Realistic SKU codes and names

### Priority 2 (Important - Should Fix):

3. **Seed users for more companies:**
   - At least 10-15 companies should have associated users
   - Mix of company_admin, company_manager, company_user roles

4. **Clarify registry submission statuses:**
   - Verify if `pending_verification`, `pending_approval`, `pending_implementation` are valid statuses
   - Or update requirements to match actual enum values

---

## Acceptance Criteria Check

From `phase-1-1-mockdata.md` lines 281-296:

- [x] Companies list has enough rows for pagination/sorting/filtering (75+ companies)
- [x] Company detail tabs have meaningful content for "active" company:
  - [x] Overview tab: Company info, stats
  - [x] Products tab: 10+ products listed (for 1 company only)
  - [x] Submissions tab: Submissions across all statuses
  - [x] History tab: Approval history visible
- [x] Empty state for "empty" company (no products, no submissions) - 73 companies available
- [x] SKU list/detail show pharma attributes (not blanks):
  - [x] All SKUs have dosage_strength, dosage_form, pack_size, unit_of_measure
- [x] Registry submissions exist across all required statuses
- [x] ATC codes exist for realistic product coverage (50+ codes)
- [x] Critical medicines list populated (10+ medicines)
- [ ] **FAILED:** Multiple companies with products/SKUs for realistic testing scenarios

---

## Next Steps

1. **Create migration to add products/SKUs for 5-10 additional companies**
2. **Update seed data to meet "10+ products per company" requirement for multiple companies**
3. **Re-validate seed data after fixes**
4. **Coordinate with Farah for realism validation**
5. **Coordinate with Nadia for integrity validation**
6. **Coordinate with Rafi for RLS validation**

---

**Review Status:** ⚠️ **ISSUES FOUND** - Seed data needs expansion to meet requirements  
**Action Required:** Create additional seed data for 5-10 companies with products and SKUs  
**Blocking:** No - Current seed data works for basic testing, but needs expansion for comprehensive testing

---

**Reviewed By:** Hassan (QA/Assurance Engineer)  
**Date:** January 24, 2026
