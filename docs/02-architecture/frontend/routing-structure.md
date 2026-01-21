# Frontend Routing Structure - Pharmaceutical Governance Value Chain Platform (PM)

**Purpose:** This document defines the Next.js App Router structure, route organization, navigation patterns, and protected route implementation.

**Last Updated:** 2026-01-12  
**Status:** ⚠️ PARTIALLY COMPLETE - Route fixes in progress (Phase 1.1.1.FIX)  
**Owner:** Emma (UI/UX + Next.js Frontend Specialist)

**⚠️ CRITICAL:** This document is the SINGLE SOURCE OF TRUTH for route definitions. Route implementation status is tracked in [route-inventory.md](./route-inventory.md). Route naming convention is defined in [route-naming-decision.md](./route-naming-decision.md).

**📋 Quick Reference:** For detailed route status matrix, see [route-inventory.md](./route-inventory.md). For route naming decisions, see [route-naming-decision.md](./route-naming-decision.md).

## Overview

The PM platform uses Next.js 13+ App Router for frontend routing, organized by module (RMM, VCI, ECS, CMC) with role-based access control and protected routes.

**📋 Quick Reference:**
- **Route implementation status:** See [route-inventory.md](./route-inventory.md) - SINGLE SOURCE OF TRUTH for route status
- **Wireframe-route mapping:** See [wireframe-route-mapping.md](./wireframe-route-mapping.md) - SINGLE SOURCE OF TRUTH for wireframe-route relationships
- **Route naming conventions:** See [route-naming-decision.md](./route-naming-decision.md)

---

## Routing Principles

1. **Module-Based Organization:** Routes organized by module
2. **Role-Based Access:** Different routes for different user roles
3. **Protected Routes:** Authentication and authorization checks
4. **Deep Linking:** Support for direct links to specific resources
5. **Navigation Consistency:** Consistent navigation patterns

## Next.js App Router Structure

### Directory Structure

```
app/
├── (public)/
│   ├── page.tsx (Homepage - MOH Governance & Regulation Mission)
│   ├── layout.tsx (Public layout)
│   ├── about/
│   │   └── page.tsx
│   ├── support/
│   │   ├── page.tsx
│   │   ├── faq/
│   │   │   └── page.tsx
│   │   ├── contact/
│   │   │   └── page.tsx
│   │   └── documentation/
│   │       └── page.tsx
│   ├── legal/
│   │   ├── terms/
│   │   │   └── page.tsx
│   │   ├── privacy/
│   │   │   └── page.tsx
│   │   └── cookies/
│   │       └── page.tsx
│   └── status/
│       └── page.tsx (System status page)
├── (auth)/
│   ├── login/
│   │   └── page.tsx
│   ├── register/
│   │   └── page.tsx
│   ├── forgot-password/
│   │   └── page.tsx
│   ├── reset-password/
│   │   └── page.tsx
│   └── layout.tsx
├── (dashboard)/
│   ├── layout.tsx (Protected layout)
│   ├── page.tsx (Dashboard home)
│   ├── history/
│   │   └── page.tsx (Role-based historical overview)
│   ├── audit/
│   │   ├── logs/
│   │   │   ├── page.tsx (Audit log list - MOH/Auditors only)
│   │   │   └── [id]/
│   │   │       └── page.tsx (Audit log detail)
│   │   └── reports/
│   │       └── page.tsx (Audit reports - MOH/Auditors only)
│   ├── notifications/
│   │   └── page.tsx
│   ├── profile/
│   │   └── page.tsx
│   ├── communications/
│   │   ├── inbox/
│   │   │   ├── page.tsx (Inbox - all conversations)
│   │   │   └── [conversation_id]/
│   │   │       └── page.tsx (Conversation detail)
│   │   ├── sent/
│   │   │   └── page.tsx (Sent messages)
│   │   ├── compose/
│   │   │   └── page.tsx (Compose new message)
│   │   ├── announcements/
│   │   │   └── page.tsx (System announcements - MOH Tier 1 only)
│   │   └── archived/
│   │       └── page.tsx (Archived conversations)
│   ├── rmm/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── companies/
│   │   │   ├── page.tsx (List)
│   │   │   ├── [id]/
│   │   │   │   ├── page.tsx (Detail - Tabs: Overview | Products | History)
│   │   │   │   ├── edit/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── products/
│   │   │   │       └── page.tsx
│   │   │   └── new/
│   │   │       └── page.tsx
│   │   ├── products/
│   │   │   ├── page.tsx
│   │   │   ├── [id]/
│   │   │   │   └── page.tsx (Detail - Tabs: Overview | SKUs | History)
│   │   │   └── new/
│   │   │       └── page.tsx
│   │   └── skus/
│   │       ├── page.tsx
│   │       ├── [id]/
│   │       │   └── page.tsx (Detail - Tabs: Overview | History)
│   │       └── new/
│   │           └── page.tsx
│   ├── vci/
│   │   ├── layout.tsx
│   │   ├── page.tsx (Dashboard)
│   │   ├── thresholds/
│   │   │   ├── page.tsx (Threshold Management - MOH Tier 1 only)
│   │   │   ├── pending-reversions/
│   │   │   │   └── page.tsx (Pending Reversions List - MOH Tier 1 & Tier 2)
│   │   │   └── [id]/
│   │   │       ├── page.tsx (Threshold Detail)
│   │   │       └── revert-review/
│   │   │           └── page.tsx (Reversion Review - MOH Tier 1 only)
│   │   ├── submissions/
│   │   │   ├── aams/
│   │   │   │   ├── page.tsx (List - supports ?year=2023 query param)
│   │   │   │   ├── [id]/
│   │   │   │   │   └── page.tsx (Detail - Tabs: Details | History | Corrections)
│   │   │   │   └── new/
│   │   │   │       └── page.tsx
│   │   │   ├── msq/
│   │   │   │   ├── page.tsx (List - supports ?year=2023&month=6 query params)
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx (Detail - Tabs: Details | History | Corrections)
│   │   │   ├── wsl/
│   │   │   │   ├── page.tsx (List - supports ?week=2023-W01 query param)
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx (Detail - Tabs: Details | History)
│   │   │   └── history/
│   │   │       ├── page.tsx (All past submissions - filterable by type, year, company)
│   │   │       └── trends/
│   │   │           └── page.tsx (Trend analysis charts - MOH only)
│   │   ├── thresholds/
│   │   │   ├── page.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx (Detail - includes threshold modification history)
│   │   ├── breaches/
│   │   │   ├── page.tsx (List - supports ?status=resolved&year=2023 query params)
│   │   │   └── [id]/
│   │   │       └── page.tsx (Detail - Tabs: Details | History | Analysis)
│   │   ├── governance/
│   │   │   └── page.tsx (MOH only)
│   │   └── treemap/
│   │       └── page.tsx (Tier 1 & Tier 2 - ATC treemap, supports ?atc=J01 query param for products treemap)
│   ├── ecs/
│   │   ├── layout.tsx (Module activation check OR historical data exists)
│   │   ├── page.tsx
│   │   ├── export-requests/
│   │   │   ├── page.tsx
│   │   │   ├── [id]/
│   │   │   │   └── page.tsx (Detail - includes export history)
│   │   │   └── new/
│   │   │       └── page.tsx
│   │   ├── exports/
│   │   │   └── history/
│   │   │       └── page.tsx (Historical export authorizations - checks has_historical_ecs_data())
│   │   └── authorizations/
│   │       ├── page.tsx
│   │       └── [id]/
│   │           └── page.tsx (Historical authorization detail)
│   └── cmc/
│       ├── layout.tsx (Module activation check OR historical data exists)
│       ├── page.tsx
│       ├── scores/
│       │   ├── page.tsx (List - supports ?year=2023 query param)
│       │   ├── [id]/
│       │   │   └── page.tsx (Detail - Tabs: Current | History | Trends)
│       │   └── history/
│       │       └── page.tsx (Historical compliance scores - checks has_historical_cmc_data())
│       ├── disputes/
│       │   ├── page.tsx
│       │   ├── [id]/
│       │   │   └── page.tsx
│       │   └── history/
│       │       └── page.tsx (Historical disputes)
│       └── reports/
│           ├── page.tsx
│           └── [id]/
│               └── page.tsx
│   └── enforcement/
│       ├── layout.tsx (MOH Tier 1 and Tier 2 only)
│       ├── page.tsx (Enforcement Dashboard - summary, recent actions, pending approvals)
│       ├── actions/
│       │   ├── page.tsx (List of all enforcement actions - filterable, searchable)
│       │   ├── [id]/
│       │   │   └── page.tsx (Enforcement action detail - workflow, history, appeals)
│       │   └── new/
│       │       └── page.tsx (Create new enforcement action - wizard)
│       ├── pending-approvals/
│       │   └── page.tsx (Actions pending Tier 1 approval)
│       └── reports/
│           └── page.tsx (Enforcement analytics and reporting)
└── layout.tsx (Root layout)
```

---

## Historical Data Routes

### Overview

Historical data routes provide access to past submissions, compliance scores, audit logs, and registry changes. These routes support the 7-year data retention requirement and enable trend analysis, compliance monitoring, and regulatory reporting.

**Key Principles:**
- Historical data is accessible based on data existence and user permissions, not module activation status
- All historical data is read-only (immutable for regulatory compliance)
- Routes check for data existence using RPC functions (`has_historical_ecs_data()`, `has_historical_cmc_data()`)
- Module activation status is indicated via UI (banners, badges) but doesn't block access

### Historical Data Access Patterns

**1. History Tabs on Detail Pages:**
- Companies: `/rmm/companies/[id]` → History tab
- Products: `/rmm/products/[id]` → History tab
- SKUs: `/rmm/skus/[id]` → History tab
- Submissions: `/vci/submissions/{type}/[id]` → History tab
- Compliance Violations: `/vci/breaches/[id]` → History tab
- Regulatory Compliance Ratings: `/cmc/scores/[id]` → History tab

**2. Filtered List Views:**
- AAMS: `/vci/submissions/aams?year=2023`
- MSQ: `/vci/submissions/msq?year=2023&month=6`
- WSL: `/vci/submissions/wsl?week=2023-W01`
- Compliance Violations: `/vci/breaches?status=resolved&year=2023`
- Regulatory Compliance Ratings: `/cmc/scores?year=2023`

**3. Dedicated History Routes:**
- `/history` - Role-based historical overview
- `/audit/logs` - Audit log viewer (MOH/Auditors only)
- `/audit/reports` - Audit reports (MOH/Auditors only)
- `/vci/submissions/history` - All past submissions (filterable - Regulatory Submission History)
- `/vci/submissions/history/trends` - Compliance trend analysis charts (MOH only)
- `/ecs/exports/history` - Export Authorization History (historical export authorizations)
- `/cmc/scores/history` - Historical regulatory compliance ratings
- `/cmc/disputes/history` - Historical disputes
- `/enforcement` - Enforcement dashboard (MOH Tier 1 and Tier 2 only)
- `/enforcement/actions` - Enforcement actions list
- `/enforcement/actions/[id]` - Enforcement action detail
- `/enforcement/actions/new` - Create new enforcement action
- `/enforcement/pending-approvals` - Actions pending Tier 1 approval
- `/enforcement/reports` - Enforcement analytics and reporting

**4. Communication Routes:**
- `/communications/inbox` - Inbox (all conversations, filterable by type, workflow entity, company)
- `/communications/inbox/[conversation_id]` - Conversation detail (message thread, reply interface)
- `/communications/sent` - Sent messages
- `/communications/compose` - Compose new message
- `/communications/announcements` - System announcements (MOH Tier 1 only)
- `/communications/archived` - Archived conversations

**5. Analytics Routes:**
- `/vci/treemap` - Treemap visualization (Tier 1 & Tier 2 - ATC level, supports ?atc=J01 query param for products level)

### Module Activation Considerations

**For Optional Modules (ECS, CMC):**

Historical routes for ECS and CMC check for **data existence**, not module activation status:

```typescript
// Route protection pattern
export default async function ECSExportHistoryPage() {
  // Check data existence, not module status
  const { data: hasData } = await supabase.rpc('has_historical_ecs_data', {
    p_company_id: companyId || null
  });
  
  if (!hasData) {
    return <EmptyState>No historical export data available</EmptyState>;
  }
  
  // Check permissions
  if (!canAccessHistoricalData(userRole, 'ecs', companyId)) {
    return <Unauthorized />;
  }
  
  // Show module status indicator if inactive
  const isActive = await isModuleActive('ecs');
  return (
    <div>
      {!isActive && <InactiveModuleAlert module="ECS" />}
      <ExportHistory data={historicalData} readOnly={!isActive} />
    </div>
  );
}
```

**UI Indicators:**
- Informational banner when module is inactive but historical data exists
- "Historical Data (Read-Only)" badge
- Module activation period display (from/to dates)
- Navigation shows module with "Historical" badge if inactive but data exists

---

## Route Organization

### Route Groups

**`(public)` - Public Routes (No Authentication Required):**
- `/` - Homepage (MOH Governance & Regulation Mission)
- `/about` - About MOH's regulatory mission
- `/support` - Support center
- `/support/faq` - Frequently asked questions
- `/support/contact` - Contact support
- `/support/documentation` - User documentation
- `/legal/terms` - Terms of service
- `/legal/privacy` - Privacy policy
- `/legal/cookies` - Cookie policy
- `/status` - System status page
- **Access:** Anyone (authenticated or unauthenticated)

**`(auth)` - Authentication Routes (No Authentication Required, Redirect if Already Authenticated):**
- `/login` - User login
- `/register` - User registration (if applicable)
- `/forgot-password` - Password reset request
- `/reset-password` - Password reset (with token)
- **Access:** 
  - Unauthenticated users: Can access
  - Authenticated users: Redirected to dashboard

**`(dashboard)` - Protected Dashboard Routes (Authentication Required):**
- All routes require authentication
- Role-based access control
- Module-based organization
- **Access:**
  - Authenticated users: Can access (with role-based authorization)
  - Unauthenticated users: Redirected to `/login`

---

## Public Routes

### Homepage (`/`)

**Purpose:** Landing page that communicates MOH's governance and regulatory mission

**Content:**
- **MOH Mission:** Governance and regulation of pharmaceutical value chain
- **Partnership Focus:** How MOH works with pharmaceutical partners (IPCs and Wholesalers)
- **Public Health Purpose:** Fulfilling pharmaceutical needs of the Moroccan people
- **Regulatory Framework:** Overview of MOH's regulatory approach and oversight
- **Platform as Tool:** Brief mention that the platform supports this mission (secondary focus)
- **Call to Action:** Login for partners, information for public

**Tone:**
- Government/public service focused
- Mission-driven, not product-focused
- Emphasizes partnership and collaboration
- Highlights public health outcomes

**Target Audience:**
- Pharmaceutical companies (IPCs, Wholesalers) - primary users
- General public - information about MOH's regulatory work
- MOH staff - internal reference

**Access:** Public (no authentication required)

---

### About (`/about`)

**Purpose:** Information about MOH's regulatory mission and approach

**Content:**
- MOH's role in pharmaceutical governance
- Regulatory framework overview
- Partnership with pharmaceutical companies
- Public health objectives
- Contact information

**Access:** Public (no authentication required)

---

### Support Routes

**`/support` - Support Center:**
- Main support page
- Links to FAQ, contact, documentation
- Help resources
- Support hours and response times

**`/support/faq` - Frequently Asked Questions:**
- Common questions and answers
- Searchable FAQ
- Category-based organization
- Topics: Registration, submissions, compliance, etc.

**`/support/contact` - Contact Support:**
- Contact form
- Support email
- Support hours
- Response time expectations
- Escalation procedures

**`/support/documentation` - User Documentation:**
- User guides
- API documentation (if public)
- Video tutorials
- Getting started guides
- Submission procedures

**Access:** Public (no authentication required)

---

### Legal Routes

**`/legal/terms` - Terms of Service:**
- Platform terms and conditions
- User agreements
- Service level agreements
- MOH regulatory requirements

**`/legal/privacy` - Privacy Policy:**
- Data privacy policy
- Data collection practices
- User rights
- GDPR compliance (if applicable)
- MOH data handling procedures

**`/legal/cookies` - Cookie Policy:**
- Cookie usage
- Cookie types
- Cookie preferences
- Opt-out options

**Access:** Public (no authentication required)

---

### System Status (`/status`)

**Purpose:** System status and uptime information

**Content:**
- Current system status
- Service availability
- Incident history
- Maintenance schedule
- System health indicators

**Access:** Public (no authentication required)

---

## Route Patterns

### Pattern 1: List Routes

**Format:** `/{module}/{entity}/page.tsx`

**Examples:**
- `/rmm/companies` - List all companies
- `/vci/submissions/aams` - List AAMS submissions
- `/ecs/export-requests` - List export requests

**Implementation:**
```typescript
// app/(dashboard)/rmm/companies/page.tsx
export default async function CompaniesPage() {
  const { data: companies } = await getCompanies();
  
  return (
    <div>
      <h1>Companies</h1>
      <CompaniesList companies={companies} />
    </div>
  );
}
```

---

### Pattern 2: Detail Routes

**Format:** `/{module}/{entity}/[id]/page.tsx`

**Examples:**
- `/rmm/companies/[id]` - Company detail
- `/vci/submissions/aams/[id]` - AAMS submission detail
- `/ecs/export-requests/[id]` - Export request detail

**Implementation:**
```typescript
// app/(dashboard)/rmm/companies/[id]/page.tsx
export default async function CompanyDetailPage({ params }: { params: { id: string } }) {
  const { data: company } = await getCompany(params.id);
  
  return (
    <div>
      <h1>{company.name}</h1>
      <CompanyDetail company={company} />
    </div>
  );
}
```

---

### Pattern 3: Create/Edit Routes

**Format:** `/{module}/{entity}/new/page.tsx` or `/{module}/{entity}/[id]/edit/page.tsx`

**Examples:**
- `/rmm/companies/new` - Create company
- `/rmm/companies/[id]/edit` - Edit company
- `/vci/submissions/aams/new` - Create AAMS submission

---

## Protected Routes

### Authentication Check

**Middleware:**
```typescript
// middleware.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  
  const {
    data: { session },
  } = await supabase.auth.getSession();
  
  const pathname = req.nextUrl.pathname;
  
  // Public routes (no authentication required)
  const publicRoutes = [
    '/',
    '/about',
    '/support',
    '/legal',
    '/status',
  ];
  
  // Auth routes (no authentication required, but redirect if already authenticated)
  const authRoutes = [
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
  ];
  
  // Check if route is public
  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  );
  
  // Check if route is auth route
  const isAuthRoute = authRoutes.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  );
  
  // Redirect authenticated users away from auth pages
  if (session && isAuthRoute) {
    return NextResponse.redirect(new URL('/', req.url));
  }
  
  // Protect dashboard routes (redirect to login if not authenticated)
  if (!isPublicRoute && !isAuthRoute && !session) {
    return NextResponse.redirect(new URL('/login', req.url));
  }
  
  return res;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
```

---

### Authorization Check

**Component-Level:**
```typescript
// components/ProtectedRoute.tsx
'use client';

import { useUser } from '@/hooks/useUser';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function ProtectedRoute({ 
  children, 
  requiredRole 
}: { 
  children: React.ReactNode;
  requiredRole?: string[];
}) {
  const { user, loading } = useUser();
  const router = useRouter();
  
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
      return;
    }
    
    if (requiredRole && user && !requiredRole.includes(user.role)) {
      router.push('/dashboard');
      return;
    }
  }, [user, loading, requiredRole, router]);
  
  if (loading || !user) {
    return <div>Loading...</div>;
  }
  
  if (requiredRole && !requiredRole.includes(user.role)) {
    return <div>Access Denied</div>;
  }
  
  return <>{children}</>;
}
```

**Usage:**
```typescript
// app/(dashboard)/vci/governance/page.tsx
import { ProtectedRoute } from '@/components/ProtectedRoute';

export default function GovernancePage() {
  return (
    <ProtectedRoute requiredRole={['tier1', 'tier2_officer']}>
      <GovernanceDashboard />
    </ProtectedRoute>
  );
}
```

---

## Navigation Structure

### Public Navigation (Unauthenticated Users)

**Header Navigation:**
- Home
- About
- Support
- Legal
- Status
- Login

**Footer Navigation:**
- About
- Support (FAQ, Contact, Documentation)
- Legal (Terms, Privacy, Cookies)
- Status
- Contact Information

---

### Authenticated Navigation

**Company Users:**
- Dashboard
- Communications (Inbox, Sent, Compose)
- RMM (Companies, Products, SKUs)
- VCI (Submissions, Thresholds, Compliance Violations)
- History (links to `/history` - personal historical overview)
- ECS (if active OR historical data exists) - Export Requests, History
- CMC (if active OR historical data exists) - Scores, Disputes, History
- Notifications
- Profile
- Support (link to public support)
- Logout

**MOH Users (Tier 1):**
- Dashboard
- Communications (Inbox, Sent, Compose, Announcements)
- RMM (All Companies, Governance)
- VCI (All Submissions, Governance Dashboard, Trends, Treemap)
- History (links to `/history` - system-wide historical overview)
- Audit (links to `/audit/logs` - full audit log viewer)
- System Configuration
- ECS (if active OR historical data exists) - All Export Requests, Authorizations, History
- CMC (if active OR historical data exists) - All Scores, Reports, History
- Notifications
- Profile
- Support (link to public support)
- Logout

**MOH Users (Tier 2):**
- Dashboard
- Communications (Inbox, Sent, Compose)
- RMM (All Companies, Governance)
- VCI (All Submissions, Governance Dashboard, Treemap)
- History (links to `/history` - oversight historical overview)
- Audit (links to `/audit/logs` - audit log viewer, read-only)
- ECS (if active OR historical data exists) - All Export Requests, Authorizations, History
- CMC (if active OR historical data exists) - All Scores, Reports, History
- Notifications
- Profile
- Support (link to public support)
- Logout

**Auditors:**
- Audit Logs (primary - links to `/audit/logs`)
- Audit Reports (links to `/audit/reports`)
- Activity Summary
- Profile
- Support (link to public support)
- Logout

---

## Deep Linking

### Supported Deep Links

**Format:** `/{module}/{entity}/{id}`

**Examples:**
- `/rmm/companies/{company_id}` - Direct link to company
- `/vci/submissions/aams/{submission_id}` - Direct link to AAMS submission
- `/ecs/export-requests/{request_id}` - Direct link to export request

**Implementation:**
- All detail routes support direct access
- Authorization checked on page load
- Redirect if user doesn't have access

---

## Route Protection Checklist

### For Each Route:

- [ ] Authentication check (middleware or component)
- [ ] Authorization check (role-based)
- [ ] Module activation check (for optional modules)
- [ ] Error handling (404, 403)
- [ ] Loading states
- [ ] Breadcrumbs (if applicable)

---

## Related Documents

### Primary References
- [route-inventory.md](./route-inventory.md) - **SINGLE SOURCE OF TRUTH** for route implementation status and detailed status matrix
- [wireframe-route-mapping.md](./wireframe-route-mapping.md) - **SINGLE SOURCE OF TRUTH** for wireframe-route relationships
- [route-naming-decision.md](./route-naming-decision.md) - Route naming conventions and standards
- [navigation-layout-patterns.md](./navigation-layout-patterns.md) - Navigation structure (sidebar organization, layout patterns)

### Supporting Documents
- [README.md](./README.md) - Frontend documentation overview and navigation guide
- [role-based-ui-patterns.md](./role-based-ui-patterns.md) - Role-based UI patterns (role-based routes and route protection)
- [historical-data-routing-proposal.md](./historical-data-routing-proposal.md) - Historical data routing (historical route definitions and access patterns)
- [ui-component-specifications.md](./ui-component-specifications.md) - Component library specifications (route components, breadcrumbs)
- [state-management-ui-patterns.md](./state-management-ui-patterns.md) - State management patterns (route loading states)

### Architecture & Governance
- [System Architecture](../system-architecture.md) - System overview
- [Security Architecture](../security/security-architecture.md) - Security details (route protection, authentication)
- [Regulatory Framework](../../../03-governance/regulatory-framework.md) - Comprehensive regulatory reference
- [Compliance Requirements](../../../03-governance/compliance-requirements.md) - Detailed compliance requirements
- [Regulatory Policies](../../../03-governance/regulatory-policies.md) - Regulatory policies and guidelines

---

## Historical Data Routes Implementation

**Status:** ✅ Historical data routes added to routing structure  
**Implementation:** See [Historical Data Routing Proposal](./historical-data-routing-proposal.md) for complete specifications

**Key Additions:**
- History tabs on detail pages (companies, products, submissions, compliance violations, scores)
- Filtered list views with query parameters (year, month, status)
- Dedicated history routes (`/history`, `/audit/logs`, `/vci/submissions/history`, etc.)
- Module activation considerations (data existence checks, not module status)
- Navigation updates (history/audit links for all roles)

---

**Last Updated:** 2025-12-31  
**Next Review Date:** [To be scheduled]  
**Owner:** Emma (UI/UX + Next.js Frontend Specialist)

