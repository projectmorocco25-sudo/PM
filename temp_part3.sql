-- Migration: seed_additional_rmm_skus_part3
-- Description: Seed SKUs for companies 006-008 (Fes, Meknes, Oujda) - 72 SKUs total
-- Date: 2026-01-24
-- Task: 1.1.3.6 (Seed Data Fixes)
-- Owner: Hassan (QA/Assurance Engineer)
-- Compliance: Deterministic IDs + idempotent UPSERTs

BEGIN;

INSERT INTO skus (
    id, product_id, sku_code, name, dosage_strength, dosage_form, pack_size, unit_of_measure, atc_code_id,
    is_moh_authorized_unregistered, is_active, created_at, updated_at
)
VALUES
    -- Fes Pharma Industries (006) - 24 SKUs
    -- Product 701: Gliclazide 80mg
    ('00000000-0000-0000-0000-000000001701', '00000000-0000-0000-0000-000000000701', 'SKU-GLI-80-001', 'Gliclazide 80mg Tablet', '80mg', 'Tablet', '30 tablets', 'tablets', '00000000-0000-0000-0000-000000000274', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000001702', '00000000-0000-0000-0000-000000000701', 'SKU-GLI-80-002', 'Gliclazide 80mg Tablet', '80mg', 'Tablet', '60 tablets', 'tablets', '00000000-0000-0000-0000-000000000274', false, true, now(), now()),
    -- Product 702: Gliclazide 30mg
    ('00000000-0000-0000-0000-000000001703', '00000000-0000-0000-0000-000000000702', 'SKU-GLI-30-001', 'Gliclazide 30mg Tablet', '30mg', 'Tablet', '30 tablets', 'tablets', '00000000-0000-0000-0000-000000000275', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000001704', '00000000-0000-0000-0000-000000000702', 'SKU-GLI-30-002', 'Gliclazide 30mg Tablet', '30mg', 'Tablet', '60 tablets', 'tablets', '00000000-0000-0000-0000-000000000275', false, true, now(), now()),
    -- Product 703: Glimepiride 2mg
    ('00000000-0000-0000-0000-000000001705', '00000000-0000-0000-0000-000000000703', 'SKU-GLM-2-001', 'Glimepiride 2mg Tablet', '2mg', 'Tablet', '30 tablets', 'tablets', '00000000-0000-0000-0000-000000000276', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000001706', '00000000-0000-0000-0000-000000000703', 'SKU-GLM-2-002', 'Glimepiride 2mg Tablet', '2mg', 'Tablet', '60 tablets', 'tablets', '00000000-0000-0000-0000-000000000276', false, true, now(), now()),
    -- Product 704: Glimepiride 4mg
    ('00000000-0000-0000-0000-000000001707', '00000000-0000-0000-0000-000000000704', 'SKU-GLM-4-001', 'Glimepiride 4mg Tablet', '4mg', 'Tablet', '30 tablets', 'tablets', '00000000-0000-0000-0000-000000000277', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000001708', '00000000-0000-0000-0000-000000000704', 'SKU-GLM-4-002', 'Glimepiride 4mg Tablet', '4mg', 'Tablet', '60 tablets', 'tablets', '00000000-0000-0000-0000-000000000277', false, true, now(), now()),
    -- Product 705: Pioglitazone 15mg
    ('00000000-0000-0000-0000-000000001709', '00000000-0000-0000-0000-000000000705', 'SKU-PIO-15-001', 'Pioglitazone 15mg Tablet', '15mg', 'Tablet', '30 tablets', 'tablets', '00000000-0000-0000-0000-000000000278', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000001710', '00000000-0000-0000-0000-000000000705', 'SKU-PIO-15-002', 'Pioglitazone 15mg Tablet', '15mg', 'Tablet', '60 tablets', 'tablets', '00000000-0000-0000-0000-000000000278', false, true, now(), now()),
    -- Product 706: Pioglitazone 30mg
    ('00000000-0000-0000-0000-000000001711', '00000000-0000-0000-0000-000000000706', 'SKU-PIO-30-001', 'Pioglitazone 30mg Tablet', '30mg', 'Tablet', '30 tablets', 'tablets', '00000000-0000-0000-0000-000000000279', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000001712', '00000000-0000-0000-0000-000000000706', 'SKU-PIO-30-002', 'Pioglitazone 30mg Tablet', '30mg', 'Tablet', '60 tablets', 'tablets', '00000000-0000-0000-0000-000000000279', false, true, now(), now()),
    -- Product 707: Sitagliptin 100mg
    ('00000000-0000-0000-0000-000000001713', '00000000-0000-0000-0000-000000000707', 'SKU-SIT-100-001', 'Sitagliptin 100mg Tablet', '100mg', 'Tablet', '30 tablets', 'tablets', '00000000-0000-0000-0000-000000000280', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000001714', '00000000-0000-0000-0000-000000000707', 'SKU-SIT-100-002', 'Sitagliptin 100mg Tablet', '100mg', 'Tablet', '60 tablets', 'tablets', '00000000-0000-0000-0000-000000000280', false, true, now(), now()),
    -- Product 708: Sitagliptin 50mg
    ('00000000-0000-0000-0000-000000001715', '00000000-0000-0000-0000-000000000708', 'SKU-SIT-50-001', 'Sitagliptin 50mg Tablet', '50mg', 'Tablet', '30 tablets', 'tablets', '00000000-0000-0000-0000-000000000281', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000001716', '00000000-0000-0000-0000-000000000708', 'SKU-SIT-50-002', 'Sitagliptin 50mg Tablet', '50mg', 'Tablet', '60 tablets', 'tablets', '00000000-0000-0000-0000-000000000281', false, true, now(), now()),
    -- Product 709: Insulin Aspart
    ('00000000-0000-0000-0000-000000001717', '00000000-0000-0000-0000-000000000709', 'SKU-INS-ASP-001', 'Insulin Aspart 100IU/ml', '100IU/ml', 'Injection', '10ml vial', 'vials', '00000000-0000-0000-0000-000000000282', true, true, now(), now()),
    ('00000000-0000-0000-0000-000000001718', '00000000-0000-0000-0000-000000000709', 'SKU-INS-ASP-002', 'Insulin Aspart 100IU/ml', '100IU/ml', 'Injection', '3ml pen', 'pens', '00000000-0000-0000-0000-000000000282', true, true, now(), now()),
    -- Product 710: Insulin Lispro
    ('00000000-0000-0000-0000-000000001719', '00000000-0000-0000-0000-000000000710', 'SKU-INS-LIS-001', 'Insulin Lispro 100IU/ml', '100IU/ml', 'Injection', '10ml vial', 'vials', '00000000-0000-0000-0000-000000000283', true, true, now(), now()),
    ('00000000-0000-0000-0000-000000001720', '00000000-0000-0000-0000-000000000710', 'SKU-INS-LIS-002', 'Insulin Lispro 100IU/ml', '100IU/ml', 'Injection', '3ml pen', 'pens', '00000000-0000-0000-0000-000000000283', true, true, now(), now()),
    -- Product 711: Insulin NPH
    ('00000000-0000-0000-0000-000000001721', '00000000-0000-0000-0000-000000000711', 'SKU-INS-NPH-001', 'Insulin NPH 100IU/ml', '100IU/ml', 'Injection', '10ml vial', 'vials', '00000000-0000-0000-0000-000000000284', true, true, now(), now()),
    ('00000000-0000-0000-0000-000000001722', '00000000-0000-0000-0000-000000000711', 'SKU-INS-NPH-002', 'Insulin NPH 100IU/ml', '100IU/ml', 'Injection', '3ml pen', 'pens', '00000000-0000-0000-0000-000000000284', true, true, now(), now()),
    -- Product 712: Insulin Regular
    ('00000000-0000-0000-0000-000000001723', '00000000-0000-0000-0000-000000000712', 'SKU-INS-REG-001', 'Insulin Regular 100IU/ml', '100IU/ml', 'Injection', '10ml vial', 'vials', '00000000-0000-0000-0000-000000000285', true, true, now(), now()),
    ('00000000-0000-0000-0000-000000001724', '00000000-0000-0000-0000-000000000712', 'SKU-INS-REG-002', 'Insulin Regular 100IU/ml', '100IU/ml', 'Injection', '3ml pen', 'pens', '00000000-0000-0000-0000-000000000285', true, true, now(), now()),

    -- Meknes Pharma Industries (007) - 24 SKUs
    -- Product 801: Montelukast 10mg
    ('00000000-0000-0000-0000-000000001801', '00000000-0000-0000-0000-000000000801', 'SKU-MON-10-001', 'Montelukast 10mg Tablet', '10mg', 'Tablet', '30 tablets', 'tablets', '00000000-0000-0000-0000-000000000286', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000001802', '00000000-0000-0000-0000-000000000801', 'SKU-MON-10-002', 'Montelukast 10mg Tablet', '10mg', 'Tablet', '60 tablets', 'tablets', '00000000-0000-0000-0000-000000000286', false, true, now(), now()),
    -- Product 802: Montelukast 5mg
    ('00000000-0000-0000-0000-000000001803', '00000000-0000-0000-0000-000000000802', 'SKU-MON-5-001', 'Montelukast 5mg Tablet', '5mg', 'Tablet', '30 tablets', 'tablets', '00000000-0000-0000-0000-000000000287', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000001804', '00000000-0000-0000-0000-000000000802', 'SKU-MON-5-002', 'Montelukast 5mg Tablet', '5mg', 'Tablet', '60 tablets', 'tablets', '00000000-0000-0000-0000-000000000287', false, true, now(), now()),
    -- Product 803: Budesonide Inhaler
    ('00000000-0000-0000-0000-000000001805', '00000000-0000-0000-0000-000000000803', 'SKU-BUD-200-001', 'Budesonide 200mcg Inhaler', '200mcg', 'Inhaler', '200 doses', 'inhalers', '00000000-0000-0000-0000-000000000288', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000001806', '00000000-0000-0000-0000-000000000803', 'SKU-BUD-200-002', 'Budesonide 200mcg Inhaler', '200mcg', 'Inhaler', '400 doses', 'inhalers', '00000000-0000-0000-0000-000000000288', false, true, now(), now()),
    -- Product 804: Fluticasone Inhaler
    ('00000000-0000-0000-0000-000000001807', '00000000-0000-0000-0000-000000000804', 'SKU-FLU-250-001', 'Fluticasone 250mcg Inhaler', '250mcg', 'Inhaler', '200 doses', 'inhalers', '00000000-0000-0000-0000-000000000289', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000001808', '00000000-0000-0000-0000-000000000804', 'SKU-FLU-250-002', 'Fluticasone 250mcg Inhaler', '250mcg', 'Inhaler', '400 doses', 'inhalers', '00000000-0000-0000-0000-000000000289', false, true, now(), now()),
    -- Product 805: Ipratropium Inhaler
    ('00000000-0000-0000-0000-000000001809', '00000000-0000-0000-0000-000000000805', 'SKU-IPR-20-001', 'Ipratropium 20mcg Inhaler', '20mcg', 'Inhaler', '200 doses', 'inhalers', '00000000-0000-0000-0000-000000000290', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000001810', '00000000-0000-0000-0000-000000000805', 'SKU-IPR-20-002', 'Ipratropium 20mcg Inhaler', '20mcg', 'Inhaler', '400 doses', 'inhalers', '00000000-0000-0000-0000-000000000290', false, true, now(), now()),
    -- Product 806: Tiotropium Inhaler
    ('00000000-0000-0000-0000-000000001811', '00000000-0000-0000-0000-000000000806', 'SKU-TIO-18-001', 'Tiotropium 18mcg Inhaler', '18mcg', 'Inhaler', '30 doses', 'inhalers', '00000000-0000-0000-0000-000000000291', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000001812', '00000000-0000-0000-0000-000000000806', 'SKU-TIO-18-002', 'Tiotropium 18mcg Inhaler', '18mcg', 'Inhaler', '60 doses', 'inhalers', '00000000-0000-0000-0000-000000000291', false, true, now(), now()),
    -- Product 807: Formoterol Inhaler
    ('00000000-0000-0000-0000-000000001813', '00000000-0000-0000-0000-000000000807', 'SKU-FOR-12-001', 'Formoterol 12mcg Inhaler', '12mcg', 'Inhaler', '120 doses', 'inhalers', '00000000-0000-0000-0000-000000000292', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000001814', '00000000-0000-0000-0000-000000000807', 'SKU-FOR-12-002', 'Formoterol 12mcg Inhaler', '12mcg', 'Inhaler', '240 doses', 'inhalers', '00000000-0000-0000-0000-000000000292', false, true, now(), now()),
    -- Product 808: Salmeterol Inhaler
    ('00000000-0000-0000-0000-000000001815', '00000000-0000-0000-0000-000000000808', 'SKU-SAL-50-001', 'Salmeterol 50mcg Inhaler', '50mcg', 'Inhaler', '120 doses', 'inhalers', '00000000-0000-0000-0000-000000000293', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000001816', '00000000-0000-0000-0000-000000000808', 'SKU-SAL-50-002', 'Salmeterol 50mcg Inhaler', '50mcg', 'Inhaler', '240 doses', 'inhalers', '00000000-0000-0000-0000-000000000293', false, true, now(), now()),
    -- Product 809: Theophylline 200mg
    ('00000000-0000-0000-0000-000000001817', '00000000-0000-0000-0000-000000000809', 'SKU-THE-200-001', 'Theophylline 200mg Tablet', '200mg', 'Tablet', '30 tablets', 'tablets', '00000000-0000-0000-0000-000000000294', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000001818', '00000000-0000-0000-0000-000000000809', 'SKU-THE-200-002', 'Theophylline 200mg Tablet', '200mg', 'Tablet', '60 tablets', 'tablets', '00000000-0000-0000-0000-000000000294', false, true, now(), now()),
    -- Product 810: Theophylline 400mg
    ('00000000-0000-0000-0000-000000001819', '00000000-0000-0000-0000-000000000810', 'SKU-THE-400-001', 'Theophylline 400mg Tablet', '400mg', 'Tablet', '30 tablets', 'tablets', '00000000-0000-0000-0000-000000000295', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000001820', '00000000-0000-0000-0000-000000000810', 'SKU-THE-400-002', 'Theophylline 400mg Tablet', '400mg', 'Tablet', '60 tablets', 'tablets', '00000000-0000-0000-0000-000000000295', false, true, now(), now()),
    -- Product 811: Prednisolone 5mg
    ('00000000-0000-0000-0000-000000001821', '00000000-0000-0000-0000-000000000811', 'SKU-PRE-5-001', 'Prednisolone 5mg Tablet', '5mg', 'Tablet', '30 tablets', 'tablets', '00000000-0000-0000-0000-000000000296', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000001822', '00000000-0000-0000-0000-000000000811', 'SKU-PRE-5-002', 'Prednisolone 5mg Tablet', '5mg', 'Tablet', '60 tablets', 'tablets', '00000000-0000-0000-0000-000000000296', false, true, now(), now()),
    -- Product 812: Prednisolone 20mg
    ('00000000-0000-0000-0000-000000001823', '00000000-0000-0000-0000-000000000812', 'SKU-PRE-20-001', 'Prednisolone 20mg Tablet', '20mg', 'Tablet', '30 tablets', 'tablets', '00000000-0000-0000-0000-000000000297', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000001824', '00000000-0000-0000-0000-000000000812', 'SKU-PRE-20-002', 'Prednisolone 20mg Tablet', '20mg', 'Tablet', '60 tablets', 'tablets', '00000000-0000-0000-0000-000000000297', false, true, now(), now()),

    -- Oujda Pharma Industries (008) - 24 SKUs
    -- Product 901: Diazepam 5mg
    ('00000000-0000-0000-0000-000000001901', '00000000-0000-0000-0000-000000000901', 'SKU-DIA-5-001', 'Diazepam 5mg Tablet', '5mg', 'Tablet', '30 tablets', 'tablets', '00000000-0000-0000-0000-000000000298', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000001902', '00000000-0000-0000-0000-000000000901', 'SKU-DIA-5-002', 'Diazepam 5mg Tablet', '5mg', 'Tablet', '60 tablets', 'tablets', '00000000-0000-0000-0000-000000000298', false, true, now(), now()),
    -- Product 902: Diazepam 10mg
    ('00000000-0000-0000-0000-000000001903', '00000000-0000-0000-0000-000000000902', 'SKU-DIA-10-001', 'Diazepam 10mg Tablet', '10mg', 'Tablet', '30 tablets', 'tablets', '00000000-0000-0000-0000-000000000299', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000001904', '00000000-0000-0000-0000-000000000902', 'SKU-DIA-10-002', 'Diazepam 10mg Tablet', '10mg', 'Tablet', '60 tablets', 'tablets', '00000000-0000-0000-0000-000000000299', false, true, now(), now()),
    -- Product 903: Lorazepam 1mg
    ('00000000-0000-0000-0000-000000001905', '00000000-0000-0000-0000-000000000903', 'SKU-LOR-1-001', 'Lorazepam 1mg Tablet', '1mg', 'Tablet', '30 tablets', 'tablets', '00000000-0000-0000-0000-000000000300', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000001906', '00000000-0000-0000-0000-000000000903', 'SKU-LOR-1-002', 'Lorazepam 1mg Tablet', '1mg', 'Tablet', '60 tablets', 'tablets', '00000000-0000-0000-0000-000000000300', false, true, now(), now()),
    -- Product 904: Lorazepam 2.5mg
    ('00000000-0000-0000-0000-000000001907', '00000000-0000-0000-0000-000000000904', 'SKU-LOR-2.5-001', 'Lorazepam 2.5mg Tablet', '2.5mg', 'Tablet', '30 tablets', 'tablets', '00000000-0000-0000-0000-000000000301', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000001908', '00000000-0000-0000-0000-000000000904', 'SKU-LOR-2.5-002', 'Lorazepam 2.5mg Tablet', '2.5mg', 'Tablet', '60 tablets', 'tablets', '00000000-0000-0000-0000-000000000301', false, true, now(), now()),
    -- Product 905: Alprazolam 0.5mg
    ('00000000-0000-0000-0000-000000001909', '00000000-0000-0000-0000-000000000905', 'SKU-ALP-0.5-001', 'Alprazolam 0.5mg Tablet', '0.5mg', 'Tablet', '30 tablets', 'tablets', '00000000-0000-0000-0000-000000000302', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000001910', '00000000-0000-0000-0000-000000000905', 'SKU-ALP-0.5-002', 'Alprazolam 0.5mg Tablet', '0.5mg', 'Tablet', '60 tablets', 'tablets', '00000000-0000-0000-0000-000000000302', false, true, now(), now()),
    -- Product 906: Alprazolam 1mg
    ('00000000-0000-0000-0000-000000001911', '00000000-0000-0000-0000-000000000906', 'SKU-ALP-1-001', 'Alprazolam 1mg Tablet', '1mg', 'Tablet', '30 tablets', 'tablets', '00000000-0000-0000-0000-000000000303', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000001912', '00000000-0000-0000-0000-000000000906', 'SKU-ALP-1-002', 'Alprazolam 1mg Tablet', '1mg', 'Tablet', '60 tablets', 'tablets', '00000000-0000-0000-0000-000000000303', false, true, now(), now()),
    -- Product 907: Sertraline 50mg
    ('00000000-0000-0000-0000-000000001913', '00000000-0000-0000-0000-000000000907', 'SKU-SER-50-001', 'Sertraline 50mg Tablet', '50mg', 'Tablet', '30 tablets', 'tablets', '00000000-0000-0000-0000-000000000304', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000001914', '00000000-0000-0000-0000-000000000907', 'SKU-SER-50-002', 'Sertraline 50mg Tablet', '50mg', 'Tablet', '60 tablets', 'tablets', '00000000-0000-0000-0000-000000000304', false, true, now(), now()),
    -- Product 908: Sertraline 100mg
    ('00000000-0000-0000-0000-000000001915', '00000000-0000-0000-0000-000000000908', 'SKU-SER-100-001', 'Sertraline 100mg Tablet', '100mg', 'Tablet', '30 tablets', 'tablets', '00000000-0000-0000-0000-000000000305', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000001916', '00000000-0000-0000-0000-000000000908', 'SKU-SER-100-002', 'Sertraline 100mg Tablet', '100mg', 'Tablet', '60 tablets', 'tablets', '00000000-0000-0000-0000-000000000305', false, true, now(), now()),
    -- Product 909: Fluoxetine 20mg
    ('00000000-0000-0000-0000-000000001917', '00000000-0000-0000-0000-000000000909', 'SKU-FLU-20-001', 'Fluoxetine 20mg Capsule', '20mg', 'Capsule', '30 capsules', 'capsules', '00000000-0000-0000-0000-000000000256', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000001918', '00000000-0000-0000-0000-000000000909', 'SKU-FLU-20-002', 'Fluoxetine 20mg Capsule', '20mg', 'Capsule', '60 capsules', 'capsules', '00000000-0000-0000-0000-000000000256', false, true, now(), now()),
    -- Product 910: Fluoxetine 40mg
    ('00000000-0000-0000-0000-000000001919', '00000000-0000-0000-0000-000000000910', 'SKU-FLU-40-001', 'Fluoxetine 40mg Capsule', '40mg', 'Capsule', '30 capsules', 'capsules', '00000000-0000-0000-0000-000000000257', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000001920', '00000000-0000-0000-0000-000000000910', 'SKU-FLU-40-002', 'Fluoxetine 40mg Capsule', '40mg', 'Capsule', '60 capsules', 'capsules', '00000000-0000-0000-0000-000000000257', false, true, now(), now()),
    -- Product 911: Amitriptyline 25mg
    ('00000000-0000-0000-0000-000000001921', '00000000-0000-0000-0000-000000000911', 'SKU-AMI-25-001', 'Amitriptyline 25mg Tablet', '25mg', 'Tablet', '30 tablets', 'tablets', '00000000-0000-0000-0000-000000000258', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000001922', '00000000-0000-0000-0000-000000000911', 'SKU-AMI-25-002', 'Amitriptyline 25mg Tablet', '25mg', 'Tablet', '60 tablets', 'tablets', '00000000-0000-0000-0000-000000000258', false, true, now(), now()),
    -- Product 912: Amitriptyline 50mg
    ('00000000-0000-0000-0000-000000001923', '00000000-0000-0000-0000-000000000912', 'SKU-AMI-50-001', 'Amitriptyline 50mg Tablet', '50mg', 'Tablet', '30 tablets', 'tablets', '00000000-0000-0000-0000-000000000259', false, true, now(), now()),
    ('00000000-0000-0000-0000-000000001924', '00000000-0000-0000-0000-000000000912', 'SKU-AMI-50-002', 'Amitriptyline 50mg Tablet', '50mg', 'Tablet', '60 tablets', 'tablets', '00000000-0000-0000-0000-000000000259', false, true, now(), now())
ON CONFLICT (id) DO UPDATE SET
    product_id = EXCLUDED.product_id,
    sku_code = EXCLUDED.sku_code,
    name = EXCLUDED.name,
    dosage_strength = EXCLUDED.dosage_strength,
    dosage_form = EXCLUDED.dosage_form,
    pack_size = EXCLUDED.pack_size,
    unit_of_measure = EXCLUDED.unit_of_measure,
    atc_code_id = EXCLUDED.atc_code_id,
    is_moh_authorized_unregistered = EXCLUDED.is_moh_authorized_unregistered,
    is_active = EXCLUDED.is_active,
    updated_at = now();

COMMIT;

