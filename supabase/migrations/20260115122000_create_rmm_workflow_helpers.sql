-- Migration: create_rmm_workflow_helpers
-- Description: Shared RMM workflow/state helpers (registry status transition validation)
-- Date: 2026-01-15
-- Author: Maya
-- Phase: 1.1.2
-- Task: 1.1.2.1a
-- Reference: docs/02-architecture/workflow-architecture.md

BEGIN;

-- Registry submission status transition validation (company and MOH variants).
-- Company workflow: draft -> submitted -> tier2_verified -> tier1_approved -> tier2_implemented -> completed; any -> rejected
-- MOH workflow: draft -> submitted -> tier2_peer_reviewed -> tier1_approved -> tier2_implemented -> completed; any -> rejected
CREATE OR REPLACE FUNCTION rmm_registry_is_valid_transition(
  p_from_status text,
  p_to_status text,
  p_is_moh_submission boolean DEFAULT false
)
RETURNS boolean
LANGUAGE sql
STABLE
AS $$
  SELECT CASE
    WHEN p_to_status = 'rejected' THEN true
    WHEN p_is_moh_submission = true THEN
      (p_from_status = 'draft' AND p_to_status = 'submitted')
      OR (p_from_status = 'submitted' AND p_to_status = 'tier2_peer_reviewed')
      OR (p_from_status = 'tier2_peer_reviewed' AND p_to_status = 'tier1_approved')
      OR (p_from_status = 'tier1_approved' AND p_to_status = 'tier2_implemented')
      OR (p_from_status = 'tier2_implemented' AND p_to_status = 'completed')
    ELSE
      (p_from_status = 'draft' AND p_to_status = 'submitted')
      OR (p_from_status = 'submitted' AND p_to_status = 'tier2_verified')
      OR (p_from_status = 'tier2_verified' AND p_to_status = 'tier1_approved')
      OR (p_from_status = 'tier1_approved' AND p_to_status = 'tier2_implemented')
      OR (p_from_status = 'tier2_implemented' AND p_to_status = 'completed')
  END;
$$;

COMMIT;

