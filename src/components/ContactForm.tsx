"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

/**
 * ⚠️ STUB — no backend exists. Logs the payload and shows the success state.
 * Wire to the same endpoint as QuoteWizard at launch (CHECKLIST.md Phase 13).
 */
export function ContactForm() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  if (sent) {
    return (
      <div className="rounded-card bg-mint-400/10 p-8 text-center ring-1 ring-mint-500/25">
        <Icon name="check" className="mx-auto h-10 w-10 text-mint-600" />
        <p className="mt-3 font-display text-xl text-ink-900">Message received.</p>
        <p className="mt-1.5 text-sm text-ink-500">We reply the same business day.</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(e.currentTarget));
        if (!String(data.name).trim() || !String(data.message).trim() || !/^\S+@\S+\.\S+$/.test(String(data.email))) {
          setError("Name, a valid email and a message are all we need.");
          return;
        }
        console.log("[contact-form] payload (not sent anywhere):", data);
        setSent(true);
      }}
      noValidate
      className="flex flex-col gap-4"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-bold text-ink-700">Name</span>
          <input name="name" type="text" autoComplete="name" className="mt-2 w-full rounded-card border border-ink-200 p-3.5 text-sm focus:border-hydro-500" />
        </label>
        <label className="block">
          <span className="text-sm font-bold text-ink-700">Email</span>
          <input name="email" type="email" autoComplete="email" className="mt-2 w-full rounded-card border border-ink-200 p-3.5 text-sm focus:border-hydro-500" />
        </label>
      </div>
      <label className="block">
        <span className="text-sm font-bold text-ink-700">Message</span>
        <textarea name="message" rows={5} className="mt-2 w-full rounded-card border border-ink-200 p-3.5 text-sm focus:border-hydro-500" />
      </label>
      {error && (
        <p role="alert" className="rounded-card bg-signal-50 p-3.5 text-sm text-signal-800 ring-1 ring-signal-500/20">
          {error}
        </p>
      )}
      <Button type="submit" className="self-start">
        Send Message
      </Button>
    </form>
  );
}
