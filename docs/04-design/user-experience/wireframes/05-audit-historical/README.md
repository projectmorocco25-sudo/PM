# Audit & Historical Data Wireframes

**Subphase:** 0.5.6 - Audit & Historical Data Wireframes  
**Duration:** Days 12-13  
**Status:** ⚪ Not Started  
**Owner:** Emma (UI/UX + Next.js Frontend Specialist)

## Overview

Audit and historical data wireframes cover audit logs (MOH/Auditors only), audit reports, and historical data access patterns.

## Wireframe List

### Audit Pages (MOH/Auditors Only)
- [ ] **Task 0.5.6.1:** Audit logs list page (audit log entries, filters: date range/table/user/action, search, pagination, virtual scrolling)
- [ ] **Task 0.5.6.2:** Audit log detail page (log entry details, related changes, user information, timestamp, audit log detail route)
- [ ] **Task 0.5.6.3:** Audit reports page (audit report list, report types, date range filters, download actions, audit reports route)

## Subfolder Structure

```
05-audit-historical/
├── README.md (this file)
├── audit-logs/
└── historical-data/
```

## Key Design Considerations

### Audit Log Access
- **MOH Tier 1/2:** Full access to all audit logs
- **Auditors:** Full access (read-only)
- **Companies:** Access only to own company's audit logs (if permitted)

### Historical Data Access
- Based on data existence and permissions, NOT module activation status
- All historical data is read-only (immutable for regulatory compliance)
- 7-year data retention requirement supported
- History tabs on detail pages (contextual access)
- Filtered list views with date/year parameters
- Dedicated history routes for comprehensive views

### Virtual Scrolling
- Required for audit logs (potentially thousands of entries)
- Use @tanstack/react-virtual for performance
- Pagination or infinite scroll

### Date Range Filters
- Quick filters: Last 7 days, 30 days, 3 months, year, 7 years, custom range
- Morocco timezone support
- DateRangePicker component

## Related Routes

See [Routing Structure](../../../../02-architecture/frontend/routing-structure.md) for audit/historical routes:
- `/audit/logs` - Audit logs list (MOH/Auditors only)
- `/audit/logs/[id]` - Audit log detail
- `/audit/reports` - Audit reports (MOH/Auditors only)
- `/history` - History overview (role-based)

## Design System References

- [Historical Data Routing Proposal](../../../../02-architecture/frontend/historical-data-routing-proposal.md) - Complete historical data patterns
- [UI Component Specifications](../../../../02-architecture/frontend/ui-component-specifications.md) - Timeline, DateRangePicker, virtual scrolling
- [Role-Based UI Patterns](../../../../02-architecture/frontend/role-based-ui-patterns.md) - Access control

---

**Next:** Complete audit logs → audit reports → historical data patterns

