import { site, cityState } from "@/content/site";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Icon } from "@/components/ui/Icon";

/**
 * The Google Business Profile map embed, on the homepage.
 *
 * WHY THIS EXISTS ALONGSIDE `CoverageMap`. They answer different questions and
 * neither replaces the other. `CoverageMap` is our own SVG: it shows *which
 * towns we cover*, weightless and styled to the site. This shows *where the
 * business physically is*, straight from Google, and it is a local-SEO item —
 * an embedded map on the GBP landing page is a standard corroboration signal
 * that the site and the Business Profile describe one business at one address.
 *
 * This reverses the "considered and deliberately not done" note in
 * `CoverageMap`, which rejected a map embed because it meant a third-party
 * script, an API key and a billing decision. That reasoning applied to the
 * Maps JavaScript API and the keyed Embed API. This uses neither: it is the
 * plain `output=embed` iframe, which needs no key, no account and no billing,
 * and ships no JavaScript into the page. The objection was correct about the
 * thing it was aimed at; it does not apply to this.
 *
 * COSTS, HONESTLY. It is still a third-party iframe: it sets Google cookies and
 * it is weight. Mitigated as far as it can be — `loading="lazy"` so it costs
 * nothing until scrolled to, and it sits low on the page. Worth it for the
 * ranking signal; not worth putting above the fold.
 *
 * ── UPGRADE PATH (do this once, by hand) ────────────────────────────────────
 *
 * `site.mapEmbedUrl` is currently unset, so this falls back to an address
 * query. That pins the right location but shows a plain address marker, NOT
 * the business listing.
 *
 * The version that shows the actual Business Profile — name, star rating,
 * hours, photos — cannot be constructed from an address, because it contains a
 * Google-generated place identifier. To get it: open the Business Profile on
 * Google Maps → Share → Embed a map → copy the `src` out of the iframe →
 * paste it into `site.mapEmbedUrl`. Nothing else needs to change.
 */
export function GoogleMapEmbed({ tone = "sand" }: { tone?: "light" | "sand" }) {
  const fallbackQuery = encodeURIComponent(
    `${site.legalName}, ${site.address.street}, ${site.address.city}, ${site.address.region} ${site.address.postalCode}`,
  );
  const src =
    site.mapEmbedUrl || `https://maps.google.com/maps?q=${fallbackQuery}&z=12&output=embed`;

  return (
    <Section tone={tone}>
      <SectionHeading
        eyebrow="Find us"
        title={`Based in ${cityState}`}
        lede={`We work out of ${site.address.city} and cover ${site.serviceRegion}. Closer than whoever is driving out from Columbia.`}
      />

      <div className="mt-12 overflow-hidden rounded-2xl shadow-card ring-1 ring-ink-900/10 sm:mt-16">
        <iframe
          // Not decorative: it names the business and its location, which is the
          // whole point of the embed being here.
          title={`Map showing ${site.legalName} in ${cityState}`}
          src={src}
          loading="lazy"
          // No `allowFullScreen`: this is an orientation aid, not a map app. The
          // "Get directions" link below does the job people actually want.
          referrerPolicy="no-referrer-when-downgrade"
          className="block h-[22rem] w-full border-0 sm:h-[26rem]"
        />
      </div>

      {/* NAP under the map, in text. The iframe's contents are not crawlable as
          this page's content, so the address a crawler reads here has to be
          real markup — this is the pairing that makes the embed worth having. */}
      <div className="mt-6 flex flex-col items-center gap-2 text-center">
        <p className="font-semibold text-ink-900">{site.legalName}</p>
        <p className="text-ink-600">
          {site.address.street}, {site.address.city}, {site.address.region}{" "}
          {site.address.postalCode}
        </p>
        <a
          href={`tel:${site.contact.phoneHref}`}
          className="font-semibold text-harbor-700 underline-offset-2 hover:underline"
        >
          {site.contact.phone}
        </a>
        <a
          href={site.googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1 inline-flex items-center gap-1.5 text-sm font-semibold text-harbor-700 hover:text-harbor-800"
        >
          Get directions
          <Icon name="arrow" className="h-4 w-4" />
        </a>
      </div>
    </Section>
  );
}
