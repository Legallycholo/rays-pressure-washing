/**
 * Rewrite the current URL's query string in place, without a navigation.
 *
 * Why this exists rather than `router.replace()`:
 *
 * On a statically prerendered route that was *hard-loaded* with search params
 * already in the address bar, the App Router treats the first same-route
 * `replace()` as a no-op, the URL never changes and `useSearchParams()` never
 * re-fires. Soft navigations into the same route are unaffected, which is why
 * the bug is invisible in normal clicking around and only shows up for the one
 * case that matters: someone opening a shared `/gallery?service=…` link and
 * then touching a filter. Verified against Next 16.2 with a headless browser.
 *
 * `window.history.replaceState` is the App Router's documented escape hatch,
 * Next patches it and syncs `usePathname` / `useSearchParams` from it, and it
 * behaves identically on hard loads and soft navigations.
 *
 * Use this for state that should *not* create a history entry (filters, closing
 * a dialog). For state that should (opening a dialog), use a plain <Link>.
 */
export function replaceQuery(pathname: string, params: URLSearchParams) {
  const qs = params.toString();
  window.history.replaceState(null, "", `${pathname}${qs ? `?${qs}` : ""}`);
}
