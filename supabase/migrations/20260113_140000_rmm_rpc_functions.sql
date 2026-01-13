-- ============================================================================
-- Task 1.1.2.1 - 1.1.2.15b: RMM RPC Functions
-- Registry Master Management backend functions
-- ============================================================================

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

-- Task 1.1.2.15b: RBAC Permission Checking
CREATE OR REPLACE FUNCTION public.rmm_check_permission(
  p_user_id UUID,
  p_action TEXT,
  p_entity_type TEXT,
  p_company_id UUID DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_role TEXT;
  v_user_company_id UUID;
BEGIN
  -- Get user role and company
  SELECT role, company_id INTO v_user_role, v_user_company_id
  FROM users WHERE id = p_user_id;
  
  IF v_user_role IS NULL THEN
    RETURN FALSE;
  END IF;
  
  -- MOH Tier 1 has full access
  IF v_user_role = 'tier1' THEN
    RETURN TRUE;
  END IF;
  
  -- MOH Tier 2 officers/registrars
  IF v_user_role IN ('tier2_officer', 'tier2_registrar') THEN
    -- Can read all, can manage registry submissions
    IF p_action IN ('read', 'verify', 'implement', 'peer_review') THEN
      RETURN TRUE;
    END IF;
    -- Cannot create/update companies or products directly
    IF p_action IN ('create', 'update') AND p_entity_type IN ('company', 'product', 'sku') THEN
      RETURN FALSE;
    END IF;
    RETURN TRUE;
  END IF;
  
  -- Company users
  IF v_user_role IN ('company_admin', 'company_manager', 'company_user') THEN
    -- Must have matching company
    IF p_company_id IS NOT NULL AND v_user_company_id != p_company_id THEN
      RETURN FALSE;
    END IF;
    
    -- Can read own company data
    IF p_action = 'read' THEN
      RETURN TRUE;
    END IF;
    
    -- Admins can create/update for own company
    IF v_user_role = 'company_admin' AND p_action IN ('create', 'update', 'submit') THEN
      RETURN TRUE;
    END IF;
    
    -- Managers can submit
    IF v_user_role = 'company_manager' AND p_action = 'submit' THEN
      RETURN TRUE;
    END IF;
    
    RETURN FALSE;
  END IF;
  
  RETURN FALSE;
END;
$$;

-- ============================================================================
-- Task 1.1.2.1: Company CRUD Functions
-- ============================================================================

-- Create Company
CREATE OR REPLACE FUNCTION public.rmm_create_company(
  p_name TEXT,
  p_registration_number TEXT,
  p_company_type TEXT,
  p_address TEXT DEFAULT NULL,
  p_contact_email TEXT DEFAULT NULL,
  p_contact_phone TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
  v_company_id UUID;
BEGIN
  v_user_id := auth.uid();
  
  -- Check permission (MOH only can create companies)
  IF NOT rmm_check_permission(v_user_id, 'create', 'company', NULL) THEN
    RETURN jsonb_build_object('success', false, 'error', 'Insufficient permissions');
  END IF;
  
  -- Validate required fields
  IF p_name IS NULL OR p_registration_number IS NULL OR p_company_type IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Name, registration number, and company type are required');
  END IF;
  
  -- Validate company type
  IF p_company_type NOT IN ('ipc', 'wholesaler') THEN
    RETURN jsonb_build_object('success', false, 'error', 'Company type must be ipc or wholesaler');
  END IF;
  
  -- Check for duplicate registration number
  IF EXISTS (SELECT 1 FROM companies WHERE registration_number = p_registration_number) THEN
    RETURN jsonb_build_object('success', false, 'error', 'Registration number already exists');
  END IF;
  
  -- Insert company
  INSERT INTO companies (
    name, registration_number, company_type, address, contact_email, contact_phone, is_active
  ) VALUES (
    p_name, p_registration_number, p_company_type, p_address, p_contact_email, p_contact_phone, true
  )
  RETURNING id INTO v_company_id;
  
  -- Create audit log
  PERFORM shared_create_audit_log(
    v_user_id, 'CREATE', 'companies', v_company_id,
    jsonb_build_object('name', p_name, 'type', p_company_type)
  );
  
  RETURN jsonb_build_object(
    'success', true,
    'company_id', v_company_id,
    'message', 'Company created successfully'
  );
END;
$$;

-- Update Company
CREATE OR REPLACE FUNCTION public.rmm_update_company(
  p_company_id UUID,
  p_name TEXT DEFAULT NULL,
  p_address TEXT DEFAULT NULL,
  p_contact_email TEXT DEFAULT NULL,
  p_contact_phone TEXT DEFAULT NULL,
  p_is_active BOOLEAN DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
  v_old_record RECORD;
BEGIN
  v_user_id := auth.uid();
  
  -- Get current record
  SELECT * INTO v_old_record FROM companies WHERE id = p_company_id;
  
  IF v_old_record.id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Company not found');
  END IF;
  
  -- Check permission
  IF NOT rmm_check_permission(v_user_id, 'update', 'company', p_company_id) THEN
    RETURN jsonb_build_object('success', false, 'error', 'Insufficient permissions');
  END IF;
  
  -- Update company
  UPDATE companies SET
    name = COALESCE(p_name, name),
    address = COALESCE(p_address, address),
    contact_email = COALESCE(p_contact_email, contact_email),
    contact_phone = COALESCE(p_contact_phone, contact_phone),
    is_active = COALESCE(p_is_active, is_active),
    updated_at = NOW()
  WHERE id = p_company_id;
  
  -- Create audit log
  PERFORM shared_create_audit_log(
    v_user_id, 'UPDATE', 'companies', p_company_id,
    jsonb_build_object('changes', jsonb_build_object(
      'name', p_name, 'is_active', p_is_active
    ))
  );
  
  RETURN jsonb_build_object(
    'success', true,
    'company_id', p_company_id,
    'message', 'Company updated successfully'
  );
END;
$$;

-- Get Company
CREATE OR REPLACE FUNCTION public.rmm_get_company(p_company_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
  v_company RECORD;
BEGIN
  v_user_id := auth.uid();
  
  -- Check permission
  IF NOT rmm_check_permission(v_user_id, 'read', 'company', p_company_id) THEN
    RETURN jsonb_build_object('success', false, 'error', 'Insufficient permissions');
  END IF;
  
  SELECT * INTO v_company FROM companies WHERE id = p_company_id;
  
  IF v_company.id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Company not found');
  END IF;
  
  RETURN jsonb_build_object(
    'success', true,
    'company', row_to_json(v_company)::jsonb
  );
END;
$$;

-- List Companies
CREATE OR REPLACE FUNCTION public.rmm_list_companies(
  p_company_type TEXT DEFAULT NULL,
  p_is_active BOOLEAN DEFAULT NULL,
  p_search TEXT DEFAULT NULL,
  p_limit INTEGER DEFAULT 50,
  p_offset INTEGER DEFAULT 0
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
  v_user_role TEXT;
  v_user_company_id UUID;
  v_result JSONB;
  v_total INTEGER;
BEGIN
  v_user_id := auth.uid();
  SELECT role, company_id INTO v_user_role, v_user_company_id FROM users WHERE id = v_user_id;
  
  -- Build query
  WITH filtered AS (
    SELECT *
    FROM companies c
    WHERE (p_company_type IS NULL OR c.company_type = p_company_type)
      AND (p_is_active IS NULL OR c.is_active = p_is_active)
      AND (p_search IS NULL OR c.name ILIKE '%' || p_search || '%' OR c.registration_number ILIKE '%' || p_search || '%')
      AND (v_user_role IN ('tier1', 'tier2_officer', 'tier2_registrar') OR c.id = v_user_company_id)
    ORDER BY c.name
    LIMIT p_limit OFFSET p_offset
  )
  SELECT jsonb_agg(row_to_json(filtered)::jsonb) INTO v_result FROM filtered;
  
  -- Get total count
  SELECT COUNT(*) INTO v_total
  FROM companies c
  WHERE (p_company_type IS NULL OR c.company_type = p_company_type)
    AND (p_is_active IS NULL OR c.is_active = p_is_active)
    AND (p_search IS NULL OR c.name ILIKE '%' || p_search || '%' OR c.registration_number ILIKE '%' || p_search || '%')
    AND (v_user_role IN ('tier1', 'tier2_officer', 'tier2_registrar') OR c.id = v_user_company_id);
  
  RETURN jsonb_build_object(
    'success', true,
    'companies', COALESCE(v_result, '[]'::jsonb),
    'total', v_total,
    'limit', p_limit,
    'offset', p_offset
  );
END;
$$;

-- ============================================================================
-- Task 1.1.2.2: Product CRUD Functions
-- ============================================================================

-- Create Product
CREATE OR REPLACE FUNCTION public.rmm_create_product(
  p_company_id UUID,
  p_name TEXT,
  p_description TEXT DEFAULT NULL,
  p_is_critical_medicine BOOLEAN DEFAULT FALSE
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
  v_product_id UUID;
BEGIN
  v_user_id := auth.uid();
  
  -- Check permission
  IF NOT rmm_check_permission(v_user_id, 'create', 'product', p_company_id) THEN
    RETURN jsonb_build_object('success', false, 'error', 'Insufficient permissions');
  END IF;
  
  -- Validate company exists
  IF NOT EXISTS (SELECT 1 FROM companies WHERE id = p_company_id AND is_active = true) THEN
    RETURN jsonb_build_object('success', false, 'error', 'Company not found or inactive');
  END IF;
  
  -- Insert product
  INSERT INTO products (company_id, name, description, is_critical_medicine, is_active)
  VALUES (p_company_id, p_name, p_description, p_is_critical_medicine, true)
  RETURNING id INTO v_product_id;
  
  -- Create audit log
  PERFORM shared_create_audit_log(
    v_user_id, 'CREATE', 'products', v_product_id,
    jsonb_build_object('name', p_name, 'company_id', p_company_id)
  );
  
  RETURN jsonb_build_object(
    'success', true,
    'product_id', v_product_id,
    'message', 'Product created successfully'
  );
END;
$$;

-- Update Product
CREATE OR REPLACE FUNCTION public.rmm_update_product(
  p_product_id UUID,
  p_name TEXT DEFAULT NULL,
  p_description TEXT DEFAULT NULL,
  p_is_critical_medicine BOOLEAN DEFAULT NULL,
  p_is_active BOOLEAN DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
  v_product RECORD;
BEGIN
  v_user_id := auth.uid();
  
  SELECT * INTO v_product FROM products WHERE id = p_product_id;
  
  IF v_product.id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Product not found');
  END IF;
  
  IF NOT rmm_check_permission(v_user_id, 'update', 'product', v_product.company_id) THEN
    RETURN jsonb_build_object('success', false, 'error', 'Insufficient permissions');
  END IF;
  
  UPDATE products SET
    name = COALESCE(p_name, name),
    description = COALESCE(p_description, description),
    is_critical_medicine = COALESCE(p_is_critical_medicine, is_critical_medicine),
    is_active = COALESCE(p_is_active, is_active),
    updated_at = NOW()
  WHERE id = p_product_id;
  
  PERFORM shared_create_audit_log(
    v_user_id, 'UPDATE', 'products', p_product_id,
    jsonb_build_object('changes', jsonb_build_object('name', p_name, 'is_active', p_is_active))
  );
  
  RETURN jsonb_build_object('success', true, 'product_id', p_product_id, 'message', 'Product updated');
END;
$$;

-- Get Product
CREATE OR REPLACE FUNCTION public.rmm_get_product(p_product_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
  v_product RECORD;
BEGIN
  v_user_id := auth.uid();
  
  SELECT p.*, c.name as company_name 
  INTO v_product 
  FROM products p
  JOIN companies c ON c.id = p.company_id
  WHERE p.id = p_product_id;
  
  IF v_product.id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Product not found');
  END IF;
  
  IF NOT rmm_check_permission(v_user_id, 'read', 'product', v_product.company_id) THEN
    RETURN jsonb_build_object('success', false, 'error', 'Insufficient permissions');
  END IF;
  
  RETURN jsonb_build_object('success', true, 'product', row_to_json(v_product)::jsonb);
END;
$$;

-- List Products
CREATE OR REPLACE FUNCTION public.rmm_list_products(
  p_company_id UUID DEFAULT NULL,
  p_is_active BOOLEAN DEFAULT NULL,
  p_is_critical_medicine BOOLEAN DEFAULT NULL,
  p_search TEXT DEFAULT NULL,
  p_limit INTEGER DEFAULT 50,
  p_offset INTEGER DEFAULT 0
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
  v_user_role TEXT;
  v_user_company_id UUID;
  v_result JSONB;
  v_total INTEGER;
BEGIN
  v_user_id := auth.uid();
  SELECT role, company_id INTO v_user_role, v_user_company_id FROM users WHERE id = v_user_id;
  
  WITH filtered AS (
    SELECT p.*, c.name as company_name
    FROM products p
    JOIN companies c ON c.id = p.company_id
    WHERE (p_company_id IS NULL OR p.company_id = p_company_id)
      AND (p_is_active IS NULL OR p.is_active = p_is_active)
      AND (p_is_critical_medicine IS NULL OR p.is_critical_medicine = p_is_critical_medicine)
      AND (p_search IS NULL OR p.name ILIKE '%' || p_search || '%')
      AND (v_user_role IN ('tier1', 'tier2_officer', 'tier2_registrar') OR p.company_id = v_user_company_id)
    ORDER BY p.name
    LIMIT p_limit OFFSET p_offset
  )
  SELECT jsonb_agg(row_to_json(filtered)::jsonb) INTO v_result FROM filtered;
  
  SELECT COUNT(*) INTO v_total
  FROM products p
  WHERE (p_company_id IS NULL OR p.company_id = p_company_id)
    AND (p_is_active IS NULL OR p.is_active = p_is_active)
    AND (p_is_critical_medicine IS NULL OR p.is_critical_medicine = p_is_critical_medicine)
    AND (p_search IS NULL OR p.name ILIKE '%' || p_search || '%')
    AND (v_user_role IN ('tier1', 'tier2_officer', 'tier2_registrar') OR p.company_id = v_user_company_id);
  
  RETURN jsonb_build_object(
    'success', true,
    'products', COALESCE(v_result, '[]'::jsonb),
    'total', v_total
  );
END;
$$;

-- ============================================================================
-- Task 1.1.2.3: SKU CRUD Functions
-- ============================================================================

-- Create SKU
CREATE OR REPLACE FUNCTION public.rmm_create_sku(
  p_product_id UUID,
  p_sku_code TEXT,
  p_name TEXT,
  p_dosage_strength TEXT,
  p_dosage_form TEXT,
  p_pack_size TEXT,
  p_unit_of_measure TEXT,
  p_atc_code_id UUID DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
  v_product RECORD;
  v_sku_id UUID;
BEGIN
  v_user_id := auth.uid();
  
  SELECT p.*, c.id as company_id FROM products p
  JOIN companies c ON c.id = p.company_id
  WHERE p.id = p_product_id INTO v_product;
  
  IF v_product.id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Product not found');
  END IF;
  
  IF NOT rmm_check_permission(v_user_id, 'create', 'sku', v_product.company_id) THEN
    RETURN jsonb_build_object('success', false, 'error', 'Insufficient permissions');
  END IF;
  
  -- Check duplicate SKU code
  IF EXISTS (SELECT 1 FROM skus WHERE sku_code = p_sku_code) THEN
    RETURN jsonb_build_object('success', false, 'error', 'SKU code already exists');
  END IF;
  
  -- Validate dosage form
  IF p_dosage_form NOT IN ('Tablet', 'Capsule', 'Syrup', 'Solution', 'Suspension', 'Injection', 'Cream', 'Ointment', 'Powder', 'Inhaler', 'Patch', 'Suppository', 'Drops', 'Gel', 'Spray', 'Other') THEN
    RETURN jsonb_build_object('success', false, 'error', 'Invalid dosage form');
  END IF;
  
  INSERT INTO skus (
    product_id, sku_code, name, dosage_strength, dosage_form, pack_size, unit_of_measure, atc_code_id, is_active
  ) VALUES (
    p_product_id, p_sku_code, p_name, p_dosage_strength, p_dosage_form, p_pack_size, p_unit_of_measure, p_atc_code_id, true
  )
  RETURNING id INTO v_sku_id;
  
  PERFORM shared_create_audit_log(
    v_user_id, 'CREATE', 'skus', v_sku_id,
    jsonb_build_object('sku_code', p_sku_code, 'product_id', p_product_id)
  );
  
  RETURN jsonb_build_object('success', true, 'sku_id', v_sku_id, 'message', 'SKU created successfully');
END;
$$;

-- Update SKU
CREATE OR REPLACE FUNCTION public.rmm_update_sku(
  p_sku_id UUID,
  p_name TEXT DEFAULT NULL,
  p_dosage_strength TEXT DEFAULT NULL,
  p_dosage_form TEXT DEFAULT NULL,
  p_pack_size TEXT DEFAULT NULL,
  p_unit_of_measure TEXT DEFAULT NULL,
  p_atc_code_id UUID DEFAULT NULL,
  p_is_active BOOLEAN DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
  v_sku RECORD;
  v_company_id UUID;
BEGIN
  v_user_id := auth.uid();
  
  SELECT s.*, p.company_id INTO v_sku
  FROM skus s JOIN products p ON p.id = s.product_id
  WHERE s.id = p_sku_id;
  
  IF v_sku.id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'SKU not found');
  END IF;
  
  IF NOT rmm_check_permission(v_user_id, 'update', 'sku', v_sku.company_id) THEN
    RETURN jsonb_build_object('success', false, 'error', 'Insufficient permissions');
  END IF;
  
  UPDATE skus SET
    name = COALESCE(p_name, name),
    dosage_strength = COALESCE(p_dosage_strength, dosage_strength),
    dosage_form = COALESCE(p_dosage_form, dosage_form),
    pack_size = COALESCE(p_pack_size, pack_size),
    unit_of_measure = COALESCE(p_unit_of_measure, unit_of_measure),
    atc_code_id = COALESCE(p_atc_code_id, atc_code_id),
    is_active = COALESCE(p_is_active, is_active),
    updated_at = NOW()
  WHERE id = p_sku_id;
  
  PERFORM shared_create_audit_log(v_user_id, 'UPDATE', 'skus', p_sku_id, jsonb_build_object('changes', 'updated'));
  
  RETURN jsonb_build_object('success', true, 'sku_id', p_sku_id, 'message', 'SKU updated');
END;
$$;

-- Get SKU
CREATE OR REPLACE FUNCTION public.rmm_get_sku(p_sku_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
  v_sku RECORD;
BEGIN
  v_user_id := auth.uid();
  
  SELECT s.*, p.name as product_name, p.company_id, c.name as company_name, a.code as atc_code, a.name as atc_name
  INTO v_sku
  FROM skus s
  JOIN products p ON p.id = s.product_id
  JOIN companies c ON c.id = p.company_id
  LEFT JOIN atc_codes a ON a.id = s.atc_code_id
  WHERE s.id = p_sku_id;
  
  IF v_sku.id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'SKU not found');
  END IF;
  
  IF NOT rmm_check_permission(v_user_id, 'read', 'sku', v_sku.company_id) THEN
    RETURN jsonb_build_object('success', false, 'error', 'Insufficient permissions');
  END IF;
  
  RETURN jsonb_build_object('success', true, 'sku', row_to_json(v_sku)::jsonb);
END;
$$;

-- List SKUs
CREATE OR REPLACE FUNCTION public.rmm_list_skus(
  p_product_id UUID DEFAULT NULL,
  p_company_id UUID DEFAULT NULL,
  p_is_active BOOLEAN DEFAULT NULL,
  p_search TEXT DEFAULT NULL,
  p_limit INTEGER DEFAULT 50,
  p_offset INTEGER DEFAULT 0
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
  v_user_role TEXT;
  v_user_company_id UUID;
  v_result JSONB;
  v_total INTEGER;
BEGIN
  v_user_id := auth.uid();
  SELECT role, company_id INTO v_user_role, v_user_company_id FROM users WHERE id = v_user_id;
  
  WITH filtered AS (
    SELECT s.*, p.name as product_name, p.company_id, c.name as company_name
    FROM skus s
    JOIN products p ON p.id = s.product_id
    JOIN companies c ON c.id = p.company_id
    WHERE (p_product_id IS NULL OR s.product_id = p_product_id)
      AND (p_company_id IS NULL OR p.company_id = p_company_id)
      AND (p_is_active IS NULL OR s.is_active = p_is_active)
      AND (p_search IS NULL OR s.name ILIKE '%' || p_search || '%' OR s.sku_code ILIKE '%' || p_search || '%')
      AND (v_user_role IN ('tier1', 'tier2_officer', 'tier2_registrar') OR p.company_id = v_user_company_id)
    ORDER BY s.sku_code
    LIMIT p_limit OFFSET p_offset
  )
  SELECT jsonb_agg(row_to_json(filtered)::jsonb) INTO v_result FROM filtered;
  
  SELECT COUNT(*) INTO v_total
  FROM skus s JOIN products p ON p.id = s.product_id
  WHERE (p_product_id IS NULL OR s.product_id = p_product_id)
    AND (p_company_id IS NULL OR p.company_id = p_company_id)
    AND (p_is_active IS NULL OR s.is_active = p_is_active)
    AND (p_search IS NULL OR s.name ILIKE '%' || p_search || '%' OR s.sku_code ILIKE '%' || p_search || '%')
    AND (v_user_role IN ('tier1', 'tier2_officer', 'tier2_registrar') OR p.company_id = v_user_company_id);
  
  RETURN jsonb_build_object('success', true, 'skus', COALESCE(v_result, '[]'::jsonb), 'total', v_total);
END;
$$;

-- ============================================================================
-- Task 1.1.2.4: ATC Code Management (MOH only)
-- ============================================================================

CREATE OR REPLACE FUNCTION public.rmm_list_atc_codes(
  p_level INTEGER DEFAULT NULL,
  p_parent_code TEXT DEFAULT NULL,
  p_search TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_result JSONB;
BEGIN
  WITH filtered AS (
    SELECT * FROM atc_codes
    WHERE (p_level IS NULL OR level = p_level)
      AND (p_parent_code IS NULL OR parent_code = p_parent_code)
      AND (p_search IS NULL OR code ILIKE '%' || p_search || '%' OR name ILIKE '%' || p_search || '%')
    ORDER BY code
  )
  SELECT jsonb_agg(row_to_json(filtered)::jsonb) INTO v_result FROM filtered;
  
  RETURN jsonb_build_object('success', true, 'atc_codes', COALESCE(v_result, '[]'::jsonb));
END;
$$;

CREATE OR REPLACE FUNCTION public.rmm_get_atc_code(p_code TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_atc RECORD;
BEGIN
  SELECT * INTO v_atc FROM atc_codes WHERE code = p_code;
  
  IF v_atc.code IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'ATC code not found');
  END IF;
  
  RETURN jsonb_build_object('success', true, 'atc_code', row_to_json(v_atc)::jsonb);
END;
$$;

-- ============================================================================
-- Task 1.1.2.5: Critical Medicine Management (MOH only)
-- ============================================================================

CREATE OR REPLACE FUNCTION public.rmm_designate_critical_medicine(
  p_sku_id UUID,
  p_reason TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
  v_user_role TEXT;
  v_cm_id UUID;
BEGIN
  v_user_id := auth.uid();
  SELECT role INTO v_user_role FROM users WHERE id = v_user_id;
  
  -- Only Tier 1 can designate critical medicines
  IF v_user_role != 'tier1' THEN
    RETURN jsonb_build_object('success', false, 'error', 'Only MOH Tier 1 can designate critical medicines');
  END IF;
  
  -- Check SKU exists
  IF NOT EXISTS (SELECT 1 FROM skus WHERE id = p_sku_id AND is_active = true) THEN
    RETURN jsonb_build_object('success', false, 'error', 'SKU not found or inactive');
  END IF;
  
  -- Check if already designated
  IF EXISTS (SELECT 1 FROM critical_medicines WHERE sku_id = p_sku_id AND is_active = true) THEN
    RETURN jsonb_build_object('success', false, 'error', 'SKU is already designated as critical medicine');
  END IF;
  
  INSERT INTO critical_medicines (sku_id, designation_date, designated_by, reason, is_active)
  VALUES (p_sku_id, CURRENT_DATE, v_user_id, p_reason, true)
  RETURNING id INTO v_cm_id;
  
  -- Update product's is_critical_medicine flag
  UPDATE products SET is_critical_medicine = true, updated_at = NOW()
  WHERE id = (SELECT product_id FROM skus WHERE id = p_sku_id);
  
  PERFORM shared_create_audit_log(v_user_id, 'CREATE', 'critical_medicines', v_cm_id, 
    jsonb_build_object('sku_id', p_sku_id, 'reason', p_reason));
  
  RETURN jsonb_build_object('success', true, 'critical_medicine_id', v_cm_id, 'message', 'SKU designated as critical medicine');
END;
$$;

CREATE OR REPLACE FUNCTION public.rmm_list_critical_medicines(
  p_is_active BOOLEAN DEFAULT TRUE
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_result JSONB;
BEGIN
  WITH filtered AS (
    SELECT cm.*, s.sku_code, s.name as sku_name, p.name as product_name, c.name as company_name,
           u.full_name as designated_by_name
    FROM critical_medicines cm
    JOIN skus s ON s.id = cm.sku_id
    JOIN products p ON p.id = s.product_id
    JOIN companies c ON c.id = p.company_id
    LEFT JOIN users u ON u.id = cm.designated_by
    WHERE (p_is_active IS NULL OR cm.is_active = p_is_active)
    ORDER BY cm.designation_date DESC
  )
  SELECT jsonb_agg(row_to_json(filtered)::jsonb) INTO v_result FROM filtered;
  
  RETURN jsonb_build_object('success', true, 'critical_medicines', COALESCE(v_result, '[]'::jsonb));
END;
$$;

-- ============================================================================
-- Task 1.1.2.6 - 1.1.2.12: Registry Submission Workflow
-- ============================================================================

-- Task 1.1.2.6: Submit Registry Update (Company -> Submitted)
CREATE OR REPLACE FUNCTION public.rmm_submit_registry_update(
  p_entity_type TEXT,
  p_entity_id UUID DEFAULT NULL,
  p_company_id UUID DEFAULT NULL,
  p_submission_type TEXT DEFAULT 'update',
  p_submission_data JSONB DEFAULT '{}'::jsonb
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
  v_submission_id UUID;
  v_user_company_id UUID;
BEGIN
  v_user_id := auth.uid();
  SELECT company_id INTO v_user_company_id FROM users WHERE id = v_user_id;
  
  -- Check permission
  IF NOT rmm_check_permission(v_user_id, 'submit', 'registry_submission', COALESCE(p_company_id, v_user_company_id)) THEN
    RETURN jsonb_build_object('success', false, 'error', 'Insufficient permissions');
  END IF;
  
  -- Validate entity type
  IF p_entity_type NOT IN ('company', 'product', 'sku') THEN
    RETURN jsonb_build_object('success', false, 'error', 'Invalid entity type');
  END IF;
  
  -- Validate submission type
  IF p_submission_type NOT IN ('create', 'update', 'deactivate') THEN
    RETURN jsonb_build_object('success', false, 'error', 'Invalid submission type');
  END IF;
  
  -- Insert submission
  INSERT INTO registry_submissions (
    submission_type, entity_type, entity_id, company_id, submission_data, status, submitted_by, submitted_at
  ) VALUES (
    p_submission_type, p_entity_type, p_entity_id, COALESCE(p_company_id, v_user_company_id), 
    p_submission_data, 'submitted', v_user_id, NOW()
  )
  RETURNING id INTO v_submission_id;
  
  -- Create approval record
  INSERT INTO approvals (submission_id, submission_type, from_status, to_status, approver_id, approval_type)
  VALUES (v_submission_id, 'registry_submission', 'draft', 'submitted', v_user_id, 'submit');
  
  PERFORM shared_create_audit_log(v_user_id, 'CREATE', 'registry_submissions', v_submission_id,
    jsonb_build_object('status', 'submitted', 'entity_type', p_entity_type));
  
  -- Notify Tier 2 officers
  PERFORM shared_batch_create_notifications(
    'registry_submission_pending',
    'New Registry Submission',
    'A new registry submission requires verification',
    '/dashboard/rmm/submissions/' || v_submission_id::text,
    (SELECT array_agg(id) FROM users WHERE role IN ('tier2_officer', 'tier2_registrar'))
  );
  
  RETURN jsonb_build_object('success', true, 'submission_id', v_submission_id, 'status', 'submitted');
END;
$$;

-- Task 1.1.2.7: Tier 2 Verification
CREATE OR REPLACE FUNCTION public.rmm_verify_registry_submission(
  p_submission_id UUID,
  p_comments TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
  v_user_role TEXT;
  v_submission RECORD;
BEGIN
  v_user_id := auth.uid();
  SELECT role INTO v_user_role FROM users WHERE id = v_user_id;
  
  -- Check Tier 2 permission
  IF v_user_role NOT IN ('tier2_officer', 'tier2_registrar') THEN
    RETURN jsonb_build_object('success', false, 'error', 'Only Tier 2 can verify submissions');
  END IF;
  
  SELECT * INTO v_submission FROM registry_submissions WHERE id = p_submission_id;
  
  IF v_submission.id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Submission not found');
  END IF;
  
  -- Task 1.1.2.1a: State machine validation
  IF v_submission.status != 'submitted' THEN
    RETURN jsonb_build_object('success', false, 'error', 'Invalid state transition: can only verify submitted submissions');
  END IF;
  
  UPDATE registry_submissions SET
    status = 'tier2_verified',
    verified_by = v_user_id,
    verified_at = NOW(),
    updated_at = NOW()
  WHERE id = p_submission_id;
  
  INSERT INTO approvals (submission_id, submission_type, from_status, to_status, approver_id, approval_type, comments)
  VALUES (p_submission_id, 'registry_submission', 'submitted', 'tier2_verified', v_user_id, 'verify', p_comments);
  
  PERFORM shared_create_audit_log(v_user_id, 'UPDATE', 'registry_submissions', p_submission_id,
    jsonb_build_object('from_status', 'submitted', 'to_status', 'tier2_verified'));
  
  -- Notify Tier 1
  PERFORM shared_batch_create_notifications(
    'registry_submission_verified',
    'Registry Submission Verified',
    'A registry submission has been verified and awaits approval',
    '/dashboard/rmm/submissions/' || p_submission_id::text,
    (SELECT array_agg(id) FROM users WHERE role = 'tier1')
  );
  
  RETURN jsonb_build_object('success', true, 'submission_id', p_submission_id, 'status', 'tier2_verified');
END;
$$;

-- Task 1.1.2.8: Tier 1 Approval
CREATE OR REPLACE FUNCTION public.rmm_approve_registry_submission(
  p_submission_id UUID,
  p_comments TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
  v_user_role TEXT;
  v_submission RECORD;
  v_expected_status TEXT;
BEGIN
  v_user_id := auth.uid();
  SELECT role INTO v_user_role FROM users WHERE id = v_user_id;
  
  IF v_user_role != 'tier1' THEN
    RETURN jsonb_build_object('success', false, 'error', 'Only Tier 1 can approve submissions');
  END IF;
  
  SELECT * INTO v_submission FROM registry_submissions WHERE id = p_submission_id;
  
  IF v_submission.id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Submission not found');
  END IF;
  
  -- Company submissions: must be tier2_verified, MOH submissions: must be tier2_peer_reviewed
  v_expected_status := CASE 
    WHEN v_submission.submitted_by IN (SELECT id FROM users WHERE role LIKE 'tier2%') THEN 'tier2_peer_reviewed'
    ELSE 'tier2_verified'
  END;
  
  IF v_submission.status != v_expected_status THEN
    RETURN jsonb_build_object('success', false, 'error', 'Invalid state transition: expected status ' || v_expected_status);
  END IF;
  
  UPDATE registry_submissions SET
    status = 'tier1_approved',
    approved_by = v_user_id,
    approved_at = NOW(),
    updated_at = NOW()
  WHERE id = p_submission_id;
  
  INSERT INTO approvals (submission_id, submission_type, from_status, to_status, approver_id, approval_type, comments)
  VALUES (p_submission_id, 'registry_submission', v_submission.status, 'tier1_approved', v_user_id, 'approve', p_comments);
  
  PERFORM shared_create_audit_log(v_user_id, 'UPDATE', 'registry_submissions', p_submission_id,
    jsonb_build_object('from_status', v_submission.status, 'to_status', 'tier1_approved'));
  
  -- Notify Tier 2 registrar for implementation
  PERFORM shared_batch_create_notifications(
    'registry_submission_approved',
    'Registry Submission Approved',
    'A registry submission has been approved and awaits implementation',
    '/dashboard/rmm/submissions/' || p_submission_id::text,
    (SELECT array_agg(id) FROM users WHERE role = 'tier2_registrar')
  );
  
  RETURN jsonb_build_object('success', true, 'submission_id', p_submission_id, 'status', 'tier1_approved');
END;
$$;

-- Task 1.1.2.9: Tier 2 Implementation
CREATE OR REPLACE FUNCTION public.rmm_implement_registry_update(
  p_submission_id UUID,
  p_comments TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
  v_user_role TEXT;
  v_submission RECORD;
BEGIN
  v_user_id := auth.uid();
  SELECT role INTO v_user_role FROM users WHERE id = v_user_id;
  
  IF v_user_role != 'tier2_registrar' THEN
    RETURN jsonb_build_object('success', false, 'error', 'Only Tier 2 Registrar can implement submissions');
  END IF;
  
  SELECT * INTO v_submission FROM registry_submissions WHERE id = p_submission_id;
  
  IF v_submission.id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Submission not found');
  END IF;
  
  IF v_submission.status != 'tier1_approved' THEN
    RETURN jsonb_build_object('success', false, 'error', 'Invalid state transition: can only implement approved submissions');
  END IF;
  
  UPDATE registry_submissions SET
    status = 'tier2_implemented',
    implemented_by = v_user_id,
    implemented_at = NOW(),
    updated_at = NOW()
  WHERE id = p_submission_id;
  
  INSERT INTO approvals (submission_id, submission_type, from_status, to_status, approver_id, approval_type, comments)
  VALUES (p_submission_id, 'registry_submission', 'tier1_approved', 'tier2_implemented', v_user_id, 'implement', p_comments);
  
  PERFORM shared_create_audit_log(v_user_id, 'UPDATE', 'registry_submissions', p_submission_id,
    jsonb_build_object('from_status', 'tier1_approved', 'to_status', 'tier2_implemented'));
  
  RETURN jsonb_build_object('success', true, 'submission_id', p_submission_id, 'status', 'tier2_implemented');
END;
$$;

-- Task 1.1.2.10: Completion
CREATE OR REPLACE FUNCTION public.rmm_complete_registry_update(p_submission_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_submission RECORD;
BEGIN
  SELECT * INTO v_submission FROM registry_submissions WHERE id = p_submission_id;
  
  IF v_submission.id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Submission not found');
  END IF;
  
  IF v_submission.status != 'tier2_implemented' THEN
    RETURN jsonb_build_object('success', false, 'error', 'Invalid state transition: can only complete implemented submissions');
  END IF;
  
  UPDATE registry_submissions SET status = 'completed', updated_at = NOW() WHERE id = p_submission_id;
  
  INSERT INTO approvals (submission_id, submission_type, from_status, to_status, approver_id, approval_type)
  VALUES (p_submission_id, 'registry_submission', 'tier2_implemented', 'completed', v_submission.implemented_by, 'complete');
  
  -- Notify submitter
  PERFORM shared_create_notification(
    'registry_submission_completed',
    'Registry Submission Completed',
    'Your registry submission has been completed',
    '/dashboard/rmm/submissions/' || p_submission_id::text,
    v_submission.submitted_by
  );
  
  RETURN jsonb_build_object('success', true, 'submission_id', p_submission_id, 'status', 'completed');
END;
$$;

-- Task 1.1.2.11: Rejection with feedback
CREATE OR REPLACE FUNCTION public.rmm_reject_registry_submission(
  p_submission_id UUID,
  p_rejection_reason TEXT,
  p_feedback TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
  v_user_role TEXT;
  v_submission RECORD;
  v_iteration_count INTEGER;
BEGIN
  v_user_id := auth.uid();
  SELECT role INTO v_user_role FROM users WHERE id = v_user_id;
  
  IF v_user_role NOT IN ('tier1', 'tier2_officer', 'tier2_registrar') THEN
    RETURN jsonb_build_object('success', false, 'error', 'Insufficient permissions to reject');
  END IF;
  
  IF LENGTH(p_rejection_reason) < 10 THEN
    RETURN jsonb_build_object('success', false, 'error', 'Rejection reason must be at least 10 characters');
  END IF;
  
  SELECT * INTO v_submission FROM registry_submissions WHERE id = p_submission_id;
  
  IF v_submission.id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Submission not found');
  END IF;
  
  -- Task 1.1.2.11b: Count rejection iterations
  SELECT COUNT(*) INTO v_iteration_count FROM approvals 
  WHERE submission_id = p_submission_id AND approval_type = 'reject';
  
  -- Task 1.1.2.11a: After 2 rejections, Tier 1 must take direct action
  IF v_iteration_count >= 2 AND v_user_role != 'tier1' THEN
    RETURN jsonb_build_object('success', false, 'error', 'Maximum rejection iterations reached. Tier 1 must take direct action.');
  END IF;
  
  UPDATE registry_submissions SET
    status = 'rejected',
    rejection_reason = p_rejection_reason,
    updated_at = NOW()
  WHERE id = p_submission_id;
  
  INSERT INTO approvals (submission_id, submission_type, from_status, to_status, approver_id, approval_type, comments)
  VALUES (p_submission_id, 'registry_submission', v_submission.status, 'rejected', v_user_id, 'reject', 
    COALESCE(p_feedback, '') || ' | Reason: ' || p_rejection_reason);
  
  PERFORM shared_create_audit_log(v_user_id, 'UPDATE', 'registry_submissions', p_submission_id,
    jsonb_build_object('from_status', v_submission.status, 'to_status', 'rejected', 'reason', p_rejection_reason));
  
  -- Notify submitter
  PERFORM shared_create_notification(
    'registry_submission_rejected',
    'Registry Submission Rejected',
    'Your registry submission has been rejected: ' || p_rejection_reason,
    '/dashboard/rmm/submissions/' || p_submission_id::text,
    v_submission.submitted_by
  );
  
  RETURN jsonb_build_object('success', true, 'submission_id', p_submission_id, 'status', 'rejected', 'iteration', v_iteration_count + 1);
END;
$$;

-- Task 1.1.2.12: Peer Review (MOH submissions)
CREATE OR REPLACE FUNCTION public.rmm_peer_review_registry_submission(
  p_submission_id UUID,
  p_comments TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
  v_user_role TEXT;
  v_submission RECORD;
BEGIN
  v_user_id := auth.uid();
  SELECT role INTO v_user_role FROM users WHERE id = v_user_id;
  
  IF v_user_role NOT IN ('tier2_officer', 'tier2_registrar') THEN
    RETURN jsonb_build_object('success', false, 'error', 'Only Tier 2 can peer review');
  END IF;
  
  SELECT * INTO v_submission FROM registry_submissions WHERE id = p_submission_id;
  
  IF v_submission.id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Submission not found');
  END IF;
  
  IF v_submission.status != 'submitted' THEN
    RETURN jsonb_build_object('success', false, 'error', 'Invalid state: can only peer review submitted submissions');
  END IF;
  
  -- Peer review must be by different person
  IF v_submission.submitted_by = v_user_id THEN
    RETURN jsonb_build_object('success', false, 'error', 'Cannot peer review your own submission');
  END IF;
  
  UPDATE registry_submissions SET
    status = 'tier2_peer_reviewed',
    verified_by = v_user_id,
    verified_at = NOW(),
    updated_at = NOW()
  WHERE id = p_submission_id;
  
  INSERT INTO approvals (submission_id, submission_type, from_status, to_status, approver_id, approval_type, comments)
  VALUES (p_submission_id, 'registry_submission', 'submitted', 'tier2_peer_reviewed', v_user_id, 'peer_review', p_comments);
  
  PERFORM shared_create_audit_log(v_user_id, 'UPDATE', 'registry_submissions', p_submission_id,
    jsonb_build_object('from_status', 'submitted', 'to_status', 'tier2_peer_reviewed'));
  
  RETURN jsonb_build_object('success', true, 'submission_id', p_submission_id, 'status', 'tier2_peer_reviewed');
END;
$$;

-- ============================================================================
-- Task 1.1.2.13: Cascade Deactivation Logic
-- ============================================================================

CREATE OR REPLACE FUNCTION public.rmm_cascade_deactivation(
  p_entity_type TEXT,
  p_entity_id UUID,
  p_reason TEXT,
  p_justification TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
  v_user_role TEXT;
  v_affected_products INTEGER := 0;
  v_affected_skus INTEGER := 0;
BEGIN
  v_user_id := auth.uid();
  SELECT role INTO v_user_role FROM users WHERE id = v_user_id;
  
  -- Task 1.1.2.15a: Mandatory justification
  IF LENGTH(COALESCE(p_justification, '')) < 50 THEN
    RETURN jsonb_build_object('success', false, 'error', 'Justification must be at least 50 characters');
  END IF;
  
  IF p_entity_type = 'company' THEN
    -- Deactivate company
    UPDATE companies SET
      is_active = false,
      suspended_at = NOW(),
      suspended_by = v_user_id,
      suspended_reason = p_reason,
      updated_at = NOW()
    WHERE id = p_entity_id;
    
    -- Cascade to products
    WITH updated_products AS (
      UPDATE products SET is_active = false, deactivated_at = NOW(), deactivated_by = v_user_id, 
        deactivated_reason = 'Company deactivated: ' || p_reason, updated_at = NOW()
      WHERE company_id = p_entity_id AND is_active = true
      RETURNING id
    )
    SELECT COUNT(*) INTO v_affected_products FROM updated_products;
    
    -- Cascade to SKUs
    WITH updated_skus AS (
      UPDATE skus SET is_active = false, deactivated_at = NOW(), deactivated_by = v_user_id,
        deactivated_reason = 'Company deactivated: ' || p_reason, updated_at = NOW()
      WHERE product_id IN (SELECT id FROM products WHERE company_id = p_entity_id) AND is_active = true
      RETURNING id
    )
    SELECT COUNT(*) INTO v_affected_skus FROM updated_skus;
    
    PERFORM shared_create_audit_log(v_user_id, 'DEACTIVATE', 'companies', p_entity_id,
      jsonb_build_object('reason', p_reason, 'justification', p_justification, 
        'cascade_products', v_affected_products, 'cascade_skus', v_affected_skus));
    
  ELSIF p_entity_type = 'product' THEN
    UPDATE products SET
      is_active = false, deactivated_at = NOW(), deactivated_by = v_user_id,
      deactivated_reason = p_reason, updated_at = NOW()
    WHERE id = p_entity_id;
    
    -- Cascade to SKUs
    WITH updated_skus AS (
      UPDATE skus SET is_active = false, deactivated_at = NOW(), deactivated_by = v_user_id,
        deactivated_reason = 'Product deactivated: ' || p_reason, updated_at = NOW()
      WHERE product_id = p_entity_id AND is_active = true
      RETURNING id
    )
    SELECT COUNT(*) INTO v_affected_skus FROM updated_skus;
    
    PERFORM shared_create_audit_log(v_user_id, 'DEACTIVATE', 'products', p_entity_id,
      jsonb_build_object('reason', p_reason, 'justification', p_justification, 'cascade_skus', v_affected_skus));
  ELSE
    RETURN jsonb_build_object('success', false, 'error', 'Invalid entity type for cascade deactivation');
  END IF;
  
  RETURN jsonb_build_object(
    'success', true,
    'entity_type', p_entity_type,
    'entity_id', p_entity_id,
    'affected_products', v_affected_products,
    'affected_skus', v_affected_skus
  );
END;
$$;

-- ============================================================================
-- Task 1.1.2.14: Soft Delete Safeguards
-- ============================================================================

CREATE OR REPLACE FUNCTION public.rmm_soft_delete(
  p_entity_type TEXT,
  p_entity_id UUID,
  p_reason TEXT,
  p_justification TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
  v_user_role TEXT;
BEGIN
  v_user_id := auth.uid();
  SELECT role INTO v_user_role FROM users WHERE id = v_user_id;
  
  -- Only Tier 1 can initiate soft delete
  IF v_user_role != 'tier1' THEN
    RETURN jsonb_build_object('success', false, 'error', 'Only Tier 1 can initiate soft delete');
  END IF;
  
  -- Task 1.1.2.15a: Mandatory justification
  IF LENGTH(COALESCE(p_justification, '')) < 50 THEN
    RETURN jsonb_build_object('success', false, 'error', 'Justification must be at least 50 characters');
  END IF;
  
  -- Create pending deletion record (two-person rule - needs approval)
  -- For now, just mark as pending deletion
  PERFORM shared_create_audit_log(v_user_id, 'SOFT_DELETE_REQUEST', p_entity_type, p_entity_id,
    jsonb_build_object('reason', p_reason, 'justification', p_justification, 'status', 'pending_approval'));
  
  RETURN jsonb_build_object(
    'success', true,
    'entity_type', p_entity_type,
    'entity_id', p_entity_id,
    'status', 'pending_two_person_approval',
    'message', 'Soft delete initiated. Requires second Tier 1 approval.'
  );
END;
$$;

-- ============================================================================
-- Task 1.1.2.15: Two-Person Rule for Critical Actions
-- ============================================================================

CREATE OR REPLACE FUNCTION public.rmm_two_person_approve(
  p_action_type TEXT,
  p_entity_type TEXT,
  p_entity_id UUID,
  p_approval_comments TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
  v_user_role TEXT;
  v_original_requestor UUID;
  v_pending_action RECORD;
BEGIN
  v_user_id := auth.uid();
  SELECT role INTO v_user_role FROM users WHERE id = v_user_id;
  
  -- Only Tier 1 can approve two-person actions
  IF v_user_role != 'tier1' THEN
    RETURN jsonb_build_object('success', false, 'error', 'Only Tier 1 can approve two-person actions');
  END IF;
  
  -- Find the pending action from audit logs
  SELECT performed_by INTO v_original_requestor
  FROM audit_logs
  WHERE table_name = p_entity_type AND record_id = p_entity_id
    AND operation = p_action_type || '_REQUEST'
  ORDER BY created_at DESC LIMIT 1;
  
  IF v_original_requestor IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'No pending action found');
  END IF;
  
  -- Cannot approve own request
  IF v_original_requestor = v_user_id THEN
    RETURN jsonb_build_object('success', false, 'error', 'Cannot approve your own request (two-person rule)');
  END IF;
  
  -- Execute the action based on type
  IF p_action_type = 'SOFT_DELETE' THEN
    -- Perform cascade deactivation
    PERFORM rmm_cascade_deactivation(p_entity_type, p_entity_id, 
      'Approved soft delete', 'Two-person approval by ' || v_user_id::text);
  END IF;
  
  PERFORM shared_create_audit_log(v_user_id, p_action_type || '_APPROVED', p_entity_type, p_entity_id,
    jsonb_build_object('original_requestor', v_original_requestor, 'comments', p_approval_comments));
  
  RETURN jsonb_build_object(
    'success', true,
    'action_type', p_action_type,
    'entity_type', p_entity_type,
    'entity_id', p_entity_id,
    'status', 'approved_and_executed'
  );
END;
$$;

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON FUNCTION rmm_check_permission IS 'Task 1.1.2.15b: RBAC permission checking for RMM operations';
COMMENT ON FUNCTION rmm_create_company IS 'Task 1.1.2.1: Create company (MOH only)';
COMMENT ON FUNCTION rmm_update_company IS 'Task 1.1.2.1: Update company';
COMMENT ON FUNCTION rmm_get_company IS 'Task 1.1.2.1: Get company details';
COMMENT ON FUNCTION rmm_list_companies IS 'Task 1.1.2.1: List companies with filters';
COMMENT ON FUNCTION rmm_create_product IS 'Task 1.1.2.2: Create product';
COMMENT ON FUNCTION rmm_update_product IS 'Task 1.1.2.2: Update product';
COMMENT ON FUNCTION rmm_get_product IS 'Task 1.1.2.2: Get product details';
COMMENT ON FUNCTION rmm_list_products IS 'Task 1.1.2.2: List products with filters';
COMMENT ON FUNCTION rmm_create_sku IS 'Task 1.1.2.3: Create SKU with pharmaceutical attributes';
COMMENT ON FUNCTION rmm_update_sku IS 'Task 1.1.2.3: Update SKU';
COMMENT ON FUNCTION rmm_get_sku IS 'Task 1.1.2.3: Get SKU details';
COMMENT ON FUNCTION rmm_list_skus IS 'Task 1.1.2.3: List SKUs with filters';
COMMENT ON FUNCTION rmm_list_atc_codes IS 'Task 1.1.2.4: List ATC codes';
COMMENT ON FUNCTION rmm_get_atc_code IS 'Task 1.1.2.4: Get ATC code details';
COMMENT ON FUNCTION rmm_designate_critical_medicine IS 'Task 1.1.2.5: Designate SKU as critical medicine (Tier 1 only)';
COMMENT ON FUNCTION rmm_list_critical_medicines IS 'Task 1.1.2.5: List critical medicines';
COMMENT ON FUNCTION rmm_submit_registry_update IS 'Task 1.1.2.6: Submit registry update (Company submission)';
COMMENT ON FUNCTION rmm_verify_registry_submission IS 'Task 1.1.2.7: Tier 2 verification of registry submission';
COMMENT ON FUNCTION rmm_approve_registry_submission IS 'Task 1.1.2.8: Tier 1 approval of registry submission';
COMMENT ON FUNCTION rmm_implement_registry_update IS 'Task 1.1.2.9: Tier 2 Registrar implementation';
COMMENT ON FUNCTION rmm_complete_registry_update IS 'Task 1.1.2.10: Complete registry update workflow';
COMMENT ON FUNCTION rmm_reject_registry_submission IS 'Task 1.1.2.11: Reject registry submission with feedback';
COMMENT ON FUNCTION rmm_peer_review_registry_submission IS 'Task 1.1.2.12: Peer review for MOH submissions';
COMMENT ON FUNCTION rmm_cascade_deactivation IS 'Task 1.1.2.13: Cascade deactivation (company -> products -> SKUs)';
COMMENT ON FUNCTION rmm_soft_delete IS 'Task 1.1.2.14: Soft delete with safeguards and two-person rule';
COMMENT ON FUNCTION rmm_two_person_approve IS 'Task 1.1.2.15: Two-person rule approval for critical actions';
