-- Verify VCI schema completeness (Task 1.1.1.9a)
-- Run in Supabase SQL editor or via MCP execute SQL.

-- 1) Required tables exist
SELECT t.table_name
FROM (VALUES
  ('aams_submissions'),
  ('msq_submissions'),
  ('wsl_submissions'),
  ('thresholds'),
  ('breaches'),
  ('breach_analyses')
) AS t(table_name)
LEFT JOIN information_schema.tables ist
  ON ist.table_schema = 'public' AND ist.table_name = t.table_name
WHERE ist.table_name IS NULL;

-- 2) Missing columns (matches schema-design.md VCI section)
WITH required(table_name, column_name) AS (
  VALUES
  ('aams_submissions','id'),
  ('aams_submissions','company_id'),
  ('aams_submissions','year'),
  ('aams_submissions','aams_value'),
  ('aams_submissions','submission_data'),
  ('aams_submissions','status'),
  ('aams_submissions','is_late'),
  ('aams_submissions','correction_of'),
  ('aams_submissions','submitted_by'),
  ('aams_submissions','submitted_at'),
  ('aams_submissions','verified_by'),
  ('aams_submissions','verified_at'),
  ('aams_submissions','approved_by'),
  ('aams_submissions','approved_at'),
  ('aams_submissions','created_at'),
  ('aams_submissions','updated_at'),

  ('msq_submissions','id'),
  ('msq_submissions','company_id'),
  ('msq_submissions','year'),
  ('msq_submissions','month'),
  ('msq_submissions','submission_data'),
  ('msq_submissions','status'),
  ('msq_submissions','validation_flags'),
  ('msq_submissions','correction_of'),
  ('msq_submissions','submitted_by'),
  ('msq_submissions','submitted_at'),
  ('msq_submissions','created_at'),
  ('msq_submissions','updated_at'),

  ('wsl_submissions','id'),
  ('wsl_submissions','company_id'),
  ('wsl_submissions','week_ending_date'),
  ('wsl_submissions','submission_data'),
  ('wsl_submissions','status'),
  ('wsl_submissions','is_late'),
  ('wsl_submissions','is_non_compliant'),
  ('wsl_submissions','submitted_by'),
  ('wsl_submissions','submitted_at'),
  ('wsl_submissions','created_at'),
  ('wsl_submissions','updated_at'),

  ('thresholds','id'),
  ('thresholds','sku_id'),
  ('thresholds','threshold_type'),
  ('thresholds','threshold_value'),
  ('thresholds','multiplier_b'),
  ('thresholds','aams_value'),
  ('thresholds','effective_from'),
  ('thresholds','effective_to'),
  ('thresholds','is_current'),
  ('thresholds','duration_type'),
  ('thresholds','revert_date'),
  ('thresholds','revert_to_multiplier'),
  ('thresholds','revert_to_threshold_value'),
  ('thresholds','revert_notification_sent_7d'),
  ('thresholds','revert_notification_sent_1d'),
  ('thresholds','revert_notification_sent_on_revert'),
  ('thresholds','requires_manual_review'),
  ('thresholds','created_by'),
  ('thresholds','created_at'),
  ('thresholds','updated_at'),

  ('breaches','id'),
  ('breaches','sku_id'),
  ('breaches','company_id'),
  ('breaches','wsl_submission_id'),
  ('breaches','threshold_id'),
  ('breaches','stock_level'),
  ('breaches','threshold_value'),
  ('breaches','breach_date'),
  ('breaches','breach_reason'),
  ('breaches','replenishment_date'),
  ('breaches','priority'),
  ('breaches','status'),
  ('breaches','created_at'),
  ('breaches','updated_at'),

  ('breach_analyses','id'),
  ('breach_analyses','breach_id'),
  ('breach_analyses','analyzed_by'),
  ('breach_analyses','suggested_action'),
  ('breach_analyses','suggested_action_details'),
  ('breach_analyses','analysis_notes'),
  ('breach_analyses','analyzed_at'),
  ('breach_analyses','created_at')
)
SELECT r.table_name, r.column_name
FROM required r
LEFT JOIN information_schema.columns c
  ON c.table_schema='public' AND c.table_name=r.table_name AND c.column_name=r.column_name
WHERE c.column_name IS NULL
ORDER BY r.table_name, r.column_name;

