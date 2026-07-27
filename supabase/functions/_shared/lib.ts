// Shared helpers for DasDev Edge Functions.
//
// These run on Deno inside Supabase, not in the browser bundle. This is the
// only place the service_role key exists, and it must never be returned in a
// response or logged.

import { createClient, type SupabaseClient } from "jsr:@supabase/supabase-js@2";

const ALLOWED_ORIGINS = [
  "https://dasdev.net",
  "https://www.dasdev.net",
  "http://localhost:3000",
];

export function corsHeaders(origin: string | null): Record<string, string> {
  // Echo the origin only when it is one of ours; never reflect an arbitrary
  // origin, which would let any site call these functions with credentials.
  const allowed = origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allowed,
    "Access-Control-Allow-Headers": "authorization, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    Vary: "Origin",
  };
}

export function jsonResponse(
  body: unknown,
  status: number,
  origin: string | null
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders(origin), "Content-Type": "application/json" },
  });
}

export function requireEnv(name: string): string {
  const value = Deno.env.get(name);
  if (!value) throw new Error(`Missing required secret: ${name}`);
  return value;
}

/** Privileged client. Bypasses RLS, so every caller must be checked first. */
export function serviceClient(): SupabaseClient {
  return createClient(
    requireEnv("SB_URL"),
    requireEnv("SERVICE_ROLE_KEY"),
    { auth: { persistSession: false } }
  );
}

export type Caller = { userId: string; role: string; clientId: string | null };

/**
 * Resolves the caller from their bearer token and reads their role from the
 * database rather than trusting anything in the request body.
 */
export async function authenticate(request: Request): Promise<Caller | null> {
  const header = request.headers.get("Authorization");
  if (!header?.startsWith("Bearer ")) return null;

  const token = header.slice("Bearer ".length);
  const admin = serviceClient();

  const { data, error } = await admin.auth.getUser(token);
  if (error || !data.user) return null;

  const { data: profile } = await admin
    .from("profiles")
    .select("role, client_id")
    .eq("id", data.user.id)
    .maybeSingle();

  if (!profile) return null;

  return {
    userId: data.user.id,
    role: profile.role,
    clientId: profile.client_id,
  };
}

/** Verifies a Cloudflare Turnstile token against Cloudflare's siteverify API. */
export async function verifyTurnstile(
  token: string | undefined,
  remoteIp: string | null
): Promise<boolean> {
  const secret = Deno.env.get("TURNSTILE_SECRET_KEY");
  // No secret configured means captcha is intentionally off for this project.
  if (!secret) return true;
  if (!token) return false;

  const body = new FormData();
  body.append("secret", secret);
  body.append("response", token);
  if (remoteIp) body.append("remoteip", remoteIp);

  const response = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    { method: "POST", body }
  );

  if (!response.ok) return false;
  const result = (await response.json()) as { success?: boolean };
  return result.success === true;
}

/** Sends a transactional email through Resend. */
export async function sendEmail(input: {
  to: string;
  subject: string;
  text: string;
}): Promise<boolean> {
  const apiKey = Deno.env.get("RESEND_API_KEY");
  if (!apiKey) return false;

  const from = Deno.env.get("RESEND_FROM") ?? "DasDev <hello@dasdev.net>";

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [input.to],
      subject: input.subject,
      text: input.text,
    }),
  });

  return response.ok;
}

/** Trims and length-caps a required string field from an untrusted body. */
export function requireString(
  value: unknown,
  field: string,
  maxLength: number
): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new BadRequest(`${field} is required`);
  }
  const trimmed = value.trim();
  if (trimmed.length > maxLength) {
    throw new BadRequest(`${field} is too long`);
  }
  return trimmed;
}

export class BadRequest extends Error {}
