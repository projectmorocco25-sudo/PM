# Plan: Ownership & Risks — Subphase 1.1.2

**Purpose:** Structured plan to update [phase-1-1-rmm.md](../phase-1-1-rmm.md) and related documents so that **Subphase 1.1.2** (RMM Module – Core Registry Management) has explicit **implementation ownership**, **risk mitigations** (volume, compliance bottleneck, seed gate, business logic alignment, naming), and a **pre-flight checklist** ready for kickoff.

**Source:** Team audit of Subphase 1.1.2 (ownership and risks).  
**Scope:**
- **phase-1-1-rmm.md** — Ownership table, batching guidance, seed/prerequisite note, naming note, pre-flight checklist.
- **compliance-rules.md** — Approval process (batch, backup reviewer).
- **seed-data-playbook.md** — Owner for `seed_1_1_2_rmm`; “1.1.2 starts when” definition.
- **phase-1-1-rmm/tasks/** — Business logic reference line in relevant backend/frontend task files (1.1.2.13–15, 1.1.2.31–36, 1.1.2.41, 1.1.2.43, 1.1.2.44).

**Status:** ⏳ **PLAN — NOT YET EXECUTED**

---

## Reference Documents

- **[phase-1-1-rmm.md](../phase-1-1-rmm.md)** — Phase 1.1 task registry. Subphase 1.1.2 starts ~line 433.
- **[compliance-rules.md](../standards/compliance-rules.md)** — Sami’s checklist; approval process.
- **[seed-data-playbook.md](./seed-data-playbook.md)** — Seed stages; `seed_1_1_2_rmm` at stage “seed_1_1_2_rmm (Subphase 1.1.2)”.
- **[BUSINESS-LOGIC.md](../../BUSINESS-LOGIC.md)** — Business rules for two-person rule, justification, appeal, enforcement.

---

## Master Checklist

Use this section to track completion. Check off each task when implemented (`[ ]` → `[x]`).

### Phase A — Ownership (phase-1-1-rmm.md)

- [x] **A.1** — Add “Implementation owners (by area)” table to Subphase 1.1.2
- [x] **A.2** — Add note that verification owners remain Sami + Oliver

### Phase B — Compliance / approval process (phase-1-1-rmm.md + compliance-rules.md)

- [x] **B.1** — Add “Compliance verification batching” note to Subphase 1.1.2
- [x] **B.2** — Add “Sami’s approval” process (batch + backup) to compliance-rules.md

### Phase C — Volume & batching (phase-1-1-rmm.md) *(skipped — not in scope)*

- ~~**C.1**~~ — Add “Verification batching (Xa/Xb/Xc)” guidance to Subphase 1.1.2
- ~~**C.2**~~ — Add “PR grouping by area” guidance to Subphase 1.1.2

### Phase D — Seed gate (phase-1-1-rmm.md + seed-data-playbook.md)

- [x] **D.1** — Add owner for `seed_1_1_2_rmm` in seed-data-playbook.md
- [x] **D.2** — Add “Subphase 1.1.2 starts when” definition to phase-1-1-rmm.md
- [x] **D.3** — Add seed gate to pre-flight checklist (see Phase G)

### Phase E — Business logic alignment in task files (phase-1-1-rmm/tasks/)

- [x] **E.1** — Add BUSINESS-LOGIC reference line to 1.1.2.13, 1.1.2.14, 1.1.2.15
- [x] **E.2** — Add BUSINESS-LOGIC reference line to 1.1.2.31–1.1.2.36
- [x] **E.3** — Add BUSINESS-LOGIC reference line to 1.1.2.41, 1.1.2.43, 1.1.2.44

### Phase F — Naming (phase-1-1-rmm.md) *(skipped — not in scope)*

- ~~**F.1**~~ — Add “Naming: 1.1.2.18 vs 1.1.2.18a” note to Subphase 1.1.2

### Phase G — Pre-flight checklist (phase-1-1-rmm.md)

- [x] **G.1** — Add “Subphase 1.1.2 pre-flight checklist” section to phase-1-1-rmm.md

---

## Phase A: Ownership

**Goal:** Make implementation ownership explicit by area so the team can parallelize and know who drives each stream.

### Task A.1 — Add “Implementation owners (by area)” table to Subphase 1.1.2

**File:** `docs/05-project-management/phase-1-1-rmm.md`

**Location:** After the “Business logic (BUSINESS-LOGIC.md)” bullet list and before “### RMM Backend Tasks” (around line 449).

**Add the following subsection:**

```markdown
**Implementation owners (by area):** Assign one owner per stream for accountability and parallel work. Update names when assigned.

| Area | Owner | Tasks |
|------|--------|--------|
| RMM CRUD (backend) | TBD | 1.1.2.1, 1.1.2.2, 1.1.2.3, 1.1.2.3a |
| MOH reference data (backend) | TBD | 1.1.2.4, 1.1.2.5 |
| Registry submission workflow (backend) | TBD | 1.1.2.6–1.1.2.12 |
| Business logic (backend) | TBD | 1.1.2.13, 1.1.2.14, 1.1.2.15 |
| Enforcement (backend) | TBD | 1.1.2.31–1.1.2.36 |
| RMM layout & overview (frontend) | TBD | 1.1.2.16, 1.1.2.16.1 |
| Company (frontend) | TBD | 1.1.2.17–1.1.2.19 |
| Product (frontend) | TBD | 1.1.2.20–1.1.2.22 |
| SKU (frontend) | TBD | 1.1.2.23–1.1.2.25 |
| Registry submission (frontend) | TBD | 1.1.2.26–1.1.2.28 |
| MOH-only pages (frontend) | TBD | 1.1.2.29, 1.1.2.30 |
| Enforcement (frontend) | TBD | 1.1.2.37–1.1.2.44 |
```

- [x] **A.1** — Inserted ownership table as above (replace TBD with names when assigned).

### Task A.2 — Add note that verification owners remain Sami + Oliver

**File:** `docs/05-project-management/phase-1-1-rmm.md`

**Location:** Immediately after the ownership table added in A.1.

**Add one line:**

```markdown
**Verification (all tasks):** Sami (Compliance) + Oliver (Technical Review). See [Compliance Rules](./standards/compliance-rules.md).
```

- [x] **A.2** — Inserted verification owner note.

---

## Phase B: Compliance / approval process

**Goal:** Reduce compliance bottleneck by allowing batch sign-off and defining a backup reviewer.

### Task B.1 — Add “Compliance verification batching” note to Subphase 1.1.2

**File:** `docs/05-project-management/phase-1-1-rmm.md`

**Location:** After the verification owner note (A.2) and before “### RMM Backend Tasks”.

**Add:**

```markdown
**Compliance verification batching:** Tasks may be verified by area or by PR when multiple tasks are implemented together. Sami (and Oliver) sign off once per area or per PR against the compliance checklist for those tasks. See [Compliance Rules](./standards/compliance-rules.md#implementation-summary-compliance-requirement-mandatory).
```

- [x] **B.1** — Inserted batching note (adjust anchor if compliance-rules.md section ID differs).

### Task B.2 — Add “Sami’s approval” process (batch + backup) to compliance-rules.md

**File:** `docs/05-project-management/standards/compliance-rules.md`

**Location:** After “Pre-Task Checklist” (or in a new “Approval process” section near the top, after “Sami's Stop Authority”).

**Add a new subsection:**

```markdown
## Approval process (Sami’s sign-off)

- **Per task:** Sami’s approval is required before any task is considered complete. Compliance verification tasks (-verify) are owned by Sami (Compliance) + Oliver (Technical Review).
- **Batching:** For Subphase 1.1.2 (and similar), compliance verification may be performed **per area** or **per PR** when multiple tasks are implemented together. Sami signs off once per area/PR against the compliance checklist for those tasks.
- **Definition of done:** “Sami’s approval” = compliance checklist for the task(s) or PR completed and signed off (by task, by area, or by PR when tasks are grouped).
- **Backup reviewer:** If Sami is unavailable, [Oliver or designated deputy] may perform compliance sign-off so work does not stall. Document the backup in this section when designated.
```

- [x] **B.2** — Inserted approval process section; replace “[Oliver or designated deputy]” with actual name or leave as placeholder.

---

## Phase C: Volume & batching

**Goal:** Document that verifications and PRs can be batched by area to reduce repetition.

### Task C.1 — Add “Verification batching (Xa/Xb/Xc)” guidance to Subphase 1.1.2

**File:** `docs/05-project-management/phase-1-1-rmm.md`

**Location:** After Phase B.1 note and before “### RMM Backend Tasks”.

**Add:**

```markdown
**Verification batching (Xa/Xb/Xc):** Frontend verification tasks (wireframes, schema, API) may be completed **by area** in one pass. Document once per area (e.g. “Company: wireframes/schema/API verified [date], refs: [links]”) and reference that note in each implementation task (1.1.2.17, 1.1.2.18, etc.) instead of re-running identical checks. Same approach for Product, SKU, Registry, MOH-only, and Enforcement areas.
```

- ~~**C.1**~~ — Inserted verification batching guidance.

### Task C.2 — Add “PR grouping by area” guidance to Subphase 1.1.2

**File:** `docs/05-project-management/phase-1-1-rmm.md`

**Location:** After C.1 note.

**Add:**

```markdown
**PR grouping:** Tasks may be implemented and submitted in **area-based PRs** (e.g. “Company backend 1.1.2.1 + 1.1.2.1-verify”). Each PR must list the task IDs and satisfy the compliance checklist for those tasks.
```

- ~~**C.2**~~ — Inserted PR grouping note.

---

## Phase D: Seed gate

**Goal:** Clarify who owns `seed_1_1_2_rmm` and when Subphase 1.1.2 is allowed to start.

### Task D.1 — Add owner for `seed_1_1_2_rmm` in seed-data-playbook.md

**File:** `docs/05-project-management/planning/seed-data-playbook.md`

**Location:** In the section “Stage: seed_1_1_2_rmm (Subphase 1.1.2)” (around line 247). Add at the start of that section:

```markdown
**Owner for applying and verifying this stage:** [Hassan / or designate]. Subphase 1.1.2 must not start until this stage is applied and verified (see phase-1-1-rmm.md prerequisites).
```

- [x] **D.1** — Inserted owner line (Hassan).

### Task D.2 — Add “Subphase 1.1.2 starts when” definition to phase-1-1-rmm.md

**File:** `docs/05-project-management/phase-1-1-rmm.md`

**Location:** In Subphase 1.1.2 header, after the existing “Prerequisites” line. Change or add so it reads:

```markdown
**Prerequisites:** ✅ Subphase 1.1.1 complete | ✅ Seed migration `seed_1_1_2_rmm` applied and verified (owner: see [Seed Data Playbook](./planning/seed-data-playbook.md#stage-seed_1_1_2_rmm-subphase-112)). **Subphase 1.1.2 starts when:** Subphase 1.1.1 is complete and `seed_1_1_2_rmm` has been applied and verified.
```

- [x] **D.2** — Updated prerequisites and added “starts when” sentence (adjust playbook anchor if needed).

### Task D.3 — Seed gate in pre-flight checklist

Covered in Phase G (pre-flight checklist includes seed).

- [x] **D.3** — Confirmed seed gate is in pre-flight (Phase G.1 will include it).

---

## Phase E: Business logic alignment in task files

**Goal:** Ensure each business-logic–sensitive task file explicitly references BUSINESS-LOGIC.md so implementation and review stay aligned.

### Task E.1 — Add BUSINESS-LOGIC reference line to 1.1.2.13, 1.1.2.14, 1.1.2.15

**Files:**
- `docs/05-project-management/phase-1-1-rmm/tasks/backend/1.1.2.13-cascade-deactivation-logic.md`
- `docs/05-project-management/phase-1-1-rmm/tasks/backend/1.1.2.14-soft-delete-safeguards.md`
- `docs/05-project-management/phase-1-1-rmm/tasks/backend/1.1.2.15-two-person-rule.md`

**Edit:** In each file, add a short “Business logic” line in the **Implementation Task** section (e.g. after “Task 1.1.2.X” heading or in “Implementation Notes” / “Acceptance Criteria”). Use this pattern:

- **1.1.2.13:**  
  `**Business logic:** Cascade deactivation per [BUSINESS-LOGIC.md](../../../../BUSINESS-LOGIC.md) (deletion, impact).`
- **1.1.2.14:**  
  `**Business logic:** Soft delete safeguards per [BUSINESS-LOGIC.md](../../../../BUSINESS-LOGIC.md) (deletion, justification min 50 chars, confirmation).`
- **1.1.2.15:**  
  `**Business logic:** Two-person rule per [BUSINESS-LOGIC.md](../../../../BUSINESS-LOGIC.md) §3 — four critical actions require Tier 1 approval + Tier 2 Officer confirmation.`

- [x] **E.1.1** — 1.1.2.13 updated.
- [x] **E.1.2** — 1.1.2.14 updated.
- [x] **E.1.3** — 1.1.2.15 updated.

### Task E.2 — Add BUSINESS-LOGIC reference line to 1.1.2.31–1.1.2.36

**Files:**
- `1.1.2.31-enforcement-submit-for-review.md`
- `1.1.2.32-enforcement-review-action.md`
- `1.1.2.33-enforcement-approve-action.md`
- `1.1.2.34-enforcement-execute-action.md`
- `1.1.2.35-enforcement-appeal-action.md`
- `1.1.2.36-enforcement-resolve-appeal.md`

**Edit:** In each file, in the Implementation Task section, add:

`**Business logic:** [Brief description] per [BUSINESS-LOGIC.md](../../../../BUSINESS-LOGIC.md) (enforcement types, Tier 1 justification min 50 chars, 30-day appeal, 14 business days Tier 1 review).`

Adjust “[Brief description]” per task (e.g. “Submit for review”, “Appeal action”, “Resolve appeal”).

- [x] **E.2.1** — 1.1.2.31 updated.
- [x] **E.2.2** — 1.1.2.32 updated.
- [x] **E.2.3** — 1.1.2.33 updated.
- [x] **E.2.4** — 1.1.2.34 updated.
- [x] **E.2.5** — 1.1.2.35 updated.
- [x] **E.2.6** — 1.1.2.36 updated.

### Task E.3 — Add BUSINESS-LOGIC reference line to 1.1.2.41, 1.1.2.43, 1.1.2.44

**Files:**
- `docs/05-project-management/phase-1-1-rmm/tasks/frontend/1.1.2.41-pending-approvals-page.md`
- `docs/05-project-management/phase-1-1-rmm/tasks/frontend/1.1.2.43-appeal-review-interface.md`
- `docs/05-project-management/phase-1-1-rmm/tasks/frontend/1.1.2.44-appeal-submission-form.md`

**Edit:** In each file, in the Implementation Task section (or Quick Reference), add:

- **1.1.2.41:**  
  `**Business logic:** Pending approvals (two-person rule) per [BUSINESS-LOGIC.md](../../../../BUSINESS-LOGIC.md) §3.`
- **1.1.2.43:**  
  `**Business logic:** Appeal review (Tier 1, 14 business days) per [BUSINESS-LOGIC.md](../../../../BUSINESS-LOGIC.md) §8.`
- **1.1.2.44:**  
  `**Business logic:** Appeal submission (30-day window from execution) per [BUSINESS-LOGIC.md](../../../../BUSINESS-LOGIC.md) §8.`

- [x] **E.3.1** — 1.1.2.41 updated.
- [x] **E.3.2** — 1.1.2.43 updated.
- [x] **E.3.3** — 1.1.2.44 updated.

---

## Phase F: Naming

**Goal:** Avoid confusion between task 1.1.2.18 (Company detail) and 1.1.2.18a (Company products page).

### Task F.1 — Add “Naming: 1.1.2.18 vs 1.1.2.18a” note to Subphase 1.1.2

**File:** `docs/05-project-management/phase-1-1-rmm.md`

**Location:** In the “Company Management” frontend section, immediately before or after the line for “Task 1.1.2.18a: Implement Company products page”. Add a short note:

```markdown
**Naming:** 1.1.2.18 = Company **detail** page; 1.1.2.18a = Company **products** page (Products tab on detail). Task 1.1.2.18a depends on 1.1.2.18.
```

- ~~**F.1**~~ — Inserted naming note in Company Management frontend section.

---

## Phase G: Pre-flight checklist

**Goal:** One checklist at Subphase 1.1.2 kickoff so prerequisites, ownership, and process are confirmed.

### Task G.1 — Add “Subphase 1.1.2 pre-flight checklist” section to phase-1-1-rmm.md

**File:** `docs/05-project-management/phase-1-1-rmm.md`

**Location:** After the Subphase 1.1.2 header block (after “Role mapping…” and before the ownership/verification/batching notes added in Phases A–C). If you have already added A–C, place the pre-flight checklist after “PR grouping” (C.2) and before “### RMM Backend Tasks”.

**Add:**

```markdown
**Subphase 1.1.2 pre-flight checklist (complete before starting implementation):**
- [ ] Subphase 1.1.1 complete (per phase doc).
- [ ] Seed: `seed_1_1_2_rmm` applied and verified (owner: see [Seed Data Playbook](./planning/seed-data-playbook.md#stage-seed_1_1_2_rmm-subphase-112)).
- [ ] [BUSINESS-LOGIC.md](../BUSINESS-LOGIC.md) and [Compliance Rules](./standards/compliance-rules.md) read by all implementers.
- [ ] Implementation owners assigned and documented (see table above).
- [ ] Sami’s approval process agreed (per-task vs per-area/PR; backup if absent).
- [ ] Backend order (1.1.2.6–12, 13–15, 31–36) confirmed in task files.
- [ ] Verification batching approach agreed (by area; document refs per area).
- [ ] Compliance batching approach agreed (per area/PR; backup reviewer).
```

- [x] **G.1** — Inserted pre-flight checklist; anchors used for Seed Data Playbook and Compliance Rules.

---

## Execution order (recommended)

1. **Phase A** (ownership table + verification note) — so the phase doc has owners and verification clarity.
2. **Phase B** (compliance batching + approval process) — so compliance-rules and phase doc align.
3. **Phase C** (verification + PR batching) — so batching is documented.
4. **Phase D** (seed owner + “starts when”) — so seed gate is clear.
5. **Phase F** (naming note) — quick win in phase doc.
6. **Phase G** (pre-flight checklist) — so kickoff has one place to check.
7. **Phase E** (task file BUSINESS-LOGIC lines) — can be done in parallel or after phase doc updates.

---

## Document change summary

| Document | Changes |
|----------|---------|
| **phase-1-1-rmm.md** | Ownership table (A); verification note (A); compliance batching (B.1); verification batching (C.1); PR grouping (C.2); seed “starts when” (D.2); naming note (F.1); pre-flight checklist (G.1). |
| **compliance-rules.md** | New “Approval process” subsection: batch, definition of done, backup reviewer (B.2). |
| **seed-data-playbook.md** | Owner for `seed_1_1_2_rmm` stage (D.1). |
| **phase-1-1-rmm/tasks/backend/** | BUSINESS-LOGIC reference line in 1.1.2.13, 1.1.2.14, 1.1.2.15, 1.1.2.31–36 (E.1, E.2). |
| **phase-1-1-rmm/tasks/frontend/** | BUSINESS-LOGIC reference line in 1.1.2.41, 1.1.2.43, 1.1.2.44 (E.3). |

---

**Last updated:** 2026-01-29  
**Maintainer:** Yasmine (Project Manager) / team
