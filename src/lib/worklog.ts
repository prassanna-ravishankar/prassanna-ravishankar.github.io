import { getCollection } from 'astro:content';
import { getRepos, repoNameFromUrl } from './github';
import type { LogEntry, ProjectRow } from './worklog-types';

const notDraft = ({ data }: { data: { draft?: boolean } }) => (import.meta.env.PROD ? !data.draft : true);
const iso = (d: Date) => d.toISOString().slice(0, 10);

/** "01:04:32" → "1 h 04 min", "48:01" → "48 min" */
function formatDuration(d?: string) {
  if (!d) return null;
  const parts = d.split(':').map(Number);
  if (parts.length === 3) return parts[0] ? `${parts[0]} h ${String(parts[1]).padStart(2, '0')} min` : `${parts[1]} min`;
  if (parts.length === 2) return `${parts[0]} min`;
  return d;
}

/** First sentence, cut before a " - " aside, with a full stop. */
const firstSentence = (s: string) => {
  const m = s.match(/^(.+?[.!?])(\s|$)/);
  let out = (m ? m[1] : s).split(/\s[-–—]\s/)[0].trim();
  if (!/[.!?]$/.test(out)) out += '.';
  return out;
};

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const sameThing = (repo: string, title: string) => {
  const a = slugify(repo), b = slugify(title);
  return a.startsWith(b) || b.startsWith(a);
};

export async function getLogEntries(): Promise<LogEntry[]> {
  const [posts, verses, episodes, { repos }] = await Promise.all([
    getCollection('blog', notDraft),
    getCollection('verses', notDraft),
    getCollection('podcasts', notDraft),
    getRepos(),
  ]);

  const entries: LogEntry[] = [];
  for (const p of posts) {
    entries.push({ date: iso(p.data.pubDate), kind: 'essay', title: p.data.title, href: `/blog/${p.slug}/`, detail: p.data.series?.[0] ?? null });
  }
  for (const v of verses) {
    entries.push({ date: iso(v.data.pubDate), kind: 'poem', title: v.data.title, href: `/verses/${v.slug}/` });
  }
  for (const e of episodes) {
    const slug = e.id.split('/').pop()!.replace(/\.mdx?$/, '');
    entries.push({ date: iso(e.data.pubDate), kind: 'episode', title: e.data.title.replace(/\s*\p{Extended_Pictographic}+\s*/gu, ' ').trim(), href: `/podcasts/${slug}/`, detail: ['Feed Forward', formatDuration(e.data.duration)].filter(Boolean).join(', ') });
  }

  // Link a push to its project page when one exists, otherwise to the repo.
  const projects = await getCollection('projects', notDraft);
  const projectByRepo = new Map(projects.map((p) => [repoNameFromUrl(p.data.github)?.toLowerCase(), p]));
  for (const r of repos.slice(0, 40)) {
    const project = projectByRepo.get(r.name.toLowerCase());
    entries.push({
      date: r.pushedAt,
      kind: 'pushed',
      title: r.name,
      href: project ? `/projects/${project.slug}/` : r.url,
      external: !project,
      detail: r.description ? firstSentence(r.description) : project ? firstSentence(project.data.description) : null,
    });
  }
  return entries;
}

const LANGS: Record<string, string> = { python: 'Python', javascript: 'JavaScript', typescript: 'TypeScript', go: 'Go', rust: 'Rust', 'c++': 'C++' };

export async function getProjectRows(): Promise<ProjectRow[]> {
  const [projects, { repos }] = await Promise.all([getCollection('projects', notDraft), getRepos()]);
  const repoByName = new Map(repos.map((r) => [r.name.toLowerCase(), r]));
  return projects
    .map((p) => {
      const repoName = repoNameFromUrl(p.data.github);
      const repo = repoName ? repoByName.get(repoName.toLowerCase()) : undefined;
      const tagLang = p.data.tags.map((t) => LANGS[t.toLowerCase()]).find(Boolean) ?? null;
      return {
        // Built things are named as published: the repo name, unless the repo was named something else entirely.
        name: repoName && sameThing(repoName, p.data.title) ? repoName : p.data.title,
        href: `/projects/${p.slug}/`,
        summary: firstSentence(p.data.description),
        language: repo?.language ?? tagLang,
        lastPush: repo?.pushedAt ?? null,
        since: String(p.data.pubDate.getFullYear()),
      };
    })
    .sort((a, b) => ((a.lastPush ?? '') < (b.lastPush ?? '') ? 1 : -1));
}
