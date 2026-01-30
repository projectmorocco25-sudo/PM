-- Migration: Critical Medicines designation/removal justification (outstanding-scope §4.1, team-suggestions-checklist)
-- Adds justification column and p_justification param to rmm_create_critical_medicine, rmm_update_critical_medicine.
-- Wireframe: task-0.5.2.15 — "Provide reason for removal (required)", "Provide Justification: Enter reason for designation (required)".
-- Date: 2026-01-29

BEGIN;

ALTER TABLE public.critical_medicines
  ADD COLUMN IF NOT EXISTS justification text;

COMMENT ON COLUMN public.critical_medicines.justification IS 'Reason for designation (on create) or removal (on deactivate). Wireframe-required. Task 1.1.2.30.';

-- rmm_create_critical_medicine(p_sku_id uuid, p_justification text DEFAULT NULL)
CREATE OR REPLACE FUNCTION public.rmm_create_critical_medicine(
  p_sku_id uuid,
  p_justification text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
  v_id uuid;
  v_user_id uuid;
  r record;
BEGIN
  IF p_sku_id IS NULL THEN
    RETURN jsonb_build_object('error', 'validation_error', 'message', 'sku_id is required');
  END IF;
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RETURN jsonb_build_object('error', 'unauthorized', 'message', 'not authenticated');
  END IF;

  INSERT INTO public.critical_medicines (sku_id, designated_by, is_active, justification)
  VALUES (p_sku_id, v_user_id, true, p_justification)
  RETURNING id INTO v_id;

  SELECT cm.id, cm.sku_id, cm.designated_at, cm.designated_by, cm.is_active, cm.justification, cm.created_at, cm.updated_at,
         s.sku_code, s.name AS sku_name, p.id AS product_id, p.name AS product_name, p.company_id
  INTO r
  FROM public.critical_medicines cm
  JOIN public.skus s ON s.id = cm.sku_id
  JOIN public.products p ON p.id = s.product_id
  WHERE cm.id = v_id;

  RETURN jsonb_build_object('critical_medicine', to_jsonb(r));
EXCEPTION
  WHEN foreign_key_violation THEN
    RETURN jsonb_build_object('error', 'foreign_key_violation', 'message', 'sku_id not found');
END;
$$;
COMMENT ON FUNCTION public.rmm_create_critical_medicine(uuid, text) IS 'Designate SKU as critical medicine. Optional p_justification stored for audit. RLS applies (MOH only). Task 1.1.2.5/1.1.2.30.';
GRANT EXECUTE ON FUNCTION public.rmm_create_critical_medicine(uuid, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.rmm_create_critical_medicine(uuid, text) TO service_role;

-- rmm_update_critical_medicine(p_id uuid, p_is_active boolean DEFAULT NULL, p_justification text DEFAULT NULL)
CREATE OR REPLACE FUNCTION public.rmm_update_critical_medicine(
  p_id uuid,
  p_is_active boolean DEFAULT NULL,
  p_justification text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
  r record;
BEGIN
  IF p_id IS NULL THEN
    RETURN jsonb_build_object('error', 'validation_error', 'message', 'id is required');
  END IF;

  UPDATE public.critical_medicines
  SET
    is_active = coalesce(p_is_active, is_active),
    justification = CASE WHEN p_justification IS NOT NULL THEN p_justification ELSE justification END,
    updated_at = now()
  WHERE id = p_id;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('error', 'not_found', 'critical_medicine_id', p_id);
  END IF;

  SELECT cm.id, cm.sku_id, cm.designated_at, cm.designated_by, cm.is_active, cm.justification, cm.created_at, cm.updated_at,
         s.sku_code, s.name AS sku_name, p.id AS product_id, p.name AS product_name, p.company_id
  INTO r
  FROM public.critical_medicines cm
  JOIN public.skus s ON s.id = cm.sku_id
  JOIN public.products p ON p.id = s.product_id
  WHERE cm.id = p_id;

  RETURN jsonb_build_object('critical_medicine', to_jsonb(r));
END;
$$;
COMMENT ON FUNCTION public.rmm_update_critical_medicine(uuid, boolean, text) IS 'Update critical medicine (e.g. deactivate). Optional p_justification for removal reason. RLS applies (MOH only). Task 1.1.2.5/1.1.2.30.';
GRANT EXECUTE ON FUNCTION public.rmm_update_critical_medicine(uuid, boolean, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.rmm_update_critical_medicine(uuid, boolean, text) TO service_role;

COMMIT;
