-- Migration: rmm_soft_delete_safeguards
-- Description: Soft delete safeguards: deletion request workflow + pending period + reversal
-- Date: 2026-01-15
-- Author: Nadia, Maya
-- Phase: 1.1.2
-- Task: 1.1.2.14

BEGIN;

CREATE TABLE IF NOT EXISTS deletion_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES companies(id) ON DELETE SET NULL,
  entity_table text NOT NULL CHECK (entity_table IN ('companies','products','skus')),
  entity_id uuid NOT NULL,
  requested_by uuid NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  requested_at timestamptz NOT NULL DEFAULT now(),
  approved_by uuid REFERENCES users(id) ON DELETE SET NULL,
  approved_at timestamptz,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','executed','reversed','cancelled')),
  execute_after timestamptz NOT NULL,
  executed_by uuid REFERENCES users(id) ON DELETE SET NULL,
  executed_at timestamptz,
  reason text NOT NULL,
  reversal_reason text,
  reversed_by uuid REFERENCES users(id) ON DELETE SET NULL,
  reversed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_deletion_requests_company_id ON deletion_requests(company_id);
CREATE INDEX IF NOT EXISTS idx_deletion_requests_entity ON deletion_requests(entity_table, entity_id);
CREATE INDEX IF NOT EXISTS idx_deletion_requests_status ON deletion_requests(status);
CREATE INDEX IF NOT EXISTS idx_deletion_requests_execute_after ON deletion_requests(execute_after);

DROP TRIGGER IF EXISTS set_deletion_requests_updated_at ON deletion_requests;
CREATE TRIGGER set_deletion_requests_updated_at
BEFORE UPDATE ON deletion_requests
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE deletion_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "deletion_requests_select_moh_all" ON deletion_requests;
DROP POLICY IF EXISTS "deletion_requests_select_company_own" ON deletion_requests;
DROP POLICY IF EXISTS "deletion_requests_insert_company_or_moh" ON deletion_requests;
DROP POLICY IF EXISTS "deletion_requests_update_moh_only" ON deletion_requests;

CREATE POLICY "deletion_requests_select_moh_all"
ON deletion_requests
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM users u
    WHERE u.id = auth.uid()
      AND u.company_id IS NULL
      AND u.role IN ('tier1','tier2_officer','tier2_registrar','system_admin')
  )
);

CREATE POLICY "deletion_requests_select_company_own"
ON deletion_requests
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM users u
    WHERE u.id = auth.uid()
      AND u.company_id IS NOT NULL
      AND u.company_id = deletion_requests.company_id
      AND u.role IN ('company_admin','company_manager','company_user')
  )
);

CREATE POLICY "deletion_requests_insert_company_or_moh"
ON deletion_requests
FOR INSERT
WITH CHECK (
  requested_by = auth.uid()
  AND (
    EXISTS (
      SELECT 1 FROM users u
      WHERE u.id = auth.uid()
        AND u.company_id IS NULL
        AND u.role IN ('tier1','tier2_officer','tier2_registrar','system_admin')
    )
    OR
    EXISTS (
      SELECT 1 FROM users u
      WHERE u.id = auth.uid()
        AND u.company_id IS NOT NULL
        AND u.company_id = deletion_requests.company_id
        AND u.role IN ('company_admin','company_manager','company_user')
    )
  )
);

CREATE POLICY "deletion_requests_update_moh_only"
ON deletion_requests
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM users u
    WHERE u.id = auth.uid()
      AND u.company_id IS NULL
      AND u.role IN ('tier1','tier2_officer','tier2_registrar','system_admin')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users u
    WHERE u.id = auth.uid()
      AND u.company_id IS NULL
      AND u.role IN ('tier1','tier2_officer','tier2_registrar','system_admin')
  )
);

-- RPC: create deletion request with pending period (default 7 days)
CREATE OR REPLACE FUNCTION rmm_request_soft_delete(
  p_entity_table text,
  p_entity_id uuid,
  p_reason text,
  p_pending_days integer DEFAULT 7
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
  v_company_id uuid;
  v_id uuid;
BEGIN
  IF v_actor IS NULL THEN
    RETURN rmm_error('AUTHENTICATION_ERROR', 'Authentication required');
  END IF;
  SELECT role, company_id INTO v_role, v_actor_company FROM users WHERE id = v_actor;

  IF p_entity_table NOT IN ('companies','products','skus') THEN
    RETURN rmm_error('VALIDATION_ERROR', 'Validation failed', jsonb_build_array(jsonb_build_object(
      'field','entity_table','message','Invalid entity table','code','INVALID_VALUE'
    )));
  END IF;
  IF p_reason IS NULL OR length(trim(p_reason)) < 10 THEN
    RETURN rmm_error('VALIDATION_ERROR', 'Validation failed', jsonb_build_array(jsonb_build_object(
      'field','reason','message','Reason is required (min 10 chars)','code','MISSING_REQUIRED_FIELD'
    )));
  END IF;

  -- Resolve company_id for scoping
  IF p_entity_table = 'companies' THEN
    SELECT id INTO v_company_id FROM companies WHERE id = p_entity_id;
  ELSIF p_entity_table = 'products' THEN
    SELECT company_id INTO v_company_id FROM products WHERE id = p_entity_id;
  ELSE
    SELECT p.company_id INTO v_company_id
    FROM skus s JOIN products p ON p.id = s.product_id
    WHERE s.id = p_entity_id;
  END IF;

  IF v_company_id IS NULL THEN
    RETURN rmm_error('NOT_FOUND', 'Entity not found');
  END IF;

  -- Company users can only request delete for their own company entities
  IF v_actor_company IS NOT NULL AND v_actor_company <> v_company_id THEN
    RETURN rmm_error('AUTHORIZATION_ERROR', 'You can only request deletion for your own company entities');
  END IF;

  INSERT INTO deletion_requests (
    company_id,
    entity_table,
    entity_id,
    requested_by,
    execute_after,
    reason
  ) VALUES (
    v_company_id,
    p_entity_table,
    p_entity_id,
    v_actor,
    now() + make_interval(days => GREATEST(COALESCE(p_pending_days, 7), 1)),
    rmm_sanitize_text(p_reason, 4000)
  ) RETURNING id INTO v_id;

  PERFORM shared_create_audit_log(
    v_actor,
    'create',
    'deletion_requests',
    v_id,
    NULL,
    to_jsonb((SELECT dr FROM deletion_requests dr WHERE dr.id = v_id)),
    NULL,
    NULL,
    NULL
  );

  RETURN jsonb_build_object('success', true, 'data', jsonb_build_object('id', v_id));
EXCEPTION
  WHEN others THEN
    RETURN rmm_error('SYSTEM_ERROR', 'An unexpected error occurred');
END;
$$;

-- RPC: reverse/cancel a pending delete request (Tier 1 only, or requester before execution)
CREATE OR REPLACE FUNCTION rmm_reverse_soft_delete(
  p_request_id uuid,
  p_reversal_reason text
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

  IF p_reversal_reason IS NULL OR length(trim(p_reversal_reason)) < 10 THEN
    RETURN rmm_error('VALIDATION_ERROR', 'Validation failed');
  END IF;

  SELECT * INTO v_row FROM deletion_requests WHERE id = p_request_id;
  IF NOT FOUND THEN
    RETURN rmm_error('NOT_FOUND', 'Deletion request not found');
  END IF;

  v_old := to_jsonb(v_row);

  -- Company requester can reverse only if still pending and before execution
  IF v_actor_company IS NOT NULL THEN
    IF v_row.status <> 'pending' OR v_row.requested_by <> v_actor THEN
      RETURN rmm_error('AUTHORIZATION_ERROR', 'You can only reverse your own pending deletion requests');
    END IF;
  ELSE
    -- MOH: Tier 1 required
    IF v_role NOT IN ('tier1','system_admin') THEN
      RETURN rmm_error('AUTHORIZATION_ERROR', 'Tier 1 permission required');
    END IF;
  END IF;

  UPDATE deletion_requests
  SET status = 'reversed',
      reversal_reason = rmm_sanitize_text(p_reversal_reason, 4000),
      reversed_by = v_actor,
      reversed_at = now(),
      updated_at = now()
  WHERE id = p_request_id;

  PERFORM shared_create_audit_log(
    v_actor,
    'update',
    'deletion_requests',
    p_request_id,
    v_old,
    to_jsonb((SELECT dr FROM deletion_requests dr WHERE dr.id = p_request_id)),
    NULL,
    NULL,
    NULL
  );

  RETURN jsonb_build_object('success', true, 'data', jsonb_build_object('id', p_request_id, 'status', 'reversed'));
EXCEPTION
  WHEN others THEN
    RETURN rmm_error('SYSTEM_ERROR', 'An unexpected error occurred');
END;
$$;

COMMIT;

