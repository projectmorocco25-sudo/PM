-- Migration: create_follow_ups_rpc_functions
-- Description: Follow-up RPCs (create/update/list/get/complete)
-- Date: 2025-01-12
-- Author: Nadia
-- Phase: 1.1.1
-- Task: 1.1.1.10b
-- Depends on: governance tables + RLS policies + shared_create_audit_log

BEGIN;

-- Create follow-up assignment (MOH Tier 1/2 only)
CREATE OR REPLACE FUNCTION follow_ups_create(
  p_company_id uuid,
  p_assigned_to uuid,
  p_priority text DEFAULT 'normal',
  p_due_date date,
  p_issue_type text,
  p_issue_reference_id uuid DEFAULT NULL,
  p_issue_reference_table text DEFAULT NULL,
  p_notes text DEFAULT NULL
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

  INSERT INTO follow_ups (
    company_id,
    assigned_to,
    priority,
    due_date,
    issue_type,
    issue_reference_id,
    issue_reference_table,
    notes,
    created_by
  ) VALUES (
    p_company_id,
    p_assigned_to,
    p_priority,
    p_due_date,
    p_issue_type,
    p_issue_reference_id,
    p_issue_reference_table,
    p_notes,
    v_actor
  ) RETURNING id INTO v_id;

  PERFORM shared_create_audit_log(
    v_actor,
    'follow_up_created',
    'follow_ups',
    v_id,
    NULL,
    to_jsonb((SELECT f FROM follow_ups f WHERE f.id = v_id)),
    NULL,
    NULL,
    NULL
  );

  RETURN v_id;
END;
$$;

-- Update follow-up details (MOH Tier 1/2 only)
CREATE OR REPLACE FUNCTION follow_ups_update(
  p_follow_up_id uuid,
  p_assigned_to uuid DEFAULT NULL,
  p_priority text DEFAULT NULL,
  p_due_date date DEFAULT NULL,
  p_notes text DEFAULT NULL,
  p_status text DEFAULT NULL
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

  SELECT to_jsonb(f) INTO v_old FROM follow_ups f WHERE f.id = p_follow_up_id;
  IF v_old IS NULL THEN
    RAISE EXCEPTION 'follow_up not found';
  END IF;

  UPDATE follow_ups
  SET assigned_to = COALESCE(p_assigned_to, assigned_to),
      priority = COALESCE(p_priority, priority),
      due_date = COALESCE(p_due_date, due_date),
      notes = COALESCE(p_notes, notes),
      status = COALESCE(p_status, status),
      updated_at = now()
  WHERE id = p_follow_up_id;

  PERFORM shared_create_audit_log(
    v_actor,
    'follow_up_updated',
    'follow_ups',
    p_follow_up_id,
    v_old,
    to_jsonb((SELECT f FROM follow_ups f WHERE f.id = p_follow_up_id)),
    NULL,
    NULL,
    NULL
  );

  RETURN p_follow_up_id;
END;
$$;

-- List follow-ups (MOH: all; company users: company-scoped; assigned users: assigned_to)
CREATE OR REPLACE FUNCTION follow_ups_list(
  p_company_id uuid DEFAULT NULL,
  p_assigned_to uuid DEFAULT NULL,
  p_status text DEFAULT NULL,
  p_limit integer DEFAULT 50,
  p_offset integer DEFAULT 0
)
RETURNS SETOF follow_ups
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
    FROM follow_ups f
    WHERE (p_company_id IS NULL OR f.company_id = p_company_id)
      AND (p_assigned_to IS NULL OR f.assigned_to = p_assigned_to)
      AND (p_status IS NULL OR f.status = p_status)
    ORDER BY f.due_date ASC, f.priority DESC, f.created_at DESC
    LIMIT LEAST(GREATEST(p_limit, 1), 500)
    OFFSET GREATEST(p_offset, 0);
  END IF;

  -- Company users: company-scoped + optionally include assignments to self
  RETURN QUERY
  SELECT *
  FROM follow_ups f
  WHERE (
      (v_company IS NOT NULL AND f.company_id = v_company)
      OR f.assigned_to = v_actor
    )
    AND (p_status IS NULL OR f.status = p_status)
  ORDER BY f.due_date ASC, f.priority DESC, f.created_at DESC
  LIMIT LEAST(GREATEST(p_limit, 1), 500)
  OFFSET GREATEST(p_offset, 0);
END;
$$;

-- Get single follow-up by ID
CREATE OR REPLACE FUNCTION follow_ups_get(
  p_follow_up_id uuid
)
RETURNS follow_ups
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_actor uuid := auth.uid();
  v_role text;
  v_company uuid;
  v_row follow_ups;
BEGIN
  SELECT role, company_id INTO v_role, v_company FROM users WHERE id = v_actor;

  SELECT * INTO v_row FROM follow_ups WHERE id = p_follow_up_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'follow_up not found';
  END IF;

  IF v_role IN ('moh_tier1','moh_tier2_officer','moh_tier2_registrar','system_admin') THEN
    RETURN v_row;
  END IF;

  IF (v_company IS NOT NULL AND v_row.company_id = v_company) OR v_row.assigned_to = v_actor THEN
    RETURN v_row;
  END IF;

  RAISE EXCEPTION 'not authorized';
END;
$$;

-- Complete follow-up (MOH Tier 1/2 or assigned_to)
CREATE OR REPLACE FUNCTION follow_ups_complete(
  p_follow_up_id uuid
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
  v_assigned uuid;
BEGIN
  SELECT role INTO v_role FROM users WHERE id = v_actor;
  SELECT assigned_to INTO v_assigned FROM follow_ups WHERE id = p_follow_up_id;
  IF v_assigned IS NULL THEN
    RAISE EXCEPTION 'follow_up not found';
  END IF;

  IF v_role NOT IN ('moh_tier1','moh_tier2_officer','system_admin') AND v_assigned <> v_actor THEN
    RAISE EXCEPTION 'not authorized';
  END IF;

  SELECT to_jsonb(f) INTO v_old FROM follow_ups f WHERE f.id = p_follow_up_id;

  UPDATE follow_ups
  SET status = 'completed',
      completed_at = now(),
      completed_by = v_actor,
      updated_at = now()
  WHERE id = p_follow_up_id;

  PERFORM shared_create_audit_log(
    v_actor,
    'follow_up_completed',
    'follow_ups',
    p_follow_up_id,
    v_old,
    to_jsonb((SELECT f FROM follow_ups f WHERE f.id = p_follow_up_id)),
    NULL,
    NULL,
    NULL
  );

  RETURN p_follow_up_id;
END;
$$;

COMMIT;

