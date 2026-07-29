import type { Metadata } from "next";
import { site, waLink, cityState } from "@/content/site";
import { locations } from "@/content/locations";
import { Hero } from "@/components/sections/Hero";
import { CoverageMap } from "@/components/sections/CoverageMap";
import { ContactForm } from "@/components/ContactForm";
import { Section } from "@/components/ui/Section";
import { Icon } from "@/components/ui/Icon";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Contact Us",
  description: `Call, text, WhatsApp or email ${site.name} in ${cityState}. Same-business-day replies.`,
  alternates: { canonical: "/contact" },
};

const crumbs = [
  { name: "Home", href: "/" },
  { name: "Contact", href: "/contact" },
];

export default function ContactPage() {
  const channels = [
    { icon: "phone", label: "Call", value: site.contact.phone, href: `tel:${site.contact.phoneHref}`, note: "Fastest during work hours" },
    { icon: "whatsapp", label: "WhatsApp", value: "Message us", href: waLink(), note: "Fastest after hours" },
    { icon: "phone", label: "Text", value: site.contact.phone, href: `sms:${site.contact.phoneHref}`, note: "Photos welcome" },
    { icon: "mail", label: "Email", value: site.contact.email, href: `mailto:${site.contact.email}`, note: "Same business day" },
  ];

  return (
    <>
      <JsonLd data={breadcrumbSchema(crumbs)} />
      <Hero
        variant="page"
        breadcrumbs={crumbs}
        title="Talk to a human"
        lede="Pick whichever channel you actually use. They all reach the same small crew, and they all get answered the same business day."
      />

      <Section tone="light">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              {channels.map((c) => (
                <li key={c.label}>
                  <a
                    href={c.href}
                    {...(c.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="flex items-center gap-4 rounded-card bg-sand-50 p-4 ring-1 ring-ink-900/5 transition-all hover:-translate-y-0.5 hover:ring-hydro-400"
                  >
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white text-hydro-600 ring-1 ring-ink-900/5">
                      <Icon name={c.icon} filled={c.icon === "whatsapp"} className="h-5 w-5" />
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
                <Icon name="pin" className="mt-0.5 h-4 w-4 shrink-0 text-hydro-600" />
                {site.address.street}, {cityState} {site.address.postalCode}
              </p>
              <div className="flex items-start gap-2.5">
                <Icon name="clock" className="mt-0.5 h-4 w-4 shrink-0 text-hydro-600" />
                <dl>
                  {site.hours.map((h) => (
                    <div key={h.days} className="flex gap-3">
                      <dt className="w-32 font-medium text-ink-700">{h.days}</dt>
                      <dd>{h.open === "Closed" ? "Closed" : `${h.open} – ${h.close}`}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </address>
          </div>

          <div className="lg:col-span-7">
            <h2 className="font-display text-2xl text-ink-900">Or write it down</h2>
            <div className="mt-5">
              <ContactForm />
            </div>
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
