// Generates SEO social-share images (PNG) from SVG sources.
// og:image MUST be a raster image — Facebook/X/WhatsApp ignore SVG.
import sharp from "sharp";
import { mkdir } from "node:fs/promises";

const targets = [
  { src: "public/og-image.svg", dst: "public/og-image.png", width: 1200, height: 630 },
  { src: "public/logo.svg", dst: "public/logo.png", width: 512, height: 512 },
];

await mkdir("public", { recursive: true });

for (const { src, dst, width, height } of targets) {
  await sharp(src, { density: 300 })
    .resize(width, height, { fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 0 } })
    .png({ compressionLevel: 9, palette: true })
    .toFile(dst);
  console.log(`OK ${src} -> ${dst} (${width}x${height})`);
}
