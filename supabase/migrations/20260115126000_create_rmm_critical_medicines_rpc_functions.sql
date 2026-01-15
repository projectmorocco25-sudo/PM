-- Migration: create_rmm_critical_medicines_rpc_functions
-- Description: RMM critical medicines RPCs (designate/list) - MOH only
-- Date: 2026-01-15
-- Author: Maya
-- Phase: 1.1.2
-- Task: 1.1.2.5

BEGIN;

CREATE OR REPLACE FUNCTION rmm_designate_critical_medicine(
  p_sku_id uuid,
  p_is_active boolean DEFAULT true
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_actor uuid := auth.uid();
  v_role text;
  v_company_id uuid;
  v_row critical_medicines;
  v_id uuid;
BEGIN
  IF v_actor IS NULL THEN
    RETURN rmm_error('AUTHENTICATION_ERROR', 'Authentication required');
  END IF;

  SELECT role, company_id INTO v_role, v_company_id FROM users WHERE id = v_actor;
  IF v_company_id IS NOT NULL OR v_role NOT IN ('tier1','system_admin') THEN
    RETURN rmm_error('AUTHORIZATION_ERROR', 'You do not have permission to designate critical medicines');
  END IF;

  PERFORM 1 FROM skus s WHERE s.id = p_sku_id AND s.is_active = true;
  IF NOT FOUND THEN
    RETURN rmm_error('INVALID_REFERENCE', 'SKU not found');
  END IF;

  SELECT * INTO v_row FROM critical_medicines WHERE sku_id = p_sku_id;
  IF FOUND THEN
    UPDATE critical_medicines
    SET is_active = COALESCE(p_is_active, is_active),
        updated_at = now()
    WHERE sku_id = p_sku_id
    RETURNING id INTO v_id;
  ELSE
    INSERT INTO critical_medicines (sku_id, designated_by, is_active)
    VALUES (p_sku_id, v_actor, COALESCE(p_is_active, true))
    RETURNING id INTO v_id;
  END IF;

  PERFORM shared_create_audit_log(
    v_actor,
    'update',
    'critical_medicines',
    v_id,
    NULL,
    to_jsonb((SELECT cm FROM critical_medicines cm WHERE cm.id = v_id)),
    NULL,
    NULL,
    NULL
  );

  RETURN jsonb_build_object('success', true, 'data', jsonb_build_object('id', v_id));
EXCEPTION
  WHEN others THEN
    RETURN rmm_error('SYSTEM_ERROR', 'An unexpected error occurred');
END;
$$;

CREATE OR REPLACE FUNCTION rmm_list_critical_medicines(
  p_is_active boolean DEFAULT true,
  p_limit integer DEFAULT 100,
  p_offset integer DEFAULT 0
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_actor uuid := auth.uid();
  v_role text;
  v_company_id uuid;
  v_total integer;
  v_items jsonb;
BEGIN
  IF v_actor IS NULL THEN
    RETURN rmm_error('AUTHENTICATION_ERROR', 'Authentication required');
  END IF;

  SELECT role, company_id INTO v_role, v_company_id FROM users WHERE id = v_actor;
  IF v_company_id IS NOT NULL OR v_role NOT IN ('tier1','tier2_officer','tier2_registrar','system_admin') THEN
    RETURN rmm_error('AUTHORIZATION_ERROR', 'You do not have permission to view critical medicines');
  END IF;

  SELECT count(*) INTO v_total
  FROM critical_medicines cm
  WHERE (p_is_active IS NULL OR cm.is_active = p_is_active);

  SELECT COALESCE(jsonb_agg(to_jsonb(x)), '[]'::jsonb) INTO v_items
  FROM (
    SELECT
      cm.*,
      s.name AS sku_name,
      s.dosage_strength,
      s.dosage_form,
      s.pack_size,
      s.unit_of_measure,
      p.name AS product_name,
      p.company_id
    FROM critical_medicines cm
    JOIN skus s ON s.id = cm.sku_id
    JOIN products p ON p.id = s.product_id
    WHERE (p_is_active IS NULL OR cm.is_active = p_is_active)
    ORDER BY cm.designated_at DESC
    LIMIT LEAST(GREATEST(p_limit, 1), 500)
    OFFSET GREATEST(p_offset, 0)
  ) x;

  RETURN jsonb_build_object('success', true, 'data', jsonb_build_object('total', v_total, 'items', v_items));
EXCEPTION
  WHEN others THEN
    RETURN rmm_error('SYSTEM_ERROR', 'An unexpected error occurred');
END;
$$;

COMMIT;

