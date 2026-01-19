/**
 * Job Queue Utilities
 * Task: 1.1.1.4m - Create background job queue infrastructure
 * Reference: Edge Functions Specification
 * 
 * Shared utilities for job queue operations in Edge Functions
 */

import { createClient } from "./supabase-client.ts";

export type JobType = 
  | 'email_notification' 
  | 'report_generation' 
  | 'data_export' 
  | 'scheduled_calculation';

export type JobStatus = 
  | 'pending' 
  | 'processing' 
  | 'completed' 
  | 'failed' 
  | 'cancelled' 
  | 'dead_letter';

export interface JobPayload {
  [key: string]: unknown;
}

export interface JobMetadata {
  [key: string]: unknown;
}

export interface Job {
  id: string;
  job_type: JobType;
  status: JobStatus;
  priority: number;
  payload: JobPayload;
  metadata: JobMetadata;
  retry_count: number;
  max_retries: number;
}

/**
 * Enqueue a job
 */
export async function enqueueJob(params: {
  jobType: JobType;
  payload?: JobPayload;
  metadata?: JobMetadata;
  priority?: number;
  maxRetries?: number;
  jobKey?: string; // For duplicate prevention
}): Promise<string> {
  const supabase = createClient();
  
  const { data, error } = await supabase.rpc('enqueue_job', {
    p_job_type: params.jobType,
    p_payload: params.payload || {},
    p_metadata: params.metadata || {},
    p_priority: params.priority ?? 5,
    p_max_retries: params.maxRetries ?? 3,
    p_job_key: params.jobKey || null,
  });
  
  if (error) {
    throw new Error(`Failed to enqueue job: ${error.message}`);
  }
  
  return data as string;
}

/**
 * Dequeue a job (for workers)
 */
export async function dequeueJob(
  workerId: string,
  jobType?: JobType
): Promise<Job | null> {
  const supabase = createClient();
  
  const { data, error } = await supabase.rpc('dequeue_job', {
    p_worker_id: workerId,
    p_job_type: jobType || null,
  });
  
  if (error) {
    throw new Error(`Failed to dequeue job: ${error.message}`);
  }
  
  if (!data || data.length === 0) {
    return null;
  }
  
  return data[0] as Job;
}

/**
 * Complete a job
 */
export async function completeJob(params: {
  jobId: string;
  success: boolean;
  errorMessage?: string;
  errorStack?: string;
}): Promise<void> {
  const supabase = createClient();
  
  const { error } = await supabase.rpc('complete_job', {
    p_job_id: params.jobId,
    p_success: params.success,
    p_error_message: params.errorMessage || null,
    p_error_stack: params.errorStack || null,
  });
  
  if (error) {
    throw new Error(`Failed to complete job: ${error.message}`);
  }
}

/**
 * Retry a failed job
 */
export async function retryJob(jobId: string): Promise<boolean> {
  const supabase = createClient();
  
  const { data, error } = await supabase.rpc('retry_job', {
    p_job_id: jobId,
  });
  
  if (error) {
    throw new Error(`Failed to retry job: ${error.message}`);
  }
  
  return data as boolean;
}

/**
 * Get job statistics (for monitoring)
 */
export async function getJobStatistics(params?: {
  jobType?: JobType;
  startDate?: Date;
  endDate?: Date;
}): Promise<Array<{
  job_type: JobType;
  status: JobStatus;
  count: number;
  avg_execution_time_ms: number;
  min_execution_time_ms: number;
  max_execution_time_ms: number;
}>> {
  const supabase = createClient();
  
  const { data, error } = await supabase.rpc('get_job_statistics', {
    p_job_type: params?.jobType || null,
    p_start_date: params?.startDate?.toISOString() || null,
    p_end_date: params?.endDate?.toISOString() || null,
  });
  
  if (error) {
    throw new Error(`Failed to get job statistics: ${error.message}`);
  }
  
  return (data || []) as Array<{
    job_type: JobType;
    status: JobStatus;
    count: number;
    avg_execution_time_ms: number;
    min_execution_time_ms: number;
    max_execution_time_ms: number;
  }>;
}
