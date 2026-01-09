# Task 0.5.1.36: Archived Conversations Page Wireframe

**Status:** ✅ Complete  
**Route:** `/communications/archived`  
**File:** `task-0.5.1.36-archived-conversations.png`  
**Priority:** 🟢 Global & Help Pages (Priority 7)

**Design Approach:** Modern enterprise archived conversations pattern inspired by Stripe, GitHub, Linear, and shadcn/ui best practices. Professional, accessible, and optimized for regulatory compliance communication workflows.

---

## Wireframe Layout

```
┌─────────────────────────────────────────────────────────────┐
│ Home > Communications > Archived                            │
│                                                             │
│ Archived Conversations              [Restore Selected]      │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Search archived conversations...            [🔍]          ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌──────────┐ ┌───────────────────────────────────────────┐│
│ │ Filters  │ │ Archived Conversation List                 ││
│ │          │ │                                             ││
│ │ Type     │ │ ☐ Subject: Product Submission #12345      ││
│ │ ☐ All    │ │   From: MOH Tier 1                        ││
│ │ ☑ Message│ │   Preview: Your submission has been...    ││
│ │ ☐ System │ │   Archived: 2 weeks ago                    ││
│ │          │ │                                             ││
│ │ Entity   │ │ ☐ Subject: Breach Alert - Product ABC    ││
│ │ ☐ All    │ │   From: System                            ││
│ │ ☐ Subm...│ │   Preview: Stock level below threshold... ││
│ │ ☐ Breach │ │   Archived: 1 month ago                    ││
│ │          │ │                                             ││
│ │ Date     │ │ ☐ Subject: Request for Additional Info    ││
│ │ Last 7d  │ │   From: Company XYZ                       ││
│ │ Last 30d │ │   Preview: Could you provide more...     ││
│ │ Custom   │ │   Archived: 2 months ago                   ││
│ │          │ │                                             ││
│ │          │ │ ☐ Subject: Workflow Approval Required    ││
│ │          │ │   From: MOH Tier 2                        ││
│ │          │ │   Preview: Your approval is needed...    ││
│ │          │ │   Archived: 3 months ago                   ││
│ │          │ │   Retained until: 2029-01-15              ││
│ │          │ │                                             ││
│ │ [Clear]  │ │ [Load More]                                ││
│ └──────────┘ └───────────────────────────────────────────┘│
│                                                             │
│ Info: Archived conversations are retained for 7 years     │
│ (regulatory requirement). After 7 years, conversations     │
│ are automatically removed from active archive but remain   │
│ in audit logs for compliance purposes. No hard deletes    │
│ are allowed.                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## Component Specifications

### Page Header
- **Breadcrumbs:** "Home > Communications > Archived"
- **Title:** "Archived Conversations"
  - **Typography:** 24px, font-weight: 600, color: #111827
- **Actions (Right-aligned):**
  - **Restore Selected Button:** Secondary button, click → Restore selected conversations (disabled if none selected)
  - **Spacing:** 16px between actions

### Search Bar
- **Input:** Full-width search input with placeholder "Search archived conversations..."
- **Icon:** Search icon on right side
- **Functionality:** Real-time search as user types
- **Clear Button:** X button appears when text entered

### Filters Sidebar (Left)
- **Width:** 240px (desktop), hidden on mobile (drawer)
- **Background:** White (#ffffff)
- **Border Right:** 1px solid #e5e7eb
- **Padding:** 16px

**Filter Sections:**
- **Type Filter:**
  - Checkboxes: All, Message, System Announcement, Workflow
  - Default: All selected
- **Entity Filter:**
  - Checkboxes: All, Submission, Breach, Export Request, Enforcement Action, Compliance Score, Dispute, etc.
  - Only visible if conversations linked to entities
- **Date Range Filter:**
  - Options: Last 7 days, Last 30 days, Last 90 days, Custom
  - Custom: Date picker for start and end dates
- **Clear Filters Button:**
  - Resets all filters to default

### Archived Conversation List
- **Width:** Full width minus filters sidebar
- **Background:** White (#ffffff)
- **Padding:** 16px

**Conversation Item:**
- **Checkbox:** Left side, for bulk selection
- **Unread Indicator:** Blue dot (●) for unread, gray circle (○) for read
- **Subject:** Bold, 16px, color: #111827
- **From:** 14px, color: #6b7280
- **Preview:** 14px, color: #6b7280, truncated to 2 lines
- **Archived Date:** 14px, color: #9ca3af, italic - Shows when conversation was archived
- **Retention Period:** 14px, color: #6b7280 - Shows "Retained until [date]" or "Retention expires in [X] years"
- **Expiring Soon Warning:** Badge shown if within 1 year of expiration (warning color)
- **Hover State:** Light gray background (#f9fafb)
- **Click Action:** Navigate to conversation detail (with archive indicator)

### Bulk Actions
- **Restore Selected:** Restores selected conversations to inbox
- **Confirmation Modal:** "Restore X conversations? They will be moved back to your inbox. The original archive timestamp will be preserved in the audit trail (immutable)."
- **Success Message:** "X conversations restored successfully"
- **Note:** Archive timestamp is preserved for audit trail purposes (immutable) - conversation moves to active inbox but archive history remains

### Info Message
- **Text:** "Archived conversations are retained for 7 years (regulatory requirement). After 7 years, conversations are automatically removed from active archive but remain in audit logs for compliance purposes. No hard deletes are allowed."
- **Icon:** Info icon
- **Background:** #eff6ff (blue-50)
- **Border:** 1px solid #3b82f6 (blue-500)
- **Border Radius:** 6px
- **Padding:** 12px
- **Typography:** 14px, color: #1e40af

### Retention Status Information
- **RETAINED State:** Conversations automatically enter RETAINED state after archive
- **7-Year Period:** Full 7-year retention period applies from archive date
- **Searchable:** Retained conversations remain searchable and filterable
- **Exportable:** Can be exported for regulatory audits
- **Immutable:** No modifications or deletions allowed during retention period
- **Audit Trail:** Archive timestamp and all lifecycle states preserved in audit logs (immutable)

---

## Annotations

### Blue (Interactions)
- **Click conversation item** → Navigate to conversation detail (with archive indicator)
- **Click checkbox** → Select/deselect conversation for bulk restore
- **Click "Restore Selected"** → Show confirmation modal, then restore conversations
- **Click individual conversation "Restore" action** → Restore single conversation
- **Click "Clear" filters** → Reset all filters to default
- **Type in search** → Real-time search filtering

### Orange (Validation)
- **Bulk restore confirmation:** "Are you sure you want to restore X conversations?"
- **Restore single conversation:** Show success toast notification

### Green (States)
- **ARCHIVED state:** Conversation archived, removed from active inbox, archive timestamp shown
- **RETAINED state:** Conversation in retention period (7 years), searchable and exportable
- **Selected state:** Checkbox checked, row highlighted
- **Restored state:** Conversation moved back to inbox, success message shown, archive timestamp preserved in audit trail
- **Empty state:** "No archived conversations found" message with icon
- **Expiring soon state:** Warning badge shown if retention period expires within 1 year

---

## Responsive Behavior

### Desktop (1024px+)
- Filters sidebar: Always visible, 240px width
- Conversation list: Full width minus sidebar
- Bulk actions: Always visible in header

### Tablet (768px - 1023px)
- Filters sidebar: Hidden by default, toggle with button (drawer)
- Conversation list: Full width when filters hidden
- Bulk actions: In header

### Mobile (<768px)
- Filters sidebar: Hidden, accessible via drawer/modal
- Conversation list: Full width
- Bulk actions: In header or bottom sheet

---

## Design System References

### Components Used
- **Checkbox Component:** From UI Component Specifications
  - Size: Medium
  - States: Unchecked, Checked, Indeterminate (for "Select All")
- **Button Component:** From UI Component Specifications
  - Variant: Secondary (Restore Selected)
  - Size: Medium (40px height)
  - States: Default, Hover, Active, Disabled
- **Search Input Component:** From UI Component Specifications
  - Variant: Default
  - Size: Medium (40px height)
  - Icon: Search icon on right

### Colors
- **Background:** #ffffff (white)
- **Border:** #e5e7eb (border-default)
- **Text Primary:** #111827 (text-primary)
- **Text Secondary:** #6b7280 (text-secondary)
- **Text Tertiary:** #9ca3af (text-tertiary)
- **Unread Indicator:** #3b82f6 (primary-500)
- **Hover Background:** #f9fafb (gray-50)

### Typography
- **Page Title:** 24px, font-weight: 600, color: #111827
- **Subject:** 16px, font-weight: 500, color: #111827
- **From/Preview:** 14px, color: #6b7280
- **Archived Date:** 14px, color: #9ca3af, italic
- **Retention Period:** 14px, color: #6b7280

### Spacing
- **Container Padding:** 24px (desktop), 16px (mobile)
- **Item Spacing:** 16px between conversations
- **Filter Spacing:** 16px between filter groups

---

## Accessibility

### Keyboard Navigation
- **Tab:** Move between filters, search, conversation items
- **Space/Enter:** Select conversation, toggle checkbox
- **Shift+Click:** Select range of conversations

### Screen Reader Support
- **Checkbox Labels:** "Select conversation: [Subject]"
- **Archive Date:** Announced as "Archived [time ago]"
- **Retention Period:** Announced as "Retained until [date]" or "Retention expires in [X] years"
- **Restore Action:** Announced as "Restore conversation: [Subject]. Archive timestamp will be preserved in audit trail."
- **Retention Info:** Announced as "Conversation retained for 7 years for regulatory compliance"

### Focus Management
- **Visible Focus:** Clear focus indicator (2px outline, primary blue)
- **Focus Order:** Filters → Search → Conversation list → Actions

---

## Related Documents

- [Routing Structure](../../../../02-architecture/frontend/routing-structure.md) - Route: `/communications/archived`
- [Communication Channels Requirements](../../../../02-architecture/communication-channels-requirements.md) - Communication system requirements
- [Communication Channels Lifecycle](../../../../02-architecture/communication-channels-lifecycle.md) - Complete lifecycle definition with state transitions, governance requirements, and UI status indicators
- [UI Component Specifications](../../../../02-architecture/frontend/ui-component-specifications.md) - Input, Button, Checkbox components
- [Design System](../../../../02-architecture/frontend/design-system.md) - Colors, typography, spacing

---

**Last Updated:** 2025-01-15  
**Status:** ✅ Complete  
**Guidance:** Created with guidance from Fatima (MOH Regulatory Requirements) & Dr. Samir (Business Process Validation)

