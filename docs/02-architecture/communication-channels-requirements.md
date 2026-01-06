# Communication Channels Requirements - Pharmaceutical Governance Value Chain Platform (PM)

**Purpose:** This document defines the comprehensive requirements for communication channels in the PM platform, including direct messaging, workflow communications, and governance requirements.

**Last Updated:** 2025-01-01  
**Status:** ✅ Approved - All Questions Answered  
**Owner:** TBD (All stakeholder questions answered with recommended answers)

## Overview

The PM platform requires a comprehensive communication system to enable secure, auditable, and governance-compliant communication between:
- **Companies** (IPCs and Wholesalers) ↔ **MOH** (Tier 1 and Tier 2)
- **MOH Tier 2** ↔ **MOH Tier 1** (internal MOH communications)
- **System** → **Users** (announcements and notifications)

This communication system must support regulatory compliance, maintain complete audit trails, and integrate seamlessly with existing workflows.

## Governance & Regulatory Requirements

### Regulatory Compliance (MOH Requirements)

**Requirement 1: Complete Audit Trail**
- All communications must be logged in `audit_logs` table
- Messages are immutable (no deletion, only archival)
- 7-year data retention requirement (regulatory compliance)
- Full audit trail of all message actions (send, read, archive)

**Requirement 2: Data Isolation**
- Company users can only see messages between their company and MOH
- MOH users can see all messages (system-wide access)
- RLS policies enforce data isolation at database level

**Requirement 3: Security & Encryption**
- Messages encrypted at rest (database encryption)
- Messages encrypted in transit (TLS/HTTPS)
- Access control via RLS policies
- No external communication channels (all within platform)

**Requirement 4: Governance Workflows**
- Communications linked to workflow entities (submissions, approvals, breaches)
- Context-aware messaging from workflow pages
- Escalation protocols (Tier 2 → Tier 1)
- Approval workflows via messaging

**Requirement 5: Regulatory Reporting**
- Communication history exportable for regulatory audits
- Message metadata searchable and filterable
- Integration with audit log system

## Communication Types & Use Cases

### Type 1: Direct Messages (Company ↔ MOH)

**Use Cases:**
- Company requests clarification on submission requirements
- MOH requests additional documentation
- Company provides context for submissions
- MOH provides feedback on submissions
- Escalation requests from companies

**Participants:**
- Company users (company_admin, company_manager, company_user) ↔ MOH users (tier1, tier2_officer, tier2_registrar)
- One-to-one or one-to-many (company to multiple MOH users)

**Requirements:**
- Thread-based conversations
- Message attachments (documents, files)
- Read receipts
- Message status (unread, read, replied)

### Type 2: Workflow-Related Communications

**Use Cases:**
- Approval request clarifications
- Rejection feedback and revision requests
- Verification questions
- Implementation confirmations
- Breach investigation communications

**Participants:**
- Linked to workflow entities (submissions, approvals, breaches)
- Context-aware (messages appear in workflow detail pages)

**Requirements:**
- Messages linked to workflow entities via foreign keys
- Context display in workflow pages
- Automated notifications for workflow-related messages
- Message threading by workflow entity

### Type 3: System Announcements (MOH → All Companies)

**Use Cases:**
- System maintenance notifications
- Policy updates
- Regulatory changes
- Submission deadline reminders
- General announcements

**Participants:**
- MOH Tier 1 → All companies (broadcast)
- MOH Tier 1 → Specific companies (targeted)

**Requirements:**
- Broadcast messaging capability
- Company-specific targeting
- Announcement priority levels
- Read tracking per company
- Expiration dates for announcements

### Type 4: Internal MOH Communications

**Use Cases:**
- Tier 2 → Tier 1 escalation
- Tier 1 → Tier 2 directives
- Peer review communications
- Internal coordination

**Participants:**
- MOH Tier 1 ↔ MOH Tier 2
- Internal MOH only (not visible to companies)

**Requirements:**
- Separate from company communications
- Internal-only visibility
- Escalation workflow integration
- Priority and urgency indicators

### Type 5: Audit Trail Communications

**Use Cases:**
- Communication history for regulatory audits
- Compliance reporting
- Investigation support

**Requirements:**
- All communications logged in audit_logs
- Immutable message records
- Searchable and filterable
- Exportable for audits

## Database Schema Design

### conversations Table

**Purpose:** Thread management for conversations

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PRIMARY KEY, DEFAULT gen_random_uuid() | Conversation ID |
| type | text | NOT NULL | Conversation type (direct_message, workflow_related, announcement, internal_moh) |
| subject | text | NOT NULL | Conversation subject |
| company_id | uuid | REFERENCES companies(id), NULLABLE | Company ID (NULL for internal MOH conversations) |
| workflow_entity_type | text | NULLABLE | Workflow entity type (registry_submission, aams_submission, export_request, breach, etc.) |
| workflow_entity_id | uuid | NULLABLE | Workflow entity ID (links to specific submission/approval/breach) |
| created_by | uuid | REFERENCES users(id), NOT NULL | User who created conversation |
| created_at | timestamptz | DEFAULT now() | Creation timestamp |
| updated_at | timestamptz | DEFAULT now() | Last update timestamp |
| archived_at | timestamptz | NULLABLE | Archive timestamp (soft delete) |
| is_announcement | boolean | DEFAULT false | True for system announcements |
| announcement_expires_at | timestamptz | NULLABLE | Expiration date for announcements |

**Indexes:**
- `idx_conversations_company_id` on `company_id`
- `idx_conversations_workflow_entity` on `(workflow_entity_type, workflow_entity_id)`
- `idx_conversations_created_by` on `created_by`
- `idx_conversations_created_at` on `created_at`
- `idx_conversations_type` on `type`

**RLS Policies:**
- Company users: Can see conversations where `company_id = auth.company_id()`
- MOH users: Can see all conversations (system-wide access)
- Internal MOH conversations: Only visible to MOH users

### messages Table

**Purpose:** Individual messages within conversations

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PRIMARY KEY, DEFAULT gen_random_uuid() | Message ID |
| conversation_id | uuid | REFERENCES conversations(id), NOT NULL | Conversation ID |
| sender_id | uuid | REFERENCES users(id), NOT NULL | Sender user ID |
| recipient_id | uuid | REFERENCES users(id), NULLABLE | Recipient user ID (NULL for announcements) |
| content | text | NOT NULL | Message content |
| is_system_message | boolean | DEFAULT false | True for automated system messages |
| created_at | timestamptz | DEFAULT now() | Creation timestamp |
| updated_at | timestamptz | DEFAULT now() | Last update timestamp |
| edited_at | timestamptz | NULLABLE | Edit timestamp (if message was edited) |
| deleted_at | timestamptz | NULLABLE | Soft delete timestamp (immutable - no hard deletes) |

**Indexes:**
- `idx_messages_conversation_id` on `conversation_id`
- `idx_messages_sender_id` on `sender_id`
- `idx_messages_recipient_id` on `recipient_id`
- `idx_messages_created_at` on `created_at`

**RLS Policies:**
- Users can see messages in conversations they have access to (via conversation RLS)
- Senders can see their sent messages
- Recipients can see their received messages

**Notes:**
- Messages are immutable (no hard deletes)
- Edits are tracked via `edited_at` timestamp
- System messages are automated (workflow triggers, notifications)

### message_attachments Table

**Purpose:** File attachments for messages

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PRIMARY KEY, DEFAULT gen_random_uuid() | Attachment ID |
| message_id | uuid | REFERENCES messages(id), NOT NULL | Message ID |
| file_name | text | NOT NULL | Original file name |
| file_path | text | NOT NULL | Storage path (Supabase Storage) |
| file_size | bigint | NOT NULL | File size in bytes |
| mime_type | text | NOT NULL | MIME type |
| uploaded_by | uuid | REFERENCES users(id), NOT NULL | User who uploaded |
| created_at | timestamptz | DEFAULT now() | Creation timestamp |

**Indexes:**
- `idx_message_attachments_message_id` on `message_id`
- `idx_message_attachments_uploaded_by` on `uploaded_by`

**RLS Policies:**
- Users can see attachments for messages they have access to (via message RLS)

**Storage:**
- Files stored in Supabase Storage: `communications/attachments/{message_id}/{file_name}`
- File upload security per `file-upload-storage-security.md`

### message_read_receipts Table

**Purpose:** Track message read status

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PRIMARY KEY, DEFAULT gen_random_uuid() | Read receipt ID |
| message_id | uuid | REFERENCES messages(id), NOT NULL | Message ID |
| user_id | uuid | REFERENCES users(id), NOT NULL | User who read message |
| read_at | timestamptz | DEFAULT now() | Read timestamp |

**Indexes:**
- `idx_message_read_receipts_message_id` on `message_id`
- `idx_message_read_receipts_user_id` on `user_id`
- `idx_message_read_receipts_read_at` on `read_at`
- UNIQUE constraint on `(message_id, user_id)`

**RLS Policies:**
- Users can see their own read receipts only

### conversation_participants Table

**Purpose:** Track conversation participants (for multi-party conversations)

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PRIMARY KEY, DEFAULT gen_random_uuid() | Participant ID |
| conversation_id | uuid | REFERENCES conversations(id), NOT NULL | Conversation ID |
| user_id | uuid | REFERENCES users(id), NOT NULL | Participant user ID |
| role | text | NOT NULL | Participant role (sender, recipient, cc, bcc) |
| joined_at | timestamptz | DEFAULT now() | Join timestamp |
| left_at | timestamptz | NULLABLE | Leave timestamp (if participant left) |

**Indexes:**
- `idx_conversation_participants_conversation_id` on `conversation_id`
- `idx_conversation_participants_user_id` on `user_id`
- UNIQUE constraint on `(conversation_id, user_id)`

**RLS Policies:**
- Users can see participants for conversations they have access to (via conversation RLS)

## Security & Audit Requirements

### Security Requirements

**Requirement 1: Encryption**
- Messages encrypted at rest (database encryption via Supabase)
- Messages encrypted in transit (TLS/HTTPS)
- File attachments encrypted in storage (Supabase Storage encryption)

**Requirement 2: Access Control**
- RLS policies enforce data isolation
- Company users: Can only see their company's conversations
- MOH users: Can see all conversations (system-wide access)
- Internal MOH conversations: Only visible to MOH users

**Requirement 3: Input Validation**
- Message content sanitized (XSS prevention)
- File upload validation (size limits, type restrictions)
- SQL injection prevention (parameterized queries)

**Requirement 4: Rate Limiting**
- Message sending rate limits (prevent spam)
- File upload rate limits
- API rate limiting for communication endpoints

### Audit Requirements

**Requirement 1: Complete Audit Trail**
- All message actions logged in `audit_logs` table:
  - Message sent
  - Message read
  - Message edited
  - Message archived
  - Attachment uploaded
  - Conversation created
  - Conversation archived

**Requirement 2: Immutability**
- Messages cannot be deleted (only archived)
- Message edits tracked via `edited_at` timestamp
- Edit history logged in audit_logs

**Requirement 3: Regulatory Compliance**
- 7-year data retention (regulatory requirement)
- Audit log hash chaining (immutability verification)
- Exportable communication history for audits

**Requirement 4: Search & Filter**
- Searchable by content, sender, recipient, date range
- Filterable by conversation type, workflow entity, company
- Full-text search capability

## Navigation & Routing Structure

### Navigation Integration

**Sidebar Navigation:**
- **Inbox** link in sidebar (with unread badge count)
- Always visible for all authenticated users
- Badge shows unread message count
- Icon: Mail/Inbox icon

**Header Integration:**
- Notification center integration (new message notifications)
- Quick access to inbox from header
- Unread message indicator in header

### Routing Structure

**Base Route:** `/communications`

**Routes:**
- `/communications/inbox` - Inbox (all conversations)
- `/communications/inbox/[conversation_id]` - Conversation detail
- `/communications/sent` - Sent messages
- `/communications/compose` - Compose new message
- `/communications/announcements` - System announcements (MOH only)
- `/communications/archived` - Archived conversations

**Query Parameters:**
- `/communications/inbox?type=workflow_related` - Filter by type
- `/communications/inbox?workflow_entity=registry_submission&id={id}` - Filter by workflow entity
- `/communications/inbox?company_id={id}` - Filter by company (MOH only)

**Deep Linking:**
- `/communications/inbox/[conversation_id]?message_id={id}` - Direct link to specific message
- Workflow pages link to related conversations: `/communications/inbox?workflow_entity=registry_submission&id={id}`

### Navigation Patterns

**Company User Sidebar:**
```
├── Dashboard
├── RMM
├── VCI
├── Communications (Inbox) [Badge: 3]
│   ├── Inbox
│   ├── Sent
│   └── Archived
└── Profile
```

**MOH User Sidebar:**
```
├── Dashboard
├── RMM
├── VCI
├── Communications (Inbox) [Badge: 12]
│   ├── Inbox
│   ├── Sent
│   ├── Announcements (Tier 1 only)
│   └── Archived
├── Audit
└── System Configuration
```

## UI/UX Considerations

### Inbox Interface

**Features:**
- Conversation list (threaded view)
- Unread/read indicators
- Sender/recipient information
- Timestamp display
- Subject preview
- Workflow entity link (if workflow-related)
- Search and filter
- Pagination or infinite scroll

**Conversation Detail:**
- Message thread view
- Reply functionality
- Attachment display and download
- Read receipts
- Message timestamps
- Sender/recipient information
- Workflow context (if workflow-related)

### Compose Interface

**Features:**
- Recipient selection (user picker, company picker for MOH)
- Subject input
- Message content (rich text editor)
- File attachment upload
- Workflow entity linking (if composing from workflow page)
- Draft auto-save
- Send button

### Workflow Integration

**Features:**
- "Send Message" button on workflow detail pages
- Pre-filled context (workflow entity linked)
- Conversation list on workflow detail pages
- Message notifications in workflow status

### Announcements Interface (MOH Only)

**Features:**
- Announcement list
- Broadcast to all companies or specific companies
- Priority levels
- Expiration dates
- Read tracking per company
- Announcement creation interface

## Integration with Existing Systems

### Notification System Integration

**Integration Points:**
- New message notifications in `notifications` table
- Notification center shows new message alerts
- Email notifications for new messages (via Edge Function)
- Real-time updates (Supabase Realtime)

**Notification Types:**
- `new_message` - New message received
- `message_reply` - Reply to conversation
- `workflow_message` - Message related to workflow
- `announcement` - System announcement

### Workflow Integration

**Integration Points:**
- Messages linked to workflow entities (submissions, approvals, breaches)
- Context-aware messaging from workflow pages
- Workflow status updates via messaging
- Approval/rejection feedback via messaging

**Workflow Entity Types:**
- `registry_submission` - RMM registry submissions
- `aams_submission` - VCI AAMS submissions
- `msq_submission` - VCI MSQ submissions
- `wsl_submission` - VCI WSL submissions
- `export_request` - ECS export requests
- `breach` - VCI breaches
- `compliance_score` - CMC compliance scores
- `dispute` - CMC disputes

### Audit Log Integration

**Integration Points:**
- All message actions logged in `audit_logs` table
- Message creation, reading, editing, archiving logged
- Attachment uploads logged
- Conversation creation logged

**Audit Log Fields:**
- `operation_type`: `message_sent`, `message_read`, `message_edited`, `message_archived`, `attachment_uploaded`, `conversation_created`
- `table_name`: `messages`, `conversations`, `message_attachments`
- `record_id`: Message/conversation/attachment ID
- `old_values`/`new_values`: Message content changes

## API Design

### RPC Functions

**Function 1: `communications_create_conversation()`**
- Create new conversation
- Parameters: `type`, `subject`, `company_id`, `workflow_entity_type`, `workflow_entity_id`, `participants[]`
- Returns: `conversation_id`
- Validates: User permissions, company access, workflow entity access

**Function 2: `communications_send_message()`**
- Send message in conversation
- Parameters: `conversation_id`, `content`, `attachments[]`
- Returns: `message_id`
- Validates: User is conversation participant, conversation not archived
- Creates: Message record, notification, audit log

**Function 3: `communications_mark_read()`**
- Mark message as read
- Parameters: `message_id`
- Returns: `read_receipt_id`
- Creates: Read receipt, updates notification, audit log

**Function 4: `communications_archive_conversation()`**
- Archive conversation
- Parameters: `conversation_id`
- Returns: `archived_at` timestamp
- Validates: User is conversation participant
- Updates: `conversations.archived_at`, audit log

**Function 5: `communications_create_announcement()`**
- Create system announcement (MOH Tier 1 only)
- Parameters: `subject`, `content`, `target_company_ids[]`, `expires_at`, `priority`
- Returns: `conversation_id`
- Validates: User is Tier 1, announcement permissions
- Creates: Conversation (type: announcement), message, notifications for all recipients

### Edge Functions

**Function 1: `send-message-email-notification`**
- Send email notification for new messages
- Reads from `notifications` table (type: `new_message`)
- Sends email via email service
- Marks notification as sent

**Function 2: `process-announcement-notifications`**
- Process announcement notifications
- Creates notifications for all announcement recipients
- Triggers email notifications

## Real-Time Updates

**Supabase Realtime Integration:**
- Real-time message updates (new messages, read receipts)
- Real-time conversation updates (new conversations, archived conversations)
- Real-time notification updates (new message notifications)

**Channels:**
- `conversations:company_id={id}` - Company-specific conversations
- `conversations:user_id={id}` - User-specific conversations
- `messages:conversation_id={id}` - Conversation messages
- `notifications:user_id={id}` - User notifications

## Implementation Phases

### Phase 1: Core Communication Infrastructure (Priority 1)
- Database schema implementation (conversations, messages, attachments, read receipts)
- RLS policies implementation
- Basic RPC functions (create conversation, send message, mark read)
- Audit logging integration

### Phase 2: Navigation & UI (Priority 1)
- Navigation integration (inbox link in sidebar)
- Routing structure implementation
- Inbox interface (conversation list, conversation detail)
- Compose interface
- Wireframes for communication interfaces

### Phase 3: Workflow Integration (Priority 2)
- Workflow entity linking
- Context-aware messaging from workflow pages
- Workflow-related conversation display
- Integration with approval workflows

### Phase 4: Advanced Features (Priority 3)
- System announcements (MOH only)
- Internal MOH communications
- File attachments
- Rich text editor
- Search and filtering
- Real-time updates

### Phase 5: Email Notifications (Priority 3)
- Edge Function for email notifications
- Email templates
- Notification preferences

## Success Criteria

- ✅ All communication types supported (direct messages, workflow-related, announcements, internal MOH)
- ✅ Complete audit trail (all actions logged)
- ✅ Security requirements met (encryption, access control, input validation)
- ✅ Navigation integrated (inbox in sidebar, routing structure)
- ✅ Workflow integration complete (context-aware messaging)
- ✅ Regulatory compliance (7-year retention, immutability)
- ✅ Real-time updates functional
- ✅ Email notifications operational

## Questions & Answers

**All questions have been answered with recommended answers. See [Communication Channels - Questions & Answers](./communication-channels-unanswered-questions.md) for detailed documentation.**

### Approved Answers Summary:

1. **Governance Requirements (Fatima):**
   - ✅ **Communication retention:** 7-year retention (consistent with existing requirements)
   - ✅ **Escalation protocols:** Tier 2 → Tier 1, Company → MOH, with priority levels
   - ✅ **Approval workflows:** System announcements require Tier 1 approval

2. **Security Requirements (Salim):**
   - ✅ **Encryption:** Standard Supabase encryption (at rest, in transit)
   - ✅ **Rate limiting:** 50 messages/hour, 10 attachments/message, 5MB max per file
   - ✅ **Audit logs:** All actions logged, hash-chained, 7-year retention

3. **UI/UX Requirements (Emma):**
   - ✅ **Wireframes:** Already added to Phase 0.5 Priority 1 (6 wireframe tasks)
   - ✅ **Responsive design:** Desktop/tablet optimized, mobile not officially supported
   - ✅ **Accessibility:** WCAG 2.1 AA compliance, keyboard navigation, screen reader support

4. **Architecture Requirements (Oliver):**
   - ✅ **Performance:** < 2s inbox load, < 1s conversation load, < 500ms real-time updates
   - ✅ **Scalability:** 10,000 messages/day/company, 500 concurrent users, 1TB storage
   - ✅ **Integration:** Email service via Edge Function, no external messaging systems

## Related Documents

- [Communication Channels Lifecycle](./communication-channels-lifecycle.md) - Complete lifecycle definition with state transitions and governance requirements (⚪ Pending Review by Fatima, Salim, Emma)
- [Communication Channels Lifecycle Review Checklist](./communication-channels-lifecycle-review-checklist.md) - Review checklist for all 3 specialists
- [Database Schema Design](./database/schema-design.md) - Core database schema
- [Security Architecture](./security/security-architecture.md) - Security requirements
- [RLS Policy Framework](./security/rls-policy-framework.md) - RLS policy design
- [Audit Logging Specification](./security/audit-logging-spec.md) - Audit logging requirements
- [Navigation & Layout Patterns](./frontend/navigation-layout-patterns.md) - Navigation patterns
- [Routing Structure](./frontend/routing-structure.md) - Routing structure
- [File Upload & Storage Security](./security/file-upload-storage-security.md) - File upload security
- [Workflow Architecture](./workflow-architecture.md) - Workflow integration
- [Communication Channels - Questions & Answers](./communication-channels-unanswered-questions.md) - Detailed questions and approved answers

---

**Next Steps:**
1. ✅ All stakeholder questions answered with recommended answers
2. ✅ Phase 0.5 wireframes updated to include communication interfaces (6 tasks added)
3. ✅ Database schema design updated to include communication tables (5 tables added)
4. ✅ Routing structure updated to include communication routes
5. ⚪ Create implementation tasks for Phase 1.1
6. ⚪ Begin wireframe creation (Phase 0.5 Priority 1)

**Status:** ✅ Approved - All Questions Answered  
**Last Updated:** 2025-01-01

