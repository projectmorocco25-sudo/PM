-- Migration: phase5_critical_medicines_management
-- Description: Phase 5 Task 5.1 — justification columns, extend designate/remove,
--   add rmm_update_critical_medicine, add rmm_list_critical_medicines (list with filters).
-- Wireframe: task-0.5.2.15-critical-medicines-list.md

BEGIN;

-- Add justification columns to critical_medicines
ALTER TABLE critical_medicines
  ADD COLUMN IF NOT EXISTS justification text,
  ADD COLUMN IF NOT EXISTS removal_justification text;

-- rmm_designate_critical_medicine: add p_justification
CREATE OR REPLACE FUNCTION rmm_designate_critical_medicine(
    designator_user_id uuid,
    sku_id uuid,
    p_justification text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_user_record RECORD;
    v_sku_record RECORD;
    v_critical_medicine_id uuid;
    v_critical_medicine jsonb;
BEGIN
    SELECT u.id, u.role, u.is_active
    INTO v_user_record
    FROM users u
    WHERE u.id = designator_user_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'User not found';
    END IF;

    IF NOT v_user_record.is_active THEN
        RAISE EXCEPTION 'User is not active';
    END IF;

    IF v_user_record.role NOT IN ('tier1', 'system_admin') THEN
        RAISE EXCEPTION 'Insufficient permissions: Only MOH Tier 1 and System Admin can designate critical medicines';
    END IF;

    IF p_justification IS NULL OR trim(p_justification) = '' THEN
        RAISE EXCEPTION 'Justification is required for designation';
    END IF;

    SELECT * INTO v_sku_record
    FROM skus
    WHERE id = sku_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'SKU not found';
    END IF;

    IF EXISTS (
        SELECT 1 FROM critical_medicines cm
        WHERE cm.sku_id = sku_id
        AND cm.is_active = true
    ) THEN
        RAISE EXCEPTION 'SKU is already designated as a critical medicine';
    END IF;

    INSERT INTO critical_medicines (
        sku_id,
        designated_by,
        justification,
        is_active
    ) VALUES (
        sku_id,
        designator_user_id,
        trim(p_justification),
        true
    )
    RETURNING id INTO v_critical_medicine_id;

    SELECT jsonb_build_object(
        'id', cm.id,
        'sku_id', cm.sku_id,
        'designated_at', cm.designated_at,
        'designated_by', cm.designated_by,
        'justification', cm.justification,
        'is_active', cm.is_active,
        'created_at', cm.created_at,
        'updated_at', cm.updated_at
    )
    INTO v_critical_medicine
    FROM critical_medicines cm
    WHERE cm.id = v_critical_medicine_id;

    RETURN v_critical_medicine;
END;
$$;

-- rmm_remove_critical_medicine: add p_justification, set removal_justification
CREATE OR REPLACE FUNCTION rmm_remove_critical_medicine(
    remover_user_id uuid,
    sku_id uuid,
    p_justification text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_user_record RECORD;
    v_cm RECORD;
BEGIN
    SELECT u.id, u.role, u.is_active
    INTO v_user_record
    FROM users u
    WHERE u.id = remover_user_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'User not found';
    END IF;

    IF NOT v_user_record.is_active THEN
        RAISE EXCEPTION 'User is not active';
    END IF;

    IF v_user_record.role NOT IN ('tier1', 'system_admin') THEN
        RAISE EXCEPTION 'Insufficient permissions: Only MOH Tier 1 and System Admin can remove critical medicine designations';
    END IF;

    IF p_justification IS NULL OR trim(p_justification) = '' THEN
        RAISE EXCEPTION 'Justification is required for removal';
    END IF;

    SELECT * INTO v_cm
    FROM critical_medicines
    WHERE sku_id = rmm_remove_critical_medicine.sku_id
    AND is_active = true;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Critical medicine designation not found for this SKU';
    END IF;

    UPDATE critical_medicines cm
    SET
        is_active = false,
        removal_justification = trim(p_justification),
        updated_at = now()
    WHERE cm.sku_id = rmm_remove_critical_medicine.sku_id
    AND cm.is_active = true;

    RETURN jsonb_build_object(
        'success', true,
        'message', 'Critical medicine designation removed successfully',
        'sku_id', sku_id
    );
END;
$$;

-- rmm_update_critical_medicine: update justification (and optionally is_active)
CREATE OR REPLACE FUNCTION rmm_update_critical_medicine(
    updater_user_id uuid,
    sku_id uuid,
    p_justification text DEFAULT NULL,
    p_is_active boolean DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_user_record RECORD;
    v_cm RECORD;
BEGIN
    SELECT u.id, u.role, u.is_active
    INTO v_user_record
    FROM users u
    WHERE u.id = updater_user_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'User not found';
    END IF;

    IF NOT v_user_record.is_active THEN
        RAISE EXCEPTION 'User is not active';
    END IF;

    IF v_user_record.role NOT IN ('tier1', 'system_admin') THEN
        RAISE EXCEPTION 'Insufficient permissions: Only MOH Tier 1 and System Admin can update critical medicine designations';
    END IF;

    SELECT * INTO v_cm
    FROM critical_medicines
    WHERE critical_medicines.sku_id = rmm_update_critical_medicine.sku_id
    AND is_active = true;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Critical medicine designation not found for this SKU';
    END IF;

    UPDATE critical_medicines cm
    SET
        justification = COALESCE(NULLIF(trim(p_justification), ''), cm.justification),
        is_active = COALESCE(p_is_active, cm.is_active),
        updated_at = now()
    WHERE cm.sku_id = rmm_update_critical_medicine.sku_id
    AND cm.is_active = true;

    RETURN (
        SELECT jsonb_build_object(
            'id', cm.id,
            'sku_id', cm.sku_id,
            'designated_at', cm.designated_at,
            'designated_by', cm.designated_by,
            'justification', cm.justification,
            'is_active', cm.is_active,
            'updated_at', cm.updated_at
        )
        FROM critical_medicines cm
        WHERE cm.sku_id = rmm_update_critical_medicine.sku_id
        AND cm.is_active = true
    );
END;
$$;

-- rmm_list_critical_medicines: list with filters, product/company/atc (frontend contract)
CREATE OR REPLACE FUNCTION rmm_list_critical_medicines(
    user_id uuid,
    page_number integer DEFAULT 1,
    page_size integer DEFAULT 50,
    search_term text DEFAULT NULL,
    sort_by text DEFAULT 'designated_at',
    sort_order text DEFAULT 'desc',
    p_status_filter text DEFAULT NULL,
    p_company_id uuid DEFAULT NULL,
    p_atc_category text DEFAULT NULL,
    p_date_from date DEFAULT NULL,
    p_date_to date DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_user_record RECORD;
    v_rows jsonb;
    v_total integer;
    v_offset integer;
    v_page_size integer;
    v_sort text;
    v_order text;
    v_cat text;
BEGIN
    SELECT u.id, u.role, u.is_active
    INTO v_user_record
    FROM users u
    WHERE u.id = user_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'User not found';
    END IF;

    IF NOT v_user_record.is_active THEN
        RAISE EXCEPTION 'User is not active';
    END IF;

    IF page_number < 1 THEN
        page_number := 1;
    END IF;

    IF page_size < 1 THEN
        page_size := 50;
    ELSIF page_size > 100 THEN
        page_size := 100;
    END IF;

    v_page_size := page_size;
    v_offset := (page_number - 1) * v_page_size;

    IF sort_by NOT IN ('designated_at', 'product_name', 'company_name', 'sku_code') THEN
        sort_by := 'designated_at';
    END IF;
    v_sort := sort_by;

    IF lower(sort_order) NOT IN ('asc', 'desc') THEN
        sort_order := 'desc';
    END IF;
    v_order := lower(sort_order);

    IF p_atc_category IS NOT NULL AND length(trim(p_atc_category)) = 1 THEN
        v_cat := lower(trim(p_atc_category));
    ELSE
        v_cat := NULL;
    END IF;

    WITH base AS (
        SELECT
            cm.id,
            cm.sku_id,
            s.sku_code,
            s.name AS sku_name,
            p.id AS product_id,
            p.name AS product_name,
            c.id AS company_id,
            c.name AS company_name,
            (SELECT ac.code FROM atc_codes ac WHERE ac.id = s.atc_code_id) AS atc_code,
            cm.designated_at,
            cm.designated_by,
            cm.justification,
            cm.is_active,
            (SELECT u2.full_name FROM users u2 WHERE u2.id = cm.designated_by) AS designated_by_name
        FROM critical_medicines cm
        JOIN skus s ON s.id = cm.sku_id
        JOIN products p ON p.id = s.product_id
        JOIN companies c ON c.id = p.company_id
        WHERE 1=1
          AND (p_status_filter IS NULL OR (p_status_filter = 'active' AND cm.is_active) OR (p_status_filter = 'inactive' AND NOT cm.is_active))
          AND (p_company_id IS NULL OR c.id = p_company_id)
          AND (v_cat IS NULL OR (SELECT lower(left(ac.code, 1)) FROM atc_codes ac WHERE ac.id = s.atc_code_id) = v_cat)
          AND (p_date_from IS NULL OR cm.designated_at::date >= p_date_from)
          AND (p_date_to IS NULL OR cm.designated_at::date <= p_date_to)
          AND (
              search_term IS NULL OR
              s.name ILIKE '%' || search_term || '%' OR
              s.sku_code ILIKE '%' || search_term || '%' OR
              p.name ILIKE '%' || search_term || '%' OR
              c.name ILIKE '%' || search_term || '%'
          )
    ),
    cnt AS (SELECT COUNT(*)::int AS n FROM base)
    SELECT
        cnt.n,
        (
            SELECT jsonb_agg(
                jsonb_build_object(
                    'product_id', b.product_id,
                    'product_name', b.product_name,
                    'company_id', b.company_id,
                    'company_name', b.company_name,
                    'atc_code', b.atc_code,
                    'sku_id', b.sku_id,
                    'sku_code', b.sku_code,
                    'sku_name', b.sku_name,
                    'designated_at', b.designated_at,
                    'designated_by', b.designated_by,
                    'designated_by_name', b.designated_by_name,
                    'is_active', b.is_active,
                    'justification', b.justification
                )
            )
            FROM (
                SELECT * FROM base
                ORDER BY
                    CASE WHEN v_order = 'asc' THEN
                        CASE v_sort
                            WHEN 'designated_at' THEN designated_at::text
                            WHEN 'product_name' THEN product_name
                            WHEN 'company_name' THEN company_name
                            WHEN 'sku_code' THEN sku_code
                            ELSE designated_at::text
                        END
                    END ASC NULLS LAST,
                    CASE WHEN v_order = 'desc' THEN
                        CASE v_sort
                            WHEN 'designated_at' THEN designated_at::text
                            WHEN 'product_name' THEN product_name
                            WHEN 'company_name' THEN company_name
                            WHEN 'sku_code' THEN sku_code
                            ELSE designated_at::text
                        END
                    END DESC NULLS LAST
                LIMIT v_page_size
                OFFSET v_offset
            ) b
        )
    INTO v_total, v_rows
    FROM cnt;

    RETURN jsonb_build_object(
        'critical_medicines', COALESCE(v_rows, '[]'::jsonb),
        'pagination', jsonb_build_object(
            'page_number', page_number,
            'page_size', v_page_size,
            'total_count', COALESCE(v_total, 0),
            'total', COALESCE(v_total, 0),
            'total_pages', CEIL(GREATEST(COALESCE(v_total, 0), 1)::numeric / v_page_size),
            'has_more', page_number * v_page_size < COALESCE(v_total, 0)
        )
    );
END;
$$;

COMMIT;
