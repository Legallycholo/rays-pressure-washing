"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { services, getService } from "@/content/services";
import { bundles, maintenancePlans } from "@/content/packages";
import { site, waLink } from "@/content/site";
import { Icon } from "@/components/ui/Icon";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { cn, currency } from "@/lib/utils";

/**
 * STRUCTURE.md §9.1 / CHECKLIST.md Phase 6.
 *
 * Submission POSTs to `/api/leads`, which emails the business. Photos are still
 * previewed client-side and DISCARDED on submit (open decision #4), only the
 * count travels, and the email says so, so nobody on either end is left
 * wondering where they went.
 *
 * The success state is only ever shown for a lead that actually left the
 * building. A failure keeps the visitor's answers on screen and offers the
 * phone, because the alternative (a green tick over a lead nobody received)
 * costs them a week of waiting for a call that was never coming.
 *
 * The running estimate is a deliberate ballpark: selected services' minimum
 * charges, scaled by property size and storeys, shown as a range. The honesty
 * disclaimer (faqs.ts → quote-accuracy) is rendered beside it.
 */

type FormState = {
  services: string[];
  propertyType: "" | "house" | "townhouse" | "commercial";
  storeys: 1 | 2 | 3;
  size: "" | "small" | "medium" | "large" | "xl";
  notes: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  timing: string;
  plan: string;
};

const EMPTY: FormState = {
  services: [],
  propertyType: "",
  storeys: 1,
  size: "",
  notes: "",
  name: "",
  phone: "",
  email: "",
  address: "",
  timing: "",
  plan: "",
};

const SIZES = [
  { id: "small", label: "Small", hint: "under 1,500 sq ft", mult: 1 },
  { id: "medium", label: "Medium", hint: "1,500–2,500 sq ft", mult: 1.3 },
  { id: "large", label: "Large", hint: "2,500–4,000 sq ft", mult: 1.7 },
  { id: "xl", label: "Very large", hint: "over 4,000 sq ft", mult: 2.2 },
] as const;

const STORAGE_KEY = "quote-wizard-v1";
const STEPS = ["Services", "Property", "Photos", "Contact"] as const;

/**
 * Hands the lead to `/api/leads`. Resolves only if it was actually sent,
 * everything else throws, and the caller keeps the visitor on the form.
 */
async function submitLead(payload: object) {
  const res = await fetch("/api/leads", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ kind: "quote", ...payload }),
  });

  if (!res.ok) {
    // The route writes messages meant to be read by a customer, so prefer its
    // wording over a generic one, it knows whether this was rate limiting, a
    // validation problem or a dead sender.
    const detail = await res.json().catch(() => null);
    throw new Error(detail?.error || "That didn't send.");
  }
}

export function QuoteWizard() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<string[]>([]);
  const [done, setDone] = useState(false);
  const [sending, setSending] = useState(false);
  /** Set only when the send itself failed, renders the phone fallback. */
  const [sendFailed, setSendFailed] = useState(false);
  const [photos, setPhotos] = useState<{ name: string; url: string }[]>([]);
  const headingRef = useRef<HTMLElement | null>(null);
  // Callback ref: accepts any heading-ish element (h2/legend) without variance fights.
  const captureHeading = (el: HTMLElement | null) => {
    headingRef.current = el;
  };
  const hydrated = useRef(false);

  // Restore from sessionStorage, then apply URL pre-selection on top.
  useEffect(() => {
    let restored = EMPTY;
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) restored = { ...EMPTY, ...JSON.parse(raw) };
    } catch {
      /* corrupted storage, start fresh */
    }
    // Read the query from location, not useSearchParams: on a statically
    // prerendered page the hook can still be empty during this mount effect,
    // which silently dropped ?services= pre-selection from service/bundle CTAs.
    const q = new URLSearchParams(window.location.search);
    const preselect = q.get("services")?.split(",").filter((s) => getService(s)) ?? [];
    const plan = q.get("plan") ?? "";
    setForm({
      ...restored,
      services: preselect.length ? preselect : restored.services,
      plan: plan && maintenancePlans.some((p) => p.slug === plan) ? plan : restored.plan,
    });
    hydrated.current = true;
  }, []);

  // Persist (photos excluded, object URLs don't survive a refresh anyway).
  useEffect(() => {
    if (!hydrated.current) return;
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(form));
  }, [form]);

  // Step ⇄ URL hash, so browser back walks the wizard.
  useEffect(() => {
    if (!hydrated.current) return;
    if (window.location.hash !== `#step-${step}`) {
      window.location.hash = `step-${step}`;
    }
    headingRef.current?.focus();
  }, [step]);

  useEffect(() => {
    const onHash = () => {
      const m = window.location.hash.match(/^#step-(\d)$/);
      if (m) setStep(Math.min(4, Math.max(1, Number(m[1]))));
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const set = useCallback(<K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors([]);
    setSendFailed(false);
  }, []);

  const toggleService = (slug: string) =>
    set(
      "services",
      form.services.includes(slug)
        ? form.services.filter((s) => s !== slug)
        : [...form.services, slug],
    );

  // ---- Estimate ------------------------------------------------------------
  const selected = form.services.map(getService).filter((s): s is NonNullable<typeof s> => Boolean(s));
  const matchedBundle = useMemo(() => {
    const matches = bundles.filter((b) => b.serviceSlugs.every((s) => form.services.includes(s)));
    return matches.sort((a, b) => b.savingsPercent - a.savingsPercent)[0];
  }, [form.services]);

  const estimate = useMemo(() => {
    if (selected.length === 0 || !form.size) return null;
    const sizeMult = SIZES.find((s) => s.id === form.size)?.mult ?? 1;
    const storeyMult = form.storeys === 1 ? 1 : form.storeys === 2 ? 1.15 : 1.3;
    const base = selected.reduce((sum, s) => sum + s.pricing.minimum, 0) * sizeMult * storeyMult;
    const discount = matchedBundle ? 1 - matchedBundle.savingsPercent / 100 : 1;
    return { low: Math.round((base * discount) / 10) * 10, high: Math.round((base * discount * 1.5) / 10) * 10 };
  }, [selected, form.size, form.storeys, matchedBundle]);

  // ---- Validation ----------------------------------------------------------
  const validate = (s: number): string[] => {
    if (s === 1 && form.services.length === 0) return ["Pick at least one service, or your best guess. We'll confirm on site."];
    if (s === 2) {
      const errs: string[] = [];
      if (!form.propertyType) errs.push("Tell us the property type.");
      if (!form.size) errs.push("Pick the closest size. A rough guess is fine.");
      return errs;
    }
    if (s === 4) {
      const errs: string[] = [];
      if (!form.name.trim()) errs.push("We need a name to put on the quote.");
      if (!/^[\d\s()+-]{7,}$/.test(form.phone)) errs.push("That phone number doesn't look complete.");
      if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.push("That email doesn't look right.");
      if (!form.address.trim()) errs.push("We need the property address to quote accurately.");
      return errs;
    }
    return [];
  };

  const next = async () => {
    const errs = validate(step);
    if (errs.length) return setErrors(errs);
    if (step < 4) return setStep(step + 1);

    // Final submit. Nothing is torn down, not the object URLs, not the saved
    // draft, until the lead is confirmed away, so a failure leaves the visitor
    // exactly where they were with everything they typed still in front of them.
    setSending(true);
    setSendFailed(false);
    setErrors([]);
    try {
      await submitLead({
        ...form,
        photoCount: photos.length,
        estimate,
        bundle: matchedBundle?.slug ?? null,
      });
    } catch (err) {
      setSending(false);
      setSendFailed(true);
      setErrors([(err as Error).message]);
      return;
    }

    photos.forEach((p) => URL.revokeObjectURL(p.url));
    sessionStorage.removeItem(STORAGE_KEY);
    setSending(false);
    setDone(true);
  };

  const addPhotos = (files: FileList | null) => {
    if (!files) return;
    setPhotos((prev) => [
      ...prev,
      ...Array.from(files)
        .slice(0, 8 - prev.length)
        .map((f) => ({ name: f.name, url: URL.createObjectURL(f) })),
    ]);
  };

  // ---- Success state -------------------------------------------------------
  if (done) {
    return (
      <div className="mx-auto max-w-xl rounded-card bg-white p-10 text-center shadow-lift ring-1 ring-ink-900/5">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-leaf-400/20">
          <Icon name="check" className="h-8 w-8 text-leaf-600" />
        </span>
        <h2 className="mt-5 font-display text-3xl text-ink-900">Got it, {form.name.split(" ")[0] || "thanks"}.</h2>
        <p className="mt-3 leading-relaxed text-ink-500">
          Your quote request is in. We&apos;ll come back to you the same business day,
          usually within a couple of hours. Want an answer faster?
        </p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <Button href={`tel:${site.contact.phoneHref}`} variant="secondary">
            <Icon name="phone" className="h-4 w-4" />
            Call {site.contact.phone}
          </Button>
          <Button href={waLink("Hi! I just sent a quote request through the website.")} variant="outline">
            WhatsApp us
          </Button>
        </div>
      </div>
    );
  }

  // ---- Wizard --------------------------------------------------------------
  return (
    <div className="mx-auto max-w-2xl">
      {/* Progress */}
      <ol className="flex items-center gap-2" aria-label="Progress">
        {STEPS.map((label, i) => {
          const n = i + 1;
          const state = n < step ? "done" : n === step ? "current" : "todo";
          return (
            <li key={label} className="flex flex-1 flex-col items-center gap-1.5">
              <span
                className={cn(
                  "grid h-9 w-9 place-items-center rounded-full text-sm font-bold transition-colors",
                  state === "done" && "bg-leaf-500 text-white",
                  state === "current" && "bg-ink-900 text-white",
                  state === "todo" && "bg-sand-100 text-ink-400",
                )}
                aria-current={state === "current" ? "step" : undefined}
              >
                {state === "done" ? <Icon name="check" className="h-4 w-4" /> : n}
              </span>
              <span className={cn("text-xs font-semibold", state === "current" ? "text-ink-900" : "text-ink-400")}>
                {label}
              </span>
            </li>
          );
        })}
      </ol>

      <div className="mt-8 rounded-card bg-white p-6 shadow-card ring-1 ring-ink-900/5 sm:p-8">
        {/* STEP 1: services */}
        {step === 1 && (
          <fieldset>
            <legend ref={captureHeading} tabIndex={-1} className="font-display text-2xl text-ink-900 outline-none">
              What needs cleaning?
            </legend>
            <p className="mt-1.5 text-sm text-ink-500">Pick everything that applies. Bundling saves money.</p>
            <ul className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {services.map((s) => {
                const on = form.services.includes(s.slug);
                return (
                  <li key={s.slug}>
                    <button
                      type="button"
                      onClick={() => toggleService(s.slug)}
                      aria-pressed={on}
                      className={cn(
                        "flex h-full w-full flex-col items-center gap-2 rounded-card p-4 text-center transition-all",
                        on
                          ? "bg-harbor-600 text-white shadow-glow"
                          : "bg-sand-50 text-ink-700 ring-1 ring-ink-900/5 hover:ring-harbor-400",
                      )}
                    >
                      <Icon name={s.icon} className={cn("h-6 w-6", on ? "text-white" : "text-harbor-600")} />
                      <span className="text-xs font-semibold leading-tight">{s.navLabel}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
            {matchedBundle && (
              <p className="mt-4 rounded-card bg-leaf-400/10 p-3.5 text-sm text-ink-700 ring-1 ring-leaf-500/25">
                <Icon name="sparkle" className="mr-1.5 inline h-4 w-4 text-leaf-600" />
                That&apos;s our <strong>{matchedBundle.name}</strong> package:{" "}
                <strong>{matchedBundle.savingsPercent}% off</strong> booked together. Applied automatically.
              </p>
            )}
          </fieldset>
        )}

        {/* STEP 2: property */}
        {step === 2 && (
          <div>
            <h2 ref={captureHeading} tabIndex={-1} className="font-display text-2xl text-ink-900 outline-none">
              About the property
            </h2>
            <fieldset className="mt-5">
              <legend className="text-sm font-bold text-ink-700">Property type</legend>
              <div className="mt-2 grid grid-cols-3 gap-3">
                {(["house", "townhouse", "commercial"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => set("propertyType", t)}
                    aria-pressed={form.propertyType === t}
                    className={cn(
                      "rounded-card p-3 text-sm font-semibold capitalize transition-all",
                      form.propertyType === t
                        ? "bg-harbor-600 text-white"
                        : "bg-sand-50 text-ink-700 ring-1 ring-ink-900/5 hover:ring-harbor-400",
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </fieldset>
            <fieldset className="mt-5">
              <legend className="text-sm font-bold text-ink-700">Floors</legend>
              <div className="mt-2 grid grid-cols-3 gap-3">
                {([1, 2, 3] as const).map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => set("storeys", n)}
                    aria-pressed={form.storeys === n}
                    className={cn(
                      "rounded-card p-3 text-sm font-semibold transition-all",
                      form.storeys === n
                        ? "bg-harbor-600 text-white"
                        : "bg-sand-50 text-ink-700 ring-1 ring-ink-900/5 hover:ring-harbor-400",
                    )}
                  >
                    {n === 3 ? "3+" : n}
                  </button>
                ))}
              </div>
            </fieldset>
            <fieldset className="mt-5">
              <legend className="text-sm font-bold text-ink-700">Approximate size</legend>
              <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {SIZES.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => set("size", s.id)}
                    aria-pressed={form.size === s.id}
                    className={cn(
                      "flex flex-col rounded-card p-3 text-left transition-all",
                      form.size === s.id
                        ? "bg-harbor-600 text-white"
                        : "bg-sand-50 text-ink-700 ring-1 ring-ink-900/5 hover:ring-harbor-400",
                    )}
                  >
                    <span className="text-sm font-semibold">{s.label}</span>
                    <span className={cn("text-xs", form.size === s.id ? "text-harbor-100" : "text-ink-400")}>
                      {s.hint}
                    </span>
                  </button>
                ))}
              </div>
            </fieldset>
          </div>
        )}

        {/* STEP 3: photos */}
        {step === 3 && (
          <div>
            <h2 ref={captureHeading} tabIndex={-1} className="font-display text-2xl text-ink-900 outline-none">
              Show us the problem <span className="text-base font-sans font-normal text-ink-400">(optional)</span>
            </h2>
            <p className="mt-1.5 text-sm text-ink-500">
              A couple of phone photos makes your quote dramatically more accurate.
            </p>
            <label className="mt-5 flex cursor-pointer flex-col items-center gap-2 rounded-card border-2 border-dashed border-ink-200 bg-sand-50 p-8 text-center transition-colors hover:border-harbor-400">
              <Icon name="camera" className="h-8 w-8 text-harbor-500" />
              <span className="text-sm font-semibold text-ink-700">Add photos</span>
              <span className="text-xs text-ink-400">Up to 8 · JPG, PNG or HEIC</span>
              <input
                type="file"
                accept="image/*"
                multiple
                className="sr-only"
                onChange={(e) => addPhotos(e.target.files)}
              />
            </label>
            {photos.length > 0 && (
              <ul className="mt-4 grid grid-cols-4 gap-3">
                {photos.map((p) => (
                  <li key={p.url} className="relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.url} alt={p.name} className="aspect-square w-full rounded-lg object-cover" />
                    <button
                      type="button"
                      aria-label={`Remove ${p.name}`}
                      onClick={() => {
                        URL.revokeObjectURL(p.url);
                        setPhotos((prev) => prev.filter((x) => x.url !== p.url));
                      }}
                      className="absolute -right-1.5 -top-1.5 grid h-6 w-6 place-items-center rounded-full bg-ink-900 text-white"
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <label className="mt-5 block">
              <span className="text-sm font-bold text-ink-700">Anything else we should know?</span>
              <textarea
                value={form.notes}
                onChange={(e) => set("notes", e.target.value)}
                rows={3}
                placeholder="Gate codes, fragile plants, that one stain that won't budge…"
                className="mt-2 w-full rounded-card border border-ink-200 p-3.5 text-base sm:text-sm text-ink-800 placeholder:text-ink-300 focus:border-harbor-500"
              />
            </label>
          </div>
        )}

        {/* STEP 4: contact */}
        {step === 4 && (
          <div>
            <h2 ref={captureHeading} tabIndex={-1} className="font-display text-2xl text-ink-900 outline-none">
              Where do we send the quote?
            </h2>
            {/* `text-base sm:text-sm` on every field below, and on every other
                input on this site, is not a type-scale decision. iOS Safari
                zooms the whole page when you focus an input smaller than 16px
                and never zooms back out, so the visitor types their address
                into a page that is now wider than their screen, and stays
                there for the rest of the session. 16px on mobile, 14px from
                `sm` up where the behaviour doesn't exist. */}
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {(
                [
                  ["name", "Name", "text", "Jordan Rivera"],
                  ["phone", "Phone", "tel", "(555) 000-0000"],
                  ["email", "Email", "email", "you@example.com"],
                  ["address", "Property address", "text", "123 Street, City"],
                ] as const
              ).map(([key, label, type, ph]) => (
                <label key={key} className={cn("block", key === "address" && "sm:col-span-2")}>
                  <span className="text-sm font-bold text-ink-700">{label}</span>
                  <input
                    type={type}
                    value={form[key]}
                    onChange={(e) => set(key, e.target.value)}
                    placeholder={ph}
                    autoComplete={key === "address" ? "street-address" : key}
                    className="mt-2 w-full rounded-card border border-ink-200 p-3.5 text-base sm:text-sm text-ink-800 placeholder:text-ink-300 focus:border-harbor-500"
                  />
                </label>
              ))}
              <label className="block sm:col-span-2">
                <span className="text-sm font-bold text-ink-700">When suits you?</span>
                <select
                  value={form.timing}
                  onChange={(e) => set("timing", e.target.value)}
                  className="mt-2 w-full rounded-card border border-ink-200 bg-white p-3.5 text-base sm:text-sm text-ink-800 focus:border-harbor-500"
                >
                  <option value="">No preference</option>
                  <option value="asap">As soon as possible</option>
                  <option value="2weeks">In the next two weeks</option>
                  <option value="month">Sometime this month</option>
                  <option value="flexible">Flexible / just pricing it up</option>
                </select>
              </label>
            </div>
          </div>
        )}

        {/* Errors. A failed send is the same box with a way out attached: the
            visitor has already done four steps of work and telling them it
            didn't go through without offering an alternative wastes all of it. */}
        {errors.length > 0 && (
          <div role="alert" className="mt-5 rounded-card bg-amber-50 p-4 text-sm text-amber-800 ring-1 ring-amber-500/20">
            <ul className="space-y-1.5">
              {errors.map((e) => (
                <li key={e}>{e}</li>
              ))}
            </ul>
            {sendFailed && (
              <p className="mt-2.5 border-t border-amber-500/20 pt-2.5 leading-relaxed">
                Nothing you typed is lost. Try Send again, or skip us entirely and call{" "}
                <a
                  href={`tel:${site.contact.phoneHref}`}
                  className="font-bold underline underline-offset-2"
                >
                  {site.contact.phone}
                </a>
                . Someone will take the details down.
              </p>
            )}
          </div>
        )}

        {/* Running estimate, visible from step 2 (§9.1) */}
        {step >= 2 && estimate && (
          <aside className="mt-6 rounded-card bg-ink-900 p-5 text-white harbor-mesh">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-leaf-400">Your running estimate</p>
                <p className="mt-1 font-display text-3xl font-bold">
                  {currency(estimate.low)} – {currency(estimate.high)}
                </p>
              </div>
              {matchedBundle && <Badge tone="onDark">{matchedBundle.name} · −{matchedBundle.savingsPercent}%</Badge>}
            </div>
            <p className="mt-2.5 text-xs leading-relaxed text-ink-300">
              A genuine ballpark from your answers so far, not a lead-capture trick. If the
              property measures up as described, the final quote lands inside this range.
            </p>
          </aside>
        )}

        {/* Nav */}
        <div className="mt-7 flex items-center justify-between gap-3 border-t border-ink-100 pt-6">
          {step > 1 ? (
            <Button variant="ghost" onClick={() => setStep(step - 1)}>
              Back
            </Button>
          ) : (
            <span />
          )}
          <Button onClick={next} disabled={sending}>
            {step === 4 ? (sending ? "Sending…" : "Send My Quote Request") : "Continue"}
            <Icon name="arrow" className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <p className="mt-5 text-center text-xs text-ink-400">
        No spam, no reselling your details, no obligation. Prefer a human?{" "}
        <a href={`tel:${site.contact.phoneHref}`} className="font-semibold text-harbor-700 underline underline-offset-2">
          {site.contact.phone}
        </a>
      </p>
    </div>
  );
}
