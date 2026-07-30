const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const publicDir = path.join(__dirname, '..', 'public');
const appDir = path.join(__dirname, '..', 'src', 'app');
const srcImage = path.join(publicDir, 'logo-oval.png');

/**
 * Brand colors, sampled from the logo artwork itself (most frequent saturated
 * pixels), not eyeballed.
 */
const BRAND_BLUE = '#004090';

/**
 * The mascot's bounding box within the 705x354 lockup.
 *
 * Why the icons are built from the mascot rather than the whole logo: the lockup
 * is 2:1 landscape and mostly words. Letterboxed into a square favicon, the text
 * renders about nine pixels tall and becomes an illegible smear at the size a
 * browser tab actually uses. The mascot is the one element of the artwork that
 * survives being shrunk, so it carries the icon and the full lockup stays in the
 * header where it has the width to be read.
 */
const MASCOT = { left: 505, top: 55, width: 120, height: 215 };

/** Circular badge on transparent ground — the browser-tab favicon. */
async function generateFavicon() {
  const size = 512;
  const ring = 16;
  const badge = Buffer.from(
    `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">` +
      `<circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="${BRAND_BLUE}"/>` +
      `<circle cx="${size / 2}" cy="${size / 2}" r="${size / 2 - ring}" fill="#ffffff"/>` +
      `</svg>`,
  );
  // The white field is what makes the figure legible once it is 32px wide, so
  // the mascot is sized to sit inside it rather than bleed to the rim.
  const mascot = await sharp(srcImage)
    .extract(MASCOT)
    .resize(430, 430, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
    .png()
    .toBuffer();

  await sharp(badge)
    .composite([{ input: mascot, gravity: 'center' }])
    .png()
    .toFile(path.join(appDir, 'icon.png'));

  /**
   * Apple touch icon: full-bleed square, no transparency. iOS applies its own
   * corner rounding, and a transparent-cornered source renders with black
   * corners on a home screen.
   */
  const appleSize = 180;
  const appleBg = Buffer.from(
    `<svg width="${appleSize}" height="${appleSize}" viewBox="0 0 ${appleSize} ${appleSize}">` +
      `<rect width="${appleSize}" height="${appleSize}" fill="${BRAND_BLUE}"/>` +
      `<circle cx="${appleSize / 2}" cy="${appleSize / 2}" r="${appleSize / 2 - 12}" fill="#ffffff"/>` +
      `</svg>`,
  );
  const appleMascot = await sharp(srcImage)
    .extract(MASCOT)
    .resize(132, 132, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
    .png()
    .toBuffer();

  await sharp(appleBg)
    .composite([{ input: appleMascot, gravity: 'center' }])
    .flatten({ background: BRAND_BLUE })
    .png()
    .toFile(path.join(appDir, 'apple-icon.png'));

  console.log('Favicon + Apple touch icon generated from the logo mascot.');
}

async function generate() {
  const master = sharp(srcImage);
  const meta = await master.metadata();
  console.log(`Master logo dimensions: ${meta.width}x${meta.height}`);

  // Save full master as public/logo.png
  await master.toFile(path.join(publicDir, 'logo.png'));
  await master.webp({ quality: 90 }).toFile(path.join(publicDir, 'logo.webp'));
  await master.flatten({ background: { r: 255, g: 255, b: 255 } }).jpeg({ quality: 90 }).toFile(path.join(publicDir, 'logo.jpg'));

  // Widths
  const widths = [256, 384, 512];
  for (const w of widths) {
    await sharp(srcImage)
      .resize(w)
      .png()
      .toFile(path.join(publicDir, `logo-${w}.png`));

    await sharp(srcImage)
      .resize(w)
      .webp({ quality: 90 })
      .toFile(path.join(publicDir, `logo-${w}.webp`));
  }

  await generateFavicon();

  console.log('All logo variants generated successfully!');
}

generate().catch(err => {
  console.error(err);
  process.exit(1);
});
