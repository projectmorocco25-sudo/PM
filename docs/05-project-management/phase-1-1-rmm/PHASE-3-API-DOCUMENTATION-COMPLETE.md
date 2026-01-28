# Phase 3: API Documentation Updates – CRUD/Deletion Workflow

**Date:** 2026-01-28  
**Status:** ✅ **COMPLETE**  
**Owner:** Maya (Backend/API)  
**Implemented by:** Emma, Fatima and team

---

## Summary

Phase 3 updates to `docs/02-architecture/api/rpc-functions.md` are complete. All four RMM registry workflow RPCs now document deletion request creation, verification, approval, and implementation, including parameters, audit behaviour, and cascade rules.

---

## 3.1 Changes Made

### rmm_submit_registry_update(...)

- **Purpose** updated to state submission **including deletion requests**.
- **Parameters** clarified:
  - `submission_type`: listed all values including `company_delete`, `product_delete`, `sku_delete`.
  - `entity_id`: required for deletion requests.
  - `submission_data`: for deletion requests must include `reason` (required) and optional `detailed_explanation`.
- **Deletion requests** subsection added:
  - Who can create (Tier 2 Officer / Company where allowed).
  - Required fields (`entity_id`, `submission_data.reason`).
  - Six-step workflow (draft → submitted → tier2_verified → tier1_approved → tier2_implemented → completed).
  - Audit: all steps logged; final deletion logged with `old_values` preserved.

### rmm_verify_registry_submission(...)

- **Purpose** updated to include verification of deletion requests.
- **Deletion requests** note added: Tier 2 Officer can verify deletion requests; verification confirms validity and documentation; after verification, request moves to Tier 1 for approval.

### rmm_approve_registry_submission(...)

- **Purpose** updated to include approval of deletion requests.
- **Deletion requests** note added: Tier 1 approval is the “issue the command” step; approval authorizes Tier 2 Registrar to implement; after approval, request moves to Tier 2 Registrar.

### rmm_implement_registry_update(...)

- **Deletion implementation** subsection expanded (replacing the previous one-line note):
  1. **Soft delete applied:** Products/SKUs use `deactivated_at`, `deactivated_by`, `deactivated_reason`; companies use suspension/deactivation semantics per schema.
  2. **Cascade deactivation:** Company → products and SKUs; Product → SKUs; SKU → none.
  3. **Audit log entry:** `operation_type` = `'DELETE'`, `old_values` mandatory, hash chain and retention per audit-logging-spec.
  4. **Submission status:** Set to `tier2_implemented` and completed.
  5. **No hard deletes:** Only deactivation/suspension fields set; data retained for audit.

---

## Phase 3 Checklist

- [x] **3.1** Update rpc-functions.md
  - [x] Enhance `rmm_submit_registry_update` documentation with deletion subsection
  - [x] Add deletion notes to `rmm_verify_registry_submission`
  - [x] Add deletion notes to `rmm_approve_registry_submission`
  - [x] Enhance `rmm_implement_registry_update` documentation (deletion implementation details)

---

## File Modified

- `docs/02-architecture/api/rpc-functions.md` (RMM registry workflow section, ~lines 120–220)

---

**Last Updated:** 2026-01-28  
**Status:** ✅ Phase 3 Complete – Ready for Phase 4 (Feature Index Updates)
