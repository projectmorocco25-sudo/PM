# Plan: BUSINESS-LOGIC Alignment — Phase 1.1 (Subphases 1.1.2 & 1.1.3)

**Purpose:** Structured plan to update [phase-1-1-rmm.md](../phase-1-1-rmm.md) and **task files under [phase-1-1-rmm/tasks/](../phase-1-1-rmm/tasks/)** so that **Subphase 1.1.2** (RMM Module – Core Registry Management) and **Subphase 1.1.3** (RMM Integration Testing & Seed Data) explicitly reflect the business rules in [docs/BUSINESS-LOGIC.md](../../BUSINESS-LOGIC.md).

**Source:** Audit of phase-1-1-rmm.md (read in full, no truncation) against BUSINESS-LOGIC.md (read in full, no truncation).  
**Scope:**
- **phase-1-1-rmm.md** — Narrative edits (Business logic notes, Related Documents).
- **phase-1-1-rmm/tasks/** — Edits to backend, frontend, testing, and documentation task files (implementation notes, acceptance criteria, compliance verification). **Required:** The phase registry links to these task files; keeping them aligned with BUSINESS-LOGIC is **required** to ensure phase-1-1-rmm.md and the phase remain accurate.

**Status:** ⏳ **PLAN — NOT YET EXECUTED**

---

## Reference Documents (Read in Full — No Truncation)

- **[docs/BUSINESS-LOGIC.md](../../BUSINESS-LOGIC.md)** — Authoritative business rules (§1–§11). Key sections for this plan: §3 (roles, two-person rule, Tier 1 justification), §4 (RMM approval chains, deletion, timeframes, MOH peer review), §8 (enforcement types, appeal window, Tier 1 review SLA), §10 (deadlines).
- **[docs/05-project-management/phase-1-1-rmm.md](../phase-1-1-rmm.md)** — Phase 1.1 task registry. Subphases 1.1.2 (lines ~432–903) and 1.1.3 (lines ~906–984) are in scope.

---

## Checklist

Use this section to track completion. Check off each task when implemented (`[ ]` → `[x]`).

### Phase A — phase-1-1-rmm.md narrative

- [x] **A.1** — Subphase 1.1.2 header and Enforcement section (`phase-1-1-rmm.md`)
- [x] **A.2** — Subphase 1.1.3 and Related Documents (`phase-1-1-rmm.md`)

### Phase B — phase-1-1-rmm/tasks/ 1.1.2

- [x] **B.1.1** — Two-person rule (`1.1.2.15-two-person-rule.md`)
- [x] **B.1.2** — Soft-delete safeguards (`1.1.2.14-soft-delete-safeguards.md`)
- [x] **B.2.1** — MOH submission peer review (`1.1.2.12-moh-submission-peer-review.md`)
- [x] **B.3.1** — Enforcement submit for review (`1.1.2.31-enforcement-submit-for-review.md`)
- [x] **B.3.2** — Enforcement review action (`1.1.2.32-enforcement-review-action.md`)
- [x] **B.3.3** — Enforcement approve action (`1.1.2.33-enforcement-approve-action.md`)
- [x] **B.3.4** — Enforcement execute action (`1.1.2.34-enforcement-execute-action.md`)
- [x] **B.3.5** — Enforcement appeal action (`1.1.2.35-enforcement-appeal-action.md`)
- [x] **B.3.6** — Enforcement resolve appeal (`1.1.2.36-enforcement-resolve-appeal.md`)
- [x] **B.4.1** — Create enforcement action wizard (`1.1.2.40-create-enforcement-action-wizard.md`)
- [x] **B.4.2** — Pending approvals page (`1.1.2.41-pending-approvals-page.md`)
- [x] **B.4.3** — Appeal review interface (`1.1.2.43-appeal-review-interface.md`)
- [x] **B.4.4** — Appeal submission form (`1.1.2.44-appeal-submission-form.md`)
- [x] **B.5.1** — Registry submission create / timeframes *(optional)* (`1.1.2.6-registry-submission-create.md`)

### Phase C — phase-1-1-rmm/tasks/ 1.1.3

- [x] **C.1.1** — Test two-person rule (`1.1.3.5-test-two-person-rule.md`)
- [x] **C.1.2** — Enforcement workflow integration tests (`1.1.3.3-enforcement-workflow-integration-tests.md`)
- [x] **C.2.1** — RMM user documentation (`1.1.3.9-rmm-user-documentation.md`)

### Phase D — Optional roles

- [x] **D.1** — Company Manager / Company User mapping (`phase-1-1-rmm.md` or role-definition doc)

---

## Phase A: Update phase-1-1-rmm.md Narrative

**Goal:** Add BUSINESS-LOGIC–aligned narrative and references to the phase file **without** changing task IDs or dependency structure.

### Task A.1 — Subphase 1.1.2 header and Enforcement section

**File:** `docs/05-project-management/phase-1-1-rmm.md`

**Edits:**

1. **Subphase 1.1.2 intro (after "Task Directory")**  
   Add a short **"Business logic (BUSINESS-LOGIC.md)"** note:
   - Enforcement: **Warning** → Tier 2 may approve alone; **Fine** / **Suspension** → Tier 1 approval required. All Tier 1 enforcement actions require **mandatory justification (min 50 characters)**, logged in audit.
   - **30-day appeal window** from execution; company submits within 30 days; Tier 1 reviews within **14 business days** (target).
   - **Two-person rule** applies to: (1) company suspension, (2) company deletion, (3) product deactivation for critical medicines, (4) product deletion — **Tier 1 approval + Tier 2 Officer confirmation** before execution.
   - **MOH-originated** registry changes: **another** Tier 2 must peer-review before Tier 1 approval.
   - **Deletion requests:** explicit confirmation + **mandatory justification (min 50 characters)**; enhanced approval/impact warnings; optional pending period before permanent removal (or document as deferred).
   - **RMM timeframes (reference):** Verification 2–3 working days, approval 2 working days, implementation 1 working day.

2. **Registry Submission Workflow (before Task 1.1.2.6)**  
   Add one bullet: **MOH-originated workflow:** Tier 2 submits → **another** Tier 2 peer-reviews → Tier 1 approves → Tier 2 Registrar implements. Per BUSINESS-LOGIC §4.2.

3. **Business Logic (before Task 1.1.2.13)**  
   Add one bullet: **Deletion:** Mandatory justification (min 50 chars), explicit confirmation, enhanced warnings. **Two-person rule:** Enumerate the four critical actions (see Task A.1.1) and require Tier 1 + Tier 2 Officer.

4. **Enforcement Backend Tasks (before Task 1.1.2.31)**  
   Add one bullet: **Enforcement types:** Warning (Tier 2 alone), Fine/Suspension (Tier 1). **Justification:** All Tier 1 enforcement actions require mandatory justification (min 50 chars), audited. **Appeal:** 30-day window from execution; Tier 1 review within 14 business days.

**Acceptance:** Phase file reads coherently with BUSINESS-LOGIC; no new tasks, no dependency changes.

---

### Task A.2 — Subphase 1.1.3 and Related Documents

**File:** `docs/05-project-management/phase-1-1-rmm.md`

**Edits:**

1. **Subphase 1.1.3 intro (after "Prerequisites")**  
   Add: **Business logic:** Integration tests and documentation must align with [BUSINESS-LOGIC.md](../../BUSINESS-LOGIC.md) (justification, two-person rule, appeal window, enforcement types, deletion safeguards). See Task 1.1.3.5, 1.1.3.9.

2. **Related Documents (bottom of phase file)**  
   Add: **- [BUSINESS-LOGIC](../../BUSINESS-LOGIC.md)** — Business rules reference for Phase 1.1 implementation and verification.

**Acceptance:** 1.1.3 references BUSINESS-LOGIC; Related Documents links to it.

---

## Phase B: Update phase-1-1-rmm Task Files (1.1.2)

**Goal:** Ensure **phase-1-1-rmm/tasks/** backend and frontend task specs explicitly require BUSINESS-LOGIC behaviour. Update **Implementation Notes** and **Acceptance Criteria** (and, where applicable, **Compliance Verification** sections). These updates are **required** so that the task definitions referenced by phase-1-1-rmm.md stay aligned with the phase narrative and BUSINESS-LOGIC.

---

### B.1 — Two-person rule and deletion

| Task | File | Updates |
|------|------|---------|
| **B.1.1** | `phase-1-1-rmm/tasks/backend/1.1.2.15-two-person-rule.md` | **Implementation notes:** Enumerate the **four** critical actions: (1) company suspension, (2) company deletion, (3) product deactivation for critical medicines, (4) product deletion. Require **Tier 1 approval + Tier 2 Officer confirmation** before execution (not only "two different users"). **Acceptance criteria:** Add "Four critical actions explicitly implemented" and "Tier 1 + Tier 2 Officer roles enforced." **Compliance verification:** Add step to verify all four actions and role pairing. |
| **B.1.2** | `phase-1-1-rmm/tasks/backend/1.1.2.14-soft-delete-safeguards.md` | **Implementation notes:** Add **mandatory justification (min 50 characters)** and **explicit confirmation** for deletion requests. Add **enhanced approval and impact warnings** for deletion. Note: optional **pending period** before permanent removal (or document as deferred). **Acceptance criteria:** Add "Deletion requests require justification (min 50 chars) and explicit confirmation" and "Enhanced deletion warnings implemented." **Compliance verification:** Add steps to verify justification + confirmation. |

---

### B.2 — Registry workflow and MOH peer review

| Task | File | Updates |
|------|------|---------|
| **B.2.1** | `phase-1-1-rmm/tasks/backend/1.1.2.12-moh-submission-peer-review.md` | **Implementation notes:** State explicitly that **MOH-originated** registry changes require peer review by **another** Tier 2 user (different from the submitter) before Tier 1 approval. **Acceptance criteria:** Add "Another Tier 2 (distinct from submitter) performs peer review for MOH-originated changes." **Compliance verification:** Add step to verify distinct Tier 2 reviewer. |

---

### B.3 — Enforcement: justification, types, appeal

| Task | File | Updates |
|------|------|---------|
| **B.3.1** | `phase-1-1-rmm/tasks/backend/1.1.2.31-enforcement-submit-for-review.md` | **Implementation notes:** Enforce **enforcement type** (Warning / Fine / Suspension). Note: **Warning** → Tier 2 may approve alone; **Fine** / **Suspension** → Tier 1 approval required. **Acceptance criteria:** Add "Enforcement type recorded; type determines approval path (Tier 2 vs Tier 1)." |
| **B.3.2** | `phase-1-1-rmm/tasks/backend/1.1.2.32-enforcement-review-action.md` | **Implementation notes:** For Tier 1-involved actions, require **mandatory justification (min 50 characters)**; persist and audit. **Acceptance criteria:** Add "Justification (min 50 chars) required, stored, and audited for Tier 1 actions." **Compliance verification:** Add step to verify justification + audit. |
| **B.3.3** | `phase-1-1-rmm/tasks/backend/1.1.2.33-enforcement-approve-action.md` | **Implementation notes:** Require **mandatory justification (min 50 characters)** for Tier 1 approval; persist and audit. **Acceptance criteria:** Add "Justification (min 50 chars) required for Tier 1 approval; audited." **Compliance verification:** Add step to verify justification. |
| **B.3.4** | `phase-1-1-rmm/tasks/backend/1.1.2.34-enforcement-execute-action.md` | **Implementation notes:** Require **mandatory justification (min 50 characters)** when Tier 1 executes; persist and audit. **Acceptance criteria:** Add "Justification (min 50 chars) required for execution when Tier 1; audited." **Compliance verification:** Add step to verify justification. |
| **B.3.5** | `phase-1-1-rmm/tasks/backend/1.1.2.35-enforcement-appeal-action.md` | **Implementation notes:** Appeals must be submitted **within 30 days of execution**. Reject submission after the window. **Acceptance criteria:** Add "Appeal submission rejected when &gt; 30 days since execution." **Compliance verification:** Add step to verify 30-day window enforcement. |
| **B.3.6** | `phase-1-1-rmm/tasks/backend/1.1.2.36-enforcement-resolve-appeal.md` | **Implementation notes:** Tier 1 reviews appeal; target **within 14 business days**. Document as SLA/target. **Acceptance criteria:** Add "Tier 1 review completion tracked; 14 business days target documented." |

---

### B.4 — Frontend: enforcement and appeal

| Task | File | Updates |
|------|------|---------|
| **B.4.1** | `phase-1-1-rmm/tasks/frontend/1.1.2.40-create-enforcement-action-wizard.md` | **Implementation notes:** Wizard must capture **enforcement type** (Warning / Fine / Suspension). **Warning** → Tier 2 may approve alone; **Fine** / **Suspension** → Tier 1 approval required. When Fine/Suspension, ensure **justification (min 50 characters)** is collected (or clearly required at approval/execution). **Acceptance criteria:** Add "Enforcement type (Warning/Fine/Suspension) captured; type determines approval path" and "Justification requirement surfaced for Fine/Suspension." |
| **B.4.2** | `phase-1-1-rmm/tasks/frontend/1.1.2.41-pending-approvals-page.md` | **Implementation notes:** Page shows items pending Tier 1 approval (and two-person-rule confirmation where applicable). Surface **justification (min 50 chars)** requirement and **two-person-rule** context (Tier 1 + Tier 2 Officer) for critical actions. **Acceptance criteria:** Add "Justification requirement and two-person-rule context reflected in UI where relevant." |
| **B.4.3** | `phase-1-1-rmm/tasks/frontend/1.1.2.43-appeal-review-interface.md` | **Implementation notes:** Tier 1 appeal review interface. Document **14 business days** review target (SLA); support outcomes: uphold, uphold with adjustment note, overturn. **Acceptance criteria:** Add "14 business days review target documented; uphold / adjust / overturn outcomes supported." |
| **B.4.4** | `phase-1-1-rmm/tasks/frontend/1.1.2.44-appeal-submission-form.md` | **Implementation notes:** Validate that appeal is submitted **within 30 days of execution**. Disable or hide submission and show clear message when outside window. **Acceptance criteria:** Add "Appeal form enforces 30-day window; submission disabled or blocked when expired." |

---

### B.5 — Registry workflow (optional)

| Task | File | Updates |
|------|------|---------|
| **B.5.1** | `phase-1-1-rmm/tasks/backend/1.1.2.6-registry-submission-create.md` (or workflow overview) | **Implementation notes:** Add **RMM timeframes (reference)** per BUSINESS-LOGIC §4.2: Verification 2–3 working days, approval 2 working days, implementation 1 working day. Reference only; no hard enforcement required. **Acceptance criteria:** Add "Timeframes documented as reference." |

---

## Phase C: Update phase-1-1-rmm Task Files (1.1.3 — Testing & Documentation)

**Goal:** Align **phase-1-1-rmm/tasks/** integration-test and documentation task files with BUSINESS-LOGIC. Required so that 1.1.3 deliverables stay consistent with phase-1-1-rmm.md and BUSINESS-LOGIC.

---

### C.1 — Integration tests

| Task | File | Updates |
|------|------|---------|
| **C.1.1** | `phase-1-1-rmm/tasks/testing/1.1.3.5-test-two-person-rule.md` | **Implementation steps:** Explicitly test **all four** critical actions: company suspension, company deletion, product deactivation (critical medicines), product deletion. Require **Tier 1 + Tier 2 Officer** (not just "two users"). **Acceptance criteria:** Add "All four two-person-rule actions tested" and "Tier 1 + Tier 2 Officer pairing verified." |
| **C.1.2** | `phase-1-1-rmm/tasks/testing/1.1.3.3-enforcement-workflow-integration-tests.md` | **Implementation steps:** Add tests for: (1) **Mandatory justification** — Tier 1 enforcement actions require min 50 chars, stored and audited; (2) **Deletion** — requests without justification (min 50 chars) or explicit confirmation rejected; (3) **30-day appeal window** — appeal submission rejected when &gt; 30 days since execution. **Acceptance criteria:** Add corresponding items. **(If 1.1.3.3 has a different structure, add a dedicated "BUSINESS-LOGIC enforcement" subsection.)** |

---

### C.2 — Documentation

| Task | File | Updates |
|------|------|---------|
| **C.2.1** | `phase-1-1-rmm/tasks/documentation/1.1.3.9-rmm-user-documentation.md` | **Implementation notes:** Add a **BUSINESS-LOGIC alignment** checklist: user-facing documentation must reflect (1) two-person rule and the four critical actions, (2) mandatory justification for Tier 1 enforcement, (3) 30-day appeal window and Tier 1 review target, (4) enforcement types (Warning vs Fine/Suspension), (5) deletion justification and confirmation. **Acceptance criteria:** Add "RMM user docs aligned with BUSINESS-LOGIC per checklist." |

---

## Phase D: Optional — Roles (Company Manager / Company User)

**Goal:** Resolve BUSINESS-LOGIC §3 "Company Manager / Company User" vs phase role naming.

| Task | File | Updates |
|------|------|---------|
| **D.1** | `docs/05-project-management/phase-1-1-rmm.md` or role-definition doc | **Option A:** If Phase 1.1 schema/RLS use distinct "Company Manager" and "Company User" — ensure 1.1.2 role coverage and task narrative mention them. **Option B:** If they map to existing roles (e.g. company_admin, company_user), add a short **phase note** under 1.1.2: "BUSINESS-LOGIC 'Company Manager' / 'Company User' map to [list Phase 1.1 roles]." **Acceptance:** No ambiguity between BUSINESS-LOGIC and phase role names. |

---

## Summary: Phases and Tasks

| Done | Phase | Description | Tasks |
|:----:|-------|-------------|--------|
| [x] | **A** | phase-1-1-rmm.md narrative | A.1, A.2 |
| [x] | **B** | phase-1-1-rmm/tasks/ 1.1.2 | B.1.1–B.1.2, B.2.1, B.3.1–B.3.6, B.4.1–B.4.4, B.5.1 *(optional)* |
| [x] | **C** | phase-1-1-rmm/tasks/ 1.1.3 | C.1.1, C.1.2, C.2.1 |
| [x] | **D** | Optional roles | D.1 |

*Check off individual tasks in the [Checklist](#checklist) above; use this table to track phase-level completion.*

---

## Execution Order

1. **Phase A** — Update **phase-1-1-rmm.md** first (narrative and references).
2. **Phase B** — Update **phase-1-1-rmm/tasks/** 1.1.2 task files: backend (B.1–B.3, B.5 optional), then frontend (B.4).
3. **Phase C** — Update **phase-1-1-rmm/tasks/** 1.1.3 task files (testing C.1, then documentation C.2).
4. **Phase D** — If needed, add role-mapping note (phase file or role-definition doc).

---

## Compliance Note

- When **reading** any document under `docs/02-architecture`, `docs/04-design`, or `docs/05-project-management`, **do not truncate**; read in full per [compliance-rules.md](../standards/compliance-rules.md).
- This plan **does not** add new phase tasks or change task IDs/dependencies; it only **augments** existing task content and phase narrative.

---

## Changelog

| Date | Change |
|------|--------|
| *(plan created)* | Initial plan; Phases A–D and task-level updates defined. |
| 2026-01-28 | Scope clarified: **phase-1-1-rmm/tasks/** updates **required** to ensure phase-1-1-rmm.md. Added B.4.1–B.4.4 (1.1.2.40 wizard, 1.1.2.41 pending approvals, 1.1.2.43 appeal review, 1.1.2.44 appeal form), B.5.1 optional (registry timeframes). Summary and execution order updated. |
| 2026-01-28 | Added **Checklist** section with `- [ ]` items for all tasks (A.1–A.2, B.1.1–B.5.1, C.1.1–C.2.1, D.1); Summary table now includes phase-level checkboxes. |
| 2026-01-28 | **Phase A executed:** A.1 and A.2 implemented in phase-1-1-rmm.md. Checklist and Summary updated. |
| 2026-01-28 | **Phase B executed:** B.1.1–B.1.2, B.2.1, B.3.1–B.3.6, B.4.1–B.4.4, B.5.1 implemented in phase-1-1-rmm/tasks/. Checklist and Summary updated. |
| 2026-01-28 | **Phase C executed:** C.1.1, C.1.2, C.2.1 implemented in phase-1-1-rmm/tasks/ (testing + documentation). Checklist and Summary updated. |
| 2026-01-28 | **Phase D executed:** D.1 — Role mapping note added under Subphase 1.1.2 (BUSINESS-LOGIC Company Admin / Company Manager / User → Phase 1.1 roles). Checklist and Summary updated. |

---

**Last Updated:** 2026-01-28  
**Owner:** Sami (Compliance) + PM  
**Related:** [phase-1-1-rmm.md](../phase-1-1-rmm.md) | [BUSINESS-LOGIC.md](../../BUSINESS-LOGIC.md) | [outstanding-scope-and-sequencing.md](./outstanding-scope-and-sequencing.md)
