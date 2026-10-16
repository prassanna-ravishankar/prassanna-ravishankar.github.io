// Writes responsive webp variants of every blog heroImage into public/ (gitignored).
// Runs before dev and build; skips variants that are already up to date.
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { heroInfo, heroVariant } from '../src/utils/hero-variants.mjs';

const BLOG_DIR = 'src/content/blog';

const heroes = new Set(
  fs.readdirSync(BLOG_DIR)
    .map((file) => fs.readFileSync(path.join(BLOG_DIR, file), 'utf-8').match(/^heroImage:\s*["']?(\/[^"'\n]+)/m)?.[1])
    .filter(Boolean),
);

let written = 0;
for (const hero of heroes) {
  const src = `public${hero}`;
  for (const w of (await heroInfo(hero))?.widths ?? []) {
    const out = `public${heroVariant(hero, w)}`;
    if (fs.existsSync(out) && fs.statSync(out).mtimeMs >= fs.statSync(src).mtimeMs) continue;
    await sharp(src).resize({ width: w }).webp({ quality: 75 }).toFile(out);
    written++;
  }
}
console.log(`hero-variants: ${heroes.size} heroes, ${written} variants written`);
