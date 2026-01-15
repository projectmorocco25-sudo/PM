-- Rollback script for: 20250112205000_create_vci_tables.sql
-- Reference: docs/02-architecture/database/migration-versioning-strategy.md
-- NOTE: This file is NOT an auto-applied migration. Run manually if rollback is required.

BEGIN;

DROP TABLE IF EXISTS breach_analyses;
DROP TABLE IF EXISTS breaches;
DROP TABLE IF EXISTS thresholds;
DROP TABLE IF EXISTS wsl_submissions;
DROP TABLE IF EXISTS msq_submissions;
DROP TABLE IF EXISTS aams_submissions;

COMMIT;

