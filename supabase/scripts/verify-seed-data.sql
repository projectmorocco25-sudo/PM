-- Seed Data Verification Script
-- Purpose: Verify seed_1_1_1_foundation and seed_1_1_2_rmm were applied correctly
-- Date: 2026-01-15
-- Run: supabase db shell < supabase/scripts/verify-seed-data.sql

\echo '=========================================='
\echo 'SEED DATA VERIFICATION'
\echo '=========================================='
\echo ''

\echo '1. MODULE ACTIVATION'
\echo '--------------------'
SELECT module_name, is_active, activated_at FROM system_config ORDER BY module_name;
\echo 'Expected: RMM (active), VCI (active), ECS (inactive), CMC (inactive)'
\echo ''

\echo '2. USERS BY ROLE'
\echo '--------------------'
SELECT role, COUNT(*) as count FROM users GROUP BY role ORDER BY role;
\echo 'Expected: tier1 (1), tier2_officer (1), tier2_registrar (1), company_admin (3), company_manager (1)'
\echo ''

\echo '3. COMPANIES'
\echo '--------------------'
SELECT name, company_type, is_active FROM companies ORDER BY created_at;
\echo 'Expected: 3 companies (Active Pharma Co, Empty Holdings Ltd, MediSupply Maroc)'
\echo ''

\echo '4. ATC CODES BY LEVEL'
\echo '--------------------'
SELECT level, COUNT(*) as count FROM atc_codes GROUP BY level ORDER BY level;
\echo 'Expected: Level 1 (8), Level 2 (5), Level 3 (5), Level 4 (5) = 23 total'
\echo ''

\echo '5. PRODUCTS (Critical Medicine Flag)'
\echo '--------------------'
SELECT is_critical_medicine, COUNT(*) as count FROM products GROUP BY is_critical_medicine ORDER BY is_critical_medicine;
\echo 'Expected: false (2), true (2) = 4 total'
\echo ''

\echo '6. SKUs WITH PHARMA ATTRIBUTES'
\echo '--------------------'
SELECT COUNT(*) as total_skus FROM skus;
SELECT COUNT(*) as skus_with_pharma_attrs FROM skus 
WHERE dosage_strength IS NOT NULL 
  AND dosage_form IS NOT NULL 
  AND pack_size IS NOT NULL 
  AND unit_of_measure IS NOT NULL;
\echo 'Expected: 7 SKUs, all with complete pharmaceutical attributes'
\echo ''

\echo '7. REGISTRY SUBMISSIONS BY STATUS'
\echo '--------------------'
SELECT status, COUNT(*) as count FROM registry_submissions GROUP BY status ORDER BY status;
\echo 'Expected: ~2 per state (draft, submitted, tier2_verified, tier2_peer_reviewed, tier1_approved, tier2_implemented, completed, rejected)'
\echo ''

\echo '8. ENFORCEMENT ACTIONS BY STATUS'
\echo '--------------------'
SELECT status, COUNT(*) as count FROM enforcement_actions GROUP BY status ORDER BY status;
\echo 'Expected: ~2 per state (draft, pending_review, pending_approval, approved, executed, appealed, resolved, cancelled)'
\echo ''

\echo '9. ENFORCEMENT ACTIONS BY TYPE'
\echo '--------------------'
SELECT action_type, COUNT(*) as count FROM enforcement_actions GROUP BY action_type ORDER BY action_type;
\echo 'Expected: warnings, fines, suspensions distributed'
\echo ''

\echo '10. APPEALS'
\echo '--------------------'
SELECT status, COUNT(*) as count FROM enforcement_action_appeals GROUP BY status ORDER BY status;
\echo 'Expected: submitted (1), upheld (1) = 2 total'
\echo ''

\echo '11. NOTIFICATIONS (Unread Badge Test)'
\echo '--------------------'
SELECT is_read, COUNT(*) as count FROM notifications GROUP BY is_read ORDER BY is_read;
\echo 'Expected: unread (3+), read (1+)'
\echo ''

\echo '12. FOREIGN KEY INTEGRITY CHECK'
\echo '--------------------'
-- Check for orphaned products (should be 0)
SELECT COUNT(*) as orphaned_products FROM products p 
WHERE NOT EXISTS (SELECT 1 FROM companies c WHERE c.id = p.company_id);

-- Check for orphaned SKUs (should be 0)
SELECT COUNT(*) as orphaned_skus FROM skus s 
WHERE NOT EXISTS (SELECT 1 FROM products p WHERE p.id = s.product_id);

-- Check for orphaned registry submissions (should be 0)
SELECT COUNT(*) as orphaned_submissions FROM registry_submissions rs 
WHERE rs.company_id IS NOT NULL 
  AND NOT EXISTS (SELECT 1 FROM companies c WHERE c.id = rs.company_id);

\echo 'Expected: All counts should be 0 (no orphaned records)'
\echo ''

\echo '=========================================='
\echo 'VERIFICATION COMPLETE'
\echo '=========================================='
\echo 'If all counts match expected values, seed data is correctly applied.'
\echo 'You can now run: cd frontend && npm run dev'
