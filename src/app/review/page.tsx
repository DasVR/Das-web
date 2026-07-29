"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  fetchReviewByToken,
  submitFeedback,
  type PublicReview,
} from "@/lib/reviews";

export default function ReviewPage() {
  return (
    <Suspense fallback={<Loading />}>
      <ReviewBody />
    </Suspense>
  );
}

function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a] text-sm text-neutral-500">
      Loading review…
    </div>
  );
}

function ReviewBody() {
  const token = useSearchParams().get("token");
  const [review, setReview] = useState<PublicReview | null>(null);
  const [state, setState] = useState<"loading" | "ready" | "missing" | "error">("loading");
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!token) {
      setState("missing");
      return;
    }
    try {
      const data = await fetchReviewByToken(token);
      if (!data) {
        setState("missing");
      } else {
        setReview(data);
        setState("ready");
      }
    } catch {
      setError("Could not load this review.");
      setState("error");
    }
  }, [token]);

  useEffect(() => {
    void load();
  }, [load]);

  if (state === "loading") return <Loading />;

  if (state === "missing") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#0a0a0a] px-6 text-center">
        <p className="font-display text-lg text-white">Link expired or invalid.</p>
        <p className="mt-2 text-sm text-neutral-500">Ask your contact for a fresh review link.</p>
      </div>
    );
  }

  if (state === "error") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#0a0a0a] px-6 text-center">
        <p className="text-sm text-red-400">{error}</p>
      </div>
    );
  }

  if (!review) return <Loading />;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-[#0a0a0a] px-6 py-10 text-white"
    >
      <header className="mx-auto max-w-2xl">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-neutral-600">
          {review.clientName || "Review"}
        </p>
        <h1 className="mt-1 font-display text-2xl font-medium tracking-tight">
          {review.projectName}
        </h1>
        {review.review.external_url && (
          <a
            href={review.review.external_url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-block text-sm text-orange-400 underline underline-offset-2"
          >
            Open preview →
          </a>
        )}
      </header>

      <section className="mx-auto mt-10 max-w-2xl">
        <FeedbackForm reviewId={review.review.id} onSent={load} />
      </section>

      <section className="mx-auto mt-8 max-w-2xl">
        <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.18em] text-neutral-600">
          Feedback ({review.feedback.length})
        </p>
        {review.feedback.length === 0 ? (
          <p className="text-sm text-neutral-600">No notes yet. Be the first.</p>
        ) : (
          <div className="space-y-3">
            {review.feedback.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-lg border border-neutral-800 bg-[#111] px-4 py-3"
              >
                <p className="text-sm leading-relaxed text-neutral-200">{item.body}</p>
                <p className="mt-1 font-mono text-[10px] text-neutral-600">
                  {item.author_name || "Anonymous"}
                  {" · "}
                  {new Date(item.created_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      <footer className="mx-auto mt-12 max-w-2xl border-t border-neutral-900 pt-6 text-center">
        <p className="text-xs text-neutral-700">
          Review link expires {new Date(review.review.expires_at).toLocaleDateString("en-US")}
        </p>
      </footer>
    </motion.div>
  );
}

function FeedbackForm({
  reviewId,
  onSent,
}: {
  reviewId: string;
  onSent: () => Promise<void>;
}) {
  const [body, setBody] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!body.trim()) return;
    setBusy(true);
    try {
      await submitFeedback({
        review_id: reviewId,
        body: body.trim(),
        author_name: name.trim() || undefined,
        author_email: email.trim() || undefined,
      });
      setBody("");
      setName("");
      setEmail("");
      setSent(true);
      await onSent();
    } catch {
      setSent(false);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-neutral-600">
        Leave feedback
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-xs text-neutral-500">
          Name (optional)
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full rounded-md border border-neutral-800 bg-[#111] px-3 py-2 text-sm text-white outline-none focus:border-neutral-600"
          />
        </label>
        <label className="text-xs text-neutral-500">
          Email (optional)
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-md border border-neutral-800 bg-[#111] px-3 py-2 text-sm text-white outline-none focus:border-neutral-600"
          />
        </label>
      </div>
      <label className="block text-xs text-neutral-500">
        Note
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          required
          rows={3}
          placeholder="What should change?"
          className="mt-1 w-full rounded-md border border-neutral-800 bg-[#111] px-3 py-2 text-sm text-white outline-none focus:border-neutral-600"
        />
      </label>
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={busy || !body.trim()}
          className="rounded-md bg-white px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-neutral-200 disabled:opacity-50"
        >
          Submit
        </button>
        {sent && <span className="text-xs text-green-400">Sent.</span>}
      </div>
    </form>
  );
}
