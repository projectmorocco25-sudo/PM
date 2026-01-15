## Seeding (dev/staging only)

This folder contains **idempotent** seed scripts that insert **real Supabase data** for development and staging.

### Requirements

- `SUPABASE_URL` (or `NEXT_PUBLIC_SUPABASE_URL`)
- `SUPABASE_SERVICE_ROLE_KEY`

### Run

```bash
npm run seed:dev
```

### What it seeds

- `system_config` module activation defaults
- A demo company/product/SKU for UI development

