// Receives a contact-form submission.
//
// This is the only function callable without a session, so it is the only one
// exposed to spam. Turnstile is verified before anything is written, and the
// insert runs through service_role because `leads` grants no anon write — that
// keeps the contact form from being an open write endpoint into the database.

import {
  BadRequest,
  corsHeaders,
  jsonResponse,
  requireString,
  sendEmail,
  serviceClient,
  verifyTurnstile,
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

    const name = requireString(payload.name, "name", 200);
    const email = requireString(payload.email, "email", 320);
    const message = requireString(payload.message, "message", 5000);
    const serviceId =
      typeof payload.service_id === "string"
        ? payload.service_id.trim().slice(0, 64)
        : null;

    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return jsonResponse({ error: "Enter a valid email." }, 400, origin);
    }

    const verified = await verifyTurnstile(
      typeof payload.turnstile_token === "string"
        ? payload.turnstile_token
        : undefined,
      request.headers.get("CF-Connecting-IP")
    );

    if (!verified) {
      return jsonResponse({ error: "Verification failed." }, 403, origin);
    }

    const admin = serviceClient();
    const { error } = await admin.from("leads").insert({
      name,
      email,
      message,
      service_id: serviceId,
      source: "contact-form",
    });

    if (error) throw new Error(error.message);

    const notify = Deno.env.get("ADMIN_NOTIFY_EMAIL");
    if (notify) {
      await sendEmail({
        to: notify,
        subject: `New lead: ${name}`,
        text: `${name} <${email}>\n\n${message}`,
      });
    }

    return jsonResponse({ ok: true }, 200, origin);
  } catch (error) {
    if (error instanceof BadRequest) {
      return jsonResponse({ error: error.message }, 400, origin);
    }
    return jsonResponse({ error: "Could not send your message." }, 500, origin);
  }
});
