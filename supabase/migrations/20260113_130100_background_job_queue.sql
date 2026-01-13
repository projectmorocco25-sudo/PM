-- Task 1.1.1.4m: Background Job Queue Infrastructure
-- Reference: docs/02-architecture/api/edge-functions.md
--
-- This migration creates the infrastructure for background job processing.
-- Jobs are processed by Edge Functions via cron or webhook triggers.

-- ============================================================================
-- JOB QUEUE TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.job_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Job identification
  job_type TEXT NOT NULL,
  job_name TEXT NOT NULL,
  
  -- Job payload and configuration
  payload JSONB NOT NULL DEFAULT '{}',
  priority INTEGER NOT NULL DEFAULT 0, -- Higher = more urgent
  max_attempts INTEGER NOT NULL DEFAULT 3,
  attempt_count INTEGER NOT NULL DEFAULT 0,
  
  -- Scheduling
  scheduled_for TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  locked_until TIMESTAMPTZ,
  locked_by TEXT, -- Worker ID that locked the job
  
  -- Status tracking
  status TEXT NOT NULL DEFAULT 'pending' 
    CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled')),
  
  -- Results and errors
  result JSONB,
  error_message TEXT,
  error_details JSONB,
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- INDEXES FOR JOB QUEUE
-- ============================================================================

-- Primary query pattern: get next pending job
CREATE INDEX idx_job_queue_pending ON public.job_queue (priority DESC, scheduled_for ASC) 
  WHERE status = 'pending' AND (locked_until IS NULL OR locked_until < NOW());

-- Find jobs by type
CREATE INDEX idx_job_queue_type ON public.job_queue (job_type, status);

-- Find stale locked jobs (for cleanup)
CREATE INDEX idx_job_queue_locked ON public.job_queue (locked_until) 
  WHERE status = 'processing';

-- Find failed jobs for retry analysis
CREATE INDEX idx_job_queue_failed ON public.job_queue (job_type, created_at DESC) 
  WHERE status = 'failed';

-- ============================================================================
-- SCHEDULED JOBS TABLE (for recurring jobs)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.scheduled_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Job definition
  job_type TEXT NOT NULL,
  job_name TEXT NOT NULL UNIQUE,
  description TEXT,
  
  -- Schedule (cron expression)
  cron_expression TEXT NOT NULL,
  timezone TEXT NOT NULL DEFAULT 'Africa/Casablanca',
  
  -- Job template
  payload_template JSONB NOT NULL DEFAULT '{}',
  priority INTEGER NOT NULL DEFAULT 0,
  max_attempts INTEGER NOT NULL DEFAULT 3,
  
  -- Status
  is_active BOOLEAN NOT NULL DEFAULT true,
  
  -- Last execution tracking
  last_run_at TIMESTAMPTZ,
  last_run_status TEXT CHECK (last_run_status IN ('success', 'failed', 'skipped')),
  next_run_at TIMESTAMPTZ,
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- JOB HISTORY TABLE (for completed job tracking)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.job_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL,
  job_type TEXT NOT NULL,
  job_name TEXT NOT NULL,
  
  -- Execution details
  status TEXT NOT NULL CHECK (status IN ('completed', 'failed', 'cancelled')),
  attempt_count INTEGER NOT NULL,
  
  -- Payload and result
  payload JSONB NOT NULL,
  result JSONB,
  error_message TEXT,
  error_details JSONB,
  
  -- Timing
  scheduled_for TIMESTAMPTZ NOT NULL,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ NOT NULL,
  duration_ms INTEGER,
  
  -- Metadata
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Partition job_history by month for efficient querying
CREATE INDEX idx_job_history_job_type ON public.job_history (job_type, completed_at DESC);
CREATE INDEX idx_job_history_status ON public.job_history (status, completed_at DESC);

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

-- Function to enqueue a new job
CREATE OR REPLACE FUNCTION public.job_queue_enqueue(
  p_job_type TEXT,
  p_job_name TEXT,
  p_payload JSONB DEFAULT '{}',
  p_priority INTEGER DEFAULT 0,
  p_scheduled_for TIMESTAMPTZ DEFAULT NOW(),
  p_max_attempts INTEGER DEFAULT 3
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_job_id UUID;
BEGIN
  INSERT INTO job_queue (job_type, job_name, payload, priority, scheduled_for, max_attempts)
  VALUES (p_job_type, p_job_name, p_payload, p_priority, p_scheduled_for, p_max_attempts)
  RETURNING id INTO v_job_id;
  
  RETURN v_job_id;
END;
$$;

-- Function to claim the next available job
CREATE OR REPLACE FUNCTION public.job_queue_claim(
  p_worker_id TEXT,
  p_job_types TEXT[] DEFAULT NULL,
  p_lock_duration INTERVAL DEFAULT INTERVAL '5 minutes'
)
RETURNS TABLE (
  id UUID,
  job_type TEXT,
  job_name TEXT,
  payload JSONB,
  attempt_count INTEGER,
  max_attempts INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  UPDATE job_queue jq
  SET 
    status = 'processing',
    locked_until = NOW() + p_lock_duration,
    locked_by = p_worker_id,
    attempt_count = jq.attempt_count + 1,
    started_at = COALESCE(jq.started_at, NOW()),
    updated_at = NOW()
  WHERE jq.id = (
    SELECT j.id
    FROM job_queue j
    WHERE j.status = 'pending'
      AND j.scheduled_for <= NOW()
      AND (j.locked_until IS NULL OR j.locked_until < NOW())
      AND (p_job_types IS NULL OR j.job_type = ANY(p_job_types))
    ORDER BY j.priority DESC, j.scheduled_for ASC
    LIMIT 1
    FOR UPDATE SKIP LOCKED
  )
  RETURNING jq.id, jq.job_type, jq.job_name, jq.payload, jq.attempt_count, jq.max_attempts;
END;
$$;

-- Function to complete a job successfully
CREATE OR REPLACE FUNCTION public.job_queue_complete(
  p_job_id UUID,
  p_result JSONB DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_job RECORD;
BEGIN
  -- Get and update the job
  UPDATE job_queue
  SET 
    status = 'completed',
    result = p_result,
    completed_at = NOW(),
    locked_until = NULL,
    locked_by = NULL,
    updated_at = NOW()
  WHERE id = p_job_id AND status = 'processing'
  RETURNING * INTO v_job;
  
  IF NOT FOUND THEN
    RETURN FALSE;
  END IF;
  
  -- Archive to history
  INSERT INTO job_history (
    job_id, job_type, job_name, status, attempt_count,
    payload, result, scheduled_for, started_at, completed_at,
    duration_ms
  )
  VALUES (
    v_job.id, v_job.job_type, v_job.job_name, 'completed', v_job.attempt_count,
    v_job.payload, p_result, v_job.scheduled_for, v_job.started_at, NOW(),
    EXTRACT(EPOCH FROM (NOW() - v_job.started_at))::INTEGER * 1000
  );
  
  -- Delete from active queue
  DELETE FROM job_queue WHERE id = p_job_id;
  
  RETURN TRUE;
END;
$$;

-- Function to fail a job
CREATE OR REPLACE FUNCTION public.job_queue_fail(
  p_job_id UUID,
  p_error_message TEXT,
  p_error_details JSONB DEFAULT NULL,
  p_retry BOOLEAN DEFAULT TRUE
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_job RECORD;
  v_should_retry BOOLEAN;
BEGIN
  -- Get the job
  SELECT * INTO v_job FROM job_queue WHERE id = p_job_id AND status = 'processing';
  
  IF NOT FOUND THEN
    RETURN FALSE;
  END IF;
  
  v_should_retry := p_retry AND v_job.attempt_count < v_job.max_attempts;
  
  IF v_should_retry THEN
    -- Reschedule with exponential backoff
    UPDATE job_queue
    SET 
      status = 'pending',
      error_message = p_error_message,
      error_details = p_error_details,
      scheduled_for = NOW() + (INTERVAL '1 minute' * POWER(2, attempt_count)),
      locked_until = NULL,
      locked_by = NULL,
      updated_at = NOW()
    WHERE id = p_job_id;
  ELSE
    -- Mark as permanently failed
    UPDATE job_queue
    SET 
      status = 'failed',
      error_message = p_error_message,
      error_details = p_error_details,
      completed_at = NOW(),
      locked_until = NULL,
      locked_by = NULL,
      updated_at = NOW()
    WHERE id = p_job_id;
    
    -- Archive to history
    INSERT INTO job_history (
      job_id, job_type, job_name, status, attempt_count,
      payload, error_message, error_details,
      scheduled_for, started_at, completed_at,
      duration_ms
    )
    VALUES (
      v_job.id, v_job.job_type, v_job.job_name, 'failed', v_job.attempt_count,
      v_job.payload, p_error_message, p_error_details,
      v_job.scheduled_for, v_job.started_at, NOW(),
      EXTRACT(EPOCH FROM (NOW() - v_job.started_at))::INTEGER * 1000
    );
    
    -- Delete from active queue
    DELETE FROM job_queue WHERE id = p_job_id;
  END IF;
  
  RETURN TRUE;
END;
$$;

-- Function to cleanup stale jobs (run periodically)
CREATE OR REPLACE FUNCTION public.job_queue_cleanup_stale(
  p_stale_threshold INTERVAL DEFAULT INTERVAL '30 minutes'
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_count INTEGER := 0;
BEGIN
  -- Release stale locks
  UPDATE job_queue
  SET 
    status = 'pending',
    locked_until = NULL,
    locked_by = NULL,
    updated_at = NOW()
  WHERE status = 'processing'
    AND locked_until < NOW() - p_stale_threshold;
  
  GET DIAGNOSTICS v_count = ROW_COUNT;
  RETURN v_count;
END;
$$;

-- ============================================================================
-- RLS POLICIES
-- ============================================================================
ALTER TABLE public.job_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scheduled_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_history ENABLE ROW LEVEL SECURITY;

-- Only system/service role can access job tables
CREATE POLICY job_queue_service_only ON public.job_queue
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY scheduled_jobs_service_only ON public.scheduled_jobs
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY job_history_service_only ON public.job_history
  FOR ALL USING (auth.role() = 'service_role');

-- Tier 1 can view job status for monitoring
CREATE POLICY job_queue_select_tier1 ON public.job_queue
  FOR SELECT USING (public.is_tier1_user());

CREATE POLICY scheduled_jobs_select_tier1 ON public.scheduled_jobs
  FOR SELECT USING (public.is_tier1_user());

CREATE POLICY job_history_select_tier1 ON public.job_history
  FOR SELECT USING (public.is_tier1_user());

-- ============================================================================
-- UPDATED_AT TRIGGERS
-- ============================================================================
CREATE TRIGGER update_job_queue_updated_at
  BEFORE UPDATE ON public.job_queue
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_scheduled_jobs_updated_at
  BEFORE UPDATE ON public.scheduled_jobs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================================
-- PREDEFINED SCHEDULED JOBS
-- ============================================================================
INSERT INTO public.scheduled_jobs (job_type, job_name, description, cron_expression, priority)
VALUES 
  ('vci', 'vci-check-threshold-reverts', 'Check for threshold violations that have reverted', '0 6 * * *', 5),
  ('vci', 'vci-send-email-notifications', 'Send daily VCI email digests', '0 8 * * 1-5', 3),
  ('ecs', 'ecs-expire-authorizations', 'Expire old ECS authorizations', '0 0 * * *', 5),
  ('cmc', 'cmc-calculate-scores', 'Calculate compliance scores', '0 2 * * 0', 10),
  ('communications', 'communications-send-message-emails', 'Send email notifications for unread messages', '0 9,14 * * 1-5', 3),
  ('system', 'job-queue-cleanup', 'Clean up stale and old jobs', '0 3 * * *', 1)
ON CONFLICT (job_name) DO UPDATE SET
  description = EXCLUDED.description,
  cron_expression = EXCLUDED.cron_expression,
  priority = EXCLUDED.priority,
  updated_at = NOW();

COMMENT ON TABLE public.job_queue IS 'Background job queue for async task processing';
COMMENT ON TABLE public.scheduled_jobs IS 'Recurring scheduled job definitions';
COMMENT ON TABLE public.job_history IS 'Archive of completed/failed jobs for audit and analysis';
