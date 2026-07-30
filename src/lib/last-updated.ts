/**
 * When the site last changed, as an ISO 8601 string.
 *
 * Resolved once at build time from the last git commit — see
 * `resolveLastUpdated` in next.config.ts, which sets NEXT_PUBLIC_LAST_UPDATED
 * and is where the mechanism is explained. Next inlines the value, so this is a
 * constant in the bundle rather than a runtime lookup.
 *
 * Two consumers, deliberately:
 *   - The footer's visible "Last updated {date}" line.
 *   - Every `lastModified` in sitemap.xml.
 *
 * The second one is the reason this exists at all. The sitemap used to stamp
 * `new Date()` on ~53 URLs on every single build, which told Google the whole
 * site changed every time anything was deployed. A `lastModified` that always
 * says "now" gets learned and then ignored, which is strictly worse than
 * omitting the field — so it now says what actually happened.
 *
 * The `??` is belt-and-braces for a runtime that somehow lost the inlined value;
 * in practice the build always sets it.
 */
export const lastUpdated = process.env.NEXT_PUBLIC_LAST_UPDATED ?? new Date().toISOString();
