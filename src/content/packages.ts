/**
 * What this business sells BEYOND a single service.
 *
 * One thing now: the travel rule behind the neighbor waiver `locations.ts`
 * promises.
 *
 * WHAT USED TO BE HERE, and why it isn't:
 *
 *   - Multi-service bundles, seasonal campaigns (the homepage banner and its
 *     countdown), and the discount percentages attached to all of them. The
 *     business is not running offers and does not publish prices anywhere on the
 *     site, so a "Save 20%" badge had no number to be a percentage of.
 *
 *   - The three maintenance plans (Annual Refresh, Seasonal Care, Complete
 *     Care), their month-to-month terms, and everything that rendered them:
 *     `/maintenance-plan`, the homepage `MaintenanceTeaser`, the plan links in
 *     the chat assistant, and the "at a lower rate" claims those carried.
 *     Removed at the business's direction — the plans are not being sold right
 *     now, and a product page for something nobody can buy is worse than no page
 *     at all.
 *
 * Recover any of it from git history if it comes back, rather than retyping it.
 * Note that a returning `/maintenance-plan` needs its sitemap entry back too
 * (app/sitemap.ts), which is the piece most likely to be forgotten.
 *
 * All figures are PLACEHOLDER.
 */

/* ---------------------------------------------------------------------------
   TRAVEL / SERVICE RADIUS
   locations.ts already promises a neighbor waiver on the furthest route.
   This is the rule behind it.

   Kept deliberately when the plans came out: this is a fee policy, not an
   offer. It states when a charge does and does not apply, which the city pages
   need in order to be straight about travel fees at all.
   ------------------------------------------------------------------------ */

export const travelPolicy = {
  /** Drive minutes within which there is no surcharge. */
  freeRadiusMinutes: 30,
  /** Waived when neighboring jobs are booked on the same route. */
  neighborWaiver: true,
  note: "Book alongside a neighbor on the same street and the travel fee comes off both invoices. Two jobs in one trip genuinely costs us less.",
};
