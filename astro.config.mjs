// @ts-check
import { defineConfig } from 'astro/config';

import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import partytown from '@astrojs/partytown';
// Image optimization plugins
import { remarkImagePaths } from './src/plugins/remark-image-paths.mjs';
import { rehypeImageOptimizer } from './src/plugins/rehype-image-optimizer.mjs';

// https://astro.build/config
export default defineConfig({
  site: 'https://prassanna.io',
  
  // Force trailing slashes for consistency (prevents duplicate content)
  trailingSlash: 'always',
  
  redirects: {
    '/blog/2019-05-29-pipenv-pyenv': '/blog/pipenv-pyenv',
    '/ambi-alert': '/projects/ambi-alert',
    '/blog/ml-fragmentation-redirect': '/blog/ml-fragmentation',
    '/blog/ml-fragmentation-2': '/blog/ml-fragmentation',
    '/blog/full-stack-ml-3': '/blog/full-stack-ml',
  },
  
  integrations: [
    tailwind(),
    mdx({
      // Image optimization plugins
      remarkPlugins: [remarkImagePaths],
      rehypePlugins: [rehypeImageOptimizer],
      extendMarkdownConfig: true,
      smartypants: true,
      gfm: true,
      optimize: true,
    }), 
    sitemap({
      filter: (page) => {
        // Exclude URLs with .md or .md/ (prevents source file leaks)
        if (page.match(/\.md\/?$/)) return false;
        
        // Exclude URLs with query parameters
        if (page.includes('?')) return false;
        
        // Exclude legacy redirect source only; keep real project page indexed
        if (/^\/ambi-alert\/?$/.test(page)) return false;
        if (page.includes('/blog/2019-05-29-pipenv-pyenv/')) return false;
        if (page.includes('/blog/ml-fragmentation-redirect/')) return false;
        if (page.includes('/blog/ml-fragmentation-2/')) return false;
        if (page.includes('/blog/full-stack-ml-3/')) return false;
        
        // Exclude old date-based patterns
        if (page.match(/\/blog\/\d{4}-\d{2}-\d{2}-/)) return false;
        
        // Exclude partytown and other technical directories
        if (page.includes('~partytown')) return false;
        if (page.includes('/_astro/')) return false;
        
        // Exclude non-existent podcast episodes (if any)
        if (page.includes('/podcasts/ml-engineering-challenges') || 
            page.includes('/podcasts/deep-learning-frameworks')) return false;
            
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
        // Add required iframe attributes for accessibility compliance
        sandboxParent: 'body',
        // Configure iframe attributes
        lib: "/~partytown/",
      },
    }),
  ],
  
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
      wrap: true
    },
    // Image optimization plugins
    remarkPlugins: [remarkImagePaths],
    rehypePlugins: [rehypeImageOptimizer],
  },
  
  // Enable image optimization
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp'
    }
  }
});