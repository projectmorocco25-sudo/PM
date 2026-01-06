# CMC Module Wireframes

**Subphase:** 0.5.5 - CMC Module Wireframes  
**Duration:** Days 11-12  
**Status:** ⚪ Not Started  
**Owner:** Emma (UI/UX + Next.js Frontend Specialist)

## Overview

Compliance Monitoring Center (CMC) module wireframes cover compliance scores, disputes, reports, leaderboard, and score review/override interfaces.

## Wireframe List

### CMC Overview
- [ ] **Task 0.5.5.0:** CMC overview page (module summary, compliance overview, score trends, quick links)

### Score Wireframes
- [ ] **Task 0.5.5.1:** Compliance scores list page (my score for companies, all scores for MOH, period filter)
- [ ] **Task 0.5.5.2:** Compliance score detail page (total score visualization, component breakdown chart/gauge, category-level tips for companies, formulas/weights hidden)
- [ ] **Task 0.5.5.3:** Leaderboard page (anonymized for companies - percentile/rank band, full for Tier 1, oversight for Tier 2)
- [ ] **Task 0.5.5.4:** Score review - Tier 2 flag anomalies modal (quick action, contextual to score detail, flag anomalies interface)
- [ ] **Task 0.5.5.5:** Score review - Tier 1 override modal (justification input, quick action, contextual to score detail)

### Dispute Wireframes
- [ ] **Task 0.5.5.6:** Disputes list page (my disputes for companies, all disputes for MOH, status filters, date filters)
- [ ] **Task 0.5.5.7:** Dispute detail page (dispute information, evidence display, review status, dispute details route)
- [ ] **Task 0.5.5.8:** Dispute creation interface (companies - 30-day window indicator, dispute form, component selection, evidence upload)
- [ ] **Task 0.5.5.9:** Dispute review interface (Tier 2 - review, Tier 1 - resolution with adjustment notes, dispute details)

### Report Wireframes
- [ ] **Task 0.5.5.10:** Reports list page (report types, status, download actions, period filters)
- [ ] **Task 0.5.5.11:** Report detail page (PDF viewer, data tables, charts, download action)
- [ ] **Task 0.5.5.12:** Report review/approval interface (Tier 2 review checklist, Tier 1 approval actions)

### Historical Data Pages
- [ ] **Task 0.5.5.13:** Compliance scores history page (historical compliance scores, filterable by date/company, scores history route)
- [ ] **Task 0.5.5.14:** Disputes history page (historical disputes, filterable by date/company/status, disputes history route)

## Subfolder Structure

```
04-cmc/
├── README.md (this file)
├── overview/
├── scores/
├── disputes/
└── reports/
```

## Key Design Considerations

### Score Visibility Rules
- **Companies:** See exact total score + category-level tips (formulas/weights hidden to prevent gaming)
- **MOH Tier 1:** See full scores, formulas, weights, component breakdown
- **MOH Tier 2:** See oversight view (anonymized or full depending on permission)

### Leaderboard
- **Companies:** Anonymized - percentile/rank band only (e.g., "Top 25%")
- **MOH Tier 1:** Full leaderboard with company names
- **MOH Tier 2:** Oversight view (anonymized or full based on permission)

### Score Components
- Regulatory Reporting Compliance Rate (12-month rolling window)
- Stock Threshold Violation Frequency (6-month rolling average)
- Replenishment Plan Adherence (if ECS active)
- Aggregate Non-Compliance Exposure (12-month SKU-days)
- Data Quality Signals
- Critical Medicine Coverage
- Export Compliance (if ECS active)

**Component Weights:** See [CMC Component Weights](../../../../02-architecture/modules/cmc-component-weights.md) for default weights and rationale.

### Dispute Window
- 30-day window from score publication date
- Scores marked "Under Dispute" but remain visible during review
- Evidence upload required

### Report Workflow
- Monthly, quarterly, annual templates
- Tier 2 reviews for completeness
- Tier 1 approves release
- PDF viewer with charts and data tables

## Related Routes

See [Routing Structure](../../../../02-architecture/frontend/routing-structure.md) for CMC routes:
- `/cmc` - CMC overview
- `/cmc/scores` - Compliance scores list
- `/cmc/scores/[id]` - Score detail
- `/cmc/leaderboard` - Leaderboard
- `/cmc/disputes` - Disputes list
- `/cmc/disputes/[id]` - Dispute detail
- `/cmc/reports` - Reports list
- `/cmc/reports/[id]` - Report detail

## Design System References

- [UI Component Specifications](../../../../02-architecture/frontend/ui-component-specifications.md) - Charts, gauges, visualizations
- [Role-Based UI Patterns](../../../../02-architecture/frontend/role-based-ui-patterns.md) - Score visibility rules
- [Form Design Patterns](../../../../02-architecture/frontend/form-design-patterns.md) - Dispute forms

---

**Next:** Complete overview → scores → disputes → reports → historical data

