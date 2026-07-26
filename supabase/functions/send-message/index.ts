// Posts a message into a client thread and emails the recipient.
//
// Both parties can call this. The sender's identity and direction come from
// their verified token, never from the request body, so a client cannot post as
// DasDev or into another tenant's thread.

import {
  BadRequest,
  authenticate,
  corsHeaders,
  jsonResponse,
  requireString,
  sendEmail,
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

  try {
    const payload = await request.json();
    const clientId = requireString(payload.client_id, "client_id", 64);
    const body = requireString(payload.body, "body", 5000);
    const serviceId =
      typeof payload.service_id === "string"
        ? payload.service_id.trim().slice(0, 64)
        : null;

    const fromAdmin = caller.role === "admin";

    // A client may only write into their own thread. This mirrors the RLS
    // policy, which service_role bypasses.
    if (!fromAdmin && caller.clientId !== clientId) {
      return jsonResponse({ error: "Forbidden" }, 403, origin);
    }

    const admin = serviceClient();

    const { data: client, error: clientError } = await admin
      .from("clients")
      .select("id, business_name, email")
      .eq("id", clientId)
      .maybeSingle();

    if (clientError || !client) {
      return jsonResponse({ error: "Client not found" }, 404, origin);
    }

    const { data: message, error: insertError } = await admin
      .from("messages")
      .insert({
        client_id: clientId,
        sender_id: caller.userId,
        from_admin: fromAdmin,
        body,
        service_id: serviceId,
      })
      .select()
      .single();

    if (insertError) throw new Error(insertError.message);

    // Notify the other side. A failed email must not fail the message.
    const recipient = fromAdmin
      ? client.email
      : Deno.env.get("ADMIN_NOTIFY_EMAIL");

    let emailed = false;
    if (recipient) {
      emailed = await sendEmail({
        to: recipient,
        subject: fromAdmin
          ? "New update from DasDev"
          : `New message from ${client.business_name}`,
        text: fromAdmin
          ? `${body}\n\nView it in your workspace: ${Deno.env.get("SITE_URL") ?? "https://dasdev.net"}/dashboard`
          : `${client.business_name} wrote:\n\n${body}`,
      });
    }

    return jsonResponse({ message, emailed }, 200, origin);
  } catch (error) {
    if (error instanceof BadRequest) {
      return jsonResponse({ error: error.message }, 400, origin);
    }
    return jsonResponse({ error: "Could not send the message." }, 500, origin);
  }
});
