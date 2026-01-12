# Phase 0 Corrections and Clarifications

**Date:** 2025-12-31  
**Status:** ✅ Complete  
**Initiated By:** User  
**Implemented By:** Emma (UI/UX + Next.js Frontend Specialist)

## Overview

This document consolidates all corrections and clarifications made during Phase 0 after the initial technical foundation was established. These corrections ensure accuracy, clarity, and completeness of the architecture before proceeding to Phase 1.1 development.

---

## Correction 1: Sales = Quantities (Not Financial)

### Critical Clarification

**The PM platform tracks stock levels and quantities ONLY, NOT financial data.**

All references to "sales" throughout the platform refer to **quantities of units sold**, NOT prices, revenue, or any financial values. This is a stock sufficiency and regulatory compliance system, not a financial system.

### Key Terms Clarified

#### AAMS (Annual Average Monthly Sales)
- **Definition:** Average monthly **quantity of units sold** over a 12-month calendar year
- **NOT:** Financial sales, revenue, or prices
- **Data Type:** Numeric (quantity)
- **Example:** 10,000 units per month average

#### MSQ (Monthly Sales Quantities)
- **Definition:** Actual **quantities of units sold** each month
- **NOT:** Financial sales, revenue, or prices
- **Data Type:** Numeric (quantity)
- **Example:** 12,500 units sold in January

#### WSL (Weekly Stock Levels)
- **Definition:** Current **stock quantities** (units in inventory)
- **NOT:** Stock value, inventory value
- **Data Type:** Numeric (quantity)
- **Example:** 45,000 units in stock

#### XAMS (X Months Average Monthly Sales)
- **Definition:** Rolling average of monthly **sales quantities** over X months
- **NOT:** Financial sales, revenue, or prices
- **Data Type:** Numeric (quantity)
- **Example:** 11,200 units per month average (over 6 months)

#### Thresholds
- **Definition:** Minimum **stock quantity** required for a SKU
- **NOT:** Financial threshold, value threshold
- **Data Type:** Numeric (quantity)
- **Calculation:** Multiplier × AAMS (or XAMS)
- **Example:** 3 × 10,000 = 30,000 units minimum stock required

#### Breaches
- **Definition:** When stock **quantity** falls below threshold **quantity**
- **NOT:** Financial breach, value breach
- **Example:** Stock level 28,000 units < Threshold 30,000 units = BREACH

### Files Updated

#### Reference Documents
1. **`docs/10-references/acronyms.md`**
   - ✅ Fixed AAMS definition: ~~Annual Average Market Share~~ → Annual Average Monthly Sales (Quantities)
   - ✅ Fixed MSQ definition: ~~Market Share Quota~~ → Monthly Sales Quantities
   - ✅ Fixed WSL definition: ~~Wholesaler Stock Level~~ → Weekly Stock Levels
   - ✅ Added XAMS, ATC, SKU definitions

2. **`docs/10-references/glossary.md`**
   - ✅ Added comprehensive "Sales" definition emphasizing quantities
   - ✅ Added detailed definitions for AAMS, MSQ, WSL, XAMS
   - ✅ Added clarifications for Threshold, Breach, Value Chain
   - ✅ Emphasized "NOT financial" throughout

#### Core Documentation
3. **`docs/00-overview/Project Brief – PM.md`**
   - ✅ Added overview note: "This platform tracks stock levels and quantities only"
   - ✅ Clarified VCI module description: "quantities of units sold"
   - ✅ Updated AAMS workflow: "sales quantities data"
   - ✅ Updated ECS threshold: "XAMS (X Months Average Monthly Sales Quantities)"

#### Database Documentation
4. **`docs/02-architecture/database/data-dictionary.md`**
   - ✅ Added purpose notes to AAMS, MSQ, WSL table sections
   - ✅ Updated `aams_value` field: "AAMS value (quantity)"
   - ✅ Updated `threshold_value` field: "Threshold value (quantity)"
   - ✅ Updated `stock_level` field: "Stock level at breach (quantity)"
   - ✅ Added "NOT a financial value" clarifications

5. **`docs/02-architecture/database/schema-design.md`**
   - ✅ Added purpose notes to AAMS, MSQ, WSL, Thresholds, Breaches tables
   - ✅ Updated column descriptions: "quantity of units sold per month average"
   - ✅ Updated threshold descriptions: "minimum stock quantity required"
   - ✅ Updated export quantity: "units to export"

#### API Documentation
6. **`docs/02-architecture/integration/erp-api-spec.md`**
   - ✅ Added overview note: "All sales and stock data represents quantities/units"
   - ✅ Added endpoint notes for MSQ, AAMS, WSL submissions

7. **`docs/02-architecture/api/rpc-functions.md`**
   - ✅ Updated `aams_value` parameter: "quantity of units sold per month average"
   - ✅ Updated `quantity` parameter: "units to export"
   - ✅ Updated `actual_quantity` parameter: "units"

### Impact Assessment

#### No Code Changes Required
- Database schema uses `numeric` type (appropriate for quantities)
- Field names are already clear (`aams_value`, `quantity`, `stock_level`)
- No financial calculations in codebase

#### Documentation Clarity Improved
- ✅ Eliminated ambiguity in acronyms
- ✅ Clarified all "sales" references
- ✅ Added explicit "NOT financial" statements
- ✅ Updated glossary and acronyms as reference

#### Developer Guidance
- All developers must understand: **Sales = Quantities, NOT Financial**
- UI labels should emphasize "units" or "quantities"
- Form fields should show "Quantity" not just "Value"
- API documentation now explicitly states quantity-only data

### Validation Checklist

- [x] Acronyms corrected in `acronyms.md`
- [x] Glossary updated with quantity definitions
- [x] Project Brief clarified
- [x] Data dictionary updated with "quantity" clarifications
- [x] Schema design updated with purpose notes
- [x] API specs clarified
- [x] RPC functions clarified
- [x] All "sales" references reviewed

### Recommendations for Phase 1.1

#### UI/UX Implementation
1. **Form Labels:** Use "Quantity" explicitly
   - ❌ "AAMS Value"
   - ✅ "AAMS Quantity (Units Sold)"

2. **Table Headers:** Show units
   - ❌ "Sales"
   - ✅ "Sales Quantity (Units)"

3. **Input Placeholders:** Clarify units
   - ❌ "Enter value"
   - ✅ "Enter quantity (units)"

4. **Help Text:** Emphasize quantities
   - ✅ "Enter the average monthly quantity of units sold (not financial value)"

5. **Validation Messages:** Use "quantity" terminology
   - ✅ "Quantity must be greater than 0"
   - ✅ "Stock quantity cannot exceed threshold"

#### Database Comments
When creating migrations, add SQL comments:
```sql
COMMENT ON COLUMN aams_submissions.aams_value IS 
  'Average monthly quantity of units sold (NOT financial value)';

COMMENT ON COLUMN thresholds.threshold_value IS 
  'Minimum stock quantity required in units (NOT financial value)';
```

#### API Documentation
Ensure all API docs include examples with unit quantities:
```json
{
  "aams_value": 10000,  // 10,000 units per month average
  "stock_level": 45000,  // 45,000 units in stock
  "threshold": 30000     // 30,000 units minimum required
}
```

### Conclusion

All documentation has been updated to clarify that the PM platform tracks **quantities/units only**, NOT financial data. This clarification is now consistent across:
- Reference documents (acronyms, glossary)
- Core documentation (Project Brief)
- Database documentation (schema, data dictionary)
- API documentation (ERP API, RPC functions)

**No code changes required** - this was purely a documentation clarification to eliminate ambiguity.

---

## Correction 2: SKU Schema Correction - Pharmaceutical Attributes

### Critical Schema Gap Identified

The SKU table was **missing essential pharmaceutical product attributes** required for proper data modeling and simplified submissions.

### Problem Statement

#### Original (Incomplete) SKU Schema
```sql
skus
├── id (uuid)
├── product_id (uuid)
├── sku_code (text)
├── name (text)              -- Too generic
├── atc_code_id (uuid)
└── is_active (boolean)
```

**Issues:**
1. ❌ No dosage/strength specification
2. ❌ No pharmaceutical form specification
3. ❌ No pack size specification
4. ❌ No unit of measure for quantity tracking
5. ❌ Companies would need to repeatedly enter product details in every submission
6. ❌ SKU identification would be ambiguous

### Solution Implemented

#### Updated (Complete) SKU Schema
```sql
skus
├── id (uuid)
├── product_id (uuid)
├── sku_code (text)
├── name (text)                    -- Full descriptive name
├── dosage_strength (text)         -- NEW: "500mg", "10mg/ml", etc.
├── dosage_form (text)             -- NEW: "Tablet", "Capsule", "Syrup", etc.
├── pack_size (text)               -- NEW: "30 tablets", "100ml bottle", etc.
├── unit_of_measure (text)         -- NEW: "tablets", "ml", "capsules", etc.
├── atc_code_id (uuid)
├── is_moh_authorized_unregistered (boolean)
├── is_active (boolean)
└── timestamps...
```

**Benefits:**
1. ✅ Complete pharmaceutical product specification
2. ✅ Unique SKU identification (name + dosage + form + pack size)
3. ✅ Simplified submissions: **SKU_ID + Quantity only**
4. ✅ No repeated data entry in submissions
5. ✅ Clear unit of measure for quantity tracking

### New SKU Fields

#### dosage_strength (text, NOT NULL)
**Purpose:** Pharmaceutical strength/dosage  
**Examples:**
- "500mg" (tablets)
- "10mg/ml" (liquid)
- "250mg/5ml" (suspension)
- "2%" (cream/ointment)
- "100mg" (capsules)

#### dosage_form (text, NOT NULL)
**Purpose:** Pharmaceutical form type  
**Examples:**
- "Tablet"
- "Capsule"
- "Syrup"
- "Injection"
- "Cream"
- "Ointment"
- "Suppository"
- "Inhaler"
- "Drops"

#### pack_size (text, NOT NULL)
**Purpose:** Packaging quantity  
**Examples:**
- "30 tablets"
- "100ml bottle"
- "50 capsules"
- "10 vials"
- "20g tube"
- "Box of 12 ampoules"

#### unit_of_measure (text, NOT NULL)
**Purpose:** Unit for quantity tracking in submissions  
**Examples:**
- "tablets"
- "ml"
- "capsules"
- "vials"
- "boxes"
- "grams"
- "ampoules"

**Usage:** This field defines what "quantity" means for this SKU in AAMS/MSQ/WSL submissions.

### Submission Data Structure Changes

#### Before (Complex - Repeated Data)
```json
{
  "company_id": "uuid",
  "year": 2024,
  "data": [
    {
      "product_name": "Paracetamol",
      "dosage": "500mg",
      "form": "Tablet",
      "pack_size": "30 tablets",
      "quantity": 10000
    }
  ]
}
```

#### After (Simplified - SKU_ID + Quantity)
```json
{
  "company_id": "uuid",
  "year": 2024,
  "submission_data": [
    {"sku_id": "uuid-123", "quantity": 10000}
  ]
}
```

### Impact on Submissions

#### AAMS Submissions
**Structure:**
```json
{
  "company_id": "uuid",
  "year": 2024,
  "aams_value": 10000,  // Optional company-wide aggregate
  "submission_data": [
    {"sku_id": "uuid-123", "quantity": 10000},
    {"sku_id": "uuid-456", "quantity": 5000}
  ]
}
```

**Display (via JOIN):**
- SKU: "Paracetamol 500mg Tablets 30-pack"
- AAMS Quantity: 10,000 tablets/month

#### MSQ Submissions
**Structure:**
```json
{
  "company_id": "uuid",
  "year": 2024,
  "month": 1,
  "submission_data": [
    {"sku_id": "uuid-123", "quantity": 12500},
    {"sku_id": "uuid-456", "quantity": 6200}
  ]
}
```

**Display (via JOIN):**
- SKU: "Paracetamol 500mg Tablets 30-pack"
- MSQ Quantity: 12,500 tablets (January 2024)

#### WSL Submissions
**Structure:**
```json
{
  "company_id": "uuid",
  "week_ending": "2024-01-05",
  "submission_data": [
    {
      "sku_id": "uuid-123",
      "quantity": 45000,
      "breach_reason": null,
      "replenishment_date": null
    },
    {
      "sku_id": "uuid-456",
      "quantity": 28000,
      "breach_reason": "Production delay",
      "replenishment_date": "2024-01-15"
    }
  ]
}
```

**Display (via JOIN):**
- SKU: "Paracetamol 500mg Tablets 30-pack"
- Stock Level: 45,000 tablets
- Status: ✅ Above threshold

### Files Updated

1. **`docs/02-architecture/database/schema-design.md`**
   - ✅ Added 4 new SKU fields: dosage_strength, dosage_form, pack_size, unit_of_measure
   - ✅ Updated AAMS submission_data description
   - ✅ Updated MSQ submission_data description
   - ✅ Updated WSL submission_data description
   - ✅ Added notes about SKU containing all product details

2. **`docs/02-architecture/database/data-dictionary.md`**
   - ✅ Added detailed field descriptions for new SKU attributes
   - ✅ Updated submission_data field descriptions with JSON examples
   - ✅ Added purpose notes emphasizing SKU_ID + Quantity pattern

3. **`docs/10-references/glossary.md`**
   - ✅ Added comprehensive SKU definition
   - ✅ Explained SKU_ID + Quantity submission pattern

### Database Migration Required

#### Migration: Add SKU Pharmaceutical Attributes

```sql
-- Migration: 20250101000001_add_sku_pharmaceutical_attributes.sql

-- Add new columns to skus table
ALTER TABLE skus
ADD COLUMN dosage_strength text NOT NULL DEFAULT 'TBD',
ADD COLUMN dosage_form text NOT NULL DEFAULT 'TBD',
ADD COLUMN pack_size text NOT NULL DEFAULT 'TBD',
ADD COLUMN unit_of_measure text NOT NULL DEFAULT 'units';

-- Add index on dosage_form for filtering
CREATE INDEX idx_skus_dosage_form ON skus(dosage_form);

-- Update existing SKUs to have proper values
-- (This will need to be done manually or via data migration script)

-- Remove defaults after data migration
ALTER TABLE skus
ALTER COLUMN dosage_strength DROP DEFAULT,
ALTER COLUMN dosage_form DROP DEFAULT,
ALTER COLUMN pack_size DROP DEFAULT,
ALTER COLUMN unit_of_measure DROP DEFAULT;

-- Add comment
COMMENT ON COLUMN skus.dosage_strength IS 
  'Pharmaceutical strength (e.g., 500mg, 10mg/ml). NOT a financial value.';
COMMENT ON COLUMN skus.dosage_form IS 
  'Pharmaceutical form (e.g., Tablet, Capsule, Syrup, Injection)';
COMMENT ON COLUMN skus.pack_size IS 
  'Pack size (e.g., 30 tablets, 100ml bottle)';
COMMENT ON COLUMN skus.unit_of_measure IS 
  'Unit for quantity tracking (e.g., tablets, ml, capsules)';
```

### UI/UX Implications

#### SKU Display
**Format:** `{name} {dosage_strength} {dosage_form} {pack_size}`  
**Example:** "Paracetamol 500mg Tablets 30-pack"

#### Submission Forms
**AAMS/MSQ/WSL Forms:**
- Show SKU dropdown with full description
- Input field: "Quantity ({unit_of_measure})"
- Example: "Quantity (tablets): [_____]"

#### Reporting
**Tables should show:**
- SKU Name (full description)
- Dosage
- Form
- Pack Size
- Quantity (with unit)

### Validation Rules

#### SKU Creation/Update
1. **dosage_strength:** Required, non-empty
2. **dosage_form:** Required, should match standard forms (Tablet, Capsule, etc.)
3. **pack_size:** Required, non-empty
4. **unit_of_measure:** Required, should match standard units (tablets, ml, etc.)

#### Submission Validation
1. **SKU_ID:** Must exist and be active
2. **Quantity:** Must be > 0
3. **Unit:** Implicitly defined by SKU's unit_of_measure

### Benefits Summary

#### For Companies
1. ✅ **Simpler submissions:** Only enter SKU_ID + Quantity
2. ✅ **No repeated data entry:** Product details stored once in SKU
3. ✅ **Faster data entry:** Dropdown selection + quantity input
4. ✅ **Fewer errors:** No manual entry of product specifications

#### For MOH
1. ✅ **Consistent data:** Product details standardized in SKU registry
2. ✅ **Better reporting:** Full product specifications available for all submissions
3. ✅ **Easier validation:** SKU-level thresholds and breaches
4. ✅ **Clear audit trail:** SKU changes tracked separately from submissions

#### For System
1. ✅ **Data integrity:** Foreign key relationships ensure valid SKUs
2. ✅ **Performance:** Smaller submission payloads
3. ✅ **Scalability:** SKU registry grows independently of submissions
4. ✅ **Maintainability:** Product details updated once, reflected everywhere

### Next Steps for Phase 1.1

1. **Database Migration:** Create and apply SKU attributes migration
2. **Seed Data:** Populate existing SKUs with proper attributes
3. **UI Components:** Build SKU selector with full description display
4. **Form Validation:** Implement SKU_ID + Quantity validation
5. **API Endpoints:** Update submission endpoints to accept new structure
6. **RPC Functions:** Update functions to handle SKU_ID arrays
7. **Reporting:** Join SKU details in all submission reports

### Conclusion

This schema correction ensures that:
- ✅ SKUs contain complete pharmaceutical product specifications
- ✅ Submissions are simplified to **SKU_ID + Quantity only**
- ✅ No repeated data entry across submissions
- ✅ Clear unit of measure for quantity tracking
- ✅ Better data integrity and consistency

This is a **critical Phase 0 correction** that must be implemented before Phase 1.1 development begins.

---

## Summary

Both corrections ensure:
- ✅ **Documentation Clarity:** All "sales" references clarified as quantities (not financial)
- ✅ **Schema Completeness:** SKU table includes all essential pharmaceutical attributes
- ✅ **Simplified Submissions:** SKU_ID + Quantity pattern eliminates repeated data entry
- ✅ **Better Data Integrity:** Clear field definitions and constraints
- ✅ **Improved Developer Experience:** Clear guidance for Phase 1.1 implementation

**Status:** ✅ **ALL CORRECTIONS COMPLETE**  
**Next Phase:** [Phase 1 Overview](phase-1-overview.md#phase-11-rmm-vci-development)

---

**Sign-off:** Emma (UI/UX + Next.js Frontend Specialist)  
**Date:** 2025-12-31

