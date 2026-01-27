-- Migration: RLS policies for RMM tables
-- Description: Implement RLS for companies, products, skus, atc_codes, critical_medicines, registry_submissions.
-- Task: 1.1.1.5
-- Date: 2026-01-27
-- Author: Sami (Implementation Compliance Specialist)
-- Dependencies: 20260127150200_rmm_tables (1.1.1.3-verify), 20260127150400_rls_policies_core_tables (current_user_role, current_user_company_id)
-- Reference: feature-index.md#rmm-module-features, data-dictionary RMM tables

BEGIN;

-- Helper: derive company_id for a registry_submission (for RLS). SECURITY DEFINER.
-- entity_type 'company': entity_id is company id (update/delete); company_create has no company yet -> null.
-- entity_type 'product': products.company_id. entity_type 'sku': skus -> products.company_id.
CREATE OR REPLACE FUNCTION public.registry_submission_company_id(p_id uuid)
RETURNS uuid
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_entity_type text;
  v_entity_id   uuid;
  v_company_id  uuid;
BEGIN
  SELECT entity_type, entity_id INTO v_entity_type, v_entity_id
  FROM public.registry_submissions
  WHERE id = p_id;
  IF NOT FOUND THEN
    RETURN NULL;
  END IF;
  CASE v_entity_type
    WHEN 'company' THEN
      RETURN v_entity_id;  -- null for company_create
    WHEN 'product' THEN
      SELECT company_id INTO v_company_id FROM public.products WHERE id = v_entity_id;
      RETURN v_company_id;
    WHEN 'sku' THEN
      SELECT p.company_id INTO v_company_id
      FROM public.skus s
      JOIN public.products p ON p.id = s.product_id
      WHERE s.id = v_entity_id;
      RETURN v_company_id;
    ELSE
      RETURN NULL;
  END CASE;
END;
$$;

COMMENT ON FUNCTION public.registry_submission_company_id(uuid) IS 'Returns company_id for a registry_submission for RLS. Used for company isolation.';

GRANT EXECUTE ON FUNCTION public.registry_submission_company_id(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.registry_submission_company_id(uuid) TO service_role;

-- --------
-- companies
-- --------
-- SELECT: MOH all; company users only their company
DROP POLICY IF EXISTS "companies_select" ON public.companies;
CREATE POLICY "companies_select" ON public.companies
  FOR SELECT
  TO authenticated
  USING (
    current_user_role() IN ('tier1', 'tier2_officer', 'tier2_registrar', 'auditor', 'system_admin')
    OR (current_user_company_id() IS NOT NULL AND id = current_user_company_id())
  );

-- INSERT/UPDATE/DELETE: MOH only (companies created/managed via MOH or workflow)
DROP POLICY IF EXISTS "companies_insert_moh" ON public.companies;
CREATE POLICY "companies_insert_moh" ON public.companies
  FOR INSERT
  TO authenticated
  WITH CHECK (current_user_role() IN ('tier1', 'tier2_officer', 'tier2_registrar', 'system_admin'));

DROP POLICY IF EXISTS "companies_update_moh" ON public.companies;
CREATE POLICY "companies_update_moh" ON public.companies
  FOR UPDATE
  TO authenticated
  USING (current_user_role() IN ('tier1', 'tier2_officer', 'tier2_registrar', 'system_admin'))
  WITH CHECK (current_user_role() IN ('tier1', 'tier2_officer', 'tier2_registrar', 'system_admin'));

DROP POLICY IF EXISTS "companies_delete_moh" ON public.companies;
CREATE POLICY "companies_delete_moh" ON public.companies
  FOR DELETE
  TO authenticated
  USING (current_user_role() IN ('tier1', 'tier2_officer', 'tier2_registrar', 'system_admin'));

-- --------
-- products
-- --------
-- SELECT: MOH all; company users only their company's products
DROP POLICY IF EXISTS "products_select" ON public.products;
CREATE POLICY "products_select" ON public.products
  FOR SELECT
  TO authenticated
  USING (
    current_user_role() IN ('tier1', 'tier2_officer', 'tier2_registrar', 'auditor', 'system_admin')
    OR (current_user_company_id() IS NOT NULL AND company_id = current_user_company_id())
  );

-- INSERT/UPDATE/DELETE: MOH only (creates/updates via registry workflow)
DROP POLICY IF EXISTS "products_insert_moh" ON public.products;
CREATE POLICY "products_insert_moh" ON public.products
  FOR INSERT
  TO authenticated
  WITH CHECK (current_user_role() IN ('tier1', 'tier2_officer', 'tier2_registrar', 'system_admin'));

DROP POLICY IF EXISTS "products_update_moh" ON public.products;
CREATE POLICY "products_update_moh" ON public.products
  FOR UPDATE
  TO authenticated
  USING (current_user_role() IN ('tier1', 'tier2_officer', 'tier2_registrar', 'system_admin'))
  WITH CHECK (current_user_role() IN ('tier1', 'tier2_officer', 'tier2_registrar', 'system_admin'));

DROP POLICY IF EXISTS "products_delete_moh" ON public.products;
CREATE POLICY "products_delete_moh" ON public.products
  FOR DELETE
  TO authenticated
  USING (current_user_role() IN ('tier1', 'tier2_officer', 'tier2_registrar', 'system_admin'));

-- --------
-- skus
-- --------
-- SELECT: MOH all; company users only SKUs for their company's products
DROP POLICY IF EXISTS "skus_select" ON public.skus;
CREATE POLICY "skus_select" ON public.skus
  FOR SELECT
  TO authenticated
  USING (
    current_user_role() IN ('tier1', 'tier2_officer', 'tier2_registrar', 'auditor', 'system_admin')
    OR (
      current_user_company_id() IS NOT NULL
      AND product_id IN (SELECT id FROM public.products WHERE company_id = current_user_company_id())
    )
  );

-- INSERT/UPDATE/DELETE: MOH only
DROP POLICY IF EXISTS "skus_insert_moh" ON public.skus;
CREATE POLICY "skus_insert_moh" ON public.skus
  FOR INSERT
  TO authenticated
  WITH CHECK (current_user_role() IN ('tier1', 'tier2_officer', 'tier2_registrar', 'system_admin'));

DROP POLICY IF EXISTS "skus_update_moh" ON public.skus;
CREATE POLICY "skus_update_moh" ON public.skus
  FOR UPDATE
  TO authenticated
  USING (current_user_role() IN ('tier1', 'tier2_officer', 'tier2_registrar', 'system_admin'))
  WITH CHECK (current_user_role() IN ('tier1', 'tier2_officer', 'tier2_registrar', 'system_admin'));

DROP POLICY IF EXISTS "skus_delete_moh" ON public.skus;
CREATE POLICY "skus_delete_moh" ON public.skus
  FOR DELETE
  TO authenticated
  USING (current_user_role() IN ('tier1', 'tier2_officer', 'tier2_registrar', 'system_admin'));

-- --------
-- atc_codes (MOH-controlled; companies read-only)
-- --------
-- SELECT: all authenticated (companies read-only for product/SKU forms)
DROP POLICY IF EXISTS "atc_codes_select" ON public.atc_codes;
CREATE POLICY "atc_codes_select" ON public.atc_codes
  FOR SELECT
  TO authenticated
  USING (true);

-- INSERT/UPDATE/DELETE: MOH only
DROP POLICY IF EXISTS "atc_codes_insert_moh" ON public.atc_codes;
CREATE POLICY "atc_codes_insert_moh" ON public.atc_codes
  FOR INSERT
  TO authenticated
  WITH CHECK (current_user_role() IN ('tier1', 'tier2_officer', 'tier2_registrar', 'system_admin'));

DROP POLICY IF EXISTS "atc_codes_update_moh" ON public.atc_codes;
CREATE POLICY "atc_codes_update_moh" ON public.atc_codes
  FOR UPDATE
  TO authenticated
  USING (current_user_role() IN ('tier1', 'tier2_officer', 'tier2_registrar', 'system_admin'))
  WITH CHECK (current_user_role() IN ('tier1', 'tier2_officer', 'tier2_registrar', 'system_admin'));

DROP POLICY IF EXISTS "atc_codes_delete_moh" ON public.atc_codes;
CREATE POLICY "atc_codes_delete_moh" ON public.atc_codes
  FOR DELETE
  TO authenticated
  USING (current_user_role() IN ('tier1', 'tier2_officer', 'tier2_registrar', 'system_admin'));

-- --------
-- critical_medicines (MOH-controlled; companies read-only)
-- --------
-- SELECT: all authenticated
DROP POLICY IF EXISTS "critical_medicines_select" ON public.critical_medicines;
CREATE POLICY "critical_medicines_select" ON public.critical_medicines
  FOR SELECT
  TO authenticated
  USING (true);

-- INSERT/UPDATE/DELETE: MOH only
DROP POLICY IF EXISTS "critical_medicines_insert_moh" ON public.critical_medicines;
CREATE POLICY "critical_medicines_insert_moh" ON public.critical_medicines
  FOR INSERT
  TO authenticated
  WITH CHECK (current_user_role() IN ('tier1', 'tier2_officer', 'tier2_registrar', 'system_admin'));

DROP POLICY IF EXISTS "critical_medicines_update_moh" ON public.critical_medicines;
CREATE POLICY "critical_medicines_update_moh" ON public.critical_medicines
  FOR UPDATE
  TO authenticated
  USING (current_user_role() IN ('tier1', 'tier2_officer', 'tier2_registrar', 'system_admin'))
  WITH CHECK (current_user_role() IN ('tier1', 'tier2_officer', 'tier2_registrar', 'system_admin'));

DROP POLICY IF EXISTS "critical_medicines_delete_moh" ON public.critical_medicines;
CREATE POLICY "critical_medicines_delete_moh" ON public.critical_medicines
  FOR DELETE
  TO authenticated
  USING (current_user_role() IN ('tier1', 'tier2_officer', 'tier2_registrar', 'system_admin'));

-- --------
-- registry_submissions
-- --------
-- SELECT: MOH all; company users only same-company submissions (via helper). Draft company_create: no company yet -> allow if submitter.
DROP POLICY IF EXISTS "registry_submissions_select" ON public.registry_submissions;
CREATE POLICY "registry_submissions_select" ON public.registry_submissions
  FOR SELECT
  TO authenticated
  USING (
    current_user_role() IN ('tier1', 'tier2_officer', 'tier2_registrar', 'auditor', 'system_admin')
    OR (
      current_user_company_id() IS NOT NULL
      AND (
        registry_submission_company_id(id) = current_user_company_id()
        OR (registry_submission_company_id(id) IS NULL AND submitted_by = auth.uid())
      )
    )
  );

-- INSERT/UPDATE/DELETE: service role or RPC only (workflow); no authenticated policy

COMMIT;
