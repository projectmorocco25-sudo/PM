-- Migration: Audit logging trigger function
-- Description: Create hash-chained audit trigger for all audited tables (except audit_logs).
-- Task: 1.1.1.6
-- Date: 2026-01-27
-- Author: Sami (Implementation Compliance Specialist)
-- Dependencies: 1.1.1.4, 1.1.1.5, 1.1.1.8, 1.1.1.8a (all RLS complete). audit_logs from core_tables.
-- Reference: audit-logging-spec.md, feature-index.md#core-foundation-features

BEGIN;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Hash calculation for chain (SHA-256). IMMUTABLE.
CREATE OR REPLACE FUNCTION public.calculate_audit_hash(
  previous_hash text,
  entry_data jsonb
)
RETURNS text
LANGUAGE sql
IMMUTABLE
PARALLEL SAFE
AS $$
  SELECT encode(
    extensions.digest(
      COALESCE(previous_hash, '') || entry_data::text,
      'sha256'
    ),
    'hex'
  );
$$;

COMMENT ON FUNCTION public.calculate_audit_hash(text, jsonb) IS 'SHA-256 hash for audit chain. entry_data = canonical jsonb for new log entry.';

-- Insert one audit log row (hash-chained). SECURITY DEFINER to bypass RLS. Uses advisory lock to serialize chain.
CREATE OR REPLACE FUNCTION public.insert_audit_log(
  p_table_name text,
  p_operation_type text,
  p_record_id uuid,
  p_old_values jsonb,
  p_new_values jsonb,
  p_reason text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_previous_hash text;
  v_entry_data    jsonb;
  v_current_hash  text;
  v_user_id       uuid;
BEGIN
  v_user_id := auth.uid();

  -- Serialize audit chain updates (prevent concurrent inserts from breaking chain)
  PERFORM pg_advisory_xact_lock(hashtext('audit_log_chain'));

  SELECT current_hash INTO v_previous_hash
  FROM public.audit_logs
  ORDER BY created_at DESC
  LIMIT 1;

  v_entry_data := jsonb_build_object(
    'table_name', p_table_name,
    'operation_type', p_operation_type,
    'record_id', p_record_id,
    'old_values', p_old_values,
    'new_values', p_new_values,
    'user_id', v_user_id
  );
  v_current_hash := public.calculate_audit_hash(v_previous_hash, v_entry_data);

  INSERT INTO public.audit_logs (
    previous_hash,
    current_hash,
    user_id,
    operation_type,
    table_name,
    record_id,
    old_values,
    new_values,
    reason
  ) VALUES (
    v_previous_hash,
    v_current_hash,
    v_user_id,
    p_operation_type,
    p_table_name,
    p_record_id,
    p_old_values,
    p_new_values,
    p_reason
  );
END;
$$;

COMMENT ON FUNCTION public.insert_audit_log(text, text, uuid, jsonb, jsonb, text) IS 'Appends hash-chained audit log entry. Called by audit trigger. SECURITY DEFINER.';

-- Generic trigger function: map TG_OP -> operation_type, extract OLD/NEW, call insert_audit_log.
CREATE OR REPLACE FUNCTION public.audit_trigger_function()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_op    text;
  v_id    uuid;
  v_old   jsonb;
  v_new   jsonb;
BEGIN
  v_op := lower(TG_OP);
  IF v_op = 'delete' THEN
    v_id := (OLD).id;
    v_old := to_jsonb(OLD);
    v_new := NULL;
  ELSIF v_op = 'insert' THEN
    v_id := (NEW).id;
    v_old := NULL;
    v_new := to_jsonb(NEW);
  ELSE
    v_id := (NEW).id;
    v_old := to_jsonb(OLD);
    v_new := to_jsonb(NEW);
  END IF;

  PERFORM public.insert_audit_log(
    TG_TABLE_NAME,
    v_op,
    v_id,
    v_old,
    v_new,
    NULL
  );

  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$;

COMMENT ON FUNCTION public.audit_trigger_function() IS 'Trigger function for hash-chained audit logging. Attach AFTER INSERT OR UPDATE OR DELETE on audited tables.';

-- Attach trigger to all audited tables (except audit_logs). Tables must have id uuid PK.
DO $$
DECLARE
  t text;
  tables text[] := ARRAY[
    'users', 'system_config', 'notifications', 'approvals',
    'conversations', 'messages', 'message_attachments', 'message_read_receipts',
    'atc_codes', 'companies', 'products', 'skus', 'critical_medicines', 'registry_submissions',
    'enforcement_actions', 'enforcement_action_appeals'
  ];
BEGIN
  FOREACH t IN ARRAY tables
  LOOP
    EXECUTE format(
      'DROP TRIGGER IF EXISTS audit_trigger ON public.%I;
       CREATE TRIGGER audit_trigger
         AFTER INSERT OR UPDATE OR DELETE ON public.%I
         FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_function();',
      t, t
    );
  END LOOP;
END $$;

COMMIT;
