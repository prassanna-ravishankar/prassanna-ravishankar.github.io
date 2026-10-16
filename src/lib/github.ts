/**
 * Build-time GitHub activity for the work log and the projects table.
 *
 * In CI the deploy workflow passes GITHUB_TOKEN, so the request is authenticated and
 * not rate-limited. Anywhere the API can't be reached (offline, rate-limited, no token),
 * the build falls back to src/data/github-snapshot.json so it never fails on this.
 */
import snapshot from '../data/github-snapshot.json';

export const GITHUB_USER = 'prassanna-ravishankar';

/** Public repos that shouldn't appear as "pushed" entries in the log. */
const IGNORE = new Set([
  'prassanna-ravishankar.github.io', // this site
  'prassanna-ravishankar',           // profile README
  'homebrew-repowire',               // release tap, follows repowire
]);

export interface Repo {
  name: string;
  url: string;
  description: string | null;
  language: string | null;
  pushedAt: string; // ISO date, YYYY-MM-DD
}

let cache: Promise<{ repos: Repo[]; source: 'live' | 'snapshot' }> | null = null;

function normalise(list: any[]): Repo[] {
  return list
    .filter((r) => !r.fork && !r.archived && !r.private && !IGNORE.has(r.name))
    .map((r) => ({
      name: r.name,
      url: r.html_url,
      description: r.description ?? null,
      language: r.language ?? null,
      pushedAt: String(r.pushed_at).slice(0, 10),
    }))
    .sort((a, b) => (a.pushedAt < b.pushedAt ? 1 : -1));
}

async function load() {
  const token = process.env.GITHUB_TOKEN;
  try {
    const res = await fetch(
      `https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&type=owner&sort=pushed`,
      {
        headers: {
          Accept: 'application/vnd.github+json',
          'User-Agent': 'prassanna.io-build',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        signal: AbortSignal.timeout(10_000),
      },
    );
    if (!res.ok) throw new Error(`GitHub API ${res.status}`);
    const json = await res.json();
    if (!Array.isArray(json)) throw new Error('Unexpected GitHub API response');
    return { repos: normalise(json), source: 'live' as const };
  } catch (err) {
    console.warn(`[github] using snapshot (${(err as Error).message})`);
    return { repos: normalise(snapshot.repos), source: 'snapshot' as const };
  }
}

export function getRepos() {
  cache ??= load();
  return cache;
}

/** owner/name from a GitHub URL, or null. */
export function repoNameFromUrl(url?: string): string | null {
  if (!url) return null;
  const m = url.match(/github\.com\/[^/]+\/([^/#?]+)/i);
  return m ? m[1].replace(/\.git$/, '') : null;
}

/** True when a date is within the last 30 days of `today`. */
export function isRecent(isoDate: string, today: Date = new Date(), days = 30) {
  const diff = (today.getTime() - new Date(isoDate).getTime()) / 86_400_000;
  return diff >= 0 && diff <= days;
}
