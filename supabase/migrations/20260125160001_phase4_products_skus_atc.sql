-- Migration: phase4_products_skus_atc
-- Description: Phase 4 — Products: date range, sku_count, atc_code, company_name;
--   SKUs: date range, dosage_form filter, atc_code in response;
--   ATC codes: level_filter, category_filter, level in response.
-- Wireframes: task-0.5.2.4, task-0.5.2.6, task-0.5.2.14

BEGIN;

-- ============================================================================
-- 3. rmm_list_products: p_date_from, p_date_to, sku_count, atc_code, company_name (Tasks 4.1, 4.5)
-- ============================================================================

CREATE OR REPLACE FUNCTION rmm_list_products(
    user_id uuid,
    company_id uuid DEFAULT NULL,
    page_number integer DEFAULT 1,
    page_size integer DEFAULT 50,
    is_critical_medicine_filter boolean DEFAULT NULL,
    search_term text DEFAULT NULL,
    sort_by text DEFAULT 'name',
    sort_order text DEFAULT 'asc',
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
    v_products jsonb;
    v_total_count integer;
    v_offset integer;
    v_validated_page_size integer;
    v_validated_sort_by text;
    v_validated_sort_order text;
    v_filtered_company_id uuid;
BEGIN
    SELECT u.id, u.role, u.company_id, u.is_active
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

    v_validated_page_size := page_size;
    v_offset := (page_number - 1) * v_validated_page_size;

    IF sort_by NOT IN ('name', 'created_at', 'updated_at') THEN
        sort_by := 'name';
    END IF;
    v_validated_sort_by := sort_by;

    IF lower(sort_order) NOT IN ('asc', 'desc') THEN
        sort_order := 'asc';
    END IF;
    v_validated_sort_order := lower(sort_order);

    IF v_user_record.role IN ('company_admin', 'company_manager', 'company_user', 'vendor') THEN
        v_filtered_company_id := v_user_record.company_id;
    ELSE
        v_filtered_company_id := company_id;
    END IF;

    SELECT COUNT(*)
    INTO v_total_count
    FROM products p
    WHERE (v_filtered_company_id IS NULL OR p.company_id = v_filtered_company_id)
    AND (is_critical_medicine_filter IS NULL OR p.is_critical_medicine = is_critical_medicine_filter)
    AND (
        search_term IS NULL OR
        p.name ILIKE '%' || search_term || '%' OR
        p.description ILIKE '%' || search_term || '%'
    )
    AND (p_date_from IS NULL OR p.created_at::date >= p_date_from)
    AND (p_date_to IS NULL OR p.created_at::date <= p_date_to);

    SELECT jsonb_agg(
        jsonb_build_object(
            'id', sub.id,
            'company_id', sub.company_id,
            'company_name', sub.company_name,
            'name', sub.name,
            'description', sub.description,
            'is_critical_medicine', sub.is_critical_medicine,
            'is_active', sub.is_active,
            'created_at', sub.created_at,
            'updated_at', sub.updated_at,
            'atc_code', sub.atc_code,
            'sku_count', sub.sku_count
        )
    )
    INTO v_products
    FROM (
        SELECT
            p.id,
            p.company_id,
            (SELECT c.name FROM companies c WHERE c.id = p.company_id) AS company_name,
            p.name,
            p.description,
            p.is_critical_medicine,
            p.is_active,
            p.created_at,
            p.updated_at,
            (SELECT ac.code FROM skus s JOIN atc_codes ac ON ac.id = s.atc_code_id WHERE s.product_id = p.id LIMIT 1) AS atc_code,
            (SELECT COUNT(*)::integer FROM skus s WHERE s.product_id = p.id) AS sku_count
        FROM products p
        WHERE (v_filtered_company_id IS NULL OR p.company_id = v_filtered_company_id)
        AND (is_critical_medicine_filter IS NULL OR p.is_critical_medicine = is_critical_medicine_filter)
        AND (
            search_term IS NULL OR
            p.name ILIKE '%' || search_term || '%' OR
            p.description ILIKE '%' || search_term || '%'
        )
        AND (p_date_from IS NULL OR p.created_at::date >= p_date_from)
        AND (p_date_to IS NULL OR p.created_at::date <= p_date_to)
        ORDER BY
            CASE v_validated_sort_by
                WHEN 'name' THEN p.name
                WHEN 'created_at' THEN p.created_at::text
                WHEN 'updated_at' THEN p.updated_at::text
                ELSE p.name
            END
        ASC NULLS LAST
        LIMIT v_validated_page_size
        OFFSET v_offset
    ) sub;

    RETURN jsonb_build_object(
        'products', COALESCE(v_products, '[]'::jsonb),
        'pagination', jsonb_build_object(
            'page_number', page_number,
            'page_size', v_validated_page_size,
            'total_count', COALESCE(v_total_count, 0),
            'total_pages', CEIL(GREATEST(COALESCE(v_total_count, 0), 1)::numeric / v_validated_page_size)
        )
    );
END;
$$;

-- ============================================================================
-- 4. rmm_list_skus: p_date_from, p_date_to, p_dosage_form_filter, atc_code (Tasks 4.1, 4.2, 4.6)
-- ============================================================================

CREATE OR REPLACE FUNCTION rmm_list_skus(
    user_id uuid,
    product_id uuid DEFAULT NULL,
    page_number integer DEFAULT 1,
    page_size integer DEFAULT 50,
    atc_code_id_filter uuid DEFAULT NULL,
    search_term text DEFAULT NULL,
    sort_by text DEFAULT 'name',
    sort_order text DEFAULT 'asc',
    p_date_from date DEFAULT NULL,
    p_date_to date DEFAULT NULL,
    p_dosage_form_filter text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_user_record RECORD;
    v_skus jsonb;
    v_total_count integer;
    v_offset integer;
    v_validated_page_size integer;
    v_validated_sort_by text;
    v_validated_sort_order text;
BEGIN
    SELECT u.id, u.role, u.company_id, u.is_active
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

    IF sort_by NOT IN ('name', 'sku_code', 'dosage_strength', 'created_at', 'updated_at') THEN
        sort_by := 'name';
    END IF;
    v_validated_sort_by := sort_by;

    IF lower(sort_order) NOT IN ('asc', 'desc') THEN
        sort_order := 'asc';
    END IF;
    v_validated_sort_order := lower(sort_order);

    v_validated_page_size := page_size;
    v_offset := (page_number - 1) * v_validated_page_size;

    IF v_user_record.role IN ('company_admin', 'company_manager', 'company_user', 'vendor') THEN
        SELECT COUNT(*)
        INTO v_total_count
        FROM skus s
        JOIN products p ON s.product_id = p.id
        WHERE p.company_id = v_user_record.company_id
        AND (product_id IS NULL OR s.product_id = product_id)
        AND (atc_code_id_filter IS NULL OR s.atc_code_id = atc_code_id_filter)
        AND (p_dosage_form_filter IS NULL OR s.dosage_form = p_dosage_form_filter)
        AND (p_date_from IS NULL OR s.created_at::date >= p_date_from)
        AND (p_date_to IS NULL OR s.created_at::date <= p_date_to)
        AND (
            search_term IS NULL OR
            s.name ILIKE '%' || search_term || '%' OR
            s.sku_code ILIKE '%' || search_term || '%' OR
            s.dosage_strength ILIKE '%' || search_term || '%' OR
            s.dosage_form ILIKE '%' || search_term || '%'
        );

        SELECT jsonb_agg(
            jsonb_build_object(
                'id', sub.id,
                'product_id', sub.product_id,
                'sku_code', sub.sku_code,
                'name', sub.name,
                'dosage_strength', sub.dosage_strength,
                'dosage_form', sub.dosage_form,
                'pack_size', sub.pack_size,
                'unit_of_measure', sub.unit_of_measure,
                'atc_code_id', sub.atc_code_id,
                'atc_code', sub.atc_code,
                'is_moh_authorized_unregistered', sub.is_moh_authorized_unregistered,
                'is_active', sub.is_active,
                'created_at', sub.created_at,
                'updated_at', sub.updated_at
            )
        )
        INTO v_skus
        FROM (
            SELECT
                s.id, s.product_id, s.sku_code, s.name, s.dosage_strength, s.dosage_form,
                s.pack_size, s.unit_of_measure, s.atc_code_id,
                (SELECT ac.code FROM atc_codes ac WHERE ac.id = s.atc_code_id) AS atc_code,
                s.is_moh_authorized_unregistered, s.is_active, s.created_at, s.updated_at
            FROM skus s
            JOIN products p ON s.product_id = p.id
            WHERE p.company_id = v_user_record.company_id
            AND (product_id IS NULL OR s.product_id = product_id)
            AND (atc_code_id_filter IS NULL OR s.atc_code_id = atc_code_id_filter)
            AND (p_dosage_form_filter IS NULL OR s.dosage_form = p_dosage_form_filter)
            AND (p_date_from IS NULL OR s.created_at::date >= p_date_from)
            AND (p_date_to IS NULL OR s.created_at::date <= p_date_to)
            AND (
                search_term IS NULL OR
                s.name ILIKE '%' || search_term || '%' OR
                s.sku_code ILIKE '%' || search_term || '%' OR
                s.dosage_strength ILIKE '%' || search_term || '%' OR
                s.dosage_form ILIKE '%' || search_term || '%'
            )
            ORDER BY
                CASE v_validated_sort_by
                    WHEN 'name' THEN s.name
                    WHEN 'sku_code' THEN s.sku_code
                    WHEN 'dosage_strength' THEN s.dosage_strength
                    WHEN 'created_at' THEN s.created_at::text
                    WHEN 'updated_at' THEN s.updated_at::text
                    ELSE s.name
                END
            ASC NULLS LAST
            LIMIT v_validated_page_size
            OFFSET v_offset
        ) sub;
    ELSE
        SELECT COUNT(*)
        INTO v_total_count
        FROM skus s
        WHERE (product_id IS NULL OR s.product_id = product_id)
        AND (atc_code_id_filter IS NULL OR s.atc_code_id = atc_code_id_filter)
        AND (p_dosage_form_filter IS NULL OR s.dosage_form = p_dosage_form_filter)
        AND (p_date_from IS NULL OR s.created_at::date >= p_date_from)
        AND (p_date_to IS NULL OR s.created_at::date <= p_date_to)
        AND (
            search_term IS NULL OR
            s.name ILIKE '%' || search_term || '%' OR
            s.sku_code ILIKE '%' || search_term || '%' OR
            s.dosage_strength ILIKE '%' || search_term || '%' OR
            s.dosage_form ILIKE '%' || search_term || '%'
        );

        SELECT jsonb_agg(
            jsonb_build_object(
                'id', sub.id,
                'product_id', sub.product_id,
                'sku_code', sub.sku_code,
                'name', sub.name,
                'dosage_strength', sub.dosage_strength,
                'dosage_form', sub.dosage_form,
                'pack_size', sub.pack_size,
                'unit_of_measure', sub.unit_of_measure,
                'atc_code_id', sub.atc_code_id,
                'atc_code', sub.atc_code,
                'is_moh_authorized_unregistered', sub.is_moh_authorized_unregistered,
                'is_active', sub.is_active,
                'created_at', sub.created_at,
                'updated_at', sub.updated_at
            )
        )
        INTO v_skus
        FROM (
            SELECT
                s.id, s.product_id, s.sku_code, s.name, s.dosage_strength, s.dosage_form,
                s.pack_size, s.unit_of_measure, s.atc_code_id,
                (SELECT ac.code FROM atc_codes ac WHERE ac.id = s.atc_code_id) AS atc_code,
                s.is_moh_authorized_unregistered, s.is_active, s.created_at, s.updated_at
            FROM skus s
            WHERE (product_id IS NULL OR s.product_id = product_id)
            AND (atc_code_id_filter IS NULL OR s.atc_code_id = atc_code_id_filter)
            AND (p_dosage_form_filter IS NULL OR s.dosage_form = p_dosage_form_filter)
            AND (p_date_from IS NULL OR s.created_at::date >= p_date_from)
            AND (p_date_to IS NULL OR s.created_at::date <= p_date_to)
            AND (
                search_term IS NULL OR
                s.name ILIKE '%' || search_term || '%' OR
                s.sku_code ILIKE '%' || search_term || '%' OR
                s.dosage_strength ILIKE '%' || search_term || '%' OR
                s.dosage_form ILIKE '%' || search_term || '%'
            )
            ORDER BY
                CASE v_validated_sort_by
                    WHEN 'name' THEN s.name
                    WHEN 'sku_code' THEN s.sku_code
                    WHEN 'dosage_strength' THEN s.dosage_strength
                    WHEN 'created_at' THEN s.created_at::text
                    WHEN 'updated_at' THEN s.updated_at::text
                    ELSE s.name
                END
            ASC NULLS LAST
            LIMIT v_validated_page_size
            OFFSET v_offset
        ) sub;
    END IF;

    RETURN jsonb_build_object(
        'skus', COALESCE(v_skus, '[]'::jsonb),
        'pagination', jsonb_build_object(
            'page_number', page_number,
            'page_size', v_validated_page_size,
            'total_count', COALESCE(v_total_count, 0),
            'total_pages', CEIL(GREATEST(COALESCE(v_total_count, 0), 1)::numeric / v_validated_page_size)
        )
    );
END;
$$;

-- ============================================================================
-- 5. rmm_list_atc_codes: p_level_filter, p_category_filter, level in response (Task 4.4)
-- Level: 1=length 1, 2=length 2-3, 3=length 4, 4=length 5+
-- Category: left(code,1) e.g. A, B, C
-- ============================================================================

CREATE OR REPLACE FUNCTION rmm_list_atc_codes(
    user_id uuid,
    page_number integer DEFAULT 1,
    page_size integer DEFAULT 50,
    is_active_filter boolean DEFAULT NULL,
    search_term text DEFAULT NULL,
    sort_by text DEFAULT 'code',
    sort_order text DEFAULT 'asc',
    p_level_filter integer DEFAULT NULL,
    p_category_filter text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_user_record RECORD;
    v_atc_codes jsonb;
    v_total_count integer;
    v_offset integer;
    v_validated_page_size integer;
    v_validated_sort_by text;
    v_validated_sort_order text;
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

    v_validated_page_size := page_size;
    v_offset := (page_number - 1) * v_validated_page_size;

    IF sort_by NOT IN ('code', 'created_at', 'updated_at') THEN
        sort_by := 'code';
    END IF;
    v_validated_sort_by := sort_by;

    IF lower(sort_order) NOT IN ('asc', 'desc') THEN
        sort_order := 'asc';
    END IF;
    v_validated_sort_order := lower(sort_order);

    IF p_level_filter IS NOT NULL AND p_level_filter NOT IN (1, 2, 3, 4) THEN
        p_level_filter := NULL;
    END IF;

    IF p_category_filter IS NOT NULL AND length(trim(p_category_filter)) <> 1 THEN
        p_category_filter := NULL;
    END IF;
    v_cat := NULLIF(trim(lower(p_category_filter)), '');

    WITH base AS (
        SELECT
            a.id,
            a.code,
            a.description,
            a.is_active,
            a.created_at,
            a.updated_at,
            CASE
                WHEN length(a.code) = 1 THEN 1
                WHEN length(a.code) <= 3 THEN 2
                WHEN length(a.code) = 4 THEN 3
                ELSE 4
            END AS level
        FROM atc_codes a
        WHERE (is_active_filter IS NULL OR a.is_active = is_active_filter)
        AND (
            search_term IS NULL OR
            a.code ILIKE '%' || search_term || '%' OR
            a.description ILIKE '%' || search_term || '%'
        )
        AND (p_level_filter IS NULL OR (
            CASE
                WHEN length(a.code) = 1 THEN 1
                WHEN length(a.code) <= 3 THEN 2
                WHEN length(a.code) = 4 THEN 3
                ELSE 4
            END
        ) = p_level_filter)
        AND (v_cat IS NULL OR lower(left(a.code, 1)) = v_cat)
    ),
    counted AS (
        SELECT COUNT(*)::integer AS n FROM base
    )
    SELECT
        (SELECT n FROM counted),
        jsonb_agg(
            jsonb_build_object(
                'id', b.id,
                'code', b.code,
                'description', b.description,
                'is_active', b.is_active,
                'created_at', b.created_at,
                'updated_at', b.updated_at,
                'level', b.level
            )
        )
    INTO v_total_count, v_atc_codes
    FROM (
        SELECT b.*
        FROM base b
        ORDER BY
            CASE v_validated_sort_by
                WHEN 'code' THEN b.code
                WHEN 'created_at' THEN b.created_at::text
                WHEN 'updated_at' THEN b.updated_at::text
                ELSE b.code
            END
        ASC NULLS LAST
        LIMIT v_validated_page_size
        OFFSET v_offset
    ) b;

    RETURN jsonb_build_object(
        'atc_codes', COALESCE(v_atc_codes, '[]'::jsonb),
        'pagination', jsonb_build_object(
            'page_number', page_number,
            'page_size', v_validated_page_size,
            'total_count', COALESCE(v_total_count, 0),
            'total_pages', CEIL(GREATEST(COALESCE(v_total_count, 0), 1)::numeric / v_validated_page_size)
        )
    );
END;
$$;

COMMIT;
