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
  
  {/* Module activation check */}
  {isECSActive && (
    <SidebarGroup label="ECS" icon={Plane}>
      <SidebarItem href="/ecs" icon={PlaneTakeoff}>
        Export Requests
      </SidebarItem>
    </SidebarGroup>
  )}
</Sidebar>
```

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
├── Submissions
│   ├── AAMS
│   ├── MSQ
│   └── WSL
├── Export Requests (if ECS active)
└── Profile
```

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
│   ├── Thresholds
│   └── Breaches
├── ECS (if active)
├── CMC (if active)
└── System Configuration
```

### Auditor Layout

**Features:**
- Read-only access
- Audit log viewer
- Reports
- No action buttons

**Sidebar Structure:**
```
├── Audit Logs
├── Reports
└── Compliance Overview
```

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

---

**Next Steps:**
1. Implement layout components
2. Create responsive breakpoint utilities
3. Build navigation components
4. Test keyboard navigation and accessibility

