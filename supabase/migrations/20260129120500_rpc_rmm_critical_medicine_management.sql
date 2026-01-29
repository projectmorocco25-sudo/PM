-- Migration: RMM Critical Medicine management RPCs (Task 1.1.2.5)
-- Description: rmm_list_critical_medicines, rmm_get_critical_medicine, rmm_create_critical_medicine, rmm_update_critical_medicine.
-- Table: critical_medicines (sku_id -> skus). RLS applies via SECURITY INVOKER (SELECT all authenticated; INSERT/UPDATE MOH only).
-- Depends on: 1.1.1.3-verify (RMM tables), 1.1.1.5 (RLS policies RMM).
-- Date: 2026-01-29

BEGIN;

-- rmm_list_critical_medicines(p_limit int, p_offset int, p_sku_id uuid)
-- SELECT allowed for all authenticated. RLS critical_medicines_select.
CREATE OR REPLACE FUNCTION public.rmm_list_critical_medicines(
  p_limit int DEFAULT 50,
  p_offset int DEFAULT 0,
  p_sku_id uuid DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
  total bigint;
  rows jsonb;
BEGIN
  IF p_limit < 1 OR p_limit > 500 THEN
    p_limit := 50;
  END IF;
  IF p_offset < 0 THEN
    p_offset := 0;
  END IF;
  SELECT count(*) INTO total
  FROM public.critical_medicines cm
  JOIN public.skus s ON s.id = cm.sku_id
  JOIN public.products p ON p.id = s.product_id
  WHERE cm.is_active = true
    AND (p_sku_id IS NULL OR cm.sku_id = p_sku_id);
  SELECT jsonb_agg(t) INTO rows
  FROM (
    SELECT cm.id, cm.sku_id, cm.designated_at, cm.designated_by, cm.is_active, cm.created_at, cm.updated_at,
           s.sku_code, s.name AS sku_name, p.id AS product_id, p.name AS product_name, p.company_id
    FROM public.critical_medicines cm
    JOIN public.skus s ON s.id = cm.sku_id
    JOIN public.products p ON p.id = s.product_id
    WHERE cm.is_active = true
      AND (p_sku_id IS NULL OR cm.sku_id = p_sku_id)
    ORDER BY cm.designated_at DESC
    LIMIT p_limit OFFSET p_offset
  ) t;
  RETURN jsonb_build_object('data', coalesce(rows, '[]'::jsonb), 'total', total);
END;
$$;
COMMENT ON FUNCTION public.rmm_list_critical_medicines(int, int, uuid) IS 'List critical medicines with optional sku filter. RLS applies (SELECT all). Task 1.1.2.5.';
GRANT EXECUTE ON FUNCTION public.rmm_list_critical_medicines(int, int, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.rmm_list_critical_medicines(int, int, uuid) TO service_role;

-- rmm_get_critical_medicine(p_id uuid)
-- Get one critical medicine by id with sku/product info. RLS critical_medicines_select.
CREATE OR REPLACE FUNCTION public.rmm_get_critical_medicine(p_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
  r record;
BEGIN
  SELECT cm.id, cm.sku_id, cm.designated_at, cm.designated_by, cm.is_active, cm.created_at, cm.updated_at,
         s.sku_code, s.name AS sku_name, s.product_id, p.name AS product_name, p.company_id
  INTO r
  FROM public.critical_medicines cm
  JOIN public.skus s ON s.id = cm.sku_id
  JOIN public.products p ON p.id = s.product_id
  WHERE cm.id = p_id;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('error', 'not_found', 'critical_medicine_id', p_id);
  END IF;
  RETURN jsonb_build_object('critical_medicine', to_jsonb(r));
END;
$$;
COMMENT ON FUNCTION public.rmm_get_critical_medicine(uuid) IS 'Get one critical medicine by id. RLS applies. Task 1.1.2.5.';
GRANT EXECUTE ON FUNCTION public.rmm_get_critical_medicine(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.rmm_get_critical_medicine(uuid) TO service_role;

-- rmm_create_critical_medicine(p_sku_id uuid)
-- MOH only (RLS critical_medicines_insert_moh). designated_by = auth.uid().
CREATE OR REPLACE FUNCTION public.rmm_create_critical_medicine(p_sku_id uuid)
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

  INSERT INTO public.critical_medicines (sku_id, designated_by, is_active)
  VALUES (p_sku_id, v_user_id, true)
  RETURNING id INTO v_id;

  SELECT cm.id, cm.sku_id, cm.designated_at, cm.designated_by, cm.is_active, cm.created_at, cm.updated_at,
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
COMMENT ON FUNCTION public.rmm_create_critical_medicine(uuid) IS 'Designate SKU as critical medicine. RLS applies (MOH only). Task 1.1.2.5.';
GRANT EXECUTE ON FUNCTION public.rmm_create_critical_medicine(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.rmm_create_critical_medicine(uuid) TO service_role;

-- rmm_update_critical_medicine(p_id uuid, p_is_active boolean)
-- MOH only (RLS critical_medicines_update_moh). Only is_active updatable (deactivate designation).
CREATE OR REPLACE FUNCTION public.rmm_update_critical_medicine(
  p_id uuid,
  p_is_active boolean DEFAULT NULL
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
  SET is_active = coalesce(p_is_active, is_active), updated_at = now()
  WHERE id = p_id;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('error', 'not_found', 'critical_medicine_id', p_id);
  END IF;

  SELECT cm.id, cm.sku_id, cm.designated_at, cm.designated_by, cm.is_active, cm.created_at, cm.updated_at,
         s.sku_code, s.name AS sku_name, p.id AS product_id, p.name AS product_name, p.company_id
  INTO r
  FROM public.critical_medicines cm
  JOIN public.skus s ON s.id = cm.sku_id
  JOIN public.products p ON p.id = s.product_id
  WHERE cm.id = p_id;

  RETURN jsonb_build_object('critical_medicine', to_jsonb(r));
END;
$$;
COMMENT ON FUNCTION public.rmm_update_critical_medicine(uuid, boolean) IS 'Update critical medicine (e.g. deactivate). RLS applies (MOH only). Task 1.1.2.5.';
GRANT EXECUTE ON FUNCTION public.rmm_update_critical_medicine(uuid, boolean) TO authenticated;
GRANT EXECUTE ON FUNCTION public.rmm_update_critical_medicine(uuid, boolean) TO service_role;

COMMIT;
