-- Migration: Authentication RPC function
-- Description: rmm_create_user() — create users row after Supabase Auth signup.
-- Task: 1.1.1.2e
-- Date: 2026-01-27
-- Dependencies: 1.1.1.2-verify, 1.1.1.4 (RLS). Table: users.

BEGIN;

-- rmm_create_user(p_id uuid, p_email text, p_full_name text, p_company_id uuid, p_role text)
-- For post-signup: create public.users row. Only allow when p_id = auth.uid() (self).
-- SECURITY DEFINER to bypass RLS on INSERT; we enforce self-create only.
CREATE OR REPLACE FUNCTION public.rmm_create_user(
  p_id uuid,
  p_email text,
  p_full_name text DEFAULT NULL,
  p_company_id uuid DEFAULT NULL,
  p_role text DEFAULT 'company_user'
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  r record;
BEGIN
  IF auth.uid() IS DISTINCT FROM p_id THEN
    RETURN jsonb_build_object('success', false, 'error', 'can_only_create_own_profile');
  END IF;
  IF p_email IS NULL OR trim(p_email) = '' THEN
    RETURN jsonb_build_object('success', false, 'error', 'email_required');
  END IF;
  INSERT INTO public.users (id, email, full_name, company_id, role)
  VALUES (
    p_id,
    trim(p_email),
    nullif(trim(p_full_name), ''),
    p_company_id,
    coalesce(nullif(trim(p_role), ''), 'company_user')
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = coalesce(EXCLUDED.full_name, users.full_name),
    company_id = coalesce(EXCLUDED.company_id, users.company_id),
    role = coalesce(nullif(trim(EXCLUDED.role), ''), users.role),
    updated_at = now()
  RETURNING id, email, full_name, company_id, role INTO r;
  RETURN jsonb_build_object('success', true, 'user', to_jsonb(r));
EXCEPTION
  WHEN foreign_key_violation THEN
    RETURN jsonb_build_object('success', false, 'error', 'auth_user_not_found');
  WHEN check_violation OR unique_violation THEN
    RETURN jsonb_build_object('success', false, 'error', 'invalid_input');
END;
$$;

COMMENT ON FUNCTION public.rmm_create_user(uuid, text, text, uuid, text) IS 'Create/upsert users row for current auth user (post-signup). Self-only. Task 1.1.1.2e.';

GRANT EXECUTE ON FUNCTION public.rmm_create_user(uuid, text, text, uuid, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.rmm_create_user(uuid, text, text, uuid, text) TO service_role;

COMMIT;
