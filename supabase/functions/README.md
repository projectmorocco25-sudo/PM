# Edge Functions – PM Platform

**Cloud-only.** Use the **hosted** Supabase project. No `supabase start` or Docker.

## Structure

- `_template/` – Base for new functions. Copy to `supabase/functions/<name>/` and implement.
- New functions: `supabase functions new <name>` or copy `_template` manually.

## Local dev (optional)

Run against the **hosted** project:

```bash
supabase link --project-ref <ref>   # if not already linked
cp .env.example .env.local          # add real keys from Dashboard
supabase functions serve --env-file .env.local
```

Functions use `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` from the env file (hosted project).

## Deploy

**CLI:**

```bash
supabase link --project-ref <ref>
supabase functions deploy [--project-ref <ref>]
```

**CI (GitHub Actions):**  
`.github/workflows/deploy-edge-functions.yml` deploys on push to `main` when `supabase/functions/**` or `supabase/config.toml` change.

**Required secrets:** `SUPABASE_ACCESS_TOKEN`, `SUPABASE_PROJECT_REF`.

## Secrets

Set secrets on the **hosted** project:

```bash
supabase secrets set MY_SECRET=value
```

Use in functions via `Deno.env.get("MY_SECRET")`.

## References

- [Edge Functions spec](../../docs/02-architecture/api/edge-functions.md)
- [Phase 1.1 – Supabase cloud-only](../../docs/05-project-management/phase-1-1-rmm.md#-supabase-cloud-only-no-local)
