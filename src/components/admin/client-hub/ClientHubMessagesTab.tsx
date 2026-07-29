"use client";

import { useState } from "react";
import { EmptyState, SectionTitle } from "@/components/portal/PortalShell";
import { sendAdminMessage } from "@/lib/admin";
import { formatDate } from "@/lib/dashboard";
import type { MessageRow } from "@/lib/database.types";
import { getServiceName } from "@/lib/services";

export function ClientHubMessagesTab({
  clientId,
  clientName,
  messages,
  onChanged,
}: {
  clientId: string;
  clientName: string;
  messages: MessageRow[];
  onChanged: () => Promise<void>;
}) {
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  return (
    <>
      <SectionTitle>Messages</SectionTitle>
      <div className="mb-3 space-y-2">
        {messages.length === 0 ? (
          <EmptyState title="No messages" body="Start the conversation below." />
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`max-w-[85%] rounded-lg border px-3 py-2 ${
                message.from_admin
                  ? "ml-auto border-neutral-700 bg-neutral-900"
                  : "border-neutral-800 bg-[#111]"
              }`}
            >
              <p className="text-sm leading-relaxed text-neutral-200">{message.body}</p>
              <p className="mt-1 font-mono text-[10px] text-neutral-600">
                {message.from_admin ? "You" : clientName}
                {message.service_id ? ` · asked about ${getServiceName(message.service_id)}` : ""}{" "}
                · {formatDate(message.created_at)}
              </p>
            </div>
          ))
        )}
      </div>

      <form
        onSubmit={async (event) => {
          event.preventDefault();
          if (!body.trim()) return;
          setBusy(true);
          setResult(null);
          try {
            const { emailed } = await sendAdminMessage(clientId, body.trim());
            setBody("");
            setResult(
              emailed
                ? "Sent and emailed."
                : "Posted to the thread. Email is not configured, so no notification was sent."
            );
            await onChanged();
          } catch {
            setResult("Could not send.");
          } finally {
            setBusy(false);
          }
        }}
        className="flex gap-2"
      >
        <label className="sr-only" htmlFor="admin-message">
          Message
        </label>
        <input
          id="admin-message"
          value={body}
          onChange={(event) => setBody(event.target.value)}
          placeholder="Message this client…"
          maxLength={5000}
          className="flex-1 rounded-md border border-neutral-800 bg-[#111] px-3 py-2.5 text-sm text-white placeholder:text-neutral-600 outline-none focus:border-neutral-600"
        />
        <button
          type="submit"
          disabled={busy || !body.trim()}
          className="rounded-md bg-white px-4 py-2.5 text-sm font-medium text-black transition-colors hover:bg-neutral-200 disabled:opacity-50"
        >
          Send
        </button>
      </form>
      {result && <p className="mt-2 text-xs text-neutral-500">{result}</p>}
    </>
  );
}
