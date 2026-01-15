-- Verify SKU pharmaceutical attributes (Task 1.1.1.7b)
-- Run in Supabase SQL editor or via MCP execute SQL.

-- NOT NULL enforcement (should return 0 rows)
SELECT id
FROM skus
WHERE dosage_strength IS NULL
   OR dosage_form IS NULL
   OR pack_size IS NULL
   OR unit_of_measure IS NULL;

-- Index on dosage_form exists
SELECT indexname, indexdef
FROM pg_indexes
WHERE schemaname = 'public'
  AND tablename = 'skus'
  AND indexname = 'idx_skus_dosage_form';

