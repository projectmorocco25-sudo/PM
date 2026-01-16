# Phase 1.1: Test User Credentials

**Last Updated:** January 12, 2026  
**Owner:** Farah (Analytics/CMC Specialist)  
**Purpose:** Complete list of test user accounts for Phase 1.1 UI testing

---

## 🔑 Standard Test Password

**All test users use the same password:**
```
TempPassword123!@#
```

---

## 1. MOH Tier 1 Users (tier1)

**Role:** Ministry of Health Tier 1 - Highest authority, approves critical actions

| Email | Full Name | Password | Company | Notes |
|-------|-----------|----------|---------|-------|
| `samir.hassan@moh.gov.ma` | Dr. Samir Hassan | `TempPassword123!@#` | N/A (MOH) | Foundation seed - Approves everything |

---

## 2. MOH Tier 2 Officers (tier2_officer)

**Role:** Ministry of Health Tier 2 - Verifies submissions, reviews data

| Email | Full Name | Password | Company | Notes |
|-------|-----------|----------|---------|-------|
| `fatima.alami@moh.gov.ma` | Fatima Alami | `TempPassword123!@#` | N/A (MOH) | Foundation seed - Verifies submissions |

---

## 3. MOH Tier 2 Registrars (tier2_registrar)

**Role:** Ministry of Health Tier 2 - Implements approved changes, maintains registry

| Email | Full Name | Password | Company | Notes |
|-------|-----------|----------|---------|-------|
| `ahmed.benali@moh.gov.ma` | Ahmed Benali | `TempPassword123!@#` | N/A (MOH) | Foundation seed - Implements approved changes |

---

## 4. Company Admins (company_admin)

**Role:** Company Administrator - Full access to company data and submissions

| Email | Full Name | Password | Company | Company Type |
|-------|-----------|----------|---------|--------------|
| `youssef.bennis@activepharma.ma` | Youssef Bennis | `TempPassword123!@#` | Active Pharma Co | IPC |
| `hassan.empty@emptyholdings.ma` | Hassan Empty | `TempPassword123!@#` | Empty Holdings Ltd | Wholesaler |
| `karim.idrissi@medisupply.ma` | Karim Idrissi | `TempPassword123!@#` | MediSupply Maroc | Wholesaler |

**Company Details:**
- **Active Pharma Co** (`activepharma.ma`): IPC - Active company with meaningful data (pack_company_active)
- **Empty Holdings Ltd** (`emptyholdings.ma`): Wholesaler - Intentionally empty for testing empty states (pack_company_empty)
- **MediSupply Maroc** (`medisupply.ma`): Wholesaler - Additional company for list testing

---

## 5. Company Managers (company_manager)

**Role:** Company Manager - Manages submissions and company data

| Email | Full Name | Password | Company | Company Type |
|-------|-----------|----------|---------|--------------|
| `sara.khalil@activepharma.ma` | Sara Khalil | `TempPassword123!@#` | Active Pharma Co | IPC |

---

## 📊 Summary Statistics

- **Total Users:** 7
- **MOH Users:** 3 (1 Tier 1, 1 Tier 2 Officer, 1 Tier 2 Registrar)
- **Company Users:** 4 (3 Admins, 1 Manager)
- **Companies:** 3 (1 IPC, 2 Wholesalers)

---

## 🎯 Recommended Test Accounts

### For Testing MOH Workflows:
- **Tier 1 Approval:** `samir.hassan@moh.gov.ma`
- **Tier 2 Verification:** `fatima.alami@moh.gov.ma`
- **Tier 2 Implementation:** `ahmed.benali@moh.gov.ma`

### For Testing Company Workflows:
- **Active Company (with data):** `youssef.bennis@activepharma.ma`
- **Empty Company (empty states):** `hassan.empty@emptyholdings.ma`
- **List/Pagination Testing:** `karim.idrissi@medisupply.ma`

---

## 🔧 How to Create Additional Auth Users

If you need to create auth users for additional users in `public.users`:

```bash
cd supabase/scripts
npm run create-auth-users
```

**Prerequisites:**
- Environment variables `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` must be set
- Users must exist in `public.users` table

**Script Location:** `supabase/scripts/create-auth-users.ts`

---

## 📝 Notes

1. **Password Security:** All test users use the same password for development convenience. **NEVER use these credentials in production.**

2. **Auth Users vs Public Users:** 
   - `auth.users` - Authentication credentials (for login)
   - `public.users` - Application user data (profiles, roles, company associations)
   - Both must exist for a user to log in

3. **Foundation Seed:** These users are created by the `seed_1_1_1_foundation` migration and are part of the scenario packs:
   - `pack_foundation_moh_ops` - MOH users
   - `pack_company_active` - Active Pharma Co users
   - `pack_company_empty` - Empty Holdings Ltd users

4. **Additional Users:** If you run the comprehensive TypeScript seed scripts (from `supabase/seed/mock-data/`), additional users may be created. Run the `create-auth-users.ts` script again to create auth accounts for those users as well.

---

## 🔗 Related Documentation

- [Phase 1.1 Mock Data Playbook](phase-1-1-mockdata.md)
- [Phase 1 Implementation Plan](Phase-1-Implementation-Plan.md)
- Seed Migration: `supabase/migrations/99990000000000_seed_1_1_1_foundation.sql`
