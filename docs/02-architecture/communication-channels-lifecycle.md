# Communications Lifecycle - Pharmaceutical Governance Platform

**Purpose:** Defines the complete lifecycle of communications from creation to archival, including state transitions, governance requirements, and regulatory compliance.

**Owner:** Fatima (MOH Governance & Regulation SME)  
**Status:** ⚪ Draft - For Review  
**Last Updated:** 2025-01-01

---

## Overview

The communications lifecycle defines how messages and conversations progress through the system from creation to archival, ensuring regulatory compliance, complete audit trails, and proper governance throughout each stage.

This lifecycle applies to all communication types:
- **Direct Messages** (Company ↔ MOH)
- **Workflow-Related Communications** (linked to submissions, approvals, breaches)
- **System Announcements** (MOH → All Companies)
- **Internal MOH Communications** (Tier 1 ↔ Tier 2)

---

## Lifecycle Stages

### Stage 1: Creation & Initiation

**State:** `CREATED`

**Description:**
- Conversation is created with type, subject, and participants
- Initial message is composed and sent
- Conversation is linked to workflow entities (if applicable)
- System generates conversation ID and message ID

**Database State:**
- `conversations.created_at` = current timestamp
- `conversations.type` = conversation type
- `conversations.workflow_entity_type` and `workflow_entity_id` (if linked)
- `messages.created_at` = current timestamp
- `messages.sender_id` = sender user ID
- `messages.recipient_id` = recipient user ID (or NULL for announcements)

**Governance Requirements:**
- All conversations must have a subject
- Participants must have appropriate permissions
- Workflow-linked conversations must validate entity access
- System announcements require Tier 1 permissions

**Audit Trail:**
- `audit_logs` entry: `operation_type = 'conversation_created'`
- `audit_logs` entry: `operation_type = 'message_sent'`
- Hash-chained audit log entry

**UI Indicators:**
- Conversation appears in sender's "Sent" folder
- Conversation appears in recipient's "Inbox" with unread indicator
- Badge count updates in navigation

---

### Stage 2: Delivery States

#### 2.1 Sent State

**State:** `SENT`

**Description:**
- Message has been sent from sender
- Message is in transit to recipient(s)
- Notification created for recipient(s)

**Database State:**
- `messages.created_at` = send timestamp
- `notifications` entry created (type: `new_message`)
- Email notification queued (if enabled)

**UI Indicators:**
- ✓ Sent indicator in sent messages list
- Message appears in conversation thread
- Status: "Sent" in sent messages page

**Governance Requirements:**
- Message content must be validated (XSS prevention, length limits)
- File attachments must be validated (size, type, security scan)
- Rate limiting enforced (50 messages/hour per user)

**Audit Trail:**
- `audit_logs` entry: `operation_type = 'message_sent'`
- Message content hash stored in audit log

---

#### 2.2 Delivered State

**State:** `DELIVERED`

**Description:**
- Message has been delivered to recipient's inbox
- Recipient has access to view the message
- Notification is visible to recipient

**Database State:**
- `notifications.is_read = false` (notification visible)
- Message accessible via RLS policies
- Real-time update sent to recipient

**UI Indicators:**
- ✓✓ Delivered indicator (double checkmark)
- Message appears in recipient's inbox
- Unread badge count increases

**Governance Requirements:**
- Delivery confirmation logged
- Recipient must have access to conversation (RLS enforced)
- System announcements delivered to all target companies

**Audit Trail:**
- `audit_logs` entry: `operation_type = 'message_delivered'` (implicit via notification creation)

---

#### 2.3 Read State

**State:** `READ`

**Description:**
- Recipient has opened and viewed the message
- Read receipt is created
- Notification is marked as read

**Database State:**
- `message_read_receipts` entry created:
  - `message_id` = message ID
  - `user_id` = recipient user ID
  - `read_at` = current timestamp
- `notifications.is_read = true` (if notification exists)
- `conversations.updated_at` = current timestamp (last activity)

**UI Indicators:**
- ✓✓ Read indicator (double checkmark with "Read" text)
- Read receipt visible to sender
- Unread badge count decreases
- Message styling changes (no longer bold/unread)

**Governance Requirements:**
- Read receipts are mandatory (cannot be disabled)
- Read timestamp is immutable
- Read status visible to sender (for accountability)

**Audit Trail:**
- `audit_logs` entry: `operation_type = 'message_read'`
- Read timestamp logged with user ID

---

### Stage 3: Active Communication

#### 3.1 Replied State

**State:** `REPLIED`

**Description:**
- Recipient has responded to the message
- New message added to conversation thread
- Conversation remains active

**Database State:**
- New `messages` entry created in same `conversation_id`
- `conversations.updated_at` = current timestamp
- Original sender becomes recipient of reply
- New notification created for original sender

**UI Indicators:**
- Reply appears in conversation thread
- Conversation moves to top of inbox (most recent activity)
- Unread indicator for original sender

**Governance Requirements:**
- Reply must be in same conversation thread (no new conversation)
- Reply inherits conversation permissions
- Workflow-linked conversations maintain entity link

**Audit Trail:**
- `audit_logs` entry: `operation_type = 'message_sent'` (for reply)
- Conversation activity timestamp updated

---

#### 3.2 Threaded State

**State:** `THREADED`

**Description:**
- Multiple messages in conversation
- Conversation has ongoing activity
- Multiple participants may be involved

**Database State:**
- Multiple `messages` entries with same `conversation_id`
- `conversation_participants` entries for all participants
- `conversations.updated_at` = last message timestamp

**UI Indicators:**
- Message thread view shows chronological messages
- Participant list visible
- Last activity timestamp displayed

**Governance Requirements:**
- All participants must have access to conversation
- Thread maintains conversation context
- Workflow entity link preserved throughout thread

**Audit Trail:**
- All messages in thread logged individually
- Conversation activity tracked via `updated_at`

---

#### 3.3 Workflow-Linked State

**State:** `WORKFLOW_LINKED`

**Description:**
- Conversation is linked to a workflow entity (submission, approval, breach, etc.)
- Messages appear in workflow detail pages
- Context-aware messaging enabled

**Database State:**
- `conversations.workflow_entity_type` = entity type (e.g., 'registry_submission')
- `conversations.workflow_entity_id` = entity ID
- Link is immutable (cannot be changed after creation)

**UI Indicators:**
- Workflow context panel shows linked entity
- "View Submission" / "View Breach" buttons visible
- Conversation appears in workflow detail page

**Governance Requirements:**
- Workflow entity must exist and be accessible
- Participants must have access to linked entity
- Link cannot be removed (maintains audit trail)

**Audit Trail:**
- Workflow entity link logged in conversation creation
- All messages in workflow-linked conversation logged with entity context

---

### Stage 4: Archive & Retention

#### 4.1 Archived State

**State:** `ARCHIVED`

**Description:**
- Conversation is archived (soft delete)
- Conversation no longer appears in active inbox
- Messages remain accessible for audit purposes
- 7-year retention period begins

**Database State:**
- `conversations.archived_at` = current timestamp
- `conversations.updated_at` = archive timestamp
- All messages remain in database (immutable)
- Conversation accessible via archived view

**UI Indicators:**
- Conversation removed from active inbox
- Conversation appears in "Archived" folder
- Archive timestamp displayed
- "Restore" option available (if within retention period)

**Governance Requirements:**
- Archive is soft delete only (no hard deletes)
- Archived conversations remain searchable
- Archive action requires participant permissions
- Archive timestamp is immutable

**Audit Trail:**
- `audit_logs` entry: `operation_type = 'conversation_archived'`
- Archive timestamp and user ID logged
- Archive action is irreversible (for audit integrity)

---

#### 4.2 Retention State

**State:** `RETAINED`

**Description:**
- Conversation is retained for regulatory compliance
- 7-year retention period (regulatory requirement)
- Conversation accessible for audits and investigations
- Immutable record (cannot be deleted)

**Database State:**
- `conversations.archived_at` = archive timestamp
- All messages, attachments, read receipts preserved
- Audit logs maintained with hash chaining
- Data retention policy enforced

**UI Indicators:**
- Archived conversations visible in archived view
- Searchable and filterable
- Exportable for regulatory audits
- Retention period indicator (if applicable)

**Governance Requirements:**
- **7-year retention mandatory** (regulatory requirement)
- No hard deletes allowed (immutability)
- Exportable communication history for audits
- Hash-chained audit logs for verification

**Audit Trail:**
- All lifecycle actions logged in `audit_logs`
- Hash chaining ensures immutability
- Audit log entries retained for 7 years
- Exportable audit trail for regulatory compliance

---

## State Transition Diagram

```
┌─────────────┐
│   CREATED   │ (Conversation created, message sent)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│    SENT     │ (Message sent, notification created)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  DELIVERED  │ (Message delivered to inbox)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│    READ     │ (Message read, read receipt created)
└──────┬──────┘
       │
       ├─────────────────┐
       │                 │
       ▼                 ▼
┌─────────────┐   ┌─────────────┐
│   REPLIED   │   │  THREADED   │ (Multiple messages)
└──────┬──────┘   └──────┬──────┘
       │                  │
       └────────┬─────────┘
                │
                ▼
         ┌─────────────┐
         │ WORKFLOW    │ (Linked to workflow entity)
         │   LINKED    │
         └──────┬──────┘
                │
                │ (User action or retention period)
                ▼
         ┌─────────────┐
         │  ARCHIVED   │ (Soft delete, retained)
         └──────┬──────┘
                │
                ▼
         ┌─────────────┐
         │  RETAINED   │ (7-year retention, immutable)
         └─────────────┘
```

---

## State Validation Rules

### Valid Transitions

1. **CREATED → SENT** (automatic)
   - Message is sent immediately after creation
   - No manual transition required

2. **SENT → DELIVERED** (automatic)
   - Delivery is automatic when message is accessible
   - No manual transition required

3. **DELIVERED → READ** (user action)
   - Requires recipient to open message
   - Read receipt created automatically

4. **READ → REPLIED** (user action)
   - Recipient sends reply
   - New message in same conversation

5. **REPLIED → THREADED** (automatic)
   - Multiple messages create threaded state
   - Automatic when message count > 1

6. **Any Active State → WORKFLOW_LINKED** (at creation)
   - Set during conversation creation
   - Cannot be changed after creation

7. **Any Active State → ARCHIVED** (user action)
   - Participant can archive conversation
   - Requires participant permissions

8. **ARCHIVED → RETAINED** (automatic)
   - Automatic after archive
   - 7-year retention period begins

### Invalid Transitions

- **READ → SENT** (cannot revert)
- **ARCHIVED → ACTIVE** (can restore, but archive timestamp remains)
- **RETAINED → DELETED** (hard deletes not allowed)
- **WORKFLOW_LINKED → UNLINKED** (link is immutable)

---

## Governance Requirements by State

### Fatima's Requirements (MOH Governance & Regulation SME)

#### Creation & Initiation
- ✅ All conversations must have clear subjects
- ✅ Participants must have appropriate permissions
- ✅ System announcements require Tier 1 approval
- ✅ Workflow-linked conversations must validate entity access

#### Delivery States
- ✅ Read receipts are mandatory (cannot be disabled)
- ✅ Delivery confirmation logged for accountability
- ✅ Rate limiting enforced (prevent spam/abuse)

#### Active Communication
- ✅ All participants must have access to conversation
- ✅ Workflow entity links are immutable
- ✅ Thread maintains conversation context

#### Archive & Retention
- ✅ **7-year retention mandatory** (regulatory requirement)
- ✅ No hard deletes allowed (immutability)
- ✅ Exportable communication history for audits
- ✅ Hash-chained audit logs for verification

---

## Integration with Phases

### Phase 0 (Technical Foundation)
- **Database Schema:** States tracked via timestamps and flags
  - `conversations.archived_at` (archive state)
  - `message_read_receipts.read_at` (read state)
  - `messages.created_at` (sent state)
  - `conversations.workflow_entity_type/id` (workflow-linked state)

### Phase 0.5 (UI/UX Wireframes)
- **UI Indicators:** Status indicators in wireframes
  - ✓ Sent (sent state)
  - ✓✓ Delivered (delivered state)
  - ✓✓ Read (read state)
  - Archive button (archive state)
  - Workflow context panel (workflow-linked state)

### Phase 1 (Implementation)
- **State Machine Validation:** RPC functions validate state transitions
  - `communications_send_message()` - validates sent state
  - `communications_mark_read()` - validates read state
  - `communications_archive_conversation()` - validates archive state
  - State transition validation in RPC functions

---

## Audit Trail Requirements

### All Lifecycle Actions Logged

1. **Conversation Created**
   - `operation_type = 'conversation_created'`
   - Logs: conversation_id, type, participants, workflow_entity

2. **Message Sent**
   - `operation_type = 'message_sent'`
   - Logs: message_id, sender_id, recipient_id, content_hash

3. **Message Delivered**
   - `operation_type = 'message_delivered'` (implicit via notification)
   - Logs: message_id, recipient_id, delivery_timestamp

4. **Message Read**
   - `operation_type = 'message_read'`
   - Logs: message_id, user_id, read_at timestamp

5. **Conversation Archived**
   - `operation_type = 'conversation_archived'`
   - Logs: conversation_id, archived_by, archived_at

6. **Message Edited**
   - `operation_type = 'message_edited'`
   - Logs: message_id, edited_at, old_values, new_values

### Hash Chaining

- All audit log entries are hash-chained
- Previous hash included in current entry
- Ensures immutability and tamper detection
- Required for regulatory compliance

---

## Regulatory Compliance

### 7-Year Retention Requirement

- **All communications** must be retained for 7 years
- **No hard deletes** allowed (immutability)
- **Exportable** communication history for audits
- **Searchable** and filterable for investigations

### Immutability Requirements

- Messages cannot be deleted (only archived)
- Message edits tracked via `edited_at` timestamp
- Edit history logged in audit_logs
- Hash-chained audit logs for verification

### Data Isolation

- Company users: Can only see their company's conversations
- MOH users: Can see all conversations (system-wide access)
- Internal MOH conversations: Only visible to MOH users
- RLS policies enforce data isolation

---

## Success Criteria

- ✅ All lifecycle stages defined and documented
- ✅ State transitions validated in RPC functions
- ✅ UI indicators reflect current state
- ✅ Audit trail captures all lifecycle actions
- ✅ 7-year retention enforced
- ✅ Regulatory compliance maintained
- ✅ Governance requirements met

---

## Related Documents

- [Communication Channels Requirements](./communication-channels-requirements.md) - Complete communication specs
- [Database Schema Design](./database/schema-design.md) - Database schema for communications
- [Audit Logging Specification](./security/audit-logging-spec.md) - Audit logging requirements
- [RLS Policy Framework](./security/rls-policy-framework.md) - Data isolation policies
- [Phase 0.5 Wireframes](../../05-project-management/phases/phase-0-5-ui-ux-wireframes.md) - UI wireframes with status indicators
- [Phase 1 Implementation Plan](../../05-project-management/phases/Phase-1-Implementation-Plan.md) - Implementation tasks

---

---

## Specialist Reviews

### Review 1: Governance & Regulatory Review (Fatima)

**Reviewer:** Fatima (MOH Governance & Regulation SME)  
**Status:** ⚪ Pending Review  
**Review Date:** TBD  
**Review Focus:** Regulatory compliance, governance requirements, MOH workflows

#### Review Criteria

**1. Regulatory Compliance**
- [ ] 7-year retention requirement clearly defined and enforceable
- [ ] Immutability requirements meet regulatory standards
- [ ] Export capabilities sufficient for regulatory audits
- [ ] Data isolation aligns with MOH governance policies
- [ ] Escalation protocols align with MOH procedures

**2. Governance Workflows**
- [ ] System announcement approval workflow (Tier 1 only) is correct
- [ ] Workflow-linked communications maintain proper context
- [ ] Internal MOH communications properly isolated
- [ ] Company ↔ MOH communication protocols are appropriate
- [ ] Read receipts mandatory requirement aligns with accountability needs

**3. State Transitions**
- [ ] All state transitions align with MOH business processes
- [ ] Archive process maintains audit trail integrity
- [ ] Workflow entity linking is immutable (cannot be changed)
- [ ] State validation rules prevent invalid transitions

**4. Audit Trail Requirements**
- [ ] All lifecycle actions are logged appropriately
- [ ] Hash chaining ensures immutability verification
- [ ] Audit log entries sufficient for regulatory investigations
- [ ] Communication history exportable for compliance

#### Review Questions for Fatima

1. **Retention & Compliance:**
   - Does the 7-year retention period meet all regulatory requirements?
   - Are there any additional retention requirements for specific communication types?
   - Is the exportable communication history format sufficient for regulatory audits?

2. **Governance Workflows:**
   - Are the escalation protocols (Tier 2 → Tier 1, Company → MOH) appropriate?
   - Does the system announcement approval process (Tier 1 only) meet governance needs?
   - Are internal MOH communications properly isolated from company communications?

3. **State Management:**
   - Do all state transitions align with MOH business processes?
   - Is the archive process appropriate for maintaining audit trail integrity?
   - Should there be any additional states or transitions for governance purposes?

4. **Permissions & Access:**
   - Are the permission requirements for each state appropriate?
   - Does the workflow entity linking maintain proper access control?
   - Are there any additional governance requirements for specific states?

#### Approval Criteria

- ✅ All regulatory compliance requirements met
- ✅ Governance workflows align with MOH procedures
- ✅ State transitions support MOH business processes
- ✅ Audit trail requirements sufficient for regulatory compliance
- ✅ No governance concerns or blockers identified

**Reviewer Sign-off:**
- [ ] **Fatima:** Approved / Needs Changes / Rejected
- **Comments:** _[To be filled by Fatima]_
- **Date:** _[To be filled]_

---

### Review 2: Security & Audit Review (Salim)

**Reviewer:** Salim (Security & Audit Engineer)  
**Status:** ⚪ Pending Review  
**Review Date:** TBD  
**Review Focus:** Security, audit trail, data integrity, immutability

#### Review Criteria

**1. Security Requirements**
- [ ] Encryption requirements (at rest, in transit) are specified
- [ ] Access control via RLS policies is properly defined
- [ ] Input validation requirements prevent XSS, SQL injection
- [ ] Rate limiting prevents abuse/spam
- [ ] File attachment security is addressed

**2. Audit Trail Integrity**
- [ ] All lifecycle actions are logged in audit_logs
- [ ] Hash chaining ensures immutability verification
- [ ] Audit log entries include all necessary metadata
- [ ] Tamper detection mechanisms are in place
- [ ] Audit log export capabilities are sufficient

**3. Data Integrity & Immutability**
- [ ] Messages cannot be hard deleted (only archived)
- [ ] Message edits are tracked via `edited_at` timestamp
- [ ] Edit history is logged in audit_logs
- [ ] Archive process maintains data integrity
- [ ] 7-year retention is enforceable

**4. State Transition Security**
- [ ] State transitions are validated in RPC functions
- [ ] Invalid transitions are prevented
- [ ] State changes are logged in audit_logs
- [ ] Permission checks enforce state transition rules
- [ ] Workflow entity linking is immutable

#### Review Questions for Salim

1. **Security Architecture:**
   - Are the encryption requirements (at rest, in transit) sufficient?
   - Do the RLS policies properly enforce data isolation?
   - Are there any additional security requirements for specific states?

2. **Audit Trail:**
   - Are all lifecycle actions properly logged in audit_logs?
   - Is the hash chaining mechanism sufficient for immutability verification?
   - Are there any additional audit log requirements for specific states?

3. **Data Integrity:**
   - Is the immutability requirement (no hard deletes) properly enforced?
   - Are message edits properly tracked and logged?
   - Is the archive process secure and maintains data integrity?

4. **State Machine Security:**
   - Are state transitions properly validated in RPC functions?
   - Are invalid transitions prevented at the database level?
   - Are there any security concerns with specific state transitions?

#### Approval Criteria

- ✅ All security requirements met
- ✅ Audit trail integrity maintained
- ✅ Data immutability enforced
- ✅ State transition security validated
- ✅ No security concerns or blockers identified

**Reviewer Sign-off:**
- [ ] **Salim:** Approved / Needs Changes / Rejected
- **Comments:** _[To be filled by Salim]_
- **Date:** _[To be filled]_

---

### Review 3: UI/UX Review (Emma)

**Reviewer:** Emma (UI/UX + Next.js Frontend Specialist)  
**Status:** ⚪ Pending Review  
**Review Date:** TBD  
**Review Focus:** UI status indicators, user experience, wireframe alignment

#### Review Criteria

**1. UI Status Indicators**
- [ ] Status indicators (✓ Sent, ✓✓ Delivered, ✓✓ Read) are clearly defined
- [ ] Status indicators align with lifecycle states
- [ ] Visual design of status indicators is appropriate
- [ ] Status indicators are accessible (WCAG 2.1 AA)
- [ ] Status indicators work across all communication types

**2. User Experience**
- [ ] Lifecycle states are intuitive for users
- [ ] State transitions are clear and understandable
- [ ] Archive process is user-friendly
- [ ] Read receipts provide appropriate feedback
- [ ] Workflow-linked conversations are clearly indicated

**3. Wireframe Alignment**
- [ ] Lifecycle states align with wireframe status indicators
- [ ] State transitions are reflected in wireframe interactions
- [ ] Archive functionality is shown in wireframes
- [ ] Read receipt indicators are in wireframes
- [ ] Workflow context panels align with lifecycle states

**4. Component Integration**
- [ ] Status indicators can be implemented in React components
- [ ] State transitions can be handled in UI components
- [ ] Real-time updates align with lifecycle states
- [ ] Loading states align with state transitions
- [ ] Error states are handled appropriately

#### Review Questions for Emma

1. **UI Status Indicators:**
   - Are the status indicators (✓ Sent, ✓✓ Delivered, ✓✓ Read) clear and intuitive?
   - Do the status indicators align with the lifecycle states defined?
   - Are there any additional UI indicators needed for specific states?

2. **User Experience:**
   - Are the lifecycle states intuitive for users?
   - Do state transitions provide appropriate user feedback?
   - Is the archive process user-friendly and clear?

3. **Wireframe Alignment:**
   - Do the wireframes (Tasks 0.5.1.24-0.5.1.29) align with the lifecycle states?
   - Are there any wireframe updates needed to reflect lifecycle states?
   - Do the status indicators in wireframes match the lifecycle definitions?

4. **Component Implementation:**
   - Can the lifecycle states be implemented in React components?
   - Are the state transitions handleable in UI components?
   - Are there any UI/UX concerns with specific state transitions?

#### Approval Criteria

- ✅ UI status indicators align with lifecycle states
- ✅ User experience is intuitive and clear
- ✅ Wireframes align with lifecycle definitions
- ✅ Component implementation is feasible
- ✅ No UI/UX concerns or blockers identified

**Reviewer Sign-off:**
- [ ] **Emma:** Approved / Needs Changes / Rejected
- **Comments:** _[To be filled by Emma]_
- **Date:** _[To be filled]_

---

## Review Status Summary

| Reviewer | Status | Review Date | Approval Status |
|----------|--------|-------------|-----------------|
| **Fatima** (Governance) | ⚪ Pending | TBD | ⚪ Not Reviewed |
| **Salim** (Security) | ⚪ Pending | TBD | ⚪ Not Reviewed |
| **Emma** (UI/UX) | ⚪ Pending | TBD | ⚪ Not Reviewed |

**Overall Status:** ⚪ **Pending All Reviews**

---

## Review Process

### Step 1: Initial Review
1. Each specialist reviews the document independently
2. Specialists complete their review criteria checklists
3. Specialists answer review questions
4. Specialists provide comments and feedback

### Step 2: Feedback Integration
1. Document owner (Fatima) reviews all feedback
2. Updates document based on feedback
3. Resolves any conflicts or concerns
4. Updates document status

### Step 3: Final Approval
1. All specialists review updated document
2. Specialists provide final approval or additional feedback
3. Document status updated to "Approved" when all reviews complete
4. Document locked for implementation

### Step 4: Implementation
1. Phase 1 implementation tasks reference approved lifecycle
2. State machine validation implemented per lifecycle
3. UI components implement status indicators per lifecycle
4. Testing validates lifecycle state transitions

---

**Next Steps:**
1. ⚪ **Fatima Review** - Governance & Regulatory compliance review
2. ⚪ **Salim Review** - Security & Audit integrity review
3. ⚪ **Emma Review** - UI/UX and wireframe alignment review
4. ⚪ **Feedback Integration** - Update document based on reviews
5. ⚪ **Final Approval** - All specialists approve final version
6. ⚪ **Implementation** - Phase 1 tasks reference approved lifecycle

**Status:** ⚪ Draft - For Review (All 3 Specialists)  
**Last Updated:** 2025-01-01

