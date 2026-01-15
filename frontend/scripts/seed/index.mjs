import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url) {
  console.error("Missing SUPABASE_URL (or NEXT_PUBLIC_SUPABASE_URL)");
  process.exit(1);
}
if (!serviceKey) {
  console.error("Missing SUPABASE_SERVICE_ROLE_KEY (required for seeding)");
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { persistSession: false },
});

async function upsertModule(module_name, is_active) {
  const { error } = await supabase
    .from("system_config")
    .upsert({ module_name, is_active, activated_at: is_active ? new Date().toISOString() : null }, { onConflict: "module_name" });
  if (error) throw error;
}

async function seedDemoCompany() {
  // Idempotent company seed (registration_number unique).
  const company = {
    name: "Demo Wholesaler",
    registration_number: "DEMO-WHS-0001",
    company_type: "wholesaler",
    address: "Rabat, Morocco",
    contact_email: "demo-wholesaler@example.com",
    contact_phone: "+212600000000",
    is_active: true,
  };

  const { data: companyRow, error: cErr } = await supabase
    .from("companies")
    .upsert(company, { onConflict: "registration_number" })
    .select("id")
    .single();
  if (cErr) throw cErr;

  const { data: productRow, error: pErr } = await supabase
    .from("products")
    .upsert(
      {
        company_id: companyRow.id,
        name: "Demo Product",
        description: "Seeded demo product for development and QA.",
        is_active: true,
      },
      { onConflict: "id" },
    )
    .select("id")
    .single();
  if (pErr) throw pErr;

  // sku_code is not unique in schema, so we upsert by id is not idempotent.
  // Instead, we check by (product_id, sku_code) manually.
  const { data: existingSku, error: s0Err } = await supabase
    .from("skus")
    .select("id")
    .eq("product_id", productRow.id)
    .eq("sku_code", "DEMO-SKU-001")
    .maybeSingle();
  if (s0Err) throw s0Err;

  if (!existingSku) {
    const { error: sErr } = await supabase.from("skus").insert({
      product_id: productRow.id,
      sku_code: "DEMO-SKU-001",
      name: "Demo SKU 001",
      dosage_strength: "500mg",
      dosage_form: "tablet",
      pack_size: "20",
      unit_of_measure: "units",
      is_active: true,
    });
    if (sErr) throw sErr;
  }
}

async function main() {
  console.log("Seeding PM dev/staging data…");

  await upsertModule("rmm", true);
  await upsertModule("vci", true);
  await upsertModule("ecs", false);
  await upsertModule("cmc", false);

  await seedDemoCompany();

  console.log("Seed complete.");
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});

