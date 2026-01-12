# Phase 0.6 Database Schema - Migration Script Templates

**Purpose:** Reusable templates for database migration scripts

**Created:** 2025-01-21  
**Last Updated:** 2025-01-21  
**Owner:** Nadia (Database Specialist)

---

## Template Structure

All migration scripts should follow this structure:

```sql
-- Migration: [Brief Description]
-- Date: YYYY-MM-DD
-- Author: [Name]
-- Priority: Critical / High / Medium / Low
-- Related Gap: [Gap ID from consolidated-gaps.md]

BEGIN;

-- Migration code here

COMMIT;
```

---

## Template 1: Adding New Fields to Existing Table

### Simple Field Addition

```sql
-- Migration: Add [field_name] to [table_name]
-- Date: YYYY-MM-DD
-- Author: [Name]

BEGIN;

-- Add column
ALTER TABLE [table_name] 
ADD COLUMN [field_name] [data_type] [constraints];

-- Add comment
COMMENT ON COLUMN [table_name].[field_name] IS '[Description]';

-- Add index (if needed)
CREATE INDEX idx_[table_name]_[field_name] 
ON [table_name] ([field_name]);

-- For JSONB fields, consider GIN index:
-- CREATE INDEX idx_[table_name]_[field_name] 
-- ON [table_name] USING GIN ([field_name]);

-- For partial indexes (only index non-NULL values):
-- CREATE INDEX idx_[table_name]_[field_name] 
-- ON [table_name] ([field_name]) 
-- WHERE [field_name] IS NOT NULL;

COMMIT;
```

### Example: Adding users.avatar_url

```sql
-- Migration: Add avatar_url to users table
-- Date: 2025-01-21
-- Author: Nadia (Database Specialist)
-- Priority: Critical

BEGIN;

ALTER TABLE users 
ADD COLUMN avatar_url text NULLABLE;

COMMENT ON COLUMN users.avatar_url IS 'Avatar image URL (Supabase Storage path)';

COMMIT;
```

### Example: Adding Field with Default Value

```sql
-- Migration: Add timezone to users table
-- Date: 2025-01-21
-- Author: Nadia (Database Specialist)
-- Priority: Critical

BEGIN;

ALTER TABLE users 
ADD COLUMN timezone text NOT NULL DEFAULT 'UTC+01:00';

COMMENT ON COLUMN users.timezone IS 'User timezone preference (default: UTC+01:00 for Morocco)';

COMMIT;
```

### Example: Adding Field with Constraint and Index

```sql
-- Migration: Add lifecycle_state to conversations table
-- Date: 2025-01-21
-- Author: Nadia (Database Specialist)
-- Priority: Critical

BEGIN;

-- Add column
ALTER TABLE conversations 
ADD COLUMN lifecycle_state text NOT NULL DEFAULT 'CREATED';

COMMENT ON COLUMN conversations.lifecycle_state IS 'Lifecycle state (CREATED, SENT, DELIVERED, READ, THREADED, WORKFLOW_LINKED, ARCHIVED)';

-- Add constraint
ALTER TABLE conversations
ADD CONSTRAINT check_lifecycle_state
CHECK (lifecycle_state IN ('CREATED', 'SENT', 'DELIVERED', 'READ', 'THREADED', 'WORKFLOW_LINKED', 'ARCHIVED'));

-- Add index
CREATE INDEX idx_conversations_lifecycle_state 
ON conversations (lifecycle_state);

COMMIT;
```

---

## Template 2: Creating New Tables

### Basic Table Creation Template

```sql
-- Migration: Create [table_name] table
-- Date: YYYY-MM-DD
-- Author: [Name]
-- Priority: Critical / High / Medium / Low

BEGIN;

-- Create table
CREATE TABLE [table_name] (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Add fields here
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Add comments
COMMENT ON TABLE [table_name] IS '[Table description]';
COMMENT ON COLUMN [table_name].[field_name] IS '[Field description]';

-- Add foreign keys
ALTER TABLE [table_name]
ADD CONSTRAINT fk_[table_name]_[referenced_table]
FOREIGN KEY ([foreign_key_field]) 
REFERENCES [referenced_table](id)
ON DELETE [CASCADE|RESTRICT|SET NULL];

-- Add constraints
ALTER TABLE [table_name]
ADD CONSTRAINT check_[table_name]_[field_name]
CHECK ([validation_condition]);

-- Add indexes
CREATE INDEX idx_[table_name]_[field_name] 
ON [table_name] ([field_name]);

-- Composite indexes
CREATE INDEX idx_[table_name]_[field1]_[field2] 
ON [table_name] ([field1], [field2]);

-- Partial indexes
CREATE INDEX idx_[table_name]_[condition] 
ON [table_name] ([field_name]) 
WHERE [condition];

-- Add updated_at trigger
CREATE TRIGGER set_[table_name]_updated_at
BEFORE UPDATE ON [table_name]
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

COMMIT;
```

### Example: Creating follow_ups Table

```sql
-- Migration: Create follow_ups table
-- Date: 2025-01-21
-- Author: Nadia (Database Specialist)
-- Priority: Critical

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

-- Add comments
COMMENT ON TABLE follow_ups IS 'Track follow-up assignments for governance actions';
COMMENT ON COLUMN follow_ups.priority IS 'Priority (normal, high, extreme)';
COMMENT ON COLUMN follow_ups.issue_type IS 'Issue type: submission_overdue, compliance_violation, threshold_breach, enforcement_action, etc.';

-- Add constraints
ALTER TABLE follow_ups
ADD CONSTRAINT check_follow_ups_priority
CHECK (priority IN ('normal', 'high', 'extreme'));

ALTER TABLE follow_ups
ADD CONSTRAINT check_follow_ups_status
CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled'));

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

-- Composite index
CREATE INDEX idx_follow_ups_active_priority ON follow_ups (status, priority, due_date)
WHERE status IN ('pending', 'in_progress');

-- Partial index
CREATE INDEX idx_follow_ups_issue_reference ON follow_ups (issue_reference_table, issue_reference_id)
WHERE issue_reference_id IS NOT NULL;

-- Add updated_at trigger
CREATE TRIGGER set_follow_ups_updated_at
BEFORE UPDATE ON follow_ups
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

COMMIT;
```

---

## Template 3: Adding Indexes to Existing Tables

### Simple Index

```sql
-- Migration: Add index on [table_name].[field_name]
-- Date: YYYY-MM-DD
-- Author: [Name]

BEGIN;

CREATE INDEX idx_[table_name]_[field_name] 
ON [table_name] ([field_name]);

COMMIT;
```

### Composite Index

```sql
-- Migration: Add composite index on [table_name]
-- Date: YYYY-MM-DD
-- Author: [Name]

BEGIN;

CREATE INDEX idx_[table_name]_[field1]_[field2] 
ON [table_name] ([field1], [field2]);

COMMIT;
```

### Partial Index

```sql
-- Migration: Add partial index on [table_name].[field_name]
-- Date: YYYY-MM-DD
-- Author: [Name]

BEGIN;

CREATE INDEX idx_[table_name]_[field_name] 
ON [table_name] ([field_name]) 
WHERE [field_name] IS NOT NULL;

COMMIT;
```

### GIN Index (for JSONB fields)

```sql
-- Migration: Add GIN index on [table_name].[jsonb_field]
-- Date: YYYY-MM-DD
-- Author: [Name]

BEGIN;

CREATE INDEX idx_[table_name]_[jsonb_field] 
ON [table_name] USING GIN ([jsonb_field]);

COMMIT;
```

### Example: Adding Partial Index for Messages

```sql
-- Migration: Add partial index on messages.delivered_at
-- Date: 2025-01-21
-- Author: Nadia (Database Specialist)
-- Priority: High

BEGIN;

CREATE INDEX idx_messages_delivered_at 
ON messages (delivered_at) 
WHERE delivered_at IS NOT NULL;

COMMIT;
```

---

## Template 4: Data Migrations

### Updating Existing Data

```sql
-- Migration: Update existing data in [table_name]
-- Date: YYYY-MM-DD
-- Author: [Name]

BEGIN;

-- Update existing records
UPDATE [table_name]
SET [field_name] = [value]
WHERE [condition];

-- Verify update count (optional)
-- SELECT COUNT(*) FROM [table_name] WHERE [condition];

COMMIT;
```

### Example: Setting Lifecycle States for Existing Conversations

```sql
-- Migration: Set lifecycle_state for existing conversations
-- Date: 2025-01-21
-- Author: Nadia (Database Specialist)
-- Priority: Critical

BEGIN;

-- Set CREATED state for conversations with no sent messages
UPDATE conversations
SET lifecycle_state = 'CREATED'
WHERE id NOT IN (
  SELECT DISTINCT conversation_id 
  FROM messages 
  WHERE is_system_message = false
);

-- Set SENT state for conversations with sent messages but no read receipts
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

-- Set READ state for conversations with read messages
UPDATE conversations c
SET lifecycle_state = 'READ'
WHERE EXISTS (
  SELECT 1 FROM messages m
  JOIN message_read_receipts r ON r.message_id = m.id
  WHERE m.conversation_id = c.id
);

COMMIT;
```

---

## Template 5: Rollback Scripts

### Rollback: Drop Column

```sql
-- Rollback: Remove [field_name] from [table_name]

BEGIN;

DROP INDEX IF EXISTS idx_[table_name]_[field_name];
ALTER TABLE [table_name] DROP COLUMN IF EXISTS [field_name];

COMMIT;
```

### Rollback: Drop Table

```sql
-- Rollback: Drop [table_name] table

BEGIN;

DROP TABLE IF EXISTS [table_name] CASCADE;

COMMIT;
```

### Rollback: Drop Index

```sql
-- Rollback: Remove index from [table_name]

BEGIN;

DROP INDEX IF EXISTS idx_[table_name]_[field_name];

COMMIT;
```

### Example: Rollback for users Table Fields

```sql
-- Rollback: Remove profile preferences from users table

BEGIN;

DROP INDEX IF EXISTS idx_users_notification_preferences;
DROP INDEX IF EXISTS idx_users_timezone;

ALTER TABLE users DROP COLUMN IF EXISTS notification_preferences;
ALTER TABLE users DROP COLUMN IF EXISTS language;
ALTER TABLE users DROP COLUMN IF EXISTS timezone;
ALTER TABLE users DROP COLUMN IF EXISTS avatar_url;

COMMIT;
```

---

## Best Practices

### 1. Always Use Transactions

```sql
BEGIN;
-- Migration code
COMMIT;
```

### 2. Add Comments

```sql
COMMENT ON TABLE [table_name] IS '[Description]';
COMMENT ON COLUMN [table_name].[field_name] IS '[Description]';
```

### 3. Test Rollback Scripts

Always test rollback scripts in staging before executing in production.

### 4. Use IF EXISTS for Safety

```sql
DROP INDEX IF EXISTS idx_[table_name]_[field_name];
ALTER TABLE [table_name] DROP COLUMN IF EXISTS [field_name];
```

### 5. Document Dependencies

```sql
-- Migration: Create [table_name] table
-- Dependencies: [list of tables that must exist]
-- Depends on: [previous migrations]
```

### 6. Verify Index Creation

After creating indexes, verify they were created:

```sql
SELECT indexname, indexdef 
FROM pg_indexes 
WHERE tablename = '[table_name]';
```

### 7. Use Appropriate ON DELETE Actions

- `ON DELETE RESTRICT` - Prevent deletion (default, safest)
- `ON DELETE CASCADE` - Delete related records
- `ON DELETE SET NULL` - Set foreign key to NULL

---

## Common Patterns

### Pattern 1: Polymorphic Relationships

For tables with polymorphic relationships (like `follow_ups.issue_reference_table` and `issue_reference_id`):

```sql
-- Add constraint to validate reference table names
ALTER TABLE [table_name]
ADD CONSTRAINT check_[table_name]_reference_table
CHECK (
  [reference_table_field] IS NULL OR
  [reference_table_field] IN ('table1', 'table2', 'table3', ...)
);
```

### Pattern 2: Paired Fields (Both NULL or Both NOT NULL)

```sql
ALTER TABLE [table_name]
ADD CONSTRAINT check_[table_name]_paired_fields
CHECK (
  ([field1] IS NULL AND [field2] IS NULL) OR
  ([field1] IS NOT NULL AND [field2] IS NOT NULL)
);
```

### Pattern 3: UNIQUE Constraint

```sql
ALTER TABLE [table_name]
ADD CONSTRAINT unique_[table_name]_[fields]
UNIQUE ([field1], [field2]);
```

---

## Related Documents

- [Schema Updates - Critical Gaps](schema-updates-phase0-6-critical-gaps.md) - Complete migration scripts for critical gaps
- [Implementation Priorities](phase-0-6-implementation-priorities.md) - Prioritized implementation guide
- [Change Log](phase-0-6-schema-change-log.md) - Version history

---

**Templates Maintained By:** Nadia (Database Specialist)  
**Last Updated:** 2025-01-21
