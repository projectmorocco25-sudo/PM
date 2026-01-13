# Database Seeding

Task 1.1.1.23: Database Seeding Script Structure

This directory contains seed data scripts for populating the database with mock/test data.

## Directory Structure

```
seed/
├── README.md           # This file
├── index.ts            # Main seed runner
├── 01-users.ts         # User seed data
├── 02-companies.ts     # Company seed data
├── 03-products.ts      # Product and SKU seed data
├── 04-atc-codes.ts     # ATC code reference data
├── 05-submissions.ts   # VCI submission seed data
├── 06-communications.ts # Communication seed data
└── utils.ts            # Shared utilities
```

## Execution Order

Seeds are executed in numeric order to respect foreign key constraints:

1. **Users** - Creates test users with various roles
2. **Companies** - Creates IPCs and wholesalers
3. **Products** - Creates products and SKUs linked to companies
4. **ATC Codes** - Populates ATC code reference data
5. **Submissions** - Creates sample VCI submissions
6. **Communications** - Creates sample conversations and messages

## Usage

### Using Supabase CLI

```bash
# Run all seeds
supabase db seed

# Or run individual seed files
npx ts-node supabase/seed/index.ts
```

### Environment Variables

Set the following environment variables before running:

```bash
SUPABASE_URL=your-supabase-url
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## Important Notes

- **NEVER run seeds on production** - Seeds will create/modify data
- Seeds are idempotent where possible (use upsert patterns)
- All seed users use predictable passwords for testing
- Seed data includes realistic Moroccan pharmaceutical context

## Test User Credentials

| Email | Role | Password |
|-------|------|----------|
| tier1@moh.gov.ma | MOH Tier 1 | Test123! |
| tier2@moh.gov.ma | MOH Tier 2 Officer | Test123! |
| admin@pharma-ipc.ma | Company Admin (IPC) | Test123! |
| manager@pharma-wholesale.ma | Company Manager (Wholesaler) | Test123! |
