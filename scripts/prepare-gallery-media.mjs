/**
 * Turns Ray's raw phone dump in /public/ray-image-assets/ into web assets in
 * /public/gallery/ and /public/video/.
 *
 * Why this exists rather than "drop the files in and reference them": the
 * originals are 4000x3000 phone photos at 3-5MB each and 1920x1080 video at
 * 8Mbps. The hero's before/after image is the homepage LCP element, so shipping
 * a 3.3MB JPEG there would undo the entire LCP budget the motion system was
 * built around. Every output here is derived, so re-running this after Ray
 * sends more photos is one command and nothing is hand-edited.
 *
 * The originals stay untouched in /public/ray-image-assets/ as the masters.
 * They are not referenced by the site and not deleted.
 *
 * Usage: node scripts/prepare-gallery-media.mjs
 */
import { execFileSync } from "node:child_process";
import { mkdirSync, existsSync, statSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const SRC = path.join(ROOT, "public/ray-image-assets");
const GALLERY = path.join(ROOT, "public/gallery");
const VIDEO = path.join(ROOT, "public/video");

/**
 * 1600px on the long edge. The widest any of these is ever laid out is the
 * homepage hero slider at ~660px CSS, so this covers a 2x display with room to
 * spare and nothing more. Both formats are emitted because `BeforeAfterSlider`
 * renders a <picture> (same pattern as Logo.tsx): WebP for anyone who takes it,
 * JPEG for anyone who doesn't.
 */
const LONG_EDGE = 1600;

/**
 * `.rotate()` with no argument applies the EXIF orientation tag and then strips
 * it. Every one of these is a portrait phone photo stored as a landscape buffer
 * plus an orientation flag — without this they all come out on their side, and
 * the bug only shows up in browsers that ignore EXIF on <img>.
 */
const base = (file) => sharp(file).rotate();

async function still(srcFile, outName, { trim = false } = {}) {
  const src = path.join(SRC, srcFile);
  if (!existsSync(src)) throw new Error(`missing source: ${srcFile}`);

  let pipeline = base(src);
  if (trim) {
    // The two commercial-walkway frames are phone SCREENSHOTS, not photos:
    // 1080x2340 with the captured image letterboxed inside near-black bars
    // (and, on the "after", an Android status bar and nav bar). `trim` walks in
    // from the edges while pixels stay within threshold of the corner colour,
    // which removes the chrome without hand-tuned crop boxes that would break
    // the moment Ray sends a shot from a different handset.
    pipeline = pipeline.trim({ threshold: 28 });
  }

  const buf = await pipeline.toBuffer();
  const meta = await sharp(buf).metadata();
  const resized = () =>
    sharp(buf).resize({
      width: meta.width >= meta.height ? LONG_EDGE : null,
      height: meta.width >= meta.height ? null : LONG_EDGE,
      withoutEnlargement: true,
    });

  await resized().webp({ quality: 78 }).toFile(path.join(GALLERY, `${outName}.webp`));
  await resized().jpeg({ quality: 80, mozjpeg: true }).toFile(path.join(GALLERY, `${outName}.jpg`));

  const kb = (f) => Math.round(statSync(path.join(GALLERY, f)).size / 1024);
  console.log(
    `  ${outName}  ${meta.width}x${meta.height} -> webp ${kb(`${outName}.webp`)}kB / jpg ${kb(`${outName}.jpg`)}kB`,
  );
}

/**
 * H.264 so it plays everywhere, CRF 26 and a 1280 cap because these are
 * 15-second gallery clips behind a poster and a click, not feature content.
 * `+faststart` moves the moov atom to the front so the first frame can render
 * before the whole file has arrived. Audio is dropped: both clips are handheld
 * outdoor footage whose only audio is wind and traffic, `VideoPlayer` renders
 * them with controls, and shipping a soundtrack nobody wants costs bytes and
 * invites an autoplay-with-sound problem later.
 */
function video(srcFile, outName) {
  const src = path.join(SRC, srcFile);
  if (!existsSync(src)) throw new Error(`missing source: ${srcFile}`);
  const out = path.join(VIDEO, `${outName}.mp4`);
  execFileSync(
    "ffmpeg",
    ["-y", "-i", src,
     // Fit inside a 1280x1280 box, preserving aspect, snapping to even
     // dimensions (H.264 4:2:0 requires them). NOT `scale=min(1280,iw):-2`:
     // both clips are portrait 1080x1920 recorded with a rotation flag, so
     // `iw` reads 1920 pre-rotation and that filter silently did nothing —
     // the "compressed" gutter clip came out at full 1080x1920 and 4.8Mbps.
     "-vf", "scale=w=1280:h=1280:force_original_aspect_ratio=decrease:force_divisible_by=2",
     "-c:v", "libx264", "-crf", "27",
     "-preset", "slow", "-profile:v", "high", "-pix_fmt", "yuv420p",
     "-movflags", "+faststart", "-an", out],
    { stdio: ["ignore", "ignore", "pipe"] },
  );
  const before = Math.round(statSync(src).size / 1024 / 1024);
  const after = Math.round(statSync(out).size / 1024 / 1024 * 10) / 10;
  console.log(`  ${outName}.mp4  ${before}MB -> ${after}MB`);
}

mkdirSync(GALLERY, { recursive: true });
mkdirSync(VIDEO, { recursive: true });

console.log("stills:");
// The one genuine same-scene before/after pair in the batch.
await still("before-1.jpg", "house-washing-vinyl-before");
await still("after-1.jpg", "house-washing-vinyl-after");
// NOT SHIPPED — `before-2.jpg` / `after-2.jpg`, the commercial walkway pair.
//
// It is a genuine same-scene before/after, but both frames are phone
// SCREENSHOTS rather than photos: letterboxed inside black bars, and the
// "after" has an Android status bar (clock, battery) and nav bar baked into
// the pixels. `trim` above removes uniform borders and cannot remove those —
// the status bar has bright icons in it, so the edge is not uniform and the
// trim stops at the wrong place, leaving the OS chrome in frame. Verified, not
// assumed: the trimmed outputs came back at 942x1256 and 995x2259, i.e. two
// different aspect ratios, which a real pair cannot have.
//
// Hand-cropping is possible but not worth it here — the underlying job is a
// night-time commercial walkway, which is off the site's residential lake-house
// positioning, and the before/after difference is mostly wet-versus-dry.
// The fix is to ask Ray for the ORIGINAL photos rather than screenshots of
// them; re-enable these two lines if they arrive.
// Poster frames for the two clips. Same house and ladder as the footage.
await still("context-shots/gutter-cleaning-ladder.jpg", "gutter-cleaning-poster");
await still("context-shots/window-cleaning-ladder.jpg", "window-cleaning-poster");

console.log("video:");
video("videos/gutter-cleaning.mp4", "gutter-cleaning");
video("videos/window-washing.mp4", "window-washing");

console.log("done");
