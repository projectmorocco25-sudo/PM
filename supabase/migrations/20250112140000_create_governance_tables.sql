-- Migration: create_governance_tables
-- Description: Create governance tables (follow_ups, meetings, meeting_attendees)
-- Date: 2025-01-12
-- Author: Nadia
-- Phase: 1.1.1
-- Task: 1.1.1.2e
-- Related: schema-design.md, schema-updates-phase0-6-critical-gaps.md (Changes 4, 5, 6)
-- Depends on: 20250112120000_create_core_tables (users table)
-- Note: companies table foreign key will be added when companies table is created (RMM module)

BEGIN;

-- Create follow_ups table
-- Note: company_id foreign key constraint will be added when companies table exists
CREATE TABLE IF NOT EXISTS follow_ups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL, -- REFERENCES companies(id) ON DELETE CASCADE - will be added when companies table exists
  assigned_to uuid NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  priority text NOT NULL DEFAULT 'normal' CHECK (priority IN ('normal', 'high', 'extreme')),
  due_date date NOT NULL,
  issue_type text NOT NULL,
  issue_reference_id uuid,
  issue_reference_table text,
  notes text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  completed_at timestamptz,
  completed_by uuid REFERENCES users(id) ON DELETE SET NULL,
  created_by uuid NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT check_follow_ups_reference_table CHECK (
    issue_reference_table IS NULL OR
    issue_reference_table IN (
      'aams_submissions', 'msq_submissions', 'wsl_submissions',
      'breaches', 'enforcement_actions', 'compliance_scores',
      'registry_submissions', 'export_requests', 'disputes'
    )
  ),
  CONSTRAINT check_follow_ups_completed CHECK (
    (completed_at IS NULL AND completed_by IS NULL) OR
    (completed_at IS NOT NULL AND completed_by IS NOT NULL)
  )
);

COMMENT ON TABLE follow_ups IS 'Track follow-up assignments for governance actions';
COMMENT ON COLUMN follow_ups.issue_type IS 'Issue type: submission_overdue, compliance_violation, threshold_breach, enforcement_action, etc.';
COMMENT ON COLUMN follow_ups.issue_reference_id IS 'Reference to specific issue (submission_id, breach_id, enforcement_action_id, etc.)';
COMMENT ON COLUMN follow_ups.issue_reference_table IS 'Table name of issue reference for polymorphic relationship';

-- Create indexes for follow_ups table
CREATE INDEX IF NOT EXISTS idx_follow_ups_company_id ON follow_ups(company_id);
CREATE INDEX IF NOT EXISTS idx_follow_ups_assigned_to ON follow_ups(assigned_to);
CREATE INDEX IF NOT EXISTS idx_follow_ups_due_date ON follow_ups(due_date);
CREATE INDEX IF NOT EXISTS idx_follow_ups_status ON follow_ups(status);
CREATE INDEX IF NOT EXISTS idx_follow_ups_priority ON follow_ups(priority);
CREATE INDEX IF NOT EXISTS idx_follow_ups_active_priority ON follow_ups(status, priority, due_date) WHERE status IN ('pending', 'in_progress');
CREATE INDEX IF NOT EXISTS idx_follow_ups_issue_reference ON follow_ups(issue_reference_table, issue_reference_id) WHERE issue_reference_id IS NOT NULL;

-- Create meetings table
CREATE TABLE IF NOT EXISTS meetings (
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
  cancelled_by uuid REFERENCES users(id) ON DELETE SET NULL,
  created_by uuid NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT check_meetings_cancelled CHECK (
    (cancelled_at IS NULL AND cancelled_by IS NULL) OR
    (cancelled_at IS NOT NULL AND cancelled_by IS NOT NULL)
  ),
  CONSTRAINT check_meetings_reference_table CHECK (
    related_reference_table IS NULL OR
    related_reference_table IN (
      'companies', 'aams_submissions', 'msq_submissions', 'wsl_submissions',
      'breaches', 'enforcement_actions', 'compliance_scores',
      'registry_submissions', 'export_requests', 'disputes', 'follow_ups'
    )
  )
);

COMMENT ON TABLE meetings IS 'Schedule and track governance meetings';
COMMENT ON COLUMN meetings.meeting_type IS 'Meeting type: emergency (urgent), scheduled (regular), follow_up (follow-up on issue)';
COMMENT ON COLUMN meetings.reason IS 'Reason for meeting (e.g., "Submission Compliance Below Threshold", "Emergency Breach Review")';
COMMENT ON COLUMN meetings.related_reference_id IS 'Related entity ID (company_id, submission_id, breach_id, etc.)';
COMMENT ON COLUMN meetings.related_reference_table IS 'Table name of related entity for polymorphic relationship';

-- Create indexes for meetings table
CREATE INDEX IF NOT EXISTS idx_meetings_scheduled_at ON meetings(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_meetings_status ON meetings(status);
CREATE INDEX IF NOT EXISTS idx_meetings_meeting_type ON meetings(meeting_type);
CREATE INDEX IF NOT EXISTS idx_meetings_upcoming ON meetings(scheduled_at, status) WHERE status = 'scheduled' AND scheduled_at >= now();
CREATE INDEX IF NOT EXISTS idx_meetings_related_reference ON meetings(related_reference_table, related_reference_id) WHERE related_reference_id IS NOT NULL;

-- Create meeting_attendees table
CREATE TABLE IF NOT EXISTS meeting_attendees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_id uuid NOT NULL REFERENCES meetings(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  attendance_status text NOT NULL DEFAULT 'invited' CHECK (attendance_status IN ('invited', 'accepted', 'declined', 'attended')),
  calendar_invite_sent boolean NOT NULL DEFAULT false,
  responded_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (meeting_id, user_id)
);

COMMENT ON TABLE meeting_attendees IS 'Track meeting attendees';
COMMENT ON COLUMN meeting_attendees.attendance_status IS 'Status: invited (default), accepted, declined, attended (marked after meeting)';
COMMENT ON COLUMN meeting_attendees.calendar_invite_sent IS 'Whether calendar invite (iCal) has been sent to attendee';

-- Create indexes for meeting_attendees table
CREATE INDEX IF NOT EXISTS idx_meeting_attendees_meeting_id ON meeting_attendees(meeting_id);
CREATE INDEX IF NOT EXISTS idx_meeting_attendees_user_id ON meeting_attendees(user_id);
CREATE INDEX IF NOT EXISTS idx_meeting_attendees_status ON meeting_attendees(attendance_status);
CREATE INDEX IF NOT EXISTS idx_meeting_attendees_pending ON meeting_attendees(meeting_id, attendance_status) WHERE attendance_status = 'invited' AND responded_at IS NULL;

-- Create triggers for updated_at
CREATE TRIGGER set_follow_ups_updated_at
BEFORE UPDATE ON follow_ups
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_meetings_updated_at
BEFORE UPDATE ON meetings
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

COMMIT;

-- Rollback Migration
-- BEGIN;
-- 
-- DROP TRIGGER IF EXISTS set_meetings_updated_at ON meetings;
-- DROP TRIGGER IF EXISTS set_follow_ups_updated_at ON follow_ups;
-- 
-- DROP INDEX IF EXISTS idx_meeting_attendees_pending;
-- DROP INDEX IF EXISTS idx_meeting_attendees_status;
-- DROP INDEX IF EXISTS idx_meeting_attendees_user_id;
-- DROP INDEX IF EXISTS idx_meeting_attendees_meeting_id;
-- DROP TABLE IF EXISTS meeting_attendees;
-- 
-- DROP INDEX IF EXISTS idx_meetings_related_reference;
-- DROP INDEX IF EXISTS idx_meetings_upcoming;
-- DROP INDEX IF EXISTS idx_meetings_meeting_type;
-- DROP INDEX IF EXISTS idx_meetings_status;
-- DROP INDEX IF EXISTS idx_meetings_scheduled_at;
-- DROP TABLE IF EXISTS meetings;
-- 
-- DROP INDEX IF EXISTS idx_follow_ups_issue_reference;
-- DROP INDEX IF EXISTS idx_follow_ups_active_priority;
-- DROP INDEX IF EXISTS idx_follow_ups_priority;
-- DROP INDEX IF EXISTS idx_follow_ups_status;
-- DROP INDEX IF EXISTS idx_follow_ups_due_date;
-- DROP INDEX IF EXISTS idx_follow_ups_assigned_to;
-- DROP INDEX IF EXISTS idx_follow_ups_company_id;
-- DROP TABLE IF EXISTS follow_ups;
-- 
-- COMMIT;
