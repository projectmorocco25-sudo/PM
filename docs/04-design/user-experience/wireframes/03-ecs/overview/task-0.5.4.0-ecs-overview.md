# Task 0.5.4.0: ECS Overview Page Wireframe

**Status:** ✅ Complete  
**Route:** `/ecs`  
**File:** `task-0.5.4.0-ecs-overview.png`  
**Priority:** 🟡 ECS Module

**Design Approach:** Module overview dashboard with export requests overview, authorization status, and quick links. Professional, accessible, and optimized for export control workflows.

---

## Wireframe Layout

```
┌─────────────────────────────────────────────────────────────┐
│ Home > ECS                                                    │
│                                                             │
│ Export Control System (ECS)                                 │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Module Summary                                           ││
│ │                                                          ││
│ │ ECS manages export authorization requests, approvals,    ││
│ │ and compliance with stock threshold requirements.        ││
│ │ Export requests are evaluated against VCI thresholds     ││
│ │ and CMC compliance scores (if active).                   ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐        │
│ │ Export       │ │ Export       │ │ Active       │        │
│ │ Requests     │ │ Authorizations│ │ Authorizations│       │
│ │              │ │              │ │              │        │
│ │ Total: 25    │ │ Total: 18    │ │ Active: 12   │        │
│ │ Pending: 5   │ │ Approved: 18 │ │ Expired: 4   │        │
│ │ Approved: 18 │ │ Rejected: 2  │ │ Expiring: 2  │        │
│ │ Rejected: 2  │ │              │ │ (7 days)     │        │
│ │              │ │              │ │              │        │
│ │ [View All]   │ │ [View All]   │ │ [View All]   │        │
│ └──────────────┘ └──────────────┘ └──────────────┘        │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Pending Export Requests (Requires Action)                 ││
│ │                                                          ││
│ │ ⚠️ 5 Requests Pending Review                             ││
│ │                                                          ││
│ │ • REQ-2025-001: ABC Pharma - Auto-approval queue (1d)   ││
│ │ • REQ-2025-003: XYZ Medical - Manual review required     ││
│ │ • REQ-2025-005: DEF Corp - Tier 2 verification (2d)     ││
│ │                                                          ││
│ │ [View All Pending] [Intervene] (MOH Tier 1 only)        ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Threshold Status                                         ││
│ │                                                          ││
│ │ SKUs with Active Exports: 12                             ││
│ │ SKUs with ECS Threshold: 12                              ││
│ │ Threshold Switches: VCI → ECS (active exports)          ││
│ │                                                          ││
│ │ [View Threshold Details] [View Active Exports]           ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Quick Links                                              ││
│ │                                                          ││
│ │ [New Export Request] [Export Requests] [Authorizations] ││
│ │ [Replenishment Tracking] [Export History]               ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Recent Activity                                          ││
│ │                                                          ││
│ │ • Export request REQ-2025-018 authorized (2 hours ago)  ││
│ │ • Export authorization AUTH-2025-015 expires (5 days)   ││
│ │ • Export completion reported (1 day ago)                 ││
│ │ • Export request REQ-2025-012 rejected (2 days ago)     ││
│ │                                                          ││
│ │ [View Full History]                                     ││
│ └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

---

## Component Specifications

### Page Header
- **Breadcrumbs:** "Home > ECS"
- **Title:** "Export Control System (ECS)"
  - **Typography:** 24px, font-weight: 600, color: #111827
- **Module Badge:** "Optional Module" badge (gray, shown only when active)

### Module Summary Card
- **Content:** Brief description of ECS module purpose
- **Text:** Explains that ECS manages export authorization requests, approvals, and compliance with stock threshold requirements
- **Layout:** Card with descriptive text
- **Styling:** Light background (#f9fafb), padding 16px

### Statistics Cards (3-column grid)
- **Layout:** Responsive grid (3 columns desktop, 1 column mobile)
- **Cards:**
  1. **Export Requests Card:**
     - Total count
     - Pending count
     - Approved count
     - Rejected count
     - "View All" button
  2. **Export Authorizations Card:**
     - Total count
     - Approved count
     - Rejected count
     - "View All" button
  3. **Active Authorizations Card:**
     - Active count
     - Expired count
     - Expiring soon count (with days remaining)
     - "View All" button
- **Styling:** White cards with border, hover effect

### Pending Export Requests Alert Card
- **Layout:** Prominent alert card
- **Content:**
  - Pending requests count
  - List of recent pending requests (top 3-5)
  - Each request shows ID, company, status, and days in queue
- **Actions:**
  - "View All Pending" button
  - "Intervene" button (MOH Tier 1 only, for auto-approval queue)
- **Styling:** Orange/yellow alert styling for pending actions

### Threshold Status Card
- **Layout:** Card with threshold summary
- **Content:**
  - SKUs with active exports count
  - SKUs with ECS threshold count
  - Explanation of threshold switching (VCI → ECS)
- **Actions:**
  - "View Threshold Details" button
  - "View Active Exports" button
- **Styling:** Information card styling

### Quick Links Section
- **Layout:** Horizontal button group
- **Links:**
  - New Export Request
  - Export Requests
  - Authorizations
  - Replenishment Tracking
  - Export History
- **Styling:** Button group with icons (optional)
- **Responsive:** Wraps on mobile

### Recent Activity Section
- **Layout:** Card with activity list
- **Content:** Chronological list of recent ECS activities
- **Each Entry Shows:**
  - Activity description
  - Timestamp (relative time)
- **Actions:**
  - "View Full History" link
- **Limit:** Show last 5-10 activities

---

## Role-Based Access

### Company Users (IPC only)
- **View:** Own company statistics only
- **Statistics:**
  - Own export requests
  - Own export authorizations
  - Own active authorizations
- **Quick Links:** Filtered to accessible pages (no intervene actions)
- **Recent Activity:** Own company activities only
- **Actions:** Can create new export requests, view own requests/authorizations

### MOH Tier 1
- **View:** System-wide statistics
- **Statistics:**
  - All export requests status
  - All export authorizations
  - All active authorizations
- **Quick Links:** All links available
- **Recent Activity:** System-wide activities
- **Actions:** Can approve/reject, intervene in auto-approval queue, revoke authorizations

### MOH Tier 2
- **View:** System-wide statistics
- **Statistics:**
  - All export requests status
  - All export authorizations
  - All active authorizations
- **Quick Links:** All links available (no intervene actions)
- **Recent Activity:** System-wide activities
- **Actions:** Can verify requests, approve/reject (when Tier 2 verification required)

---

## State Variations

### Empty State (No Data)
- **Message:** "No ECS data available"
- **Subtext:** "Start by creating an export request"
- **Action Button:** "New Export Request" (if applicable)

### Module Inactive State
- **Message:** "ECS module is not active"
- **Subtext:** "Contact MOH Tier 1 to activate the ECS module"
- **Visual:** Inactive module indicator
- **Note:** Historical data may still be accessible if `has_historical_ecs_data()` returns true

### Loading State
- **Skeleton Loaders:** Cards with skeleton placeholders
- **Statistics:** Skeleton numbers
- **Activity:** Skeleton list items

### Error State
- **Message:** "Unable to load ECS overview"
- **Subtext:** Error message details
- **Action Button:** "Retry"

### No Pending Requests State
- **Message:** "✓ No pending export requests"
- **Styling:** Green success styling
- **Subtext:** "All requests have been processed"

---

## Widgets and Metrics

### Export Requests Statistics
- **Total:** Count of all export requests
- **Pending:** Count of pending requests (by status: auto-approval queue, manual review, tier2_verification_required)
- **Approved:** Count of approved requests
- **Rejected:** Count of rejected requests
- **Trend:** Optional trend indicator

### Export Authorizations Statistics
- **Total:** Count of all authorizations
- **Approved:** Count of approved authorizations
- **Rejected:** Count of rejected requests (before authorization)

### Active Authorizations Statistics
- **Active:** Count of currently active authorizations
- **Expired:** Count of expired authorizations
- **Expiring Soon:** Count of authorizations expiring within 7/15/30 days (configurable)
- **Urgency:** Color-coded by days until expiration

### Threshold Status
- **Active Exports:** Count of SKUs with active export authorizations
- **ECS Thresholds:** Count of SKUs using ECS Threshold (switched from VCI)
- **Status:** Indicator of threshold switching status

---

## Business Rules

1. **Module Status:** ECS is optional (license-controlled)
2. **Module Activation Check:** Routes check `is_module_active('ecs')` for active module, or `has_historical_ecs_data()` for historical data access
3. **Statistics:** Real-time counts from database
4. **Activity Feed:** Shows last 5-10 activities
5. **Role-Based Filtering:** Statistics filtered by user role
6. **Quick Links:** Links to key ECS pages
7. **Navigation:** Overview page serves as ECS module landing page
8. **Threshold Switching:** Shows count of SKUs with switched thresholds (VCI → ECS)
9. **Intervention Window:** Shows requests in auto-approval queue with countdown timer
10. **Expiration Warnings:** Highlights authorizations expiring within 30/15/7 days

---

## Related Documents

- [Export Requests List Wireframe](../export-requests/task-0.5.4.1-export-requests-list.md)
- [Export Request Detail Wireframe](../export-requests/task-0.5.4.3-export-request-detail.md)
- [Export Authorizations List Wireframe](../authorizations/task-0.5.4.5-export-authorizations-list.md)
- [Replenishment Tracking Wireframe](../replenishment/task-0.5.4.8-replenishment-schedule-tracking.md)
- [Routing Structure](../../../02-architecture/frontend/routing-structure.md) - ECS routes
- [Workflow Architecture](../../../02-architecture/workflow-architecture.md) - Export Request Workflow

---

**Last Updated:** 2025-01-15  
**Owner:** Emma (UI/UX + Next.js Frontend Specialist)  
**Guided by:** Fatima (MOH Regulatory Requirements) & Dr. Samir (Business Process Validation)

