"use client";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database.types";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * Whether a backend is wired up. The portal renders a clear "not configured"
 * state instead of throwing when these are absent, so a build without secrets
 * still produces a working marketing site.
 */
export const isSupabaseConfigured = Boolean(url && anonKey);

let client: SupabaseClient<Database> | null = null;

/**
 * Browser Supabase client.
 *
 * The anon key is public by design; it grants nothing on its own because every
 * table denies by default and each policy is scoped to the caller's client_id
 * (see supabase/migrations/0002_rls_policies.sql).
 */
export function getSupabase(): SupabaseClient<Database> {
  if (!url || !anonKey) {
    throw new Error(
      "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY."
    );
  }

  if (!client) {
    client = createClient<Database>(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        flowType: "pkce",
      },
    });
  }

  return client;
}

/** Base URL for Edge Functions, used for the few writes that need service_role. */
export function functionsUrl(name: string): string {
  if (!url) throw new Error("Supabase is not configured.");
  return `${url.replace(/\/$/, "")}/functions/v1/${name}`;
}

export const supabaseAnonKey = anonKey ?? "";
