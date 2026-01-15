## shared/job-worker

Background job worker for Phase 1.1.1.4m.

- Claims due jobs via `job_claim`
- Processes jobs by `job_type` (placeholder in Phase 1)
- Marks success via `job_complete`
- Marks failure via `job_fail` with exponential backoff retries (max 3) and dead-lettering

### Deploy

Use the Supabase CLI:

```bash
supabase functions deploy shared-job-worker
```

