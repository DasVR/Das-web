// Creates a client record and invites its owner by email.
//
// Admin-only. Uses service_role to call auth.admin.inviteUserByEmail, which the
// browser cannot do, then links the invited user's profile to the new client.

import {
  BadRequest,
  authenticate,
  corsHeaders,
  jsonResponse,
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

  const caller = await authenticate(request);
  if (!caller) return jsonResponse({ error: "Unauthorized" }, 401, origin);
  if (caller.role !== "admin") {
    return jsonResponse({ error: "Forbidden" }, 403, origin);
  }

  try {
    const payload = await request.json();
    const businessName = requireString(payload.business_name, "business_name", 200);
    const email = requireString(payload.email, "email", 320);
    const contactName =
      typeof payload.contact_name === "string"
        ? payload.contact_name.trim().slice(0, 200)
        : null;

    const admin = serviceClient();

    const { data: client, error: clientError } = await admin
      .from("clients")
      .insert({
        business_name: businessName,
        contact_name: contactName,
        email,
        since: String(new Date().getFullYear()),
      })
      .select()
      .single();

    if (clientError) throw new Error(clientError.message);

    const redirectTo = "https://dasdev.net/dashboard/login";

    const { data: invited, error: inviteError } =
      await admin.auth.admin.inviteUserByEmail(email, { redirectTo });

    if (inviteError) {
      // The client record is still useful; report the partial result rather
      // than leaving the caller unsure what happened.
      return jsonResponse(
        {
          client,
          invited: false,
          error: `Client created but the invite failed: ${inviteError.message}`,
        },
        207,
        origin
      );
    }

    if (invited.user) {
      const { error: linkError } = await admin
        .from("profiles")
        .update({ role: "client", client_id: client.id })
        .eq("id", invited.user.id);
      if (linkError) throw new Error(linkError.message);
    }

    return jsonResponse({ client, invited: true }, 200, origin);
  } catch (error) {
    if (error instanceof BadRequest) {
      return jsonResponse({ error: error.message }, 400, origin);
    }
    return jsonResponse({ error: "Could not invite the client." }, 500, origin);
  }
});
