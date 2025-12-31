import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { requireEnv } from "@/lib/errors";

let serviceRoleClient: SupabaseClient | null = null;

// Service role client for admin operations (bypasses RLS)
export function getSupabaseServiceClient(): SupabaseClient {
  if (serviceRoleClient) return serviceRoleClient;
  const url = requireEnv("NEXT_PUBLIC_SUPABASE_URL");
  const serviceRoleKey = requireEnv("SUPABASE_SERVICE_ROLE_KEY");
  serviceRoleClient = createClient(url, serviceRoleKey, {
    auth: { persistSession: false },
  });
  return serviceRoleClient;
}

// Authenticated client for user operations (respects RLS)
export function getSupabaseClient(supabaseAccessToken: string): SupabaseClient {
  const url = requireEnv("NEXT_PUBLIC_SUPABASE_URL");
  const anonKey = requireEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY");
  return createClient(url, anonKey, {
    auth: { persistSession: false },
    global: {
      headers: { Authorization: `Bearer ${supabaseAccessToken}` },
    },
  });
}
