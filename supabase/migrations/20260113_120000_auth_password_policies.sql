-- =============================================================================
-- Migration: Auth Password Policies and Session Management
-- Task 1.1.1.6a: Configure Supabase Auth password policies
-- Task 1.1.1.6b: Implement session management
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Password History Tracking Table
-- Prevents reuse of last N passwords (configurable)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.password_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for efficient lookups
CREATE INDEX IF NOT EXISTS idx_password_history_user_id 
    ON public.password_history(user_id);
CREATE INDEX IF NOT EXISTS idx_password_history_created_at 
    ON public.password_history(created_at DESC);

-- RLS: Only system can access password history
ALTER TABLE public.password_history ENABLE ROW LEVEL SECURITY;

-- No user access - only service role can read/write
CREATE POLICY "password_history_no_access" ON public.password_history
    FOR ALL USING (false);

COMMENT ON TABLE public.password_history IS 
    'Stores hashed passwords for history tracking. Prevents reuse of last 5 passwords.';

-- -----------------------------------------------------------------------------
-- Session Management Table
-- Tracks active user sessions for concurrent session limiting
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    session_token_hash TEXT NOT NULL,
    device_info JSONB DEFAULT '{}',
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    last_activity_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    expires_at TIMESTAMPTZ NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    invalidated_at TIMESTAMPTZ,
    invalidated_reason TEXT
);

-- Indexes for session management
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id 
    ON public.user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_active 
    ON public.user_sessions(user_id, is_active) 
    WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_user_sessions_expires 
    ON public.user_sessions(expires_at) 
    WHERE is_active = true;
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_sessions_token_hash 
    ON public.user_sessions(session_token_hash);

-- RLS: Users can only see their own sessions
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "user_sessions_select_own" ON public.user_sessions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "user_sessions_delete_own" ON public.user_sessions
    FOR DELETE USING (auth.uid() = user_id);

COMMENT ON TABLE public.user_sessions IS 
    'Tracks active user sessions. Supports concurrent session limiting and session invalidation.';

-- -----------------------------------------------------------------------------
-- Auth Configuration Table
-- Stores configurable auth settings (can be modified without code changes)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.auth_config (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    config_key TEXT UNIQUE NOT NULL,
    config_value JSONB NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS: Only MOH Tier 1 and System Admin can modify
ALTER TABLE public.auth_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "auth_config_select" ON public.auth_config
    FOR SELECT USING (true);

CREATE POLICY "auth_config_modify" ON public.auth_config
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() 
            AND role IN ('tier1', 'system_admin')
        )
    );

-- Insert default configuration values
INSERT INTO public.auth_config (config_key, config_value, description) VALUES
    ('password_min_length', '8', 'Minimum password length'),
    ('password_require_uppercase', 'true', 'Require at least one uppercase letter'),
    ('password_require_lowercase', 'true', 'Require at least one lowercase letter'),
    ('password_require_number', 'true', 'Require at least one number'),
    ('password_require_special', 'true', 'Require at least one special character'),
    ('password_history_count', '5', 'Number of previous passwords to prevent reuse'),
    ('password_expiry_days', '0', 'Days until password expires (0 = never)'),
    ('session_timeout_minutes', '60', 'Session timeout in minutes'),
    ('session_max_concurrent', '3', 'Maximum concurrent sessions per user'),
    ('session_timeout_idle_minutes', '30', 'Idle session timeout in minutes'),
    ('failed_login_lockout_attempts', '5', 'Failed login attempts before lockout'),
    ('failed_login_lockout_minutes', '15', 'Lockout duration in minutes')
ON CONFLICT (config_key) DO NOTHING;

COMMENT ON TABLE public.auth_config IS 
    'Configurable authentication settings. Modifiable by Tier 1 and System Admin.';

-- -----------------------------------------------------------------------------
-- Failed Login Tracking Table
-- For account lockout after failed attempts
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.failed_login_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL,
    ip_address INET,
    user_agent TEXT,
    attempted_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for checking recent failed attempts
CREATE INDEX IF NOT EXISTS idx_failed_login_email_time 
    ON public.failed_login_attempts(email, attempted_at DESC);

-- Auto-cleanup old records (older than 24 hours)
CREATE INDEX IF NOT EXISTS idx_failed_login_cleanup 
    ON public.failed_login_attempts(attempted_at);

-- RLS: Only system can access
ALTER TABLE public.failed_login_attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "failed_login_no_access" ON public.failed_login_attempts
    FOR ALL USING (false);

COMMENT ON TABLE public.failed_login_attempts IS 
    'Tracks failed login attempts for account lockout feature.';

-- -----------------------------------------------------------------------------
-- Helper Functions
-- -----------------------------------------------------------------------------

-- Function: Get auth config value
CREATE OR REPLACE FUNCTION public.get_auth_config(p_key TEXT)
RETURNS JSONB
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
    SELECT config_value FROM public.auth_config WHERE config_key = p_key;
$$;

COMMENT ON FUNCTION public.get_auth_config IS 
    'Returns auth configuration value for the given key.';

-- Function: Validate password complexity
CREATE OR REPLACE FUNCTION public.validate_password_complexity(p_password TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_min_length INTEGER;
    v_require_uppercase BOOLEAN;
    v_require_lowercase BOOLEAN;
    v_require_number BOOLEAN;
    v_require_special BOOLEAN;
    v_errors TEXT[] := ARRAY[]::TEXT[];
    v_is_valid BOOLEAN := true;
BEGIN
    -- Get configuration
    v_min_length := (SELECT (config_value)::INTEGER FROM public.auth_config WHERE config_key = 'password_min_length');
    v_require_uppercase := (SELECT (config_value)::BOOLEAN FROM public.auth_config WHERE config_key = 'password_require_uppercase');
    v_require_lowercase := (SELECT (config_value)::BOOLEAN FROM public.auth_config WHERE config_key = 'password_require_lowercase');
    v_require_number := (SELECT (config_value)::BOOLEAN FROM public.auth_config WHERE config_key = 'password_require_number');
    v_require_special := (SELECT (config_value)::BOOLEAN FROM public.auth_config WHERE config_key = 'password_require_special');
    
    -- Check minimum length
    IF length(p_password) < COALESCE(v_min_length, 8) THEN
        v_errors := array_append(v_errors, 'Password must be at least ' || COALESCE(v_min_length, 8) || ' characters');
        v_is_valid := false;
    END IF;
    
    -- Check uppercase
    IF COALESCE(v_require_uppercase, true) AND p_password !~ '[A-Z]' THEN
        v_errors := array_append(v_errors, 'Password must contain at least one uppercase letter');
        v_is_valid := false;
    END IF;
    
    -- Check lowercase
    IF COALESCE(v_require_lowercase, true) AND p_password !~ '[a-z]' THEN
        v_errors := array_append(v_errors, 'Password must contain at least one lowercase letter');
        v_is_valid := false;
    END IF;
    
    -- Check number
    IF COALESCE(v_require_number, true) AND p_password !~ '[0-9]' THEN
        v_errors := array_append(v_errors, 'Password must contain at least one number');
        v_is_valid := false;
    END IF;
    
    -- Check special character
    IF COALESCE(v_require_special, true) AND p_password !~ '[!@#$%^&*(),.?":{}|<>_\-+=\[\]\\\/`~]' THEN
        v_errors := array_append(v_errors, 'Password must contain at least one special character');
        v_is_valid := false;
    END IF;
    
    RETURN jsonb_build_object(
        'is_valid', v_is_valid,
        'errors', to_jsonb(v_errors)
    );
END;
$$;

COMMENT ON FUNCTION public.validate_password_complexity IS 
    'Validates password against configured complexity requirements.';

-- Function: Check if password was recently used
CREATE OR REPLACE FUNCTION public.check_password_history(
    p_user_id UUID,
    p_password_hash TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_history_count INTEGER;
    v_found BOOLEAN;
BEGIN
    -- Get configuration
    v_history_count := (SELECT (config_value)::INTEGER FROM public.auth_config WHERE config_key = 'password_history_count');
    
    -- Check if password hash exists in recent history
    SELECT EXISTS(
        SELECT 1 FROM public.password_history
        WHERE user_id = p_user_id
        AND password_hash = p_password_hash
        ORDER BY created_at DESC
        LIMIT COALESCE(v_history_count, 5)
    ) INTO v_found;
    
    RETURN v_found;
END;
$$;

COMMENT ON FUNCTION public.check_password_history IS 
    'Checks if a password hash was recently used by the user.';

-- Function: Record password in history
CREATE OR REPLACE FUNCTION public.record_password_history(
    p_user_id UUID,
    p_password_hash TEXT
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_history_count INTEGER;
BEGIN
    -- Insert new password
    INSERT INTO public.password_history (user_id, password_hash)
    VALUES (p_user_id, p_password_hash);
    
    -- Get configuration
    v_history_count := (SELECT (config_value)::INTEGER FROM public.auth_config WHERE config_key = 'password_history_count');
    
    -- Clean up old entries (keep only the configured number)
    DELETE FROM public.password_history
    WHERE user_id = p_user_id
    AND id NOT IN (
        SELECT id FROM public.password_history
        WHERE user_id = p_user_id
        ORDER BY created_at DESC
        LIMIT COALESCE(v_history_count, 5)
    );
END;
$$;

COMMENT ON FUNCTION public.record_password_history IS 
    'Records a password hash in the user''s password history.';

-- Function: Check failed login attempts
CREATE OR REPLACE FUNCTION public.check_login_lockout(p_email TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_lockout_attempts INTEGER;
    v_lockout_minutes INTEGER;
    v_recent_failures INTEGER;
    v_lockout_until TIMESTAMPTZ;
    v_is_locked BOOLEAN := false;
BEGIN
    -- Get configuration
    v_lockout_attempts := (SELECT (config_value)::INTEGER FROM public.auth_config WHERE config_key = 'failed_login_lockout_attempts');
    v_lockout_minutes := (SELECT (config_value)::INTEGER FROM public.auth_config WHERE config_key = 'failed_login_lockout_minutes');
    
    -- Count recent failures
    SELECT COUNT(*) INTO v_recent_failures
    FROM public.failed_login_attempts
    WHERE email = p_email
    AND attempted_at > now() - (COALESCE(v_lockout_minutes, 15) || ' minutes')::INTERVAL;
    
    -- Check if locked
    IF v_recent_failures >= COALESCE(v_lockout_attempts, 5) THEN
        v_is_locked := true;
        SELECT MAX(attempted_at) + (COALESCE(v_lockout_minutes, 15) || ' minutes')::INTERVAL
        INTO v_lockout_until
        FROM public.failed_login_attempts
        WHERE email = p_email;
    END IF;
    
    RETURN jsonb_build_object(
        'is_locked', v_is_locked,
        'failed_attempts', v_recent_failures,
        'max_attempts', COALESCE(v_lockout_attempts, 5),
        'lockout_until', v_lockout_until
    );
END;
$$;

COMMENT ON FUNCTION public.check_login_lockout IS 
    'Checks if an account is locked due to failed login attempts.';

-- Function: Record failed login attempt
CREATE OR REPLACE FUNCTION public.record_failed_login(
    p_email TEXT,
    p_ip_address INET DEFAULT NULL,
    p_user_agent TEXT DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    INSERT INTO public.failed_login_attempts (email, ip_address, user_agent)
    VALUES (p_email, p_ip_address, p_user_agent);
    
    -- Clean up old records (older than 24 hours)
    DELETE FROM public.failed_login_attempts
    WHERE attempted_at < now() - INTERVAL '24 hours';
END;
$$;

COMMENT ON FUNCTION public.record_failed_login IS 
    'Records a failed login attempt for lockout tracking.';

-- Function: Clear failed login attempts (on successful login)
CREATE OR REPLACE FUNCTION public.clear_failed_logins(p_email TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    DELETE FROM public.failed_login_attempts
    WHERE email = p_email;
END;
$$;

COMMENT ON FUNCTION public.clear_failed_logins IS 
    'Clears failed login attempts for an email (called on successful login).';

-- -----------------------------------------------------------------------------
-- Session Management Functions
-- -----------------------------------------------------------------------------

-- Function: Create user session
CREATE OR REPLACE FUNCTION public.create_user_session(
    p_user_id UUID,
    p_session_token_hash TEXT,
    p_device_info JSONB DEFAULT '{}',
    p_ip_address INET DEFAULT NULL,
    p_user_agent TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_timeout_minutes INTEGER;
    v_max_concurrent INTEGER;
    v_session_id UUID;
    v_active_count INTEGER;
BEGIN
    -- Get configuration
    v_timeout_minutes := (SELECT (config_value)::INTEGER FROM public.auth_config WHERE config_key = 'session_timeout_minutes');
    v_max_concurrent := (SELECT (config_value)::INTEGER FROM public.auth_config WHERE config_key = 'session_max_concurrent');
    
    -- Count active sessions
    SELECT COUNT(*) INTO v_active_count
    FROM public.user_sessions
    WHERE user_id = p_user_id AND is_active = true;
    
    -- If at max concurrent sessions, invalidate oldest
    IF v_active_count >= COALESCE(v_max_concurrent, 3) THEN
        UPDATE public.user_sessions
        SET is_active = false,
            invalidated_at = now(),
            invalidated_reason = 'max_concurrent_sessions_exceeded'
        WHERE id = (
            SELECT id FROM public.user_sessions
            WHERE user_id = p_user_id AND is_active = true
            ORDER BY last_activity_at ASC
            LIMIT 1
        );
    END IF;
    
    -- Create new session
    INSERT INTO public.user_sessions (
        user_id,
        session_token_hash,
        device_info,
        ip_address,
        user_agent,
        expires_at
    ) VALUES (
        p_user_id,
        p_session_token_hash,
        p_device_info,
        p_ip_address,
        p_user_agent,
        now() + (COALESCE(v_timeout_minutes, 60) || ' minutes')::INTERVAL
    )
    RETURNING id INTO v_session_id;
    
    RETURN v_session_id;
END;
$$;

COMMENT ON FUNCTION public.create_user_session IS 
    'Creates a new user session, enforcing concurrent session limits.';

-- Function: Update session activity
CREATE OR REPLACE FUNCTION public.update_session_activity(p_session_token_hash TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_timeout_minutes INTEGER;
    v_idle_timeout_minutes INTEGER;
    v_updated BOOLEAN := false;
BEGIN
    -- Get configuration
    v_timeout_minutes := (SELECT (config_value)::INTEGER FROM public.auth_config WHERE config_key = 'session_timeout_minutes');
    v_idle_timeout_minutes := (SELECT (config_value)::INTEGER FROM public.auth_config WHERE config_key = 'session_timeout_idle_minutes');
    
    -- Update session
    UPDATE public.user_sessions
    SET last_activity_at = now(),
        expires_at = now() + (COALESCE(v_timeout_minutes, 60) || ' minutes')::INTERVAL
    WHERE session_token_hash = p_session_token_hash
    AND is_active = true
    AND expires_at > now()
    AND last_activity_at > now() - (COALESCE(v_idle_timeout_minutes, 30) || ' minutes')::INTERVAL
    RETURNING true INTO v_updated;
    
    -- If not updated, session is invalid or expired
    IF NOT COALESCE(v_updated, false) THEN
        -- Mark session as inactive if it exists
        UPDATE public.user_sessions
        SET is_active = false,
            invalidated_at = now(),
            invalidated_reason = 'session_expired_or_idle'
        WHERE session_token_hash = p_session_token_hash
        AND is_active = true;
    END IF;
    
    RETURN COALESCE(v_updated, false);
END;
$$;

COMMENT ON FUNCTION public.update_session_activity IS 
    'Updates session last activity time. Returns false if session is expired or idle.';

-- Function: Invalidate session
CREATE OR REPLACE FUNCTION public.invalidate_session(
    p_session_token_hash TEXT,
    p_reason TEXT DEFAULT 'user_logout'
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_invalidated BOOLEAN := false;
BEGIN
    UPDATE public.user_sessions
    SET is_active = false,
        invalidated_at = now(),
        invalidated_reason = p_reason
    WHERE session_token_hash = p_session_token_hash
    AND is_active = true
    RETURNING true INTO v_invalidated;
    
    RETURN COALESCE(v_invalidated, false);
END;
$$;

COMMENT ON FUNCTION public.invalidate_session IS 
    'Invalidates a user session (logout).';

-- Function: Invalidate all user sessions
CREATE OR REPLACE FUNCTION public.invalidate_all_user_sessions(
    p_user_id UUID,
    p_reason TEXT DEFAULT 'security_event'
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_count INTEGER;
BEGIN
    UPDATE public.user_sessions
    SET is_active = false,
        invalidated_at = now(),
        invalidated_reason = p_reason
    WHERE user_id = p_user_id
    AND is_active = true;
    
    GET DIAGNOSTICS v_count = ROW_COUNT;
    RETURN v_count;
END;
$$;

COMMENT ON FUNCTION public.invalidate_all_user_sessions IS 
    'Invalidates all active sessions for a user (security event, password change).';

-- Function: Get user active sessions
CREATE OR REPLACE FUNCTION public.get_user_active_sessions(p_user_id UUID DEFAULT NULL)
RETURNS TABLE (
    session_id UUID,
    device_info JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ,
    last_activity_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        us.id,
        us.device_info,
        us.ip_address,
        us.user_agent,
        us.created_at,
        us.last_activity_at,
        us.expires_at
    FROM public.user_sessions us
    WHERE us.user_id = COALESCE(p_user_id, auth.uid())
    AND us.is_active = true
    AND us.expires_at > now()
    ORDER BY us.last_activity_at DESC;
END;
$$;

COMMENT ON FUNCTION public.get_user_active_sessions IS 
    'Returns active sessions for a user.';

-- Function: Cleanup expired sessions
CREATE OR REPLACE FUNCTION public.cleanup_expired_sessions()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_count INTEGER;
BEGIN
    UPDATE public.user_sessions
    SET is_active = false,
        invalidated_at = now(),
        invalidated_reason = 'session_expired'
    WHERE is_active = true
    AND expires_at < now();
    
    GET DIAGNOSTICS v_count = ROW_COUNT;
    
    -- Delete old inactive sessions (older than 30 days)
    DELETE FROM public.user_sessions
    WHERE is_active = false
    AND invalidated_at < now() - INTERVAL '30 days';
    
    RETURN v_count;
END;
$$;

COMMENT ON FUNCTION public.cleanup_expired_sessions IS 
    'Cleans up expired sessions. Should be run by a scheduled job.';

-- -----------------------------------------------------------------------------
-- Grant necessary permissions
-- -----------------------------------------------------------------------------
GRANT EXECUTE ON FUNCTION public.get_auth_config TO authenticated;
GRANT EXECUTE ON FUNCTION public.validate_password_complexity TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_active_sessions TO authenticated;

-- Service role only functions (called by Edge Functions or triggers)
GRANT EXECUTE ON FUNCTION public.check_password_history TO service_role;
GRANT EXECUTE ON FUNCTION public.record_password_history TO service_role;
GRANT EXECUTE ON FUNCTION public.check_login_lockout TO service_role;
GRANT EXECUTE ON FUNCTION public.record_failed_login TO service_role;
GRANT EXECUTE ON FUNCTION public.clear_failed_logins TO service_role;
GRANT EXECUTE ON FUNCTION public.create_user_session TO service_role;
GRANT EXECUTE ON FUNCTION public.update_session_activity TO service_role;
GRANT EXECUTE ON FUNCTION public.invalidate_session TO service_role;
GRANT EXECUTE ON FUNCTION public.invalidate_all_user_sessions TO service_role;
GRANT EXECUTE ON FUNCTION public.cleanup_expired_sessions TO service_role;
