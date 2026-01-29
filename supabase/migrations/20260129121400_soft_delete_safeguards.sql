-- Migration: RMM soft delete safeguards (Task 1.1.2.14)
-- Description: Prevent hard DELETE on companies, products, skus. Deletion must go through soft delete
--              (is_active = false / suspended_* / deactivated_*) to preserve audit trail and submission history.
-- Tables: companies, products, skus.
-- Depends on: 1.1.1.3 (RMM tables), 1.1.1.5 (RLS).
-- Date: 2026-01-29

BEGIN;

-- Generic trigger function: prevent hard delete on RMM entity tables
CREATE OR REPLACE FUNCTION public.rmm_prevent_hard_delete()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RAISE EXCEPTION 'Hard delete not allowed on %. Use soft delete (deactivation/suspension via registry submission workflow) instead. Records must be preserved for audit.',
    TG_TABLE_NAME
  USING ERRCODE = 'integrity_constraint_violation';
END;
$$;

COMMENT ON FUNCTION public.rmm_prevent_hard_delete()
  IS 'Trigger: prevent hard DELETE on RMM entity tables. Soft delete only (is_active = false). Task 1.1.2.14.';

-- Companies: prevent hard delete
DROP TRIGGER IF EXISTS prevent_hard_delete_companies ON public.companies;
CREATE TRIGGER prevent_hard_delete_companies
  BEFORE DELETE ON public.companies
  FOR EACH ROW
  EXECUTE FUNCTION public.rmm_prevent_hard_delete();

-- Products: prevent hard delete
DROP TRIGGER IF EXISTS prevent_hard_delete_products ON public.products;
CREATE TRIGGER prevent_hard_delete_products
  BEFORE DELETE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.rmm_prevent_hard_delete();

-- SKUs: prevent hard delete
DROP TRIGGER IF EXISTS prevent_hard_delete_skus ON public.skus;
CREATE TRIGGER prevent_hard_delete_skus
  BEFORE DELETE ON public.skus
  FOR EACH ROW
  EXECUTE FUNCTION public.rmm_prevent_hard_delete();

COMMIT;
