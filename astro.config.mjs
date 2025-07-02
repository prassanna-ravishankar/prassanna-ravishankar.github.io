// @ts-check
import { defineConfig } from 'astro/config';

import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import partytown from '@astrojs/partytown';
// Temporarily comment out plugin imports
// import { remarkImagePaths } from './src/plugins/remark-image-paths.mjs';
// import { rehypeImageOptimizer } from './src/plugins/rehype-image-optimizer.mjs';

// https://astro.build/config
export default defineConfig({
  site: 'https://prassanna.io',
  
  integrations: [
    tailwind(),
    mdx({
      // No custom plugins
      remarkPlugins: [],
      rehypePlugins: [],
      extendMarkdownConfig: true,
      smartypants: true,
      gfm: true,
      optimize: true,
    }), 
    sitemap({
      filter: (page) => {
        // Exclude URLs with query parameters
        if (page.includes('?')) return false;
        // Exclude old date-based patterns
        if (page.match(/\/blog\/\d{4}-\d{2}-\d{2}-/)) return false;
        // Exclude redirect pages
        if (page.includes('redirect') || page.includes('/ambi-alert/')) return false;
        // Exclude non-existent podcast episodes
        if (page.includes('/podcasts/ml-engineering-challenges') || 
            page.includes('/podcasts/deep-learning-frameworks')) return false;
        // Exclude other problematic patterns
        if (page.includes('~partytown')) return false;
        return true;
      },
      customPages: [
        'https://prassanna.io/blog/',
        'https://prassanna.io/podcasts/',
        'https://prassanna.io/projects/',
        'https://prassanna.io/verses/',
      ]
    }),
    partytown({
      config: {
        forward: ["dataLayer.push"],
      },
    }),
  ],
  
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
      wrap: true
    },
    // No custom plugins
    remarkPlugins: [],
    rehypePlugins: [],
  },
  
  // Enable image optimization
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp'
    }
  }
});