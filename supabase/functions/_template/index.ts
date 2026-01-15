/**
 * Edge Function Template
 * 
 * Module: {module_name}
 * Purpose: {function_purpose}
 * Created: 2025-01-12
 * 
 * This is a template for creating new Edge Functions.
 * Copy this file to a new function directory and customize as needed.
 */

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

Deno.serve(async (req: Request) => {
  try {
    // 1. Parse request
    const { event, data } = await req.json();

    // 2. Initialize Supabase client (service role)
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // 3. Validate request
    if (!event || !data) {
      return new Response(
        JSON.stringify({
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Missing required fields: event and data"
          }
        }),
        { 
          status: 400, 
          headers: { "Content-Type": "application/json" } 
        }
      );
    }

    // 4. Process request
    // TODO: Implement business logic here
    // Example:
    // const result = await processData(data);
    // await supabase.from('table').insert(result);

    // 5. Return success response
    return new Response(
      JSON.stringify({
        success: true,
        data: {
          // Response data
        }
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Connection": "keep-alive"
        }
      }
    );
  } catch (error) {
    // 6. Handle errors
    console.error("Error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: {
          code: "SYSTEM_ERROR",
          message: "Internal server error",
          details: error instanceof Error ? error.message : String(error)
        }
      }),
      { 
        status: 500, 
        headers: { "Content-Type": "application/json" } 
      }
    );
  }
});
