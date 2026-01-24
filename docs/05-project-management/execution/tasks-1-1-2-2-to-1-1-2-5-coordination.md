# Tasks 1.1.2.2 to 1.1.2.5 Team Coordination - RMM Module Backend Implementation

**Date:** 2026-01-23
**From:** Sami (Implementation Compliance Specialist)
**To:** Oliver (Backend Lead), Yasmine (Frontend Lead), Nadia (Database Specialist), Hassan (Seed Data Specialist), Fatima (MOH Regulatory Requirements), Dr. Samir (Business Process Validation)

---

## Subject: Proceeding with RMM Module Backend Tasks 1.1.2.2 to 1.1.2.5

Team,

I am coordinating the implementation of **Tasks 1.1.2.2 to 1.1.2.5** for the RMM Module backend. Task 1.1.2.1 (Company CRUD) has been completed and verified. All compliance prerequisites have been verified, and we are ready to proceed with the next set of backend tasks.

---

## ✅ Prerequisites Verification

### Task 1.1.2.1 Completion
- ✅ **Status:** COMPLETE - All 5 Company CRUD RPC functions implemented
- ✅ **Verification:** Migration file created and documented
- ✅ **Ready for Next Tasks:** Confirmed

### Schema Verification
- ✅ `products` table exists (migration `20260122003829_create_rmm_tables.sql`)
- ✅ `skus` table exists (with Phase 0.6 pharma attributes: dosage_strength, dosage_form, pack_size, unit_of_measure)
- ✅ `atc_codes` table exists
- ✅ `critical_medicines` table exists
- ✅ `registry_submissions` table exists
- ✅ RLS policies exist (from Task 1.1.1.5)

---

## 🎯 Tasks to Implement

### Task 1.1.2.2: Create RMM RPC functions - Product CRUD
**Functions Required:**
- `rmm_create_product()` - Create new product
- `rmm_update_product()` - Update existing product
- `rmm_get_product()` - Get product by ID
- `rmm_list_products()` - List products with pagination, filtering, sorting
- `rmm_submit_registry_update()` - Already implemented in Task 1.1.2.1 (will reuse)

**Access Control:**
- Company users: Can create/update/view products for their own company
- MOH Tier 1: Full access to all products
- System Admin: Full access to all products

### Task 1.1.2.3: Create RMM RPC functions - SKU CRUD
**Functions Required:**
- `rmm_create_sku()` - Create new SKU (with Phase 0.6 pharma attributes)
- `rmm_update_sku()` - Update existing SKU
- `rmm_get_sku()` - Get SKU by ID
- `rmm_list_skus()` - List SKUs with pagination, filtering, sorting
- `rmm_submit_registry_update()` - Already implemented (will reuse)

**Access Control:**
- Company users: Can create/update/view SKUs for their own company's products
- MOH Tier 1: Full access to all SKUs
- System Admin: Full access to all SKUs

**Phase 0.6 Requirements:**
- Must handle dosage_strength, dosage_form, pack_size, unit_of_measure fields

### Task 1.1.2.3a: Create RMM helper RPC functions (history and relationship queries)
**Functions Required:**
- `rmm_list_company_products()` - List all products for a company
- `rmm_get_company_history()` - Get company history (registry submissions)
- `rmm_list_product_skus()` - List all SKUs for a product
- `rmm_get_product_history()` - Get product history (registry submissions)
- `rmm_get_sku_history()` - Get SKU history (registry submissions)

**Access Control:**
- Company users: Can only access their own company's data
- MOH users: Can access all data
- System Admin: Can access all data

### Task 1.1.2.4: Create RMM RPC functions - ATC Code management (MOH only)
**Functions Required:**
- `rmm_create_atc_code()` - Create new ATC code (MOH only)
- `rmm_update_atc_code()` - Update ATC code (MOH only)
- `rmm_get_atc_code()` - Get ATC code by ID (read-only for all)
- `rmm_list_atc_codes()` - List ATC codes (read-only for all, MOH can manage)

**Access Control:**
- Company users: Read-only access
- MOH Tier 1: Full access (create, update)
- System Admin: Full access

### Task 1.1.2.5: Create RMM RPC functions - Critical Medicine management (MOH only)
**Functions Required:**
- `rmm_designate_critical_medicine()` - Designate SKU as critical medicine (MOH only)
- `rmm_remove_critical_medicine()` - Remove critical medicine designation (MOH only)
- `rmm_get_critical_medicines()` - List critical medicines (read-only for all)
- `rmm_is_critical_medicine()` - Check if SKU is critical medicine (read-only for all)

**Access Control:**
- Company users: Read-only access
- MOH Tier 1: Full access (designate, remove)
- System Admin: Full access

---

## 📋 Implementation Plan

### Sequential Execution:
1. **Task 1.1.2.2:** Product CRUD functions
2. **Task 1.1.2.3:** SKU CRUD functions
3. **Task 1.1.2.3a:** Helper functions (history and relationships)
4. **Task 1.1.2.4:** ATC Code management functions
5. **Task 1.1.2.5:** Critical Medicine management functions

### Expected Deliverables:
- Migration files for each task
- All RPC functions implemented with proper access control
- API contract documentation (inline comments)
- Compliance verification documents

---

## 🔄 Team Coordination Points

### Oliver (Backend Lead)
- **Action:** Review RPC function implementations for backend best practices
- **Timing:** After each task completion
- **Focus:** Function structure, error handling, performance, security

### Nadia (Database Specialist)
- **Action:** Review migrations for database best practices and schema compliance
- **Timing:** After each task completion
- **Focus:** SQL patterns, index usage, query optimization, RLS integration

### Yasmine (Frontend Lead)
- **Action:** Review API contracts for frontend integration readiness
- **Timing:** After all tasks complete
- **Focus:** API usability, response formats, error handling

### Fatima (MOH Regulatory Requirements)
- **Action:** Review business logic for regulatory compliance
- **Timing:** After Task 1.1.2.4 and 1.1.2.5 completion
- **Focus:** ATC code management, critical medicine designation process

### Dr. Samir (Business Process Validation)
- **Action:** Review business process alignment
- **Timing:** After all tasks complete
- **Focus:** Product/SKU workflow, relationship queries, history tracking

---

## ⚠️ Compliance Reminders

- **Sequential Execution:** All tasks must be completed in sequence
- **Role-Based Access Control:** All functions must enforce proper access control
- **Phase 0.6 Compliance:** SKU functions must handle pharma attributes (dosage_strength, dosage_form, pack_size, unit_of_measure)
- **Sami's Stop Authority:** Any compliance violation will result in immediate stop
- **No Mock Data:** All data must come from Supabase database

---

Please acknowledge receipt. Implementation will proceed sequentially through all tasks.

Best regards,
Sami
Implementation Compliance Specialist
