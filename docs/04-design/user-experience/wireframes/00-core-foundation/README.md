# Core Foundation Wireframes

**Subphase:** 0.5.1 - Core Foundation Wireframes  
**Duration:** Days 1-3  
**Status:** ⚪ Not Started  
**Owner:** Emma (UI/UX + Next.js Frontend Specialist)

## Overview

Core foundation wireframes include public pages, authentication flows, dashboard layout, navigation components, and role-based dashboard views.

## Wireframe List

### Public Pages
- [ ] **Task 0.5.1.1:** Public homepage (MOH mission focus, navigation, CTA)
- [ ] **Task 0.5.1.2:** About page (MOH regulatory mission, framework overview, partnership info)
- [ ] **Task 0.5.1.3:** Support center page (support options, help sections, contact links)
- [ ] **Task 0.5.1.4:** FAQ page (searchable questions, categories, expandable answers)
- [ ] **Task 0.5.1.5:** Contact support page (contact form, support channels, response time info)
- [ ] **Task 0.5.1.6:** Documentation page (user guides, documentation sections, search)
- [ ] **Task 0.5.1.7:** Terms of service page (legal text, sections, acceptance checkbox)
- [ ] **Task 0.5.1.8:** Privacy policy page (privacy information, data handling, sections)
- [ ] **Task 0.5.1.9:** Cookie policy page (cookie information, consent management, sections)
- [ ] **Task 0.5.1.10:** System status page (system health, incident history, status indicators)

### Authentication
- [ ] **Task 0.5.1.11:** Login page (email/password, forgot password link, registration link)
- [ ] **Task 0.5.1.12:** Registration page (form fields, validation indicators)
- [ ] **Task 0.5.1.13:** Forgot password / Reset password flow

### Layout & Navigation
- [ ] **Task 0.5.1.14:** Dashboard layout structure (header, sidebar, main content area, responsive breakpoints)
- [ ] **Task 0.5.1.15:** Header component (logo, user menu, notifications badge, search)
- [ ] **Task 0.5.1.16:** Sidebar navigation (module grouping, active states, role-based items)
- [ ] **Task 0.5.1.17:** Notification center component (dropdown/popover, notification list, read/unread states)

### Dashboard (Role-Based)
- [ ] **Task 0.5.1.18:** Company Dashboard (my submissions, pending approvals, recent activity, key metrics)
- [ ] **Task 0.5.1.19:** MOH Tier 1 Dashboard (governance overview, pending approvals, system-wide metrics, action items)
- [ ] **Task 0.5.1.20:** MOH Tier 2 Dashboard (pending verifications, oversight metrics, review queue)

### Dashboard Utility Pages
- [ ] **Task 0.5.1.21:** History overview page (role-based historical overview, quick filters, recent history summary)
- [ ] **Task 0.5.1.22:** Profile page (user information, account settings, password change, preferences)
- [ ] **Task 0.5.1.23:** Notifications page (full notification list, filters, mark as read, notification settings)

## Subfolder Structure

```
00-core-foundation/
├── README.md (this file)
├── public-pages/
├── authentication/
├── layout-navigation/
└── dashboard/
```

## Related Routes

See [Routing Structure](../../../../02-architecture/frontend/routing-structure.md) for corresponding routes:
- Public routes: `/`, `/about`, `/support`, `/legal/*`
- Auth routes: `/login`, `/register`, `/forgot-password`, `/reset-password`
- Dashboard routes: `/dashboard`, `/profile`, `/notifications`, `/history`

## Design System References

- [Design System](../../../../02-architecture/frontend/design-system.md)
- [Navigation & Layout Patterns](../../../../02-architecture/frontend/navigation-layout-patterns.md)
- [Role-Based UI Patterns](../../../../02-architecture/frontend/role-based-ui-patterns.md)

## Component Mappings

Wireframes reference components from:
- [UI Component Specifications](../../../../02-architecture/frontend/ui-component-specifications.md)
- [Form Design Patterns](../../../../02-architecture/frontend/form-design-patterns.md)

---

**Next:** Complete public pages → authentication → layout → dashboard

