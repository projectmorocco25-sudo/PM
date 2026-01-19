-- Task: 1.1.1.4m - Create background job queue infrastructure (Leila's Audit - Issue #31)
-- Reference: Edge Functions Specification
-- Purpose: PostgreSQL-native job queue for background processing

-- Job Queue Table
CREATE TABLE IF NOT EXISTS public.job_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_type TEXT NOT NULL CHECK (job_type IN ('email_notification', 'report_generation', 'data_export', 'scheduled_calculation')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled', 'dead_letter')),
  priority INTEGER NOT NULL DEFAULT 5 CHECK (priority >= 1 AND priority <= 10),
  payload JSONB NOT NULL DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  
  -- Retry configuration
  retry_count INTEGER NOT NULL DEFAULT 0,
  max_retries INTEGER NOT NULL DEFAULT 3,
  next_retry_at TIMESTAMPTZ,
  
  -- Execution tracking
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  execution_time_ms INTEGER,
  
  -- Error tracking
  error_message TEXT,
  error_stack TEXT,
  last_error_at TIMESTAMPTZ,
  
  -- Duplicate prevention
  job_key TEXT, -- Unique key to prevent duplicate jobs (optional)
  
  -- Concurrency control
  worker_id TEXT, -- Worker/instance processing the job
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_job_queue_status ON public.job_queue(status) WHERE status IN ('pending', 'processing');
CREATE INDEX IF NOT EXISTS idx_job_queue_job_type ON public.job_queue(job_type);
CREATE INDEX IF NOT EXISTS idx_job_queue_next_retry_at ON public.job_queue(next_retry_at) WHERE status = 'pending' AND next_retry_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_job_queue_priority ON public.job_queue(priority DESC, created_at ASC) WHERE status = 'pending';
CREATE INDEX IF NOT EXISTS idx_job_queue_created_at ON public.job_queue(created_at);

-- Unique index for duplicate prevention (partial index - only when job_key is not null)
CREATE UNIQUE INDEX IF NOT EXISTS idx_job_queue_unique_key ON public.job_queue(job_key) WHERE job_key IS NOT NULL;

-- Job History Table (for monitoring and auditing)
CREATE TABLE IF NOT EXISTS public.job_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES public.job_queue(id) ON DELETE CASCADE,
  job_type TEXT NOT NULL,
  status TEXT NOT NULL,
  execution_time_ms INTEGER,
  error_message TEXT,
  error_stack TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_job_history_job_id ON public.job_history(job_id);
CREATE INDEX IF NOT EXISTS idx_job_history_created_at ON public.job_history(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_job_history_status ON public.job_history(status);

-- Job Configuration Table (for concurrency limits per job type)
CREATE TABLE IF NOT EXISTS public.job_config (
  job_type TEXT PRIMARY KEY CHECK (job_type IN ('email_notification', 'report_generation', 'data_export', 'scheduled_calculation')),
  max_concurrent_jobs INTEGER NOT NULL DEFAULT 5 CHECK (max_concurrent_jobs > 0),
  retry_backoff_multiplier NUMERIC(5,2) NOT NULL DEFAULT 2.0 CHECK (retry_backoff_multiplier > 1.0),
  initial_retry_delay_seconds INTEGER NOT NULL DEFAULT 60 CHECK (initial_retry_delay_seconds > 0),
  max_retry_delay_seconds INTEGER NOT NULL DEFAULT 3600 CHECK (max_retry_delay_seconds > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Insert default job configurations
INSERT INTO public.job_config (job_type, max_concurrent_jobs, retry_backoff_multiplier, initial_retry_delay_seconds, max_retry_delay_seconds)
VALUES
  ('email_notification', 10, 2.0, 30, 300),
  ('report_generation', 3, 2.0, 120, 3600),
  ('data_export', 2, 2.0, 60, 1800),
  ('scheduled_calculation', 5, 2.0, 60, 3600)
ON CONFLICT (job_type) DO NOTHING;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_job_queue_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_job_queue_updated_at
  BEFORE UPDATE ON public.job_queue
  FOR EACH ROW
  EXECUTE FUNCTION public.update_job_queue_updated_at();

-- Function to calculate next retry time with exponential backoff
CREATE OR REPLACE FUNCTION public.calculate_next_retry_time(
  p_retry_count INTEGER,
  p_initial_delay_seconds INTEGER,
  p_backoff_multiplier NUMERIC,
  p_max_delay_seconds INTEGER
)
RETURNS TIMESTAMPTZ AS $$
DECLARE
  delay_seconds INTEGER;
BEGIN
  -- Exponential backoff: initial_delay * (multiplier ^ retry_count)
  delay_seconds := LEAST(
    FLOOR(p_initial_delay_seconds * POWER(p_backoff_multiplier, p_retry_count))::INTEGER,
    p_max_delay_seconds
  );
  
  RETURN now() + (delay_seconds || ' seconds')::INTERVAL;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to enqueue a job
CREATE OR REPLACE FUNCTION public.enqueue_job(
  p_job_type TEXT,
  p_payload JSONB DEFAULT '{}',
  p_metadata JSONB DEFAULT '{}',
  p_priority INTEGER DEFAULT 5,
  p_max_retries INTEGER DEFAULT 3,
  p_job_key TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_job_id UUID;
BEGIN
  -- Check if job with same key already exists (prevent duplicates)
  IF p_job_key IS NOT NULL THEN
    SELECT id INTO v_job_id
    FROM public.job_queue
    WHERE job_key = p_job_key
      AND status IN ('pending', 'processing');
    
    IF v_job_id IS NOT NULL THEN
      RETURN v_job_id; -- Return existing job ID
    END IF;
  END IF;
  
  -- Insert new job
  INSERT INTO public.job_queue (
    job_type,
    status,
    priority,
    payload,
    metadata,
    max_retries,
    job_key
  )
  VALUES (
    p_job_type,
    'pending',
    p_priority,
    p_payload,
    p_metadata,
    p_max_retries,
    p_job_key
  )
  RETURNING id INTO v_job_id;
  
  RETURN v_job_id;
END;
$$ LANGUAGE plpgsql;

-- Function to dequeue a job (for workers)
CREATE OR REPLACE FUNCTION public.dequeue_job(
  p_worker_id TEXT,
  p_job_type TEXT DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  job_type TEXT,
  status TEXT,
  priority INTEGER,
  payload JSONB,
  metadata JSONB,
  retry_count INTEGER,
  max_retries INTEGER
) AS $$
DECLARE
  v_job_id UUID;
  v_config RECORD;
  v_concurrent_count INTEGER;
BEGIN
  -- Get job configuration for concurrency limits
  IF p_job_type IS NOT NULL THEN
    SELECT * INTO v_config
    FROM public.job_config
    WHERE job_config.job_type = p_job_type;
  END IF;
  
  -- Check concurrency limits
  IF v_config IS NOT NULL THEN
    SELECT COUNT(*) INTO v_concurrent_count
    FROM public.job_queue
    WHERE job_type = p_job_type
      AND status = 'processing';
    
    IF v_concurrent_count >= v_config.max_concurrent_jobs THEN
      RETURN; -- No jobs available (concurrency limit reached)
    END IF;
  END IF;
  
  -- Find and lock the next pending job
  SELECT jq.id INTO v_job_id
  FROM public.job_queue jq
  WHERE jq.status = 'pending'
    AND (p_job_type IS NULL OR jq.job_type = p_job_type)
    AND (jq.next_retry_at IS NULL OR jq.next_retry_at <= now())
  ORDER BY jq.priority DESC, jq.created_at ASC
  LIMIT 1
  FOR UPDATE SKIP LOCKED;
  
  -- If no job found, return empty
  IF v_job_id IS NULL THEN
    RETURN;
  END IF;
  
  -- Update job to processing status
  UPDATE public.job_queue
  SET
    status = 'processing',
    worker_id = p_worker_id,
    started_at = now(),
    updated_at = now()
  WHERE id = v_job_id;
  
  -- Return job data
  RETURN QUERY
  SELECT
    jq.id,
    jq.job_type,
    jq.status,
    jq.priority,
    jq.payload,
    jq.metadata,
    jq.retry_count,
    jq.max_retries
  FROM public.job_queue jq
  WHERE jq.id = v_job_id;
END;
$$ LANGUAGE plpgsql;

-- Function to complete a job
CREATE OR REPLACE FUNCTION public.complete_job(
  p_job_id UUID,
  p_success BOOLEAN DEFAULT true,
  p_error_message TEXT DEFAULT NULL,
  p_error_stack TEXT DEFAULT NULL
)
RETURNS VOID AS $$
DECLARE
  v_started_at TIMESTAMPTZ;
  v_execution_time_ms INTEGER;
  v_job_type TEXT;
  v_status TEXT;
BEGIN
  -- Get job details
  SELECT started_at, job_type INTO v_started_at, v_job_type
  FROM public.job_queue
  WHERE id = p_job_id;
  
  -- Calculate execution time
  IF v_started_at IS NOT NULL THEN
    v_execution_time_ms := EXTRACT(EPOCH FROM (now() - v_started_at)) * 1000;
  END IF;
  
  -- Determine final status
  IF p_success THEN
    v_status := 'completed';
  ELSE
    v_status := 'failed';
  END IF;
  
  -- Update job status
  UPDATE public.job_queue
  SET
    status = v_status,
    completed_at = now(),
    execution_time_ms = v_execution_time_ms,
    error_message = p_error_message,
    error_stack = p_error_stack,
    last_error_at = CASE WHEN NOT p_success THEN now() ELSE last_error_at END,
    updated_at = now()
  WHERE id = p_job_id;
  
  -- Insert job history record
  INSERT INTO public.job_history (
    job_id,
    job_type,
    status,
    execution_time_ms,
    error_message,
    error_stack
  )
  VALUES (
    p_job_id,
    v_job_type,
    v_status,
    v_execution_time_ms,
    p_error_message,
    p_error_stack
  );
END;
$$ LANGUAGE plpgsql;

-- Function to retry a failed job
CREATE OR REPLACE FUNCTION public.retry_job(
  p_job_id UUID
)
RETURNS BOOLEAN AS $$
DECLARE
  v_job RECORD;
  v_config RECORD;
  v_next_retry_at TIMESTAMPTZ;
BEGIN
  -- Get job details
  SELECT * INTO v_job
  FROM public.job_queue
  WHERE id = p_job_id;
  
  IF NOT FOUND THEN
    RETURN false;
  END IF;
  
  -- Check if job can be retried
  IF v_job.retry_count >= v_job.max_retries THEN
    -- Move to dead letter queue
    UPDATE public.job_queue
    SET
      status = 'dead_letter',
      updated_at = now()
    WHERE id = p_job_id;
    
    -- Record in history
    INSERT INTO public.job_history (
      job_id,
      job_type,
      status,
      error_message
    )
    VALUES (
      p_job_id,
      v_job.job_type,
      'dead_letter',
      'Max retries exceeded'
    );
    
    RETURN false;
  END IF;
  
  -- Get job configuration for retry delay
  SELECT * INTO v_config
  FROM public.job_config
  WHERE job_type = v_job.job_type;
  
  -- Calculate next retry time
  v_next_retry_at := public.calculate_next_retry_time(
    v_job.retry_count + 1,
    COALESCE(v_config.initial_retry_delay_seconds, 60),
    COALESCE(v_config.retry_backoff_multiplier, 2.0),
    COALESCE(v_config.max_retry_delay_seconds, 3600)
  );
  
  -- Update job for retry
  UPDATE public.job_queue
  SET
    status = 'pending',
    retry_count = retry_count + 1,
    next_retry_at = v_next_retry_at,
    worker_id = NULL,
    started_at = NULL,
    error_message = NULL,
    error_stack = NULL,
    updated_at = now()
  WHERE id = p_job_id;
  
  RETURN true;
END;
$$ LANGUAGE plpgsql;

-- Function to get job statistics (for monitoring)
CREATE OR REPLACE FUNCTION public.get_job_statistics(
  p_job_type TEXT DEFAULT NULL,
  p_start_date TIMESTAMPTZ DEFAULT NULL,
  p_end_date TIMESTAMPTZ DEFAULT NULL
)
RETURNS TABLE (
  job_type TEXT,
  status TEXT,
  count BIGINT,
  avg_execution_time_ms NUMERIC,
  min_execution_time_ms INTEGER,
  max_execution_time_ms INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    jq.job_type,
    jq.status,
    COUNT(*)::BIGINT as count,
    AVG(jq.execution_time_ms)::NUMERIC as avg_execution_time_ms,
    MIN(jq.execution_time_ms)::INTEGER as min_execution_time_ms,
    MAX(jq.execution_time_ms)::INTEGER as max_execution_time_ms
  FROM public.job_queue jq
  WHERE
    (p_job_type IS NULL OR jq.job_type = p_job_type)
    AND (p_start_date IS NULL OR jq.created_at >= p_start_date)
    AND (p_end_date IS NULL OR jq.created_at <= p_end_date)
  GROUP BY jq.job_type, jq.status
  ORDER BY jq.job_type, jq.status;
END;
$$ LANGUAGE plpgsql;

-- RLS Policies (read-only for authenticated users, admin only for write)
ALTER TABLE public.job_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_config ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view job queue (read-only)
CREATE POLICY "Users can view job queue"
  ON public.job_queue
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy: Service role can manage jobs (for Edge Functions)
CREATE POLICY "Service role can manage jobs"
  ON public.job_queue
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Policy: Users can view job history (read-only)
CREATE POLICY "Users can view job history"
  ON public.job_history
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy: Service role can manage job history
CREATE POLICY "Service role can manage job history"
  ON public.job_history
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Policy: Users can view job config (read-only)
CREATE POLICY "Users can view job config"
  ON public.job_config
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy: Service role can manage job config (for configuration updates)
CREATE POLICY "Service role can manage job config"
  ON public.job_config
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
