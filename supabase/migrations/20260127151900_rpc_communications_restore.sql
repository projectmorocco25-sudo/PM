-- Migration: communications_restore_conversation
-- Description: Restore (unarchive) a conversation. MOH only per RLS. Task 1.1.1.24.
-- Date: 2026-01-27

BEGIN;

CREATE OR REPLACE FUNCTION public.communications_restore_conversation(p_conversation_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
  n int;
BEGIN
  UPDATE public.conversations SET archived_at = NULL WHERE id = p_conversation_id;
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n = 0 THEN
    RETURN jsonb_build_object('success', false, 'error', 'not_found_or_forbidden');
  END IF;
  RETURN jsonb_build_object('success', true);
END;
$$;

COMMENT ON FUNCTION public.communications_restore_conversation(uuid) IS 'Restore archived conversation. MOH only (RLS). Task 1.1.1.24.';

GRANT EXECUTE ON FUNCTION public.communications_restore_conversation(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.communications_restore_conversation(uuid) TO service_role;

COMMIT;
