-- Migration: fix_rmm_get_submission_deadlines_group_by
-- Description: Fix "column deadline.due_date must appear in GROUP BY" - order/limit in subquery, then aggregate
-- Date: 2026-01-25
-- Task: Phase 1 - RMM Overview Page Fix
-- Issue: jsonb_agg(... ORDER BY deadline.due_date) triggers GROUP BY error; same pattern as rmm_get_recent_activity fix

BEGIN;

CREATE OR REPLACE FUNCTION rmm_get_submission_deadlines(
    user_id uuid
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_user_record RECORD;
    v_company_id uuid;
    v_deadlines jsonb;
    v_current_date date;
    v_annual_registry_due date;
    v_weekly_stock_due date;
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
        v_company_id := v_user_record.company_id;
    ELSE
        v_company_id := NULL;
    END IF;

    v_current_date := CURRENT_DATE;

    -- Annual Registry: Due March 31 of each year
    v_annual_registry_due := (DATE_TRUNC('year', v_current_date) + INTERVAL '1 year' + INTERVAL '2 months' + INTERVAL '30 days')::date;
    IF v_annual_registry_due < v_current_date THEN
        v_annual_registry_due := (v_annual_registry_due + INTERVAL '1 year')::date;
    END IF;

    -- Weekly Stock Report: next Saturday (DOW 6)
    v_weekly_stock_due := v_current_date + (6 - EXTRACT(DOW FROM v_current_date)::integer)::integer;
    IF v_weekly_stock_due <= v_current_date THEN
        v_weekly_stock_due := (v_weekly_stock_due + INTERVAL '7 days')::date;
    END IF;

    -- Order and limit in subquery, then aggregate (no ORDER BY inside jsonb_agg)
    SELECT jsonb_agg(
        jsonb_build_object(
            'submission_type', d.submission_type,
            'due_date', d.due_date,
            'days_remaining', d.days_remaining,
            'regulatory_reference', d.regulatory_reference,
            'regulatory_description', d.regulatory_description
        )
    )
    INTO v_deadlines
    FROM (
        SELECT
            deadline.submission_type,
            deadline.due_date,
            deadline.days_remaining,
            deadline.regulatory_reference,
            deadline.regulatory_description
        FROM (
            SELECT
                'Annual Registry'::text as submission_type,
                v_annual_registry_due as due_date,
                (v_annual_registry_due - v_current_date)::integer as days_remaining,
                'DMP Art. 12'::text as regulatory_reference,
                'Annual Submission'::text as regulatory_description
            UNION ALL
            SELECT
                'Weekly Stock Report'::text,
                v_weekly_stock_due,
                (v_weekly_stock_due - v_current_date)::integer,
                'DMP Art. 12'::text,
                'Weekly Stock Report'::text
        ) deadline
        WHERE deadline.days_remaining >= 0
        ORDER BY deadline.due_date ASC
        LIMIT 10
    ) d;

    RETURN COALESCE(v_deadlines, '[]'::jsonb);
END;
$$;

COMMIT;
