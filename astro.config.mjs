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
  site: 'https://www.prassanna.io',
  
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
      filter: (page) => !page.includes('/tags/'),
      customPages: [
        'https://www.prassanna.io/',
        'https://www.prassanna.io/about/',
        'https://www.prassanna.io/blog/',
        'https://www.prassanna.io/podcasts/',
        'https://www.prassanna.io/projects/',
        'https://www.prassanna.io/verses/'
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