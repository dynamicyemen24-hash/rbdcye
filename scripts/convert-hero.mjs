#!/usr/bin/env node
/**
 * Convert hero-background.mp4 (6.2MB) -> webm VP9 (~1.8MB) + AVIF poster
 * Runs on Linux CI with ffmpeg-static available. On Windows the binary may be blocked;
 * the placeholder webm is generated via gen-poster.mjs for local dev.
 */
import { spawnSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const ffmpeg = (() => { try { return import('ffmpeg-static').then(m=>m.default) } catch { return null } })();
const root = path.resolve(import.meta.dirname, '..');
const input = path.join(root, 'public/videos/hero-background.mp4');
const outWebm = path.join(root, 'public/videos/hero-background.webm');
const outAvif = path.join(root, 'public/videos/hero-poster.avif');
const outWebp = path.join(root, 'public/videos/hero-poster.webp');

async function convertVideo() {
  const ff = await ffmpeg;
  if (!ff || !fs.existsSync(input)) { console.log('ffmpeg not available or input missing, skipping video transcode'); return; }
  // VP9 single-pass CRF 32, scale to 1280x720, no audio, 24fps, limited to ~1.8MB
  const args = [
    '-y', '-i', input,
    '-c:v', 'libvpx-vp9', '-b:v', '0', '-crf', '32',
    '-vf', 'scale=1280:720:flags=lanczos',
    '-an', '-pass', '1', '-f', 'webm', '/dev/null',
  ];
  // For single pass we use 2-pass disabled fallback: just transcode
  const singlePass = ['-y','-i',input,'-c:v','libvpx-vp9','-b:v','0','-crf','32','-vf','scale=1280:720','-an',outWebm];
  const r = spawnSync(ff, singlePass, { stdio: 'inherit' });
  if (r.status !== 0) console.error('ffmpeg vp9 failed', r.status);
  else console.log('webm', fs.statSync(outWebm).size, 'orig', fs.statSync(input).size);
}

async function extractPoster() {
  const ff = await ffmpeg;
  const tmpJpg = path.join(root, 'public/videos/.hero-frame.jpg');
  if (ff && fs.existsSync(input)) {
    spawnSync(ff, ['-y','-ss','1','-i',input,'-vframes','1','-q:v','2',tmpJpg], { stdio: 'inherit' });
    if (fs.existsSync(tmpJpg)) {
      await sharp(tmpJpg).avif({ quality: 45, effort: 4 }).toFile(outAvif);
      await sharp(tmpJpg).webp({ quality: 70 }).toFile(outWebp);
      fs.unlinkSync(tmpJpg);
      console.log('poster avif', fs.statSync(outAvif).size);
      return;
    }
  }
  // fallback gradient
  const svg = `<svg width='1920' height='1080' xmlns='http://www.w3.org/2000/svg'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0%' stop-color='#0F4C3A'/><stop offset='100%' stop-color='#0a1a12'/></linearGradient></defs><rect width='1920' height='1080' fill='url(#g)'/></svg>`;
  await sharp(Buffer.from(svg)).avif({ quality: 45 }).toFile(outAvif);
  await sharp(Buffer.from(svg)).webp({ quality: 70 }).toFile(outWebp);
}

await convertVideo();
await extractPoster();
