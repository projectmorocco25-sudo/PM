# Supabase – PM Platform (Cloud-Only)

**Phase 1.1** uses the **hosted** Supabase project only. No local Supabase, Docker, or local database.

## Quick reference

| Action | Command |
|--------|---------|
| Link project | `supabase link --project-ref <ref>` |
| Apply migrations | `supabase db push` |
| List migrations | `supabase migration list` |
| New migration | `supabase migration new <name>` |
| Deploy Edge Functions | `supabase functions deploy` |

## Do / Don't

- **Do:** Use `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` (and `SUPABASE_SERVICE_ROLE_KEY` where needed) from the **hosted** project in `.env.local`.
- **Do:** Run `supabase db push` to apply migrations to the linked remote project.
- **Do:** Verify with `supabase migration list` and the Supabase Dashboard.
- **Don't:** Run `supabase start` or `supabase stop`.
- **Don't:** Use Docker or a local Postgres instance for development.

## Project structure

```
supabase/
├── config.toml       # Supabase project config
├── migrations/       # Versioned SQL migrations (YYYYMMDDHHMMSS_name.sql)
├── functions/        # Edge Functions (Deno/TS)
│   └── _template/    # Template for new functions
├── seed.sql          # Placeholder; use migration-based seed (see Seed Data Playbook)
└── README.md         # This file
```

## Edge Functions

- **Dev (cloud):** `supabase functions serve --env-file .env` (uses hosted project env).
- **Deploy:** `supabase functions deploy` or GitHub Actions on push to `main` (see `supabase/functions/README.md`).
- **Secrets:** `supabase secrets set KEY=value` against linked project.

## Links

- [Phase 1.1 RMM – Supabase cloud-only](../docs/05-project-management/phase-1-1-rmm.md#-supabase-cloud-only-no-local)
- [Migration strategy](../docs/02-architecture/database/migration-strategy.md)
- [Edge Functions spec](../docs/02-architecture/api/edge-functions.md)
