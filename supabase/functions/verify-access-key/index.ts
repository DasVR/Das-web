// Verifies an access key and links the authenticated user to a client.
//
// Call this from the browser after the user has signed up or signed in.
// If the key is valid, the user's profile is promoted to 'client' and linked
// to the matching client row. This replaces the Supabase invite flow and
// avoids auth email rate limits entirely.

import {
  BadRequest,
  corsHeaders,
  jsonResponse,
  requireEnv,
  requireString,
  serviceClient,
} from "../_shared/lib.ts";

Deno.serve(async (request) => {
  const origin = request.headers.get("Origin");

  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders(origin) });
  }
  if (request.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405, origin);
  }

  try {
    const payload = await request.json();

    const accessKey = requireString(payload.access_key, "access_key", 12);
    const email = requireString(payload.email, "email", 320);
    const password = requireString(payload.password, "password", 128);

    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return jsonResponse({ error: "Enter a valid email." }, 400, origin);
    }
    if (password.length < 10) {
      return jsonResponse(
        { error: "Password must be at least 10 characters." },
        400,
        origin
      );
    }

    const admin = serviceClient();

    // Find the client by key. Keys are short-lived; if not found, it's
    // expired or wrong.
    const { data: client, error: clientError } = await admin
      .from("clients")
      .select("id, business_name, email")
      .eq("access_key", accessKey)
      .maybeSingle();

    if (clientError || !client) {
      return jsonResponse(
        { error: "That access key is not valid." },
        403,
        origin
      );
    }

    // Optional: verify the email they entered matches the client record.
    if (client.email && client.email.toLowerCase() !== email.toLowerCase()) {
      return jsonResponse(
        { error: "Email does not match the access key." },
        403,
        origin
      );
    }

    // Create the auth user (or sign them in if they already exist via request access)
    const { data: authData, error: signUpError } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // skip verification since we already verified via key
      user_metadata: { business_name: client.business_name },
    });

    if (signUpError) {
      // User may already exist; try updating their password instead.
      if (signUpError.message?.toLowerCase().includes("already")) {
        // Find existing user by email
        const { data: existing } = await admin.auth.admin.listUsers({
          filter: email,
        });
        const user = existing?.users?.[0];
        if (!user) {
          return jsonResponse(
            { error: "Could not activate. Contact hello@dasdev.net." },
            500,
            origin
          );
        }

        // Update password and link to client
        const { error: pwError } = await admin.auth.admin.updateUserById(
          user.id,
          { password }
        );
        if (pwError) throw pwError;

        const { error: profileError } = await admin
          .from("profiles")
          .update({ role: "client", client_id: client.id })
          .eq("id", user.id);
        if (profileError) throw profileError;

        // Clear the key so it can't be reused
        await admin
          .from("clients")
          .update({ access_key: null, access_key_created_at: null })
          .eq("id", client.id);

        // Notify admin via ntfy
        try {
          await fetch("https://notify.dasdev.net/dasdev-clients", {
            method: "POST",
            body: `Workspace activated (existing user): ${client.business_name}\nEmail: ${email}`,
          });
        } catch { /* ignore network errors */ }

        return jsonResponse({ ok: true, client_id: client.id }, 200, origin);
      }
      throw signUpError;
    }

    if (!authData.user) {
      return jsonResponse({ error: "Activation failed." }, 500, origin);
    }

    // Link profile to client and promote role
    const { error: profileError } = await admin
      .from("profiles")
      .update({ role: "client", client_id: client.id })
      .eq("id", authData.user.id);

    if (profileError) throw profileError;

    // Clear the key so it can't be reused
    await admin
      .from("clients")
      .update({ access_key: null, access_key_created_at: null })
      .eq("id", client.id);

    // Notify admin via ntfy
    try {
      await fetch("https://notify.dasdev.net/dasdev-clients", {
        method: "POST",
        body: `Workspace activated: ${client.business_name}\nEmail: ${email}`,
      });
    } catch { /* ignore network errors */ }

    return jsonResponse({ ok: true, client_id: client.id }, 200, origin);
  } catch (error) {
    if (error instanceof BadRequest) {
      return jsonResponse({ error: error.message }, 400, origin);
    }
    return jsonResponse({ error: "Could not activate." }, 500, origin);
  }
});
