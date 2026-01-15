-- Migration: create_communication_tables
-- Description: Create communication tables (conversations, messages, message_attachments, message_read_receipts, conversation_participants)
-- Date: 2025-01-12
-- Author: Nadia
-- Phase: 1.1.1
-- Task: 1.1.1.2d
-- Related: schema-design.md, schema-updates-phase0-6-critical-gaps.md (Changes 2, 3)
-- Depends on: 20250112120000_create_core_tables (users table)

BEGIN;

-- Create conversations table
-- Note: company_id is nullable (NULL for internal MOH conversations)
-- Note: companies table will be created in RMM module migrations
CREATE TABLE IF NOT EXISTS conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL,
  subject text NOT NULL,
  company_id uuid, -- REFERENCES companies(id) - will be added when companies table exists
  workflow_entity_type text,
  workflow_entity_id uuid,
  lifecycle_state text NOT NULL DEFAULT 'CREATED' CHECK (lifecycle_state IN ('CREATED', 'SENT', 'DELIVERED', 'READ', 'THREADED', 'WORKFLOW_LINKED', 'ARCHIVED')),
  created_by uuid REFERENCES users(id) NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  archived_at timestamptz,
  is_announcement boolean DEFAULT false,
  announcement_expires_at timestamptz
);

COMMENT ON TABLE conversations IS 'Thread management for conversations';
COMMENT ON COLUMN conversations.type IS 'Conversation type (direct_message, workflow_related, announcement, internal_moh)';
COMMENT ON COLUMN conversations.lifecycle_state IS 'Lifecycle state (CREATED, SENT, DELIVERED, READ, THREADED, WORKFLOW_LINKED, ARCHIVED)';
COMMENT ON COLUMN conversations.company_id IS 'Company ID (NULL for internal MOH conversations)';

-- Create indexes for conversations table
CREATE INDEX IF NOT EXISTS idx_conversations_company_id ON conversations(company_id);
CREATE INDEX IF NOT EXISTS idx_conversations_workflow_entity ON conversations(workflow_entity_type, workflow_entity_id);
CREATE INDEX IF NOT EXISTS idx_conversations_created_by ON conversations(created_by);
CREATE INDEX IF NOT EXISTS idx_conversations_created_at ON conversations(created_at);
CREATE INDEX IF NOT EXISTS idx_conversations_type ON conversations(type);
CREATE INDEX IF NOT EXISTS idx_conversations_lifecycle_state ON conversations(lifecycle_state);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid REFERENCES conversations(id) ON DELETE CASCADE NOT NULL,
  sender_id uuid REFERENCES users(id) NOT NULL,
  recipient_id uuid REFERENCES users(id),
  content text NOT NULL,
  is_system_message boolean DEFAULT false,
  delivered_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  edited_at timestamptz,
  deleted_at timestamptz
);

COMMENT ON TABLE messages IS 'Individual messages within conversations';
COMMENT ON COLUMN messages.delivered_at IS 'Delivery timestamp (when message delivered to recipient inbox, different from read_at)';
COMMENT ON COLUMN messages.is_system_message IS 'True for automated system messages';

-- Create indexes for messages table
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_recipient_id ON messages(recipient_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);
CREATE INDEX IF NOT EXISTS idx_messages_delivered_at ON messages(delivered_at) WHERE delivered_at IS NOT NULL;

-- Create message_attachments table
CREATE TABLE IF NOT EXISTS message_attachments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id uuid REFERENCES messages(id) ON DELETE CASCADE NOT NULL,
  file_name text NOT NULL,
  file_path text NOT NULL,
  file_size bigint NOT NULL,
  mime_type text NOT NULL,
  uploaded_by uuid REFERENCES users(id) NOT NULL,
  created_at timestamptz DEFAULT now()
);

COMMENT ON TABLE message_attachments IS 'File attachments for messages';
COMMENT ON COLUMN message_attachments.file_path IS 'Storage path (Supabase Storage: communications/attachments/{message_id}/{file_name})';

-- Create indexes for message_attachments table
CREATE INDEX IF NOT EXISTS idx_message_attachments_message_id ON message_attachments(message_id);
CREATE INDEX IF NOT EXISTS idx_message_attachments_uploaded_by ON message_attachments(uploaded_by);

-- Create message_read_receipts table
CREATE TABLE IF NOT EXISTS message_read_receipts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id uuid REFERENCES messages(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  read_at timestamptz DEFAULT now(),
  UNIQUE (message_id, user_id)
);

COMMENT ON TABLE message_read_receipts IS 'Track message read status';

-- Create indexes for message_read_receipts table
CREATE INDEX IF NOT EXISTS idx_message_read_receipts_message_id ON message_read_receipts(message_id);
CREATE INDEX IF NOT EXISTS idx_message_read_receipts_user_id ON message_read_receipts(user_id);
CREATE INDEX IF NOT EXISTS idx_message_read_receipts_read_at ON message_read_receipts(read_at);

-- Create conversation_participants table
CREATE TABLE IF NOT EXISTS conversation_participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid REFERENCES conversations(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  role text NOT NULL,
  joined_at timestamptz DEFAULT now(),
  left_at timestamptz,
  UNIQUE (conversation_id, user_id)
);

COMMENT ON TABLE conversation_participants IS 'Track conversation participants (for multi-party conversations)';
COMMENT ON COLUMN conversation_participants.role IS 'Participant role (sender, recipient, cc, bcc)';

-- Create indexes for conversation_participants table
CREATE INDEX IF NOT EXISTS idx_conversation_participants_conversation_id ON conversation_participants(conversation_id);
CREATE INDEX IF NOT EXISTS idx_conversation_participants_user_id ON conversation_participants(user_id);

-- Create triggers for updated_at
CREATE TRIGGER set_conversations_updated_at
BEFORE UPDATE ON conversations
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_messages_updated_at
BEFORE UPDATE ON messages
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

COMMIT;

-- Rollback Migration
-- BEGIN;
-- 
-- DROP TRIGGER IF EXISTS set_messages_updated_at ON messages;
-- DROP TRIGGER IF EXISTS set_conversations_updated_at ON conversations;
-- 
-- DROP INDEX IF EXISTS idx_conversation_participants_user_id;
-- DROP INDEX IF EXISTS idx_conversation_participants_conversation_id;
-- DROP TABLE IF EXISTS conversation_participants;
-- 
-- DROP INDEX IF EXISTS idx_message_read_receipts_read_at;
-- DROP INDEX IF EXISTS idx_message_read_receipts_user_id;
-- DROP INDEX IF EXISTS idx_message_read_receipts_message_id;
-- DROP TABLE IF EXISTS message_read_receipts;
-- 
-- DROP INDEX IF EXISTS idx_message_attachments_uploaded_by;
-- DROP INDEX IF EXISTS idx_message_attachments_message_id;
-- DROP TABLE IF EXISTS message_attachments;
-- 
-- DROP INDEX IF EXISTS idx_messages_delivered_at;
-- DROP INDEX IF EXISTS idx_messages_created_at;
-- DROP INDEX IF EXISTS idx_messages_recipient_id;
-- DROP INDEX IF EXISTS idx_messages_sender_id;
-- DROP INDEX IF EXISTS idx_messages_conversation_id;
-- DROP TABLE IF EXISTS messages;
-- 
-- DROP INDEX IF EXISTS idx_conversations_lifecycle_state;
-- DROP INDEX IF EXISTS idx_conversations_type;
-- DROP INDEX IF EXISTS idx_conversations_created_at;
-- DROP INDEX IF EXISTS idx_conversations_created_by;
-- DROP INDEX IF EXISTS idx_conversations_workflow_entity;
-- DROP INDEX IF EXISTS idx_conversations_company_id;
-- DROP TABLE IF EXISTS conversations;
-- 
-- COMMIT;
