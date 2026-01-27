-- Migration: System status RPC function
-- Description: system_get_status()
-- Task: 1.1.1.2d
-- Date: 2026-01-27
-- Dependencies: 1.1.1.2-verify. Table: system_config.

BEGIN;

CREATE OR REPLACE FUNCTION public.system_get_status()
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
  mods jsonb;
BEGIN
  SELECT coalesce(jsonb_agg(row_to_json(t)::jsonb ORDER BY t.module_name), '[]'::jsonb) INTO mods
  FROM (
    SELECT module_name, is_active, activated_at, activated_by
    FROM public.system_config
  ) t;
  RETURN jsonb_build_object('modules', coalesce(mods, '[]'::jsonb), 'at', now());
END;
$$;

COMMENT ON FUNCTION public.system_get_status() IS 'Return system status (module activation). RLS applies (MOH Tier 1 / system_admin). Task 1.1.1.2d.';

GRANT EXECUTE ON FUNCTION public.system_get_status() TO authenticated;
GRANT EXECUTE ON FUNCTION public.system_get_status() TO service_role;

COMMIT;
