-- Set test@example.com as tier1 in public.users.
-- Run via: npx supabase db execute -f supabase/scripts/set-tier1-test-user.sql
-- Or paste into Supabase Dashboard → SQL Editor.

INSERT INTO public.users (id, email, full_name, company_id, role)
SELECT
  au.id,
  au.email,
  coalesce(au.raw_user_meta_data->>'full_name', au.raw_user_meta_data->>'name', ''),
  NULL,
  'tier1'
FROM auth.users au
WHERE au.email = 'test@example.com'
ON CONFLICT (id) DO UPDATE SET
  role = 'tier1',
  company_id = NULL,
  updated_at = now();
