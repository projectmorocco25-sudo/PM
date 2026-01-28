# RMM Critical Pages: CRUD and Deletion Logic Review (Tier 1 & Tier 2)

**Purpose:** Review and document CRUD—especially **Deletion**—for all Tier 1 and Tier 2 user roles across RMM critical pages (Company, Users, ATC, Products, SKUs). Ensures: Tier 2 Officer can request deletion; Tier 1 must approve and issue the command to Tier 2 Registrar to implement; all deletions are kept for audit.

**Prepared for:** Emma (UI/UX) and Fatima (Compliance/Review)  
**Date:** 2026-01-28  
**Status:** Review complete; recommendations below.

---

## 1. Role Summary (Tier 1 & Tier 2)

| Role | Description | Key actions for CRUD / Deletion |
|------|-------------|----------------------------------|
| **Tier 1 (Approver/Admin)** | Full administrative capabilities | **Approve** registry submissions (including deletions); **issue command** to Tier 2 Registrar; reject; system config; suspend companies. |
| **Tier 2 Officer** | Verification, analysis, escalation | **Request** deletion (create registry submission with `submission_type` = `*_delete`); **Verify** submissions; flag for Tier 1; cannot implement. |
| **Tier 2 Registrar** | Implementation only | **Implement** approved changes only (including approved deletions); cannot approve or verify. |

**Source:** [role-based-ui-patterns.md](../../02-architecture/frontend/role-based-ui-patterns.md), [Project Brief – PM.md](../../00-overview/Project%20Brief%20–%20PM.md).

---

## 2. Required Deletion Logic (Your Rule)

- **Tier 2 Officer** can **request** deletion for Company, Products, SKUs (and, where applicable, Users and ATC-related actions).
- **Tier 1** must **approve** and **issue the command** to Tier 2 Registrar to implement the deletion.
- **Tier 2 Registrar** **implements** the deletion (applies soft delete/deactivation and updates status).
- **When deletion happens:** it must be **kept for audit** (audit log with operation_type `delete` or equivalent, old_values preserved; no hard deletes of auditable records).

---

## 3. RMM Critical Entities: CRUD and Deletion

### 3.1 Company

| Operation | Who can do it | Flow | Audit |
|-----------|----------------|------|--------|
| Create | Company (submit) or MOH | Registry submission → Tier 2 verify → Tier 1 approve → Tier 2 Registrar implement | Yes (create) |
| Read | Company (own), MOH (all) | RLS | N/A |
| Update | Company (submit) or MOH | Same as create | Yes (update) |
| **Delete** | **Tier 2 Officer requests** → **Tier 1 approves** → **Tier 2 Registrar implements** | `submission_type = company_delete`; workflow: draft → submitted → tier2_verified → tier1_approved → tier2_implemented → completed | **Yes:** soft delete (deactivated_at, deactivated_by, deactivated_reason); audit_logs row with old_values |

**Schema:** `companies` has `deactivated_at`, `deactivated_by`, `deactivated_reason`. Cascade: company deactivation → products and SKUs deactivated (Task 1.1.2.13).

**Docs alignment:**  
- [schema-design.md](../../02-architecture/database/schema-design.md): `registry_submissions.submission_type` includes `company_delete`.  
- [registry-workflow.md](../features/rmm/registry-workflow.md), [1.1.2.8](../../phase-1-1-rmm/tasks/backend/1.1.2.8-registry-submission-tier1-approval.md), [1.1.2.9](../../phase-1-1-rmm/tasks/backend/1.1.2.9-registry-submission-tier2-implementation.md): Tier 1 approval and Tier 2 implementation are specified; **deletion should be explicitly stated as using the same workflow with `company_delete`**.

---

### 3.2 Users (MOH user / company user)

| Operation | Who can do it | Flow | Audit |
|-----------|----------------|------|--------|
| Create | Self (register) or Tier 1 / Admin | `rmm_create_user` (self-create); MOH user creation not yet fully specified in RMM tasks | Yes (create) |
| Read | Self (own), MOH (all for governance) | RLS | N/A |
| Update | Self (profile), MOH (role/company) | Shared RPCs / future user admin | Yes (update) |
| **Delete / Deactivate** | **Not currently in registry submission workflow** | `users.is_active = false` (deactivation). No `user_delete` submission_type in `registry_submissions`. | **Yes:** audit_logs with old_values; reason required for deletions |

**Gap:**  
- **User “deletion”** (deactivation) is **not** currently modeled as a registry submission.  
- **Recommendation:** Either (a) define a separate “user deactivation” workflow with Tier 2 Officer request → Tier 1 approve → Tier 2 Registrar (or Tier 1) implement, with audit; or (b) document that user deactivation is Tier-1-only with two-person rule and mandatory audit. Either way, **document who can request, who approves, who implements, and that it is kept for audit.**

---

### 3.3 ATC Codes

| Operation | Who can do it | Flow | Audit |
|-----------|----------------|------|--------|
| Create / Edit / Delete | **None** (reference data) | ATC codes are **read-only** in the system; no create, edit, or delete by any role. | N/A |

**Source:** [task-0.5.2.14-atc-codes-list.md](../../04-design/user-experience/wireframes/01-rmm/task-0.5.2.14-atc-codes-list.md): “Cannot edit, create, or delete ATC codes.”

**Clarification:**  
- “ATC” in the context of **deletion** = no deletion of ATC codes themselves.  
- If the requirement is to “remove an ATC code **assignment** from a product/SKU,” that is a **product/SKU update** and goes through the registry submission workflow (product_update / sku_update), not an ATC delete.

---

### 3.4 Products

| Operation | Who can do it | Flow | Audit |
|-----------|----------------|------|--------|
| Create | Company (submit) or MOH | Registry submission → Tier 2 verify → Tier 1 approve → Tier 2 Registrar implement | Yes (create) |
| Read | Company (own), MOH (all) | RLS | N/A |
| Update | Company (submit) or MOH | Same as create | Yes (update) |
| **Delete** | **Tier 2 Officer requests** → **Tier 1 approves** → **Tier 2 Registrar implements** | `submission_type = product_delete`; same workflow as company | **Yes:** soft delete (deactivated_at, deactivated_by, deactivated_reason); audit_logs with old_values |

**Schema:** `products` has `deactivated_at`, `deactivated_by`, `deactivated_reason`. Cascade: product deactivation → SKUs deactivated (Task 1.1.2.13).

**Docs alignment:** Same as company: `product_delete` exists in schema; **recommendation:** explicitly state in registry-workflow and task docs that deletion uses this workflow and is audit-preserved.

---

### 3.5 SKUs

| Operation | Who can do it | Flow | Audit |
|-----------|----------------|------|--------|
| Create | Company (submit) or MOH | Registry submission → Tier 2 verify → Tier 1 approve → Tier 2 Registrar implement | Yes (create) |
| Read | Company (own), MOH (all) | RLS | N/A |
| Update | Company (submit) or MOH | Same as create | Yes (update) |
| **Delete** | **Tier 2 Officer requests** → **Tier 1 approves** → **Tier 2 Registrar implements** | `submission_type = sku_delete`; same workflow as company/product | **Yes:** soft delete (deactivated_at, deactivated_by, deactivated_reason); audit_logs with old_values |

**Schema:** `skus` has `deactivated_at`, `deactivated_by`, `deactivated_reason`.

**Docs alignment:** Same as company and product; **recommendation:** explicit deletion workflow and audit in registry-workflow and RPC/task docs.

---

## 4. Deletion Workflow (Unified)

For **Company, Products, SKUs** the intended flow is:

1. **Request:** Tier 2 Officer creates a registry submission with `submission_type` = `company_delete` | `product_delete` | `sku_delete`, `entity_type` = company | product | sku, `entity_id` = target id.
2. **Verify:** Tier 2 Officer verifies the submission (`rmm_verify_registry_submission`).
3. **Approve & command:** Tier 1 approves (`rmm_approve_registry_submission`) — this is the “issue the command” step.
4. **Implement:** Tier 2 Registrar implements (`rmm_implement_registry_update`): applies deactivation (sets `deactivated_at`, `deactivated_by`, `deactivated_reason`), respects cascade (Task 1.1.2.13), and completes the submission.
5. **Audit:** Every step and the final “delete” (deactivation) are logged; audit_logs retain operation_type and old_values ([audit-logging-spec.md](../../02-architecture/security/audit-logging-spec.md)). Soft-delete safeguards (Task 1.1.2.14) prevent deletion when e.g. active registry submissions or dependencies exist.

**RPCs:**  
- [rpc-functions.md](../../02-architecture/api/rpc-functions.md): `rmm_submit_registry_update`, `rmm_verify_registry_submission`, `rmm_approve_registry_submission`, `rmm_implement_registry_update` — **recommendation:** add a short “Deletion” subsection stating that delete requests use the same workflow with `*_delete` submission types and must be audited.

---

## 5. Audit Requirements (Already Specified)

- **audit_logs:** All CRUD including **delete**; for deletes, **old_values** preserved; reason/justification mandatory where specified ([audit-logging-spec.md](../../02-architecture/security/audit-logging-spec.md)).
- **Trigger:** Audit trigger on relevant tables logs create, update, **delete** (Task 1.1.1.6).
- **Soft delete:** No hard deletes of auditable records; “deletion” = deactivation with deactivated_at/by/reason and audit entry.

**Conclusion:** “When deletion happens it must be kept for audit” is **already** satisfied by existing audit spec and trigger design, provided implementation uses the RMM workflow and soft delete only.

---

## 6. Gaps and Recommendations

| # | Gap | Recommendation |
|---|-----|-----------------|
| 1 | Registry workflow docs do not explicitly state that **deletion** (company_delete, product_delete, sku_delete) uses the same path (Tier 2 request → Tier 1 approve → Tier 2 Registrar implement). | Update [registry-workflow.md](../features/rmm/registry-workflow.md) and [rpc-functions.md](../../02-architecture/api/rpc-functions.md) with a “Deletion” subsection. |
| 2 | **User** deactivation/deletion is not in the registry submission model; no `user_delete` submission_type. | Decide and document: (a) separate user-deactivation workflow with request/approve/implement and audit, or (b) Tier-1-only with two-person rule and audit. |
| 3 | Role-based UI doc mentions “Delete (restricted)” but does not spell out “Tier 2 Officer requests, Tier 1 approves, Tier 2 Registrar implements” for RMM entities. | Add one short subsection under MOH actions in [role-based-ui-patterns.md](../../02-architecture/frontend/role-based-ui-patterns.md) for RMM deletion workflow. |
| 4 | Backend tasks 1.1.2.6–1.1.2.11 do not explicitly require handling `*_delete` submission types in implement step (deactivation + audit). | In Task 1.1.2.9 (Tier 2 implementation) and 1.1.2.10 (completion), add acceptance criteria: “Implements company_delete, product_delete, sku_delete by applying deactivation and writing audit log.” |

---

## 7. Summary Table: Who Does What for Deletion

| Entity | Request deletion | Approve & issue command | Implement deletion | Kept for audit |
|--------|-------------------|--------------------------|---------------------|----------------|
| Company | Tier 2 Officer | Tier 1 | Tier 2 Registrar | Yes (soft delete + audit_logs) |
| Product | Tier 2 Officer | Tier 1 | Tier 2 Registrar | Yes (soft delete + audit_logs) |
| SKU | Tier 2 Officer | Tier 1 | Tier 2 Registrar | Yes (soft delete + audit_logs) |
| Users | Not in registry workflow yet | — | — | Yes (if implemented with audit) |
| ATC | N/A (no delete) | N/A | N/A | N/A |

---

## 8. References

- [phase-1-1-rmm.md](../phase-1-1-rmm.md) — Task registry
- [rpc-functions.md](../../02-architecture/api/rpc-functions.md) — RMM workflow RPCs
- [audit-logging-spec.md](../../02-architecture/security/audit-logging-spec.md) — Audit and delete logging
- [role-based-ui-patterns.md](../../02-architecture/frontend/role-based-ui-patterns.md) — Tier 1 / Tier 2 Officer / Registrar
- [registry-workflow.md](../features/rmm/registry-workflow.md) — Registry submission workflow
- [schema-design.md](../../02-architecture/database/schema-design.md) — registry_submissions.submission_type, deactivated_*
- [1.1.2.14-soft-delete-safeguards.md](tasks/backend/1.1.2.14-soft-delete-safeguards.md)
- [1.1.2.13-cascade-deactivation-logic.md](tasks/backend/1.1.2.13-cascade-deactivation-logic.md)
- [1.1.2.8-registry-submission-tier1-approval.md](tasks/backend/1.1.2.8-registry-submission-tier1-approval.md)
- [1.1.2.9-registry-submission-tier2-implementation.md](tasks/backend/1.1.2.9-registry-submission-tier2-implementation.md)
- [Project Brief – PM.md](../../00-overview/Project%20Brief%20–%20PM.md)

---

**Last Updated:** 2026-01-28
