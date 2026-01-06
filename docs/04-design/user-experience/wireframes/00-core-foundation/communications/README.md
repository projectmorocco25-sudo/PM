# Communication Interfaces Wireframes

**Category:** Communication Interfaces  
**Priority:** 1 - Critical Foundation  
**Status:** ⚪ Not Started

**Note:** Communication wireframes are critical foundation items as they must be integrated into navigation and workflow pages from the start. See [Communication Channels Requirements](../../../../02-architecture/communication-channels-requirements.md) for detailed requirements.

## Wireframes

### Task 0.5.1.24: Communications Inbox List Page

**Route:** `/communications/inbox`  
**File:** `task-0.5.1.24-communications-inbox-list.png`

**Layout:**
- Conversation list (table or card view)
- Filters: Type, workflow entity, company, date range
- Search bar
- Unread indicators
- Role-based access (company users see only their company conversations, MOH see all)

**Components:**
- Conversation list items: Sender/recipient, Subject, Preview, Timestamp, Unread indicator
- Filters sidebar or top bar
- Search input
- Pagination or infinite scroll

**Annotations Required:**
- **Blue:** Click conversation → Navigate to conversation detail
- **Blue:** Click filter → Apply filter
- **Green:** Unread conversation (bold, indicator), Read conversation (normal), Empty state

**Design System References:**
- List/Table component, Filter component, Search component
- Badge component (unread indicator)

---

### Task 0.5.1.25: Conversation Detail Page

**Route:** `/communications/inbox/[conversation_id]`  
**File:** `task-0.5.1.25-conversation-detail.png`

**Layout:**
- Message thread (chronological)
- Reply interface (bottom)
- Attachments display
- Read receipts
- Workflow context (if linked to workflow entity)

**Components:**
- Message thread: Sender, Timestamp, Content, Attachments, Read receipt indicator
- Reply interface: Text area, Attachment upload, Send button
- Workflow context panel: Linked entity (submission, breach, etc.), Quick actions

**Annotations Required:**
- **Blue:** Click reply → Focus reply interface
- **Blue:** Click attachment → Download/view
- **Blue:** Click workflow entity → Navigate to entity detail
- **Green:** Read receipt status, Message sent state, Loading state

**Design System References:**
- Message thread component, Reply form component, Attachment viewer
- Workflow context component

---

### Task 0.5.1.26: Compose Message Interface

**Route:** `/communications/compose`  
**File:** `task-0.5.1.26-compose-message.png`

**Layout:**
- Recipient selection (search, filters, role-based)
- Subject input
- Content text area
- Attachment upload
- Workflow entity linking (optional)

**Components:**
- Recipient picker: Search, Filters (role, company), Multi-select
- Subject input field
- Content text area (rich text editor optional)
- Attachment upload: Drag-drop, file list, progress indicators
- Workflow entity link: Entity type selector, Entity search/select
- Send button, Save draft button

**Annotations Required:**
- **Blue:** Click send → Send message, show success
- **Blue:** Click save draft → Save as draft
- **Orange:** Required field validation (recipient, subject), File size/type validation
- **Green:** Sending state, Success state, Draft saved state

**Design System References:**
- Form components, File upload component, Entity picker component
- Validation patterns (from Form Design Patterns)

---

### Task 0.5.1.27: Sent Messages Page

**Route:** `/communications/sent`  
**File:** `task-0.5.1.27-sent-messages.png`

**Layout:**
- Sent conversations list
- Status indicators (sent, delivered, read)
- Filters and search

**Components:**
- Sent conversations list: Recipient, Subject, Sent date, Status indicator
- Status indicators: Sent (checkmark), Delivered (double checkmark), Read (read receipt)
- Filters: Date range, Recipient, Status
- Search input

**Annotations Required:**
- **Blue:** Click conversation → Navigate to conversation detail
- **Green:** Status indicators (sent, delivered, read), Empty state

**Design System References:**
- List component, Status badge component, Filter component

---

### Task 0.5.1.28: System Announcements Interface

**Route:** `/communications/announcements` (MOH Tier 1 only)  
**File:** `task-0.5.1.28-system-announcements.png`

**Layout:**
- Announcement list
- Creation interface
- Broadcast controls

**Components:**
- Announcement list: Title, Content preview, Broadcast date, Recipient scope
- Create announcement button
- Creation interface: Title, Content (rich text), Recipient selection (all users, specific roles, specific companies), Broadcast date/time, Broadcast button

**Annotations Required:**
- **Blue:** Click create → Open creation interface
- **Blue:** Click broadcast → Send announcement
- **Orange:** Required field validation, Recipient selection validation
- **Green:** Announcement created state, Broadcast success state

**Design System References:**
- Form components, Rich text editor, Recipient picker
- Broadcast controls component

---

### Task 0.5.1.29: Communication Integration in Workflow Pages

**Route:** Component integration (not a route)  
**File:** `task-0.5.1.29-communication-integration-workflow.png`

**Layout:**
- Message button on workflow pages (submissions, breaches, etc.)
- Conversation list panel/sidebar
- Context display (linked workflow entity)

**Components:**
- Message button: Floating action button or inline button
- Conversation list: Related conversations for workflow entity, Unread count badge
- Context panel: Workflow entity info, Quick compose link

**Annotations Required:**
- **Blue:** Click message button → Open conversation list or compose
- **Blue:** Click conversation → Navigate to conversation detail
- **Green:** Unread count badge, Active conversation indicator

**Design System References:**
- Floating action button, Sidebar panel component, Context display component

---

**Related Documents:**
- [Communication Channels Requirements](../../../../02-architecture/communication-channels-requirements.md) - Complete communication system specs
- [Routing Structure](../../../../02-architecture/frontend/routing-structure.md)
- [Form Design Patterns](../../../../02-architecture/frontend/form-design-patterns.md)

