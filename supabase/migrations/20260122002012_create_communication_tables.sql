-- Migration: create_communication_tables
-- Description: Create communications tables (conversations, messages, message_attachments, message_read_receipts)
-- Date: 2026-01-22
-- Task: 1.1.1.2a
-- Author: Sami (Implementation Compliance Specialist)
-- Dependencies: Task 1.1.1.2 (users table must exist)

BEGIN;

-- ============================================================================
-- conversations table
-- Purpose: Thread management for conversations
-- Phase 0.6 additions: lifecycle_state
-- ============================================================================

CREATE TABLE IF NOT EXISTS conversations (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    type text NOT NULL CHECK (type IN ('direct_message', 'workflow_related', 'announcement', 'internal_moh')),
    subject text NOT NULL,
    company_id uuid, -- NULL for internal MOH conversations, references companies.id (will be added when companies table exists)
    workflow_entity_type text, -- registry_submission, aams_submission, export_request, breach, etc.
    workflow_entity_id uuid, -- Links to specific submission/approval/breach
    lifecycle_state text NOT NULL DEFAULT 'CREATED' CHECK (lifecycle_state IN ('CREATED', 'SENT', 'DELIVERED', 'READ', 'THREADED', 'WORKFLOW_LINKED', 'ARCHIVED')), -- Phase 0.6: Lifecycle state tracking
    created_by uuid NOT NULL REFERENCES users(id),
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    archived_at timestamptz, -- Soft delete timestamp
    is_announcement boolean NOT NULL DEFAULT false,
    announcement_expires_at timestamptz -- Expiration date for announcements
);

-- Indexes for conversations table
CREATE INDEX IF NOT EXISTS idx_conversations_company_id ON conversations(company_id);
CREATE INDEX IF NOT EXISTS idx_conversations_workflow_entity ON conversations(workflow_entity_type, workflow_entity_id);
CREATE INDEX IF NOT EXISTS idx_conversations_created_by ON conversations(created_by);
CREATE INDEX IF NOT EXISTS idx_conversations_created_at ON conversations(created_at);
CREATE INDEX IF NOT EXISTS idx_conversations_type ON conversations(type);
CREATE INDEX IF NOT EXISTS idx_conversations_lifecycle_state ON conversations(lifecycle_state);

-- Trigger to update updated_at timestamp
CREATE TRIGGER update_conversations_updated_at
    BEFORE UPDATE ON conversations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- messages table
-- Purpose: Individual messages within conversations
-- Phase 0.6 additions: delivered_at
-- ============================================================================

CREATE TABLE IF NOT EXISTS messages (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id uuid NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    sender_id uuid NOT NULL REFERENCES users(id),
    recipient_id uuid REFERENCES users(id), -- NULL for announcements
    content text NOT NULL,
    is_system_message boolean NOT NULL DEFAULT false,
    delivered_at timestamptz, -- Phase 0.6: Delivery timestamp (when message delivered to recipient inbox)
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    edited_at timestamptz, -- Edit timestamp (if message was edited)
    deleted_at timestamptz -- Soft delete timestamp (immutable - no hard deletes)
);

-- Indexes for messages table
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_recipient_id ON messages(recipient_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);
CREATE INDEX IF NOT EXISTS idx_messages_delivered_at ON messages(delivered_at) WHERE delivered_at IS NOT NULL;

-- Trigger to update updated_at timestamp
CREATE TRIGGER update_messages_updated_at
    BEFORE UPDATE ON messages
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- message_attachments table
-- Purpose: File attachments for messages
-- ============================================================================

CREATE TABLE IF NOT EXISTS message_attachments (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    message_id uuid NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
    file_name text NOT NULL,
    file_path text NOT NULL, -- Storage path (Supabase Storage)
    file_size bigint NOT NULL,
    mime_type text NOT NULL,
    uploaded_by uuid NOT NULL REFERENCES users(id),
    created_at timestamptz NOT NULL DEFAULT now()
);

-- Indexes for message_attachments table
CREATE INDEX IF NOT EXISTS idx_message_attachments_message_id ON message_attachments(message_id);
CREATE INDEX IF NOT EXISTS idx_message_attachments_uploaded_by ON message_attachments(uploaded_by);

-- ============================================================================
-- message_read_receipts table
-- Purpose: Track message read status
-- ============================================================================

CREATE TABLE IF NOT EXISTS message_read_receipts (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    message_id uuid NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
    user_id uuid NOT NULL REFERENCES users(id),
    read_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE(message_id, user_id) -- One read receipt per message per user
);

-- Indexes for message_read_receipts table
CREATE INDEX IF NOT EXISTS idx_message_read_receipts_message_id ON message_read_receipts(message_id);
CREATE INDEX IF NOT EXISTS idx_message_read_receipts_user_id ON message_read_receipts(user_id);
CREATE INDEX IF NOT EXISTS idx_message_read_receipts_read_at ON message_read_receipts(read_at);

COMMIT;
