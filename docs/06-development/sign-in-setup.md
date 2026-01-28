# Sign-in setup (hosted Supabase)

**Purpose:** Create a Supabase Auth user and sign in at `/login` so the app can create a matching `public.users` row and you can use the dashboard.

**Last Updated:** 2026-01-28

---

## 1. Configure environment

Ensure `.env.local` exists in the project root with your **hosted** Supabase project:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
```

Use **Project Settings → API** in the [Supabase Dashboard](https://supabase.com/dashboard) for these values.

---

## 2. Create an Auth user

1. Open your **hosted** Supabase project in the [Dashboard](https://supabase.com/dashboard).
2. Go to **Authentication → Users**.
3. Click **Add user → Create new user**.
4. Set **Email** and **Password** (e.g. `test@example.com` / `YourSecurePassword123`).
5. Click **Create user**.

---

## 3. Open /login and sign in

1. Start the app: `npm run dev`.
2. Open **http://localhost:3000/login** in your browser.
3. Enter the **same email and password** you used in step 2.
4. Click **Sign in**.

On successful sign-in, the app calls `rmm_create_user` and upserts a `public.users` row for that auth user, then redirects to `/dashboard`.

---

## 4. Verify

- You should land on **http://localhost:3000/dashboard** with the core layout (header, sidebar, main content).
- If you see "Signed in, but could not sync profile", check that migrations (including `20260127151200_rpc_authentication_function`) are applied via `supabase db push` and that RLS allows the `authenticated` role to run `rmm_create_user`.

---

## Troubleshooting

| Issue | What to check |
|-------|----------------|
| "Invalid login credentials" | Email/password match the user created in **Authentication → Users**. |
| "could not sync profile" | Migrations applied; `rmm_create_user` exists; no FK violations (e.g. `company_id` if used). |
| Redirect to /login when opening /dashboard | Session not set (cookies). Use /login to sign in first. |
| Env errors | `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local` at **project root** (not in subfolders). |
