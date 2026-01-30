-- Migration: rmm_get_overview_stats (Task 1.1.2.16.1)
-- Description: RPC for RMM overview page statistics. Role-based: company users see own company; MOH see all.
-- Tables: companies, products, skus, registry_submissions. SECURITY DEFINER with company filter from users.
-- Date: 2026-01-29

BEGIN;

CREATE OR REPLACE FUNCTION public.rmm_get_overview_stats(p_company_id uuid DEFAULT NULL)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_company_id uuid;
  v_companies_total bigint;
  v_companies_active bigint;
  v_companies_inactive bigint;
  v_products_total bigint;
  v_products_active bigint;
  v_products_inactive bigint;
  v_skus_total bigint;
  v_skus_active bigint;
  v_skus_inactive bigint;
  v_submissions_pending bigint;
  v_submissions_approved bigint;
  v_submissions_rejected bigint;
BEGIN
  -- Resolve company filter: explicit param, or from current user (company users have company_id)
  v_company_id := COALESCE(p_company_id, (SELECT company_id FROM public.users WHERE id = auth.uid()));

  -- Companies counts (filter by v_company_id when set)
  IF v_company_id IS NOT NULL THEN
    SELECT count(*), count(*) FILTER (WHERE is_active), count(*) FILTER (WHERE NOT is_active)
    INTO v_companies_total, v_companies_active, v_companies_inactive
    FROM public.companies WHERE id = v_company_id;
  ELSE
    SELECT count(*), count(*) FILTER (WHERE is_active), count(*) FILTER (WHERE NOT is_active)
    INTO v_companies_total, v_companies_active, v_companies_inactive
    FROM public.companies;
  END IF;

  -- Products counts
  IF v_company_id IS NOT NULL THEN
    SELECT count(*), count(*) FILTER (WHERE is_active), count(*) FILTER (WHERE NOT is_active)
    INTO v_products_total, v_products_active, v_products_inactive
    FROM public.products WHERE company_id = v_company_id;
  ELSE
    SELECT count(*), count(*) FILTER (WHERE is_active), count(*) FILTER (WHERE NOT is_active)
    INTO v_products_total, v_products_active, v_products_inactive
    FROM public.products;
  END IF;

  -- SKUs counts (via products when company-scoped)
  IF v_company_id IS NOT NULL THEN
    SELECT count(*), count(*) FILTER (WHERE s.is_active), count(*) FILTER (WHERE NOT s.is_active)
    INTO v_skus_total, v_skus_active, v_skus_inactive
    FROM public.skus s
    JOIN public.products p ON p.id = s.product_id
    WHERE p.company_id = v_company_id;
  ELSE
    SELECT count(*), count(*) FILTER (WHERE is_active), count(*) FILTER (WHERE NOT is_active)
    INTO v_skus_total, v_skus_active, v_skus_inactive
    FROM public.skus;
  END IF;

  -- Registry submissions: pending = draft/submitted/tier2_verified/tier1_approved/tier2_implemented; approved = completed; rejected = rejected
  IF v_company_id IS NOT NULL THEN
    SELECT
      count(*) FILTER (WHERE rs.status IN ('draft','submitted','tier2_verified','tier1_approved','tier2_implemented')),
      count(*) FILTER (WHERE rs.status = 'completed'),
      count(*) FILTER (WHERE rs.status = 'rejected')
    INTO v_submissions_pending, v_submissions_approved, v_submissions_rejected
    FROM public.registry_submissions rs
    WHERE (rs.entity_type = 'company' AND rs.entity_id = v_company_id)
       OR (rs.entity_type = 'product' AND rs.entity_id IN (SELECT id FROM public.products WHERE company_id = v_company_id))
       OR (rs.entity_type = 'sku' AND rs.entity_id IN (SELECT s.id FROM public.skus s JOIN public.products p ON p.id = s.product_id WHERE p.company_id = v_company_id));
  ELSE
    SELECT
      count(*) FILTER (WHERE status IN ('draft','submitted','tier2_verified','tier1_approved','tier2_implemented')),
      count(*) FILTER (WHERE status = 'completed'),
      count(*) FILTER (WHERE status = 'rejected')
    INTO v_submissions_pending, v_submissions_approved, v_submissions_rejected
    FROM public.registry_submissions;
  END IF;
  RETURN jsonb_build_object(
    'companies_total', COALESCE(v_companies_total, 0),
    'companies_active', COALESCE(v_companies_active, 0),
    'companies_inactive', COALESCE(v_companies_inactive, 0),
    'products_total', COALESCE(v_products_total, 0),
    'products_active', COALESCE(v_products_active, 0),
    'products_inactive', COALESCE(v_products_inactive, 0),
    'skus_total', COALESCE(v_skus_total, 0),
    'skus_active', COALESCE(v_skus_active, 0),
    'skus_inactive', COALESCE(v_skus_inactive, 0),
    'submissions_pending', COALESCE(v_submissions_pending, 0),
    'submissions_approved', COALESCE(v_submissions_approved, 0),
    'submissions_rejected', COALESCE(v_submissions_rejected, 0)
  );
END;
$$;

COMMENT ON FUNCTION public.rmm_get_overview_stats(uuid) IS 'RMM overview statistics. Company users: own company; MOH: all. Task 1.1.2.16.1.';
GRANT EXECUTE ON FUNCTION public.rmm_get_overview_stats(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.rmm_get_overview_stats(uuid) TO service_role;

COMMIT;
