# Schema Updates - Phase 0.6 Critical Gaps

**Purpose:** Detailed specifications for all critical gaps identified during Phase 1 audit

**Lead:** Nadia (Database Specialist)  
**Status:** Ready for Implementation  
**Created:** 2025-01-21  
**Priority:** Critical - Must be implemented before Phase 1 starts

---

## Overview

This document specifies the exact schema changes needed to address 8 critical gaps identified during the Phase 0.6 database schema audit. All changes are required before Phase 1 implementation can begin.

### Changes Summary

| Change Type | Count | Tables Affected |
|-------------|-------|-----------------|
| Field Additions | 5 | `users`, `conversations`, `messages`, `compliance_scores` |
| New Tables | 3 | `follow_ups`, `meetings`, `meeting_attendees` |
| Indexes | 5 | Various |
| **Total** | **13** | **7 tables** |

---

## Change 1: Users Table - Profile Preferences

**Priority:** Critical  
**Wireframe:** `task-0.5.1.22-profile-page.md`  
**Impact:** Profile page functionality (avatar, timezone, language, notifications)

### Fields to Add

#### 1.1: avatar_url
```sql
ALTER TABLE users 
ADD COLUMN avatar_url text NULLABLE;

COMMENT ON COLUMN users.avatar_url IS 'Avatar image URL (Supabase Storage path)';
```

**Specifications:**
- **Type:** `text`
- **Nullable:** Yes (NULL for users without avatars)
- **Default:** NULL
- **Storage:** URL path to Supabase Storage bucket: `avatars/{user_id}/{filename}`
- **Validation:** Must be valid Supabase Storage URL format
- **RLS:** Users can update their own avatar_url, MOH admins can update any user's avatar

#### 1.2: timezone
```sql
ALTER TABLE users 
ADD COLUMN timezone text NOT NULL DEFAULT 'UTC+01:00';

COMMENT ON COLUMN users.timezone IS 'User timezone preference (default: UTC+01:00 for Morocco)';
```

**Specifications:**
- **Type:** `text`
- **Nullable:** No
- **Default:** `'UTC+01:00'` (Morocco standard time)
- **Validation:** Must be valid timezone identifier (e.g., 'UTC+01:00', 'UTC+00:00', 'Africa/Casablanca')
- **Common Values:** 'UTC+01:00', 'UTC+00:00' (daylight saving)
- **RLS:** Users can update their own timezone
- **Index:** Consider `idx_users_timezone` if timezone-based queries needed (e.g., "all users in Morocco timezone")

#### 1.3: language
```sql
ALTER TABLE users 
ADD COLUMN language text NOT NULL DEFAULT 'en';

COMMENT ON COLUMN users.language IS 'User language preference (default: en for English)';
```

**Specifications:**
- **Type:** `text`
- **Nullable:** No
- **Default:** `'en'` (English)
- **Validation:** Must be valid language code (ISO 639-1: 'en', 'ar', 'fr', etc.)
- **Supported Languages:** 'en' (English), 'ar' (Arabic), 'fr' (French)
- **RLS:** Users can update their own language

#### 1.4: notification_preferences
```sql
ALTER TABLE users 
ADD COLUMN notification_preferences jsonb NULLABLE;

COMMENT ON COLUMN users.notification_preferences IS 'Notification preferences: {email_enabled: boolean, submission_updates: boolean, compliance_alerts: boolean, enforcement_actions: boolean, system_announcements: boolean}';
```

**Specifications:**
- **Type:** `jsonb`
- **Nullable:** Yes (NULL means all notifications enabled by default)
- **Default:** NULL (interpreted as all enabled)
- **JSON Structure:**
  ```json
  {
    "email_enabled": true,
    "submission_updates": true,
    "compliance_alerts": true,
    "enforcement_actions": false,
    "system_announcements": true,
    "threshold_reversions": true
  }
  ```
- **Validation:** JSON must conform to structure (can use CHECK constraint)
- **RLS:** Users can update their own notification_preferences
- **Index:** Consider GIN index on `notification_preferences` if querying by preference values:
  ```sql
  CREATE INDEX idx_users_notification_preferences ON users USING GIN (notification_preferences);
  ```

### Migration Script

```sql
-- Migration: Add profile preferences to users table
-- Date: 2025-01-21
-- Author: Nadia (Database Specialist)

BEGIN;

-- Add avatar_url
ALTER TABLE users 
ADD COLUMN avatar_url text NULLABLE;

COMMENT ON COLUMN users.avatar_url IS 'Avatar image URL (Supabase Storage path)';

-- Add timezone
ALTER TABLE users 
ADD COLUMN timezone text NOT NULL DEFAULT 'UTC+01:00';

COMMENT ON COLUMN users.timezone IS 'User timezone preference (default: UTC+01:00 for Morocco)';

-- Add language
ALTER TABLE users 
ADD COLUMN language text NOT NULL DEFAULT 'en';

COMMENT ON COLUMN users.language IS 'User language preference (default: en for English)';

-- Add notification_preferences
ALTER TABLE users 
ADD COLUMN notification_preferences jsonb NULLABLE;

COMMENT ON COLUMN users.notification_preferences IS 'Notification preferences: {email_enabled: boolean, submission_updates: boolean, compliance_alerts: boolean, enforcement_actions: boolean, system_announcements: boolean}';

-- Add validation constraint for notification_preferences (optional but recommended)
ALTER TABLE users
ADD CONSTRAINT check_notification_preferences_structure
CHECK (
  notification_preferences IS NULL OR
  (
    notification_preferences ? 'email_enabled' AND
    notification_preferences ? 'submission_updates' AND
    notification_preferences ? 'compliance_alerts' AND
    notification_preferences ? 'enforcement_actions' AND
    notification_preferences ? 'system_announcements'
  )
);

-- Optional: Add GIN index for notification_preferences queries
CREATE INDEX IF NOT EXISTS idx_users_notification_preferences 
ON users USING GIN (notification_preferences);

-- Optional: Add timezone index if timezone-based queries needed
-- CREATE INDEX IF NOT EXISTS idx_users_timezone ON users (timezone);

COMMIT;
```

### Rollback Script

```sql
-- Rollback: Remove profile preferences from users table

BEGIN;

ALTER TABLE users DROP COLUMN IF EXISTS notification_preferences;
ALTER TABLE users DROP COLUMN IF EXISTS language;
ALTER TABLE users DROP COLUMN IF EXISTS timezone;
ALTER TABLE users DROP COLUMN IF EXISTS avatar_url;

DROP INDEX IF EXISTS idx_users_notification_preferences;
DROP INDEX IF EXISTS idx_users_timezone;

COMMIT;
```

---

## Change 2: Conversations Table - Lifecycle State

**Priority:** Critical  
**Wireframe:** `task-0.5.1.24-communications-inbox-list.md`  
**Impact:** Communication lifecycle tracking, filtering, and status indicators

### Field to Add

#### 2.1: lifecycle_state
```sql
ALTER TABLE conversations 
ADD COLUMN lifecycle_state text NOT NULL DEFAULT 'CREATED';

COMMENT ON COLUMN conversations.lifecycle_state IS 'Lifecycle state (CREATED, SENT, DELIVERED, READ, THREADED, WORKFLOW_LINKED, ARCHIVED)';
```

**Specifications:**
- **Type:** `text`
- **Nullable:** No
- **Default:** `'CREATED'`
- **Allowed Values:** 
  - `'CREATED'` - Conversation created but not sent
  - `'SENT'` - Initial message sent
  - `'DELIVERED'` - Message delivered to recipient inbox
  - `'READ'` - Message read by recipient
  - `'THREADED'` - Multiple messages in conversation (threaded)
  - `'WORKFLOW_LINKED'` - Linked to workflow entity (submission, breach, etc.)
  - `'ARCHIVED'` - Archived (7-year retention)
- **State Transitions:**
  - CREATED → SENT (when first message sent)
  - SENT → DELIVERED (when message delivered)
  - DELIVERED → READ (when message read)
  - Any → THREADED (when second message added)
  - Any → WORKFLOW_LINKED (when linked to workflow entity)
  - Any → ARCHIVED (when archived)
- **Validation:** Must be one of the allowed values (use CHECK constraint or ENUM)
- **Index:** Required for filtering by lifecycle state

### Index

```sql
CREATE INDEX idx_conversations_lifecycle_state 
ON conversations (lifecycle_state);
```

**Index Specifications:**
- **Purpose:** Support filtering by lifecycle state in inbox list
- **Query Pattern:** `WHERE lifecycle_state IN ('READ', 'UNREAD')` or `WHERE lifecycle_state = 'WORKFLOW_LINKED'`
- **Performance:** Critical for inbox list performance (frequently queried)

### Migration Script

```sql
-- Migration: Add lifecycle_state to conversations table
-- Date: 2025-01-21
-- Author: Nadia (Database Specialist)

BEGIN;

-- Add lifecycle_state column
ALTER TABLE conversations 
ADD COLUMN lifecycle_state text NOT NULL DEFAULT 'CREATED';

COMMENT ON COLUMN conversations.lifecycle_state IS 'Lifecycle state (CREATED, SENT, DELIVERED, READ, THREADED, WORKFLOW_LINKED, ARCHIVED)';

-- Add validation constraint
ALTER TABLE conversations
ADD CONSTRAINT check_lifecycle_state
CHECK (lifecycle_state IN ('CREATED', 'SENT', 'DELIVERED', 'READ', 'THREADED', 'WORKFLOW_LINKED', 'ARCHIVED'));

-- Add index for filtering
CREATE INDEX idx_conversations_lifecycle_state 
ON conversations (lifecycle_state);

-- Update existing conversations: Set lifecycle_state based on current state
-- CREATED: conversations with no messages or only draft messages
UPDATE conversations
SET lifecycle_state = 'CREATED'
WHERE id NOT IN (SELECT DISTINCT conversation_id FROM messages WHERE is_system_message = false);

-- SENT: conversations with sent messages but no read receipts
UPDATE conversations c
SET lifecycle_state = 'SENT'
WHERE EXISTS (
  SELECT 1 FROM messages m
  WHERE m.conversation_id = c.id
  AND m.is_system_message = false
)
AND NOT EXISTS (
  SELECT 1 FROM messages m
  JOIN message_read_receipts r ON r.message_id = m.id
  WHERE m.conversation_id = c.id
);

-- READ: conversations with read messages
UPDATE conversations c
SET lifecycle_state = 'READ'
WHERE EXISTS (
  SELECT 1 FROM messages m
  JOIN message_read_receipts r ON r.message_id = m.id
  WHERE m.conversation_id = c.id
);

-- THREADED: conversations with multiple messages
UPDATE conversations c
SET lifecycle_state = 'THREADED'
WHERE (
  SELECT COUNT(*) FROM messages m
  WHERE m.conversation_id = c.id
  AND m.is_system_message = false
) > 1;

-- WORKFLOW_LINKED: conversations linked to workflow entities
UPDATE conversations
SET lifecycle_state = 'WORKFLOW_LINKED'
WHERE workflow_entity_type IS NOT NULL AND workflow_entity_id IS NOT NULL;

-- ARCHIVED: conversations with archived_at set
UPDATE conversations
SET lifecycle_state = 'ARCHIVED'
WHERE archived_at IS NOT NULL;

COMMIT;
```

### Rollback Script

```sql
-- Rollback: Remove lifecycle_state from conversations table

BEGIN;

DROP INDEX IF EXISTS idx_conversations_lifecycle_state;
ALTER TABLE conversations DROP CONSTRAINT IF EXISTS check_lifecycle_state;
ALTER TABLE conversations DROP COLUMN IF EXISTS lifecycle_state;

COMMIT;
```

---

## Change 3: Messages Table - Delivered At

**Priority:** High (should be Critical for full functionality)  
**Wireframe:** `task-0.5.1.27-sent-messages.md`  
**Impact:** Message delivery status tracking (✓✓ format)

### Field to Add

#### 3.1: delivered_at
```sql
ALTER TABLE messages 
ADD COLUMN delivered_at timestamptz NULLABLE;

COMMENT ON COLUMN messages.delivered_at IS 'Delivery timestamp (when message delivered to recipient inbox, different from read_at)';
```

**Specifications:**
- **Type:** `timestamptz` (timestamp with timezone)
- **Nullable:** Yes (NULL means not yet delivered)
- **Default:** NULL
- **Purpose:** Track when message was delivered to recipient's inbox (not when read)
- **Status Flow:** `created_at` (sent) → `delivered_at` (delivered) → `read_at` (read, in message_read_receipts)
- **Display Format:** ✓✓ Delivered (when delivered_at is set, read_at is NULL)
- **RLS:** Users can see delivered_at for messages they sent or received

### Index

```sql
CREATE INDEX idx_messages_delivered_at 
ON messages (delivered_at) 
WHERE delivered_at IS NOT NULL;
```

**Index Specifications:**
- **Purpose:** Support queries for delivered but unread messages
- **Partial Index:** Only indexes non-NULL values (more efficient)
- **Query Pattern:** `WHERE delivered_at IS NOT NULL AND read_at IS NULL`

### Migration Script

```sql
-- Migration: Add delivered_at to messages table
-- Date: 2025-01-21
-- Author: Nadia (Database Specialist)

BEGIN;

-- Add delivered_at column
ALTER TABLE messages 
ADD COLUMN delivered_at timestamptz NULLABLE;

COMMENT ON COLUMN messages.delivered_at IS 'Delivery timestamp (when message delivered to recipient inbox, different from read_at)';

-- Add partial index for delivered messages
CREATE INDEX idx_messages_delivered_at 
ON messages (delivered_at) 
WHERE delivered_at IS NOT NULL;

-- Note: Existing messages will have NULL delivered_at (cannot retroactively determine delivery time)
-- New messages will have delivered_at set when delivered via message delivery service/webhook

COMMIT;
```

### Rollback Script

```sql
-- Rollback: Remove delivered_at from messages table

BEGIN;

DROP INDEX IF EXISTS idx_messages_delivered_at;
ALTER TABLE messages DROP COLUMN IF EXISTS delivered_at;

COMMIT;
```

---

## Change 4: Follow-ups Table (New Table)

**Priority:** Critical  
**Wireframe:** `task-0.5.1.19-moh-tier1-dashboard.md`  
**Impact:** Follow-up tracking for governance actions

### Table Creation

```sql
CREATE TABLE follow_ups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  assigned_to uuid NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  priority text NOT NULL DEFAULT 'normal',
  due_date date NOT NULL,
  issue_type text NOT NULL,
  issue_reference_id uuid NULLABLE,
  issue_reference_table text NULLABLE,
  notes text NULLABLE,
  status text NOT NULL DEFAULT 'pending',
  completed_at timestamptz NULLABLE,
  completed_by uuid NULLABLE REFERENCES users(id) ON DELETE SET NULL,
  created_by uuid NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
```

### Field Specifications

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PRIMARY KEY, DEFAULT gen_random_uuid() | Follow-up ID |
| company_id | uuid | NOT NULL, REFERENCES companies(id) | Company ID |
| assigned_to | uuid | NOT NULL, REFERENCES users(id) | Officer assigned to follow-up |
| priority | text | NOT NULL, DEFAULT 'normal' | Priority (normal, high, extreme) |
| due_date | date | NOT NULL | Due date for follow-up |
| issue_type | text | NOT NULL | Issue type (submission_overdue, compliance_violation, threshold_breach, enforcement_action, etc.) |
| issue_reference_id | uuid | NULLABLE | Reference to specific issue (submission_id, breach_id, etc.) |
| issue_reference_table | text | NULLABLE | Table name of issue reference (e.g., 'aams_submissions', 'breaches', 'enforcement_actions') |
| notes | text | NULLABLE | Follow-up notes |
| status | text | NOT NULL, DEFAULT 'pending' | Status (pending, in_progress, completed, cancelled) |
| completed_at | timestamptz | NULLABLE | Completion timestamp |
| completed_by | uuid | NULLABLE, REFERENCES users(id) | User who marked complete |
| created_by | uuid | NOT NULL, REFERENCES users(id) | User who created follow-up |
| created_at | timestamptz | DEFAULT now() | Creation timestamp |
| updated_at | timestamptz | DEFAULT now() | Last update timestamp |

### Constraints

```sql
-- Priority validation
ALTER TABLE follow_ups
ADD CONSTRAINT check_follow_ups_priority
CHECK (priority IN ('normal', 'high', 'extreme'));

-- Status validation
ALTER TABLE follow_ups
ADD CONSTRAINT check_follow_ups_status
CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled'));

-- Issue reference table validation (common tables)
ALTER TABLE follow_ups
ADD CONSTRAINT check_follow_ups_reference_table
CHECK (
  issue_reference_table IS NULL OR
  issue_reference_table IN (
    'aams_submissions', 'msq_submissions', 'wsl_submissions',
    'breaches', 'enforcement_actions', 'compliance_scores',
    'registry_submissions', 'export_requests', 'disputes'
  )
);

-- Completed validation (completed_at and completed_by must both be set or both be NULL)
ALTER TABLE follow_ups
ADD CONSTRAINT check_follow_ups_completed
CHECK (
  (completed_at IS NULL AND completed_by IS NULL) OR
  (completed_at IS NOT NULL AND completed_by IS NOT NULL)
);
```

### Indexes

```sql
-- Company lookups
CREATE INDEX idx_follow_ups_company_id ON follow_ups (company_id);

-- Assigned officer lookups
CREATE INDEX idx_follow_ups_assigned_to ON follow_ups (assigned_to);

-- Due date queries (overdue, upcoming, etc.)
CREATE INDEX idx_follow_ups_due_date ON follow_ups (due_date);

-- Status filtering
CREATE INDEX idx_follow_ups_status ON follow_ups (status);

-- Priority filtering
CREATE INDEX idx_follow_ups_priority ON follow_ups (priority);

-- Composite index for dashboard queries (active follow-ups by priority)
CREATE INDEX idx_follow_ups_active_priority ON follow_ups (status, priority, due_date)
WHERE status IN ('pending', 'in_progress');

-- Issue reference lookups (if querying by issue)
CREATE INDEX idx_follow_ups_issue_reference ON follow_ups (issue_reference_table, issue_reference_id)
WHERE issue_reference_id IS NOT NULL;
```

### Comments

```sql
COMMENT ON TABLE follow_ups IS 'Track follow-up assignments for governance actions';
COMMENT ON COLUMN follow_ups.issue_type IS 'Issue type: submission_overdue, compliance_violation, threshold_breach, enforcement_action, etc.';
COMMENT ON COLUMN follow_ups.issue_reference_id IS 'Reference to specific issue (submission_id, breach_id, enforcement_action_id, etc.)';
COMMENT ON COLUMN follow_ups.issue_reference_table IS 'Table name of issue reference for polymorphic relationship';
```

### Migration Script

```sql
-- Migration: Create follow_ups table
-- Date: 2025-01-21
-- Author: Nadia (Database Specialist)

BEGIN;

-- Create table
CREATE TABLE follow_ups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  assigned_to uuid NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  priority text NOT NULL DEFAULT 'normal',
  due_date date NOT NULL,
  issue_type text NOT NULL,
  issue_reference_id uuid NULLABLE,
  issue_reference_table text NULLABLE,
  notes text NULLABLE,
  status text NOT NULL DEFAULT 'pending',
  completed_at timestamptz NULLABLE,
  completed_by uuid NULLABLE REFERENCES users(id) ON DELETE SET NULL,
  created_by uuid NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Add constraints
ALTER TABLE follow_ups
ADD CONSTRAINT check_follow_ups_priority
CHECK (priority IN ('normal', 'high', 'extreme'));

ALTER TABLE follow_ups
ADD CONSTRAINT check_follow_ups_status
CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled'));

ALTER TABLE follow_ups
ADD CONSTRAINT check_follow_ups_reference_table
CHECK (
  issue_reference_table IS NULL OR
  issue_reference_table IN (
    'aams_submissions', 'msq_submissions', 'wsl_submissions',
    'breaches', 'enforcement_actions', 'compliance_scores',
    'registry_submissions', 'export_requests', 'disputes'
  )
);

ALTER TABLE follow_ups
ADD CONSTRAINT check_follow_ups_completed
CHECK (
  (completed_at IS NULL AND completed_by IS NULL) OR
  (completed_at IS NOT NULL AND completed_by IS NOT NULL)
);

-- Add indexes
CREATE INDEX idx_follow_ups_company_id ON follow_ups (company_id);
CREATE INDEX idx_follow_ups_assigned_to ON follow_ups (assigned_to);
CREATE INDEX idx_follow_ups_due_date ON follow_ups (due_date);
CREATE INDEX idx_follow_ups_status ON follow_ups (status);
CREATE INDEX idx_follow_ups_priority ON follow_ups (priority);
CREATE INDEX idx_follow_ups_active_priority ON follow_ups (status, priority, due_date)
WHERE status IN ('pending', 'in_progress');
CREATE INDEX idx_follow_ups_issue_reference ON follow_ups (issue_reference_table, issue_reference_id)
WHERE issue_reference_id IS NOT NULL;

-- Add comments
COMMENT ON TABLE follow_ups IS 'Track follow-up assignments for governance actions';
COMMENT ON COLUMN follow_ups.issue_type IS 'Issue type: submission_overdue, compliance_violation, threshold_breach, enforcement_action, etc.';
COMMENT ON COLUMN follow_ups.issue_reference_id IS 'Reference to specific issue (submission_id, breach_id, enforcement_action_id, etc.)';
COMMENT ON COLUMN follow_ups.issue_reference_table IS 'Table name of issue reference for polymorphic relationship';

-- Add updated_at trigger
CREATE TRIGGER set_follow_ups_updated_at
BEFORE UPDATE ON follow_ups
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

COMMIT;
```

### Rollback Script

```sql
-- Rollback: Drop follow_ups table

BEGIN;

DROP TABLE IF EXISTS follow_ups CASCADE;

COMMIT;
```

---

## Change 5: Meetings Table (New Table)

**Priority:** Critical  
**Wireframe:** `task-0.5.1.19-moh-tier1-dashboard.md`  
**Impact:** Meeting scheduling for governance

### Table Creation

```sql
CREATE TABLE meetings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  meeting_type text NOT NULL,
  scheduled_at timestamptz NOT NULL,
  location text NULLABLE,
  agenda text NULLABLE,
  reason text NULLABLE,
  related_reference_id uuid NULLABLE,
  related_reference_table text NULLABLE,
  status text NOT NULL DEFAULT 'scheduled',
  cancelled_at timestamptz NULLABLE,
  cancelled_by uuid NULLABLE REFERENCES users(id) ON DELETE SET NULL,
  created_by uuid NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
```

### Field Specifications

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PRIMARY KEY, DEFAULT gen_random_uuid() | Meeting ID |
| title | text | NOT NULL | Meeting title |
| meeting_type | text | NOT NULL | Meeting type (emergency, scheduled, follow_up) |
| scheduled_at | timestamptz | NOT NULL | Meeting date and time |
| location | text | NULLABLE | Meeting location (physical or virtual) |
| agenda | text | NULLABLE | Meeting agenda |
| reason | text | NULLABLE | Reason for meeting (e.g., "Submission Compliance Below Threshold") |
| related_reference_id | uuid | NULLABLE | Related entity ID (company_id, submission_id, etc.) |
| related_reference_table | text | NULLABLE | Related entity table (e.g., 'companies', 'aams_submissions', 'compliance_scores') |
| status | text | NOT NULL, DEFAULT 'scheduled' | Status (scheduled, cancelled, completed) |
| cancelled_at | timestamptz | NULLABLE | Cancellation timestamp |
| cancelled_by | uuid | NULLABLE, REFERENCES users(id) | User who cancelled |
| created_by | uuid | NOT NULL, REFERENCES users(id) | User who created meeting |
| created_at | timestamptz | DEFAULT now() | Creation timestamp |
| updated_at | timestamptz | DEFAULT now() | Last update timestamp |

### Constraints

```sql
-- Meeting type validation
ALTER TABLE meetings
ADD CONSTRAINT check_meetings_type
CHECK (meeting_type IN ('emergency', 'scheduled', 'follow_up'));

-- Status validation
ALTER TABLE meetings
ADD CONSTRAINT check_meetings_status
CHECK (status IN ('scheduled', 'cancelled', 'completed'));

-- Cancelled validation (cancelled_at and cancelled_by must both be set or both be NULL)
ALTER TABLE meetings
ADD CONSTRAINT check_meetings_cancelled
CHECK (
  (cancelled_at IS NULL AND cancelled_by IS NULL) OR
  (cancelled_at IS NOT NULL AND cancelled_by IS NOT NULL)
);

-- Related reference table validation
ALTER TABLE meetings
ADD CONSTRAINT check_meetings_reference_table
CHECK (
  related_reference_table IS NULL OR
  related_reference_table IN (
    'companies', 'aams_submissions', 'msq_submissions', 'wsl_submissions',
    'breaches', 'enforcement_actions', 'compliance_scores',
    'registry_submissions', 'export_requests', 'disputes', 'follow_ups'
  )
);
```

### Indexes

```sql
-- Scheduled date queries (upcoming meetings, past meetings)
CREATE INDEX idx_meetings_scheduled_at ON meetings (scheduled_at);

-- Status filtering
CREATE INDEX idx_meetings_status ON meetings (status);

-- Meeting type filtering
CREATE INDEX idx_meetings_meeting_type ON meetings (meeting_type);

-- Composite index for upcoming meetings query
CREATE INDEX idx_meetings_upcoming ON meetings (scheduled_at, status)
WHERE status = 'scheduled' AND scheduled_at >= now();

-- Related reference lookups
CREATE INDEX idx_meetings_related_reference ON meetings (related_reference_table, related_reference_id)
WHERE related_reference_id IS NOT NULL;
```

### Comments

```sql
COMMENT ON TABLE meetings IS 'Schedule and track governance meetings';
COMMENT ON COLUMN meetings.meeting_type IS 'Meeting type: emergency (urgent), scheduled (regular), follow_up (follow-up on issue)';
COMMENT ON COLUMN meetings.reason IS 'Reason for meeting (e.g., "Submission Compliance Below Threshold", "Emergency Breach Review")';
COMMENT ON COLUMN meetings.related_reference_id IS 'Related entity ID (company_id, submission_id, breach_id, etc.)';
COMMENT ON COLUMN meetings.related_reference_table IS 'Table name of related entity for polymorphic relationship';
```

### Migration Script

```sql
-- Migration: Create meetings table
-- Date: 2025-01-21
-- Author: Nadia (Database Specialist)

BEGIN;

-- Create table
CREATE TABLE meetings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  meeting_type text NOT NULL,
  scheduled_at timestamptz NOT NULL,
  location text NULLABLE,
  agenda text NULLABLE,
  reason text NULLABLE,
  related_reference_id uuid NULLABLE,
  related_reference_table text NULLABLE,
  status text NOT NULL DEFAULT 'scheduled',
  cancelled_at timestamptz NULLABLE,
  cancelled_by uuid NULLABLE REFERENCES users(id) ON DELETE SET NULL,
  created_by uuid NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Add constraints
ALTER TABLE meetings
ADD CONSTRAINT check_meetings_type
CHECK (meeting_type IN ('emergency', 'scheduled', 'follow_up'));

ALTER TABLE meetings
ADD CONSTRAINT check_meetings_status
CHECK (status IN ('scheduled', 'cancelled', 'completed'));

ALTER TABLE meetings
ADD CONSTRAINT check_meetings_cancelled
CHECK (
  (cancelled_at IS NULL AND cancelled_by IS NULL) OR
  (cancelled_at IS NOT NULL AND cancelled_by IS NOT NULL)
);

ALTER TABLE meetings
ADD CONSTRAINT check_meetings_reference_table
CHECK (
  related_reference_table IS NULL OR
  related_reference_table IN (
    'companies', 'aams_submissions', 'msq_submissions', 'wsl_submissions',
    'breaches', 'enforcement_actions', 'compliance_scores',
    'registry_submissions', 'export_requests', 'disputes', 'follow_ups'
  )
);

-- Add indexes
CREATE INDEX idx_meetings_scheduled_at ON meetings (scheduled_at);
CREATE INDEX idx_meetings_status ON meetings (status);
CREATE INDEX idx_meetings_meeting_type ON meetings (meeting_type);
CREATE INDEX idx_meetings_upcoming ON meetings (scheduled_at, status)
WHERE status = 'scheduled' AND scheduled_at >= now();
CREATE INDEX idx_meetings_related_reference ON meetings (related_reference_table, related_reference_id)
WHERE related_reference_id IS NOT NULL;

-- Add comments
COMMENT ON TABLE meetings IS 'Schedule and track governance meetings';
COMMENT ON COLUMN meetings.meeting_type IS 'Meeting type: emergency (urgent), scheduled (regular), follow_up (follow-up on issue)';
COMMENT ON COLUMN meetings.reason IS 'Reason for meeting (e.g., "Submission Compliance Below Threshold", "Emergency Breach Review")';
COMMENT ON COLUMN meetings.related_reference_id IS 'Related entity ID (company_id, submission_id, breach_id, etc.)';
COMMENT ON COLUMN meetings.related_reference_table IS 'Table name of related entity for polymorphic relationship';

-- Add updated_at trigger
CREATE TRIGGER set_meetings_updated_at
BEFORE UPDATE ON meetings
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

COMMIT;
```

### Rollback Script

```sql
-- Rollback: Drop meetings table

BEGIN;

DROP TABLE IF EXISTS meetings CASCADE;

COMMIT;
```

---

## Change 6: Meeting Attendees Table (New Table)

**Priority:** Critical  
**Wireframe:** `task-0.5.1.19-moh-tier1-dashboard.md`  
**Impact:** Meeting attendee tracking and calendar integration

### Table Creation

```sql
CREATE TABLE meeting_attendees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_id uuid NOT NULL REFERENCES meetings(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  attendance_status text NOT NULL DEFAULT 'invited',
  calendar_invite_sent boolean NOT NULL DEFAULT false,
  responded_at timestamptz NULLABLE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (meeting_id, user_id)
);
```

### Field Specifications

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PRIMARY KEY, DEFAULT gen_random_uuid() | Attendee ID |
| meeting_id | uuid | NOT NULL, REFERENCES meetings(id) | Meeting ID |
| user_id | uuid | NOT NULL, REFERENCES users(id) | Attendee user ID |
| attendance_status | text | NOT NULL, DEFAULT 'invited' | Status (invited, accepted, declined, attended) |
| calendar_invite_sent | boolean | NOT NULL, DEFAULT false | Calendar invite sent flag |
| responded_at | timestamptz | NULLABLE | Response timestamp |
| created_at | timestamptz | DEFAULT now() | Creation timestamp |

### Constraints

```sql
-- Attendance status validation
ALTER TABLE meeting_attendees
ADD CONSTRAINT check_meeting_attendees_status
CHECK (attendance_status IN ('invited', 'accepted', 'declined', 'attended'));

-- Unique constraint (one attendee record per meeting-user combination)
-- Already defined in table creation: UNIQUE (meeting_id, user_id)
```

### Indexes

```sql
-- Meeting lookups (all attendees for a meeting)
CREATE INDEX idx_meeting_attendees_meeting_id ON meeting_attendees (meeting_id);

-- User lookups (all meetings for a user)
CREATE INDEX idx_meeting_attendees_user_id ON meeting_attendees (user_id);

-- Attendance status filtering
CREATE INDEX idx_meeting_attendees_status ON meeting_attendees (attendance_status);

-- Pending invitations (invited but not responded)
CREATE INDEX idx_meeting_attendees_pending ON meeting_attendees (meeting_id, attendance_status)
WHERE attendance_status = 'invited' AND responded_at IS NULL;
```

### Comments

```sql
COMMENT ON TABLE meeting_attendees IS 'Track meeting attendees';
COMMENT ON COLUMN meeting_attendees.attendance_status IS 'Status: invited (default), accepted, declined, attended (marked after meeting)';
COMMENT ON COLUMN meeting_attendees.calendar_invite_sent IS 'Whether calendar invite (iCal) has been sent to attendee';
```

### Migration Script

```sql
-- Migration: Create meeting_attendees table
-- Date: 2025-01-21
-- Author: Nadia (Database Specialist)

BEGIN;

-- Create table
CREATE TABLE meeting_attendees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_id uuid NOT NULL REFERENCES meetings(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  attendance_status text NOT NULL DEFAULT 'invited',
  calendar_invite_sent boolean NOT NULL DEFAULT false,
  responded_at timestamptz NULLABLE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (meeting_id, user_id)
);

-- Add constraint
ALTER TABLE meeting_attendees
ADD CONSTRAINT check_meeting_attendees_status
CHECK (attendance_status IN ('invited', 'accepted', 'declined', 'attended'));

-- Add indexes
CREATE INDEX idx_meeting_attendees_meeting_id ON meeting_attendees (meeting_id);
CREATE INDEX idx_meeting_attendees_user_id ON meeting_attendees (user_id);
CREATE INDEX idx_meeting_attendees_status ON meeting_attendees (attendance_status);
CREATE INDEX idx_meeting_attendees_pending ON meeting_attendees (meeting_id, attendance_status)
WHERE attendance_status = 'invited' AND responded_at IS NULL;

-- Add comments
COMMENT ON TABLE meeting_attendees IS 'Track meeting attendees';
COMMENT ON COLUMN meeting_attendees.attendance_status IS 'Status: invited (default), accepted, declined, attended (marked after meeting)';
COMMENT ON COLUMN meeting_attendees.calendar_invite_sent IS 'Whether calendar invite (iCal) has been sent to attendee';

COMMIT;
```

### Rollback Script

```sql
-- Rollback: Drop meeting_attendees table

BEGIN;

DROP TABLE IF EXISTS meeting_attendees CASCADE;

COMMIT;
```

---

## Change 7 & 8: Compliance Scores - Previous Period & Score Change

**Priority:** High (Should be Critical for full functionality)  
**Wireframe:** `task-0.5.5.2-compliance-score-detail.md`, `task-0.5.5.3-leaderboard.md`  
**Impact:** Score trend calculation and leaderboard change indicators

### Fields to Add

#### 7.1: previous_period_score
```sql
ALTER TABLE compliance_scores 
ADD COLUMN previous_period_score numeric(5,2) NULLABLE;

COMMENT ON COLUMN compliance_scores.previous_period_score IS 'Previous period score (for change calculation, e.g., November score when December is current)';
```

**Specifications:**
- **Type:** `numeric(5,2)`
- **Nullable:** Yes (NULL for first period or if previous period doesn't exist)
- **Default:** NULL
- **Purpose:** Store previous period score for trend calculation
- **Calculation:** Set when calculating current period score (lookup previous period)
- **Display:** Used in "Trend: ↑ 2.3 (vs November)" format

#### 8.1: score_change
```sql
ALTER TABLE compliance_scores 
ADD COLUMN score_change numeric(5,2) NULLABLE;

COMMENT ON COLUMN compliance_scores.score_change IS 'Score change from previous period (calculated: current_score - previous_period_score)';
```

**Specifications:**
- **Type:** `numeric(5,2)`
- **Nullable:** Yes (NULL if no previous period)
- **Default:** NULL
- **Purpose:** Store calculated score change for quick display
- **Calculation:** `score_change = total_score - previous_period_score` (can be calculated or stored)
- **Display:** Used in leaderboard "Change" column (↑ 5.0, ↓ 2.1)
- **Note:** Can be calculated on-the-fly or stored (storing is more efficient for leaderboard queries)

### Indexes

No additional indexes needed (existing indexes on `company_id` and `score_period` are sufficient).

### Migration Script

```sql
-- Migration: Add previous_period_score and score_change to compliance_scores table
-- Date: 2025-01-21
-- Author: Nadia (Database Specialist)

BEGIN;

-- Add previous_period_score column
ALTER TABLE compliance_scores 
ADD COLUMN previous_period_score numeric(5,2) NULLABLE;

COMMENT ON COLUMN compliance_scores.previous_period_score IS 'Previous period score (for change calculation, e.g., November score when December is current)';

-- Add score_change column
ALTER TABLE compliance_scores 
ADD COLUMN score_change numeric(5,2) NULLABLE;

COMMENT ON COLUMN compliance_scores.score_change IS 'Score change from previous period (calculated: current_score - previous_period_score)';

-- Add validation constraint (score_change should match calculation)
-- Note: This is optional but recommended for data integrity
ALTER TABLE compliance_scores
ADD CONSTRAINT check_score_change_consistency
CHECK (
  (previous_period_score IS NULL AND score_change IS NULL) OR
  (previous_period_score IS NOT NULL AND score_change = total_score - previous_period_score)
);

-- Update existing scores: Calculate previous_period_score and score_change
-- This requires looking up previous period for each company
-- Note: This is a complex update that may take time for large datasets
-- Consider running this during off-peak hours or in batches

WITH previous_scores AS (
  SELECT 
    cs.id,
    cs.company_id,
    cs.score_period,
    cs.total_score,
    LAG(cs.total_score) OVER (
      PARTITION BY cs.company_id 
      ORDER BY cs.score_period
    ) AS prev_score,
    LAG(cs.score_period) OVER (
      PARTITION BY cs.company_id 
      ORDER BY cs.score_period
    ) AS prev_period
  FROM compliance_scores cs
)
UPDATE compliance_scores cs
SET 
  previous_period_score = ps.prev_score,
  score_change = cs.total_score - ps.prev_score
FROM previous_scores ps
WHERE cs.id = ps.id
AND ps.prev_score IS NOT NULL;

COMMIT;
```

### Rollback Script

```sql
-- Rollback: Remove previous_period_score and score_change from compliance_scores table

BEGIN;

ALTER TABLE compliance_scores DROP CONSTRAINT IF EXISTS check_score_change_consistency;
ALTER TABLE compliance_scores DROP COLUMN IF EXISTS score_change;
ALTER TABLE compliance_scores DROP COLUMN IF EXISTS previous_period_score;

COMMIT;
```

---

## Implementation Order

### Recommended Implementation Sequence

1. **Users Table Updates** (Change 1)
   - Low risk, additive changes
   - No dependencies

2. **Conversations Lifecycle State** (Change 2)
   - Medium risk, requires data migration for existing conversations
   - No dependencies

3. **Messages Delivered At** (Change 3)
   - Low risk, additive change
   - No dependencies

4. **Follow-ups Table** (Change 4)
   - Low risk, new table
   - Depends on: `companies`, `users` (both exist)

5. **Meetings Table** (Change 5)
   - Low risk, new table
   - Depends on: `users` (exists)

6. **Meeting Attendees Table** (Change 6)
   - Low risk, new table
   - Depends on: `meetings` (Change 5), `users` (exists)
   - Must be created after `meetings` table

7. **Compliance Scores Updates** (Changes 7 & 8)
   - Medium risk, requires data migration for existing scores
   - Depends on: `compliance_scores` (exists)

### Implementation Notes

- All migrations are designed to be non-breaking (additive changes only)
- Existing data will be preserved
- Default values ensure backward compatibility
- Rollback scripts provided for all changes
- Data migration scripts included where needed (conversations lifecycle_state, compliance_scores)

### Testing Checklist

After each migration:

- [ ] Verify schema changes applied correctly
- [ ] Verify existing data still accessible
- [ ] Verify new fields/tables functional
- [ ] Verify indexes created and functional
- [ ] Verify constraints working correctly
- [ ] Test rollback script in development environment
- [ ] Verify RLS policies still work (if applicable)

---

## RLS Policy Updates Required

### New Tables Requiring RLS Policies

1. **follow_ups**
   - Company users: Can see follow-ups for their company
   - Assigned officers: Can see follow-ups assigned to them
   - MOH users: Can see all follow-ups

2. **meetings**
   - Meeting creator: Full access to their meetings
   - Meeting attendees: Can see meetings they're invited to
   - MOH users: Can see all meetings

3. **meeting_attendees**
   - Inherits access from `meetings` table (via meeting_id)
   - Users: Can see their own attendance records

### Updated Tables Requiring RLS Review

1. **users** (new fields)
   - `avatar_url`: Users can update their own, MOH admins can update any
   - `timezone`, `language`, `notification_preferences`: Users can update their own

2. **conversations** (lifecycle_state)
   - Existing RLS policies should handle lifecycle_state (no changes needed)

3. **messages** (delivered_at)
   - Existing RLS policies should handle delivered_at (no changes needed)

4. **compliance_scores** (previous_period_score, score_change)
   - Existing RLS policies should handle new fields (no changes needed)

**Note:** Detailed RLS policies should be defined in separate RLS policy framework document by Rafi (RLS/RBAC Specialist).

---

## Related Documents

- [Schema Design](../schema-design.md) - Main schema document (to be updated)
- [Entity Relationship Diagram](../erd.md) - ERD (to be updated with new relationships)
- [Data Dictionary](../data-dictionary.md) - Field definitions (to be updated)
- [RLS Policy Framework](../../security/rls-policy-framework.md) - RLS policies (to be updated)
- [Migration Strategy](../migration-strategy.md) - Migration approach
- [Phase 0.6 Gap Analysis](../../../05-project-management/phases/phase-0-6-gap-analysis.md) - Original gap identification

---

**Last Updated:** 2025-01-21  
**Next Steps:** 
1. Review and approve specifications
2. Implement migrations in development environment
3. Test thoroughly
4. Update schema-design.md, erd.md, data-dictionary.md
5. Create RLS policies for new tables
6. Deploy to staging/production

