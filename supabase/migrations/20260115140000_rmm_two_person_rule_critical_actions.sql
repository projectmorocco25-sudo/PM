-- Migration: rmm_two_person_rule_critical_actions
-- Description: Two-person rule workflow for critical actions (company suspension/deletion approvals, critical medicine designation/removal)
-- Date: 2026-01-15
-- Author: Fatima, Maya, Rafi
-- Phase: 1.1.2
-- Task: 1.1.2.15

BEGIN;

-- Helper
CREATE OR REPLACE FUNCTION rmm_two_person_rule_ok(p_requestor uuid, p_approver uuid)
RETURNS boolean
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT p_requestor IS NOT NULL AND p_approver IS NOT NULL AND p_requestor <> p_approver;
$$;

-- ============================
-- Company suspension requests
-- ============================

CREATE TABLE IF NOT EXISTS company_suspension_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  requested_by uuid NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  requested_at timestamptz NOT NULL DEFAULT now(),
  approved_by uuid REFERENCES users(id) ON DELETE SET NULL,
  approved_at timestamptz,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
  justification text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_company_suspension_requests_company_id ON company_suspension_requests(company_id);
CREATE INDEX IF NOT EXISTS idx_company_suspension_requests_status ON company_suspension_requests(status);

DROP TRIGGER IF EXISTS set_company_suspension_requests_updated_at ON company_suspension_requests;
CREATE TRIGGER set_company_suspension_requests_updated_at
BEFORE UPDATE ON company_suspension_requests
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE company_suspension_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "csr_select_moh_all" ON company_suspension_requests;
DROP POLICY IF EXISTS "csr_insert_moh_only" ON company_suspension_requests;
DROP POLICY IF EXISTS "csr_update_tier1_only" ON company_suspension_requests;

CREATE POLICY "csr_select_moh_all"
ON company_suspension_requests
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM users u
    WHERE u.id = auth.uid()
      AND u.company_id IS NULL
      AND u.role IN ('tier1','tier2_officer','tier2_registrar','system_admin')
  )
);

CREATE POLICY "csr_insert_moh_only"
ON company_suspension_requests
FOR INSERT
WITH CHECK (
  requested_by = auth.uid()
  AND EXISTS (
    SELECT 1 FROM users u
    WHERE u.id = auth.uid()
      AND u.company_id IS NULL
      AND u.role IN ('tier1','tier2_officer','system_admin')
  )
);

CREATE POLICY "csr_update_tier1_only"
ON company_suspension_requests
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM users u
    WHERE u.id = auth.uid()
      AND u.company_id IS NULL
      AND u.role IN ('tier1','system_admin')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users u
    WHERE u.id = auth.uid()
      AND u.company_id IS NULL
      AND u.role IN ('tier1','system_admin')
  )
);

CREATE OR REPLACE FUNCTION rmm_request_company_suspension(
  p_company_id uuid,
  p_justification text
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
  v_id uuid;
BEGIN
  IF v_actor IS NULL THEN
    RETURN rmm_error('AUTHENTICATION_ERROR', 'Authentication required');
  END IF;
  SELECT role INTO v_role FROM users WHERE id = v_actor;
  IF v_role NOT IN ('tier1','tier2_officer','system_admin') THEN
    RETURN rmm_error('AUTHORIZATION_ERROR', 'MOH permission required');
  END IF;
  IF p_justification IS NULL OR length(trim(p_justification)) < 10 THEN
    RETURN rmm_error('VALIDATION_ERROR', 'Validation failed');
  END IF;
  PERFORM 1 FROM companies c WHERE c.id = p_company_id;
  IF NOT FOUND THEN
    RETURN rmm_error('NOT_FOUND', 'Company not found');
  END IF;

  INSERT INTO company_suspension_requests (company_id, requested_by, justification)
  VALUES (p_company_id, v_actor, rmm_sanitize_text(p_justification, 4000))
  RETURNING id INTO v_id;

  PERFORM shared_create_audit_log(v_actor, 'create', 'company_suspension_requests', v_id, NULL, to_jsonb((SELECT r FROM company_suspension_requests r WHERE r.id=v_id)), NULL, NULL, NULL);
  RETURN jsonb_build_object('success', true, 'data', jsonb_build_object('id', v_id));
EXCEPTION
  WHEN others THEN
    RETURN rmm_error('SYSTEM_ERROR', 'An unexpected error occurred');
END;
$$;

CREATE OR REPLACE FUNCTION rmm_approve_company_suspension(
  p_request_id uuid,
  p_approval_notes text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_actor uuid := auth.uid();
  v_role text;
  v_row company_suspension_requests;
  v_old jsonb;
BEGIN
  IF v_actor IS NULL THEN
    RETURN rmm_error('AUTHENTICATION_ERROR', 'Authentication required');
  END IF;
  SELECT role INTO v_role FROM users WHERE id = v_actor;
  IF v_role NOT IN ('tier1','system_admin') THEN
    RETURN rmm_error('AUTHORIZATION_ERROR', 'Tier 1 permission required');
  END IF;

  SELECT * INTO v_row FROM company_suspension_requests WHERE id = p_request_id;
  IF NOT FOUND THEN
    RETURN rmm_error('NOT_FOUND', 'Suspension request not found');
  END IF;
  IF v_row.status <> 'pending' THEN
    RETURN rmm_error('BUSINESS_RULE_VIOLATION', 'Request is not pending');
  END IF;
  IF NOT rmm_two_person_rule_ok(v_row.requested_by, v_actor) THEN
    RETURN rmm_error('BUSINESS_RULE_VIOLATION', 'Two-person rule violated (approver cannot be requestor)');
  END IF;

  v_old := to_jsonb(v_row);

  -- Approve + execute suspension immediately
  UPDATE company_suspension_requests
  SET status = 'approved',
      approved_by = v_actor,
      approved_at = now(),
      updated_at = now()
  WHERE id = p_request_id;

  UPDATE companies
  SET is_active = false,
      suspended_at = now(),
      suspended_by = v_actor,
      suspended_reason = COALESCE(rmm_sanitize_text(p_approval_notes, 4000), v_row.justification),
      updated_at = now()
  WHERE id = v_row.company_id;

  PERFORM shared_create_audit_log(v_actor, 'approve', 'company_suspension_requests', p_request_id, v_old, to_jsonb((SELECT r FROM company_suspension_requests r WHERE r.id=p_request_id)), NULL, NULL, NULL);
  PERFORM shared_create_audit_log(v_actor, 'suspend', 'companies', v_row.company_id, NULL, to_jsonb((SELECT c FROM companies c WHERE c.id=v_row.company_id)), v_row.justification, NULL, NULL);

  RETURN jsonb_build_object('success', true, 'data', jsonb_build_object('id', p_request_id, 'status', 'approved'));
EXCEPTION
  WHEN others THEN
    RETURN rmm_error('SYSTEM_ERROR', 'An unexpected error occurred');
END;
$$;

-- ============================
-- Deletion approval (two-person) for deletion_requests
-- ============================

CREATE OR REPLACE FUNCTION rmm_approve_soft_delete(
  p_request_id uuid,
  p_approval_notes text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_actor uuid := auth.uid();
  v_role text;
  v_actor_company uuid;
  v_row deletion_requests;
  v_old jsonb;
BEGIN
  IF v_actor IS NULL THEN
    RETURN rmm_error('AUTHENTICATION_ERROR', 'Authentication required');
  END IF;
  SELECT role, company_id INTO v_role, v_actor_company FROM users WHERE id = v_actor;
  IF v_actor_company IS NOT NULL OR v_role NOT IN ('tier1','system_admin') THEN
    RETURN rmm_error('AUTHORIZATION_ERROR', 'Tier 1 permission required');
  END IF;

  SELECT * INTO v_row FROM deletion_requests WHERE id = p_request_id;
  IF NOT FOUND THEN
    RETURN rmm_error('NOT_FOUND', 'Deletion request not found');
  END IF;
  IF v_row.status <> 'pending' THEN
    RETURN rmm_error('BUSINESS_RULE_VIOLATION', 'Request is not pending');
  END IF;
  IF NOT rmm_two_person_rule_ok(v_row.requested_by, v_actor) THEN
    RETURN rmm_error('BUSINESS_RULE_VIOLATION', 'Two-person rule violated (approver cannot be requestor)');
  END IF;

  v_old := to_jsonb(v_row);

  UPDATE deletion_requests
  SET approved_by = v_actor,
      approved_at = now(),
      updated_at = now()
  WHERE id = p_request_id;

  PERFORM shared_create_audit_log(v_actor, 'approve', 'deletion_requests', p_request_id, v_old, to_jsonb((SELECT dr FROM deletion_requests dr WHERE dr.id=p_request_id)), rmm_sanitize_text(p_approval_notes, 2000), NULL, NULL);

  RETURN jsonb_build_object('success', true, 'data', jsonb_build_object('id', p_request_id));
EXCEPTION
  WHEN others THEN
    RETURN rmm_error('SYSTEM_ERROR', 'An unexpected error occurred');
END;
$$;

-- ============================
-- Critical medicine change requests (two-person)
-- ============================

CREATE TABLE IF NOT EXISTS critical_medicine_change_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sku_id uuid NOT NULL REFERENCES skus(id) ON DELETE CASCADE,
  desired_active boolean NOT NULL,
  requested_by uuid NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  requested_at timestamptz NOT NULL DEFAULT now(),
  approved_by uuid REFERENCES users(id) ON DELETE SET NULL,
  approved_at timestamptz,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
  justification text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_cmcr_sku_id ON critical_medicine_change_requests(sku_id);
CREATE INDEX IF NOT EXISTS idx_cmcr_status ON critical_medicine_change_requests(status);

DROP TRIGGER IF EXISTS set_critical_medicine_change_requests_updated_at ON critical_medicine_change_requests;
CREATE TRIGGER set_critical_medicine_change_requests_updated_at
BEFORE UPDATE ON critical_medicine_change_requests
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE critical_medicine_change_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "cmcr_select_moh_all" ON critical_medicine_change_requests;
DROP POLICY IF EXISTS "cmcr_insert_moh_only" ON critical_medicine_change_requests;
DROP POLICY IF EXISTS "cmcr_update_tier1_only" ON critical_medicine_change_requests;

CREATE POLICY "cmcr_select_moh_all"
ON critical_medicine_change_requests
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM users u
    WHERE u.id = auth.uid()
      AND u.company_id IS NULL
      AND u.role IN ('tier1','tier2_officer','tier2_registrar','system_admin')
  )
);

CREATE POLICY "cmcr_insert_moh_only"
ON critical_medicine_change_requests
FOR INSERT
WITH CHECK (
  requested_by = auth.uid()
  AND EXISTS (
    SELECT 1 FROM users u
    WHERE u.id = auth.uid()
      AND u.company_id IS NULL
      AND u.role IN ('tier1','tier2_officer','system_admin')
  )
);

CREATE POLICY "cmcr_update_tier1_only"
ON critical_medicine_change_requests
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM users u
    WHERE u.id = auth.uid()
      AND u.company_id IS NULL
      AND u.role IN ('tier1','system_admin')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users u
    WHERE u.id = auth.uid()
      AND u.company_id IS NULL
      AND u.role IN ('tier1','system_admin')
  )
);

CREATE OR REPLACE FUNCTION rmm_request_critical_medicine_change(
  p_sku_id uuid,
  p_desired_active boolean,
  p_justification text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_actor uuid := auth.uid();
  v_role text;
  v_id uuid;
BEGIN
  IF v_actor IS NULL THEN
    RETURN rmm_error('AUTHENTICATION_ERROR', 'Authentication required');
  END IF;
  SELECT role INTO v_role FROM users WHERE id = v_actor;
  IF v_role NOT IN ('tier1','tier2_officer','system_admin') THEN
    RETURN rmm_error('AUTHORIZATION_ERROR', 'MOH permission required');
  END IF;
  IF p_justification IS NULL OR length(trim(p_justification)) < 10 THEN
    RETURN rmm_error('VALIDATION_ERROR', 'Validation failed');
  END IF;
  PERFORM 1 FROM skus s WHERE s.id = p_sku_id;
  IF NOT FOUND THEN
    RETURN rmm_error('NOT_FOUND', 'SKU not found');
  END IF;

  INSERT INTO critical_medicine_change_requests (sku_id, desired_active, requested_by, justification)
  VALUES (p_sku_id, p_desired_active, v_actor, rmm_sanitize_text(p_justification, 4000))
  RETURNING id INTO v_id;

  PERFORM shared_create_audit_log(v_actor, 'create', 'critical_medicine_change_requests', v_id, NULL, to_jsonb((SELECT r FROM critical_medicine_change_requests r WHERE r.id=v_id)), NULL, NULL, NULL);
  RETURN jsonb_build_object('success', true, 'data', jsonb_build_object('id', v_id));
EXCEPTION
  WHEN others THEN
    RETURN rmm_error('SYSTEM_ERROR', 'An unexpected error occurred');
END;
$$;

CREATE OR REPLACE FUNCTION rmm_approve_critical_medicine_change(
  p_request_id uuid,
  p_approval_notes text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_actor uuid := auth.uid();
  v_role text;
  v_row critical_medicine_change_requests;
  v_old jsonb;
  v_cm_id uuid;
BEGIN
  IF v_actor IS NULL THEN
    RETURN rmm_error('AUTHENTICATION_ERROR', 'Authentication required');
  END IF;
  SELECT role INTO v_role FROM users WHERE id = v_actor;
  IF v_role NOT IN ('tier1','system_admin') THEN
    RETURN rmm_error('AUTHORIZATION_ERROR', 'Tier 1 permission required');
  END IF;

  SELECT * INTO v_row FROM critical_medicine_change_requests WHERE id = p_request_id;
  IF NOT FOUND THEN
    RETURN rmm_error('NOT_FOUND', 'Request not found');
  END IF;
  IF v_row.status <> 'pending' THEN
    RETURN rmm_error('BUSINESS_RULE_VIOLATION', 'Request is not pending');
  END IF;
  IF NOT rmm_two_person_rule_ok(v_row.requested_by, v_actor) THEN
    RETURN rmm_error('BUSINESS_RULE_VIOLATION', 'Two-person rule violated (approver cannot be requestor)');
  END IF;

  v_old := to_jsonb(v_row);

  UPDATE critical_medicine_change_requests
  SET status = 'approved',
      approved_by = v_actor,
      approved_at = now(),
      updated_at = now()
  WHERE id = p_request_id;

  -- Apply change to critical_medicines
  INSERT INTO critical_medicines (sku_id, designated_by, is_active)
  VALUES (v_row.sku_id, v_actor, v_row.desired_active)
  ON CONFLICT (sku_id) DO UPDATE
    SET is_active = EXCLUDED.is_active,
        updated_at = now()
  RETURNING id INTO v_cm_id;

  PERFORM shared_create_audit_log(v_actor, 'approve', 'critical_medicine_change_requests', p_request_id, v_old, to_jsonb((SELECT r FROM critical_medicine_change_requests r WHERE r.id=p_request_id)), rmm_sanitize_text(p_approval_notes, 2000), NULL, NULL);
  PERFORM shared_create_audit_log(v_actor, 'update', 'critical_medicines', v_cm_id, NULL, to_jsonb((SELECT cm FROM critical_medicines cm WHERE cm.id=v_cm_id)), v_row.justification, NULL, NULL);

  RETURN jsonb_build_object('success', true, 'data', jsonb_build_object('id', p_request_id, 'critical_medicine_id', v_cm_id));
EXCEPTION
  WHEN others THEN
    RETURN rmm_error('SYSTEM_ERROR', 'An unexpected error occurred');
END;
$$;

COMMIT;

