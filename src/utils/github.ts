// Build-time GitHub activity for the log and the projects table.
// Fails soft: any API error yields empty data and a warning, never a broken build.
// Uses GITHUB_TOKEN when present (set in the Pages workflow) for a higher rate limit.

const OWNER = 'prassanna-ravishankar';
const EXCLUDE = new Set([`${OWNER}.github.io`, OWNER]);
const RELEASE_WINDOW_DAYS = 365;

export interface Repo {
  name: string;
  url: string;
  description: string | null;
  language: string | null;
  pushedAt: string; // ISO date, yyyy-mm-dd
  createdAt: string;
}

export interface Release {
  repo: string;
  tag: string;
  url: string;
  publishedAt: string;
}

async function api<T>(path: string): Promise<T> {
  const token = process.env.GITHUB_TOKEN;
  const res = await fetch(`https://api.github.com${path}`, {
    headers: {
      Accept: 'application/vnd.github+json',
      'User-Agent': 'prassanna.io-build',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  if (!res.ok) throw new Error(`GitHub ${path}: ${res.status} ${res.statusText}`);
  return res.json() as Promise<T>;
}

const day = (iso: string) => iso.slice(0, 10);

async function fetchRepos(): Promise<Repo[]> {
  const repos: Repo[] = [];
  for (let page = 1; page <= 5; page++) {
    const batch = await api<any[]>(`/users/${OWNER}/repos?type=owner&sort=pushed&per_page=100&page=${page}`);
    for (const r of batch) {
      if (r.fork || r.private || EXCLUDE.has(r.name) || r.name.startsWith('homebrew-')) continue;
      repos.push({
        name: r.name,
        url: r.html_url,
        description: r.description,
        language: r.language,
        pushedAt: day(r.pushed_at),
        createdAt: day(r.created_at),
      });
    }
    if (batch.length < 100) break;
  }
  return repos;
}

async function fetchReleases(repos: Repo[]): Promise<Release[]> {
  const cutoff = new Date(Date.now() - RELEASE_WINDOW_DAYS * 86400000).toISOString().slice(0, 10);
  const recent = repos.filter((r) => r.pushedAt >= cutoff);
  const lists = await Promise.all(
    recent.map((r) =>
      api<any[]>(`/repos/${OWNER}/${r.name}/releases?per_page=10`)
        .then((rels) =>
          rels
            .filter((x) => !x.draft && !x.prerelease && x.published_at)
            .map((x) => ({ repo: r.name, tag: x.tag_name, url: x.html_url, publishedAt: day(x.published_at) })),
        )
        .catch(() => [] as Release[]),
    ),
  );
  return lists.flat();
}

let cached: Promise<{ repos: Repo[]; releases: Release[] }> | undefined;

export function getGitHubActivity() {
  cached ??= (async () => {
    try {
      const repos = await fetchRepos();
      return { repos, releases: await fetchReleases(repos) };
    } catch (err) {
      console.warn(`[github] activity unavailable, building without it: ${(err as Error).message}`);
      return { repos: [], releases: [] };
    }
  })();
  return cached;
}
