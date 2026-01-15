-- Migration: fix_role_tokens_in_policies_and_rpc
-- Description: Align RLS policies + governance RPC role checks to users.role enum (tier1/tier2_*/company_*)
-- Date: 2026-01-15
-- Author: Nadia, Rafi, Maya
-- Phase: 1.1.x (hardening)
-- Notes:
-- - Earlier migrations referenced legacy role tokens (moh_tier*, ipc_*, wholesaler_*) which are NOT in users.role CHECK constraint.
-- - This migration updates policies and governance RPC role checks to the canonical roles created in 20250112120000_create_core_tables.sql.

BEGIN;

-- ============================================
-- RMM TABLES: fix role tokens in policies
-- ============================================

-- companies
DROP POLICY IF EXISTS "companies_select_moh_all" ON companies;
DROP POLICY IF EXISTS "companies_select_company_own" ON companies;
DROP POLICY IF EXISTS "companies_insert_moh" ON companies;
DROP POLICY IF EXISTS "companies_update_moh" ON companies;
DROP POLICY IF EXISTS "companies_delete_system_admin" ON companies;

CREATE POLICY "companies_select_moh_all"
ON companies
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM users u
    WHERE u.id = auth.uid()
      AND u.company_id IS NULL
      AND u.role IN ('tier1','tier2_officer','tier2_registrar','system_admin')
  )
);

CREATE POLICY "companies_select_company_own"
ON companies
FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM users u
    WHERE u.id = auth.uid()
      AND u.company_id = companies.id
      AND u.role IN ('company_admin','company_manager','company_user')
  )
);

CREATE POLICY "companies_insert_moh"
ON companies
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users u
    WHERE u.id = auth.uid()
      AND u.company_id IS NULL
      AND u.role IN ('tier1','tier2_registrar','system_admin')
  )
);

CREATE POLICY "companies_update_moh"
ON companies
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM users u
    WHERE u.id = auth.uid()
      AND u.company_id IS NULL
      AND u.role IN ('tier1','tier2_registrar','system_admin')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users u
    WHERE u.id = auth.uid()
      AND u.company_id IS NULL
      AND (
        u.role IN ('tier1','system_admin')
        OR (
          u.role = 'tier2_registrar'
          AND companies.is_active = true
          AND companies.suspended_at IS NULL
        )
      )
  )
);

CREATE POLICY "companies_delete_system_admin"
ON companies
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM users u
    WHERE u.id = auth.uid()
      AND u.role = 'system_admin'
  )
);

-- products
DROP POLICY IF EXISTS "products_select_moh_all" ON products;
DROP POLICY IF EXISTS "products_select_company_own" ON products;
DROP POLICY IF EXISTS "products_insert_company_own" ON products;
DROP POLICY IF EXISTS "products_update_company_own" ON products;
DROP POLICY IF EXISTS "products_update_moh_all" ON products;

CREATE POLICY "products_select_moh_all"
ON products
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM users u
    WHERE u.id = auth.uid()
      AND u.company_id IS NULL
      AND u.role IN ('tier1','tier2_officer','tier2_registrar','system_admin')
  )
);

CREATE POLICY "products_select_company_own"
ON products
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM users u
    WHERE u.id = auth.uid()
      AND u.company_id = products.company_id
      AND u.role IN ('company_admin','company_manager','company_user')
  )
);

CREATE POLICY "products_insert_company_own"
ON products
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users u
    WHERE u.id = auth.uid()
      AND (
        (u.role IN ('company_admin','company_manager','company_user') AND u.company_id = products.company_id)
        OR (u.company_id IS NULL AND u.role IN ('tier1','tier2_registrar','system_admin'))
      )
  )
);

CREATE POLICY "products_update_company_own"
ON products
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM users u
    WHERE u.id = auth.uid()
      AND u.role IN ('company_admin','company_manager','company_user')
      AND u.company_id = products.company_id
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users u
    WHERE u.id = auth.uid()
      AND u.role IN ('company_admin','company_manager','company_user')
      AND u.company_id = products.company_id
  )
);

CREATE POLICY "products_update_moh_all"
ON products
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM users u
    WHERE u.id = auth.uid()
      AND u.company_id IS NULL
      AND u.role IN ('tier1','tier2_registrar','system_admin')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users u
    WHERE u.id = auth.uid()
      AND u.company_id IS NULL
      AND u.role IN ('tier1','tier2_registrar','system_admin')
  )
);

-- skus
DROP POLICY IF EXISTS "skus_select_moh_all" ON skus;
DROP POLICY IF EXISTS "skus_select_company_own" ON skus;
DROP POLICY IF EXISTS "skus_insert_company_own" ON skus;
DROP POLICY IF EXISTS "skus_update_company_own" ON skus;
DROP POLICY IF EXISTS "skus_update_moh_all" ON skus;

CREATE POLICY "skus_select_moh_all"
ON skus
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM users u
    WHERE u.id = auth.uid()
      AND u.company_id IS NULL
      AND u.role IN ('tier1','tier2_officer','tier2_registrar','system_admin')
  )
);

CREATE POLICY "skus_select_company_own"
ON skus
FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM users u
    JOIN products p ON p.id = skus.product_id
    WHERE u.id = auth.uid()
      AND u.company_id = p.company_id
      AND u.role IN ('company_admin','company_manager','company_user')
  )
);

CREATE POLICY "skus_insert_company_own"
ON skus
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM users u
    JOIN products p ON p.id = skus.product_id
    WHERE u.id = auth.uid()
      AND (
        (u.role IN ('company_admin','company_manager','company_user') AND u.company_id = p.company_id)
        OR (u.company_id IS NULL AND u.role IN ('tier1','tier2_registrar','system_admin'))
      )
  )
);

CREATE POLICY "skus_update_company_own"
ON skus
FOR UPDATE
USING (
  EXISTS (
    SELECT 1
    FROM users u
    JOIN products p ON p.id = skus.product_id
    WHERE u.id = auth.uid()
      AND u.role IN ('company_admin','company_manager','company_user')
      AND u.company_id = p.company_id
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM users u
    JOIN products p ON p.id = skus.product_id
    WHERE u.id = auth.uid()
      AND u.role IN ('company_admin','company_manager','company_user')
      AND u.company_id = p.company_id
  )
);

CREATE POLICY "skus_update_moh_all"
ON skus
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM users u
    WHERE u.id = auth.uid()
      AND u.company_id IS NULL
      AND u.role IN ('tier1','tier2_registrar','system_admin')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users u
    WHERE u.id = auth.uid()
      AND u.company_id IS NULL
      AND u.role IN ('tier1','tier2_registrar','system_admin')
  )
);

-- atc_codes: readable by all authenticated; write by MOH only
DROP POLICY IF EXISTS "atc_codes_select_all_authed" ON atc_codes;
DROP POLICY IF EXISTS "atc_codes_write_moh_only" ON atc_codes;

CREATE POLICY "atc_codes_select_all_authed"
ON atc_codes
FOR SELECT
USING (auth.uid() IS NOT NULL);

CREATE POLICY "atc_codes_write_moh_only"
ON atc_codes
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM users u
    WHERE u.id = auth.uid()
      AND u.company_id IS NULL
      AND u.role IN ('tier1','tier2_registrar','system_admin')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users u
    WHERE u.id = auth.uid()
      AND u.company_id IS NULL
      AND u.role IN ('tier1','tier2_registrar','system_admin')
  )
);

-- critical_medicines: MOH Tier 1 only (strict)
DROP POLICY IF EXISTS "critical_medicines_all_tier1_only" ON critical_medicines;

CREATE POLICY "critical_medicines_all_tier1_only"
ON critical_medicines
FOR ALL
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

-- ============================================
-- VCI TABLES: fix role tokens in policies
-- ============================================

-- aams_submissions
DROP POLICY IF EXISTS "aams_select_moh_all" ON aams_submissions;
DROP POLICY IF EXISTS "aams_select_company_own" ON aams_submissions;
DROP POLICY IF EXISTS "aams_insert_company_own" ON aams_submissions;
DROP POLICY IF EXISTS "aams_update_company_own" ON aams_submissions;
DROP POLICY IF EXISTS "aams_update_moh_all" ON aams_submissions;

CREATE POLICY "aams_select_moh_all"
ON aams_submissions
FOR SELECT
USING (
  EXISTS (SELECT 1 FROM users u WHERE u.id=auth.uid() AND u.company_id IS NULL AND u.role IN ('tier1','tier2_officer','tier2_registrar','system_admin'))
);

CREATE POLICY "aams_select_company_own"
ON aams_submissions
FOR SELECT
USING (
  EXISTS (SELECT 1 FROM users u WHERE u.id=auth.uid() AND u.company_id=aams_submissions.company_id AND u.role IN ('company_admin','company_manager','company_user'))
);

CREATE POLICY "aams_insert_company_own"
ON aams_submissions
FOR INSERT
WITH CHECK (
  EXISTS (SELECT 1 FROM users u WHERE u.id=auth.uid() AND u.company_id=aams_submissions.company_id AND u.role IN ('company_admin','company_manager','company_user'))
  OR EXISTS (SELECT 1 FROM users u WHERE u.id=auth.uid() AND u.company_id IS NULL AND u.role IN ('tier1','tier2_registrar','system_admin'))
);

CREATE POLICY "aams_update_company_own"
ON aams_submissions
FOR UPDATE
USING (
  EXISTS (SELECT 1 FROM users u WHERE u.id=auth.uid() AND u.company_id=aams_submissions.company_id AND u.role IN ('company_admin','company_manager','company_user'))
)
WITH CHECK (
  EXISTS (SELECT 1 FROM users u WHERE u.id=auth.uid() AND u.company_id=aams_submissions.company_id AND u.role IN ('company_admin','company_manager','company_user'))
);

CREATE POLICY "aams_update_moh_all"
ON aams_submissions
FOR UPDATE
USING (
  EXISTS (SELECT 1 FROM users u WHERE u.id=auth.uid() AND u.company_id IS NULL AND u.role IN ('tier1','tier2_officer','tier2_registrar','system_admin'))
)
WITH CHECK (
  EXISTS (SELECT 1 FROM users u WHERE u.id=auth.uid() AND u.company_id IS NULL AND u.role IN ('tier1','tier2_officer','tier2_registrar','system_admin'))
);

-- msq_submissions
DROP POLICY IF EXISTS "msq_select_moh_all" ON msq_submissions;
DROP POLICY IF EXISTS "msq_select_company_own" ON msq_submissions;
DROP POLICY IF EXISTS "msq_insert_company_own" ON msq_submissions;
DROP POLICY IF EXISTS "msq_update_company_own" ON msq_submissions;
DROP POLICY IF EXISTS "msq_update_moh_all" ON msq_submissions;

CREATE POLICY "msq_select_moh_all"
ON msq_submissions
FOR SELECT
USING (
  EXISTS (SELECT 1 FROM users u WHERE u.id=auth.uid() AND u.company_id IS NULL AND u.role IN ('tier1','tier2_officer','tier2_registrar','system_admin'))
);

CREATE POLICY "msq_select_company_own"
ON msq_submissions
FOR SELECT
USING (
  EXISTS (SELECT 1 FROM users u WHERE u.id=auth.uid() AND u.company_id=msq_submissions.company_id AND u.role IN ('company_admin','company_manager','company_user'))
);

CREATE POLICY "msq_insert_company_own"
ON msq_submissions
FOR INSERT
WITH CHECK (
  EXISTS (SELECT 1 FROM users u WHERE u.id=auth.uid() AND u.company_id=msq_submissions.company_id AND u.role IN ('company_admin','company_manager','company_user'))
  OR EXISTS (SELECT 1 FROM users u WHERE u.id=auth.uid() AND u.company_id IS NULL AND u.role IN ('tier1','tier2_registrar','system_admin'))
);

CREATE POLICY "msq_update_company_own"
ON msq_submissions
FOR UPDATE
USING (
  EXISTS (SELECT 1 FROM users u WHERE u.id=auth.uid() AND u.company_id=msq_submissions.company_id AND u.role IN ('company_admin','company_manager','company_user'))
)
WITH CHECK (
  EXISTS (SELECT 1 FROM users u WHERE u.id=auth.uid() AND u.company_id=msq_submissions.company_id AND u.role IN ('company_admin','company_manager','company_user'))
);

CREATE POLICY "msq_update_moh_all"
ON msq_submissions
FOR UPDATE
USING (
  EXISTS (SELECT 1 FROM users u WHERE u.id=auth.uid() AND u.company_id IS NULL AND u.role IN ('tier1','tier2_officer','tier2_registrar','system_admin'))
)
WITH CHECK (
  EXISTS (SELECT 1 FROM users u WHERE u.id=auth.uid() AND u.company_id IS NULL AND u.role IN ('tier1','tier2_officer','tier2_registrar','system_admin'))
);

-- wsl_submissions
DROP POLICY IF EXISTS "wsl_select_moh_all" ON wsl_submissions;
DROP POLICY IF EXISTS "wsl_select_company_own" ON wsl_submissions;
DROP POLICY IF EXISTS "wsl_insert_company_own" ON wsl_submissions;
DROP POLICY IF EXISTS "wsl_update_company_own" ON wsl_submissions;
DROP POLICY IF EXISTS "wsl_update_moh_all" ON wsl_submissions;

CREATE POLICY "wsl_select_moh_all"
ON wsl_submissions
FOR SELECT
USING (
  EXISTS (SELECT 1 FROM users u WHERE u.id=auth.uid() AND u.company_id IS NULL AND u.role IN ('tier1','tier2_officer','tier2_registrar','system_admin'))
);

CREATE POLICY "wsl_select_company_own"
ON wsl_submissions
FOR SELECT
USING (
  EXISTS (SELECT 1 FROM users u WHERE u.id=auth.uid() AND u.company_id=wsl_submissions.company_id AND u.role IN ('company_admin','company_manager','company_user'))
);

CREATE POLICY "wsl_insert_company_own"
ON wsl_submissions
FOR INSERT
WITH CHECK (
  EXISTS (SELECT 1 FROM users u WHERE u.id=auth.uid() AND u.company_id=wsl_submissions.company_id AND u.role IN ('company_admin','company_manager','company_user'))
  OR EXISTS (SELECT 1 FROM users u WHERE u.id=auth.uid() AND u.company_id IS NULL AND u.role IN ('tier1','tier2_registrar','system_admin'))
);

CREATE POLICY "wsl_update_company_own"
ON wsl_submissions
FOR UPDATE
USING (
  EXISTS (SELECT 1 FROM users u WHERE u.id=auth.uid() AND u.company_id=wsl_submissions.company_id AND u.role IN ('company_admin','company_manager','company_user'))
)
WITH CHECK (
  EXISTS (SELECT 1 FROM users u WHERE u.id=auth.uid() AND u.company_id=wsl_submissions.company_id AND u.role IN ('company_admin','company_manager','company_user'))
);

CREATE POLICY "wsl_update_moh_all"
ON wsl_submissions
FOR UPDATE
USING (
  EXISTS (SELECT 1 FROM users u WHERE u.id=auth.uid() AND u.company_id IS NULL AND u.role IN ('tier1','tier2_officer','tier2_registrar','system_admin'))
)
WITH CHECK (
  EXISTS (SELECT 1 FROM users u WHERE u.id=auth.uid() AND u.company_id IS NULL AND u.role IN ('tier1','tier2_officer','tier2_registrar','system_admin'))
);

-- thresholds (MOH controlled; companies may read)
DROP POLICY IF EXISTS "thresholds_select_moh_all" ON thresholds;
DROP POLICY IF EXISTS "thresholds_select_company_all" ON thresholds;
DROP POLICY IF EXISTS "thresholds_write_moh_only" ON thresholds;

CREATE POLICY "thresholds_select_moh_all"
ON thresholds
FOR SELECT
USING (
  EXISTS (SELECT 1 FROM users u WHERE u.id=auth.uid() AND u.company_id IS NULL AND u.role IN ('tier1','tier2_officer','tier2_registrar','system_admin'))
);

CREATE POLICY "thresholds_select_company_all"
ON thresholds
FOR SELECT
USING (auth.uid() IS NOT NULL);

CREATE POLICY "thresholds_write_moh_only"
ON thresholds
FOR ALL
USING (
  EXISTS (SELECT 1 FROM users u WHERE u.id=auth.uid() AND u.company_id IS NULL AND u.role IN ('tier1','tier2_registrar','system_admin'))
)
WITH CHECK (
  EXISTS (SELECT 1 FROM users u WHERE u.id=auth.uid() AND u.company_id IS NULL AND u.role IN ('tier1','tier2_registrar','system_admin'))
);

-- breaches
DROP POLICY IF EXISTS "breaches_select_moh_all" ON breaches;
DROP POLICY IF EXISTS "breaches_select_company_own" ON breaches;
DROP POLICY IF EXISTS "breaches_write_moh_only" ON breaches;

CREATE POLICY "breaches_select_moh_all"
ON breaches
FOR SELECT
USING (
  EXISTS (SELECT 1 FROM users u WHERE u.id=auth.uid() AND u.company_id IS NULL AND u.role IN ('tier1','tier2_officer','tier2_registrar','system_admin'))
);

CREATE POLICY "breaches_select_company_own"
ON breaches
FOR SELECT
USING (
  EXISTS (SELECT 1 FROM users u WHERE u.id=auth.uid() AND u.company_id=breaches.company_id AND u.role IN ('company_admin','company_manager','company_user'))
);

CREATE POLICY "breaches_write_moh_only"
ON breaches
FOR ALL
USING (
  EXISTS (SELECT 1 FROM users u WHERE u.id=auth.uid() AND u.company_id IS NULL AND u.role IN ('tier1','tier2_officer','tier2_registrar','system_admin'))
)
WITH CHECK (
  EXISTS (SELECT 1 FROM users u WHERE u.id=auth.uid() AND u.company_id IS NULL AND u.role IN ('tier1','tier2_officer','tier2_registrar','system_admin'))
);

-- breach_analyses
DROP POLICY IF EXISTS "breach_analyses_select_moh_all" ON breach_analyses;
DROP POLICY IF EXISTS "breach_analyses_write_moh_only" ON breach_analyses;

CREATE POLICY "breach_analyses_select_moh_all"
ON breach_analyses
FOR SELECT
USING (
  EXISTS (SELECT 1 FROM users u WHERE u.id=auth.uid() AND u.company_id IS NULL AND u.role IN ('tier1','tier2_officer','tier2_registrar','system_admin'))
);

CREATE POLICY "breach_analyses_write_moh_only"
ON breach_analyses
FOR ALL
USING (
  EXISTS (SELECT 1 FROM users u WHERE u.id=auth.uid() AND u.company_id IS NULL AND u.role IN ('tier1','tier2_officer','tier2_registrar','system_admin'))
)
WITH CHECK (
  EXISTS (SELECT 1 FROM users u WHERE u.id=auth.uid() AND u.company_id IS NULL AND u.role IN ('tier1','tier2_officer','tier2_registrar','system_admin'))
);

-- ============================================
-- GOVERNANCE RPCs: fix role tokens used for authz
-- ============================================

-- Follow-ups RPCs
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
  IF v_role NOT IN ('tier1','tier2_officer','system_admin') THEN
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
  IF v_role NOT IN ('tier1','tier2_officer','system_admin') THEN
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

  IF v_role IN ('tier1','tier2_officer','tier2_registrar','system_admin') THEN
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

  IF v_role IN ('tier1','tier2_officer','tier2_registrar','system_admin') THEN
    RETURN v_row;
  END IF;

  IF (v_company IS NOT NULL AND v_row.company_id = v_company) OR v_row.assigned_to = v_actor THEN
    RETURN v_row;
  END IF;

  RAISE EXCEPTION 'not authorized';
END;
$$;

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

  IF v_role NOT IN ('tier1','tier2_officer','system_admin') AND v_assigned <> v_actor THEN
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

-- Meetings RPCs: update auth role tokens (only authorization guards; logic unchanged)
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
  IF v_role NOT IN ('tier1','tier2_officer','system_admin') THEN
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
  IF v_role NOT IN ('tier1','tier2_officer','system_admin') THEN
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

-- Meeting attendees (admin actions) role check
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
  IF v_role NOT IN ('tier1','tier2_officer','system_admin') THEN
    RAISE EXCEPTION 'not authorized';
  END IF;

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
  IF v_role NOT IN ('tier1','tier2_officer','system_admin') THEN
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

COMMIT;

