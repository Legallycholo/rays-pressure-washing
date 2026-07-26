import type { Location } from "@/content/locations";
import { site } from "@/content/site";

/**
 * Static SVG coverage map (open decision #1) — styleable, weightless, no
 * third-party JS. Deliberately schematic: a stylised region with the home
 * base at centre and cities placed by drive-time rings, not geography.
 * Swap for a real cartographic SVG when the actual service area is known.
 */
export function CoverageMap({ locations }: { locations: Location[] }) {
  // Place each city on a ring proportional to driveMinutes, spread by index.
  const cx = 200;
  const cy = 150;
  const pts = locations.map((l, i) => {
    const angle = (i / locations.length) * Math.PI * 2 - Math.PI / 2;
    const r = 24 + (l.driveMinutes / 45) * 100;
    return { l, x: cx + Math.cos(angle) * r, y: cy + Math.sin(angle) * r * 0.72 };
  });

  return (
    <svg
      viewBox="0 0 400 300"
      role="img"
      aria-label={`Service area map: ${site.name} covers ${locations.map((l) => l.city).join(", ")}`}
      className="w-full rounded-card bg-ink-800 ring-1 ring-white/10"
    >
      {/* region blob */}
      <path
        d="M55 160c-14-48 22-96 74-108s118-16 168 8 66 74 48 122-74 74-136 76-90-18-118-42-28-32-36-56z"
        fill="rgb(11 143 214 / 0.12)"
        stroke="rgb(11 143 214 / 0.35)"
        strokeWidth="1.5"
      />
      {/* drive-time rings */}
      {[45, 85, 125].map((r) => (
        <ellipse
          key={r}
          cx={cx}
          cy={cy}
          rx={r}
          ry={r * 0.72}
          fill="none"
          stroke="rgb(255 255 255 / 0.08)"
          strokeDasharray="3 5"
        />
      ))}
      {/* city pins */}
      {pts.map(({ l, x, y }) => (
        <g key={l.slug}>
          <circle cx={x} cy={y} r={l.priority ? 5 : 3.5} fill={l.priority ? "#3fe0bf" : "#63c2fb"} />
          <text
            x={x}
            y={y - 9}
            textAnchor="middle"
            fontSize="9.5"
            fontWeight="600"
            fill="rgb(255 255 255 / 0.75)"
          >
            {l.city}
          </text>
        </g>
      ))}
      {/* home base */}
      <g>
        <circle cx={cx} cy={cy} r="7" fill="#ff6a2b" />
        <circle cx={cx} cy={cy} r="12" fill="none" stroke="#ff6a2b" strokeOpacity="0.4" strokeWidth="2" />
        <text x={cx} y={cy + 24} textAnchor="middle" fontSize="9.5" fontWeight="700" fill="white">
          Home base
        </text>
      </g>
    </svg>
  );
}
