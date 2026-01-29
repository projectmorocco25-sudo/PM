-- Migration: RMM cascade deactivation logic (Task 1.1.2.13)
-- Description: When a company is deactivated (is_active = false), cascade to all products and SKUs.
--              When a product is deactivated (is_active = false), cascade to all SKUs.
-- Tables: companies, products, skus. Trigger functions use SECURITY DEFINER so cascade runs regardless of RLS.
-- Depends on: 1.1.1.3 (RMM tables), 1.1.2.9 (implement RPC already does cascade; triggers add DB-level guarantee).
-- Date: 2026-01-29

BEGIN;

-- Trigger function: cascade deactivation when a company is deactivated
CREATE OR REPLACE FUNCTION public.rmm_cascade_deactivate_children_on_company()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF OLD.is_active = true AND NEW.is_active = false THEN
    -- Cascade to products: use company's suspended_* as deactivation reason for children
    UPDATE public.products
    SET is_active = false,
        deactivated_at = COALESCE(NEW.suspended_at, now()),
        deactivated_by = NEW.suspended_by,
        deactivated_reason = NEW.suspended_reason,
        updated_at = now()
    WHERE company_id = NEW.id AND is_active = true;
    -- Cascade to SKUs belonging to this company's products (including any not yet deactivated)
    UPDATE public.skus s
    SET is_active = false,
        deactivated_at = COALESCE(NEW.suspended_at, now()),
        deactivated_by = NEW.suspended_by,
        deactivated_reason = NEW.suspended_reason,
        updated_at = now()
    FROM public.products p
    WHERE p.id = s.product_id AND p.company_id = NEW.id AND s.is_active = true;
  END IF;
  RETURN NEW;
END;
$$;

COMMENT ON FUNCTION public.rmm_cascade_deactivate_children_on_company()
  IS 'Trigger: when company is deactivated (is_active true->false), cascade to products and SKUs. Task 1.1.2.13.';

DROP TRIGGER IF EXISTS cascade_deactivate_children_on_company ON public.companies;
CREATE TRIGGER cascade_deactivate_children_on_company
  AFTER UPDATE OF is_active ON public.companies
  FOR EACH ROW
  WHEN (OLD.is_active = true AND NEW.is_active = false)
  EXECUTE FUNCTION public.rmm_cascade_deactivate_children_on_company();

-- Trigger function: cascade deactivation when a product is deactivated
CREATE OR REPLACE FUNCTION public.rmm_cascade_deactivate_children_on_product()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF OLD.is_active = true AND NEW.is_active = false THEN
    UPDATE public.skus
    SET is_active = false,
        deactivated_at = COALESCE(NEW.deactivated_at, now()),
        deactivated_by = NEW.deactivated_by,
        deactivated_reason = NEW.deactivated_reason,
        updated_at = now()
    WHERE product_id = NEW.id AND is_active = true;
  END IF;
  RETURN NEW;
END;
$$;

COMMENT ON FUNCTION public.rmm_cascade_deactivate_children_on_product()
  IS 'Trigger: when product is deactivated (is_active true->false), cascade to SKUs. Task 1.1.2.13.';

DROP TRIGGER IF EXISTS cascade_deactivate_children_on_product ON public.products;
CREATE TRIGGER cascade_deactivate_children_on_product
  AFTER UPDATE OF is_active ON public.products
  FOR EACH ROW
  WHEN (OLD.is_active = true AND NEW.is_active = false)
  EXECUTE FUNCTION public.rmm_cascade_deactivate_children_on_product();

COMMIT;
