/**
 * Edge Function: shared-send-email
 * 
 * Sends emails via external email service.
 * 
 * @module shared-send-email
 * @see docs/02-architecture/api/edge-functions.md
 */

import 'edge-runtime';
import { createServiceClient } from '../_shared/supabase-client.ts';
import { handleCorsPreflightRequest } from '../_shared/cors.ts';
import {
  successResponse,
  systemErrorResponse,
  validationErrorResponse,
  authenticationErrorResponse,
} from '../_shared/response.ts';
import { createRequestLogger, getCorrelationId } from '../_shared/logger.ts';
import { validateSchema } from '../_shared/validation.ts';
import { createAuditLog, AuditAction } from '../_shared/audit.ts';

const FUNCTION_NAME = 'shared-send-email';

/**
 * Request schema for email sending
 */
const requestSchema = {
  to: { type: 'email' as const, required: true },
  subject: { type: 'string' as const, required: true, minLength: 1, maxLength: 200 },
  body: { type: 'string' as const, required: true, minLength: 1, maxLength: 50000 },
  template: { type: 'string' as const, required: false, nullable: true },
  template_data: { type: 'object' as const, required: false, nullable: true },
};

/**
 * Email service configuration
 */
interface EmailConfig {
  apiKey: string;
  serviceUrl: string;
  fromAddress: string;
  fromName: string;
}

/**
 * Gets email service configuration from environment
 */
function getEmailConfig(): EmailConfig | null {
  const apiKey = Deno.env.get('EMAIL_SERVICE_API_KEY');
  const serviceUrl = Deno.env.get('EMAIL_SERVICE_URL');
  const fromAddress = Deno.env.get('EMAIL_FROM_ADDRESS') || 'noreply@pm-platform.gov.ma';
  const fromName = Deno.env.get('EMAIL_FROM_NAME') || 'PM Platform';

  if (!apiKey || !serviceUrl) {
    return null;
  }

  return { apiKey, serviceUrl, fromAddress, fromName };
}

/**
 * Sends email via external service
 */
async function sendEmail(
  config: EmailConfig,
  to: string,
  subject: string,
  body: string,
  _template?: string,
  _templateData?: Record<string, unknown>
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    // TODO: Implement actual email service integration
    // This is a placeholder implementation
    // Supported services: SendGrid, Resend, AWS SES, etc.
    
    // Example implementation with a generic email API:
    const response = await fetch(config.serviceUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: {
          email: config.fromAddress,
          name: config.fromName,
        },
        to: [{ email: to }],
        subject,
        html: body, // TODO: Apply template if provided
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return { success: false, error: `Email service error: ${response.status} - ${errorText}` };
    }

    const result = await response.json();
    return { success: true, messageId: result.id || result.messageId || 'unknown' };

  } catch (error) {
    return { success: false, error: `Failed to send email: ${(error as Error).message}` };
  }
}

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  const corsResponse = handleCorsPreflightRequest(req);
  if (corsResponse) return corsResponse;

  // Setup logging
  const correlationId = getCorrelationId(req);
  const log = createRequestLogger(FUNCTION_NAME, correlationId);

  try {
    log.info('Email send request received');

    // Verify authentication (service role or valid JWT)
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      log.warn('No authorization header provided');
      return authenticationErrorResponse('Authorization required', correlationId);
    }

    // Parse and validate request body
    let body: Record<string, unknown>;
    try {
      body = await req.json();
    } catch {
      return validationErrorResponse('Invalid JSON body', undefined, correlationId);
    }

    const validation = validateSchema(body, requestSchema);
    if (!validation.valid) {
      log.warn('Validation failed', { errors: validation.errors });
      return validationErrorResponse('Validation failed', validation.errors, correlationId);
    }

    const { to, subject, body: emailBody, template, template_data } = body as {
      to: string;
      subject: string;
      body: string;
      template?: string;
      template_data?: Record<string, unknown>;
    };

    // Get email configuration
    const emailConfig = getEmailConfig();
    if (!emailConfig) {
      log.error('Email service not configured');
      return systemErrorResponse('Email service not configured', correlationId);
    }

    // Send email
    const result = await sendEmail(
      emailConfig,
      to,
      subject,
      emailBody,
      template,
      template_data
    );

    // Create Supabase client for audit logging
    const supabase = createServiceClient();

    if (result.success) {
      // Audit log successful send
      await createAuditLog(supabase, {
        table_name: 'email_sends',
        action: AuditAction.EMAIL_SENT,
        new_data: {
          to,
          subject,
          message_id: result.messageId,
          template,
        },
        metadata: {
          correlation_id: correlationId,
        },
      });

      log.complete(200, { message_id: result.messageId });
      return successResponse(
        { message_id: result.messageId },
        { correlation_id: correlationId }
      );
    } else {
      // Audit log failed send
      await createAuditLog(supabase, {
        table_name: 'email_sends',
        action: AuditAction.NOTIFICATION_FAILED,
        new_data: {
          to,
          subject,
          error: result.error,
        },
        metadata: {
          correlation_id: correlationId,
        },
      });

      log.error('Failed to send email', new Error(result.error || 'Unknown error'));
      return systemErrorResponse('Failed to send email', correlationId);
    }

  } catch (error) {
    log.error('Unexpected error', error as Error);
    return systemErrorResponse('An unexpected error occurred', correlationId);
  }
});
