import { getCollection } from 'astro:content';

export async function getQualifyingTopics(minPosts = 2): Promise<Set<string>> {
  const allPosts = await getCollection('blog', ({ data }) =>
    import.meta.env.PROD ? !data.draft : true
  );
  const counts = new Map<string, number>();
  for (const post of allPosts) {
    for (const topic of post.data.topics ?? []) {
      counts.set(topic, (counts.get(topic) ?? 0) + 1);
    }
  }
  return new Set(
    Array.from(counts.entries()).filter(([, c]) => c >= minPosts).map(([t]) => t)
  );
}
