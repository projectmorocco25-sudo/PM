/**
 * Edge Function: vci-send-email-notifications
 * 
 * Scheduled function that reads pending notifications and sends emails.
 * Runs every 5 minutes via pg_cron.
 * 
 * @module vci-send-email-notifications
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

const FUNCTION_NAME = 'vci-send-email-notifications';
const BATCH_SIZE = 50; // Process up to 50 notifications per run

interface Notification {
  id: string;
  user_id: string;
  title: string;
  content: string;
  notification_type: string;
  created_at: string;
  user_email?: string;
}

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  const corsResponse = handleCorsPreflightRequest(req);
  if (corsResponse) return corsResponse;

  // Setup logging
  const correlationId = getCorrelationId(req);
  const log = createRequestLogger(FUNCTION_NAME, correlationId);

  try {
    log.info('Starting email notification batch processing');

    // Verify authentication (service role key required)
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      log.warn('No authorization header provided');
      return authenticationErrorResponse('Service role authorization required', correlationId);
    }

    // Create Supabase client with service role
    const supabase = createServiceClient();

    // Fetch pending email notifications
    const { data: notifications, error: fetchError } = await supabase
      .from('notifications')
      .select(`
        id,
        user_id,
        title,
        content,
        notification_type,
        created_at,
        users!inner(email)
      `)
      .eq('email_sent', false)
      .eq('email_enabled', true)
      .order('created_at', { ascending: true })
      .limit(BATCH_SIZE);

    if (fetchError) {
      log.error('Failed to fetch notifications', new Error(fetchError.message));
      return systemErrorResponse('Failed to fetch notifications', correlationId);
    }

    if (!notifications || notifications.length === 0) {
      log.info('No pending notifications to send');
      return successResponse(
        { sent_count: 0, failed_count: 0, message: 'No pending notifications' },
        { correlation_id: correlationId }
      );
    }

    log.info(`Found ${notifications.length} pending notifications`);

    // Process notifications
    let sentCount = 0;
    let failedCount = 0;
    const results: Array<{ id: string; status: 'sent' | 'failed'; error?: string }> = [];

    for (const notification of notifications as unknown as Array<Notification & { users: { email: string } }>) {
      try {
        // Call shared-send-email function
        const emailServiceUrl = Deno.env.get('SUPABASE_URL') + '/functions/v1/shared-send-email';
        const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

        const emailResponse = await fetch(emailServiceUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${serviceRoleKey}`,
            'Content-Type': 'application/json',
            'x-correlation-id': correlationId,
          },
          body: JSON.stringify({
            to: notification.users.email,
            subject: notification.title,
            body: notification.content,
            template: 'notification',
            template_data: {
              notification_type: notification.notification_type,
              created_at: notification.created_at,
            },
          }),
        });

        if (emailResponse.ok) {
          // Mark notification as sent
          await supabase
            .from('notifications')
            .update({ email_sent: true, email_sent_at: new Date().toISOString() })
            .eq('id', notification.id);

          sentCount++;
          results.push({ id: notification.id, status: 'sent' });
        } else {
          const errorText = await emailResponse.text();
          failedCount++;
          results.push({ id: notification.id, status: 'failed', error: errorText });
          log.warn(`Failed to send notification ${notification.id}`, { error: errorText });
        }
      } catch (error) {
        failedCount++;
        results.push({ id: notification.id, status: 'failed', error: (error as Error).message });
        log.error(`Error processing notification ${notification.id}`, error as Error);
      }
    }

    // Audit log the batch processing
    await createAuditLog(supabase, {
      table_name: 'edge_function_executions',
      action: AuditAction.SCHEDULED_JOB_RUN,
      new_data: {
        function_name: FUNCTION_NAME,
        sent_count: sentCount,
        failed_count: failedCount,
        total_processed: notifications.length,
      },
      metadata: {
        correlation_id: correlationId,
      },
    });

    log.complete(200, { sent_count: sentCount, failed_count: failedCount });
    
    return successResponse(
      {
        sent_count: sentCount,
        failed_count: failedCount,
        total_processed: notifications.length,
        results,
      },
      { correlation_id: correlationId }
    );

  } catch (error) {
    log.error('Unexpected error in batch processing', error as Error);
    
    // Try to audit log the failure
    try {
      const supabase = createServiceClient();
      await createAuditLog(supabase, {
        table_name: 'edge_function_executions',
        action: AuditAction.SCHEDULED_JOB_FAILED,
        new_data: {
          function_name: FUNCTION_NAME,
          error: (error as Error).message,
        },
        metadata: {
          correlation_id: correlationId,
        },
      });
    } catch {
      // Ignore audit log errors during error handling
    }

    return systemErrorResponse('Failed to process email notifications', correlationId);
  }
});
