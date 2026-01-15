/**
 * Edge Function: shared-send-email
 * 
 * Module: shared
 * Purpose: Send email notifications via external email service
 * Created: 2025-01-12
 * 
 * This function reads notifications from the database and sends emails.
 */

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

interface EmailRequest {
  notification_ids?: string[];
  notification_type?: string;
  max_batch?: number;
  to?: string;
  subject?: string;
  body?: string;
  template?: string;
  data?: Record<string, unknown>;
}

Deno.serve(async (req: Request) => {
  try {
    // 1. Parse request
    const requestData: EmailRequest = await req.json();

    // 2. Initialize Supabase client (service role)
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // 3. Batch mode (read from notifications table, send emails, mark as sent)
    // This fulfills Task 1.1.1.4e when combined with delivery tracking columns.
    if (
      (requestData.notification_ids && requestData.notification_ids.length > 0) ||
      requestData.notification_type
    ) {
      const maxBatch = Math.min(Math.max(requestData.max_batch ?? 100, 1), 500);

      // Fetch notifications that have not been email-sent yet
      let query = supabase
        .from("notifications")
        .select("id, user_id, type, title, message, link, email_sent_at, email_attempts")
        .is("email_sent_at", null)
        .order("created_at", { ascending: true })
        .limit(maxBatch);

      if (requestData.notification_type) {
        query = query.eq("type", requestData.notification_type);
      }

      if (requestData.notification_ids && requestData.notification_ids.length > 0) {
        query = query.in("id", requestData.notification_ids);
      }

      const { data: notifications, error: fetchError } = await query;

      if (fetchError) {
        throw new Error(`Failed to fetch notifications: ${fetchError.message}`);
      }

      if (!notifications || notifications.length === 0) {
        return new Response(
          JSON.stringify({
            success: true,
            data: { sent_count: 0, failed_count: 0 },
          }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      // Get user emails
      const userIds = [...new Set(notifications.map((n) => n.user_id))];
      const { data: users, error: usersError } = await supabase
        .from("users")
        .select("id, email, notification_preferences")
        .in("id", userIds);

      if (usersError) {
        throw new Error(`Failed to fetch users: ${usersError.message}`);
      }

      const userMap = new Map(users?.map((u) => [u.id, u]) || []);

      // Send emails
      let sentCount = 0;
      let failedCount = 0;
      const emailServiceUrl = Deno.env.get("EMAIL_SERVICE_URL");
      const emailServiceApiKey = Deno.env.get("EMAIL_SERVICE_API_KEY");

      if (!emailServiceUrl || !emailServiceApiKey) {
        throw new Error("Email service configuration missing");
      }

      for (const notification of notifications) {
        const user = userMap.get(notification.user_id);
        if (!user || !user.email) {
          // Mark attempt + error (no email)
          await supabase
            .from("notifications")
            .update({
              email_attempts: (notification.email_attempts ?? 0) + 1,
              email_last_error: "Missing recipient email",
            })
            .eq("id", notification.id);
          failedCount++;
          continue;
        }

        // Check notification preferences
        const prefs = user.notification_preferences as Record<string, boolean> | null;
        if (prefs && prefs.email_enabled === false) {
          // User has disabled email notifications
          continue;
        }

        try {
          // Call external email service
          const emailResponse = await fetch(emailServiceUrl, {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${emailServiceApiKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              to: user.email,
              subject: notification.title,
              body: notification.message,
              template: notification.type,
              data: {
                notification_id: notification.id,
                link: notification.link,
              },
            }),
          });

          if (!emailResponse.ok) {
            throw new Error(`Email service returned ${emailResponse.status}`);
          }

          // Mark as sent
          await supabase
            .from("notifications")
            .update({
              email_sent_at: new Date().toISOString(),
              email_attempts: (notification.email_attempts ?? 0) + 1,
              email_last_error: null,
            })
            .eq("id", notification.id);

          sentCount++;
        } catch (error) {
          console.error(`Failed to send email for notification ${notification.id}:`, error);
          await supabase
            .from("notifications")
            .update({
              email_attempts: (notification.email_attempts ?? 0) + 1,
              email_last_error: error instanceof Error ? error.message : String(error),
            })
            .eq("id", notification.id);
          failedCount++;
        }
      }

      return new Response(
        JSON.stringify({
          success: true,
          data: {
            sent_count: sentCount,
            failed_count: failedCount,
          },
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    } else if (requestData.to && requestData.subject && requestData.body) {
      // Direct mode: Send single email
      const emailServiceUrl = Deno.env.get("EMAIL_SERVICE_URL");
      const emailServiceApiKey = Deno.env.get("EMAIL_SERVICE_API_KEY");

      if (!emailServiceUrl || !emailServiceApiKey) {
        throw new Error("Email service configuration missing");
      }

      const emailResponse = await fetch(emailServiceUrl, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${emailServiceApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: requestData.to,
          subject: requestData.subject,
          body: requestData.body,
          template: requestData.template,
          data: requestData.data,
        }),
      });

      if (!emailResponse.ok) {
        throw new Error(`Email service returned ${emailResponse.status}`);
      }

      const emailData = await emailResponse.json();

      return new Response(
        JSON.stringify({
          success: true,
          data: {
            message_id: emailData.message_id || "sent",
          },
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    } else {
      return new Response(
        JSON.stringify({
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message:
              "Missing required fields: either (notification_ids or notification_type) or (to, subject, body)",
          },
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  } catch (error) {
    // 6. Handle errors
    console.error("Error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: {
          code: "SYSTEM_ERROR",
          message: "Internal server error",
          details: error instanceof Error ? error.message : String(error),
        },
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
});
