# Historical Data Access Routing Proposal

**Document Version:** 2.0  
**Last Updated:** 2025-12-31  
**Status:** ✅ Approved (All Reviews Complete) - **Reference Document**  
**Owner:** Oliver (Chief Architect)

> **📋 Document Purpose:** This proposal document serves as a **historical record and decision log** for the historical data routing architecture. It documents the decision-making process, specialist reviews, and approved approach.
>
> **📚 Implementation Details:** Once implemented, the actual specifications are documented in:
> - `routing-structure.md` - Route definitions and structure
> - `rpc-functions.md` - Database RPC function specifications
> - `ui-component-specifications.md` - UI component specifications
> - `role-based-ui-patterns.md` - Role-based access patterns
> - `navigation-layout-patterns.md` - Navigation structure
> - `Phase-1-Implementation-Plan.md` - Implementation tasks
>
> **💡 Why Keep This Document:** This proposal is retained as a reference for:
> - Decision rationale and context
> - Specialist review approvals (Emma, Oliver, Fatima, Dr. Samir)
> - Historical audit trail
> - Future architecture decisions
> - Troubleshooting and maintenance

---

## Executive Summary

This proposal defines the routing structure and access patterns for historical data in the PM platform. The system maintains 7 years of historical data (AAMS, MSQ, WSL, compliance scores, audit logs) but currently lacks explicit routes for accessing this information.

**Solution:** A hybrid approach combining:
1. **History tabs** on detail pages (contextual, entity-specific)
2. **Filtered list views** with date/year parameters (flexible, shareable)
3. **Dedicated history routes** for comprehensive views (audit, trends)
4. **Modal patterns** for quick previews and comparisons (complementary)

**Key Decisions:**
- Historical data accessible based on data existence and permissions, not module activation status
- All historical data is read-only (immutable for regulatory compliance)
- 7-year retention requirement supported across all routes
- Access controlled via RLS policies through RPC functions

**Review Status:** ✅ Approved by Emma (UI/UX), Oliver (Architecture), Fatima (Regulatory), Dr. Samir (Business Process)

---

## Problem Statement

The current routing structure (`routing-structure.md`) does not define explicit routes for historical data access. While the system maintains 2-3 years of active historical data (extendable to 7 years for regulatory compliance), users have no clear way to view past submissions, compliance scores, audit logs, or registry changes.

### Current Gaps

| Gap | Impact |
|-----|--------|
| No explicit historical submission routes | Users cannot view past AAMS, MSQ, WSL submissions |
| No audit log viewer route | Audit logs exist but are inaccessible via UI |
| No compliance score history route | Monthly scores exist but trends are not viewable |
| No registry change history | Company/product/SKU changes logged but not visible |
| No breach history view | Only current/active breaches are visible |

---

## Proposed Solution: Hybrid Approach

### Strategy Overview

| Strategy | Use Case | Priority | Implementation |
|----------|----------|----------|----------------|
| **History Tabs** | Entity-specific history (company, product, submission) | Primary | Add tabs to detail pages |
| **Filtered Lists** | View submissions by year/month, breaches by status | Secondary | Enhance existing list pages with query parameters |
| **Dedicated Routes** | Comprehensive views (audit logs, trends, cross-entity) | Tertiary | Create new `/history`, `/audit`, `/trends` routes |
| **Modals** | Quick previews, comparisons, export options | Quaternary | Complement pages for specific actions |

### 1. History Tabs on Detail Pages

**Purpose:** Provide contextual historical data within entity detail views.

**Implementation:**
- Add "History" tab to: Companies, Products, SKUs, Submissions, Breaches, Compliance Scores
- Lazy load tab content on click (performance)
- Show history count badge on tab (e.g., "History (24)")
- Include "View Full History" link to dedicated route

**Example Routes:**
```
/rmm/companies/[id] → Tabs: Overview | Products | History
/vci/submissions/aams/[id] → Tabs: Details | History | Corrections
/cmc/scores/[id] → Tabs: Current | History | Trends
```

### 2. Filtered List Views

**Purpose:** Enable flexible filtering of historical data on existing list pages.

**Implementation:**
- Add query parameters: `?year=2023`, `?month=6`, `?status=resolved`
- Default to current year/month (better UX than empty state)
- Quick filter chips: "This Year", "Last Year", "Last 3 Years", "All Time"
- Clear active filter state (highlighted chips/badges)

**Example Routes:**
```
/vci/submissions/aams?year=2023
/vci/submissions/msq?year=2023&month=6
/vci/breaches?status=resolved&year=2023
/cmc/scores?year=2023
```

### 3. Dedicated History Routes

**Purpose:** Provide comprehensive historical views for audit, analysis, and reporting.

**Route Structure:**
```
app/(dashboard)/
├── history/                    # Top-level role-based overview
│   └── page.tsx
├── audit/
│   ├── logs/                  # Audit log viewer (MOH/Auditors)
│   │   ├── page.tsx
│   │   └── [id]/page.tsx
│   └── reports/               # Audit reports
│       └── page.tsx
└── vci/
    └── submissions/
        └── history/
            ├── page.tsx       # All past submissions (filterable)
            └── trends/        # Trend analysis charts (MOH only)
                └── page.tsx
```

### 4. Modal Patterns

**Purpose:** Provide quick access to historical data without full page navigation.

**Use Cases:**
- ✅ Quick history preview (last 5-10 changes)
- ✅ Comparison view (current vs historical)
- ✅ Export options (with progress indicator)
- ✅ Detail inspection (from list views)
- ❌ Avoid: Full history browsing, audit log browsing, trend analysis

**Modal Sizes:**
- Quick preview: `md` or `lg`
- Comparison: `xl` or `full`
- Export: `md`
- Detail: `lg` or `xl`

---

## Routing Structure

### Detail Pages with History Tabs

```
app/(dashboard)/
├── rmm/
│   ├── companies/[id]/page.tsx        # Tabs: Overview | Products | History
│   ├── products/[id]/page.tsx         # Tabs: Overview | SKUs | History
│   └── skus/[id]/page.tsx             # Tabs: Overview | History
├── vci/
│   ├── submissions/
│   │   ├── aams/[id]/page.tsx         # Tabs: Details | History | Corrections
│   │   ├── msq/[id]/page.tsx          # Tabs: Details | History | Corrections
│   │   └── wsl/[id]/page.tsx          # Tabs: Details | History
│   └── breaches/[id]/page.tsx         # Tabs: Details | History | Analysis
└── cmc/
    └── scores/[id]/page.tsx           # Tabs: Current | History | Trends
```

### New Dedicated Routes

```
app/(dashboard)/
├── history/page.tsx                   # Role-based historical overview
├── audit/
│   ├── logs/
│   │   ├── page.tsx                   # Audit log list (MOH/Auditors)
│   │   └── [id]/page.tsx              # Audit log detail
│   └── reports/page.tsx               # Audit reports (MOH/Auditors)
└── vci/submissions/history/
    ├── page.tsx                       # All past submissions (filterable)
    └── trends/page.tsx                # Trend analysis (MOH only)
```

### Enhanced List Pages

Existing routes enhanced with query parameters:
- `/vci/submissions/aams?year=2023` - Filter by year
- `/vci/submissions/msq?year=2023&month=6` - Filter by year and month
- `/vci/breaches?status=resolved&year=2023` - Filter compliance violations by status and year
- `/cmc/scores?year=2023` - Filter scores by year
- `/rmm/companies?status=inactive` - Filter companies by status

---

## Role-Based Access Control

### Access Matrix

| User Role | Historical Submissions | Compliance Scores | Breach History | Audit Logs | Trend Analysis |
|-----------|----------------------|-------------------|----------------|------------|----------------|
| **Company User** | Own company only | Own company only | Own company only | ❌ No access | ❌ No access |
| **MOH Tier 1** | All companies | All companies | All companies | ✅ Full access | ✅ Full access |
| **MOH Tier 2** | All companies | All companies | All companies | ✅ Read-only | ✅ Read-only |
| **Auditor** | Read-only (all) | Read-only (all) | Read-only (all) | ✅ Full access | ❌ No access |

### Route Access by Role

**Company Users:**
- `/history` - Personal historical overview
- `/vci/submissions/aams?year=2023` - Own AAMS submissions
- `/cmc/scores/[company_id]` - Own score history

**MOH Tier 1:**
- `/history` - System-wide historical overview
- `/audit/logs` - Full audit log viewer
- `/vci/submissions/history` - All past submissions
- `/vci/submissions/history/trends` - Trend analysis charts
- `/cmc/scores?year=2023` - All scores for 2023

**MOH Tier 2:**
- `/history` - Oversight historical overview
- `/audit/logs` - Audit log viewer (read-only)
- `/vci/submissions/history` - All past submissions

**Auditors:**
- `/audit/logs` - Primary audit log viewer
- `/audit/reports` - Historical compliance reports
- `/audit/activity` - Activity summary

---

## Implementation Details

### Component Patterns

#### History Tab with Lazy Loading

```typescript
<TabPanel value="history">
  <Suspense fallback={<HistorySkeleton />}>
    <CompanyHistory companyId={params.id} />
  </Suspense>
</TabPanel>
```

#### Filtered List Page

```typescript
export default async function AAMSSubmissionsPage({ 
  searchParams 
}: { 
  searchParams: { year?: string; company_id?: string } 
}) {
  const year = searchParams.year 
    ? parseInt(searchParams.year) 
    : new Date().getFullYear();
  
  const { data: submissions } = await getAAMSSubmissions({ year });
  
  return (
    <div>
      <PageHeader>
        <PageTitle>AAMS Submissions</PageTitle>
        <FilterBar>
          <FilterChip active={year === currentYear}>This Year</FilterChip>
          <FilterChip active={year === currentYear - 1}>Last Year</FilterChip>
          <YearSelect value={year} onChange={handleYearChange} />
        </FilterBar>
      </PageHeader>
      <AAMSSubmissionsTable submissions={submissions} />
    </div>
  );
}
```

#### Historical Data Display by Type

| Data Type | Display Component | Features |
|-----------|------------------|----------|
| **Registry Changes** | Timeline | Date, User, Action, Old → New Value, Expandable |
| **Submissions** | Enhanced Table | Sortable, Group by year/month, Status badges, Quick actions |
| **Compliance Scores** | Chart + Table | Line chart trend, Monthly breakdown, Interactive, Export |
| **Breaches** | Filterable Table | Status tabs, Date range filter, Status indicators |
| **Audit Logs** | Virtual Scrolled List | Virtual scrolling, Debounced search, Pagination |

### Performance Optimizations

1. **Database Indexes:**
   ```sql
   CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);
   CREATE INDEX idx_aams_submissions_company_year ON aams_submissions(company_id, year DESC);
   CREATE INDEX idx_compliance_scores_company_month ON compliance_scores(company_id, score_month DESC);
   ```

2. **Caching Strategy:**
   - TanStack Query: 5-minute stale time, 30-minute cache time for historical data
   - Next.js Data Cache: 5-minute revalidation for historical routes
   - Database query cache: Automatic PostgreSQL caching

3. **Virtual Scrolling:**
   - Use `@tanstack/react-virtual` for large lists (audit logs)
   - Server-side pagination (50-100 items per page)
   - Load on scroll, not all at once

4. **Server-Side Rendering:**
   - Use Next.js Server Components for historical routes
   - Faster initial load, reduced client-side JavaScript
   - SEO-friendly for MOH public reports

### RPC Functions for Historical Data

All historical data access must go through RPC functions to ensure RLS application and audit logging:

```sql
-- Historical submissions
CREATE OR REPLACE FUNCTION vci_get_historical_submissions(
  p_submission_type TEXT,
  p_company_id UUID DEFAULT NULL,
  p_year INTEGER DEFAULT NULL,
  p_month INTEGER DEFAULT NULL,
  p_limit INTEGER DEFAULT 100,
  p_offset INTEGER DEFAULT 0
) RETURNS TABLE(...) SECURITY DEFINER;

-- Historical compliance scores
CREATE OR REPLACE FUNCTION cmc_get_historical_scores(
  p_company_id UUID DEFAULT NULL,
  p_start_date DATE DEFAULT NULL,
  p_end_date DATE DEFAULT NULL,
  p_limit INTEGER DEFAULT 100,
  p_offset INTEGER DEFAULT 0
) RETURNS TABLE(...) SECURITY DEFINER;

-- Historical audit logs (MOH/Auditors only)
CREATE OR REPLACE FUNCTION audit_get_historical_logs(
  p_table_name TEXT DEFAULT NULL,
  p_user_id UUID DEFAULT NULL,
  p_start_date TIMESTAMPTZ DEFAULT NULL,
  p_end_date TIMESTAMPTZ DEFAULT NULL,
  p_limit INTEGER DEFAULT 100,
  p_offset INTEGER DEFAULT 0
) RETURNS TABLE(...) SECURITY DEFINER;
```

---

## Specialist Reviews Summary

### Emma (UI/UX) - ✅ Approved

**Key Recommendations:**
- Lazy load history tabs for performance
- Add quick filter chips for better UX
- Use top-level `/history` route (not `/dashboard/history`)
- Implement virtual scrolling for large lists
- Add DateRangePicker component with Morocco timezone support
- Include export functionality with progress indicators
- Update navigation to include history/audit links

**Modal Patterns:**
- Use modals for quick previews, comparisons, and exports
- Always provide "View Full Page" escape hatch
- Avoid modals for full browsing or trend analysis

### Oliver (Architecture) - ✅ Approved

**Key Recommendations:**
- Add database indexes for historical queries
- Create dedicated RPC functions for historical data access
- Implement multi-layer caching (database, TanStack Query, Next.js)
- Use Server Components for historical routes
- Integrate with module activation checks
- Ensure all access goes through RPC functions (not direct table queries)

**Technical Checklist:**
- [ ] Database indexes for historical queries
- [ ] RPC functions for historical data access
- [ ] Caching strategy implementation
- [ ] Virtual scrolling for large lists
- [ ] Server Components for historical routes
- [ ] Performance monitoring (query times, cache hit rates)

### Fatima (Regulatory) - ✅ Approved

**Key Requirements:**
- 7-year data retention supported in all routes
- Audit log access restricted to MOH/Auditors
- Historical data access logged (who, when, what)
- Export functionality includes regulatory metadata
- Archive data access process (beyond 7 years)
- Historical data is immutable (read-only)
- Export files are tamper-evident

**Regulatory Compliance:**
- DateRangePicker must support 7-year lookback
- Export metadata: Export date, Exported by, Date range, Data source, Format
- Archive strategy: Active (0-7 years) in database, Archived (7+ years) in cold storage
- Access logging: Track all historical data access and exports

### Dr. Samir (Business Process) - ✅ Approved

**Key Requirements:**
- Trend analysis components (AAMS, MSQ, WSL)
- Compliance score trend charts with component breakdown
- Breach pattern analysis (frequency, types, resolutions)
- Export authorization history (ECS module)
- Threshold modification history with impact analysis
- Submission deadline compliance tracking
- Business intelligence dashboard for MOH

**Business Process Features:**
- Multi-year comparisons (2024 vs 2023 vs 2022)
- Cross-metric analysis (AAMS vs MSQ vs WSL correlations)
- Benchmarking (company score vs industry average)
- Predictive indicators (early warning signs for breaches)

---

## Module Activation Impact

### Critical Decision

**Historical data from inactive modules (ECS, CMC) must remain accessible** based on data existence and user permissions, not module activation status. This ensures regulatory compliance, auditability, and business continuity.

### Access Control Logic

```typescript
function canAccessHistoricalData(
  userRole: UserRole,
  moduleType: 'ecs' | 'cmc',
  companyId?: string
): boolean {
  // Check data existence, not module status
  const hasHistoricalData = checkHistoricalDataExists(moduleType, companyId);
  if (!hasHistoricalData) return false;
  
  // Check permissions
  if (['moh_tier1', 'moh_tier2', 'auditor'].includes(userRole)) {
    return true; // MOH/Auditors: Full access if data exists
  }
  if (userRole === 'company_user' && companyId) {
    return true; // Company users: Own data if exists
  }
  return false;
}
```

### Data Existence Check Functions

```sql
-- Check if historical ECS data exists
CREATE OR REPLACE FUNCTION has_historical_ecs_data(
  p_company_id UUID DEFAULT NULL
) RETURNS BOOLEAN;

-- Check if historical CMC data exists
CREATE OR REPLACE FUNCTION has_historical_cmc_data(
  p_company_id UUID DEFAULT NULL
) RETURNS BOOLEAN;
```

### UI/UX Indicators

When displaying historical data from inactive modules:

1. **Informational Banner:**
   ```typescript
   {!isModuleActive('ecs') && hasHistoricalData('ecs') && (
     <Alert variant="info">
       <AlertTitle>Historical Data - Module Currently Inactive</AlertTitle>
       <AlertDescription>
         ECS module is currently inactive. You are viewing historical data 
         from when the module was active. This data is read-only.
       </AlertDescription>
     </Alert>
   )}
   ```

2. **Read-Only Badge:** Display "Historical Data (Read-Only)" badge

3. **Module Activation Date:** Show activation period (from/to dates)

4. **Navigation:** Show module in navigation with "Historical" badge if inactive but data exists

### Route Protection Pattern

```typescript
export default async function ECSExportHistoryPage() {
  const { data: { user } } = await supabase.auth.getUser();
  const userRole = await getUserRole(user.id);
  const companyId = await getUserCompanyId(user.id);
  
  // Check data existence, not module status
  const { data: hasData } = await supabase.rpc('has_historical_ecs_data', {
    p_company_id: companyId || null
  });
  
  if (!hasData) {
    return <EmptyState>No historical export data available</EmptyState>;
  }
  
  if (!canAccessHistoricalData(userRole, 'ecs', companyId)) {
    return <Unauthorized />;
  }
  
  const isActive = await isModuleActive('ecs');
  const historicalData = await getHistoricalExports(companyId);
  
  return (
    <div>
      {!isActive && <InactiveModuleAlert module="ECS" />}
      <ExportHistory data={historicalData} readOnly={!isActive} />
    </div>
  );
}
```

### Regulatory Compliance

- Historical data from inactive modules must remain accessible for 7-year retention requirement
- Audit logs track access to historical data from inactive modules
- Export functionality works regardless of module status
- Historical data is immutable (read-only) via RLS policies

---

## Action Items & Next Steps

### Immediate Actions

1. **Update Routing Structure** (`routing-structure.md`)
   - Add historical data routes
   - Document module activation considerations
   - Include navigation updates

2. **Update RPC Function Specifications** (`rpc-functions.md`)
   - Add historical data RPC functions
   - Document parameters and return types
   - Include access control logic

3. **Update UI Component Specifications** (`ui-component-specifications.md`)
   - Add Timeline component
   - Add DateRangePicker component
   - Add ExportButton component
   - Document modal patterns

4. **Update Role-Based UI Patterns** (`role-based-ui-patterns.md`)
   - Add historical data access patterns
   - Document role-specific routes
   - Include navigation updates

5. **Update Navigation Layout Patterns** (`navigation-layout-patterns.md`)
   - Add history/audit navigation items
   - Document role-based navigation
   - Include inactive module indicators

6. **Update Phase 1 Implementation Plan** (`Phase-1-Implementation-Plan.md`)
   - Add historical data view tasks
   - Include module activation impact tasks
   - Document trend analysis requirements

### Database Tasks

- [ ] Create database indexes for historical queries
- [ ] Create `has_historical_ecs_data()` RPC function
- [ ] Create `has_historical_cmc_data()` RPC function
- [ ] Create `vci_get_historical_submissions()` RPC function
- [ ] Create `cmc_get_historical_scores()` RPC function
- [ ] Create `audit_get_historical_logs()` RPC function
- [ ] Create `log_historical_data_access()` function

### Frontend Tasks

- [ ] Implement history tabs with lazy loading
- [ ] Add filtered list views with query parameters
- [ ] Create dedicated history routes
- [ ] Implement modal patterns (preview, comparison, export)
- [ ] Add virtual scrolling for large lists
- [ ] Implement DateRangePicker component
- [ ] Add export functionality with progress indicators
- [ ] Create inactive module indicators (banners, badges)
- [ ] Update navigation with history/audit links

### Testing Tasks

- [ ] Performance testing with large datasets (2-3 years)
- [ ] Test module activation/deactivation scenarios
- [ ] Test role-based access controls
- [ ] Test 7-year date range selection
- [ ] Test export functionality with metadata
- [ ] Test virtual scrolling performance

---

## References

- **Routing Structure:** `docs/02-architecture/frontend/routing-structure.md`
- **Role-Based UI Patterns:** `docs/02-architecture/frontend/role-based-ui-patterns.md`
- **UI Component Specifications:** `docs/02-architecture/frontend/ui-component-specifications.md`
- **Audit Logging Spec:** `docs/02-architecture/security/audit-logging-spec.md`
- **RPC Functions:** `docs/02-architecture/api/rpc-functions.md`
- **Data Retention:** 7 years (regulatory requirement)

---

**Document Status:** ✅ Complete - Ready for Phase 1.1 Implementation  
**Priority:** Critical - Must be implemented before Phase 1.1 development begins

**Document Lifecycle:** This proposal document will be retained as a **permanent reference** even after implementation is complete. It serves as a decision log, audit trail, and historical record of the architectural decisions and specialist approvals. Implementation details will be documented in the specification files referenced above.
