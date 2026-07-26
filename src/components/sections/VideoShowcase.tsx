import { siteVideo, type SiteVideo } from "@/content/media";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/Button";
import { VideoPlayer } from "@/components/VideoPlayer";

/**
 * Motion proof, sitting directly after photo proof.
 *
 * Photos answer "can they get it clean". Video answers the question photos
 * can't: "what is it like having these people on my property". It is additive —
 * the hero's `BeforeAfterSlider` stays exactly where it is.
 *
 * Server component. The only client boundary is `VideoPlayer` itself.
 * `tone="ink"` keeps R3 intact between `BeforeAfterShowcase` (sand) and
 * `HowItWorks` (light), and a dark surround is the right frame for a player.
 */
export function VideoShowcase({
  video = siteVideo,
  heading,
}: {
  video?: SiteVideo;
  heading?: { eyebrow?: string; title: React.ReactNode; lede?: React.ReactNode };
}) {
  return (
    <Section tone="ink">
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="flex flex-col items-start gap-6 lg:order-2">
          <SectionHeading
            onDark
            align="left"
            {...(heading ?? {
              eyebrow: "Ninety seconds",
              title: "Watch a full job, start to finish",
              lede: "No music-video edit and no stock footage. This is one property, one crew, and the parts of the process most companies would rather you didn't see.",
            })}
          />
          <ul className="flex flex-col gap-3">
            {video.highlights.map((h) => (
              <li key={h} className="flex items-start gap-2.5 text-ink-200">
                <Icon name="check" className="mt-0.5 h-4 w-4 text-mint-400" />
                <span className="leading-relaxed">{h}</span>
              </li>
            ))}
          </ul>
          {/* onDark, never primary — the hero already owns the one Signal CTA
              in play at this point (R1/R2). */}
          <Button href="/quote" variant="onDark">
            Get My Free Quote
            <Icon name="arrow" className="h-4 w-4" />
          </Button>
        </div>

        <div className="w-full lg:order-1">
          <VideoPlayer
            variant="showcase"
            src={video.src}
            poster={video.poster}
            captionsSrc={video.captionsSrc}
            alt={video.alt}
            ratio="16/9"
            className="shadow-lift ring-1 ring-white/10"
          />
        </div>
      </div>
    </Section>
  );
}
