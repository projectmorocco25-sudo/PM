## Supabase scripts (Phase 1.1.1)

This folder contains **verification helpers** for Phase 1.1.1.

### Schema verification (Task 1.1.1.21b)

- Use `schema-verify.sql` after applying all migrations to confirm:
  - tables, columns, foreign keys, indexes, constraints, triggers

### Suggested run order (MCP / Supabase)

1. List migrations
2. List tables
3. Execute `schema-verify.sql`
4. Run advisors (security + performance)

