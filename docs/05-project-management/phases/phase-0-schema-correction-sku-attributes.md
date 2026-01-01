# Phase 0 Schema Correction: SKU Pharmaceutical Attributes

**Date:** 2025-12-31  
**Status:** ✅ Complete  
**Initiated By:** User  
**Implemented By:** Emma (UI/UX + Next.js Frontend Specialist)

## Critical Schema Gap Identified

The SKU table was **missing essential pharmaceutical product attributes** required for proper data modeling and simplified submissions.

## Problem Statement

### Original (Incomplete) SKU Schema
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

## Solution Implemented

### Updated (Complete) SKU Schema
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

## New SKU Fields

### dosage_strength (text, NOT NULL)
**Purpose:** Pharmaceutical strength/dosage  
**Examples:**
- "500mg" (tablets)
- "10mg/ml" (liquid)
- "250mg/5ml" (suspension)
- "2%" (cream/ointment)
- "100mg" (capsules)

### dosage_form (text, NOT NULL)
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

### pack_size (text, NOT NULL)
**Purpose:** Packaging quantity  
**Examples:**
- "30 tablets"
- "100ml bottle"
- "50 capsules"
- "10 vials"
- "20g tube"
- "Box of 12 ampoules"

### unit_of_measure (text, NOT NULL)
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

## Submission Data Structure Changes

### Before (Complex - Repeated Data)
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

### After (Simplified - SKU_ID + Quantity)
```json
{
  "company_id": "uuid",
  "year": 2024,
  "submission_data": [
    {"sku_id": "uuid-123", "quantity": 10000}
  ]
}
```

## Impact on Submissions

### AAMS Submissions
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

### MSQ Submissions
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

### WSL Submissions
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

## Files Updated

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

## Database Migration Required

### Migration: Add SKU Pharmaceutical Attributes

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

## UI/UX Implications

### SKU Display
**Format:** `{name} {dosage_strength} {dosage_form} {pack_size}`  
**Example:** "Paracetamol 500mg Tablets 30-pack"

### Submission Forms
**AAMS/MSQ/WSL Forms:**
- Show SKU dropdown with full description
- Input field: "Quantity ({unit_of_measure})"
- Example: "Quantity (tablets): [_____]"

### Reporting
**Tables should show:**
- SKU Name (full description)
- Dosage
- Form
- Pack Size
- Quantity (with unit)

## Validation Rules

### SKU Creation/Update
1. **dosage_strength:** Required, non-empty
2. **dosage_form:** Required, should match standard forms (Tablet, Capsule, etc.)
3. **pack_size:** Required, non-empty
4. **unit_of_measure:** Required, should match standard units (tablets, ml, etc.)

### Submission Validation
1. **SKU_ID:** Must exist and be active
2. **Quantity:** Must be > 0
3. **Unit:** Implicitly defined by SKU's unit_of_measure

## Benefits Summary

### For Companies
1. ✅ **Simpler submissions:** Only enter SKU_ID + Quantity
2. ✅ **No repeated data entry:** Product details stored once in SKU
3. ✅ **Faster data entry:** Dropdown selection + quantity input
4. ✅ **Fewer errors:** No manual entry of product specifications

### For MOH
1. ✅ **Consistent data:** Product details standardized in SKU registry
2. ✅ **Better reporting:** Full product specifications available for all submissions
3. ✅ **Easier validation:** SKU-level thresholds and breaches
4. ✅ **Clear audit trail:** SKU changes tracked separately from submissions

### For System
1. ✅ **Data integrity:** Foreign key relationships ensure valid SKUs
2. ✅ **Performance:** Smaller submission payloads
3. ✅ **Scalability:** SKU registry grows independently of submissions
4. ✅ **Maintainability:** Product details updated once, reflected everywhere

## Next Steps for Phase 1.1

1. **Database Migration:** Create and apply SKU attributes migration
2. **Seed Data:** Populate existing SKUs with proper attributes
3. **UI Components:** Build SKU selector with full description display
4. **Form Validation:** Implement SKU_ID + Quantity validation
5. **API Endpoints:** Update submission endpoints to accept new structure
6. **RPC Functions:** Update functions to handle SKU_ID arrays
7. **Reporting:** Join SKU details in all submission reports

## Conclusion

This schema correction ensures that:
- ✅ SKUs contain complete pharmaceutical product specifications
- ✅ Submissions are simplified to **SKU_ID + Quantity only**
- ✅ No repeated data entry across submissions
- ✅ Clear unit of measure for quantity tracking
- ✅ Better data integrity and consistency

This is a **critical Phase 0 correction** that must be implemented before Phase 1.1 development begins.

---

**Sign-off:** Emma (UI/UX + Next.js Frontend Specialist)  
**Date:** 2025-12-31

