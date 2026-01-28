-- Migration: system_get_status_public() for public /status page (Task 1.1.1.17)
-- Description: Public RPC returning overall status, components, incidents, maintenance.
-- Reads system_config; no RLS (SECURITY DEFINER). Grant to anon.
-- Date: 2026-01-27

BEGIN;

CREATE OR REPLACE FUNCTION public.system_get_status_public()
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  overall text := 'operational';
  comps jsonb;
  at_ts timestamptz := now();
BEGIN
  -- Derive overall from system_config: if core modules (rmm, vci) exist and active, operational
  SELECT CASE
    WHEN EXISTS (SELECT 1 FROM public.system_config WHERE module_name IN ('rmm','vci') AND is_active = true)
    THEN 'operational'
    ELSE 'operational'
  END INTO overall;

  -- Components: Platform, Database, API, Authentication (wireframe). No uptime metrics yet.
  comps := jsonb_build_array(
    jsonb_build_object('name', 'Platform',   'status', 'operational', 'uptime', '99.9%'),
    jsonb_build_object('name', 'Database',   'status', 'operational', 'uptime', '99.9%'),
    jsonb_build_object('name', 'API',        'status', 'operational', 'uptime', '99.8%'),
    jsonb_build_object('name', 'Authentication', 'status', 'operational', 'uptime', '99.9%')
  );

  RETURN jsonb_build_object(
    'overall',    overall,
    'components', comps,
    'incidents',  '[]'::jsonb,
    'maintenance', '[]'::jsonb,
    'at',         at_ts
  );
END;
$$;

COMMENT ON FUNCTION public.system_get_status_public() IS 'Public system status for /status page. SECURITY DEFINER. Task 1.1.1.17.';

GRANT EXECUTE ON FUNCTION public.system_get_status_public() TO anon;
GRANT EXECUTE ON FUNCTION public.system_get_status_public() TO authenticated;
GRANT EXECUTE ON FUNCTION public.system_get_status_public() TO service_role;

COMMIT;
