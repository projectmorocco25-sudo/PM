# Navigation and Layout Patterns - Pharmaceutical Governance Value Chain Platform (PM)

**Purpose:** This document defines navigation patterns, layout structures, and responsive design patterns for the PM platform.

**Last Updated:** 2026-01-12  
**Status:** ⚠️ PARTIALLY COMPLETE - Route fixes in progress (Phase 1.1.1.FIX)  
**Owner:** Emma (UI/UX + Next.js Frontend Specialist)

**⚠️ CRITICAL:** This document is the SINGLE SOURCE OF TRUTH for navigation structure (sidebar organization, layout patterns). For route definitions, see [routing-structure.md](./routing-structure.md). For route implementation status, see [route-inventory.md](./route-inventory.md).

## Overview

The PM platform uses a consistent navigation and layout structure across all modules, with role-based adaptations. The layout is optimized for desktop and tablet devices, with responsive breakpoints for different screen sizes.

## Navigation Structure Organization

The sidebar navigation is organized into six main sections:

1. **[Global]** - System-wide features available to all authenticated users
   - Dashboard, Communications, History, Notifications
   - Audit (MOH Tier 1/2, Auditors only)
   - System Configuration (MOH Tier 1 only)
   - **Route Reference:** See [routing-structure.md](./routing-structure.md) for complete route paths

2. **[Registry Management (RMM)]** - Registry Management Module
   - Overview, Companies, Products, SKUs
   - **Route Reference:** See [routing-structure.md](./routing-structure.md) for complete RMM route paths

3. **[Value Chain Intelligence (VCI)]** - Value Chain Intelligence Module
   - Dashboard, Submissions (AAMS, MSQ, WSL), Regulatory Submission History, Compliance Trend Analysis, Thresholds, Compliance Violations, Governance, Treemap
   - **Route Reference:** See [routing-structure.md](./routing-structure.md) for complete VCI route paths

4. **[Export Control System (ECS)]** - Export Control System Module (conditional - if active OR historical data exists)
   - Overview, Export Authorization Requests, Export Authorizations, Export Authorization History
   - **Route Reference:** See [routing-structure.md](./routing-structure.md) for complete ECS route paths

5. **[Compliance Monitoring Center (CMC)]** - Compliance Monitoring Center Module (conditional - if active OR historical data exists)
   - Overview, Regulatory Compliance Ratings, Compliance Rating History, Compliance Disputes, Compliance Disputes History, Reports
   - **Route Reference:** See [routing-structure.md](./routing-structure.md) for complete CMC route paths

6. **[Help & Info]** - Support and information resources
   - Support Center, FAQ, Documentation, Contact Support, System Status
   - **Route Reference:** See [routing-structure.md](./routing-structure.md) for complete support route paths

**Note:** Profile and account settings are accessed via the header user menu dropdown, not the sidebar.

## Layout Structure

### Main Layout

**Structure:**
```
┌─────────────────────────────────────────┐
│ Header (Top Navigation)                 │
├──────────┬──────────────────────────────┤
│          │                              │
│ Sidebar  │ Main Content Area            │
│ (Nav)    │                              │
│          │                              │
│          │                              │
│          │                              │
└──────────┴──────────────────────────────┘
```

**Components:**
- **Header:** Top navigation bar (fixed)
- **Sidebar:** Left navigation (collapsible)
- **Main Content:** Page content area (scrollable)
- **Footer:** Optional (for public pages)

### Header

**Purpose:** Top navigation, user menu, notifications

**Components:**
- Logo (left)
- Module indicator (if in module)
- User menu (right)
- Notifications icon (right)
- Search (optional, right)

**Layout:**
```
┌─────────────────────────────────────────┐
│ [Logo] [Module]    [🔍] [🔔] [User ▼] │
└─────────────────────────────────────────┘
```

**Implementation:**
```tsx
<Header>
  <div className="flex items-center gap-4">
    <Logo />
    {currentModule && <ModuleIndicator module={currentModule} />}
  </div>
  <div className="flex items-center gap-4">
    <Search />
    <Notifications />
    <UserMenu user={user} />
  </div>
</Header>
```

### Sidebar

**Purpose:** Main navigation, module access

**Features:**
- Collapsible (desktop)
- Module grouping
- Active state indication
- Role-based menu items
- Badge for notifications/counts

**Layout:**
```
┌──────────────────────┐
│ Global               │
│ ├ Dashboard          │
│ ├ Communications     │
│ ├ History            │
│ ├ Notifications      │
│ └ Audit              │
│                      │
│ Registry Management  │
│ (RMM)                │
│ ├ Overview           │
│ ├ Companies          │
│ ├ Products           │
│ └ SKUs               │
│                      │
│ Value Chain          │
│ Intelligence         │
│ (VCI)                │
│ ├ Dashboard          │
│ ├ Submissions        │
│ ├ Thresholds         │
│ ├ Compliance Violations           │
│ └ Treemap (Supply Chain Visualization)            │
│                      │
│ Export Control       │
│ System (ECS)         │
│ ├ Export Authorization Requests    │
│ └ Export Authorizations     │
│                      │
│ Enforcement          │
│ ├ Dashboard          │
│ ├ Actions            │
│ ├ Pending Regulatory Approvals  │
│ └ Reports            │
│                      │
│ Compliance           │
│ Monitoring Center    │
│ (CMC)                │
│ ├ Regulatory Compliance Ratings             │
│ ├ Compliance Disputes           │
│ └ Reports            │
│                      │
│ Help & Info          │
│ ├ Support Center     │
│ ├ FAQ                │
│ └ Documentation      │
└──────────────────────┘
```

**Implementation:**
```tsx
<Sidebar collapsed={isCollapsed} onToggle={handleToggle}>
  {/* Global Section - System-wide features */}
  <SidebarGroup label="Global" icon={Globe}>
    <SidebarItem href="/" icon={LayoutDashboard} active>
      Dashboard
    </SidebarItem>
    <SidebarItem href="/communications/inbox" icon={Mail} badge={unreadCount}>
      Communications
    </SidebarItem>
    <SidebarItem href="/history" icon={History}>
      History
    </SidebarItem>
    <SidebarItem href="/notifications" icon={Bell}>
      Notifications
    </SidebarItem>
    {/* MOH Tier 1/2 and Auditors only */}
    {(userRole === 'tier1' || userRole === 'tier2_officer' || userRole === 'tier2_registrar' || userRole === 'auditor') && (
      <>
        <SidebarItem href="/audit/logs" icon={FileSearch}>
          Audit Logs
        </SidebarItem>
        {(userRole === 'tier1' || userRole === 'tier2_officer' || userRole === 'tier2_registrar') && (
          <SidebarItem href="/audit/reports" icon={FileText}>
            Audit Reports
          </SidebarItem>
        )}
      </>
    )}
    {/* MOH Tier 1 only */}
    {userRole === 'tier1' && (
      <SidebarItem href="/system-config" icon={Settings}>
        System Configuration
      </SidebarItem>
    )}
  </SidebarGroup>
  
  {/* RMM Module */}
  <SidebarGroup label="Registry Management" labelAbbr="(RMM)" icon={Building}>
    <SidebarItem href="/rmm" icon={LayoutDashboard}>
      Overview
    </SidebarItem>
    <SidebarItem href="/rmm/companies" icon={Building2}>
      Companies
    </SidebarItem>
    <SidebarItem href="/rmm/products" icon={Package}>
      Products
    </SidebarItem>
    <SidebarItem href="/rmm/skus" icon={Box}>
      SKUs
    </SidebarItem>
  </SidebarGroup>
  
  {/* VCI Module */}
  <SidebarGroup label="Value Chain Intelligence" labelAbbr="(VCI)" icon={BarChart}>
    <SidebarItem href="/vci" icon={LayoutDashboard}>
      Dashboard
    </SidebarItem>
    <SidebarItem href="/vci/submissions/aams" icon={FileText} badge={pendingCount}>
      Submissions
    </SidebarItem>
    <SidebarItem href="/vci/submissions/history" icon={History}>
      Regulatory Submission History
    </SidebarItem>
    {/* Trends - MOH Tier 1 only */}
    {userRole === 'tier1' && (
      <SidebarItem href="/vci/submissions/history/trends" icon={TrendingUp}>
        Compliance Trend Analysis
      </SidebarItem>
    )}
    <SidebarItem href="/vci/thresholds" icon={Target}>
      Thresholds
    </SidebarItem>
    <SidebarItem href="/vci/breaches" icon={AlertTriangle}>
      Compliance Violations
    </SidebarItem>
    {/* Governance - MOH only */}
    {(userRole === 'tier1' || userRole === 'tier2_officer' || userRole === 'tier2_registrar') && (
      <SidebarItem href="/vci/governance" icon={Shield}>
        Governance
      </SidebarItem>
    )}
    {/* Treemap - MOH Tier 1/2 only */}
    {(userRole === 'tier1' || userRole === 'tier2_officer' || userRole === 'tier2_registrar') && (
      <SidebarItem href="/vci/treemap" icon={Map}>
        Treemap (Supply Chain Visualization)
      </SidebarItem>
    )}
  </SidebarGroup>
  
  {/* ECS Module - if active OR historical data exists */}
  {(isECSActive || hasHistoricalECSData) && (
    <SidebarGroup label="Export Control System" labelAbbr="(ECS)" icon={Plane}>
      <SidebarItem href="/ecs" icon={LayoutDashboard}>
        Overview
      </SidebarItem>
      <SidebarItem href="/ecs/export-requests" icon={PlaneTakeoff}>
        Export Authorization Requests
        {!isECSActive && hasHistoricalECSData && (
          <Badge variant="outline" className="ml-2">Historical</Badge>
        )}
      </SidebarItem>
      <SidebarItem href="/ecs/authorizations" icon={CheckCircle}>
        Export Authorizations
      </SidebarItem>
      {hasHistoricalECSData && (
        <SidebarItem href="/ecs/exports/history" icon={History}>
          Export Authorization History
        </SidebarItem>
      )}
    </SidebarGroup>
  )}
  
  {/* Enforcement Module - MOH Tier 1 and Tier 2 only */}
  {(userRole === 'tier1' || userRole === 'tier2_officer' || userRole === 'tier2_registrar') && (
    <SidebarGroup label="Enforcement" icon={ShieldAlert}>
      <SidebarItem href="/enforcement" icon={LayoutDashboard}>
        Dashboard
      </SidebarItem>
      <SidebarItem href="/enforcement/actions" icon={FileText}>
        Actions
      </SidebarItem>
      <SidebarItem href="/enforcement/pending-approvals" icon={Clock}>
        Pending Regulatory Approvals
      </SidebarItem>
      <SidebarItem href="/enforcement/reports" icon={BarChart}>
        Enforcement Activity Reports
      </SidebarItem>
    </SidebarGroup>
  )}
  
  {/* CMC Module - if active OR historical data exists */}
  {(isCMCActive || hasHistoricalCMCData) && (
    <SidebarGroup label="Compliance Monitoring Center" labelAbbr="(CMC)" icon={BarChart}>
      <SidebarItem href="/cmc" icon={LayoutDashboard}>
        Overview
      </SidebarItem>
      <SidebarItem href="/cmc/scores" icon={BarChart2}>
        Regulatory Compliance Ratings
        {!isCMCActive && hasHistoricalCMCData && (
          <Badge variant="outline" className="ml-2">Historical</Badge>
        )}
      </SidebarItem>
      {hasHistoricalCMCData && (
        <SidebarItem href="/cmc/scores/history" icon={History}>
          Compliance Rating History
        </SidebarItem>
      )}
      <SidebarItem href="/cmc/disputes" icon={MessageSquare}>
        Compliance Disputes
      </SidebarItem>
      {hasHistoricalCMCData && (
        <SidebarItem href="/cmc/disputes/history" icon={History}>
          Compliance Disputes History
        </SidebarItem>
      )}
      <SidebarItem href="/cmc/reports" icon={FileText}>
        Compliance Monitoring Reports
      </SidebarItem>
    </SidebarGroup>
  )}
  
  {/* Help & Info Section */}
  <SidebarGroup label="Help & Info" icon={HelpCircle}>
    <SidebarItem href="/support" icon={LifeBuoy}>
      Support Center
    </SidebarItem>
    <SidebarItem href="/support/faq" icon={HelpCircle}>
      FAQ
    </SidebarItem>
    <SidebarItem href="/support/documentation" icon={Book}>
      Documentation
    </SidebarItem>
    <SidebarItem href="/support/contact" icon={Mail}>
      Contact Support
    </SidebarItem>
    <SidebarItem href="/status" icon={Activity}>
      System Status
    </SidebarItem>
  </SidebarGroup>
</Sidebar>
```

**Note:** Profile is accessed via the header user menu dropdown, not the sidebar.

**Inactive Module Indicators:**
- Show module in navigation if active OR historical data exists
- Display "Historical" badge if module inactive but data exists
- Show historical sub-navigation items (Export History, Score History) if data exists
- Informational banner on historical data pages when module is inactive

### Main Content Area

**Purpose:** Page content, scrollable area

**Features:**
- Breadcrumbs (top)
- Page title
- Action buttons (top right)
- Content area
- Responsive padding

**Layout:**
```
┌─────────────────────────────────────────┐
│ Home > RMM > Companies                  │
│ Company Management          [New +]     │
├─────────────────────────────────────────┤
│                                         │
│ [Content Area]                          │
│                                         │
│                                         │
└─────────────────────────────────────────┘
```

**Implementation:**
```tsx
<MainContent>
  <Breadcrumbs />
  <div className="flex items-center justify-between mb-6">
    <PageTitle>Company Management</PageTitle>
    <Button onClick={handleNew}>
      <Plus /> New Company
    </Button>
  </div>
  <ContentArea>
    {/* Page content */}
  </ContentArea>
</MainContent>
```

## Navigation Patterns

### Breadcrumbs

**Purpose:** Hierarchical navigation trail

**Pattern:**
- Home → Module → Section → Page
- Clickable segments (except current)
- Icon for home

**Implementation:**
```tsx
<Breadcrumbs>
  <BreadcrumbItem href="/" icon={Home}>
    Home
  </BreadcrumbItem>
  <BreadcrumbItem href="/rmm">
    RMM
  </BreadcrumbItem>
  <BreadcrumbItem href="/rmm/companies">
    Companies
  </BreadcrumbItem>
  <BreadcrumbItem>
    {companyName}
  </BreadcrumbItem>
</Breadcrumbs>
```

**Historical Route Breadcrumbs:**
- `/history` → Home > History
- `/audit/logs` → Home > Audit > Logs
- `/audit/reports` → Home > Audit > Reports
- `/vci/submissions/history` → Home > VCI > Submissions > Regulatory Submission History
- `/vci/submissions/history/trends` → Home > VCI > Submissions > Regulatory Submission History > Compliance Trend Analysis
- `/vci/treemap` → Home > VCI > Treemap
- `/vci/treemap?atc=J01` → Home > VCI > Treemap > J01 - Antibacterials
- `/ecs/exports/history` → Home > ECS > Exports > History
- `/cmc/scores/history` → Home > CMC > Scores > History
- `/rmm/companies/[id]?tab=history` → Home > RMM > Companies > [Company Name] > History

### Tab Navigation

**Purpose:** Organize content within a page

**Use Cases:**
- Detail pages (Overview, Details, History)
- Module sections (Submissions: AAMS, MSQ, WSL)

**Implementation:**
```tsx
<Tabs value={activeTab} onChange={setActiveTab}>
  <TabList>
    <Tab value="overview" icon={Info}>
      Overview
    </Tab>
    <Tab value="details" icon={FileText}>
      Details
    </Tab>
    <Tab value="history" icon={History} badge={historyCount}>
      History
    </Tab>
  </TabList>
  <TabPanels>
    <TabPanel value="overview">
      <OverviewContent />
    </TabPanel>
    <TabPanel value="details">
      <DetailsContent />
    </TabPanel>
    <TabPanel value="history">
      <HistoryContent />
    </TabPanel>
  </TabPanels>
</Tabs>
```

### Module Navigation

**Purpose:** Switch between modules

**Pattern:**
- Module switcher in header (if multiple modules active)
- Sidebar groups for each module
- Module-specific navigation

**Implementation:**
```tsx
<ModuleSwitcher>
  <Select
    value={currentModule}
    onChange={handleModuleChange}
    options={activeModules}
  />
</ModuleSwitcher>
```

## Role-Based Layout Adaptations

### Company User Layout

**Features:**
- Simplified sidebar (company-specific)
- Submission-focused navigation
- Dashboard with company metrics

**Sidebar Structure:**
```
[Global]
├── Dashboard (/)
├── Communications (/communications/inbox) [Badge: unread count]
├── History (/history)
└── Notifications (/notifications)

[Registry Management (RMM)]
├── Overview (/rmm)
├── Products (/rmm/products - RLS filters to own company)
└── SKUs (/rmm/skus - RLS filters to own company)

[Value Chain Intelligence (VCI)]
├── Dashboard (/vci)
├── Submissions
│   ├── AAMS (/vci/submissions/aams)
│   ├── MSQ (/vci/submissions/msq)
│   └── WSL (/vci/submissions/wsl)
├── Thresholds (/vci/thresholds - read-only)
└── Compliance Violations (/vci/breaches - own company only)

[Export Control System (ECS)] (if active OR historical data exists)
├── Export Authorization Requests (/ecs/export-requests)
├── Export Authorizations (/ecs/authorizations)
└── Export Authorization History (/ecs/exports/history - if historical data exists)
└── Export Authorization History (/ecs/exports/history - if historical data exists)

[Compliance Monitoring Center (CMC)] (if active OR historical data exists)
├── Regulatory Compliance Ratings (/cmc/scores)
└── Compliance Rating History (/cmc/scores/history - if historical data exists)

[Help & Info]
├── Support Center (/support)
├── FAQ (/support/faq)
├── Documentation (/support/documentation)
└── Contact Support (/support/contact)
```

**Header User Menu:**
- Profile (/profile)
- Account Settings
- Logout

**Historical Data Navigation:**
- History link always visible (personal historical overview)
- ECS/CMC navigation shows "Historical" badge if module inactive but data exists
- Export History and Score History links shown if historical data exists

### MOH User Layout

**Features:**
- Full module access
- Governance dashboard
- Approval workflows
- System configuration

**Sidebar Structure:**
```
[Global]
├── Dashboard (/) - Governance overview
├── Communications (/communications/inbox) [Badge: unread count]
├── History (/history - system-wide historical overview)
├── Notifications (/notifications)
├── Audit Logs (/audit/logs)
├── Audit Reports (/audit/reports)
└── System Configuration (/system-config - Tier 1 only)

[Registry Management (RMM)]
├── Overview (/rmm)
├── Companies (/rmm/companies)
├── Products (/rmm/products)
└── SKUs (/rmm/skus)

[Value Chain Intelligence (VCI)]
├── Dashboard (/vci)
├── Submissions
│   ├── AAMS (/vci/submissions/aams)
│   ├── MSQ (/vci/submissions/msq)
│   └── WSL (/vci/submissions/wsl)
├── Regulatory Submission History (/vci/submissions/history)
├── Compliance Trend Analysis (/vci/submissions/history/trends - Tier 1 only)
├── Thresholds (/vci/thresholds)
├── Compliance Violations (/vci/breaches)
├── Governance (/vci/governance)
└── Treemap (Supply Chain Visualization) (/vci/treemap - Tier 1/2 only)

[Export Control System (ECS)] (if active OR historical data exists)
├── Overview (/ecs)
├── Export Requests (/ecs/export-requests)
├── Authorizations (/ecs/authorizations)
└── Export History (/ecs/exports/history - if historical data exists)

[Compliance Monitoring Center (CMC)] (if active OR historical data exists)
├── Overview (/cmc)
├── Compliance Scores (/cmc/scores)
├── Score History (/cmc/scores/history - if historical data exists)
├── Compliance Disputes (/cmc/disputes)
├── Compliance Disputes History (/cmc/disputes/history - if historical data exists)
└── Compliance Monitoring Reports (/cmc/reports)

[Enforcement]
├── Dashboard (/enforcement)
├── Actions (/enforcement/actions)
├── Pending Regulatory Approvals (/enforcement/pending-approvals)
└── Enforcement Activity Reports (/enforcement/reports)

[Help & Info]
├── Support Center (/support)
├── FAQ (/support/faq)
├── Documentation (/support/documentation)
├── Contact Support (/support/contact)
└── System Status (/status)
```

**Header User Menu:**
- Profile (/profile)
- Account Settings
- Logout

**Historical Data Navigation:**
- History link always visible (system-wide historical overview)
- Audit link visible for Tier 1/2 (full access for Tier 1, read-only for Tier 2)
- ECS/CMC navigation shows "Historical" badge if module inactive but data exists
- Export History and Score History links shown if historical data exists

### Auditor Layout

**Features:**
- Read-only access
- Audit log viewer
- Reports
- No action buttons

**Sidebar Structure:**
```
[Global]
├── Dashboard (/)
├── History (/history)
├── Notifications (/notifications)
├── Audit Logs (/audit/logs - primary)
└── Audit Reports (/audit/reports)

[Registry Management (RMM)] (read-only for audit purposes)
├── Overview (/rmm)
├── Companies (/rmm/companies - read-only, RLS filters)
├── Products (/rmm/products - read-only, RLS filters)
└── SKUs (/rmm/skus - read-only, RLS filters)

[Value Chain Intelligence (VCI)] (read-only for audit purposes)
├── Dashboard (/vci)
├── Submissions
│   ├── AAMS (/vci/submissions/aams)
│   ├── MSQ (/vci/submissions/msq)
│   └── WSL (/vci/submissions/wsl)
├── Submissions History (/vci/submissions/history)
├── Thresholds (/vci/thresholds)
└── Breaches (/vci/breaches)

[Help & Info]
├── Support Center (/support)
├── FAQ (/support/faq)
├── Documentation (/support/documentation)
└── Contact Support (/support/contact)
```

**Header User Menu:**
- Profile (/profile)
- Account Settings
- Logout

**Historical Data Navigation:**
- Audit Logs is primary navigation item
- Full access to historical audit logs with search and filtering
- Read-only access to historical compliance data
- Export functionality for audit logs and reports

## Responsive Design

### Breakpoints

```css
/* Tablet Portrait */
@media (min-width: 640px) { }

/* Tablet Landscape */
@media (min-width: 768px) { }

/* Desktop Small */
@media (min-width: 1024px) { }

/* Desktop Medium */
@media (min-width: 1280px) { }

/* Desktop Large */
@media (min-width: 1536px) { }
```

### Desktop Layout (>1024px)

**Features:**
- Full sidebar (expanded)
- Multi-column layouts
- Hover states
- Full feature set

**Layout:**
```
┌──────┬────────────────────────────┐
│ Side │ Content (Full Width)      │
│ bar  │                            │
│      │                            │
└──────┴────────────────────────────┘
```

### Tablet Layout (768px - 1024px)

**Features:**
- Collapsible sidebar (default collapsed)
- Single column layouts
- Touch-optimized targets
- Simplified navigation

**Layout:**
```
┌─┬────────────────────────────────┐
│☰│ Content (Adjusted)            │
│ │                                │
│ │                                │
└─┴────────────────────────────────┘
```

### Mobile Layout (<768px)

**Note:** Not officially supported, but responsive design should work

**Features:**
- Hamburger menu
- Bottom navigation (optional)
- Single column
- Stacked layouts

**Layout:**
```
┌──────────────────────────────────┐
│ ☰ [Logo]              [User]    │
├──────────────────────────────────┤
│                                  │
│ Content (Stacked)                │
│                                  │
│                                  │
└──────────────────────────────────┘
```

## Layout Components

### Page Layout

**Purpose:** Standard page wrapper

**Components:**
- Container (max-width, centered)
- Padding (responsive)
- Grid system

**Implementation:**
```tsx
<PageLayout>
  <Container maxWidth="xl">
    <PageHeader>
      <PageTitle>Page Title</PageTitle>
      <PageActions>
        <Button>Action</Button>
      </PageActions>
    </PageHeader>
    <PageContent>
      {/* Content */}
    </PageContent>
  </Container>
</PageLayout>
```

### Dashboard Layout

**Purpose:** Dashboard-specific layout

**Features:**
- Grid system for widgets
- Responsive columns
- Widget sizing

**Implementation:**
```tsx
<DashboardLayout>
  <DashboardGrid>
    <Widget colSpan={1} rowSpan={1}>
      <KPICard title="Total Companies" value={123} />
    </Widget>
    <Widget colSpan={2} rowSpan={1}>
      <ChartWidget />
    </Widget>
    <Widget colSpan={3} rowSpan={2}>
      <TableWidget />
    </Widget>
  </DashboardGrid>
</DashboardLayout>
```

### Detail Page Layout

**Purpose:** Detail/view page layout

**Features:**
- Header with title and actions
- Tabs for sections
- Related data sidebar

**Implementation:**
```tsx
<DetailPageLayout>
  <DetailHeader>
    <DetailTitle>{item.name}</DetailTitle>
    <DetailActions>
      <Button variant="outline">Edit</Button>
      <Button>Approve</Button>
    </DetailActions>
  </DetailHeader>
  <DetailContent>
    <Tabs>
      {/* Tab content */}
    </Tabs>
  </DetailContent>
  <DetailSidebar>
    <RelatedData />
  </DetailSidebar>
</DetailPageLayout>
```

## Navigation States

### Active State

**Pattern:** Highlighted background, bold text, accent border

**Implementation:**
```tsx
<SidebarItem
  href="/rmm/companies"
  active={pathname === '/rmm/companies'}
>
  Companies
</SidebarItem>
```

### Hover State

**Pattern:** Subtle background change, cursor pointer

### Disabled State

**Pattern:** Grayed out, no interaction

**Use Case:** Module not active, insufficient permissions

**Implementation:**
```tsx
<SidebarItem
  href="/ecs"
  disabled={!isECSActive}
  tooltip="ECS module not active"
>
  Export Control
</SidebarItem>
```

## Navigation Accessibility

### Keyboard Navigation

- **Tab:** Move through navigation items
- **Enter/Space:** Activate item
- **Arrow Keys:** Navigate within groups (if applicable)
- **Escape:** Close dropdown/menu

### Screen Reader Support

- **ARIA Labels:** Descriptive labels for all items
- **ARIA Current:** Indicate current page
- **Skip Links:** Skip to main content

### Focus Management

- **Visible Focus:** Clear focus indicators
- **Focus Order:** Logical tab order
- **Focus Trap:** In modals/dropdowns

## Layout Performance

### Optimization Strategies

1. **Code Splitting:** Lazy load module-specific components
2. **Memoization:** Memoize navigation components
3. **Virtual Scrolling:** For long navigation lists
4. **Progressive Loading:** Load critical layout first

## Public Pages Layout

### Homepage Layout

**Purpose:** Public-facing homepage

**Features:**
- Full-width hero section
- Content sections
- Footer

**Layout:**
```
┌─────────────────────────────────────────┐
│ Header (Public)                         │
├─────────────────────────────────────────┤
│ Hero Section                            │
├─────────────────────────────────────────┤
│ Content Sections                        │
│                                         │
├─────────────────────────────────────────┤
│ Footer                                  │
└─────────────────────────────────────────┘
```

### Auth Pages Layout

**Purpose:** Login, register, password reset

**Features:**
- Centered form
- Minimal navigation
- Branding

**Layout:**
```
┌─────────────────────────────────────────┐
│              [Logo]                     │
│                                         │
│         [Login Form]                    │
│                                         │
│                                         │
└─────────────────────────────────────────┘
```

## Layout Guidelines

### Spacing

- **Page Padding:** 24px (desktop), 16px (tablet)
- **Section Spacing:** 32px (desktop), 24px (tablet)
- **Component Spacing:** 16px - 24px

### Content Width

- **Max Width:** 1280px (desktop)
- **Container Padding:** 24px (desktop), 16px (tablet)

### Grid System

- **Columns:** 12-column grid (desktop)
- **Gutters:** 24px (desktop), 16px (tablet)

## Related Documents

### Primary References
- [routing-structure.md](./routing-structure.md) - **Route definitions and Next.js App Router structure** (SINGLE SOURCE OF TRUTH for route paths)
- [route-inventory.md](./route-inventory.md) - Route implementation status and detailed status matrix
- [route-naming-decision.md](./route-naming-decision.md) - Route naming conventions and standards

### Supporting Documents
- [design-system.md](./design-system.md) - Design tokens, colors, typography (used in navigation components)
- [ui-component-specifications.md](./ui-component-specifications.md) - Component library specifications (Sidebar, Header, Breadcrumbs components)
- [role-based-ui-patterns.md](./role-based-ui-patterns.md) - Role-based UI adaptations (role-based navigation visibility)
- [state-management-ui-patterns.md](./state-management-ui-patterns.md) - State management patterns (loading states for navigation)
- [form-design-patterns.md](./form-design-patterns.md) - Form patterns (search forms in navigation)

### Architecture & Governance
- [System Architecture](../system-architecture.md) - System overview
- [Security Architecture](../security/security-architecture.md) - Security details
- [Historical Data Routing Proposal](./historical-data-routing-proposal.md) - Historical data access patterns and implementation details
- [Regulatory Framework](../../../03-governance/regulatory-framework.md) - Comprehensive regulatory reference
- [Compliance Requirements](../../../03-governance/compliance-requirements.md) - Detailed compliance requirements
- [Regulatory Policies](../../../03-governance/regulatory-policies.md) - Regulatory policies and guidelines

### Documentation
- [Frontend Documentation README](./README.md) - Frontend documentation overview and navigation guide

### External References
- [Next.js Layout Documentation](https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts)
- [WCAG Navigation Guidelines](https://www.w3.org/WAI/WCAG21/quickref/#navigable)

---

## Historical Data Navigation Updates

**Status:** ✅ Historical data navigation items added  
**Implementation:** See [Historical Data Routing Proposal](./historical-data-routing-proposal.md) for complete specifications

**Navigation Updates:**
- **History Link:** Added to all role sidebars (links to `/history`)
- **Audit Link:** Added to MOH Tier 1/2 sidebars (links to `/audit/logs`)
- **Submissions History:** Added to VCI section (links to `/vci/submissions/history`)
- **Trends Link:** Added to VCI section for Tier 1 (links to `/vci/submissions/history/trends`)
- **Treemap Link:** Added to VCI section for Tier 1/2 (links to `/vci/treemap`)
- **Export History:** Added to ECS section if historical data exists
- **Score History:** Added to CMC section if historical data exists
- **Inactive Module Indicators:** "Historical" badge shown when module inactive but data exists
- **Breadcrumb Updates:** Historical route breadcrumbs documented

**Key Features:**
- Navigation items check data existence, not module status
- Clear visual indicators for inactive modules with historical data
- Role-based navigation (History/Audit links per role)
- Breadcrumb patterns for all historical routes

---

**Last Updated:** 2025-12-31  
**Next Steps:**
1. Implement layout components
2. Create responsive breakpoint utilities
3. Build navigation components
4. Test keyboard navigation and accessibility
5. Implement historical data navigation items

