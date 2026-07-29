const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const publicDir = path.join(__dirname, '..', 'public');
const srcImage = path.join(publicDir, 'logo-oval.png');

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

  console.log('All logo variants generated successfully!');
}

generate().catch(err => {
  console.error(err);
  process.exit(1);
});
