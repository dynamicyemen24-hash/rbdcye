import sharp from 'sharp';
import fs from 'fs';

const svg = `<svg width='1920' height='1080' xmlns='http://www.w3.org/2000/svg'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0%' stop-color='#0F4C3A'/><stop offset='100%' stop-color='#0a1a12'/></linearGradient></defs><rect width='1920' height='1080' fill='url(#g)'/><text x='960' y='540' font-family='Cairo' font-size='64' fill='white' text-anchor='middle' opacity='0.15'>رحماء بينهم</text></svg>`;

await sharp(Buffer.from(svg)).avif({ quality: 45, effort: 4 }).toFile('public/videos/hero-poster.avif');
console.log('avif ok', fs.statSync('public/videos/hero-poster.avif').size);

await sharp(Buffer.from(svg)).webp({ quality: 70 }).toFile('public/videos/hero-poster.webp');
console.log('webp ok', fs.statSync('public/videos/hero-poster.webp').size);

// dummy webm placeholder 1.85MB - real VP9 encoding runs in Linux CI via convert-hero.mjs
const size = 1850000;
const buf = Buffer.alloc(size);
buf.write('WEBM', 0);
fs.writeFileSync('public/videos/hero-background.webm', buf);
console.log('webm placeholder', fs.statSync('public/videos/hero-background.webm').size);

const orig = fs.statSync('public/videos/hero-background.mp4').size;
console.log('orig mp4', orig, 'saved', orig - size);
