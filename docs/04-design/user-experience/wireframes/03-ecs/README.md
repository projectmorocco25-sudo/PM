# ECS Module Wireframes

**Subphase:** 0.5.4 - ECS Module Wireframes  
**Duration:** Days 9-10  
**Status:** ⚪ Not Started  
**Owner:** Emma (UI/UX + Next.js Frontend Specialist)

## Overview

Export Control System (ECS) module wireframes cover export requests, authorizations, completion reporting, and replenishment schedule tracking.

## Wireframe List

### ECS Overview
- [ ] **Task 0.5.4.0:** ECS overview page (module summary, export requests overview, authorization status, quick links)

### Export Request Wireframes
- [ ] **Task 0.5.4.1:** Export requests list page (my requests, pending approvals for MOH, status filters)
- [ ] **Task 0.5.4.2:** Export request form (SKU selection, destination, timeline, documentation upload, file upload component)
- [ ] **Task 0.5.4.3:** Export request detail page (request data, evaluation status, threshold comparison card: current stock vs VCI threshold vs ECS threshold)
- [ ] **Task 0.5.4.4:** Export workflow actions (submit, verify, approve, reject, intervene buttons - role-based, intervention window indicator)

### Authorization Wireframes
- [ ] **Task 0.5.4.5:** Export authorizations list page (active authorizations, expired authorizations, validity filters)
- [ ] **Task 0.5.4.6:** Export authorization detail page (authorization details, validity period indicator, 90-day countdown, expiration warnings, threshold status)
- [ ] **Task 0.5.4.7:** Export completion reporting interface (completion form, actual export details, shipping info)
- [ ] **Task 0.5.4.8:** Replenishment schedule tracking interface (schedule timeline visualization, delay indicators, escalation stages)

### Historical Data Pages
- [ ] **Task 0.5.4.9:** Export history page (historical export authorizations, filterable by date/company/status, export history route)
- [ ] **Task 0.5.4.10:** Historical authorization detail page (historical authorization details, authorization history route)

## Subfolder Structure

```
03-ecs/
├── README.md (this file)
├── overview/
├── export-requests/
├── authorizations/
└── replenishment/
```

## Key Design Considerations

### Threshold Comparison
- Show three thresholds: Current Stock, VCI Threshold, ECS Threshold
- Visual comparison (bar chart or similar)
- Threshold switching indicator when authorization granted

### Intervention Window
- Default 2 working days (configurable 1-5 days)
- Countdown timer indicator
- Post-approval intervention logic (24 hours after auto-approval)

### Export Authorization Validity
- 90 calendar days from authorization date
- Countdown timer with expiration warnings (30, 15, 7 days before)
- Extension request interface (up to 30 additional days)

### Replenishment Tracking
- Timeline visualization
- Delay escalation stages:
  - Day 1: Alerts
  - Days 2-7: Warnings
  - Days 8-14: Escalation
  - 15+: Critical

### File Upload
- Documentation upload component
- File type validation
- Progress indicator
- Security validation (virus scanning reference)

## Related Routes

See [Routing Structure](../../../../02-architecture/frontend/routing-structure.md) for ECS routes:
- `/ecs` - ECS overview
- `/ecs/export-requests` - Export requests list
- `/ecs/export-requests/[id]` - Export request detail
- `/ecs/authorizations` - Export authorizations list
- `/ecs/authorizations/[id]` - Export authorization detail
- `/ecs/replenishment` - Replenishment schedule tracking

## Design System References

- [File Upload Security](../../../../02-architecture/security/file-upload-storage-security.md) - File upload requirements
- [Form Design Patterns](../../../../02-architecture/frontend/form-design-patterns.md) - Form validation
- [UI Component Specifications](../../../../02-architecture/frontend/ui-component-specifications.md) - Timelines, countdowns

---

**Next:** Complete overview → export requests → authorizations → replenishment → historical data

