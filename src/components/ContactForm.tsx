"use client";

import { useState } from "react";
import { site } from "@/content/site";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

/**
 * POSTs to `/api/leads`, the same route the quote wizard uses, the difference
 * between the two is which fields are filled in, not what happens next.
 *
 * The success panel is shown only for a message that actually left. A failure
 * keeps the form and everything in it on screen and offers the phone: a green
 * tick over a message nobody received is worse than no form at all, because the
 * visitor stops waiting for a reply that isn't coming.
 */
export function ContactForm() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  /** Distinguishes "you mistyped something" from "we dropped it". */
  const [failedToSend, setFailedToSend] = useState(false);
  const [sending, setSending] = useState(false);

  if (sent) {
    return (
      <div className="rounded-card bg-leaf-400/10 p-8 text-center ring-1 ring-leaf-500/25">
        <Icon name="check" className="mx-auto h-10 w-10 text-leaf-600" />
        <p className="mt-3 font-display text-xl text-ink-900">Message received.</p>
        <p className="mt-1.5 text-sm text-ink-500">We reply the same business day.</p>
      </div>
    );
  }

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (sending) return;

    const data = Object.fromEntries(new FormData(e.currentTarget));
    if (
      !String(data.name).trim() ||
      !String(data.message).trim() ||
      !/^\S+@\S+\.\S+$/.test(String(data.email))
    ) {
      setFailedToSend(false);
      setError("Name, a valid email and a message are all we need.");
      return;
    }

    setSending(true);
    setError("");
    setFailedToSend(false);

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind: "contact", ...data }),
      });
      if (!res.ok) {
        const detail = await res.json().catch(() => null);
        throw new Error(detail?.error || "That didn't send.");
      }
      setSent(true);
    } catch (err) {
      setFailedToSend(true);
      setError((err as Error).message);
    } finally {
      setSending(false);
    }
  };

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-bold text-ink-700">Name</span>
          <input name="name" type="text" autoComplete="name" className="mt-2 w-full rounded-card border border-ink-200 p-3.5 text-base sm:text-sm focus:border-harbor-500" />
        </label>
        <label className="block">
          <span className="text-sm font-bold text-ink-700">Email</span>
          <input name="email" type="email" autoComplete="email" className="mt-2 w-full rounded-card border border-ink-200 p-3.5 text-base sm:text-sm focus:border-harbor-500" />
        </label>
      </div>
      <label className="block">
        <span className="text-sm font-bold text-ink-700">Message</span>
        <textarea name="message" rows={5} className="mt-2 w-full rounded-card border border-ink-200 p-3.5 text-base sm:text-sm focus:border-harbor-500" />
      </label>

      {/*
        Honeypot. Hidden from sight, hidden from the accessibility tree, and
        skipped by the tab order (a human has no way to reach it), so anything
        in it came from something filling every field it found. The route
        answers 200 to those so the sender logs a success and moves on.

        `sr-only` would be wrong here: screen readers announce it, and a blind
        visitor filling in the field they were told about would have their
        message silently binned.
      */}
      <input
        type="text"
        name="_hp"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
      />

      {error && (
        <div role="alert" className="rounded-card bg-amber-50 p-3.5 text-sm text-amber-800 ring-1 ring-amber-500/20">
          <p>{error}</p>
          {failedToSend && (
            <p className="mt-2 leading-relaxed">
              Your message is still here. Try Send again, or call{" "}
              <a href={`tel:${site.contact.phoneHref}`} className="font-bold underline underline-offset-2">
                {site.contact.phone}
              </a>{" "}
              and skip the form.
            </p>
          )}
        </div>
      )}

      <Button type="submit" className="self-start" disabled={sending}>
        {sending ? "Sending…" : "Send Message"}
      </Button>
    </form>
  );
}
