# Frontend Route & File Index

**Purpose:** Complete index of all routes, their file locations, component structure, and implementation status. This document acts as a contents/index page for the frontend codebase.

**Last Updated:** 2026-01-22  
**Status:** 🔄 IN PROGRESS - Updated after Tasks 1.1.1.13-1.1.1.24  
**Owners:** Yasmine (Frontend Developer), Oliver (Frontend Developer)  
**Review Required:** Yasmine and Oliver pushback requested

**⚠️ CRITICAL:** This document is updated after each relevant task implementation. It serves as the SINGLE SOURCE OF TRUTH for route-to-file mapping.

---

## File Structure Overview

```
PM/
├── app/                          # Next.js App Router routes
│   ├── layout.tsx               # Root layout (all pages)
│   ├── globals.css              # Global styles
│   ├── (public)/                # Public route group
│   │   ├── layout.tsx          # Public layout
│   │   ├── page.tsx            # Homepage (/)
│   │   ├── about/
│   │   │   └── page.tsx        # About page
│   │   ├── support/
│   │   │   ├── page.tsx        # Support center
│   │   │   ├── faq/
│   │   │   │   └── page.tsx    # FAQ page
│   │   │   ├── contact/
│   │   │   │   └── page.tsx    # Contact support
│   │   │   └── documentation/
│   │   │       └── page.tsx    # Documentation
│   │   ├── legal/
│   │   │   ├── terms/
│   │   │   │   └── page.tsx    # Terms of Service
│   │   │   ├── privacy/
│   │   │   │   └── page.tsx    # Privacy Policy
│   │   │   └── cookies/
│   │   │       └── page.tsx    # Cookie Policy
│   │   └── status/
│   │       └── page.tsx        # System status
│   ├── (auth)/                  # Auth route group
│   │   ├── layout.tsx          # Auth layout
│   │   ├── login/
│   │   │   └── page.tsx        # Login page
│   │   ├── register/
│   │   │   └── page.tsx        # Registration page
│   │   ├── forgot-password/
│   │   │   └── page.tsx        # Forgot password
│   │   └── reset-password/
│   │       └── page.tsx        # Reset password
│   └── (dashboard)/             # Dashboard route group
│       ├── layout.tsx           # Dashboard layout (Header + Sidebar)
│       ├── page.tsx             # Dashboard home (/dashboard)
│       ├── profile/
│       │   └── page.tsx         # User profile page
│       ├── notifications/
│       │   └── page.tsx         # Notifications page
│       ├── history/
│       │   └── page.tsx         # History overview (placeholder)
│       ├── audit/
│       │   ├── logs/
│       │   │   ├── page.tsx     # Audit logs list (placeholder)
│       │   │   └── [id]/
│       │   │       └── page.tsx # Audit log detail (placeholder)
│       │   └── reports/
│       │       └── page.tsx     # Audit reports (placeholder)
│       └── communications/
│           ├── inbox/
│           │   ├── page.tsx     # Inbox list
│           │   └── [conversation_id]/
│           │       └── page.tsx # Conversation detail
│           ├── compose/
│           │   └── page.tsx     # Compose message
│           ├── sent/
│           │   └── page.tsx     # Sent messages
│           ├── announcements/
│           │   └── page.tsx     # System announcements (MOH Tier 1 only)
│           └── archived/
│               └── page.tsx     # Archived conversations
│
├── components/                   # React components
│   ├── layout/                   # Layout components
│   │   ├── Header.tsx           # Header component (all dashboard pages)
│   │   ├── Sidebar.tsx          # Sidebar navigation (all dashboard pages)
│   │   ├── NotificationCenter.tsx # Notification dropdown (Header)
│   │   └── UserMenu.tsx         # User menu dropdown (Header)
│   └── PlaceholderPage.tsx      # Reusable placeholder component
│
├── lib/                          # Utility libraries
│   ├── supabase/                # Supabase clients
│   │   ├── client.ts           # Browser client
│   │   └── server.ts            # Server client
│   ├── constants/               # Constants
│   │   ├── roles.ts            # User role constants
│   │   └── modules.ts           # Module constants
│   ├── hooks/                   # Custom React hooks
│   │   ├── use-user-permissions.ts
│   │   ├── use-notifications.ts
│   │   └── use-module-activation.ts
│   └── utils/                   # Utilities
│       └── cn.ts                # Tailwind class name utility
│
└── docs/                         # Documentation
    └── 02-architecture/
        └── frontend/
            ├── routing-structure.md      # Route definitions
            ├── route-inventory.md        # Route status tracking
            └── wireframe-route-mapping.md # Wireframe mapping
```

---

## Route-to-File Mapping

### Root Routes

| Route | File Location | Status | Task | Wireframe | Notes |
|-------|--------------|--------|------|-----------|-------|
| `/` | `app/(public)/page.tsx` | ✅ Implemented | 1.1.1.13 | task-0.5.1.1 | Homepage - MOH Governance & Regulation Mission |
| `/` (layout) | `app/(public)/layout.tsx` | ✅ Implemented | 1.1.1.13 | task-0.5.1.1 | Public layout with header and footer |
| Root layout | `app/layout.tsx` | ✅ Implemented | 1.1.1.9 | N/A | Root layout for all pages |

### Authentication Routes

| Route | File Location | Status | Task | Wireframe | Notes |
|-------|--------------|--------|------|-----------|-------|
| `/login` | `app/(auth)/login/page.tsx` | ✅ Implemented | 1.1.1.10 | task-0.5.1.11 | User login |
| `/register` | `app/(auth)/register/page.tsx` | ✅ Implemented | 1.1.1.10 | task-0.5.1.12 | User registration |
| `/forgot-password` | `app/(auth)/forgot-password/page.tsx` | ✅ Implemented | 1.1.1.10 | task-0.5.1.13 | Password reset request |
| `/reset-password` | `app/(auth)/reset-password/page.tsx` | ✅ Implemented | 1.1.1.10 | task-0.5.1.13 | Password reset (with token) |
| Auth layout | `app/(auth)/layout.tsx` | ✅ Implemented | 1.1.1.10 | task-0.5.1.11/12/13 | Auth layout |

### Dashboard Routes (Protected)

| Route | File Location | Status | Task | Wireframe | Notes |
|-------|--------------|--------|------|-----------|-------|
| `/dashboard` | `app/(dashboard)/page.tsx` | ✅ Implemented | 1.1.1.11 | task-0.5.1.18/19/20 | Dashboard home (role-based structure) |
| Dashboard layout | `app/(dashboard)/layout.tsx` | ✅ Implemented | 1.1.1.9 | task-0.5.1.14 | Dashboard layout (Header + Sidebar) |
| `/history` | `app/(dashboard)/history/page.tsx` | ✅ Implemented | 1.1.1.20 | task-0.5.1.30 | Role-based historical overview (placeholder) |
| `/notifications` | `app/(dashboard)/notifications/page.tsx` | ✅ Implemented | 1.1.1.19 | task-0.5.1.31 | Notifications page |
| `/profile` | `app/(dashboard)/profile/page.tsx` | ✅ Implemented | 1.1.1.18 | task-0.5.1.22 | User profile page |
| `/settings` | `app/(dashboard)/settings/page.tsx` | 📋 Planned | TBD | TBD | User settings (referenced in UserMenu) |

### Audit Routes

| Route | File Location | Status | Task | Wireframe | Notes |
|-------|--------------|--------|------|-----------|-------|
| `/audit/logs` | `app/(dashboard)/audit/logs/page.tsx` | ✅ Implemented | 1.1.1.21 | task-0.5.1.32 | Audit log list (MOH/Auditors only, placeholder) |
| `/audit/logs/[id]` | `app/(dashboard)/audit/logs/[id]/page.tsx` | ✅ Implemented | 1.1.1.21 | task-0.5.1.33 | Audit log detail (placeholder) |
| `/audit/reports` | `app/(dashboard)/audit/reports/page.tsx` | ✅ Implemented | 1.1.1.21 | task-0.5.1.34 | Audit reports (MOH/Auditors only, placeholder) |

### Communications Routes

| Route | File Location | Status | Task | Wireframe | Notes |
|-------|--------------|--------|------|-----------|-------|
| `/communications/inbox` | `app/(dashboard)/communications/inbox/page.tsx` | ✅ Implemented | 1.1.1.22 | task-0.5.1.24 | Inbox - all conversations |
| `/communications/inbox/[conversation_id]` | `app/(dashboard)/communications/inbox/[conversation_id]/page.tsx` | ✅ Implemented | 1.1.1.22 | task-0.5.1.25 | Conversation detail |
| `/communications/sent` | `app/(dashboard)/communications/sent/page.tsx` | ✅ Implemented | 1.1.1.23 | task-0.5.1.27 | Sent messages |
| `/communications/compose` | `app/(dashboard)/communications/compose/page.tsx` | ✅ Implemented | 1.1.1.23 | task-0.5.1.26 | Compose new message |
| `/communications/announcements` | `app/(dashboard)/communications/announcements/page.tsx` | ✅ Implemented | 1.1.1.24 | task-0.5.1.28 | System announcements (MOH Tier 1 only) |
| `/communications/archived` | `app/(dashboard)/communications/archived/page.tsx` | ✅ Implemented | 1.1.1.24 | task-0.5.1.36 | Archived conversations |

### RMM (Registry Management) Routes

| Route | File Location | Status | Task | Wireframe | Notes |
|-------|--------------|--------|------|-----------|-------|
| `/rmm` | `app/(dashboard)/rmm/page.tsx` | 🔄 Placeholder | 1.1.1.12 | task-0.5.2.1 | RMM overview |
| `/rmm/layout.tsx` | `app/(dashboard)/rmm/layout.tsx` | 📋 Planned | TBD | N/A | RMM module layout |
| `/rmm/overview` | `app/(dashboard)/rmm/overview/page.tsx` | 📋 Planned | TBD | task-0.5.2.16 | RMM overview (sidebar link) |
| `/rmm/companies` | `app/(dashboard)/rmm/companies/page.tsx` | 🔄 Placeholder | 1.1.1.12 | task-0.5.2.2 | Companies list |
| `/rmm/companies/[id]` | `app/(dashboard)/rmm/companies/[id]/page.tsx` | 🔄 Placeholder | 1.1.1.12 | task-0.5.2.3 | Company detail |
| `/rmm/companies/[id]/edit` | `app/(dashboard)/rmm/companies/[id]/edit/page.tsx` | 🔄 Placeholder | 1.1.1.12 | task-0.5.2.8 | Edit company |
| `/rmm/companies/[id]/products` | `app/(dashboard)/rmm/companies/[id]/products/page.tsx` | 🔄 Placeholder | 1.1.1.12 | task-0.5.2.3 | Company products view |
| `/rmm/companies/new` | `app/(dashboard)/rmm/companies/new/page.tsx` | 🔄 Placeholder | 1.1.1.12 | task-0.5.2.8 | Create company |
| `/rmm/products` | `app/(dashboard)/rmm/products/page.tsx` | 🔄 Placeholder | 1.1.1.12 | task-0.5.2.4 | Products list |
| `/rmm/products/[id]` | `app/(dashboard)/rmm/products/[id]/page.tsx` | 🔄 Placeholder | 1.1.1.12 | task-0.5.2.5 | Product detail |
| `/rmm/products/[id]/edit` | `app/(dashboard)/rmm/products/[id]/edit/page.tsx` | 🔄 Placeholder | 1.1.1.12 | task-0.5.2.9 | Edit product |
| `/rmm/products/new` | `app/(dashboard)/rmm/products/new/page.tsx` | 🔄 Placeholder | 1.1.1.12 | task-0.5.2.9 | Create product |
| `/rmm/skus` | `app/(dashboard)/rmm/skus/page.tsx` | 🔄 Placeholder | 1.1.1.12 | task-0.5.2.6 | SKUs list |
| `/rmm/skus/[id]` | `app/(dashboard)/rmm/skus/[id]/page.tsx` | 🔄 Placeholder | 1.1.1.12 | task-0.5.2.7 | SKU detail |
| `/rmm/skus/[id]/edit` | `app/(dashboard)/rmm/skus/[id]/edit/page.tsx` | 🔄 Placeholder | 1.1.1.12 | task-0.5.2.10 | Edit SKU |
| `/rmm/skus/new` | `app/(dashboard)/rmm/skus/new/page.tsx` | 🔄 Placeholder | 1.1.1.12 | task-0.5.2.10 | Create SKU |

### VCI (Value Chain Intelligence) Routes

| Route | File Location | Status | Task | Wireframe | Notes |
|-------|--------------|--------|------|-----------|-------|
| `/vci` | `app/(dashboard)/vci/page.tsx` | 🔄 Placeholder | 1.1.1.12 | task-0.5.3.0 | VCI dashboard |
| `/vci/layout.tsx` | `app/(dashboard)/vci/layout.tsx` | 📋 Planned | TBD | N/A | VCI module layout |
| `/vci/dashboard` | `app/(dashboard)/vci/dashboard/page.tsx` | 📋 Planned | TBD | task-0.5.3.0 | VCI dashboard (sidebar link) |
| `/vci/submissions/aams` | `app/(dashboard)/vci/submissions/aams/page.tsx` | 🔄 Placeholder | 1.1.1.12 | task-0.5.3.1 | AAMS submissions list |
| `/vci/submissions/aams/[id]` | `app/(dashboard)/vci/submissions/aams/[id]/page.tsx` | 🔄 Placeholder | 1.1.1.12 | task-0.5.3.2 | AAMS submission detail |
| `/vci/submissions/aams/new` | `app/(dashboard)/vci/submissions/aams/new/page.tsx` | 🔄 Placeholder | 1.1.1.12 | task-0.5.3.3 | Create AAMS submission |
| `/vci/submissions/msq` | `app/(dashboard)/vci/submissions/msq/page.tsx` | 🔄 Placeholder | 1.1.1.12 | task-0.5.3.7 | MSQ submissions list |
| `/vci/submissions/msq/[id]` | `app/(dashboard)/vci/submissions/msq/[id]/page.tsx` | 🔄 Placeholder | 1.1.1.12 | task-0.5.3.8 | MSQ submission detail |
| `/vci/submissions/msq/new` | `app/(dashboard)/vci/submissions/msq/new/page.tsx` | 🔄 Placeholder | 1.1.1.12 | task-0.5.3.10 | Create MSQ submission |
| `/vci/submissions/wsl` | `app/(dashboard)/vci/submissions/wsl/page.tsx` | 🔄 Placeholder | 1.1.1.12 | task-0.5.3.11 | WSL submissions list |
| `/vci/submissions/wsl/[id]` | `app/(dashboard)/vci/submissions/wsl/[id]/page.tsx` | 🔄 Placeholder | 1.1.1.12 | task-0.5.3.12 | WSL submission detail |
| `/vci/submissions/wsl/new` | `app/(dashboard)/vci/submissions/wsl/new/page.tsx` | 🔄 Placeholder | 1.1.1.12 | task-0.5.3.13 | Create WSL submission |
| `/vci/submissions/history` | `app/(dashboard)/vci/submissions/history/page.tsx` | 🔄 Placeholder | 1.1.1.12 | task-0.5.3.28 | All past submissions |
| `/vci/submissions/history/trends` | `app/(dashboard)/vci/submissions/history/trends/page.tsx` | 🔄 Placeholder | 1.1.1.12 | task-0.5.3.21 | Trend analysis (MOH only) |
| `/vci/thresholds` | `app/(dashboard)/vci/thresholds/page.tsx` | 🔄 Placeholder | 1.1.1.12 | task-0.5.3.4 | Threshold management |
| `/vci/thresholds/[id]` | `app/(dashboard)/vci/thresholds/[id]/page.tsx` | 🔄 Placeholder | 1.1.1.12 | task-0.5.3.5 | Threshold detail |
| `/vci/thresholds/[id]/revert-review` | `app/(dashboard)/vci/thresholds/[id]/revert-review/page.tsx` | 🔄 Placeholder | 1.1.1.12 | task-0.5.3.7 | Threshold reversion review |
| `/vci/thresholds/pending-reversions` | `app/(dashboard)/vci/thresholds/pending-reversions/page.tsx` | 🔄 Placeholder | 1.1.1.12 | task-0.5.3.6 | Pending reversions list |
| `/vci/breaches` | `app/(dashboard)/vci/breaches/page.tsx` | 🔄 Placeholder | 1.1.1.12 | task-0.5.3.14 | Compliance violations list |
| `/vci/breaches/[id]` | `app/(dashboard)/vci/breaches/[id]/page.tsx` | 🔄 Placeholder | 1.1.1.12 | task-0.5.3.15 | Compliance violation detail |
| `/vci/governance` | `app/(dashboard)/vci/governance/page.tsx` | 🔄 Placeholder | 1.1.1.12 | task-0.5.3.18 | Governance dashboard (MOH only) |
| `/vci/treemap` | `app/(dashboard)/vci/treemap/page.tsx` | 🔄 Placeholder | 1.1.1.12 | task-0.5.3.16 | Treemap visualization (MOH Tier 1 & 2) |

### ECS (Export Control System) Routes

| Route | File Location | Status | Task | Wireframe | Notes |
|-------|--------------|--------|------|-----------|-------|
| `/ecs` | `app/(dashboard)/ecs/page.tsx` | 🔄 Placeholder | 1.1.1.12 | task-0.5.4.0 | ECS overview |
| `/ecs/layout.tsx` | `app/(dashboard)/ecs/layout.tsx` | 📋 Planned | TBD | N/A | ECS module layout (conditional) |
| `/ecs/overview` | `app/(dashboard)/ecs/overview/page.tsx` | 📋 Planned | TBD | task-0.5.4.0 | ECS overview (sidebar link) |
| `/ecs/export-requests` | `app/(dashboard)/ecs/export-requests/page.tsx` | 🔄 Placeholder | 1.1.1.12 | task-0.5.4.1 | Export authorization requests list |
| `/ecs/export-requests/[id]` | `app/(dashboard)/ecs/export-requests/[id]/page.tsx` | 🔄 Placeholder | 1.1.1.12 | task-0.5.4.2 | Export request detail |
| `/ecs/export-requests/new` | `app/(dashboard)/ecs/export-requests/new/page.tsx` | 🔄 Placeholder | 1.1.1.12 | task-0.5.4.3 | Create export request |
| `/ecs/authorizations` | `app/(dashboard)/ecs/authorizations/page.tsx` | 🔄 Placeholder | 1.1.1.12 | task-0.5.4.5 | Export authorizations list |
| `/ecs/authorizations/[id]` | `app/(dashboard)/ecs/authorizations/[id]/page.tsx` | 🔄 Placeholder | 1.1.1.12 | task-0.5.4.6 | Authorization detail |
| `/ecs/exports/history` | `app/(dashboard)/ecs/exports/history/page.tsx` | 🔄 Placeholder | 1.1.1.12 | task-0.5.4.9 | Historical export authorizations |

### CMC (Compliance Monitoring Center) Routes

| Route | File Location | Status | Task | Wireframe | Notes |
|-------|--------------|--------|------|-----------|-------|
| `/cmc` | `app/(dashboard)/cmc/page.tsx` | 🔄 Placeholder | 1.1.1.12 | task-0.5.5.0 | CMC overview |
| `/cmc/layout.tsx` | `app/(dashboard)/cmc/layout.tsx` | 📋 Planned | TBD | N/A | CMC module layout (conditional) |
| `/cmc/overview` | `app/(dashboard)/cmc/overview/page.tsx` | 📋 Planned | TBD | task-0.5.5.0 | CMC overview (sidebar link) |
| `/cmc/scores` | `app/(dashboard)/cmc/scores/page.tsx` | 🔄 Placeholder | 1.1.1.12 | task-0.5.5.1 | Regulatory compliance ratings list |
| `/cmc/scores/[id]` | `app/(dashboard)/cmc/scores/[id]/page.tsx` | 🔄 Placeholder | 1.1.1.12 | task-0.5.5.2 | Compliance score detail |
| `/cmc/scores/history` | `app/(dashboard)/cmc/scores/history/page.tsx` | 🔄 Placeholder | 1.1.1.12 | task-0.5.5.x | Historical compliance scores |
| `/cmc/disputes` | `app/(dashboard)/cmc/disputes/page.tsx` | 🔄 Placeholder | 1.1.1.12 | task-0.5.5.8 | Compliance disputes list |
| `/cmc/disputes/[id]` | `app/(dashboard)/cmc/disputes/[id]/page.tsx` | 🔄 Placeholder | 1.1.1.12 | task-0.5.5.9 | Dispute detail |
| `/cmc/disputes/history` | `app/(dashboard)/cmc/disputes/history/page.tsx` | 🔄 Placeholder | 1.1.1.12 | task-0.5.5.x | Historical disputes |
| `/cmc/reports` | `app/(dashboard)/cmc/reports/page.tsx` | 🔄 Placeholder | 1.1.1.12 | task-0.5.5.10 | Compliance monitoring reports list |
| `/cmc/reports/[id]` | `app/(dashboard)/cmc/reports/[id]/page.tsx` | 🔄 Placeholder | 1.1.1.12 | task-0.5.5.x | Report detail |

### Enforcement Routes

| Route | File Location | Status | Task | Wireframe | Notes |
|-------|--------------|--------|------|-----------|-------|
| `/enforcement` | `app/(dashboard)/enforcement/page.tsx` | 🔄 Placeholder | 1.1.1.12 | task-0.5.2.0 | Enforcement dashboard (MOH Tier 1 & 2 only) |
| `/enforcement/layout.tsx` | `app/(dashboard)/enforcement/layout.tsx` | 📋 Planned | TBD | N/A | Enforcement module layout |
| `/enforcement/actions` | `app/(dashboard)/enforcement/actions/page.tsx` | 🔄 Placeholder | 1.1.1.12 | task-0.5.2.1 | Enforcement actions list |
| `/enforcement/actions/[id]` | `app/(dashboard)/enforcement/actions/[id]/page.tsx` | 🔄 Placeholder | 1.1.1.12 | task-0.5.2.1a | Enforcement action detail |
| `/enforcement/actions/new` | `app/(dashboard)/enforcement/actions/new/page.tsx` | 🔄 Placeholder | 1.1.1.12 | task-0.5.2.1b | Create enforcement action |
| `/enforcement/pending-approvals` | `app/(dashboard)/enforcement/pending-approvals/page.tsx` | 🔄 Placeholder | 1.1.1.12 | task-0.5.2.1c | Actions pending Tier 1 approval |
| `/enforcement/reports` | `app/(dashboard)/enforcement/reports/page.tsx` | 🔄 Placeholder | 1.1.1.12 | task-0.5.2.1d | Enforcement analytics and reporting |

### Public Routes

| Route | File Location | Status | Task | Wireframe | Notes |
|-------|--------------|--------|------|-----------|-------|
| `/about` | `app/(public)/about/page.tsx` | ✅ Implemented | 1.1.1.14 | task-0.5.1.2 | About MOH's regulatory mission |
| `/support` | `app/(public)/support/page.tsx` | ✅ Implemented | 1.1.1.15 | task-0.5.1.37 | Support center |
| `/support/faq` | `app/(public)/support/faq/page.tsx` | ✅ Implemented | 1.1.1.15 | task-0.5.1.38 | FAQ page |
| `/support/contact` | `app/(public)/support/contact/page.tsx` | ✅ Implemented | 1.1.1.15 | task-0.5.1.39 | Contact support |
| `/support/documentation` | `app/(public)/support/documentation/page.tsx` | ✅ Implemented | 1.1.1.15 | task-0.5.1.40 | Documentation page |
| `/legal/terms` | `app/(public)/legal/terms/page.tsx` | ✅ Implemented | 1.1.1.16 | N/A | Terms of service |
| `/legal/privacy` | `app/(public)/legal/privacy/page.tsx` | ✅ Implemented | 1.1.1.16 | N/A | Privacy policy |
| `/legal/cookies` | `app/(public)/legal/cookies/page.tsx` | ✅ Implemented | 1.1.1.16 | N/A | Cookie policy |
| `/status` | `app/(public)/status/page.tsx` | ✅ Implemented | 1.1.1.17 | task-0.5.1.41 | System status page |
| Public layout | `app/(public)/layout.tsx` | ✅ Implemented | 1.1.1.13 | N/A | Public layout with header and footer |

### Help Routes (Sidebar Navigation)

| Route | File Location | Status | Task | Wireframe | Notes |
|-------|--------------|--------|------|-----------|-------|
| `/help/support` | `app/(dashboard)/help/support/page.tsx` | 📋 Planned | TBD | TBD | Support center (links to `/support`) |
| `/help/faq` | `app/(dashboard)/help/faq/page.tsx` | 📋 Planned | TBD | TBD | FAQ (links to `/support/faq`) |
| `/help/docs` | `app/(dashboard)/help/docs/page.tsx` | 📋 Planned | TBD | TBD | Documentation (links to `/support/documentation`) |
| `/help/contact` | `app/(dashboard)/help/contact/page.tsx` | 📋 Planned | TBD | TBD | Contact support (links to `/support/contact`) |
| `/help/status` | `app/(dashboard)/help/status/page.tsx` | 📋 Planned | TBD | TBD | System status (links to `/status`) |

**Note:** Help routes in sidebar may redirect to public support routes or be separate dashboard pages. Decision pending.

---

## Component Structure

### Layout Components

| Component | File Location | Status | Task | Used By | Notes |
|-----------|--------------|--------|------|---------|-------|
| Root Layout | `app/layout.tsx` | ✅ Implemented | 1.1.1.9 | All pages | Root layout with Inter font |
| Dashboard Layout | `app/(dashboard)/layout.tsx` | ✅ Implemented | 1.1.1.9 | All dashboard pages | Combines Header + Sidebar + Main Content |
| Header | `components/layout/Header.tsx` | ✅ Implemented | 1.1.1.9 | Dashboard layout | Fixed header with logo, search, notifications, user menu |
| Sidebar | `components/layout/Sidebar.tsx` | ✅ Implemented | 1.1.1.9 | Dashboard layout | Collapsible sidebar navigation |
| NotificationCenter | `components/layout/NotificationCenter.tsx` | ✅ Implemented | 1.1.1.9 | Header | Notification dropdown |
| UserMenu | `components/layout/UserMenu.tsx` | ✅ Implemented | 1.1.1.9 | Header | User menu dropdown |

### Utility Components

| Component | File Location | Status | Task | Used By | Notes |
|-----------|--------------|--------|------|---------|-------|
| (To be added as tasks progress) | | | | | |

---

## Library Files

### Supabase Clients

| File | Location | Status | Task | Purpose |
|------|----------|--------|------|---------|
| Browser Client | `lib/supabase/client.ts` | ✅ Implemented | 1.1.1.9 | Client-side Supabase client |
| Server Client | `lib/supabase/server.ts` | ✅ Implemented | 1.1.1.9 | Server-side Supabase client |

### Constants

| File | Location | Status | Task | Purpose |
|------|----------|--------|------|---------|
| Roles | `lib/constants/roles.ts` | ✅ Implemented | 1.1.1.9 | User role constants matching database schema |
| Modules | `lib/constants/modules.ts` | ✅ Implemented | 1.1.1.9 | Module constants and display names |

### Hooks

| File | Location | Status | Task | Purpose |
|------|----------|--------|------|---------|
| use-user-permissions | `lib/hooks/use-user-permissions.ts` | ✅ Implemented | 1.1.1.9 | Fetch user permissions via `shared_get_user_permissions()` |
| use-notifications | `lib/hooks/use-notifications.ts` | ✅ Implemented | 1.1.1.9 | Fetch notifications via `shared_get_notifications()` |
| use-module-activation | `lib/hooks/use-module-activation.ts` | ✅ Implemented | 1.1.1.9 | Check module activation from `system_config` table |

### Utilities

| File | Location | Status | Task | Purpose |
|------|----------|--------|------|---------|
| cn | `lib/utils/cn.ts` | ✅ Implemented | 1.1.1.9 | Tailwind class name utility (clsx + tailwind-merge) |

---

## Configuration Files

| File | Location | Status | Task | Purpose |
|------|----------|--------|------|---------|
| package.json | `package.json` | ✅ Implemented | 1.1.1.9 | Dependencies and scripts |
| tsconfig.json | `tsconfig.json` | ✅ Implemented | 1.1.1.9 | TypeScript configuration |
| tailwind.config.ts | `tailwind.config.ts` | ✅ Implemented | 1.1.1.9 | Tailwind CSS configuration with design system |
| postcss.config.js | `postcss.config.js` | ✅ Implemented | 1.1.1.9 | PostCSS configuration |
| next.config.js | `next.config.js` | ✅ Implemented | 1.1.1.9 | Next.js configuration |
| .gitignore | `.gitignore` | ✅ Implemented | 1.1.1.9 | Git ignore rules |

---

## Implementation Status Summary

### By Status

- **✅ Implemented:** 40+ files (routes: 30+, components: 5, libraries: 3)
- **📋 Planned:** 70+ routes (to be implemented in future tasks)

### By Task

- **Task 1.1.1.9 (Complete):**
  - ✅ Root layout (`app/layout.tsx`)
  - ✅ Dashboard layout (`app/(dashboard)/layout.tsx`)
  - ✅ Dashboard home (`app/(dashboard)/page.tsx`)
  - ✅ Header component (`components/layout/Header.tsx`)
  - ✅ Sidebar component (`components/layout/Sidebar.tsx`)
  - ✅ NotificationCenter component (`components/layout/NotificationCenter.tsx`)
  - ✅ UserMenu component (`components/layout/UserMenu.tsx`)
  - ✅ Supabase clients (`lib/supabase/client.ts`, `lib/supabase/server.ts`)
  - ✅ Constants (`lib/constants/roles.ts`, `lib/constants/modules.ts`)
  - ✅ Hooks (`lib/hooks/use-user-permissions.ts`, `lib/hooks/use-notifications.ts`, `lib/hooks/use-module-activation.ts`)
  - ✅ Utilities (`lib/utils/cn.ts`)
  - ✅ Configuration files (package.json, tsconfig.json, tailwind.config.ts, etc.)

- **Task 1.1.1.10 (Complete):**
  - ✅ Auth layout (`app/(auth)/layout.tsx`)
  - ✅ Login page (`app/(auth)/login/page.tsx`)
  - ✅ Registration page (`app/(auth)/register/page.tsx`)
  - ✅ Forgot password page (`app/(auth)/forgot-password/page.tsx`)
  - ✅ Reset password page (`app/(auth)/reset-password/page.tsx`)

- **Task 1.1.1.11 (Complete):**
  - ✅ Dashboard page enhanced with role-based structure

- **Task 1.1.1.13 (Complete):**
  - ✅ Public layout (`app/(public)/layout.tsx`)
  - ✅ Homepage (`app/(public)/page.tsx`)

- **Task 1.1.1.14 (Complete):**
  - ✅ About page (`app/(public)/about/page.tsx`)

- **Task 1.1.1.15 (Complete):**
  - ✅ Support center (`app/(public)/support/page.tsx`)
  - ✅ FAQ page (`app/(public)/support/faq/page.tsx`)
  - ✅ Contact support (`app/(public)/support/contact/page.tsx`)
  - ✅ Documentation (`app/(public)/support/documentation/page.tsx`)

- **Task 1.1.1.16 (Complete):**
  - ✅ Terms of Service (`app/(public)/legal/terms/page.tsx`)
  - ✅ Privacy Policy (`app/(public)/legal/privacy/page.tsx`)
  - ✅ Cookie Policy (`app/(public)/legal/cookies/page.tsx`)

- **Task 1.1.1.17 (Complete):**
  - ✅ System status page (`app/(public)/status/page.tsx`)

- **Task 1.1.1.18 (Complete):**
  - ✅ User profile page (`app/(dashboard)/profile/page.tsx`)

- **Task 1.1.1.19 (Complete):**
  - ✅ Notifications page (`app/(dashboard)/notifications/page.tsx`)

- **Task 1.1.1.20 (Complete):**
  - ✅ History overview page (`app/(dashboard)/history/page.tsx` - placeholder)

- **Task 1.1.1.21 (Complete):**
  - ✅ Audit logs list (`app/(dashboard)/audit/logs/page.tsx` - placeholder)
  - ✅ Audit log detail (`app/(dashboard)/audit/logs/[id]/page.tsx` - placeholder)
  - ✅ Audit reports (`app/(dashboard)/audit/reports/page.tsx` - placeholder)

- **Task 1.1.1.22 (Complete):**
  - ✅ Communications inbox (`app/(dashboard)/communications/inbox/page.tsx`)
  - ✅ Conversation detail (`app/(dashboard)/communications/inbox/[conversation_id]/page.tsx`)

- **Task 1.1.1.23 (Complete):**
  - ✅ Compose message (`app/(dashboard)/communications/compose/page.tsx`)
  - ✅ Sent messages (`app/(dashboard)/communications/sent/page.tsx`)

- **Task 1.1.1.24 (Complete):**
  - ✅ System announcements (`app/(dashboard)/communications/announcements/page.tsx`)
  - ✅ Archived conversations (`app/(dashboard)/communications/archived/page.tsx`)

### Next Tasks (Planned)

- **Task 1.1.1.12 (Complete):**
  - ✅ Created 51 placeholder pages for all routes using PlaceholderPage component
  - ✅ RMM routes (14 pages)
  - ✅ VCI routes (20 pages)
  - ✅ ECS routes (7 pages)
  - ✅ CMC routes (8 pages)
  - ✅ Enforcement routes (6 pages)
  - ✅ System Config (1 page)
- **Future tasks:** Full implementation of history and audit pages (currently placeholders)
- **Future tasks:** Module-specific routes (RMM, VCI, ECS, CMC, Enforcement)

---

## File Organization Principles

### Route Groups

1. **`(public)`** - Public routes (no authentication required)
   - Homepage, About, Support, Legal, Status
   - Layout: Public layout (minimal header/footer)

2. **`(auth)`** - Authentication routes
   - Login, Register, Forgot Password, Reset Password
   - Layout: Auth layout (centered, minimal)

3. **`(dashboard)`** - Protected dashboard routes
   - All authenticated user routes
   - Layout: Dashboard layout (Header + Sidebar)

### Component Organization

1. **`components/layout/`** - Layout components (Header, Sidebar, etc.)
2. **`components/[module]/`** - Module-specific components (to be created)
3. **`components/ui/`** - Reusable UI components (to be created)

### Library Organization

1. **`lib/supabase/`** - Supabase clients
2. **`lib/constants/`** - Constants (roles, modules, etc.)
3. **`lib/hooks/`** - Custom React hooks
4. **`lib/utils/`** - Utility functions
5. **`lib/api/`** - API client functions (to be created)

---

## Update History

| Date | Task | Changes | Updated By |
|------|------|---------|------------|
| 2026-01-22 | 1.1.1.9 | Initial index created with Task 1.1.1.9 implementation | Sami |
| 2026-01-22 | 1.1.1.10-1.1.1.24 | Updated with all authentication, public, dashboard, and communications pages | Sami |

---

## Review Status

- **Yasmine (Frontend Developer):** ⏳ Pending review
- **Oliver (Frontend Developer):** ⏳ Pending review

**Review Requested:** Please review file organization, route-to-file mapping, and provide feedback on structure and naming conventions.

---

## Related Documents

- [Routing Structure](./routing-structure.md) - Complete route definitions
- [Route Inventory](./route-inventory.md) - Route implementation status
- [Wireframe-Route Mapping](./wireframe-route-mapping.md) - Wireframe-to-route mapping
- [Phase 1 Implementation Plan](../../05-project-management/phase-1.md) - Task list and dependencies

---

**Last Updated:** 2026-01-22  
**Next Update:** After Task 1.1.1.12 (Placeholder pages for all routes)
