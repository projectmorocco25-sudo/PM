# Task 0.5.1.41: System Status Page Wireframe

**Status:** ✅ Complete  
**Route:** `/status`  
**File:** `task-0.5.1.41-system-status.png`  
**Priority:** 🟢 Global & Help Pages (Priority 7)

**Design Approach:** Professional government platform system status page showing system health, incident history, status indicators, and maintenance schedule. Transparent, accessible, and real-time.

---

## Wireframe Layout

```
┌─────────────────────────────────────────────────────────────┐
│ [MOH Logo]                    [About] [Support] [Status]   │
│                                        [Login] [Register]   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  System Status                                              │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  │  All Systems Operational                    🟢      │   │
│  │                                                     │   │
│  │  Last updated: 2 minutes ago                       │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  │  System Components                                  │   │
│  │                                                     │   │
│  │  ┌──────────────┐  ┌──────────────┐               │   │
│  │  │ Platform     │  │ Database     │               │   │
│  │  │              │  │              │               │   │
│  │  │ 🟢 Operational│  │ 🟢 Operational│              │   │
│  │  │              │  │              │               │   │
│  │  │ 99.9% uptime │  │ 99.9% uptime │               │   │
│  │  │              │  │              │               │   │
│  │  └──────────────┘  └──────────────┘               │   │
│  │                                                     │   │
│  │  ┌──────────────┐  ┌──────────────┐               │   │
│  │  │ API          │  │ Authentication│              │   │
│  │  │              │  │              │               │   │
│  │  │ 🟢 Operational│  │ 🟢 Operational│              │   │
│  │  │              │  │              │               │   │
│  │  │ 99.8% uptime │  │ 99.9% uptime │               │   │
│  │  │              │  │              │               │   │
│  │  └──────────────┘  └──────────────┘               │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  │  Incident History                                   │   │
│  │                                                     │   │
│  │  ▼ Resolved Issues                                  │   │
│  │                                                     │   │
│  │  • Scheduled Maintenance                            │   │
│  │    Date: January 10, 2025                           │   │
│  │    Duration: 2 hours                                │   │
│  │    Status: Completed                                │   │
│  │                                                     │   │
│  │  • Database Performance Issue                       │   │
│  │    Date: January 5, 2025                            │   │
│  │    Duration: 30 minutes                             │   │
│  │    Status: Resolved                                 │   │
│  │                                                     │   │
│  │  • API Rate Limiting Adjustment                     │   │
│  │    Date: December 28, 2024                          │   │
│  │    Duration: 15 minutes                             │   │
│  │    Status: Resolved                                 │   │
│  │                                                     │   │
│  │  [View All Incidents →]                             │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  │  Maintenance Schedule                                │   │
│  │                                                     │   │
│  │  Upcoming Maintenance:                              │   │
│  │                                                     │   │
│  │  • Scheduled System Update                          │   │
│  │    Date: February 5, 2025                           │   │
│  │    Time: 2:00 AM - 4:00 AM                          │   │
│  │    Impact: Minimal service disruption               │   │
│  │                                                     │   │
│  │  No other scheduled maintenance.                    │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  [MOH Logo]  © 2025 Ministry of Health. All rights         │
│              reserved. [Terms] [Privacy] [Cookies]          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Component Specifications

### Page Header
- **Title:** "System Status"
  - **Typography:** 36px (desktop), 28px (mobile), font-weight: 700, color: #111827
- **Spacing:** 24px below header navigation

### Overall Status Section
- **Background:** Green (#10b981) for operational, yellow (#f59e0b) for degraded, red (#ef4444) for outage
- **Status Indicator:** Emoji or icon (🟢 Operational, 🟡 Degraded, 🔴 Outage)
- **Status Text:** "All Systems Operational" / "System Degraded" / "System Outage"
  - **Typography:** 24px, font-weight: 600, color: white (when colored background)
- **Last Updated:** "Last updated: [time] ago"
  - **Typography:** 14px, color: white (when colored background)
- **Border Radius:** 8px
- **Padding:** 24px
- **Auto-refresh:** Updates every 60 seconds

### System Components Section
- **Title:** "System Components"
  - **Typography:** 28px, font-weight: 600, color: #111827
- **Grid:** 2 columns (desktop), 1 column (mobile)
- **Component Cards:**
  - **Title:** Component name (Platform, Database, API, Authentication)
  - **Status Indicator:** 🟢 Operational, 🟡 Degraded, 🔴 Outage
  - **Uptime:** "99.9% uptime" or "X% uptime"
  - **Background:** White (#ffffff)
  - **Border:** 1px solid #e5e7eb
  - **Border Radius:** 8px
  - **Padding:** 24px

### Incident History Section
- **Title:** "Incident History"
  - **Typography:** 28px, font-weight: 600, color: #111827
- **Background:** White (#ffffff)
- **Border:** 1px solid #e5e7eb
- **Border Radius:** 8px
- **Padding:** 32px
- **Section Header:** "Resolved Issues" (expandable)
- **Incident Items:**
  - **Title:** Incident name
  - **Date:** Incident date
  - **Duration:** How long incident lasted
  - **Status:** Resolved, In Progress, etc.
  - **Typography:** 16px, color: #4b5563
- **View All Link:** "View All Incidents →" (if more incidents exist)

### Maintenance Schedule Section
- **Title:** "Maintenance Schedule"
  - **Typography:** 28px, font-weight: 600, color: #111827
- **Background:** #eff6ff (blue-50)
- **Border:** 1px solid #3b82f6 (blue-200)
- **Border Radius:** 8px
- **Padding:** 32px
- **Maintenance Items:**
  - **Title:** Maintenance name
  - **Date:** Scheduled date
  - **Time:** Scheduled time window
  - **Impact:** Expected impact description
  - **Typography:** 16px, color: #4b5563

---

## Annotations

### Blue (Interactions)
- **Click "View All Incidents →"** → Navigate to full incident history page or expand list
- **Click incident item** → Expand to show details (if collapsed)
- **Click section header** → Expand/collapse section (if applicable)
- **Auto-refresh:** Status updates every 60 seconds

### Orange (Validation)
- **Status checks:** System health monitored in real-time
- **Incident updates:** New incidents appear automatically

### Green (States)
- **Operational:** 🟢 Green indicator, "Operational" text
- **Degraded:** 🟡 Yellow indicator, "Degraded" text
- **Outage:** 🔴 Red indicator, "Outage" text
- **Loading state:** Skeleton loaders while fetching status

---

## Responsive Behavior

### Desktop (1024px+)
- Components: 2-column grid
- Sections: Full width, max-width 1200px, centered
- Status indicators: Large icons/emojis

### Tablet (768px - 1023px)
- Components: 2-column grid
- Sections: Full width minus margins
- Status indicators: Medium icons/emojis

### Mobile (<768px)
- Components: 1-column stack
- Sections: Full width minus 32px margins
- Status indicators: Small icons/emojis
- Typography: Smaller sizes

---

## Design System References

### Components Used
- **Card Component:** System component cards
- **Badge Component:** Status indicators
  - Variants: Success (🟢), Warning (🟡), Error (🔴)
- **Icon Component:** Status icons
- **Link Component:** "View All Incidents" link

### Colors
- **Background Primary:** #ffffff (white)
- **Background Secondary:** #eff6ff (blue-50)
- **Status Operational:** #10b981 (green-500)
- **Status Degraded:** #f59e0b (yellow-500)
- **Status Outage:** #ef4444 (red-500)
- **Text Primary:** #111827 (gray-900)
- **Text Secondary:** #4b5563 (gray-600)
- **Border:** #e5e7eb (gray-200)

### Typography
- **Page Title:** 36px (desktop), 28px (mobile), font-weight: 700
- **Section Title:** 28px, font-weight: 600
- **Status Text:** 24px, font-weight: 600
- **Body Text:** 16px, line-height: 1.6
- **Last Updated:** 14px

### Spacing
- **Section Spacing:** 48px between sections
- **Card Spacing:** 16px between cards
- **Item Spacing:** 24px between incident items
- **Padding:** 32px for sections, 24px for cards

---

## Accessibility

### Keyboard Navigation
- **Tab:** Move through all interactive elements
- **Enter/Space:** Expand/collapse sections

### Screen Reader Support
- **Status:** Announced as "All Systems Operational" or "System [Status]"
- **Component Status:** Announced as "[Component] is [Status]"
- **Incident:** Announced as "[Incident] on [Date], [Status]"

### Focus Management
- **Visible Focus:** Clear focus indicator (2px outline, primary blue)
- **Auto-refresh:** Announcements for status changes

---

## Regulatory Compliance Notes

**Guidance from Fatima (MOH Regulatory Requirements):**
- System status must be transparent and accessible
- Incident history must be documented for regulatory compliance
- Maintenance schedules must be communicated in advance

**Guidance from Dr. Samir (Business Process Validation):**
- Status indicators should be clear and intuitive
- Maintenance schedules should minimize business disruption
- Incident history should provide sufficient detail for troubleshooting

---

## Related Documents

- [Routing Structure](../../../../02-architecture/frontend/routing-structure.md) - Route: `/status`
- [Design System](../../../../02-architecture/frontend/design-system.md) - Colors, typography, spacing

---

**Last Updated:** 2025-01-15  
**Status:** ✅ Complete  
**Guidance:** Created with guidance from Fatima (MOH Regulatory Requirements) & Dr. Samir (Business Process Validation)

