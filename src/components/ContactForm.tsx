"use client";

import { useId, useState } from "react";
import { site } from "@/content/site";
import { residentialServices } from "@/content/services";
import { locations } from "@/content/locations";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

/**
 * The callback request form. POSTs to `/api/leads`.
 *
 * ── WHY THIS IS THREE STEPS ─────────────────────────────────────────────────
 * The form this replaced was Name / Email / Message on one screen. Two problems
 * with that, and the second is the expensive one:
 *
 *   1. It never asked for a phone number. Every CTA on this site says "Request
 *      a Callback", and the form behind them could not capture the one field a
 *      callback needs. Leads arrived as an email address and a paragraph.
 *   2. A single tall column of empty inputs is the highest-abandonment shape a
 *      mobile form can take. Most of this traffic is on a phone, outside,
 *      looking at the problem. Three short steps with a visible progress bar
 *      ask for the same information but never show more than a screenful, and
 *      the first step is a tap rather than typing, which is the cheapest
 *      possible way to get someone started.
 *
 * Step one is deliberately zero-typing: pick what needs cleaning. Once someone
 * has invested a tap they finish at a much higher rate than they start.
 *
 * ── WHAT IT DOES NOT DO ─────────────────────────────────────────────────────
 * It does not quote, estimate, or ask for square footage. Per
 * implementation/OPTIMIZATION.md the site quotes nothing: the conversion is the
 * callback, not a number on screen. Do not add a pricing step here.
 *
 * The success panel only renders for a submission that actually left. A failure
 * keeps the form and everything in it on screen and offers the phone: a green
 * tick over a message nobody received is worse than no form at all, because the
 * visitor stops waiting for a reply that isn't coming.
 */

const STEPS = [
  { n: 1 as const, label: "What needs cleaning" },
  { n: 2 as const, label: "How we reach you" },
  { n: 3 as const, label: "Where and when" },
];

const CALL_TIMES = ["Any time", "Morning", "Afternoon", "Evening"];

/** Marketing attribution. Optional by design, an extra required field here
 *  costs more leads than the answer is worth. */
const HOW_HEARD = [
  "Google search",
  "Saw the truck or a yard sign",
  "Friend or neighbor",
  "Facebook or Instagram",
  "Nextdoor",
  "Repeat customer",
];

const OTHER_CITY = "Somewhere else nearby";

const emptyForm = () => ({
  services: [] as string[],
  name: "",
  phone: "",
  email: "",
  city: "",
  bestTime: CALL_TIMES[0],
  howHeard: "",
  message: "",
});

/* ---------------------------------------------------------------------------
   Field primitives

   Local rather than in components/ui: they carry this form's specific focus and
   error treatment, and nothing else on the site renders a text input today.
   Promote them the moment a second form needs them.
   ------------------------------------------------------------------------- */

const fieldBase =
  "mt-1.5 w-full rounded-xl border bg-white px-3.5 py-3 text-base text-ink-900 shadow-sm outline-none transition-colors " +
  // 16px on mobile is not a style choice: iOS Safari zooms the viewport on
  // focus for anything smaller, and the page never zooms back out.
  "placeholder:text-ink-300 focus:ring-4 focus:ring-harbor-400/20 sm:text-[15px]";

function Field({
  label,
  hint,
  required,
  invalid,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  invalid?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-ink-700">
        {label}
        {required && <span className="ml-1 text-amber-600">*</span>}
      </span>
      {hint && <span className="mt-0.5 block text-xs text-ink-400">{hint}</span>}
      {children}
      {invalid && <span className="sr-only">This field is required</span>}
    </label>
  );
}

const borderFor = (invalid?: boolean) =>
  invalid ? "border-amber-500 focus:border-amber-500" : "border-ink-200 focus:border-harbor-500";

/* ------------------------------------------------------------------------- */

export function ContactForm() {
  const uid = useId();
  const id = (n: string) => `${uid}-${n}`;

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [form, setForm] = useState(emptyForm);
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  /** Distinguishes "you mistyped something" from "we dropped it". */
  const [failedToSend, setFailedToSend] = useState(false);
  /** Field names to outline in amber. Cleared on every navigation attempt. */
  const [missing, setMissing] = useState<string[]>([]);

  const set = (k: keyof ReturnType<typeof emptyForm>, v: string | string[]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const toggleService = (name: string) =>
    setForm((f) => ({
      ...f,
      services: f.services.includes(name)
        ? f.services.filter((s) => s !== name)
        : [...f.services, name],
    }));

  if (sent) {
    return (
      <div className="rounded-2xl bg-white p-8 text-center shadow-lift ring-1 ring-ink-900/5">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-leaf-400/15 ring-1 ring-leaf-500/25">
          <Icon name="check" className="h-7 w-7 text-leaf-600" />
        </span>
        <p className="mt-4 font-display text-2xl text-ink-900">That&apos;s with us.</p>
        <p className="mx-auto mt-2 max-w-sm text-ink-600">
          We&apos;ll call you back within 24 hours, usually a lot sooner. Nothing else to do
          on your end.
        </p>
        <p className="mt-5 text-sm text-ink-500">
          Need us quicker? Call{" "}
          <a
            href={`tel:${site.contact.phoneHref}`}
            className="font-bold text-harbor-700 underline underline-offset-2"
          >
            {site.contact.phone}
          </a>
        </p>
      </div>
    );
  }

  /** Returns the field names that are empty, and marks them. */
  const validate = (which: 1 | 2 | 3) => {
    const gaps: string[] = [];
    if (which === 1 && form.services.length === 0) gaps.push("services");
    if (which === 2) {
      if (!form.name.trim()) gaps.push("name");
      if (!form.phone.trim()) gaps.push("phone");
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim())) gaps.push("email");
    }
    if (which === 3 && !form.city) gaps.push("city");
    setMissing(gaps);
    return gaps;
  };

  const next = () => {
    setError("");
    setFailedToSend(false);
    const gaps = validate(step);
    if (gaps.length) {
      setError(
        step === 1
          ? "Pick at least one thing you'd like cleaned."
          : gaps.includes("email") && gaps.length === 1
            ? "That email address doesn't look right."
            : "We need those fields to be able to call you back.",
      );
      return;
    }
    setStep((s) => (s === 3 ? 3 : ((s + 1) as 1 | 2 | 3)));
  };

  const back = () => {
    setError("");
    setMissing([]);
    setStep((s) => (s === 1 ? 1 : ((s - 1) as 1 | 2 | 3)));
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (sending) return;
    if (step < 3) {
      next();
      return;
    }

    // Re-check every step, not just the last one: someone can reach step 3 and
    // then clear a field by going back.
    const gaps = [...validate(1), ...validate(2), ...validate(3)];
    setMissing(gaps);
    if (gaps.length) {
      const firstBad = gaps.some((g) => g === "services") ? 1 : gaps.includes("city") ? 3 : 2;
      setStep(firstBad as 1 | 2 | 3);
      setError("Something above got cleared. Check the highlighted fields.");
      return;
    }

    setSending(true);
    setError("");
    setFailedToSend(false);

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: "contact",
          name: form.name,
          email: form.email,
          phone: form.phone,
          city: form.city,
          services: form.services.join(", "),
          bestTime: form.bestTime,
          howHeard: form.howHeard,
          message: form.message,
          _hp: (e.currentTarget.elements.namedItem("_hp") as HTMLInputElement)?.value ?? "",
        }),
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

  const invalid = (name: string) => missing.includes(name);

  return (
    <div className="relative">
      {/* Tilted colour block behind the card. Harbor and leaf are the two arcs
          in the logo, so the form sits in the brand rather than on top of it. */}
      <div
        aria-hidden
        className="absolute -inset-1.5 -rotate-1 rounded-3xl bg-gradient-to-br from-harbor-400/20 via-leaf-400/15 to-amber-400/20"
      />

      <div className="relative overflow-hidden rounded-2xl bg-white shadow-lift ring-1 ring-ink-900/5">
        {/* Header band */}
        <div className="bg-ink-900 px-5 py-4 sm:px-6">
          <div className="flex items-baseline justify-between gap-3">
            <h3 className="font-display text-lg text-white sm:text-xl">
              {STEPS[step - 1].label}
            </h3>
            <span className="shrink-0 text-xs font-bold uppercase tracking-[0.14em] text-ink-300">
              Step {step} of 3
            </span>
          </div>
          <ol
            className="mt-3 flex gap-1.5"
            role="progressbar"
            aria-valuenow={step}
            aria-valuemin={1}
            aria-valuemax={3}
            aria-label={`Step ${step} of 3: ${STEPS[step - 1].label}`}
          >
            {STEPS.map((s) => (
              <li
                key={s.n}
                className={cn(
                  "h-1.5 flex-1 rounded-full transition-colors duration-300",
                  s.n <= step ? "bg-leaf-400" : "bg-white/15",
                )}
              />
            ))}
          </ol>
        </div>

        <form onSubmit={onSubmit} noValidate className="px-5 py-5 sm:px-6 sm:py-6">
          {/* Step 1: zero typing, just taps. */}
          {step === 1 && (
            <fieldset>
              <legend className="text-sm font-bold text-ink-700">
                Pick everything you&apos;d like looked at
                <span className="ml-1 text-amber-600">*</span>
              </legend>
              <p className="mt-0.5 text-xs text-ink-400">
                Tap as many as you need. It all goes in one visit.
              </p>
              <div
                className={cn(
                  "mt-3 flex flex-wrap gap-2 rounded-xl transition-shadow",
                  invalid("services") && "ring-2 ring-amber-500/60 ring-offset-4",
                )}
              >
                {residentialServices.map((s) => {
                  const on = form.services.includes(s.name);
                  return (
                    <button
                      key={s.slug}
                      type="button"
                      onClick={() => toggleService(s.name)}
                      aria-pressed={on}
                      className={cn(
                        "no-tap-flash inline-flex min-h-11 items-center gap-2 rounded-pill border-2 px-4 py-2.5 text-sm font-semibold transition-all active:scale-[0.97]",
                        on
                          ? "border-harbor-500 bg-harbor-500 text-white shadow-card"
                          : "border-ink-200 bg-white text-ink-700 hover:border-harbor-300 hover:bg-harbor-50",
                      )}
                    >
                      <Icon
                        name={on ? "check" : s.icon}
                        className={cn("h-4 w-4 shrink-0", on ? "text-white" : "text-harbor-500")}
                      />
                      {s.navLabel}
                    </button>
                  );
                })}
              </div>
            </fieldset>
          )}

          {/* Step 2: the fields a callback actually needs. */}
          {step === 2 && (
            <div className="flex flex-col gap-4">
              <Field label="Your name" required invalid={invalid("name")}>
                <input
                  id={id("name")}
                  name="name"
                  type="text"
                  autoComplete="name"
                  autoFocus
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  placeholder="First and last"
                  className={cn(fieldBase, borderFor(invalid("name")))}
                />
              </Field>
              <Field
                label="Mobile number"
                hint="The number we'll call you back on."
                required
                invalid={invalid("phone")}
              >
                <input
                  id={id("phone")}
                  name="phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  value={form.phone}
                  onChange={(e) => set("phone", e.target.value)}
                  placeholder="(803) 555-0134"
                  className={cn(fieldBase, borderFor(invalid("phone")))}
                />
              </Field>
              <Field label="Email" required invalid={invalid("email")}>
                <input
                  id={id("email")}
                  name="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                  placeholder="you@example.com"
                  className={cn(fieldBase, borderFor(invalid("email")))}
                />
              </Field>
            </div>
          )}

          {/* Step 3: everything optional except the city. */}
          {step === 3 && (
            <div className="flex flex-col gap-4">
              <Field label="Which town are you in?" required invalid={invalid("city")}>
                <select
                  id={id("city")}
                  name="city"
                  value={form.city}
                  onChange={(e) => set("city", e.target.value)}
                  className={cn(fieldBase, borderFor(invalid("city")), !form.city && "text-ink-400")}
                >
                  <option value="">Choose your town</option>
                  {locations.map((l) => (
                    <option key={l.slug} value={`${l.city}, ${l.region}`}>
                      {l.city}, {l.region}
                    </option>
                  ))}
                  <option value={OTHER_CITY}>{OTHER_CITY}</option>
                </select>
              </Field>

              <Field label="Best time to reach you">
                <select
                  id={id("bestTime")}
                  name="bestTime"
                  value={form.bestTime}
                  onChange={(e) => set("bestTime", e.target.value)}
                  className={cn(fieldBase, borderFor(false))}
                >
                  {CALL_TIMES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </Field>

              <Field
                label="Anything we should know?"
                hint="Optional. Two stories, a gate code, a deadline, whatever matters."
              >
                <textarea
                  id={id("message")}
                  name="message"
                  rows={4}
                  value={form.message}
                  onChange={(e) => set("message", e.target.value)}
                  placeholder="North side is green and there's a dog in the yard on weekdays."
                  className={cn(fieldBase, borderFor(false), "resize-y")}
                />
              </Field>

              <Field label="How did you find us?">
                <select
                  id={id("howHeard")}
                  name="howHeard"
                  value={form.howHeard}
                  onChange={(e) => set("howHeard", e.target.value)}
                  className={cn(fieldBase, borderFor(false), !form.howHeard && "text-ink-400")}
                >
                  <option value="">Prefer not to say</option>
                  {HOW_HEARD.map((h) => (
                    <option key={h} value={h}>
                      {h}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
          )}

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
            <div
              role="alert"
              className="mt-4 rounded-xl bg-amber-50 p-3.5 text-sm text-amber-900 ring-1 ring-amber-500/25"
            >
              <p className="font-semibold">{error}</p>
              {failedToSend && (
                <p className="mt-1.5 leading-relaxed">
                  Nothing you typed is lost. Try again, or call{" "}
                  <a
                    href={`tel:${site.contact.phoneHref}`}
                    className="font-bold underline underline-offset-2"
                  >
                    {site.contact.phone}
                  </a>{" "}
                  and skip the form.
                </p>
              )}
            </div>
          )}

          {/* Navigation. Full-width primary on mobile: it is the only thing on
              screen a thumb should be reaching for. */}
          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={back}
                className="no-tap-flash inline-flex min-h-11 items-center justify-center gap-1.5 rounded-pill px-4 text-sm font-bold text-ink-500 transition-colors hover:bg-ink-50 hover:text-ink-800"
              >
                <Icon name="arrow" className="h-4 w-4 rotate-180" />
                Back
              </button>
            ) : (
              <span className="hidden sm:block" />
            )}

            <Button
              type="submit"
              size="lg"
              disabled={sending}
              className="w-full sm:w-auto sm:shrink-0"
            >
              {step < 3 ? (
                <>
                  Continue
                  <Icon name="arrow" className="h-5 w-5" />
                </>
              ) : sending ? (
                "Sending…"
              ) : (
                <>
                  <Icon name="send" className="h-5 w-5" />
                  Request my callback
                </>
              )}
            </Button>
          </div>

          <p className="mt-4 text-center text-xs leading-relaxed text-ink-400">
            No obligation and no sales calls. We use your number once, to call you back
            about this job.
          </p>
        </form>
      </div>
    </div>
  );
}
