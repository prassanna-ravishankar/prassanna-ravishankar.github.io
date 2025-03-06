import { defineCollection, z } from 'astro:content';

// Define the schema for blog posts
const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.date(),
    updatedDate: z.date().optional(),
    heroImage: z.string().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

// Define the schema for verses
const versesCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    pubDate: z.date(),
    image: z.string().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

// Define the schema for projects
const projectsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    image: z.string().optional(),
    link: z.string().optional(),
    github: z.string().optional(),
    tags: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    pubDate: z.date(),
    draft: z.boolean().default(false),
  }),
});

// Define the schema for podcasts
const podcastsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.date(),
    audioFile: z.string(),
    duration: z.string(),
    episodeNumber: z.number().optional(),
    season: z.number().optional(),
    coverImage: z.string().optional(),
    externalLinks: z.object({
      spotify: z.string().optional(),
      apple: z.string().optional(),
      google: z.string().optional(),
      youtube: z.string().optional(),
    }).optional(),
    guests: z.array(z.string()).optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

// Export the collections
export const collections = {
  'blog': blogCollection,
  'verses': versesCollection,
  'projects': projectsCollection,
  'podcasts': podcastsCollection,
}; 