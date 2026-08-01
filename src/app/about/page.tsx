import type { Metadata } from "next";
import { site, cityState, guaranteeName } from "@/content/site";
import { stats } from "@/content/stats";
import { locations } from "@/content/locations";
import { getFaqs } from "@/content/faqs";
import { Hero } from "@/components/sections/Hero";
import { StatsRow } from "@/components/sections/StatsRow";
import { GuaranteeBand } from "@/components/sections/GuaranteeBand";
import { ServiceAreaSection } from "@/components/sections/ServiceAreaSection";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { FaqSection } from "@/components/sections/FaqSection";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Icon } from "@/components/ui/Icon";
import { Placeholder } from "@/components/ui/Placeholder";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema, personSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "About Us",
  description: `${site.name}: locally owned residential and commercial exterior cleaning, based in ${cityState}.`,
  alternates: { canonical: "/about" },
};

const crumbs = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
];

export default function AboutPage() {
  return (
    <>
      {/* The #ray Person node lives here, on the page about him, and is
          referenced by @id as the author of every article and the founder of the
          business. Named, attributable expertise is what answer engines are
          willing to cite — see personSchema in lib/schema.ts. */}
      <JsonLd data={[personSchema(), breadcrumbSchema(crumbs)]} />
      <Hero
        variant="page"
        breadcrumbs={crumbs}
        title={`The local crew that treats your place like the ${guaranteeName.toLowerCase()} depends on it`}
        lede={`Because it does. ${site.name} washes homes and businesses across ${site.serviceRegion}, and has for years. Same owner, same standard, same trucks you see around town.`}
        primaryCta={{ label: "Request a Callback", href: "/contact" }}
      />

      <StatsRow stats={stats} tone="hydro" />

      {/* Story */}
      <Section tone="light">
        <div className="grid items-center gap-10 md:grid-cols-2 lg:gap-16">
          <div>
            <SectionHeading
              align="left"
              eyebrow="Our story"
              title="Started with one machine and a stubborn streak"
            />
            <div className="mt-6 space-y-4 leading-relaxed text-ink-600">
              <p>
                {/* DRAFT COPY: replace with the real founding story at launch.
                    Deliberately no founding year: the one that used to be here
                    was placeholder data. Add it back once it is confirmed. */}
                Ray started this company with a trailer, a pressure washer, and a
                low tolerance for the wand-stripe driveways and blasted siding
                other outfits were leaving behind. The bet was simple: learn the
                right method for every surface, quote it straight, and let the
                before-and-afters do the selling.
              </p>
              <p>
                The big jobs are what sharpened it. One property can be a wall of
                glass, a deck that never dries, stone or stucco holding humidity,
                and a driveway long enough that one bad pass shows forever. Four
                surfaces, four settings, one visit. You cannot do that with one
                machine and one nozzle, and finding that out is what turned a
                pressure washing business into a method one — which is the same
                reason the storefronts and offices we clean now get the same
                treatment as the houses.
              </p>
              <p>
                Today it&apos;s a small crew, trained on every material we touch, but
                it&apos;s still the same bet. If you can see it
                after we leave, we come back. That&apos;s not a slogan; it&apos;s the
                guarantee.
              </p>
            </div>
          </div>
          <Placeholder label="Founder / crew photo: the real people, not stock" ratio="4/3" icon="camera" />
        </div>
      </Section>

      {/* Team placeholders */}
      <Section tone="sand">
        <SectionHeading eyebrow="The crew" title="Who shows up" />
        <ul className="mx-auto mt-12 grid max-w-4xl gap-6 sm:grid-cols-3">
          {["Ray, owner & lead tech", "Crew member, soft wash", "Crew member, flatwork"].map((label) => (
            <li key={label} className="flex flex-col items-center gap-3 text-center">
              <Placeholder label={label} ratio="1/1" className="w-full max-w-[14rem] rounded-full" icon="camera" />
              <p className="text-sm font-semibold text-ink-700">{label}</p>
            </li>
          ))}
        </ul>
        <ul className="mx-auto mt-10 flex max-w-2xl flex-wrap justify-center gap-2">
          {site.credentials.map((c) => (
            <li key={c} className="inline-flex items-center gap-2 rounded-pill bg-white px-4 py-2 text-sm font-medium text-ink-700 ring-1 ring-ink-900/5">
              <Icon name="shield" className="h-4 w-4 text-leaf-600" />
              {c}
            </li>
          ))}
        </ul>
      </Section>

      <HowItWorks />
      <GuaranteeBand guarantee={site.guarantee} />
      <ServiceAreaSection locations={locations} tone="light" />
      <FaqSection
        items={getFaqs(["need-to-be-home", "plants-safe", "payment", "weather"])}
        groupName="faq-about"
      />
    </>
  );
}
