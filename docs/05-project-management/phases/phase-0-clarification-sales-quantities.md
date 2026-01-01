# Phase 0 Clarification: Sales = Quantities (Not Financial)

**Date:** 2025-12-31  
**Status:** ✅ Complete  
**Initiated By:** User  
**Implemented By:** Emma (UI/UX + Next.js Frontend Specialist)

## Critical Clarification

**The PM platform tracks stock levels and quantities ONLY, NOT financial data.**

All references to "sales" throughout the platform refer to **quantities of units sold**, NOT prices, revenue, or any financial values. This is a stock sufficiency and regulatory compliance system, not a financial system.

## Key Terms Clarified

### AAMS (Annual Average Monthly Sales)
- **Definition:** Average monthly **quantity of units sold** over a 12-month calendar year
- **NOT:** Financial sales, revenue, or prices
- **Data Type:** Numeric (quantity)
- **Example:** 10,000 units per month average

### MSQ (Monthly Sales Quantities)
- **Definition:** Actual **quantities of units sold** each month
- **NOT:** Financial sales, revenue, or prices
- **Data Type:** Numeric (quantity)
- **Example:** 12,500 units sold in January

### WSL (Weekly Stock Levels)
- **Definition:** Current **stock quantities** (units in inventory)
- **NOT:** Stock value, inventory value
- **Data Type:** Numeric (quantity)
- **Example:** 45,000 units in stock

### XAMS (X Months Average Monthly Sales)
- **Definition:** Rolling average of monthly **sales quantities** over X months
- **NOT:** Financial sales, revenue, or prices
- **Data Type:** Numeric (quantity)
- **Example:** 11,200 units per month average (over 6 months)

### Thresholds
- **Definition:** Minimum **stock quantity** required for a SKU
- **NOT:** Financial threshold, value threshold
- **Data Type:** Numeric (quantity)
- **Calculation:** Multiplier × AAMS (or XAMS)
- **Example:** 3 × 10,000 = 30,000 units minimum stock required

### Breaches
- **Definition:** When stock **quantity** falls below threshold **quantity**
- **NOT:** Financial breach, value breach
- **Example:** Stock level 28,000 units < Threshold 30,000 units = BREACH

## Files Updated

### Reference Documents
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

### Core Documentation
3. **`docs/00-overview/Project Brief – PM.md`**
   - ✅ Added overview note: "This platform tracks stock levels and quantities only"
   - ✅ Clarified VCI module description: "quantities of units sold"
   - ✅ Updated AAMS workflow: "sales quantities data"
   - ✅ Updated ECS threshold: "XAMS (X Months Average Monthly Sales Quantities)"

### Database Documentation
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

### API Documentation
6. **`docs/02-architecture/integration/erp-api-spec.md`**
   - ✅ Added overview note: "All sales and stock data represents quantities/units"
   - ✅ Added endpoint notes for MSQ, AAMS, WSL submissions

7. **`docs/02-architecture/api/rpc-functions.md`**
   - ✅ Updated `aams_value` parameter: "quantity of units sold per month average"
   - ✅ Updated `quantity` parameter: "units to export"
   - ✅ Updated `actual_quantity` parameter: "units"

## Impact Assessment

### No Code Changes Required
- Database schema uses `numeric` type (appropriate for quantities)
- Field names are already clear (`aams_value`, `quantity`, `stock_level`)
- No financial calculations in codebase

### Documentation Clarity Improved
- ✅ Eliminated ambiguity in acronyms
- ✅ Clarified all "sales" references
- ✅ Added explicit "NOT financial" statements
- ✅ Updated glossary and acronyms as reference

### Developer Guidance
- All developers must understand: **Sales = Quantities, NOT Financial**
- UI labels should emphasize "units" or "quantities"
- Form fields should show "Quantity" not just "Value"
- API documentation now explicitly states quantity-only data

## Validation Checklist

- [x] Acronyms corrected in `acronyms.md`
- [x] Glossary updated with quantity definitions
- [x] Project Brief clarified
- [x] Data dictionary updated with "quantity" clarifications
- [x] Schema design updated with purpose notes
- [x] API specs clarified
- [x] RPC functions clarified
- [x] All "sales" references reviewed

## Recommendations for Phase 1.1

### UI/UX Implementation
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

### Database Comments
When creating migrations, add SQL comments:
```sql
COMMENT ON COLUMN aams_submissions.aams_value IS 
  'Average monthly quantity of units sold (NOT financial value)';

COMMENT ON COLUMN thresholds.threshold_value IS 
  'Minimum stock quantity required in units (NOT financial value)';
```

### API Documentation
Ensure all API docs include examples with unit quantities:
```json
{
  "aams_value": 10000,  // 10,000 units per month average
  "stock_level": 45000,  // 45,000 units in stock
  "threshold": 30000     // 30,000 units minimum required
}
```

## Conclusion

All documentation has been updated to clarify that the PM platform tracks **quantities/units only**, NOT financial data. This clarification is now consistent across:
- Reference documents (acronyms, glossary)
- Core documentation (Project Brief)
- Database documentation (schema, data dictionary)
- API documentation (ERP API, RPC functions)

**No code changes required** - this was purely a documentation clarification to eliminate ambiguity.

---

**Sign-off:** Emma (UI/UX + Next.js Frontend Specialist)  
**Date:** 2025-12-31

