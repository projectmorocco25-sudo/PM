# Navigation and Layout Patterns - Pharmaceutical Governance Value Chain Platform (PM)

**Purpose:** This document defines navigation patterns, layout structures, and responsive design patterns for the PM platform.

**Last Updated:** 2025-12-31  
**Status:** ✅ Complete (Phase 0, Frontend UI/UX Gap Resolution)  
**Owner:** Emma (UI/UX + Next.js Frontend Specialist)

## Overview

The PM platform uses a consistent navigation and layout structure across all modules, with role-based adaptations. The layout is optimized for desktop and tablet devices, with responsive breakpoints for different screen sizes.

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
┌──────────┐
│ RMM      │
│ ├ Companies│
│ ├ Products │
│ └ SKUs    │
│           │
│ VCI       │
│ ├ Dashboard│
│ ├ Submissions│
│ └ Thresholds│
│           │
│ ECS       │
│ └ Export  │
│           │
│ CMC       │
│ └ Scores  │
└──────────┘
```

**Implementation:**
```tsx
<Sidebar collapsed={isCollapsed} onToggle={handleToggle}>
  <SidebarGroup label="RMM" icon={Building}>
    <SidebarItem href="/rmm" icon={Building2} active>
      Companies
    </SidebarItem>
    <SidebarItem href="/rmm/products" icon={Package}>
      Products
    </SidebarItem>
    <SidebarItem href="/rmm/skus" icon={Box}>
      SKUs
    </SidebarItem>
  </SidebarGroup>
  
  <SidebarGroup label="VCI" icon={BarChart}>
    <SidebarItem href="/vci" icon={LayoutDashboard} active>
      Dashboard
    </SidebarItem>
    <SidebarItem href="/vci/submissions" icon={FileText} badge={pendingCount}>
      Submissions
    </SidebarItem>
  </SidebarGroup>
  
  {/* History link - always visible */}
  <SidebarItem href="/history" icon={History}>
    History
  </SidebarItem>
  
  {/* Module activation check OR historical data exists */}
  {(isECSActive || hasHistoricalECSData) && (
    <SidebarGroup label="ECS" icon={Plane}>
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
    <SidebarGroup label="CMC" icon={BarChart}>
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
</Sidebar>
```

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
- `/vci/submissions/history` → Home > VCI > Submissions > History
- `/vci/submissions/history/trends` → Home > VCI > Submissions > History > Trends
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
├── Dashboard
├── RMM
│   ├── Products (links to /rmm/products - RLS filters to own company)
│   └── SKUs (links to /rmm/skus - RLS filters to own company)
├── Submissions
│   ├── AAMS
│   ├── MSQ
│   └── WSL
├── History (links to /history)
├── Export Requests (if ECS active OR historical data exists)
│   └── Export History (if historical data exists)
├── Compliance Scores (if CMC active OR historical data exists)
│   └── Score History (if historical data exists)
└── Profile
```

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
├── Dashboard (Governance)
├── RMM
│   ├── Companies
│   ├── Products
│   └── SKUs
├── VCI
│   ├── Submissions
│   ├── Submissions History (links to /vci/submissions/history)
│   ├── Trends (Tier 1 only - links to /vci/submissions/history/trends)
│   ├── Thresholds
│   └── Breaches
├── History (links to /history - system-wide historical overview)
├── Audit (Tier 1/2 - links to /audit/logs)
├── ECS (if active OR historical data exists)
│   ├── Export Requests
│   └── Export History (if historical data exists)
├── CMC (if active OR historical data exists)
│   ├── Compliance Scores
│   └── Score History (if historical data exists)
└── System Configuration (Tier 1 only)
```

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
├── Audit Logs (primary - links to /audit/logs)
├── Audit Reports (links to /audit/reports)
├── Activity Summary (links to /audit/activity)
├── RMM (read-only for audit purposes)
│   ├── Companies (links to /rmm/companies - read-only, RLS filters)
│   ├── Products (links to /rmm/products - read-only, RLS filters)
│   └── SKUs (links to /rmm/skus - read-only, RLS filters)
└── Profile
```

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

## References

- [Next.js Layout Documentation](https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts)
- [WCAG Navigation Guidelines](https://www.w3.org/WAI/WCAG21/quickref/#navigable)
- [Historical Data Routing Proposal](./historical-data-routing-proposal.md) - Historical data access patterns

---

## Historical Data Navigation Updates

**Status:** ✅ Historical data navigation items added  
**Implementation:** See [Historical Data Routing Proposal](./historical-data-routing-proposal.md) for complete specifications

**Navigation Updates:**
- **History Link:** Added to all role sidebars (links to `/history`)
- **Audit Link:** Added to MOH Tier 1/2 sidebars (links to `/audit/logs`)
- **Submissions History:** Added to VCI section (links to `/vci/submissions/history`)
- **Trends Link:** Added to VCI section for Tier 1 (links to `/vci/submissions/history/trends`)
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

