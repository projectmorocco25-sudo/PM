-- Migration: enforcement_justification_and_rbac_helpers
-- Description: Enforce Tier1 justification requirements + add RBAC helper functions for RPCs
-- Date: 2026-01-15
-- Author: Fatima, Salim, Rafi
-- Phase: 1.1.2
-- Tasks: 1.1.2.15a, 1.1.2.15b

BEGIN;

-- ----------------------------
-- Tier 1 enforcement justification hard rules
-- ----------------------------

CREATE OR REPLACE FUNCTION enforcement_validate_justification()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  v_len int;
BEGIN
  IF TG_OP IN ('INSERT','UPDATE') THEN
    IF NEW.action_type IN ('fine','suspension') THEN
      v_len := length(trim(COALESCE(NEW.justification, '')));
      IF v_len < 50 THEN
        RAISE EXCEPTION 'Justification must be at least 50 characters for fines/suspensions';
      END IF;
      IF trim(COALESCE(NEW.legal_basis, '')) = '' THEN
        RAISE EXCEPTION 'Legal basis is required';
      END IF;
      IF trim(COALESCE(NEW.regulatory_basis, '')) = '' THEN
        RAISE EXCEPTION 'Regulatory basis is required for fines/suspensions';
      END IF;
      IF NEW.evidence_references IS NULL OR jsonb_typeof(NEW.evidence_references) <> 'array' OR jsonb_array_length(NEW.evidence_references) = 0 THEN
        RAISE EXCEPTION 'Evidence references are required for fines/suspensions';
      END IF;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_enforcement_validate_justification ON enforcement_actions;
CREATE TRIGGER trg_enforcement_validate_justification
BEFORE INSERT OR UPDATE ON enforcement_actions
FOR EACH ROW
EXECUTE FUNCTION enforcement_validate_justification();

-- ----------------------------
-- RBAC helpers for RPCs
-- ----------------------------

CREATE OR REPLACE FUNCTION shared_permission_value(
  p_domain text,
  p_action text,
  p_user_id uuid DEFAULT auth.uid()
)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
DECLARE
  v jsonb;
  v_perm text;
BEGIN
  IF p_user_id IS NULL THEN
    RETURN NULL;
  END IF;

  v := shared_get_user_permissions(p_user_id);
  v_perm := (v #>> ARRAY['permissions', p_domain, p_action]);
  RETURN v_perm;
EXCEPTION
  WHEN others THEN
    RETURN NULL;
END;
$$;

CREATE OR REPLACE FUNCTION shared_has_permission(
  p_domain text,
  p_action text,
  p_allowed text[],
  p_user_id uuid DEFAULT auth.uid()
)
RETURNS boolean
LANGUAGE sql
STABLE
AS $$
  SELECT shared_permission_value(p_domain, p_action, p_user_id) = ANY(p_allowed);
$$;

COMMIT;

