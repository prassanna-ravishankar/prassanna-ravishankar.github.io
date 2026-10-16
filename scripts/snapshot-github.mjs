// Refreshes src/data/github-snapshot.json, the fallback the work log uses when the
// GitHub API can't be reached at build time. Run: GITHUB_TOKEN=... npm run snapshot:github
import { writeFileSync } from 'node:fs';

const user = 'prassanna-ravishankar';
const token = process.env.GITHUB_TOKEN;
const res = await fetch(`https://api.github.com/users/${user}/repos?per_page=100&type=owner&sort=pushed`, {
  headers: { Accept: 'application/vnd.github+json', 'User-Agent': 'prassanna.io-snapshot', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
});
if (!res.ok) throw new Error(`GitHub API ${res.status}: ${await res.text()}`);
const repos = (await res.json())
  .filter((r) => !r.private)
  .map(({ name, html_url, description, language, pushed_at, fork, archived }) => ({ name, html_url, description, language, pushed_at, fork, archived }));
writeFileSync(
  new URL('../src/data/github-snapshot.json', import.meta.url),
  JSON.stringify({ _note: 'Fallback used when the GitHub API is unreachable at build time (e.g. local builds without GITHUB_TOKEN). CI fetches live data. Refresh with: npm run snapshot:github', generated_at: new Date().toISOString(), repos }, null, 2) + '\n',
);
console.log(`Wrote ${repos.length} repos`);
