# SKU Migration Split Summary

## Overview
The SKU migration files have been split into smaller, more manageable files to prevent timeout and memory issues during migration. Each company's SKUs (24 SKUs = 12 products × 2 SKUs per product) are now split into 2 files of 12 SKUs each.

## Completed Files

### Company 002 (Rabat Pharma Industries)
- ✅ `20260124031001_seed_rmm_skus_company_002_part1.sql` - Products 301-306 (12 SKUs)
- ✅ `20260124031002_seed_rmm_skus_company_002_part2.sql` - Products 307-312 (12 SKUs)

### Company 003 (Marrakech Pharma Industries)
- ✅ `20260124031003_seed_rmm_skus_company_003_part1.sql` - Products 401-406 (12 SKUs)
- ✅ `20260124031004_seed_rmm_skus_company_003_part2.sql` - Products 407-412 (12 SKUs)

### Company 004 (Tangier Pharma Industries)
- ✅ `20260124031005_seed_rmm_skus_company_004_part1.sql` - Products 501-506 (12 SKUs)
- ✅ `20260124031006_seed_rmm_skus_company_004_part2.sql` - Products 507-512 (12 SKUs)

### Company 005 (Agadir Pharma Industries)
- ✅ `20260124031007_seed_rmm_skus_company_005_part1.sql` - Products 601-606 (12 SKUs)
- ✅ `20260124031008_seed_rmm_skus_company_005_part2.sql` - Products 607-612 (12 SKUs)

### Company 006 (Fes Pharma Industries)
- ✅ `20260124031009_seed_rmm_skus_company_006_part1.sql` - Products 701-706 (12 SKUs)
- ✅ `20260124031010_seed_rmm_skus_company_006_part2.sql` - Products 707-712 (12 SKUs)

## Remaining Files Needed

The following companies still need their SKU migrations split into smaller files:

### Company 007 (Meknes Pharma Industries)
- Products: 801-812 (24 SKUs)
- Need: 2 files (12 SKUs each)
- Suggested filenames:
  - `20260124031011_seed_rmm_skus_company_007_part1.sql` - Products 801-806
  - `20260124031012_seed_rmm_skus_company_007_part2.sql` - Products 807-812

### Company 008 (Oujda Pharma Industries)
- Products: 901-912 (24 SKUs)
- Need: 2 files (12 SKUs each)
- Suggested filenames:
  - `20260124031013_seed_rmm_skus_company_008_part1.sql` - Products 901-906
  - `20260124031014_seed_rmm_skus_company_008_part2.sql` - Products 907-912

### Company 009 (Kenitra Pharma Industries)
- Products: 1001-1012 (24 SKUs)
- Need: 2 files (12 SKUs each)
- Suggested filenames:
  - `20260124031015_seed_rmm_skus_company_009_part1.sql` - Products 1001-1006
  - `20260124031016_seed_rmm_skus_company_009_part2.sql` - Products 1007-1012

### Company 010 (Tetouan Pharma Industries)
- Products: 1101-1112 (24 SKUs)
- Need: 2 files (12 SKUs each)
- Suggested filenames:
  - `20260124031017_seed_rmm_skus_company_010_part1.sql` - Products 1101-1106
  - `20260124031018_seed_rmm_skus_company_010_part2.sql` - Products 1107-1112

### Company 011 (Safi Pharma Industries)
- Products: 1201-1212 (24 SKUs)
- Need: 2 files (12 SKUs each)
- Suggested filenames:
  - `20260124031019_seed_rmm_skus_company_011_part1.sql` - Products 1201-1206
  - `20260124031020_seed_rmm_skus_company_011_part2.sql` - Products 1207-1212

## File Structure Template

Each file should follow this structure:

```sql
-- Migration: seed_rmm_skus_company_XXX_partY
-- Description: Seed SKUs for [Company Name] ([Company ID]) - Part Y (Products XXX-YYY, 12 SKUs)
-- Date: 2026-01-24
-- Task: 1.1.3.6 (Seed Data Fixes)
-- Owner: Hassan (QA/Assurance Engineer)
-- Compliance: Deterministic IDs + idempotent UPSERTs

BEGIN;

INSERT INTO skus (
    id, product_id, sku_code, name, dosage_strength, dosage_form, pack_size, unit_of_measure, atc_code_id,
    is_moh_authorized_unregistered, is_active, created_at, updated_at
)
VALUES
    -- [12 SKU entries here]
ON CONFLICT (id) DO UPDATE SET
    product_id = EXCLUDED.product_id,
    sku_code = EXCLUDED.sku_code,
    name = EXCLUDED.name,
    dosage_strength = EXCLUDED.dosage_strength,
    dosage_form = EXCLUDED.dosage_form,
    pack_size = EXCLUDED.pack_size,
    unit_of_measure = EXCLUDED.unit_of_measure,
    atc_code_id = EXCLUDED.atc_code_id,
    is_moh_authorized_unregistered = EXCLUDED.is_moh_authorized_unregistered,
    is_active = EXCLUDED.is_active,
    updated_at = now();

COMMIT;
```

## Migration Order

The migrations should be run sequentially in timestamp order:
1. Company 002 (files 31001-31002)
2. Company 003 (files 31003-31004)
3. Company 004 (files 31005-31006)
4. Company 005 (files 31007-31008)
5. Company 006 (files 31009-31010)
6. Company 007 (files 31011-31012) - **TODO**
7. Company 008 (files 31013-31014) - **TODO**
8. Company 009 (files 31015-31016) - **TODO**
9. Company 010 (files 31017-31018) - **TODO**
10. Company 011 (files 31019-31020) - **TODO**

## Notes

- Each file contains exactly 12 SKUs (6 products × 2 SKUs per product)
- All files use idempotent UPSERTs with `ON CONFLICT (id) DO UPDATE`
- Deterministic UUIDs are used for all SKU IDs
- The old large migration files have been deleted:
  - `20260124031000_seed_additional_rmm_skus.sql`
  - `20260124031100_seed_additional_rmm_skus_part2.sql`
  - `20260124031200_seed_additional_rmm_skus_part3.sql`
  - `20260124031300_seed_additional_rmm_skus_part4.sql`

## Next Steps

1. Extract SKU data for companies 007-011 from the original seed data migration (`20260124020000_seed_1_1_2_rmm.sql`)
2. Create the remaining 10 migration files following the established pattern
3. Test migrations sequentially to ensure no errors
4. Update this document once all files are created
