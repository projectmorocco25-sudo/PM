-- Phase 6 Task 6.7: Add Company filter to rmm_list_companies (MOH)
-- Wireframe: task-0.5.2.2-companies-list.md — Company filter (multi-select)
-- Extends rmm_list_companies with p_company_id; when set, MOH list is filtered to that company.

BEGIN;

CREATE OR REPLACE FUNCTION rmm_list_companies(
    user_id uuid,
    page_number integer DEFAULT 1,
    page_size integer DEFAULT 50,
    company_type_filter text DEFAULT NULL,
    search_term text DEFAULT NULL,
    sort_by text DEFAULT 'name',
    sort_order text DEFAULT 'asc',
    p_date_from date DEFAULT NULL,
    p_date_to date DEFAULT NULL,
    p_company_id uuid DEFAULT NULL
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
        AND (v_date_to IS NULL OR c.created_at::date <= v_date_to)
        AND (p_company_id IS NULL OR c.id = p_company_id);

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
            AND (p_company_id IS NULL OR c.id = p_company_id)
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

COMMIT;
