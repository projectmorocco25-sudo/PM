-- Migration: audit_logging_trigger_infrastructure
-- Description: Create audit hash + trigger functions (hash chaining, immutability, verification helpers)
-- Date: 2025-01-12
-- Author: Salim / Nadia
-- Phase: 1.1.1
-- Task: 1.1.1.5a
-- Depends on: 20250112120000_create_core_tables

BEGIN;

-- Required for digest()/sha256 hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Our initial core migration added a restrictive CHECK on audit_logs.operation_type.
-- The plan/spec requires many operation types (conversation_created, message_sent, etc.).
ALTER TABLE audit_logs DROP CONSTRAINT IF EXISTS audit_logs_operation_type_check;

-- Prevent UPDATE/DELETE on audit_logs (immutability)
CREATE OR REPLACE FUNCTION audit_logs_block_mutation()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  RAISE EXCEPTION 'audit_logs are immutable (no UPDATE/DELETE allowed)';
END;
$$;

DROP TRIGGER IF EXISTS trg_audit_logs_block_update ON audit_logs;
CREATE TRIGGER trg_audit_logs_block_update
BEFORE UPDATE ON audit_logs
FOR EACH ROW
EXECUTE FUNCTION audit_logs_block_mutation();

DROP TRIGGER IF EXISTS trg_audit_logs_block_delete ON audit_logs;
CREATE TRIGGER trg_audit_logs_block_delete
BEFORE DELETE ON audit_logs
FOR EACH ROW
EXECUTE FUNCTION audit_logs_block_mutation();

-- Hash calculation helper (per audit-logging-spec.md)
CREATE OR REPLACE FUNCTION calculate_audit_hash(
  p_previous_hash text,
  p_entry_data jsonb
)
RETURNS text
LANGUAGE plpgsql
IMMUTABLE
AS $$
BEGIN
  RETURN encode(
    digest(
      (COALESCE(p_previous_hash, '') || p_entry_data::text)::bytea,
      'sha256'
    ),
    'hex'
  );
END;
$$;

-- Core trigger function: insert audit log row with hash chaining.
-- Uses an advisory lock to keep the chain linear under concurrency.
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
BEGIN
  -- Serialize audit hash chain
  PERFORM pg_advisory_xact_lock(9110115);

  v_user_id := auth.uid();
  v_op := TG_OP; -- INSERT | UPDATE | DELETE

  IF TG_OP = 'DELETE' THEN
    v_record_id := OLD.id;
  ELSE
    v_record_id := NEW.id;
  END IF;

  SELECT current_hash INTO v_previous_hash
  FROM audit_logs
  ORDER BY created_at DESC
  LIMIT 1;

  v_entry_data := jsonb_build_object(
    'user_id', v_user_id,
    'operation_type', v_op,
    'table_name', TG_TABLE_NAME,
    'record_id', v_record_id,
    'old_values', CASE WHEN TG_OP IN ('UPDATE','DELETE') THEN to_jsonb(OLD) ELSE NULL END,
    'new_values', CASE WHEN TG_OP IN ('INSERT','UPDATE') THEN to_jsonb(NEW) ELSE NULL END,
    'at', now()
  );

  v_current_hash := calculate_audit_hash(v_previous_hash, v_entry_data);

  INSERT INTO audit_logs (
    previous_hash,
    current_hash,
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
    v_user_id,
    v_op,
    TG_TABLE_NAME,
    v_record_id,
    CASE WHEN TG_OP IN ('UPDATE','DELETE') THEN v_entry_data->'old_values' ELSE NULL END,
    CASE WHEN TG_OP IN ('INSERT','UPDATE') THEN v_entry_data->'new_values' ELSE NULL END,
    NULL,
    now()
  );

  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  END IF;
  RETURN NEW;
END;
$$;

COMMIT;

