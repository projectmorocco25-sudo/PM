# Phase 5: RMM Missing Management Features — Pre-Implementation Confirmation

**Date:** 2026-01-25  
**Role:** Sami (Implementation Compliance Specialist)  
**Status:** ✅ Confirmed — Proceeding with implementation

---

## 1. Rules Adherence

### .cursor/rules

- **wireframe_db_compliance.md:** Wireframe-first, DB-first; no mocks; all data from Supabase; wireframe binding; role + UI states.
- **wireframe-compliance-checklist.md:** Read entire wireframe, extract specs, verify requirements, add binding, implement exactly.

### No local mocks

- All data from Supabase RPCs/tables only. Draft auto-save uses **localStorage** (plan allows "form_drafts or localStorage"); not mock data.

---

## 2. Wireframes Read (Complete)

| Task | Wireframe | Sections Reviewed |
|------|-----------|-------------------|
| 5.1 | `task-0.5.2.15-critical-medicines-list.md` | [Designate] (MOH T1), designation wizard (SKU, justification, review, submit), Filters (Status, Company, ATC, Date), Table (SKU, Product, Company, Actions View/Edit/Remove), bulk checkbox + bulk remove, info banner, Regulatory Context |
| 5.2 | `task-0.5.2.3` (Company), `task-0.5.2.5` (Product), `task-0.5.2.7` (SKU) | [Edit] [Actions ▼]; Deactivate, Delete, Export, View Audit Log; Product: Critical Medicine toggle (MOH T1) |
| 5.3 | `task-0.5.2.8` (Company form) | Draft indicator "💾 Draft saved automatically - Last saved: [time]", [Save Draft], load draft, clear on submit; auto-save 30s or blur |

---

## 3. Scope Confirmation (Phase 5 Tasks, in Order)

1. **5.1** — Critical Medicines Management UI: [Designate] (MOH T1), designation modal (select SKU, justification, review, submit); filters Status/Company/ATC/Date; Actions View/Edit/Remove; bulk checkbox + bulk remove; info banner; Regulatory Context (Fatima).
2. **5.2** — Actions dropdown on Company, Product, SKU detail pages: [Actions ▼] with Deactivate, Delete, Export, View Audit Log; Product adds Critical Medicine toggle (MOH T1).
3. **5.3** — Draft auto-save on company/product/SKU create & edit forms: auto-save 30s or blur, draft indicator, [Save Draft], load draft, clear on submit.

---

## 4. Database / RPC Assumptions

- **Critical medicines:** Table `critical_medicines` (sku_id, designated_by, is_active). Designation is **SKU-level**. No `justification` column today; wireframe requires it for designate/remove. **Option A:** Add `justification` column + extend RPCs. **Option B:** Implement UI with justification, store in audit only; RPCs unchanged. Plan says "justification (required)" — we add `justification` via migration and extend RPCs.
- **RPCs:** `rmm_designate_critical_medicine(designator_user_id, sku_id)` → add `p_justification`; `rmm_remove_critical_medicine` → add `p_justification`; `rmm_update_critical_medicine` (edit) — create if missing. List: use `rmm_get_critical_medicines` or `rmm_list_critical_medicines`; ensure list returns product_id, product_name, company_id, company_name, atc_code for table.
- **Actions dropdown:** Deactivate/Delete/Export/Audit Log — verify RPCs exist per plan. Where missing, use placeholder actions (e.g. navigate to audit log route) or "Coming soon" so UI is complete.
- **Draft auto-save:** **localStorage** keyed by `draft_rmm_company_new`, `draft_rmm_company_edit_${id}`, etc. No new tables.

---

## 5. Implementation Order

Strict order: **5.1 → 5.2 → 5.3** (per plan dependencies).

---

**Confirmation:** Wireframes read fully, rules and scope confirmed. Proceeding with Phase 5 implementation.

---

## 6. Implementation Summary (Post-Implementation)

- **5.1 Critical Medicines Management UI:** ✅ Complete. Designate (MOH T1), designation modal (SKU, justification), filters (Status, Company, ATC, Date), table (SKU, Product, Company, Actions View/Edit/Remove), bulk checkbox + bulk remove, info banner, Regulatory Context, search. RPCs: `rmm_list_critical_medicines`, `rmm_designate_critical_medicine`, `rmm_remove_critical_medicine`, `rmm_update_critical_medicine`.
- **5.2 Actions dropdowns:** ✅ Complete. Company, Product, SKU detail pages have [Actions ▼] with View Audit Log, Export/Deactivate/Delete (coming soon). Product: Critical Medicine toggle (MOH T1).
- **5.3 Draft auto-save:** ✅ Complete. `useDraftForm` hook; Company new/edit, Product new/edit, SKU new/edit all have auto-save 30s, [Save Draft], draft indicator, load draft, clear on submit.
