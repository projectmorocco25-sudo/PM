# Task 0.5.3.0: VCI Overview Page Wireframe

**Status:** ✅ Complete  
**Route:** `/vci`  
**File:** `task-0.5.3.0-vci-overview.png`  
**Priority:** 🟡 Supporting VCI & RMM

**Design Approach:** Module overview dashboard with submission overview, compliance violation alerts, quick links, and key metrics. Professional, accessible, and optimized for quick navigation and module status overview.

---

## Wireframe Layout

```
┌─────────────────────────────────────────────────────────────┐
│ Home > VCI                                                    │
│                                                             │
│ VCI Module (VCI)                                             │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Module Summary                                           ││
│ │                                                          ││
│ │ VCI manages stock level monitoring, threshold compliance,││
│ │ and regulatory submissions (AAMS, MSQ, WSL).             ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐        │
│ │ AAMS         │ │ MSQ           │ │ WSL           │        │
│ │ Submissions  │ │ Submissions   │ │ Submissions   │        │
│ │              │ │              │ │              │        │
│ │ 2025: 1      │ │ Jan 2025: 1  │ │ This Week: 1 │        │
│ │ Pending: 0   │ │ Pending: 0   │ │ Pending: 0   │        │
│ │ Approved: 0  │ │ Accepted: 0   │ │ Completed: 0 │        │
│ │              │ │              │ │              │        │
│ │ [View All]   │ │ [View All]   │ │ [View All]   │        │
│ └──────────────┘ └──────────────┘ └──────────────┘        │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Compliance Violations Alert                              ││
│ │                                                          ││
│ │ ⚠️ 5 Active Violations                                  ││
│ │                                                          ││
│ │ • SKU001: Below threshold (2 days)                      ││
│ │ • SKU002: Below threshold (5 days)                      ││
│ │ • SKU003: Below threshold (1 day)                       ││
│ │                                                          ││
│ │ [View All Violations]                                   ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Quick Links                                              ││
│ │                                                          ││
│ │ [AAMS] [MSQ] [WSL] [Thresholds] [Violations]           ││
│ │ [Governance Dashboard] [Analytics]                     ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Recent Activity                                          ││
│ │                                                          ││
│ │ • AAMS 2025 submission approved (2 hours ago)         ││
│ │ • WSL week 3 submission completed (5 hours ago)         ││
│ │ • Threshold modified for SKU001 (1 day ago)             ││
│ │ • Compliance violation resolved (2 days ago)           ││
│ │                                                          ││
│ │ [View Full History]                                     ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Threshold Management                                     ││
│ │                                                          ││
│ │ Active Thresholds: 1,200  |  Pending Reversions: 3     ││
│ │                                                          ││
│ │ [Manage Thresholds] [View Pending Reversions]            ││
│ └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

---

## Component Specifications

### Page Header
- **Breadcrumbs:** "Home > VCI"
- **Title:** "VCI Module (VCI)"
  - **Typography:** 24px, font-weight: 600, color: #111827
- **Module Badge:** "Core Module" badge (blue)

### Module Summary Card
- **Content:** Brief description of VCI module purpose
- **Text:** Explains that VCI manages stock level monitoring, threshold compliance, and regulatory submissions
- **Layout:** Card with descriptive text
- **Styling:** Light background (#f9fafb), padding 16px

### Submission Statistics Cards (3-column grid)
- **Layout:** Responsive grid (3 columns desktop, 1 column mobile)
- **Cards:**
  1. **AAMS Submissions Card:**
     - Current year submission status
     - Pending count
     - Approved count
     - "View All" button
  2. **MSQ Submissions Card:**
     - Current month submission status
     - Pending count
     - Accepted count
     - "View All" button
  3. **WSL Submissions Card:**
     - Current week submission status
     - Pending count
     - Completed count
     - "View All" button
- **Styling:** White cards with border, hover effect

### Compliance Violations Alert Card
- **Layout:** Prominent alert card
- **Content:**
  - Active violations count
  - List of recent violations (top 3-5)
  - Each violation shows SKU and days since violation
- **Actions:**
  - "View All Violations" button
- **Styling:** Orange/yellow alert styling for active violations

### Quick Links Section
- **Layout:** Horizontal button group
- **Links:**
  - AAMS
  - MSQ
  - WSL
  - Thresholds
  - Violations
  - Governance Dashboard
  - Analytics
- **Styling:** Button group with icons (optional)
- **Responsive:** Wraps on mobile

### Recent Activity Section
- **Layout:** Card with activity list
- **Content:** Chronological list of recent VCI activities
- **Each Entry Shows:**
  - Activity description
  - Timestamp (relative time)
- **Actions:**
  - "View Full History" link
- **Limit:** Show last 5-10 activities

### Threshold Management Card
- **Layout:** Card with threshold summary
- **Metrics:**
  - Active thresholds count
  - Pending reversions count
- **Actions:**
  - "Manage Thresholds" button
  - "View Pending Reversions" button
- **Styling:** Status indicators with color coding

---

## Role-Based Access

### Company Users
- **View:** Own company statistics only
- **Statistics:**
  - Own AAMS/MSQ/WSL submissions
  - Own compliance violations
- **Quick Links:** Filtered to accessible pages
- **Recent Activity:** Own company activities only
- **Threshold Management:** View only (cannot manage)

### MOH Tier 1
- **View:** System-wide statistics
- **Statistics:**
  - All submissions status
  - All compliance violations
  - All thresholds
- **Quick Links:** All links available
- **Recent Activity:** System-wide activities
- **Threshold Management:** Full access (can manage thresholds)

### MOH Tier 2
- **View:** System-wide statistics
- **Statistics:**
  - All submissions status
  - All compliance violations
  - All thresholds
- **Quick Links:** All links available
- **Recent Activity:** System-wide activities
- **Threshold Management:** View and review access (can review reversions)

---

## State Variations

### Empty State (No Data)
- **Message:** "No VCI data available"
- **Subtext:** "Start by creating AAMS submissions"
- **Action Button:** "Create AAMS Submission" (if applicable)

### Loading State
- **Skeleton Loaders:** Cards with skeleton placeholders
- **Statistics:** Skeleton numbers
- **Activity:** Skeleton list items

### Error State
- **Message:** "Unable to load VCI overview"
- **Subtext:** Error message details
- **Action Button:** "Retry"

### No Violations State
- **Message:** "✓ No active compliance violations"
- **Styling:** Green success styling
- **Subtext:** "All stock levels are within thresholds"

---

## Widgets and Metrics

### AAMS Statistics
- **Current Year:** Submission status for current year
- **Pending:** Count of pending submissions
- **Approved:** Count of approved submissions
- **Trend:** Optional trend indicator

### MSQ Statistics
- **Current Month:** Submission status for current month
- **Pending:** Count of pending submissions
- **Accepted:** Count of accepted submissions
- **Trend:** Optional trend indicator

### WSL Statistics
- **Current Week:** Submission status for current week
- **Pending:** Count of pending submissions
- **Completed:** Count of completed submissions
- **Trend:** Optional trend indicator

### Compliance Violations
- **Active Count:** Number of active violations
- **Recent List:** Top 3-5 recent violations
- **Urgency:** Days since violation (color-coded)

### Threshold Management
- **Active Thresholds:** Count of active thresholds
- **Pending Reversions:** Count of thresholds with pending reversions
- **Alerts:** Warnings for upcoming reversions

---

## Business Rules

1. **Module Status:** VCI is always active (core module)
2. **Statistics:** Real-time counts from database
3. **Activity Feed:** Shows last 5-10 activities
4. **Role-Based Filtering:** Statistics filtered by user role
5. **Quick Links:** Links to key VCI pages
6. **Navigation:** Overview page serves as VCI module landing page
7. **Violation Alerts:** Prominent display of active violations

---

## Related Documents

- [AAMS Submissions List Wireframe](../aams/task-0.5.3.1-aams-submissions-list.md)
- [MSQ Submissions List Wireframe](../msq/task-0.5.3.9-msq-submissions-list.md)
- [WSL Submissions List Wireframe](../wsl/task-0.5.3.11-wsl-submissions-list.md)
- [Threshold Management Wireframe](../aams/task-0.5.3.4-threshold-management.md)
- [Compliance Violations List Wireframe](../breaches/task-0.5.3.14-compliance-violations-list.md)
- [Governance Dashboard Wireframe](./task-0.5.3.18-governance-dashboard.md)
- [Routing Structure](../../../02-architecture/frontend/routing-structure.md) - VCI routes

---

**Last Updated:** 2025-01-15  
**Owner:** Emma (UI/UX + Next.js Frontend Specialist)

