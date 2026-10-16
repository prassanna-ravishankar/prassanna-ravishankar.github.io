// Smaller webp copies of each blog hero, generated into public/ by scripts/hero-variants.mjs.
// The original stays the canonical file (OG image, RSS, image search).
import fs from 'node:fs';
import sharp from 'sharp';

const HERO_WIDTHS = [480, 800];

export const heroVariant = (src, width) => src.replace(/\.[a-z]+$/i, `-${width}w.webp`);

// Dimensions of the original plus the variant widths smaller than it; null if the file is missing.
export async function heroInfo(src) {
  if (!fs.existsSync(`public${src}`)) return null;
  const { width, height } = await sharp(`public${src}`).metadata();
  return { width, height, widths: HERO_WIDTHS.filter((w) => w < width) };
}

export function heroSrcset(src, { width, widths }) {
  return [...widths.map((w) => `${heroVariant(src, w)} ${w}w`), `${src} ${width}w`].join(', ');
}
