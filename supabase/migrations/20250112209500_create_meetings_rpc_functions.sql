-- Migration: create_meetings_rpc_functions
-- Description: Meetings RPCs (create/update/list/get/cancel/complete)
-- Date: 2025-01-12
-- Author: Nadia
-- Phase: 1.1.1
-- Task: 1.1.1.10c
-- Depends on: governance tables + meeting_attendees + shared_create_audit_log

BEGIN;

CREATE OR REPLACE FUNCTION meetings_create(
  p_title text,
  p_meeting_type text,
  p_scheduled_at timestamptz,
  p_location text DEFAULT NULL,
  p_agenda text DEFAULT NULL,
  p_reason text DEFAULT NULL,
  p_related_reference_id uuid DEFAULT NULL,
  p_related_reference_table text DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_id uuid;
  v_actor uuid := auth.uid();
  v_role text;
BEGIN
  SELECT role INTO v_role FROM users WHERE id = v_actor;
  IF v_role NOT IN ('moh_tier1','moh_tier2_officer','system_admin') THEN
    RAISE EXCEPTION 'not authorized';
  END IF;

  INSERT INTO meetings (
    title,
    meeting_type,
    scheduled_at,
    location,
    agenda,
    reason,
    related_reference_id,
    related_reference_table,
    created_by
  ) VALUES (
    p_title,
    p_meeting_type,
    p_scheduled_at,
    p_location,
    p_agenda,
    p_reason,
    p_related_reference_id,
    p_related_reference_table,
    v_actor
  ) RETURNING id INTO v_id;

  PERFORM shared_create_audit_log(
    v_actor,
    'meeting_created',
    'meetings',
    v_id,
    NULL,
    to_jsonb((SELECT m FROM meetings m WHERE m.id = v_id)),
    NULL,
    NULL,
    NULL
  );

  RETURN v_id;
END;
$$;

CREATE OR REPLACE FUNCTION meetings_update(
  p_meeting_id uuid,
  p_title text DEFAULT NULL,
  p_scheduled_at timestamptz DEFAULT NULL,
  p_location text DEFAULT NULL,
  p_agenda text DEFAULT NULL,
  p_reason text DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_actor uuid := auth.uid();
  v_role text;
  v_old jsonb;
BEGIN
  SELECT role INTO v_role FROM users WHERE id = v_actor;
  IF v_role NOT IN ('moh_tier1','moh_tier2_officer','system_admin') THEN
    RAISE EXCEPTION 'not authorized';
  END IF;

  SELECT to_jsonb(m) INTO v_old FROM meetings m WHERE m.id = p_meeting_id;
  IF v_old IS NULL THEN
    RAISE EXCEPTION 'meeting not found';
  END IF;

  UPDATE meetings
  SET title = COALESCE(p_title, title),
      scheduled_at = COALESCE(p_scheduled_at, scheduled_at),
      location = COALESCE(p_location, location),
      agenda = COALESCE(p_agenda, agenda),
      reason = COALESCE(p_reason, reason),
      updated_at = now()
  WHERE id = p_meeting_id;

  PERFORM shared_create_audit_log(
    v_actor,
    'meeting_updated',
    'meetings',
    p_meeting_id,
    v_old,
    to_jsonb((SELECT m FROM meetings m WHERE m.id = p_meeting_id)),
    NULL,
    NULL,
    NULL
  );

  RETURN p_meeting_id;
END;
$$;

-- List meetings (MOH: all; company: meetings they attend or linked to their company)
CREATE OR REPLACE FUNCTION meetings_list(
  p_status text DEFAULT NULL,
  p_from timestamptz DEFAULT NULL,
  p_to timestamptz DEFAULT NULL,
  p_limit integer DEFAULT 50,
  p_offset integer DEFAULT 0
)
RETURNS SETOF meetings
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_actor uuid := auth.uid();
  v_role text;
  v_company uuid;
BEGIN
  SELECT role, company_id INTO v_role, v_company FROM users WHERE id = v_actor;

  IF v_role IN ('moh_tier1','moh_tier2_officer','moh_tier2_registrar','system_admin') THEN
    RETURN QUERY
    SELECT *
    FROM meetings m
    WHERE (p_status IS NULL OR m.status = p_status)
      AND (p_from IS NULL OR m.scheduled_at >= p_from)
      AND (p_to IS NULL OR m.scheduled_at <= p_to)
    ORDER BY m.scheduled_at ASC
    LIMIT LEAST(GREATEST(p_limit, 1), 500)
    OFFSET GREATEST(p_offset, 0);
  END IF;

  RETURN QUERY
  SELECT DISTINCT m.*
  FROM meetings m
  LEFT JOIN meeting_attendees ma ON ma.meeting_id = m.id
  WHERE (p_status IS NULL OR m.status = p_status)
    AND (p_from IS NULL OR m.scheduled_at >= p_from)
    AND (p_to IS NULL OR m.scheduled_at <= p_to)
    AND (
      ma.user_id = v_actor
      OR (v_company IS NOT NULL AND m.related_reference_table = 'companies' AND m.related_reference_id = v_company)
    )
  ORDER BY m.scheduled_at ASC
  LIMIT LEAST(GREATEST(p_limit, 1), 500)
  OFFSET GREATEST(p_offset, 0);
END;
$$;

-- Get meeting with attendees (role-based access)
CREATE OR REPLACE FUNCTION meetings_get(
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

  RETURN jsonb_build_object(
    'meeting', to_jsonb(v_meeting),
    'attendees', COALESCE(
      (
        SELECT jsonb_agg(
          jsonb_build_object(
            'user_id', ma.user_id,
            'attendance_status', ma.attendance_status,
            'responded_at', ma.responded_at,
            'calendar_invite_sent', ma.calendar_invite_sent
          )
        )
        FROM meeting_attendees ma
        WHERE ma.meeting_id = v_meeting.id
      ),
      '[]'::jsonb
    )
  );
END;
$$;

CREATE OR REPLACE FUNCTION meetings_cancel(
  p_meeting_id uuid
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_actor uuid := auth.uid();
  v_role text;
  v_old jsonb;
BEGIN
  SELECT role INTO v_role FROM users WHERE id = v_actor;
  IF v_role NOT IN ('moh_tier1','moh_tier2_officer','system_admin') THEN
    RAISE EXCEPTION 'not authorized';
  END IF;

  SELECT to_jsonb(m) INTO v_old FROM meetings m WHERE m.id = p_meeting_id;
  IF v_old IS NULL THEN
    RAISE EXCEPTION 'meeting not found';
  END IF;

  UPDATE meetings
  SET status = 'cancelled',
      cancelled_at = now(),
      cancelled_by = v_actor,
      updated_at = now()
  WHERE id = p_meeting_id;

  PERFORM shared_create_audit_log(
    v_actor,
    'meeting_cancelled',
    'meetings',
    p_meeting_id,
    v_old,
    to_jsonb((SELECT m FROM meetings m WHERE m.id = p_meeting_id)),
    NULL,
    NULL,
    NULL
  );

  RETURN p_meeting_id;
END;
$$;

CREATE OR REPLACE FUNCTION meetings_complete(
  p_meeting_id uuid
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_actor uuid := auth.uid();
  v_role text;
  v_old jsonb;
BEGIN
  SELECT role INTO v_role FROM users WHERE id = v_actor;
  IF v_role NOT IN ('moh_tier1','moh_tier2_officer','system_admin') THEN
    RAISE EXCEPTION 'not authorized';
  END IF;

  SELECT to_jsonb(m) INTO v_old FROM meetings m WHERE m.id = p_meeting_id;
  IF v_old IS NULL THEN
    RAISE EXCEPTION 'meeting not found';
  END IF;

  UPDATE meetings
  SET status = 'completed',
      updated_at = now()
  WHERE id = p_meeting_id;

  PERFORM shared_create_audit_log(
    v_actor,
    'meeting_completed',
    'meetings',
    p_meeting_id,
    v_old,
    to_jsonb((SELECT m FROM meetings m WHERE m.id = p_meeting_id)),
    NULL,
    NULL,
    NULL
  );

  RETURN p_meeting_id;
END;
$$;

COMMIT;

