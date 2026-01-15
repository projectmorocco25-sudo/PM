/**
 * Edge Function: vci-send-message-email-notifications
 * 
 * Module: vci (communication)
 * Purpose: Send email notifications for new messages
 * Created: 2025-01-12
 * 
 * This function reads message notifications from the database and sends emails.
 */

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

interface RequestData {
  notification_ids?: string[];
  check_date?: string;
}

Deno.serve(async (req: Request) => {
  try {
    // 1. Parse request
    const requestData: RequestData = await req.json() || {};

    // 2. Initialize Supabase client (service role)
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // 3. Get notifications for new messages
    let notifications;
    if (requestData.notification_ids && requestData.notification_ids.length > 0) {
      // Specific notification IDs
      const { data, error } = await supabase
        .from("notifications")
        .select("id, user_id, type, title, message, link, is_read, created_at")
        .in("id", requestData.notification_ids)
        .eq("type", "new_message")
        .eq("is_read", false);

      if (error) {
        throw new Error(`Failed to fetch notifications: ${error.message}`);
      }
      notifications = data || [];
    } else {
      // All unread new_message notifications
      const { data, error } = await supabase
        .from("notifications")
        .select("id, user_id, type, title, message, link, is_read, created_at")
        .eq("type", "new_message")
        .eq("is_read", false)
        .order("created_at", { ascending: true })
        .limit(100);  // Process in batches

      if (error) {
        throw new Error(`Failed to fetch notifications: ${error.message}`);
      }
      notifications = data || [];
    }

    if (notifications.length === 0) {
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

    // 4. Get user emails and preferences
    const userIds = [...new Set(notifications.map((n) => n.user_id))];
    const { data: users, error: usersError } = await supabase
      .from("users")
      .select("id, email, notification_preferences")
      .in("id", userIds);

    if (usersError) {
      throw new Error(`Failed to fetch users: ${usersError.message}`);
    }

    const userMap = new Map(users?.map((u) => [u.id, u]) || []);

    // 5. Send emails via shared-send-email function
    const emailServiceUrl = Deno.env.get("SUPABASE_URL") + "/functions/v1/shared-send-email";
    const emailServiceApiKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    let sentCount = 0;
    let failedCount = 0;

    for (const notification of notifications) {
      const user = userMap.get(notification.user_id);
      if (!user || !user.email) {
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
        // Call shared-send-email function
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
            template: "new_message",
            data: {
              notification_id: notification.id,
              link: notification.link,
            },
          }),
        });

        if (!emailResponse.ok) {
          throw new Error(`Email service returned ${emailResponse.status}`);
        }

        sentCount++;
      } catch (error) {
        console.error(`Failed to send email for notification ${notification.id}:`, error);
        failedCount++;
      }
    }

    // 6. Return success response
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
  } catch (error) {
    // 7. Handle errors
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
