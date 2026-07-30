import { execSync } from "node:child_process";
import type { NextConfig } from "next";

/**
 * Timestamp behind the visible "Last updated" line in the footer and every
 * `lastModified` in sitemap.xml. One source, two consumers, so the date a
 * visitor reads and the date Google reads can never disagree.
 *
 * Prefers the real last-commit date, which is available in local dev and in
 * Vercel's Git-integration builds. Falls back to build time so a `vercel deploy`
 * from a tarball, or any checkout without git, still produces a truthful — if
 * coarser — value. Never throws: a missing date must not fail a build.
 *
 * Why this and not a git hook: `.git/hooks` is not version-controlled, so a
 * pre-commit hook silently does nothing on a fresh clone or in CI and needs
 * `core.hooksPath` wiring to share. This has nothing to install, behaves
 * identically everywhere, and Vercel's Git integration is already the trigger —
 * every push to GitHub rebuilds and the date moves with it. No GitHub Action
 * required.
 */
function resolveLastUpdated(): string {
  try {
    return execSync("git log -1 --format=%cI", {
      stdio: ["ignore", "pipe", "ignore"],
    })
      .toString()
      .trim();
  } catch {
    return new Date().toISOString();
  }
}

const nextConfig: NextConfig = {
  reactStrictMode: true,
  env: { NEXT_PUBLIC_LAST_UPDATED: resolveLastUpdated() },
  images: {
    // Placeholder remote pattern — swap for the real CDN/storage host once
    // photography is available. See STRUCTURE.md § 10 (performance).
    remotePatterns: [],
  },
  /**
   * /blog became /articles during the SEO pass so the URL matches the nav label
   * and the content it holds. The site was noindex at the time, so there is no
   * accumulated ranking to preserve — these exist for anyone holding an old
   * link, and they cost six lines.
   */
  redirects: async () => [
    { source: "/blog", destination: "/articles", permanent: true },
    { source: "/blog/:slug", destination: "/articles/:slug", permanent: true },
  ],
};

export default nextConfig;
