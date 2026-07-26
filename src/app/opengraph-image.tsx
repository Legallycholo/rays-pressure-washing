import { ImageResponse } from "next/og";
import { site } from "@/content/site";

/**
 * The default social card, generated at build time from `site.ts`.
 *
 * Replaces the `/og-default.jpg` PLACEHOLDER that was referenced in
 * `layout.tsx` but never existed — every share of this site was 404ing its own
 * preview image. Drawing it from the content model instead of shipping a JPEG
 * means it can't go stale: change the business name or the region in one file
 * and the card follows.
 *
 * `next/og` ships inside Next itself, so this adds no dependency (R9). When
 * real photography exists, a shot of a finished job will out-perform any
 * typographic card — at that point drop a 1200x630 image in and delete this.
 */

export const alt = `${site.name} — pressure washing in ${site.serviceRegion}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#06131d",
          // hydro-mesh, flattened to something satori can render.
          backgroundImage:
            "radial-gradient(1000px 700px at 10% -10%, rgba(11,143,214,0.45), transparent), " +
            "radial-gradient(800px 600px at 95% 10%, rgba(63,224,191,0.20), transparent)",
          padding: 72,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 72,
              height: 72,
              borderRadius: 20,
              backgroundColor: "#0a1b28",
            }}
          >
            <svg width="40" height="40" viewBox="0 0 24 24" fill="#2ea6ef">
              <path d="M12 3s6 6.2 6 10.2A6 6 0 0 1 6 13.2C6 9.2 12 3 12 3z" />
            </svg>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 38, fontWeight: 700, color: "#ffffff" }}>{site.name}</div>
            <div style={{ fontSize: 20, fontWeight: 600, color: "#63c2fb", letterSpacing: 3 }}>
              {site.serviceRegion.toUpperCase()}
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 24,
            maxWidth: 900,
          }}
        >
          <div style={{ fontSize: 68, fontWeight: 700, color: "#ffffff", lineHeight: 1.1 }}>
            {site.tagline}
          </div>
          {/* One child, not two text nodes: satori requires an explicit
              `display` on any element with more than one child. */}
          <div style={{ fontSize: 28, color: "#a3c0d8" }}>
            {`${site.guarantee.title} · Free same-day quotes`}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          {site.credentials.slice(0, 3).map((c) => (
            <div key={c} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3fe0bf" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
                <path d="m4.5 12.5 5 5 10-11" />
              </svg>
              <span style={{ fontSize: 22, color: "#d3e2ef" }}>{c}</span>
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
