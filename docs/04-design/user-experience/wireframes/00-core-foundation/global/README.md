# Global Section Pages Wireframes

**Category:** Global Section Pages  
**Priority:** 1 - Critical Foundation  
**Status:** ⚪ Not Started

## Wireframes

### Task 0.5.1.30: History Overview Page

**Route:** `/history`  
**File:** `task-0.5.1.30-history-overview.png`

**Layout:**
- Role-based historical overview
- Quick filters (type, date range, entity)
- Recent history summary
- Date range picker

**Components:**
- Page header: "History" title, Date range picker
- Quick filters: Submission type, Entity type, Date range, Company (MOH only)
- Recent history summary: Timeline or list of recent changes
- History items: Entity type, Action, User, Timestamp, Link to detail

**Role-Based Variations:**
- **Company Users:** Personal history (own company's submissions, approvals)
- **MOH Tier 1:** System-wide history (all companies, all actions)
- **MOH Tier 2:** Oversight history (verifications, approvals)

**Annotations Required:**
- **Blue:** Click filter → Apply filter, update list
- **Blue:** Click history item → Navigate to entity detail or history detail
- **Green:** Loading state, Empty state, Filtered results indicator

**Design System References:**
- Timeline component, Filter component, Date range picker component
- List component

---

### Task 0.5.1.31: Notifications Page

**Route:** `/notifications`  
**File:** `task-0.5.1.31-notifications-page.png`

**Layout:**
- Full notification list
- Filters (type, read/unread, date)
- Mark as read actions
- Notification settings

**Components:**
- Notification list: Type icon, Title, Message, Timestamp, Read/unread indicator
- Filters: Notification type, Read/unread status, Date range
- Actions: Mark as read (individual), Mark all as read, Delete
- Settings: Notification preferences, Email preferences

**Notification Types:**
- Submission status changes
- Breach alerts
- Action required
- System announcements
- Approval requests

**Annotations Required:**
- **Blue:** Click notification → Navigate to related page
- **Blue:** Click mark as read → Mark notification as read
- **Blue:** Click settings → Open notification settings
- **Green:** Unread notification (bold, indicator), Read notification (normal), Empty state

**Design System References:**
- List component, Filter component, Settings panel component
- Badge component (unread indicator)

---

### Task 0.5.1.32: Audit Logs List Page

**Route:** `/audit/logs` (MOH/Auditors only)  
**File:** `task-0.5.1.32-audit-logs-list.png`

**Layout:**
- Audit log entries list
- Filters: Date range, table, user, action
- Search input
- Pagination or virtual scrolling

**Components:**
- Audit log table: Timestamp, User, Action, Table, Record ID, Details link
- Filters: Date range picker, Table selector, User selector, Action selector
- Search input (full-text search)
- Pagination or virtual scrolling (for large datasets)
- Export button (MOH Tier 1 only)

**Role-Based Access:**
- **MOH Tier 1:** Full access, export capability
- **MOH Tier 2:** Read-only access, no export
- **Auditors:** Full read access, export capability

**Annotations Required:**
- **Blue:** Click log entry → Navigate to audit log detail
- **Blue:** Click filter → Apply filter, update list
- **Blue:** Click export → Download audit log export
- **Green:** Loading state, Empty state, Filtered results indicator

**Design System References:**
- Table component, Filter component, Search component
- Pagination component, Virtual scrolling component
- Export button component

---

### Task 0.5.1.33: Audit Log Detail Page

**Route:** `/audit/logs/[id]`  
**File:** `task-0.5.1.33-audit-log-detail.png`

**Layout:**
- Log entry details
- Related changes
- User information
- Timestamp
- Hash chain verification

**Components:**
- Log entry details: Action type, Table, Record ID, Old values, New values
- Related changes: Previous log entry, Next log entry, Hash chain link
- User information: User name, Role, Company (if applicable)
- Timestamp: Exact date/time, Timezone
- Hash chain verification: Previous hash, Current hash, Verification status

**Annotations Required:**
- **Blue:** Click previous/next log → Navigate to related log entry
- **Blue:** Click hash chain link → Show hash chain verification
- **Green:** Hash verification status (verified, invalid), Loading state

**Design System References:**
- Detail page layout, Hash chain display component
- User info component, Timestamp component

---

### Task 0.5.1.34: Audit Reports Page

**Route:** `/audit/reports` (MOH/Auditors only)  
**File:** `task-0.5.1.34-audit-reports.png`

**Layout:**
- Audit report list
- Report types
- Date range filters
- Download actions

**Components:**
- Report list: Report type, Date range, Generated date, Status, Download button
- Report types: User activity, System changes, Compliance audit, Custom report
- Filters: Report type, Date range, Status
- Generate report button (MOH Tier 1 only)

**Role-Based Access:**
- **MOH Tier 1:** Generate reports, download all reports
- **MOH Tier 2:** View and download reports (read-only)
- **Auditors:** View and download reports

**Annotations Required:**
- **Blue:** Click generate report → Open report generation interface
- **Blue:** Click download → Download report file
- **Green:** Report generation status (pending, completed, failed), Loading state

**Design System References:**
- List component, Filter component, Report generation interface
- Download button component, Status badge component

---

### Task 0.5.1.35: System Configuration Page

**Route:** `/system-config` (MOH Tier 1 only)  
**File:** `task-0.5.1.35-system-configuration.png`

**Layout:**
- Module activation interface
- System settings
- Configuration sections

**Components:**
- Module activation: RMM (always active), VCI (always active), ECS (toggle), CMC (toggle), Activation period selector
- System settings: General settings, Notification settings, Email settings, Security settings
- Configuration sections: Tabs or accordion for different settings categories

**Module Activation Features:**
- Toggle switches for ECS and CMC modules
- Activation period: Start date, End date (optional)
- Status indicators: Active, Inactive, Scheduled
- Historical data indicator: "Historical data exists" badge if module inactive but data exists

**Annotations Required:**
- **Blue:** Click toggle → Activate/deactivate module
- **Blue:** Click save → Save configuration changes
- **Orange:** Validation (date ranges, required fields)
- **Green:** Module active state, Module inactive state, Changes saved state

**Design System References:**
- Toggle switch component, Form components, Settings panel component
- Date picker component, Status badge component

---

**Related Documents:**
- [Routing Structure](../../../../02-architecture/frontend/routing-structure.md)
- [Navigation & Layout Patterns](../../../../02-architecture/frontend/navigation-layout-patterns.md)
- [Historical Data Routing Proposal](../../../../02-architecture/frontend/historical-data-routing-proposal.md)

