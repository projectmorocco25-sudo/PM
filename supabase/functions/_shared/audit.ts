/**
 * Audit Logging Utilities for Edge Functions
 * 
 * This module provides audit logging helpers for Edge Functions.
 * All significant operations should be logged for compliance.
 * 
 * Usage:
 *   import { createAuditLog, AuditAction } from '../_shared/audit.ts';
 */

import { SupabaseClient } from '@supabase/supabase-js';

/**
 * Audit action types
 */
export const AuditAction = {
  // System actions
  EMAIL_SENT: 'EMAIL_SENT',
  SCHEDULED_JOB_RUN: 'SCHEDULED_JOB_RUN',
  SCHEDULED_JOB_FAILED: 'SCHEDULED_JOB_FAILED',
  
  // Threshold actions
  THRESHOLD_REVERTED: 'THRESHOLD_REVERTED',
  THRESHOLD_REVERT_FAILED: 'THRESHOLD_REVERT_FAILED',
  
  // Export actions
  EXPORT_AUTHORIZED: 'EXPORT_AUTHORIZED',
  EXPORT_EXPIRED: 'EXPORT_EXPIRED',
  
  // Score actions
  SCORE_CALCULATED: 'SCORE_CALCULATED',
  SCORE_RECALCULATED: 'SCORE_RECALCULATED',
  
  // Notification actions
  NOTIFICATION_SENT: 'NOTIFICATION_SENT',
  NOTIFICATION_FAILED: 'NOTIFICATION_FAILED',
} as const;

export type AuditActionType = typeof AuditAction[keyof typeof AuditAction];

/**
 * Audit log entry structure
 */
export interface AuditLogEntry {
  table_name: string;
  record_id?: string;
  action: AuditActionType | string;
  old_data?: Record<string, unknown>;
  new_data?: Record<string, unknown>;
  user_id?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Creates an audit log entry via RPC function.
 * 
 * @param client - Supabase client (service role for Edge Functions)
 * @param entry - Audit log entry data
 * @returns The created audit log ID or null on failure
 */
export async function createAuditLog(
  client: SupabaseClient,
  entry: AuditLogEntry
): Promise<string | null> {
  try {
    const { data, error } = await client.rpc('shared_create_audit_log', {
      p_table_name: entry.table_name,
      p_record_id: entry.record_id || null,
      p_action: entry.action,
      p_old_data: entry.old_data || null,
      p_new_data: entry.new_data || null,
      p_user_id: entry.user_id || null,
      p_metadata: entry.metadata || null,
    });

    if (error) {
      console.error('Failed to create audit log:', error);
      return null;
    }

    return data;
  } catch (err) {
    console.error('Error creating audit log:', err);
    return null;
  }
}

/**
 * Creates a batch of audit log entries.
 * 
 * @param client - Supabase client (service role for Edge Functions)
 * @param entries - Array of audit log entries
 * @returns Array of created audit log IDs
 */
export async function createAuditLogBatch(
  client: SupabaseClient,
  entries: AuditLogEntry[]
): Promise<(string | null)[]> {
  const results = await Promise.allSettled(
    entries.map((entry) => createAuditLog(client, entry))
  );

  return results.map((result) => 
    result.status === 'fulfilled' ? result.value : null
  );
}

/**
 * Audit log helper for Edge Function execution tracking.
 * Creates start and complete log entries.
 */
export function createEdgeFunctionAuditContext(
  client: SupabaseClient,
  functionName: string,
  correlationId: string
) {
  const startTime = Date.now();

  return {
    /**
     * Log function start
     */
    async logStart(params?: Record<string, unknown>): Promise<void> {
      await createAuditLog(client, {
        table_name: 'edge_function_executions',
        action: 'FUNCTION_STARTED',
        new_data: {
          function_name: functionName,
          correlation_id: correlationId,
          params,
        },
        metadata: {
          correlation_id: correlationId,
        },
      });
    },

    /**
     * Log function completion
     */
    async logComplete(result: Record<string, unknown>): Promise<void> {
      const durationMs = Date.now() - startTime;
      
      await createAuditLog(client, {
        table_name: 'edge_function_executions',
        action: 'FUNCTION_COMPLETED',
        new_data: {
          function_name: functionName,
          correlation_id: correlationId,
          result,
          duration_ms: durationMs,
        },
        metadata: {
          correlation_id: correlationId,
          duration_ms: durationMs,
        },
      });
    },

    /**
     * Log function error
     */
    async logError(error: Error, context?: Record<string, unknown>): Promise<void> {
      const durationMs = Date.now() - startTime;
      
      await createAuditLog(client, {
        table_name: 'edge_function_executions',
        action: 'FUNCTION_FAILED',
        new_data: {
          function_name: functionName,
          correlation_id: correlationId,
          error: {
            name: error.name,
            message: error.message,
          },
          context,
          duration_ms: durationMs,
        },
        metadata: {
          correlation_id: correlationId,
          duration_ms: durationMs,
        },
      });
    },
  };
}
