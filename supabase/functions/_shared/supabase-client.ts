// Supabase client initialization for Edge Functions
// Shared utility for all Edge Functions

import { createClient } from 'jsr:@supabase/supabase-js@2';

/**
 * Create Supabase client with service role key (bypasses RLS)
 * Use for system operations that need full database access
 */
export function createServiceRoleClient() {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables');
  }
  
  return createClient(supabaseUrl, supabaseServiceKey);
}

/**
 * Create Supabase client with user JWT token (respects RLS)
 * Use for user-initiated operations
 */
export function createAuthenticatedClient(jwt: string) {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
  
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_ANON_KEY environment variables');
  }
  
  return createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    },
  });
}
