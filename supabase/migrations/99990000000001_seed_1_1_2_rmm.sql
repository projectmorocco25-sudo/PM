-- Migration: seed_1_1_2_rmm
-- Description: RMM module seed data (ATC codes, products, SKUs, registry submissions, enforcement)
-- Date: 2026-01-16 (Schema Audit Compliant)
-- Author: Farah (Seed Realism Gate), Nadia (DB Integrity)
-- Phase: 1.1.2
-- Playbook: phase-1-1-mockdata.md
-- Depends on: 99990000000000_seed_1_1_1_foundation.sql

BEGIN;

-- ====================
-- ATC CODES (no level column)
-- ====================

INSERT INTO atc_codes (id, code, description, is_active, created_at)
VALUES
  ('50000000-0000-0000-0000-000000000001', 'A', 'Alimentary tract and metabolism', true, '2024-01-01 00:00:00+00'),
  ('50000000-0000-0000-0000-000000000002', 'J', 'Antiinfectives for systemic use', true, '2024-01-01 00:00:00+00'),
  ('50000000-0000-0000-0000-000000000003', 'N', 'Nervous system', true, '2024-01-01 00:00:00+00'),
  ('50000000-0000-0000-0000-000000000004', 'R', 'Respiratory system', true, '2024-01-01 00:00:00+00'),
  ('50000000-0000-0000-0000-000000000101', 'A02', 'Drugs for acid related disorders', true, '2024-01-01 00:00:00+00'),
  ('50000000-0000-0000-0000-000000000102', 'A02BC', 'Proton pump inhibitors', true, '2024-01-01 00:00:00+00'),
  ('50000000-0000-0000-0000-000000000201', 'J01', 'Antibacterials for systemic use', true, '2024-01-01 00:00:00+00'),
  ('50000000-0000-0000-0000-000000000202', 'J01CA', 'Penicillins with extended spectrum', true, '2024-01-01 00:00:00+00'),
  ('50000000-0000-0000-0000-000000000301', 'N02', 'Analgesics', true, '2024-01-01 00:00:00+00'),
  ('50000000-0000-0000-0000-000000000302', 'N02BE', 'Anilides', true, '2024-01-01 00:00:00+00'),
  ('50000000-0000-0000-0000-000000000401', 'R03', 'Drugs for obstructive airway diseases', true, '2024-01-01 00:00:00+00'),
  ('50000000-0000-0000-0000-000000000402', 'R03AC', 'Selective beta-2-adrenoreceptor agonists', true, '2024-01-01 00:00:00+00')
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, description = EXCLUDED.description;

-- ====================
-- PRODUCTS (no atc_code_id)
-- ====================

INSERT INTO products (id, company_id, name, description, is_critical_medicine, is_active, created_at)
VALUES
  ('60000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', 'Paracetamol AP', 'Paracetamol analgesic', false, true, '2024-07-01 00:00:00+00'),
  ('60000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000001', 'Amoxicillin AP', 'Amoxicillin antibiotic', true, true, '2024-07-15 00:00:00+00'),
  ('60000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000001', 'Omeprazole AP', 'Omeprazole PPI', false, true, '2024-08-01 00:00:00+00'),
  ('60000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000001', 'Salbutamol AP', 'Salbutamol bronchodilator', true, true, '2024-08-15 00:00:00+00')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

-- ====================
-- SKUs (with pharmaceutical attributes)
-- ====================

INSERT INTO skus (id, product_id, sku_code, name, dosage_strength, dosage_form, pack_size, unit_of_measure, atc_code_id, is_moh_authorized_unregistered, is_active, created_at)
VALUES
  ('70000000-0000-0000-0000-000000000001', '60000000-0000-0000-0000-000000000001', 'PARA-500-TAB-20', 'Paracetamol AP 500mg Tablet 20s', '500mg', 'Tablet', '20', 'tablets', '50000000-0000-0000-0000-000000000302', false, true, '2024-07-01 00:00:00+00'),
  ('70000000-0000-0000-0000-000000000011', '60000000-0000-0000-0000-000000000002', 'AMOX-500-CAP-21', 'Amoxicillin AP 500mg Capsule 21s', '500mg', 'Capsule', '21', 'capsules', '50000000-0000-0000-0000-000000000202', false, true, '2024-07-15 00:00:00+00'),
  ('70000000-0000-0000-0000-000000000021', '60000000-0000-0000-0000-000000000003', 'OMEP-20-CAP-14', 'Omeprazole AP 20mg Capsule 14s', '20mg', 'Capsule', '14', 'capsules', '50000000-0000-0000-0000-000000000102', false, true, '2024-08-01 00:00:00+00'),
  ('70000000-0000-0000-0000-000000000031', '60000000-0000-0000-0000-000000000004', 'SALB-100-INH-200', 'Salbutamol AP 100mcg Inhaler 200 doses', '100mcg', 'Spray', '200', 'units', '50000000-0000-0000-0000-000000000402', false, true, '2024-08-15 00:00:00+00')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

-- ====================
-- REGISTRY SUBMISSIONS (entity_type: company/product/sku ONLY)
-- ====================

-- draft (2)
INSERT INTO registry_submissions (id, company_id, submission_type, entity_type, entity_id, submission_data, status, submitted_by, created_at)
VALUES
  ('80000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', 'sku_create', 'sku', NULL, '{"sku_code": "NEW-001", "name": "Draft Product"}'::jsonb, 'draft', '10000000-0000-0000-0000-000000000011', now() - interval '5 days'),
  ('80000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000001', 'product_update', 'product', '60000000-0000-0000-0000-000000000001', '{"description": "Updated"}'::jsonb, 'draft', '10000000-0000-0000-0000-000000000011', now() - interval '3 days')
ON CONFLICT (id) DO NOTHING;

-- submitted (2)
INSERT INTO registry_submissions (id, company_id, submission_type, entity_type, entity_id, submission_data, status, submitted_by, submitted_at, created_at)
VALUES
  ('80000000-0000-0000-0000-000000000011', '20000000-0000-0000-0000-000000000001', 'sku_create', 'sku', NULL, '{"sku_code": "NEW-002", "name": "Ibuprofen 200mg"}'::jsonb, 'submitted', '10000000-0000-0000-0000-000000000011', now() - interval '2 days', now() - interval '4 days'),
  ('80000000-0000-0000-0000-000000000012', '20000000-0000-0000-0000-000000000001', 'product_create', 'product', NULL, '{"name": "Aspirin AP"}'::jsonb, 'submitted', '10000000-0000-0000-0000-000000000011', now() - interval '1 day', now() - interval '3 days')
ON CONFLICT (id) DO NOTHING;

-- tier2_verified (2)
INSERT INTO registry_submissions (id, company_id, submission_type, entity_type, entity_id, submission_data, status, submitted_by, submitted_at, verified_by, verified_at, created_at)
VALUES
  ('80000000-0000-0000-0000-000000000021', '20000000-0000-0000-0000-000000000001', 'sku_update', 'sku', '70000000-0000-0000-0000-000000000001', '{"pack_size": "30"}'::jsonb, 'tier2_verified', '10000000-0000-0000-0000-000000000011', now() - interval '5 days', '10000000-0000-0000-0000-000000000002', now() - interval '3 days', now() - interval '6 days'),
  ('80000000-0000-0000-0000-000000000022', '20000000-0000-0000-0000-000000000001', 'company_update', 'company', '20000000-0000-0000-0000-000000000001', '{"contact_phone": "+212522999999"}'::jsonb, 'tier2_verified', '10000000-0000-0000-0000-000000000011', now() - interval '4 days', '10000000-0000-0000-0000-000000000002', now() - interval '2 days', now() - interval '5 days')
ON CONFLICT (id) DO NOTHING;

-- tier1_approved (2)
INSERT INTO registry_submissions (id, company_id, submission_type, entity_type, entity_id, submission_data, status, submitted_by, submitted_at, verified_by, verified_at, approved_by, approved_at, created_at)
VALUES
  ('80000000-0000-0000-0000-000000000041', '20000000-0000-0000-0000-000000000001', 'product_create', 'product', NULL, '{"name": "Lisinopril AP"}'::jsonb, 'tier1_approved', '10000000-0000-0000-0000-000000000011', now() - interval '15 days', '10000000-0000-0000-0000-000000000002', now() - interval '12 days', '10000000-0000-0000-0000-000000000001', now() - interval '10 days', now() - interval '16 days'),
  ('80000000-0000-0000-0000-000000000042', '20000000-0000-0000-0000-000000000001', 'product_update', 'product', '60000000-0000-0000-0000-000000000004', '{"description": "Updated"}'::jsonb, 'tier1_approved', '10000000-0000-0000-0000-000000000011', now() - interval '14 days', '10000000-0000-0000-0000-000000000002', now() - interval '11 days', '10000000-0000-0000-0000-000000000001', now() - interval '9 days', now() - interval '15 days')
ON CONFLICT (id) DO NOTHING;

-- tier2_implemented (1)
INSERT INTO registry_submissions (id, company_id, submission_type, entity_type, entity_id, submission_data, status, submitted_by, submitted_at, verified_by, verified_at, approved_by, approved_at, implemented_by, implemented_at, created_at)
VALUES
  ('80000000-0000-0000-0000-000000000051', '20000000-0000-0000-0000-000000000001', 'sku_create', 'sku', '70000000-0000-0000-0000-000000000031', '{"sku_code": "SALB-100-INH-200"}'::jsonb, 'tier2_implemented', '10000000-0000-0000-0000-000000000011', now() - interval '20 days', '10000000-0000-0000-0000-000000000002', now() - interval '17 days', '10000000-0000-0000-0000-000000000001', now() - interval '15 days', '10000000-0000-0000-0000-000000000003', now() - interval '13 days', now() - interval '21 days')
ON CONFLICT (id) DO NOTHING;

-- completed (1 - no completed_at column exists)
INSERT INTO registry_submissions (id, company_id, submission_type, entity_type, entity_id, submission_data, status, submitted_by, submitted_at, verified_by, verified_at, approved_by, approved_at, implemented_by, implemented_at, created_at)
VALUES
  ('80000000-0000-0000-0000-000000000061', '20000000-0000-0000-0000-000000000001', 'product_create', 'product', '60000000-0000-0000-0000-000000000001', '{"name": "Paracetamol AP"}'::jsonb, 'completed', '10000000-0000-0000-0000-000000000011', '2024-07-01 10:00:00+00', '10000000-0000-0000-0000-000000000002', '2024-07-02 10:00:00+00', '10000000-0000-0000-0000-000000000001', '2024-07-03 10:00:00+00', '10000000-0000-0000-0000-000000000003', '2024-07-04 10:00:00+00', '2024-07-01 09:00:00+00')
ON CONFLICT (id) DO NOTHING;

-- rejected (2)
INSERT INTO registry_submissions (id, company_id, submission_type, entity_type, entity_id, submission_data, status, submitted_by, submitted_at, rejection_reason, created_at)
VALUES
  ('80000000-0000-0000-0000-000000000071', '20000000-0000-0000-0000-000000000001', 'sku_create', 'sku', NULL, '{"sku_code": "INVALID-001"}'::jsonb, 'rejected', '10000000-0000-0000-0000-000000000011', now() - interval '7 days', 'Incomplete pharmaceutical attributes', now() - interval '8 days'),
  ('80000000-0000-0000-0000-000000000072', '20000000-0000-0000-0000-000000000001', 'product_update', 'product', '60000000-0000-0000-0000-000000000002', '{"description": "Invalid"}'::jsonb, 'rejected', '10000000-0000-0000-0000-000000000011', now() - interval '6 days', 'Cannot modify critical medicine without authorization', now() - interval '7 days')
ON CONFLICT (id) DO NOTHING;

-- ====================
-- ENFORCEMENT ACTIONS (created_by required, fines need regulatory_basis + evidence_references + 50+ char justification)
-- ====================

-- draft warnings
INSERT INTO enforcement_actions (id, company_id, action_type, violation_type, status, legal_basis, justification, created_by, created_at)
VALUES
  ('90000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', 'warning', 'submission_non_compliance', 'draft', 'DMP Regulation Article 15.3', 'Company failed to submit weekly stock levels for reporting period ending January 8, 2026. First instance of non-compliance noted.', '10000000-0000-0000-0000-000000000002', now() - interval '2 days')
ON CONFLICT (id) DO NOTHING;

-- draft fines
INSERT INTO enforcement_actions (id, company_id, action_type, violation_type, status, legal_basis, regulatory_basis, justification, evidence_references, amount, currency, created_by, created_at)
VALUES
  ('90000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000003', 'fine', 'threshold_breach', 'draft', 'DMP Regulation Article 22.1', 'Ministerial Decree 2024-PHM-042 Section 3.2 on Critical Medicine Stock Thresholds', 'Critical medicine stock level fell below regulatory threshold for three consecutive days without advance notification to MOH as required by regulations.', '[{"type": "breach_report", "ref": "BREACH-2026-001", "product_id": "60000000-0000-0000-0000-000000000002"}]'::jsonb, 5000.00, 'MAD', '10000000-0000-0000-0000-000000000002', now() - interval '1 day')
ON CONFLICT (id) DO NOTHING;

-- pending_review warnings
INSERT INTO enforcement_actions (id, company_id, action_type, violation_type, status, legal_basis, justification, created_by, created_at)
VALUES
  ('90000000-0000-0000-0000-000000000011', '20000000-0000-0000-0000-000000000001', 'warning', 'data_quality_issue', 'pending_review', 'DMP Regulation Article 18.2', 'Submitted AAMS data contained material inconsistencies between product SKU quantities and warehouse location totals that require investigation and correction.', '10000000-0000-0000-0000-000000000002', now() - interval '3 days')
ON CONFLICT (id) DO NOTHING;

-- pending_review fines
INSERT INTO enforcement_actions (id, company_id, action_type, violation_type, status, legal_basis, regulatory_basis, justification, evidence_references, amount, currency, created_by, created_at)
VALUES
  ('90000000-0000-0000-0000-000000000012', '20000000-0000-0000-0000-000000000003', 'fine', 'submission_non_compliance', 'pending_review', 'DMP Regulation Article 15.5', 'Executive Order 2025-004 on Reporting Compliance Deadlines', 'Monthly Stock Quantities (MSQ) report for December 2025 submitted twelve days after regulatory deadline without prior notification or extension request.', '[{"type": "late_submission", "ref": "MSQ-DEC-2025", "late_days": 12}]'::jsonb, 3000.00, 'MAD', '10000000-0000-0000-0000-000000000002', now() - interval '4 days')
ON CONFLICT (id) DO NOTHING;

-- pending_approval warnings
INSERT INTO enforcement_actions (id, company_id, action_type, violation_type, status, legal_basis, justification, reviewed_by, reviewed_at, created_by, created_at)
VALUES
  ('90000000-0000-0000-0000-000000000021', '20000000-0000-0000-0000-000000000001', 'warning', 'export_violation', 'pending_approval', 'DMP Regulation Article 25.1', 'Company attempted export of controlled pharmaceutical substances without obtaining required authorization documentation from relevant regulatory authorities.', '10000000-0000-0000-0000-000000000002', now() - interval '5 days', '10000000-0000-0000-0000-000000000002', now() - interval '6 days')
ON CONFLICT (id) DO NOTHING;

-- pending_approval fines
INSERT INTO enforcement_actions (id, company_id, action_type, violation_type, status, legal_basis, regulatory_basis, justification, evidence_references, amount, currency, reviewed_by, reviewed_at, created_by, created_at)
VALUES
  ('90000000-0000-0000-0000-000000000022', '20000000-0000-0000-0000-000000000003', 'fine', 'critical_medicine_non_compliance', 'pending_approval', 'DMP Regulation Article 22.3', 'Ministerial Decree 2024-PHM-028 on Critical Medicines Availability Standards', 'Critical medicine stock maintained below threshold for seven consecutive days, severe violation of pharmaceutical availability requirements affecting patient access.', '[{"type": "threshold_breach", "product_id": "60000000-0000-0000-0000-000000000002", "days_below": 7}]'::jsonb, 8000.00, 'MAD', '10000000-0000-0000-0000-000000000002', now() - interval '7 days', '10000000-0000-0000-0000-000000000002', now() - interval '8 days')
ON CONFLICT (id) DO NOTHING;

-- approved warnings
INSERT INTO enforcement_actions (id, company_id, action_type, violation_type, status, legal_basis, justification, reviewed_by, reviewed_at, approved_by, approved_at, created_by, created_at)
VALUES
  ('90000000-0000-0000-0000-000000000031', '20000000-0000-0000-0000-000000000001', 'warning', 'submission_non_compliance', 'approved', 'DMP Regulation Article 15.4', 'Second instance of late weekly stock level submission within three-month period. Escalation to formal warning required per progressive enforcement policy.', '10000000-0000-0000-0000-000000000002', now() - interval '9 days', '10000000-0000-0000-0000-000000000001', now() - interval '8 days', '10000000-0000-0000-0000-000000000002', now() - interval '10 days')
ON CONFLICT (id) DO NOTHING;

-- approved fines
INSERT INTO enforcement_actions (id, company_id, action_type, violation_type, status, legal_basis, regulatory_basis, justification, evidence_references, amount, currency, reviewed_by, reviewed_at, approved_by, approved_at, created_by, created_at)
VALUES
  ('90000000-0000-0000-0000-000000000032', '20000000-0000-0000-0000-000000000003', 'fine', 'repeated_offender', 'approved', 'DMP Regulation Article 30.1', 'Ministerial Decree 2024-ENF-015 on Progressive Enforcement for Repeat Violations', 'Pattern of repeated regulatory violations documented over six-month period. Third separate offense requiring enhanced financial penalty under repeat offender provisions.', '[{"type": "prior_violation", "ref": "ENF-2025-042"}, {"type": "prior_violation", "ref": "ENF-2025-089"}, {"type": "pattern_analysis", "ref": "COMP-ANALYSIS-2025-Q4"}]'::jsonb, 12000.00, 'MAD', '10000000-0000-0000-0000-000000000002', now() - interval '11 days', '10000000-0000-0000-0000-000000000001', now() - interval '10 days', '10000000-0000-0000-0000-000000000002', now() - interval '12 days')
ON CONFLICT (id) DO NOTHING;

-- executed warnings
INSERT INTO enforcement_actions (id, company_id, action_type, violation_type, status, legal_basis, justification, reviewed_by, reviewed_at, approved_by, approved_at, executed_by, executed_at, created_by, created_at)
VALUES
  ('90000000-0000-0000-0000-000000000041', '20000000-0000-0000-0000-000000000001', 'warning', 'data_quality_issue', 'executed', 'DMP Regulation Article 18.1', 'Registry submission contained incorrect ATC code classification. Formal warning issued to improve data accuracy and validation procedures before future submissions.', '10000000-0000-0000-0000-000000000002', now() - interval '15 days', '10000000-0000-0000-0000-000000000001', now() - interval '14 days', '10000000-0000-0000-0000-000000000002', now() - interval '13 days', '10000000-0000-0000-0000-000000000002', now() - interval '16 days')
ON CONFLICT (id) DO NOTHING;

-- executed fines
INSERT INTO enforcement_actions (id, company_id, action_type, violation_type, status, legal_basis, regulatory_basis, justification, evidence_references, amount, currency, reviewed_by, reviewed_at, approved_by, approved_at, executed_by, executed_at, created_by, created_at)
VALUES
  ('90000000-0000-0000-0000-000000000042', '20000000-0000-0000-0000-000000000003', 'fine', 'threshold_breach', 'executed', 'DMP Regulation Article 22.2', 'Royal Decree 2023-PHM-108 on Essential Medicines Availability Standards', 'Essential medicine stock maintained below regulatory threshold without advance notification as required by pharmaceutical governance regulations and availability standards.', '[{"type": "wsl_report", "ref": "WSL-NOV-2025"}, {"type": "threshold_analysis", "ref": "THRESH-2025-11-W3"}]'::jsonb, 4500.00, 'MAD', '10000000-0000-0000-0000-000000000002', now() - interval '17 days', '10000000-0000-0000-0000-000000000001', now() - interval '16 days', '10000000-0000-0000-0000-000000000002', now() - interval '15 days', '10000000-0000-0000-0000-000000000002', now() - interval '18 days')
ON CONFLICT (id) DO NOTHING;

-- appealed fines
INSERT INTO enforcement_actions (id, company_id, action_type, violation_type, status, legal_basis, regulatory_basis, justification, evidence_references, amount, currency, reviewed_by, reviewed_at, approved_by, approved_at, executed_by, executed_at, created_by, created_at)
VALUES
  ('90000000-0000-0000-0000-000000000051', '20000000-0000-0000-0000-000000000001', 'fine', 'submission_non_compliance', 'appealed', 'DMP Regulation Article 15.6', 'Executive Order 2025-PHM-031 on Reporting Compliance', 'AAMS submission filed after deadline. Fine assessed per standard penalty schedule for late reporting compliance violations per established enforcement framework.', '[{"type": "late_submission", "ref": "AAMS-DEC-2025", "late_days": 4}]'::jsonb, 6000.00, 'MAD', '10000000-0000-0000-0000-000000000002', now() - interval '25 days', '10000000-0000-0000-0000-000000000001', now() - interval '24 days', '10000000-0000-0000-0000-000000000002', now() - interval '23 days', '10000000-0000-0000-0000-000000000002', now() - interval '26 days')
ON CONFLICT (id) DO NOTHING;

-- resolved fines
INSERT INTO enforcement_actions (id, company_id, action_type, violation_type, status, legal_basis, regulatory_basis, justification, evidence_references, amount, currency, reviewed_by, reviewed_at, approved_by, approved_at, executed_by, executed_at, resolution, resolved_by, resolved_at, created_by, created_at)
VALUES
  ('90000000-0000-0000-0000-000000000061', '20000000-0000-0000-0000-000000000003', 'fine', 'critical_medicine_non_compliance', 'resolved', 'DMP Regulation Article 22.4', 'Royal Decree 2023-PHM-108 on Critical Medicine Obligations', 'Critical medicine stock maintained below minimum threshold for extended duration without proper notification or mitigation plan as required by pharmaceutical governance standards.', '[{"type": "stock_analysis", "product_id": "60000000-0000-0000-0000-000000000002", "days_below": 14}, {"type": "impact_assessment", "level": "high"}]'::jsonb, 7000.00, 'MAD', '10000000-0000-0000-0000-000000000002', '2025-11-15 10:00:00+00', '10000000-0000-0000-0000-000000000001', '2025-11-14 10:00:00+00', '10000000-0000-0000-0000-000000000002', '2025-11-13 10:00:00+00', 'upheld', '10000000-0000-0000-0000-000000000001', '2025-12-10 10:00:00+00', '10000000-0000-0000-0000-000000000002', '2025-11-16 10:00:00+00')
ON CONFLICT (id) DO NOTHING;

-- cancelled warnings
INSERT INTO enforcement_actions (id, company_id, action_type, violation_type, status, legal_basis, justification, reviewed_by, reviewed_at, created_by, created_at)
VALUES
  ('90000000-0000-0000-0000-000000000071', '20000000-0000-0000-0000-000000000001', 'warning', 'data_quality_issue', 'cancelled', 'DMP Regulation Article 18.3', 'Data quality issue in submission determined upon review to be system error rather than company fault. Action cancelled per regulatory fairness principles.', '10000000-0000-0000-0000-000000000002', now() - interval '30 days', '10000000-0000-0000-0000-000000000002', now() - interval '31 days')
ON CONFLICT (id) DO NOTHING;

-- ====================
-- ENFORCEMENT APPEALS
-- ====================

-- submitted
INSERT INTO enforcement_action_appeals (id, enforcement_action_id, appeal_reason, status, submitted_by, submitted_at)
VALUES
  ('95000000-0000-0000-0000-000000000051', '90000000-0000-0000-0000-000000000051', 'Technical system outage on submission date prevented timely filing. Server logs and IT incident reports attached showing infrastructure failure beyond company control during scheduled submission window.', 'submitted', '10000000-0000-0000-0000-000000000011', now() - interval '20 days')
ON CONFLICT (id) DO NOTHING;

-- upheld
INSERT INTO enforcement_action_appeals (id, enforcement_action_id, appeal_reason, status, submitted_by, submitted_at, reviewed_by_tier1, reviewed_at_tier1, resolution, resolved_by, resolved_at)
VALUES
  ('95000000-0000-0000-0000-000000000061', '90000000-0000-0000-0000-000000000061', 'International supplier experienced significant shipping delays due to documented port congestion and customs processing backlog affecting pharmaceutical imports during critical period.', 'upheld', '10000000-0000-0000-0000-000000000031', '2025-11-20 10:00:00+00', '10000000-0000-0000-0000-000000000001', '2025-12-10 10:00:00+00', 'Appeal reviewed. While supplier delays acknowledged, company failed to notify MOH or seek alternative suppliers as required. Enforcement upheld.', '10000000-0000-0000-0000-000000000001', '2025-12-10 10:00:00+00')
ON CONFLICT (id) DO NOTHING;

COMMIT;

-- Verification
-- SELECT COUNT(*) FROM atc_codes; -- 12
-- SELECT COUNT(*) FROM products; -- 4
-- SELECT COUNT(*) FROM skus; -- 4
-- SELECT COUNT(*) FROM registry_submissions; -- 13
-- SELECT COUNT(*) FROM enforcement_actions; -- 10
-- SELECT COUNT(*) FROM enforcement_action_appeals; -- 2
