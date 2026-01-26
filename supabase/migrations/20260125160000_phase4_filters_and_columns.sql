-- Migration: phase4_filters_and_columns
-- Description: Phase 4 — Date range filters (4 list RPCs); dosage_form + atc_code (SKUs);
--   sku_count + atc_code + company_name (products); level + category (ATC codes).
-- Wireframes: task-0.5.2.2, task-0.5.2.4, task-0.5.2.6, task-0.5.2.11, task-0.5.2.14

BEGIN;

-- ============================================================================
-- 1. rmm_list_companies: add p_date_from, p_date_to (Phase 4 Task 4.1)
-- ============================================================================

CREATE OR REPLACE FUNCTION rmm_list_companies(
    user_id uuid,
    page_number integer DEFAULT 1,
    page_size integer DEFAULT 50,
    company_type_filter text DEFAULT NULL,
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
    v_companies jsonb;
    v_total_count integer;
    v_offset integer;
    v_validated_page_size integer;
    v_validated_sort_by text;
    v_validated_sort_order text;
    v_total_pages integer;
    v_date_from date := p_date_from;
    v_date_to date := p_date_to;
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

    IF sort_by NOT IN ('name', 'registration_number', 'company_type', 'created_at', 'updated_at') THEN
        sort_by := 'name';
    END IF;
    v_validated_sort_by := sort_by;

    IF lower(sort_order) NOT IN ('asc', 'desc') THEN
        sort_order := 'asc';
    END IF;
    v_validated_sort_order := lower(sort_order);

    IF company_type_filter IS NOT NULL AND company_type_filter NOT IN ('ipc', 'wholesaler') THEN
        company_type_filter := NULL;
    END IF;

    IF v_user_record.role IN ('company_admin', 'company_manager', 'company_user', 'vendor') THEN
        SELECT COUNT(*)
        INTO v_total_count
        FROM companies c
        WHERE c.id = v_user_record.company_id
        AND (company_type_filter IS NULL OR c.company_type = company_type_filter)
        AND (
            search_term IS NULL OR
            c.name ILIKE '%' || search_term || '%' OR
            c.registration_number ILIKE '%' || search_term || '%'
        )
        AND (v_date_from IS NULL OR c.created_at::date >= v_date_from)
        AND (v_date_to IS NULL OR c.created_at::date <= v_date_to);

        SELECT jsonb_agg(
            jsonb_build_object(
                'id', sub.id,
                'name', sub.name,
                'registration_number', sub.registration_number,
                'company_type', sub.company_type,
                'address', sub.address,
                'contact_email', sub.contact_email,
                'contact_phone', sub.contact_phone,
                'is_active', sub.is_active,
                'created_at', sub.created_at,
                'updated_at', sub.updated_at,
                'compliance_status', sub.compliance_status,
                'violation_count', sub.violation_count,
                'enforcement_count', sub.enforcement_count
            )
        )
        INTO v_companies
        FROM (
            SELECT
                c.id, c.name, c.registration_number, c.company_type,
                c.address, c.contact_email, c.contact_phone, c.is_active,
                c.created_at, c.updated_at,
                CASE
                    WHEN COALESCE(es.pending_count, 0) > 0 THEN 'under_review'::text
                    WHEN COALESCE(es.violation_count, 0) > 0 THEN 'non_compliant'::text
                    ELSE 'compliant'::text
                END AS compliance_status,
                COALESCE(es.violation_count, 0)::integer AS violation_count,
                COALESCE(es.enforcement_count, 0)::integer AS enforcement_count
            FROM companies c
            LEFT JOIN (
                SELECT ea.company_id,
                    COUNT(*) FILTER (WHERE ea.status IN ('executed', 'appealed') AND ea.action_type IN ('fine', 'suspension'))::integer AS violation_count,
                    COUNT(*) FILTER (WHERE ea.status IN ('executed', 'appealed'))::integer AS enforcement_count,
                    COUNT(*) FILTER (WHERE ea.status IN ('draft', 'pending_review', 'pending_approval', 'approved'))::integer AS pending_count
                FROM enforcement_actions ea
                GROUP BY ea.company_id
            ) es ON es.company_id = c.id
            WHERE c.id = v_user_record.company_id
            AND (company_type_filter IS NULL OR c.company_type = company_type_filter)
            AND (
                search_term IS NULL OR
                c.name ILIKE '%' || search_term || '%' OR
                c.registration_number ILIKE '%' || search_term || '%'
            )
            AND (v_date_from IS NULL OR c.created_at::date >= v_date_from)
            AND (v_date_to IS NULL OR c.created_at::date <= v_date_to)
            ORDER BY
                CASE WHEN v_validated_sort_order = 'asc' THEN
                    CASE v_validated_sort_by
                        WHEN 'name' THEN c.name
                        WHEN 'registration_number' THEN c.registration_number
                        WHEN 'company_type' THEN c.company_type
                        WHEN 'created_at' THEN c.created_at::text
                        WHEN 'updated_at' THEN c.updated_at::text
                        ELSE c.name
                    END
                ELSE NULL
                END ASC NULLS LAST,
                CASE WHEN v_validated_sort_order = 'desc' THEN
                    CASE v_validated_sort_by
                        WHEN 'name' THEN c.name
                        WHEN 'registration_number' THEN c.registration_number
                        WHEN 'company_type' THEN c.company_type
                        WHEN 'created_at' THEN c.created_at::text
                        WHEN 'updated_at' THEN c.updated_at::text
                        ELSE c.name
                    END
                ELSE NULL
                END DESC NULLS LAST
            LIMIT v_validated_page_size
            OFFSET v_offset
        ) sub;
    ELSE
        SELECT COUNT(*)
        INTO v_total_count
        FROM companies c
        WHERE (company_type_filter IS NULL OR c.company_type = company_type_filter)
        AND (
            search_term IS NULL OR
            c.name ILIKE '%' || search_term || '%' OR
            c.registration_number ILIKE '%' || search_term || '%'
        )
        AND (v_date_from IS NULL OR c.created_at::date >= v_date_from)
        AND (v_date_to IS NULL OR c.created_at::date <= v_date_to);

        SELECT jsonb_agg(
            jsonb_build_object(
                'id', sub.id,
                'name', sub.name,
                'registration_number', sub.registration_number,
                'company_type', sub.company_type,
                'address', sub.address,
                'contact_email', sub.contact_email,
                'contact_phone', sub.contact_phone,
                'is_active', sub.is_active,
                'created_at', sub.created_at,
                'updated_at', sub.updated_at,
                'compliance_status', sub.compliance_status,
                'violation_count', sub.violation_count,
                'enforcement_count', sub.enforcement_count
            )
        )
        INTO v_companies
        FROM (
            SELECT
                c.id, c.name, c.registration_number, c.company_type,
                c.address, c.contact_email, c.contact_phone, c.is_active,
                c.created_at, c.updated_at,
                CASE
                    WHEN COALESCE(es.pending_count, 0) > 0 THEN 'under_review'::text
                    WHEN COALESCE(es.violation_count, 0) > 0 THEN 'non_compliant'::text
                    ELSE 'compliant'::text
                END AS compliance_status,
                COALESCE(es.violation_count, 0)::integer AS violation_count,
                COALESCE(es.enforcement_count, 0)::integer AS enforcement_count
            FROM companies c
            LEFT JOIN (
                SELECT ea.company_id,
                    COUNT(*) FILTER (WHERE ea.status IN ('executed', 'appealed') AND ea.action_type IN ('fine', 'suspension'))::integer AS violation_count,
                    COUNT(*) FILTER (WHERE ea.status IN ('executed', 'appealed'))::integer AS enforcement_count,
                    COUNT(*) FILTER (WHERE ea.status IN ('draft', 'pending_review', 'pending_approval', 'approved'))::integer AS pending_count
                FROM enforcement_actions ea
                GROUP BY ea.company_id
            ) es ON es.company_id = c.id
            WHERE (company_type_filter IS NULL OR c.company_type = company_type_filter)
            AND (
                search_term IS NULL OR
                c.name ILIKE '%' || search_term || '%' OR
                c.registration_number ILIKE '%' || search_term || '%'
            )
            AND (v_date_from IS NULL OR c.created_at::date >= v_date_from)
            AND (v_date_to IS NULL OR c.created_at::date <= v_date_to)
            ORDER BY
                CASE WHEN v_validated_sort_order = 'asc' THEN
                    CASE v_validated_sort_by
                        WHEN 'name' THEN c.name
                        WHEN 'registration_number' THEN c.registration_number
                        WHEN 'company_type' THEN c.company_type
                        WHEN 'created_at' THEN c.created_at::text
                        WHEN 'updated_at' THEN c.updated_at::text
                        ELSE c.name
                    END
                ELSE NULL
                END ASC NULLS LAST,
                CASE WHEN v_validated_sort_order = 'desc' THEN
                    CASE v_validated_sort_by
                        WHEN 'name' THEN c.name
                        WHEN 'registration_number' THEN c.registration_number
                        WHEN 'company_type' THEN c.company_type
                        WHEN 'created_at' THEN c.created_at::text
                        WHEN 'updated_at' THEN c.updated_at::text
                        ELSE c.name
                    END
                ELSE NULL
                END DESC NULLS LAST
            LIMIT v_validated_page_size
            OFFSET v_offset
        ) sub;
    END IF;

    v_total_pages := CEIL(GREATEST(COALESCE(v_total_count, 0), 1)::numeric / v_validated_page_size);

    RETURN jsonb_build_object(
        'companies', COALESCE(v_companies, '[]'::jsonb),
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
-- 2. rmm_list_submissions: add p_date_from, p_date_to (Phase 4 Task 4.1)
-- ============================================================================

CREATE OR REPLACE FUNCTION rmm_list_submissions(
    p_limit integer DEFAULT 100,
    p_offset integer DEFAULT 0,
    p_status text DEFAULT NULL,
    p_submission_type text DEFAULT NULL,
    p_entity_type text DEFAULT NULL,
    p_company_id uuid DEFAULT NULL,
    p_search text DEFAULT NULL,
    p_sort_by text DEFAULT 'created_at',
    p_sort_order text DEFAULT 'DESC',
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
    v_submissions jsonb;
    v_total_count integer;
BEGIN
    SELECT u.id, u.role, u.company_id, u.is_active
    INTO v_user_record
    FROM users u
    WHERE u.id = auth.uid();

    IF NOT FOUND THEN
        RAISE EXCEPTION 'User not found';
    END IF;

    IF NOT v_user_record.is_active THEN
        RAISE EXCEPTION 'User is not active';
    END IF;

    IF v_user_record.role IN ('company_admin', 'company_manager', 'company_user', 'vendor') THEN
        IF v_user_record.company_id IS NULL THEN
            RAISE EXCEPTION 'Company user must be associated with a company';
        END IF;
        p_company_id := v_user_record.company_id;
    END IF;

    IF p_limit < 1 OR p_limit > 1000 THEN
        RAISE EXCEPTION 'Limit must be between 1 and 1000';
    END IF;

    IF p_offset < 0 THEN
        RAISE EXCEPTION 'Offset must be >= 0';
    END IF;

    IF p_sort_by NOT IN ('created_at', 'updated_at', 'status', 'submission_type', 'entity_type') THEN
        RAISE EXCEPTION 'Invalid sort_by: %. Must be one of: created_at, updated_at, status, submission_type, entity_type', p_sort_by;
    END IF;

    IF p_sort_order NOT IN ('ASC', 'DESC') THEN
        RAISE EXCEPTION 'Invalid sort_order: %. Must be ASC or DESC', p_sort_order;
    END IF;

    WITH filtered_submissions AS (
        SELECT 
            rs.id, rs.submission_type, rs.entity_type, rs.entity_id, rs.submission_data,
            rs.status, rs.submitted_by, rs.verified_by, rs.verified_at, rs.approved_by, rs.approved_at,
            rs.implemented_by, rs.implemented_at, rs.rejection_reason, rs.created_at, rs.updated_at,
            CASE 
                WHEN rs.entity_type = 'company' AND rs.entity_id IS NOT NULL THEN (SELECT name FROM companies WHERE id = rs.entity_id)
                WHEN rs.entity_type = 'product' AND rs.entity_id IS NOT NULL THEN (SELECT c.name FROM products p JOIN companies c ON p.company_id = c.id WHERE p.id = rs.entity_id)
                WHEN rs.entity_type = 'sku' AND rs.entity_id IS NOT NULL THEN (SELECT c.name FROM skus s JOIN products p ON s.product_id = p.id JOIN companies c ON p.company_id = c.id WHERE s.id = rs.entity_id)
                ELSE NULL
            END AS company_name,
            (SELECT full_name FROM users WHERE id = rs.submitted_by) AS submitted_by_name
        FROM registry_submissions rs
        WHERE 1=1
            AND (p_status IS NULL OR rs.status = p_status)
            AND (p_submission_type IS NULL OR rs.submission_type = p_submission_type)
            AND (p_entity_type IS NULL OR rs.entity_type = p_entity_type)
            AND (p_date_from IS NULL OR rs.created_at::date >= p_date_from)
            AND (p_date_to IS NULL OR rs.created_at::date <= p_date_to)
            AND (
                p_company_id IS NULL 
                OR (
                    (rs.entity_type = 'company' AND rs.entity_id = p_company_id)
                    OR (rs.entity_type = 'product' AND EXISTS (SELECT 1 FROM products p WHERE p.id = rs.entity_id AND p.company_id = p_company_id))
                    OR (rs.entity_type = 'sku' AND EXISTS (SELECT 1 FROM skus s JOIN products p ON s.product_id = p.id WHERE s.id = rs.entity_id AND p.company_id = p_company_id))
                    OR rs.submitted_by IN (SELECT id FROM users WHERE company_id = p_company_id)
                )
            )
            AND (
                p_search IS NULL 
                OR rs.submission_data::text ILIKE '%' || p_search || '%'
                OR rs.submission_type ILIKE '%' || p_search || '%'
                OR rs.entity_type ILIKE '%' || p_search || '%'
            )
    ),
    total_count AS (SELECT COUNT(*)::integer AS count FROM filtered_submissions),
    ordered_submissions AS (
        SELECT fs.*
        FROM filtered_submissions fs
        ORDER BY 
            CASE WHEN p_sort_order = 'ASC' THEN CASE p_sort_by
                WHEN 'created_at' THEN fs.created_at::text
                WHEN 'updated_at' THEN fs.updated_at::text
                WHEN 'status' THEN fs.status
                WHEN 'submission_type' THEN fs.submission_type
                WHEN 'entity_type' THEN fs.entity_type
            END END ASC NULLS LAST,
            CASE WHEN p_sort_order = 'DESC' THEN CASE p_sort_by
                WHEN 'created_at' THEN fs.created_at::text
                WHEN 'updated_at' THEN fs.updated_at::text
                WHEN 'status' THEN fs.status
                WHEN 'submission_type' THEN fs.submission_type
                WHEN 'entity_type' THEN fs.entity_type
            END END DESC NULLS LAST
        LIMIT p_limit OFFSET p_offset
    )
    SELECT 
        jsonb_agg(jsonb_build_object(
            'id', os.id, 'submission_type', os.submission_type, 'entity_type', os.entity_type, 'entity_id', os.entity_id,
            'submission_data', os.submission_data, 'status', os.status, 'submitted_by', os.submitted_by, 'submitted_by_name', os.submitted_by_name,
            'verified_by', os.verified_by, 'verified_at', os.verified_at, 'approved_by', os.approved_by, 'approved_at', os.approved_at,
            'implemented_by', os.implemented_by, 'implemented_at', os.implemented_at, 'rejection_reason', os.rejection_reason,
            'company_name', os.company_name, 'created_at', os.created_at, 'updated_at', os.updated_at
        )),
        (SELECT count FROM total_count)
    INTO v_submissions, v_total_count
    FROM ordered_submissions os;

    RETURN jsonb_build_object(
        'data', COALESCE(v_submissions, '[]'::jsonb),
        'pagination', jsonb_build_object(
            'total', v_total_count,
            'limit', p_limit,
            'offset', p_offset,
            'has_more', (p_offset + p_limit) < v_total_count
        )
    );
END;
$$;

COMMIT;
