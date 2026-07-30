/**
 * Site-wide video. Lives here rather than in `site.ts` because `site.ts` is a
 * frozen `as const` block of business *identity* (name, phone, address) and
 * media paths are a different kind of fact with a different update cadence
 * (identity changes once; footage gets re-shot).
 *
 * Everything ships as an empty string. Components detect that and render the
 * standard placeholder frame at the final aspect ratio, so the layout is
 * signed off before a camera comes out. Drop files into /public/video/ and
 * fill in the paths, nothing else needs to change.
 *
 * Direct video files only. If Ray's footage ends up on YouTube or Vimeo,
 * that is an iframe plus a third-party-cookie consent decision, and it is a
 * separate piece of work, do not quietly point `src` at an embed URL.
 */

export type SiteVideo = {
  /** Path to an .mp4 (H.264/AAC is the safe universal choice). */
  src: string;
  /** First-frame still. Doubles as the reduced-motion and no-JS fallback. */
  poster: string;
  /** WebVTT captions. Empty → no <track> is rendered at all. */
  captionsSrc?: string;
  /** Describes the footage for anyone who can't see it. */
  alt: string;
  /**
   * What a viewer actually sees in the reel, rendered as the checkmark list
   * beside the player. These are claims, keep them true to the footage.
   */
  highlights: string[];
};

export const siteVideo: SiteVideo = {
  src: "", // PLACEHOLDER: /public/video/reel.mp4
  poster: "", // PLACEHOLDER: /public/video/reel-poster.jpg
  captionsSrc: "", // PLACEHOLDER: /public/video/reel.vtt
  alt: "Crew walkthrough of a full exterior clean, from setup to final rinse",
  highlights: [
    "The actual crew and the actual truck, not stock footage",
    "Soft washing at low pressure on siding, screens and railings",
    "Surface cleaner passes that leave no wand striping",
    "Plants covered and rinsed before, during and after",
    "The walk-round we do with you before we pack up",
  ],
};
