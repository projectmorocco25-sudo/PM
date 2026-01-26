# Phase 4: RMM Missing Filters — Pre-Implementation Confirmation

**Date:** 2026-01-25  
**Role:** Sami (Implementation Compliance Specialist)  
**Status:** ✅ Confirmed — Proceeding with implementation

---

## 1. Rules Adherence

### .cursor/rules

- **wireframe_db_compliance.md:** Wireframe-first, DB-first; no mocks; all data from Supabase; wireframe binding; role + UI states.
- **wireframe-compliance-checklist.md:** Read entire wireframe, extract specs, verify requirements, add binding, implement exactly.

### No local mocks

- All data from Supabase RPCs/tables only.

---

## 2. Wireframes Read (Complete)

| Task | Wireframe | Sections Reviewed |
|------|-----------|-------------------|
| 4.1 | `task-0.5.2.2` (Companies), `task-0.5.2.4` (Products), `task-0.5.2.6` (SKUs), `task-0.5.2.11` (Submissions) | Date range: Last 7d, Last 30d, Custom; filters sidebar 240px; mobile drawer; Clear |
| 4.2 | `task-0.5.2.6-skus-list.md` | Dosage Form: All, Tablet, Capsule, Syrup, Injection, Cream, Ointment, etc.; checkboxes |
| 4.3 | `task-0.5.2.4`, `task-0.5.2.6` | ATC Code filter: multi-select or checkboxes; load from DB; apply/clear |
| 4.4 | `task-0.5.2.14-atc-codes-list.md` | Level (1–4), Category (A,B,C,…); checkboxes; Clear |
| 4.5 | `task-0.5.2.4-products-list.md` | SKU Count column; mobile card layout; skeleton |
| 4.6 | `task-0.5.2.6-skus-list.md` | ATC Code column; "-" if not assigned; mobile in cards |

---

## 3. Scope Confirmation (Phase 4 Tasks, in Order)

1. **4.1** — Date range filters on companies, products, skus, submissions: Quick filters (Last 7d, Last 30d, Custom), date picker, apply to RPCs, clear, mobile in drawer.
2. **4.2** — Dosage form filter on SKUs list: Checkboxes (All, Tablet, Capsule, Syrup, …), apply to `rmm_list_skus`, clear.
3. **4.3** — ATC code filters on products, skus, critical-medicines: Multi-select or checkboxes, load ATCs from DB, apply, clear.
4. **4.4** — Level/Category filters on ATC codes list: Level 1–4, Category A/B/C/…; apply to `rmm_list_atc_codes`, clear.
5. **4.5** — SKU count column on products list: Add column; `rmm_list_products` returns `sku_count`; mobile in cards.
6. **4.6** — ATC code column on SKUs list: Add column; `rmm_list_skus` returns `atc_code`; "-" if unassigned; mobile in cards.

---

## 4. Database / RPC Assumptions

- **Date range:** Filter by `created_at::date`. Params `p_date_from`, `p_date_to` (date, optional). Last 7d = today - 7..today; Last 30d = today - 30..today.
- **Companies:** `rmm_list_companies` — add `p_date_from`, `p_date_to`; filter `created_at`.
- **Products:** `rmm_list_products` — add `p_date_from`, `p_date_to`; add `sku_count` (and `atc_code` from first SKU) to response. ATC filter: via `atc_code_id_filter` filtering products that have ≥1 SKU with that ATC (requires JOIN) — defer ATC filter on products if complex; implement date + SKU count first.
- **SKUs:** `rmm_list_skus` — add `p_date_from`, `p_date_to`, `p_dosage_form_filter`; include `atc_code` (join `atc_codes`) in response; already has `atc_code_id_filter`.
- **Submissions:** `rmm_list_submissions` uses `auth.uid()`. Add `p_date_from`, `p_date_to`; filter `created_at` in CTE.
- **ATC codes:** `rmm_list_atc_codes` — add `p_level_filter` (1–4), `p_category_filter` (single letter). Level derived from `code` length (1→L1, 2–3→L2, 4→L3, 5+→L4); category = `left(code,1)`. Return `level` in response.
- **Critical medicines:** `rmm_list_critical_medicines` — add `p_atc_code_id_filter` if missing; wire ATC filter in UI.

---

## 5. Implementation Order

Strict order: **4.1 → 4.2 → 4.3 → 4.4 → 4.5 → 4.6** (per plan dependencies).

---

**Confirmation:** Wireframes read fully, rules and scope confirmed. Proceeding with Phase 4 implementation.

---

## Implementation Summary (2026-01-25)

### Backend (Migrations)

- **`20260125160000_phase4_filters_and_columns.sql`**
  - `rmm_list_companies`: added `p_date_from`, `p_date_to`; filter `created_at::date`.
  - `rmm_list_submissions`: added `p_date_from`, `p_date_to`; filter `created_at::date` in CTE.

- **`20260125160001_phase4_products_skus_atc.sql`**
  - `rmm_list_products`: added `p_date_from`, `p_date_to`; added `company_name`, `atc_code` (first SKU), `sku_count`; filter by date.
  - `rmm_list_skus`: added `p_date_from`, `p_date_to`, `p_dosage_form_filter`; added `atc_code` (join `atc_codes`); filter by date and dosage form.
  - `rmm_list_atc_codes`: added `p_level_filter` (1–4), `p_category_filter` (single letter); level derived from `code` length; category = `left(code,1)`; return `level`.

### Frontend

- **Companies (`/rmm/companies`)**: Date range filter (All, Last 7d, Last 30d, Custom + picker); desktop sidebar + mobile drawer; clear; pass `p_date_from`/`p_date_to` to RPC.
- **Products (`/rmm/products`)**: Date range filter; SKU Count column (table + mobile cards); full mobile filters drawer (Company, Status, Critical, Date, Clear). RPC returns `sku_count`, `atc_code`, `company_name`.
- **SKUs (`/rmm/skus`)**: Date range; Dosage Form filter (All, Tablet, Capsule, Syrup, Injection, Cream, Ointment, Drops, Spray); ATC Code filter (dropdown, ATCs from `rmm_list_atc_codes`); ATC Code column (table + mobile); mobile filters drawer.
- **Submissions (`/rmm/submissions`)**: Date range filter; desktop + mobile drawer; pass `p_date_from`/`p_date_to`.
- **ATC Codes (`/rmm/atc-codes`)**: Level filter (1–4), Category filter (A,B,C,…); filters sidebar + mobile drawer; clear.

### Deferred

- **Task 4.3:** ATC filter on products list and critical-medicines list (SKUs only implemented).
