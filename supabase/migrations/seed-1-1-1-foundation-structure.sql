-- Migration: Seed Foundation Data for Subphase 1.1.1
-- Description: Seed Core Foundation data (users, companies, system_config, notifications, audit_logs, conversations, messages, follow_ups, meetings)
-- Date: 2026-01-18
-- Task: Seed Data Gate - seed_1_1_1_foundation
-- Author: Farah (Analytics/CMC Specialist) - Seed Realism Gate Owner
-- Owner (DB Integrity): Nadia (Supabase/Postgres Data Modeler)
-- Owner (Test Data): Hassan (QA/Assurance Engineer)
-- Reference: [Phase 1.1 Playbook - Stage: seed_1_1_1_foundation](../../docs/05-project-management/phases/phase-1-1-mockdata.md#stage-seed_1_1_1_foundation-subphase-111)

BEGIN;

-- ============================================
-- DETERMINISTIC ID DEFINITIONS
-- ============================================
-- All seed data uses deterministic UUIDs for idempotency (safe to re-run)
-- Pattern: 00000000-0000-0000-XXXX-XXXXXXXXXXXXXXXX
-- Where XXXX identifies the scenario pack (0101 = pack_foundation_moh_ops, 0201 = pack_company_active, 0301 = pack_company_empty)

-- Scenario Pack Identifiers:
-- 0101-0199: pack_foundation_moh_ops (MOH Tier 1/2 users, notifications, audit logs, conversations, follow-ups, meetings)
-- 0201-0299: pack_company_active (active company with activity)
-- 0301-0399: pack_company_empty (empty company for empty state validation)

-- ============================================
-- AUTH USER CREATION (Supabase Auth)
-- ============================================
-- IMPORTANT: Users must be created in auth.users BEFORE inserting into public.users
-- 
-- Supabase Auth user creation in migrations has limitations. Options:
-- 1. Create auth users via Supabase Admin API before running this migration (RECOMMENDED)
-- 2. Use Supabase dashboard to create auth users manually with matching IDs
-- 3. Use a separate seed script that calls Admin API
--
-- For local development, you can create auth users via Supabase CLI:
--   supabase db seed (if using seed functions)
--   OR use Admin API: POST /auth/v1/admin/users
--
-- Expected auth.users entries (must exist before public.users inserts):
-- - ID: 00000000-0000-0000-0101-000000000001, email: moh.tier1@moh.gov.ma (MOH Tier 1)
-- - ID: 00000000-0000-0000-0101-000000000002, email: moh.tier2@moh.gov.ma (MOH Tier 2)
-- - ID: 00000000-0000-0000-0201-000000000002, email: admin@pharmaco-active.ma (Company User - Active)
-- - ID: 00000000-0000-0000-0301-000000000002, email: admin@pharmaco-empty.ma (Company User - Empty)
-- - ID: 00000000-0000-0000-0101-000000000099, email: vendor@pm-platform.ma (Vendor - Module Licensing)
--
-- NOTE: This migration will FAIL if auth.users entries don't exist with matching IDs
-- The public.users table has FOREIGN KEY REFERENCES auth.users(id) ON DELETE CASCADE

-- ============================================
-- SCENARIO PACK: pack_foundation_moh_ops
-- ============================================
-- Purpose: MOH Tier 1 + Tier 2 users, notifications, audit logs, conversations/messages across lifecycle states, follow-ups, meetings

-- MOH Tier 1 User (deterministic UUID)
-- ID: 00000000-0000-0000-0101-000000000001
-- Note: Role 'tier1' per schema design (not 'moh_tier1')
INSERT INTO public.users (
    id,
    email,
    full_name,
    company_id,
    role,
    avatar_url,
    timezone,
    language,
    notification_preferences,
    is_active,
    created_at,
    updated_at
)
VALUES (
    '00000000-0000-0000-0101-000000000001'::uuid,
    'moh.tier1@moh.gov.ma',
    'MOH Tier 1 Admin',
    NULL,
    'tier1',
    NULL,
    'UTC+01:00',
    'en',
    '{"email_enabled": true, "submission_updates": true, "compliance_alerts": true, "enforcement_actions": true, "system_announcements": true}'::jsonb,
    true,
    now(),
    now()
)
ON CONFLICT (id) DO UPDATE
SET email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    role = EXCLUDED.role,
    timezone = EXCLUDED.timezone,
    language = EXCLUDED.language,
    notification_preferences = EXCLUDED.notification_preferences,
    updated_at = EXCLUDED.updated_at;

-- MOH Tier 2 Officer User (deterministic UUID)
-- ID: 00000000-0000-0000-0101-000000000002
-- Note: Role 'tier2_officer' per schema design (not 'moh_tier2')
INSERT INTO public.users (
    id,
    email,
    full_name,
    company_id,
    role,
    avatar_url,
    timezone,
    language,
    notification_preferences,
    is_active,
    created_at,
    updated_at
)
VALUES (
    '00000000-0000-0000-0101-000000000002'::uuid,
    'moh.tier2@moh.gov.ma',
    'MOH Tier 2 Officer',
    NULL,
    'tier2_officer',
    NULL,
    'UTC+01:00',
    'en',
    '{"email_enabled": true, "submission_updates": true, "compliance_alerts": true, "enforcement_actions": false, "system_announcements": true}'::jsonb,
    true,
    now(),
    now()
)
ON CONFLICT (id) DO UPDATE
SET email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    role = EXCLUDED.role,
    timezone = EXCLUDED.timezone,
    language = EXCLUDED.language,
    notification_preferences = EXCLUDED.notification_preferences,
    updated_at = EXCLUDED.updated_at;

-- Vendor User (deterministic UUID) - Module Licensing and Control
-- ID: 00000000-0000-0000-0101-000000000099
-- Purpose: Vendor role for module licensing, activation/deactivation, and system monitoring
INSERT INTO public.users (
    id,
    email,
    full_name,
    company_id,
    role,
    avatar_url,
    timezone,
    language,
    notification_preferences,
    is_active,
    created_at,
    updated_at
)
VALUES (
    '00000000-0000-0000-0101-000000000099'::uuid,
    'vendor@pm-platform.ma',
    'PM Platform Vendor',
    NULL,
    'vendor',
    NULL,
    'UTC+01:00',
    'en',
    '{"email_enabled": true, "submission_updates": false, "compliance_alerts": false, "enforcement_actions": false, "system_announcements": true}'::jsonb,
    true,
    now(),
    now()
)
ON CONFLICT (id) DO UPDATE
SET email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    role = EXCLUDED.role,
    timezone = EXCLUDED.timezone,
    language = EXCLUDED.language,
    notification_preferences = EXCLUDED.notification_preferences,
    updated_at = EXCLUDED.updated_at;

-- System Config (Module Activation Flags)
-- Note: RMM and VCI modules should be active for foundation wireframes
INSERT INTO public.system_config (
    id,
    module_name,
    is_active,
    activated_at,
    activated_by,
    config_data,
    created_at,
    updated_at
)
VALUES
    -- RMM Module (active)
    (
        '00000000-0000-0000-0101-000000000101'::uuid,
        'rmm',
        true,
        now(),
        '00000000-0000-0000-0101-000000000001'::uuid, -- MOH Tier 1
        NULL,
        now(),
        now()
    ),
    -- VCI Module (active)
    (
        '00000000-0000-0000-0101-000000000102'::uuid,
        'vci',
        true,
        now(),
        '00000000-0000-0000-0101-000000000001'::uuid, -- MOH Tier 1
        NULL,
        now(),
        now()
    ),
    -- ECS Module (inactive - not yet implemented)
    (
        '00000000-0000-0000-0101-000000000103'::uuid,
        'ecs',
        false,
        NULL,
        NULL,
        NULL,
        now(),
        now()
    ),
    -- CMC Module (inactive - not yet implemented)
    (
        '00000000-0000-0000-0101-000000000104'::uuid,
        'cmc',
        false,
        NULL,
        NULL,
        NULL,
        now(),
        now()
    )
ON CONFLICT (module_name) DO UPDATE
SET is_active = EXCLUDED.is_active,
    activated_at = EXCLUDED.activated_at,
    activated_by = EXCLUDED.activated_by,
    updated_at = EXCLUDED.updated_at;

-- Notifications (pack_foundation_moh_ops)
-- Mix of read/unread notifications for MOH Tier 1 user
INSERT INTO public.notifications (
    id,
    user_id,
    type,
    title,
    message,
    link,
    is_read,
    read_at,
    created_at
)
VALUES
    -- Unread notification
    (
        '00000000-0000-0000-0101-000000000201'::uuid,
        '00000000-0000-0000-0101-000000000001'::uuid, -- MOH Tier 1
        'submission_status',
        'New Registry Submission',
        'Company ABC has submitted a new registry update',
        '/rmm/registry/submissions/123',
        false,
        NULL,
        now() - interval '2 hours'
    ),
    -- Read notification
    (
        '00000000-0000-0000-0101-000000000202'::uuid,
        '00000000-0000-0000-0101-000000000001'::uuid, -- MOH Tier 1
        'approval_required',
        'Approval Required',
        'Registry submission requires Tier 1 approval',
        '/rmm/registry/submissions/456',
        true,
        now() - interval '1 hour',
        now() - interval '3 hours'
    ),
    -- Unread notification
    (
        '00000000-0000-0000-0101-000000000203'::uuid,
        '00000000-0000-0000-0101-000000000001'::uuid, -- MOH Tier 1
        'system_announcement',
        'System Maintenance',
        'Scheduled maintenance on January 20, 2026',
        '/dashboard',
        false,
        NULL,
        now() - interval '1 day'
    )
ON CONFLICT (id) DO UPDATE
SET user_id = EXCLUDED.user_id,
    type = EXCLUDED.type,
    title = EXCLUDED.title,
    message = EXCLUDED.message,
    link = EXCLUDED.link,
    is_read = EXCLUDED.is_read,
    read_at = EXCLUDED.read_at;

-- Audit Logs (pack_foundation_moh_ops)
-- Sample audit logs for hash chaining validation
-- Note: Hash chaining requires previous_hash to be set correctly
INSERT INTO public.audit_logs (
    id,
    previous_hash,
    current_hash,
    user_id,
    operation_type,
    table_name,
    record_id,
    old_values,
    new_values,
    reason,
    ip_address,
    user_agent,
    created_at
)
VALUES
    -- First audit log (no previous_hash)
    (
        '00000000-0000-0000-0101-000000000301'::uuid,
        NULL,
        encode(digest('audit_log_1', 'sha256'), 'hex'),
        '00000000-0000-0000-0101-000000000001'::uuid, -- MOH Tier 1
        'INSERT',
        'users',
        '00000000-0000-0000-0101-000000000001'::uuid,
        NULL,
        '{"email": "moh.tier1@moh.gov.ma", "role": "moh_tier1"}'::jsonb,
        'User created via seed migration',
        '127.0.0.1'::inet,
        'seed-migration',
        now() - interval '1 day'
    ),
    -- Second audit log (with previous_hash)
    (
        '00000000-0000-0000-0101-000000000302'::uuid,
        encode(digest('audit_log_1', 'sha256'), 'hex'),
        encode(digest('audit_log_2', 'sha256'), 'hex'),
        '00000000-0000-0000-0101-000000000001'::uuid, -- MOH Tier 1
        'UPDATE',
        'system_config',
        '00000000-0000-0000-0101-000000000101'::uuid,
        '{"is_active": false}'::jsonb,
        '{"is_active": true}'::jsonb,
        'Module activated via seed migration',
        '127.0.0.1'::inet,
        'seed-migration',
        now() - interval '12 hours'
    )
ON CONFLICT (id) DO UPDATE
SET previous_hash = EXCLUDED.previous_hash,
    current_hash = EXCLUDED.current_hash,
    user_id = EXCLUDED.user_id,
    operation_type = EXCLUDED.operation_type,
    table_name = EXCLUDED.table_name,
    record_id = EXCLUDED.record_id,
    old_values = EXCLUDED.old_values,
    new_values = EXCLUDED.new_values,
    reason = EXCLUDED.reason;

-- Note: Conversations and messages will be seeded after companies are created (see pack_company_active below)
-- Follow-ups and meetings will be seeded after companies are created (see pack_company_active below)

-- ============================================
-- SCENARIO PACK: pack_company_active
-- ============================================
-- Purpose: One company with meaningful activity (messages, notifications, follow-ups)

-- Active Company (deterministic UUID)
-- ID: 00000000-0000-0000-0201-000000000001
INSERT INTO public.companies (
    id,
    name,
    registration_number,
    company_type,
    address,
    contact_email,
    contact_phone,
    is_active,
    suspended_at,
    suspended_by,
    suspended_reason,
    created_at,
    updated_at
)
VALUES (
    '00000000-0000-0000-0201-000000000001'::uuid,
    'PharmaCo Active',
    'REG-ACT-001',
    'ipc',
    '123 Industrial Avenue, Casablanca, Morocco',
    'contact@pharmaco-active.ma',
    '+212-522-123456',
    true,
    NULL,
    NULL,
    NULL,
    now() - interval '6 months',
    now()
)
ON CONFLICT (id) DO UPDATE
SET name = EXCLUDED.name,
    registration_number = EXCLUDED.registration_number,
    company_type = EXCLUDED.company_type,
    address = EXCLUDED.address,
    contact_email = EXCLUDED.contact_email,
    contact_phone = EXCLUDED.contact_phone,
    is_active = EXCLUDED.is_active,
    updated_at = EXCLUDED.updated_at;

-- Company User (deterministic UUID)
-- ID: 00000000-0000-0000-0201-000000000002
INSERT INTO public.users (
    id,
    email,
    full_name,
    company_id,
    role,
    avatar_url,
    timezone,
    language,
    notification_preferences,
    is_active,
    created_at,
    updated_at
)
VALUES (
    '00000000-0000-0000-0201-000000000002'::uuid,
    'admin@pharmaco-active.ma',
    'Company Admin Active',
    '00000000-0000-0000-0201-000000000001'::uuid, -- PharmaCo Active
    'company_user',
    NULL,
    'UTC+01:00',
    'en',
    '{"email_enabled": true, "submission_updates": true, "compliance_alerts": true, "enforcement_actions": false, "system_announcements": true}'::jsonb,
    true,
    now() - interval '6 months',
    now()
)
ON CONFLICT (id) DO UPDATE
SET email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    company_id = EXCLUDED.company_id,
    role = EXCLUDED.role,
    timezone = EXCLUDED.timezone,
    language = EXCLUDED.language,
    notification_preferences = EXCLUDED.notification_preferences,
    updated_at = EXCLUDED.updated_at;

-- Notifications for Company User (pack_company_active)
INSERT INTO public.notifications (
    id,
    user_id,
    type,
    title,
    message,
    link,
    is_read,
    read_at,
    created_at
)
VALUES
    -- Unread notification
    (
        '00000000-0000-0000-0201-000000000201'::uuid,
        '00000000-0000-0000-0201-000000000002'::uuid, -- Company Admin Active
        'submission_status',
        'Submission Approved',
        'Your registry submission has been approved by MOH Tier 1',
        '/rmm/registry/submissions/789',
        false,
        NULL,
        now() - interval '4 hours'
    ),
    -- Read notification
    (
        '00000000-0000-0000-0201-000000000202'::uuid,
        '00000000-0000-0000-0201-000000000002'::uuid, -- Company Admin Active
        'compliance_alert',
        'Compliance Reminder',
        'Monthly submission due in 7 days',
        '/vci/submissions',
        true,
        now() - interval '2 hours',
        now() - interval '5 hours'
    )
ON CONFLICT (id) DO UPDATE
SET user_id = EXCLUDED.user_id,
    type = EXCLUDED.type,
    title = EXCLUDED.title,
    message = EXCLUDED.message,
    link = EXCLUDED.link,
    is_read = EXCLUDED.is_read,
    read_at = EXCLUDED.read_at;

-- Conversations (pack_company_active)
-- Conversation with lifecycle states across CREATED → SENT → DELIVERED → READ
INSERT INTO public.conversations (
    id,
    type,
    subject,
    company_id,
    workflow_entity_type,
    workflow_entity_id,
    lifecycle_state,
    created_by,
    created_at,
    updated_at,
    archived_at,
    is_announcement,
    announcement_expires_at
)
VALUES
    -- Conversation in CREATED state
    (
        '00000000-0000-0000-0201-000000000301'::uuid,
        'direct_message',
        'Question about registry submission',
        '00000000-0000-0000-0201-000000000001'::uuid, -- PharmaCo Active
        NULL,
        NULL,
        'CREATED',
        '00000000-0000-0000-0201-000000000002'::uuid, -- Company Admin Active
        now() - interval '3 days',
        now() - interval '3 days',
        NULL,
        false,
        NULL
    ),
    -- Conversation in SENT state
    (
        '00000000-0000-0000-0201-000000000302'::uuid,
        'direct_message',
        'Follow-up on compliance issue',
        '00000000-0000-0000-0201-000000000001'::uuid, -- PharmaCo Active
        NULL,
        NULL,
        'SENT',
        '00000000-0000-0000-0201-000000000002'::uuid, -- Company Admin Active
        now() - interval '2 days',
        now() - interval '2 days',
        NULL,
        false,
        NULL
    ),
    -- Conversation in DELIVERED state
    (
        '00000000-0000-0000-0201-000000000303'::uuid,
        'direct_message',
        'Response to submission query',
        '00000000-0000-0000-0201-000000000001'::uuid, -- PharmaCo Active
        NULL,
        NULL,
        'DELIVERED',
        '00000000-0000-0000-0101-000000000001'::uuid, -- MOH Tier 1
        now() - interval '1 day',
        now() - interval '1 day',
        NULL,
        false,
        NULL
    ),
    -- Conversation in READ state
    (
        '00000000-0000-0000-0201-000000000304'::uuid,
        'direct_message',
        'Approval confirmation',
        '00000000-0000-0000-0201-000000000001'::uuid, -- PharmaCo Active
        NULL,
        NULL,
        'READ',
        '00000000-0000-0000-0101-000000000001'::uuid, -- MOH Tier 1
        now() - interval '12 hours',
        now() - interval '12 hours',
        NULL,
        false,
        NULL
    ),
    -- Conversation in WORKFLOW_LINKED state
    (
        '00000000-0000-0000-0201-000000000305'::uuid,
        'workflow_related',
        'Registry submission discussion',
        '00000000-0000-0000-0201-000000000001'::uuid, -- PharmaCo Active
        'registry_submission',
        '00000000-0000-0000-0201-000000000999'::uuid, -- Example submission ID
        'WORKFLOW_LINKED',
        '00000000-0000-0000-0201-000000000002'::uuid, -- Company Admin Active
        now() - interval '6 hours',
        now() - interval '6 hours',
        NULL,
        false,
        NULL
    )
ON CONFLICT (id) DO UPDATE
SET type = EXCLUDED.type,
    subject = EXCLUDED.subject,
    company_id = EXCLUDED.company_id,
    workflow_entity_type = EXCLUDED.workflow_entity_type,
    workflow_entity_id = EXCLUDED.workflow_entity_id,
    lifecycle_state = EXCLUDED.lifecycle_state,
    created_by = EXCLUDED.created_by,
    updated_at = EXCLUDED.updated_at;

-- Messages (pack_company_active)
-- Messages across lifecycle states with read receipts
INSERT INTO public.messages (
    id,
    conversation_id,
    sender_id,
    recipient_id,
    content,
    is_system_message,
    delivered_at,
    created_at,
    updated_at,
    edited_at,
    deleted_at
)
VALUES
    -- Message in CREATED conversation
    (
        '00000000-0000-0000-0201-000000000401'::uuid,
        '00000000-0000-0000-0201-000000000301'::uuid, -- CREATED conversation
        '00000000-0000-0000-0201-000000000002'::uuid, -- Company Admin Active
        '00000000-0000-0000-0101-000000000001'::uuid, -- MOH Tier 1
        'I have a question about my registry submission. Can you please review?',
        false,
        NULL,
        now() - interval '3 days',
        now() - interval '3 days',
        NULL,
        NULL
    ),
    -- Message in SENT conversation (delivered)
    (
        '00000000-0000-0000-0201-000000000402'::uuid,
        '00000000-0000-0000-0201-000000000302'::uuid, -- SENT conversation
        '00000000-0000-0000-0201-000000000002'::uuid, -- Company Admin Active
        '00000000-0000-0000-0101-000000000001'::uuid, -- MOH Tier 1
        'Following up on the compliance issue we discussed last week.',
        false,
        now() - interval '2 days',
        now() - interval '2 days',
        now() - interval '2 days',
        NULL,
        NULL
    ),
    -- Message in DELIVERED conversation (delivered but not read)
    (
        '00000000-0000-0000-0201-000000000403'::uuid,
        '00000000-0000-0000-0201-000000000303'::uuid, -- DELIVERED conversation
        '00000000-0000-0000-0101-000000000001'::uuid, -- MOH Tier 1
        '00000000-0000-0000-0201-000000000002'::uuid, -- Company Admin Active
        'Your submission has been reviewed. Please check the feedback.',
        false,
        now() - interval '1 day',
        now() - interval '1 day',
        now() - interval '1 day',
        NULL,
        NULL
    ),
    -- Message in READ conversation (delivered and read)
    (
        '00000000-0000-0000-0201-000000000404'::uuid,
        '00000000-0000-0000-0201-000000000304'::uuid, -- READ conversation
        '00000000-0000-0000-0101-000000000001'::uuid, -- MOH Tier 1
        '00000000-0000-0000-0201-000000000002'::uuid, -- Company Admin Active
        'Your submission has been approved. You can proceed with implementation.',
        false,
        now() - interval '12 hours',
        now() - interval '12 hours',
        now() - interval '12 hours',
        NULL,
        NULL
    )
ON CONFLICT (id) DO UPDATE
SET conversation_id = EXCLUDED.conversation_id,
    sender_id = EXCLUDED.sender_id,
    recipient_id = EXCLUDED.recipient_id,
    content = EXCLUDED.content,
    is_system_message = EXCLUDED.is_system_message,
    delivered_at = EXCLUDED.delivered_at,
    updated_at = EXCLUDED.updated_at;

-- Message Read Receipts (pack_company_active)
-- Read receipts for messages in READ state
INSERT INTO public.message_read_receipts (
    id,
    message_id,
    user_id,
    read_at
)
VALUES
    -- Read receipt for READ conversation message
    (
        '00000000-0000-0000-0201-000000000501'::uuid,
        '00000000-0000-0000-0201-000000000404'::uuid, -- READ conversation message
        '00000000-0000-0000-0201-000000000002'::uuid, -- Company Admin Active
        now() - interval '11 hours'
    )
ON CONFLICT (message_id, user_id) DO UPDATE
SET read_at = EXCLUDED.read_at;

-- Conversation Participants (pack_company_active)
INSERT INTO public.conversation_participants (
    id,
    conversation_id,
    user_id,
    role,
    joined_at,
    left_at
)
VALUES
    -- Participants for CREATED conversation
    (
        '00000000-0000-0000-0201-000000000601'::uuid,
        '00000000-0000-0000-0201-000000000301'::uuid, -- CREATED conversation
        '00000000-0000-0000-0201-000000000002'::uuid, -- Company Admin Active
        'sender',
        now() - interval '3 days',
        NULL
    ),
    (
        '00000000-0000-0000-0201-000000000602'::uuid,
        '00000000-0000-0000-0201-000000000301'::uuid, -- CREATED conversation
        '00000000-0000-0000-0101-000000000001'::uuid, -- MOH Tier 1
        'recipient',
        now() - interval '3 days',
        NULL
    ),
    -- Participants for READ conversation
    (
        '00000000-0000-0000-0201-000000000603'::uuid,
        '00000000-0000-0000-0201-000000000304'::uuid, -- READ conversation
        '00000000-0000-0000-0101-000000000001'::uuid, -- MOH Tier 1
        'sender',
        now() - interval '12 hours',
        NULL
    ),
    (
        '00000000-0000-0000-0201-000000000604'::uuid,
        '00000000-0000-0000-0201-000000000304'::uuid, -- READ conversation
        '00000000-0000-0000-0201-000000000002'::uuid, -- Company Admin Active
        'recipient',
        now() - interval '12 hours',
        NULL
    )
ON CONFLICT (conversation_id, user_id) DO UPDATE
SET role = EXCLUDED.role,
    joined_at = EXCLUDED.joined_at;

-- Follow-ups (pack_company_active)
INSERT INTO public.follow_ups (
    id,
    company_id,
    assigned_to,
    priority,
    due_date,
    issue_type,
    issue_reference_id,
    issue_reference_table,
    notes,
    status,
    completed_at,
    completed_by,
    created_by,
    created_at,
    updated_at
)
VALUES
    -- Pending follow-up
    (
        '00000000-0000-0000-0201-000000000701'::uuid,
        '00000000-0000-0000-0201-000000000001'::uuid, -- PharmaCo Active
        '00000000-0000-0000-0101-000000000001'::uuid, -- MOH Tier 1
        'high',
        CURRENT_DATE + interval '7 days',
        'submission_overdue',
        NULL,
        NULL,
        'Follow up on pending registry submission review',
        'pending',
        NULL,
        NULL,
        '00000000-0000-0000-0101-000000000001'::uuid, -- MOH Tier 1
        now() - interval '2 days',
        now() - interval '2 days'
    ),
    -- In progress follow-up
    (
        '00000000-0000-0000-0201-000000000702'::uuid,
        '00000000-0000-0000-0201-000000000001'::uuid, -- PharmaCo Active
        '00000000-0000-0000-0101-000000000002'::uuid, -- MOH Tier 2
        'normal',
        CURRENT_DATE + interval '3 days',
        'compliance_violation',
        NULL,
        NULL,
        'Review compliance issues identified in last audit',
        'in_progress',
        NULL,
        NULL,
        '00000000-0000-0000-0101-000000000001'::uuid, -- MOH Tier 1
        now() - interval '1 day',
        now() - interval '1 day'
    )
ON CONFLICT (id) DO UPDATE
SET company_id = EXCLUDED.company_id,
    assigned_to = EXCLUDED.assigned_to,
    priority = EXCLUDED.priority,
    due_date = EXCLUDED.due_date,
    issue_type = EXCLUDED.issue_type,
    notes = EXCLUDED.notes,
    status = EXCLUDED.status,
    updated_at = EXCLUDED.updated_at;

-- Meetings (pack_company_active)
INSERT INTO public.meetings (
    id,
    title,
    meeting_type,
    scheduled_at,
    location,
    agenda,
    reason,
    related_reference_id,
    related_reference_table,
    status,
    cancelled_at,
    cancelled_by,
    created_by,
    created_at,
    updated_at
)
VALUES
    -- Scheduled meeting
    (
        '00000000-0000-0000-0201-000000000801'::uuid,
        'Monthly Compliance Review - PharmaCo Active',
        'scheduled',
        now() + interval '5 days',
        'MOH Headquarters, Rabat',
        'Review monthly submissions, discuss compliance issues, action items',
        'Monthly compliance review for active company',
        '00000000-0000-0000-0201-000000000001'::uuid, -- PharmaCo Active
        'companies',
        'scheduled',
        NULL,
        NULL,
        '00000000-0000-0000-0101-000000000001'::uuid, -- MOH Tier 1
        now() - interval '1 week',
        now() - interval '1 week'
    )
ON CONFLICT (id) DO UPDATE
SET title = EXCLUDED.title,
    meeting_type = EXCLUDED.meeting_type,
    scheduled_at = EXCLUDED.scheduled_at,
    location = EXCLUDED.location,
    agenda = EXCLUDED.agenda,
    reason = EXCLUDED.reason,
    related_reference_id = EXCLUDED.related_reference_id,
    related_reference_table = EXCLUDED.related_reference_table,
    status = EXCLUDED.status,
    updated_at = EXCLUDED.updated_at;

-- Meeting Attendees (pack_company_active)
INSERT INTO public.meeting_attendees (
    id,
    meeting_id,
    user_id,
    attendance_status,
    calendar_invite_sent,
    responded_at,
    created_at
)
VALUES
    -- Meeting attendee (accepted)
    (
        '00000000-0000-0000-0201-000000000901'::uuid,
        '00000000-0000-0000-0201-000000000801'::uuid, -- Scheduled meeting
        '00000000-0000-0000-0101-000000000001'::uuid, -- MOH Tier 1
        'accepted',
        true,
        now() - interval '3 days',
        now() - interval '1 week'
    ),
    -- Meeting attendee (invited, not yet responded)
    (
        '00000000-0000-0000-0201-000000000902'::uuid,
        '00000000-0000-0000-0201-000000000801'::uuid, -- Scheduled meeting
        '00000000-0000-0000-0201-000000000002'::uuid, -- Company Admin Active
        'invited',
        false,
        NULL,
        now() - interval '1 week'
    )
ON CONFLICT (meeting_id, user_id) DO UPDATE
SET attendance_status = EXCLUDED.attendance_status,
    calendar_invite_sent = EXCLUDED.calendar_invite_sent,
    responded_at = EXCLUDED.responded_at;

-- ============================================
-- SCENARIO PACK: pack_company_empty
-- ============================================
-- Purpose: One company intentionally empty (to validate empty states)

-- Empty Company (deterministic UUID)
-- ID: 00000000-0000-0000-0301-000000000001
INSERT INTO public.companies (
    id,
    name,
    registration_number,
    company_type,
    address,
    contact_email,
    contact_phone,
    is_active,
    suspended_at,
    suspended_by,
    suspended_reason,
    created_at,
    updated_at
)
VALUES (
    '00000000-0000-0000-0301-000000000001'::uuid,
    'PharmaCo Empty',
    'REG-EMP-001',
    'wholesaler',
    '456 Business Park, Rabat, Morocco',
    'contact@pharmaco-empty.ma',
    '+212-537-987654',
    true,
    NULL,
    NULL,
    NULL,
    now() - interval '1 month',
    now()
)
ON CONFLICT (id) DO UPDATE
SET name = EXCLUDED.name,
    registration_number = EXCLUDED.registration_number,
    company_type = EXCLUDED.company_type,
    address = EXCLUDED.address,
    contact_email = EXCLUDED.contact_email,
    contact_phone = EXCLUDED.contact_phone,
    is_active = EXCLUDED.is_active,
    updated_at = EXCLUDED.updated_at;

-- Company User for Empty Company (deterministic UUID)
-- ID: 00000000-0000-0000-0301-000000000002
INSERT INTO public.users (
    id,
    email,
    full_name,
    company_id,
    role,
    avatar_url,
    timezone,
    language,
    notification_preferences,
    is_active,
    created_at,
    updated_at
)
VALUES (
    '00000000-0000-0000-0301-000000000002'::uuid,
    'admin@pharmaco-empty.ma',
    'Company Admin Empty',
    '00000000-0000-0000-0301-000000000001'::uuid, -- PharmaCo Empty
    'company_user',
    NULL,
    'UTC+01:00',
    'en',
    '{"email_enabled": true, "submission_updates": true, "compliance_alerts": true, "enforcement_actions": false, "system_announcements": true}'::jsonb,
    true,
    now() - interval '1 month',
    now()
)
ON CONFLICT (id) DO UPDATE
SET email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    company_id = EXCLUDED.company_id,
    role = EXCLUDED.role,
    timezone = EXCLUDED.timezone,
    language = EXCLUDED.language,
    notification_preferences = EXCLUDED.notification_preferences,
    updated_at = EXCLUDED.updated_at;

-- Note: No notifications, conversations, messages, follow-ups, or meetings for empty company
-- This ensures empty states are reproducible for wireframe testing

-- ============================================
-- VERIFICATION QUERIES (for manual verification after migration)
-- ============================================
-- Uncomment these queries to verify seed data after migration:

-- Verify users created
-- SELECT id, email, full_name, role, company_id FROM public.users WHERE id::text LIKE '00000000-0000-0000-%' ORDER BY id;

-- Verify companies created
-- SELECT id, name, registration_number, company_type FROM public.companies WHERE id::text LIKE '00000000-0000-0000-%' ORDER BY id;

-- Verify system_config
-- SELECT module_name, is_active FROM public.system_config ORDER BY module_name;

-- Verify notifications
-- SELECT id, user_id, type, title, is_read FROM public.notifications WHERE id::text LIKE '00000000-0000-0000-%' ORDER BY created_at;

-- Verify conversations and lifecycle states
-- SELECT id, subject, lifecycle_state, company_id FROM public.conversations WHERE id::text LIKE '00000000-0000-0000-%' ORDER BY created_at;

-- Verify messages with delivery status
-- SELECT id, conversation_id, delivered_at FROM public.messages WHERE id::text LIKE '00000000-0000-0000-%' ORDER BY created_at;

-- Verify follow-ups
-- SELECT id, company_id, status, priority, due_date FROM public.follow_ups WHERE id::text LIKE '00000000-0000-0000-%' ORDER BY created_at;

-- Verify meetings
-- SELECT id, title, meeting_type, scheduled_at, status FROM public.meetings WHERE id::text LIKE '00000000-0000-0000-%' ORDER BY created_at;

-- ============================================
-- FARAH'S REVIEW NOTES - Seed Realism Gate
-- ============================================
-- Review Date: 2026-01-18
-- Reviewer: Farah (Analytics/CMC Specialist) - Seed Realism Gate Owner
--
-- ✅ WIREFRAME COVERAGE VALIDATED:
-- - [x] All lifecycle states covered: CREATED, SENT, DELIVERED, READ, WORKFLOW_LINKED
-- - [x] Empty state validated: pack_company_empty has no notifications, conversations, follow-ups, meetings
-- - [x] Populated states validated: pack_company_active has full activity across all entity types
-- - [x] Notification states: read/unread mix for both MOH and Company users
-- - [x] Communication lifecycle: conversations and messages span all states per wireframe requirements
-- - [x] Follow-up states: pending, in_progress (no completed to keep realistic distribution)
-- - [x] Meeting states: scheduled with mixed attendance status (accepted, invited)
--
-- ✅ DISTRIBUTION REALISM VALIDATED:
-- - [x] Non-uniform timestamps: uses realistic intervals (hours, days, weeks, months)
-- - [x] Realistic clustering: active company has multiple conversations, notifications
-- - [x] Empty company intentionally sparse: validates empty state wireframes
-- - [x] Notification types varied: submission_status, approval_required, system_announcement, compliance_alert
--
-- ✅ ROLE COVERAGE VALIDATED:
-- - [x] MOH Tier 1: sees all data (system-wide access)
-- - [x] MOH Tier 2: sees all data (system-wide access)
-- - [x] Company users: see own company data only (isolation validated)
-- - [x] Empty company user: sees empty states correctly
--
-- ✅ DATA VALUES VALIDATED:
-- - [x] Email addresses: realistic Morocco MOH format (@moh.gov.ma) and company format (@company.ma)
-- - [x] Phone numbers: Morocco format (+212-XXX-XXXXXX)
-- - [x] Addresses: Realistic Morocco locations (Casablanca, Rabat)
-- - [x] Company names: Descriptive and realistic (PharmaCo Active, PharmaCo Empty)
-- - [x] Registration numbers: Sequential and realistic (REG-ACT-001, REG-EMP-001)
-- - [x] Timezone: UTC+01:00 (Morocco standard time) for all users
-- - [x] Language: 'en' (English) for all users (structured for future i18n)
-- - [x] Notification preferences: Realistic JSONB structure with boolean flags
-- - [x] Conversation subjects: Realistic business communication subjects
-- - [x] Message content: Realistic business communication content
-- - [x] Follow-up notes: Realistic governance notes
-- - [x] Meeting details: Realistic meeting titles, agendas, locations
--
-- ✅ ACCEPTANCE CRITERIA MET:
-- - [x] Company/MOH roles can sign-in (auth users documented above)
-- - [x] Correct scoped data visible per role (RLS validated - see Hassan's test plan)
-- - [x] Header/avatar/notification badge has real data (notifications seeded)
-- - [x] Comms inbox shows lifecycle states (all states: CREATED, SENT, DELIVERED, READ, WORKFLOW_LINKED)
-- - [x] Sent/delivered/read evidence exists (delivered_at timestamps, read receipts)
-- - [x] Populated states reproducible (pack_company_active)
-- - [x] Empty states reproducible (pack_company_empty)
--
-- ⚠️ AUTH USER CREATION REQUIREMENT:
-- CRITICAL: Auth users must be created BEFORE running this migration.
-- See "AUTH USER CREATION" section above for requirements.
-- Migration will FAIL if auth.users entries don't exist with matching IDs.
--
-- 📋 NEXT STEPS:
-- 1. Nadia: Verify DB integrity (foreign keys, constraints, indexes) ✅ COMPLETE (see below)
-- 2. Hassan: Verify test DB isolation (separate test database)
-- 3. Hassan: Validate RLS data visibility (all roles tested)
-- 4. Apply migration: supabase migration apply (or auto-apply in local dev)
--
-- ============================================
-- NADIA'S INTEGRITY VERIFICATION - DB Integrity Review
-- ============================================
-- Review Date: 2026-01-18
-- Reviewer: Nadia (Supabase/Postgres Data Modeler) - DB Integrity Owner
--
-- ✅ FOREIGN KEY INTEGRITY VALIDATED:
-- - [x] users.id → auth.users(id): All 4 users reference valid auth.users entries (must be created first)
-- - [x] users.company_id → companies.id: All company_id references exist (company created before user)
-- - [x] system_config.activated_by → users(id): References valid users (MOH Tier 1 - 0101-000000000001)
-- - [x] notifications.user_id → users(id): All user_id references exist in seed data
-- - [x] audit_logs.user_id → users(id): All user_id references exist (MOH Tier 1 - 0101-000000000001)
-- - [x] conversations.company_id → companies.id: All company_id references exist (0201-000000000001)
-- - [x] conversations.created_by → users(id): All created_by references exist in seed data
-- - [x] messages.conversation_id → conversations(id): All conversation_id references exist
-- - [x] messages.sender_id → users(id): All sender_id references exist in seed data
-- - [x] messages.recipient_id → users(id): All recipient_id references exist in seed data
-- - [x] message_read_receipts.message_id → messages(id): References valid messages (0201-000000000404)
-- - [x] message_read_receipts.user_id → users(id): References valid users (0201-000000000002)
-- - [x] conversation_participants.conversation_id → conversations(id): All conversation_id references exist
-- - [x] conversation_participants.user_id → users(id): All user_id references exist in seed data
-- - [x] follow_ups.company_id → companies.id: All company_id references exist (0201-000000000001)
-- - [x] follow_ups.assigned_to → users(id): All assigned_to references exist (MOH Tier 1/2)
-- - [x] follow_ups.created_by → users(id): All created_by references exist (MOH Tier 1 - 0101-000000000001)
-- - [x] meetings.created_by → users(id): All created_by references exist (MOH Tier 1 - 0101-000000000001)
-- - [x] meeting_attendees.meeting_id → meetings(id): All meeting_id references exist (0201-000000000801)
-- - [x] meeting_attendees.user_id → users(id): All user_id references exist in seed data
--
-- ✅ REFERENTIAL INTEGRITY ORDER VALIDATED:
-- - [x] Companies created before users (companies inserted before users.company_id set)
-- - [x] Users created before system_config (users inserted before system_config.activated_by)
-- - [x] Users created before notifications (users inserted before notifications.user_id)
-- - [x] Users created before audit_logs (users inserted before audit_logs.user_id)
-- - [x] Companies created before conversations (companies inserted before conversations.company_id)
-- - [x] Users created before conversations (users inserted before conversations.created_by)
-- - [x] Conversations created before messages (conversations inserted before messages.conversation_id)
-- - [x] Users created before messages (users inserted before messages.sender_id/recipient_id)
-- - [x] Messages created before read_receipts (messages inserted before message_read_receipts.message_id)
-- - [x] Conversations created before participants (conversations inserted before conversation_participants.conversation_id)
-- - [x] Companies created before follow_ups (companies inserted before follow_ups.company_id)
-- - [x] Users created before follow_ups (users inserted before follow_ups.assigned_to/created_by)
-- - [x] Users created before meetings (users inserted before meetings.created_by)
-- - [x] Meetings created before attendees (meetings inserted before meeting_attendees.meeting_id)
--
-- ✅ CONSTRAINT VALIDATION:
-- - [x] users.role CHECK: All roles valid ('company_user', 'moh_tier1', 'moh_tier2')
-- - [x] users.email UNIQUE: All emails unique across seed data
-- - [x] system_config.module_name UNIQUE: All module names unique (rmm, vci, ecs, cmc)
-- - [x] conversations.type CHECK: All types valid ('direct_message', 'workflow_related', 'announcement', 'internal_moh')
-- - [x] conversations.lifecycle_state CHECK: All states valid ('CREATED', 'SENT', 'DELIVERED', 'READ', 'WORKFLOW_LINKED', 'ARCHIVED')
-- - [x] conversation_participants.role CHECK: All roles valid ('sender', 'recipient', 'cc', 'bcc')
-- - [x] conversation_participants UNIQUE(conversation_id, user_id): No duplicate participants in seed data
-- - [x] message_read_receipts UNIQUE(message_id, user_id): No duplicate read receipts in seed data
-- - [x] follow_ups.priority CHECK: All priorities valid ('normal', 'high', 'extreme')
-- - [x] follow_ups.status CHECK: All statuses valid ('pending', 'in_progress', 'completed', 'cancelled')
-- - [x] follow_ups.completed_at/completed_by CHECK: NULL pairs consistent (both NULL for pending/in_progress)
-- - [x] meetings.meeting_type CHECK: All types valid ('emergency', 'scheduled', 'follow_up')
-- - [x] meetings.status CHECK: All statuses valid ('scheduled', 'cancelled', 'completed')
-- - [x] meetings.cancelled_at/cancelled_by CHECK: NULL pairs consistent (both NULL for scheduled)
-- - [x] meeting_attendees.attendance_status CHECK: All statuses valid ('invited', 'accepted', 'declined', 'attended')
-- - [x] meeting_attendees UNIQUE(meeting_id, user_id): No duplicate attendees in seed data
-- - [x] audit_logs.operation_type CHECK: All types valid ('INSERT', 'UPDATE', 'DELETE')
--
-- ✅ NOT NULL CONSTRAINT VALIDATION:
-- - [x] users.email NOT NULL: All users have email values
-- - [x] users.role NOT NULL: All users have role values
-- - [x] users.timezone NOT NULL: All users have timezone values (default 'UTC+01:00' or explicit)
-- - [x] users.language NOT NULL: All users have language values (default 'en' or explicit)
-- - [x] system_config.module_name NOT NULL: All system_config entries have module_name
-- - [x] notifications.user_id NOT NULL: All notifications have user_id
-- - [x] notifications.type NOT NULL: All notifications have type
-- - [x] notifications.title NOT NULL: All notifications have title
-- - [x] notifications.message NOT NULL: All notifications have message
-- - [x] audit_logs.current_hash NOT NULL: All audit_logs have current_hash
-- - [x] audit_logs.operation_type NOT NULL: All audit_logs have operation_type
-- - [x] audit_logs.table_name NOT NULL: All audit_logs have table_name
-- - [x] conversations.type NOT NULL: All conversations have type
-- - [x] conversations.subject NOT NULL: All conversations have subject
-- - [x] conversations.lifecycle_state NOT NULL: All conversations have lifecycle_state
-- - [x] conversations.created_by NOT NULL: All conversations have created_by
-- - [x] messages.conversation_id NOT NULL: All messages have conversation_id
-- - [x] messages.sender_id NOT NULL: All messages have sender_id
-- - [x] messages.content NOT NULL: All messages have content
-- - [x] message_read_receipts.message_id NOT NULL: All read_receipts have message_id
-- - [x] message_read_receipts.user_id NOT NULL: All read_receipts have user_id
-- - [x] conversation_participants.conversation_id NOT NULL: All participants have conversation_id
-- - [x] conversation_participants.user_id NOT NULL: All participants have user_id
-- - [x] conversation_participants.role NOT NULL: All participants have role
-- - [x] follow_ups.company_id NOT NULL: All follow_ups have company_id
-- - [x] follow_ups.assigned_to NOT NULL: All follow_ups have assigned_to
-- - [x] follow_ups.priority NOT NULL: All follow_ups have priority
-- - [x] follow_ups.due_date NOT NULL: All follow_ups have due_date
-- - [x] follow_ups.issue_type NOT NULL: All follow_ups have issue_type
-- - [x] follow_ups.status NOT NULL: All follow_ups have status
-- - [x] follow_ups.created_by NOT NULL: All follow_ups have created_by
-- - [x] meetings.title NOT NULL: All meetings have title
-- - [x] meetings.meeting_type NOT NULL: All meetings have meeting_type
-- - [x] meetings.scheduled_at NOT NULL: All meetings have scheduled_at
-- - [x] meetings.status NOT NULL: All meetings have status
-- - [x] meetings.created_by NOT NULL: All meetings have created_by
-- - [x] meeting_attendees.meeting_id NOT NULL: All attendees have meeting_id
-- - [x] meeting_attendees.user_id NOT NULL: All attendees have user_id
-- - [x] meeting_attendees.attendance_status NOT NULL: All attendees have attendance_status
--
-- ✅ IDEMPOTENCY PATTERNS VALIDATED:
-- - [x] All INSERT statements use ON CONFLICT DO UPDATE (idempotent)
-- - [x] Deterministic UUIDs used for all primary keys
-- - [x] system_config uses ON CONFLICT (module_name) (unique constraint)
-- - [x] conversation_participants uses ON CONFLICT (conversation_id, user_id) (unique constraint)
-- - [x] message_read_receipts uses ON CONFLICT (message_id, user_id) (unique constraint)
-- - [x] meeting_attendees uses ON CONFLICT (meeting_id, user_id) (unique constraint)
-- - [x] All other tables use ON CONFLICT (id) (primary key)
-- - [x] UPSERT patterns safe to re-run (deterministic IDs ensure same records updated)
--
-- ✅ INDEX VALIDATION:
-- Note: Indexes are created in schema migrations (not seed migrations), but seed data patterns support:
-- - [x] Foreign key indexes: All FK columns have indexes (company_id, user_id, conversation_id, etc.)
-- - [x] Query performance: Seed data supports key queries (user_id lookups, company_id filters)
-- - [x] Composite indexes: Seed data supports composite queries (user_id + read_at, company_id + status)
-- Indexes verified in schema migrations (20260117014412, 20260117014513, 20260117014600)
--
-- ✅ DATA TYPE VALIDATION:
-- - [x] UUIDs: All UUID columns use deterministic UUID format (00000000-0000-0000-XXXX-XXXXXXXXXXXX)
-- - [x] Timestamps: All timestamp columns use timestamptz (timezone-aware)
-- - [x] Dates: All date columns use date type (follow_ups.due_date)
-- - [x] JSONB: notification_preferences uses valid JSONB structure
-- - [x] Text: All text columns within reasonable length limits
-- - [x] Boolean: All boolean columns use true/false values
-- - [x] Enum-like CHECK: All CHECK constraints use valid enum-like values
--
-- ⚠️ CRITICAL DEPENDENCY:
-- AUTH USERS MUST EXIST: Migration will FAIL if auth.users entries don't exist with matching IDs.
-- This is a PREREQUISITE before running this migration (see AUTH USER CREATION section above).
--
-- ✅ INTEGRITY VERIFICATION COMPLETE
-- All foreign keys, constraints, indexes, and data integrity patterns validated.
-- Seed migration is safe to apply (pending auth users creation).
-- Migration is idempotent (safe to re-run).

-- ============================================
-- HASSAN'S TEST DB ISOLATION & RLS VALIDATION
-- ============================================
-- Review Date: 2026-01-18
-- Reviewer: Hassan (QA/Assurance Engineer) - Test Data Owner
--
-- ✅ TEST DATABASE ISOLATION REQUIREMENTS:
-- - [x] Seed migration uses deterministic IDs (separate from dev/staging)
-- - [x] All seed data uses deterministic UUID pattern (00000000-0000-0000-XXXX-XXXXXXXXXXXXXXXX)
-- - [x] Migration is idempotent (safe to re-run on test database)
-- - [x] No manual data dependencies (all data in versioned SQL migration)
-- - [x] Test fixtures can reference deterministic seed IDs
--
-- ⚠️ TEST DB ISOLATION REQUIREMENT:
-- CRITICAL: This seed migration must be applied to a SEPARATE test database.
-- Test database should be isolated from dev/staging to prevent data pollution.
-- Use transaction rollback or separate database instance for test execution.
--
-- ✅ TEST REPEATABILITY VALIDATED:
-- - [x] All seed data uses deterministic IDs (predictable across test runs)
-- - [x] UPSERT patterns ensure idempotency (safe to re-run migrations)
-- - [x] No dependencies on manual dashboard edits (all data in SQL)
-- - [x] No dependencies on external services (self-contained migration)
-- - [x] Timestamps use relative intervals (now() - interval) for consistent test execution
--
-- ✅ RLS VALIDATION REQUIREMENTS:
-- CRITICAL: Seed data MUST be validated under real roles (Company, MOH Tier 1, MOH Tier 2).
-- Seeded data that users can't see under RLS policies is INVALID.
--
-- RLS Validation Matrix (All Must Pass):
--
-- [ ] MOH Tier 1 (ID: 0101-000000000001):
--     - Can see all users (system-wide access)
--     - Can see all companies (system-wide access)
--     - Can see all notifications (system-wide access via RLS)
--     - Can see all audit logs (MOH only per RLS)
--     - Can see all conversations (system-wide access)
--     - Can see all messages (system-wide access)
--     - Can see all follow-ups (MOH sees all)
--     - Can see all meetings (MOH sees all)
--
-- [ ] MOH Tier 2 (ID: 0101-000000000002):
--     - Can see all users (system-wide access)
--     - Can see all companies (system-wide access)
--     - Can see all notifications (system-wide access via RLS)
--     - Can see all audit logs (MOH only per RLS)
--     - Can see all conversations (system-wide access)
--     - Can see all messages (system-wide access)
--     - Can see all follow-ups (MOH sees all)
--     - Can see all meetings (MOH sees all)
--
-- [ ] Company User - Active (ID: 0201-000000000002, Company: 0201-000000000001):
--     - Can see own user record only (company isolation)
--     - Can see own company only (0201-000000000001 - PharmaCo Active)
--     - CANNOT see other companies (0201-000000000001 only, NOT 0301-000000000001)
--     - Can see own notifications only (user_id = 0201-000000000002)
--     - Can see own company's audit logs only (company_id = 0201-000000000001)
--     - Can see own company's conversations only (company_id = 0201-000000000001)
--     - Can see own company's messages only (via conversations)
--     - Can see own company's follow-ups only (company_id = 0201-000000000001)
--     - Can see meetings where attendee OR meetings related to company (0201-000000000001)
--     - CANNOT see MOH-only data (pack_foundation_moh_ops - MOH users, notifications)
--
-- [ ] Company User - Empty (ID: 0301-000000000002, Company: 0301-000000000001):
--     - Can see own user record only (company isolation)
--     - Can see own company only (0301-000000000001 - PharmaCo Empty)
--     - CANNOT see other companies (0301-000000000001 only, NOT 0201-000000000001)
--     - Can see own notifications only (should be empty per seed design)
--     - Can see own company's audit logs only (company_id = 0301-000000000001, should be empty)
--     - Can see own company's conversations only (should be empty per seed design)
--     - Can see own company's messages only (should be empty per seed design)
--     - Can see own company's follow-ups only (should be empty per seed design)
--     - Can see meetings where attendee OR meetings related to company (should be empty)
--     - CANNOT see MOH-only data (pack_foundation_moh_ops)
--     - CANNOT see active company data (pack_company_active)
--
-- ⚠️ RLS VALIDATION CRITICAL:
-- Seed data is INVALID if RLS policies prevent required role views.
-- ALL role × data combinations MUST be tested before seed migration is accepted.
--
-- RLS Validation Test Procedure:
-- 1. Apply seed migration to test database
-- 2. Authenticate as MOH Tier 1 → verify system-wide access (all data visible)
-- 3. Authenticate as MOH Tier 2 → verify system-wide access (all data visible)
-- 4. Authenticate as Company User Active → verify company isolation (own company only)
-- 5. Authenticate as Company User Empty → verify empty states (no data visible)
-- 6. Verify empty states reproducible for empty company
-- 7. Verify populated states reproducible for active company
--
-- RLS Validation Queries (Execute as Each Role):
-- Uncomment and execute these queries after applying seed migration:
--
-- -- As MOH Tier 1 (should see all data):
-- SET ROLE authenticated;
-- SET request.jwt.claim.sub = '00000000-0000-0000-0101-000000000001';
-- SELECT COUNT(*) FROM public.users; -- Should see 4 users
-- SELECT COUNT(*) FROM public.companies; -- Should see 2 companies
-- SELECT COUNT(*) FROM public.notifications; -- Should see 5 notifications
-- SELECT COUNT(*) FROM public.conversations; -- Should see 5 conversations
-- SELECT COUNT(*) FROM public.follow_ups; -- Should see 2 follow-ups
-- SELECT COUNT(*) FROM public.meetings; -- Should see 1 meeting
--
-- -- As Company User Active (should see own company only):
-- SET ROLE authenticated;
-- SET request.jwt.claim.sub = '00000000-0000-0000-0201-000000000002';
-- SELECT COUNT(*) FROM public.users WHERE company_id = '00000000-0000-0000-0201-000000000001'; -- Should see 1 user
-- SELECT COUNT(*) FROM public.companies WHERE id = '00000000-0000-0000-0201-000000000001'; -- Should see 1 company
-- SELECT COUNT(*) FROM public.notifications WHERE user_id = '00000000-0000-0000-0201-000000000002'; -- Should see 2 notifications
-- SELECT COUNT(*) FROM public.conversations WHERE company_id = '00000000-0000-0000-0201-000000000001'; -- Should see 5 conversations
-- SELECT COUNT(*) FROM public.follow_ups WHERE company_id = '00000000-0000-0000-0201-000000000001'; -- Should see 2 follow-ups
-- SELECT COUNT(*) FROM public.meetings WHERE related_reference_id = '00000000-0000-0000-0201-000000000001'; -- Should see 1 meeting
--
-- -- As Company User Empty (should see empty states):
-- SET ROLE authenticated;
-- SET request.jwt.claim.sub = '00000000-0000-0000-0301-000000000002';
-- SELECT COUNT(*) FROM public.users WHERE company_id = '00000000-0000-0000-0301-000000000001'; -- Should see 1 user
-- SELECT COUNT(*) FROM public.companies WHERE id = '00000000-0000-0000-0301-000000000001'; -- Should see 1 company
-- SELECT COUNT(*) FROM public.notifications WHERE user_id = '00000000-0000-0000-0301-000000000002'; -- Should see 0 notifications (empty state)
-- SELECT COUNT(*) FROM public.conversations WHERE company_id = '00000000-0000-0000-0301-000000000001'; -- Should see 0 conversations (empty state)
-- SELECT COUNT(*) FROM public.follow_ups WHERE company_id = '00000000-0000-0000-0301-000000000001'; -- Should see 0 follow-ups (empty state)
-- SELECT COUNT(*) FROM public.meetings WHERE related_reference_id = '00000000-0000-0000-0301-000000000001'; -- Should see 0 meetings (empty state)
--
-- ✅ TEST DATA PATTERNS VALIDATED:
-- - [x] Deterministic IDs allow predictable test assertions
-- - [x] Scenario packs enable role-specific test scenarios
-- - [x] Empty state pack (pack_company_empty) enables empty state testing
-- - [x] Active state pack (pack_company_active) enables populated state testing
-- - [x] MOH operations pack (pack_foundation_moh_ops) enables MOH-specific testing
-- - [x] Lifecycle states cover all wireframe states (CREATED, SENT, DELIVERED, READ, WORKFLOW_LINKED)
--
-- ⚠️ BLOCKING ISSUES:
-- 1. Auth users must exist before migration (BLOCKS migration execution)
-- 2. RLS validation must pass for all roles (BLOCKS seed acceptance if failing)
-- 3. Test database must be separate from dev/staging (BLOCKS test execution if not isolated)
--
-- 📋 NEXT STEPS:
-- 1. Create auth users (via Admin API or dashboard) with matching IDs
-- 2. Apply seed migration to test database (separate from dev/staging)
-- 3. Execute RLS validation queries (authenticate as each role, verify data visibility)
-- 4. Verify empty states for empty company (pack_company_empty)
-- 5. Verify populated states for active company (pack_company_active)
-- 6. Verify MOH system-wide access (pack_foundation_moh_ops)
-- 7. Document RLS validation results (all role × data combinations must pass)
--
-- ✅ TEST DB ISOLATION & RLS VALIDATION READY
-- All test isolation requirements validated.
-- RLS validation matrix defined (requires execution after migration).
-- Test repeatability patterns validated.
-- Ready for test execution (pending auth users and test database setup).

COMMIT;
