/**
 * Edge Function: communications-send-message-emails
 * 
 * Task 1.1.1.4l: Create Edge Function for message email notifications
 * 
 * Scheduled function that reads from notifications table for new messages,
 * sends emails to recipients, and marks notifications as sent.
 * 
 * Runs every 2 minutes via pg_cron for near real-time message delivery.
 * 
 * @module communications-send-message-emails
 * @see docs/02-architecture/api/edge-functions.md
 * @see docs/02-architecture/communication-channels-lifecycle.md
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

const FUNCTION_NAME = 'communications-send-message-emails';
const BATCH_SIZE = 100; // Process up to 100 message notifications per run
const MAX_RETRIES = 3; // Maximum retry attempts for failed emails

/**
 * Message notification structure from database
 */
interface MessageNotification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  link: string | null;
  is_read: boolean;
  created_at: string;
}

/**
 * User data for email sending
 */
interface UserData {
  id: string;
  email: string;
  full_name: string | null;
  notification_preferences: {
    email_enabled?: boolean;
    submission_updates?: boolean;
    compliance_alerts?: boolean;
    enforcement_actions?: boolean;
    system_announcements?: boolean;
  } | null;
}

/**
 * Conversation context for email content
 */
interface ConversationContext {
  id: string;
  subject: string;
  type: string;
  sender_name: string | null;
}

/**
 * Email template data
 */
interface MessageEmailTemplate {
  recipientName: string;
  senderName: string;
  conversationSubject: string;
  messagePreview: string;
  messageLink: string;
  platformName: string;
  unsubscribeLink: string;
}

/**
 * Generates HTML email content for message notification
 */
function generateMessageEmailHtml(template: MessageEmailTemplate): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Message - ${template.platformName}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f4f4f5;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="background-color: #1e40af; padding: 24px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600;">
                ${template.platformName}
              </h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 32px 24px;">
              <p style="margin: 0 0 16px 0; color: #374151; font-size: 16px;">
                Hello ${template.recipientName || 'there'},
              </p>
              
              <p style="margin: 0 0 24px 0; color: #374151; font-size: 16px;">
                You have received a new message from <strong>${template.senderName || 'a user'}</strong>.
              </p>
              
              <!-- Message Preview Box -->
              <table role="presentation" style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
                <tr>
                  <td style="background-color: #f9fafb; border-left: 4px solid #1e40af; padding: 16px; border-radius: 0 4px 4px 0;">
                    <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em;">
                      Re: ${template.conversationSubject}
                    </p>
                    <p style="margin: 0; color: #374151; font-size: 14px; line-height: 1.5;">
                      ${template.messagePreview}
                    </p>
                  </td>
                </tr>
              </table>
              
              <!-- CTA Button -->
              <table role="presentation" style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="text-align: center; padding: 8px 0 24px 0;">
                    <a href="${template.messageLink}" 
                       style="display: inline-block; background-color: #1e40af; color: #ffffff; text-decoration: none; padding: 12px 32px; border-radius: 6px; font-size: 14px; font-weight: 600;">
                      View Message
                    </a>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 0; color: #6b7280; font-size: 14px;">
                If the button doesn't work, copy and paste this link into your browser:
                <br>
                <a href="${template.messageLink}" style="color: #1e40af; word-break: break-all;">
                  ${template.messageLink}
                </a>
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 24px; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 12px; text-align: center;">
                This email was sent by ${template.platformName} because you have email notifications enabled.
              </p>
              <p style="margin: 0; color: #6b7280; font-size: 12px; text-align: center;">
                <a href="${template.unsubscribeLink}" style="color: #1e40af;">
                  Manage notification preferences
                </a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

/**
 * Generates plain text email content for message notification
 */
function generateMessageEmailText(template: MessageEmailTemplate): string {
  return `
New Message - ${template.platformName}

Hello ${template.recipientName || 'there'},

You have received a new message from ${template.senderName || 'a user'}.

---
Re: ${template.conversationSubject}

${template.messagePreview}
---

View the full message: ${template.messageLink}

---
This email was sent by ${template.platformName} because you have email notifications enabled.
Manage notification preferences: ${template.unsubscribeLink}
  `.trim();
}

/**
 * Truncates message content for preview
 */
function truncateMessage(content: string, maxLength: number = 200): string {
  if (content.length <= maxLength) return content;
  return content.substring(0, maxLength).trim() + '...';
}

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  const corsResponse = handleCorsPreflightRequest(req);
  if (corsResponse) return corsResponse;

  // Setup logging
  const correlationId = getCorrelationId(req);
  const log = createRequestLogger(FUNCTION_NAME, correlationId);

  try {
    log.info('Starting message email notification batch processing');

    // Verify authentication (service role key required for scheduled jobs)
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      log.warn('No authorization header provided');
      return authenticationErrorResponse('Service role authorization required', correlationId);
    }

    // Create Supabase client with service role
    const supabase = createServiceClient();

    // Platform configuration
    const platformUrl = Deno.env.get('PLATFORM_URL') || 'https://pm-platform.gov.dz';
    const platformName = Deno.env.get('PLATFORM_NAME') || 'PM Platform';

    // Fetch pending message notifications that need email
    // Only fetch notifications of type 'message_received'
    const { data: notifications, error: fetchError } = await supabase
      .from('notifications')
      .select('id, user_id, type, title, message, link, is_read, created_at')
      .eq('type', 'message_received')
      .is('email_sent_at', null) // Not yet sent
      .order('created_at', { ascending: true })
      .limit(BATCH_SIZE);

    if (fetchError) {
      log.error('Failed to fetch notifications', new Error(fetchError.message));
      return systemErrorResponse('Failed to fetch notifications', correlationId);
    }

    if (!notifications || notifications.length === 0) {
      log.info('No pending message notifications to send');
      return successResponse(
        { 
          sent_count: 0, 
          failed_count: 0, 
          skipped_count: 0,
          message: 'No pending message notifications' 
        },
        { correlation_id: correlationId }
      );
    }

    log.info(`Found ${notifications.length} pending message notifications`);

    // Get unique user IDs
    const userIds = [...new Set(notifications.map(n => n.user_id))];

    // Fetch user data with notification preferences
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, email, full_name, notification_preferences')
      .in('id', userIds);

    if (usersError) {
      log.error('Failed to fetch user data', new Error(usersError.message));
      return systemErrorResponse('Failed to fetch user data', correlationId);
    }

    // Create user lookup map
    const userMap = new Map<string, UserData>();
    for (const user of users || []) {
      userMap.set(user.id, user as UserData);
    }

    // Process notifications
    let sentCount = 0;
    let failedCount = 0;
    let skippedCount = 0;
    const results: Array<{ 
      id: string; 
      status: 'sent' | 'failed' | 'skipped'; 
      reason?: string;
      error?: string;
    }> = [];

    for (const notification of notifications as MessageNotification[]) {
      const user = userMap.get(notification.user_id);

      // Skip if user not found
      if (!user) {
        skippedCount++;
        results.push({ 
          id: notification.id, 
          status: 'skipped', 
          reason: 'user_not_found' 
        });
        continue;
      }

      // Skip if user has email notifications disabled
      if (user.notification_preferences?.email_enabled === false) {
        skippedCount++;
        results.push({ 
          id: notification.id, 
          status: 'skipped', 
          reason: 'email_disabled' 
        });
        
        // Mark as processed (no email needed)
        await supabase
          .from('notifications')
          .update({ 
            email_sent_at: new Date().toISOString(),
            email_skipped_reason: 'email_disabled'
          })
          .eq('id', notification.id);
        
        continue;
      }

      // Skip if notification was already read (user saw it in-app)
      if (notification.is_read) {
        skippedCount++;
        results.push({ 
          id: notification.id, 
          status: 'skipped', 
          reason: 'already_read' 
        });
        
        // Mark as processed
        await supabase
          .from('notifications')
          .update({ 
            email_sent_at: new Date().toISOString(),
            email_skipped_reason: 'already_read'
          })
          .eq('id', notification.id);
        
        continue;
      }

      try {
        // Parse sender info from notification title (format: "New message from [Sender Name]")
        const senderMatch = notification.title.match(/from\s+(.+)$/i);
        const senderName = senderMatch ? senderMatch[1] : 'a user';

        // Extract conversation subject from link if available
        let conversationSubject = 'Conversation';
        if (notification.link) {
          // Link format might be: /messages/conversation-id
          conversationSubject = 'your conversation';
        }

        // Build email template data
        const templateData: MessageEmailTemplate = {
          recipientName: user.full_name || user.email.split('@')[0],
          senderName,
          conversationSubject,
          messagePreview: truncateMessage(notification.message, 300),
          messageLink: notification.link 
            ? `${platformUrl}${notification.link}` 
            : `${platformUrl}/messages`,
          platformName,
          unsubscribeLink: `${platformUrl}/settings/notifications`,
        };

        // Generate email content
        const htmlContent = generateMessageEmailHtml(templateData);
        const textContent = generateMessageEmailText(templateData);

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
            to: user.email,
            subject: notification.title,
            body: htmlContent,
            text_body: textContent,
            template: 'message_notification',
            template_data: {
              notification_id: notification.id,
              notification_type: notification.type,
              created_at: notification.created_at,
              recipient_id: user.id,
            },
          }),
        });

        if (emailResponse.ok) {
          // Mark notification as email sent
          const { error: updateError } = await supabase
            .from('notifications')
            .update({ 
              email_sent_at: new Date().toISOString() 
            })
            .eq('id', notification.id);

          if (updateError) {
            log.warn(`Failed to update notification ${notification.id}`, { 
              error: updateError.message 
            });
          }

          sentCount++;
          results.push({ id: notification.id, status: 'sent' });
          
          log.info(`Email sent for notification ${notification.id} to ${user.email}`);
        } else {
          const errorText = await emailResponse.text();
          failedCount++;
          results.push({ 
            id: notification.id, 
            status: 'failed', 
            error: errorText 
          });
          
          log.warn(`Failed to send email for notification ${notification.id}`, { 
            error: errorText 
          });

          // Update notification with error info for retry tracking
          await supabase
            .from('notifications')
            .update({ 
              email_error: errorText,
              email_retry_count: 1 // Will be incremented on retries
            })
            .eq('id', notification.id);
        }
      } catch (error) {
        failedCount++;
        results.push({ 
          id: notification.id, 
          status: 'failed', 
          error: (error as Error).message 
        });
        
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
        skipped_count: skippedCount,
        total_processed: notifications.length,
      },
      metadata: {
        correlation_id: correlationId,
      },
    });

    const responseData = {
      sent_count: sentCount,
      failed_count: failedCount,
      skipped_count: skippedCount,
      total_processed: notifications.length,
      results,
    };

    log.complete(200, responseData);
    
    return successResponse(responseData, { correlation_id: correlationId });

  } catch (error) {
    log.error('Unexpected error in message email batch processing', error as Error);
    
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

    return systemErrorResponse('Failed to process message email notifications', correlationId);
  }
});
