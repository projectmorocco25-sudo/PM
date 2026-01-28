-- One-off: set test@example.com as tier1 in public.users.
-- Safe if user does not exist (no-op). Run with: supabase db push

DO $$
DECLARE
  uid uuid;
  uemail text;
  ufull text;
BEGIN
  SELECT id, email, coalesce(raw_user_meta_data->>'full_name', raw_user_meta_data->>'name', '')
  INTO uid, uemail, ufull
  FROM auth.users
  WHERE email = 'test@example.com'
  LIMIT 1;
  IF uid IS NOT NULL THEN
    INSERT INTO public.users (id, email, full_name, company_id, role)
    VALUES (uid, uemail, nullif(trim(ufull), ''), NULL, 'tier1')
    ON CONFLICT (id) DO UPDATE SET
      role = 'tier1',
      company_id = NULL,
      updated_at = now();
  END IF;
END $$;
