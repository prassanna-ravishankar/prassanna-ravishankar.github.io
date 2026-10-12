// The work log: everything made, dated. Built things come from the GitHub API, written things from content collections.
import { getCollection } from 'astro:content';
import { podcasts } from '../data/podcasts.js';
import { getGitHubActivity, type Repo } from './github';

export const BUILT_KINDS = ['pushed', 'release', 'project'] as const;
export const WRITTEN_KINDS = ['essay', 'poem', 'episode'] as const;
export type LogKind = (typeof BUILT_KINDS)[number] | (typeof WRITTEN_KINDS)[number];

export interface LogEntry {
  date: string; // ISO yyyy-mm-dd
  kind: LogKind;
  title: string;
  href: string;
  detail?: string;
}

export interface ProjectRow {
  name: string;
  href: string;
  summary: string;
  language?: string;
  lastPush?: string;
  since: string;
}

export const LOG_FILTERS = [
  { id: 'all', label: 'all', kinds: [...BUILT_KINDS, ...WRITTEN_KINDS] },
  { id: 'built', label: 'built', kinds: [...BUILT_KINDS] },
  { id: 'essay', label: 'essays', kinds: ['essay'] },
  { id: 'poem', label: 'verse', kinds: ['poem'] },
  { id: 'episode', label: 'podcast', kinds: ['episode'] },
] as const;

const RECENT_DAYS = 30;

export const today = () => new Date().toISOString().slice(0, 10);
export const isBuilt = (kind: LogKind) => (BUILT_KINDS as readonly string[]).includes(kind);
export const isRecent = (date: string | undefined, now = today()) => {
  if (!date) return false;
  const days = (Date.parse(now) - Date.parse(date)) / 86400000;
  return days >= 0 && days <= RECENT_DAYS;
};

const iso = (d: Date) => d.toISOString().slice(0, 10);
const published = <T extends { data: { draft?: boolean } }>(e: T) => !(import.meta.env.PROD && e.data.draft);
const stripEmoji = (s: string) => s.replace(/\s*\p{Extended_Pictographic}️?/gu, '').trim();
const repoName = (url?: string) => url?.replace(/\/+$/, '').split('/').pop();

function formatDuration(hms: string) {
  const [h, m] = hms.split(':').map(Number);
  return h ? `${h} h ${String(m).padStart(2, '0')} min` : `${m} min`;
}

async function getProjects() {
  return (await getCollection('projects', published)).sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

/** Project entries joined with their GitHub repo (matched by repo URL, then by slug for renamed repos). */
export async function getProjectRows(): Promise<ProjectRow[]> {
  const [projects, { repos }] = await Promise.all([getProjects(), getGitHubActivity()]);
  const byName = new Map(repos.map((r) => [r.name.toLowerCase(), r]));
  const rows = projects.map((p) => {
    const repo: Repo | undefined = byName.get(repoName(p.data.github)?.toLowerCase() ?? '') ?? byName.get(p.slug);
    return {
      name: p.slug,
      href: `/projects/${p.slug}/`,
      summary: p.data.description,
      language: repo?.language ?? undefined,
      lastPush: repo?.pushedAt,
      since: (repo?.createdAt ?? iso(p.data.pubDate)).slice(0, 4),
    };
  });
  return rows.sort((a, b) => (b.lastPush ?? '').localeCompare(a.lastPush ?? ''));
}

export async function getLogEntries(): Promise<LogEntry[]> {
  const [posts, verses, episodes, projects, { repos, releases }] = await Promise.all([
    getCollection('blog', published),
    getCollection('verses', published),
    getCollection('podcasts', published),
    getProjects(),
    getGitHubActivity(),
  ]);

  const projectByRepo = new Map(projects.map((p) => [repoName(p.data.github)?.toLowerCase(), p]));
  const builtHref = (repo: string, fallback: string) => {
    const p = projectByRepo.get(repo.toLowerCase());
    return p ? `/projects/${p.slug}/` : fallback;
  };
  const showTitle = (id: string) => podcasts.find((s) => id.startsWith(`${s.slug}/`))?.title;

  const entries: LogEntry[] = [
    ...repos.map((r) => ({
      date: r.pushedAt,
      kind: 'pushed' as const,
      title: r.name,
      href: builtHref(r.name, r.url),
      detail: r.description ?? undefined,
    })),
    ...releases.map((r) => ({
      date: r.publishedAt,
      kind: 'release' as const,
      title: `${r.repo} ${r.tag}`,
      href: r.url,
    })),
    ...projects.map((p) => ({
      date: iso(p.data.pubDate),
      kind: 'project' as const,
      title: p.slug,
      href: `/projects/${p.slug}/`,
      detail: p.data.description,
    })),
    ...posts.map((p) => ({
      date: iso(p.data.pubDate),
      kind: 'essay' as const,
      title: p.data.title,
      href: `/blog/${p.slug}/`,
      detail: p.data.series[0],
    })),
    ...verses.map((v) => ({
      date: iso(v.data.pubDate),
      kind: 'poem' as const,
      title: v.data.title,
      href: `/verses/${v.slug}/`,
    })),
    ...episodes.map((e) => ({
      date: iso(e.data.pubDate),
      kind: 'episode' as const,
      title: stripEmoji(e.data.title),
      href: `/podcasts/${e.id.split('/').pop()!.replace(/\.mdx?$/, '')}/`,
      detail: [showTitle(e.id), formatDuration(e.data.duration)].filter(Boolean).join(', '),
    })),
  ];

  return entries.sort((a, b) => b.date.localeCompare(a.date));
}

/**
 * A short view of the log: the latest release per repo only, then the first `limit` entries of every filter,
 * so each filter can show a full page without shipping the whole log.
 */
export function logPage(all: LogEntry[], limit: number) {
  const released = new Set<string>();
  const entries = all.filter((e) => {
    if (e.kind !== 'release') return true;
    const repo = e.title.split(' ')[0];
    return !released.has(repo) && !!released.add(repo);
  });
  const keep = new Set<LogEntry>();
  for (const f of LOG_FILTERS) {
    entries.filter((e) => (f.kinds as readonly string[]).includes(e.kind)).slice(0, limit).forEach((e) => keep.add(e));
  }
  return entries.filter((e) => keep.has(e));
}
