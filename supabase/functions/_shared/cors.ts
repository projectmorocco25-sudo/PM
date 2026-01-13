/**
 * CORS Headers Configuration for Edge Functions
 * 
 * This module provides standardized CORS headers for Edge Functions.
 * 
 * Usage:
 *   import { corsHeaders, handleCorsPreflightRequest } from '../_shared/cors.ts';
 */

/**
 * Standard CORS headers for Edge Functions.
 * Allows requests from any origin during development.
 * 
 * TODO: Update allowed origins for production deployment
 */
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type, x-correlation-id',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
  'Access-Control-Max-Age': '86400',
};

/**
 * Production CORS headers with specific origin.
 * Use this in production deployments.
 */
export function getCorsHeaders(allowedOrigin: string): Record<string, string> {
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Headers':
      'authorization, x-client-info, apikey, content-type, x-correlation-id',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Max-Age': '86400',
  };
}

/**
 * Handles CORS preflight OPTIONS requests.
 * 
 * @param req - The incoming request
 * @returns Response if this is an OPTIONS request, null otherwise
 */
export function handleCorsPreflightRequest(req: Request): Response | null {
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      status: 200,
      headers: corsHeaders,
    });
  }
  return null;
}
