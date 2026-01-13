/**
 * Edge Function: ecs-expire-authorizations
 * 
 * Scheduled function that expires export authorizations after their valid_until date.
 * Also triggers threshold reversion when authorizations expire.
 * Runs daily via pg_cron.
 * 
 * @module ecs-expire-authorizations
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

const FUNCTION_NAME = 'ecs-expire-authorizations';

interface ExpirationResult {
  authorizations_expired: number;
  thresholds_reverted: number;
  notifications_sent: number;
  errors: Array<{ authorization_id: string; error: string }>;
}

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  const corsResponse = handleCorsPreflightRequest(req);
  if (corsResponse) return corsResponse;

  // Setup logging
  const correlationId = getCorrelationId(req);
  const log = createRequestLogger(FUNCTION_NAME, correlationId);

  try {
    log.info('Starting export authorization expiration check');

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

    log.info(`Checking authorization expirations for date: ${checkDate}`);

    // Create Supabase client with service role
    const supabase = createServiceClient();

    const result: ExpirationResult = {
      authorizations_expired: 0,
      thresholds_reverted: 0,
      notifications_sent: 0,
      errors: [],
    };

    // Fetch expired authorizations
    const { data: expiredAuths, error: fetchError } = await supabase
      .from('export_authorizations')
      .select(`
        id,
        company_id,
        sku_id,
        valid_until,
        status,
        thresholds!inner(id)
      `)
      .eq('status', 'authorized')
      .lt('valid_until', checkDate);

    if (fetchError) {
      log.error('Failed to fetch expired authorizations', new Error(fetchError.message));
      return systemErrorResponse('Failed to fetch expired authorizations', correlationId);
    }

    if (!expiredAuths || expiredAuths.length === 0) {
      log.info('No expired authorizations found');
      return successResponse(
        { ...result, message: 'No expired authorizations found' },
        { correlation_id: correlationId }
      );
    }

    log.info(`Found ${expiredAuths.length} expired authorizations`);

    // Process each expired authorization
    for (const auth of expiredAuths as Array<{
      id: string;
      company_id: string;
      sku_id: string;
      valid_until: string;
      status: string;
      thresholds: { id: string }[];
    }>) {
      try {
        // 1. Update authorization status to 'expired'
        const { error: updateError } = await supabase
          .from('export_authorizations')
          .update({
            status: 'expired',
            expired_at: new Date().toISOString(),
          })
          .eq('id', auth.id);

        if (updateError) {
          result.errors.push({ authorization_id: auth.id, error: updateError.message });
          continue;
        }

        result.authorizations_expired++;

        // Audit log the expiration
        await createAuditLog(supabase, {
          table_name: 'export_authorizations',
          record_id: auth.id,
          action: AuditAction.EXPORT_EXPIRED,
          old_data: { status: 'authorized' },
          new_data: { status: 'expired' },
          metadata: {
            correlation_id: correlationId,
            valid_until: auth.valid_until,
          },
        });

        // 2. Revert associated ECS threshold
        if (auth.thresholds && auth.thresholds.length > 0) {
          for (const threshold of auth.thresholds) {
            try {
              const { error: revertError } = await supabase.rpc('vci_revert_ecs_threshold', {
                p_threshold_id: threshold.id,
              });

              if (revertError) {
                log.warn(`Failed to revert threshold ${threshold.id}`, {
                  error: revertError.message,
                });
              } else {
                result.thresholds_reverted++;
                
                await createAuditLog(supabase, {
                  table_name: 'thresholds',
                  record_id: threshold.id,
                  action: AuditAction.THRESHOLD_REVERTED,
                  old_data: { is_current: true },
                  new_data: { is_current: false },
                  metadata: {
                    correlation_id: correlationId,
                    revert_reason: 'authorization_expired',
                    authorization_id: auth.id,
                  },
                });
              }
            } catch (error) {
              log.warn(`Error reverting threshold ${threshold.id}`, {
                error: (error as Error).message,
              });
            }
          }
        }

        // 3. Send notification to company
        try {
          await supabase.rpc('shared_create_notification', {
            p_company_id: auth.company_id,
            p_title: 'Export Authorization Expired',
            p_content: `Your export authorization for SKU ${auth.sku_id} has expired. The threshold has been reverted to the standard VCI threshold.`,
            p_notification_type: 'export_expired',
            p_reference_type: 'export_authorization',
            p_reference_id: auth.id,
          });

          result.notifications_sent++;
        } catch (error) {
          log.warn(`Failed to send expiration notification for auth ${auth.id}`, {
            error: (error as Error).message,
          });
        }

      } catch (error) {
        result.errors.push({ authorization_id: auth.id, error: (error as Error).message });
        log.error(`Error processing authorization ${auth.id}`, error as Error);
      }
    }

    // Audit log the job completion
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
    log.error('Unexpected error in authorization expiration check', error as Error);
    return systemErrorResponse('Failed to process authorization expirations', correlationId);
  }
});
