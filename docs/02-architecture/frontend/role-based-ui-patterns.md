# Role-Based UI Patterns - Pharmaceutical Governance Value Chain Platform (PM)

**Purpose:** This document defines role-based UI patterns, showing how the interface adapts for different user roles (Company Users, MOH Users, Auditors).

**Last Updated:** 2025-12-31  
**Status:** ✅ Complete (Phase 0, Frontend UI/UX Gap Resolution)  
**Owner:** Emma (UI/UX + Next.js Frontend Specialist)

## Overview

The PM platform adapts its UI based on user roles, showing relevant features, actions, and data. This document defines patterns for each role type and how the UI changes accordingly.

## User Roles

### Company Roles

1. **Company Admin:** Full company management, registry submissions
2. **Company Manager:** Product/SKU management, submissions
3. **Company User:** View-only, limited submissions

### MOH Roles

1. **Tier 1 (Approver/Admin):** Full administrative capabilities
2. **Tier 2 Officer:** Verification, analysis, escalation
3. **Tier 2 Registrar:** Implementation of approved changes

### System Roles

1. **Auditor:** Read-only access, audit logs
2. **System Administrator:** Technical configuration
3. **Vendor:** Limited read-only access

## Role Detection

### Implementation Pattern

```tsx
// hooks/useUserRole.ts
export function useUserRole() {
  const { user } = useAuth();
  return {
    role: user?.role,
    permissions: user?.permissions || [],
    companyId: user?.company_id,
    isCompanyUser: user?.role?.startsWith('company_'),
    isMOHUser: user?.role?.startsWith('moh_'),
    isTier1: user?.role === 'moh_tier1',
    isTier2: user?.role === 'moh_tier2_officer' || user?.role === 'moh_tier2_registrar',
    canApprove: user?.permissions?.includes('approve'),
    canEdit: user?.permissions?.includes('edit'),
  };
}
```

## Company User UI Patterns

### Dashboard

**Purpose:** Company-specific overview

**Components:**
- Submission status cards
- Upcoming deadlines
- Recent activity
- Compliance score (if CMC active)

**Layout:**
```
┌─────────────────────────────────────────┐
│ Company Dashboard                       │
├─────────────────────────────────────────┤
│ [AAMS Status] [MSQ Status] [WSL Status] │
├─────────────────────────────────────────┤
│ Upcoming Deadlines                      │
│ • WSL: Friday, Jan 5                    │
│ • MSQ: Jan 31                           │
├─────────────────────────────────────────┤
│ Recent Activity                         │
│ • AAMS submitted (Dec 15)              │
│ • MSQ approved (Dec 20)                │
└─────────────────────────────────────────┘
```

**Implementation:**
```tsx
export function CompanyDashboard() {
  const { companyId } = useUserRole();
  const { data: submissions } = useSubmissions(companyId);
  const { data: deadlines } = useDeadlines(companyId);
  
  return (
    <DashboardLayout>
      <SubmissionStatusCards submissions={submissions} />
      <DeadlinesList deadlines={deadlines} />
      <RecentActivity companyId={companyId} />
    </DashboardLayout>
  );
}
```

### Navigation

**Sidebar Items:**
- Dashboard
- RMM
  - Products (links to `/rmm/products` - RLS filters to own company)
  - SKUs (links to `/rmm/skus` - RLS filters to own company)
- Submissions (AAMS, MSQ, WSL)
- Export Requests (if ECS active, IPC only)
- Profile

**Hidden Items:**
- MOH-only modules
- System configuration
- Audit logs

**Implementation:**
```tsx
<Sidebar>
  <SidebarItem href="/dashboard" icon={LayoutDashboard}>
    Dashboard
  </SidebarItem>
  <SidebarGroup label="RMM">
    <SidebarItem href="/rmm/products" icon={Package}>
      Products
    </SidebarItem>
    <SidebarItem href="/rmm/skus" icon={Box}>
      SKUs
    </SidebarItem>
  </SidebarGroup>
  <SidebarGroup label="Submissions">
    <SidebarItem href="/submissions/aams" icon={FileText}>
      AAMS
    </SidebarItem>
    <SidebarItem href="/submissions/msq" icon={FileText}>
      MSQ
    </SidebarItem>
    <SidebarItem href="/submissions/wsl" icon={FileText}>
      WSL
    </SidebarItem>
  </SidebarGroup>
  {isIPC && isECSActive && (
    <SidebarItem href="/ecs" icon={Plane}>
      Export Requests
    </SidebarItem>
  )}
  <SidebarItem href="/profile" icon={User}>
    Profile
  </SidebarItem>
</Sidebar>
```

**Note:** Company users access the same routes as MOH users (`/rmm/products`, `/rmm/skus`), but RLS policies automatically filter the data to show only their own company's products and SKUs. No separate routes needed.

### Action Buttons

**Visible Actions:**
- Create submission
- Edit own submissions (draft/pending)
- View own data
- Export own data

**Hidden Actions:**
- Approve/reject (MOH only)
- Delete (restricted)
- System configuration

**Implementation:**
```tsx
function SubmissionList() {
  const { canEdit, isCompanyUser } = useUserRole();
  
  return (
    <div>
      {isCompanyUser && (
        <Button onClick={handleNewSubmission}>
          New Submission
        </Button>
      )}
      <Table
        data={submissions}
        actions={(row) => (
          <>
            <Button variant="ghost" onClick={() => handleView(row)}>
              View
            </Button>
            {canEdit && row.status === 'draft' && (
              <Button variant="ghost" onClick={() => handleEdit(row)}>
                Edit
              </Button>
            )}
          </>
        )}
      />
    </div>
  );
}
```

### Data Visibility

**Visible Data:**
- Own company data
- Own submissions
- Own compliance scores
- Public registry data (read-only)

**Hidden Data:**
- Other companies' data
- MOH internal data
- System configuration
- Audit logs (except own actions)

**Implementation:**
```tsx
function CompanyList() {
  const { companyId, isCompanyUser } = useUserRole();
  
  // Company users see only their own company
  if (isCompanyUser) {
    return <CompanyDetail companyId={companyId} />;
  }
  
  // MOH users see all companies
  return <CompanyTable />;
}
```

### Historical Data Access

**Accessible Routes:**
- `/history` - Personal historical overview
- `/vci/submissions/aams?year=2023` - Own AAMS submissions for specific year
- `/vci/submissions/msq?year=2023&month=6` - Own MSQ submissions for specific month
- `/vci/submissions/wsl?week=2023-W01` - Own WSL submissions for specific week
- `/cmc/scores/[company_id]` - Own compliance score history (tabs: Current | History | Trends)
- `/vci/breaches?status=resolved&year=2023` - Own resolved breaches for specific year
- `/rmm/companies/[id]` - Own company detail with History tab

**History Tabs on Detail Pages:**
- Company detail: History tab shows registry changes, submission history, compliance history
- Submission detail: History tab shows corrections, status changes
- Breach detail: History tab shows resolution timeline
- Compliance score detail: History tab shows score trends over time

**Filtered List Views:**
- Year filter on submission lists (defaults to current year)
- Month filter on MSQ lists
- Week filter on WSL lists
- Status filter on breach lists (active, resolved, all)

**Restrictions:**
- ❌ Cannot access other companies' historical data
- ❌ Cannot access audit logs
- ❌ Cannot access trend analysis (MOH only)
- ❌ Cannot export other companies' data

**Implementation:**
```tsx
function CompanyHistoryPage() {
  const { companyId } = useUserRole();
  const [year, setYear] = useState(new Date().getFullYear());
  
  const { data: submissions } = useQuery({
    queryKey: ['historical-submissions', companyId, year],
    queryFn: () => getHistoricalSubmissions(companyId, year),
  });
  
  return (
    <div>
      <PageHeader>
        <PageTitle>Submission History</PageTitle>
        <YearSelect value={year} onChange={setYear} />
      </PageHeader>
      <SubmissionsTable submissions={submissions} />
    </div>
  );
}
```

## MOH User UI Patterns

### Dashboard

**Purpose:** Governance overview

**Components:**
- System-wide metrics
- Pending approvals
- Breach alerts
- Compliance overview
- Action items

**Layout:**
```
┌─────────────────────────────────────────┐
│ Governance Dashboard                    │
├─────────────────────────────────────────┤
│ [Total Companies] [Pending] [Breaches]  │
├─────────────────────────────────────────┤
│ Pending Approvals (12)                  │
│ • Company Registration (5)              │
│ • AAMS Thresholds (3)                   │
│ • Export Requests (4)                   │
├─────────────────────────────────────────┤
│ Critical Breaches                       │
│ • ABC Pharma - Critical Medicine (2)    │
│ • XYZ Corp - Multiple SKUs (5)          │
└─────────────────────────────────────────┘
```

**Implementation:**
```tsx
export function MOHDashboard() {
  const { isTier1, isTier2 } = useUserRole();
  const { data: pendingApprovals } = usePendingApprovals();
  const { data: breaches } = useCriticalBreaches();
  
  return (
    <DashboardLayout>
      <SystemMetrics />
      <PendingApprovalsList
        approvals={pendingApprovals}
        showActions={isTier1 || isTier2}
      />
      <CriticalBreachesList breaches={breaches} />
      {isTier1 && <SystemConfigurationPanel />}
    </DashboardLayout>
  );
}
```

### Navigation

**Sidebar Items:**
- Governance Dashboard
- RMM (Companies, Products, SKUs)
- VCI (Submissions, Submissions History, Trends (Tier 1 only), Thresholds, Breaches)
- History (links to `/history` - system-wide historical overview)
- Audit (Tier 1/2 - links to `/audit/logs`)
- ECS (if active OR historical data exists - Export Requests, Export History)
- CMC (if active OR historical data exists - Compliance Scores, Score History)
- System Configuration (Tier 1 only)

**Implementation:**
```tsx
<Sidebar>
  <SidebarItem href="/dashboard" icon={LayoutDashboard}>
    Governance Dashboard
  </SidebarItem>
  
  <SidebarGroup label="RMM">
    <SidebarItem href="/rmm/companies" icon={Building}>
      Companies
    </SidebarItem>
    <SidebarItem href="/rmm/products" icon={Package}>
      Products
    </SidebarItem>
    <SidebarItem href="/rmm/skus" icon={Box}>
      SKUs
    </SidebarItem>
  </SidebarGroup>
  
  <SidebarGroup label="VCI">
    <SidebarItem href="/vci/submissions" icon={FileText}>
      Submissions
    </SidebarItem>
    <SidebarItem href="/vci/submissions/history" icon={History}>
      Submissions History
    </SidebarItem>
    {isTier1 && (
      <SidebarItem href="/vci/submissions/history/trends" icon={TrendingUp}>
        Trends
      </SidebarItem>
    )}
    <SidebarItem href="/vci/thresholds" icon={BarChart}>
      Thresholds
    </SidebarItem>
    <SidebarItem href="/vci/breaches" icon={AlertTriangle} badge={breachCount}>
      Breaches
    </SidebarItem>
  </SidebarGroup>
  
  <SidebarItem href="/history" icon={History}>
    History
  </SidebarItem>
  
  {(isTier1 || isTier2) && (
    <SidebarItem href="/audit/logs" icon={FileSearch}>
      Audit
    </SidebarItem>
  )}
  
  {(isECSActive || hasHistoricalECSData) && (
    <SidebarGroup label="ECS">
      <SidebarItem href="/ecs" icon={PlaneTakeoff}>
        Export Requests
        {!isECSActive && hasHistoricalECSData && (
          <Badge variant="outline" className="ml-2">Historical</Badge>
        )}
      </SidebarItem>
      {hasHistoricalECSData && (
        <SidebarItem href="/ecs/exports/history" icon={History}>
          Export History
        </SidebarItem>
      )}
    </SidebarGroup>
  )}
  
  {(isCMCActive || hasHistoricalCMCData) && (
    <SidebarGroup label="CMC">
      <SidebarItem href="/cmc" icon={BarChart2}>
        Compliance Scores
        {!isCMCActive && hasHistoricalCMCData && (
          <Badge variant="outline" className="ml-2">Historical</Badge>
        )}
      </SidebarItem>
      {hasHistoricalCMCData && (
        <SidebarItem href="/cmc/scores/history" icon={History}>
          Score History
        </SidebarItem>
      )}
    </SidebarGroup>
  )}
  
  {isTier1 && (
    <SidebarItem href="/system/config" icon={Settings}>
      System Configuration
    </SidebarItem>
  )}
</Sidebar>
```

### Action Buttons

**Tier 1 Actions:**
- Approve/reject submissions
- Configure thresholds
- Suspend companies
- System configuration
- All Tier 2 actions

**Tier 2 Officer Actions:**
- Verify submissions
- Analyze breaches
- Suggest actions
- Flag for Tier 1 review
- View all data

**Tier 2 Registrar Actions:**
- Implement approved changes
- Confirm completion
- View approved items

**Implementation:**
```tsx
function ApprovalCard({ submission }) {
  const { isTier1, isTier2Officer } = useUserRole();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{submission.type}</CardTitle>
        <StatusIndicator status={submission.status} />
      </CardHeader>
      <CardBody>
        {/* Submission details */}
      </CardBody>
      <CardFooter>
        {isTier2Officer && submission.status === 'pending' && (
          <>
            <Button onClick={handleVerify}>Verify</Button>
            <Button variant="outline" onClick={handleFlag}>
              Flag for Review
            </Button>
          </>
        )}
        {isTier1 && submission.status === 'verified' && (
          <>
            <Button onClick={handleApprove}>Approve</Button>
            <Button variant="destructive" onClick={handleReject}>
              Reject
            </Button>
            <Button variant="outline" onClick={handleRequestChanges}>
              Request Changes
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
}
```

### Data Visibility

**Visible Data:**
- All companies
- All submissions
- All compliance data
- System configuration (Tier 1)
- Audit logs

**Filtering:**
- Filter by company
- Filter by status
- Filter by date range
- Filter by module

**Implementation:**
```tsx
function SubmissionList() {
  const { isMOHUser } = useUserRole();
  const [filters, setFilters] = useState({
    company: null,
    status: null,
    dateRange: null,
  });
  
  // MOH users see all submissions
  const { data: submissions } = useSubmissions(filters);
  
  return (
    <div>
      {isMOHUser && (
        <FilterBar
          filters={filters}
          onChange={setFilters}
        />
      )}
      <Table data={submissions} />
    </div>
  );
}
```

### Historical Data Access

**MOH Tier 1 Accessible Routes:**
- `/history` - System-wide historical overview
- `/audit/logs` - Full audit log viewer with search and filtering
- `/audit/reports` - Historical compliance reports
- `/vci/submissions/history` - All past submissions (filterable by type, year, company)
- `/vci/submissions/history/trends` - Trend analysis charts (AAMS, MSQ, WSL trends)
- `/cmc/scores?year=2023` - All compliance scores for specific year
- `/vci/breaches?status=resolved&year=2023` - All resolved breaches for specific year
- `/ecs/exports/history` - Historical export authorizations (if ECS data exists)
- `/cmc/scores/history` - Historical compliance scores (if CMC data exists)

**MOH Tier 2 Accessible Routes:**
- `/history` - Oversight historical overview
- `/audit/logs` - Audit log viewer (read-only)
- `/vci/submissions/history` - All past submissions (filterable)
- `/cmc/scores?year=2023` - All compliance scores for specific year
- `/vci/breaches?status=resolved&year=2023` - All resolved breaches for specific year
- `/ecs/exports/history` - Historical export authorizations (read-only, if ECS data exists)
- `/cmc/scores/history` - Historical compliance scores (read-only, if CMC data exists)

**History Tabs on Detail Pages:**
- Company detail: History tab shows all registry changes, submission history, compliance history
- Submission detail: History tab shows all corrections, status changes, approval workflow
- Breach detail: History tab shows resolution timeline, actions taken
- Compliance score detail: History tab shows score trends, component breakdown over time
- Threshold detail: History tab shows threshold modification history and impact analysis

**Filtered List Views:**
- Year/month filters on all submission lists
- Company filter on all lists
- Status filter on breach lists
- Date range filter on all historical views
- Quick filter chips: "This Year", "Last Year", "Last 3 Years", "All Time"

**Trend Analysis (Tier 1 Only):**
- `/vci/submissions/history/trends` - Multi-year comparison charts
- AAMS trends: Year-over-year comparison, seasonal patterns
- MSQ trends: Monthly patterns, growth trends, anomalies
- WSL trends: Stock level patterns, stockout identification
- Cross-metric analysis: AAMS vs MSQ vs WSL correlations

**Export Functionality:**
- Export all historical data (PDF, Excel, CSV)
- Export includes regulatory metadata (export date, exported by, date range, data source)
- Export history tracking (what was exported, when)
- Progress indicator for large exports

**Module Activation Considerations:**
- Historical data from inactive modules (ECS, CMC) is accessible if data exists
- UI shows informational banner when viewing historical data from inactive modules
- "Historical Data (Read-Only)" badge displayed
- Module activation period shown (from/to dates)

**Implementation:**
```tsx
function MOHHistoryPage() {
  const { isTier1, isTier2 } = useUserRole();
  const [dateRange, setDateRange] = useState({ start: null, end: null });
  
  const { data: historicalData } = useQuery({
    queryKey: ['historical-overview', dateRange],
    queryFn: () => getHistoricalOverview(dateRange),
  });
  
  return (
    <div>
      <PageHeader>
        <PageTitle>Historical Overview</PageTitle>
        <DateRangePicker
          value={dateRange}
          onChange={setDateRange}
          quickFilters={[
            { label: 'Last 7 years', value: '7y' },
            { label: 'Last 3 years', value: '3y' },
            { label: 'Last year', value: '1y' },
          ]}
        />
        <ExportButton onExport={handleExport} />
      </PageHeader>
      <HistoricalOverview data={historicalData} />
      {isTier1 && (
        <Link href="/vci/submissions/history/trends">
          <Button>View Trend Analysis</Button>
        </Link>
      )}
    </div>
  );
}
```

## Auditor UI Patterns

### Dashboard

**Purpose:** Audit and compliance overview

**Components:**
- Audit log viewer
- Compliance reports
- Activity summaries
- Export options

**Layout:**
```
┌─────────────────────────────────────────┐
│ Audit Dashboard                         │
├─────────────────────────────────────────┤
│ Audit Log Search                        │
│ [Search...] [Date Range] [Filter]      │
├─────────────────────────────────────────┤
│ Recent Activity                         │
│ • Company created (User: Admin, Dec 15) │
│ • Submission approved (User: Tier1)    │
└─────────────────────────────────────────┘
```

### Navigation

**Sidebar Items:**
- Audit Logs
- Compliance Reports
- Activity Summary
- Export Reports

**Hidden Items:**
- All action buttons
- Edit capabilities
- Approval workflows

**Implementation:**
```tsx
<Sidebar>
  <SidebarItem href="/audit/logs" icon={FileSearch}>
    Audit Logs
  </SidebarItem>
  <SidebarItem href="/audit/reports" icon={FileText}>
    Compliance Reports
  </SidebarItem>
  <SidebarItem href="/audit/activity" icon={Activity}>
    Activity Summary
  </SidebarItem>
</Sidebar>
```

### Action Buttons

**Visible Actions:**
- View (read-only)
- Export (PDF, Excel)
- Filter/Search
- Generate reports

**Hidden Actions:**
- All edit actions
- All approval actions
- All create actions

**Implementation:**
```tsx
function AuditLogViewer() {
  const { isAuditor } = useUserRole();
  
  return (
    <div>
      <div className="flex gap-2 mb-4">
        <Input placeholder="Search audit logs..." />
        <Button variant="outline">Filter</Button>
        {isAuditor && (
          <Button variant="outline" onClick={handleExport}>
            Export
          </Button>
        )}
      </div>
      <Table
        data={auditLogs}
        // No action column for auditors
      />
    </div>
  );
}
```

### Historical Data Access

**Accessible Routes:**
- `/audit/logs` - Primary audit log viewer (full access, search, filter, export)
- `/audit/reports` - Historical compliance reports (read-only)
- `/audit/activity` - Activity summary (read-only)
- Historical compliance data (read-only access to all companies)
- Historical reports (read-only)

**Audit Log Features:**
- Full search functionality (user, table, action, date range)
- Virtual scrolling for large result sets (thousands of entries)
- Export functionality (PDF, Excel, CSV) with regulatory metadata
- Hash chain verification for data integrity
- 7-year lookback support (regulatory requirement)
- Debounced search for performance

**Restrictions:**
- ❌ No edit/approval actions (read-only)
- ❌ Cannot modify historical data
- ❌ Cannot access trend analysis (MOH only)
- ❌ Cannot access system configuration

**Implementation:**
```tsx
function AuditLogViewer() {
  const [filters, setFilters] = useState({
    tableName: null,
    userId: null,
    startDate: null,
    endDate: null,
    search: '',
  });
  
  const { data: auditLogs, isLoading } = useQuery({
    queryKey: ['audit-logs', filters],
    queryFn: () => getHistoricalAuditLogs(filters),
  });
  
  return (
    <div>
      <PageHeader>
        <PageTitle>Audit Logs</PageTitle>
        <div className="flex gap-2">
          <Input
            placeholder="Search..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
          <DateRangePicker
            value={{ start: filters.startDate, end: filters.endDate }}
            onChange={(range) => setFilters({ ...filters, startDate: range.start, endDate: range.end })}
            quickFilters={[
              { label: 'Last 7 years', value: '7y' },
              { label: 'Last 3 years', value: '3y' },
              { label: 'Last year', value: '1y' },
            ]}
          />
          <ExportButton onExport={handleExport} />
        </div>
      </PageHeader>
      {isLoading ? (
        <Loading spinner />
      ) : (
        <VirtualizedAuditLogList logs={auditLogs} />
      )}
    </div>
  );
}
```

## Conditional Rendering Patterns

### Component-Level

**Pattern:** Show/hide components based on role

```tsx
function PageContent() {
  const { isTier1, isCompanyUser } = useUserRole();
  
  return (
    <div>
      <ContentSection />
      {isTier1 && <ConfigurationSection />}
      {isCompanyUser && <CompanySpecificSection />}
    </div>
  );
}
```

### Route-Level

**Pattern:** Protect routes with middleware

```tsx
// middleware.ts
export function middleware(req: NextRequest) {
  const { user } = getAuth(req);
  
  // Protect Tier 1 routes
  if (req.nextUrl.pathname.startsWith('/system/config')) {
    if (user?.role !== 'moh_tier1') {
      return NextResponse.redirect('/unauthorized');
    }
  }
  
  return NextResponse.next();
}
```

### Field-Level

**Pattern:** Show/hide form fields based on role

```tsx
function CompanyForm() {
  const { isTier1 } = useUserRole();
  
  return (
    <Form>
      <FormField label="Company Name" required>
        <Input {...register('name')} />
      </FormField>
      {isTier1 && (
        <FormField label="Internal Notes">
          <Textarea {...register('notes')} />
        </FormField>
      )}
    </Form>
  );
}
```

## Permission-Based UI

### Permission Checks

**Pattern:** Check specific permissions

```tsx
function usePermissions() {
  const { user } = useAuth();
  
  return {
    canApprove: user?.permissions?.includes('approve'),
    canEdit: user?.permissions?.includes('edit'),
    canDelete: user?.permissions?.includes('delete'),
    canViewAuditLogs: user?.permissions?.includes('view_audit_logs'),
  };
}

function ActionButtons({ item }) {
  const { canApprove, canEdit, canDelete } = usePermissions();
  
  return (
    <div className="flex gap-2">
      {canEdit && (
        <Button onClick={() => handleEdit(item)}>Edit</Button>
      )}
      {canApprove && item.status === 'pending' && (
        <Button onClick={() => handleApprove(item)}>Approve</Button>
      )}
      {canDelete && (
        <Button variant="destructive" onClick={() => handleDelete(item)}>
          Delete
        </Button>
      )}
    </div>
  );
}
```

## Module Activation UI

### Module Indicators

**Pattern:** Show module status in UI

```tsx
function ModuleIndicator({ module }) {
  const { isActive } = useModuleStatus(module);
  
  if (!isActive) {
    return (
      <Badge variant="secondary" className="opacity-50">
        {module} (Inactive)
      </Badge>
    );
  }
  
  return <Badge variant="success">{module}</Badge>;
}
```

### Conditional Navigation

**Pattern:** Show navigation for active modules OR if historical data exists

```tsx
function Sidebar() {
  const { isECSActive, isCMCActive } = useModuleStatus();
  const { hasHistoricalECSData, hasHistoricalCMCData } = useHistoricalData();
  
  return (
    <Sidebar>
      {/* Always visible */}
      <SidebarGroup label="RMM">...</SidebarGroup>
      <SidebarGroup label="VCI">...</SidebarGroup>
      <SidebarItem href="/history" icon={History}>
        History
      </SidebarItem>
      
      {/* Show if active OR historical data exists */}
      {(isECSActive || hasHistoricalECSData) && (
        <SidebarGroup label="ECS">
          <SidebarItem href="/ecs" icon={Plane}>
            Export Requests
            {!isECSActive && hasHistoricalECSData && (
              <Badge variant="outline" className="ml-2">Historical</Badge>
            )}
          </SidebarItem>
          {hasHistoricalECSData && (
            <SidebarItem href="/ecs/exports/history" icon={History}>
              Export History
            </SidebarItem>
          )}
        </SidebarGroup>
      )}
      {(isCMCActive || hasHistoricalCMCData) && (
        <SidebarGroup label="CMC">
          <SidebarItem href="/cmc" icon={BarChart}>
            Compliance Scores
            {!isCMCActive && hasHistoricalCMCData && (
              <Badge variant="outline" className="ml-2">Historical</Badge>
            )}
          </SidebarItem>
          {hasHistoricalCMCData && (
            <SidebarItem href="/cmc/scores/history" icon={History}>
              Score History
            </SidebarItem>
          )}
        </SidebarGroup>
      )}
    </Sidebar>
  );
}
```

### Historical Data from Inactive Modules

**Pattern:** Display historical data from inactive modules with clear indicators

```tsx
function InactiveModuleAlert({ module, moduleName }) {
  return (
    <Alert variant="info">
      <AlertIcon />
      <AlertTitle>Historical Data - Module Currently Inactive</AlertTitle>
      <AlertDescription>
        The {moduleName} module is currently inactive. You are viewing historical 
        data from when the module was active. This data is read-only and cannot be modified.
      </AlertDescription>
    </Alert>
  );
}

function HistoricalDataPage({ module, moduleName }) {
  const isActive = useModuleStatus(module);
  const hasHistoricalData = useHistoricalData(module);
  
  if (!hasHistoricalData) {
    return <EmptyState>No historical data available</EmptyState>;
  }
  
  return (
    <div>
      {!isActive && (
        <InactiveModuleAlert module={module} moduleName={moduleName} />
      )}
      <Badge variant="outline" className="mb-4">
        Historical Data (Read-Only)
      </Badge>
      <HistoricalDataView readOnly={!isActive} />
    </div>
  );
}
```

## UI State Management

### Role Context

**Pattern:** Provide role data via context

```tsx
const RoleContext = createContext();

export function RoleProvider({ children }) {
  const { user } = useAuth();
  const roleData = useMemo(() => ({
    role: user?.role,
    permissions: user?.permissions,
    companyId: user?.company_id,
    // ... computed role properties
  }), [user]);
  
  return (
    <RoleContext.Provider value={roleData}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  return useContext(RoleContext);
}
```

## Testing Role-Based UI

### Test Scenarios

1. **Role Rendering:** Verify correct UI for each role
2. **Permission Checks:** Verify actions based on permissions
3. **Data Visibility:** Verify data filtering by role
4. **Navigation:** Verify navigation items by role
5. **Access Control:** Verify unauthorized access blocked

## References

- [RBAC Specification](../../security/rls-policy-framework.md)
- [User Roles Documentation](../../../00-overview/Project%20Brief%20–%20PM.md)
- [Historical Data Routing Proposal](./historical-data-routing-proposal.md) - Historical data access patterns

---

## Historical Data Access Patterns

**Status:** ✅ Historical data access patterns added  
**Implementation:** See [Historical Data Routing Proposal](./historical-data-routing-proposal.md) for complete specifications

**Patterns Added:**
- **Company Users:** Historical data access patterns (own company only)
- **MOH Users:** Historical data access patterns (all companies, trend analysis for Tier 1)
- **Auditors:** Historical data access patterns (audit logs, compliance reports)
- **Module Activation:** UI patterns for inactive modules with historical data
- **Navigation Updates:** History/audit links for all roles

**Key Features:**
- Role-specific historical data routes
- History tabs on detail pages
- Filtered list views with query parameters
- Module activation considerations (data existence checks)
- Inactive module indicators (banners, badges)

---

**Last Updated:** 2025-12-31  
**Next Steps:**
1. Implement role detection hooks
2. Create role-based components
3. Build permission checking utilities
4. Test role-based UI rendering
5. Implement historical data access patterns

