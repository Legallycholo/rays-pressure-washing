import type { Metadata } from "next";
import { site, cityState, formatHour } from "@/content/site";
import { locations } from "@/content/locations";
import { Hero } from "@/components/sections/Hero";
import { CoverageMap } from "@/components/sections/CoverageMap";
import { ContactForm } from "@/components/ContactForm";
import { Section } from "@/components/ui/Section";
import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Contact Us",
  description: `Call, text or email ${site.name} in ${cityState}, or submit the form and we'll get back to you within 24 hours.`,
  alternates: { canonical: "/contact" },
};

const crumbs = [
  { name: "Home", href: "/" },
  { name: "Contact", href: "/contact" },
];

export default function ContactPage() {
  const channels = [
    { icon: "phone", label: "Call", value: site.contact.phone, href: `tel:${site.contact.phoneHref}`, note: "Fastest during work hours" },
    { icon: "phone", label: "Text", value: site.contact.phone, href: `sms:${site.contact.phoneHref}`, note: "Photos welcome" },
    { icon: "mail", label: "Email", value: site.contact.email, href: `mailto:${site.contact.email}`, note: "Same business day" },
  ];

  return (
    <>
      <JsonLd data={breadcrumbSchema(crumbs)} />
      {/*
        Two rewrites, both deliberate — the history matters because it is easy
        to "fix" this back into either of the versions already rejected.

        1. "Talk to a human" (original). Sold the *channel* rather than the
           action, and it is chatbot-escape-hatch language: the phrase you click
           when software has already failed you. On the page that IS the primary
           conversion, that framing says the hard part is still ahead of you.

        2. A pricing-framed headline, with a lede promising a real price on the
           callback. This broke a standing owner directive — OPTIMIZATION.md
           item 3, which states the business does not want to offer pricing or
           estimates anywhere on the site right now (it may return later), and
           that every CTA is either "Call now" or "Submit the form, get
           contacted within 24 hours". That directive is why `/pricing` is a
           404, why the wizard and ballpark calculator components were deleted,
           and why `ContactForm` carries an explicit "does not price, estimate,
           or ask for square footage" note. It also has teeth: OPTIMIZATION.md
           item 75 keeps a verification grep for exactly that class of CTA copy,
           and the rejected headline and badge here both tripped it.

           Note for whoever edits this next: do not paste the rejected wording
           back into this comment to explain it. Item 75's grep is a plain
           line-based scan and cannot tell a live string from a description of
           a dead one — spelling it out here re-breaks the check permanently.

        The wording below comes from the directive itself: submit the form, get
        contacted. It promises only what is entirely within the business's
        control. "Within 24 hours" rather than "same business day" for the same
        reason, and because it then agrees with the form section's own line and
        the page metadata instead of quietly outbidding both.

        If this needs another pass, keep the constraint rather than the wording:
        no price, no pricing language. Promise the callback, not a number.
      */}
      <Hero
        variant="page"
        breadcrumbs={crumbs}
        title="Send us your details"
        lede="Fill in the form and we'll call you back within 24 hours to set up a time. Or call now and skip the form entirely."
        extras={
          <Badge tone="onDark">
            <Icon name="check" className="h-3.5 w-3.5 text-leaf-400" />
            No obligation, no hard sell
          </Badge>
        }
      />

      <Section tone="light">
        {/*
          The form is the conversion and it leads the page.

          `order` rather than markup order: on a phone the form comes first,
          because someone who scrolled past three contact channels to get here
          has already decided not to call. On desktop it sits right, where the
          eye lands last and the channels read as the faster alternative.
        */}
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="order-2 lg:order-1 lg:col-span-5">
            <div className="mb-6">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-leaf-600">
                Rather not wait
              </p>
              <h2 className="mt-2 font-display text-2xl text-ink-900 sm:text-3xl">
                Reach us direct
              </h2>
            </div>
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              {channels.map((c) => (
                <li key={c.label}>
                  <a
                    href={c.href}
                    {...(c.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="flex items-center gap-4 rounded-card bg-sand-50 p-4 ring-1 ring-ink-900/5 transition-all hover:-translate-y-0.5 hover:ring-harbor-400"
                  >
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white text-harbor-600 ring-1 ring-ink-900/5">
                      <Icon name={c.icon} className="h-5 w-5" />
                    </span>
                    <span className="min-w-0">
                      <span className="block font-semibold text-ink-800 [overflow-wrap:anywhere]">
                        {c.label}: {c.value}
                      </span>
                      <span className="text-xs text-ink-400">{c.note}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>

            <address className="mt-8 space-y-3 text-sm not-italic text-ink-600">
              <p className="flex items-start gap-2.5">
                <Icon name="pin" className="mt-0.5 h-4 w-4 shrink-0 text-harbor-600" />
                {site.address.street}, {cityState} {site.address.postalCode}
              </p>
              <div className="flex items-start gap-2.5">
                <Icon name="clock" className="mt-0.5 h-4 w-4 shrink-0 text-harbor-600" />
                <dl>
                  {site.hours.map((h) => (
                    <div key={h.days} className="flex gap-3">
                      <dt className="w-36 font-medium text-ink-700">{h.days}</dt>
                      <dd>
                        {h.close ? `${formatHour(h.open)} – ${formatHour(h.close)}` : "Closed"}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </address>
          </div>

          <div className="order-1 lg:order-2 lg:col-span-7">
            <div className="mb-6">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-leaf-600">
                Request a callback
              </p>
              <h2 className="mt-2 font-display text-2xl text-ink-900 sm:text-3xl">
                Tell us what needs cleaning
              </h2>
              <p className="mt-2 max-w-md leading-relaxed text-ink-600">
                Three quick steps, about thirty seconds. We call you back within 24 hours
                with a time that works.
              </p>
            </div>
            <ContactForm />
          </div>
        </div>
      </Section>

      <Section tone="sand">
        <div className="mx-auto max-w-2xl">
          <CoverageMap locations={locations} />
        </div>
      </Section>
    </>
  );
}
