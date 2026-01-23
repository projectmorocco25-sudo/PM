-- Migration: create_rls_policies_enforcement_tables
-- Description: Implement RLS policies for enforcement tables (enforcement_actions, enforcement_action_appeals)
-- Date: 2026-01-22
-- Task: 1.1.1.8
-- Author: Sami (Implementation Compliance Specialist)
-- Dependencies: Task 1.1.1.7 (enforcement tables must exist)

BEGIN;

-- ============================================================================
-- Enable RLS on all enforcement tables
-- ============================================================================

ALTER TABLE enforcement_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE enforcement_action_appeals ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- enforcement_actions table RLS policies
-- ============================================================================

-- Company users can see their own company's enforcement actions
CREATE POLICY "company_users_see_own_enforcement_actions"
ON enforcement_actions FOR SELECT
USING (
    company_id IN (
        SELECT company_id FROM users WHERE id = auth.uid()
    )
);

-- MOH users can see all enforcement actions
CREATE POLICY "moh_users_see_all_enforcement_actions"
ON enforcement_actions FOR SELECT
USING (
    (SELECT company_id FROM users WHERE id = auth.uid()) IS NULL
);

-- MOH users can create enforcement actions (via RPC functions with proper authorization)
-- Note: Enforcement action creation is handled via RPC functions with proper authorization

-- MOH users can update enforcement actions (via RPC functions with proper authorization)
-- Note: Enforcement action updates (review, approve, execute, resolve) are handled via RPC functions with proper authorization

-- ============================================================================
-- enforcement_action_appeals table RLS policies
-- ============================================================================

-- Company users can see their own company's appeals
CREATE POLICY "company_users_see_own_appeals"
ON enforcement_action_appeals FOR SELECT
USING (
    enforcement_action_id IN (
        SELECT id FROM enforcement_actions
        WHERE company_id IN (
            SELECT company_id FROM users WHERE id = auth.uid()
        )
    )
);

-- MOH users can see all appeals
CREATE POLICY "moh_users_see_all_appeals"
ON enforcement_action_appeals FOR SELECT
USING (
    (SELECT company_id FROM users WHERE id = auth.uid()) IS NULL
);

-- Company users can create appeals for their own company's enforcement actions (via RPC functions)
-- Note: Appeal creation is handled via RPC functions with proper authorization

-- MOH users can update appeals (via RPC functions with proper authorization)
-- Note: Appeal updates (review, resolve) are handled via RPC functions with proper authorization

COMMIT;
