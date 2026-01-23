-- Migration: create_system_status_rpc_functions
-- Description: Create system status RPC functions
-- Date: 2026-01-22
-- Task: 1.1.1.2d
-- Author: Sami (Implementation Compliance Specialist)
-- Dependencies: Task 1.1.1.2 (system_config table must exist)

BEGIN;

-- ============================================================================
-- shared_check_module_active(module_name text)
-- Purpose: Check if module is active
-- Returns: boolean
-- ============================================================================

CREATE OR REPLACE FUNCTION shared_check_module_active(module_name text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    is_active_result boolean;
BEGIN
    -- Validate module_name
    IF module_name NOT IN ('rmm', 'vci', 'ecs', 'cmc') THEN
        RAISE EXCEPTION 'Invalid module name. Must be one of: rmm, vci, ecs, cmc';
    END IF;

    -- Check if module exists and is active
    SELECT sc.is_active
    INTO is_active_result
    FROM system_config sc
    WHERE sc.module_name = shared_check_module_active.module_name;

    -- If module doesn't exist, return false
    IF NOT FOUND THEN
        RETURN false;
    END IF;

    RETURN COALESCE(is_active_result, false);
END;
$$;

-- ============================================================================
-- shared_get_module_config(module_name text)
-- Purpose: Get module configuration
-- Returns: JSON object with module configuration
-- ============================================================================

CREATE OR REPLACE FUNCTION shared_get_module_config(module_name text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    config_result jsonb;
BEGIN
    -- Validate module_name
    IF module_name NOT IN ('rmm', 'vci', 'ecs', 'cmc') THEN
        RAISE EXCEPTION 'Invalid module name. Must be one of: rmm, vci, ecs, cmc';
    END IF;

    -- Get module configuration
    SELECT jsonb_build_object(
        'id', sc.id,
        'module_name', sc.module_name,
        'is_active', sc.is_active,
        'activated_at', sc.activated_at,
        'activated_by', sc.activated_by,
        'config_data', sc.config_data,
        'created_at', sc.created_at,
        'updated_at', sc.updated_at
    )
    INTO config_result
    FROM system_config sc
    WHERE sc.module_name = shared_get_module_config.module_name;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Module not found';
    END IF;

    RETURN config_result;
END;
$$;

-- ============================================================================
-- shared_activate_module(module_name text, user_id uuid, config_data jsonb DEFAULT NULL)
-- Purpose: Activate a module (only Tier 1 and system_admin)
-- Returns: JSON object with updated module configuration
-- ============================================================================

CREATE OR REPLACE FUNCTION shared_activate_module(
    module_name text,
    user_id uuid,
    config_data jsonb DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    user_record RECORD;
    user_role text;
    module_record RECORD;
    result jsonb;
BEGIN
    -- Verify user exists and is active
    SELECT u.id, u.role
    INTO user_record
    FROM users u
    WHERE u.id = user_id AND u.is_active = true;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'User not found or not active';
    END IF;

    user_role := user_record.role;

    -- Only Tier 1 and system_admin can activate modules
    IF user_role NOT IN ('tier1', 'system_admin') THEN
        RAISE EXCEPTION 'Insufficient permissions to activate modules';
    END IF;

    -- Validate module_name
    IF module_name NOT IN ('rmm', 'vci', 'ecs', 'cmc') THEN
        RAISE EXCEPTION 'Invalid module name. Must be one of: rmm, vci, ecs, cmc';
    END IF;

    -- Check if module exists
    SELECT sc.*
    INTO module_record
    FROM system_config sc
    WHERE sc.module_name = shared_activate_module.module_name;

    IF NOT FOUND THEN
        -- Create new module configuration
        INSERT INTO system_config (
            module_name,
            is_active,
            activated_at,
            activated_by,
            config_data
        )
        VALUES (
            module_name,
            true,
            now(),
            user_id,
            config_data
        )
        RETURNING * INTO module_record;
    ELSE
        -- Update existing module configuration
        UPDATE system_config
        SET 
            is_active = true,
            activated_at = now(),
            activated_by = user_id,
            config_data = COALESCE(shared_activate_module.config_data, system_config.config_data),
            updated_at = now()
        WHERE module_name = shared_activate_module.module_name
        RETURNING * INTO module_record;
    END IF;

    -- Get updated module configuration
    SELECT jsonb_build_object(
        'id', sc.id,
        'module_name', sc.module_name,
        'is_active', sc.is_active,
        'activated_at', sc.activated_at,
        'activated_by', sc.activated_by,
        'config_data', sc.config_data,
        'created_at', sc.created_at,
        'updated_at', sc.updated_at
    )
    INTO result
    FROM system_config sc
    WHERE sc.id = module_record.id;

    RETURN result;
END;
$$;

-- ============================================================================
-- shared_deactivate_module(module_name text, user_id uuid)
-- Purpose: Deactivate a module (only Tier 1 and system_admin)
-- Returns: JSON object with updated module configuration
-- ============================================================================

CREATE OR REPLACE FUNCTION shared_deactivate_module(
    module_name text,
    user_id uuid
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    user_record RECORD;
    user_role text;
    module_record RECORD;
    result jsonb;
BEGIN
    -- Verify user exists and is active
    SELECT u.id, u.role
    INTO user_record
    FROM users u
    WHERE u.id = user_id AND u.is_active = true;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'User not found or not active';
    END IF;

    user_role := user_record.role;

    -- Only Tier 1 and system_admin can deactivate modules
    IF user_role NOT IN ('tier1', 'system_admin') THEN
        RAISE EXCEPTION 'Insufficient permissions to deactivate modules';
    END IF;

    -- Validate module_name
    IF module_name NOT IN ('rmm', 'vci', 'ecs', 'cmc') THEN
        RAISE EXCEPTION 'Invalid module name. Must be one of: rmm, vci, ecs, cmc';
    END IF;

    -- Check if module exists
    SELECT sc.*
    INTO module_record
    FROM system_config sc
    WHERE sc.module_name = shared_deactivate_module.module_name;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Module not found';
    END IF;

    -- RMM and VCI are core modules and cannot be deactivated
    IF module_name IN ('rmm', 'vci') THEN
        RAISE EXCEPTION 'RMM and VCI are core modules and cannot be deactivated';
    END IF;

    -- Update module configuration
    UPDATE system_config
    SET 
        is_active = false,
        updated_at = now()
    WHERE module_name = shared_deactivate_module.module_name
    RETURNING * INTO module_record;

    -- Get updated module configuration
    SELECT jsonb_build_object(
        'id', sc.id,
        'module_name', sc.module_name,
        'is_active', sc.is_active,
        'activated_at', sc.activated_at,
        'activated_by', sc.activated_by,
        'config_data', sc.config_data,
        'created_at', sc.created_at,
        'updated_at', sc.updated_at
    )
    INTO result
    FROM system_config sc
    WHERE sc.id = module_record.id;

    RETURN result;
END;
$$;

-- ============================================================================
-- shared_get_system_status(user_id uuid)
-- Purpose: Get overall system status (all modules, uptime, health)
-- Returns: JSON object with system status
-- ============================================================================

CREATE OR REPLACE FUNCTION shared_get_system_status(user_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    user_record RECORD;
    user_role text;
    modules_status jsonb;
    system_status jsonb;
BEGIN
    -- Verify user exists and is active
    SELECT u.id, u.role
    INTO user_record
    FROM users u
    WHERE u.id = user_id AND u.is_active = true;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'User not found or not active';
    END IF;

    user_role := user_record.role;

    -- Get all modules status
    SELECT jsonb_agg(
        jsonb_build_object(
            'module_name', sc.module_name,
            'is_active', sc.is_active,
            'activated_at', sc.activated_at,
            'activated_by', sc.activated_by,
            'config_data', sc.config_data
        ) ORDER BY sc.module_name
    )
    INTO modules_status
    FROM system_config sc
    ORDER BY sc.module_name;

    -- Build system status
    system_status := jsonb_build_object(
        'status', 'operational',
        'timestamp', now(),
        'modules', COALESCE(modules_status, '[]'::jsonb),
        'core_modules', jsonb_build_object(
            'rmm', shared_check_module_active('rmm'),
            'vci', shared_check_module_active('vci')
        ),
        'optional_modules', jsonb_build_object(
            'ecs', shared_check_module_active('ecs'),
            'cmc', shared_check_module_active('cmc')
        )
    );

    RETURN system_status;
END;
$$;

COMMIT;
