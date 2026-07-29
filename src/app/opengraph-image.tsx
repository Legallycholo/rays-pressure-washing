import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { site } from "@/content/site";

/**
 * Default social card, uses the real logo lockup from `public/logo.jpg` on the
 * same hydro-mesh canvas as before so shares match the live site identity.
 */

export const alt = `${site.legalName} · ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  // The de-matted PNG, not the flattened JPEG: otherwise the lockup sits in a
  // black box on the mesh canvas.
  const logoData = await readFile(join(process.cwd(), "public/logo.png"));
  const logoSrc = `data:image/png;base64,${logoData.toString("base64")}`;

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
          backgroundImage:
            "radial-gradient(1000px 700px at 10% -10%, rgba(11,143,214,0.45), transparent), " +
            "radial-gradient(800px 600px at 95% 10%, rgba(63,224,191,0.20), transparent)",
          padding: 72,
        }}
      >
        <img
          src={logoSrc}
          alt=""
          width={760}
          height={290}
          style={{ objectFit: "contain", objectPosition: "left center" }}
        />

        <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 900 }}>
          <div style={{ fontSize: 54, fontWeight: 700, color: "#ffffff", lineHeight: 1.1 }}>
            {site.tagline}
          </div>
          <div style={{ fontSize: 28, color: "#a3c0d8" }}>
            {`${site.guarantee.title} · Free same-day quotes · ${site.serviceRegion}`}
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
