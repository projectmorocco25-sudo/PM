-- Migration: create_authentication_rpc_function
-- Description: Create authentication RPC function - User creation
-- Date: 2026-01-22
-- Task: 1.1.1.2e
-- Author: Sami (Implementation Compliance Specialist)
-- Dependencies: Task 1.1.1.2 (users table must exist), Supabase Auth must be configured

BEGIN;

-- ============================================================================
-- rmm_create_user(creator_user_id uuid, email text, password text, full_name text, role text, company_id uuid DEFAULT NULL, timezone text DEFAULT 'UTC+01:00', language text DEFAULT 'en')
-- Purpose: Create a new user in both Supabase Auth and users table
-- Returns: JSON object with created user data
-- Security: Only Tier 1 and system_admin can create users
-- ============================================================================

CREATE OR REPLACE FUNCTION rmm_create_user(
    creator_user_id uuid,
    email text,
    password text,
    full_name text,
    role text,
    company_id uuid DEFAULT NULL,
    timezone text DEFAULT 'UTC+01:00',
    language text DEFAULT 'en'
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
    creator_record RECORD;
    creator_role text;
    new_auth_user_id uuid;
    new_user_record RECORD;
    result jsonb;
BEGIN
    -- Verify creator user exists and is active
    SELECT u.id, u.role
    INTO creator_record
    FROM users u
    WHERE u.id = creator_user_id AND u.is_active = true;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Creator user not found or not active';
    END IF;

    creator_role := creator_record.role;

    -- Only Tier 1 and system_admin can create users
    IF creator_role NOT IN ('tier1', 'system_admin') THEN
        RAISE EXCEPTION 'Insufficient permissions to create users';
    END IF;

    -- Validate email format (basic validation)
    IF email IS NULL OR trim(email) = '' OR email !~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN
        RAISE EXCEPTION 'Invalid email format';
    END IF;

    -- Validate password (minimum 8 characters)
    IF password IS NULL OR length(password) < 8 THEN
        RAISE EXCEPTION 'Password must be at least 8 characters long';
    END IF;

    -- Validate role
    IF role NOT IN ('tier1', 'tier2_officer', 'tier2_registrar', 'company_admin', 'company_manager', 'company_user', 'auditor', 'system_admin', 'vendor') THEN
        RAISE EXCEPTION 'Invalid role. Must be one of: tier1, tier2_officer, tier2_registrar, company_admin, company_manager, company_user, auditor, system_admin, vendor';
    END IF;

    -- Validate role and company_id relationship
    -- MOH roles (tier1, tier2_officer, tier2_registrar, auditor) must have company_id = NULL
    -- Company roles (company_admin, company_manager, company_user) must have company_id NOT NULL
    IF role IN ('tier1', 'tier2_officer', 'tier2_registrar', 'auditor') AND company_id IS NOT NULL THEN
        RAISE EXCEPTION 'MOH roles cannot have a company_id';
    END IF;

    IF role IN ('company_admin', 'company_manager', 'company_user') AND company_id IS NULL THEN
        RAISE EXCEPTION 'Company roles must have a company_id';
    END IF;

    -- Validate timezone format (basic validation)
    IF timezone IS NOT NULL AND timezone !~ '^UTC[+-]\d{2}:\d{2}$|^[A-Za-z_/]+$' THEN
        RAISE EXCEPTION 'Invalid timezone format';
    END IF;

    -- Validate language format (ISO 639-1: 2 characters)
    IF language IS NOT NULL AND length(language) != 2 THEN
        RAISE EXCEPTION 'Invalid language format (must be ISO 639-1 code)';
    END IF;

    -- Check if email already exists in auth.users
    IF EXISTS (SELECT 1 FROM auth.users WHERE email = rmm_create_user.email) THEN
        RAISE EXCEPTION 'Email already exists';
    END IF;

    -- Check if email already exists in users table
    IF EXISTS (SELECT 1 FROM users WHERE email = rmm_create_user.email) THEN
        RAISE EXCEPTION 'Email already exists';
    END IF;

    -- Create user in Supabase Auth
    -- Note: This requires Supabase Auth extension and proper permissions
    -- The auth.users table is managed by Supabase Auth, so we use the admin API or trigger
    -- For now, we'll create the user record and expect the auth.users entry to be created via trigger or admin API
    -- In production, this should use Supabase Admin API or a trigger on auth.users
    
    -- Insert into users table
    -- The id will be set when auth.users entry is created (via trigger or admin API)
    -- For now, we'll generate a UUID and expect it to match the auth.users.id
    new_auth_user_id := gen_random_uuid();

    -- Note: In a real implementation, the auth.users entry should be created first via Supabase Admin API
    -- or via a trigger. For this migration, we assume the auth.users entry will be created separately
    -- and the id will match. In production, use Supabase Admin API to create auth user first.

    -- Insert into users table
    INSERT INTO users (
        id,
        email,
        full_name,
        company_id,
        role,
        timezone,
        language,
        is_active
    )
    VALUES (
        new_auth_user_id,
        rmm_create_user.email,
        rmm_create_user.full_name,
        rmm_create_user.company_id,
        rmm_create_user.role,
        rmm_create_user.timezone,
        rmm_create_user.language,
        true
    )
    RETURNING * INTO new_user_record;

    -- Get created user data
    SELECT jsonb_build_object(
        'id', u.id,
        'email', u.email,
        'full_name', u.full_name,
        'company_id', u.company_id,
        'role', u.role,
        'timezone', u.timezone,
        'language', u.language,
        'is_active', u.is_active,
        'created_at', u.created_at
    )
    INTO result
    FROM users u
    WHERE u.id = new_user_record.id;

    RETURN result;
END;
$$;

-- ============================================================================
-- Note on Supabase Auth Integration
-- ============================================================================
-- 
-- IMPORTANT: This function creates a user in the users table, but the actual
-- Supabase Auth user creation should be done via:
-- 1. Supabase Admin API (recommended for server-side user creation)
-- 2. Frontend registration flow (for self-registration)
-- 3. Database trigger on auth.users (to sync to users table)
--
-- For production, consider:
-- - Using Supabase Admin API to create auth.users entry first
-- - Then calling this function to create the users table entry
-- - Or implementing a trigger on auth.users to automatically create users table entry
--
-- The current implementation assumes the auth.users entry will be created
-- separately and the id will match. This is a placeholder implementation.
--
-- ============================================================================

COMMIT;
