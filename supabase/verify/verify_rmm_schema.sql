-- Verify RMM schema completeness (Task 1.1.1.7a)
-- Run in Supabase SQL editor or via MCP execute SQL.

-- 1) Required tables exist
SELECT t.table_name
FROM (VALUES
  ('companies'),
  ('products'),
  ('skus'),
  ('atc_codes'),
  ('critical_medicines')
) AS t(table_name)
LEFT JOIN information_schema.tables ist
  ON ist.table_schema = 'public' AND ist.table_name = t.table_name
WHERE ist.table_name IS NULL;

-- 2) Column-level checks (missing columns)
WITH required(table_name, column_name) AS (
  VALUES
  ('companies','id'),
  ('companies','name'),
  ('companies','registration_number'),
  ('companies','company_type'),
  ('companies','address'),
  ('companies','contact_email'),
  ('companies','contact_phone'),
  ('companies','is_active'),
  ('companies','suspended_at'),
  ('companies','suspended_by'),
  ('companies','suspended_reason'),
  ('companies','created_at'),
  ('companies','updated_at'),

  ('products','id'),
  ('products','company_id'),
  ('products','name'),
  ('products','description'),
  ('products','is_critical_medicine'),
  ('products','is_active'),
  ('products','deactivated_at'),
  ('products','deactivated_by'),
  ('products','deactivated_reason'),
  ('products','created_at'),
  ('products','updated_at'),

  ('skus','id'),
  ('skus','product_id'),
  ('skus','sku_code'),
  ('skus','name'),
  ('skus','dosage_strength'),
  ('skus','dosage_form'),
  ('skus','pack_size'),
  ('skus','unit_of_measure'),
  ('skus','atc_code_id'),
  ('skus','is_moh_authorized_unregistered'),
  ('skus','is_active'),
  ('skus','deactivated_at'),
  ('skus','deactivated_by'),
  ('skus','deactivated_reason'),
  ('skus','created_at'),
  ('skus','updated_at'),

  ('atc_codes','id'),
  ('atc_codes','code'),
  ('atc_codes','description'),
  ('atc_codes','is_active'),
  ('atc_codes','created_at'),
  ('atc_codes','updated_at'),

  ('critical_medicines','id'),
  ('critical_medicines','sku_id'),
  ('critical_medicines','designated_at'),
  ('critical_medicines','designated_by'),
  ('critical_medicines','is_active'),
  ('critical_medicines','created_at'),
  ('critical_medicines','updated_at')
)
SELECT r.table_name, r.column_name
FROM required r
LEFT JOIN information_schema.columns c
  ON c.table_schema='public' AND c.table_name=r.table_name AND c.column_name=r.column_name
WHERE c.column_name IS NULL
ORDER BY r.table_name, r.column_name;

