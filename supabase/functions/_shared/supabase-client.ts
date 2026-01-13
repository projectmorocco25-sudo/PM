/**
 * Shared Supabase Client Utilities for Edge Functions
 * 
 * This module provides standardized Supabase client creation for Edge Functions.
 * 
 * Usage:
 *   import { createServiceClient, createUserClient } from '../_shared/supabase-client.ts';
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

/**
 * Creates a Supabase client with service role privileges.
 * Use this for system operations that need to bypass RLS.
 * 
 * WARNING: This client bypasses Row Level Security.
 * Only use for scheduled jobs and system operations.
 * All operations should be audit logged.
 */
export function createServiceClient(): SupabaseClient {
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing required environment variables: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY');
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

/**
 * Creates a Supabase client with user context from JWT.
 * Use this for user-initiated operations that should respect RLS.
 * 
 * @param authHeader - The Authorization header from the request
 */
export function createUserClient(authHeader: string | null): SupabaseClient {
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing required environment variables: SUPABASE_URL, SUPABASE_ANON_KEY');
  }

  return createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: authHeader ? { Authorization: authHeader } : {},
    },
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

/**
 * Extracts and validates JWT token from Authorization header.
 * 
 * @param authHeader - The Authorization header value
 * @returns The JWT token if valid, null otherwise
 */
export function extractJwtToken(authHeader: string | null): string | null {
  if (!authHeader) return null;
  
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0].toLowerCase() !== 'bearer') {
    return null;
  }
  
  return parts[1];
}

/**
 * Gets the authenticated user ID from the Supabase client.
 * 
 * @param client - Supabase client with user context
 * @returns User ID if authenticated, null otherwise
 */
export async function getAuthenticatedUserId(client: SupabaseClient): Promise<string | null> {
  const { data: { user }, error } = await client.auth.getUser();
  
  if (error || !user) {
    return null;
  }
  
  return user.id;
}
