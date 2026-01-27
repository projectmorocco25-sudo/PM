-- Migration: RLS policies for enforcement tables
-- Description: Implement RLS for enforcement_actions, enforcement_action_appeals.
-- Task: 1.1.1.8
-- Date: 2026-01-27
-- Author: Sami (Implementation Compliance Specialist)
-- Dependencies: 20260127150300_enforcement_tables (1.1.1.7-verify), 20260127150400 (current_user_role, current_user_company_id)
-- Reference: feature-index.md#enforcement-module

BEGIN;

-- --------
-- enforcement_actions
-- --------
-- SELECT: MOH full; company users only their company's actions (to view and appeal)
DROP POLICY IF EXISTS "enforcement_actions_select" ON public.enforcement_actions;
CREATE POLICY "enforcement_actions_select" ON public.enforcement_actions
  FOR SELECT
  TO authenticated
  USING (
    current_user_role() IN ('tier1', 'tier2_officer', 'tier2_registrar', 'auditor', 'system_admin')
    OR (current_user_company_id() IS NOT NULL AND company_id = current_user_company_id())
  );

-- INSERT/UPDATE/DELETE: MOH only
DROP POLICY IF EXISTS "enforcement_actions_insert_moh" ON public.enforcement_actions;
CREATE POLICY "enforcement_actions_insert_moh" ON public.enforcement_actions
  FOR INSERT
  TO authenticated
  WITH CHECK (current_user_role() IN ('tier1', 'tier2_officer', 'tier2_registrar', 'system_admin'));

DROP POLICY IF EXISTS "enforcement_actions_update_moh" ON public.enforcement_actions;
CREATE POLICY "enforcement_actions_update_moh" ON public.enforcement_actions
  FOR UPDATE
  TO authenticated
  USING (current_user_role() IN ('tier1', 'tier2_officer', 'tier2_registrar', 'system_admin'))
  WITH CHECK (current_user_role() IN ('tier1', 'tier2_officer', 'tier2_registrar', 'system_admin'));

DROP POLICY IF EXISTS "enforcement_actions_delete_moh" ON public.enforcement_actions;
CREATE POLICY "enforcement_actions_delete_moh" ON public.enforcement_actions
  FOR DELETE
  TO authenticated
  USING (current_user_role() IN ('tier1', 'tier2_officer', 'tier2_registrar', 'system_admin'));

-- --------
-- enforcement_action_appeals (appeals)
-- --------
-- SELECT: MOH full; company users only appeals for their company's actions
DROP POLICY IF EXISTS "enforcement_action_appeals_select" ON public.enforcement_action_appeals;
CREATE POLICY "enforcement_action_appeals_select" ON public.enforcement_action_appeals
  FOR SELECT
  TO authenticated
  USING (
    current_user_role() IN ('tier1', 'tier2_officer', 'tier2_registrar', 'auditor', 'system_admin')
    OR (
      current_user_company_id() IS NOT NULL
      AND enforcement_action_id IN (
        SELECT id FROM public.enforcement_actions WHERE company_id = current_user_company_id()
      )
    )
  );

-- INSERT: company users can submit appeals for their company's actions; MOH can create (e.g. system-initiated)
DROP POLICY IF EXISTS "enforcement_action_appeals_insert" ON public.enforcement_action_appeals;
CREATE POLICY "enforcement_action_appeals_insert" ON public.enforcement_action_appeals
  FOR INSERT
  TO authenticated
  WITH CHECK (
    current_user_role() IN ('tier1', 'tier2_officer', 'tier2_registrar', 'system_admin')
    OR (
      current_user_company_id() IS NOT NULL
      AND submitted_by = auth.uid()
      AND enforcement_action_id IN (
        SELECT id FROM public.enforcement_actions WHERE company_id = current_user_company_id()
      )
    )
  );

-- UPDATE/DELETE: MOH only (review, resolve, withdraw)
DROP POLICY IF EXISTS "enforcement_action_appeals_update_moh" ON public.enforcement_action_appeals;
CREATE POLICY "enforcement_action_appeals_update_moh" ON public.enforcement_action_appeals
  FOR UPDATE
  TO authenticated
  USING (current_user_role() IN ('tier1', 'tier2_officer', 'tier2_registrar', 'system_admin'))
  WITH CHECK (current_user_role() IN ('tier1', 'tier2_officer', 'tier2_registrar', 'system_admin'));

DROP POLICY IF EXISTS "enforcement_action_appeals_delete_moh" ON public.enforcement_action_appeals;
CREATE POLICY "enforcement_action_appeals_delete_moh" ON public.enforcement_action_appeals
  FOR DELETE
  TO authenticated
  USING (current_user_role() IN ('tier1', 'tier2_officer', 'tier2_registrar', 'system_admin'));

COMMIT;
