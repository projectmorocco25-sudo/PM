-- Migration: audit_log_hash_chain_verification
-- Description: Store audit entry_data, rebuild hash chain deterministically, and add verification RPC
-- Date: 2025-01-12
-- Author: Nadia
-- Phase: 1.1.1
-- Task: 1.1.1.5c
-- Depends on: 20250112203000_audit_logging_trigger_infrastructure

BEGIN;

-- Add entry_data payload used for hashing (required for deterministic verification)
ALTER TABLE audit_logs
  ADD COLUMN IF NOT EXISTS entry_data jsonb;

-- Temporarily allow maintenance updates while we backfill/rebuild.
DROP TRIGGER IF EXISTS trg_audit_logs_block_update ON audit_logs;
DROP TRIGGER IF EXISTS trg_audit_logs_block_delete ON audit_logs;

-- Backfill entry_data for any existing rows (best-effort; used only for verification)
UPDATE audit_logs
SET entry_data = jsonb_build_object(
  'user_id', user_id,
  'operation_type', operation_type,
  'table_name', table_name,
  'record_id', record_id,
  'old_values', old_values,
  'new_values', new_values,
  'reason', reason,
  'ip_address', ip_address,
  'user_agent', user_agent,
  'created_at', created_at
)
WHERE entry_data IS NULL;

-- Rebuild previous_hash/current_hash for all audit logs deterministically.
DO $$
DECLARE
  v_prev text := NULL;
  v_row record;
  v_hash text;
BEGIN
  -- Serialize rebuild
  PERFORM pg_advisory_xact_lock(9110115);

  FOR v_row IN
    SELECT id, entry_data
    FROM audit_logs
    ORDER BY created_at ASC, id ASC
  LOOP
    v_hash := calculate_audit_hash(v_prev, v_row.entry_data);
    UPDATE audit_logs
    SET previous_hash = v_prev,
        current_hash = v_hash
    WHERE id = v_row.id;
    v_prev := v_hash;
  END LOOP;
END $$;

ALTER TABLE audit_logs
  ALTER COLUMN entry_data SET NOT NULL;

-- Reinstate immutability triggers
CREATE TRIGGER trg_audit_logs_block_update
BEFORE UPDATE ON audit_logs
FOR EACH ROW
EXECUTE FUNCTION audit_logs_block_mutation();

CREATE TRIGGER trg_audit_logs_block_delete
BEFORE DELETE ON audit_logs
FOR EACH ROW
EXECUTE FUNCTION audit_logs_block_mutation();

-- Update audit trigger function to store entry_data and hash deterministically
CREATE OR REPLACE FUNCTION audit_log_trigger()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_previous_hash text;
  v_entry_data jsonb;
  v_current_hash text;
  v_user_id uuid;
  v_op text;
  v_record_id uuid;
  v_created_at timestamptz;
BEGIN
  -- Serialize audit hash chain
  PERFORM pg_advisory_xact_lock(9110115);

  v_user_id := auth.uid();
  v_op := TG_OP; -- INSERT | UPDATE | DELETE
  v_created_at := clock_timestamp();

  IF TG_OP = 'DELETE' THEN
    v_record_id := OLD.id;
  ELSE
    v_record_id := NEW.id;
  END IF;

  SELECT current_hash INTO v_previous_hash
  FROM audit_logs
  ORDER BY created_at DESC, id DESC
  LIMIT 1;

  v_entry_data := jsonb_build_object(
    'user_id', v_user_id,
    'operation_type', v_op,
    'table_name', TG_TABLE_NAME,
    'record_id', v_record_id,
    'old_values', CASE WHEN TG_OP IN ('UPDATE','DELETE') THEN to_jsonb(OLD) ELSE NULL END,
    'new_values', CASE WHEN TG_OP IN ('INSERT','UPDATE') THEN to_jsonb(NEW) ELSE NULL END,
    'created_at', v_created_at
  );

  v_current_hash := calculate_audit_hash(v_previous_hash, v_entry_data);

  INSERT INTO audit_logs (
    previous_hash,
    current_hash,
    entry_data,
    user_id,
    operation_type,
    table_name,
    record_id,
    old_values,
    new_values,
    reason,
    created_at
  ) VALUES (
    v_previous_hash,
    v_current_hash,
    v_entry_data,
    v_user_id,
    v_op,
    TG_TABLE_NAME,
    v_record_id,
    CASE WHEN TG_OP IN ('UPDATE','DELETE') THEN v_entry_data->'old_values' ELSE NULL END,
    CASE WHEN TG_OP IN ('INSERT','UPDATE') THEN v_entry_data->'new_values' ELSE NULL END,
    NULL,
    v_created_at
  );

  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  END IF;
  RETURN NEW;
END;
$$;

-- Update shared_create_audit_log to use entry_data + calculate_audit_hash
CREATE OR REPLACE FUNCTION shared_create_audit_log(
  p_user_id uuid,
  p_operation_type text,
  p_table_name text,
  p_record_id uuid,
  p_old_values jsonb DEFAULT NULL,
  p_new_values jsonb DEFAULT NULL,
  p_reason text DEFAULT NULL,
  p_ip_address inet DEFAULT NULL,
  p_user_agent text DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_audit_log_id uuid;
  v_previous_hash text;
  v_current_hash text;
  v_entry_data jsonb;
  v_created_at timestamptz;
BEGIN
  PERFORM pg_advisory_xact_lock(9110115);
  v_created_at := clock_timestamp();

  SELECT current_hash INTO v_previous_hash
  FROM audit_logs
  ORDER BY created_at DESC, id DESC
  LIMIT 1;

  v_entry_data := jsonb_build_object(
    'user_id', p_user_id,
    'operation_type', p_operation_type,
    'table_name', p_table_name,
    'record_id', p_record_id,
    'old_values', p_old_values,
    'new_values', p_new_values,
    'reason', p_reason,
    'ip_address', p_ip_address,
    'user_agent', p_user_agent,
    'created_at', v_created_at
  );

  v_current_hash := calculate_audit_hash(v_previous_hash, v_entry_data);

  INSERT INTO audit_logs (
    previous_hash,
    current_hash,
    entry_data,
    user_id,
    operation_type,
    table_name,
    record_id,
    old_values,
    new_values,
    reason,
    ip_address,
    user_agent,
    created_at
  ) VALUES (
    v_previous_hash,
    v_current_hash,
    v_entry_data,
    p_user_id,
    p_operation_type,
    p_table_name,
    p_record_id,
    p_old_values,
    p_new_values,
    p_reason,
    p_ip_address,
    p_user_agent,
    v_created_at
  ) RETURNING id INTO v_audit_log_id;

  RETURN v_audit_log_id;
END;
$$;

COMMENT ON FUNCTION shared_create_audit_log IS 'Create audit log entry with deterministic hash chaining (entry_data payload)';

-- Verification function: returns first break (if any)
CREATE OR REPLACE FUNCTION shared_verify_audit_log_hash_chain(
  p_limit integer DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_prev text := NULL;
  v_row record;
  v_expected text;
  v_checked bigint := 0;
BEGIN
  FOR v_row IN
    SELECT id, previous_hash, current_hash, entry_data
    FROM audit_logs
    ORDER BY created_at ASC, id ASC
    LIMIT COALESCE(p_limit, 2147483647)
  LOOP
    v_checked := v_checked + 1;

    IF v_row.previous_hash IS DISTINCT FROM v_prev THEN
      RETURN jsonb_build_object(
        'is_valid', false,
        'checked', v_checked,
        'broken_at_id', v_row.id,
        'reason', 'previous_hash_mismatch',
        'expected_previous_hash', v_prev,
        'found_previous_hash', v_row.previous_hash
      );
    END IF;

    v_expected := calculate_audit_hash(v_prev, v_row.entry_data);
    IF v_row.current_hash IS DISTINCT FROM v_expected THEN
      RETURN jsonb_build_object(
        'is_valid', false,
        'checked', v_checked,
        'broken_at_id', v_row.id,
        'reason', 'current_hash_mismatch',
        'expected_current_hash', v_expected,
        'found_current_hash', v_row.current_hash
      );
    END IF;

    v_prev := v_row.current_hash;
  END LOOP;

  RETURN jsonb_build_object(
    'is_valid', true,
    'checked', v_checked
  );
END;
$$;

COMMENT ON FUNCTION shared_verify_audit_log_hash_chain IS 'Verify audit_logs hash chain integrity and report first break (if any)';

COMMIT;

