-- Migration: create_job_queue
-- Description: PostgreSQL-native background job queue ("pg_boss or similar") for Phase 1.1.1.4m
-- Date: 2026-01-14
-- Author: PM Agent
-- Phase: 1.1.1
-- Task: 1.1.1.4m
--
-- Notes:
-- - Uses SKIP LOCKED claiming for concurrency control
-- - Retries with exponential backoff, max 3 retries by default
-- - Dead-letter queue modeled by status = 'dead'

BEGIN;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'job_status') THEN
    CREATE TYPE job_status AS ENUM ('queued', 'running', 'succeeded', 'failed', 'dead');
  END IF;
END$$;

CREATE TABLE IF NOT EXISTS job_queue (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_type text NOT NULL,
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  status job_status NOT NULL DEFAULT 'queued',
  run_at timestamptz NOT NULL DEFAULT now(),
  attempts integer NOT NULL DEFAULT 0,
  max_attempts integer NOT NULL DEFAULT 3,
  locked_at timestamptz,
  locked_by text,
  last_error text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

COMMENT ON TABLE job_queue IS 'PostgreSQL-native job queue for background processing';
COMMENT ON COLUMN job_queue.job_type IS 'Job type (email_notification, report_generation, data_export, scheduled_calculation, etc.)';

-- Secure job queue: service role only (table must not be readable/writeable by anon/auth clients)
ALTER TABLE job_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_queue FORCE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'job_queue'
      AND policyname = 'service_role_full_access_job_queue'
  ) THEN
    CREATE POLICY service_role_full_access_job_queue
    ON job_queue
    FOR ALL
    USING (auth.role() = 'service_role')
    WITH CHECK (auth.role() = 'service_role');
  END IF;
END$$;

CREATE INDEX IF NOT EXISTS idx_job_queue_status_run_at ON job_queue(status, run_at);
CREATE INDEX IF NOT EXISTS idx_job_queue_job_type_status ON job_queue(job_type, status);
CREATE INDEX IF NOT EXISTS idx_job_queue_locked_at ON job_queue(locked_at) WHERE locked_at IS NOT NULL;

-- updated_at trigger
CREATE TRIGGER set_job_queue_updated_at
BEFORE UPDATE ON job_queue
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Enqueue a job (idempotency handled by caller if needed)
CREATE OR REPLACE FUNCTION job_enqueue(
  p_job_type text,
  p_payload jsonb DEFAULT '{}'::jsonb,
  p_run_at timestamptz DEFAULT now(),
  p_max_attempts integer DEFAULT 3
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_id uuid;
BEGIN
  INSERT INTO job_queue(job_type, payload, run_at, max_attempts)
  VALUES (p_job_type, COALESCE(p_payload, '{}'::jsonb), COALESCE(p_run_at, now()), COALESCE(p_max_attempts, 3))
  RETURNING id INTO v_id;
  RETURN v_id;
END;
$$;

COMMENT ON FUNCTION job_enqueue IS 'Enqueue a background job';

-- Claim up to N jobs that are due for execution.
CREATE OR REPLACE FUNCTION job_claim(
  p_worker_id text,
  p_limit integer DEFAULT 10,
  p_job_types text[] DEFAULT NULL
)
RETURNS SETOF job_queue
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  WITH candidates AS (
    SELECT id
    FROM job_queue
    WHERE status = 'queued'
      AND run_at <= now()
      AND (p_job_types IS NULL OR job_type = ANY(p_job_types))
    ORDER BY run_at ASC, created_at ASC
    LIMIT COALESCE(p_limit, 10)
    FOR UPDATE SKIP LOCKED
  )
  UPDATE job_queue j
  SET status = 'running',
      locked_at = now(),
      locked_by = p_worker_id,
      updated_at = now()
  FROM candidates c
  WHERE j.id = c.id
  RETURNING j.*;
END;
$$;

COMMENT ON FUNCTION job_claim IS 'Claim due jobs for a worker (SKIP LOCKED)';

CREATE OR REPLACE FUNCTION job_complete(p_job_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE job_queue
  SET status = 'succeeded',
      locked_at = NULL,
      locked_by = NULL,
      updated_at = now()
  WHERE id = p_job_id;
END;
$$;

COMMENT ON FUNCTION job_complete IS 'Mark job as succeeded';

CREATE OR REPLACE FUNCTION job_fail(p_job_id uuid, p_error text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_attempts integer;
  v_max integer;
  v_next timestamptz;
BEGIN
  SELECT attempts, max_attempts INTO v_attempts, v_max
  FROM job_queue WHERE id = p_job_id;

  v_attempts := COALESCE(v_attempts, 0) + 1;
  v_max := COALESCE(v_max, 3);
  v_next := now() + make_interval(mins => (2 ^ LEAST(v_attempts, 10))::int); -- exponential backoff minutes

  UPDATE job_queue
  SET attempts = v_attempts,
      last_error = p_error,
      locked_at = NULL,
      locked_by = NULL,
      status = CASE WHEN v_attempts >= v_max THEN 'dead' ELSE 'queued' END,
      run_at = CASE WHEN v_attempts >= v_max THEN run_at ELSE v_next END,
      updated_at = now()
  WHERE id = p_job_id;
END;
$$;

COMMENT ON FUNCTION job_fail IS 'Fail job; retries with exponential backoff up to max_attempts, then dead-letters';

COMMIT;

