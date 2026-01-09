# Communication Lifecycle Wireframe Change List

**Created:** 2025-01-15  
**Purpose:** Detailed change list to align communication wireframes with the Communication Channels Lifecycle specification  
**Reference:** [Communication Channels Lifecycle](../../../../02-architecture/communication-channels-lifecycle.md)

---

## Executive Summary

This document outlines all required changes to communication wireframes to ensure full alignment with the Communication Channels Lifecycle specification. The changes ensure:
- Regulatory compliance (7-year retention requirement)
- Correct lifecycle state representation
- Consistent UI status indicators
- Complete lifecycle stage visibility

**Priority Levels:**
- 🔴 **CRITICAL:** Regulatory compliance issues that must be fixed
- 🟡 **HIGH:** Important lifecycle state representation issues
- 🟢 **MEDIUM:** UI/UX improvements for better lifecycle visibility

---

## File-by-File Change List

### 1. `task-0.5.1.24-communications-inbox-list.md` - Inbox List Page

**Status:** 🟡 HIGH Priority

#### Changes Required:

1. **Add Lifecycle State Indicators in Conversation List**
   - **Location:** Conversation Item section (around line 105)
   - **Current:** Only shows unread/read indicators
   - **Required:** Add status indicators for lifecycle states:
     - Show "✓✓" for delivered messages
     - Show "✓✓ Read" for read messages  
     - Show badge/indicator for "Threaded" conversations (multiple messages)
     - Show badge for "Workflow-Linked" conversations
   - **Implementation:**
     ```markdown
     **Conversation Item Status Indicators:**
     - **Unread Indicator:** Blue dot (●) on left (8px × 8px)
     - **Read Indicator:** Gray circle (○) or "✓✓ Read" text indicator
     - **Delivered Indicator:** "✓✓ Delivered" (blue) - when message delivered but not read
     - **Threaded Indicator:** Badge showing message count (e.g., "Thread (3)") if multiple messages
     - **Workflow-Linked Indicator:** Badge/icon for workflow-linked conversations
     - **Archived Indicator:** (Not applicable in inbox - only shown in archived view)
     ```

2. **Add Lifecycle State Filter**
   - **Location:** Filters Sidebar section (around line 82)
   - **Current:** Only has Type, Entity, Company, Date filters
   - **Required:** Add "Status" filter to filter by lifecycle state
   - **Implementation:**
     ```markdown
     **Status Filter:**
     - Checkboxes: All, Unread, Read, Threaded, Workflow-Linked
     - Default: All selected
     - Shows conversations by lifecycle state
     ```

3. **Update Empty State Message**
   - **Location:** Empty State section (around line 117)
   - **Current:** Generic "No conversations" message
   - **Required:** Add reference to lifecycle states if applicable
   - **Implementation:** Keep current, no change needed (empty state is appropriate)

---

### 2. `task-0.5.1.25-conversation-detail.md` - Conversation Detail Page

**Status:** 🔴 CRITICAL Priority

#### Changes Required:

1. **Fix Read Receipt Indicator Format (CRITICAL)**
   - **Location:** Message Item Header section (around line 119)
   - **Current:** Shows "✓ Read" or "✓ Delivered" (single checkmark)
   - **Required:** Must use double checkmark format per lifecycle spec:
     - "✓✓ Read" (green #22c55e) - Message has been read
     - "✓✓ Delivered" (gray #6b7280) - Message delivered but not read
     - "✓ Sent" (gray #6b7280) - Message sent but not delivered
   - **Implementation:**
     ```markdown
     **Message Header:**
       - **Sender Name:** Bold, 14px, color: #111827
       - **Timestamp:** 12px, color: #9ca3af, right-aligned
       - **Read Receipt:** 
         - "✓✓ Read" (green #22c55e) - Message read (READ state)
         - "✓✓ Delivered" (blue #3b82f6) - Message delivered (DELIVERED state)
         - "✓ Sent" (gray #6b7280) - Message sent (SENT state)
       - **Read Receipt Visibility:** Always visible to sender (mandatory per governance requirements)
       - **Read Receipt Timestamp:** Show "Read at [timestamp]" on hover/tooltip
     ```

2. **Add Archive Button Visibility**
   - **Location:** Page Header Actions section (around line 85-88)
   - **Current:** Mentions archive button in annotations but not clearly shown in layout
   - **Required:** Make archive button clearly visible in wireframe layout
   - **Implementation:**
     ```markdown
     **Actions (Right-aligned):**
       - **Archive Button:** Secondary button, click → Archive conversation (moves to ARCHIVED state)
       - **More Actions:** Dropdown menu (if needed for additional actions)
       - **Spacing:** 16px between actions
     
     **Archive Button Behavior:**
       - Shows confirmation modal: "Archive this conversation? It will be moved to Archived folder but remain accessible for 7 years."
       - After archive: Conversation moves to ARCHIVED state, removed from active inbox
       - Archive timestamp logged in audit trail
     ```

3. **Add Threaded Conversation Indicator**
   - **Location:** Message Thread section (around line 110)
   - **Current:** Shows messages but no explicit "threaded" indicator
   - **Required:** Add indicator when conversation has multiple messages (THREADED state)
   - **Implementation:**
     ```markdown
     **Thread Indicator:**
       - **Badge:** "Thread (X messages)" shown above message thread
       - **Visibility:** Only shown when message count > 1
       - **Styling:** Badge with count, 14px, color: #6b7280
       - **Position:** Below conversation subject, above first message
     ```

4. **Clarify Workflow-Linked State**
   - **Location:** Workflow Context Panel section (around line 90)
   - **Current:** Shows workflow context but doesn't explicitly indicate it's a lifecycle state
   - **Required:** Add badge/indicator showing "Workflow-Linked" state
   - **Implementation:**
     ```markdown
     **Workflow Context Panel:**
       - **State Badge:** Add "Workflow-Linked" badge at top of panel
       - **Immutable Indicator:** Show lock icon or "Linked" indicator to show link cannot be changed
       - **State Description:** "This conversation is linked to a workflow entity and cannot be unlinked (immutable)"
     ```

5. **Add Lifecycle State Information Panel (Optional Enhancement)**
   - **Location:** New section after workflow context panel
   - **Purpose:** Show current lifecycle state and history
   - **Implementation:**
     ```markdown
     **Lifecycle State Panel (Optional):**
       - **Current State:** Display current lifecycle state (e.g., "Active Thread")
       - **State History:** Show state transitions (Created → Sent → Delivered → Read → Replied → Threaded)
       - **Timestamps:** Show when each state transition occurred
       - **Collapsible:** Can be collapsed to save space
     ```

6. **Update Annotations for Lifecycle States**
   - **Location:** Green (States) section (around line 179)
   - **Required:** Update to include all lifecycle states
   - **Implementation:**
     ```markdown
     ### Green (States)
     - **CREATED state:** Conversation created (timestamp shown)
     - **SENT state:** "✓ Sent" indicator (gray)
     - **DELIVERED state:** "✓✓ Delivered" indicator (blue)
     - **READ state:** "✓✓ Read" indicator (green) with timestamp
     - **REPLIED state:** New message in thread, conversation updated
     - **THREADED state:** "Thread (X messages)" badge visible
     - **WORKFLOW_LINKED state:** Workflow context panel visible with linked entity
     - **ARCHIVED state:** Archive timestamp shown (if archived)
     - **Message sent:** Show success indicator, message appears in thread
     - **Sending state:** Disable Send button, show spinner
     - **Draft saved:** Show "Draft saved" notification
     - **Attachment uploaded:** Show file in attachment list
     - **Loading state:** Skeleton loaders when loading messages
     ```

---

### 3. `task-0.5.1.26-compose-message.md` - Compose Message Interface

**Status:** 🟢 MEDIUM Priority

#### Changes Required:

1. **Add Lifecycle State Information for New Conversations**
   - **Location:** After message content section (around line 111)
   - **Current:** No information about what happens after sending
   - **Required:** Add note about lifecycle states that will be created
   - **Implementation:**
     ```markdown
     **Lifecycle State Note (Information Box):**
       - **Text:** "After sending, this conversation will enter the lifecycle: Created → Sent → Delivered → Read"
       - **Workflow-Linked Note:** "If linked to a workflow entity, the link will be permanent (immutable)"
       - **Styling:** Info box with blue background (#eff6ff), border (#3b82f6)
       - **Position:** Below workflow entity linking section or above action buttons
     ```

2. **Add Workflow Entity Linking Immutability Warning**
   - **Location:** Workflow Entity Linking section (around line 126)
   - **Current:** Doesn't warn that link is immutable
   - **Required:** Add warning that workflow entity link cannot be changed after creation
   - **Implementation:**
     ```markdown
     **Workflow Entity Linking:**
       - **Warning Text:** "⚠️ Once linked, this conversation will be permanently associated with this workflow entity. The link cannot be changed after creation."
       - **Warning Styling:** Warning box with yellow background (#fef3c7), border (#f59e0b)
       - **Position:** Below entity selection dropdowns
     ```

---

### 4. `task-0.5.1.27-sent-messages.md` - Sent Messages Page

**Status:** ✅ CORRECT - No changes needed

#### Verification:
- ✅ Status indicators correctly show "✓ Sent", "✓✓ Delivered", "✓✓ Read"
- ✅ Status colors correctly defined (gray for sent, blue for delivered, green for read)
- ✅ Filters include status filter

**Note:** This wireframe is correctly aligned with lifecycle specification. No changes required.

---

### 5. `task-0.5.1.28-system-announcements.md` - System Announcements Interface

**Status:** 🟡 HIGH Priority

#### Changes Required:

1. **Add Lifecycle State Indicators for Announcements**
   - **Location:** Announcement List section (around line 64)
   - **Current:** Shows title, date, recipient scope, preview
   - **Required:** Add lifecycle state indicators for announcements
   - **Implementation:**
     ```markdown
     **Announcement Item Status Indicators:**
       - **Broadcast Status:** 
         - "✓ Sent" - Announcement sent
         - "✓✓ Delivered" - Delivered to all recipients
         - "✓✓ Read" - All recipients have read (or show read percentage)
       - **Expiration Status:** Show if announcement has expiration date
       - **Read Tracking:** Show read count per company (for MOH users)
       - **Status Badge:** "Active", "Expired", "Scheduled"
     ```

2. **Add Lifecycle State Information in Create Form**
   - **Location:** Create Announcement Form section (around line 68)
   - **Required:** Add information about announcement lifecycle
   - **Implementation:**
     ```markdown
     **Lifecycle State Information:**
       - **Note:** "Announcements follow the communication lifecycle: Created → Sent → Delivered → Read"
       - **Read Tracking:** "Read status will be tracked per company/user"
       - **Retention:** "All announcements are retained for 7 years for regulatory compliance"
       - **Expiration Note:** "Expired announcements remain accessible but marked as expired"
     ```

---

### 6. `task-0.5.1.29-communication-integration-workflow.md` - Workflow Integration

**Status:** 🟡 HIGH Priority

#### Changes Required:

1. **Add Workflow-Linked State Indicator**
   - **Location:** Conversation Panel section (around line 48)
   - **Current:** Shows conversations but no explicit workflow-linked indicator
   - **Required:** Add badge/indicator showing conversations are workflow-linked
   - **Implementation:**
     ```markdown
     **Conversation Panel Header:**
       - **Badge:** "Workflow-Linked" badge to indicate all conversations in this panel are linked to the workflow entity
       - **Immutable Indicator:** Lock icon to show links cannot be changed
       - **Count Badge:** Show number of linked conversations
     ```

2. **Add Lifecycle State Indicators in Conversation List**
   - **Location:** Conversation List section (around line 51)
   - **Required:** Show lifecycle state indicators for each conversation
   - **Implementation:**
     ```markdown
     **Conversation Item in Panel:**
       - **Status Indicators:** Same as inbox list (✓✓ Read, ✓✓ Delivered, etc.)
       - **Thread Indicator:** Show if conversation has multiple messages
       - **Workflow-Linked Badge:** Always shown (all conversations in this panel are workflow-linked)
     ```

---

### 7. `task-0.5.1.36-archived-conversations.md` - Archived Conversations Page

**Status:** 🔴 CRITICAL Priority - Regulatory Compliance Issue

#### Changes Required:

1. **Fix Retention Period (CRITICAL - Regulatory Compliance)**
   - **Location:** Info Message section (around line 50-51, 113)
   - **Current:** States "Archived conversations are kept for 1 year. After that, they are permanently deleted."
   - **Required:** Must state "7-year retention mandatory" per lifecycle spec and regulatory requirements
   - **Implementation:**
     ```markdown
     **Info Message:**
       - **Text:** "Archived conversations are retained for 7 years (regulatory requirement). After 7 years, conversations are automatically removed from active archive but remain in audit logs for compliance purposes. No hard deletes are allowed."
       - **Icon:** Info icon
       - **Background:** #eff6ff (blue-50)
       - **Border:** 1px solid #3b82f6 (blue-500)
       - **Border Radius:** 6px
       - **Padding:** 12px
       - **Typography:** 14px, color: #1e40af
     ```

2. **Add Retention Period Indicator**
   - **Location:** Archived Conversation List section (around line 103)
   - **Required:** Show remaining retention period or retention expiration date
   - **Implementation:**
     ```markdown
     **Conversation Item:**
       - **Archived Date:** 14px, color: #9ca3af, italic
       - **Retention Period:** Show "Retained until [date]" or "Retention expires in [X] years"
       - **Expiring Soon Warning:** If within 1 year of expiration, show warning badge
     ```

3. **Remove "Permanently Deleted" Language**
   - **Location:** Throughout document
   - **Current:** Mentions "permanently deleted" which violates immutability requirements
   - **Required:** Replace with language about retention period and audit log preservation
   - **Implementation:**
     ```markdown
     **Replace all instances of "permanently deleted" with:**
     - "Removed from active archive after 7 years"
     - "Remains in audit logs for compliance"
     - "No hard deletes allowed (regulatory requirement)"
     ```

4. **Add RETAINED State Information**
   - **Location:** New section after Archived Conversation List
   - **Required:** Explain the RETAINED state and its distinction from ARCHIVED
   - **Implementation:**
     ```markdown
     **Retention Status Information:**
       - **RETAINED State:** Conversations automatically enter RETAINED state after archive
       - **7-Year Period:** Full 7-year retention period applies from archive date
       - **Searchable:** Retained conversations remain searchable and filterable
       - **Exportable:** Can be exported for regulatory audits
       - **Immutable:** No modifications or deletions allowed during retention period
     ```

5. **Update Restore Functionality**
   - **Location:** Bulk Actions section (around line 108)
   - **Current:** Says restore moves back to inbox
   - **Required:** Clarify that archive timestamp remains (for audit trail)
   - **Implementation:**
     ```markdown
     **Restore Functionality:**
       - **Restore Action:** Restores conversation to active inbox
       - **Note:** "Archive timestamp is preserved for audit trail purposes (immutable)"
       - **Confirmation Modal:** "Restore X conversations? They will be moved back to your inbox. The original archive timestamp will be preserved in the audit trail."
     ```

---

## Cross-File Changes (Apply to All Communication Wireframes)

### 1. Add Reference to Lifecycle Specification

**Location:** Related Documents section in all communication wireframes

**Required Addition:**
```markdown
- [Communication Channels Lifecycle](../../../../02-architecture/communication-channels-lifecycle.md) - Complete lifecycle definition with state transitions, governance requirements, and UI status indicators
```

**Files to Update:**
- task-0.5.1.24-communications-inbox-list.md
- task-0.5.1.25-conversation-detail.md
- task-0.5.1.26-compose-message.md
- task-0.5.1.27-sent-messages.md
- task-0.5.1.28-system-announcements.md
- task-0.5.1.29-communication-integration-workflow.md
- task-0.5.1.36-archived-conversations.md

### 2. Update Status Indicators Documentation

**Location:** Design System References section in relevant wireframes

**Required:** Document the lifecycle state indicator format consistently:
- ✓ Sent (single checkmark, gray)
- ✓✓ Delivered (double checkmark, blue)
- ✓✓ Read (double checkmark, green)

---

## Priority Implementation Order

### Phase 1: Critical Regulatory Compliance (Immediate)
1. ✅ Fix retention period in `task-0.5.1.36-archived-conversations.md` (7-year requirement)
2. ✅ Fix read receipt format in `task-0.5.1.25-conversation-detail.md` (double checkmark)

### Phase 2: High Priority Lifecycle States (Within 1 week)
3. ✅ Add archive button visibility in `task-0.5.1.25-conversation-detail.md`
4. ✅ Add threaded indicator in `task-0.5.1.25-conversation-detail.md`
5. ✅ Add workflow-linked state indicators across all relevant wireframes
6. ✅ Add lifecycle state filters in `task-0.5.1.24-communications-inbox-list.md`

### Phase 3: Medium Priority Enhancements (Within 2 weeks)
7. ✅ Add lifecycle state information panels
8. ✅ Add immutability warnings for workflow linking
9. ✅ Update all related documents references
10. ✅ Add retention period indicators in archived conversations

---

## Verification Checklist

After implementing changes, verify:

- [ ] All read receipts show double checkmarks (✓✓) for delivered and read states
- [ ] Retention period is correctly stated as 7 years in all locations
- [ ] No references to "permanent deletion" or "hard deletes" remain
- [ ] Archive functionality is clearly visible in conversation detail page
- [ ] Threaded conversations have visual indicators (badge/count)
- [ ] Workflow-linked conversations show appropriate badges/indicators
- [ ] Lifecycle state transitions are documented or visible where appropriate
- [ ] All wireframes reference the Communication Channels Lifecycle document
- [ ] Status indicators match lifecycle specification exactly:
  - ✓ Sent (gray)
  - ✓✓ Delivered (blue)
  - ✓✓ Read (green)
- [ ] Archive timestamp is shown in archived conversations
- [ ] Retention period information is clearly displayed
- [ ] Immutability warnings are present for workflow entity linking
- [ ] Audit trail implications are mentioned where appropriate

---

## Review Requirements

### Fatima (Governance & Regulatory Review)
- [ ] Verify 7-year retention requirement is correctly represented
- [ ] Confirm immutability requirements are clear
- [ ] Validate that no "hard delete" language remains
- [ ] Ensure regulatory compliance messaging is accurate

### Emma (UI/UX Review)
- [ ] Verify status indicator format consistency across all wireframes
- [ ] Confirm lifecycle state visibility is appropriate
- [ ] Validate that archive functionality is discoverable
- [ ] Ensure workflow-linked state is clearly indicated
- [ ] Review threaded conversation indicators

### Salim (Security & Audit Review)
- [ ] Verify audit trail requirements are mentioned
- [ ] Confirm immutability indicators are present
- [ ] Validate retention period compliance
- [ ] Ensure no language suggests data deletion

---

## Related Documents

- [Communication Channels Lifecycle](../../../../02-architecture/communication-channels-lifecycle.md) - Complete lifecycle specification
- [Communication Channels Requirements](../../../../02-architecture/communication-channels-requirements.md) - Requirements document
- [Communication Channels Lifecycle Review Checklist](../../../../02-architecture/communication-channels-lifecycle-review-checklist.md) - Review checklist

---

**Status:** 📋 Change List Created  
**Last Updated:** 2025-01-15  
**Next Steps:** Implement changes per priority order, then conduct specialist reviews

