// ============================================================
// Brand Asset Generator - zero dependencies (Node core only)
// Generates all missing PNG/SVG assets referenced by the site:
//   favicons · PWA icons · apple-touch-icon · logo · og-image
// Emblem: white heart on constitution-emerald rounded tile,
//         gold accent ring - drawn analytically & antialiased.
// ============================================================
import { writeFile, mkdir } from 'fs/promises';
import { deflateSync, crc32 } from 'node:zlib';
import path from 'path';

const OUT_ICONS = path.join(process.cwd(), 'public', 'icons');
const OUT_ROOT = path.join(process.cwd(), 'public');

const EMERALD_DARK = [10, 53, 39];    // #0A3527
const EMERALD = [15, 76, 58];         // #0F4C3A
const EMERALD_LIGHT = [23, 105, 79];  // #17694F
const GOLD = [198, 158, 90];          // #C69E5A
const WHITE = [255, 255, 255];

// ---------- PNG encoder ----------
function pngChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body) >>> 0);
  return Buffer.concat([len, body, crc]);
}

function encodePNG(width, height, rgba) {
  const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;  // bit depth
  ihdr[9] = 6;  // color type RGBA
  const raw = Buffer.alloc((width * 4 + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (width * 4 + 1)] = 0; // filter: none
    rgba.copy(raw, y * (width * 4 + 1) + 1, y * width * 4, (y + 1) * width * 4);
  }
  return Buffer.concat([
    sig,
    pngChunk('IHDR', ihdr),
    pngChunk('IDAT', deflateSync(raw, { level: 9 })),
    pngChunk('IEND', Buffer.alloc(0)),
  ]);
}

// ---------- drawing helpers ----------
function clamp01(v) { return Math.max(0, Math.min(1, v)); }

function mix(c1, c2, t) {
  return [
    Math.round(c1[0] + (c2[0] - c1[0]) * t),
    Math.round(c1[1] + (c2[1] - c1[1]) * t),
    Math.round(c1[2] + (c2[2] - c1[2]) * t),
  ];
}

// Heart implicit equation: f <= 0 inside heart
function heartSDF(x, y) {
  const x2 = x * x, y2 = y * y;
  return Math.pow(x2 + y2 - 1, 3) - x2 * y2 * (y + 0.06) * 10;
}

/**
 * Render a brand tile.
 * maskable=true  -> full-bleed square background, smaller emblem (safe zone)
 */
function renderTile(size, { maskable = false } = {}) {
  const px = Buffer.alloc(size * size * 4);
  const SS = 2; // 2x2 supersampling
  const r = size / 2;
  const corner = size * 0.22; // iOS-style rounding for non-maskable

  const heartScale = maskable ? size * 0.26 : size * 0.30;

  const roundedAlpha = (x, y) => {
    if (maskable) return 255;
    // rounded rect coverage
    const cx = Math.min(Math.max(x, corner), size - corner);
    const cy = Math.min(Math.max(y, corner), size - corner);
    const d = Math.hypot(x - cx, y - cy);
    return d <= corner ? 255 : Math.round(255 * clamp01(corner - d + 0.5));
  };

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let aSum = 0, rSum = 0, gSum = 0, bSum = 0;
      for (let sy = 0; sy < SS; sy++) {
        for (let sx = 0; sx < SS; sx++) {
          const fx = x + (sx + 0.5) / SS;
          const fy = y + (sy + 0.5) / SS;

          // diagonal emerald gradient background
          const gT = clamp01(((fx / size) * 0.55 + (fy / size) * 0.75));
          let col = mix(mix(EMERALD_LIGHT, EMERALD, gT), EMERALD_DARK, gT * gT * 0.6);

          // subtle gold ring accent behind heart
          const dxr = fx - r, dyr = fy - r;
          const dist = Math.hypot(dxr, dyr);
          const ringR = heartScale * 1.62;
          const ringW = size * 0.018;
          const ringEdge = Math.abs(dist - ringR);
          if (ringEdge < ringW) {
            const rt = clamp01((ringW - ringEdge) / ringW) * 0.5;
            col = mix(col, GOLD, rt * 0.35);
          }

          // white heart (heart-space coords: roughly [-1.4..1.4])
          const hx = (fx - r) / heartScale * 1.25;
          const hy = -(fy - r * 1.02) / heartScale * 1.25;
          const d = heartSDF(hx, hy);
          const aa = 1.6 / heartScale; // ~antialias band
          const cov = clamp01((-d + aa / 2) / aa);
          if (cov > 0) col = mix(col, WHITE, cov);

          aSum += roundedAlpha(fx, fy);
          rSum += col[0]; gSum += col[1]; bSum += col[2];
        }
      }
      const n = SS * SS;
      const i = (y * size + x) * 4;
      px[i] = Math.round(rSum / n);
      px[i + 1] = Math.round(gSum / n);
      px[i + 2] = Math.round(bSum / n);
      px[i + 3] = Math.round(aSum / n);
    }
  }
  return px;
}

/** OG image 1200x630: emerald field, gold glow, centered emblem + diamond lattice */
function renderOG() {
  const W = 1200, H = 630;
  const px = Buffer.alloc(W * H * 4);
  const cx = W / 2, cy = H / 2;
  const heartScale = 118;

  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      // base diagonal gradient
      const gT = clamp01(((x / W) * 0.5 + (y / H) * 0.8));
      let col = mix(mix(EMERALD_LIGHT, EMERALD, gT), EMERALD_DARK, gT * gT);

      // soft radial gold glow behind emblem
      const dg = Math.hypot(x - cx, y - cy) / (heartScale * 3.4);
      const glow = clamp01(1 - dg) ** 2 * 0.28;
      col = mix(col, GOLD, glow);

      // islamic diamond lattice, very subtle
      const lx = (x % 90) - 45, ly = (y % 90) - 45;
      if (Math.abs(lx) + Math.abs(ly) < 14 && ((x / 90 | 0) + (y / 90 | 0)) % 2 === 0) {
        col = mix(col, GOLD, 0.05);
      }

      // thin gold frame
      const frame = Math.min(Math.min(x, W - 1 - x), Math.min(y, H - 1 - y));
      if (frame < 8 && frame >= 5) col = mix(col, GOLD, 0.65);

      // white heart emblem
      const hx = (x - cx) / heartScale * 1.25;
      const hy = -(y - cy) / heartScale * 1.25;
      const d = heartSDF(hx, hy);
      const cov = clamp01(-d * heartScale / 1.6);
      if (cov > 0) col = mix(col, WHITE, cov);

      const i = (y * W + x) * 4;
      px[i] = col[0]; px[i + 1] = col[1]; px[i + 2] = col[2]; px[i + 3] = 255;
    }
  }
  return px;
}

// ---------- SVG assets ----------
const safariPinnedSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="110" fill="#000"/>
  <g transform="translate(256 272)">
    <path transform="scale(9.5)" fill="#fff" d="M0,-11 C-3,-17 -10,-19 -13,-14 C-16,-9 -12,-3 -6,2 C-3,4.5 -1,7 0,9 C1,7 3,4.5 6,2 C12,-3 16,-9 13,-14 C10,-19 3,-17 0,-11Z"/>
  </g>
</svg>`;

async function main() {
  await mkdir(OUT_ICONS, { recursive: true });

  const jobs = [];
  const tile = (name, size, opts) =>
    jobs.push(writeFile(path.join(OUT_ROOT, name), encodePNG(size, size, renderTile(size, opts))));

  // Favicons & touch icons
  tile('favicon-16x16.png', 16);
  tile('favicon-32x32.png', 32);
  tile('icons/apple-touch-icon.png', 180);

  // Logo referenced by JSON-LD
  tile('logo.png', 512);

  // PWA icons (real PNGs, maskable-safe variant)
  tile('icons/pwa-192x192.png', 192);
  tile('icons/pwa-512x512.png', 512);
  tile('icons/pwa-512x512-maskable.png', 512, { maskable: true });

  jobs.push(writeFile(path.join(OUT_ROOT, 'og-image.png'),
    encodePNG(1200, 630, renderOG())));

  jobs.push(writeFile(path.join(OUT_ICONS, 'safari-pinned-tab.svg'), safariPinnedSVG));

  await Promise.all(jobs);
  console.log('✓ generated:', jobs.length, 'brand assets');
}

main().catch((e) => { console.error(e); process.exit(1); });
