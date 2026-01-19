-- Migration: Create communication tables (conversations, messages, message_attachments, message_read_receipts, conversation_participants)
-- Date: 2026-01-17
-- Task: 1.1.1.2d
-- Author: Sami (Implementation Compliance Specialist)
-- Phase 0.6 Updates: conversations.lifecycle_state, messages.delivered_at

BEGIN;

-- Create conversations table
-- Note: company_id foreign key will be added in Task 1.1.1.7 when companies table is created
CREATE TABLE IF NOT EXISTS public.conversations (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    type text NOT NULL CHECK (type IN ('direct_message', 'workflow_related', 'announcement', 'internal_moh')),
    subject text NOT NULL,
    company_id uuid, -- FK to companies.id will be added later
    workflow_entity_type text,
    workflow_entity_id uuid,
    lifecycle_state text NOT NULL DEFAULT 'CREATED' CHECK (lifecycle_state IN ('CREATED', 'SENT', 'DELIVERED', 'READ', 'THREADED', 'WORKFLOW_LINKED', 'ARCHIVED')),
    created_by uuid REFERENCES public.users(id) ON DELETE RESTRICT NOT NULL,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    archived_at timestamptz,
    is_announcement boolean DEFAULT false,
    announcement_expires_at timestamptz
);

COMMENT ON TABLE public.conversations IS 'Thread management for conversations';
COMMENT ON COLUMN public.conversations.type IS 'Conversation type: direct_message, workflow_related, announcement, internal_moh';
COMMENT ON COLUMN public.conversations.company_id IS 'Company ID (NULL for internal MOH conversations) - FK will be added when companies table is created';
COMMENT ON COLUMN public.conversations.workflow_entity_type IS 'Workflow entity type (registry_submission, aams_submission, export_request, breach, etc.)';
COMMENT ON COLUMN public.conversations.workflow_entity_id IS 'Workflow entity ID (links to specific submission/approval/breach)';
COMMENT ON COLUMN public.conversations.lifecycle_state IS 'Lifecycle state: CREATED, SENT, DELIVERED, READ, THREADED, WORKFLOW_LINKED, ARCHIVED';

-- Create messages table
CREATE TABLE IF NOT EXISTS public.messages (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id uuid REFERENCES public.conversations(id) ON DELETE CASCADE NOT NULL,
    sender_id uuid REFERENCES public.users(id) ON DELETE RESTRICT NOT NULL,
    recipient_id uuid REFERENCES public.users(id) ON DELETE SET NULL,
    content text NOT NULL,
    is_system_message boolean DEFAULT false,
    delivered_at timestamptz,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    edited_at timestamptz,
    deleted_at timestamptz
);

COMMENT ON TABLE public.messages IS 'Individual messages within conversations';
COMMENT ON COLUMN public.messages.delivered_at IS 'Delivery timestamp (when message delivered to recipient inbox, different from read_at)';
COMMENT ON COLUMN public.messages.is_system_message IS 'True for automated system messages';
COMMENT ON COLUMN public.messages.deleted_at IS 'Soft delete timestamp (immutable - no hard deletes)';

-- Create message_attachments table
CREATE TABLE IF NOT EXISTS public.message_attachments (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    message_id uuid REFERENCES public.messages(id) ON DELETE CASCADE NOT NULL,
    file_name text NOT NULL,
    file_path text NOT NULL,
    file_size bigint NOT NULL,
    mime_type text NOT NULL,
    uploaded_by uuid REFERENCES public.users(id) ON DELETE RESTRICT NOT NULL,
    created_at timestamptz DEFAULT now()
);

COMMENT ON TABLE public.message_attachments IS 'File attachments for messages';
COMMENT ON COLUMN public.message_attachments.file_path IS 'Storage path (Supabase Storage: communications/attachments/{message_id}/{file_name})';

-- Create message_read_receipts table
CREATE TABLE IF NOT EXISTS public.message_read_receipts (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    message_id uuid REFERENCES public.messages(id) ON DELETE CASCADE NOT NULL,
    user_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    read_at timestamptz DEFAULT now(),
    UNIQUE (message_id, user_id)
);

COMMENT ON TABLE public.message_read_receipts IS 'Track message read status';
COMMENT ON COLUMN public.message_read_receipts.read_at IS 'Read timestamp';

-- Create conversation_participants table
CREATE TABLE IF NOT EXISTS public.conversation_participants (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id uuid REFERENCES public.conversations(id) ON DELETE CASCADE NOT NULL,
    user_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    role text NOT NULL CHECK (role IN ('sender', 'recipient', 'cc', 'bcc')),
    joined_at timestamptz DEFAULT now(),
    left_at timestamptz,
    UNIQUE (conversation_id, user_id)
);

COMMENT ON TABLE public.conversation_participants IS 'Track conversation participants (for multi-party conversations)';
COMMENT ON COLUMN public.conversation_participants.role IS 'Participant role: sender, recipient, cc, bcc';

-- Create indexes for conversations table
CREATE INDEX IF NOT EXISTS idx_conversations_company_id ON public.conversations (company_id) WHERE company_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_conversations_workflow_entity ON public.conversations (workflow_entity_type, workflow_entity_id) WHERE workflow_entity_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_conversations_created_by ON public.conversations (created_by);
CREATE INDEX IF NOT EXISTS idx_conversations_created_at ON public.conversations (created_at);
CREATE INDEX IF NOT EXISTS idx_conversations_type ON public.conversations (type);
CREATE INDEX IF NOT EXISTS idx_conversations_lifecycle_state ON public.conversations (lifecycle_state);

-- Create indexes for messages table
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON public.messages (conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON public.messages (sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_recipient_id ON public.messages (recipient_id) WHERE recipient_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages (created_at);
CREATE INDEX IF NOT EXISTS idx_messages_delivered_at ON public.messages (delivered_at) WHERE delivered_at IS NOT NULL;

-- Create indexes for message_read_receipts table
CREATE INDEX IF NOT EXISTS idx_message_read_receipts_message_id ON public.message_read_receipts (message_id);
CREATE INDEX IF NOT EXISTS idx_message_read_receipts_user_id ON public.message_read_receipts (user_id);
CREATE INDEX IF NOT EXISTS idx_message_read_receipts_read_at ON public.message_read_receipts (read_at);

-- Create indexes for conversation_participants table
CREATE INDEX IF NOT EXISTS idx_conversation_participants_conversation_id ON public.conversation_participants (conversation_id);
CREATE INDEX IF NOT EXISTS idx_conversation_participants_user_id ON public.conversation_participants (user_id);

-- Create indexes for message_attachments table
CREATE INDEX IF NOT EXISTS idx_message_attachments_message_id ON public.message_attachments (message_id);
CREATE INDEX IF NOT EXISTS idx_message_attachments_uploaded_by ON public.message_attachments (uploaded_by);

-- Add updated_at triggers
CREATE TRIGGER set_conversations_updated_at
BEFORE UPDATE ON public.conversations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER set_messages_updated_at
BEFORE UPDATE ON public.messages
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable Row Level Security on all tables
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_read_receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_participants ENABLE ROW LEVEL SECURITY;

COMMIT;
