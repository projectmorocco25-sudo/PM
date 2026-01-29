-- Migration: Enforcement resolve appeal (Task 1.1.2.36)
-- Description: enforcement_review_appeal, enforcement_uphold_appeal, enforcement_overturn_appeal - Tier 1 resolves appeals.
-- Tables: enforcement_action_appeals, enforcement_actions, companies. Audit via existing audit_trigger.
-- SLA: Tier 1 review target within 14 business days (documented; not enforced in DB).
-- Depends on: 1.1.2.35 (appeal action), 1.1.1.8 (RLS enforcement).
-- Date: 2026-01-29

BEGIN;

-- enforcement_review_appeal(p_appeal_id uuid, p_review_notes text DEFAULT NULL)
-- Tier 1 only. Appeal must be in 'submitted' or 'tier2_reviewed'. Sets reviewed_by_tier1, reviewed_at_tier1, status = 'tier1_reviewed'.
CREATE OR REPLACE FUNCTION public.enforcement_review_appeal(
  p_appeal_id uuid,
  p_review_notes text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid;
  v_role text;
  r record;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RETURN jsonb_build_object('error', 'unauthorized', 'message', 'not authenticated');
  END IF;

  SELECT role INTO v_role FROM public.users WHERE id = v_user_id AND is_active = true;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('error', 'user_not_found', 'message', 'user not found');
  END IF;

  IF v_role <> 'tier1' THEN
    RETURN jsonb_build_object('error', 'forbidden', 'message', 'only Tier 1 can review enforcement appeals');
  END IF;

  IF p_appeal_id IS NULL THEN
    RETURN jsonb_build_object('error', 'validation_error', 'message', 'appeal_id is required');
  END IF;

  SELECT id, status INTO r FROM public.enforcement_action_appeals WHERE id = p_appeal_id;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('error', 'not_found', 'message', 'appeal not found');
  END IF;
  IF r.status NOT IN ('submitted', 'tier2_reviewed') THEN
    RETURN jsonb_build_object('error', 'invalid_status', 'message', 'appeal must be in submitted or tier2_reviewed status to review', 'current_status', r.status);
  END IF;

  UPDATE public.enforcement_action_appeals
  SET reviewed_by_tier1 = v_user_id,
      reviewed_at_tier1 = now(),
      status = 'tier1_reviewed',
      updated_at = now()
  WHERE id = p_appeal_id;

  RETURN jsonb_build_object(
    'appeal',
    (SELECT to_jsonb(a) FROM (
      SELECT id, enforcement_action_id, status, reviewed_by_tier1, reviewed_at_tier1, submitted_at, created_at, updated_at
      FROM public.enforcement_action_appeals WHERE id = p_appeal_id
    ) a)
  );
END;
$$;

COMMENT ON FUNCTION public.enforcement_review_appeal(uuid, text)
  IS 'Tier 1 reviews enforcement appeal (submitted/tier2_reviewed -> tier1_reviewed). SLA: 14 business days target. Task 1.1.2.36.';

-- enforcement_uphold_appeal(p_appeal_id uuid, p_resolution text)
-- Tier 1 only. Appeal in 'submitted' or 'tier1_reviewed'. Sets appeal status = 'upheld', resolution, resolved_by, resolved_at; enforcement_actions status = 'resolved', resolution; if action was suspension, reinstates company (is_active = true, clear suspended_*).
-- Resolution min 50 chars. BUSINESS-LOGIC.
CREATE OR REPLACE FUNCTION public.enforcement_uphold_appeal(
  p_appeal_id uuid,
  p_resolution text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid;
  v_role text;
  r record;
  v_action_id uuid;
  v_action_type text;
  v_company_id uuid;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RETURN jsonb_build_object('error', 'unauthorized', 'message', 'not authenticated');
  END IF;

  SELECT role INTO v_role FROM public.users WHERE id = v_user_id AND is_active = true;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('error', 'user_not_found', 'message', 'user not found');
  END IF;

  IF v_role <> 'tier1' THEN
    RETURN jsonb_build_object('error', 'forbidden', 'message', 'only Tier 1 can uphold enforcement appeals');
  END IF;

  IF p_appeal_id IS NULL THEN
    RETURN jsonb_build_object('error', 'validation_error', 'message', 'appeal_id is required');
  END IF;
  IF p_resolution IS NULL OR trim(p_resolution) = '' THEN
    RETURN jsonb_build_object('error', 'validation_error', 'message', 'resolution is required (min 50 characters)');
  END IF;
  IF length(trim(p_resolution)) < 50 THEN
    RETURN jsonb_build_object('error', 'validation_error', 'message', 'resolution must be at least 50 characters');
  END IF;

  SELECT id, enforcement_action_id, status INTO r FROM public.enforcement_action_appeals WHERE id = p_appeal_id;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('error', 'not_found', 'message', 'appeal not found');
  END IF;
  IF r.status NOT IN ('submitted', 'tier2_reviewed', 'tier1_reviewed') THEN
    RETURN jsonb_build_object('error', 'invalid_status', 'message', 'appeal already resolved or withdrawn', 'current_status', r.status);
  END IF;

  v_action_id := r.enforcement_action_id;
  SELECT action_type, company_id INTO v_action_type, v_company_id FROM public.enforcement_actions WHERE id = v_action_id;

  UPDATE public.enforcement_action_appeals
  SET status = 'upheld',
      resolution = trim(p_resolution),
      resolved_by = v_user_id,
      resolved_at = now(),
      updated_at = now()
  WHERE id = p_appeal_id;

  UPDATE public.enforcement_actions
  SET status = 'resolved',
      resolution = trim(p_resolution),
      resolved_by = v_user_id,
      resolved_at = now(),
      updated_at = now()
  WHERE id = v_action_id;

  IF v_action_type = 'suspension' AND v_company_id IS NOT NULL THEN
    UPDATE public.companies
    SET is_active = true,
        suspended_at = NULL,
        suspended_by = NULL,
        suspended_reason = NULL,
        updated_at = now()
    WHERE id = v_company_id;
  END IF;

  RETURN jsonb_build_object(
    'appeal',
    (SELECT to_jsonb(a) FROM (SELECT id, enforcement_action_id, status, resolution, resolved_by, resolved_at FROM public.enforcement_action_appeals WHERE id = p_appeal_id) a),
    'action',
    (SELECT to_jsonb(e) FROM (SELECT id, company_id, action_type, status, resolution, resolved_by, resolved_at FROM public.enforcement_actions WHERE id = v_action_id) e)
  );
END;
$$;

COMMENT ON FUNCTION public.enforcement_uphold_appeal(uuid, text)
  IS 'Tier 1 upholds appeal (company wins). Appeal -> upheld; action -> resolved; if suspension, reinstate company. Resolution min 50 chars. Task 1.1.2.36.';

-- enforcement_overturn_appeal(p_appeal_id uuid, p_resolution text)
-- Tier 1 only. Appeal in 'submitted' or 'tier1_reviewed'. Sets appeal status = 'rejected', resolution, resolved_by, resolved_at; enforcement_actions status = 'resolved', resolution.
-- Resolution min 50 chars. BUSINESS-LOGIC.
CREATE OR REPLACE FUNCTION public.enforcement_overturn_appeal(
  p_appeal_id uuid,
  p_resolution text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid;
  v_role text;
  r record;
  v_action_id uuid;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RETURN jsonb_build_object('error', 'unauthorized', 'message', 'not authenticated');
  END IF;

  SELECT role INTO v_role FROM public.users WHERE id = v_user_id AND is_active = true;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('error', 'user_not_found', 'message', 'user not found');
  END IF;

  IF v_role <> 'tier1' THEN
    RETURN jsonb_build_object('error', 'forbidden', 'message', 'only Tier 1 can overturn (reject) enforcement appeals');
  END IF;

  IF p_appeal_id IS NULL THEN
    RETURN jsonb_build_object('error', 'validation_error', 'message', 'appeal_id is required');
  END IF;
  IF p_resolution IS NULL OR trim(p_resolution) = '' THEN
    RETURN jsonb_build_object('error', 'validation_error', 'message', 'resolution is required (min 50 characters)');
  END IF;
  IF length(trim(p_resolution)) < 50 THEN
    RETURN jsonb_build_object('error', 'validation_error', 'message', 'resolution must be at least 50 characters');
  END IF;

  SELECT id, enforcement_action_id, status INTO r FROM public.enforcement_action_appeals WHERE id = p_appeal_id;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('error', 'not_found', 'message', 'appeal not found');
  END IF;
  IF r.status NOT IN ('submitted', 'tier2_reviewed', 'tier1_reviewed') THEN
    RETURN jsonb_build_object('error', 'invalid_status', 'message', 'appeal already resolved or withdrawn', 'current_status', r.status);
  END IF;

  v_action_id := r.enforcement_action_id;

  UPDATE public.enforcement_action_appeals
  SET status = 'rejected',
      resolution = trim(p_resolution),
      resolved_by = v_user_id,
      resolved_at = now(),
      updated_at = now()
  WHERE id = p_appeal_id;

  UPDATE public.enforcement_actions
  SET status = 'resolved',
      resolution = trim(p_resolution),
      resolved_by = v_user_id,
      resolved_at = now(),
      updated_at = now()
  WHERE id = v_action_id;

  RETURN jsonb_build_object(
    'appeal',
    (SELECT to_jsonb(a) FROM (SELECT id, enforcement_action_id, status, resolution, resolved_by, resolved_at FROM public.enforcement_action_appeals WHERE id = p_appeal_id) a),
    'action',
    (SELECT to_jsonb(e) FROM (SELECT id, company_id, action_type, status, resolution, resolved_by, resolved_at FROM public.enforcement_actions WHERE id = v_action_id) e)
  );
END;
$$;

COMMENT ON FUNCTION public.enforcement_overturn_appeal(uuid, text)
  IS 'Tier 1 overturns (rejects) appeal. Appeal -> rejected; action -> resolved. Resolution min 50 chars. Task 1.1.2.36.';

GRANT EXECUTE ON FUNCTION public.enforcement_review_appeal(uuid, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.enforcement_review_appeal(uuid, text) TO service_role;
GRANT EXECUTE ON FUNCTION public.enforcement_uphold_appeal(uuid, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.enforcement_uphold_appeal(uuid, text) TO service_role;
GRANT EXECUTE ON FUNCTION public.enforcement_overturn_appeal(uuid, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.enforcement_overturn_appeal(uuid, text) TO service_role;

COMMIT;
