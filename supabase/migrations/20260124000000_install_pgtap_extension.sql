-- Install pgTAP extension for testing
-- This migration installs the pgTAP extension which provides testing functions for PostgreSQL

BEGIN;

-- Check if pgTAP is available
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_available_extensions WHERE name = 'pgtap'
    ) THEN
        RAISE EXCEPTION 'pgTAP extension is not available. Please install pgTAP in your PostgreSQL instance.';
    END IF;
END $$;

-- Create extension if it doesn't exist
CREATE EXTENSION IF NOT EXISTS pgtap;

COMMIT;
