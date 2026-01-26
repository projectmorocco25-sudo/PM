-- Migration: phase3_company_products_stats
-- Description: Phase 3 — Extend rmm_list_company_products (atc_code, sku_count, pagination total/has_more);
--   add rmm_get_company_statistics and rmm_get_product_statistics.
-- Wireframe: task-0.5.2.3-company-detail.md (Products tab, Overview stats), task-0.5.2.5-product-detail.md (Overview stats)

BEGIN;

-- ============================================================================
-- rmm_list_company_products: add atc_code, sku_count; pagination total, has_more
-- ============================================================================

CREATE OR REPLACE FUNCTION rmm_list_company_products(
    user_id uuid,
    company_id uuid,
    page_number integer DEFAULT 1,
    page_size integer DEFAULT 50
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
    v_total_pages integer;
    v_offset integer;
    v_validated_page_size integer;
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

    IF v_user_record.role IN ('company_admin', 'company_manager', 'company_user', 'vendor') THEN
        IF v_user_record.company_id != company_id THEN
            RAISE EXCEPTION 'Insufficient permissions: You can only view products for your own company';
        END IF;
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

    IF NOT EXISTS (SELECT 1 FROM companies WHERE id = company_id) THEN
        RAISE EXCEPTION 'Company not found';
    END IF;

    SELECT COUNT(*)
    INTO v_total_count
    FROM products p
    WHERE p.company_id = company_id;

    v_total_pages := CEIL(COALESCE(v_total_count, 0)::numeric / v_validated_page_size);

    SELECT jsonb_agg(
        jsonb_build_object(
            'id', sub.id,
            'company_id', sub.company_id,
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
            p.name,
            p.description,
            p.is_critical_medicine,
            p.is_active,
            p.created_at,
            p.updated_at,
            (SELECT ac.code
             FROM skus s
             JOIN atc_codes ac ON ac.id = s.atc_code_id
             WHERE s.product_id = p.id
             LIMIT 1) AS atc_code,
            (SELECT COUNT(*)::integer FROM skus s WHERE s.product_id = p.id) AS sku_count
        FROM products p
        WHERE p.company_id = company_id
        ORDER BY p.name ASC
        LIMIT v_validated_page_size
        OFFSET v_offset
    ) sub;

    RETURN jsonb_build_object(
        'products', COALESCE(v_products, '[]'::jsonb),
        'pagination', jsonb_build_object(
            'page_number', page_number,
            'page_size', v_validated_page_size,
            'total_count', COALESCE(v_total_count, 0),
            'total', COALESCE(v_total_count, 0),
            'total_pages', v_total_pages,
            'has_more', page_number < v_total_pages
        )
    );
END;
$$;

-- ============================================================================
-- rmm_get_company_statistics(user_id uuid, company_id uuid)
-- Purpose: Phase 3 Task 3.4 — Company Overview stats (total/active products, total/active SKUs)
-- ============================================================================

CREATE OR REPLACE FUNCTION rmm_get_company_statistics(
    user_id uuid,
    company_id uuid
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_user_record RECORD;
    v_total_products integer;
    v_active_products integer;
    v_total_skus integer;
    v_active_skus integer;
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

    IF v_user_record.role IN ('company_admin', 'company_manager', 'company_user', 'vendor') THEN
        IF v_user_record.company_id != company_id THEN
            RAISE EXCEPTION 'Insufficient permissions: You can only view statistics for your own company';
        END IF;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM companies WHERE id = company_id) THEN
        RAISE EXCEPTION 'Company not found';
    END IF;

    SELECT COUNT(*), COUNT(*) FILTER (WHERE p.is_active) INTO v_total_products, v_active_products
    FROM products p
    WHERE p.company_id = company_id;

    SELECT COUNT(*), COUNT(*) FILTER (WHERE s.is_active) INTO v_total_skus, v_active_skus
    FROM skus s
    JOIN products p ON p.id = s.product_id
    WHERE p.company_id = company_id;

    RETURN jsonb_build_object(
        'total_products', COALESCE(v_total_products, 0),
        'active_products', COALESCE(v_active_products, 0),
        'total_skus', COALESCE(v_total_skus, 0),
        'active_skus', COALESCE(v_active_skus, 0)
    );
END;
$$;

-- ============================================================================
-- rmm_get_product_statistics(user_id uuid, product_id uuid)
-- Purpose: Phase 3 Task 3.7 — Product Overview stats (total/active SKUs)
-- ============================================================================

CREATE OR REPLACE FUNCTION rmm_get_product_statistics(
    user_id uuid,
    product_id uuid
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_user_record RECORD;
    v_product_company_id uuid;
    v_total_skus integer;
    v_active_skus integer;
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

    SELECT p.company_id INTO v_product_company_id
    FROM products p
    WHERE p.id = product_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Product not found';
    END IF;

    IF v_user_record.role IN ('company_admin', 'company_manager', 'company_user', 'vendor') THEN
        IF v_user_record.company_id != v_product_company_id THEN
            RAISE EXCEPTION 'Insufficient permissions: You can only view statistics for your own company''s products';
        END IF;
    END IF;

    SELECT COUNT(*), COUNT(*) FILTER (WHERE s.is_active) INTO v_total_skus, v_active_skus
    FROM skus s
    WHERE s.product_id = product_id;

    RETURN jsonb_build_object(
        'total_skus', COALESCE(v_total_skus, 0),
        'active_skus', COALESCE(v_active_skus, 0)
    );
END;
$$;

GRANT EXECUTE ON FUNCTION rmm_list_company_products(uuid, uuid, integer, integer) TO authenticated;
GRANT EXECUTE ON FUNCTION rmm_get_company_statistics(uuid, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION rmm_get_product_statistics(uuid, uuid) TO authenticated;

COMMIT;
