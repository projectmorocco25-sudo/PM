# Phase 1 Implementation Plan - Phase 0.6 Integration Updates

**Purpose:** Detailed documentation of required updates to Phase 1 Implementation Plan to incorporate Phase 0.6 database schema changes

**Created:** 2025-01-21  
**Status:** ✅ ARCHIVED - All updates integrated into Phase-1-Implementation-Plan.md  
**Archived:** 2025-01-21  
**Owner:** Technical Review Team

---

## Executive Summary

Phase 0.6 (Database Schema Audit & Alignment) has been successfully completed. All critical and high-priority schema gaps have been identified, documented, and integrated into the schema design documents. This document outlines the specific updates required to the Phase 1 Implementation Plan to ensure all Phase 0.6 changes are properly referenced and implemented.

### Phase 0.6 Completion Status

✅ **Schema Design Documents Updated:**
- `schema-design.md` - All new fields and tables added
- `erd.md` - Entity relationships updated
- `data-dictionary.md` - Field definitions updated

✅ **New Fields Added:**
- `users` table: `avatar_url`, `timezone`, `language`, `notification_preferences`
- `conversations` table: `lifecycle_state`
- `messages` table: `delivered_at`
- `disputes` table: `evidence`

✅ **New Tables Added:**
- `follow_ups` - Governance follow-up tracking
- `meetings` - Governance meeting scheduling
- `meeting_attendees` - Meeting attendee tracking

✅ **Documentation Complete:**
- `phase-0-6-team-handoff.md` - Implementation handoff guide
- `phase-0-6-implementation-priorities.md` - Prioritized implementation guide
- `schema-updates-phase0-6-critical-gaps.md` - Migration scripts

---

## Required Updates to Phase 1 Implementation Plan

### Update Category 1: Database Migration Tasks

#### Update 1.1: Core Tables Migration (Task 1.1.1.2)

**Location:** Line 105  
**Current Task:**
```markdown
- [ ] **Task 1.1.1.2:** Create database migration for core tables (users, system_config, audit_logs, notifications, approvals)
```

**Updated Task:**
```markdown
- [ ] **Task 1.1.1.2:** Create database migration for core tables (users, system_config, audit_logs, notifications, approvals)
  - **Reference:** [Schema Design - Core Tables](../../02-architecture/database/schema-design.md#core-tables)
  - **Phase 0.6 Updates:** users table includes new fields (avatar_url, timezone, language, notification_preferences)
  - **Migration Scripts:** See [Schema Updates - Phase 0.6 Critical Gaps](../../02-architecture/database/schema-updates-phase0-6-critical-gaps.md) - Change 1
  - **Implementation Guide:** See [Phase 0.6 Implementation Priorities - Users Table](../../05-project-management/phases/phase-0-6-implementation-priorities.md#1-users-table---profile-preferences)
  - **Estimated Time:** 1-2 hours
  - **Developer Notes:**
    - Avatar uploads should use Supabase Storage: `avatars/{user_id}/{filename}`
    - Timezone default: 'UTC+01:00' (Morocco standard time)
    - Language default: 'en' (English)
    - Notification preferences: JSONB object with boolean flags (see schema-design.md for structure)
```

**Rationale:** Users table now includes Phase 0.6 additions. Migration scripts and implementation details need explicit reference.

---

#### Update 1.2: Communication Tables Migration (Task 1.1.1.2d)

**Location:** Line 106  
**Current Task:**
```markdown
- [ ] **Task 1.1.1.2d:** Create database migration for communication tables (conversations, messages, message_attachments, message_read_receipts, conversation_participants)
```

**Updated Task:**
```markdown
- [ ] **Task 1.1.1.2d:** Create database migration for communication tables (conversations, messages, message_attachments, message_read_receipts, conversation_participants)
  - **Reference:** [Schema Design - Communication Tables](../../02-architecture/database/schema-design.md#communication-tables)
  - **Phase 0.6 Updates:**
    - conversations.lifecycle_state (text, NOT NULL, DEFAULT 'CREATED') - State tracking for communication lifecycle
    - messages.delivered_at (timestamptz, NULLABLE) - Delivery timestamp tracking
  - **Migration Scripts:** See [Schema Updates - Phase 0.6 Critical Gaps](../../02-architecture/database/schema-updates-phase0-6-critical-gaps.md) - Changes 2, 3
  - **Implementation Guide:** See [Phase 0.6 Implementation Priorities](../../05-project-management/phases/phase-0-6-implementation-priorities.md#2-conversations-table---lifecycle-state)
  - **Estimated Time:** 2-4 hours (1-2h lifecycle_state, 1-2h delivered_at)
  - **Developer Notes:**
    - Lifecycle state transitions: CREATED → SENT → DELIVERED → READ → THREADED → WORKFLOW_LINKED → ARCHIVED
    - Use `idx_conversations_lifecycle_state` index for filtering
    - `delivered_at` is different from `read_at` (in message_read_receipts table)
```

**Rationale:** Communication tables now include lifecycle state tracking and delivery timestamps. These are critical for the communication system functionality.

---

#### Update 1.3: Add Governance Tables Migration (New Task 1.1.1.2e)

**Location:** After Task 1.1.1.2d (new task)  
**New Task:**
```markdown
- [ ] **Task 1.1.1.2e:** Create database migration for governance tables (follow_ups, meetings, meeting_attendees)
  - **Reference:** [Schema Design - Governance Tables](../../02-architecture/database/schema-design.md#follow_ups)
  - **Phase 0.6 Addition:** New tables for governance follow-up tracking and meeting scheduling
  - **Migration Scripts:** See [Schema Updates - Phase 0.6 Critical Gaps](../../02-architecture/database/schema-updates-phase0-6-critical-gaps.md) - Changes 4, 5, 6
  - **Implementation Guide:** See [Phase 0.6 Implementation Priorities](../../05-project-management/phases/phase-0-6-implementation-priorities.md#3-follow_ups-table)
  - **Estimated Time:** 8-13 hours (3-4h follow_ups, 3-4h meetings, 2-5h meeting_attendees)
  - **Tables to Create:**
    - follow_ups (governance follow-up tracking)
    - meetings (governance meeting scheduling)
    - meeting_attendees (meeting attendee tracking)
  - **Developer Notes:**
    - follow_ups supports polymorphic relationships via issue_reference_id + issue_reference_table
    - meetings supports polymorphic relationships via related_reference_id + related_reference_table
    - All tables include comprehensive indexes for performance
    - See schema-design.md for complete field definitions and constraints
```

**Rationale:** New governance tables identified in Phase 0.6 need explicit migration tasks. These are critical for MOH Tier 1 Dashboard functionality.

---

### Update Category 2: RLS Policy Tasks

#### Update 2.1: Add RLS Policies for Governance Tables (New Task 1.1.1.3f)

**Location:** After Task 1.1.1.3e (new task)  
**New Task:**
```markdown
- [ ] **Task 1.1.1.3f:** Implement RLS policies for governance tables (follow_ups, meetings, meeting_attendees)
  - **follow_ups:** 
    - MOH Tier 1/2: See all follow-ups
    - Company users: See follow-ups for their company (company_id match)
    - Self-service: Users can update follow-ups assigned to them
  - **meetings:** 
    - MOH Tier 1/2: See all meetings
    - Company users: See meetings where they are attendees OR meetings related to their company
    - Create: MOH Tier 1/2 only
  - **meeting_attendees:** 
    - Inherit access from meetings table (users can see attendees for meetings they can access)
    - Update: MOH Tier 1/2 only (add/remove attendees)
  - **Reference:** [RLS Policy Framework](../../02-architecture/security/rls-policy-framework.md)
  - **Phase 0.6 Context:** See [Phase 0.6 Team Handoff - Dashboard & Governance](../../05-project-management/phases/phase-0-6-team-handoff.md#3-dashboard--governance)
  - **Estimated Time:** 3-5 hours
```

**Rationale:** New governance tables require RLS policies for proper data isolation and access control. This is critical for security and compliance.

---

### Update Category 3: Communication RPC Function Tasks

#### Update 3.1: Communication RPC Functions - State Transitions (Tasks 1.1.1.4g, 1.1.1.4h, 1.1.1.4i, 1.1.1.4j)

**Location:** Lines 123-126  
**Current Tasks:**
```markdown
- [ ] **Task 1.1.1.4g:** Implement communication RPC function - Create conversation (communications_create_conversation - validates permissions, company access, workflow entity access, CREATED → SENT state transition)
- [ ] **Task 1.1.1.4h:** Implement communication RPC function - Send message (communications_send_message - validates user is participant, creates message, notification, audit log, SENT → DELIVERED state transition)
- [ ] **Task 1.1.1.4i:** Implement communication RPC function - Mark read (communications_mark_read - creates read receipt, updates notification, audit log, DELIVERED → READ state transition)
- [ ] **Task 1.1.1.4j:** Implement communication RPC function - Archive conversation (communications_archive_conversation - soft delete, validates permissions, audit log, ACTIVE → ARCHIVED state transition)
```

**Updated Tasks:**
```markdown
- [ ] **Task 1.1.1.4g:** Implement communication RPC function - Create conversation (communications_create_conversation - validates permissions, company access, workflow entity access, CREATED → SENT state transition)
  - **Phase 0.6 Field:** Set conversations.lifecycle_state = 'CREATED' on creation, transition to 'SENT' when first message sent
  - **Reference:** [Communication Channels Lifecycle](../../02-architecture/communication-channels-lifecycle.md)
  
- [ ] **Task 1.1.1.4h:** Implement communication RPC function - Send message (communications_send_message - validates user is participant, creates message, notification, audit log, SENT → DELIVERED state transition)
  - **Phase 0.6 Fields:** 
    - Update conversations.lifecycle_state: 'CREATED'/'SENT' → 'DELIVERED' when message sent
    - Set messages.delivered_at timestamp when message delivered to recipient inbox
  - **Reference:** [Communication Channels Lifecycle](../../02-architecture/communication-channels-lifecycle.md)
  - **Phase 0.6 Context:** See [Phase 0.6 Team Handoff - Communication System](../../05-project-management/phases/phase-0-6-team-handoff.md#2-communication-system)
  
- [ ] **Task 1.1.1.4i:** Implement communication RPC function - Mark read (communications_mark_read - creates read receipt, updates notification, audit log, DELIVERED → READ state transition)
  - **Phase 0.6 Field:** Update conversations.lifecycle_state: 'DELIVERED' → 'READ' when message read
  - **Reference:** [Communication Channels Lifecycle](../../02-architecture/communication-channels-lifecycle.md)
  
- [ ] **Task 1.1.1.4j:** Implement communication RPC function - Archive conversation (communications_archive_conversation - soft delete, validates permissions, audit log, ACTIVE → ARCHIVED state transition)
  - **Phase 0.6 Field:** Update conversations.lifecycle_state to 'ARCHIVED' on archive
  - **Reference:** [Communication Channels Lifecycle](../../02-architecture/communication-channels-lifecycle.md)
```

**Rationale:** Communication RPC functions must explicitly update the lifecycle_state field. This ensures state tracking aligns with Phase 0.6 schema changes.

---

### Update Category 4: User Profile Implementation Tasks

#### Update 4.1: Add User Profile Implementation Task

**Location:** After Task 1.1.1.20c (new task, before Integration Tasks section)  
**New Task:**
```markdown
- [ ] **Task 1.1.1.20d:** Implement user profile page (user information, account settings, preferences)
  - **Wireframe:** [Task 0.5.1.22 - Profile Page](../../04-design/user-experience/wireframes/00-core-foundation/dashboard/task-0.5.1.22-profile-page.md)
  - **Phase 0.6 Fields to Implement:**
    - Avatar upload/display (avatar_url field, Supabase Storage: avatars/{user_id}/{filename})
    - Timezone preference selector (timezone field, default: 'UTC+01:00', Morocco timezone options)
    - Language preference selector (language field, default: 'en', language options)
    - Notification preferences (notification_preferences JSONB: email_enabled, submission_updates, compliance_alerts, enforcement_actions, system_announcements)
  - **Reference:** [Phase 0.6 Team Handoff - User Profile Management](../../05-project-management/phases/phase-0-6-team-handoff.md#1-user-profile-management)
  - **Estimated Time:** 6-10 hours
  - **Developer Notes:**
    - Avatar uploads: Use Supabase Storage bucket 'avatars', path: {user_id}/{filename}
    - Timezone: Use date-fns-tz for timezone handling (Morocco standard: UTC+01:00)
    - Language: Support English (en) initially, structure for future i18n expansion
    - Notification preferences: JSONB form with boolean checkboxes for each preference type
```

**Rationale:** User profile page needs explicit implementation of Phase 0.6 fields. The wireframe exists (Task 0.5.1.22) but implementation tasks need to reference Phase 0.6 schema changes.

---

### Update Category 5: Governance Tables Backend Tasks

#### Update 5.1: Add RPC Functions for Governance Tables (New Tasks)

**Location:** After Task 1.1.1.10a (new tasks, before Frontend Setup Tasks section)  
**New Tasks:**
```markdown
### Governance Tables Backend Tasks (Phase 0.6)
- [ ] **Task 1.1.1.10b:** Create RPC functions for follow_ups table (follow_ups_create, follow_ups_update, follow_ups_list, follow_ups_get, follow_ups_complete)
  - **Reference:** [Schema Design - follow_ups table](../../02-architecture/database/schema-design.md#follow_ups)
  - **Phase 0.6 Context:** See [Phase 0.6 Team Handoff - Dashboard & Governance](../../05-project-management/phases/phase-0-6-team-handoff.md#3-dashboard--governance)
  - **Functions:**
    - follow_ups_create: Create new follow-up assignment (MOH Tier 1/2 only)
    - follow_ups_update: Update follow-up details (assigned user, priority, due_date, notes)
    - follow_ups_list: List follow-ups (role-based: MOH see all, company users see company-scoped)
    - follow_ups_get: Get single follow-up by ID
    - follow_ups_complete: Mark follow-up as completed (set status, completed_at, completed_by)
  - **Estimated Time:** 4-6 hours
  - **Developer Notes:**
    - Support polymorphic relationships via issue_reference_id + issue_reference_table
    - Validate priority values: 'normal', 'high', 'extreme'
    - Validate status values: 'pending', 'in_progress', 'completed', 'cancelled'
    - Use indexes for performance (idx_follow_ups_active_priority for active follow-ups query)

- [ ] **Task 1.1.1.10c:** Create RPC functions for meetings table (meetings_create, meetings_update, meetings_list, meetings_get, meetings_cancel, meetings_complete)
  - **Reference:** [Schema Design - meetings table](../../02-architecture/database/schema-design.md#meetings)
  - **Phase 0.6 Context:** See [Phase 0.6 Team Handoff - Dashboard & Governance](../../05-project-management/phases/phase-0-6-team-handoff.md#3-dashboard--governance)
  - **Functions:**
    - meetings_create: Create new meeting (MOH Tier 1/2 only)
    - meetings_update: Update meeting details (title, scheduled_at, location, agenda, reason)
    - meetings_list: List meetings (role-based: MOH see all, company users see related meetings)
    - meetings_get: Get single meeting by ID with attendees
    - meetings_cancel: Cancel meeting (set status, cancelled_at, cancelled_by)
    - meetings_complete: Mark meeting as completed (set status)
  - **Estimated Time:** 4-6 hours
  - **Developer Notes:**
    - Support polymorphic relationships via related_reference_id + related_reference_table
    - Validate meeting_type: 'emergency', 'scheduled', 'follow_up'
    - Validate status: 'scheduled', 'cancelled', 'completed'
    - Use indexes for performance (idx_meetings_upcoming for upcoming meetings query)

- [ ] **Task 1.1.1.10d:** Create RPC functions for meeting_attendees table (meeting_attendees_add, meeting_attendees_remove, meeting_attendees_list)
  - **Reference:** [Schema Design - meeting_attendees table](../../02-architecture/database/schema-design.md#meeting_attendees)
  - **Phase 0.6 Context:** See [Phase 0.6 Team Handoff - Dashboard & Governance](../../05-project-management/phases/phase-0-6-team-handoff.md#3-dashboard--governance)
  - **Functions:**
    - meeting_attendees_add: Add attendee to meeting (MOH Tier 1/2 only)
    - meeting_attendees_remove: Remove attendee from meeting (MOH Tier 1/2 only)
    - meeting_attendees_list: List attendees for a meeting (inherit meeting access permissions)
  - **Estimated Time:** 2-3 hours
  - **Developer Notes:**
    - Validate response_status: 'pending', 'accepted', 'declined', 'tentative'
    - Enforce RLS: users can only see attendees for meetings they can access
```

**Rationale:** New governance tables require RPC functions for CRUD operations. These functions are needed for MOH Tier 1 Dashboard functionality (follow-ups widget, meetings widget).

---

## Implementation Checklist

### Phase 1.1.1 Updates (Backend Setup)

- [ ] Update Task 1.1.1.2 with Phase 0.6 users table updates
- [ ] Update Task 1.1.1.2d with Phase 0.6 communication table updates
- [ ] Add Task 1.1.1.2e for governance tables migration
- [ ] Add Task 1.1.1.3f for RLS policies on governance tables
- [ ] Update Task 1.1.1.4g with lifecycle_state references
- [ ] Update Task 1.1.1.4h with lifecycle_state and delivered_at references
- [ ] Update Task 1.1.1.4i with lifecycle_state references
- [ ] Update Task 1.1.1.4j with lifecycle_state references
- [ ] Add Task 1.1.1.10b for follow_ups RPC functions
- [ ] Add Task 1.1.1.10c for meetings RPC functions
- [ ] Add Task 1.1.1.10d for meeting_attendees RPC functions
- [ ] Add Task 1.1.1.20d for user profile page implementation

---

## Impact Summary

### New Tasks Added: 6
- Task 1.1.1.2e: Governance tables migration
- Task 1.1.1.3f: RLS policies for governance tables
- Task 1.1.1.10b: follow_ups RPC functions
- Task 1.1.1.10c: meetings RPC functions
- Task 1.1.1.10d: meeting_attendees RPC functions
- Task 1.1.1.20d: User profile page implementation

### Tasks Updated: 6
- Task 1.1.1.2: Core tables migration
- Task 1.1.1.2d: Communication tables migration
- Task 1.1.1.4g: Communication RPC - Create conversation
- Task 1.1.1.4h: Communication RPC - Send message
- Task 1.1.1.4i: Communication RPC - Mark read
- Task 1.1.1.4j: Communication RPC - Archive conversation

### Estimated Additional Time
- Database migrations: 11-19 hours
- RLS policies: 3-5 hours
- RPC functions: 10-15 hours
- Frontend implementation: 6-10 hours
- **Total:** 30-49 hours additional work

---

## References

1. **Phase 0.6 Completion Documents:**
   - [Phase 0.6 Team Handoff](../../05-project-management/phases/phase-0-6-team-handoff.md)
   - [Phase 0.6 Implementation Priorities](../../05-project-management/phases/phase-0-6-implementation-priorities.md)
   - [Phase 0.6 Audit Report](../../05-project-management/phases/phase-0-6-audit-report.md)

2. **Schema Design Documents:**
   - [Schema Design](../../02-architecture/database/schema-design.md)
   - [Schema Updates - Phase 0.6 Critical Gaps](../../02-architecture/database/schema-updates-phase0-6-critical-gaps.md)
   - [Data Dictionary](../../02-architecture/database/data-dictionary.md)

3. **Architecture Documents:**
   - [Communication Channels Lifecycle](../../02-architecture/communication-channels-lifecycle.md)
   - [RLS Policy Framework](../../02-architecture/security/rls-policy-framework.md)

4. **Wireframes:**
   - [Task 0.5.1.22 - Profile Page](../../04-design/user-experience/wireframes/00-core-foundation/dashboard/task-0.5.1.22-profile-page.md)

---

## Next Steps

1. ✅ Review this document with technical team
2. ✅ Update Phase 1 Implementation Plan with all changes
3. ✅ Review updated Phase 1 Implementation Plan
4. ⏳ Begin Phase 1.1.1 implementation with Phase 0.6 integration

---

**Document Status:** ✅ ARCHIVED - All updates successfully integrated into Phase-1-Implementation-Plan.md  
**Last Updated:** 2025-01-21  
**Archived:** 2025-01-21

**Note:** This document is archived for historical reference. All Phase 0.6 integration updates have been incorporated into the main Phase 1 Implementation Plan. Please refer to `Phase-1-Implementation-Plan.md` for the current implementation guide.
