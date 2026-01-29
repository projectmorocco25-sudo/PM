# Seed Data Playbook

**Owner:** Hassan (Seed Data & Testing Owner)  
**Status:** ✅ **COMPLETE - Ready for Team Review**  
**Last Updated:** 2026-01-XX

---

## ✅ Playbook Complete - Ready for Team Review

**This playbook file is now complete with detailed seed data strategy and specifications.**

**Team Review Required:**
- [ ] **Nadia:** Review for database integrity requirements (UPSERT patterns, foreign keys, constraints)
- [ ] **Farah:** Review for realism validation requirements (company names, product names, quantities, dates)
- [ ] **Rafi:** Review RLS validation procedures and test scripts
- [ ] **Sami:** Verify playbook meets compliance requirements (idempotency, wireframe coverage, RLS validation)

**Timeline:** Team review should be completed before seed data work begins

---

## Overview

This playbook defines the strategy for creating seeded Supabase data (not local mocks) for Phase 1 development and testing.

**Key Principles:**
- ✅ All seed data goes into Supabase database (dev/staging)
- ✅ Seed data uses deterministic IDs for idempotency
- ✅ Seed data must be realistic and cover wireframe scenarios
- ✅ Seed data must be validated under real RLS policies
- ❌ NO local mock data in application runtime
- ❌ NO inline arrays/objects as source of truth

---

## Seed Strategy: Scenario Packs (Deterministic)

**Purpose:** Create reusable, deterministic seed data scenarios that can be safely re-run.

**Key Requirements:**
- Use deterministic UUIDs (e.g., `'00000000-0000-0000-0000-000000000001'`)
- Use UPSERT patterns (INSERT ... ON CONFLICT DO UPDATE)
- Scenario packs are composable (can combine multiple packs)
- Each pack has a clear purpose (e.g., `pack_company_active`, `pack_company_empty`)

**Example Scenario Packs:**
- `pack_company_active` - Company with full data (products, SKUs, submissions)
- `pack_company_empty` - Company with no data (empty state testing)
- `pack_threshold_reversion_auto` - Temporary thresholds with upcoming revert dates
- `pack_threshold_manual_review_pending` - Temporary thresholds pending review

---

## Idempotency Patterns

**Requirement:** All seed migrations must be idempotent (safe to re-run).

### Basic UPSERT Pattern

```sql
-- Example: UPSERT pattern for companies
INSERT INTO companies (id, name, registration_number, company_type, is_active, created_at, updated_at)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'PharmaCorp Inc', 'REG-001', 'ipc', true, NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000002', 'MedSupply Co', 'REG-002', 'wholesaler', true, NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  registration_number = EXCLUDED.registration_number,
  company_type = EXCLUDED.company_type,
  updated_at = NOW();
```

### UPSERT with Foreign Key Relationships

```sql
-- Example: Products with company relationship (must use same deterministic company ID)
INSERT INTO products (id, company_id, name, description, is_critical_medicine, is_active, created_at, updated_at)
VALUES 
  ('00000000-0000-0000-0000-000000000101', '00000000-0000-0000-0000-000000000001', 'Paracetamol 500mg', 'Pain relief medication', false, true, NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000102', '00000000-0000-0000-0000-000000000001', 'Insulin Glargine', 'Diabetes medication', true, true, NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
  company_id = EXCLUDED.company_id,
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  is_critical_medicine = EXCLUDED.is_critical_medicine,
  updated_at = NOW();
```

### UPSERT with JSONB Fields

```sql
-- Example: Users with notification_preferences JSONB
INSERT INTO users (id, email, full_name, company_id, role, notification_preferences, is_active, created_at, updated_at)
VALUES 
  ('00000000-0000-0000-0000-000000000201', 'admin@pharmacorp.com', 'Admin User', '00000000-0000-0000-0000-000000000001', 'company_admin', 
   '{"email_enabled": true, "submission_updates": true, "compliance_alerts": true, "enforcement_actions": true, "system_announcements": true}'::jsonb,
   true, NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  full_name = EXCLUDED.full_name,
  notification_preferences = EXCLUDED.notification_preferences,
  updated_at = NOW();
```

### Deterministic UUID Generation Strategy

**Format:** `'00000000-0000-0000-0000-{sequential-hex}'`

**Allocation:**
- `00000000-0000-0000-0000-000000000001` to `00000000-0000-0000-0000-0000000000FF`: Foundation (users, companies, system_config)
- `00000000-0000-0000-0000-000000000100` to `00000000-0000-0000-0000-0000000001FF`: RMM (products, SKUs, registry_submissions)
- `00000000-0000-0000-0000-000000000200` to `00000000-0000-0000-0000-0000000002FF`: VCI (aams_submissions, thresholds, msq_submissions, wsl_submissions, breaches)
- `00000000-0000-0000-0000-000000000300` to `00000000-0000-0000-0000-0000000003FF`: ECS (export_requests, export_authorizations, replenishment_schedules)
- `00000000-0000-0000-0000-000000000400` to `00000000-0000-0000-0000-0000000004FF`: CMC (compliance_scores, disputes, regulatory_reports)

**Key Points:**
- Use deterministic UUIDs (not random) - allows safe re-runs
- Always include `ON CONFLICT` handling
- Update `updated_at` on conflict
- Preserve relationships (foreign keys must use same deterministic IDs)
- Document UUID allocation ranges to avoid conflicts

---

## RLS Realism Validation

**Requirement:** Seed data must be validated under real RLS policies.

**Validation Process:**
1. Apply seed migration
2. Test data visibility for each role:
   - Company Admin (`company_admin`)
   - Company Manager (`company_manager`)
   - Company User (`company_user`)
   - MOH Tier 1 (`tier1`)
   - MOH Tier 2 Officer (`tier2_officer`)
   - MOH Tier 2 Registrar (`tier2_registrar`)
   - MOH Auditor (`auditor`)
   - System Admin (`system_admin`)
   - Vendor (`vendor`)
3. Verify data visibility matches wireframe requirements
4. Document any RLS policy issues

**Test Script Template:**
```sql
-- Example: Test RLS for companies table
-- Switch to Company Admin role
SET ROLE company_admin;
SELECT id, name FROM companies; -- Should see only company's own data

-- Switch to MOH Tier 1 role
SET ROLE tier1;
SELECT id, name FROM companies; -- Should see all companies

-- Switch to Company User role
SET ROLE company_user;
SELECT id, name FROM companies; -- Should see only company's own data
```

**Owner:** Hassan (coordinates with Rafi for RLS policy verification)

**Validation Checklist:**
- [ ] Company users can only see their own company's data
- [ ] MOH Tier 1 can see all companies
- [ ] MOH Tier 2 can see all companies
- [ ] System Admin can see all data
- [ ] Vendor role has appropriate access (verify with Rafi)
- [ ] Auditor role has read-only access to all data
- [ ] Data visibility matches wireframe role-based requirements

---

## Seed Stage Naming Convention

**Format:** `seed_{phase}.{subphase}.{module}_{feature}`

**Examples:**
- `seed_1_1_1_foundation` - Phase 1.1, Subphase 1.1.1 (Foundation)
- `seed_1_1_2_rmm` - Phase 1.1, Subphase 1.1.2 (RMM)
- `seed_1_2_1_vci_aams` - Phase 1.2, Subphase 1.2.1 (VCI AAMS)
- `seed_1_2_2_vci_msq` - Phase 1.2, Subphase 1.2.2 (VCI MSQ)
- `seed_1_2_3_vci_wsl` - Phase 1.2, Subphase 1.2.3 (VCI WSL)
- `seed_1_3_3_ecs` - Phase 1.3, Subphase 1.3.3 (ECS)
- `seed_1_4_2_cmc` - Phase 1.4, Subphase 1.4.2 (CMC)

**Why Some Subphases Don't Have Gates:**
- Subphases 1.3.1, 1.3.2: Backend-only, no frontend pages requiring seed data
- Subphase 1.4.1: Scoring engine backend, seed data comes from previous phases
- Subphase 1.4.3: Reports use existing data
- Subphase 1.4.4: Testing phase, uses existing seeded data

---

## Verification Checklist (Must Be Executed After Each Seed Migration)

**Owner:** Hassan (full ownership; coordinates with Nadia for integrity, Farah for realism)

After applying each seed migration stage, complete this checklist:

- [ ] **Migration Applied:** Seed migration verified via `supabase migration list`
- [ ] **Data Integrity (Nadia):** Database constraints satisfied, foreign keys valid, no orphaned records
- [ ] **Data Realism (Farah):** Seed data values are realistic (company names, product names, quantities, dates)
- [ ] **RLS Validation (Rafi):** Data visibility tested under real RLS policies for all roles
- [ ] **Wireframe Coverage:** Seed data covers all wireframe scenarios (empty states, populated states, edge cases)
- [ ] **Idempotency Test:** Migration re-run successfully without errors
- [ ] **Scenario Packs:** All required scenario packs present and functional

---

## Stage: seed_1_1_1_foundation (Subphase 1.1.1)

**Purpose:** Foundation seed data for core foundation UI work.

**Tables Touched:**
- `users` (with deterministic IDs)
- `companies` (basic company records - minimum 75 companies for pagination testing)
- `system_config` (module configuration)

**Scenario Packs:**
- `pack_company_active` - Active company with users (Company ID: `00000000-0000-0000-0000-000000000001`)
  - 1 Company Admin user
  - 2 Company User accounts
  - Company has active status
- `pack_company_empty` - Empty company for empty state testing (Company ID: `00000000-0000-0000-0000-000000000002`)
  - 1 Company Admin user
  - No products, no SKUs, no submissions
  - Company has active status

**Minimum Data Requirements:**
- 75 companies (for pagination/sorting/filtering testing)
- At least 2 users per company (1 admin, 1+ regular users)
- 5 MOH users (1 Tier 1, 2 Tier 2 Officer, 1 Tier 2 Registrar, 1 Auditor)
- 1 System Admin user
- System config entries for all modules (rmm, vci, ecs, cmc)

**Acceptance Criteria:**
- [ ] Users can log in with seeded accounts (test all 9 roles)
- [ ] Companies list has enough rows for pagination testing (75+ companies)
- [ ] Empty state scenarios covered (empty company exists)
- [ ] RLS validation: Company users see only their company
- [ ] RLS validation: MOH users see all companies
- [ ] System config entries exist for module activation testing

---

## Stage: seed_1_1_2_rmm (Subphase 1.1.2)

**Owner for applying and verifying this stage:** Hassan. Subphase 1.1.2 must not start until this stage is applied and verified (see phase-1-1-rmm.md prerequisites).

**Purpose:** RMM module seed data (companies, products, SKUs, registry submissions).

**Tables Touched:**
- `companies` (extend existing from foundation stage)
- `products` (minimum 10 products per active company)
- `skus` (with Phase 0.6 pharma attributes: dosage_strength, dosage_form, pack_size, unit_of_measure)
- `atc_codes` (minimum 50 ATC codes for realistic product coverage)
- `critical_medicines` (minimum 10 critical medicines)
- `registry_submissions` (across all workflow statuses)
- `approval_history` (workflow history for submissions)

**Scenario Packs:**
- Extend `pack_company_active` with:
  - 10+ products (mix of critical and non-critical medicines)
  - 20+ SKUs (with complete pharma attributes)
  - Registry submissions across all statuses:
    - `draft` - 2 submissions
    - `pending_verification` - 2 submissions
    - `pending_approval` - 2 submissions
    - `approved` - 2 submissions
    - `pending_implementation` - 2 submissions
    - `implemented` - 2 submissions
    - `completed` - 2 submissions
    - `rejected` - 1 submission
- `pack_company_empty` remains empty (for empty state testing)

**Pharma Attributes Requirements (Phase 0.6):**
- `dosage_strength`: e.g., "500mg", "10ml", "25 units"
- `dosage_form`: e.g., "tablet", "injection", "capsule", "syrup"
- `pack_size`: e.g., 30, 60, 100
- `unit_of_measure`: e.g., "tablets", "vials", "bottles"

**Acceptance Criteria:**
- [ ] Companies list has enough rows for pagination/sorting/filtering (75+ companies)
- [ ] Company detail tabs have meaningful content for "active" company:
  - Overview tab: Company info, stats
  - Products tab: 10+ products listed
  - Submissions tab: Submissions across all statuses
  - History tab: Approval history visible
- [ ] Empty state for "empty" company (no products, no submissions)
- [ ] SKU list/detail show pharma attributes (not blanks):
  - All SKUs have dosage_strength, dosage_form, pack_size, unit_of_measure
- [ ] Registry submissions exist across all required statuses (see scenario packs above)
- [ ] ATC codes exist for realistic product coverage (50+ codes)
- [ ] Critical medicines list populated (10+ medicines)
- [ ] RLS validation: Each role sees appropriate data:
  - Company users see only their company's products/SKUs/submissions
  - MOH users see all companies' data

---

## Stage: seed_1_2_1_vci_aams (Subphase 1.2.1)

**Purpose:** VCI AAMS workflow seed data (AAMS submissions, thresholds).

**Tables Touched:**
- `aams_submissions` (multi-year data: current year, previous year, year before)
- `thresholds` (global/local, permanent + temporary duration types)
- Threshold history/reversion tables (if separate tables exist)

**Scenario Packs:**
- `pack_threshold_reversion_auto` - Temporary auto-revert thresholds with upcoming revert dates
  - 5 thresholds with `duration_type = 'temporary_auto_revert'`
  - `revert_date` set to 7-30 days in future
  - `revert_to_multiplier` and `revert_to_threshold_value` set
  - `requires_manual_review = false`
- `pack_threshold_manual_review_pending` - Temporary manual review thresholds pending review
  - 3 thresholds with `duration_type = 'temporary_manual_review'`
  - `revert_date` set to 1-7 days in future (pending review)
  - `requires_manual_review = true`
- `pack_threshold_permanent` - Permanent threshold examples (global and local)
  - 10 permanent thresholds (`duration_type = 'permanent'`)
  - Mix of global (`sku_id = NULL`) and local (`sku_id` set) thresholds

**AAMS Submission Requirements:**
- Current year submissions: All companies, all SKUs (or representative sample)
- Previous year submissions: Historical data for fallback logic testing
- Year before: Additional historical data
- Late submission: At least 1 submission after January 31 deadline
- Grace period: At least 1 submission within 15-day grace period (Jan 31 - Feb 15)

**Acceptance Criteria:**
- [ ] AAMS lists have multi-year records (current year, previous year, year before)
- [ ] At least one late/grace-period scenario:
  - 1 submission after January 31 (late)
  - 1 submission between Jan 31 - Feb 15 (grace period)
- [ ] Thresholds include all duration types:
  - Permanent thresholds (global and local)
  - Temporary auto-revert thresholds (with upcoming revert dates)
  - Temporary manual review thresholds (pending review workflow)
- [ ] MOH and company role views match wireframes for visibility timing:
  - Company users see their submissions immediately after submission
  - MOH users see submissions after verification/approval (per wireframe)
- [ ] RLS validation: Each role sees appropriate data:
  - Company users see only their company's AAMS submissions
  - MOH users see all AAMS submissions
- [ ] Threshold calculation validated:
  - Standard multiplier (B = 3.0) for non-critical medicines
  - Critical medicine multiplier (B = 3.5) for critical medicines

---

## Stage: seed_1_2_2_vci_msq (Subphase 1.2.2)

**Purpose:** VCI MSQ workflow seed data.

**Tables Touched:**
- `msq_submissions` (multi-month data for current year)

**Scenario Packs:**
- Monthly submissions for current year (January through current month)
- At least 1 submission flagged for review (20% threshold comparison violation)
- At least 1 submission within 7-day grace period for corrections

**MSQ Validation Requirements:**
- MSQ vs AAMS comparison: 20% threshold validation
- Submissions that exceed 20% difference from AAMS should be flagged
- Grace period: 7 days from submission date for corrections

**Acceptance Criteria:**
- [ ] MSQ submissions cover wireframe scenarios:
  - Monthly submissions for all active companies
  - At least 1 submission flagged for review (20% threshold violation)
  - At least 1 submission within grace period (correction interface testing)
- [ ] MSQ vs AAMS validation working:
  - Submissions within 20% of AAMS: Accepted
  - Submissions exceeding 20%: Flagged for review
- [ ] RLS validation: Each role sees appropriate data:
  - Company users see only their company's MSQ submissions
  - MOH users see all MSQ submissions

---

## Stage: seed_1_2_3_vci_wsl (Subphase 1.2.3)

**Purpose:** VCI WSL workflow and breach detection seed data.

**Tables Touched:**
- `wsl_submissions` (weekly data for current month and previous months)
- `breaches` (automatically created when stock level < threshold)
- `breach_analyses` (analysis records for breaches)

**Scenario Packs:**
- Weekly submissions for current month (4-5 weeks)
- At least 5 breaches (stock level below threshold):
  - 2 high-priority breaches (critical medicines, significant shortfall)
  - 2 medium-priority breaches (standard medicines, moderate shortfall)
  - 1 low-priority breach (minor shortfall)
- At least 1 breach with analysis completed
- At least 1 breach pending analysis

**WSL Deadline Requirements:**
- Friday EOD deadline for weekly submissions
- At least 1 late submission (after Friday deadline)
- At least 1 on-time submission

**Breach Detection Requirements:**
- Breaches automatically created when `stock_level < threshold_value`
- Breach priority calculated based on:
  - Critical medicine status
  - Shortfall magnitude
  - Duration of breach

**Acceptance Criteria:**
- [ ] WSL submissions cover wireframe scenarios:
  - Weekly submissions for all active companies
  - At least 1 late submission (after Friday deadline)
  - At least 1 on-time submission
- [ ] Breaches exist for breach detection testing:
  - 5+ breaches with varying priorities
  - Mix of analyzed and pending breaches
  - Breaches linked to WSL submissions
- [ ] Breach priority logic validated:
  - Critical medicines with shortfalls = high priority
  - Standard medicines with minor shortfalls = low priority
- [ ] RLS validation: Each role sees appropriate data:
  - Company users see only their company's WSL submissions and breaches
  - MOH users see all WSL submissions and breaches

---

## Stage: seed_1_3_3_ecs (Subphase 1.3.3)

**Purpose:** ECS module seed data (export requests, authorizations, replenishment schedules).

**Tables Touched:**
- `export_requests` (across all workflow statuses)
- `export_authorizations` (authorized exports with threshold switching)
- `replenishment_schedules` (tracking schedules for authorized exports)

**Scenario Packs:**
- Export requests across all statuses:
  - `draft` - 2 requests
  - `submitted` - 2 requests
  - `pending_verification` - 2 requests
  - `pending_approval` - 2 requests
  - `approved` - 2 requests
  - `rejected` - 1 request
- Export authorizations:
  - 5 active authorizations (with threshold switching from VCI to ECS)
  - 2 expired authorizations (for expiration testing)
  - 1 authorization expiring soon (within 30 days)
- Replenishment schedules:
  - 3 on-time schedules
  - 2 delayed schedules (for escalation testing)
  - 1 schedule with proof submitted

**Threshold Switching Requirements:**
- When export is authorized, VCI threshold switches to ECS threshold
- ECS threshold = C × XAMS (where C is multiplier, XAMS is calculated from AAMS/MSQ)
- After 3 months, threshold reverts to VCI threshold

**Acceptance Criteria:**
- [ ] Export requests cover wireframe scenarios:
  - Requests across all workflow statuses
  - Mix of auto-approved and manual review requests
- [ ] Export authorizations exist for authorization workflow testing:
  - Active authorizations with threshold switching
  - Expired authorizations for expiration testing
  - Authorizations expiring soon for notification testing
- [ ] Replenishment schedules exist for tracking testing:
  - On-time schedules
  - Delayed schedules (for escalation workflow)
  - Schedules with proof submitted (for verification testing)
- [ ] Threshold switching validated:
  - VCI threshold → ECS threshold on authorization
  - ECS threshold calculation (C × XAMS) verified
  - Reversion after 3 months tested
- [ ] RLS validation: Each role sees appropriate data:
  - Company users see only their company's export requests/authorizations
  - MOH users see all export requests/authorizations

---

## Stage: seed_1_4_2_cmc (Subphase 1.4.2)

**Purpose:** CMC module seed data (compliance scores, disputes, reports).

**Tables Touched:**
- `compliance_scores` (monthly scores for all companies)
- `compliance_score_components` (component breakdowns)
- `disputes` (dispute workflow records)
- `regulatory_reports` (generated reports)

**Scenario Packs:**
- Compliance scores:
  - Monthly scores for last 3 months (all companies)
  - Score range: 60-100 (mix of high, medium, low scores)
  - At least 1 frozen score (for freeze testing)
  - At least 1 score flagged for review
  - At least 1 score with override (Tier 1 override)
- Compliance score components:
  - Regulatory Reporting Compliance Rate
  - Stock Threshold Violation Frequency
  - Replenishment Plan Adherence (if ECS active)
  - Aggregate Non-Compliance Exposure
  - Data Quality Signals
  - Critical Medicine Coverage
  - Export Compliance (if ECS active)
- Disputes:
  - 3 open disputes (pending review)
  - 2 resolved disputes (approved and rejected)
  - Disputes with evidence attached
- Regulatory reports:
  - 2 monthly reports (last 2 months)
  - 1 quarterly report
  - Reports across approval workflow statuses

**Score Calculation Requirements:**
- Component weights configurable
- Total score = weighted average of components
- Scores recalculated monthly or event-triggered

**Acceptance Criteria:**
- [ ] Compliance scores exist for scoring engine testing:
  - Monthly scores for all companies (last 3 months)
  - Score range covers high, medium, low scenarios
  - Frozen scores, flagged scores, overridden scores present
- [ ] Compliance score components populated:
  - All 7 components calculated (or applicable subset if modules inactive)
  - Component weights applied correctly
- [ ] Disputes exist for dispute workflow testing:
  - Open disputes for review workflow
  - Resolved disputes for resolution workflow
  - Evidence attached to disputes
- [ ] Regulatory reports exist for report testing:
  - Monthly and quarterly reports
  - Reports across approval workflow
- [ ] RLS validation: Each role sees appropriate data:
  - Company users see only their company's scores and disputes
  - MOH users see all scores, disputes, and reports

---

## Next Steps

1. **Hassan:** Complete this playbook with detailed seed data specifications
2. **Team Review:** Nadia (integrity), Farah (realism), Rafi (RLS), Sami (compliance)
3. **Implementation:** Create seed migration files per stage
4. **Validation:** Execute verification checklist after each migration

---

**Reference:** [Phase 1 Implementation Plan](../phase-1.md) for complete task list and dependencies.
