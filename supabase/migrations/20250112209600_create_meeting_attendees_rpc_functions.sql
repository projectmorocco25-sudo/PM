-- Migration: create_meeting_attendees_rpc_functions
-- Description: Meeting attendees RPCs (add/remove/list)
-- Date: 2025-01-12
-- Author: Nadia
-- Phase: 1.1.1
-- Task: 1.1.1.10d
-- Depends on: meetings RPC + meeting_attendees RLS

BEGIN;

CREATE OR REPLACE FUNCTION meeting_attendees_add(
  p_meeting_id uuid,
  p_user_id uuid
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_actor uuid := auth.uid();
  v_role text;
  v_id uuid;
BEGIN
  SELECT role INTO v_role FROM users WHERE id = v_actor;
  IF v_role NOT IN ('moh_tier1','moh_tier2_officer','system_admin') THEN
    RAISE EXCEPTION 'not authorized';
  END IF;

  -- ensure meeting exists
  PERFORM 1 FROM meetings WHERE id = p_meeting_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'meeting not found';
  END IF;

  INSERT INTO meeting_attendees (meeting_id, user_id)
  VALUES (p_meeting_id, p_user_id)
  ON CONFLICT (meeting_id, user_id) DO UPDATE SET meeting_id = EXCLUDED.meeting_id
  RETURNING id INTO v_id;

  PERFORM shared_create_audit_log(
    v_actor,
    'meeting_attendee_added',
    'meeting_attendees',
    v_id,
    NULL,
    to_jsonb((SELECT ma FROM meeting_attendees ma WHERE ma.id = v_id)),
    NULL,
    NULL,
    NULL
  );

  RETURN v_id;
END;
$$;

CREATE OR REPLACE FUNCTION meeting_attendees_remove(
  p_meeting_id uuid,
  p_user_id uuid
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_actor uuid := auth.uid();
  v_role text;
  v_old jsonb;
  v_id uuid;
BEGIN
  SELECT role INTO v_role FROM users WHERE id = v_actor;
  IF v_role NOT IN ('moh_tier1','moh_tier2_officer','system_admin') THEN
    RAISE EXCEPTION 'not authorized';
  END IF;

  SELECT id, to_jsonb(ma) INTO v_id, v_old
  FROM meeting_attendees ma
  WHERE ma.meeting_id = p_meeting_id AND ma.user_id = p_user_id;

  IF v_id IS NULL THEN
    RETURN false;
  END IF;

  DELETE FROM meeting_attendees WHERE id = v_id;

  PERFORM shared_create_audit_log(
    v_actor,
    'meeting_attendee_removed',
    'meeting_attendees',
    v_id,
    v_old,
    NULL,
    NULL,
    NULL,
    NULL
  );

  RETURN true;
END;
$$;

-- List attendees for a meeting (inherit meeting access permissions)
CREATE OR REPLACE FUNCTION meeting_attendees_list(
  p_meeting_id uuid
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_actor uuid := auth.uid();
  v_role text;
  v_company uuid;
  v_meeting meetings;
  v_can_view boolean := false;
BEGIN
  SELECT role, company_id INTO v_role, v_company FROM users WHERE id = v_actor;
  SELECT * INTO v_meeting FROM meetings WHERE id = p_meeting_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'meeting not found';
  END IF;

  IF v_role IN ('moh_tier1','moh_tier2_officer','moh_tier2_registrar','system_admin') THEN
    v_can_view := true;
  ELSE
    SELECT EXISTS (
      SELECT 1 FROM meeting_attendees ma
      WHERE ma.meeting_id = v_meeting.id AND ma.user_id = v_actor
    ) INTO v_can_view;

    IF NOT v_can_view AND v_company IS NOT NULL THEN
      v_can_view := (v_meeting.related_reference_table = 'companies' AND v_meeting.related_reference_id = v_company);
    END IF;
  END IF;

  IF NOT v_can_view THEN
    RAISE EXCEPTION 'not authorized';
  END IF;

  RETURN COALESCE(
    (
      SELECT jsonb_agg(
        jsonb_build_object(
          'user_id', ma.user_id,
          'attendance_status', ma.attendance_status,
          'responded_at', ma.responded_at,
          'calendar_invite_sent', ma.calendar_invite_sent,
          'created_at', ma.created_at
        )
      )
      FROM meeting_attendees ma
      WHERE ma.meeting_id = p_meeting_id
    ),
    '[]'::jsonb
  );
END;
$$;

COMMIT;

