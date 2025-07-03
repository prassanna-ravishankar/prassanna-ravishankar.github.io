import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const posts = await getCollection('blog', ({ data }) => {
    return import.meta.env.PROD ? !data.draft : true;
  });

  const sortedPosts = posts.sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
  );

  return rss({
    title: 'Prassanna Ravishankar - Blog',
    description: 'Latest articles on Machine Learning, AI, and Technology by Prassanna Ravishankar',
    site: context.site ?? 'https://prassanna.io',
    items: sortedPosts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      link: `/blog/${post.slug}/`,
      categories: post.data.tags,
      author: 'prassanna.ravishankar@gmail.com (Prassanna Ravishankar)',
    })),
    customData: `<language>en-us</language>`,
  });
} 