# VCI Module Wireframes

**Subphase:** 0.5.3 - VCI Module Wireframes  
**Duration:** Days 6-8  
**Status:** ⚪ Not Started  
**Owner:** Emma (UI/UX + Next.js Frontend Specialist)

## Overview

Value Chain Intelligence (VCI) module wireframes cover AAMS, MSQ, and WSL submissions, compliance violation detection and analysis, governance dashboard, and analytics/treemaps.

## Wireframe List

### VCI Overview
- [ ] **Task 0.5.3.0:** VCI overview page (module summary, submission overview, compliance violation alerts, quick links)

### AAMS Wireframes
- [ ] **Task 0.5.3.1:** AAMS submissions list page (my submissions, all submissions for MOH, year filter, status filter)
- [ ] **Task 0.5.3.2:** AAMS submission form (year selection, **SKU selector + quantity input only** - simplified submission structure)
- [ ] **Task 0.5.3.3:** AAMS submission detail page (submission data, calculated threshold display, workflow status, threshold visibility timing)
- [ ] **Task 0.5.3.4:** Threshold management page (MOH Tier 1 - threshold list, filters, bulk actions, modification interface)
- [ ] **Task 0.5.3.5:** Threshold detail page (threshold information, modification history, related thresholds, thresholds/[id] route)
- [ ] **Task 0.5.3.6:** Threshold modification modal (local vs global selector, B multiplier input, advisory suggestions)

### MSQ Wireframes
- [ ] **Task 0.5.3.7:** MSQ submissions list page (my submissions, flagged for review for MOH, month filter)
- [ ] **Task 0.5.3.8:** MSQ submission form (month selection, **SKU_ID + Quantity data entry only** - simplified submission structure)
- [ ] **Task 0.5.3.9:** MSQ submission detail page (submission data, validation status indicator, review actions, 7-day grace period indicator)
- [ ] **Task 0.5.3.10:** MSQ correction interface (editable submitted data, grace period countdown, correction form)

### WSL Wireframes
- [x] **Task 0.5.3.19:** WSL submissions list page (my submissions, all submissions for MOH, week filter, deadline indicators) - [Wireframe](wsl/task-0.5.3.19-wsl-submissions-list.md)
- [x] **Task 0.5.3.20:** WSL submission form (week ending date, **all SKUs with stock quantity entry** - SKU_ID + Quantity structure, threshold, threshold compliance %, replenishment date, compliance violation reason) - [Wireframe](wsl/task-0.5.3.20-wsl-submission-form.md)
- [x] **Task 0.5.3.13:** WSL submission detail page (submission data, compliance violation indicators, stock level visualization) - [Wireframe](wsl/task-0.5.3.13-wsl-submission-detail.md)

### Compliance Violation Wireframes
- [ ] **Task 0.5.3.14:** Compliance Violations list page (active compliance violations, resolved compliance violations, priority/company/SKU filters, date range)
- [ ] **Task 0.5.3.15:** Compliance Violation detail page (compliance violation information, stock level vs threshold comparison, reason, replenishment date, priority indicator)
- [ ] **Task 0.5.3.16:** Compliance Violation analysis interface (Tier 2 - analysis form, action suggestions dropdown, comments, batch analysis option)
- [ ] **Task 0.5.3.17:** Compliance Violation action approval interface (Tier 1 - review suggestions, approve/reject/independent action, justification input)

### Governance Dashboard
- [ ] **Task 0.5.3.18:** Governance Dashboard (MOH - real-time stock sufficiency charts, compliance violation status overview, action recommendations, widget layout)

### VCI Treemap Analytics (Tier 1 & Tier 2)
- [ ] **Task 0.5.3.21:** ATC Treemap page (Level 1 - % total stock level compliance violations by therapeutic area/ATC code, clickable tiles, filters: critical medicines/date range)
- [ ] **Task 0.5.3.22:** Products Treemap page (Level 2 - % total stock level compliance violations by product within selected ATC, drill-down from ATC, back navigation, breadcrumbs)
- [ ] **Task 0.5.3.23:** Dosage/Forms Modal (Level 3 - table showing dosage/form with % compliance, expandable rows, modal overlay, no route change)
- [ ] **Task 0.5.3.24:** SKU List expanded view (Level 4 - SKUs with compliance violation status, external link icon indicating opens in new tab, info message, modal stays open)
- [ ] **Task 0.5.3.25:** SKU Action Page integration (Level 5 - uses existing SKU detail route, opens in new tab, role-based actions for Tier 1/Tier 2, query params for back navigation)

### Historical Data Pages
- [ ] **Task 0.5.3.19:** Submission history page (all past submissions, filterable by type/year/company, submission history route)
- [ ] **Task 0.5.3.20:** Submission trends analysis page (MOH only - trend analysis charts, multi-year comparisons, submission trends route)

## Subfolder Structure

```
02-vci/
├── README.md (this file)
├── overview/
├── aams/
├── msq/
├── wsl/
├── breaches/
├── governance-dashboard/
└── analytics/
```

## Key Design Considerations

### Submission Structure

#### AAMS Submission Structure
- **Monthly Sales Breakdown:** Table with columns: SKU, Product Description (Name/Dosage/Form), Jan, Feb, ..., Dec, AAMS (calculated)
- **Monthly Fields:** Quantity of sales for each month (number input, default blank, required)
- **AAMS Field:** Read-only, automatically calculated from sum of 12 months
- **Validation:** All fields must be filled before submission
- **Draft Support:** Can save drafts with partial data
- **Import/Export:** CSV import/export functionality
- **SKU Selector:** Searchable dropdown, auto-fills product description

#### MSQ/WSL Submission Structure
- **Simplified Structure:** `{sku_id, quantity}` array structure (NOT monthly breakdown)
- SKU selector shows full description: name, dosage, form, pack size
- Quantity input shows unit_of_measure from selected SKU

### Threshold Visibility
- Companies see calculated threshold after Tier 2 verification but before Tier 1 approval
- Threshold modification (MOH Tier 1 only) with advisory suggestions

### Deadline Indicators
- AAMS: January 31 deadline, 15-day grace period (until February 15)
- WSL: Friday 5 PM deadline, submission window Monday-Friday 17:00
- MSQ: 7-day grace period for corrections

### Compliance Violation Detection
- Automatic compliance violation creation on WSL submission
- Priority indicators (critical medicines, multiple SKUs, extended compliance violations)
- Batch analysis capability for Tier 2

## Related Routes

See [Routing Structure](../../../../02-architecture/frontend/routing-structure.md) for VCI routes:
- `/vci` - VCI overview
- `/vci/aams` - AAMS submissions
- `/vci/msq` - MSQ submissions
- `/vci/wsl` - WSL submissions
- `/vci/compliance-violations` - Compliance Violations list
- `/vci/governance` - Governance dashboard (MOH)
- `/vci/submissions/history` - Submission history
- `/vci/submissions/history/trends` - Trends analysis (MOH Tier 1)

## Design System References

- [Form Design Patterns](../../../../02-architecture/frontend/form-design-patterns.md) - Bulk upload, data entry tables
- [UI Component Specifications](../../../../02-architecture/frontend/ui-component-specifications.md) - Charts, dashboards, tables
- [Historical Data Routing Proposal](../../../../02-architecture/frontend/historical-data-routing-proposal.md)

---

**Next:** Complete overview → AAMS → MSQ → WSL → compliance violations → governance dashboard → analytics

