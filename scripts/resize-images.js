/**
 * Resizes and compresses images for web use.
 *
 * Usage:
 *   npm install sharp --save-dev
 *   node scripts/resize-images.js
 *
 * Reads every .jpg/.jpeg/.png in public/tarot and public/paintings,
 * resizes anything wider than MAX_WIDTH down to MAX_WIDTH (keeping aspect
 * ratio, never upscaling smaller images), re-encodes as JPEG at QUALITY,
 * and writes the result into a sibling "-optimized" folder so your
 * original files are never touched or overwritten.
 *
 * Once you've checked the optimized versions look right, swap them in:
 * rename public/tarot -> public/tarot-original, then
 * public/tarot-optimized -> public/tarot (same for paintings).
 */

const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const MAX_WIDTH = 2600;
const QUALITY = 92;

const FOLDERS = ["public/tarot", "public/paintings"];

async function processFolder(folder) {
  const srcDir = path.join(process.cwd(), folder);
  const outDir = path.join(process.cwd(), `${folder}-optimized`);

  if (!fs.existsSync(srcDir)) {
    console.log(`Skipping ${folder} (folder not found)`);
    return;
  }

  fs.mkdirSync(outDir, { recursive: true });

  const files = fs.readdirSync(srcDir).filter((f) => /\.(jpe?g|png)$/i.test(f));

  console.log(`\n${folder}: ${files.length} image(s)`);

  for (const file of files) {
    const srcPath = path.join(srcDir, file);
    const outPath = path.join(outDir, file.replace(/\.png$/i, ".jpg"));

    const beforeSize = fs.statSync(srcPath).size;

    await sharp(srcPath)
      .resize({ width: MAX_WIDTH, withoutEnlargement: true })
      .jpeg({ quality: QUALITY, mozjpeg: true })
      .toFile(outPath);

    const afterSize = fs.statSync(outPath).size;
    const savedPct = Math.round((1 - afterSize / beforeSize) * 100);

    console.log(
      `  ${file}: ${(beforeSize / 1024 / 1024).toFixed(2)}MB -> ${(
        afterSize /
        1024 /
        1024
      ).toFixed(2)}MB (${savedPct}% smaller)`,
    );
  }
}

async function main() {
  for (const folder of FOLDERS) {
    await processFolder(folder);
  }
  console.log(
    "\nDone. Check the -optimized folders, then swap them in once you're happy with quality.",
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
