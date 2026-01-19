-- Migration: Create governance tables (follow_ups, meetings, meeting_attendees)
-- Date: 2026-01-17
-- Task: 1.1.1.2e
-- Author: Sami (Implementation Compliance Specialist)
-- Phase 0.6 Addition: New tables for governance follow-up tracking and meeting scheduling
-- Note: company_id foreign keys will be added in Task 1.1.1.7 when companies table is created

BEGIN;

-- Create follow_ups table
-- Note: company_id FK will be added when companies table is created
CREATE TABLE IF NOT EXISTS public.follow_ups (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id uuid NOT NULL, -- FK to companies.id will be added later
    assigned_to uuid NOT NULL REFERENCES public.users(id) ON DELETE RESTRICT,
    priority text NOT NULL DEFAULT 'normal' CHECK (priority IN ('normal', 'high', 'extreme')),
    due_date date NOT NULL,
    issue_type text NOT NULL,
    issue_reference_id uuid,
    issue_reference_table text,
    notes text,
    status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
    completed_at timestamptz,
    completed_by uuid REFERENCES public.users(id) ON DELETE SET NULL,
    created_by uuid NOT NULL REFERENCES public.users(id) ON DELETE RESTRICT,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    CHECK (
        (completed_at IS NULL AND completed_by IS NULL) OR
        (completed_at IS NOT NULL AND completed_by IS NOT NULL)
    ),
    CHECK (
        issue_reference_table IS NULL OR
        issue_reference_table IN (
            'aams_submissions', 'msq_submissions', 'wsl_submissions',
            'breaches', 'enforcement_actions', 'compliance_scores',
            'registry_submissions', 'export_requests', 'disputes'
        )
    )
);

COMMENT ON TABLE public.follow_ups IS 'Track follow-up assignments for governance actions';
COMMENT ON COLUMN public.follow_ups.company_id IS 'Company ID - FK to companies.id will be added when companies table is created';
COMMENT ON COLUMN public.follow_ups.issue_type IS 'Issue type: submission_overdue, compliance_violation, threshold_breach, enforcement_action, etc.';
COMMENT ON COLUMN public.follow_ups.issue_reference_id IS 'Reference to specific issue (submission_id, breach_id, enforcement_action_id, etc.)';
COMMENT ON COLUMN public.follow_ups.issue_reference_table IS 'Table name of issue reference for polymorphic relationship';

-- Create meetings table
CREATE TABLE IF NOT EXISTS public.meetings (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title text NOT NULL,
    meeting_type text NOT NULL CHECK (meeting_type IN ('emergency', 'scheduled', 'follow_up')),
    scheduled_at timestamptz NOT NULL,
    location text,
    agenda text,
    reason text,
    related_reference_id uuid,
    related_reference_table text,
    status text NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'cancelled', 'completed')),
    cancelled_at timestamptz,
    cancelled_by uuid REFERENCES public.users(id) ON DELETE SET NULL,
    created_by uuid NOT NULL REFERENCES public.users(id) ON DELETE RESTRICT,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    CHECK (
        (cancelled_at IS NULL AND cancelled_by IS NULL) OR
        (cancelled_at IS NOT NULL AND cancelled_by IS NOT NULL)
    ),
    CHECK (
        related_reference_table IS NULL OR
        related_reference_table IN (
            'companies', 'aams_submissions', 'msq_submissions', 'wsl_submissions',
            'breaches', 'enforcement_actions', 'compliance_scores',
            'registry_submissions', 'export_requests', 'disputes', 'follow_ups'
        )
    )
);

COMMENT ON TABLE public.meetings IS 'Schedule and track governance meetings';
COMMENT ON COLUMN public.meetings.meeting_type IS 'Meeting type: emergency (urgent), scheduled (regular), follow_up (follow-up on issue)';
COMMENT ON COLUMN public.meetings.reason IS 'Reason for meeting (e.g., "Submission Compliance Below Threshold", "Emergency Breach Review")';
COMMENT ON COLUMN public.meetings.related_reference_id IS 'Related entity ID (company_id, submission_id, breach_id, etc.)';
COMMENT ON COLUMN public.meetings.related_reference_table IS 'Table name of related entity for polymorphic relationship';

-- Create meeting_attendees table
CREATE TABLE IF NOT EXISTS public.meeting_attendees (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    meeting_id uuid NOT NULL REFERENCES public.meetings(id) ON DELETE CASCADE,
    user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    attendance_status text NOT NULL DEFAULT 'invited' CHECK (attendance_status IN ('invited', 'accepted', 'declined', 'attended')),
    calendar_invite_sent boolean NOT NULL DEFAULT false,
    responded_at timestamptz,
    created_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE (meeting_id, user_id)
);

COMMENT ON TABLE public.meeting_attendees IS 'Track meeting attendees';
COMMENT ON COLUMN public.meeting_attendees.attendance_status IS 'Status: invited (default), accepted, declined, attended (marked after meeting)';
COMMENT ON COLUMN public.meeting_attendees.calendar_invite_sent IS 'Whether calendar invite (iCal) has been sent to attendee';

-- Create indexes for follow_ups table
CREATE INDEX IF NOT EXISTS idx_follow_ups_company_id ON public.follow_ups (company_id);
CREATE INDEX IF NOT EXISTS idx_follow_ups_assigned_to ON public.follow_ups (assigned_to);
CREATE INDEX IF NOT EXISTS idx_follow_ups_due_date ON public.follow_ups (due_date);
CREATE INDEX IF NOT EXISTS idx_follow_ups_status ON public.follow_ups (status);
CREATE INDEX IF NOT EXISTS idx_follow_ups_priority ON public.follow_ups (priority);
CREATE INDEX IF NOT EXISTS idx_follow_ups_active_priority ON public.follow_ups (status, priority, due_date)
WHERE status IN ('pending', 'in_progress');
CREATE INDEX IF NOT EXISTS idx_follow_ups_issue_reference ON public.follow_ups (issue_reference_table, issue_reference_id)
WHERE issue_reference_id IS NOT NULL;

-- Create indexes for meetings table
CREATE INDEX IF NOT EXISTS idx_meetings_scheduled_at ON public.meetings (scheduled_at);
CREATE INDEX IF NOT EXISTS idx_meetings_status ON public.meetings (status);
CREATE INDEX IF NOT EXISTS idx_meetings_meeting_type ON public.meetings (meeting_type);
CREATE INDEX IF NOT EXISTS idx_meetings_upcoming ON public.meetings (scheduled_at, status)
WHERE status = 'scheduled';
CREATE INDEX IF NOT EXISTS idx_meetings_related_reference ON public.meetings (related_reference_table, related_reference_id)
WHERE related_reference_id IS NOT NULL;

-- Create indexes for meeting_attendees table
CREATE INDEX IF NOT EXISTS idx_meeting_attendees_meeting_id ON public.meeting_attendees (meeting_id);
CREATE INDEX IF NOT EXISTS idx_meeting_attendees_user_id ON public.meeting_attendees (user_id);
CREATE INDEX IF NOT EXISTS idx_meeting_attendees_status ON public.meeting_attendees (attendance_status);
CREATE INDEX IF NOT EXISTS idx_meeting_attendees_pending ON public.meeting_attendees (meeting_id, attendance_status)
WHERE attendance_status = 'invited' AND responded_at IS NULL;

-- Add updated_at triggers
CREATE TRIGGER set_follow_ups_updated_at
BEFORE UPDATE ON public.follow_ups
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER set_meetings_updated_at
BEFORE UPDATE ON public.meetings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable Row Level Security on all tables
ALTER TABLE public.follow_ups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meeting_attendees ENABLE ROW LEVEL SECURITY;

COMMIT;
