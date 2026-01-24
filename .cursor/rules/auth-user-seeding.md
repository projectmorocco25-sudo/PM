---
title: Auth User Seeding (Supabase)
owner: Hassan (DB)
status: active
---

# Auth User Seeding (Supabase)

- Never seed users by direct `INSERT` into `auth.users` for real auth flows.
- Always create auth users via the **Auth Admin API** (or Supabase dashboard "Add user") so GoTrue sets internal fields.
- If deterministic IDs are required, pass `id` in the Admin API payload; then create `public.users` rows to match.
- Keep `public.users.id` aligned with `auth.users.id` to satisfy the FK.
- If auth users appear in SQL but not in the Auth UI, treat it as an **Auth service mismatch** and re-create via Admin API.

Checklist for seeded auth users:
- Auth Admin API returns the user.
- Auth UI shows the user.
- Login via `/auth/v1/token?grant_type=password` succeeds.
