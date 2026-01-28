# Business Logic – Pharmaceutical Governance Value Chain Platform (PM)

**Purpose:** A concise, accurate reference for the platform’s business rules.  
**Source:** Synthesized from `/docs` (overview, requirements, architecture, governance, design, project management).  
**Audience:** Product, development, QA, and stakeholders who need a single place to understand *what* the system does and *why*.

---

## 1. What the Platform Is

- **Client:** Ministry of Health (MOH), Morocco.  
- **Goal:** Secure digital portal for governance, oversight, and regulatory compliance across Morocco’s pharmaceutical value chain.  
- **Users:** Industrial Pharmaceutical Companies (IPCs), wholesalers, MOH Directorate of Medicines and Pharmacy (DMP) staff, auditors.  
- **Important:** The platform tracks **stock levels and quantities only**. All “sales” data (AAMS, MSQ, XAMS) means **quantities of units sold**, not prices, revenue, or any financial values. This is a **stock sufficiency and regulatory compliance** system, not a financial system.

---

## 2. Modules and How They Depend on Each Other

| Module | Full Name | Type | Purpose |
|--------|-----------|------|---------|
| **RMM** | Registry Management Module | Core (always on) | Authoritative registry: companies, products, SKUs, ATC codes, critical medicine designations. |
| **VCI** | Value Chain Intelligence | Core (always on) | Submissions (AAMS, MSQ, WSL), thresholds, breach detection, governance dashboard. |
| **ECS** | Export Control System | Optional | Export authorization requests; protects national stock sufficiency. |
| **CMC** | Compliance Monitoring Center | Optional | Compliance scores (0–100), disputes, regulatory reports. |

**Activation order:** RMM → VCI → (ECS) → (CMC).  
**Dependencies:** VCI needs RMM. ECS needs RMM + VCI (uses MSQ for XAMS). CMC needs RMM + VCI; when ECS is on, CMC also uses export compliance in scoring.

---

## 3. User Roles and Authority (Summary)

- **Company Admin:** Submit registry updates (company + products).  
- **Company Manager / User:** Manage products/SKUs; submit AAMS, MSQ, WSL; (IPC only) submit export requests when ECS is on.  
- **MOH DMP Tier 1:** Approver/Admin – approve submissions, configure thresholds, enforce compliance, suspend/delete companies, deactivate/delete products. All Tier 1 enforcement actions require **mandatory justification** (min 50 characters), logged in audit.  
- **MOH DMP Tier 2 Officer:** Verify submissions, flag non-compliance, analyze breaches, suggest actions; for MOH-originated registry changes, peer review by another Tier 2 before Tier 1 approval.  
- **MOH DMP Tier 2 Registrar:** Implement **approved** registry changes (create/update/delete) and confirm completion to Tier 1.  
- **Auditor:** Read-only (audit logs, compliance reports).  
- **Two-person rule:** Company suspension, company deletion, product deactivation (critical medicines), and product deletion require **Tier 1 approval + Tier 2 Officer confirmation** before execution.

---

## 4. Registry Management Module (RMM)

### 4.1 Scope and Integrity

- **Entities:** Companies, Products, SKUs, ATC codes, critical medicine designations.  
- **Rules:** Products belong to companies; SKUs belong to products. When a company is deactivated or deleted, its products and SKUs cascade to deactivated status (historical data kept for compliance).  
- **MOH-controlled (read-only for companies):** ATC codes, critical medicine designations.

### 4.2 Approval Chains

- **Company-originated:** Company Admin/Manager submits → Tier 2 verifies → Tier 1 approves → Tier 2 Registrar implements → system confirms to Tier 1.  
- **MOH-originated:** Tier 2 submits → **another** Tier 2 peer reviews → Tier 1 approves → Tier 2 Registrar implements → system confirms.  
- **Timeframes (typical):** Verification 2–3 working days, approval 2 working days, implementation 1 working day.

### 4.3 Deletion and Safeguards

- Deletion requests go through the same approval chain (submit → verify → approve → implement).  
- **Deletion requests must include:** explicit confirmation, mandatory justification (reason, min 50 characters).  
- Enhanced approval and impact warnings apply; deletion requests may have a pending period before permanent removal so Tier 1 can reverse if needed.  
- **Critical actions (two-person rule):** company suspension, company deletion, product deactivation for critical medicines, product deletion — Tier 1 approval **plus** Tier 2 Officer confirmation before execution.  
- All registry activity is fully audited.

---

## 5. Value Chain Intelligence (VCI)

### 5.1 Data Types (All Quantity-Based)

- **AAMS (Annual Average Monthly Sales):** Average monthly **quantity** of units sold over the previous calendar year. Submitted once per year.  
- **MSQ (Monthly Sales Quantities):** Actual **quantities** sold per month.  
- **WSL (Weekly Stock Levels):** Current **stock quantities** per SKU (all SKUs in one submission).  
- **VCI Threshold:** Minimum stock quantity per SKU = multiplier × AAMS (default multiplier 3 for standard products, 3.5 for critical medicines; Tier 1 can change).

### 5.2 AAMS

- **Deadline:** January 31 of the year following the reporting year (Jan–Dec).  
- **Grace period:** Feb 1–15 — accepted, marked “late,” no penalty.  
- **After Feb 15:** Non-compliant; alerts and compliance impact.  
- **After Mar 1 (e.g. never submitted):** System may use prior year’s AAMS if available (threshold marked “Using Previous Year AAMS - Submission Overdue”); otherwise Tier 1 sets manual threshold or industry average.  
- **Workflow:** Company submits → Tier 2 verifies and calculates VCI threshold → Tier 1 approves threshold. Companies can see the calculated threshold after Tier 2 verification but before Tier 1 approval.  
- **Threshold changes:** Tier 1 only; can be permanent or temporary (with auto-revert or manual-review reversion). All threshold changes are **non-retroactive** (future calculations only).

### 5.3 MSQ

- Submitted monthly; automated validation (completeness, format, history).  
- **Anomaly check:** If 12-month average MSQ differs from AAMS by more than 20% (configurable), submission is flagged for Tier 2 review — not blocked.  
- **AAMS and MSQ are independent:** AAMS is never derived from MSQ; MSQ is not used to compute or validate AAMS.  
- **Correction:** 7-day grace period to correct after initial submission.  
- MSQ feeds ECS **XAMS** (X-month rolling average, default X = 6, configurable 3–12 months) when ECS is active.

### 5.4 WSL

- **Deadline:** Friday EOD (week ending that Friday); window Monday–Friday 17:00 Morocco time.  
- **Late:** After Friday EOD but before Monday EOD — accepted, marked late; impacts compliance.  
- **Non-compliant:** After Monday EOD — flagged; can trigger threshold violation alerts.  
- Must include **all SKUs** in a single submission.  
- When stock &lt; VCI threshold, company must provide breach reason and replenishment date; Tier 2 analyzes (standard: 3 working days; critical: 1 working day). Tier 2 suggests actions; Tier 1 approves, rejects with feedback, or acts independently. Max 2 rejection iterations before Tier 1 must take direct action.

### 5.5 Breach Handling

- Tier 2 analyzes and suggests from a standard list (e.g. warnings, replenishment/production plans, enhanced monitoring, escalation).  
- Tier 1 reviews all suggestions and can approve, reject with feedback, or take any other action.  
- Critical medicine breaches get higher-priority alerts and faster escalation.

---

## 6. Export Control System (ECS) – Optional

- **Who:** IPCs only (not wholesalers).  
- **Flow:** Company submits export request → system applies **conditional validation** (when CMC is on: compliance score & risk) → auto-approval queue or Tier 2 verification or full manual review → Tier 1 can intervene in an **intervention window** (default 2 working days, configurable 1–5) → if no intervention, auto-approval.  
- **Conditional validation (when CMC active):** Score &lt; 60 or multiple risk factors → full manual review; 60–74 → Tier 2 verification before auto-approval; ≥ 75 → standard auto-approval. If CMC is inactive, standard auto-approval applies.  
- **ECS Threshold:** multiplier × **XAMS** (X months average monthly sales **quantities**; default X = 6, configurable 3–12). Minimum 3 months of data for XAMS.  
- **Authorization:** Valid **90 calendar days**. Reminders at 30, 15, 7 days before expiry; expired authorizations are revoked; extensions (up to 30 extra days) require Tier 1 approval.  
- **Threshold switching:** When an export is **authorized**, that SKU’s weekly stock threshold **switches from VCI threshold to ECS threshold** for **3 calendar months** from authorization date, then reverts automatically to VCI. On cancel/revoke, reversion is immediate.  
- **Completion:** Company must report export completion within 7 days (date, quantities, shipping, destination). Replenishment delays trigger escalation (alerts, reminders, possible suspension of export privileges).  
- All export actions are audited.

---

## 7. Compliance Monitoring Center (CMC) – Optional

- **Score:** Monthly compliance score 0–100; weighted mix of: reporting compliance, threshold violation frequency, replenishment adherence (when ECS on), non-compliance exposure, data quality, critical medicine coverage, export compliance (when ECS on). Weights configurable by Tier 1.  
- **When calculated:** Scheduled monthly + event-triggered (e.g. high/critical breach, enforcement action, ECS export authorization, non-compliance case opened).  
- **Visibility:** Companies see their own score, category-level improvement tips (not formulas/weights), and anonymized standing. Tier 1 sees full leaderboard; Tier 2 sees scores for oversight; auditors read-only.  
- **Disputes:** Company can dispute within **30 days** of publication; score stays visible but marked “Under Dispute.” Tier 2 reviews and forwards to Tier 1; Tier 1 decides. If upheld, Tier 1 adds an **adjustment note** (original snapshot preserved).  
- **Reports:** Automated regulatory reports (monthly/quarterly/annual); Tier 2 reviews drafts, Tier 1 approves release.  
- Scores are frozen snapshots; corrections are via adjustment notes, not rewriting history.

---

## 8. Enforcement (Warnings, Fines, Suspensions)

- **Types:** Warning (Tier 2 can approve alone), Fine (Tier 1 approval), Suspension (Tier 1 approval).  
- **Flow:** Tier 2 creates → Tier 2 review → Tier 1 approval (for fines/suspensions) → Tier 1 or Tier 2 executes → **30-day appeal window** from execution.  
- **Appeal:** Company submits appeal within 30 days; Tier 1 reviews (e.g. within 14 business days). Decisions: uphold, uphold with adjustment note, or overturn (reverses compliance score impact).  
- All enforcement actions require justification and are logged; they affect compliance scores.

---

## 9. Communications and Audit

- **In-system communications:** Company ↔ MOH (direct messages, workflow-related). Messages are immutable (no deletion, only archival); 7-year retention; full audit trail.  
- **Audit:** All business and security-relevant actions are logged and retained at least **7 years**. Operational data (AAMS, MSQ, WSL, export authorizations, compliance scores) retained at least 7 years; older data may be archived but must remain accessible for regulatory review.

---

## 10. Key Deadlines and Timeframes (Summary)

| Item | Deadline / Timeframe |
|------|----------------------|
| AAMS submission | Jan 31 (grace to Feb 15 = late; after Feb 15 = non-compliant) |
| MSQ correction | 7 calendar days after initial submission |
| WSL submission | Friday EOD (late until Monday EOD) |
| Breach analysis | 3 working days (standard), 1 working day (critical) |
| Export authorization | Valid 90 calendar days; report completion within 7 days |
| CMC dispute | Within 30 days of score publication |
| Enforcement appeal | Within 30 days of execution |
| Data retention | Minimum 7 years (audit + operational data) |

---

## 11. References

- **Full project brief:** [00-overview/Project Brief – PM.md](00-overview/Project%20Brief%20–%20PM.md)  
- **Governance workflows:** [03-governance/governance-workflows.md](03-governance/governance-workflows.md)  
- **Approvals matrix:** [03-governance/approvals-authority-matrix.md](03-governance/approvals-authority-matrix.md)  
- **Workflow states & RPCs:** [02-architecture/workflow-architecture.md](02-architecture/workflow-architecture.md)  
- **Enforcement cycle:** [03-governance/enforcement-cycle-specification.md](03-governance/enforcement-cycle-specification.md)  
- **Terms:** [10-references/glossary.md](10-references/glossary.md)  
- **Acronyms:** [10-references/acronyms.md](10-references/acronyms.md)

---

*Last updated: 2026-01-28. For implementation details (APIs, schema, wireframes), use the docs under `/docs/02-architecture`, `/docs/04-design`, and `/docs/05-project-management`.*
