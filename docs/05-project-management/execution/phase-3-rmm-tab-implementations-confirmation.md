# Phase 3: RMM Tab Implementations — Pre-Implementation Confirmation

**Date:** 2026-01-25  
**Role:** Sami (Implementation Compliance Specialist)  
**Status:** ✅ Confirmed — Proceeding with implementation

---

## 1. Rules Adherence

### .cursor/rules

- **wireframe_db_compliance.md:** Wireframe-first, DB-first; no mocks; all data from Supabase; wireframe binding in code; role + UI states (loading, empty, error, success).
- **wireframe-compliance-checklist.md:** Read entire wireframe, extract all specs, verify requirements, add binding, implement exactly, verify before completion.
- **pm_agent_team.md:** Sami enforces compliance; Maya/Emma own RPC/frontend.

### No local mocks

- All data from Supabase RPCs/tables only. No inline mock arrays or synthetic data.

---

## 2. Wireframes Read (Complete)

| Task | Wireframe | Sections Reviewed |
|------|-----------|-------------------|
| 3.1 | `task-0.5.2.3-company-detail.md` | Products Tab: table (Product Name, ATC Code, SKUs, Status, Actions), [New Product], [View All Products], row click → product detail |
| 3.2 | `task-0.5.2.3-company-detail.md` | Enforcement Tab: filters (Action Type, Status), card-based list, Legal Basis, Appeal Deadline, metrics cards, [View All Enforcement Actions] |
| 3.3 | `task-0.5.2.3-company-detail.md` | History Tab: vertical timeline, change description + timestamp + user, chronological (most recent first) |
| 3.4 | `task-0.5.2.3-company-detail.md` | Overview Tab: metrics (Total/Active Products, Total/Active SKUs), Recent Activity, Enforcement History |
| 3.5 | `task-0.5.2.5-product-detail.md` | SKUs Tab: table (SKU Code, Name, Dosage, Form, Pack Size, Status, Actions), [New SKU], [View All SKUs] |
| 3.6 | `task-0.5.2.5-product-detail.md` | History Tab: same structure as Company History |
| 3.7 | `task-0.5.2.5-product-detail.md` | Overview Tab: Total/Active SKUs, Recent Activity, Enforcement History |
| 3.8 | `task-0.5.2.7-sku-detail.md` | Overview Tab: Related Submissions, Export Requests, Compliance Violations, Enforcement Actions, Regulatory Compliance |
| 3.9 | `task-0.5.2.7-sku-detail.md` | History Tab: same structure as Company/Product History |

---

## 3. Scope Confirmation (Phase 3 Tasks, in Order)

1. **3.1** — Company Detail Products tab: replace placeholder with products table; ATC, SKU count, [New Product], [View All Products].
2. **3.2** — Company Detail Enforcement tab: replace placeholder with filters, enforcement list (cards), Legal Basis, appeal deadline, metrics cards, [View All Enforcement Actions].
3. **3.3** — Company Detail History tab: replace placeholder with timeline from `rmm_get_company_history`.
4. **3.4** — Company Overview statistics: replace "-" with real stats (`rmm_get_company_statistics`), Recent Activity, Enforcement History.
5. **3.5** — Product Detail SKUs tab: replace placeholder with SKUs table, [New SKU], [View All SKUs].
6. **3.6** — Product Detail History tab: timeline from `rmm_get_product_history`.
7. **3.7** — Product Overview statistics: real stats (`rmm_get_product_statistics`), Recent Activity, Enforcement History.
8. **3.8** — SKU Detail Overview: Related Submissions, Export Requests (if ECS), Compliance Violations, Enforcement Actions, Regulatory Compliance (already present).
9. **3.9** — SKU Detail History tab: timeline from `rmm_get_sku_history`.

---

## 4. Database / RPC Assumptions

- **Products tab:** Use `rmm_list_company_products`. Extend RPC to return `atc_code` (from first SKU’s atc_codes) and `sku_count`; pagination `total`, `has_more` for frontend compatibility.
- **Enforcement tab:** Use existing `rmm_get_enforcement_actions(user_id, company_id, p_limit)`. Client-side filters for Action Type and Status. Card list, Legal Basis, appeal deadline per wireframe.
- **History tabs:** Use `rmm_get_company_history`, `rmm_get_product_history`, `rmm_get_sku_history`. Map `submissions` to timeline items (description from submission_type/entity_type, timestamp, “Updated by” — use user lookup where available or “—”).
- **Company/Product Overview stats:** Add `rmm_get_company_statistics(user_id, company_id)` and `rmm_get_product_statistics(user_id, product_id)`. Return total/active products (company) or total/active SKUs (product).
- **Recent Activity:** Derive from history RPCs (last 5–10 submissions) mapped to timeline format.
- **SKU Overview (3.8):** Related Submissions / Export Requests / Compliance Violations — use existing RPCs where they exist; otherwise structural placeholders with “No data” and links. Enforcement: use company-level `rmm_get_enforcement_actions` for SKU’s company (enforcement is company-scoped).

---

## 5. Implementation Order

Strict order: **3.1 → 3.2 → 3.3 → 3.4 → 3.5 → 3.6 → 3.7 → 3.8 → 3.9** (per plan dependencies).

---

**Confirmation:** Wireframes read fully, rules and scope confirmed. Proceeding with Phase 3 implementation.

---

## Implementation Summary (2026-01-25)

### Backend (Migrations)

- **`20260125140000_phase3_company_products_stats.sql`**
  - Extended `rmm_list_company_products` with `atc_code` (from first SKU’s atc_codes), `sku_count`; pagination `total`, `has_more`.
  - Added `rmm_get_company_statistics(user_id, company_id)` → `total_products`, `active_products`, `total_skus`, `active_skus`.
  - Added `rmm_get_product_statistics(user_id, product_id)` → `total_skus`, `active_skus`.

### Frontend

- **Company Detail (`/rmm/companies/[id]`)**
  - **Products tab (3.1):** Table from `rmm_list_company_products` (Product Name, ATC Code, SKU Count, Status, Actions). [New Product], [View All Products]. Loading/empty/error.
  - **Enforcement tab (3.2):** Filters (Action Type, Status), card list from `rmm_get_enforcement_actions`, Legal Basis, appeal window, metrics cards, [View All Enforcement Actions].
  - **History tab (3.3):** Timeline from `rmm_get_company_history` (submissions → timeline items). “Updated by: —” until user lookup.
  - **Overview (3.4):** Stats from `rmm_get_company_statistics`, Recent Activity from history, Enforcement History count + link.

- **Product Detail (`/rmm/products/[id]`)**
  - **SKUs tab (3.5):** Table from `rmm_list_product_skus` (SKU Code, Name, Dosage, Form, Pack Size, Status, Actions). [New SKU], [View All SKUs].
  - **History tab (3.6):** Timeline from `rmm_get_product_history`.
  - **Overview (3.7):** Stats from `rmm_get_product_statistics`, Recent Activity, Enforcement History link.

- **SKU Detail (`/rmm/skus/[id]`)**
  - **Overview (3.8):** Related Submissions, Export Requests, Compliance Violations (structural placeholders); Enforcement Actions from `rmm_get_enforcement_actions` (company); Regulatory Compliance (Phase 2).
  - **History tab (3.9):** Timeline from `rmm_get_sku_history`.
