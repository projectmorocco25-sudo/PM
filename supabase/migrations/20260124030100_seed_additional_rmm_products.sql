-- Migration: seed_additional_rmm_products
-- Description: Seed additional products for 10 companies (10+ products each) to meet seed data requirements
-- Date: 2026-01-24
-- Task: 1.1.3.6 (Seed Data Fixes)
-- Owner: Hassan (QA/Assurance Engineer)
-- Compliance: Deterministic IDs + idempotent UPSERTs

BEGIN;

-- ============================================================================
-- Seed products for 10 additional companies (10+ products each)
-- Companies: 002-011 (Rabat, Marrakech, Tangier, Agadir, Fes, Meknes, Oujda, Kenitra, Tetouan, Safi)
-- ============================================================================

INSERT INTO products (
    id, company_id, name, description, is_critical_medicine, is_active, created_at, updated_at
)
VALUES
    -- Rabat Pharma Industries (002) - 12 products
    ('00000000-0000-0000-0000-000000000301', '00000000-0000-0000-0000-000000000002', 'Amlodipine 5mg', 'Calcium channel blocker for hypertension', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000000302', '00000000-0000-0000-0000-000000000002', 'Amlodipine 10mg', 'Calcium channel blocker for hypertension', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000000303', '00000000-0000-0000-0000-000000000002', 'Losartan 50mg', 'Angiotensin receptor blocker', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000000304', '00000000-0000-0000-0000-000000000002', 'Losartan 100mg', 'Angiotensin receptor blocker', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000000305', '00000000-0000-0000-0000-000000000002', 'Simvastatin 20mg', 'HMG-CoA reductase inhibitor', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000000306', '00000000-0000-0000-0000-000000000002', 'Simvastatin 40mg', 'HMG-CoA reductase inhibitor', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000000307', '00000000-0000-0000-0000-000000000002', 'Levothyroxine 50mcg', 'Thyroid hormone replacement', true, true, now(), now()),
    ('00000000-0000-0000-0000-000000000308', '00000000-0000-0000-0000-000000000002', 'Levothyroxine 100mcg', 'Thyroid hormone replacement', true, true, now(), now()),
    ('00000000-0000-0000-0000-000000000309', '00000000-0000-0000-0000-000000000002', 'Warfarin 5mg', 'Anticoagulant medication', true, true, now(), now()),
    ('00000000-0000-0000-0000-000000000310', '00000000-0000-0000-0000-000000000002', 'Warfarin 2.5mg', 'Anticoagulant medication', true, true, now(), now()),
    ('00000000-0000-0000-0000-000000000311', '00000000-0000-0000-0000-000000000002', 'Furosemide 40mg', 'Loop diuretic', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000000312', '00000000-0000-0000-0000-000000000002', 'Furosemide 20mg', 'Loop diuretic', false, true, now(), now()),

    -- Marrakech Pharma Industries (003) - 12 products
    ('00000000-0000-0000-0000-000000000401', '00000000-0000-0000-0000-000000000003', 'Ciprofloxacin 500mg', 'Fluoroquinolone antibiotic', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000000402', '00000000-0000-0000-0000-000000000003', 'Ciprofloxacin 250mg', 'Fluoroquinolone antibiotic', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000000403', '00000000-0000-0000-0000-000000000003', 'Doxycycline 100mg', 'Tetracycline antibiotic', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000000404', '00000000-0000-0000-0000-000000000003', 'Doxycycline 50mg', 'Tetracycline antibiotic', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000000405', '00000000-0000-0000-0000-000000000003', 'Clarithromycin 500mg', 'Macrolide antibiotic', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000000406', '00000000-0000-0000-0000-000000000003', 'Clarithromycin 250mg', 'Macrolide antibiotic', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000000407', '00000000-0000-0000-0000-000000000003', 'Ceftriaxone 1g', 'Third-generation cephalosporin', true, true, now(), now()),
    ('00000000-0000-0000-0000-000000000408', '00000000-0000-0000-0000-000000000003', 'Ceftriaxone 500mg', 'Third-generation cephalosporin', true, true, now(), now()),
    ('00000000-0000-0000-0000-000000000409', '00000000-0000-0000-0000-000000000003', 'Vancomycin 500mg', 'Glycopeptide antibiotic', true, true, now(), now()),
    ('00000000-0000-0000-0000-000000000410', '00000000-0000-0000-0000-000000000003', 'Vancomycin 1g', 'Glycopeptide antibiotic', true, true, now(), now()),
    ('00000000-0000-0000-0000-000000000411', '00000000-0000-0000-0000-000000000003', 'Metronidazole 500mg', 'Nitroimidazole antibiotic', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000000412', '00000000-0000-0000-0000-000000000003', 'Metronidazole 250mg', 'Nitroimidazole antibiotic', false, true, now(), now()),

    -- Tangier Pharma Industries (004) - 12 products
    ('00000000-0000-0000-0000-000000000501', '00000000-0000-0000-0000-000000000004', 'Pantoprazole 40mg', 'Proton pump inhibitor', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000000502', '00000000-0000-0000-0000-000000000004', 'Pantoprazole 20mg', 'Proton pump inhibitor', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000000503', '00000000-0000-0000-0000-000000000004', 'Ranitidine 150mg', 'H2 receptor antagonist', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000000504', '00000000-0000-0000-0000-000000000004', 'Ranitidine 300mg', 'H2 receptor antagonist', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000000505', '00000000-0000-0000-0000-000000000004', 'Domperidone 10mg', 'Dopamine antagonist', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000000506', '00000000-0000-0000-0000-000000000004', 'Domperidone 5mg', 'Dopamine antagonist', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000000507', '00000000-0000-0000-0000-000000000004', 'Lansoprazole 30mg', 'Proton pump inhibitor', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000000508', '00000000-0000-0000-0000-000000000004', 'Lansoprazole 15mg', 'Proton pump inhibitor', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000000509', '00000000-0000-0000-0000-000000000004', 'Esomeprazole 40mg', 'Proton pump inhibitor', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000000510', '00000000-0000-0000-0000-000000000004', 'Esomeprazole 20mg', 'Proton pump inhibitor', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000000511', '00000000-0000-0000-0000-000000000004', 'Famotidine 20mg', 'H2 receptor antagonist', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000000512', '00000000-0000-0000-0000-000000000004', 'Famotidine 40mg', 'H2 receptor antagonist', false, true, now(), now()),

    -- Agadir Pharma Industries (005) - 12 products
    ('00000000-0000-0000-0000-000000000601', '00000000-0000-0000-0000-000000000005', 'Atenolol 50mg', 'Beta-blocker', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000000602', '00000000-0000-0000-0000-000000000005', 'Atenolol 100mg', 'Beta-blocker', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000000603', '00000000-0000-0000-0000-000000000005', 'Propranolol 40mg', 'Beta-blocker', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000000604', '00000000-0000-0000-0000-000000000005', 'Propranolol 80mg', 'Beta-blocker', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000000605', '00000000-0000-0000-0000-000000000005', 'Carvedilol 25mg', 'Alpha and beta-blocker', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000000606', '00000000-0000-0000-0000-000000000005', 'Carvedilol 12.5mg', 'Alpha and beta-blocker', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000000607', '00000000-0000-0000-0000-000000000005', 'Bisoprolol 5mg', 'Beta-blocker', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000000608', '00000000-0000-0000-0000-000000000005', 'Bisoprolol 10mg', 'Beta-blocker', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000000609', '00000000-0000-0000-0000-000000000005', 'Metoprolol 50mg', 'Beta-blocker', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000000610', '00000000-0000-0000-0000-000000000005', 'Metoprolol 100mg', 'Beta-blocker', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000000611', '00000000-0000-0000-0000-000000000005', 'Nebivolol 5mg', 'Beta-blocker', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000000612', '00000000-0000-0000-0000-000000000005', 'Nebivolol 10mg', 'Beta-blocker', false, true, now(), now()),

    -- Fes Pharma Industries (006) - 12 products
    ('00000000-0000-0000-0000-000000000701', '00000000-0000-0000-0000-000000000006', 'Gliclazide 80mg', 'Sulfonylurea antidiabetic', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000000702', '00000000-0000-0000-0000-000000000006', 'Gliclazide 30mg', 'Sulfonylurea antidiabetic', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000000703', '00000000-0000-0000-0000-000000000006', 'Glimepiride 2mg', 'Sulfonylurea antidiabetic', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000000704', '00000000-0000-0000-0000-000000000006', 'Glimepiride 4mg', 'Sulfonylurea antidiabetic', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000000705', '00000000-0000-0000-0000-000000000006', 'Pioglitazone 15mg', 'Thiazolidinedione antidiabetic', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000000706', '00000000-0000-0000-0000-000000000006', 'Pioglitazone 30mg', 'Thiazolidinedione antidiabetic', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000000707', '00000000-0000-0000-0000-000000000006', 'Sitagliptin 100mg', 'DPP-4 inhibitor', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000000708', '00000000-0000-0000-0000-000000000006', 'Sitagliptin 50mg', 'DPP-4 inhibitor', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000000709', '00000000-0000-0000-0000-000000000006', 'Insulin Aspart', 'Rapid-acting insulin', true, true, now(), now()),
    ('00000000-0000-0000-0000-000000000710', '00000000-0000-0000-0000-000000000006', 'Insulin Lispro', 'Rapid-acting insulin', true, true, now(), now()),
    ('00000000-0000-0000-0000-000000000711', '00000000-0000-0000-0000-000000000006', 'Insulin NPH', 'Intermediate-acting insulin', true, true, now(), now()),
    ('00000000-0000-0000-0000-000000000712', '00000000-0000-0000-0000-000000000006', 'Insulin Regular', 'Short-acting insulin', true, true, now(), now()),

    -- Meknes Pharma Industries (007) - 12 products
    ('00000000-0000-0000-0000-000000000801', '00000000-0000-0000-0000-000000000007', 'Montelukast 10mg', 'Leukotriene receptor antagonist', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000000802', '00000000-0000-0000-0000-000000000007', 'Montelukast 5mg', 'Leukotriene receptor antagonist', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000000803', '00000000-0000-0000-0000-000000000007', 'Budesonide Inhaler', 'Inhaled corticosteroid', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000000804', '00000000-0000-0000-0000-000000000007', 'Fluticasone Inhaler', 'Inhaled corticosteroid', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000000805', '00000000-0000-0000-0000-000000000007', 'Ipratropium Inhaler', 'Anticholinergic bronchodilator', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000000806', '00000000-0000-0000-0000-000000000007', 'Tiotropium Inhaler', 'Long-acting anticholinergic', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000000807', '00000000-0000-0000-0000-000000000007', 'Formoterol Inhaler', 'Long-acting beta-agonist', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000000808', '00000000-0000-0000-0000-000000000007', 'Salmeterol Inhaler', 'Long-acting beta-agonist', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000000809', '00000000-0000-0000-0000-000000000007', 'Theophylline 200mg', 'Methylxanthine bronchodilator', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000000810', '00000000-0000-0000-0000-000000000007', 'Theophylline 400mg', 'Methylxanthine bronchodilator', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000000811', '00000000-0000-0000-0000-000000000007', 'Prednisolone 5mg', 'Systemic corticosteroid', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000000812', '00000000-0000-0000-0000-000000000007', 'Prednisolone 20mg', 'Systemic corticosteroid', false, true, now(), now()),

    -- Oujda Pharma Industries (008) - 12 products
    ('00000000-0000-0000-0000-000000000901', '00000000-0000-0000-0000-000000000008', 'Diazepam 5mg', 'Benzodiazepine anxiolytic', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000000902', '00000000-0000-0000-0000-000000000008', 'Diazepam 10mg', 'Benzodiazepine anxiolytic', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000000903', '00000000-0000-0000-0000-000000000008', 'Lorazepam 1mg', 'Benzodiazepine anxiolytic', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000000904', '00000000-0000-0000-0000-000000000008', 'Lorazepam 2.5mg', 'Benzodiazepine anxiolytic', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000000905', '00000000-0000-0000-0000-000000000008', 'Alprazolam 0.5mg', 'Benzodiazepine anxiolytic', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000000906', '00000000-0000-0000-0000-000000000008', 'Alprazolam 1mg', 'Benzodiazepine anxiolytic', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000000907', '00000000-0000-0000-0000-000000000008', 'Sertraline 50mg', 'SSRI antidepressant', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000000908', '00000000-0000-0000-0000-000000000008', 'Sertraline 100mg', 'SSRI antidepressant', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000000909', '00000000-0000-0000-0000-000000000008', 'Fluoxetine 20mg', 'SSRI antidepressant', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000000910', '00000000-0000-0000-0000-000000000008', 'Fluoxetine 40mg', 'SSRI antidepressant', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000000911', '00000000-0000-0000-0000-000000000008', 'Amitriptyline 25mg', 'Tricyclic antidepressant', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000000912', '00000000-0000-0000-0000-000000000008', 'Amitriptyline 50mg', 'Tricyclic antidepressant', false, true, now(), now()),

    -- Kenitra Pharma Industries (009) - 12 products
    ('00000000-0000-0000-0000-000000001001', '00000000-0000-0000-0000-000000000009', 'Hydrochlorothiazide 25mg', 'Thiazide diuretic', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000001002', '00000000-0000-0000-0000-000000000009', 'Hydrochlorothiazide 12.5mg', 'Thiazide diuretic', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000001003', '00000000-0000-0000-0000-000000000009', 'Spironolactone 25mg', 'Potassium-sparing diuretic', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000001004', '00000000-0000-0000-0000-000000000009', 'Spironolactone 50mg', 'Potassium-sparing diuretic', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000001005', '00000000-0000-0000-0000-000000000009', 'Amiloride 5mg', 'Potassium-sparing diuretic', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000001006', '00000000-0000-0000-0000-000000000009', 'Triamterene 50mg', 'Potassium-sparing diuretic', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000001007', '00000000-0000-0000-0000-000000000009', 'Indapamide 2.5mg', 'Thiazide-like diuretic', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000001008', '00000000-0000-0000-0000-000000000009', 'Bumetanide 1mg', 'Loop diuretic', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000001009', '00000000-0000-0000-0000-000000000009', 'Torasemide 10mg', 'Loop diuretic', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000001010', '00000000-0000-0000-0000-000000000009', 'Mannitol 20%', 'Osmotic diuretic', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000001011', '00000000-0000-0000-0000-000000000009', 'Acetazolamide 250mg', 'Carbonic anhydrase inhibitor', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000001012', '00000000-0000-0000-0000-000000000009', 'Chlorthalidone 25mg', 'Thiazide-like diuretic', false, true, now(), now()),

    -- Tetouan Pharma Industries (010) - 12 products
    ('00000000-0000-0000-0000-000000001101', '00000000-0000-0000-0000-000000000010', 'Carbamazepine 200mg', 'Anticonvulsant', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000001102', '00000000-0000-0000-0000-000000000010', 'Carbamazepine 400mg', 'Anticonvulsant', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000001103', '00000000-0000-0000-0000-000000000010', 'Phenytoin 100mg', 'Anticonvulsant', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000001104', '00000000-0000-0000-0000-000000000010', 'Phenytoin 50mg', 'Anticonvulsant', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000001105', '00000000-0000-0000-0000-000000000010', 'Valproic Acid 500mg', 'Anticonvulsant', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000001106', '00000000-0000-0000-0000-000000000010', 'Valproic Acid 250mg', 'Anticonvulsant', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000001107', '00000000-0000-0000-0000-000000000010', 'Levetiracetam 500mg', 'Anticonvulsant', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000001108', '00000000-0000-0000-0000-000000000010', 'Levetiracetam 1000mg', 'Anticonvulsant', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000001109', '00000000-0000-0000-0000-000000000010', 'Lamotrigine 25mg', 'Anticonvulsant', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000001110', '00000000-0000-0000-0000-000000000010', 'Lamotrigine 100mg', 'Anticonvulsant', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000001111', '00000000-0000-0000-0000-000000000010', 'Topiramate 25mg', 'Anticonvulsant', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000001112', '00000000-0000-0000-0000-000000000010', 'Topiramate 100mg', 'Anticonvulsant', false, true, now(), now()),

    -- Safi Pharma Industries (011) - 12 products
    ('00000000-0000-0000-0000-000000001201', '00000000-0000-0000-0000-000000000011', 'Tramadol 50mg', 'Opioid analgesic', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000001202', '00000000-0000-0000-0000-000000000011', 'Tramadol 100mg', 'Opioid analgesic', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000001203', '00000000-0000-0000-0000-000000000011', 'Codeine 30mg', 'Opioid analgesic', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000001204', '00000000-0000-0000-0000-000000000011', 'Codeine 15mg', 'Opioid analgesic', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000001205', '00000000-0000-0000-0000-000000000011', 'Morphine 10mg', 'Opioid analgesic', true, true, now(), now()),
    ('00000000-0000-0000-0000-000000001206', '00000000-0000-0000-0000-000000000011', 'Morphine 5mg', 'Opioid analgesic', true, true, now(), now()),
    ('00000000-0000-0000-0000-000000001207', '00000000-0000-0000-0000-000000000011', 'Gabapentin 300mg', 'Anticonvulsant and analgesic', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000001208', '00000000-0000-0000-0000-000000000011', 'Gabapentin 600mg', 'Anticonvulsant and analgesic', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000001209', '00000000-0000-0000-0000-000000000011', 'Pregabalin 75mg', 'Anticonvulsant and analgesic', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000001210', '00000000-0000-0000-0000-000000000011', 'Pregabalin 150mg', 'Anticonvulsant and analgesic', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000001211', '00000000-0000-0000-0000-000000000011', 'Diclofenac 50mg', 'NSAID', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000001212', '00000000-0000-0000-0000-000000000011', 'Diclofenac 100mg', 'NSAID', false, true, now(), now())
ON CONFLICT (id) DO UPDATE SET
    company_id = EXCLUDED.company_id,
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    is_critical_medicine = EXCLUDED.is_critical_medicine,
    is_active = EXCLUDED.is_active,
    updated_at = now();

COMMIT;
