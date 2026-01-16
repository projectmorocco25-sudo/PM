function requireEnv(value: string | undefined, name: string): string {
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${name}. ` +
        `Set it in your local env (e.g. .env.local).`,
    );
  }
  return value;
}

// Next.js requires direct access to process.env.NEXT_PUBLIC_* for static replacement
export const SUPABASE_URL = () =>
  requireEnv(process.env.NEXT_PUBLIC_SUPABASE_URL, "NEXT_PUBLIC_SUPABASE_URL");
export const SUPABASE_ANON_KEY = () =>
  requireEnv(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, "NEXT_PUBLIC_SUPABASE_ANON_KEY");

