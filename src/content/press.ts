/**
 * "As seen in" press coverage.
 *
 * THIS ARRAY SHIPS EMPTY AND MUST STAY EMPTY until Ray has real coverage with
 * a link you can click through to and read. `PressBar` renders nothing at all
 * when it is empty, and that is the correct behaviour, an absent section is
 * invisible, whereas an invented press logo is a false statement about a named
 * third party, made in public, on a page selling a service. Of every
 * placeholder in this repo this is the one that must never be filled in
 * "temporarily to see how it looks".
 *
 * When real coverage exists: add the outlet, put the outlet's own logo file in
 * /public/press/, and link `href` at the actual article, not the outlet's
 * home page.
 */

export type PressMention = {
  outlet: string;
  logoSrc: string;
  /** Link to the specific article. Omit only if the piece isn't online. */
  href?: string;
};

export const pressMentions: PressMention[] = [];
