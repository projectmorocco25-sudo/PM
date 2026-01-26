# Phase 6: RMM Additional Features — Pre-Implementation Confirmation

**Date:** 2026-01-25  
**Role:** Sami (Implementation Compliance Specialist)  
**Status:** ✅ Confirmed — Proceeding with implementation

---

## 1. Rules Adherence

### .cursor/rules

- **wireframe_db_compliance.md:** Wireframe-first, DB-first; no mocks; all data from Supabase; wireframe binding; role + UI states.
- **wireframe-compliance-checklist.md:** Read entire wireframe, extract specs, verify requirements, add binding, implement exactly.

### No local mocks

- All data from Supabase RPCs/tables only. Banners use local UI state (e.g. dismissible) only.

---

## 2. Wireframes Read (Complete)

| Task | Wireframe | Sections Reviewed |
|------|-----------|-------------------|
| 6.1 | `task-0.5.2.8` (Company form), `task-0.5.2.3` (Company detail) | Tax ID: optional, Contact section; detail shows Tax ID |
| 6.2 | `task-0.5.2.8`, `task-0.5.2.9`, `task-0.5.2.10` | Metadata: Created At, Created By, Last Updated, Updated By (edit only) |
| 6.3 | `task-0.5.2.14` (ATC), `task-0.5.2.15` (Critical medicines) | Info banners: ATC read-only; Critical medicines MOH T1; #eff6ff, dismissible |
| 6.4 | `task-0.5.2.14` | Level badges: L1 blue, L2 green, L3 yellow, L4 purple |
| 6.5 | `task-0.5.2.8` | Regulatory Notice: DMP, 7 years, enforcement, [View Regulatory Framework] |
| 6.6 | `task-0.5.2.2` | Registration format in Company Create; optional click-to-filter |
| 6.7 | `task-0.5.2.2` | Company filter (multi-select) for MOH on companies list |
| 6.8 | `task-0.5.2.11` | Submission Deadlines banner below filters; DMP Art.10; [View Regulatory Framework] |
| 6.9 | `task-0.5.2.12` | [Request Info] (MOH); modal; notify submitter; update status |
| 6.10 | `task-0.5.2.12` | Approval history: Regulatory Basis; Regulatory Requirements verified |

---

## 3. Scope Confirmation (Phase 6 Tasks, in Order)

1. **6.1** — Tax ID: Add to companies table, RPCs, company new/edit forms, company detail.
2. **6.2** — Metadata: Created By, Updated By on company/product/SKU edit forms (placeholder "—" if no backend).
3. **6.3** — Info banners: ATC + Critical medicines; styling; dismissible.
4. **6.4** — ATC level badges (color-coded).
5. **6.5** — Regulatory Notice on company new + edit.
6. **6.6** — Registration format in Company Create (already present); optional click-to-filter on list.
7. **6.7** — Company filter on companies list (MOH).
8. **6.8** — Submission Deadlines banner on submissions list (verify/enhance).
9. **6.9** — Request Info button + modal on submission detail (MOH).
10. **6.10** — Regulatory Basis + Regulatory Requirements in approval history (enhance if needed).

---

## 4. Database / RPC Assumptions

- **Tax ID:** `companies.tax_id` added via migration. `rmm_create_company`, `rmm_update_company`, `rmm_get_company` extended.
- **Metadata Created/Updated By:** No `created_by`/`updated_by` on companies today. Use "—" placeholders until backend supports.
- **Company filter (6.7):** Extend `rmm_list_companies` with `p_company_id uuid[]` (or single) to filter companies for MOH.
- **Request Info (6.9):** `rmm_request_submission_info` RPC may not exist; implement UI first, stub or add RPC as needed.
- **Regulatory Basis (6.10):** `rmm_get_approval_history` already returns `regulatory_basis`; display as-is; add "Regulatory Requirements ✓ Verified" when available.

---

## 5. Implementation Order

Strict order: **6.1 → 6.2 → 6.3 → 6.4 → 6.5 → 6.6 → 6.7 → 6.8 → 6.9 → 6.10**.

---

**Confirmation:** Wireframes read fully, rules and scope confirmed. Proceeding with Phase 6 implementation.

---

## Implementation Summary (2026-01-25)

### Backend (Migrations)

- **`20260125180000_phase6_tax_id.sql`**
  - `ALTER TABLE companies ADD COLUMN IF NOT EXISTS tax_id text`
  - `rmm_create_company`: added `tax_id` param, persist and return
  - `rmm_update_company`: added `tax_id` param, update and return
  - `rmm_get_company`: return `tax_id`

- **`20260125180001_phase6_company_filter.sql`**
  - `rmm_list_companies`: added `p_company_id uuid DEFAULT NULL`; MOH branch filters by `p_company_id` when set

### Frontend

- **Task 6.1 — Tax ID:** Company new/edit forms: Tax ID field in Contact section; draft snapshot; company detail shows Tax ID when present.
- **Task 6.2 — Metadata:** Company, product, SKU edit forms: Metadata section with Created At, Created By (—), Last Updated, Updated By (—).
- **Task 6.3 — Info banners:** ATC: dismissible banner + Regulatory Context; Critical medicines: dismissible banner (#eff6ff, localStorage).
- **Task 6.4 — Level badges:** ATC table: color-coded badges (L1 blue, L2 green, L3 yellow, L4 purple) with level labels.
- **Task 6.5 — Regulatory Notice:** Company new/edit: Regulatory Notice section (DMP, 7 years, enforcement, [View Regulatory Framework]).
- **Task 6.6 — Registration format:** Company create already has format hint; companies list: click registration number to filter by it.
- **Task 6.7 — Company filter:** Companies list: Company dropdown for MOH; fetch options via `rmm_list_companies`; pass `p_company_id` to RPC; clear filters.
- **Task 6.8 — Submission deadlines banner:** Submissions list already has banner (verified).
- **Task 6.9 — Request Info:** Submission detail: [Request Info] button (MOH), modal with message; calls `rmm_request_submission_info` (RPC to be added if missing).
- **Task 6.10 — Regulatory basis:** Approval history: Regulatory Basis + "Regulatory Requirements: ✓ Verified" / "—" when `regulatory_requirements_verified` present.
