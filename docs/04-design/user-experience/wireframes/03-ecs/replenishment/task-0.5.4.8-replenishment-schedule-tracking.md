# Task 0.5.4.8: Replenishment Schedule Tracking Interface Wireframe

**Status:** ✅ Complete  
**Route:** `/ecs/replenishment` or `/ecs/authorizations/[id]/replenishment`  
**File:** `task-0.5.4.8-replenishment-schedule-tracking.png`  
**Priority:** 🟡 ECS Module

**Design Approach:** Timeline visualization interface for tracking replenishment schedules with delay indicators and escalation stages. Professional, accessible, and optimized for export compliance monitoring and replenishment tracking workflows.

---

## Wireframe Layout

```
┌─────────────────────────────────────────────────────────────┐
│ Home > ECS > Replenishment Schedule Tracking                  │
│                                                             │
│ Replenishment Schedule Tracking                            │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Filters                                                  ││
│ │                                                          ││
│ │ Company: [All ▼] Status: [All ▼] Delay: [All ▼]        ││
│ │                                                          ││
│ │ [Clear Filters]                                          ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Replenishment Schedules Overview                         ││
│ │                                                          ││
│ │ Total Schedules: 25                                      ││
│ │ On Schedule: 18 (72%)                                    ││
│ │ Delayed: 5 (20%)                                         ││
│ │ Critical: 2 (8%)                                         ││
│ │                                                          ││
│ │ Regulatory Compliance Status (Fatima's Requirement):     ││
│ │ • Compliance Rate: 72% on schedule                      ││
│ │ • Regulatory Requirement: Export replenishment tracking ││
│ │ • Regulatory Basis: DMP Art. [X]                        ││
│ │ [View Regulatory Framework]                             ││
│ │                                                          ││
│ │ ┌─────────┐ ┌─────────┐ ┌─────────┐                    ││
│ │ │ On      │ │ Delayed │ │ Critical│                    ││
│ │ │ Schedule│ │ (1-7d)  │ │ (15+d)  │                    ││
│ │ │         │ │         │ │         │                    ││
│ │ │ 18      │ │ 5       │ │ 2       │                    ││
│ │ │ ████████│ │ ███     │ │ █       │                    ││
│ │ └─────────┘ └─────────┘ └─────────┘                    ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Replenishment Schedule Timeline                         ││
│ │                                                          ││
│ │ [Timeline View] [List View]                             ││
│ │                                                          ││
│ │ ┌────────────────────────────────────────────────────┐ ││
│ │ │ Timeline Visualization                             │ ││
│ │ │                                                     │ ││
│ │ │ Authorization → Export → Replenishment Date      │ ││
│ │ │                                                     │ ││
│ │ │ ┌───────────────────────────────────────────────┐ │ ││
│ │ │ │ Schedule: AUTH-2025-001                       │ │ ││
│ │ │ │ Company: ABC Pharma | SKU: SKU001             │ │ ││
│ │ │ │                                                 │ │ ││
│ │ │ │ [Jan 15]────[Feb 15]────[Mar 15]────[Apr 15]  │ │ ││
│ │ │ │ Auth Date   Export     Replenish  Expires     │ │ ││
│ │ │ │    ✓          ✓          ⏳          •        │ │ ││
│ │ │ │                                                 │ │ ││
│ │ │ │ Status: On Schedule                             │ │ ││
│ │ │ │ Days to Replenishment: 15 days                  │ │ ││
│ │ │ │ [View Details]                                  │ │ ││
│ │ │ └───────────────────────────────────────────────┘ │ ││
│ │ │                                                     │ ││
│ │ │ ┌───────────────────────────────────────────────┐ │ ││
│ │ │ │ Schedule: AUTH-2025-003                       │ │ ││
│ │ │ │ Company: XYZ Medical | SKU: SKU002            │ │ ││
│ │ │ │                                                 │ │ ││
│ │ │ │ [Jan 10]────[Feb 10]────[Mar 10]────[Apr 10]  │ │ ││
│ │ │ │ Auth Date   Export     Replenish  Expires     │ │ ││
│ │ │ │    ✓          ✓          ⚠️          •        │ │ ││
│ │ │ │                                                 │ │ ││
│ │ │ │ Status: ⚠️ Delayed (5 days overdue)            │ │ ││
│ │ │ │ Days Overdue: 5 days                           │ │ ││
│ │ │ │ Escalation: Warnings (Days 2-7)                │ │ ││
│ │ │ │ [View Details] [Escalate]                      │ │ ││
│ │ │ └───────────────────────────────────────────────┘ │ ││
│ │ │                                                     │ ││
│ │ │ ┌───────────────────────────────────────────────┐ │ ││
│ │ │ │ Schedule: AUTH-2025-005                       │ │ ││
│ │ │ │ Company: DEF Corp | SKU: SKU003               │ │ ││
│ │ │ │                                                 │ │ ││
│ │ │ │ [Jan 5]────[Feb 5]────[Mar 5]────[Apr 5]      │ │ ││
│ │ │ │ Auth Date   Export     Replenish  Expires     │ │ ││
│ │ │ │    ✓          ✓          🚨          •        │ │ ││
│ │ │ │                                                 │ │ ││
│ │ │ │ Status: 🚨 Critical (18 days overdue)          │ │ ││
│ │ │ │ Days Overdue: 18 days                          │ │ ││
│ │ │ │ Escalation: Critical (Days 15+)                │ │ ││
│ │ │ │ [View Details] [Take Action] [Escalate]        │ │ ││
│ │ │ └───────────────────────────────────────────────┘ │ ││
│ │ └────────────────────────────────────────────────────┘ ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Escalation Stages Reference                              ││
│ │                                                          ││
│ │ • Day 1: Alerts (Email notifications)                   ││
│ │ • Days 2-7: Warnings (Email + dashboard alerts)        ││
│ │ • Days 8-14: Escalation (Email + MOH notification)     ││
│ │ • Days 15+: Critical (Email + MOH escalation + action) ││
│ └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

### List View

```
┌─────────────────────────────────────────────────────────────┐
│ Replenishment Schedules List                                 │
│                                                             │
│ ID          Company         SKU         Status    Due Date    Days    Actions ││
│ ──────      ────────────    ────        ──────    ──────     ──────   ────── ││
│ AUTH-2025-01 ABC Pharma    SKU001     On Sched.  Mar 15     15d     [View]  ││
│ AUTH-2025-03 XYZ Medical   SKU002     ⚠️ Delayed  Mar 10     -5d     [View]  ││
│              Supplies      Capsule    (5d overdue)         [Escalate]││
│ AUTH-2025-05 DEF Corp      SKU003     🚨 Critical Mar 5      -18d    [View]  ││
│                            Tablet     (18d overdue)         [Action] ││
│ AUTH-2025-08 GHI Pharma    SKU004     On Sched.  Mar 20     10d     [View]  ││
│                                                             ││
│ [Load More]                                                 ││
└─────────────────────────────────────────────────────────────┘
```

### Schedule Detail View

```
┌─────────────────────────────────────────────────────────────┐
│ Replenishment Schedule Detail - AUTH-2025-003                │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Schedule Information                                     ││
│ │                                                          ││
│ │ Authorization ID: AUTH-2025-003                          ││
│ │ Company: XYZ Medical Supplies                            ││
│ │ SKU: SKU002 - Product B / 250mg / Capsule              ││
│ │ Export Quantity: 1,000 units                             ││
│ │                                                          ││
│ │ Status: ⚠️ Delayed (5 days overdue)                      ││
│ │ Escalation Stage: Warnings (Days 2-7)                    ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Timeline                                                 ││
│ │                                                          ││
│ │ Authorization Date: January 10, 2025                     ││
│ │ Export Date: February 10, 2025                           ││
│ │ Replenishment Due Date: March 10, 2025                   ││
│ │ Authorization Expiration: April 10, 2025                 ││
│ │                                                          ││
│ │ [Jan 10]────[Feb 10]────[Mar 10]────[Apr 10]          ││
│ │ Auth Date   Export     Replenish  Expires             ││
│ │    ✓          ✓          ⚠️          •                ││
│ │                                                          ││
│ │ Current Date: March 15, 2025                             ││
│ │ Days Overdue: 5 days                                     ││
│ │                                                          ││
│ │ [Visual Timeline Bar]                                   ││
│ │ [████████████████████░░░░░░░░░░] 5 days overdue        ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Escalation History                                       ││
│ │                                                          ││
│ │ • Critical Alert Sent - March 14, 2025 (15 days)       ││
│ │   (Email + MOH escalation notification)                 ││
│ │                                                          ││
│ │ • Escalation Alert Sent - March 8, 2025 (8 days)       ││
│ │   (Email + MOH notification)                            ││
│ │                                                          ││
│ │ • Warning Alert Sent - March 5, 2025 (2 days)          ││
│ │   (Email + dashboard alert)                             ││
│ │                                                          ││
│ │ • Initial Alert Sent - March 2, 2025 (Day 1)           ││
│ │   (Email notification)                                  ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Actions                                                  ││
│ │                                                          ││
│ │ [If Company User]                                        ││
│ │ [Update Replenishment Status] [Add Notes]               ││
│ │                                                          ││
│ │ [If MOH Tier 1/Tier 2]                                  ││
│ │ [Escalate to Compliance] [Request Status Update]        ││
│ │ [Add Notes]                                              ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ [Back to List]                                              │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Component Specifications

### Page Header
- **Breadcrumbs:** "Home > ECS > Replenishment Schedule Tracking"
- **Title:** "Replenishment Schedule Tracking"
  - **Typography:** 24px, font-weight: 600, color: #111827

### Filters Section
- **Layout:** Horizontal filter bar
- **Filters:**
  - **Company:** Dropdown (All, specific companies)
  - **Status:** Dropdown (All, On Schedule, Delayed, Critical)
  - **Delay:** Dropdown (All, No Delay, 1-7 days, 8-14 days, 15+ days)
- **Actions:** Clear Filters button

### Overview Statistics Section
- **Layout:** Card with statistics summary
- **Metrics:**
  - Total Schedules: Count of all replenishment schedules
  - On Schedule: Count and percentage of schedules on track
  - Delayed: Count and percentage of delayed schedules (1-14 days)
  - Critical: Count and percentage of critical schedules (15+ days)
- **Visualization:**
  - Three-column summary cards with counts and progress bars
  - Color coding: On Schedule (green), Delayed (yellow), Critical (red)

### Timeline Visualization Section
- **Layout:** Card with timeline view
- **View Toggle:** Timeline View / List View
- **Timeline Entries:**
  - Each entry shows:
    - Authorization ID (link to authorization)
    - Company name (link to company)
    - SKU information (link to SKU)
    - Timeline visualization:
      - Authorization Date (✓ checkmark)
      - Export Date (✓ checkmark if completed)
      - Replenishment Due Date (⏳ pending, ⚠️ delayed, 🚨 critical)
      - Authorization Expiration Date (• indicator)
    - Status badge (On Schedule, Delayed, Critical)
    - Days to/overdue indicator
    - Escalation stage indicator
    - Action buttons (View Details, Escalate, Take Action)
- **Visual Timeline:**
  - Horizontal timeline bar showing key dates
  - Color-coded status indicators
  - Current date marker
  - Days remaining/overdue display

### List View
- **Layout:** Table view
- **Columns:**
  - ID (Authorization ID, link to detail)
  - Company (link to company)
  - SKU (link to SKU)
  - Status (badge with color coding)
  - Due Date (formatted date)
  - Days (days remaining/overdue, color-coded)
  - Actions (View, Escalate, Take Action buttons)
- **Sortable:** Yes (by ID, Company, Due Date, Days, Status)

### Schedule Detail View
- **Layout:** Detail page/modal with full schedule information
- **Sections:**
  1. **Schedule Information:**
     - Authorization ID, Company, SKU
     - Export quantity
     - Status and escalation stage
  2. **Timeline:**
     - Key dates (Authorization, Export, Replenishment Due, Expiration)
     - Visual timeline bar
     - Current date marker
     - Days overdue/remaining indicator
  3. **Escalation History:**
     - Chronological list of escalation events
     - Each entry shows: Date, stage, notification type, recipient
  4. **Actions:**
     - Company users: Update Status, Add Notes
     - MOH users: Escalate, Request Update, Add Notes

---

## Role-Based Access

### Company Users (IPC only)
- **View:** Own company replenishment schedules only
- **Actions:** 
  - View own schedules
  - Update replenishment status
  - Add notes
  - View escalation history
- **No Actions:** Cannot escalate (MOH function)

### MOH Tier 1
- **View:** All replenishment schedules
- **Actions:** 
  - View all schedules
  - Escalate to compliance
  - Request status updates from companies
  - Add notes
  - View all escalation history
- **Escalation:** Can escalate critical cases

### MOH Tier 2
- **View:** All replenishment schedules
- **Actions:** 
  - View all schedules
  - Escalate to compliance
  - Request status updates from companies
  - Add notes
  - View all escalation history
- **Escalation:** Can escalate critical cases

---

## Escalation Stages

### Day 1: Alerts
- **Stage:** Initial alert
- **Color:** Blue (#3b82f6)
- **Notification:** Email notification to company
- **Status Indicator:** "Alert Sent"

### Days 2-7: Warnings
- **Stage:** Warnings
- **Color:** Yellow (#eab308)
- **Notification:** Email + dashboard alerts
- **Status Indicator:** "⚠️ Delayed (X days overdue)"
- **Actions:** Company can update status, MOH can request update

### Days 8-14: Escalation
- **Stage:** Escalation
- **Color:** Orange (#f97316)
- **Notification:** Email + MOH notification
- **Status Indicator:** "⚠️ Delayed (X days overdue) - Escalated"
- **Actions:** MOH escalation, company must respond

### Days 15+: Critical
- **Stage:** Critical
- **Color:** Red (#ef4444)
- **Notification:** Email + MOH escalation + compliance action required
- **Status Indicator:** "🚨 Critical (X days overdue)"
- **Actions:** MOH must take action, enforcement may be required

---

## Business Rules

1. **Replenishment Schedule:** Created automatically when export is authorized
2. **Due Date:** Calculated based on export completion date + replenishment timeline
3. **Delay Calculation:** Days overdue = Current date - Replenishment due date
4. **Escalation Stages:** Automatic escalation based on days overdue
5. **Notifications:** Automated email notifications at each escalation stage
6. **Dashboard Alerts:** Displayed in company and MOH dashboards
7. **MOH Escalation:** Critical cases (15+ days) require MOH action
8. **Status Updates:** Companies can update replenishment status
9. **Enforcement:** Critical delays may trigger enforcement actions
10. **Historical Tracking:** All escalation events are logged in escalation history

---

## Design System References

- [UI Component Specifications](../../../../02-architecture/frontend/ui-component-specifications.md) - Timelines, charts, tables
- [Workflow Architecture](../../../../02-architecture/workflow-architecture.md) - Export Request Workflow
- [Export Authorization Detail](../authorizations/task-0.5.4.6-export-authorization-detail.md) - Authorization information

---

## Related Wireframes

- [Export Authorization Detail](../authorizations/task-0.5.4.6-export-authorization-detail.md)
- [Export Authorizations List](../authorizations/task-0.5.4.5-export-authorizations-list.md)
- [Export Completion Reporting](../authorizations/task-0.5.4.7-export-completion-reporting.md)
- [ECS Overview](../overview/task-0.5.4.0-ecs-overview.md)

---

**Last Updated:** 2025-01-15  
**Owner:** Emma (UI/UX + Next.js Frontend Specialist)  
**Guided by:** Fatima (MOH Regulatory Requirements) & Dr. Samir (Business Process Validation)

