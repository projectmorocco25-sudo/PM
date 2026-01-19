// Edge Function: message-email-notifications
// Purpose: Read from notifications table for new messages, send emails, mark as sent
// Task: 1.1.1.4l
// Author: Sami (Implementation Compliance Specialist)

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { corsHeaders, handleCors } from "../_shared/cors.ts";
import { createServiceRoleClient } from "../_shared/supabase-client.ts";
import { createSuccessResponse, createErrorResponse, handleError } from "../_shared/error-handling.ts";

Deno.serve(async (req: Request) => {
  // Handle CORS
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    // Generate correlation ID for tracking
    const correlationId = crypto.randomUUID();
    
    // Initialize Supabase client with service role
    const supabase = createServiceRoleClient();

    // Get email service configuration from environment variables
    const emailServiceUrl = Deno.env.get("EMAIL_SERVICE_URL");
    const emailServiceApiKey = Deno.env.get("EMAIL_SERVICE_API_KEY");

    if (!emailServiceUrl || !emailServiceApiKey) {
      console.error(`[${correlationId}] Missing email service configuration`);
      return createErrorResponse(
        "SYSTEM_ERROR",
        "Email service configuration missing",
        { correlation_id: correlationId },
        500
      );
    }

    // Query notifications for new messages (type = 'message_received', is_read = false)
    const { data: notifications, error: queryError } = await supabase
      .from("notifications")
      .select("id, user_id, type, title, message, link")
      .eq("type", "message_received")
      .eq("is_read", false);

    if (queryError) {
      console.error(`[${correlationId}] Database query error:`, queryError);
      // Log to audit system
      try {
        await supabase.rpc("shared_create_audit_log", {
          p_user_id: null,
          p_operation_type: "SYSTEM_ERROR",
          p_table_name: "notifications",
          p_reason: `Message email notification query failed: ${queryError.message}`,
        });
      } catch (auditError) {
        console.error(`[${correlationId}] Audit log creation failed:`, auditError);
      }

      return createErrorResponse(
        "SYSTEM_ERROR",
        "Failed to query notifications",
        { correlation_id: correlationId },
        500
      );
    }

    if (!notifications || notifications.length === 0) {
      return createSuccessResponse({
        sent_count: 0,
        failed_count: 0,
        skipped_count: 0,
        correlation_id: correlationId,
      });
    }

    // Process notifications
    const results = {
      sent_count: 0,
      failed_count: 0,
      skipped_count: 0,
      errors: [] as Array<{ notification_id: string; error: string }>,
    };

    // Get user emails for notifications
    const userIds = [...new Set(notifications.map((n) => n.user_id))];
    const { data: users, error: usersError } = await supabase
      .from("users")
      .select("id, email")
      .in("id", userIds);

    if (usersError) {
      console.error(`[${correlationId}] Failed to fetch user emails:`, usersError);
      return createErrorResponse(
        "SYSTEM_ERROR",
        "Failed to fetch user emails",
        { correlation_id: correlationId },
        500
      );
    }

    const userEmailMap = new Map(
      (users || []).map((u) => [u.id, u.email])
    );

    // Process each notification
    for (const notification of notifications) {
      try {
        const userEmail = userEmailMap.get(notification.user_id);

        if (!userEmail) {
          console.warn(`[${correlationId}] User email not found for notification ${notification.id}`);
          results.skipped_count++;
          continue;
        }

        // Send email via external email service
        const emailResponse = await fetch(emailServiceUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${emailServiceApiKey}`,
          },
          body: JSON.stringify({
            to: userEmail,
            subject: notification.title,
            body: notification.message,
            template: "message_notification",
            data: {
              title: notification.title,
              message: notification.message,
              link: notification.link,
            },
          }),
        });

        // Handle email service response
        if (!emailResponse.ok) {
          const errorText = await emailResponse.text().catch(() => "Unknown error");
          console.error(
            `[${correlationId}] Email service error for notification ${notification.id}:`,
            errorText
          );

          // Retry logic for transient failures (5xx errors)
          if (emailResponse.status >= 500 && emailResponse.status < 600) {
            // Transient error - log but don't mark as sent (will retry on next run)
            console.warn(`[${correlationId}] Transient error for notification ${notification.id}, will retry`);
            results.failed_count++;
            results.errors.push({
              notification_id: notification.id,
              error: `Transient error: ${emailResponse.status}`,
            });
            continue;
          }

          // Non-transient error - mark as failed
          results.failed_count++;
          results.errors.push({
            notification_id: notification.id,
            error: `Email service error: ${emailResponse.status}`,
          });
          continue;
        }

        // Email sent successfully - mark notification as read (sent)
        const { error: updateError } = await supabase
          .from("notifications")
          .update({
            is_read: true,
            read_at: new Date().toISOString(),
          })
          .eq("id", notification.id);

        if (updateError) {
          console.error(
            `[${correlationId}] Failed to mark notification ${notification.id} as sent:`,
            updateError
          );
          // Email was sent but couldn't mark as read - log error
          results.errors.push({
            notification_id: notification.id,
            error: `Failed to mark as sent: ${updateError.message}`,
          });
        } else {
          results.sent_count++;
        }
      } catch (error) {
        // Handle network errors or other exceptions
        console.error(
          `[${correlationId}] Error processing notification ${notification.id}:`,
          error
        );

        // Log to audit system
        try {
          await supabase.rpc("shared_create_audit_log", {
            p_user_id: null,
            p_operation_type: "SYSTEM_ERROR",
            p_table_name: "notifications",
            p_record_id: notification.id,
            p_reason: `Message email notification processing error: ${error instanceof Error ? error.message : "Unknown error"}`,
          });
        } catch (auditError) {
          console.error(`[${correlationId}] Audit log creation failed:`, auditError);
        }

        results.failed_count++;
        results.errors.push({
          notification_id: notification.id,
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }

    // Return results
    return createSuccessResponse({
      ...results,
      correlation_id: correlationId,
    });
  } catch (error) {
    return handleError(error);
  }
});
