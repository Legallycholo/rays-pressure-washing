import { site } from "@/content/site";
import { Icon } from "@/components/ui/Icon";

/**
 * Mobile-only persistent action bar.
 *
 * Rationale: the majority of local-service traffic is mobile, and most of it
 * arrives ready to contact someone rather than to read. Two taps, always
 * reachable, no scroll required. Hidden on desktop where the header CTA is
 * already permanently visible.
 *
 * The <body> bottom padding in layout.tsx accounts for its height so it never
 * covers footer content.
 */
export function StickyCallBar() {
  return (
    <div
      // The safe-area padding keeps the row of actions clear of the iOS home
      // indicator. It's 0px everywhere else, and `--callbar-height` (globals.css)
      // is what <body> and ContactHub both offset against, so the three stay
      // in agreement.
      className="no-tap-flash fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-ink-900/95 pb-[var(--safe-bottom)] backdrop-blur-lg lg:hidden"
    >
      <div className="grid grid-cols-2 divide-x divide-white/10">
        <a
          href={`tel:${site.contact.phoneHref}`}
          className="flex flex-col items-center gap-1 py-3 text-white active:bg-white/10"
        >
          <Icon name="phone" className="h-5 w-5 text-harbor-400" />
          <span className="text-xs font-semibold">Call</span>
        </a>
        <a
          href="/contact"
          className="flex flex-col items-center gap-1 bg-amber-400 py-3 text-ink-950 active:bg-amber-500"
        >
          <Icon name="sparkle" className="h-5 w-5" />
          <span className="text-xs font-bold">Request Callback</span>
        </a>
      </div>
    </div>
  );
}
