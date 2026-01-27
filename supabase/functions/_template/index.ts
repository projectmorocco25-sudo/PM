// Edge Function template – copy to supabase/functions/{name}/index.ts
// See: docs/02-architecture/api/edge-functions.md
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

Deno.serve(async (req: Request) => {
  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    if (req.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders() });
    }

    const body = (await req.json().catch(() => ({}))) as { event?: string; data?: unknown };
    const { event, data } = body;

    if (!event || !data) {
      return new Response(
        JSON.stringify({
          success: false,
          error: { code: "VALIDATION_ERROR", message: "Missing event or data" },
        }),
        { status: 400, headers: { ...jsonHeaders(), ...corsHeaders() } }
      );
    }

    // Replace with your logic
    return new Response(
      JSON.stringify({ success: true, data: {} }),
      { status: 200, headers: { ...jsonHeaders(), ...corsHeaders() } }
    );
  } catch (e) {
    console.error("Error:", e);
    return new Response(
      JSON.stringify({
        success: false,
        error: { code: "INTERNAL_ERROR", message: String(e) },
      }),
      { status: 500, headers: { ...jsonHeaders(), ...corsHeaders() } }
    );
  }
});

function jsonHeaders() {
  return { "Content-Type": "application/json" };
}

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Authorization, Content-Type",
  };
}
