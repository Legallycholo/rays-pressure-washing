import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    // Placeholder remote pattern — swap for the real CDN/storage host once
    // photography is available. See STRUCTURE.md § 10 (performance).
    remotePatterns: [],
  },
};

export default nextConfig;
