# Priority 1: Critical Foundation - Wireframe Implementation Guide

**Priority:** 1 - Critical Foundation  
**Duration:** Days 1-2  
**Status:** 🟡 Ready for Implementation  
**Owner:** Emma (UI/UX + Next.js Frontend Specialist)  
**Miro Board:** [Phase 0.5 Wireframes - Master Board](https://miro.com/app/board/uXjVGUps93A=/)

## Overview

This guide provides specifications for creating the 20 Priority 1 wireframes that establish the critical foundation for the PM platform. These wireframes must be completed first as they block all other work and enable early stakeholder validation.

## Wireframe Checklist

### Authentication & Layout (5 wireframes)
- [ ] **Task 0.5.1.11:** Login page
- [ ] **Task 0.5.1.14:** Dashboard layout structure
- [ ] **Task 0.5.1.15:** Header component
- [ ] **Task 0.5.1.16:** Sidebar navigation
- [ ] **Task 0.5.1.17:** Notification center component

### Core Dashboards (3 wireframes)
- [ ] **Task 0.5.1.18:** Company Dashboard
- [ ] **Task 0.5.1.19:** MOH Tier 1 Dashboard
- [ ] **Task 0.5.1.20:** MOH Tier 2 Dashboard

### Communication Interfaces (6 wireframes)
- [ ] **Task 0.5.1.24:** Communications inbox list page
- [ ] **Task 0.5.1.25:** Conversation detail page
- [ ] **Task 0.5.1.26:** Compose message interface
- [ ] **Task 0.5.1.27:** Sent messages page
- [ ] **Task 0.5.1.28:** System announcements interface
- [ ] **Task 0.5.1.29:** Communication integration in workflow pages

### Global Section Pages (6 wireframes)
- [ ] **Task 0.5.1.30:** History overview page
- [ ] **Task 0.5.1.31:** Notifications page
- [ ] **Task 0.5.1.32:** Audit logs list page
- [ ] **Task 0.5.1.33:** Audit log detail page
- [ ] **Task 0.5.1.34:** Audit reports page
- [ ] **Task 0.5.1.35:** System Configuration page

---

## File Structure & Deliverables

Each wireframe should be:
1. **Created in Miro** with annotations
2. **Exported as PNG/PDF** with filename: `task-{TASK_ID}-{descriptive-name}.png`
3. **Saved to designated subfolder** in `00-core-foundation/`
4. **Documented in wireframe-index.md** (already done)

### File Locations

```
00-core-foundation/
├── authentication/
│   └── task-0.5.1.11-login-page.png
├── layout-navigation/
│   ├── task-0.5.1.14-dashboard-layout-structure.png
│   ├── task-0.5.1.15-header-component.png
│   ├── task-0.5.1.16-sidebar-navigation.png
│   └── task-0.5.1.17-notification-center-component.png
├── dashboard/
│   ├── task-0.5.1.18-company-dashboard.png
│   ├── task-0.5.1.19-moh-tier1-dashboard.png
│   └── task-0.5.1.20-moh-tier2-dashboard.png
├── communications/
│   ├── task-0.5.1.24-communications-inbox-list.png
│   ├── task-0.5.1.25-conversation-detail.png
│   ├── task-0.5.1.26-compose-message.png
│   ├── task-0.5.1.27-sent-messages.png
│   ├── task-0.5.1.28-system-announcements.png
│   └── task-0.5.1.29-communication-integration-workflow.png
└── global/
    ├── task-0.5.1.30-history-overview.png
    ├── task-0.5.1.31-notifications-page.png
    ├── task-0.5.1.32-audit-logs-list.png
    ├── task-0.5.1.33-audit-log-detail.png
    ├── task-0.5.1.34-audit-reports.png
    └── task-0.5.1.35-system-configuration.png
```

---

## Key Reference Documents

### Architecture & Design
- [Routing Structure](../../../../02-architecture/frontend/routing-structure.md) - All route paths
- [Navigation & Layout Patterns](../../../../02-architecture/frontend/navigation-layout-patterns.md) - Layout structures, sidebar navigation
- [Design System](../../../../02-architecture/frontend/design-system.md) - Colors, typography, spacing
- [UI Component Specifications](../../../../02-architecture/frontend/ui-component-specifications.md) - Component details
- [Role-Based UI Patterns](../../../../02-architecture/frontend/role-based-ui-patterns.md) - Role-specific adaptations

### Communication System
- [Communication Channels Requirements](../../../../02-architecture/communication-channels-requirements.md) - Complete communication system specs

### Wireframe Process
- [Pre-Priority 1 Decisions](../../../../05-project-management/phases/phase-0-5-pre-priority-1-decisions.md) - Tools, process, annotations
- [Wireframe Index](../06-documentation/wireframe-index.md) - Complete wireframe tracking

---

## Wireframe Specifications by Category

### 1. Authentication & Layout

**Reference Routes:**
- Login: `/login`
- Layout: Component structure (not a route)

**Key Requirements:**
- Low-fidelity wireframes (boxes, lines, placeholders)
- Annotations for interactions, states, validation
- Responsive behavior notes
- Component references from design system

**See detailed specs in:** [Authentication Wireframes](./authentication/README.md), [Layout Wireframes](./layout-navigation/README.md)

### 2. Core Dashboards

**Reference Routes:**
- Company Dashboard: `/dashboard` (Company role)
- MOH Tier 1 Dashboard: `/dashboard` (Tier 1 role)
- MOH Tier 2 Dashboard: `/dashboard` (Tier 2 role)

**Key Requirements:**
- Role-specific content and metrics
- Widget layout and organization
- Key metrics visualization placeholders
- Action items and pending approvals

**See detailed specs in:** [Dashboard Wireframes](./dashboard/README.md)

### 3. Communication Interfaces

**Reference Routes:**
- Inbox: `/communications/inbox`
- Conversation: `/communications/inbox/[conversation_id]`
- Compose: `/communications/compose`
- Sent: `/communications/sent`
- Announcements: `/communications/announcements` (Tier 1 only)
- Integration: Component integration (not a route)

**Key Requirements:**
- Message thread display
- Reply interface
- Attachment handling
- Workflow entity linking
- Role-based access patterns

**See detailed specs in:** [Communication Wireframes](./communications/README.md)

### 4. Global Section Pages

**Reference Routes:**
- History: `/history`
- Notifications: `/notifications`
- Audit Logs: `/audit/logs` (MOH/Auditors only)
- Audit Detail: `/audit/logs/[id]`
- Audit Reports: `/audit/reports` (MOH/Auditors only)
- System Config: `/system-config` (Tier 1 only)

**Key Requirements:**
- Role-based historical overview
- Filter and search interfaces
- Audit log viewer with hash chain verification
- Module activation interface

**See detailed specs in:** [Global Wireframes](./global/README.md)

---

## Annotation Guidelines

### Color Coding (Miro Sticky Notes)
- **Blue:** Interactions (clicks, navigation, user actions)
- **Orange:** Validation (errors, required fields, validation rules)
- **Green:** States (loading, empty, success, active states)

### Standard Annotations Include:
1. **Interactions:** Click actions, navigation paths
2. **Validation:** Required fields, error states, validation rules
3. **States:** Loading, empty, success, error states
4. **Responsive:** Breakpoint behavior (tablet/mobile)
5. **Role Variations:** Role-specific differences
6. **Component References:** Link to design system components

---

## Quality Checklist

Before marking a wireframe complete:
- [ ] Layout structure matches specifications
- [ ] All required components/elements included
- [ ] Annotations added (interactions, states, validation)
- [ ] Design system references noted
- [ ] Responsive behavior annotated
- [ ] Role-based variations documented (if applicable)
- [ ] Route/path information included
- [ ] Component mappings referenced
- [ ] File exported and saved to correct location
- [ ] Wireframe index updated with status

---

## Miro Board Organization

### Recommended Structure

**Section 1: Authentication & Layout**
- Task 0.5.1.11: Login page
- Task 0.5.1.14: Dashboard layout structure
- Task 0.5.1.15: Header component
- Task 0.5.1.16: Sidebar navigation
- Task 0.5.1.17: Notification center component

**Section 2: Dashboards**
- Task 0.5.1.18: Company Dashboard
- Task 0.5.1.19: MOH Tier 1 Dashboard
- Task 0.5.1.20: MOH Tier 2 Dashboard

**Section 3: Communications**
- Task 0.5.1.24: Communications inbox list page
- Task 0.5.1.25: Conversation detail page
- Task 0.5.1.26: Compose message interface
- Task 0.5.1.27: Sent messages page
- Task 0.5.1.28: System announcements interface
- Task 0.5.1.29: Communication integration in workflow pages

**Section 4: Global Pages**
- Task 0.5.1.30: History overview page
- Task 0.5.1.31: Notifications page
- Task 0.5.1.32: Audit logs list page
- Task 0.5.1.33: Audit log detail page
- Task 0.5.1.34: Audit reports page
- Task 0.5.1.35: System Configuration page

---

## Next Steps After Priority 1

1. **Checkpoint Review:**
   - Internal team review (Emma, Oliver, Maya)
   - Stakeholder review (Fatima, Dr. Samir)
   - Iterate based on feedback

2. **Proceed to Priority 2:**
   - Core RMM Workflows
   - 12 wireframes
   - Days 3-4

---

**Status:** 🟡 Ready for Implementation
**Last Updated:** 2025-01-01  
**Owner:** Emma (UI/UX + Next.js Frontend Specialist)

