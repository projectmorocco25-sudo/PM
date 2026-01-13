/**
 * Edge Function: vci-check-threshold-reverts
 * 
 * Scheduled function that checks for threshold reversions.
 * Handles both ECS threshold reversions (after 3 months) and VCI temporary thresholds.
 * Runs daily via pg_cron.
 * 
 * @module vci-check-threshold-reverts
 * @see docs/02-architecture/api/edge-functions.md
 */

import 'edge-runtime';
import { createServiceClient } from '../_shared/supabase-client.ts';
import { handleCorsPreflightRequest } from '../_shared/cors.ts';
import {
  successResponse,
  systemErrorResponse,
  authenticationErrorResponse,
} from '../_shared/response.ts';
import { createRequestLogger, getCorrelationId } from '../_shared/logger.ts';
import { createAuditLog, AuditAction } from '../_shared/audit.ts';

const FUNCTION_NAME = 'vci-check-threshold-reverts';

interface ThresholdRevertResult {
  ecs_thresholds_reverted: number;
  vci_auto_reverted: number;
  vci_manual_review_required: number;
  notifications_7d_sent: number;
  notifications_1d_sent: number;
  errors: Array<{ threshold_id: string; error: string }>;
}

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  const corsResponse = handleCorsPreflightRequest(req);
  if (corsResponse) return corsResponse;

  // Setup logging
  const correlationId = getCorrelationId(req);
  const log = createRequestLogger(FUNCTION_NAME, correlationId);

  try {
    log.info('Starting threshold reversion check');

    // Verify authentication (service role key required)
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      log.warn('No authorization header provided');
      return authenticationErrorResponse('Service role authorization required', correlationId);
    }

    // Parse request body for check date (optional)
    let checkDate = new Date().toISOString().split('T')[0]; // Default to today
    try {
      const body = await req.json();
      if (body.check_date) {
        checkDate = body.check_date;
      }
    } catch {
      // Use default date if no body
    }

    log.info(`Checking threshold reversions for date: ${checkDate}`);

    // Create Supabase client with service role
    const supabase = createServiceClient();

    const result: ThresholdRevertResult = {
      ecs_thresholds_reverted: 0,
      vci_auto_reverted: 0,
      vci_manual_review_required: 0,
      notifications_7d_sent: 0,
      notifications_1d_sent: 0,
      errors: [],
    };

    // 1. Process ECS threshold reversions (from export authorizations)
    log.info('Checking ECS threshold reversions');
    const { data: ecsThresholds, error: ecsError } = await supabase
      .from('thresholds')
      .select('*')
      .eq('threshold_type', 'ecs_threshold')
      .eq('is_current', true)
      .lte('expiry_date', checkDate);

    if (ecsError) {
      log.error('Failed to fetch ECS thresholds', new Error(ecsError.message));
    } else if (ecsThresholds && ecsThresholds.length > 0) {
      log.info(`Found ${ecsThresholds.length} ECS thresholds to revert`);
      
      for (const threshold of ecsThresholds) {
        try {
          // Call RPC function to revert threshold
          const { error: revertError } = await supabase.rpc('vci_revert_ecs_threshold', {
            p_threshold_id: threshold.id,
          });

          if (revertError) {
            result.errors.push({ threshold_id: threshold.id, error: revertError.message });
            log.warn(`Failed to revert ECS threshold ${threshold.id}`, { error: revertError.message });
          } else {
            result.ecs_thresholds_reverted++;
            
            // Create audit log
            await createAuditLog(supabase, {
              table_name: 'thresholds',
              record_id: threshold.id,
              action: AuditAction.THRESHOLD_REVERTED,
              old_data: { threshold_type: 'ecs_threshold', is_current: true },
              new_data: { threshold_type: 'ecs_threshold', is_current: false },
              metadata: { correlation_id: correlationId, revert_reason: 'expiry_date_reached' },
            });
          }
        } catch (error) {
          result.errors.push({ threshold_id: threshold.id, error: (error as Error).message });
        }
      }
    }

    // 2. Process VCI temporary threshold reversions (auto-revert type)
    log.info('Checking VCI temporary threshold reversions (auto-revert)');
    const { data: vciAutoRevert, error: vciAutoError } = await supabase
      .from('thresholds')
      .select('*')
      .eq('duration_type', 'temporary_auto_revert')
      .eq('is_current', true)
      .lte('revert_date', checkDate);

    if (vciAutoError) {
      log.error('Failed to fetch VCI auto-revert thresholds', new Error(vciAutoError.message));
    } else if (vciAutoRevert && vciAutoRevert.length > 0) {
      log.info(`Found ${vciAutoRevert.length} VCI thresholds to auto-revert`);
      
      for (const threshold of vciAutoRevert) {
        try {
          const { error: revertError } = await supabase.rpc('revert_temporary_threshold', {
            p_threshold_id: threshold.id,
          });

          if (revertError) {
            result.errors.push({ threshold_id: threshold.id, error: revertError.message });
          } else {
            result.vci_auto_reverted++;
            
            await createAuditLog(supabase, {
              table_name: 'thresholds',
              record_id: threshold.id,
              action: AuditAction.THRESHOLD_REVERTED,
              old_data: { duration_type: 'temporary_auto_revert', is_current: true },
              new_data: { is_current: false },
              metadata: { correlation_id: correlationId, revert_reason: 'auto_revert' },
            });
          }
        } catch (error) {
          result.errors.push({ threshold_id: threshold.id, error: (error as Error).message });
        }
      }
    }

    // 3. Process VCI manual review thresholds (create notifications, don't auto-revert)
    log.info('Checking VCI manual review thresholds');
    const { data: vciManualReview, error: vciManualError } = await supabase
      .from('thresholds')
      .select('*')
      .eq('duration_type', 'temporary_manual_review')
      .eq('is_current', true)
      .lte('revert_date', checkDate)
      .eq('revert_notification_sent_on_date', false);

    if (vciManualError) {
      log.error('Failed to fetch VCI manual review thresholds', new Error(vciManualError.message));
    } else if (vciManualReview && vciManualReview.length > 0) {
      log.info(`Found ${vciManualReview.length} VCI thresholds requiring manual review`);
      
      for (const threshold of vciManualReview) {
        try {
          // Create notification for Tier 1 review
          await supabase.rpc('shared_create_notification', {
            p_user_role: 'moh_tier1',
            p_title: 'Threshold Reversion Review Required',
            p_content: `Temporary threshold for SKU ${threshold.sku_id} has reached its revert date and requires manual review.`,
            p_notification_type: 'threshold_review',
            p_reference_type: 'threshold',
            p_reference_id: threshold.id,
          });

          // Mark notification as sent
          await supabase
            .from('thresholds')
            .update({ revert_notification_sent_on_date: true })
            .eq('id', threshold.id);

          result.vci_manual_review_required++;
        } catch (error) {
          result.errors.push({ threshold_id: threshold.id, error: (error as Error).message });
        }
      }
    }

    // 4. Send 7-day warning notifications
    const sevenDaysFromNow = new Date(checkDate);
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
    const sevenDayDate = sevenDaysFromNow.toISOString().split('T')[0];

    const { data: upcoming7d, error: upcoming7dError } = await supabase
      .from('thresholds')
      .select('*')
      .eq('is_current', true)
      .eq('revert_notification_sent_7d', false)
      .lte('revert_date', sevenDayDate)
      .gt('revert_date', checkDate);

    if (!upcoming7dError && upcoming7d && upcoming7d.length > 0) {
      for (const threshold of upcoming7d) {
        try {
          await supabase.rpc('shared_create_notification', {
            p_user_role: 'moh_tier1',
            p_title: 'Threshold Reversion in 7 Days',
            p_content: `Threshold for SKU ${threshold.sku_id} will revert on ${threshold.revert_date}.`,
            p_notification_type: 'threshold_warning',
            p_reference_type: 'threshold',
            p_reference_id: threshold.id,
          });

          await supabase
            .from('thresholds')
            .update({ revert_notification_sent_7d: true })
            .eq('id', threshold.id);

          result.notifications_7d_sent++;
        } catch {
          // Continue processing other thresholds
        }
      }
    }

    // 5. Send 1-day warning notifications
    const oneDayFromNow = new Date(checkDate);
    oneDayFromNow.setDate(oneDayFromNow.getDate() + 1);
    const oneDayDate = oneDayFromNow.toISOString().split('T')[0];

    const { data: upcoming1d, error: upcoming1dError } = await supabase
      .from('thresholds')
      .select('*')
      .eq('is_current', true)
      .eq('revert_notification_sent_1d', false)
      .lte('revert_date', oneDayDate)
      .gt('revert_date', checkDate);

    if (!upcoming1dError && upcoming1d && upcoming1d.length > 0) {
      for (const threshold of upcoming1d) {
        try {
          await supabase.rpc('shared_create_notification', {
            p_user_role: 'moh_tier1',
            p_title: 'Threshold Reversion Tomorrow',
            p_content: `Threshold for SKU ${threshold.sku_id} will revert tomorrow (${threshold.revert_date}).`,
            p_notification_type: 'threshold_warning',
            p_reference_type: 'threshold',
            p_reference_id: threshold.id,
          });

          await supabase
            .from('thresholds')
            .update({ revert_notification_sent_1d: true })
            .eq('id', threshold.id);

          result.notifications_1d_sent++;
        } catch {
          // Continue processing other thresholds
        }
      }
    }

    // Audit log the job execution
    await createAuditLog(supabase, {
      table_name: 'edge_function_executions',
      action: AuditAction.SCHEDULED_JOB_RUN,
      new_data: {
        function_name: FUNCTION_NAME,
        check_date: checkDate,
        ...result,
      },
      metadata: {
        correlation_id: correlationId,
      },
    });

    log.complete(200, result);
    
    return successResponse(result, { correlation_id: correlationId });

  } catch (error) {
    log.error('Unexpected error in threshold reversion check', error as Error);
    return systemErrorResponse('Failed to process threshold reversions', correlationId);
  }
});
