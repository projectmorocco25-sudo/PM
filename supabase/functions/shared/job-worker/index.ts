import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

type JobRow = {
  id: string;
  job_type: string;
  payload: Record<string, unknown>;
};

Deno.serve(async () => {
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  const workerId = crypto.randomUUID();

  // Claim due jobs (up to 10).
  const { data: jobs, error } = await supabase.rpc("job_claim", {
    p_worker_id: workerId,
    p_limit: 10,
    p_job_types: null,
  });

  if (error) {
    console.error("job_claim failed", error);
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }

  const claimed = (jobs ?? []) as unknown as JobRow[];
  let succeeded = 0;
  let failed = 0;

  for (const job of claimed) {
    try {
      // Placeholder processing by job_type. Expand in later phases.
      // Examples: email_notification, report_generation, data_export, scheduled_calculation
      console.log("Processing job", job.id, job.job_type);

      // No-op for now.
      await supabase.rpc("job_complete", { p_job_id: job.id });
      succeeded += 1;
    } catch (e) {
      failed += 1;
      const msg = e instanceof Error ? e.message : String(e);
      await supabase.rpc("job_fail", { p_job_id: job.id, p_error: msg });
    }
  }

  return new Response(
    JSON.stringify({ success: true, data: { worker_id: workerId, claimed: claimed.length, succeeded, failed } }),
    { headers: { "Content-Type": "application/json" } },
  );
});

