-- Migration: fix_rmm_list_submissions_order_by_type_mismatch
-- Description: Fix "CASE types timestamp with time zone and text cannot be matched" in ORDER BY
-- Date: 2026-01-25
-- Root cause: ORDER BY CASE mixed timestamptz (created_at, updated_at) with text (status, etc.);
--             PostgreSQL requires all CASE branches to have the same type.
-- Fix: Cast timestamp columns to text in sort CASE so all branches return text. ISO format sorts correctly.

BEGIN;

CREATE OR REPLACE FUNCTION rmm_list_submissions(
    p_limit integer DEFAULT 100,
    p_offset integer DEFAULT 0,
    p_status text DEFAULT NULL,
    p_submission_type text DEFAULT NULL,
    p_entity_type text DEFAULT NULL,
    p_company_id uuid DEFAULT NULL,
    p_search text DEFAULT NULL,
    p_sort_by text DEFAULT 'created_at',
    p_sort_order text DEFAULT 'DESC'
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
    v_filtered_count integer;
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
            rs.id,
            rs.submission_type,
            rs.entity_type,
            rs.entity_id,
            rs.submission_data,
            rs.status,
            rs.submitted_by,
            rs.verified_by,
            rs.verified_at,
            rs.approved_by,
            rs.approved_at,
            rs.implemented_by,
            rs.implemented_at,
            rs.rejection_reason,
            rs.created_at,
            rs.updated_at,
            CASE 
                WHEN rs.entity_type = 'company' AND rs.entity_id IS NOT NULL THEN
                    (SELECT name FROM companies WHERE id = rs.entity_id)
                WHEN rs.entity_type = 'product' AND rs.entity_id IS NOT NULL THEN
                    (SELECT c.name FROM products p JOIN companies c ON p.company_id = c.id WHERE p.id = rs.entity_id)
                WHEN rs.entity_type = 'sku' AND rs.entity_id IS NOT NULL THEN
                    (SELECT c.name FROM skus s JOIN products p ON s.product_id = p.id JOIN companies c ON p.company_id = c.id WHERE s.id = rs.entity_id)
                ELSE NULL
            END AS company_name,
            (SELECT full_name FROM users WHERE id = rs.submitted_by) AS submitted_by_name
        FROM registry_submissions rs
        WHERE 1=1
            AND (p_status IS NULL OR rs.status = p_status)
            AND (p_submission_type IS NULL OR rs.submission_type = p_submission_type)
            AND (p_entity_type IS NULL OR rs.entity_type = p_entity_type)
            AND (
                p_company_id IS NULL 
                OR (
                    (rs.entity_type = 'company' AND rs.entity_id = p_company_id)
                    OR (rs.entity_type = 'product' AND EXISTS (
                        SELECT 1 FROM products p WHERE p.id = rs.entity_id AND p.company_id = p_company_id
                    ))
                    OR (rs.entity_type = 'sku' AND EXISTS (
                        SELECT 1 FROM skus s 
                        JOIN products p ON s.product_id = p.id 
                        WHERE s.id = rs.entity_id AND p.company_id = p_company_id
                    ))
                    OR rs.submitted_by IN (
                        SELECT id FROM users WHERE company_id = p_company_id
                    )
                )
            )
            AND (
                p_search IS NULL 
                OR rs.submission_data::text ILIKE '%' || p_search || '%'
                OR rs.submission_type ILIKE '%' || p_search || '%'
                OR rs.entity_type ILIKE '%' || p_search || '%'
            )
    ),
    total_count AS (
        SELECT COUNT(*)::integer AS count FROM filtered_submissions
    ),
    ordered_submissions AS (
        SELECT fs.*
        FROM filtered_submissions fs
        ORDER BY 
            CASE WHEN p_sort_order = 'ASC' THEN
                CASE p_sort_by
                    WHEN 'created_at' THEN fs.created_at::text
                    WHEN 'updated_at' THEN fs.updated_at::text
                    WHEN 'status' THEN fs.status
                    WHEN 'submission_type' THEN fs.submission_type
                    WHEN 'entity_type' THEN fs.entity_type
                END
            END ASC NULLS LAST,
            CASE WHEN p_sort_order = 'DESC' THEN
                CASE p_sort_by
                    WHEN 'created_at' THEN fs.created_at::text
                    WHEN 'updated_at' THEN fs.updated_at::text
                    WHEN 'status' THEN fs.status
                    WHEN 'submission_type' THEN fs.submission_type
                    WHEN 'entity_type' THEN fs.entity_type
                END
            END DESC NULLS LAST
        LIMIT p_limit OFFSET p_offset
    )
    SELECT 
        jsonb_agg(
            jsonb_build_object(
                'id', os.id,
                'submission_type', os.submission_type,
                'entity_type', os.entity_type,
                'entity_id', os.entity_id,
                'submission_data', os.submission_data,
                'status', os.status,
                'submitted_by', os.submitted_by,
                'submitted_by_name', os.submitted_by_name,
                'verified_by', os.verified_by,
                'verified_at', os.verified_at,
                'approved_by', os.approved_by,
                'approved_at', os.approved_at,
                'implemented_by', os.implemented_by,
                'implemented_at', os.implemented_at,
                'rejection_reason', os.rejection_reason,
                'company_name', os.company_name,
                'created_at', os.created_at,
                'updated_at', os.updated_at
            )
        ),
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
