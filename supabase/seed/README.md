# Database Seeding

Task 1.1.1.23: Database Seeding Script Structure
Task 1.1.6: Mock Data Generation & Population

This directory contains seed data scripts for populating the database with mock/test data.

## Directory Structure

```
seed/
├── README.md               # This file
├── index.ts                # Main seed runner
├── utils.ts                # Shared utilities
├── 01-users.ts             # Basic user seed data
├── 02-companies.ts         # Basic company seed data
├── 03-products.ts          # Basic product and SKU seed data
├── 04-atc-codes.ts         # ATC code reference data
├── 05-submissions.ts       # Basic VCI submission seed data
├── 06-communications.ts    # Communication seed data
└── mock-data/              # Comprehensive mock data generation
    ├── 00-config.ts        # Configuration and constants
    ├── 01-companies.ts     # 75 companies (15 IPCs + 60 Wholesalers)
    ├── 02-products.ts      # Products with pharmaceutical SKUs
    ├── 03-atc-codes.ts     # Comprehensive ATC code list
    ├── 04-critical-medicines.ts  # Critical medicine designations
    ├── 05-users.ts         # Company and MOH users
    ├── 06-vci-submissions.ts     # AAMS, MSQ, WSL (3 years)
    ├── 07-thresholds.ts    # Calculated thresholds
    ├── 08-registry-submissions.ts # Registry workflows
    ├── 09-breaches.ts      # Breach records with analyses
    ├── index.ts            # Mock data seeder
    ├── validate.ts         # Data validation script
    └── performance-test.ts # Performance testing
```

## Usage

### Environment Setup

```bash
# Required environment variables
export SUPABASE_URL=your-supabase-url
export SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Basic Seeding (Small Dataset)

For quick development setup with minimal test data:

```bash
npx ts-node supabase/seed/index.ts
```

This creates:
- 5 IPCs, 5 Wholesalers
- ~10 Products, ~50 SKUs
- Basic test users

### Full Mock Data Seeding (Task 1.1.6)

For comprehensive testing with realistic data volumes:

```bash
npx ts-node supabase/seed/index.ts --mock
```

This creates:
- **75 companies** (15 IPCs + 60 Wholesalers)
- **2-5 products per IPC** with realistic therapeutic classes
- **3-10 SKUs per product** with pharmaceutical attributes
- **3 years of historical data** (AAMS, MSQ, WSL)
- **Calculated thresholds** for all SKUs
- **Breach records** with analyses
- **Registry submission workflows**
- **Company and MOH users**

### Data Validation

Validate mock data integrity before database insertion:

```bash
npx ts-node supabase/seed/mock-data/validate.ts
```

Checks:
- Foreign key integrity
- Unique constraint validation
- Data quality (reasonable values, relationships)

### Performance Testing

Test generation performance and batch sizing:

```bash
npx ts-node supabase/seed/mock-data/performance-test.ts
```

Reports:
- Records generated per dataset
- Memory usage
- Estimated insertion time
- Recommended batch sizes

## Mock Data Specifications

### Task 1.1.6.1: Companies
- 15 IPCs (Industrial Pharmaceutical Companies)
- 60 Wholesalers
- Moroccan cities and registration numbers
- Varied statuses (active, pending, suspended)

### Task 1.1.6.2-3: Products & SKUs
- 2-5 products per active IPC
- 3-10 SKUs per product
- Realistic pharmaceutical attributes:
  - `dosage_form`: Tablet, Capsule, Syrup, Injection, etc.
  - `dosage_strength`: "500mg", "10mg/ml", "100IU/ml", etc.
  - `pack_size`: "30 tablets", "100ml", etc.
  - `unit_of_measure`: tablets, capsules, ml, vials, etc.

### Task 1.1.6.4: ATC Codes
- Full hierarchy (Level 1-5)
- Anatomical main groups through chemical substances
- Standard WHO classification

### Task 1.1.6.5: Critical Medicines
- ~15% of products designated critical
- Priority levels (critical, high, medium)
- Designation reasons and dates

### Task 1.1.6.6-8: VCI Submissions
- **AAMS**: 3 years per company (2024-2026)
  - `submission_data`: Array of `{sku_id, quantity}`
- **MSQ**: 36 months of monthly data
  - `submission_data`: Array of `{sku_id, quantity}`
  - Validation flags for anomalies
- **WSL**: 156 weeks of weekly data
  - `submission_data`: Array of `{sku_id, quantity, breach_reason?, replenishment_date?}`
  - ~8% breach probability

### Task 1.1.6.9: Thresholds
- Calculated from AAMS data
- B multiplier: 3.0 (standard), 3.5 (critical)
- Fallback logic for missing data

### Task 1.1.6.10: Users
- 3 MOH Tier 1
- 5 MOH Tier 2 Officers
- 3 MOH Tier 2 Registrars
- 1 System Admin
- Company users (admin, manager, user) per active company

### Task 1.1.6.11-12: Registry & Breaches
- Historical registry submission workflows
- Breach records with severity assessment
- Analysis and approval workflows

## Test User Credentials

| Email | Role | Password |
|-------|------|----------|
| tier1-1@moh.gov.ma | MOH Tier 1 | Test123! |
| tier2-officer-1@moh.gov.ma | MOH Tier 2 Officer | Test123! |
| tier2-registrar-1@moh.gov.ma | MOH Tier 2 Registrar | Test123! |
| [company]@[domain].ma | Company Admin/Manager/User | Test123! |

## Important Notes

- ⚠️ **NEVER run seeds on production** - Seeds will create/modify data
- Seeds are idempotent where possible (use upsert patterns)
- Mock data generation is deterministic (same output each run)
- All timestamps use realistic distributions
- Moroccan context (cities, names, phone formats)
