// Emails a client when an update item needs their attention.
//
// Admin-only. Reads the update and its project through service_role so the
// notification cannot be pointed at a project the caller made up.

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
  if (caller.role !== "admin") {
    return jsonResponse({ error: "Forbidden" }, 403, origin);
  }

  try {
    const payload = await request.json();
    const updateId = requireString(payload.update_id, "update_id", 64);

    const admin = serviceClient();

    const { data: update } = await admin
      .from("updates")
      .select("id, body, due_date, project_id")
      .eq("id", updateId)
      .maybeSingle();

    if (!update) return jsonResponse({ error: "Update not found" }, 404, origin);

    const { data: project } = await admin
      .from("projects")
      .select("name, client_id")
      .eq("id", update.project_id)
      .maybeSingle();

    if (!project) return jsonResponse({ error: "Project not found" }, 404, origin);

    const { data: client } = await admin
      .from("clients")
      .select("business_name, email")
      .eq("id", project.client_id)
      .maybeSingle();

    if (!client?.email) {
      return jsonResponse(
        { emailed: false, error: "That client has no email on file." },
        200,
        origin
      );
    }

    const due = update.due_date ? `\n\nDue: ${update.due_date}` : "";
    const emailed = await sendEmail({
      to: client.email,
      subject: `Action needed on ${project.name}`,
      text: `${update.body}${due}\n\nOpen your workspace: ${Deno.env.get("SITE_URL") ?? "https://dasdev.net"}/dashboard`,
    });

    return jsonResponse({ emailed }, 200, origin);
  } catch (error) {
    if (error instanceof BadRequest) {
      return jsonResponse({ error: error.message }, 400, origin);
    }
    return jsonResponse({ error: "Could not send the notification." }, 500, origin);
  }
});
