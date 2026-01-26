-- Migration: rmm_request_submission_info
-- Description: RPC for "Request Info" on submission detail (Phase 6 Task 6.9). MOH requests additional info; submitter is notified.
-- Tables: registry_submissions, notifications
-- UI calls: rmm_request_submission_info(p_submission_id, p_message)

BEGIN;

CREATE OR REPLACE FUNCTION rmm_request_submission_info(
    p_submission_id uuid,
    p_message text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_requester_id uuid;
    v_submission RECORD;
    v_notification_id uuid;
    v_submission_link text;
BEGIN
    v_requester_id := auth.uid();
    IF v_requester_id IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;

    IF p_submission_id IS NULL OR trim(COALESCE(p_message, '')) = '' THEN
        RAISE EXCEPTION 'Submission ID and message are required';
    END IF;

    -- Load submission
    SELECT id, submitted_by, status, entity_type, entity_id
    INTO v_submission
    FROM registry_submissions
    WHERE id = p_submission_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Submission not found';
    END IF;

    -- Requester must be MOH (tier1, tier2_officer, tier2_registrar, system_admin)
    IF NOT EXISTS (
        SELECT 1 FROM users u
        WHERE u.id = v_requester_id
          AND u.is_active = true
          AND u.role IN ('tier1', 'tier2_officer', 'tier2_registrar', 'system_admin')
    ) THEN
        RAISE EXCEPTION 'Only MOH users can request additional information';
    END IF;

    v_submission_link := '/rmm/submissions/' || p_submission_id::text;

    INSERT INTO notifications (user_id, type, title, message, link, is_read)
    VALUES (
        v_submission.submitted_by,
        'request_info',
        'Information requested for your submission',
        trim(p_message),
        v_submission_link,
        false
    )
    RETURNING id INTO v_notification_id;

    RETURN jsonb_build_object(
        'success', true,
        'notification_id', v_notification_id,
        'submission_id', p_submission_id
    );
END;
$$;

GRANT EXECUTE ON FUNCTION rmm_request_submission_info(uuid, text) TO authenticated;

COMMIT;
