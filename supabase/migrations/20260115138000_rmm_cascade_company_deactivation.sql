-- Migration: rmm_cascade_company_deactivation
-- Description: Cascade deactivation from companies -> products -> skus
-- Date: 2026-01-15
-- Author: Nadia, Maya
-- Phase: 1.1.2
-- Task: 1.1.2.13

BEGIN;

CREATE OR REPLACE FUNCTION rmm_cascade_company_deactivation()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only on deactivation edge (true -> false)
  IF (TG_OP = 'UPDATE') AND (OLD.is_active = true) AND (NEW.is_active = false) THEN
    -- Deactivate products
    UPDATE products
    SET is_active = false,
        deactivated_at = COALESCE(deactivated_at, now()),
        deactivated_reason = COALESCE(deactivated_reason, 'Company deactivated'),
        deactivated_by = COALESCE(deactivated_by, NEW.suspended_by),
        updated_at = now()
    WHERE company_id = NEW.id
      AND is_active = true;

    -- Deactivate SKUs under those products
    UPDATE skus s
    SET is_active = false,
        deactivated_at = COALESCE(s.deactivated_at, now()),
        deactivated_reason = COALESCE(s.deactivated_reason, 'Company deactivated'),
        deactivated_by = COALESCE(s.deactivated_by, NEW.suspended_by),
        updated_at = now()
    FROM products p
    WHERE p.id = s.product_id
      AND p.company_id = NEW.id
      AND s.is_active = true;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_rmm_cascade_company_deactivation ON companies;
CREATE TRIGGER trg_rmm_cascade_company_deactivation
AFTER UPDATE OF is_active ON companies
FOR EACH ROW
EXECUTE FUNCTION rmm_cascade_company_deactivation();

COMMIT;

