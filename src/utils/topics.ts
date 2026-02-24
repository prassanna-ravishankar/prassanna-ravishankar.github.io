import { getCollection } from 'astro:content';

export async function getQualifyingTopics(minPosts = 2): Promise<Set<string>> {
  const [allPosts, allProjects] = await Promise.all([
    getCollection('blog', ({ data }) => import.meta.env.PROD ? !data.draft : true),
    getCollection('projects', ({ data }) => import.meta.env.PROD ? !data.draft : true),
  ]);
  const counts = new Map<string, number>();
  for (const item of [...allPosts, ...allProjects]) {
    for (const topic of item.data.topics ?? []) {
      counts.set(topic, (counts.get(topic) ?? 0) + 1);
    }
  }
  return new Set(
    Array.from(counts.entries()).filter(([, c]) => c >= minPosts).map(([t]) => t)
  );
}
