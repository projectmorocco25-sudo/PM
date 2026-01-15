-- Migration: create_registry_submissions_and_submit_rpc
-- Description: Create registry_submissions table + RLS + initial submit RPC
-- Date: 2026-01-15
-- Author: Nadia, Rafi, Maya
-- Phase: 1.1.2
-- Tasks: 1.1.2.6, 1.1.2.6a
-- Reference: docs/02-architecture/workflow-architecture.md

BEGIN;

-- ============================
-- Table: registry_submissions
-- ============================

CREATE TABLE IF NOT EXISTS registry_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES companies(id) ON DELETE SET NULL, -- NULL for MOH submissions
  submission_type text NOT NULL CHECK (submission_type IN (
    'company_create','company_update','company_delete',
    'product_create','product_update','product_delete',
    'sku_create','sku_update','sku_delete'
  )),
  entity_type text NOT NULL CHECK (entity_type IN ('company','product','sku')),
  entity_id uuid,
  submission_data jsonb NOT NULL,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN (
    'draft','submitted','tier2_verified','tier2_peer_reviewed','tier1_approved','tier2_implemented','completed','rejected'
  )),
  submitted_by uuid NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  submitted_at timestamptz,
  verified_by uuid REFERENCES users(id) ON DELETE SET NULL,
  verified_at timestamptz,
  peer_reviewed_by uuid REFERENCES users(id) ON DELETE SET NULL,
  peer_reviewed_at timestamptz,
  approved_by uuid REFERENCES users(id) ON DELETE SET NULL,
  approved_at timestamptz,
  implemented_by uuid REFERENCES users(id) ON DELETE SET NULL,
  implemented_at timestamptz,
  rejection_reason text,
  rejection_iterations integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_registry_submissions_status ON registry_submissions(status);
CREATE INDEX IF NOT EXISTS idx_registry_submissions_submitted_by ON registry_submissions(submitted_by);
CREATE INDEX IF NOT EXISTS idx_registry_submissions_entity_type ON registry_submissions(entity_type);
CREATE INDEX IF NOT EXISTS idx_registry_submissions_company_id ON registry_submissions(company_id);

DROP TRIGGER IF EXISTS set_registry_submissions_updated_at ON registry_submissions;
CREATE TRIGGER set_registry_submissions_updated_at
BEFORE UPDATE ON registry_submissions
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ============================
-- RLS
-- ============================

ALTER TABLE registry_submissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "registry_submissions_select_moh_all" ON registry_submissions;
DROP POLICY IF EXISTS "registry_submissions_select_company_own" ON registry_submissions;
DROP POLICY IF EXISTS "registry_submissions_insert_company_or_moh" ON registry_submissions;
DROP POLICY IF EXISTS "registry_submissions_update_company_drafts" ON registry_submissions;
DROP POLICY IF EXISTS "registry_submissions_update_moh_all" ON registry_submissions;

CREATE POLICY "registry_submissions_select_moh_all"
ON registry_submissions
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM users u
    WHERE u.id = auth.uid()
      AND u.company_id IS NULL
      AND u.role IN ('tier1','tier2_officer','tier2_registrar','system_admin')
  )
);

CREATE POLICY "registry_submissions_select_company_own"
ON registry_submissions
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM users u
    WHERE u.id = auth.uid()
      AND u.company_id IS NOT NULL
      AND u.company_id = registry_submissions.company_id
      AND u.role IN ('company_admin','company_manager','company_user')
  )
);

CREATE POLICY "registry_submissions_insert_company_or_moh"
ON registry_submissions
FOR INSERT
WITH CHECK (
  submitted_by = auth.uid()
  AND (
    -- company user submits for own company
    (
      EXISTS (
        SELECT 1 FROM users u
        WHERE u.id = auth.uid()
          AND u.company_id IS NOT NULL
          AND u.company_id = registry_submissions.company_id
          AND u.role IN ('company_admin','company_manager','company_user')
      )
    )
    OR
    -- MOH users can submit system-wide (company_id may be NULL)
    (
      EXISTS (
        SELECT 1 FROM users u
        WHERE u.id = auth.uid()
          AND u.company_id IS NULL
          AND u.role IN ('tier1','tier2_officer','tier2_registrar','system_admin')
      )
    )
  )
);

-- Company users can only update their own draft/rejected submissions
CREATE POLICY "registry_submissions_update_company_drafts"
ON registry_submissions
FOR UPDATE
USING (
  submitted_by = auth.uid()
  AND status IN ('draft','rejected')
  AND EXISTS (
    SELECT 1 FROM users u
    WHERE u.id = auth.uid()
      AND u.company_id IS NOT NULL
      AND u.company_id = registry_submissions.company_id
      AND u.role IN ('company_admin','company_manager','company_user')
  )
)
WITH CHECK (
  submitted_by = auth.uid()
  AND status IN ('draft','rejected','submitted')
  AND EXISTS (
    SELECT 1 FROM users u
    WHERE u.id = auth.uid()
      AND u.company_id IS NOT NULL
      AND u.company_id = registry_submissions.company_id
      AND u.role IN ('company_admin','company_manager','company_user')
  )
);

-- MOH can update any submission
CREATE POLICY "registry_submissions_update_moh_all"
ON registry_submissions
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

-- ============================
-- RPC: submit registry update
-- ============================

CREATE OR REPLACE FUNCTION rmm_submit_registry_update(
  p_submission_id uuid DEFAULT NULL,
  p_company_id uuid DEFAULT NULL,
  p_submission_type text DEFAULT NULL,
  p_entity_type text DEFAULT NULL,
  p_entity_id uuid DEFAULT NULL,
  p_submission_data jsonb DEFAULT NULL,
  p_submit boolean DEFAULT true
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
  v_id uuid;
  v_old jsonb;
  v_row registry_submissions;
  v_to_status text;
BEGIN
  IF v_actor IS NULL THEN
    RETURN rmm_error('AUTHENTICATION_ERROR', 'Authentication required');
  END IF;

  SELECT role, company_id INTO v_role, v_actor_company FROM users WHERE id = v_actor;

  IF NOT shared_check_module_active('rmm') AND v_role NOT IN ('tier1','system_admin') THEN
    RETURN rmm_error('MODULE_NOT_ACTIVE', 'RMM module is not active');
  END IF;

  -- Create-or-update draft
  IF p_submission_id IS NULL THEN
    -- company users must submit for their own company
    IF v_actor_company IS NOT NULL THEN
      IF p_company_id IS NULL THEN
        p_company_id := v_actor_company;
      END IF;
      IF p_company_id <> v_actor_company THEN
        RETURN rmm_error('AUTHORIZATION_ERROR', 'You can only submit registry updates for your own company');
      END IF;
    END IF;

    IF p_submission_type IS NULL OR p_entity_type IS NULL OR p_submission_data IS NULL THEN
      RETURN rmm_error('VALIDATION_ERROR', 'Validation failed', jsonb_build_array(
        jsonb_build_object('field','submission_type','message','Submission type is required','code','MISSING_REQUIRED_FIELD'),
        jsonb_build_object('field','entity_type','message','Entity type is required','code','MISSING_REQUIRED_FIELD'),
        jsonb_build_object('field','submission_data','message','Submission data is required','code','MISSING_REQUIRED_FIELD')
      ));
    END IF;

    INSERT INTO registry_submissions (
      company_id,
      submission_type,
      entity_type,
      entity_id,
      submission_data,
      status,
      submitted_by
    ) VALUES (
      p_company_id,
      p_submission_type,
      p_entity_type,
      p_entity_id,
      p_submission_data,
      'draft',
      v_actor
    ) RETURNING id INTO v_id;

    PERFORM shared_create_audit_log(
      v_actor,
      'create',
      'registry_submissions',
      v_id,
      NULL,
      to_jsonb((SELECT rs FROM registry_submissions rs WHERE rs.id = v_id)),
      NULL,
      NULL,
      NULL
    );
  ELSE
    v_id := p_submission_id;
    SELECT * INTO v_row FROM registry_submissions WHERE id = v_id;
    IF NOT FOUND THEN
      RETURN rmm_error('NOT_FOUND', 'Registry submission not found');
    END IF;

    -- Company users can only edit their own draft/rejected submissions.
    IF v_actor_company IS NOT NULL AND v_row.submitted_by <> v_actor THEN
      RETURN rmm_error('AUTHORIZATION_ERROR', 'You can only edit your own registry submissions');
    END IF;

    IF v_row.status NOT IN ('draft','rejected') THEN
      RETURN rmm_error('BUSINESS_RULE_VIOLATION', 'Only draft/rejected submissions can be edited');
    END IF;

    v_old := to_jsonb(v_row);

    UPDATE registry_submissions
    SET submission_type = COALESCE(p_submission_type, submission_type),
        entity_type = COALESCE(p_entity_type, entity_type),
        entity_id = COALESCE(p_entity_id, entity_id),
        submission_data = COALESCE(p_submission_data, submission_data),
        updated_at = now()
    WHERE id = v_id;

    PERFORM shared_create_audit_log(
      v_actor,
      'update',
      'registry_submissions',
      v_id,
      v_old,
      to_jsonb((SELECT rs FROM registry_submissions rs WHERE rs.id = v_id)),
      NULL,
      NULL,
      NULL
    );
  END IF;

  -- Optionally submit (draft -> submitted)
  IF COALESCE(p_submit, true) THEN
    SELECT * INTO v_row FROM registry_submissions WHERE id = v_id;
    v_to_status := 'submitted';

    -- Determine MOH submission variant for validation (MOH if company_id is NULL)
    IF NOT rmm_registry_is_valid_transition(v_row.status, v_to_status, (v_row.company_id IS NULL)) THEN
      RETURN rmm_error('INVALID_STATUS_TRANSITION', 'Invalid status transition');
    END IF;

    v_old := to_jsonb(v_row);

    UPDATE registry_submissions
    SET status = v_to_status,
        submitted_at = now(),
        rejection_reason = NULL,
        updated_at = now()
    WHERE id = v_id;

    INSERT INTO approvals (submission_id, submission_type, from_status, to_status, approver_id, approval_type, comments)
    VALUES (v_id, 'registry', v_row.status, v_to_status, v_actor, 'submit', NULL);

    PERFORM shared_create_audit_log(
      v_actor,
      'update',
      'registry_submissions',
      v_id,
      v_old,
      to_jsonb((SELECT rs FROM registry_submissions rs WHERE rs.id = v_id)),
      NULL,
      NULL,
      NULL
    );
  END IF;

  RETURN jsonb_build_object('success', true, 'data', jsonb_build_object('id', v_id));
EXCEPTION
  WHEN others THEN
    RETURN rmm_error('SYSTEM_ERROR', 'An unexpected error occurred');
END;
$$;

COMMIT;

